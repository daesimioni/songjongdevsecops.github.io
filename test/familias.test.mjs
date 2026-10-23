// Famílias do bestiário: toda forma tem família, conhecer todas rende +50% de
// dano contra a família, avisa uma vez e sobrevive ao save. Sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

const { FAMILIAS, familiaDeKind } = await import("../src/content/familias.js");
const { CREATURE_FORMS } = await import("../src/content/rpg-data.js");
const { RPG } = await import("../src/gameplay/rpg.js");
const { GROUNDS } = await import("../src/content/rpg-data.js");
const { STORAGE } = await import("../src/core/runtime-config.js");
const ground = GROUNDS.find((g) => g.id === "cs");

// ---- as famílias cobrem todas as formas, sem repetir ----
const vistos = new Set();
for (const familia of FAMILIAS) {
  assert.ok(familia.id && familia.nome && familia.desc, "família sem id, nome ou descrição");
  assert.ok(familia.kinds.length >= 3, `família ${familia.id} curta demais`);
  for (const kind of familia.kinds) {
    assert.ok(CREATURE_FORMS.includes(kind), `família ${familia.id} usa forma inexistente: ${kind}`);
    assert.equal(vistos.has(kind), false, `forma repetida entre famílias: ${kind}`);
    vistos.add(kind);
    assert.equal(familiaDeKind(kind)?.id, familia.id, "familiaDeKind não devolve a dona");
  }
}
const formasSemChefe = CREATURE_FORMS.filter((kind) => kind !== "boss");
assert.equal(vistos.size, formasSemChefe.length, "nem toda forma tem família");
for (const kind of formasSemChefe) assert.ok(vistos.has(kind), `forma sem família: ${kind}`);
assert.equal(familiaDeKind("boss"), null, "o chefe não precisa de família");
assert.equal(familiaDeKind("inexistente"), null, "forma desconhecida não pode quebrar");

// ---- antes de conhecer tudo, a família não rende ----
const avisos = [];
function novo() {
  store.clear();
  return new RPG({ getLevel: () => 1, gainXp: () => {}, toast: (msg) => avisos.push(msg), audio: {} });
}
{
  store.clear();
  avisos.length = 0;
  const rpg = novo();
  const vista = rpg.familiasView();
  assert.equal(vista.length, FAMILIAS.length, "a ficha não lista todas as famílias");
  assert.ok(vista.every((f) => f.conhecidos === 0 && f.completa === false), "família nova não pode nascer conhecida");
  assert.equal(rpg.familiaCompleta("atom"), false, "família vazia não pode dar bônus");

  const gel = FAMILIAS.find((f) => f.id === "gelatinosos");
  for (const kind of gel.kinds.slice(0, -1)) rpg.noteMonster({ kind, name: kind, tier: 1 });
  assert.equal(rpg.familiaCompleta("atom"), false, "faltando uma espécie, não pode completar");
  assert.equal(avisos.length, 0, "não pode avisar antes de completar");

  const ultima = gel.kinds[gel.kinds.length - 1];
  rpg.noteMonster({ kind: ultima, name: ultima, tier: 1 });
  assert.equal(rpg.familiaCompleta("atom"), true, "a última espécie devia completar a família");
  assert.ok(rpg.data.familias.gelatinosos > 0, "a família completada não entrou no save");
  assert.equal(avisos.length, 1, `deveria avisar uma vez, avisou ${avisos.length}`);
  assert.match(avisos[0], /Gelatinosos/, "o aviso precisa dizer a família");
  assert.match(avisos[0], /\+50%/, "o aviso precisa dizer o bônus");
  // conhecer de novo não avisa outra vez
  rpg.noteMonster({ kind: ultima, name: ultima, tier: 1 });
  assert.equal(avisos.length, 1, "a família não pode avisar duas vezes");
  assert.equal(rpg.familiasView().find((f) => f.id === "gelatinosos").completa, true);
}

// ---- o dano contra a família estudada sobe 50% ----
{
  store.clear();
  avisos.length = 0;
  const rpg = novo();
  const gel = FAMILIAS.find((f) => f.id === "gelatinosos");
  for (const kind of gel.kinds) rpg.noteMonster({ kind, name: kind, tier: 1 });
  rpg.data.hp = rpg.hpMax();
  const aberto = rpg.startDuel({ id: "familia-atom", name: "Átomo", kind: "atom", tier: 1 }, ground);
  assert.ok(aberto.ok, "duelo contra a família não abriu");
  const base = rpg.damageFor("cs");
  const c = rpg.combate;
  const ini = c.inimigos[0];
  ini.hp = 99;
  ini.hpMax = 99;
  c.eventos.length = 0;
  const levou = c.danoNoInimigo(ini, false);
  assert.equal(levou, Math.max(1, Math.round(base * 1.5)), `dano da família errado: ${levou} (base ${base})`);
  assert.ok(c.eventos.some((e) => e.tipo === "familia"), "o combate não avisou a fraqueza da família");
}

// ---- sem a família completa, o dano é o de sempre ----
{
  store.clear();
  avisos.length = 0;
  const rpg = novo();
  rpg.data.hp = rpg.hpMax();
  assert.ok(rpg.startDuel({ id: "familia-sem", name: "Átomo", kind: "atom", tier: 1 }, ground).ok);
  const base = rpg.damageFor("cs");
  const c = rpg.combate;
  const ini = c.inimigos[0];
  ini.hp = 99;
  ini.hpMax = 99;
  const levou = c.danoNoInimigo(ini, false);
  assert.equal(levou, base, "sem família completa não pode ter bônus");
}

// ---- o save guarda família válida e descarta o resto ----
{
  store.clear();
  avisos.length = 0;
  const rpg = novo();
  rpg.data.familias = { gelatinosos: Date.now(), inventada: Date.now(), alados: "ontem" };
  rpg.save();
  const outro = new RPG({ getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} });
  assert.deepEqual(Object.keys(outro.data.familias), ["gelatinosos"], "o save aceitou família inválida");
  assert.equal(outro.familiaCompleta("atom"), true, "a família salva não valeu");
}

// ---- a tela mostra a família ----
const bestiary = fs.readFileSync(new URL("../src/ui/bestiary.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../css/character.css", import.meta.url), "utf8");
assert.match(html, /id="best-familias"/, "o bestiário não tem a faixa de famílias");
assert.match(bestiary, /familiasView\?\.\(\)/, "o bestiário não lê as famílias");
assert.match(bestiary, /best-familia\$\{familia\.completa/, "a família completa não ganha estilo");
assert.match(css, /\.best-familia\.completa/, "falta o estilo da família completa");

console.log("ok famílias: 25 formas cobertas, completar rende +50% de dano, avisa uma vez e sobrevive ao save");

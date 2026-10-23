// Seis runas novas: bênção, mente, eco, punhal, corrente e lente. Cada uma muda
// uma conta do duelo e some ao usar. Roda sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

const { RPG } = await import("../src/gameplay/rpg.js");
const { ITEMS, RECIPES, TIERS, GROUNDS } = await import("../src/content/rpg-data.js");
const ground = GROUNDS.find((g) => g.id === "cs");
const opcoes = { getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} };
const NOVAS = ["runa-bencao", "runa-mente", "runa-eco", "runa-punhal", "runa-corrente", "runa-lente"];

// ---- catálogo e receita ----
assert.equal(Object.keys(ITEMS).filter((id) => id.startsWith("runa-")).length, 12, "o alvo era 12 magias");
for (const id of NOVAS) {
  assert.ok(ITEMS[id], `runa ${id} sem item`);
  assert.ok(RECIPES.some((r) => r.out === id), `runa ${id} sem receita`);
}

function dueloCom(runa, extras = {}) {
  store.clear();
  const rpg = new RPG(opcoes);
  const parceiro = extras.parceiro ? { id: "runa-parceiro", name: "Parceiro", kind: "slime", tier: 1 } : null;
  const abriu = rpg.startDuel(
    { id: `runa-main-${runa}`, name: "Alvo", kind: "atom", tier: 1 },
    ground, false, parceiro,
  );
  assert.ok(abriu.ok, `combate de ${runa} não abriu`);
  rpg.data.hp = rpg.hpMax();
  rpg.data.mana = rpg.manaMax();
  rpg.addItem(runa, 1);
  const c = rpg.combate;
  c.inimigos[0].x = c.jogador.x + 20;
  c.inimigos[0].y = c.jogador.y;
  return rpg;
}

// ---- bênção: cura e arma o escudo ----
{
  const rpg = dueloCom("runa-bencao");
  rpg.data.hp = rpg.hpMax() - 10;
  const antes = rpg.data.hp;
  const res = rpg.combate.usarMagia("runa-bencao");
  assert.ok(res.ok, "bênção não usou");
  assert.equal(rpg.data.hp, Math.min(rpg.hpMax(), antes + 8), "bênção não curou 8");
  assert.equal(rpg.combate.jogador.escudo, true, "bênção não armou o escudo");
  assert.equal(rpg.itemCount("runa-bencao"), 0, "bênção devia sumir ao usar");
}

// ---- mente: devolve mana ----
{
  const rpg = dueloCom("runa-mente");
  rpg.data.mana = 0;
  const res = rpg.combate.usarMagia("runa-mente");
  assert.ok(res.ok, "mente não usou");
  assert.equal(rpg.mana(), Math.min(rpg.manaMax(), 6), "mente não devolveu 6 de mana");
}

// ---- eco: o próximo golpe soma 2 ----
{
  const rpg = dueloCom("runa-eco");
  assert.ok(rpg.combate.usarMagia("runa-eco").ok, "eco não usou");
  assert.equal(rpg.combate.jogador.eco, 2, "eco não armou 2");
  const alvo = rpg.combate.inimigos[0];
  alvo.hp = 50;
  alvo.hpMax = 50;
  const base = rpg.damageFor("cs");
  const antes = alvo.hp;
  rpg.combate.atacar();
  assert.equal(antes - alvo.hp, base + 2, `eco não somou no golpe: ${antes - alvo.hp}`);
  assert.equal(rpg.combate.jogador.eco, 0, "o eco devia ser consumido");
}

// ---- punhal: 1 agora e +1 no próximo golpe ----
{
  const rpg = dueloCom("runa-punhal");
  const alvo = rpg.combate.inimigos[0];
  alvo.hp = 50;
  alvo.hpMax = 50;
  const antes = alvo.hp;
  assert.ok(rpg.combate.usarMagia("runa-punhal").ok, "punhal não usou");
  assert.equal(antes - alvo.hp, 1, "punhal não tirou 1 na hora");
  assert.equal(rpg.combate.jogador.eco, 1, "punhal não deixou +1 para o próximo golpe");
}

// ---- corrente: 1 no bicho e em cada parceiro ----
{
  const rpg = dueloCom("runa-corrente", { parceiro: true });
  const c = rpg.combate;
  c.inimigos[0].hp = 50;
  c.inimigos[0].hpMax = 50;
  c.inimigos[1].hp = 3;
  c.inimigos[1].hpMax = 3;
  const antesBicho = c.inimigos[0].hp;
  const antesParceiro = c.inimigos[1].hp;
  assert.ok(c.usarMagia("runa-corrente").ok, "corrente não usou");
  assert.equal(antesBicho - c.inimigos[0].hp, 1, "corrente não atingiu o bicho");
  assert.equal(antesParceiro - c.inimigos[1].hp, 1, "corrente não atingiu o parceiro");
}

// ---- lente: o próximo golpe acerta e soma 1 ----
{
  const rpg = dueloCom("runa-lente");
  const c = rpg.combate;
  assert.ok(c.usarMagia("runa-lente").ok, "lente não usou");
  assert.equal(c.jogador.lente, true, "lente não armou o golpe certeiro");
  const alvo = c.inimigos[0];
  alvo.hp = 50;
  alvo.hpMax = 50;
  const base = rpg.damageFor("cs");
  const antes = alvo.hp;
  c.atacar();
  assert.equal(antes - alvo.hp, base + 1, "lente não somou no golpe");
  assert.equal(c.jogador.lente, false, "a lente devia ser consumida");
}

// ---- sem carga e sem aprender, a runa não sai ----
{
  const rpg = dueloCom("runa-eco");
  assert.equal(rpg.combate.usarMagia("runa-lente").ok, false, "runa não aprendida não pode sair por mana");
}

// ---- no mapa a bênção cura ----
{
  store.clear();
  const rpg = new RPG(opcoes);
  rpg.data.hp = rpg.hpMax() - 10;
  rpg.addItem("runa-bencao", 1);
  const antes = rpg.data.hp;
  const res = rpg.castWorldSpell("runa-bencao");
  assert.ok(res.ok, "bênção no mapa não usou");
  assert.equal(rpg.data.hp, Math.min(rpg.hpMax(), antes + 8), "bênção no mapa não curou");
}

// ---- a tela conhece as seis ----
const duel = fs.readFileSync(new URL("../src/ui/duel.js", import.meta.url), "utf8");
const combate = fs.readFileSync(new URL("../src/gameplay/combate.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../css/combat.css", import.meta.url), "utf8");
assert.match(duel, /spellbarView/, "a tela do combate não lista as runas aprendidas");
assert.match(duel, /duel-skill/, "a tela do combate não tem botão de runa");
assert.match(combate, /usarMagia\(id\)/, "o motor do combate não usa runas");
assert.match(css, /\.duel-skill\b/, "falta o estilo do botão de runa");

console.log("ok runas novas: 12 magias, bênção/mente/eco/punhal/corrente/lente medidos no combate e sem carga não sai");

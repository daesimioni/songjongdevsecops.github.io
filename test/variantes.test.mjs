// Variantes de criatura: eco, elite e antiga trocam vida, dano, XP e material,
// decididas pelo id da caverna e da sala. Roda sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

const { VARIANTES, VARIANTE_POR_ID, varianteDe, hashVariante } = await import("../src/world/variantes.js");
const { RPG } = await import("../src/gameplay/rpg.js");
const { GROUNDS, TIERS, ITEMS } = await import("../src/content/rpg-data.js");
const ground = GROUNDS.find((g) => g.id === "cs");

// ---- a tabela é sã ----
assert.equal(new Set(VARIANTES.map((v) => v.id)).size, VARIANTES.length, "variante com id repetido");
for (const v of VARIANTES) {
  assert.ok(v.nome && v.desc, `variante ${v.id} sem nome ou descrição`);
  assert.ok(v.chance > 0, `variante ${v.id} sem chance`);
  assert.ok(v.hpMult >= 1 && v.xpMult >= 1 && v.lootMult >= 1, `variante ${v.id} com multiplicador menor que 1`);
  assert.ok(!v.prefixo || !v.sufixo, `variante ${v.id} com prefixo e sufixo juntos`);
}
const soma = VARIANTES.reduce((n, v) => n + v.chance, 0);
assert.ok(soma > 5 && soma < 50, `chance total de variante fora do razoável: ${soma}%`);

// ---- a escolha é estável e respeita a chance ----
assert.equal(varianteDe("dungeon-cs-arch:sala-1")?.id, varianteDe("dungeon-cs-arch:sala-1")?.id, "a variante precisa ser estável");
assert.equal(hashVariante("x"), hashVariante("x"), "o hash precisa ser estável");
const total = 20000;
const contagem = { nenhuma: 0 };
for (let i = 0; i < total; i++) {
  const v = varianteDe(`dungeon-teste-${i % 97}:sala-${i % 13}`);
  if (v) contagem[v.id] = (contagem[v.id] || 0) + 1;
  else contagem.nenhuma++;
}
for (const v of VARIANTES) {
  const pct = ((contagem[v.id] || 0) / total) * 100;
  assert.ok(Math.abs(pct - v.chance) < 3, `chance de ${v.id} medida em ${pct.toFixed(1)}% (esperada ${v.chance}%)`);
}
assert.ok(contagem.nenhuma / total > 0.7, "a maioria das criaturas precisa continuar comum");

// ---- efeitos no RPG ----
function novo(opcoes = {}) {
  store.clear();
  return new RPG({ getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {}, ...opcoes });
}
{
  const rpg = novo();
  const base = TIERS[1].hp;
  assert.ok(rpg.startDuel({ id: "variante-elite", name: "Átomo", kind: "atom", tier: 1, hpMult: 1.5 }, ground).ok);
  assert.equal(rpg.duel.monsterHpMax, Math.round(base * 1.5), "a vida da variante não entrou");
  rpg.flee();
}
{
  const rpg = novo();
  const base = TIERS[2].damage;
  assert.ok(rpg.startDuel({ id: "variante-dano", name: "Átomo", kind: "atom", tier: 2, danoExtra: 1 }, ground).ok);
  const semExtra = rpg.erroPrevisto({ kind: "atom", tier: 2 }, 2, 1);
  assert.equal(semExtra, rpg.danoSofrido(base), "a conta base mudou");
  assert.equal(rpg.erroPrevisto(rpg.duel.monster, 2, 1), rpg.danoSofrido(base + 1), "+1 de dano da variante não entrou");
  rpg.flee();
}
{
  const xps = [];
  const rpg = novo({ gainXp: (n) => xps.push(n) });
  const chaoComMaterial = { ...ground, material: "ferro" };
  rpg.startDuel({ id: "variante-xp", name: "Átomo", kind: "atom", tier: 1, xpMult: 2, lootMult: 2 }, chaoComMaterial);
  const xpBase = TIERS[1].xp;
  const material = rpg.itemCount("ferro");
  const r = rpg.victory(rpg.duel);
  assert.ok(r, "vitória da variante não calculou");
  assert.ok(xps.length, "a vitória não deu XP");
  assert.equal(xps[0], xpBase * 2, `XP da variante errado: ${xps[0]} (base ${xpBase})`);
  assert.ok(rpg.itemCount("ferro") >= material + 2, "o material da variante não dobrou");
  const entrada = r.loot.find((l) => l.id === "ferro");
  assert.ok(entrada && entrada.qty >= 2, "a lista de loot não dobrou o material");
  assert.ok(ITEMS.ferro, "material do chão precisa existir");
}
{
  // sem variante, nada muda
  const rpg = novo();
  rpg.startDuel({ id: "variante-comum", name: "Átomo", kind: "atom", tier: 1 }, ground);
  assert.equal(rpg.duel.monsterHpMax, TIERS[1].hp, "criatura comum não pode ter vida extra");
}

// ---- a caverna e o duelo usam a variante ----
const dungeon = fs.readFileSync(new URL("../src/app/dungeon.js", import.meta.url), "utf8");
const duel = fs.readFileSync(new URL("../src/ui/duel.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../css/combat.css", import.meta.url), "utf8");
assert.match(dungeon, /varianteDe\(`\$\{def\.id\}:\$\{plano\.room\.id\}`\)/, "a caverna não sorteia a variante pela sala");
assert.match(dungeon, /m\.variante = variante\.id/, "a criatura não guarda a variante");
assert.match(dungeon, /m\.name = `\$\{variante\.prefixo/, "o nome não ganha o prefixo/sufixo");
assert.match(duel, /VARIANTE_POR_ID\.get\(d\.monster\?\.variante\)/, "o duelo não mostra a variante");
assert.match(css, /\.duel-variant\b/, "falta o estilo da variante no duelo");

console.log("ok variantes: eco, elite e antiga com chance estável, vida/dano/XP/material aplicados e nome no duelo");

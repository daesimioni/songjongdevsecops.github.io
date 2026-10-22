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
  assert.ok(abriu.ok, `duelo de ${runa} não abriu`);
  rpg.data.hp = rpg.hpMax();
  rpg.addItem(runa, 1);
  return rpg;
}

// ---- bênção: cura e arma o escudo ----
{
  const rpg = dueloCom("runa-bencao");
  rpg.data.hp = rpg.hpMax() - 10;
  const antes = rpg.data.hp;
  const res = rpg.useItem("runa-bencao");
  assert.ok(res.ok, "bênção não usou");
  assert.equal(rpg.data.hp, Math.min(rpg.hpMax(), antes + 8), "bênção não curou 8");
  assert.equal(rpg.duel.shield, true, "bênção não armou o escudo");
  assert.equal(rpg.itemCount("runa-bencao"), 0, "bênção devia sumir ao usar");
}

// ---- mente: devolve mana ----
{
  const rpg = dueloCom("runa-mente");
  rpg.data.mana = 0;
  const res = rpg.useItem("runa-mente");
  assert.ok(res.ok, "mente não usou");
  assert.equal(rpg.mana(), Math.min(rpg.manaMax(), 6), "mente não devolveu 6 de mana");
  assert.ok(res.mana > 0, "o retorno não disse quanta mana veio");
}

// ---- eco: o próximo acerto soma 2 ----
{
  const rpg = dueloCom("runa-eco");
  assert.ok(rpg.useItem("runa-eco").ok, "eco não usou");
  assert.equal(rpg.duel.eco, 2, "eco não armou 2");
  rpg.duel.monsterHp = 50;
  rpg.duel.monsterHpMax = 50;
  const base = rpg.damageFor("cs");
  const antes = rpg.duel.monsterHp;
  rpg.answer(rpg.duel.question.answer);
  assert.equal(antes - rpg.duel.monsterHp, base + 2, `eco não somou no acerto: ${antes - rpg.duel.monsterHp}`);
  assert.equal(rpg.duel.eco, 0, "o eco devia ser consumido");
  assert.match(rpg.duel.feedback?.note || "", /eco somou/, "o feedback não avisou o eco");
}

// ---- punhal: 1 agora e +1 no próximo acerto ----
{
  const rpg = dueloCom("runa-punhal");
  rpg.duel.monsterHp = 50;
  rpg.duel.monsterHpMax = 50;
  const antes = rpg.duel.monsterHp;
  const res = rpg.useItem("runa-punhal");
  assert.ok(res.ok, "punhal não usou");
  assert.equal(antes - rpg.duel.monsterHp, 1, "punhal não tirou 1 na hora");
  assert.equal(rpg.duel.eco, 1, "punhal não deixou +1 para o próximo acerto");
}

// ---- corrente: 1 no bicho e em cada parceiro ----
{
  const rpg = dueloCom("runa-corrente", { parceiro: true });
  rpg.duel.monsterHp = 50;
  rpg.duel.monsterHpMax = 50;
  const parceiro = rpg.duel.partner;
  assert.ok(parceiro, "duelo sem parceiro");
  const antesBicho = rpg.duel.monsterHp;
  const antesParceiro = parceiro.hp;
  const res = rpg.useItem("runa-corrente");
  assert.ok(res.ok, "corrente não usou");
  assert.equal(antesBicho - rpg.duel.monsterHp, 1, "corrente não atingiu o bicho");
  assert.equal(antesParceiro - parceiro.hp, 1, "corrente não atingiu o parceiro");
}

// ---- lente: revela a certa e zera na pergunta seguinte ----
{
  const rpg = dueloCom("runa-lente");
  const res = rpg.useItem("runa-lente");
  assert.ok(res.ok, "lente não usou");
  assert.equal(rpg.duel.revelada, true, "lente não marcou a revelação");
  rpg.answer(rpg.duel.question.answer);
  rpg.next();
  assert.equal(rpg.duel.revelada, false, "a revelação devia zerar na pergunta nova");
}

// ---- sem carga e sem aprender, a runa não sai ----
{
  const rpg = dueloCom("runa-eco");
  assert.equal(rpg.castSpell("runa-lente").ok, false, "runa não aprendida não pode sair por mana");
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
const css = fs.readFileSync(new URL("../css/combat.css", import.meta.url), "utf8");
for (const id of NOVAS) assert.ok(duel.includes(`"${id}"`), `duelo sem rótulo para ${id}`);
assert.match(duel, /d\.revelada && d\.question\) hinted = d\.question\.answer/, "a lente não revela na tela");
assert.match(duel, /duel-eco/, "o eco não aparece no duelo");
assert.match(css, /\.duel-eco\b/, "falta o estilo do eco");

console.log("ok runas novas: 12 magias, bênção/mente/eco/punhal/corrente/lente com efeito medido e sem carga não sai");

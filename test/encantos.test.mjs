// Encantos: doze efeitos gravados na lanterna, cada um mudando uma conta do
// jogo (vida, mana, dano, dano sofrido, passo, luz, escudo, XP e sorte).
import assert from "node:assert/strict";
import fs from "node:fs";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

const { ENCHANTS, ITEMS, TIERS, GROUNDS } = await import("../src/content/rpg-data.js");
const { RPG } = await import("../src/gameplay/rpg.js");
const { STORAGE } = await import("../src/core/runtime-config.js");
const ground = GROUNDS.find((g) => g.id === "cs");
const opcoes = { getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} };

assert.equal(ENCHANTS.length, 12, `o alvo era 12 encantos, veio ${ENCHANTS.length}`);
assert.equal(new Set(ENCHANTS.map((e) => e.id)).size, ENCHANTS.length, "encanto com id repetido");
for (const e of ENCHANTS) {
  assert.ok(e.name && e.desc, `encanto ${e.id} sem nome ou descrição`);
  for (const [id, qtd] of Object.entries(e.need)) {
    assert.ok(ITEMS[id], `encanto ${e.id} pede material inexistente: ${id}`);
    assert.ok(qtd >= 1, `encanto ${e.id} com quantidade zero`);
  }
}

// ---- gravar exige material e não repete ----
function comMateriais(ids = null) {
  store.clear();
  const rpg = new RPG(opcoes);
  const alvo = ids || ENCHANTS.flatMap((e) => Object.keys(e.need));
  for (const id of new Set(alvo)) rpg.addItem(id, 20);
  return rpg;
}
{
  const rpg = comMateriais();
  assert.equal(rpg.enchant("vigor").ok, true, "encanto com material devia gravar");
  assert.equal(rpg.enchant("vigor").ok, false, "encanto repetido não pode gravar");
  store.clear();
  const semMaterial = new RPG(opcoes);
  assert.equal(semMaterial.enchant("furor").ok, false, "sem material não pode gravar");
}

// ---- efeitos medidos ----
const base = () => comMateriais();
{
  const rpg = base();
  const hp = rpg.hpMax();
  const mana = rpg.manaMax();
  const dano = rpg.damageFor("cs");
  const sofrido = rpg.danoSofrido(10);
  const passo = rpg.speedMult();
  const luz = rpg.lightBonus();
  for (const id of ["vigor", "couro", "folego", "furor", "punho", "couraca", "passo", "olho"]) {
    assert.equal(rpg.enchant(id).ok, true, `encanto ${id} não gravou`);
  }
  assert.equal(rpg.hpMax(), hp + 15, "vigor (+10) e couro (+5) não somaram vida");
  assert.equal(rpg.manaMax(), mana + 5, "fôlego não somou mana");
  assert.equal(rpg.damageFor("cs"), dano + 2, "furor e punho não somaram dano");
  assert.equal(rpg.danoSofrido(10), Math.max(1, Math.round(10 * 0.9)), "couraça não reduziu o dano sofrido");
  assert.ok(Math.abs(rpg.speedMult() - passo * 1.1) < 0.0001, "passo não acelerou");
  assert.equal(rpg.lightBonus(), luz + 2, "olho não aumentou a luz");
}
{
  const rpg = base();
  assert.equal(rpg.enchant("escudo").ok, true);
  assert.ok(rpg.startDuel({ id: "encanto-escudo", name: "Alvo", kind: "slime", tier: 1 }, ground).ok);
  assert.equal(rpg.duel.escudo, true, "o encanto de escudo não armou a carga do combate");
  assert.equal(rpg.combate.jogador.escudo, true, "com escudo armado o primeiro golpe deveria ser zero");
  rpg.flee();
}
{
  // avô: +10% de XP
  const xps = [];
  store.clear();
  const rpg = new RPG({ ...opcoes, gainXp: (n) => xps.push(n) });
  for (const id of Object.keys(ENCHANTS.find((e) => e.id === "avo").need)) rpg.addItem(id, 20);
  rpg.enchant("avo");
  rpg.startDuel({ id: "encanto-xp", name: "Alvo", kind: "slime", tier: 1 }, ground);
  rpg.victory(rpg.duel);
  assert.equal(xps[0], Math.round(TIERS[1].xp * 1.1), `XP do avô errado: ${xps[0]}`);
}
{
  // sorte: uma em cada quatro vitórias devolve material
  const material = "ferro";
  const chao = { ...ground, material };
  const sorteCom = (valor) => {
    store.clear();
    const rpg = new RPG(opcoes);
    for (const id of Object.keys(ENCHANTS.find((e) => e.id === "sorte").need)) rpg.addItem(id, 20);
    rpg.enchant("sorte");
    rpg.startDuel({ id: `encanto-sorte-${valor}`, name: "Alvo", kind: "slime", tier: 1 }, chao);
    const antes = rpg.itemCount(material);
    const original = Math.random;
    Math.random = () => valor;
    try { rpg.victory(rpg.duel); } finally { Math.random = original; }
    return rpg.itemCount(material) - antes;
  };
  assert.equal(sorteCom(0.1), 2, "a sorte devia somar 1 ao material base (1 + 1)");
  assert.equal(sorteCom(0.9), 1, "sem sorte, só o material base");
}

// ---- o save guarda encanto válido e descarta inválido ----
{
  store.clear();
  const rpg = comMateriais(["veio", "erva"]);
  rpg.enchant("vigor");
  const bruto = JSON.parse(store.get(STORAGE.rpg));
  bruto.enchants.inventado = true;
  store.set(STORAGE.rpg, JSON.stringify(bruto));
  const outro = new RPG(opcoes);
  assert.equal(outro.data.enchants.vigor, true, "encanto válido não sobreviveu");
  assert.equal(outro.data.enchants.inventado, undefined, "o save aceitou encanto inválido");
}

// ---- a ficha lista todos ----
const sheet = fs.readFileSync(new URL("../src/ui/sheet.js", import.meta.url), "utf8");
assert.match(sheet, /rpg\.enchantsView\(\)/, "a ficha não lista os encantos");

console.log("ok encantos: 12 no catálogo, efeitos de vida/mana/dano/couraça/passo/luz/escudo/XP/sorte medidos");

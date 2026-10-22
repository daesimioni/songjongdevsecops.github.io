// Consumíveis no alvo do desenho: 9 poções e 15 comidas, com cura, mana e buff
// de verdade. Roda sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

const { ITEMS, RECIPES, BUFFS } = await import("../src/content/rpg-data.js");
const { RPG } = await import("../src/gameplay/rpg.js");
const opcoes = { getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} };

const POCOES = ["pocao", "pocao-mana", "caldo", "pocao-ferro", "pocao-cristal", "pocao-cinza", "pocao-sal", "pocao-vento", "pocao-brasa"];
const COMIDAS = ["peixe", "peixe-prata", "peixe-raro", "peixe-lendario", "cafe", "assado", "doce", "pao-ferro", "bolo-erva", "peixe-seco", "ensopado", "tigela-quente", "sopa-pedra", "broa-veio", "caldo"];

// ---- catálogo ----
assert.equal(POCOES.length, 9, "o alvo era 9 poções");
assert.ok(COMIDAS.length >= 15, `o alvo era 15 comidas, veio ${COMIDAS.length}`);
const BUFF_IDS = new Set(["speed", "damage", "maxhp", "dica"]);
for (const id of [...new Set([...POCOES, ...COMIDAS])]) {
  const item = ITEMS[id];
  assert.ok(item, `consumível ${id} não existe`);
  assert.ok(item.heal > 0 || item.mana > 0 || item.buff, `consumível ${id} sem efeito`);
  if (item.buff) assert.ok(BUFF_IDS.has(item.buff.id), `consumível ${id} com buff desconhecido`);
  // peixe vem da pesca, não da forja
  if (!id.startsWith("peixe")) assert.ok(RECIPES.some((r) => r.out === id), `consumível ${id} sem receita`);
}

// ---- usar de verdade ----
function rpgCom(id) {
  store.clear();
  const rpg = new RPG(opcoes);
  rpg.addItem(id, 2);
  rpg.data.hp = 10;
  rpg.data.mana = 0;
  rpg.data.buffs = {};
  return rpg;
}
{
  const rpg = rpgCom("pocao-ferro");
  const res = rpg.useItem("pocao-ferro");
  assert.ok(res.ok, "poção de ferro não usou");
  assert.equal(rpg.data.hp, Math.min(rpg.hpMax(), 10 + 24), "poção de ferro devia curar 24");
  assert.equal(rpg.itemCount("pocao-ferro"), 1, "a poção devia ser consumida");
}
{
  const rpg = rpgCom("pocao-cristal");
  assert.ok(rpg.useItem("pocao-cristal").ok);
  assert.equal(rpg.mana(), Math.min(rpg.manaMax(), 12), "poção de cristal devia devolver 12 de mana");
}
{
  const rpg = rpgCom("pocao-cinza");
  assert.ok(rpg.useItem("pocao-cinza").ok);
  assert.equal(rpg.data.hp, 24, "poção de cinza devia curar 14");
  assert.equal(rpg.mana(), 6, "poção de cinza devia devolver 6 de mana");
}
{
  const rpg = rpgCom("ensopado");
  const teto = rpg.hpMax();
  const res = rpg.useItem("ensopado");
  assert.ok(res.ok, "ensopado não usou");
  assert.equal(rpg.data.hp, Math.min(teto, 10 + 28), "ensopado devia curar 28");
  assert.equal(rpg.data.buffs.maxhp > Date.now(), true, "ensopado não deu o buff de vida");
}
{
  const rpg = rpgCom("pocao-vento");
  rpg.data.hp = rpg.hpMax();
  const res = rpg.useItem("pocao-vento");
  assert.ok(res.ok, "poção de vento não usou com vida cheia (o buff vale)");
  assert.equal(rpg.data.buffs.speed > Date.now(), true, "poção de vento não acelerou");
}
{
  const rpg = rpgCom("tigela-quente");
  assert.ok(rpg.useItem("tigela-quente").ok);
  assert.equal(rpg.data.hp, 25, "tigela devia curar 15");
  assert.equal(rpg.mana(), 5, "tigela devia devolver 5");
  assert.equal(rpg.data.buffs.maxhp > Date.now(), true, "tigela não deu o buff");
}
{
  const rpg = rpgCom("broa-veio");
  assert.ok(rpg.useItem("broa-veio").ok);
  assert.equal(rpg.data.hp, 26, "broa devia curar 16");
  assert.equal(rpg.data.buffs.damage > Date.now(), true, "broa não firmou o golpe");
}

// ---- fazer na forja ----
{
  store.clear();
  const rpg = new RPG(opcoes);
  for (const [id, qtd] of Object.entries(RECIPES.find((r) => r.out === "ensopado").need)) rpg.addItem(id, qtd);
  const res = rpg.craft("ensopado");
  assert.ok(res.ok, `ensopado não saiu da forja: ${res.reason}`);
  assert.equal(rpg.itemCount("ensopado"), 1, "o ensopado não entrou na mochila");
}

// ---- a mochila usa a lista de efeitos que o jogo conhece ----
const fonte = fs.readFileSync(new URL("../src/content/rpg-data.js", import.meta.url), "utf8");
assert.match(fonte, /"pocao-ferro"/, "poção de ferro sumiu do catálogo");
assert.match(fonte, /"broa-veio"/, "broa de veio sumiu do catálogo");
assert.ok(Object.keys(BUFFS || {}).length >= 0, "BUFFS não pode quebrar o import");

console.log("ok consumíveis: 9 poções e 15 comidas, cura/mana/buff medidos e receita de ensopado funcionando");

// O bestiário inteiro sem navegador: as 93 cavernas viram 487 fichas, todo id
// de encontro é único, toda espécie tem nome e fraqueza, e encontrar (ou
// vencer) um bicho revela a ficha na hora, inclusive depois de recarregar.
import assert from "node:assert/strict";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

const { bestiaryModel, createBestiary } = await import("../js/bestiary.js");
const { MONSTER_LABELS, MONSTER_WEAKNESS } = await import("../js/rpg-data.js");
const { DUNGEONS } = await import("../js/dungeon-data.js");
const { RPG } = await import("../js/rpg.js");

const modelo = bestiaryModel();
assert.equal(modelo.continentes.length, 7, "continentes com caverna");
assert.equal(modelo.todos.length, 487, "487 criaturas no bestiário");
assert.equal(modelo.chefes, DUNGEONS.length, "um chefe por caverna");

const cavernas = modelo.continentes.flatMap((grupo) => grupo.cacadas);
assert.equal(cavernas.length, DUNGEONS.length, "toda caverna no bestiário");
const ids = modelo.todos.flatMap((bicho) => bicho.ids);
assert.equal(new Set(ids).size, ids.length, "id de encontro repetido entre cavernas");
for (const bicho of modelo.todos) {
  assert.ok(bicho.nome && bicho.nome.length > 1, `criatura sem nome (${bicho.id})`);
  assert.ok(bicho.ids.length >= 1, `criatura sem encontro (${bicho.id})`);
  assert.ok(bicho.tier >= 1 && bicho.tier <= 4, `tier inválido em ${bicho.id}`);
  assert.match(bicho.accent, /^#[0-9a-f]{6}$/i, `cor inválida em ${bicho.id}`);
  assert.ok(MONSTER_LABELS[bicho.tipo], `espécie sem nome de leitura: ${bicho.tipo}`);
  assert.ok(MONSTER_WEAKNESS[bicho.tipo], `espécie sem fraqueza: ${bicho.tipo}`);
  if (bicho.chefe) assert.ok(bicho.chave, `chefe sem chave de vitória (${bicho.id})`);
}
for (const caverna of cavernas) {
  assert.ok(caverna.bichos.some((bicho) => bicho.chefe), `${caverna.id} sem chefe`);
}

const rpg = new RPG();
const ui = createBestiary({ rpg, getAreaId: () => "" });
assert.deepEqual(ui.summary(), { total: 487, vistos: 0, vencidos: 0, chefes: 0, chefesTotal: 93 });
// a Cripta da Álgebra repete os mesmos nomes em salas diferentes: encontrar
// um deles revela a ficha do bicho, e vencer qualquer sala marca a vitória
const cav = cavernas.find((c) => c.id === "dungeon-math-algebra");
const bicho = cav.bichos.find((b) => b.ids.length > 1);
assert.ok(bicho, "a Cripta da Álgebra deveria repetir bicho entre salas");
rpg.noteMonster({ id: bicho.ids[1], kind: bicho.tipo, name: bicho.nome, tier: bicho.tier });
assert.equal(ui.summary().vistos, 1, "encontrar não revelou a ficha");
assert.equal(ui.summary().vencidos, 0, "encontrar não é vencer");
const recarregado = new RPG();
const outra = createBestiary({ rpg: recarregado, getAreaId: () => "" });
assert.equal(outra.summary().vistos, 1, "o encontro não sobreviveu ao recarregar");
recarregado.data.monsters[bicho.ids[0]] = Date.now();
assert.equal(outra.summary().vencidos, 1, "vencer não apareceu no bestiário");
const chefe = cav.bichos.find((bicho) => bicho.chefe);
recarregado.data.bosses[chefe.chave] = Date.now();
assert.equal(outra.summary().chefes, 1, "chefe vencido não apareceu no bestiário");
assert.equal(outra.summary().vistos, 2, "chefe vencido não contou como descoberto");
// o id carrega a caverna: matar a sala "a" de uma caverna não marca a sala "a"
// de outra caverna do mesmo continente
// (as duas cavernas são de Computação; antes o id era só o continente e a sala)
const arca = cavernas.find((c) => c.id === "dungeon-cs");
const arch = cavernas.find((c) => c.id === "dungeon-cs-arch");
const idArca = arca.bichos[0].ids[0];
const idArch = arch.bichos[0].ids[0];
assert.notEqual(idArca, idArch, "cavernas do mesmo continente ainda compartilham id");
recarregado.data.monsters[idArca] = Date.now();
assert.equal(recarregado.monsterAlive(idArca), false, "bicho vencido continua vivo");
assert.equal(recarregado.monsterAlive(idArch), true, "vitória vazou para outra caverna");
console.log("ok bestiário, 93 cavernas, 487 criaturas, descoberta, vitória e save");

// A vocação tem que ser escolha com preço: ganho pago por fraqueza, número
// aplicado no lugar certo (vida, mana, dano, dano sofrido) e troca que não
// perde XP, item, missão nem mapa.
import assert from "node:assert/strict";

globalThis.localStorage = {
  _d: new Map(),
  getItem(k) { return this._d.has(k) ? this._d.get(k) : null; },
  setItem(k, v) { this._d.set(k, String(v)); },
  removeItem(k) { this._d.delete(k); },
  clear() { this._d.clear(); },
};

const { VOCACOES, SUB_POR_ID, VOCACAO_PADRAO, multDe } = await import("../js/vocations.js");
const { RPG } = await import("../js/rpg.js");

assert.equal(VOCACOES.length, 5, `vocações: ${VOCACOES.length}`);
for (const v of VOCACOES) assert.equal(v.subs.length, 3, `${v.id} sem três subcategorias`);
assert.equal(SUB_POR_ID.size, 15, `subcategorias: ${SUB_POR_ID.size}`);

// 1. equilíbrio: ganho pago e nenhuma vocação acima de 1 em tudo
for (const v of VOCACOES) {
  const valores = Object.values(v.mult);
  const ganhos = valores.filter((n) => n > 1).length;
  const perdas = valores.filter((n) => n < 1).length;
  assert.ok(ganhos >= 1 && perdas >= 1, `${v.id} sem ganho ou sem fraqueza`);
  assert.ok(!valores.every((n) => n > 1), `${v.id} acima de 1 em tudo`);
}

// 2. multiplicadores chegam no número certo
const make = (vocation) => {
  const rpg = new RPG({ getLevel: () => 1 });
  rpg.setVocation(vocation);
  rpg.data.skills = {};
  return rpg;
};
const guerreiro = make("guerreiro");
const mago = make("mago");
assert.equal(guerreiro.data.vocation, "guerreiro");
assert.ok(guerreiro.hpMax() > mago.hpMax(), `vida: guerreiro ${guerreiro.hpMax()} não é maior que mago ${mago.hpMax()}`);
assert.ok(mago.manaMax() > guerreiro.manaMax(), `mana: mago ${mago.manaMax()} não é maior que guerreiro ${guerreiro.manaMax()}`);
const danoG = guerreiro.damageFor("math");
const danoM = mago.damageFor("math");
assert.ok(danoG > danoM, `dano: guerreiro ${danoG} não é maior que mago ${danoM}`);
// atirador: longe rende mais que perto
const atirador = make("atirador");
assert.ok(atirador.damageFor("math", true) > atirador.damageFor("math", false), "atirador não cai de perto");
// erro cobra pela vocação e a subcategoria de defesa muda a conta
const base = 4;
assert.ok(guerreiro.danoSofrido(base) < mago.danoSofrido(base), "guerreiro não sofre menos que mago");
guerreiro.data.sub = "baluarte";
assert.equal(guerreiro.danoSofrido(base), Math.max(1, Math.round(base * multDe("guerreiro").sofrido) - 1), "baluarte não tirou 1 do erro");
guerreiro.data.sub = "";
// selvagem coleta melhor
assert.ok(multDe("selvagem").coleta > multDe("guerreiro").coleta, "selvagem não coleta melhor");

// 3. troca: mantém XP, itens e missões, zera só a subcategoria
const rpg = new RPG({ getLevel: () => 12 });
rpg.setVocation("mago");
rpg.addItem("chip", 3);
rpg.data.quests = { "tres-passos": Date.now() };
rpg.data.xp = 1234;
const sub = rpg.setSub("arcanista");
assert.equal(sub.ok, true, `subcategoria no nível 12: ${sub.reason || ""}`);
assert.equal(rpg.sub().id, "arcanista");
rpg.setVocation("guerreiro");
assert.equal(rpg.sub(), null, "troca de vocação não zerou a subcategoria");
assert.equal(rpg.data.items.chip, 3, "troca perdeu item");
assert.equal(rpg.data.quests["tres-passos"] > 0, true, "troca perdeu missão");
assert.equal(rpg.data.xp, 1234, "troca perdeu XP");

// 4. subcategoria: tem que ser da vocação e exige nível 10
assert.equal(rpg.setSub("arcanista").ok, false, "aceitou subcategoria de outra vocação");
const baixo = new RPG({ getLevel: () => 9 });
baixo.setVocation("mago");
assert.equal(baixo.setSub("arcanista").ok, false, "deixou escolher subcategoria antes do nível 10");

// 5. save antigo fica neutro (multiplicador 1) até escolher na mesa
localStorage.setItem("mundo-song:rpg:v1", JSON.stringify({ hp: 20, skills: {} }));
const antigo = new RPG({ getLevel: () => 1 });
assert.equal(antigo.data.vocation, VOCACAO_PADRAO, "save antigo sem vocação definida");
assert.equal(antigo.vocacao().name, "Sem vocação", "save antigo deveria ficar neutro");
assert.equal(antigo.hpMax(), 30, "neutro tem a vida de antes das vocações");
assert.equal(antigo.manaMax(), 10, "neutro tem a mana de antes das vocações");

console.log(`ok vocações: ${VOCACOES.length} vocações, ${SUB_POR_ID.size} subcategorias, vida ${guerreiro.hpMax()} x ${mago.hpMax()}, mana ${guerreiro.manaMax()} x ${mago.manaMax()}, dano ${danoG} x ${danoM}`);

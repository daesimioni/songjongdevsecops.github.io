// A dica da biblioteca mudou de casa: ela risca duas alternativas erradas da
// próxima pergunta da coleta e some do save. Roda sem navegador.
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
const rpg = new RPG({ getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} });
const pergunta = {
  q: "Qual é o próximo passo?",
  options: ["A", "B", "C", "D", "E"],
  answer: 2,
  area: "logic",
  tier: 1,
};

assert.deepEqual(rpg.dicaGuardadaNaPergunta(pergunta), [], "sem dica guardada não pode riscar");

rpg.data.buffs.dica = Date.now() + 60000;
const riscadas = rpg.dicaGuardadaNaPergunta(pergunta);
assert.equal(riscadas.length, 2, `a dica devia riscar duas, riscou ${riscadas.length}`);
assert.ok(riscadas.every((i) => i !== pergunta.answer), "a dica riscou a resposta certa");
assert.equal(new Set(riscadas).size, riscadas.length, "a dica repetiu alternativa");
assert.equal(rpg.data.buffs.dica, undefined, "a dica guardada não foi gasta");
assert.deepEqual(rpg.dicaGuardadaNaPergunta(pergunta), [], "a dica não pode valer duas vezes");

rpg.data.buffs.dica = Date.now() - 1000;
assert.deepEqual(rpg.dicaGuardadaNaPergunta(pergunta), [], "dica vencida não pode riscar");

const gather = fs.readFileSync(new URL("../src/ui/gather.js", import.meta.url), "utf8");
const rpgFonte = fs.readFileSync(new URL("../src/gameplay/rpg.js", import.meta.url), "utf8");
assert.match(gather, /dicaGuardadaNaPergunta/, "a coleta não usa a dica da biblioteca");
assert.match(gather, /eliminada/, "a coleta não mostra a alternativa riscada");
assert.ok(!/usarDica\(/.test(rpgFonte), "a dica em escada do duelo antigo ainda existe");
assert.ok(!/aplicarDicaGuardada/.test(rpgFonte), "a dica do duelo antigo ainda existe");
console.log("ok dica: biblioteca risca duas erradas da coleta, gasta uma vez e vence");

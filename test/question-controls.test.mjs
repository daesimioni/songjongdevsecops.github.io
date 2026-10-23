// Controles da pergunta que sobrou: a coleta. Entrada inválida, foco no
// feedback, avanço e a segunda pergunta. Roda com DOM mínimo, sem browser.
import assert from "node:assert/strict";
import { makeDocument } from "./ui-dom.mjs";

const ids = ["gather-kicker", "gather-title", "gather-sub", "gather-body"];
const { document } = makeDocument(ids);
globalThis.document = document;
globalThis.localStorage = { getItem: () => null, setItem() {} };
const { createGather } = await import("../src/ui/gather.js");

let skills = 0;
let itens = 0;
const questions = [
  { q: "Primeira?", options: ["A", "B", "C", "D", "E"], answer: 0, tier: 3, why: "Porque sim" },
  { q: "Segunda?", options: ["A", "B", "C", "D", "E"], answer: 1, tier: 3, why: "Porque sim" },
];
const gather = createGather({
  rpg: {
    duelDeck: () => questions,
    buildDeck: () => questions,
    dicaGuardadaNaPergunta: () => [],
    registrarConceito() {},
    registrarDistrator() {},
    addSkillXp() { skills++; },
    addItem() { itens++; },
    save() {},
  },
  toast() {},
  audio: {},
});
gather.open({ kind: "vein", continent: "cs", reward: { resource: "ferro", qty: 2, tier: 3, grade: "lendario", rounds: 2 } });

for (const invalido of [undefined, null, NaN, -1, 5, "0", 0.5]) gather.answer(invalido);
assert.equal(skills, 0);
assert.equal(itens, 0);
assert.equal(document.getElementById("gather-body").querySelector(".duel-next"), null, "entrada inválida não encerra a coleta");

gather.answer(0);
assert.equal(skills, 1, "pergunta válida ainda pode ser respondida");
assert.equal(document.activeElement.className, "duel-next", "o feedback recebe foco");
gather.advance();
assert.equal(document.activeElement.className, "duel-option", "a segunda pergunta recebe foco");
gather.answer(1);
assert.equal(itens, 1, "as duas certas entregam a recompensa");
assert.equal(document.activeElement.className, "duel-next");
gather.close();

console.log("ok controles: a coleta valida entrada, foca o feedback e entrega depois das duas perguntas");

// Fazenda e cozinha usam a mesma pergunta, mas cada uma commita o próprio
// efeito: a horta colhe e a receita sai da forja só depois do acerto.
let commits = 0;
let itensAntes = itens;
const gather2 = createGather({
  rpg: {
    duelDeck: () => questions,
    buildDeck: () => questions,
    dicaGuardadaNaPergunta: () => [],
    registrarConceito() {},
    registrarDistrator() {},
    addSkillXp() {},
    addItem() { itens++; },
    save() {},
  },
  toast() {},
  audio: {},
});
for (const [kind, recurso, rotulo] of [["farm", "erva", "fazenda"], ["cook", "caldo", "culinária"]]) {
  commits = 0;
  itensAntes = itens;
  gather2.open({
    kind,
    continent: "hub",
    reward: { resource: recurso, qty: 1, tier: 1, grade: "comum" },
    commit: () => { commits++; return true; },
  });
  assert.match(document.getElementById("gather-kicker").textContent, new RegExp(rotulo), `a coleta de ${kind} não se identifica como ${rotulo}`);
  gather2.answer(0);
  assert.equal(commits, 1, `${kind}: o acerto não commitou o efeito`);
  assert.equal(itens, itensAntes + 1, `${kind}: o acerto não guardou o recurso`);
  gather2.advance();
}
console.log("ok fazenda e cozinha: a pergunta vem antes da colheita e da receita");

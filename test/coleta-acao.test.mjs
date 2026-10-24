// A coleta virou ação: o marcador corre e o jogador para na faixa. Sem pergunta,
// sem alternativa e sem voz. Roda com DOM mínimo, sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";
import { makeDocument } from "./ui-dom.mjs";

globalThis.requestAnimationFrame = () => 1;
globalThis.cancelAnimationFrame = () => {};
const ids = ["gather-kicker", "gather-title", "gather-sub", "gather-body"];
const { document } = makeDocument(ids);
globalThis.document = document;
globalThis.localStorage = { getItem: () => null, setItem() {} };
const { createGather, faixaDoTier, acertouFaixa } = await import("../src/ui/gather.js");

// A faixa estreita no difícil e larga no fácil.
assert.equal(faixaDoTier(1), 32);
assert.equal(faixaDoTier(2), 24);
assert.equal(faixaDoTier(3), 16);
assert.equal(acertouFaixa(50, 1), true);
assert.equal(acertouFaixa(66, 1), true);
assert.equal(acertouFaixa(67, 1), false);
assert.equal(acertouFaixa(60, 3), false);

let itens = 0;
let commits = 0;
const rpg = { addItem() { itens++; }, save() {} };
const gather = createGather({ rpg, audio: {}, toast() {} });

assert.equal(gather.tentar(), false, "sem coleta aberta não há golpe");
assert.equal(gather.open({
  kind: "farm",
  continent: "hub",
  reward: { resource: "erva", qty: 2, tier: 1, grade: "comum" },
  commit: () => { commits++; return true; },
}), true);
assert.equal(gather.isDone(), false);
assert.equal(gather.tentar(), true, "o marcador no centro deveria acertar a faixa larga");
assert.equal(commits, 1, "o acerto não commitou a colheita");
assert.equal(itens, 1, "o acerto não guardou o recurso");
assert.equal(gather.isDone(), true);
assert.equal(gather.tentar(), false, "o feedback travado não pode tentar de novo");
gather.advance();
assert.equal(gather.isOpen(), false, "o fechar não encerrou a coleta");

// Lendário: duas batidas seguidas, um único commit no fim.
commits = 0;
let lendarios = 0;
const gather2 = createGather({ rpg: { addItem() { lendarios++; }, save() {} }, audio: {}, toast() {} });
gather2.open({
  kind: "water",
  continent: "hub",
  reward: { resource: "peixe-raro", qty: 1, tier: 3, grade: "lendario", rounds: 2 },
  commit: () => { commits++; return true; },
});
assert.equal(gather2.tentar(), true, "primeira batida deveria acertar");
assert.equal(commits, 0, "o lendário não pode commitar na primeira batida");
gather2.advance();
assert.equal(gather2.tentar(), true, "segunda batida deveria acertar");
assert.equal(commits, 1, "o lendário não commitou no fim");
assert.equal(lendarios, 1);

// Nada de pergunta na superfície da coleta.
const gatherFonte = fs.readFileSync(new URL("../src/ui/gather.js", import.meta.url), "utf8");
assert.ok(!/duelDeck|buildDeck|lerPergunta|registrarConceito|registrarDistrator|duel-option/.test(gatherFonte), "a coleta ainda tem pergunta");
const app = fs.readFileSync(new URL("../src/app/app.js", import.meta.url), "utf8");
assert.match(app, /gatherUi\.tentar\(\)/, "o teclado não tenta o golpe");
assert.ok(!/gatherUi\.answer/.test(app), "o app ainda responde alternativa");

console.log("ok coleta de ação: marcador na faixa, duas batidas no lendário, sem pergunta");

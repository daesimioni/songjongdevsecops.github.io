// Escolha adaptativa: o baralho do duelo começa pela área de menor domínio,
// depois de garantir a revisão vencida. Roda sem navegador.
import assert from "node:assert/strict";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};
const { RPG } = await import("../src/gameplay/rpg.js");
const opcoes = { getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} };
const FUTURO = Date.now() + 86400000;

function baralho() {
  store.clear();
  const rpg = new RPG(opcoes);
  const areas = [...new Set(rpg.buildDeck("cs", [2]).map((item) => item.area).filter(Boolean))];
  assert.ok(areas.length >= 3, `poucas áreas no baralho: ${areas.length}`);
  for (const area of areas) rpg.data.conceitos[area] = { n: 5, r: 5, w: 0, due: FUTURO };
  return { rpg, areas };
}
const primeiro = (deck, area) => deck.findIndex((item) => item.area === area);

// ---- a área mais fraca vem primeiro ----
{
  const { rpg, areas } = baralho();
  const fraca = areas[0];
  const media = areas[1];
  const forte = areas[2];
  rpg.data.conceitos[fraca] = { n: 0, r: 0, w: 0, due: FUTURO };
  rpg.data.conceitos[media] = { n: 3, r: 3, w: 0, due: FUTURO };
  rpg.data.conceitos[forte] = { n: 5, r: 5, w: 0, due: FUTURO };
  const deck = rpg.duelDeck("cs", 2);
  assert.equal(deck[0].area, fraca, `o duelo devia começar na área fraca (${fraca}), começou em ${deck[0].area}`);
  assert.ok(primeiro(deck, fraca) < primeiro(deck, media), "área de domínio 0 devia vir antes da de 3");
  assert.ok(primeiro(deck, media) < primeiro(deck, forte), "domínio 3 devia vir antes de 5");
}

// ---- área nunca respondida conta como a mais fraca ----
{
  const { rpg, areas } = baralho();
  const nova = areas[0];
  for (const area of areas) rpg.data.conceitos[area] = { n: 5, r: 5, w: 0, due: FUTURO };
  delete rpg.data.conceitos[nova];
  const deck = rpg.duelDeck("cs", 2);
  assert.equal(deck[0].area, nova, `área sem domínio devia vir primeiro, veio ${deck[0].area}`);
}

// ---- a revisão vencida vem antes de tudo ----
{
  const { rpg, areas } = baralho();
  const vencida = areas[areas.length - 1];
  const fraca = areas[0];
  rpg.data.conceitos[vencida] = { n: 5, r: 5, w: 0, due: 0 };
  rpg.data.conceitos[fraca] = { n: 0, r: 0, w: 0, due: FUTURO };
  const deck = rpg.duelDeck("cs", 2);
  assert.equal(deck[0].area, vencida, `a revisão vencida devia vir primeiro, veio ${deck[0].area}`);
  assert.ok(primeiro(deck, vencida) < primeiro(deck, fraca), "vencida devia ficar antes da fraca em dia");
}

// ---- sem domínio nenhum, o baralho continua inteiro ----
{
  store.clear();
  const rpg = new RPG(opcoes);
  const deck = rpg.duelDeck("cs", 2);
  assert.ok(deck.length > 10, `baralho vazio ou curto: ${deck.length}`);
}

console.log("ok adaptativo: duelo começa na área de menor domínio, área nova conta como zero e vencida vem antes");

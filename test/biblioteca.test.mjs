// Biblioteca Afogada: sete missões encadeadas no guia, cada uma só aceita
// depois da anterior, e a sétima entrega o título que abre o acervo.
import assert from "node:assert/strict";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

const { QUESTS, Quests } = await import("../src/gameplay/quests.js");
const { SITES } = await import("../src/content/config.js");

const sete = QUESTS.filter((q) => q.id.startsWith("biblioteca-"));
assert.equal(sete.length, 7, `a corrente tem ${sete.length} missões`);
const porId = new Map(sete.map((q) => [q.id, q]));

// ---- a cadeia e os dados ----
assert.equal(porId.get("biblioteca-1")?.depois, undefined, "a primeira não espera ninguém");
for (let i = 2; i <= 7; i++) {
  assert.equal(porId.get(`biblioteca-${i}`)?.depois, `biblioteca-${i - 1}`, `biblioteca-${i} fora da cadeia`);
}
for (const q of sete) {
  assert.equal(q.npc, "guia", `${q.id} sem NPC`);
  assert.equal(q.giver, "Dona Zefa", `${q.id} sem quem entrega`);
  assert.ok(q.title && q.brief, `${q.id} sem título ou resumo`);
  assert.ok(q.reward?.xp > 0, `${q.id} sem XP`);
  assert.ok(q.reward?.item, `${q.id} sem item de recompensa`);
  assert.ok(["cards", "docks", "labs", "hunts", "bosses"].includes(q.goal.type), `${q.id} com meta ${q.goal.type}`);
}

// ---- a aceitação trava a seguinte ----
const cards = new Set();
const docks = new Set();
const bosses = {};
const quests = new Quests({
  getCards: () => cards,
  getDocks: () => docks,
  getBosses: () => bosses,
  gainXp: () => {},
});
assert.ok(quests.offersFor("guia").some((q) => q.id === "biblioteca-1"), "a primeira não é oferecida");
assert.equal(quests.accept("biblioteca-2"), false, "aceitou a segunda sem a primeira");
assert.equal(quests.accept("biblioteca-1"), true, "não aceitou a primeira");
assert.equal(quests.accept("biblioteca-2"), false, "aceitou a segunda antes de fechar a primeira");

// ---- fecha a corrente inteira ----
for (const site of SITES.slice(0, 5)) cards.add(site.post);
assert.equal(quests.complete("biblioteca-1").ok, true, "a primeira não fechou com 5 pedras");
assert.equal(quests.accept("biblioteca-2"), true);

for (const c of ["cs", "math", "physics"]) docks.add(c);
assert.equal(quests.complete("biblioteca-2").ok, true, "a segunda não fechou com 3 regiões");
assert.equal(quests.accept("biblioteca-3"), true);

quests.data.stats.hunts = 3;
assert.equal(quests.complete("biblioteca-3").ok, true, "a terceira não fechou com 3 bichos");
assert.equal(quests.accept("biblioteca-4"), true);

bosses["dungeon-cs-arch"] = Date.now();
assert.equal(quests.complete("biblioteca-4").ok, true, "a quarta não fechou com 1 chefe");
assert.equal(quests.accept("biblioteca-5"), true);

quests.data.stats.labs = ["peso", "prisma", "osciloscopio"];
assert.equal(quests.complete("biblioteca-5").ok, true, "a quinta não fechou com 3 instrumentos");
assert.equal(quests.accept("biblioteca-6"), true);

for (const c of ["chem", "music"]) docks.add(c);
assert.equal(quests.complete("biblioteca-6").ok, true, "a sexta não fechou com 5 regiões");
assert.equal(quests.accept("biblioteca-7"), true);

bosses["dungeon-math-analysis"] = Date.now();
bosses["dungeon-lingua-gramatica"] = Date.now();
const fim = quests.complete("biblioteca-7");
assert.equal(fim.ok, true, "a sétima não fechou com 3 chefes");
assert.equal(fim.title, "Guardião da Biblioteca");
assert.equal(quests.isDone("biblioteca-7"), true);

// ---- o save leva a corrente fechada ----
quests.save();
const recarregado = new Quests({ getCards: () => cards, getDocks: () => docks, getBosses: () => bosses, gainXp: () => {} });
assert.equal(recarregado.isDone("biblioteca-7"), true, "a corrente não sobreviveu à recarga");
assert.ok(recarregado.titles.includes("Guardião da Biblioteca"), "o título da biblioteca não ficou");

// ---- o guia é quem guarda a chave; a corrente não reabre ----
assert.equal(sete.every((q) => quests.isDone(q.id)), true, "alguma missão da corrente ficou aberta");
assert.equal(sete.some((q) => quests.isAccepted(q.id)), false, "a corrente voltou às aceitas");
assert.equal(quests.lockedFor("guia").some((q) => q.id.startsWith("biblioteca-")), false, "a corrente voltou às trancadas");
console.log(`ok biblioteca: ${sete.length} missões encadeadas no guia, título "${fim.title}", save e cadeia verificados`);

// Conferência mínima do que não depende do navegador: progresso das missões e
// o filtro que impede conteúdo de fora do jogo de entrar nos canais.
import assert from "node:assert/strict";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

const { Quests, QUESTS } = await import("../js/quests.js");
const { Rede } = await import("../js/nostr.js");
const { NOSTR } = await import("../js/config.js");

const quest = (id) => QUESTS.find((q) => q.id === id);
const cards = new Set();
const docks = new Set(["hub"]);
let xp = 0;
let titles = 0;
const make = () => new Quests({
  getCards: () => cards,
  getDocks: () => docks,
  gainXp: (n) => { xp += n; },
  onReady: () => { titles++; },
  onChange: () => {},
  toast: () => {},
});

store.clear();
const q = make();

// cards
assert.equal(q.accept("tres-passos"), true);
assert.deepEqual(q.progress(quest("tres-passos")), { have: 0, need: 3 });
cards.add("welcome");
cards.add("echo");
q.report("card", "welcome");
assert.equal(q.ready(quest("tres-passos")), false);
cards.add("logic");
q.report("card", "logic");
assert.equal(q.ready(quest("tres-passos")), true);
assert.equal(q.complete("tres-passos").ok, true);
assert.equal(xp, 24);
assert.equal(q.title, "Aprendiz do Porto");
assert.equal(q.isDone("tres-passos"), true);
assert.equal(q.complete("tres-passos").ok, false, "não conclui duas vezes");

// quiz
q.accept("vai-um");
assert.equal(q.answer("vai-um", 1).correct, false);
assert.equal(q.ready(quest("vai-um")), false);
assert.equal(q.answer("vai-um", 0).correct, true);
assert.equal(q.ready(quest("vai-um")), true);
assert.equal(q.complete("vai-um").ok, true);
assert.equal(q.title, "Aprendiz de Ada");
assert.equal(q.answer("vai-um", 0).already, true);

// continente
q.accept("fios-vivos");
for (const post of ["logic", "adder", "state", "cpu", "history"]) cards.add(post);
assert.deepEqual(q.progress(quest("fios-vivos")), { have: 5, need: 5 });
assert.equal(q.complete("fios-vivos").ok, true);
assert.equal(q.title, "Fios Vivos");

// social
q.accept("voz-do-mundo");
assert.deepEqual(q.progress(quest("voz-do-mundo")), { have: 0, need: 2 });
q.report("chat:public");
assert.deepEqual(q.progress(quest("voz-do-mundo")), { have: 1, need: 2 });
q.report("chat:dm");
assert.equal(q.ready(quest("voz-do-mundo")), true);

// persistência
const again = make();
assert.equal(again.isDone("tres-passos"), true);
assert.equal(again.data.stats["chat:public"], 1);

// filtro dos canais: só entra evento com os três selos
const rede = new Rede();
rede.channelCache.set("geral", new Map());
const pk = "chave-de-teste";
const tags = [
  ["t", NOSTR.namespace],
  ["t", `${NOSTR.namespace}:geral`],
  ["client", "mundo-song"],
  ["game", "mundo-song"],
];
const base = { kind: 1, id: "id1", pubkey: pk, created_at: 1, content: "oi", tags };
assert.equal(rede.acceptChannel(base, "geral"), true, "evento do jogo entra");
assert.equal(rede.acceptChannel(base, "geral"), false, "o mesmo id não entra duas vezes");
assert.equal(rede.acceptChannel({ ...base, id: "id2", tags: tags.filter((t) => t[0] !== "game") }, "geral"), false, "sem game fica fora");
assert.equal(rede.acceptChannel({ ...base, id: "id3", tags: tags.filter((t) => t[0] !== "client") }, "geral"), false, "sem client fica fora");
assert.equal(rede.acceptChannel({ ...base, id: "id4", tags: tags.filter((t) => t[1] !== `${NOSTR.namespace}:geral`) }, "geral"), false, "outro canal fica fora");
assert.equal(rede.acceptChannel({ ...base, id: "id5", kind: 0 }, "geral"), false, "outro kind fica fora");
assert.equal(rede.channelEvents("geral").length, 1);

assert.ok(titles > 0, "missão pronta avisa");
console.log("ok missões, persistência e filtro dos canais");

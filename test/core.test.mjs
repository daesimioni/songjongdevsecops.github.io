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
const { RPG } = await import("../js/rpg.js");
const { GROUNDS } = await import("../js/rpg-data.js");
const { addPeerSample, feedPeer, peerRenderPosition } = await import("../js/interp.js");

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

// caçadas
q.accept("cacador");
assert.deepEqual(q.progress(quest("cacador")), { have: 0, need: 3 });
q.report("hunts");
q.report("hunts");
assert.equal(q.ready(quest("cacador")), false);
q.report("hunts");
assert.equal(q.ready(quest("cacador")), true);
assert.equal(q.complete("cacador").ok, true);

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

// RPG: duelo, dano, vitória, alavanca e chefe
store.clear();
let xpGanho = 0;
const rpg = new RPG({
  getLevel: () => 1,
  gainXp: (n) => { xpGanho += n; },
  toast: () => {},
  audio: {},
});
const ground = GROUNDS.find((g) => g.id === "cs");
const easy = ground.monsters[0];
assert.equal(rpg.startDuel(easy, ground).ok, true);
for (let i = 0; i < 6 && rpg.duel.phase !== "victory"; i++) {
  if (rpg.duel.phase === "question") rpg.answer(rpg.duel.question.answer);
  else rpg.next();
}
assert.equal(rpg.duel.phase, "victory");
assert.equal(rpg.monsterAlive(easy.id), false);
assert.equal(rpg.inventoryList().length > 0, true);
assert.equal(rpg.hpMax(), 30, "item comum não é relíquia");
assert.equal(xpGanho > 0, true);
rpg.next();
assert.equal(rpg.duel, null);

// errar tira vida
const medium = ground.monsters[1];
rpg.startDuel(medium, ground);
const hpBefore = rpg.hp();
const wrong = (rpg.duel.question.answer + 1) % rpg.duel.question.options.length;
rpg.answer(wrong);
assert.equal(rpg.hp(), hpBefore - 3, "pergunta média tira 3 de vida");
assert.equal(rpg.duel.phase, "feedback");
rpg.flee();

// alavanca só abre com os três guardiões
assert.equal(rpg.pullLever(ground).ok, false);
for (const m of ground.monsters) rpg.data.monsters[m.id] = Date.now();
assert.equal(rpg.allMonstersDown(ground), true);
assert.equal(rpg.pullLever(ground).ok, true);
assert.equal(rpg.bossAlive(ground), true);
assert.equal(rpg.startDuel(ground.boss, ground, true).ok, true);
for (let i = 0; i < 12 && rpg.duel.phase !== "victory"; i++) {
  if (rpg.duel.phase === "question") rpg.answer(rpg.duel.question.answer);
  else rpg.next();
}
assert.equal(rpg.duel.phase, "victory");
rpg.next();
assert.equal(rpg.bossAlive(ground), false, "chefe derrotado sai do mapa");
assert.equal(rpg.hpMax(), 35, "relíquia do chefe dá +5 de vida máxima");
rpg.addItem("pocao", 1);
rpg.data.hp = 5;
const healed = rpg.useItem("pocao");
assert.equal(healed.ok, true);
assert.equal(rpg.hp(), 5 + 18, "poção cura 18");
const againRpg = new RPG({ getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} });
assert.equal(againRpg.monsterAlive(easy.id), false, "monstro derrotado persiste");
assert.equal(againRpg.inventoryList().length > 0, true, "item persiste");

// interpolação dos outros jogadores
const peer = { x: 0, y: 0, samples: [] };
for (let i = 0; i < 6; i++) addPeerSample(peer, i * 0.5, 0, 1000 + i * 100);
const at = (now) => peerRenderPosition(peer, now, 200);
assert.ok(Math.abs(at(1250).x - 0.25) < 0.001, "interpola entre duas amostras");
assert.ok(Math.abs(at(1300).x - 0.5) < 0.001);
assert.ok(Math.abs(at(1400).x - 1.0) < 0.001);
let prev = at(1200).x;
let maxStep = 0;
for (let t = 1216; t <= 1600; t += 16) {
  const cur = at(t).x;
  maxStep = Math.max(maxStep, Math.abs(cur - prev));
  prev = cur;
}
assert.ok(maxStep < 0.2, "movimento interpolado não dá pulo");
addPeerSample(peer, 40, 0, 1600);
assert.ok(Math.abs(at(1700).x - 40) < 0.001, "teleporte não desliza pelo mapa");

// sequência de rede: pacotes que chegam juntos não viram salto
const sp = { x: 0, y: 0, seq: 1 };
feedPeer(sp, 1000, 100, 200);
assert.equal(sp.samples.length, 1);
assert.ok(Math.abs(sp.samples[0].t - 800) < 0.001, "primeira amostra entra no buffer");
sp.x = 0.5; sp.seq = 2; feedPeer(sp, 1010, 100, 200);
sp.x = 1.0; sp.seq = 3; feedPeer(sp, 1020, 100, 200);
assert.deepEqual(sp.samples.map((s) => s.t), [800, 900, 1000], "amostras usam o relógio do envio");
assert.ok(Math.abs(peerRenderPosition(sp, 1100, 200).x - 0.5) < 0.001);
assert.ok(Math.abs(peerRenderPosition(sp, 1200, 200).x - 1.0) < 0.001);
sp.x = 20; sp.seq = 4; feedPeer(sp, 1300, 100, 200);
assert.ok(Math.abs(peerRenderPosition(sp, 1300, 200).x - 20) < 0.001, "teleporte com sequência nova aparece na hora");

console.log("ok missões, persistência, filtro dos canais, RPG e interpolação");

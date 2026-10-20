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
const { DUNGEONS } = await import("../js/dungeon-data.js");
const { buildDungeonMap, dungeonSolid, dungeonLineOfSight } = await import("../js/dungeon.js");
const { addPeerSample, feedPeer, peerRenderPosition } = await import("../js/interp.js");
const { createWorld } = await import("../js/world.js");
const { findPath } = await import("../js/path.js");
const { PLAYER_W, PLAYER_H, SPAWN, STORAGE } = await import("../js/config.js");

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

// horta persistida por caverna e canteiro
rpg.data.plots = { "dungeon-cs:0": { planted: true, readyAt: Date.now() + 45000 } };
rpg.save();
const plotRpg = new RPG({ getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} });
assert.equal(plotRpg.data.plots["dungeon-cs:0"]?.planted, true, "horta plantada persiste");
delete rpg.data.plots;
rpg.save();

// save corrompido não vira save vazio sem deixar cópia
const corruptKey = STORAGE.rpg;
const goodRaw = store.get(corruptKey);
store.set(corruptKey, goodRaw.slice(0, Math.max(8, goodRaw.length - 5)));
new RPG({ getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} });
assert.ok(store.get(`${corruptKey}:bak`), "save corrompido guardado em :bak");
store.set(corruptKey, goodRaw);
store.delete(`${corruptKey}:bak`);

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

// colisão de cenário: estação, spawn, monstro e chefe
const w = createWorld();
assert.equal(w.boxCollides(90, 60, PLAYER_W, PLAYER_H), true, "fonte barra passagem");
assert.equal(w.boxCollides(SPAWN.x, SPAWN.y, PLAYER_W, PLAYER_H), false, "spawn é livre");
// a superfície virou sala de aula: sem monstro solto, sem chefe, sem alavanca
assert.equal(w.monsters.length, 0, "superfície sem monstro");
assert.equal(w.hunters.every((h) => !h.boss && !(h.monsters || []).length), true, "caçada sem chefe e sem bicho");
assert.equal(w.hunters.every((h) => !h.lever), true, "superfície sem alavanca");
const instructors = w.npcs.filter((n) => n.trainer);
assert.equal(instructors.length, w.hunters.length, "um instrutor por caçada");
for (const h of w.hunters) {
  const npc = instructors.find((n) => n.continent === h.continent);
  assert.ok(npc, `instrutor de ${h.continent}`);
  assert.ok(Math.hypot(npc.x - h.center.x, npc.y - h.center.y) < 2.5, `instrutor no centro de ${h.continent}`);
  assert.equal(w.boxCollides(npc.x, npc.y, PLAYER_W, PLAYER_H), true, `instrutor de ${h.continent} ocupa espaço`);
}
assert.ok(w.props.length > 20, "props de cenário existem");
for (const stone of w.waystones) {
  const spots = [[0, 1.8], [0, -1.8], [1.8, 0], [-1.8, 0], [0, 2.6], [2.6, 0]];
  const free = spots.some(([dx, dy]) => !w.boxCollides(stone.x + dx, stone.y + dy, PLAYER_W, PLAYER_H));
  assert.equal(free, true, `viagem livre perto de ${stone.name}`);
}
// toda boca de caverna tem saída livre e caminho desde a pedra do continente
for (const cave of w.caves) {
  assert.equal(w.boxCollides(cave.exit.x, cave.exit.y, PLAYER_W, PLAYER_H), false, `saída livre em ${cave.continent}`);
  const stone = w.waystones.find((s) => s.continent === cave.continent);
  assert.ok(stone, `pedra de ${cave.continent}`);
  assert.ok(findPath(w, stone, cave.exit), `caminho até a caverna de ${cave.continent}`);
}

// a caverna: salas com chão, entrada que chega na cidade, parede que corta a vista
const dg = DUNGEONS[0];
const dmap = buildDungeonMap(dg);
for (const room of dg.rooms) {
  const cx = room.x + Math.floor(room.w / 2);
  const cy = room.y + Math.floor(room.h / 2);
  assert.equal(dungeonSolid(dmap, cx, cy), false, `sala ${room.id} tem chão`);
}
function reachable(map, from, to) {
  const seen = new Uint8Array(map.W * map.H);
  const queue = [[from.x, from.y]];
  seen[from.y * map.W + from.x] = 1;
  while (queue.length) {
    const [x, y] = queue.shift();
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx;
      const ny = y + dy;
      if (dungeonSolid(map, nx, ny)) continue;
      const i = ny * map.W + nx;
      if (seen[i]) continue;
      seen[i] = 1;
      queue.push([nx, ny]);
    }
  }
  return seen[to.y * map.W + to.x] === 1;
}
const center = (room) => ({ x: room.x + Math.floor(room.w / 2), y: room.y + Math.floor(room.h / 2) });
const entrance = dg.rooms.find((r) => r.kind === "entrance");
const city = dg.rooms.find((r) => r.kind === "city");
assert.equal(reachable(dmap, center(entrance), center(city)), true, "entrada chega à cidade");
for (const room of dg.rooms) {
  assert.equal(reachable(dmap, center(entrance), center(room)), true, `sala ${room.id} alcançável`);
}
// as cavernas espelhadas usam a mesma planta com as salas laterais trocadas
const mirrorDef = DUNGEONS.find((d) => d.continent === "math");
const mmap = buildDungeonMap(mirrorDef);
for (const room of mirrorDef.rooms) {
  assert.equal(dungeonSolid(mmap, center(room).x, center(room).y), false, `sala espelhada ${room.id} tem chão`);
}
const mirrorEntrance = center(mirrorDef.rooms.find((r) => r.kind === "entrance"));
assert.equal(
  reachable(mmap, mirrorEntrance, center(mirrorDef.rooms.find((r) => r.kind === "city"))),
  true,
  "caverna espelhada também liga entrada e cidade",
);
for (const room of mirrorDef.rooms) {
  assert.equal(reachable(mmap, mirrorEntrance, center(room)), true, `sala espelhada ${room.id} alcançável`);
}
assert.equal(dungeonLineOfSight(dmap, 3, 24, 13, 24), false, "parede corta a linha de visão");
const roomA = dg.rooms.find((r) => r.id === "a");
assert.equal(
  dungeonLineOfSight(dmap, roomA.x + 2.5, roomA.y + 3.5, roomA.x + 5.5, roomA.y + 3.5),
  true,
  "sala aberta deixa ver",
);

// o chefe da caverna não depende de alavanca, e a forja consome e devolve
assert.equal(rpg.bossAlive({ id: "dungeon-teste", dungeon: true }), true, "chefe de caverna sem alavanca");
assert.equal(rpg.bossAlive({ id: "caçada-teste" }), false, "chefe de outro tipo pede alavanca");
store.clear();
rpg.data = { hp: null, skills: {}, items: {}, monsters: {}, bosses: {}, levers: {}, enchants: {}, buffs: {}, pet: { bond: 0 } };
rpg.addItem("ferro", 2);
rpg.addItem("madeira", 1);
const made = rpg.craft("chave");
assert.equal(made.ok, true, "forja faz a chave");
assert.equal(rpg.itemCount("chave"), 1);
assert.equal(rpg.itemCount("ferro"), 0, "forja consome o ferro");
assert.equal(rpg.craft("pocao").ok, false, "sem erva não sai poção");
rpg.addItem("ferro", 1);
rpg.addItem("veio", 1);
assert.equal(rpg.craft("bomba").ok, true, "forja faz a bomba");
assert.equal(rpg.useItem("bomba").bomb, true, "bomba é item de uso");
assert.equal(rpg.itemCount("bomba"), 0, "bomba some ao usar");

// encantamento permanente, comida com efeito, bicho e pergunta do fundo
rpg.addItem("veio", 4);
rpg.addItem("erva", 4);
assert.equal(rpg.enchant("vigor").ok, true, "encanto de vigor");
assert.equal(rpg.hpMax(), 40, "vigor soma 10 de vida");
assert.equal(rpg.enchantsView().find((e) => e.id === "vigor").owned, true);
assert.equal(rpg.enchant("vigor").ok, false, "encanto não repete");
rpg.addItem("erva", 2);
rpg.addItem("veio", 1);
assert.equal(rpg.craft("doce").ok, true, "cozinha o doce");
assert.equal(rpg.useItem("doce").ok, true, "doce se usa de vida cheia");
assert.equal(rpg.buffActive("maxhp"), true, "doce dá vida extra");
assert.equal(rpg.hpMax(), 45, "buff soma 5 de vida");
rpg.addItem("racao", 3);
assert.equal(rpg.feedPet().ok, true);
assert.equal(rpg.feedPet().ok, true);
const pet = rpg.feedPet();
assert.equal(pet.tamed, true, "bicho fica manso");
assert.equal(rpg.hpMax(), 50, "bicho soma 5 de vida");
rpg.addItem("erva", 1);
rpg.addItem("pocao", 1);
assert.equal(rpg.craft("cafe").ok, true, "cozinha o café");
rpg.useItem("cafe");
assert.equal(rpg.speedMult(), 1.3, "café acelera");
const deepDeck = rpg.buildDeck("cs", [3], "algoritmos");
assert.equal(deepDeck.length, 4, "pergunta do fundo entrou no baralho");
assert.ok(deepDeck[0].q.includes("escalonador"), "tema da sala puxa a pergunta certa");

// fuga sempre arrisca, e o risco cresce com a dificuldade do bicho
const flee = (tier, boss = false) => rpg.fleeRisk({ tier, boss });
assert.ok(flee(1) > 0, "fugir do fraco ainda arrisca");
assert.ok(flee(2) > flee(1) && flee(3) > flee(2), "risco cresce por andar");
assert.ok(flee(1, true) > flee(3), "chefe é o pior para escapar");
assert.ok(flee(3, true) <= 0.9, "risco tem teto");
rpg.data.buffs = { speed: Date.now() + 60000 };
assert.ok(Math.abs(flee(3) - 0.45) < 0.001, "café ajuda a escapar");
rpg.data.buffs = {};

// dano direto da fuga: tira vida e zera no respawn
rpg.data.hp = 8;
const hit = rpg.takeDamage(5);
assert.equal(hit.lost, 5);
assert.equal(rpg.hp(), 3);
const kill = rpg.takeDamage(99);
assert.equal(kill.dead, true, "dano alto derruba");
assert.equal(rpg.hp(), rpg.hpMax(), "respawn devolve a vida");

// treino: erra sem perder vida, vence sem loot nem xp
const train = new RPG({ getLevel: () => 1, gainXp: (n) => { xpGanho += n; }, toast: () => {}, audio: {} });
assert.equal(train.startTraining("cs", 1, "fonte", { name: "Bicho de Treino" }).ok, true, "treino abre");
const hpTrain = train.hp();
const wrongTrain = (train.duel.question.answer + 1) % train.duel.question.options.length;
train.answer(wrongTrain);
assert.equal(train.hp(), hpTrain, "treino não tira vida");
assert.equal(train.duel.feedback.training, true, "feedback avisa que é treino");
for (let i = 0; i < 20 && train.duel?.phase !== "victory"; i++) {
  if (train.duel.phase === "question") train.answer(train.duel.question.answer);
  else train.next();
}
assert.equal(train.duel.phase, "victory");
const trainWin = train.next();
assert.equal(trainWin.result.training, true, "treino não distribui vitória de caçada");
assert.deepEqual(trainWin.result.loot, [], "treino não dá loot");

// duelo entre jogadores: cinco perguntas, uma por dificuldade, dano crescente
const pvpCards = rpg.pvpQuestions("cs");
assert.equal(pvpCards.length, 5, "cinco cartas de duelo");
assert.deepEqual(pvpCards.map((c) => c.difficulty), [1, 2, 3, 4, 5], "uma por dificuldade");
assert.deepEqual(pvpCards.map((c) => c.damage), [1, 2, 3, 4, 5], "dano acompanha a dificuldade");
for (const c of pvpCards) {
  assert.equal(c.options.length, 3, "três alternativas");
  assert.ok(c.answer >= 0 && c.answer < 3, "resposta dentro das alternativas");
  assert.equal(new Set(c.options).size, 3, "sem alternativa repetida");
  assert.ok(c.q.length >= 4 && c.why.length > 0, "pergunta e explicação vêm juntas");
}
const dmgBefore = pvpCards[4].damage;
rpg.addItem("amuleto", 1);
assert.ok(rpg.pvpQuestions("cs")[4].damage >= dmgBefore, "item não reduz o dano");

console.log("ok missões, persistência, canais, RPG, interpolação, colisão, caverna, treino, fuga e duelo");

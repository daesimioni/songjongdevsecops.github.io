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
const { GROUNDS, QUESTIONS } = await import("../js/rpg-data.js");
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

// trilha de área: só cartas daquela área contam
assert.equal(q.accept("trilha-math-algebra"), true);
assert.deepEqual(q.progress(quest("trilha-math-algebra")), { have: 0, need: 3 });
cards.add("math-algebra-1");
cards.add("math-algebra-2");
cards.add("math-fundamentos-1");
assert.deepEqual(q.progress(quest("trilha-math-algebra")), { have: 2, need: 3 });
cards.add("math-algebra-3");
assert.equal(q.ready(quest("trilha-math-algebra")), true);
assert.equal(q.complete("trilha-math-algebra").ok, true);

// chefe da área: o registro de chefe é do RPG, a missão lê o mesmo estado
assert.equal(q.accept("chefe-math-algebra"), true);
assert.deepEqual(q.progress(quest("chefe-math-algebra")), { have: 0, need: 1 });
q.data.bosses = { "math-algebra": Date.now() };
assert.deepEqual(q.progress(quest("chefe-math-algebra")), { have: 1, need: 1 });
assert.equal(q.ready(quest("chefe-math-algebra")), true);

// poção de mana e magia fora do duelo
const magiaRpg = new RPG({ getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} });
// mana cheia é da vocação de mana 1,00: guerreiro padrão tem 0,60
magiaRpg.setVocation("atirador");
magiaRpg.addItem("pocao-mana", 1);
magiaRpg.data.mana = 2;
const bebeu = magiaRpg.useItem("pocao-mana");
assert.equal(bebeu.ok, true);
assert.equal(bebeu.mana, 8);
assert.equal(magiaRpg.mana(), 10);
assert.equal(magiaRpg.itemCount("pocao-mana"), 0);
magiaRpg.data.spells["runa-cura"] = true;
magiaRpg.data.hp = 10;
magiaRpg.data.mana = 6;
const conjurou = magiaRpg.castWorldSpell("runa-cura");
assert.equal(conjurou.ok, true);
assert.equal(conjurou.healed, 10);
assert.equal(magiaRpg.hp(), 20);
assert.equal(magiaRpg.mana(), 3);

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
const hpAntesDoLoot = rpg.hpMax();
assert.equal(rpg.startDuel(easy, ground).ok, true);
assert.equal(rpg.duel.monsterHpMax, 3, "monstro fácil pede 3 acertos");
assert.equal(rpg.duel.question.options.length, 5, "pergunta traz cinco alternativas");
for (let i = 0; i < 20 && rpg.duel.phase !== "victory"; i++) {
  if (rpg.duel.phase === "question") rpg.answer(rpg.duel.question.answer);
  else rpg.next();
}
assert.equal(rpg.duel.phase, "victory");
assert.equal(rpg.monsterAlive(easy.id), false);
assert.equal(rpg.inventoryList().length > 0, true);
assert.equal(rpg.hpMax(), hpAntesDoLoot, "item comum não é relíquia");
assert.equal(xpGanho > 0, true);
rpg.next();
assert.equal(rpg.duel, null);

// toda pergunta do duelo vem com cinco alternativas A-E, sem repetir
for (const g of GROUNDS) {
  for (const tier of [1, 2, 3]) {
    for (const item of rpg.buildDeck(g.continent, [tier], "")) {
      assert.equal(item.options.length, 5, `pergunta de ${g.continent} tier ${tier} sem cinco alternativas`);
      assert.equal(new Set(item.options.map((o) => o.toLowerCase())).size, 5, "alternativas repetidas");
      assert.ok(item.answer >= 0 && item.answer < 5, "resposta fora das alternativas");
      assert.ok(item.options[item.answer].length > 0, "resposta vazia");
    }
  }
}

// errar tira vida
const medium = ground.monsters[1];
rpg.startDuel(medium, ground);
const hpBefore = rpg.hp();
const wrong = (rpg.duel.question.answer + 1) % rpg.duel.question.options.length;
rpg.answer(wrong);
assert.equal(rpg.hp(), hpBefore - rpg.danoSofrido(3), "pergunta média tira o dano da vocação, 3 na base");
assert.equal(rpg.duel.phase, "feedback");
rpg.flee();

// alavanca só abre com os três guardiões
assert.equal(rpg.pullLever(ground).ok, false);
for (const m of ground.monsters) rpg.data.monsters[m.id] = Date.now();
assert.equal(rpg.allMonstersDown(ground), true);
assert.equal(rpg.pullLever(ground).ok, true);
assert.equal(rpg.bossAlive(ground), true);
const hpAntesDoChefe = rpg.hpMax();
assert.equal(rpg.startDuel(ground.boss, ground, true).ok, true);
for (let i = 0; i < 60 && rpg.duel.phase !== "victory"; i++) {
  if (rpg.duel.phase === "question") rpg.answer(rpg.duel.question.answer);
  else rpg.next();
}
assert.equal(rpg.duel.phase, "victory");
rpg.next();
assert.equal(rpg.bossAlive(ground), false, "chefe derrotado sai do mapa");
assert.equal(rpg.relics(), 1, "relíquia do chefe entrou na mochila");
assert.ok(rpg.hpMax() > hpAntesDoChefe, "relíquia do chefe aumenta a vida máxima");
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

// equipar arma e armadura muda dano e vida, e persiste
const gearRpg = new RPG({ getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} });
gearRpg.addItem("chave-longa", 1);
gearRpg.addItem("colete-malha", 1);
const bareDamage = gearRpg.damageFor("cs");
const bareHp = gearRpg.hpMax();
assert.equal(gearRpg.equip("chave-longa").ok, true);
assert.equal(gearRpg.equip("colete-malha").ok, true);
assert.ok(gearRpg.damageFor("cs") > bareDamage, "arma soma dano");
assert.equal(gearRpg.hpMax(), bareHp + 5, "armadura soma vida");
const gearAgain = new RPG({ getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} });
assert.equal(gearAgain.data.equipped.weapon, "chave-longa", "arma equipada persiste");
assert.equal(gearAgain.hpMax(), bareHp + 5, "vida equipada persiste");
assert.equal(gearAgain.unequip("armor").ok, true);
assert.equal(gearAgain.hpMax(), bareHp, "tirar a armadura devolve a vida");
assert.equal(gearAgain.equip("pocao").ok, false, "poção não é equipamento");

// loja da mestra: material por peça, sem moeda e sem duplicar
const shopRpg = new RPG({ getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} });
shopRpg.addItem("ferro", 3);
shopRpg.addItem("veio", 2);
assert.equal(shopRpg.priceFor("espada-prova")?.ferro, 3, "preço da arma usa ferro");
const bought = shopRpg.buy("espada-prova");
assert.equal(bought.ok, true, "compra a arma");
assert.equal(shopRpg.itemCount("espada-prova"), 1);
assert.equal(shopRpg.itemCount("ferro"), 0, "compra desconta o ferro");
assert.equal(shopRpg.itemCount("veio"), 0, "compra desconta o veio");
assert.equal(shopRpg.buy("espada-prova").ok, false, "não compra a mesma peça duas vezes");
assert.equal(shopRpg.buy("colete-malha").ok, false, "sem material não compra");

// bestiário registra espécie, nome e contagem e persiste
const beastRpg = new RPG({ getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} });
beastRpg.noteMonster({ kind: "bat", name: "Morcego", tier: 2 });
beastRpg.noteMonster({ kind: "bat", name: "Morcego", tier: 2 });
beastRpg.noteMonster({ kind: "boss", name: "O Compilador Ancestral", tier: 4 });
const seen = beastRpg.seenView();
assert.equal(seen.find((s) => s.kind === "bat")?.count, 2, "bestiário conta encontros");
assert.equal(seen.find((s) => s.kind === "boss")?.tier, 4, "chefe entra no bestiário");
const beastAgain = new RPG({ getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} });
assert.equal(beastAgain.seenView().find((s) => s.kind === "bat")?.count, 2, "bestiário persiste");

// dupla: o segundo monstro pergunta junto e a vitória soma os dois
const duoRpg = new RPG({ getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} });
const duoGround = { id: "duo-test", continent: "cs", name: "Dupla", dungeon: true, loot: ["parafuso", "chip", "fita"], bossLoot: "nucleo", material: "ferro" };
const duoMain = { id: "duo-main", name: "Bit", kind: "slime", tier: 1, theme: "lógica" };
const duoPartner = { id: "duo-partner", name: "Olho", kind: "eye", tier: 2, theme: "memória" };
assert.equal(duoRpg.startDuel(duoMain, duoGround, false, duoPartner).ok, true);
assert.equal(duoRpg.duel.partner?.monster.id, "duo-partner", "segundo monstro entra no duelo");
assert.equal(duoRpg.duel.partner.hp, 7, "vida do segundo monstro");
const partnerQuestion = duoRpg.duel.partner.question.q;
duoRpg.answerPartner(duoRpg.duel.partner.question.answer);
assert.equal(duoRpg.duel.partner.feedback?.correct, true, "acerto no segundo monstro");
duoRpg.partnerNext();
assert.equal(!!duoRpg.duel.partner.question, true, "segunda pergunta do parceiro");
for (let i = 0; i < 40 && !duoRpg.duel.partner.done; i++) {
  const p = duoRpg.duel.partner;
  duoRpg.answerPartner(p.question.answer);
  duoRpg.partnerNext();
}
assert.equal(duoRpg.duel.partner.done, true, "segundo monstro cai");
assert.equal(duoRpg.monsterAlive("duo-partner"), false, "segundo monstro fica derrotado");
for (let i = 0; i < 20 && duoRpg.duel.phase !== "victory"; i++) {
  if (duoRpg.duel.phase === "question") duoRpg.answer(duoRpg.duel.question.answer);
  else duoRpg.next();
}
assert.equal(duoRpg.duel.phase, "victory", "vitória da dupla");
assert.ok(duoRpg.duel.result.xp >= 18 + 10, "XP soma o parceiro");
assert.ok(duoRpg.duel.result.loot.length >= 3, "loot soma o parceiro");
duoRpg.next();

// parceiro pode derrubar o jogador
const duoHp = new RPG({ getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} });
duoHp.data.hp = 1;
duoHp.save();
duoHp.startDuel({ id: "duo2-main", name: "A", kind: "slime", tier: 1 }, duoGround, false, { id: "duo2-partner", name: "B", kind: "eye", tier: 2 });
const p2 = duoHp.duel.partner;
const wrong2 = (p2.question.answer + 1) % p2.question.options.length;
duoHp.answerPartner(wrong2);
assert.equal(duoHp.duel.phase, "defeat", "errar com o parceiro derruba");
assert.equal(duoHp.hp(), duoHp.hpMax(), "respawn devolve a vida");

// matilha: dois parceiros na mesma tela, uma coluna para cada bicho
const trioRpg = new RPG({ getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} });
const trioGround = { id: "trio-test", continent: "cs", name: "Matilha", dungeon: true, loot: ["parafuso", "chip", "fita"], bossLoot: "nucleo", material: "ferro" };
const trio = trioRpg.startDuel(
  { id: "trio-main", name: "Bit", kind: "slime", tier: 1, theme: "lógica" },
  trioGround,
  false,
  [{ id: "trio-p1", name: "Olho", kind: "eye", tier: 1 }, { id: "trio-p2", name: "Golem", kind: "golem", tier: 3 }],
);
assert.equal(trio.ok, true, "duelo com matilha abre");
assert.equal(trioRpg.duel.partners.length, 2, "dois parceiros entram juntos");
assert.equal(trioRpg.duel.partners[1].hpMax, 12, "vida do terceiro bicho");
for (let who = 0; who < 2; who++) {
  for (let i = 0; i < 60 && !trioRpg.duel.partners[who].done; i++) {
    const p = trioRpg.duel.partners[who];
    if (p.feedback) trioRpg.partnerNext(who);
    else trioRpg.answerPartner(p.question.answer, who);
  }
  assert.equal(trioRpg.duel.partners[who].done, true, `parceiro ${who + 1} cai`);
}
for (let i = 0; i < 30 && trioRpg.duel.phase !== "victory"; i++) {
  if (trioRpg.duel.phase === "question") trioRpg.answer(trioRpg.duel.question.answer);
  else trioRpg.next();
}
assert.equal(trioRpg.duel.phase, "victory", "matilha inteira cai");
assert.ok(trioRpg.duel.result.xp >= 10 + 10 + 30, "XP soma os três monstros");
assert.equal(trioRpg.duel.partners.every((p) => p.done), true, "os dois parceiros ficam derrotados");
trioRpg.next();

// quatro bichos: três parceiros na mesma tela
const quadRpg = new RPG({ getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} });
const quad = quadRpg.startDuel(
  { id: "quad-main", name: "Bit", kind: "slime", tier: 1, theme: "lógica" },
  trioGround,
  false,
  [
    { id: "quad-p1", name: "Olho", kind: "eye", tier: 1 },
    { id: "quad-p2", name: "Golem", kind: "golem", tier: 2 },
    { id: "quad-p3", name: "Morcego", kind: "bat", tier: 3 },
  ],
);
assert.equal(quad.ok, true, "duelo com quatro bichos abre");
assert.equal(quadRpg.duel.partners.length, 3, "três parceiros entram juntos");
for (let who = 0; who < 3; who++) {
  for (let i = 0; i < 70 && !quadRpg.duel.partners[who].done; i++) {
    const p = quadRpg.duel.partners[who];
    if (p.feedback) quadRpg.partnerNext(who);
    else quadRpg.answerPartner(p.question.answer, who);
  }
  assert.equal(quadRpg.duel.partners[who].done, true, `parceiro ${who + 1} de quatro cai`);
}
for (let i = 0; i < 40 && quadRpg.duel.phase !== "victory"; i++) {
  if (quadRpg.duel.phase === "question") quadRpg.answer(quadRpg.duel.question.answer);
  else quadRpg.next();
}
assert.equal(quadRpg.duel.phase, "victory", "os quatro caem");
assert.ok(quadRpg.duel.result.xp >= 10 + 10 + 18 + 30, "XP soma os quatro monstros");
quadRpg.next();

// lista de parceiros repetida ou morta é ignorada
const trioFilter = new RPG({ getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} });
const mainId = "filtro-main";
trioFilter.startDuel({ id: mainId, name: "A", kind: "slime", tier: 1 }, trioGround, false, [
  { id: mainId, name: "A de novo", kind: "slime", tier: 1 },
  { id: "filtro-p1", name: "B", kind: "eye", tier: 1 },
]);
assert.equal(trioFilter.duel.partners.length, 1, "monstro repetido não vira parceiro");
trioFilter.next();

// as seis runas do duelo, cada uma com efeito proprio
const spellRpg = new RPG({ getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} });
const spellGround = { id: "runa-test", continent: "cs", name: "Runas", dungeon: true, loot: ["parafuso", "chip", "fita"], bossLoot: "nucleo", material: "ferro" };
const spellMain = (id, tier = 1) => ({ id, name: id, kind: "slime", tier, theme: "lógica" });
spellRpg.data.hp = 5;
spellRpg.addItem("runa-trovao", 2);
spellRpg.startDuel(spellMain("runa-main-1"), spellGround, false);
const trovao1 = spellRpg.useItem("runa-trovao");
assert.equal(trovao1.victory, false, "trovao sozinho nao derruba o facil");
assert.equal(spellRpg.duel.monsterHp, 1, "trovao tira 2 do monstro de 3");
spellRpg.next();
assert.equal(spellRpg.useItem("runa-trovao").victory, true, "segundo trovao derruba o da frente");
assert.equal(spellRpg.duel.phase, "victory", "trovao pode vencer o duelo");
assert.equal(spellRpg.itemCount("runa-trovao"), 0, "trovao some ao usar");
spellRpg.next();

spellRpg.addItem("runa-gelo", 1);
spellRpg.startDuel(spellMain("runa-main-2", 2), spellGround, false);
const geloHp = spellRpg.duel.monsterHp;
const resGelo = spellRpg.useItem("runa-gelo");
assert.equal(resGelo.ok, true, "gelo usa");
assert.equal(spellRpg.duel.phase, "feedback", "gelo vira feedback sem dano");
assert.equal(spellRpg.duel.monsterHp, geloHp, "gelo nao machuca o monstro");
spellRpg.next();
assert.equal(spellRpg.duel.phase, "question", "gelo passa a pergunta");
spellRpg.next(); // fecha o duelo para os proximos testes
spellRpg.duel = null;

spellRpg.addItem("runa-cura", 1);
spellRpg.startDuel(spellMain("runa-main-3"), spellGround, false);
const cura = spellRpg.useItem("runa-cura");
assert.equal(cura.healed, 12, "cura devolve 12");
assert.equal(cura.healed, Math.min(12, spellRpg.hpMax() - 5), "cura respeita o teto");
spellRpg.duel = null;

spellRpg.data.hp = 5;
spellRpg.addItem("runa-espelho", 1);
spellRpg.startDuel(spellMain("runa-main-4"), spellGround, false);
assert.equal(spellRpg.useItem("runa-espelho").shield, true, "espelho arma");
const wrongSpell = (spellRpg.duel.question.answer + 1) % spellRpg.duel.question.options.length;
spellRpg.answer(wrongSpell);
assert.equal(spellRpg.data.hp, 5, "espelho segura o erro sem tirar vida");
assert.equal(spellRpg.duel.feedback.blocked, true, "feedback marca o golpe bloqueado");
spellRpg.duel = null;

spellRpg.addItem("runa-faisca", 1);
spellRpg.startDuel(spellMain("runa-main-5"), spellGround, false);
assert.equal(spellRpg.useItem("runa-faisca").spark, true, "faisca avisa o duelo");
assert.equal(spellRpg.itemCount("runa-faisca"), 0, "faisca some ao usar");
spellRpg.duel = null;

spellRpg.addItem("runa-fogo", 3);
spellRpg.startDuel(spellMain("runa-main-6", 3), spellGround, false, [spellMain("runa-p1", 1), spellMain("runa-p2", 3)]);
const fogo = spellRpg.useItem("runa-fogo");
assert.equal(fogo.ok, true, "fogo usa");
assert.equal(spellRpg.duel.monsterHp, 11, "fogo tira 1 do principal");
assert.equal(spellRpg.duel.partners.every((p) => p.hp < p.hpMax), true, "fogo tira 1 da matilha");
assert.equal(spellRpg.duel.partners[0].done, false, "parceiro de vida 3 aguenta o primeiro fogo");
spellRpg.next();
spellRpg.useItem("runa-fogo");
assert.equal(spellRpg.duel.partners[0].done, false, "parceiro de vida 3 aguenta o segundo fogo");
spellRpg.next();
spellRpg.useItem("runa-fogo");
assert.equal(spellRpg.duel.partners[0].done, true, "terceiro fogo derruba o parceiro de vida 3");
assert.equal(spellRpg.monsterAlive("runa-p1"), false, "parceiro queimado fica derrotado");
spellRpg.duel = null;

// a primeira carga ensina a runa; sem carga, ela sai por mana
spellRpg.data.items = {};
spellRpg.data.spells = {};
spellRpg.data.mana = 10;
spellRpg.addItem("runa-gelo", 1);
spellRpg.startDuel(spellMain("runa-main-7", 2), spellGround, false);
const chargeCast = spellRpg.castSpell("runa-gelo");
assert.equal(chargeCast.ok, true, "carga da runa funciona");
assert.equal(spellRpg.itemCount("runa-gelo"), 0, "cast com carga gasta o item");
assert.equal(spellRpg.data.spells["runa-gelo"], true, "usar a carga aprende a magia");
assert.equal(spellRpg.mana(), 10, "carga guardada não custa mana");
spellRpg.next();
const manaCast = spellRpg.castSpell("runa-gelo");
assert.equal(manaCast.ok, true, "sem carga, a runa sai por mana");
assert.equal(manaCast.manaCost, 3, "gelo custa 3 de mana");
assert.equal(spellRpg.mana(), 7, "mana foi descontada");
spellRpg.next();
spellRpg.data.mana = 1;
const semMana = spellRpg.castSpell("runa-gelo");
assert.equal(semMana.ok, false, "sem mana a runa não sai");
assert.equal(spellRpg.itemCount("runa-cura"), 0, "runa não aprendida e sem carga não inventa item");
const semAprender = spellRpg.castSpell("runa-cura");
assert.equal(semAprender.ok, false, "runa não aprendida não sai por mana");
spellRpg.duel = null;

// runa fora do duelo volta para a mochila, nao some
spellRpg.addItem("runa-gelo", 1);
const fora = spellRpg.useItem("runa-gelo");
assert.equal(fora.ok, false, "runa nao funciona fora do duelo");
assert.equal(spellRpg.itemCount("runa-gelo"), 1, "runa fora do duelo nao e consumida");

// companhia: mana, bichos com habilidades e montarias
const { MANA_MS } = await import("../js/pets.js");
store.set(STORAGE.rpg, JSON.stringify({
  hp: 30,
  pets: { gato: { bond: 3 } },
  petActive: "gato",
  mana: 10,
  items: { racao: 3, ferro: 4, erva: 2 },
}));
const comp = new RPG({ getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} });
assert.equal(comp.activePet()?.id, "gato", "bicho domado fica ativo");
assert.equal(comp.hpMax(), 35, "gato soma 5 de vida");
assert.equal(comp.lightBonus(), 1, "gato soma 1 de luz");
assert.equal(comp.manaMax(), 10, "mana cheia por padrão");

const compGround = GROUNDS.find((g) => g.id === "cs");
comp.startDuel(compGround.monsters[0], compGround, false);
const faro = comp.usePetAbility({ duel: true });
assert.equal(faro.ok, true, "faro funciona no duelo");
assert.equal(Array.isArray(faro.sparks) && faro.sparks.length === 1, true, "faro risca uma alternativa");
assert.equal(comp.mana(), 8, "faro custa 2 de mana");
assert.ok(comp.petCdLeft("gato") > 0, "faro entra em recarga");
const againFaro = comp.usePetAbility({ duel: true });
assert.equal(againFaro.ok, false, "faro não repete durante a recarga");
comp.duel = null;

// mana volta com o tempo e para no teto
comp.data.mana = 2;
comp.data.manaAt = Date.now() - MANA_MS * 3 - 10;
comp.pulse();
assert.equal(comp.mana(), 5, "mana volta com o tempo");
comp.data.mana = 9;
comp.addMana(5);
assert.equal(comp.mana(), 10, "mana não passa do teto");

// coruja revela a resposta certa
comp.data.pets.coruja = { bond: 3 };
comp.data.petActive = "coruja";
comp.data.mana = 10;
comp.data.petCd = {};
comp.startDuel(compGround.monsters[1], compGround, false);
const owl = comp.usePetAbility({ duel: true });
assert.equal(owl.ok, true, "sabedoria funciona");
assert.equal(owl.answer, comp.duel.question.answer, "sabedoria aponta a alternativa certa");
assert.equal(comp.mana(), 6, "sabedoria custa 4 de mana");
comp.duel = null;

// sapo cura
comp.data.pets.sapo = { bond: 3 };
comp.data.petActive = "sapo";
comp.data.mana = 10;
comp.data.petCd = {};
comp.data.hp = 5;
const frog = comp.usePetAbility({});
assert.equal(frog.ok, true, "cura funciona fora do duelo");
assert.ok(comp.hp() > 5, "sapo devolve vida");
comp.data.petCd = {};

// sombra some dano
comp.data.pets.sombra = { bond: 3 };
comp.data.petActive = "sombra";
assert.equal(comp.damageFor("cs"), 2, "sombra soma 1 de dano");

// grilo dá mana por acerto
comp.data.pets.grilo = { bond: 3 };
comp.data.petActive = "grilo";
comp.data.mana = 1;
comp.data.petCd = {};
comp.startDuel(compGround.monsters[0], compGround, false);
comp.data.monsters = {};
comp.answer(comp.duel.question.answer);
assert.ok(comp.mana() >= 2, "grilo devolve mana quando acerta");
comp.duel = null;

// vaga-lume devolve mana de graça
comp.data.pets.vaga = { bond: 3 };
comp.data.petActive = "vaga";
comp.data.mana = 2;
comp.data.petCd = {};
const wisp = comp.usePetAbility({});
assert.equal(wisp.ok, true, "pulso funciona");
assert.equal(comp.mana(), 5, "pulso devolve 3 de mana");

// papagaio do vale risca duas alternativas de uma vez
comp.data.pets.papagaio = { bond: 3 };
comp.data.petActive = "papagaio";
comp.data.mana = 10;
comp.data.petCd = {};
comp.startDuel(compGround.monsters[1], compGround, false);
const papagaio = comp.usePetAbility({ duel: true });
assert.equal(papagaio.ok, true, "tagarela funciona");
assert.equal(papagaio.sparks.length, 2, "tagarela risca duas alternativas");
assert.equal(new Set(papagaio.sparks).size, 2, "as duas riscadas são diferentes");
assert.equal(comp.mana(), 7, "tagarela custa 3 de mana");
comp.duel = null;

// montarias: compra, acelera e o casco só vale na superfície
comp.data.mounts = {};
comp.data.mountActive = null;
comp.data.items.ferro = 4;
comp.data.items.erva = 2;
assert.equal(comp.buyMount("cavalo").ok, true, "compra o cavalo");
assert.equal(comp.mountSpeedMult(), 1.5, "cavalo acelera");
comp.setCave(true);
assert.equal(comp.mountSpeedMult(), 1, "montaria não acelera na caverna");
comp.setCave(false);
comp.data.items.veio = 3;
comp.data.items.erva = 3;
assert.equal(comp.buyMount("tartaruga").ok, true, "compra a tartaruga");
comp.setMount("tartaruga");
const surfaceHp = comp.hpMax();
comp.setCave(true);
assert.equal(comp.hpMax(), surfaceHp - 5, "casco da tartaruga só na superfície");
comp.setCave(false);
assert.equal(comp.buyMount("cavalo").ok, false, "não compra a mesma montaria duas vezes");

// save antigo do bicho vira o gato da companhia
store.set(STORAGE.rpg, JSON.stringify({ hp: 30, pet: { bond: 3 } }));
const legacy = new RPG({ getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} });
assert.equal(legacy.activePet()?.id, "gato", "save antigo migra o gato");
assert.equal(legacy.hpMax(), 35, "bicho migrado soma vida");

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
  const npc = instructors.find((n) => n.id === `trainer-${h.id}`);
  assert.ok(npc, `instrutor de ${h.continent}`);
  assert.ok(Math.hypot(npc.x - h.center.x, npc.y - h.center.y) < 2.5, `instrutor no centro de ${h.continent}`);
  assert.ok(Math.hypot(npc.hx - npc.x, npc.hy - npc.y) <= npc.wander + 0.6, `instrutor de ${h.continent} com posto e raio de passeio`);
  assert.equal(w.boxCollides(npc.x, npc.y, PLAYER_W, PLAYER_H), false, `instrutor de ${h.continent} anda, não é parede`);
}
// os NPCs passeiam, mas cada um dentro do seu posto e fora da água
for (const n of w.npcs) {
  assert.ok(Number.isFinite(n.hx) && Number.isFinite(n.hy), `npc ${n.id} sem posto`);
  assert.ok(n.wander > 0, `npc ${n.id} sem raio de passeio`);
  const t = performance.now() + 30000;
  for (let i = 0; i < 40; i++) w.updateNpcs(0.12, t + i * 120);
  assert.ok(Math.hypot(n.x - n.hx, n.y - n.hy) <= n.wander + 0.6, `npc ${n.id} saiu do posto`);
  assert.equal(w.boxCollides(n.x, n.y, 0.3, 0.24), false, `npc ${n.id} parou em parede ou água`);
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
  // cada ilha do catálogo tem farol próprio; a caverna é alcançada a pé dele
  const areaId = String(cave.defId || "").replace(/^dungeon-/, "");
  const own = w.waystones.find((s) => s.id === areaId);
  const stone = own || w.waystones.find((s) => s.continent === cave.continent);
  assert.ok(stone, `pedra de ${cave.continent}`);
  assert.ok(findPath(w, stone, cave.exit), `caminho até a caverna de ${areaId || cave.continent}`);
}

// o anel de pontes liga as ilhas sem passar pelo centro
for (const [x, y] of [[35, 38], [63, 21], [116, 20], [146, 38], [125, 86], [53, 88]]) {
  assert.equal(w.get(x, y), 18, `ponte do anel em ${x},${y}`);
}
assert.ok(findPath(w, { x: 60, y: 21 }, { x: 67, y: 21 }), "atravessa a ponte noroeste/norte");
assert.ok(findPath(w, { x: 137, y: 81 }, { x: 113, y: 91 }), "atravessa a ponte direita/sul");

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
// as 93 cavernas não compartilham mais a mesma planta: cada id semeia o seu
// desenho, e a regra de progressão se mantém (fraco perto da entrada, chefe no
// fundo), com toda sala alcançável desde a entrada
const desenhos = new Set();
for (const def of DUNGEONS) {
  const mapa = buildDungeonMap(def);
  const entradaDele = def.rooms.find((r) => r.kind === "entrance");
  const cidadeDele = def.rooms.find((r) => r.kind === "city");
  for (const room of def.rooms) {
    assert.equal(dungeonSolid(mapa, center(room).x, center(room).y), false, `${def.id}: sala ${room.id} tem chão`);
    assert.equal(
      reachable(mapa, center(entradaDele), center(room)),
      true,
      `${def.id}: sala ${room.id} alcançável desde a entrada`,
    );
  }
  assert.equal(reachable(mapa, center(entradaDele), center(cidadeDele)), true, `${def.id}: entrada chega à cidade`);
  const salaDoChefe = def.rooms.find((r) => r.id === (def.layout || {}).bossRoom);
  assert.ok(salaDoChefe && salaDoChefe.tier === 3, `${def.id}: chefe na sala do fundo`);
  desenhos.add(def.rooms.map((r) => `${r.id}:${r.x},${r.y},${r.w},${r.h}`).join("|"));
}
assert.equal(desenhos.size, DUNGEONS.length, "uma planta por caverna");

const roomA = dg.rooms.find((r) => r.id === "a");
assert.equal(
  dungeonLineOfSight(dmap, roomA.x + 2.5, roomA.y + 3.5, roomA.x + 5.5, roomA.y + 3.5),
  true,
  "sala aberta deixa ver",
);
// parede corta a vista: existe par de salas que não se enxergam
const algumaParedeNoMeio = dg.rooms.some((salaX) =>
  dg.rooms.some(
    (salaY) =>
      salaX !== salaY &&
      !dungeonLineOfSight(dmap, center(salaX).x, center(salaX).y, center(salaY).x, center(salaY).y),
  ),
);
assert.equal(algumaParedeNoMeio, true, "pedra corta a linha de visão entre salas");

// o chefe da caverna não depende de alavanca, e a forja consome e devolve
assert.equal(rpg.bossAlive({ id: "dungeon-teste", dungeon: true }), true, "chefe de caverna sem alavanca");
assert.equal(rpg.bossAlive({ id: "caçada-teste" }), false, "chefe de outro tipo pede alavanca");
store.clear();
rpg.data = { hp: null, skills: {}, items: {}, monsters: {}, bosses: {}, levers: {}, enchants: {}, buffs: {}, pets: {}, petActive: null, petCd: {}, mana: null, manaAt: 0, mounts: {}, mountActive: null };
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
assert.equal(rpg.feedPet("gato").ok, true);
assert.equal(rpg.feedPet("gato").ok, true);
const pet = rpg.feedPet("gato");
assert.equal(pet.tamed, true, "bicho fica manso");
assert.equal(rpg.hpMax(), 50, "bicho soma 5 de vida");
rpg.addItem("erva", 1);
rpg.addItem("pocao", 1);
assert.equal(rpg.craft("cafe").ok, true, "cozinha o café");
rpg.useItem("cafe");
assert.equal(rpg.speedMult(), 1.3, "café acelera");
const deepDeck = rpg.buildDeck("cs", [3], "algoritmos");
assert.equal(deepDeck.length, QUESTIONS.cs[3].length, "pergunta do fundo entrou no baralho");
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

// distrator próximo: a alternativa extra troca uma palavra pela oposta, em
// vez de pescar uma opção de outro assunto
const deckMat = rpg.buildDeck("math", [1, 2, 3]);
const achaQ = (trecho) => deckMat.find((q) => q.q.includes(trecho));
assert.ok(achaQ("teorema de Cantor").options.includes("Ele é sempre menor que o conjunto original"), "Cantor sem o distrator próximo");
assert.ok(achaQ("autovalor de uma matriz").options.includes("um escalar que muda a direção do autovetor"), "autovalor sem o distrator próximo");
const grandes = achaQ("lei dos grandes números");
assert.ok(grandes.options.includes("a média amostral se afasta da esperada com muitas repetições"), "lei dos grandes números sem o afasta");
assert.ok(grandes.options.includes("a média amostral se aproxima da esperada com poucas repetições"), "lei dos grandes números sem o poucas");
const partes = achaQ("Integração por partes");
assert.ok(partes.options.includes("da regra da soma na derivada"), "integração por partes sem o soma");
assert.ok(partes.options.includes("da regra do produto na integral"), "integração por partes sem a integral");

// duelo entre jogadores: cinco perguntas, uma por dificuldade, dano crescente
const pvpCards = rpg.pvpQuestions("cs");
assert.equal(pvpCards.length, 5, "cinco cartas de duelo");
assert.deepEqual(pvpCards.map((c) => c.difficulty), [1, 2, 3, 4, 5], "uma por dificuldade");
assert.deepEqual(pvpCards.map((c) => c.damage), [1, 2, 3, 4, 5], "dano acompanha a dificuldade");
for (const c of pvpCards) {
  assert.equal(c.options.length, 5, "cinco alternativas no PvP");
  assert.ok(c.answer >= 0 && c.answer < 5, "resposta dentro das alternativas");
  assert.equal(new Set(c.options).size, 5, "sem alternativa repetida");
  assert.ok(c.q.length >= 4 && c.why.length > 0, "pergunta e explicação vêm juntas");
}
const dmgBefore = pvpCards[4].damage;
rpg.addItem("amuleto", 1);
assert.ok(rpg.pvpQuestions("cs")[4].damage >= dmgBefore, "item não reduz o dano");

console.log("ok missões, persistência, canais, RPG, interpolação, colisão, caverna, treino, fuga e duelo");

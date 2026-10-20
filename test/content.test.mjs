// Conferência do conteúdo: estações x textos, NPCs x missões, itens, receitas,
// perguntas por continente, baralhos do duelo, cavernas e o mundo montado.
// Roda sem navegador: node test/content.test.mjs
import assert from "node:assert/strict";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

const { CONTINENTS, SITES, WAYSTONES, NPC_SPAWNS, CONTINENT_ORDER, AREAS } = await import("../js/config.js");
const { QUESTIONS, DEEP_QUESTIONS, GROUNDS, ITEMS, RECIPES, ENCHANTS } = await import("../js/rpg-data.js");
const { DUNGEONS } = await import("../js/dungeon-data.js");
const { POSTS, NPCS } = await import("../js/content.js");
const { QUESTS } = await import("../js/quests.js");
const { RPG } = await import("../js/rpg.js");
const { createWorld } = await import("../js/world.js");

const faults = [];
const check = (cond, message) => { if (!cond) faults.push(message); };
const continents = CONTINENT_ORDER.filter((c) => c !== "hub");

// 43 estações com texto: cinco por continente, duas no porto e as áreas temáticas
check(SITES.length === 65, `SITES tem ${SITES.length} estações, esperado 65`);
check(new Set(SITES.map((s) => s.id)).size === SITES.length, "id de estação repetido");
check(SITES.filter((s) => s.continent === "hub").length === 2, "o porto precisa de 2 estações");
for (const site of SITES) {
  check(!!CONTINENTS[site.continent], `estação ${site.id} em continente inexistente`);
  const post = POSTS[site.post];
  check(!!post, `estação ${site.id} sem post ${site.post}`);
  if (post) {
    check(!!post.title && !!post.body, `post ${site.post} sem título ou corpo`);
    check(!/TODO|FIXME/.test(post.body), `post ${site.post} com texto de rascunho`);
    check(!/lorem ipsum|placeholder/i.test(post.body), `post ${site.post} com texto de rascunho`);
  }
}
for (const c of continents) {
  const n = SITES.filter((s) => s.continent === c).length;
  // cada continente mantém as cinco estações e ganha mais nas áreas temáticas
  check(n >= 5, `continente ${c} tem ${n} estações, esperado ao menos 5`);
  check(!!WAYSTONES.find((w) => w.continent === c), `continente ${c} sem pedra de viagem`);
}

// NPCs, falas e missões
for (const npc of NPC_SPAWNS) {
  check(!!NPCS[npc.id]?.lines?.length, `NPC ${npc.id} sem falas`);
}
const goalTypes = new Set(["cards", "docks", "labs", "hunts", "social", "quiz"]);
for (const quest of QUESTS) {
  check(!!NPC_SPAWNS.find((n) => n.id === quest.npc), `missão ${quest.id} aponta NPC inexistente ${quest.npc}`);
  check(goalTypes.has(quest.goal.type), `missão ${quest.id} com meta desconhecida ${quest.goal.type}`);
  check(Number.isFinite(quest.reward?.xp) && quest.reward.xp > 0, `missão ${quest.id} sem XP`);
  check(!!quest.title && !!quest.brief, `missão ${quest.id} sem título ou resumo`);
}
check(QUESTS.length >= 18, `só ${QUESTS.length} missões, esperado ao menos 18`);

// itens, caçadas, receitas e encantos
for (const [id, item] of Object.entries(ITEMS)) {
  check(!!item.name, `item ${id} sem nome`);
  check(item.continent === "hub" || continents.includes(item.continent), `item ${id} em continente inválido ${item.continent}`);
  if (item.heal) check(item.heal > 0 && item.heal <= 60, `item ${id} cura fora de faixa`);
  if (item.buff) check(["speed", "damage", "maxhp"].includes(item.buff.id), `item ${id} com buff desconhecido`);
}
const SLOTS = new Set(["weapon", "helmet", "armor", "legs", "boots", "shield", "ring", "necklace"]);
for (const [id, item] of Object.entries(ITEMS)) {
  if (!item.slot) continue;
  check(SLOTS.has(item.slot), `item ${id} com espaço desconhecido ${item.slot}`);
  check(Number(item.damage) > 0 || Number(item.hp) > 0, `equipamento ${id} sem bônus`);
  if (item.weapon) check(["sword", "club", "axe", "wand", "rod"].includes(item.weapon), `arma ${id} com tipo ${item.weapon}`);
}
for (const c of continents) {
  const relics = Object.values(ITEMS).filter((i) => i.continent === c && i.relic).length;
  check(relics >= 1, `continente ${c} tem ${relics} relíquias, esperado ao menos 1`);
  const grounds = GROUNDS.filter((g) => g.continent === c);
  check(grounds.length >= 1, `sem caçada para ${c}`);
  for (const ground of grounds) {
    check(ground.monsters.length === 3, `caçada de ${c} tem ${ground.monsters.length} monstros`);
    check(ground.monsters.map((m) => m.tier).join(",") === "1,2,3", `caçada de ${c} sem tiers 1, 2, 3`);
    const dungeonId = ground.dungeon || `dungeon-${ground.continent}`;
    check(!!DUNGEONS.find((d) => d.id === dungeonId), `caçada de ${c} aponta caverna inexistente ${dungeonId}`);
    for (const id of ground.loot) check(!!ITEMS[id], `loot de ${c} com item inexistente ${id}`);
    check(!!ITEMS[ground.bossLoot], `chefe de ${c} solta item inexistente ${ground.bossLoot}`);
  }
}
const runas = Object.keys(ITEMS).filter((id) => id.startsWith("runa-"));
check(runas.length >= 6, `só ${runas.length} runas, esperado ao menos 6`);
for (const id of runas) check(RECIPES.some((r) => r.out === id), `runa ${id} sem receita na forja`);

for (const recipe of RECIPES) {
  check(!!ITEMS[recipe.out], `receita ${recipe.id} produz item inexistente ${recipe.out}`);
  check(recipe.qty > 0, `receita ${recipe.id} sem quantidade de saída`);
  for (const [id, qty] of Object.entries(recipe.need || {})) {
    check(!!ITEMS[id], `receita ${recipe.id} usa item inexistente ${id}`);
    check(qty > 0, `receita ${recipe.id} com custo inválido em ${id}`);
  }
}
for (const enchant of ENCHANTS) {
  for (const [id, qty] of Object.entries(enchant.need || {})) {
    check(!!ITEMS[id], `encanto ${enchant.id} usa item inexistente ${id}`);
    check(qty > 0, `encanto ${enchant.id} com custo inválido em ${id}`);
  }
}

// perguntas: três por dificuldade, sem repetição, com resposta válida
for (const c of continents) {
  const byTier = QUESTIONS[c];
  check(!!byTier, `sem perguntas para ${c}`);
  for (const tier of [1, 2, 3]) {
    const list = byTier?.[tier] || [];
    // um monstro fácil pede 3 acertos, o médio 7 e o difícil 12: o baralho
    // precisa de perguntas distintas para a luta inteira, sem repetir.
    const need = tier === 3 ? 12 : tier === 2 ? 7 : 3;
    check(list.length >= need, `${c} tier ${tier} tem ${list.length} perguntas, esperado ${need}`);
    for (const q of list) {
      check(q.options?.length === 3, `${c}/${tier}: pergunta sem 3 alternativas: ${q.q}`);
      check(new Set(q.options).size === 3, `${c}/${tier}: alternativas repetidas: ${q.q}`);
      check(q.a >= 0 && q.a < 3, `${c}/${tier}: resposta fora da faixa: ${q.q}`);
      check(typeof q.why === "string" && q.why.length >= 20, `${c}/${tier}: explicação curta: ${q.q}`);
    }
  }
  check(!!DEEP_QUESTIONS[c]?.q, `sem pergunta do fundo para ${c}`);
  // O módulo de dados já enfia a pergunta do fundo no baralho difícil.
  const texts = Object.values(byTier || {}).flat().map((q) => q.q);
  check(texts.includes(DEEP_QUESTIONS[c]?.q), `${c}: pergunta do fundo fora do baralho`);
  check(new Set(texts).size === texts.length, `${c}: pergunta repetida no continente`);
  check(texts.length >= 22, `${c}: só ${texts.length} perguntas no continente`);
}

const totalQuestions = continents.reduce(
  (sum, c) => sum + [1, 2, 3].reduce((n, t) => n + (QUESTIONS[c]?.[t]?.length || 0), 0),
  0,
);
check(totalQuestions >= 600, `banco com ${totalQuestions} perguntas, esperado ao menos 600`);

// duelo entre jogadores: uma carta por dificuldade, dano crescente
const rpg = new RPG({ getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} });
for (const c of continents) {
  const cards = rpg.pvpQuestions(c);
  check(cards.length === 5, `PvP de ${c} tem ${cards.length} cartas`);
  check(cards.map((x) => x.difficulty).join(",") === "1,2,3,4,5", `PvP de ${c} sem as cinco dificuldades`);
  check(cards.map((x) => x.damage).join(",") === "1,2,3,4,5", `PvP de ${c} com dano fora de ordem`);
  check(new Set(cards.map((x) => x.q)).size === cards.length, `PvP de ${c} repete pergunta`);
  for (const card of cards) {
    check(card.options.length === 6, `PvP de ${c}: carta sem 6 alternativas`);
    check(card.answer >= 0 && card.answer < 6, `PvP de ${c}: resposta fora da faixa`);
  }
  check(rpg.buildDeck(c, [1], "").length > 0, `baralho fácil de ${c} vazio`);
  check(rpg.buildDeck(c, [2], "").length > 0, `baralho médio de ${c} vazio`);
  check(rpg.buildDeck(c, [3], "").length >= 12, `baralho difícil de ${c} com menos de 12 perguntas`);
}

// relíquia soma dano no PvP, mas o bônus para em +2
const relicRpg = new RPG({ getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} });
relicRpg.addItem("nucleo", 1);
check(relicRpg.pvpQuestions("cs")[4].damage === 6, "uma relíquia soma 1 de dano no PvP");
relicRpg.addItem("infinito", 1);
relicRpg.addItem("orbita", 1);
check(relicRpg.pvpQuestions("cs")[4].damage === 7, "duas relíquias somam o teto de 2 de dano no PvP");

// cavernas: seis, com entrada, cidade, monstros e chefe
check(DUNGEONS.length === 21, `DUNGEONS tem ${DUNGEONS.length} cavernas, esperado 21`);
for (const dungeon of DUNGEONS) {
  check(continents.includes(dungeon.continent), `caverna ${dungeon.id} em continente inválido`);
  check(dungeon.monsters?.length >= 4, `caverna ${dungeon.id} com poucos monstros`);
  check(dungeon.monsters.every((name) => typeof name === "string" && name.length > 0), `caverna ${dungeon.id} com monstro sem nome`);
  check(typeof dungeon.boss === "string" && dungeon.boss.length > 0, `caverna ${dungeon.id} sem chefe`);
  check(dungeon.rooms.length >= 8, `caverna ${dungeon.id} com ${dungeon.rooms.length} salas`);
  check(dungeon.rooms.some((r) => r.kind === "entrance"), `caverna ${dungeon.id} sem entrada`);
  for (const id of dungeon.equipment || []) {
    check(!!ITEMS[id]?.slot, `caverna ${dungeon.id} solta equipamento inexistente ${id}`);
  }
  check(dungeon.rooms.some((r) => r.kind === "city"), `caverna ${dungeon.id} sem cidade`);
}

// o mundo que o jogo monta: instrutores na superfície, bicho só na caverna
const world = createWorld();
for (const area of AREAS) {
  check(world.areaAt(area.land.cx, area.land.cy)?.id === area.id, `área ${area.id} não é reconhecida no mapa`);
}
check(world.hunters.length === 21, `mundo com ${world.hunters.length} clareiras`);
check(world.monsters.length === 0, "a superfície ainda tem monstros");
check(world.caves.length === 42, `mundo com ${world.caves.length} bocas de caverna, esperado 42`);
for (const cave of world.caves) {
  const pair = world.caves.find((c) => c.id === cave.pairId);
  check(!!pair, `boca ${cave.id} sem par`);
  if (pair) {
    check(pair.defId === cave.defId, `boca ${cave.id} pareada com outra caverna`);
    check(pair.mouth !== cave.mouth, `boca ${cave.id} pareada com a mesma boca`);
  }
}
check(world.npcs.filter((n) => n.trainer).length === 21, "faltam instrutores na superfície");
for (const c of continents) {
  check(!!world.caves.find((cave) => cave.continent === c), `continente ${c} sem boca de caverna`);
  check(!!DUNGEONS.find((d) => d.continent === c), `continente ${c} sem caverna definida`);
}

assert.equal(faults.length, 0, `conteúdo com ${faults.length} problema(s):\n- ${faults.join("\n- ")}`);
console.log("ok conteúdo, estações, NPCs, missões, itens, receitas, perguntas, PvP, cavernas e mundo");

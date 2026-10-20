// Conferência do conteúdo: estações x textos, NPCs x missões, itens, receitas,
// perguntas por continente, baralhos do duelo, cavernas e o mundo montado.
// Roda sem navegador: node test/content.test.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

const { CONTINENTS, SITES, WAYSTONES, NPC_SPAWNS, CONTINENT_ORDER, AREAS, MAP_W, MAP_H } = await import("../js/config.js");
const { QUESTIONS, DEEP_QUESTIONS, GROUNDS, ITEMS, RECIPES, ENCHANTS, MONSTER_TRAITS } = await import("../js/rpg-data.js");
const { DUNGEONS } = await import("../js/dungeon-data.js");
const { POSTS, NPCS } = await import("../js/content.js");
const { QUESTS } = await import("../js/quests.js");
const { RPG } = await import("../js/rpg.js");
const { isAdminKey, ADMIN_PUBKEYS, ADMIN_LABEL } = await import("../js/admin.js");
const { HAIRS, AVATAR_DEFAULT, normalizeAvatar, avatarColors, avatarCode, avatarFromCode, hairUnlock, hairQuest } = await import("../js/avatar.js");
const { OUTFITS } = await import("../js/outfits.js");
const { createWorld } = await import("../js/world.js");
const { CATALOG, CATALOG_BY_ID, DISCIPLINES, CATALOG_EXISTING } = await import("../js/catalog.js");
const { CATALOG_CONTENT } = await import("../js/catalog-gen.js");
const ready = CATALOG_CONTENT.areas.length;
const { CATALOG_AREAS, CATALOG_BRIDGES, CATALOG_TUNNELS } = await import("../js/catalog-layout.js");

const source = (rel) => readFileSync(new URL(rel, import.meta.url), "utf8");
const faults = [];
const check = (cond, message) => { if (!cond) faults.push(message); };
const continents = CONTINENT_ORDER.filter((c) => c !== "hub");

// 43 estações com texto: cinco por continente, duas no porto e as áreas temáticas
check(SITES.length === 69 + ready * 3, `SITES tem ${SITES.length} estações, esperado ${69 + ready * 3}`);
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

// personagem: gênero, cabelo e cor sobrevivem ao ida e volta da rede
const lookBase = normalizeAvatar({ gender: "m", hair: "rabo", skin: 3, hairColor: 6, eyes: 2 });
check(lookBase.gender === "m" && lookBase.hair === "rabo" && lookBase.skin === 3, "normalizeAvatar perdeu os campos");
check(normalizeAvatar({ gender: "x", hair: "nao-existe", skin: 99 }).gender === AVATAR_DEFAULT.gender, "normalizeAvatar aceitou gênero inventado");
check(normalizeAvatar({ skin: 99 }).skin === 0 || normalizeAvatar({ skin: 99 }).skin === 5, "normalizeAvatar não limitou a pele");
const code = avatarCode(lookBase);
const volta = avatarFromCode(code);
check(!!volta && volta.hair === "rabo" && volta.skin === 3 && volta.hairColor === 6 && volta.eyes === 2, `código do personagem não voltou igual (${code})`);
check(avatarFromCode("lixo") === null, "código de personagem inválido virou personagem");
const cores = avatarColors(lookBase);
check(!!cores.skin && !!cores.hair && !!cores.eyes, "avatarColors não devolveu as cores do corpo");
check(HAIRS.length === 12, `cabelos: ${HAIRS.length}, esperado 12`);
check(HAIRS.filter((h) => !h.unlock && !h.quest).length === 4, "a lista de cabelo básico mudou de tamanho");
check(HAIRS.filter((h) => h.quest).length === 1, "cabelo de missão a mais ou a menos");
check(hairUnlock("moicano") === "cs" && hairUnlock("curto") === null, "trava do cabelo errada");
check(hairQuest("chiquinha") === "mao-na-massa", "cabelo de missão sem missão");

// guarda-roupa: todo traje e cabelo fechado aponta para continente ou missão que existe
const questIds = new Set(QUESTS.map((q) => q.id));
const continentIds = new Set(continents);
for (const item of [...OUTFITS, ...HAIRS]) {
  if (item.quest) check(questIds.has(item.quest), `${item.name} pede missão inexistente ${item.quest}`);
  if (item.unlock) check(continentIds.has(item.unlock), `${item.name} pede continente inexistente ${item.unlock}`);
}
check(OUTFITS.filter((o) => o.quest).length === 5, `trajes de missão: ${OUTFITS.filter((o) => o.quest).length}, esperado 5`);
check(OUTFITS.length === 16, `trajes: ${OUTFITS.length}, esperado 16`);
check(OUTFITS.filter((o) => o.continent === "hub").length === 4, "trajes básicos livres mudaram de tamanho");

// cada bicho desenhado tem um jeito de atrapalhar o duelo, e o chefe morre por fase
const creatureKinds = [...source("../js/creature.js").matchAll(/kind === "([a-z]+)"/g)].map((m) => m[1]);
for (const kind of creatureKinds) {
  if (kind === "boss") continue;
  check(!!MONSTER_TRAITS[kind], `espécie ${kind} sem jeito de atrapalhar no duelo`);
}
const traitIds = new Set(Object.values(MONSTER_TRAITS).map((t) => t.id));
for (const id of ["armor", "haste", "divide", "dodge"]) check(traitIds.has(id), `nenhuma espécie usa o jeito ${id}`);

const duelRpg = new RPG({ getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} });
const bossGround = GROUNDS.find((g) => g.dungeon === "dungeon-cs-arch");
const bossDummy = { id: "dg-teste", name: "Teste", kind: "golem", tier: 3, level: 9 };
check(!!duelRpg.startDuel(bossDummy, bossGround, true).ok, "chefe de teste não abriu duelo");
duelRpg.data.hp = duelRpg.hpMax();
duelRpg.duel.monsterHp = 12; // dois terços da vida do chefe
let phaseRes = duelRpg.answer(duelRpg.duel.question.answer);
check(phaseRes.feedback.phase === 2, `chefe não virou fase 2 ao passar de dois terços (${phaseRes.feedback.phase})`);
duelRpg.next();
duelRpg.duel.monsterHp = 6; // um terço
phaseRes = duelRpg.answer(duelRpg.duel.question.answer);
check(phaseRes.feedback.phase === 3, `chefe não virou fase 3 ao passar de um terço (${phaseRes.feedback.phase})`);
check(duelRpg.duel.deck.every((item) => duelRpg.duel.deck.includes(item)), "baralho do chefe quebrou na fase 3");

// slime se recompõe no erro e o dano do casco de pedra cai
const slimeRpg = new RPG({ getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} });
slimeRpg.startDuel({ id: "dg-slime", name: "Gosma", kind: "slime", tier: 2, level: 6 }, bossGround, false);
slimeRpg.data.hp = slimeRpg.hpMax();
slimeRpg.duel.monsterHp = 4;
const wrongIndex = slimeRpg.duel.question.options.map((_, i) => i).find((i) => i !== slimeRpg.duel.question.answer);
const wrongRes = slimeRpg.answer(wrongIndex);
check(slimeRpg.duel.monsterHp > 4, "gosma não se recompôs no erro");
check(!!wrongRes.feedback.note, "erro sem explicação do jeito da espécie");

// cavernas: seis, com entrada, cidade, monstros e chefe
check(DUNGEONS.length === 23 + ready, `DUNGEONS tem ${DUNGEONS.length} cavernas, esperado ${23 + ready}`);
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
// chave pública do administrador: hex ou npub, nunca a privada
check(isAdminKey("ab".repeat(32), "npub1teste", ["AB".repeat(32)]), "admin não reconhece a própria chave hex");
check(isAdminKey("", "npub1teste", ["npub1teste"]), "admin não reconhece o próprio npub");
check(!isAdminKey("cd".repeat(32), "npub1outro", ["ab".repeat(32)]), "admin reconhece chave errada");

// o GOD do mundo: chave pública registrada no repositório, privada no cofre
const GOD_NPUB = "npub1s7869cka00zxj2psrm68cma588kal727v8evm6rwtre03e5pwyaspxalsw";
check(ADMIN_PUBKEYS.includes(GOD_NPUB), "o npub do GOD não está registrado");
check(ADMIN_LABEL === "GOD", `rótulo do admin: ${ADMIN_LABEL}, esperado GOD`);
check(isAdminKey("", GOD_NPUB), "isAdminKey não reconhece o npub do GOD");
check(!isAdminKey("", "npub1outro"), "isAdminKey reconhece npub que não é do GOD");
check(!ADMIN_PUBKEYS.some((k) => k.startsWith("nsec1")), "chave privada dentro do repositório");

const world = createWorld();
for (const area of AREAS) {
  check(world.areaAt(area.land.cx, area.land.cy)?.id === area.id, `área ${area.id} não é reconhecida no mapa`);
}
const areaSigns = world.decor.filter((d) => d.type === "sign" && d.text.startsWith("Área"));
check(areaSigns.length === AREAS.length, `placas de área: ${areaSigns.length}, esperado ${AREAS.length}`);
check(world.hunters.length === 23 + ready, `mundo com ${world.hunters.length} clareiras, esperado ${23 + ready}`);
check(world.monsters.length === 0, "a superfície ainda tem monstros");
check(world.caves.length === 46 + ready * 2, `mundo com ${world.caves.length} bocas de caverna, esperado ${46 + ready * 2}`);
for (const cave of world.caves) {
  const pair = world.caves.find((c) => c.id === cave.pairId);
  check(!!pair, `boca ${cave.id} sem par`);
  if (pair) {
    check(pair.defId === cave.defId, `boca ${cave.id} pareada com outra caverna`);
    check(pair.mouth !== cave.mouth, `boca ${cave.id} pareada com a mesma boca`);
  }
}
check(world.npcs.filter((n) => n.trainer).length === 23 + ready, `instrutores: ${world.npcs.filter((n) => n.trainer).length}, esperado ${23 + ready}`);
for (const c of continents) {
  check(!!world.caves.find((cave) => cave.continent === c), `continente ${c} sem boca de caverna`);
  check(!!DUNGEONS.find((d) => d.continent === c), `continente ${c} sem caverna definida`);
}

// catálogo: 82 seções (71 + 11 interseções), uma área de jogo por seção
check(CATALOG.length === 82, `catálogo: ${CATALOG.length} seções, esperado 82`);
const porDisciplina = {};
for (const item of CATALOG) porDisciplina[item.discipline] = (porDisciplina[item.discipline] || 0) + 1;
check(porDisciplina.math === 11, `matemática: ${porDisciplina.math}, esperado 11`);
check(porDisciplina.physics === 15, `física: ${porDisciplina.physics}, esperado 15`);
check(porDisciplina.chem === 13, `química: ${porDisciplina.chem}, esperado 13`);
check(porDisciplina.cs === 17, `computação: ${porDisciplina.cs}, esperado 17`);
check(porDisciplina.lingua === 15, `língua: ${porDisciplina.lingua}, esperado 15`);
check(porDisciplina.inter === 11, `interseções: ${porDisciplina.inter}, esperado 11`);
for (const item of CATALOG) {
  check(!!DISCIPLINES[item.discipline], `${item.id} em disciplina inexistente`);
  check(item.topics?.length === 3, `${item.id} sem os três tópicos de estação`);
  check(typeof item.name === "string" && item.name.startsWith("Área"), `${item.id} sem nome de área`);
}
check(CATALOG_EXISTING.size === 12, `seções já cobertas: ${CATALOG_EXISTING.size}, esperado 12`);
check(CATALOG_AREAS.length === 70, `áreas novas posicionadas: ${CATALOG_AREAS.length}, esperado 70`);
for (const spot of CATALOG_AREAS) {
  check(!!CATALOG_BY_ID.get(spot.id), `posição de área fora do catálogo: ${spot.id}`);
  check(spot.rect.x > 0 && spot.rect.y > 0 && spot.rect.x + spot.rect.w < MAP_W && spot.rect.y + spot.rect.h < MAP_H, `${spot.id} fora do mapa`);
  check(spot.land.rx * 2 <= spot.rect.w && spot.land.ry * 2 <= spot.rect.h, `${spot.id} com terra maior que o retângulo`);
}
// nenhuma ilha em cima da outra e nenhuma em cima do mundo antigo
for (let i = 0; i < CATALOG_AREAS.length; i++) {
  const a = CATALOG_AREAS[i];
  for (let j = i + 1; j < CATALOG_AREAS.length; j++) {
    const b = CATALOG_AREAS[j];
    const gapX = Math.abs(a.cx - b.cx), gapY = Math.abs(a.cy - b.cy);
    check(gapX >= 20 || gapY >= 12, `${a.id} encosta em ${b.id}`);
  }
  check(a.cx - a.land.rx > 293 || a.cy - a.land.ry > 191, `${a.id} invadiu o mundo antigo`);
}
check(CATALOG_BRIDGES.length === 54, `pontes de catálogo: ${CATALOG_BRIDGES.length}, esperado 54`);
// a interseção nasce entre as disciplinas que liga: perto o bastante das duas
const clusterCentre = {};
for (const d of ["math", "physics", "chem", "cs", "lingua"]) {
  const list = CATALOG_AREAS.filter((a) => a.discipline === d);
  clusterCentre[d] = {
    x: list.reduce((n, a) => n + a.cx, 0) / list.length,
    y: list.reduce((n, a) => n + a.cy, 0) / list.length,
  };
}
const interById = new Map(CATALOG_AREAS.filter((a) => a.discipline === "inter").map((a) => [a.id, a]));
for (const [inter, d] of CATALOG_TUNNELS) {
  const spot = interById.get(inter);
  check(!!spot, `interseção sem posição: ${inter}`);
  if (!spot) continue;
  const centre = clusterCentre[d];
  const dist = Math.hypot(spot.cx - centre.x, spot.cy - centre.y);
  // inter-todas junta as cinco, então o alcance dela é o mapa todo
  const limit = inter === "inter-todas" ? 340 : 240;
  check(dist < limit, `${inter} longe demais de ${d}: ${Math.round(dist)} tiles`);
}
check(CATALOG_TUNNELS.length === 25, `túneis de interseção: ${CATALOG_TUNNELS.length}, esperado 25`);
check(interById.size === 11, `interseções posicionadas: ${interById.size}, esperado 11`);
const spotById = new Map(CATALOG_AREAS.map((a) => [a.id, a]));
for (const [a, b] of CATALOG_BRIDGES) {
  const pa = spotById.get(a), pb = spotById.get(b);
  check(!!pa && !!pb, `ponte com área sem posição: ${a} -> ${b}`);
  if (pa && pb) check(Math.hypot(pa.cx - pb.cx, pa.cy - pb.cy) < 26, `ponte longa demais: ${a} -> ${b}`);
}
const linked = new Set(CATALOG_BRIDGES.flat());
for (const spot of CATALOG_AREAS) {
  const viz = CATALOG_BRIDGES.filter(([a, b]) => a === spot.id || b === spot.id).length;
  check(viz >= 1 || CATALOG_TUNNELS.some(([t]) => t === spot.id), `${spot.id} sem caminho para ninguém`);
}
for (const [inter, d] of CATALOG_TUNNELS) {
  check(!!CATALOG_BY_ID.get(inter)?.links, `${inter} não é interseção`);
  check(!!DISCIPLINES[d], `túnel para disciplina inexistente: ${d}`);
}

// F2: toda área pronta precisa do pacote completo dentro do jogo
for (const item of CATALOG_CONTENT.areas) {
  const inGame = AREAS.find((a) => a.id === item.id);
  check(!!inGame, `${item.id} está no catálogo mas não no mapa`);
  const stations = SITES.filter((st) => st.post?.startsWith(`${item.id}-`));
  check(stations.length === 3, `${item.id} com ${stations.length} estações, esperado 3`);
  check(!!WAYSTONES.find((w) => w.id === item.id), `${item.id} sem farol`);
  check(!!NPC_SPAWNS.find((n) => n.id === CATALOG_CONTENT.grounds.find((g) => g.id === item.id)?.keeper), `${item.id} sem NPC no mapa`);
  const dungeon = DUNGEONS.find((d) => d.id === `dungeon-${item.id}`);
  check(!!dungeon, `${item.id} sem caverna`);
  if (dungeon) {
    check(dungeon.rooms.length === 10, `${item.id}: caverna com ${dungeon.rooms.length} salas`);
    check(dungeon.rooms.some((r) => r.kind === "city"), `${item.id}: caverna sem cidade`);
    check(typeof dungeon.boss === "string" && dungeon.boss.length > 3, `${item.id}: caverna sem chefe`);
  }
  const ground = GROUNDS.find((g) => g.id === item.id);
  check(!!ground && ground.monsters.length === 3, `${item.id} sem caçada de três monstros`);
  check(QUESTS.some((q) => q.id === `missao-${item.id}`), `${item.id} sem missão`);
  const own = ["1", "2", "3"].map((t) => (QUESTIONS[item.continent]?.[t] || []).filter((q) => q.why && q.q).length);
  check(own.every((n) => n > 0), `${item.id} sem perguntas no continente`);
  check(!!CATALOG_CONTENT.decor[item.id], `${item.id} sem família de decoração`);
  check(!!CATALOG_CONTENT.posts[`${item.id}-1`], `${item.id} sem página`);
}
check(AREAS.length === 16 + ready, `mapa com ${AREAS.length} áreas, esperado ${16 + ready}`);
check(QUESTS.length >= 42 + ready, `missões: ${QUESTS.length}, esperado ao menos ${42 + ready}`);

// cobertura do catálogo: as 82 seções têm área, caverna, NPC e missão no jogo
let cobertas = 0, semCaverna = [], semMissao = [], semArea = [];
for (const item of CATALOG) {
  const areaId = item.existing || item.id;
  const area = AREAS.find((a) => a.id === areaId);
  if (!area) { semArea.push(item.id); continue; }
  const dungeon = DUNGEONS.find((d) => d.id === `dungeon-${areaId}`);
  if (!dungeon) semCaverna.push(item.id);
  const npcsAqui = NPC_SPAWNS.filter((n) => world.areaAt
    ? n.x >= area.rect.x && n.x < area.rect.x + area.rect.w && n.y >= area.rect.y && n.y < area.rect.y + area.rect.h
    : false);
  const temMissao = npcsAqui.some((n) => QUESTS.some((q) => q.npc === n.id));
  if (!temMissao) semMissao.push(item.id);
  cobertas++;
}
check(cobertas === 82, `seções cobertas: ${cobertas}, esperado 82`);
check(semArea.length === 0, `seções sem área: ${semArea.join(", ")}`);
check(semCaverna.length === 0, `seções sem caverna: ${semCaverna.join(", ")}`);
check(semMissao.length === 0, `seções sem NPC com missão: ${semMissao.join(", ")}`);

// bicho-assinatura precisa de desenho e de ficha no bestiário, senão cai no chefe
const sigLine = source("../js/dungeon.js").split("\n").find((l) => l.includes("const signature =")) || "";
const sigKinds = [...sigLine.matchAll(/"([a-z]+)"/g)].map((m) => m[1]);
const labelsLine = source("../js/rpg.js").split("\n").find((l) => l.includes("const labels = {")) || "";
const creatureSrc = source("../js/creature.js");
check(sigKinds.length === 8, `bichos-assinatura: ${sigKinds.length}, esperado 8`);
for (const kind of sigKinds) {
  check(creatureSrc.includes(`kind === "${kind}"`), `sem desenho para ${kind}`);
  check(labelsLine.includes(`${kind}:`), `bestiário sem nome para ${kind}`);
}

assert.equal(faults.length, 0, `conteúdo com ${faults.length} problema(s):\n- ${faults.join("\n- ")}`);
console.log("ok conteúdo, estações, NPCs, missões, itens, receitas, perguntas, PvP, cavernas e mundo");

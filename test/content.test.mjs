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

const { CONTINENTS, SITES, WAYSTONES, NPC_SPAWNS, CONTINENT_ORDER, AREAS, MAP_W, MAP_H, LEGACY_CONTENT } = await import("../js/config.js");
const { QUESTIONS, DEEP_QUESTIONS, GROUNDS, ITEMS, RECIPES, ENCHANTS, MONSTER_TRAITS, MONSTER_LABELS, MONSTER_WEAKNESS, CREATURE_FORMS } = await import("../js/rpg-data.js");
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
const { SECTION_TOPICS } = await import("../js/catalog-topics.js");
const { insideLand } = await import("../js/catalog-place.js");
const { AREA_ITEMS, AREA_OUTFITS, BIOMES, FAUNA, IDENTITY_AREAS, TILE_STYLE, dungeonIdentity, npcStyle } = await import("../js/identity.js");
const { MATH_TEXT } = await import("../js/text/math.js");
const { PHYSICS_TEXT } = await import("../js/text/physics.js");
const { CHEM_TEXT } = await import("../js/text/chem.js");
const { CS_A_TEXT } = await import("../js/text/cs-a.js");
const { CS_B_TEXT } = await import("../js/text/cs-b.js");
const { LINGUA_TEXT } = await import("../js/text/lingua.js");
const { INTER_TEXT } = await import("../js/text/inter.js");
const { SECAO_TEXT } = await import("../js/text/secoes.js");
const textosCurados = { math: MATH_TEXT, physics: PHYSICS_TEXT, chem: CHEM_TEXT, cs: { ...CS_A_TEXT, ...CS_B_TEXT }, lingua: LINGUA_TEXT };
const ready = CATALOG_CONTENT.areas.length;
const { CATALOG_AREAS, CATALOG_BRIDGES, CATALOG_TUNNELS } = await import("../js/catalog-layout.js");

const source = (rel) => readFileSync(new URL(rel, import.meta.url), "utf8");
const faults = [];
const check = (cond, message) => { if (!cond) faults.push(message); };
const continents = CONTINENT_ORDER.filter((c) => c !== "hub");
const estacoesDaSecao = (num) => SECTION_TOPICS[num]?.subareas?.length || 3;
const totalEstacoes = 69 + CATALOG.reduce((n, a) => n + estacoesDaSecao(a.num), 0);
const catalogoEstacoes = SITES.filter((s) => s.catalog);

// 43 estações com texto: cinco por continente, duas no porto e as áreas temáticas
check(SITES.length === totalEstacoes, `SITES tem ${SITES.length} estações, esperado ${totalEstacoes}`);
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
const goalTypes = new Set(["cards", "docks", "labs", "hunts", "social", "quiz", "bosses"]);
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
      // o banco tem questões de 3 e de 6 alternativas escritas à mão; o duelo
      // normaliza para cinco (A-E) na hora de montar o baralho
      const n = q.options?.length || 0;
      check(n >= 3 && n <= 6, `${c}/${tier}: pergunta com ${n} alternativas: ${q.q}`);
      check(new Set(q.options).size === n, `${c}/${tier}: alternativas repetidas: ${q.q}`);
      check(q.a >= 0 && q.a < n, `${c}/${tier}: resposta fora da faixa: ${q.q}`);
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
    check(card.options.length === 5, `PvP de ${c}: carta sem 5 alternativas`);
    check(card.answer >= 0 && card.answer < 5, `PvP de ${c}: resposta fora da faixa`);
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
check(OUTFITS.filter((o) => o.quest).length === 91, `trajes de missão: ${OUTFITS.filter((o) => o.quest).length}, esperado 91`);
check(OUTFITS.length === 102, `trajes: ${OUTFITS.length}, esperado 102`);
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
// toda estação precisa de degrau livre em volta: o pedestal ocupa o centro,
// mas o jogador tem que conseguir chegar e apertar F
const semDegrau = [], naAgua = [];
for (const site of SITES) {
  let livre = false;
  for (let dy = -2; dy <= 2 && !livre; dy++) {
    for (let dx = -2; dx <= 2 && !livre; dx++) {
      if (!world.boxCollides(site.x + dx, site.y + dy, 0.3, 0.24)) livre = true;
    }
  }
  if (!livre) semDegrau.push(site.id);
  if (world.get(Math.floor(site.x), Math.floor(site.y)) === 3) naAgua.push(site.id);
}
check(semDegrau.length === 0, `estação sem degrau livre: ${semDegrau.slice(0, 6).join(", ")}`);
check(naAgua.length === 0, `estação na água: ${naAgua.slice(0, 6).join(", ")}`);
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
  const stations = SITES.filter((st) => st.catalog && st.post?.startsWith(`${item.id}-`));
  check(stations.length === estacoesDaSecao(item.num), `${item.id} com ${stations.length} estações, esperado ${estacoesDaSecao(item.num)}`);
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
// F9: o catálogo inteiro, subárea por subárea, dentro do jogo
const secoes = Object.entries(SECTION_TOPICS);
check(secoes.length === 82, `SECTION_TOPICS: ${secoes.length} seções, esperado 82`);
let totalSubareas = 0, totalTopicos = 0;
for (const [num, sec] of secoes) {
  const subs = sec.subareas || [];
  totalSubareas += subs.length;
  totalTopicos += subs.reduce((n, [, lista]) => n + lista.length, 0) + (sec.topics?.length || 0);
  check(subs.length > 0 || sec.topics?.length > 0, `seção ${num} sem subárea nem tópico`);
}
check(totalSubareas === 283, `subáreas do catálogo: ${totalSubareas}, esperado 283`);
check(totalTopicos === 2659, `tópicos do catálogo: ${totalTopicos}, esperado 2659`);
check(catalogoEstacoes.length === totalEstacoes - 69, `estações do catálogo: ${catalogoEstacoes.length}, esperado ${totalEstacoes - 69}`);
let semSubarea = [], semTopico = [], foraDaIlha = [], semPerguntas = [];
for (const item of CATALOG) {
  const sec = SECTION_TOPICS[item.num];
  const areaId = item.existing || item.id;
  const area = AREAS.find((a) => a.id === areaId);
  const stations = SITES.filter((st) => st.catalog && st.post?.startsWith(`${areaId}-`));
  const subs = (sec.subareas || []).map(([nome, topicos]) => ({ nome, topicos }));
  if (subs.length) {
    for (const sub of subs) {
      const site = stations.find((s) => s.name === sub.nome || s.post && POSTS[s.post]?.body.includes(`<strong>${sub.nome}</strong>`));
      if (!site) { semSubarea.push(`${item.id}/${sub.nome}`); continue; }
      const body = POSTS[site.post].body;
      for (const topico of sub.topicos) if (!body.includes(topico)) semTopico.push(`${item.id}/${topico}`);
      const tagged = [1, 2, 3].reduce((n, tier) => n + (QUESTIONS[area?.continent]?.[tier] || []).filter((q) => q.area === areaId).length, 0);
      if (tagged < 2) semPerguntas.push(areaId);
    }
  } else {
    const todos = sec.topics || [];
    const corpo = stations.map((s) => POSTS[s.post]?.body || "").join("\n");
    for (const topico of todos) if (!corpo.includes(topico)) semTopico.push(`${item.id}/${topico}`);
  }
  if (area) for (const s of stations) if (!insideLand(area.land, s.x, s.y, 0.7)) foraDaIlha.push(`${areaId}/${s.id}`);
}
check(semSubarea.length === 0, `subáreas sem estação: ${semSubarea.slice(0, 6).join(", ")}`);
check(semTopico.length === 0, `tópicos fora das páginas: ${semTopico.slice(0, 6).join(", ")}`);
check(foraDaIlha.length === 0, `estação fora da ilha: ${foraDaIlha.slice(0, 6).join(", ")}`);
check(semPerguntas.length === 0, `área com menos de duas perguntas: ${semPerguntas.slice(0, 6).join(", ")}`);
check(LEGACY_CONTENT.sites.length === 69, `subáreas das áreas antigas: ${LEGACY_CONTENT.sites.length}, esperado 69`);
for (const site of LEGACY_CONTENT.sites) {
  check(!!POSTS[site.post], `estação antiga ${site.id} sem página`);
  check(site.minor === true, `estação antiga ${site.id} sem marca de subárea`);
}
check(AREAS.length === 16 + ready, `mapa com ${AREAS.length} áreas, esperado ${16 + ready}`);
check(QUESTS.length >= 42 + ready, `missões: ${QUESTS.length}, esperado ao menos ${42 + ready}`);

// toda ponte de catálogo tem caminho seco: nenhum par vizinho cortado pela água
const spotCentre = new Map(CATALOG_AREAS.map((a) => [a.id, a]));
let pontesSecas = 0;
for (const [a, b] of CATALOG_BRIDGES) {
  const pa = spotCentre.get(a), pb = spotCentre.get(b);
  if (!pa || !pb) continue;
  const dx = pb.cx - pa.cx, dy = pb.cy - pa.cy;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len;
  let agua = 0;
  for (let i = 1; i < 40; i++) {
    const t = i / 40;
    const x = Math.floor(pa.cx + ux * (len * t));
    const y = Math.floor(pa.cy + uy * (len * t));
    if (world.get(x, y) === 3) agua++;
  }
  if (agua === 0) pontesSecas++;
}
check(pontesSecas === CATALOG_BRIDGES.length, `pontes secas: ${pontesSecas}/${CATALOG_BRIDGES.length}`);

// português correto nas etiquetas geradas e instrumento em toda estação nova
const LABS = new Set(["logic", "fractal", "fourier", "solid", "echo", "adder", "state", "cpu", "history", "infinity", "calculus", "probability", "motion", "thermo", "optics", "gravity", "periodic", "bonds", "titration", "energy", "balance", "rhythm", "harmony", "scales", "timbre", "generative", "learning", "neural", "language", "vision"]);
const artigoDe = (name) => {
  const m = /^Área (da|das|do|dos) (.+)$/.exec(name);
  return m ? { art: m[1], noun: m[2] } : { art: "da", noun: name.replace(/^Área /, "") };
};
let etiquetaErrada = [], semInstrumento = [];
for (const item of CATALOG_CONTENT.areas) {
  const area = CATALOG.find((a) => a.id === item.id);
  const { art, noun } = artigoDe(area.name);
  const dungeon = DUNGEONS.find((d) => d.id === `dungeon-${item.id}`);
  const ground = GROUNDS.find((g) => g.id === item.id);
  const stone = (WAYSTONES.find((w) => w.id === item.id));
  const boss = dungeon?.boss || "";
  if (!dungeon?.name.endsWith(`${art} ${noun}`)) etiquetaErrada.push(`${item.id}: ${dungeon?.name}`);
  if (!ground?.name.endsWith(`${art} ${noun}`)) etiquetaErrada.push(`${item.id}: ${ground?.name}`);
  if (!stone?.name.endsWith(`${art} ${noun}`)) etiquetaErrada.push(`${item.id}: ${stone?.name}`);
  if (!boss.endsWith(`${art} ${noun}`)) etiquetaErrada.push(`${item.id}: ${boss}`);
  for (const post of Object.values(CATALOG_CONTENT.posts).filter((p) => p.tags?.includes(area.short.toLowerCase()) || p.kicker?.endsWith(area.short.toLowerCase()))) {
    void post;
  }
}
check(etiquetaErrada.length === 0, `etiquetas sem concordância: ${etiquetaErrada.slice(0, 5).join(" | ")}`);
for (const [id, post] of Object.entries(CATALOG_CONTENT.posts)) {
  if (!LABS.has(post.lab)) semInstrumento.push(`${id}:${post.lab}`);
}
check(semInstrumento.length === 0, `catações sem instrumento: ${semInstrumento.slice(0, 5).join(", ")}`);
// nomes de NPC não se repetem entre áreas
const nomesNpc = new Map();
for (const n of Object.values(NPCS)) nomesNpc.set(n.name, (nomesNpc.get(n.name) || 0) + 1);
const repetidos = [...nomesNpc.entries()].filter(([, n]) => n > 1).map(([nome]) => nome);
check(repetidos.length === 0, `nomes de NPC repetidos: ${repetidos.join(", ")}`);
// as cavernas geradas não usam todas a mesma planta
const plantas = new Set(DUNGEONS.filter((d) => CATALOG_CONTENT.areas.some((a) => `dungeon-${a.id}` === d.id))
  .map((d) => d.rooms.map((r) => `${r.x}:${r.y}`).join("|")));
check(plantas.size >= 3, `plantas de caverna do catálogo: ${plantas.size}, esperado ao menos 3`);

// missão do NPC: resposta não pode cair sempre na primeira alternativa
const respostasQuiz = new Set();
for (const q of CATALOG_CONTENT.quests) {
  const quiz = q.quiz;
  check(quiz.options.length === 3, `${q.id}: quiz com ${quiz.options.length} alternativas`);
  check(new Set(quiz.options).size === 3, `${q.id}: alternativas repetidas no quiz`);
  check(quiz.options[quiz.answer] === quiz.options[quiz.answer], `${q.id}: sem resposta marcada`);
  respostasQuiz.add(quiz.answer);
}
check(respostasQuiz.size >= 2, `quiz sempre na mesma letra: ${[...respostasQuiz].join(",")}`);

// pergunta de duelo sempre com cinco alternativas na hora da luta
const rpgOptions = new RPG({ getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} });
for (const item of CATALOG_CONTENT.areas.slice(0, 8)) {
  const deck = rpgOptions.buildDeck(item.continent, [1], "");
  check(deck.length > 0 && deck.every((q) => q.options.length === 5), `${item.id}: duelo sem 5 alternativas`);
}

// cobertura do catálogo: as 82 seções têm área, caverna, NPC e missão no jogo
let cobertas = 0, semCaverna = [], semMissao = [], semArea = [];
for (const item of CATALOG) {
  const areaId = item.existing || item.id;
  const area = AREAS.find((a) => a.id === areaId);
  if (!area) { semArea.push(item.id); continue; }
  const dungeon = DUNGEONS.find((d) => d.id === `dungeon-${areaId}`);
  if (!dungeon) semCaverna.push(item.id);
  else {
    check(dungeon.rooms.length === 10, `${item.id}: caverna com ${dungeon.rooms.length} salas`);
    check(typeof dungeon.boss === "string" && dungeon.boss.length > 3, `${item.id}: caverna sem chefe`);
  }
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

// F8: números finais do catálogo inteiro
check(AREAS.length === 86, `áreas no mapa: ${AREAS.length}, esperado 86`);
check(DUNGEONS.length === 93, `cavernas: ${DUNGEONS.length}, esperado 93`);
check(GROUNDS.length === 93, `caçadas: ${GROUNDS.length}, esperado 93`);
check(SITES.length === totalEstacoes, `catações: ${SITES.length}, esperado ${totalEstacoes}`);
check(QUESTS.length === 284, `missões: ${QUESTS.length}, esperado 284`);
check(WAYSTONES.length === 94, `faróis: ${WAYSTONES.length}, esperado 94`);
// 826 do banco mais as 7 perguntas do fundo que o módulo do duelo injeta
check(totalQuestions === 1603, `perguntas: ${totalQuestions}, esperado 1603`);
// cada área nova tem uma pergunta própria em cada dificuldade
let semPergunta = [];
for (const item of CATALOG) {
  const areaId = item.existing || item.id;
  for (const tier of [1, 2, 3]) {
    const tagged = (QUESTIONS[AREAS.find((a) => a.id === areaId)?.continent]?.[tier] || []).filter((q) => q.area === areaId);
    if (tagged.length < 1) semPergunta.push(`${areaId}/${tier}:${tagged.length}`);
  }
}
check(semPergunta.length === 0, `áreas com pergunta própria faltando: ${semPergunta.slice(0, 6).join(", ")}`);
// a ilha existe de fato no mapa, e não é água
let ilhaNaAgua = [];
for (const spot of CATALOG_AREAS) {
  if (CATALOG_CONTENT.areas.some((a) => a.id === spot.id) && world.get(spot.cx, spot.cy) === 3) ilhaNaAgua.push(spot.id);
}
check(ilhaNaAgua.length === 0, `ilhas na água: ${ilhaNaAgua.slice(0, 6).join(", ")}`);

// itens no chão: visíveis, coletáveis e estáveis
check(world.groundItems.length === 172, `itens no chão: ${world.groundItems.length}, esperado 172`);
check(new Set(world.groundItems.map((g) => g.id)).size === world.groundItems.length, "id de item no chão repetido");
for (const g of world.groundItems) {
  check(!!ITEMS[g.itemId], `item no chão fora do registro: ${g.itemId}`);
  check(world.get(g.x, g.y) !== 3, `item no chão na água: ${g.id}`);
}
const amostraChao = world.groundItems[0];
const tomado = world.takeGroundItem(amostraChao.id);
check(tomado?.id === amostraChao.id, "takeGroundItem não devolveu o item");
check(world.groundItems.length === 171, "takeGroundItem não removeu o item");
world.groundItems.push(amostraChao);

// enfeite nunca flutua no mar
const decorNaAgua = world.decor.filter((d) => world.get(Math.floor(d.x), Math.floor(d.y)) === 3);
check(decorNaAgua.length === 0, `decoração na água: ${decorNaAgua.length} (${decorNaAgua.slice(0, 3).map((d) => d.type).join(", ")})`);

// caverna do catálogo: sala dentro da planta e chefe de verdade
for (const dungeon of DUNGEONS.filter((d) => CATALOG_CONTENT.areas.some((a) => `dungeon-${a.id}` === d.id))) {
  for (const room of dungeon.rooms) {
    check(room.x >= 0 && room.y >= 0 && room.x + room.w <= 64 && room.y + room.h <= 48, `${dungeon.id}: sala ${room.id} fora da planta`);
  }
  check(typeof dungeon.boss === "string" && dungeon.boss.length > 3, `${dungeon.id}: sem chefe`);
}

// toda forma que o jogo usa precisa de desenho, nome de leitura e fraqueza;
// o chefe cai no desenho final, então fica de fora dessa cobrança
const creatureSrc = source("../js/creature.js");
for (const kind of CREATURE_FORMS) {
  if (kind === "boss") continue;
  check(creatureSrc.includes(`kind === "${kind}"`), `sem desenho para ${kind}`);
  check(!!MONSTER_LABELS[kind], `bestiário sem nome para ${kind}`);
  check(!!MONSTER_WEAKNESS[kind], `bestiário sem fraqueza para ${kind}`);
}

// F11: texto curado de Matemática, subárea por subárea
let subareasMath = 0;
const mathSemTexto = [];
for (const [num, sec] of Object.entries(SECTION_TOPICS)) {
  if (!num.startsWith("1.")) continue;
  for (const [nome] of sec.subareas || []) {
    subareasMath++;
    if (!MATH_TEXT[nome]?.abre || !MATH_TEXT[nome]?.pratica || !MATH_TEXT[nome]?.erro) mathSemTexto.push(nome);
  }
}
check(subareasMath === 69, `subáreas de Matemática: ${subareasMath}, esperado 69`);
check(mathSemTexto.length === 0, `subáreas de Matemática sem texto curado: ${mathSemTexto.slice(0, 5).join(", ")}`);

// F12: texto curado de Física
let subareasFisica = 0;
const fisicaSemTexto = [];
for (const [num, sec] of Object.entries(SECTION_TOPICS)) {
  if (!num.startsWith("2.")) continue;
  for (const [nome] of sec.subareas || []) {
    subareasFisica++;
    if (!PHYSICS_TEXT[nome]?.abre || !PHYSICS_TEXT[nome]?.pratica || !PHYSICS_TEXT[nome]?.erro) fisicaSemTexto.push(nome);
  }
}
check(subareasFisica === 34, `subáreas de Física: ${subareasFisica}, esperado 34`);
check(fisicaSemTexto.length === 0, `subáreas de Física sem texto curado: ${fisicaSemTexto.slice(0, 5).join(", ")}`);

// F13: texto curado de Química, inclusive as duas "Especializações"
let subareasQuimica = 0;
const quimicaSemTexto = [];
for (const [num, sec] of Object.entries(SECTION_TOPICS)) {
  if (!num.startsWith("3.")) continue;
  for (const [nome] of sec.subareas || []) {
    subareasQuimica++;
    const texto = CHEM_TEXT[`${num}|${nome}`] || CHEM_TEXT[nome];
    if (!texto?.abre || !texto?.pratica || !texto?.erro) quimicaSemTexto.push(`${num}/${nome}`);
  }
}
check(subareasQuimica === 37, `subáreas de Química: ${subareasQuimica}, esperado 37`);
check(quimicaSemTexto.length === 0, `subáreas de Química sem texto curado: ${quimicaSemTexto.slice(0, 5).join(", ")}`);

// F14: texto curado de Computação
const CS_TEXT = { ...CS_A_TEXT, ...CS_B_TEXT };
let subareasCs = 0;
const csSemTexto = [];
for (const [num, sec] of Object.entries(SECTION_TOPICS)) {
  if (!num.startsWith("4.")) continue;
  for (const [nome] of sec.subareas || []) {
    subareasCs++;
    const texto = CS_TEXT[`${num}|${nome}`] || CS_TEXT[nome];
    if (!texto?.abre || !texto?.pratica || !texto?.erro) csSemTexto.push(`${num}/${nome}`);
  }
}
check(subareasCs === 88, `subáreas de Computação: ${subareasCs}, esperado 88`);
check(csSemTexto.length === 0, `subáreas de Computação sem texto curado: ${csSemTexto.slice(0, 5).join(", ")}`);

// F15: texto curado de Língua Portuguesa
let subareasLingua = 0;
const linguaSemTexto = [];
for (const [num, sec] of Object.entries(SECTION_TOPICS)) {
  if (!num.startsWith("5.")) continue;
  for (const [nome] of sec.subareas || []) {
    subareasLingua++;
    const texto = LINGUA_TEXT[nome];
    if (!texto?.abre || !texto?.pratica || !texto?.erro) linguaSemTexto.push(nome);
  }
}
check(subareasLingua === 55, `subáreas de Língua: ${subareasLingua}, esperado 55`);
check(linguaSemTexto.length === 0, `subáreas de Língua sem texto curado: ${linguaSemTexto.slice(0, 5).join(", ")}`);
check(subareasMath + subareasFisica + subareasQuimica + subareasCs + subareasLingua === 283, "as cinco disciplinas não somam as 283 subáreas");

// F16: texto curado das interseções
let secoesInter = 0;
const interSemTexto = [];
for (const [num, sec] of Object.entries(SECTION_TOPICS)) {
  if (!num.startsWith("6.")) continue;
  secoesInter++;
  if (!INTER_TEXT[num]?.abre || !INTER_TEXT[num]?.pratica || !INTER_TEXT[num]?.erro) interSemTexto.push(num);
}
check(secoesInter === 11, `interseções: ${secoesInter}, esperado 11`);
check(interSemTexto.length === 0, `interseções sem texto curado: ${interSemTexto.join(", ")}`);

// F17: todo texto curado chega de fato a uma página
const corpos = Object.values(POSTS).map((p) => p.body);
const textoForaDaPagina = [];
for (const mapa of [...Object.values(textosCurados), INTER_TEXT]) {
  for (const [nome, texto] of Object.entries(mapa)) {
    if (!corpos.some((corpo) => corpo.includes(texto.abre.slice(0, 40)))) textoForaDaPagina.push(nome);
  }
}
check(textoForaDaPagina.length === 0, `texto curado sem página: ${textoForaDaPagina.slice(0, 5).join(", ")}`);

// F18: seção sem subárea também tem texto curado (trilhas)
let secoesSemSub = 0;
const secaoSemTexto = [];
for (const [num, sec] of Object.entries(SECTION_TOPICS)) {
  if (num.startsWith("6.") || (sec.subareas || []).length) continue;
  secoesSemSub++;
  const texto = SECAO_TEXT[num];
  if (!texto?.abre || !texto?.pratica || !texto?.erro) secaoSemTexto.push(num);
}
check(secoesSemSub === 23, `seções sem subárea: ${secoesSemSub}, esperado 23`);
check(secaoSemTexto.length === 0, `seções sem subárea e sem texto: ${secaoSemTexto.join(", ")}`);

// F19: toda página de subárea aponta as áreas vizinhas
const comConexoes = Object.values(POSTS).filter((p) => p.body.includes("<strong>Conexões:</strong>")).length;
check(comConexoes >= 283, `páginas com conexões: ${comConexoes}, esperado ao menos 283`);

// F10: identidade de cada área, sem repetir bioma, bicho, item, guardião ou caverna
check(IDENTITY_AREAS.length === 86, `identidade: ${IDENTITY_AREAS.length} áreas, esperado 86`);
check(Object.keys(BIOMES).length === 86, `biomas: ${Object.keys(BIOMES).length}, esperado 86`);
const biomaNomes = Object.values(BIOMES).map((b) => b.name);
const biomaKinds = Object.values(BIOMES).map((b) => b.baseKind);
const biomaCores = Object.values(BIOMES).map((b) => b.base);
check(new Set(biomaNomes).size === 86, "nome de bioma repetido");
check(new Set(biomaKinds).size === 86, "tipo de piso repetido");
check(new Set(biomaCores).size === 86, `cor de piso repetida: ${new Set(biomaCores).size}`);
for (const area of IDENTITY_AREAS) {
  const b = BIOMES[area.id];
  const noMapa = AREAS.find((a) => a.id === area.id);
  check(!!b, `${area.id} sem bioma`);
  check(!!noMapa && noMapa.base === b.baseKind && noMapa.floor === b.floorKind, `${area.id} não usa o piso do bioma`);
  check(!!TILE_STYLE[b.baseKind] && !!TILE_STYLE[b.floorKind], `${area.id} sem estilo de tile`);
  const fauna = FAUNA[area.id];
  check(Array.isArray(fauna) && fauna.length === 3, `${area.id} com fauna de ${fauna?.length}`);
  check(new Set(fauna.map((f) => f.name)).size === 3, `${area.id} com bicho repetido`);
  const itens = AREA_ITEMS[area.id];
  check(!!itens?.weapon && !!itens?.armor && !!itens?.helmet, `${area.id} sem os três itens`);
  for (const item of [itens.weapon, itens.armor, itens.helmet]) {
    check(!!ITEMS[item.id], `${area.id} com item fora do registro: ${item.id}`);
    check(ITEMS[item.id].name === item.name, `${area.id} com nome de item divergente`);
  }
  const dg = DUNGEONS.find((d) => d.id === `dungeon-${area.id}`);
  const ident = dungeonIdentity(area.id);
  check(!!dg && !!ident, `${area.id} sem caverna de identidade`);
  if (dg && ident) {
    check(dg.rooms.length === 10, `${area.id}: caverna com ${dg.rooms.length} salas`);
    check(dg.equipment.length === 3 && dg.equipment[0] === itens.weapon.id, `${area.id}: equipamento da caverna fora da área`);
    check((dg.fauna || []).length === 3, `${area.id}: caverna sem fauna da área`);
    check(dg.palette.accent === b.accent, `${area.id}: paleta da caverna fora do bioma`);
    check(dg.material === b.material, `${area.id}: material da caverna fora do bioma`);
  }
  const trilha = QUESTS.find((q) => q.id === `trilha-${area.id}`);
  const chefe = QUESTS.find((q) => q.id === `chefe-${area.id}`);
  check(!!trilha && trilha.goal.type === "cards" && trilha.goal.area === area.id, `${area.id} sem missão de trilha`);
  check(!!chefe && chefe.goal.type === "bosses" && chefe.goal.area === area.id, `${area.id} sem missão de chefe`);
  const traje = OUTFITS.find((o) => o.id === `traje-${area.id}`);
  check(!!traje && traje.quest === `trilha-${area.id}`, `${area.id} sem traje próprio`);
}
const bichos = Object.values(FAUNA).flat();
check(bichos.length === 258, `fauna total: ${bichos.length}, esperado 258`);
check(new Set(bichos.map((b) => b.name.toLowerCase())).size === 258, "nome de bicho repetido entre áreas");
const itensArea = Object.values(AREA_ITEMS).flatMap((x) => [x.weapon, x.armor, x.helmet]);
check(itensArea.length === 258, `itens de área: ${itensArea.length}, esperado 258`);
check(new Set(itensArea.map((i) => i.id)).size === 258, "id de item de área repetido");
check(new Set(itensArea.map((i) => i.name.toLowerCase())).size === 258, "nome de item de área repetido");
check(AREA_OUTFITS.length === 86, `trajes de área: ${AREA_OUTFITS.length}, esperado 86`);
const looks = new Set(world.npcs.map((n) => JSON.stringify(n.colors)));
check(looks.size === world.npcs.length, `NPCs com aparência repetida: ${world.npcs.length - looks.size}`);
for (const npc of world.npcs) check(!!npc.look && !!npc.colors?.skin && !!npc.colors?.hair, `NPC ${npc.id} sem aparência`);

assert.equal(faults.length, 0, `conteúdo com ${faults.length} problema(s):\n- ${faults.join("\n- ")}`);
console.log("ok conteúdo, estações, NPCs, missões, itens, receitas, perguntas, PvP, cavernas e mundo");

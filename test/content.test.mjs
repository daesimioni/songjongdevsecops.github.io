// Conferência do conteúdo do Vale Partido: áreas, estações e páginas de lore,
// NPCs, cavernas, caçadas, missões, itens e o reskin de fantasia. Roda sem
// navegador; o teste cobra cobertura, não sobra de ilha vazia.

import assert from "node:assert/strict";

globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} };

const { CONTINENTS, CONTINENT_ORDER, AREAS, SITES, WAYSTONES, NPC_SPAWNS } = await import("../src/content/config.js");
const { MAP_W, MAP_H } = await import("../src/core/runtime-config.js");
const { POSTS, NPCS } = await import("../src/content/content.js");
const { DUNGEONS } = await import("../src/content/dungeon-data.js");
const { GROUNDS, ITEMS, RELICS, RECIPES, ENCHANTS, TROCAS, SKILLS } = await import("../src/content/rpg-data.js");
const { QUESTS } = await import("../src/gameplay/quests.js");
const { CATALOG_CONTENT } = await import("../src/content/catalog-gen.js");
const { VOCACOES } = await import("../src/content/vocations.js");
const { OUTFITS } = await import("../src/content/outfits.js");
const { PETS } = await import("../src/content/pets.js");

const faults = [];
const check = (ok, msg) => { if (!ok) faults.push(msg); };
const idsUnicos = (lista, rotulo) => {
  const ids = lista.map((x) => x.id);
  check(new Set(ids).size === ids.length, `${rotulo}: id repetido`);
};

// ---- mapa e áreas ----
check(AREAS.length >= 80, `áreas no mapa: ${AREAS.length}`);
check(Object.keys(CONTINENTS).length === 8, `continentes: ${Object.keys(CONTINENTS).length}`);
check(CONTINENT_ORDER.every((id) => CONTINENTS[id]), "continente da ordem sem definição");
idsUnicos(AREAS, "áreas");
check(new Set(AREAS.map((a) => a.name)).size === AREAS.length, "nome de área repetido");
for (const area of AREAS) {
  check(!!CONTINENTS[area.continent], `área ${area.id}: continente ${area.continent} não existe`);
  const r = area.rect;
  check(r && r.w > 0 && r.h > 0, `área ${area.id}: retângulo vazio`);
  check(r.x >= 0 && r.y >= 0 && r.x + r.w <= MAP_W && r.y + r.h <= MAP_H, `área ${area.id}: fora do mapa`);
}

// ---- estações e páginas de lore ----
check(SITES.length >= 250, `estações: ${SITES.length}`);
idsUnicos(SITES, "estações");
check(new Set(SITES.map((s) => s.post)).size === SITES.length, "post de estação repetido");
for (const site of SITES) {
  const post = POSTS[site.post];
  check(!!post, `estação ${site.id}: post ${site.post} ausente`);
  if (!post) continue;
  check(!!CONTINENTS[site.continent], `estação ${site.id}: continente inválido`);
  check(String(post.title || "").length >= 3, `estação ${site.id}: título curto`);
  check(String(post.body || "").includes("<p>"), `estação ${site.id}: página sem lore`);
}
check(WAYSTONES.length >= 90, `pedras de viagem: ${WAYSTONES.length}`);
idsUnicos(WAYSTONES, "pedras de viagem");
check(SITES.every((s) => s.x >= 0 && s.y >= 0 && s.x < MAP_W && s.y < MAP_H), "estação fora do mapa");

// ---- NPCs ----
check(NPCS && Object.keys(NPCS).length >= 190, `NPCs: ${Object.keys(NPCS).length}`);
const nomesNpc = Object.values(NPCS).map((n) => n.name);
check(new Set(nomesNpc).size === nomesNpc.length, "nome de NPC repetido");
idsUnicos(NPC_SPAWNS, "spawns de NPC");
for (const spawn of NPC_SPAWNS) {
  const ficha = NPCS[spawn.id];
  check(!!ficha, `spawn ${spawn.id}: ficha ausente`);
  check(Array.isArray(ficha?.lines) && ficha.lines.length >= 3, `NPC ${spawn.id}: poucas falas`);
}
const instrutores = GROUNDS.filter((g) => g.trainer);
check(instrutores.length >= 60, `instrutores: ${instrutores.length}`);
for (const g of instrutores) check(!!NPCS[g.trainer], `caçada ${g.id}: instrutor ausente`);

// ---- cavernas e caçadas ----
check(DUNGEONS.length === 93, `cavernas: ${DUNGEONS.length}`);
idsUnicos(DUNGEONS, "cavernas");
for (const def of DUNGEONS) {
  check(String(def.name || "").length >= 6, `caverna ${def.id}: nome curto`);
  check(Array.isArray(def.rooms) && def.rooms.length >= 8, `caverna ${def.id}: poucas salas`);
  check(typeof def.boss === "string" && def.boss.length >= 4, `caverna ${def.id}: sem chefe`);
  check(Array.isArray(def.monsters) && def.monsters.length >= 6, `caverna ${def.id}: poucos monstros`);
  check(def.equipment.every((id) => ITEMS[id]), `caverna ${def.id}: equipamento inexistente`);
  check(!!def.palette?.accent, `caverna ${def.id}: sem paleta`);
}
check(GROUNDS.length >= 90, `caçadas: ${GROUNDS.length}`);
for (const g of GROUNDS) {
  check(!!CONTINENTS[g.continent], `caçada ${g.id}: continente inválido`);
  if (g.keeper) check(!!NPCS[g.keeper], `caçada ${g.id}: guardião ausente`);
  check(g.monsters.length === 3, `caçada ${g.id}: ${g.monsters.length} monstros`);
  check(!!g.boss?.name, `caçada ${g.id}: sem chefe`);
  check(g.loot.every((id) => ITEMS[id]), `caçada ${g.id}: saque inexistente`);
  check(!!ITEMS[g.bossLoot], `caçada ${g.id}: saque do chefe inexistente`);
}

// ---- missões ----
check(QUESTS.length >= 250, `missões: ${QUESTS.length}`);
idsUnicos(QUESTS, "missões");
const TIPOS = new Set(["cards", "docks", "hunts", "social", "bosses"]);
for (const q of QUESTS) {
  check(String(q.title || "").length >= 4, `missão ${q.id}: título curto`);
  check(!!TIPOS.has(q.goal?.type), `missão ${q.id}: tipo ${q.goal?.type}`);
  const contagem = q.goal?.type === "social" ? (q.goal.keys?.length || 0) : q.goal?.count;
  check(Number.isFinite(contagem) && contagem > 0, `missão ${q.id}: contagem inválida`);
  check(!("quiz" in q), `missão ${q.id}: ainda tem pergunta`);
  check(!q.labs, `missão ${q.id}: ainda tem laboratório`);
  if (q.reward?.item) check(!!ITEMS[q.reward.item], `missão ${q.id}: prêmio inexistente`);
  if (q.reward?.title) check(typeof q.reward.title === "string", `missão ${q.id}: título de recompensa inválido`);
}
check(QUESTS.every((q) => typeof q.giver === "string" && q.giver.length >= 2), "missão sem quem pede");

// ---- itens, receitas e vocações ----
const SLOTS = new Set(["weapon", "helmet", "armor", "legs", "boots", "shield", "cloak", "ring", "necklace"]);
for (const [id, item] of Object.entries(ITEMS)) {
  if (!item || typeof item !== "object") continue;
  check(String(item.name || "").length >= 2, `item ${id}: sem nome`);
  if (item.slot) check(SLOTS.has(item.slot), `item ${id}: slot ${item.slot}`);
  if (item.desc) check(!/[<>]/.test(item.desc), `item ${id}: HTML na descrição`);
}
for (const [area, relic] of Object.entries(RELICS)) check(ITEMS[relic.id], `relíquia de ${area} fora do catálogo`);
for (const r of RECIPES) {
  check(!!ITEMS[r.out], `receita ${r.id}: saída inexistente`);
  check(Object.keys(r.need).every((id) => ITEMS[id]), `receita ${r.id}: insumo inexistente`);
}
for (const e of ENCHANTS) check(Object.keys(e.need || {}).every((id) => ITEMS[id]), `encanto ${e.id}: insumo inexistente`);
for (const t of TROCAS) check(!!ITEMS[t.de] && !!ITEMS[t.para], `troca ${t.id}: item inexistente`);
check(Object.keys(SKILLS).length === 6, `perícias: ${Object.keys(SKILLS).length}`);
check(VOCACOES.length === 5, `vocações: ${VOCACOES.length}`);
check(OUTFITS.length >= 90, `trajes: ${OUTFITS.length}`);
check(Object.keys(PETS).length === 7, `companheiros: ${Object.keys(PETS).length}`);

// ---- os sistemas de estudo não existem mais ----
check(CATALOG_CONTENT.questions === undefined, "o gerador ainda produz perguntas");
check(CATALOG_CONTENT.labs === undefined, "o gerador ainda produz laboratórios");
const rpgData = await import("../src/content/rpg-data.js");
check(rpgData.QUESTIONS === undefined, "rpg-data ainda exporta o banco de perguntas");

// ---- reskin: o que o jogador lê é fantasia, sem aula ----
const { aplicarReskin } = await import("../src/gameplay/reskin.js");
aplicarReskin();
for (const site of SITES) {
  const post = POSTS[site.post];
  check(post.lab == null, `estação ${site.id}: ainda tem laboratório`);
  check(Array.isArray(post.tags) && post.tags.includes("lore"), `estação ${site.id}: página sem a tag lore`);
}
const estudo = /pergunta|resposta|prova|teorema|axioma|matem[áa]t|f[íi]sic|qu[íi]mic|computa|algorit|l[óo]gica|gram[áa]t|m[úu]sica|disciplina|conceito|aprend|ensin|escola|professor|aluno|wiki|acervo|biblioteca/i;
const textosVisiveis = [
  ...AREAS.map((a) => `${a.name} ${a.sub || ""}`),
  ...SITES.map((s) => s.name),
  ...WAYSTONES.map((w) => w.name),
  ...Object.values(NPCS).flatMap((n) => [n.name, n.label || "", ...(n.lines || [])]),
  ...QUESTS.flatMap((q) => [q.title, q.brief, q.reward?.title || ""]),
  ...Object.values(ITEMS).filter((i) => i && typeof i === "object").map((i) => `${i.name} ${i.desc || ""}`),
  ...Object.values(PETS).flatMap((p) => [p.name, p.where, p.ability?.desc || ""]),
  ...OUTFITS.flatMap((o) => [o.name, o.desc]),
  ...Object.entries(CONTINENTS).map(([, c]) => `${c.name} ${c.sub}`),
];
const vazando = [...new Set(textosVisiveis.filter((t) => estudo.test(t)))];
check(vazando.length === 0, `texto de estudo na superfície: ${vazando.slice(0, 5).join(" | ")}`);
check(new Set(SITES.map((s) => s.name)).size === SITES.length, "estação com nome repetido depois do reskin");
check(new Set(AREAS.map((a) => a.name)).size === AREAS.length, "área com nome repetido depois do reskin");
check(new Set(WAYSTONES.map((w) => w.name)).size === WAYSTONES.length, "farol com nome repetido depois do reskin");

if (faults.length) {
  console.error(`conteúdo com ${faults.length} problema(s):\n- ${faults.slice(0, 20).join("\n- ")}`);
  process.exit(1);
}
console.log(`ok conteúdo: ${AREAS.length} áreas, ${SITES.length} estações, ${Object.keys(NPCS).length} NPCs, ${DUNGEONS.length} cavernas, ${QUESTS.length} missões, ${Object.keys(ITEMS).length} itens, sem pergunta`);

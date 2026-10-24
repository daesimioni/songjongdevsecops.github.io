// A wiki nasce dos mesmos dados do jogo: o índice tem que bater com as áreas,
// cavernas, criaturas, itens, missões, NPCs, páginas e vocações, a busca tem que
// achar sem acento e a página tem que abrir. Roda sem navegador:
// node test/wiki.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";

globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} };

const wiki = await import("../src/ui/wiki.js");
const { AREAS } = await import("../src/content/config.js");
const { DUNGEONS } = await import("../src/content/dungeon-data.js");
const { ITEMS, RELICS, RECIPES, ENCHANTS, SKILLS, TIERS } = await import("../src/content/rpg-data.js");
const { PETS, MOUNTS } = await import("../src/content/pets.js");
const { OUTFITS } = await import("../src/content/outfits.js");
const { QUESTS } = await import("../src/gameplay/quests.js");
const { NPCS, POSTS } = await import("../src/content/content.js");
const { FAUNA } = await import("../src/content/identity.js");
const { CAPITULOS } = await import("../src/gameplay/arcos.js");
const { FACCOES } = await import("../src/gameplay/faccoes.js");
const { DESFECHOS } = await import("../src/gameplay/grande-prova.js");
const { VOCACOES } = await import("../src/content/vocations.js");

const problemas = [];
const check = (ok, msg) => { if (!ok) problemas.push(msg); };

const indice = wiki.construirIndice();
const contagem = {};
for (const e of indice) contagem[e.cat] = (contagem[e.cat] || 0) + 1;

// ---- o índice cobre o jogo inteiro, sem inventar nem perder ----
const bichos = Object.values(FAUNA).flat().length;
const chefes = DUNGEONS.filter((d) => d.boss).length;
check(contagem.mundo === AREAS.length, `mundo: ${contagem.mundo}, esperado ${AREAS.length}`);
check(contagem.cavernas === DUNGEONS.length, `cavernas: ${contagem.cavernas}, esperado ${DUNGEONS.length}`);
check(contagem.criaturas === bichos + chefes, `criaturas: ${contagem.criaturas}, esperado ${bichos + chefes}`);
check(contagem.itens === Object.values(ITEMS).filter((i) => i?.name).length, `itens: ${contagem.itens}, esperado ${Object.values(ITEMS).filter((i) => i?.name).length}`);
check(contagem.missoes === QUESTS.length, `missões: ${contagem.missoes}, esperado ${QUESTS.length}`);
check(contagem.npcs === Object.keys(NPCS).length, `NPCs: ${contagem.npcs}, esperado ${Object.keys(NPCS).length}`);
check(contagem.paginas === Object.keys(POSTS).length, `páginas: ${contagem.paginas}, esperado ${Object.keys(POSTS).length}`);
check(contagem.vocacoes === VOCACOES.length, `vocações: ${contagem.vocacoes}, esperado ${VOCACOES.length}`);
check(contagem.receitas === RECIPES.length, `receitas: ${contagem.receitas}, esperado ${RECIPES.length}`);
check(contagem.encantamentos === ENCHANTS.length, `encantamentos: ${contagem.encantamentos}, esperado ${ENCHANTS.length}`);
check(contagem.reliquias === Object.keys(RELICS).length, `relíquias: ${contagem.reliquias}, esperado ${Object.keys(RELICS).length}`);
check(contagem.pets === Object.keys(PETS).length + Object.keys(MOUNTS).length, `pets: ${contagem.pets}, esperado ${Object.keys(PETS).length + Object.keys(MOUNTS).length}`);
check(contagem.trajes === OUTFITS.length, `trajes: ${contagem.trajes}, esperado ${OUTFITS.length}`);
check(contagem.sistemas === Object.keys(TIERS).length + Object.keys(SKILLS).length + wiki.COMO_JOGAR.length, `sistemas: ${contagem.sistemas}, esperado ${Object.keys(TIERS).length + Object.keys(SKILLS).length + wiki.COMO_JOGAR.length}`);
check(contagem.historia === CAPITULOS.length + FACCOES.length + DESFECHOS.length + 1, "história incompleta");
check(contagem.tudo === undefined, "categoria tudo não é uma entrada do índice");

const cats = wiki.categoriasDaWiki(indice);
check(cats.find((c) => c.id === "tudo")?.total === indice.length, "total de tudo não bate com o índice");
for (const c of cats) {
  if (c.id === "tudo") continue;
  check(c.total === contagem[c.id], `aba ${c.id}: ${c.total} contra ${contagem[c.id]} no índice`);
}

// ---- cada entrada tem nome, categoria válida e busca normalizada ----
const catsValidas = new Set(cats.map((c) => c.id));
for (const e of indice) {
  check(!!e.nome && String(e.nome).trim().length > 0, `entrada sem nome na categoria ${e.cat}`);
  check(catsValidas.has(e.cat), `categoria inválida: ${e.cat}`);
  check(typeof e.busca === "string" && e.busca === e.busca.toLowerCase(), `busca não normalizada em ${e.nome}`);
  check(e.busca === e.busca.normalize("NFD").replace(/[\u0300-\u036f]/g, ""), `busca com acento em ${e.nome}`);
  check(Array.isArray(e.campos), `campos não é lista em ${e.nome}`);
}

// ---- fichas com imagem: item, bicho, pet e relíquia ----
const comIcone = indice.filter((e) => e.icone);
check(comIcone.length >= 1100, `só ${comIcone.length} fichas com ícone, esperado ao menos 1100`);
for (const e of comIcone) {
  check(["item", "bicho", "pet", "gema", "bioma", "caverna", "traje", "npc"].includes(e.icone.tipo), `ícone de tipo inválido em ${e.nome}: ${e.icone.tipo}`);
}
check(indice.some((e) => e.icone?.tipo === "item"), "nenhum item com ícone");
check(indice.some((e) => e.icone?.tipo === "bicho"), "nenhum bicho com icon");
check(indice.some((e) => e.icone?.tipo === "gema"), "nenhuma relíquia com gema");
check(indice.some((e) => e.icone?.tipo === "bioma"), "nenhuma área com chip de bioma");
check(indice.some((e) => e.icone?.tipo === "caverna"), "nenhuma caverna com boca");
check(indice.some((e) => e.icone?.tipo === "traje"), "nenhum traje com busto");

// ---- páginas abrem; só páginas têm atalho ----
for (const e of indice.filter((x) => x.cat === "paginas")) {
  check(!!e.abrir && !!POSTS[e.abrir], `página sem atalho válido: ${e.nome}`);
}
for (const e of indice.filter((x) => x.cat !== "paginas")) {
  check(!e.abrir, `atalho de página fora de páginas: ${e.nome}`);
}

// ---- busca: sem acento, por categoria e com prioridade no nome ----
const semAcento = wiki.buscarNaWiki("logica", "tudo", 100);
check(semAcento.length >= 10, `busca "logica" devolveu ${semAcento.length}`);
const paginasCalculo = wiki.buscarNaWiki("calculo", "paginas", 10);
check(paginasCalculo.length >= 3, `busca "calculo" em páginas devolveu ${paginasCalculo.length}`);
check(paginasCalculo.every((e) => e.cat === "paginas"), "filtro de categoria vazou outra categoria");
check(paginasCalculo[0].nome.toLowerCase().startsWith("cálculo"), `prioridade do nome falhou: ${paginasCalculo[0].nome}`);
check(wiki.buscarNaWiki("calculo", "paginas", 2).length === 2, "limite da busca não respeitado");
check(wiki.buscarNaWiki("", "cavernas", 5).length === 5, "busca vazia não devolve página da categoria");
check(wiki.buscarNaWiki("zzzznaoexiste", "tudo").length === 0, "busca impossível devolveu resultado");

// ---- campos conferem com a fonte ----
const areaJogo = indice.find((e) => e.cat === "mundo" && e.nome === AREAS[0].name);
check(!!areaJogo && areaJogo.campos.some(([r, v]) => r === "Disciplina" && v), "área sem disciplina");
const caverna = indice.find((e) => e.cat === "cavernas" && e.nome === DUNGEONS[0].name);
check(!!caverna && caverna.campos.some(([r, v]) => r === "Chefe" && v === DUNGEONS[0].boss), "caverna sem chefe");
const missao = indice.find((e) => e.cat === "missoes" && e.nome === QUESTS[0].title);
check(!!missao && missao.campos.some(([r]) => r === "Recompensa"), "missão sem recompensa");

// ---- link direto separa categoria e nome ----
const linkItem = wiki.separarConsulta("itens:Espada da Prova");
check(linkItem.categoria === "itens" && linkItem.termo === "Espada da Prova", `link de item errado: ${JSON.stringify(linkItem)}`);
const linkSolto = wiki.separarConsulta("calculo");
check(linkSolto.categoria === "tudo" && linkSolto.termo === "calculo", "link solto devia buscar em tudo");
const linkInvalido = wiki.separarConsulta("naoexiste:algo");
check(linkInvalido.categoria === "tudo" && linkInvalido.termo === "naoexiste:algo", "categoria inválida devia virar busca");

assert.equal(problemas.length, 0, `wiki com ${problemas.length} problema(s):\n- ${problemas.slice(0, 12).join("\n- ")}`);
console.log(`ok wiki: ${indice.length} entradas em ${cats.length} categorias (${contagem.mundo} áreas, ${contagem.cavernas} cavernas, ${contagem.criaturas} criaturas, ${contagem.itens} itens, ${contagem.missoes} missões, ${contagem.npcs} NPCs, ${contagem.paginas} páginas, ${contagem.vocacoes} vocações)`);

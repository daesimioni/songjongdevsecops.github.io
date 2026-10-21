// A wiki nasce dos mesmos dados do jogo: o índice tem que bater com as áreas,
// cavernas, criaturas, itens, missões, NPCs, páginas e vocações, a busca tem que
// achar sem acento e a página tem que abrir. Roda sem navegador:
// node test/wiki.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";

globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} };

const wiki = await import("../js/wiki.js");
const { AREAS } = await import("../js/config.js");
const { DUNGEONS } = await import("../js/dungeon-data.js");
const { ITEMS } = await import("../js/rpg-data.js");
const { QUESTS } = await import("../js/quests.js");
const { NPCS, POSTS } = await import("../js/content.js");
const { FAUNA } = await import("../js/identity.js");
const { VOCACOES } = await import("../js/vocations.js");

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

// ---- a interface está ligada nos dois lugares ----
const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../js/app.js", import.meta.url), "utf8");
const dungeon = fs.readFileSync(new URL("../js/dungeon.js", import.meta.url), "utf8");
check(/id="wiki"/.test(html) && /id="wiki-search"/.test(html) && /id="wiki-list"/.test(html), "modal da wiki ausente no HTML");
check(/id="btn-wiki"/.test(html) && /id="dg-wiki"/.test(html), "wiki sem botão no HUD do vale ou da caverna");
check(/from "\.\/wiki\.js"/.test(app), "app.js não importa a wiki");
check(/function openWiki\(\)/.test(app), "app.js não define openWiki");
check(/btn-wiki"\)\.addEventListener\("click", openWiki\)/.test(app), "botão da wiki sem ligação");
check(/onWiki: \(\) => openWiki\(\)/.test(app), "caverna não recebe onWiki");
check(/onWiki/.test(dungeon) && /k === "h"/.test(dungeon), "caverna não abre a wiki com H");

assert.equal(problemas.length, 0, `wiki com ${problemas.length} problema(s):\n- ${problemas.slice(0, 12).join("\n- ")}`);
console.log(`ok wiki: ${indice.length} entradas em ${cats.length} categorias (${contagem.mundo} áreas, ${contagem.cavernas} cavernas, ${contagem.criaturas} criaturas, ${contagem.itens} itens, ${contagem.missoes} missões, ${contagem.npcs} NPCs, ${contagem.paginas} páginas, ${contagem.vocacoes} vocações)`);

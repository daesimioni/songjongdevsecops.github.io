// As pedras do catálogo como curso: cada estação com a lição de seis partes,
// nenhuma página curta e toda pergunta da área com casa em "O que perguntam".
// Roda sem navegador: node test/licoes.test.mjs
import assert from "node:assert/strict";

globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} };

const { CATALOG_CONTENT } = await import("../js/catalog-gen.js");
const { QUESTIONS } = await import("../js/rpg-data.js");
const { LICOES } = await import("../js/text/licoes.js");

const problemas = [];
const check = (ok, msg) => { if (!ok) problemas.push(msg); };
const palavras = (html) => String(html).replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;

// áreas que já ganharam lição escrita; o número sobe a cada fatia
const AREAS_COM_LICAO = 41;
const areas = Object.keys(LICOES);
check(areas.length === AREAS_COM_LICAO, `áreas com lição: ${areas.length}, esperado ${AREAS_COM_LICAO}`);

const PARTES = ["O que é", "Como se usa", "Onde quebra", "O que perguntam", "Para levar", "Com as mãos"];
let paginas = 0;
for (const areaId of areas) {
  const stations = CATALOG_CONTENT.sites.filter((s) => s.id.startsWith(`${areaId}-`) && /^\d+$/.test(s.id.slice(areaId.length + 1)));
  check(stations.length >= 3, `${areaId}: ${stations.length} estações, esperado ao menos 3`);
  const postsDaArea = stations.map((s) => CATALOG_CONTENT.posts[`${areaId}-${s.id.slice(areaId.length + 1)}`]).filter(Boolean);
  const corpo = postsDaArea.map((p) => p.body).join(" ");

  for (const s of stations) {
    const id = s.id;
    const post = CATALOG_CONTENT.posts[id];
    check(!!post, `${id}: página sem post`);
    if (!post) continue;
    paginas++;
    const n = palavras(post.body);
    check(n >= 500, `${id}: ${n} palavras, esperado ao menos 500`);
    for (const parte of PARTES) check(post.body.includes(parte), `${id}: falta a parte "${parte}"`);
  }

  // toda pergunta da área tem casa na seção "O que perguntam" de alguma página
  const continente = CATALOG_CONTENT.areas.find((a) => a.id === areaId)?.continent;
  const doBaralho = Object.values(QUESTIONS[continente] || {}).flat().filter((q) => q.area === areaId);
  check(doBaralho.length >= 3, `${areaId}: ${doBaralho.length} perguntas da área, esperado ao menos 3`);
  for (const q of doBaralho) {
    check(corpo.includes(q.q), `${areaId}: pergunta sem casa na lição: ${q.q.slice(0, 60)}`);
  }
}

assert.equal(problemas.length, 0, `lições com ${problemas.length} problema(s):\n- ${problemas.slice(0, 12).join("\n- ")}`);
console.log(`ok lições: ${areas.length} áreas, ${paginas} páginas com seis partes, ${paginas >= 1 ? "nenhuma abaixo de 500 palavras" : ""}, pergunta com casa`);

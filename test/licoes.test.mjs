// As pedras do catálogo como curso: cada estação com a lição de seis partes,
// nenhuma página curta e toda pergunta da área com casa em "O que perguntam".
// Roda sem navegador: node test/licoes.test.mjs
import assert from "node:assert/strict";

globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} };

const { CATALOG_CONTENT } = await import("../js/catalog-gen.js");
const { QUESTIONS } = await import("../js/rpg-data.js");
const { LICOES } = await import("../js/text/licoes.js");
const { LICOES_POST } = await import("../js/text/licoes-post.js");
const { POSTS } = await import("../js/content.js");
const { LEGACY_CONTENT } = await import("../js/config.js");

const problemas = [];
const check = (ok, msg) => { if (!ok) problemas.push(msg); };
const palavras = (html) => String(html).replace(/<[^>]+>/g, " ").split(/\s+/).filter(Boolean).length;

// áreas que já ganharam lição escrita; o número sobe a cada fatia
const AREAS_COM_LICAO = 70;
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
    // O piso era 500 porque a página repetia a mesma frase duas vezes (banco e
    // lição) e enchia com conversa de manual. Com a repetição fora, o piso é o
    // que garante página não fina: 460, medido depois da limpeza.
    check(n >= 460, `${id}: ${n} palavras, esperado ao menos 460`);
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

// as 69 páginas geradas das doze áreas antigas também são curso de seis partes
const GERADAS_LEGADAS = 69;
let geradas = 0;
for (const s of LEGACY_CONTENT.sites) {
  const post = LEGACY_CONTENT.posts[s.id];
  check(!!post, `${s.id}: página gerada sem post`);
  if (!post) continue;
  geradas++;
  const n = palavras(post.body);
  check(n >= 460, `${s.id}: ${n} palavras, esperado ao menos 460`);
  for (const parte of PARTES) check(post.body.includes(parte), `${s.id}: falta a parte "${parte}"`);
  check(!post.body.includes("undefined"), `${s.id}: página com undefined`);
}
check(geradas === GERADAS_LEGADAS, `páginas geradas: ${geradas}, esperado ${GERADAS_LEGADAS}`);

// as 69 páginas escritas à mão (as estações antigas) recebem o fecho de curso:
// limite, pergunta, para levar e com as mãos, sem perder o corpo original
const POSTS_ESCRITOS = 69;
check(Object.keys(LICOES_POST).length === POSTS_ESCRITOS, `páginas antigas com lição: ${Object.keys(LICOES_POST).length}, esperado ${POSTS_ESCRITOS}`);
// as páginas que já receberam as três partes que faltavam (O que é,
// Como se usa, Onde quebra) e o piso de 460; as demais entram nas próximas ondas
const ENRIQUECIDAS = new Set(["generative", "harmony", "ethics", "scales", "motion", "rhythm", "state", "learning", "thermo", "balance", "induction", "pipeline", "neural", "vision", "geometry", "language", "rainbow", "periodic", "concord", "registers", "security", "statistics", "bonds", "energy", "timbre", "chance", "counterpoint", "probability", "form", "genres", "gravity", "optics"]);
let antigas = 0;
for (const [id, licao] of Object.entries(LICOES_POST)) {
  const post = POSTS[id];
  check(!!post, `${id}: página antiga sem post`);
  check(!!licao.levar && !!licao.maos && !!licao.pergunta?.q && !!licao.limite, `${id}: lição antiga incompleta`);
  if (!post) continue;
  antigas++;
  for (const parte of ["O limite", "O que perguntam", "Para levar", "Com as mãos"]) {
    check(post.body.includes(parte), `${id}: página antiga sem "${parte}"`);
  }
  if (ENRIQUECIDAS.has(id)) {
    for (const parte of ["O que é", "Como se usa", "Onde quebra"]) {
      check(post.body.includes(parte), `${id}: curso completo sem "${parte}"`);
    }
    check(palavras(post.body) >= 460, `${id}: ${palavras(post.body)} palavras, esperado 460`);
  }
  check(!post.body.includes("undefined"), `${id}: página antiga com undefined`);
}

// o baralho do duelo é A-E: nenhuma pergunta pode ter seis alternativas nem
// resposta fora do intervalo (a letra F já apareceu no duelo antes)
let perguntas = 0;
for (const continente of Object.values(QUESTIONS)) {
  for (const baralho of Object.values(continente)) {
    for (const q of baralho) {
      perguntas++;
      check(q.options.length >= 2 && q.options.length <= 5, `pergunta ${q.q.slice(0, 40)}: ${q.options.length} alternativas`);
      check(q.a >= 0 && q.a < q.options.length, `pergunta ${q.q.slice(0, 40)}: resposta fora do intervalo`);
    }
  }
}
check(perguntas >= 800, `baralho: ${perguntas} perguntas, esperado 800+`);

assert.equal(problemas.length, 0, `lições com ${problemas.length} problema(s):\n- ${problemas.slice(0, 12).join("\n- ")}`);
console.log(`ok lições: ${areas.length} áreas, ${paginas} páginas com seis partes, ${geradas} páginas geradas antigas e ${antigas} escritas à mão (${ENRIQUECIDAS.size} com curso completo e 460+ palavras)`);

// Os totens de conhecimento: arte de monumento (não placa com ícone solto),
// caminho visível até eles e página que ensina um assunto só.
// Roda sem navegador: node test/totens.test.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} };

const { POSTS } = await import("../js/content.js");
const { BIOMES } = await import("../js/identity.js");
const { CATALOG_CONTENT } = await import("../js/catalog-gen.js");

const problemas = [];
const check = (ok, msg) => { if (!ok) problemas.push(msg); };

// ---- arte: o totem é um monumento de pedra, com adro, fuste e capitel ----
const render = readFileSync(new URL("../js/render.js", import.meta.url), "utf8");
check(/function drawTotem\(s, px, py, k, time\)/.test(render), "totem sem desenho próprio");
check(/drawTotem\(s, px, py, k, time\)/.test(render), "estação não chama o totem");
for (const parte of ["lajotas do adro", "degraus"]) {
  check(render.includes(parte), `totem sem ${parte}`);
}
// seis silhuetas e três pedras: cada estação não repete a vizinha
check(/TOTEM_PEDRAS = \[/.test(render), "totem com uma pedra só");
check(/hash2\(s\.x - 5\.7, s\.y \+ 2\.9\) \* 6/.test(render), "totem sem sorteio de silhueta");
for (const parte of ["cairn", "pórtico", "obelisco", "braços", "anel"]) {
  check(render.includes(parte), `totem sem a silhueta ${parte}`);
}
check(/drawStationIcon\(s\.icon, px, gy, time, s\.accent, escalaSigilo \* k\)/.test(render), "sigilo fora do ponto da silhueta");
// o pedestal antigo era uma placa reta com um feixe de luz: isso não pode voltar
check(!/const beam = ctx\.createLinearGradient\(px, py - 4, px, py - 28\)/.test(render), "feixe antigo do pedestal de volta");

// ---- caminho: a picada contrasta com o piso de toda ilha ----
const luz = (hex) => {
  const n = parseInt(hex.slice(1), 16);
  const c = [n >> 16, (n >> 8) & 255, n & 255].map((v) => v / 255);
  const canon = c.map((v) => (v <= 0.04045 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * canon[0] + 0.7152 * canon[1] + 0.0722 * canon[2];
};
let baixo = 0;
for (const [id, b] of Object.entries(BIOMES)) {
  const d = Math.abs(luz(b.path) - luz(b.floor));
  if (d < 0.08) { baixo++; check(false, `${id}: caminho e piso quase iguais (${b.path} x ${b.floor})`); }
}
check(baixo === 0, `${baixo} ilhas com caminho invisível`);

// ---- página: sem resposta vazia, um assunto por pedra ----
let vazias = 0;
let semAssunto = 0;
for (const [id, post] of Object.entries(POSTS)) {
  const corpo = post.body || "";
  if (/<strong><\/strong>/.test(corpo)) { vazias++; check(false, `${id}: resposta vazia em "Se perguntarem"`); }
  // a lista de tópicos e o mapa ficam depois da lição, nunca no meio dela
  const fim = corpo.lastIndexOf("Com as mãos");
  const marcas = corpo.indexOf("O que esta pedra cobre");
  const mapa = corpo.indexOf("No mapa.");
  if (fim >= 0 && marcas >= 0 && marcas < fim) { semAssunto++; check(false, `${id}: lista de tópicos antes da lição`); }
  if (fim >= 0 && mapa >= 0 && mapa < fim) { semAssunto++; check(false, `${id}: mapa antes da lição`); }
}
check(vazias === 0, `${vazias} páginas com resposta vazia`);
check(semAssunto === 0, `${semAssunto} páginas com assunto trocado de lugar`);

// ---- toda pergunta do banco tem resposta escrita ----
let semResposta = 0;
for (const [id, p] of Object.entries(CATALOG_CONTENT.posts)) {
  for (const m of p.body.matchAll(/Se perguntarem<\/em> (?:.*?) <em>a resposta é<\/em> <strong>(.*?)<\/strong>/g)) {
    if (!m[1].trim()) { semResposta++; check(false, `${id}: pergunta sem resposta`); }
  }
}
check(semResposta === 0, `${semResposta} perguntas sem resposta`);

assert.equal(problemas.length, 0, `totens com ${problemas.length} problema(s):\n- ${problemas.slice(0, 10).join("\n- ")}`);
console.log(`ok totens: arte de monumento, caminho com contraste em ${Object.keys(BIOMES).length} ilhas, ${Object.keys(POSTS).length} páginas sem resposta vazia e com o assunto no lugar`);

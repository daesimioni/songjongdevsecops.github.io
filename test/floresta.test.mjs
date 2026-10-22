// Floresta organizada: árvore em bosque, com teto por ilha, copa longe de
// caminho, totem, gente e clareira de caçada. Metrópole (área antiga) é praça:
// no máximo quatro árvores, e todas na beirada. Sem isso a copa de 36 x 46
// cobria a rua inteira e a ilha virava um bloco verde só.
// Roda sem navegador: node test/floresta.test.mjs
import assert from "node:assert/strict";

globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} };

const { createWorld } = await import("../src/world/world.js");
const { AREAS } = await import("../src/content/config.js");

const problemas = [];
const check = (ok, msg) => { if (!ok) problemas.push(msg); };
const ARVORES = new Set(["arvore", "conifera", "palmeira", "seca"]);
const cheb = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));

const world = createWorld();
const arvores = world.ambiente.filter((a) => ARVORES.has(a.tipo));
check(arvores.length >= 250 && arvores.length <= 1300, `árvores no mundo: ${arvores.length}, esperado entre 250 e 1300`);

// teto por ilha e, na metrópole, só na beirada
const porArea = new Map();
for (const a of arvores) {
  const area = world.areaAt(a.x, a.y);
  if (!area) continue;
  if (!porArea.has(area.id)) porArea.set(area.id, []);
  porArea.get(area.id).push(a);
}
const areasComArvore = new Set([...porArea.keys()]);
check(areasComArvore.size >= 60, `ilhas com ao menos uma árvore: ${areasComArvore.size}, esperado 60+`);
for (const [id, lista] of porArea) {
  const area = AREAS.find((a) => a.id === id);
  if (!area) continue;
  const areaIlha = area.rect.w * area.rect.h;
  const teto = area.catalog ? Math.min(14, Math.max(5, Math.round(areaIlha / 62)) + 1) : 4;
  check(lista.length <= teto, `${id}: ${lista.length} árvores, teto ${teto}`);
  if (!area.catalog) {
    // metrópole: árvore só no arredor da praça
    for (const a of lista) {
      const nx = (a.x - area.land.cx) / area.land.rx;
      const ny = (a.y - area.land.cy) / area.land.ry;
      check(Math.hypot(nx, ny) >= 0.42, `${id}: árvore no miolo da metrópole em ${a.x},${a.y}`);
    }
  }
}

// copa livre: distância entre árvores, e delas para o que o jogador usa
let minPar = 99, minEst = 99, minPedra = 99, minNpc = 99, minCacada = 99;
for (let i = 0; i < arvores.length; i++) {
  const a = arvores[i];
  for (let j = i + 1; j < arvores.length; j++) {
    const b = arvores[j];
    if (cheb(a, b) > 8) continue;
    minPar = Math.min(minPar, cheb(a, b));
  }
  for (const s of world.stations) minEst = Math.min(minEst, Math.hypot(a.x - s.x, a.y - s.y));
  for (const p of world.waystones) minPedra = Math.min(minPedra, Math.hypot(a.x - p.x, a.y - p.y));
  for (const n of world.npcs) minNpc = Math.min(minNpc, Math.hypot(a.x - n.x, a.y - n.y));
  for (const h of world.hunters) minCacada = Math.min(minCacada, Math.hypot(a.x - h.center.x, a.y - h.center.y));
}
check(minPar >= 2.9, `duas árvores a ${minPar.toFixed(2)} tiles uma da outra`);
check(minEst >= 1.9, `árvore a ${minEst.toFixed(2)} tiles de uma estação`);
check(minPedra >= 1.9, `árvore a ${minPedra.toFixed(2)} tiles de um farol`);
check(minNpc >= 2.2, `árvore a ${minNpc.toFixed(2)} tiles de um NPC`);
check(minCacada >= 2.9, `árvore a ${minCacada.toFixed(2)} tiles da clareira de caçada`);

// cobertura rasteira continua existindo: o chão não ficou pelado
const rasteira = world.ambiente.filter((a) => a.tipo === "arbusto" || a.tipo === "florada" || a.tipo === "tufo");
check(rasteira.length >= 1200, `cobertura rasteira: ${rasteira.length} peças, esperado 1200+`);

assert.equal(problemas.length, 0, `floresta com ${problemas.length} problema(s):\n- ${problemas.slice(0, 12).join("\n- ")}`);
console.log(`ok floresta: ${arvores.length} árvores em ${areasComArvore.size} ilhas, copa com ${minPar.toFixed(1)} tiles entre si, ${minEst.toFixed(1)} de estação e ${minCacada.toFixed(1)} da caçada; metrópole só de beirada`);

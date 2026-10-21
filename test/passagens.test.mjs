// Acesso às ilhas: nem tudo é ponte sobre o mar. Metade dos pares vira
// passagem de terra (istmo), com piso do bioma das duas pontas, franja de
// areia, trilha de pedra e lâmpada no meio; a outra metade continua ponte.
// Este teste cobra variedade e caminho seco em todas as 54 ligações.
// Roda sem navegador: node test/passagens.test.mjs
import assert from "node:assert/strict";

globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} };

const { createWorld } = await import("../js/world.js");
const { CATALOG_AREAS, CATALOG_BRIDGES, CATALOG_TUNNELS } = await import("../js/catalog-layout.js");

const problemas = [];
const check = (ok, msg) => { if (!ok) problemas.push(msg); };
const world = createWorld();
const byId = new Map(CATALOG_AREAS.map((a) => [a.id, a]));
const TILE = { WATER: 3, BRIDGE: 18, STONE: 2, PATH: 1, SAND: 7 };
const seco = (t) => t !== TILE.WATER;
const faixaSeca = (x, y) => {
  for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) if (seco(world.get(x + dx, y + dy))) return true;
  return false;
};

let istmos = 0, pontes = 0, comPedra = 0, comAgua = 0;
for (const [a, b] of CATALOG_BRIDGES) {
  const pa = byId.get(a), pb = byId.get(b);
  const dx = pb.cx - pa.cx, dy = pb.cy - pa.cy;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len, uy = dy / len;
  let pontesNoEixo = 0, pedraNoEixo = 0, buraco = 0, passos = 0;
  for (let i = 3; i < len - 3; i += 0.6) {
    const x = Math.round(pa.cx + ux * i);
    const y = Math.round(pa.cy + uy * i);
    const t = world.get(x, y);
    passos++;
    if (t === TILE.BRIDGE) pontesNoEixo++;
    if (t === TILE.STONE) pedraNoEixo++;
    if (!faixaSeca(x, y)) buraco++;
  }
  if (buraco) {
    comAgua++;
    check(false, `${a} -> ${b}: ${buraco} ponto(s) de água aberta sem chão nem tabuado`);
  }
  if (pontesNoEixo > passos * 0.12) pontes++;
  else istmos++;
  if (pedraNoEixo >= 3) comPedra++;
}
check(istmos >= 22, `passagens de terra: ${istmos}, esperado 22+`);
check(pontes >= 12, `pontes: ${pontes}, esperado 12+`);
check(comPedra >= 20, `passagens com trilha de pedra: ${comPedra}, esperado 20+`);

// toda ilha continua alcançável: as interdisciplinares chegam por túnel,
// as disciplinares por ponte ou istmo; nenhuma pode ficar sem caminho
const areasLigadas = new Set([...CATALOG_BRIDGES.flat(), ...CATALOG_TUNNELS.map(([de]) => de)]);
check(areasLigadas.size >= 70, `áreas ligadas: ${areasLigadas.size}, esperado 70`);
for (const spot of CATALOG_AREAS) {
  check(areasLigadas.has(spot.id), `${spot.id} sem ligação nenhuma`);
}

assert.equal(problemas.length, 0, `passagens com ${problemas.length} problema(s):\n- ${problemas.slice(0, 10).join("\n- ")}`);
console.log(`ok passagens: ${istmos} istmos com trilha de pedra e ${pontes} pontes nas ${CATALOG_BRIDGES.length} ligações, água aberta em ${comAgua}`);

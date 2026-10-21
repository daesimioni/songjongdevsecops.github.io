// Auditoria de colisão: o caminho a pé tem que chegar em todo ponto de
// interação com as caixas dos props sólidas de verdade. A sonda antiga media
// só o tile, então uma caixa em cima do caminho não aparecia; medir por centro
// de tile também mente para o outro lado, porque o corpo passa por vão de
// 0,65 tile que o centro não alcança. Aqui o passo é de 1/4 de tile e quem
// responde é a mesma regra de colisão do jogo.
import assert from "node:assert/strict";

globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} };

const { createWorld } = await import("../js/world.js");
const { MAP_W, MAP_H, SPAWN, PLAYER_W, PLAYER_H, INTERACT_RADIUS } = await import("../js/config.js");

const w = createWorld();

// grade de 1/4 de tile, com índice espacial dos props para não varrer as 1.346
// caixas em cada célula
const PASSO = 4;
const GW = MAP_W * PASSO;
const GH = MAP_H * PASSO;
const balde = new Map();
let estaticos = 0;
for (const p of w.props) {
  if (p.active) continue;
  estaticos++;
  for (let by = Math.floor((p.y - p.hh - 1) / 4); by <= Math.floor((p.y + p.hh + 1) / 4); by++) {
    for (let bx = Math.floor((p.x - p.hw - 1) / 4); bx <= Math.floor((p.x + p.hw + 1) / 4); bx++) {
      const k = `${bx},${by}`;
      if (!balde.has(k)) balde.set(k, []);
      balde.get(k).push(p);
    }
  }
}
function colide(x, y) {
  const t = w.get(Math.floor(x), Math.floor(y));
  if (t === 3 || t === 4 || t === 5) return true;
  const lista = balde.get(`${Math.floor(x / 4)},${Math.floor(y / 4)}`);
  if (!lista) return false;
  const hw = PLAYER_W / 2;
  const hh = PLAYER_H / 2;
  for (const p of lista) {
    if (Math.abs(x - p.x) < hw + p.hw && Math.abs(y - p.y) < hh + p.hh) return true;
  }
  return false;
}

const visto = new Uint8Array(GW * GH);
const fila = [];
const inicio = Math.round(SPAWN.x * PASSO) + Math.round(SPAWN.y * PASSO) * GW;
visto[inicio] = 1;
fila.push(inicio);
for (let i = 0; i < fila.length; i++) {
  const k = fila[i];
  const x = k % GW;
  const y = (k - x) / GW;
  for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const nx = x + dx;
    const ny = y + dy;
    if (nx < 0 || ny < 0 || nx >= GW || ny >= GH) continue;
    const nk = nx + ny * GW;
    if (visto[nk]) continue;
    if (colide((nx + 0.5) / PASSO, (ny + 0.5) / PASSO)) continue;
    visto[nk] = 1;
    fila.push(nk);
  }
}

// ponto de interação alcançável: alguma célula andada dentro do raio
function alcance(x, y, raio) {
  const x0 = Math.max(0, Math.floor((x - raio) * PASSO));
  const x1 = Math.min(GW - 1, Math.ceil((x + raio) * PASSO));
  const y0 = Math.max(0, Math.floor((y - raio) * PASSO));
  const y1 = Math.min(GH - 1, Math.ceil((y + raio) * PASSO));
  for (let gy = y0; gy <= y1; gy++) {
    for (let gx = x0; gx <= x1; gx++) {
      if (!visto[gx + gy * GW]) continue;
      if (Math.hypot((gx + 0.5) / PASSO - x, (gy + 0.5) / PASSO - y) <= raio) return true;
    }
  }
  return false;
}

const grupos = {
  estação: [w.stations, (s) => [s.x, s.y, INTERACT_RADIUS]],
  pedra: [w.waystones, (s) => [s.x, s.y, INTERACT_RADIUS]],
  boca: [w.caves, (c) => [c.exit.x, c.exit.y, 1.8]],
  npc: [w.npcs, (n) => [n.hx, n.hy, INTERACT_RADIUS]],
  item: [w.groundItems, (g) => [g.x, g.y, 1.4]],
};
for (const [nome, [lista, pos]] of Object.entries(grupos)) {
  const ruins = lista.filter((ponto) => { const [x, y, raio] = pos(ponto); return !alcance(x, y, raio); });
  assert.equal(ruins.length, 0, `${nome} sem caminho a pé com as caixas: ${ruins.slice(0, 5).map((p) => p.id || p.name || "?").join(", ")} (${ruins.length} de ${lista.length})`);
}

// caixa maior que o desenho vira parede invisível: nada ocupa mais de dois
// tiles de largura nem um e meio de altura
const grandes = w.props.filter((p) => !p.active && (p.hw > 1.05 || p.hh > 0.7));
assert.equal(grandes.length, 0, `caixa grande demais: ${grandes.slice(0, 4).map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)} hw ${p.hw}`).join("; ")}`);

// o spawn não pode nascer dentro de caixa
const noSpawn = w.props.filter((p) => !p.active && Math.abs(p.x - SPAWN.x) < p.hw + PLAYER_W / 2 && Math.abs(p.y - SPAWN.y) < p.hh + PLAYER_H / 2);
assert.equal(noSpawn.length, 0, `caixa em cima do spawn: ${noSpawn.length}`);

assert.ok(fila.length > 300000, `células andadas: ${fila.length}`);
console.log(`ok colisão: ${fila.length} células de 1/4 de tile a pé com ${estaticos} props sólidos; ${w.stations.length} estações, ${w.waystones.length} pedras, ${w.caves.length} bocas, ${w.npcs.length} NPCs e ${w.groundItems.length} itens alcançáveis`);

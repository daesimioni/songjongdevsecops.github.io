// Onde as estações de uma área ficam. A ilha é uma elipse achatada (a mesma
// conta do mundo), e as estações se espalham do centro para fora, com espaço
// para o pedestal de cada uma, sem encostar no farol, no NPC, na clareira de
// caçada nem no que já existia.

const cheb = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));

function hash2(x, y) {
  let h = (x * 374761393 + y * 668265263) ^ 0x5bf03635;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

export function insideLand(land, x, y, limite = 0.66) {
  const nx = (x + 0.5 - land.cx) / land.rx;
  const ny = (y + 0.5 - land.cy) / land.ry;
  return Math.pow(Math.abs(nx), 4) + Math.pow(Math.abs(ny), 4) <= limite;
}

export function placeStations(land, count, reserved = []) {
  const candidatos = [];
  for (let y = Math.floor(land.cy - land.ry); y <= Math.ceil(land.cy + land.ry); y++) {
    for (let x = Math.floor(land.cx - land.rx); x <= Math.ceil(land.cx + land.rx); x++) {
      if (!insideLand(land, x, y)) continue;
      const dx = x - land.cx;
      const dy = (y - land.cy) * 1.45;
      candidatos.push({ x, y, d: Math.hypot(dx, dy) + hash2(x, y) * 0.45 });
    }
  }
  candidatos.sort((a, b) => a.d - b.d || a.y - b.y || a.x - b.x);

  const achadas = [];
  for (const folga of [2.8, 2.4, 2, 1.5]) {
    for (const c of candidatos) {
      if (achadas.length >= count) return achadas;
      if (achadas.some((p) => cheb(p, c) < folga)) continue;
      if (reserved.some((p) => cheb(p, c) < 2.2)) continue;
      achadas.push({ x: c.x, y: c.y });
    }
  }
  return achadas;
}

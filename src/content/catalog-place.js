// Onde as estações de uma área ficam. A ilha é uma elipse achatada (a mesma
// conta do mundo) e as estações se espalham por ela: a primeira escolhe uma
// beirada, as seguintes ficam o mais longe possível das já postas. Antes todas
// nasciam coladas no centro, porque a fila era por distância da âncora, e a
// ilha crescia em volta de um amontoado.
export function placeStations(land, count, reserved = []) {
  const candidatos = [];
  for (let y = Math.floor(land.cy - land.ry); y <= Math.ceil(land.cy + land.ry); y++) {
    for (let x = Math.floor(land.cx - land.rx); x <= Math.ceil(land.cx + land.rx); x++) {
      if (!insideLand(land, x, y)) continue;
      const dx = (x - land.cx) / land.rx;
      const dy = (y - land.cy) / land.ry;
      candidatos.push({ x, y, r: Math.hypot(dx, dy), s: hash2(x, y) });
    }
  }
  if (!candidatos.length) return [];
  const reservados = reserved.filter(Boolean);
  const pertoDe = (c) => Math.min(...reservados.map((p) => cheb(p, c)), 99);
  // 3,2 tiles de folga do farol, do NPC e da clareira: totem e gente não
  // encostam, e a ilha não lê como coisa empilhada
  const abertos = candidatos.filter((c) => pertoDe(c) >= 3.2);
  const lista = abertos.length >= count ? abertos : candidatos;

  const escolhidos = [];
  const distancia = (c) => Math.min(...escolhidos.map((e) => cheb(e, c)), 99);
  // primeira estação: na beirada, no ângulo que a semente da ilha escolher
  const abertura = hash2(land.cx, land.cy) * Math.PI * 2;
  let primeira = null;
  let melhorNota = Infinity;
  for (const c of lista) {
    const angulo = Math.atan2((c.y - land.cy) / land.ry, (c.x - land.cx) / land.rx);
    const diferenca = Math.abs(((angulo - abertura + Math.PI * 3) % (Math.PI * 2)) - Math.PI);
    const nota = diferenca + Math.abs(c.r - 0.6) * 2;
    if (nota < melhorNota) { melhorNota = nota; primeira = c; }
  }
  if (!primeira) return [];
  escolhidos.push(primeira);

  while (escolhidos.length < count) {
    let melhor = null;
    let melhorFolga = -1;
    for (const c of lista) {
      const d = distancia(c);
      if (d < 3.2) continue;
      const folga = d + c.s * 0.35;
      if (folga > melhorFolga) { melhorFolga = folga; melhor = c; }
    }
    if (!melhor) break;
    escolhidos.push(melhor);
  }
  // se a ilha não tinha folga para todas, completa com o que sobrou
  for (const c of lista) {
    if (escolhidos.length >= count) break;
    if (escolhidos.some((e) => cheb(e, c) < 2.6)) continue;
    escolhidos.push(c);
  }
  return escolhidos.slice(0, count).map((c) => ({ x: c.x, y: c.y }));
}

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

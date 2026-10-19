// Caminho no mapa: A* em grade, oito direções, sem cortar quina.
// É o que faz o clique no chão virar caminhada sem segurar tecla.
import { MAP_W, MAP_H, PLAYER_W, PLAYER_H } from "./config.js";

const DIRS = [
  [1, 0, 1], [-1, 0, 1], [0, 1, 1], [0, -1, 1],
  [1, 1, Math.SQRT2], [1, -1, Math.SQRT2], [-1, 1, Math.SQRT2], [-1, -1, Math.SQRT2],
];

// O caminho usa uma folga maior que o corpo. Sem isso ele pode passar por um
// centro de tile que é válido no papel, mas roça na quina de uma estação ou
// monstro e trava no meio da caminhada.
const PATH_PAD = 0.16;

export function tileWalkable(world, tx, ty, pad = 0) {
  if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return false;
  return !world.boxCollides(tx + 0.5, ty + 0.5, PLAYER_W + pad, PLAYER_H + pad);
}

export function nearestWalkable(world, x, y, maxR = 3, pad = 0) {
  const cx = Math.floor(x);
  const cy = Math.floor(y);
  if (tileWalkable(world, cx, cy, pad)) return { x: cx + 0.5, y: cy + 0.5 };
  for (let r = 1; r <= maxR; r++) {
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
        if (tileWalkable(world, cx + dx, cy + dy, pad)) {
          return { x: cx + dx + 0.5, y: cy + dy + 0.5 };
        }
      }
    }
  }
  return null;
}

class Heap {
  constructor() { this.a = []; }
  get size() { return this.a.length; }
  push(node) {
    const a = this.a;
    a.push(node);
    let i = a.length - 1;
    while (i > 0) {
      const p = (i - 1) >> 1;
      if (a[p].f <= a[i].f) break;
      [a[p], a[i]] = [a[i], a[p]];
      i = p;
    }
  }
  pop() {
    const a = this.a;
    const top = a[0];
    const last = a.pop();
    if (a.length && last) {
      a[0] = last;
      let i = 0;
      for (;;) {
        const l = i * 2 + 1;
        const r = l + 1;
        let m = i;
        if (l < a.length && a[l].f < a[m].f) m = l;
        if (r < a.length && a[r].f < a[m].f) m = r;
        if (m === i) break;
        [a[m], a[i]] = [a[i], a[m]];
        i = m;
      }
    }
    return top;
  }
}

export function findPath(world, from, to, maxNodes = 16000) {
  const start = nearestWalkable(world, from.x, from.y, 1);
  if (!start) return null;
  let goal = nearestWalkable(world, to.x, to.y, 2, PATH_PAD);
  if (!goal) return null;
  const sx = Math.floor(start.x), sy = Math.floor(start.y);
  const tx = Math.floor(goal.x), ty = Math.floor(goal.y);
  if (sx === tx && sy === ty) return [goal];

  const size = MAP_W * MAP_H;
  const g = new Float32Array(size).fill(Infinity);
  const came = new Int32Array(size).fill(-1);
  const closed = new Uint8Array(size);
  const open = new Heap();
  const idx = (x, y) => y * MAP_W + x;
  const h = (x, y) => {
    const dx = Math.abs(x - tx);
    const dy = Math.abs(y - ty);
    return (dx + dy) + (Math.SQRT2 - 2) * Math.min(dx, dy);
  };
  const startIdx = idx(sx, sy);
  g[startIdx] = 0;
  open.push({ x: sx, y: sy, f: h(sx, sy) });
  let visited = 0;

  while (open.size && visited < maxNodes) {
    const node = open.pop();
    const ci = idx(node.x, node.y);
    if (closed[ci]) continue;
    closed[ci] = 1;
    visited++;
    if (node.x === tx && node.y === ty) {
      const path = [];
      let cur = ci;
      while (cur !== -1) {
        path.push({ x: (cur % MAP_W) + 0.5, y: Math.floor(cur / MAP_W) + 0.5 });
        cur = came[cur];
      }
      path.reverse();
      return path;
    }
    for (const [dx, dy, cost] of DIRS) {
      const nx = node.x + dx;
      const ny = node.y + dy;
      if (!tileWalkable(world, nx, ny, PATH_PAD)) continue;
      if (dx !== 0 && dy !== 0) {
        if (!tileWalkable(world, node.x + dx, node.y, PATH_PAD)) continue;
        if (!tileWalkable(world, node.x, node.y + dy, PATH_PAD)) continue;
      }
      const ni = idx(nx, ny);
      if (closed[ni]) continue;
      const ng = g[ci] + cost;
      if (ng >= g[ni]) continue;
      g[ni] = ng;
      came[ni] = ci;
      open.push({ x: nx, y: ny, f: ng + h(nx, ny) });
    }
  }
  return null;
}

import { segmentFree } from "./collision.js";
// Caminho no mapa: A* em grade, oito direções, sem cortar quina.
// É o que faz o clique no chão virar caminhada sem segurar tecla. O mesmo
// algoritmo serve ao mundo e às cavernas; só muda o tamanho e o que é sólido.
import { MAP_W, MAP_H, PLAYER_W, PLAYER_H } from "./runtime-config.js";

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

// `walkable(tx, ty, pad)` responde se o centro do tile cabe. O `pad` só é
// aplicado no destino: o começo precisa aceitar o corpo onde ele já está.
export function findPathIn(width, height, walkable, from, to, { goalPad = 0, maxNodes = 16000, canTraverse = () => true } = {}) {
  const nearest = (x, y, maxR, pad, accept = () => true) => {
    const cx = Math.floor(x);
    const cy = Math.floor(y);
    if (walkable(cx, cy, pad) && accept({x:cx+.5,y:cy+.5})) return { x: cx + 0.5, y: cy + 0.5 };
    for (let r = 1; r <= maxR; r++) {
      for (let dy = -r; dy <= r; dy++) {
        for (let dx = -r; dx <= r; dx++) {
          if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
          if (walkable(cx + dx, cy + dy, pad) && accept({x:cx+dx+.5,y:cy+dy+.5})) return { x: cx + dx + 0.5, y: cy + dy + 0.5 };
        }
      }
    }
    return null;
  };

  const start = nearest(from.x, from.y, 1, PATH_PAD, p=>canTraverse(from,p)) || nearest(from.x, from.y, 1, 0,p=>canTraverse(from,p));
  if (!start) return null;
  const goal = nearest(to.x, to.y, 2, goalPad);
  if (!goal) return null;
  const sx = Math.floor(start.x), sy = Math.floor(start.y);
  const tx = Math.floor(goal.x), ty = Math.floor(goal.y);
  if (sx === tx && sy === ty) return [goal];

  const size = width * height;
  const g = new Float32Array(size).fill(Infinity);
  const came = new Int32Array(size).fill(-1);
  const closed = new Uint8Array(size);
  const open = new Heap();
  const idx = (x, y) => y * width + x;
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
        path.push({ x: (cur % width) + 0.5, y: Math.floor(cur / width) + 0.5 });
        cur = came[cur];
      }
      path.reverse();
      return path;
    }
    for (const [dx, dy, cost] of DIRS) {
      const nx = node.x + dx;
      const ny = node.y + dy;
      if (!walkable(nx, ny, PATH_PAD)) continue;
      if (dx !== 0 && dy !== 0) {
        if (!walkable(node.x + dx, node.y, PATH_PAD)) continue;
        if (!walkable(node.x, node.y + dy, PATH_PAD)) continue;
      }
      if(!canTraverse({x:node.x+.5,y:node.y+.5},{x:nx+.5,y:ny+.5}))continue;
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

export function findPath(world, from, to, maxNodes = 16000) {
  const blockedOrigin=world.boxCollides(from.x,from.y,PLAYER_W,PLAYER_H);
  return findPathIn(MAP_W, MAP_H, (tx, ty, pad) => tileWalkable(world, tx, ty, pad), from, to, {
    goalPad: PATH_PAD,
    maxNodes,
    canTraverse:(a,b)=>(blockedOrigin&&a.x===from.x&&a.y===from.y)||segmentFree(a,b,(x,y)=>!world.boxCollides(x,y,PLAYER_W,PLAYER_H)),
  });
}

// Objetos sólidos não são destinos caminháveis. Escolhe um ponto de ação
// alcançável, dentro do raio e com visão livre, em vez de parar atrás da parede.
export function findInteractionPath(width, height, walkable, from, target, {
  radius = 1.7, goalPad = PATH_PAD, canInteract = () => true, canTraverse = () => true,
} = {}) {
  const goals = [];
  for (let y = Math.max(0, Math.floor(target.y - radius)); y <= Math.min(height - 1, Math.ceil(target.y + radius)); y++) {
    for (let x = Math.max(0, Math.floor(target.x - radius)); x <= Math.min(width - 1, Math.ceil(target.x + radius)); x++) {
      const point = { x: x + 0.5, y: y + 0.5 };
      if (Math.hypot(point.x - target.x, point.y - target.y) > radius) continue;
      if (!walkable(x, y, goalPad) || !canInteract(point, target)) continue;
      goals.push(point);
    }
  }
  goals.sort((a, b) => Math.hypot(a.x - from.x, a.y - from.y) - Math.hypot(b.x - from.x, b.y - from.y));
  for (const goal of goals) {
    const path = findPathIn(width, height, walkable, from, goal, { goalPad, canTraverse });
    if (path) return path;
  }
  return null;
}

// Teleportes e elevadores chegam ao lado do marco, nunca dentro da sua base.
export function findLanding(world,point){
  const offsets=[[0,1.8],[0,-1.8],[1.8,0],[-1.8,0],[0,2.6],[2.6,0]];
  for(const [dx,dy]of offsets){
    const x=point.x+dx,y=point.y+dy;
    if(!world.boxCollides(x,y,PLAYER_W+PATH_PAD,PLAYER_H+PATH_PAD))return {x,y};
  }
  return nearestWalkable(world,point.x,point.y,4,PATH_PAD);
}

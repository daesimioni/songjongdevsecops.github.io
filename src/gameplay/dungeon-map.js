import { touchesSolidTiles, boxesOverlap } from "../core/collision.js";
import { PLAYER_W, PLAYER_H } from "../core/runtime-config.js";
import { directionVector } from "../core/movement.js";
// ---------- mapa ----------
export function buildDungeonMap(def) {
  const layout = def.layout;
  const W = layout.width;
  const H = layout.height;
  const grid = new Uint8Array(W * H);
  const roomGrid = new Int8Array(W * H).fill(-1);
  const idx = (x, y) => y * W + x;
  const carve = (x, y) => {
    if (x > 0 && y > 0 && x < W - 1 && y < H - 1) grid[idx(x, y)] = 1;
  };
  const carveRect = (x, y, w, h) => {
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) carve(i, j);
  };

  for (const room of def.rooms) carveRect(room.x, room.y, room.w, room.h);

  const byId = new Map(def.rooms.map((r) => [r.id, r]));
  const style = def.tunnel || "elbow";
  const half = style === "wide" ? 2 : style === "narrow" ? 0 : 1;
  const hRun = (x0, x1, y) => {
    const lo = Math.min(x0, x1), hi = Math.max(x0, x1);
    for (let x = lo; x <= hi; x++) for (let d = -half; d <= half; d++) carve(x, y + d);
  };
  const vRun = (y0, y1, x) => {
    const lo = Math.min(y0, y1), hi = Math.max(y0, y1);
    for (let y = lo; y <= hi; y++) for (let d = -half; d <= half; d++) carve(x + d, y);
  };
  layout.corridors.forEach(([aId, bId], ci) => {
    const a = byId.get(aId);
    const b = byId.get(bId);
    if (!a || !b) return;
    const ax = a.x + Math.floor(a.w / 2);
    const ay = a.y + Math.floor(a.h / 2);
    const bx = b.x + Math.floor(b.w / 2);
    const by = b.y + Math.floor(b.h / 2);
    if (style === "split") {
      const mx = Math.floor((ax + bx) / 2);
      hRun(ax, mx, ay);
      vRun(ay, by, mx);
      hRun(mx, bx, by);
    } else if (style === "zigzag") {
      const my = Math.floor((ay + by) / 2);
      vRun(ay, my, ax);
      hRun(ax, bx, my);
      vRun(my, by, bx);
    } else if (style === "cross" && ci % 2 === 1) {
      vRun(ay, by, ax);
      hRun(ax, bx, by);
    } else {
      hRun(ax, bx, ay);
      vRun(ay, by, bx);
    }
  });

  def.rooms.forEach((room, i) => {
    for (let y = room.y; y < room.y + room.h; y++) {
      for (let x = room.x; x < room.x + room.w; x++) {
        if (grid[idx(x, y)]) roomGrid[idx(x, y)] = i;
      }
    }
  });

  return { W, H, grid, roomGrid, rooms: def.rooms, idx };
}

export function dungeonSolid(map, tx, ty) {
  if (tx < 0 || ty < 0 || tx >= map.W || ty >= map.H) return true;
  return map.grid[ty * map.W + tx] === 0;
}

export function roomIndexAt(map, x, y) {
  const tx = Math.floor(x);
  const ty = Math.floor(y);
  if (tx < 0 || ty < 0 || tx >= map.W || ty >= map.H) return -1;
  return map.roomGrid[ty * map.W + tx];
}

// Caixa do corpo contra os tiles: a mesma ideia da colisão do mundo.
export function boxFree(map, x, y, pad = 0, solids = null) {
  const hw = (PLAYER_W + pad) / 2;
  const hh = (PLAYER_H + pad) / 2;
  if(touchesSolidTiles(x,y,hw*2,hh*2,(tx,ty)=>dungeonSolid(map,tx,ty)))return false;
  if (solids) {
    for (const s of solids) {
      if (boxesOverlap({x,y,hw,hh},s)) return false;
    }
  }
  return true;
}

export function dungeonLineOfSight(map, ax, ay, bx, by) {
  const dist = Math.hypot(bx - ax, by - ay);
  const steps = Math.ceil(dist / 0.22);
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    if (dungeonSolid(map, Math.floor(ax + (bx - ax) * t), Math.floor(ay + (by - ay) * t))) return false;
  }
  return true;
}

// O desenho e a caminhada usam oito direções; o cone precisa das mesmas oito.
export function dungeonCanSeePlayer(map, monster, player) {
  if (!monster?.alive) return false;
  const dx = player.x - monster.x, dy = player.y - monster.y;
  const distance = Math.hypot(dx, dy);
  if (distance > monster.vision) return false;
  const { x: vx, y: vy } = directionVector(monster.dir);
  const facing = distance > 0.001 ? (vx * dx + vy * dy) / (distance * Math.hypot(vx, vy)) : 1;
  if (facing < Math.cos(monster.fov ?? 1.2)) return false;
  return dungeonLineOfSight(map, monster.x, monster.y, player.x, player.y);
}

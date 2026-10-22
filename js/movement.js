// Movimento por deslocamento, com a mesma varredura para teclado e caminhos.
export const DIRECTIONS = [[0, 1], [-1, 0], [1, 0], [0, -1], [-1, 1], [1, 1], [-1, -1], [1, -1]];
export function directionVector(dir) {
  const [x, y] = DIRECTIONS[dir] || DIRECTIONS[0];
  const length = Math.hypot(x, y);
  return { x: x / length, y: y / length };
}
export function directionAngle(dir) {
  const { x, y } = directionVector(dir);
  return Math.atan2(y, x);
}
export function facingDirection(dx, dy, previous = 0) {
  if (Math.abs(dx) < 1e-8 && Math.abs(dy) < 1e-8) return previous;
  if (Math.abs(dx) > 1e-8 && Math.abs(dy) > 1e-8) return dy > 0 ? (dx < 0 ? 4 : 5) : (dx < 0 ? 6 : 7);
  return Math.abs(dx) > 1e-8 ? (dx > 0 ? 2 : 1) : (dy > 0 ? 0 : 3);
}
export function moveWithCollision(position, dx, dy, canOccupy, slide = true) {
  if (![dx, dy].every(Number.isFinite)) return false;
  const startX = position.x, startY = position.y;
  const chunks = Math.max(1, Math.ceil(Math.hypot(dx, dy) / 0.08));
  const sx = dx / chunks, sy = dy / chunks;
  for (let i = 0; i < chunks; i++) {
    const x = position.x + sx, y = position.y + sy;
    if (!slide) {
      if (!canOccupy(x, y)) break;
      position.x = x; position.y = y;
    } else {
      if (canOccupy(x, position.y)) position.x = x;
      if (canOccupy(position.x, y)) position.y = y;
    }
  }
  position.dir = facingDirection(dx, dy, position.dir);
  position.moving = Math.hypot(position.x - startX, position.y - startY) > 1e-8;
  return position.moving;
}
// Consome a distância disponível sem pular obstáculos nem ganhar velocidade
// pela tolerância de chegada. Caminho bloqueado não desliza para fora da rota.
export function advancePath(position, path, distance, canOccupy) {
  let remaining = Math.max(0, Number.isFinite(distance) ? distance : 0);
  let moved = false, blocked = false;
  while (path.length) {
    const target = path[0];
    const dx = target.x - position.x, dy = target.y - position.y;
    const length = Math.hypot(dx, dy);
    if (length < 1e-8) { path.shift(); continue; }
    if (remaining <= 0) break;
    const step = Math.min(length, remaining);
    const x = position.x, y = position.y;
    moveWithCollision(position, dx / length * step, dy / length * step, canOccupy, false);
    const traveled = Math.hypot(position.x - x, position.y - y);
    moved ||= traveled > 1e-8;
    remaining -= traveled;
    if (traveled + 1e-8 < step) { blocked = true; break; }
    if (step === length) path.shift();
    else break;
  }
  position.moving = moved;
  return { moved, blocked, finished: path.length === 0 };
}

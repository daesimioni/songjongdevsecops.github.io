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
// Busca a primeira borda livre dentro do subpasso. Evita a folga visível de
// até 0,08 tile que a rejeição do subpasso inteiro deixava junto das paredes.
function allowedFraction(x,y,dx,dy,canOccupy){
  if(!canOccupy(x+dx*1e-4,y+dy*1e-4))return 0;
  let lo=0,hi=1;
  for(let i=0;i<14;i++){
    const mid=(lo+hi)/2;
    if(canOccupy(x+dx*mid,y+dy*mid))lo=mid;else hi=mid;
  }
  return lo;
}
export function moveWithCollision(position, dx, dy, canOccupy, slide = true) {
  if (![position.x,position.y,dx,dy].every(Number.isFinite)) {position.moving=false;return false;}
  const startX = position.x, startY = position.y;
  const chunks = Math.max(1, Math.ceil(Math.hypot(dx, dy) / 0.08));
  const sx = dx / chunks, sy = dy / chunks;
  for (let i = 0; i < chunks; i++) {
    const oldX=position.x,oldY=position.y;
    const x = position.x + sx, y = position.y + sy;
    if (!slide) {
      if (!canOccupy(x,y)) {
        const fraction=allowedFraction(position.x,position.y,sx,sy,canOccupy);
        position.x+=sx*fraction;position.y+=sy*fraction;break;
      }
      position.x=x;position.y=y;
    } else {
      if(sx){
        const f=canOccupy(x,position.y)?1:allowedFraction(position.x,position.y,sx,0,canOccupy);
        position.x+=sx*f;
      }
      if(sy){
        const f=canOccupy(position.x,y)?1:allowedFraction(position.x,position.y,0,sy,canOccupy);
        position.y+=sy*f;
      }
      if(position.x===oldX&&position.y===oldY)break;
    }
  }
  position.dir = facingDirection(position.x - startX, position.y - startY, position.dir);
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

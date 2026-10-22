import { segmentFree } from "../core/collision.js";
import { moveWithCollision, advancePath, directionVector, facingDirection } from "../core/movement.js";
import { PLAYER_SPEED, SPRINT_MULT, PLAYER_W, PLAYER_H, MAP_W, MAP_H, INTERACT_RADIUS } from "../core/runtime-config.js";
import { findInteractionPath, findPath, tileWalkable } from "../core/path.js";

// Dependências da cena são explícitas; sem DOM, rede ou armazenamento.
export function createSurfaceMovement({ player, state, world, rpg, audio, toast, interactTarget, isDungeonOpen = () => false }) {
function updateBoost(dt, active) {
  const target = active && state.sprint ? 1 : 0;
  player.boost += (target - player.boost) * Math.min(1, dt * 8);
  if (player.boost < 0.01) player.boost = 0;
}

function walkStep(dx, dy, dt) {
  const len = Math.hypot(dx, dy);
  if (!len) { player.moving = false; return false; }
  dx /= len; dy /= len;
  const sprinting = state.sprint;
  const step = PLAYER_SPEED * (sprinting ? SPRINT_MULT : 1) * rpg.speedMult() * (isDungeonOpen() ? 1 : rpg.mountSpeedMult()) * dt;
  const oldX = player.x, oldY = player.y;
  // Em velocidade de nave o passo do quadro passa de um tile e atravessaria
  // parede fina. Divide o movimento em pedaços que a colisão consegue ver.
  moveWithCollision(player, dx * step, dy * step,
    (x, y) => !world.boxCollides(x, y, PLAYER_W, PLAYER_H));
  player.x = Math.max(0.5, Math.min(MAP_W - 0.5, player.x));
  player.y = Math.max(0.5, Math.min(MAP_H - 0.5, player.y));
  const moved = player.x !== oldX || player.y !== oldY;
  player.dir = facingDirection(player.x-oldX,player.y-oldY,player.dir);
  player.moving = moved;
  if (!moved) return false;
  movementSound();
  return true;
}

function movementSound() {
  const now = performance.now();
  if (now - state.footstepAt > (state.sprint ? 155 : 340)) {
    state.footstepAt = now;
    if (state.sprint) audio.hover(); else audio.footstep();
  }
}

function updateMovement(dt) {
  const keys = state.keys;
  let dx = 0, dy = 0;
  if (keys.has("a") || keys.has("arrowleft") || state.touch.left) dx -= 1;
  if (keys.has("d") || keys.has("arrowright") || state.touch.right) dx += 1;
  if (keys.has("w") || keys.has("arrowup") || state.touch.up) dy -= 1;
  if (keys.has("s") || keys.has("arrowdown") || state.touch.down) dy += 1;
  if (dx === 0 && dy === 0) { player.moving = false; return; }
  walkStep(dx, dy, dt);
}

function clearPath() {
  state.path = null;
  state.pending = null;
  player.pathLine = null;
  player.pathGoal = null;
}

function interactionRadius(kind) {
  return { item: 1.4, gather: 2.2, cave: 1.8, casa: 1.8, porta: 1.5, mesa: 1.7, lareira: 1.7, morador: 1.7 }[kind] || INTERACT_RADIUS;
}

function setPathTo(x, y, pending = null, silencioso = false) {
  // acha o caminho antes de limpar: arrastar por cima da água não pode
  // interromper a caminhada que já estava em curso
  const target = pending?.kind === "cave" ? pending.obj.exit : pending?.obj;
  const path = target
    ? findInteractionPath(MAP_W, MAP_H, (tx, ty, pad) => tileWalkable(world, tx, ty, pad), player, target,
      { radius: interactionRadius(pending.kind), canTraverse:(a,b)=>segmentFree(a,b,(x,y)=>!world.boxCollides(x,y,PLAYER_W,PLAYER_H)) })
    : findPath(world, { x: player.x, y: player.y }, { x, y });
  if (!path || !path.length) {
    if (!silencioso) toast("Não achei um caminho até aí.", 2800);
    return false;
  }
  clearPath();
  state.path = path;
  state.pending = pending;
  player.pathLine = path;
  const last = path[path.length - 1];
  player.pathGoal = { x: last.x, y: last.y };
  return true;
}

function updateAutoWalk(dt) {
  const path = state.path;
  if (!path || !path.length) return false;
  const stepLen = PLAYER_SPEED * (state.sprint ? SPRINT_MULT : 1) * rpg.speedMult() * (isDungeonOpen() ? 1 : rpg.mountSpeedMult()) * dt;
  const result = advancePath(player, path, stepLen,
    (x, y) => !world.boxCollides(x, y, PLAYER_W, PLAYER_H));
  if (result.moved) movementSound();
  if (result.blocked) {
    clearPath();
    toast("O caminho travou. Clique de novo.", 2600);
  } else if (result.finished) {
    const pending = state.pending;
    clearPath();
    if (pending) {
      const point = pending.kind === "cave" ? pending.obj.exit : pending.obj;
      const d = Math.hypot(point.x - player.x, point.y - player.y);
      if (d <= interactionRadius(pending.kind)) interactTarget(pending);
      else toast("Não cheguei perto o bastante. Clique de novo.", 2800);
    }
  }
  return true;
}

function catFree(x, y) {
  // o gato ocupa menos que o jogador, mas respeita água, árvore e parede
  return !world.boxCollides(x, y, 0.42, 0.32);
}

function moveCat(dx,dy){
  return moveWithCollision(world.cat,dx,dy,catFree);
}

function updateCat(dt) {
  const cat = world.cat;
  const pet = rpg.activePet();
  cat.kind = pet?.kind || "cat";
  if (!pet) {
    // sem companheiro ativo o gato do porto fica de guarda, não segue
    cat.moving = false;
    return;
  }
  const vector = directionVector(player.dir);
  const behind = [-vector.x * 0.9, -vector.y * 0.9];
  const behindX = player.x + behind[0];
  const behindY = player.y + behind[1];
  const d = Math.hypot(behindX - cat.x, behindY - cat.y);
  if (d > 9 && catFree(behindX, behindY)) {
    // ficou preso longe demais: reaparece atrás do jogador, em chão livre
    cat.x = behindX;
    cat.y = behindY;
    cat.moving = false;
    return;
  }
  if (d > 1.15) {
    const sp = Math.min(4.2, 1.2 + d) * dt;
    const oldX = cat.x, oldY = cat.y;
    const moved = moveCat(((behindX - cat.x) / d) * sp, ((behindY - cat.y) / d) * sp);
    cat.facing = facingDirection(cat.x-oldX, cat.y-oldY, cat.facing);
    cat.moving = moved;
  } else {
    cat.moving = false;
  }
}

  return { updateBoost, walkStep, updateMovement, clearPath, interactionRadius, setPathTo, updateAutoWalk, updateCat };
}

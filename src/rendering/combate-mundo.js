import { directionAngle } from "../core/movement.js";
import { drawCreatureArt } from "./creature.js";

const UNIT = 1 / 3; // 48 unidades de combate = 16 pixels de mundo.
export function drawWorldEnemy(ctx, enemy, time) {
  ctx.save();
  ctx.translate(enemy.x * UNIT, enemy.y * UNIT);
  drawCreatureArt(ctx, enemy.kind, enemy.monster.accent || "#e99a45", time, enemy.boss ? 1.15 : 0.95, enemy.dir, !enemy.vento && !enemy.especial);
  ctx.restore();
}
export function drawWorldCombat(ctx, model) {
  if (!model) return;
  const now = model.agora, j = model.jogador;
  ctx.save();
  for (const enemy of model.vivos()) {
    const x = enemy.x * UNIT, y = enemy.y * UNIT;
    ctx.fillStyle = "#162029";
    ctx.fillRect(x - 11, y - 30, 22, 3);
    ctx.fillStyle = "#f0646d";
    ctx.fillRect(x - 11, y - 30, 22 * enemy.hp / enemy.hpMax, 3);
    if (enemy.vento || enemy.especial) {
      ctx.strokeStyle = enemy.especial ? "#ef8454" : "#ffc857";
      ctx.fillStyle = "#ee795033";
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.arc(x, y, (enemy.especial ? 150 : 82 + enemy.raio) * UNIT, 0, Math.PI * 2);
      ctx.fill(); ctx.stroke();
    }
    if (now < enemy.hitAte) {
      ctx.strokeStyle = "#fff3d1";
      ctx.strokeRect(x - 9, y - 24, 18, 24);
    }
  }
  const x = j.x * UNIT, y = j.y * UNIT;
  if (j.defendendo || now < j.invulneravelAte) {
    ctx.strokeStyle = j.defendendo ? "#6bd5ff" : "#61f4c0";
    ctx.lineWidth = 1;
    ctx.beginPath();ctx.arc(x, y - 5, 10, 0, Math.PI * 2);ctx.stroke();
  }
  if (now < j.ataqueVisualAte) {
    const angle = directionAngle(j.dir);
    ctx.lineWidth = 2; ctx.strokeStyle = "#fff3d1";
    ctx.beginPath();ctx.arc(x, y - 4, 18, angle - 0.8, angle + 0.8);ctx.stroke();
  }
  ctx.restore();
}

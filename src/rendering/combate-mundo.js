import { directionVector } from "../core/movement.js";
import { drawCreatureArt } from "./creature.js";
import { combatPose, drawEffect, drawCombatEvents } from "./combat-vfx.js";

const UNIT = 1 / 3; // 48 unidades de combate = 16 pixels de mundo.
export function drawWorldEnemy(ctx, enemy, time, now = 0) {
  const pose = combatPose(enemy, now);
  ctx.save();
  ctx.translate(enemy.x * UNIT + pose.x, enemy.y * UNIT + pose.y);
  drawCreatureArt(ctx, enemy.kind, enemy.monster.accent || "#e99a45", time, enemy.boss ? 1.15 : 0.95, enemy.dir, !enemy.vento && !enemy.especial);
  ctx.restore();
}
export function drawWorldCombat(ctx, model) {
  if (!model) return;
  const now = model.agora, j = model.jogador;
  const active = model.phase === "combat";
  ctx.save();
  for (const enemy of active ? model.vivos() : []) {
    const x = enemy.x * UNIT, y = enemy.y * UNIT;
    const selected = (model.target && !model.target.morte ? model.target : model.inimigoAoAlcance()) === enemy;
    if (selected) {
      ctx.strokeStyle = "#ffc857"; ctx.lineWidth = 0.8;
      ctx.setLineDash([3, 2]);
      ctx.beginPath(); ctx.ellipse(x, y + 1, 11, 5, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.setLineDash([]);
    }
    ctx.fillStyle = "#0b101b"; ctx.fillRect(x - 12, y - 32, 24, 4);
    ctx.fillStyle = selected ? "#ffc857" : "#ef7884";
    ctx.fillRect(x - 11, y - 31, 22 * Math.max(0, enemy.hp / enemy.hpMax), 2);
    if (enemy.vento || enemy.especial) {
      const duration = enemy.especial ? 900 : enemy.boss ? 470 : 420 + enemy.tier * 20;
      const remaining = (enemy.especial ? enemy.especialAte : enemy.ventoAte) - now;
      const progress = Math.max(0, Math.min(1, 1 - remaining / duration));
      const radius = (enemy.especial ? 150 : 82 + enemy.raio) * UNIT;
      ctx.strokeStyle = enemy.especial ? "#ff855f" : "#ffc857";
      ctx.fillStyle = `rgba(239,105,70,${0.04 + progress * 0.09})`;
      ctx.lineWidth = 0.65;
      ctx.beginPath(); ctx.arc(x, y, radius, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
      ctx.lineWidth = 1.5;
      ctx.beginPath(); ctx.arc(x, y, radius, -Math.PI / 2, -Math.PI / 2 + progress * Math.PI * 2); ctx.stroke();
    }
    if (enemy.atordoadoAte > now) drawEffect(ctx, "ice", 3, x, y - 7, 23, 0, 0.45);
  }
  if (active && (j.defendendo || j.escudo)) {
    const dir = directionVector(j.dir);
    drawEffect(ctx, "shield", 2 + Math.floor(now / 180) % 3,
      j.x * UNIT + dir.x * 7, j.y * UNIT - 10 + dir.y * 4, 21);
  }
  drawCombatEvents(ctx, model);
  ctx.restore();
}

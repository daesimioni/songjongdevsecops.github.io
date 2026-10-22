import { artTime } from "./art-style.js";
// A nave: o mesmo casco na superfície e na caverna. Fica num módulo só para o
// desenho de um lugar não divergir do outro.

export function skiffRear(dir) {
  // a popa fica atrás da direção: nas diagonais ela é meia torta, para o rastro
  // e o brilho acompanharem a curva
  if (dir === 4) return { x: 0.7, y: 0.7 };
  if (dir === 5) return { x: -0.7, y: 0.7 };
  if (dir === 6) return { x: 0.7, y: -0.7 };
  if (dir === 7) return { x: -0.7, y: -0.7 };
  return {
    x: dir === 1 ? -1 : dir === 2 ? 1 : 0,
    y: dir === 3 ? -1 : dir === 0 ? 1 : 0,
  };
}

export function drawSkiff(ctx, px, py, dir, time, boost = 1, moving = false) {
  if (boost <= 0.01) return;
  time = artTime(time);
  const bob = Math.sin(time * 0.007) * 1.1;
  const by = py - 2 + bob;
  const rear = skiffRear(dir);
  const vx = -rear.x;
  const vy = -rear.y;
  ctx.save();
  ctx.globalAlpha = Math.min(1, boost);

  // sombra e halo
  ctx.fillStyle = "rgba(2, 4, 10, 0.32)";
  ctx.beginPath();
  ctx.ellipse(px, py + 4, 12, 3.2, 0, 0, Math.PI * 2);
  ctx.fill();
  const pulse = 0.5 + Math.sin(time * 0.018) * 0.5;
  const gx = px + rear.x * 9;
  const gy = by + rear.y * 5;
  const glow = ctx.createRadialGradient(gx, gy, 1, gx, gy, 19);
  glow.addColorStop(0, `rgba(107, 213, 255, ${0.18 + pulse * 0.14})`);
  glow.addColorStop(1, "rgba(107, 213, 255, 0)");
  ctx.fillStyle = glow;
  ctx.fillRect(px - 26, by - 20, 52, 40);

  // casco em degraus
  ctx.fillStyle = "#0b2438";
  ctx.fillRect(px - 11, by - 1, 22, 4);
  ctx.fillRect(px - 8, by - 3, 16, 2);
  ctx.fillRect(px - 8, by + 3, 16, 2);
  ctx.fillStyle = "#1d6280";
  ctx.fillRect(px - 10, by, 20, 2);
  ctx.fillRect(px - 7, by - 2, 14, 2);
  ctx.fillStyle = "#61f4c0";
  ctx.fillRect(px - 9, by, 18, 1);
  // convés
  ctx.fillStyle = "#122a4a";
  ctx.fillRect(px - 6, by - 2, 12, 2);
  ctx.fillStyle = "#ffc857";
  ctx.fillRect(px - 2, by - 2, 4, 2);
  // aletas
  ctx.fillStyle = "#2f8fae";
  ctx.fillRect(px - 13, by, 3, 3);
  ctx.fillRect(px + 10, by, 3, 3);
  // motor
  ctx.fillStyle = "#ffb26b";
  ctx.fillRect(px + rear.x * 9 - 2, by + rear.y * 6 - 1, 4, 3);
  ctx.fillStyle = "#fff3d1";
  ctx.fillRect(px + rear.x * 9 - 1, by + rear.y * 6, 2, 1);

  // Nervuras do casco, escotilha e luzes de navegação.
  ctx.fillStyle='#0a1b32';for(const x of [-7,-3,3,7])ctx.fillRect(px+x,by+1,.5,2);
  ctx.fillStyle='#d4f2ed';ctx.fillRect(px-6,by-2,2,.5);ctx.fillRect(px+4,by-2,2,.5);
  ctx.fillStyle='#ffb092';ctx.fillRect(px-12,by+1,1,.5);
  ctx.fillStyle='#88eac3';ctx.fillRect(px+11,by+1,1,.5);
  if (moving) {
    ctx.strokeStyle = "rgba(223, 245, 255, 0.42)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 3; i++) {
      const d = 16 + i * 7;
      const ox = -vy * (i - 1) * 3;
      const oy = vx * (i - 1) * 3;
      ctx.beginPath();
      ctx.moveTo(px + rear.x * d + ox, by + rear.y * d + oy);
      ctx.lineTo(px + rear.x * (d + 8) + ox, by + rear.y * (d + 8) + oy);
      ctx.stroke();
    }
  }
  ctx.restore();
}

import { artTime } from "./art-style.js";
// O papel muda a silhueta e o assunto muda o objeto na mão. Antes todos os
// 194 NPCs eram o mesmo boneco com a camisa de outra cor, e nada no desenho
// dizia se a pessoa ensina química ou guarda o porto.
export function drawNpcKit(ctx, npc, px, py, bob, time, colors) {
  time = artTime(time);
  const s = npc.scale || 0.9;
  const accent = npc.accent || colors.accent || "#ffc857";
  const dark = "rgba(8,8,16,0.55)";
  ctx.save();
  ctx.translate(px, py + bob);
  ctx.scale(s, s);
  if (npc.role === "mestre") {
    // casaco comprido e manto nos ombros: a silhueta do guardião do saber
    ctx.fillStyle = colors.shirt;
    ctx.fillRect(-4, -6, 8, 4);
    ctx.fillStyle = dark;
    ctx.fillRect(-4, -3, 8, 1);
    ctx.fillRect(-1, -6, 2, 3);
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.85;
    ctx.fillRect(-5, -13, 10, 1);
    ctx.fillRect(-5, -12, 1, 4);
    ctx.fillRect(4, -12, 1, 4);
    ctx.globalAlpha = 1;
  } else if (npc.role === "monitor") {
    ctx.fillStyle = "rgba(242,238,226,0.32)";
    ctx.fillRect(-3, -11, 6, 6);
    ctx.fillStyle = dark;
    ctx.fillRect(-4, -7, 8, 1);
    ctx.fillStyle = "rgba(242,238,226,0.5)";
    ctx.fillRect(-3, -13, 1, 3);
  } else {
    ctx.fillStyle = "rgba(12,10,26,0.45)";
    ctx.fillRect(-5, -13, 10, 4);
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.7;
    ctx.fillRect(-5, -10, 10, 1);
    ctx.globalAlpha = 1;
  }
  // o objeto do assunto vai na mão direita, sempre visível
  // na altura da mão, não do ombro
  const x = 6;
  const y = -6;
  ctx.fillStyle = accent;
  switch (npc.subject) {
    case "math":
      for (let i = 0; i < 4; i++) {
        ctx.fillRect(x - 2 - i, y + i, 1, 1);
        ctx.fillRect(x + i, y + i, 1, 1);
      }
      ctx.fillRect(x - 2, y - 2, 5, 1);
      break;
    case "physics":
      ctx.fillStyle = "rgba(182,238,255,0.85)";
      ctx.fillRect(x - 1, y - 3, 3, 3);
      ctx.fillStyle = accent;
      ctx.fillRect(x - 2, y - 3, 1, 3);
      ctx.fillRect(x + 2, y - 3, 1, 3);
      ctx.fillRect(x - 1, y, 3, 1);
      ctx.fillRect(x + 1, y + 1, 1, 2);
      break;
    case "chem":
      ctx.fillStyle = "rgba(200,240,255,0.6)";
      ctx.fillRect(x - 1, y - 3, 2, 2);
      ctx.fillStyle = accent;
      ctx.fillRect(x - 2, y - 1, 4, 2);
      break;
    case "cs":
      ctx.fillStyle = dark;
      ctx.fillRect(x - 2, y - 3, 3, 1);
      ctx.fillRect(x + 1, y - 2, 1, 1);
      ctx.fillRect(x - 2, y - 1, 3, 1);
      ctx.fillStyle = accent;
      ctx.fillRect(x - 3, y, 2, 1);
      break;
    case "lingua":
      ctx.fillStyle = "rgba(240,238,226,0.9)";
      ctx.fillRect(x - 2, y - 2, 4, 3);
      ctx.fillStyle = accent;
      ctx.fillRect(x - 2, y - 2, 4, 1);
      break;
    case "music":
      ctx.fillRect(x - 2, y + 1, 2, 2);
      ctx.fillRect(x, y - 3, 1, 4);
      break;
    case "ai":
      ctx.fillStyle = dark;
      ctx.fillRect(x - 2, y - 2, 4, 4);
      ctx.fillStyle = accent;
      ctx.fillRect(x - 1, y - 1, 2, 2);
      break;
    case "hub":
      ctx.globalAlpha = 0.22 + Math.sin(time * 0.003 + px) * 0.1;
      ctx.beginPath();
      ctx.arc(x, y - 1, 4.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = 1;
      ctx.fillStyle = dark;
      ctx.fillRect(x - 2, y - 3, 4, 5);
      ctx.fillStyle = accent;
      ctx.fillRect(x - 1, y - 2, 2, 3);
      break;
    default:
      ctx.fillRect(x, y - 3, 1, 3);
      ctx.fillRect(x - 1, y - 2, 3, 1);
  }
  // Bainha bordada e reflexo do instrumento carregado, comuns a todos os ofícios.
  ctx.fillStyle='rgba(255,235,193,.45)';ctx.fillRect(-4,-10,1,.5);ctx.fillRect(x,-4,.5,1);
  ctx.fillStyle='rgba(7,17,32,.45)';ctx.fillRect(x-1,-2,3,.5);
  ctx.restore();
}

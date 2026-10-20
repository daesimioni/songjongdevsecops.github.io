import { hairById } from "./avatar.js";

// O mesmo boneco na superfície e no subsolo: cabelo, gênero e cores vêm do
// personagem salvo. Quem chama decide o chão, a sombra e o que fica por cima.
export function drawHuman(ctx, px, py, dir, moving, time, colors, scale = 1, look = null) {
  const s = scale;
  const step = moving ? Math.sin(time * 0.016) : 0;
  ctx.save();
  ctx.translate(px, py);
  ctx.scale(s, s);

  ctx.fillStyle = "rgba(2,4,10,0.38)";
  ctx.beginPath();
  ctx.ellipse(0, 0, 6.5, 2.6, 0, 0, Math.PI * 2);
  ctx.fill();

  const legOff = step > 0 ? 1 : step < -0 ? -1 : 0;
  const lift = moving ? Math.abs(step) * 1.1 : 0;
  const hair = hairById(look?.hair);
  // feminino tem ombro mais estreito e quadril mais largo; masculino o contrário
  const fem = look?.gender !== "m";
  const shoulder = fem ? 4 : 5;
  const armX = shoulder + 1;

  // cabelo que cai nas costas fica atrás do corpo
  if (hair.back) {
    ctx.fillStyle = colors.hair;
    ctx.fillRect(-4, -21, 8, 8 + hair.back);
    ctx.fillRect(-5, -19, 1, Math.max(0, hair.back - 2));
    ctx.fillRect(4, -19, 1, Math.max(0, hair.back - 2));
  }

  // pernas
  ctx.fillStyle = colors.pants;
  ctx.fillRect(-4, -5, 3, 5 - lift);
  ctx.fillRect(1, -5, 3, 4);
  ctx.fillStyle = colors.shoes || "#1b1c2c";
  ctx.fillRect(-4, -1, 3, 1);
  ctx.fillRect(1, -2, 3, 1);

  // corpo
  ctx.fillStyle = colors.shirt;
  ctx.fillRect(-shoulder, -13, shoulder * 2, 9);
  ctx.fillStyle = "rgba(255,255,255,0.16)";
  ctx.fillRect(-shoulder, -13, 2, 8);
  ctx.fillStyle = colors.pants;
  ctx.fillRect(-4, -5, 8, 2);

  // braços
  ctx.fillStyle = colors.shirt;
  ctx.fillRect(-armX, -12 + Math.max(0, legOff), 2, 6);
  ctx.fillRect(armX - 1, -12 - Math.max(0, legOff), 2, 6);
  ctx.fillStyle = colors.skin;
  ctx.fillRect(-armX, -6 + Math.max(0, legOff), 2, 2);
  ctx.fillRect(armX - 1, -6 - Math.max(0, legOff), 2, 2);

  // cabeça
  ctx.fillStyle = colors.skin;
  ctx.fillRect(-4, -20, 8, 8);
  // cabelo: topo, costeleta e nuca, sempre deixando o rosto de fora
  ctx.fillStyle = colors.hair;
  const crown = -20 - hair.cap;
  ctx.fillRect(-4, crown, 8, hair.cap + 1);
  if (hair.cap >= 3) {
    ctx.fillRect(-5, crown + 1, 1, 2);
    ctx.fillRect(4, crown + 1, 1, 2);
  }
  if (hair.bun) {
    ctx.fillRect(-3, crown - hair.bun + 1, 6, hair.bun - 1);
    ctx.fillRect(-2, crown - hair.bun, 4, hair.bun);
  }
  if (hair.crest) ctx.fillRect(-1, crown - hair.crest, 2, hair.crest + 2);
  if (hair.pompadour) {
    ctx.fillRect(-3, crown - hair.pompadour + 1, 7, hair.pompadour - 1);
    ctx.fillRect(-2, crown - hair.pompadour, 5, 1);
  }
  if (hair.curl) {
    for (const x of [-5, -2, 2, 4]) ctx.fillRect(x, crown + (x % 2 ? -1 : 1), 2, 2);
  }
  if (hair.wave) {
    for (const y of [crown + 1, crown + 4, crown + 7]) {
      ctx.fillRect(-6, y, 2, 3);
      ctx.fillRect(5, y + 1, 2, 3);
    }
  }
  if (hair.side) {
    if (dir === 0) {
      ctx.fillRect(-5, -20, 1, hair.side);
      ctx.fillRect(4, -20, 1, hair.side);
    } else if (dir === 1) {
      ctx.fillRect(2, -20, 3, hair.side + 1);
    } else if (dir === 2) {
      ctx.fillRect(-5, -20, 3, hair.side + 1);
    } else {
      ctx.fillRect(-4, -20, 8, Math.min(7, hair.side + 2));
    }
  }
  if (hair.bang && dir !== 3) ctx.fillRect(-4, -20, 8, hair.bang);
  // cabelo comprido cai pelos lados do corpo, senão a camisa come tudo
  if (hair.back) {
    const bottom = -21 + 8 + hair.back;
    ctx.fillRect(-6, -20, 2, bottom + 20);
    ctx.fillRect(4, -20, 2, bottom + 20);
  }
  if (hair.braid) {
    const side = dir === 1 || dir === 3 ? 3 : -7;
    for (let i = 0; i < hair.braid; i++) {
      ctx.fillRect(side + (i % 2 ? 1 : 0), -16 + i * 4, 3, 4);
    }
  }

  if (hair.tail) {
    const tailY = hair.tailY ?? -18;
    if (dir === 0) {
      ctx.fillRect(-8, tailY, 3, hair.tail);
      ctx.fillRect(5, tailY, 3, hair.tail);
    } else if (dir === 3) {
      ctx.fillRect(-3, tailY + 1, 6, hair.tail - 1);
    } else {
      const tx = dir === 1 ? 4 : -9;
      ctx.fillRect(tx, tailY, 5, hair.tail);
    }
  }
  // rosto: olho e nariz do lado para onde anda
  ctx.fillStyle = colors.eyes || "#14121f";
  if (dir === 0) {
  ctx.fillRect(-2, -17, 1, 2);
  ctx.fillRect(1, -17, 1, 2);
  } else if (dir === 1) {
  ctx.fillRect(-3, -17, 1, 2);
  } else if (dir === 2) {
  ctx.fillRect(2, -17, 1, 2);
  }
  if (dir === 1 || dir === 2) {
  ctx.fillStyle = colors.skin;
  ctx.fillRect(dir === 1 ? -5 : 4, -16, 1, 2);
  }
  // detalhe no peito
  ctx.fillStyle = colors.accent || "#fff3d1";
  ctx.fillRect(-1, -11, 2, 2);

  ctx.restore();
  }

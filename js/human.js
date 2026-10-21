import { hairById } from "./avatar.js";

// O lado e a camada de cada peça de equipamento mudam com a visão. De frente
// arma e escudo aparecem inteiros; de costas os dois ficam atrás do corpo; de
// perfil o escudo fica no braço de trás e a arma aponta para o lado da cara.
export function gearView(dir) {
  const armaLado = dir === 0 || dir === 2 ? 1 : -1;
  return {
    armaLado,
    escudoLado: -armaLado,
    armaAtras: dir === 3,
    escudoAtras: dir !== 0,
  };
}

// O mesmo boneco na superfície e no subsolo: cabelo, gênero e cores vêm do
// personagem salvo. Quem chama decide o chão, a sombra e o que fica por cima.
export function drawHuman(ctx, px, py, dir, moving, time, colors, scale = 1, look = null, gear = null) {
  const s = scale;
  const step = moving ? Math.sin(time * 0.016) : 0;
  ctx.save();
  ctx.translate(px, py);
  ctx.scale(s, s);

  ctx.fillStyle = "rgba(2,4,10,0.38)";
  ctx.beginPath();
  ctx.ellipse(0, 0, 6.5, 2.6, 0, 0, Math.PI * 2);
  ctx.fill();

  // o que está equipado muda o desenho: cor da armadura, elmo, arma e escudo
  const equip = gear || {};
  const shirt = equip.armor?.accent || colors.shirt;
  const pants = equip.legs?.accent || colors.pants;
  const shoes = equip.boots?.accent || colors.shoes || "#1b1c2c";
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

  // Arma e escudo trocam de lado com a visão. De costas os dois ficam atrás
  // do corpo; de lado o escudo fica no braço de trás. O desenho é feito do
  // lado direito e espelhado, para não duplicar cada peça de arte.
  const { armaLado, escudoLado, armaAtras, escudoAtras } = gearView(dir);
  const comLado = (lado, fn) => {
    ctx.save();
    ctx.scale(lado, 1);
    fn();
    ctx.restore();
  };
  const desenharArma = () => {
    const arma = equip.weapon;
    if (!arma) return;
    const gume = arma.accent || "#d8d2ea";
    comLado(armaLado, () => {
      if (arma.weapon === "wand" || arma.weapon === "rod") {
        ctx.fillStyle = "#6b4a2a";
        ctx.fillRect(armX + 1, -15, 2, 11);
        ctx.fillStyle = gume;
        ctx.fillRect(armX, -18, 4, 4);
        ctx.fillStyle = "rgba(255,255,255,0.5)";
        ctx.fillRect(armX + 1, -17, 1, 1);
      } else if (arma.weapon === "club") {
        ctx.fillStyle = "#6b4a2a";
        ctx.fillRect(armX + 1, -15, 2, 11);
        ctx.fillStyle = gume;
        ctx.fillRect(armX - 1, -21, 6, 7);
        ctx.fillStyle = "rgba(0,0,0,0.25)";
        ctx.fillRect(armX, -20, 4, 1);
      } else {
        ctx.fillStyle = "#d8d2ea";
        ctx.fillRect(armX + 2, -24, 2, 13);
        ctx.fillStyle = gume;
        ctx.fillRect(armX + 2, -24, 1, 11);
        ctx.fillStyle = "#8a6a4a";
        ctx.fillRect(armX, -11, 6, 2);
      }
    });
  };
  const desenharEscudo = () => {
    if (!equip.shield) return;
    const cor = equip.shield.accent || "#ffc857";
    comLado(escudoLado, () => {
      ctx.fillStyle = "#101426";
      ctx.fillRect(armX - 1, -13, 5, 9);
      ctx.fillStyle = cor;
      ctx.fillRect(armX, -12, 3, 7);
    });
  };
  if (armaAtras) desenharArma();
  if (escudoAtras) desenharEscudo();

  // pernas
  ctx.fillStyle = pants;
  ctx.fillRect(-4, -5, 3, 5 - lift);
  ctx.fillRect(1, -5, 3, 4);
  ctx.fillStyle = shoes;
  ctx.fillRect(-4, -1, 3, 1);
  ctx.fillRect(1, -2, 3, 1);

  // corpo
  ctx.fillStyle = shirt;
  ctx.fillRect(-shoulder, -13, shoulder * 2, 9);
  ctx.fillStyle = "rgba(255,255,255,0.16)";
  ctx.fillRect(-shoulder, -13, 2, 8);
  ctx.fillStyle = pants;
  ctx.fillRect(-4, -5, 8, 2);

  // braços
  ctx.fillStyle = shirt;
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
  if (equip.helmet) {
    const metal = equip.helmet.accent || "#b8b0d8";
    if (dir === 3) {
      // de costas o elmo é fechado: sem rosto, com a costura no meio
      ctx.fillStyle = "#101426";
      ctx.fillRect(-5, -23, 10, 11);
      ctx.fillStyle = metal;
      ctx.fillRect(-5, -23, 10, 8);
      ctx.fillRect(-4, -15, 8, 2);
      ctx.fillStyle = "rgba(0,0,0,0.3)";
      ctx.fillRect(-1, -23, 1, 8);
      ctx.fillStyle = "rgba(255,255,255,0.22)";
      ctx.fillRect(-3, -23, 2, 1);
    } else if (dir === 0) {
      // de frente: aba, laterais e abertura para o rosto
      ctx.fillStyle = "#101426";
      ctx.fillRect(-5, -23, 10, 3);
      ctx.fillStyle = metal;
      ctx.fillRect(-5, -23, 10, 2);
      ctx.fillRect(-5, -21, 2, 5);
      ctx.fillRect(3, -21, 2, 5);
      ctx.fillStyle = "rgba(255,255,255,0.28)";
      ctx.fillRect(-3, -23, 3, 1);
      ctx.fillStyle = "rgba(0,0,0,0.22)";
      ctx.fillRect(-4, -21, 8, 1);
    } else {
      // de perfil: o elmo cobre a nuca e projeta a proteção para o lado da cara
      const frente = dir === 1 ? -1 : 1;
      ctx.fillStyle = "#101426";
      ctx.fillRect(-5, -23, 10, 3);
      ctx.fillStyle = metal;
      ctx.fillRect(-5, -23, 10, 2);
      ctx.fillRect(frente < 0 ? -5 : 3, -21, 2, 6);
      ctx.fillRect(frente < 0 ? -4 : 3, -20, 1, 4);
      ctx.fillStyle = "rgba(255,255,255,0.28)";
      ctx.fillRect(frente < 0 ? -4 : 1, -23, 3, 1);
      ctx.fillStyle = "rgba(0,0,0,0.2)";
      ctx.fillRect(frente < 0 ? 2 : -4, -21, 2, 5);
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

  if (!armaAtras) desenharArma();
  if (!escudoAtras) desenharEscudo();

  ctx.restore();
  }

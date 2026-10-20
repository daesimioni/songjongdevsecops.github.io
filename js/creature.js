// Bichos das caçadas desenhados na unha, em blocos, para o mapa e para a
// janela de duelo usarem o mesmo desenho.
export function drawCreature(ctx, kind, accent, time = 0, scale = 1) {
  const boss = kind === "boss";
  const bob = Math.sin(time * 0.004 + (boss ? 1.7 : 0)) * (boss ? 1.8 : 1.1);
  ctx.save();
  ctx.scale(scale, scale);
  ctx.translate(0, bob);

  // sombra
  ctx.fillStyle = "rgba(2, 4, 10, 0.32)";
  ctx.beginPath();
  ctx.ellipse(0, 0, boss ? 22 : 13, boss ? 5 : 3.4, 0, 0, Math.PI * 2);
  ctx.fill();

  if (kind === "slime") {
    ctx.fillStyle = "#10251f";
    ctx.fillRect(-9, -17, 18, 3);
    ctx.fillRect(-11, -13, 22, 8);
    ctx.fillRect(-9, -5, 18, 4);
    ctx.fillStyle = accent;
    ctx.fillRect(-9, -14, 18, 7);
    ctx.fillRect(-7, -7, 14, 3);
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    ctx.fillRect(-6, -15, 5, 2);
    ctx.fillStyle = "#101426";
    ctx.fillRect(-5, -12, 3, 3);
    ctx.fillRect(2, -12, 3, 3);
    ctx.fillStyle = "#f4f0ff";
    ctx.fillRect(-5, -12, 1, 1);
    ctx.fillRect(2, -12, 1, 1);
  } else if (kind === "eye") {
    ctx.fillStyle = "#1a1730";
    ctx.fillRect(-4, -20, 2, 8);
    ctx.fillRect(2, -20, 2, 8);
    ctx.fillStyle = accent;
    ctx.fillRect(-7, -22, 3, 2);
    ctx.fillRect(4, -22, 3, 2);
    ctx.fillStyle = "#101426";
    ctx.fillRect(-11, -17, 22, 14);
    ctx.fillStyle = "#e9e3ff";
    ctx.fillRect(-9, -15, 18, 10);
    ctx.fillStyle = accent;
    ctx.fillRect(-5, -13, 10, 7);
    ctx.fillStyle = "#101426";
    ctx.fillRect(-2, -11, 4, 4);
    ctx.fillStyle = "#fff";
    ctx.fillRect(-1, -11, 1, 1);
    ctx.fillStyle = "#101426";
    ctx.fillRect(-9, -3, 18, 2);
  } else if (kind === "bat") {
    ctx.fillStyle = "#1a1730";
    ctx.fillRect(-4, -12, 8, 8);
    ctx.fillRect(-2, -16, 2, 4);
    ctx.fillRect(1, -16, 2, 4);
    ctx.fillStyle = accent;
    ctx.fillRect(-14, -12, 10, 4);
    ctx.fillRect(-12, -9, 8, 3);
    ctx.fillRect(4, -12, 10, 4);
    ctx.fillRect(4, -9, 8, 3);
    ctx.fillStyle = "#101426";
    ctx.fillRect(-3, -10, 2, 2);
    ctx.fillRect(1, -10, 2, 2);
    ctx.fillStyle = "#fff3d1";
    ctx.fillRect(-3, -10, 1, 1);
    ctx.fillRect(1, -10, 1, 1);
  } else if (kind === "spider") {
    ctx.fillStyle = "#101426";
    for (const [x, y, w, h] of [
      [-12, -9, 5, 2], [7, -9, 5, 2], [-13, -6, 6, 2], [7, -6, 6, 2],
      [-12, -3, 5, 2], [7, -3, 5, 2], [-10, -1, 4, 2], [6, -1, 4, 2],
    ]) ctx.fillRect(x, y, w, h);
    ctx.fillStyle = accent;
    ctx.fillRect(-7, -12, 14, 9);
    ctx.fillStyle = "#1a1730";
    ctx.fillRect(-5, -10, 10, 5);
    ctx.fillStyle = "#fff3d1";
    ctx.fillRect(-4, -9, 2, 2);
    ctx.fillRect(2, -9, 2, 2);
  } else if (kind === "wisp") {
    ctx.fillStyle = "rgba(255,255,255,0.10)";
    ctx.beginPath();
    ctx.arc(0, -12, 16, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = accent;
    ctx.fillRect(-5, -17, 10, 7);
    ctx.fillRect(-3, -10, 6, 4);
    ctx.fillStyle = "#fff3d1";
    ctx.fillRect(-3, -15, 3, 2);
    ctx.fillStyle = "#101426";
    ctx.fillRect(-2, -14, 1, 1);
    ctx.fillRect(1, -14, 1, 1);
    ctx.fillStyle = accent;
    ctx.fillRect(-1, -7, 2, 5);
    ctx.fillRect(-4, -4, 3, 2);
  } else if (kind === "scorpion") {
    ctx.fillStyle = "#101426";
    for (const [x, y, w, h] of [[-13, -8, 6, 2], [7, -8, 6, 2], [-14, -5, 7, 2], [7, -5, 7, 2], [-12, -2, 5, 2], [7, -2, 5, 2]]) ctx.fillRect(x, y, w, h);
    ctx.fillStyle = accent;
    ctx.fillRect(-6, -10, 12, 8);
    ctx.fillRect(-3, -15, 6, 5);
    ctx.fillStyle = "#1a1730";
    ctx.fillRect(4, -16, 3, 3);
    ctx.fillRect(-7, -16, 3, 3);
    ctx.fillStyle = "#fff3d1";
    ctx.fillRect(-2, -8, 2, 2);
    ctx.fillRect(1, -8, 2, 2);
  } else if (kind === "golem") {
    ctx.fillStyle = "#171a2b";
    ctx.fillRect(-8, -8, 6, 8);
    ctx.fillRect(2, -8, 6, 8);
    ctx.fillStyle = "#3b3d58";
    ctx.fillRect(-10, -25, 20, 17);
    ctx.fillStyle = "#555a7c";
    ctx.fillRect(-8, -23, 16, 6);
    ctx.fillStyle = "#23253a";
    ctx.fillRect(-12, -23, 4, 12);
    ctx.fillRect(8, -23, 4, 12);
    ctx.fillStyle = accent;
    ctx.fillRect(-4, -18, 8, 2);
    ctx.fillRect(-2, -21, 4, 2);
    ctx.fillStyle = "#101426";
    ctx.fillRect(-6, -25, 4, 3);
    ctx.fillRect(2, -25, 4, 3);
    ctx.fillStyle = accent;
    ctx.fillRect(-5, -24, 2, 1);
    ctx.fillRect(3, -24, 2, 1);
  } else if (kind === "ant") {
    const step = Math.sin(time * 0.012);
    // pernas finas, duas de cada lado, uma para a frente
    ctx.fillStyle = "#151020";
    for (const lx of [-8, -4, 3, 7]) ctx.fillRect(lx, -9, 2, 8);
    ctx.fillRect(-10 + step, -1, 3, 2);
    ctx.fillRect(8 - step, -1, 3, 2);
    // abdômen, cintura fina, tórax
    ctx.fillStyle = accent;
    ctx.fillRect(-12, -15, 9, 9);
    ctx.fillRect(-4, -13, 3, 3);
    ctx.fillRect(0, -16, 8, 8);
    // cabeça grande, mandíbula para a frente
    ctx.fillStyle = "#2a1f30";
    ctx.fillRect(7, -18, 8, 9);
    ctx.fillRect(14, -13, 3, 2);
    ctx.fillStyle = "#101426";
    ctx.fillRect(11, -16, 3, 3);
    ctx.fillStyle = "#e6e1f5";
    ctx.fillRect(11, -16, 1, 1);
    // antenas
    ctx.fillStyle = "#151020";
    ctx.fillRect(13, -22, 2, 5);
    ctx.fillRect(15, -24, 3, 2);
  } else if (kind === "moth") {
    const flap = Math.sin(time * 0.01) * 3;
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.moveTo(0, -12); ctx.lineTo(-18, -20 - flap); ctx.lineTo(-12, -6); ctx.closePath(); ctx.fill();
    ctx.beginPath();
    ctx.moveTo(0, -12); ctx.lineTo(18, -20 + flap); ctx.lineTo(12, -6); ctx.closePath(); ctx.fill();
    ctx.fillStyle = "#2a2238";
    ctx.fillRect(-2, -18, 4, 16);
    ctx.fillStyle = "#e6e1f5";
    ctx.fillRect(-1, -21, 2, 3);
  } else if (kind === "beetle") {
    ctx.fillStyle = "#1a1420";
    for (const x of [-9, -5, 5, 9]) ctx.fillRect(x, -4, 2, 6);
    ctx.fillStyle = "#2a1f30";
    ctx.fillRect(-11, -16, 22, 14);
    ctx.fillStyle = accent;
    ctx.fillRect(-9, -18, 18, 10);
    ctx.fillStyle = "rgba(255,255,255,0.22)";
    ctx.fillRect(-6, -17, 4, 2);
    ctx.fillStyle = "#101426";
    ctx.fillRect(-4, -12, 8, 2);
    ctx.fillStyle = "#d9d0e8";
    ctx.fillRect(-1, -24, 2, 7);
    ctx.fillRect(-4, -25, 8, 2);
  } else if (kind === "crab") {
    ctx.fillStyle = accent;
    ctx.fillRect(-12, -14, 24, 12);
    ctx.fillRect(-16, -10, 4, 7);
    ctx.fillRect(12, -10, 4, 7);
    ctx.fillStyle = "#2a1f30";
    for (const x of [-9, -5, 5, 9]) ctx.fillRect(x, -2, 2, 5);
    ctx.fillStyle = "#101426";
    ctx.fillRect(-7, -12, 3, 3);
    ctx.fillRect(4, -12, 3, 3);
    ctx.fillStyle = "#e6e1f5";
    ctx.fillRect(-7, -12, 1, 1);
    ctx.fillRect(4, -12, 1, 1);
  } else if (kind === "jelly") {
    const bob2 = Math.sin(time * 0.004) * 2;
    ctx.globalAlpha = 0.75;
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(0, -16 + bob2, 12, Math.PI, 0);
    ctx.fill();
    ctx.globalAlpha = 0.5;
    for (let i = -8; i <= 8; i += 4) {
      ctx.fillRect(i + Math.sin(time * 0.004 + i) * 2, -8 + bob2, 1, 12);
    }
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#101426";
    ctx.fillRect(-4, -18 + bob2, 2, 2);
    ctx.fillRect(2, -18 + bob2, 2, 2);
  } else if (kind === "imp") {
    ctx.fillStyle = "#2a1f30";
    ctx.fillRect(-6, -18, 12, 12);
    ctx.fillRect(-5, -6, 4, 6);
    ctx.fillRect(1, -6, 4, 6);
    ctx.fillStyle = accent;
    ctx.fillRect(-7, -22, 14, 6);
    ctx.fillStyle = "#d9d0e8";
    ctx.fillRect(-6, -28, 3, 6);
    ctx.fillRect(3, -28, 3, 6);
    ctx.fillStyle = "#101426";
    ctx.fillRect(-4, -20, 3, 3);
    ctx.fillRect(1, -20, 3, 3);
    ctx.fillStyle = "#ff7aa8";
    ctx.fillRect(-1, -15, 2, 3);
  } else if (kind === "sentinel") {
    ctx.fillStyle = "#242040";
    ctx.fillRect(-10, -30, 20, 30);
    ctx.fillStyle = "#3a3560";
    ctx.fillRect(-7, -27, 14, 24);
    ctx.fillStyle = accent;
    ctx.fillRect(-4, -23, 8, 6);
    ctx.fillStyle = "#101426";
    ctx.fillRect(-2, -22, 4, 4);
    ctx.fillStyle = "#4a4466";
    ctx.fillRect(-12, -32, 24, 3);
    ctx.fillRect(-12, 0, 24, 3);
  } else if (kind === "serpent") {
    ctx.strokeStyle = accent;
    ctx.lineWidth = 5;
    ctx.beginPath();
    ctx.moveTo(-12, 0);
    ctx.bezierCurveTo(-16, -12, 6, -8, 4, -18);
    ctx.bezierCurveTo(2, -26, -8, -24, -6, -30);
    ctx.stroke();
    // cabeça com língua bífida
    ctx.fillStyle = accent;
    ctx.fillRect(-10, -34, 9, 7);
    ctx.fillStyle = "#101426";
    ctx.fillRect(-8, -32, 2, 2);
    ctx.fillStyle = "#ff7aa8";
    ctx.fillRect(-12, -31, 3, 2);
    ctx.fillRect(-15, -32, 3, 1);
    ctx.fillRect(-15, -30, 3, 1);
  } else {
    // chefe: golem grande com chifres
    ctx.fillStyle = "#21162b";
    ctx.fillRect(-12, -10, 8, 10);
    ctx.fillRect(4, -10, 8, 10);
    ctx.fillStyle = "#3a2440";
    ctx.fillRect(-16, -32, 32, 23);
    ctx.fillStyle = accent;
    ctx.fillRect(-12, -30, 24, 5);
    ctx.fillStyle = "#241a30";
    ctx.fillRect(-20, -30, 4, 16);
    ctx.fillRect(16, -30, 4, 16);
    // chifres
    ctx.fillStyle = "#ffc857";
    ctx.fillRect(-14, -38, 4, 6);
    ctx.fillRect(10, -38, 4, 6);
    ctx.fillRect(-18, -42, 4, 4);
    ctx.fillRect(14, -42, 4, 4);
    // olhos
    ctx.fillStyle = "#101426";
    ctx.fillRect(-9, -27, 7, 5);
    ctx.fillRect(2, -27, 7, 5);
    ctx.fillStyle = "#ff7aa8";
    ctx.fillRect(-8, -26, 4, 2);
    ctx.fillRect(3, -26, 4, 2);
    // runa no peito
    ctx.fillStyle = accent;
    ctx.fillRect(-4, -20, 8, 2);
    ctx.fillRect(-2, -23, 4, 8);
  }
  ctx.restore();
}

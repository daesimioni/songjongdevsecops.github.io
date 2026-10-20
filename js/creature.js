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

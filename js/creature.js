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

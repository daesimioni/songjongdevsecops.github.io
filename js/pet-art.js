// Desenho dos bichos companheiros, um por espécie. Usado na superfície, na
// caverna (trilha atrás do jogador) e na praça onde o bicho é domado.
// Cada bicho tem silhueta e cor próprias para o jogador reconhecer quem o
// acompanha sem abrir a ficha.
export const PET_COLORS = {
  cat: { body: "#6b5b73", light: "#8a7893", eye: "#ffc857" },
  owl: { body: "#8a6a45", light: "#b08a5c", eye: "#ffe9b0" },
  frog: { body: "#4e8a4a", light: "#6faf5f", eye: "#f7f0b0" },
  wisp: { body: "#c9a227", light: "#ffe9a0", eye: "#fff3c4" },
  cricket: { body: "#3f6b3a", light: "#5d8f4e", eye: "#ffe9b0" },
  shade: { body: "#3b2d55", light: "#57417c", eye: "#b48cff" },
  parrot: { body: "#4f9a4a", light: "#7ec96a", eye: "#ffe9b0" },
};

export function drawPetSprite(ctx, kind, x, y, t = 0, moving = false, dir = 0) {
  const colors = PET_COLORS[kind] || PET_COLORS.cat;
  const bob = moving ? Math.abs(Math.sin(t * 0.02)) * 1.2 : Math.sin(t * 0.002) * 0.5;
  ctx.save();
  ctx.translate(x, y);
  // o bicho vira junto com quem ele segue; o espelho é em volta do próprio
  // ponto de desenho, então a sombra e o corpo vão juntos
  if (dir === 1 || dir === 4 || dir === 6) ctx.scale(-1, 1);
  ctx.fillStyle = "rgba(2,4,10,0.3)";
  ctx.beginPath();
  ctx.ellipse(0, 0, kind === "frog" ? 7 : 5, 2, 0, 0, Math.PI * 2);
  ctx.fill();

  if (kind === "owl") {
    ctx.fillStyle = colors.body;
    ctx.fillRect(-5, -9 - bob, 10, 8);
    ctx.fillRect(-4, -12 - bob, 8, 4);
    ctx.fillStyle = colors.light;
    ctx.fillRect(-4, -8 - bob, 8, 3);
    ctx.fillStyle = colors.eye;
    ctx.fillRect(-3, -11 - bob, 2, 2);
    ctx.fillRect(1, -11 - bob, 2, 2);
    ctx.fillStyle = "#e8b04a";
    ctx.fillRect(-1, -8 - bob, 2, 1);
    ctx.fillStyle = colors.body;
    ctx.fillRect(-7, -8 - bob, 2, 5);
    ctx.fillRect(5, -8 - bob, 2, 5);
  } else if (kind === "frog") {
    ctx.fillStyle = colors.body;
    ctx.fillRect(-7, -6 - bob, 14, 5);
    ctx.fillRect(-5, -9 - bob, 10, 4);
    ctx.fillStyle = colors.light;
    ctx.fillRect(-4, -5 - bob, 8, 2);
    ctx.fillStyle = colors.eye;
    ctx.fillRect(-4, -10 - bob, 2, 2);
    ctx.fillRect(2, -10 - bob, 2, 2);
    ctx.fillStyle = colors.body;
    ctx.fillRect(-4, -11 - bob, 2, 1);
    ctx.fillRect(2, -11 - bob, 2, 1);
    ctx.fillStyle = "#2c4a2c";
    ctx.fillRect(-2, -4 - bob, 4, 1);
  } else if (kind === "wisp") {
    const float = Math.sin(t * 0.004) * 1.5;
    ctx.fillStyle = colors.body;
    ctx.beginPath();
    ctx.arc(0, -8 + float, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = colors.light;
    ctx.beginPath();
    ctx.arc(0, -8 + float, 2.4, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 0.35;
    ctx.beginPath();
    ctx.arc(0, -8 + float, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = colors.body;
    ctx.fillRect(-5, -10 + float, 2, 2);
    ctx.fillRect(3, -10 + float, 2, 2);
  } else if (kind === "cricket") {
    ctx.fillStyle = colors.body;
    ctx.fillRect(-4, -5 - bob, 8, 4);
    ctx.fillRect(-3, -7 - bob, 6, 3);
    ctx.fillStyle = colors.light;
    ctx.fillRect(-2, -4 - bob, 4, 1);
    ctx.fillStyle = colors.eye;
    ctx.fillRect(-2, -7 - bob, 1, 1);
    ctx.fillRect(1, -7 - bob, 1, 1);
    ctx.strokeStyle = colors.body;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.moveTo(-2, -7 - bob);
    ctx.lineTo(-4, -10 - bob);
    ctx.moveTo(2, -7 - bob);
    ctx.lineTo(4, -10 - bob);
    ctx.stroke();
  } else if (kind === "parrot") {
    ctx.fillStyle = colors.body;
    ctx.fillRect(-4, -6 - bob, 8, 5);
    ctx.fillRect(-3, -9 - bob, 6, 4);
    ctx.fillStyle = colors.light;
    ctx.fillRect(-2, -5 - bob, 4, 2);
    ctx.fillStyle = "#d94f3d";
    ctx.fillRect(-3, -10 - bob, 2, 2);
    ctx.fillRect(-2, -11 - bob, 3, 1);
    ctx.fillStyle = colors.eye;
    ctx.fillRect(0, -8 - bob, 2, 2);
    ctx.fillStyle = "#1a1a1a";
    ctx.fillRect(1, -8 - bob, 1, 1);
    ctx.fillStyle = "#e8b84a";
    ctx.fillRect(2, -6 - bob, 2, 2);
    ctx.fillStyle = colors.body;
    ctx.fillRect(-6, -5 - bob, 2, 4);
  } else if (kind === "shade") {
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = colors.body;
    ctx.beginPath();
    ctx.ellipse(0, -7 - bob, 5.5, 7, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.fillStyle = colors.light;
    ctx.fillRect(-3, -9 - bob, 6, 2);
    ctx.fillStyle = colors.eye;
    ctx.fillRect(-2, -8 - bob, 1, 1);
    ctx.fillRect(1, -8 - bob, 1, 1);
    ctx.globalAlpha = 0.55;
    ctx.fillStyle = colors.body;
    ctx.fillRect(-2, -1, 1, 2);
    ctx.fillRect(1, -1, 1, 2);
    ctx.globalAlpha = 1;
  } else {
    // gato
    ctx.fillStyle = colors.body;
    ctx.fillRect(-5, -6 - bob, 10, 5);
    ctx.fillRect(-4, -9 - bob, 7, 4);
    ctx.fillStyle = colors.light;
    ctx.fillRect(-4, -9 - bob, 2, 2);
    ctx.fillStyle = colors.body;
    ctx.fillRect(-4, -11 - bob, 2, 2);
    ctx.fillRect(1, -11 - bob, 2, 2);
    ctx.fillStyle = colors.eye;
    ctx.fillRect(-2, -8 - bob, 1, 1);
    ctx.fillRect(1, -8 - bob, 1, 1);
    ctx.strokeStyle = colors.body;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(5, -4 - bob);
    ctx.quadraticCurveTo(9, -6 - bob, 8, -10 - bob);
    ctx.stroke();
  }
  ctx.restore();
}

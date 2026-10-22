import { spritePose } from "./sprite-cache.js";
import { artTime, artTick } from "./art-style.js";
import { creatureDetail } from "./creature-detail.js";
// Bichos das caçadas desenhados na unha, em blocos, para o mapa e para a
// janela de duelo usarem o mesmo desenho.
// ruído 1D determinístico: a respiração do bicho não é um seno de período fixo
function ruido(t) {
  const i = Math.floor(t);
  const f = t - i;
  const h = (n) => {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  };
  const a = h(i);
  const b = h(i + 1);
  const u = f * f * (3 - 2 * f);
  return a + (b - a) * u;
}

function sementeDe(txt) {
  let h = 0;
  for (let i = 0; i < txt.length; i++) h = (h * 31 + txt.charCodeAt(i)) >>> 0;
  return h % 97;
}

// Vista de costas: cobre o rosto com a cor do corpo e marca a espinha. O
// retângulo é por espécie porque cada uma tem a cara num lugar; sem isso as
// costas eram a frente de novo.
export const COSTAS = {
  slime: [-8, -15, 16, 7, "accent"],
  eye: [-9, -15, 18, 10, "#101426"],
  bat: [-5, -12, 10, 5, "accent"],
  spider: [-5, -10, 10, 5, "accent"],
  wisp: [-5, -17, 10, 5, "accent"],
  scorpion: [-3, -9, 7, 4, "accent"],
  golem: [-8, -26, 16, 6, "#555a7c"],
  ant: [7, -18, 9, 9, "#2a1f30"],
  moth: [-2, -22, 5, 5, "#2a2238"],
  beetle: [-5, -13, 10, 4, "accent"],
  crab: [-12, -14, 24, 8, "accent"],
  jelly: [-5, -20, 10, 5, "accent"],
  imp: [-5, -21, 10, 5, "#2a1f30"],
  sentinel: [-7, -27, 14, 23, "#3a3560"],
  serpent: [-11, -34, 11, 8, "accent"],
  tome: [-13, -22, 26, 17, "accent"],
  glyph: [-6, -14, 13, 7, "accent"],
  note: [-7, -9, 10, 5, "accent"],
  atom: [-6, -21, 12, 6, "accent"],
  crystal: [-6, -24, 12, 8, "accent"],
  gear: [-7, -25, 14, 7, "accent"],
  node: [-6, -20, 12, 6, "accent"],
  prism: [-6, -20, 12, 6, "accent"],
  vector: [-6, -20, 12, 6, "accent"],
  flask: [-5, -19, 10, 6, "accent"],
  boss: [-10, -28, 20, 8, "accent"],
};

export function drawCreature(ctx, kind, accent, time = 0, scale = 1, dir = 0, semSombra = false) {
  time = artTime(time);
  const boss = kind === "boss";
  const s = sementeDe(String(kind));
  const bob = (ruido(time * 0.0011 + s) - 0.5) * (boss ? 3.2 : 2.2);
  // oito direções: espelha para a esquerda e inclina um pixel na diagonal
  const vira = dir === 1 || dir === 4 || dir === 6 ? -1 : 1;
  const deLado = dir === 1 || dir === 2 || dir >= 4;
  ctx.save();
  ctx.scale(scale * (deLado ? vira : 1), scale);
  ctx.translate(0, bob);
  // Massa elástica nos gelatinosos; membros conservam o próprio passo.
  if(['slime','jelly','wisp'].includes(kind)){
    const breath=Math.sin(time*.005+s)*.035;ctx.scale(1+breath,1-breath);
  }

  // sombra (fora do sprite: o contorno não copia a sombra do chão)
  if (!semSombra) {
    ctx.fillStyle = "rgba(2, 4, 10, 0.32)";
    ctx.beginPath();
    ctx.ellipse(0, 0, boss ? 22 : 13, boss ? 5 : 3.4, 0, 0, Math.PI * 2);
    ctx.fill();
  }

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
    // o olho pisca de vez em quando: a pálpebra desce e a íris some
    const pisca = Math.sin(time * 0.0017 + s * 1.7) > 0.985;
    if (pisca) {
      ctx.fillStyle = "#101426";
      ctx.fillRect(-9, -15, 18, 5);
      ctx.fillStyle = "#e9e3ff";
      ctx.fillRect(-9, -10, 18, 2);
    } else {
      ctx.fillStyle = accent;
      ctx.fillRect(-5, -13, 10, 7);
      ctx.fillStyle = "#101426";
      ctx.fillRect(-2, -11, 4, 4);
      ctx.fillStyle = "#fff";
      ctx.fillRect(-1, -11, 1, 1);
    }
    ctx.fillStyle = "#101426";
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
    ]) ctx.fillRect(x, y + Math.sin(time*.009+x)*.65, w, h);
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
  } else if (kind === "tome") {
    // livro aberto, com marcador e olhos nas páginas
    ctx.fillStyle = "#101426";
    ctx.fillRect(-13, -22, 26, 17);
    ctx.fillStyle = accent;
    ctx.fillRect(-12, -21, 24, 15);
    ctx.fillStyle = "#f4f0ff";
    ctx.fillRect(-10, -19, 8, 10);
    ctx.fillRect(2, -19, 8, 10);
    ctx.fillStyle = "#101426";
    ctx.fillRect(-8, -16, 2, 3);
    ctx.fillRect(3, -16, 2, 3);
    ctx.fillStyle = "#fff";
    ctx.fillRect(-8, -16, 1, 1);
    ctx.fillRect(3, -16, 1, 1);
    ctx.fillStyle = "#ffc857";
    ctx.fillRect(-2, -24, 4, 6);
    ctx.fillStyle = "#101426";
    ctx.fillRect(-10, -6, 4, 3);
    ctx.fillRect(5, -6, 4, 3);
  } else if (kind === "glyph") {
    // símbolo flutuante com aura
    ctx.fillStyle = "rgba(255,255,255,0.06)";
    ctx.beginPath();
    ctx.ellipse(0, -18, 14, 12, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#101426";
    ctx.fillRect(-9, -30, 4, 22);
    ctx.fillRect(5, -30, 4, 22);
    ctx.fillRect(-9, -22, 18, 4);
    ctx.fillRect(-5, -14, 4, 4);
    ctx.fillStyle = accent;
    ctx.fillRect(-7, -28, 2, 18);
    ctx.fillRect(7, -28, 2, 18);
    ctx.fillRect(-7, -20, 14, 2);
    ctx.fillStyle = "#101426";
    ctx.fillRect(-4, -12, 3, 3);
    ctx.fillRect(1, -12, 3, 3);
    ctx.fillStyle = "#fff";
    ctx.fillRect(-4, -12, 1, 1);
    ctx.fillRect(1, -12, 1, 1);
  } else if (kind === "note") {
    // nota musical com haste e bandeirola
    ctx.fillStyle = "#101426";
    ctx.beginPath();
    ctx.ellipse(-4, -6, 8, 5, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(2, -32, 4, 26);
    ctx.fillRect(5, -32, 9, 3);
    ctx.fillRect(11, -29, 3, 7);
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.ellipse(-4, -6, 6, 3.4, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillRect(4, -30, 2, 23);
    ctx.fillRect(6, -30, 6, 2);
    ctx.fillStyle = "#101426";
    ctx.fillRect(-6, -8, 2, 2);
    ctx.fillRect(-1, -8, 2, 2);
    ctx.fillStyle = "#fff";
    ctx.fillRect(-6, -8, 1, 1);
    ctx.fillRect(-1, -8, 1, 1);
  } else if (kind === "atom") {
    // núcleo com órbitas e elétrons
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.ellipse(0, -18, 15, 6, 0.55, 0, Math.PI * 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.ellipse(0, -18, 15, 6, -0.55, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = "#fff";
    ctx.fillRect(-13, -24, 2, 2);
    ctx.fillRect(11, -12, 2, 2);
    ctx.fillStyle = "#101426";
    ctx.beginPath();
    ctx.arc(0, -18, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(0, -18, 5.5, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#101426";
    ctx.fillRect(-4, -20, 3, 3);
    ctx.fillRect(1, -20, 3, 3);
    ctx.fillStyle = "#fff";
    ctx.fillRect(-4, -20, 1, 1);
    ctx.fillRect(1, -20, 1, 1);
  } else if (kind === "crystal") {
    // cristal facetado, com estilhaços
    ctx.fillStyle = "#101426";
    ctx.beginPath();
    ctx.moveTo(0, -36);
    ctx.lineTo(11, -20);
    ctx.lineTo(7, -6);
    ctx.lineTo(-4, -3);
    ctx.lineTo(-12, -18);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.moveTo(0, -33);
    ctx.lineTo(8, -20);
    ctx.lineTo(5, -9);
    ctx.lineTo(-3, -6);
    ctx.lineTo(-9, -18);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.3)";
    ctx.beginPath();
    ctx.moveTo(0, -33);
    ctx.lineTo(8, -20);
    ctx.lineTo(0, -18);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#101426";
    ctx.fillRect(-4, -22, 3, 4);
    ctx.fillRect(1, -22, 3, 4);
    ctx.fillStyle = "#fff";
    ctx.fillRect(-4, -22, 1, 1);
    ctx.fillRect(1, -22, 1, 1);
    ctx.fillStyle = accent;
    ctx.fillRect(-15, -10, 3, 7);
    ctx.fillRect(12, -12, 3, 9);
  } else if (kind === "gear") {
    // engrenagem com dentes
    ctx.fillStyle = "#101426";
    for (let i = 0; i < 8; i++) {
      const a = (i * Math.PI) / 4;
      ctx.fillRect(Math.round(Math.cos(a) * 11) - 2, Math.round(-18 + Math.sin(a) * 11) - 2, 4, 4);
    }
    ctx.beginPath();
    ctx.arc(0, -18, 11, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(0, -18, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#101426";
    ctx.beginPath();
    ctx.arc(0, -18, 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#fff";
    ctx.fillRect(-6, -23, 2, 2);
    ctx.fillRect(4, -23, 2, 2);
  } else if (kind === "node") {
    // nó central ligado à rede
    const nos = [[-14, -8], [13, -7], [-10, -31], [11, -30]];
    ctx.strokeStyle = accent;
    ctx.lineWidth = 1.5;
    for (const [x, y] of nos) {
      ctx.beginPath();
      ctx.moveTo(0, -18);
      ctx.lineTo(x, y);
      ctx.stroke();
    }
    for (const [x, y] of nos) {
      ctx.fillStyle = accent;
      ctx.beginPath();
      ctx.arc(x, y, 3, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.fillStyle = "#101426";
    ctx.beginPath();
    ctx.arc(0, -18, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.arc(0, -18, 7, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#101426";
    ctx.fillRect(-4, -20, 3, 3);
    ctx.fillRect(1, -20, 3, 3);
    ctx.fillStyle = "#fff";
    ctx.fillRect(-4, -20, 1, 1);
    ctx.fillRect(1, -20, 1, 1);
  } else if (kind === "prism") {
    // prisma com feixe de luz
    ctx.fillStyle = "#101426";
    ctx.beginPath();
    ctx.moveTo(0, -36);
    ctx.lineTo(14, -6);
    ctx.lineTo(-14, -6);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.moveTo(0, -32);
    ctx.lineTo(10, -8);
    ctx.lineTo(-10, -8);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#fff3d1";
    ctx.fillRect(8, -22, 14, 2);
    ctx.fillRect(10, -17, 12, 2);
    ctx.fillRect(12, -12, 10, 2);
    ctx.fillStyle = "#101426";
    ctx.fillRect(-4, -16, 3, 3);
    ctx.fillRect(1, -16, 3, 3);
    ctx.fillStyle = "#fff";
    ctx.fillRect(-4, -16, 1, 1);
    ctx.fillRect(1, -16, 1, 1);
  } else if (kind === "vector") {
    // seta viva, apontando para a direção
    ctx.strokeStyle = "#101426";
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(-12, -6);
    ctx.lineTo(6, -26);
    ctx.stroke();
    ctx.strokeStyle = accent;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(-12, -6);
    ctx.lineTo(6, -26);
    ctx.stroke();
    ctx.fillStyle = "#101426";
    ctx.beginPath();
    ctx.moveTo(10, -33);
    ctx.lineTo(1, -22);
    ctx.lineTo(14, -22);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = accent;
    ctx.beginPath();
    ctx.moveTo(9, -31);
    ctx.lineTo(3, -23);
    ctx.lineTo(12, -23);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#101426";
    ctx.fillRect(-10, -9, 3, 3);
    ctx.fillRect(-5, -11, 3, 3);
    ctx.fillStyle = "#fff";
    ctx.fillRect(-10, -9, 1, 1);
    ctx.fillRect(-5, -11, 1, 1);
  } else if (kind === "flask") {
    // frasco com reagente e bolhas
    ctx.fillStyle = "#101426";
    ctx.fillRect(-4, -30, 8, 6);
    ctx.fillRect(-9, -24, 18, 18);
    ctx.fillStyle = "#dff5ff";
    ctx.fillRect(-6, -24, 12, 3);
    ctx.fillStyle = accent;
    ctx.fillRect(-7, -16, 14, 9);
    ctx.fillStyle = "#dff5ff";
    ctx.fillRect(-9, -24, 2, 18);
    ctx.fillStyle = "#ffc857";
    ctx.fillRect(-3, -33, 6, 3);
    ctx.fillStyle = "#fff";
    ctx.fillRect(-4, -19, 2, 2);
    ctx.fillRect(2, -13, 2, 2);
    ctx.fillStyle = "#101426";
    ctx.fillRect(-4, -10, 3, 3);
    ctx.fillRect(1, -10, 3, 3);
    ctx.fillStyle = "#fff";
    ctx.fillRect(-4, -10, 1, 1);
    ctx.fillRect(1, -10, 1, 1);
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
  creatureDetail(ctx, kind, accent, time);
  if (dir === 3) {
    const m = COSTAS[kind] || COSTAS.boss;
    ctx.fillStyle = m[4] === "accent" ? accent : m[4];
    ctx.fillRect(m[0], m[1], m[2], m[3]);
    // espinha e cauda: de costas o bicho tem eixo, não rosto
    ctx.fillStyle = "rgba(0,0,0,0.28)";
    ctx.fillRect(Math.round(m[0] + m[2] / 2) - 1, m[1] + 1, 2, m[3] + 6);
    ctx.fillStyle = accent;
    ctx.fillRect(Math.round(m[0] + m[2] / 2) - 1, m[1] + m[3] + 1, 2, 2);
  }
  ctx.restore();
}

// ---------------------------------------------------------------------------
// O mesmo bicho com acabamento: sombra no chão, contorno escuro de um pixel e
// um gradiente de luz em cima do corpo. O desenho de cada espécie continua
// igual; o carinho é o que envolve ele, e vale para as 26 formas de uma vez.
export function drawCreatureArt(ctx, kind, accent, time = 0, scale = 1, dir = 0) {
  if (typeof document === "undefined") { drawCreature(ctx,kind,accent,time,scale,dir); return; }
  const S = 112, OX = 56, OY = 92;
  const tick=artTick(time,90), poseTime=tick*90;
  const sprite=spritePose(`creature:${kind}:${accent}:${dir}:${tick}`,S,S,a=>{
    a.translate(OX,OY);drawCreature(a,kind,accent,poseTime,1,dir,true);
  },'stone');
  ctx.save();ctx.fillStyle='rgba(2,4,10,0.32)';ctx.beginPath();
  ctx.ellipse(0,0,(kind==='boss'?22:13)*scale,(kind==='boss'?5:3.4)*scale,0,0,Math.PI*2);ctx.fill();
  ctx.imageSmoothingEnabled=false;ctx.scale(scale,scale);ctx.drawImage(sprite,-OX,-OY);ctx.restore();
}

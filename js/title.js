// A tela de título: um vale em pixel art desenhado no canvas, com céu em
// degradê, estrelas, lua, montanhas, rio e vagalumes. É a primeira impressão do
// jogo, então tudo é desenhado devagar e sem imagem pesada.

const LARGURA = 320;
const ALTURA = 180;

const aleatorio = (n) => {
  let x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

export function startTitle(canvas) {
  if (!canvas) return () => {};
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};
  canvas.width = LARGURA;
  canvas.height = ALTURA;
  ctx.imageSmoothingEnabled = false;

  const estrelas = Array.from({ length: 90 }, (_, i) => ({
    x: Math.floor(aleatorio(i + 1) * LARGURA),
    y: Math.floor(aleatorio(i + 41) * 92),
    r: aleatorio(i + 7) > 0.86 ? 2 : 1,
    fase: aleatorio(i + 13) * 6.28,
  }));
  const vagalumes = Array.from({ length: 26 }, (_, i) => ({
    x: 18 + aleatorio(i + 90) * (LARGURA - 36),
    y: 132 + aleatorio(i + 120) * 34,
    fase: aleatorio(i + 150) * 6.28,
    vel: 0.4 + aleatorio(i + 180) * 0.8,
  }));

  function montanha(baseY, altura, cor, deslocamento) {
    ctx.fillStyle = cor;
    ctx.beginPath();
    ctx.moveTo(0, ALTURA);
    for (let x = 0; x <= LARGURA; x += 4) {
      const n = Math.sin((x + deslocamento) * 0.021) * 0.5 + Math.sin((x + deslocamento) * 0.047) * 0.3;
      const pico = baseY - altura * (0.55 + n * 0.45);
      ctx.lineTo(x, pico);
    }
    ctx.lineTo(LARGURA, ALTURA);
    ctx.closePath();
    ctx.fill();
  }

  function desenhar(t) {
    const ceu = ctx.createLinearGradient(0, 0, 0, ALTURA);
    ceu.addColorStop(0, "#070a1c");
    ceu.addColorStop(0.45, "#1a1740");
    ceu.addColorStop(0.72, "#4a2a55");
    ceu.addColorStop(1, "#1a2038");
    ctx.fillStyle = ceu;
    ctx.fillRect(0, 0, LARGURA, ALTURA);

    // estrelas
    for (const e of estrelas) {
      const brilho = 0.35 + Math.sin(t * 0.0018 + e.fase) * 0.35;
      ctx.fillStyle = `rgba(255, 245, 214, ${brilho.toFixed(3)})`;
      ctx.fillRect(e.x, e.y, e.r, e.r);
    }

    // aurora
    for (let banda = 0; banda < 3; banda++) {
      ctx.beginPath();
      for (let x = 0; x <= LARGURA; x += 6) {
        const y = 44 + banda * 9 + Math.sin(x * 0.028 + t * 0.00024 + banda) * 7;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = ["rgba(97,244,192,0.10)", "rgba(180,140,255,0.10)", "rgba(107,213,255,0.08)"][banda];
      ctx.lineWidth = 4;
      ctx.stroke();
    }

    // lua
    ctx.fillStyle = "rgba(255,236,180,0.10)";
    ctx.beginPath();
    ctx.arc(252, 38, 24, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffe9ad";
    ctx.beginPath();
    ctx.arc(252, 38, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#d8bd7a";
    ctx.fillRect(248, 32, 3, 2);
    ctx.fillRect(256, 40, 2, 2);
    ctx.fillRect(250, 43, 2, 1);

    // montanhas em camadas
    montanha(118, 46, "#171a3c", 0);
    montanha(132, 38, "#101430", 33);
    montanha(146, 28, "#080b1c", 70);

    // vale e rio
    ctx.fillStyle = "#0b1224";
    ctx.fillRect(0, 146, LARGURA, ALTURA - 146);
    ctx.fillStyle = "#101a30";
    for (let x = 0; x < LARGURA; x += 8) {
      ctx.fillRect(x, 146 + Math.floor(aleatorio(x) * 2), 8, 1);
    }
    ctx.fillStyle = "#143b58";
    ctx.beginPath();
    ctx.moveTo(148, 146);
    ctx.lineTo(168, 146);
    ctx.lineTo(196, ALTURA);
    ctx.lineTo(118, ALTURA);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(140,230,255,0.24)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 7; i++) {
      const y = 150 + i * 5;
      const meia = 9 + i * 4;
      ctx.beginPath();
      ctx.moveTo(158 - meia, y);
      ctx.lineTo(158 + meia, y);
      ctx.stroke();
    }

    // casinhas acesas no vale
    for (const [x, y] of [[86, 152], [104, 156], [212, 151], [232, 157]]) {
      ctx.fillStyle = "#1c1630";
      ctx.fillRect(x - 4, y - 4, 8, 5);
      ctx.fillStyle = "#ffc857";
      ctx.fillRect(x - 2, y - 3, 2, 2);
      ctx.fillStyle = "#0a0d1c";
      ctx.fillRect(x - 5, y - 5, 10, 1);
    }

    // árvores silhueta
    for (let i = 0; i < 18; i++) {
      const x = Math.floor(aleatorio(i + 300) * LARGURA);
      const h = 5 + Math.floor(aleatorio(i + 400) * 9);
      if (x > 118 && x < 200) continue;
      ctx.fillStyle = "#060912";
      ctx.fillRect(x, 146 - h, 2, h);
      ctx.fillRect(x - 3, 146 - h, 8, 3);
      ctx.fillRect(x - 2, 146 - h + 3, 5, 2);
    }

    // vagalumes
    for (const v of vagalumes) {
      const x = v.x + Math.sin(t * 0.0008 * v.vel + v.fase) * 10;
      const y = v.y + Math.cos(t * 0.0011 * v.vel + v.fase) * 5;
      const pisca = 0.35 + Math.sin(t * 0.003 + v.fase) * 0.35;
      ctx.fillStyle = `rgba(255, 224, 130, ${Math.max(0, pisca).toFixed(3)})`;
      ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
      ctx.fillStyle = `rgba(255, 224, 130, ${Math.max(0, pisca * 0.18).toFixed(3)})`;
      ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 3, 3);
    }

    // névoa baixa
    for (let i = 0; i < 3; i++) {
      const y = 150 + i * 8 + Math.sin(t * 0.0004 + i) * 2;
      ctx.fillStyle = `rgba(160, 200, 255, ${0.035 - i * 0.008})`;
      ctx.fillRect(0, y, LARGURA, 3);
    }
  }

  let vivo = true;
  let anterior = 0;
  const reduzir = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  function laco(now) {
    if (!vivo) return;
    if (!reduzir || !anterior) desenhar(now);
    anterior = now;
    requestAnimationFrame(laco);
  }
  desenhar(performance.now());
  requestAnimationFrame(laco);
  return () => { vivo = false; };
}

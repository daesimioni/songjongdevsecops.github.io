import {desenharAsset} from "../rendering/assets/index.js";
import {drawPetSprite} from "../rendering/pet-art.js";
// A tela de título: um vale em pixel art desenhado no canvas, com céu em
// degradê, estrelas, aurora, lua, montanhas, rio, casas e árvores de verdade.
// No centro do vale, um grimório aberto sobre um púlpito de pedra, dentro de um
// círculo de runas, soltando magia: feixes de luz, brasas subindo e sinais
// girando devagar. Tudo desenhado, nada de imagem pesada.

const LARGURA = 320;
const ALTURA = 180;

const aleatorio = (n) => {
  let x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

// sinais de 3x5 px, desenhados um a um: não são glifos de fonte, são pixels
const RUNAS = [
  ["110", "101", "110", "101", "110"],
  ["010", "111", "010", "010", "111"],
  ["101", "101", "111", "010", "010"],
  ["110", "001", "010", "100", "011"],
  ["101", "111", "111", "101", "101"],
  ["001", "010", "100", "010", "001"],
];

export function startTitle(canvas) {
  if (!canvas) return () => {};
  const ctx = canvas.getContext("2d");
  if (!ctx) return () => {};
  canvas.width = LARGURA;
  canvas.height = ALTURA;
  ctx.imageSmoothingEnabled = false;

  const estrelas = Array.from({ length: 70 }, (_, i) => ({
    x: Math.floor(aleatorio(i + 1) * LARGURA),
    y: Math.floor(aleatorio(i + 41) * 96),
    r: aleatorio(i + 7) > 0.86 ? 2 : 1,
    fase: aleatorio(i + 13) * 6.28,
  }));
  const vagalumes = Array.from({ length: 16 }, (_, i) => ({
    x: 18 + aleatorio(i + 90) * (LARGURA - 36),
    y: 130 + aleatorio(i + 120) * 36,
    fase: aleatorio(i + 150) * 6.28,
    vel: 0.4 + aleatorio(i + 180) * 0.8,
  }));
  // brasas que sobem do livro: cada uma com altura, raio e velocidade próprios
  const brasas = Array.from({ length: 16 }, (_, i) => ({
    raio: 6 + aleatorio(i + 210) * 30,
    altura: aleatorio(i + 240),
    vel: 0.22 + aleatorio(i + 270) * 0.5,
    fase: aleatorio(i + 300) * 6.28,
    brilho: 0.5 + aleatorio(i + 330) * 0.5,
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

  // árvore de copa orgânica: tronco com raiz, dois galhos e três camadas de
  // copa feitas de faixas de 1 px, então o contorno arredonda de verdade
  function arvore(x, y, h, cor, semente = 0) {
    const tronco = Math.max(2, Math.round(h * 0.14));
    ctx.fillStyle = cor;
    ctx.fillRect(x, y - h, tronco, h);
    ctx.fillRect(x - 1, y - 2, tronco + 2, 2);
    ctx.fillRect(x - 2, y - 1, 1, 1);
    ctx.fillRect(x + tronco + 1, y - 1, 1, 1);
    // galhos
    const meio = y - Math.round(h * 0.6);
    ctx.fillRect(x - 3, meio, 3, 1);
    ctx.fillRect(x - 4, meio - 2, 1, 2);
    ctx.fillRect(x + tronco, meio - 1, 3, 1);
    ctx.fillRect(x + tronco + 2, meio - 3, 1, 2);
    // copa em três camadas
    const camadas = [
      { larg: Math.round(h * 0.62), alt: Math.round(h * 0.4), topo: y - h - Math.round(h * 0.16) },
      { larg: Math.round(h * 0.46), alt: Math.round(h * 0.3), topo: y - h - Math.round(h * 0.1) },
      { larg: Math.round(h * 0.3), alt: Math.round(h * 0.2), topo: y - h - Math.round(h * 0.02) },
    ];
    camadas.forEach((cam, ci) => {
      for (let row = 0; row < cam.alt; row++) {
        const t = (row - cam.alt / 2) / (cam.alt / 2);
        let meia = Math.sqrt(Math.max(0, 1 - t * t)) * (cam.larg / 2);
        if (aleatorio(semente + ci * 7 + row * 3) > 0.78) meia -= 1;
        const lx = Math.round(x + tronco / 2 - meia);
        const rx = Math.round(x + tronco / 2 + meia);
        if (rx <= lx) continue;
        ctx.fillRect(lx, cam.topo + row, rx - lx, 1);
      }
    });
  }

  // pinheiro: quatro triângulos empilhados, cada um mais estreito
  function pinheiro(x, y, h, cor) {
    ctx.fillStyle = cor;
    ctx.fillRect(x, y - Math.round(h * 0.2), 2, Math.round(h * 0.2));
    for (let i = 0; i < 4; i++) {
      const topo = y - h + Math.round((i * h) / 5);
      const larg = Math.round((h * 0.34) * (1 - i * 0.18));
      const alt = Math.round(h / 4.2);
      for (let row = 0; row < alt; row++) {
        const meia = Math.round((larg / 2) * (row / alt));
        ctx.fillRect(x + 1 - meia, topo + row, meia * 2 + 1, 1);
      }
    }
  }

  function casa(x, y, luz) {
    ctx.fillStyle = "#1a1530";
    ctx.fillRect(x - 4, y - 4, 8, 5);
    ctx.fillStyle = "#0b0d1c";
    ctx.fillRect(x - 5, y - 6, 10, 2);
    ctx.fillRect(x - 3, y - 7, 6, 1);
    ctx.fillStyle = luz;
    ctx.fillRect(x - 2, y - 3, 2, 2);
    ctx.fillStyle = "#0a0d1c";
    ctx.fillRect(x + 2, y - 7, 1, 3);
  }

  // desenha um sinal de 3x5 px na posição pedida
  function runa(indice, x, y, cor, escala = 1) {
    const mapa = RUNAS[indice % RUNAS.length];
    ctx.fillStyle = cor;
    for (let row = 0; row < mapa.length; row++) {
      for (let col = 0; col < 3; col++) {
        if (mapa[row][col] === "1") ctx.fillRect(x + col * escala, y + row * escala, escala, escala);
      }
    }
  }

  // o círculo no chão, em perspectiva, girando devagar
  function circuloDeRunas(cx, cy, t) {
    const rx = 43;
    const ry = 8;
    const giro = t * 0.00016;
    // anel externo e interno
    ctx.strokeStyle = "rgba(180, 140, 255, 0.55)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = "rgba(97, 244, 192, 0.32)";
    ctx.beginPath();
    ctx.ellipse(cx, cy, rx - 5, ry - 2, 0, 0, Math.PI * 2);
    ctx.stroke();
    // doze marcas com sinais em volta, girando
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2 + giro;
      const px = cx + Math.cos(a) * rx;
      const py = cy + Math.sin(a) * ry;
      const brilho = 0.35 + Math.sin(t * 0.002 + i) * 0.28;
      ctx.fillStyle = `rgba(255, 240, 200, ${brilho.toFixed(3)})`;
      ctx.fillRect(Math.round(px), Math.round(py), 1, 1);
      const px2 = cx + Math.cos(a) * (rx - 9);
      const py2 = cy + Math.sin(a) * (ry - 3);
      runa(i, Math.round(px2) - 1, Math.round(py2) - 2, `rgba(206, 184, 255, ${(brilho + 0.18).toFixed(3)})`);
    }
    // o anel fica limpo: oito runas legíveis e nada desenhado por cima.
  }

  // o púlpito de pedra e o grimório aberto em cima
  function grimorio(cx, cy, t) {
    const pulso = 0.5 + Math.sin(t * 0.0026) * 0.5;

    // luz de fundo atrás do livro
    const halo = ctx.createRadialGradient(cx, cy - 22, 2, cx, cy - 22, 54);
    halo.addColorStop(0, `rgba(255, 224, 150, ${0.24 + pulso * 0.1})`);
    halo.addColorStop(0.45, "rgba(180, 140, 255, 0.10)");
    halo.addColorStop(1, "rgba(180, 140, 255, 0)");
    ctx.fillStyle = halo;
    ctx.fillRect(cx - 60, cy - 80, 120, 100);

    // feixes de luz saindo das páginas
    for (let i = 0; i < 3; i++) {
      const balanco = Math.sin(t * 0.0013 + i * 1.7) * 3;
      const topo = cy - 62 - i * 8;
      ctx.beginPath();
      ctx.moveTo(cx - 8 + i * 2, cy - 30);
      ctx.lineTo(cx + 8 - i * 2, cy - 30);
      ctx.lineTo(cx + 18 + balanco + i * 5, topo);
      ctx.lineTo(cx - 16 + balanco - i * 5, topo);
      ctx.closePath();
      ctx.fillStyle = `rgba(255, 236, 170, ${0.05 - i * 0.012})`;
      ctx.fill();
    }

    // pedestal de pedra: largo e baixo, com topo inclinado para o livro
    ctx.fillStyle = "#171a2c";
    ctx.beginPath();
    ctx.ellipse(cx, cy, 18, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#20233a";
    ctx.fillRect(cx - 18, cy - 4, 36, 4);
    ctx.fillRect(cx - 12, cy - 11, 24, 8);
    ctx.fillStyle = "#343a5e";
    ctx.fillRect(cx - 18, cy - 5, 36, 2);
    ctx.fillRect(cx - 12, cy - 12, 24, 2);
    ctx.fillStyle = "#454c78";
    ctx.fillRect(cx - 12, cy - 13, 24, 1);
    ctx.fillStyle = "#181c30";
    ctx.fillRect(cx - 12, cy - 3, 24, 1);
    // topo do púlpito, onde o livro se apoia
    ctx.fillStyle = "#3a4066";
    ctx.fillRect(cx - 12, cy - 13, 24, 2);
    ctx.fillStyle = "#12152a";
    ctx.fillRect(cx - 2, cy - 9, 2, 5);
    ctx.fillRect(cx + 4, cy - 8, 1, 4);
    // veios da pedra
    ctx.fillStyle = "#272b44";
    ctx.fillRect(cx - 8, cy - 7, 4, 1);
    ctx.fillRect(cx + 2, cy - 9, 5, 1);
    ctx.fillRect(cx - 12, cy - 3, 6, 1);

    // o grimório: capa, páginas em perspectiva e lombada, 18% maior
    ctx.save();
    ctx.translate(cx, cy - 22);
    ctx.scale(1.18, 1.18);
    ctx.translate(-cx, -(cy - 22));
    // sombra do livro no pedestal
    ctx.fillStyle = "rgba(2, 4, 10, 0.45)";
    ctx.beginPath();
    ctx.ellipse(cx, cy - 7, 30, 3.5, 0, 0, Math.PI * 2);
    ctx.fill();
    // capa por baixo: polígono escuro que dá volume ao livro
    ctx.fillStyle = "#1a1028";
    ctx.beginPath();
    ctx.moveTo(cx - 34, cy - 19);
    ctx.lineTo(cx - 2, cy - 27);
    ctx.lineTo(cx + 2, cy - 27);
    ctx.lineTo(cx + 34, cy - 19);
    ctx.lineTo(cx + 32, cy - 7);
    ctx.lineTo(cx + 2, cy - 13);
    ctx.lineTo(cx - 2, cy - 13);
    ctx.lineTo(cx - 32, cy - 7);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#4a2f6e";
    ctx.lineWidth = 1;
    ctx.stroke();
    // brilho na beirada da capa
    ctx.fillStyle = "#5a3a80";
    ctx.fillRect(cx - 33, cy - 7, 30, 1);
    ctx.fillRect(cx + 3, cy - 7, 30, 1);
    // apoios do livro no pedestal: o livro não flutua
    ctx.fillStyle = "#12152a";
    ctx.fillRect(cx - 11, cy - 9, 3, 4);
    ctx.fillRect(cx + 8, cy - 9, 3, 4);
    ctx.fillStyle = "#3a4066";
    ctx.fillRect(cx - 11, cy - 9, 3, 1);
    ctx.fillRect(cx + 8, cy - 9, 3, 1);
    // páginas: dois trapézios com espinha no meio, contorno escuro
    ctx.fillStyle = "#f7eed6";
    ctx.strokeStyle = "#3a2a1c";
    ctx.lineWidth = 0.7;
    ctx.beginPath();
    ctx.moveTo(cx - 31, cy - 20);
    ctx.lineTo(cx - 4, cy - 26);
    ctx.lineTo(cx - 4, cy - 14);
    ctx.lineTo(cx - 31, cy - 8);
    ctx.quadraticCurveTo(cx - 34, cy - 14, cx - 31, cy - 20);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(cx + 31, cy - 20);
    ctx.lineTo(cx + 4, cy - 26);
    ctx.lineTo(cx + 4, cy - 14);
    ctx.lineTo(cx + 31, cy - 8);
    ctx.quadraticCurveTo(cx + 34, cy - 14, cx + 31, cy - 20);
    ctx.closePath();
    ctx.fill();
    ctx.stroke();
    // espessura do bloco de páginas
    ctx.fillStyle = "#d8c9a4";
    ctx.fillRect(cx - 32, cy - 9, 27, 1);
    ctx.fillRect(cx + 5, cy - 9, 27, 1);
    // espinha escura entre as páginas
    ctx.fillStyle = "#241636";
    ctx.fillRect(cx - 3, cy - 26, 6, 13);
    ctx.fillStyle = "rgba(255, 240, 200, 0.55)";
    ctx.fillRect(cx - 0.5, cy - 25, 1, 11);
    // texto nas páginas, acompanhando a inclinação
    ctx.fillStyle = "rgba(96, 76, 52, 0.55)";
    for (let i = 0; i < 3; i++) {
      const y = cy - 20 + i * 2.4;
      ctx.fillRect(cx - 27, y, 20 - i * 2, 0.8);
      ctx.fillRect(cx + 7, y, 20 - i * 2, 0.8);
    }
    // uma runa acesa em cada página
    runa(1, cx - 22, cy - 23, `rgba(97, 244, 192, ${(0.55 + pulso * 0.45).toFixed(3)})`);
    runa(4, cx + 19, cy - 23, `rgba(255, 200, 87, ${(0.55 + pulso * 0.45).toFixed(3)})`);
    // fita marcadora caindo da lombada
    ctx.fillStyle = "#ff7aa8";
    ctx.fillRect(cx, cy - 14, 1, 7);
    // brilho na beirada de cima das páginas
    ctx.fillStyle = `rgba(255, 250, 226, ${(0.4 + pulso * 0.4).toFixed(3)})`;
    ctx.fillRect(cx - 30, cy - 20, 25, 0.8);
    ctx.fillRect(cx + 5, cy - 20, 25, 0.8);

    ctx.restore();

    // brasas subindo em espiral
    for (const b of brasas) {
      const ciclo = (t * 0.00012 * b.vel + b.altura) % 1;
      const y = cy - 26 - ciclo * 58;
      const x = cx + Math.sin(ciclo * 6.28 + b.fase) * (b.raio * (0.35 + ciclo * 0.9));
      const alfa = (1 - ciclo) * b.brilho;
      ctx.fillStyle = `rgba(255, 226, 150, ${(alfa * 0.9).toFixed(3)})`;
      ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
      if (b.brilho > 0.8) {
        ctx.fillStyle = `rgba(255, 226, 150, ${(alfa * 0.18).toFixed(3)})`;
        ctx.fillRect(Math.round(x) - 1, Math.round(y) - 1, 3, 3);
      }
    }

    // duas velas na frente do círculo, não quatro espalhadas
    for (const [vx, vy, fase] of [[cx - 26, cy + 7, 0], [cx + 26, cy + 7, 1.7]]) {
      const tremula = Math.sin(t * 0.008 + fase) * 0.8;
      ctx.fillStyle = "rgba(255, 190, 90, 0.10)";
      ctx.fillRect(vx - 4, vy - 11, 9, 12);
      ctx.fillStyle = "#efe6cf";
      ctx.fillRect(vx, vy - 3, 1, 3);
      ctx.fillStyle = "#ffc857";
      ctx.fillRect(vx, vy - 6 + Math.round(tremula), 1, 3);
      ctx.fillStyle = "#fff3d1";
      ctx.fillRect(vx, vy - 5 + Math.round(tremula), 1, 1);
    }
  }

  function desenhar(t) {
    const ceu = ctx.createLinearGradient(0, 0, 0, ALTURA);
    ceu.addColorStop(0, "#06081a");
    ceu.addColorStop(0.42, "#171338");
    ceu.addColorStop(0.7, "#432a52");
    ceu.addColorStop(1, "#171c33");
    ctx.fillStyle = ceu;
    ctx.fillRect(0, 0, LARGURA, ALTURA);

    // estrelas, algumas piscando mais forte
    for (const e of estrelas) {
      const brilho = 0.3 + Math.sin(t * 0.0018 + e.fase) * 0.34;
      ctx.fillStyle = `rgba(255, 245, 214, ${Math.max(0, brilho).toFixed(3)})`;
      ctx.fillRect(e.x, e.y, e.r, e.r);
      if (e.r > 1) {
        ctx.fillStyle = `rgba(255, 245, 214, ${Math.max(0, brilho * 0.2).toFixed(3)})`;
        ctx.fillRect(e.x - 1, e.y, 3, 1);
        ctx.fillRect(e.x, e.y - 1, 1, 3);
      }
    }

    // aurora em um véu só: três faixas cruzavam o livro e embolavam a cena
    for (let banda = 0; banda < 1; banda++) {
      ctx.beginPath();
      for (let x = 0; x <= LARGURA; x += 6) {
        const y = 42 + banda * 10 + Math.sin(x * 0.028 + t * 0.00024 + banda) * 8;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = ["rgba(97,244,192,0.10)", "rgba(180,140,255,0.10)", "rgba(107,213,255,0.08)"][banda];
      ctx.lineWidth = 5;
      ctx.stroke();
    }

    // lua com halo e crateras
    ctx.fillStyle = "rgba(255,236,180,0.06)";
    ctx.beginPath();
    ctx.arc(272, 40, 18, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#ffeaa7";
    ctx.beginPath();
    ctx.arc(272, 40, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#d8bd7a";
    ctx.fillRect(269, 37, 2, 1);
    ctx.fillRect(275, 42, 2, 1);
    ctx.fillRect(271, 44, 1, 1);

    // montanhas em camadas
    montanha(118, 46, "#171a3c", 0);
    montanha(132, 38, "#101430", 33);
    montanha(146, 28, "#080b1c", 70);

    // vale, relva e rio
    ctx.fillStyle = "#0b1224";
    ctx.fillRect(0, 146, LARGURA, ALTURA - 146);
    ctx.fillStyle = "#0d1830";
    for (let x = 0; x < LARGURA; x += 6) {
      ctx.fillRect(x, 146 + Math.floor(aleatorio(x) * 2), 6, 1);
    }
    ctx.fillStyle = "#143b58";
    ctx.beginPath();
    ctx.moveTo(150, 146);
    ctx.lineTo(166, 146);
    ctx.lineTo(196, ALTURA);
    ctx.lineTo(120, ALTURA);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "rgba(140,230,255,0.22)";
    ctx.lineWidth = 1;
    for (let i = 0; i < 7; i++) {
      const y = 150 + i * 5;
      const meia = 9 + i * 4;
      const corre = Math.sin(t * 0.0011 + i * 0.7) * 2;
      ctx.beginPath();
      ctx.moveTo(158 - meia + corre, y);
      ctx.lineTo(158 + meia + corre, y);
      ctx.stroke();
    }

    // casas com chaminé e fumaça
    for (const [x, y] of [[86, 152], [104, 156], [212, 151], [232, 157]]) {
      casa(x, y, "#ffc857");
      const subindo = (t * 0.00008 + aleatorio(x) * 0.8) % 1;
      ctx.fillStyle = `rgba(200, 200, 220, ${(0.12 * (1 - subindo)).toFixed(3)})`;
      ctx.fillRect(x + 2 + Math.sin(subindo * 6) * 1, y - 9 - Math.round(subindo * 6), 1, 1);
    }

    // árvores do fundo: copa orgânica, algumas pinheiros
    for (let i = 0; i < 22; i++) {
      const x = Math.floor(aleatorio(i + 300) * LARGURA);
      if (x > 128 && x < 194) continue;
      const h = 9 + Math.floor(aleatorio(i + 400) * 14);
      const y = 147 + Math.floor(aleatorio(i + 500) * 3);
      if (i % 4 === 0) pinheiro(x, y, h, "#070b16");
      else arvore(x, y, h, "#070b16", i);
    }

    // o centro do vale: um alto de pedra no meio da relva, e sobre ele o
    // círculo de runas, o púlpito e o grimório
    ctx.fillStyle = "#0a1020";
    ctx.beginPath();
    ctx.moveTo(116, 152);
    ctx.quadraticCurveTo(138, 112, 160, 110);
    ctx.quadraticCurveTo(182, 112, 204, 152);
    ctx.lineTo(116, 152);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = "#0d1526";
    ctx.beginPath();
    ctx.moveTo(128, 152);
    ctx.quadraticCurveTo(146, 118, 160, 116);
    ctx.quadraticCurveTo(174, 118, 192, 152);
    ctx.closePath();
    ctx.fill();
    for (let i = 0; i < 8; i++) {
      const x = 122 + Math.floor(aleatorio(i + 810) * 76);
      const y = 122 + Math.floor(aleatorio(i + 840) * 26);
      ctx.fillStyle = i % 2 ? "#131c30" : "#0f1728";
      ctx.fillRect(x, y, 2, 1);
    }
    // vinheta: escurece a moldura do vale e deixa o centro como único foco
    const vinheta = ctx.createRadialGradient(160, 108, 44, 160, 108, 132);
    vinheta.addColorStop(0, "rgba(4,6,14,0)");
    vinheta.addColorStop(0.62, "rgba(4,6,14,0.30)");
    vinheta.addColorStop(1, "rgba(4,6,14,0.66)");
    ctx.fillStyle = vinheta;
    ctx.fillRect(0, 56, LARGURA, ALTURA - 56);
    // uma cena só: círculo no chão, velas e o grimório no meio
    circuloDeRunas(160, 118, t);
    grimorio(160, 112, t);

    // colinas da frente, com tufos de mato
    ctx.fillStyle = "#060a16";
    ctx.beginPath();
    ctx.moveTo(0, 168);
    for (let x = 0; x <= LARGURA; x += 6) {
      ctx.lineTo(x, 160 + Math.sin(x * 0.05) * 4 + Math.sin(x * 0.013) * 6);
    }
    ctx.lineTo(LARGURA, ALTURA);
    ctx.lineTo(0, ALTURA);
    ctx.closePath();
    ctx.fill();
    for (let i = 0; i < 46; i++) {
      const x = Math.floor(aleatorio(i + 600) * LARGURA);
      const y = 166 + Math.floor(aleatorio(i + 700) * 12);
      if (Math.abs(x - 160) < 46 && y < 172) continue;
      ctx.fillStyle = i % 3 ? "#0a1220" : "#122036";
      ctx.fillRect(x, y, 1, 2);
      if (i % 5 === 0) {
        ctx.fillRect(x - 1, y - 1, 1, 1);
        ctx.fillRect(x + 1, y - 1, 1, 1);
      }
    }

    // árvores grandes nas laterais, com galho e copa em camadas
    arvore(18, 172, 40, "#040710", 3);
    arvore(44, 176, 26, "#040710", 9);
    arvore(286, 172, 44, "#040710", 5);
    pinheiro(304, 176, 30, "#040710");

    // Primeiro plano usa a mesma biblioteca do jogo: folhas, flores e bichos
    // mantêm material, luz e ritmo ao atravessar a tela de entrada.
    const biome={id:'title',accent:'#c4ad78',floor:'#192333',path:'#3c4350'};
    ctx.save();ctx.globalAlpha=.55;
    for(const [kind,x,y,seed]of [['arbusto',30,177,2],['florada',91,175,3],['cogumelo',250,176,1],['junco',226,177,4]])desenharAsset(ctx,kind,x,y,{tempo:t,bioma:biome,seed});
    ctx.restore();
    drawPetSprite(ctx,'owl',247,163,t,false,4);

    // fogueira acesa à esquerda
    const fogo = ctx.createRadialGradient(64, 157, 1, 64, 157, 24);
    fogo.addColorStop(0, "rgba(255, 190, 90, 0.32)");
    fogo.addColorStop(1, "rgba(255, 190, 90, 0)");
    ctx.fillStyle = fogo;
    ctx.fillRect(40, 133, 48, 36);
    ctx.fillStyle = "#3a2a1c";
    ctx.fillRect(57, 161, 14, 2);
    ctx.fillRect(59, 158, 3, 4);
    ctx.fillRect(66, 157, 2, 5);
    const chama = Math.sin(t * 0.006) * 1.5;
    ctx.fillStyle = "#ffc857";
    ctx.fillRect(63, 154 + chama, 3, 6);
    ctx.fillStyle = "#fff3d1";
    ctx.fillRect(64, 156, 1, 3);
    ctx.fillStyle = "#ff9f6b";
    ctx.fillRect(66, 157, 2, 4);
    ctx.fillStyle = "rgba(255, 226, 150, 0.5)";
    ctx.fillRect(64 + Math.round(chama), 150 + Math.round(chama * 0.5), 1, 2);

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
      const y = 148 + i * 9 + Math.sin(t * 0.0004 + i) * 2;
      ctx.fillStyle = `rgba(160, 200, 255, ${0.032 - i * 0.008})`;
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

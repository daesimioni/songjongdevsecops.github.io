// A fachada da caverna. A pedra da área decide a arquitetura: ruína de pedra
// lavrada onde o chão é giz, ardósia ou papel; boca de mina onde é ferro,
// cobre, latão ou silício; fenda de cristal onde é vidro, cristal, obsidiana
// ou âmbar; toca de raiz onde é cerâmica, fibra ou ébano. A boca de entrada
// tem placa, luz e degrau gasto; a boca do fundo é a saída esquecida, sem
// placa, com mato e entulho na frente.
const FAMILIA_POR_MATERIAL = {
  giz: "ruina",
  "ardósia": "ruina",
  papel: "ruina",
  pergaminho: "ruina",
  tinta: "ruina",
  ferro: "mina",
  cobre: "mina",
  "latão": "mina",
  "silício": "mina",
  vidro: "fenda",
  cristal: "fenda",
  obsidiana: "fenda",
  "âmbar": "fenda",
  "cerâmica": "toca",
  fibra: "toca",
  "ébano": "toca",
};

export function caveFamily(material) {
  return FAMILIA_POR_MATERIAL[material] || "morro";
}

function hexA(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

function misturar(a, b, t) {
  const na = parseInt(a.slice(1), 16);
  const nb = parseInt(b.slice(1), 16);
  const canal = (desloca) => Math.round(((na >> desloca) & 255) * (1 - t) + ((nb >> desloca) & 255) * t);
  return `rgb(${canal(16)}, ${canal(8)}, ${canal(0)})`;
}

const clarear = (hex, t) => misturar(hex, "#ffffff", t);

// cada material tem a sua, mas o desenho não muda a pegada: 40 px de largura e
// 31 de altura, que é o que a colisão do mundo cobre
export function drawCaveFacade(ctx, c) {
  const { px, py, pedra, meio, fundo, acento, seed, time } = c;
  const entrada = c.entrada;
  const familia = caveFamily(c.material);
  const pulso = 0.5 + Math.sin(time * 0.0028 + seed * 6.28) * 0.5;
  // a fachada é mineral: sai da pedra da área (mais clara), não do chão
  const claro = clarear(pedra, 0.24);
  const terra = misturar(pedra, "#5a4632", 0.5);

  // sombra no chão
  ctx.fillStyle = "rgba(2,4,10,0.42)";
  ctx.beginPath();
  ctx.ellipse(px, py + 2, 20 - (1 - seed) * 2, 6, 0, 0, Math.PI * 2);
  ctx.fill();

  if (familia === "ruina") {
    // três blocos de pedra lavrada, com junta e friso
    ctx.fillStyle = pedra;
    ctx.fillRect(px - 20, py - 14, 40, 14);
    ctx.fillRect(px - 15, py - 22, 30, 9);
    ctx.fillRect(px - 8, py - 28, 16, 7);
    ctx.fillStyle = claro;
    ctx.fillRect(px - 20, py - 15, 40, 2);
    ctx.fillRect(px - 15, py - 23, 30, 2);
    ctx.fillRect(px - 8, py - 29, 16, 2);
    // juntas a cada 5 px, desencontradas por fiada
    ctx.fillStyle = fundo;
    for (let i = 0; i < 4; i++) ctx.fillRect(px - 20 + i * 11 + (seed * 2) % 3, py - 12, 1, 10);
    for (let i = 0; i < 3; i++) ctx.fillRect(px - 15 + i * 11, py - 20, 1, 6);
    // coluna quebrada de um lado: só a entrada tem as duas
    ctx.fillStyle = claro;
    ctx.fillRect(px - 24, py - 12, 4, 12);
    ctx.fillRect(px - 24, py - 14, 3, 3);
    if (entrada) {
      ctx.fillRect(px + 20, py - 12, 4, 12);
      ctx.fillRect(px + 21, py - 14, 3, 3);
    } else {
      ctx.fillStyle = fundo;
      ctx.fillRect(px + 20, py - 4, 4, 4);
    }
  } else if (familia === "mina") {
    // barrote de madeira e trilho: a boca de mina
    ctx.fillStyle = pedra;
    ctx.fillRect(px - 19, py - 18, 38, 18);
    ctx.fillRect(px - 13, py - 26, 26, 9);
    ctx.fillStyle = claro;
    ctx.fillRect(px - 19, py - 19, 38, 2);
    ctx.fillRect(px - 13, py - 27, 26, 2);
    ctx.fillStyle = fundo;
    // entulho empilhado dos lados
    ctx.fillRect(px - 22, py - 8, 5, 8);
    ctx.fillRect(px + 18, py - 6, 5, 6);
    // madeira: duas colunas e o travessão
    ctx.fillStyle = "#6b4a2f";
    ctx.fillRect(px - 15, py - 22, 3, 22);
    ctx.fillRect(px + 12, py - 22, 3, 22);
    ctx.fillRect(px - 16, py - 24, 32, 3);
    // trilho e vagonete parado
    ctx.fillStyle = "#8d8f9c";
    ctx.fillRect(px - 9, py - 1, 18, 1);
    ctx.fillRect(px - 7, py - 3, 12, 2);
    if (entrada) {
      // lanterna acesa na entrada
      ctx.fillStyle = hexA(acento, 0.5 + pulso * 0.3);
      ctx.fillRect(px - 17, py - 20, 2, 3);
      ctx.fillStyle = hexA(acento, 0.18 + pulso * 0.12);
      ctx.fillRect(px - 21, py - 24, 10, 11);
    } else {
      // saída apagada, com tábuas cruzadas
      ctx.fillStyle = "#4b3421";
      ctx.fillRect(px - 12, py - 16, 24, 2);
    }
  } else if (familia === "fenda") {
    // lascas de cristal em volta de uma rachadura
    ctx.fillStyle = pedra;
    ctx.fillRect(px - 18, py - 16, 36, 16);
    ctx.fillRect(px - 11, py - 25, 22, 9);
    ctx.fillStyle = claro;
    // lascas: triângulos de alturas diferentes
    for (let i = 0; i < 6; i++) {
      const bx = px - 20 + i * 7;
      const alt = 6 + ((seed * 13 + i * 7) % 11);
      ctx.beginPath();
      ctx.moveTo(bx, py - 4);
      ctx.lineTo(bx + 3, py - 4 - alt);
      ctx.lineTo(bx + 6, py - 4);
      ctx.closePath();
      ctx.fill();
    }
    // veio brilhando no meio
    ctx.fillStyle = hexA(acento, 0.3 + pulso * 0.4);
    ctx.fillRect(px - 1, py - 26, 2, 14);
    ctx.fillRect(px - 7, py - 18, 2, 6);
    ctx.fillRect(px + 5, py - 20, 2, 8);
    ctx.fillStyle = fundo;
    ctx.fillRect(px - 22, py - 2, 3, 2);
  } else if (familia === "toca") {
    // barro e raiz: o morro é orgânico e as raízes descem pela boca
    ctx.fillStyle = terra;
    ctx.beginPath();
    ctx.moveTo(px - 20, py);
    ctx.quadraticCurveTo(px - 17, py - 20, px - 6, py - 26);
    ctx.quadraticCurveTo(px, py - 29, px + 7, py - 25);
    ctx.quadraticCurveTo(px + 18, py - 19, px + 20, py);
    ctx.closePath();
    ctx.fill();
    ctx.fillStyle = claro;
    ctx.strokeStyle = claro;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px - 17, py - 3);
    ctx.quadraticCurveTo(px - 13, py - 18, px - 3, py - 23);
    ctx.quadraticCurveTo(px + 2, py - 24, px + 8, py - 21);
    ctx.stroke();
    // raízes penduradas
    ctx.fillStyle = "#5c4a32";
    for (let i = 0; i < 5; i++) {
      const rx = px - 16 + i * 8 + ((seed * 9) % 3);
      const comp = 3 + ((i * 5 + Math.floor(seed * 10)) % 6);
      ctx.fillRect(rx, py - 20, 1, comp);
      ctx.fillRect(rx + 1, py - 20 + comp, 2, 1);
    }
    // cogumelo só na boca esquecida
    if (!entrada) {
      ctx.fillStyle = hexA(acento, 0.7);
      ctx.fillRect(px + 16, py - 4, 3, 1);
      ctx.fillStyle = "#d9d2c0";
      ctx.fillRect(px + 17, py - 3, 1, 2);
    }
  } else {
    // morro de pedra clássico
    ctx.fillStyle = pedra;
    ctx.fillRect(px - 20, py - 16, 40, 16);
    ctx.fillRect(px - 16, py - 24, 32, 10);
    ctx.fillRect(px - 9, py - 31, 18, 8);
    ctx.fillStyle = claro;
    ctx.fillRect(px - 20, py - 17, 40, 3);
    ctx.fillRect(px - 16, py - 25, 32, 2);
    ctx.fillRect(px - 9, py - 32, 18, 2);
  }

  // a boca: sempre no mesmo lugar, escura, com batente de pedra
  const vao = entrada ? 16 : 13;
  ctx.fillStyle = pedra;
  ctx.fillRect(px - vao / 2 - 2, py - 20, vao + 4, 3);
  ctx.fillStyle = "#05060c";
  ctx.fillRect(px - vao / 2, py - 18, vao, 18);
  ctx.fillRect(px - vao / 2 + 1, py - 20, vao - 2, 2);
  if (entrada) {
    // luz do fundo e o degrau que o pé já gastou
    ctx.fillStyle = hexA(acento, 0.4 + pulso * 0.18);
    ctx.fillRect(px - 5, py - 17, 10, 1);
    // a escada da boca desce em diagonal para um canto sorteado pela semente,
    // então nenhuma entrada repete o mesmo degrau reto
    const ladoDegrau = seed > 0.5 ? 1 : -1;
    for (let i = 0; i < 4; i++) {
      const ex = ladoDegrau > 0 ? px + 1 + i * 4 : px - 6 - i * 4;
      const ey = py - 1 + i;
      ctx.fillStyle = "#0a0c18";
      ctx.fillRect(ex - 1, ey - 1, 7, 4);
      ctx.fillStyle = hexA(pedra, 0.66 - i * 0.1);
      ctx.fillRect(ex, ey, 5, 2);
      ctx.fillStyle = hexA(acento, 0.16);
      ctx.fillRect(ex, ey, 5, 1);
    }
    ctx.fillStyle = hexA(acento, 0.24);
    ctx.fillRect(px - 1, py - 2, 2, 1);
    // placa do lugar
    ctx.fillStyle = "#141827";
    ctx.fillRect(px + 14, py - 26, 2, 12);
    ctx.fillStyle = hexA(acento, 0.9);
    ctx.fillRect(px + 16, py - 25, 8, 5);
    ctx.fillStyle = hexA(fundo, 0.9);
    ctx.fillRect(px + 17, py - 24, 6, 3);
  } else {
    // saída esquecida: entulho na boca e mato na beirada
    ctx.fillStyle = fundo;
    ctx.fillRect(px - 8, py - 4, 16, 4);
    ctx.fillStyle = meio;
    ctx.fillRect(px - 6, py - 3, 4, 2);
    ctx.fillRect(px + 3, py - 4, 3, 3);
    ctx.fillStyle = hexA(acento, 0.35);
    ctx.fillRect(px - vao / 2 - 1, py - 19, 2, 2);
    ctx.fillRect(px + vao / 2 - 1, py - 19, 2, 2);
  }
}

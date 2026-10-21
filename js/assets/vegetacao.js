// Grupo vegetação: árvores, arbusto, junco, florada e trepadeira. Tudo desenha
// no próprio canvas, ancorado no pé (centro embaixo), com sombra, contorno e
// duas ou três camadas de tom. A paleta vem do bioma, então a mesma árvore
// muda de cor de ilha para ilha sem precisar de arte nova.
//
// `quadros` marca animação; o renderer escolhe o quadro pelo relógio da cena e
// cada quadro é cacheado separado.

// elipse de spans de 1 px: contorno arredondado de verdade, sem retângulo
function spans(g, cx, cy, rx, ry, cor) {
  g.fillStyle = cor;
  for (let row = 0; row < ry * 2; row++) {
    const t = (row - ry) / ry;
    const meia = Math.round(Math.sqrt(Math.max(0, 1 - t * t)) * rx);
    if (meia < 1) continue;
    g.fillRect(Math.round(cx - meia), Math.round(cy - ry + row), meia * 2, 1);
  }
}

function sombra(g, p, w, h, raio = 0.34) {
  g.fillStyle = p.sombra;
  g.beginPath();
  g.ellipse(w / 2, h - 2, w * raio, Math.max(2, h * 0.05), 0, 0, Math.PI * 2);
  g.fill();
}

// ---- árvore folhuda: copa em três camadas, tronco com raiz -----------------
function folhuda(g, p, v) {
  const w = 36, h = 46;
  sombra(g, p, w, h, 0.32);
  const cx = w / 2;
  const topo = v === 1 ? 7 : 10;
  // tronco e raiz
  g.fillStyle = p.contorno;
  g.fillRect(cx - 2, h - 14, 5, 12);
  g.fillRect(cx - 4, h - 4, 9, 2);
  g.fillStyle = p.tronco;
  g.fillRect(cx - 2, h - 13, 3, 11);
  g.fillStyle = p.troncoClaro;
  g.fillRect(cx - 1, h - 13, 1, 9);
  g.fillStyle = p.contorno;
  g.fillRect(cx - 3, h - 8, 2, 1);
  g.fillRect(cx + 2, h - 7, 2, 1);
  // copa: camada escura de fora, média e clara em cima à esquerda
  const camadas = v === 1
    ? [[16, 15, p.folhaEscura], [12, 11, p.folha], [7, 7, p.folhaClara]]
    : [[18, 14, p.folhaEscura], [14, 10, p.folha], [8, 6, p.folhaClara]];
  const cy = topo + (v === 1 ? 17 : 15);
  for (let i = 0; i < camadas.length; i++) {
    const [rx, ry, cor] = camadas[i];
    spans(g, cx + (i === 2 ? -2 : 0), cy + i * 1.5, rx, ry, cor);
  }
  // recorte de folha: entalhes no contorno de baixo
  g.fillStyle = p.folhaEscura;
  for (let i = 0; i < 4; i++) {
    const x = Math.round(cx - 12 + i * 8 + (v === 1 ? 2 : 0));
    g.fillRect(x, cy + 12 - (i % 2) * 2, 2, 2);
  }
  // folhas soltas e brilho
  g.fillStyle = p.folhaClara;
  g.fillRect(Math.round(cx - 9), cy - 4, 2, 1);
  g.fillRect(Math.round(cx - 6), cy - 7, 1, 1);
  g.fillStyle = p.folha;
  g.fillRect(Math.round(cx + 8), cy + 3, 1, 2);
  g.fillRect(Math.round(cx + 5), cy + 8, 1, 1);
  // fruto em algumas variantes
  if (v === 0) {
    g.fillStyle = p.luz;
    g.fillRect(Math.round(cx - 4), cy + 4, 1, 1);
    g.fillRect(Math.round(cx + 6), cy - 2, 1, 1);
  }
}

// ---- conífera: quatro camadas de galho ------------------------------------
function conifera(g, p, v) {
  const w = 26, h = 48;
  sombra(g, p, w, h, 0.26);
  const cx = w / 2;
  g.fillStyle = p.contorno;
  g.fillRect(cx - 2, h - 10, 4, 8);
  g.fillStyle = p.tronco;
  g.fillRect(cx - 1, h - 10, 2, 7);
  const tiers = v === 1 ? 5 : 4;
  const passo = v === 1 ? 7 : 8;
  for (let t = 0; t < tiers; t++) {
    // as camadas se sobrepõem: sem isso a copa vira uma pilha de triângulos
    // soltos e a árvore parece listrada
    const y = 4 + t * passo;
    const larg = 4 + t * 4.2;
    const alt = passo + 3;
    g.fillStyle = p.folhaEscura;
    for (let row = 0; row < alt; row++) {
      const meia = Math.round((larg * (row + 1)) / alt);
      g.fillRect(Math.round(cx - meia), y + row, meia * 2, 1);
    }
    g.fillStyle = p.folha;
    for (let row = 2; row < alt - 1; row++) {
      const meia = Math.round((larg * row) / alt);
      g.fillRect(Math.round(cx - meia) + 1, y + row, meia * 2 - 2, 1);
    }
    // luz do lado esquerdo
    g.fillStyle = p.folhaClara;
    for (let row = 3; row < alt - 2; row++) {
      const meia = Math.round((larg * row) / alt);
      g.fillRect(Math.round(cx - meia) + 1, y + row, Math.max(1, Math.round(meia * 0.4)), 1);
    }
  }
  // ponta e neve
  g.fillStyle = p.folhaClara;
  g.fillRect(cx - 1, 3, 2, 3);
  g.fillStyle = "rgba(255,255,255,0.28)";
  g.fillRect(cx - 1, 4, 1, 1);
  g.fillRect(cx - 3, 14, 2, 1);
}

// ---- palmeira: tronco curvo e frondes -------------------------------------
function palmeira(g, p, v) {
  const w = 34, h = 48;
  sombra(g, p, w, h, 0.28);
  let x = w / 2 - (v === 1 ? 3 : 0);
  for (let i = 0; i < 22; i++) {
    const y = h - 4 - i;
    const curva = i < 12 ? 0 : (i - 12) * 0.35;
    g.fillStyle = p.tronco;
    g.fillRect(Math.round(x + curva), y, 3, 1);
    if (i % 4 === 0) {
      g.fillStyle = p.troncoClaro;
      g.fillRect(Math.round(x + curva), y, 1, 1);
    }
  }
  const tx = Math.round(x + 4), ty = h - 25;
  const frondes = [
    [-11, 1], [11, 1], [-8, 6], [8, 6], [-4, 9], [4, 9],
  ];
  for (const [dx, dy] of frondes) {
    g.strokeStyle = p.folha;
    g.lineWidth = 1;
    g.beginPath();
    g.moveTo(tx, ty);
    g.quadraticCurveTo(tx + dx * 0.5, ty - 5, tx + dx, ty + dy);
    g.stroke();
    g.fillStyle = p.folhaClara;
    g.fillRect(tx + Math.round(dx * 0.55), ty - 3 + Math.round(dy * 0.25), 1, 1);
  }
  g.fillStyle = p.brasa;
  g.fillRect(tx - 2, ty + 2, 2, 2);
  g.fillRect(tx + 2, ty + 3, 2, 2);
}

// ---- árvore seca: galhos retorcidos ---------------------------------------
function seca(g, p, v) {
  const w = 26, h = 36;
  sombra(g, p, w, h, 0.3);
  const cx = w / 2;
  g.fillStyle = p.contorno;
  g.fillRect(cx - 2, h - 16, 4, 14);
  g.fillStyle = p.tronco;
  g.fillRect(cx - 1, h - 16, 2, 13);
  const galhos = v === 1
    ? [[cx, h - 14, -6, -6], [cx, h - 11, 7, -5], [cx - 4, h - 9, -5, -3]]
    : [[cx, h - 15, -7, -4], [cx, h - 12, 6, -7], [cx + 4, h - 7, 5, -3]];
  for (const [x0, y0, dx, dy] of galhos) {
    g.strokeStyle = p.tronco;
    g.beginPath();
    g.moveTo(x0, y0);
    g.lineTo(x0 + dx, y0 + dy);
    g.stroke();
    g.fillStyle = p.troncoClaro;
    g.fillRect(Math.round(x0 + dx * 0.5), Math.round(y0 + dy * 0.5), 1, 1);
  }
  g.fillStyle = p.folhaEscura;
  g.fillRect(cx - 7, h - 21, 1, 1);
  g.fillRect(cx + 8, h - 20, 1, 1);
}

// ---- arbusto: duas camadas e frutos --------------------------------------
function arbusto(g, p, v) {
  const w = 22, h = 18;
  g.fillStyle = p.sombra;
  g.beginPath();
  g.ellipse(w / 2, h - 2, 8, 2, 0, 0, Math.PI * 2);
  g.fill();
  spans(g, w / 2, h - 7, 10, 7, p.contorno);
  spans(g, w / 2, h - 8, 9, 6, p.folhaEscura);
  spans(g, w / 2 - 1, h - 9, 6.5, 4, p.folha);
  spans(g, w / 2 - 2, h - 10, 3.5, 2, p.folhaClara);
  g.fillStyle = v === 1 ? p.brasa : p.luz;
  g.fillRect(w / 2 - 5, h - 9, 1, 1);
  g.fillRect(w / 2 + 4, h - 11, 1, 1);
  g.fillRect(w / 2 + 1, h - 6, 1, 1);
}

// ---- junco: hastes na beira da água --------------------------------------
function junco(g, p, v) {
  const w = 18, h = 24;
  const hastes = v === 1 ? [3, 7, 11, 15] : [4, 8, 12, 15, 9];
  hastes.forEach((x, i) => {
    const alt = 10 + ((i * 5) % 9);
    g.strokeStyle = i % 2 ? p.folha : p.folhaEscura;
    g.beginPath();
    g.moveTo(x, h - 1);
    g.lineTo(x + (i % 2 ? 1 : -1), h - 1 - alt);
    g.stroke();
    g.fillStyle = p.tronco;
    g.fillRect(x, h - 3 - alt, 2, 3);
  });
  g.fillStyle = p.sombra;
  g.fillRect(1, h - 2, w - 2, 2);
}

// ---- florada -------------------------------------------------------------
function florada(g, p, v) {
  const w = 22, h = 15;
  const flores = v === 1
    ? [[5, 6, p.folhaClara], [11, 3, p.luz], [17, 7, p.brasa]]
    : [[4, 7, p.luz], [10, 4, p.folhaClara], [16, 6, p.brasa]];
  for (const [x, y, cor] of flores) {
    g.strokeStyle = p.folhaEscura;
    g.beginPath();
    g.moveTo(x + 0.5, h - 2);
    g.lineTo(x, y + 2);
    g.stroke();
    g.fillStyle = p.folha;
    g.fillRect(x - 1, h - 6, 2, 1);
    g.fillStyle = cor;
    g.fillRect(x - 1, y, 2, 2);
    g.fillRect(x, y - 1, 1, 4);
    g.fillStyle = p.luz;
    g.fillRect(x, y, 1, 1);
  }
}

// ---- trepadeira: cipó com folha nas paredes e ruínas ---------------------
function trepadeira(g, p, v) {
  const w = 14, h = 34;
  g.strokeStyle = p.folhaEscura;
  g.lineWidth = 1;
  g.beginPath();
  g.moveTo(6, 0);
  g.bezierCurveTo(3, 10, 10, 18, 5, 33);
  g.stroke();
  for (let i = 0; i < 7; i++) {
    const x = 4 + ((i * 3) % 7);
    const y = 3 + i * 4;
    g.fillStyle = i % 3 === 0 ? p.folhaClara : p.folha;
    g.fillRect(x, y, 2, 1);
    g.fillRect(x + (i % 2 ? 2 : -1), y + 1, 1, 1);
  }
  if (v === 1) {
    g.fillStyle = p.luz;
    g.fillRect(8, 12, 1, 1);
  }
}

export const VEGETACAO = {
  arvore: { w: 36, h: 46, variantes: 2, desenhar: folhuda },
  conifera: { w: 26, h: 48, variantes: 2, desenhar: conifera },
  palmeira: { w: 34, h: 48, variantes: 2, desenhar: palmeira },
  seca: { w: 26, h: 36, variantes: 2, desenhar: seca },
  arbusto: { w: 22, h: 18, variantes: 2, desenhar: arbusto },
  junco: { w: 18, h: 24, variantes: 2, desenhar: junco },
  florada: { w: 22, h: 15, variantes: 2, desenhar: florada },
  trepadeira: { w: 14, h: 34, variantes: 2, desenhar: trepadeira },
};

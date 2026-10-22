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

// elipse em passo de meio pixel: a borda da copa ganha o dobro de degraus
function elipseFina(g, cx, cy, rx, ry, cor, chiado = 0) {
  g.fillStyle = cor;
  for (let y = -ry; y < ry; y += 0.5) {
    const t = y / ry;
    let meia = Math.sqrt(Math.max(0, 1 - t * t)) * rx;
    if (chiado) meia *= 0.9 + (Math.sin((y + cx) * 12.9) * 0.5 + 0.5) * chiado;
    if (meia <= 0.5) continue;
    g.fillRect(cx - meia, cy + y, meia * 2, 0.5);
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
  const topo = v === 2 ? 6 : v === 1 ? 7 : 10;
  // tronco com casca em meio pixel e raiz que abre no chão
  g.fillStyle = p.contorno;
  g.fillRect(cx - 2.5, h - 14, 6, 12);
  g.fillRect(cx - 4.5, h - 4, 10, 2);
  g.fillStyle = p.tronco;
  g.fillRect(cx - 2, h - 13, 4, 11);
  g.fillStyle = p.troncoClaro;
  g.fillRect(cx - 1.5, h - 13, 1, 10);
  g.fillStyle = "rgba(0,0,0,0.28)";
  g.fillRect(cx + 1, h - 12, 0.5, 9);
  g.fillRect(cx - 0.5, h - 7, 0.5, 1);
  g.fillStyle = p.contorno;
  g.fillRect(cx - 3.5, h - 8, 2, 0.5);
  g.fillRect(cx + 2.5, h - 7, 2, 0.5);
  // copa: quatro camadas em passo de meio pixel, com chiado no contorno
  const camadas = v === 2
    ? [[12.5, 20, p.folhaEscura, 0.09], [10, 16, p.folha, 0.08], [6.5, 11, p.folhaClara, 0.06], [3.2, 6, p.folhaClara, 0.04]]
    : v === 1
    ? [[17, 16, p.folhaEscura, 0.12], [14, 12, p.folha, 0.10], [9, 8, p.folhaClara, 0.08], [4.5, 4, p.folhaClara, 0.05]]
    : [[19, 15, p.folhaEscura, 0.12], [15.5, 11, p.folha, 0.10], [9.5, 7, p.folhaClara, 0.08], [5, 3.5, p.folhaClara, 0.05]];
  const cy = topo + (v === 2 ? 20 : v === 1 ? 17 : 15);
  for (let i = 0; i < camadas.length; i++) {
    const [rx, ry, cor, chiado] = camadas[i];
    elipseFina(g, cx + (i >= 2 ? -2 : 0), cy + i * 1.2, rx, ry, cor, chiado);
  }
  // moitas de folha: pequenas elipses de dois tons espalhadas pela copa
  for (let i = 0; i < 12; i++) {
    const a = (i * 2.399) % (Math.PI * 2);
    const r = 2.5 + (i % 4) * 2.2;
    const fx = cx - 2 + Math.cos(a) * r * 1.5;
    const fy = cy + Math.sin(a) * r + (i % 3) * 1.5;
    elipseFina(g, fx, fy, 2.2 + (i % 3) * 0.6, 1.4 + (i % 2) * 0.5, i % 3 === 0 ? p.folhaClara : p.folhaEscura, 0.12);
  }
  // recorte de folha no contorno de baixo
  g.fillStyle = p.folhaEscura;
  for (let i = 0; i < 5; i++) {
    const x = cx - 13 + i * 6 + (v === 1 ? 2 : 0);
    g.fillRect(x, cy + 12 - (i % 2) * 2, 2, 1);
  }
  // folhas soltas, veios e brilho
  g.fillStyle = p.folhaClara;
  g.fillRect(cx - 9.5, cy - 4.5, 1.5, 0.5);
  g.fillRect(cx - 6.5, cy - 7.5, 0.5, 0.5);
  g.fillRect(cx + 7.5, cy + 2, 0.5, 1);
  g.fillRect(cx + 5.5, cy + 8.5, 0.5, 0.5);
  g.fillStyle = "rgba(255,255,255,0.22)";
  g.fillRect(cx - 3.5, cy - 9.5, 2.5, 0.5);
  g.fillStyle = p.folha;
  g.fillRect(cx + 8.5, cy + 4, 0.5, 1.5);
  g.fillRect(cx - 10.5, cy + 5, 0.5, 1);
  if (v === 0) {
    g.fillStyle = p.luz;
    g.fillRect(cx - 4, cy + 4, 1, 1);
    g.fillRect(cx + 6, cy - 2, 1, 1);
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
  g.fillRect(cx - 1.5, h - 10, 3, 7);
  g.fillStyle = p.troncoClaro;
  g.fillRect(cx - 1, h - 10, 0.5, 6);
  const tiers = v === 2 ? 6 : v === 1 ? 5 : 4;
  const passo = v === 2 ? 6 : v === 1 ? 7 : 8;
  for (let t = 0; t < tiers; t++) {
    const y = 3 + t * passo + (v === 2 ? (t % 2) : 0);
    const larg = v === 2 ? 3 + t * 3 : 4 + t * 4.2;
    const alt = passo + 3;
    // galho em passo de meio pixel: o triângulo deixa de ser escada de 1 px
    for (let row = 0; row < alt; row += 0.5) {
      const meia = Math.round(((larg * (row + 0.5)) / alt) * 2) / 2;
      const chiado = Math.sin((row + t * 3) * 9.7) > 0.15 ? 0.5 : 0;
      g.fillStyle = p.folhaEscura;
      g.fillRect(cx - meia, y + row, meia * 2, 0.5);
      if (row > 1) {
        g.fillStyle = p.folha;
        g.fillRect(cx - meia + 0.5 + chiado, y + row, meia * 2 - 1, 0.5);
      }
      if (row > alt * 0.35) {
        g.fillStyle = p.folhaClara;
        g.fillRect(cx - meia + 0.5 + chiado, y + row, Math.max(0.5, meia * 0.38), 0.5);
      }
    }
    // agulhas soltas nas bordas
    g.fillStyle = p.folhaClara;
    g.fillRect(cx - larg - 0.5, y + 3, 0.5, 0.5);
    g.fillRect(cx + larg - 1, y + 4, 1, 0.5);
    g.fillRect(cx - larg * 0.6, y + 5, 0.5, 0.5);
  }
  g.fillStyle = p.folhaClara;
  g.fillRect(cx - 1, 2.5, 2, 3);
  g.fillStyle = "rgba(255,255,255,0.28)";
  g.fillRect(cx - 1, 3.5, 1, 1);
  g.fillRect(cx - 3, 14, 2, 1);
}

// ---- palmeira: tronco curvo e frondes -------------------------------------
function palmeira(g, p, v) {
  const w = 34, h = 48;
  sombra(g, p, w, h, 0.28);
  let x = w / 2 - (v === 1 ? 3 : v === 2 ? -4 : 0);
  for (let i = 0; i < (v === 2 ? 16 : 22); i++) {
    const y = h - 4 - i;
    const curva = i < 12 ? 0 : (i - 12) * 0.35;
    g.fillStyle = p.tronco;
    g.fillRect(Math.round(x + curva), y, 3, 1);
    if (i % 4 === 0) {
      g.fillStyle = p.troncoClaro;
      g.fillRect(Math.round(x + curva), y, 1, 1);
    }
  }
  const tx = Math.round(x + 4), ty = h - (v === 2 ? 19 : 25);
  const frondes = v === 2
    ? [[-12, -1], [12, -1], [-9, 4], [9, 4], [-5, 8], [5, 8]]
    : [[-11, 1], [11, 1], [-8, 6], [8, 6], [-4, 9], [4, 9]];
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
  // folíolos de meio pixel nas frondes
  g.fillStyle = p.folhaClara;
  for (let i = 0; i < 6; i++) {
    const [dx, dy] = frondes[i];
    for (let k = 0.25; k < 1; k += 0.25) {
      const fx = tx + dx * k;
      const fy = ty + (dy - 3) * k;
      g.fillRect(fx - 0.5, fy, 0.5, 0.5);
      g.fillRect(fx + 0.5, fy + 0.5, 0.5, 0.5);
    }
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
  const galhos = v === 2
    ? [[cx - 1, h - 16, -8, -9], [cx + 1, h - 15, 7, -7], [cx - 6, h - 22, -3, -4], [cx + 5, h - 20, 4, -3]]
    : v === 1
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
  spans(g, w / 2, h - 6, v === 2 ? 11 : 10, v === 2 ? 6 : 7, p.contorno);
  spans(g, w / 2, h - 7, v === 2 ? 10 : 9, v === 2 ? 5 : 6, p.folhaEscura);
  spans(g, w / 2 - 1, h - 8, v === 2 ? 7.5 : 6.5, v === 2 ? 3.5 : 4, p.folha);
  spans(g, w / 2 - 2, h - 9, v === 2 ? 4.5 : 3.5, 2, p.folhaClara);
  g.fillStyle = p.folhaClara;
  g.fillRect(w / 2 - 6.5, h - 11, 0.5, 0.5);
  g.fillRect(w / 2 + 3.5, h - 8, 0.5, 0.5);
  g.fillStyle = v === 1 ? p.brasa : p.luz;
  g.fillRect(w / 2 - 5, h - 8, 1, 1);
  g.fillRect(w / 2 + 4, h - 10, 1, 1);
  g.fillRect(w / 2 + 1, h - 5, 1, 1);
  if (v === 2) {
    g.fillStyle = p.brasa;
    g.fillRect(w / 2 - 7, h - 6, 1, 1);
    g.fillRect(w / 2 + 6, h - 7, 1, 1);
    g.fillRect(w / 2 - 2, h - 9, 1, 1);
  }
}

// ---- junco: hastes na beira da água --------------------------------------
function junco(g, p, v) {
  const w = 18, h = 24;
  const hastes = v === 2 ? [2, 5, 8, 11, 14, 16] : v === 1 ? [3, 7, 11, 15] : [4, 8, 12, 15, 9];
  hastes.forEach((x, i) => {
    const alt = (v === 2 ? 14 : 10) + ((i * 5) % 9);
    g.strokeStyle = i % 2 ? p.folha : p.folhaEscura;
    g.beginPath();
    g.moveTo(x, h - 1);
    g.lineTo(x + (i % 2 ? 1 : -1), h - 1 - alt);
    g.stroke();
    g.fillStyle = p.tronco;
    g.fillRect(x, h - 3 - alt, 2, 3);
    if (v === 2) {
      g.fillStyle = p.luz;
      g.fillRect(x, h - 5 - alt, 2, 2);
    }
  });
  g.fillStyle = p.sombra;
  g.fillRect(1, h - 2, w - 2, 2);
}

// ---- florada -------------------------------------------------------------
function florada(g, p, v) {
  const  h = 15;
  const flores = v === 2
    ? [[4, 7, p.luz], [8, 4, p.folhaClara], [11, 8, p.brasa], [15, 3, p.luz], [18, 6, p.folhaClara]]
    : v === 1
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
    g.fillRect(x - 0.5, y + 1.5, 0.5, 0.5);
    g.fillRect(x + 1.5, y + 0.5, 0.5, 0.5);
  }
}

// ---- trepadeira: cipó com folha nas paredes e ruínas ---------------------
function trepadeira(g, p, v) {

  g.strokeStyle = p.folhaEscura;
  g.lineWidth = 1;
  g.beginPath();
  g.moveTo(6, 0);
  g.bezierCurveTo(3, 10, 10, 18, 5, 33);
  g.stroke();
  if (v === 2) {
    g.beginPath();
    g.moveTo(10, 0);
    g.bezierCurveTo(12, 12, 5, 20, 9, 33);
    g.stroke();
  }
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
  arvore: { w: 36, h: 46, variantes: 3, quadros: 4, ms: 340, desenhar: folhuda },
  conifera: { w: 26, h: 48, variantes: 3, quadros: 4, ms: 340, desenhar: conifera },
  palmeira: { w: 34, h: 48, variantes: 3, quadros: 4, ms: 340, desenhar: palmeira },
  seca: { w: 26, h: 36, variantes: 3, quadros: 4, ms: 340, desenhar: seca },
  arbusto: { w: 22, h: 18, variantes: 3, quadros: 4, ms: 340, desenhar: arbusto },
  junco: { w: 18, h: 24, variantes: 3, quadros: 4, ms: 340, desenhar: junco },
  florada: { w: 22, h: 15, variantes: 3, quadros: 4, ms: 340, desenhar: florada },
  trepadeira: { w: 14, h: 34, variantes: 3, quadros: 4, ms: 340, desenhar: trepadeira },
};

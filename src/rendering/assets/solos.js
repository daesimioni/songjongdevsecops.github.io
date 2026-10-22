// Grupo solo: marcas de chão que quebram a laje lisa. São decalques baixos,
// desenhados antes das entidades, sem colisão e sem y-sort. Cada um usa só dois
// ou três tons da paleta do bioma, para não competir com o que está em cima.

function mancha(g, p, w, h, cor, alpha = 1) {
  g.globalAlpha = alpha;
  g.fillStyle = cor;
  g.beginPath();
  g.ellipse(w / 2, h / 2, w * 0.36, h * 0.4, 0, 0, Math.PI * 2);
  g.fill();
  g.globalAlpha = 1;
}

function pedra(g, p, v) {
  const w = 20, h = 12;
  mancha(g, p, w, h, p.sombra, 0.5);
  const pontos = v === 2
    ? [[9, 7, 6], [17, 9, 2]]
    : v === 1
    ? [[6, 7, 5], [14, 8, 4]]
    : [[6, 7, 5], [12, 6, 4], [16, 8, 3]];
  for (const [x, y, r] of pontos) {
    g.fillStyle = p.contorno;
    g.beginPath();
    g.ellipse(x, y + 1, r + 1, r * 0.62 + 1, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = p.pedraClara;
    g.beginPath();
    g.ellipse(x, y, r, r * 0.62, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = p.pedra;
    g.beginPath();
    g.ellipse(x, y + 1, r - 1, r * 0.5, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "rgba(255,255,255,0.5)";
    g.fillRect(Math.round(x - r * 0.4), Math.round(y - r * 0.5), 2, 1);
  }
}

function rachadura(g, p, v) {
  const  h = 12;
  g.strokeStyle = p.contorno;
  g.globalAlpha = 0.85;
  g.lineWidth = 1;
  g.beginPath();
  g.moveTo(2, h / 2);
  g.lineTo(8, h / 2 - 2);
  g.lineTo(13, h / 2 + 1);
  g.lineTo(20, h / 2 - 1);
  if (v === 1) {
    g.moveTo(9, h / 2 - 1);
    g.lineTo(11, h / 2 - 4);
  } else if (v === 2) {
    g.moveTo(6, h / 2 - 1);
    g.lineTo(4, h / 2 - 4);
    g.moveTo(14, h / 2);
    g.lineTo(17, h / 2 + 3);
    g.moveTo(11, h / 2 + 1);
    g.lineTo(12, h / 2 + 3);
  }
  g.stroke();
  g.globalAlpha = 1;
  g.fillStyle = p.pedraClara;
  g.globalAlpha = 0.5;
  g.fillRect(3, h / 2 + 1, 5, 1);
  g.globalAlpha = 1;
}

function raiz(g, p, v) {

  g.strokeStyle = p.tronco;
  g.lineWidth = 1;
  const raizes = v === 2
    ? [[9, 11, 2, 6], [11, 11, 19, 7], [10, 11, 10, 3], [8, 10, 15, 10]]
    : v === 1
    ? [[1, 9, 18, 4], [3, 10, 14, 10]]
    : [[2, 10, 20, 5], [4, 8, 12, 11], [6, 9, 18, 8]];
  for (const [x0, y0, x1, y1] of raizes) {
    g.beginPath();
    g.moveTo(x0, y0);
    g.quadraticCurveTo((x0 + x1) / 2, y1 - 2, x1, y1);
    g.stroke();
  }
  g.fillStyle = p.troncoClaro;
  g.fillRect(9, 8, 2, 1);
}

function poca(g, p, v, q = 0) {
  const w = 20, h = 12;
  g.fillStyle = "rgba(46,110,160,0.8)";
  g.beginPath();
  g.ellipse(w / 2, h / 2, 8, 3.2, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "rgba(140,225,255,0.4)";
  g.beginPath();
  g.ellipse(w / 2 - 2, h / 2 - 1, 5, 1.6, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "rgba(255,255,255,0.65)";
  g.fillRect(7, h / 2 - 2, 2, 1);
  if (v === 1) g.fillRect(12, h / 2 + 1, 1, 1);
  if (v === 2) {
    g.fillStyle = "rgba(46,110,160,0.5)";
    g.beginPath();
    g.ellipse(w / 2 + 4, h / 2 + 1, 4, 1.6, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = "rgba(140,225,255,0.35)";
    g.fillRect(13, h / 2, 2, 1);
  }
  // Anéis pequenos na poça, não uma translação do chão inteiro.
  g.strokeStyle='rgba(205,237,249,0.35)';g.lineWidth=.5;g.beginPath();
  g.ellipse(w/2,h/2,2+q*.8,1+q*.25,0,0,Math.PI*2);g.stroke();
}

function tufo(g, p, v, q = 0) {
  const  h = 11;
  const vento = q % 2 ? 0.5 : 0;
  const hastes = v === 2
    ? [2, 4, 6, 8, 11, 13, 15]
    : v === 1
    ? [3, 6, 10, 13]
    : [4, 7, 9, 12, 14];
  for (let i = 0; i < hastes.length; i++) {
    const x = hastes[i];
    g.strokeStyle = i % 2 ? p.folha : p.folhaEscura;
    g.beginPath();
    g.moveTo(x, h - 1);
    g.lineTo(x + (i % 2 ? 1 : -1) + vento, h - (v === 2 ? 5 : 4) - ((i * 3) % 4));
    g.stroke();
  }
  g.fillStyle = p.folhaClara;
  g.fillRect(6, h - 6, 2, 1);
  g.fillRect(11, h - 8, 1, 1);
  if (v === 2) {
    g.fillStyle = p.luz;
    g.fillRect(4, h - 9, 1, 1);
    g.fillRect(13, h - 10, 1, 1);
  }
}

function folhada(g, p, v) {

  for (let i = 0; i < (v === 2 ? 9 : 6); i++) {
    const x = 1 + ((i * 7 + (v === 1 ? 3 : v === 2 ? 5 : 0)) % 18);
    const y = 2 + ((i * 3 + 1) % 6);
    g.fillStyle = i % 3 === 0 ? p.folhaClara : i % 3 === 1 ? p.folha : p.troncoClaro;
    g.fillRect(x, y, 2, 2);
    if (i % 2 === 0) g.fillRect(x + 1, y - 1, 1, 1);
    if (v === 2) g.fillRect(x + (i % 3), y + 2, 1, 1);
  }
}

function cogumelo(g, p, v) {

  const cor = v === 1 ? p.luz : p.folhaClara;
  const copas = v === 2
    ? [[4, 7, 2], [8, 4, 3], [13, 6, 2], [16, 8, 1]]
    : v === 1
    ? [[6, 5, 3], [12, 7, 2]]
    : [[5, 6, 3], [10, 4, 2], [14, 7, 2]];
  for (const [x, y, r] of copas) {
    g.fillStyle = "rgba(255,227,161,0.12)";
    g.beginPath();
    g.ellipse(x, y, r + 3, r + 2, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = p.tecido;
    g.fillRect(x - 1, y, 2, 4);
    g.fillStyle = cor;
    g.beginPath();
    g.ellipse(x, y, r, r * 0.55, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = p.contorno;
    g.fillRect(x - r, y + 1, r * 2, 1);
    g.fillStyle = "rgba(255,255,255,0.45)";
    g.fillRect(x - 1, y - 1, 1, 1);
  }
}

function musgo(g, p, v) {
  const w = 20, h = 10;
  g.globalAlpha = 0.72;
  g.fillStyle = p.folhaEscura;
  g.beginPath();
  g.ellipse(w / 2, h / 2, v === 2 ? 9.5 : 8, v === 2 ? 3.6 : 3, 0, 0, Math.PI * 2);
  g.fill();
  if (v === 2) {
    g.beginPath();
    g.ellipse(w / 2 - 5, h / 2 + 1, 3, 1.6, 0, 0, Math.PI * 2);
    g.fill();
  }
  g.globalAlpha = 1;
  for (let i = 0; i < 7; i++) {
    const x = 2 + ((i * 5 + (v === 1 ? 2 : v === 2 ? 4 : 0)) % 16);
    const y = 2 + ((i * 3) % 5);
    g.fillStyle = i % 2 ? p.folha : p.folhaClara;
    g.fillRect(x, y, 1, 1);
  }
}

export const SOLOS = {
  pedra: { w: 20, h: 12, variantes: 3, desenhar: pedra },
  rachadura: { w: 22, h: 12, variantes: 3, desenhar: rachadura },
  raiz: { w: 22, h: 12, variantes: 3, desenhar: raiz },
  poca: { w: 20, h: 12, variantes: 3, quadros: 4, ms: 240, desenhar: poca },
  tufo: { w: 16, h: 11, variantes: 3, quadros: 2, ms: 420, desenhar: tufo },
  folhada: { w: 20, h: 10, variantes: 3, desenhar: folhada },
  cogumelo: { w: 18, h: 12, variantes: 3, desenhar: cogumelo },
  musgo: { w: 20, h: 10, variantes: 3, desenhar: musgo },
};

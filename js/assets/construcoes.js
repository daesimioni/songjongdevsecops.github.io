// Grupo construção: cabana, casa, torre, ruína, galpão, poço, cerca e doca.
// Cada peça tem sombra, contorno, telhado com textura e uma fonte de luz
// própria (janela, fresta ou archote), para a ilha não parecer um descampado.
// A paleta vem do bioma: giz, cobre, vidro e ébano mudam parede e telha.

function sombra(g, p, w, h, raio = 0.42) {
  g.fillStyle = p.sombra;
  g.beginPath();
  g.ellipse(w / 2, h - 2, w * raio, Math.max(2, h * 0.04), 0, 0, Math.PI * 2);
  g.fill();
}

function janela(g, p, x, y, w = 4, h = 4, acesa = true) {
  g.fillStyle = p.contorno;
  g.fillRect(x - 1, y - 1, w + 2, h + 2);
  g.fillStyle = acesa ? p.luz : p.pedraEscura;
  g.fillRect(x, y, w, h);
  g.fillStyle = p.tronco;
  g.fillRect(x + Math.floor(w / 2), y, 1, h);
  if (acesa) {
    g.fillStyle = "rgba(255,227,161,0.28)";
    g.fillRect(x - 1, y - 1, w + 2, h + 2);
    g.fillStyle = "rgba(255,255,255,0.5)";
    g.fillRect(x + 0.5, y + 0.5, 1, 0.5);
  }
}

function tabuas(g, p, x, y, w, h, cor) {
  g.fillStyle = cor;
  g.fillRect(x, y, w, h);
  g.fillStyle = p.tronco;
  for (let i = 0; i < h; i += 3) g.fillRect(x, y + i, w, 1);
  g.fillStyle = p.madeiraClara;
  g.fillRect(x, y, w, 1);
  g.fillStyle = "rgba(0,0,0,0.12)";
  for (let i = 0; i < w; i += 6) g.fillRect(x + i, y + 1.5, 3, 0.5);
}

function telhado(g, p, x, y, w, h, cor, corClara) {
  g.fillStyle = p.contorno;
  g.fillRect(x - 1, y - 1, w + 2, h + 1);
  g.fillStyle = cor;
  g.fillRect(x, y, w, h);
  // telha em fileira: uma linha clara em cima e escura embaixo de cada fiada
  for (let i = 0; i < h; i += 3) {
    g.fillStyle = corClara;
    g.fillRect(x + (i % 2), y + i, w - (i % 2), 1);
    g.fillStyle = p.contorno;
    g.fillRect(x, y + i + 2, w, 1);
  }
  // brilho de meio pixel na fiada: a telha deixa de ser faixa chapada
  g.fillStyle = "rgba(255,255,255,0.18)";
  for (let i = 0; i < h; i += 3) {
    for (let k = 1; k < w; k += 5) g.fillRect(x + k + (i % 2), y + i + 0.5, 1.5, 0.5);
  }
}

function cabana(g, p, v) {
  const w = 36, h = 30;
  sombra(g, p, w, h);
  tabuas(g, p, 6, h - 14, 24, 13, p.madeira);
  g.fillStyle = p.contorno;
  g.fillRect(4, h - 2, 28, 2);
  g.fillStyle = p.pedra;
  g.fillRect(4, h - 3, 28, 2);
  // telhado de palha em camadas
  g.fillStyle = p.contorno;
  g.beginPath();
  g.moveTo(2, h - 13);
  g.lineTo(18, 2);
  g.lineTo(34, h - 13);
  g.closePath();
  g.fill();
  g.fillStyle = p.telha;
  g.beginPath();
  g.moveTo(4, h - 14);
  g.lineTo(18, 4);
  g.lineTo(32, h - 14);
  g.closePath();
  g.fill();
  g.strokeStyle = p.telhaClara;
  g.lineWidth = 1;
  for (let i = 0; i < 5; i++) {
    const y = 7 + i * 4;
    g.beginPath();
    g.moveTo(18 - (y - 4) * 0.6, y);
    g.lineTo(18 + (y - 4) * 0.6, y);
    g.stroke();
  }
  g.fillStyle = "rgba(255,255,255,0.12)";
  for (let i = 0; i < 7; i++) {
    const y = 7 + i * 3;
    g.fillRect(18 - (y - 4) * 0.55 + 1, y + 0.5, (y - 4) * 0.5, 0.5);
  }
  g.fillStyle = p.contorno;
  g.fillRect(15, h - 10, 7, 9);
  g.fillStyle = p.luz;
  g.fillRect(16, h - 9, 5, 8);
  g.fillStyle = p.tronco;
  g.fillRect(16, h - 4, 5, 1);
  janela(g, p, 7, h - 10, 3, 3, v === 1);
  if (v === 1) {
    g.fillStyle = p.pedra;
    g.fillRect(25, h - 22, 3, 9);
    g.fillStyle = p.pedraClara;
    g.fillRect(25, h - 22, 3, 1);
  }
}

function casa(g, p, v) {
  const w = 44, h = 38;
  sombra(g, p, w, h);
  // parede de pedra e madeira
  g.fillStyle = p.contorno;
  g.fillRect(5, h - 20, 34, 19);
  g.fillStyle = p.pedra;
  g.fillRect(6, h - 19, 32, 18);
  g.fillStyle = p.pedraClara;
  for (let i = 0; i < 4; i++) g.fillRect(7 + i * 8, h - 18, 5, 1);
  g.fillStyle = p.pedraEscura;
  for (let i = 0; i < 6; i++) g.fillRect(6 + i * 5, h - 8, 1, 7);
  g.fillStyle = "rgba(255,255,255,0.12)";
  for (let i = 0; i < 5; i++) g.fillRect(7 + i * 6, h - 17.5, 4, 0.5);
  for (let i = 0; i < 4; i++) g.fillRect(8 + i * 7, h - 11.5, 3, 0.5);
  tabuas(g, p, 6, h - 13, 32, 12, p.madeira);
  // telhado de duas águas
  g.fillStyle = p.contorno;
  g.beginPath();
  g.moveTo(2, h - 20);
  g.lineTo(22, 2);
  g.lineTo(42, h - 20);
  g.closePath();
  g.fill();
  g.fillStyle = p.telha;
  g.beginPath();
  g.moveTo(4, h - 21);
  g.lineTo(22, 4);
  g.lineTo(40, h - 21);
  g.closePath();
  g.fill();
  for (let i = 0; i < 5; i++) {
    const y = 8 + i * 5;
    const meia = (y - 4) * 0.7;
    g.fillStyle = i % 2 ? p.telhaClara : p.telha;
    g.fillRect(Math.round(22 - meia), y, Math.round(meia * 2), 1);
    g.fillStyle = p.contorno;
    g.fillRect(Math.round(22 - meia), y + 2, Math.round(meia * 2), 1);
  }
  // porta e janelas
  g.fillStyle = p.contorno;
  g.fillRect(18, h - 12, 9, 11);
  g.fillStyle = p.madeiraClara;
  g.fillRect(19, h - 11, 7, 10);
  g.fillStyle = p.tronco;
  g.fillRect(19, h - 7, 7, 1);
  g.fillStyle = p.luz;
  g.fillRect(23, h - 8, 1, 1);
  janela(g, p, 9, h - 15, 4, 4);
  janela(g, p, 31, h - 15, 4, 4, v === 1);
  // chaminé
  g.fillStyle = p.contorno;
  g.fillRect(31, 8, 5, 10);
  g.fillStyle = p.pedra;
  g.fillRect(32, 9, 3, 9);
  g.fillStyle = p.pedraClara;
  g.fillRect(32, 9, 3, 1);
}

function torre(g, p, v) {
  const w = 28, h = 52;
  sombra(g, p, w, h, 0.34);
  g.fillStyle = p.contorno;
  g.fillRect(6, 8, 16, h - 10);
  g.fillStyle = p.pedra;
  g.fillRect(7, 9, 14, h - 12);
  g.fillStyle = p.pedraClara;
  for (let i = 0; i < 9; i++) {
    const x = 8 + (i * 7) % 12;
    const y = 12 + (i * 5) % (h - 22);
    g.fillRect(x, y, 3, 1);
  }
  g.fillStyle = p.pedraEscura;
  for (let i = 0; i < 5; i++) g.fillRect(8, 16 + i * 7, 12, 1);
  g.fillStyle = "rgba(255,255,255,0.14)";
  for (let i = 0; i < 5; i++) g.fillRect(9, 15.5 + i * 7, 4, 0.5);
  for (let i = 0; i < 4; i++) g.fillRect(14, 19.5 + i * 7, 3, 0.5);
  // ameias
  g.fillStyle = p.contorno;
  g.fillRect(4, 4, 20, 6);
  g.fillStyle = p.pedra;
  g.fillRect(5, 5, 18, 4);
  g.fillStyle = p.pedraClara;
  g.fillRect(5, 5, 18, 1);
  for (let i = 0; i < 3; i++) {
    g.fillStyle = p.pedraEscura;
    g.fillRect(7 + i * 6, 5, 2, 3);
  }
  janela(g, p, 12, 18, 3, 6, true);
  janela(g, p, 12, 34, 3, 4, v === 1);
  g.fillStyle = p.contorno;
  g.fillRect(11, h - 12, 6, 11);
  g.fillStyle = p.tronco;
  g.fillRect(12, h - 11, 4, 10);
}

function ruina(g, p, v) {
  const w = 42, h = 28;
  sombra(g, p, w, h, 0.4);
  // parede quebrada com arco
  g.fillStyle = p.contorno;
  g.fillRect(4, h - 20, 10, 19);
  g.fillRect(22, h - 14, 14, 13);
  g.fillRect(4, h - 21, 32, 3);
  g.fillStyle = p.pedra;
  g.fillRect(5, h - 19, 8, 18);
  g.fillRect(23, h - 13, 12, 12);
  g.fillRect(5, h - 20, 30, 2);
  g.fillStyle = p.pedraClara;
  g.fillRect(5, h - 20, 30, 1);
  g.fillRect(6, h - 18, 3, 1);
  g.fillRect(24, h - 12, 4, 1);
  // arco entre as duas paredes
  g.strokeStyle = p.pedraEscura;
  g.lineWidth = 2;
  g.beginPath();
  g.arc(20, h - 10, 7, Math.PI, Math.PI * 2);
  g.stroke();
  // entulho
  for (let i = 0; i < 6; i++) {
    const x = 6 + ((i * 7 + (v === 1 ? 3 : 0)) % 30);
    const y = h - 4 + (i % 2);
    g.fillStyle = i % 2 ? p.pedra : p.pedraEscura;
    g.fillRect(x, y, 2 + (i % 3), 2);
  }
  // vegetação tomando a pedra
  g.fillStyle = p.folha;
  g.fillRect(6, h - 21, 3, 2);
  g.fillRect(30, h - 15, 2, 2);
  g.fillStyle = p.folhaClara;
  g.fillRect(7, h - 20, 1, 1);
}

function galpao(g, p, v) {
  const w = 46, h = 32;
  sombra(g, p, w, h);
  tabuas(g, p, 4, h - 16, 38, 15, p.madeira);
  g.fillStyle = p.contorno;
  g.fillRect(3, h - 2, 40, 2);
  // telhado plano inclinado
  telhado(g, p, 3, 8, 40, 10, p.telha, p.telhaClara);
  g.fillStyle = p.contorno;
  g.fillRect(3, 7, 40, 2);
  // porta larga
  g.fillStyle = p.contorno;
  g.fillRect(17, h - 15, 12, 14);
  g.fillStyle = p.tronco;
  g.fillRect(18, h - 14, 10, 13);
  g.fillStyle = p.madeiraClara;
  g.fillRect(18, h - 14, 1, 13);
  g.fillStyle = p.metal;
  g.fillRect(26, h - 8, 1, 2);
  janela(g, p, 7, h - 12, 5, 4, v === 1);
  janela(g, p, 33, h - 12, 5, 4, true);
  // tabuleta do ofício
  g.fillStyle = p.contorno;
  g.fillRect(31, 20, 11, 5);
  g.fillStyle = p.tecido;
  g.fillRect(32, 21, 9, 3);
  g.fillStyle = p.contorno;
  g.fillRect(35, 22, 3, 1);
}

function poco(g, p, v) {
  const w = 22, h = 22;
  sombra(g, p, w, h, 0.4);
  g.fillStyle = p.contorno;
  g.beginPath();
  g.ellipse(w / 2, h - 6, 8, 4, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = p.pedra;
  g.beginPath();
  g.ellipse(w / 2, h - 7, 7, 3.4, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = p.pedraEscura;
  g.beginPath();
  g.ellipse(w / 2, h - 7, 4.6, 2.2, 0, 0, Math.PI * 2);
  g.fill();
  g.fillStyle = "rgba(18,55,84,0.7)";
  g.beginPath();
  g.ellipse(w / 2, h - 7, 3.6, 1.6, 0, 0, Math.PI * 2);
  g.fill();
  // colunas e telhadinho
  g.fillStyle = p.tronco;
  g.fillRect(3, h - 14, 2, 8);
  g.fillRect(w - 5, h - 14, 2, 8);
  g.fillStyle = p.telha;
  g.beginPath();
  g.moveTo(1, h - 14);
  g.lineTo(w / 2, h - 21);
  g.lineTo(w - 1, h - 14);
  g.closePath();
  g.fill();
  g.fillStyle = p.telhaClara;
  g.fillRect(4, h - 16, w - 8, 1);
  // balde
  g.fillStyle = p.metal;
  g.fillRect(w / 2 + 5, h - 12, 3, 3);
  g.fillStyle = p.contorno;
  g.fillRect(w / 2 + 5, h - 9, 3, 1);
  if (v === 1) {
    g.fillStyle = p.folha;
    g.fillRect(2, h - 6, 2, 1);
  }
}

function cerca(g, p, v) {
  const w = 20, h = 14;
  g.fillStyle = p.contorno;
  g.fillRect(2, 2, 2, 12);
  g.fillRect(15, 2, 2, 12);
  g.fillStyle = p.madeira;
  g.fillRect(3, 3, 1, 10);
  g.fillRect(16, 3, 1, 10);
  g.fillStyle = p.tronco;
  g.fillRect(2, 4, 16, 2);
  g.fillRect(2, 9, 16, 2);
  g.fillStyle = p.madeiraClara;
  g.fillRect(2, 4, 16, 1);
  if (v === 1) {
    g.fillStyle = p.folha;
    g.fillRect(6, 6, 2, 1);
  }
}

function doca(g, p, v) {
  const w = 42, h = 20;
  // água por baixo, com espuma
  g.fillStyle = "rgba(46,110,160,0.75)";
  g.fillRect(1, h - 7, 40, 6);
  g.fillStyle = "rgba(220,245,255,0.45)";
  g.fillRect(3, h - 3, 5, 1);
  g.fillRect(20, h - 2, 7, 1);
  g.fillRect(33, h - 4, 4, 1);
  // estacas
  for (const x of [5, 14, 27, 36]) {
    g.fillStyle = p.contorno;
    g.fillRect(x - 1, h - 12, 3, 11);
    g.fillStyle = p.tronco;
    g.fillRect(x, h - 11, 1, 9);
  }
  // tabuleiro
  tabuas(g, p, 2, h - 14, 38, 5, p.madeira);
  g.fillStyle = p.madeiraClara;
  g.fillRect(2, h - 14, 38, 1);
  g.fillStyle = p.contorno;
  for (let i = 0; i < 6; i++) g.fillRect(4 + i * 6, h - 13, 1, 4);
  // corda e argola
  g.strokeStyle = p.tecido;
  g.beginPath();
  g.moveTo(34, h - 14);
  g.quadraticCurveTo(38, h - 10, 36, h - 7);
  g.stroke();
  g.fillStyle = p.metal;
  g.fillRect(35, h - 7, 2, 2);
  if (v === 1) {
    g.fillStyle = p.sombra;
    g.fillRect(8, h - 9, 4, 2);
  }
}

export const CONSTRUCOES = {
  cabana: { w: 36, h: 30, variantes: 2, desenhar: cabana },
  casa: { w: 44, h: 38, variantes: 2, desenhar: casa },
  torre: { w: 28, h: 52, variantes: 2, desenhar: torre },
  ruina: { w: 42, h: 28, variantes: 2, desenhar: ruina },
  galpao: { w: 46, h: 32, variantes: 2, desenhar: galpao },
  poco: { w: 22, h: 22, variantes: 2, desenhar: poco },
  cerca: { w: 20, h: 14, variantes: 2, desenhar: cerca },
  doca: { w: 42, h: 20, variantes: 2, desenhar: doca },
};

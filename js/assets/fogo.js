// Grupo fogo: fogueira, braseiro, tocha, lanterna e fumaça. Todos animam por
// quadro cacheado, então o custo por quadro continua sendo um drawImage. A
// chama muda de forma e de altura, com núcleo claro e brasa embaixo; a fumaça
// sobe e se desfaz.

function chama(g, x, y, largura, altura, quadro, p) {
  const oscila = [0, 1, -1, 0][quadro % 4];
  for (let row = 0; row < altura; row++) {
    const t = row / altura;
    const meia = Math.max(0, Math.round(largura * (1 - t) * (0.55 + 0.45 * Math.sin(quadro + t * 3))));
    if (meia < 1) continue;
    const dx = Math.round(Math.sin(quadro * 1.7 + row * 0.4) * (1 - t) * 1.6) + (row < altura * 0.4 ? oscila : 0);
    g.fillStyle = t < 0.25 ? p.luz : t < 0.55 ? p.fogo : p.brasa;
    g.fillRect(x + dx - meia, y + row, meia * 2, 1);
  }
  g.fillStyle = p.luz;
  g.fillRect(x - 1 + oscila, y + altura - 3, 2, 2);
  g.fillStyle = "rgba(255,255,255,0.75)";
  g.fillRect(x - 0.5 + oscila, y + altura - 2, 1, 1);
  g.fillRect(x + 0.5 + oscila, y + altura - 4, 0.5, 0.5);
}

function brilho(g, x, y, r, cor) {
  const grad = g.createRadialGradient(x, y, 0, x, y, r);
  grad.addColorStop(0, cor);
  grad.addColorStop(1, "rgba(255,120,60,0)");
  g.fillStyle = grad;
  g.fillRect(x - r, y - r, r * 2, r * 2);
}

function fogueira(g, p, _v, quadro) {
  const w = 24, h = 20;
  brilho(g, w / 2, h - 8, 16, "rgba(255,140,70,0.16)");
  // pedras em volta
  for (let i = 0; i < 6; i++) {
    const a = (i / 6) * Math.PI * 2;
    g.fillStyle = i % 2 ? p.pedra : p.pedraEscura;
    g.fillRect(Math.round(w / 2 + Math.cos(a) * 8) - 1, Math.round(h - 4 + Math.sin(a) * 2), 3, 2);
  }
  // lenha cruzada
  g.strokeStyle = p.tronco;
  g.lineWidth = 2;
  g.beginPath();
  g.moveTo(6, h - 4); g.lineTo(18, h - 8);
  g.moveTo(7, h - 8); g.lineTo(17, h - 4);
  g.stroke();
  g.fillStyle = p.brasa;
  g.fillRect(10, h - 7, 4, 2);
  chama(g, w / 2, h - 16, 5, 12, quadro, p);
  // faíscas
  if (quadro % 2 === 0) {
    g.fillStyle = p.luz;
    g.fillRect(w / 2 + 4, h - 17, 1, 1);
    g.fillRect(w / 2 - 5, h - 14, 1, 1);
  }
}

function braseiro(g, p, _v, quadro) {
  const w = 16, h = 22;
  brilho(g, w / 2, h - 12, 13, "rgba(255,140,70,0.14)");
  // tripé
  g.strokeStyle = p.contorno;
  g.lineWidth = 1;
  g.beginPath();
  g.moveTo(3, h - 2); g.lineTo(w / 2, h - 10);
  g.moveTo(w - 3, h - 2); g.lineTo(w / 2, h - 10);
  g.moveTo(w / 2, h - 2); g.lineTo(w / 2, h - 9);
  g.stroke();
  // bacia
  g.fillStyle = p.contorno;
  g.fillRect(3, h - 12, 10, 3);
  g.fillStyle = p.metal;
  g.fillRect(4, h - 12, 8, 2);
  g.fillStyle = p.metalClaro;
  g.fillRect(4, h - 12, 8, 1);
  // brasa e chama
  g.fillStyle = p.brasa;
  g.fillRect(5, h - 13, 6, 2);
  chama(g, w / 2, h - 20, 3.4, 8, quadro, p);
}

function tocha(g, p, _v, quadro) {
  const w = 10, h = 24;
  brilho(g, w / 2, 6, 9, "rgba(255,140,70,0.14)");
  g.fillStyle = p.contorno;
  g.fillRect(w / 2 - 1, 8, 3, 15);
  g.fillStyle = p.tronco;
  g.fillRect(w / 2, 9, 1, 13);
  g.fillStyle = p.metal;
  g.fillRect(w / 2 - 2, 7, 5, 2);
  chama(g, w / 2, 0, 2.6, 8, quadro, p);
}

function lanterna(g, p, _v, quadro) {
  const w = 14, h = 24;
  brilho(g, w / 2, h - 12, 11, "rgba(255,200,120,0.16)");
  g.fillStyle = p.contorno;
  g.fillRect(w / 2 - 1, h - 10, 2, 9);
  g.fillRect(w / 2 - 3, h - 3, 6, 2);
  // caixa de vidro
  g.fillStyle = p.contorno;
  g.fillRect(3, 4, 8, 10);
  g.fillStyle = p.metal;
  g.fillRect(4, 5, 6, 8);
  const pulso = 0.88 + ((quadro % 4) * 0.04);
  g.globalAlpha = pulso;
  g.fillStyle = p.luz;
  g.fillRect(5, 6, 4, 6);
  g.globalAlpha = 1;
  g.fillStyle = "rgba(255,255,255,0.55)";
  g.fillRect(6, 7, 1, 2);
  g.fillStyle = p.metalClaro;
  g.fillRect(3, 3, 8, 1);
  // telhadinho
  g.fillStyle = p.contorno;
  g.fillRect(2, 2, 10, 2);
}

function fumaca(g, p, _v, quadro) {
  const w = 16, h = 30;
  for (let i = 0; i < 5; i++) {
    const fase = (quadro + i) % 6;
    const y = h - 6 - i * 6 - fase;
    const x = w / 2 + Math.sin((quadro + i) * 1.1) * (2 + i * 0.6);
    const r = 1.4 + i * 0.75;
    g.globalAlpha = 0.26 - i * 0.04;
    g.fillStyle = i % 2 ? p.tecido : "#c8c4d8";
    g.beginPath();
    g.ellipse(x, y, r, r, 0, 0, Math.PI * 2);
    g.fill();
  }
  g.globalAlpha = 1;
}

export const FOGOS = {
  fogueira: { w: 24, h: 20, variantes: 1, quadros: 8, ms: 95, desenhar: fogueira },
  braseiro: { w: 16, h: 22, variantes: 1, quadros: 8, ms: 95, desenhar: braseiro },
  tocha: { w: 10, h: 24, variantes: 1, quadros: 6, ms: 85, desenhar: tocha },
  lanterna: { w: 14, h: 24, variantes: 1, quadros: 4, ms: 300, desenhar: lanterna },
  fumaca: { w: 16, h: 30, variantes: 1, quadros: 6, ms: 200, desenhar: fumaca },
};

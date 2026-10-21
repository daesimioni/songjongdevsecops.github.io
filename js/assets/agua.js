// Grupo água: o que fica na beira, não a água em si (essa é tile animado).
// Pedra molhada, junco, espuma e lírio usam o azul da água e o tom da pedra do
// bioma; a espuma anima em três quadros e quebra a linha reta da costa.

function pedraAgua(g, p, v) {
  const w = 20, h = 14;
  g.fillStyle = "rgba(18,55,84,0.55)";
  g.fillRect(1, h - 5, w - 2, 4);
  const pontos = v === 2
    ? [[6, h - 7, 5], [15, h - 5, 2]]
    : v === 1
    ? [[7, h - 6, 4], [14, h - 5, 3]]
    : [[6, h - 6, 4], [12, h - 7, 3], [16, h - 5, 2]];
  for (const [x, y, r] of pontos) {
    g.fillStyle = p.contorno;
    g.beginPath(); g.ellipse(x, y + 1, r + 1, r * 0.7 + 1, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = p.pedra;
    g.beginPath(); g.ellipse(x, y, r, r * 0.7, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = p.pedraClara;
    g.fillRect(Math.round(x - r * 0.4), Math.round(y - r * 0.5), 2, 1);
  }
  g.fillStyle = "rgba(255,255,255,0.34)";
  g.fillRect(2, h - 4, 3, 1);
  g.fillRect(13, h - 3, 2, 1);
  if (v === 2) {
    g.fillStyle = p.folhaEscura;
    g.fillRect(4, h - 9, 3, 1);
    g.fillRect(7, h - 10, 2, 1);
  }
}

function juncoAgua(g, p, v) {
  const w = 22, h = 26;
  g.fillStyle = "rgba(18,55,84,0.5)";
  g.fillRect(2, h - 4, w - 4, 3);
  const hastes = v === 2 ? [3, 6, 8, 11, 14, 17, 20] : v === 1 ? [5, 9, 14, 18] : [4, 7, 12, 16, 20];
  hastes.forEach((x, i) => {
    const alt = (v === 2 ? 13 : 9) + ((i * 6) % 12);
    g.strokeStyle = i % 2 ? p.folha : p.folhaEscura;
    g.beginPath();
    g.moveTo(x, h - 3);
    g.lineTo(x + (i % 2 ? 2 : -1), h - 3 - alt);
    g.stroke();
    g.fillStyle = p.tronco;
    g.fillRect(x + (i % 2 ? 2 : -1), h - 4 - alt, 2, 3);
  });
  if (v === 2) {
    g.fillStyle = p.luz;
    g.fillRect(6, h - 8 - 10, 1, 2);
    g.fillRect(15, h - 6 - 12, 1, 2);
  }
  g.fillStyle = "rgba(255,255,255,0.3)";
  g.fillRect(3, h - 3, 4, 1);
}

function espuma(g, p, _v, quadro) {
  const w = 22, h = 9;
  for (let i = 0; i < 6; i++) {
    const x = 1 + i * 3.5 + (quadro % 6) * 0.5;
    const y = h - 3 - ((i + quadro) % 2);
    g.fillStyle = `rgba(220,245,255,${0.3 + ((i + quadro) % 4) * 0.09})`;
    g.fillRect(x, y, 2.5, 0.5);
    g.fillRect(x + 1, y - 0.5, 0.5, 0.5);
  }
  g.fillStyle = "rgba(18,55,84,0.4)";
  g.fillRect(0, h - 2, w, 2);
}

function lirio(g, p, v) {
  const w = 18, h = 12;
  g.fillStyle = "rgba(18,55,84,0.5)";
  g.fillRect(0, h - 5, w, 4);
  for (let i = 0; i < (v === 2 ? 4 : 3); i++) {
    const x = 1 + i * 4 + (v === 1 ? 1 : 0);
    const y = h - 4 - (i % 2);
    g.fillStyle = p.folhaEscura;
    g.beginPath(); g.ellipse(x, y, 3.4, 1.6, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = p.folha;
    g.beginPath(); g.ellipse(x - 0.5, y - 0.5, 2.6, 1.1, 0, 0, Math.PI * 2); g.fill();
  }
  g.fillStyle = v === 1 ? p.luz : p.brasa;
  g.fillRect(10, h - 9, 2, 2);
  g.fillStyle = p.luz;
  g.fillRect(10, h - 9, 1, 1);
  if (v === 2) {
    g.fillStyle = p.brasa;
    g.fillRect(4, h - 11, 2, 2);
    g.fillStyle = p.luz;
    g.fillRect(4, h - 11, 1, 1);
  }
}

export const AGUAS = {
  pedraAgua: { w: 20, h: 14, variantes: 3, desenhar: pedraAgua },
  juncoAgua: { w: 22, h: 26, variantes: 3, desenhar: juncoAgua },
  espuma: { w: 22, h: 9, variantes: 1, quadros: 6, ms: 200, desenhar: espuma },
  lirio: { w: 18, h: 12, variantes: 3, desenhar: lirio },
};

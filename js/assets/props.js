// Grupo props: o que se carrega, se guarda e se vê de longe. Barril, saco,
// caixote e fardo servem a qualquer ilha (feira, oficina, doca, praça) e
// substituem o enfeite genérico por objeto com volume e sombra. A gaivota
// anima em dois quadros e sobrevoa a costa.

function barril(g, p, v) {
  const w = 16, h = 20;
  g.fillStyle = p.sombra;
  g.beginPath(); g.ellipse(w / 2, h - 2, 6, 2, 0, 0, Math.PI * 2); g.fill();
  // corpo com barriga
  g.fillStyle = p.contorno;
  g.beginPath();
  g.moveTo(3, 4); g.quadraticCurveTo(1, h / 2, 3, h - 2);
  g.lineTo(w - 3, h - 2); g.quadraticCurveTo(w - 1, h / 2, w - 3, 4);
  g.closePath(); g.fill();
  g.fillStyle = p.madeira;
  g.beginPath();
  g.moveTo(4, 5); g.quadraticCurveTo(2, h / 2, 4, h - 3);
  g.lineTo(w - 4, h - 3); g.quadraticCurveTo(w - 2, h / 2, w - 4, 5);
  g.closePath(); g.fill();
  // aduelas
  g.fillStyle = p.tronco;
  for (const x of [5, 8, 11]) g.fillRect(x, 5, 1, h - 8);
  // aros de metal
  g.fillStyle = p.metal;
  g.fillRect(2, 6, w - 4, 2);
  g.fillRect(2, h - 8, w - 4, 2);
  g.fillStyle = p.metalClaro;
  g.fillRect(3, 6, w - 6, 1);
  g.fillRect(3, h - 8, w - 6, 1);
  // tampa
  g.fillStyle = p.contorno;
  g.fillRect(3, 2, w - 6, 3);
  g.fillStyle = p.madeiraClara;
  g.fillRect(4, 3, w - 8, 1);
  if (v === 1) {
    g.fillStyle = p.luz;
    g.fillRect(w - 6, 7, 1, 1);
  }
}

function saco(g, p, v) {
  const w = 16, h = 16;
  g.fillStyle = p.sombra;
  g.beginPath(); g.ellipse(w / 2, h - 2, 6, 2, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = p.contorno;
  g.beginPath();
  g.moveTo(5, 3);
  g.quadraticCurveTo(1, 8, 3, h - 2);
  g.lineTo(w - 3, h - 2);
  g.quadraticCurveTo(w - 1, 8, w - 5, 3);
  g.closePath(); g.fill();
  g.fillStyle = p.tecido;
  g.beginPath();
  g.moveTo(6, 4);
  g.quadraticCurveTo(2, 8, 4, h - 3);
  g.lineTo(w - 4, h - 3);
  g.quadraticCurveTo(w - 2, 8, w - 6, 4);
  g.closePath(); g.fill();
  // amarração do topo
  g.fillStyle = p.tronco;
  g.fillRect(5, 2, 6, 2);
  g.fillStyle = p.madeiraClara;
  g.fillRect(6, 1, 4, 1);
  // dobras
  g.fillStyle = p.madeira;
  g.fillRect(5, 8, 2, 1);
  g.fillRect(w - 7, 10, 2, 1);
  if (v === 1) {
    g.fillStyle = p.metal;
    g.fillRect(7, 7, 2, 2);
  }
}

function caixote(g, p, v) {
  const w = 18, h = 18;
  g.fillStyle = p.sombra;
  g.beginPath(); g.ellipse(w / 2, h - 2, 7, 2, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = p.contorno;
  g.fillRect(2, 3, 14, 14);
  g.fillStyle = p.madeira;
  g.fillRect(3, 4, 12, 12);
  g.fillStyle = p.madeiraClara;
  g.fillRect(3, 4, 12, 1);
  g.fillStyle = p.tronco;
  g.fillRect(3, 8, 12, 1);
  g.fillRect(3, 12, 12, 1);
  g.fillRect(8, 4, 1, 12);
  // cantoneiras
  g.fillStyle = p.metal;
  g.fillRect(3, 4, 1, 12);
  g.fillRect(14, 4, 1, 12);
  if (v === 1) {
    g.fillStyle = p.luz;
    g.fillRect(5, 5, 2, 1);
  }
}

function fardo(g, p, v) {
  const w = 20, h = 15;
  g.fillStyle = p.sombra;
  g.beginPath(); g.ellipse(w / 2, h - 2, 8, 2, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = p.contorno;
  g.beginPath();
  g.moveTo(2, h - 2);
  g.lineTo(4, 4);
  g.quadraticCurveTo(w / 2, 1, w - 4, 4);
  g.lineTo(w - 2, h - 2);
  g.closePath(); g.fill();
  g.fillStyle = p.telha;
  g.beginPath();
  g.moveTo(3, h - 3);
  g.lineTo(5, 5);
  g.quadraticCurveTo(w / 2, 2, w - 5, 5);
  g.lineTo(w - 3, h - 3);
  g.closePath(); g.fill();
  // fios de palha
  g.strokeStyle = p.telhaClara;
  g.lineWidth = 1;
  for (let i = 0; i < 4; i++) {
    g.beginPath();
    g.moveTo(5 + i * 3, h - 4);
    g.lineTo(6 + i * 3, 6);
    g.stroke();
  }
  g.fillStyle = p.tronco;
  g.fillRect(w / 2 - 1, 3, 2, h - 6);
  if (v === 1) {
    g.fillStyle = p.folha;
    g.fillRect(w - 6, h - 6, 2, 1);
  }
}

function gaivota(g, p, _v, quadro) {
  const w = 18, h = 12;
  const asa = [1, 2, 1, 0][quadro % 4];
  g.fillStyle = "rgba(240,245,255,0.92)";
  g.fillRect(w / 2 - 1, h / 2, 3, 2);
  g.fillStyle = "rgba(220,232,248,0.85)";
  g.fillRect(w / 2 - 6, h / 2 + asa, 5, 1);
  g.fillRect(w / 2 + 2, h / 2 + asa, 5, 1);
  g.fillStyle = "rgba(255,200,87,0.9)";
  g.fillRect(w / 2 + 2, h / 2 - 1, 2, 1);
  g.fillStyle = "rgba(20,30,45,0.8)";
  g.fillRect(w / 2 - 1, h / 2 - 1, 1, 1);
}

export const PROPS = {
  barril: { w: 16, h: 20, variantes: 2, desenhar: barril },
  saco: { w: 16, h: 16, variantes: 2, desenhar: saco },
  caixote: { w: 18, h: 18, variantes: 2, desenhar: caixote },
  fardo: { w: 20, h: 15, variantes: 2, desenhar: fardo },
  gaivota: { w: 18, h: 12, variantes: 1, quadros: 4, ms: 210, desenhar: gaivota },
};

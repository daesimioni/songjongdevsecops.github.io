// Grupo props: o que se carrega, se guarda e se vê de longe. Barril, saco,
// caixote e fardo servem a qualquer ilha (feira, oficina, doca, praça) e
// substituem o enfeite genérico por objeto com volume e sombra. A gaivota
// anima em dois quadros e sobrevoa a costa.

function barril(g, p, v) {
  const w = 16, h = 20;
  g.fillStyle = p.sombra;
  g.beginPath(); g.ellipse(w / 2, h - 2, 6, 2, 0, 0, Math.PI * 2); g.fill();
  if (v === 2) {
    // barril deitado com torneira: a adega, não a carga
    g.fillStyle = p.contorno;
    g.beginPath(); g.ellipse(w / 2, h - 5, 7.5, 5, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = p.madeira;
    g.beginPath(); g.ellipse(w / 2, h - 5, 6.5, 4, 0, 0, Math.PI * 2); g.fill();
    g.fillStyle = p.metal;
    g.fillRect(2, h - 8, 1, 6);
    g.fillRect(13, h - 8, 1, 6);
    g.fillStyle = p.metalClaro;
    g.fillRect(2, h - 8, 1, 1);
    g.fillStyle = p.metal;
    g.fillRect(w / 2 + 4, h - 3, 3, 1);
    g.fillStyle = p.tronco;
    g.fillRect(w / 2 + 6, h - 2, 2, 1);
    g.fillStyle = p.luz;
    g.fillRect(w / 2 - 3, h - 7, 2, 1);
    return;
  }
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
  if (v === 2) {
    // saco aberto com grão derramado
    g.fillStyle = p.contorno;
    g.beginPath();
    g.moveTo(4, 4); g.quadraticCurveTo(2, 9, 4, h - 2);
    g.lineTo(w - 4, h - 2); g.quadraticCurveTo(w - 2, 9, w - 4, 4);
    g.closePath(); g.fill();
    g.fillStyle = p.tecido;
    g.beginPath();
    g.moveTo(5, 5); g.quadraticCurveTo(3, 9, 5, h - 3);
    g.lineTo(w - 5, h - 3); g.quadraticCurveTo(w - 3, 9, w - 5, 5);
    g.closePath(); g.fill();
    g.fillStyle = p.contorno;
    g.fillRect(5, 3, w - 10, 2);
    g.fillStyle = p.telhaClara;
    g.fillRect(6, 3, w - 12, 1);
    g.fillStyle = p.telhaClara;
    for (let i = 0; i < 4; i++) g.fillRect(w - 6 + (i % 2), h - 5 + i, 1, 1);
    g.fillStyle = p.luz;
    g.fillRect(w - 7, h - 4, 2, 1);
    return;
  }
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
  if (v === 2) {
    // caixote aberto: garrafa e pano aparecendo
    g.fillStyle = p.contorno;
    g.fillRect(2, 5, 14, 12);
    g.fillStyle = p.madeira;
    g.fillRect(3, 6, 12, 10);
    g.fillStyle = p.madeiraClara;
    g.fillRect(3, 6, 12, 1);
    g.fillStyle = p.tronco;
    g.fillRect(3, 10, 12, 1);
    g.fillRect(3, 14, 12, 1);
    // tampa encostada atrás
    g.fillStyle = p.contorno;
    g.fillRect(3, 1, 12, 5);
    g.fillStyle = p.madeira;
    g.fillRect(4, 2, 10, 3);
    // conteúdo
    g.fillStyle = p.telha;
    g.fillRect(6, 7, 6, 2);
    g.fillStyle = p.luz;
    g.fillRect(7, 8, 2, 1);
    g.fillStyle = p.contorno;
    g.fillRect(11, 6, 2, 4);
    g.fillStyle = p.metal;
    g.fillRect(11, 5, 2, 2);
    return;
  }
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
  if (v === 2) {
    // fardo redondo: rolo de palha amarrado
    g.fillStyle = p.contorno;
    g.beginPath(); g.arc(w / 2, h - 6, 7.5, 0, Math.PI * 2); g.fill();
    g.fillStyle = p.telha;
    g.beginPath(); g.arc(w / 2, h - 6, 6.5, 0, Math.PI * 2); g.fill();
    g.fillStyle = p.telhaClara;
    g.beginPath(); g.arc(w / 2, h - 6, 3.5, 0, Math.PI * 2); g.fill();
    g.fillStyle = p.tronco;
    g.fillRect(w / 2 - 1, h - 14, 2, 2);
    g.fillStyle = p.luz;
    g.fillRect(w / 2 - 4, h - 10, 2, 1);
    return;
  }
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

// mesa de estudo: a casa tem onde sentar, ler e deixar a vela acesa
function mesa(g, p, v) {
  const w = 26, h = 18;
  g.fillStyle = p.sombra;
  g.beginPath(); g.ellipse(w / 2, h - 1, 11, 2.4, 0, 0, Math.PI * 2); g.fill();
  // pernas
  g.fillStyle = p.contorno;
  g.fillRect(5, h - 10, 3, 9);
  g.fillRect(w - 8, h - 10, 3, 9);
  g.fillStyle = p.tronco;
  g.fillRect(6, h - 9, 1, 8);
  g.fillRect(w - 7, h - 9, 1, 8);
  // tampo
  g.fillStyle = p.contorno;
  g.fillRect(1, h - 14, w - 2, 6);
  g.fillStyle = p.madeira;
  g.fillRect(2, h - 13, w - 4, 4);
  g.fillStyle = p.madeiraClara;
  g.fillRect(2, h - 13, w - 4, 1);
  // livro aberto e vela
  g.fillStyle = p.contorno;
  g.fillRect(8, h - 17, 10, 5);
  g.fillStyle = p.luz;
  g.fillRect(9, h - 16, 4, 3);
  g.fillRect(13, h - 16, 4, 3);
  g.fillStyle = p.tronco;
  g.fillRect(12, h - 17, 1, 4);
  g.fillStyle = p.contorno;
  g.fillRect(20, h - 19, 2, 6);
  g.fillStyle = p.luz;
  g.fillRect(20, h - 21, 2, 2);
  if (v === 1) {
    // caneca e papéis: a mesa de quem estuda de verdade
    g.fillStyle = p.metal;
    g.fillRect(4, h - 17, 3, 4);
    g.fillStyle = p.metalClaro;
    g.fillRect(4, h - 17, 3, 1);
    g.fillStyle = p.luz;
    g.fillRect(4, h - 18, 3, 1);
    g.fillStyle = "rgba(240,232,208,0.85)";
    g.fillRect(17, h - 15, 5, 2);
  }
}

// estante: livros, potes e o que a casa guarda
function estante(g, p, v) {
  const w = 20, h = 34;
  g.fillStyle = p.sombra;
  g.beginPath(); g.ellipse(w / 2, h - 1, 8, 2.2, 0, 0, Math.PI * 2); g.fill();
  g.fillStyle = p.contorno;
  g.fillRect(1, 2, w - 2, h - 3);
  g.fillStyle = p.tronco;
  g.fillRect(2, 3, w - 4, h - 5);
  g.fillStyle = p.madeira;
  for (const y of [8, 16, 24]) g.fillRect(3, y, w - 6, 2);
  // livros por prateleira, com cor variando pela semente
  const cores = [p.tecido, p.luz, p.folha, p.metal, p.telha];
  for (let s = 0; s < 3; s++) {
    const base = 6 + s * 8;
    for (let i = 0; i < 5; i++) {
      const cor = cores[(i + s + (v || 0)) % cores.length];
      g.fillStyle = cor;
      g.fillRect(4 + i * 2.6, base - 4, 2, 4);
    }
  }
  if (v === 1) {
    // potes e ervas: a estante da cabana vira armário de preparos
    g.fillStyle = p.luz;
    g.fillRect(4, 26, 3, 3);
    g.fillStyle = p.folha;
    g.fillRect(10, 25, 2, 4);
    g.fillStyle = p.tecido;
    g.fillRect(14, 26, 3, 3);
  }
  g.fillStyle = p.madeiraClara;
  g.fillRect(1, 2, w - 2, 1);
}

// cama: o móvel que faz a casa ser casa, com colchão, travesseiro e manta
function cama(g, p, v) {
  const w = 28, h = 20;
  g.fillStyle = p.sombra;
  g.beginPath(); g.ellipse(w / 2, h - 1, 11, 2.6, 0, 0, Math.PI * 2); g.fill();
  // pés e armação
  g.fillStyle = p.contorno;
  g.fillRect(1, h - 10, w - 2, 9);
  g.fillStyle = p.tronco;
  g.fillRect(2, h - 9, w - 4, 7);
  g.fillStyle = p.madeiraClara;
  g.fillRect(2, h - 9, w - 4, 1);
  // colchão e travesseiro
  g.fillStyle = p.contorno;
  g.fillRect(3, h - 14, w - 6, 5);
  g.fillStyle = "rgba(235,230,214,0.92)";
  g.fillRect(4, h - 13, w - 8, 3);
  g.fillStyle = "rgba(245,242,230,0.95)";
  g.fillRect(5, h - 12, 6, 2);
  g.fillStyle = "rgba(0,0,0,0.10)";
  g.fillRect(4, h - 10, w - 8, 1);
  // manta na metade do pé
  g.fillStyle = v === 1 ? p.tecido : p.telha;
  g.fillRect(w - 15, h - 13, 11, 3);
  g.fillStyle = "rgba(255,255,255,0.16)";
  g.fillRect(w - 15, h - 13, 11, 1);
  g.fillStyle = p.contorno;
  g.fillRect(w - 4, h - 14, 1, 5);
  // cabeceira
  g.fillStyle = p.contorno;
  g.fillRect(1, h - 18, 3, 8);
  g.fillStyle = p.madeira;
  g.fillRect(2, h - 17, 1, 7);
}

export const PROPS = {
  barril: { w: 16, h: 20, variantes: 3, desenhar: barril },
  saco: { w: 16, h: 16, variantes: 3, desenhar: saco },
  caixote: { w: 18, h: 18, variantes: 3, desenhar: caixote },
  fardo: { w: 20, h: 15, variantes: 3, desenhar: fardo },
  mesa: { w: 26, h: 18, variantes: 2, desenhar: mesa },
  cama: { w: 28, h: 20, variantes: 2, desenhar: cama },
  estante: { w: 20, h: 34, variantes: 2, desenhar: estante },
  gaivota: { w: 18, h: 12, variantes: 1, quadros: 4, ms: 210, desenhar: gaivota },
};

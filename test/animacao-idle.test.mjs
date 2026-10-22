// Guarda a animação parada: NPC olha em volta/cabeceia e cada bicho tem um
// tique próprio parado (piscada, cabeça, garganta, brilho, patas, sombra),
// além do passo que alterna as patas. O teste de pixel de verdade roda no
// navegador (`cdp-anim-idle.mjs`); aqui fica a trava de fonte e um canvas de
// mentira que rasteriza o desenho em dois instantes e compara os pixels.
// Roda sem navegador: node test/animacao-idle.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import { drawPetSprite, PET_COLORS } from "../src/rendering/pet-art.js";

const human = fs.readFileSync(new URL("../src/rendering/human.js", import.meta.url), "utf8");
const pet = fs.readFileSync(new URL("../src/rendering/pet-art.js", import.meta.url), "utf8");

const problemas = [];
const check = (ok, msg) => { if (!ok) problemas.push(msg); };

// humano: olhar e cabeceio só quando parado, com fase pelo posto
check(/const olhar = moving \? 0 : Math\.round\(Math\.sin\(time \* 0\.0011 \+ px \* 0\.07 \+ py \* 0\.05\)\)/.test(human), "cabeça não olha em volta");
check(/const cabeceio = !moving && Math\.sin\(time \* 0\.0017 \+ px \* 0\.03 \+ py \* 0\.05\) > 0\.9 \? -1 : 0/.test(human), "cabeça não cabeceia");
check(/ctx\.translate\(ladoDiag \+ olhar, cabeceio\)/.test(human), "olhar/cabeceio não chega ao desenho da cabeça");
check(/const step = moving \? Math\.sin\(time \* 0\.016\) : 0/.test(human), "passo do NPC sumiu");

// gato: pisca e cauda com fase própria
check(/const blink = !moving && Math\.floor\(t \/ 2400\) % 8 === 0/.test(pet), "gato não pisca");
check(/const cauda = Math\.sin\(t \* 0\.006\) \* 1\.6/.test(pet), "cauda do gato parada");
check(/blink \? colors\.body : colors\.eye/.test(pet), "piscada não fecha o olho");

// Canvas de mentira: só as operações que o pet usa, rasterizadas num mapa
// `x,y` -> cor. Retângulos e elipses bastam para comparar dois instantes sem
// navegador; traço (cauda, antena) não entra na contagem de pixel.
function canvasDeMentira() {
  const pixels = new Map();
  const retangulos = [];
  const arcos = [];
  const pilha = [];
  let m = [1, 0, 0, 1, 0, 0];
  let cor = "#000";
  let alfa = 1;
  const ponto = (x, y) => [m[0] * x + m[2] * y + m[4], m[1] * x + m[3] * y + m[5]];
  const pinta = (x, y) => pixels.set(`${x},${y}`, cor);
  const pintaArea = (x0, y0, x1, y1) => {
    for (let y = Math.ceil(y0); y < Math.ceil(y1); y++)
      for (let x = Math.ceil(x0); x < Math.ceil(x1); x++) pinta(x, y);
  };
  const pintaElipse = (cx, cy, rx, ry) => {
    const [px, py] = ponto(cx, cy);
    const ex = Math.abs(rx * Math.hypot(m[0], m[1]));
    const ey = Math.abs(ry * Math.hypot(m[2], m[3]));
    for (let y = Math.floor(py - ey); y <= Math.ceil(py + ey); y++)
      for (let x = Math.floor(px - ex); x <= Math.ceil(px + ex); x++) {
        const dx = (x + .5 - px) / ex, dy = (y + .5 - py) / ey;
        if (dx * dx + dy * dy <= 1) pinta(x, y);
      }
  };
  const ctx = {
    get fillStyle() { return cor; }, set fillStyle(v) { cor = v; },
    get globalAlpha() { return alfa; }, set globalAlpha(v) { alfa = v; },
    save() { pilha.push([m.slice(), cor, alfa]); },
    restore() { const p = pilha.pop(); if (p) { m = p[0]; cor = p[1]; alfa = p[2]; } },
    translate(x, y) { const [px, py] = ponto(x, y); m[4] = px; m[5] = py; },
    scale(x, y) { m[0] *= x; m[1] *= x; m[2] *= y; m[3] *= y; },
    transform(a, b, c, d, e, f) {
      const [a0, b0, c0, d0, e0, f0] = m;
      m = [a0 * a + c0 * b, b0 * a + d0 * b, a0 * c + c0 * d, b0 * c + d0 * d, a0 * e + c0 * f + e0, b0 * e + d0 * f + f0];
    },
    fillRect(x, y, w, h) {
      retangulos.push([x, y, w, h]);
      const a = ponto(x, y), b = ponto(x + w, y + h);
      pintaArea(Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[0], b[0]), Math.max(a[1], b[1]));
    },
    beginPath() {}, closePath() {}, moveTo() {}, lineTo() {}, quadraticCurveTo() {},
    stroke() {}, fill() {},
    ellipse(cx, cy, rx, ry) { pintaElipse(cx, cy, rx, ry); },
    arc(cx, cy, r) { arcos.push([cx, cy, r]); pintaElipse(cx, cy, r, r); },
  };
  return { ctx, pixels, retangulos, arcos };
}

function desenhar(kind, t, moving = false) {
  const canvas = canvasDeMentira();
  drawPetSprite(canvas.ctx, kind, 0, 0, t, moving, 0);
  return canvas;
}

const cores = (pixels, alvo) => [...pixels].filter(([, c]) => c === alvo).length;
const colunas = (pixels, alvo) => [...pixels].filter(([, c]) => c === alvo)
  .map(([p]) => Number(p.split(",")[0])).sort((a, b) => a - b).join(",");
const clarosAbaixo = (pixels, alvo, yMin) => [...pixels].filter(([p, c]) => c === alvo && Number(p.split(",")[1]) >= yMin).length;
const extensaoX = (pixels) => {
  const xs = [...pixels.keys()].map((p) => Number(p.split(",")[0]));
  return Math.max(...xs) - Math.min(...xs);
};
// A perna que esfrega é o retângulo de altura 1 logo abaixo do corpo; a
// largura dela muda quando ela avança sobre a perna de apoio.
const pernasDoGrilo = (canvas) => canvas.retangulos
  .filter(([, y, , h]) => h === 1 && y > -2 && y < 0)
  .map(([x, , w]) => `${x}:${w}`).sort().join("|");
const mudou = (a, b) => a.size !== b.size || [...a].some(([p, c]) => b.get(p) !== c);

// Um sinal por espécie, escolhido para o sobe-e-desce do corpo (bob) não
// falsear: coluna do olho, raio do halo, faixa clara da garganta, largura da
// pata e largura da sombra só mudam se aquela parte animar.
const instantes = {
  cat: [1000, 3000],     // piscada: olho vira corpo entre os dois
  owl: [0, 2500],        // cabeça vira, olho muda de coluna
  frog: [1000, 2000],    // garganta infla, mais pixel claro embaixo
  wisp: [1000, 2000],    // brilho pulsa, raio do halo muda
  cricket: [1000, 2000], // perna esfrega, muda a largura da pata
  parrot: [1000, 2000],  // cabeça balança, olho muda de coluna
  shade: [1000, 2000],   // sombra ondula, muda de largura
};
const sinal = {
  cat: (c) => cores(c.pixels, PET_COLORS.cat.eye),
  owl: (c) => colunas(c.pixels, PET_COLORS.owl.eye),
  frog: (c) => clarosAbaixo(c.pixels, PET_COLORS.frog.light, -2),
  wisp: (c) => c.arcos.at(-1)[2],
  cricket: pernasDoGrilo,
  parrot: (c) => colunas(c.pixels, PET_COLORS.parrot.eye),
  shade: (c) => extensaoX(c.pixels),
};
for (const kind of Object.keys(PET_COLORS)) {
  const [a, b] = instantes[kind];
  const primeiro = desenhar(kind, a), segundo = desenhar(kind, b);
  check(primeiro.pixels.size > 0, `${kind} não desenha nada`);
  check(sinal[kind](primeiro) !== sinal[kind](segundo), `${kind} sem tique próprio parado`);
  check(mudou(primeiro.pixels, segundo.pixels), `${kind} parado não muda entre dois instantes`);
  check(cores(primeiro.pixels, "rgba(2,4,10,0.3)") > 0, `${kind} sem sombra no chão`);
}

// Passo: as patas são os retângulos 1x2 do plano do chão. Em dois instantes
// opostos do seno a pata da frente sobe e a de trás desce, e vice-versa.
const patas = (canvas) => canvas.retangulos
  .filter(([, , w, h]) => w === 1 && h === 2)
  .map(([x, y]) => ({ x, y })).sort((a, b) => a.x - b.x);
for (const kind of ["cat", "frog", "owl", "parrot", "cricket"]) {
  const a = patas(desenhar(kind, 100, true)), b = patas(desenhar(kind, 250, true));
  check(a.length >= 2, `${kind} anda sem patas desenhadas`);
  check(a.length === b.length, `${kind} muda a quantidade de patas ao andar`);
  if (a.length >= 2) {
    check(Math.abs(a[0].y - b[0].y) > .1, `${kind} não mexe a pata ao andar`);
    const primeiro = a[0].y - a[a.length - 1].y;
    const segundo = b[0].y - b[b.length - 1].y;
    check(Math.sign(primeiro) !== Math.sign(segundo), `${kind} não alterna as patas ao andar`);
  }
}
// wisp e shade flutuam: não têm perna para alternar (o shade ondula, mas as
// pontas dele não são passo).

assert.equal(problemas.length, 0, `animação parada com ${problemas.length} problema(s):\n- ${problemas.join("\n- ")}`);
console.log("ok animação parada: NPC olha e cabeceia, gato pisca e mexe a cauda, cada bicho tem tique próprio e as patas alternam ao andar");

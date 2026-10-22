// A pose da diagonal: o boneco tem desenho 3/4 próprio, não é o cardinal com
// um pixel de cabeça. Renderiza as oito direções e compara os pixels.
import assert from "node:assert/strict";
import { createCanvas } from "@napi-rs/canvas";
import { drawHuman } from "../src/rendering/human.js";
import { avatarColors } from "../src/content/avatar.js";
import { outfitColors } from "../src/content/outfits.js";

const cores = { ...outfitColors("viajante"), ...avatarColors({ gender: "f", hair: "longo" }) };
const look = { gender: "f", hair: "longo" };
const LARG = 40, ALT = 60;

function quadro(dir, moving) {
  const canvas = createCanvas(LARG, ALT);
  const ctx = canvas.getContext("2d");
  ctx.save();
  ctx.translate(20, 52);
  drawHuman(ctx, 0, 0, dir, moving, 120, cores, 1, look, null);
  ctx.restore();
  return ctx.getImageData(0, 0, LARG, ALT).data;
}

function diferenca(a, b) {
  let n = 0;
  for (let i = 0; i < a.length; i += 4) {
    if (a[i] !== b[i] || a[i + 1] !== b[i + 1] || a[i + 2] !== b[i + 2] || a[i + 3] !== b[i + 3]) n += 1;
  }
  return n;
}

for (const andando of [false, true]) {
  const q = Array.from({ length: 8 }, (_, dir) => quadro(dir, andando));
  const caso = andando ? "andando" : "parado";
  // cada diagonal difere do cardinal que ela usava antes (o corpo virou 3/4,
  // a cabeça mudou de lado e o ombro de trás sumiu)
  const pares = [
    ["4 contra 1", 4, 1], ["4 contra 0", 4, 0],
    ["5 contra 2", 5, 2], ["5 contra 0", 5, 0],
    ["6 contra 3", 6, 3], ["7 contra 3", 7, 3],
    ["6 contra 7", 6, 7], ["4 contra 5", 4, 5],
  ];
  for (const [nome, a, b] of pares) {
    const d = diferenca(q[a], q[b]);
    assert.ok(d >= 150, `${caso}: ${nome} mudou só ${d} pixels; a diagonal voltou a ser o cardinal`);
  }
}

// a cabeça deslocada dois pixels aparece no código, e o ombro de trás some
const fonte = await import("node:fs").then((m) => m.readFileSync(new URL("../src/rendering/human.js", import.meta.url), "utf8"));
assert.match(fonte, /const diag = ladoDiag !== 0;/, "human.js não marca a diagonal");
assert.match(fonte, /turnTopo = diag \? ladoDiag \* 2\.2/, "tronco sem inclinação na diagonal");
assert.match(fonte, /bracoLonge = diag \? -ladoDiag/, "ombro de trás não some na diagonal");
assert.match(fonte, /diag \? ladoDiag \* 2 : ladoDiag/, "cabeça não vira dois pixels na diagonal");
assert.match(fonte, /if \(base === 3\) \{\n    ctx\.fillStyle = colors\.hair;/, "costas ainda mostram a face");

console.log("ok diagonal: oito poses próprias, 3/4 inclinado e costas com cabelo");

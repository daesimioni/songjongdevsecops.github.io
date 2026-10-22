// Gesto de NPC por papel: guia aponta, monitor ergue a mão, mestre folheia um
// livro. O gesto é desenhado no lugar do braço parado, só com o NPC imóvel, e a
// fase vem do lugar para a praça não gestuar em uníssono. Roda sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";
const { drawHuman } = await import("../src/rendering/human.js");

const colors = {
  skin: "#111111", hair: "#222222", shirt: "#333333",
  pants: "#444444", eyes: "#000000", accent: "#555555",
};

function recorder() {
  const rects = [];
  const noop = () => {};
  const ctx = {
    fillStyle: "#000000",
    fillRect: (x, y, w, h) => rects.push({ x, y, w, h, style: ctx.fillStyle }),
    fill: noop, beginPath: noop, ellipse: noop, moveTo: noop, lineTo: noop,
    closePath: noop, save: noop, restore: noop, translate: noop, scale: noop,
    transform: noop, setTransform: noop, clearRect: noop, drawImage: noop,
    fillText: noop, strokeRect: noop, arc: noop, rect: noop, clip: noop,
  };
  return { ctx, rects };
}

// desenha um NPC parado num instante e devolve o que ele pintou
function pintar(gesture, time, { moving = false, px = 0, py = 0, dir = 0 } = {}) {
  const { ctx, rects } = recorder();
  drawHuman(ctx, px, py, dir, moving, time, colors, 1, null, null, gesture);
  return rects;
}
const todos = (rects) => rects;
const temLivro = (rects) => todos(rects).some((r) => r.style === "#e8e2f6" && r.w === 6 && r.h === 2);
const temMaoErguida = (rects) => todos(rects).some((r) => r.style === colors.skin && r.x >= 4 && r.y <= -15);
const temBracoEsticado = (rects) => todos(rects).some((r) => r.style === colors.shirt && r.w >= 4 && r.y <= -12);

const instantes = [];
for (let t = 0; t <= 14000; t += 100) instantes.push(t);

let livros = 0;
let maos = 0;
let bracos = 0;
let semPapel = 0;
const ativoMestre = [];
const ativoDeslocado = [];
for (const t of instantes) {
  if (temLivro(pintar("mestre", t))) livros++;
  if (temMaoErguida(pintar("monitor", t))) maos++;
  if (temBracoEsticado(pintar("guia", t))) bracos++;
  if (temLivro(pintar(null, t))) semPapel++;
  ativoMestre.push(temLivro(pintar("mestre", t, { px: 0, py: 0 })) ? 1 : 0);
  ativoDeslocado.push(temLivro(pintar("mestre", t, { px: 80, py: 0 })) ? 1 : 0);
}

assert.ok(livros > 0, "mestre nunca folheia o livro");
assert.ok(maos > 0, "monitor nunca ergue a mão");
assert.ok(bracos > 0, "guia nunca aponta o caminho");
assert.equal(semPapel, 0, "NPC sem papel não pode ganhar gesto");
assert.ok(livros < instantes.length, "o mestre não pode gestuar o tempo inteiro");
assert.notDeepEqual(ativoMestre, ativoDeslocado, "a fase do lugar precisa mudar o compasso do gesto");

// andando, o gesto para: o braço volta ao passo normal
let andandoComLivro = 0;
for (const t of instantes) if (temLivro(pintar("mestre", t, { moving: true }))) andandoComLivro++;
assert.equal(andandoComLivro, 0, "NPC andando não pode folhear livro");

// de costas não há gesto: o corpo esconde o braço da frente
let deCostasComLivro = 0;
for (const t of instantes) if (temLivro(pintar("mestre", t, { dir: 3 }))) deCostasComLivro++;
assert.equal(deCostasComLivro, 0, "de costas o gesto não deve aparecer");

// cada papel desenha o gesto que é seu, não o do outro
let mestreComMao = 0;
let monitorComLivro = 0;
for (const t of instantes) {
  if (temMaoErguida(pintar("mestre", t))) mestreComMao++;
  if (temLivro(pintar("monitor", t))) monitorComLivro++;
}
assert.equal(mestreComMao, 0, "mestre não ergue a mão de monitor");
assert.equal(monitorComLivro, 0, "monitor não folheia livro de mestre");

// ---- integração na fonte ----
const human = fs.readFileSync(new URL("../src/rendering/human.js", import.meta.url), "utf8");
const render = fs.readFileSync(new URL("../src/rendering/render.js", import.meta.url), "utf8");
assert.match(human, /export function drawHuman\([^)]*gesture = null\)/, "drawHuman precisa do papel do NPC");
assert.match(render, /npc\.role \|\| null/, "o render precisa passar o papel do NPC");
assert.match(render, /\(npc\.bob\s*\|\|\s*0\)\s*\*\s*4000/, "os NPCs precisam de fase própria no gesto");

console.log("ok gesto: guia aponta, monitor ergue a mao, mestre folheia; so parado, de frente e fora de compasso");

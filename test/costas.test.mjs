// Costas próprias por criatura: o desenho de dir 3 não pode ser igual ao da
// frente, e toda espécie que aparece nas 93 cavernas tem que ter uma.
import assert from "node:assert/strict";
globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} };

const { drawCreature } = await import("../src/rendering/creature.js");
const {CREATURE_MODELS}=await import("../src/rendering/creature-models.js");
const { DUNGEONS, creatureKind } = await import("../src/content/dungeon-data.js");

function desenhar(kind, dir) {
  const ops = [];
  let cor = "#000";
  const ctx = {
    save() {}, restore() {}, translate() {}, scale() {}, transform() {}, beginPath() {}, closePath() {},
    moveTo(x, y) { ops.push(["m", x, y]); },
    lineTo(x, y) { ops.push(["l", x, y]); },
    quadraticCurveTo(...a) { ops.push(["q", ...a]); },
    bezierCurveTo(...a) { ops.push(["b", ...a]); },
    arc(...a) { ops.push(["a", ...a]); },
    ellipse(...a) { ops.push(["e", ...a]); },
    fill() { ops.push(["f", cor]); },
    stroke() { ops.push(["s", cor]); },
    set fillStyle(v) { cor = v; }, get fillStyle() { return cor; },
    set strokeStyle(v) { cor = v; }, get strokeStyle() { return cor; },
    lineWidth: 1, globalAlpha: 1,
    fillRect(x, y, w, h) { ops.push(["r", x, y, w, h, cor, this.globalAlpha]); },
  };
  drawCreature(ctx, kind, "#61f4c0", 1000, 1, dir);
  return ops;
}

const kinds = Object.keys(CREATURE_MODELS);
assert.ok(kinds.length >= 26, `espécies com costas: ${kinds.length}`);
for (const kind of kinds) {
  const frente = desenhar(kind, 0);
  const costas = desenhar(kind, 3);
  assert.ok(frente.length > 3 && costas.length > 3, `${kind} sem desenho`);
  const assinatura = (ops) => ops.map((o) => o.join(":")).join("|");
  assert.notEqual(assinatura(frente), assinatura(costas), `${kind}: costas iguais à frente`);
  // As oito vistas vêm de geometria e oclusão, sem máscara facial retangular.
  assert.equal(new Set(Array.from({length:8},(_,d)=>assinatura(desenhar(kind,d)))).size,8,`${kind}: vista repetida`);
  // de lado e de frente seguem desenhando
  assert.ok(desenhar(kind, 1).length > 3, `${kind} sem lado esquerdo`);
  assert.ok(desenhar(kind, 2).length > 3, `${kind} sem lado direito`);
}

// varredura: toda espécie de monstro das 93 cavernas tem costas
const faltando = new Set();
let monstros = 0;
for (const d of DUNGEONS) {
  (d.monsters || []).forEach((m, i) => {
    monstros++;
    // o desenho recebe o kind calculado pelo nome e pela dificuldade
    const kind = creatureKind(d, m.name, m.tier || 1, i);
    if (!CREATURE_MODELS[kind]) faltando.add(`${kind} (${d.id})`);
  });
  if (d.boss && !CREATURE_MODELS.boss) faltando.add(`boss (${d.id})`);
}
assert.equal(faltando.size, 0, `espécie sem costas: ${[...faltando].slice(0, 5).join(", ")}`);
assert.equal(DUNGEONS.length, 93, `cavernas: ${DUNGEONS.length}`);

console.log(`ok costas: ${kinds.length} espécies com vista de costas, ${DUNGEONS.length} cavernas e ${monstros} monstros cobertos`);

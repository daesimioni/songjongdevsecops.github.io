// O vento tem que ser um lugar, não um tremor por folha: a rajada chega em
// faixa, anda com o tempo e muda de força conforme a pedra da área.
import assert from "node:assert/strict";

const { gustAt, swayAt, ondaAt, espumaAt, windMood } = await import("../src/rendering/wind.js");

const fibra = windMood("fibra");
const cristal = windMood("cristal");
const padrao = windMood(null);

// 1. a rajada passa: no mesmo ponto, o valor muda com o tempo
let min = 1;
let max = 0;
for (let t = 0; t < 20000; t += 50) {
  const g = gustAt(120, 80, t, padrao);
  min = Math.min(min, g);
  max = Math.max(max, g);
}
assert.ok(max > 0.85, `a rajada chega no pico (max ${max.toFixed(2)})`);
assert.ok(min < 0.05, `e passa, deixando calmo (min ${min.toFixed(2)})`);

// 2. bate em várias de uma vez: tiles vizinhos estão na mesma rajada, tiles
//    longe estão em outra fase
const t = 5000;
const centro = gustAt(120, 80, t, padrao);
const vizinho = gustAt(121, 80, t, padrao);
const longe = gustAt(140, 80, t, padrao);
assert.ok(Math.abs(centro - vizinho) < 0.35, "vizinho de 1 tile sente a mesma rajada");
assert.ok(Math.abs(centro - longe) > 0.1, "14 tiles adiante já está em outra parte da frente");

// 3. a frente anda: o instante de pico muda conforme a posição
const picoEm = (x) => {
  let melhorT = 0;
  let melhor = -1;
  for (let tempo = 0; tempo < 30000; tempo += 20) {
    const g = gustAt(x, 80, tempo, padrao);
    if (g > melhor) { melhor = g; melhorT = tempo; }
  }
  return melhorT;
};
assert.ok(picoEm(160) - picoEm(120) > 200, "a rajada leva tempo para atravessar 40 tiles");

// 4. a pedra do lugar muda a força: fibra bate mais que cristal
assert.ok(fibra.forca > cristal.forca * 2, "fibra venta muito mais que cristal");
const mediaFibra = [0, 1, 2, 3, 4, 5].reduce((s, k) => s + gustAt(k * 7, 40, 3000 + k * 400, fibra), 0) / 6;
const mediaCristal = [0, 1, 2, 3, 4, 5].reduce((s, k) => s + gustAt(k * 7, 40, 3000 + k * 400, cristal), 0) / 6;
assert.ok(mediaFibra > mediaCristal, "na prática a área de fibra venta mais");

// 5. o deslocamento lateral tem direção e volta
let esquerda = 0;
let direita = 0;
for (let tempo = 0; tempo < 40000; tempo += 100) {
  const s = swayAt(50, 50, tempo, fibra);
  if (s > 0.2) direita++;
  if (s < -0.2) esquerda++;
}
assert.ok(esquerda > 20 && direita > 20, "a folha verga para os dois lados");

// 6. a onda do mar viaja: a crista muda de lugar
const crista = (tempo) => {
  let melhorX = 0;
  let melhor = -2;
  for (let x = 0; x < 60; x++) {
    const o = ondaAt(x, 10, tempo);
    if (o > melhor) { melhor = o; melhorX = x; }
  }
  return melhorX;
};
assert.notEqual(crista(0), crista(2000), "a crista anda com o tempo");
assert.ok(ondaAt(10, 10, 0) >= -1 && ondaAt(10, 10, 0) <= 1, "a onda fica entre -1 e 1");
assert.ok(espumaAt(10, 10, 0) >= 0 && espumaAt(10, 10, 0) <= 1, "a espuma fica entre 0 e 1");

console.log("ok vento em faixa, rajada andando, onda viajando e força por pedra da área");

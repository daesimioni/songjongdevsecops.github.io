// A câmera é uma só: a mesma escala no vale e na caverna, e o desenho de cada
// quadro preso ao retângulo que a câmera cobre. Roda sem navegador:
// node test/camera.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  ESCALA_MIN, ESCALA_MAX, MARGEM_PADRAO, escalaDaCamera,
  tilesNaVista, dentroDaVista, caixaNaVista, larguraDaVista, alturaDaVista,
} from "../src/core/camera.js";

const problemas = [];
const check = (ok, msg) => { if (!ok) problemas.push(msg); };

// ---- escala: presa entre o piso e o teto, e igual para qualquer cena ----
for (const [vw, vh] of [[390, 844], [800, 600], [1280, 757], [1920, 1080], [2560, 1440]]) {
  const z = escalaDaCamera(vw, vh);
  check(z >= ESCALA_MIN && z <= ESCALA_MAX, `${vw}x${vh}: escala ${z} fora de ${ESCALA_MIN}-${ESCALA_MAX}`);
  check(z === escalaDaCamera(vw, vh), `${vw}x${vh}: escala não determinística`);
}
check(escalaDaCamera(1280, 757) === 2.0, `1280x757 devia dar 2.0, deu ${escalaDaCamera(1280, 757)}`);
check(escalaDaCamera(390, 844) === 1.6, `390x844 devia dar 1.6, deu ${escalaDaCamera(390, 844)}`);

// ---- retângulo da vista: cobre a tela, sobra só a margem e prende no mapa ----
for (const [vw, vh] of [[1280, 757], [390, 844]]) {
  const z = escalaDaCamera(vw, vh);
  const viewW = vw / z;
  const viewH = vh / z;
  const mapaW = 64, mapaH = 48;
  // dentro do mapa, como a câmera do jogo já prende
  const camX = Math.min(200, mapaW * 16 - viewW);
  const camY = Math.min(150, mapaH * 16 - viewH);
  const r = tilesNaVista(camX, camY, viewW, viewH, mapaW, mapaH);
  check(r.x0 * 16 <= camX, `vista não cobre a borda esquerda: ${r.x0}`);
  check((r.x1 + 1) * 16 >= camX + viewW, `vista não cobre a borda direita: ${r.x1}`);
  check(r.y0 * 16 <= camY, `vista não cobre o topo: ${r.y0}`);
  check((r.y1 + 1) * 16 >= camY + viewH, `vista não cobre o fundo: ${r.y1}`);
  // o alinhamento da câmera pode acrescentar um tile de cada lado
  const esperadoW = Math.ceil(viewW / 16) + 2 * MARGEM_PADRAO + 3;
  const esperadoH = Math.ceil(viewH / 16) + 2 * MARGEM_PADRAO + 3;
  check(larguraDaVista(r) <= esperadoW, `largura ${larguraDaVista(r)} acima do teto ${esperadoW}`);
  check(alturaDaVista(r) <= esperadoH, `altura ${alturaDaVista(r)} acima do teto ${esperadoH}`);
}
const borda = tilesNaVista(0, 0, 800, 600, 64, 48);
check(borda.x0 === 0 && borda.y0 === 0, `vista no canto devia começar em 0: ${JSON.stringify(borda)}`);
const fim = tilesNaVista(64 * 16 - 800, 48 * 16 - 600, 800, 600, 64, 48);
check(fim.x1 === 63 && fim.y1 === 47, `vista no fim devia terminar no mapa: ${JSON.stringify(fim)}`);

// ---- quem está fora não é desenhado ----
const r = { x0: 10, y0: 10, x1: 20, y1: 20 };
check(dentroDaVista(10, 10, r) && dentroDaVista(20, 20, r), "dentroDaVista recusou a borda");
check(!dentroDaVista(9, 15, r) && !dentroDaVista(15, 21, r), "dentroDaVista aceitou fora");
check(caixaNaVista(19, 19, 3, 3, r), "caixaNaVista recusou caixa que encosta");
check(!caixaNaVista(21, 21, 2, 2, r), "caixaNaVista aceitou caixa fora");

// ---- a cena não tem escala própria: as duas usam src/core/camera.js ----
const render = fs.readFileSync(new URL("../src/rendering/render.js", import.meta.url), "utf8");
const dungeon = fs.readFileSync(new URL("../src/app/dungeon.js", import.meta.url), "utf8");
check(/from "\.\.\/core\/camera\.js"/.test(render), "render.js não importa a câmera");
check(/from "\.\.\/core\/camera\.js"/.test(dungeon), "dungeon.js não importa a câmera");
check(!/vw \/ \(27 \* TILE\)/.test(dungeon), "dungeon.js ainda tem a escala própria antiga");
check((dungeon.match(/escalaDaCamera\(vw, vh\)/g) || []).length === 1, "dungeon.js não usa escalaDaCamera(vw, vh)");
check((render.match(/escalaDaCamera\(vw, vh\)/g) || []).length === 1, "render.js não usa escalaDaCamera(vw, vh)");
check(/tilesNaVista\(/.test(dungeon), "dungeon.js não prende o desenho à vista");
check(/dentroDaVista\(/.test(dungeon), "dungeon.js não culla o que está fora");
check(/drawImage\(state\.terrain, sx0, sy0, sw, sh, sx0, sy0, sw, sh\)/.test(dungeon), "terreno da caverna não é recortado pela vista");
check(/while \(chunkCache\.size >= 48\)/.test(render), "cache de chão sem o teto de 48 blocos (memória presa em ~12,6 MB)");

assert.equal(problemas.length, 0, `câmera com ${problemas.length} problema(s):\n- ${problemas.join("\n- ")}`);
console.log("ok câmera: escala única, vista presa ao mapa, desenho culling e terreno recortado");

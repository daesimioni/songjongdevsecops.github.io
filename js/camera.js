// A câmera é uma só. A escala do tile é a mesma no vale e na caverna, então o
// mundo não muda de tamanho quando a pessoa desce ou sobe: o tile de 16 px
// fica entre 21 e 26 px na tela em qualquer cena, em qualquer janela.
//
// A escala depende da janela, nunca da cena. E o desenho de cada quadro usa o
// retângulo de tiles que a câmera cobre: o que está longe do jogador não é
// visitado, então memória e processamento crescem com a tela, não com o mapa.
import { TILE } from "./config.js";

export const ESCALA_MIN = 1.3;
export const ESCALA_MAX = 1.6;
// margem em tiles para o que atravessa a borda da tela (copa, fachada, muralha)
export const MARGEM_PADRAO = 2;

export function escalaDaCamera(vw, vh) {
  const z = Math.min(vw / 600, vh / 380);
  return Math.max(ESCALA_MIN, Math.min(ESCALA_MAX, Math.round(z * 4) / 4));
}

// Retângulo de tiles coberto pela câmera, já preso ao mapa e com a margem.
// Devolve em tiles, fechado nos dois lados, para servir de laço direto.
export function tilesNaVista(camX, camY, viewW, viewH, mapW, mapH, margem = MARGEM_PADRAO) {
  const x0 = Math.max(0, Math.floor(camX / TILE) - margem);
  const y0 = Math.max(0, Math.floor(camY / TILE) - margem);
  const x1 = Math.min(mapW - 1, Math.ceil((camX + viewW) / TILE) + margem);
  const y1 = Math.min(mapH - 1, Math.ceil((camY + viewH) / TILE) + margem);
  return { x0, y0, x1, y1 };
}

export function dentroDaVista(x, y, r) {
  return x >= r.x0 && x <= r.x1 && y >= r.y0 && y <= r.y1;
}

// Caixa em tiles: serve para construção, muralha e o que ocupa mais de um tile.
export function caixaNaVista(x, y, largura, altura, r) {
  return x + largura >= r.x0 && x <= r.x1 && y + altura >= r.y0 && y <= r.y1;
}

export function larguraDaVista(r) {
  return r.x1 - r.x0 + 1;
}

export function alturaDaVista(r) {
  return r.y1 - r.y0 + 1;
}

// Biblioteca de assets ambientais, organizada por grupo. Cada grupo mora no
// próprio arquivo e exporta um mapa tipo → { w, h, variantes, quadros?, ms?,
// desenhar }. O desenho nunca acontece direto no quadro: o sprite é pintado
// uma vez por variante e paleta, guardado no cache com teto, e o quadro só
// faz drawImage. É o que permite detalhe sem custo de quadro.
import { criarCache, paletaDaArea, variante, quadroAnimado } from "./nucleo.js";
import { SOLOS } from "./solos.js";
import { VEGETACAO } from "./vegetacao.js";
import { CONSTRUCOES } from "./construcoes.js";
import { FOGOS } from "./fogo.js";
import { AGUAS } from "./agua.js";
import { PROPS } from "./props.js";

export const GRUPOS = {
  solo: SOLOS,
  vegetacao: VEGETACAO,
  construcao: CONSTRUCOES,
  fogo: FOGOS,
  agua: AGUAS,
  props: PROPS,
};

const POR_TIPO = new Map();
for (const [grupo, itens] of Object.entries(GRUPOS)) {
  for (const [tipo, def] of Object.entries(itens)) POR_TIPO.set(tipo, { grupo, ...def });
}

export function assetDe(tipo) { return POR_TIPO.get(tipo) || null; }
export function temAsset(tipo) { return POR_TIPO.has(tipo); }
export function tiposDoGrupo(grupo) { return Object.keys(GRUPOS[grupo] || {}); }
export function totalDeAssets() { return POR_TIPO.size; }

// Teto do cache: 240 sprites cobrem com folga o que cabe numa tela e mantêm a
// memória presa mesmo depois de visitar as 86 ilhas.
const cache = criarCache(240);
// a paleta do bioma é calculada uma vez e reaproveitada; sem isso cada asset
// refazia a mistura de cor a cada quadro
const paletas = new Map();
function paletaDoBioma(bioma) {
  const k = bioma?.id || "generico";
  let p = paletas.get(k);
  if (!p) {
    p = paletaDaArea(bioma);
    paletas.set(k, p);
  }
  return p;
}

// Grupos em que espelhar a peça não quebra leitura: árvore, pedra e barril
// ficam bem de qualquer lado; casa com porta e placa de doca não.
const ESPELHA = new Set(["vegetacao", "props", "agua", "solo"]);

export function desenharAsset(ctx, tipo, x, y, { tempo = 0, bioma = null, seed = 0, camada = "ser", inclinacao = 0 } = {}) {
  const def = POR_TIPO.get(tipo);
  if (!def) return false;
  // construção tem porte próprio: o desenho continua nascendo em 2x, mas ocupa
  // o tamanho de mundo que a casa precisa para caber uma pessoa na porta
  const e = def.escala || 1;
  const dw = def.w * e, dh = def.h * e;
  const p = paletaDoBioma(bioma);
  const v = variante(seed, def.variantes || 1);
  // espelho por instância: três variantes viram seis caras na mesma ilha
  const grupo = POR_TIPO.get(tipo)?.grupo;
  const espelha = ESPELHA.has(grupo) && variante(seed + 17.3, 2) === 1;
  const q = def.quadros ? quadroAnimado(tempo, def.quadros, def.ms || 160) : 0;
  const chave = `${tipo}:${v}:${p.chave}:${q}`;
  // o sprite nasce em 2x: cada pixel antigo vira quatro pixels de desenho, e o
  // quadro copia no mesmo tamanho de mundo. O detalhe de meio pixel aparece.
  const sprite = cache.pegar(chave, def.w * 2, def.h * 2, (g) => {
    g.scale(2, 2);
    def.desenhar(g, p, v, q);
  });
  const dx = Math.round(x - dw / 2);
  const dy = camada === "chao"
    ? Math.round(y - dh / 2)
    : Math.round(y - dh);
  // vegetação verga com a rajada: um cisalhamento no pé, sem redesenhar o
  // sprite nem gastar um quadro de cache por posição de vento
  if (inclinacao && camada !== "chao") {
    ctx.save();
    ctx.translate(x, y);
    ctx.transform(1, 0, inclinacao, 1, 0, 0);
    if (espelha) ctx.scale(-1, 1);
    ctx.drawImage(sprite, -dw / 2, -dh, dw, dh);
    ctx.restore();
    return true;
  }
  if (espelha) {
    ctx.save();
    ctx.translate(Math.round(x), camada === "chao" ? 0 : Math.round(y));
    ctx.scale(-1, 1);
    ctx.drawImage(sprite, -dw / 2, camada === "chao" ? dy : -dh, dw, dh);
    ctx.restore();
    return true;
  }
  ctx.drawImage(sprite, dx, dy, dw, dh);
  return true;
}

// tamanho de mundo de uma peça, já com a escala de construção; quem coloca a
// peça usa isto para reservar folga em vez de adivinhar pelo desenho
export function tamanhoDoAsset(tipo) {
  const def = POR_TIPO.get(tipo);
  if (!def) return null;
  const e = def.escala || 1;
  return { w: def.w * e, h: def.h * e };
}

export function cacheDeAssets() { return cache; }

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

export function desenharAsset(ctx, tipo, x, y, { tempo = 0, bioma = null, seed = 0, camada = "ser" } = {}) {
  const def = POR_TIPO.get(tipo);
  if (!def) return false;
  const p = paletaDoBioma(bioma);
  const v = variante(seed, def.variantes || 1);
  const q = def.quadros ? quadroAnimado(tempo, def.quadros, def.ms || 160) : 0;
  const chave = `${tipo}:${v}:${p.chave}:${q}`;
  const sprite = cache.pegar(chave, def.w, def.h, (g) => def.desenhar(g, p, v, q));
  const dx = Math.round(x - def.w / 2);
  const dy = camada === "chao"
    ? Math.round(y - def.h / 2)
    : Math.round(y - def.h);
  ctx.drawImage(sprite, dx, dy);
  return true;
}

export function cacheDeAssets() { return cache; }

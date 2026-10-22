// Famílias do bestiário: agrupam as formas de criatura pelo jeito de lutar.
// Conhecer todas as espécies de uma família rende +50% de dano contra ela, o
// laço que faz o bestiário valer no combate, não só na coleção.
export const FAMILIAS = [
  { id: "gelatinosos", nome: "Gelatinosos", desc: "se recompõem quando você erra", kinds: ["slime", "jelly", "atom", "flask"] },
  { id: "alados", nome: "Alados", desc: "batem de novo quando você erra", kinds: ["bat", "moth", "wisp", "note", "imp"] },
  { id: "cascudos", nome: "Cascudos", desc: "comem 1 de dano de cada acerto", kinds: ["scorpion", "golem", "beetle", "crab", "sentinel", "crystal", "gear", "tome"] },
  { id: "rastejantes", nome: "Rastejantes", desc: "desviam e atacam em fila", kinds: ["spider", "ant", "serpent", "node", "vector"] },
  { id: "olhos", nome: "Olhos", desc: "enxergam longe e desviam", kinds: ["eye", "glyph", "prism"] },
];

export const FAMILIA_POR_ID = new Map(FAMILIAS.map((familia) => [familia.id, familia]));
export const FAMILIA_POR_KIND = new Map();
for (const familia of FAMILIAS) {
  for (const kind of familia.kinds) FAMILIA_POR_KIND.set(kind, familia);
}

export function familiaDeKind(kind) {
  return FAMILIA_POR_KIND.get(String(kind || "").toLowerCase()) || null;
}

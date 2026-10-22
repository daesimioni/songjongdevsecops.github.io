// O clima muda a caçada: a chuva traz o que vive molhado, a neblina o que some
// da vista, a rajada o que voa. A troca é determinística e só mexe no elenco do
// próprio continente; sala, posto, tier e dificuldade continuam iguais.
export const CLIMA_CAÇADA = {
  chuva: ["jelly", "crab", "slime", "serpent"],
  neblina: ["moth", "wisp", "eye", "glyph"],
  rajada: ["bat", "vector", "ant", "node"],
};

// Devolve o nome do bicho para o posto `indice`. Sem clima (ou sem bicho que
// combine), cai no rodízio normal da caverna.
export function nomeDaCacada(nomes, indice, tier, clima, kindOf) {
  const lista = Array.isArray(nomes) ? nomes.filter(Boolean) : [];
  if (!lista.length) return "";
  const base = lista[((indice % lista.length) + lista.length) % lista.length];
  const pref = CLIMA_CAÇADA[clima];
  if (!pref || !pref.length || typeof kindOf !== "function") return base;
  for (let k = 0; k < lista.length; k++) {
    const nome = lista[(indice + k) % lista.length];
    if (pref.includes(kindOf(nome, tier))) return nome;
  }
  return base;
}

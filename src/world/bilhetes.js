// Bilhete na parede: a cidade subterrânea guarda uma nota com o que a área
// ensina. Sai da própria lição da área quando existe, da relíquia quando não,
// e de uma linha do lugar no caso das sete cavernas antigas.
import { LICOES } from "../content/text/licoes.js";
import { RELICS, ITEMS } from "../content/rpg-data.js";

const limpar = (texto) => String(texto || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

function cortar(texto, limite = 240) {
  const limpo = limpar(texto);
  if (limpo.length <= limite) return limpo;
  const corte = limpo.slice(0, limite);
  const fim = Math.max(corte.lastIndexOf(". "), corte.lastIndexOf("; "), corte.lastIndexOf(", "));
  return `${(fim > 80 ? corte.slice(0, fim + 1) : corte).trim()}…`;
}

export function bilheteDaCaverna({ areaId = "", nome = "", material = "", continente = "" } = {}) {
  const porArea = LICOES[areaId];
  if (porArea) {
    const estacao = Object.keys(porArea)[0];
    const licao = porArea[estacao];
    const texto = licao?.levar || licao?.quebra || "";
    if (limpar(texto)) return { titulo: `Bilhete de ${estacao}`, texto: cortar(texto) };
  }
  const reliquia = RELICS[areaId];
  if (reliquia?.desc && limpar(reliquia.desc)) {
    return { titulo: `Bilhete sobre ${reliquia.name}`, texto: cortar(reliquia.desc) };
  }
  const materialNome = ITEMS[material]?.name || material || "o que a pedra dá";
  const lugar = nome || "esta caverna";
  if (!lugar) return null;
  return {
    titulo: `Bilhete de ${lugar}`,
    texto: cortar(`Quem desce a ${lugar} volta com ${materialNome} nas mãos e uma pergunta na cabeça. A pergunta vale mais: a pedra só guarda o que alguém já pensou.`),
  };
}

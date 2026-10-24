// Bilhete na parede: a cidade subterrânea guarda uma nota do lugar e do que a
// caverna deixou. Sai da relíquia da área quando existe; se não, do material e
// do nome da caverna. Nada de lição, nada de pergunta.
import { RELICS, ITEMS } from "../content/rpg-data.js";

const limpar = (texto) => String(texto || "").replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();

function cortar(texto, limite = 240) {
  const limpo = limpar(texto);
  if (limpo.length <= limite) return limpo;
  const corte = limpo.slice(0, limite);
  const fim = Math.max(corte.lastIndexOf(". "), corte.lastIndexOf("; "), corte.lastIndexOf(", "));
  return `${(fim > 80 ? corte.slice(0, fim + 1) : corte).trim()}…`;
}

const FECHOS = [
  "A maré sobe antes de o sol cair. Não confie no caminho de volta.",
  "Quem escreveu isto desceu com corda e subiu sem ela.",
  "O que brilha no fundo não é ouro. É paciência.",
  "A pedra guarda o que a gente esquece. Leve só o necessário.",
  "Se ouvir alguém chamar pelo seu nome, não responda.",
];

const hash = (texto) => {
  let h = 2166136261;
  for (let i = 0; i < String(texto).length; i++) h = Math.imul(h ^ String(texto).charCodeAt(i), 16777619);
  return h >>> 0;
};

export function bilheteDaCaverna({ areaId = "", nome = "", material = "", continente = "" } = {}) {
  const lugar = nome || "esta caverna";
  const reliquia = RELICS[areaId];
  const materialNome = ITEMS[material]?.name || material || "o que a pedra dá";
  const fecho = FECHOS[hash(`${areaId}|${continente}|${material}`) % FECHOS.length];
  if (reliquia?.desc) {
    return {
      titulo: `Bilhete sobre ${reliquia.name}`,
      texto: cortar(`${reliquia.desc} ${fecho}`),
    };
  }
  return {
    titulo: `Bilhete de ${lugar}`,
    texto: cortar(`Quem desce a ${lugar} volta com ${materialNome} nas mãos e uma história na cabeça. ${fecho}`),
  };
}

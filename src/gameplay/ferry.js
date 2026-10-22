// Ferry do Porto: a travessia paga entre o porto e o Porto Submerso. O barqueiro
// cobra madeira para o casco e conta uma história; a regra é pura para o teste
// não depender do DOM.
import { ITEMS } from "../content/rpg-data.js";

export const FERRY = {
  nome: "Ferry do Porto",
  destino: "Porto Submerso",
  material: "madeira",
  custo: 2,
};

export function nomeDoMaterial() {
  return ITEMS[FERRY.material]?.name || FERRY.material;
}

export function precoDoFerry() {
  return `${FERRY.custo} de ${nomeDoMaterial().toLowerCase()}`;
}

export function podePagarFerry(itens = {}) {
  return (Number(itens?.[FERRY.material]) || 0) >= FERRY.custo;
}

export function faltaDoFerry(itens = {}) {
  return Math.max(0, FERRY.custo - (Number(itens?.[FERRY.material]) || 0));
}

// Debita direto no mapa de itens do save; quem chama cuida do rpg.save().
export function cobrarFerry(itens) {
  if (!itens || typeof itens !== "object" || !podePagarFerry(itens)) return false;
  const restante = (Number(itens[FERRY.material]) || 0) - FERRY.custo;
  if (restante > 0) itens[FERRY.material] = restante;
  else delete itens[FERRY.material];
  return true;
}

const FALAS_DO_BARQUEIRO = [
  "O barqueiro diz que o Porto Submerso cresceu debaixo do mar, onde a maré não alcança.",
  "Na travessia, ele conta que as capitais se ligam por túneis mais antigos que o vale.",
  "Ele fala baixo do contrabando que passa por baixo das pontes e some na camada -2.",
];

export function falaDoBarqueiro(n = 0) {
  return FALAS_DO_BARQUEIRO[Math.abs(Math.floor(Number(n) || 0)) % FALAS_DO_BARQUEIRO.length];
}

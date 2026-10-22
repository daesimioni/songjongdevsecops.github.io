// Variantes de criatura: a mesma espécie do bestiário, com um tempero a mais.
// A escolha é determinística pelo id da caverna e da sala, então a mesma
// descida nasce igual para todo mundo e o teste consegue cobrar a conta.
export const VARIANTES = [
  {
    id: "eco", nome: "Eco", chance: 10, prefixo: "Eco de", sufixo: "",
    hpMult: 1, danoExtra: 0, xpMult: 1, lootMult: 2, accent: "#6bd5ff",
    desc: "a sobra de uma descida antiga: dobra o material",
  },
  {
    id: "elite", nome: "Elite", chance: 5, prefixo: "", sufixo: "Elite",
    hpMult: 1.5, danoExtra: 1, xpMult: 1.5, lootMult: 1, accent: "#ffc857",
    desc: "vida 50% maior, +1 de dano e 50% mais XP",
  },
  {
    id: "antiga", nome: "Antiga", chance: 3, prefixo: "", sufixo: "Antiga",
    hpMult: 2, danoExtra: 1, xpMult: 2, lootMult: 2, accent: "#b48cff",
    desc: "vida dobrada, +1 de dano, XP e material em dobro",
  },
];

export const VARIANTE_POR_ID = new Map(VARIANTES.map((v) => [v.id, v]));

export function hashVariante(texto) {
  let h = 0;
  for (const ch of String(texto || "")) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return h;
}

// Devolve a variante daquela sala ou null. As chances somam 18 de 100.
export function varianteDe(chave) {
  const h = hashVariante(chave) % 100;
  let acumulado = 0;
  for (const variante of VARIANTES) {
    acumulado += variante.chance;
    if (h < acumulado) return variante;
  }
  return null;
}

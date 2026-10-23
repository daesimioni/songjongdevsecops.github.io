// As cinco vocações e as três subcategorias de cada uma. A vocação não muda o
// currículo: muda como se luta, coleta e anda. Todos os multiplicadores partem
// de 1,00 e cada ganho é pago por uma fraqueza (ver docs/design/15-VOCACOES.md).

export const VOCACOES = [
  {
    id: "mago",
    name: "Mago",
    forca: "mana alta e magia de dano a distância",
    fraqueza: "vida baixa e dependência de mana",
    mult: { vida: 0.8, mana: 1.6, dano: 1.1, sofrido: 1, alcance: 1, furtividade: 1, coleta: 1, pet: 1 },
    subs: [
      { id: "arcanista", name: "Arcanista", efeito: "cada 3 acertos curam 1 de vida", desc: "cura e escudo: a magia que protege" },
      { id: "bruxo", name: "Bruxo", efeito: "acerto envenena: +1 no próximo acerto", desc: "dano e maldição: a magia que cobra" },
      { id: "ilusionista", name: "Ilusionista", efeito: "o bicho enxerga 20% menos longe", desc: "confunde: a magia que esconde" },
    ],
  },
  {
    id: "guerreiro",
    name: "Guerreiro",
    forca: "vida alta e dano físico forte",
    fraqueza: "lento, visão curta e mana baixa",
    mult: { vida: 1.35, mana: 0.6, dano: 1.2, sofrido: 0.8, alcance: 0.85, furtividade: 0.9, coleta: 0.9, pet: 1 },
    subs: [
      { id: "baluarte", name: "Baluarte", efeito: "cada golpe sofrido tira 1 a menos", desc: "escudo: aguenta e volta" },
      { id: "barbaro", name: "Bárbaro", efeito: "sem armadura o acerto vale +1 e o sofrido +2", desc: "dano: sem casco, sem freio" },
      { id: "campeao", name: "Campeão", efeito: "+20% de XP no combate", desc: "provoca: briga que rende" },
    ],
  },
  {
    id: "atirador",
    name: "Atirador",
    forca: "alcance grande: vê e é visto de longe",
    fraqueza: "vida baixa e dano ruim de perto",
    mult: { vida: 0.85, mana: 1, dano: 1.15, sofrido: 1.1, alcance: 1.45, furtividade: 1.1, coleta: 1.05, pet: 1 },
    subs: [
      { id: "besteiro", name: "Besteiro", efeito: "acerto seguido de acerto soma +1", desc: "precisão: dois no mesmo lugar" },
      { id: "cacador", name: "Caçador de recompensa", efeito: "a caçada rende um item extra", desc: "marca antes da luta" },
      { id: "alquimista", name: "Alquimista de campo", efeito: "frascos e bombas curam 1 a mais", desc: "troca mana por dano em área" },
    ],
  },
  {
    id: "assassino",
    name: "Assassino",
    forca: "furtividade alta e primeiro acerto forte",
    fraqueza: "vida baixa e luta longa é ruim",
    mult: { vida: 0.85, mana: 1, dano: 1.1, sofrido: 1.1, alcance: 1, furtividade: 1.6, coleta: 1.1, pet: 1 },
    subs: [
      { id: "ladrao", name: "Ladrão", efeito: "abre baú selado sem gastar chave", desc: "chaves e baús: o cofre é seu" },
      { id: "veneno", name: "Veneno", efeito: "o acerto deixa 1 de veneno, que cai dois segundos depois", desc: "corrói devagar" },
      { id: "sombra", name: "Sombra", efeito: "primeiro acerto vale o dobro se o bicho não viu", desc: "o golpe que ninguém viu" },
    ],
  },
  {
    id: "selvagem",
    name: "Selvagem",
    forca: "coleta muito melhor e pet forte",
    fraqueza: "mana baixa e o pet ocupa espaço",
    mult: { vida: 1.05, mana: 0.8, dano: 1, sofrido: 1.05, alcance: 1.1, furtividade: 1.05, coleta: 1.45, pet: 1.5 },
    subs: [
      { id: "domador", name: "Domador", efeito: "o pet luta no seu lugar uma vez", desc: "duas habilidades no pet" },
      { id: "ervanario", name: "Ervanário", efeito: "coleta raro com mais frequência", desc: "poção melhor" },
      { id: "rastreador", name: "Rastreador", efeito: "revela bicho e veio no minimapa num raio maior", desc: "lê o mato" },
    ],
  },
];

// save antigo não tem vocação: fica neutro (multiplicador 1) até escolher na
// mesa. A criação não deixa entrar sem escolher, então isto só vale para quem
// já jogava antes.
export const VOCACAO_NEUTRA = {
  id: "",
  name: "Sem vocação",
  forca: "nenhuma ainda",
  fraqueza: "nenhuma ainda",
  mult: { vida: 1, mana: 1, dano: 1, sofrido: 1, alcance: 1, furtividade: 1, coleta: 1, pet: 1 },
  subs: [],
};
export const VOCACAO_PADRAO = "";

export const VOC_POR_ID = new Map(VOCACOES.map((v) => [v.id, v]));
export const SUB_POR_ID = new Map(VOCACOES.flatMap((v) => v.subs.map((s) => [s.id, { ...s, vocacao: v.id }])));

export function vocacaoDe(id) {
  return VOC_POR_ID.get(id) || VOCACAO_NEUTRA;
}

export function subcategoriaDe(id) {
  return SUB_POR_ID.get(id) || null;
}

// multiplicadores prontos, sempre com 1 onde não houver regra
export function multDe(id) {
  const base = { vida: 1, mana: 1, dano: 1, sofrido: 1, alcance: 1, furtividade: 1, coleta: 1, pet: 1 };
  return { ...base, ...(vocacaoDe(id).mult || {}) };
}


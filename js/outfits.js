// Trajes do aventureiro. A roupa é uma escolha da pessoa, não do lugar: o mapa
// de cima e a caverna leem o mesmo objeto de cores.
import { AREA_OUTFITS } from "./identity.js";

export const OUTFITS = [
  {
    id: "viajante",
    name: "Viajante",
    continent: "hub",
    desc: "o traje de quem acabou de chegar",
    colors: { hair: "#3a2a55", skin: "#f0c9a8", shirt: "#61f4c0", pants: "#2f3a66", accent: "#fff3d1" },
  },
  {
    id: "camiseta",
    name: "Camiseta",
    continent: "hub",
    desc: "a roupa de todo dia, sem cerimônia",
    colors: { hair: "#3a2a55", skin: "#f0c9a8", shirt: "#ece8ff", pants: "#3a4466", accent: "#61f4c0" },
  },
  {
    id: "avental",
    name: "Avental",
    continent: "hub",
    desc: "pano de oficina, bolso fundo",
    colors: { hair: "#3a2a55", skin: "#f0c9a8", shirt: "#8a8fb5", pants: "#2f3a66", accent: "#ffc857" },
  },
  {
    id: "casaco",
    name: "Casaco",
    continent: "hub",
    desc: "para quem viaja de madrugada",
    colors: { hair: "#3a2a55", skin: "#f0c9a8", shirt: "#3a4466", pants: "#1b1c2c", accent: "#6bd5ff" },
  },
  // os trajes que não se compram: só saem de missão concluída
  {
    id: "faroleiro",
    name: "Faroleiro",
    quest: "sete-farois",
    desc: "acendeu os sete faróis e ficou com a luz no ombro",
    colors: { shirt: "#ffc857", pants: "#3a2a33", accent: "#fff3d1", trim: "#8a5a1a" },
  },
  {
    id: "cacador",
    name: "Caçador",
    quest: "cacador",
    desc: "couro gasto de quem já respondeu muita pergunta no escuro",
    colors: { shirt: "#8a6a4a", pants: "#2b2118", accent: "#ffc857", trim: "#5c4028" },
  },
  {
    id: "prisma",
    name: "Traje de Prisma",
    quest: "branco-e-multidao",
    desc: "a luz entra branca e sai colorida, e o pano lembra o caminho",
    colors: { shirt: "#ff7aa8", pants: "#2a2340", accent: "#6bd5ff", trim: "#b48cff" },
  },
  {
    id: "chaveiro",
    name: "Chaveiro",
    quest: "segredo-em-publico",
    desc: "bolsos fundos para chaves que ninguém deve ver",
    colors: { shirt: "#243b32", pants: "#1b1c2c", accent: "#ffc857", trim: "#7ee787" },
  },
  {
    id: "capote",
    name: "Capote do Vale",
    quest: "vale-das-letras",
    desc: "pano de quem atravessou o vale inteiro e voltou falando",
    colors: { shirt: "#e8c07a", pants: "#4a3a22", accent: "#fff3d1", trim: "#8a7440" },
  },
  {
    id: "silicio",
    name: "Aprendiz de Silício",
    continent: "cs",
    desc: "fios de cobre e areia que pensa",
    colors: { hair: "#22304a", skin: "#e8b98c", shirt: "#3fd6b0", pants: "#1c2b45", accent: "#ffc857", trim: "#2a7f8f" },
  },
  {
    id: "geometra",
    name: "Geômetra",
    continent: "math",
    desc: "linhas exatas e pó de giz",
    colors: { hair: "#4a2a5c", skin: "#f4d6b8", shirt: "#b48cff", pants: "#302a56", accent: "#fff3d1", trim: "#6b5aa8" },
  },
  {
    id: "luz",
    name: "Mecânico de Luz",
    continent: "physics",
    desc: "lentes, ondas e um cinto de ferramentas",
    colors: { hair: "#5c2a22", skin: "#d9a273", shirt: "#ff8a6b", pants: "#333048", accent: "#6bd5ff", trim: "#a8452f" },
  },
  {
    id: "alquimista",
    name: "Alquimista",
    continent: "chem",
    desc: "vidro âmbar e mãos que não tremem",
    colors: { hair: "#1f4a33", skin: "#e8b98c", shirt: "#7ee787", pants: "#243b32", accent: "#ffc857", trim: "#3f7a52" },
  },
  {
    id: "maestro",
    name: "Maestro",
    continent: "music",
    desc: "casaca curta e ouvido treinado",
    colors: { hair: "#3a2438", skin: "#f0c9a8", shirt: "#ffb26b", pants: "#2b2140", accent: "#ff7aa8", trim: "#8a4a2a" },
  },
  {
    id: "trovador",
    name: "Trovador do Vale",
    continent: "lingua",
    desc: "verso no bolso e a frase certa na ponta da língua",
    colors: { hair: "#3a2a55", skin: "#f0c9a8", shirt: "#e8c07a", pants: "#4a3a22", accent: "#ff7aa8", trim: "#8a7440" },
  },
  {
    id: "adivinho",
    name: "Adivinho de Dados",
    continent: "ai",
    desc: "vetores no bolso e um olho no futuro",
    colors: { hair: "#1f2a4a", skin: "#c68a5e", shirt: "#6bd5ff", pants: "#202a48", accent: "#b48cff", trim: "#2f6a8a" },
  },
];

// um traje por área, aberto pela trilha de estações daquela área
OUTFITS.push(...AREA_OUTFITS);

export function outfitById(id) {
  return OUTFITS.find((outfit) => outfit.id === id) || OUTFITS[0];
}

export function outfitColors(id) {
  return { ...outfitById(id).colors };
}

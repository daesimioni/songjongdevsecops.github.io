// Trajes do aventureiro. A roupa é uma escolha da pessoa, não do lugar: o mapa
// de cima e a caverna leem o mesmo objeto de cores.
export const OUTFITS = [
  {
    id: "viajante",
    name: "Viajante",
    continent: "hub",
    desc: "o traje de quem acabou de chegar",
    colors: { hair: "#3a2a55", skin: "#f0c9a8", shirt: "#61f4c0", pants: "#2f3a66", accent: "#fff3d1" },
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
    id: "adivinho",
    name: "Adivinho de Dados",
    continent: "ai",
    desc: "vetores no bolso e um olho no futuro",
    colors: { hair: "#1f2a4a", skin: "#c68a5e", shirt: "#6bd5ff", pants: "#202a48", accent: "#b48cff", trim: "#2f6a8a" },
  },
];

export function outfitById(id) {
  return OUTFITS.find((outfit) => outfit.id === id) || OUTFITS[0];
}

export function outfitColors(id) {
  return { ...outfitById(id).colors };
}

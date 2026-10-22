// O personagem: gênero, cabelo e as cores do corpo. O traje decide a roupa de
// continente; o resto é escolha da pessoa, feita na primeira entrada e trocada
// depois na Ficha. Cabelo novo não se compra: abre quando o continente fecha.

export const GENDERS = [
  { id: "f", name: "feminino" },
  { id: "m", name: "masculino" },
];

// cada cabelo é um punhado de medidas lidas pelo desenho: topo, costeleta,
// nuca comprida, rabo atrás, coque em cima e crista no meio
export const HAIRS = [
  { id: "curto", name: "curto", unlock: null, cap: 2, side: 1 },
  { id: "chanel", name: "chanel", unlock: null, cap: 3, side: 6 },
  { id: "franja", name: "franja", unlock: null, cap: 3, side: 2, bang: 2 },
  { id: "rabo", name: "rabo de cavalo", unlock: null, cap: 3, side: 2, tail: 7 },
  { id: "coque", name: "coque", unlock: "music", cap: 3, side: 2, bun: 4 },
  { id: "cacheado", name: "cacheado", unlock: "math", cap: 4, side: 5, curl: true },
  { id: "moicano", name: "moicano", unlock: "cs", cap: 2, side: 0, crest: 5 },
  { id: "longo", name: "longo", unlock: "lingua", cap: 3, side: 5, back: 9 },
  { id: "tranca", name: "trança", unlock: "chem", cap: 3, side: 3, braid: 3 },
  { id: "topete", name: "topete", unlock: "ai", cap: 2, side: 1, pompadour: 4 },
  { id: "ondas", name: "ondas", unlock: "physics", cap: 3, side: 6, wave: true },
  { id: "chiquinha", name: "chiquinha", quest: "mao-na-massa", cap: 3, side: 2, tail: 5, tailY: -15 },
];

export const SKINS = ["#f6d5b8", "#f0c9a8", "#e2b189", "#c68a5e", "#9a6242", "#6b422c"];
export const HAIR_TONES = ["#14121f", "#3a2a55", "#5c2a22", "#7a4a22", "#a8752a", "#d9c07a", "#c94f6d", "#4a7ab0", "#d8d2e8"];
export const EYES = ["#14121f", "#3a2a55", "#2f6a8a", "#4a6b2a", "#6b3a2a"];

export const AVATAR_DEFAULT = {
  gender: "f",
  hair: "chanel",
  skin: 1,
  hairColor: 1,
  eyes: 0,
};

export function hairById(id) {
  return HAIRS.find((hair) => hair.id === id) || HAIRS[0];
}

export function normalizeAvatar(raw, base = AVATAR_DEFAULT) {
  const out = { ...base };
  if (!raw || typeof raw !== "object") return out;
  if (raw.gender === "f" || raw.gender === "m") out.gender = raw.gender;
  if (HAIRS.some((hair) => hair.id === raw.hair)) out.hair = raw.hair;
  if (Number.isInteger(raw.skin)) out.skin = Math.max(0, Math.min(SKINS.length - 1, raw.skin));
  if (Number.isInteger(raw.hairColor)) out.hairColor = Math.max(0, Math.min(HAIR_TONES.length - 1, raw.hairColor));
  if (Number.isInteger(raw.eyes)) out.eyes = Math.max(0, Math.min(EYES.length - 1, raw.eyes));
  return out;
}

// cabelo fechado devolve o continente que abre; cabelo livre devolve null
export function hairUnlock(id) {
  return hairById(id).unlock;
}

// cabelo que abre com missão concluída; sem missão devolve ""
export function hairQuest(id) {
  return hairById(id).quest || "";
}

// o desenho recebe só o que ele usa, com a cor final já resolvida
export function avatarColors(avatar) {
  const look = normalizeAvatar(avatar);
  return {
    skin: SKINS[look.skin],
    hair: HAIR_TONES[look.hairColor],
    eyes: EYES[look.eyes],
  };
}

// a rede manda o personagem em poucos bytes: "f|chanel|1|1|0"
export function avatarCode(avatar) {
  const look = normalizeAvatar(avatar);
  return [look.gender, look.hair, look.skin, look.hairColor, look.eyes].join("|");
}

export function avatarFromCode(code) {
  const parts = String(code || "").split("|");
  if (parts.length < 5) return null;
  return normalizeAvatar({
    gender: parts[0],
    hair: parts[1],
    skin: Number(parts[2]),
    hairColor: Number(parts[3]),
    eyes: Number(parts[4]),
  });
}

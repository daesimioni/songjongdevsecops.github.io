// Archetypes are art/animation recipes and optional future-spawn hints, never live entities.
const groups = {
  quadruped: [
    ["cao", "Cão", "dog", "#a0805d", "fisico", 6, 9],
    ["lobo", "Lobo", "wolf", "#83939e", "fisico", 7, 11],
    ["raposa", "Raposa", "fox", "#bd8054", "fogo", 5, 9],
    ["urso", "Urso", "bear", "#79634d", "terra", 10, 11],
    ["javali", "Javali", "boar", "#816c62", "fisico", 8, 9],
    ["cervo", "Cervo", "deer", "#af9270", "terra", 6, 11],
    ["cavalo", "Cavalo", "horse", "#977459", "fisico", 7, 13],
    ["vaca", "Vaca", "cow", "#d1c8ac", "terra", 9, 11],
    ["cabra", "Cabra", "goat", "#b8b2a0", "terra", 5, 8],
    ["ovelha", "Ovelha", "sheep", "#d5d4be", "vento", 7, 8],
    ["coelho", "Coelho", "rabbit", "#c2b4a7", "fisico", 4, 5],
    ["rato", "Rato", "rat", "#8d8490", "veneno", 3, 5],
  ],
  bird: [
    ["aguia", "Águia", "eagle", "#a48e71", "vento", 6, 7],
    ["coruja", "Coruja", "owl", "#bca77d", "arcano", 6, 5],
    ["corvo", "Corvo", "raven", "#59616f", "morte", 5, 6],
    ["gaivota", "Gaivota", "gull", "#d8dfd3", "agua", 5, 6],
    ["galinha", "Galinha", "chicken", "#bd8e64", "fisico", 4, 5],
    ["pato", "Pato", "duck", "#83996e", "agua", 5, 7],
  ],
  reptile: [
    ["peixe", "Peixe", "fish", "#739fb4", "agua", 4, 8],
    ["tubarao", "Tubarão", "shark", "#7e9aa4", "agua", 7, 15],
    ["tartaruga", "Tartaruga", "turtle", "#8a9b64", "terra", 8, 9],
    ["sapo", "Sapo", "frog", "#7c9b62", "veneno", 5, 5],
    ["crocodilo", "Crocodilo", "crocodile", "#6c8361", "agua", 7, 15],
    ["lagarto", "Lagarto", "lizard", "#91a46d", "veneno", 4, 9],
  ],
  invertebrate: [
    ["abelha", "Abelha", "bee", "#d1b363", "fisico", 4, 5],
    ["vespa", "Vespa", "wasp", "#b7a05c", "veneno", 3, 7],
    ["borboleta", "Borboleta", "butterfly", "#b692bd", "vento", 3, 4],
    ["libelula", "Libélula", "dragonfly", "#65aaaf", "energia", 2, 10],
    ["louva-deus", "Louva-a-deus", "mantis", "#8ba76d", "fisico", 3, 7],
    ["caracol", "Caracol", "snail", "#a68b6c", "terra", 5, 7],
  ],
  humanoid: [
    ["esqueleto", "Esqueleto", "skeleton", "#ccc4a6", "morte", 5, 5],
    ["zumbi", "Zumbi", "zombie", "#8f9978", "morte", 6, 6],
    ["orc", "Orc", "orc", "#7d9568", "fisico", 8, 7],
    ["goblin", "Goblin", "goblin", "#93a06a", "veneno", 4, 5],
    ["cavaleiro", "Cavaleiro", "knight", "#8e9caa", "fisico", 6, 6],
    ["mago", "Mago", "mage", "#8d85b4", "arcano", 5, 5],
  ],
  mythical: [
    ["dragao", "Dragão", "dragon", "#a67461", "fogo", 10, 15],
    ["wyvern", "Wyvern", "wyvern", "#8a9276", "veneno", 8, 12],
    ["grifo", "Grifo", "griffin", "#b5a17e", "vento", 8, 12],
    ["fenix", "Fênix", "phoenix", "#d39253", "fogo", 7, 8],
    ["hidra", "Hidra", "hydra", "#78947d", "agua", 11, 14],
    ["mimico", "Mímico", "mimic", "#aa845c", "morte", 8, 7],
  ],
  elemental: [
    ["elemental-fogo", "Elemental de fogo", "fire", "#db9259", "fogo", 7, 7],
    ["elemental-gelo", "Elemental de gelo", "ice", "#9ac9d4", "gelo", 7, 7],
    [
      "elemental-terra",
      "Elemental de terra",
      "earth",
      "#a18e6c",
      "terra",
      9,
      8,
    ],
    ["elemental-agua", "Elemental de água", "water", "#69a7bc", "agua", 7, 7],
    [
      "elemental-energia",
      "Elemental de energia",
      "energy",
      "#a3bce0",
      "energia",
      6,
      6,
    ],
    [
      "elemental-morte",
      "Elemental da morte",
      "death",
      "#a194ba",
      "morte",
      6,
      6,
    ],
  ],
};
export const creatures = Object.entries(groups).flatMap(([family, items]) =>
  items.map(([slug, name, species, color, element, width, length]) => ({
    slug,
    name,
    renderer: "creature",
    family,
    species,
    color,
    element,
    width,
    length,
    parts: [],
    frames: 8,
    ms: 100,
    orientations: [0, 1, 2, 3, 4, 5, 6, 7],
    states: {
      idle: { loop: true },
      walk: { loop: true },
      attack: { loop: false },
      hit: { loop: false },
      death: { loop: false },
    },
    defaultState: "idle",
    layer: "actor",
    bounds: { x: -40, y: -64, w: 80, h: 84 },
    body: { hw: width / 16, hh: (length * 0.52) / 16 },
    spawnHint: {
      habitat: ["fish", "shark"].includes(species) ? "water" : "land",
      behavior: ["bird", "invertebrate"].includes(family) ? "roam" : "wander",
    },
    tags: ["criatura", family, species, element],
  })),
);
export const MONSTER_ATTACKS = Object.freeze({
  slime: ["veneno", "campo"],
  eye: ["energia", "raio"],
  bat: ["fisico", "cone"],
  spider: ["veneno", "projetil"],
  wisp: ["morte", "impacto"],
  scorpion: ["veneno", "corte"],
  golem: ["terra", "erupcao"],
  ant: ["fisico", "corte"],
  moth: ["vento", "campo"],
  beetle: ["fisico", "impacto"],
  crab: ["agua", "corte"],
  jelly: ["agua", "campo"],
  imp: ["fogo", "projetil"],
  sentinel: ["energia", "raio"],
  serpent: ["veneno", "cone"],
  tome: ["arcano", "projetil"],
  glyph: ["arcano", "anel"],
  note: ["vento", "anel"],
  atom: ["energia", "explosao"],
  crystal: ["gelo", "coluna"],
  gear: ["fisico", "corte"],
  node: ["energia", "campo"],
  prism: ["luz", "raio"],
  vector: ["fisico", "raio"],
  flask: ["veneno", "explosao"],
  boss: ["morte", "explosao"],
});
Object.values(MONSTER_ATTACKS).forEach(Object.freeze);
export function creatureAttack(id) {
  const a = creatures.find(
    (a) => a.slug === id || `kit/criaturas/${a.slug}` === id,
  );
  const recipe = a
    ? [
        a.element,
        ["humanoid", "quadruped", "invertebrate"].includes(a.family)
          ? "corte"
          : a.family === "mythical"
            ? "cone"
            : "projetil",
      ]
    : MONSTER_ATTACKS[
        id.startsWith("kit/conjuracoes/") ? id.split("/").at(-1) : id
      ];
  return recipe
    ? {
        effect: `kit/ataques/${recipe.join("-")}`,
        telegraph: `kit/ataques/${recipe[0]}-aviso`,
        impact: `kit/ataques/${recipe[0]}-impacto`,
      }
    : null;
}

export const monsterCasts = Object.entries(MONSTER_ATTACKS).map(
  ([slug, [element, form]]) => ({
    slug,
    name: `Ataque de ${slug}`,
    model: slug,
    element,
    form,
    renderer: "legacy-cast",
    parts: [],
    frames: 8,
    ms: 100,
    orientations: [0, 1, 2, 3, 4, 5, 6, 7],
    states: {
      attack: { loop: false },
      telegraph: { loop: true },
      impact: { loop: false },
    },
    defaultState: "attack",
    layer: "effect",
    bounds: { x: -76, y: -100, w: 152, h: 176 },
    tags: ["monstro", "ataque", slug, element],
  }),
);

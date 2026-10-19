export const TILE = 16;
export const MAP_W = 144;
export const MAP_H = 100;
export const WORLD_W = MAP_W * TILE;
export const WORLD_H = MAP_H * TILE;

// posições e tamanhos de gente são em tiles (1 tile = 16 unidades de mundo)
export const PLAYER_SPEED = 82 / 16;
export const PLAYER_W = 9 / 16;
export const PLAYER_H = 6 / 16;
export const INTERACT_RADIUS = 30 / 16;
export const REVEAL_RADIUS = 6;

export const NET = {
  broker: "wss://broker.emqx.io:8084/mqtt",
  prefix: "mundo-song/v2",
  defaultRoom: "praca",
  stateEvery: 180,
  peerTimeout: 6500,
};

export const STORAGE = {
  cards: "mundo-song:cards:v2",
  xp: "mundo-song:xp:v2",
  docks: "mundo-song:docks:v2",
  explored: "mundo-song:explored:v2",
  name: "mundo-song:name:v1",
  sound: "mundo-song:sound:v1",
  room: "mundo-song:room:v1",
};

// coordenadas do coração de cada continente: superelipse (4) para a costa
export const CONTINENTS = {
  hub: {
    id: "hub",
    name: "Porto do Início",
    sub: "o cais de onde saem todas as rotas",
    accent: "#ffc857",
    land: { cx: 72, cy: 50, rx: 18, ry: 12 },
    rect: { x: 53, y: 37, w: 38, h: 26 },
    base: 0,
    floor: 19,
    path: 1,
  },
  cs: {
    id: "cs",
    name: "Computaria",
    sub: "da areia ao silício, do interruptor ao processador",
    accent: "#61f4c0",
    land: { cx: 72, cy: 19, rx: 29, ry: 16 },
    rect: { x: 42, y: 2, w: 61, h: 35 },
    base: 10,
    floor: 11,
    path: 11,
  },
  math: {
    id: "math",
    name: "Matemática",
    sub: "o reino das formas que existem antes de nós",
    accent: "#b48cff",
    land: { cx: 121, cy: 50, rx: 20, ry: 35 },
    rect: { x: 100, y: 14, w: 42, h: 73 },
    base: 12,
    floor: 13,
    path: 13,
  },
  physics: {
    id: "physics",
    name: "Física",
    sub: "as regras do mundo, testadas no escuro",
    accent: "#ff7aa8",
    land: { cx: 72, cy: 81, rx: 29, ry: 16 },
    rect: { x: 42, y: 64, w: 61, h: 35 },
    base: 14,
    floor: 15,
    path: 15,
  },
  chem: {
    id: "chem",
    name: "Química",
    sub: "o mundo trocando de roupa átomo por átomo",
    accent: "#7ee787",
    land: { cx: 23, cy: 50, rx: 20, ry: 35 },
    rect: { x: 2, y: 14, w: 42, h: 73 },
    base: 16,
    floor: 17,
    path: 17,
  },
};

export const SITES = [
  // Porto
  {
    id: "welcome", continent: "hub", name: "Fonte das Boas-vindas",
    label: "Fonte das Boas-vindas", x: 72, y: 50, post: "welcome",
    accent: "#ffc857", icon: "fountain",
  },
  {
    id: "echo", continent: "hub", name: "Rádio do Quintal",
    label: "Rádio do Quintal", x: 66, y: 54, post: "echo",
    accent: "#ffb26b", icon: "radio",
  },

  // Computaria
  {
    id: "logic", continent: "cs", name: "Vale da Lógica",
    label: "Bancada das Portas", x: 54, y: 12, post: "logic",
    accent: "#61f4c0", icon: "gate",
  },
  {
    id: "adder", continent: "cs", name: "Oficina dos Somadores",
    label: "Somador Binário", x: 66, y: 8, post: "adder",
    accent: "#6bd5ff", icon: "chip",
  },
  {
    id: "state", continent: "cs", name: "Torre dos Relógios",
    label: "Flip-Flop e Estados", x: 80, y: 12, post: "state",
    accent: "#b48cff", icon: "clock",
  },
  {
    id: "cpu", continent: "cs", name: "Catedral do Processador",
    label: "CPU de Brinquedo", x: 58, y: 26, post: "cpu",
    accent: "#ffc857", icon: "cpu",
  },
  {
    id: "history", continent: "cs", name: "Museu da Computação",
    label: "Linha do Tempo", x: 86, y: 26, post: "history",
    accent: "#ff9f6b", icon: "book",
  },

  // Matemática
  {
    id: "infinity", continent: "math", name: "Salão do Infinito",
    label: "Paradoxos do Infinito", x: 112, y: 24, post: "infinity",
    accent: "#b48cff", icon: "infinity",
  },
  {
    id: "geometry", continent: "math", name: "Jardim dos Sólidos",
    label: "Sólidos Platônicos", x: 130, y: 22, post: "geometry",
    accent: "#6bd5ff", icon: "shape",
  },
  {
    id: "calculus", continent: "math", name: "Ponte do Cálculo",
    label: "Derivada e Integral", x: 134, y: 42, post: "calculus",
    accent: "#ffc857", icon: "curve",
  },
  {
    id: "probability", continent: "math", name: "Cassino de Pascal",
    label: "Máquina de Galton", x: 112, y: 50, post: "probability",
    accent: "#ff7aa8", icon: "dice",
  },
  {
    id: "fractal", continent: "math", name: "Bosque dos Fractais",
    label: "Árvore Mãe", x: 128, y: 70, post: "fractal",
    accent: "#6bd5ff", icon: "tree",
  },

  // Física
  {
    id: "motion", continent: "physics", name: "Pátio do Pêndulo",
    label: "Pêndulo de Galileu", x: 54, y: 74, post: "motion",
    accent: "#ff7aa8", icon: "pendulum",
  },
  {
    id: "waves", continent: "physics", name: "Observatório das Ondas",
    label: "Luneta de Fourier", x: 66, y: 70, post: "waves",
    accent: "#b48cff", icon: "wave",
  },
  {
    id: "thermo", continent: "physics", name: "Fornalha de Boltzmann",
    label: "Caixa de Gás", x: 82, y: 74, post: "thermo",
    accent: "#ff9f6b", icon: "heat",
  },
  {
    id: "optics", continent: "physics", name: "Prisma de Newton",
    label: "Prisma de Vidro", x: 58, y: 88, post: "optics",
    accent: "#6bd5ff", icon: "prism",
  },
  {
    id: "gravity", continent: "physics", name: "Órbita de Kepler",
    label: "Poço Gravitacional", x: 86, y: 88, post: "gravity",
    accent: "#ffc857", icon: "planet",
  },

  // Química
  {
    id: "periodic", continent: "chem", name: "Tabela Viva",
    label: "Tabela Periódica", x: 16, y: 26, post: "periodic",
    accent: "#7ee787", icon: "table",
  },
  {
    id: "bonds", continent: "chem", name: "Oficina das Ligações",
    label: "Moléculas em 3D", x: 32, y: 20, post: "bonds",
    accent: "#6bd5ff", icon: "molecule",
  },
  {
    id: "titration", continent: "chem", name: "Fonte Ácida",
    label: "Titulação", x: 34, y: 40, post: "titration",
    accent: "#ff7aa8", icon: "flask",
  },
  {
    id: "energy", continent: "chem", name: "Forja das Reações",
    label: "Energia de Ativação", x: 14, y: 54, post: "energy",
    accent: "#ffc857", icon: "fire",
  },
  {
    id: "balance", continent: "chem", name: "Balança de Lavoisier",
    label: "Estequiometria", x: 30, y: 66, post: "balance",
    accent: "#b48cff", icon: "scale",
  },
];

export const WAYSTONES = [
  { id: "hub", continent: "hub", name: "Pedra do Porto", x: 78, y: 54, accent: "#ffc857" },
  { id: "cs", continent: "cs", name: "Farol de Computaria", x: 78, y: 32, accent: "#61f4c0" },
  { id: "math", continent: "math", name: "Farol da Matemática", x: 104, y: 54, accent: "#b48cff" },
  { id: "physics", continent: "physics", name: "Farol da Física", x: 78, y: 68, accent: "#ff7aa8" },
  { id: "chem", continent: "chem", name: "Farol da Química", x: 40, y: 46, accent: "#7ee787" },
];

export const NPC_SPAWNS = [
  { id: "guia", continent: "hub", x: 75, y: 47, accent: "#ffc857" },
  { id: "ada", continent: "cs", x: 62, y: 20, accent: "#61f4c0" },
  { id: "hypatia", continent: "math", x: 120, y: 32, accent: "#b48cff" },
  { id: "marie", continent: "physics", x: 72, y: 84, accent: "#ff7aa8" },
  { id: "mendeleev", continent: "chem", x: 24, y: 34, accent: "#7ee787" },
];

export const CAT_SPAWN = { x: 69, y: 51 };
export const SPAWN = { x: 73, y: 51.2 };

export const PLAYER_COLORS = [
  { hair: "#3a2a55", skin: "#f0c9a8", shirt: "#61f4c0", pants: "#2f3a66", accent: "#fff3d1" },
  { hair: "#6b3a2a", skin: "#d9a273", shirt: "#ff7aa8", pants: "#3a2f5c", accent: "#ffe1ef" },
  { hair: "#1f3a5c", skin: "#f4d6b8", shirt: "#b48cff", pants: "#24305a", accent: "#e9dcff" },
  { hair: "#5c1f3a", skin: "#c68a5e", shirt: "#ffc857", pants: "#2b3350", accent: "#fff0c9" },
  { hair: "#1f5c4a", skin: "#e8b98c", shirt: "#6bd5ff", pants: "#2c3b55", accent: "#dff5ff" },
];

export const TILE_KIND = {
  GRASS: 0,
  PATH: 1,
  STONE: 2,
  WATER: 3,
  TREE: 4,
  WALL: 5,
  FLOWER: 6,
  SAND: 7,
  CIRCUIT: 10,
  DATA: 11,
  GOLD: 12,
  MARBLE: 13,
  BASALT: 14,
  MAGMA: 15,
  MOSS: 16,
  ACID: 17,
  BRIDGE: 18,
  PLAZA: 19,
};

export const SOLID = new Set([
  TILE_KIND.WATER,
  TILE_KIND.TREE,
  TILE_KIND.WALL,
]);

export const CONTINENT_ORDER = ["hub", "cs", "math", "physics", "chem"];

export const TILE = 16;
export const MAP_W = 180;
export const MAP_H = 120;
export const WORLD_W = MAP_W * TILE;
export const WORLD_H = MAP_H * TILE;

// posições e tamanhos de gente são em tiles (1 tile = 16 unidades de mundo)
export const PLAYER_SPEED = 82 / 16;
export const SPRINT_MULT = 2.2;
export const PLAYER_W = 9 / 16;
export const PLAYER_H = 6 / 16;
export const INTERACT_RADIUS = 30 / 16;
export const REVEAL_RADIUS = 6;

export const NET = {
  broker: "wss://broker.emqx.io:8084/mqtt",
  prefix: "mundo-song/v2",
  defaultRoom: "praca",
  stateEvery: 100,
  peerTimeout: 6500,
  interpDelay: 200,
};

export const STORAGE = {
  cards: "mundo-song:cards:v2",
  xp: "mundo-song:xp:v2",
  docks: "mundo-song:docks:v2",
  explored: "mundo-song:explored:v2",
  name: "mundo-song:name:v1",
  sound: "mundo-song:sound:v1",
  room: "mundo-song:room:v1",
  quests: "mundo-song:quests:v1",
  nostr: "mundo-song:nostr:v1",
  rpg: "mundo-song:rpg:v1",
  chat: "mundo-song:chat:v1",
};

// A rede do mundo: relays públicos, canais do jogo e DMs privadas (NIP-17).
// Tudo que entra na tela passa por estes dois selos, então nenhum conteúdo
// de fora do jogo aparece aqui.
export const NOSTR = {
  relays: [
    "wss://relay.damus.io",
    "wss://nos.lol",
    "wss://relay.nostr.band",
    "wss://relay.primal.net",
  ],
  tag: "mundo-song",
  // versão do namespace dos canais: subir isto começa uma conversa limpa
  namespace: "mundo-song:v3",
  client: "mundo-song",
  channels: [
    { id: "geral", name: "Praça do Mundo", sub: "a conversa de todo mundo" },
    { id: "cs", name: "Computaria", sub: "fios, portas e processadores" },
    { id: "math", name: "Matemática", sub: "formas, infinito e acaso" },
    { id: "physics", name: "Física", sub: "pêndulos, luz e órbitas" },
    { id: "chem", name: "Química", sub: "átomos trocando de roupa" },
    { id: "music", name: "Música", sub: "som organizado em números" },
    { id: "ai", name: "Inteligência Artificial", sub: "redes, linguagem e limites" },
  ],
};

// coordenadas do coração de cada continente: superelipse (4) para a costa
export const CONTINENTS = {
  hub: {
    id: "hub",
    name: "Porto do Início",
    sub: "o cais de onde saem todas as rotas",
    accent: "#ffc857",
    land: { cx: 90, cy: 60, rx: 17, ry: 12 },
    rect: { x: 72, y: 47, w: 36, h: 26 },
    base: 0,
    floor: 19,
    path: 1,
  },
  cs: {
    id: "cs",
    name: "Computaria",
    sub: "da areia ao silício, do interruptor ao processador",
    accent: "#61f4c0",
    land: { cx: 90, cy: 18, rx: 24, ry: 13 },
    rect: { x: 64, y: 3, w: 52, h: 33 },
    base: 10,
    floor: 11,
    path: 11,
  },
  math: {
    id: "math",
    name: "Matemática",
    sub: "o reino das formas que existem antes de nós",
    accent: "#b48cff",
    land: { cx: 156, cy: 66, rx: 18, ry: 24 },
    rect: { x: 136, y: 40, w: 42, h: 52 },
    base: 12,
    floor: 13,
    path: 13,
  },
  physics: {
    id: "physics",
    name: "Física",
    sub: "as regras do mundo, testadas no escuro",
    accent: "#ff7aa8",
    land: { cx: 90, cy: 102, rx: 24, ry: 13 },
    rect: { x: 64, y: 85, w: 52, h: 33 },
    base: 14,
    floor: 15,
    path: 15,
  },
  chem: {
    id: "chem",
    name: "Química",
    sub: "o mundo trocando de roupa átomo por átomo",
    accent: "#7ee787",
    land: { cx: 24, cy: 66, rx: 18, ry: 24 },
    rect: { x: 4, y: 40, w: 42, h: 52 },
    base: 16,
    floor: 17,
    path: 17,
  },
  music: {
    id: "music",
    name: "Música",
    sub: "o som organizado em números, razões e surpresas",
    accent: "#ffb26b",
    land: { cx: 44, cy: 24, rx: 18, ry: 12 },
    rect: { x: 22, y: 8, w: 40, h: 32 },
    base: 20,
    floor: 21,
    path: 21,
  },
  ai: {
    id: "ai",
    name: "Inteligência Artificial",
    sub: "máquinas que ajustam, erram, generalizam e precisam de gente",
    accent: "#6bd5ff",
    land: { cx: 136, cy: 24, rx: 18, ry: 12 },
    rect: { x: 118, y: 8, w: 40, h: 32 },
    base: 22,
    floor: 23,
    path: 23,
  },
};

export const SITES = [
  // Porto
  {
    id: "welcome", continent: "hub", name: "Fonte das Boas-vindas",
    label: "Fonte das Boas-vindas", x: 90, y: 60, post: "welcome",
    accent: "#ffc857", icon: "fountain",
  },
  {
    id: "echo", continent: "hub", name: "Rádio do Quintal",
    label: "Rádio do Quintal", x: 84, y: 64, post: "echo",
    accent: "#ffb26b", icon: "radio",
  },

  // Computaria
  {
    id: "logic", continent: "cs", name: "Vale da Lógica",
    label: "Bancada das Portas", x: 78, y: 18, post: "logic",
    accent: "#61f4c0", icon: "gate",
  },
  {
    id: "adder", continent: "cs", name: "Oficina dos Somadores",
    label: "Somador Binário", x: 90, y: 9, post: "adder",
    accent: "#6bd5ff", icon: "chip",
  },
  {
    id: "state", continent: "cs", name: "Torre dos Relógios",
    label: "Flip-Flop e Estados", x: 102, y: 18, post: "state",
    accent: "#b48cff", icon: "clock",
  },
  {
    id: "cpu", continent: "cs", name: "Catedral do Processador",
    label: "CPU de Brinquedo", x: 80, y: 29, post: "cpu",
    accent: "#ffc857", icon: "cpu",
  },
  {
    id: "history", continent: "cs", name: "Museu da Computação",
    label: "Linha do Tempo", x: 104, y: 29, post: "history",
    accent: "#ff9f6b", icon: "book",
  },

  // Matemática
  {
    id: "infinity", continent: "math", name: "Salão do Infinito",
    label: "Paradoxos do Infinito", x: 146, y: 52, post: "infinity",
    accent: "#b48cff", icon: "infinity",
  },
  {
    id: "geometry", continent: "math", name: "Jardim dos Sólidos",
    label: "Sólidos Platônicos", x: 166, y: 48, post: "geometry",
    accent: "#6bd5ff", icon: "shape",
  },
  {
    id: "calculus", continent: "math", name: "Ponte do Cálculo",
    label: "Derivada e Integral", x: 170, y: 66, post: "calculus",
    accent: "#ffc857", icon: "curve",
  },
  {
    id: "probability", continent: "math", name: "Cassino de Pascal",
    label: "Máquina de Galton", x: 148, y: 76, post: "probability",
    accent: "#ff7aa8", icon: "dice",
  },
  {
    id: "fractal", continent: "math", name: "Bosque dos Fractais",
    label: "Árvore Mãe", x: 166, y: 82, post: "fractal",
    accent: "#6bd5ff", icon: "tree",
  },

  // Física
  {
    id: "motion", continent: "physics", name: "Pátio do Pêndulo",
    label: "Pêndulo de Galileu", x: 72, y: 96, post: "motion",
    accent: "#ff7aa8", icon: "pendulum",
  },
  {
    id: "waves", continent: "physics", name: "Observatório das Ondas",
    label: "Luneta de Fourier", x: 86, y: 90, post: "waves",
    accent: "#b48cff", icon: "wave",
  },
  {
    id: "thermo", continent: "physics", name: "Fornalha de Boltzmann",
    label: "Caixa de Gás", x: 102, y: 96, post: "thermo",
    accent: "#ff9f6b", icon: "heat",
  },
  {
    id: "optics", continent: "physics", name: "Prisma de Newton",
    label: "Prisma de Vidro", x: 76, y: 110, post: "optics",
    accent: "#6bd5ff", icon: "prism",
  },
  {
    id: "gravity", continent: "physics", name: "Órbita de Kepler",
    label: "Poço Gravitacional", x: 104, y: 110, post: "gravity",
    accent: "#ffc857", icon: "planet",
  },

  // Química
  {
    id: "periodic", continent: "chem", name: "Tabela Viva",
    label: "Tabela Periódica", x: 14, y: 50, post: "periodic",
    accent: "#7ee787", icon: "table",
  },
  {
    id: "bonds", continent: "chem", name: "Oficina das Ligações",
    label: "Moléculas em 3D", x: 30, y: 48, post: "bonds",
    accent: "#6bd5ff", icon: "molecule",
  },
  {
    id: "titration", continent: "chem", name: "Fonte Ácida",
    label: "Titulação", x: 36, y: 62, post: "titration",
    accent: "#ff7aa8", icon: "flask",
  },
  {
    id: "energy", continent: "chem", name: "Forja das Reações",
    label: "Energia de Ativação", x: 12, y: 74, post: "energy",
    accent: "#ffc857", icon: "fire",
  },
  {
    id: "balance", continent: "chem", name: "Balança de Lavoisier",
    label: "Estequiometria", x: 30, y: 82, post: "balance",
    accent: "#b48cff", icon: "scale",
  },

  // Música
  {
    id: "rhythm", continent: "music", name: "Relógio dos Ritmos",
    label: "Polirritmia", x: 32, y: 16, post: "rhythm",
    accent: "#ffb26b", icon: "note",
  },
  {
    id: "harmony", continent: "music", name: "Círculo das Razões",
    label: "Intervalos Harmônicos", x: 44, y: 13, post: "harmony",
    accent: "#ffd166", icon: "wave",
  },
  {
    id: "scales", continent: "music", name: "Escada das Escalas",
    label: "Temperamento", x: 56, y: 16, post: "scales",
    accent: "#ff9f6b", icon: "piano",
  },
  {
    id: "timbre", continent: "music", name: "Oficina dos Timbres",
    label: "Série Harmônica", x: 32, y: 30, post: "timbre",
    accent: "#ff7aa8", icon: "speaker",
  },
  {
    id: "generative", continent: "music", name: "Máquina de Compor",
    label: "Música Generativa", x: 56, y: 30, post: "generative",
    accent: "#b48cff", icon: "dice",
  },

  // Inteligência Artificial
  {
    id: "learning", continent: "ai", name: "Praça dos Dados",
    label: "Regressão Linear", x: 124, y: 16, post: "learning",
    accent: "#6bd5ff", icon: "chart",
  },
  {
    id: "neural", continent: "ai", name: "Torre das Camadas",
    label: "Rede Neural", x: 136, y: 13, post: "neural",
    accent: "#61f4c0", icon: "network",
  },
  {
    id: "language", continent: "ai", name: "Fonte das Palavras",
    label: "Tokens e Predição", x: 148, y: 16, post: "language",
    accent: "#b48cff", icon: "text",
  },
  {
    id: "vision", continent: "ai", name: "Olho da Máquina",
    label: "Convolução", x: 124, y: 30, post: "vision",
    accent: "#ffc857", icon: "eye",
  },
  {
    id: "ethics", continent: "ai", name: "Sala do Juízo",
    label: "Ética e Limites", x: 148, y: 30, post: "ethics",
    accent: "#ff7aa8", icon: "scale",
  },
];

export const WAYSTONES = [
  { id: "hub", continent: "hub", name: "Pedra do Porto", x: 98, y: 64, accent: "#ffc857" },
  { id: "cs", continent: "cs", name: "Farol de Computaria", x: 96, y: 28, accent: "#61f4c0" },
  { id: "math", continent: "math", name: "Farol da Matemática", x: 142, y: 64, accent: "#b48cff" },
  { id: "physics", continent: "physics", name: "Farol da Física", x: 96, y: 89, accent: "#ff7aa8" },
  { id: "chem", continent: "chem", name: "Farol da Química", x: 38, y: 64, accent: "#7ee787" },
  { id: "music", continent: "music", name: "Farol da Música", x: 58, y: 32, accent: "#ffb26b" },
  { id: "ai", continent: "ai", name: "Farol da IA", x: 122, y: 32, accent: "#6bd5ff" },
];

export const NPC_SPAWNS = [
  { id: "guia", continent: "hub", x: 94, y: 56, accent: "#ffc857" },
  { id: "ada", continent: "cs", x: 86, y: 24, accent: "#61f4c0" },
  { id: "hypatia", continent: "math", x: 158, y: 58, accent: "#b48cff" },
  { id: "marie", continent: "physics", x: 86, y: 104, accent: "#ff7aa8" },
  { id: "mendeleev", continent: "chem", x: 26, y: 60, accent: "#7ee787" },
  { id: "pythagoras", continent: "music", x: 46, y: 28, accent: "#ffb26b" },
  { id: "turing", continent: "ai", x: 136, y: 28, accent: "#6bd5ff" },
];

export const CAT_SPAWN = { x: 87, y: 61 };
export const SPAWN = { x: 91, y: 61.2 };

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
  SONIC: 20,
  SCORE: 21,
  NEURAL: 22,
  SYNAPSE: 23,
};

export const SOLID = new Set([
  TILE_KIND.WATER,
  TILE_KIND.TREE,
  TILE_KIND.WALL,
]);

export const CONTINENT_ORDER = ["hub", "cs", "math", "physics", "chem", "music", "ai"];

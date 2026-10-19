export const TILE = 16;
export const MAP_W = 48;
export const MAP_H = 36;
export const WORLD_W = MAP_W * TILE;
export const WORLD_H = MAP_H * TILE;

// posições e tamanhos de gente são em tiles (1 tile = 16 unidades de mundo)
export const PLAYER_SPEED = 82 / 16;
export const PLAYER_W = 9 / 16;
export const PLAYER_H = 6 / 16;
export const INTERACT_RADIUS = 30 / 16;

export const NET = {
  broker: "wss://broker.emqx.io:8084/mqtt",
  prefix: "mundo-song/v1",
  defaultRoom: "praca",
  stateEvery: 180,
  peerTimeout: 6500,
};

export const STORAGE = {
  visits: "mundo-song:visits:v1",
  name: "mundo-song:name:v1",
  sound: "mundo-song:sound:v1",
  room: "mundo-song:room:v1",
  explored: "mundo-song:explored:v1",
};

export const ZONES = {
  plaza: {
    id: "plaza",
    name: "Praça do Começo",
    sub: "o ponto de partida de tudo",
    accent: "#ffc857",
    rect: { x: 17, y: 13, w: 14, h: 10 },
    spawn: { x: 24, y: 19.5 },
  },
  logic: {
    id: "logic",
    name: "Vale da Lógica",
    sub: "duas entradas, uma saída, infinitas consequências",
    accent: "#61f4c0",
    rect: { x: 3, y: 3, w: 12, h: 9 },
  },
  fractal: {
    id: "fractal",
    name: "Bosque dos Fractais",
    sub: "onde a regra vira árvore e a árvore vira regra",
    accent: "#6bd5ff",
    rect: { x: 3, y: 24, w: 13, h: 9 },
  },
  observatory: {
    id: "observatory",
    name: "Observatório",
    sub: "toda onda é uma soma de coisas simples",
    accent: "#b48cff",
    rect: { x: 33, y: 3, w: 12, h: 9 },
  },
  rift: {
    id: "rift",
    name: "Fenda 3D",
    sub: "a borda onde o mapa ganha uma dimensão a mais",
    accent: "#ff7aa8",
    rect: { x: 33, y: 24, w: 12, h: 9 },
  },
};

export const STATIONS = [
  {
    id: "fountain",
    post: "welcome",
    zone: "plaza",
    label: "Fonte das Boas-vindas",
    x: 24,
    y: 18,
    accent: "#ffc857",
  },
  {
    id: "radio",
    post: "echo",
    zone: "plaza",
    label: "Rádio do Quintal",
    x: 21,
    y: 21.5,
    accent: "#ffb26b",
  },
  {
    id: "logic",
    post: "logic",
    zone: "logic",
    label: "Bancada das Portas",
    x: 9,
    y: 8,
    accent: "#61f4c0",
  },
  {
    id: "fractal",
    post: "fractal",
    zone: "fractal",
    label: "Árvore Mãe",
    x: 9.5,
    y: 29.5,
    accent: "#6bd5ff",
  },
  {
    id: "fourier",
    post: "fourier",
    zone: "observatory",
    label: "Luneta de Fourier",
    x: 39,
    y: 8,
    accent: "#b48cff",
  },
  {
    id: "solid",
    post: "solid",
    zone: "rift",
    label: "Cristal da Fenda",
    x: 39,
    y: 28.5,
    accent: "#ff7aa8",
  },
];

export const NPC_SPAWNS = [
  { id: "guia", x: 27.5, y: 16.5, accent: "#ffc857" },
  { id: "coruja", x: 13, y: 26.5, accent: "#6bd5ff" },
  { id: "robo", x: 35.5, y: 10, accent: "#b48cff" },
];

export const CAT_SPAWN = { x: 25.5, y: 21.5 };

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
  LOGIC: 10,
  MOSS: 11,
  STAR: 12,
  CRYSTAL: 13,
  WOOD: 14,
  VOID: 15,
};

export const SOLID = new Set([
  TILE_KIND.WATER,
  TILE_KIND.TREE,
  TILE_KIND.WALL,
  TILE_KIND.VOID,
]);

export const TILE = 16;
// o mar novo recebe o catálogo inteiro: 70 áreas em seis arquipélagos
export const MAP_W = 560;
export const MAP_H = 360;
export const WORLD_W = MAP_W * TILE;
export const WORLD_H = MAP_H * TILE;

// posições e tamanhos de gente são em tiles (1 tile = 16 unidades de mundo)
export const PLAYER_SPEED = 82 / 16;
export const SPRINT_MULT = 4.4;
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

// As chaves internas mantêm o prefixo antigo de propósito: renomear apagaria
// o progresso de quem já jogava. O nome visível é The Learning Valley.
export const STORAGE = {
  cards: "mundo-song:cards:v2",
  xp: "mundo-song:xp:v2",
  docks: "mundo-song:docks:v2",
  explored: "mundo-song:explored:v2",
  name: "mundo-song:name:v1",
  sound: "mundo-song:sound:v1",
  fonte: "mundo-song:fonte:v1",
  room: "mundo-song:room:v1",
  quests: "mundo-song:quests:v1",
  nostr: "mundo-song:nostr:v1",
  rpg: "mundo-song:rpg:v1",
  chat: "mundo-song:chat:v1",
  outfit: "mundo-song:outfit:v1",
  avatar: "mundo-song:avatar:v1",
  npc: "mundo-song:npc:v1",
  steps: "mundo-song:steps:v1",
  ground: "mundo-song:ground:v1",
};

// O backup da conta viaja como DM NIP-17 para a própria chave: o relay só vê
// um gift wrap cifrado. O conteúdo é o estado local em JSON, comprimido e em
// base64. A nsec (STORAGE.nostr) e o chat ficam de fora, por segurança.
export const BACKUP = {
  mark: "mundo-song:save:v1:",
  storage: "mundo-song:save:last:v1",
  every: 5 * 60 * 1000,
  days: 30,
  max: 60000,
  keys: ["cards", "xp", "docks", "explored", "name", "sound", "room", "quests", "rpg", "outfit", "avatar", "npc", "ground", "steps"],
};

// A rede do mundo: relays públicos, canais do jogo e DMs privadas (NIP-17).
// Tudo que entra na tela passa por estes dois selos, então nenhum conteúdo
// de fora do jogo aparece aqui.
export const NOSTR = {
  // a chave do jogador fica nesta entrada do navegador
  storage: "mundo-song:nostr:v1",
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
    { id: "cs", name: "Computação", sub: "fios, portas e processadores" },
    { id: "math", name: "Matemática", sub: "formas, infinito e acaso" },
    { id: "physics", name: "Física", sub: "pêndulos, luz e órbitas" },
    { id: "chem", name: "Química", sub: "átomos trocando de roupa" },
    { id: "music", name: "Música", sub: "som organizado em números" },
    { id: "ai", name: "Inteligência Artificial", sub: "redes, linguagem e limites" },
    { id: "lingua", name: "Vale da Língua", sub: "português do Brasil, do som à frase" },
  ],
};

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

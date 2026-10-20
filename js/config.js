export const TILE = 16;
export const MAP_W = 300;
export const MAP_H = 200;
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
  outfit: "mundo-song:outfit:v1",
  npc: "mundo-song:npc:v1",
  steps: "mundo-song:steps:v1",
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
  keys: ["cards", "xp", "docks", "explored", "name", "sound", "room", "quests", "rpg", "outfit", "npc"],
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
    name: "Computação",
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
  lingua: {
    id: "lingua",
    name: "Vale da Língua",
    sub: "o português do Brasil, do som da fala à frase escrita",
    accent: "#e8c07a",
    land: { cx: 29, cy: 104, rx: 15, ry: 9 },
    rect: { x: 13, y: 94, w: 33, h: 21 },
    base: 0,
    floor: 12,
    path: 1,
  },
};

// Áreas temáticas dentro de um continente: cada uma tem a própria ilha,
// estações, clareira de caçada e caverna. O continente continua sendo o mesmo.
export const AREAS = [
  {
    id: "physics-em",
    continent: "physics",
    name: "Área do Eletromagnetismo",
    sub: "corrente, campo e onda morando na pedra",
    land: { cx: 152, cy: 104, rx: 18, ry: 10 },
    rect: { x: 134, y: 94, w: 36, h: 20 },
    base: 14,
    floor: 19,
    path: 15,
    accent: "#ffb26b",
  },
  {
    id: "cs-arch",
    continent: "cs",
    name: "Área da Arquitetura de Computadores",
    sub: "instruções, registros e o ciclo que não para",
    land: { cx: 204, cy: 20, rx: 26, ry: 14 },
    rect: { x: 178, y: 6, w: 52, h: 28 },
    base: 10,
    floor: 11,
    path: 11,
    accent: "#61f4c0",
  },
  {
    id: "math-analysis",
    continent: "math",
    name: "Área da Análise",
    sub: "limites, séries e o infinito que se persegue",
    land: { cx: 226, cy: 76, rx: 22, ry: 13 },
    rect: { x: 202, y: 62, w: 46, h: 27 },
    base: 12,
    floor: 13,
    path: 13,
    accent: "#b48cff",
  },
  {
    id: "chem-organic",
    continent: "chem",
    name: "Área da Química Orgânica",
    sub: "carbono, cadeias e o que a vida faz com eles",
    land: { cx: 31, cy: 138, rx: 17, ry: 11 },
    rect: { x: 10, y: 122, w: 44, h: 30 },
    base: 16,
    floor: 17,
    path: 17,
    accent: "#7ee787",
  },
  {
    id: "music-acoustics",
    continent: "music",
    name: "Área da Acústica",
    sub: "ondas, ressonância e o que o ouvido separa",
    land: { cx: 59, cy: 63, rx: 11, ry: 16 },
    rect: { x: 46, y: 44, w: 26, h: 38 },
    base: 20,
    floor: 21,
    path: 21,
    accent: "#ffb26b",
  },
  {
    id: "ai-vision",
    continent: "ai",
    name: "Área da Visão Computacional",
    sub: "pixels, bordas e o que a máquina acha que viu",
    land: { cx: 168, cy: 12, rx: 8, ry: 9 },
    rect: { x: 159, y: 2, w: 18, h: 21 },
    base: 22,
    floor: 23,
    path: 23,
    accent: "#6bd5ff",
  },
  {
    id: "lingua-literature",
    continent: "lingua",
    name: "Área da Literatura",
    sub: "narrativa, verso e o que fica depois da última linha",
    land: { cx: 30, cy: 170, rx: 16, ry: 10 },
    rect: { x: 10, y: 156, w: 42, h: 32 },
    base: 0,
    floor: 12,
    path: 1,
    accent: "#e8c07a",
  },
  {
    id: "cs-net",
    continent: "cs",
    name: "Área das Redes",
    sub: "pacotes, camadas e o caminho até o outro lado",
    land: { cx: 252, cy: 20, rx: 18, ry: 12 },
    rect: { x: 232, y: 6, w: 40, h: 28 },
    base: 10,
    floor: 11,
    path: 11,
    accent: "#61f4c0",
  },
  {
    id: "physics-thermo",
    continent: "physics",
    name: "Área da Termodinâmica",
    sub: "calor, entropia e o que não volta",
    land: { cx: 116, cy: 139, rx: 18, ry: 11 },
    rect: { x: 96, y: 124, w: 40, h: 30 },
    base: 14,
    floor: 15,
    path: 15,
    accent: "#ff7aa8",
  },
  {
    id: "chem-analytical",
    continent: "chem",
    name: "Área da Química Analítica",
    sub: "separar, medir e saber o que tem dentro",
    land: { cx: 74, cy: 139, rx: 16, ry: 11 },
    rect: { x: 56, y: 124, w: 36, h: 30 },
    base: 16,
    floor: 17,
    path: 17,
    accent: "#7ee787",
  },
  {
    id: "music-form",
    continent: "music",
    name: "Área da Forma Musical",
    sub: "frases que voltam, variam e surpreendem",
    land: { cx: 272, cy: 56, rx: 18, ry: 12 },
    rect: { x: 252, y: 40, w: 40, h: 32 },
    base: 20,
    floor: 21,
    path: 21,
    accent: "#ffb26b",
  },
  {
    id: "math-prob",
    continent: "math",
    name: "Área da Probabilidade",
    sub: "acaso, esperança e o que se repete",
    land: { cx: 272, cy: 90, rx: 18, ry: 11 },
    rect: { x: 252, y: 76, w: 40, h: 28 },
    base: 12,
    floor: 13,
    path: 13,
    accent: "#b48cff",
  },
  {
    id: "ai-language",
    continent: "ai",
    name: "Área da Linguagem",
    sub: "tokens, contexto e o que a máquina aprende a dizer",
    land: { cx: 226, cy: 135, rx: 18, ry: 11 },
    rect: { x: 206, y: 120, w: 40, h: 30 },
    base: 22,
    floor: 23,
    path: 23,
    accent: "#6bd5ff",
  },
  {
    id: "lingua-semantics",
    continent: "lingua",
    name: "Área da Semântica",
    sub: "sentido, ambiguidade e o que a frase quer dizer",
    land: { cx: 272, cy: 135, rx: 18, ry: 11 },
    rect: { x: 252, y: 120, w: 40, h: 30 },
    base: 0,
    floor: 12,
    path: 1,
    accent: "#e8c07a",
  },
  {
    id: "physics-optics",
    continent: "physics",
    name: "Área da Óptica",
    sub: "luz, lentes e as cores que estavam escondidas",
    land: { cx: 78, cy: 174, rx: 18, ry: 10 },
    rect: { x: 58, y: 158, w: 40, h: 32 },
    base: 14,
    floor: 15,
    path: 15,
    accent: "#ff7aa8",
  },
  {
    id: "cs-security",
    continent: "cs",
    name: "Área da Segurança",
    sub: "cifras, chaves e o que não pode vazar",
    land: { cx: 226, cy: 173, rx: 18, ry: 10 },
    rect: { x: 206, y: 158, w: 40, h: 30 },
    base: 10,
    floor: 11,
    path: 11,
    accent: "#61f4c0",
  },
];

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

  // Computação
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

  // Vale da Língua
  {
    id: "words", continent: "lingua", name: "Praça das Palavras",
    label: "Etimologia", x: 22, y: 98, post: "words",
    accent: "#e8c07a", icon: "book",
  },
  {
    id: "concord", continent: "lingua", name: "Oficina da Concordância",
    label: "Sujeito e Verbo", x: 35, y: 99, post: "concord",
    accent: "#ffc857", icon: "sign",
  },
  {
    id: "accents", continent: "lingua", name: "Mural dos Acentos",
    label: "Acentuação e Hífen", x: 20, y: 107, post: "accents",
    accent: "#ff9f6b", icon: "terminal",
  },
  {
    id: "genres", continent: "lingua", name: "Biblioteca dos Gêneros",
    label: "Gêneros Textuais", x: 36, y: 107, post: "genres",
    accent: "#b48cff", icon: "book",
  },
  {
    id: "crase", continent: "lingua", name: "Sala da Crase",
    label: "Crase e Regência", x: 28, y: 111, post: "crase",
    accent: "#61f4c0", icon: "scale",
  },

  // Física · área do eletromagnetismo
  {
    id: "induction", continent: "physics", name: "Oficina da Indução",
    label: "Faraday", x: 140, y: 107, post: "induction",
    accent: "#ffb26b", icon: "chip",
  },
  {
    id: "maxwell", continent: "physics", name: "Torre de Maxwell",
    label: "Ondas Eletromagnéticas", x: 164, y: 107, post: "maxwell",
    accent: "#6bd5ff", icon: "wave",
  },

  // Computação · área da arquitetura
  {
    id: "pipeline", continent: "cs", name: "Sala do Pipeline",
    label: "Ciclo de Instrução", x: 192, y: 15, post: "pipeline",
    accent: "#61f4c0", icon: "cpu",
  },
  {
    id: "registers", continent: "cs", name: "Oficina dos Registradores",
    label: "Registradores e Memória", x: 214, y: 25, post: "registers",
    accent: "#6bd5ff", icon: "chip",
  },

  // Matemática · área da análise
  {
    id: "limits", continent: "math", name: "Torre dos Limites",
    label: "Limite e Continuidade", x: 214, y: 71, post: "limits",
    accent: "#b48cff", icon: "curve",
  },
  {
    id: "series", continent: "math", name: "Sala das Séries",
    label: "Convergência", x: 236, y: 82, post: "series",
    accent: "#6bd5ff", icon: "infinity",
  },

  // Química · área orgânica
  {
    id: "carbon", continent: "chem", name: "Forja do Carbono",
    label: "Carbono e Ligações", x: 22, y: 133, post: "carbon",
    accent: "#7ee787", icon: "flask",
  },
  {
    id: "polymers", continent: "chem", name: "Salão dos Polímeros",
    label: "Cadeias e Polímeros", x: 40, y: 143, post: "polymers",
    accent: "#6bd5ff", icon: "chain",
  },

  // Música · área da acústica
  {
    id: "acoustics", continent: "music", name: "Câmara Acústica",
    label: "Ressonância e Harmônicos", x: 53, y: 54, post: "acoustics",
    accent: "#ffb26b", icon: "wave",
  },
  {
    id: "instruments", continent: "music", name: "Oficina dos Instrumentos",
    label: "Cordas, Tubos e Pele", x: 65, y: 70, post: "instruments",
    accent: "#ffd166", icon: "piano",
  },

  // IA · área da visão
  {
    id: "convolution", continent: "ai", name: "Sala da Convolução",
    label: "Imagem e Convolução", x: 168, y: 6, post: "convolution",
    accent: "#6bd5ff", icon: "eye",
  },
  {
    id: "detection", continent: "ai", name: "Torre da Detecção",
    label: "Objetos e Limites", x: 168, y: 18, post: "detection",
    accent: "#8fe3ff", icon: "network",
  },

  // Língua · área da literatura
  {
    id: "narrative", continent: "lingua", name: "Sala da Narrativa",
    label: "Narrador e Tempo", x: 22, y: 166, post: "narrative",
    accent: "#e8c07a", icon: "book",
  },
  {
    id: "poetry", continent: "lingua", name: "Recital dos Versos",
    label: "Poesia e Métrica", x: 39, y: 175, post: "poetry",
    accent: "#ffd166", icon: "text",
  },

  // Computação · área das redes
  {
    id: "networks", continent: "cs", name: "Sala dos Pacotes",
    label: "Pacotes e Camadas", x: 244, y: 14, post: "networks",
    accent: "#61f4c0", icon: "network",
  },
  {
    id: "protocols", continent: "cs", name: "Torre dos Protocolos",
    label: "TCP, UDP e DNS", x: 260, y: 26, post: "protocols",
    accent: "#6bd5ff", icon: "cpu",
  },

  // Física · área da termodinâmica
  {
    id: "heat", continent: "physics", name: "Forja do Calor",
    label: "Calor e Temperatura", x: 106, y: 132, post: "heat",
    accent: "#ff7aa8", icon: "heat",
  },
  {
    id: "entropy", continent: "physics", name: "Poço da Entropia",
    label: "Entropia e Ciclos", x: 126, y: 146, post: "entropy",
    accent: "#ffb26b", icon: "fire",
  },

  // Química · área analítica
  {
    id: "analysis", continent: "chem", name: "Bancada Analítica",
    label: "Amostra e Titulação", x: 66, y: 132, post: "analysis",
    accent: "#7ee787", icon: "flask",
  },
  {
    id: "spectrum", continent: "chem", name: "Sala do Espectro",
    label: "Luz e Identidade", x: 84, y: 146, post: "spectrum",
    accent: "#6bd5ff", icon: "prism",
  },

  // Música · área da forma
  {
    id: "form", continent: "music", name: "Sala da Forma",
    label: "Motivo e Sonata", x: 262, y: 50, post: "form",
    accent: "#ffb26b", icon: "note",
  },
  {
    id: "counterpoint", continent: "music", name: "Galeria do Contraponto",
    label: "Vozes Simultâneas", x: 280, y: 62, post: "counterpoint",
    accent: "#ffd166", icon: "piano",
  },

  // Matemática · área da probabilidade
  {
    id: "chance", continent: "math", name: "Sala do Acaso",
    label: "Probabilidade e Esperança", x: 262, y: 84, post: "chance",
    accent: "#b48cff", icon: "dice",
  },
  {
    id: "statistics", continent: "math", name: "Torre das Estatísticas",
    label: "Média, Variância e Amostra", x: 280, y: 96, post: "statistics",
    accent: "#6bd5ff", icon: "chart",
  },

  // IA · área da linguagem
  {
    id: "tokens", continent: "ai", name: "Sala dos Tokens",
    label: "Token e Predição", x: 216, y: 128, post: "tokens",
    accent: "#6bd5ff", icon: "text",
  },
  {
    id: "context", continent: "ai", name: "Torre do Contexto",
    label: "Janela e Memória", x: 236, y: 140, post: "context",
    accent: "#8fe3ff", icon: "book",
  },

  // Língua · área da semântica
  {
    id: "meaning", continent: "lingua", name: "Sala do Sentido",
    label: "Referência e Sentido", x: 262, y: 128, post: "meaning",
    accent: "#e8c07a", icon: "book",
  },
  {
    id: "pragmatics", continent: "lingua", name: "Torre da Pragmática",
    label: "Intenção e Contexto", x: 280, y: 140, post: "pragmatics",
    accent: "#ffd166", icon: "text",
  },

  // Física · área da óptica
  {
    id: "lenses", continent: "physics", name: "Câmara Óptica",
    label: "Lentes e Imagens", x: 68, y: 168, post: "lenses",
    accent: "#ff7aa8", icon: "prism",
  },
  {
    id: "rainbow", continent: "physics", name: "Sala das Cores",
    label: "Dispersão e Espectro", x: 88, y: 180, post: "rainbow",
    accent: "#ffd166", icon: "eye",
  },

  // Computação · área da segurança
  {
    id: "security", continent: "cs", name: "Sala da Cifra",
    label: "Criptografia", x: 216, y: 166, post: "security",
    accent: "#61f4c0", icon: "chip",
  },
  {
    id: "crypto", continent: "cs", name: "Torre das Chaves",
    label: "Chaves e Assinaturas", x: 236, y: 178, post: "crypto",
    accent: "#6bd5ff", icon: "cpu",
  },
];

export const WAYSTONES = [
  { id: "hub", continent: "hub", name: "Pedra do Porto", x: 98, y: 64, accent: "#ffc857" },
  { id: "cs", continent: "cs", name: "Farol da Computação", x: 96, y: 28, accent: "#61f4c0" },
  { id: "math", continent: "math", name: "Farol da Matemática", x: 142, y: 64, accent: "#b48cff" },
  { id: "physics", continent: "physics", name: "Farol da Física", x: 96, y: 89, accent: "#ff7aa8" },
  { id: "chem", continent: "chem", name: "Farol da Química", x: 38, y: 64, accent: "#7ee787" },
  { id: "music", continent: "music", name: "Farol da Música", x: 58, y: 32, accent: "#ffb26b" },
  { id: "ai", continent: "ai", name: "Farol da IA", x: 122, y: 32, accent: "#6bd5ff" },
  { id: "lingua", continent: "lingua", name: "Farol da Língua", x: 29, y: 103, accent: "#e8c07a" },
  { id: "physics-em", continent: "physics", name: "Farol do Eletromagnetismo", x: 152, y: 104, accent: "#ffb26b" },
  { id: "cs-arch", continent: "cs", name: "Farol da Arquitetura", x: 204, y: 25, accent: "#61f4c0" },
  { id: "math-analysis", continent: "math", name: "Farol da Análise", x: 226, y: 78, accent: "#b48cff" },
  { id: "chem-organic", continent: "chem", name: "Farol da Orgânica", x: 31, y: 138, accent: "#7ee787" },
  { id: "music-acoustics", continent: "music", name: "Farol da Acústica", x: 59, y: 63, accent: "#ffb26b" },
  { id: "ai-vision", continent: "ai", name: "Farol da Visão", x: 168, y: 12, accent: "#6bd5ff" },
  { id: "lingua-literature", continent: "lingua", name: "Farol da Literatura", x: 30, y: 170, accent: "#e8c07a" },
  { id: "cs-net", continent: "cs", name: "Farol das Redes", x: 252, y: 20, accent: "#61f4c0" },
  { id: "physics-thermo", continent: "physics", name: "Farol da Termodinâmica", x: 116, y: 139, accent: "#ff7aa8" },
  { id: "chem-analytical", continent: "chem", name: "Farol da Analítica", x: 74, y: 139, accent: "#7ee787" },
  { id: "music-form", continent: "music", name: "Farol da Forma", x: 272, y: 56, accent: "#ffb26b" },
  { id: "math-prob", continent: "math", name: "Farol da Probabilidade", x: 272, y: 90, accent: "#b48cff" },
  { id: "ai-language", continent: "ai", name: "Farol da Linguagem", x: 226, y: 135, accent: "#6bd5ff" },
  { id: "lingua-semantics", continent: "lingua", name: "Farol da Semântica", x: 272, y: 135, accent: "#e8c07a" },
  { id: "physics-optics", continent: "physics", name: "Farol da Óptica", x: 78, y: 174, accent: "#ff7aa8" },
  { id: "cs-security", continent: "cs", name: "Farol da Segurança", x: 226, y: 173, accent: "#61f4c0" },
];

export const NPC_SPAWNS = [
  { id: "guia", continent: "hub", x: 94, y: 56, accent: "#ffc857" },
  { id: "ada", continent: "cs", x: 86, y: 24, accent: "#61f4c0" },
  { id: "hypatia", continent: "math", x: 158, y: 58, accent: "#b48cff" },
  { id: "marie", continent: "physics", x: 86, y: 104, accent: "#ff7aa8" },
  { id: "mendeleev", continent: "chem", x: 26, y: 60, accent: "#7ee787" },
  { id: "pythagoras", continent: "music", x: 46, y: 28, accent: "#ffb26b" },
  { id: "turing", continent: "ai", x: 136, y: 28, accent: "#6bd5ff" },
  { id: "teo", continent: "hub", x: 93, y: 59, accent: "#ffd166" },
  { id: "grace", continent: "cs", x: 85, y: 27, accent: "#7ef0b2" },
  { id: "euclides", continent: "math", x: 158, y: 61, accent: "#c7a4ff" },
  { id: "galileu", continent: "physics", x: 85, y: 107, accent: "#ff9cc0" },
  { id: "lavoisier", continent: "chem", x: 25, y: 63, accent: "#9bf0a8" },
  { id: "bach", continent: "music", x: 45, y: 31, accent: "#ffc489" },
  { id: "shannon", continent: "ai", x: 135, y: 31, accent: "#8fe3ff" },
  { id: "alzira", continent: "lingua", x: 33, y: 102, accent: "#e8c07a" },
  { id: "faraday", continent: "physics", x: 146, y: 111, accent: "#ffb26b" },
  { id: "vonneumann", continent: "cs", x: 196, y: 29, accent: "#61f4c0" },
  { id: "cauchy", continent: "math", x: 219, y: 84, accent: "#b48cff" },
  { id: "kekule", continent: "chem", x: 27, y: 141, accent: "#7ee787" },
  { id: "helmholtz", continent: "music", x: 55, y: 59, accent: "#ffb26b" },
  { id: "marr", continent: "ai", x: 164, y: 15, accent: "#6bd5ff" },
  { id: "machado", continent: "lingua", x: 27, y: 174, accent: "#e8c07a" },
  { id: "baran", continent: "cs", x: 248, y: 23, accent: "#61f4c0" },
  { id: "carnot", continent: "physics", x: 111, y: 143, accent: "#ff7aa8" },
  { id: "liebig", continent: "chem", x: 69, y: 143, accent: "#7ee787" },
  { id: "schoenberg", continent: "music", x: 267, y: 60, accent: "#ffb26b" },
  { id: "laplace", continent: "math", x: 267, y: 94, accent: "#b48cff" },
  { id: "chomsky", continent: "ai", x: 221, y: 139, accent: "#6bd5ff" },
  { id: "saussure", continent: "lingua", x: 267, y: 139, accent: "#e8c07a" },
  { id: "huygens", continent: "physics", x: 73, y: 178, accent: "#ff7aa8" },
  { id: "diffie", continent: "cs", x: 221, y: 177, accent: "#61f4c0" },
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

export const CONTINENT_ORDER = ["hub", "cs", "math", "physics", "chem", "music", "ai", "lingua"];

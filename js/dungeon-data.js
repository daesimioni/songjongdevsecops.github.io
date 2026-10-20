// As cavernas: um mapa subterrâneo por continente, com salas temáticas,
// túneis que se cruzam, cidade no fundo e monstros que sobem de nível conforme
// a gente se afasta da entrada.
//
// ponytail: uma planta só serve às seis cavernas, variando tema, paleta,
// bichos e chefe. Planta própria por continente quando o mapa começar a
// parecer repetido.

export const DUNGEON_LAYOUT = {
  width: 64,
  height: 48,
  rooms: [
    { id: "entrada", x: 26, y: 39, w: 12, h: 6, tier: 0, kind: "entrance" },
    { id: "a", x: 12, y: 31, w: 9, h: 7, tier: 1 },
    { id: "b", x: 27, y: 29, w: 11, h: 7, tier: 1 },
    { id: "c", x: 45, y: 31, w: 9, h: 7, tier: 2 },
    { id: "d", x: 12, y: 17, w: 9, h: 7, tier: 2 },
    { id: "e", x: 27, y: 16, w: 11, h: 7, tier: 3 },
    { id: "f", x: 45, y: 17, w: 9, h: 7, tier: 3 },
    { id: "cidade", x: 23, y: 2, w: 18, h: 10, tier: 3, kind: "city" },
    // dois braços laterais que fecham o labirinto em anel
    { id: "g", x: 2, y: 24, w: 8, h: 6, tier: 2 },
    { id: "h", x: 55, y: 24, w: 7, h: 6, tier: 3 },
  ],
  corridors: [
    ["entrada", "b"],
    ["b", "a"],
    ["b", "c"],
    ["a", "d"],
    ["c", "f"],
    ["d", "e"],
    ["e", "f"],
    ["e", "cidade"],
    ["d", "b"],
    // atalhos que fecham o labirinto em anel: dá para se perder, e dá para
    // voltar por outro caminho.
    ["a", "e"],
    ["c", "d"],
    ["a", "g"],
    ["d", "g"],
    ["f", "h"],
    ["c", "h"],
  ],
  bossRoom: "f",
};

const COMMON = {
  cs: {
    name: "Catacumbas do Silício",
    sub: "onde os fios antigos ainda pulsam",
    material: "ferro",
    tunnel: "elbow",
    equipment: ["chave-longa", "colete-malha", "colar-corrente"],
    shift: { a: [-2, 1], c: [2, -1], g: [1, 2] },
    boss: "O Compilador Ancestral",
    rooms: [
      ["Boca do Silício", "entrada"],
      ["Galeria dos Fios", "circuitos"],
      ["Salão dos Relés", "lógica"],
      ["Arquivo Morto", "memória"],
      ["Forja de Clock", "tempo"],
      ["Câmara dos Algoritmos", "algoritmos"],
      ["Poço dos Dados", "dados"],
      ["Cidade do Núcleo", "cidade"],
      ["Sala dos Barramentos", "dados"],
      ["Cripta dos Periféricos", "memória"],
    ],
    monsters: ["Bit", "Loop", "Kernel", "Cache", "Pilha", "Fio", "Relé", "Clock", "Byte", "Nó", "Thread", "Barramento"],
    palette: { floor: "#173230", floor2: "#102522", wall: "#0a1719", wallTop: "#20423f", accent: "#61f4c0" },
  },
  math: {
    name: "Lavras do Infinito",
    sub: "corredores que não terminam na primeira volta",
    material: "veio",
    tunnel: "split",
    equipment: ["espada-prova", "manto-giz", "pernas-reforcadas", "anel-fractal"],
    shift: { b: [2, 1], d: [-2, -2], h: [-1, 2] },
    boss: "O Infinito Profundo",
    rooms: [
      ["Boca dos Números", "entrada"],
      ["Corredor dos Primos", "primos"],
      ["Sala dos Sólidos", "geometria"],
      ["Cripta dos Limites", "limites"],
      ["Poço do Infinito", "infinito"],
      ["Mercado dos Axiomas", "axiomas"],
      ["Torre dos Fractais", "fractais"],
      ["Cidade do Cálculo", "cidade"],
      ["Câmara dos Conjuntos", "axiomas"],
      ["Escada de Cantor", "infinito"],
    ],
    monsters: ["Primo", "Lema", "Axioma", "Delta", "Sigma", "Vértice", "Prova", "Límite", "Órbita", "Fractal"],
    palette: { floor: "#242044", floor2: "#191632", wall: "#100e24", wallTop: "#373066", accent: "#b48cff" },
  },
  physics: {
    name: "Cavernas do Campo",
    sub: "o calor, a luz e a queda moram aqui embaixo",
    material: "ferro",
    tunnel: "wide",
    equipment: ["cajado-luz", "lentes-prisma", "botas-marcha", "colar-inercia"],
    shift: { a: [2, 2], c: [-2, 2], e: [1, -1], h: [-2, 1] },
    boss: "O Observador Cego",
    rooms: [
      ["Fenda do Campo", "entrada"],
      ["Túnel do Pêndulo", "pêndulo"],
      ["Sala das Ondas", "ondas"],
      ["Forja do Calor", "calor"],
      ["Prisma Subterrâneo", "luz"],
      ["Observatório Cego", "órbita"],
      ["Poço Gravitacional", "gravidade"],
      ["Cidade das Órbitas", "cidade"],
      ["Câmara de Vácuo", "calor"],
      ["Poço de Kepler", "órbita"],
    ],
    monsters: ["Íon", "Vetor", "Quanta", "Fóton", "Pêndulo", "Entropia", "Massa", "Campo", "Órbita", "Prisma"],
    palette: { floor: "#33202a", floor2: "#261820", wall: "#170d13", wallTop: "#4a2c3b", accent: "#ff7aa8" },
  },
  chem: {
    name: "Minas do Reagente",
    sub: "um labirinto que muda de cor conforme o pH",
    material: "erva",
    tunnel: "cross",
    equipment: ["frasco-acido", "avental-alquimista", "escudo-cristal", "anel-equilibrio"],
    shift: { b: [-2, 2], d: [2, 1], g: [-1, -2] },
    boss: "O Catalisador",
    rooms: [
      ["Boca do Reagente", "entrada"],
      ["Galeria dos Elementos", "elementos"],
      ["Lago Ácido", "ácidos"],
      ["Forno de Ativação", "energia"],
      ["Câmara do Equilíbrio", "equilíbrio"],
      ["Mina de Cristais", "cristais"],
      ["Poço das Ligações", "ligações"],
      ["Cidade das Moléculas", "cidade"],
      ["Sala dos Isótopos", "elementos"],
      ["Cripta dos Polímeros", "ligações"],
    ],
    monsters: ["Átomo", "Mol", "Catalisador", "Elétron", "Próton", "Base", "Ácido", "Cristal", "Ligação", "Reagente"],
    palette: { floor: "#17301f", floor2: "#102318", wall: "#09160e", wallTop: "#245032", accent: "#7ee787" },
  },
  music: {
    name: "Conservatório Subterrâneo",
    sub: "a acústica das pedras guarda compassos antigos",
    material: "madeira",
    tunnel: "zigzag",
    equipment: ["batuta-maestro", "casaca-harmonia", "colar-ressonancia"],
    shift: { a: [-1, -2], c: [1, 2], e: [-2, 1] },
    boss: "A Dissonância",
    rooms: [
      ["Fenda Sonora", "entrada"],
      ["Corredor dos Compassos", "ritmo"],
      ["Sala dos Harmônicos", "harmonia"],
      ["Câmara do Silêncio", "silêncio"],
      ["Oficina dos Timbres", "timbre"],
      ["Poço das Razões", "razões"],
      ["Galeria das Escalas", "escalas"],
      ["Praça da Ópera", "cidade"],
      ["Sala dos Modos", "escalas"],
      ["Câmara da Reverb", "timbre"],
    ],
    monsters: ["Compasso", "Acorde", "Harmônico", "Timbre", "Oitava", "Quinta", "Escala", "Síncope", "Ressonância", "Dissonância"],
    palette: { floor: "#332715", floor2: "#261d0f", wall: "#171009", wallTop: "#4e3b1e", accent: "#ffb26b" },
  },
  ai: {
    name: "Rede Profunda",
    sub: "túneis de dados e uma cidade que aprende sozinha",
    material: "veio",
    tunnel: "narrow",
    equipment: ["cajado-vetores", "capuz-dados", "anel-atencao"],
    shift: { b: [1, -2], d: [-2, 1], f: [2, -1] },
    boss: "A Caixa Preta",
    rooms: [
      ["Boca da Máquina", "entrada"],
      ["Túneis dos Dados", "dados"],
      ["Sala dos Pesos", "pesos"],
      ["Poço do Gradiente", "gradiente"],
      ["Câmara da Atenção", "atenção"],
      ["Mina de Vetores", "vetores"],
      ["Galeria dos Tokens", "tokens"],
      ["Cidade das Máquinas", "cidade"],
      ["Sala dos Hiperparâmetros", "pesos"],
      ["Cripta do Contexto", "atenção"],
    ],
    monsters: ["Token", "Perceptron", "Gradiente", "Peso", "Vetor", "Camada", "Atenção", "Época", "Ruído", "Caixa"],
    palette: { floor: "#122b3b", floor2: "#0c1f2b", wall: "#07131b", wallTop: "#204760", accent: "#6bd5ff" },
  },
};

export const DUNGEONS = Object.entries(COMMON).map(([continent, d]) => {
  // metade das cavernas espelha as salas laterais: mesmo desenho de túneis,
  // geografia diferente, sem duplicar a planta inteira.
  const mirror = ["math", "music", "ai"].includes(continent);
  return {
    id: `dungeon-${continent}`,
    continent,
    ...d,
    rooms: DUNGEON_LAYOUT.rooms.map((room, i) => {
      const [dx, dy] = d.shift?.[room.id] || [0, 0];
      const x = room.x + dx;
      return {
        ...room,
        x: mirror ? DUNGEON_LAYOUT.width - x - room.w : x,
        y: room.y + dy,
        name: d.rooms[i][0],
        theme: d.rooms[i][1],
      };
    }),
    tunnel: d.tunnel || "elbow",
  };
});

export function dungeonById(id) {
  return DUNGEONS.find((d) => d.id === id) || null;
}

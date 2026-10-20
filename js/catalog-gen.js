// O gerador do catálogo: transforma catálogo + posições + banco em área,
// estação, post, caverna, caçada, NPC, missão e pergunta. Sem banco, a área
// não entra: o teste cobra cobertura, não sobra ilha vazia.

import { CATALOG, DISCIPLINES } from "./catalog.js";
import { CATALOG_AREAS } from "./catalog-layout.js";
import { BANK } from "./catalog-bank.js";

const TILES = {
  math: { base: 12, floor: 13, path: 13 },
  physics: { base: 14, floor: 15, path: 15 },
  chem: { base: 16, floor: 17, path: 17 },
  cs: { base: 10, floor: 11, path: 11 },
  lingua: { base: 0, floor: 12, path: 1 },
  inter: { base: 0, floor: 19, path: 1 },
};

const DECOR = {
  math: [["compass", "book", "star"], ["pillar", "orb", "book"], ["die", "star", "orb"]],
  physics: [["coil", "crystal", "wave"], ["gauge", "coil", "crystal"], ["lens", "star", "orb"]],
  chem: [["molecule", "flask", "bubble"], ["flask", "molecule", "crystal"], ["molecule", "bubble", "star"]],
  cs: [["rack", "terminal", "node"], ["antenna", "rack", "crystal"], ["lock", "terminal", "node"]],
  lingua: [["quill", "book", "flower"], ["mask", "book", "star"], ["book", "flower", "quill"]],
  inter: [["book", "orb", "star"], ["crystal", "book", "wave"], ["pillar", "orb", "star"]],
};

// instrumento de cada estação: casa por palavra do tópico e, se não casar,
// gira entre os instrumentos da disciplina
const LAB_RULES = [
  [/lógic|prova|demonstra|contraexemplo|argument/, "logic"],
  [/infinit|limite|série|sucess|assíntot/, "infinity"],
  [/derivada|integral|cálculo|equaç|diferen/, "calculus"],
  [/probab|estatístic|aleat|distribui|amostr/, "probability"],
  [/fractal|caos|dimens|topolog/, "fractal"],
  [/onda|frequên|harmônic|fourier|som|áudio|música/, "fourier"],
  [/movimento|força|pêndulo|cinemát|mecânic|inércia/, "motion"],
  [/calor|termodinâm|entropia|temperatura|energia livre/, "thermo"],
  [/luz|óptic|lente|cor|espectro|fóton/, "optics"],
  [/gravit|órbita|estrela|galáx|cosmo|planet|astro/, "gravity"],
  [/elemento|períod|tabela/, "periodic"],
  [/ligação|molécul|orbital|estrutura molecular/, "bonds"],
  [/ácido|base|ph|titula|equilíbrio|solução/, "titration"],
  [/oxida|reduç|eletroquím|bateria/, "energy"],
  [/equilíbrio químico|balanço|estequiometr/, "balance"],
  [/bit|binári|porta|circuito|somador/, "adder"],
  [/processo|concorr|thread|estado|sistema operacional/, "state"],
  [/cpu|processador|cache|pipeline|microarquitetura/, "cpu"],
  [/históri|étic|impacto/, "history"],
  [/linguagem|texto|token|semântic|palavra/, "language"],
  [/fala|voz|som|oral/, "echo"],
  [/aprendizado|neural|inteligência artificial|\bia\b|treinamento/, "learning"],
  [/visão|imagem|pixel/, "vision"],
];
const LAB_FALLBACK = {
  math: ["logic", "infinity", "calculus", "probability"],
  physics: ["motion", "optics", "gravity"],
  chem: ["periodic", "bonds", "titration"],
  cs: ["adder", "cpu", "state"],
  lingua: ["language", "echo", "history"],
  inter: ["learning", "fourier", "language"],
};
// a pergunta do NPC não pode ter a resposta sempre na letra A
function quizFor(q, salt) {
  const correct = q.o[q.a];
  const base = [correct, q.o[(q.a + 1) % 6], q.o[(q.a + 2) % 6]];
  const shift = salt % 3;
  const options = [...base.slice(shift), ...base.slice(0, shift)];
  return { question: q.q, options, answer: options.indexOf(correct), why: q.why };
}

function labFor(topic, discipline, index) {
  const text = `${topic.name} ${topic.def}`.toLowerCase();
  for (const [re, lab] of LAB_RULES) if (re.test(text)) return lab;
  const list = LAB_FALLBACK[discipline] || LAB_FALLBACK.math;
  return list[index % list.length];
}

const LOOT = {
  math: { loot: ["regua", "teorema", "axioma"], boss: "infinito" },
  physics: { loot: ["ima", "prisma", "quanta"], boss: "orbita" },
  chem: { loot: ["frasco", "catalisador", "cristal"], boss: "pedra" },
  cs: { loot: ["parafuso", "chip", "fita"], boss: "nucleo" },
  lingua: { loot: ["pergaminho", "tinta", "letra"], boss: "camoes" },
  inter: { loot: ["regua", "frasco", "pergaminho"], boss: "infinito" },
};

const ICONS = {
  math: ["shape", "infinity", "curve", "dice", "chart", "clock"],
  physics: ["pendulum", "wave", "planet", "heat", "prism", "scale"],
  chem: ["flask", "molecule", "fire", "table", "scale", "chain"],
  cs: ["chip", "cpu", "network", "terminal", "chart", "radio"],
  lingua: ["book", "text", "eye", "sign", "note", "chart"],
  inter: ["book", "chart", "eye", "terminal", "wave", "network"],
};

// nomes de quem habita cada arquipélago; ids únicos no mundo
const KEEPERS = {
  math: [["gauss", "Gauss"], ["noether", "Noether"], ["cantor", "Cantor"], ["euler", "Euler"], ["riemann", "Riemann"], ["poincare", "Poincaré"], ["ramanujan", "Ramanujan"], ["fibonacci", "Fibonacci"], ["hilbert", "Hilbert"], ["leibniz", "Leibniz"], ["pascal", "Pascal"]],
  physics: [["hooke", "Hooke"], ["planck", "Planck"], ["bohr", "Bohr"], ["einstein", "Einstein"], ["feynman", "Feynman"], ["maxwell", "Maxwell"], ["kepler", "Kepler"], ["tesla", "Tesla"], ["hawking", "Hawking"], ["fermi", "Fermi"], ["schrodinger", "Schrödinger"], ["heisenberg", "Heisenberg"]],
  chem: [["dalton", "Dalton"], ["pauling", "Pauling"], ["arrhenius", "Arrhenius"], ["avogadro", "Avogadro"], ["berzelius", "Berzelius"], ["roentgen", "Röntgen"], ["prout", "Prout"], ["leblanc", "Leblanc"], ["wohler", "Wöhler"], ["cannizzaro", "Cannizzaro"], ["ramsay", "Ramsay"]],
  cs: [["lovelace", "Lovelace"], ["hopper", "Hopper"], ["dijkstra", "Dijkstra"], ["knuth", "Knuth"], ["lamport", "Lamport"], ["tanenbaum", "Tanenbaum"], ["ritchie", "Ritchie"], ["thompson", "Thompson"], ["torvalds", "Torvalds"], ["berners", "Berners-Lee"], ["shamir", "Shamir"], ["cerf", "Cerf"], ["mccarthy", "McCarthy"], ["kahn", "Kahn"]],
  lingua: [["camoes", "Camões"], ["cecilia", "Cecília"], ["drummond", "Drummond"], ["guimaraes", "Guimarães"], ["clarice", "Clarice"], ["vieira", "Vieira"], ["pessoa", "Pessoa"], ["saramago", "Saramago"], ["bechara", "Bechara"], ["cunha", "Cunha"], ["said", "Said Ali"], ["bosi", "Bosi"], ["coutinho", "Coutinho"]],
  inter: [["descartes", "Descartes"], ["nash", "Nash"], ["mandelbrot", "Mandelbrot"], ["wiener", "Wiener"], ["mcluhan", "McLuhan"], ["sapir", "Sapir"], ["whorf", "Whorf"], ["vonbertalanffy", "Bertalanffy"], ["kolmogorov", "Kolmogorov"], ["godel", "Gödel"], ["hofstadter", "Hofstadter"]],
};

const WORDS = {
  math: ["Prova", "Teorema", "Lema", "Axioma", "Corolário", "Conjectura", "Inferência", "Demonstração", "Silogismo", "Estrutura", "Invariante"],
  physics: ["Campo", "Órbita", "Quanta", "Entropia", "Fóton", "Gradiente", "Tensor", "Plasma", "Núcleo", "Onda", "Simetria"],
  chem: ["Valência", "Molécula", "Cátion", "Ânion", "Catalisador", "Entalpia", "Solvente", "Precipitado", "Isótopo", "Ligante", "Reação"],
  cs: ["Ponteiro", "Compilador", "Pacote", "Bit", "Registro", "Thread", "Cache", "Nó", "Instrução", "Protocolo", "Consulta"],
  lingua: ["Fonema", "Morfema", "Sintagma", "Coesão", "Coerência", "Gênero", "Registro", "Variante", "Semema", "Enunciado", "Estrofe"],
  inter: ["Ponte", "Diálogo", "Modelo", "Método", "Dado", "Linguagem", "Experimento", "Prova", "Sistema", "Hipótese", "Medida"],
};

// paleta da caverna a partir da cor da disciplina
function shade(hex, amount) {
  const n = parseInt(hex.replace("#", ""), 16);
  const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
  const r = clamp(((n >> 16) & 255) * (1 + amount));
  const g = clamp(((n >> 8) & 255) * (1 + amount));
  const b = clamp((n & 255) * (1 + amount));
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, "0")}`;
}

// título com as palavras pequenas do português em minúscula
const SMALL = new Set(["e", "de", "da", "do", "das", "dos", "em", "no", "na", "nos", "nas", "a", "o", "as", "os", "um", "uma", "para", "com", "por", "ao", "à"]);
// artigo da área, para "Cripta dos Fundamentos" e não "Cripta da Fundamentos"
function articleOf(name) {
  const m = /^Área (da|das|do|dos) (.+)$/.exec(String(name || ""));
  if (m) return { article: m[1], noun: m[2] };
  return { article: "da", noun: String(name || "").replace(/^Área /, "") };
}

const titleCase = (text) => String(text || "").split(/\s+/).map((word, i) => {
  const clean = word.toLowerCase();
  if (word.length <= 5 && word === word.toUpperCase() && /[A-Z]/.test(word)) return word;
  if (i > 0 && SMALL.has(clean)) return clean;
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}).join(" ");

export function buildCatalogContent() {
  const areas = [];
  const sites = [];
  const waystones = [];
  const npcSpawns = [];
  const posts = {};
  const npcs = {};
  const dungeons = {};
  const grounds = [];
  const quests = [];
  const questions = [];
  const decor = {};

  const keeperIndex = {};
  for (const spot of CATALOG_AREAS) {
    const area = CATALOG.find((a) => a.id === spot.id);
    const bank = BANK[spot.discipline]?.[spot.id];
    if (!area || !bank) continue;
    const discipline = DISCIPLINES[spot.discipline];
    const tiles = TILES[spot.discipline] || TILES.math;
    const accent = discipline.accent;
    const { article, noun } = articleOf(area.name);
    // a interseção pertence ao continente da primeira disciplina que liga, para
    // perguntas, caçada e duelo caírem num baralho que existe
    const continent = spot.discipline === "inter"
      ? DISCIPLINES[area.links?.[0] || "math"].continent
      : discipline.continent;
    const order = (keeperIndex[spot.discipline] = (keeperIndex[spot.discipline] || 0) + 1) - 1;
    const [keeperId, keeperName] = (KEEPERS[spot.discipline] || KEEPERS.inter)[order % (KEEPERS[spot.discipline] || KEEPERS.inter).length];
    const words = WORDS[spot.discipline] || WORDS.inter;

    areas.push({
      id: area.id,
      continent,
      name: area.name,
      sub: area.sub,
      land: spot.land,
      rect: spot.rect,
      base: tiles.base,
      floor: tiles.floor,
      path: tiles.path,
      accent,
      catalog: true,
    });

    const families = DECOR[spot.discipline] || DECOR.inter;
    decor[area.id] = families[order % families.length];

    waystones.push({ id: area.id, continent, name: `Farol ${article} ${noun}`, x: spot.waystone.x, y: spot.waystone.y, accent });

    bank.forEach((topic, i) => {
      const postId = `${area.id}-${i + 1}`;
      const siteName = titleCase(topic.name);
      sites.push({
        id: postId,
        continent,
        name: siteName,
        label: topic.name,
        x: i === 0 ? spot.sites[0].x : i === 1 ? spot.sites[1].x : spot.waystone.x + 5,
        y: i === 0 ? spot.sites[0].y : i === 1 ? spot.sites[1].y : spot.waystone.y + 2,
        post: postId,
        accent,
        icon: (ICONS[spot.discipline] || ICONS.inter)[i % 6],
      });
      const body = `<p>${topic.def}</p><ul>${topic.keys.map((k) => `<li>${k}</li>`).join("")}</ul><blockquote>${topic.mistake}</blockquote>`;
      posts[postId] = {
        kicker: `${discipline.name.toLowerCase()} · ${area.short.toLowerCase()}`,
        title: siteName,
        date: "2026-10-20",
        read: "4 min",
        tags: [discipline.name.toLowerCase(), area.short.toLowerCase()],
        continent,
        lab: labFor(topic, spot.discipline, i),
        body,
      };
      questions.push({
        continent,
        area: area.id,
        tier: i + 1,
        // o banco guarda 6 alternativas; o baralho base guarda 3 e o duelo
        // completa até seis na hora da pergunta
        q: {
          q: topic.q.q,
          options: [topic.q.o[topic.q.a], topic.q.o[(topic.q.a + 1) % 6], topic.q.o[(topic.q.a + 2) % 6]],
          a: 0,
          why: topic.q.why,
        },
      });
    });

    const shortWords = bank.map((t) => t.name.split(" ")[0]);
    npcSpawns.push({ id: keeperId, continent, x: spot.npc.x, y: spot.npc.y, accent });
    npcs[keeperId] = {
      name: keeperName,
      lines: [
        `${area.name}. ${area.sub}.`,
        `Estude por aqui: ${shortWords.join(", ")}. Cada estação tem o que ler e o que mexer.`,
        `Cuidado com o engano clássico: ${bank[0].mistake}`,
        `A caverna daqui embaixo guarda o que ainda não foi respondido. Volte com vida.`,
      ],
    };
    npcs[`trainer-${area.id}`] = {
      name: `Mestre ${keeperName}`,
      lines: [
        `Treino da ${area.short}, sem caverna e sem susto.`,
        `Comece por ${shortWords[0]}; a pergunta da clareira cobra o mesmo.`,
        `Se errar aqui, não dói. Lá embaixo dói.`,
      ],
    };
    quests.push({
      id: `missao-${area.id}`,
      npc: keeperId,
      giver: keeperName,
      title: area.name.replace("Área", "Missão"),
      brief: `${area.sub}. ${bank[1].mistake}`,
      goal: { type: "quiz" },
      quiz: quizFor(bank[1].q, order),
      reward: { xp: 38, title: `Aprendiz de ${keeperName}` },
    });

    const roomThemes = [shortWords[0], shortWords[1], shortWords[2], words[0], words[1], words[2], words[3], words[4], words[5], words[6]].map((w) => String(w).toLowerCase());
    // cada terceira caverna usa outra planta: espelhada e com salas deslocadas
    const SHIFTS = [
      { b: [2, -2], e: [-1, 2], h: [2, 1] },
      { a: [1, 1], c: [-1, -1], g: [0, 2] },
      { d: [1, -1], f: [-1, 1], h: [-2, 0] },
    ];
    dungeons[area.id] = {
      continent,
      name: `Cripta ${article} ${noun}`,
      sub: area.sub,
      material: "veio",
      mirror: order % 2 === 1,
      shift: SHIFTS[order % 3],
      tunnel: ["wide", "split", "zigzag", "cross"][order % 4],
      equipment: [],
      boss: `O Guardião ${article} ${noun}`,
      rooms: [
        [`Boca ${article} ${noun}`, "entrada"],
        [`Sala ${titleCase(shortWords[0])}`, roomThemes[0]],
        [`Corredor ${titleCase(shortWords[1])}`, roomThemes[1]],
        [`Cripta ${titleCase(shortWords[2])}`, roomThemes[2]],
        [`Oficina ${titleCase(words[0])}`, roomThemes[3]],
        [`Poço ${titleCase(words[1])}`, roomThemes[4]],
        [`Torre ${titleCase(words[2])}`, roomThemes[5]],
        [`Praça ${article} ${noun}`, "cidade"],
        [`Câmara ${titleCase(words[3])}`, roomThemes[6]],
        [`Galeria ${titleCase(words[4])}`, roomThemes[7]],
      ],
      monsters: [
        shortWords[0], shortWords[1], shortWords[2],
        words[0], words[1], words[2], words[3], words[4], words[5], words[6], words[7],
      ],
      palette: { floor: shade(accent, -0.75), floor2: shade(accent, -0.84), wall: "#0b0d18", wallTop: shade(accent, -0.5), accent },
    };

    const loot = LOOT[spot.discipline] || LOOT.math;
    grounds.push({
      id: area.id,
      continent,
      dungeon: `dungeon-${area.id}`,
      name: `Caçada ${article} ${noun}`,
      center: { x: spot.hunt.x, y: spot.hunt.y },
      banner: { x: 0, y: -3 },
      lever: { x: -3, y: 3 },
      loot: loot.loot,
      bossLoot: loot.boss,
      monsters: [
        { id: `${area.id}-m1`, name: shortWords[0], tier: 1, kind: "slime", dx: -3, dy: 1 },
        { id: `${area.id}-m2`, name: shortWords[1], tier: 2, kind: "eye", dx: 3, dy: -1 },
        { id: `${area.id}-m3`, name: shortWords[2], tier: 3, kind: "golem", dx: 0, dy: 3 },
      ],
      boss: { id: `${area.id}-boss`, name: `O Guardião ${article} ${noun}`, kind: "boss", dx: 0, dy: 0 },
      keeper: keeperId,
    });
  }

  return { areas, sites, waystones, npcSpawns, posts, npcs, dungeons, grounds, quests, questions, decor };
}

export const CATALOG_CONTENT = buildCatalogContent();
export const CATALOG_READY = new Set(CATALOG_CONTENT.areas.map((a) => a.id));

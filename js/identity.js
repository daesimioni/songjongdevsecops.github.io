// A identidade de cada canto do mapa: bioma, fauna, itens, guardião, traje e
// caverna. O que é derivado sai do id da área para não repetir tom; o que é
// curado (nome do bioma) mora aqui e pode ser trocado sem mexer no resto.

import { CATALOG, DISCIPLINES } from "./catalog.js";
import { LEGACY_AREAS } from "./areas.js";
import { SECTION_TOPICS } from "./catalog-topics.js";
import { articleOf, titleCase, topicLabel } from "./catalog-text.js";
import { HAIRS } from "./avatar.js";

// ---------------------------------------------------------------- nomes
// Um bioma por área. O nome é a parte curada desta camada.
const BIOME_NAMES = {
  // Matemática
  "math-fundamentos": "Jardim dos Axiomas",
  "math-aritmetica": "Feira dos Números",
  "math-algebra": "Canteiro das Álgebras",
  "math-geometria": "Praça das Formas",
  "math-topologia": "Penhasco dos Invariantes",
  "math-analysis": "Enseada dos Limites",
  "math-edo": "Corredeira do Caos",
  "math-discreta": "Labirinto Discreto",
  "math-prob": "Colina do Acaso",
  "math-otimizacao": "Oficina do Ótimo",
  "math-aplicada": "Pomar Aplicado",
  // Física
  "physics-fundamentos": "Bancada dos Fundamentos",
  "physics-mecanica": "Pátio das Máquinas",
  "physics-fluidos": "Mares de Fluido",
  "physics-thermo": "Forja da Entropia",
  "physics-em": "Cais Eletromagnético",
  "physics-optics": "Jardim Prismático",
  "physics-eletronica": "Vila dos Dispositivos",
  "physics-relatividade": "Ponte do Espaço-Tempo",
  "physics-quantica": "Poço Quântico",
  "physics-atomica": "Orquidário Atômico",
  "physics-nuclear": "Cratera Nuclear",
  "physics-condensada": "Geleira Condensada",
  "physics-plasma": "Vento de Plasma",
  "physics-astro": "Observatório Estelar",
  "physics-outras": "Campo Aplicado",
  // Química
  "chem-fundamentos": "Berço dos Elementos",
  "chem-geral": "Praça das Reações",
  "chem-inorganica": "Mina Inorgânica",
  "chem-organic": "Horto do Carbono",
  "chem-fisica": "Ribeira Físico-Química",
  "chem-analytical": "Alfândega Analítica",
  "chem-bioquimica": "Bosque Biomolecular",
  "chem-polimeros": "Fábrica de Cadeias",
  "chem-materiais": "Areal dos Materiais",
  "chem-ambiental": "Lago Ambiental",
  "chem-industrial": "Complexo Industrial",
  "chem-computacional": "Estufa Computacional",
  "chem-outras": "Quintal das Especiais",
  // Computação
  "cs-fundamentos": "Portão dos Bits",
  "cs-algoritmos": "Trilha dos Algoritmos",
  "cs-teorica": "Ruínas da Computabilidade",
  "cs-linguagens": "Torre das Linguagens",
  "cs-engenharia": "Canteiro de Software",
  "cs-sistemas": "Castelo dos Processos",
  "cs-arch": "Bancada da Arquitetura",
  "cs-net": "Malha das Redes",
  "cs-distribuida": "Arquipélago Distribuído",
  "cs-dados": "Cofre dos Dados",
  "cs-ia": "Jardim das Máquinas",
  "cs-security": "Forte da Segurança",
  "cs-devops": "Estação DevOps",
  "cs-interfaces": "Vitrine das Interfaces",
  "cs-hardware": "Oficina de Robótica",
  "cs-dataciencia": "Farol da Ciência de Dados",
  "cs-emergente": "Portal Emergente",
  // Língua
  "lingua-gramatica": "Claustro da Gramática",
  "lingua-semantics": "Praça do Sentido",
  "lingua-pragmatica": "Mercado da Pragmática",
  "lingua-linguistica": "Bosque da Linguística",
  "lingua-discurso": "Rio do Discurso",
  "lingua-leitura": "Varanda da Leitura",
  "lingua-redacao": "Ateliê da Redação",
  "lingua-argumentacao": "Ágora da Argumentação",
  "lingua-generos": "Circo dos Gêneros",
  "lingua-oralidade": "Coreto da Oralidade",
  "lingua-literature": "Biblioteca da Literatura",
  "lingua-historia": "Museu da Língua",
  "lingua-lexico": "Feira do Léxico",
  "lingua-semitica": "Galeria Semiótica",
  "lingua-traducao": "Casa da Tradução",
  // Bônus
  "music-acoustics": "Pátio das Ressonâncias",
  "music-form": "Jardim das Formas Musicais",
  "ai-vision": "Vale das Bordas",
  "ai-language": "Porto dos Tokens",
  // Interseções
  "inter-math-physics": "Palco da Física Matemática",
  "inter-math-chem": "Alquimia Matemática",
  "inter-math-cs": "Circuito Matemático",
  "inter-math-lingua": "Claustro da Lógica Viva",
  "inter-physics-chem": "Forja Físico-Química",
  "inter-physics-cs": "Laboratório Computacional",
  "inter-physics-lingua": "Estação da Comunicação",
  "inter-chem-cs": "Oficina Química Digital",
  "inter-chem-lingua": "Bazar da Linguagem Química",
  "inter-cs-lingua": "Oficina da Língua Máquina",
  "inter-todas": "Praça das Cinco",
};

const HUE = { math: 268, physics: 342, chem: 132, cs: 166, lingua: 42, music: 28, ai: 198, inter: 48 };
const PATTERNS = ["dots", "grid", "waves", "runes", "cracks", "stars", "dunes", "bricks"];
const SPECIES = {
  math: ["eye", "golem", "slime", "beetle", "moth", "crab"],
  physics: ["wisp", "golem", "crab", "moth", "eye", "spider"],
  chem: ["jelly", "slime", "serpent", "beetle", "eye", "moth"],
  cs: ["ant", "sentinel", "eye", "spider", "beetle", "golem"],
  lingua: ["imp", "serpent", "moth", "eye", "bat", "slime"],
  music: ["moth", "wisp", "imp", "bat", "spider", "slime"],
  ai: ["sentinel", "eye", "moth", "ant", "wisp", "golem"],
  inter: ["sentinel", "wisp", "imp", "moth", "golem", "serpent"],
};
// o material que a caverna escava, por disciplina
const MATERIALS = {
  math: ["giz", "ardósia", "papel"],
  physics: ["cobre", "vidro", "ferro"],
  chem: ["âmbar", "cristal", "cerâmica"],
  cs: ["silício", "cobre", "fibra"],
  lingua: ["papel", "pergaminho", "tinta"],
  music: ["ébano", "latão", "veludo"],
  ai: ["silício", "vidro", "cobre"],
  inter: ["vidro", "latão", "obsidiana"],
};
const ADJETIVO = {
  math: "Matemáticos",
  physics: "Físicos",
  chem: "Químicos",
  cs: "Computacionais",
  lingua: "Linguísticos",
  inter: "Interdisciplinares",
};

// ---------------------------------------------------------------- utilidades
const hash = (text) => {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
};
const clamp = (v) => Math.max(0, Math.min(255, Math.round(v)));
// "no Jardim", "na Praça", "nos Mares": o nome do bioma pede a preposição certa
const DE_BIOMA = { no: "do", na: "da", nos: "dos", nas: "das" };
export function deBioma(nome) {
  return DE_BIOMA[prepBioma(nome)] || "do";
}
export function prepBioma(nome) {
  const primeira = String(nome).split(" ")[0].toLowerCase();
  if (primeira.endsWith("as")) return "nas";
  if (primeira.endsWith("a")) return "na";
  if (primeira.endsWith("s")) return "nos";
  return "no";
}
function hsl(h, s, l) {
  const hh = ((h % 360) + 360) % 360;
  const ss = s / 100;
  const ll = l / 100;
  const a = ss * Math.min(ll, 1 - ll);
  const f = (n) => {
    const k = (n + hh / 30) % 12;
    const c = ll - a * Math.max(-1, Math.min(k - 3, 9 - k, 1));
    return clamp(c * 255);
  };
  return `#${[f(0), f(8), f(4)].map((v) => v.toString(16).padStart(2, "0")).join("")}`;
}

// ---------------------------------------------------------------- áreas
const porExistente = new Map(CATALOG.filter((a) => a.existing).map((a) => [a.existing, a]));
const AREAS = [];
for (const a of CATALOG) {
  if (a.existing) continue;
  AREAS.push({ id: a.id, discipline: a.discipline, num: a.num, name: a.name, short: a.short, sub: a.sub, links: a.links });
}
for (const area of LEGACY_AREAS) {
  const c = porExistente.get(area.id);
  if (c) {
    AREAS.push({ id: area.id, discipline: c.discipline, num: c.num, name: area.name, short: c.short, sub: area.sub, links: c.links, legacy: true });
  } else {
    const bônus = area.id.startsWith("music") ? "music" : "ai";
    AREAS.push({
      id: area.id,
      discipline: bônus,
      num: null,
      name: area.name,
      short: titleCase(articleOf(area.name).noun),
      sub: area.sub,
      links: null,
      bonus: true,
      legacy: true,
    });
  }
}

const ordemPorDisciplina = {};
for (const a of AREAS) (ordemPorDisciplina[a.discipline] ||= []).push(a);
for (const lista of Object.values(ordemPorDisciplina)) {
  lista.sort((a, b) => (a.num || "9").localeCompare(b.num || "9", "pt-BR", { numeric: true }));
}

// matiz de cada área: espalha a disciplina e, na interseção, mistura as mães
function hueFor(area) {
  const lista = ordemPorDisciplina[area.discipline];
  const i = lista.findIndex((a) => a.id === area.id);
  if (area.discipline === "inter") {
    const links = area.links || ["math", "physics"];
    const media = links.reduce((n, d) => n + HUE[d], 0) / links.length;
    return media + (i - lista.length / 2) * 9;
  }
  return HUE[area.discipline] + (i - (lista.length - 1) / 2) * 13;
}

// ---------------------------------------------------------------- bioma
export const BIOMES = {};
export const TILE_STYLE = {};
let proximoKind = 40;
// dois matizes próximos podem arredondar para o mesmo RGB no tom escuro: a
// cor é ajustada até ser única, senão duas áreas ficam com o mesmo piso
const coresUsadas = new Set();
function corUnica(h, s, l) {
  let hh = h;
  let ll = l;
  let voltas = 0;
  while (coresUsadas.has(hsl(hh, s, ll)) && voltas < 240) {
    ll += 1;
    if (ll > 34) { ll = l; hh += 2; }
    voltas++;
  }
  const cor = hsl(hh, s, ll);
  coresUsadas.add(cor);
  return cor;
}

for (const area of AREAS) {
  const hue = hueFor(area);
  const ordem = ordemPorDisciplina[area.discipline].findIndex((a) => a.id === area.id);
  const pattern = PATTERNS[(ordem + hash(area.id)) % PATTERNS.length];
  const base = corUnica(hue, 26, 10 + (ordem % 4));
  const floor = corUnica(hue, 30, 15 + (ordem % 3));
  const path = corUnica(hue, 34, 27 + (ordem % 3));
  const accent = corUnica(hue, 58, 56 + (ordem % 3));
  const accent2 = corUnica(hue + 24, 62, 62 + (ordem % 3));
  const nome = BIOME_NAMES[area.id] || `Domínio ${articleOf(area.name).article} ${articleOf(area.name).noun}`;
  const materials = MATERIALS[area.discipline] || MATERIALS.math;
  const biome = {
    id: area.id,
    name: nome,
    hue,
    pattern,
    base,
    floor,
    path,
    accent,
    accent2,
    baseKind: proximoKind++,
    floorKind: proximoKind++,
    material: materials[ordem % materials.length],
    discipline: area.discipline,
    short: area.short,
    ordem,
  };
  BIOMES[area.id] = biome;
  TILE_STYLE[biome.baseKind] = { color: base, accent, pattern, base: true, biome: area.id };
  TILE_STYLE[biome.floorKind] = { color: floor, accent, pattern, base: false, biome: area.id };
}

// ---------------------------------------------------------------- fauna
const usadosBicho = new Set();
function topicosDaArea(area) {
  const sec = area.num ? SECTION_TOPICS[area.num] : null;
  if (!sec) return [area.sub || area.name];
  const pool = [];
  for (const [, lista] of sec.subareas || []) pool.push(...lista);
  pool.push(...(sec.topics || []));
  return pool.length ? pool : [area.sub || area.name];
}

export const FAUNA = {};
for (const area of AREAS) {
  const bioma = BIOMES[area.id];
  const pool = topicosDaArea(area);
  const kinds = SPECIES[area.discipline] || SPECIES.math;
  const lista = [];
  for (let passo = 0; passo < pool.length * 2 && lista.length < 3; passo++) {
    const bruto = pool[(bioma.ordem * 7 + passo * 5) % pool.length];
    let nome = topicLabel(bruto).split(/[,:;(]/)[0].trim();
    if (nome.length < 4) continue;
    nome = nome.charAt(0).toUpperCase() + nome.slice(1);
    if (usadosBicho.has(nome.toLowerCase())) {
      nome = `${nome} de ${area.short}`;
    }
    if (usadosBicho.has(nome.toLowerCase())) continue;
    usadosBicho.add(nome.toLowerCase());
    lista.push({
      id: `${area.id}-m${lista.length + 1}`,
      name: nome,
      kind: kinds[(bioma.ordem + lista.length) % kinds.length],
      accent: hsl(bioma.hue + 150 + lista.length * 55, 64, 62),
    });
  }
  while (lista.length < 3) {
    const nome = `${area.short} ${["Errante", "Antigo", "Faminto"][lista.length]} de ${BIOMES[area.id].name}`;
    if (!usadosBicho.has(nome.toLowerCase())) {
      usadosBicho.add(nome.toLowerCase());
      lista.push({ id: `${area.id}-m${lista.length + 1}`, name: nome, kind: kinds[lista.length % kinds.length], accent: hsl(bioma.hue + 150 + lista.length * 55, 64, 62) });
    }
  }
  FAUNA[area.id] = lista;
}

// ---------------------------------------------------------------- itens
export const AREA_ITEMS = {};
const usadosItem = new Set();
function nomeItem(area, prefixo, base) {
  let nome = `${prefixo} ${base}`;
  if (usadosItem.has(nome.toLowerCase())) nome = `${prefixo} ${base} de ${DISCIPLINES[area.discipline]?.name || "Saber"}`;
  if (usadosItem.has(nome.toLowerCase())) nome = `${prefixo} ${base} ${area.short}`;
  usadosItem.add(nome.toLowerCase());
  return nome;
}
for (const area of AREAS) {
  const bioma = BIOMES[area.id];
  const { article, noun } = articleOf(area.name);
  const bicho = FAUNA[area.id][0]?.name || "o guardião";
  const prefixos = {
    weapon: ["Lâmina", "Cajado", "Martelo", "Estilete", "Bastão"],
    armor: ["Manto", "Casaca", "Colete", "Avental", "Capa"],
    helmet: ["Elmo", "Capuz", "Coroa", "Máscara", "Turbante"],
  };
  const ordem = bioma.ordem % 5;
  const idBase = area.id;
  AREA_ITEMS[area.id] = {
    weapon: {
      id: `${idBase}-lamina`,
      name: nomeItem(area, prefixos.weapon[ordem], `${article} ${noun}`),
      slot: "weapon",
      weapon: ["sword", "wand", "club"][bioma.ordem % 3],
      damage: 1 + (bioma.ordem % 2),
      continent: DISCIPLINES[area.discipline]?.continent || "hub",
      desc: `Forjada ${prepBioma(bioma.name)} ${bioma.name}, corta ${bicho.toLowerCase()} sem perder o fio.`,
    },
    armor: {
      id: `${idBase}-manto`,
      name: nomeItem(area, prefixos.armor[ordem], `${article} ${noun}`),
      slot: "armor",
      hp: 4 + (bioma.ordem % 3),
      continent: DISCIPLINES[area.discipline]?.continent || "hub",
      desc: `Pano de ${bioma.material} costurado para atravessar ${prepBioma(bioma.name)} ${bioma.name}.`,
    },
    helmet: {
      id: `${idBase}-elmo`,
      name: nomeItem(area, prefixos.helmet[ordem], `${article} ${noun}`),
      slot: "helmet",
      hp: 3 + (bioma.ordem % 2),
      continent: DISCIPLINES[area.discipline]?.continent || "hub",
      desc: `Protege a cabeça de quem já ouviu ${bicho.toLowerCase()} de perto e voltou para contar.`,
    },
  };
}

// ---------------------------------------------------------------- guardião
const PELES = ["#f0c9a8", "#d9a273", "#c68a5e", "#f4d6b8", "#e8b98c", "#a8744e"];
const CABELOS = ["#3a2a55", "#6b3a2a", "#1f3a5c", "#5c1f3a", "#1f5c4a", "#2b2b33", "#7a5a3a", "#b8b0d8"];

export function npcStyle(id, accent) {
  const h = hash(String(id));
  const hair = HAIRS[h % HAIRS.length];
  const gender = h % 2 ? "f" : "m";
  const skin = PELES[(h >>> 3) % PELES.length];
  const hairColor = CABELOS[(h >>> 5) % CABELOS.length];
  const shirt = accent || hsl(h % 360, 50, 55);
  const pants = hsl((h % 360) + 180, 28, 20);
  return {
    look: { gender, hair: hair.id },
    colors: { skin, hair: hairColor, shirt, pants, accent: hsl((h >>> 7) % 360, 60, 65) },
  };
}

// ---------------------------------------------------------------- trajes
export const AREA_OUTFITS = [];
const usadosTraje = new Set();
for (const area of AREAS) {
  const { article, noun } = articleOf(area.name);
  let nome = `Traje ${article} ${noun}`;
  if (usadosTraje.has(nome.toLowerCase())) nome = `Traje ${article} ${noun} ${area.short}`;
  usadosTraje.add(nome.toLowerCase());
  AREA_OUTFITS.push({
    id: `traje-${area.id}`,
    name: nome,
    quest: `trilha-${area.id}`,
    desc: `a roupa de quem explorou cada canto ${prepBioma(BIOMES[area.id].name)} ${BIOMES[area.id].name}`,
    colors: {
      shirt: BIOMES[area.id].accent2,
      pants: BIOMES[area.id].floor,
      accent: BIOMES[area.id].accent,
      trim: BIOMES[area.id].path,
    },
  });
}

// ---------------------------------------------------------------- missões
export function questsForArea(area, keeper, giver) {
  const bioma = BIOMES[area.id];
  const fauna = FAUNA[area.id];
  return [
    {
      id: `trilha-${area.id}`,
      npc: keeper,
      giver,
      title: `Trilha ${articleOf(area.name).article} ${articleOf(area.name).noun}`,
      brief: `Abra três estações de ${area.short} e volte para contar o que viu ${prepBioma(bioma.name)} ${bioma.name}. ${area.sub.charAt(0).toUpperCase()}${area.sub.slice(1)}.`,
      goal: { type: "cards", count: 3, area: area.id },
      reward: { xp: 55, title: `Andarilho ${articleOf(area.name).article} ${articleOf(area.name).noun}` },
    },
    {
      id: `chefe-${area.id}`,
      npc: keeper,
      giver,
      title: `O Chefe ${articleOf(area.name).article} ${articleOf(area.name).noun}`,
      brief: `${fauna[2]?.name || "O guardião"} espera no fundo da caverna de ${area.short}. Desça, responda e volte.`,
      goal: { type: "bosses", count: 1, area: area.id },
      reward: { xp: 90, title: `Vencedor ${deBioma(bioma.name)} ${bioma.name}` },
    },
  ];
}

// ---------------------------------------------------------------- caverna
export function dungeonIdentity(areaId) {
  const area = AREAS.find((a) => a.id === areaId);
  const bioma = BIOMES[areaId];
  if (!area || !bioma) return null;
  const { article, noun } = articleOf(area.name);
  const pool = topicosDaArea(area).map((t) => titleCase(topicLabel(t).split(/[,:;(]/)[0].trim())).filter((t) => t.length > 3);
  const salas = [];
  for (let i = 0; salas.length < 7 && i < pool.length * 2; i++) {
    const nome = pool[(bioma.ordem * 3 + i * 5) % pool.length];
    if (!salas.includes(nome)) salas.push(nome);
  }
  // algumas seções têm poucos tópicos únicos; completa com as salas da casa
  const extras = ["Salão", "Galeria", "Oficina", "Poço", "Torre", "Cripta", "Varanda"];
  let e = 0;
  while (salas.length < 7) {
    const nome = `${extras[e++]} ${article} ${noun}`;
    if (!salas.includes(nome)) salas.push(nome);
  }
  const nomes = FAUNA[areaId].map((m) => m.name);
  return {
    material: bioma.material,
    faixa: area.short,
    rooms: [
      [`Boca ${article} ${noun}`, "entrada"],
      ...salas.map((nome) => [`Sala ${nome}`, "sala"]),
      [`Praça ${article} ${noun}`, "cidade"],
      [`Câmara ${article} ${noun}`, "chefe"],
    ],
    monsters: [...nomes, ...nomes, ...nomes, ...nomes].slice(0, 10),
    palette: {
      floor: bioma.floor,
      floor2: bioma.base,
      wall: "#0b0d18",
      wallTop: bioma.path,
      accent: bioma.accent,
    },
    fauna: FAUNA[areaId].map((m) => m.kind),
  };
}

export const IDENTITY_AREAS = AREAS;

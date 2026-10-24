// O gerador do arquipélago: transforma catálogo + posições em área, estação,
// página de lore, caverna, caçada, NPC e missão. Sem pergunta, sem banco de
// estudo: o que sai daqui é só mundo, bicho, gente e trabalho.

import { CATALOG, DISCIPLINES } from "./catalog.js";
import { CATALOG_AREAS } from "./catalog-layout.js";
import { SECTION_TOPICS } from "./catalog-topics.js";
import { placeStations } from "./catalog-place.js";
import { AREA_ITEMS, BIOMES, FAUNA, dungeonIdentity } from "./identity.js";

// A mesma paleta por disciplina; a ilha troca o tom dentro da família.
const TINTS = {
  math: ["#b48cff", "#9d7bff", "#c79bff", "#8f6ff0", "#d0a8ff"],
  physics: ["#ff7aa8", "#ff90b5", "#f06a99", "#ffa3c1", "#e85d8c"],
  chem: ["#7ee787", "#6ed077", "#8fe89a", "#5fbf6a", "#a3f0aa"],
  cs: ["#61f4c0", "#55e0b0", "#70f4c8", "#4acfa6", "#8ff7d0"],
  lingua: ["#e8c07a", "#d9b06a", "#f0cc8a", "#cfa25c", "#f4d49a"],
  inter: ["#ffc857", "#ffd479", "#e8b34a", "#ffe08f", "#f0b83c"],
};

const TILES = {
  math: { base: 12, floor: 13, path: 13 },
  physics: { base: 14, floor: 15, path: 15 },
  chem: { base: 16, floor: 17, path: 17 },
  cs: { base: 10, floor: 11, path: 11 },
  lingua: { base: 0, floor: 12, path: 1 },
  inter: { base: 0, floor: 19, path: 1 },
};

// Estação: o desenho é de objeto de beira de estrada, não de laboratório.
const ICONES = {
  math: ["dice", "shape", "clock", "curve", "gate", "wave"],
  physics: ["wave", "planet", "heat", "gate", "clock", "prism"],
  chem: ["fire", "tree", "chain", "table", "curve", "dice"],
  cs: ["gate", "chain", "clock", "table", "shape", "fire"],
  lingua: ["book", "gate", "tree", "wave", "clock", "shape"],
  inter: ["book", "gate", "wave", "planet", "chain", "shape"],
};

// Enfeite pela pedra da área: o objeto diz de que o chão é feito.
const DECOR_MATERIAL = {
  giz: ["compass", "book"],
  "ardósia": ["book", "quill"],
  papel: ["quill", "book"],
  pergaminho: ["book", "quill"],
  tinta: ["quill", "mask"],
  cobre: ["coil", "gauge"],
  "latão": ["gauge", "coil"],
  ferro: ["rack", "lock"],
  "silício": ["terminal", "node"],
  vidro: ["lens", "bubble"],
  cristal: ["crystal", "lens"],
  obsidiana: ["crystal", "mask"],
  "âmbar": ["bubble", "petal"],
  "cerâmica": ["flask", "mushroom"],
  fibra: ["mushroom", "petal"],
  "ébano": ["lamp", "mask"],
};

const DECOR_PADRAO = {
  waves: ["wave"],
  dots: ["orb"],
  cracks: ["crystal"],
  dunes: ["petal"],
  grid: ["die"],
  bricks: ["pillar"],
  runes: ["mask"],
  stars: ["star"],
};

const DECOR = {
  math: [["compass", "book", "star"], ["pillar", "orb", "book"], ["die", "star", "orb"]],
  physics: [["coil", "crystal", "wave"], ["gauge", "coil", "crystal"], ["lens", "star", "orb"]],
  chem: [["molecule", "flask", "bubble"], ["flask", "molecule", "crystal"], ["molecule", "bubble", "star"]],
  cs: [["rack", "terminal", "node"], ["antenna", "rack", "crystal"], ["lock", "terminal", "node"]],
  lingua: [["quill", "book", "petal"], ["mask", "book", "star"], ["book", "petal", "quill"]],
  inter: [["book", "orb", "star"], ["crystal", "book", "wave"], ["pillar", "orb", "star"]],
};

// ------------------------------------------------------------------ nomes
const hash = (texto) => {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) h = Math.imul(h ^ texto.charCodeAt(i), 16777619);
  return h >>> 0;
};
const pick = (lista, h) => lista[h % lista.length];

const GENTE = ["Ada", "Bruna", "Ciro", "Dora", "Elias", "Fenna", "Garo", "Hélia", "Ivo", "Jara", "Kael", "Lia", "Mira", "Nilo", "Orla", "Pia", "Quim", "Rui", "Sela", "Tadeu", "Vera", "Yara", "Zeno", "Alma", "Bento", "Cássia"];
const SOBRENOMES = ["do Cais", "da Maré", "das Ruínas", "do Ferro", "dos Ecos", "da Névoa", "do Bosque", "dos Contos", "do Vento", "da Pedra", "do Fogo", "da Sombra"];

const NOMES_ESTACAO = ["Fonte", "Torre", "Portão", "Ruína", "Farol", "Poço", "Marco", "Altar", "Coreto", "Cais", "Santuário", "Gruta", "Acampamento", "Vigia", "Ossário", "Mirante"];
const LUGARES = ["da Maré", "do Vento", "dos Ossos", "das Brumas", "do Sal", "da Pedra", "do Eco", "da Cinza", "das Raízes", "do Poente", "do Lodo", "das Velas"];

const ABERTURA = [
  "O caminho chega sem aviso e o vento muda de lado.",
  "A maré deixou isto aqui e foi embora sem explicar.",
  "Quem passou por último não voltou para contar.",
  "A pedra está quente, como se alguém tivesse acabado de sair.",
];
const MEIO = [
  "Há marcas de gente antiga no chão, e nenhuma casa de pé.",
  "O lugar guarda um silêncio que não é do vento.",
  "As paredes foram feitas para durar mais que a história.",
  "O cheiro de ferro e maresia não sai daqui.",
];
const FIM = [
  "Leve o que der. O resto é do vale.",
  "Volte antes da maré. Depois, só a maré volta.",
  "O que ficou embaixo ainda espera.",
  "Ninguém cobra entrada. Ninguém promete saída.",
];

const FALAS = [
  "O mar levou metade do que a gente sabia. A outra metade a gente inventa.",
  "Se procura trabalho, tem sempre alguém precisando de uma mão.",
  "Não desça sozinho. O escuro não é gentil.",
  "O que vale não é o que brilha. É o que volta com você.",
  "A maré não pergunta se você sabe nadar.",
];

const ELOGIOS = [
  { titulo: "Caçador das Ruínas", xp: 38 },
  { titulo: "Batedor do Vale", xp: 42 },
  { titulo: "Andarilho da Maré", xp: 36 },
];

// ------------------------------------------------------------------ gerador
function loreHtml(area, seed) {
  const h = hash(`${seed}|lore`);
  return `<p>${pick(ABERTURA, h)}</p><p>${pick(MEIO, h >>> 4)} Este é um pedaço de ${area ? area.name : "uma ilha sem nome"}.</p><p>${pick(FIM, h >>> 8)}</p>`;
}

function nomeDeGente(h) {
  return `${pick(GENTE, h)} ${pick(SOBRENOMES, h >>> 4)}`;
}

function contarEstacoes(area) {
  const secao = SECTION_TOPICS[area.num];
  return secao?.subareas?.length || (secao?.topics?.length ? 3 : 2);
}

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
  const decor = {};
  const usadosSitio = new Set();
  const usadosNome = new Set();

  const keeperIndex = {};
  for (const spot of CATALOG_AREAS) {
    const area = CATALOG.find((a) => a.id === spot.id);
    if (!area) continue;
    const discipline = DISCIPLINES[spot.discipline];
    const tiles = TILES[spot.discipline] || TILES.math;
    const continent = spot.discipline === "inter"
      ? DISCIPLINES[area.links?.[0] || "math"].continent
      : discipline.continent;
    const order = (keeperIndex[spot.discipline] = (keeperIndex[spot.discipline] || 0) + 1) - 1;
    const bioma = BIOMES[area.id];
    const conjunto = AREA_ITEMS[area.id];
    const fauna = FAUNA[area.id];
    const caverna = dungeonIdentity(area.id);
    if (!bioma || !conjunto || !caverna) continue;
    const accent = (TINTS[spot.discipline] || TINTS.math)[order % 5];

    areas.push({
      id: area.id,
      num: area.num,
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
    const escolhidos = [...new Set([
      ...(DECOR_MATERIAL[bioma.material] || []),
      ...(DECOR_PADRAO[bioma.pattern] || []),
      ...families[order % families.length],
    ])].slice(0, 4);
    decor[area.id] = escolhidos.length ? escolhidos : families[0].slice(0, 2);

    waystones.push({
      id: area.id,
      continent,
      name: `Farol ${pick(LUGARES, hash(area.id))}`,
      x: spot.waystone.x,
      y: spot.waystone.y,
      accent,
    });

    // uma estação por pedaço de seção; o nome nasce do lugar, não do assunto
    const total = contarEstacoes(area);
    const posicoes = placeStations(spot.land, total, [spot.waystone, spot.npc, spot.hunt]);
    for (let i = 0; i < total; i++) {
      const postId = `${area.id}-${i + 1}`;
      let nome = `${pick(NOMES_ESTACAO, hash(postId))} ${pick(LUGARES, hash(`${postId}|lugar`))}`;
      for (let tentativa = 0; usadosSitio.has(nome) && tentativa < 8; tentativa++) {
        nome = `${pick(NOMES_ESTACAO, hash(`${postId}|${tentativa}`))} ${pick(LUGARES, hash(`${postId}|l|${tentativa}`))}`;
      }
      usadosSitio.add(nome);
      sites.push({
        id: postId,
        continent,
        name: nome,
        label: nome,
        x: posicoes[i]?.x ?? spot.waystone.x,
        y: posicoes[i]?.y ?? spot.waystone.y,
        post: postId,
        accent,
        icon: (ICONES[spot.discipline] || ICONES.inter)[i % 6],
        minor: true,
        catalog: true,
      });
      posts[postId] = {
        kicker: bioma.name,
        title: nome,
        date: "2026-10-20",
        read: "1 min",
        tags: ["lore"],
        continent,
        lab: null,
        body: loreHtml(area, postId),
      };
    }

    let nomeGuarda = nomeDeGente(hash(`${area.id}|guarda`));
    for (let i = 0; usadosNome.has(nomeGuarda) && i < 8; i++) nomeGuarda = nomeDeGente(hash(`${area.id}|guarda|${i}`));
    usadosNome.add(nomeGuarda);
    const keeperId = `keeper-${area.id}`;
    npcSpawns.push({ id: keeperId, continent, x: spot.npc.x, y: spot.npc.y, accent });
    npcs[keeperId] = {
      name: nomeGuarda,
      label: pick(["guia da ilha", "gente da maré", "voz do porto", "morador das ruínas"], hash(`${area.id}|label`)),
      lines: [
        `${bioma.name}. Poucos chegam até aqui, e menos ainda param.`,
        `O caminho segue para ${pick(LUGARES, hash(`${area.id}|sul`))}. Não é longe, mas cobra.`,
        `${fauna[0].name} e ${fauna[1].name} rondam por perto. Não os provoque sem motivo.`,
        pick(FALAS, hash(`${area.id}|fala`)),
        "A caverna guarda o resto. Desça quando tiver coragem.",
      ],
    };

    let nomeTreino = nomeDeGente(hash(`${area.id}|treino`));
    for (let i = 0; usadosNome.has(nomeTreino) && i < 8; i++) nomeTreino = nomeDeGente(hash(`${area.id}|treino|${i}`));
    usadosNome.add(nomeTreino);
    const trainerId = `trainer-${area.id}`;
    npcs[trainerId] = {
      name: nomeTreino,
      label: "mestre de treino",
      lines: [
        "A clareira é lugar de errar sem sangue.",
        "Bata no bicho até ele cair. O treino não cobra vida.",
        `Lá embaixo ${fauna[0].name} cobra o mesmo golpe.`,
      ],
    };

    const recompensa = pick(ELOGIOS, hash(`${area.id}|xp`));
    quests.push({
      id: `missao-${area.id}`,
      npc: keeperId,
      giver: nomeGuarda,
      title: `Caçada em ${bioma.name}`,
      brief: `Desça às ruínas de ${bioma.name} e derrote 3 criaturas. Volte com o que sobrar.`,
      goal: { type: "hunts", count: 3 },
      reward: { xp: recompensa.xp, title: recompensa.titulo },
    });

    dungeons[area.id] = {
      continent,
      name: `Cripta de ${bioma.name}`,
      sub: area.sub,
      material: caverna.material,
      tunnel: ["wide", "split", "zigzag", "cross"][order % 4],
      equipment: [conjunto.weapon.id, conjunto.armor.id, conjunto.helmet.id],
      boss: `O Guardião de ${bioma.name}`,
      rooms: caverna.rooms,
      monsters: caverna.monsters,
      fauna: caverna.fauna,
      palette: caverna.palette,
    };

    grounds.push({
      id: area.id,
      continent,
      accent: bioma.accent,
      trainerGender: order % 2 ? "f" : "m",
      dungeon: `dungeon-${area.id}`,
      name: `Caçada em ${bioma.name}`,
      center: { x: spot.hunt.x, y: spot.hunt.y },
      banner: { x: 0, y: -3 },
      lever: { x: -3, y: 3 },
      loot: [conjunto.weapon.id, conjunto.armor.id, conjunto.helmet.id],
      bossLoot: conjunto.helmet.id,
      monsters: fauna.map((bicho, i) => ({
        id: `${area.id}-m${i + 1}`,
        name: bicho.name,
        tier: i + 1,
        kind: bicho.kind,
        accent: bicho.accent,
        dx: [-3, 3, 0][i],
        dy: [1, -1, 3][i],
      })),
      boss: { id: `${area.id}-boss`, name: `O Guardião de ${bioma.name}`, kind: "boss", accent: bioma.accent, dx: 0, dy: 0 },
      keeper: keeperId,
      trainer: trainerId,
    });
  }

  return { areas, sites, waystones, npcSpawns, posts, npcs, dungeons, grounds, quests, decor };
}

export const CATALOG_CONTENT = buildCatalogContent();

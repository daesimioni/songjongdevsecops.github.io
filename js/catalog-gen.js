// O gerador do catálogo: transforma catálogo + posições + banco em área,
// estação, post, caverna, caçada, NPC, missão e pergunta. Sem banco, a área
// não entra: o teste cobra cobertura, não sobra ilha vazia.

import { CATALOG, DISCIPLINES } from "./catalog.js";
import { CATALOG_AREAS } from "./catalog-layout.js";
import { BANK } from "./catalog-bank.js";
import { SECTION_TOPICS } from "./catalog-topics.js";
import { ICONS, articleOf, labFor, subareaBody, subareaQuiz, titleCase, trilhaQuiz, trilhas } from "./catalog-text.js";
import { placeStations } from "./catalog-place.js";
import { AREA_ITEMS, BIOMES, FAUNA, dungeonIdentity } from "./identity.js";
import { INTER_TEXT } from "./text/inter.js";
import { SECAO_TEXT } from "./text/secoes.js";

// cada área tem um tom próprio dentro da cor da disciplina: 14 ilhas da mesma
// cor seriam quatorze vezes o mesmo lugar
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

const DECOR = {
  math: [["compass", "book", "star"], ["pillar", "orb", "book"], ["die", "star", "orb"]],
  physics: [["coil", "crystal", "wave"], ["gauge", "coil", "crystal"], ["lens", "star", "orb"]],
  chem: [["molecule", "flask", "bubble"], ["flask", "molecule", "crystal"], ["molecule", "bubble", "star"]],
  cs: [["rack", "terminal", "node"], ["antenna", "rack", "crystal"], ["lock", "terminal", "node"]],
  lingua: [["quill", "book", "petal"], ["mask", "book", "star"], ["book", "petal", "quill"]],
  inter: [["book", "orb", "star"], ["crystal", "book", "wave"], ["pillar", "orb", "star"]],
};

// a pergunta do NPC não pode ter a resposta sempre na letra A
function quizFor(q, salt) {
  const correct = q.o[q.a];
  const base = [correct, q.o[(q.a + 1) % 6], q.o[(q.a + 2) % 6]];
  const shift = salt % 3;
  const options = [...base.slice(shift), ...base.slice(0, shift)];
  return { question: q.q, options, answer: options.indexOf(correct), why: q.why };
}

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
    const { article, noun } = articleOf(area.name);
    // a interseção pertence ao continente da primeira disciplina que liga, para
    // perguntas, caçada e duelo caírem num baralho que existe
    const continent = spot.discipline === "inter"
      ? DISCIPLINES[area.links?.[0] || "math"].continent
      : discipline.continent;
    const order = (keeperIndex[spot.discipline] = (keeperIndex[spot.discipline] || 0) + 1) - 1;
    const tintList = TINTS[spot.discipline] || TINTS.math;
    const accent = tintList[order % tintList.length];
    const [keeperId, keeperName] = (KEEPERS[spot.discipline] || KEEPERS.inter)[order % (KEEPERS[spot.discipline] || KEEPERS.inter).length];
    const bioma = BIOMES[area.id];
    const conjunto = AREA_ITEMS[area.id];
    const fauna = FAUNA[area.id];
    const caverna = dungeonIdentity(area.id);

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
    decor[area.id] = families[order % families.length];

    waystones.push({ id: area.id, continent, name: `Farol ${article} ${noun}`, x: spot.waystone.x, y: spot.waystone.y, accent });

    // Uma estação por subárea do catálogo. Seção sem subárea (as interseções)
    // reparte os tópicos em três trilhas, cada uma com a sua página.
    const secao = SECTION_TOPICS[area.num];
    const lista = [];
    let gruposTrilha = null;
    if (secao?.subareas?.length) {
      const posicoes = placeStations(spot.land, secao.subareas.length, [spot.waystone, spot.npc, spot.hunt]);
      secao.subareas.forEach(([nome, topicos], i) => lista.push({ nome, topicos, bankTopic: null, pos: posicoes[i] }));
    } else if (secao?.topics?.length) {
      const grupos = trilhas(secao.topics, 3);
      gruposTrilha = grupos;
      const posicoes = placeStations(spot.land, grupos.length, [spot.waystone, spot.npc, spot.hunt]);
      grupos.forEach((topicos, i) => lista.push({
        nome: bank[i]?.name || area.short,
        topicos,
        bankTopic: bank[i] || bank[0],
        pos: posicoes[i],
      }));
    }

    lista.forEach((item, i) => {
      const postId = `${area.id}-${i + 1}`;
      const siteName = titleCase(item.nome);
      sites.push({
        id: postId,
        continent,
        name: siteName,
        label: siteName,
        x: item.pos.x,
        y: item.pos.y,
        post: postId,
        accent,
        icon: (ICONS[spot.discipline] || ICONS.inter)[i % 6],
        minor: true,
        catalog: true,
      });
      const inter = item.bankTopic ? (SECAO_TEXT[area.num] || INTER_TEXT[area.num]) : null;
      const corpo = item.bankTopic
        ? `${inter ? `<p>${inter.abre}</p>` : ""}<p>${item.bankTopic.def}</p><ul>${item.bankTopic.keys.map((k) => `<li>${k}</li>`).join("")}</ul><blockquote>${item.bankTopic.mistake}</blockquote><p><strong>Trilha ${i + 1} de ${lista.length}.</strong> O catálogo lista estes tópicos nesta parte da seção:</p><ul>${item.topicos.map((t) => `<li>${t}</li>`).join("")}</ul>${inter ? `<p><strong>Prática:</strong> ${inter.pratica}</p><p><strong>Erro comum:</strong> ${inter.erro}</p>` : ""}`
        : subareaBody({
            sectionNum: area.num,
            sectionName: secao.name,
            discipline: spot.discipline,
            name: item.nome,
            topics: item.topicos,
            siblings: lista.map((x) => x.nome),
            catalogId: area.id,
          });
      posts[postId] = {
        kicker: `${discipline.name.toLowerCase()} · ${area.short.toLowerCase()}`,
        title: siteName,
        date: "2026-10-20",
        read: "2 min",
        tags: [discipline.name.toLowerCase(), area.short.toLowerCase()],
        continent,
        lab: item.bankTopic
          ? labFor(`${item.bankTopic.name} ${item.bankTopic.def}`, spot.discipline, i)
          : labFor(`${item.nome} ${item.topicos.join(" ")}`, spot.discipline, i),
        body: corpo,
      };
      if (item.bankTopic) {
        const quizzes = trilhaQuiz({ sectionName: secao.name, groups: gruposTrilha || [], index: i, salt: order * 11 + i });
        for (const q of quizzes) questions.push({ continent, area: area.id, tier: (i % 3) + 1, q });
      } else {
        const quizzes = subareaQuiz({
          sectionNum: area.num,
          sectionName: secao.name,
          discipline: spot.discipline,
          subarea: { name: item.nome, topics: item.topicos },
          siblings: lista.map((x) => x.nome),
          salt: order * 7 + i,
        });
        for (const q of quizzes) questions.push({ continent, area: area.id, tier: (i % 3) + 1, q });
      }
    });

    // as três perguntas do banco continuam no baralho da área, mesmo quando as
    // estações passaram a ser as subáreas
    bank.forEach((topic, i) => {
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
        `${area.name}. ${area.sub}. Bem-vindo a ${bioma.name}.`,
        `Estude por aqui: ${shortWords.join(", ")}. Cada estação tem o que ler e o que mexer.`,
        `Cuidado com ${fauna[0].name} e ${fauna[1].name}; os dois moram nesta ilha.`,
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
      material: caverna.material,
      mirror: order % 2 === 1,
      shift: SHIFTS[order % 3],
      tunnel: ["wide", "split", "zigzag", "cross"][order % 4],
      equipment: [conjunto.weapon.id, conjunto.armor.id, conjunto.helmet.id],
      boss: `O Guardião ${article} ${noun}`,
      rooms: caverna.rooms,
      monsters: caverna.monsters,
      fauna: caverna.fauna,
      palette: caverna.palette,
    };

    grounds.push({
      id: area.id,
      continent,
      accent: bioma.accent,
      dungeon: `dungeon-${area.id}`,
      name: `Caçada ${article} ${noun}`,
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
      boss: { id: `${area.id}-boss`, name: `O Guardião ${article} ${noun}`, kind: "boss", accent: bioma.accent, dx: 0, dy: 0 },
      keeper: keeperId,
    });
  }

  return { areas, sites, waystones, npcSpawns, posts, npcs, dungeons, grounds, quests, questions, decor };
}

export const CATALOG_CONTENT = buildCatalogContent();
export const CATALOG_READY = new Set(CATALOG_CONTENT.areas.map((a) => a.id));

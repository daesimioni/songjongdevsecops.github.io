// O gerador do catálogo: transforma catálogo + posições + banco em área,
// estação, post, caverna, caçada, NPC, missão e pergunta. Sem banco, a área
// não entra: o teste cobra cobertura, não sobra ilha vazia.

import { CATALOG, DISCIPLINES } from "./catalog.js";
import { CATALOG_AREAS } from "./catalog-layout.js";
import { BANK } from "./catalog-bank.js";
import { SECTION_TOPICS } from "./catalog-topics.js";
import { ICONS, articleOf, epigrafe, labFor, subareaBody, titleCase, trilhas } from "./catalog-text.js";
import { placeStations } from "./catalog-place.js";
import { AREA_ITEMS, BIOMES, FAUNA, dungeonIdentity, prepBioma } from "./identity.js";
import { INTER_TEXT } from "./text/inter.js";
import { SECAO_TEXT } from "./text/secoes.js";
import { licaoDe } from "./text/licoes.js";

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

// enfeite pela pedra da área: o objeto diz de que o chão é feito
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

// e o padrão do chão dá o terceiro: a área lê como o desenho dela
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

// Quem treina na clareira é outra pessoa, não o guardião da ilha. Antes o
// instrutor repetia o nome do guardião ("Mestre Hooke" morando com "Hooke"),
// a mesma figura em dois papéis, em 70 ilhas. Nome de gente comum, sem figura
// histórica, um por área: 70 nomes em 70 ilhas.
const MONITORES = {
  math: [["Bento", "m"], ["Iara", "f"], ["Nilo", "m"], ["Zara", "f"], ["Damião", "m"], ["Cíntia", "f"], ["Omar", "m"], ["Neide", "f"], ["Jonas", "m"]],
  physics: [["Ciro", "m"], ["Lia", "f"], ["Hugo", "m"], ["Vera", "f"], ["Tadeu", "m"], ["Rosa", "f"], ["Otávio", "m"], ["Bruna", "f"], ["Sérgio", "m"], ["Alice", "f"], ["Murilo", "m"], ["Tânia", "f"]],
  chem: [["Rui", "m"], ["Jandira", "f"], ["Caio", "m"], ["Esmeralda", "f"], ["Ítalo", "m"], ["Márcia", "f"], ["Elias", "m"], ["Dulce", "f"], ["Vítor", "m"], ["Sônia", "f"], ["Amauri", "m"]],
  cs: [["Beto", "m"], ["Dora", "f"], ["Fábio", "m"], ["Gilda", "f"], ["Heitor", "m"], ["Ísis", "f"], ["Juca", "m"], ["Kátia", "f"], ["Lino", "m"], ["Mara", "f"], ["Nando", "m"], ["Olívia", "f"], ["Paulo", "m"], ["Rita", "f"]],
  lingua: [["Afonso", "m"], ["Beatriz", "f"], ["Célio", "m"], ["Dalva", "f"], ["Ester", "f"], ["Firmino", "m"], ["Gentil", "m"], ["Heloísa", "f"], ["Inácio", "m"], ["Joana", "f"], ["Kléber", "m"], ["Lídia", "f"], ["Mauro", "m"]],
  inter: [["Ari", "m"], ["Bia", "f"], ["Cássio", "m"], ["Débora", "f"], ["Éder", "m"], ["Fátima", "f"], ["Gil", "m"], ["Hilda", "f"], ["Ivo", "m"], ["Laura", "f"], ["Nélson", "m"]],
};

// o título do instrutor muda com a disciplina, para não haver 70 "Mestre"
const TITULO_TREINO = {
  math: ["Monitor", "Monitora"],
  physics: ["Instrutor", "Instrutora"],
  chem: ["Técnico", "Técnica"],
  cs: ["Monitor", "Monitora"],
  lingua: ["Preceptor", "Preceptora"],
  inter: ["Guia", "Guia"],
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
    const monitores = MONITORES[spot.discipline] || MONITORES.inter;
    const [monitorNome, monitorGenero] = monitores[order % monitores.length];
    const tituloTreino = TITULO_TREINO[spot.discipline] || TITULO_TREINO.inter;
    const monitorTitulo = monitorGenero === "f" ? tituloTreino[1] : tituloTreino[0];
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

    // Enfeite pela pedra e pelo padrão da área, não pela disciplina: dois
    // lugares de matemática tinham o mesmo compasso, livro e estrela porque o
    // conjunto vinha da família inteira. Agora a área puxa dois enfeites do
    // material dela e um do padrão do chão.
    const families = DECOR[spot.discipline] || DECOR.inter;
    const familia = families[order % families.length];
    const porMaterial = DECOR_MATERIAL[bioma?.material] || [];
    const porPadrao = DECOR_PADRAO[bioma?.pattern] || [];
    const escolhidos = [...new Set([...porMaterial, ...porPadrao, ...familia])].slice(0, 4);
    decor[area.id] = escolhidos.length ? escolhidos : familia.slice(0, 2);

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
      const tema = item.bankTopic || bank[i] || null;
      const licao = licaoDe(area.id, item.nome);
      const corpo = licao
        ? subareaBody({
            sectionNum: area.num,
            sectionName: secao.name,
            discipline: spot.discipline,
            name: item.nome,
            topics: item.topicos,
            siblings: lista.map((x) => x.nome),
            catalogId: area.id,
            licao,
            bankTopic: tema,
            perguntas: tema?.q ? [tema.q] : [],
            extra: inter ? { abre: inter.abre, pratica: inter.pratica, erro: inter.erro } : null,
          })
        : item.bankTopic
        ? `<p class="page-epigrafe">${epigrafe(item.nome)}</p>${inter ? `<p>${inter.abre}</p>` : ""}<p>${item.bankTopic.def}</p><ul>${item.bankTopic.keys.map((k) => `<li>${k}</li>`).join("")}</ul><blockquote>${item.bankTopic.mistake}</blockquote><p><strong>Parte ${i + 1} de ${lista.length}.</strong> O caminho desta trilha passa por estas marcas:</p><ul>${item.topicos.map((t) => `<li>${t}</li>`).join("")}</ul>${inter ? `<p><strong>Com as mãos.</strong> ${inter.pratica}</p><p><strong>O passo em falso.</strong> ${inter.erro}</p>` : ""}`
        : subareaBody({
            sectionNum: area.num,
            sectionName: secao.name,
            discipline: spot.discipline,
            name: item.nome,
            topics: item.topicos,
            siblings: lista.map((x) => x.nome),
            catalogId: area.id,
            // a lição escrita transforma o totem em curso; a pergunta da
            // trilha é a do banco da área, na mesma ordem das estações
            licao: licaoDe(area.id, item.nome),
            bankTopic: bank[i] || null,
            perguntas: bank[i]?.q ? [bank[i].q] : [],
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
      // Pergunta de "em qual parte do catálogo isto aparece" não ensina o
      // assunto: saiu. A página responde pelo texto e pelas três perguntas do
      // banco da área, que são conceito de verdade.
    });

    // as três perguntas do banco continuam no baralho da área, mesmo quando as
    // estações passaram a ser as subáreas
    bank.forEach((topic, i) => {
      questions.push({
        continent,
        area: area.id,
        tier: i + 1,
        // o banco pode guardar 6 alternativas; o baralho base guarda 3 e o duelo
        // completa até cinco na hora da pergunta
        q: {
          q: topic.q.q,
          // o banco escreve seis alternativas; o duelo mostra cinco, então o
          // corte para A-E acontece lá, sem jogar fora as opções escritas
          options: topic.q.o.slice(),
          a: topic.q.a,
          why: topic.q.why,
        },
      });
    });

    const shortWords = bank.map((t) => t.name.split(" ")[0]);
    // a fala diz o lugar e o assunto: antes 70 treinadores diziam a mesma
    // frase e 70 guardiões repetiam a mesma linha da caverna
    const resumo = (texto) => {
      let frase = String(texto).split(/(?<=\.)\s/)[0].replace(/\.$/, "");
      if (frase.length > 110) frase = frase.slice(0, 110).replace(/[ ,;:]\S*$/, "");
      return frase;
    };
    // três tópicos podem começar com a mesma palavra ("Geometria, Geometria,
    // Geometria"): nesse caso a fala usa o nome inteiro de cada tópico
    const nomesIlha = [...new Set(shortWords)];
    const listaNomes = nomesIlha.length === shortWords.length ? shortWords : bank.map((t) => resumo(t.name));
    npcSpawns.push({ id: keeperId, continent, x: spot.npc.x, y: spot.npc.y, accent });
    npcs[keeperId] = {
      name: keeperName,
      lines: [
        `${bioma.name}. Poucos chegam até aqui, e menos ainda param.`,
        `Os nomes desta ilha: ${listaNomes.join(", ")}. Não são enfeites; são o que se pode aprender.`,
        `${fauna[0].name} e ${fauna[1].name} rondam por perto. Não os provoque sem resposta.`,
        `O engano que volta sempre: ${bank[0].mistake}`,
        `A caverna ${prepBioma(bioma.name)} ${bioma.name} guarda o resto. Desça quando tiver pergunta demais.`,
      ],
    };
    npcs[`trainer-${area.id}`] = {
      name: `${monitorTitulo} ${monitorNome}`,
      lines: [
        `A clareira ${prepBioma(bioma.name)} ${bioma.name} é lugar de errar sem sangue.`,
        `${resumo(bank[0].def)} Comece por aí.`,
        `Aqui o erro não dói. Lá embaixo ${fauna[0].name} cobra a mesma resposta.`,
      ],
    };
    quests.push({
      id: `missao-${area.id}`,
      npc: keeperId,
      giver: keeperName,
      title: `A pergunta de ${keeperName}`,
      brief: `${area.sub.charAt(0).toUpperCase() + area.sub.slice(1)}. ${keeperName} espera uma resposta, não uma visita.`,
      goal: { type: "quiz" },
      quiz: quizFor(bank[1].q, order),
      reward: { xp: 38, title: `Aprendiz de ${keeperName}` },
    });

    // a planta da caverna é semeada pelo id em dungeon-data; aqui só entram
    // o tema, o bicho e o estilo de túnel
    dungeons[area.id] = {
      continent,
      name: `Cripta ${article} ${noun}`,
      sub: area.sub,
      material: caverna.material,
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
      trainerGender: monitorGenero,
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

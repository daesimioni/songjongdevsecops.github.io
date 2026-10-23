// Enciclopédia do vale: catálogos do jogo, guias editoriais e relações
// verificáveis entre verbetes. Ilustrações reutilizam os renderizadores do jogo;
// atlas e plantas são diagramas dos dados, não novos sprites.
import { AREAS, WAYSTONES, CONTINENTS, NPC_SPAWNS, SITES, MAP_W, MAP_H } from "../content/config.js";
import { DISCIPLINES } from "../content/catalog.js";

import { DUNGEONS } from "../content/dungeon-data.js";
import { CAPITULOS } from "../gameplay/arcos.js";
import { FACCOES, ATOS, LIMITE_REPUTACAO } from "../gameplay/faccoes.js";
import { DESFECHOS, GUARDIAO } from "../gameplay/grande-prova.js";
import { FAMILIAS, familiaDeKind } from "../content/familias.js";
import { COMBATE } from "../gameplay/combate.js";
import { focusFirstVisible } from "./search-ui.js";
import { SPELL_MANA, ITEMS, MONSTER_TRAITS, MONSTER_LABELS, MONSTER_WEAKNESS, RELICS, RECIPES, ENCHANTS, SKILLS, TIERS } from "../content/rpg-data.js";
import { QUESTS } from "../gameplay/quests.js";
import { POSTS, NPCS } from "../content/content.js";
import { FAUNA, BIOMES } from "../content/identity.js";
import { VOCACOES } from "../content/vocations.js";
import { PETS, MOUNTS } from "../content/pets.js";
import { OUTFITS } from "../content/outfits.js";
import { itemIconCanvas } from "../rendering/item-art.js";
import { drawCreatureArt } from "../rendering/creature.js";
import { drawHuman } from "../rendering/human.js";
import { drawNpcKit } from "../rendering/npc-art.js";
import { drawPetSprite } from "../rendering/pet-art.js";

const CATEGORIAS = [
  { id: "tudo", nome: "Tudo" },
  { id: "mundo", nome: "Mundo" },
  { id: "cavernas", nome: "Cavernas" },
  { id: "criaturas", nome: "Criaturas" },
  { id: "itens", nome: "Itens" },
  { id: "receitas", nome: "Receitas" },
  { id: "encantamentos", nome: "Encantos" },
  { id: "reliquias", nome: "Relíquias" },
  { id: "pets", nome: "Pets" },
  { id: "missoes", nome: "Missões" },
  { id: "npcs", nome: "NPCs" },
  { id: "paginas", nome: "Páginas" },
  { id: "trajes", nome: "Trajes" },
  { id: "vocacoes", nome: "Vocações" },
  { id: "sistemas", nome: "Guias e sistemas" },
  { id: "historia", nome: "História e facções" },
];

const CAVERNA_POR_AREA = new Map(DUNGEONS.map((d) => [d.id.replace(/^dungeon-/, ""), d]));
const PEDRA_POR_AREA = new Map(WAYSTONES.map((w) => [w.id, w]));
const NOME_POR_ID = new Map(AREAS.map((a) => [a.id, a.name]));
const MATERIAL_POR_AREA = new Map(AREAS.map((a) => [a.id, BIOMES[a.id]?.material || ""]));

const OBJETIVO = {
  cards: "abrir pedras",
  creatures: "vencer criaturas",
  bosses: "vencer chefes",
  gather: "colher materiais",
  delivery: "entregar item",
  dungeon: "descer numa caverna",
  explore: "explorar lugares",
  fish: "pescar",
  docks: "visitar regiões",
  labs: "usar instrumentos diferentes",
  hunts: "vencer guardiões",
  social: "participar da Rede pública e privada",
  quiz: "responder à pergunta do personagem",
};

function normalizar(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Guias editoriais complementam as fichas extraídas dos catálogos do jogo.
export const COMO_JOGAR = [
  {
    nome: "A Grande Prova",
    resumo: "o encontro final do acervo; a escolha fica no save",
    campos: [
      ["Abertura", "a corrente das sete missões da Biblioteca Afogada"],
      ["Fases", "três; a fase 2 revela a habilidade e a 3 muda o ritmo do chefe"],
      ["Desfecho", "guardar, devolver ou abrir; a escolha não pode ser refeita"],
    ],
  },
  {
    nome: "Começando",
    resumo: "criar a chave, escolher a vocação e acordar no porto",
    campos: [
      ["Conta", "a chave é a conta; sem chave o vale abre, a Rede não"],
      ["Vocação", "a última decisão da criação, e não dá para entrar sem ela"],
      ["Primeiro passo", "a Fonte das Boas-vindas, no Porto do Início"],
    ],
  },
  {
    nome: "O fio da Iara",
    resumo: "sete capítulos que dão fio às missões do vale",
    campos: [
      ["Abertura", "o primeiro capítulo abre com Três pedras, no porto"],
      ["Ordem", "cada capítulo pede a missão do continente e o anterior lido"],
      ["Leitura", "o Diário (Z) mostra o lido, o aberto e o que falta"],
    ],
  },
  {
    nome: "Tempo e calendário",
    resumo: "um minuto real é uma hora no jogo; o calendário conta desde 1997",
    campos: [
      ["Relógio", "1 minuto real = 1 hora do jogo; o dia tem 24 minutos reais e 24 horas"],
      ["Calendário", "gregoriano como o nosso, contando os anos desde 18/01/1997; o HUD mostra data, hora e estação"],
      ["Estações", "hemisfério sul, com cor e partículas próprias: primavera, verão, outono e inverno"],
      ["Clima", "chuva, tempestade, tornado, eclipse, neve e neblina mudam o céu, a luz e o chão"],
    ],
  },
  {
    nome: "Guilda e party",
    resumo: "uma sede local, o quadro de membros e a party de oito",
    campos: [
      ["Fundação", "nome e brasão no Diário (Z); a sede nasce com você de líder"],
      ["Membros", "quem entra é a party, pelo convite assinado da Rede; até oito lugares"],
      ["Missões", "a sede lê o save: fundar, recrutar, concluir missões e derrubar um chefe"],
    ],
  },
  {
    nome: "Facções e reputação",
    resumo: "Concílio, União e Porto lembram o que você fez",
    campos: [
      ["Faixa", "cada facção vai de -3 (hostil) a +3 (aliado)"],
      ["Atos", "missão sobe um; o desfecho da Grande Prova sobe três na facção atendida e desce duas nas outras"],
      ["Efeito", "o Porto cobra menos do aliado e mais do hostil; o Diário (Z) mostra o painel"],
    ],
  },
  {
    nome: "Andar e interagir",
    resumo: "WASD ou setas, clique no chão, arrastar para guiar",
    campos: [
      ["Teclas", "W A S D ou setas; clique no chão; arraste para seguir"],
      ["Interagir", "F perto do objeto, ou o menu de contexto"],
      ["Nave", "Espaço liga e desliga a nave na superfície"],
    ],
  },
  {
    nome: "Combate",
    resumo: "ação no próprio mapa: mova, defenda e contra-ataque",
    campos: [
      ["Cenário", "O combate acontece onde você está: sem mudar de tela. Os monstros perseguem no mapa, e paredes e objetos bloqueiam o caminho e a linha de visão."],
      ["Atacar", "J ataca o inimigo ao alcance; o combo sobe com acertos seguidos. Também há botões de toque para as ações."],
      ["Defender", `K segura a guarda: reduz ${COMBATE.defesaReducao * 100}% do dano; defender nos primeiros ${COMBATE.defesaParryMs} ms faz parry`],
      ["Esquivar", `L esquiva por ${COMBATE.esquivaMs} ms; recarga de ${COMBATE.esquivaRecarga / 1000} s`],
      ["Magia", "1 a 6 usam as runas aprendidas e gastam mana; P chama o pet"],
      ["Chefe", "fases adicionais mudam habilidades e o ritmo; observe os avisos de área no chão"],
      ["Fuga", "afaste-se dos inimigos ou alcance uma saída. Esc não encerra instantaneamente o combate; derrotar um inimigo já garante a recompensa dele"],
    ],
  },
  {
    nome: "Itens e equipamento",
    resumo: "mochila, equipamento, consumíveis e forja",
    campos: [
      ["Mochila", "I abre; clicar no item mostra usar, equipar e descartar"],
      ["Equipamento", "arma, armadura, elmo, escudo, anel, colar, pernas, botas e capa"],
      ["Forja", "a cidade subterrânea funde runas, encantos e receitas"],
    ],
  },
  {
    nome: "Cavernas",
    resumo: "descer, acender a tocha, achar o chefe e voltar",
    campos: [
      ["Entrada", "F na boca da caverna; a boca do fundo tem outra saída"],
      ["Tocha", "acende por tempo e aumenta o alcance da luz"],
      ["Saída", "fora de combate, Esc permite sair. Durante a luta, afaste-se dos inimigos ou alcance uma saída; não há fuga instantânea por Esc"],
    ],
  },
  {
    nome: "Coleta, fazenda e cozinha",
    resumo: "árvore, água, veio e canteiro respondem com uma pergunta",
    campos: [
      ["Alvos", "árvore, água, veio e canteiro; F responde"],
      ["Raridade", "acertar rende material; peixe raro pede duas perguntas"],
      ["Fazenda", "o canteiro colhe muda e semente; a receita sai na cozinha (Ficha)"],
      ["Clima", "chuva rende mais na coleta"],
    ],
  },
  {
    nome: "Missões e diário",
    resumo: "NPC pede, o diário guarda e a recompensa paga",
    campos: [
      ["Aceitar", "F no NPC; o pedido entra no diário"],
      ["Acompanhar", "Z mostra o que falta e o quanto"],
      ["Recompensa", "XP, título e uma peça do assunto da área"],
    ],
  },
  {
    nome: "Pets e montarias",
    resumo: "domar um bicho, dar ração e montar na cidade",
    campos: [
      ["Pet", "segue, entra no combate com P e tem passivo próprio"],
      ["Montaria", "comprada no cais; acelera e não entra em caverna"],
      ["Troca", "a mesa da cidade troca vocação e subcategoria"],
    ],
  },
  {
    nome: "Viagem",
    resumo: "ponte para a vizinha, pedra do porto e túnel da conurbação",
    campos: [
      ["A pé", "cada ilha liga à vizinha por ponte ou picada"],
      ["Pedra do porto", "acende para quem já chegou longe"],
      ["Túnel", "a conurbação passa por baixo das fronteiras"],
    ],
  },
  {
    nome: "Rede e praça",
    resumo: "a conversa é Nostr, e a chave é sua",
    campos: [
      ["Chave", "feita no navegador, sem cadastro; quem tem a chave tem a conta"],
      ["Canais", "por região, e mensagem privada"],
      ["Praça", "quem está na mesma sala vê o boneco e a fala"],
    ],
  },
  {
    nome: "Progressão",
    resumo: "pedra abre, diário marca, nível sobe",
    campos: [
      ["Pedras", "454 páginas; cada uma marca o diário e dá XP"],
      ["Nível", "sobe com XP de pedra, missão e bicho"],
      ["Névoa", "cobre o que você ainda não andou"],
    ],
  },
  {
    nome: "Salvamento",
    resumo: "o save vive no navegador, com backup",
    campos: [
      ["Onde", "armazenamento local do navegador"],
      ["Backup", "o menu de backup exporta e importa o save"],
      ["Sem storage", "a sessão vale só até fechar a aba"],
    ],
  },
  {
    nome: "Runas e magia",
    resumo: "forjar uma carga, aprender a runa e voltar a usá-la com mana",
    campos: [
      ["Aprender", "Forje uma runa e use a carga. Ela passa a fazer parte das magias aprendidas."],
      ["Carga ou mana", "Uma carga guardada é consumida antes da mana. Sem carga, é preciso ter aprendido a runa e ter mana suficiente."],
      ["Barra de combate", "As teclas 1 a 6 acionam os espaços da barra. Confira a magia disponível e o custo antes de usar."],
      ["Fora do combate", "Cura e bênção recuperam vida; runas ofensivas precisam de um alvo de combate para causar dano."],
      ["Fabricação", "Busque o nome da runa em Receitas para ver os ingredientes e abra o item produzido."],
    ],
  },
  {
    nome: "Lendo o bestiário",
    resumo: "espécies, famílias, descobertas e fraquezas",
    campos: [
      ["Abrir", "B abre o Bestiário. A Wiki é uma referência completa e não exige descobrir as criaturas."],
      ["Descoberta", "O primeiro encontro revela a ficha no Bestiário; vencer registra a vitória."],
      ["Famílias", FAMILIAS.map(f => `${f.nome}: ${f.kinds.map(k => MONSTER_LABELS[k] || k).join(", ")}`).join("\n")],
      ["Como consultar", "Procure uma criatura e veja comportamento, fraqueza e área. Os links da ficha levam à ilha e à caverna associadas."],
    ],
  },
  {
    nome: "Planejando a primeira expedição",
    resumo: "um roteiro para sair do Porto com objetivo e suprimentos",
    campos: [
      ["1 · Conheça o porto", "Procure Dona Zefa e aceite Três pedras. Abra as páginas próximas e experimente os instrumentos."],
      ["2 · Escolha seu estilo", "Compare força, fraqueza e multiplicadores das cinco vocações antes de decidir como lutar."],
      ["3 · Prepare a mochila", "Confira equipamento, vida e mana. Consulte as receitas de poções, tochas e chaves antes de gastar materiais."],
      ["4 · Escolha o destino", "Abra uma área no Mundo: veja coordenadas, fauna e caverna. Na ficha da caverna, examine a planta e o equipamento listado."],
      ["5 · Acompanhe o retorno", "O Diário mostra as missões e a progressão. Faça backup do save antes de trocar de navegador ou limpar os dados do site."],
    ],
  },
  {
    nome: "Forja e planejamento de materiais",
    resumo: "descubra o que fabricar e para que serve cada ingrediente",
    campos: [
      ["Receitas", "Cada ficha informa quantidade produzida e ingredientes exatos. Os links abrem tanto o resultado quanto os materiais."],
      ["Consulta inversa", "Abra um material em Itens para encontrar receitas e encantos que o consomem."],
      ["Equipamento", "Compare dano e vida máxima na ficha do item; nem todo equipamento possui os mesmos bônus."],
      ["Encantos", "Os requisitos de cada encanto estão na categoria Encantos. Confira o efeito antes de usar seus materiais."],
      ["Pets", "Ração também usa materiais da forja. Reserve três rações para domar o companheiro da cidade."],
    ],
  },
  {
    nome: "Backup e recuperação",
    resumo: "proteja o personagem e sua chave antes de mudar de dispositivo",
    campos: [
      ["Save", "O progresso fica no armazenamento local do navegador. Outro navegador ou perfil não recebe esse save automaticamente."],
      ["Antes de sair", "Exporte o backup no menu de salvamento e guarde o arquivo. Importe pelo mesmo menu no navegador de destino."],
      ["Chave", "A chave da Rede identifica a conta; o arquivo de progresso e a chave têm funções diferentes. Guarde ambos com cuidado."],
      ["Sessão temporária", "Se o navegador bloquear o armazenamento, o progresso pode durar só até fechar a aba."],
      ["Troca de versão", "O aviso de atualização permite aplicar a versão nova mantendo a sessão; faça backups regularmente."],
    ],
  },
  {
    nome: "Como consultar esta wiki",
    resumo: "busca, verbetes relacionados, mapas e respostas protegidas",
    campos: [
      ["Busca", "Digite palavras sem se preocupar com acentos ou maiúsculas. Todas as palavras são consideradas; selecione uma categoria para restringir."],
      ["Navegação", "Use as setas esquerda/direita nas categorias. Na busca, seta para baixo leva ao primeiro resultado. Mostrar mais revela as próximas fichas."],
      ["Verbetes", "Continue explorando conecta lugares, criaturas, missões e itens. Voltar percorre as fichas visitadas e depois retorna à lista."],
      ["Mapas", "Atlas e plantas são esquemas dos dados do mundo. Não exibem sua posição, baús coletados ou inimigos vivos."],
      ["Spoilers", "A wiki lista nomes e recompensas de todo o jogo. Respostas de perguntas, capítulos e desfechos exigem abrir uma seção de spoiler."],
      ["Compartilhar", "Copiar link cria um endereço para a ficha exata, inclusive quando duas entradas têm o mesmo nome."],
    ],
  },
];

const ROTULOS = {
  weapon: "Arma", armor: "Armadura", helmet: "Elmo", shield: "Escudo", ring: "Anel",
  necklace: "Colar", legs: "Pernas", boots: "Botas", cloak: "Capa", damage: "Dano",
  hp: "Vida máxima", manaMax: "Mana máxima", sight: "Visão", manaHit: "Mana por acerto",
  vida: "Vida", mana: "Mana", dano: "Dano causado", sofrido: "Dano recebido",
  alcance: "Alcance", furtividade: "Furtividade", coleta: "Coleta", pet: "Força do pet",
};
function atributosItem(item) {
  return [
    ["Dano", item.damage !== undefined ? `${item.damage > 0 ? "+" : ""}${item.damage}` : ""],
    ["Vida máxima", item.hp !== undefined ? `+${item.hp}` : ""],
    ["Recupera vida", item.heal !== undefined ? String(item.heal) : ""],
    ["Recupera mana", item.mana !== undefined ? String(item.mana) : ""],
    ["Duração do efeito", item.buff?.ms ? `${item.buff.ms / 1000} segundos` : ""],
  ];
}

function nomeItem(id) {
  return ITEMS[id]?.name || id || "";
}

// ---- índice ---------------------------------------------------------------

export function construirIndice() {
  const saida = [];
  const add = (cat, nome, resumo, campos = [], extra = {}) => {
    const limpos = campos.filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "");
    const busca = normalizar([nome, resumo, cat, ...limpos.flat()].join(" "));
    saida.push({ cat, nome, resumo, campos: limpos, busca, ...extra });
  };

  // Mundo: uma entrada por área.
  for (const area of AREAS) {
    const bio = BIOMES[area.id] || {};
    const disc = DISCIPLINES[bio.discipline];
    const cave = CAVERNA_POR_AREA.get(area.id);
    const pedra = PEDRA_POR_AREA.get(area.id);
    const campos = [
      ["Disciplina", disc?.name || bio.discipline || ""],
      ["Continente", CONTINENTS[bio.continent]?.name || bio.continent || ""],
      ["Material", bio.material || ""],
      ["Pedra", pedra ? (pedra.label || pedra.name || "farol da área") : ""],
      ["Caverna", cave ? cave.name : ""],
      ["Chefe da caverna", cave?.boss || ""],
      ["Coordenadas", area.land ? `x ${area.land.cx} · y ${area.land.cy} · superfície (z 0)` : ""],
      ["Fauna", (FAUNA[area.id] || []).map(b => b.name).join(", ")],
    ];
    add("mundo", area.name, bio.name || area.sub || "", campos, { fonte: `area:${area.id}`, vinculos: [cave && `caverna:${cave.id}`, ...((FAUNA[area.id] || []).map((_, i) => `fauna:${area.id}:${i}`)), RELICS[area.id] && `reliquia:${area.id}`].filter(Boolean), tags: [area.id, bio.material || ""], mapa: { tipo: "atlas", areaId: area.id }, icone: { tipo: "bioma", bioma: bio } });
  }

  // Cavernas: uma entrada por caverna, com salas, chefe e equipamento.
  for (const d of DUNGEONS) {
    const areaId = d.id.replace(/^dungeon-/, "");
    const campos = [
      ["Área", NOME_POR_ID.get(areaId) || CONTINENTS[d.continent]?.name || ""],
      ["Continente", CONTINENTS[d.continent]?.name || d.continent || ""],
      ["Material", d.material || MATERIAL_POR_AREA.get(areaId) || ""],
      ["Salas", d.rooms?.length ? String(d.rooms.length) : ""],
      ["Chefe", d.boss || ""],
      ["Equipamento", (d.equipment || []).map(nomeItem).join(", ")],
      ["Salas e dificuldade", (d.rooms || []).map(r => `${r.name || r.id}${TIERS[r.tier] ? ` (${TIERS[r.tier].name})` : ""}`).join(" · ")],
      ["Habitantes", (d.monsters || []).join(", ")],
    ];
    add("cavernas", d.name, d.sub || "", campos, { fonte: `caverna:${d.id}`, vinculos: [`area:${areaId}`, `chefe:${d.id}`, ...((d.equipment || []).map(id => `item:${id}`)), RELICS[areaId] && `reliquia:${areaId}`].filter(Boolean), mapa: { tipo: "caverna", dungeon: d }, tags: [areaId, d.id], icone: { tipo: "caverna", accent: d.accent || BIOMES[areaId]?.accent || "#ffc857" } });
  }

  // Criaturas: a fauna de cada área, mais os chefes das cavernas.
  for (const [areaId, lista] of Object.entries(FAUNA)) {
    const areaNome = NOME_POR_ID.get(areaId) || BIOMES[areaId]?.name || areaId;
    for (const [i, bicho] of lista.entries()) {
      const tipo = MONSTER_LABELS[bicho.kind] || bicho.kind || "";
      add("criaturas", bicho.name, `${tipo} de ${areaNome}`, [
        ["Área", areaNome],
        ["Tipo", tipo],
        ["Fraqueza", MONSTER_WEAKNESS[bicho.kind] || ""],
        ["Comportamento", MONSTER_TRAITS[bicho.kind]?.label || ""],
        ["Família", familiaDeKind(bicho.kind)?.nome || ""],
      ], { fonte: `fauna:${areaId}:${i}`, vinculos: [`area:${areaId}`, CAVERNA_POR_AREA.has(areaId) && `caverna:${CAVERNA_POR_AREA.get(areaId).id}`].filter(Boolean), tags: ["bicho", bicho.kind], icone: { tipo: "bicho", kind: bicho.kind, accent: bicho.accent || BIOMES[areaId]?.accent || "#61f4c0" } });
    }
  }
  for (const d of DUNGEONS) {
    if (!d.boss) continue;
    add("criaturas", d.boss, `chefe de ${d.name}`, [
      ["Caverna", d.name],
      ["Papel", "chefe do fundo"],
    ], { fonte: `chefe:${d.id}`, vinculos: [`caverna:${d.id}`], tags: ["chefe", d.id], icone: { tipo: "bicho", kind: "boss", accent: d.palette?.accent || "#ffc857" } });
  }

  // Itens: o catálogo inteiro, com o tipo e a origem.
  for (const item of Object.values(ITEMS)) {
    if (!item?.name) continue;
    add("itens", item.name, item.desc || "", [
      ["Tipo", ROTULOS[item.slot] || (SPELL_MANA[item.id] ? "Runa" : item.relic ? "Relíquia" : item.heal || item.mana || item.buff ? "Consumível" : item.use ? "Utilitário" : "Material ou objeto")],
      ["Custo da magia aprendida", SPELL_MANA[item.id] ? `${SPELL_MANA[item.id]} de mana; uma carga guardada é consumida antes da mana` : ""],
      ...atributosItem(item),
      ["Origem", CONTINENTS[item.continent]?.name || item.continent || ""],
      ["Descrição", item.desc || ""],
    ], { fonte: `item:${item.id}`, vinculos: [...RECIPES.filter(r => r.out === item.id || r.need?.[item.id]).map(r => `receita:${r.id}`), ...ENCHANTS.filter(e => e.need?.[item.id]).map(e => `encanto:${e.id}`), ...DUNGEONS.filter(d => d.equipment?.includes(item.id)).map(d => `caverna:${d.id}`), ...QUESTS.filter(q => q.reward?.item === item.id).map(q => `missao:${q.id}`)], tags: [item.id || "", item.slot || ""], icone: { tipo: "item", item } });
  }

  // Missões: quem pede, o que fazer e o que paga.
  for (const q of QUESTS) {
    const objetivo = OBJETIVO[q.goal?.type] || q.goal?.type || "";
    const pagamento = [
      q.reward?.xp ? `${q.reward.xp} XP` : "",
      q.reward?.title || "",
      q.reward?.item ? nomeItem(q.reward.item) : "",
    ].filter(Boolean).join(" · ");
    add("missoes", q.title, `de ${q.giver || q.npc}`, [
      ["Quem pede", q.giver || q.npc || ""],
      ["Objetivo", q.goal ? `${objetivo}${q.goal.count ? ` (${q.goal.count})` : ""}` : ""],
      ["Recompensa", pagamento],
      ["Pedido", q.brief || ""],
      ["Pré-requisito", q.depois ? QUESTS.find(p => p.id === q.depois)?.title || q.depois : "Sem missão anterior exigida"],
      ["Região do objetivo", CONTINENTS[q.goal?.continent]?.name || ""],
      ["Área do objetivo", NOME_POR_ID.get(q.goal?.area) || BIOMES[q.goal?.area]?.name || ""],
      ["Pergunta", q.quiz?.question || ""],
    ], { fonte: `missao:${q.id}`, vinculos: [`npc:${q.npc}`, q.depois && `missao:${q.depois}`, q.reward?.item && `item:${q.reward.item}`, q.goal?.area && `area:${q.goal.area}`, q.goal?.area && CAVERNA_POR_AREA.has(q.goal.area) && `caverna:${CAVERNA_POR_AREA.get(q.goal.area).id}`].filter(Boolean), solucao: q.quiz ? `${q.quiz.options[q.quiz.answer]} — ${q.quiz.why || ""}` : null, tags: [q.npc || "", q.goal?.type || ""] });
  }

  // NPCs: nome, primeira fala e quantas falas tem.
  for (const [id, npc] of Object.entries(NPCS)) {
    const linhas = Array.isArray(npc.lines) ? npc.lines : [];
    add("npcs", npc.name || id, linhas[0] || "", [
      ["Fala", linhas[0] || ""],
      ["Conversas", linhas.join("\n\n")],
      ["Localização", NPC_SPAWNS.filter(n => n.id === id).map(n => `${CONTINENTS[n.continent]?.name || n.continent} · x ${n.x}, y ${n.y}`).join(" · ")],
    ], { fonte: `npc:${id}`, icone: NPC_SPAWNS.some(n => n.id === id) ? { tipo: "npc", npc: NPC_SPAWNS.find(n => n.id === id) } : null, vinculos: QUESTS.filter(q => q.npc === id).map(q => `missao:${q.id}`), tags: [id] });
  }

  // Páginas: as 454 pedras, com atalho para abrir a página.
  for (const [id, post] of Object.entries(POSTS)) {
    if (!post?.title) continue;
    add("paginas", post.title, post.kicker || "", [
      ["Seção", post.kicker || ""],
      ["Data", post.date || ""],
      ["Marcas", (post.tags || []).join(", ")],
      ["Continente", CONTINENTS[post.continent]?.name || post.continent || ""],
    ], { fonte: `pagina:${id}`, tags: post.tags || [], abrir: id });
  }

  // Vocações: força, fraqueza e subcategorias.
  for (const v of VOCACOES) {
    const subs = (v.subs || []).map((s) => `${s.name}: ${s.efeito || s.desc || ""}`);
    add("vocacoes", v.name, v.forca || "", [
      ["Força", v.forca || ""],
      ["Fraqueza", v.fraqueza || ""],
      ...Object.entries(v.mult || {}).map(([k, n]) => [ROTULOS[k] || k, `${n.toLocaleString("pt-BR")}× o valor base`]),
      ["Subcategorias", subs.join(" · ")],
    ], { fonte: `vocacao:${v.id}`, tags: ["vocacao", ...(v.subs || []).map((s) => s.id)] });
  }

  // Receitas: o que sai, quanto sai e o que gasta.
  for (const receita of RECIPES) {
    const saidaItem = ITEMS[receita.out]?.name || receita.out;
    const precisa = Object.entries(receita.need || {})
      .map(([id, n]) => `${n}x ${ITEMS[id]?.name || id}`)
      .join(", ");
    add("receitas", receita.name, `produz ${receita.qty || 1}x ${saidaItem}`, [
      ["Produz", `${receita.qty || 1}x ${saidaItem}`],
      ["Ingredientes", precisa],
      ["Onde", "forja da cidade"],
    ], { fonte: `receita:${receita.id}`, vinculos: [receita.out, ...Object.keys(receita.need || {})].map(id => `item:${id}`), icone: { tipo: "item", item: ITEMS[receita.out] }, tags: ["receita", receita.out] });
  }

  // Encantamentos de equipamento.
  for (const enc of ENCHANTS) {
    const precisa = Object.entries(enc.need || {})
      .map(([id, n]) => `${n}x ${ITEMS[id]?.name || id}`)
      .join(", ");
    add("encantamentos", enc.name, enc.desc || "", [
      ["Efeito", enc.desc || ""],
      ["Ingredientes", precisa],
    ], { fonte: `encanto:${enc.id}`, vinculos: Object.keys(enc.need || {}).map(id => `item:${id}`), tags: ["encanto", enc.id] });
  }

  // Relíquias: uma por área, guardada no fundo da caverna.
  for (const rel of Object.values(RELICS)) {
    const areaId = String(rel.id || "").replace(/-reliquia$/, "");
    const cave = CAVERNA_POR_AREA.get(areaId);
    add("reliquias", rel.name, rel.desc || "", [
      ["Área", NOME_POR_ID.get(areaId) || areaId],
      ["Caverna", cave?.name || ""],
      ["Efeito", rel.desc || ""],
    ], { fonte: `reliquia:${areaId}`, vinculos: [`area:${areaId}`, cave && `caverna:${cave.id}`, `item:${rel.id}`].filter(Boolean), tags: ["reliquia", areaId], icone: { tipo: "gema", accent: rel.accent || "#ffc857" } });
  }

  // Pets e montarias: como se consegue e o que cada um faz.
  for (const [id, pet] of Object.entries(PETS)) {
    const passivo = Object.entries(pet.passive || {}).map(([k, v]) => `${ROTULOS[k] || k} +${v}`).join(", ");
    add("pets", pet.name, `pet de ${CONTINENTS[pet.continent]?.name || pet.continent || ""}`, [
      ["Tipo", "pet"],
      ["Origem", pet.where || ""],
      ["Passivo", passivo],
      ["Domar", "Três rações na cidade de origem"],
      ["Recarga da habilidade", pet.ability?.cd ? `${pet.ability.cd / 1000} segundos` : ""],
      ["Habilidade", pet.ability ? `${pet.ability.name}: ${pet.ability.desc}${pet.ability.mana ? ` (mana ${pet.ability.mana})` : ""}` : ""],
    ], { fonte: `pet:${id}`, vinculos: ["item:racao"], tags: ["pet", id], icone: { tipo: "pet", kind: pet.kind } });
  }
  for (const [id, mont] of Object.entries(MOUNTS)) {
    const preco = Object.entries(mont.price || {})
      .map(([k, v]) => `${v}x ${ITEMS[k]?.name || k}`)
      .join(", ");
    add("pets", mont.name, "montaria", [
      ["Tipo", "montaria"],
      ["Velocidade", mont.speed ? `${mont.speed}x` : ""],
      ["Preço", preco],
      ["Efeito", mont.desc || ""],
    ], { fonte: `montaria:${id}`, vinculos: Object.keys(mont.price || {}).map(k => `item:${k}`), tags: ["montaria", id] });
  }

  // Trajes: o que muda é a cor, não o atributo.
  for (const traje of OUTFITS) {
    add("trajes", traje.name, traje.desc || "", [
      ["Continente", CONTINENTS[traje.continent]?.name || traje.continent || ""],
      ["Descrição", traje.desc || ""],
      ["Missão de desbloqueio", traje.quest ? QUESTS.find(q => q.id === traje.quest)?.title || traje.quest : ""],
      ["Atributos", "Cosmético: não altera os atributos de combate"],
    ], { fonte: `traje:${traje.id}`, vinculos: traje.quest ? [`missao:${traje.quest}`] : [], tags: ["traje", traje.id], icone: { tipo: "traje", traje } });
  }

  // Sistemas: o que não é item nem lugar, mas decide o jogo.
  for (const [num, tier] of Object.entries(TIERS)) {
    add("sistemas", `Dificuldade ${tier.name}`, `${tier.stars || ""} · ${tier.hp} de vida, ${tier.xp} XP`, [
      ["Estrelas", tier.stars || ""],
      ["Vida do bicho", String(tier.hp)],
      ["XP", String(tier.xp)],
      ["Dano base do inimigo", String(tier.damage)],
    ], { fonte: `dificuldade:${num}`, tags: ["dificuldade", "combate", num] });
  }
  for (const [id, skill] of Object.entries(SKILLS)) {
    add("sistemas", skill.name, skill.desc || "", [
      ["Disciplina", CONTINENTS[id]?.name || id],
      ["Descrição", skill.desc || ""],
    ], { fonte: `habilidade:${id}`, tags: ["habilidade", id] });
  }
  for (const sistema of COMO_JOGAR) {
    add("sistemas", sistema.nome, sistema.resumo, sistema.campos, { fonte: `guia:${normalizar(sistema.nome).replace(/[^a-z0-9]+/g, "-")}`, tags: ["como jogar", "sistema"], imagem: sistema.nome === "Combate" ? { desktop: "assets/wiki/combate-desktop.png", mobile: "assets/wiki/combate-mobile.png", alt: "Captura do jogo: personagem e inimigos lutando no chão da caverna, com barras de vida e controles de ação.", legenda: "Combate na própria caverna. Ataque, guarda, esquiva e magias ficam na cena; os controles se adaptam ao celular." } : null });
  }

  for (const cap of CAPITULOS) {
    add("historia", `${cap.n}. ${cap.titulo}`, `O fio da Iara · ${CONTINENTS[cap.continente]?.name || cap.continente}`, [
      ["Capítulo", String(cap.n)],
      ["Missão necessária", QUESTS.find(q => q.id === cap.missao)?.title || cap.missao],
      ["Ordem", cap.n === 1 ? "Primeiro capítulo" : "Leia o capítulo anterior no Diário"],
    ], { fonte: `capitulo:${cap.id}`, vinculos: [`missao:${cap.missao}`, cap.n > 1 && `capitulo:${CAPITULOS[cap.n - 2].id}`].filter(Boolean), solucao: cap.lore });
  }
  for (const f of FACCOES) {
    add("historia", f.nome, f.resumo, [
      ["Interesse", f.quer], ["Título de aliado", f.titulo],
      ["Reputação", `De -${LIMITE_REPUTACAO} a +${LIMITE_REPUTACAO}`],
      ["Atos e consequências", ATOS.filter(a => a.faccao === f.id).map(a => `${a.delta > 0 ? "+" : ""}${a.delta}: ${a.rotulo}`).join("\n")],
    ], { fonte: `faccao:${f.id}`, vinculos: ATOS.filter(a => a.faccao === f.id && a.missao).map(a => `missao:${a.missao}`) });
  }
  for (const d of DESFECHOS) {
    add("historia", d.nome, "Desfecho da Grande Prova · decisão permanente no save", [
      ["Título", d.titulo], ["Decisão", "Disponível depois de vencer o Guardião do Acervo. Só pode ser registrada uma vez."],
    ], { fonte: `desfecho:${d.id}`, solucao: d.texto, vinculos: ["historia:guardiao", ...ATOS.filter(a => a.desfecho === d.id).map(a => `faccao:${a.faccao}`)] });
  }
  add("historia", GUARDIAO.name, "Encontro final da Biblioteca Afogada", [
    ["Acesso", "Conclua a corrente de sete missões da Biblioteca Afogada"],
    ["Fases", "Três fases de combate; a vitória permite escolher um desfecho"],
  ], { fonte: "historia:guardiao", icone: { tipo: "bicho", kind: GUARDIAO.kind, accent: "#b48cff" }, vinculos: ["missao:biblioteca-7", ...DESFECHOS.map(d => `desfecho:${d.id}`)] });

  // Estações conectam página e ilha por posição real, sem depender do título.
  for (const site of SITES) {
    if (!site.post) continue;
    const area = AREAS.find(a => a.rect && site.x >= a.rect.x && site.y >= a.rect.y && site.x < a.rect.x + a.rect.w && site.y < a.rect.y + a.rect.h);
    const pagina = saida.find(e => e.fonte === `pagina:${site.post}`);
    if (area && pagina) pagina.vinculos = [...(pagina.vinculos || []), `area:${area.id}`];
  }
  const guias = {
    "Começando": ["missao:tres-passos", "npc:guia", ...VOCACOES.map(v => `vocacao:${v.id}`)],
    "A Grande Prova": ["historia:guardiao", "missao:biblioteca-7"],
    "O fio da Iara": CAPITULOS.map(c => `capitulo:${c.id}`),
    "Facções e reputação": FACCOES.map(f => `faccao:${f.id}`),
    "Combate": ["item:pocao", "item:runa-cura", ...VOCACOES.map(v => `vocacao:${v.id}`)],
    "Runas e magia": Object.keys(SPELL_MANA).map(id => `item:${id}`),
    "Pets e montarias": [...Object.keys(PETS).map(id => `pet:${id}`), ...Object.keys(MOUNTS).map(id => `montaria:${id}`)],
    "Forja e planejamento de materiais": ["item:erva", "item:veio", "item:ferro", "item:madeira", "receita:pocao", "receita:tocha", "receita:racao"],
    "Planejando a primeira expedição": ["missao:tres-passos", "npc:guia", "item:pocao", "item:tocha", "item:chave"],
  };
  for (const entrada of saida) {
    if (entrada.cat === "sistemas" && guias[entrada.nome]) entrada.vinculos = guias[entrada.nome];
  }
  const porFonte = new Map();
  for (const [i, entrada] of saida.entries()) {
    entrada.id = entrada.fonte || `${entrada.cat}:${i}`;
    porFonte.set(entrada.id, entrada);
    entrada.vinculos ||= [];
    entrada.busca = normalizar(`${entrada.busca} ${(entrada.tags || []).join(" ")}`);
  }
  for (const entrada of saida) {
    entrada.vinculos = [...new Set(entrada.vinculos)].filter(id => porFonte.has(id) && id !== entrada.id);
    for (const id of entrada.vinculos) {
      const alvo = porFonte.get(id);
      if (!alvo.vinculos.includes(entrada.id)) alvo.vinculos.push(entrada.id);
    }
  }
  return saida;
}

let indice = null;
export function indiceDaWiki() {
  if (!indice) indice = construirIndice();
  return indice;
}

export function categoriasDaWiki(entradas = indiceDaWiki()) {
  return CATEGORIAS.map((c) => ({
    ...c,
    total: c.id === "tudo" ? entradas.length : entradas.filter((e) => e.cat === c.id).length,
  }));
}

// Busca: todas as palavras precisam aparecer; nome que começa com o termo vem
// antes. Sem acento e sem caixa, porque ninguém digita acento no meio do jogo.
export function buscarNaWiki(consulta = "", categoria = "tudo", limite = 80) {
  const termos = normalizar(consulta).split(/\s+/).filter(Boolean);
  const base = indiceDaWiki().filter((e) => categoria === "tudo" || e.cat === categoria);
  const achados = termos.length
    ? base.filter((e) => termos.every((t) => e.busca.includes(t)))
    : base;
  if (!termos.length) return achados.slice(0, limite);
  const primeiro = normalizar(termos[0]);
  return achados
    .map((e, i) => ({ e, i, prioridade: normalizar(e.nome).startsWith(primeiro) ? 0 : 1 }))
    .sort((a, b) => a.prioridade - b.prioridade || a.i - b.i)
    .slice(0, limite)
    .map((x) => x.e);
}

// Link direto: `itens:Espada da Prova` abre a categoria e busca o nome; um
// termo solto continua sendo busca em tudo.
export function linkDaEntrada(entrada, base = location.href) {
  const url = new URL(base);
  url.search = "";
  url.hash = "";
  url.searchParams.set("wiki", `id:${entrada.id}`);
  return url.href;
}

export function separarConsulta(consulta = "") {
  const texto = String(consulta || "");
  const m = /^([a-z]+):(.+)$/.exec(texto);
  if (m && CATEGORIAS.some((c) => c.id === m[1])) return { categoria: m[1], termo: m[2].trim() };
  return { categoria: "tudo", termo: texto.trim() };
}

// ---- interface ------------------------------------------------------------

let ligado = false;
let limiteVisivel = 80;
let origemDetalhe = null;
let historico = [];
let categoriaAtual = "tudo";
let abrirPost = null;
let fecharModal = null;

function el(tag, classe, texto) {
  const node = document.createElement(tag);
  if (classe) node.className = classe;
  if (texto !== undefined) node.textContent = texto;
  return node;
}

const $ = (id) => document.getElementById(id);

function montarAbas() {
  const box = $("wiki-tabs");
  if (!box) return;
  box.textContent = "";
  for (const c of categoriasDaWiki()) {
    const tab = el("button", "wiki-tab", c.id === "tudo" ? `${c.nome} ${c.total}` : `${c.nome} ${c.total}`);
    tab.type = "button";
    tab.dataset.cat = c.id;
    tab.id = `wiki-tab-${c.id}`;
    tab.tabIndex = c.id === categoriaAtual ? 0 : -1;
    tab.setAttribute("aria-controls", "wiki-list");
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-selected", String(c.id === categoriaAtual));
    const escolher = (id) => {
      categoriaAtual = id;
      limiteVisivel = 80;
      mostrarDetalhe(null);
      montarAbas();
      renderizarLista();
      const selected = [...box.querySelectorAll(".wiki-tab")].find(node => node.dataset.cat === id);
      selected?.focus({ preventScroll: true });
      selected?.scrollIntoView({ block: "nearest", inline: "nearest" });
    };
    tab.addEventListener("click", () => escolher(c.id));
    tab.addEventListener("keydown", (event) => {
      const categorias = categoriasDaWiki();
      const index = categorias.findIndex(item => item.id === c.id);
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % categorias.length;
      else if (event.key === "ArrowLeft") next = (index - 1 + categorias.length) % categorias.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = categorias.length - 1;
      else return;
      event.preventDefault();
      escolher(categorias[next].id);
    });
    box.appendChild(tab);
  }
}

const SIGILOS = { missoes: "!", npcs: "♟", paginas: "▤", vocacoes: "⚔", sistemas: "✦", encantamentos: "✧", historia: "⌛", pets: "♞" };
function montarInicio() {
  const host = $("wiki-intro");
  if (!host) return;
  host.textContent = "";
  host.appendChild(el("p", "wiki-intro-label", "O compêndio do aventureiro"));
  host.appendChild(el("h3", "", "Conheça o vale. Prepare sua próxima jornada."));
  host.appendChild(el("p", "", `${indiceDaWiki().length.toLocaleString("pt-BR")} verbetes conectados: dos primeiros passos à Biblioteca Afogada. Mapas, equipamentos, criaturas e histórias para consultar a qualquer momento.`));
  const nav = el("nav", "wiki-atalhos");
  nav.setAttribute("aria-label", "Leituras recomendadas");
  for (const nome of ["Planejando a primeira expedição", "Combate", "Forja e planejamento de materiais", "Como consultar esta wiki"]) {
    const entrada = indiceDaWiki().find(e => e.cat === "sistemas" && e.nome === nome);
    if (!entrada) continue;
    const b = el("button", "hud-btn", nome);
    b.type = "button";
    b.addEventListener("click", () => { origemDetalhe = b; historico = []; mostrarDetalhe(entrada); });
    nav.appendChild(b);
  }
  host.appendChild(nav);
}
function renderizarLista() {
  const lista = $("wiki-list");
  const detalhe = $("wiki-detail");
  const resumo = $("wiki-resumo");
  if (!lista) return;
  lista.hidden = false;
  if (detalhe) detalhe.hidden = true;
  if (resumo) resumo.hidden = false;
  const consulta = $("wiki-search")?.value || "";
  const intro = $("wiki-intro");
  if (intro) intro.hidden = categoriaAtual !== "tudo" || !!consulta;
  const achados = buscarNaWiki(consulta, categoriaAtual, Infinity);
  const more = $("wiki-more");
  if (more) {
    more.dataset.remaining = String(achados.length > limiteVisivel);
    more.hidden = achados.length <= limiteVisivel;
    more.textContent = `mostrar mais ${Math.min(80, Math.max(0, achados.length - limiteVisivel))}`;
  }
  lista.setAttribute("aria-labelledby", `wiki-tab-${categoriaAtual}`);
  const total = indiceDaWiki().filter((e) => categoriaAtual === "tudo" || e.cat === categoriaAtual).length;
  if (resumo) {
    const cat = categoriasDaWiki().find((c) => c.id === categoriaAtual);
    resumo.textContent = consulta
      ? `${achados.length} resultados em ${cat?.nome || "tudo"} para "${consulta}" · mostrando ${Math.min(limiteVisivel, achados.length)}`
      : `${total} ${total === 1 ? "entrada" : "entradas"} em ${cat?.nome || "tudo"} · mostrando ${Math.min(limiteVisivel, achados.length)}`;
  }
  lista.textContent = "";
  if (!achados.length) {
    lista.appendChild(el("p", "wiki-vazio", "nada encontrado. tente outro termo ou outra categoria."));
    return;
  }
  for (const entrada of achados.slice(0, limiteVisivel)) {
    const cat = CATEGORIAS.find((c) => c.id === entrada.cat)?.nome || entrada.cat;
    const botao = el("button", "wiki-item");
    botao.type = "button";
    const texto = el("div", "wiki-item-texto");
    if (entrada.icone) {
      const icon = iconeDaEntrada(entrada.icone);
      icon.setAttribute("aria-hidden", "true");
      botao.appendChild(icon);
    } else {
      const badge = el("span", "wiki-selo", SIGILOS[entrada.cat] || "◇");
      badge.setAttribute("aria-hidden", "true");
      botao.appendChild(badge);
    }
    texto.append(
      el("em", "", cat),
      el("b", "", entrada.nome),
      el("span", "", entrada.resumo || ""),
    );
    botao.appendChild(texto);
    botao.addEventListener("click", () => { origemDetalhe = botao; historico = []; mostrarDetalhe(entrada); });
    lista.appendChild(botao);
  }
}

function iconeDaEntrada(icone) {
  const cv = document.createElement("canvas");
  cv.width = 64;
  cv.height = 64;
  cv.className = "wiki-icone";
  const g = cv.getContext("2d");
  if (!g) return cv;
  g.imageSmoothingEnabled = false;
  if (icone.tipo === "npc") {
    const npc = icone.npc;
    const colors = npc.colors || { skin: "#d9b08c", hair: "#4a3a55", shirt: npc.accent || "#ffc857", pants: "#2f2c45" };
    g.save(); g.translate(32, 55); g.scale(2, 2);
    drawHuman(g, 0, 0, 0, false, 0, colors, npc.scale || .9, npc.look || null, null, npc.role || null);
    drawNpcKit(g, npc, 0, 0, 0, 0, colors);
    g.restore();
  } else if (icone.tipo === "item") {
    const base = itemIconCanvas(icone.item);
    g.drawImage(base, 0, 0, 64, 64);
  } else if (icone.tipo === "bicho") {
    g.save();
    g.translate(32, 58);
    drawCreatureArt(g, icone.kind, icone.accent, 0, 2, 0);
    g.restore();
  } else if (icone.tipo === "pet") {
    drawPetSprite(g, icone.kind, 32, 58, 0, false, 0);
  } else if (icone.tipo === "bioma") {
    const b = icone.bioma || {};
    const base = b.base || "#1c1a2e";
    const piso = b.floor || "#231e39";
    const caminho = b.path || "#312c5e";
    const acento = b.accent || "#ffc857";
    g.fillStyle = base;
    g.fillRect(0, 0, 64, 64);
    g.fillStyle = piso;
    g.fillRect(6, 6, 52, 52);
    // padrão do piso: onda, ponto ou rachadura, o mesmo nome do bioma
    g.fillStyle = b.accent2 || acento;
    g.globalAlpha = 0.35;
    if (b.pattern === "dots") {
      for (let y = 10; y < 58; y += 8) for (let x = 10; x < 58; x += 8) g.fillRect(x, y, 2, 2);
    } else if (b.pattern === "cracks") {
      g.fillRect(10, 30, 18, 1);
      g.fillRect(28, 30, 1, 10);
      g.fillRect(40, 18, 1, 16);
      g.fillRect(40, 34, 10, 1);
    } else {
      for (let y = 12; y < 58; y += 8) for (let x = 10; x < 54; x += 10) g.fillRect(x + (y % 16 ? 2 : 0), y, 6, 1);
    }
    g.globalAlpha = 1;
    g.fillStyle = caminho;
    g.fillRect(28, 6, 8, 52);
    g.fillRect(6, 28, 52, 8);
    g.fillStyle = acento;
    g.fillRect(26, 26, 12, 12);
    g.fillStyle = "rgba(255,255,255,0.25)";
    g.fillRect(28, 28, 8, 2);
  } else if (icone.tipo === "caverna") {
    const acento = icone.accent || "#ffc857";
    g.fillStyle = "#0b0d18";
    g.fillRect(0, 0, 64, 64);
    g.fillStyle = "#232437";
    g.fillRect(4, 30, 56, 30);
    g.beginPath();
    g.arc(32, 34, 22, Math.PI, Math.PI * 2);
    g.fill();
    g.fillStyle = "#05070f";
    g.beginPath();
    g.arc(32, 36, 15, Math.PI, Math.PI * 2);
    g.fill();
    g.fillRect(17, 36, 30, 20);
    g.fillStyle = acento;
    g.globalAlpha = 0.8;
    g.fillRect(29, 46, 6, 6);
    g.globalAlpha = 1;
    g.fillStyle = "rgba(255,255,255,0.2)";
    g.fillRect(12, 32, 4, 2);
    g.fillRect(48, 38, 3, 2);
  } else if (icone.tipo === "traje") {
    const c = icone.traje?.colors || {};
    g.fillStyle = "#0b0d18";
    g.fillRect(0, 0, 64, 64);
    g.fillStyle = c.skin || "#e8b98c";
    g.fillRect(24, 10, 16, 16);
    g.fillStyle = c.hair || "#2a2438";
    g.fillRect(23, 8, 18, 6);
    g.fillRect(23, 12, 3, 6);
    g.fillRect(38, 12, 3, 6);
    g.fillStyle = c.shirt || "#61f4c0";
    g.fillRect(20, 26, 24, 20);
    g.fillStyle = c.accent || "#fff3d1";
    g.fillRect(20, 42, 24, 3);
    g.fillStyle = c.pants || "#2f2c45";
    g.fillRect(22, 46, 8, 14);
    g.fillRect(34, 46, 8, 14);
    g.fillStyle = "#05070f";
    g.fillRect(25, 17, 2, 2);
    g.fillRect(37, 17, 2, 2);
  } else if (icone.tipo === "gema") {
    const cor = icone.accent || "#ffc857";
    g.fillStyle = "rgba(4,6,14,0.7)";
    g.fillRect(6, 6, 52, 52);
    g.fillStyle = cor;
    g.beginPath();
    g.moveTo(32, 8);
    g.lineTo(52, 28);
    g.lineTo(32, 56);
    g.lineTo(12, 28);
    g.closePath();
    g.fill();
    g.fillStyle = "rgba(255,255,255,0.5)";
    g.fillRect(28, 16, 4, 16);
    g.fillRect(22, 24, 4, 8);
    g.fillStyle = "rgba(0,0,0,0.25)";
    g.fillRect(32, 32, 12, 12);
  }
  return cv;
}

function mapaDaEntrada(mapa) {
  const figure = el("figure", "wiki-mapa");
  const cv = el("canvas");
  cv.width = 720;
  cv.height = 360;
  cv.setAttribute("role", "img");
  const cave = mapa.tipo === "caverna" ? mapa.dungeon : null;
  cv.setAttribute("aria-label", cave ? `Planta de ${cave.name}: salas e corredores. Os nomes estão na ficha.` : "Atlas das áreas. A área desta ficha está destacada; coordenadas na ficha.");
  const g = cv.getContext("2d");
  if (g) {
    g.fillStyle = "#0b1421"; g.fillRect(0, 0, 720, 360);
    if (cave) {
      const rooms = cave.rooms || [];
      const layout = cave.layout || {};
      const sx = 680 / (layout.width || 64), sy = 320 / (layout.height || 48);
      const point = r => [20 + (r.x + r.w / 2) * sx, 20 + (r.y + r.h / 2) * sy];
      g.strokeStyle = "#7b899f"; g.lineWidth = 4;
      for (const [a, b] of layout.corridors || []) {
        const from = rooms.find(r => r.id === a), to = rooms.find(r => r.id === b);
        if (!from || !to) continue;
        g.beginPath(); g.moveTo(...point(from)); g.lineTo(...point(to)); g.stroke();
      }
      rooms.forEach((r, i) => {
        g.fillStyle = r.id === layout.bossRoom ? "#e8a165" : r.kind === "city" ? "#8cd9bd" : "#405779";
        g.fillRect(20 + r.x * sx, 20 + r.y * sy, r.w * sx, r.h * sy);
        g.fillStyle = "#fff"; g.font = "bold 14px sans-serif"; g.textAlign = "center";
        const [x, y] = point(r); g.fillText(String(i + 1), x, y + 5);
      });
    } else {
      for (const area of AREAS) {
        if (!area.land) continue;
        const l = area.land, selected = area.id === mapa.areaId;
        g.fillStyle = selected ? "#ffe1a0" : BIOMES[area.id]?.accent || "#7188a0";
        g.globalAlpha = selected ? 1 : 0.45;
        g.beginPath(); g.ellipse(12 + l.cx * (696 / MAP_W), 12 + l.cy * (336 / MAP_H), Math.max(3, l.rx * (696 / MAP_W)), Math.max(3, l.ry * (336 / MAP_H)), 0, 0, Math.PI * 2); g.fill();
        if (selected) { g.strokeStyle = "#fff"; g.lineWidth = 3; g.stroke(); }
      }
      g.globalAlpha = 1;
    }
  }
  figure.appendChild(cv);
  figure.appendChild(el("figcaption", "", cave ? "Planta esquemática • números correspondem às salas abaixo; laranja: chefe; verde: cidade. Não representa a posição atual de criaturas." : "Atlas esquemático • dourado: área selecionada. Consulte as coordenadas para se orientar no mundo."));
  if (cave) {
    const legend = el("ol", "wiki-legenda");
    for (const r of cave.rooms || []) legend.appendChild(el("li", "", r.name || r.id));
    figure.appendChild(legend);
  }
  return figure;
}

function mostrarDetalhe(entrada) {
  const lista = $("wiki-list");
  const detalhe = $("wiki-detail");
  if (!detalhe) return;
  const intro = $("wiki-intro");
  if (intro) intro.hidden = !!entrada || categoriaAtual !== "tudo" || !!$("wiki-search")?.value;
  if (!entrada) {
    detalhe.hidden = true;
    if ($("wiki-resumo")) $("wiki-resumo").hidden = false;
    detalhe.textContent = "";
    if (lista) lista.hidden = false;
    return;
  }
  if (lista) lista.hidden = true;
  if ($("wiki-more")) $("wiki-more").hidden = true;
  detalhe.hidden = false;
  if ($("wiki-resumo")) $("wiki-resumo").hidden = true;
  detalhe.textContent = "";
  detalhe.scrollTop = 0;
  const cat = CATEGORIAS.find((c) => c.id === entrada.cat)?.nome || entrada.cat;
  const titulo = el("h3", "", entrada.nome);
  titulo.id = "wiki-entry-title";
  titulo.tabIndex = -1;
  detalhe.setAttribute("role", "article");
  detalhe.setAttribute("aria-labelledby", titulo.id);
  detalhe.append(el("p", "wiki-cat", cat), titulo);
  if (entrada.icone) {
    const icon = iconeDaEntrada(entrada.icone);
    icon.setAttribute("aria-hidden", "true");
    detalhe.appendChild(icon);
  }
  detalhe.appendChild(el("p", "wiki-lead", entrada.resumo));
  if (entrada.mapa) detalhe.appendChild(mapaDaEntrada(entrada.mapa));
  if (entrada.imagem) {
    const figure = el("figure", "wiki-captura");
    const picture = el("picture");
    const source = el("source");
    source.setAttribute("media", "(max-width: 520px)");
    source.setAttribute("srcset", entrada.imagem.mobile);
    const img = el("img");
    img.src = entrada.imagem.desktop;
    img.alt = entrada.imagem.alt;
    img.loading = "lazy";
    img.decoding = "async";
    picture.append(source, img);
    figure.append(picture, el("figcaption", "", entrada.imagem.legenda));
    detalhe.appendChild(figure);
  }
  if (entrada.campos.length) {
    const dl = el("dl");
    for (const [rotulo, valor] of entrada.campos) {
      dl.append(el("dt", "", rotulo), el("dd", "", valor));
    }
    detalhe.appendChild(dl);
  }
  if (entrada.solucao) {
    const spoiler = el("details", "wiki-spoiler");
    spoiler.append(el("summary", "", entrada.cat === "historia" ? "Revelar história (spoiler)" : "Revelar resposta e explicação (spoiler)"), el("p", "", entrada.solucao));
    detalhe.appendChild(spoiler);
  }
  const relacionados = (entrada.vinculos || []).map(id => indiceDaWiki().find(e => e.id === id)).filter(Boolean);
  if (relacionados.length) {
    const section = el("section", "wiki-relacionados");
    section.appendChild(el("h4", "", "Continue explorando"));
    for (const e of relacionados) {
      const b = el("button", "hud-btn", `${CATEGORIAS.find(c => c.id === e.cat)?.nome} · ${e.nome}`);
      b.type = "button";
      b.addEventListener("click", () => { historico.push(entrada); mostrarDetalhe(e); });
      section.appendChild(b);
    }
    detalhe.appendChild(section);
  }
  const acoes = el("div", "wiki-acoes");
  const voltar = el("button", "hud-btn", "voltar");
  voltar.type = "button";
  voltar.addEventListener("click", () => {
    if (historico.length) { mostrarDetalhe(historico.pop()); return; }
    detalhe.hidden = true;
    if ($("wiki-resumo")) $("wiki-resumo").hidden = false;
    if ($("wiki-intro")) $("wiki-intro").hidden = categoriaAtual !== "tudo" || !!$("wiki-search")?.value;
    if (lista) lista.hidden = false;
    if ($("wiki-more")) $("wiki-more").hidden = $("wiki-more").dataset.remaining !== "true";
    if (origemDetalhe && lista?.contains(origemDetalhe)) origemDetalhe.focus({ preventScroll: true });
    else if (origemDetalhe && $("wiki-intro")?.contains(origemDetalhe)) origemDetalhe.focus({ preventScroll: true });
    else $("wiki-search")?.focus();
  });
  acoes.appendChild(voltar);
  const link = el("button", "hud-btn", "copiar link");
  link.type = "button";
  link.addEventListener("click", async () => {
    const url = linkDaEntrada(entrada);
    try {
      await navigator.clipboard.writeText(url);
      link.textContent = "link copiado";
    } catch {
      // sem permissão de área de transferência: mostra o endereço para copiar
      link.textContent = url;
    }
  });
  acoes.appendChild(link);
  if (entrada.abrir && abrirPost) {
    const abrir = el("button", "hud-btn", "abrir página");
    abrir.type = "button";
    abrir.addEventListener("click", () => {
      const id = entrada.abrir;
      if (fecharModal) fecharModal(); else fecharWiki();
      abrirPost(id);
    });
    acoes.appendChild(abrir);
  }
  detalhe.appendChild(acoes);
  titulo.focus({ preventScroll: true });
  detalhe.scrollTop = 0;
  const main = detalhe.closest(".book-main");
  if (main && typeof window !== "undefined" && window.matchMedia?.("(max-width: 900px)").matches) main.scrollTop = 0;
}

function fecharWiki() {
  const modal = $("wiki");
  if (modal && !modal.hidden) {
    modal.hidden = true;
  }
  mostrarDetalhe(null);
}

export function configurarWiki({ abrirPost: abrir, fechar } = {}) {
  abrirPost = abrir || null;
  fecharModal = fechar || null;
}

export function abrirWiki(consulta = "") {
  if (!ligado) {
    ligado = true;
    $("wiki-search")?.addEventListener("input", () => { historico = []; limiteVisivel = 80; renderizarLista(); });
    $("wiki-clear")?.addEventListener("click", () => { $("wiki-search").value = ""; historico = []; limiteVisivel = 80; renderizarLista(); $("wiki-search").focus(); });
    // seta para baixo sai da busca e entra no primeiro resultado visível
    $("wiki-search")?.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowDown") return;
      if (!focusFirstVisible($("wiki-list"), ".wiki-item")) return;
      event.preventDefault();
    });
    $("wiki-more")?.addEventListener("click", () => {
      const previous = limiteVisivel;
      limiteVisivel += 80;
      renderizarLista();
      const next = $("wiki-list")?.querySelectorAll(".wiki-item")[previous];
      next?.focus({ preventScroll: true });
      next?.scrollIntoView({ block: "nearest" });
    });
  }
  const alvo = separarConsulta(consulta);
  categoriaAtual = alvo.categoria;
  limiteVisivel = 80;
  origemDetalhe = null;
  historico = [];
  const busca = $("wiki-search");
  if (busca) busca.value = alvo.termo;
  mostrarDetalhe(null);
  montarInicio();
  montarAbas();
  renderizarLista();
  busca?.focus();
  if (String(consulta).startsWith("id:")) {
    const entrada = indiceDaWiki().find(e => e.id === String(consulta).slice(3));
    if (entrada) {
      categoriaAtual = entrada.cat;
      if (busca) busca.value = "";
      montarAbas(); renderizarLista(); mostrarDetalhe(entrada);
    }
  }
}

export const wikiUi = { abrir: abrirWiki, fechar: fecharWiki, configurar: configurarWiki, indice: indiceDaWiki, categorias: categoriasDaWiki, buscar: buscarNaWiki };

// Missões: cada NPC tem uma pergunta ou uma tarefa. O objetivo é sempre
// verificável no estado do jogo, então a missão nunca "acha" que terminou.
import { backupCorrupt } from "../platform/storage.js";
import { STORAGE } from "../core/runtime-config.js";
import { AREAS, NPC_SPAWNS, SITES } from "../content/config.js";

import { CATALOG_CONTENT } from "../content/catalog-gen.js";
import { GROUNDS } from "../content/rpg-data.js";
import { NPCS } from "../content/content.js";
import { IDENTITY_AREAS, questsForArea } from "../content/identity.js";

export const QUESTS = [
  {
    id: "tres-passos",
    npc: "guia",
    giver: "Dona Zefa",
    title: "Três pedras",
    brief: "Abra três pedras. Quaisquer três. O vale não cobra ordem, cobra caminhada.",
    goal: { type: "cards", count: 3 },
    reward: { xp: 24, title: "Aprendiz do Porto" },
  },
  {
    id: "sete-farois",
    npc: "guia",
    giver: "Dona Zefa",
    title: "Sete faróis",
    brief: "Pise nas sete regiões. Um farol só acende quando você chega; de longe, ele é apenas uma luz.",
    goal: { type: "docks", count: 7 },
    reward: { xp: 50, title: "Cartógrafo" },
  },
  {
    id: "mao-na-massa",
    npc: "guia",
    giver: "Dona Zefa",
    title: "As mãos do vale",
    brief: "Mexa em oito instrumentos diferentes. Olhar não basta: clique, arraste, gire.",
    goal: { type: "hunts", count: 8 },
    reward: { xp: 45, title: "Mãos de Aprendiz" },
  },
  {
    id: "cacador",
    npc: "guia",
    giver: "Dona Zefa",
    title: "A primeira descida",
    brief: "Desça a uma caverna e vença três guardiões. Cada um guarda uma pergunta e deixa uma marca.",
    goal: { type: "hunts", count: 3 },
    reward: { xp: 45, title: "Caçador" },
  },
  {
    id: "voz-do-mundo",
    npc: "guia",
    giver: "Dona Zefa",
    title: "A voz do mundo",
    brief: "Fale no canal público e numa mensagem privada. A Rede só existe quando alguém responde.",
    goal: { type: "social", keys: ["chat:public", "chat:dm"] },
    reward: { xp: 40, title: "Mensageiro" },
  },
  {
    id: "mundo-inteiro",
    npc: "guia",
    giver: "Dona Zefa",
    title: "A volta inteira",
    brief: "Quatrocentas e cinquenta e quatro pedras. Sete regiões. Quando o mapa acabar, o porto ainda estará aqui.",
    goal: { type: "cards", count: 454 },
    reward: { xp: 150, title: "Herói do Vale Partido" },
  },
  {
    id: "vai-um",
    npc: "ada",
    giver: "Ada",
    title: "O fio que carrega",
    brief: "Uma pergunta de fio. Se errar, o mundo não cai; a resposta espera.",
    goal: { type: "hunts", count: 3 },
    reward: { xp: 30, title: "Aprendiz de Ada" },
  },
  {
    id: "fios-vivos",
    npc: "ada",
    giver: "Ada",
    title: "Fios vivos",
    brief: "Abra as cinco estações da Computação. Um processador só faz sentido quando as partes conversam.",
    goal: { type: "cards", continent: "cs", count: 5 },
    reward: { xp: 40, title: "Fios Vivos" },
  },
  {
    id: "formas-puras",
    npc: "hypatia",
    giver: "Hypatia",
    title: "Formas puras",
    brief: "Visite as cinco estações da Matemática. O infinito, os sólidos, a curva, o acaso e a árvore.",
    goal: { type: "cards", continent: "math", count: 5 },
    reward: { xp: 40, title: "Formas Puras" },
  },
  {
    id: "hotel-infinito",
    npc: "hypatia",
    giver: "Hypatia",
    title: "O hotel lotado",
    brief: "Hilbert alugou todos os quartos de um hotel infinito. Chega mais um hóspede.",
    goal: { type: "hunts", count: 3 },
    reward: { xp: 30, title: "Hóspede do Infinito" },
  },
  {
    id: "medida-certa",
    npc: "marie",
    giver: "Marie",
    title: "Medida certa",
    brief: "As cinco estações da Física. Meça o pêndulo, a onda, o calor, a luz e a órbita.",
    goal: { type: "cards", continent: "physics", count: 5 },
    reward: { xp: 40, title: "Medida Certa" },
  },
  {
    id: "pendulo",
    npc: "marie",
    giver: "Marie",
    title: "O tempo do pêndulo",
    brief: "Um pêndulo simples, uma régua e um cronômetro. O que muda o período?",
    goal: { type: "hunts", count: 3 },
    reward: { xp: 30, title: "Aprendiz de Marie" },
  },
  {
    id: "tabela-completa",
    npc: "mendeleev",
    giver: "Mendeleev",
    title: "Tabela completa",
    brief: "As cinco estações da Química. A tabela, as ligações, a titulação, a energia e o equilíbrio.",
    goal: { type: "cards", continent: "chem", count: 5 },
    reward: { xp: 40, title: "Tabela Completa" },
  },
  {
    id: "coluna",
    npc: "mendeleev",
    giver: "Mendeleev",
    title: "A coluna que se parece",
    brief: "A tabela tem colunas com personalidade. O que uma coluna compartilha?",
    goal: { type: "hunts", count: 3 },
    reward: { xp: 30, title: "Aprendiz de Mendeleev" },
  },
  {
    id: "razao-sonora",
    npc: "pythagoras",
    giver: "Pitágoras",
    title: "Razão sonora",
    brief: "As cinco estações da Música. Ritmo, intervalo, temperamento, timbre e a máquina de compor.",
    goal: { type: "cards", continent: "music", count: 5 },
    reward: { xp: 40, title: "Razão Sonora" },
  },
  {
    id: "oitava",
    npc: "pythagoras",
    giver: "Pitágoras",
    title: "A razão da oitava",
    brief: "Dobre a frequência e a nota se repete. Só falta dizer a razão.",
    goal: { type: "hunts", count: 3 },
    reward: { xp: 30, title: "Afinador" },
  },
  {
    id: "sala-de-maquinas",
    npc: "turing",
    giver: "Turing",
    title: "Sala de máquinas",
    brief: "As cinco estações de Inteligência Artificial. Dados, camadas, palavras, visão e limites.",
    goal: { type: "cards", continent: "ai", count: 5 },
    reward: { xp: 40, title: "Sala de Máquinas" },
  },
  {
    id: "pergunta-certa",
    npc: "turing",
    giver: "Turing",
    title: "A pergunta certa",
    brief: "Todo mundo pergunta se a máquina pensa. Eu perguntei outra coisa.",
    goal: { type: "hunts", count: 3 },
    reward: { xp: 30, title: "Aprendiz de Turing" },
  },
  {
    id: "quarto-chines",
    npc: "turing",
    giver: "Turing",
    title: "O quarto chinês",
    brief: "Uma pessoa dentro de um quarto responde em chinês seguindo regras. Ela entende a língua?",
    goal: { type: "hunts", count: 3 },
    reward: { xp: 34, title: "Intérprete do Quarto" },
  },
  {
    id: "corda-nos",
    npc: "pythagoras",
    giver: "Pitágoras",
    title: "A corda de treze nós",
    brief: "Uma corda com doze espaços iguais faz um triângulo reto. Quais lados?",
    goal: { type: "hunts", count: 3 },
    reward: { xp: 34, title: "Cordão de Treze Nós" },
  },
  {
    id: "queda-sem-ar",
    npc: "marie",
    giver: "Marie",
    title: "A queda sem ar",
    brief: "Sem resistência do ar, pena e martelo caem juntos. Por quê?",
    goal: { type: "hunts", count: 3 },
    reward: { xp: 34, title: "Queda Livre" },
  },
  {
    id: "coluna-vazia",
    npc: "mendeleev",
    giver: "Mendeleev",
    title: "A coluna que faltava",
    brief: "Eu deixei buracos na tabela. O que eu esperava encontrar neles?",
    goal: { type: "hunts", count: 3 },
    reward: { xp: 34, title: "Profeta da Tabela" },
  },
  {
    id: "quinta-e-oitava",
    npc: "pythagoras",
    giver: "Pitágoras",
    title: "A quinta e a oitava",
    brief: "Duas razões pequenas que o ouvido reconhece. Qual é a da quinta justa?",
    goal: { type: "hunts", count: 3 },
    reward: { xp: 34, title: "Ouvido de Razão" },
  },
  {
    id: "exemplo-enganoso",
    npc: "turing",
    giver: "Turing",
    title: "O exemplo que engana",
    brief: "Um modelo acerta todo o treino e erra na rua. Que nome tem isso?",
    goal: { type: "hunts", count: 3 },
    reward: { xp: 34, title: "Olho de Teste" },
  },
  {
    id: "palavra-certa",
    npc: "alzira",
    giver: "Professora Alzira",
    title: "A palavra certa",
    brief: "Uma frase, uma crase e uma escolha. Se errar, ninguém morre: você tenta de novo.",
    goal: { type: "hunts", count: 3 },
    reward: { xp: 30, title: "Guardião da Crase" },
  },
  {
    id: "vale-das-letras",
    npc: "alzira",
    giver: "Professora Alzira",
    title: "O vale inteiro",
    brief: "Visite as cinco estações do Vale da Língua. O som, a palavra, a frase, o texto e o acento.",
    goal: { type: "cards", continent: "lingua", count: 5 },
    reward: { xp: 40, title: "Leitor do Vale" },
  },
  {
    id: "corrente-sem-ima-parado",
    npc: "faraday",
    giver: "Faraday",
    title: "Ímã parado, agulha parada",
    brief: "A bobina do vale só responde quando o fluxo muda. Qual é a condição?",
    goal: { type: "hunts", count: 3 },
    reward: { xp: 32, title: "Aprendiz de Faraday" },
  },
  {
    id: "ciclo-completo",
    npc: "vonneumann",
    giver: "Von Neumann",
    title: "O ciclo completo",
    brief: "Buscar, decodificar, executar e gravar. Qual é a ordem do ciclo?",
    goal: { type: "hunts", count: 3 },
    reward: { xp: 32, title: "Arquiteto de Bolso" },
  },
  {
    id: "jogo-do-epsilon",
    npc: "cauchy",
    giver: "Cauchy",
    title: "O jogo do épsilon",
    brief: "A margem que você aceita no resultado decide o quanto precisa se aproximar na entrada.",
    goal: { type: "hunts", count: 3 },
    reward: { xp: 36, title: "Aprendiz de Cauchy" },
  },
  {
    id: "anel-que-nao-fecha",
    npc: "kekule",
    giver: "Kekulé",
    title: "O anel que não fecha",
    brief: "Seis carbonos, seis hidrogênios e uma simetria que não deixa o desenho parar quieto.",
    goal: { type: "hunts", count: 3 },
    reward: { xp: 34, title: "Guardião do Anel" },
  },
  {
    id: "nota-que-insiste",
    npc: "helmholtz",
    giver: "Helmholtz",
    title: "A nota que insiste",
    brief: "Toda taça tem uma frequência preferida. O que precisa acontecer para ela responder?",
    goal: { type: "hunts", count: 3 },
    reward: { xp: 34, title: "Ouvinte de Helmholtz" },
  },
  {
    id: "borda-que-denuncia",
    npc: "marr",
    giver: "Marr",
    title: "A borda que denuncia",
    brief: "O kernel pequeno desliza pela imagem e procura uma mudança brusca. O que ele destaca?",
    goal: { type: "hunts", count: 3 },
    reward: { xp: 36, title: "Olho de Marr" },
  },
  {
    id: "narrador-duvida",
    npc: "machado",
    giver: "Machado",
    title: "A versão de quem conta",
    brief: "Bentinho conta a própria história com muita certeza. O que o leitor deve fazer com essa certeza?",
    goal: { type: "hunts", count: 3 },
    reward: { xp: 36, title: "Leitor Desconfiado" },
  },
  {
    id: "pacote-que-desvia",
    npc: "baran",
    giver: "Barán",
    title: "O pacote que desvia",
    brief: "A rede não reserva um caminho fixo. O que ela faz com cada pedaço da mensagem?",
    goal: { type: "hunts", count: 3 },
    reward: { xp: 36, title: "Cartógrafo de Rotas" },
  },
  {
    id: "nada-se-perde",
    npc: "carnot",
    giver: "Carnot",
    title: "Nada se perde, tudo se espalha",
    brief: "Uma máquina térmica não converte todo o calor em trabalho. Por que sobra sempre alguma coisa?",
    goal: { type: "hunts", count: 3 },
    reward: { xp: 38, title: "Aprendiz de Carnot" },
  },
  {
    id: "branco-e-multidao",
    npc: "huygens",
    giver: "Huygens",
    title: "O branco é uma multidão",
    brief: "A luz branca atravessa um prisma e sai colorida. Por que as cores se separam?",
    goal: { type: "hunts", count: 3 },
    reward: { xp: 38, title: "Aprendiz de Huygens" },
  },
  {
    id: "segredo-em-publico",
    npc: "diffie",
    giver: "Diffie",
    title: "Segredo em público",
    brief: "Duas pessoas querem combinar uma chave sem que ninguém que escuta consiga descobri-la. Como?",
    goal: { type: "hunts", count: 3 },
    reward: { xp: 38, title: "Guardião da Chave" },
  },
  {
    id: "amostra-honesta",
    npc: "liebig",
    giver: "Liebig",
    title: "A amostra honesta",
    brief: "Um resultado preciso pode estar errado se a amostra não representar o todo. O que fazer?",
    goal: { type: "hunts", count: 3 },
    reward: { xp: 36, title: "Olho Analítico" },
  },
  {
    id: "motivo-que-volta",
    npc: "schoenberg",
    giver: "Schoenberg",
    title: "O motivo que volta",
    brief: "Uma forma musical vive de repetir e mudar. O que a variação precisa preservar?",
    goal: { type: "hunts", count: 3 },
    reward: { xp: 38, title: "Arquiteto de Formas" },
  },
  {
    id: "moeda-sem-memoria",
    npc: "laplace",
    giver: "Laplace",
    title: "A moeda sem memória",
    brief: "Deu cara dez vezes. A moeda justa deve coroa na próxima? O que a independência diz?",
    goal: { type: "hunts", count: 3 },
    reward: { xp: 38, title: "Apostador Cético" },
  },
  {
    id: "janela-curta",
    npc: "chomsky",
    giver: "Chomsky",
    title: "A janela curta",
    brief: "O modelo só vê o que cabe no contexto. O que acontece com o que ficou de fora?",
    goal: { type: "hunts", count: 3 },
    reward: { xp: 38, title: "Leitor de Contexto" },
  },
  {
    id: "entre-as-linhas",
    npc: "saussure",
    giver: "Saussure",
    title: "Entre as linhas",
    brief: "Alguém diz “está calor aqui” e abre a janela. O que a frase estava fazendo?",
    goal: { type: "hunts", count: 3 },
    reward: { xp: 38, title: "Leitor de Entrelinhas" },
  },
];

QUESTS.push(...CATALOG_CONTENT.quests);

// cada área ganha a trilha (abrir estações) e o chefe (descer e vencer)
for (const area of IDENTITY_AREAS) {
  const ground = GROUNDS.find((g) => g.id === area.id);
  if (!ground) continue;
  // as áreas antigas não guardam o id do guardião na caçada: o NPC é o que
  // mora dentro do retângulo da área
  const mapa = AREAS.find((a) => a.id === area.id);
  const dentro = mapa
    ? NPC_SPAWNS.find((n) => n.x >= mapa.rect.x && n.x < mapa.rect.x + mapa.rect.w && n.y >= mapa.rect.y && n.y < mapa.rect.y + mapa.rect.h)
    : null;
  const keeper = ground.keeper || dentro?.id;
  if (!keeper) continue;
  const giver = NPCS[keeper]?.name || "Guardião";
  QUESTS.push(...questsForArea(area, keeper, giver));
}

// ---- Biblioteca Afogada: a corrente de sete missões que abre o acervo ----
// A Dona Zefa guarda a chave do acervo. Cada capítulo só abre depois do
// anterior; a sétima fecha a corrente e libera a tela de escolha e as alas.
QUESTS.push(
  {
    id: "biblioteca-1",
    npc: "guia",
    giver: "Dona Zefa",
    title: "A chave do acervo",
    brief: "Cinco pedras abertas acendem a primeira lâmpada da Biblioteca Afogada. O resto é caminhada.",
    goal: { type: "cards", count: 5 },
    reward: { xp: 30, title: "Leitor do Porto" },
  },
  {
    id: "biblioteca-2",
    npc: "guia",
    giver: "Dona Zefa",
    title: "As três margens",
    brief: "A biblioteca afundou entre três margens. Visite três regiões e volte com o nome delas.",
    goal: { type: "docks", count: 3 },
    depois: "biblioteca-1",
    reward: { xp: 35 },
  },
  {
    id: "biblioteca-3",
    npc: "guia",
    giver: "Dona Zefa",
    title: "Os guardiões do corredor",
    brief: "Três guardiões de caverna fazem a ronda do corredor afogado. Passe por eles.",
    goal: { type: "hunts", count: 3 },
    depois: "biblioteca-2",
    reward: { xp: 40 },
  },
  {
    id: "biblioteca-4",
    npc: "guia",
    giver: "Dona Zefa",
    title: "O primeiro selo",
    brief: "Um chefe de área abre o selo que prende a porta. O selo não abre por leitura.",
    goal: { type: "bosses", count: 1 },
    depois: "biblioteca-3",
    reward: { xp: 50, title: "Chaveiro" },
  },
  {
    id: "biblioteca-5",
    npc: "guia",
    giver: "Dona Zefa",
    title: "As mãos que copiam",
    brief: "Mexa em três instrumentos. A biblioteca não aceita quem só olha as estantes.",
    goal: { type: "hunts", count: 3 },
    depois: "biblioteca-4",
    reward: { xp: 45 },
  },
  {
    id: "biblioteca-6",
    npc: "guia",
    giver: "Dona Zefa",
    title: "A voz do arquivo",
    brief: "Cinco regiões já conhecem você. A biblioteca quer a voz de quem voltou de todas.",
    goal: { type: "docks", count: 5 },
    depois: "biblioteca-5",
    reward: { xp: 60 },
  },
  {
    id: "biblioteca-7",
    npc: "guia",
    giver: "Dona Zefa",
    title: "A porta afogada",
    brief: "Três chefes caíram. A última porta abre para o acervo: as alas, as vozes e o que a Iara deixou.",
    goal: { type: "bosses", count: 3 },
    depois: "biblioteca-6",
    reward: { xp: 90, title: "Guardião da Biblioteca" },
  },
);

// ---- recompensa de item --------------------------------------------------
// Toda missão entrega uma peça ligada ao assunto dela, além de XP e título.
// O item sai do baralho do continente do NPC, sem relíquia (relíquia é do baú
// selado da caverna e some se a missão der outra).
const ITEM_POR_CONTINENTE = {
  cs: ["chip", "fita", "parafuso", "instrucao", "registrador", "barramento", "pacote", "datagrama", "cifra", "assinatura"],
  math: ["regua", "teorema", "axioma", "amostra", "limite", "serie", "epsilon", "dado"],
  physics: ["ima", "prisma", "quanta", "cobre", "bobina", "fusivel", "capacitor", "calor", "lente", "reflexo"],
  chem: ["frasco", "catalisador", "cristal", "carbono", "cadeia", "solvente", "titulante", "espectro"],
  music: ["diapasao", "partitura", "metronomo", "harmonico", "tubo", "membrana", "motivo", "tema", "coda"],
  ai: ["peso", "embedding", "matriz", "caixa", "pixel", "borda", "kernel", "prompt", "contexto", "vocabulario"],
  lingua: ["pergaminho", "tinta", "letra", "verso", "estrofe", "pagina", "sentido", "ironia"],
  hub: ["runa-faisca", "runa-trovao", "pocao", "ferro", "erva", "veio", "madeira", "chave", "tocha", "caldo", "peixe"],
};
function hashQuest(txt) {
  let h = 2166136261;
  for (let i = 0; i < txt.length; i++) {
    h ^= txt.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
for (const q of QUESTS) {
  if (q.reward?.item) continue;
  const spawn = NPC_SPAWNS.find((n) => n.id === q.npc);
  const prefixo = String(q.id || "").replace(/^(missao|trilha)-/, "").split("-")[0];
  const continente = spawn?.continent || (ITEM_POR_CONTINENTE[prefixo] ? prefixo : "hub");
  const baralho = ITEM_POR_CONTINENTE[continente] || ITEM_POR_CONTINENTE.hub;
  q.reward = q.reward || {};
  q.reward.item = baralho[hashQuest(q.id) % baralho.length];
}

const QUEST_BY_ID = new Map(QUESTS.map((q) => [q.id, q]));

function readData() {
  try {
    const raw = localStorage.getItem(STORAGE.quests);
    const obj = raw ? JSON.parse(raw) : null;
    if (!obj || typeof obj !== "object" || Array.isArray(obj)) return {};
    return {
      accepted: obj.accepted && typeof obj.accepted === "object" && !Array.isArray(obj.accepted) ? obj.accepted : {},
      done: obj.done && typeof obj.done === "object" && !Array.isArray(obj.done) ? obj.done : {},
      stats: obj.stats && typeof obj.stats === "object" && !Array.isArray(obj.stats) ? obj.stats : {},
      titles: Array.isArray(obj.titles) ? obj.titles.filter((t) => typeof t === "string") : [],
      title: typeof obj.title === "string" ? obj.title : "",
    };
  } catch { return {}; }
}
function emptyData() {
  return { accepted: {}, done: {}, stats: {}, titles: [], title: "" };
}

export class Quests {
  constructor({ getCards, getDocks, getBosses, gainXp, onReady, onChange, toast } = {}) {
    this.getCards = getCards || (() => new Set());
    this.getDocks = getDocks || (() => new Set());
    this.getBosses = getBosses || (() => this.data.bosses || {});
    this.gainXp = gainXp || (() => {});
    this.onReady = onReady || (() => {});
    this.onChange = onChange || (() => {});
    this.toast = toast || (() => {});
    backupCorrupt(STORAGE.quests);
    this.data = { ...emptyData(), ...readData() };
    if (!this.data.stats.labs || !Array.isArray(this.data.stats.labs)) this.data.stats.labs = [];
    this.readyNotified = new Set();
    for (const q of QUESTS) {
      if (this.data.accepted[q.id] && this.ready(q)) this.readyNotified.add(q.id);
    }
  }

  save() {
    try { localStorage.setItem(STORAGE.quests, JSON.stringify(this.data)); } catch { /* sem storage */ }
  }

  get titles() { return this.data.titles.slice(); }
  get title() { return this.data.title || ""; }

  isDone(id) { return !!this.data.done[id]; }
  isAccepted(id) { return !!this.data.accepted[id]; }

  // Arco do NPC: uma missão pode exigir a anterior fechada. Enquanto isso, ela
  // não aparece na lista do guardião; o cartão avisa que há mais história.
  offersFor(npc) {
    return QUESTS.filter((q) => {
      if (q.npc !== npc) return false;
      if (!q.depois) return true;
      return this.isDone(q.depois) || this.isAccepted(q.id);
    });
  }

  lockedFor(npc) {
    return QUESTS
      .filter((q) => q.npc === npc && q.depois && !this.isDone(q.depois) && !this.isAccepted(q.id))
      .map((q) => ({ ...q, depoisTitulo: QUESTS.find((x) => x.id === q.depois)?.title || "a primeira missão" }));
  }

  markFor(npc) {
    const offers = this.offersFor(npc);
    if (!offers.length) return "";
    if (offers.some((q) => this.ready(q))) return "ready";
    if (offers.some((q) => !this.isDone(q.id) && !this.isAccepted(q.id))) return "available";
    return "";
  }

  progress(q) {
    if (!q) return { have: 0, need: 1 };
    const goal = q.goal;
    let have = 0;
    let need = 1;
    if (goal.type === "cards") {
      need = goal.count;
      const cartas = this.getCards();
      have = goal.area
        ? SITES.filter((s) => s.post?.startsWith(`${goal.area}-`) && cartas.has(s.post)).length
        : goal.continent
          ? SITES.filter((s) => s.continent === goal.continent && cartas.has(s.post)).length
          : cartas.size;
    } else if (goal.type === "bosses") {
      need = goal.count || 1;
      const mortos = [...new Set(Object.keys(this.getBosses() || {}).map((id) => id.replace(/^dungeon-/, "")))];
      have = goal.area ? mortos.filter((id) => id === goal.area).length : mortos.length;
    } else if (goal.type === "docks") {
      need = goal.count;
      // área temática também marca doca, com prefixo; o Cartógrafo conta
      // continentes, não pedaços deles. Era `.size` num array: a missão de
      // docas nunca fechava.
      have = [...this.getDocks()].filter((id) => !String(id).startsWith("area:")).length;
    } else if (goal.type === "labs") {
      need = goal.count;
      have = this.data.stats.labs.length;
    } else if (goal.type === "hunts") {
      need = goal.count;
      have = Number(this.data.stats.hunts || 0);
    } else if (goal.type === "social") {
      need = goal.keys.length;
      have = goal.keys.filter((k) => Number(this.data.stats[k] || 0) > 0).length;
    }
    return { have: Math.min(have, need), need };
  }

  ready(q) {
    if (!q || this.isDone(q.id) || !this.isAccepted(q.id)) return false;
    const { have, need } = this.progress(q);
    return have >= need;
  }

  accept(id) {
    const q = QUEST_BY_ID.get(id);
    if (!q || this.isDone(id) || this.isAccepted(id)) return false;
    if (q.depois && !this.isDone(q.depois)) return false;
    this.data.accepted[id] = Date.now();
    this.save();
    this.changed();
    return true;
  }


  complete(id) {
    const q = QUEST_BY_ID.get(id);
    if (!q || !this.ready(q)) return { ok: false };
    this.data.done[id] = Date.now();
    delete this.data.accepted[id];
    this.readyNotified.delete(id);
    if (q.reward?.title && !this.data.titles.includes(q.reward.title)) {
      this.data.titles.push(q.reward.title);
    }
    if (q.reward?.title) this.data.title = q.reward.title;
    this.save();
    if (q.reward?.xp) this.gainXp(q.reward.xp);
    this.changed();
    return { ok: true, quest: q, xp: q.reward?.xp || 0, title: q.reward?.title || "", item: q.reward?.item || "" };
  }

  report(kind, value) {
    if (!kind) return;
    let changed = false;
    if (kind === "lab") {
      if (value && !this.data.stats.labs.includes(value)) {
        this.data.stats.labs.push(value);
        changed = true;
      }
    } else {
      const count = kind === "hunts" && value !== undefined ? value : 1;
      if (!Number.isSafeInteger(count) || count <= 0) return;
      this.data.stats[kind] = Number(this.data.stats[kind] || 0) + count;
      changed = true;
    }
    if (!changed) return;
    this.save();
    this.changed();
  }

  changed() {
    for (const q of QUESTS) {
      if (!this.ready(q) || this.readyNotified.has(q.id)) continue;
      this.readyNotified.add(q.id);
      this.toast(`${q.title} pronta. Volte e fale com ${q.giver}.`, 4600);
      this.onReady?.(q);
    }
    this.onChange?.();
  }

  active() {
    return QUESTS.filter((q) => this.isAccepted(q.id) && !this.isDone(q.id));
  }

  done() {
    return QUESTS.filter((q) => this.isDone(q.id));
  }

  setTitle(title) {
    const t = String(title || "");
    if (!this.data.titles.includes(t)) return false;
    this.data.title = t;
    this.save();
    this.onChange?.();
    return true;
  }
}

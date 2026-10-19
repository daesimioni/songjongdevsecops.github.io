// Missões: cada NPC tem uma pergunta ou uma tarefa. O objetivo é sempre
// verificável no estado do jogo, então a missão nunca "acha" que terminou.
import { SITES, STORAGE } from "./config.js";

export const QUESTS = [
  {
    id: "tres-passos",
    npc: "guia",
    giver: "Dona Zefa",
    title: "Três passos no mapa",
    brief: "Abra três estações. Quaisquer três. O mapa não cobra ordem, cobra caminhada.",
    goal: { type: "cards", count: 3 },
    reward: { xp: 24, title: "Aprendiz do Porto" },
  },
  {
    id: "sete-farois",
    npc: "guia",
    giver: "Dona Zefa",
    title: "Sete faróis acesos",
    brief: "Pise nos sete continentes. O farol acende quando você chega, não quando você espia de longe.",
    goal: { type: "docks", count: 7 },
    reward: { xp: 50, title: "Cartógrafo" },
  },
  {
    id: "mao-na-massa",
    npc: "guia",
    giver: "Dona Zefa",
    title: "Mão na massa",
    brief: "Mexa em oito instrumentos diferentes. Olhar não conta: clique, arraste, gire, aperte.",
    goal: { type: "labs", count: 8 },
    reward: { xp: 45, title: "Curioso perigoso" },
  },
  {
    id: "voz-do-mundo",
    npc: "guia",
    giver: "Dona Zefa",
    title: "A voz do mundo",
    brief: "Mande uma mensagem no canal público e uma DM para alguém. A rede só existe quando alguém fala.",
    goal: { type: "social", keys: ["chat:public", "chat:dm"] },
    reward: { xp: 40, title: "Mensageiro" },
  },
  {
    id: "mundo-inteiro",
    npc: "guia",
    giver: "Dona Zefa",
    title: "O mundo inteiro",
    brief: "Trinta e dois fragmentos, seis continentes, uma volta completa. Quando o mapa acabar, o Porto ainda vai estar aqui.",
    goal: { type: "cards", count: 32 },
    reward: { xp: 150, title: "Mundo de Song" },
  },
  {
    id: "vai-um",
    npc: "ada",
    giver: "Ada",
    title: "O vai um",
    brief: "Uma pergunta de fio. Se errar, o mundo não cai: você tenta de novo.",
    goal: { type: "quiz" },
    quiz: {
      question: "No meio somador, qual porta gera o transporte, o famoso vai um?",
      options: ["A porta E", "O OU exclusivo", "A porta NÃO"],
      answer: 0,
      why: "A soma de um bit é o OU exclusivo. O transporte só nasce quando as duas entradas são 1, e isso é o E.",
    },
    reward: { xp: 30, title: "Aprendiz de Ada" },
  },
  {
    id: "fios-vivos",
    npc: "ada",
    giver: "Ada",
    title: "Fios vivos",
    brief: "Abra as cinco estações de Computaria. Um processador só faz sentido quando as partes conversam.",
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
    goal: { type: "quiz" },
    quiz: {
      question: "O hotel tem infinitos quartos, todos ocupados. O que ainda cabe fazer?",
      options: ["Nada, a lotação é total", "Construir um andar novo", "Pedir que cada hóspede vá para o quarto seguinte"],
      answer: 2,
      why: "Cada hóspede do quarto n vai para n+1, o quarto 1 fica livre e o novo hóspede entra. Infinito mais um continua infinito.",
    },
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
    goal: { type: "quiz" },
    quiz: {
      question: "O período de um pêndulo simples depende principalmente de quê?",
      options: ["Da massa do peso", "Da cor do fio", "Do comprimento do fio"],
      answer: 2,
      why: "Para pequenas oscilações, T = 2π√(L/g). A massa não aparece na conta. O comprimento, sim.",
    },
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
    goal: { type: "quiz" },
    quiz: {
      question: "Elementos na mesma coluna da tabela periódica têm em comum o quê?",
      options: ["A mesma camada de valência", "O mesmo número de massa", "O mesmo estado físico"],
      answer: 0,
      why: "A coluna agrupa quem tem a mesma configuração da camada de valência. Por isso o comportamento químico se repete.",
    },
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
    goal: { type: "quiz" },
    quiz: {
      question: "Uma oitava acima corresponde a qual razão de frequência?",
      options: ["3 para 2", "5 para 4", "2 para 1"],
      answer: 2,
      why: "Dobrar a frequência dá a mesma nota uma oitava acima. A razão 2:1 é a mais simples que existe depois de 1:1.",
    },
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
    goal: { type: "quiz" },
    quiz: {
      question: "O teste de Turing foi proposto para medir o quê?",
      options: ["Se a máquina é consciente", "Se a conversa dela é indistinguível de uma humana", "A velocidade de processamento"],
      answer: 1,
      why: "O teste troca a pergunta impossível, se a máquina pensa, por uma observável: a conversa engana um juiz humano?",
    },
    reward: { xp: 30, title: "Aprendiz de Turing" },
  },
];

const QUEST_BY_ID = new Map(QUESTS.map((q) => [q.id, q]));

function readData() {
  try {
    const raw = localStorage.getItem(STORAGE.quests);
    const obj = raw ? JSON.parse(raw) : null;
    if (!obj || typeof obj !== "object") return {};
    return {
      accepted: obj.accepted && typeof obj.accepted === "object" ? obj.accepted : {},
      done: obj.done && typeof obj.done === "object" ? obj.done : {},
      quiz: obj.quiz && typeof obj.quiz === "object" ? obj.quiz : {},
      stats: obj.stats && typeof obj.stats === "object" ? obj.stats : {},
      titles: Array.isArray(obj.titles) ? obj.titles.filter((t) => typeof t === "string") : [],
      title: typeof obj.title === "string" ? obj.title : "",
    };
  } catch { return {}; }
}
function emptyData() {
  return { accepted: {}, done: {}, quiz: {}, stats: {}, titles: [], title: "" };
}

export class Quests {
  constructor({ getCards, getDocks, gainXp, onReady, onChange, toast } = {}) {
    this.getCards = getCards || (() => new Set());
    this.getDocks = getDocks || (() => new Set());
    this.gainXp = gainXp || (() => {});
    this.onReady = onReady || (() => {});
    this.onChange = onChange || (() => {});
    this.toast = toast || (() => {});
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

  offersFor(npc) {
    return QUESTS.filter((q) => q.npc === npc);
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
      have = goal.continent
        ? SITES.filter((s) => s.continent === goal.continent && this.getCards().has(s.post)).length
        : this.getCards().size;
    } else if (goal.type === "docks") {
      need = goal.count;
      have = this.getDocks().size;
    } else if (goal.type === "labs") {
      need = goal.count;
      have = this.data.stats.labs.length;
    } else if (goal.type === "social") {
      need = goal.keys.length;
      have = goal.keys.filter((k) => Number(this.data.stats[k] || 0) > 0).length;
    } else if (goal.type === "quiz") {
      need = 1;
      have = this.data.quiz[q.id] ? 1 : 0;
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
    this.data.accepted[id] = Date.now();
    this.save();
    this.changed();
    return true;
  }

  answer(id, index) {
    const q = QUEST_BY_ID.get(id);
    if (!q?.quiz) return { ok: false };
    if (this.data.quiz[id]) return { ok: true, correct: true, why: q.quiz.why, already: true };
    const correct = Number(index) === q.quiz.answer;
    if (correct) {
      this.data.quiz[id] = true;
      this.save();
      this.changed();
    }
    return { ok: true, correct, why: q.quiz.why };
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
    return { ok: true, quest: q, xp: q.reward?.xp || 0, title: q.reward?.title || "" };
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
      this.data.stats[kind] = Number(this.data.stats[kind] || 0) + 1;
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

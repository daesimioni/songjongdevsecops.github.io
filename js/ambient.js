// O relógio do vale: estação, evento e o kit de ambiente de cada ilha. O que é
// físico e contínuo (chama, água, respiração) continua em loop; o que é
// acontecimento vira evento com começo, pico e fim, sorteado por RNG semeado
// para dois viajantes verem o mesmo e o teste poder prever.

export const ESTACOES = ["primavera", "verao", "outono", "inverno"];

// hemisfério sul: verão em dez-fev, outono em mar-mai, inverno em jun-ago
export function estacaoDe(data = new Date()) {
  const mes = data.getMonth();
  if (mes >= 11 || mes <= 1) return "verao";
  if (mes >= 2 && mes <= 4) return "outono";
  if (mes >= 5 && mes <= 7) return "inverno";
  return "primavera";
}

// Cada evento tem duração, peso, espera depois de terminar e estações em que
// pode acontecer. "repete" falso impede que o sorteio devolva o mesmo evento.
export const EVENTOS = [
  { id: "rajada", duracao: 9000, peso: 4, espera: 42000, estacoes: ["primavera", "outono", "inverno", "verao"] },
  { id: "chuva", duracao: 26000, peso: 2, espera: 90000, estacoes: ["primavera", "verao", "outono"] },
  { id: "neblina", duracao: 22000, peso: 2, espera: 80000, estacoes: ["outono", "inverno", "primavera"] },
  { id: "revoada", duracao: 7000, peso: 2, espera: 60000, estacoes: ["primavera", "verao"] },
  { id: "vagalumes", duracao: 20000, peso: 2, espera: 70000, estacoes: ["verao"] },
  { id: "meteoro", duracao: 4000, peso: 1, espera: 140000, estacoes: ["verao", "inverno"] },
  { id: "calmaria", duracao: 16000, peso: 2, espera: 55000, estacoes: ["verao", "primavera"] },
  { id: "silencio", duracao: 12000, peso: 1, espera: 120000, estacoes: ["inverno", "outono"] },
];

const EVENTO_POR_ID = new Map(EVENTOS.map((e) => [e.id, e]));

function mulberry32(semente) {
  let a = semente >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash(txt) {
  let h = 2166136261;
  for (let i = 0; i < String(txt).length; i++) {
    h ^= String(txt).charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// O relógio: `tick(t)` decide quando o próximo evento começa e devolve o evento
// atual com a intensidade em 0..1 (sobe, segura no pico, cai).
export function criarAmbiente({ semente = 1, data = new Date(), estacao = null } = {}) {
  const rnd = mulberry32(semente);
  const hooks = new Map();
  const estacaoAtual = estacao || estacaoDe(data);
  let atual = null;
  let proximoEm = 0;
  let ultimo = "";

  const emitir = (nome, evento, intensidade) => {
    for (const fn of hooks.get(nome) || []) fn({ evento, intensidade, estacao: estacaoAtual });
  };

  function sortear() {
    const disponiveis = EVENTOS.filter((e) =>
      e.id !== ultimo && (!e.estacoes || e.estacoes.includes(estacaoAtual)));
    const total = disponiveis.reduce((s, e) => s + e.peso, 0);
    let r = rnd() * total;
    for (const e of disponiveis) {
      r -= e.peso;
      if (r <= 0) return e;
    }
    return disponiveis[disponiveis.length - 1] || EVENTOS[0];
  }

  return {
    estacao: estacaoAtual,
    get eventoAtual() { return atual; },
    on(nome, fn) {
      if (!hooks.has(nome)) hooks.set(nome, []);
      hooks.get(nome).push(fn);
      return () => {
        const lista = hooks.get(nome) || [];
        const i = lista.indexOf(fn);
        if (i >= 0) lista.splice(i, 1);
      };
    },
    // devolve { evento, intensidade } e dispara os ganchos de começa/pico/fim
    tick(t) {
      if (atual && t >= atual.fim) {
        emitir(`${atual.evento.id}:termina`, atual.evento, 0);
        ultimo = atual.evento.id;
        atual = null;
        proximoEm = t + atualEspera(ultimo);
      }
      if (!atual && t >= proximoEm) {
        const evento = sortear();
        atual = {
          evento,
          inicio: t,
          pico: t + evento.duracao * 0.3,
          fim: t + evento.duracao,
        };
        emitir(`${evento.id}:comeca`, evento, 0);
      }
      if (atual && !atual.picado && t >= atual.pico) {
        atual.picado = true;
        emitir(`${atual.evento.id}:pico`, atual.evento, 1);
      }
      return { evento: atual?.evento || null, intensidade: this.intensidade(t) };
    },
    // usado pelo teste e pelo modo debug: força um evento a partir de agora
    forcarEvento(id, duracao = null, agora = 0) {
      const evento = EVENTO_POR_ID.get(id);
      if (!evento) return false;
      const dur = duracao || evento.duracao;
      atual = { evento: { ...evento, duracao: dur }, inicio: agora, pico: agora + dur * 0.3, fim: agora + dur, picado: false };
      proximoEm = atual.fim + evento.espera;
      return true;
    },
    intensidade(t) {
      if (!atual) return 0;
      const { inicio, pico, fim } = atual;
      if (t <= inicio || t >= fim) return 0;
      if (t < pico) return (t - inicio) / Math.max(1, pico - inicio);
      return 1 - (t - pico) / Math.max(1, fim - pico);
    },
  };

  function atualEspera(id) {
    const e = EVENTO_POR_ID.get(id);
    return (e?.espera || 45000) * (0.6 + rnd() * 0.8);
  }
}

// ---- kit por ilha --------------------------------------------------------
const KIT_DISCIPLINA = {
  math: ["po-giz", "forma"],
  physics: ["pendulo", "orbe"],
  chem: ["bolha", "fumaca"],
  cs: ["faisca", "luzes"],
  lingua: ["folha", "letra"],
  music: ["nota", "onda"],
  ai: ["pulso", "no"],
  inter: ["po-giz", "orbe"],
};

const KIT_MATERIAL = {
  giz: "risco", "ardósia": "risco",
  papel: "pagina", pergaminho: "pagina",
  tinta: "gota",
  cobre: "verdete", "latão": "verdete",
  ferro: "faisca", "silício": "faisca",
  vidro: "reflexo", cristal: "reflexo", obsidiana: "reflexo", "âmbar": "reflexo",
  "cerâmica": "poeira",
  fibra: "fiapo",
  "ébano": "folha-escura",
};

// velocidade e cor de cada elemento; a cor final é a da área
export const ELEMENTOS = {
  "po-giz": { tipos: 6, queda: 0.012, alpha: 0.55 },
  forma: { tipos: 1, ciclo: 2400 },
  pendulo: { tipos: -1, ciclo: 1400 },
  orbe: { tipos: 1, deriva: 3 },
  bolha: { tipos: 5, sobe: 0.05 },
  fumaca: { tipos: 4, sobe: 0.02, desmancha: 3000 },
  faisca: { tipos: 1, intervalo: 2600 },
  luzes: { tipos: 4, ciclo: 1400 },
  folha: { tipos: 4, voo: 0.02 },
  letra: { tipos: 5, desmancha: 4000 },
  nota: { tipos: 3, sobe: 0.02 },
  onda: { tipos: 1, atravessa: 4000 },
  pulso: { tipos: 1, ciclo: 2000 },
  no: { tipos: 1, ciclo: 5000 },
  risco: { tipos: 3, ciclo: 5200 },
  pagina: { tipos: 2, giro: 4000 },
  gota: { tipos: 1, queda: 0.03 },
  verdete: { tipos: 3, pulso: 6000 },
  reflexo: { tipos: 3, varre: 3000 },
  poeira: { tipos: 4, deriva: 1 },
  fiapo: { tipos: 3, voo: 0.03 },
  "folha-escura": { tipos: 3, queda: 0.014 },
};

export function ambienteDe(areaId, bioma, links = []) {
  if (!bioma) return null;
  const base = KIT_DISCIPLINA[bioma.discipline] || KIT_DISCIPLINA.math;
  let elementos = [...base];
  // interseção herda um elemento de cada disciplina que liga
  if (bioma.discipline === "inter" && links.length) {
    elementos = links.slice(0, 2).flatMap((d) => (KIT_DISCIPLINA[d] || []).slice(0, 1));
  }
  const doMaterial = KIT_MATERIAL[bioma.material];
  if (doMaterial && !elementos.includes(doMaterial)) elementos.push(doMaterial);
  // variante muda a ordem e a fase: duas ilhas do mesmo material não saem iguais
  const semente = hash(areaId);
  if (semente % 2) elementos = [elementos[1], elementos[0], ...elementos.slice(2)];
  return {
    id: areaId,
    elementos: elementos.slice(0, 3),
    semente,
    cor: bioma.accent,
    disciplina: bioma.discipline,
    material: bioma.material,
  };
}

// chave do "mesmo kit": área com mesmo material precisa diferir em algo
// o kit é elemento + fase + cor da área: cor entra porque a regra do lugar já
// diz que o movimento sai da paleta (duas ilhas de giz não podem ser iguais)
export function assinaturaDoKit(kit) {
  return `${kit.elementos.join("+")}|${kit.semente % 8}|${kit.cor}`;
}

// O relógio do vale: estação, evento e o kit de ambiente de cada ilha. O que é
// físico e contínuo (chama, água, respiração) continua em loop; o que é
// acontecimento vira evento com começo, pico e fim, sorteado por RNG semeado
// pelo dia do calendário: dois viajantes veem o mesmo tempo no mesmo dia.
import { dataDoJogo, estacaoDe, ESTACOES } from "../core/calendario.js";

export { ESTACOES, estacaoDe };

const H = 60 * 60 * 1000; // uma hora de jogo em milissegundos de jogo

// Cada evento tem duração e espera em horas do jogo (uma hora = um minuto
// real), peso e estações em que pode acontecer. "repete" falso impede que o
// sorteio devolva o mesmo evento.
export const EVENTOS = [
  { id: "rajada", duracao: 0.4 * H, peso: 4, espera: 2 * H, estacoes: ["primavera", "outono", "inverno", "verao"] },
  { id: "chuva", duracao: 2 * H, peso: 3, espera: 3 * H, estacoes: ["primavera", "verao", "outono"] },
  { id: "tempestade", duracao: 2.5 * H, peso: 2, espera: 6 * H, estacoes: ["primavera", "verao", "outono"] },
  { id: "tornado", duracao: 0.5 * H, peso: 1, espera: 16 * H, estacoes: ["verao", "primavera", "outono"] },
  { id: "eclipse", duracao: 0.8 * H, peso: 1, espera: 28 * H, estacoes: ["primavera", "outono", "inverno", "verao"] },
  { id: "neve", duracao: 3 * H, peso: 3, espera: 4 * H, estacoes: ["inverno"] },
  { id: "neblina", duracao: 1.5 * H, peso: 2, espera: 4 * H, estacoes: ["outono", "inverno", "primavera"] },
  { id: "revoada", duracao: 0.6 * H, peso: 2, espera: 4 * H, estacoes: ["primavera", "verao"] },
  { id: "vagalumes", duracao: 1.5 * H, peso: 2, espera: 5 * H, estacoes: ["verao"] },
  { id: "meteoro", duracao: 0.25 * H, peso: 1, espera: 10 * H, estacoes: ["verao", "inverno"] },
  { id: "calmaria", duracao: 1.2 * H, peso: 2, espera: 4 * H, estacoes: ["verao", "primavera"] },
  { id: "silencio", duracao: 0.8 * H, peso: 1, espera: 8 * H, estacoes: ["inverno", "outono"] },
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

const chaveDoDia = (data) => `${data.ano}-${data.mes}-${data.dia}`;

// O relógio: `tick(agoraReal)` acha o dia do calendário, semeia os eventos
// daquele dia e devolve o evento atual com a intensidade em 0..1 (sobe, segura
// no pico, cai).
export function criarAmbiente({ semente = 1, agora = Date.now(), estacao = null } = {}) {
  let hooks = new Map();
  let estacaoAtual = estacao || "primavera";
  const estacaoForcada = estacao;
  let rnd = mulberry32(semente);
  let dia = "";
  let atual = null;
  let proximoEm = 0;
  let ultimo = "";
  let relogio = 0;

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

  function atualEspera(id) {
    const e = EVENTO_POR_ID.get(id);
    return (e?.espera || 4 * H) * (0.6 + rnd() * 0.8);
  }

  function virarDia(data) {
    dia = chaveDoDia(data);
    estacaoAtual = estacaoForcada || data.estacao;
    rnd = mulberry32(hash(`${semente}:${dia}`));
    if (atual) emitir(`${atual.evento.id}:termina`, atual.evento, 0);
    atual = null;
    ultimo = "";
    // primeiro evento do dia em um horário estável para todo mundo
    const inicioDoDia = data.ms - data.msNoDia;
    proximoEm = inicioDoDia + (0.08 + rnd() * 0.5) * 24 * H;
  }

  function sincronizar(agoraReal) {
    const data = dataDoJogo(agoraReal);
    relogio = data.ms;
    if (chaveDoDia(data) !== dia) virarDia(data);
    return data;
  }
  sincronizar(agora);

  return {
    get estacao() { return estacaoAtual; },
    get dia() { return dia; },
    get eventoAtual() { return atual; },
    get relogio() { return relogio; },
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
    tick(agoraReal = Date.now()) {
      const data = sincronizar(agoraReal);
      const agora = data.ms;
      if (atual && agora >= atual.fim) {
        emitir(`${atual.evento.id}:termina`, atual.evento, 0);
        ultimo = atual.evento.id;
        atual = null;
        proximoEm = agora + atualEspera(ultimo);
      }
      if (!atual && agora >= proximoEm) {
        const evento = sortear();
        const restoDoDia = (data.msNoDia > 0 ? (24 * H - data.msNoDia) : 0);
        const dur = Math.min(evento.duracao, Math.max(H * 0.2, restoDoDia));
        atual = {
          evento: { ...evento, duracao: dur },
          inicio: agora,
          pico: agora + dur * 0.3,
          fim: agora + dur,
          picado: false,
        };
        emitir(`${evento.id}:comeca`, atual.evento, 0);
      }
      if (atual && !atual.picado && agora >= atual.pico) {
        atual.picado = true;
        emitir(`${atual.evento.id}:pico`, atual.evento, 1);
      }
      return { evento: atual?.evento || null, intensidade: this.intensidade(agora), data };
    },
    // usado pelo teste e pelo modo debug: força um evento a partir de agora
    forcarEvento(id, duracao = null, agora = Date.now()) {
      const evento = EVENTO_POR_ID.get(id);
      if (!evento) return false;
      const data = sincronizar(agora);
      if (atual) emitir(`${atual.evento.id}:termina`, atual.evento, 0);
      const dur = duracao || evento.duracao;
      atual = { evento: { ...evento, duracao: dur }, inicio: data.ms, pico: data.ms + dur * 0.3, fim: data.ms + dur, picado: false };
      proximoEm = atual.fim + evento.espera;
      emitir(`${evento.id}:comeca`, atual.evento, 0);
      return true;
    },
    intensidade(t = relogio) {
      if (!atual) return 0;
      const { inicio, pico, fim } = atual;
      if (t <= inicio || t >= fim) return 0;
      if (t < pico) return (t - inicio) / Math.max(1, pico - inicio);
      return 1 - (t - pico) / Math.max(1, fim - pico);
    },
  };
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

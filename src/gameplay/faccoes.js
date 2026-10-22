// Facções e reputação: três forças do vale com memória do que o jogador fez.
// Ata de missão ou de desfecho entra uma vez, vale de -3 a +3 e o save guarda
// só os ids válidos. O módulo é puro para o teste; o app lê o resto.
export const FACCOES = [
  {
    id: "concilio",
    nome: "Concílio do Silêncio",
    titulo: "Aliado do Concílio",
    cor: "#9ecbff",
    resumo: "guarda o eco e a memória do vale",
    quer: "a voz guardada",
  },
  {
    id: "uniao",
    nome: "União das Minas",
    titulo: "Aliado da União",
    cor: "#ffd479",
    resumo: "mede o mundo em axiomas",
    quer: "a prova aberta",
  },
  {
    id: "porto",
    nome: "Porto Submerso",
    titulo: "Aliado do Porto",
    cor: "#8fe3cf",
    resumo: "vive do mar e do que ele devolve",
    quer: "a voz devolvida",
  },
];

export const LIMITE_REPUTACAO = 3;

// O ato é o que fica na memória da facção. Missão sobe uma; desfecho sobe três
// na facção que ele atende e desce duas em cada uma das outras duas.
export const ATOS = [
  { id: "porto-biblioteca", faccao: "porto", delta: 1, rotulo: "Ajudou o Porto a abrir a Biblioteca Afogada", missao: "biblioteca-1" },
  { id: "concilio-chefe-cs", faccao: "concilio", delta: 1, rotulo: "Venceu o chefe dos fundamentos da Computação", missao: "chefe-cs-fundamentos" },
  { id: "uniao-chefe-math", faccao: "uniao", delta: 1, rotulo: "Venceu o chefe dos fundamentos da Matemática", missao: "chefe-math-fundamentos" },
  { id: "guardar-concilio", faccao: "concilio", delta: 3, rotulo: "Guardou a voz no acervo", desfecho: "guardar" },
  { id: "guardar-porto", faccao: "porto", delta: -2, rotulo: "Recusou devolver a voz ao mar", desfecho: "guardar" },
  { id: "guardar-uniao", faccao: "uniao", delta: -2, rotulo: "Negou a prova à União", desfecho: "guardar" },
  { id: "devolver-porto", faccao: "porto", delta: 3, rotulo: "Devolveu a voz ao mar", desfecho: "devolver" },
  { id: "devolver-concilio", faccao: "concilio", delta: -2, rotulo: "Tirou a voz do acervo", desfecho: "devolver" },
  { id: "devolver-uniao", faccao: "uniao", delta: -2, rotulo: "Levou a prova para fora do cálculo", desfecho: "devolver" },
  { id: "abrir-uniao", faccao: "uniao", delta: 3, rotulo: "Abriu a prova para todos", desfecho: "abrir" },
  { id: "abrir-concilio", faccao: "concilio", delta: -2, rotulo: "Abriu o que o Concílio guardava", desfecho: "abrir" },
  { id: "abrir-porto", faccao: "porto", delta: -2, rotulo: "Deixou a voz longe do mar", desfecho: "abrir" },
];

const ATO_POR_ID = new Map(ATOS.map((a) => [a.id, a]));
const FACCAO_POR_ID = new Map(FACCOES.map((f) => [f.id, f]));
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

export function faccaoPorId(id) {
  return FACCAO_POR_ID.get(id) || null;
}

export function atoPorMissao(missao) {
  return ATOS.find((a) => a.missao === missao) || null;
}

export function atosPorDesfecho(desfecho) {
  return ATOS.filter((a) => a.desfecho === desfecho);
}

// Sanear o save: só ato conhecido, sem repetição, na ordem dos ATOS.
export function atosValidos(obj) {
  const brutos = Array.isArray(obj?.faccoes) ? obj.faccoes : [];
  const vistos = new Set(brutos.filter((id) => ATO_POR_ID.has(id)));
  return ATOS.filter((a) => vistos.has(a.id)).map((a) => a.id);
}

export function aplicarAto(data, id) {
  const ato = ATO_POR_ID.get(id);
  if (!ato) return null;
  if (!Array.isArray(data.faccoes)) data.faccoes = [];
  if (data.faccoes.includes(id)) return null;
  data.faccoes.push(id);
  return ato;
}

export function registrarMissao(data, missao) {
  const ato = atoPorMissao(missao);
  return ato ? aplicarAto(data, ato.id) : null;
}

export function registrarDesfecho(data, desfecho) {
  return atosPorDesfecho(desfecho).map((a) => aplicarAto(data, a.id)).filter(Boolean);
}

export function reputacao(data, faccaoId) {
  if (!FACCAO_POR_ID.has(faccaoId)) return 0;
  const soma = atosValidos(data)
    .map((id) => ATO_POR_ID.get(id))
    .filter((a) => a.faccao === faccaoId)
    .reduce((total, a) => total + a.delta, 0);
  return clamp(soma, -LIMITE_REPUTACAO, LIMITE_REPUTACAO);
}

export function reputacoes(data) {
  const saida = {};
  for (const f of FACCOES) saida[f.id] = reputacao(data, f.id);
  return saida;
}

const NIVEIS = [
  { min: 3, rotulo: "aliado" },
  { min: 2, rotulo: "bem-visto" },
  { min: 1, rotulo: "conhecido" },
  { min: 0, rotulo: "neutro" },
  { min: -1, rotulo: "desconfiado" },
  { min: -2, rotulo: "malvisto" },
  { min: -3, rotulo: "hostil" },
];

export function nivelDaReputacao(n) {
  const valor = clamp(Number(n) || 0, -LIMITE_REPUTACAO, LIMITE_REPUTACAO);
  return { valor, rotulo: NIVEIS.find((x) => valor >= x.min).rotulo };
}

// O Porto é quem vende: aliado compra mais barato, hostil paga mais caro.
// O ajuste mexe no material mais caro da peça, nunca abaixo de 1.
export function ajusteDaCompra(reps) {
  const porto = Number(reps?.porto) || 0;
  if (porto >= 2) return -1;
  if (porto <= -2) return 1;
  return 0;
}

export function falaDaReputacao(faccaoId, n) {
  const faccao = faccaoPorId(faccaoId);
  const nivel = nivelDaReputacao(n);
  if (!faccao || nivel.valor === 0) return "";
  if (nivel.valor >= 2) return `${faccao.nome} fala bem de você: ${nivel.rotulo}.`;
  if (nivel.valor <= -2) return `${faccao.nome} não esqueceu: ${nivel.rotulo}.`;
  return `${faccao.nome}: ${nivel.rotulo}.`;
}

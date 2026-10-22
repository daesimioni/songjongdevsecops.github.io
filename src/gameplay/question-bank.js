import { QUESTIONS, DEEP_QUESTIONS } from "../content/rpg-data.js";
// Palavras que aproximam a pergunta do tema da sala. O tema vem do mapa; a
// pergunta não precisa citar a palavra exata para puxar assunto.
export const THEME_WORDS = {
  circuitos: ["circuito", "fio", "transistor", "porta", "sinal"],
  fonemas: ["som", "fonema", "sílaba", "letra", "fala"],
  verbos: ["verbo", "conjugação", "tempo", "modo", "ação"],
  crase: ["crase", "preposição", "artigo", "à", "regência"],
  acentos: ["acento", "oxítona", "paroxítona", "proparoxítona", "hífen"],
  sintaxe: ["sintaxe", "oração", "sujeito", "predicado", "objeto"],
  generos: ["gênero", "conto", "crônica", "poema", "romance"],
  pontuacao: ["vírgula", "ponto", "pontuação", "reticências", "travessão"],
  etimologia: ["origem", "etimologia", "latim", "palavra", "grego"],
  lógica: ["lógica", "booleano", "proposição", "porta", "verdade"],
  memória: ["memória", "cache", "registrador", "ram", "guardar"],
  tempo: ["clock", "frequência", "ciclo", "tempo", "atraso"],
  algoritmos: ["algoritmo", "complexidade", "ordena", "busca", "passo", "escalonador", "processo", "núcleo"],
  dados: ["dado", "tabela", "amostra", "estatística", "probabilidade"],
  primos: ["primo", "divisível", "fator", "divisão", "número"],
  geometria: ["triângulo", "ângulo", "geometria", "forma", "distância"],
  limites: ["limite", "derivada", "integral", "contínu", "tende"],
  infinito: ["infinito", "hilbert", "cardinal", "cantor", "enumerável"],
  axiomas: ["axioma", "teorema", "prova", "lema", "demonstra"],
  fractais: ["fractal", "autossemelhante", "iteração", "dimensão", "recurs"],
  pêndulo: ["pêndulo", "oscila", "período", "gravidade", "amplitude"],
  ondas: ["onda", "frequência", "comprimento", "ressonância", "som"],
  calor: ["calor", "temperatura", "entropia", "energia", "térmic"],
  luz: ["luz", "fóton", "prisma", "cor", "óptica"],
  órbita: ["órbita", "gravidade", "satélite", "kepler", "escape"],
  gravidade: ["gravidade", "massa", "queda", "newton", "peso"],
  elementos: ["elemento", "tabela", "átomo", "próton", "elétron"],
  ácidos: ["ácido", "ph", "base", "reação", "neutraliza"],
  energia: ["energia", "ativação", "reação", "calor", "entalpia"],
  equilíbrio: ["equilíbrio", "concentração", "reação", "tampão", "desloca"],
  cristais: ["cristal", "rede", "sal", "estrutura", "sólido"],
  ligações: ["ligação", "molécula", "átomo", "valência", "química"],
  ritmo: ["ritmo", "compasso", "tempo", "batida", "pulso"],
  harmonia: ["harmonia", "acorde", "intervalo", "tom", "consonância"],
  silêncio: ["silêncio", "pausa", "som", "ruído", "repouso"],
  timbre: ["timbre", "harmônico", "instrumento", "som", "voz"],
  razões: ["razão", "oitava", "frequência", "proporção", "quinta"],
  escalas: ["escala", "tom", "semitom", "modo", "afinação"],
  pesos: ["peso", "sinapse", "treino", "rede", "neurônio"],
  gradiente: ["gradiente", "descida", "erro", "aprendizado", "derivada"],
  atenção: ["atenção", "token", "contexto", "transformer", "consulta"],
  vetores: ["vetor", "embedding", "dimensão", "espaço", "distância"],
  tokens: ["token", "texto", "vocabulário", "modelo", "palavra"],
};

export function shuffle(list) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export const OPTION_COUNT = 5;
const NUMERIC_OPTION = /^-?\d+(?:[.,]\d+)?\s*%?$/;

export function looksNumeric(text) {
  return NUMERIC_OPTION.test(String(text).trim());
}

export function numericDistractors(text) {
  const m = String(text).trim().match(/^(-?\d+(?:[.,]\d+)?)(\s*%?)$/);
  if (!m) return [];
  const raw = m[1].replace(",", ".");
  const value = Number(raw);
  if (!Number.isFinite(value)) return [];
  const suffix = m[2] || "";
  const decimals = raw.includes(".") ? 1 : 0;
  const out = [];
  const push = (n) => {
    if (!Number.isFinite(n)) return;
    const s = (decimals ? n.toFixed(1) : String(Math.round(n))).replace(".", ",") + suffix;
    if (s !== text && !out.includes(s)) out.push(s);
  };
  for (const d of [1, -1, 2, -2, 3, -3, 10, -10]) push(value + d);
  if (value !== 0) { push(value * 2); push(Math.round(value / 2)); }
  return out;
}

const SEM_ACENTO = (texto) => String(texto).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const PALAVRAS_VAZIAS = new Set("a o as os um uma uns umas de do da dos das no na nos nas em por para com sem sobre entre que se e ou mas como qual quais quando onde quem cujo sua seu suas seus isso isto este esta esse essa ele ela eles elas ao aos à às".split(" "));

function palavrasDe(texto) {
  return SEM_ACENTO(texto).split(/[^a-z0-9]+/).filter((w) => w.length >= 3 && !PALAVRAS_VAZIAS.has(w));
}

// Quanto mais perto da resposta certa, melhor para confundir: palavras em
// comum com a resposta valem mais que palavras em comum com a pergunta, e o
// mesmo começo (artigo, formato) desempata.
function semelhanca(candidato, correta, pergunta) {
  const alvo = new Set(palavrasDe(correta));
  const enunciado = new Set(palavrasDe(pergunta));
  let nota = 0;
  for (const palavra of new Set(palavrasDe(candidato))) {
    if (alvo.has(palavra)) nota += 3;
    if (enunciado.has(palavra)) nota += 1;
  }
  const inicioCorreta = String(correta).trim().toLowerCase().split(/\s+/)[0];
  const inicioCandidato = String(candidato).trim().toLowerCase().split(/\s+/)[0];
  if (inicioCorreta && inicioCorreta === inicioCandidato) nota += 1;
  return nota;
}

// Distratores próximos: trocar uma palavra pela oposta gera uma alternativa
// que parece certa e erra por um detalhe. É melhor que pescar uma opção de
// outra pergunta, que pode não ter nada a ver com o enunciado.
const PARES_OPOSTOS = [
  ["é sempre", "nunca é"], ["se aproxima", "se afasta"], ["se aproximam", "se afastam"],
  ["é maior", "é menor"], ["é possível", "é impossível"], ["é igual", "é diferente"],
  ["do produto", "da soma"], ["o produto", "a soma"], ["um produto", "uma soma"],
  ["maior", "menor"], ["sempre", "nunca"], ["aproxima", "afasta"], ["aproximam", "afastam"],
  ["aumenta", "diminui"], ["aumentam", "diminuem"], ["mantém", "muda"], ["muitas", "poucas"],
  ["muito", "pouco"], ["direta", "inversa"], ["possível", "impossível"], ["finito", "infinito"],
  ["igual", "diferente"], ["verdadeiro", "falso"], ["verdadeira", "falsa"], ["positivo", "negativo"],
  ["convergente", "divergente"], ["entrada", "saída"], ["derivada", "integral"],
  ["racional", "irracional"], ["real", "complexo"], ["necessariamente", "opcionalmente"],
  ["amostral", "populacional"], ["esperada", "observada"],
];

function escaparRegex(texto) {
  return String(texto).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function trocarPalavra(texto, de, para) {
  const re = new RegExp(`(?<![\\p{L}])${escaparRegex(de)}(?![\\p{L}])`, "iu");
  return String(texto).replace(re, (achado) => {
    const maiuscula = achado[0] === achado[0].toUpperCase() && achado[0] !== achado[0].toLowerCase();
    return maiuscula ? para[0].toUpperCase() + para.slice(1) : para;
  });
}

export function variantesProximas(correta, jaTem) {
  const out = [];
  const lower = (t) => String(t).trim().toLowerCase();
  for (const [a, b] of PARES_OPOSTOS) {
    for (const [de, para] of [[a, b], [b, a]]) {
      const variante = trocarPalavra(correta, de, para);
      if (variante === correta) continue;
      if (jaTem.has(lower(variante))) continue;
      if (out.some((v) => lower(v) === lower(variante))) continue;
      out.push(variante);
      if (out.length >= 2) return out;
    }
  }
  return out;
}

export function porSemelhanca(pool, correta, pergunta) {
  return pool
    .map((text, ordem) => ({ text, nota: semelhanca(text, correta, pergunta), ordem }))
    .sort((a, b) => b.nota - a.nota || a.ordem - b.ordem)
    .map((item) => item.text);
}

export function createQuestionIndex(questions = QUESTIONS, deepQuestions = DEEP_QUESTIONS) {
  const index = new Map();
  for (const [continent, tiers] of Object.entries(questions)) {
    index.set(continent, Object.fromEntries(Object.entries(tiers).map(([tier, entries]) => [tier, entries.map(q => ({ ...q, options: [...q.options] }))])));
  }
  for (const [continent, q] of Object.entries(deepQuestions)) {
    const tiers = index.get(continent);
    // a pergunta do fundo é escrita para o tema da caverna: no empate de
    // assunto, ela vem antes das perguntas gerais do continente
    if (tiers?.[3]) tiers[3].push({ ...q, options: [...q.options], deep: true });
  }
  return index;
}
export const QUESTION_INDEX = createQuestionIndex();

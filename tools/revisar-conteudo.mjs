// Revisor de conteúdo: roda fora do teste, com o mesmo índice que o jogo usa,
// e aponta o problema com continente, dificuldade e posição. Cada pergunta tem
// uma versão estável (hash do enunciado, alternativas e resposta): serve para
// saber se o texto mudou e para provar que duas perguntas não são a mesma.
import { fileURLToPath } from "node:url";
import { resolve } from "node:path";
import { QUESTION_INDEX } from "../src/gameplay/question-bank.js";

const SEM_ACENTO = (texto) => String(texto).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function normalizar(texto) {
  return SEM_ACENTO(texto).replace(/[^a-z0-9]+/g, " ").trim();
}

// FNV-1a de 32 bits: barato, estável e suficiente para identificar a pergunta.
export function hashDaPergunta({ q, options, a } = {}) {
  const texto = `${normalizar(q)}\u0000${(options || []).map(normalizar).join("\u0000")}\u0000${a}`;
  let h = 0x811c9dc5;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

const normalizarAlternativa = (texto) => String(texto).trim().replace(/\s+/g, " ").toLowerCase();
const AMBIGUA = /^(todas|nenhuma) (as|das|de) (alternativas|opcoes|respostas)$/;
const RASCUNHO = /\bTODO\b|\bFIXME\b|lorem ipsum|placeholder|\bxxx\b/;

export function revisarPergunta(pergunta, onde = "pergunta") {
  const erros = [];
  const q = pergunta?.q;
  const texto = String(q ?? "").trim();
  if (texto.length < 8) erros.push(`${onde}: enunciado curto (${texto.length} caracteres)`);
  if (!Array.isArray(pergunta?.options) || pergunta.options.length < 3 || pergunta.options.length > 6) {
    erros.push(`${onde}: ${pergunta?.options?.length ?? 0} alternativas, esperado de 3 a 6`);
  }
  const options = Array.isArray(pergunta?.options) ? pergunta.options : [];
  if (!Number.isInteger(pergunta?.a) || pergunta.a < 0 || pergunta.a >= options.length) {
    erros.push(`${onde}: resposta fora da faixa (${pergunta?.a})`);
  }
  const vistas = new Set();
  options.forEach((option, i) => {
    const t = String(option ?? "").trim();
    const n = normalizarAlternativa(t);
    if (!t) erros.push(`${onde}: alternativa ${i} vazia`);
    if (n && vistas.has(n)) erros.push(`${onde}: alternativa ${i} repete outra`);
    vistas.add(n);
    const ambiguo = normalizar(t);
    if (n && n === normalizar(texto)) erros.push(`${onde}: alternativa ${i} repete o enunciado`);
    if (AMBIGUA.test(ambiguo)) erros.push(`${onde}: alternativa ambígua "${t}"`);
  });
  const why = pergunta?.why;
  if (typeof why !== "string" || why.trim().length < 20) {
    erros.push(`${onde}: explicação curta ou ausente`);
  }
  if (RASCUNHO.test(`${texto} ${why ?? ""} ${options.join(" ")}`)) {
    erros.push(`${onde}: texto de rascunho`);
  }
  return erros;
}

// Revisa o índice inteiro, do jeito que o duelo o lê (inclui a pergunta do
// fundo). Devolve erros (quebram o jogo) e avisos (cheiro de cópia).
export function revisarBanco(index = QUESTION_INDEX) {
  const erros = [];
  const avisos = [];
  const versoes = new Map();
  const enunciados = new Map();
  const explicacoes = new Map();
  let total = 0;
  const entradas = index instanceof Map ? index.entries() : Object.entries(index);
  for (const [continente, tiers] of entradas) {
    for (const [tier, lista] of Object.entries(tiers)) {
      lista.forEach((pergunta, i) => {
        total++;
        const onde = `${continente}/${tier}#${i + 1}`;
        erros.push(...revisarPergunta(pergunta, onde));
        const versao = hashDaPergunta(pergunta);
        if (versoes.has(versao)) erros.push(`${onde}: mesma versão de ${versoes.get(versao)}`);
        else versoes.set(versao, onde);
        const enunciado = normalizar(pergunta.q);
        if (enunciados.has(enunciado)) erros.push(`${onde}: enunciado repetido de ${enunciados.get(enunciado)}`);
        else enunciados.set(enunciado, onde);
        const explicacao = normalizar(pergunta.why);
        if (explicacoes.has(explicacao)) avisos.push(`${onde}: explicação repetida de ${explicacoes.get(explicacao)}`);
        else explicacoes.set(explicacao, onde);
      });
    }
  }
  return { total, versoesUnicas: versoes.size, erros, avisos };
}

const executadoDireto = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (executadoDireto) {
  const { total, versoesUnicas, erros, avisos } = revisarBanco();
  if (process.argv.includes("--versoes")) {
    const entradas = QUESTION_INDEX instanceof Map ? QUESTION_INDEX.entries() : Object.entries(QUESTION_INDEX);
    for (const [continente, tiers] of entradas) {
      for (const [tier, lista] of Object.entries(tiers)) {
        lista.forEach((pergunta, i) => console.log(`${hashDaPergunta(pergunta)}\t${continente}/${tier}#${i + 1}\t${pergunta.q}`));
      }
    }
  }
  console.log(`${total} perguntas revisadas, ${versoesUnicas} versões únicas, ${erros.length} problema(s), ${avisos.length} aviso(s)`);
  for (const erro of erros) console.error(`ERRO ${erro}`);
  if (process.argv.includes("--avisos")) for (const aviso of avisos) console.log(`AVISO ${aviso}`);
  if (erros.length) process.exitCode = 1;
}

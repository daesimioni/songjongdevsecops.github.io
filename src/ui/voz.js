// Leitura em voz alta da pergunta de coleta. Usa o speechSynthesis do navegador,
// sem dependência e sem chave: voz pt-BR quando existe, e no-op quando a API
// não existe (node, navegador antigo). Nada aqui altera o estado do jogo.
const LIMITE = 1200;

export function vozDisponivel() {
  return typeof globalThis.speechSynthesis?.speak === "function"
    && typeof globalThis.SpeechSynthesisUtterance === "function";
}

export function pararVoz() {
  try { globalThis.speechSynthesis?.cancel?.(); } catch { /* sem voz */ }
}

// Lê a pergunta e as alternativas com as letras do teclado. Devolve false
// quando não há voz disponível, para a tela avisar em vez de fingir.
export function lerPergunta(question, { onend = null } = {}) {
  if (!vozDisponivel()) return false;
  const texto = String(question?.q || "").trim();
  if (!texto) return false;
  const opcoes = Array.isArray(question.options) ? question.options : [];
  const letras = "ABCDE";
  // o ponto final de cada trecho sai antes de juntar, senão a fala emenda
  // "L.." e soa como gagueira no alto-falante; "?" e "!" ficam, que são a
  // entonação da pergunta
  const semPonto = (t) => String(t ?? "").trim().replace(/\.+$/, "");
  const pergunta = semPonto(texto);
  const fim = /[?!]$/.test(pergunta) ? "" : ".";
  const alternativas = opcoes
    .map((opcao, i) => `${letras[i] || i + 1}: ${semPonto(opcao)}`)
    .join(". ");
  const frase = `Pergunta. ${pergunta}${fim}${alternativas ? ` Alternativas. ${alternativas}.` : ""}`;
  pararVoz();
  const fala = new globalThis.SpeechSynthesisUtterance(frase.slice(0, LIMITE));
  fala.lang = "pt-BR";
  fala.rate = 0.95;
  const voz = (globalThis.speechSynthesis.getVoices?.() || []).find((v) => /^pt/i.test(v?.lang || ""));
  if (voz) fala.voice = voz;
  if (typeof onend === "function") {
    fala.onend = onend;
    fala.onerror = onend;
  }
  globalThis.speechSynthesis.speak(fala);
  return true;
}

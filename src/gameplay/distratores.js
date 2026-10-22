// Erro por distrator: guarda qual alternativa o jogador marcou em cada
// pergunta, com uma versão estável do enunciado. O caderno mostra o erro
// específico e a revisão traz de volta a pergunta em que ele tropeçou.
export const MAX_DISTRATORES = 120;
export const JANELA_RECENTE = 7 * 24 * 60 * 60 * 1000;

const SEM_ACENTO = (texto) => String(texto).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
const normalizar = (texto) => SEM_ACENTO(texto).replace(/[^a-z0-9]+/g, " ").trim();

// FNV-1a de 32 bits, o mesmo do revisor de conteúdo: a versão do save e a do
// relatório precisam ser a mesma string.
export function versaoDaPergunta({ q, options, a } = {}) {
  const texto = `${normalizar(q)}\u0000${(options || []).map(normalizar).join("\u0000")}\u0000${a}`;
  let h = 0x811c9dc5;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 0x01000193) >>> 0;
  }
  return h.toString(16).padStart(8, "0");
}

export function purgar(distratores) {
  const chaves = Object.keys(distratores);
  if (chaves.length <= MAX_DISTRATORES) return;
  chaves.sort((a, b) => (Number(distratores[a]?.at) || 0) - (Number(distratores[b]?.at) || 0));
  for (const chave of chaves.slice(0, chaves.length - MAX_DISTRATORES)) delete distratores[chave];
}

export function registrarDistrator(distratores, pergunta, marcada, agora = Date.now()) {
  if (!distratores || typeof distratores !== "object") return null;
  const texto = String(marcada ?? "").trim();
  if (!texto) return null;
  // o deck traz a versão calculada antes de embaralhar; fora dele, calcula
  const versao = pergunta?.version || versaoDaPergunta(pergunta);
  const anterior = distratores[versao];
  const entry = {
    t: texto.slice(0, 160),
    n: (Number(anterior?.n) || 0) + 1,
    at: Number(agora) || Date.now(),
  };
  distratores[versao] = entry;
  purgar(distratores);
  return entry;
}

export function erroRecente(entry, agora = Date.now()) {
  return !!entry && Number.isFinite(entry.at) && Number(agora) - entry.at < JANELA_RECENTE;
}

export function recentes(distratores, limite = 5, agora = Date.now()) {
  if (!distratores || typeof distratores !== "object") return [];
  return Object.entries(distratores)
    .filter(([, entry]) => erroRecente(entry, agora))
    .sort((a, b) => b[1].at - a[1].at)
    .slice(0, Math.max(1, Math.min(20, limite)))
    .map(([versao, entry]) => ({ versao, texto: String(entry.t || ""), n: Number(entry.n) || 1, at: entry.at }));
}

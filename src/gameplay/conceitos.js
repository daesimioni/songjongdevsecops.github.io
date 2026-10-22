// Caderno de conceitos: cada área guarda um domínio de 0 a 5 e a data da
// próxima revisão. Acertar sobe um degrau e espaça; errar desce e traz de volta.
export const NIVEIS = 5;
const ESPERA_MIN = [10, 30, 120, 720, 1440, 4320]; // 10 min a 3 dias
const MINUTO = 60000;

export function conceitoDe(area, continente) {
  return String(area || continente || "geral");
}

export function registrarResposta(conceitos, area, acertou, agora) {
  if (!conceitos || typeof conceitos !== "object") return null;
  const chave = String(area || "geral");
  const atual = conceitos[chave] || { n: 0, r: 0, w: 0, due: 0 };
  const n = acertou
    ? Math.min(NIVEIS, (Number(atual.n) || 0) + 1)
    : Math.max(0, (Number(atual.n) || 0) - 1);
  const entry = {
    n,
    r: (Number(atual.r) || 0) + (acertou ? 1 : 0),
    w: (Number(atual.w) || 0) + (acertou ? 0 : 1),
    due: agora + ESPERA_MIN[n] * MINUTO,
  };
  conceitos[chave] = entry;
  return entry;
}

export function vencido(entry, agora) {
  return !entry || !Number.isFinite(entry.due) || entry.due <= agora;
}

export function resumoConceitos(conceitos, agora) {
  const entries = Object.entries(conceitos || {});
  const estudados = entries.length;
  const revisar = entries.filter(([, e]) => vencido(e, agora)).length;
  const dominados = entries.filter(([, e]) => (Number(e.n) || 0) >= NIVEIS).length;
  return { estudados, revisar, dominados };
}

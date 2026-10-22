// Ciclo dia/noite do vale: oito minutos por volta completa. O meio-dia fica no
// meio (luz 1) e a meia-noite no começo (luz 0); o desenho aplica só uma véu
// escuro por cima do mundo, então nada muda em colisão, lógica ou performance.
export const CICLO_MS = 8 * 60 * 1000;
const NOITE_MAX = 0.42;

let horaForcada = null;

export function forcarHora(fase) {
  if (fase == null || fase === "") {
    horaForcada = null;
    return;
  }
  const n = Number(fase);
  horaForcada = Number.isFinite(n) ? ((n % 1) + 1) % 1 : null;
}

export function horaForcadaAtual() {
  return horaForcada;
}

export function faseDoDia(t = Date.now()) {
  const bruto = horaForcada != null ? horaForcada * CICLO_MS : Number(t);
  const base = Number.isFinite(bruto) ? bruto : 0;
  const p = (((base % CICLO_MS) + CICLO_MS) % CICLO_MS) / CICLO_MS;
  const luz = (1 - Math.cos(p * Math.PI * 2)) / 2;
  const noite = 1 - luz;
  const alpha = Math.round(noite * NOITE_MAX * 100) / 100;
  return { p, luz, noite, alpha, cor: `rgba(8, 12, 34, ${alpha})` };
}

export function eNoite(t = Date.now()) {
  return faseDoDia(t).noite > 0.55;
}

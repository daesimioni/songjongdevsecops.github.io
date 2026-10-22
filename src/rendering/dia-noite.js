// Ciclo dia/noite do vale preso ao calendário: cada dia do jogo tem 24 horas,
// e cada hora do jogo dura um minuto real. O desenho aplica só um véu escuro
// por cima do mundo, então nada muda em colisão, lógica ou performance.
import { dataDoJogo, faseDoDiaDaHora } from "../core/calendario.js";

export const CICLO_MS = 24 * 60 * 1000;
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

// `t` é o instante real (Date.now), não o relógio de animação: o calendário
// manda na luz, e quem quiser prender a hora usa forcarHora.
export function faseDoDia(t = Date.now()) {
  const p = horaForcada != null
    ? horaForcada
    : (Number.isFinite(Number(t)) ? dataDoJogo(Number(t)).fracaoDoDia : 0);
  const { luz, noite } = faseDoDiaDaHora(p * 24);
  const alpha = Math.round(noite * NOITE_MAX * 100) / 100;
  return { p, luz, noite, alpha, cor: `rgba(8, 12, 34, ${alpha})` };
}

export function eNoite(t = Date.now()) {
  const hora = faseDoDia(t).p * 24;
  return hora < 6 || hora >= 18;
}

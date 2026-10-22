// O calendário do vale: o tempo de jogo corre 60 vezes o da vida real, então
// um minuto real é uma hora no jogo e um dia do jogo dura 24 minutos reais.
// O calendário é gregoriano igual ao nosso e conta os anos desde 18/01/1997.
export const FATOR_TEMPO = 60;
export const EPOCA_MS = Date.parse("1997-01-18T00:00:00-03:00");
export const FUSO_JOGO_MS = -3 * 60 * 60 * 1000; // America/Fortaleza
export const MESES = [
  "janeiro", "fevereiro", "março", "abril", "maio", "junho",
  "julho", "agosto", "setembro", "outubro", "novembro", "dezembro",
];
export const DIAS_DA_SEMANA = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
export const ESTACOES = ["verao", "outono", "inverno", "primavera"];
export const NOME_DA_ESTACAO = { verao: "verão", outono: "outono", inverno: "inverno", primavera: "primavera" };
export const DIA_DE_JOGO_MS = 24 * 60 * 60 * 1000;
export const ANO_DE_JOGO_MS = 365.2425 * DIA_DE_JOGO_MS;

// Hemisfério sul, nas datas do calendário: verão de 21/12 a 20/03, outono de
// 21/03 a 20/06, inverno de 21/06 a 22/09 e primavera de 23/09 a 20/12.
export function estacaoDeMesDia(mes, dia) {
  const md = mes * 100 + dia;
  if (md >= 1221 || md <= 320) return "verao";
  if (md <= 620) return "outono";
  if (md <= 922) return "inverno";
  return "primavera";
}

// Compatível com quem já passa um Date (clima, testes antigos): usa o mês e o
// dia locais para achar a estação.
export function estacaoDe(data = new Date()) {
  const mes = data.getMonth() + 1;
  const dia = data.getDate();
  return estacaoDeMesDia(mes, dia);
}

function dataGregoriana(ms) {
  const local = new Date(ms + FUSO_JOGO_MS);
  return {
    ano: local.getUTCFullYear(),
    mes: local.getUTCMonth() + 1,
    dia: local.getUTCDate(),
    hora: local.getUTCHours(),
    minuto: local.getUTCMinutes(),
    segundo: local.getUTCSeconds(),
    diaDaSemana: local.getUTCDay(),
    msNoDia: ((local.getUTCHours() * 60 + local.getUTCMinutes()) * 60 + local.getUTCSeconds()) * 1000 + local.getUTCMilliseconds(),
  };
}

export function msDoJogo(agora = Date.now()) {
  const real = Number(agora);
  if (!Number.isFinite(real)) return EPOCA_MS;
  return EPOCA_MS + Math.max(0, real - EPOCA_MS) * FATOR_TEMPO;
}

export function dataDoJogo(agora = Date.now()) {
  const base = dataGregoriana(msDoJogo(agora));
  const estacao = estacaoDeMesDia(base.mes, base.dia);
  const horaDecimal = base.hora + base.minuto / 60 + base.segundo / 3600;
  const inicioDoAno = Date.UTC(base.ano, 0, 1);
  const diaDoAno = Math.floor((Date.UTC(base.ano, base.mes - 1, base.dia) - inicioDoAno) / DIA_DE_JOGO_MS) + 1;
  const fracaoDoDia = Math.min(1, Math.max(0, horaDecimal / 24));
  return {
    ...base,
    mesNome: MESES[base.mes - 1],
    diaDaSemanaNome: DIAS_DA_SEMANA[base.diaDaSemana],
    estacao,
    estacaoNome: NOME_DA_ESTACAO[estacao],
    horaDecimal,
    diaDoAno,
    fracaoDoDia,
    ms: msDoJogo(agora),
  };
}

export function horaDoJogo(agora = Date.now()) {
  return dataDoJogo(agora).horaDecimal;
}

export function faseDoDiaDaHora(horaDecimal) {
  const h = ((Number(horaDecimal) % 24) + 24) % 24;
  // curva do sol: noite cheia antes das 6h e depois das 18h, pico ao meio-dia
  const luz = h <= 6 || h >= 18 ? 0 : Math.sin(((h - 6) / 12) * Math.PI);
  return { p: h / 24, luz, noite: 1 - luz, hora: h };
}

export function formatarHora(data) {
  const hh = String(data.hora).padStart(2, "0");
  const mm = String(data.minuto).padStart(2, "0");
  return `${hh}:${mm}`;
}

export function formatarData(data) {
  return `${data.dia} de ${data.mesNome} de ${data.ano}`;
}

export function formatarCalendario(data) {
  return `${formatarData(data)} · ${formatarHora(data)} · ${data.estacaoNome}`;
}

export function eDia(data) {
  return data.horaDecimal >= 6 && data.horaDecimal < 18;
}

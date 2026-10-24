// O calendário do vale: 1 minuto real é 1 hora do jogo, o dia tem 24 minutos
// reais, os anos são gregorianos e contam desde 18/01/1997. Roda sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  FATOR_TEMPO, EPOCA_MS, MESES, ESTACOES, ANO_DE_JOGO_MS,
  dataDoJogo, faseDoDiaDaHora, estacaoDeMesDia, estacaoDe,
  formatarData, formatarHora, formatarCalendario, eDia, msDoJogo,
} from "../src/core/calendario.js";

// ---- o relógio: 60x e o dia de 24 minutos reais ----
assert.equal(FATOR_TEMPO, 60);
const inicio = dataDoJogo(EPOCA_MS);
assert.equal(inicio.ano, 1997);
assert.equal(inicio.mes, 1);
assert.equal(inicio.dia, 18);
assert.equal(inicio.hora, 0);
assert.equal(inicio.minuto, 0);
assert.equal(inicio.estacao, "verao", "18 de janeiro é verão no hemisfério sul");

const umaHora = dataDoJogo(EPOCA_MS + 60_000);
assert.equal(umaHora.hora, 1, "um minuto real precisa valer uma hora");
assert.equal(umaHora.minuto, 0);
const umDia = dataDoJogo(EPOCA_MS + 24 * 60_000);
assert.equal(umDia.dia, 19, "24 minutos reais precisam virar um dia");
assert.equal(umDia.hora, 0);
const meioDia = dataDoJogo(EPOCA_MS + 12 * 60_000);
assert.equal(meioDia.hora, 12);
assert.equal(meioDia.fracaoDoDia, 0.5);

// o ano do jogo tem 365,2425 dias como o nosso; com 60x, ele passa em ~6 dias
// reais, então um ano real vale sessenta anos do jogo
assert.equal(ANO_DE_JOGO_MS, Math.round(365.2425 * 24 * 60 * 60 * 1000), "ano do jogo em ms de jogo errado");
const umAnoDeJogoReal = ANO_DE_JOGO_MS / FATOR_TEMPO;
const depoisDeUmAnoDeJogo = dataDoJogo(EPOCA_MS + umAnoDeJogoReal);
assert.equal(depoisDeUmAnoDeJogo.ano, 1998, `um ano do jogo devia virar 1998, veio ${depoisDeUmAnoDeJogo.ano}`);
assert.equal(depoisDeUmAnoDeJogo.mes, 1);
assert.equal(depoisDeUmAnoDeJogo.dia, 18);
const umAnoReal = 365.2425 * 24 * 60 * 60 * 1000;
const depoisDeUmAnoReal = dataDoJogo(EPOCA_MS + umAnoReal);
assert.equal(depoisDeUmAnoReal.ano, 2057, `um ano real devia dar sessenta anos do jogo, veio ${depoisDeUmAnoReal.ano}`);
assert.equal(msDoJogo(EPOCA_MS), EPOCA_MS, "a época precisa ser o marco zero do jogo");

// ---- estações do hemisfério sul nas datas ----
assert.equal(estacaoDeMesDia(1, 15), "verao");
assert.equal(estacaoDeMesDia(3, 20), "verao", "verão vai até 20/03");
assert.equal(estacaoDeMesDia(3, 21), "outono");
assert.equal(estacaoDeMesDia(6, 20), "outono");
assert.equal(estacaoDeMesDia(6, 21), "inverno");
assert.equal(estacaoDeMesDia(9, 22), "inverno");
assert.equal(estacaoDeMesDia(9, 23), "primavera");
assert.equal(estacaoDeMesDia(12, 20), "primavera");
assert.equal(estacaoDeMesDia(12, 21), "verao", "verão começa em 21/12");
assert.equal(estacaoDe(new Date(2026, 6, 1)), "inverno");
assert.deepEqual(ESTACOES, ["verao", "outono", "inverno", "primavera"]);
assert.equal(MESES.length, 12);

// ---- os campos e a formatação do HUD ----
const data = dataDoJogo(EPOCA_MS + 24 * 3 * 60_000 + 7 * 60_000); // 21/01/1997, 07:00
assert.equal(data.ano, 1997);
assert.equal(data.mes, 1);
assert.equal(data.dia, 21);
assert.equal(data.hora, 7);
assert.equal(data.mesNome, "janeiro");
assert.equal(data.diaDaSemanaNome, "terça", "21/01/1997 foi uma terça");
assert.equal(data.estacaoNome, "verão");
assert.equal(formatarData(data), "21 de janeiro de 1997");
assert.equal(formatarHora(data), "07:00");
assert.equal(formatarCalendario(data), "21 de janeiro de 1997 · 07:00 · verão");
assert.equal(eDia(data), true);
assert.equal(eDia({ horaDecimal: 5.9 }), false);
assert.equal(eDia({ horaDecimal: 18 }), false);

// ---- a curva de luz do dia ----
assert.equal(faseDoDiaDaHora(0).luz, 0);
assert.equal(faseDoDiaDaHora(6).luz, 0);
assert.equal(faseDoDiaDaHora(12).luz, 1);
assert.equal(faseDoDiaDaHora(18).luz, 0);
assert.equal(faseDoDiaDaHora(23.9).luz, 0);
assert.equal(faseDoDiaDaHora(9).luz > 0.5, true, "às 9h o sol está alto");

// ---- o app e o HTML ----
const app = fs.readFileSync(new URL("../src/app/app.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
assert.match(app, /function atualizarCalendario\(/, "o app não atualiza o calendário");
assert.match(app, /dataDoJogo\(\)/, "o app não lê a data do jogo");
assert.match(app, /calendario-progresso/, "o app não move a barra do dia");
assert.match(app, /renderer\.ambiente\.tick\(Date\.now\(\)\)/, "o clima não anda no relógio real");
assert.match(app, /evento\.id === "tornado"/, "o tornado não empurra o jogador");
assert.match(html, /id="calendario"/, "o calendário não existe no HUD");
assert.match(html, /id="calendario-data"/, "o calendário não mostra a data");
assert.match(html, /id="calendario-hora"/, "o calendário não mostra a hora");
assert.match(html, /id="calendario-fase"/, "o calendário não diz dia ou noite");

console.log(`ok calendário: ${data.ano}, 24 minutos por dia, 60x, quatro estações e HUD`);

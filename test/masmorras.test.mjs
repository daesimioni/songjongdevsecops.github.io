// As masmorras: seis plantas diferentes, todas organizadas (entrada embaixo,
// cidade no alto, chefe longe da boca, sala sem sobreposição e corredor que
// liga tudo), com piso e parede que mudam de acabamento.
// Roda sem navegador: node test/masmorras.test.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} };

const { DUNGEONS, CONURBATION } = await import("../js/dungeon-data.js");

const problemas = [];
const check = (ok, msg) => { if (!ok) problemas.push(msg); };
const caixa = (r) => ({ x0: r.x, y0: r.y, x1: r.x + r.w, y1: r.y + r.h });
const sobrepoe = (a, b) => {
  const A = caixa(a), B = caixa(b);
  return A.x0 < B.x1 && A.x1 > B.x0 && A.y0 < B.y1 && A.y1 > B.y0;
};

const plantas = new Set();
const modelos = new Map();
const pisos = new Set();
for (const d of DUNGEONS) {
  const L = d.layout;
  const nome = d.id;
  check(L.rooms.length === 10, `${nome}: ${L.rooms.length} salas, esperado 10`);
  check(new Set(L.rooms.map((r) => r.id)).size === L.rooms.length, `${nome}: id de sala repetido`);
  check(!!L.bossRoom && L.rooms.some((r) => r.id === L.bossRoom), `${nome}: sala do chefe inexistente`);

  const entrada = L.rooms.find((r) => r.kind === "entrance");
  const cidade = L.rooms.find((r) => r.kind === "city");
  const chefe = L.rooms.find((r) => r.id === L.bossRoom);
  check(!!entrada, `${nome}: sem entrada`);
  check(!!cidade, `${nome}: sem cidade do fundo`);
  check(!!chefe, `${nome}: sem sala do chefe`);
  if (entrada) check(entrada.y >= 38, `${nome}: entrada fora do rodapé (y ${entrada.y})`);
  if (cidade) check(cidade.y + cidade.h <= 12, `${nome}: cidade fora do topo (y ${cidade.y})`);
  if (entrada && chefe) {
    const dx = (chefe.x + chefe.w / 2) - (entrada.x + entrada.w / 2);
    const dy = (chefe.y + chefe.h / 2) - (entrada.y + entrada.h / 2);
    const dist = Math.hypot(dx, dy);
    check(dist >= 20, `${nome}: chefe a ${dist.toFixed(0)} tiles da entrada`);
  }
  if (chefe && cidade) check(!sobrepoe(chefe, cidade), `${nome}: chefe em cima da cidade`);

  for (const r of L.rooms) {
    check(r.x >= 1 && r.y >= 1 && r.x + r.w <= L.width - 1 && r.y + r.h <= L.height - 1, `${nome}/${r.id}: fora do mapa`);
    check(r.w >= 6 && r.h >= 4, `${nome}/${r.id}: sala pequena demais (${r.w}x${r.h})`);
  }
  for (let i = 0; i < L.rooms.length; i++) {
    for (let j = i + 1; j < L.rooms.length; j++) {
      check(!sobrepoe(L.rooms[i], L.rooms[j]), `${nome}: ${L.rooms[i].id} em cima de ${L.rooms[j].id}`);
    }
  }

  // corredor liga sala que existe, e a malha alcança todas
  const adj = new Map(L.rooms.map((r) => [r.id, []]));
  for (const [a, b] of L.corridors) {
    check(adj.has(a) && adj.has(b), `${nome}: corredor ${a}-${b} sem sala`);
    if (!adj.has(a) || !adj.has(b)) continue;
    adj.get(a).push(b);
    adj.get(b).push(a);
  }
  const vistos = new Set(["entrada"]);
  const fila = ["entrada"];
  while (fila.length) {
    const x = fila.pop();
    for (const y of adj.get(x) || []) if (!vistos.has(y)) { vistos.add(y); fila.push(y); }
  }
  check(vistos.size === L.rooms.length, `${nome}: ${L.rooms.length - vistos.size} salas sem caminho`);
  check(L.corridors.length >= L.rooms.length, `${nome}: ${L.corridors.length} corredores, esperado ao menos ${L.rooms.length} (tem atalho)`);

  plantas.add(JSON.stringify(L.rooms.map((r) => [r.x, r.y, r.w, r.h])).replace(/\"/g, ""));
  modelos.set(L.modelo, (modelos.get(L.modelo) || 0) + 1);
  pisos.add(L.acabamento);
}
check(DUNGEONS.length === 93, `masmorras: ${DUNGEONS.length}, esperado 93`);
check(plantas.size === DUNGEONS.length, `plantas repetidas: ${plantas.size} desenhos para ${DUNGEONS.length} cavernas`);
check(modelos.size === 6, `modelos de caverna: ${modelos.size}, esperado 6`);
for (const [modelo, n] of modelos) check(n >= 8, `modelo ${modelo} com ${n} cavernas, esperado ao menos 8`);
check(pisos.size === 4, `acabamentos de piso: ${pisos.size}, esperado 4`);

// a conurbação continua sendo a praça central, com portal para cada capital
check(CONURBATION.layout.rooms.length === 9, `conurbação: ${CONURBATION.layout.rooms.length} salas`);
check(CONURBATION.portals.length === 7, `conurbação: ${CONURBATION.portals.length} portais`);

// o pintor do chão usa o acabamento da planta e o chefe ganha arena
const fonte = readFileSync(new URL("../js/dungeon.js", import.meta.url), "utf8");
check(/buildTerrain\(state\.map, def\.palette, def\.layout\)/.test(fonte), "pintor de chão sem o layout");
check(/acabamento === 1/.test(fonte) && /acabamento === 2/.test(fonte) && /acabamento === 3/.test(fonte), "menos de quatro acabamentos de piso");
check(/room\.id === layout\?\.bossRoom/.test(fonte), "arena do chefe sem marca no chão");
check(/ouro espalhado/.test(fonte), "sala de tesouro sem marca no chão");

assert.equal(problemas.length, 0, `masmorras com ${problemas.length} problema(s):\n- ${problemas.slice(0, 12).join("\n- ")}`);
console.log(`ok masmorras: ${DUNGEONS.length} cavernas, ${modelos.size} plantas, ${pisos.size} acabamentos, chefe longe da boca e todas as salas alcançáveis`);

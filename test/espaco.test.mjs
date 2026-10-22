// Espaço: nada de coisa em cima de coisa. O mundo cobra distância entre totem,
// gente, boca de caverna, farol e clareira; a praça da capital subterrânea
// cobra o vão de cada serviço. Antes a boca da caverna nascia a 1 tile do
// totem, a casa a 0,7 de um NPC e a horta da caverna debaixo da mesa.
// Roda sem navegador: node test/espaco.test.mjs
import assert from "node:assert/strict";

globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} };

const { createWorld } = await import("../src/world/world.js");
const { pracaDaCaverna } = await import("../src/gameplay/dungeon-plaza.js");

const problemas = [];
const check = (ok, msg) => { if (!ok) problemas.push(msg); };

const world = createWorld();
const cheb = (a, b) => Math.max(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
const GRANDES = new Set(["casa", "cabana", "torre", "ruina", "galpao", "doca", "poco"]);

// ---- interativos da mesma ilha ----
const porArea = new Map();
const add = (id, p, tipo) => {
  if (!id) return;
  if (!porArea.has(id)) porArea.set(id, []);
  porArea.get(id).push({ x: p.x, y: p.y, tipo });
};
for (const s of world.stations) add(world.areaAt(s.x, s.y)?.id, s, "estacao");
for (const n of world.npcs) if (!n.trainer) add(world.areaAt(n.x, n.y)?.id, n, "npc");
for (const c of world.caves) add(world.areaAt(c.x, c.y)?.id, c, "caverna");
for (const h of world.hunters) add(world.areaAt(h.center.x, h.center.y)?.id, h.center, "cacada");
for (const p of world.waystones) add(world.areaAt(p.x, p.y)?.id, p, "farol");
let paresJuntos = 0;
for (const [id, lista] of porArea) {
  for (let i = 0; i < lista.length; i++) {
    for (let j = i + 1; j < lista.length; j++) {
      const d = Math.hypot(lista[i].x - lista[j].x, lista[i].y - lista[j].y);
      if (d < 3) {
        paresJuntos++;
        check(false, `${id}: ${lista[i].tipo} e ${lista[j].tipo} a ${d.toFixed(2)} tiles`);
      }
    }
  }
}
check(paresJuntos === 0, `${paresJuntos} pares de interativos abaixo de 3 tiles`);

// totem com totem: 3,5 tiles no mínimo
let minEst = 99;
for (let i = 0; i < world.stations.length; i++) {
  for (let j = i + 1; j < world.stations.length; j++) {
    const a = world.stations[i], b = world.stations[j];
    if (world.areaAt(a.x, a.y)?.id !== world.areaAt(b.x, b.y)?.id) continue;
    minEst = Math.min(minEst, cheb(a, b));
  }
}
check(minEst >= 3.5, `dois totens a ${minEst.toFixed(2)} tiles`);

// ---- boca de caverna e construção ----
const grandes = world.ambiente.filter((a) => GRANDES.has(a.tipo));
let minBocaTotem = 99, minBocaGente = 99, minBocaCasa = 99;
for (const c of world.caves) {
  for (const s of world.stations) minBocaTotem = Math.min(minBocaTotem, Math.hypot(c.x - s.x, c.y - s.y));
  for (const n of world.npcs) minBocaGente = Math.min(minBocaGente, Math.hypot(c.x - n.x, c.y - n.y));
  for (const a of grandes) minBocaCasa = Math.min(minBocaCasa, Math.hypot(c.x - a.x, c.y - a.y));
}
check(minBocaTotem >= 3, `boca a ${minBocaTotem.toFixed(2)} tiles de um totem`);
check(minBocaGente >= 2.6, `boca a ${minBocaGente.toFixed(2)} tiles de um NPC`);
check(minBocaCasa >= 3, `boca a ${minBocaCasa.toFixed(2)} tiles de uma construção`);

let minCasaGente = 99, minCasaTotem = 99;
for (const a of grandes) {
  for (const n of world.npcs) minCasaGente = Math.min(minCasaGente, Math.hypot(a.x - n.x, a.y - n.y));
  for (const s of world.stations) minCasaTotem = Math.min(minCasaTotem, Math.hypot(a.x - s.x, a.y - s.y));
}
check(minCasaGente >= 3, `construção a ${minCasaGente.toFixed(2)} tiles de um NPC`);
check(minCasaTotem >= 2.4, `construção a ${minCasaTotem.toFixed(2)} tiles de um totem`);

// ---- praça da capital subterrânea: três faixas com vão ----
for (const w of [20, 22, 24]) {
  for (const h of [11]) {
    const city = { x: 18, y: 2, w, h };
    const def = { id: "dungeon-teste", continent: "math" };
    const props = pracaDaCaverna(def, city);
    check(props.length === 11, `praça ${w}x${h}: ${props.length} peças, esperado 11`);
    for (let i = 0; i < props.length; i++) {
      for (let j = i + 1; j < props.length; j++) {
        const d = Math.hypot(props[i].x - props[j].x, props[i].y - props[j].y);
        check(d >= 2, `praça ${w}x${h}: ${props[i].kind} e ${props[j].kind} a ${d.toFixed(2)} tiles`);
      }
      const p = props[i];
      check(p.x >= city.x && p.x <= city.x + city.w && p.y >= city.y && p.y <= city.y + city.h, `praça ${w}x${h}: ${p.kind} fora da sala`);
    }
  }
}
// a mesa de vocação entra por fora da função; precisa caber no vão também
for (const w of [20, 22, 24]) {
  const city = { x: 18, y: 2, w, h: 11 };
  const mesa = { x: city.x + w * 0.5, y: city.y + 5.6 };
  for (const p of pracaDaCaverna({ id: "x", continent: "math" }, city)) {
    const d = Math.hypot(mesa.x - p.x, mesa.y - p.y);
    check(d >= 2 || p.kind === "plot", `praça ${w}: mesa de vocação a ${d.toFixed(2)} de ${p.kind}`);
  }
}

assert.equal(problemas.length, 0, `espaço com ${problemas.length} problema(s):\n- ${problemas.slice(0, 12).join("\n- ")}`);
console.log(`ok espaço: ${world.stations.length} totens, ${world.caves.length} bocas e ${grandes.length} construções com vão; praça da caverna em 3 faixas com 2 tiles entre peças`);

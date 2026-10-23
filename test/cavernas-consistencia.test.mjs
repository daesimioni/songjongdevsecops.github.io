// Consistência das cavernas: a sala temática precisa variar com a planta, os
// veios não podem nascer na mesma sala da peça de cenário nem na arena do
// chefe, o baú da praça é livre e o HUD de combate não quebra palavra.
import assert from "node:assert/strict";
import fs from "node:fs";

const { DUNGEONS } = await import("../src/content/dungeon-data.js");
const { salaTematica, propsDaSala, salasDosVeios, TEMA_DA_SALA } = await import("../src/content/salas-tematicas.js");

const problemas = [];
const check = (ok, msg) => { if (!ok) problemas.push(msg); };
const salasTematicas = new Set();
const tipos = { oficina: 0, biblioteca: 0, observatorio: 0 };

check(DUNGEONS.length === 93, `cavernas: ${DUNGEONS.length}, esperado 93`);
for (const def of DUNGEONS) {
  const alvo = salaTematica(def);
  check(!!alvo, `${def.id}: sem sala temática`);
  if (!alvo) continue;
  const { room, tipo } = alvo;
  salasTematicas.add(room.id);
  tipos[tipo] = (tipos[tipo] || 0) + 1;
  check(tipo === TEMA_DA_SALA[def.continent], `${def.id}: tema não segue o continente`);
  check(room.id !== def.layout?.bossRoom, `${def.id}: sala temática na arena do chefe`);
  check(room.kind !== "entrance" && room.kind !== "city", `${def.id}: sala temática na entrada ou cidade`);
  check(propsDaSala(def).length === 3, `${def.id}: peças temáticas fora de 3`);

  const veios = salasDosVeios(def);
  check(veios.length === 3, `${def.id}: ${veios.length} salas de veio, esperado 3`);
  check(new Set(veios).size === veios.length, `${def.id}: veio repetido em duas salas`);
  check(!veios.includes(room.id), `${def.id}: veio dividindo a sala temática`);
  check(!veios.includes(def.layout?.bossRoom), `${def.id}: veio na arena do chefe`);
  check(veios.every((id) => def.rooms.some((r) => r.id === id)), `${def.id}: veio em sala inexistente`);
}

const soma = Object.values(tipos).reduce((s, n) => s + n, 0);
check(soma === 93, `salas com tema: ${soma}, esperado 93`);
check(salasTematicas.size >= 3, `sala temática sempre em ${[...salasTematicas].join(", ")}`);
check(Object.values(tipos).every((n) => n >= 10), `distribuição de temas: ${JSON.stringify(tipos)}`);

const dungeon = fs.readFileSync(new URL("../src/app/dungeon.js", import.meta.url), "utf8");
check(/room\.kind !== "city" && \(room\.tier \|\| 0\) >= 3/.test(dungeon), "o baú da praça ainda cobra chave");
check(/salasDosVeios\(def\)/.test(dungeon), "a geração não usa as salas de veio sem conflito");

const interfaceCss = fs.readFileSync(new URL("../css/interface.css", import.meta.url), "utf8");
const ajudaHtml = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
check(!/cercam a arena/.test(ajudaHtml), "a ajuda ainda fala da arena que não existe");
check(!/chance de levar um golpe/.test(ajudaHtml), "a ajuda ainda promete dano aleatório na fuga");
check(!/sem perder vida e sem levar item/.test(ajudaHtml), "a ajuda ainda diz que o treino não tira vida");
check(/#world-combat button > span:not\(\.combat-icon\) \{[^}]*white-space: nowrap/s.test(interfaceCss), "o rótulo do combate ainda quebra no meio da palavra");
check(/@media \(max-width: 720px\) \{[^}]*#world-combat \.combat-actions \{[^}]*repeat\(2/s.test(interfaceCss), "o HUD do combate não usa duas colunas no celular");
check(/body:has\(#world-combat:not\(\[hidden\]\)\) \.toast \{ bottom: 230px; \}/.test(interfaceCss), "o recado do jogo ainda cobre os botões da batalha");

assert.equal(problemas.length, 0, `cavernas com ${problemas.length} problema(s):\n- ${problemas.slice(0, 12).join("\n- ")}`);
console.log(`ok cavernas: ${DUNGEONS.length} salas temáticas em ${salasTematicas.size} cômodos, veios fora delas e do chefe; HUD sem palavra quebrada`);

// Sala temática por disciplina: cada uma das 93 cavernas tem um cômodo com a
// cara do assunto (oficina, biblioteca ou observatório), com três peças de
// cenário encostadas nas paredes, sem fechar o miolo do combate.
// Roda sem navegador: node test/salas.test.mjs
import assert from "node:assert/strict";

const { DUNGEONS } = await import("../js/dungeon-data.js");
const { salaTematica, propsDaSala, TEMA_DA_SALA } = await import("../js/salas-tematicas.js");

const problemas = [];
const check = (ok, msg) => { if (!ok) problemas.push(msg); };
const tipos = new Set(["oficina", "biblioteca", "observatorio"]);
const contagem = { oficina: 0, biblioteca: 0, observatorio: 0 };

check(DUNGEONS.length === 93, `cavernas: ${DUNGEONS.length}, esperado 93`);
for (const def of DUNGEONS) {
  const alvo = salaTematica(def);
  check(!!alvo, `${def.id}: sem sala temática`);
  if (!alvo) continue;
  const { room, tipo } = alvo;
  contagem[tipo] = (contagem[tipo] || 0) + 1;
  check(tipos.has(tipo), `${def.id}: tipo de sala estranho (${tipo})`);
  check(tipo === TEMA_DA_SALA[def.continent], `${def.id}: tema não segue o continente`);
  check(room.kind !== "entrance" && room.kind !== "city", `${def.id}: sala temática na entrada ou na cidade`);
  check(room.id !== def.layout?.bossRoom, `${def.id}: sala temática é a do chefe`);
  check(room.w >= 6 && room.h >= 5, `${def.id}: sala pequena demais (${room.w}x${room.h})`);

  const props = propsDaSala(def);
  check(props.length === 3, `${def.id}: ${props.length} peças, esperado 3`);
  const vistos = new Set();
  for (const p of props) {
    check(p.kind === tipo, `${def.id}: peça ${p.kind} fora do tema ${tipo}`);
    check(p.x > room.x + 1 && p.x < room.x + room.w - 1, `${def.id}: peça fora da sala em x`);
    check(p.y > room.y + 0.8 && p.y < room.y + room.h - 0.8, `${def.id}: peça fora da sala em y`);
    const chave = `${p.x.toFixed(2)},${p.y.toFixed(2)}`;
    check(!vistos.has(chave), `${def.id}: peça repetida em ${chave}`);
    vistos.add(chave);
    // o meio da sala fica livre: a peça é de parede, não de passagem
    const mx = room.x + room.w / 2, my = room.y + room.h / 2;
    check(Math.hypot(p.x - mx, p.y - my) > 1.2, `${def.id}: peça no miolo da sala`);
  }
}

for (const tipo of tipos) check(contagem[tipo] >= 10, `poucas salas ${tipo}: ${contagem[tipo]}`);
const soma = Object.values(contagem).reduce((s, n) => s + n, 0);
check(soma === 93, `salas com tema: ${soma}, esperado 93`);

assert.equal(problemas.length, 0, `salas com ${problemas.length} problema(s):\n- ${problemas.slice(0, 12).join("\n- ")}`);
console.log(`ok salas: 93 cavernas, oficina ${contagem.oficina}, biblioteca ${contagem.biblioteca}, observatório ${contagem.observatorio}; 279 peças de cenário`);

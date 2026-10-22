// Casa de verdade: fachada no tamanho de uma pessoa, parede que barra o corpo,
// porta que abre para uma sala fechada com mesa, fogo e cama. Sem isso a cabana
// era um enfeite do tamanho do boneco e não servia para nada.
// Roda sem navegador: node test/casas.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";

globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} };

const { createWorld } = await import("../js/world.js");
const { CONSTRUCOES } = await import("../js/assets/construcoes.js");
const { tamanhoDoAsset } = await import("../js/assets/index.js");
const { TILE, TILE_KIND: K, PLAYER_W, PLAYER_H } = await import("../js/config.js");

const problemas = [];
const check = (ok, msg) => { if (!ok) problemas.push(msg); };
const world = createWorld();

// ---- porte: a casa cresceu para caber gente na porta ----
check((CONSTRUCOES.casa.escala || 1) >= 2, "casa não cresceu");
check((CONSTRUCOES.cabana.escala || 1) >= 2, "cabana não cresceu");
check((CONSTRUCOES.torre.escala || 1) >= 2, "torre não cresceu");
check((CONSTRUCOES.galpao.escala || 1) >= 2, "galpão não cresceu");
const casaT = tamanhoDoAsset("casa");
check(casaT && casaT.w / TILE >= 5, `casa com ${(casaT?.w || 0) / TILE} tiles de largura`);
check(casaT && casaT.h / TILE >= 4, `casa com ${(casaT?.h || 0) / TILE} tiles de altura`);

// ---- 72 fachadas com porta na frente ----
check(world.casas.length >= 60, `casas: ${world.casas.length}, esperado 60+`);
const tipos = new Set(["casa", "cabana", "torre", "galpao"]);
for (const casa of world.casas) {
  check(tipos.has(casa.tipo), `tipo de casa estranho: ${casa.tipo}`);
  check(typeof casa.bioma === "string" && casa.bioma.length > 0, `casa sem bioma: ${casa.x},${casa.y}`);
  // a frente da casa é chão livre: dá para chegar na porta
  check(!world.boxCollides(casa.door.x, casa.door.y, PLAYER_W, PLAYER_H), `porta tapada em ${casa.bioma}`);
  const t = world.get(Math.floor(casa.door.x), Math.floor(casa.door.y));
  check(t !== K.WATER, `porta na água em ${casa.bioma}`);
  // a fachada barra o corpo: não atravessa mais a parede
  check(world.boxCollides(casa.x, casa.y - 0.6, PLAYER_W, PLAYER_H), `casa atravessável em ${casa.bioma}`);
}

// ---- soleira desenhada: degrau com as runas da área na frente de cada porta ----
const render = fs.readFileSync(new URL("../js/render.js", import.meta.url), "utf8");
check(/function drawSoleira\(casa\)/.test(render), "render sem soleira da casa");
check(/for \(const casa of world\.casas\)[\s\S]{0,200}drawSoleira\(casa\)/.test(render), "soleira fora da fila das casas");
check(/BIOMES\[casa\.bioma\]\?\.accent/.test(render), "soleira não usa a cor da área");

// ---- quatro salas fechadas, cada uma com a sua porta ----
const salas = Object.values(world.interiores);
check(salas.length === 4, `salas: ${salas.length}, esperado 4`);
for (const sala of salas) {
  let paredes = 0, furos = 0;
  const portaX = Math.floor(sala.door.x), portaY = sala.y + sala.h - 1;
  for (let y = sala.y; y < sala.y + sala.h; y++) {
    for (let x = sala.x; x < sala.x + sala.w; x++) {
      const borda = x === sala.x || y === sala.y || x === sala.x + sala.w - 1 || y === sala.y + sala.h - 1;
      const t = world.get(x, y);
      if (!borda) {
        check(t !== K.WALL, `parede no meio da sala em ${x},${y}`);
        continue;
      }
      if (x === portaX && y === portaY) {
        check(t !== K.WALL, "porta fechada por parede");
        furos++;
        continue;
      }
      if (t === K.WALL) paredes++;
    }
  }
  check(furos === 1, `sala com ${furos} portas, esperado 1`);
  check(paredes > 0, "sala sem parede");
  // o corpo nasce dentro, em pé, sem parede no spawn
  check(world.get(Math.floor(sala.spawn.x), Math.floor(sala.spawn.y)) !== K.WALL, "spawn dentro da parede");
  check(!world.boxCollides(sala.spawn.x, sala.spawn.y, PLAYER_W, PLAYER_H), "spawn sem espaço para o corpo");
  // mesa e fogo ficam dentro da sala, longe da parede
  for (const [nome, p] of [["mesa", sala.mesa], ["lareira", sala.lareira], ["cama", sala.cama]]) {
    check(p.x > sala.x && p.x < sala.x + sala.w - 1 && p.y > sala.y && p.y < sala.y + sala.h - 1, `${nome} fora da sala`);
  }
}

// mesa, fogo e cama ficam parados na sala e barram o corpo; a mobília
// sorteada também virou sólida (ver test/interior-collision.test.mjs)
const moveisFixos = world.props.filter((p) => String(p.tipo || "").startsWith("movel:"));
check(moveisFixos.length === 11, `móveis fixos com caixa: ${moveisFixos.length}, esperado 11`);
for (const sala of salas) {
  check(world.boxCollides(sala.mesa.x, sala.mesa.y - 0.3, PLAYER_W, PLAYER_H), "mesa atravessável");
  check(world.boxCollides(sala.lareira.x, sala.lareira.y - 0.3, PLAYER_W, PLAYER_H), "fogo atravessável");
}

// ---- mobília: determinística por casa, dentro da sala, com mesa/fogo/cama ----
const casaA = world.casas.find((c) => c.tipo === "casa");
const casaB = world.casas.filter((c) => c.tipo === "casa")[1];
const guardar = () => world.interiorProps.map((m) => `${m.tipo}@${m.x.toFixed(2)},${m.y.toFixed(2)}`).join("|");
world.prepararInterior(casaA);
const layoutA = guardar();
world.prepararInterior(casaA);
check(guardar() === layoutA, "a mesma casa muda de mobília ao entrar de novo");
world.prepararInterior(casaB);
const layoutB = guardar();
check(layoutA !== layoutB || !casaB, "duas casas do mesmo tipo têm a mesma mobília");
const salaA = world.interiores[casaA.tipo];
world.prepararInterior(casaA);
const tiposMoveis = world.interiorProps.map((m) => m.tipo);
check(tiposMoveis.includes("mesa"), "sala sem mesa de estudo");
check(tiposMoveis.includes("fogueira"), "sala sem fogo");
check(tiposMoveis.includes("cama"), "casa sem cama");
check(world.interiorProps.length >= 8, `poucos móveis: ${world.interiorProps.length}`);
for (const m of world.interiorProps) {
  check(m.x > salaA.x + 0.4 && m.x < salaA.x + salaA.w - 0.4, `móvel ${m.tipo} encostado na parede x`);
  check(m.y > salaA.y + 0.4 && m.y < salaA.y + salaA.h - 0.4, `móvel ${m.tipo} encostado na parede y`);
}

assert.equal(problemas.length, 0, `casas com ${problemas.length} problema(s):\n- ${problemas.slice(0, 12).join("\n- ")}`);
console.log(`ok casas: ${world.casas.length} fachadas com porta e soleira, 4 salas fechadas, ${world.interiorProps.length} móveis na casa de ${casaA.bioma}`);

import test from "node:test";
import assert from "node:assert/strict";
import { createWorldCombat, combatSpawn, COMBAT_TILE } from "../src/gameplay/combate-mundo.js";
const store = new Map();
globalThis.localStorage = { getItem: k => store.get(k) || null, setItem: (k, v) => store.set(k, v), removeItem: k => store.delete(k) };
const { RPG } = await import("../src/gameplay/rpg.js");
const ground = { id: "world-test", continent: "cs", loot: ["chip"], material: "ferro", dungeon: true };
function scene(options = {}) {
  store.clear();
  let xp = 0, respawns = 0;
  const player = { x: 100, y: 80, dir: 7 };
  const rpg = new RPG({ gainXp: n => { xp += n; }, getLevel: () => 1, toast() {}, audio: {}, onRespawn: () => { respawns++; player.x = 1; player.y = 1; } });
  const enemy = { id: "world-enemy", name: "Gosma", kind: "slime", tier: 1, x: 101, y: 80, alive: true };
  const finishes = [];
  const battle = createWorldCombat({ rpg, player, canOccupy: (x, y) => x > 0 && y > 0, onFinish: e => finishes.push(e), ...options });
  assert.ok(battle.start(enemy, ground));
  return { rpg, player, enemy, battle, finishes, xp: () => xp, respawns: () => respawns };
}

test("encontro conserva coordenadas reais e não prende ao retângulo da arena", () => {
  const s = scene();
  assert.equal(s.battle.model.principal.x, 101 * COMBAT_TILE);
  s.player.x = 102; s.battle.tick(0.016);
  assert.equal(s.player.x, 102);
  assert.equal(s.player.y, 80);
  assert.equal(s.player.dir, 7);
});
test("ataques e área não atravessam paredes; deslocamento e esquiva são varridos", () => {
  const s = scene({ canOccupy: (x, y) => x < 100.4 || x > 100.6 });
  const c = s.battle.model, hp = c.principal.hp, vida = s.rpg.hp();
  assert.equal(c.inimigoAoAlcance(), null);
  s.battle.attack(); // Pode golpear o ar; não pode ferir através da parede.
  c.resolverGolpe(c.principal); c.areaDoChefe(c.principal);
  assert.equal(s.rpg.hp(), vida);
  assert.equal(c.principal.hp, hp);
  c.jogador.alvo = { x: 110 * COMBAT_TILE, y: 80 * COMBAT_TILE };
  s.battle.dodge();
  for (let i = 0; i < 6; i++) s.battle.tick(0.03);
  assert.ok(s.player.x <= 100.401, "a esquiva atravessou a parede");
  assert.ok(s.enemy.x > 100.6, "o monstro atravessou a parede");
});
test("fuga mantém dano no monstro, posição e vida do jogador", () => {
  const s = scene(); s.battle.attack();
  const hp = s.battle.model.principal.hp;
  s.battle.stop("escape");
  assert.equal(s.enemy.combatHp, hp);
  assert.equal(s.player.x, 100);
  assert.equal(s.rpg.duel, null);
  assert.ok(s.battle.start(s.enemy, ground));
  assert.equal(s.battle.model.principal.hp, hp);
});
test("cada morte paga uma vez, mesmo ao recuar de uma matilha", () => {
  const s = scene();
  const other = { id: "other", name: "Outra", tier: 1, kind: "slime", x: 102, y: 80, alive: true };
  assert.ok(s.battle.join(other));
  assert.equal(s.battle.join(other), false);
  s.battle.model.aplicarDano(s.battle.model.principal, 1000);
  const xp = s.xp(); assert.ok(xp > 0);
  assert.equal(s.rpg.monsterAlive(s.enemy.id), false);
  s.battle.stop("escape");
  assert.equal(s.xp(), xp);
  assert.equal(s.finishes[0].result.defeated, 1);
  assert.equal(other.alive, true);
});
test("vitória termina no mapa sem teleporte nem pagamento duplicado", () => {
  const s = scene(); const c = s.battle.model;
  c.aplicarDano(c.principal, 1000);
  const xp = s.xp(); s.battle.tick(0.016); s.battle.tick(0.016);
  assert.equal(s.finishes.length, 1);
  assert.equal(s.finishes[0].reason, "victory");
  assert.equal(s.player.x, 100); assert.equal(s.xp(), xp);
  assert.equal(s.enemy.alive, false); assert.equal(s.rpg.duel, null);
});
test("morte executa respawn uma vez e nunca copia a posição antiga por cima", () => {
  const s = scene(); s.rpg.data.hp = 1;
  s.battle.model.ferirJogador(1000);
  s.battle.tick(0.016);
  assert.equal(s.respawns(), 1);
  assert.deepEqual([s.player.x, s.player.y], [1, 1]);
  assert.equal(s.rpg.duel, null);
});
test("spawn de treino/evento exige chão livre e passagem até o jogador", () => {
  assert.equal(combatSpawn({ x: 1, y: 1 }, () => false), null);
  const p = combatSpawn({ x: 1, y: 1 }, (x, y) => x > 0 && y > 0);
  assert.ok(p && Math.hypot(p.x - 1, p.y - 1) >= 1.5);
});

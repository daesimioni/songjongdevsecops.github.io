import { moveWithCollision } from "../core/movement.js";
import { segmentFree } from "../core/collision.js";

// A simulação usa 48 unidades por tile; os atores continuam no mapa original.
export const COMBAT_TILE = 48;
export function combatSpawn(player, canOccupy) {
  for (const radius of [2, 3, 1.5]) for (let i = 0; i < 8; i++) {
    const angle = i * Math.PI / 4;
    const point = { x: player.x + Math.cos(angle) * radius, y: player.y + Math.sin(angle) * radius };
    if (canOccupy(point.x, point.y) && segmentFree(player, point, canOccupy)) return point;
  }
  return null;
}
export function createWorldCombat({ rpg, player, canOccupy, chase, onFinish = () => {}, onEvent = () => {} }) {
  let model = null;
  let actors = [];
  const tile = (a) => ({ x: a.x / COMBAT_TILE, y: a.y / COMBAT_TILE });
  function bind(enemy, actor) {
    enemy.x = actor.x * COMBAT_TILE;
    enemy.y = actor.y * COMBAT_TILE;
    enemy.dir = actor.dir || 0;
    if (Number.isFinite(actor.combatHp)) enemy.hp = actor.combatHp;
    actor.combat = enemy;
    actors.push(actor);
    if (!model.training) rpg.noteMonster?.(actor);
  }
  function start(monster, ground, boss = false, partners = [], prepared = null) {
    if (model || rpg.duel && !prepared) return false;
    const result = prepared || rpg.startDuel(monster, ground, boss, partners);
    if (!result.ok) return false;
    model = result.combate;
    actors = [];
    model.space = {
      externalPlayer: true,
      visible: (a, b) => segmentFree(tile(a), tile(b), canOccupy),
      move: (a, dx, dy) => {
        const p = tile(a);
        moveWithCollision(p, dx / COMBAT_TILE, dy / COMBAT_TILE, canOccupy);
        a.x = p.x * COMBAT_TILE; a.y = p.y * COMBAT_TILE;
      },
      chase: chase ? (a, b) => {
        const point = chase(tile(a), tile(b), a);
        return point ? { x: point.x * COMBAT_TILE, y: point.y * COMBAT_TILE } : a;
      } : null,
      rewardOne: (enemy) => rpg.victory({ ...rpg.duel, monster: enemy.monster, boss: enemy.boss, tier: enemy.tier, partners: [] }),
    };
    [monster, ...partners].forEach((actor, i) => bind(model.inimigos[i], actor));
    syncPlayer();
    return true;
  }
  function syncPlayer() {
    model.jogador.x = player.x * COMBAT_TILE;
    model.jogador.y = player.y * COMBAT_TILE;
    model.jogador.dir = player.dir;
  }
  function finish(reason) {
    if (!model) return;
    const old = model;
    model = null;
    for (const actor of actors) {
      actor.combatHp = actor.combat.hp;
      actor.alive = !actor.combat.morte;
      actor.combat = null;
    }
    actors = [];
    if (old.phase === "combat") rpg.flee();
    else rpg.next();
    onFinish({ reason: old.phase === "combat" ? reason : old.phase, result: old.worldResult || { xp: 0, loot: [], defeated: 0 }, training: old.training, ground: old.ground, monster: old.principal.monster, boss: old.boss });
  }
  function tick(dt) {
    const current = model;
    if (!current) return;
    syncPlayer();
    const events = current.passo(dt);
    if (model !== current) return;
    // O respawn já posicionou o jogador; nunca copiá-lo de volta à luta.
    if (current.phase !== "defeat") {
      player.x = current.jogador.x / COMBAT_TILE;
      player.y = current.jogador.y / COMBAT_TILE;
      player.dir = current.jogador.dir;
    }
    for (let i = 0; i < actors.length; i++) {
      const actor = actors[i], enemy = current.inimigos[i];
      actor.moving = Math.hypot(actor.x - enemy.x / COMBAT_TILE, actor.y - enemy.y / COMBAT_TILE) > 0.0001;
      actor.x = enemy.x / COMBAT_TILE; actor.y = enemy.y / COMBAT_TILE;
      actor.dir = enemy.dir; actor.alive = !enemy.morte;
      actor.combatHp = enemy.hp;
    }
    for (const event of events) onEvent(event, current);
    if (current.phase !== "combat") finish(current.phase);
    else if (current.vivos().every(e => Math.hypot(e.x - current.jogador.x, e.y - current.jogador.y) > 12 * COMBAT_TILE)) finish("escape");
  }
  function join(actor) {
    const enemy = model?.adicionar(actor);
    if (!enemy) return false;
    bind(enemy, actor);
    return true;
  }
  return {
    start, tick, join, stop: finish,
    get model() { return model; },
    get active() { return !!model; },
    get dodging() { return !!model && model.agora < model.jogador.esquivaAte; },
    get speedFactor() { return model?.jogador.defendendo ? 0.45 : 1; },
    canStand: (x, y) => !model || model.vivos().every(e => Math.hypot(e.x / COMBAT_TILE - x, e.y / COMBAT_TILE - y) >= (e.raio + 12) / COMBAT_TILE),
    attack: () => {
      if (!model) return false;
      syncPlayer();
      const result = model.atacar();
      player.dir = model.jogador.dir;
      return result;
    },
    defend: (on) => model?.defender(on),
    dodge: () => {
      if (!model) return false;
      syncPlayer();
      const result = model.esquivar();
      player.dir = model.jogador.dir;
      return result;
    },
    spell: (id) => model?.usarMagia(id), pet: () => model?.usarBicho(),
    target: (actor) => { if (model && actor.combat) model.target = actor.combat; },
  };
}

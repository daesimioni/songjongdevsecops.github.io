// Escudo equipado no combate de ação: segura o primeiro golpe, some ao gastar
// e volta no combate seguinte. Roda sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};
const { RPG } = await import("../src/gameplay/rpg.js");

function novo({ escudo = false } = {}) {
  store.clear();
  const rpg = new RPG({ getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} });
  if (escudo) {
    rpg.addItem("escudo-barramento", 1);
    rpg.equip("escudo-barramento");
  }
  return rpg;
}
const ground = { id: "escudo-test", continent: "cs", name: "Escudo", dungeon: true, loot: ["chip"] };
const monstro = { id: "escudo-bicho", name: "Bicho", kind: "golem", tier: 3 };

function golpe(rpg) {
  const c = rpg.combate;
  const ini = c.inimigos[0];
  ini.x = c.jogador.x + 20;
  ini.y = c.jogador.y;
  ini.proximoAtaque = 1e9;
  c.agora += 1000;
  ini.vento = false;
  c.jogador.defendendo = false;
  c.jogador.invulneravelAte = 0;
  const antes = rpg.hp();
  c.resolverGolpe(ini);
  return antes - rpg.hp();
}

{
  const rpg = novo({ escudo: true });
  assert.equal(rpg.equipmentBonus().shield > 0, true, "o escudo equipado não entrou na conta");
  assert.equal(rpg.startDuel(monstro, ground).ok, true);
  assert.equal(rpg.combate.jogador.escudo, true, "o combate não nasceu com o escudo");
  assert.equal(golpe(rpg), 0, "o escudo não segurou o primeiro golpe");
  assert.equal(rpg.combate.jogador.escudo, false, "o escudo não foi gasto");
  assert.ok(golpe(rpg) > 0, "o segundo golpe devia doer");
}
{
  const rpg = novo();
  assert.equal(rpg.startDuel(monstro, ground).ok, true);
  assert.equal(rpg.combate.jogador.escudo, false, "sem escudo não pode nascer protegido");
  assert.ok(golpe(rpg) > 0, "sem escudo o primeiro golpe já dói");
}
{
  // a carga volta no combate seguinte
  const rpg = novo({ escudo: true });
  rpg.startDuel(monstro, ground);
  golpe(rpg);
  rpg.flee();
  rpg.startDuel(monstro, ground);
  assert.equal(rpg.combate.jogador.escudo, true, "a carga do escudo não voltou");
}

const combat = fs.readFileSync(new URL("../src/gameplay/combate.js", import.meta.url), "utf8");
assert.match(combat, /j\.escudo/, "o combate não consulta o escudo");
assert.match(combat, /escudo = false/, "o escudo não é gasto");
console.log("ok escudo: o equipamento segura o primeiro golpe do combate e volta na próxima luta");

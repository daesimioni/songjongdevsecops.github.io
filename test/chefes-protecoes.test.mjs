// Proteções do chefe no combate de ação: escudo equipado e runa seguram o
// primeiro golpe, o espelho do chefe engole o primeiro ataque e a couraça
// também come 1 das runas. Roda sem navegador.
import assert from "node:assert/strict";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};
const { RPG } = await import("../src/gameplay/rpg.js");
const { GROUNDS } = await import("../src/content/rpg-data.js");
const { HABILIDADES } = await import("../src/gameplay/chefe-habilidades.js");
const ground = GROUNDS.find((g) => g.id === "cs");

function bossRpg({ escudo = false } = {}) {
  store.clear();
  const rpg = new RPG({ getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} });
  rpg.data.skills.cs = 50;
  if (escudo) rpg.data.enchants.escudo = true;
  for (const m of ground.monsters) rpg.data.monsters[m.id] = Date.now();
  assert.equal(rpg.pullLever(ground).ok, true);
  assert.equal(rpg.startDuel(ground.boss, ground, true).ok, true);
  return rpg;
}

const hab = (id) => HABILIDADES.find((h) => h.id === id);

// escudo do equipamento: segura o primeiro golpe e some
{
  const rpg = bossRpg({ escudo: true });
  const c = rpg.combate;
  const ini = c.inimigos[0];
  ini.x = c.jogador.x + 20;
  ini.y = c.jogador.y;
  ini.proximoAtaque = 1e9;
  c.agora = 1000;
  assert.equal(c.jogador.escudo, true, "o escudo do equipamento não entrou no combate");
  const antes = rpg.hp();
  c.resolverGolpe(ini);
  assert.equal(rpg.hp(), antes, "o escudo não segurou o primeiro golpe");
  assert.equal(c.jogador.escudo, false, "o escudo não foi gasto");
  c.agora += 1000;
  ini.vento = false;
  c.resolverGolpe(ini);
  assert.ok(rpg.hp() < antes, "sem escudo o segundo golpe devia doer");
}

// runa do espelho: arma a mesma proteção
{
  const rpg = bossRpg();
  const c = rpg.combate;
  rpg.data.spells["runa-espelho"] = true;
  rpg.data.mana = rpg.manaMax();
  const res = c.usarMagia("runa-espelho");
  assert.equal(res.ok, true, "a runa do espelho não saiu");
  assert.equal(c.jogador.escudo, true, "a runa não armou o escudo");
  const ini = c.inimigos[0];
  ini.x = c.jogador.x + 20;
  ini.y = c.jogador.y;
  ini.proximoAtaque = 1e9;
  const antes = rpg.hp();
  c.agora = 2000;
  c.resolverGolpe(ini);
  assert.equal(rpg.hp(), antes, "o escudo da runa não segurou o golpe");
}

// espelho do chefe: engole o primeiro golpe do jogador, o segundo cobra
{
  const rpg = bossRpg();
  const c = rpg.combate;
  const ini = c.inimigos[0];
  ini.phase = 2;
  rpg.duel.habilidade = hab("espelho");
  assert.equal(c.danoNoInimigo(ini, false), 0, "o espelho do chefe não engoliu o golpe");
  assert.equal(rpg.duel.espelhoUsado, true, "o espelho do chefe não foi consumido");
  assert.ok(c.danoNoInimigo(ini, false) > 0, "depois do espelho o golpe volta");
}

// couraça: o trovão também perde 1
{
  const rpg = bossRpg();
  const c = rpg.combate;
  const ini = c.inimigos[0];
  ini.phase = 2;
  rpg.duel.habilidade = hab("couraca");
  rpg.data.spells["runa-trovao"] = true;
  rpg.data.mana = rpg.manaMax();
  ini.x = c.jogador.x + 20;
  ini.y = c.jogador.y;
  const antes = ini.hp;
  assert.equal(c.usarMagia("runa-trovao").ok, true);
  const com = antes - ini.hp;
  ini.hp = antes;
  rpg.duel.habilidade = null;
  c.magias.clear();
  rpg.data.mana = rpg.manaMax();
  assert.equal(c.usarMagia("runa-trovao").ok, true);
  const sem = antes - ini.hp;
  assert.equal(sem - com, 1, `couraça no trovão: com ${com}, sem ${sem}`);
}

console.log("ok chefes: escudo do equipamento, runa do espelho, espelho do chefe e couraça no trovão");

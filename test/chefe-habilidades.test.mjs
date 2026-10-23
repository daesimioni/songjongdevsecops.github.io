import { readStyles } from "./styles.mjs";
// Habilidade própria de cada chefe: a fase 2 deixa de ser genérica. O mesmo
// chefe sempre revela a mesma habilidade, e cada uma muda uma conta diferente.
// Roda sem navegador: node test/chefe-habilidades.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import { HABILIDADES, habilidadeDoChefe, danoDoJogador, extraDoErro, curaDoChefe, espelhoDoChefe } from "../src/gameplay/chefe-habilidades.js";
import { DUNGEONS } from "../src/content/dungeon-data.js";

const problemas = [];
const check = (ok, msg) => { if (!ok) problemas.push(msg); };

// ---- regra pura ----
check(HABILIDADES.length === 4, `esperava quatro habilidades, veio ${HABILIDADES.length}`);
const ids = new Set(HABILIDADES.map((h) => h.id));
for (const id of ["couraca", "seiva", "impeto", "espelho"]) check(ids.has(id), `habilidade ${id} ausente`);
check(habilidadeDoChefe({ id: "dungeon-cs-boss" }).id === habilidadeDoChefe({ id: "dungeon-cs-boss" }).id, "habilidade do chefe não é estável");
check(!!habilidadeDoChefe({ name: "sem id" }), "chefe sem id também recebe habilidade");
const bossIds = DUNGEONS.filter((d) => d.boss).map((d) => `${d.id}-boss`);
check(bossIds.length >= 90, `esperava 90+ chefes, veio ${bossIds.length}`);
const usadas = new Set(bossIds.map((id) => habilidadeDoChefe({ id }).id));
check(usadas.size === 4, `as quatro habilidades devem aparecer nos chefes, vieram ${[...usadas].join(", ")}`);

check(danoDoJogador("couraca", 2, 3) === 2, "couraça deveria tirar 1");
check(danoDoJogador("couraca", 1, 3) === 3, "couraça não vale na fase 1");
check(danoDoJogador("couraca", 2, 1) === 1, "couraça não pode zerar o golpe");
check(extraDoErro("impeto", 2) === 2 && extraDoErro("impeto", 1) === 0, "ímpeto só na fase 2");
check(extraDoErro("couraca", 2) === 0, "só o ímpeto soma erro");
check(curaDoChefe("seiva", 2, 5, 10) === 7, "seiva deveria curar 2");
check(curaDoChefe("seiva", 2, 9, 10) === 10, "seiva não passa do máximo");
check(curaDoChefe("seiva", 1, 5, 10) === 5, "seiva não vale na fase 1");
check(espelhoDoChefe("espelho", 2, false) === true, "espelho deveria segurar o primeiro erro");
check(espelhoDoChefe("espelho", 2, true) === false, "espelho só segura uma vez");
check(espelhoDoChefe("espelho", 1, false) === false, "espelho não vale na fase 1");

// ---- integração com o combate de verdade ----
const store = new Map();
globalThis.localStorage = { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k), clear: () => store.clear() };
const { RPG } = await import("../src/gameplay/rpg.js");
const { GROUNDS } = await import("../src/content/rpg-data.js");
const ground = GROUNDS.find((g) => g.id === "cs");
const hab = (id) => HABILIDADES.find((h) => h.id === id);

function bossRpg() {
  store.clear();
  const rpg = new RPG({ getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} });
  rpg.data.skills.cs = 50; // nível 10: dano 3, para a couraça ter o que comer
  for (const m of ground.monsters) rpg.data.monsters[m.id] = Date.now();
  assert.equal(rpg.pullLever(ground).ok, true);
  assert.equal(rpg.startDuel(ground.boss, ground, true).ok, true);
  return rpg;
}

// o chefe abre com a habilidade estável do id dele e a fase 2 nasce do dano
{
  const rpg = bossRpg();
  const d = rpg.duel;
  check(d.habilidade?.id === habilidadeDoChefe(d.monster).id, "o combate não abriu com a habilidade do chefe");
  const ini = rpg.combate.inimigos[0];
  ini.hp = ini.hpMax * 0.5;
  rpg.combate.atualizarFase(ini);
  check(d.bossPhase === 2 && ini.phase === 2, "o chefe não entrou na fase 2");
}

// ímpeto: o golpe soma 2 na fase 2
{
  const rpg = bossRpg();
  const c = rpg.combate;
  const ini = c.inimigos[0];
  const d = rpg.duel;
  ini.phase = 2;
  c.agora = 1000;
  c.jogador.defendendo = false;
  c.jogador.invulneravelAte = 0;
  ini.x = c.jogador.x + 20;
  ini.y = c.jogador.y;
  d.habilidade = hab("impeto");
  const hp0 = rpg.hp();
  c.resolverGolpe(ini);
  const com = hp0 - rpg.hp();
  rpg.data.hp = rpg.hpMax();
  d.habilidade = null;
  ini.vento = false;
  c.agora += 1000;
  const hp1 = rpg.hp();
  c.resolverGolpe(ini);
  const sem = hp1 - rpg.hp();
  check(com - sem === 2, `ímpeto deveria somar 2: com ${com}, sem ${sem}`);
}

// couraça: o golpe rende 1 a menos na fase 2
{
  const rpg = bossRpg();
  const c = rpg.combate;
  const ini = c.inimigos[0];
  ini.phase = 2;
  rpg.duel.habilidade = hab("couraca");
  const antes = ini.hp;
  c.danoNoInimigo(ini, false);
  const com = antes - ini.hp;
  ini.hp = antes;
  rpg.duel.habilidade = null;
  c.danoNoInimigo(ini, false);
  const sem = antes - ini.hp;
  check(sem - com === 1, `couraça deveria comer 1: com ${com}, sem ${sem}`);
}

// seiva: a fase 2 devolve 2 de vida ao chefe
{
  const rpg = bossRpg();
  const c = rpg.combate;
  const ini = c.inimigos[0];
  ini.phase = 2;
  ini.hp = ini.hpMax - 10;
  ini.curaPronto = 0;
  ini.proximoAtaque = 1e9;
  rpg.duel.habilidade = hab("seiva");
  c.agora = 6000;
  const antes = ini.hp;
  c.atualizarInimigo(ini, 16);
  check(ini.hp === antes + 2, `seiva deveria curar 2: ${antes} -> ${ini.hp}`);
}

// espelho: o primeiro golpe da fase 2 é engolido, o segundo cobra
{
  const rpg = bossRpg();
  const c = rpg.combate;
  const ini = c.inimigos[0];
  ini.phase = 2;
  rpg.duel.habilidade = hab("espelho");
  rpg.duel.espelhoUsado = false;
  const antes = ini.hp;
  check(c.danoNoInimigo(ini, false) === 0, "o espelho deveria engolir o primeiro golpe");
  check(rpg.duel.espelhoUsado === true, "o espelho não foi consumido");
  check(c.danoNoInimigo(ini, false) > 0, "depois do espelho o golpe volta a cobrar");
  check(ini.hp < antes, "o segundo golpe não feriu");
}

// ---- integração na fonte ----
const rpgSrc = fs.readFileSync(new URL("../src/gameplay/rpg.js", import.meta.url), "utf8");
const combateSrc = fs.readFileSync(new URL("../src/gameplay/combate.js", import.meta.url), "utf8");
const duelSrc = fs.readFileSync(new URL("../src/ui/duel.js", import.meta.url), "utf8");
const css = readStyles();
check(/from "\.\/chefe-habilidades\.js"/.test(rpgSrc), "rpg não importa as habilidades");
check(/danoDoJogador\(/.test(combateSrc) && /extraDoErro\(/.test(combateSrc), "o combate não aplica couraça/ímpeto");
check(/curaDoChefe\(/.test(combateSrc) && /espelhoDoChefe\(/.test(combateSrc), "o combate não aplica seiva/espelho");
check(/duel-ability/.test(duelSrc) && /d\.habilidade\.nome/.test(duelSrc), "o combate não mostra a habilidade do chefe");
check(/\.duel-ability/.test(css), "css sem estilo da habilidade");

assert.equal(problemas.length, 0, `chefes com ${problemas.length} problema(s):\n- ${problemas.join("\n- ")}`);
console.log(`ok chefes: ${bossIds.length} chefes, 4 habilidades estáveis, couraça/ímpeto/seiva/espelho medidos no combate real`);

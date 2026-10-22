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

// ---- integração com o RPG de verdade ----
const store = new Map();
globalThis.localStorage = { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k), clear: () => store.clear() };
const { RPG } = await import("../src/gameplay/rpg.js");
const { GROUNDS } = await import("../src/content/rpg-data.js");
const ground = GROUNDS.find((g) => g.id === "cs");

function bossRpg() {
  store.clear();
  const rpg = new RPG({ getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} });
  rpg.data.skills.cs = 50; // nível 10: dano 3, para a couraça ter o que comer
  for (const m of ground.monsters) rpg.data.monsters[m.id] = Date.now();
  assert.equal(rpg.pullLever(ground).ok, true);
  assert.equal(rpg.startDuel(ground.boss, ground, true).ok, true);
  return rpg;
}
const errado = (d) => (d.question.answer + 1) % d.question.options.length;
const hab = (id) => HABILIDADES.find((h) => h.id === id);

// o chefe abre com a habilidade estável do id dele
{
  const rpg = bossRpg();
  const d = rpg.duel;
  check(d.habilidade?.id === habilidadeDoChefe(d.monster).id, "duelo não abriu com a habilidade do chefe");
  d.bossPhase = 1;
  d.monsterHp = Math.floor(d.monsterHpMax * 0.5);
  rpg.answer(d.question.answer);
  check(d.bossPhase === 2, "chefe não entrou na fase 2");
  check((d.feedback.phaseNote || "").includes(d.habilidade.nome), "aviso da fase não nomeia a habilidade");
}

// ímpeto: o erro previsto soma 2 na fase 2
{
  const rpg = bossRpg();
  const d = rpg.duel;
  d.bossPhase = 2;
  d.habilidade = hab("impeto");
  const com = rpg.erroPrevisto();
  d.habilidade = null;
  const sem = rpg.erroPrevisto();
  check(com - sem === 2, `ímpeto deveria somar 2, somou ${com - sem}`);
  check(rpg.erroPrevisto(d.monster, d.tier, 2) === sem, "outra fase não pode herdar o ímpeto");
}

// couraça: o acerto rende 1 a menos
{
  const comRpg = bossRpg();
  const com = comRpg.duel;
  com.bossPhase = 2;
  com.habilidade = hab("couraca");
  const antesCom = com.monsterHp;
  comRpg.answer(com.question.answer);
  const golpeCom = antesCom - com.monsterHp;
  const semRpg = bossRpg();
  const semDuelo = semRpg.duel;
  semDuelo.bossPhase = 2;
  semDuelo.habilidade = null;
  const antesSem = semDuelo.monsterHp;
  semRpg.answer(semDuelo.question.answer);
  const golpeSem = antesSem - semDuelo.monsterHp;
  check(golpeSem - golpeCom === 1, `couraça deveria comer 1: com ${golpeCom}, sem ${golpeSem}`);
  check((com.feedback.note || "").includes("couraça"), "feedback não avisa a couraça");
}

// seiva: cada erro devolve 2 de vida ao chefe
{
  const rpg = bossRpg();
  const d = rpg.duel;
  d.bossPhase = 2;
  d.habilidade = hab("seiva");
  d.monsterHp = d.monsterHpMax - 10;
  const antes = d.monsterHp;
  rpg.data.hp = rpg.hpMax();
  rpg.answer(errado(d));
  check(d.monsterHp === antes + 2, `seiva deveria curar 2: ${antes} -> ${d.monsterHp}`);
  check((d.feedback.note || "").includes("seiva"), "feedback não avisa a seiva");
}

// espelho: o primeiro erro da fase 2 é engolido, o segundo cobra
{
  const rpg = bossRpg();
  const d = rpg.duel;
  d.bossPhase = 2;
  d.habilidade = hab("espelho");
  d.espelhoUsado = false;
  rpg.data.hp = rpg.hpMax();
  const antes = rpg.hp();
  rpg.answer(errado(d));
  check(rpg.hp() === antes, "espelho deveria segurar o primeiro erro");
  check(d.espelhoUsado === true && d.feedback.blocked === true, "espelho não foi consumido");
  rpg.next();
  const antes2 = rpg.hp();
  rpg.answer(errado(d));
  check(rpg.hp() < antes2, "depois do espelho o erro volta a cobrar");
}

// ---- integração na fonte ----
const rpgSrc = fs.readFileSync(new URL("../src/gameplay/rpg.js", import.meta.url), "utf8");
const duelSrc = fs.readFileSync(new URL("../src/ui/duel.js", import.meta.url), "utf8");
const css = readStyles();
check(/from "\.\/chefe-habilidades\.js"/.test(rpgSrc), "rpg não importa as habilidades");
check(/danoDoJogador\(/.test(rpgSrc) && /extraDoErro\(/.test(rpgSrc), "rpg não aplica couraça/ímpeto");
check(/curaDoChefe\(/.test(rpgSrc) && /espelhoDoChefe\(/.test(rpgSrc), "rpg não aplica seiva/espelho");
check(/duel-ability/.test(duelSrc) && /d\.habilidade\.nome/.test(duelSrc), "duelo não mostra a habilidade");
check(/\.duel-ability/.test(css), "css sem estilo da habilidade");

assert.equal(problemas.length, 0, `chefes com ${problemas.length} problema(s):\n- ${problemas.join("\n- ")}`);
console.log(`ok chefes: ${bossIds.length} chefes, 4 habilidades estáveis, couraça/ímpeto/seiva/espelho medidos no RPG real`);

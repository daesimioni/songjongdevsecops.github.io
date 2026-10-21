// As barrinhas de vida e mana abaixo do nome do jogador: a conta é pura e o
// renderer tem que receber os vitais do jogo e desenhar as barras. Roda sem
// navegador: node test/vitais.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import { fracoesDeVida } from "../js/vitais.js";

const problemas = [];
const check = (ok, msg) => { if (!ok) problemas.push(msg); };

// ---- fração: presa entre 0 e 1, sem divisão por zero ----
const cheio = fracoesDeVida({ hp: 24, hpMax: 24, mana: 10, manaMax: 10 });
check(cheio.vida === 1 && cheio.mana === 1, `cheio devia ser 1/1: ${JSON.stringify(cheio)}`);
const meio = fracoesDeVida({ hp: 12, hpMax: 24, mana: 5, manaMax: 10 });
check(meio.vida === 0.5 && meio.mana === 0.5, `meio devia ser 0,5/0,5: ${JSON.stringify(meio)}`);
const vazio = fracoesDeVida({ hp: 0, hpMax: 24, mana: 0, manaMax: 10 });
check(vazio.vida === 0 && vazio.mana === 0, `vazio devia ser 0/0: ${JSON.stringify(vazio)}`);
const semMax = fracoesDeVida({ hp: 24, hpMax: 0, mana: 10, manaMax: 0 });
check(semMax.vida === 0 && semMax.mana === 0, `máximo zero devia dar 0: ${JSON.stringify(semMax)}`);
const negativo = fracoesDeVida({ hp: -5, hpMax: 24, mana: -1, manaMax: 10 });
check(negativo.vida === 0 && negativo.mana === 0, `negativo devia ser 0: ${JSON.stringify(negativo)}`);
const acima = fracoesDeVida({ hp: 99, hpMax: 24, mana: 99, manaMax: 10 });
check(acima.vida === 1 && acima.mana === 1, `acima do máximo devia ser 1: ${JSON.stringify(acima)}`);
const semArg = fracoesDeVida();
check(semArg.vida === 0 && semArg.mana === 0, "sem argumento devia dar 0/0");

// ---- o renderer usa a conta e o app entrega os vitais ----
const render = fs.readFileSync(new URL("../js/render.js", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../js/app.js", import.meta.url), "utf8");
check(/from "\.\/vitais\.js"/.test(render), "render.js não importa a conta dos vitais");
check(/function draw\(now, player, peers, npcs, cat, moving, rastreador = false, vitais = null\)/.test(render), "draw() sem o parâmetro de vitais");
check(/drawNameTag\(player\.name[^)]*vitais\)/.test(render), "o nome do jogador não recebe os vitais");
check(/fracoesDeVida\(vitais\)/.test(render), "as barras não usam a conta de fração");
check(/#ff5a86/.test(render) && /#6bd5ff/.test(render), "cores de vida e mana diferentes do HUD");
check(/hp: rpg\.hp\(\), hpMax: rpg\.hpMax\(\), mana: rpg\.mana\(\), manaMax: rpg\.manaMax\(\)/.test(app), "app.js não entrega os vitais ao renderer");
const dungeon = fs.readFileSync(new URL("../js/dungeon.js", import.meta.url), "utf8");
check(/from "\.\/vitais\.js"/.test(dungeon), "caverna não usa a conta dos vitais");
check(/fracoesDeVida\(vitais\(\)\)/.test(dungeon), "caverna não desenha as barras");
check(/vitais: \(\) => \(\{ hp: rpg\.hp\(\)/.test(app), "app.js não passa os vitais para a caverna");

assert.equal(problemas.length, 0, `vitais com ${problemas.length} problema(s):\n- ${problemas.join("\n- ")}`);
console.log("ok vitais: fração presa entre 0 e 1, renderer recebe vida e mana e desenha as barras com as cores do HUD");

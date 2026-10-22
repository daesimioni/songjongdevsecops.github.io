// As barrinhas de vida e mana acima do nome do jogador, com folga: a conta e o
// layout são puros e o renderer tem que receber os vitais e desenhar as barras
// antes do nome. Roda sem navegador: node test/vitais.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import { fracoesDeVida, layoutDaPlacaDoNome } from "../src/core/vitais.js";

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

// ---- o layout: barras ACIMA, nome abaixo, com folga ----
const placa = layoutDaPlacaDoNome(100);
check(placa.topoBarras < placa.topoNome, `as barras ficaram abaixo do nome: ${JSON.stringify(placa)}`);
check(placa.topoBarras + placa.alturaBarras === placa.topoNome - placa.vao, "a folga das barras não é a mesma dos dois lados");
check(placa.topoVida >= placa.topoBarras + 2, "a barra de vida colou na borda");
check(placa.topoVida + placa.alto + 2 <= placa.topoMana, "a barra de vida colou na de mana");
check(placa.topoMana + placa.alto <= placa.topoBarras + placa.alturaBarras - 2, "a barra de mana colou na borda");
check(placa.topoNome === 89 && placa.alturaNome === 9, `a placa do nome mudou de lugar: ${JSON.stringify(placa)}`);

// ---- o renderer usa a conta e o app entrega os vitais ----
const render = fs.readFileSync(new URL("../src/rendering/render.js", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../src/app/app.js", import.meta.url), "utf8");
check(/from "\.\.\/core\/vitais\.js"/.test(render), "render.js não importa a conta dos vitais");
check(/function draw\(now, player, peers, npcs, cat, moving, rastreador = false, vitais = null/.test(render), "draw() sem o parâmetro de vitais");
check(/drawNameTag\(player\.name[^)]*vitais\)/.test(render), "o nome do jogador não recebe os vitais");
check(/player\.y \* TILE - 25 - lift/.test(render), "a placa do nome não está perto da cabeça");
check(/fracoesDeVida\(vitais\)/.test(render), "as barras não usam a conta de fração");
check(/layoutDaPlacaDoNome\(py\)/.test(render), "o renderer não usa o layout da placa");
check(/placa\.topoVida[\s\S]*placa\.topoMana[\s\S]*placa\.topoNome/.test(render), "as barras não são desenhadas antes do nome");
check(/#ff5a86/.test(render) && /#6bd5ff/.test(render), "cores de vida e mana diferentes do HUD");
check(/hp: rpg\.hp\(\), hpMax: rpg\.hpMax\(\), mana: rpg\.mana\(\), manaMax: rpg\.manaMax\(\)/.test(app), "app.js não entrega os vitais ao renderer");
const dungeon = fs.readFileSync(new URL("../src/app/dungeon.js", import.meta.url), "utf8");
check(/from "\.\.\/core\/vitais\.js"/.test(dungeon), "caverna não usa a conta dos vitais");
check(/fracoesDeVida\(vitais\(\)\)/.test(dungeon), "caverna não desenha as barras");
check(/vitais: \(\) => \(\{ hp: rpg\.hp\(\)/.test(app), "app.js não passa os vitais para a caverna");
check(/alto \* 2 \+ vao \+ 2/.test(dungeon) && /const larg = 30, alto = 2, vao = 3/.test(dungeon), "a caverna não deu folga entre as barras");

assert.equal(problemas.length, 0, `vitais com ${problemas.length} problema(s):\n- ${problemas.join("\n- ")}`);
console.log("ok vitais: fração presa entre 0 e 1, renderer recebe vida e mana e desenha as barras com as cores do HUD");

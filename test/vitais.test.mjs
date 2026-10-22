// A placa do jogador: fração presa, barras acima do nome, folga igual dos dois
// lados, largura fixa e a mesma placa no vale e na caverna, por cima de tudo.
// Roda sem navegador: node test/vitais.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import { fracoesDeVida } from "../src/core/vitais.js";
import { PLACA, geometriaDaPlaca } from "../src/rendering/name-plate.js";

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

// ---- o layout: barras ACIMA, nome abaixo, folgas iguais e largura fixa ----
const g = geometriaDaPlaca(100);
check(g.barrasTopo < g.nomeTopo, `as barras ficaram abaixo do nome: ${JSON.stringify(g)}`);
check(100 - (g.nomeTopo + PLACA.alturaNome) === PLACA.gapCabeca, "o nome colou na cabeça");
check(g.nomeTopo - (g.barrasTopo + g.alturaBarras) === PLACA.vao, "as barras colaram no nome");
check(PLACA.gapCabeca === PLACA.vao, "a folga do nome para a cabeça é diferente da folga das barras");
check(PLACA.vaoBarras >= 4, "as duas barras estão coladas");
check(PLACA.larguraBarras === 52, `a barra não está na metade do nome máximo: ${PLACA.larguraBarras}`);
check(PLACA.alturaNome >= 14 && PLACA.barra >= 3, "a placa ficou pequena demais para ler");

// ---- a placa é de tela, desenhada por último, igual no vale e na caverna ----
const render = fs.readFileSync(new URL("../src/rendering/render.js", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../src/app/app.js", import.meta.url), "utf8");
const dungeon = fs.readFileSync(new URL("../src/app/dungeon.js", import.meta.url), "utf8");
const placa = fs.readFileSync(new URL("../src/rendering/name-plate.js", import.meta.url), "utf8");
check(/from "\.\/name-plate\.js"/.test(render), "o vale não usa a placa compartilhada");
check(/desenharPlacaDoJogador\(ctx, \{/.test(render), "o vale não desenha a placa do jogador");
check(render.indexOf("drawMinimap(player") < render.indexOf("desenharPlacaDoJogador(ctx"), "a placa não fica depois do mundo e da noite");
check(!/drawNameTag\(player\.name[^)]*vitais\)/.test(render), "o nome do jogador ainda é desenhado no meio do mundo");
check(/setTransform\(1, 0, 0, 1, 0, 0\)/.test(placa), "a placa não é desenhada em pixels de tela");
check(/nome: player\.name,\n\s+cor: player\.color/.test(render), "a placa do vale não recebe nome e cor");
check(/placa: \(\) => \(\{ nome: player\.name, cor: player\.color \}\)/.test(app), "app.js não entrega a placa para a caverna");
check(/from "\.\.\/rendering\/name-plate\.js"/.test(dungeon), "a caverna não usa a placa compartilhada");
check(/desenharPlacaDoJogador\(ctx, \{[\s\S]*nome: dados\?\.nome/.test(dungeon), "a caverna não desenha nome e barras");
check(/hp: rpg\.hp\(\), hpMax: rpg\.hpMax\(\), mana: rpg\.mana\(\), manaMax: rpg\.manaMax\(\)/.test(app), "app.js não entrega os vitais ao renderer");
check(/vitais: \(\) => \(\{ hp: rpg\.hp\(\)/.test(app), "app.js não passa os vitais para a caverna");
check(/#ff5a86/.test(placa) && /#6bd5ff/.test(placa), "cores de vida e mana diferentes do HUD");
check(/Math\.round\(bw \* f\.vida\)/.test(placa), "a barra não usa a fração da vida");

assert.equal(problemas.length, 0, `vitais com ${problemas.length} problema(s):\n- ${problemas.join("\n- ")}`);
console.log("ok vitais: fração presa entre 0 e 1, renderer recebe vida e mana e desenha as barras com as cores do HUD");

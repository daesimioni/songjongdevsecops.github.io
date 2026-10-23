import { readStyles } from "./styles.mjs";
// A arte da entrada depois da limpeza: sem pentagrama, sem sinais soltos, duas
// figuras de cada lado, faixa de texto no pé e vinheta no centro. Roda sem
// navegador: node test/entrada.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";

const problemas = [];
const check = (ok, msg) => { if (!ok) problemas.push(msg); };
const title = fs.readFileSync(new URL("../src/ui/title.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = readStyles();

// ---- cena clara: um pentagrama e sinais soltos saíram ----
check(!/pentagrama/i.test(title), "title.js ainda fala do pentagrama");
check(!/estrela de cinco pontas/.test(title), "title.js ainda traça a estrela de cinco pontas");
check(!/em duas órbitas/.test(title), "title.js ainda tem sinais em órbita");
check(/const vinheta = ctx\.createRadialGradient/.test(title), "sem vinheta no centro");
check(!/figura encapuzada/.test(title) && !/function seita/.test(title), "figuras ainda estão na cena confusa");
check(/duas velas na frente do círculo/.test(title), "velas da frente sumiram");
check(/ctx\.fillRect\(cx - 11, cy - 9, 3, 4\)/.test(title), "livro sem apoios no pedestal");

// ---- livro: capa, páginas com contorno e espinha ----
check(/ctx\.moveTo\(cx - 34, cy - 19\)/.test(title), "capa do livro mudou de forma");
check(/ctx\.moveTo\(cx - 31, cy - 20\)/.test(title) && /ctx\.moveTo\(cx \+ 31, cy - 20\)/.test(title), "faltou uma das páginas");
check(/espinha escura entre as páginas/.test(title), "livro sem espinha");

// ---- texto fora da arte ----
const tags = (html.match(/class="splash-tag"/g) || []).length;
check(tags === 1, `splash com ${tags} faixas de texto, esperado 1`);
check(/Cada pedra acende uma ideia, e a ideia continua funcionando quando você sai\./.test(html), "faixa com texto antigo");
check(/margin: auto auto 12px/.test(css), "faixa não está presa no pé");
check(/background: rgba\(6, 8, 18, 0\.66\)/.test(css), "faixa sem fundo legível");
check(/\.splash-kicker \{[^}]*font-size: 12px/.test(css), "kicker abaixo do piso de leitura de 12 px");

assert.equal(problemas.length, 0, `entrada com ${problemas.length} problema(s):\n- ${problemas.join("\n- ")}`);
console.log("ok entrada: sem pentagrama, sem sinais soltos, sem figuras, livro com capa e apoios, faixa de texto no pé e vinheta");

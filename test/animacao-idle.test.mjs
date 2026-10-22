// Guarda a animação parada: NPC olha em volta/cabeceia e o gato pisca e mexe a
// cauda. O teste de pixel de verdade roda no navegador (`cdp-anim-idle.mjs`);
// aqui fica a trava de fonte para ninguém apagar a animação sem perceber.
// Roda sem navegador: node test/animacao-idle.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";

const human = fs.readFileSync(new URL("../src/rendering/human.js", import.meta.url), "utf8");
const pet = fs.readFileSync(new URL("../src/rendering/pet-art.js", import.meta.url), "utf8");

const problemas = [];
const check = (ok, msg) => { if (!ok) problemas.push(msg); };

// humano: olhar e cabeceio só quando parado, com fase pelo posto
check(/const olhar = moving \? 0 : Math\.round\(Math\.sin\(time \* 0\.0011 \+ px \* 0\.07 \+ py \* 0\.05\)\)/.test(human), "cabeça não olha em volta");
check(/const cabeceio = !moving && Math\.sin\(time \* 0\.0017 \+ px \* 0\.03 \+ py \* 0\.05\) > 0\.9 \? -1 : 0/.test(human), "cabeça não cabeceia");
check(/ctx\.translate\(ladoDiag \+ olhar, cabeceio\)/.test(human), "olhar/cabeceio não chega ao desenho da cabeça");
check(/const step = moving \? Math\.sin\(time \* 0\.016\) : 0/.test(human), "passo do NPC sumiu");

// gato: pisca e cauda com fase própria
check(/const blink = !moving && Math\.floor\(t \/ 2400\) % 8 === 0/.test(pet), "gato não pisca");
check(/const cauda = Math\.sin\(t \* 0\.006\) \* 1\.6/.test(pet), "cauda do gato parada");
check(/blink \? colors\.body : colors\.eye/.test(pet), "piscada não fecha o olho");

assert.equal(problemas.length, 0, `animação parada com ${problemas.length} problema(s):\n- ${problemas.join("\n- ")}`);
console.log("ok animação parada: NPC olha e cabeceia, gato pisca e mexe a cauda; passo do NPC intacto");

// Resultado do duelo sem depender de cor: ✓ na certa, ✗ na errada escolhida, e
// as letras A-E continuam visíveis no toque. Roda sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";
import { marcaDaOpcao } from "../src/ui/duel-marcas.js";

// ---- a marca certa em cada caso ----
assert.equal(marcaDaOpcao("question", 2, 2, 4), "", "pergunta não pode mostrar resultado");
assert.equal(marcaDaOpcao("feedback", 2, 2, 4), "✓", "a alternativa certa precisa de ✓");
assert.equal(marcaDaOpcao("feedback", 4, 2, 4), "✗", "a errada escolhida precisa de ✗");
assert.equal(marcaDaOpcao("feedback", 1, 2, 4), "", "alternativa não escolhida e errada não ganha marca");
assert.equal(marcaDaOpcao("feedback", 2, 2, 2), "✓", "acerto não pode virar ✗");
assert.equal(marcaDaOpcao("victory", 0, 0, 0), "", "fim de duelo não precisa de marca");
assert.equal(marcaDaOpcao("feedback", 0, undefined, 0), "", "sem resposta não inventa marca");

// ---- a tela usa a marca e não esconde as letras no toque ----
const duel = fs.readFileSync(new URL("../src/ui/duel.js", import.meta.url), "utf8");
const combat = fs.readFileSync(new URL("../css/combat.css", import.meta.url), "utf8");
const touch = fs.readFileSync(new URL("../css/touch.css", import.meta.url), "utf8");
assert.match(duel, /marcaDaOpcao\(d\.phase, i, q\.answer, lastPick\)/, "o duelo não usa a marca de resultado");
assert.match(duel, /duel-mark \$\{marca === "✓" \? "right" : "wrong"\}/, "a marca não troca de estilo");
assert.match(duel, /aria-hidden", "true"/, "a marca precisa ser escondida do leitor de tela (o texto já diz)");
assert.match(combat, /\.duel-mark\.right/, "falta o estilo da marca certa");
assert.match(combat, /\.duel-mark\.wrong/, "falta o estilo da marca errada");
const linhaToque = touch.split("\n").find((l) => l.includes(".duel-option kbd")) || "";
assert.ok(linhaToque && !/display:\s*none/.test(linhaToque), "no toque a letra da alternativa não pode sumir");
const linhaPvp = touch.split("\n").find((l) => l.includes(".pvp-option kbd")) || "";
assert.match(linhaPvp, /display:\s*none/, "a letra do PvP pode continuar escondida no toque");

console.log("ok acessível: ✓ e ✗ no resultado do duelo e letras A-E visíveis no toque");

// Combate acessível: a arena tem rótulo, as barras têm número, as teclas J/K/L
// estão escritas e o resultado sai em aria-live. Roda sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";

const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const duel = fs.readFileSync(new URL("../src/ui/duel.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../css/combat.css", import.meta.url), "utf8");

function check(cond, msg) { assert.ok(cond, msg); }
check(/id="duel-arena"[^>]*role="img"/.test(html) || /role="img"[^>]*id="duel-arena"/.test(html), "a arena não tem papel de imagem");
check(/id="duel-arena"[^>]*aria-label="[^"]+"/.test(html) || /aria-label="[^"]+"[^>]*id="duel-arena"/.test(html), "a arena não tem descrição");
check(/id="duel-arena"[^>]*tabindex="0"/.test(html), "a arena não recebe foco de teclado");
for (const id of ["duel-hp-bar", "duel-mana-bar"]) {
  check(new RegExp(`id="${id}"[^>]*role="progressbar"`).test(html), `${id} não é barra de progresso`);
  check(new RegExp(`id="${id}"[^>]*aria-valuenow`).test(html), `${id} não anuncia o valor`);
}
for (const [id, tecla] of [["duel-attack", "J"], ["duel-guard", "K"], ["duel-dodge", "L"]]) {
  const bloco = html.match(new RegExp(`<button[^>]*id="${id}"[\\s\\S]*?</button>`))?.[0] || "";
  check(bloco.includes(`<kbd>${tecla}</kbd>`), `o botão ${id} não mostra a tecla ${tecla}`);
}
check(/aria-valuenow/.test(duel), "a tela não atualiza o valor acessível das barras");
check(/aria-valuemax/.test(duel), "a tela não atualiza o máximo acessível das barras");
check(/aria-live="polite"/.test(html), "o combate não tem aviso ao leitor de tela");
check(/duel-enemy-hp/.test(duel) && /\.duel-enemy-hp/.test(css), "a vida do bicho não tem número visível");
check(/\.duel-btn \{[^}]*min-height: 34px/.test(css), "os botões do combate ficaram pequenos demais");
check(/touch-action: none/.test(css), "a arena não bloqueia o gesto de rolagem");
check(/teste|combate/i.test(duel), "a tela do combate sumiu");
console.log("ok combate acessível: arena rotulada, barras com número, J/K/L escritos e resultado anunciado");

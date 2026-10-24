// A casca do combate: arena, botões J/K/L, runas, resultado e vitória ligada
// ao app. Roda sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";

const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const duel = fs.readFileSync(new URL("../src/ui/duel.js", import.meta.url), "utf8");
const combate = fs.readFileSync(new URL("../src/gameplay/combate.js", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../src/app/app.js", import.meta.url), "utf8");

for (const id of ["duel-arena", "duel-attack", "duel-guard", "duel-dodge", "duel-skills", "duel-enemies", "duel-body", "duel-flee"]) {
  assert.match(html, new RegExp(`id="${id}"`), `#${id} sumiu do HTML`);
}
for (const id of ["duel-attack", "duel-guard", "duel-dodge"]) {
  assert.match(html, new RegExp(`id="${id}"[\\s\\S]*?<kbd>[JKL]</kbd>`), `#${id} sem a tecla`);
}
assert.ok(duel.includes("atacar()"), "a tela não chama o ataque");
assert.ok(duel.includes("defender(true)"), "a tela não chama a defesa");
assert.ok(duel.includes("esquivar()"), "a tela não chama a esquiva");
assert.ok(duel.includes("usarMagia(id)"), "a tela não usa runas");
assert.ok(duel.includes("requestAnimationFrame"), "a tela não tem laço de combate");
assert.ok(duel.includes("mostrarFim()"), "a tela não mostra o resultado");
assert.ok(duel.includes("onVictory?.(d?.result)"), "a tela não avisa a vitória");
assert.ok(duel.includes("rpg.next()"), "a tela não fecha o resultado");
assert.ok(combate.includes("class Combate"), "o motor do combate sumiu");
assert.ok(combate.includes("vitoria()"), "o motor não fecha a vitória");
assert.ok(combate.includes("derrota()"), "o motor não fecha a derrota");
assert.ok(app.includes("combatHud.action(k)"), "o app não manda as teclas para o combate no mundo");
assert.ok(!app.includes('openModal("duel")'), "o app ainda abre uma arena separada");
assert.ok(app.includes("getAvatar: () => ({ colors: player.colors"), "o combate não recebe o boneco do jogador");
console.log("ok interface do combate: arena, J/K/L, runas, resultado e a vitória ligada ao app");

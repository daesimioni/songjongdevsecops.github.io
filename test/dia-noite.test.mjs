// Ciclo dia/noite preso ao calendário: o véu acompanha a hora do jogo e não
// mexe em colisão, lógica ou HUD. Roda sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";
import { CICLO_MS, faseDoDia, eNoite, forcarHora, horaForcadaAtual } from "../src/rendering/dia-noite.js";
import { EPOCA_MS } from "../src/core/calendario.js";

assert.equal(CICLO_MS, 24 * 60 * 1000, "um dia do jogo tem 24 minutos reais");

// ---- a curva, com hora forçada ----
forcarHora(0);
const meiaNoite = faseDoDia(0);
assert.equal(meiaNoite.p, 0, "meia-noite precisa ser o começo do dia");
assert.equal(meiaNoite.luz, 0, "meia-noite não pode ter luz");
assert.equal(meiaNoite.noite, 1, "meia-noite precisa ser noite cheia");
assert.equal(meiaNoite.alpha, 0.42, "o véu máximo mudou sem querer");
assert.match(meiaNoite.cor, /^rgba\(8, 12, 34, 0\.42\)$/, "cor do véu errada");

forcarHora(0.5);
const meioDia = faseDoDia(0);
assert.equal(meioDia.luz, 1, "meio-dia precisa de luz cheia");
assert.equal(meioDia.alpha, 0, "meio-dia não pode ter véu");
assert.equal(eNoite(), false, "meio-dia não é noite");

forcarHora(0.3);
assert.equal(eNoite(), false, "7h já é dia");
forcarHora(0.8);
assert.equal(eNoite(), true, "19h já é noite");

// ---- hora negativa, inválida e o relógio de verdade ----
forcarHora(-0.25);
assert.equal(horaForcadaAtual(), 0.75, "hora negativa precisa dar a volta");
forcarHora(null);
assert.equal(horaForcadaAtual(), null, "forcarHora(null) precisa soltar o relógio");
for (const t of [undefined, null, NaN, "x"]) {
  const f = faseDoDia(t);
  assert.ok(Number.isFinite(f.p) && Number.isFinite(f.luz) && Number.isFinite(f.alpha), `entrada ${t} quebrou a conta`);
  assert.ok(f.alpha >= 0 && f.alpha <= 0.42, `alpha fora da faixa em ${t}`);
}
// 24 minutos reais depois a fase repete: é o mesmo instante do dia seguinte
const base = EPOCA_MS + 1_234_567;
assert.equal(faseDoDia(base).alpha, faseDoDia(base + CICLO_MS).alpha, "a fase não repete depois de um dia");
assert.ok(Math.abs(faseDoDia(base).p - faseDoDia(base + CICLO_MS).p) < 1e-9, "a posição no dia não repete");

// ---- o render e o aviso usam ----
const render = fs.readFileSync(new URL("../src/rendering/render.js", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../src/app/app.js", import.meta.url), "utf8");
assert.match(render, /faseDoDia\(\)/, "o render não lê a fase do dia no calendário");
assert.match(render, /ctx\.fillRect\(0, 0, ctx\.canvas\.width, ctx\.canvas\.height\)/, "o véu não cobre a tela");
assert.match(app, /eNoite\(\)/, "o app não acompanha a noite no calendário");
assert.match(app, /A noite caiu no vale/, "o aviso da noite sumiu");
assert.match(app, /O dia voltou ao vale/, "o aviso do dia sumiu");

console.log("ok dia/noite: 24 minutos por dia, véu de 0.42 na meia-noite, 0 no meio-dia e aviso de troca");

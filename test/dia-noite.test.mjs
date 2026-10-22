// Ciclo dia/noite: oito minutos por volta, véu escuro no mundo, sem mexer em
// colisão, lógica ou HUD. Roda sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";
import { CICLO_MS, faseDoDia, eNoite, forcarHora, horaForcadaAtual } from "../src/rendering/dia-noite.js";

// ---- a curva ----
const meiaNoite = faseDoDia(0);
assert.equal(meiaNoite.p, 0, "t=0 precisa ser meia-noite");
assert.equal(meiaNoite.luz, 0, "meia-noite não pode ter luz");
assert.equal(meiaNoite.noite, 1, "meia-noite precisa ser noite cheia");
assert.equal(meiaNoite.alpha, 0.42, "o véu máximo mudou sem querer");
assert.match(meiaNoite.cor, /^rgba\(8, 12, 34, 0\.42\)$/, "cor do véu errada");

const meioDia = faseDoDia(CICLO_MS / 2);
assert.equal(meioDia.luz, 1, "meio-dia precisa de luz cheia");
assert.equal(meioDia.alpha, 0, "meio-dia não pode ter véu");
assert.equal(eNoite(CICLO_MS / 2), false, "meio-dia não é noite");
assert.equal(eNoite(0), true, "meia-noite é noite");

// ---- periodicidade e entrada inválida ----
for (const t of [1234, 60000, CICLO_MS - 1, CICLO_MS * 3 + 777]) {
  const a = faseDoDia(t);
  const b = faseDoDia(t + CICLO_MS);
  assert.equal(a.alpha, b.alpha, `a fase não repete em ${t}`);
  assert.ok(Math.abs(a.luz - b.luz) < 1e-9, "a luz não repete no ciclo");
}
for (const t of [undefined, null, NaN, "x", -CICLO_MS / 2]) {
  const f = faseDoDia(t);
  assert.ok(Number.isFinite(f.p) && Number.isFinite(f.luz) && Number.isFinite(f.alpha), `entrada ${t} quebrou a conta`);
  assert.ok(f.alpha >= 0 && f.alpha <= 0.42, `alpha fora da faixa em ${t}`);
}

// ---- hora forçada para sonda ----
forcarHora(0.5);
assert.equal(faseDoDia(0).alpha, 0, "hora forçada no meio-dia devia zerar o véu");
assert.equal(faseDoDia(CICLO_MS * 7).alpha, 0, "hora forçada precisa vencer o relógio");
forcarHora(-0.25);
assert.equal(horaForcadaAtual(), 0.75, "hora negativa precisa dar a volta");
forcarHora(null);
assert.equal(horaForcadaAtual(), null, "forcarHora(null) precisa soltar o relógio");

// ---- o render e o aviso usam ----
const render = fs.readFileSync(new URL("../src/rendering/render.js", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../src/app/app.js", import.meta.url), "utf8");
assert.match(render, /faseDoDia\(time\)/, "o render não lê a fase do dia");
assert.match(render, /ctx\.fillRect\(0, 0, ctx\.canvas\.width, ctx\.canvas\.height\)/, "o véu não cobre a tela");
assert.match(app, /eNoite\(now\)/, "o app não acompanha a noite");
assert.match(app, /A noite caiu no vale/, "o aviso da noite sumiu");
assert.match(app, /O dia voltou ao vale/, "o aviso do dia sumiu");

console.log("ok dia/noite: 8 min por volta, véu de 0.42 na meia-noite, 0 no meio-dia e aviso de troca");

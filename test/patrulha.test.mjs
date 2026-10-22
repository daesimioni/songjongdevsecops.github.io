// Patrulha: rota fixa em volta do posto, determinística pelo id da caverna e
// da sala, e perseguição pelo som. Sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";
import { rotaDePatrulha, pontoDaRota } from "../src/world/patrulha.js";

// ---- a rota nasce no disco do passeio ----
const raio = 0.6;
const rota = rotaDePatrulha({ x: 10, y: 20, seed: "cs-1:r1", raio });
assert.equal(rota.length, 4, "a patrulha tem quatro pontos");
for (const p of rota) {
  assert.ok(Number.isFinite(p.x) && Number.isFinite(p.y), "ponto da rota precisa de número");
  const d = Math.hypot(p.x - 10, p.y - 20);
  assert.ok(Math.abs(d - raio) < 0.02, `ponto fora do disco: ${d}`);
}
assert.deepEqual(rotaDePatrulha({ x: 10, y: 20, seed: "cs-1:r1", raio }), rota, "a mesma sala dá a mesma rota");

// seeds diferentes mudam a orientação, sem sorteio no meio
const orientacoes = new Set();
for (let i = 0; i < 12; i++) orientacoes.add(JSON.stringify(rotaDePatrulha({ x: 0, y: 0, seed: `area-${i}:sala`, raio })));
assert.ok(orientacoes.size >= 2, "o seed precisa escolher a orientação");

// ---- a viagem segue a ordem da rota e dá a volta ----
assert.deepEqual(pontoDaRota({ rota, indice: 0 }), rota[0]);
assert.deepEqual(pontoDaRota({ rota, indice: 4 }), rota[0], "o índice 4 volta ao primeiro ponto");
assert.deepEqual(pontoDaRota({ rota, indice: -1 }), rota[3], "índice negativo anda para trás");
assert.deepEqual(pontoDaRota({ rota, indice: 1.5 }), rota[0], "índice quebrado não pode estourar");
assert.equal(pontoDaRota({ rota: [], indice: 0 }), null);
assert.equal(pontoDaRota({}), null);

// ---- entrada inválida não cria rota ----
assert.deepEqual(rotaDePatrulha(), [], "sem posto não há rota");
assert.deepEqual(rotaDePatrulha({ x: NaN, y: 1, raio }), []);
assert.deepEqual(rotaDePatrulha({ x: 1, y: 2, raio: 0 }), []);
assert.deepEqual(rotaDePatrulha({ x: 1, y: 2, raio: "x" }), []);

// ---- a caverna usa a rota e a perseguição ----
const dungeon = fs.readFileSync(new URL("../src/app/dungeon.js", import.meta.url), "utf8");
assert.match(dungeon, /from "\.\.\/world\/patrulha\.js"/, "a caverna não importa a patrulha");
assert.match(dungeon, /criarRota\(m\);/, "o nascimento não cria a rota");
assert.match(dungeon, /m\.dorme = false;\n          criarRota\(m\);/, "acordar não cria a rota");
assert.match(dungeon, /mesa no caminho faria o bicho bater/, "a rota não valida o caminho até o ponto");
assert.match(dungeon, /function seguirRota\(m\) \{/, "a chegada não escolhe o próximo ponto");
assert.match(dungeon, /m\.rotaIdx = \(i \+ 1\) % \(m\.rota\.length \* 2\)/, "o índice da rota não anda");
assert.match(dungeon, /const ponto = i % 2 === 0 \? pontoDaRota\(\{ rota: m\.rota, indice: i \/ 2 \}\) : \{ x: m\.hx, y: m\.hy \}/, "a patrulha não volta ao posto");
assert.match(dungeon, /if \(!m\.rota \|\| !seguirRota\(m\)\) pickWander\(m\)/, "o bloqueio não tenta o próximo ponto");
assert.match(dungeon, /m\.atras = \{ x: state\.player\.x, y: state\.player\.y, until: t \+ 2600 \}/, "ouvir não inicia perseguição");
assert.match(dungeon, /if \(!comendo && m\.atras\) \{/, "a perseguição não é lida no movimento");
assert.match(dungeon, /if \(!comendo && ouveOPassoS\(/, "quem come a isca não pode ouvir");

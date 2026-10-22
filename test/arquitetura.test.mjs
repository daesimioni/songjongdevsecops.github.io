// Arquitetura: o mundo não depende do rendering para nascer. O tamanho das
// construções mora em content/asset-meta e a colocação de ambiente mora no
// mundo; o desenho só consome a mesma fonte.
import assert from "node:assert/strict";
import fs from "node:fs";
import { ASSET_SIZE, tamanhoDoAsset } from "../src/content/asset-meta.js";
import { CONSTRUCOES } from "../src/rendering/assets/construcoes.js";
import { sourcePaths } from "./source-paths.mjs";

const existe = (rel) => fs.existsSync(new URL(`../${rel}`, import.meta.url));

// ---- o mundo nasce sem importar rendering ----
const world = fs.readFileSync(new URL("../src/world/world.js", import.meta.url), "utf8");
const importsRendering = [...world.matchAll(/from\s+"([^"]*rendering[^"]*)"/g)].map((m) => m[1]);
assert.deepEqual(importsRendering, [], `world.js ainda importa rendering: ${importsRendering.join(", ")}`);
assert.match(world, /import \{ espalharAmbiente \} from "\.\/povoado\.js"/, "o mundo não importa a colocação local");
assert.match(world, /import \{ tamanhoDoAsset \} from "\.\.\/content\/asset-meta\.js"/, "o mundo não lê o tamanho em content");

// ---- a colocação de ambiente mudou de casa e não puxa desenho ----
assert.ok(existe("src/world/povoado.js"), "o povoado não está no mundo");
assert.equal(existe("src/rendering/assets/povoado.js"), false, "o povoado antigo ficou para trás");
const povoado = fs.readFileSync(new URL("../src/world/povoado.js", import.meta.url), "utf8");
assert.deepEqual([...povoado.matchAll(/from\s+"([^"]*rendering[^"]*)"/g)].map((m) => m[1]), [], "povoado importa rendering");
assert.match(povoado, /from "\.\.\/content\/asset-meta\.js"/, "povoado não usa a fonte de tamanho em content");
assert.match(povoado, /const defCasa = ASSET_SIZE\[tipoCasa\]/, "povoado não lê o tamanho em content");

// ---- uma fonte só para o tamanho ----
const esperado = {
  cabana: { w: 36, h: 30, escala: 2 },
  casa: { w: 44, h: 38, escala: 2 },
  torre: { w: 28, h: 52, escala: 2 },
  ruina: { w: 42, h: 28, escala: 1.5 },
  galpao: { w: 46, h: 32, escala: 2 },
  poco: { w: 22, h: 22, escala: 1.5 },
  cerca: { w: 20, h: 14, escala: 1.5 },
  doca: { w: 42, h: 20, escala: 1.5 },
};
assert.deepEqual(ASSET_SIZE, esperado, "os tamanhos mudaram sem querer");
for (const [tipo, def] of Object.entries(ASSET_SIZE)) {
  const escala = def.escala || 1;
  assert.deepEqual(tamanhoDoAsset(tipo), { w: def.w * escala, h: def.h * escala }, `tamanho de ${tipo} errado`);
  assert.equal(CONSTRUCOES[tipo].w, def.w, `${tipo}: desenho e mundo com largura diferente`);
  assert.equal(CONSTRUCOES[tipo].h, def.h, `${tipo}: desenho e mundo com altura diferente`);
  assert.equal(CONSTRUCOES[tipo].escala, def.escala, `${tipo}: desenho e mundo com escala diferente`);
}
assert.equal(tamanhoDoAsset("inexistente"), null, "tipo desconhecido precisa devolver null");

// ---- a construção não repete número solto ----
const construcoes = fs.readFileSync(new URL("../src/rendering/assets/construcoes.js", import.meta.url), "utf8");
assert.equal((construcoes.match(/\.\.\.ASSET_SIZE\./g) || []).length, Object.keys(ASSET_SIZE).length, "construção não deriva todos os tamanhos");
assert.ok(!/casa: \{ w: 44/.test(construcoes), "sobrou tamanho literal na construção");

// ---- o mapa de caminhos dos testes conhece a casa nova ----
assert.equal(sourcePaths["assets/povoado.js"], "src/world/povoado.js", "source-paths aponta para o lugar antigo");
assert.equal(sourcePaths["asset-meta.js"], "src/content/asset-meta.js", "source-paths sem a fonte nova");

console.log("ok arquitetura: mundo sem rendering, povoado no mundo e tamanho de construção numa fonte só");

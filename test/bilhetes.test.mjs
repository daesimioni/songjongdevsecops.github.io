// Bilhete na parede da cidade subterrânea: a relíquia da área vira leitura no
// mundo, com fallback para a linha do lugar. Sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";
import { bilheteDaCaverna } from "../src/world/bilhetes.js";
import { RELICS, ITEMS } from "../src/content/rpg-data.js";
import { DUNGEONS } from "../src/content/dungeon-data.js";

const areaDe = (def) => String(def.id).replace(/^dungeon-/, "");

// ---- toda caverna tem bilhete, curto e limpo ----
const vistos = new Set();
let comReliquia = 0;
let comLugar = 0;
for (const def of DUNGEONS) {
  const areaId = areaDe(def);
  const bilhete = bilheteDaCaverna({ areaId, nome: def.name, material: def.material, continente: def.continent });
  assert.ok(bilhete, `caverna sem bilhete: ${def.id}`);
  assert.ok(bilhete.titulo.length >= 6, `título curto em ${def.id}: ${bilhete.titulo}`);
  assert.ok(bilhete.texto.length >= 30, `texto curto em ${def.id}: ${bilhete.texto}`);
  assert.ok(bilhete.texto.length <= 261, `texto longo em ${def.id}: ${bilhete.texto.length}`);
  assert.ok(!/[<>]/.test(bilhete.texto + bilhete.titulo), `bilhete com HTML em ${def.id}`);
  assert.ok(!/\s{2,}/.test(bilhete.texto), `bilhete com espaço duplo em ${def.id}`);
  vistos.add(`${bilhete.titulo}|${bilhete.texto}`);
  if (RELICS[areaId]) comReliquia++;
  else comLugar++;
}
assert.equal(comReliquia + comLugar, DUNGEONS.length, "nem toda caverna caiu numa das fontes");
assert.ok(comReliquia >= 60, `poucas cavernas com relíquia: ${comReliquia}`);
assert.ok(vistos.size >= DUNGEONS.length * 0.9, `bilhetes repetidos demais: ${vistos.size}/${DUNGEONS.length}`);

// ---- a fonte é a relíquia quando existe ----
const areaReliquia = Object.keys(RELICS)[0];
const b1 = bilheteDaCaverna({ areaId: areaReliquia, nome: "x", material: "ferro" });
assert.ok(b1.titulo.includes(RELICS[areaReliquia].name), "título não nomeia a relíquia");
assert.ok(b1.texto.length > 20, "texto da relíquia curto demais");

// ---- a linha do lugar cobre quem não tem relíquia ----
const semReliquia = DUNGEONS.find((def) => !RELICS[areaDe(def)]);
if (semReliquia) {
  const b3 = bilheteDaCaverna({ areaId: areaDe(semReliquia), nome: semReliquia.name, material: semReliquia.material, continente: semReliquia.continent });
  assert.ok(b3.titulo.includes(semReliquia.name), "título do fallback sem o nome da caverna");
  assert.ok(b3.texto.includes(semReliquia.name), "texto do fallback sem o lugar");
}

// ---- a caverna usa o bilhete ----
const dungeon = fs.readFileSync(new URL("../src/app/dungeon.js", import.meta.url), "utf8");
const arte = fs.readFileSync(new URL("../src/rendering/dungeon-art.js", import.meta.url), "utf8");
assert.match(dungeon, /bilheteDaCaverna\(\{/, "a caverna não cria bilhete");
assert.match(dungeon, /props\.push\(\{ kind: "bilhete"/, "o bilhete não vira peça do mapa");
assert.match(dungeon, /if \(obj\.kind === "bilhete"\) \{[\s\S]*say\(`\$\{obj\.titulo\}: \$\{obj\.texto\}`/, "o bilhete não é lido no F");
assert.match(dungeon, /drawBilhete\(ctx, prop\.x \* TILE/, "o bilhete não é desenhado");
assert.match(arte, /function drawBilheteRaw/, "falta o desenho do bilhete");

console.log(`ok bilhetes: ${DUNGEONS.length} cavernas com nota (${comReliquia} da relíquia, ${comLugar} do lugar), texto curto e sem HTML`);

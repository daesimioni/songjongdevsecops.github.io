import assert from "node:assert/strict";
import { ASSET_META } from "../src/content/asset-meta.js";
import { ASSET_DETAILS } from "../src/rendering/assets/detail.js";
import { ICONES } from "../src/rendering/assets/icones.js";
import { CONCEPT_MATERIALS } from "../src/rendering/assets/concept-detail.js";
import { CREATURE_FORMS } from "../src/content/rpg-data.js";
import { CREATURE_MODELS } from "../src/rendering/creature-models.js";
import { FIXTURE_DETAILS } from "../src/rendering/fixture-detail.js";
const same = (a, b, label) =>
  assert.deepEqual(Object.keys(a).sort(), Object.keys(b).sort(), label);
same(ASSET_META, ASSET_DETAILS, "todo asset ambiental exige revisão explícita");
same(
  Object.fromEntries([...ICONES].map((k) => [k, true])),
  CONCEPT_MATERIALS,
  "todo adorno exige material",
);
for (const kind of CREATURE_FORMS)
  assert.ok(CREATURE_MODELS[kind], `${kind}: sem modelo direcional`);
assert.equal(
  Object.keys(FIXTURE_DETAILS).length,
  19,
  "catálogo de móveis precisa de revisão",
);
console.log(
  "ok cobertura: 41 peças ambientais, 36 adornos, todas as formas de criatura e 19 móveis",
);

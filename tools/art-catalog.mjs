import {TILE_KIND} from "../src/core/runtime-config.js";
import { writeFile } from "node:fs/promises";
import { GRUPOS } from "../src/rendering/assets/index.js";
import { ASSET_DETAILS } from "../src/rendering/assets/detail.js";
import { CONCEPT_MATERIALS } from "../src/rendering/assets/concept-detail.js";
import { CREATURE_MODELS } from "../src/rendering/creature-models.js";
import { PET_COLORS } from "../src/rendering/pet-art.js";
import { FIXTURE_DETAILS } from "../src/rendering/fixture-detail.js";
import { ITEMS } from "../src/content/rpg-data.js";
import { familiaDe } from "../src/rendering/item-art.js";
import { HAIRS, GENDERS } from "../src/content/avatar.js";
import { OUTFITS } from "../src/content/outfits.js";
import { ELEMENTOS } from "../src/rendering/ambient.js";
import { TILE_STYLE } from "../src/content/identity.js";
const report = {
  directions: [
    "sul",
    "oeste",
    "leste",
    "norte",
    "sudoeste",
    "sudeste",
    "noroeste",
    "nordeste",
  ],
  environment: Object.fromEntries(
    Object.entries(GRUPOS).map(([group, defs]) => [
      group,
      Object.fromEntries(
        Object.entries(defs).map(([id, d]) => [
          id,
          {
            detail: ASSET_DETAILS[id],
            width: d.w,
            height: d.h,
            scale: d.escala || 1,
            variants: d.variantes || 1,
            frames: d.quadros || 1,
            frameMs: d.ms || null,
          },
        ]),
      ),
    ]),
  ),
  creatures: CREATURE_MODELS,
  pets: Object.keys(PET_COLORS),
  humans: {
    outfits: OUTFITS.map((o) => o.id),
    hairstyles: HAIRS.map((h) => h.id),
    genders: GENDERS.map((g) => g.id),
    states: ["parado", "caminhando", "gestos de ofício", "equipado"],
    equipmentFamilies:Object.fromEntries(["helmet","armor","weapon","shield","cloak"].map(slot=>[slot,[...new Set(Object.values(ITEMS).filter(item=>item.slot===slot).map(familiaDe))]])),
  },
  items: Object.fromEntries(
    Object.entries(ITEMS).map(([id, item]) => [id, familiaDe(item)]),
  ),
  concepts: CONCEPT_MATERIALS,
  fixtures: FIXTURE_DETAILS,
  caveFamilies: ["ruina", "mina", "fenda", "toca", "morro"],
  baseTerrain:TILE_KIND,
  terrain: Object.fromEntries(
    Object.entries(TILE_STYLE).map(([id, s]) => [
      id,
      { pattern: s.pattern, color: s.color, accent: s.accent },
    ]),
  ),
  atmosphericElements: Object.keys(ELEMENTOS),
  worldLandmarks: [
    "totem/monolito",
    "totem/cairn",
    "totem/portico",
    "totem/obelisco",
    "totem/bracos",
    "totem/anel",
    "fonte",
    "radio",
    "farol",
    "estandarte",
    "soleira",
  ],
  presentation: ["src/ui/title.js", "assets/favicon.svg", "assets/og.png"],
};
await writeFile(
  new URL("../docs/art/catalogo.json", import.meta.url),
  JSON.stringify(report, null, 2) + "\n",
);
console.log(
  JSON.stringify({
    environment: Object.values(GRUPOS).reduce(
      (n, g) => n + Object.keys(g).length,
      0,
    ),
    creatures: Object.keys(CREATURE_MODELS).length,
    pets: Object.keys(PET_COLORS).length,
    items: Object.keys(ITEMS).length,
    concepts: Object.keys(CONCEPT_MATERIALS).length,
    fixtures: Object.keys(FIXTURE_DETAILS).length,
    terrain: Object.keys(TILE_STYLE).length,
    atmosphere: Object.keys(ELEMENTOS).length,
  }),
);

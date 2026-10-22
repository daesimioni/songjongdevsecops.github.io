import test from "node:test";
import assert from "node:assert/strict";
import { createCanvas } from "@napi-rs/canvas";
import {
  SPRITE_KIT,
  kitAsset,
  kitBounds,
  kitColliders,
  kitBody,
} from "../src/content/sprite-kit/catalog.js";
import {
  creatures,
  creatureAttack,
} from "../src/content/sprite-kit/creatures.js";
import {
  EFFECT_ELEMENTS,
  effectAreaContains,
} from "../src/content/sprite-kit/effects.js";
import { CREATURE_FORMS } from "../src/content/rpg-data.js";
import { DIRECTIONS, directionVector } from "../src/core/movement.js";
import { paintKit, kitFrame } from "../src/rendering/sprite-kit/index.js";
import { setArtMotion } from "../src/rendering/art-style.js";
test("every old monster and new creature has valid attack, telegraph and impact recipes", () => {
  for (const kind of [...CREATURE_FORMS, ...creatures.map((a) => a.slug)]) {
    const recipe = creatureAttack(kind);
    assert.ok(recipe, kind);
    for (const id of Object.values(recipe)) assert.ok(kitAsset(id), id);
  }
  assert.equal(creatureAttack("desconhecido"), null);
  for (const element of Object.keys(EFFECT_ELEMENTS))
    assert.equal(
      SPRITE_KIT.filter((a) => a.element === element && a.renderer === "effect")
        .length,
      12,
    );
});
test("creatures have eight genuine views, states and separate dynamic bodies", () => {
  const raster = (a, direction, state = "walk", frame = 1) => {
    const b = kitBounds(a.id, { direction, state });
    const c = createCanvas(b.w * 2, b.h * 2),
      g = c.getContext("2d");
    g.scale(2, 2);
    g.translate(-b.x, -b.y);
    paintKit(g, a.id, { direction, state, frame });
    return c.toBuffer("image/png");
  };
  for (const a of SPRITE_KIT.filter((a) => a.renderer === "creature")) {
    assert.equal(a.orientations.length, DIRECTIONS.length);
    assert.deepEqual(Object.keys(a.states), [
      "idle",
      "walk",
      "attack",
      "hit",
      "death",
    ]);
    assert.notDeepEqual(raster(a, 0), raster(a, 3), a.id + " front/back");
    assert.notDeepEqual(raster(a, 1), raster(a, 6), a.id + " left/diagonal");
    assert.notDeepEqual(
      raster(a, 0, "idle", 0),
      raster(a, 0, "death", 7),
      a.id + " death",
    );
    assert.equal(kitColliders(a.id).length, 0);
    assert.ok(kitBody(a.id, 3, 4).hw > 0);
    assert.equal(kitBody(a.id, 3, 4).x, 3);
  }
});
test("one-shot poses clamp, loops wrap and reduced motion freezes both", () => {
  const a = "kit/criaturas/dragao";
  assert.equal(kitFrame(a, 900, "attack"), 7);
  assert.equal(kitFrame(a, 900, "walk"), 1);
  assert.equal(kitFrame("kit/ataques/fogo-projetil", 9999), 7);
  try {
    setArtMotion(false);
    assert.equal(kitFrame(a, 9999, "death"), 0);
    assert.equal(kitFrame("kit/ataques/fogo-campo", 9999), 0);
  } finally {
    setArtMotion(true);
  }
});
test("area contracts cover cardinal and diagonal targeting with normalized ranges", () => {
  for (const direction of [0, 1, 2, 3, 4, 5, 6, 7]) {
    const f = directionVector(direction),
      beam = kitAsset("kit/ataques/energia-raio"),
      cone = kitAsset("kit/ataques/fogo-cone");
    assert.ok(effectAreaContains(beam, f.x * 40, f.y * 40, direction));
    assert.ok(!effectAreaContains(beam, f.x * 60, f.y * 60, direction));
    assert.ok(effectAreaContains(cone, f.x * 20, f.y * 20, direction));
    assert.ok(!effectAreaContains(cone, -f.x * 20, -f.y * 20, direction));
    assert.ok(!effectAreaContains(beam, -f.y * 20, f.x * 20, direction));
  }
  assert.ok(!effectAreaContains(kitAsset("kit/ataques/gelo-anel"), 0, 0));
  assert.ok(effectAreaContains(kitAsset("kit/ataques/gelo-anel"), 20, 0));
  assert.ok(effectAreaContains(kitAsset("kit/ataques/agua-campo"), 0, 20));
  assert.throws(() => kitBounds("kit/criaturas/cao", { direction: 8 }));
  assert.throws(() => kitBounds("kit/criaturas/cao", { state: "invalid" }));
});

test("each existing monster has an eight-view body and effect cast bundle", () => {
  for (const kind of CREATURE_FORMS) {
    const a = kitAsset("kit/conjuracoes/" + kind);
    assert.ok(a, kind);
    assert.equal(a.model, kind);
    assert.equal(a.orientations.length, 8);
    assert.equal(a.states.telegraph.loop, true);
    assert.ok(creatureAttack(a.id));
  }
});

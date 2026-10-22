import test from "node:test";
import assert from "node:assert/strict";
import { createCanvas } from "@napi-rs/canvas";
import {
  SPRITE_KIT,
  searchKit,
  kitBounds,
  kitParts,
  kitColliders,
} from "../src/content/sprite-kit/catalog.js";
import {
  KIT_BLUEPRINTS,
  placeBlueprint,
} from "../src/content/sprite-kit/blueprints.js";
import {
  paintKit,
  drawKit,
  kitCache,
} from "../src/rendering/sprite-kit/index.js";
import { assetColliders } from "../src/content/collision-bodies.js";
import {
  totalDeAssets,
  tiposDoGrupo,
  temAsset,
  desenharAsset,
  tamanhoDoAsset,
} from "../src/rendering/assets/index.js";
import { setArtMotion } from "../src/rendering/art-style.js";
test("catalog: unique IDs, accent-insensitive search, immutable content", () => {
  assert.ok(SPRITE_KIT.length >= 480);
  assert.equal(new Set(SPRITE_KIT.map((a) => a.id)).size, SPRITE_KIT.length);
  assert.ok(searchKit({ query: "arvore" }).length >= 7);
  assert.equal(searchKit({ category: "mobiliario" }).length, 20);
  assert.throws(() => {
    SPRITE_KIT[0].parts.push({});
  }, TypeError);
});
test("open doors clear center passage; orientations rotate collision and keep anchors", () => {
  const id = "kit/arquitetura/porta-madeira";
  for (const direction of [0, 1, 2, 3]) {
    const contains = (b) => Math.abs(b.x) < b.hw && Math.abs(b.y) < b.hh;
    const closed = kitColliders(id, 0, 0, { direction, state: "closed" }),
      open = kitColliders(id, 0, 0, { direction, state: "open" });
    // Passage center is two pixels behind the front anchor.
    const cx = direction === 1 ? -2 / 16 : direction === 2 ? 2 / 16 : 0,
      cy = direction === 0 ? -2 / 16 : direction === 3 ? 2 / 16 : 0;
    assert.ok(
      closed.map((b) => ({ ...b, x: b.x - cx, y: b.y - cy })).some(contains),
    );
    assert.ok(
      !open.map((b) => ({ ...b, x: b.x - cx, y: b.y - cy })).some(contains),
    );
    assert.deepEqual(
      assetColliders(id, 0, 0, 0, { direction, state: "open" }),
      open,
    );
  }
  assert.throws(() => kitParts(id, "broken"));
  assert.throws(() => kitBounds(id, { direction: 7 }));
});
test("every frame, state and orientation renders inside declared bounds", () => {
  let renders = 0;
  for (const a of SPRITE_KIT)
    for (const state of Object.keys(a.states || { default: [] }))
      for (const direction of a.orientations) {
        const options = { state: a.states ? state : undefined, direction },
          b = kitBounds(a.id, options);
        const canvas = createCanvas((b.w + 8) * 2, (b.h + 8) * 2),
          g = canvas.getContext("2d");
        const hasAlpha = (data) => {
          for (let i = 3; i < data.length; i += 4) if (data[i]) return true;
          return false;
        };
        for (let frame = 0; frame < a.frames; frame++) {
          g.clearRect(0, 0, canvas.width, canvas.height);
          g.save();
          g.scale(2, 2);
          g.translate(4 - b.x, 4 - b.y);
          paintKit(g, a.id, { ...options, frame });
          g.restore();
          assert.ok(
            hasAlpha(g.getImageData(8, 8, b.w * 2, b.h * 2).data),
            a.id,
          );
          for (const [x, y, w, h] of [
            [0, 0, canvas.width, 8],
            [0, canvas.height - 8, canvas.width, 8],
            [0, 8, 8, b.h * 2],
            [canvas.width - 8, 8, 8, b.h * 2],
          ])
            assert.ok(
              !hasAlpha(g.getImageData(x, y, w, h).data),
              `${a.id} clips ${direction}/${state}/${frame}`,
            );
          renders++;
        }
        for (const p of kitColliders(a.id, 0, 0, options))
          assert.ok(
            Number.isFinite(p.x) &&
              Number.isFinite(p.y) &&
              p.hw > 0 &&
              p.hh > 0,
          );
      }
  console.log(`${renders} modular sprite renders verified`);
});

test("blueprints have valid IDs, no overlapping solid parts between instances, and translated placement", () => {
  for (const name of Object.keys(KIT_BLUEPRINTS)) {
    const placements = placeBlueprint(name, { x: 10, y: 20 });
    assert.equal(placements[0].x, KIT_BLUEPRINTS[name][0].x + 10);
    for (let i = 0; i < placements.length; i++)
      for (let j = i + 1; j < placements.length; j++)
        for (const a of placements[i].colliders)
          for (const b of placements[j].colliders)
            assert.ok(
              !(
                Math.abs(a.x - b.x) < a.hw + b.hw &&
                Math.abs(a.y - b.y) < a.hh + b.hh
              ),
              name,
            );
  }
});
test("lazy frame cache is bounded and honors reduced motion", () => {
  const prior = globalThis.document;
  globalThis.document = { createElement: () => createCanvas(1, 1) };
  try {
    kitCache().limpar();
    const c = createCanvas(100, 100),
      g = c.getContext("2d");
    setArtMotion(false);
    const id = "kit/terrenos/agua";
    drawKit(g, id, 30, 30, { tempo: 0 });
    drawKit(g, id, 30, 30, { tempo: 999 });
    assert.equal(kitCache().stats.tamanho, 1);
    assert.ok(kitCache().stats.acertos >= 1);
    for (const a of SPRITE_KIT)
      for (const direction of a.orientations)
        drawKit(g, a.id, 30, 30, { direction });
    assert.ok(kitCache().stats.bytes <= 12 * 1024 * 1024);
    assert.ok(kitCache().stats.tamanho <= 512);
  } finally {
    globalThis.document = prior;
    setArtMotion(true);
  }
});

test("legacy entry points include the kit explicitly without changing old counts", () => {
  assert.equal(totalDeAssets(), 41);
  assert.equal(totalDeAssets({ incluirKit: true }), 556);
  assert.equal(tiposDoGrupo("mobiliario").length, 20);
  assert.equal(temAsset("kit/oficios/bigorna"), true);
  assert.equal(tamanhoDoAsset("kit/terrenos/grama").w, 16);
  const prior = globalThis.document;
  globalThis.document = { createElement: () => createCanvas(1, 1) };
  try {
    assert.equal(
      desenharAsset(
        createCanvas(100, 100).getContext("2d"),
        "kit/oficios/bigorna",
        50,
        50,
      ),
      true,
    );
  } finally {
    globalThis.document = prior;
  }
});
test("environment animations have distinct pixels across frames", () => {
  for (const a of SPRITE_KIT.filter((a) => a.frames > 1)) {
    const b = kitBounds(a.id);
    const render = (frame) => {
      const c = createCanvas(b.w * 2, b.h * 2),
        g = c.getContext("2d");
      g.scale(2, 2);
      g.translate(-b.x, -b.y);
      paintKit(g, a.id, { frame });
      return c.toBuffer("image/png");
    };
    assert.notDeepEqual(render(0), render(1), a.id);
  }
});

import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createCanvas } from "@napi-rs/canvas";
import {
  SPRITE_KIT,
  KIT_CATEGORIES,
  kitBounds,
  kitColliders,
} from "../src/content/sprite-kit/catalog.js";
import { paintKit } from "../src/rendering/sprite-kit/index.js";
const output = path.resolve(
  process.argv[2] || "/tmp/learning-valley-sprite-kit",
);
await mkdir(output, { recursive: true });
const manifest = {
  version: 1,
  tileSize: 16,
  coordinateSystem:
    "anchor at local 0,0; x right; y down; z up; dimensions in logical pixels",
  directions: ["front", "left", "right", "back"],
  assets: [],
};
for (const category of Object.keys(KIT_CATEGORIES)) {
  const cells = [];
  for (const a of SPRITE_KIT.filter((a) => a.category === category))
    for (const state of Object.keys(a.states || { default: [] }))
      for (const direction of a.orientations)
        for (let frame = 0; frame < a.frames; frame++) {
          const options = {
            state: a.states ? state : undefined,
            direction,
            frame,
          };
          cells.push({ a, options, b: kitBounds(a.id, options) });
        }
  let x = 0,
    y = 0,
    row = 0;
  for (const c of cells) {
    if (x + c.b.w > 1024) {
      x = 0;
      y += row;
      row = 0;
    }
    c.x = x;
    c.y = y;
    x += c.b.w;
    row = Math.max(row, c.b.h);
  }
  const canvas = createCanvas(1024, y + row);
  const g = canvas.getContext("2d");
  for (const c of cells) {
    g.save();
    g.translate(c.x - c.b.x, c.y - c.b.y);
    paintKit(g, c.a.id, c.options);
    g.restore();
    manifest.assets.push({
      id: c.a.id,
      category,
      name: c.a.name,
      layer: c.a.layer,
      tags: c.a.tags,
      sheet: category + ".png",
      state: c.options.state ?? null,
      direction: c.options.direction,
      frame: c.options.frame,
      ms: c.a.ms,
      region: { x: c.x, y: c.y, w: c.b.w, h: c.b.h },
      anchor: { x: -c.b.x, y: -c.b.y },
      colliders: kitColliders(c.a.id, 0, 0, c.options),
    });
  }
  await writeFile(
    path.join(output, category + ".png"),
    canvas.toBuffer("image/png"),
  );
}
await writeFile(
  path.join(output, "manifest.json"),
  JSON.stringify(manifest, null, 2) + "\n",
);
console.log(`${SPRITE_KIT.length} peças exportadas para ${output}`);

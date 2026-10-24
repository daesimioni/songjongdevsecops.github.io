import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createCanvas } from "@napi-rs/canvas";
import {
  SPRITE_KIT,
  KIT_CATEGORIES,
  kitBounds,
  kitColliders,
  kitBody,
  kitAnimation,
} from "../src/content/sprite-kit/catalog.js";
import { creatureAttack } from "../src/content/sprite-kit/creatures.js";
import { paintKit } from "../src/rendering/sprite-kit/index.js";
const output = path.resolve(
  process.argv[2] || "temporarios/sprite-kit",
);
await mkdir(output, { recursive: true });
const manifest = {
  version: 2,
  tileSize: 16,
  pixelRatio: 1,
  coordinateSystem:
    "anchor at local 0,0; x right; y down; z up; dimensions in logical pixels; colliders/body in world tiles",
  directions: [
    "front",
    "left",
    "right",
    "back",
    "southwest",
    "southeast",
    "northwest",
    "northeast",
  ],
  pages: [],
  assets: [],
};
for (const category of Object.keys(KIT_CATEGORIES)) {
  let page = 0,
    x = 0,
    y = 0,
    row = 0,
    used = false;
  const canvas = createCanvas(1024, 1024),
    g = canvas.getContext("2d");
  const filename = () => `${category}-${String(page).padStart(3, "0")}.png`;
  async function flush() {
    if (!used) return;
    await writeFile(
      path.join(output, filename()),
      canvas.toBuffer("image/png"),
    );
    manifest.pages.push({ file: filename(), w: 1024, h: 1024 });
    page++;
    g.clearRect(0, 0, 1024, 1024);
    x = 0;
    y = 0;
    row = 0;
    used = false;
  }
  for (const a of SPRITE_KIT.filter((a) => a.category === category))
    for (const state of Object.keys(a.states || { default: [] }))
      for (const direction of a.orientations)
        for (let frame = 0; frame < a.frames; frame++) {
          const options = {
              state: a.states ? state : undefined,
              direction,
              frame,
            },
            b = kitBounds(a.id, options);
          if (b.w > 1024 || b.h > 1024)
            throw new Error(`Sprite excede a página: ${a.id}`);
          if (x + b.w > 1024) {
            x = 0;
            y += row;
            row = 0;
          }
          if (y + b.h > 1024) await flush();
          g.save();
          g.translate(x - b.x, y - b.y);
          paintKit(g, a.id, options);
          g.restore();
          used = true;
          manifest.assets.push({
            id: a.id,
            category,
            name: a.name,
            layer: a.layer,
            tags: a.tags,
            sheet: filename(),
            state: options.state ?? null,
            direction,
            frame,
            ms: a.ms,
            loop: kitAnimation(a.id, options.state).loop,
            region: { x, y, w: b.w, h: b.h },
            anchor: { x: -b.x, y: -b.y },
            colliders: kitColliders(a.id, 0, 0, options),
            body: kitBody(a.id),
            area: a.area ?? null,
            attack: creatureAttack(a.id),
          });
          x += b.w;
          row = Math.max(row, b.h);
        }
  await flush();
}
await writeFile(
  path.join(output, "manifest.json"),
  JSON.stringify(manifest) + "\n",
);
console.log(
  `${SPRITE_KIT.length} peças, ${manifest.assets.length} poses e ${manifest.pages.length} páginas exportadas para ${output}`,
);

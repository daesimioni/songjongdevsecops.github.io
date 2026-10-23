import { readFile, writeFile } from "node:fs/promises";
import { gunzipSync } from "node:zlib";
import { createCanvas } from "@napi-rs/canvas";
import { referenceRecipe } from "../../src/content/reference-art/recipes.js";
import { paintReference } from "../../src/rendering/reference-art/index.js";
const root = new URL("../../", import.meta.url),
  manifest = JSON.parse(
    await readFile(new URL("assets/reference-art/manifest.json", root)),
  );
async function page(category, index = 0) {
  const file = manifest.categories[category].pages[index].file;
  return JSON.parse(
    gunzipSync(
      Buffer.from(
        await readFile(new URL("assets/reference-art/" + file, root), "utf8"),
        "base64",
      ),
    ),
  );
}
async function gallery(name, items, columns = 8) {
  const width = 144,
    height = 112,
    c = createCanvas(
      columns * width,
      Math.ceil(items.length / columns) * height,
    ),
    g = c.getContext("2d");
  g.fillStyle = "#17232c";
  g.fillRect(0, 0, c.width, c.height);
  g.imageSmoothingEnabled = false;
  for (let i = 0; i < items.length; i++) {
    const { a, direction = 0, state = "idle", mode = "icon" } = items[i],
      tile = createCanvas(256, 256),
      t = tile.getContext("2d");
    t.translate(128, 128);
    paintReference(t, a, {
      direction,
      state,
      mode,
      frame: Math.min(4, a.frames - 1),
    });
    const data = t.getImageData(0, 0, 256, 256).data;
    let x1 = 256,
      y1 = 256,
      x2 = 0,
      y2 = 0;
    for (let y = 0; y < 256; y++)
      for (let x = 0; x < 256; x++)
        if (data[(y * 256 + x) * 4 + 3]) {
          x1 = Math.min(x1, x);
          y1 = Math.min(y1, y);
          x2 = Math.max(x2, x);
          y2 = Math.max(y2, y);
        }
    const x = (i % columns) * width,
      y = Math.floor(i / columns) * height;
    if (x2 >= x1) {
      const w = x2 - x1 + 1,
        h = y2 - y1 + 1,
        scale = Math.min(3, 130 / w, 85 / h);
      g.drawImage(
        tile,
        x1,
        y1,
        w,
        h,
        x + (width - w * scale) / 2,
        y + (88 - h * scale) / 2,
        w * scale,
        h * scale,
      );
    }
    g.fillStyle = "#d9e2d3";
    g.font = "10px sans-serif";
    g.fillText(a.label, x + 4, y + 101, width - 8);
    g.fillStyle = "#94b4ad";
    g.fillText(a.category + " · " + direction, x + 4, y + 111, width - 8);
  }
  await writeFile(
    new URL("docs/art/referencias/" + name + ".png", root),
    c.toBuffer("image/png"),
  );
}
const examples = [];
for (const category of Object.keys(manifest.categories)) {
  const rows = await page(
    category,
    Math.floor(manifest.categories[category].pages.length / 2),
  );
  for (let i = 0; i < 8; i++)
    examples.push({
      a: referenceRecipe(category, rows[Math.floor((i * rows.length) / 8)]),
    });
}
await gallery("catalogo", examples);
const creatures = [];
for (let i = 0; i < manifest.categories.criaturas.pages.length; i++)
  for (const row of await page("criaturas", i)) {
    const a = referenceRecipe("criaturas", row);
    if (!creatures.some((b) => b.species === a.species)) creatures.push(a);
  }
await gallery(
  "criaturas-oito-vistas",
  creatures.flatMap((a) =>
    a.orientations.map((direction) => ({ a, direction, state: "walk" })),
  ),
);

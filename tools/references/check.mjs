import assert from "node:assert/strict";
import { readFile, writeFile } from "node:fs/promises";
import { createHash } from "node:crypto";
import { gunzipSync } from "node:zlib";
import { createCanvas } from "@napi-rs/canvas";
import { referenceRecipe } from "../../src/content/reference-art/recipes.js";
import { referenceBodies } from "../../src/content/reference-art/bodies.js";
import {
  paintReference,
  referenceBounds,
} from "../../src/rendering/reference-art/index.js";
const root = new URL("../../", import.meta.url),
  read = (file) => readFile(new URL(file, root)),
  manifest = JSON.parse(await read("assets/reference-art/manifest.json")),
  ids = new Set(),
  signatures = new Set(),
  c = createCanvas(256, 256),
  g = c.getContext("2d");
let draws = 0,
  total = 0;
function render(a, direction, state, frame, mode = "icon") {
  g.clearRect(0, 0, 256, 256);
  g.save();
  g.translate(128, 128);
  paintReference(g, a, { direction, state, frame, mode });
  g.restore();
  const b = referenceBounds(a, { mode }),
    data = g.getImageData(0, 0, 256, 256).data;
  let count = 0;
  for (let y = 0; y < 256; y++)
    for (let x = 0; x < 256; x++)
      if (data[(y * 256 + x) * 4 + 3]) {
        count++;
        assert.ok(
          x >= 128 + b.x - 1 &&
            x <= 128 + b.x + b.w + 1 &&
            y >= 128 + b.y - 1 &&
            y <= 128 + b.y + b.h + 1,
          `Corte: ${a.id} / ${direction} / ${state} / ${frame}`,
        );
      }
  if (a.category === "vazios") assert.equal(count, 0);
  else assert.ok(count, `Arte vazia: ${a.id}`);
  draws++;
}
for (const [category, group] of Object.entries(manifest.categories)) {
  let count = 0;
  for (const page of group.pages) {
    const packed = await read("assets/reference-art/" + page.file);
    assert.equal(packed.length, page.bytes);
    assert.equal(
      createHash("sha256").update(packed).digest("hex"),
      page.sha256,
    );
    const decoded = gunzipSync(Buffer.from(packed.toString(), "base64"));
    assert.equal(decoded.length, page.decodedBytes);
    const rows = JSON.parse(decoded);
    assert.equal(rows.length, page.count);
    assert.equal(rows[0][0], page.first);
    assert.equal(rows.at(-1)[0], page.last);
    let previous = "";
    for (const row of rows) {
      const a = referenceRecipe(category, row);
      assert.ok(a.key > previous);
      previous = a.key;
      assert.ok(!ids.has(a.id));
      ids.add(a.id);
      count++;
      total++;
      if (category !== "vazios") assert.ok(a.grid.some(Boolean), a.id);
      for (const body of referenceBodies(a))
        assert.ok([body.x, body.y, body.hw, body.hh].every(Number.isFinite));
      const signature =
        category === "criaturas"
          ? a.family + ":" + a.species
          : category + ":" + a.motif + ":" + a.element;
      if (!signatures.has(signature)) {
        signatures.add(signature);
        for (const d of a.orientations)
          for (const state of a.states || ["idle"])
            for (const frame of [
              ...new Set([0, Math.floor(a.frames / 2), a.frames - 1]),
            ])
              render(a, d, state, frame);
        if (category === "magias")
          for (const d of a.orientations) render(a, d, "idle", 4, "effect");
      } else if (process.argv.includes("--all")) render(a, 0, "idle", 0);
    }
  }
  assert.equal(count, group.count);
  console.log(`${category}: ${count}; ${draws} provas`);
}
assert.equal(total, manifest.recipes);
let refs = 0;
const referenced = new Set();
for (let page = 0; page < Math.ceil(manifest.references / 8192); page++) {
  const encoded = await read(
      `docs/art/referencias/cobertura-${String(page).padStart(4, "0")}.ndjson.gz.txt`,
    ),
    plain = gunzipSync(Buffer.from(encoded.toString(), "base64"));
  for (const line of plain.toString().trim().split("\n")) {
    const row = JSON.parse(line);
    assert.ok(ids.has(row[2]), row[2]);
    referenced.add(row[2]);
    refs++;
  }
}
assert.equal(refs, manifest.references);
assert.equal(referenced.size, total);
const report = {
  references: refs,
  recipes: total,
  aliases: refs - total,
  rendered: draws,
  fullBasePose: process.argv.includes("--all"),
  status: "passed",
};
if (process.env.REFERENCE_REPORT)
  await writeFile(
    process.env.REFERENCE_REPORT,
    JSON.stringify(report, null, 2) + "\n",
  );
console.log(JSON.stringify(report));

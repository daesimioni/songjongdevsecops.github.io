import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createCanvas } from "@napi-rs/canvas";
import { SPRITE_KIT, kitBounds } from "../src/content/sprite-kit/catalog.js";
import { paintKit } from "../src/rendering/sprite-kit/index.js";
import {
  KIT_BLUEPRINTS,
  placeBlueprint,
} from "../src/content/sprite-kit/blueprints.js";
const out = path.resolve(process.argv[2] || "docs/art/biblioteca-modular");
await mkdir(out, { recursive: true });
const columns = 10,
  cw = 130,
  ch = 112;
const sheet = createCanvas(
  columns * cw,
  Math.ceil(SPRITE_KIT.length / columns) * ch,
);
const g = sheet.getContext("2d");
g.fillStyle = "#17232c";
g.fillRect(0, 0, sheet.width, sheet.height);
SPRITE_KIT.forEach((a, i) => {
  const x = (i % columns) * cw,
    y = Math.floor(i / columns) * ch,
    b = kitBounds(a.id);
  const scale = Math.min(2, 110 / b.w, 80 / b.h);
  g.save();
  g.translate(
    x + cw / 2 - (b.x + b.w / 2) * scale,
    y + 42 - (b.y + b.h / 2) * scale,
  );
  g.scale(scale, scale);
  paintKit(g, a.id);
  g.restore();
  g.fillStyle = "#dfe4d5";
  g.font = "10px sans-serif";
  g.fillText(a.name, x + 5, y + 95, 120);
  g.fillStyle = "#9bb6b3";
  g.fillText(a.category, x + 5, y + 107, 120);
});
await writeFile(path.join(out, "catalogo.png"), sheet.toBuffer("image/png"));
const scenes = createCanvas(
  1000,
  Math.ceil(Object.keys(KIT_BLUEPRINTS).length / 2) * 250,
);
const ctx = scenes.getContext("2d");
ctx.fillStyle = "#24363c";
ctx.fillRect(0, 0, scenes.width, scenes.height);
Object.keys(KIT_BLUEPRINTS).forEach((name, i) => {
  const x = (i % 2) * 500 + 130,
    y = Math.floor(i / 2) * 250 + 120;
  ctx.fillStyle = "#dfe4d5";
  ctx.font = "18px sans-serif";
  ctx.fillText(name, x - 100, y - 85);
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(2, 2);
  for (const p of placeBlueprint(name).sort((a, b) => a.y - b.y)) {
    ctx.save();
    ctx.translate(p.x * 16, p.y * 16);
    paintKit(ctx, p.id, p);
    ctx.restore();
  }
  ctx.restore();
});
await writeFile(
  path.join(out, "composicoes.png"),
  scenes.toBuffer("image/png"),
);
console.log(out);

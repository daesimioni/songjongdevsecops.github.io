import { pathToFileURL } from "node:url";
import { mkdir, writeFile } from "node:fs/promises";
const { createCanvas } = await import(
  process.env.ART_CANVAS_MODULE
    ? pathToFileURL(process.env.ART_CANVAS_MODULE).href
    : "@napi-rs/canvas"
);
globalThis.localStorage = {
  getItem: () => null,
  setItem() {},
  removeItem() {},
};
globalThis.document = {
  createElement: () => createCanvas(1, 1),
  getElementById: () => null,
  body: { classList: { toggle() {} } },
};
globalThis.window = {
  innerWidth: 1200,
  innerHeight: 800,
  devicePixelRatio: 1,
  addEventListener() {},
  matchMedia: () => ({ matches: false }),
};
const { createWorld } = await import("../src/world/world.js");
const { createRenderer } = await import("../src/rendering/render.js");
const { PLAYER_COLORS, SPAWN } = await import("../src/content/config.js");
const out = process.argv[2] || "/tmp/valley-scenes";
await mkdir(out, { recursive: true });
const world = createWorld(),
  canvas = createCanvas(1200, 800),
  renderer = createRenderer(canvas, world);
const points = [
  { id: "porto", ...SPAWN },
  ...world.waystones
    .filter((w, i) => i % 15 === 0)
    .map((w) => ({ ...w, id: w.areaId || w.id })),
];
for (const point of points) {
  const player = {
    x: point.x,
    y: point.y,
    dir: 5,
    boost: 0,
    colors: PLAYER_COLORS[0],
    name: "Viajante",
    color: "#efc986",
  };
  const pet = {
    x: point.x - 1,
    y: point.y + 0.6,
    kind: "cat",
    dir: 5,
    moving: true,
  };
  renderer.snap();
  renderer.draw(120000, player, [], world.npcs, pet, true);
  await writeFile(`${out}/${point.id}.png`, canvas.toBuffer("image/png"));
}
const { startTitle } = await import("../src/ui/title.js");
globalThis.requestAnimationFrame = () => 0;
const title = createCanvas(320, 180);
startTitle(title);
await writeFile(`${out}/titulo.png`, title.toBuffer("image/png"));
console.log(JSON.stringify({ scenes: points.length, out }));

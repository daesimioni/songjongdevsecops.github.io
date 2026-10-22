import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import { createCanvas } from "@napi-rs/canvas";
import { SPRITE_KIT, kitBounds } from "../src/content/sprite-kit/catalog.js";
import { paintKit } from "../src/rendering/sprite-kit/index.js";
const out = path.resolve(process.argv[2] || "docs/art/biblioteca-modular");
await mkdir(out, { recursive: true });
async function gallery(file, items, columns = 8, cell = 112) {
  const canvas = createCanvas(
      columns * cell,
      Math.ceil(items.length / columns) * 112,
    ),
    g = canvas.getContext("2d");
  g.fillStyle = "#17232c";
  g.fillRect(0, 0, canvas.width, canvas.height);
  items.forEach(({ a, direction = 0, state, frame = 3, label = a.name }, i) => {
    const b = kitBounds(a.id, { direction, state }),
      scale = Math.min(2, (cell * 0.85) / b.w, 83 / b.h),
      x = (i % columns) * cell,
      y = Math.floor(i / columns) * 112;
    g.save();
    g.translate(
      x + cell / 2 - (b.x + b.w / 2) * scale,
      y + 44 - (b.y + b.h / 2) * scale,
    );
    g.scale(scale, scale);
    paintKit(g, a.id, {
      direction,
      state,
      frame: Math.min(frame, a.frames - 1),
    });
    g.restore();
    g.font = "10px sans-serif";
    g.fillStyle = "#d8e1d4";
    g.fillText(label, x + 3, y + 99, cell - 6);
  });
  await writeFile(path.join(out, file + ".png"), canvas.toBuffer("image/png"));
}
await gallery(
  "criaturas-oito-vistas",
  SPRITE_KIT.filter((a) => a.renderer === "creature").flatMap((a) =>
    a.orientations.map((direction) => ({
      a,
      direction,
      state: "walk",
      label: a.name + " · " + direction,
    })),
  ),
);
await gallery(
  "ataques-elementais",
  SPRITE_KIT.filter((a) => a.renderer === "effect").map((a) => ({ a })),
  12,
  110,
);
await gallery(
  "eventos-climaticos",
  SPRITE_KIT.filter((a) => a.renderer === "weather").map((a) => ({ a })),
  6,
  160,
);
await gallery(
  "litoral-natureza",
  SPRITE_KIT.filter(
    (a) => a.category === "litoral" || a.category === "natureza",
  ).map((a) => ({ a })),
  8,
  120,
);
await gallery(
  "ataques-monstros",
  SPRITE_KIT.filter((a) => a.renderer === "legacy-cast").flatMap((a) =>
    a.orientations.map((direction) => ({
      a,
      direction,
      state: "attack",
      label: a.model + " · " + direction,
    })),
  ),
  8,
  112,
);
await gallery(
  "direcoes-ataques",
  [
    "fogo-cone",
    "gelo-projetil",
    "energia-raio",
    "fisico-corte",
    "agua-rastro",
  ].flatMap((slug) => {
    const a = SPRITE_KIT.find((a) => a.id === "kit/ataques/" + slug);
    return a.orientations.map((direction) => ({
      a,
      direction,
      label: a.name + " · " + direction,
    }));
  }),
  8,
  120,
);
const examples = [
  "dragao",
  "esqueleto",
  "crocodilo",
  "abelha",
  "raposa",
  "grifo",
  "elemental-gelo",
  "mimico",
];
await gallery(
  "estados-criaturas",
  examples.flatMap((slug) => {
    const a = SPRITE_KIT.find((a) => a.id === "kit/criaturas/" + slug);
    return ["idle", "walk", "attack", "hit", "death"].map((state) => ({
      a,
      state,
      frame: state === "death" ? 7 : 3,
      label: a.name + " · " + state,
    }));
  }),
  5,
  170,
);
const frames = path.join(out, "quadros");
await mkdir(frames, { recursive: true });
for (let frame = 0; frame < 8; frame++) {
  const canvas = createCanvas(960, 480),
    g = canvas.getContext("2d");
  g.fillStyle = "#17232c";
  g.fillRect(0, 0, 960, 480);
  for (let i = 0; i < 8; i++) {
    const a = SPRITE_KIT.find((a) => a.id === "kit/criaturas/" + examples[i]);
    g.save();
    g.translate(60 + i * 120, 80);
    g.scale(2, 2);
    paintKit(g, a.id, { direction: 5, state: "walk", frame });
    g.restore();
    g.fillStyle = "#d8e1d4";
    g.font = "12px sans-serif";
    g.fillText(a.name, 5 + i * 120, 110, 110);
  }
  for (let i = 0; i < 8; i++) {
    const element = [
        "fogo",
        "gelo",
        "morte",
        "terra",
        "energia",
        "fisico",
        "agua",
        "vento",
      ][i],
      a = SPRITE_KIT.find((a) => a.id === `kit/ataques/${element}-cone`);
    g.save();
    g.translate(55 + i * 120, 200);
    g.scale(1.5, 1.5);
    paintKit(g, a.id, { direction: 7, frame });
    g.restore();
    g.fillStyle = "#d8e1d4";
    g.fillText(element, 5 + i * 120, 230);
  }
  for (let i = 0; i < 6; i++) {
    const slug = ["chuva", "vento", "eclipse", "aurora", "meteoros", "neve"][i],
      a = SPRITE_KIT.find((a) => a.id === "kit/clima/" + slug);
    g.save();
    g.translate(80 + i * 160, 420);
    paintKit(g, a.id, { frame: frame * 2 });
    g.restore();
    g.fillStyle = "#d8e1d4";
    g.fillText(a.name, 15 + i * 160, 465, 150);
  }
  await writeFile(
    path.join(frames, `quadro-${frame}.png`),
    canvas.toBuffer("image/png"),
  );
}
console.log(out);

import { pathToFileURL } from "node:url";
import { writeFile } from "node:fs/promises";
const { createCanvas } = await import(
  process.env.ART_CANVAS_MODULE
    ? pathToFileURL(process.env.ART_CANVAS_MODULE).href
    : "@napi-rs/canvas"
);
globalThis.document = { createElement: () => createCanvas(1, 1) };
const { desenharAsset } = await import("../src/rendering/assets/index.js");
const { drawHuman } = await import("../src/rendering/human.js");
const { drawPetSprite } = await import("../src/rendering/pet-art.js");
const { drawCreatureArt } = await import("../src/rendering/creature.js");
const cv = createCanvas(1200, 630),
  g = cv.getContext("2d");
const sky = g.createLinearGradient(0, 0, 1200, 630);
sky.addColorStop(0, "#101b2e");
sky.addColorStop(1, "#243d49");
g.fillStyle = sky;
g.fillRect(0, 0, 1200, 630);
g.fillStyle = "#d4d6bb";
for (let i = 0; i < 45; i++)
  g.fillRect((i * 137) % 1200, 20 + ((i * 89) % 400), i % 7 === 0 ? 2 : 1, 1);
g.save();
g.translate(830, 460);
g.scale(3.5, 3.5);
g.imageSmoothingEnabled = false;
g.fillStyle = "#0c1829";
g.beginPath();
g.ellipse(0, 20, 92, 25, 0, 0, Math.PI * 2);
g.fill();
// Ilha em degraus: borda de pedra, musgo e caminho no mesmo pixel dos sprites.
for (let y = -7; y <= 3; y++)
  for (let x = -6; x <= 6; x++) {
    if ((x / 6.5) ** 2 + ((y + 1) / 5.7) ** 2 > 1) continue;
    g.fillStyle = y === 3 ? "#36424c" : (x + y) % 3 ? "#334e44" : "#3a5547";
    g.fillRect(x * 12, y * 8, 12, 8);
    if (Math.abs(x) < 2) {
      g.fillStyle = "#766952";
      g.fillRect(x * 12, y * 8, 12, 8);
    }
    if (y === 3) {
      g.fillStyle = "#202e40";
      g.fillRect(x * 12, y * 8 + 8, 12, 6);
    }
  }
const bio = { id: "og", accent: "#d0b57b", floor: "#293444", path: "#6b6552" };
for (const [kind, x, y, seed] of [
  ["conifera", -58, -24, 1],
  ["arvore", 48, -28, 2],
  ["casa", -7, -8, 0],
  ["arbusto", -49, 20, 1],
  ["florada", 42, 20, 2],
  ["pedra", 57, 7, 0],
  ["fogueira", -26, 26, 0],
])
  desenharAsset(g, kind, x, y, { tempo: 700, bioma: bio, seed });
drawHuman(
  g,
  5,
  22,
  5,
  false,
  700,
  {
    skin: "#d5ad88",
    hair: "#49394c",
    shirt: "#7cb99c",
    pants: "#353b54",
    accent: "#e0c88f",
  },
  1,
  { hair: "chanel" },
);
drawPetSprite(g, "cat", 16, 28, 700, false, 4);
g.save();
g.translate(44, 3);
drawCreatureArt(g, "tome", "#83baa4", 700, 0.7, 4);
g.restore();
g.restore();
const shade = g.createLinearGradient(0, 0, 740, 0);
shade.addColorStop(0, "rgba(10,19,33,.95)");
shade.addColorStop(0.72, "rgba(10,19,33,.9)");
shade.addColorStop(1, "rgba(10,19,33,0)");
g.fillStyle = shade;
g.fillRect(0, 0, 740, 630);
g.fillStyle = "#87bda5";
g.font = "bold 16px sans-serif";
g.fillText("UM RPG DE EXPLORAÇÃO E APRENDIZADO", 72, 130);
g.fillStyle = "#eee8d5";
g.font = "bold 76px sans-serif";
g.fillText("The Learning", 68, 240);
g.fillText("Valley", 68, 328);
g.fillStyle = "#ddc18e";
g.fillRect(72, 365, 68, 3);
g.font = "26px sans-serif";
g.fillStyle = "#bfcbd0";
g.fillText("Cada descoberta abre um novo caminho.", 72, 425);
g.font = "16px sans-serif";
g.fillStyle = "#91a6b0";
g.fillText("EXPLORE  •  APRENDA  •  CONSTRUA SUA HISTÓRIA", 72, 552);
await writeFile(
  new URL("../assets/og.png", import.meta.url),
  cv.toBuffer("image/png"),
);
console.log("assets/og.png — 1200 × 630");

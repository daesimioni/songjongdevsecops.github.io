import {
  MATERIALS,
  BASES,
  referenceFrame,
} from "../../content/reference-art/recipes.js";
import { paintKit } from "../sprite-kit/index.js";
import { paintKitCreature } from "../sprite-kit/creatures.js";
import { paintKitEffect } from "../sprite-kit/effects.js";
import { kitAsset, kitBounds } from "../../content/sprite-kit/catalog.js";
import { directionVector } from "../../core/movement.js";
import { volumePainter } from "../actor-volume.js";
import { criarCache } from "../assets/nucleo.js";
import { artTime } from "../art-style.js";
const cache = criarCache(
  512,
  () => document.createElement("canvas"),
  12 * 1024 * 1024,
);
const shade = (c, n) =>
  "#" +
  [1, 3, 5]
    .map((i) =>
      Math.max(0, Math.min(255, parseInt(c.slice(i, i + 2), 16) + n))
        .toString(16)
        .padStart(2, "0"),
    )
    .join("");
const base = (a) =>
  ![
    "criaturas",
    "magias",
    "efeitos",
    "projeteis",
    "interface",
    "cartografia",
    "componentes",
    "armas",
    "equipamentos",
    "vazios",
  ].includes(a.category) &&
  BASES[a.motif] &&
  kitAsset(BASES[a.motif]);
export function referenceBounds(a, { mode = "icon" } = {}) {
  if (a.category === "criaturas") return { x: -48, y: -84, w: 96, h: 112 };
  if (
    ["efeitos", "projeteis"].includes(a.category) ||
    (a.category === "magias" && mode === "effect")
  )
    return { x: -72, y: -96, w: 144, h: 176 };
  if (base(a)) {
    const boxes = a.orientations.map((direction) =>
        kitBounds(BASES[a.motif], { direction }),
      ),
      x = Math.min(...boxes.map((b) => b.x)) - 4,
      y = Math.min(...boxes.map((b) => b.y)) - 4;
    return {
      x,
      y,
      w: Math.max(...boxes.map((b) => b.x + b.w)) - x + 4,
      h: Math.max(...boxes.map((b) => b.y + b.h)) - y + 4,
    };
  }
  return { x: -32, y: -48, w: 64, h: 64 };
}
function poly(g, points, color) {
  g.fillStyle = color;
  g.beginPath();
  points.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
  g.closePath();
  g.fill();
}
function relief(g, a, direction, frame, flat = false) {
  const f = directionVector(direction),
    ux = Math.min(1.6, Math.max(0.7, Math.sqrt(a.ratio))),
    uz = Math.min(1.8, Math.max(0.7, 1 / Math.sqrt(a.ratio))),
    project = (x, y, z) =>
      flat ? [x, y] : [x * f.y + y * f.x, (-x * f.x + y * f.y) * 0.52 - z];
  const rows = [];
  for (let row = 0; row < 16; row++)
    for (let col = 0; col < 16; ) {
      const material = a.grid[row * 16 + col];
      let end = col + 1;
      while (end < 16 && a.grid[row * 16 + end] === material) end++;
      if (material) rows.push({ row, col, end, material });
      col = end;
    }
  // Only silhouettes receive dark boundaries; contiguous rows share materials.
  rows.sort((a, b) => a.row - b.row);
  for (const { row, col, end, material } of rows) {
    const c = MATERIALS[material],
      x1 = (col - 8) * ux,
      x2 = (end - 8) * ux,
      z1 = (15 - row) * uz,
      z2 = z1 + uz,
      depth = material === 8 ? 2.8 : 1.8;
    if (flat) {
      g.fillStyle = shade(c, Math.round((8 - row) * 1.5));
      g.fillRect(x1, -z2, x2 - x1 + 0.05, uz + 0.05);
      continue;
    }
    for (const side of [1, -1]) {
      poly(
        g,
        [
          [x1, -side * depth, z1],
          [x2, -side * depth, z1],
          [x2, -side * depth, z2],
          [x1, -side * depth, z2],
        ].map((p) => project(...p)),
        shade(c, side > 0 ? -14 : 6),
      );
    }
    poly(
      g,
      [
        [x1, -depth, z2],
        [x2, -depth, z2],
        [x2, depth, z2],
        [x1, depth, z2],
      ].map((p) => project(...p)),
      shade(c, 18),
    );
    for (const [x, n] of [
      [x1, -22],
      [x2, -10],
    ])
      poly(
        g,
        [
          [x, -depth, z1],
          [x, depth, z1],
          [x, depth, z2],
          [x, -depth, z2],
        ].map((p) => project(...p)),
        shade(c, n),
      );
    if ((a.seed + row * 17 + col) % 7 === 0) {
      const [px, py] = project((x1 + x2) / 2, -depth, z2);
      g.fillStyle = shade(c, 25 + (frame % 2) * 3);
      g.fillRect(px, py, 0.6, 0.6);
    }
  }
}
function actor(g, a, direction, state, frame) {
  const counts = new Map();
  for (const m of a.grid) if (m) counts.set(m, (counts.get(m) || 0) + 1);
  const dominant = [...counts].sort((x, y) => y[1] - x[1])[0]?.[0] || 1,
    color = MATERIALS[dominant],
    family = { dragon: "mythical", aquatic: "reptile" }[a.family] || a.family;
  if (family === "serpent") {
    const p = volumePainter(g, direction),
      collapse = state === "death" ? 1 - frame / 9 : 1;
    for (let i = 10; i >= 0; i--)
      p.ball(
        Math.sin(i * 0.7 + (state === "walk" ? (frame * Math.PI) / 4 : 0)) * 2,
        (i - 5) * 1.6,
        3 * collapse,
        2.5,
        2,
        2 * collapse,
        color,
      );
    p.ball(0, 9, 5 * collapse, 3, 3, 3 * collapse, color);
    p.ball(-1, 11, 6 * collapse, 0.5, 0.5, 0.5, "#e5d5ac");
    p.ball(1, 11, 6 * collapse, 0.5, 0.5, 0.5, "#e5d5ac");
    p.flush();
    return;
  }
  paintKitCreature(
    g,
    {
      family,
      species: a.species,
      color,
      width: Math.max(3, Math.min(10, Math.round(5 * Math.sqrt(a.ratio)))),
      length: Math.max(4, Math.min(15, Math.round(8 / Math.sqrt(a.ratio)))),
      element: a.element,
    },
    { direction, state, frame },
  );
}
export function paintReference(
  g,
  a,
  { direction = 0, state = "idle", frame = 0, mode = "icon" } = {},
) {
  if (
    !a.orientations.includes(direction) ||
    !Number.isInteger(frame) ||
    frame < 0 ||
    frame >= a.frames ||
    (a.states && !a.states.includes(state))
  )
    throw new Error("Vista, pose ou quadro inválido");
  g.save();
  try {
    if (a.category === "vazios") return;
    if (a.category === "criaturas") actor(g, a, direction, state, frame);
    else if (
      ["efeitos", "projeteis"].includes(a.category) ||
      (a.category === "magias" && mode === "effect")
    ) {
      paintKitEffect(
        g,
        {
          element: a.element,
          form:
            a.category === "projeteis"
              ? "projetil"
              : ["anel", "explosao", "coluna", "cone"][a.seed % 4],
        },
        { direction, frame },
      );
      g.save();
      g.translate(0, -8);
      g.scale(0.5, 0.5);
      if (a.category === "projeteis") {
        const f = directionVector(direction);
        g.rotate(Math.atan2(f.y, f.x) + Math.PI / 2);
        g.translate(
          0,
          8 * Math.min(1.8, Math.max(0.7, 1 / Math.sqrt(a.ratio))),
        );
      }
      relief(g, a, direction, frame, true);
      g.restore();
    } else if (a.category === "magias" || a.category === "interface") {
      g.fillStyle = "#172534";
      g.fillRect(-17, -35, 34, 34);
      g.strokeStyle = "#b6a679";
      g.lineWidth = 0.6;
      g.strokeRect(-16.5, -34.5, 33, 33);
      g.save();
      g.translate(0, -5);
      relief(g, a, 0, frame, true);
      g.restore();
    } else if (a.category === "terrenos") {
      const f = directionVector(direction),
        point = (x, y) => [x * f.y + y * f.x, -x * f.x + y * f.y];
      for (let row = 0; row < 16; row++)
        for (let col = 0; col < 16; col++) {
          const m = a.grid[row * 16 + col];
          if (!m) continue;
          const x = col - 8,
            y = row - 8;
          poly(
            g,
            [
              [x, y],
              [x + 1, y],
              [x + 1, y + 1],
              [x, y + 1],
            ].map((p) => point(...p)),
            shade(
              MATERIALS[m],
              Math.round(
                Math.sin(row + col + (frame * Math.PI) / 4) *
                  (a.frames > 1 ? 12 : 2),
              ),
            ),
          );
        }
    } else if (base(a)) {
      const model = base(a);
      paintKit(g, model.id, { direction, frame: frame % model.frames });
      g.save();
      g.translate(0, -5);
      g.scale(0.18, 0.18);
      relief(g, a, direction, frame, true);
      g.restore();
    } else relief(g, a, direction, frame, a.category === "cartografia");
  } finally {
    g.restore();
  }
}
export function drawReference(
  g,
  a,
  x,
  y,
  { direction = 0, state = "idle", tempo = 0, mode = "icon" } = {},
) {
  const b = referenceBounds(a, { mode }),
    frame = referenceFrame(a, artTime(tempo), state),
    key = `${a.id}:${direction}:${state}:${mode}:${frame}`,
    sprite = cache.pegar(key, b.w * 2, b.h * 2, (c) => {
      c.scale(2, 2);
      c.translate(-b.x, -b.y);
      paintReference(c, a, { direction, state, frame, mode });
    });
  g.drawImage(sprite, x + b.x, y + b.y, b.w, b.h);
}

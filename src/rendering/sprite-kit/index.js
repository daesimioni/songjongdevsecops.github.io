import { paintKitCreature, paintMonsterCast } from "./creatures.js";
import { paintKitEffect, paintKitWeather } from "./effects.js";
import {
  kitAsset,
  kitAnimation,
  kitParts,
  kitPoint,
  kitBounds,
} from "../../content/sprite-kit/catalog.js";
import { criarCache } from "../assets/nucleo.js";
import { artFrame, artTime } from "../art-style.js";
const colors = {
  wood: "#a77948",
  bark: "#715139",
  stone: "#8c9698",
  brick: "#b8735c",
  clay: "#b98662",
  iron: "#637480",
  glass: "#91d2ce",
  stainedGlass: "#b184c5",
  water: "#458eae",
  fire: "#e99a45",
  tile: "#af6552",
  straw: "#c8ad65",
  leaf: "#648a58",
  moss: "#526e51",
  grass: "#6d925e",
  earth: "#927250",
  sand: "#cfbf8c",
  snow: "#d9e3e1",
  marble: "#becbc9",
  basalt: "#505e68",
  circuit: "#568e85",
  paper: "#dbd3b0",
  checkers: "#c4c8ad",
  ice: "#abd2d8",
  leafDry: "#b1834d",
  copper: "#b7895a",
  rope: "#a39269",
  cloth: "#698aa1",
  leather: "#83664d",
  pink: "#d4a0b1",
  purple: "#9e88af",
  gold: "#d9b56c",
  blue: "#668eae",
  smoke: "#a7afb1",
};
const cache = criarCache(
  512,
  () => document.createElement("canvas"),
  12 * 1024 * 1024,
);
function shade(hex, n) {
  return (
    "#" +
    [1, 3, 5]
      .map((i) =>
        Math.max(0, Math.min(255, parseInt(hex.slice(i, i + 2), 16) + n))
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}
function polygon(g, points, fill) {
  g.beginPath();
  points.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
  g.closePath();
  g.fillStyle = fill;
  g.fill();
  g.strokeStyle = "#172534";
  g.lineWidth = 0.5;
  g.stroke();
}
function surfaceTexture(g, points, color, material, detail, frame) {
  const xs = points.map((p) => p[0]),
    ys = points.map((p) => p[1]);
  const left = Math.min(...xs),
    right = Math.max(...xs),
    top = Math.min(...ys),
    bottom = Math.max(...ys);
  g.save();
  g.beginPath();
  points.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
  g.closePath();
  g.clip();
  g.fillStyle = shade(color, -25);
  const masonry =
    ["stone", "brick", "marble", "ice"].includes(material) ||
    detail === "masonry";
  if (masonry) {
    for (let y = top + 4, row = 0; y < bottom; y += 5, row++) {
      g.fillRect(left, y, right - left, 0.5);
      for (let x = left + (row % 2) * 4; x < right; x += 8)
        g.fillRect(x, y - 4, 0.5, 4);
    }
  } else if (["wood", "bark", "straw"].includes(material)) {
    for (let x = left + 2; x < right; x += 3) {
      g.fillStyle = shade(color, -18);
      g.fillRect(x, top, 0.5, bottom - top);
      g.fillStyle = shade(color, 8);
      g.fillRect(x + 0.7, top + 2, 0.5, Math.max(0, bottom - top - 4));
    }
  } else {
    for (let y = top + 2; y < bottom; y += 4)
      for (let x = left + 2; x < right; x += 4) {
        g.fillStyle = shade(color, -14);
        g.fillRect(x, y, 0.5, 0.5);
      }
  }
  if (material === "water") {
    g.fillStyle = "#b3dacf";
    for (let y = top + ((frame * 2) % 8); y < bottom; y += 8)
      g.fillRect(left + 1, y, Math.max(1, right - left - 2), 0.75);
  }
  if (detail === "door") {
    g.fillStyle = "#d2b56a";
    g.fillRect(right - 3, (top + bottom) / 2, 1, 2);
  }
  if (detail === "drawers") {
    g.fillStyle = "#d2b56a";
    for (let y = top + 4; y < bottom; y += 6)
      g.fillRect((left + right) / 2 - 1, y, 2, 0.5);
  }
  if (detail === "sign") {
    g.fillStyle = shade(color, 40);
    for (let y = top + 2; y < bottom - 1; y += 2)
      g.fillRect(left + 2, y, Math.max(1, right - left - 5), 0.5);
  }
  g.restore();
}
export function paintKit(g, id, { direction = 0, state, frame = 0 } = {}) {
  const definition = kitAsset(id);
  if (!definition) throw new Error(`Sprite desconhecido: ${id}`);
  if (!Number.isInteger(frame) || frame < 0 || frame >= definition.frames)
    throw new Error(`Quadro inválido: ${frame}`);
  if (definition.renderer) {
    kitBounds(id, { direction, state });
    const options = { direction, state, frame };
    if (definition.renderer === "creature")
      paintKitCreature(g, definition, options);
    else if (definition.renderer === "legacy-cast")
      paintMonsterCast(g, definition, options);
    else if (definition.renderer === "effect")
      paintKitEffect(g, definition, options);
    else paintKitWeather(g, definition, options);
    return;
  }
  paintKitParts(g, kitParts(id, state), { direction, frame });
}
export function paintKitParts(
  g,
  sourceParts,
  { direction = 0, frame = 0, projectPoint = null } = {},
) {
  const parts = sourceParts.map((p) =>
    !p.solid &&
    [
      "leaf",
      "moss",
      "grass",
      "pink",
      "purple",
      "gold",
      "cloth",
      "fire",
    ].includes(p.material)
      ? { ...p, x: p.x + Math.sin((frame * Math.PI) / 4) * 0.8 }
      : p,
  );
  const project = projectPoint || ((x, y, z) => kitPoint(x, y, z, direction));
  const depth = (p) => project(p.x, p.y, 0)[1] + p.z + p.h * 0.5;
  [...parts]
    .sort((a, b) => depth(a) - depth(b))
    .forEach((p, index) => {
      const color = colors[p.material] || "#ae90b4";
      const top = p.z + p.h;
      if (p.kind === "cone") {
        const [x, y] = project(p.x, p.y, p.z);
        const width = direction === 1 || direction === 2 ? p.d : p.w;
        const [tx, ty] = project(p.x, p.y, p.z + p.h);
        polygon(
          g,
          [
            [x - width / 2, y],
            [tx, ty],
            [x + width / 2, y],
          ],
          color,
        );
        g.fillStyle = shade(color, -20);
        for (let k = 0; k < 4; k++)
          g.fillRect(
            x - (width * (1 - k / 5)) / 2,
            y - k * 3,
            width * (1 - k / 5),
            0.5,
          );
        return;
      }
      if (p.kind === "ball" || p.kind === "smoke") {
        const [x, y] = project(p.x, p.y, p.z + p.h / 2);
        const swap = direction === 1 || direction === 2;
        const motion =
          p.kind === "smoke"
            ? Math.sin((frame * Math.PI) / 4 + index) * 1.5
            : 0;
        g.fillStyle = shade(
          color,
          Math.round(Math.sin((frame * Math.PI) / 4 + index) * 4),
        );
        g.strokeStyle = "#172534";
        g.lineWidth = 0.5;
        g.beginPath();
        g.ellipse(
          x + motion,
          y,
          Math.max(0.5, (swap ? p.d : p.w) / 2),
          Math.max(0.5, p.h / 2 + (swap ? p.w : p.d) / 5),
          0,
          0,
          Math.PI * 2,
        );
        g.fill();
        g.stroke();
        g.save();
        g.clip();
        for (let yy = -Math.ceil(p.h); yy < p.h; yy += 2)
          for (let xx = -Math.ceil(p.w); xx < p.w; xx += 2) {
            const hash = Math.abs(xx * 31 + yy * 17 + index * 13);
            if (hash % 3) continue;
            g.fillStyle = shade(color, (xx < 0 ? 15 : -12) + (hash % 13) - 6);
            g.fillRect(x + xx, y + yy, 1 + (hash % 2), 0.75);
          }
        if (p.detail === "barrel") {
          const width = swap ? p.d : p.w;
          g.fillStyle = colors.iron;
          g.fillRect(x - width / 2, y - p.h * 0.25, p.w, 1.5);
          g.fillRect(x - width / 2, y + p.h * 0.25, p.w, 1.5);
        }
        g.fillStyle = shade(color, 18);
        g.fillRect(x - p.w / 5, y - p.h / 4, Math.max(1, p.w / 5), 1);
        g.restore();
        return;
      }
      const corners = [
        [-1, -1],
        [1, -1],
        [1, 1],
        [-1, 1],
      ].map(([x, y]) => [p.x + (x * p.w) / 2, p.y + (y * p.d) / 2]);
      const bottom = corners.map(([x, y]) => project(x, y, p.z));
      const upper = corners.map(([x, y]) => project(x, y, top));
      if (p.kind === "roof") {
        const ridge = [
          project(p.x, p.y - p.d / 2, top),
          project(p.x, p.y + p.d / 2, top),
        ];
        polygon(
          g,
          [bottom[0], bottom[3], ridge[1], ridge[0]],
          shade(color, 12),
        );
        polygon(
          g,
          [ridge[0], ridge[1], bottom[2], bottom[1]],
          shade(color, -16),
        );
        const ridgeX = p.x;
        for (let row = 1; row < Math.floor(p.d / 4); row++) {
          const y = p.y - p.d / 2 + row * 4;
          for (const side of [-1, 1]) {
            const a = project(ridgeX, y, top),
              b = project(p.x + (side * p.w) / 2, y, p.z);
            g.beginPath();
            g.moveTo(...a);
            g.lineTo(...b);
            g.strokeStyle = shade(color, -27);
            g.stroke();
          }
        }
        return;
      }
      const faces = corners
        .map((_, i) => ({
          i,
          depth: (bottom[i][1] + bottom[(i + 1) % 4][1]) / 2,
        }))
        .sort((a, b) => a.depth - b.depth);
      if (p.h)
        faces.slice(2).forEach(({ i }) => {
          const j = (i + 1) % 4;
          polygon(
            g,
            [bottom[i], bottom[j], upper[j], upper[i]],
            shade(color, i % 2 ? -20 : -6),
          );
          surfaceTexture(
            g,
            [bottom[i], bottom[j], upper[j], upper[i]],
            color,
            p.material,
            p.detail,
            frame,
          );
        });
      polygon(g, upper, shade(color, 16));
      // Texture is deterministic, aligned to the local surface, and rotates with it.
      const n = Math.floor(p.w / 4),
        m = Math.floor(p.d / 4);
      for (let ix = 0; ix < n; ix++)
        for (let iy = 0; iy < m; iy++) {
          const [x, y] = project(
            p.x - p.w / 2 + ix * 4 + 2,
            p.y - p.d / 2 + iy * 4 + 2,
            top,
          );
          let tone = (ix + iy) % 2 ? 7 : -7;
          if (p.material === "checkers") tone = (ix + iy) % 2 ? -48 : 30;
          if (p.material === "water" || p.material === "fire")
            tone = Math.round(Math.sin(ix + iy + (frame * Math.PI) / 4) * 24);
          g.fillStyle = shade(color, tone + 12);
          if (p.material === "checkers") {
            const lx = p.x - p.w / 2 + ix * 4,
              ly = p.y - p.d / 2 + iy * 4;
            polygon(
              g,
              [
                [lx, ly],
                [lx + 4, ly],
                [lx + 4, ly + 4],
                [lx, ly + 4],
              ].map(([px, py]) => project(px, py, top)),
              shade(color, tone),
            );
          } else
            g.fillRect(
              x - 0.5,
              y - 0.5,
              ["water", "wood", "straw", "paper"].includes(p.material)
                ? 2.5
                : 1,
              0.5,
            );
        }
      if (
        ["door", "drawers", "crate", "sign", "masonry", "boards"].includes(
          p.detail,
        ) &&
        p.h > 3
      ) {
        const steps =
          p.detail === "drawers"
            ? 3
            : p.detail === "masonry"
              ? Math.ceil(p.h / 5)
              : 1;
        for (let k = 1; k <= steps; k++) {
          const a = project(
            p.x - p.w * 0.4,
            p.y + p.d / 2,
            p.z + (p.h * k) / (steps + 1),
          );
          const b = project(
            p.x + p.w * 0.4,
            p.y + p.d / 2,
            p.z + (p.h * k) / (steps + 1),
          );
          g.beginPath();
          g.moveTo(...a);
          g.lineTo(...b);
          g.strokeStyle = shade(color, -35);
          g.stroke();
        }
      }
    });
}
export function drawKit(
  ctx,
  id,
  x,
  y,
  { direction = 0, state, tempo = 0 } = {},
) {
  const a = kitAsset(id);
  if (!a) return false;
  const bounds = kitBounds(id, { direction, state });
  const frame = kitFrame(id, tempo, state);
  const key = `${id}:${direction}:${state ?? a.defaultState ?? ""}:${frame}`;
  const sprite = cache.pegar(key, bounds.w * 2, bounds.h * 2, (g) => {
    g.scale(2, 2);
    g.translate(-bounds.x, -bounds.y);
    paintKit(g, id, { direction, state, frame });
  });
  ctx.drawImage(
    sprite,
    Math.round(x) + bounds.x,
    Math.round(y) + bounds.y,
    bounds.w,
    bounds.h,
  );
  return true;
}
export function kitCache() {
  return cache;
}

export function kitFrame(id, tempo = 0, state) {
  const a = kitAsset(id);
  if (!a) throw new Error(`Sprite desconhecido: ${id}`);
  const { loop } = kitAnimation(id, state);
  return loop
    ? artFrame(tempo, a.frames, a.ms)
    : Math.min(a.frames - 1, Math.floor(artTime(tempo) / a.ms));
}

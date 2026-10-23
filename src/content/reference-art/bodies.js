import { BASES } from "./recipes.js";
import { kitParts } from "../sprite-kit/catalog.js";
import { directionVector } from "../../core/movement.js";
export function referencePoint(x, y, z = 0, direction = 0) {
  const f = directionVector(direction);
  return [x * f.y + y * f.x, (-x * f.x + y * f.y) * 0.52 - z];
}
const bounds = new Map();
export function referenceModelBounds(motif) {
  const id = BASES[motif];
  if (!id) return null;
  if (bounds.has(id)) return bounds.get(id);
  const points = [];
  for (const p of kitParts(id))
    for (let d = 0; d < 8; d++) {
      for (const x of [-1, 1])
        for (const y of [-1, 1])
          for (const z of [0, 1])
            points.push(
              referencePoint(
                p.x + (x * p.w) / 2,
                p.y + (y * p.d) / 2,
                p.z + z * p.h,
                d,
              ),
            );
      if (["ball", "smoke", "cone"].includes(p.kind)) {
        const [x, y] = referencePoint(p.x, p.y, p.z + p.h / 2, d),
          radius = Math.max(p.w, p.d) / 2;
        points.push(
          [x - radius, y - p.h / 2 - radius * 0.52],
          [x + radius, y + p.h / 2 + radius * 0.52],
        );
      }
    }
  const x = Math.floor(Math.min(...points.map((p) => p[0]))) - 4,
    y = Math.floor(Math.min(...points.map((p) => p[1]))) - 4,
    value = Object.freeze({
      x,
      y,
      w: Math.ceil(Math.max(...points.map((p) => p[0]))) - x + 4,
      h: Math.ceil(Math.max(...points.map((p) => p[1]))) - y + 4,
    });
  bounds.set(id, value);
  return value;
}
export function referenceBodies(a, x = 0, y = 0, { direction = 0 } = {}) {
  if (![x, y].every(Number.isFinite) || !a.orientations.includes(direction))
    throw new Error("Posição ou direção inválida");
  if (a.category === "criaturas") {
    const width = Math.max(3, Math.min(10, Math.round(5 * Math.sqrt(a.ratio)))),
      length = Math.max(4, Math.min(15, Math.round(8 / Math.sqrt(a.ratio))));
    return [{ x, y, hw: width / 16, hh: (length * 0.52) / 16 }];
  }
  if (
    !["construcoes", "mobilia", "vegetacao", "recipientes"].includes(
      a.category,
    ) ||
    !BASES[a.motif]
  )
    return [];
  const f = directionVector(direction);
  return kitParts(BASES[a.motif])
    .filter((p) => p.solid)
    .map((p) => {
      const [px, py] = referencePoint(p.x, p.y, 0, direction);
      return {
        x: x + px / 16,
        y: y + py / 16,
        hw: (Math.abs(f.y) * p.w + Math.abs(f.x) * p.d) / 32,
        hh: ((Math.abs(f.x) * p.w + Math.abs(f.y) * p.d) * 0.52) / 32,
      };
    });
}

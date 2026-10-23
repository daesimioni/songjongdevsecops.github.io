import { BASES } from "./recipes.js";
import { kitColliders } from "../sprite-kit/catalog.js";
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
  return kitColliders(BASES[a.motif], x, y, { direction });
}

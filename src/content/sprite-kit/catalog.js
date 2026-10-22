import { ground, architecture, boundaries } from "./architecture.js";
import {
  furniture,
  storage,
  workshops,
  nature,
  agriculture,
  civic,
  learning,
} from "./objects.js";
export const KIT_CATEGORIES = {
  terrenos: ground,
  arquitetura: architecture,
  limites: boundaries,
  mobiliario: furniture,
  armazenamento: storage,
  oficios: workshops,
  natureza: nature,
  agricultura: agriculture,
  comunidade: civic,
  aprendizado: learning,
};
function freeze(value) {
  if (value && typeof value === "object") {
    Object.values(value).forEach(freeze);
    Object.freeze(value);
  }
  return value;
}
export const SPRITE_KIT = freeze(
  Object.entries(KIT_CATEGORIES).flatMap(([category, items]) =>
    items.map((item) => ({
      layer: "object",
      snap: 1,
      ...item,
      category,
      id: `kit/${category}/${item.slug}`,
    })),
  ),
);
freeze(KIT_CATEGORIES);
const boundsCache = new Map();
const byId = new Map(SPRITE_KIT.map((item) => [item.id, item]));
export function kitAsset(id) {
  return byId.get(id) || null;
}
export function searchKit({ category, query = "" } = {}) {
  const normalize = (s) =>
    s
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
  const q = normalize(query);
  return SPRITE_KIT.filter(
    (a) =>
      (!category || a.category === category) &&
      normalize([a.id, a.name, ...a.tags].join(" ")).includes(q),
  );
}
export function kitParts(id, state) {
  const a = kitAsset(id);
  if (!a) throw new Error(`Sprite desconhecido: ${id}`);
  if (!a.states) return a.parts;
  const key = state ?? a.defaultState;
  const parts = Object.hasOwn(a.states, key) ? a.states[key] : null;
  if (!parts) throw new Error(`Estado inválido: ${state} (${id})`);
  return parts;
}
export function kitRotation(direction = 0) {
  if (!Number.isInteger(direction) || direction < 0 || direction > 3) {
    throw new Error(`Orientação inválida: ${direction}`);
  }
  const v = [
    [1, 0],
    [0, -1],
    [0, 1],
    [-1, 0],
  ][direction];
  if (!v) throw new Error(`Orientação inválida: ${direction}`);
  return v;
}
export function kitPoint(x, y, z, direction = 0) {
  const [c, s] = kitRotation(direction);
  return [x * c - y * s, x * s + y * c - z];
}
export function kitBounds(id, { direction = 0, state } = {}) {
  const parts = kitParts(id, state);
  kitRotation(direction);
  const key = `${id}:${direction}:${state ?? kitAsset(id).defaultState ?? ""}`;
  if (boundsCache.has(key)) return boundsCache.get(key);
  const points = parts.flatMap((p) =>
    [-1, 1].flatMap((x) =>
      [-1, 1].flatMap((y) =>
        [0, 1].map((z) =>
          kitPoint(
            p.x + (x * p.w) / 2,
            p.y + (y * p.d) / 2,
            p.z + z * p.h,
            direction,
          ),
        ),
      ),
    ),
  );
  const bounds = Object.freeze({
    x: Math.floor(Math.min(...points.map((p) => p[0]))) - 3,
    y: Math.floor(Math.min(...points.map((p) => p[1]))) - 3,
    w:
      Math.ceil(Math.max(...points.map((p) => p[0]))) -
      Math.floor(Math.min(...points.map((p) => p[0]))) +
      6,
    h:
      Math.ceil(Math.max(...points.map((p) => p[1]))) -
      Math.floor(Math.min(...points.map((p) => p[1]))) +
      6,
  });
  boundsCache.set(key, bounds);
  return bounds;
}
// Coordenadas de mundo em tiles; desenho local em pixels (16 px por tile).
export function kitColliders(id, x = 0, y = 0, { direction = 0, state } = {}) {
  kitRotation(direction);
  return kitParts(id, state)
    .filter((p) => p.solid)
    .map((p) => {
      const [cx, cy] = kitPoint(p.x, p.y, 0, direction);
      const turn = direction === 1 || direction === 2;
      return {
        x: x + cx / 16,
        y: y + cy / 16,
        hw: (turn ? p.d : p.w) / 32,
        hh: (turn ? p.w : p.d) / 32,
        tipo: id,
      };
    });
}

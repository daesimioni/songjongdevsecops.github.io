// Unidades lógicas em pixels; posições de instância continuam em tiles.
export function box(
  x,
  y,
  z,
  w,
  d,
  h,
  material = "wood",
  solid = true,
  detail = "plain",
) {
  return { kind: "box", x, y, z, w, d, h, material, solid, detail };
}
export function ball(x, y, z, w, d, h, material = "leaf", solid = false) {
  return { kind: "ball", x, y, z, w, d, h, material, solid };
}
export function roof(x, y, z, w, d, h, material = "tile") {
  return { kind: "roof", x, y, z, w, d, h, material, solid: false };
}
export function pole(x, y, z, h, material = "wood", solid = true) {
  return box(x, y, z, 2, 2, h, material, solid);
}
export function entry(slug, name, parts, options = {}) {
  return {
    slug,
    name,
    parts,
    tags: [],
    frames: 1,
    ms: 160,
    orientations: [0, 1, 2, 3],
    ...options,
  };
}
export function slab(material, w = 16, d = 16, h = 2) {
  return [box(0, -d / 2, 0, w, d, h, material, false)];
}
export function legs(w, d, h, material = "wood") {
  return [-1, 1].flatMap((x) =>
    [-1, 1].map((y) =>
      box(x * (w / 2 - 1), -d / 2 + y * (d / 2 - 1), 0, 2, 2, h, material),
    ),
  );
}
export function table(w = 20, d = 12, h = 12, material = "wood") {
  return [
    ...legs(w, d, h - 2, material),
    box(0, -d / 2, h - 2, w, d, 2, material, true, "boards"),
  ];
}
export function tree(trunkHeight = 18, crown = 22, material = "leaf") {
  return [
    box(0, -2, 0, 4, 4, trunkHeight, "bark"),
    ball(0, -3, trunkHeight - 4, crown, crown * 0.65, crown * 0.7, material),
    ball(
      -3,
      -4,
      trunkHeight + crown * 0.25,
      crown * 0.7,
      crown * 0.5,
      crown * 0.4,
      material,
    ),
  ];
}

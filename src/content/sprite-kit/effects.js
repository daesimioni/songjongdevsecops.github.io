import { directionVector } from "../../core/movement.js";
export const EFFECT_ELEMENTS = Object.freeze({
  fogo: {
    name: "Fogo",
    color: "#e77941",
    light: "#ffe8a3",
    dark: "#983f3c",
    particle: "flame",
  },
  gelo: {
    name: "Gelo",
    color: "#83c8db",
    light: "#e2f6e5",
    dark: "#4b699e",
    particle: "shard",
  },
  morte: {
    name: "Morte",
    color: "#9a78bd",
    light: "#d8d4b3",
    dark: "#463f67",
    particle: "skull",
  },
  terra: {
    name: "Terra",
    color: "#9d825a",
    light: "#d5b681",
    dark: "#5b594c",
    particle: "rock",
  },
  energia: {
    name: "Energia",
    color: "#83afd8",
    light: "#f2eab5",
    dark: "#525d9d",
    particle: "spark",
  },
  fisico: {
    name: "Físico",
    color: "#b7bdc7",
    light: "#fbf0d0",
    dark: "#586778",
    particle: "slash",
  },
  agua: {
    name: "Água",
    color: "#54a6b9",
    light: "#caf0e4",
    dark: "#3b618d",
    particle: "drop",
  },
  vento: {
    name: "Vento",
    color: "#9ebfad",
    light: "#e7efe0",
    dark: "#607c8e",
    particle: "curl",
  },
  veneno: {
    name: "Veneno",
    color: "#8eb45f",
    light: "#d4eaa0",
    dark: "#576646",
    particle: "bubble",
  },
  luz: {
    name: "Luz",
    color: "#d9b66f",
    light: "#fff3c7",
    dark: "#a27656",
    particle: "star",
  },
  arcano: {
    name: "Arcano",
    color: "#ba88be",
    light: "#e8cbdf",
    dark: "#675485",
    particle: "rune",
  },
});
const forms = [
  ["projetil", "Projétil", "projectile"],
  ["impacto", "Impacto", "circle"],
  ["raio", "Raio linear", "line"],
  ["cone", "Sopro em cone", "cone"],
  ["anel", "Anel expansivo", "ring"],
  ["campo", "Campo persistente", "circle"],
  ["coluna", "Coluna vertical", "circle"],
  ["corte", "Corte em arco", "cone"],
  ["aviso", "Área de antecipação", "circle"],
  ["rastro", "Rastro", "line"],
  ["erupcao", "Erupção", "circle"],
  ["explosao", "Explosão", "circle"],
];
export const effects = Object.entries(EFFECT_ELEMENTS).flatMap(
  ([element, palette]) =>
    forms.map(([slug, name, shape]) => ({
      slug: `${element}-${slug}`,
      name: `${name} de ${palette.name.toLowerCase()}`,
      renderer: "effect",
      element,
      form: slug,
      parts: [],
      tags: ["ataque", element, name, shape],
      frames: 8,
      ms: 80,
      loop: ["campo", "aviso", "rastro"].includes(slug),
      orientations: [
        "impacto",
        "anel",
        "campo",
        "coluna",
        "aviso",
        "erupcao",
        "explosao",
      ].includes(slug)
        ? [0]
        : [0, 1, 2, 3, 4, 5, 6, 7],
      layer: ["campo", "aviso", "anel", "rastro"].includes(slug)
        ? "ground"
        : "effect",
      bounds: { x: -70, y: -94, w: 140, h: 166 },
      area: { shape, radius: 24, range: 48, width: 10, halfAngle: Math.PI / 5 },
    })),
);
// Área puramente descritiva para reutilização futura; não aplica dano nem muda o mapa.
export function effectAreaContains(def, dx, dy, direction = 0) {
  if (!def?.area || ![dx, dy].every(Number.isFinite)) return false;
  if (!Number.isInteger(direction) || direction < 0 || direction > 7)
    throw new Error(`Orientação inválida: ${direction}`);
  const { shape, radius, range, width, halfAngle } = def.area;
  const f = directionVector(direction);
  const along = dx * f.x + dy * f.y,
    across = dx * f.y - dy * f.x,
    distance = Math.hypot(dx, dy);
  if (shape === "ring") return distance <= radius && distance >= radius - width;
  if (shape === "line" || shape === "projectile")
    return along >= 0 && along <= range && Math.abs(across) <= width / 2;
  if (shape === "cone")
    return (
      distance <= range &&
      along >= 0 &&
      Math.abs(Math.atan2(across, along)) <= halfAngle
    );
  return distance <= radius;
}
export const weather = [
  ["chuva", "Chuva", "rain"],
  ["temporal", "Temporal", "storm"],
  ["neve", "Neve", "snow"],
  ["granizo", "Granizo", "hail"],
  ["vento", "Rajadas de vento", "wind"],
  ["folhas", "Folhas ao vento", "leaves"],
  ["petalas", "Pétalas", "petals"],
  ["poeira", "Tempestade de areia", "dust"],
  ["nevoeiro", "Nevoeiro", "fog"],
  ["eclipse", "Eclipse solar", "eclipse"],
  ["aurora", "Aurora", "aurora"],
  ["meteoros", "Chuva de meteoros", "meteor"],
  ["raios", "Relâmpagos", "lightning"],
  ["arco-iris", "Arco-íris", "rainbow"],
  ["vagalumes", "Vagalumes", "fireflies"],
  ["cinzas", "Cinzas vulcânicas", "ash"],
  ["nuvens", "Nuvens", "cloud"],
  ["sol", "Raios de sol", "sun"],
].map(([slug, name, phenomenon]) => ({
  slug,
  name,
  renderer: "weather",
  phenomenon,
  parts: [],
  tags: ["clima", "evento", phenomenon],
  frames: ["rainbow", "sun"].includes(phenomenon) ? 1 : 16,
  ms: 120,
  loop: true,
  orientations: [0],
  layer: "atmosphere",
  bounds: { x: -72, y: -104, w: 144, h: 144 },
}));

Object.values(EFFECT_ELEMENTS).forEach(Object.freeze);

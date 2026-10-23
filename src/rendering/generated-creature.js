const WOLF_ATLAS = Object.freeze({
  idle: new URL("../../assets/creatures/wolf/idle.png", import.meta.url),
  walk: new URL("../../assets/creatures/wolf/walk.png", import.meta.url),
  attack: new URL("../../assets/creatures/wolf/attack.png", import.meta.url),
  hit: new URL("../../assets/creatures/wolf/hit.png", import.meta.url),
  death: new URL("../../assets/creatures/wolf/death.png", import.meta.url),
});

// Atlas autoral: oito vistas verdadeiras e cinco estados de combate.
const COLUMNS = 8;
const ROWS = Object.freeze({ idle: 0, walk: 1, attack: 2, hit: 3, death: 4 });
const atlases = new Map();

function getAtlas(state) {
  if (!atlases.has(state) && typeof Image !== "undefined") {
    const image = new Image();
    image.src = (WOLF_ATLAS[state] || WOLF_ATLAS.idle).href;
    atlases.set(state, image);
  }
  const image = atlases.get(state);
  return image?.complete && image.naturalWidth ? image : null;
}

export function hasGeneratedCreature(kind) { return kind === "wolf" || kind === "lobo"; }

export function drawGeneratedCreature(ctx, kind, time = 0, scale = 1, direction = 0, moving = false, state = moving ? "walk" : "idle") {
  if (!hasGeneratedCreature(kind)) return false;
  const image = getAtlas(state);
  if (!image) return false;
  const row = ((Math.round(direction) % COLUMNS) + COLUMNS) % COLUMNS;
  const frame = Math.floor(Math.max(0, time) / 100) % COLUMNS;
  const cell = 128;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.scale(scale, scale);
  ctx.drawImage(image, frame * cell, row * cell, cell, cell, -64, -108, cell, cell);
  ctx.restore();
  return true;
}

export const GENERATED_CREATURE_ATLAS = Object.freeze({
  wolf: { source: "assets/creatures/wolf/{idle,walk,attack,hit,death}.png", grid: "8x8 per state", directions: 8, states: Object.keys(ROWS), framesPerState: 8, frameMs: 100, anchor: [64, 108], collision: { x: -22, y: -10, w: 44, h: 20 } },
});

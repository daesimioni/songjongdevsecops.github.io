const WOLF_ATLAS = new URL("../../assets/creatures/wolf-atlas.png", import.meta.url);

// Atlas autoral: oito vistas verdadeiras e cinco estados de combate.
const COLUMNS = 8;
const ROWS = Object.freeze({ idle: 0, walk: 1, attack: 2, hit: 3, death: 4 });
let atlas;

function getAtlas() {
  if (!atlas && typeof Image !== "undefined") {
    atlas = new Image();
    atlas.src = WOLF_ATLAS.href;
  }
  return atlas?.complete && atlas.naturalWidth ? atlas : null;
}

export function hasGeneratedCreature(kind) { return kind === "wolf" || kind === "lobo"; }

export function drawGeneratedCreature(ctx, kind, time = 0, scale = 1, direction = 0, moving = false, state = moving ? "walk" : "idle") {
  if (!hasGeneratedCreature(kind)) return false;
  void time;
  const image = getAtlas();
  if (!image) return false;
  const row = ROWS[state] ?? ROWS.idle;
  const column = ((Math.round(direction) % COLUMNS) + COLUMNS) % COLUMNS;
  const cell = 128;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.scale(scale, scale);
  ctx.drawImage(image, column * cell, row * cell, cell, cell, -64, -108, cell, cell);
  ctx.restore();
  return true;
}

export const GENERATED_CREATURE_ATLAS = Object.freeze({
  wolf: { source: "assets/creatures/wolf-atlas.png", grid: "8x5", directions: 8, states: Object.keys(ROWS), framesPerState: 8, frameMs: 100, anchor: [64, 108], collision: { x: -22, y: -10, w: 44, h: 20 } },
});

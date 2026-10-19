import {
  MAP_W, MAP_H, TILE, TILE_KIND as K, SOLID, CONTINENTS, SITES,
  WAYSTONES, NPC_SPAWNS, CAT_SPAWN, REVEAL_RADIUS,
} from "./config.js";

const { WATER, SAND, GRASS, PATH, TREE, FLOWER, BRIDGE, PLAZA } = K;

function mulberry32(seed) {
  let a = seed >>> 0;
  return function () {
    a |= 0; a = (a + 0x6D2B79F5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function hash2(x, y) {
  let h = (x * 374761393 + y * 668265263) ^ 0x5bf03635;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

export function createWorld() {
  const rand = mulberry32(20261019);
  const tiles = new Uint8Array(MAP_W * MAP_H).fill(WATER);
  const decor = [];
  const at = (x, y) => y * MAP_W + x;
  const set = (x, y, v) => {
    if (x >= 0 && y >= 0 && x < MAP_W && y < MAP_H) tiles[at(x, y)] = v;
  };
  const get = (x, y) => {
    if (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H) return WATER;
    return tiles[at(x, y)];
  };
  const rect = (x, y, w, h, v) => {
    for (let yy = y; yy < y + h; yy++) {
      for (let xx = x; xx < x + w; xx++) set(xx, yy, v);
    }
  };

  function continentAtTile(tx, ty) {
    for (const c of Object.values(CONTINENTS)) {
      const r = c.rect;
      if (tx >= r.x && tx < r.x + r.w && ty >= r.y && ty < r.y + r.h) return c.id;
    }
    return null;
  }
  function continentAt(x, y) { return continentAtTile(Math.floor(x), Math.floor(y)); }

  // 1. massas de terra com costa irregular
  for (const c of Object.values(CONTINENTS)) {
    const { cx, cy, rx, ry } = c.land;
    const r = c.rect;
    for (let y = Math.max(1, r.y); y < Math.min(MAP_H - 1, r.y + r.h); y++) {
      for (let x = Math.max(1, r.x); x < Math.min(MAP_W - 1, r.x + r.w); x++) {
        const nx = (x + 0.5 - cx) / rx;
        const ny = (y + 0.5 - cy) / ry;
        const d = Math.pow(Math.abs(nx), 4) + Math.pow(Math.abs(ny), 4);
        const edge = 1 + (hash2(x * 3 + 11, y * 5 + 7) - 0.5) * 0.22;
        if (d < edge) set(x, y, c.base);
      }
    }
  }

  // 2. praias: terra encostada na água vira areia
  const landCopy = tiles.slice();
  const isLandTile = (x, y) => {
    const t = landCopy[at(x, y)];
    return t !== WATER && t !== BRIDGE;
  };
  for (let y = 1; y < MAP_H - 1; y++) {
    for (let x = 1; x < MAP_W - 1; x++) {
      if (!isLandTile(x, y)) continue;
      if (!isLandTile(x + 1, y) || !isLandTile(x - 1, y) ||
          !isLandTile(x, y + 1) || !isLandTile(x, y - 1)) {
        const t = get(x, y);
        if (t !== PATH && t !== BRIDGE) set(x, y, SAND);
      }
    }
  }

  // 3. clareiras das estações
  for (const site of SITES) {
    const c = CONTINENTS[site.continent];
    rect(Math.round(site.x) - 4, Math.round(site.y) - 4, 9, 9, c.floor);
  }

  // 4. caminhos internos: da pedra do porto até cada estação
  function hpath(y, x0, x1, tile) {
    const a = Math.min(x0, x1), b = Math.max(x0, x1);
    for (let x = a; x <= b; x++) {
      set(x, y, tile); set(x, y + 1, tile);
    }
  }
  function vpath(x, y0, y1, tile) {
    const a = Math.min(y0, y1), b = Math.max(y0, y1);
    for (let y = a; y <= b; y++) {
      set(x, y, tile); set(x + 1, y, tile);
    }
  }
  function connect(a, b, tile) {
    if (Math.abs(b.x - a.x) > Math.abs(b.y - a.y)) {
      hpath(Math.round(a.y), Math.round(a.x), Math.round(b.x), tile);
      vpath(Math.round(b.x), Math.round(a.y), Math.round(b.y), tile);
    } else {
      vpath(Math.round(a.x), Math.round(a.y), Math.round(b.y), tile);
      hpath(Math.round(b.y), Math.round(a.x), Math.round(b.x), tile);
    }
  }

  for (const stone of WAYSTONES) {
    const c = CONTINENTS[stone.continent];
    for (const site of SITES.filter((s) => s.continent === stone.continent)) {
      connect(stone, site, c.path);
    }
  }

  // ligações das pedras do porto com as pontes
  hpath(28, 90, 96, CONTINENTS.cs.path);
  vpath(90, 29, 33, CONTINENTS.cs.path);
  hpath(89, 90, 96, CONTINENTS.physics.path);
  vpath(142, 63, 65, CONTINENTS.math.path);
  hpath(64, 38, 44, CONTINENTS.chem.path);
  hpath(32, 58, 60, CONTINENTS.music.path);
  vpath(60, 33, 37, CONTINENTS.music.path);
  hpath(32, 120, 122, CONTINENTS.ai.path);
  vpath(120, 33, 37, CONTINENTS.ai.path);

  function bridgeLine(x0, y0, x1, y1, width, tile) {
    const steps = Math.max(Math.abs(x1 - x0), Math.abs(y1 - y0));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps;
      const x = Math.round(x0 + (x1 - x0) * t);
      const y = Math.round(y0 + (y1 - y0) * t);
      rect(x - 1, y - 1, width, width, tile);
    }
  }

  // pontes cardeais
  rect(89, 30, 4, 19, BRIDGE);
  rect(89, 72, 4, 19, BRIDGE);
  rect(107, 63, 36, 4, BRIDGE);
  rect(42, 63, 32, 4, BRIDGE);
  // pontes diagonais
  bridgeLine(78, 49, 60, 36, 3, BRIDGE);
  bridgeLine(102, 49, 120, 36, 3, BRIDGE);
  // encontros de ponte com terra
  rect(88, 30, 5, 4, CONTINENTS.cs.path);
  rect(88, 88, 5, 4, CONTINENTS.physics.path);
  rect(140, 62, 4, 5, CONTINENTS.math.path);
  rect(40, 62, 4, 5, CONTINENTS.chem.path);
  rect(58, 33, 4, 4, CONTINENTS.music.path);
  rect(120, 33, 4, 4, CONTINENTS.ai.path);
  rect(88, 46, 5, 4, CONTINENTS.hub.floor);
  rect(88, 71, 5, 4, CONTINENTS.hub.floor);
  rect(105, 62, 4, 5, CONTINENTS.hub.floor);
  rect(72, 62, 4, 5, CONTINENTS.hub.floor);
  rect(76, 47, 4, 4, CONTINENTS.hub.floor);
  rect(101, 47, 4, 4, CONTINENTS.hub.floor);

  // 6. praça e caminhos do porto
  rect(82, 54, 18, 13, PLAZA);
  rect(87, 58, 12, 8, PLAZA);
  hpath(60, 90, 98, PATH);
  hpath(64, 84, 98, PATH);
  vpath(90, 48, 60, PATH);
  vpath(90, 60, 72, PATH);
  vpath(98, 60, 64, PATH);
  hpath(64, 99, 107, PATH);
  hpath(64, 73, 82, PATH);
  vpath(78, 49, 54, PATH);
  vpath(102, 49, 54, PATH);
  set(90, 60, PLAZA);
  set(91, 61, PATH);
  set(91, 62, PATH);
  set(98, 64, PLAZA);

  // 7. decoração
  const used = new Set();
  const key = (x, y) => `${x},${y}`;
  for (const site of SITES) used.add(key(Math.round(site.x), Math.round(site.y)));
  for (const stone of WAYSTONES) {
    for (let y = -1; y <= 1; y++) for (let x = -1; x <= 1; x++) {
      set(Math.round(stone.x) + x, Math.round(stone.y) + y, CONTINENTS[stone.continent].floor);
    }
    used.add(key(Math.round(stone.x), Math.round(stone.y)));
  }
  for (const n of NPC_SPAWNS) used.add(key(Math.round(n.x), Math.round(n.y)));

  const nearUsed = (x, y, r) => {
    for (const s of used) {
      const [ux, uy] = s.split(",").map(Number);
      if (Math.hypot(ux - x, uy - y) < r) return true;
    }
    return false;
  };

  const decoFor = {
    hub: ["tree", "tree", "flower", "bench", "lamp", "star"],
    cs: ["terminal", "node", "lamp", "terminal", "crystal"],
    math: ["pillar", "book", "star", "pillar", "lamp"],
    physics: ["crystal", "orb", "lamp", "pillar", "star"],
    chem: ["mushroom", "flask", "bubble", "mushroom", "lamp"],
    music: ["note", "note", "speaker", "lamp", "star", "wave"],
    ai: ["node", "terminal", "orb", "lamp", "synapse", "star"],
  };

  for (let y = 2; y < MAP_H - 2; y++) {
    for (let x = 2; x < MAP_W - 2; x++) {
      const t = get(x, y);
      if (![GRASS, K.CIRCUIT, K.GOLD, K.BASALT, K.MOSS, K.SONIC, K.NEURAL, SAND, FLOWER].includes(t)) continue;
      if (nearUsed(x + 0.5, y + 0.5, 2.4)) continue;
      if (hash2(x, y) > 0.055) continue;
      const c = continentAtTile(x, y);
      if (!c) continue;
      const kinds = decoFor[c];
      const kind = kinds[Math.floor(hash2(x * 7, y * 11) * kinds.length)];
      if (kind === "tree") {
        if (t === SAND) continue;
        set(x, y, TREE);
        continue;
      }
      if (kind === "flower") {
        if (t !== GRASS) continue;
        set(x, y, FLOWER);
        continue;
      }
      decor.push({ type: kind, x: x + 0.5, y: y + 0.5, accent: CONTINENTS[c].accent, hue: hash2(x, y) });
    }
  }

  // lâmpadas nas esquinas de cada estação
  for (const site of SITES) {
    const c = CONTINENTS[site.continent];
    for (const [dx, dy] of [[-3, -3], [3, -3], [-3, 3], [3, 3]]) {
      decor.push({ type: "lamp", x: site.x + dx, y: site.y + dy, accent: c.accent });
    }
  }

  // placas nas docas
  for (const stone of WAYSTONES) {
    if (stone.continent === "hub") continue;
    decor.push({
      type: "sign", x: stone.x + 2.4, y: stone.y + 1.2,
      text: CONTINENTS[stone.continent].name, accent: CONTINENTS[stone.continent].accent,
    });
  }

  // ilhas solitárias no oceano
  const islands = [[10, 10], [170, 10], [10, 110], [170, 110]];
  for (const [ix, iy] of islands) {
    for (let y = -1; y <= 1; y++) for (let x = -1; x <= 1; x++) {
      set(ix + x, iy + y, SAND);
    }
    set(ix, iy, TREE);
    set(ix + 2, iy + 1, SAND);
  }

  // 8. estado de jogo
  const stations = SITES.map((s) => ({ ...s }));
  const waystones = WAYSTONES.map((w) => ({ ...w }));
  const npcs = NPC_SPAWNS.map((n) => ({ ...n, bob: rand() * Math.PI * 2 }));

  // névoa do minimapa
  const explored = new Uint8Array(MAP_W * MAP_H);
  let exploredVersion = 0;
  function markExplored(cx, cy, radius = REVEAL_RADIUS) {
    const x0 = Math.max(0, Math.floor(cx - radius));
    const x1 = Math.min(MAP_W - 1, Math.ceil(cx + radius));
    const y0 = Math.max(0, Math.floor(cy - radius));
    const y1 = Math.min(MAP_H - 1, Math.ceil(cy + radius));
    let changed = false;
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        if (Math.hypot(x + 0.5 - cx, y + 0.5 - cy) > radius) continue;
        const i = at(x, y);
        if (!explored[i]) { explored[i] = 1; changed = true; }
      }
    }
    if (changed) exploredVersion++;
    return changed;
  }
  function isExplored(tx, ty) {
    if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return false;
    return explored[at(tx, ty)] === 1;
  }
  function setExplored(bytes) {
    if (!bytes || bytes.length !== explored.length) return;
    explored.set(bytes);
    exploredVersion++;
  }

  function isSolidTile(tx, ty) { return SOLID.has(get(tx, ty)); }
  function boxCollides(x, y, w, h) {
    const x0 = Math.floor(x - w / 2);
    const x1 = Math.floor(x + w / 2 - 0.001);
    const y0 = Math.floor(y - h / 2);
    const y1 = Math.floor(y + h / 2 - 0.001);
    for (let ty = y0; ty <= y1; ty++) {
      for (let tx = x0; tx <= x1; tx++) {
        if (isSolidTile(tx, ty)) return true;
      }
    }
    return false;
  }

  return {
    tiles, decor, stations, waystones, npcs,
    cat: { ...CAT_SPAWN, facing: 1, t: 0, moving: false },
    get, set, isSolidTile, boxCollides,
    continentAt, continentAtTile,
    markExplored, isExplored, setExplored,
    get exploredVersion() { return exploredVersion; },
    get exploredBytes() { return explored; },
  };
}

export { hash2, mulberry32 };

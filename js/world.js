import {
  MAP_W, MAP_H, TILE, TILE_KIND as K, SOLID, ZONES, STATIONS,
  NPC_SPAWNS, CAT_SPAWN,
} from "./config.js";

const { GRASS, PATH, STONE, WATER, TREE, WALL, FLOWER, SAND,
  LOGIC, MOSS, STAR, CRYSTAL, VOID } = K;

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
  const tiles = new Uint8Array(MAP_W * MAP_H).fill(GRASS);
  const decor = [];
  const at = (x, y) => y * MAP_W + x;
  const set = (x, y, v) => {
    if (x >= 0 && y >= 0 && x < MAP_W && y < MAP_H) tiles[at(x, y)] = v;
  };
  const get = (x, y) => {
    if (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H) return VOID;
    return tiles[at(x, y)];
  };
  const rect = (x, y, w, h, v) => {
    for (let yy = y; yy < y + h; yy++) for (let xx = x; xx < x + w; xx++) set(xx, yy, v);
  };
  const hpath = (y, x0, x1) => rect(x0, y, x1 - x0 + 1, 2, PATH);
  const vpath = (x, y0, y1) => rect(x, y0, 2, y1 - y0 + 1, PATH);

  // borda do mundo
  rect(0, 0, MAP_W, 2, VOID);
  rect(0, MAP_H - 2, MAP_W, 2, VOID);
  rect(0, 0, 2, MAP_H, VOID);
  rect(MAP_W - 2, 0, 2, MAP_H, VOID);

  // chão das regiões
  rect(17, 13, 14, 10, STONE);
  rect(3, 3, 12, 9, LOGIC);
  rect(3, 24, 13, 9, MOSS);
  rect(33, 3, 12, 9, STAR);
  rect(33, 24, 12, 9, CRYSTAL);

  // lago e areia
  for (let y = 25; y <= 33; y++) {
    for (let x = 20; x <= 31; x++) {
      const dx = (x - 25.5) / 5.4;
      const dy = (y - 29) / 3.6;
      const d = dx * dx + dy * dy;
      if (d < 1) set(x, y, WATER);
      else if (d < 1.35) set(x, y, SAND);
    }
  }

  // caminhos principais
  vpath(8, 11, 19);
  hpath(18, 8, 17);
  vpath(18, 22, 28);
  hpath(28, 9, 19);
  vpath(24, 8, 12);
  hpath(8, 24, 39);
  hpath(20, 30, 36);
  vpath(36, 20, 29);
  hpath(28, 33, 39);

  // ruínas do observatório
  for (const [x, y] of [[34, 4], [43, 4], [34, 10], [43, 10]]) set(x, y, WALL);

  const zoneRects = Object.values(ZONES).map((z) => z.rect);
  const walkableFloor = new Set([GRASS, FLOWER, PATH, STONE, LOGIC, MOSS, STAR, CRYSTAL, SAND]);
  const nearPath = (x, y) => {
    for (let yy = y - 1; yy <= y + 1; yy++) {
      for (let xx = x - 1; xx <= x + 1; xx++) {
        if (get(xx, yy) === PATH) return true;
      }
    }
    return false;
  };
  const nearStation = (x, y, r) => STATIONS.some((s) =>
    Math.hypot((s.x + 0.5) - (x + 0.5), (s.y + 0.5) - (y + 0.5)) < r);
  const nearNpc = (x, y, r) => NPC_SPAWNS.some((n) =>
    Math.hypot(n.x - (x + 0.5), n.y - (y + 0.5)) < r);

  const inZone = (x, y, zone) => {
    const r = zone.rect;
    return x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h;
  };

  // árvores: densas no bosque, esparsas no resto
  for (let y = 2; y < MAP_H - 2; y++) {
    for (let x = 2; x < MAP_W - 2; x++) {
      const t = get(x, y);
      if (!walkableFloor.has(t)) continue;
      if (nearPath(x, y) || nearStation(x, y, 2.6) || nearNpc(x, y, 2.2)) continue;
      if (inZone(x, y, ZONES.plaza)) continue;
      if (inZone(x, y, ZONES.logic) || inZone(x, y, ZONES.observatory) ||
          inZone(x, y, ZONES.rift)) {
        if (rand() < 0.035) set(x, y, TREE);
        continue;
      }
      const forest = inZone(x, y, ZONES.fractal);
      const border = x < 5 || x > MAP_W - 6 || y < 5 || y > MAP_H - 6;
      const chance = forest ? 0.16 : border ? 0.14 : 0.035;
      if (rand() < chance) set(x, y, TREE);
    }
  }

  // flores espalhadas
  for (let y = 2; y < MAP_H - 2; y++) {
    for (let x = 2; x < MAP_W - 2; x++) {
      if (get(x, y) !== GRASS) continue;
      if (nearPath(x, y) || nearStation(x, y, 2.2)) continue;
      if (rand() < 0.045) set(x, y, FLOWER);
    }
  }

  // decoração fixa
  const lamps = [
    [18.2, 14.2], [29.8, 14.2], [18.2, 21.8], [29.8, 21.8],
    [8.8, 13.6], [24.8, 10.4], [36.8, 18.8], [9.0, 27.4],
  ];
  for (const [x, y] of lamps) decor.push({ type: "lamp", x, y });

  const signs = [
    { type: "sign", x: 8.5, y: 12.2, text: "VALE DA LÓGICA", accent: "#61f4c0" },
    { type: "sign", x: 19.2, y: 23.2, text: "BOSQUE DOS FRACTAIS", accent: "#6bd5ff" },
    { type: "sign", x: 32.6, y: 8.6, text: "OBSERVATÓRIO", accent: "#b48cff" },
    { type: "sign", x: 32.6, y: 29.2, text: "FENDA 3D", accent: "#ff7aa8" },
  ];
  decor.push(...signs);
  decor.push(
    { type: "bench", x: 20.2, y: 16.4 },
    { type: "bench", x: 27.8, y: 16.4 },
    { type: "bench", x: 27.6, y: 20.4 },
  );

  // detalhes por região
  for (let i = 0; i < 26; i++) {
    const x = 3 + rand() * 13, y = 24 + rand() * 9;
    if (!isSolidTileWorld(get, x, y)) decor.push({ type: "mushroom", x, y, hue: rand() });
  }
  for (let i = 0; i < 22; i++) {
    const x = 33 + rand() * 12, y = 24 + rand() * 9;
    if (!isSolidTileWorld(get, x, y)) decor.push({ type: "shard", x, y, hue: rand() });
  }
  for (let i = 0; i < 20; i++) {
    const x = 33 + rand() * 12, y = 3 + rand() * 9;
    if (!isSolidTileWorld(get, x, y)) decor.push({ type: "star", x, y, hue: rand() });
  }
  for (let i = 0; i < 22; i++) {
    const x = 3 + rand() * 12, y = 3 + rand() * 9;
    if (!isSolidTileWorld(get, x, y)) decor.push({ type: "node", x, y, hue: rand() });
  }
  for (let i = 0; i < 16; i++) {
    const x = 17 + rand() * 14, y = 13 + rand() * 10;
    if (get(Math.floor(x), Math.floor(y)) === STONE) {
      decor.push({ type: "petal", x, y, hue: rand() });
    }
  }

  const stations = STATIONS.map((s) => ({ ...s }));
  const npcs = NPC_SPAWNS.map((n) => ({ ...n, bob: rand() * Math.PI * 2 }));

  // névoa do minimapa: começa tudo escuro e vai revelando em volta do passo
  const explored = new Uint8Array(MAP_W * MAP_H);
  let exploredVersion = 0;
  function markExplored(cx, cy, radius) {
    const r = Math.ceil(radius);
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

  function isSolidTile(tx, ty) {
    return SOLID.has(get(tx, ty));
  }

  function isSolidTileWorld(getter, x, y) {
    return isSolidTile(Math.floor(x), Math.floor(y));
  }

  function boxCollides(x, y, w, h) {
    // x, y, w, h em tiles
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

  function zoneAt(x, y) {
    for (const zone of Object.values(ZONES)) {
      const r = zone.rect;
      if (x >= r.x && x < r.x + r.w && y >= r.y && y < r.y + r.h) return zone.id;
    }
    return null;
  }

  return {
    tiles, decor, stations, npcs,
    cat: { ...CAT_SPAWN, x: CAT_SPAWN.x, y: CAT_SPAWN.y, facing: 1, t: 0 },
    get, set, isSolidTile, boxCollides, zoneAt,
    markExplored, isExplored, setExplored,
    get exploredVersion() { return exploredVersion; },
    get exploredBytes() { return explored; },
  };
}

export { hash2, mulberry32 };

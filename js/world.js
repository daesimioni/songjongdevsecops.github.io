import {
  MAP_W, MAP_H, TILE, TILE_KIND as K, SOLID, CONTINENTS, AREAS, SITES,
  WAYSTONES, NPC_SPAWNS, CAT_SPAWN, REVEAL_RADIUS, PLAYER_W, PLAYER_H,
} from "./config.js";
import { GROUNDS } from "./rpg-data.js";
import { dungeonById } from "./dungeon-data.js";

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
  const props = [];
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

  function areaAtTile(tx, ty) {
    for (const a of AREAS) {
      const r = a.rect;
      if (tx >= r.x && tx < r.x + r.w && ty >= r.y && ty < r.y + r.h) return a;
    }
    return null;
  }
  function areaAt(x, y) { return areaAtTile(Math.floor(x), Math.floor(y)); }

  function continentAtTile(tx, ty) {
    for (const c of Object.values(CONTINENTS)) {
      const r = c.rect;
      if (tx >= r.x && tx < r.x + r.w && ty >= r.y && ty < r.y + r.h) return c.id;
    }
    for (const a of AREAS) {
      const r = a.rect;
      if (tx >= r.x && tx < r.x + r.w && ty >= r.y && ty < r.y + r.h) return a.continent;
    }
    return null;
  }
  function continentAt(x, y) { return continentAtTile(Math.floor(x), Math.floor(y)); }

  // 1. massas de terra com costa irregular (continentes e áreas temáticas)
  for (const c of [...Object.values(CONTINENTS), ...AREAS]) {
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
    const c = areaAtTile(Math.round(site.x), Math.round(site.y)) || CONTINENTS[site.continent];
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
    const area = areaAtTile(stone.x, stone.y);
    const c = area || CONTINENTS[stone.continent];
    // a pedra de uma área só liga às estações daquela área: o resto fica do
    // outro lado da água, e caminho não atravessa mar.
    for (const site of SITES.filter((s) => s.continent === stone.continent && areaAtTile(s.x, s.y) === area)) {
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
  // anel externo: dá para ir de uma ilha à outra sem passar pelo centro
  bridgeLine(35, 35, 35, 42, 3, BRIDGE); // esquerda e noroeste
  bridgeLine(61, 21, 66, 21, 3, BRIDGE); // noroeste e norte
  bridgeLine(114, 20, 118, 20, 3, BRIDGE); // norte e nordeste
  bridgeLine(146, 35, 146, 42, 3, BRIDGE); // nordeste e direita
  bridgeLine(138, 81, 112, 92, 3, BRIDGE); // direita e sul
  bridgeLine(66, 94, 40, 83, 3, BRIDGE); // sul e esquerda
  bridgeLine(43, 108, 74, 112, 3, BRIDGE); // sul e vale da língua
  bridgeLine(112, 104, 136, 104, 3, BRIDGE); // física e eletromagnetismo
  bridgeLine(154, 22, 180, 22, 3, BRIDGE); // nordeste e arquitetura
  bridgeLine(174, 74, 204, 74, 3, BRIDGE); // direita e análise
  bridgeLine(30, 113, 30, 124, 3, BRIDGE); // vale da língua e orgânica
  bridgeLine(59, 33, 59, 46, 3, BRIDGE); // música e acústica
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
  rect(41, 107, 4, 4, CONTINENTS.lingua.path);
  rect(73, 111, 4, 4, CONTINENTS.physics.path);
  rect(110, 103, 4, 4, CONTINENTS.physics.path);
  rect(134, 103, 4, 4, CONTINENTS.physics.path);
  rect(152, 21, 4, 4, CONTINENTS.ai.path);
  rect(178, 21, 4, 4, CONTINENTS.cs.path);
  rect(172, 73, 4, 4, CONTINENTS.math.path);
  rect(202, 73, 4, 4, CONTINENTS.math.path);
  rect(29, 111, 4, 4, CONTINENTS.lingua.path);
  rect(29, 123, 4, 4, CONTINENTS.chem.path);
  rect(58, 32, 4, 4, CONTINENTS.music.path);
  rect(58, 45, 4, 4, CONTINENTS.music.floor);
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
    lingua: ["tree", "book", "lamp", "book", "flower", "star"],
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

  // A superfície é sala de aula: sem bicho selvagem. Cada clareira vira uma
  // arena de treino com um instrutor, e o bicho de verdade mora na caverna.
  const hunters = GROUNDS.map((g) => {
    const accent = CONTINENTS[g.continent]?.accent || "#ffc857";
    return {
      id: g.id,
      continent: g.continent,
      name: g.name,
      center: g.center,
      accent,
      banner: { ...g.bannerPos, accent },
      loot: g.loot,
      bossLoot: g.bossLoot,
      dungeon: g.dungeon || `dungeon-${g.continent}`,
    };
  });
  const trainerNpcs = hunters.map((h) => ({
    id: `trainer-${h.id}`,
    continent: h.continent,
    x: h.center.x,
    y: h.center.y,
    accent: h.accent,
    trainer: true,
    ground: h,
    bob: rand() * Math.PI * 2,
  }));
  const npcs = [
    ...NPC_SPAWNS.map((n) => ({ ...n, bob: rand() * Math.PI * 2 })),
    ...trainerNpcs,
  ].map((n) => ({
    ...n,
    hx: n.x,
    hy: n.y,
    tx: n.x,
    ty: n.y,
    // cada um passeia perto do seu posto: guia no cais, instrutor na clareira
    wander: Number(n.wander) || (n.trainer ? 2.6 : n.continent === "hub" ? 3.2 : 4.6),
    speed: 0.34 + rand() * 0.22,
    waitUntil: rand() * 2600,
    facing: 0,
    moving: false,
  }));

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

  function npcFree(x, y) {
    return !boxCollides(x, y, 0.3, 0.24);
  }

  function pickNpcTarget(n) {
    for (let i = 0; i < 12; i++) {
      const a = rand() * Math.PI * 2;
      const r = 0.8 + rand() * n.wander;
      const tx = n.hx + Math.cos(a) * r;
      const ty = n.hy + Math.sin(a) * r;
      if (!npcFree(tx, ty)) continue;
      if (!npcFree((n.x + tx) / 2, (n.y + ty) / 2)) continue;
      n.tx = tx;
      n.ty = ty;
      return;
    }
    n.tx = n.hx;
    n.ty = n.hy;
  }

  function updateNpcs(dt, t) {
    for (const n of npcs) {
      if (t < n.waitUntil) {
        n.moving = false;
        continue;
      }
      const d = Math.hypot(n.tx - n.x, n.ty - n.y);
      if (d < 0.15) {
        n.moving = false;
        n.waitUntil = t + 1400 + rand() * 5200;
        pickNpcTarget(n);
        continue;
      }
      const step = Math.min(d, n.speed * dt);
      const nx = n.x + ((n.tx - n.x) / d) * step;
      const ny = n.y + ((n.ty - n.y) / d) * step;
      let moved = false;
      if (npcFree(nx, ny)) {
        n.x = nx;
        n.y = ny;
        moved = true;
      } else if (npcFree(nx, n.y)) {
        n.x = nx;
        moved = true;
      } else if (npcFree(n.x, ny)) {
        n.y = ny;
        moved = true;
      }
      if (!moved) {
        n.moving = false;
        n.waitUntil = t + 900 + rand() * 1400;
        continue;
      }
      // o passeio nunca perde o posto de vista
      if (Math.hypot(n.x - n.hx, n.y - n.hy) > n.wander + 0.4) {
        n.x = n.hx;
        n.y = n.hy;
        n.tx = n.hx;
        n.ty = n.hy;
      }
      n.moving = true;
      const dx = n.tx - n.x;
      const dy = n.ty - n.y;
      n.facing = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 2 : 1) : (dy > 0 ? 0 : 3);
    }
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
    const hw = w / 2;
    const hh = h / 2;
    for (const p of props) {
      if (p.active && !p.active()) continue;
      if (Math.abs(x - p.x) < hw + p.hw && Math.abs(y - p.y) < hh + p.hh) return true;
    }
    return false;
  }

  function addProp(x, y, hw, hh, active = null) {
    props.push({ x, y, hw, hh, active });
  }

  const monsters = [];

  // coisas que ocupam espaço no chão. Monstros e chefes são dinâmicos: a
  // colisão some quando eles caem e volta quando renascem.
  for (const s of stations) {
    const fountain = s.icon === "fountain";
    addProp(s.x, s.y, fountain ? 0.9 : 0.7, fountain ? 0.5 : 0.45);
  }
  for (const w of waystones) addProp(w.x, w.y, 0.45, 0.3);
  const decorSize = {
    lamp: [0.12, 0.12], sign: [0.3, 0.12], bench: [0.55, 0.18],
    terminal: [0.35, 0.25], pillar: [0.3, 0.25], book: [0.2, 0.15],
    orb: [0.2, 0.2], crystal: [0.25, 0.25], flask: [0.2, 0.2],
    speaker: [0.22, 0.2],
  };
  for (const d of decor) {
    const size = decorSize[d.type];
    if (size) addProp(d.x, d.y, size[0], size[1]);
  }

  // Duas bocas por continente, ligadas pelo túnel do subsolo: descer numa e
  // subir pela escada do fundo leva à outra. A saída (abaixo da boca) precisa
  // caber o corpo inteiro.
  const caves = [];
  for (const h of hunters) {
    const def = dungeonById(h.dungeon);
    const base = def?.rooms?.[0]?.name || `Caverna de ${CONTINENTS[h.continent]?.name || ""}`;
    const freeSpot = (cx, cy) =>
      !boxCollides(cx, cy, 1.9, 1.0) &&
      !boxCollides(cx, cy + 0.9, PLAYER_W, PLAYER_H) &&
      !boxCollides(cx, cy + 1.5, PLAYER_W, PLAYER_H) &&
      !boxCollides(cx, cy + 1.7, PLAYER_W, PLAYER_H);
    const pick = (from, to, minFromCenter, avoid = null) => {
      for (let r = from; r <= to; r++) {
        for (let dy = -r; dy <= r; dy++) {
          for (let dx = -r; dx <= r; dx++) {
            if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
            const cx = Math.round(h.center.x + dx);
            const cy = Math.round(h.center.y + dy);
            if (cx < 2 || cy < 2 || cx > MAP_W - 2 || cy > MAP_H - 2) continue;
            if (!freeSpot(cx, cy)) continue;
            if (Math.hypot(cx - h.center.x, cy - h.center.y) < minFromCenter) continue;
            if (Math.hypot(cx - h.banner.x, cy - h.banner.y) < 2.5) continue;
            if (caves.some((c) => Math.hypot(c.x - cx, c.y - cy) < 7)) continue;
            if (avoid && Math.hypot(avoid.x - cx, avoid.y - cy) < 7) continue;
            return { x: cx, y: cy };
          }
        }
      }
      return null;
    };
    const first = pick(4, 9, 3.2) || { x: h.center.x + 3, y: h.center.y + 3 };
    const second = pick(8, 14, 7.5, first) || { x: first.x + 7, y: first.y };
    const pair = [
      { mouth: "entrance", spot: first, name: base },
      { mouth: "far", spot: second, name: `${base} · outra boca` },
    ];
    const ids = pair.map((p, i) => `${def?.id || `dungeon-${h.continent}`}-${p.mouth}`);
    pair.forEach((p, i) => {
      caves.push({
        kind: "cave",
        id: ids[i],
        defId: def?.id || `dungeon-${h.continent}`,
        pairId: ids[1 - i],
        mouth: p.mouth,
        continent: h.continent,
        name: p.name,
        x: p.spot.x,
        y: p.spot.y,
        accent: h.accent,
        groundId: h.id,
        // onde o corpo reaparece quando sobe de volta
        exit: { x: p.spot.x, y: p.spot.y + 1.5 },
      });
    });
  }
  for (const c of caves) addProp(c.x, c.y, 0.78, 0.42);

  return {
    tiles, decor, props, stations, waystones, npcs, hunters, monsters, caves,
    cat: { ...CAT_SPAWN, facing: 1, t: 0, moving: false },
    get, set, isSolidTile, boxCollides, updateNpcs,
    continentAt, continentAtTile, areaAt, areaAtTile,
    markExplored, isExplored, setExplored,
    get exploredVersion() { return exploredVersion; },
    get exploredBytes() { return explored; },
  };
}

export { hash2, mulberry32 };

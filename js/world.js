import {
  MAP_W, MAP_H, TILE, TILE_KIND as K, SOLID, CONTINENTS, AREAS, SITES,
  WAYSTONES, NPC_SPAWNS, CAT_SPAWN, REVEAL_RADIUS, PLAYER_W, PLAYER_H,
} from "./config.js";
import { GROUNDS } from "./rpg-data.js";
import { dungeonById } from "./dungeon-data.js";
import { CATALOG_CONTENT } from "./catalog-gen.js";
import { CATALOG_BRIDGES, CATALOG_AREAS } from "./catalog-layout.js";
import { AREA_ITEMS, BIOMES, npcStyle } from "./identity.js";

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

  // índice de área por tile: com 86 áreas, varrer a lista em cada tile do mapa
  // custava segundos na montagem do mundo
  const areaGrid = new Uint8Array(MAP_W * MAP_H);
  for (let i = 0; i < AREAS.length; i++) {
    const r = AREAS[i].rect;
    for (let y = Math.max(0, r.y); y < Math.min(MAP_H, r.y + r.h); y++) {
      for (let x = Math.max(0, r.x); x < Math.min(MAP_W, r.x + r.w); x++) areaGrid[y * MAP_W + x] = i + 1;
    }
  }
  function areaAtTile(tx, ty) {
    if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) return null;
    const found = areaGrid[ty * MAP_W + tx];
    return found ? AREAS[found - 1] : null;
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

  // 3. clareiras das estações: a subárea tem praça menor, porque a ilha tem
  // várias estações e a clareira grande comeria o terreno todo
  for (const site of SITES) {
    const c = areaAtTile(Math.round(site.x), Math.round(site.y)) || CONTINENTS[site.continent];
    const raio = site.minor ? 1 : 4;
    rect(Math.round(site.x) - raio, Math.round(site.y) - raio, raio * 2 + 1, raio * 2 + 1, c.floor);
  }

  // 4. caminhos internos: da pedra do porto até cada estação
  function hpath(y, x0, x1, tile, largura = 2) {
    const a = Math.min(x0, x1), b = Math.max(x0, x1);
    for (let x = a; x <= b; x++) {
      for (let d = 0; d < largura; d++) set(x, y + d, tile);
    }
  }
  function vpath(x, y0, y1, tile, largura = 2) {
    const a = Math.min(y0, y1), b = Math.max(y0, y1);
    for (let y = a; y <= b; y++) {
      for (let d = 0; d < largura; d++) set(x + d, y, tile);
    }
  }
  function connect(a, b, tile, largura = 2) {
    if (Math.abs(b.x - a.x) > Math.abs(b.y - a.y)) {
      hpath(Math.round(a.y), Math.round(a.x), Math.round(b.x), tile, largura);
      vpath(Math.round(b.x), Math.round(a.y), Math.round(b.y), tile, largura);
    } else {
      vpath(Math.round(a.x), Math.round(a.y), Math.round(b.y), tile, largura);
      hpath(Math.round(b.y), Math.round(a.x), Math.round(b.x), tile, largura);
    }
  }

  for (const stone of WAYSTONES) {
    const area = areaAtTile(stone.x, stone.y);
    const c = area || CONTINENTS[stone.continent];
    // a pedra de uma área só liga às estações daquela área: o resto fica do
    // outro lado da água, e caminho não atravessa mar.
    for (const site of SITES.filter((s) => s.continent === stone.continent && areaAtTile(s.x, s.y) === area)) {
      connect(stone, site, c.path, site.minor ? 1 : 2);
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
  bridgeLine(154, 18, 162, 18, 3, BRIDGE); // nordeste e visão
  bridgeLine(31, 148, 31, 160, 3, BRIDGE); // orgânica e literatura
  bridgeLine(229, 20, 236, 20, 3, BRIDGE); // arquitetura e redes
  bridgeLine(106, 113, 106, 126, 3, BRIDGE); // física e termodinâmica
  bridgeLine(47, 138, 58, 138, 3, BRIDGE); // orgânica e analítica
  bridgeLine(256, 31, 256, 50, 3, BRIDGE); // redes e forma
  bridgeLine(247, 80, 260, 80, 3, BRIDGE); // análise e probabilidade
  bridgeLine(226, 88, 226, 126, 3, BRIDGE); // análise e linguagem
  bridgeLine(244, 135, 254, 135, 3, BRIDGE); // linguagem e semântica
  bridgeLine(74, 151, 78, 162, 3, BRIDGE); // analítica e óptica
  bridgeLine(226, 145, 226, 162, 3, BRIDGE); // linguagem e segurança
  // pontes do catálogo: só entre áreas que já têm conteúdo, curtas como a
  // distância entre duas seções vizinhas
  {
    const ready = new Set(AREAS.map((a) => a.id));
    const spotOf = new Map(CATALOG_AREAS.map((spot) => [spot.id, spot]));
    for (const [a, b] of CATALOG_BRIDGES) {
      if (!ready.has(a) || !ready.has(b)) continue;
      const pa = spotOf.get(a), pb = spotOf.get(b);
      if (!pa || !pb) continue;
      const dx = pb.cx - pa.cx, dy = pb.cy - pa.cy;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len, uy = dy / len;
      // distância até a borda elíptica da ilha na direção da ponte
      const edge = (land) => land
        ? 1 / Math.sqrt((ux / land.rx) ** 2 + (uy / land.ry) ** 2)
        : 10;
      const startA = edge(AREAS.find((x) => x.id === a)?.land) + 0.6;
      const startB = edge(AREAS.find((x) => x.id === b)?.land) + 0.6;
      bridgeLine(pa.cx + ux * startA, pa.cy + uy * startA, pb.cx - ux * startB, pb.cy - uy * startB, 3, BRIDGE);
      // a ponta da ponte encosta em terra, não em água
      rect(Math.round(pa.cx + ux * 9) - 1, Math.round(pa.cy + uy * 9) - 1, 3, 3, pa.rect ? (AREAS.find((x) => x.id === a)?.base ?? 12) : 12);
      rect(Math.round(pb.cx - ux * 9) - 1, Math.round(pb.cy - uy * 9) - 1, 3, 3, AREAS.find((x) => x.id === b)?.base ?? 12);
    }
  }

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
  rect(152, 17, 4, 4, CONTINENTS.ai.path);
  rect(161, 17, 4, 4, CONTINENTS.ai.path);
  rect(30, 147, 4, 4, CONTINENTS.chem.path);
  rect(30, 159, 4, 4, CONTINENTS.lingua.floor);
  rect(227, 19, 4, 4, CONTINENTS.cs.path);
  rect(234, 19, 4, 4, CONTINENTS.cs.path);
  rect(105, 112, 4, 4, CONTINENTS.physics.path);
  rect(105, 125, 4, 4, CONTINENTS.physics.path);
  rect(46, 137, 4, 4, CONTINENTS.chem.path);
  rect(57, 137, 4, 4, CONTINENTS.chem.path);
  rect(255, 30, 4, 4, CONTINENTS.cs.path);
  rect(255, 49, 4, 4, CONTINENTS.music.path);
  rect(246, 79, 4, 4, CONTINENTS.math.path);
  rect(259, 79, 4, 4, CONTINENTS.math.path);
  rect(225, 87, 4, 4, CONTINENTS.math.path);
  rect(225, 125, 4, 4, CONTINENTS.ai.path);
  rect(243, 134, 4, 4, CONTINENTS.ai.path);
  rect(253, 134, 4, 4, CONTINENTS.lingua.floor);
  rect(73, 150, 4, 4, CONTINENTS.chem.path);
  rect(77, 161, 4, 4, CONTINENTS.physics.path);
  rect(225, 144, 4, 4, CONTINENTS.ai.path);
  rect(225, 161, 4, 4, CONTINENTS.cs.path);
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

  // máscara de "perto de estação/pedra/NPC": era uma varredura em lista por
  // tile do mapa e custava quase 2 s para montar o mundo
  const RAIO_LIVRE = 2.4;
  const pertoDeUso = new Uint8Array(MAP_W * MAP_H);
  const marcarPerto = (ux, uy) => {
    const r = Math.ceil(RAIO_LIVRE);
    for (let dy = -r; dy <= r; dy++) {
      for (let dx = -r; dx <= r; dx++) {
        const x = ux + dx, y = uy + dy;
        if (x < 0 || y < 0 || x >= MAP_W || y >= MAP_H) continue;
        if (Math.hypot(dx, dy) >= RAIO_LIVRE) continue;
        pertoDeUso[y * MAP_W + x] = 1;
      }
    }
  };
  for (const s of used) {
    const [ux, uy] = s.split(",").map(Number);
    marcarPerto(ux, uy);
  }
  const nearUsed = (x, y) => pertoDeUso[Math.floor(y) * MAP_W + Math.floor(x)] === 1;

  const catalogDecor = CATALOG_CONTENT.decor;
  const decoForArea = {
    "cs-arch": ["rack", "pillar", "terminal"],
    "cs-net": ["antenna", "rack", "node"],
    "cs-security": ["lock", "rack", "crystal"],
    "math-analysis": ["compass", "book", "star"],
    "math-prob": ["die", "orb", "star"],
    "physics-em": ["coil", "crystal", "wave"],
    "physics-thermo": ["gauge", "coil", "crystal"],
    "physics-optics": ["lens", "crystal", "star"],
    "chem-organic": ["molecule", "mushroom", "bubble"],
    "chem-analytical": ["flask", "molecule", "crystal"],
    "music-acoustics": ["speaker", "wave", "note"],
    "music-form": ["metronome", "note", "book"],
    "ai-vision": ["orb", "synapse", "node"],
    "ai-language": ["book", "synapse", "terminal"],
    "lingua-literature": ["quill", "book", "flower"],
    "lingua-semantics": ["mask", "book", "star"],
  };

  Object.assign(decoForArea, catalogDecor);

  // enfeite não pode cair no mar: puxa o ponto para o centro da ilha
  const insideIsland = (x, y, cx, cy) => {
    let px = x, py = y;
    for (let i = 0; i < 6 && get(Math.floor(px), Math.floor(py)) === WATER; i++) {
      px += (cx - px) * 0.34;
      py += (cy - py) * 0.34;
    }
    return { x: px, y: py };
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
      if (nearUsed(x + 0.5, y + 0.5)) continue;
      if (hash2(x, y) > 0.055) continue;
      const c = continentAtTile(x, y);
      if (!c) continue;
      const area = areaAtTile(x, y);
      const kinds = (area && decoForArea[area.id]) || decoFor[c];
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
      decor.push({ type: kind, x: x + 0.5, y: y + 0.5, accent: area?.accent || CONTINENTS[c].accent, hue: hash2(x, y) });
    }
  }

  // lâmpadas nas esquinas das estações grandes: a subárea fica vizinha de
  // outra e a lâmpada cairia em cima da estação do lado
  for (const site of SITES) {
    if (site.minor) continue;
    const c = CONTINENTS[site.continent];
    for (const [dx, dy] of [[-3, -3], [3, -3], [-3, 3], [3, 3]]) {
      decor.push({ type: "lamp", x: site.x + dx, y: site.y + dy, accent: c.accent });
    }
  }

  // placas nas docas
  for (const stone of WAYSTONES) {
    if (stone.continent === "hub") continue;
    // a placa do farol de uma área diz o nome da área, não só o continente
    const area = areaAtTile(stone.x, stone.y);
    const signSpot = area
      ? insideIsland(stone.x + 2.4, stone.y + 1.2, area.land.cx, area.land.cy)
      : { x: stone.x + 2.4, y: stone.y + 1.2 };
    decor.push({
      type: "sign", x: signSpot.x, y: signSpot.y,
      text: area ? area.name : CONTINENTS[stone.continent].name,
      accent: area ? area.accent : CONTINENTS[stone.continent].accent,
    });
  }

  // assinatura de cada área: uma fileira do objeto que só ela tem, atrás do farol
  for (const stone of WAYSTONES) {
    const area = areaAtTile(stone.x, stone.y);
    if (!area) continue;
    const kinds = decoForArea[area.id];
    if (!kinds) continue;
    for (let i = 0; i < 3; i++) {
      const spot = insideIsland(stone.x - 3 + i * 3, stone.y - 2.2, area.land.cx, area.land.cy);
      decor.push({
        type: kinds[0], x: spot.x, y: spot.y,
        accent: area.accent, hue: hash2(stone.x + i, stone.y),
      });
    }
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
    const accent = g.accent || CONTINENTS[g.continent]?.accent || "#ffc857";
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
    ...npcStyle(n.id, n.accent),
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
    // a base desenhada tem 26 px (32 no chafariz); a colisão acompanha o
    // desenho, senão o boneco atravessa metade do pedestal
    addProp(s.x, s.y, fountain ? 1 : 0.82, fountain ? 0.55 : 0.5);
  }
  for (const w of waystones) addProp(w.x, w.y, 0.55, 0.4);
  const decorSize = {
    lamp: [0.18, 0.15], sign: [0.4, 0.2], bench: [0.6, 0.22],
    terminal: [0.4, 0.3], pillar: [0.45, 0.35], book: [0.35, 0.2],
    orb: [0.3, 0.25], crystal: [0.35, 0.3], flask: [0.3, 0.25],
    speaker: [0.35, 0.25],
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
    // a boca não pode nascer em cima do farol da própria área: além de feio,
    // tranca a passagem entre a pedra e a caverna
    const pedraDaArea = WAYSTONES.find((s) => s.id === h.id);
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
            if (pedraDaArea && Math.hypot(pedraDaArea.x - cx, pedraDaArea.y - cy) < 5) continue;
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
  // O morro da caverna tem 40x31 px (2,5 x 2 tiles). A caixa antiga cobria só
  // a boca; o corpo do morro era atravessável. A caixa agora cobre o teto e o
  // miolo, e deixa a boca e a saída em c.y + 1,5 livres para chegar e descer.
  for (const c of caves) addProp(c.x, c.y - 1.2, 0.95, 0.7);

  // nenhum NPC nasce dentro de pedra: se o posto caiu na área nova de uma
  // estação, caverna ou enfeite, ele anda para o ponto livre mais próximo.
  for (const n of npcs) {
    if (!boxCollides(n.x, n.y, 0.3, 0.24)) continue;
    let achou = null;
    for (let r = 0.5; r <= 3 && !achou; r += 0.5) {
      for (let i = 0; i < 12 && !achou; i++) {
        const a = (i / 12) * Math.PI * 2;
        const x = n.hx + Math.cos(a) * r;
        const y = n.hy + Math.sin(a) * r;
        if (!boxCollides(x, y, 0.3, 0.24)) achou = { x, y };
      }
    }
    if (!achou) continue;
    n.x = n.hx = achou.x;
    n.y = n.hy = achou.y;
    n.tx = achou.x;
    n.ty = achou.y;
  }

  // itens no chão: um equipamento e um consumível por área, em terra, longe
  // das estações, do farol e da boca da caverna. O id é estável para o que já
  // foi pego não voltar.
  const groundItems = [];
  for (const area of AREAS) {
    const conjunto = AREA_ITEMS[area.id];
    const bioma = BIOMES[area.id];
    if (!conjunto || !bioma) continue;
    const daArea = [
      ...SITES.filter((s) => areaAtTile(Math.round(s.x), Math.round(s.y))?.id === area.id),
      ...WAYSTONES.filter((w) => areaAtTile(w.x, w.y)?.id === area.id),
      ...caves.filter((c) => areaAtTile(c.x, c.y)?.id === area.id),
    ];
    const escolhidos = [
      area.id.length % 2 ? conjunto.armor : conjunto.helmet,
      null,
    ];
    for (let k = 0; k < escolhidos.length; k++) {
      const comuns = ["pocao", "pocao-mana", "runa-cura", "erva"];
      const item = escolhidos[k] || { id: comuns[area.id.length % comuns.length] };
      let pos = null;
      for (let tentativa = 0; tentativa < 40 && !pos; tentativa++) {
        const a = hash2(area.land.cx * 3 + k * 11 + tentativa, area.land.cy * 5 - tentativa) * Math.PI * 2;
        const r = 0.28 + hash2(tentativa + 1, area.land.cx + k) * 0.5;
        const x = Math.round(area.land.cx + Math.cos(a) * area.land.rx * r);
        const y = Math.round(area.land.cy + Math.sin(a) * area.land.ry * r);
        if (get(x, y) === WATER) continue;
        if (boxCollides(x, y, 0.6, 0.5)) continue;
        if (daArea.some((s) => Math.max(Math.abs(s.x - x), Math.abs(s.y - y)) < 2)) continue;
        if (groundItems.some((g) => Math.max(Math.abs(g.x - x), Math.abs(g.y - y)) < 2)) continue;
        pos = { x, y };
      }
      if (!pos) continue;
      groundItems.push({
        id: `${area.id}-chao-${k + 1}`,
        itemId: item.id,
        qty: 1,
        x: pos.x,
        y: pos.y,
        accent: item.accent || bioma.accent,
        area: area.id,
      });
    }
  }
  function takeGroundItem(id) {
    const i = groundItems.findIndex((g) => g.id === id);
    if (i < 0) return null;
    return groundItems.splice(i, 1)[0];
  }

  return {
    tiles, decor, props, stations, waystones, npcs, hunters, monsters, caves, groundItems, takeGroundItem,
    cat: { ...CAT_SPAWN, facing: 1, t: 0, moving: false },
    get, set, isSolidTile, boxCollides, updateNpcs,
    continentAt, continentAtTile, areaAt, areaAtTile,
    markExplored, isExplored, setExplored,
    get exploredVersion() { return exploredVersion; },
    get exploredBytes() { return explored; },
  };
}

export { hash2, mulberry32 };

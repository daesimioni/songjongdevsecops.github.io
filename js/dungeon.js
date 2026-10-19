// A caverna: um mapa próprio, em tela cheia, com salas e túneis que se cruzam.
// O bicho que vê você começa a batalha sozinho, como nos jogos de bolso: anda
// pelo corredor, entra no campo de visão, exclama e chama o duelo de perguntas.
import { TILE, PLAYER_W, PLAYER_H } from "./config.js";
import { DUNGEON_LAYOUT, dungeonById } from "./dungeon-data.js";
import { GROUNDS, ITEMS } from "./rpg-data.js";
import { drawCreature } from "./creature.js";
import { findPathIn } from "./path.js";
import { hash2 } from "./world.js";

const $ = (id) => document.getElementById(id);
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const clock = () => performance.now();

const SPEED = 4.6; // tiles por segundo
const SPRINT = 1.8;
const PATH_PAD = 0.16;
const CITY_LIGHT = 22;

// Um sprite de luz só, reutilizado por todas as tochas: criar um gradiente por
// tocha a cada quadro é o tipo de desperdício que aparece no celular.
let torchSprite = null;
function torchGlowSprite() {
  if (torchSprite) return torchSprite;
  const c = document.createElement("canvas");
  c.width = c.height = 128;
  const g = c.getContext("2d");
  const grad = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grad.addColorStop(0, "rgba(255, 186, 92, 0.2)");
  grad.addColorStop(0.45, "rgba(255, 150, 70, 0.07)");
  grad.addColorStop(1, "rgba(255, 150, 70, 0)");
  g.fillStyle = grad;
  g.fillRect(0, 0, 128, 128);
  torchSprite = c;
  return c;
}

// ---------- mapa ----------
export function buildDungeonMap(def) {
  const W = DUNGEON_LAYOUT.width;
  const H = DUNGEON_LAYOUT.height;
  const grid = new Uint8Array(W * H);
  const roomGrid = new Int8Array(W * H).fill(-1);
  const idx = (x, y) => y * W + x;
  const carve = (x, y) => {
    if (x > 0 && y > 0 && x < W - 1 && y < H - 1) grid[idx(x, y)] = 1;
  };
  const carveRect = (x, y, w, h) => {
    for (let j = y; j < y + h; j++) for (let i = x; i < x + w; i++) carve(i, j);
  };

  for (const room of def.rooms) carveRect(room.x, room.y, room.w, room.h);

  const byId = new Map(def.rooms.map((r) => [r.id, r]));
  for (const [aId, bId] of DUNGEON_LAYOUT.corridors) {
    const a = byId.get(aId);
    const b = byId.get(bId);
    if (!a || !b) continue;
    const ax = a.x + Math.floor(a.w / 2);
    const ay = a.y + Math.floor(a.h / 2);
    const bx = b.x + Math.floor(b.w / 2);
    const by = b.y + Math.floor(b.h / 2);
    const x0 = Math.min(ax, bx);
    const x1 = Math.max(ax, bx);
    for (let x = x0; x <= x1; x++) for (let d = -1; d <= 1; d++) carve(x, ay + d);
    const y0 = Math.min(ay, by);
    const y1 = Math.max(ay, by);
    for (let y = y0; y <= y1; y++) for (let d = -1; d <= 1; d++) carve(bx + d, y);
  }

  def.rooms.forEach((room, i) => {
    for (let y = room.y; y < room.y + room.h; y++) {
      for (let x = room.x; x < room.x + room.w; x++) {
        if (grid[idx(x, y)]) roomGrid[idx(x, y)] = i;
      }
    }
  });

  return { W, H, grid, roomGrid, rooms: def.rooms, idx };
}

export function dungeonSolid(map, tx, ty) {
  if (tx < 0 || ty < 0 || tx >= map.W || ty >= map.H) return true;
  return map.grid[ty * map.W + tx] === 0;
}

function roomIndexAt(map, x, y) {
  const tx = Math.floor(x);
  const ty = Math.floor(y);
  if (tx < 0 || ty < 0 || tx >= map.W || ty >= map.H) return -1;
  return map.roomGrid[ty * map.W + tx];
}

// Caixa do corpo contra os tiles: a mesma ideia da colisão do mundo.
function boxFree(map, x, y, pad = 0, solids = null) {
  const hw = (PLAYER_W + pad) / 2;
  const hh = (PLAYER_H + pad) / 2;
  const x0 = Math.floor(x - hw);
  const x1 = Math.floor(x + hw - 0.001);
  const y0 = Math.floor(y - hh);
  const y1 = Math.floor(y + hh - 0.001);
  for (let ty = y0; ty <= y1; ty++) {
    for (let tx = x0; tx <= x1; tx++) {
      if (dungeonSolid(map, tx, ty)) return false;
    }
  }
  if (solids) {
    for (const s of solids) {
      if (Math.abs(x - s.x) < hw + s.hw && Math.abs(y - s.y) < hh + s.hh) return false;
    }
  }
  return true;
}

export function dungeonLineOfSight(map, ax, ay, bx, by) {
  const dist = Math.hypot(bx - ax, by - ay);
  const steps = Math.ceil(dist / 0.22);
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    if (dungeonSolid(map, Math.floor(ax + (bx - ax) * t), Math.floor(ay + (by - ay) * t))) return false;
  }
  return true;
}

// ---------- desenho ----------
function drawAdventurer(ctx, x, y, dir, moving, t, accent) {
  const step = moving ? Math.sin(t * 0.015) : 0;
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(0,0,0,0.42)";
  ctx.beginPath();
  ctx.ellipse(0, 0, 7, 2.8, 0, 0, Math.PI * 2);
  ctx.fill();
  // pernas
  ctx.fillStyle = "#262a44";
  ctx.fillRect(-4, -5, 3, 5 + (step > 0 ? 1 : 0));
  ctx.fillRect(1, -5, 3, 4 - (step < 0 ? 1 : 0));
  // capa
  ctx.fillStyle = "#3c4270";
  ctx.fillRect(-6, -16, 12, 11);
  ctx.fillStyle = accent;
  ctx.fillRect(-6, -16, 2, 11);
  ctx.fillStyle = "#2a2e52";
  ctx.fillRect(-6, -6, 12, 2);
  // braços
  ctx.fillStyle = "#3c4270";
  ctx.fillRect(-8, -13 + (step > 0 ? 1 : 0), 2, 6);
  ctx.fillRect(6, -13 - (step < 0 ? 1 : 0), 2, 6);
  // cabeça e capuz
  ctx.fillStyle = "#d6ad86";
  ctx.fillRect(-4, -22, 8, 6);
  ctx.fillStyle = "#4b5185";
  ctx.fillRect(-5, -24, 10, 5);
  ctx.fillRect(-5, -20, 2, 5);
  ctx.fillRect(3, -20, 2, 5);
  ctx.fillStyle = "#101426";
  if (dir === 0) {
    ctx.fillRect(-3, -19, 2, 1);
    ctx.fillRect(1, -19, 2, 1);
  } else if (dir === 1) {
    ctx.fillRect(-3, -19, 2, 1);
  } else if (dir === 2) {
    ctx.fillRect(1, -19, 2, 1);
  }
  // lanterna na mão
  ctx.fillStyle = "#ffc857";
  ctx.fillRect(6, -8, 2, 2);
  ctx.fillStyle = "rgba(255,200,87,0.18)";
  ctx.beginPath();
  ctx.arc(7, -7, 6, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawCat(ctx, x, y, t) {
  const tail = Math.sin(t * 0.006) * 1.3;
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.ellipse(0, 0, 5, 1.8, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#c98b3f";
  ctx.fillRect(-4, -6, 8, 5);
  ctx.fillRect(-3, -9, 6, 4);
  ctx.fillStyle = "#e0a455";
  ctx.fillRect(-2, -8, 2, 2);
  ctx.fillRect(1, -8, 2, 2);
  ctx.fillStyle = "#2a1c12";
  ctx.fillRect(-3, -7, 1, 1);
  ctx.fillRect(2, -7, 1, 1);
  ctx.fillRect(-4, -9, 1, 2);
  ctx.fillRect(3, -9, 1, 2);
  ctx.fillStyle = "#a86f30";
  ctx.fillRect(4, -7, 1, 4);
  ctx.fillRect(5, -4 + tail, 1, 2);
  ctx.restore();
}

function drawChest(ctx, x, y, opened, accent) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.ellipse(0, 0, 7, 2.4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#4b3320";
  ctx.fillRect(-7, -9, 14, 9);
  ctx.fillStyle = "#6b4a2c";
  ctx.fillRect(-7, -9, 14, 3);
  if (opened) {
    ctx.fillStyle = "#1a120c";
    ctx.fillRect(-6, -9, 12, 4);
    ctx.fillStyle = "#6b4a2c";
    ctx.fillRect(-8, -13, 16, 3);
  } else {
    ctx.fillStyle = accent;
    ctx.fillRect(-2, -6, 4, 4);
    ctx.fillStyle = "#2b1d10";
    ctx.fillRect(-1, -5, 2, 2);
  }
  ctx.restore();
}

function drawStairs(ctx, x, y, accent) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#05070e";
  ctx.fillRect(-10, -12, 20, 12);
  ctx.fillStyle = "#1b2338";
  for (let i = 0; i < 4; i++) ctx.fillRect(-8 + i, -10 + i * 2.5, 16 - i * 2, 2);
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.5;
  ctx.fillRect(-7, -11, 14, 1);
  ctx.restore();
}

function drawTorch(ctx, x, y, t, accent) {
  const flick = Math.sin(t * 0.013 + x * 0.7) * 0.5 + Math.sin(t * 0.031 + y) * 0.3;
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#2a1c12";
  ctx.fillRect(-1, -7, 2, 7);
  ctx.fillStyle = "#ff9f43";
  ctx.fillRect(-2, -11 + flick, 4, 4);
  ctx.fillStyle = "#ffd166";
  ctx.fillRect(-1, -12 + flick, 2, 3);
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.16;
  ctx.beginPath();
  ctx.arc(0, -9, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawAltar(ctx, x, y, t, accent) {
  const glow = 0.16 + Math.sin(t * 0.004) * 0.06;
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.ellipse(0, 0, 12, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2c3350";
  ctx.fillRect(-10, -8, 20, 8);
  ctx.fillStyle = "#3d4770";
  ctx.fillRect(-8, -13, 16, 6);
  ctx.fillStyle = accent;
  ctx.globalAlpha = glow;
  ctx.beginPath();
  ctx.arc(0, -14, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.fillRect(-2, -17, 4, 5);
  ctx.restore();
}

function drawForge(ctx, x, y, t, accent) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.ellipse(0, 0, 13, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#37304a";
  ctx.fillRect(-11, -10, 22, 10);
  ctx.fillStyle = "#4a3f60";
  ctx.fillRect(-8, -15, 16, 6);
  ctx.fillStyle = "#1b1626";
  ctx.fillRect(-5, -13, 10, 4);
  const f = Math.sin(t * 0.017) * 1.4;
  ctx.fillStyle = "#ff7a3d";
  ctx.fillRect(-4, -12 + f, 8, 2);
  ctx.fillStyle = "#ffd166";
  ctx.fillRect(-2, -12 + f, 4, 1);
  ctx.fillStyle = accent;
  ctx.fillRect(-6, -8, 12, 1);
  ctx.restore();
}

function drawWaystone(ctx, x, y, t, accent) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.ellipse(0, 0, 9, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2a3048";
  ctx.fillRect(-6, -22, 12, 22);
  ctx.fillStyle = "#3b4466";
  ctx.fillRect(-4, -20, 8, 17);
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.55 + Math.sin(t * 0.003) * 0.25;
  ctx.fillRect(-2, -17, 4, 4);
  ctx.fillRect(-3, -11, 6, 1);
  ctx.restore();
}

function drawKeeper(ctx, x, y, t, accent) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.beginPath();
  ctx.ellipse(0, 0, 6.5, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#5a4a2a";
  ctx.fillRect(-5, -13, 10, 13);
  ctx.fillStyle = "#8a7440";
  ctx.fillRect(-5, -13, 2, 13);
  ctx.fillStyle = "#c9a37c";
  ctx.fillRect(-4, -19, 8, 6);
  ctx.fillStyle = "#d9d2c2";
  ctx.fillRect(-4, -21, 8, 3);
  ctx.fillRect(-5, -19, 2, 4);
  ctx.fillStyle = "#101426";
  ctx.fillRect(-2, -17, 1, 1);
  ctx.fillRect(1, -17, 1, 1);
  ctx.fillStyle = accent;
  ctx.fillRect(-1, -14, 2, 2);
  ctx.restore();
}

function drawGarden(ctx, x, y, t, accent, ready) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#2a2116";
  ctx.fillRect(-12, -8, 24, 8);
  ctx.fillStyle = "#1a2a1c";
  ctx.fillRect(-11, -7, 6, 2);
  ctx.fillRect(-3, -7, 6, 2);
  ctx.fillRect(5, -7, 6, 2);
  for (let i = 0; i < 3; i++) {
    const sway = Math.sin(t * 0.003 + i * 1.4) * 0.7;
    if (ready) {
      ctx.fillStyle = accent;
      ctx.fillRect(-9 + i * 8, -12 + sway, 2, 5);
      ctx.fillRect(-6 + i * 8, -11 - sway, 2, 4);
    } else {
      ctx.fillStyle = "#31452f";
      ctx.fillRect(-9 + i * 8, -9, 2, 2);
    }
  }
  ctx.restore();
}

function drawBuilding(ctx, x, y, w, h, palette, accent) {
  ctx.fillStyle = "rgba(0,0,0,0.32)";
  ctx.fillRect(x + 2, y + h - 4, w, 4);
  ctx.fillStyle = "#232842";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = palette.wallTop;
  ctx.fillRect(x, y, w, 3);
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.55;
  ctx.fillRect(x + 4, y + 6, 3, 4);
  ctx.fillRect(x + w - 8, y + 6, 3, 4);
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#0a0d18";
  ctx.fillRect(x + w / 2 - 3, y + h - 9, 6, 9);
}

// ---------- a caverna em si ----------
export function createDungeon({ rpg, audio, onEncounter, onSheet, onExit, isBlocked }) {
  const canvas = $("dungeon-canvas");
  const ctx = canvas?.getContext("2d", { alpha: false }) || null;

  // Enquanto a caverna cobre a tela, o HUD do mundo não deve receber Tab nem
  // clique por baixo do desenho.
  const WORLD_CHROME = [".hud", "#touch", "#minimap", "#prompt", "#zone-card", "#chatbar", "#world"];
  function setWorldInert(on) {
    for (const sel of WORLD_CHROME) {
      for (const node of document.querySelectorAll(sel)) node.inert = on;
    }
  }

  const state = {
    open: false,
    def: null,
    map: null,
    ground: null,
    player: { x: 0, y: 0, dir: 0, moving: false },
    monsters: [],
    boss: null,
    chests: [],
    props: [],
    solids: [],
    path: null,
    pending: null,
    keys: new Set(),
    sprint: false,
    paused: false,
    alert: null,
    encounterLockUntil: 0,
    torchUntil: 0,
    altarAt: 0,
    roomIndex: -1,
    msg: null,
    history: [],
    raf: 0,
    last: 0,
    dpr: 1,
    vw: 0,
    vh: 0,
    view: { scale: 3, camX: 0, camY: 0 },
    hudAt: 0,
    keeperLine: 0,
  };

  // ---- construção de uma visita ----
  function groundFor(def) {
    const surface = GROUNDS.find((g) => g.continent === def.continent) || GROUNDS[0];
    return {
      id: def.id,
      continent: def.continent,
      name: def.name,
      dungeon: true,
      material: def.material,
      loot: surface.loot,
      bossLoot: surface.bossLoot,
      monsters: [],
      boss: null,
    };
  }

  function makeMonster(def, room, k, name, tier) {
    const spots = [[0.28, 0.3], [0.72, 0.28], [0.5, 0.72], [0.24, 0.7], [0.76, 0.68]];
    const s = spots[(room.x + room.y + k) % spots.length];
    const x = room.x + 0.8 + s[0] * (room.w - 1.6);
    const y = room.y + 0.8 + s[1] * (room.h - 1.6);
    return {
      id: `dg-${def.continent}-${room.id}-m${k}`,
      name,
      tier,
      kind: tier >= 3 ? "golem" : tier === 2 ? "eye" : "slime",
      level: tier * 3,
      x,
      y,
      hx: x,
      hy: y,
      tx: x,
      ty: y,
      dir: 0,
      moving: false,
      alive: true,
      vision: 3.3 + tier * 0.45,
      speed: 0.55 + tier * 0.16,
      waitUntil: clock() + 600 + Math.random() * 1800,
      accent: def.palette.accent,
      theme: room.theme,
      roomId: room.id,
      boss: false,
    };
  }

  function spawnMonsters(def) {
    const out = [];
    const names = def.monsters || [];
    let n = 0;
    def.rooms.forEach((room) => {
      if (room.kind === "entrance" || room.kind === "city") return;
      const tier = clamp(room.tier || 1, 1, 3);
      const count = tier >= 3 ? 3 : 2;
      for (let k = 0; k < count; k++) {
        const id = `dg-${def.continent}-${room.id}-m${k}`;
        if (!rpg.monsterAlive(id)) continue;
        const name = names[(n + k) % Math.max(1, names.length)] || "Coisa";
        out.push(makeMonster(def, room, k, name, tier));
      }
      n += count;
    });
    return out;
  }

  function spawnBoss(def) {
    const room = def.rooms.find((r) => r.id === DUNGEON_LAYOUT.bossRoom) || def.rooms[def.rooms.length - 2];
    const x = room.x + room.w / 2;
    const y = room.y + room.h / 2;
    return {
      id: `${def.id}-boss`,
      name: def.boss,
      kind: "boss",
      tier: 4,
      level: 12,
      x,
      y,
      hx: x,
      hy: y,
      tx: x,
      ty: y,
      dir: 0,
      moving: false,
      alive: true,
      vision: 5.6,
      speed: 0.4,
      waitUntil: clock() + 900,
      accent: def.palette.accent,
      theme: room.theme,
      roomId: room.id,
      boss: true,
    };
  }

  function makeChests(def) {
    return def.rooms
      .filter((room) => room.kind !== "entrance")
      .map((room) => ({
        kind: "chest",
        id: `dg-${def.continent}-${room.id}-chest`,
        x: room.x + 1.6,
        y: room.y + room.h - 1.9,
        locked: (room.tier || 0) >= 3,
        opened: false,
        roomId: room.id,
        label: (room.tier || 0) >= 3 ? "abrir o baú selado" : "abrir o baú",
      }));
  }

  function makeProps(def) {
    const props = [];
    const entrance = def.rooms.find((r) => r.kind === "entrance");
    if (entrance) {
      props.push({
        kind: "stairs",
        x: entrance.x + entrance.w / 2,
        y: entrance.y + entrance.h - 0.4,
        label: "subir para a superfície",
      });
    }
    for (const room of def.rooms) {
      for (let x = room.x + 2; x < room.x + room.w - 1; x += 4) {
        props.push({ kind: "torch", x: x + 0.5, y: room.y - 0.22 });
      }
    }
    // tochas nos túneis, para o labirinto não virar um breu só
    const { W, H, grid, roomGrid } = state.map;
    for (let y = 2; y < H - 2; y++) {
      for (let x = 2; x < W - 2; x++) {
        const i = y * W + x;
        if (roomGrid[i] !== -1 || !grid[i]) continue;
        if (grid[i - W] !== 0) continue;
        if (hash2(x, y) < 0.86) continue;
        props.push({ kind: "torch", x: x + 0.5, y: y - 0.18 });
      }
    }
    const city = def.rooms.find((r) => r.kind === "city");
    if (city) {
      props.push({ kind: "altar", x: city.x + 3.2, y: city.y + city.h - 3.4, label: "altar que devolve vida", interact: true });
      props.push({ kind: "forge", x: city.x + city.w - 3.2, y: city.y + city.h - 3.4, label: "forja do subsolo", interact: true });
      props.push({ kind: "waystone", x: city.x + city.w / 2 + 3, y: city.y + 2.6, label: "pedra de retorno", interact: true });
      props.push({ kind: "keeper", x: city.x + city.w / 2 - 3, y: city.y + city.h - 3.4, label: "conversar com a mestra", interact: true });
      props.push({ kind: "garden", x: city.x + city.w / 2 + 1.5, y: city.y + city.h - 3.4, label: "colher a horta de ervas", interact: true, readyAt: 0 });
      props.push({ kind: "building", x: city.x + 1.2, y: city.y + 1.2, w: 26, h: 22, solid: true });
      props.push({ kind: "building", x: city.x + city.w - 4.8, y: city.y + 1.2, w: 30, h: 22, solid: true });
    }
    return props;
  }

  function spawnPlayer(def) {
    const entrance = def.rooms.find((r) => r.kind === "entrance") || def.rooms[0];
    state.player.x = entrance.x + entrance.w / 2;
    state.player.y = entrance.y + entrance.h - 2.2;
    state.player.dir = 3;
    state.player.moving = false;
  }

  function open(id) {
    const def = typeof id === "string" ? dungeonById(id) : id;
    if (!def || !canvas || !ctx) return false;
    state.def = def;
    state.map = buildDungeonMap(def);
    state.ground = groundFor(def);
    state.monsters = spawnMonsters(def);
    state.boss = rpg.bossAlive(state.ground) ? spawnBoss(def) : null;
    state.chests = makeChests(def);
    state.props = makeProps(def);
    // o que ocupa espaço de verdade dentro da sala: prédios e baús
    state.solids = [];
    for (const p of state.props) {
      if (!p.solid) continue;
      const hw = p.w / TILE / 2;
      const hh = p.h / TILE / 2;
      state.solids.push({ x: p.x + hw, y: p.y + hh, hw, hh });
    }
    for (const c of state.chests) state.solids.push({ x: c.x, y: c.y, hw: 0.4, hh: 0.28 });
    state.path = null;
    state.pending = null;
    state.keys.clear();
    state.sprint = false;
    state.paused = false;
    state.alert = null;
    state.encounterLockUntil = clock() + 1200;
    state.torchUntil = 0;
    state.altarAt = 0;
    state.msg = null;
    state.history = [];
    state.roomIndex = -1;
    state.pendingMonster = null;
    state.escapeSpot = null;
    state.open = true;
    state.last = 0;

    spawnPlayer(def);
    $("dungeon").hidden = false;
    setWorldInert(true);
    $("dungeon").dataset.dungeon = def.continent;
    $("dg-title").textContent = def.name;
    $("dg-sub").textContent = def.sub;
    $("dg-room").textContent = "";
    $("dg-msg").textContent = "";
    $("dg-prompt").hidden = true;
    // no celular não existe tecla F: o toque no objeto faz o mesmo trabalho
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const promptKey = $("dg-prompt").querySelector("kbd");
    if (promptKey) promptKey.textContent = coarse ? "toque" : "F";
    updateHud();
    resize();
    say(`${def.name}. ${def.sub}.`, 4200);
    audio.open();
    cancelAnimationFrame(state.raf);
    state.raf = requestAnimationFrame(frame);
    return true;
  }

  function close(kind = "stairs") {
    if (!state.open) return;
    state.open = false;
    cancelAnimationFrame(state.raf);
    state.raf = 0;
    state.paused = false;
    state.path = null;
    state.pending = null;
    state.keys.clear();
    state.sprint = false;
    $("dungeon").hidden = true;
    setWorldInert(false);
    $("dg-prompt").hidden = true;
    audio.close();
    onExit?.({ kind, dungeon: state.def });
  }

  function resize() {
    if (!canvas) return;
    state.dpr = Math.min(2, window.devicePixelRatio || 1);
    state.vw = window.innerWidth;
    state.vh = window.innerHeight;
    canvas.width = Math.round(state.vw * state.dpr);
    canvas.height = Math.round(state.vh * state.dpr);
  }

  // ---- mensagens e HUD ----
  function say(text, ms = 3000) {
    state.msg = { text, until: clock() + ms };
    const node = $("dg-msg");
    if (node) node.textContent = text;
  }

  function setText(id, text) {
    const node = $(id);
    if (node && node.textContent !== text) node.textContent = text;
  }

  function updateHud() {
    setText("dg-hp", `vida ${rpg.hp()}/${rpg.hpMax()}`);
    setText("dg-keys", `chaves ${rpg.itemCount("chave")}`);
    const left = Math.max(0, state.torchUntil - clock());
    setText("dg-torch", left > 0 ? `tocha ${Math.ceil(left / 1000)}s` : "tocha apagada");
    const parts = [];
    for (const [id, label] of [["ferro", "ferro"], ["erva", "erva"], ["veio", "veio"], ["madeira", "madeira"]]) {
      const n = rpg.itemCount(id);
      if (n > 0) parts.push(`${label} ${n}`);
    }
    setText("dg-bag", parts.length ? `materiais ${parts.join(" · ")}` : "materiais vazios");
    const room = state.map ? state.map.rooms[state.roomIndex] : null;
    setText("dg-room", room ? room.name : "");
  }

  // ---- colisão e caminhada ----
  function walkable(tx, ty, pad) {
    return boxFree(state.map, tx + 0.5, ty + 0.5, pad, state.solids);
  }

  function walkStep(dx, dy, dt) {
    const len = Math.hypot(dx, dy);
    if (!len) {
      state.player.moving = false;
      return false;
    }
    dx /= len;
    dy /= len;
    const step = SPEED * (state.sprint ? SPRINT : 1) * dt;
    const p = state.player;
    const ox = p.x;
    const oy = p.y;
    if (boxFree(state.map, p.x + dx * step, p.y, 0, state.solids)) p.x += dx * step;
    if (boxFree(state.map, p.x, p.y + dy * step, 0, state.solids)) p.y += dy * step;
    p.x = clamp(p.x, 0.6, state.map.W - 0.6);
    p.y = clamp(p.y, 0.6, state.map.H - 0.6);
    const moved = p.x !== ox || p.y !== oy;
    p.moving = moved;
    if (dx !== 0 && dy !== 0) p.dir = dx > 0 ? 2 : 1;
    else if (Math.abs(dx) > Math.abs(dy)) p.dir = dx > 0 ? 2 : 1;
    else p.dir = dy > 0 ? 0 : 3;
    return moved;
  }

  function setPathTo(x, y, pending = null) {
    state.path = null;
    state.pending = pending;
    const path = findPathIn(
      state.map.W,
      state.map.H,
      walkable,
      { x: state.player.x, y: state.player.y },
      { x, y },
      { goalPad: PATH_PAD },
    );
    if (!path || !path.length) {
      state.pending = null;
      say("Não há passagem por ali.", 2200);
      return false;
    }
    state.path = path;
    return true;
  }

  function updateAutoWalk(dt) {
    const path = state.path;
    if (!path || !path.length) {
      state.path = null;
      return;
    }
    const stepLen = SPEED * (state.sprint ? SPRINT : 1) * dt * 1.05;
    const target = path[0];
    const dx = target.x - state.player.x;
    const dy = target.y - state.player.y;
    const dist = Math.hypot(dx, dy);
    if (dist <= stepLen + 0.08) {
      state.player.x = target.x;
      state.player.y = target.y;
      state.player.moving = true;
      path.shift();
      if (!path.length) {
        state.path = null;
        const pending = state.pending;
        state.pending = null;
        if (pending) {
          const d = Math.hypot(pending.x - state.player.x, pending.y - state.player.y);
          if (d <= 1.8) act(pending);
        }
      }
      return;
    }
    if (!walkStep(dx, dy, dt)) {
      state.path = null;
      state.pending = null;
    }
  }

  function updateMovement(dt) {
    const keys = state.keys;
    let dx = 0;
    let dy = 0;
    if (keys.has("a") || keys.has("arrowleft")) dx -= 1;
    if (keys.has("d") || keys.has("arrowright")) dx += 1;
    if (keys.has("w") || keys.has("arrowup")) dy -= 1;
    if (keys.has("s") || keys.has("arrowdown")) dy += 1;
    if (dx === 0 && dy === 0) {
      state.player.moving = false;
      return;
    }
    state.path = null;
    walkStep(dx, dy, dt);
  }

  // ---- interação ----
  function interactables() {
    return [...state.chests, ...state.props.filter((p) => p.interact)];
  }

  function nearestInteractable(x, y, radius) {
    let best = null;
    let bestD = Infinity;
    for (const obj of interactables()) {
      const d = Math.hypot(obj.x - x, obj.y - y);
      if (d > radius || d >= bestD) continue;
      // parede no meio: o baú do outro lado não é seu
      if (!dungeonLineOfSight(state.map, x, y, obj.x, obj.y)) continue;
      bestD = d;
      best = obj;
    }
    return best;
  }

  function rollChest(chest) {
    const loot = [{ id: state.def.material, qty: chest.locked ? 4 : 2 }];
    if (Math.random() < 0.55) loot.push({ id: "veio", qty: 1 });
    if (chest.locked || Math.random() < 0.45) loot.push({ id: "pocao", qty: 1 });
    // baú selado não devolve a chave: o custo da chave tem que doer um pouco
    if (!chest.locked && Math.random() < 0.3) loot.push({ id: "chave", qty: 1 });
    return loot;
  }

  function act(obj) {
    if (obj.kind === "chest") {
      if (obj.opened) {
        say("Este baú já foi saqueado. Volte noutra descida.");
        return;
      }
      if (obj.locked) {
        if (rpg.itemCount("chave") <= 0) {
          say("O baú está selado. Uma chave de caverna, feita na forja, abre.");
          audio.error?.();
          return;
        }
        rpg.data.items.chave--;
        if (rpg.data.items.chave <= 0) delete rpg.data.items.chave;
        rpg.save();
      }
      const loot = rollChest(obj);
      for (const l of loot) rpg.addItem(l.id, l.qty);
      obj.opened = true;
      const merged = new Map();
      for (const l of loot) merged.set(l.id, (merged.get(l.id) || 0) + l.qty);
      const names = [...merged].map(([id, qty]) => `${ITEMS[id]?.name || id}×${qty}`).join(", ");
      say(`Baú aberto: ${names}.`, 4200);
      audio.chime();
      updateHud();
      return;
    }
    if (obj.kind === "stairs") {
      say("Você sobe de volta para o sol.", 1600);
      close("stairs");
      return;
    }
    if (obj.kind === "waystone") {
      say("A pedra puxa você de volta para a boca da caverna.", 1800);
      close("waystone");
      return;
    }
    if (obj.kind === "altar") {
      if (clock() - state.altarAt < 45000) {
        say("O altar ainda está esfriando. Espere um pouco.");
        return;
      }
      const healed = rpg.heal(rpg.hpMax());
      state.altarAt = clock();
      say(healed > 0 ? `O altar devolve ${healed} de vida.` : "Você já está inteiro.", 3400);
      audio.chime();
      updateHud();
      return;
    }
    if (obj.kind === "forge") {
      say("A forja do subsolo. Transforme o que a caverna deu.", 2400);
      onSheet?.();
      return;
    }
    if (obj.kind === "keeper") {
      const lines = [
        "A cidade lá em cima não sabe que a gente vive aqui embaixo.",
        "Todo bicho daqui é uma pergunta que ainda não foi respondida.",
        "Baú fundo pede chave. Chave pede ferro e madeira. A mina dá os dois.",
        "Se a vida apertar, o altar do outro lado da praça escuta.",
        "A horta cresce sozinha. Erva colhida vira caldo, e caldo segura a queda.",
      ];
      state.keeperLine = (state.keeperLine + 1) % lines.length;
      say(lines[state.keeperLine], 4500);
      return;
    }
    if (obj.kind === "garden") {
      if (clock() < obj.readyAt) {
        say(`A horta ainda está crescendo. Faltam ${Math.ceil((obj.readyAt - clock()) / 1000)}s.`);
        return;
      }
      const qty = 1 + Math.floor(Math.random() * 2);
      rpg.addItem("erva", qty);
      obj.readyAt = clock() + 45000;
      say(`Colheu ${qty} erva(s) da horta. A terra devolve.`, 3400);
      audio.blip();
      updateHud();
      return;
    }
  }

  function interact() {
    const obj = nearestInteractable(state.player.x, state.player.y, 1.7);
    if (!obj) {
      say("Nada ao alcance.", 1600);
      return;
    }
    act(obj);
  }

  // ---- monstros ----
  function pickWander(m) {
    for (let i = 0; i < 8; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.6 + Math.random() * 2.8;
      const tx = m.hx + Math.cos(a) * r;
      const ty = m.hy + Math.sin(a) * r;
      if (boxFree(state.map, tx, ty, PATH_PAD, state.solids)) {
        m.tx = tx;
        m.ty = ty;
        return;
      }
    }
    m.tx = m.hx;
    m.ty = m.hy;
  }

  function updateMonsters(dt, t) {
    const list = state.boss ? [...state.monsters, state.boss] : state.monsters;
    for (const m of list) {
      if (!m.alive) continue;
      if (!m.boss) {
        if (t >= m.waitUntil) {
          const dx = m.tx - m.x;
          const dy = m.ty - m.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 0.12) {
            m.moving = false;
            m.waitUntil = t + 900 + Math.random() * 2400;
            pickWander(m);
          } else {
            const step = Math.min(dist, m.speed * dt);
            const nx = m.x + (dx / dist) * step;
            const ny = m.y + (dy / dist) * step;
            if (boxFree(state.map, nx, ny, PATH_PAD, state.solids)) {
              m.x = nx;
              m.y = ny;
              m.moving = true;
              if (Math.abs(dx) > Math.abs(dy)) m.dir = dx > 0 ? 2 : 1;
              else m.dir = dy > 0 ? 0 : 3;
            } else {
              m.waitUntil = t + 600;
              pickWander(m);
            }
          }
        }
      }
      // o campo de visão: perto e com linha reta até você
      if (t < state.encounterLockUntil) continue;
      const d = Math.hypot(state.player.x - m.x, state.player.y - m.y);
      if (d > m.vision) continue;
      if (!dungeonLineOfSight(state.map, m.x, m.y, state.player.x, state.player.y)) continue;
      startAlert(m, t);
      return;
    }
  }

  function startAlert(m, t) {
    state.paused = true;
    state.path = null;
    state.pending = null;
    state.alert = { monster: m, at: t + 320 };
    audio.error?.();
    const hist = state.history;
    const back = hist.find((h) => t - h.t >= 480) || hist[0] || { x: state.player.x, y: state.player.y };
    state.escapeSpot = { x: back.x, y: back.y };
  }

  function launchEncounter() {
    const m = state.alert?.monster;
    state.alert = null;
    if (!m) {
      state.paused = false;
      return;
    }
    const ok = onEncounter?.(m, state.ground, !!m.boss);
    if (!ok) {
      state.pendingMonster = null;
      state.paused = false;
      state.encounterLockUntil = clock() + 2500;
    }
  }

  function onDuelClosed() {
    if (!state.open) return;
    const m = state.pendingMonster;
    state.pendingMonster = null;
    state.paused = false;
    if (m) {
      const dead = m.boss ? !rpg.bossAlive(state.ground) : !rpg.monsterAlive(m.id);
      if (dead) {
        m.alive = false;
        if (m.boss) {
          state.boss = null;
          say(`${m.name} caiu. A cidade logo acima pode respirar.`, 5200);
          audio.chime();
        } else {
          say(`${m.name} virou pó. A passagem segue.`, 2200);
        }
      } else {
        // o bicho te expulsou: você recua e ele perde o rastro por um instante
        state.player.x = state.escapeSpot?.x ?? state.player.x;
        state.player.y = state.escapeSpot?.y ?? state.player.y;
        state.encounterLockUntil = clock() + 2600;
        say("Você recua antes de levar outra pergunta.", 2400);
      }
    }
    updateHud();
  }

  // ---- ciclo ----
  function update(dt, t) {
    const p = state.player;
    const beforeX = p.x;
    const beforeY = p.y;
    if (!state.paused && !blocked()) {
      if (state.path) updateAutoWalk(dt);
      else updateMovement(dt);
      state.history.push({ x: p.x, y: p.y, t });
      while (state.history.length > 40) state.history.shift();
      if (p.moving && Math.hypot(p.x - beforeX, p.y - beforeY) > 0.001) {
        if (!state.footAt || t - state.footAt > 340) {
          state.footAt = t;
          audio.footstep?.();
        }
      }
      if (!state.paused) updateMonsters(dt, t);
    } else if (state.alert && t >= state.alert.at && !blocked()) {
      const m = state.alert.monster;
      state.pendingMonster = m;
      launchEncounter();
      return;
    }

    const ri = roomIndexAt(state.map, p.x, p.y);
    if (ri !== state.roomIndex) {
      state.roomIndex = ri;
      const room = state.map.rooms[ri];
      if (room) {
        say(room.kind === "city" ? `${room.name}. Aqui a caverna descansa.` : `${room.name}.`, 3400);
      }
    }
    if (state.msg && t > state.msg.until) {
      state.msg = null;
      const node = $("dg-msg");
      if (node) node.textContent = "";
    }

    const near = nearestInteractable(p.x, p.y, 1.7);
    const prompt = $("dg-prompt");
    if (prompt) {
      const label = near?.kind === "chest" && near.opened ? "baú vazio" : near?.label || "";
      prompt.hidden = !near;
      const span = prompt.querySelector("span");
      if (span && span.textContent !== label) span.textContent = label;
    }

    if (t - state.hudAt > 220) {
      state.hudAt = t;
      updateHud();
    }
  }

  function draw(t) {
    if (!ctx || !state.map) return;
    const dpr = state.dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;

    const vw = state.vw;
    const vh = state.vh;
    const scale = clamp(Math.min(vw / (27 * TILE), vh / (18 * TILE)), 1.15, 3.4);
    const viewW = vw / scale;
    const viewH = vh / scale;
    const camX = clamp(state.player.x * TILE - viewW / 2, 0, state.map.W * TILE - viewW);
    const camY = clamp(state.player.y * TILE - viewH / 2, 0, state.map.H * TILE - viewH);
    state.view = { scale, camX, camY };

    const palette = state.def.palette;
    ctx.fillStyle = palette.wall;
    ctx.fillRect(0, 0, vw, vh);
    ctx.save();
    ctx.scale(scale, scale);
    ctx.translate(-camX, -camY);

    const x0 = Math.max(0, Math.floor(camX / TILE) - 1);
    const x1 = Math.min(state.map.W - 1, Math.ceil((camX + viewW) / TILE) + 1);
    const y0 = Math.max(0, Math.floor(camY / TILE) - 1);
    const y1 = Math.min(state.map.H - 1, Math.ceil((camY + viewH) / TILE) + 1);
    const cityIndex = state.map.rooms.findIndex((r) => r.kind === "city");

    // chão e decoração
    for (let ty = y0; ty <= y1; ty++) {
      for (let tx = x0; tx <= x1; tx++) {
        if (dungeonSolid(state.map, tx, ty)) continue;
        const px = tx * TILE;
        const py = ty * TILE;
        const city = state.map.roomGrid[ty * state.map.W + tx] === cityIndex;
        ctx.fillStyle = city ? "#2b3150" : (tx + ty) % 2 ? palette.floor : palette.floor2;
        ctx.fillRect(px, py, TILE, TILE);
        const h = hash2(tx, ty);
        if (city) {
          ctx.fillStyle = "rgba(255,255,255,0.04)";
          if ((tx + ty) % 4 === 0) ctx.fillRect(px, py + 7, TILE, 1);
        } else if (h > 0.93) {
          // cogumelo
          ctx.fillStyle = "#3a2f22";
          ctx.fillRect(px + 6, py + 9, 2, 4);
          ctx.fillStyle = palette.accent;
          ctx.globalAlpha = 0.7;
          ctx.fillRect(px + 4, py + 7, 6, 3);
          ctx.globalAlpha = 1;
        } else if (h > 0.88) {
          ctx.fillStyle = "rgba(0,0,0,0.22)";
          ctx.fillRect(px + 4, py + 10, 5, 2);
          ctx.fillRect(px + 10, py + 5, 2, 2);
        } else if (h > 0.84) {
          // cascalho
          ctx.fillStyle = "rgba(255,255,255,0.06)";
          ctx.fillRect(px + 5, py + 5, 2, 1);
          ctx.fillRect(px + 9, py + 8, 1, 1);
        }
      }
    }

    // paredes com sombra no chão de baixo
    for (let ty = y0; ty <= y1; ty++) {
      for (let tx = x0; tx <= x1; tx++) {
        if (!dungeonSolid(state.map, tx, ty)) continue;
        let nearFloor = false;
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
          if (!dungeonSolid(state.map, tx + dx, ty + dy)) nearFloor = true;
        }
        if (!nearFloor) continue;
        const px = tx * TILE;
        const py = ty * TILE;
        ctx.fillStyle = palette.wall;
        ctx.fillRect(px, py, TILE, TILE);
        ctx.fillStyle = "rgba(255,255,255,0.05)";
        ctx.fillRect(px, py, TILE, 2);
        if (!dungeonSolid(state.map, tx, ty + 1)) {
          ctx.fillStyle = palette.wallTop;
          ctx.fillRect(px, py + TILE - 3, TILE, 3);
          ctx.fillStyle = "rgba(0,0,0,0.34)";
          ctx.fillRect(px, py + TILE, TILE, 5);
        }
      }
    }

    // tochas nas paredes
    for (const prop of state.props) {
      if (prop.kind === "torch") drawTorch(ctx, prop.x * TILE, prop.y * TILE, t, palette.accent);
    }

    // entidades ordenadas por y
    const drawables = [];
    for (const chest of state.chests) {
      drawables.push({
        y: chest.y,
        draw: () => drawChest(ctx, chest.x * TILE, chest.y * TILE, chest.opened, palette.accent),
      });
    }
    for (const prop of state.props) {
      if (!prop.interact && prop.kind !== "stairs" && prop.kind !== "building") continue;
      drawables.push({
        y: prop.y + (prop.kind === "building" ? (prop.h || 0) / TILE : 0),
        draw: () => {
          if (prop.kind === "stairs") drawStairs(ctx, prop.x * TILE, prop.y * TILE, palette.accent);
          else if (prop.kind === "altar") drawAltar(ctx, prop.x * TILE, prop.y * TILE, t, palette.accent);
          else if (prop.kind === "forge") drawForge(ctx, prop.x * TILE, prop.y * TILE, t, palette.accent);
          else if (prop.kind === "waystone") drawWaystone(ctx, prop.x * TILE, prop.y * TILE, t, palette.accent);
          else if (prop.kind === "keeper") drawKeeper(ctx, prop.x * TILE, prop.y * TILE, t, palette.accent);
          else if (prop.kind === "garden") {
            drawGarden(ctx, prop.x * TILE, prop.y * TILE, t, palette.accent, t >= prop.readyAt);
          }
          else if (prop.kind === "building") {
            drawBuilding(ctx, prop.x * TILE, prop.y * TILE, prop.w, prop.h, palette, palette.accent);
          }
        },
      });
    }
    for (const m of state.monsters) {
      if (!m.alive) continue;
      drawables.push({ y: m.y, draw: () => drawMonster(m, t) });
    }
    if (state.boss?.alive) drawables.push({ y: state.boss.y, draw: () => drawMonster(state.boss, t) });
    // o gato entra antes do aventureiro: parado no mesmo tile, ele fica atrás
    if (state.history.length > 14) {
      const trail = state.history[state.history.length - 14];
      if (Math.hypot(trail.x - state.player.x, trail.y - state.player.y) < 5) {
        drawables.push({ y: trail.y, draw: () => drawCat(ctx, trail.x * TILE, trail.y * TILE, t) });
      }
    }
    drawables.push({
      y: state.player.y,
      draw: () => drawAdventurer(ctx, state.player.x * TILE, state.player.y * TILE, state.player.dir, state.player.moving, t, palette.accent),
    });
    drawables.sort((a, b) => a.y - b.y);
    for (const d of drawables) d.draw();

    ctx.restore();

    // escuridão: a lanterna do aventureiro e a tocha
    const sx = (state.player.x * TILE - camX) * scale;
    const sy = (state.player.y * TILE - camY) * scale;
    const inCity = cityIndex >= 0 && state.roomIndex === cityIndex;
    const radius = (inCity ? CITY_LIGHT : state.torchUntil > clock() ? 11 : 7.2) * TILE * scale;
    const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, radius);
    grad.addColorStop(0, "rgba(3,5,12,0)");
    grad.addColorStop(0.55, "rgba(3,5,12,0.14)");
    grad.addColorStop(1, inCity ? "rgba(3,5,12,0.56)" : "rgba(3,5,12,0.86)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, vw, vh);

    // a luz das tochas volta por cima do breu
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const glowSprite = torchGlowSprite();
    for (const prop of state.props) {
      if (prop.kind !== "torch") continue;
      const tx = (prop.x * TILE - camX) * scale;
      const ty = (prop.y * TILE - camY) * scale;
      if (tx < -140 || tx > vw + 140 || ty < -140 || ty > vh + 140) continue;
      const r = 4.6 * TILE * scale;
      ctx.drawImage(glowSprite, tx - r, ty - r, r * 2, r * 2);
    }
    ctx.restore();
  }

  function drawMonster(m, t) {
    const x = m.x * TILE;
    const y = m.y * TILE;
    const d = Math.hypot(state.player.x - m.x, state.player.y - m.y);
    if (d < m.vision + 3) {
      ctx.save();
      ctx.globalAlpha = 0.18;
      ctx.strokeStyle = m.accent;
      ctx.setLineDash([3, 5]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, m.vision * TILE, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
    if (m.boss) {
      const glow = 0.1 + Math.sin(t * 0.004) * 0.05;
      ctx.save();
      ctx.globalAlpha = glow;
      ctx.fillStyle = m.accent;
      ctx.beginPath();
      ctx.arc(x, y - 20, 34, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    ctx.save();
    ctx.translate(x, y);
    drawCreature(ctx, m.kind, m.accent, t + m.x * 90, m.boss ? 1.15 : 0.95);
    ctx.restore();
    if (state.alert?.monster === m) {
      ctx.save();
      ctx.fillStyle = "#ffc857";
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "center";
      ctx.fillText("!", x, y - 42);
      ctx.restore();
    }
  }

  function frame(t) {
    if (!state.open) return;
    state.raf = requestAnimationFrame(frame);
    const dt = state.last ? Math.min(0.05, (t - state.last) / 1000) : 0.016;
    state.last = t;
    update(dt, t);
    draw(t);
  }

  // ---- eventos ----
  function blocked() {
    return !!isBlocked?.();
  }

  function onKeyDown(e) {
    if (!state.open || blocked()) return;
    const tag = (e.target.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea") return;
    const k = e.key.toLowerCase();
    if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k)) e.preventDefault();
    if (k === "escape") {
      close("stairs");
      return;
    }
    if (state.paused) return;
    if (k === " " || e.code === "Space") {
      state.sprint = true;
      return;
    }
    if (k === "f") {
      e.preventDefault();
      interact();
      return;
    }
    if (k === "c") {
      onSheet?.();
      return;
    }
    state.keys.add(k);
  }

  function onKeyUp(e) {
    if (!state.open) return;
    const k = e.key.toLowerCase();
    state.keys.delete(k);
    if (k === " " || e.code === "Space") state.sprint = false;
  }

  function onBlur() {
    state.keys.clear();
    state.sprint = false;
  }

  function onPointer(e) {
    if (!state.open || state.paused || blocked()) return;
    if (e.button !== undefined && e.button !== 0) return;
    const rect = canvas.getBoundingClientRect();
    const { scale, camX, camY } = state.view;
    const wx = ((e.clientX - rect.left) / scale + camX) / TILE;
    const wy = ((e.clientY - rect.top) / scale + camY) / TILE;
    const hit = nearestInteractable(wx, wy, 1.5);
    if (hit) {
      const d = Math.hypot(hit.x - state.player.x, hit.y - state.player.y);
      const clear = dungeonLineOfSight(state.map, state.player.x, state.player.y, hit.x, hit.y);
      if (d <= 1.7 && clear) act(hit);
      else setPathTo(hit.x, hit.y, hit);
      return;
    }
    setPathTo(wx, wy);
  }

  function onResize() {
    if (state.open) resize();
  }

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", onBlur);
  window.addEventListener("resize", onResize);
  canvas?.addEventListener("pointerdown", onPointer);
  $("dg-exit")?.addEventListener("click", () => close("stairs"));
  $("dg-sheet")?.addEventListener("click", () => onSheet?.());

  return {
    open,
    close,
    isOpen: () => state.open,
    onDuelClosed,
    useTorch(ms = 120000) {
      state.torchUntil = Math.max(state.torchUntil, clock() + ms);
      say("A tocha acende. A caverna fica menor.", 2600);
      updateHud();
    },
    useBomb() {
      if (!state.open) return { ok: false, hit: 0 };
      const p = state.player;
      let hit = 0;
      for (const m of state.monsters) {
        if (!m.alive) continue;
        if (Math.hypot(m.x - p.x, m.y - p.y) > 3) continue;
        if (!dungeonLineOfSight(state.map, p.x, p.y, m.x, m.y)) continue;
        m.alive = false;
        rpg.data.monsters[m.id] = Date.now();
        hit++;
      }
      rpg.save();
      const bossClose = state.boss?.alive
        && Math.hypot(state.boss.x - p.x, state.boss.y - p.y) <= 3
        && dungeonLineOfSight(state.map, p.x, p.y, state.boss.x, state.boss.y);
      if (bossClose) say("O chefe nem sentiu. A bomba só o irritou.", 3000);
      else if (hit) say(`Bum. ${hit} bicho(s) viraram fumaça. Sem XP, sem saque.`, 3400);
      else say("A bomba estourou no vazio.", 2400);
      audio.error?.();
      updateHud();
      return { ok: hit > 0, hit, bossClose };
    },
    get state() { return state; },
  };
}

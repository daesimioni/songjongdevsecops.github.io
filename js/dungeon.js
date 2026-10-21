// A caverna: um mapa próprio, em tela cheia, com salas e túneis que se cruzam.
// O bicho que vê você começa a batalha sozinho, como nos jogos de bolso: anda
// pelo corredor, entra no campo de visão, exclama e chama o duelo de perguntas.
import { TILE, PLAYER_W, PLAYER_H } from "./config.js";
import { dungeonById, creatureId, creatureKind, creatureAccent } from "./dungeon-data.js";
import { GROUNDS, ITEMS, TIERS } from "./rpg-data.js";
import { PET_BY_CONTINENT, PETS } from "./pets.js";
import { drawCreature } from "./creature.js";
import { drawHuman } from "./human.js";
import { findPathIn } from "./path.js";
import { hash2 } from "./world.js";
import { drawPetSprite } from "./pet-art.js";
import { drawSkiff } from "./skiff.js";

const $ = (id) => document.getElementById(id);
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const clock = () => performance.now();

const SPEED = 4.6; // tiles por segundo
const SPRINT = 3.6;
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
  const layout = def.layout;
  const W = layout.width;
  const H = layout.height;
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
  const style = def.tunnel || "elbow";
  const half = style === "wide" ? 2 : style === "narrow" ? 0 : 1;
  const hRun = (x0, x1, y) => {
    const lo = Math.min(x0, x1), hi = Math.max(x0, x1);
    for (let x = lo; x <= hi; x++) for (let d = -half; d <= half; d++) carve(x, y + d);
  };
  const vRun = (y0, y1, x) => {
    const lo = Math.min(y0, y1), hi = Math.max(y0, y1);
    for (let y = lo; y <= hi; y++) for (let d = -half; d <= half; d++) carve(x + d, y);
  };
  layout.corridors.forEach(([aId, bId], ci) => {
    const a = byId.get(aId);
    const b = byId.get(bId);
    if (!a || !b) return;
    const ax = a.x + Math.floor(a.w / 2);
    const ay = a.y + Math.floor(a.h / 2);
    const bx = b.x + Math.floor(b.w / 2);
    const by = b.y + Math.floor(b.h / 2);
    if (style === "split") {
      const mx = Math.floor((ax + bx) / 2);
      hRun(ax, mx, ay);
      vRun(ay, by, mx);
      hRun(mx, bx, by);
    } else if (style === "zigzag") {
      const my = Math.floor((ay + by) / 2);
      vRun(ay, my, ax);
      hRun(ax, bx, my);
      vRun(my, by, bx);
    } else if (style === "cross" && ci % 2 === 1) {
      vRun(ay, by, ax);
      hRun(ax, bx, by);
    } else {
      hRun(ax, bx, ay);
      vRun(ay, by, bx);
    }
  });

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
function drawAdventurer(ctx, x, y, dir, moving, t, avatar = {}, look = null, gear = null) {
  // O mesmo boneco da superfície, com capa e lanterna por cima. A nave é
  // desenhada por drawSkiff, em skiff.js, para o casco ser o mesmo nos dois
  // lugares.
  const c = { hair: "#3a2a55", skin: "#f0c9a8", shirt: "#61f4c0", pants: "#2f3a66", ...avatar };
  const animate = moving;
  const frame = animate ? Math.floor(t / 115) % 4 : 0;
  const swing = animate ? [0, 1, 0, -1][frame] : 0;
  const bob = animate && (frame === 1 || frame === 3) ? -1 : 0;
  ctx.save();
  ctx.translate(x, y + bob);
  // capa atrás do corpo, balançando com o passo
  ctx.fillStyle = "#242844";
  ctx.fillRect(-6 + (swing > 0 ? 1 : 0), -15, 12, 11);
  ctx.fillStyle = "#1b1f37";
  ctx.fillRect(-5, -5 + (swing < 0 ? 1 : 0), 10, 2);
  drawHuman(ctx, 0, 0, dir, animate, t, c, 1, look, gear);
  // lanterna na mão direita, com halo curto
  ctx.fillStyle = "rgba(255,200,87,0.16)";
  ctx.beginPath();
  ctx.arc(7, -7, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2a2438";
  ctx.fillRect(6, -9, 3, 4);
  ctx.fillStyle = "#ffc857";
  ctx.fillRect(7, -8, 1, 2);
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

function drawStairs(ctx, x, y, accent, t = 0) {
  const glow = 0.5 + Math.sin(t * 0.004) * 0.16;
  ctx.save();
  ctx.translate(x, y);
  // sombra no chão
  ctx.fillStyle = "rgba(0,0,0,0.38)";
  ctx.beginPath();
  ctx.ellipse(0, 0, 13, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  // vão da escada
  ctx.fillStyle = "#070a13";
  ctx.fillRect(-11, -24, 22, 24);
  // degraus: cada um sobe 4px e afina 1px de cada lado, e o de cima é o mais claro
  const treads = [
    [-10, -4, 20, "#2f3a5c", "#4d5d90"],
    [-9, -8, 18, "#374469", "#56699f"],
    [-8, -12, 16, "#40507b", "#6177af"],
    [-7, -16, 14, "#4a5c8d", "#6e86bf"],
    [-6, -20, 12, "#55699c", "#7d95cf"],
  ];
  for (const [dx, dy, w, riser, tread] of treads) {
    ctx.fillStyle = riser;
    ctx.fillRect(dx, dy, w, 3);
    ctx.fillStyle = tread;
    ctx.fillRect(dx, dy - 1, w, 1);
  }
  // paredes laterais
  ctx.fillStyle = "#141a29";
  ctx.fillRect(-13, -24, 2, 25);
  ctx.fillRect(11, -24, 2, 25);
  ctx.fillStyle = "#2b3654";
  ctx.fillRect(-13, -24, 2, 1);
  ctx.fillRect(11, -24, 2, 1);
  // a abertura lá em cima, com a luz da superfície vazando pela pedra
  ctx.fillStyle = `rgba(255,233,176,${0.55 + glow * 0.3})`;
  ctx.fillRect(-6, -24, 12, 2);
  const halo = ctx.createRadialGradient(0, -26, 1, 0, -26, 13);
  halo.addColorStop(0, `rgba(255,233,176,${0.2 + glow * 0.12})`);
  halo.addColorStop(1, "rgba(255,233,176,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(-14, -40, 28, 18);
  // seta de pedra apontando para cima, para o sentido não deixar dúvida
  ctx.fillStyle = `rgba(255,233,176,${0.55 + glow * 0.3})`;
  ctx.fillRect(-1, -38, 2, 1);
  ctx.fillRect(-2, -37, 4, 1);
  ctx.fillRect(-3, -36, 6, 1);
  ctx.fillRect(-1, -35, 2, 5);
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

function drawPortal(ctx, x, y, t, accent) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.beginPath();
  ctx.ellipse(0, 0, 15, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2a3048";
  ctx.fillRect(-15, -30, 5, 30);
  ctx.fillRect(10, -30, 5, 30);
  ctx.fillRect(-15, -34, 30, 6);
  ctx.fillStyle = "#0b1020";
  ctx.fillRect(-10, -29, 20, 28);
  const pulse = 0.35 + Math.sin(t * 0.003) * 0.2;
  ctx.globalAlpha = pulse;
  ctx.fillStyle = accent;
  ctx.fillRect(-8, -27, 16, 25);
  ctx.globalAlpha = pulse + 0.2;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    const yy = -24 + ((t * 0.02 + i * 8) % 22);
    ctx.beginPath();
    ctx.moveTo(-7, yy);
    ctx.lineTo(7, yy - 3);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = accent;
  ctx.fillRect(-17, -37, 3, 3);
  ctx.fillRect(14, -37, 3, 3);
  ctx.restore();
}

function drawTunnel(ctx, x, y, t, accent) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.beginPath();
  ctx.ellipse(0, 0, 12, 3.4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#242a3c";
  ctx.fillRect(-11, -16, 22, 16);
  ctx.fillStyle = "#0a0d17";
  ctx.beginPath();
  ctx.arc(0, -15, 9, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.5 + Math.sin(t * 0.004) * 0.2;
  ctx.fillRect(-7, -14, 2, 8);
  ctx.fillRect(5, -14, 2, 8);
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#3b4466";
  ctx.fillRect(-12, -18, 4, 3);
  ctx.fillRect(8, -18, 4, 3);
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

function drawPlot(ctx, x, y, t, accent, planted, ready) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#2a2116";
  ctx.fillRect(-10, -7, 20, 7);
  ctx.fillStyle = "#1a2a1c";
  ctx.fillRect(-9, -6, 18, 1);
  for (let i = 0; i < 3; i++) {
    const sway = Math.sin(t * 0.003 + i * 1.4) * 0.7;
    if (ready) {
      ctx.fillStyle = accent;
      ctx.fillRect(-7 + i * 6, -13 + sway, 2, 6);
      ctx.fillRect(-4 + i * 6, -11 - sway, 2, 5);
    } else if (planted) {
      ctx.fillStyle = "#4a7a4e";
      ctx.fillRect(-7 + i * 6, -8, 2, 2);
    } else {
      ctx.fillStyle = "#3a2f22";
      ctx.fillRect(-6 + i * 6, -5, 2, 1);
    }
  }
  ctx.restore();
}

function drawVein(ctx, x, y, t, accent, charges) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.ellipse(0, 0, 11, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2c2b3e";
  ctx.fillRect(-10, -9, 20, 9);
  ctx.fillRect(-7, -14, 14, 6);
  if (charges > 0) {
    const glow = 0.5 + Math.sin(t * 0.004) * 0.25;
    ctx.globalAlpha = glow;
    ctx.fillStyle = accent;
    ctx.fillRect(-6, -12, 3, 5);
    ctx.fillRect(1, -13, 3, 7);
    ctx.fillRect(5, -10, 2, 3);
    ctx.globalAlpha = 1;
  } else {
    ctx.fillStyle = "#4c4a58";
    ctx.fillRect(-6, -11, 2, 3);
    ctx.fillRect(2, -12, 2, 4);
  }
  ctx.restore();
}

function drawPet(ctx, x, y, t, accent, kind, tamed) {
  ctx.save();
  if (tamed) {
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.22 + Math.sin(t * 0.004) * 0.08;
    ctx.beginPath();
    ctx.ellipse(x, y + 1, 9, 3.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  drawPetSprite(ctx, kind, x, y, t, false);
  ctx.restore();
}

function drawEnchanter(ctx, x, y, t, accent) {
  const glow = 0.35 + Math.sin(t * 0.004) * 0.18;
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.ellipse(0, 0, 12, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2d3048";
  ctx.fillRect(-11, -9, 22, 9);
  ctx.fillStyle = "#3f4468";
  ctx.fillRect(-9, -13, 18, 4);
  ctx.globalAlpha = glow;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, -12, 7, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.fillStyle = accent;
  ctx.fillRect(-1, -22 + Math.sin(t * 0.005) * 1.2, 2, 6);
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
export function createDungeon({ rpg, audio, onEncounter, onSheet, onInventory, onGather, onExit, onKeeper, onConurbation, onPortal, isBlocked, avatar = {}, look = null, gear = null }) {
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
    terrain: null,
    seen: null,
    minimapAt: 0,
    path: null,
    pending: null,
    keys: new Set(),
    sprint: false,
    paused: false,
    alert: null,
    pack: [],
    partnerMonsters: [],
    duelMonster: null,
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
    quality: 1,
    perfMs: 0,
    perfN: 0,
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

  // Separação entre bichos: cada um passeia até MONSTER_ROAM da sua casa. Se
  // a distância entre duas casas for maior que a soma dos alcances de visão
  // mais os dois passeios, os círculos de visão não se tocam e nenhum ponto do
  // mapa pode ser visto pelos dois ao mesmo tempo. É a garantia contra matilha.
  const MONSTER_ROAM = 0.6;
  const MONSTER_GAP = 0.25;

  function visionFor(kind, tier) {
    return 3.2 + tier * 0.45 + (kind === "bat" ? 0.4 : kind === "wisp" ? 0.3 : kind === "note" ? 0.25 : kind === "node" ? 0.2 : kind === "spider" ? 0.2 : kind === "glyph" || kind === "prism" ? 0.15 : kind === "vector" ? 0.1 : kind === "scorpion" ? 0.1 : 0);
  }

  // folga: positivo quer dizer que os dois círculos, já com o passeio, não se
  // cruzam nem com a margem de segurança
  function folgaDeVisao(x, y, vision, postos) {
    let folga = Infinity;
    for (const p of postos) {
      const d = Math.hypot(x - p.x, y - p.y);
      folga = Math.min(folga, d - (vision + p.vision + MONSTER_ROAM + p.roam + MONSTER_GAP));
    }
    return folga;
  }

  function melhorPosto(plano, postos) {
    const room = plano.room;
    const passos = 6;
    let melhor = null;
    let melhorFolga = -Infinity;
    for (let i = 0; i <= passos; i++) {
      for (let j = 0; j <= passos; j++) {
        const x = room.x + 1 + ((i + 0.5) / (passos + 1)) * (room.w - 2);
        const y = room.y + 1 + ((j + 0.5) / (passos + 1)) * (room.h - 2);
        const folga = folgaDeVisao(x, y, plano.vision, postos);
        if (folga > melhorFolga) { melhorFolga = folga; melhor = { x, y }; }
      }
    }
    return melhorFolga >= 0 ? melhor : null;
  }

  function makeMonster(def, room, k, name, tier, post) {
    const kind = creatureKind(def, name, tier, k);
    const baseSpeed = { bat: 0.82, spider: 0.46, slime: 0.58, eye: 0.54, golem: 0.5, wisp: 0.7, scorpion: 0.5, ant: 0.78, moth: 0.86, beetle: 0.42, crab: 0.64, jelly: 0.36, imp: 0.74, sentinel: 0.38, serpent: 0.52, tome: 0.4, glyph: 0.66, note: 0.8, atom: 0.6, crystal: 0.38, gear: 0.46, node: 0.68, prism: 0.5, vector: 0.74, flask: 0.54 }[kind] || 0.55;
    const x = post.x;
    const y = post.y;
    return {
      id: creatureId(def, room.id, k),
      name,
      tier,
      kind,
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
      vision: visionFor(kind, tier),
      roam: MONSTER_ROAM,
      // meia-lua: o bicho vê na direção em que está virado
      fov: { bat: 1.5, spider: 1.0, slime: 1.35, eye: 1.15, golem: 0.85, wisp: 1.4, scorpion: 0.95, ant: 1.3, moth: 1.55, beetle: 0.8, crab: 1.1, jelly: 0.7, imp: 1.25, sentinel: 1.05, serpent: 1.2, tome: 1.05, glyph: 1.35, note: 1.5, atom: 1.25, crystal: 0.85, gear: 0.9, node: 1.3, prism: 1.2, vector: 1.15, flask: 1.1 }[kind] || 1.2,
      // ritmo próprio: a espécie que voa não para no mesmo compasso da que
      // rasteja, e o passeio vai em cadeia (dois ou três pontos antes de parar)
      speed: (baseSpeed + tier * 0.12) * (0.85 + Math.random() * 0.4),
      passos: 2 + Math.floor(Math.random() * 3),
      pausaCurta: 120 + Math.random() * 320,
      pausaLonga: 500 + Math.random() * 1100,
      olharEm: 0,
      waitUntil: clock() + 300 + Math.random() * 900,
      accent: creatureAccent(def, name, k),
      continent: def.continent,
      theme: room.theme,
      roomId: room.id,
      boss: false,
    };
  }

  function spawnMonsters(def) {
    if (def.hub) return [];
    const names = def.monsters || [];
    const bossRoom = def.rooms.find((r) => r.id === def.layout.bossRoom);
    const planos = [];
    let n = 0;
    for (const room of def.rooms) {
      if (room.kind === "entrance" || room.kind === "city") continue;
      const tier = clamp(room.tier || 1, 1, 3);
      const name = names[n % Math.max(1, names.length)] || "Coisa";
      n++;
      // o chefe mora sozinho: comum e chefe na mesma sala veriam o jogador
      // juntos, que é exatamente o combo que esta regra proíbe
      if (bossRoom && room.id === bossRoom.id) continue;
      const id = creatureId(def, room.id, 0);
      if (!rpg.monsterAlive(id)) continue;
      const kind = creatureKind(def, name, tier);
      planos.push({ room, name, tier, kind, vision: visionFor(kind, tier), id });
    }
    // A ordem de escolha muda o resultado do encaixe. Tentar as ordens mais
    // prováveis e ficar com a que coloca mais bichos evita perder um bicho
    // numa sala apertada só porque outro escolheu primeiro.
    const ordens = [
      [...planos].sort((a, b) => b.vision - a.vision),
      [...planos].sort((a, b) => a.vision - b.vision),
      [...planos].sort((a, b) => (b.room.w * b.room.h) - (a.room.w * a.room.h)),
      planos,
    ];
    let melhor = null;
    for (const ordem of ordens) {
      const postos = [];
      if (bossRoom) postos.push({ x: bossRoom.x + bossRoom.w / 2, y: bossRoom.y + bossRoom.h / 2, vision: 5.6, roam: 0 });
      const atribuidos = [];
      for (const plano of ordem) {
        const posto = melhorPosto(plano, postos);
        if (!posto) continue;
        atribuidos.push([plano, posto]);
        postos.push({ x: posto.x, y: posto.y, vision: plano.vision, roam: MONSTER_ROAM });
      }
      if (!melhor || atribuidos.length > melhor.length) melhor = atribuidos;
      if (melhor.length === planos.length) break;
    }
    for (const [plano, posto] of melhor || []) plano.post = posto;
    const out = [];
    for (const plano of planos) {
      if (!plano.post) continue;
      out.push(makeMonster(def, plano.room, 0, plano.name, plano.tier, plano.post));
    }
    return out;
  }

  function spawnBoss(def) {
    if (def.hub || !def.boss) return null;
    const room = def.rooms.find((r) => r.id === def.layout.bossRoom) || def.rooms[def.rooms.length - 2];
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
      fov: 1.5,
      speed: 0.4,
      // o chefe anda devagar pela sala: sozinho, não entra na conta de separação
      roam: 1.1,
      passos: 1,
      pausaCurta: 700 + Math.random() * 500,
      pausaLonga: 1800 + Math.random() * 1400,
      olharEm: 0,
      waitUntil: clock() + 900,
      accent: def.bossAccent || def.palette.accent,
      continent: def.continent,
      theme: room.theme,
      roomId: room.id,
      boss: true,
    };
  }

  function makeChests(def) {
    if (def.hub) return [];
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
        stairMouth: "entrance",
        label: "subir para a superfície",
        interact: true,
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
      if (!def.hub) props.push({ kind: "conurbation", x: city.x + city.w / 2 + 6, y: city.y + 3.2, label: "túnel da conurbação", interact: true });
      props.push({ kind: "keeper", x: city.x + city.w / 2 - 3, y: city.y + city.h - 3.4, label: "conversar com a mestra", interact: true });
      props.push({ kind: "enchanter", x: city.x + city.w / 2, y: city.y + 3.2, label: "mesa de encantamento", interact: true });
      const petId = PET_BY_CONTINENT[def.continent] || "gato";
      props.push({
        kind: "pet",
        petId,
        x: city.x + 4.5,
        y: city.y + 4.2,
        label: `oferecer ração ao ${PETS[petId]?.name || "bicho"}`,
        interact: true,
      });
      for (let i = 0; i < 3; i++) {
        props.push({
          kind: "plot",
          x: city.x + 8.5 + i * 1.5,
          y: city.y + city.h - 3.4,
          plotKey: `${def.id}:${i}`,
          planted: false,
          readyAt: 0,
          interact: true,
          label: "horta de ervas",
        });
      }
      if (!def.hub) props.push({
        kind: "stairs",
        x: city.x + 6,
        y: city.y + city.h - 1.8,
        stairMouth: "far",
        label: "subir pelo túnel até a outra boca",
        interact: true,
      });
      props.push({ kind: "building", x: city.x + 1.2, y: city.y + 1.2, w: 26, h: 22, solid: true });
      props.push({ kind: "building", x: city.x + city.w - 4.8, y: city.y + 1.2, w: 30, h: 22, solid: true });
    }
    if (def.hub) {
      for (const portal of def.portals || []) {
        props.push({
          kind: "portal",
          portalDef: portal.defId,
          x: portal.x,
          y: portal.y,
          label: portal.label,
          interact: true,
        });
      }
    }
    // veios de cristal: mineração de verdade, com picareta
    for (const id of ["a", "c", "e"]) {
      const room = def.rooms.find((r) => r.id === id);
      if (!room) continue;
      props.push({
        kind: "vein",
        x: room.x + room.w - 2,
        y: room.y + room.h - 2.4,
        charges: 3,
        interact: true,
        label: "minerar o veio",
      });
    }
    return props;
  }

  function spawnPlayer(def, entryCave) {
    if (entryCave?.mouth === "far") {
      const far = state.props.find((p) => p.kind === "stairs" && p.stairMouth === "far");
      if (far) {
        state.player.x = far.x;
        state.player.y = far.y;
        state.player.dir = 3;
        state.player.moving = false;
        return;
      }
    }
    const entrance = def.rooms.find((r) => r.kind === "entrance") || def.rooms[0];
    state.player.x = entrance.x + entrance.w / 2;
    state.player.y = entrance.y + entrance.h - 2.2;
    state.player.dir = 3;
    state.player.moving = false;
  }

  function open(id, entryCave = null) {
    const def = typeof id === "string" ? dungeonById(id) : id;
    if (!def || !canvas || !ctx) return false;
    state.def = def;
    state.entryCave = entryCave || null;
    state.pack = [];
    state.map = buildDungeonMap(def);
    // chão e parede são estáticos: pinta uma vez por descida e cada quadro só
    // copia o pedaço visível (o detalhe fino não custa por frame)
    state.terrain = buildTerrain(state.map, def.palette);
    state.seen = new Uint8Array(state.map.W * state.map.H);
    state.minimapAt = 0;
    state.ground = groundFor(def);
    state.monsters = spawnMonsters(def);
    state.boss = rpg.bossAlive(state.ground) ? spawnBoss(def) : null;
    state.chests = makeChests(def);
    state.props = makeProps(def);
    // A horta é do jogador: o que foi plantado continua plantado na próxima
    // descida, e só colhe quando o tempo real passou.
    for (const prop of state.props) {
      if (prop.kind !== "plot") continue;
      const saved = rpg.data.plots?.[prop.plotKey];
      if (saved?.planted) {
        prop.planted = true;
        prop.readyAt = saved.readyAt;
        continue;
      }
      // A primeira horta de cada caverna nasce com uma erva de presente: sem
      // isso não há como tirar a primeira semente para começar a plantar.
      if (prop.plotKey === `${def.id}:0` && !rpg.data.plotGift?.[def.id]) {
        prop.planted = true;
        prop.readyAt = 0;
        prop.gift = true;
      }
    }
    // Cada escada aponta para uma boca: a de entrada volta para onde se desceu,
    // a do fundo sai na outra boca. Descendo pela outra boca, os papéis trocam.
    const pair = state.entryCave?.pair || null;
    const known = [state.entryCave, pair].filter(Boolean);
    const mouths = {
      entrance: known.find((c) => c.mouth === "entrance") || state.entryCave,
      far: known.find((c) => c.mouth === "far") || pair || state.entryCave,
    };
    for (const prop of state.props) {
      if (prop.kind !== "stairs") continue;
      const target = mouths[prop.stairMouth] || state.entryCave;
      if (target) {
        prop.cave = target;
        prop.label = `subir para ${target.name}`;
      }
    }
    // o que ocupa espaço de verdade dentro da sala: prédios e baús
    state.solids = [];
    for (const p of state.props) {
      if (p.kind === "plot") {
        state.solids.push({ x: p.x, y: p.y, hw: 0.55, hh: 0.3 });
        continue;
      }
      if (p.kind === "vein") {
        state.solids.push({ x: p.x, y: p.y, hw: 0.55, hh: 0.35 });
        continue;
      }
      if (p.kind === "enchanter") {
        state.solids.push({ x: p.x, y: p.y, hw: 0.7, hh: 0.4 });
        continue;
      }
      if (p.kind === "altar") {
        state.solids.push({ x: p.x, y: p.y, hw: 0.65, hh: 0.4 });
        continue;
      }
      if (p.kind === "forge") {
        state.solids.push({ x: p.x, y: p.y, hw: 0.7, hh: 0.45 });
        continue;
      }
      if (p.kind === "waystone") {
        state.solids.push({ x: p.x, y: p.y, hw: 0.4, hh: 0.35 });
        continue;
      }
      if (!p.solid) continue;
      const hw = p.w / TILE / 2;
      const hh = p.h / TILE / 2;
      state.solids.push({ x: p.x + hw, y: p.y + hh, hw, hh });
    }
    for (const c of state.chests) state.solids.push({ x: c.x, y: c.y, hw: 0.4, hh: 0.28 });
    state.path = null;
    state.pending = null;
    state.keys.clear();
    setSprint(false);
    state.boost = 0;
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

    spawnPlayer(def, state.entryCave);
    $("dungeon").hidden = false;
    setWorldInert(true);
    $("dungeon").dataset.dungeon = def.continent;
    $("dg-title").textContent = def.name;
    $("dg-sub").textContent = def.sub;
    $("dg-layer").textContent = def.layer === -2 ? "subsolo -2" : "subsolo -1";
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

  function enterCity() {
    const city = state.def?.rooms?.find((room) => room.kind === "city");
    if (!city) return false;
    state.player.x = city.x + city.w / 2 + 6;
    state.player.y = city.y + 5;
    state.player.dir = 0;
    state.player.moving = false;
    state.path = null;
    state.pending = null;
    state.alert = null;
    say(`${state.def.name}. A cidade do fundo.`, 3400);
    return true;
  }

  function close(kind = "stairs", targetCave = null) {
    if (!state.open) return;
    state.open = false;
    cancelAnimationFrame(state.raf);
    state.raf = 0;
    state.paused = false;
    pararSeguir();
    state.path = null;
    state.pending = null;
    state.keys.clear();
    setSprint(false);
    state.boost = 0;
    $("dungeon").hidden = true;
    setWorldInert(false);
    $("dg-prompt").hidden = true;
    audio.close();
    onExit?.({ kind, dungeon: state.def, entry: state.entryCave, target: targetCave || state.entryCave });
    state.entryCave = null;
  }

  function resize() {
    if (!canvas) return;
    state.dpr = Math.min(2, window.devicePixelRatio || 1) * state.quality;
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
    const buffs = rpg.buffView();
    setText("dg-buffs", buffs.length ? `efeitos ${buffs.map((b) => `${b.name} ${b.left}s`).join(" · ")}` : "");
    const buffNode = $("dg-buffs");
    if (buffNode) buffNode.hidden = buffs.length === 0;
    const room = state.map ? state.map.rooms[state.roomIndex] : null;
    setText("dg-room", room ? room.name : "");
    // coordenada e profundidade, no mesmo formato do minimapa da superfície
    const z = state.def?.layer === -2 ? -2 : -1;
    setText("dg-coord", `x ${Math.round(state.player.x)} y ${Math.round(state.player.y)} z ${z}`);
    const pack = $("dg-pack");
    if (pack) {
      pack.hidden = state.pack.length === 0;
      pack.textContent = state.pack.length ? `matilha ${state.pack.length}` : "";
    }
  }

  function markSeen(t) {
    if (!state.map || !state.seen || t - state.minimapAt < 120) return;
    state.minimapAt = t;
    const cx = Math.floor(state.player.x);
    const cy = Math.floor(state.player.y);
    for (let dy = -4; dy <= 4; dy++) {
      for (let dx = -4; dx <= 4; dx++) {
        if (dx * dx + dy * dy > 18) continue;
        const tx = cx + dx;
        const ty = cy + dy;
        if (dungeonSolid(state.map, tx, ty)) continue;
        state.seen[ty * state.map.W + tx] = 1;
      }
    }
    drawMinimap();
  }

  function drawMinimap() {
    const c = $("dg-map");
    if (!c || !c.offsetWidth || !state.map || !state.seen) return;
    const g = c.getContext("2d");
    const W = state.map.W;
    g.clearRect(0, 0, c.width, c.height);
    g.fillStyle = "rgba(5,8,20,0.86)";
    g.fillRect(0, 0, c.width, c.height);
    // A planta inteira aparece apagada antes de ser andada: o minimapa nasce
    // com o desenho da caverna, e não como um retângulo preto até o boneco
    // passar. O que já foi visto é que ganha cor.
    g.globalAlpha = 0.18;
    g.fillStyle = "#5f6f93";
    for (let y = 0; y < state.map.H; y++) {
      for (let x = 0; x < W; x++) {
        if (state.map.grid[y * W + x]) g.fillRect(x * 2, y * 2, 2, 2);
      }
    }
    for (let y = 0; y < state.map.H; y++) {
      for (let x = 0; x < W; x++) {
        if (!state.seen[y * W + x]) continue;
        const room = state.map.roomGrid[y * W + x] >= 0;
        g.globalAlpha = room ? 0.55 : 0.3;
        g.fillStyle = room ? state.def.palette.accent : "#8ea0c0";
        g.fillRect(x * 2, y * 2, 2, 2);
      }
    }
    g.globalAlpha = 1;
    for (const ch of state.chests) {
      if (!state.seen[Math.floor(ch.y) * W + Math.floor(ch.x)]) continue;
      g.fillStyle = "#ffc857";
      g.fillRect(Math.floor(ch.x) * 2 - 1, Math.floor(ch.y) * 2 - 1, 3, 3);
    }
    if (state.boss?.alive && state.seen[Math.floor(state.boss.y) * W + Math.floor(state.boss.x)]) {
      g.fillStyle = "#ff7aa8";
      g.fillRect(Math.floor(state.boss.x) * 2 - 1, Math.floor(state.boss.y) * 2 - 1, 3, 3);
    }
    // escadas: uma seta para cima, para achar a saída no minimapa
    for (const prop of state.props) {
      if (prop.kind !== "stairs") continue;
      const sx = Math.floor(prop.x);
      const sy = Math.floor(prop.y);
      if (!state.seen[sy * W + sx]) continue;
      g.fillStyle = "#ffe9b0";
      g.fillRect(sx * 2, sy * 2 - 3, 2, 2);
      g.fillRect(sx * 2 - 2, sy * 2 - 1, 2, 2);
      g.fillRect(sx * 2 + 2, sy * 2 - 1, 2, 2);
      g.fillRect(sx * 2, sy * 2 - 1, 2, 2);
    }
    // o herói tem anel e seta: um risco de 3 px some no meio do mapa
    const px = state.player.x * 2;
    const py = state.player.y * 2;
    g.beginPath();
    g.arc(px, py, 7, 0, Math.PI * 2);
    g.strokeStyle = "rgba(255,255,255,0.4)";
    g.lineWidth = 1.5;
    g.stroke();
    g.save();
    g.translate(px, py);
    g.rotate([Math.PI, Math.PI * 1.5, Math.PI * 0.5, 0][state.player.dir] || 0);
    g.beginPath();
    g.moveTo(0, -7);
    g.lineTo(-5, 5);
    g.lineTo(0, 2.5);
    g.lineTo(5, 5);
    g.closePath();
    g.fillStyle = "#fff";
    g.fill();
    g.lineWidth = 1.5;
    g.strokeStyle = "#070b18";
    g.stroke();
    g.restore();
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
    const step = SPEED * (state.sprint ? SPRINT : 1) * rpg.speedMult() * dt;
    const p = state.player;
    const ox = p.x;
    const oy = p.y;
    // A nave anda rápido demais para a colisão de um passo só.
    const chunks = Math.max(1, Math.ceil(step / 0.24));
    const part = step / chunks;
    for (let i = 0; i < chunks; i++) {
      if (boxFree(state.map, p.x + dx * part, p.y, 0, state.solids)) p.x += dx * part;
      if (boxFree(state.map, p.x, p.y + dy * part, 0, state.solids)) p.y += dy * part;
    }
    p.x = clamp(p.x, 0.6, state.map.W - 0.6);
    p.y = clamp(p.y, 0.6, state.map.H - 0.6);
    const moved = p.x !== ox || p.y !== oy;
    p.moving = moved;
    if (dx !== 0 && dy !== 0) p.dir = dy > 0 ? (dx < 0 ? 4 : 5) : (dx < 0 ? 6 : 7);
    else if (dx !== 0) p.dir = dx > 0 ? 2 : 1;
    else p.dir = dy > 0 ? 0 : 3;
    return moved;
  }

  function setPathTo(x, y, pending = null, silencioso = false) {
    // acha antes de limpar: arrastar por cima da parede não pode parar a
    // caminhada que já estava em curso
    const path = findPathIn(
      state.map.W,
      state.map.H,
      walkable,
      { x: state.player.x, y: state.player.y },
      { x, y },
      { goalPad: PATH_PAD },
    );
    if (!path || !path.length) {
      if (!silencioso) say("Não há passagem por ali.", 2200);
      return false;
    }
    state.path = path;
    state.pending = pending;
    return true;
  }

  function updateAutoWalk(dt) {
    const path = state.path;
    if (!path || !path.length) {
      state.path = null;
      return;
    }
    const stepLen = SPEED * (state.sprint ? SPRINT : 1) * rpg.speedMult() * dt * 1.05;
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
    // de vez em quando o baú guarda uma peça de equipamento do continente
    const gear = (state.def.equipment || []).filter((id) => rpg.itemCount(id) <= 0 && !Object.values(rpg.data.equipped || {}).includes(id));
    if (gear.length && Math.random() < 0.4) loot.push({ id: gear[Math.floor(Math.random() * gear.length)], qty: 1 });
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
      say(obj.cave ? `Você sobe em ${obj.cave.name}.` : "Você sobe de volta para o sol.", 1800);
      close("stairs", obj.cave);
      return;
    }
    if (obj.kind === "waystone") {
      say("A pedra puxa você de volta para a boca da caverna.", 1800);
      close("waystone", state.entryCave);
      return;
    }
    if (obj.kind === "conurbation") {
      onConurbation?.(state.def?.id);
      return;
    }
    if (obj.kind === "portal") {
      onPortal?.(obj.portalDef);
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
        "Semente na horta, picareta no veio, ração para o bicho. A cidade cobra em trabalho.",
        "A mesa de encantamento grava um efeito para sempre. Custou caro a quem a trouxe.",
      ];
      state.keeperLine = (state.keeperLine + 1) % lines.length;
      say(lines[state.keeperLine], 4500);
      onKeeper?.();
      return;
    }
    if (obj.kind === "plot") {
      if (!obj.planted) {
        if (rpg.itemCount("semente") <= 0) {
          say("A horta está vazia e falta semente. A forja faz semente de erva.");
          audio.error?.();
          return;
        }
        rpg.data.items.semente--;
        if (rpg.data.items.semente <= 0) delete rpg.data.items.semente;
        rpg.save();
        obj.planted = true;
        obj.readyAt = Date.now() + 45000;
        rpg.data.plots = rpg.data.plots || {};
        rpg.data.plots[obj.plotKey] = { planted: true, readyAt: obj.readyAt };
        rpg.save();
        say("Semente plantada. Em 45 segundos tem erva.", 3200);
        audio.blip();
        updateHud();
        return;
      }
      if (Date.now() < obj.readyAt) {
        say(`A horta ainda está crescendo. Faltam ${Math.ceil((obj.readyAt - Date.now()) / 1000)}s.`);
        return;
      }
      const qty = 2 + Math.floor(Math.random() * 2);
      rpg.addItem("erva", qty);
      // A primeira colheita sempre devolve uma semente: é o começo do ciclo.
      const seed = obj.gift || Math.random() < 0.5;
      if (seed) rpg.addItem("semente", 1);
      obj.planted = false;
      obj.readyAt = 0;
      if (rpg.data.plots) delete rpg.data.plots[obj.plotKey];
      if (obj.gift) {
        obj.gift = false;
        rpg.data.plotGift = rpg.data.plotGift || {};
        rpg.data.plotGift[state.def.id] = true;
      }
      rpg.save();
      say(`Colheu ${qty} erva(s)${seed ? " e uma semente" : ""}. A terra devolve.`, 3400);
      audio.blip();
      updateHud();
      return;
    }
    if (obj.kind === "vein") {
      if (obj.charges <= 0) {
        say("O veio está vazio. A pedra não devolve duas vezes.");
        return;
      }
      if (rpg.itemCount("picareta") <= 0) {
        say("O cristal está preso na pedra. Uma picareta de veio abre o veio.");
        audio.error?.();
        return;
      }
      // A picareta abre o veio, mas o que sai dele é decidido pela pergunta:
      // o sorteio é do app (gather.js) e o commit abaixo desconta a carga.
      onGather?.({
        kind: "vein",
        continent: state.def.continent,
        material: state.def.material,
        commit: (reward) => {
          if (obj.charges <= 0) return false;
          obj.charges--;
          say(`Picareta na pedra: ${reward.qty} ${ITEMS[reward.resource]?.name || "material"}.`, 3400);
          audio.chime();
          updateHud();
          return true;
        },
      });
      return;
    }
    if (obj.kind === "pet") {
      const petId = obj.petId || "gato";
      const pet = PETS[petId];
      if (rpg.petTamed(petId)) {
        say(`${pet?.name || "O bicho"} já caminha ao seu lado. Não é mais fome; é companhia.`);
        return;
      }
      const res = rpg.feedPet(petId);
      if (!res.ok) {
        say(res.reason);
        audio.error?.();
        return;
      }
      if (res.tamed) {
        say(`${res.name} aceitou a última ração e entrou na sua companhia. Escolha quem anda com você na Ficha (C).`, 5600);
        audio.chime();
      } else {
        say(`O bicho comeu. Afeição ${res.bond}/3.`, 3000);
        audio.blip();
      }
      updateHud();
      return;
    }
    if (obj.kind === "enchanter") {
      say("A mesa de encantamento. Grava um efeito permanente na sua lanterna.", 3000);
      onSheet?.();
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
    // O ponto sorteado é o mais longe que couber dentro do campo: assim o
    // bicho atravessa o campo em vez de dar dois passos e parar. O raio não
    // muda, então a conta de separação entre bichos continua valendo.
    let melhor = null;
    let melhorDist = -1;
    for (let i = 0; i < 10; i++) {
      const a = Math.random() * Math.PI * 2;
      const r = 0.2 + Math.random() * Math.max(0, (m.roam ?? MONSTER_ROAM) - 0.2);
      const tx = m.hx + Math.cos(a) * r;
      const ty = m.hy + Math.sin(a) * r;
      if (!boxFree(state.map, tx, ty, PATH_PAD, state.solids)) continue;
      const d = Math.hypot(tx - m.x, ty - m.y);
      if (d > melhorDist) {
        melhorDist = d;
        melhor = { x: tx, y: ty };
      }
    }
    if (melhor) {
      m.tx = melhor.x;
      m.ty = melhor.y;
    } else {
      m.tx = m.hx;
      m.ty = m.hy;
    }
  }

  function canSeePlayer(m) {
    if (!m?.alive) return false;
    const d = Math.hypot(state.player.x - m.x, state.player.y - m.y);
    if (d > m.vision) return false;
    const vx = m.dir === 1 ? -1 : m.dir === 2 ? 1 : 0;
    const vy = m.dir === 0 ? 1 : m.dir === 3 ? -1 : 0;
    const facing = d > 0.001 ? (vx * (state.player.x - m.x) + vy * (state.player.y - m.y)) / d : 1;
    if (facing < Math.cos(m.fov || 1.2)) return false;
    return dungeonLineOfSight(state.map, m.x, m.y, state.player.x, state.player.y);
  }

  function updateMonsters(dt, t) {
    const list = state.boss ? [...state.monsters, state.boss] : state.monsters;
    for (const m of list) {
      if (!m.alive) continue;
      {
        if (t >= m.waitUntil) {
          const dx = m.tx - m.x;
          const dy = m.ty - m.y;
          const dist = Math.hypot(dx, dy);
          if (dist < 0.12) {
            m.moving = false;
            if (m.passos > 0) {
              // ainda tem caminho na cadeia: pausa curta e segue
              m.passos -= 1;
              m.waitUntil = t + (m.pausaCurta || 240);
            } else {
              m.passos = 2 + Math.floor(Math.random() * 3);
              m.waitUntil = t + (m.pausaLonga || 900);
              // na pausa longa ele olha em volta, em vez de ficar congelado
              m.olharEm = t + 160 + Math.random() * 320;
            }
            pickWander(m);
          } else {
            const step = Math.min(dist, m.speed * dt);
            const nx = m.x + (dx / dist) * step;
            const ny = m.y + (dy / dist) * step;
            if (boxFree(state.map, nx, ny, PATH_PAD, state.solids)) {
              m.x = nx;
              m.y = ny;
              m.moving = true;
              if (Math.abs(dx) > 0.2 && Math.abs(dy) > 0.2) m.dir = dy > 0 ? (dx < 0 ? 4 : 5) : (dx < 0 ? 6 : 7);
              else if (Math.abs(dx) > Math.abs(dy)) m.dir = dx > 0 ? 2 : 1;
              else m.dir = dy > 0 ? 0 : 3;
            } else {
              m.waitUntil = t + 400;
              pickWander(m);
            }
          }
        }
        // parado, ele ainda vira a cabeça de vez em quando: bicho vivo não
        // fica olhando para o mesmo pixel
        if (!m.moving && m.olharEm && t >= m.olharEm) {
          m.dir = (m.dir + 1 + Math.floor(Math.random() * 3)) % 4;
          m.olharEm = t + 380 + Math.random() * 900;
        }
      }
      // o campo de visão: perto e com linha reta até você
      if (t < state.encounterLockUntil) continue;
      if (!canSeePlayer(m)) continue;
      startAlert(m, t);
      return;
    }
  }

  function startAlert(m, t) {
    rpg.noteMonster?.(m);
    state.pack = state.monsters
      .filter((o) => o !== m && o.alive && !o.boss && canSeePlayer(o) && Math.hypot(o.x - state.player.x, o.y - state.player.y) < 3.6)
      .slice(0, 3);
    if (state.pack.length) say(`Matilha: ${state.pack.length} bicho(s) entram junto com este.`, 3200);
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
    // até três bichos da matilha entram juntos com o primeiro; o resto vira fila
    const extras = m.boss ? [] : state.pack.splice(0, 3);
    state.partnerMonsters = extras;
    state.duelMonster = m;
    const ok = onEncounter?.(m, state.ground, !!m.boss, extras);
    if (!ok) {
      state.pendingMonster = null;
      state.paused = false;
      state.encounterLockUntil = clock() + 2500;
    }
  }

  function onDuelClosed() {
    if (!state.open) return;
    // reserva: se o pending foi limpo por outro caminho, o duelo ainda sabe
    // quem era o bicho da frente
    const m = state.pendingMonster || state.duelMonster;
    state.pendingMonster = null;
    state.duelMonster = null;
    state.paused = false;
    // respiro depois da briga: o vizinho não pode puxar duelo no mesmo passo
    state.encounterLockUntil = clock() + 6000;
    const partners = state.partnerMonsters || [];
    state.partnerMonsters = [];
    for (const partner of partners) {
      if (!rpg.monsterAlive(partner.id)) {
        partner.alive = false;
        say(`${partner.name} também caiu na mesma rodada.`, 2800);
      }
    }
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
        if (!m.boss && state.pack.length) {
          const next = state.pack.shift();
          if (next?.alive) {
            state.paused = true;
            state.pendingMonster = next;
            state.duelMonster = next;
            setTimeout(() => {
              if (!state.open || !state.paused) return;
              state.encounterLockUntil = 0;
              const ok = onEncounter?.(next, state.ground, false);
              if (!ok) { state.pendingMonster = null; state.paused = false; }
            }, 700);
          }
          updateHud();
        }
      } else {
        state.pack = [];
        // fugir custa: a chance de levar um golpe cresce com a dificuldade
        const risk = rpg.fleeRisk(m);
        if (Math.random() < risk) {
          const tier = m.boss ? 4 : m.tier;
          const res = rpg.takeDamage(TIERS[tier]?.damage || 2);
          if (!state.open) return;
          say(`${m.name} te alcançou na fuga: -${res.lost} de vida.`, 3800);
          audio.error?.();
          updateHud();
        } else {
          say("Você escapou sem um arranhão desta vez.", 2400);
        }
        state.player.x = state.escapeSpot?.x ?? state.player.x;
        state.player.y = state.escapeSpot?.y ?? state.player.y;
        state.encounterLockUntil = clock() + 2600;
      }
    }
    updateHud();
  }

  // ---- ciclo ----
  function update(dt, t) {
    const p = state.player;
    // a nave liga e desliga suave, como na superfície
    state.boost += ((state.sprint ? 1 : 0) - state.boost) * Math.min(1, dt * 8);
    if (state.boost < 0.01) state.boost = 0;
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

    markSeen(t);

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
      let label = near?.label || "";
      if (near?.kind === "chest" && near.opened) label = "baú vazio";
      if (near?.kind === "plot") {
        label = !near.planted
          ? "plantar semente"
          : near.readyAt > Date.now()
            ? `horta crescendo (${Math.ceil((near.readyAt - Date.now()) / 1000)}s)`
            : "colher erva";
      }
      if (near?.kind === "vein") label = near.charges > 0 ? `minerar o veio (${near.charges})` : "veio vazio";
      prompt.hidden = !near;
      const span = prompt.querySelector("span");
      if (span && span.textContent !== label) span.textContent = label;
    }

    if (t - state.hudAt > 220) {
      state.hudAt = t;
      updateHud();
    }
  }

  // O chão da caverna é estático: pinta uma vez por descida num canvas do
  // tamanho do mapa e cada quadro só copia o pedaço visível. Antes, cada tile
  // era um quadrado chapado do xadrez; agora o piso tem grão, rachadura e
  // parede serrada sem custo por frame.
  function buildTerrain(map, palette) {
    const cv = document.createElement("canvas");
    cv.width = map.W * TILE;
    cv.height = map.H * TILE;
    const g = cv.getContext("2d");
    if (!g) return cv;
    g.imageSmoothingEnabled = false;
    const cityIndex = map.rooms.findIndex((r) => r.kind === "city");
    const solid = (x, y) => dungeonSolid(map, x, y);
    // mancha larga de 3 em 3 tiles: o piso muda de tom como terreno, não
    // como xadrez de 16 px
    const patch = (x, y) => {
      const fx = x / 3, fy = y / 3;
      const x0 = Math.floor(fx), y0 = Math.floor(fy);
      const tx = fx - x0, ty = fy - y0;
      const a = hash2(x0, y0), b = hash2(x0 + 1, y0);
      const c = hash2(x0, y0 + 1), d = hash2(x0 + 1, y0 + 1);
      const topo = a + (b - a) * tx;
      const base = c + (d - c) * tx;
      return topo + (base - topo) * ty;
    };

    // chão
    for (let ty = 0; ty < map.H; ty++) {
      for (let tx = 0; tx < map.W; tx++) {
        if (solid(tx, ty)) continue;
        const px = tx * TILE, py = ty * TILE;
        const h = hash2(tx, ty);
        if (map.roomGrid[ty * map.W + tx] === cityIndex) {
          // lajotas de 8 px em fileiras alternadas
          g.fillStyle = patch(tx, ty) > 0.5 ? "#2b3150" : "#2f3557";
          g.fillRect(px, py, TILE, TILE);
          g.fillStyle = "rgba(9, 12, 24, 0.5)";
          for (let yy = 0; yy < TILE; yy += 8) {
            g.fillRect(px, py + yy + 7, TILE, 1);
            const off = ((yy / 8) + tx) % 2 ? 4 : 0;
            for (let xx = off; xx < TILE; xx += 8) g.fillRect(px + xx, py + yy, 1, 7);
          }
          g.fillStyle = "rgba(255,255,255,0.055)";
          g.fillRect(px + 2, py + 1, 5, 1);
          if (h > 0.8) {
            g.fillStyle = "rgba(255, 200, 87, 0.24)";
            g.fillRect(px + 5 + Math.floor(h * 5), py + 9, 2, 1);
          }
        } else {
          // um piso só, com véu e grão: o xadrez de 16 px sumiu
          g.fillStyle = palette.floor;
          g.fillRect(px, py, TILE, TILE);
          g.fillStyle = patch(tx, ty) > 0.5 ? "rgba(255,255,255,0.022)" : "rgba(0,0,0,0.08)";
          g.fillRect(px, py, TILE, TILE);
          for (let i = 0; i < 4; i++) {
            const gx = px + 1 + Math.floor(hash2(tx * 13 + i * 5, ty * 17 - i) * 14);
            const gy = py + 1 + Math.floor(hash2(tx * 7 - i, ty * 19 + i * 5) * 14);
            g.fillStyle = i % 2 ? "rgba(255,255,255,0.04)" : "rgba(0,0,0,0.1)";
            g.fillRect(gx, gy, 1, 1);
          }
          if (h > 0.92) {
            // cogumelo
            g.fillStyle = "#3a2f22";
            g.fillRect(px + 6, py + 9, 2, 4);
            g.fillStyle = palette.accent;
            g.globalAlpha = 0.7;
            g.fillRect(px + 4, py + 7, 6, 3);
            g.globalAlpha = 1;
          } else if (h > 0.86) {
            // rachadura
            g.strokeStyle = "rgba(0,0,0,0.28)";
            g.lineWidth = 1;
            g.beginPath();
            g.moveTo(px + 2, py + 4 + Math.floor(h * 5));
            g.lineTo(px + 6, py + 8);
            g.lineTo(px + 5, py + 13);
            g.stroke();
          } else if (h > 0.8) {
            // cascalho
            g.fillStyle = "rgba(0,0,0,0.22)";
            g.fillRect(px + 4, py + 10, 5, 2);
            g.fillRect(px + 10, py + 5, 2, 2);
            g.fillStyle = "rgba(255,255,255,0.06)";
            g.fillRect(px + 5, py + 5, 2, 1);
          }
        }
      }
    }

    // paredes
    for (let ty = 0; ty < map.H; ty++) {
      for (let tx = 0; tx < map.W; tx++) {
        if (!solid(tx, ty)) continue;
        const px = tx * TILE, py = ty * TILE;
        const h = hash2(tx + 11, ty + 7);
        g.fillStyle = palette.wall;
        g.fillRect(px, py, TILE, TILE);
        g.fillStyle = "rgba(255,255,255,0.035)";
        g.fillRect(px + 2 + Math.floor(h * 10), py + 3 + Math.floor(h * 9), 1, 1);
        g.fillStyle = "rgba(0,0,0,0.2)";
        g.fillRect(px + 9 - Math.floor(h * 6), py + 10 - Math.floor(h * 5), 1, 1);
        const baixo = !solid(tx, ty + 1);
        const cima = !solid(tx, ty - 1);
        const esq = !solid(tx - 1, ty);
        const dir = !solid(tx + 1, ty);
        if (!(baixo || cima || esq || dir)) continue;
        // pedras só na face que aparece
        for (let r = 0; r < 3; r++) {
          const yy = py + r * 5;
          const off = (r % 2) * 3 + Math.floor(h * 2);
          for (let i = -1; i < 3; i++) {
            const xx = px + off + i * 7;
            const lx = Math.max(px, xx);
            const rx = Math.min(px + TILE, xx + 6);
            if (rx <= lx) continue;
            const tom = hash2(tx * 7 + i, ty * 5 + r);
            g.fillStyle = tom > 0.62 ? palette.wallTop : palette.wall;
            g.fillRect(lx + 1, yy + 1, Math.max(1, rx - lx - 1), 3);
            g.fillStyle = "rgba(255,255,255,0.045)";
            g.fillRect(lx + 1, yy + 1, Math.max(1, rx - lx - 1), 1);
          }
        }
        g.fillStyle = "rgba(255,255,255,0.05)";
        g.fillRect(px, py, TILE, 2);
        if (baixo) {
          g.fillStyle = "rgba(0,0,0,0.34)";
          g.fillRect(px, py + TILE, TILE, 5);
        }
        // a rocha morde o chão: 1 a 3 px de borda serrada na face aberta
        g.fillStyle = palette.wall;
        for (let i = 0; i < TILE; i += 2) {
          if (hash2(tx * 29 + i, ty * 31 + i * 3) < 0.42) continue;
          const d = 1 + Math.floor(hash2(tx + i, ty - i) * 3);
          if (baixo) g.fillRect(px + i, py + TILE, 2, d);
          if (cima) g.fillRect(px + i, py - d, 2, d);
          if (esq) g.fillRect(px - d, py + i, d, 2);
          if (dir) g.fillRect(px + TILE, py + i, d, 2);
        }
      }
    }
    return cv;
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

    const cityIndex = state.map.rooms.findIndex((r) => r.kind === "city");
    // chão e parede vêm do canvas pintado na descida: um drawImage por quadro
    if (state.terrain) ctx.drawImage(state.terrain, 0, 0);

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
          if (prop.kind === "stairs") drawStairs(ctx, prop.x * TILE, prop.y * TILE, palette.accent, t);
          else if (prop.kind === "altar") drawAltar(ctx, prop.x * TILE, prop.y * TILE, t, palette.accent);
          else if (prop.kind === "forge") drawForge(ctx, prop.x * TILE, prop.y * TILE, t, palette.accent);
          else if (prop.kind === "waystone") drawWaystone(ctx, prop.x * TILE, prop.y * TILE, t, palette.accent);
          else if (prop.kind === "keeper") drawKeeper(ctx, prop.x * TILE, prop.y * TILE, t, palette.accent);
          else if (prop.kind === "enchanter") drawEnchanter(ctx, prop.x * TILE, prop.y * TILE, t, palette.accent);
          else if (prop.kind === "pet") drawPet(ctx, prop.x * TILE, prop.y * TILE, t, palette.accent, PETS[prop.petId]?.kind || "cat", rpg.petTamed(prop.petId));
          else if (prop.kind === "plot") {
            drawPlot(ctx, prop.x * TILE, prop.y * TILE, t, palette.accent, prop.planted, prop.planted && t >= prop.readyAt);
          }
          else if (prop.kind === "vein") drawVein(ctx, prop.x * TILE, prop.y * TILE, t, palette.accent, prop.charges);
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
    // o companheiro segue pela trilha, um só, com a cara da espécie ativa
    const companion = rpg.activePet();
    if (companion && state.history.length > 14) {
      const trail = state.history[state.history.length - 14];
      if (Math.hypot(trail.x - state.player.x, trail.y - state.player.y) < 5) {
        drawables.push({
          y: trail.y,
          draw: () => drawPetSprite(ctx, companion.kind, trail.x * TILE, trail.y * TILE, t, state.player.moving, state.player.dir),
        });
      }
    }
    drawables.push({
      y: state.player.y,
      draw: () => {
        const px = state.player.x * TILE;
        const py = state.player.y * TILE;
        const lift = 5 * state.boost;
        const bob = Math.sin(t * 0.007) * 1.1 * state.boost;
        if (state.boost > 0.01) drawSkiff(ctx, px, py, state.player.dir, t, state.boost, state.player.moving);
        drawAdventurer(ctx, px, py - lift + bob, state.player.dir, state.player.moving && state.boost < 0.35, t, avatar, look, gear ? gear() : null);
      },
    });
    drawables.sort((a, b) => a.y - b.y);
    for (const d of drawables) d.draw();

    ctx.restore();

    // escuridão: a lanterna do aventureiro e a tocha
    const sx = (state.player.x * TILE - camX) * scale;
    const sy = (state.player.y * TILE - camY) * scale;
    const inCity = cityIndex >= 0 && state.roomIndex === cityIndex;
    const lightBonus = rpg.lightBonus();
    const radius = ((inCity ? CITY_LIGHT : state.torchUntil > clock() ? 11 : 7.2) + lightBonus) * TILE * scale;
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
      const ang = [Math.PI / 2, Math.PI, 0, -Math.PI / 2][m.dir] || 0;
      const fov = m.fov || 1.2;
      ctx.save();
      ctx.globalAlpha = 0.1;
      ctx.fillStyle = m.accent;
      ctx.beginPath();
      ctx.moveTo(x, y);
      ctx.arc(x, y, m.vision * TILE, ang - fov, ang + fov);
      ctx.closePath();
      ctx.fill();
      ctx.globalAlpha = 0.28;
      ctx.strokeStyle = m.accent;
      ctx.setLineDash([3, 5]);
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(x, y, m.vision * TILE, ang - fov, ang + fov);
      ctx.lineTo(x, y);
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
    drawCreature(ctx, m.kind, m.accent, t + m.x * 90, m.boss ? 1.15 : 0.95, m.dir);
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
    const rawMs = state.last ? t - state.last : 16;
    // resolução adaptativa também no subsolo: se o quadro passa de 26 ms por
    // muito tempo, o canvas reduz a resolução interna e o desenho esquenta menos.
    state.perfMs += rawMs;
    state.perfN++;
    if (state.perfN >= 90) {
      const avg = state.perfMs / state.perfN;
      if (avg > 26 && state.quality > 0.65) {
        state.quality = Math.max(0.65, state.quality - 0.15);
        resize();
      } else if (avg < 17 && state.quality < 1) {
        state.quality = Math.min(1, state.quality + 0.05);
        resize();
      }
      state.perfMs = 0;
      state.perfN = 0;
    }
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
    // A caverna consome a tecla: sem isso, o F que sobe pela escada também
    // seria lido pelo mapa da superfície no mesmo evento e abriria outra coisa.
    e.stopImmediatePropagation();
    const k = e.key.toLowerCase();
    if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k)) e.preventDefault();
    if (k === "escape") {
      close("stairs");
      return;
    }
    if (state.paused) return;
    if (k === " " || e.code === "Space") {
      if (e.repeat) return;
      toggleSprint();
      return;
    }
    if (k === "f") {
      e.preventDefault();
      pararSeguir();
      interact();
      return;
    }
    if (k === "c") {
      onSheet?.();
      return;
    }
    if (k === "i") {
      onInventory?.();
      return;
    }
    if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) pararSeguir();
    state.keys.add(k);
  }

  function onKeyUp(e) {
    if (!state.open) return;
    state.keys.delete(e.key.toLowerCase());
  }

  function onBlur() {
    pararSeguir();
    state.keys.clear();
    setSprint(false);
  }

  // Arrastar o chão da caverna também faz o boneco seguir o ponteiro. O
  // caminho é refeito quando o cursor muda de tile, com respiro de 140 ms.
  let seguindoPonteiro = false;
  let seguirInicio = null;
  let seguirUltimo = 0;
  let seguirTile = "";

  function pararSeguir() {
    seguindoPonteiro = false;
    seguirInicio = null;
  }

  function iniciarSeguir(e, goal) {
    seguindoPonteiro = true;
    seguirInicio = { x: e.clientX, y: e.clientY };
    seguirUltimo = 0;
    seguirTile = `${goal.x.toFixed(2)}:${goal.y.toFixed(2)}`;
  }

  function seguirNoPonteiro(e, agora) {
    if (!seguindoPonteiro) return;
    if (!state.open || state.paused || blocked() || !state.view) {
      pararSeguir();
      return;
    }
    if (seguirInicio && Math.hypot(e.clientX - seguirInicio.x, e.clientY - seguirInicio.y) < 12) return;
    if (agora - seguirUltimo < 140) return;
    const rect = canvas.getBoundingClientRect();
    const { scale, camX, camY } = state.view;
    const wx = ((e.clientX - rect.left) / scale + camX) / TILE;
    const wy = ((e.clientY - rect.top) / scale + camY) / TILE;
    const chave = `${Math.floor(wx)}:${Math.floor(wy)}`;
    if (chave === seguirTile) return;
    if (Math.hypot(wx - state.player.x, wy - state.player.y) < 0.6) return;
    if (!setPathTo(wx, wy, null, true)) return;
    seguirTile = chave;
    seguirUltimo = agora;
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
      if (d <= 1.7 && clear) {
        pararSeguir();
        act(hit);
      } else if (setPathTo(hit.x, hit.y, hit, true)) {
        iniciarSeguir(e, hit);
      }
      return;
    }
    if (setPathTo(wx, wy, null, true)) iniciarSeguir(e, { x: wx, y: wy });
  }

  function onResize() {
    if (state.open) resize();
  }

  window.addEventListener("keydown", onKeyDown);
  window.addEventListener("keyup", onKeyUp);
  window.addEventListener("blur", onBlur);
  window.addEventListener("resize", onResize);
  canvas?.addEventListener("pointerdown", onPointer);
  window.addEventListener("pointermove", (e) => seguirNoPonteiro(e, clock()));
  window.addEventListener("pointerup", pararSeguir);
  window.addEventListener("pointercancel", pararSeguir);
  // o mapa da caverna também recolhe, e o estado fica guardado entre descidas
  const CHAVE_MAPA = "mundo-song:cavemap:v1";
  const aplicarMapa = (recolhido) => {
    const alvo = $("dg-map");
    const botao = $("dg-fold");
    if (alvo) alvo.hidden = recolhido;
    if (botao) {
      botao.textContent = recolhido ? "+" : "–";
      botao.setAttribute("aria-expanded", String(!recolhido));
      botao.setAttribute("aria-label", recolhido ? "abrir o mapa da caverna" : "minimizar o mapa da caverna");
    }
    if (!recolhido && state.open) drawMinimap();
  };
  $("dg-fold")?.addEventListener("click", () => {
    const alvo = $("dg-map");
    if (!alvo) return;
    const recolhido = !alvo.hidden;
    aplicarMapa(recolhido);
    try { localStorage.setItem(CHAVE_MAPA, recolhido ? "1" : "0"); } catch {}
    audio.blip?.();
  });
  try { aplicarMapa(localStorage.getItem(CHAVE_MAPA) === "1"); } catch { aplicarMapa(false); }
  $("dg-exit")?.addEventListener("click", () => close("stairs", state.entryCave));
  $("dg-sheet")?.addEventListener("click", () => onSheet?.());
  $("dg-inventory")?.addEventListener("click", () => onInventory?.());
  const sprintBtn = $("dg-sprint");
  const setSprint = (on) => {
    state.sprint = on;
    sprintBtn?.classList.toggle("active", on);
    sprintBtn?.setAttribute("aria-pressed", String(on));
  };
  const toggleSprint = () => {
    setSprint(!state.sprint);
    if (state.sprint) audio.boost?.(); else audio.blip?.();
  };
  sprintBtn?.addEventListener("click", toggleSprint);

  return {
    open,
    close,
    enterCity,
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
      if (bossClose) say("O chefe mal sentiu. A bomba só o acordou.", 3000);
      else if (hit) say(`A bomba apagou ${hit} bicho(s). Nenhuma experiência, nenhum saque.`, 3400);
      else say("A bomba estourou no vazio.", 2400);
      audio.error?.();
      updateHud();
      return { ok: hit > 0, hit, bossClose };
    },
    get state() { return state; },
  };
}

import {
  TILE, MAP_W, MAP_H, WORLD_W, WORLD_H, ZONES, TILE_KIND as K, PLAYER_COLORS,
} from "./config.js";
import { hash2 } from "./world.js";
import { NPCS } from "./content.js";

const BODY_W = 12;
const BODY_H = 17;

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

export function createRenderer(canvas, world) {
  const ctx = canvas.getContext("2d", { alpha: false });
  let dpr = 1, vw = 0, vh = 0, zoom = 3;
  let camX = 0, camY = 0, shake = 0;
  let lastZone = null;
  let rendererReady = false;
  const motes = Array.from({ length: 34 }, () => ({
    x: Math.random() * WORLD_W,
    y: Math.random() * WORLD_H,
    r: 0.6 + Math.random() * 1.2,
    a: Math.random() * Math.PI * 2,
    s: 2 + Math.random() * 8,
  }));

  const minimap = document.getElementById("minimap-canvas");
  const mctx = minimap ? minimap.getContext("2d") : null;
  const mmBase = document.createElement("canvas");
  mmBase.width = MAP_W * 2;
  mmBase.height = MAP_H * 2;
  buildMinimapBase();

  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1);
    vw = window.innerWidth;
    vh = window.innerHeight;
    canvas.width = Math.round(vw * dpr);
    canvas.height = Math.round(vh * dpr);
    const z = Math.round(Math.min(vw / 460, vh / 320) * 2) / 2;
    zoom = Math.max(1.5, Math.min(3.5, z));
  }

  function tileColor(t) {
    switch (t) {
      case K.PATH: return "#57462f";
      case K.STONE: return "#3a3f5c";
      case K.WATER: return "#123754";
      case K.SAND: return "#6a5a3c";
      case K.LOGIC: return "#0d2c30";
      case K.MOSS: return "#10261a";
      case K.STAR: return "#191a42";
      case K.CRYSTAL: return "#2a1034";
      case K.WALL: return "#3b3352";
      default: return "#173225";
    }
  }

  function buildMinimapBase() {
    if (!mctx) return;
    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        const t = world.get(x, y);
        let c = "#162b20";
        if (t === K.PATH) c = "#57462f";
        else if (t === K.STONE) c = "#3a3f5c";
        else if (t === K.WATER) c = "#123754";
        else if (t === K.SAND) c = "#6a5a3c";
        else if (t === K.LOGIC) c = "#0d4a44";
        else if (t === K.MOSS) c = "#17492c";
        else if (t === K.STAR) c = "#2a2a68";
        else if (t === K.CRYSTAL) c = "#4a1a58";
        else if (t === K.TREE) c = "#0c1d15";
        else if (t === K.WALL) c = "#3b3352";
        else if (t === K.VOID) c = "#05070f";
        mctx.fillStyle = c;
        mctx.fillRect(x * 2, y * 2, 2, 2);
      }
    }
    for (const s of world.stations) {
      mctx.fillStyle = s.accent;
      mctx.fillRect(Math.round(s.x * 2) - 1, Math.round(s.y * 2) - 1, 3, 3);
    }
  }

  function drawGround(x, y, t, time) {
    const px = x * TILE, py = y * TILE;
    const h = hash2(x, y);
    ctx.fillStyle = tileColor(t);
    ctx.fillRect(px, py, TILE, TILE);

    if (t === K.GRASS || t === K.FLOWER) {
      ctx.fillStyle = "#1d3c2b";
      const n = 2 + Math.floor(h * 3);
      for (let i = 0; i < n; i++) {
        const bx = px + 2 + Math.floor(hash2(x + i, y * 3 + i) * 12);
        const by = py + 3 + Math.floor(hash2(x * 5 + i, y) * 11);
        ctx.fillRect(bx, by, 1, 2);
      }
      if (t === K.FLOWER) {
        const cols = ["#ffc857", "#ff7aa8", "#b48cff", "#6bd5ff"];
        ctx.fillStyle = cols[Math.floor(h * cols.length)];
        const fx = px + 6, fy = py + 7;
        ctx.fillRect(fx - 1, fy, 3, 1);
        ctx.fillRect(fx, fy - 1, 1, 3);
      }
    } else if (t === K.PATH) {
      ctx.fillStyle = "#63513a";
      ctx.fillRect(px, py, TILE, 2);
      ctx.fillStyle = "#4a3b29";
      for (let i = 0; i < 3; i++) {
        const sx = px + Math.floor(hash2(x + i, y + 7) * 14);
        const sy = py + 4 + Math.floor(hash2(x, y + i) * 10);
        ctx.fillRect(sx, sy, 2, 1);
      }
    } else if (t === K.STONE) {
      ctx.strokeStyle = "#2b3049";
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 0.5, py + 0.5, TILE - 1, TILE - 1);
      if (h > 0.55) {
        ctx.fillStyle = "#454b6c";
        ctx.fillRect(px + 3, py + 3, 3, 2);
      }
      if (h > 0.88) {
        ctx.fillStyle = "#2c3150";
        ctx.fillRect(px + 8, py + 9, 5, 2);
      }
    } else if (t === K.WATER) {
      ctx.fillStyle = "#0f2c46";
      ctx.fillRect(px, py, TILE, TILE);
      ctx.fillStyle = "rgba(107, 213, 255, 0.22)";
      for (let i = 0; i < 2; i++) {
        const w = 5 + Math.round(Math.sin(time * 0.0016 + x + y + i) * 3);
        ctx.fillRect(px + 2 + i * 7, py + 4 + i * 5, w, 1);
      }
    } else if (t === K.SAND) {
      ctx.fillStyle = "#7a6844";
      ctx.fillRect(px, py, TILE, 2);
      ctx.fillStyle = "#5d4f34";
      ctx.fillRect(px + Math.floor(h * 10), py + 7, 2, 1);
    } else if (t === K.LOGIC) {
      ctx.fillStyle = "#0f3a38";
      ctx.fillRect(px + 2, py + 2, TILE - 4, TILE - 4);
      ctx.strokeStyle = "rgba(97, 244, 192, 0.18)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      if (h > 0.5) {
        ctx.moveTo(px + 3, py + 5); ctx.lineTo(px + 10, py + 5); ctx.lineTo(px + 10, py + 12);
      } else {
        ctx.moveTo(px + 5, py + 3); ctx.lineTo(px + 5, py + 10); ctx.lineTo(px + 13, py + 10);
      }
      ctx.stroke();
      if (h > 0.82) {
        ctx.fillStyle = "rgba(97, 244, 192, 0.55)";
        ctx.fillRect(px + 5, py + 5, 1, 1);
      }
    } else if (t === K.MOSS) {
      ctx.fillStyle = "#173a26";
      for (let i = 0; i < 3; i++) {
        const mx = px + 2 + Math.floor(hash2(x * 3 + i, y) * 12);
        const my = py + 3 + Math.floor(hash2(x, y * 5 + i) * 11);
        ctx.fillRect(mx, my, 2, 1);
      }
      if (h > 0.9) {
        ctx.fillStyle = "rgba(97, 244, 192, 0.35)";
        ctx.fillRect(px + 8, py + 8, 1, 1);
      }
    } else if (t === K.STAR) {
      ctx.fillStyle = "#23245a";
      ctx.fillRect(px + 4, py + 4, TILE - 8, TILE - 8);
      if (h > 0.4) {
        const tw = 0.55 + Math.sin(time * 0.002 + x * 2 + y) * 0.45;
        ctx.fillStyle = `rgba(180, 140, 255, ${0.25 + tw * 0.4})`;
        const sx = px + 3 + Math.floor(hash2(x, y) * 10);
        const sy = py + 3 + Math.floor(hash2(y, x) * 10);
        ctx.fillRect(sx, sy, 1, 1);
        if (h > 0.8) {
          ctx.fillRect(sx - 1, sy, 3, 1);
          ctx.fillRect(sx, sy - 1, 1, 3);
        }
      }
    } else if (t === K.CRYSTAL) {
      ctx.fillStyle = "#351443";
      ctx.fillRect(px + 2, py + 2, TILE - 4, TILE - 4);
      ctx.strokeStyle = "rgba(255, 122, 168, 0.16)";
      ctx.beginPath();
      ctx.moveTo(px + 3, py + 12); ctx.lineTo(px + 8, py + 4); ctx.lineTo(px + 13, py + 12);
      ctx.stroke();
      if (h > 0.78) {
        ctx.fillStyle = "rgba(255, 122, 168, 0.5)";
        ctx.fillRect(px + 7, py + 7, 1, 1);
      }
    } else if (t === K.VOID) {
      ctx.fillStyle = "#04060d";
      ctx.fillRect(px, py, TILE, TILE);
    }
  }

  function drawTree(x, y, time) {
    const px = x * TILE, py = y * TILE;
    const h = hash2(x, y);
    // sombra
    ctx.fillStyle = "rgba(2, 6, 10, 0.35)";
    ctx.beginPath();
    ctx.ellipse(px + 8, py + 14, 7, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    // tronco
    ctx.fillStyle = "#2b1f18";
    ctx.fillRect(px + 6, py + 9, 4, 7);
    ctx.fillStyle = "#3a2a20";
    ctx.fillRect(px + 6, py + 9, 1, 6);
    // copa em camadas
    const sway = Math.sin(time * 0.0012 + x * 1.7 + y) * 0.6;
    const layers = [
      { y: 1, w: 12, c: "#0f2b1c" },
      { y: 3, w: 14, c: "#163a25" },
      { y: 5, w: 12, c: "#1d4a2e" },
    ];
    for (const l of layers) {
      ctx.fillStyle = l.c;
      ctx.fillRect(px + 8 - l.w / 2 + sway, py + l.y, l.w, 5);
      ctx.fillRect(px + 9 - l.w / 2 + sway, py + l.y + 1, l.w - 2, 5);
    }
    ctx.fillStyle = "rgba(97, 244, 192, 0.12)";
    ctx.fillRect(px + 5, py + 3, 3, 2);
    if (h > 0.7) {
      ctx.fillStyle = "rgba(255, 200, 87, 0.55)";
      ctx.fillRect(px + 9, py + 6, 1, 1);
    }
  }

  function drawWall(x, y) {
    const px = x * TILE, py = y * TILE;
    ctx.fillStyle = "#241f38";
    ctx.fillRect(px, py, TILE, TILE);
    ctx.fillStyle = "#3b3352";
    ctx.fillRect(px + 1, py + 1, TILE - 2, TILE - 4);
    ctx.fillStyle = "#4b4166";
    ctx.fillRect(px + 1, py + 1, TILE - 2, 2);
    ctx.fillStyle = "#171326";
    ctx.fillRect(px + 4, py + 7, 2, 4);
    ctx.fillRect(px + 10, py + 4, 1, 6);
  }

  function drawDecor(d, time) {
    const px = d.x * TILE, py = d.y * TILE;
    if (d.type === "lamp") {
      ctx.fillStyle = "rgba(2, 6, 10, 0.4)";
      ctx.beginPath(); ctx.ellipse(px, py + 12, 6, 2.4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#2b2438";
      ctx.fillRect(px - 1, py - 10, 2, 22);
      ctx.fillStyle = "#4a3f5f";
      ctx.fillRect(px - 3, py - 12, 6, 2);
      const glow = 0.45 + Math.sin(time * 0.003 + d.x) * 0.12;
      const g = ctx.createRadialGradient(px, py - 10, 0, px, py - 10, 18);
      g.addColorStop(0, `rgba(255, 214, 128, ${glow})`);
      g.addColorStop(1, "rgba(255, 214, 128, 0)");
      ctx.fillStyle = g;
      ctx.fillRect(px - 18, py - 28, 36, 36);
      ctx.fillStyle = "#ffe3a1";
      ctx.fillRect(px - 1, py - 11, 2, 2);
    } else if (d.type === "sign") {
      ctx.fillStyle = "#2a2130";
      ctx.fillRect(px - 1, py - 6, 2, 16);
      ctx.fillStyle = "#1a1526";
      ctx.fillRect(px - 8, py - 12, 16, 7);
      ctx.strokeStyle = d.accent;
      ctx.globalAlpha = 0.8;
      ctx.strokeRect(px - 7.5, py - 11.5, 15, 6);
      ctx.globalAlpha = 1;
      ctx.fillStyle = d.accent;
      ctx.fillRect(px - 5, py - 9, 10, 1);
      ctx.fillRect(px - 5, py - 7, 6, 0.5);
    } else if (d.type === "mushroom") {
      const hue = d.hue > 0.7 ? "#6bd5ff" : "#61f4c0";
      ctx.fillStyle = "#d8d0c4";
      ctx.fillRect(px, py + 3, 2, 4);
      ctx.fillStyle = hue;
      ctx.fillRect(px - 2, py, 6, 3);
      ctx.fillStyle = "rgba(255,255,255,0.5)";
      ctx.fillRect(px - 1, py + 1, 1, 1);
    } else if (d.type === "shard") {
      const a = 0.5 + Math.sin(time * 0.002 + d.x) * 0.2;
      ctx.fillStyle = `rgba(255, 122, 168, ${a * 0.25})`;
      ctx.fillRect(px - 6, py - 10, 12, 20);
      ctx.fillStyle = "#ff9bc0";
      ctx.beginPath();
      ctx.moveTo(px, py - 9); ctx.lineTo(px + 3, py + 2); ctx.lineTo(px, py + 6);
      ctx.lineTo(px - 3, py + 2); ctx.closePath(); ctx.fill();
    } else if (d.type === "star") {
      const a = 0.35 + Math.sin(time * 0.003 + d.x * 3) * 0.3;
      ctx.fillStyle = `rgba(200, 180, 255, ${a})`;
      ctx.fillRect(px, py - 1, 1, 3);
      ctx.fillRect(px - 1, py, 3, 1);
    } else if (d.type === "node") {
      ctx.fillStyle = "rgba(97, 244, 192, 0.35)";
      ctx.fillRect(px, py, 2, 2);
      ctx.strokeStyle = "rgba(97, 244, 192, 0.12)";
      ctx.beginPath();
      ctx.moveTo(px, py); ctx.lineTo(px + 8, py);
      ctx.stroke();
    } else if (d.type === "petal") {
      ctx.fillStyle = "rgba(255, 200, 87, 0.35)";
      ctx.fillRect(px, py, 1, 1);
    } else if (d.type === "bench") {
      ctx.fillStyle = "rgba(2,6,10,0.35)";
      ctx.beginPath(); ctx.ellipse(px + 8, py + 10, 10, 3, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#2a2030";
      ctx.fillRect(px + 1, py + 6, 2, 5);
      ctx.fillRect(px + 13, py + 6, 2, 5);
      ctx.fillStyle = "#6b4a2f";
      ctx.fillRect(px - 2, py + 2, 20, 4);
      ctx.fillStyle = "#8a623d";
      ctx.fillRect(px - 2, py + 2, 20, 1);
      ctx.fillStyle = "#4a3322";
      ctx.fillRect(px - 2, py + 6, 20, 1);
      ctx.fillStyle = "#5a3d28";
      ctx.fillRect(px - 2, py - 6, 2, 9);
      ctx.fillRect(px + 16, py - 6, 2, 9);
      ctx.fillStyle = "#7a5636";
      ctx.fillRect(px - 2, py - 6, 20, 2);
    }
  }

  function drawStation(s, time) {
    const px = s.x * TILE, py = s.y * TILE;
    const pulse = 0.5 + Math.sin(time * 0.0024 + s.x) * 0.5;
    // aura
    const g = ctx.createRadialGradient(px, py, 2, px, py, 32);
    g.addColorStop(0, hexA(s.accent, 0.16 + pulse * 0.08));
    g.addColorStop(1, hexA(s.accent, 0));
    ctx.fillStyle = g;
    ctx.fillRect(px - 34, py - 34, 68, 68);

    if (s.id === "fountain") {
      ctx.fillStyle = "rgba(2,6,10,0.4)";
      ctx.beginPath(); ctx.ellipse(px, py + 8, 16, 6, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#565b7c";
      ctx.fillRect(px - 14, py - 2, 28, 8);
      ctx.fillStyle = "#6a7096";
      ctx.fillRect(px - 14, py - 4, 28, 3);
      ctx.fillStyle = "#123754";
      ctx.fillRect(px - 11, py - 3, 22, 5);
      ctx.fillStyle = "rgba(107,213,255,0.5)";
      for (let i = 0; i < 3; i++) {
        const a = time * 0.002 + i * 2.1;
        ctx.fillRect(px + Math.sin(a) * 7, py - 5 - (i % 2) * 2, 2, 2);
      }
      ctx.fillStyle = "#8b90b8";
      ctx.fillRect(px - 2, py - 14, 4, 12);
      ctx.fillRect(px - 5, py - 16, 10, 3);
    } else if (s.id === "radio") {
      ctx.fillStyle = "#2a2438";
      ctx.fillRect(px - 2, py - 22, 4, 28);
      ctx.fillStyle = "#ffb26b";
      ctx.fillRect(px - 4, py - 22, 8, 4);
      const r = 8 + (time * 0.02) % 22;
      ctx.strokeStyle = hexA("#ffb26b", 0.5 * (1 - (r - 8) / 22));
      ctx.beginPath(); ctx.arc(px, py - 20, r, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = "#3a3048";
      ctx.fillRect(px - 7, py + 4, 14, 6);
      ctx.fillStyle = "#ffb26b";
      ctx.fillRect(px - 5, py + 6, 2, 2);
      ctx.fillRect(px, py + 6, 2, 2);
    } else if (s.id === "logic") {
      ctx.fillStyle = "#1a2733";
      ctx.fillRect(px - 12, py - 8, 24, 16);
      ctx.strokeStyle = "#61f4c0";
      ctx.strokeRect(px - 11.5, py - 7.5, 23, 15);
      ctx.fillStyle = "#61f4c0";
      ctx.fillRect(px - 8, py - 3, 4, 7);
      ctx.fillRect(px + 4, py - 3, 4, 7);
      ctx.fillStyle = pulse > 0.5 ? "#fff3a8" : "#5a4d2a";
      ctx.fillRect(px - 2, py - 13, 4, 4);
      ctx.fillStyle = hexA("#61f4c0", 0.6);
      ctx.fillRect(px - 8, py + 6, 16, 1);
    } else if (s.id === "fractal") {
      ctx.fillStyle = "#1a2b3a";
      ctx.fillRect(px - 3, py + 4, 6, 5);
      ctx.strokeStyle = "#6bd5ff";
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(px, py + 6); ctx.lineTo(px, py - 16);
      ctx.moveTo(px, py - 10); ctx.lineTo(px - 8, py - 18);
      ctx.moveTo(px, py - 6); ctx.lineTo(px + 8, py - 15);
      ctx.moveTo(px, py - 2); ctx.lineTo(px - 6, py - 9);
      ctx.stroke();
      ctx.fillStyle = "rgba(107,213,255,0.65)";
      ctx.fillRect(px - 9, py - 19, 2, 2);
      ctx.fillRect(px + 7, py - 16, 2, 2);
      ctx.fillRect(px - 7, py - 10, 2, 2);
    } else if (s.id === "fourier") {
      ctx.fillStyle = "#2a2440";
      ctx.fillRect(px - 10, py + 2, 12, 4);
      ctx.save();
      ctx.translate(px, py + 2);
      ctx.rotate(-0.7);
      ctx.fillStyle = "#b48cff";
      ctx.fillRect(0, -3, 18, 6);
      ctx.fillStyle = "#e4d4ff";
      ctx.fillRect(16, -4, 3, 8);
      ctx.restore();
      ctx.strokeStyle = "rgba(180,140,255,0.5)";
      ctx.beginPath();
      for (let i = 0; i < 10; i++) {
        const xx = px - 14 + i * 3;
        const yy = py - 12 + Math.sin(time * 0.004 + i * 0.8) * 3;
        if (i === 0) ctx.moveTo(xx, yy); else ctx.lineTo(xx, yy);
      }
      ctx.stroke();
    } else if (s.id === "solid") {
      const ry = time * 0.001;
      ctx.save();
      ctx.translate(px, py - 2);
      ctx.rotate(ry);
      ctx.fillStyle = hexA("#ff7aa8", 0.28);
      ctx.beginPath();
      ctx.moveTo(0, -12); ctx.lineTo(8, 0); ctx.lineTo(0, 12); ctx.lineTo(-8, 0);
      ctx.closePath(); ctx.fill();
      ctx.strokeStyle = "#ff9bc0";
      ctx.lineWidth = 1;
      ctx.stroke();
      ctx.fillStyle = "#ffe1ef";
      ctx.fillRect(-1, -7, 2, 2);
      ctx.restore();
      ctx.fillStyle = "#2a1034";
      ctx.fillRect(px - 8, py + 6, 16, 4);
    }

    // base comum
    ctx.fillStyle = "rgba(2,6,10,0.35)";
    ctx.beginPath();
    ctx.ellipse(px, py + 9, 12, 4, 0, 0, Math.PI * 2);
    ctx.fill();
  }

  function drawNpc(npc, time) {
    const px = npc.x * TILE, py = npc.y * TILE;
    const bob = Math.sin(time * 0.002 + npc.bob) * 1.2;
    const colors = { skin: "#d9b08c", hair: "#4a3a55", shirt: npc.accent, pants: "#2f2c45" };
    drawHuman(px, py + bob, 0, false, time, colors, null, 0.9);
    ctx.font = "5px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.fillStyle = "rgba(8,10,20,0.72)";
    const label = NPCS[npc.id]?.name || npc.id;
    const w = ctx.measureText(label).width + 6;
    roundRect(ctx, px - w / 2, py - 26, w, 9, 2);
    ctx.fill();
    ctx.fillStyle = "#cfc9e6";
    ctx.fillText(label, px, py - 19);
    ctx.textAlign = "left";
    if (npc.bubble && npc.bubble.until > time) {
      drawBubble(npc.bubble.text, px, py, npc.accent || "#ffc857");
    }
  }

  function drawHuman(px, py, dir, moving, time, colors, name, scale = 1) {
    const s = scale;
    const step = moving ? Math.sin(time * 0.016) : 0;
    ctx.save();
    ctx.translate(px, py);
    ctx.scale(s, s);

    ctx.fillStyle = "rgba(2,4,10,0.38)";
    ctx.beginPath();
    ctx.ellipse(0, 0, 6.5, 2.6, 0, 0, Math.PI * 2);
    ctx.fill();

    const legOff = step > 0 ? 1 : step < -0 ? -1 : 0;
    const lift = moving ? Math.abs(step) * 1.1 : 0;

    // pernas
    ctx.fillStyle = colors.pants;
    ctx.fillRect(-4, -5, 3, 5 - lift);
    ctx.fillRect(1, -5, 3, 4);
    ctx.fillStyle = "#1b1c2c";
    ctx.fillRect(-4, -1, 3, 1);
    ctx.fillRect(1, -2, 3, 1);

    // corpo
    ctx.fillStyle = colors.shirt;
    ctx.fillRect(-5, -13, 10, 9);
    ctx.fillStyle = "rgba(255,255,255,0.16)";
    ctx.fillRect(-5, -13, 2, 8);
    ctx.fillStyle = colors.pants;
    ctx.fillRect(-5, -5, 10, 2);

    // braços
    ctx.fillStyle = colors.shirt;
    ctx.fillRect(-7, -12 + Math.max(0, legOff), 2, 6);
    ctx.fillRect(5, -12 - Math.max(0, legOff), 2, 6);
    ctx.fillStyle = colors.skin;
    ctx.fillRect(-7, -6 + Math.max(0, legOff), 2, 2);
    ctx.fillRect(5, -6 - Math.max(0, legOff), 2, 2);

    // cabeça
    ctx.fillStyle = colors.skin;
    ctx.fillRect(-4, -20, 8, 8);
    // cabelo
    ctx.fillStyle = colors.hair;
    ctx.fillRect(-4, -21, 8, 3);
    if (dir === 0) ctx.fillRect(-5, -20, 2, 5);
    else if (dir === 1) ctx.fillRect(-5, -20, 3, 6);
    else if (dir === 2) ctx.fillRect(2, -20, 3, 6);
    else ctx.fillRect(-4, -20, 8, 7);
    // olhos
    ctx.fillStyle = "#14121f";
    if (dir !== 3) {
      const ex = dir === 1 ? -3 : dir === 2 ? 1 : -2;
      ctx.fillRect(ex, -17, 1, 2);
      if (dir !== 1) ctx.fillRect(ex + 3, -17, 1, 2);
    }
    // detalhe no peito
    ctx.fillStyle = colors.accent || "#fff3d1";
    ctx.fillRect(-1, -11, 2, 2);

    ctx.restore();
  }

  function drawCat(cat, moving, time) {
    const px = cat.x * TILE, py = cat.y * TILE;
    const bob = moving ? Math.abs(Math.sin(time * 0.02)) * 1.2 : Math.sin(time * 0.002) * 0.5;
    ctx.fillStyle = "rgba(2,4,10,0.3)";
    ctx.beginPath(); ctx.ellipse(px, py, 5, 2, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#6b5b73";
    ctx.fillRect(px - 5, py - 6 - bob, 10, 5);
    ctx.fillRect(px - 4, py - 9 - bob, 7, 4);
    ctx.fillStyle = "#8a7893";
    ctx.fillRect(px - 4, py - 9 - bob, 2, 2);
    // orelhas
    ctx.fillStyle = "#6b5b73";
    ctx.fillRect(px - 4, py - 11 - bob, 2, 2);
    ctx.fillRect(px + 1, py - 11 - bob, 2, 2);
    // olhos
    ctx.fillStyle = "#ffc857";
    ctx.fillRect(px - 2, py - 8 - bob, 1, 1);
    ctx.fillRect(px + 1, py - 8 - bob, 1, 1);
    // rabo
    ctx.strokeStyle = "#6b5b73";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(px + 5, py - 4 - bob);
    ctx.quadraticCurveTo(px + 9, py - 6 - bob, px + 8, py - 10 - bob);
    ctx.stroke();
  }

  function drawBubble(text, px, py, color) {
    ctx.font = "6px ui-monospace, monospace";
    ctx.textAlign = "center";
    const maxW = 130;
    const words = text.split(/\s+/);
    const lines = [];
    let line = "";
    for (const w of words) {
      const test = line ? line + " " + w : w;
      if (ctx.measureText(test).width > maxW && line) {
        lines.push(line); line = w;
      } else line = test;
    }
    if (line) lines.push(line);
    const w = Math.min(maxW, Math.max(...lines.map((l) => ctx.measureText(l).width))) + 10;
    const h = lines.length * 8 + 6;
    const bx = px - w / 2, by = py - 34 - h;
    ctx.fillStyle = "rgba(8, 11, 24, 0.92)";
    roundRect(ctx, bx, by, w, h, 3);
    ctx.fill();
    ctx.strokeStyle = hexA(color, 0.6);
    ctx.lineWidth = 0.6;
    roundRect(ctx, bx, by, w, h, 3);
    ctx.stroke();
    ctx.fillStyle = "#fff";
    lines.forEach((l, i) => ctx.fillText(l, px, by + 9 + i * 8));
    ctx.textAlign = "left";
  }

  function hexA(hex, a) {
    const n = parseInt(hex.slice(1), 16);
    return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
  }

  function draw(now, player, peers, npcs, cat, moving) {
    const time = now;
    if (shake > 0) shake = Math.max(0, shake - 0.016);
    const shx = shake ? (Math.random() - 0.5) * shake * 4 : 0;
    const shy = shake ? (Math.random() - 0.5) * shake * 4 : 0;

    const viewW = vw / zoom, viewH = vh / zoom;
    let tx = player.x * TILE - viewW / 2;
    let ty = player.y * TILE - viewH / 2;
    tx = Math.max(0, Math.min(WORLD_W - viewW, tx));
    ty = Math.max(0, Math.min(WORLD_H - viewH, ty));
    if (WORLD_W < viewW) tx = (WORLD_W - viewW) / 2;
    if (WORLD_H < viewH) ty = (WORLD_H - viewH) / 2;
    const k = 1 - Math.exp(-0.012 * 16);
    if (!rendererReady) { camX = tx; camY = ty; rendererReady = true; }
    camX += (tx - camX) * k;
    camY += (ty - camY) * k;

    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.fillStyle = "#04060d";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    const scale = dpr * zoom;
    ctx.setTransform(scale, 0, 0, scale, (-camX + shx) * scale, (-camY + shy) * scale);

    const x0 = Math.max(0, Math.floor(camX / TILE) - 1);
    const y0 = Math.max(0, Math.floor(camY / TILE) - 1);
    const x1 = Math.min(MAP_W - 1, Math.ceil((camX + viewW) / TILE) + 1);
    const y1 = Math.min(MAP_H - 1, Math.ceil((camY + viewH) / TILE) + 1);

    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        drawGround(x, y, world.get(x, y), time);
      }
    }

    // brilho de região
    for (const z of Object.values(ZONES)) {
      const cx = (z.rect.x + z.rect.w / 2) * TILE;
      const cy = (z.rect.y + z.rect.h / 2) * TILE;
      const r = Math.max(z.rect.w, z.rect.h) * TILE * 0.8;
      const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, hexA(z.accent, 0.05));
      g.addColorStop(1, hexA(z.accent, 0));
      ctx.fillStyle = g;
      ctx.fillRect(cx - r, cy - r, r * 2, r * 2);
    }

    // árvores e paredes
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const t = world.get(x, y);
        if (t === K.TREE) drawTree(x, y, time);
        else if (t === K.WALL) drawWall(x, y);
      }
    }

    for (const d of world.decor) {
      if (d.x * TILE < camX - 40 || d.x * TILE > camX + viewW + 40 ||
          d.y * TILE < camY - 40 || d.y * TILE > camY + viewH + 40) continue;
      drawDecor(d, time);
    }

    const drawables = [];
    for (const s of world.stations) {
      drawables.push({ y: s.y * TILE, fn: () => drawStation(s, time) });
    }
    for (const n of npcs) {
      drawables.push({ y: n.y * TILE, fn: () => drawNpc(n, time) });
    }
    if (cat) {
      drawables.push({ y: cat.y * TILE, fn: () => drawCat(cat, cat.moving, time) });
    }
    for (const p of peers) {
      const peerColors = { skin: "#e8b98c", hair: "#2a2438", shirt: p.color, pants: "#2f2c45", accent: "#fff3d1" };
      drawables.push({
        y: p.y * TILE,
        fn: () => {
          drawHuman(p.x * TILE, p.y * TILE, p.dir || 0, p.moving, time, peerColors, null, 1);
          drawNameTag(p.name, p.x * TILE, p.y * TILE - 26, p.color);
          if (p.bubble && p.bubble.until > now) {
            drawBubble(p.bubble.text, p.x * TILE, p.y * TILE, p.color);
          }
        },
      });
    }
    drawables.push({
      y: player.y * TILE,
      fn: () => {
        drawHuman(player.x * TILE, player.y * TILE, player.dir, moving, time,
          PLAYER_COLORS[player.colorIndex % PLAYER_COLORS.length], null, 1);
        drawNameTag(player.name, player.x * TILE, player.y * TILE - 26, player.color);
        if (player.bubble && player.bubble.until > now) {
          drawBubble(player.bubble.text, player.x * TILE, player.y * TILE, player.color);
        }
      },
    });
    drawables.sort((a, b) => a.y - b.y).forEach((d) => d.fn());

    // partículas
    for (const m of motes) {
      m.a += 0.01;
      m.x += Math.cos(m.a) * 0.02 * m.s;
      m.y += Math.sin(m.a) * 0.02 * m.s;
      if (m.x < 0) m.x = WORLD_W;
      if (m.x > WORLD_W) m.x = 0;
      if (m.y < 0) m.y = WORLD_H;
      if (m.y > WORLD_H) m.y = 0;
      if (m.x < camX - 10 || m.x > camX + viewW + 10 ||
          m.y < camY - 10 || m.y > camY + viewH + 10) continue;
      const tw = 0.25 + Math.sin(time * 0.002 + m.a * 4) * 0.2;
      ctx.fillStyle = `rgba(255, 220, 150, ${tw})`;
      ctx.fillRect(m.x, m.y, m.r, m.r);
    }

    drawMinimap(player, peers);
    lastZone = world.zoneAt(player.x, player.y);
  }

  function drawNameTag(name, px, py, color) {
    if (!name) return;
    ctx.font = "5px ui-monospace, monospace";
    ctx.textAlign = "center";
    const w = ctx.measureText(name).width + 7;
    ctx.fillStyle = "rgba(8,10,20,0.7)";
    roundRect(ctx, px - w / 2, py - 11, w, 9, 2);
    ctx.fill();
    ctx.fillStyle = color || "#eae4ff";
    ctx.fillText(name, px, py - 4);
    ctx.textAlign = "left";
  }

  function drawMinimap(player, peers) {
    if (!mctx) return;
    mctx.drawImage(mmBase, 0, 0);
    for (const p of peers) {
      mctx.fillStyle = p.color || "#61f4c0";
      mctx.fillRect(Math.round(p.x * 2) - 1, Math.round(p.y * 2) - 1, 3, 3);
    }
    mctx.fillStyle = "#fff";
    mctx.fillRect(Math.round(player.x * 2) - 1, Math.round(player.y * 2) - 1, 3, 3);
    mctx.strokeStyle = "rgba(255,255,255,0.5)";
    mctx.strokeRect(Math.round(player.x * 2) - 2.5, Math.round(player.y * 2) - 2.5, 5, 5);
  }

  function kick(n = 1) { shake = n; }

  resize();
  window.addEventListener("resize", resize);
  return {
    draw, resize, kick,
    get zoom() { return zoom; },
    get camX() { return camX; },
    get camY() { return camY; },
    worldToScreen(wx, wy) {
      return { x: (wx * TILE - camX) * zoom, y: (wy * TILE - camY) * zoom };
    },
  };
}

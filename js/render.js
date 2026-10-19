import {
  TILE, MAP_W, MAP_H, WORLD_W, WORLD_H, TILE_KIND as K, PLAYER_COLORS,
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
  let rendererReady = false;
  let trail = [];
  const motes = Array.from({ length: 90 }, () => ({
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
  const mmBaseCtx = mmBase.getContext("2d");
  const mmFog = document.createElement("canvas");
  mmFog.width = MAP_W * 2;
  mmFog.height = MAP_H * 2;
  const fogCtx = mmFog.getContext("2d");
  let fogVersion = -1;
  let lastFogBuild = 0;
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
      case K.CIRCUIT: return "#0b2b2f";
      case K.DATA: return "#0f3f3c";
      case K.GOLD: return "#3a2f14";
      case K.MARBLE: return "#2b2a4c";
      case K.BASALT: return "#332025";
      case K.MAGMA: return "#4a1f18";
      case K.MOSS: return "#10261a";
      case K.ACID: return "#183a24";
      case K.BRIDGE: return "#4a3524";
      case K.PLAZA: return "#343a55";
      case K.SONIC: return "#19132e";
      case K.SCORE: return "#2a1c45";
      case K.NEURAL: return "#0a2030";
      case K.SYNAPSE: return "#103848";
      default: return "#173225";
    }
  }

  function buildMinimapBase() {
    const g = mmBaseCtx;
    for (let y = 0; y < MAP_H; y++) {
      for (let x = 0; x < MAP_W; x++) {
        const t = world.get(x, y);
        let c = "#162b20";
        if (t === K.PATH) c = "#57462f";
        else if (t === K.STONE) c = "#3a3f5c";
        else if (t === K.WATER) c = "#123754";
        else if (t === K.SAND) c = "#6a5a3c";
        else if (t === K.CIRCUIT) c = "#0d4a44";
        else if (t === K.DATA) c = "#14504a";
        else if (t === K.GOLD) c = "#4a3c18";
        else if (t === K.MARBLE) c = "#33315c";
        else if (t === K.BASALT) c = "#3d282c";
        else if (t === K.MAGMA) c = "#5a2a1c";
        else if (t === K.MOSS) c = "#173a26";
        else if (t === K.ACID) c = "#1f4a2c";
        else if (t === K.BRIDGE) c = "#5a412c";
        else if (t === K.PLAZA) c = "#343a55";
        else if (t === K.SONIC) c = "#2b1f4a";
        else if (t === K.SCORE) c = "#3a2a5c";
        else if (t === K.NEURAL) c = "#103048";
        else if (t === K.SYNAPSE) c = "#175062";
        else if (t === K.TREE) c = "#0c1d15";
        else if (t === K.WALL) c = "#3b3352";
        g.fillStyle = c;
        g.fillRect(x * 2, y * 2, 2, 2);
      }
    }
    for (const s of world.stations) {
      g.fillStyle = s.accent;
      g.fillRect(Math.round(s.x * 2) - 1, Math.round(s.y * 2) - 1, 3, 3);
    }
    for (const w of world.waystones) {
      g.fillStyle = "#ffd479";
      g.fillRect(Math.round(w.x * 2) - 1, Math.round(w.y * 2) - 1, 3, 3);
      g.fillStyle = "#1a1405";
      g.fillRect(Math.round(w.x * 2), Math.round(w.y * 2), 1, 1);
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
    } else if (t === K.STONE || t === K.PLAZA) {
      ctx.strokeStyle = t === K.PLAZA ? "#4b4f77" : "#2b3049";
      ctx.lineWidth = 1;
      ctx.strokeRect(px + 0.5, py + 0.5, TILE - 1, TILE - 1);
      if (h > 0.55) {
        ctx.fillStyle = t === K.PLAZA ? "#565b85" : "#454b6c";
        ctx.fillRect(px + 3, py + 3, 3, 2);
      }
      if (t === K.PLAZA && h > 0.72) {
        ctx.fillStyle = "rgba(255,200,87,0.28)";
        ctx.fillRect(px + 8, py + 8, 3, 1);
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
    } else if (t === K.CIRCUIT) {
      ctx.fillStyle = "#0d3438";
      ctx.fillRect(px + 2, py + 2, TILE - 4, TILE - 4);
      ctx.strokeStyle = "rgba(97, 244, 192, 0.16)";
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
    } else if (t === K.DATA) {
      ctx.fillStyle = "#14504a";
      ctx.fillRect(px, py, TILE, 3);
      ctx.fillStyle = "rgba(97, 244, 192, 0.35)";
      ctx.fillRect(px + 2 + Math.floor(h * 8), py + 6, 4, 1);
      ctx.fillRect(px + 2 + Math.floor(hash2(y, x) * 8), py + 11, 3, 1);
    } else if (t === K.GOLD) {
      ctx.fillStyle = "#4a3c18";
      ctx.fillRect(px, py, TILE, 2);
      ctx.strokeStyle = "rgba(255, 200, 87, 0.13)";
      ctx.beginPath();
      ctx.moveTo(px + 2, py + 13); ctx.lineTo(px + 8, py + 4); ctx.lineTo(px + 14, py + 11);
      ctx.stroke();
      if (h > 0.7) {
        ctx.fillStyle = "rgba(255, 208, 100, 0.55)";
        ctx.fillRect(px + 4 + Math.floor(h * 8), py + 4, 1, 1);
      }
    } else if (t === K.MARBLE) {
      ctx.fillStyle = "#33315c";
      ctx.fillRect(px, py, TILE, 2);
      ctx.strokeStyle = "rgba(180, 140, 255, 0.18)";
      ctx.beginPath();
      ctx.moveTo(px + 2, py + 13); ctx.lineTo(px + 7, py + 7); ctx.lineTo(px + 13, py + 9);
      ctx.stroke();
    } else if (t === K.BASALT) {
      ctx.fillStyle = "#3d282c";
      ctx.fillRect(px, py, TILE, 2);
      ctx.strokeStyle = "rgba(255, 122, 168, 0.14)";
      ctx.beginPath();
      ctx.moveTo(px + 3, py + 4); ctx.lineTo(px + 8, py + 8); ctx.lineTo(px + 6, py + 13);
      ctx.stroke();
    } else if (t === K.MAGMA) {
      ctx.fillStyle = "#5a2a1c";
      ctx.fillRect(px, py, TILE, 3);
      const glow = 0.4 + Math.sin(time * 0.003 + x + y) * 0.18;
      ctx.fillStyle = `rgba(255, 122, 60, ${glow})`;
      ctx.fillRect(px + 3 + Math.floor(h * 6), py + 6, 3, 1);
      ctx.fillRect(px + 6 + Math.floor(hash2(y, x) * 5), py + 10, 2, 1);
    } else if (t === K.MOSS) {
      ctx.fillStyle = "#173a26";
      for (let i = 0; i < 3; i++) {
        const mx = px + 2 + Math.floor(hash2(x * 3 + i, y) * 12);
        const my = py + 3 + Math.floor(hash2(x, y * 5 + i) * 11);
        ctx.fillRect(mx, my, 2, 1);
      }
      if (h > 0.9) {
        ctx.fillStyle = "rgba(126, 231, 135, 0.4)";
        ctx.fillRect(px + 8, py + 8, 1, 1);
      }
    } else if (t === K.ACID) {
      ctx.fillStyle = "#1f4a2c";
      ctx.fillRect(px, py, TILE, 2);
      const bub = 0.35 + Math.sin(time * 0.002 + x * 2 + y) * 0.25;
      ctx.fillStyle = `rgba(126, 231, 135, ${bub})`;
      ctx.fillRect(px + 4 + Math.floor(h * 6), py + 5, 2, 2);
      ctx.fillRect(px + 9, py + 10, 1, 1);
    } else if (t === K.BRIDGE) {
      ctx.fillStyle = "#5a412c";
      ctx.fillRect(px, py, TILE, TILE);
      ctx.fillStyle = "#3a2a1c";
      for (let i = 0; i < 4; i++) ctx.fillRect(px, py + 3 + i * 4, TILE, 1);
      ctx.fillStyle = "#7a5a3a";
      ctx.fillRect(px + 1, py + 1, TILE - 2, 1);
      ctx.fillStyle = "#2b1f16";
      ctx.fillRect(px + 6, py + 6, 1, 1);
      ctx.fillRect(px + 12, py + 12, 1, 1);
    } else if (t === K.SONIC) {
      ctx.fillStyle = "#21183a";
      ctx.fillRect(px, py, TILE, 2);
      ctx.strokeStyle = "rgba(255,178,107,0.16)";
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i <= 14; i += 2) {
        const yy = py + 8 + Math.sin((i + x * 3) * 0.7) * 2;
        if (i === 0) ctx.moveTo(px + i, yy); else ctx.lineTo(px + i, yy);
      }
      ctx.stroke();
      if (h > 0.82) {
        ctx.fillStyle = "rgba(255,209,102,0.55)";
        ctx.fillRect(px + 4 + Math.floor(h * 7), py + 3, 1, 1);
      }
    } else if (t === K.SCORE) {
      ctx.fillStyle = "#332452";
      ctx.fillRect(px, py, TILE, 2);
      ctx.strokeStyle = "rgba(255,209,102,0.22)";
      for (let i = 0; i < 4; i++) {
        ctx.beginPath(); ctx.moveTo(px + 1, py + 5 + i * 3); ctx.lineTo(px + 15, py + 5 + i * 3); ctx.stroke();
      }
      if (h > 0.6) {
        ctx.fillStyle = "rgba(255,178,107,0.65)";
        ctx.fillRect(px + 5 + Math.floor(h * 6), py + 6, 2, 2);
        ctx.fillRect(px + 7 + Math.floor(h * 6), py + 3, 1, 4);
      }
    } else if (t === K.NEURAL) {
      ctx.fillStyle = "#0d2638";
      ctx.fillRect(px, py, TILE, 2);
      ctx.strokeStyle = "rgba(107,213,255,0.14)";
      ctx.beginPath();
      ctx.moveTo(px + 3, py + 12); ctx.lineTo(px + 8, py + 5); ctx.lineTo(px + 13, py + 9);
      ctx.stroke();
      ctx.fillStyle = "rgba(107,213,255,0.45)";
      ctx.fillRect(px + 7, py + 4, 1, 1);
      ctx.fillRect(px + 12, py + 8, 1, 1);
    } else if (t === K.SYNAPSE) {
      ctx.fillStyle = "#154657";
      ctx.fillRect(px, py, TILE, 2);
      ctx.strokeStyle = "rgba(97,244,192,0.24)";
      ctx.beginPath();
      ctx.moveTo(px + 2, py + 10); ctx.lineTo(px + 7, py + 5); ctx.lineTo(px + 14, py + 7);
      ctx.stroke();
      ctx.fillStyle = "rgba(97,244,192,0.7)";
      ctx.fillRect(px + 6, py + 4, 2, 2);
      ctx.fillRect(px + 13, py + 6, 1, 1);
    } else if (t === K.WALL) {
      ctx.fillStyle = "#241f38";
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
    } else if (d.type === "terminal") {
      const a = d.accent || "#61f4c0";
      ctx.fillStyle = "rgba(2,6,10,0.35)";
      ctx.beginPath(); ctx.ellipse(px + 7, py + 12, 8, 2.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#162032";
      ctx.fillRect(px, py - 16, 14, 28);
      ctx.fillStyle = "#22304a";
      ctx.fillRect(px + 2, py - 14, 10, 4);
      ctx.fillStyle = hexA(a, 0.75);
      for (let i = 0; i < 3; i++) {
        if (Math.sin(time * 0.002 + i * 2 + d.x) > -0.2) {
          ctx.fillRect(px + 3 + i * 3, py - 5 + i * 3, 2, 1);
        }
      }
      ctx.fillStyle = "rgba(255,255,255,0.08)";
      ctx.fillRect(px + 2, py - 9, 10, 1);
    } else if (d.type === "pillar") {
      const a = d.accent || "#b48cff";
      ctx.fillStyle = "rgba(2,6,10,0.35)";
      ctx.beginPath(); ctx.ellipse(px + 6, py + 12, 8, 2.5, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#2a2648";
      ctx.fillRect(px, py - 14, 12, 26);
      ctx.fillStyle = "#3d3766";
      ctx.fillRect(px + 1, py - 14, 3, 24);
      ctx.fillStyle = "#1c1933";
      ctx.fillRect(px - 2, py + 10, 16, 4);
      ctx.fillStyle = hexA(a, 0.8);
      ctx.fillRect(px + 4, py - 8, 4, 1);
      ctx.fillRect(px + 5, py - 10, 2, 5);
    } else if (d.type === "book") {
      const a = d.accent || "#ffc857";
      ctx.fillStyle = "#2a1f33";
      ctx.fillRect(px - 6, py + 4, 14, 5);
      ctx.fillStyle = "#4a3a5c";
      ctx.fillRect(px - 5, py, 13, 4);
      ctx.fillStyle = a;
      ctx.fillRect(px - 4, py + 1, 11, 1);
      ctx.fillStyle = "#d9d0ff";
      ctx.fillRect(px - 3, py - 5, 10, 4);
      ctx.fillStyle = "#8d82b8";
      ctx.fillRect(px - 3, py - 5, 1, 4);
    } else if (d.type === "orb") {
      const a = d.accent || "#ff7aa8";
      const bob = Math.sin(time * 0.002 + d.x * 3) * 3;
      ctx.fillStyle = hexA(a, 0.16);
      ctx.beginPath(); ctx.arc(px, py + bob, 12, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = hexA(a, 0.8);
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(px, py + bob, 5, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.ellipse(px, py + bob, 10, 3, 0.4, 0, Math.PI * 2); ctx.stroke();
    } else if (d.type === "crystal") {
      const a = d.accent || "#ff7aa8";
      const glow = 0.25 + Math.sin(time * 0.002 + d.x) * 0.1;
      ctx.fillStyle = hexA(a, glow);
      ctx.fillRect(px - 6, py - 14, 12, 26);
      ctx.fillStyle = a;
      ctx.beginPath();
      ctx.moveTo(px, py - 16); ctx.lineTo(px + 4, py - 1);
      ctx.lineTo(px + 1, py + 8); ctx.lineTo(px - 4, py - 2);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.4)";
      ctx.fillRect(px - 1, py - 8, 1, 5);
    } else if (d.type === "flask") {
      const a = d.accent || "#7ee787";
      ctx.fillStyle = "#d9d0e8";
      ctx.fillRect(px - 4, py - 14, 8, 2);
      ctx.fillRect(px - 2, py - 12, 4, 7);
      ctx.beginPath();
      ctx.moveTo(px - 2, py - 5); ctx.lineTo(px - 8, py + 9);
      ctx.lineTo(px + 8, py + 9); ctx.lineTo(px + 2, py - 5);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = hexA(a, 0.75);
      ctx.beginPath();
      ctx.moveTo(px - 5, py + 2); ctx.lineTo(px - 8, py + 9);
      ctx.lineTo(px + 8, py + 9); ctx.lineTo(px + 5, py + 2);
      ctx.closePath(); ctx.fill();
    } else if (d.type === "bubble") {
      const a = d.accent || "#7ee787";
      const bob = Math.sin(time * 0.003 + d.x * 5) * 2;
      ctx.strokeStyle = hexA(a, 0.55);
      ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(px, py + bob, 3, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(px + 4, py - 5 + bob, 1.6, 0, Math.PI * 2); ctx.stroke();
    } else if (d.type === "note") {
      const a = d.accent || "#ffb26b";
      const bob = Math.sin(time * 0.002 + d.x * 3) * 3;
      ctx.fillStyle = hexA(a, 0.18);
      ctx.beginPath(); ctx.arc(px, py + bob, 10, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = a;
      ctx.beginPath(); ctx.ellipse(px - 2, py + 5 + bob, 4, 3, -0.3, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(px + 1, py - 10 + bob, 2, 16);
      ctx.fillRect(px + 1, py - 10 + bob, 6, 2);
    } else if (d.type === "speaker") {
      const a = d.accent || "#ffb26b";
      ctx.fillStyle = "#2a2038";
      ctx.fillRect(px - 7, py - 6, 7, 12);
      ctx.fillStyle = "#4a3a5c";
      ctx.beginPath();
      ctx.moveTo(px, py - 6); ctx.lineTo(px + 7, py - 11);
      ctx.lineTo(px + 7, py + 11); ctx.lineTo(px, py + 6); ctx.closePath(); ctx.fill();
      const pulse = 0.3 + Math.sin(time * 0.003 + d.x) * 0.2;
      ctx.strokeStyle = hexA(a, pulse);
      ctx.beginPath(); ctx.arc(px + 8, py, 9, -0.7, 0.7); ctx.stroke();
      ctx.beginPath(); ctx.arc(px + 8, py, 15, -0.6, 0.6); ctx.stroke();
    } else if (d.type === "synapse") {
      const a = d.accent || "#6bd5ff";
      const pulse = 0.35 + Math.sin(time * 0.002 + d.x * 4) * 0.25;
      ctx.strokeStyle = hexA(a, pulse);
      ctx.beginPath();
      ctx.moveTo(px - 8, py + 6); ctx.lineTo(px, py - 6); ctx.lineTo(px + 8, py + 6);
      ctx.stroke();
      ctx.fillStyle = hexA(a, 0.8);
      ctx.beginPath(); ctx.arc(px - 8, py + 6, 2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(px, py - 6, 2, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(px + 8, py + 6, 2, 0, Math.PI * 2); ctx.fill();
    } else if (d.type === "wave") {
      const a = d.accent || "#ffb26b";
      ctx.strokeStyle = hexA(a, 0.45);
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = -8; i <= 8; i += 2) {
        const yy = py + Math.sin(i * 0.8 + time * 0.003) * 3;
        if (i === -8) ctx.moveTo(px + i, yy); else ctx.lineTo(px + i, yy);
      }
      ctx.stroke();
    }
  }

  function drawStation(s, time) {
    const px = s.x * TILE, py = s.y * TILE;
    const pulse = 0.5 + Math.sin(time * 0.0024 + s.x) * 0.5;
    const g = ctx.createRadialGradient(px, py, 2, px, py, 34);
    g.addColorStop(0, hexA(s.accent, 0.15 + pulse * 0.07));
    g.addColorStop(1, hexA(s.accent, 0));
    ctx.fillStyle = g;
    ctx.fillRect(px - 36, py - 36, 72, 72);

    if (s.icon === "fountain") {
      ctx.fillStyle = "rgba(2,6,10,0.4)";
      ctx.beginPath(); ctx.ellipse(px, py + 9, 18, 6.5, 0, 0, Math.PI * 2); ctx.fill();
      const waterGlow = ctx.createRadialGradient(px, py - 2, 2, px, py - 2, 24);
      waterGlow.addColorStop(0, "rgba(107,213,255,0.28)");
      waterGlow.addColorStop(1, "rgba(107,213,255,0)");
      ctx.fillStyle = waterGlow;
      ctx.fillRect(px - 26, py - 26, 52, 44);
      ctx.fillStyle = "#7f86b2";
      ctx.fillRect(px - 16, py - 2, 32, 10);
      ctx.fillStyle = "#a9b0d8";
      ctx.fillRect(px - 16, py - 4, 32, 3);
      ctx.fillStyle = "#2a6a9a";
      ctx.fillRect(px - 12, py - 2, 24, 6);
      ctx.fillStyle = "rgba(140,230,255,0.75)";
      for (let i = 0; i < 5; i++) {
        const a = time * 0.002 + i * 1.7;
        ctx.fillRect(px + Math.sin(a) * 9, py - 4 - (i % 3) * 2, 2, 2);
      }
      ctx.fillStyle = "#c8cdf0";
      ctx.fillRect(px - 2, py - 17, 4, 15);
      ctx.fillStyle = "#e2e6ff";
      ctx.fillRect(px - 7, py - 19, 14, 3);
      ctx.fillStyle = "rgba(140,230,255,0.8)";
      ctx.fillRect(px - 1, py - 22, 2, 4);
      return;
    }
    if (s.icon === "radio") {
      ctx.fillStyle = "#2a2438";
      ctx.fillRect(px - 2, py - 24, 4, 30);
      ctx.fillStyle = "#ffb26b";
      ctx.fillRect(px - 4, py - 24, 8, 4);
      const r = 8 + (time * 0.02) % 22;
      ctx.strokeStyle = hexA("#ffb26b", 0.5 * (1 - (r - 8) / 22));
      ctx.beginPath(); ctx.arc(px, py - 22, r, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = "#3a3048";
      ctx.fillRect(px - 8, py + 4, 16, 7);
      ctx.fillStyle = "#ffb26b";
      ctx.fillRect(px - 5, py + 6, 2, 2);
      ctx.fillRect(px, py + 6, 2, 2);
      return;
    }

    // pedestal comum
    ctx.fillStyle = "rgba(2,6,10,0.35)";
    ctx.beginPath(); ctx.ellipse(px, py + 9, 14, 4.5, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#141a2e";
    ctx.fillRect(px - 13, py - 3, 26, 10);
    ctx.fillStyle = "#232c48";
    ctx.fillRect(px - 12, py - 4, 24, 3);
    ctx.fillStyle = hexA(s.accent, 0.35);
    ctx.fillRect(px - 10, py - 4, 20, 1);
    ctx.fillStyle = "#0d1220";
    for (const [dx, dy] of [[-11, 3], [9, 3], [-11, -1], [9, -1]]) {
      ctx.fillRect(px + dx, py + dy, 2, 2);
    }
    const beam = ctx.createLinearGradient(px, py - 4, px, py - 30);
    beam.addColorStop(0, hexA(s.accent, 0.16));
    beam.addColorStop(1, hexA(s.accent, 0));
    ctx.fillStyle = beam;
    ctx.fillRect(px - 8, py - 32, 16, 30);
    drawStationIcon(s.icon, px, py - 24, time, s.accent);
  }

  function drawStationIcon(icon, px, py, time, accent) {
    const bob = Math.sin(time * 0.002 + px * 0.01) * 1.4;
    ctx.save();
    ctx.translate(px, py + bob);
    ctx.strokeStyle = accent;
    ctx.fillStyle = accent;
    ctx.lineWidth = 1.6;
    ctx.lineCap = "round";

    if (icon === "gate") {
      ctx.strokeRect(-7, -7, 14, 14);
      ctx.beginPath();
      ctx.moveTo(-12, -4); ctx.lineTo(-7, -4);
      ctx.moveTo(-12, 5); ctx.lineTo(-7, 5);
      ctx.moveTo(7, 0); ctx.lineTo(12, 0);
      ctx.stroke();
      ctx.fillRect(-12, -5, 1, 2);
      ctx.fillRect(-12, 4, 1, 2);
      ctx.beginPath(); ctx.arc(12, 0, 1.8, 0, Math.PI * 2); ctx.fill();
    } else if (icon === "chip") {
      ctx.fillRect(-7, -7, 14, 14);
      ctx.fillStyle = "#0b1024";
      ctx.fillRect(-4, -4, 8, 8);
      ctx.fillStyle = accent;
      for (let i = -5; i <= 5; i += 2.5) {
        ctx.fillRect(i, -10, 1, 3);
        ctx.fillRect(i, 7, 1, 3);
        ctx.fillRect(-10, i, 3, 1);
        ctx.fillRect(7, i, 3, 1);
      }
    } else if (icon === "clock") {
      ctx.beginPath(); ctx.arc(0, 0, 8, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, 0); ctx.lineTo(0, -5);
      ctx.moveTo(0, 0); ctx.lineTo(4, 2);
      ctx.stroke();
      ctx.fillRect(-1, -9, 2, 2);
    } else if (icon === "cpu") {
      ctx.strokeRect(-8, -6, 16, 12);
      ctx.strokeRect(-3, -3, 6, 6);
      for (let i = -6; i <= 6; i += 3) {
        ctx.beginPath();
        ctx.moveTo(i, -9); ctx.lineTo(i, -6);
        ctx.moveTo(i, 6); ctx.lineTo(i, 9);
        ctx.stroke();
      }
    } else if (icon === "book") {
      ctx.beginPath();
      ctx.moveTo(0, -7); ctx.lineTo(-8, -5); ctx.lineTo(-8, 6); ctx.lineTo(0, 8);
      ctx.lineTo(8, 6); ctx.lineTo(8, -5); ctx.closePath(); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(0, -7); ctx.lineTo(0, 8); ctx.stroke();
    } else if (icon === "infinity") {
      ctx.beginPath(); ctx.arc(-4.5, 0, 4.5, 0, Math.PI * 2); ctx.stroke();
      ctx.beginPath(); ctx.arc(4.5, 0, 4.5, 0, Math.PI * 2); ctx.stroke();
    } else if (icon === "shape") {
      ctx.beginPath();
      ctx.moveTo(0, -9); ctx.lineTo(8, 4); ctx.lineTo(-8, 4); ctx.closePath(); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(0, -4); ctx.lineTo(5, 3); ctx.lineTo(-5, 3); ctx.closePath(); ctx.stroke();
    } else if (icon === "curve") {
      ctx.beginPath();
      for (let i = -10; i <= 10; i++) {
        const yy = Math.sin((i + 10) / 20 * Math.PI * 2) * 5;
        if (i === -10) ctx.moveTo(i, yy); else ctx.lineTo(i, yy);
      }
      ctx.stroke();
      ctx.fillStyle = "#ffc857";
      ctx.fillRect(-2, -8, 2, 16);
    } else if (icon === "dice") {
      ctx.strokeRect(-8, -8, 16, 16);
      ctx.fillRect(-5, -5, 2, 2);
      ctx.fillRect(3, -5, 2, 2);
      ctx.fillRect(-1, -1, 2, 2);
      ctx.fillRect(-5, 3, 2, 2);
      ctx.fillRect(3, 3, 2, 2);
    } else if (icon === "tree") {
      ctx.beginPath();
      ctx.moveTo(0, 8); ctx.lineTo(0, -8);
      ctx.moveTo(0, -3); ctx.lineTo(-7, -8);
      ctx.moveTo(0, 1); ctx.lineTo(7, -6);
      ctx.moveTo(0, 5); ctx.lineTo(-5, 0);
      ctx.stroke();
      ctx.fillRect(-8, -9, 2, 2);
      ctx.fillRect(6, -7, 2, 2);
      ctx.fillRect(-6, -1, 2, 2);
    } else if (icon === "pendulum") {
      ctx.beginPath();
      ctx.moveTo(0, -10); ctx.lineTo(0, 0);
      ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 4, 4, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(0, -10, 1.5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = hexA(accent, 0.4);
      ctx.beginPath(); ctx.arc(0, -10, 10, 0.2, Math.PI - 0.2); ctx.stroke();
    } else if (icon === "wave") {
      ctx.beginPath();
      for (let i = -10; i <= 10; i++) {
        const yy = Math.sin(i * 0.7 + time * 0.004) * 5;
        if (i === -10) ctx.moveTo(i, yy); else ctx.lineTo(i, yy);
      }
      ctx.stroke();
    } else if (icon === "heat") {
      ctx.strokeRect(-3, -10, 6, 13);
      ctx.beginPath(); ctx.arc(0, 6, 5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#ff9f6b";
      ctx.fillRect(-1, -6, 2, 10);
    } else if (icon === "prism") {
      ctx.beginPath();
      ctx.moveTo(0, -9); ctx.lineTo(9, 7); ctx.lineTo(-9, 7); ctx.closePath(); ctx.stroke();
      ctx.strokeStyle = "rgba(255,255,255,0.75)";
      ctx.beginPath(); ctx.moveTo(-12, 0); ctx.lineTo(-2, 0); ctx.stroke();
      const cols = ["#ff6b6b", "#ffc857", "#7ee787", "#6bd5ff", "#b48cff"];
      cols.forEach((c, i) => {
        ctx.strokeStyle = c;
        ctx.beginPath(); ctx.moveTo(2, 0); ctx.lineTo(13, -6 + i * 3); ctx.stroke();
      });
    } else if (icon === "planet") {
      ctx.beginPath(); ctx.arc(0, 0, 6, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = hexA(accent, 0.7);
      ctx.beginPath(); ctx.ellipse(0, 0, 12, 3.5, 0.3, 0, Math.PI * 2); ctx.stroke();
    } else if (icon === "table") {
      ctx.strokeRect(-9, -7, 18, 14);
      for (let i = 1; i < 3; i++) {
        ctx.beginPath(); ctx.moveTo(-9, -7 + i * 4.6); ctx.lineTo(9, -7 + i * 4.6); ctx.stroke();
      }
      for (let i = 1; i < 4; i++) {
        ctx.beginPath(); ctx.moveTo(-9 + i * 4.5, -7); ctx.lineTo(-9 + i * 4.5, 7); ctx.stroke();
      }
    } else if (icon === "molecule") {
      ctx.beginPath(); ctx.arc(-5, 5, 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(5, 5, 3, 0, Math.PI * 2); ctx.fill();
      ctx.beginPath(); ctx.arc(0, -6, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = hexA(accent, 0.7);
      ctx.beginPath();
      ctx.moveTo(-5, 2); ctx.lineTo(0, -3);
      ctx.moveTo(5, 2); ctx.lineTo(0, -3);
      ctx.stroke();
    } else if (icon === "flask") {
      ctx.fillStyle = "#d9d0e8";
      ctx.fillRect(-2, -10, 4, 8);
      ctx.beginPath();
      ctx.moveTo(-2, -2); ctx.lineTo(-8, 8); ctx.lineTo(8, 8); ctx.lineTo(2, -2);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = hexA(accent, 0.8);
      ctx.beginPath();
      ctx.moveTo(-5, 3); ctx.lineTo(-8, 8); ctx.lineTo(8, 8); ctx.lineTo(5, 3);
      ctx.closePath(); ctx.fill();
    } else if (icon === "fire") {
      ctx.beginPath();
      ctx.moveTo(0, 9);
      ctx.quadraticCurveTo(-8, 3, -2, -4);
      ctx.quadraticCurveTo(-1, -9, 3, -10);
      ctx.quadraticCurveTo(1, -3, 5, 0);
      ctx.quadraticCurveTo(9, 5, 0, 9);
      ctx.fill();
      ctx.fillStyle = "#ffc857";
      ctx.beginPath();
      ctx.moveTo(0, 6);
      ctx.quadraticCurveTo(-3, 2, 1, -2);
      ctx.quadraticCurveTo(3, 2, 0, 6);
      ctx.fill();
    } else if (icon === "scale") {
      ctx.beginPath(); ctx.moveTo(0, -9); ctx.lineTo(0, 7); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(-9, -5); ctx.lineTo(9, -5); ctx.stroke();
      ctx.beginPath(); ctx.arc(-9, -1, 4, 0, Math.PI); ctx.stroke();
      ctx.beginPath(); ctx.arc(9, -1, 4, 0, Math.PI); ctx.stroke();
      ctx.fillRect(-5, 7, 10, 2);
    } else if (icon === "note") {
      ctx.beginPath(); ctx.ellipse(-3, 5, 4.5, 3.2, -0.35, 0, Math.PI * 2); ctx.fill();
      ctx.fillRect(1, -10, 2, 17);
      ctx.fillRect(1, -10, 7, 2);
      ctx.beginPath(); ctx.ellipse(7, -3, 3.2, 2.4, -0.35, 0, Math.PI * 2); ctx.fill();
    } else if (icon === "piano") {
      ctx.strokeRect(-10, -7, 20, 15);
      for (let i = -7; i <= 7; i += 3.5) {
        ctx.beginPath(); ctx.moveTo(i, -7); ctx.lineTo(i, 8); ctx.stroke();
      }
      ctx.fillStyle = "#0b1024";
      ctx.fillRect(-5.5, -7, 2, 7);
      ctx.fillRect(1.3, -7, 2, 7);
    } else if (icon === "speaker") {
      ctx.fillRect(-9, -5, 6, 10);
      ctx.beginPath();
      ctx.moveTo(-3, -5); ctx.lineTo(4, -10); ctx.lineTo(4, 10); ctx.lineTo(-3, 5);
      ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.arc(5, 0, 7, -0.7, 0.7); ctx.stroke();
      ctx.beginPath(); ctx.arc(5, 0, 12, -0.6, 0.6); ctx.stroke();
    } else if (icon === "chart") {
      ctx.beginPath(); ctx.moveTo(-9, 8); ctx.lineTo(-9, -9); ctx.moveTo(-9, 8); ctx.lineTo(9, 8); ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(-6, 4); ctx.lineTo(-2, 0); ctx.lineTo(2, 3); ctx.lineTo(7, -6); ctx.stroke();
      ctx.fillRect(-3, -1, 2, 2);
      ctx.fillRect(1, 2, 2, 2);
      ctx.fillRect(6, -7, 2, 2);
    } else if (icon === "network") {
      const pts = [[0, -8], [-8, 5], [8, 5], [0, 1]];
      ctx.beginPath();
      ctx.moveTo(0, -8); ctx.lineTo(-8, 5);
      ctx.moveTo(0, -8); ctx.lineTo(8, 5);
      ctx.moveTo(-8, 5); ctx.lineTo(8, 5);
      ctx.stroke();
      for (const [x, y] of pts) { ctx.beginPath(); ctx.arc(x, y, 2.5, 0, Math.PI * 2); ctx.fill(); }
    } else if (icon === "text") {
      ctx.strokeRect(-9, -8, 18, 16);
      for (let i = 0; i < 4; i++) {
        ctx.beginPath(); ctx.moveTo(-6, -4 + i * 3.2); ctx.lineTo(6 - (i === 3 ? 5 : 0), -4 + i * 3.2); ctx.stroke();
      }
    } else if (icon === "eye") {
      ctx.beginPath(); ctx.moveTo(-10, 0); ctx.quadraticCurveTo(0, -10, 10, 0); ctx.quadraticCurveTo(0, 10, -10, 0); ctx.stroke();
      ctx.beginPath(); ctx.arc(0, 0, 3.5, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#0b1024";
      ctx.beginPath(); ctx.arc(0, 0, 1.4, 0, Math.PI * 2); ctx.fill();
    } else {
      ctx.beginPath();
      ctx.moveTo(0, -9); ctx.lineTo(8, 0); ctx.lineTo(0, 9); ctx.lineTo(-8, 0);
      ctx.closePath(); ctx.stroke();
    }
    ctx.restore();
  }

  function drawWaystone(w, time) {
    const px = w.x * TILE, py = w.y * TILE;
    const pulse = 0.5 + Math.sin(time * 0.002 + w.x) * 0.5;
    const g = ctx.createRadialGradient(px, py - 8, 2, px, py - 8, 34);
    g.addColorStop(0, hexA(w.accent, 0.18 + pulse * 0.08));
    g.addColorStop(1, hexA(w.accent, 0));
    ctx.fillStyle = g;
    ctx.fillRect(px - 36, py - 42, 72, 72);
    ctx.fillStyle = "rgba(2,6,10,0.4)";
    ctx.beginPath(); ctx.ellipse(px, py + 8, 12, 4, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#1b2138";
    ctx.fillRect(px - 10, py - 2, 20, 8);
    ctx.fillStyle = "#2d3556";
    ctx.fillRect(px - 8, py - 4, 16, 3);
    ctx.fillStyle = "#252b47";
    ctx.fillRect(px - 6, py - 26, 12, 23);
    ctx.fillStyle = "#343d63";
    ctx.fillRect(px - 6, py - 26, 3, 21);
    ctx.fillStyle = hexA(w.accent, 0.85);
    ctx.beginPath();
    ctx.moveTo(px, py - 21); ctx.lineTo(px + 3, py - 17);
    ctx.lineTo(px, py - 12); ctx.lineTo(px - 3, py - 17);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = hexA(w.accent, 0.5);
    ctx.fillRect(px - 1, py - 11, 2, 6);
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
    if (npc.questMark) {
      const ready = npc.questMark === "ready";
      const color = ready ? "#61f4c0" : "#ffc857";
      const lift = Math.sin(time * 0.006 + npc.bob) * 1.4;
      ctx.fillStyle = "rgba(8,10,20,0.9)";
      ctx.fillRect(px - 4, py - 42 + lift, 8, 10);
      ctx.strokeStyle = color;
      ctx.lineWidth = 1;
      ctx.strokeRect(px - 4.5, py - 42.5 + lift, 9, 11);
      ctx.fillStyle = color;
      ctx.font = "bold 8px ui-monospace, monospace";
      ctx.fillText(ready ? "?" : "!", px, py - 34 + lift);
      ctx.font = "5px ui-monospace, monospace";
    }
    ctx.textAlign = "left";
    if (npc.bubble && npc.bubble.until > time) {
      drawBubble(npc.bubble.text, px, py, npc.accent || "#ffc857");
    }
  }

  function skiffRear(dir) {
    return {
      x: dir === 1 ? -1 : dir === 2 ? 1 : 0,
      y: dir === 3 ? -1 : dir === 0 ? 1 : 0,
    };
  }

  function drawSkiff(px, py, dir, time, boost = 1, moving = false) {
    if (boost <= 0.01) return;
    const bob = Math.sin(time * 0.007) * 1.1;
    const by = py - 2 + bob;
    const rear = skiffRear(dir);
    const vx = -rear.x;
    const vy = -rear.y;
    ctx.save();
    ctx.globalAlpha = Math.min(1, boost);

    // sombra e halo
    ctx.fillStyle = "rgba(2, 4, 10, 0.32)";
    ctx.beginPath();
    ctx.ellipse(px, py + 4, 12, 3.2, 0, 0, Math.PI * 2);
    ctx.fill();
    const pulse = 0.5 + Math.sin(time * 0.018) * 0.5;
    const gx = px + rear.x * 9;
    const gy = by + rear.y * 5;
    const glow = ctx.createRadialGradient(gx, gy, 1, gx, gy, 19);
    glow.addColorStop(0, `rgba(107, 213, 255, ${0.18 + pulse * 0.14})`);
    glow.addColorStop(1, "rgba(107, 213, 255, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(px - 26, by - 20, 52, 40);

    // casco em degraus
    ctx.fillStyle = "#0b2438";
    ctx.fillRect(px - 11, by - 1, 22, 4);
    ctx.fillRect(px - 8, by - 3, 16, 2);
    ctx.fillRect(px - 8, by + 3, 16, 2);
    ctx.fillStyle = "#1d6280";
    ctx.fillRect(px - 10, by, 20, 2);
    ctx.fillRect(px - 7, by - 2, 14, 2);
    ctx.fillStyle = "#61f4c0";
    ctx.fillRect(px - 9, by, 18, 1);
    // convés
    ctx.fillStyle = "#122a4a";
    ctx.fillRect(px - 6, by - 2, 12, 2);
    ctx.fillStyle = "#ffc857";
    ctx.fillRect(px - 2, by - 2, 4, 2);
    // aletas
    ctx.fillStyle = "#2f8fae";
    ctx.fillRect(px - 13, by, 3, 3);
    ctx.fillRect(px + 10, by, 3, 3);
    // motor
    ctx.fillStyle = "#ffb26b";
    ctx.fillRect(px + rear.x * 9 - 2, by + rear.y * 6 - 1, 4, 3);
    ctx.fillStyle = "#fff3d1";
    ctx.fillRect(px + rear.x * 9 - 1, by + rear.y * 6, 2, 1);

    if (moving) {
      ctx.strokeStyle = "rgba(223, 245, 255, 0.42)";
      ctx.lineWidth = 1;
      for (let i = 0; i < 3; i++) {
        const d = 16 + i * 7;
        const ox = -vy * (i - 1) * 3;
        const oy = vx * (i - 1) * 3;
        ctx.beginPath();
        ctx.moveTo(px + rear.x * d + ox, by + rear.y * d + oy);
        ctx.lineTo(px + rear.x * (d + 8) + ox, by + rear.y * (d + 8) + oy);
        ctx.stroke();
      }
    }
    ctx.restore();
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
    // cabelo: por cima e cobrindo a nuca, nunca o lado do rosto
    ctx.fillStyle = colors.hair;
    ctx.fillRect(-4, -21, 8, 3);
    if (dir === 0) {
      ctx.fillRect(-5, -20, 2, 5);
      ctx.fillRect(3, -20, 2, 5);
    } else if (dir === 1) {
      // olhando para a esquerda: nuca à direita
      ctx.fillRect(1, -20, 4, 6);
      ctx.fillRect(-4, -21, 8, 3);
    } else if (dir === 2) {
      // olhando para a direita: nuca à esquerda
      ctx.fillRect(-5, -20, 4, 6);
      ctx.fillRect(-4, -21, 8, 3);
    } else {
      // de costas
      ctx.fillRect(-4, -20, 8, 7);
    }
    // rosto: olho e nariz do lado para onde anda
    ctx.fillStyle = "#14121f";
    if (dir === 0) {
      ctx.fillRect(-2, -17, 1, 2);
      ctx.fillRect(1, -17, 1, 2);
    } else if (dir === 1) {
      ctx.fillRect(-3, -17, 1, 2);
    } else if (dir === 2) {
      ctx.fillRect(2, -17, 1, 2);
    }
    if (dir === 1 || dir === 2) {
      ctx.fillStyle = colors.skin;
      ctx.fillRect(dir === 1 ? -5 : 4, -16, 1, 2);
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
    const follow = player.boost > 0.35 ? 0.03 : 0.012;
    const k = 1 - Math.exp(-follow * 16);
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

    if (player.boost > 0.4 && moving) {
      const rear = skiffRear(player.dir);
      for (let i = 0; i < 2; i++) {
        trail.push({
          x: player.x * TILE + rear.x * (8 + Math.random() * 4) + (Math.random() - 0.5) * 6,
          y: player.y * TILE - 2 + rear.y * (5 + Math.random() * 3) + (Math.random() - 0.5) * 4,
          life: 0.75 + Math.random() * 0.25,
        });
      }
      if (trail.length > 60) trail.shift();
    }
    for (const t of trail) {
      t.life -= 0.028;
      if (t.life <= 0) continue;
      if (t.x < camX - 20 || t.x > camX + viewW + 20 || t.y < camY - 20 || t.y > camY + viewH + 20) continue;
      const s = 1 + t.life * 3.4;
      ctx.fillStyle = `rgba(107, 213, 255, ${(t.life * 0.32).toFixed(3)})`;
      ctx.fillRect(t.x - s / 2, t.y - s / 2, s, s);
      ctx.fillStyle = `rgba(255, 200, 87, ${(t.life * 0.14).toFixed(3)})`;
      ctx.fillRect(t.x - s / 4, t.y - s / 4, s / 2, s / 2);
    }
    trail = trail.filter((t) => t.life > 0);

    const drawables = [];
    for (const w of world.waystones) {
      drawables.push({ y: w.y * TILE, fn: () => drawWaystone(w, time) });
    }
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
          const lift = p.mount ? 5 : 0;
          if (p.mount) drawSkiff(p.x * TILE, p.y * TILE, p.dir || 0, time, 1, p.moving);
          drawHuman(p.x * TILE, p.y * TILE - lift, p.dir || 0, p.moving, time, peerColors, null, 1);
          drawNameTag(p.name, p.x * TILE, p.y * TILE - 26 - lift, p.color);
          if (p.bubble && p.bubble.until > now) {
            drawBubble(p.bubble.text, p.x * TILE, p.y * TILE - lift, p.color);
          }
        },
      });
    }
    drawables.push({
      y: player.y * TILE,
      fn: () => {
        const lift = 5 * player.boost;
        const bob = Math.sin(time * 0.007) * 1.1 * player.boost;
        if (player.boost > 0.01) drawSkiff(player.x * TILE, player.y * TILE, player.dir, time, player.boost, moving);
        drawHuman(player.x * TILE, player.y * TILE - lift + bob, player.dir, moving, time,
          PLAYER_COLORS[player.colorIndex % PLAYER_COLORS.length], null, 1);
        drawNameTag(player.name, player.x * TILE, player.y * TILE - 26 - lift, player.color);
        if (player.bubble && player.bubble.until > now) {
          drawBubble(player.bubble.text, player.x * TILE, player.y * TILE - lift, player.color);
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
    if (fogVersion !== world.exploredVersion && performance.now() - lastFogBuild > 120) {
      fogVersion = world.exploredVersion;
      lastFogBuild = performance.now();
      fogCtx.clearRect(0, 0, mmFog.width, mmFog.height);
      fogCtx.fillStyle = "#04060d";
      for (let y = 0; y < MAP_H; y++) {
        for (let x = 0; x < MAP_W; x++) {
          if (!world.isExplored(x, y)) fogCtx.fillRect(x * 2, y * 2, 2, 2);
        }
      }
    }
    mctx.drawImage(mmBase, 0, 0);
    mctx.drawImage(mmFog, 0, 0);
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

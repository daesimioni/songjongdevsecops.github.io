import { outfitById } from "./outfits.js";
import { avatarColors } from "./avatar.js";
import { drawHuman } from "./human.js";
import {
  TILE, MAP_W, MAP_H, WORLD_W, WORLD_H, TILE_KIND as K, PLAYER_COLORS,
} from "./config.js";
import { hash2 } from "./world.js";
import { NPCS } from "./content.js";
import { itemIconCanvas } from "./item-art.js";
import { ITEMS } from "./rpg-data.js";
import { drawPetSprite } from "./pet-art.js";
import { BIOMES, TILE_STYLE } from "./identity.js";
import { drawSkiff } from "./skiff.js";

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
  if (ctx) ctx.imageSmoothingEnabled = false;
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

  let quality = 1;

  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1) * quality;
    vw = window.innerWidth;
    vh = window.innerHeight;
    canvas.width = Math.round(vw * dpr);
    canvas.height = Math.round(vh * dpr);
    const z = Math.round(Math.min(vw / 460, vh / 320) * 2) / 2;
    zoom = Math.max(1.5, Math.min(3.5, z));
  }

  function tileColor(t) {
    const style = TILE_STYLE[t];
    if (style) return style.color;
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


  // O padrão do bioma é uma marca discreta no chão: pontos, grade, onda, runa,
  // rachadura, estrela, duna ou tijolo. Muda por área e não custa por frame,
  // porque o chunk fica em cache.
  function drawBiotile(c, px, py, style, h) {
    c.save();
    c.fillStyle = style.accent;
    c.strokeStyle = style.accent;
    c.lineWidth = 1;
    c.globalAlpha = style.base ? 0.1 : 0.16;
    const jx = Math.floor(h * 6);
    const jy = Math.floor(hash2(px, py) * 6);
    if (style.pattern === "dots") {
      c.fillRect(px + 3 + jx, py + 4 + jy, 2, 2);
      c.fillRect(px + 11 - jx, py + 11 - jy, 1, 1);
    } else if (style.pattern === "grid") {
      c.globalAlpha *= 0.7;
      c.fillRect(px, py, TILE, 1);
      c.fillRect(px, py, 1, TILE);
    } else if (style.pattern === "waves") {
      c.beginPath();
      c.moveTo(px + 1, py + 8 + jy * 0.4);
      c.quadraticCurveTo(px + 5, py + 4, px + 8, py + 8);
      c.quadraticCurveTo(px + 11, py + 12, px + 15, py + 8);
      c.stroke();
    } else if (style.pattern === "runes") {
      c.fillRect(px + 4 + jx, py + 6, 1, 6);
      c.fillRect(px + 4 + jx, py + 6, 4, 1);
      c.fillRect(px + 4 + jx, py + 11, 3, 1);
    } else if (style.pattern === "cracks") {
      c.beginPath();
      c.moveTo(px + 2, py + 3 + jy);
      c.lineTo(px + 7, py + 7);
      c.lineTo(px + 6, py + 12);
      c.lineTo(px + 12, py + 14);
      c.stroke();
    } else if (style.pattern === "stars") {
      c.fillRect(px + 7 + jx, py + 3, 1, 5);
      c.fillRect(px + 5 + jx, py + 5, 5, 1);
    } else if (style.pattern === "dunes") {
      c.beginPath();
      c.arc(px + 8, py + 16, 9, Math.PI * 1.05, Math.PI * 1.95);
      c.stroke();
    } else {
      c.fillRect(px + 1, py + 2 + jy, 6, 4);
      c.fillRect(px + 9, py + 9 - jy, 6, 4);
    }
    c.restore();
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
        else if (TILE_STYLE[t]) c = TILE_STYLE[t].color;
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

  function drawGroundOn(c, x, y, t, time, animated) {
    const px = x * TILE, py = y * TILE;
    const h = hash2(x, y);
    c.fillStyle = tileColor(t);
    c.fillRect(px, py, TILE, TILE);
    const biomo = TILE_STYLE[t];
    if (biomo) {
      drawBiotile(c, px, py, biomo, h);
      return;
    }

    if (t === K.GRASS || t === K.FLOWER) {
      // manchas de grama mais nova dão relevo sem custo por frame
      if (h > 0.62) {
        c.fillStyle = "rgba(32, 68, 47, 0.55)";
        c.fillRect(px + 2, py + 2, 12, 11);
      }
      const n = 3 + Math.floor(h * 3);
      for (let i = 0; i < n; i++) {
        const bx = px + 2 + Math.floor(hash2(x + i, y * 3 + i) * 12);
        const by = py + 3 + Math.floor(hash2(x * 5 + i, y) * 11);
        c.fillStyle = i % 2 ? "#214733" : "#15301f";
        c.fillRect(bx, by, 1, 2);
      }
      if (t === K.FLOWER) {
        const cols = ["#ffc857", "#ff7aa8", "#b48cff", "#6bd5ff"];
        c.fillStyle = cols[Math.floor(h * cols.length)];
        const fx = px + 6, fy = py + 7;
        c.fillRect(fx - 1, fy, 3, 1);
        c.fillRect(fx, fy - 1, 1, 3);
      }
    } else if (t === K.PATH) {
      const area = world.areaAt(x + 0.5, y + 0.5);
      const pathColor = area && BIOMES[area.id] ? BIOMES[area.id].path : "#63513a";
      c.fillStyle = pathColor;
      c.fillRect(px, py, TILE, TILE);
      c.fillStyle = "rgba(43, 33, 22, 0.55)";
      if (world.get(x, y - 1) !== K.PATH) c.fillRect(px, py, TILE, 1);
      c.fillStyle = "rgba(255, 222, 160, 0.08)";
      c.fillRect(px, py, TILE, 2);
      c.fillStyle = "#4a3b29";
      for (let i = 0; i < 3; i++) {
        const sx = px + Math.floor(hash2(x + i, y + 7) * 14);
        const sy = py + 4 + Math.floor(hash2(x, y + i) * 10);
        c.fillRect(sx, sy, 2, 1);
      }
      c.fillStyle = "#7a6446";
      c.fillRect(px + Math.floor(h * 10), py + 12, 2, 1);
    } else if (t === K.STONE || t === K.PLAZA) {
      c.strokeStyle = t === K.PLAZA ? "#4b4f77" : "#2b3049";
      c.lineWidth = 1;
      c.strokeRect(px + 0.5, py + 0.5, TILE - 1, TILE - 1);
      if (h > 0.55) {
        c.fillStyle = t === K.PLAZA ? "#565b85" : "#454b6c";
        c.fillRect(px + 3, py + 3, 3, 2);
      }
      if (t === K.PLAZA && h > 0.72) {
        c.fillStyle = "rgba(255,200,87,0.28)";
        c.fillRect(px + 8, py + 8, 3, 1);
      }
    } else if (t === K.WATER) {
      const wet = (xx, yy) => {
        const n = world.get(xx, yy);
        return n !== K.WATER && n !== K.BRIDGE;
      };
      const landN = wet(x, y - 1);
      const landS = wet(x, y + 1);
      const landW = wet(x - 1, y);
      const landE = wet(x + 1, y);
      const shallow = landN || landS || landW || landE;
      // água rasa perto da costa clareia e ganha espuma: a praia fica legível
      c.fillStyle = shallow ? "#19455f" : "#0f2c46";
      c.fillRect(px, py, TILE, TILE);
      if (shallow) {
        c.fillStyle = "rgba(150, 228, 255, 0.26)";
        if (landN) c.fillRect(px + 2, py, 12, 1);
        if (landS) c.fillRect(px + 2, py + TILE - 1, 12, 1);
        if (landW) c.fillRect(px, py + 2, 1, 12);
        if (landE) c.fillRect(px + TILE - 1, py + 2, 1, 12);
        c.fillStyle = "rgba(226, 248, 255, 0.55)";
        for (let i = 0; i < 4; i++) {
          const bx = px + 1 + Math.floor(hash2(x + i * 3, y) * 14);
          const by = py + 1 + Math.floor(hash2(x, y + i * 3) * 14);
          const edge = (landN && by < py + 3) || (landS && by > py + 12) ||
            (landW && bx < px + 3) || (landE && bx > px + 12);
          if (edge) c.fillRect(bx, by, 2, 1);
        }
      }
      if (!animated) return;
      c.fillStyle = shallow ? "rgba(178, 238, 255, 0.34)" : "rgba(107, 213, 255, 0.22)";
      for (let i = 0; i < 2; i++) {
        const w = 5 + Math.round(Math.sin(time * 0.0016 + x + y + i) * 3);
        c.fillRect(px + 2 + i * 7, py + 4 + i * 5, w, 1);
      }
    } else if (t === K.SAND) {
      c.fillStyle = "#7a6844";
      c.fillRect(px, py, TILE, 2);
      c.fillStyle = "#5d4f34";
      c.fillRect(px + Math.floor(h * 10), py + 7, 2, 1);
      c.fillStyle = "rgba(240, 226, 190, 0.16)";
      c.fillRect(px + 3 + Math.floor(h * 8), py + 4, 3, 1);
      if (world.get(x, y + 1) === K.WATER) {
        c.fillStyle = "rgba(30, 60, 74, 0.45)";
        c.fillRect(px, py + TILE - 2, TILE, 2);
      }
    } else if (t === K.CIRCUIT) {
      c.fillStyle = "#0d3438";
      c.fillRect(px + 2, py + 2, TILE - 4, TILE - 4);
      c.strokeStyle = "rgba(97, 244, 192, 0.16)";
      c.lineWidth = 1;
      c.beginPath();
      if (h > 0.5) {
        c.moveTo(px + 3, py + 5); c.lineTo(px + 10, py + 5); c.lineTo(px + 10, py + 12);
      } else {
        c.moveTo(px + 5, py + 3); c.lineTo(px + 5, py + 10); c.lineTo(px + 13, py + 10);
      }
      c.stroke();
      if (h > 0.82) {
        c.fillStyle = "rgba(97, 244, 192, 0.55)";
        c.fillRect(px + 5, py + 5, 1, 1);
      }
    } else if (t === K.DATA) {
      c.fillStyle = "#14504a";
      c.fillRect(px, py, TILE, 3);
      c.fillStyle = "rgba(97, 244, 192, 0.35)";
      c.fillRect(px + 2 + Math.floor(h * 8), py + 6, 4, 1);
      c.fillRect(px + 2 + Math.floor(hash2(y, x) * 8), py + 11, 3, 1);
    } else if (t === K.GOLD) {
      c.fillStyle = "#4a3c18";
      c.fillRect(px, py, TILE, 2);
      c.strokeStyle = "rgba(255, 200, 87, 0.13)";
      c.beginPath();
      c.moveTo(px + 2, py + 13); c.lineTo(px + 8, py + 4); c.lineTo(px + 14, py + 11);
      c.stroke();
      if (h > 0.7) {
        c.fillStyle = "rgba(255, 208, 100, 0.55)";
        c.fillRect(px + 4 + Math.floor(h * 8), py + 4, 1, 1);
      }
    } else if (t === K.MARBLE) {
      c.fillStyle = "#33315c";
      c.fillRect(px, py, TILE, 2);
      c.strokeStyle = "rgba(180, 140, 255, 0.18)";
      c.beginPath();
      c.moveTo(px + 2, py + 13); c.lineTo(px + 7, py + 7); c.lineTo(px + 13, py + 9);
      c.stroke();
    } else if (t === K.BASALT) {
      c.fillStyle = "#3d282c";
      c.fillRect(px, py, TILE, 2);
      c.strokeStyle = "rgba(255, 122, 168, 0.14)";
      c.beginPath();
      c.moveTo(px + 3, py + 4); c.lineTo(px + 8, py + 8); c.lineTo(px + 6, py + 13);
      c.stroke();
    } else if (t === K.MAGMA) {
      c.fillStyle = "#5a2a1c";
      c.fillRect(px, py, TILE, 3);
      if (!animated) return;
      const glow = 0.4 + Math.sin(time * 0.003 + x + y) * 0.18;
      c.fillStyle = `rgba(255, 122, 60, ${glow})`;
      c.fillRect(px + 3 + Math.floor(h * 6), py + 6, 3, 1);
      c.fillRect(px + 6 + Math.floor(hash2(y, x) * 5), py + 10, 2, 1);
    } else if (t === K.MOSS) {
      c.fillStyle = "#173a26";
      for (let i = 0; i < 3; i++) {
        const mx = px + 2 + Math.floor(hash2(x * 3 + i, y) * 12);
        const my = py + 3 + Math.floor(hash2(x, y * 5 + i) * 11);
        c.fillRect(mx, my, 2, 1);
      }
      if (h > 0.9) {
        c.fillStyle = "rgba(126, 231, 135, 0.4)";
        c.fillRect(px + 8, py + 8, 1, 1);
      }
    } else if (t === K.ACID) {
      c.fillStyle = "#1f4a2c";
      c.fillRect(px, py, TILE, 2);
      const bub = 0.35 + Math.sin(time * 0.002 + x * 2 + y) * 0.25;
      c.fillStyle = `rgba(126, 231, 135, ${bub})`;
      c.fillRect(px + 4 + Math.floor(h * 6), py + 5, 2, 2);
      c.fillRect(px + 9, py + 10, 1, 1);
    } else if (t === K.BRIDGE) {
      c.fillStyle = "#5a412c";
      c.fillRect(px, py, TILE, TILE);
      c.fillStyle = "#3a2a1c";
      for (let i = 0; i < 4; i++) c.fillRect(px, py + 3 + i * 4, TILE, 1);
      c.fillStyle = "#7a5a3a";
      c.fillRect(px + 1, py + 1, TILE - 2, 1);
      c.fillStyle = "#2b1f16";
      c.fillRect(px + 6, py + 6, 1, 1);
      c.fillRect(px + 12, py + 12, 1, 1);
    } else if (t === K.SONIC) {
      c.fillStyle = "#21183a";
      c.fillRect(px, py, TILE, 2);
      c.strokeStyle = "rgba(255,178,107,0.16)";
      c.lineWidth = 1;
      c.beginPath();
      for (let i = 0; i <= 14; i += 2) {
        const yy = py + 8 + Math.sin((i + x * 3) * 0.7) * 2;
        if (i === 0) c.moveTo(px + i, yy); else c.lineTo(px + i, yy);
      }
      c.stroke();
      if (h > 0.82) {
        c.fillStyle = "rgba(255,209,102,0.55)";
        c.fillRect(px + 4 + Math.floor(h * 7), py + 3, 1, 1);
      }
    } else if (t === K.SCORE) {
      c.fillStyle = "#332452";
      c.fillRect(px, py, TILE, 2);
      c.strokeStyle = "rgba(255,209,102,0.22)";
      for (let i = 0; i < 4; i++) {
        c.beginPath(); c.moveTo(px + 1, py + 5 + i * 3); c.lineTo(px + 15, py + 5 + i * 3); c.stroke();
      }
      if (h > 0.6) {
        c.fillStyle = "rgba(255,178,107,0.65)";
        c.fillRect(px + 5 + Math.floor(h * 6), py + 6, 2, 2);
        c.fillRect(px + 7 + Math.floor(h * 6), py + 3, 1, 4);
      }
    } else if (t === K.NEURAL) {
      c.fillStyle = "#0d2638";
      c.fillRect(px, py, TILE, 2);
      c.strokeStyle = "rgba(107,213,255,0.14)";
      c.beginPath();
      c.moveTo(px + 3, py + 12); c.lineTo(px + 8, py + 5); c.lineTo(px + 13, py + 9);
      c.stroke();
      c.fillStyle = "rgba(107,213,255,0.45)";
      c.fillRect(px + 7, py + 4, 1, 1);
      c.fillRect(px + 12, py + 8, 1, 1);
    } else if (t === K.SYNAPSE) {
      c.fillStyle = "#154657";
      c.fillRect(px, py, TILE, 2);
      c.strokeStyle = "rgba(97,244,192,0.24)";
      c.beginPath();
      c.moveTo(px + 2, py + 10); c.lineTo(px + 7, py + 5); c.lineTo(px + 14, py + 7);
      c.stroke();
      c.fillStyle = "rgba(97,244,192,0.7)";
      c.fillRect(px + 6, py + 4, 2, 2);
      c.fillRect(px + 13, py + 6, 1, 1);
    } else if (t === K.WALL) {
      c.fillStyle = "#241f38";
      c.fillRect(px, py, TILE, TILE);
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
    // copa em camadas, mais cheia conforme o hash
    const sway = Math.sin(time * 0.0012 + x * 1.7 + y) * 0.6;
    const wide = h > 0.55 ? 18 : 16;
    const cx = px + 8 + sway;
    const top = py + (h > 0.55 ? 0 : 2);
    ctx.fillStyle = "#0c2417";
    ctx.fillRect(cx - wide / 2, top + 3, wide, 10);
    ctx.fillRect(cx - wide / 2 + 2, top + 1, wide - 4, 14);
    ctx.fillStyle = "#143723";
    ctx.fillRect(cx - wide / 2 + 1, top + 4, wide - 2, 8);
    ctx.fillRect(cx - wide / 2 + 3, top + 2, wide - 6, 12);
    ctx.fillStyle = "#1c4a2e";
    ctx.fillRect(cx - wide / 2 + 3, top + 5, wide - 6, 5);
    ctx.fillRect(cx - wide / 2 + 5, top + 3, wide - 10, 9);
    ctx.fillStyle = "#245c39";
    ctx.fillRect(cx - 4, top + 4, 8, 3);
    ctx.fillRect(cx - 2, top + 3, 4, 5);
    ctx.fillStyle = "rgba(180, 255, 214, 0.22)";
    ctx.fillRect(cx - 4, top + 2, 3, 2);
    ctx.fillStyle = "rgba(2, 6, 10, 0.25)";
    ctx.fillRect(cx + 3, top + 13, wide / 2 - 1, 2);
    if (h > 0.72) {
      ctx.fillStyle = "rgba(255, 200, 87, 0.7)";
      ctx.fillRect(cx - 3, top + 8, 1, 1);
      ctx.fillRect(cx + 3, top + 6, 1, 1);
      ctx.fillRect(cx + 1, top + 10, 1, 1);
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
      const glow = 0.78 + Math.sin(time * 0.003 + d.x) * 0.16;
      ctx.globalAlpha = glow;
      ctx.drawImage(lampGlow(), px - 18, py - 28);
      ctx.globalAlpha = 1;
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
    } else if (d.type === "antenna") {
      const a = d.accent || "#6bd5ff";
      ctx.strokeStyle = "#2a3048"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(px, py + 10); ctx.lineTo(px, py - 18); ctx.stroke();
      ctx.strokeStyle = hexA(a, 0.55); ctx.lineWidth = 1;
      for (let r = 5; r <= 13; r += 4) { ctx.beginPath(); ctx.arc(px, py - 18, r, -2.4, -0.7); ctx.stroke(); }
      ctx.fillStyle = a; ctx.fillRect(px - 1, py - 20, 2, 2);
    } else if (d.type === "rack") {
      const a = d.accent || "#61f4c0";
      ctx.fillStyle = "#141c2b"; ctx.fillRect(px - 7, py - 20, 14, 30);
      ctx.fillStyle = "#24324a"; ctx.fillRect(px - 5, py - 18, 10, 26);
      for (let i = 0; i < 4; i++) {
        ctx.fillStyle = Math.sin(time * 0.003 + i + d.x) > 0 ? a : "#1c2a3a";
        ctx.fillRect(px - 4, py - 15 + i * 5, 2, 2);
        ctx.fillStyle = "#0d1420"; ctx.fillRect(px, py - 15 + i * 5, 3, 2);
      }
    } else if (d.type === "lock") {
      const a = d.accent || "#ffc857";
      ctx.strokeStyle = "#3a4466"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(px, py - 10, 5, Math.PI, 0); ctx.stroke();
      ctx.fillStyle = "#24304a"; ctx.fillRect(px - 7, py - 10, 14, 13);
      ctx.fillStyle = hexA(a, 0.85); ctx.fillRect(px - 1, py - 5, 2, 4);
      ctx.fillRect(px - 2, py - 1, 4, 2);
    } else if (d.type === "compass") {
      const a = d.accent || "#b48cff";
      ctx.strokeStyle = "#4a4466"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.arc(px, py, 8, 0, Math.PI * 2); ctx.stroke();
      ctx.strokeStyle = hexA(a, 0.9);
      ctx.beginPath(); ctx.moveTo(px - 5, py + 4); ctx.lineTo(px + 4, py - 5); ctx.stroke();
      ctx.fillStyle = a; ctx.fillRect(px - 1, py - 1, 2, 2);
    } else if (d.type === "die") {
      const a = d.accent || "#b48cff";
      ctx.fillStyle = "#2a2438"; ctx.fillRect(px - 6, py - 6, 12, 12);
      ctx.fillStyle = a;
      for (const [dx, dy] of [[-3,-3],[3,-3],[0,0],[-3,3],[3,3]]) ctx.fillRect(px + dx, py + dy, 2, 2);
    } else if (d.type === "coil") {
      const a = d.accent || "#ffb26b";
      ctx.strokeStyle = hexA(a, 0.7); ctx.lineWidth = 1;
      for (let i = 0; i < 4; i++) { ctx.beginPath(); ctx.arc(px, py - i * 3, 6, 0, Math.PI * 2); ctx.stroke(); }
      ctx.fillStyle = "#2a3048"; ctx.fillRect(px - 7, py + 9, 14, 3);
    } else if (d.type === "gauge") {
      const a = d.accent || "#ff7aa8";
      ctx.strokeStyle = "#3a3a55"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(px, py, 7, Math.PI, 0); ctx.stroke();
      const ang = -Math.PI + (0.5 + Math.sin(time * 0.002 + d.x) * 0.35) * Math.PI;
      ctx.strokeStyle = a; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(px + Math.cos(ang) * 6, py + Math.sin(ang) * 6); ctx.stroke();
    } else if (d.type === "lens") {
      const a = d.accent || "#ff7aa8";
      ctx.fillStyle = "#1a2434"; ctx.fillRect(px - 1, py - 2, 2, 10);
      ctx.fillStyle = hexA(a, 0.28); ctx.beginPath(); ctx.ellipse(px, py - 6, 5, 8, 0, 0, Math.PI * 2); ctx.fill();
      ctx.strokeStyle = hexA(a, 0.8); ctx.lineWidth = 1; ctx.beginPath(); ctx.ellipse(px, py - 6, 5, 8, 0, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = "rgba(255,255,255,0.35)"; ctx.fillRect(px - 2, py - 10, 1, 3);
    } else if (d.type === "molecule") {
      const a = d.accent || "#7ee787";
      ctx.strokeStyle = hexA(a, 0.5); ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px - 7, py + 5); ctx.lineTo(px, py - 5); ctx.lineTo(px + 7, py + 5); ctx.stroke();
      ctx.fillStyle = hexA(a, 0.85);
      for (const [dx, dy] of [[-7,5],[0,-5],[7,5]]) { ctx.beginPath(); ctx.arc(px + dx, py + dy, 2.4, 0, Math.PI * 2); ctx.fill(); }
    } else if (d.type === "quill") {
      const a = d.accent || "#e8c07a";
      ctx.strokeStyle = a; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px - 5, py + 9); ctx.quadraticCurveTo(px + 2, py - 8, px + 7, py - 12); ctx.stroke();
      ctx.fillStyle = hexA(a, 0.5); ctx.fillRect(px + 4, py - 13, 4, 2); ctx.fillRect(px + 2, py - 10, 4, 2);
    } else if (d.type === "mask") {
      const a = d.accent || "#e8c07a";
      ctx.fillStyle = "#2a2438"; ctx.fillRect(px - 7, py - 10, 14, 12);
      ctx.fillStyle = hexA(a, 0.8);
      ctx.fillRect(px - 5, py - 7, 3, 2); ctx.fillRect(px + 2, py - 7, 3, 2);
      ctx.beginPath(); ctx.arc(px, py + 1, 4, 0, Math.PI); ctx.fill();
    } else if (d.type === "metronome") {
      const a = d.accent || "#ffb26b";
      ctx.fillStyle = "#2a2438";
      ctx.beginPath(); ctx.moveTo(px, py - 18); ctx.lineTo(px + 7, py + 10); ctx.lineTo(px - 7, py + 10); ctx.closePath(); ctx.fill();
      const swing = Math.sin(time * 0.004 + d.x) * 6;
      ctx.strokeStyle = a; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px, py + 7); ctx.lineTo(px + swing, py - 14); ctx.stroke();
      ctx.fillStyle = a; ctx.fillRect(px + swing - 1, py - 15, 2, 2);
    }
  }

  const glowCache = new Map();
  function glowSprite(accent) {
    let sprite = glowCache.get(accent);
    if (sprite) return sprite;
    sprite = document.createElement("canvas");
    sprite.width = 72;
    sprite.height = 72;
    const g = sprite.getContext("2d");
    const grad = g.createRadialGradient(36, 36, 2, 36, 36, 34);
    grad.addColorStop(0, hexA(accent, 0.22));
    grad.addColorStop(1, hexA(accent, 0));
    g.fillStyle = grad;
    g.fillRect(0, 0, 72, 72);
    glowCache.set(accent, sprite);
    return sprite;
  }

  let lampSprite = null;
  function lampGlow() {
    if (lampSprite) return lampSprite;
    lampSprite = document.createElement("canvas");
    lampSprite.width = 36;
    lampSprite.height = 36;
    const g = lampSprite.getContext("2d");
    const grad = g.createRadialGradient(18, 18, 0, 18, 18, 18);
    grad.addColorStop(0, "rgba(255, 214, 128, 0.55)");
    grad.addColorStop(1, "rgba(255, 214, 128, 0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 36, 36);
    return lampSprite;
  }

  function drawStation(s, time) {
    const px = s.x * TILE, py = s.y * TILE;
    const pulse = 0.5 + Math.sin(time * 0.0024 + s.x) * 0.5;
    // subárea tem pedestal menor: a ilha tem várias e o ícone grande encostava
    // no da estação vizinha
    const k = s.minor ? 0.72 : 1;
    const halo = Math.round(36 * k);
    ctx.globalAlpha = (s.minor ? 0.34 : 0.62) + pulse * 0.3;
    ctx.drawImage(glowSprite(s.accent), px - halo, py - halo, halo * 2, halo * 2);
    ctx.globalAlpha = 1;

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
    ctx.beginPath(); ctx.ellipse(px, py + 9 * k, 14 * k, 4.5 * k, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "#141a2e";
    ctx.fillRect(px - 13 * k, py - 3 * k, 26 * k, 10 * k);
    ctx.fillStyle = "#232c48";
    ctx.fillRect(px - 12 * k, py - 4 * k, 24 * k, 3 * k);
    ctx.fillStyle = hexA(s.accent, 0.35);
    ctx.fillRect(px - 10 * k, py - 4 * k, 20 * k, 1);
    ctx.fillStyle = "#0d1220";
    for (const [dx, dy] of [[-11, 3], [9, 3], [-11, -1], [9, -1]]) {
      ctx.fillRect(px + dx * k, py + dy * k, 2, 2);
    }
    const beam = ctx.createLinearGradient(px, py - 4, px, py - 28);
    beam.addColorStop(0, hexA(s.accent, 0.16));
    beam.addColorStop(1, hexA(s.accent, 0));
    ctx.fillStyle = beam;
    ctx.fillRect(px - 8 * k, py - 30 * k, 16 * k, 28 * k);
    drawStationIcon(s.icon, px, py - 24 * k, time, s.accent, k);
  }

  function drawStationIcon(icon, px, py, time, accent, escala = 1) {
    const bob = Math.sin(time * 0.002 + px * 0.01) * 1.4;
    ctx.save();
    ctx.translate(px, py + bob);
    if (escala !== 1) ctx.scale(escala, escala);
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
    } else if (icon === "chain") {
      ctx.strokeStyle = hexA(accent, 0.9);
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(-5, 5); ctx.lineTo(5, -5);
      ctx.stroke();
      ctx.fillStyle = "#d9d0e8";
      for (const [x, y] of [[-6, 6], [6, -6]]) {
        ctx.beginPath();
        ctx.arc(x, y, 4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = hexA(accent, 0.9);
        ctx.beginPath();
        ctx.arc(x, y, 1.6, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#d9d0e8";
      }
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
    } else if (icon === "terminal") {
      ctx.strokeRect(-9, -7, 18, 13);
      ctx.fillRect(-6, -4, 5, 1);
      ctx.fillRect(-6, -1, 8, 1);
      ctx.fillRect(-6, 2, 4, 1);
      ctx.fillRect(-9, 6, 18, 2);
    } else if (icon === "sign") {
      ctx.fillRect(-1, -2, 2, 9);
      ctx.fillRect(-8, -9, 16, 8);
      ctx.fillStyle = "#0b1024";
      ctx.fillRect(-5, -6, 10, 1);
      ctx.fillRect(-5, -4, 6, 1);
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

  function drawHunterRing(h, time) {
    const px = h.center.x * TILE;
    const py = h.center.y * TILE;
    const pulse = 0.5 + Math.sin(time * 0.002 + h.center.x) * 0.5;
    ctx.save();
    ctx.fillStyle = hexA(h.accent, 0.075);
    ctx.beginPath();
    ctx.ellipse(px, py, TILE * 3.1, TILE * 2.8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.setLineDash([5, 6]);
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = hexA(h.accent, 0.3 + pulse * 0.18);
    ctx.beginPath();
    ctx.ellipse(px, py, TILE * 3.6, TILE * 3.2, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.setLineDash([]);
    for (let i = 0; i < 8; i++) {
      const a = (i / 8) * Math.PI * 2;
      ctx.fillStyle = hexA(h.accent, 0.35 + pulse * 0.2);
      ctx.fillRect(px + Math.cos(a) * TILE * 3.6 - 1, py + Math.sin(a) * TILE * 3.2 - 1, 2, 2);
    }
    ctx.restore();
  }

  function drawBanner(h, time) {
    const px = h.banner.x * TILE;
    const py = h.banner.y * TILE;
    ctx.fillStyle = "#141827";
    ctx.fillRect(px - 2, py - 28, 3, 28);
    ctx.fillStyle = hexA(h.accent, 0.9);
    ctx.fillRect(px + 1, py - 27, 12, 8);
    ctx.fillStyle = "rgba(8,10,20,0.85)";
    ctx.fillRect(px + 3, py - 25, 2, 2);
    ctx.fillRect(px + 8, py - 25, 2, 2);
    const glow = 0.5 + Math.sin(time * 0.004) * 0.5;
    ctx.fillStyle = hexA(h.accent, 0.25 + glow * 0.2);
    ctx.fillRect(px - 4, py - 31, 7, 2);
  }

  function drawCave(c, time) {
    const px = c.x * TILE;
    const py = c.y * TILE;
    ctx.fillStyle = "rgba(2,4,10,0.4)";
    ctx.beginPath();
    ctx.ellipse(px, py + 2, 20, 6, 0, 0, Math.PI * 2);
    ctx.fill();
    // o morro de pedra, claro o bastante para se ver de longe
    ctx.fillStyle = "#3b3d55";
    ctx.fillRect(px - 20, py - 16, 40, 16);
    ctx.fillRect(px - 16, py - 24, 32, 10);
    ctx.fillRect(px - 9, py - 31, 18, 8);
    ctx.fillStyle = "#50536f";
    ctx.fillRect(px - 20, py - 16, 40, 3);
    ctx.fillRect(px - 16, py - 24, 32, 2);
    ctx.fillRect(px - 9, py - 31, 18, 2);
    // a boca
    ctx.fillStyle = "#05060c";
    ctx.fillRect(px - 8, py - 18, 16, 18);
    ctx.fillRect(px - 6, py - 21, 12, 4);
    const glow = 0.45 + Math.sin(time * 0.003) * 0.18;
    ctx.fillStyle = hexA(c.accent, glow);
    ctx.fillRect(px - 5, py - 17, 10, 2);
    // pedras soltas e a placa do lugar
    ctx.fillStyle = "#35364c";
    ctx.fillRect(px - 22, py - 3, 4, 3);
    ctx.fillRect(px + 18, py - 4, 3, 4);
    ctx.fillStyle = "#141827";
    ctx.fillRect(px + 14, py - 28, 2, 14);
    ctx.fillStyle = hexA(c.accent, 0.9);
    ctx.fillRect(px + 16, py - 27, 7, 5);
  }

  function drawPathLine(points) {
    ctx.save();
    ctx.fillStyle = "rgba(255, 200, 87, 0.32)";
    for (let i = 1; i < points.length; i += 2) {
      const p = points[i];
      if (p.x * TILE < camX || p.x * TILE > camX + vw / zoom) continue;
      if (p.y * TILE < camY || p.y * TILE > camY + vh / zoom) continue;
      ctx.fillRect(p.x * TILE - 1, p.y * TILE - 1, 2, 2);
    }
    ctx.restore();
  }

  function drawPathGoal(goal, time) {
    const px = goal.x * TILE;
    const py = goal.y * TILE;
    const pulse = 0.5 + Math.sin(time * 0.008) * 0.5;
    ctx.save();
    ctx.strokeStyle = `rgba(255, 200, 87, ${0.35 + pulse * 0.35})`;
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(px, py, 9 + pulse * 3, 5 + pulse * 2, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = `rgba(255, 200, 87, ${0.4 + pulse * 0.3})`;
    ctx.fillRect(px - 1, py - 9, 2, 5);
    ctx.restore();
  }

  // item largado no chão: ícone desenhado, brilho e um balanço leve
  function drawGroundItem(g, time) {
    const item = ITEMS[g.itemId];
    if (!item) return;
    const px = g.x * TILE, py = g.y * TILE;
    const bob = Math.sin(time * 0.002 + g.x * 1.3) * 1.6;
    const pulse = 0.45 + Math.sin(time * 0.003 + g.y) * 0.25;
    ctx.fillStyle = "rgba(2,6,10,0.4)";
    ctx.beginPath();
    ctx.ellipse(px, py + 6, 7, 3, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = pulse * 0.3;
    ctx.fillStyle = g.accent || "#ffc857";
    ctx.beginPath();
    ctx.arc(px, py - 8 + bob, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
    ctx.drawImage(itemIconCanvas(item), px - 9, py - 21 + bob, 18, 18);
    if (Math.sin(time * 0.005 + g.x) > 0.8) {
      ctx.fillStyle = "rgba(255,243,209,0.9)";
      ctx.fillRect(px + 5, py - 18 + bob, 1, 1);
      ctx.fillRect(px + 6, py - 17 + bob, 1, 1);
    }
  }

  function drawNpc(npc, time) {
    const px = npc.x * TILE, py = npc.y * TILE;
    const bob = Math.sin(time * 0.002 + npc.bob) * 1.2;
    const colors = npc.colors || { skin: "#d9b08c", hair: "#4a3a55", shirt: npc.accent, pants: "#2f2c45" };
    drawHuman(ctx, px, py + bob, npc.facing || 0, !!npc.moving, time, colors, 0.9, npc.look || null);
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

  function drawNpcLabels(npcs, scale, camX, camY) {
    // rótulos em espaço de tela: o texto é rasterizado no tamanho final, sem
    // passar pelo zoom do mundo (era isso que deixava o nome embaçado).
    ctx.save();
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.imageSmoothingEnabled = false;
    const fs = Math.max(8, Math.round(4 * scale));
    ctx.font = `${fs}px "Press Start 2P", ui-monospace, monospace`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    for (const npc of npcs) {
      const sx = (npc.x * TILE - camX) * scale;
      const sy = (npc.y * TILE - 26 - camY) * scale;
      if (sx < -100 || sx > canvas.width + 100 || sy < -20 || sy > canvas.height + 20) continue;
      const text = NPCS[npc.id]?.name || npc.id;
      const w = ctx.measureText(text).width + 4 * scale;
      const h = fs + 4;
      ctx.fillStyle = "rgba(8,10,20,0.78)";
      roundRect(ctx, sx - w / 2, sy, w, h, 2 * scale);
      ctx.fill();
      ctx.fillStyle = "#e6e1f5";
      ctx.fillText(text, sx, sy + h / 2 + 0.5);
    }
    ctx.restore();
  }

  function drawCat(cat, moving, time) {
    drawPetSprite(ctx, cat.kind || "cat", cat.x * TILE, cat.y * TILE, time, moving);
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

  // O chão é estático: pinta uma vez em blocos de 16x16 tiles e só copia o
  // bloco visível por frame. Água e magma ganham o brilho por cima, animado.
  const CHUNK = 16;
  const chunkCache = new Map();
  const stats = { tiles: 0, chunks: 0, terrainMs: 0, drawMs: 0, fps: 60, quality: 1 };

  function groundChunk(cx, cy) {
    const key = `${cx}:${cy}`;
    const hit = chunkCache.get(key);
    if (hit) {
      // LRU: o chunk visto agora volta para o fim da fila; o mais antigo sai
      // quando o cache enche, em vez de limpar tudo e travar o próximo quadro.
      chunkCache.delete(key);
      chunkCache.set(key, hit);
    }
    if (hit) return hit;
    const canvasChunk = document.createElement("canvas");
    canvasChunk.width = CHUNK * TILE;
    canvasChunk.height = CHUNK * TILE;
    const g = canvasChunk.getContext("2d");
    g.imageSmoothingEnabled = false;
    const bx = cx * CHUNK;
    const by = cy * CHUNK;
    // o desenho usa coordenadas do mundo; desloca para o canto do bloco
    g.setTransform(1, 0, 0, 1, -bx * TILE, -by * TILE);
    for (let y = 0; y < CHUNK; y++) {
      for (let x = 0; x < CHUNK; x++) {
        const tx = bx + x;
        const ty = by + y;
        if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) continue;
        drawGroundOn(g, tx, ty, world.get(tx, ty), 0, false);
      }
    }
    // ponytail: cache sem LRU; o mapa é estático e 120 blocos já cobrem
    // muitos minutos de caminhada. Se o mapa crescer, trocar por LRU.
    while (chunkCache.size >= 120) {
      const oldest = chunkCache.keys().next().value;
      if (oldest === undefined) break;
      chunkCache.delete(oldest);
    }
    chunkCache.set(key, canvasChunk);
    return canvasChunk;
  }

  function drawWaterMagma(x, y, t, time) {
    drawGroundOn(ctx, x, y, t, time, true);
  }

  function draw(now, player, peers, npcs, cat, moving) {
    const frameStart = performance.now();
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

    const tTerrain = performance.now();
    const chunkPx = CHUNK * TILE;
    const cx0 = Math.floor(x0 / CHUNK);
    const cy0 = Math.floor(y0 / CHUNK);
    const cx1 = Math.floor(x1 / CHUNK);
    const cy1 = Math.floor(y1 / CHUNK);
    let chunks = 0;
    for (let cy = cy0; cy <= cy1; cy++) {
      for (let cx = cx0; cx <= cx1; cx++) {
        ctx.drawImage(groundChunk(cx, cy), cx * chunkPx, cy * chunkPx);
        chunks++;
      }
    }
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const tile = world.get(x, y);
        if (tile === K.WATER || tile === K.MAGMA) drawWaterMagma(x, y, tile, time);
      }
    }
    stats.terrainMs = stats.terrainMs ? stats.terrainMs * 0.9 + (performance.now() - tTerrain) * 0.1 : performance.now() - tTerrain;
    stats.tiles = (x1 - x0 + 1) * (y1 - y0 + 1);
    stats.chunks = chunks;

    for (const h of world.hunters) drawHunterRing(h, time);
    if (player.pathLine && player.pathLine.length) drawPathLine(player.pathLine);
    if (player.pathGoal) drawPathGoal(player.pathGoal, time);

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
    for (let y = y0; y <= y1; y++) {
      for (let x = x0; x <= x1; x++) {
        const t = world.get(x, y);
        if (t === K.TREE) drawables.push({ y: (y + 1) * TILE, fn: () => drawTree(x, y, time) });
        else if (t === K.WALL) drawables.push({ y: (y + 1) * TILE, fn: () => drawWall(x, y) });
      }
    }
    for (const d of world.decor) {
      if (d.x * TILE < camX - 40 || d.x * TILE > camX + viewW + 40 ||
          d.y * TILE < camY - 40 || d.y * TILE > camY + viewH + 40) continue;
      drawables.push({ y: d.y * TILE + 14, fn: () => drawDecor(d, time) });
    }
    const onScreen = (wx, wy, pad = 48) => {
      const px = wx * TILE;
      const py = wy * TILE;
      return px > camX - pad && px < camX + viewW + pad && py > camY - pad && py < camY + viewH + pad;
    };
    for (const h of world.hunters) {
      if (!onScreen(h.banner.x, h.banner.y, 80)) continue;
      drawables.push({ y: h.banner.y * TILE + 8, fn: () => drawBanner(h, time) });
    }
    for (const w of world.waystones) {
      if (!onScreen(w.x, w.y)) continue;
      drawables.push({ y: w.y * TILE + 8, fn: () => drawWaystone(w, time) });
    }
    for (const c of world.caves || []) {
      if (!onScreen(c.x, c.y, 64)) continue;
      drawables.push({ y: c.y * TILE + 8, fn: () => drawCave(c, time) });
    }
    for (const g of world.groundItems || []) {
      if (!onScreen(g.x, g.y, 32)) continue;
      drawables.push({ y: g.y * TILE + 7, fn: () => drawGroundItem(g, time) });
    }
    for (const s of world.stations) {
      if (!onScreen(s.x, s.y, 80)) continue;
      drawables.push({ y: s.y * TILE + 6, fn: () => drawStation(s, time) });
    }
    for (const n of npcs) {
      if (!onScreen(n.x, n.y, 60)) continue;
      drawables.push({ y: n.y * TILE, fn: () => drawNpc(n, time) });
    }
    if (cat && onScreen(cat.x, cat.y, 48)) {
      drawables.push({ y: cat.y * TILE, fn: () => drawCat(cat, cat.moving, time) });
    }
    for (const p of peers) {
      const px = (p.rx ?? p.x) * TILE;
      const py = (p.ry ?? p.y) * TILE;
      const peerColors = p.look
        ? avatarColors(p.look)
        : p.outfit
          ? outfitById(p.outfit).colors
          : { skin: "#e8b98c", hair: "#2a2438", shirt: p.color, pants: "#2f2c45", accent: "#fff3d1" };
      drawables.push({
        y: py,
        fn: () => {
          const lift = p.mount ? 5 : 0;
          if (p.mount) drawSkiff(ctx, px, py, p.dir || 0, time, 1, p.moving);
          drawHuman(ctx, px, py - lift, p.dir || 0, p.mount ? false : p.moving, time, peerColors, 1, p.look);
          drawNameTag(p.name, px, py - 26 - lift, p.color);
          if (p.bubble && p.bubble.until > now) {
            drawBubble(p.bubble.text, px, py - lift, p.color);
          }
        },
      });
    }
    drawables.push({
      y: player.y * TILE,
      fn: () => {
        const lift = 5 * player.boost;
        const bob = Math.sin(time * 0.007) * 1.1 * player.boost;
        const onShip = player.boost > 0.35;
        if (player.boost > 0.01) drawSkiff(ctx, player.x * TILE, player.y * TILE, player.dir, time, player.boost, moving);
        drawHuman(ctx, player.x * TILE, player.y * TILE - lift + bob, player.dir, onShip ? false : moving, time,
          player.colors || PLAYER_COLORS[0], 1, player.look, player.gear || null);
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

    drawNpcLabels(npcs, scale, camX, camY);
    drawMinimap(player, peers);
    const frameEnd = performance.now();
    if (stats._prev) {
      const dt = frameEnd - stats._prev;
      if (dt > 0 && dt < 250) stats.fps = stats.fps * 0.92 + (1000 / dt) * 0.08;
    }
    stats._prev = frameEnd;
    stats.drawMs = stats.drawMs ? stats.drawMs * 0.9 + (frameEnd - frameStart) * 0.1 : frameEnd - frameStart;
    stats.quality = quality;
    // ponytail: resolução adaptativa simples (passos de 15%); troca por
    // render em camadas quando houver mais efeitos por cima do chão.
    if (stats.fps < 38 && quality > 0.6) {
      quality = Math.max(0.6, quality - 0.15);
      resize();
    } else if (stats.fps > 56 && quality < 1) {
      quality = Math.min(1, quality + 0.1);
      resize();
    }
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

  // ---- minimapa com zoom, centro no personagem e coordenada ----
  // O mapa tem 2 px por tile; o nível 0 é o mapa inteiro e os outros são uma
  // janela em volta do jogador, como no Tibia, para o marcador não sumir.
  const MINI_SCALES = [0, 2, 3, 4, 6];
  let miniIndex = 2;
  let miniPlayer = null;

  function miniView() {
    const tilePx = MINI_SCALES[miniIndex];
    const DW = minimap?.width || mmBase.width;
    const DH = minimap?.height || mmBase.height;
    const p = miniPlayer || { x: MAP_W / 2, y: MAP_H / 2 };
    const srcW = tilePx ? Math.min(mmBase.width, (DW * 2) / tilePx) : mmBase.width;
    const srcH = tilePx ? Math.min(mmBase.height, (DH * 2) / tilePx) : mmBase.height;
    const sx = Math.max(0, Math.min(mmBase.width - srcW, p.x * 2 - srcW / 2));
    const sy = Math.max(0, Math.min(mmBase.height - srcH, p.y * 2 - srcH / 2));
    return { sx, sy, srcW, srcH, DW, DH };
  }

  function miniPoint(view, wx, wy) {
    return {
      x: ((wx * 2 - view.sx) / view.srcW) * view.DW,
      y: ((wy * 2 - view.sy) / view.srcH) * view.DH,
    };
  }

  const miniLabel = () => (MINI_SCALES[miniIndex] ? `${MINI_SCALES[miniIndex]}×` : "1×");

  function drawMiniMarker(px, py, dir) {
    const t = performance.now();
    const pulse = 11 + Math.sin(t * 0.004) * 3;
    mctx.beginPath();
    mctx.arc(px, py, pulse, 0, Math.PI * 2);
    mctx.strokeStyle = "rgba(255,255,255,0.34)";
    mctx.lineWidth = 2;
    mctx.stroke();
    mctx.save();
    mctx.translate(px, py);
    // a seta aponta para onde o boneco olha; a base do triângulo é o norte
    mctx.rotate([Math.PI, Math.PI * 1.5, Math.PI * 0.5, 0][dir] || 0);
    mctx.beginPath();
    mctx.moveTo(0, -11);
    mctx.lineTo(-7, 8);
    mctx.lineTo(0, 4);
    mctx.lineTo(7, 8);
    mctx.closePath();
    mctx.fillStyle = "#ffffff";
    mctx.fill();
    mctx.lineWidth = 2;
    mctx.strokeStyle = "#070b18";
    mctx.stroke();
    mctx.restore();
  }

  function drawMinimap(player, peers) {
    if (!mctx) return;
    miniPlayer = player;
    if (fogVersion !== world.exploredVersion && performance.now() - lastFogBuild > 120) {
      fogVersion = world.exploredVersion;
      lastFogBuild = performance.now();
      const img = fogCtx.createImageData(mmFog.width, mmFog.height);
      const data = img.data;
      for (let y = 0; y < MAP_H; y++) {
        for (let x = 0; x < MAP_W; x++) {
          if (world.isExplored(x, y)) continue;
          // terra não explorada fica como silhueta, água fica quase preta: o
          // mapa mostra que o arquipélago existe sem entregar o detalhe
          const terra = world.get(x, y) !== 3;
          const r = terra ? 9 : 4;
          const g = terra ? 15 : 6;
          const b = terra ? 30 : 13;
          const alpha = terra ? 150 : 215;
          for (let dy = 0; dy < 2; dy++) {
            let i = ((y * 2 + dy) * mmFog.width + x * 2) * 4;
            data[i] = r; data[i + 1] = g; data[i + 2] = b; data[i + 3] = alpha;
            i += 4;
            data[i] = r; data[i + 1] = g; data[i + 2] = b; data[i + 3] = alpha;
          }
        }
      }
      fogCtx.putImageData(img, 0, 0);
    }
    const view = miniView();
    mctx.imageSmoothingEnabled = false;
    mctx.drawImage(mmBase, view.sx, view.sy, view.srcW, view.srcH, 0, 0, view.DW, view.DH);
    mctx.drawImage(mmFog, view.sx, view.sy, view.srcW, view.srcH, 0, 0, view.DW, view.DH);
    for (const p of peers) {
      const pt = miniPoint(view, p.rx ?? p.x, p.ry ?? p.y);
      mctx.fillStyle = p.color || "#61f4c0";
      mctx.fillRect(Math.round(pt.x) - 2, Math.round(pt.y) - 2, 4, 4);
    }
    for (const h of world.hunters) {
      if (!world.isExplored(Math.floor(h.center.x), Math.floor(h.center.y))) continue;
      const pt = miniPoint(view, h.center.x, h.center.y);
      mctx.fillStyle = "#0a0c18";
      mctx.fillRect(Math.round(pt.x) - 3, Math.round(pt.y) - 3, 6, 6);
      mctx.fillStyle = h.accent;
      mctx.fillRect(Math.round(pt.x) - 2, Math.round(pt.y) - 2, 4, 4);
    }
    for (const c of world.caves || []) {
      if (!world.isExplored(Math.floor(c.x), Math.floor(c.y))) continue;
      const pt = miniPoint(view, c.x, c.y);
      mctx.fillStyle = "#05070e";
      mctx.fillRect(Math.round(pt.x) - 3, Math.round(pt.y) - 3, 6, 6);
      mctx.strokeStyle = c.accent;
      mctx.lineWidth = 1.5;
      mctx.strokeRect(Math.round(pt.x) - 3, Math.round(pt.y) - 3, 6, 6);
    }
    const hero = miniPoint(view, player.x, player.y);
    drawMiniMarker(hero.x, hero.y, player.dir);
  }

  function kick(n = 1) { shake = n; }

  resize();
  window.addEventListener("resize", resize);
  return {
    draw, resize, kick, stats,
    get zoom() { return zoom; },
    get camX() { return camX; },
    get camY() { return camY; },
    worldToScreen(wx, wy) {
      return { x: (wx * TILE - camX) * zoom, y: (wy * TILE - camY) * zoom };
    },
    // ---- minimapa: zoom e leitura de coordenada do clique ----
    get miniScale() { return MINI_SCALES[miniIndex]; },
    get miniLabel() { return miniLabel(); },
    miniZoom(delta) {
      const antes = miniIndex;
      miniIndex = Math.max(0, Math.min(MINI_SCALES.length - 1, miniIndex + delta));
      return { mudou: miniIndex !== antes, label: miniLabel() };
    },
    miniFit() {
      miniIndex = 0;
      return miniLabel();
    },
    miniWorldAt(fx, fy) {
      const view = miniView();
      return {
        x: (view.sx + Math.max(0, Math.min(1, fx)) * view.srcW) / 2,
        y: (view.sy + Math.max(0, Math.min(1, fy)) * view.srcH) / 2,
      };
    },
  };
}

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
import { drawSkiff, skiffRear } from "./skiff.js";
import { drawNpcKit } from "./npc-art.js";
import { drawCaveFacade } from "./cave-art.js";
import { gustAt, ondaAt, espumaAt, swayAt, windMood } from "./wind.js";
import { criarAmbiente, ambienteDe } from "./ambient.js";

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
  // o vento do lugar onde o jogador está: troca de bioma, troca a força do ar
  let moodAtual = windMood(null);
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
  // ---- modo leve -----------------------------------------------------------
  // Aparelho que já está no piso de qualidade e continua engasgando entra em
  // modo leve: some a partícula de ambiente, some o CRT e o teto de pixels cai.
  let modoLeve = false;
  function setModoLeve(on) {
    if (modoLeve === on) return modoLeve;
    modoLeve = on;
    pixelsTeto = on ? 1300000 : 2200000;
    document.body?.classList.toggle("leve", on);
    resize();
    return modoLeve;
  }

  let lastFogBuild = 0;
  buildMinimapBase();

  let quality = 1;

  // Teto de pixels do canvas. Antes o tamanho subia com o devicePixelRatio sem
  // limite: tablet denso desenhava 2,5 MP e celular 1,3 MP, mais que o
  // computador, e o quadro caía. Acima do teto, sobe por CSS.
  let pixelsTeto = 2200000;
  function resize() {
    dpr = Math.min(2, window.devicePixelRatio || 1) * quality;
    vw = window.innerWidth;
    vh = window.innerHeight;
    const bruto = vw * vh * dpr * dpr;
    if (bruto > pixelsTeto) dpr *= Math.sqrt(pixelsTeto / bruto);
    canvas.width = Math.max(320, Math.round(vw * dpr));
    canvas.height = Math.max(240, Math.round(vh * dpr));
    // O tile de 16 px fica entre 21 e 26 px na tela. Antes ia até 32 px e cada
    // bloco pesava: com o tile menor o vale respira e parece menos quadrado.
    const z = Math.min(vw / 600, vh / 380);
    zoom = Math.max(1.3, Math.min(1.6, Math.round(z * 4) / 4));
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

  // Grão fino por cima de cada tile do chão. Um pixel claro e um escuro já
  // quebram a cor chapada; como o chunk é cacheado, isso não custa por frame.
  function groundGrain(c, x, y, t) {
    if (t === K.TREE || t === K.WALL || t === K.WATER || t === K.MAGMA) return;
    const px = x * TILE, py = y * TILE;
    for (let i = 0; i < 4; i++) {
      const gx = px + 1 + Math.floor(hash2(x * 13 + i * 5, y * 17 - i) * 14);
      const gy = py + 1 + Math.floor(hash2(x * 7 - i, y * 19 + i * 5) * 14);
      c.fillStyle = i % 2 ? "rgba(255,255,255,0.045)" : "rgba(0,0,0,0.09)";
      c.fillRect(gx, gy, i === 0 ? 2 : 1, 1);
    }
  }

  // Mancha larga, de 3 em 3 tiles. A variação por tile virava um xadrez
  // sutil; com a mancha grande o chão muda de tom como terreno, não como
  // mosaico.
  // Mancha larga, de 3 em 3 tiles, com interpolação: a variação por tile virava
  // xadrez, e a mancha dura virava bloco de 3 tiles. O gradiente deixa o chão
  // mudar de tom como terreno.
  function patchH(x, y) {
    const s = 3;
    const fx = x / s, fy = y / s;
    const x0 = Math.floor(fx), y0 = Math.floor(fy);
    const tx = fx - x0, ty = fy - y0;
    const a = hash2(x0, y0), b = hash2(x0 + 1, y0);
    const c = hash2(x0, y0 + 1), d = hash2(x0 + 1, y0 + 1);
    const topo = a + (b - a) * tx;
    const base = c + (d - c) * tx;
    return topo + (base - topo) * ty;
  }


  // O padrão do bioma é uma marca discreta no chão: pontos, grade, onda, runa,
  // rachadura, estrela, duna ou tijolo. Muda por área e não custa por frame,
  // porque o chunk fica em cache.
  function drawBiotile(c, px, py, style, h) {
    c.save();
    c.fillStyle = style.accent;
    c.strokeStyle = style.accent;
    c.lineWidth = 1;
    c.globalAlpha = style.base ? 0.13 : 0.2;
    const jx = Math.floor(h * 6);
    const jy = Math.floor(hash2(px, py) * 6);
    if (style.pattern === "dots") {
      c.fillRect(px + 3 + jx, py + 4 + jy, 2, 2);
      c.fillRect(px + 11 - jx, py + 11 - jy, 1, 1);
    } else if (style.pattern === "grid") {
      // circuito pequeno e variado no miolo do tile. O mesmo "L" em todos os
      // tiles virava grade de 16 px quando as pontas se encontravam; quatro
      // motivos e posições diferentes quebram o ritmo.
      c.globalAlpha *= 0.8;
      const gx = px + 2 + Math.floor(h * 9);
      const gy = py + 2 + Math.floor(hash2(py, px) * 9);
      const motivo = Math.floor(h * 4);
      if (motivo === 0) {
        c.fillRect(gx, gy, 4, 1);
        c.fillRect(gx, gy, 1, 3);
      } else if (motivo === 1) {
        c.fillRect(gx, gy, 2, 1);
        c.fillRect(gx + 3, gy + 3, 1, 1);
        c.fillRect(gx + 1, gy + 2, 1, 1);
      } else if (motivo === 2) {
        c.fillRect(gx, gy, 1, 1);
        c.fillRect(gx + 1, gy + 1, 1, 1);
        c.fillRect(gx + 2, gy + 2, 1, 1);
      } else {
        c.fillRect(gx, gy, 5, 1);
        c.fillRect(gx + 4, gy + 1, 1, 1);
      }
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

  // Borda de bioma: onde o chão do vizinho é de outro tipo, alguns pixels dele
  // entram nesta tile. A divisa entre duas áreas deixa de ser uma linha reta de
  // tile e vira uma mistura serrilhada, como o dither da costa.
  const SEM_BORDA = new Set([K.WATER, K.TREE, K.WALL, K.PATH, K.BRIDGE, K.MAGMA, K.ACID]);
  function bordaDeBioma(c, x, y) {
    const t = world.get(x, y);
    if (SEM_BORDA.has(t)) return;
    const px = x * TILE;
    const py = y * TILE;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nt = world.get(x + dx, y + dy);
      if (nt === t || SEM_BORDA.has(nt)) continue;
      c.fillStyle = tileColor(nt);
      for (let i = 0; i < 4; i++) {
        if (hash2(x * 13 + i * 5, y * 7 + i) < 0.42) continue;
        const aoLongo = Math.floor(hash2(x + i * 3, y + i) * 13);
        const fundo = i % 3;
        const ex = dx > 0 ? 12 + fundo : dx < 0 ? fundo : aoLongo;
        const ey = dy > 0 ? 12 + fundo : dy < 0 ? fundo : aoLongo;
        c.fillRect(px + ex, py + ey, 2, 1);
      }
    }
  }

  function drawGroundOn(c, x, y, t, time, animated) {
    const px = x * TILE, py = y * TILE;
    const h = hash2(x, y);
    if (animated) {
      // O chunk já tem base, espuma, dither e grão. Por cima vai só a parte
      // viva: repintar o tile inteiro por quadro custava caro na costa.
      if (t === K.WATER) {
        const wet = (xx, yy) => {
          const n = world.get(xx, yy);
          return n !== K.WATER && n !== K.BRIDGE;
        };
        const shallow = wet(x, y - 1) || wet(x, y + 1) || wet(x - 1, y) || wet(x + 1, y);
        c.fillStyle = shallow ? "rgba(178, 238, 255, 0.3)" : "rgba(107, 213, 255, 0.2)";
        for (let i = 0; i < 3; i++) {
          const w = 4 + ((Math.sin(time * 0.0016 + x + y + i) + 1) * 2.5 | 0);
          c.fillRect(px + 1 + i * 5, py + 3 + i * 4, w, 1);
        }
      } else if (t === K.MAGMA) {
        const glow = 0.4 + Math.sin(time * 0.003 + x + y) * 0.18;
        c.fillStyle = `rgba(255, 122, 60, ${glow})`;
        c.fillRect(px + 3 + Math.floor(h * 6), py + 6, 3, 1);
        c.fillRect(px + 6 + Math.floor(hash2(y, x) * 5), py + 10, 2, 1);
      }
      return;
    }
    c.fillStyle = tileColor(t);
    c.fillRect(px, py, TILE, TILE);
    const biomo = TILE_STYLE[t];
    if (biomo) {
      // um véu de tom por tile: o piso do bioma não é uma cor chapada
      c.fillStyle = patchH(x, y) > 0.5 ? "rgba(255,255,255,0.024)" : "rgba(0,0,0,0.06)";
      c.fillRect(px, py, TILE, TILE);
      drawBiotile(c, px, py, biomo, h);
      // a costa ganha areia e espuma: a borda do bioma não termina no
      // degrau reto do tile
      const wn = world.get(x, y - 1) === K.WATER;
      const ws = world.get(x, y + 1) === K.WATER;
      const ww = world.get(x - 1, y) === K.WATER;
      const we = world.get(x + 1, y) === K.WATER;
      if (wn || ws || ww || we) {
        c.fillStyle = "rgba(226, 214, 178, 0.5)";
        if (wn) for (let i = 0; i < 7; i++) if (hash2(x * 7 + i, y) > 0.35) c.fillRect(px + 1 + i * 2, py, 2, 1);
        if (ws) for (let i = 0; i < 7; i++) if (hash2(x * 5 - i, y) > 0.35) c.fillRect(px + 1 + i * 2, py + TILE - 1, 2, 1);
        if (ww) for (let i = 0; i < 7; i++) if (hash2(x, y * 7 + i) > 0.35) c.fillRect(px, py + 1 + i * 2, 1, 2);
        if (we) for (let i = 0; i < 7; i++) if (hash2(x, y * 5 - i) > 0.35) c.fillRect(px + TILE - 1, py + 1 + i * 2, 1, 2);
        c.fillStyle = "rgba(6, 18, 12, 0.3)";
        if (wn) c.fillRect(px + 2, py + 1, 12, 1);
        if (ws) c.fillRect(px + 2, py + TILE - 2, 12, 1);
        if (ww) c.fillRect(px + 1, py + 2, 1, 12);
        if (we) c.fillRect(px + TILE - 2, py + 2, 1, 12);
      }
      return;
    }

    if (t === K.GRASS || t === K.FLOWER) {
      // duas manchas de tom por tile: o verde deixa de ser uma placa só
      c.fillStyle = patchH(x, y) > 0.5 ? "rgba(64, 124, 84, 0.13)" : "rgba(3, 14, 9, 0.16)";
      c.fillRect(px + Math.floor(h * 5), py + Math.floor(hash2(y, x) * 5), 11, 9);
      const n = 7 + Math.floor(h * 5);
      for (let i = 0; i < n; i++) {
        const bx = px + 1 + Math.floor(hash2(x * 7 + i * 3, y * 5 - i) * 14);
        const by = py + 2 + Math.floor(hash2(x * 3 - i, y * 9 + i * 4) * 12);
        const tall = hash2(x + i * 5, y + i) > 0.6 ? 3 : 2;
        c.fillStyle = i % 3 === 0 ? "#1d4a30" : i % 3 === 1 ? "#123020" : "#2a633c";
        c.fillRect(bx, by, 1, tall);
      }
      // só a borda de água, areia e caminho escurece: árvore e parede não
      // podem desenhar uma grade em volta de cada tile
      const molha = (nt) => nt === K.WATER || nt === K.SAND || nt === K.PATH;
      c.fillStyle = "rgba(6, 18, 12, 0.34)";
      if (molha(world.get(x, y - 1))) c.fillRect(px, py, TILE, 1);
      if (molha(world.get(x, y + 1))) c.fillRect(px, py + TILE - 1, TILE, 1);
      if (molha(world.get(x - 1, y))) c.fillRect(px, py, 1, TILE);
      if (molha(world.get(x + 1, y))) c.fillRect(px + TILE - 1, py, 1, TILE);
      // tufo alto e pedrinha rara: a campina ganha silhueta, não só pontinhos
      if (h > 0.86) {
        const gx = px + 3 + Math.floor(hash2(y, x) * 9);
        const gy = py + 8 + Math.floor(h * 3);
        c.fillStyle = "#2f7045";
        c.fillRect(gx, gy, 1, 3);
        c.fillRect(gx + 2, gy + 1, 1, 2);
        c.fillRect(gx + 4, gy, 1, 3);
        c.fillStyle = "#1d4a30";
        c.fillRect(gx + 1, gy + 2, 1, 2);
      } else if (h > 0.78) {
        c.fillStyle = "rgba(150, 160, 150, 0.32)";
        c.fillRect(px + 4 + Math.floor(h * 8), py + 10, 2, 1);
      }
      if (t === K.FLOWER) {
        const cols = ["#ffc857", "#ff7aa8", "#b48cff", "#6bd5ff"];
        const fx = px + 5 + Math.floor(h * 6);
        const fy = py + 6 + Math.floor(hash2(y, x) * 4);
        c.fillStyle = cols[Math.floor(h * cols.length)];
        c.fillRect(fx - 1, fy, 3, 1);
        c.fillRect(fx, fy - 1, 1, 3);
        c.fillStyle = "rgba(255,255,255,0.75)";
        c.fillRect(fx, fy, 1, 1);
      }
    } else if (t === K.PATH) {
      const area = world.areaAt(x + 0.5, y + 0.5);
      const pathColor = area && BIOMES[area.id] ? BIOMES[area.id].path : "#63513a";
      c.fillStyle = pathColor;
      c.fillRect(px, py, TILE, TILE);
      c.fillStyle = "rgba(255, 226, 168, 0.07)";
      c.fillRect(px + Math.floor(h * 4), py + Math.floor(hash2(y, x) * 4), 9, 6);
      c.fillStyle = "rgba(32, 24, 15, 0.4)";
      for (let i = 0; i < 4; i++) {
        const sx = px + 2 + Math.floor(hash2(x * 5 + i, y * 7 - i) * 12);
        const sy = py + 2 + Math.floor(hash2(x * 3 - i, y * 11 + i) * 12);
        c.fillRect(sx, sy, 2, 1);
      }
      c.fillStyle = "#7a6446";
      c.fillRect(px + Math.floor(h * 10), py + 12, 2, 1);
      c.fillStyle = "rgba(220, 200, 160, 0.35)";
      c.fillRect(px + 2 + Math.floor(hash2(y, x) * 8), py + 4 + Math.floor(h * 6), 1, 1);
      // a grama come a borda do caminho, então a linha não fica reta
      const fringe = (nt, lado) => {
        if (nt === K.PATH || nt === K.WATER) return;
        c.fillStyle = "rgba(22, 38, 24, 0.42)";
        for (let i = 0; i < 5; i++) {
          if (hash2(x * 17 + i * 3, y * 13 + i) < 0.35) continue;
          if (lado === 0) c.fillRect(px + 1 + i * 3, py, 2, 1);
          else if (lado === 1) c.fillRect(px + 1 + i * 3, py + TILE - 1, 2, 1);
          else if (lado === 2) c.fillRect(px, py + 1 + i * 3, 1, 2);
          else c.fillRect(px + TILE - 1, py + 1 + i * 3, 1, 2);
        }
      };
      fringe(world.get(x, y - 1), 0);
      fringe(world.get(x, y + 1), 1);
      fringe(world.get(x - 1, y), 2);
      fringe(world.get(x + 1, y), 3);
    } else if (t === K.STONE || t === K.PLAZA) {
      const tons = t === K.PLAZA
        ? ["#333a58", "#3a4163", "#2e344e"]
        : ["#2c324b", "#333a56", "#262b41"];
      c.fillStyle = tons[Math.floor(patchH(x, y) * tons.length)];
      c.fillRect(px, py, TILE, TILE);
      // lajotas pequenas em fileiras alternadas: o piso não é mais um
      // quadrado gigante com uma grade por cima
      const linha = t === K.PLAZA ? 5 : 4;
      c.fillStyle = "rgba(9, 11, 22, 0.4)";
      for (let yy = 0; yy + linha <= TILE; yy += linha) c.fillRect(px, py + yy + linha - 1, TILE, 1);
      for (let yy = 0, r = 0; yy + linha <= TILE; yy += linha, r++) {
        const off = (r + Math.floor(h * 3)) % 2 ? 4 : 0;
        for (let xx = -8 + off; xx < TILE; xx += 8) {
          const lx = Math.max(px, px + xx);
          const rx = Math.min(px + TILE, px + xx + 8);
          if (rx > lx) c.fillRect(lx, py + yy, 1, linha - 1);
        }
      }
      c.fillStyle = "rgba(255,255,255,0.055)";
      c.fillRect(px + 2, py + 1, 7, 1);
      if (t === K.PLAZA && h > 0.74) {
        c.fillStyle = "rgba(255,200,87,0.26)";
        c.fillRect(px + 8, py + 8, 3, 1);
      }
      if (h > 0.9) {
        c.fillStyle = "rgba(8, 10, 20, 0.5)";
        c.fillRect(px + 4, py + 8, 4, 1);
        c.fillRect(px + 7, py + 9, 1, 2);
      }
      // mato e terra comem a borda da laje: a praça não termina num
      // retângulo perfeito
      const invade = (nt, lado) => {
        if (nt === K.STONE || nt === K.PLAZA) return;
        c.fillStyle = tileColor(nt);
        c.globalAlpha = 0.8;
        for (let i = 0; i < 6; i++) {
          if (hash2(x * 19 + i * 3, y * 23 + i) < 0.5) continue;
          if (lado === 0) c.fillRect(px + 1 + i * 2, py, 2, 1);
          else if (lado === 1) c.fillRect(px + 1 + i * 2, py + TILE - 1, 2, 1);
          else if (lado === 2) c.fillRect(px, py + 1 + i * 2, 1, 2);
          else c.fillRect(px + TILE - 1, py + 1 + i * 2, 1, 2);
        }
        c.globalAlpha = 1;
      };
      invade(world.get(x, y - 1), 0);
      invade(world.get(x, y + 1), 1);
      invade(world.get(x - 1, y), 2);
      invade(world.get(x + 1, y), 3);
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
      const mid = !shallow && (wet(x, y - 2) || wet(x, y + 2) || wet(x - 2, y) || wet(x + 2, y));
      // três profundidades e dither entre elas: a água ganha relevo
      c.fillStyle = shallow ? "#1b4a64" : mid ? "#123a56" : "#0d2740";
      c.fillRect(px, py, TILE, TILE);
      if (shallow || mid) {
        c.fillStyle = "rgba(127, 209, 238, 0.10)";
        for (let i = 0; i < 5; i++) {
          const bx = px + Math.floor(hash2(x * 7 + i, y * 11) * 16);
          const by = py + Math.floor(hash2(x * 13, y * 5 + i) * 16);
          c.fillRect(bx, by, 2, 1);
        }
      }
      if (animated) {
        // a crista viaja de lado, em faixas: não é um brilho que pisca no lugar
        const o = ondaAt(x, y, time);
        if (o > 0.42) {
          const cx = Math.round((hash2(x, y) * 9 + o * 7) % 12);
          const cy = py + 4 + Math.round(hash2(x + 2, y) * 7);
          c.fillStyle = `rgba(150, 228, 255, ${(0.06 + (o - 0.42) * 0.24).toFixed(3)})`;
          c.fillRect(px + cx, cy, 4, 1);
          c.fillRect(px + Math.max(0, cx - 2), cy + 1, 2, 1);
        } else if (o < -0.55) {
          // cava entre duas cristas: a água ganha ondulação, não só brilho
          c.fillStyle = "rgba(3, 12, 24, 0.32)";
          c.fillRect(px + 2, py + 9, 6, 1);
        }
      }
      if (shallow) {
        // espuma pontilhada: a costa fica redonda, não uma linha reta
        const respira = animated ? 0.2 + espumaAt(x, y, time) * 0.26 : 0.3;
        c.fillStyle = `rgba(150, 228, 255, ${respira.toFixed(3)})`;
        if (landN) for (let i = 0; i < 6; i++) if (hash2(x * 5 + i, y) > 0.3) c.fillRect(px + 1 + i * 2, py, 2, 1);
        if (landS) for (let i = 0; i < 6; i++) if (hash2(x * 3 - i, y) > 0.3) c.fillRect(px + 1 + i * 2, py + TILE - 1, 2, 1);
        if (landW) for (let i = 0; i < 6; i++) if (hash2(x, y * 7 + i) > 0.3) c.fillRect(px, py + 1 + i * 2, 1, 2);
        if (landE) for (let i = 0; i < 6; i++) if (hash2(x, y * 5 - i) > 0.3) c.fillRect(px + TILE - 1, py + 1 + i * 2, 1, 2);
        c.fillStyle = "rgba(226, 248, 255, 0.5)";
        for (let i = 0; i < 3; i++) {
          const bx = px + 2 + Math.floor(hash2(x + i * 4, y + 3) * 12);
          const by = py + 2 + Math.floor(hash2(x + 7, y + i * 4) * 12);
          c.fillRect(bx, by, 1, 1);
        }
      }
    } else if (t === K.SAND) {
      c.fillStyle = "#7d6b46";
      c.fillRect(px, py, TILE, TILE);
      c.fillStyle = "rgba(240, 226, 190, 0.2)";
      for (let i = 0; i < 4; i++) {
        const sx = px + 1 + Math.floor(hash2(x * 11 + i, y * 7) * 14);
        const sy = py + 1 + Math.floor(hash2(x * 5, y * 13 + i) * 14);
        c.fillRect(sx, sy, 1, 1);
      }
      c.fillStyle = "rgba(66, 54, 34, 0.35)";
      c.fillRect(px + Math.floor(h * 10), py + 7, 2, 1);
      if (world.get(x, y + 1) === K.WATER) {
        c.fillStyle = "rgba(36, 74, 92, 0.42)";
        c.fillRect(px, py + TILE - 2, TILE, 2);
        c.fillStyle = "rgba(226, 248, 255, 0.4)";
        for (let i = 0; i < 4; i++) c.fillRect(px + 2 + i * 4, py + TILE - 3, 2, 1);
      }
      if (world.get(x, y - 1) === K.WATER) {
        c.fillStyle = "rgba(226, 248, 255, 0.4)";
        for (let i = 0; i < 4; i++) c.fillRect(px + 1 + i * 4, py + 1, 2, 1);
      }
      if (h > 0.93) {
        c.fillStyle = "#f2e3d6";
        c.fillRect(px + 9, py + 10, 2, 1);
        c.fillRect(px + 8, py + 11, 1, 1);
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
      // tábuas com junta alternada, grão e prego: a ponte tem madeira, não
      // listras horizontais de bloco
      for (let i = 0; i < 4; i++) {
        const yy = py + i * 4;
        c.fillStyle = i % 2 ? "#5f4530" : "#523a27";
        c.fillRect(px, yy, TILE, 4);
        c.fillStyle = "rgba(32, 22, 14, 0.6)";
        c.fillRect(px, yy + 3, TILE, 1);
        c.fillStyle = "rgba(150, 112, 72, 0.35)";
        c.fillRect(px + 1, yy + 1, 1, 1);
        const jx = px + ((i * 5 + Math.floor(h * 9)) % 14) + 1;
        c.fillStyle = "rgba(32, 22, 14, 0.55)";
        c.fillRect(jx, yy, 1, 3);
      }
      c.fillStyle = "#2b1f16";
      c.fillRect(px + 2, py + 1, 1, 1);
      c.fillRect(px + 12, py + 9, 1, 1);
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
    const r = hash2(x + 3, y + 9);
    // a copa verga com a frente de rajada: árvores vizinhas vão juntas
    const rajada = gustAt(x, y, time, moodAtual);
    const sway = swayAt(x, y, time, moodAtual) * 0.8;
    const cx = px + 8 + sway + (h - 0.5) * 1.4;
    // sombra
    ctx.fillStyle = "rgba(2, 6, 10, 0.32)";
    ctx.beginPath();
    ctx.ellipse(cx, py + 15, 6.5 + r * 2, 2.7, 0, 0, Math.PI * 2);
    ctx.fill();
    // tronco com raiz: não é um retângulo solto no meio do tile
    ctx.fillStyle = "#2a1e17";
    ctx.fillRect(cx - 1.5, py + 9, 3, 6);
    ctx.fillRect(cx - 2.5, py + 13, 5, 2);
    ctx.fillStyle = "#3d2a1f";
    ctx.fillRect(cx - 1.5, py + 9, 1, 5);
    ctx.fillStyle = "rgba(2, 6, 10, 0.35)";
    ctx.fillRect(cx + 1, py + 14, 3, 1);
    // copa em três camadas de elipses achatadas, desenhadas como spans de
    // 1 px: o contorno fica arredondado de verdade, sem retângulo
    const camadas = [
      { topo: 1, larg: 15 + h * 4, alt: 12 + r * 3, dx: 0, cor: "#0b2114" },
      { topo: 2, larg: 11 + h * 3, alt: 9 + r * 2, dx: -0.5, cor: "#14331f" },
      { topo: 3, larg: 7 + h * 2, alt: 6 + r, dx: -1.1, cor: "#1e4b2b" },
    ];
    for (const cam of camadas) {
      for (let row = 0; row < cam.alt; row++) {
        const t = (row - cam.alt / 2) / (cam.alt / 2);
        let half = Math.sqrt(Math.max(0, 1 - t * t)) * (cam.larg / 2);
        if (hash2(x * 5 + row, y * 3 + row * 7) > 0.74) half -= 1;
        const lx = Math.round(cx + cam.dx - half);
        const rx = Math.round(cx + cam.dx + half);
        if (rx <= lx) continue;
        ctx.fillStyle = cam.cor;
        ctx.fillRect(lx, Math.round(py + cam.topo + row), rx - lx, 1);
      }
    }
    // folhas soltas e brilho no lado iluminado
    ctx.fillStyle = "#1e4b2b";
    for (let i = 0; i < 4; i++) {
      const lx = Math.round(cx - 8 + hash2(x * 3 + i, y * 7) * 16);
      const ly = Math.round(py + 3 + hash2(x + i * 5, y * 3) * 9);
      ctx.fillRect(lx, ly, 1, 1);
    }
    if (rajada > 0.45) {
      // com a rajada, folha solta atravessa o tile: o vento fica visível
      ctx.fillStyle = "rgba(126, 196, 150, 0.8)";
      for (let i = 0; i < 2; i++) {
        const t2 = (time * 0.06 + i * 90 + hash2(x, y) * 60) % 22;
        ctx.fillRect(Math.round(cx + 2 + t2 * (sway >= 0 ? 1 : -1)), py + 6 + Math.round(hash2(x + i, y + 3) * 5), 1, 1);
      }
    }
    ctx.fillStyle = "rgba(180, 255, 214, 0.22)";
    ctx.fillRect(Math.round(cx - 4), py + 4, 3, 1);
    ctx.fillRect(Math.round(cx - 2), py + 3, 1, 1);
    if (h > 0.68) {
      ctx.fillStyle = "rgba(255, 200, 87, 0.72)";
      ctx.fillRect(Math.round(cx - 3), py + 8, 1, 1);
      ctx.fillRect(Math.round(cx + 3), py + 6, 1, 1);
      ctx.fillRect(Math.round(cx + 1), py + 10, 1, 1);
    }
    if (r > 0.86) {
      // arbusto pequeno na base de algumas árvores
      ctx.fillStyle = "#123020";
      ctx.beginPath();
      ctx.ellipse(cx - 5.5, py + 14, 3.2, 2, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#1d4a30";
      ctx.beginPath();
      ctx.ellipse(cx - 5.8, py + 13.4, 2.3, 1.3, 0, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // A grama verga na frente da rajada: o mesmo trecho vai junto, com atraso
  // pequeno de posição, então dá para ver o vento atravessando o campo.
  function drawWindBlades(x, y, t, time) {
    const rajada = gustAt(x, y, time, moodAtual);
    if (rajada < 0.34) return;
    const px = x * TILE;
    const py = y * TILE;
    const lado = swayAt(x, y, time, moodAtual) >= 0 ? 1 : -1;
    const curva = Math.round(1 + rajada * 2);
    ctx.fillStyle = t === K.MOSS ? "rgba(126, 196, 150, 0.55)" : "rgba(154, 214, 132, 0.5)";
    for (let i = 0; i < 3; i++) {
      if (hash2(x * 3 + i, y * 5 + 1) < 0.3) continue;
      const bx = px + 2 + Math.floor(hash2(x + i * 7, y + 2) * 12);
      const by = py + 14;
      const sobe = 2 + Math.floor(hash2(x + i, y + i * 3) * 3);
      ctx.fillRect(bx, by - sobe, 1, sobe);
      ctx.fillRect(bx + lado, by - sobe - 1, 1, 1);
      ctx.fillRect(bx + lado * curva, by - sobe, 1, 1);
    }
  }

  function drawWall(x, y) {
    const px = x * TILE, py = y * TILE;
    const h = hash2(x, y);
    ctx.fillStyle = "#1b1730";
    ctx.fillRect(px, py, TILE, TILE);
    // pedras de 7x5 em fileiras alternadas: a parede tem relevo de rocha,
    // não um quadrado com uma faixa clara em cima
    for (let r = 0; r < 3; r++) {
      const yy = py + r * 5;
      const off = (r % 2) * 3 + Math.floor(h * 2);
      for (let i = -1; i < 3; i++) {
        const xx = px + off + i * 7;
        const lx = Math.max(px, xx);
        const rx = Math.min(px + TILE, xx + 6);
        if (rx <= lx) continue;
        const tom = hash2(x * 7 + i, y * 5 + r);
        ctx.fillStyle = tom > 0.66 ? "#413a5e" : tom > 0.33 ? "#352f4e" : "#2c2742";
        ctx.fillRect(lx + 1, yy + 1, Math.max(1, rx - lx - 1), 3);
        ctx.fillStyle = "rgba(255,255,255,0.06)";
        ctx.fillRect(lx + 1, yy + 1, Math.max(1, rx - lx - 1), 1);
      }
    }
    ctx.fillStyle = "rgba(6, 4, 14, 0.5)";
    ctx.fillRect(px, py, TILE, 1);
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(px, py + TILE - 1, TILE, 1);
    if (h > 0.84) {
      ctx.fillStyle = "rgba(96, 158, 106, 0.5)";
      ctx.fillRect(px + 2 + Math.floor(h * 6), py + 11, 2, 1);
      ctx.fillRect(px + 4 + Math.floor(h * 5), py + 12, 1, 1);
    }
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
    } else if (d.type === "crate") {
      // caixote do cais: tábua, travessa e prego
      const a = d.accent || "#ffc857";
      ctx.fillStyle = "rgba(2,6,10,0.35)";
      ctx.beginPath(); ctx.ellipse(px + 1, py + 7, 8, 2.4, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#4a3322"; ctx.fillRect(px - 6, py - 5, 13, 12);
      ctx.fillStyle = "#6b4a2f"; ctx.fillRect(px - 5, py - 4, 11, 10);
      ctx.fillStyle = "#7d5a38"; ctx.fillRect(px - 5, py - 4, 11, 1);
      ctx.fillStyle = "#3d2a1a"; ctx.fillRect(px - 5, py - 1, 11, 1); ctx.fillRect(px - 1, py - 4, 1, 10);
      ctx.fillStyle = hexA(a, 0.8); ctx.fillRect(px - 4, py + 3, 1, 1); ctx.fillRect(px + 3, py + 3, 1, 1);
    } else if (d.type === "crane") {
      // guindaste: base, mastro, lança sobre a água e o cabo com o caixote
      const a = d.accent || "#ffc857";
      ctx.fillStyle = "rgba(2,6,10,0.4)";
      ctx.beginPath(); ctx.ellipse(px, py + 9, 11, 3, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = "#3a2a1e"; ctx.fillRect(px - 7, py + 5, 15, 4);
      ctx.fillStyle = "#5a4030"; ctx.fillRect(px - 2, py - 22, 4, 28);
      ctx.fillStyle = "#7a5636"; ctx.fillRect(px - 1, py - 22, 1, 27);
      ctx.strokeStyle = "#5a4030"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.moveTo(px, py - 22); ctx.lineTo(px + 18, py - 20); ctx.stroke();
      ctx.strokeStyle = "#8a623d"; ctx.lineWidth = 1;
      ctx.beginPath(); ctx.moveTo(px, py - 23); ctx.lineTo(px + 18, py - 21); ctx.stroke();
      const balanco = Math.sin(time * 0.0016 + d.x) * 1.5;
      ctx.strokeStyle = "rgba(220,210,190,0.7)";
      ctx.beginPath(); ctx.moveTo(px + 18, py - 20); ctx.lineTo(px + 18 + balanco, py - 8); ctx.stroke();
      ctx.fillStyle = "#6b4a2f"; ctx.fillRect(px + 15 + balanco, py - 8, 7, 6);
      ctx.fillStyle = "#3d2a1a"; ctx.fillRect(px + 15 + balanco, py - 5, 7, 1);
      ctx.fillStyle = a; ctx.fillRect(px - 1, py - 24, 2, 2);
    } else if (d.type === "bell") {
      // sino do porto: armação, sino e badalo
      const a = d.accent || "#ffc857";
      ctx.fillStyle = "#3a2a1e";
      ctx.fillRect(px - 1, py - 12, 3, 22);
      ctx.fillRect(px - 8, py - 12, 17, 2);
      ctx.fillStyle = "#5a4030"; ctx.fillRect(px - 9, py - 12, 3, 2);
      ctx.fillStyle = "#c9a227";
      ctx.beginPath();
      ctx.moveTo(px - 5, py - 9); ctx.lineTo(px + 5, py - 9);
      ctx.lineTo(px + 7, py - 1); ctx.lineTo(px - 7, py - 1);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = "#8f6f1a"; ctx.fillRect(px - 7, py - 2, 15, 2);
      const bal = Math.sin(time * 0.006 + d.x) * 1;
      ctx.fillStyle = a; ctx.fillRect(px - 1 + bal, py - 1, 2, 3);
      ctx.fillStyle = "#2a2438"; ctx.fillRect(px - 1, py - 10, 2, 1);
    } else if (d.type === "mast") {
      // mastro com bandeira que tremula
      ctx.fillStyle = "#4a3322"; ctx.fillRect(px - 1, py - 26, 3, 34);
      ctx.fillStyle = "#7a5636"; ctx.fillRect(px - 1, py - 26, 1, 33);
      const onda = Math.sin(time * 0.004 + d.x) * 2;
      ctx.fillStyle = d.accent || "#ffc857";
      ctx.beginPath();
      ctx.moveTo(px + 2, py - 25);
      ctx.lineTo(px + 13, py - 23 + onda);
      ctx.lineTo(px + 2, py - 18);
      ctx.closePath(); ctx.fill();
      ctx.fillStyle = "rgba(255,255,255,0.35)";
      ctx.fillRect(px + 3, py - 23, 3, 1);
    } else if (d.type === "gull") {
      // gaivota: duas asas que sobem e descem, sem sombra no chão
      const t = time * 0.005 + d.x * 6;
      const asa = Math.sin(t) * 2;
      const x = px;
      const y = py - 16 + Math.sin(time * 0.0012 + d.x * 9) * 3;
      ctx.fillStyle = "rgba(240,244,255,0.9)";
      ctx.fillRect(x - 3, y - 1 + asa, 3, 1);
      ctx.fillRect(x + 1, y - 1 + asa, 3, 1);
      ctx.fillRect(x - 1, y, 2, 1);
      ctx.fillStyle = "rgba(255,200,87,0.9)";
      ctx.fillRect(x + 1, y, 1, 1);
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
    const bioma = BIOMES[c.areaId] || BIOMES[c.groundId] || null;
    drawCaveFacade(ctx, {
      px: c.x * TILE,
      py: c.y * TILE,
      entrada: c.mouth !== "far",
      material: bioma?.material || "",
      pedra: bioma?.path || "#50536f",
      meio: bioma?.floor || "#3b3d55",
      fundo: bioma?.base || "#22243a",
      acento: bioma?.accent || c.accent || "#ffc857",
      seed: hash2(Math.round(c.x) * 7 + 3, Math.round(c.y) * 5 + 1),
      time,
    });
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
    // o item flutua na diagonal e a fase vem do id, então dois itens vizinhos
    // não sobem no mesmo compasso
    const fase = (g.itemId || "").length * 0.7 + g.x * 1.3;
    const bobX = Math.cos(time * 0.002 + fase) * 0.9;
    const bob = Math.sin(time * 0.002 + fase) * 1.6;
    const pulso2 = 0.5 + Math.sin(time * 0.0028 + fase * 1.7) * 0.5;
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
    ctx.drawImage(itemIconCanvas(item), px - 9 + bobX, py - 21 + bob, 18, 18);
    // brilho em diagonal, do canto de cima para o de baixo, como se a luz
    // varresse o item em vez de piscar no mesmo pixel
    if (pulso2 > 0.35) {
      const t = (pulso2 - 0.35) / 0.65;
      ctx.fillStyle = `rgba(255,243,209,${(0.25 + t * 0.6).toFixed(3)})`;
      ctx.fillRect(px - 4 + Math.round(t * 10) + bobX, py - 20 + bob, 1, 1);
      ctx.fillRect(px - 3 + Math.round(t * 10) + bobX, py - 19 + bob, 1, 1);
    }
  }

  let jogadorAtual = null;
  function drawNpc(npc, time) {
    const px = npc.x * TILE, py = npc.y * TILE;
    // respiração irregular: dois senos de períodos diferentes, sem ninguém
    // respirando no mesmo compasso
    const bob = Math.sin(time * 0.0013 + npc.bob) * 0.8 + Math.sin(time * 0.0007 + npc.bob * 2.3) * 0.5;
    const colors = npc.colors || { skin: "#d9b08c", hair: "#4a3a55", shirt: npc.accent, pants: "#2f2c45" };
    drawHuman(ctx, px, py + bob, npc.facing || 0, !!npc.moving, time, colors, npc.scale || 0.9, npc.look || null);
    drawNpcKit(ctx, npc, px, py, bob, time, colors);
    // perto, a pessoa levanta a mão: o mundo reconhece quem chegou
    if (jogadorAtual && Math.hypot(npc.x - jogadorAtual.x, npc.y - jogadorAtual.y) < 2.6) {
      const acena = Math.sin(time * 0.008 + npc.bob) > 0.2 ? 1 : 0;
      ctx.fillStyle = colors.skin;
      ctx.fillRect(px + 5 * (npc.scale || 0.9), py + bob - (10 + acena) * (npc.scale || 0.9), 2, 2);
    }
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
    drawPetSprite(ctx, cat.kind || "cat", cat.x * TILE, cat.y * TILE, time, moving, cat.facing === -1 ? 1 : 2);
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
  // últimos quadros, para o p95, e o instante do último ajuste de qualidade
  const amostrasQuadro = [];
  let ultimoAjuste = 0;
  let quadrosTotais = 0;

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
        bordaDeBioma(g, tx, ty);
      }
    }
    // grão fino por cima de tudo: uma segunda passada barata, uma vez por
    // bloco, e nenhum tile fica com a cor chapada
    for (let y = 0; y < CHUNK; y++) {
      for (let x = 0; x < CHUNK; x++) {
        const tx = bx + x;
        const ty = by + y;
        if (tx < 0 || ty < 0 || tx >= MAP_W || ty >= MAP_H) continue;
        groundGrain(g, tx, ty, world.get(tx, ty));
      }
    }
    // LRU de 120 blocos: o mapa é estático, mas caminhar por muitas ilhas
    // encheria a memória se o cache só crescesse.
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

  function draw(now, player, peers, npcs, cat, moving, rastreador = false) {
    const frameStart = performance.now();
    const time = now;
    const areaJogador = world.areaAt(player.x, player.y);
    moodAtual = windMood(areaJogador ? BIOMES[areaJogador.id]?.material : null);
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
        else if (tile === K.GRASS || tile === K.FLOWER || tile === K.MOSS) drawWindBlades(x, y, tile, time);
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
    jogadorAtual = player;
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

    if (!modoLeve) drawAmbient(areaJogador, time, camX, camY, viewW, viewH);
    drawNpcLabels(npcs, scale, camX, camY);
    drawMinimap(player, peers, rastreador);
    const frameEnd = performance.now();
    if (stats._prev) {
      const dt = frameEnd - stats._prev;
      if (dt > 0 && dt < 250) {
        stats.fps = stats.fps * 0.92 + (1000 / dt) * 0.08;
        amostrasQuadro.push(dt);
        if (amostrasQuadro.length > 45) amostrasQuadro.shift();
      }
    }
    stats._prev = frameEnd;
    stats.drawMs = stats.drawMs ? stats.drawMs * 0.9 + (frameEnd - frameStart) * 0.1 : frameEnd - frameStart;
    stats.quality = quality;
    // A qualidade olha o p95 do quadro, não a média: o engasgo é o que a pessoa
    // sente, e a média esconde um quadro de 40 ms no meio de vinte de 16 ms.
    if (quadrosTotais > 90 && amostrasQuadro.length >= 30 && frameEnd - ultimoAjuste > 1800) {
      const ordenadas = [...amostrasQuadro].sort((a, b) => a - b);
      const p95 = ordenadas[Math.floor(ordenadas.length * 0.95)];
      // 60 Hz dá 16,7 ms por quadro: acima de 20 ms já é engasgo de verdade,
      // e abaixo de 17,2 ms está liso e pode voltar a subir
      if (p95 > 20 && quality > 0.7) {
        quality = Math.max(0.7, quality - 0.12);
        ultimoAjuste = frameEnd;
        resize();
      } else if (p95 > 26 && quality <= 0.7) {
        // piso de qualidade e ainda engasgando: aparelho fraco de verdade
        setModoLeve(true);
        ultimoAjuste = frameEnd;
      } else if (p95 < 17.2 && quality < 1) {
        quality = Math.min(1, quality + 0.08);
        ultimoAjuste = frameEnd;
        resize();
      }
    }
    quadrosTotais++;
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

  // ---- ambiente por ilha: estação, evento e partículas do lugar ----
  const relogioAmbiente = criarAmbiente({ semente: 20261021 });
  const kitsAmbiente = new Map();
  function kitDaArea(area) {
    if (!area) return null;
    if (!kitsAmbiente.has(area.id)) {
      kitsAmbiente.set(area.id, ambienteDe(area.id, BIOMES[area.id], area.links || []));
    }
    return kitsAmbiente.get(area.id);
  }
  function ruido(n) {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  }
  // no máximo 8 partículas por elemento: o teto do desenho é 12
  function drawAmbient(area, time, camX, camY, viewW, viewH) {
    const kit = kitDaArea(area);
    if (!kit) return;
    const ev = relogioAmbiente.tick(time);
    const id = ev.evento?.id || "";
    const intensidade = ev.intensidade || 0;
    const chuva = id === "chuva" ? intensidade : 0;
    const vento = id === "rajada" ? intensidade : 0;
    const neblina = id === "neblina" ? intensidade : 0;
    if (id === "silencio" && intensidade > 0.4) return;
    const cor = kit.cor || "#ffc857";
    const W = viewW + 80;
    const H = viewH + 80;
    ctx.save();
    ctx.globalAlpha = 1;
    for (const tipo of kit.elementos) {
      // chuva apaga o que é faísca, e neblina come metade do que sobe
      if (chuva > 0.25 && (tipo === "faisca" || tipo === "luzes")) continue;
      const folhagem = tipo === "folha" || tipo === "folha-escura" || tipo === "pagina";
      const n = tipo === "pendulo" || tipo === "forma" || tipo === "onda"
        ? 1
        : folhagem && relogioAmbiente.estacao === "outono" ? 12 : 7;
      for (let i = 0; i < n; i++) {
        const s = kit.semente + i * 37;
        const bx = camX + (ruido(s) * W) - 40;
        const by = camY + (ruido(s + 1) * H) - 40;
        const a = (0.35 + ruido(s + 2) * 0.4) * (1 - neblina * 0.5);
        ctx.fillStyle = cor;
        ctx.globalAlpha = a;
        if (tipo === "po-giz") {
          const y = camY + ((by - camY + time * 0.012) % H);
          ctx.fillRect(bx, y, 1, 1);
        } else if (tipo === "forma") {
          const f = (time / 2400 + ruido(s) * 0.2) % 1;
          const r = 3 + Math.min(f, 0.5) * 10;
          ctx.strokeStyle = cor;
          ctx.lineWidth = 1;
          ctx.beginPath();
          for (let k = 0; k < 3; k++) {
            const ang = (k / 3) * Math.PI * 2 - Math.PI / 2 + time * 0.0002;
            const px = bx + Math.cos(ang) * r;
            const py = by + Math.sin(ang) * r;
            if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
        } else if (tipo === "pendulo") {
          const ang = Math.sin(time / 700) * 0.6;
          ctx.fillStyle = "rgba(220,210,240,0.5)";
          for (let k = 0; k < 6; k++) ctx.fillRect(bx + Math.sin(ang) * k * 2, by + k * 2, 1, 1);
          ctx.fillStyle = cor;
          ctx.fillRect(bx + Math.sin(ang) * 12 - 1, by + 12, 3, 3);
        } else if (tipo === "orbe") {
          const float = Math.sin(time / 900 + i) * 3;
          ctx.beginPath();
          ctx.arc(bx, by + float, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = a * 0.25;
          ctx.beginPath();
          ctx.arc(bx, by + float, 6, 0, Math.PI * 2);
          ctx.fill();
        } else if (tipo === "bolha") {
          const y = camY + ((by - camY - time * 0.02) % H + H) % H;
          ctx.globalAlpha = a * 0.8;
          ctx.fillRect(bx, y, 2, 2);
        } else if (tipo === "fumaca") {
          const y = camY + ((by - camY - time * 0.008) % H + H) % H;
          ctx.globalAlpha = a * 0.35;
          ctx.fillRect(bx, y, 3, 1);
          ctx.fillRect(bx + 1, y - 2, 2, 1);
        } else if (tipo === "faisca") {
          const fase = (time / 2600 + ruido(s) * 3) % 1;
          if (fase > 0.08) continue;
          ctx.fillStyle = "#fff3d1";
          ctx.fillRect(bx, by, 1, 1);
          ctx.fillRect(bx - 1, by, 1, 1);
          ctx.fillRect(bx + 1, by, 1, 1);
          ctx.fillRect(bx, by - 1, 1, 1);
        } else if (tipo === "luzes") {
          const ligado = Math.floor(time / 350) % 4;
          ctx.globalAlpha = ligado === i % 4 ? a : a * 0.15;
          ctx.fillRect(bx, by, 2, 2);
        } else if (tipo === "folha") {
          const x = camX + ((bx - camX + time * 0.02 * (1 + vento)) % W);
          const y = by + Math.sin(time / 700 + i) * 6;
          ctx.globalAlpha = a * 0.85;
          ctx.fillRect(x, y, 2, 2);
        } else if (tipo === "letra") {
          const fase = (time / 4000 + ruido(s)) % 1;
          ctx.globalAlpha = a * (1 - fase);
          ctx.fillRect(bx, by, 1, 3);
          ctx.fillRect(bx - 1, by, 1, 1);
          ctx.fillRect(bx + 1, by, 1, 1);
        } else if (tipo === "nota") {
          const y = camY + ((by - camY - time * 0.018) % H + H) % H;
          ctx.fillRect(bx, y, 2, 1);
          ctx.fillRect(bx + 1, y - 4, 1, 5);
        } else if (tipo === "onda") {
          ctx.strokeStyle = cor;
          ctx.lineWidth = 1;
          ctx.beginPath();
          const x0 = camX + ((time * 0.06) % (viewW + 120)) - 60;
          for (let k = 0; k < 24; k += 3) {
            const px = x0 - k;
            const py = by + Math.sin(k * 0.4 + time * 0.003) * 4;
            if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.stroke();
        } else if (tipo === "pulso") {
          const r = 2 + ((time / 2000 + ruido(s)) % 1) * 9;
          ctx.globalAlpha = a * 0.5;
          ctx.strokeStyle = cor;
          ctx.beginPath();
          ctx.arc(bx, by, r, 0, Math.PI * 2);
          ctx.stroke();
        } else if (tipo === "no") {
          const on = Math.floor(time / 1200 + i) % 5 === 0;
          ctx.globalAlpha = on ? a : a * 0.3;
          ctx.fillRect(bx, by, 2, 2);
          ctx.globalAlpha = a * 0.3;
          ctx.fillRect(bx - 3, by, 3, 1);
        } else if (tipo === "risco") {
          const fase = (time / 5200 + ruido(s)) % 1;
          if (fase > 0.5) continue;
          ctx.globalAlpha = a * (1 - fase * 2) * 0.7;
          ctx.fillRect(bx, by, 4, 1);
          ctx.fillRect(bx + 4, by + 1, 3, 1);
        } else if (tipo === "pagina") {
          const giro = Math.abs(Math.sin(time / 1200 + i));
          ctx.globalAlpha = a * 0.8;
          ctx.fillRect(bx, by, Math.max(1, Math.round(3 * giro)), 3);
        } else if (tipo === "gota") {
          const y = camY + ((by - camY + time * 0.05) % H);
          ctx.globalAlpha = a * 0.9;
          ctx.fillRect(bx, y, 1, 2);
        } else if (tipo === "verdete") {
          ctx.globalAlpha = a * (0.4 + Math.sin(time / 3000 + i) * 0.2);
          ctx.fillRect(bx, by, 2, 1);
        } else if (tipo === "reflexo") {
          const faixa = (time / 3000 + ruido(s)) % 1;
          if (faixa > 0.4) continue;
          ctx.globalAlpha = a * (0.5 - Math.abs(faixa - 0.2) * 2);
          ctx.fillRect(bx, by, 6, 1);
        } else if (tipo === "poeira") {
          const x = bx + Math.sin(time / 900 + i) * 4;
          const y = by + Math.cos(time / 700 + i) * 2;
          ctx.globalAlpha = a * 0.5;
          ctx.fillRect(x, y, 1, 1);
        } else if (tipo === "fiapo") {
          const x = camX + ((bx - camX + time * 0.03 * (1 + vento)) % W);
          ctx.globalAlpha = a * 0.7;
          ctx.fillRect(x, by + Math.sin(time / 500 + i) * 3, 2, 1);
        } else if (tipo === "folha-escura") {
          const y = camY + ((by - camY + time * 0.014) % H);
          ctx.globalAlpha = a * 0.8;
          ctx.fillRect(bx, y, 2, 1);
        }
      }
    }
    ctx.globalAlpha = 1;
    // clima: chuva cai na tela inteira, neblina lava a cor, revoada sobe
    if (chuva > 0.05) {
      ctx.strokeStyle = `rgba(180,210,240,${0.18 * chuva})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < 40; i++) {
        const x = camX + ruido(i + 3) * viewW;
        const y = camY + ((ruido(i + 9) * viewH + time * 0.35) % viewH);
        ctx.moveTo(x, y);
        ctx.lineTo(x - 2, y + 6);
      }
      ctx.stroke();
    }
    if (neblina > 0.05) {
      ctx.fillStyle = `rgba(190,200,220,${0.10 * neblina})`;
      ctx.fillRect(camX, camY, viewW, viewH);
    }
    ctx.restore();
  }

  // ---- minimapa com zoom, centro no personagem e coordenada ----
  // O mapa tem 2 px por tile; o nível 0 é o mapa inteiro e os outros são uma
  // janela em volta do jogador, como no Tibia, para o marcador não sumir.
  const MINI_SCALES = [0, 2, 3, 4, 6];
  let miniIndex = 2;
  let miniPlayer = null;
  // o mapa pode sair do modo "atrás do boneco": arrastar solta a câmera do
  // personagem e deixa olhar outro canto sem mudar de lugar
  let miniFollow = true;
  const miniPan = { x: 0, y: 0 };

  function miniView() {
    const tilePx = MINI_SCALES[miniIndex];
    const DW = minimap?.width || mmBase.width;
    const DH = minimap?.height || mmBase.height;
    const p = miniPlayer || { x: MAP_W / 2, y: MAP_H / 2 };
    const foco = miniFollow ? p : { x: p.x + miniPan.x, y: p.y + miniPan.y };
    const srcW = tilePx ? Math.min(mmBase.width, (DW * 2) / tilePx) : mmBase.width;
    const srcH = tilePx ? Math.min(mmBase.height, (DH * 2) / tilePx) : mmBase.height;
    const sx = Math.max(0, Math.min(mmBase.width - srcW, foco.x * 2 - srcW / 2));
    const sy = Math.max(0, Math.min(mmBase.height - srcH, foco.y * 2 - srcH / 2));
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

  function drawMinimap(player, peers, rastreador = false) {
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
    // rastreador revela o que está perto mesmo na névoa: bicho, caverna e veio
    const perto = (x, y) => rastreador && Math.hypot(x - player.x, y - player.y) <= 14;
    for (const h of world.hunters) {
      const revelado = world.isExplored(Math.floor(h.center.x), Math.floor(h.center.y));
      if (!revelado && !perto(h.center.x, h.center.y)) continue;
      const pt = miniPoint(view, h.center.x, h.center.y);
      mctx.globalAlpha = revelado ? 1 : 0.55;
      mctx.fillStyle = "#0a0c18";
      mctx.fillRect(Math.round(pt.x) - 3, Math.round(pt.y) - 3, 6, 6);
      mctx.fillStyle = h.accent;
      mctx.fillRect(Math.round(pt.x) - 2, Math.round(pt.y) - 2, 4, 4);
      mctx.globalAlpha = 1;
    }
    if (rastreador) {
      mctx.fillStyle = "rgba(255,243,209,0.8)";
      for (const g of world.groundItems || []) {
        if (!perto(g.x, g.y)) continue;
        const pt = miniPoint(view, g.x, g.y);
        mctx.fillRect(Math.round(pt.x) - 1, Math.round(pt.y) - 1, 2, 2);
      }
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
    draw, resize, kick, stats, ambiente: relogioAmbiente, setModoLeve, get modoLeve() { return modoLeve; },
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
      miniFollow = true;
      miniPan.x = 0;
      miniPan.y = 0;
      return miniLabel();
    },
    // arrasto no mapa: converte pixel de tela em tile e solta a câmera
    miniPanBy(dx, dy) {
      if (!MINI_SCALES[miniIndex]) return false;
      const view = miniView();
      const k = (view.srcW / view.DW) / 2;
      miniFollow = false;
      miniPan.x += dx * k;
      miniPan.y += dy * k;
      return true;
    },
    miniRecenter() {
      miniFollow = true;
      miniPan.x = 0;
      miniPan.y = 0;
    },
    get miniFollowing() { return miniFollow; },
    miniWorldAt(fx, fy) {
      const view = miniView();
      return {
        x: (view.sx + Math.max(0, Math.min(1, fx)) * view.srcW) / 2,
        y: (view.sy + Math.max(0, Math.min(1, fy)) * view.srcH) / 2,
      };
    },
  };
}

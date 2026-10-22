import { TILE, TILE_KIND as K } from "../core/runtime-config.js";
import { hash2 } from "../core/random.js";
import { BIOMES, TILE_STYLE } from "../content/identity.js";
import { gustAt, ondaAt, espumaAt, swayAt } from "./wind.js";

export function createTerrainRenderer({ ctx, world, getWindMood }) {
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
    for (let i = 0; i < 6; i++) {
      const gx = px + 1 + Math.floor(hash2(x * 13 + i * 5, y * 17 - i) * 14);
      const gy = py + 1 + Math.floor(hash2(x * 7 - i, y * 19 + i * 5) * 14);
      c.fillStyle = i % 2 ? "rgba(255,255,255,0.045)" : "rgba(0,0,0,0.09)";
      c.fillRect(gx, gy, i === 0 ? 2 : .5, .5);
      const pattern=TILE_STYLE[t]?.pattern;
      if(t===K.STONE||t===K.PATH||t===K.MARBLE||pattern==='cracks'){
        c.fillStyle='rgba(230,222,203,.10)';c.fillRect(gx,gy-.5,1,.5);
        if(i<2){c.fillStyle='rgba(4,12,25,.12)';c.fillRect(gx+1,gy+1,.5,1);}
      }else if(t===K.SAND||pattern==='dunes'){
        c.fillStyle='rgba(237,205,151,.09)';c.fillRect(gx,gy,2,.5);c.fillRect(gx+2,gy+.5,1,.5);
      }else if(t===K.BRIDGE){
        c.fillStyle='rgba(213,174,119,.14)';c.fillRect(gx,gy,3,.5);
        if(i<2){c.fillStyle='rgba(8,16,27,.35)';c.fillRect(gx,gy,.5,.5);}
      }else if(t===K.MOSS||pattern==='dots'){
        c.fillStyle='rgba(161,191,121,.10)';c.fillRect(gx,gy,1,.5);c.fillRect(gx+.5,gy-.5,.5,.5);
      }
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
          const start=1+i*5,width=Math.min(w,TILE-start);
          c.fillRect(px+start,py+3+i*4,width,.5);
          c.fillRect(px+start+Math.max(0,width-2),py+3.5+i*4,1,.5);
        }
      } else if (t === K.MAGMA) {
        const glow = 0.4 + Math.sin(time * 0.003 + x + y) * 0.18;
        c.fillStyle = `rgba(255, 122, 60, ${glow})`;
        c.fillRect(px + 3 + Math.floor(h * 6), py + 6, 3, 1);
        c.fillRect(px + 6 + Math.floor(hash2(y, x) * 5), py + 10, 2, 1);
        if(glow>.53){c.fillStyle='rgba(255,219,135,.55)';c.fillRect(px+4+Math.floor(h*6),py+6,.5,.5);}
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
    const rajada = gustAt(x, y, time, getWindMood());
    const sway = swayAt(x, y, time, getWindMood()) * 0.8;
    const rootX=px+8+(h-.5)*1.4;
    const cx=rootX+sway;
    // sombra
    ctx.fillStyle = "rgba(2, 6, 10, 0.32)";
    ctx.beginPath();
    ctx.ellipse(rootX, py + 15, 6.5 + r * 2, 2.7, 0, 0, Math.PI * 2);
    ctx.fill();
    // tronco com raiz: não é um retângulo solto no meio do tile
    ctx.fillStyle = "#2a1e17";
    ctx.fillRect(rootX - 1.5, py + 9, 3, 6);
    ctx.fillRect(rootX - 2.5, py + 13, 5, 2);
    ctx.fillStyle = "#3d2a1f";
    ctx.fillRect(rootX - 1.5, py + 9, 1, 5);
    ctx.fillStyle = "rgba(2, 6, 10, 0.35)";
    ctx.fillRect(rootX + 1, py + 14, 3, 1);
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
    // Brotos no plano iluminado, com nervuras curtas em vez de ruído solto.
    ctx.fillStyle='#3a6241';
    for(let i=0;i<5;i++){const lx=cx-5+(i*3)%9,ly=py+4+(i*2)%6;ctx.fillRect(lx,ly,1.5,.5);ctx.fillRect(lx+.5,ly-.5,.5,.5);}
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
    const rajada = gustAt(x, y, time, getWindMood());
    // mesmo sem rajada o capim balança devagar: o campo não é estátua
    const forca = Math.max(0.22, rajada);
    const px = x * TILE;
    const py = y * TILE;
    const lado = swayAt(x, y, time, getWindMood()) >= 0 ? 1 : -1;
    const curva = Math.round(1 + forca * 2);
    ctx.fillStyle = t === K.MOSS ? "rgba(126, 196, 150, 0.55)" : "rgba(154, 214, 132, 0.5)";
    const quantas = rajada > 0.34 ? 3 : 2;
    for (let i = 0; i < quantas; i++) {
      if (hash2(x * 3 + i, y * 5 + 1) < 0.3) continue;
      const bx = px + 2 + Math.floor(hash2(x + i * 7, y + 2) * 12);
      const by = py + 14;
      const sobe = 2 + Math.floor(hash2(x + i, y + i * 3) * 3);
      ctx.fillRect(bx, by - sobe, 1, sobe);
      ctx.fillRect(bx + lado, by - sobe - 1, 1, 1);
      ctx.fillRect(bx + lado * curva, by - sobe, 1, 1);
      ctx.fillRect(bx + lado * curva + 1, by - sobe - 0.5, 0.5, 0.5);
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
        ctx.fillStyle = "rgba(0,0,0,0.18)";
        ctx.fillRect(lx + 1, yy + 3.5, Math.max(1, rx - lx - 1), 0.5);
      }
    }
    ctx.fillStyle = "rgba(6, 4, 14, 0.5)";
    ctx.fillRect(px, py, TILE, 1);
    ctx.fillStyle = "rgba(0,0,0,0.35)";
    ctx.fillRect(px, py + TILE - 1, TILE, 1);
    ctx.fillStyle='rgba(189,181,165,.14)';ctx.fillRect(px+3+Math.floor(h*7),py+6,1,.5);
    ctx.fillStyle='rgba(7,15,29,.35)';ctx.fillRect(px+10,py+8,.5,2);ctx.fillRect(px+10.5,py+10,1,.5);
    if (h > 0.84) {
      ctx.fillStyle = "rgba(96, 158, 106, 0.5)";
      ctx.fillRect(px + 2 + Math.floor(h * 6), py + 11, 2, 1);
      ctx.fillRect(px + 4 + Math.floor(h * 5), py + 12, 1, 1);
    }
  }

  return { tileColor, groundGrain, bordaDeBioma, drawGroundOn, drawTree, drawWindBlades, drawWall };
}

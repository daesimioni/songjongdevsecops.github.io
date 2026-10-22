import { createTerrainRenderer } from "./terrain-renderer.js";
import { spritePose } from "./sprite-cache.js";
import { artTick, artTime } from "./art-style.js";
import { faseDoDia } from "./dia-noite.js";
import { directionAngle } from "../core/movement.js";
import { outfitById } from "../content/outfits.js";
import { avatarColors } from "../content/avatar.js";
import { drawHuman } from "./human.js";
import { TILE, MAP_W, MAP_H, WORLD_W, WORLD_H, TILE_KIND as K } from "../core/runtime-config.js";
import { PLAYER_COLORS } from "../content/config.js";
import { hash2 } from "../core/random.js";
import { NPCS } from "../content/content.js";
import { itemIconCanvas } from "./item-art.js";
import { ITEMS } from "../content/rpg-data.js";
import { drawPetSprite } from "./pet-art.js";
import { BIOMES, TILE_STYLE } from "../content/identity.js";
import { drawSkiff, skiffRear } from "./skiff.js";
import { drawNpcKit } from "./npc-art.js";
import { drawCaveFacade } from "./cave-art.js";
import { swayAt, windMood } from "./wind.js";
import { escalaDaCamera, tilesNaVista } from "../core/camera.js";
import { desenharAsset, assetDe } from "./assets/index.js";
import { desenharIcone } from "./assets/icones.js";
import { hexA } from "./assets/nucleo.js";
import { fracoesDeVida } from "../core/vitais.js";
import { createAmbientRenderer } from "./ambient-renderer.js";




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
  // o que existe fora da sala: tábua escura em vez de preto chapado, para o
  // recorte da casa parecer um cômodo e não um buraco no mapa
  let padraoCasa = null;
  function padraoDaCasa() {
    if (padraoCasa) return padraoCasa;
    if (typeof document === "undefined") return null;
    const c = document.createElement("canvas");
    c.width = 48; c.height = 48;
    const g = c.getContext("2d");
    g.fillStyle = "#070a14";
    g.fillRect(0, 0, 48, 48);
    for (let y = 0; y < 48; y += 6) {
      g.fillStyle = y % 12 ? "#0a0e1b" : "#090c18";
      g.fillRect(0, y, 48, 5);
      g.fillStyle = "rgba(130,150,200,0.05)";
      g.fillRect(0, y, 48, 1);
      const off = ((y / 6) % 2) * 12;
      g.fillStyle = "rgba(2,3,8,0.55)";
      for (let x = -12; x < 48; x += 24) g.fillRect(x + off + 22, y, 1, 5);
    }
    padraoCasa = ctx.createPattern(c, "repeat");
    return padraoCasa;
  }
  let trail = [];
  // o vento do lugar onde o jogador está: troca de bioma, troca a força do ar
  let moodAtual = windMood(null);
  const { groundGrain, bordaDeBioma, drawGroundOn, drawTree, drawWindBlades, drawWall } = createTerrainRenderer({ctx,world,getWindMood:()=>moodAtual});
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
    // O tile de 16 px fica entre 21 e 26 px na tela. A conta mora em
    // src/core/camera.js e é a mesma da caverna: trocar de cena não muda o tamanho.
    zoom = escalaDaCamera(vw, vh);
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
  // os ícones de conceito moram em src/rendering/assets/icones.js
  function drawDecor(d, time) { desenharIcone(ctx, d, time); }
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


  function drawStation(s, time) {
    const px = s.x * TILE, py = s.y * TILE;
    const pulse = 0.5 + Math.sin(time * 0.0024 + s.x) * 0.5;
    // subárea tem totem um pouco menor: a ilha tem várias e o monumento
    // grande encostava no da estação vizinha
    const k = s.minor ? 0.72 : 0.92;
    const halo = Math.round(30 * k);
    ctx.globalAlpha = (s.minor ? 0.22 : 0.4) + pulse * 0.22;
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

    drawTotem(s, px, py, k, time);
  }

  // O totem de conhecimento não é um só. Cada estação recebe uma de seis
  // silhuetas (monólito, cairn, pórtico, obelisco, braços, anel), uma das três
  // pedras e um enfeite de base: o totem de uma ilha não repete o da vizinha.
  const TOTEM_PEDRAS = [
    { escuro: "#1d2438", face: "#3a4462", luz: "#66739e", claro: "#7d8bb8", topo: "#46527a", tinta: "#121728" },
    { escuro: "#241f2e", face: "#4a4152", luz: "#7a6b85", claro: "#95869e", topo: "#5b4f63", tinta: "#171320" },
    { escuro: "#1b2a2b", face: "#3a4d4f", luz: "#698688", claro: "#85a1a3", topo: "#4b6264", tinta: "#111c1d" },
  ];

  function drawTotem(s, px, py, k, time) {
    const h = hash2(s.x, s.y);
    const pulso = 0.5 + Math.sin(time * 0.0021 + h * 6.283) * 0.5;
    const pedra = TOTEM_PEDRAS[Math.floor(hash2(s.x + 3.3, s.y - 7.1) * 3) % 3];
    const estilo = Math.floor(hash2(s.x - 5.7, s.y + 2.9) * 6) % 6;
    const enfeite = Math.floor(hash2(s.x * 1.7, s.y - 4.3) * 3) % 3;
    let gy = py - 36 * k;
    let escalaSigilo = 0.66;
    // luz no adro: o totem acende o chão em volta, então se acha de longe
    ctx.globalAlpha = 0.24 + pulso * 0.14;
    ctx.drawImage(glowSprite(s.accent), px - 26 * k, py - 20 * k, 52 * k, 52 * k);
    ctx.globalAlpha = 1;
    // lajotas do adro: doze pedras em volta da base, meio-pixel de brilho
    ctx.fillStyle = "rgba(2,6,10,0.42)";
    ctx.beginPath(); ctx.ellipse(px, py + 7 * k, 19 * k, 6 * k, 0, 0, Math.PI * 2); ctx.fill();
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2 + h;
      const raio = 14 + (i % 3) * 1.6;
      const sx = Math.round(px + Math.cos(a) * raio * k);
      const sy = Math.round(py + 5 + Math.sin(a) * 5.4 * k);
      ctx.fillStyle = i % 2 ? pedra.luz : pedra.face;
      ctx.fillRect(sx - 2, sy - 1, 5, 3);
      ctx.fillStyle = "rgba(255,255,255,0.16)";
      ctx.fillRect(sx - 2, sy - 1, 5, 1);
    }
    // degraus, iguais em toda silhueta
    ctx.fillStyle = pedra.escuro;
    ctx.fillRect(px - 12 * k, py + 2 * k, 24 * k, 5 * k);
    ctx.fillStyle = pedra.face;
    ctx.fillRect(px - 10 * k, py - 2 * k, 20 * k, 5 * k);
    ctx.fillStyle = pedra.luz;
    ctx.fillRect(px - 10 * k, py - 2 * k, 20 * k, 1);

    if (estilo === 0) {
      // monólito: fuste alto com tabuleta gravada
      const topo = py - 27 * k;
      ctx.fillStyle = pedra.face;
      ctx.fillRect(px - 8 * k, topo, 16 * k, 25 * k);
      ctx.fillStyle = pedra.luz;
      ctx.fillRect(px - 8 * k, topo, 3 * k, 25 * k);
      ctx.fillStyle = pedra.escuro;
      ctx.fillRect(px + 5 * k, topo, 3 * k, 25 * k);
      ctx.fillStyle = "rgba(255,255,255,0.12)";
      ctx.fillRect(px - 6 * k, topo + 1 * k, 1, 23 * k);
      // tabuleta rebaixada com runas acesas
      ctx.fillStyle = pedra.tinta;
      ctx.fillRect(px - 5 * k, topo + 4 * k, 10 * k, 14 * k);
      ctx.fillStyle = pedra.luz;
      ctx.fillRect(px - 5 * k, topo + 4 * k, 10 * k, 1);
      ctx.fillRect(px - 5 * k, topo + 4 * k, 1, 14 * k);
      ctx.fillStyle = hexA(s.accent, 0.45 + pulso * 0.25);
      for (let i = 0; i < 3; i++) {
        const ry = Math.round(topo + (7 + i * 4) * k);
        ctx.fillRect(Math.round(px - 2 * k), ry, Math.round(4 * k), 1);
        ctx.fillRect(Math.round(px - 2 * k), ry + Math.round(1 * k), Math.round(2 * k), 1);
      }
      // capitel
      ctx.fillStyle = pedra.topo;
      ctx.fillRect(px - 10 * k, topo - 5 * k, 20 * k, 5 * k);
      ctx.fillStyle = pedra.claro;
      ctx.fillRect(px - 10 * k, topo - 5 * k, 20 * k, 1);
      ctx.fillStyle = pedra.tinta;
      ctx.fillRect(px - 10 * k, topo, 20 * k, 1);
      gy = topo - 9 * k;
    } else if (estilo === 1) {
      // cairn: pedras empilhadas, cada uma um pouco menor e torta
      const blocos = [
        [20, 5, -3, pedra.face], [17, 5, -9, pedra.topo], [13, 5, -14, pedra.face], [9, 4, -19, pedra.luz],
      ];
      for (const [larg, alt, dy, cor] of blocos) {
        const desvio = (h - 0.5) * 2;
        ctx.fillStyle = pedra.tinta;
        ctx.fillRect(px - larg / 2 * k + desvio - 1, py + (dy - 1) * k, larg * k + 2, alt * k + 2);
        ctx.fillStyle = cor;
        ctx.fillRect(px - larg / 2 * k + desvio, py + dy * k, larg * k, alt * k);
        ctx.fillStyle = "rgba(255,255,255,0.12)";
        ctx.fillRect(px - larg / 2 * k + desvio + 1, py + dy * k, (larg - 4) * k, 1);
      }
      gy = py - 29 * k;
    } else if (estilo === 2) {
      // pórtico: duas colunas e lintel, sigilo entre elas
      const topo = py - 24 * k;
      for (const lado of [-1, 1]) {
        ctx.fillStyle = pedra.tinta;
        ctx.fillRect(px + lado * 9 * k - 3 * k, topo, 6 * k, 24 * k);
        ctx.fillStyle = pedra.face;
        ctx.fillRect(px + lado * 9 * k - 2 * k, topo + 1 * k, 4 * k, 22 * k);
        ctx.fillStyle = pedra.luz;
        ctx.fillRect(px + lado * 9 * k - 2 * k, topo + 1 * k, 1, 22 * k);
      }
      ctx.fillStyle = pedra.tinta;
      ctx.fillRect(px - 14 * k, topo - 5 * k, 28 * k, 6 * k);
      ctx.fillStyle = pedra.topo;
      ctx.fillRect(px - 13 * k, topo - 4 * k, 26 * k, 4 * k);
      ctx.fillStyle = pedra.claro;
      ctx.fillRect(px - 13 * k, topo - 4 * k, 26 * k, 1);
      // runas no lintel
      ctx.fillStyle = hexA(s.accent, 0.4 + pulso * 0.25);
      for (let i = -2; i <= 2; i++) ctx.fillRect(Math.round(px + i * 4 * k), Math.round(topo - 3 * k), Math.round(2 * k), 1);
      gy = py - 13 * k;
      escalaSigilo = 0.58;
    } else if (estilo === 3) {
      // obelisco: base larga, ponta estreita e capuz de pirâmide
      const base = py - 2 * k;
      for (let i = 0; i < 22; i++) {
        const t = i / 22;
        const larg = (16 - t * 9) * k;
        ctx.fillStyle = i < 2 ? pedra.escuro : pedra.face;
        ctx.fillRect(px - larg / 2, base - i * k, larg, 1);
        ctx.fillStyle = pedra.luz;
        ctx.fillRect(px - larg / 2, base - i * k, Math.max(1, larg * 0.18), 1);
      }
      const topo = base - 22 * k;
      ctx.fillStyle = pedra.topo;
      ctx.beginPath();
      ctx.moveTo(px - 5 * k, topo);
      ctx.lineTo(px, topo - 6 * k);
      ctx.lineTo(px + 5 * k, topo);
      ctx.closePath();
      ctx.fill();
      ctx.fillStyle = hexA(s.accent, 0.5 + pulso * 0.2);
      ctx.fillRect(Math.round(px - 1 * k), Math.round(topo + 4 * k), Math.round(2 * k), Math.round(3 * k));
      gy = topo - 13 * k;
    } else if (estilo === 4) {
      // braços: fuste com barra horizontal no ombro
      const topo = py - 22 * k;
      ctx.fillStyle = pedra.face;
      ctx.fillRect(px - 6 * k, topo, 12 * k, 20 * k);
      ctx.fillStyle = pedra.luz;
      ctx.fillRect(px - 6 * k, topo, 2 * k, 20 * k);
      ctx.fillStyle = pedra.escuro;
      ctx.fillRect(px + 4 * k, topo, 2 * k, 20 * k);
      ctx.fillStyle = pedra.topo;
      ctx.fillRect(px - 14 * k, topo - 2 * k, 28 * k, 4 * k);
      ctx.fillStyle = pedra.claro;
      ctx.fillRect(px - 14 * k, topo - 2 * k, 28 * k, 1);
      // penduricalhos nas pontas dos braços
      ctx.fillStyle = hexA(s.accent, 0.6);
      ctx.fillRect(px - 13 * k, topo + 2 * k, 2 * k, 3 * k);
      ctx.fillRect(px + 11 * k, topo + 2 * k, 2 * k, 3 * k);
      // capitel
      ctx.fillStyle = pedra.face;
      ctx.fillRect(px - 8 * k, topo - 7 * k, 16 * k, 5 * k);
      ctx.fillStyle = pedra.claro;
      ctx.fillRect(px - 8 * k, topo - 7 * k, 16 * k, 1);
      gy = topo - 16 * k;
      escalaSigilo = 0.62;
    } else {
      // anel: pedestal baixo e um círculo de pedra com o sigilo dentro
      const anelY = py - 18 * k;
      ctx.fillStyle = pedra.face;
      ctx.fillRect(px - 7 * k, py - 8 * k, 14 * k, 10 * k);
      ctx.fillStyle = pedra.luz;
      ctx.fillRect(px - 7 * k, py - 8 * k, 2 * k, 10 * k);
      ctx.fillStyle = pedra.tinta;
      ctx.fillRect(px + 5 * k, py - 8 * k, 2 * k, 10 * k);
      ctx.strokeStyle = pedra.topo;
      ctx.lineWidth = Math.max(2, 3 * k);
      ctx.beginPath();
      ctx.ellipse(px, anelY, 11 * k, 10 * k, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.strokeStyle = pedra.claro;
      ctx.lineWidth = Math.max(1, 1 * k);
      ctx.beginPath();
      ctx.ellipse(px, anelY - 1 * k, 11 * k, 10 * k, 0, Math.PI * 1.1, Math.PI * 1.9);
      ctx.stroke();
      ctx.fillStyle = hexA(s.accent, 0.35 + pulso * 0.2);
      for (let i = 0; i < 4; i++) {
        const a = (i / 4) * Math.PI * 2;
        ctx.fillRect(Math.round(px + Math.cos(a) * 11 * k) - 1, Math.round(anelY + Math.sin(a) * 10 * k) - 1, 2, 2);
      }
      gy = anelY;
      escalaSigilo = 0.54;
    }

    // enfeite de base: vela, pedras ou capim, sorteado por estação
    if (enfeite === 0) {
      for (const lado of [-1, 1]) {
        ctx.fillStyle = "#d9cbb0";
        ctx.fillRect(px + lado * 15 * k - 1, py + 1 * k, 2, Math.round(3 * k));
        ctx.fillStyle = hexA("#ffc857", 0.7 + pulso * 0.3);
        ctx.fillRect(px + lado * 15 * k - 1, py - 1 * k, 1, 1);
      }
    } else if (enfeite === 1) {
      ctx.fillStyle = pedra.luz;
      ctx.fillRect(Math.round(px - 17 * k), py + 4 * k, 3, 2);
      ctx.fillRect(Math.round(px + 14 * k), py + 6 * k, 4, 2);
      ctx.fillStyle = pedra.face;
      ctx.fillRect(Math.round(px + 12 * k), py + 5 * k, 2, 1);
    } else {
      ctx.fillStyle = "#4b7a5c";
      ctx.fillRect(Math.round(px - 13 * k), py + 6 * k, 2, Math.round(3 * k));
      ctx.fillRect(Math.round(px - 11 * k), py + 7 * k, 1, Math.round(2 * k));
      ctx.fillRect(Math.round(px + 10 * k), py + 6 * k, 2, Math.round(3 * k));
    }
    // musgo em toda base
    ctx.fillStyle = "#4b7a5c";
    ctx.fillRect(Math.round(px - 6 * k), py + 7 * k, 2, 1);
    ctx.fillRect(Math.round(px + 5 * k), py + 7 * k, 2, 1);
    // sigilo: o desenho da pedra flutua no ponto que cada silhueta reservou
    ctx.globalAlpha = 0.45 + pulso * 0.4;
    ctx.drawImage(glowSprite(s.accent), px - 17 * k, gy - 17 * k, 34 * k, 34 * k);
    ctx.globalAlpha = 0.92;
    drawStationIcon(s.icon, px, gy, time, s.accent, escalaSigilo * k);
    ctx.globalAlpha = 1;
    // vaga-lumes: três pontos girando devagar em volta do alto
    for (let i = 0; i < 3; i++) {
      const a = time * 0.0006 + h * 6 + (i / 3) * Math.PI * 2;
      ctx.fillStyle = hexA(s.accent, 0.35 + Math.sin(a * 3) * 0.2);
      ctx.fillRect(Math.round(px + Math.cos(a) * 14 * k), Math.round(gy - 6 * k + Math.sin(a) * 7 * k), 1, 1);
    }
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

  // Soleira de cada casa: degrau de pedra na entrada, com as runas da área
  // gravadas como número de porta. Sem montante: a casa já tem batente na arte.
  function drawSoleira(casa) {
    const px = Math.round(casa.door.x * TILE);
    const baseY = Math.round(casa.door.y * TILE + 1);
    const accent = BIOMES[casa.bioma]?.accent || "#ffc857";
    ctx.fillStyle = "rgba(2,6,10,0.35)";
    ctx.beginPath();
    ctx.ellipse(px, baseY + 4, 17, 4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = "#292338";
    ctx.fillRect(px - 15, baseY - 1, 30, 5);
    ctx.fillStyle = "#5b546c";
    ctx.fillRect(px - 14, baseY - 1, 28, 3);
    ctx.fillStyle = "#8a8399";
    ctx.fillRect(px - 14, baseY - 1, 28, 1);
    // pedras laterais um pouco mais baixas, para o degrau não virar tarima
    ctx.fillStyle = "#3b3448";
    ctx.fillRect(px - 18, baseY + 1, 4, 3);
    ctx.fillRect(px + 14, baseY + 1, 4, 3);
    // runas da área na soleira, como um número de porta
    ctx.globalAlpha = 0.9;
    ctx.fillStyle = accent;
    ctx.fillRect(px - 5, baseY + 0, 2, 2);
    ctx.fillRect(px - 1, baseY + 0, 2, 2);
    ctx.fillRect(px + 3, baseY + 0, 2, 2);
    ctx.globalAlpha = 1;
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
  // A pessoa do vale recebe o mesmo acabamento dos bichos: contorno escuro de
  // um pixel e véu de luz. O boneco e o objeto da mão são desenhados num canvas
  // com folga, recebem o traço e voltam ao mundo no lugar de sempre.
  let pincelA = null;
  let pincelB = null;
  function desenharComAcabamento(px, py, larg, alt, ox, oy, desenhar, poseKey = null) {
    if(poseKey){
      const pose=spritePose(poseKey,larg,alt,g=>{g.translate(ox,oy);desenhar(g);});
      ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(pose,px-ox,py-oy);ctx.restore();return true;
    }
    if (typeof document === "undefined") return false;
    if (!pincelA) {
      pincelA = document.createElement("canvas");
      pincelB = document.createElement("canvas");
      pincelA.width = 72; pincelA.height = 84;
      pincelB.width = 72; pincelB.height = 84;
    }
    if (larg > pincelA.width || alt > pincelA.height) return false;
    const a = pincelA.getContext("2d");
    const b = pincelB.getContext("2d");
    if (!a || !b) return false;
    a.setTransform(1, 0, 0, 1, 0, 0);
    a.clearRect(0, 0, larg, alt);
    a.imageSmoothingEnabled = false;
    a.save();
    a.translate(ox, oy);
    desenhar(a);
    a.restore();
    a.save();
    a.globalCompositeOperation = "source-atop";
    const grad = a.createLinearGradient(0, Math.max(0, oy - 44), 0, oy + 2);
    grad.addColorStop(0, "rgba(255,255,255,0.16)");
    grad.addColorStop(0.5, "rgba(255,255,255,0)");
    grad.addColorStop(1, "rgba(0,0,0,0.28)");
    a.fillStyle = grad;
    a.fillRect(0, 0, larg, alt);
    a.globalCompositeOperation = "source-over";
    a.restore();
    b.setTransform(1, 0, 0, 1, 0, 0);
    b.clearRect(0, 0, larg, alt);
    b.globalCompositeOperation = "source-over";
    b.drawImage(pincelA, 0, 0);
    b.globalCompositeOperation = "source-in";
    b.fillStyle = "rgba(5,7,16,0.9)";
    b.fillRect(0, 0, larg, alt);
    b.globalCompositeOperation = "source-over";
    ctx.save();
    ctx.imageSmoothingEnabled = false;
    ctx.translate(px, py);
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      ctx.drawImage(pincelB, -ox + dx, -oy + dy);
    }
    ctx.drawImage(pincelA, -ox, -oy);
    ctx.restore();
    return true;
  }

  function drawNpcComAcabamento(npc, px, py, bob, time, colors) {
    const tick=artTick(time+(npc.bob||0)*40,100);
    const key=JSON.stringify(['npc',npc.id,npc.facing,!!npc.moving,npc.look,colors,npc.role,npc.subject,npc.scale,tick]);
    const pose=spritePose(key,72,84,g=>{
      g.translate(36,70);
      // o posto entra no desenho: cada NPC tem o gesto do seu papel, e o
      // deslocamento de tempo pelo `bob` impede a praça de gestuar em uníssono
      drawHuman(g,0,0,npc.facing||0,!!npc.moving,tick*100+(npc.bob||0)*4000,colors,npc.scale||.9,npc.look||null,null,npc.role||null);
      drawNpcKit(g,npc,0,0,0,tick*100,colors);
    });
    ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(pose,px-36,py+bob-70);ctx.restore();return true;
  }

  function drawNpc(npc, time) {
    const px = npc.x * TILE, py = npc.y * TILE;
    // respiração irregular: dois senos de períodos diferentes, sem ninguém
    // respirando no mesmo compasso
    const bob = Math.sin(time * 0.0013 + npc.bob) * 0.8 + Math.sin(time * 0.0007 + npc.bob * 2.3) * 0.5;
    const colors = npc.colors || { skin: "#d9b08c", hair: "#4a3a55", shirt: npc.accent, pants: "#2f2c45" };
    if (!drawNpcComAcabamento(npc, px, py, bob, time, colors)) {
      drawHuman(ctx, px, py + bob, npc.facing || 0, !!npc.moving, time, colors, npc.scale || 0.9, npc.look || null, null, npc.role || null);
      drawNpcKit(ctx, npc, px, py, bob, time, colors);
    }
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
    drawPetSprite(ctx, cat.kind || "cat", cat.x * TILE, cat.y * TILE, time, moving, cat.facing ?? 0);
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
    // LRU de 48 blocos de 16x16 tiles: a vista pede 12, então 48 dá folga e
    // prende a memória em ~12,6 MB.
    while (chunkCache.size >= 48) {
      const oldest = chunkCache.keys().next().value;
      if (oldest === undefined) break;
      chunkCache.delete(oldest);
    }
    chunkCache.set(key, canvasChunk);
    return canvasChunk;
  }

  function drawWaterMagma(x, y, t, time) {
    drawGroundOn(ctx, x, y, t, time, true);
    // brilho de meio pixel viajando: a água ganha uma segunda camada fina
    const px = x * TILE, py = y * TILE;
    const fase = (time * 0.0007 + hash2(x, y)) % 1;
    const cor = t === K.WATER ? "rgba(200,240,255,0.22)" : "rgba(255,150,80,0.18)";
    ctx.fillStyle = cor;
    ctx.fillRect(px + fase * 13, py + 3.5 + hash2(y, x) * 5, 2, 0.5);
    ctx.fillStyle = t === K.WATER ? "rgba(255,255,255,0.10)" : "rgba(255,220,150,0.10)";
    ctx.fillRect(px + ((fase + 0.45) % 1) * 13, py + 9.5, 1.5, 0.5);
  }

  function draw(now, player, peers, npcs, cat, moving, rastreador = false, vitais = null, cena = null) {
    const frameStart = performance.now();
    const time = artTime(now);
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

    const vista = tilesNaVista(camX, camY, viewW, viewH, MAP_W, MAP_H, 1);
    const { x0, y0, x1, y1 } = vista;

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
    // detalhe de meio pixel do chão, ao vivo e em três passadas de cor: o
    // chão ganha quatro pixels de desenho por pixel antigo sem inflar o cache
    const detalhe = (cor, semente, tamanho) => {
      ctx.fillStyle = cor;
      for (let y = y0; y <= y1; y++) {
        for (let x = x0; x <= x1; x++) {
          const t = world.get(x, y);
          if (t === K.TREE || t === K.WALL || t === K.WATER || t === K.MAGMA) continue;
          const h = hash2(x * 29 + semente, y * 31 + semente * 3);
          if (h < 0.22) continue;
          const px = x * TILE + 0.5 + hash2(x + semente, y + 3) * 15;
          const py = y * TILE + 0.5 + hash2(x + 5, y + semente) * 15;
          ctx.fillRect(px, py, tamanho, tamanho * 0.5);
        }
      }
    };
    detalhe("rgba(0,0,0,0.10)", 7, 1);
    detalhe("rgba(255,255,255,0.07)", 13, 0.5);
    stats.tiles = (x1 - x0 + 1) * (y1 - y0 + 1);
    stats.chunks = chunks;

    // o anel da caçada só entra se o centro dela está perto da tela
    for (const h of world.hunters) {
      if (h.center.x < x0 - 4 || h.center.x > x1 + 4 || h.center.y < y0 - 4 || h.center.y > y1 + 4) continue;
      drawHunterRing(h, time);
    }
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
    // camada de ambiente: decalque de chão entra chapado agora, antes de quem
    // tem volume; o resto entra na fila ordenada por y, como o decor
    let assetsVisiveis = 0;
    for (const a of world.ambiente || []) {
      if (a.x * TILE < camX - 80 || a.x * TILE > camX + viewW + 80 ||
          a.y * TILE < camY - 80 || a.y * TILE > camY + viewH + 80) continue;
      if (a.camada === "chao") {
        if (desenharAsset(ctx, a.tipo, a.x * TILE, a.y * TILE, {
          tempo: time, bioma: BIOMES[a.bioma], seed: hash2(a.x * 7, a.y * 3), camada: "chao",
        })) assetsVisiveis++;
        continue;
      }
      drawables.push({
        y: (a.y + 0.5) * TILE,
        fn: () => {
          const px = a.x * TILE;
          const py = a.y * TILE + TILE / 2;
          // fogo acende o chão em volta: o brilho pulsa e some no escuro
          if (a.tipo === "fogueira" || a.tipo === "braseiro") {
            ctx.save();
            ctx.globalAlpha = 0.5 + Math.sin(time * 0.005 + a.x * 3) * 0.12;
            ctx.drawImage(glowSprite("#ff9a55"), px - 36, py - 44);
            ctx.restore();
          }
          // só vegetação verga com o vento: cabana, torre e barril ficam
          // parados, senão a construção inteira balança como árvore
          const vegetal = assetDe(a.tipo)?.grupo === "vegetacao";
          const inclinacao = vegetal ? swayAt(a.x, a.y, time, moodAtual) * 0.03 : 0;
          if (desenharAsset(ctx, a.tipo, px, py, {
            tempo: time, bioma: BIOMES[a.bioma], seed: hash2(a.x * 5, a.y * 11), inclinacao,
          })) assetsVisiveis++;
        },
      });
    }
    stats.assets = 0;
    // mobília da casa: entra na mesma fila por y do ambiente, mas sem balanço
    // de vento e com o brilho do fogo, porque aqui dentro não venta
    for (const a of world.interiorProps || []) {
      if (a.x * TILE < camX - 80 || a.x * TILE > camX + viewW + 80 ||
          a.y * TILE < camY - 80 || a.y * TILE > camY + viewH + 80) continue;
      drawables.push({
        y: (a.y + 0.5) * TILE,
        fn: () => {
          const px = a.x * TILE;
          const py = a.y * TILE + TILE / 2;
          if (a.tipo === "fogueira" || a.tipo === "braseiro") {
            ctx.save();
            ctx.globalAlpha = 0.5 + Math.sin(time * 0.005 + a.x * 3) * 0.12;
            ctx.drawImage(glowSprite("#ff9a55"), px - 36, py - 44);
            ctx.restore();
          }
          if (a.tipo === "morador") {
            ctx.fillStyle = "rgba(2,6,10,0.34)";
            ctx.beginPath();
            ctx.ellipse(px, py + 1, 9, 3, 0, 0, Math.PI * 2);
            ctx.fill();
            drawHuman(ctx, px, py, a.dir || 0, false, time, a.colors, a.scale || 0.9, a.look || null);
            return;
          }
          if (desenharAsset(ctx, a.tipo, px, py, {
            tempo: time, bioma: BIOMES[a.bioma], seed: hash2(a.x * 3, a.y * 7),
          })) assetsVisiveis++;
        },
      });
    }
    const onScreen = (wx, wy, pad = 48) => {
      const px = wx * TILE;
      const py = wy * TILE;
      return px > camX - pad && px < camX + viewW + pad && py > camY - pad && py < camY + viewH + pad;
    };
    // a soleira fica na frente da fachada, alinhada com o centro da porta
    for (const casa of world.casas) {
      if (!onScreen(casa.door.x, casa.door.y, 60)) continue;
      drawables.push({ y: casa.door.y * TILE + 4, fn: () => drawSoleira(casa) });
    }
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
      if (!onScreen(p.rx ?? p.x, p.ry ?? p.y, 48)) continue;
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
        const heroTick=artTick(time,moving?70:120);
        const heroKey=JSON.stringify(['hero',player.dir,!!moving,onShip,player.colors,player.look,player.gear,heroTick]);
        const desenhaHeroi = (g) => drawHuman(g, 0, 0, player.dir, onShip ? false : moving, heroTick*(moving?70:120),
          player.colors || PLAYER_COLORS[0], 1, player.look, player.gear || null);
        if (!desenharComAcabamento(player.x * TILE, player.y * TILE - lift + bob, 72, 84, 36, 70, desenhaHeroi, heroKey)) {
          drawHuman(ctx, player.x * TILE, player.y * TILE - lift + bob, player.dir, onShip ? false : moving, time,
            player.colors || PLAYER_COLORS[0], 1, player.look, player.gear || null);
        }
        drawNameTag(player.name, player.x * TILE, player.y * TILE - 36 - lift, player.color, vitais);
        if (player.bubble && player.bubble.until > now) {
          drawBubble(player.bubble.text, player.x * TILE, player.y * TILE - lift, player.color);
        }
      },
    });
    jogadorAtual = player;
    drawables.sort((a, b) => a.y - b.y).forEach((d) => d.fn());
    stats.assets = assetsVisiveis;

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

    if (!modoLeve) drawAmbient(areaJogador, time, camX, camY, viewW, viewH, cena);
    // véu da noite: por cima do mundo, abaixo do HUD (que é DOM)
    const faseDia = faseDoDia(time);
    if (faseDia.alpha > 0.02) {
      ctx.save();
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.fillStyle = faseDia.cor;
      ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
      ctx.restore();
    }
    // casa por dentro: o mar em volta não aparece, a sala fica como um recorte
    // iluminado no escuro, com a parede comendo a luz nas bordas
    if (cena?.interior) {
      const sala = cena.interior;
      const rx = sala.x * TILE, ry = sala.y * TILE;
      const rw = sala.w * TILE, rh = sala.h * TILE;
      ctx.fillStyle = padraoDaCasa() || "#03050c";
      ctx.beginPath();
      ctx.rect(camX - 8, camY - 8, viewW + 16, viewH + 16);
      ctx.rect(rx, ry, rw, rh);
      ctx.fill("evenodd");
      const luz = ctx.createLinearGradient(0, ry, 0, ry + rh);
      luz.addColorStop(0, "rgba(3,5,12,0.62)");
      luz.addColorStop(0.16, "rgba(3,5,12,0)");
      luz.addColorStop(0.84, "rgba(3,5,12,0)");
      luz.addColorStop(1, "rgba(3,5,12,0.44)");
      ctx.fillStyle = luz;
      ctx.fillRect(rx, ry, rw, rh);
    }
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

  function drawNameTag(name, px, py, color, vitais = null) {
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
    // barrinhas de vida e mana logo abaixo do nome, do tamanho da placa
    if (vitais) {
      const f = fracoesDeVida(vitais);
      const larg = w, alto = 2, folga = 1;
      const topo = py + 1;
      ctx.fillStyle = "rgba(8,10,20,0.78)";
      roundRect(ctx, px - larg / 2, topo, larg, alto * 2 + folga * 3, 2);
      ctx.fill();
      ctx.fillStyle = "#3a1f2c";
      ctx.fillRect(px - larg / 2 + 1, topo + folga, larg - 2, alto);
      ctx.fillStyle = "#ff5a86";
      ctx.fillRect(px - larg / 2 + 1, topo + folga, Math.round((larg - 2) * f.vida), alto);
      ctx.fillStyle = "#16283a";
      ctx.fillRect(px - larg / 2 + 1, topo + folga * 2 + alto, larg - 2, alto);
      ctx.fillStyle = "#6bd5ff";
      ctx.fillRect(px - larg / 2 + 1, topo + folga * 2 + alto, Math.round((larg - 2) * f.mana), alto);
    }
  }

  const { drawAmbient, relogioAmbiente } = createAmbientRenderer(ctx);

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
    mctx.rotate(directionAngle(dir) + Math.PI / 2);
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
  // troca de cena (casa, caverna, viagem): o próximo quadro centra a câmera de
  // uma vez em vez de deslizar o mapa inteiro
  function snap() { rendererReady = false; }

  resize();
  window.addEventListener("resize", resize);
  return {
    draw, resize, kick, snap, stats, ambiente: relogioAmbiente, setModoLeve, get modoLeve() { return modoLeve; },
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
    // arrasto no mapa: converte pixel de tela em tile e solta a câmera.
    // O sinal é o do "agarrar e puxar": arrastar para a direita traz o mapa
    // para a direita (a janela anda para a esquerda), e não o contrário.
    miniPanBy(dx, dy) {
      if (!MINI_SCALES[miniIndex]) return false;
      const view = miniView();
      const k = (view.srcW / view.DW) / 2;
      miniFollow = false;
      miniPan.x -= dx * k;
      miniPan.y -= dy * k;
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

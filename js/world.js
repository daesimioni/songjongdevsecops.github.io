import { facingDirection } from "./movement.js";
import {
  MAP_W, MAP_H, TILE, TILE_KIND as K, SOLID, CONTINENTS, AREAS, SITES,
  WAYSTONES, NPC_SPAWNS, CAT_SPAWN, REVEAL_RADIUS, PLAYER_W, PLAYER_H, SPAWN,
} from "./config.js";
import { GROUNDS } from "./rpg-data.js";
import { dungeonById } from "./dungeon-data.js";
import { CATALOG_CONTENT } from "./catalog-gen.js";
import { espalharAmbiente } from "./assets/povoado.js";
import { tamanhoDoAsset } from "./assets/index.js";
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
        // Elipse (grau 2), não superelipse (grau 4): o grau 4 desenhava um
        // retângulo de cantos arredondados, e era isso que deixava a ilha
        // quadrada. A costa come para dentro com duas oitavas de ruído, então
        // aparecem enseadas e pontas sem estourar a caixa da área.
        // o grau e a força da enseada mudam por ilha: duas áreas vizinhas não
        // têm a mesma silhueta
        const grau = 2 + hash2(Math.round(cx), Math.round(cy)) * 0.8;
        const forca = 0.09 + hash2(Math.round(cx) + 3, Math.round(cy) + 7) * 0.1;
        const d = Math.pow(Math.abs(nx), grau) + Math.pow(Math.abs(ny), grau);
        const costa = hash2(x * 3 + 11, y * 5 + 7);
        const enseada = hash2(Math.floor(x / 4) * 7 + 3, Math.floor(y / 4) * 5 + 1);
        const edge = 1 - (costa * forca + enseada * forca * 1.6);
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
  // Caminho torto: anda um tile por vez, trocando de eixo conforme o que falta
  // e com uma tremida sorteada pela posição, então a estrada curva em vez de
  // fazer um L reto igual em todo lugar. Larga no meio e estreita nas pontas,
  // e nunca cobre água: rio continua rio.
  function connect(a, b, tile, largura = 2) {
    let x = Math.round(a.x);
    let y = Math.round(a.y);
    const alvoX = Math.round(b.x);
    const alvoY = Math.round(b.y);
    const semente = (x * 31 + y * 17 + alvoX * 7 + alvoY * 13) | 0;
    const pinta = (px, py, w) => {
      for (let dx = 0; dx < w; dx++) {
        for (let dy = 0; dy < w; dy++) {
          const nx = px + dx;
          const ny = py + dy;
          if (nx < 1 || ny < 1 || nx >= MAP_W - 1 || ny >= MAP_H - 1) continue;
          // atravessar água vira ponte: a estrada não pisa no mar, ela passa
          // por cima, e a água embaixo continua água
          set(nx, ny, get(nx, ny) === WATER ? BRIDGE : tile);
        }
      }
    };
    let voltas = 0;
    while ((x !== alvoX || y !== alvoY) && voltas++ < 400) {
      const faltaX = alvoX - x;
      const faltaY = alvoY - y;
      const r = hash2(x + semente, y - semente);
      const prefereX = Math.abs(faltaX) >= Math.abs(faltaY);
      const vira = r > 0.82 && faltaX !== 0 && faltaY !== 0;
      if ((prefereX && !vira) || faltaY === 0) x += Math.sign(faltaX);
      else if (faltaY !== 0) y += Math.sign(faltaY);
      else x += Math.sign(faltaX);
      const perto = Math.min(
        Math.abs(x - Math.round(a.x)) + Math.abs(y - Math.round(a.y)),
        Math.abs(x - alvoX) + Math.abs(y - alvoY),
      );
      const w = perto < 1 ? 1 : r > 0.88 ? largura + 1 : largura;
      pinta(x, y, w);
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
  // Passagem entre áreas vizinhas: nem tudo é ponte sobre o mar. Metade dos
  // pares vira istmo de terra, com piso do bioma das duas pontas, franja de
  // areia e trilha no meio; a outra metade continua ponte. Assim o arquipélago
  // tem continente de verdade, não só mar com tábuas.
  const passagens = [];
  {
    const ready = new Set(AREAS.map((a) => a.id));
    const spotOf = new Map(CATALOG_AREAS.map((spot) => [spot.id, spot]));
    const areaDe = (id) => AREAS.find((x) => x.id === id);
    for (const [a, b] of CATALOG_BRIDGES) {
      if (!ready.has(a) || !ready.has(b)) continue;
      const pa = spotOf.get(a), pb = spotOf.get(b);
      if (!pa || !pb) continue;
      const dx = pb.cx - pa.cx, dy = pb.cy - pa.cy;
      const len = Math.hypot(dx, dy) || 1;
      const ux = dx / len, uy = dy / len;
      const edge = (land) => land
        ? 1 / Math.sqrt((ux / land.rx) ** 2 + (uy / land.ry) ** 2)
        : 10;
      const la = areaDe(a), lb = areaDe(b);
      // começa e termina dentro da borda da ilha: passagem não deixa fresta
      const startA = Math.max(1, edge(la?.land) - 0.9);
      const startB = Math.max(1, edge(lb?.land) - 0.9);
      const ax = pa.cx + ux * startA, ay = pa.cy + uy * startA;
      const bx = pb.cx - ux * startB, by = pb.cy - uy * startB;
      const semente = (pa.cx * 31 + pa.cy * 17 + pb.cx * 7 + pb.cy * 13) | 0;
      const istmo = (semente >>> 0) % 100 < 54;
      if (!istmo) {
        bridgeLine(ax, ay, bx, by, 3, BRIDGE);
        rect(Math.round(pa.cx + ux * 9) - 1, Math.round(pa.cy + uy * 9) - 1, 3, 3, la?.base ?? 12);
        rect(Math.round(pb.cx - ux * 9) - 1, Math.round(pb.cy - uy * 9) - 1, 3, 3, lb?.base ?? 12);
        continue;
      }
      // istmo: largura varia, franja de areia, trilha de 3 tiles no eixo
      const len2 = Math.hypot(bx - ax, by - ay) || 1;
      const ux2 = (bx - ax) / len2, uy2 = (by - ay) / len2;
      const nx = -uy2, ny = ux2;
      const passos = Math.ceil(len2 * 1.4);
      const pontos = [];
      for (let i = 0; i <= passos; i++) {
        const t = i / passos;
        // eixo torto: a passagem serpenteia em vez de sair em linha reta
        const desvio = Math.sin(t * Math.PI * 2 + semente * 0.7) * 1.6 + Math.sin(t * Math.PI * 5 - semente) * 0.6;
        const cx = ax + ux2 * len2 * t + nx * desvio;
        const cy = ay + uy2 * len2 * t + ny * desvio;
        const afina = 0.7 + Math.sin(t * Math.PI) * 0.45;
        const ruido = Math.sin((i + semente) * 0.83) * 0.7 + Math.sin((i - semente) * 0.31) * 0.9;
        const meia = Math.max(2, Math.round((3.1 + ruido) * afina));
        for (let k = -meia; k <= meia; k++) {
          const x = Math.round(cx + nx * k);
          const y = Math.round(cy + ny * k);
          const dist = Math.abs(k);
          let tile;
          if (dist <= 1) tile = K.STONE;
          else if (dist === meia) tile = SAND;
          else if (t < 0.38) tile = la?.floor ?? 13;
          else if (t > 0.62) tile = lb?.floor ?? 13;
          // meio da passagem: piso do vizinho mesclado por dither, para a
          // troca de bioma aparecer em vez de virar uma faixa chapada
          else if (hash2(x, y) < 0.5) tile = la?.floor ?? 13;
          else tile = lb?.floor ?? 13;
          set(x, y, tile);
        }
        if (i % 6 === 0) pontos.push({ x: cx, y: cy, nx, ny, meia, bioma: t < 0.5 ? a : b });
        if (i % 14 === 7) {
          const lado = i % 28 === 7 ? 1 : -1;
          const lx = cx + nx * (meia - 0.2) * lado;
          const ly = cy + ny * (meia - 0.2) * lado;
          const lt = get(Math.floor(lx), Math.floor(ly));
          if (lt !== WATER && lt !== K.WALL && lt !== PATH && lt !== PLAZA && lt !== BRIDGE) {
            decor.push({
              type: "lamp",
              x: lx,
              y: ly,
              accent: (t < 0.5 ? la : lb)?.accent || "#ffc857",
            });
          }
        }
      }
      passagens.push({ a, b, pontos });
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

  // o porto é o cartão de visitas e a régua de carinho: guindaste no cais,
  // sino na praça, caixotes, mastro e gaivotas sobre a água. Antes ele era
  // praça vazia com enfeite sorteado.
  const PORTO = [
    ["crane", 97.5, 62.5], ["bell", 92.5, 58.5],
    ["crate", 97.5, 65.5], ["crate", 98.5, 65.5],
    ["mast", 98.5, 55.5],
    ["gull", 102.5, 58.5], ["gull", 104.5, 63.5], ["gull", 100.5, 52.5],
  ];
  for (const [tipo, px, py] of PORTO) {
    decor.push({ type: tipo, x: px, y: py, accent: "#ffc857", hue: hash2(Math.floor(px), Math.floor(py)) });
  }

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

  // ---- praça do farol: toda ilha tem um centro ----
  // O enfeite solto dava mediana de 5 peças por ilha, sem centro e sem eixo.
  // A praça é montada em volta da pedra do farol: peça central do material do
  // chão, quatro lâmpadas nas diagonais, dois bancos no eixo, duas placas, e
  // quatro canteiros com o enfeite do assunto da área.
  const PLAZA_FOCAL = {
    giz: "orb", "ardósia": "pillar", papel: "book", pergaminho: "book", tinta: "book",
    cobre: "terminal", "latão": "speaker", ferro: "pillar",
    "silício": "terminal", vidro: "crystal", cristal: "crystal", obsidiana: "crystal",
    "âmbar": "flask", "cerâmica": "flask", fibra: "bubble", "ébano": "note",
  };
  const PLAZA_PLANTA = ["star", "petal", "bubble", "node", "shard", "mushroom"];
  const canteiro = new Set();
  for (const d of decor) canteiro.add(key(Math.floor(d.x), Math.floor(d.y)));
  let pracaW = null;
  const chaoDePraca = (x, y) => {
    const t = get(x, y);
    if (t === WATER || t === TREE || t === K.WALL || t === PATH || t === BRIDGE) return false;
    if (canteiro.has(key(x, y))) return false;
    // a volta da pedra fica livre: sem isso um banco desviado fecha o anel e
    // o caminho até o farol deixa de existir (o A* só procura início em raio 1)
    if (pracaW && Math.hypot(x + 0.5 - pracaW.x, y + 0.5 - pracaW.y) < 2.1) return false;
    for (const s of SITES) if (Math.hypot(s.x - x - 0.5, s.y - y - 0.5) < 1.7) return false;
    for (const n of NPC_SPAWNS) if (Math.hypot(n.x - x - 0.5, n.y - y - 0.5) < 1.7) return false;
    return true;
  };
  const por = (x, y, tipo, accent) => {
    if (!chaoDePraca(x, y)) return false;
    canteiro.add(key(x, y));
    // enfeite de praça é fino: fica no chão e o corpo passa por cima. Com
    // caixa, o anel de banco e lâmpada virava cerca e o A* com folga deixava
    // de achar a saída da ilha.
    const placa = tipo === "sign" ? { text: "Praça do farol" } : {};
    decor.push({ type: tipo, x: x + 0.5, y: y + 0.5, accent, hue: hash2(x, y), fino: true, ...placa });
    return true;
  };
  // ilha pequena tem canto no mar: o ponto exato é o preferido, mas a peça
  // aceita um desvio de até dois tiles em volta para caber na praça
  const porPerto = (x, y, tipo, accent) => {
    if (por(x, y, tipo, accent)) return true;
    for (let r = 1; r <= 2; r++) {
      for (const [dx, dy] of [[-r, 0], [r, 0], [0, -r], [0, r], [-r, -r], [r, -r], [-r, r], [r, r]]) {
        if (por(x + dx, y + dy, tipo, accent)) return true;
      }
    }
    return false;
  };
  for (const stone of CATALOG_CONTENT.waystones) {
    const area = areaAtTile(Math.round(stone.x), Math.round(stone.y));
    const bioma = area ? BIOMES[area.id] : null;
    const accent = bioma?.accent || stone.accent || "#ffc857";
    const tipos = area ? (catalogDecor[area.id] || []) : [];
    const wx = Math.round(stone.x);
    const wy = Math.round(stone.y);
    pracaW = { x: wx + 0.5, y: wy + 0.5 };
    // o chão da praça é o piso da própria área, não grama com enfeite em cima:
    // um disco de raio 3 em volta do farol, sem tocar água nem árvore
    if (area) {
      for (let dy = -3; dy <= 3; dy++) {
        for (let dx = -3; dx <= 3; dx++) {
          if (dx * dx + dy * dy > 10) continue;
          const tx = wx + dx;
          const ty = wy + dy;
          const t = get(tx, ty);
          if (t === WATER || t === TREE || t === K.WALL) continue;
          set(tx, ty, area.floor);
        }
      }
    }
    // o farol precisa de saída: as oito direções de raio 2 e 3 ficam limpas
    // antes de a praça crescer, senão um enfeite sorteado fecha o anel
    const saidas = [[0, -2], [0, 2], [-2, 0], [2, 0], [0, -3], [0, 3], [-3, 0], [3, 0], [-2, -2], [2, -2], [-2, 2], [2, 2]];
    for (const [dx, dy] of saidas) {
      const kx = wx + dx;
      const ky = wy + dy;
      for (let i = decor.length - 1; i >= 0; i--) {
        if (Math.floor(decor[i].x) === kx && Math.floor(decor[i].y) === ky) decor.splice(i, 1);
      }
      canteiro.delete(key(kx, ky));
    }
    const antes = decor.length;
    // a peça central vem do material da pedra: giz pede orbe, vidro pede
    // cristal. Se o norte do farol é mar, tenta os outros lados antes de
    // desistir: ilha pequena não fica sem centro.
    const focal = PLAZA_FOCAL[bioma?.material] || "pillar";
    let achouFocal = false;
    for (const [fx, fy] of [[0, -4], [0, 4], [-4, 0], [4, 0], [0, -5], [-5, 0], [5, 0], [0, 5]]) {
      if (porPerto(wx + fx, wy + fy, focal, accent)) { achouFocal = true; break; }
    }
    for (const [dx, dy] of [[-3, -3], [3, -3], [-3, 3], [3, 3]]) porPerto(wx + dx, wy + dy, "lamp", accent);
    for (const [dx, dy] of [[0, 4], [4, 0], [-4, 0]]) porPerto(wx + dx, wy + dy, "bench", accent);
    for (const [dx, dy] of [[-2, 4], [2, 4], [0, -5]]) porPerto(wx + dx, wy + dy, "sign", accent);
    let giro = 0;
    for (const [dx, dy] of [[-5, -2], [5, -2], [-5, 2], [5, 2]]) {
      const tipo = tipos.length ? tipos[giro++ % tipos.length] : PLAZA_PLANTA[giro++ % PLAZA_PLANTA.length];
      porPerto(wx + dx, wy + dy, tipo, accent);
    }
    for (const [dx, dy] of [[-5, -4], [5, -4]]) {
      porPerto(wx + dx, wy + dy, PLAZA_PLANTA[giro++ % PLAZA_PLANTA.length], accent);
    }
    // ilha estreita recusa metade dos postos fixos. Varre o anel até a praça
    // ter doze peças, que é o mínimo da régua do porto.
    const contaNaArea = () => decor.reduce((n, d) => n + (d.x >= area.rect.x && d.x < area.rect.x + area.rect.w && d.y >= area.rect.y && d.y < area.rect.y + area.rect.h ? 1 : 0), 0);
    for (let r = 2.6; r <= 7 && contaNaArea() < 12; r += 0.8) {
      for (let i = 0; i < 24 && contaNaArea() < 12; i++) {
        const a = (i / 24) * Math.PI * 2;
        const tipo = PLAZA_PLANTA[(giro++) % PLAZA_PLANTA.length];
        porPerto(wx + Math.round(Math.cos(a) * r), wy + Math.round(Math.sin(a) * r), tipo, accent);
      }
    }
    // e o centro nunca fica sem peça: último recurso, o anel inteiro
    if (!achouFocal) {
      for (let r = 2.4; r <= 8 && !achouFocal; r += 0.7) {
        for (let i = 0; i < 24 && !achouFocal; i++) {
          const a = (i / 24) * Math.PI * 2;
          if (porPerto(wx + Math.round(Math.cos(a) * r), wy + Math.round(Math.sin(a) * r), focal, accent)) achouFocal = true;
        }
      }
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

  // ---- camada de ambiente: vegetação, construção, fogo, água e props ----
  // A mesma regra em toda ilha, com a paleta e o material do bioma. Tudo é
  // preso a tile macio, longe de caminho, praça, estação e pedra; a malha de
  // caminhada não muda.
  const ambiente = espalharAmbiente({
    areas: AREAS,
    get,
    hash2,
    waystones: WAYSTONES,
    // a clareira de caçada não pode nascer debaixo de copa
    hunts: GROUNDS.map((g) => g.center),
    gente: NPC_SPAWNS,
    sites: SITES,
    livre: (x, y) => !nearUsed(x, y),
  });
  // a passagem de terra ganha vida própria: pedra e capim nas beiradas
  const vegetalTipo = new Set(["arvore", "conifera", "palmeira", "seca", "arbusto", "florada"]);
  const chavesVegetal = new Set();
  for (const a of ambiente) {
    if (vegetalTipo.has(a.tipo)) chavesVegetal.add(`${Math.floor(a.x)},${Math.floor(a.y)}`);
  }
  const topoVegetalLivre = (x, y) => {
    const cx0 = Math.floor(x), cy0 = Math.floor(y);
    for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
      if (chavesVegetal.has(`${cx0 + dx},${cy0 + dy}`)) return false;
    }
    return true;
  };
  const cantoLivre = (x, y) => {
    const t = get(Math.floor(x), Math.floor(y));
    return t !== WATER && t !== K.WALL && t !== PATH && t !== PLAZA && t !== BRIDGE;
  };
  for (const pass of passagens) {
    pass.pontos.forEach((p, i) => {
      for (const lado of [-1, 1]) {
        const x = p.x + p.nx * (p.meia - 0.3) * lado;
        const y = p.y + p.ny * (p.meia - 0.3) * lado;
        if (!cantoLivre(x, y)) continue;
        const tipo = i % 4 === 0 ? "pedra" : i % 3 === 0 ? "arbusto" : "tufo";
        if (tipo === "arbusto") {
          if (!topoVegetalLivre(x, y)) continue;
          chavesVegetal.add(`${Math.floor(x)},${Math.floor(y)}`);
        }
        ambiente.push({ tipo, x, y, bioma: p.bioma });
      }
    });
  }

  // ---- casas por dentro: a fachada é a porta ----
  // Cada tipo tem DUAS plantas próprias, cada uma num bolsão de mar, longe das
  // ilhas. A casa escolhe a planta pela semente, então duas casas do mesmo tipo
  // já não têm a mesma geometria. A sala é um recorte iluminado: ao entrar, a
  // câmera salta para o bolsão e o renderer escurece o mar em volta.
  const SALAS = {
    casa: [
      { x: 492, y: 330, w: 16, h: 12, piso: BRIDGE },
      { x: 320, y: 20, w: 15, h: 13, piso: BRIDGE },
    ],
    cabana: [
      { x: 492, y: 4, w: 14, h: 11, piso: BRIDGE },
      { x: 300, y: 200, w: 16, h: 10, piso: BRIDGE },
    ],
    torre: [
      { x: 276, y: 4, w: 12, h: 13, piso: K.MARBLE },
      { x: 158, y: 26, w: 12, h: 13, piso: K.MARBLE },
    ],
    galpao: [
      { x: 520, y: 180, w: 18, h: 11, piso: K.STONE },
      { x: 404, y: 32, w: 17, h: 12, piso: K.STONE },
    ],
  };
  const TODAS_AS_SALAS = [];
  for (const [tipo, lista] of Object.entries(SALAS)) {
    for (const sala of lista) {
      sala.tipo = tipo;
      // antes de cavar, confirma que o bolsão é mar: cavar em ilha abriria buraco
      let mar = true;
      for (let y = sala.y; y < sala.y + sala.h && mar; y++) {
        for (let x = sala.x; x < sala.x + sala.w && mar; x++) {
          if (get(x, y) !== K.WATER) mar = false;
        }
      }
      sala.mar = mar;
      for (let y = sala.y; y < sala.y + sala.h; y++) {
        for (let x = sala.x; x < sala.x + sala.w; x++) {
          const borda = x === sala.x || y === sala.y || x === sala.x + sala.w - 1 || y === sala.y + sala.h - 1;
          set(x, y, borda ? K.WALL : sala.piso);
        }
      }
      const px = sala.x + Math.floor(sala.w / 2);
      set(px, sala.y + sala.h - 1, sala.piso);
      sala.door = { x: px + 0.5, y: sala.y + sala.h - 0.5 };
      sala.spawn = { x: px + 0.5, y: sala.y + sala.h - 2.2 };
      sala.mesa = { x: sala.x + 2.6, y: sala.y + 2.1 };
      sala.lareira = { x: sala.x + sala.w - 2.8, y: sala.y + 2.1 };
      sala.cama = { x: sala.x + 2.6, y: sala.y + 5.1 };
      TODAS_AS_SALAS.push(sala);
    }
  }
  const INTERIORES = Object.fromEntries(Object.entries(SALAS).map(([tipo, lista]) => [tipo, lista[0]]));
  const interiorProps = [];
  const interiorSolids = [];
  const assentosDaSala = (sala) => {
    const out = [];
    const perto = (x, y) => Math.hypot(x - sala.spawn.x, y - sala.spawn.y) < 1.8 ||
      Math.hypot(x - sala.door.x, y - sala.door.y) < 1.8 ||
      Math.hypot(x - sala.mesa.x, y - sala.mesa.y) < 1.9 ||
      Math.hypot(x - sala.lareira.x, y - sala.lareira.y) < 1.9 ||
      Math.hypot(x - sala.cama.x, y - sala.cama.y) < 2.1;
    for (let x = sala.x + 1.7; x <= sala.x + sala.w - 1.5; x += 2.4) {
      for (const y of [sala.y + 1.7, sala.y + sala.h - 2.5]) if (!perto(x, y)) out.push({ x, y });
    }
    for (let y = sala.y + 4; y <= sala.y + sala.h - 3; y += 2.2) {
      for (const x of [sala.x + 1.6, sala.x + sala.w - 1.6]) if (!perto(x, y)) out.push({ x, y });
    }
    return out;
  };
  const MOVEIS = {
    casa: ["barril", "caixote", "saco", "fardo", "estante", "florada", "seca"],
    cabana: ["barril", "saco", "fardo", "estante", "caixote", "seca"],
    torre: ["estante", "estante", "barril", "caixote", "tocha", "saco"],
    galpao: ["barril", "caixote", "saco", "fardo", "fardo", "braseiro", "caixote"],
  };
  function prepararInterior(house) {
    const plantas = SALAS[house.tipo];
    if (!plantas) return null;
    // a semente da casa escolhe uma das duas plantas do tipo
    const sala = plantas[hash2(house.x * 1.7 + 3.1, house.y * 2.3 - 1.7) < 0.5 ? 0 : 1];
    interiorProps.length = 0;
    interiorSolids.length = 0;
    const lista = MOVEIS[house.tipo] || MOVEIS.casa;
    const assentos = assentosDaSala(sala);
    const rnd = mulberry32(Math.floor(house.x * 977 + house.y * 331 + 13));
    for (let i = assentos.length - 1; i > 0; i--) {
      const j = Math.floor(rnd() * (i + 1));
      const tmp = assentos[i];
      assentos[i] = assentos[j];
      assentos[j] = tmp;
    }
    const quantos = Math.min(assentos.length, 8 + Math.floor(rnd() * 3));
    for (let i = 0; i < quantos; i++) {
      interiorProps.push({ tipo: lista[Math.floor(rnd() * lista.length)], ...assentos[i], bioma: house.bioma });
    }
    interiorProps.push({ tipo: "mesa", x: sala.mesa.x, y: sala.mesa.y, bioma: house.bioma });
    interiorProps.push({ tipo: "fogueira", x: sala.lareira.x, y: sala.lareira.y, bioma: house.bioma });
    if (house.tipo !== "galpao") interiorProps.push({ tipo: "cama", x: sala.cama.x, y: sala.cama.y, bioma: house.bioma });
    // morador da casa: procurar um canto livre perto do fogo, longe dos móveis,
    // da porta e do spawn. Ele não tem caixa: é visita, não parede.
    const livre = (x, y) => Math.hypot(x - sala.mesa.x, y - sala.mesa.y) >= 1.5 &&
      Math.hypot(x - sala.lareira.x, y - sala.lareira.y) >= 1.5 &&
      Math.hypot(x - sala.door.x, y - sala.door.y) >= 1.7 &&
      Math.hypot(x - sala.spawn.x, y - sala.spawn.y) >= 1.2 &&
      interiorProps.every((p) => Math.hypot(p.x - x, p.y - y) >= 0.95);
    let canto = null;
    for (let raio = 2.2; raio <= 4.4 && !canto; raio += 0.35) {
      for (let i = 0; i < 16 && !canto; i++) {
        const ang = (i / 16) * Math.PI * 2;
        const x = sala.lareira.x + Math.cos(ang) * raio;
        const y = sala.lareira.y + 0.7 + Math.sin(ang) * raio * 0.7;
        if (x < sala.x + 1.3 || x > sala.x + sala.w - 1.3) continue;
        if (y < sala.y + 1.3 || y > sala.y + sala.h - 1.5) continue;
        if (livre(x, y)) canto = { x, y };
      }
    }
    if (canto) {
      const estilo = npcStyle(`morador:${house.bioma}`, BIOMES[house.bioma]?.accent || "#ffc857", "inter");
      interiorProps.push({ tipo: "morador", ...canto, bioma: house.bioma, dir: 0, ...estilo });
    }
    for (const item of interiorProps) {
      const box = CAIXA_CENARIO[item.tipo] || (item.tipo === "estante" ? [0.5, 0.3, 0.3] : null);
      // Os móveis fixos já têm caixas permanentes; só a mobília da casa
      // atual entra aqui, sem deixar colisões invisíveis na próxima casa.
      if (!box || item.tipo === "fogueira") continue;
      interiorSolids.push({ x: item.x, y: item.y - box[2], hw: box[0], hh: box[1] });
    }
    return sala;
  }
  const casas = [];
  for (const a of ambiente) {
    if (!["casa", "cabana", "torre", "galpao"].includes(a.tipo)) continue;
    const t = tamanhoDoAsset(a.tipo);
    if (!t) continue;
    casas.push({
      id: `casa-${a.tipo}-${Math.round(a.x * 10)}-${Math.round(a.y * 10)}`,
      tipo: a.tipo,
      bioma: a.bioma,
      x: a.x,
      y: a.y,
      w: t.w / TILE,
      h: t.h / TILE,
      door: { x: a.x, y: a.y + 0.55 },
    });
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
      trainerGender: g.trainerGender,
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
    gender: h.trainerGender,
    trainer: true,
    ground: h,
    bob: rand() * Math.PI * 2,
  }));
  const npcs = [
    ...NPC_SPAWNS.map((n) => ({ ...n, bob: rand() * Math.PI * 2 })),
    ...trainerNpcs,
  ].map((n) => ({
    ...n,
    ...npcStyle(n.id, n.accent, n.continent, n.gender),
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

  // clima corrente: na chuva o morador recolhe, anda menos e espera mais
  let clima = "limpo";
  function setClima(id) {
    clima = String(id || "limpo");
  }

  function updateNpcs(dt, t) {
    const molhado = clima === "chuva" ? 0.55 : 1;
    for (const n of npcs) {
      if (t < n.waitUntil) {
        n.moving = false;
        continue;
      }
      const d = Math.hypot(n.tx - n.x, n.ty - n.y);
      if (d < 0.15) {
        n.moving = false;
        n.waitUntil = t + (1400 + rand() * 5200) / molhado;
        pickNpcTarget(n);
        continue;
      }
      const oldX = n.x, oldY = n.y;
      const step = Math.min(d, n.speed * dt * molhado);
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
      n.facing = facingDirection(n.x-oldX,n.y-oldY,n.facing);
    }
  }

  function isSolidTile(tx, ty) { return SOLID.has(get(tx, ty)); }
  // As caixas passavam de 1.900 depois das praças, e varrer a lista inteira
  // em cada consulta derrubava o quadro de 58 para 25 fps. Índice espacial de
  // 8 tiles: a consulta olha só as caixas do quarteirão.
  const PROP_CELL = 8;
  const baldes = new Map();
  function indexar(p) {
    for (let by = Math.floor((p.y - p.hh) / PROP_CELL); by <= Math.floor((p.y + p.hh) / PROP_CELL); by++) {
      for (let bx = Math.floor((p.x - p.hw) / PROP_CELL); bx <= Math.floor((p.x + p.hw) / PROP_CELL); bx++) {
        const k = bx + by * 4096;
        let lista = baldes.get(k);
        if (!lista) { lista = []; baldes.set(k, lista); }
        lista.push(p);
      }
    }
  }
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
    for (const p of interiorSolids) {
      if (Math.abs(x - p.x) < hw + p.hw && Math.abs(y - p.y) < hh + p.hh) return true;
    }
    const bx0 = Math.floor((x - hw) / PROP_CELL);
    const bx1 = Math.floor((x + hw) / PROP_CELL);
    const by0 = Math.floor((y - hh) / PROP_CELL);
    const by1 = Math.floor((y + hh) / PROP_CELL);
    for (let by = by0; by <= by1; by++) {
      for (let bx = bx0; bx <= bx1; bx++) {
        const lista = baldes.get(bx + by * 4096);
        if (!lista) continue;
        for (const p of lista) {
          if (p.active && !p.active()) continue;
          if (Math.abs(x - p.x) < hw + p.hw && Math.abs(y - p.y) < hh + p.hh) return true;
        }
      }
    }
    return false;
  }

  function addProp(x, y, hw, hh, active = null) {
    const p = { x, y, hw, hh, active };
    props.push(p);
    indexar(p);
    return p;
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
    // peças do cais: caixote e mastro barram, gaivota não pisa no chão
    crate: [0.4, 0.3], crane: [0.45, 0.35], bell: [0.3, 0.25], mast: [0.2, 0.3],
  };
  for (const d of decor) {
    const size = decorSize[d.type];
    if (!size || d.fino) continue;
    // O enfeite nasceu antes da picada, então uma lâmpada podia ficar em cima
    // do único caminho da ilha. Quem está no chão do caminho ou da ponte sai:
    // enfeite não fecha passagem.
    const chao = get(Math.floor(d.x), Math.floor(d.y));
    if (chao === PATH || chao === BRIDGE) continue;
    addProp(d.x, d.y, size[0], size[1]);
  }

  // Duas bocas por continente, ligadas pelo túnel do subsolo: descer numa e
  // subir pela escada do fundo leva à outra. A saída (abaixo da boca) precisa
  // caber o corpo inteiro.
  const caves = [];
  const GRANDES = new Set(["casa", "cabana", "torre", "ruina", "galpao", "doca", "poco"]);
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
    // um ponto serve para boca se o morro cabe, a saída abaixo dele cabe, e
    // ele não briga com o farol, com a pedra da área nem com outra caverna
    const okSpot = (cx, cy) =>
      cx >= 2 && cy >= 2 && cx <= MAP_W - 2 && cy <= MAP_H - 2 &&
      freeSpot(cx, cy) &&
      Math.hypot(cx - h.banner.x, cy - h.banner.y) >= 2.5 &&
      !caves.some((c) => Math.hypot(c.x - cx, c.y - cy) < 7) &&
      !(pedraDaArea && Math.hypot(pedraDaArea.x - cx, pedraDaArea.y - cy) < 5) &&
      // a boca é um morro de 3 tiles: não nasce colada em totem nem em gente
      !SITES.some((s) => Math.hypot(s.x - cx, s.y - cy) < 3.2) &&
      !NPC_SPAWNS.some((n) => Math.hypot(n.x - cx, n.y - cy) < 2.8) &&
      !ambiente.some((a) => GRANDES.has(a.tipo) && Math.hypot(a.x - cx, a.y - cy) < 3.2);
    const pick = (from, to, minFromCenter, avoid = null) => {
      for (let r = from; r <= to; r++) {
        for (let dy = -r; dy <= r; dy++) {
          for (let dx = -r; dx <= r; dx++) {
            if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
            const cx = Math.round(h.center.x + dx);
            const cy = Math.round(h.center.y + dy);
            if (Math.hypot(cx - h.center.x, cy - h.center.y) < minFromCenter) continue;
            if (avoid && Math.hypot(avoid.x - cx, avoid.y - cy) < 7) continue;
            if (!okSpot(cx, cy)) continue;
            return { x: cx, y: cy };
          }
        }
      }
      return null;
    };
    // A segunda boca é a saída do fundo, não uma vizinha da primeira: fica no
    // lado oposto da área, o mais longe que couber, para descer de um lado da
    // ilha e voltar pelo outro. É o que dá sentido ao par de bocas.
    const farMouth = (first) => {
      const vx = first.x - h.center.x;
      const vy = first.y - h.center.y;
      const len = Math.hypot(vx, vy) || 1;
      const areaDaIlha = areaAtTile(Math.round(first.x), Math.round(first.y)) || null;
      let best = null;
      let bestDist = 0;
      for (let r = 5; r <= 15; r++) {
        for (let dy = -r; dy <= r; dy++) {
          for (let dx = -r; dx <= r; dx++) {
            if (Math.max(Math.abs(dx), Math.abs(dy)) !== r) continue;
            // só o lado oposto ao da entrada
            if ((dx * vx + dy * vy) / (len * (Math.hypot(dx, dy) || 1)) > -0.2) continue;
            const cx = Math.round(h.center.x + dx);
            const cy = Math.round(h.center.y + dy);
            if (areaDaIlha && areaAtTile(cx, cy) !== areaDaIlha) continue;
            if (!okSpot(cx, cy)) continue;
            const d = Math.hypot(cx - first.x, cy - first.y);
            if (d > bestDist) {
              bestDist = d;
              best = { x: cx, y: cy };
            }
          }
        }
      }
      return best;
    };
    const first = pick(4, 9, 3.2) || { x: h.center.x + 3, y: h.center.y + 3 };
    const second = farMouth(first) || pick(8, 14, 7.5, first) || { x: first.x + 7, y: first.y };
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
        // a paleta da fachada sai da área onde a boca realmente está: a boca
        // que caiu na divisa não herda a cor da área vizinha por engano
        areaId: areaAtTile(Math.round(p.spot.x), Math.round(p.spot.y))?.id || h.id,
        // onde o corpo reaparece quando sobe de volta
        exit: { x: p.spot.x, y: p.spot.y + 1.5 },
      });
    });
  }
  // O morro da caverna tem 40x31 px (2,5 x 2 tiles). A caixa antiga cobria só
  // a boca; o corpo do morro era atravessável. A caixa agora cobre o teto e o
  // miolo, e deixa a boca e a saída em c.y + 1,5 livres para chegar e descer.
  for (const c of caves) addProp(c.x, c.y - 1.2, 0.95, 0.7);

  // a boca nasceu antes da casa: se as duas caíram no mesmo canto, a casa sai.
  // A conta é de caixa contra caixa (a mesma da colisão), não de raio: o morro
  // é fundo e a fachada é larga, e um raio grande derrubava casa demais.
  const cruzaCaixa = (ax, ahw, ay, ahh, bx, bhw, by, bhh) =>
    Math.abs(ax - bx) < ahw + bhw && Math.abs(ay - by) < ahh + bhh;
  for (let i = casas.length - 1; i >= 0; i--) {
    const casa = casas[i];
    const perto = caves.some((c) =>
      cruzaCaixa(casa.x, casa.w / 2, casa.y - 0.7, 0.6, c.x, 0.95, c.y - 1.2, 0.7) ||
      cruzaCaixa(casa.x, casa.w / 2, casa.y - 0.7, 0.6, c.exit.x, 0.6, c.exit.y, 0.5));
    if (!perto) continue;
    casas.splice(i, 1);
    const j = ambiente.findIndex((a) => Math.abs(a.x - casa.x) < 0.01 && Math.abs(a.y - casa.y) < 0.01);
    if (j >= 0) ambiente.splice(j, 1);
  }

  // a fachada da casa ocupa o chão: o corpo não atravessa mais a parede. A
  // caixa é a base (2 tiles de fundo), não o telhado, e a porta fica de fora.
  // Vai em colunas de no máximo 2 tiles: uma caixa larga demais vira parede
  // invisível, e a regra do mundo é que a colisão caiba no desenho.
  for (const casa of casas) {
    const colunas = Math.max(1, Math.ceil(casa.w / 2));
    const meia = casa.w / (2 * colunas);
    for (let i = 0; i < colunas; i++) {
      const p = addProp(casa.x - casa.w / 2 + meia + i * 2 * meia, casa.y - 0.7, meia, 0.6);
      if (p) p.tipo = `casa:${casa.tipo}`;
    }
  }

  // os três móveis fixos da sala (mesa, fogo e cama) também barram o corpo.
  // A mobília sorteada tem caixas trocadas em prepararInterior; estas
  // caixas fixas ficam no bolsão da casa, longe das ilhas, e valem para as 4 salas.
  for (const sala of TODAS_AS_SALAS) {
    const tipo = sala.tipo;
    const mesa = addProp(sala.mesa.x, sala.mesa.y - 0.3, 0.7, 0.3);
    if (mesa) mesa.tipo = `movel:mesa:${tipo}`;
    const fogo = addProp(sala.lareira.x, sala.lareira.y - 0.3, 0.6, 0.3);
    if (fogo) fogo.tipo = `movel:lareira:${tipo}`;
    if (tipo !== "galpao") {
      const cama = addProp(sala.cama.x, sala.cama.y - 0.3, 0.8, 0.3);
      if (cama) cama.tipo = `movel:cama:${tipo}`;
    }
  }

  // árvore em cima da boca fecha a descida quando o tronco passa a barrar:
  // tira a peça, porque a pedra da caverna e o degrau valem mais que a copa
  for (let i = ambiente.length - 1; i >= 0; i--) {
    const a = ambiente[i];
    if (a.tipo !== "arvore" && a.tipo !== "conifera" && a.tipo !== "palmeira" && a.tipo !== "seca") continue;
    const perto = caves.some((c) =>
      Math.hypot(c.x - a.x, c.y - a.y) < 1.5 || Math.hypot(c.exit.x - a.x, c.exit.y - a.y) < 0.9);
    if (perto) ambiente.splice(i, 1);
  }

  // ---- colisão do cenário: o que tem volume barra o corpo ----
  // Antes só estação, pedra, boca e doca barravam; barril, caixote, árvore e
  // fogueira eram desenho puro e o boneco atravessava tudo. A caixa acompanha
  // o desenho e fica presa ao chão. Árvore não nasce perto de casa (a folga é
  // feita no povoado), então a porta não fica trancada.
  const CAIXA_CENARIO = {
    arvore: [0.28, 0.22, 0.34], conifera: [0.26, 0.22, 0.34],
    palmeira: [0.24, 0.2, 0.34], seca: [0.24, 0.2, 0.34],
    pedra: [0.36, 0.24, 0.3],
    barril: [0.34, 0.28, 0.3], caixote: [0.4, 0.32, 0.34],
    saco: [0.32, 0.26, 0.28], fardo: [0.44, 0.28, 0.3],
    cerca: [0.68, 0.3, 0.35], poco: [0.8, 0.5, 0.42],
    ruina: [0.95, 0.55, 0.5],
    fogueira: [0.48, 0.28, 0.3], braseiro: [0.3, 0.26, 0.3],
  };
  const pertoDeBoca = (x, y) => caves.some((c) =>
    Math.hypot(c.x - x, c.y - y) < 2.0 || Math.hypot(c.exit.x - x, c.exit.y - y) < 1.4);
  const pertoDePorta = (x, y) => casas.some((c) =>
    Math.hypot(c.door.x - x, c.door.y - y) < 1.5);
  for (const a of ambiente) {
    const caixa = CAIXA_CENARIO[a.tipo];
    if (!caixa) continue;
    if (pertoDeBoca(a.x, a.y) || pertoDePorta(a.x, a.y)) continue;
    const p = addProp(a.x, a.y - caixa[2], caixa[0], caixa[1]);
    if (p) p.tipo = a.tipo;
  }

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

  // 9. liga tudo: todo ponto de interesse tem caminho a pé desde o spawn.
  // Custa 0 andar, 1 atravessar água (vira ponte) e 2 abrir picada no mato
  // (vira caminho); parede, magma e ácido ficam de fora. Depois de achar o
  // custo, cada ponto pinta o próprio trajeto, então nenhuma estação, pedra,
  // caverna, NPC ou item fica órfã.
  // magma e ácido são chão andável no jogo (SOLID é água, árvore e parede)
  const SEM_PASSO = new Set([K.WALL]);
  const custo = new Int32Array(MAP_W * MAP_H).fill(-1);
  const pai = new Int32Array(MAP_W * MAP_H).fill(-1);
  {
    const inicio = Math.round(SPAWN.y) * MAP_W + Math.round(SPAWN.x);
    const fila = [[inicio, 0]];
    custo[inicio] = 0;
    let cabeca = 0;
    while (cabeca < fila.length) {
      const [p, c] = fila[cabeca++];
      const px = p % MAP_W;
      const py = (p - px) / MAP_W;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = px + dx;
        const ny = py + dy;
        if (nx < 1 || ny < 1 || nx >= MAP_W - 1 || ny >= MAP_H - 1) continue;
        const np = ny * MAP_W + nx;
        const t = tiles[np];
        if (SEM_PASSO.has(t)) continue;
        const passo = t === WATER ? 1 : t === TREE ? 2 : 0;
        const nc = c + passo;
        if (custo[np] !== -1 && custo[np] <= nc) continue;
        custo[np] = nc;
        pai[np] = p;
        // 0-1-2: entra na frente quando é de graça, no fim quando custa
        if (passo === 0) fila.splice(cabeca, 0, [np, nc]);
        else fila.push([np, nc]);
      }
    }
  }
  const interessantes = [
    ...stations.map((o) => ({ x: o.x, y: o.y })),
    ...waystones.map((o) => ({ x: o.x, y: o.y })),
    ...caves.map((o) => ({ x: o.x, y: o.y })),
    ...npcs.map((o) => ({ x: o.x, y: o.y })),
    ...groundItems.map((o) => ({ x: o.x, y: o.y })),
  ];
  const pintados = new Set();
  for (const alvo of interessantes) {
    let p = Math.round(alvo.y) * MAP_W + Math.round(alvo.x);
    if (custo[p] === -1 || custo[p] === 0) continue;
    for (let salto = 0; salto < 400 && p >= 0 && custo[p] > 0; salto++) {
      if (!pintados.has(p)) {
        const t = tiles[p];
        const px = p % MAP_W;
        const py = Math.floor(p / MAP_W);
        // ponte e picada têm dois tiles de largura: um fio de um tile só
        // atravessando o mar parecia linha de circuito
        for (const [dx, dy] of [[0, 0], [1, 0], [0, 1], [1, 1]]) {
          const nx = px + dx;
          const ny = py + dy;
          if (nx < 1 || ny < 1 || nx >= MAP_W - 1 || ny >= MAP_H - 1) continue;
          const nt = tiles[ny * MAP_W + nx];
          if (nt === WATER) set(nx, ny, BRIDGE);
          else if (nt === TREE) set(nx, ny, PATH);
        }
        pintados.add(p);
      }
      p = pai[p];
    }
  }

  return {
    tiles, decor, ambiente, interiorProps, props, stations, waystones, npcs, hunters, monsters, caves, groundItems, takeGroundItem,
    casas, interiores: INTERIORES, salas: TODAS_AS_SALAS, prepararInterior,
    cat: { ...CAT_SPAWN, facing: 1, t: 0, moving: false },
    get, set, isSolidTile, boxCollides, updateNpcs, setClima,
    continentAt, continentAtTile, areaAt, areaAtTile,
    markExplored, isExplored, setExplored,
    get exploredVersion() { return exploredVersion; },
    get exploredBytes() { return explored; },
  };
}

export { hash2, mulberry32 };

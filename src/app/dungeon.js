import { drawPet, drawBuilding, drawAdventurer, drawChest, drawStairs, drawTorch, drawAltar, drawElevador, drawMesa, drawForge, drawOficina, drawBiblioteca, drawObservatorio, drawWaystone, drawKeeper, drawPlot, drawVein, drawEnchanter, drawBilhete, drawIsca, varianteDaPeca } from "../rendering/dungeon-art.js";
import { buildDungeonMap, dungeonSolid, roomIndexAt, boxFree, dungeonLineOfSight, dungeonCanSeePlayer } from "../gameplay/dungeon-map.js";
import { lootDoBau } from "../gameplay/dungeon-loot.js";
import { pracaDaCaverna } from "../gameplay/dungeon-plaza.js";
import { isTextEntry, nativeActivation } from "../platform/input.js";
import { moveWithCollision, advancePath, directionAngle, facingDirection } from "../core/movement.js";
// A caverna: um mapa próprio, em tela cheia, com salas e túneis que se cruzam.
// O bicho que vê você começa a batalha sozinho, como nos jogos de bolso: anda
// pelo corredor, entra no campo de visão, exclama e chama o duelo de perguntas.
import { TILE } from "../core/runtime-config.js";
import { dungeonById, creatureId, creatureKind, creatureAccent } from "../content/dungeon-data.js";
import { GROUNDS, ITEMS, RELICS, TIERS } from "../content/rpg-data.js";
import { PETS } from "../content/pets.js";
import { drawCreatureArt } from "../rendering/creature.js";
import { findPathIn, findInteractionPath } from "../core/path.js";
import { hash2 } from "../core/random.js";
import { drawPetSprite } from "../rendering/pet-art.js";
import { drawSkiff } from "../rendering/skiff.js";
import { escalaDaCamera, tilesNaVista, dentroDaVista, caixaNaVista } from "../core/camera.js";
import { fracoesDeVida } from "../core/vitais.js";
import { propsDaSala } from "../content/salas-tematicas.js";
import { nomeDaCacada } from "../content/cacada-clima.js";
import { ouveOPassoS, direcaoPara, acordaComOPasso } from "../world/audicao.js";
import { rotaDePatrulha, pontoDaRota } from "../world/patrulha.js";
import { varianteDe } from "../world/variantes.js";
import { bilheteDaCaverna } from "../world/bilhetes.js";

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

// ---------- a caverna em si ----------

export function createDungeon({ rpg, audio, onEncounter, onSheet, onInventory, onWiki, onGather, onExit, onKeeper, onConurbation, onElevador, onPortal, onVocacao, isBlocked, vitais = null, avatar = {}, look = null, gear = null, getClima = null }) {
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
    bait: null,
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

  // Separação entre bichos: cada um patrulha até MONSTER_ROAM da sua casa. Se
  // a distância entre duas casas for maior que a soma dos alcances de visão
  // mais os dois passeios, os círculos de visão não se tocam e nenhum ponto do
  // mapa pode ser visto pelos dois ao mesmo tempo. É a garantia contra matilha.
  // A patrulha usa este mesmo raio, então a garantia continua valendo.
  const MONSTER_ROAM = 1.4;
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
      // tamanho por bicho: dois "Bytes" não têm o mesmo porte
      escala: 0.9 + hash2(x * 7 + k, y * 11 - k) * 0.16,
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
      const name = nomeDaCacada(names, n, tier, String(getClima?.() || "limpo"), (nome, t) => creatureKind(def, nome, t)) || "Coisa";
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
    // alcance e furtividade da vocação mudam de onde o bicho te vê: atirador
    // e assassino chegam perto antes de serem notados, guerreiro é notado
    // mais longe
    let fatorVisao = 1 / Math.max(0.3, (rpg.bonus?.().alcance || 1) * (rpg.bonus?.().furtividade || 1));
    // subcategoria que mexe no olho do bicho: ilusionista confunde (20% menos),
    // campeão provoca (20% mais)
    if (rpg.data.sub === "ilusionista") fatorVisao *= 0.8;
    if (rpg.data.sub === "campeao") fatorVisao *= 1.2;
    for (const plano of planos) {
      if (!plano.post) continue;
      const m = makeMonster(def, plano.room, 0, plano.name, plano.tier, plano.post);
      m.vision = Math.max(1.6, m.vision * fatorVisao);
      // um quinto das criaturas dorme até o passo chegar: a descida tem bicho
      // parado e bicho acordado, decidido pelo id da caverna e da sala
      let h = 0;
      for (const ch of `${def.id}:${plano.room.id}`) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
      if (h % 5 === 0) m.dorme = true;
      // variante rara: mesma espécie do bestiário, com tempero próprio
      const variante = varianteDe(`${def.id}:${plano.room.id}`);
      if (variante) {
        m.variante = variante.id;
        m.name = `${variante.prefixo ? `${variante.prefixo} ` : ""}${m.name}${variante.sufixo ? ` ${variante.sufixo}` : ""}`.slice(0, 32);
        m.hpMult = variante.hpMult;
        m.danoExtra = variante.danoExtra;
        m.xpMult = variante.xpMult;
        m.lootMult = variante.lootMult;
        if (variante.accent) m.accent = variante.accent;
      }
      if (!m.dorme) criarRota(m);
      out.push(m);
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
      // a arena do chefe ganha tochas nos dois cantos de baixo: o círculo de
      // runas no chão precisa de luz dos dois lados para aparecer inteiro
      if (room.id === def.layout.bossRoom) {
        for (const dx of [1.2, room.w - 1.2]) {
          props.push({ kind: "torch", x: room.x + dx, y: room.y + room.h - 0.22 });
        }
      }
      // a mesa de vocação mora na praça da capital subterrânea
      if (room.kind === "city" || room.theme === "cidade") {
        props.push({
          kind: "vocacao",
          x: room.x + room.w * 0.5,
          y: room.y + Math.min(5.6, room.h - 1.4),
          label: "mesa de vocação",
          interact: true,
        });
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
    if (city) for (const p of pracaDaCaverna(def, city)) props.push(p);
    // bilhete na parede da cidade: a lição da área fica legível no mundo
    if (city) {
      const bilhete = bilheteDaCaverna({
        areaId: String(def.id || "").replace(/^dungeon-/, ""),
        nome: def.name, material: def.material, continente: def.continent,
      });
      if (bilhete) {
        const livre = [
          { x: city.x + 1.5, y: city.y + 0.6 },
          { x: city.x + city.w - 1.5, y: city.y + 0.6 },
          { x: city.x + 1.5, y: city.y + city.h - 0.6 },
        ].find((p) => !props.some((q) => Math.hypot(q.x - p.x, q.y - p.y) < 1.3)
          && !state.chests.some((c) => Math.hypot(c.x - p.x, c.y - p.y) < 1.3));
        if (livre) props.push({ kind: "bilhete", x: livre.x, y: livre.y, interact: true, titulo: bilhete.titulo, texto: bilhete.texto });
      }
    }
    // a sala da disciplina ganha a peça de assinatura (oficina, biblioteca ou
    // observatório) encostada nas paredes; baú e outra peça no meio mandam a
    // peça para outro canto em vez de empilhar
    for (const p of propsDaSala(def)) {
      const colide = props.some((q) => Math.hypot(q.x - p.x, q.y - p.y) < 1.4) ||
        state.chests.some((c) => Math.hypot(c.x - p.x, c.y - p.y) < 1.4);
      if (!colide) props.push(p);
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
    state.terrain = buildTerrain(state.map, def.palette, def.layout);
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
      if (p.kind === "oficina" || p.kind === "biblioteca" || p.kind === "observatorio") {
        state.solids.push({ x: p.x, y: p.y - 0.25, hw: 0.6, hh: 0.35 });
        continue;
      }
      if (p.kind === "vocacao") {
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
    state.bait = null;
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
    g.rotate(directionAngle(state.player.dir) + Math.PI / 2);
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
    moveWithCollision(p, dx * step, dy * step,
      (x, y) => boxFree(state.map, x, y, 0, state.solids));
    p.x = clamp(p.x, 0.6, state.map.W - 0.6);
    p.y = clamp(p.y, 0.6, state.map.H - 0.6);
    const moved = p.x !== ox || p.y !== oy;
    p.moving = moved;
    p.dir = facingDirection(p.x-ox,p.y-oy,p.dir);
    return moved;
  }

  function setPathTo(x, y, pending = null, silencioso = false) {
    // acha antes de limpar: arrastar por cima da parede não pode parar a
    // caminhada que já estava em curso
    const path = pending
      ? findInteractionPath(state.map.W, state.map.H, walkable, state.player, pending, {
        goalPad: PATH_PAD,
        canInteract: (from, target) => dungeonLineOfSight(state.map, from.x, from.y, target.x, target.y),
      })
      : findPathIn(state.map.W, state.map.H, walkable, state.player, { x, y }, { goalPad: PATH_PAD });
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
    const stepLen = SPEED * (state.sprint ? SPRINT : 1) * rpg.speedMult() * dt;
    const result = advancePath(state.player, path, stepLen,
      (x, y) => boxFree(state.map, x, y, 0, state.solids));
    if (result.blocked) {
      state.path = null;
      state.pending = null;
    } else if (result.finished) {
      state.path = null;
      const pending = state.pending;
      state.pending = null;
      if (pending) {
        const d = Math.hypot(pending.x - state.player.x, pending.y - state.player.y);
        if (d <= 1.8 && dungeonLineOfSight(state.map, state.player.x, state.player.y, pending.x, pending.y)) act(pending);
      }
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
    const room = (state.map?.rooms || []).find((r) => r.id === chest.roomId) || {};
    const areaId = String(state.def?.id || "").replace(/^dungeon-/, "");
    const relicId = RELICS[areaId]?.id || null;
    return lootDoBau({
      material: state.def.material,
      theme: room.theme || room.id || "",
      tier: room.tier || 0,
      locked: !!chest.locked,
      relicId,
      temReliquia: relicId ? rpg.itemCount(relicId) > 0 : true,
      gear: state.def.equipment || [],
      gearLivre: (state.def.equipment || []).filter((id) => rpg.itemCount(id) <= 0 && !Object.values(rpg.data.equipped || {}).includes(id)),
    });
  }

  function act(obj) {
    if (obj.kind === "chest") {
      if (obj.opened) {
        say("Este baú já foi saqueado. Volte noutra descida.");
        return;
      }
      if (obj.locked) {
        // ladrão abre selado sem gastar chave; é a força dele fora do duelo
        if (rpg.data.sub === "ladrao") {
          say("O ladrão abre o selo sem chave.", 2600);
        } else if (rpg.itemCount("chave") <= 0) {
          say("O baú está selado. Uma chave de caverna, feita na forja, abre.");
          audio.error?.();
          return;
        } else {
          rpg.data.items.chave--;
          if (rpg.data.items.chave <= 0) delete rpg.data.items.chave;
          rpg.save();
        }
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
    if (obj.kind === "vocacao") {
      onVocacao?.();
      say("A mesa de vocação abre as cinco cartas.", 2400);
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
    if (obj.kind === "elevador") {
      onElevador?.();
      return;
    }
    if (obj.kind === "portal") {
      onPortal?.(obj.portalDef);
      return;
    }
    if (obj.kind === "altar") {
      if (state.altarAt > 0 && clock() - state.altarAt < 45000) {
        say("O altar ainda está esfriando. Espere um pouco.");
        return;
      }
      const healed = rpg.heal(rpg.hpMax());
      const runa = rpg.recarregarRuna();
      state.altarAt = clock();
      const partes = [];
      if (healed > 0) partes.push(`${healed} de vida`);
      if (runa) partes.push(`uma carga de ${runa}`);
      say(partes.length ? `O altar devolve ${partes.join(" e ")}.` : "Você já está inteiro.", 3400);
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
    if (obj.kind === "bilhete") {
      say(`${obj.titulo}: ${obj.texto}`, 9000);
      audio.blip?.();
      return;
    }
    if (obj.kind === "oficina" || obj.kind === "biblioteca" || obj.kind === "observatorio") {
      usarPecaTematica(obj);
      return;
    }
  }

  // Peça de assinatura da disciplina: cada uma dá uma coisa por descida. A
  // oficina afia a arma, a biblioteca guarda uma dica para a próxima pergunta
  // e o observatório acende a sala do chefe no mapa.
  function usarPecaTematica(obj) {
    if (obj.used) {
      say("Esta peça já rendeu o que tinha nesta descida. Volte noutra.", 2800);
      return;
    }
    if (obj.kind === "oficina") {
      rpg.data.buffs.damage = Date.now() + 180000;
      rpg.save();
      obj.used = true;
      say("A oficina afia a arma: +1 de dano por três minutos.", 3600);
      audio.blip();
      updateHud();
      return;
    }
    if (obj.kind === "biblioteca") {
      rpg.data.buffs.dica = Date.now() + 600000;
      rpg.save();
      obj.used = true;
      say("A biblioteca abre uma página: a próxima pergunta do duelo vem com duas alternativas riscadas.", 4400);
      audio.blip();
      updateHud();
      return;
    }
    const sala = (state.map?.rooms || []).find((r) => r.id === state.def?.layout?.bossRoom);
    let marcados = 0;
    if (sala && state.seen && state.map) {
      for (let y = sala.y; y < sala.y + sala.h; y++) {
        for (let x = sala.x; x < sala.x + sala.w; x++) {
          const i = y * state.map.W + x;
          if (!state.map.grid[i] || state.seen[i]) continue;
          state.seen[i] = 1;
          marcados++;
        }
      }
      drawMinimap();
    }
    obj.used = true;
    say(`O observatório acende o fundo da caverna no mapa (${marcados} casas).`, 3800);
    audio.chime();
    updateHud();
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
    return dungeonCanSeePlayer(state.map, m, state.player);
  }

  // Rota de patrulha: até quatro pontos em volta do posto, só os que têm a
  // reta livre (mesa no caminho faria o bicho bater e desistir). Criada no
  // nascimento e também quando o bicho acorda, para dormir não ser isenção.
  function criarRota(m) {
    const rota = rotaDePatrulha({ x: m.hx, y: m.hy, seed: m.id, raio: m.roam })
      .filter((p) => {
        if (!boxFree(state.map, p.x, p.y, PATH_PAD, state.solids)) return false;
        const d = Math.hypot(p.x - m.hx, p.y - m.hy);
        for (let s = 0.3; s < d; s += 0.3) {
          const x = m.hx + ((p.x - m.hx) / d) * s;
          const y = m.hy + ((p.y - m.hy) / d) * s;
          if (!boxFree(state.map, x, y, PATH_PAD, state.solids)) return false;
        }
        return true;
      });
    if (rota.length >= 2) m.rota = rota;
  }

  // Próximo destino da patrulha: ida e volta. O bicho vai ao ponto, volta ao
  // posto, vai ao ponto seguinte e assim por diante. A volta pelo posto evita
  // a reta entre dois pontos que cruza mesa, e o índice anda mesmo quando o
  // caminho está bloqueado: ele desiste daquele ponto e tenta o seguinte.
  function seguirRota(m) {
    const i = m.rotaIdx ?? 0;
    m.rotaIdx = (i + 1) % (m.rota.length * 2);
    const ponto = i % 2 === 0 ? pontoDaRota({ rota: m.rota, indice: i / 2 }) : { x: m.hx, y: m.hy };
    if (!ponto) return false;
    m.tx = ponto.x;
    m.ty = ponto.y;
    return true;
  }

  function updateMonsters(dt, t) {
    const list = state.boss ? [...state.monsters, state.boss] : state.monsters;
    for (const m of list) {
      if (!m.alive) continue;
      {
        // isca no chão: por alguns segundos o bicho larga o posto e vai até o
        // cheiro; quando acaba, volta para casa
        if (m.lure) {
          if (t < m.lure.until) {
            const dl = Math.hypot(m.lure.x - m.x, m.lure.y - m.y);
            if (dl > 1.2) {
              m.tx = m.lure.x - ((m.lure.x - m.x) / dl) * 1.2;
              m.ty = m.lure.y - ((m.lure.y - m.y) / dl) * 1.2;
              m.waitUntil = Math.min(m.waitUntil || 0, t);
              m.passos = 0;
              m.ouvindo = 0;
            }
          } else {
            m.lure = null;
            m.tx = m.hx;
            m.ty = m.hy;
            m.waitUntil = Math.min(m.waitUntil || 0, t);
          }
        }
        // perseguição: o passo ouvido vira destino. Ele caminha até o último
        // ponto de onde veio o som e, passados 2,6 s sem passo novo, volta para
        // casa. Quem está comendo a isca não levanta a cabeça.
        const comendo = Boolean(m.lure && t < m.lure.until);
        if (!comendo && m.atras) {
          if (t < m.atras.until) {
            const da = Math.hypot(m.atras.x - m.x, m.atras.y - m.y);
            if (da > 0.9) {
              m.tx = m.atras.x;
              m.ty = m.atras.y;
              m.waitUntil = Math.min(m.waitUntil || 0, t);
              m.passos = 0;
            }
          } else {
            m.atras = null;
            m.tx = m.hx;
            m.ty = m.hy;
            m.waitUntil = Math.min(m.waitUntil || 0, t);
          }
        }
        // audição: o passo corrido chega antes da vista. O bicho para, vira para
        // o som e marca "?"; o duelo continua nascendo só da visão. Quem dorme
        // não ouve nem vê: o passo perto ou a corrida acordam.
        const distOuve = Math.hypot(state.player.x - m.x, state.player.y - m.y);
        if (m.dorme) {
          if (!acordaComOPasso({ dist: distOuve, sprint: state.sprint })) continue;
          m.dorme = false;
          criarRota(m);
        }
        if (!comendo && ouveOPassoS({ sprint: state.sprint, dist: distOuve, vendo: canSeePlayer(m), boss: m.boss })) {
          if (!m.ouvindo || t >= m.ouvindo - 1800) {
            m.ouvindo = t + 2200;
            m.dir = direcaoPara(m.x, m.y, state.player.x, state.player.y);
          }
          m.atras = { x: state.player.x, y: state.player.y, until: t + 2600 };
        }
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
            if (!m.rota || !seguirRota(m)) pickWander(m);
          } else {
            const step = Math.min(dist, m.speed * dt);
            const nx = m.x + (dx / dist) * step;
            const ny = m.y + (dy / dist) * step;
            if (boxFree(state.map, nx, ny, PATH_PAD, state.solids)) {
              m.x = nx;
              m.y = ny;
              m.moving = true;
              m.dir = facingDirection(dx,dy,m.dir);
            } else {
              m.waitUntil = t + 400;
              // parede entre ele e o som: desiste da perseguição em vez de
              // bater no mesmo canto para sempre
              if (m.atras) m.atras = null;
              if (!m.rota || !seguirRota(m)) pickWander(m);
            }
          }
        }
        // parado, ele ainda vira a cabeça de vez em quando: bicho vivo não
        // fica olhando para o mesmo pixel
        if (!m.moving && m.olharEm && t >= m.olharEm) {
          m.dir = (m.dir + 1 + Math.floor(Math.random() * 7)) % 8;
          m.olharEm = t + 380 + Math.random() * 900;
        }
      }
      // o campo de visão: perto e com linha reta até você. Quem está comendo a
      // isca não levanta a cabeça, então o cheiro serve de distração.
      if (t < state.encounterLockUntil) continue;
      if (m.lure && t < m.lure.until) continue;
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
      state.history.push({ x: p.x, y: p.y, dir: p.dir, moving: p.moving, t });
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
  function buildTerrain(map, palette, layout) {
    const cv = document.createElement("canvas");
    cv.width = map.W * TILE;
    cv.height = map.H * TILE;
    const g = cv.getContext("2d");
    if (!g) return cv;
    g.imageSmoothingEnabled = false;
    const cityIndex = map.rooms.findIndex((r) => r.kind === "city");
    // quatro acabamentos de piso, escolhidos na planta: duas cavernas da mesma
    // disciplina não têm mais o mesmo desenho de chão
    const acabamento = layout?.acabamento ?? 0;
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
        } else if (acabamento === 1) {
          // laje: blocos de 8 px em fiadas alternadas, junta escura
          g.fillStyle = patch(tx, ty) > 0.5 ? palette.floor : palette.floor2;
          g.fillRect(px, py, TILE, TILE);
          g.fillStyle = "rgba(0,0,0,0.32)";
          for (let yy = 0; yy < TILE; yy += 8) {
            g.fillRect(px, py + yy + 7, TILE, 1);
            const off = ((yy / 8) + tx) % 2 ? 4 : 0;
            for (let xx = off; xx < TILE; xx += 8) g.fillRect(px + xx, py + yy, 1, 7);
            g.fillStyle = "rgba(255,255,255,0.06)";
            g.fillRect(px + off + 2, py + yy + 1, 5, 1);
            g.fillStyle = "rgba(0,0,0,0.32)";
          }
        } else if (acabamento === 2) {
          // tijolo: fiadas de 4 px com junta e grão
          g.fillStyle = palette.floor;
          g.fillRect(px, py, TILE, TILE);
          for (let yy = 0; yy < TILE; yy += 5) {
            const off = ((yy / 5) % 2) * 4;
            g.fillStyle = "rgba(0,0,0,0.3)";
            g.fillRect(px, py + yy + 4, TILE, 1);
            g.fillStyle = off ? "rgba(0,0,0,0.24)" : "rgba(0,0,0,0.18)";
            g.fillRect(px + off + 3, py + yy, 1, 4);
            g.fillStyle = "rgba(255,255,255,0.05)";
            g.fillRect(px + off, py + yy, 3, 1);
          }
          g.fillStyle = "rgba(0,0,0,0.12)";
          g.fillRect(px + Math.floor(h * 12), py + 2, 2, 1);
        } else if (acabamento === 3) {
          // veio: piso de terra com filamentos do acento correndo
          g.fillStyle = patch(tx, ty) > 0.5 ? palette.floor : palette.floor2;
          g.fillRect(px, py, TILE, TILE);
          g.globalAlpha = 0.12;
          g.strokeStyle = palette.accent;
          g.lineWidth = 1;
          g.beginPath();
          g.moveTo(px, py + 3 + Math.floor(h * 9));
          g.lineTo(px + 6, py + 6 + Math.floor(h * 4));
          g.lineTo(px + TILE, py + 4 + Math.floor(h * 8));
          g.stroke();
          g.globalAlpha = 1;
          g.fillStyle = "rgba(255,255,255,0.05)";
          g.fillRect(px + 2 + Math.floor(h * 9), py + 11, 2, 1);
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

    // Marca de cada sala: a arena do chefe tem círculo de runas, o braço
    // fundo tem ouro no chão e a boca de entrada tem setas apontando para
    // dentro. Sem isso, sala e corredor tinham o mesmo chão e a caverna não
    // contava a própria história.
    for (const room of map.rooms) {
      const rx0 = room.x * TILE;
      const ry0 = room.y * TILE;
      const rw = room.w * TILE;
      const rh = room.h * TILE;
      const cx = Math.round(rx0 + rw / 2);
      const cy = Math.round(ry0 + rh / 2);
      if (room.id === layout?.bossRoom) {
        const raio = Math.round(Math.min(rw, rh) * 0.34);
        g.globalAlpha = 0.3;
        g.strokeStyle = palette.accent;
        g.lineWidth = 2;
        g.beginPath();
        g.arc(cx, cy, raio, 0, Math.PI * 2);
        g.stroke();
        g.globalAlpha = 0.18;
        g.lineWidth = 1;
        g.beginPath();
        g.arc(cx, cy, raio - 4, 0, Math.PI * 2);
        g.stroke();
        g.globalAlpha = 0.45;
        for (let i = 0; i < 4; i++) {
          const a = (i / 4) * Math.PI * 2 + Math.PI / 4;
          const dx = Math.round(cx + Math.cos(a) * raio);
          const dy = Math.round(cy + Math.sin(a) * raio);
          g.fillRect(dx - 1, dy - 2, 2, 4);
          g.fillRect(dx - 2, dy - 1, 4, 2);
        }
        g.globalAlpha = 1;
      } else if ((room.tier || 0) >= 3) {
        // ouro espalhado: sala de tesouro se reconhece pelo chão
        for (let i = 0; i < 16; i++) {
          const hx = hash2(room.x * 13 + i, room.y * 7 - i);
          const hy = hash2(room.x * 5 - i, room.y * 11 + i);
          const gx = Math.round(rx0 + 6 + hx * (rw - 12));
          const gy = Math.round(ry0 + 6 + hy * (rh - 12));
          g.globalAlpha = 0.55;
          g.fillStyle = i % 3 ? "#e8c07a" : palette.accent;
          g.fillRect(gx, gy, 2, 1);
          g.globalAlpha = 0.2;
          g.fillRect(gx - 1, gy + 1, 4, 1);
          g.globalAlpha = 1;
        }
      } else if (room.kind === "entrance") {
        g.globalAlpha = 0.28;
        g.strokeStyle = palette.accent;
        g.lineWidth = 1;
        for (let i = 0; i < 3; i++) {
          const yy = Math.round(cy + 10 - i * 5);
          g.beginPath();
          g.moveTo(cx - 4, yy + 2);
          g.lineTo(cx, yy - 1);
          g.lineTo(cx + 4, yy + 2);
          g.stroke();
        }
        g.globalAlpha = 1;
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
        g.fillStyle='rgba(222,229,242,.08)';g.fillRect(px+2,py+3,8,.5);
        g.fillStyle='rgba(7,15,30,.24)';g.fillRect(px+7+(ty%2)*2,py+4,.5,5);
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
    const tQuadro = performance.now();
    const dpr = state.dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = false;

    const vw = state.vw;
    const vh = state.vh;
    // a mesma escala do vale: a caverna não chega mais perto nem mais longe
    const scale = escalaDaCamera(vw, vh);
    const viewW = vw / scale;
    const viewH = vh / scale;
    const camX = clamp(state.player.x * TILE - viewW / 2, 0, state.map.W * TILE - viewW);
    const camY = clamp(state.player.y * TILE - viewH / 2, 0, state.map.H * TILE - viewH);
    // só o que a câmera cobre é visitado no quadro. O mapa continua 64x48, mas
    // o custo acompanha a tela, não o tamanho da caverna.
    const vista = tilesNaVista(camX, camY, viewW, viewH, state.map.W, state.map.H);
    const visiveis = { props: 0, chests: 0, monstros: 0, tochas: 0, tiles: (vista.x1 - vista.x0 + 1) * (vista.y1 - vista.y0 + 1) };
    state.view = { scale, camX, camY, vista, visiveis };

    const palette = state.def.palette;
    ctx.fillStyle = palette.wall;
    ctx.fillRect(0, 0, vw, vh);
    ctx.save();
    ctx.scale(scale, scale);
    ctx.translate(-camX, -camY);

    // a peça temática veste a área, não só o continente: três arranjos por
    // disciplina, escolhidos pelo id da caverna, sem asset novo
    const variante = varianteDaPeca(state.def?.id);
    const cityIndex = state.map.rooms.findIndex((r) => r.kind === "city");
    // chão e parede vêm do canvas pintado na descida. O recorte é da vista: o
    // resto do canvas não é lido nem amostrado pelo navegador.
    if (state.terrain) {
      const sx0 = Math.max(0, vista.x0 * TILE);
      const sy0 = Math.max(0, vista.y0 * TILE);
      const sw = Math.min(state.terrain.width, (vista.x1 + 1) * TILE) - sx0;
      const sh = Math.min(state.terrain.height, (vista.y1 + 1) * TILE) - sy0;
      if (sw > 0 && sh > 0) ctx.drawImage(state.terrain, sx0, sy0, sw, sh, sx0, sy0, sw, sh);
      visiveis.terrenoPx = Math.max(0, sw) * Math.max(0, sh);
    }

    // tochas nas paredes
    for (const prop of state.props) {
      if (prop.kind !== "torch" || !dentroDaVista(prop.x, prop.y, vista)) continue;
      visiveis.tochas++;
      drawTorch(ctx, prop.x * TILE, prop.y * TILE, t, palette.accent);
    }

    // entidades ordenadas por y
    const drawables = [];
    for (const chest of state.chests) {
      if (!dentroDaVista(chest.x, chest.y, vista)) continue;
      visiveis.chests++;
      drawables.push({
        y: chest.y,
        draw: () => drawChest(ctx, chest.x * TILE, chest.y * TILE, chest.opened, palette.accent),
      });
    }
    const CENARIO = new Set(["stairs", "building", "oficina", "biblioteca", "observatorio"]);
    for (const prop of state.props) {
      if (!prop.interact && !CENARIO.has(prop.kind)) continue;
      // construção ocupa mais de um tile: a caixa inteira decide, não o canto
      const naVista = prop.kind === "building"
        ? caixaNaVista(prop.x, prop.y, (prop.w || TILE) / TILE, (prop.h || TILE) / TILE, vista)
        : dentroDaVista(prop.x, prop.y, vista);
      if (!naVista) continue;
      visiveis.props++;
      drawables.push({
        y: prop.y + (prop.kind === "building" ? (prop.h || 0) / TILE : 0),
        draw: () => {
          if (prop.kind === "stairs") drawStairs(ctx, prop.x * TILE, prop.y * TILE, palette.accent, t);
          else if (prop.kind === "altar") drawAltar(ctx, prop.x * TILE, prop.y * TILE, t, palette.accent);
          else if (prop.kind === "elevador") drawElevador(ctx, prop.x * TILE, prop.y * TILE, t, palette.accent);
          else if (prop.kind === "forge") drawForge(ctx, prop.x * TILE, prop.y * TILE, t, palette.accent);
          else if (prop.kind === "vocacao") drawMesa(ctx, prop.x * TILE, prop.y * TILE, t, palette.accent);
          else if (prop.kind === "waystone") drawWaystone(ctx, prop.x * TILE, prop.y * TILE, t, palette.accent);
          else if (prop.kind === "keeper") drawKeeper(ctx, prop.x * TILE, prop.y * TILE, t, palette.accent);
          else if (prop.kind === "enchanter") drawEnchanter(ctx, prop.x * TILE, prop.y * TILE, t, palette.accent);
          else if (prop.kind === "pet") drawPet(ctx, prop.x * TILE, prop.y * TILE, t, palette.accent, PETS[prop.petId]?.kind || "cat", rpg.petTamed(prop.petId));
          else if (prop.kind === "plot") {
            drawPlot(ctx, prop.x * TILE, prop.y * TILE, t, palette.accent, prop.planted, prop.planted && t >= prop.readyAt);
          }
          else if (prop.kind === "vein") drawVein(ctx, prop.x * TILE, prop.y * TILE, t, palette.accent, prop.charges);
          else if (prop.kind === "oficina") drawOficina(ctx, prop.x * TILE, prop.y * TILE, t, palette.accent, variante);
          else if (prop.kind === "biblioteca") drawBiblioteca(ctx, prop.x * TILE, prop.y * TILE, t, palette.accent, variante);
          else if (prop.kind === "observatorio") drawObservatorio(ctx, prop.x * TILE, prop.y * TILE, t, palette.accent, variante);
          else if (prop.kind === "bilhete") drawBilhete(ctx, prop.x * TILE, prop.y * TILE, t, palette.accent);
          else if (prop.kind === "building") {
            drawBuilding(ctx, prop.x * TILE, prop.y * TILE, prop.w, prop.h, palette, palette.accent);
          }
        },
      });
    }
    // isca no chão fica na mesma fila por y das peças
    if (state.bait && state.bait.until > clock() && dentroDaVista(state.bait.x, state.bait.y, vista)) {
      const b = state.bait;
      drawables.push({ y: b.y, draw: () => drawIsca(ctx, b.x * TILE, b.y * TILE, t, palette.accent) });
    }
    for (const m of state.monsters) {
      if (!m.alive || !dentroDaVista(m.x, m.y, vista)) continue;
      visiveis.monstros++;
      drawables.push({ y: m.y, draw: () => drawMonster(m, t) });
    }
    if (state.boss?.alive && dentroDaVista(state.boss.x, state.boss.y, vista)) {
      visiveis.monstros++;
      drawables.push({ y: state.boss.y, draw: () => drawMonster(state.boss, t) });
    }
    // o companheiro segue pela trilha, um só, com a cara da espécie ativa
    const companion = rpg.activePet();
    if (companion && state.history.length > 14) {
      const trail = state.history[state.history.length - 14];
      if (Math.hypot(trail.x - state.player.x, trail.y - state.player.y) < 5) {
        drawables.push({
          y: trail.y,
          draw: () => drawPetSprite(ctx, companion.kind, trail.x * TILE, trail.y * TILE, t, trail.moving, trail.dir ?? state.player.dir),
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
    const radius = ((inCity ? CITY_LIGHT : state.torchUntil > clock() ? 11 : 8.4) + lightBonus) * TILE * scale;
    const grad = ctx.createRadialGradient(sx, sy, 0, sx, sy, radius);
    grad.addColorStop(0, "rgba(3,5,12,0)");
    grad.addColorStop(0.55, "rgba(3,5,12,0.12)");
    // o breu fecha em 0,74: a sala fora da lanterna fica escura, mas o contorno
    // da parede e o vulto de uma tocha ainda aparecem
    grad.addColorStop(1, inCity ? "rgba(3,5,12,0.52)" : "rgba(3,5,12,0.74)");
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, vw, vh);

    // a luz das tochas volta por cima do breu
    ctx.save();
    ctx.globalCompositeOperation = "lighter";
    const glowSprite = torchGlowSprite();
    for (const prop of state.props) {
      if (prop.kind !== "torch" || !dentroDaVista(prop.x, prop.y, vista)) continue;
      const tx = (prop.x * TILE - camX) * scale;
      const ty = (prop.y * TILE - camY) * scale;
      if (tx < -140 || tx > vw + 140 || ty < -140 || ty > vh + 140) continue;
      // a tocha tremula: o halo respira com a chama
      const r = (5.1 + Math.sin(t * 0.012 + prop.x * 7) * 0.2 + Math.sin(t * 0.0031 + prop.y) * 0.1) * TILE * scale;
      ctx.drawImage(glowSprite, tx - r, ty - r, r * 2, r * 2);
    }
    ctx.restore();

    // custo do quadro, media movel: serve de alarme de regressão de desempenho
    const ms = performance.now() - tQuadro;
    if (!state.stats) state.stats = { drawMs: ms };
    else state.stats.drawMs = state.stats.drawMs * 0.9 + ms * 0.1;
    state.stats.visiveis = visiveis;

    // vida e mana acima do herói, em espaço de tela: o breu não apaga
    if (vitais) {
      const f = fracoesDeVida(vitais());
      const vx = (state.player.x * TILE - camX) * scale;
      const vy = (state.player.y * TILE - camY) * scale - 46;
      const larg = 30, alto = 2, folga = 1;
      ctx.fillStyle = "rgba(8,10,20,0.82)";
      ctx.fillRect(vx - larg / 2, vy, larg, alto * 2 + folga * 3 + 2);
      const x0 = vx - larg / 2 + 1;
      ctx.fillStyle = "#3a1f2c";
      ctx.fillRect(x0, vy + 1, larg - 2, alto);
      ctx.fillStyle = "#ff5a86";
      ctx.fillRect(x0, vy + 1, Math.round((larg - 2) * f.vida), alto);
      ctx.fillStyle = "#16283a";
      ctx.fillRect(x0, vy + 1 + alto + folga, larg - 2, alto);
      ctx.fillStyle = "#6bd5ff";
      ctx.fillRect(x0, vy + 1 + alto + folga, Math.round((larg - 2) * f.mana), alto);
    }
  }

  function drawMonster(m, t) {
    const x = m.x * TILE;
    const y = m.y * TILE;
    const d = Math.hypot(state.player.x - m.x, state.player.y - m.y);
    if (d < m.vision + 3) {
      const ang = directionAngle(m.dir);
      const fov = m.fov ?? 1.2;
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
    drawCreatureArt(ctx, m.kind, m.accent, t + m.x * 90, m.escala || (m.boss ? 1.15 : 0.95), m.dir);
    ctx.restore();
    if (state.alert?.monster === m) {
      ctx.save();
      ctx.fillStyle = "#ffc857";
      ctx.font = "bold 14px monospace";
      ctx.textAlign = "center";
      ctx.fillText("!", x, y - 42);
      ctx.restore();
    } else if (m.dorme) {
      ctx.save();
      ctx.fillStyle = "#8ea0c0";
      ctx.font = "bold 11px monospace";
      ctx.textAlign = "center";
      ctx.globalAlpha = 0.75;
      ctx.fillText("z", x, y - 40);
      ctx.restore();
    } else if (m.ouvindo > clock()) {
      ctx.save();
      ctx.fillStyle = "#b9cdf2";
      ctx.font = "bold 12px monospace";
      ctx.textAlign = "center";
      ctx.globalAlpha = 0.85;
      ctx.fillText("?", x, y - 42);
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
    if (isTextEntry(e.target) || nativeActivation(e)) return;
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
    if (k === "h") {
      onWiki?.();
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
    state.path = null;
    state.pending = null;
    state.player.moving = false;
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
    stopControls: onBlur,
    useTorch(ms = 120000) {
      state.torchUntil = Math.max(state.torchUntil, clock() + ms);
      say("A tocha acende. A caverna fica menor.", 2600);
      updateHud();
    },
    lure(raio = 8, ms = 6000) {
      if (!state.open) return 0;
      const x = state.player.x;
      const y = state.player.y;
      let n = 0;
      for (const m of state.monsters) {
        if (!m.alive || m.boss) continue;
        if (Math.hypot(m.x - x, m.y - y) > raio) continue;
        m.lure = { x, y, until: clock() + ms };
        m.dorme = false;
        n++;
      }
      state.bait = { x, y, until: clock() + ms };
      say(n ? `${n} bicho(s) sentiram a isca.` : "A isca não chamou ninguém.", 2600);
      updateHud();
      return n;
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

// A auditoria usa a mesma colisão do controlador, incluindo os sólidos vivos.

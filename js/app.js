import {
  AREAS, CONTINENTS, CONTINENT_ORDER, SITES, WAYSTONES, SPAWN,
  PLAYER_SPEED, SPRINT_MULT, PLAYER_W, PLAYER_H, INTERACT_RADIUS,
  STORAGE, NET, MAP_W, MAP_H,
} from "./config.js";
import { createWorld } from "./world.js";
import { createRenderer } from "./render.js";
import { createAudio } from "./audio.js";
import { POSTS, NPCS } from "./content.js";
import { Net } from "./net.js";
import { Rede } from "./nostr.js";
import { Quests } from "./quests.js";
import { createSocial } from "./social.js";
import { createBackup } from "./backup.js";
import { createPvp } from "./pvp.js";
import { OUTFITS, outfitById, outfitColors } from "./outfits.js";
import { findPath, nearestWalkable } from "./path.js";
import { feedPeer, peerRenderPosition } from "./interp.js";
import { RPG } from "./rpg.js";
import { ITEMS } from "./rpg-data.js";
import { createSheet } from "./sheet.js";
import { createDuel } from "./duel.js";
import { createDungeon } from "./dungeon.js";
import { CONURBATION, DUNGEONS, dungeonById } from "./dungeon-data.js";

const $ = (id) => document.getElementById(id);
let dungeon = null;

const LIVE = {
  logic: () => import("./zones/logic.js"),
  fractal: () => import("./zones/fractal.js"),
  fourier: () => import("./zones/fourier.js"),
  solid: () => import("./zones/solid.js"),
  echo: () => import("./zones/echo.js"),
  adder: { load: () => import("./zones/cs.js"), variant: "adder" },
  state: { load: () => import("./zones/cs.js"), variant: "state" },
  cpu: { load: () => import("./zones/cs.js"), variant: "cpu" },
  history: { load: () => import("./zones/cs.js"), variant: "timeline" },
  infinity: { load: () => import("./zones/math.js"), variant: "infinity" },
  calculus: { load: () => import("./zones/math.js"), variant: "calculus" },
  probability: { load: () => import("./zones/math.js"), variant: "galton" },
  motion: { load: () => import("./zones/physics.js"), variant: "pendulum" },
  thermo: { load: () => import("./zones/physics.js"), variant: "thermo" },
  optics: { load: () => import("./zones/physics.js"), variant: "optics" },
  gravity: { load: () => import("./zones/physics.js"), variant: "gravity" },
  periodic: { load: () => import("./zones/chem.js"), variant: "periodic" },
  bonds: () => import("./zones/molecule.js"),
  titration: { load: () => import("./zones/chem.js"), variant: "titration" },
  energy: { load: () => import("./zones/chem.js"), variant: "energy" },
  balance: { load: () => import("./zones/chem.js"), variant: "balance" },
  rhythm: { load: () => import("./zones/music.js"), variant: "rhythm" },
  harmony: { load: () => import("./zones/music.js"), variant: "harmony" },
  scales: { load: () => import("./zones/music.js"), variant: "scales" },
  timbre: { load: () => import("./zones/music.js"), variant: "timbre" },
  generative: { load: () => import("./zones/music.js"), variant: "generative" },
  learning: { load: () => import("./zones/ai.js"), variant: "learning" },
  neural: { load: () => import("./zones/ai.js"), variant: "neural" },
  language: { load: () => import("./zones/ai.js"), variant: "language" },
  vision: { load: () => import("./zones/ai.js"), variant: "vision" },
  ethics: { load: () => import("./zones/ai.js"), variant: "ethics" },
};

const world = createWorld();
const renderer = createRenderer($("world"), world);
const audio = createAudio();
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const SITE_BY_POST = new Map(SITES.map((s) => [s.post, s]));
const TOTAL = SITES.length;

const saved = {
  name: readJSON(STORAGE.name, ""),
  room: readJSON(STORAGE.room, NET.defaultRoom),
  sound: readJSON(STORAGE.sound, false),
  cards: new Set(arrayOf(readJSON(STORAGE.cards, []))),
  docks: new Set(arrayOf(readJSON(STORAGE.docks, []))),
  xp: Number(readJSON(STORAGE.xp, 0)) || 0,
};

const savedOutfit = outfitById(readJSON(STORAGE.outfit, "viajante"));
const player = {
  x: SPAWN.x,
  y: SPAWN.y,
  dir: 0,
  moving: false,
  name: saved.name || "viajante",
  outfitId: savedOutfit.id,
  colors: outfitColors(savedOutfit.id),
  bubble: null,
  boost: 0,
  pathLine: null,
  pathGoal: null,
};
player.color = player.colors.shirt;

const state = {
  started: false,
  panelOpen: false,
  panelCleanup: null,
  currentPost: null,
  chatOpen: false,
  chatLog: [],
  modal: null,
  peers: [],
  net: null,
  nearest: null,
  room: sanitizeRoom(saved.room),
  lastContinent: null,
  lastArea: null,
  zoneTimer: null,
  footstepAt: 0,
  cards: saved.cards,
  docks: saved.docks,
  npcMemory: readJSON(STORAGE.npc, {}),
  xp: saved.xp,
  completed: new Set(),
  keys: new Set(),
  touch: { up: false, down: false, left: false, right: false },
  fogDirty: false,
  fogSavedAt: 0,
  sprint: false,
  path: null,
  pending: null,
  lastHp: -1,
  lastHpMax: -1,
  trainingNpc: null,
  pvpDownUntil: 0,
  pvpDownTimer: null,
  steps: readJSON(STORAGE.steps, {}),
  stepsOpen: false,
  stepX: SPAWN.x,
  stepY: SPAWN.y,
  walked: 0,
  lastFocus: null,
};

for (const cid of CONTINENT_ORDER) {
  if (continentComplete(cid)) state.completed.add(cid);
}

const rede = new Rede({ name: player.name });
const backup = createBackup({ rede });
let social = null;
const quests = new Quests({
  getCards: () => state.cards,
  getDocks: () => state.docks,
  gainXp,
  toast,
  onReady: () => { audio.blip(); renderer.kick(0.35); },
  onChange: () => { if (state.modal === "journal") buildJournal(); },
});

const rpg = new RPG({
  gainXp,
  toast,
  audio,
  getLevel: level,
  onRespawn: () => {
    dungeon?.close("death");
    player.x = SPAWN.x;
    player.y = SPAWN.y;
    player.moving = false;
    player.continentId = "hub";
    state.path = null;
    state.pending = null;
    player.pathLine = null;
    player.pathGoal = null;
    state.lastContinent = "hub";
    showZoneCard(CONTINENTS.hub, false);
    renderer.kick(0.7);
    audio.error();
    toast("Você acordou no Porto do Início. A vida voltou cheia.", 5200);
  },
});
const sheetUi = createSheet({
  rpg,
  getLevel: level,
  getXp: () => state.xp,
  getTitle: () => quests.title,
  toast,
  audio,
  onOutfits: () => openOutfits(),
  onPetAbility: (res) => {
    const pet = res.pet?.name || "O bicho";
    if (res.effect === "cura") {
      toast(`${pet} curou ${res.healed} de vida.`, 3000);
      audio.blip();
      return;
    }
    if (res.effect === "mana") {
      toast(`${pet} devolveu ${res.mana} de mana.`, 2800);
      audio.blip();
      return;
    }
    if (res.effect === "ritmo") {
      toast(`${pet} marcou o ritmo: +1 de dano por dois minutos.`, 3200);
      audio.chime();
    }
  },
  onUse: (id, res) => {
    if (id === "tocha") {
      if (dungeon?.isOpen()) {
        dungeon.useTorch(res.light);
        return true;
      }
      rpg.addItem("tocha", 1);
      toast("A tocha é para a caverna. Guardei de volta.", 2800);
      return false;
    }
    if (id === "bomba") {
      if (dungeon?.isOpen()) {
        dungeon.useBomb();
        return true;
      }
      rpg.addItem("bomba", 1);
      toast("A bomba é para a caverna. Guardei de volta.", 2800);
      return false;
    }
    if (id.startsWith("runa-")) {
      rpg.addItem(id, 1);
      toast("A runa é para a pergunta do duelo. Guardei de volta.", 2800);
      return false;
    }
    return true;
  },
});
let duelUi = null;
duelUi = createDuel({
  rpg,
  toast,
  audio,
  onClose: () => closeModal("duel"),
  onVictory: () => { quests.report("hunts"); markStep("duel"); },
});

const pvpUi = createPvp({
  rpg,
  toast,
  audio,
  player,
  getNet: () => state.net,
  isBusy: () => !!(state.panelOpen || state.chatOpen || dungeon?.isOpen() || (state.modal && state.modal !== "pvp")),
  signer: (text) => rede.signText(text),
  verifier: (event, text) => rede.verifyText(event, text),
  openPanel: () => openModal("pvp"),
  closePanel: () => closeModal("pvp"),
  onDown: (ms) => knockDown(ms),
});

dungeon = createDungeon({
  rpg,
  audio,
  isBlocked: () => state.panelOpen || !!state.modal || state.chatOpen,
  onEncounter: (monster, ground, boss, partner) => {
    openDuel(monster, ground, boss, partner);
    return !!rpg.duel;
  },
  onSheet: () => openSheet(),
  onKeeper: () => openShop(),
  onConurbation: () => openTravel("caves"),
  onPortal: (defId) => portalToCity(defId),
  avatar: player.colors,
  onExit: ({ kind, dungeon: def, target }) => {
    rpg.setCave(false);
    if (kind === "death") return;
    const cave = target || world.caves.find((c) => c.continent === def?.continent);
    if (cave) {
      player.x = cave.exit.x;
      player.y = cave.exit.y;
      player.dir = 0;
      player.moving = false;
      player.continentId = cave.continent;
      clearPath();
      state.lastContinent = cave.continent;
      showZoneCard(CONTINENTS[cave.continent], false);
      renderer.kick(0.45);
    }
    audio.chime();
    toast(
      kind === "waystone"
        ? `A pedra te devolveu a ${cave?.name || "a boca da caverna"}.`
        : cave
          ? `Você subiu em ${cave.name}.`
          : "Você subiu de volta para o sol.",
      3400,
    );
  },
});

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}
function arrayOf(v) { return Array.isArray(v) ? v : []; }
function writeJSON(key, value) {
  try { localStorage.setItem(key, JSON.stringify(value)); } catch { /* sem storage */ }
}
function sanitizeRoom(value) {
  const r = String(value || "").toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 24);
  return r || NET.defaultRoom;
}
function hashRoom() {
  const m = location.hash.match(/(?:^#|&)sala=([a-z0-9-]{1,24})/i);
  return m ? m[1].toLowerCase() : null;
}
function level() { return 1 + Math.floor(state.xp / 60); }
function openedCount() {
  let n = 0;
  for (const s of SITES) if (state.cards.has(s.post)) n++;
  return n;
}
function sitesOf(cid) { return SITES.filter((s) => s.continent === cid); }
function continentOpened(cid) {
  return sitesOf(cid).filter((s) => state.cards.has(s.post)).length;
}
function continentComplete(cid) {
  const sites = sitesOf(cid);
  return sites.length > 0 && sites.every((s) => state.cards.has(s.post));
}

// a província é o continente original, sem as áreas temáticas: o traje pede as
// cinco estações da ilha principal, não as estações extras das beiradas.
function provinceComplete(cid) {
  const sites = sitesOf(cid).filter((s) => !world.areaAt(s.x, s.y));
  return sites.length > 0 && sites.every((s) => state.cards.has(s.post));
}

const toastQueue = [];
function toast(message, ms = 2600) {
  if (toastQueue.length >= 3) toastQueue.shift();
  toastQueue.push({ message, ms });
  if (!toast._busy) pumpToast();
}
function pumpToast() {
  const el = $("toast");
  const item = toastQueue.shift();
  if (!item) { toast._busy = false; return; }
  toast._busy = true;
  el.textContent = item.message;
  el.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => {
    el.hidden = true;
    toast._t = setTimeout(pumpToast, 240);
  }, item.ms);
}

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
}

function adoptName(name) {
  const clean = String(name || "").replace(/[<>\u0000-\u001f]/g, "").trim().slice(0, 16);
  if (!clean) return;
  player.name = clean;
  writeJSON(STORAGE.name, clean);
  rede.setName(clean);
  if (state.net) state.net.setName(clean);
  $("intro-name").value = clean;
}

function bootSocial() {
  if (social) return;
  social = createSocial({
    rede,
    backup,
    quests,
    player,
    getPeers: () => state.peers,
    getNet: () => state.net,
    getLevel: level,
    getTitle: () => quests.title,
    setName: adoptName,
    toast,
    audio,
    onChallenge: (peer) => {
      closeModal("rede");
      pvpUi.challenge(peer);
    },
  });
  social.connect();
  rede.init()
    .then(async () => {
      if (state.net) state.net.setIdentity(rede.pk);
      // conta nova num navegador novo: o estado volta da DM do próprio jogador
      const back = await backup.restoreIfEmpty();
      if (back.restored) {
        toast("sua conta voltou da sua DM no Nostr. Recarregando o mundo.", 5200);
        setTimeout(() => location.reload(), 1800);
        return;
      }
      backup.start();
    })
    .catch(() => {});
}

function outfitUnlocked(outfit) {
  return outfit.continent === "hub" || provinceComplete(outfit.continent);
}

function applyOutfit(id) {
  const outfit = outfitById(id);
  if (!outfitUnlocked(outfit)) return false;
  Object.assign(player.colors, outfit.colors);
  player.outfitId = outfit.id;
  player.color = player.colors.shirt;
  writeJSON(STORAGE.outfit, outfit.id);
  state.net?.setOutfit?.(outfit.id);
  state.net?.setColor?.(player.color);
  renderer.kick(0.25);
  return true;
}

function openOutfits() {
  if (!state.started) return;
  stopSprint();
  closeChat();
  if (state.panelOpen) closePanel();
  const unlocked = OUTFITS.filter(outfitUnlocked).length;
  $("outfits-sub").textContent = unlocked === OUTFITS.length
    ? "todos os trajes abertos. A roupa vale no mapa e na caverna."
    : `${unlocked} de ${OUTFITS.length} trajes. Cada continente completo abre o traje dele.`;
  const body = $("outfits-body");
  body.textContent = "";
  const grid = el("div", "outfit-grid");
  for (const outfit of OUTFITS) {
    const open = outfitUnlocked(outfit);
    const card = el("button", `outfit-card${player.outfitId === outfit.id ? " on" : ""}${open ? "" : " locked"}`);
    card.type = "button";
    card.disabled = !open;
    const swatch = el("span", "outfit-swatch");
    for (const key of ["hair", "shirt", "pants", "accent"]) {
      const chip = el("i");
      chip.style.background = outfit.colors[key];
      swatch.appendChild(chip);
    }
    card.append(
      swatch,
      el("b", "", outfit.name),
      el("span", "", open ? outfit.desc : `complete as 5 estações de ${CONTINENTS[outfit.continent]?.name || "um continente"}`),
    );
    if (open) {
      card.addEventListener("click", () => {
        if (!applyOutfit(outfit.id)) return;
        toast(`traje: ${outfit.name}`, 2600);
        audio.blip();
        openOutfits();
      });
    }
    grid.appendChild(card);
  }
  body.appendChild(grid);
  openModal("outfits");
  audio.open();
}

function openShop() {
  const def = dungeon?.state?.def;
  if (!def) return;
  const body = $("shop-body");
  body.textContent = "";
  const offers = (def.equipment || []).map((id) => ({ id, ...ITEMS[id], price: rpg.priceFor(id) }));
  $("shop-title").textContent = `Loja de ${CONTINENTS[def.continent]?.name || def.name}`;
  const mats = ["ferro", "veio", "erva", "madeira"].map((id) => `${ITEMS[id]?.name || id} ${rpg.itemCount(id)}`).join(" · ");
  $("shop-sub").textContent = `A mestra troca material por peça. ${mats}.`;
  if (!offers.length) {
    body.appendChild(el("p", "shop-empty", "A mestra não tem peça desta caverna hoje."));
  }
  const grid = el("div", "shop-grid");
  for (const item of offers) {
    const owned = rpg.itemCount(item.id) > 0;
    const can = !owned && Object.entries(item.price || {}).every(([mat, qty]) => rpg.itemCount(mat) >= qty);
    const card = el("div", `shop-card${owned ? " owned" : ""}`);
    const bonus = [item.damage ? `+${item.damage} dano` : "", item.hp ? `+${item.hp} vida` : ""].filter(Boolean).join(" · ");
    card.append(
      el("b", "", item.name),
      el("span", "", `${item.slot}${bonus ? ` · ${bonus}` : ""}`),
      el("i", "", Object.entries(item.price || {}).map(([mat, qty]) => `${ITEMS[mat]?.name || mat} ×${qty}`).join(" · ")),
    );
    if (owned) card.appendChild(el("em", "", "já é sua"));
    else {
      const buy = el("button", "shop-buy", can ? "comprar" : "falta material");
      buy.type = "button";
      buy.disabled = !can;
      buy.addEventListener("click", () => {
        const res = rpg.buy(item.id);
        if (!res.ok) { toast(res.reason, 2800); return; }
        audio.chime();
        toast(`${item.name} é sua.`, 2600);
        openShop();
      });
      card.appendChild(buy);
    }
    grid.appendChild(card);
  }
  body.appendChild(grid);
  openModal("shop");
  audio.open();
}

function openSheet() {
  if (!state.started) return;
  stopSprint();
  if (state.panelOpen) closePanel();
  closeChat();
  sheetUi.render();
  openModal("sheet");
  audio.open();
}

function openDuel(monster, ground, boss = false, partner = null) {
  if (!duelUi.open(monster, ground, boss, partner)) return;
  openModal("duel");
  audio.open();
}

function openTraining(npc) {
  state.trainingNpc = npc;
  const name = NPCS[npc.id]?.name || "o instrutor";
  const continent = CONTINENTS[npc.continent]?.name || "o continente";
  $("training-title").textContent = `Treino com ${name}`;
  $("training-sub").textContent = `Aqui você erra sem perder vida. O bicho de verdade espera na caverna de ${continent}.`;
  openModal("training");
  audio.open();
}

function startTraining(tier) {
  const npc = state.trainingNpc;
  if (!npc || !duelUi) return;
  const def = dungeonById(`dungeon-${npc.continent}`);
  const names = def?.monsters || ["Bicho de Treino"];
  const rooms = (def?.rooms || []).filter((r) => r.kind !== "entrance" && r.kind !== "city");
  const theme = rooms[Math.floor(Math.random() * rooms.length)]?.theme || "";
  const monster = {
    name: names[Math.floor(Math.random() * names.length)],
    kind: tier >= 3 ? "golem" : tier === 2 ? "eye" : "slime",
    tier,
    level: tier * 3,
  };
  if (!duelUi.openTraining(npc.continent, tier, theme, monster)) return;
  openModal("duel");
  audio.open();
}


function enterCave(cave) {
  if (!state.started) return;
  stopSprint();
  clearPath();
  closeChat();
  if (state.panelOpen) closePanel();
  closeModal(state.modal);
  const pair = world.caves.find((c) => c.id === cave.pairId);
  rpg.setCave(true);
  const ok = dungeon?.open(cave.defId || cave.id, pair ? { ...cave, pair } : cave);
  if (ok) markStep("cave");
  if (!ok) {
    rpg.setCave(false);
    toast("A caverna não abriu agora. Tente de novo.", 3000);
    audio.error();
    return;
  }
  toast(cave.name, 3000);
}

function interactTarget(target) {
  if (!target) return;
  if (target.kind === "station") openPost(target.obj.post, target.obj);
  else if (target.kind === "waystone") openTravel();
  else if (target.kind === "npc") {
    markStep("npc");
    const npc = target.obj;
    const lines = NPCS[npc.id]?.lines || ["..."];
    npc.lineIndex = ((npc.lineIndex || 0) + 1) % lines.length;
    npc.bubble = { text: lines[npc.lineIndex], until: performance.now() + 6500 };
    if (npc.trainer) openTraining(npc);
    else openNpc(npc);
  }
  else if (target.kind === "cave") enterCave(target.obj);
}

function openRede() {
  if (!state.started) return;
  if (state.panelOpen) closePanel();
  closeChat();
  bootSocial();
  social.open();
  openModal("rede");
  audio.open();
}

function buildJournalQuests() {
  const box = $("journal-quests");
  if (!box) return;
  box.textContent = "";
  const active = quests.active();
  const done = quests.done();
  if (!active.length && !done.length) {
    box.appendChild(el("p", "quest-empty", "Nenhuma missão ainda. Procure os NPCs perto das estações: eles têm o que pedir."));
    return;
  }
  for (const q of active) {
    const { have, need } = quests.progress(q);
    const card = el("div", "quest-card");
    const head = el("div", "quest-head");
    head.append(el("b", "", q.title), el("span", "quest-giver", q.giver));
    const bar = el("div", "quest-bar");
    const fill = el("i");
    fill.style.width = `${need ? Math.round((have / need) * 100) : 0}%`;
    bar.appendChild(fill);
    const foot = el("div", "quest-foot");
    foot.append(el("span", "", `${have}/${need}`), el("span", "", quests.ready(q) ? `volte a ${q.giver}` : "em andamento"));
    card.append(head, el("p", "quest-brief", q.brief), bar, foot);
    box.appendChild(card);
  }
  for (const q of done) {
    const card = el("div", "quest-card done");
    const head = el("div", "quest-head");
    head.append(el("b", "", q.title), el("span", "quest-giver", q.giver));
    card.append(head, el("p", "quest-brief", "concluída."));
    box.appendChild(card);
  }
}

function questCard(q, npc) {
  const card = el("div", `quest-card${quests.isDone(q.id) ? " done" : ""}`);
  const head = el("div", "quest-head");
  head.append(el("b", "", q.title), el("span", "quest-giver", q.giver));
  card.appendChild(head);
  card.appendChild(el("p", "quest-brief", q.brief));
  if (quests.isDone(q.id)) {
    card.appendChild(el("p", "quest-note", "concluída. O título é seu."));
    return card;
  }
  if (!quests.isAccepted(q.id)) {
    const btn = el("button", "quest-btn", "aceitar missão");
    btn.type = "button";
    btn.addEventListener("click", () => {
      if (quests.accept(q.id)) { markStep("quest"); audio.blip(); buildNpc(npc); }
    });
    card.appendChild(btn);
    return card;
  }
  const { have, need } = quests.progress(q);
  const bar = el("div", "quest-bar");
  const fill = el("i");
  fill.style.width = `${need ? Math.round((have / need) * 100) : 0}%`;
  bar.appendChild(fill);
  card.appendChild(bar);
  card.appendChild(el("div", "quest-foot", `${have}/${need}`));

  if (q.quiz && !quests.data.quiz[q.id]) {
    const box = el("div", "quest-quiz");
    box.appendChild(el("p", "quest-question", q.quiz.question));
    q.quiz.options.forEach((opt, i) => {
      const b = el("button", "quest-option", opt);
      b.type = "button";
      b.addEventListener("click", () => {
        const res = quests.answer(q.id, i);
        state.npcFeedback = { id: q.id, correct: res.correct, why: res.why };
        if (res.correct) audio.chime(); else audio.blip();
        buildNpc(npc);
      });
      box.appendChild(b);
    });
    card.appendChild(box);
  }

  const fb = state.npcFeedback;
  if (fb && fb.id === q.id) {
    card.appendChild(el("p", `quest-note ${fb.correct ? "good" : "bad"}`,
      fb.correct ? `certo. ${fb.why}` : "não é essa. Leia de novo e tente outra."));
  }

  if (quests.ready(q)) {
    const btn = el("button", "quest-btn ready", `concluir · +${q.reward?.xp || 0} XP`);
    btn.type = "button";
    btn.addEventListener("click", () => {
      const res = quests.complete(q.id);
      if (!res.ok) return;
      toast(`Missão concluída: ${q.title}. +${res.xp} XP${res.title ? ` · título ${res.title}` : ""}`, 5200);
      audio.chime();
      renderer.kick(0.5);
      buildNpc(npc);
    });
    card.appendChild(btn);
  } else if (!q.quiz) {
    card.appendChild(el("p", "quest-note", "em andamento."));
  }
  return card;
}

function buildNpc(npc) {
  const data = NPCS[npc.id];
  $("npc-title").textContent = data?.name || "Alguém do mundo";
  const body = $("npc-body");
  body.textContent = "";
  const lines = data?.lines || [];
  const visits = state.npcMemory?.[npc.id] || 0;
  const done = quests.done().length;
  const context = [];
  if (quests.title) context.push(`Ouvi falar de você: ${quests.title}.`);
  else if (done) context.push(`Você já fechou ${done} missão(ões). O porto comenta.`);
  if (npc.continent && continentComplete(npc.continent)) {
    context.push("Esta ilha já está toda aberta para você. Agora é escolher o que revisitar.");
  }
  // o NPC reconhece o que falta na província ou na área onde ele mora
  if (npc.continent && npc.continent !== "hub") {
    const area = world.areaAt(npc.x, npc.y);
    const missing = sitesOf(npc.continent).find((site) => {
      if (state.cards.has(site.post)) return false;
      const siteArea = world.areaAt(site.x, site.y);
      return area ? siteArea?.id === area.id : !siteArea;
    });
    if (missing) context.push(`Ainda falta abrir ${missing.name}.`);
  }
  const active = quests.active().find((quest) => quest.npc === npc.id);
  if (active) context.push(`A missão "${active.title}" está de pé.`);
  if (visits >= 3) context.push(`Já são ${visits} conversas. O nome já é conhecido por aqui.`);
  for (const line of context.slice(0, 3)) body.appendChild(el("p", "npc-line npc-context", line));
  const lineIdx = visits > 0 ? (visits - 1) % Math.max(1, lines.length) : 0;
  if (lines.length) {
    body.appendChild(el("p", "npc-line", lines[lineIdx]));
    if (lines.length > 1) {
      const deep = el("button", "npc-deep", "puxar conversa");
      deep.type = "button";
      let step = 0;
      deep.addEventListener("click", () => {
        step++;
        const next = (lineIdx + step) % lines.length;
        deep.before(el("p", "npc-line npc-context", lines[next]));
        audio.click?.();
        if (step >= lines.length - 1) deep.remove();
      });
      body.appendChild(deep);
    }
  }
  const offers = quests.offersFor(npc.id);
  if (!offers.length) {
    body.appendChild(el("p", "npc-muted", "Este viajante só tem histórias por enquanto."));
    return;
  }
  body.appendChild(el("h3", "npc-sec", "missões"));
  for (const q of offers) body.appendChild(questCard(q, npc));
}

function openNpc(npc) {
  if (state.panelOpen) closePanel();
  closeChat();
  state.npc = npc;
  state.npcFeedback = null;
  state.npcMemory[npc.id] = (state.npcMemory[npc.id] || 0) + 1;
  saveNpcMemory();
  buildNpc(npc);
  openModal("npc");
  audio.open();
}

function saveCards() { writeJSON(STORAGE.cards, Array.from(state.cards)); }
function saveNpcMemory() { writeJSON(STORAGE.npc, state.npcMemory); }
function saveDocks() { writeJSON(STORAGE.docks, Array.from(state.docks)); }
function saveXp() { writeJSON(STORAGE.xp, state.xp); }

let questTrackAt = 0;
function updateQuestTrack(now = 0) {
  if (now && now - questTrackAt < 900) return;
  questTrackAt = now;
  const box = $("quest-track");
  if (!box) return;
  const active = state.started ? quests.active() : [];
  if (!active.length) { box.hidden = true; return; }
  box.hidden = false;
  box.textContent = "";
  box.appendChild(el("b", "", "missões em andamento"));
  for (const quest of active.slice(0, 3)) {
    const { have, need } = quests.progress(quest);
    const line = el("span", "");
    line.append(document.createTextNode(quest.title), el("i", "", ` ${have}/${need}`));
    box.appendChild(line);
  }
}

function updateProgress() {
  $("progress-text").textContent = `${openedCount()}/${TOTAL}`;
  $("level-text").textContent = `Nv ${level()}`;
}

function gainXp(n) {
  const before = level();
  state.xp += n;
  saveXp();
  updateProgress();
  const after = level();
  if (after > before) {
    rpg.heal((after - before) * 4);
    setTimeout(() => {
      toast(`Nível ${after}. Você está ficando bom nisso.`, 3200);
      audio.chime();
      renderer.kick(0.55);
    }, 900);
  }
}

const FIRST_STEPS = [
  { id: "walk", label: "ande pelo mapa (WASD ou clique no chão)" },
  { id: "station", label: "abra uma estação de estudo" },
  { id: "npc", label: "converse com um NPC" },
  { id: "quest", label: "aceite uma missão" },
  { id: "cave", label: "desça numa caverna" },
  { id: "duel", label: "vença um duelo de perguntas" },
];

function markStep(id) {
  if (state.steps[id]) return false;
  state.steps[id] = true;
  writeJSON(STORAGE.steps, state.steps);
  renderSteps();
  audio.blip();
  const done = FIRST_STEPS.filter((s2) => state.steps[s2.id]).length;
  if (done === FIRST_STEPS.length) {
    toast("Primeiros passos completos. O arquipélago é seu.", 4200);
  } else {
    const next = FIRST_STEPS.find((s2) => !state.steps[s2.id]);
    toast(`Primeiro passo ${done}/${FIRST_STEPS.length}. Próximo: ${next.label}.`, 2600);
  }
  return true;
}

function renderSteps() {
  const card = $("steps");
  const list = $("steps-list");
  if (!card || !list) return;
  const done = FIRST_STEPS.filter((s2) => state.steps[s2.id]).length;
  list.textContent = "";
  let next = "";
  for (const step of FIRST_STEPS) {
    const ok = !!state.steps[step.id];
    const li = document.createElement("li");
    li.className = ok ? "done" : "";
    li.textContent = step.label;
    list.appendChild(li);
    if (!ok && !next) next = step.label;
  }
  $("steps-next").textContent = next ? `agora: ${next}` : "tudo pronto, siga o mapa";
  card.classList.toggle("all-done", done === FIRST_STEPS.length);
  card.hidden = !(state.started && (state.stepsOpen || done < FIRST_STEPS.length));
}

function markCard(postId) {
  if (!postId || state.cards.has(postId)) return false;
  state.cards.add(postId);
  markStep("station");
  saveCards();
  updateProgress();
  audio.blip();
  const site = SITE_BY_POST.get(postId);
  const cid = site?.continent;
  toast(`+12 XP · fragmento ${openedCount()}/${TOTAL}`, 2200);
  gainXp(12);
  if (cid) checkContinent(cid);
  quests.report("card", postId);
  return true;
}

function checkContinent(cid) {
  if (state.completed.has(cid) || !continentComplete(cid)) return;
  state.completed.add(cid);
  gainXp(30);
  const c = CONTINENTS[cid];
  setTimeout(() => {
    toast(`${c.name} concluído. +30 XP · todos os fragmentos do continente.`, 4800);
    audio.chime();
    renderer.kick(0.8);
  }, 500);
  updateProgress();
}

function markDock(cid) {
  if (!cid || state.docks.has(cid)) return false;
  state.docks.add(cid);
  saveDocks();
  quests.report("dock", cid);
  return true;
}

function setSound(on) {
  saved.sound = on;
  writeJSON(STORAGE.sound, on);
  const btn = $("btn-sound");
  btn.setAttribute("aria-pressed", on ? "true" : "false");
  btn.textContent = on ? "Som on" : "Som off";
  if (on) { audio.setEnabled(true); audio.unlock(); }
  else audio.setEnabled(false);
}

function setNetStatus({ state: s, count }) {
  const pill = $("net-pill");
  const label = $("online");
  pill.classList.toggle("on", s === "online");
  if (s === "online") {
    label.textContent = count > 1 ? `${count} aqui` : "só você";
    pill.title = "Clique para copiar o convite desta sala";
  } else if (s === "connecting") {
    label.textContent = "ligando";
    pill.title = "Procurando a praça compartilhada";
  } else if (s === "offline") {
    label.textContent = "sem sinal";
    pill.title = "Sem sinal agora; o mundo segue sozinho";
  } else {
    label.textContent = "solo";
    pill.title = "Modo solo. Recarregue para tentar a praça compartilhada.";
  }
}
function updateOnlineCount() {
  if (!state.net) return;
  if ($("net-pill").classList.contains("on")) {
    $("online").textContent = state.peers.length > 0
      ? `${state.peers.length + 1} aqui` : "só você";
  }
}
function setPeers(peers) {
  const now = performance.now();
  for (const peer of peers) {
    if (!peer.samples) {
      peer.samples = [];
      peer.rx = peer.x;
      peer.ry = peer.y;
    }
    feedPeer(peer, now, NET.stateEvery, NET.interpDelay);
  }
  state.peers = peers;
  updateOnlineCount();
}
function startNet() {
  if (state.net) return;
  $("room-label").textContent = `sala ${state.room}`;
  state.net = new Net({
    room: state.room,
    name: player.name,
    color: player.color,
    outfit: player.outfitId,
    onPeers: setPeers,
    onStatus: setNetStatus,
    onChat: (peer, text) => {
      audio.blip();
      pushChatMessage(peer.name, text, peer.color);
    },
    onPvp: (peer, msg) => pvpUi.handle(peer, msg),
    onParty: (peer, msg) => social?.partyEvent?.(peer, msg),
    onError: () => {},
  });
  state.net.connect();
}

function startGame() {
  state.started = true;
  document.activeElement?.blur?.();
  rede.setName(player.name);
  $("intro").hidden = true;
  $("minimap").hidden = false;
  renderSteps();
  document.body.classList.add("playing");
  if (window.matchMedia("(pointer: coarse)").matches) $("touch").hidden = false;
  audio.unlock();
  if (saved.sound) setSound(true); else setSound(false);
  history.replaceState(null, "", `#sala=${state.room}`);
  $("room-label").textContent = `sala ${state.room}`;
  loadChatLog();
  player.continentId = "hub";
  if ($("intro-net").checked) { startNet(); bootSocial(); } else setNetStatus({ state: "solo", count: 1 });
  const first = !state.docks.has("hub");
  markDock("hub");
  state.lastContinent = "hub";
  showZoneCard(CONTINENTS.hub, first);
  updateProgress();
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (coarse) {
    document.querySelector("#prompt kbd").textContent = "A";
    setTimeout(() => toast("toque no chão para andar, Turbo acelera e A interage. Os botões do topo abrem Falar, Rede, Diário e Ficha.", 5200), 800);
  } else {
    setTimeout(() => toast("WASD ou clique no chão anda, Espaço acende a nave, F interage, Q fala, E Rede, Z diário, C ficha.", 5400), 800);
  }
}

function showZoneCard(region, first, area = false) {
  if (!region) return;
  const card = $("zone-card");
  $("zone-eyebrow").textContent = first
    ? (area ? "nova área descoberta" : "novo continente descoberto")
    : (area ? "de volta à" : "de volta ao");
  $("zone-name").textContent = region.name;
  $("zone-sub").textContent = region.sub;
  card.style.setProperty("--zone", region.accent);
  card.hidden = true;
  void card.offsetWidth;
  card.hidden = false;
  clearTimeout(state.zoneTimer);
  state.zoneTimer = setTimeout(() => { card.hidden = true; }, 4800);
  if (first) { renderer.kick(0.7); audio.chime(); }
}

function knockDown(ms) {
  stopSprint();
  clearPath();
  state.pvpDownUntil = performance.now() + ms;
  document.body.classList.add("pvp-down");
  clearTimeout(state.pvpDownTimer);
  state.pvpDownTimer = setTimeout(() => {
    state.pvpDownUntil = 0;
    document.body.classList.remove("pvp-down");
    toast("Você voltou. Ande quando quiser.", 2400);
  }, ms);
}

function stopSprint() {
  state.sprint = false;
  clearPath();
  $("touch-sprint")?.classList.remove("active");
}

function openJournal() {
  stopSprint();
  if (state.panelOpen) closePanel();
  closeChat();
  buildJournal();
  openModal("journal");
  audio.open();
}

function buildJournalBestiary() {
  const box = $("journal-bestiary");
  if (!box) return;
  box.textContent = "";
  const seen = rpg.seenView();
  if (!seen.length) {
    box.appendChild(el("p", "journal-empty", "Nenhum bicho visto ainda. Os monstros moram nas cavernas; a superfície é sala de aula."));
    return;
  }
  const grid = el("div", "bestiary-grid");
  for (const entry of seen) {
    const card = el("div", `bestiary-card t${entry.tier}`);
    card.append(
      el("b", "", entry.name),
      el("span", "", `${entry.label} · andar ${entry.tier === 4 ? "chefe" : entry.tier}`),
      el("span", "", entry.theme ? `tema: ${entry.theme}` : "tema: ainda não visto"),
      el("span", "", `fraqueza: ${entry.weakness}`),
      el("i", "", `${entry.count} encontro${entry.count === 1 ? "" : "s"}`),
    );
    if (entry.sample) card.appendChild(el("em", "bestiary-q", `“${entry.sample}”`));
    grid.appendChild(card);
  }
  box.appendChild(grid);
}

function buildJournal() {
  buildJournalBestiary();
  const list = $("journal-list");
  list.textContent = "";
  const found = openedCount();
  $("journal-progress").textContent =
    `${found} de ${TOTAL} fragmentos · Nível ${level()} · ${state.xp} XP${quests.title ? ` · título ${quests.title}` : ""}. Cada estação do arquipélago esconde uma página.`;
  for (const cid of CONTINENT_ORDER) {
    const continent = CONTINENTS[cid];
    const sites = sitesOf(cid);
    if (!sites.length) continue;
    const opened = continentOpened(cid);
    const done = opened === sites.length;
    const head = document.createElement("div");
    head.className = "journal-continent";
    head.innerHTML = `<h3>${continent.name} <span class="${done ? "done" : ""}">${opened}/${sites.length}${done ? " · selo" : ""}</span></h3>`;
    list.appendChild(head);
    const groups = [
      { title: "", sites: sites.filter((site) => !world.areaAt(site.x, site.y)) },
      ...AREAS.filter((area) => area.continent === cid).map((area) => ({
        title: area.name,
        sites: sites.filter((site) => world.areaAt(site.x, site.y)?.id === area.id),
      })),
    ].filter((group) => group.sites.length);
    for (const group of groups) {
      if (group.title) {
        const sub = document.createElement("div");
        sub.className = "journal-area";
        sub.textContent = group.title;
        list.appendChild(sub);
      }
    for (const site of group.sites) {
      const unlocked = state.cards.has(site.post);
      const post = POSTS[site.post];
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "journal-item";
      btn.disabled = !unlocked;
      const left = document.createElement("span");
      const b = document.createElement("b");
      b.textContent = unlocked ? (post?.title || site.name) : "???";
      const sub = document.createElement("span");
      sub.textContent = unlocked
        ? `${site.name} · ${post?.read || ""} · ${site.label}`
        : `${site.name} · ainda não aberto`;
      left.append(b, sub);
      const right = document.createElement("em");
      right.textContent = unlocked ? "abrir" : "selado";
      btn.append(left, right);
      if (unlocked) {
        btn.addEventListener("click", () => {
          closeModal("journal");
          openPost(site.post, site);
        });
      }
      list.appendChild(btn);
    }
    }
  }
  buildJournalQuests();
}

function openTravel(mode = "stones") {
  stopSprint();
  if (state.panelOpen) closePanel();
  closeChat();
  state.travelMode = mode;
  const caves = mode === "caves";
  $("travel-title").textContent = caves ? "Túneis da Conurbação" : "Pedras do Porto";
  $("travel-lead").textContent = caves
    ? "As cidades subterrâneas se ligam por túneis antigos. Escolha a cidade de destino; a saída devolve você à boca daquela caverna."
    : "Os faróis que você já acendeu podem ser alcançados num piscar. Os outros continuam escondidos na névoa.";
  buildTravel();
  openModal("travel");
  audio.open();
}

function buildTravel() {
  const list = $("travel-list");
  list.textContent = "";
  if (state.travelMode === "caves") {
    const here = dungeon?.state?.def?.id;
    const under = document.createElement("button");
    under.type = "button";
    under.className = "travel-item";
    under.disabled = here === CONURBATION.id;
    const underLeft = document.createElement("span");
    const underTitle = document.createElement("b");
    underTitle.textContent = "Porto Submerso · camada -2";
    const underSub = document.createElement("span");
    underSub.textContent = here === CONURBATION.id ? "você está aqui" : "descer e escolher uma capital";
    underLeft.append(underTitle, underSub);
    const underRight = document.createElement("em");
    underRight.textContent = here === CONURBATION.id ? "aqui" : "descer";
    under.append(underLeft, underRight);
    if (here !== CONURBATION.id) under.addEventListener("click", enterUnderworld);
    list.appendChild(under);
    for (const def of DUNGEONS) {
      const known = state.docks.has(def.continent);
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "travel-item";
      btn.disabled = def.id === here || !known;
      const left = document.createElement("span");
      const b = document.createElement("b");
      b.textContent = `${CONTINENTS[def.continent]?.name || def.continent} · ${def.name}`;
      const sub = document.createElement("span");
      sub.textContent = def.id === here ? "você está nesta cidade" : known ? "túnel aberto" : "abra a pedra do continente primeiro";
      left.append(b, sub);
      const right = document.createElement("em");
      right.textContent = def.id === here ? "aqui" : known ? "ir" : "trancado";
      btn.append(left, right);
      if (def.id !== here && known) btn.addEventListener("click", () => travelConurbation(def.id));
      list.appendChild(btn);
    }
    return;
  }
  for (const cid of CONTINENT_ORDER) {
    const c = CONTINENTS[cid];
    const stones = WAYSTONES.filter((w) => w.continent === cid);
    if (!stones.length) continue;
    const known = cid === "hub" || state.docks.has(cid);
    const sites = sitesOf(cid);
    const opened = continentOpened(cid);
    // com área temática, o mesmo continente pode ter mais de uma pedra
    for (const stone of stones) {
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "travel-item";
      btn.disabled = !known;
      const left = document.createElement("span");
      const b = document.createElement("b");
      b.textContent = stones.length > 1 ? `${c.name} · ${stone.name}` : c.name;
      const s = document.createElement("span");
      s.textContent = known
        ? `${sites.length ? `${opened}/${sites.length} fragmentos · ` : ""}${stone.name}`
        : "na névoa, siga a pé até lá";
      left.append(b, s);
      const right = document.createElement("em");
      right.textContent = known ? "viajar" : "trancado";
      btn.append(left, right);
      if (known) btn.addEventListener("click", () => travelTo(stone.id));
      list.appendChild(btn);
    }
  }
}

function enterUnderworld() {
  const current = dungeon?.state?.def?.id;
  const cave = world.caves.find((c) => c.defId === current && c.mouth === "entrance") || dungeon?.state?.entryCave || null;
  closeModal("travel");
  dungeon.open(CONURBATION, cave);
  toast("Porto Submerso. A camada -2 liga as capitais por baixo do mar.", 3600);
  audio.chime();
}

function portalToCity(defId) {
  const target = DUNGEONS.find((def) => def.id === defId);
  if (!target) return;
  const cave = world.caves.find((c) => c.defId === defId && c.mouth === "entrance");
  dungeon.open(target, cave);
  dungeon.enterCity();
  player.continentId = target.continent;
  state.lastContinent = target.continent;
  toast(`Portal do Porto Submerso: ${target.name}.`, 3200);
  audio.chime();
}

function travelConurbation(defId) {
  const target = DUNGEONS.find((def) => def.id === defId);
  if (!target) return;
  const cave = world.caves.find((c) => c.defId === defId && c.mouth === "entrance");
  closeModal("travel");
  dungeon.open(target, cave);
  dungeon.enterCity();
  player.continentId = target.continent;
  state.lastContinent = target.continent;
  toast(`Túnel da conurbação: ${target.name}.`, 3200);
  audio.chime();
}

function travelTo(cid) {
  const stone = WAYSTONES.find((w) => w.id === cid) || WAYSTONES.find((w) => w.continent === cid);
  if (!stone) return;
  const spots = [
    [stone.x, stone.y + 1.8], [stone.x, stone.y - 1.8],
    [stone.x + 1.8, stone.y], [stone.x - 1.8, stone.y],
    [stone.x, stone.y + 2.6], [stone.x + 2.6, stone.y],
  ];
  let target = spots[0];
  for (const [x, y] of spots) {
    if (!world.boxCollides(x, y, PLAYER_W, PLAYER_H)) { target = [x, y]; break; }
  }
  player.x = target[0];
  player.y = target[1];
  player.moving = false;
  player.continentId = cid;
  state.lastContinent = null;
  markDock(cid);
  closeModal("travel");
  audio.chime();
  renderer.kick(0.5);
  toast(`viajando para ${CONTINENTS[cid].name}`, 2200);
}

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
function focusablesIn(container) {
  return Array.from(container.querySelectorAll(FOCUSABLE)).filter((node) => node.offsetParent !== null || node === document.activeElement);
}
const MODAL_FOCUS_BACK = {
  journal: "btn-journal",
  sheet: "btn-sheet",
  rede: "btn-rede",
  help: "btn-help",
  pvp: "btn-rede",
  outfits: "btn-sheet",
};
function restoreFocus(modalName) {
  const back = state.lastFocus;
  state.lastFocus = null;
  if (back?.isConnected && back.offsetParent !== null) {
    back.focus({ preventScroll: true });
    return;
  }
  const hudId = MODAL_FOCUS_BACK[modalName];
  if (hudId) $(hudId)?.focus({ preventScroll: true });
}
function openModal(name) {
  stopSprint();
  const opener = document.activeElement?.closest?.("button, a, input, [tabindex]") || document.activeElement;
  if (state.modal !== name) closeModal(state.modal);
  state.lastFocus = opener && opener !== document.body ? opener : null;
  state.modal = name;
  $(name).hidden = false;
  $("scrim").hidden = false;
  const focusable = $(name).querySelector(FOCUSABLE) || $(name).querySelector("button, input");
  focusable?.focus();
}
function closeModal(name) {
  if (name && $(name)) $(name).hidden = true;
  if (state.modal === name) state.modal = null;
  if (!state.modal && !state.panelOpen) $("scrim").hidden = true;
  try {
    if (name === "rede") social?.close();
    if (name === "duel") { duelUi?.close(); dungeon?.onDuelClosed(); }
    if (name === "pvp") pvpUi?.abort();
    if (name === "npc") state.npc = null;
  } catch (e) {
    console.error("[modal]", e);
  } finally {
    if (!state.modal && !state.panelOpen) restoreFocus(name);
  }
}
function trapFocus(e) {
  const container = state.modal ? $(state.modal) : state.panelOpen ? $("panel") : null;
  if (!container) return false;
  const list = focusablesIn(container);
  if (!list.length) { e.preventDefault(); return true; }
  const first = list[0];
  const last = list[list.length - 1];
  const active = document.activeElement;
  if (!container.contains(active)) { e.preventDefault(); (e.shiftKey ? last : first).focus(); return true; }
  if (e.shiftKey && active === first) { e.preventDefault(); last.focus(); return true; }
  if (!e.shiftKey && active === last) { e.preventDefault(); first.focus(); return true; }
  return false;
}

async function openPost(id, site) {
  stopSprint();
  const post = POSTS[id];
  if (!post) {
    toast("Esta página ainda está sendo escrita.");
    return;
  }
  let opener = document.activeElement;
  if (state.modal && MODAL_FOCUS_BACK[state.modal] && $(state.modal)?.contains(opener)) {
    opener = $(MODAL_FOCUS_BACK[state.modal]);
  }
  closeModal(state.modal);
  closeChat();
  if (state.panelOpen) closePanel();
  state.lastFocus = opener && opener !== document.body ? opener : null;
  state.panelOpen = true;
  state.currentPost = id;
  markCard(id);

  $("panel-kicker").textContent = post.kicker || CONTINENTS[post.continent]?.name || "";
  $("panel-title").textContent = post.title;
  $("panel-meta").textContent =
    `${post.date.split("-").reverse().join("/")} · ${post.read} · ${(post.tags || []).map((t) => `#${t}`).join(" ")}`;
  $("panel-body").innerHTML = post.body || "";
  const live = $("panel-live");
  live.textContent = "";
  $("panel").hidden = false;
  $("scrim").hidden = false;
  document.querySelector(".panel-scroll").scrollTop = 0;
  $("panel-close").focus();
  audio.open();

  if (post.lab && LIVE[post.lab]) {
    const entry = LIVE[post.lab];
    const loader = typeof entry === "function" ? entry : entry.load;
    const variant = typeof entry === "function" ? null : entry.variant;
    const loading = document.createElement("div");
    loading.className = "widget-loading";
    loading.textContent = "acendendo os instrumentos...";
    live.appendChild(loading);
    try {
      const mod = await loader();
      if (!state.panelOpen || state.currentPost !== id) return;
      live.textContent = "";
      const cleanup = await mod.mount(live, {
        audio,
        toast,
        reducedMotion,
        enableSound: () => setSound(true),
        onOpenZone: (zoneId) => {
          const c = CONTINENTS[zoneId];
          if (c) toast(`${c.name}: ${c.sub}`, 2600);
        },
      }, variant);
      // Fechar o painel durante o import do instrumento não pode deixar
      // animação, canvas ou listener rodando escondido.
      if (!state.panelOpen || state.currentPost !== id) {
        if (typeof cleanup === "function") {
          try { cleanup(); } catch { /* limpeza best-effort */ }
        }
        return;
      }
      state.panelCleanup = typeof cleanup === "function" ? cleanup : null;
    } catch (e) {
      live.textContent = "";
      const err = document.createElement("p");
      err.className = "widget-fail";
      err.textContent = "O instrumento não carregou agora. O texto continua aqui; recarregue e tente de novo.";
      live.appendChild(err);
      console.error("[mundo]", e);
    }
  }
}

function closePanel() {
  if (!state.panelOpen) return;
  if (state.panelCleanup) {
    try { state.panelCleanup(); } catch { /* limpeza best-effort */ }
  }
  state.panelCleanup = null;
  state.panelOpen = false;
  state.currentPost = null;
  $("panel").hidden = true;
  if (!state.modal) $("scrim").hidden = true;
  $("panel-live").textContent = "";
  audio.close();
  restoreFocus();
}

const CHAT_HISTORY_MAX = 30;
const CHAT_HISTORY_SHOW = 24;

function chatLogKey() {
  return `${STORAGE.chat}:${state.room}`;
}

function loadChatLog() {
  state.chatLog = [];
  try {
    const raw = sessionStorage.getItem(chatLogKey());
    const list = raw ? JSON.parse(raw) : null;
    if (!Array.isArray(list)) return;
    for (const m of list) {
      if (!m || typeof m.text !== "string" || !m.text) continue;
      state.chatLog.push({
        name: String(m.name || "viajante").replace(/[<>\u0000-\u001f]/g, "").slice(0, 24),
        text: String(m.text).slice(0, 160),
        color: /^#[0-9a-f]{6}$/i.test(m.color) ? m.color : "#61f4c0",
        mine: !!m.mine,
        at: Number(m.at) || 0,
      });
    }
    state.chatLog = state.chatLog.slice(-CHAT_HISTORY_MAX);
  } catch { /* sem sessão */ }
}

function saveChatLog() {
  try {
    sessionStorage.setItem(chatLogKey(), JSON.stringify(state.chatLog.slice(-CHAT_HISTORY_MAX)));
  } catch { /* sem sessão */ }
}

function pushChatMessage(name, text, color, mine = false) {
  const clean = String(text || "").replace(/[<>\x00-\x1f]/g, " ").replace(/\s+/g, " ").trim().slice(0, 160);
  if (!clean) return;
  state.chatLog.push({
    name: mine ? player.name : String(name || "viajante").slice(0, 24),
    text: clean,
    color: /^#[0-9a-f]{6}$/i.test(color) ? color : "#61f4c0",
    mine: !!mine,
    at: Date.now(),
  });
  if (state.chatLog.length > CHAT_HISTORY_MAX) state.chatLog.shift();
  saveChatLog();
  if (state.chatOpen) renderChatLog();
}

function renderChatLog(forceBottom = false) {
  const log = $("chat-log");
  if (!log) return;
  const near = log.scrollHeight - log.scrollTop - log.clientHeight < 28;
  log.textContent = "";
  if (!state.chatLog.length) {
    const empty = document.createElement("p");
    empty.className = "chat-log-empty";
    empty.textContent = "ninguém falou nesta sala ainda";
    log.appendChild(empty);
    return;
  }
  const list = state.chatLog.slice(-CHAT_HISTORY_SHOW);
  list.forEach((m, i) => {
    const line = document.createElement("div");
    line.className = "chat-line" + (m.mine ? " mine" : "") + (i < list.length - 6 ? " old" : "");
    const who = document.createElement("b");
    who.textContent = m.mine ? "você" : m.name;
    who.style.color = m.color;
    const body = document.createElement("span");
    body.textContent = m.text;
    line.append(who, body);
    log.appendChild(line);
  });
  if (forceBottom || near) log.scrollTop = log.scrollHeight;
}

function openChat() {
  if (!state.started || state.panelOpen || state.modal) return;
  if (state.chatOpen) {
    $("chat-input").focus();
    return;
  }
  stopSprint();
  if (!state.net) {
    toast("esta sessão é solo. Recarregue e entre na praça compartilhada para conversar.");
    return;
  }
  state.chatOpen = true;
  document.body.classList.add("chatting");
  $("chatbar").hidden = false;
  $("prompt").hidden = true;
  renderChatLog(true);
  $("chat-input").value = "";
  $("chat-input").focus();
}
function closeChat() {
  state.chatOpen = false;
  document.body.classList.remove("chatting");
  $("chatbar").hidden = true;
  $("chat-input").blur();
}

function interact() {
  if (!state.started || state.panelOpen || state.modal) return;
  if (performance.now() < state.pvpDownUntil) { toast("Você ainda está desativado.", 2000); return; }
  clearPath();
  const target = state.nearest;
  if (!target) return;
  interactTarget(target);
}

function findNearest() {
  let best = null;
  let bestD = Infinity;
  const near = (kind, obj, ground, radius = INTERACT_RADIUS) => {
    const d = Math.hypot(obj.x - player.x, obj.y - player.y);
    if (d <= radius && d < bestD) {
      bestD = d;
      best = { kind, obj, ground };
    }
  };
  // a boca da caverna é medida pelo degrau de saída, não pelo centro do
  // desenho: NPC que passeia na frente não pode esconder a descida.
  for (const c of world.caves) {
    const d = Math.hypot(c.exit.x - player.x, c.exit.y - player.y);
    if (d <= 1.8 && d < bestD) { bestD = d; best = { kind: "cave", obj: c, ground: null }; }
  }
  for (const s of world.stations) near("station", s);
  for (const w of world.waystones) near("waystone", w);
  for (const n of world.npcs) near("npc", n);
  return best;
}

function updatePrompt() {
  if (!state.started || state.panelOpen || state.modal || state.chatOpen || performance.now() < state.pvpDownUntil) {
    $("prompt").hidden = true;
    return;
  }
  const near = findNearest();
  state.nearest = near;
  if (!near) { $("prompt").hidden = true; return; }
  let label;
  if (near.kind === "station") label = `abrir ${near.obj.label}`;
  else if (near.kind === "waystone") label = `viajar de ${near.obj.name}`;
  else if (near.kind === "npc") {
    label = near.obj.trainer
      ? `treinar com ${NPCS[near.obj.id]?.name || "o instrutor"}`
      : `falar com ${NPCS[near.obj.id]?.name || "alguém"}`;
  }
  else if (near.kind === "cave") label = `descer em ${near.obj.name}`;
  if ($("prompt-label").textContent !== label) $("prompt-label").textContent = label;
  $("prompt").hidden = false;
}

function updateBoost(dt, active) {
  const target = active && state.sprint ? 1 : 0;
  player.boost += (target - player.boost) * Math.min(1, dt * 8);
  if (player.boost < 0.01) player.boost = 0;
}

function walkStep(dx, dy, dt) {
  const len = Math.hypot(dx, dy);
  if (!len) { player.moving = false; return false; }
  dx /= len; dy /= len;
  const sprinting = state.sprint;
  const step = PLAYER_SPEED * (sprinting ? SPRINT_MULT : 1) * rpg.speedMult() * (dungeon?.isOpen() ? 1 : rpg.mountSpeedMult()) * dt;
  const oldX = player.x, oldY = player.y;
  // Em velocidade de nave o passo do quadro passa de um tile e atravessaria
  // parede fina. Divide o movimento em pedaços que a colisão consegue ver.
  const chunks = Math.max(1, Math.ceil(step / 0.24));
  const part = step / chunks;
  for (let i = 0; i < chunks; i++) {
    const nx = player.x + dx * part;
    if (!world.boxCollides(nx, player.y, PLAYER_W, PLAYER_H)) player.x = nx;
    const ny = player.y + dy * part;
    if (!world.boxCollides(player.x, ny, PLAYER_W, PLAYER_H)) player.y = ny;
  }
  player.x = Math.max(0.5, Math.min(MAP_W - 0.5, player.x));
  player.y = Math.max(0.5, Math.min(MAP_H - 0.5, player.y));
  const moved = player.x !== oldX || player.y !== oldY;
  if (dx !== 0 && dy !== 0) player.dir = dx > 0 ? 2 : 1;
  else if (Math.abs(dx) > Math.abs(dy)) player.dir = dx > 0 ? 2 : 1;
  else player.dir = dy > 0 ? 0 : 3;
  player.moving = moved;
  if (!moved) return false;
  const now = performance.now();
  if (now - state.footstepAt > (sprinting ? 155 : 340)) {
    state.footstepAt = now;
    if (sprinting) audio.hover(); else audio.footstep();
  }
  return true;
}

function updateMovement(dt) {
  const keys = state.keys;
  let dx = 0, dy = 0;
  if (keys.has("a") || keys.has("arrowleft") || state.touch.left) dx -= 1;
  if (keys.has("d") || keys.has("arrowright") || state.touch.right) dx += 1;
  if (keys.has("w") || keys.has("arrowup") || state.touch.up) dy -= 1;
  if (keys.has("s") || keys.has("arrowdown") || state.touch.down) dy += 1;
  if (dx === 0 && dy === 0) { player.moving = false; return; }
  walkStep(dx, dy, dt);
}

function clearPath() {
  state.path = null;
  state.pending = null;
  player.pathLine = null;
  player.pathGoal = null;
}

function setPathTo(x, y, pending = null) {
  clearPath();
  const path = findPath(world, { x: player.x, y: player.y }, { x, y });
  if (!path || !path.length) {
    toast("Não achei um caminho até aí.", 2800);
    return false;
  }
  state.path = path;
  state.pending = pending;
  player.pathLine = path;
  const last = path[path.length - 1];
  player.pathGoal = { x: last.x, y: last.y };
  return true;
}

function updateAutoWalk(dt) {
  const path = state.path;
  if (!path || !path.length) return false;
  const stepLen = PLAYER_SPEED * (state.sprint ? SPRINT_MULT : 1) * rpg.speedMult() * (dungeon?.isOpen() ? 1 : rpg.mountSpeedMult()) * dt;
  let target = path[0];
  let dx = target.x - player.x;
  let dy = target.y - player.y;
  let dist = Math.hypot(dx, dy);
  if (dist <= stepLen + 0.09) {
    player.x = target.x;
    player.y = target.y;
    player.moving = true;
    if (dx !== 0 && dy !== 0) player.dir = dx > 0 ? 2 : 1;
    else if (Math.abs(dx) > Math.abs(dy)) player.dir = dx > 0 ? 2 : 1;
    else player.dir = dy > 0 ? 0 : 3;
    path.shift();
    if (!path.length) {
      const pending = state.pending;
      clearPath();
      if (pending) {
        const d = Math.hypot(pending.obj.x - player.x, pending.obj.y - player.y);
        if (d <= INTERACT_RADIUS + 1.2) interactTarget(pending);
        else toast("Não cheguei perto o bastante. Clique de novo.", 2800);
      }
    }
    return true;
  }
  if (!walkStep(dx, dy, dt)) {
    clearPath();
    toast("O caminho travou. Clique de novo.", 2600);
  }
  return true;
}

function catFree(x, y) {
  // o gato ocupa menos que o jogador, mas respeita água, árvore e parede
  return !world.boxCollides(x, y, 0.42, 0.32);
}

function moveCat(dx, dy) {
  const cat = world.cat;
  if (catFree(cat.x + dx, cat.y + dy)) {
    cat.x += dx;
    cat.y += dy;
    return true;
  }
  // desliza pelo eixo livre em vez de atravessar a água
  if (Math.abs(dx) > 0.001 && catFree(cat.x + dx, cat.y)) {
    cat.x += dx;
    return true;
  }
  if (Math.abs(dy) > 0.001 && catFree(cat.x, cat.y + dy)) {
    cat.y += dy;
    return true;
  }
  return false;
}

function updateCat(dt) {
  const cat = world.cat;
  const pet = rpg.activePet();
  cat.kind = pet?.kind || "cat";
  if (!pet) {
    // sem companheiro ativo o gato do porto fica de guarda, não segue
    cat.moving = false;
    return;
  }
  const behind = [[0, -0.9], [0.9, 0], [-0.9, 0], [0, 0.9]][player.dir] || [0, -0.9];
  const behindX = player.x + behind[0];
  const behindY = player.y + behind[1];
  const d = Math.hypot(behindX - cat.x, behindY - cat.y);
  if (d > 9 && catFree(behindX, behindY)) {
    // ficou preso longe demais: reaparece atrás do jogador, em chão livre
    cat.x = behindX;
    cat.y = behindY;
    cat.moving = false;
    return;
  }
  if (d > 1.15) {
    const sp = Math.min(4.2, 1.2 + d) * dt;
    const moved = moveCat(((behindX - cat.x) / d) * sp, ((behindY - cat.y) / d) * sp);
    cat.facing = behindX >= cat.x ? 1 : -1;
    cat.moving = moved;
  } else {
    cat.moving = false;
  }
}

function updateZone() {
  if (!state.started) return;
  const area = world.areaAt(player.x, player.y);
  const cid = world.continentAt(player.x, player.y);
  const areaId = area?.id || null;
  if (areaId !== state.lastArea) {
    state.lastArea = areaId;
    // entrar numa área temática é descobrir um lugar novo, mesmo sem trocar
    // de continente: o cartão conta a área, não o continente inteiro.
    if (area) {
      state.lastContinent = cid;
      player.continentId = cid;
      const key = `area:${area.id}`;
      const first = !state.docks.has(key);
      markDock(key);
      showZoneCard(area, first, true);
      return;
    }
  }
  if (!cid || cid === state.lastContinent) return;
  state.lastContinent = cid;
  player.continentId = cid;
  const first = !state.docks.has(cid);
  markDock(cid);
  showZoneCard(CONTINENTS[cid], first);
}

function loop(now) {
  requestAnimationFrame(loop);
  try {
    const dt = Math.min(0.05, (now - (loop.last || now)) / 1000);
    loop.last = now;
    const active = state.started && !state.panelOpen && !state.modal && !state.chatOpen && now >= state.pvpDownUntil;
    updateBoost(dt, active);
    rpg.tick();
    if (!state.manaAt || now - state.manaAt > 1000) {
      state.manaAt = now;
      rpg.pulse();
    }
    if (dungeon?.isOpen()) {
      $("prompt").hidden = true;
      return;
    }
    if (active) {
      if (state.path) updateAutoWalk(dt);
      else updateMovement(dt);
      updateZone();
      updateQuestTrack(now);
      world.updateNpcs(dt, now);
    } else {
      player.moving = false;
    }
    updateCat(dt);
    if (world.markExplored(player.x, player.y)) state.fogDirty = true;
    if (state.fogDirty && now - state.fogSavedAt > 1500) {
      state.fogSavedAt = now;
      saveFog();
    }
    const hpNow = rpg.hp();
    const hpMaxNow = rpg.hpMax();
    if (hpNow !== state.lastHp || hpMaxNow !== state.lastHpMax) {
      state.lastHp = hpNow;
      state.lastHpMax = hpMaxNow;
      const hpEl = $("hp-hud");
      if (hpEl) hpEl.textContent = `❤ ${hpNow}/${hpMaxNow}`;
    }
    for (const n of world.npcs) n.questMark = quests.markFor(n.id);
    const peerStep = PLAYER_SPEED * SPRINT_MULT * 1.1 * dt;
    for (const p of state.peers) {
      const pos = peerRenderPosition(p, now, NET.interpDelay);
      if (!Number.isFinite(p.rx)) {
        p.rx = pos.x;
        p.ry = pos.y;
      } else {
        const dx = pos.x - p.rx;
        const dy = pos.y - p.ry;
        const dist = Math.hypot(dx, dy);
        if (dist > 8) {
          p.rx = pos.x;
          p.ry = pos.y;
        } else if (dist > peerStep) {
          p.rx += (dx / dist) * peerStep;
          p.ry += (dy / dist) * peerStep;
        } else {
          p.rx = pos.x;
          p.ry = pos.y;
        }
      }
    }
    renderer.draw(now, player, state.peers, world.npcs, world.cat, player.moving);
    updatePrompt();
    const stepD = Math.hypot(player.x - state.stepX, player.y - state.stepY);
    state.stepX = player.x;
    state.stepY = player.y;
    if (stepD > 0 && stepD < 2) {
      state.walked += stepD;
      if (state.walked > 20) markStep("walk");
    }
    if (state.net) state.net.setLocal(player.x, player.y, player.dir, player.boost);
  } catch (e) {
    console.error("[loop] erro", e);
    if (!loop.warned) { loop.warned = true; toast("ops, o mundo tropeçou. Abra o console."); }
  }
}

// ---------- névoa persistida ----------
function loadFog() {
  try {
    const raw = localStorage.getItem(STORAGE.explored);
    if (!raw) return;
    const bin = atob(raw);
    const size = world.exploredBytes.length;
    if (bin.length !== size) return;
    const bytes = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
    world.setExplored(bytes);
  } catch { /* sem storage */ }
}
function saveFog() {
  if (!state.fogDirty) return;
  try {
    const bytes = world.exploredBytes;
    let s = "";
    for (let i = 0; i < bytes.length; i += 4096) {
      s += String.fromCharCode(...bytes.subarray(i, i + 4096));
    }
    localStorage.setItem(STORAGE.explored, btoa(s));
    state.fogDirty = false;
  } catch { /* sem storage */ }
}

// ---------- eventos ----------
window.addEventListener("keydown", (e) => {
  if (e.key === "Tab" && trapFocus(e)) return;
  const tag = (e.target.tagName || "").toLowerCase();
  if (tag === "input" || tag === "textarea") {
    if (e.key === "Escape") closeChat();
    return;
  }
  const k = e.key.toLowerCase();
  const gameActive = state.started && !state.panelOpen && !state.modal && !state.chatOpen && !dungeon?.isOpen();
  if (gameActive && ["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k)) e.preventDefault();
  if (!state.started) return;
  if (state.modal === "duel" && duelUi) {
    const letter = /^[a-f]$/.test(k) ? k.charCodeAt(0) - 97 : -1;
    if (/^[1-6]$/.test(k)) { e.preventDefault(); duelUi.answer(Number(k) - 1); return; }
    if (letter >= 0) { e.preventDefault(); duelUi.answer(letter); return; }
    if (k === "enter" || k === " ") { e.preventDefault(); duelUi.advance(); return; }
  }
  if (k === "escape") {
    if (state.panelOpen) closePanel();
    else if (state.modal) closeModal(state.modal);
    else if (state.chatOpen) closeChat();
    return;
  }
  if (state.panelOpen || state.modal) return;
  if (dungeon?.isOpen()) return;
  if (k === " " || e.code === "Space") {
    if (!state.sprint) { state.sprint = true; audio.boost(); }
    return;
  }
  if (k === "enter" || k === "q") {
    e.preventDefault();
    openChat();
    return;
  }
  if (k === "e") { openRede(); return; }
  if (k === "z") { openJournal(); return; }
  if (k === "c") { openSheet(); return; }
  if (k === "f") {
    e.preventDefault();
    interact();
    return;
  }
  if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) clearPath();
  state.keys.add(k);
});
window.addEventListener("keyup", (e) => {
  const k = e.key.toLowerCase();
  state.keys.delete(k);
  if (k === " " || e.code === "Space") state.sprint = false;
});
window.addEventListener("blur", () => {
  state.keys.clear();
  state.sprint = false;
  state.touch.up = state.touch.down = state.touch.left = state.touch.right = false;
});

for (const btn of document.querySelectorAll(".dpad button")) {
  const dir = btn.dataset.dir;
  const on = (e) => { e.preventDefault(); state.touch[dir] = true; };
  const off = (e) => { e.preventDefault(); state.touch[dir] = false; };
  btn.addEventListener("pointerdown", on);
  btn.addEventListener("pointerup", off);
  btn.addEventListener("pointerleave", off);
  btn.addEventListener("pointercancel", off);
}
for (const btn of document.querySelectorAll("#training [data-tier]")) {
  btn.addEventListener("click", () => startTraining(Number(btn.dataset.tier)));
}
$("touch-action").addEventListener("click", interact);
const sprintBtn = $("touch-sprint");
function touchSprint(on) {
  return (e) => {
    e.preventDefault();
    if (!state.started) return;
    if (on && !state.sprint) { state.sprint = true; audio.boost(); }
    if (!on) state.sprint = false;
    sprintBtn.classList.toggle("active", on);
  };
}
sprintBtn.addEventListener("pointerdown", touchSprint(true));
sprintBtn.addEventListener("pointerup", touchSprint(false));
sprintBtn.addEventListener("pointerleave", touchSprint(false));
sprintBtn.addEventListener("pointercancel", touchSprint(false));

function entityAt(wx, wy) {
  let best = null;
  let bestD = Infinity;
  const hit = (kind, obj, ground, radius = 1.5) => {
    const d = Math.hypot(obj.x - wx, obj.y - wy);
    if (d <= radius && d < bestD) {
      bestD = d;
      best = { kind, obj, ground };
    }
  };
  for (const s of world.stations) hit("station", s);
  for (const w of world.waystones) hit("waystone", w);
  for (const n of world.npcs) hit("npc", n, null, 1.4);
  for (const c of world.caves) hit("cave", c, null, 1.4);
  return best;
}

$("world").addEventListener("pointerdown", (e) => {
  if (!state.started || state.panelOpen || state.modal) return;
  if (performance.now() < state.pvpDownUntil) { toast("Você ainda está desativado.", 2000); return; }
  if (e.button !== undefined && e.button !== 0) return;
  if (state.chatOpen) closeChat();
  const rect = $("world").getBoundingClientRect();
  const sx = e.clientX - rect.left;
  const sy = e.clientY - rect.top;
  const wx = (sx / renderer.zoom + renderer.camX) / 16;
  const wy = (sy / renderer.zoom + renderer.camY) / 16;
  const hit = entityAt(wx, wy);
  if (hit) {
    const d = Math.hypot(hit.obj.x - player.x, hit.obj.y - player.y);
    if (d <= INTERACT_RADIUS + 0.7) {
      clearPath();
      interactTarget(hit);
    } else {
      setPathTo(hit.obj.x, hit.obj.y, hit);
    }
    return;
  }
  const goal = nearestWalkable(world, wx, wy, 6);
  if (!goal) {
    toast("Não dá para andar aí. A água e as paredes ficam de fora.", 3000);
    return;
  }
  clearPath();
  setPathTo(goal.x, goal.y, null);
});

$("minimap-canvas").addEventListener("pointerdown", (e) => {
  if (!state.started || state.panelOpen || state.modal) return;
  if (e.button !== undefined && e.button !== 0) return;
  if (state.chatOpen) closeChat();
  stopSprint();
  const rect = e.currentTarget.getBoundingClientRect();
  const wx = ((e.clientX - rect.left) / rect.width) * MAP_W;
  const wy = ((e.clientY - rect.top) / rect.height) * MAP_H;
  if (!world.isExplored(Math.floor(wx), Math.floor(wy))) {
    toast("Ainda está na névoa. Ande até lá para revelar.", 3000);
    return;
  }
  const goal = nearestWalkable(world, wx, wy, 3);
  if (!goal) {
    toast("Não dá para andar aí.", 2600);
    return;
  }
  setPathTo(goal.x, goal.y, null);
});

$("btn-chat").addEventListener("click", openChat);
$("btn-sheet").addEventListener("click", openSheet);
$("btn-rede").addEventListener("click", openRede);
$("panel-live").addEventListener("pointerdown", () => {
  if (state.currentPost) quests.report("lab", state.currentPost);
}, { passive: true });
$("btn-journal").addEventListener("click", openJournal);
$("steps-min")?.addEventListener("click", () => $("steps").classList.toggle("min"));

$("btn-help").addEventListener("click", () => { openModal("help"); audio.open(); });
$("btn-sound").addEventListener("click", () => setSound(!saved.sound));
$("net-pill").addEventListener("click", async () => {
  const url = `${location.origin}${location.pathname}#sala=${state.room}`;
  try {
    await navigator.clipboard.writeText(url);
    toast("convite copiado. Mande para quem quiser entrar nesta sala.");
  } catch { toast(url, 6000); }
});
for (const btn of document.querySelectorAll("[data-close]")) {
  btn.addEventListener("click", () => closeModal(btn.dataset.close));
}
$("scrim").addEventListener("click", () => {
  if (state.panelOpen) closePanel();
  if (state.modal) closeModal(state.modal);
});
$("panel-close").addEventListener("click", closePanel);
$("panel-back").addEventListener("click", closePanel);

// O teclado do celular cobre o rodapé: o campo de conversa sobe junto com a
// área visível para continuar à vista enquanto se digita.
function fitKeyboard() {
  const vv = window.visualViewport;
  if (!vv) return;
  const gap = state.chatOpen ? Math.max(0, window.innerHeight - vv.height - vv.offsetTop) : 0;
  document.documentElement.style.setProperty("--kb-gap", `${Math.round(gap)}px`);
}
if (window.visualViewport) {
  window.visualViewport.addEventListener("resize", fitKeyboard);
  window.visualViewport.addEventListener("scroll", fitKeyboard);
  fitKeyboard();
}

$("chat-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const text = $("chat-input").value.trim();
  if (!text) return;
  if (state.net && state.net.sendChat(text)) {
    player.bubble = { text, until: performance.now() + 6500 };
    pushChatMessage(player.name, text, player.color, true);
    $("chat-input").value = "";
    closeChat();
  } else {
    toast("a mensagem não saiu. Veja se o sinal está de pé.");
  }
});
$("chat-cancel").addEventListener("click", closeChat);
$("chat-input").addEventListener("keydown", (e) => {
  if (e.key !== "Enter" || e.isComposing) return;
  e.preventDefault();
  $("chat-form").requestSubmit();
});

$("intro-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const name = $("intro-name").value.trim().replace(/[<>\u0000-\u001f]/g, "").slice(0, 16);
  if (!name) { $("intro-name").focus(); return; }
  player.name = name;
  state.room = sanitizeRoom($("intro-room").value);
  writeJSON(STORAGE.name, name);
  writeJSON(STORAGE.room, state.room);
  $("intro-room").value = state.room;
  startGame();
});

window.addEventListener("beforeunload", () => {
  saveFog();
  if (state.net) state.net.destroy();
  social?.close();
  rede.destroy();
});

// ---------- boot ----------
(function boot() {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (coarse) {
    const lead = document.querySelector(".intro-lead");
    if (lead) lead.innerHTML = "Cada continente é uma página. Ande com o direcional, toque no chão para ir até ali, segure <strong>Turbo</strong> para acelerar e toque em <kbd>A</kbd> perto de estações, NPCs e cavernas. Os botões do topo abrem a conversa, a Rede, o Diário e a Ficha.";
    const controls = document.querySelector(".intro-controls");
    if (controls) controls.innerHTML = "toque no chão para andar · <strong>Turbo</strong> acelera · <kbd>A</kbd> interage · topo: Falar, Rede, Diário, Ficha";
    const canvas = $("world");
    if (canvas) canvas.setAttribute("aria-label", "Mapa do mundo, em pixel art. Ande com o direcional e interaja com A.");
  }
  const roomFromHash = hashRoom();
  if (roomFromHash) state.room = roomFromHash;
  $("intro-name").value = saved.name || "";
  $("intro-room").value = state.room;
  loadFog();
  world.markExplored(player.x, player.y);
  updateProgress();
  setSound(false);
  setNetStatus({ state: "solo", count: 1 });
  requestAnimationFrame(loop);
  if (new URLSearchParams(location.search).has("debug")) {
    window.__mundo = { player, state, world, renderer, audio, quests, rede, backup, rpg, sheetUi, duelUi, dungeon, pvpUi, knockDown, get social() { return social; } };
  }
})();

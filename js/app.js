import {
  CONTINENTS, CONTINENT_ORDER, SITES, WAYSTONES, SPAWN,
  PLAYER_SPEED, SPRINT_MULT, PLAYER_W, PLAYER_H, INTERACT_RADIUS, PLAYER_COLORS,
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
import { findPath, nearestWalkable } from "./path.js";
import { RPG } from "./rpg.js";
import { createSheet } from "./sheet.js";
import { createDuel } from "./duel.js";

const $ = (id) => document.getElementById(id);

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

const player = {
  x: SPAWN.x,
  y: SPAWN.y,
  dir: 0,
  moving: false,
  name: saved.name || "viajante",
  colorIndex: Math.floor(Math.random() * PLAYER_COLORS.length),
  bubble: null,
  boost: 0,
  pathLine: null,
  pathGoal: null,
};
player.color = PLAYER_COLORS[player.colorIndex].shirt;

const state = {
  started: false,
  panelOpen: false,
  panelCleanup: null,
  currentPost: null,
  chatOpen: false,
  modal: null,
  peers: [],
  net: null,
  nearest: null,
  room: sanitizeRoom(saved.room),
  lastContinent: null,
  zoneTimer: null,
  footstepAt: 0,
  cards: saved.cards,
  docks: saved.docks,
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
};

for (const cid of CONTINENT_ORDER) {
  if (continentComplete(cid)) state.completed.add(cid);
}

const rede = new Rede({ name: player.name });
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
});
let duelUi = null;
duelUi = createDuel({
  rpg,
  toast,
  audio,
  onClose: () => closeModal("duel"),
  onVictory: () => quests.report("hunts"),
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
    quests,
    player,
    getPeers: () => state.peers,
    getLevel: level,
    getTitle: () => quests.title,
    setName: adoptName,
    toast,
    audio,
  });
  social.connect();
  rede.init()
    .then(() => { if (state.net) state.net.setIdentity(rede.pk); })
    .catch(() => {});
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

function openDuel(monster, ground, boss = false) {
  if (!duelUi.open(monster, ground, boss)) return;
  openModal("duel");
  audio.open();
}

function pullLever(ground) {
  const res = rpg.pullLever(ground);
  if (!res.ok) {
    toast(res.reason, 3600);
    audio.error();
    return;
  }
  toast("O selo se abriu. O chefe da caçada acordou.", 4600);
  audio.chime();
  renderer.kick(0.6);
}

function interactTarget(target) {
  if (!target) return;
  if (target.kind === "station") openPost(target.obj.post, target.obj);
  else if (target.kind === "waystone") openTravel();
  else if (target.kind === "npc") {
    const npc = target.obj;
    const lines = NPCS[npc.id]?.lines || ["..."];
    npc.lineIndex = ((npc.lineIndex || 0) + 1) % lines.length;
    npc.bubble = { text: lines[npc.lineIndex], until: performance.now() + 6500 };
    openNpc(npc);
  }
  else if (target.kind === "monster") openDuel(target.obj, target.ground);
  else if (target.kind === "boss") openDuel(target.ground.boss, target.ground, true);
  else if (target.kind === "lever") pullLever(target.ground);
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
      if (quests.accept(q.id)) { audio.blip(); buildNpc(npc); }
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
  if (lines.length) {
    body.appendChild(el("p", "npc-line", lines[(npc.lineIndex || 0) % lines.length]));
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
  buildNpc(npc);
  openModal("npc");
  audio.open();
}

function saveCards() { writeJSON(STORAGE.cards, Array.from(state.cards)); }
function saveDocks() { writeJSON(STORAGE.docks, Array.from(state.docks)); }
function saveXp() { writeJSON(STORAGE.xp, state.xp); }

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

function markCard(postId) {
  if (!postId || state.cards.has(postId)) return false;
  state.cards.add(postId);
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
    label.textContent = count > 1 ? `${count} na praça` : "praça vazia";
    pill.title = "Clique para copiar o convite desta sala";
  } else if (s === "connecting") {
    label.textContent = "conectando";
    pill.title = "Procurando a praça compartilhada";
  } else if (s === "offline") {
    label.textContent = "sinal caiu";
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
      ? `${state.peers.length + 1} na praça` : "praça vazia";
  }
}
function setPeers(peers) { state.peers = peers; updateOnlineCount(); }
function startNet() {
  if (state.net) return;
  $("room-label").textContent = `sala ${state.room}`;
  state.net = new Net({
    room: state.room,
    name: player.name,
    color: player.color,
    onPeers: setPeers,
    onStatus: setNetStatus,
    onChat: () => { audio.blip(); },
    onError: () => {},
  });
  state.net.connect();
}

function startGame() {
  state.started = true;
  rede.setName(player.name);
  $("intro").hidden = true;
  $("minimap").hidden = false;
  document.body.classList.add("playing");
  if (window.matchMedia("(pointer: coarse)").matches) $("touch").hidden = false;
  audio.unlock();
  if (saved.sound) setSound(true); else setSound(false);
  history.replaceState(null, "", `#sala=${state.room}`);
  $("room-label").textContent = `sala ${state.room}`;
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
    setTimeout(() => toast("toque no chão para andar, segure Turbo para voar baixo, A para interagir.", 4800), 800);
  } else {
    setTimeout(() => toast("WASD ou clique no chão anda, Shift acende a nave, E interage, C é a ficha.", 5200), 800);
  }
}

function showZoneCard(continent, first) {
  if (!continent) return;
  const card = $("zone-card");
  $("zone-eyebrow").textContent = first ? "novo continente descoberto" : "de volta ao";
  $("zone-name").textContent = continent.name;
  $("zone-sub").textContent = continent.sub;
  card.style.setProperty("--zone", continent.accent);
  card.hidden = true;
  void card.offsetWidth;
  card.hidden = false;
  clearTimeout(state.zoneTimer);
  state.zoneTimer = setTimeout(() => { card.hidden = true; }, 4800);
  if (first) { renderer.kick(0.7); audio.chime(); }
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

function buildJournal() {
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
    for (const site of sites) {
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
  buildJournalQuests();
}

function openTravel() {
  stopSprint();
  if (state.panelOpen) closePanel();
  closeChat();
  buildTravel();
  openModal("travel");
  audio.open();
}

function buildTravel() {
  const list = $("travel-list");
  list.textContent = "";
  for (const cid of CONTINENT_ORDER) {
    const c = CONTINENTS[cid];
    const stone = WAYSTONES.find((w) => w.continent === cid);
    if (!stone) continue;
    const known = cid === "hub" || state.docks.has(cid);
    const sites = sitesOf(cid);
    const opened = continentOpened(cid);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "travel-item";
    btn.disabled = !known;
    const left = document.createElement("span");
    const b = document.createElement("b");
    b.textContent = c.name;
    const s = document.createElement("span");
    s.textContent = known
      ? `${sites.length ? `${opened}/${sites.length} fragmentos · ` : ""}${stone.name}`
      : "na névoa, siga a pé até lá";
    left.append(b, s);
    const right = document.createElement("em");
    right.textContent = known ? "viajar" : "trancado";
    btn.append(left, right);
    if (known) {
      btn.addEventListener("click", () => travelTo(cid));
    }
    list.appendChild(btn);
  }
}

function travelTo(cid) {
  const stone = WAYSTONES.find((w) => w.continent === cid);
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

function openModal(name) {
  stopSprint();
  closeModal(state.modal);
  state.modal = name;
  $(name).hidden = false;
  $("scrim").hidden = false;
  const focusable = $(name).querySelector("button, input");
  focusable?.focus();
}
function closeModal(name) {
  if (name && $(name)) $(name).hidden = true;
  if (name === "rede") social?.close();
  if (name === "duel") duelUi?.close();
  if (name === "npc") state.npc = null;
  if (state.modal === name) state.modal = null;
  if (!state.modal && !state.panelOpen) $("scrim").hidden = true;
}

async function openPost(id, site) {
  stopSprint();
  const post = POSTS[id];
  if (!post) {
    toast("Esta página ainda está sendo escrita.");
    return;
  }
  closeModal(state.modal);
  closeChat();
  if (state.panelOpen) closePanel();
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
}

function openChat() {
  if (!state.started || state.panelOpen || state.modal) return;
  stopSprint();
  if (!state.net) {
    toast("esta sessão é solo. Recarregue e entre na praça compartilhada para conversar.");
    return;
  }
  state.chatOpen = true;
  document.body.classList.add("chatting");
  $("chatbar").hidden = false;
  $("prompt").hidden = true;
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
  for (const s of world.stations) near("station", s);
  for (const w of world.waystones) near("waystone", w);
  for (const n of world.npcs) near("npc", n);
  for (const m of world.monsters) {
    if (m.alive) near("monster", m, m.ground, 2.1);
  }
  for (const h of world.hunters) {
    if (h.boss.alive) near("boss", h.boss, h, 2.2);
    near("lever", h.lever, h, 1.9);
  }
  return best;
}

function updatePrompt() {
  if (!state.started || state.panelOpen || state.modal || state.chatOpen) {
    $("prompt").hidden = true;
    return;
  }
  const near = findNearest();
  state.nearest = near;
  if (!near) { $("prompt").hidden = true; return; }
  let label;
  if (near.kind === "station") label = near.obj.label;
  else if (near.kind === "waystone") label = near.obj.name;
  else if (near.kind === "npc") label = `falar com ${NPCS[near.obj.id]?.name || "alguém"}`;
  else if (near.kind === "monster") label = `desafiar ${near.obj.name}`;
  else if (near.kind === "boss") label = `enfrentar ${near.obj.name}`;
  else label = near.obj.pulled ? "passagem aberta" : "puxar a alavanca";
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
  const step = PLAYER_SPEED * (sprinting ? SPRINT_MULT : 1) * dt;
  const oldX = player.x, oldY = player.y;
  const nx = player.x + dx * step;
  const ny = player.y + dy * step;
  if (!world.boxCollides(nx, player.y, PLAYER_W, PLAYER_H)) player.x = nx;
  if (!world.boxCollides(player.x, ny, PLAYER_W, PLAYER_H)) player.y = ny;
  player.x = Math.max(0.5, Math.min(MAP_W - 0.5, player.x));
  player.y = Math.max(0.5, Math.min(MAP_H - 0.5, player.y));
  const moved = player.x !== oldX || player.y !== oldY;
  if (Math.abs(dx) > Math.abs(dy)) player.dir = dx > 0 ? 2 : 1;
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
  const stepLen = PLAYER_SPEED * (state.sprint ? SPRINT_MULT : 1) * dt;
  let target = path[0];
  let dx = target.x - player.x;
  let dy = target.y - player.y;
  let dist = Math.hypot(dx, dy);
  if (dist <= stepLen + 0.09) {
    player.x = target.x;
    player.y = target.y;
    player.moving = true;
    if (Math.abs(dx) > Math.abs(dy)) player.dir = dx > 0 ? 2 : 1;
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

function updateCat(dt) {
  const cat = world.cat;
  const behind = [[0, -0.9], [0.9, 0], [-0.9, 0], [0, 0.9]][player.dir] || [0, -0.9];
  const behindX = player.x + behind[0];
  const behindY = player.y + behind[1];
  const d = Math.hypot(behindX - cat.x, behindY - cat.y);
  if (d > 1.15) {
    const sp = Math.min(4.2, 1.2 + d) * dt;
    cat.x += ((behindX - cat.x) / d) * sp;
    cat.y += ((behindY - cat.y) / d) * sp;
    cat.facing = behindX >= cat.x ? 1 : -1;
    cat.moving = true;
  } else {
    cat.moving = false;
  }
}

function updateZone() {
  if (!state.started) return;
  const cid = world.continentAt(player.x, player.y);
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
    const active = state.started && !state.panelOpen && !state.modal && !state.chatOpen;
    updateBoost(dt, active);
    rpg.tick();
    if (active) {
      if (state.path) updateAutoWalk(dt);
      else updateMovement(dt);
      updateZone();
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
    for (const m of world.monsters) m.alive = rpg.monsterAlive(m.id);
    for (const h of world.hunters) {
      h.ready = rpg.leverReady(h);
      h.lever.pulled = rpg.leverPulled(h.id);
      h.lever.ready = h.ready;
      h.boss.alive = rpg.bossAlive(h);
    }
    renderer.draw(now, player, state.peers, world.npcs, world.cat, player.moving);
    updatePrompt();
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
  const tag = (e.target.tagName || "").toLowerCase();
  if (tag === "input" || tag === "textarea") {
    if (e.key === "Escape") closeChat();
    return;
  }
  const k = e.key.toLowerCase();
  if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k)) e.preventDefault();
  if (!state.started) return;
  if (state.modal === "duel" && duelUi) {
    if (/^[1-4]$/.test(k)) { e.preventDefault(); duelUi.answer(Number(k) - 1); return; }
    if (k === "enter" || k === " ") { e.preventDefault(); duelUi.advance(); return; }
  }
  if (k === "escape") {
    if (state.panelOpen) closePanel();
    else if (state.modal) closeModal(state.modal);
    else if (state.chatOpen) closeChat();
    return;
  }
  if (state.panelOpen || state.modal) return;
  if (k === "shift") {
    if (!state.sprint) { state.sprint = true; audio.boost(); }
    return;
  }
  if (k === "e" || k === "enter") { interact(); return; }
  if (k === "j") { openJournal(); return; }
  if (k === "c") { openSheet(); return; }
  if (k === "r") { openRede(); return; }
  if (k === "t") {
    e.preventDefault();
    openChat();
    return;
  }
  if (["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(k)) clearPath();
  state.keys.add(k);
});
window.addEventListener("keyup", (e) => {
  const k = e.key.toLowerCase();
  state.keys.delete(k);
  if (k === "shift") state.sprint = false;
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
  for (const m of world.monsters) {
    if (m.alive) hit("monster", m, m.ground, 1.5);
  }
  for (const h of world.hunters) {
    if (h.boss.alive) hit("boss", h.boss, h, 1.7);
    hit("lever", h.lever, h, 1.3);
  }
  return best;
}

$("world").addEventListener("pointerdown", (e) => {
  if (!state.started || state.panelOpen || state.modal || state.chatOpen) return;
  if (e.button !== undefined && e.button !== 0) return;
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
  const goal = nearestWalkable(world, wx, wy, 2);
  if (!goal) {
    toast("Não dá para andar aí. A água e as paredes ficam de fora.", 3000);
    return;
  }
  clearPath();
  setPathTo(goal.x, goal.y, null);
});

$("btn-chat").addEventListener("click", openChat);
$("btn-sheet").addEventListener("click", openSheet);
$("btn-rede").addEventListener("click", openRede);
$("panel-live").addEventListener("pointerdown", () => {
  if (state.currentPost) quests.report("lab", state.currentPost);
}, { passive: true });
$("btn-journal").addEventListener("click", openJournal);
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

$("chat-form").addEventListener("submit", (e) => {
  e.preventDefault();
  const text = $("chat-input").value.trim();
  if (!text) return;
  if (state.net && state.net.sendChat(text)) {
    player.bubble = { text, until: performance.now() + 6500 };
    $("chat-input").value = "";
  } else {
    toast("a mensagem não saiu. Veja se o sinal está de pé.");
  }
});
$("chat-cancel").addEventListener("click", closeChat);

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
    if (lead) lead.innerHTML = "Cada continente é uma página. Ande com o direcional, toque no chão para ir até ali, segure <strong>Turbo</strong> para acelerar e toque em <kbd>A</kbd> nas estações para descobrir 32 fragmentos de computação, matemática, física, química, música e inteligência artificial.";
    const controls = document.querySelector(".intro-controls");
    if (controls) controls.innerHTML = "toque no chão para andar · <strong>Turbo</strong> acelera · <kbd>A</kbd> interage · Falar abre a conversa";
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
    window.__mundo = { player, state, world, renderer, audio, quests, rede, rpg, sheetUi, duelUi };
  }
})();

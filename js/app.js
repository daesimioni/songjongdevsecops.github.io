import {
  ZONES, PLAYER_SPEED, PLAYER_W, PLAYER_H, INTERACT_RADIUS, PLAYER_COLORS,
  STORAGE, NET,
} from "./config.js";
import { createWorld } from "./world.js";
import { createRenderer } from "./render.js";
import { createAudio } from "./audio.js";
import { POSTS, NPCS } from "./content.js";
import { Net } from "./net.js";

const $ = (id) => document.getElementById(id);

const LIVE = {
  logic: () => import("./zones/logic.js"),
  fractal: () => import("./zones/fractal.js"),
  fourier: () => import("./zones/fourier.js"),
  solid: () => import("./zones/solid.js"),
  echo: () => import("./zones/echo.js"),
};

const world = createWorld();
const renderer = createRenderer($("world"), world);
const audio = createAudio();
const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const saved = {
  name: readJSON(STORAGE.name, ""),
  room: readJSON(STORAGE.room, NET.defaultRoom),
  sound: readJSON(STORAGE.sound, false),
  visited: new Set(Array.isArray(readJSON(STORAGE.visits, [])) ? readJSON(STORAGE.visits, []) : []),
};

const player = {
  x: ZONES.plaza.spawn.x,
  y: ZONES.plaza.spawn.y,
  dir: 0,
  moving: false,
  name: saved.name || "viajante",
  colorIndex: Math.floor(Math.random() * PLAYER_COLORS.length),
  bubble: null,
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
  lastZone: null,
  zoneTimer: null,
  footstepAt: 0,
  opened: new Set(saved.visited),
  keys: new Set(),
  touch: { up: false, down: false, left: false, right: false },
};

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}
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

function toast(message, ms = 2600) {
  const el = $("toast");
  el.textContent = message;
  el.hidden = false;
  clearTimeout(toast._t);
  toast._t = setTimeout(() => { el.hidden = true; }, ms);
}

function setSound(on) {
  saved.sound = on;
  writeJSON(STORAGE.sound, on);
  const btn = $("btn-sound");
  btn.setAttribute("aria-pressed", on ? "true" : "false");
  btn.textContent = on ? "Som on" : "Som off";
  if (on) {
    audio.setEnabled(true);
    audio.unlock();
  } else {
    audio.setEnabled(false);
  }
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
  const pill = $("net-pill");
  if (pill.classList.contains("on")) {
    $("online").textContent = state.peers.length > 0
      ? `${state.peers.length + 1} na praça` : "praça vazia";
  }
}

function setPeers(peers) {
  state.peers = peers;
  updateOnlineCount();
}

function startNet() {
  if (state.net) return;
  const room = state.room;
  $("room-label").textContent = `sala ${room}`;
  state.net = new Net({
    room,
    name: player.name,
    color: player.color,
    onPeers: setPeers,
    onStatus: setNetStatus,
    onChat: (peer, text) => {
      audio.blip();
      if (state.chatOpen) {
        // a conversa aparece nas bolhas; aqui só evitamos perder o foco
      }
    },
    onError: () => {},
  });
  state.net.connect();
}

function startGame() {
  state.started = true;
  $("intro").hidden = true;
  $("minimap").hidden = false;
  document.body.classList.add("playing");
  if (window.matchMedia("(pointer: coarse)").matches) $("touch").hidden = false;
  audio.unlock();
  if (saved.sound) setSound(true);
  else setSound(false);
  history.replaceState(null, "", `#sala=${state.room}`);
  $("room-label").textContent = `sala ${state.room}`;
  if ($("intro-net").checked) startNet();
  else setNetStatus({ state: "solo", count: 1 });
  showZoneCard(ZONES.plaza, true);
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  if (coarse) {
    document.querySelector("#prompt kbd").textContent = "A";
    setTimeout(() => toast("use o direcional para andar e A para interagir.", 4200), 700);
  } else {
    setTimeout(() => toast("ande com WASD ou setas. E interage, J abre o diário.", 4200), 700);
  }
}

function showZoneCard(zone, first) {
  if (!zone) return;
  const card = $("zone-card");
  $("zone-eyebrow").textContent = first ? "nova região descoberta" : "de volta ao";
  $("zone-name").textContent = zone.name;
  $("zone-sub").textContent = zone.sub;
  card.hidden = true;
  void card.offsetWidth;
  card.hidden = false;
  clearTimeout(state.zoneTimer);
  state.zoneTimer = setTimeout(() => { card.hidden = true; }, 4800);
  if (first) {
    renderer.kick(0.7);
    audio.chime();
    markVisited(zone.id);
  }
}

function markVisited(zoneId) {
  const key = `zone:${zoneId}`;
  if (state.opened.has(key)) return;
  state.opened.add(key);
  writeJSON(STORAGE.visits, Array.from(state.opened));
  toast(`descoberta registrada: ${ZONES[zoneId]?.name || zoneId}`, 2400);
}

function isUnlocked(post) {
  return state.opened.has(`zone:${post.zone}`) || state.opened.has(`post:${post.zone}`);
}

function openJournal() {
  if (state.panelOpen) closePanel();
  closeChat();
  buildJournal();
  openModal("journal");
  audio.open();
}

function buildJournal() {
  const list = $("journal-list");
  list.textContent = "";
  const entries = Object.entries(POSTS);
  const unlocked = entries.filter(([, p]) => isUnlocked(p)).length;
  $("journal-progress").textContent =
    `${unlocked} de ${entries.length} páginas liberadas. Cada canto do mapa esconde uma.`;
  for (const [id, post] of entries) {
    const unlockedHere = isUnlocked(post);
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = "journal-item";
    btn.disabled = !unlockedHere;
    const left = document.createElement("span");
    const b = document.createElement("b");
    b.textContent = unlockedHere ? post.title : "???";
    const s = document.createElement("span");
    s.textContent = unlockedHere
      ? `${post.kicker} · ${post.read} · ${post.date.split("-").reverse().join("/")}`
      : `num canto do mapa (${ZONES[post.zone]?.name || "?"})`;
    left.append(b, s);
    const right = document.createElement("em");
    right.textContent = state.opened.has(`post:${id}`) ? "lida" : unlockedHere ? "abrir" : "trancada";
    btn.append(left, right);
    if (unlockedHere) btn.addEventListener("click", () => {
      closeModal("journal");
      openPost(id);
    });
    list.appendChild(btn);
  }
}

function openModal(name) {
  closeModal(state.modal);
  state.modal = name;
  $(name).hidden = false;
  $("scrim").hidden = false;
  const focusable = $(name).querySelector("button, input");
  focusable?.focus();
}

function closeModal(name) {
  if (name && $(name)) $(name).hidden = true;
  if (state.modal === name) state.modal = null;
  if (!state.modal && !state.panelOpen) $("scrim").hidden = true;
}

async function openPost(id) {
  const post = POSTS[id];
  if (!post) return;
  closeModal(state.modal);
  closeChat();
  if (state.panelOpen) closePanel();
  state.panelOpen = true;
  state.currentPost = id;
  state.opened.add(`post:${id}`);
  writeJSON(STORAGE.visits, Array.from(state.opened));

  $("panel-kicker").textContent = post.kicker;
  $("panel-title").textContent = post.title;
  $("panel-meta").textContent =
    `${post.date.split("-").reverse().join("/")} · ${post.read} · ${post.tags.map((t) => `#${t}`).join(" ")}`;
  $("panel-body").innerHTML = post.body;
  const live = $("panel-live");
  live.textContent = "";
  $("panel").hidden = false;
  $("scrim").hidden = false;
  document.querySelector(".panel-scroll").scrollTop = 0;
  $("panel-close").focus();
  audio.open();

  if (post.live && LIVE[post.live]) {
    const loading = document.createElement("div");
    loading.className = "widget-loading";
    loading.textContent = "acendendo os circuitos...";
    live.appendChild(loading);
    try {
      const mod = await LIVE[post.live]();
      if (!state.panelOpen || state.currentPost !== id) return;
      live.textContent = "";
      const cleanup = await mod.mount(live, {
        audio,
        toast,
        reducedMotion,
        enableSound: () => setSound(true),
        onOpenZone: (zoneId) => {
          const z = ZONES[zoneId];
          if (z) toast(`${z.name}: ${z.sub}`, 2600);
        },
      });
      state.panelCleanup = typeof cleanup === "function" ? cleanup : null;
    } catch (e) {
      live.textContent = "";
      const err = document.createElement("p");
      err.className = "widget-fail";
      err.textContent = "O interativo não carregou agora. O texto continua aqui; recarregue e tente de novo.";
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
  const target = state.nearest;
  if (!target) return;
  if (target.kind === "station") {
    openPost(target.station.post);
  } else if (target.kind === "npc") {
    const npc = target.npc;
    const lines = NPCS[npc.id]?.lines || ["..."];
    npc.lineIndex = ((npc.lineIndex || 0) + 1) % lines.length;
    npc.bubble = { text: lines[npc.lineIndex], until: performance.now() + 6500 };
    audio.blip();
  }
}

function findNearest() {
  let best = null;
  let bestD = INTERACT_RADIUS;
  for (const s of world.stations) {
    const d = Math.hypot(s.x - player.x, s.y - player.y);
    if (d < bestD) { bestD = d; best = { kind: "station", station: s }; }
  }
  for (const n of world.npcs) {
    const d = Math.hypot(n.x - player.x, n.y - player.y);
    if (d < bestD) { bestD = d; best = { kind: "npc", npc: n }; }
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
  const label = near.kind === "station" ? near.station.label : `falar com ${NPCS[near.npc.id]?.name || "alguém"}`;
  if ($("prompt-label").textContent !== label) $("prompt-label").textContent = label;
  $("prompt").hidden = false;
}

function updateMovement(dt) {
  const keys = state.keys;
  let dx = 0, dy = 0;
  if (keys.has("a") || keys.has("arrowleft") || state.touch.left) dx -= 1;
  if (keys.has("d") || keys.has("arrowright") || state.touch.right) dx += 1;
  if (keys.has("w") || keys.has("arrowup") || state.touch.up) dy -= 1;
  if (keys.has("s") || keys.has("arrowdown") || state.touch.down) dy += 1;
  if (dx === 0 && dy === 0) { player.moving = false; return; }
  const len = Math.hypot(dx, dy);
  dx /= len; dy /= len;
  const step = PLAYER_SPEED * dt;
  const oldX = player.x, oldY = player.y;
  const nx = player.x + dx * step;
  const ny = player.y + dy * step;
  if (!world.boxCollides(nx, player.y, PLAYER_W, PLAYER_H)) player.x = nx;
  if (!world.boxCollides(player.x, ny, PLAYER_W, PLAYER_H)) player.y = ny;
  const moved = player.x !== oldX || player.y !== oldY;
  player.x = Math.max(0.5, Math.min(47.5, player.x));
  player.y = Math.max(0.5, Math.min(35.5, player.y));
  if (Math.abs(dx) > Math.abs(dy)) player.dir = dx > 0 ? 2 : 1;
  else player.dir = dy > 0 ? 0 : 3;
  player.moving = moved;
  if (!moved) return;
  const now = performance.now();
  if (now - state.footstepAt > 340) {
    state.footstepAt = now;
    audio.footstep();
  }
}

function updateCat(dt) {
  const cat = world.cat;
  const behind = [
    [0, -0.9], [0.9, 0], [-0.9, 0], [0, 0.9],
  ][player.dir] || [0, -0.9];
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
  const id = world.zoneAt(player.x, player.y);
  if (id === state.lastZone) return;
  state.lastZone = id;
  if (!id) return;
  const first = !state.opened.has(`zone:${id}`);
  if (first) showZoneCard(ZONES[id], true);
  else {
    toast(ZONES[id].name, 1500);
  }
}

function loop(now) {
  requestAnimationFrame(loop);
  try {
    const dt = Math.min(0.05, (now - (loop.last || now)) / 1000);
    loop.last = now;
    state.frames = (state.frames || 0) + 1;
    if (state.started && !state.panelOpen && !state.modal && !state.chatOpen) {
      updateMovement(dt);
      updateZone();
    } else {
      player.moving = false;
    }
    updateCat(dt);
    renderer.draw(now, player, state.peers, world.npcs, world.cat, player.moving);
    updatePrompt();
    if (state.net) state.net.setLocal(player.x, player.y, player.dir);
  } catch (e) {
    console.error("[loop] erro", e);
    if (!loop.warned) { loop.warned = true; toast("ops, o laço tropeçou. Veja o console."); }
  }
}

// ---------- eventos ----------

window.addEventListener("keydown", (e) => {
  const tag = (e.target.tagName || "").toLowerCase();
  if (tag === "input" || tag === "textarea") {
    if (e.key === "Escape") { closeChat(); }
    return;
  }
  const k = e.key.toLowerCase();
  if (["arrowup", "arrowdown", "arrowleft", "arrowright", " "].includes(k)) e.preventDefault();
  if (!state.started) return;
  if (k === "escape") {
    if (state.panelOpen) closePanel();
    else if (state.modal) closeModal(state.modal);
    else if (state.chatOpen) closeChat();
    return;
  }
  if (state.panelOpen || state.modal) return;
  if (k === "e" || k === "enter") { interact(); return; }
  if (k === "j") { openJournal(); return; }
  if (k === "t") { openChat(); return; }
  state.keys.add(k);
});

window.addEventListener("keyup", (e) => {
  state.keys.delete(e.key.toLowerCase());
});

window.addEventListener("blur", () => {
  state.keys.clear();
  state.touch.up = state.touch.down = state.touch.left = state.touch.right = false;
});

// controles de toque
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

// clique em estação próxima
$("world").addEventListener("pointerdown", (e) => {
  if (!state.started || state.panelOpen || state.modal || state.chatOpen) return;
  const rect = $("world").getBoundingClientRect();
  const sx = e.clientX - rect.left;
  const sy = e.clientY - rect.top;
  const wx = (sx / renderer.zoom + renderer.camX) / 16;
  const wy = (sy / renderer.zoom + renderer.camY) / 16;
  for (const s of world.stations) {
    if (Math.hypot(s.x - wx, s.y - wy) < 1.4 &&
        Math.hypot(s.x - player.x, s.y - player.y) < INTERACT_RADIUS + 0.6) {
      openPost(s.post);
      return;
    }
  }
});

$("btn-chat").addEventListener("click", openChat);
$("btn-journal").addEventListener("click", openJournal);
$("btn-help").addEventListener("click", () => { openModal("help"); audio.open(); });
$("btn-sound").addEventListener("click", () => setSound(!saved.sound));
$("net-pill").addEventListener("click", async () => {
  const url = `${location.origin}${location.pathname}#sala=${state.room}`;
  try {
    await navigator.clipboard.writeText(url);
    toast("convite copiado. Mande para quem quiser entrar nesta sala.");
  } catch {
    toast(url, 6000);
  }
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

$("intro-form").addEventListener("submit", async (e) => {
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

if (new URLSearchParams(location.search).has("debug")) {
  window.__mundo = { player, state, world, renderer, audio };
}

window.addEventListener("beforeunload", () => {
  if (state.net) state.net.destroy();
});

// boot
(function boot() {
  const roomFromHash = hashRoom();
  if (roomFromHash) state.room = roomFromHash;
  $("intro-name").value = saved.name || "";
  $("intro-room").value = state.room;
  $("net-pill").classList.remove("on");
  $("online").textContent = "solo";
  setSound(false);
  setNetStatus({ state: "solo", count: 1 });
  requestAnimationFrame(loop);
})();

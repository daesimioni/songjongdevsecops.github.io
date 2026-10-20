// Backup da conta na DM do próprio jogador.
//
// O estado local vira JSON, é comprimido e codificado em base64, e viaja como
// DM NIP-17 para a própria chave do jogador: o relay só vê um gift wrap
// cifrado. Quem entra num navegador novo pede os backups e recebe o estado de
// volta. A nsec (STORAGE.nostr) e o chat ficam de fora: a chave é a identidade
// que decifra a DM, e o chat é conversa de terceiros.
import { BACKUP, STORAGE } from "./config.js";

const MARK = BACKUP.mark;
const KEYS = BACKUP.keys;
const HEX64 = /^[0-9a-f]{64}$/i;

function readJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch { return fallback; }
}

function readRaw(key) {
  try { return localStorage.getItem(key); } catch { return null; }
}

function countKeys(obj) {
  return obj && typeof obj === "object" ? Object.keys(obj).length : 0;
}

// base64 sem estourar a pilha em estados grandes
function bytesToB64(bytes) {
  let s = "";
  for (let i = 0; i < bytes.length; i += 4096) {
    s += String.fromCharCode(...bytes.subarray(i, i + 4096));
  }
  return btoa(s);
}

function b64ToBytes(b64) {
  const s = atob(b64);
  const out = new Uint8Array(s.length);
  for (let i = 0; i < s.length; i++) out[i] = s.charCodeAt(i);
  return out;
}

async function compress(bytes) {
  if (typeof CompressionStream === "undefined") return null;
  try {
    const stream = new Blob([bytes]).stream().pipeThrough(new CompressionStream("gzip"));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  } catch { return null; }
}

async function decompress(bytes) {
  if (typeof DecompressionStream === "undefined") return null;
  try {
    const stream = new Blob([bytes]).stream().pipeThrough(new DecompressionStream("gzip"));
    return new Uint8Array(await new Response(stream).arrayBuffer());
  } catch { return null; }
}

function hashOf(text) {
  let h = 0x811c9dc5;
  for (let i = 0; i < text.length; i++) {
    h ^= text.charCodeAt(i);
    h = Math.imul(h, 0x01000193);
  }
  return (h >>> 0).toString(16);
}

export function collect() {
  const keys = {};
  for (const name of KEYS) {
    const raw = readRaw(STORAGE[name]);
    if (raw != null) keys[name] = raw;
  }
  return { v: 1, at: Date.now(), name: readJSON(STORAGE.name, ""), keys };
}

// Conta nova: nada de progresso, nem nome. Só nesse caso o backup entra
// sozinho no boot, para nunca sobrescrever o que já está no navegador.
export function localIsEmpty() {
  const xp = Number(readJSON(STORAGE.xp, 0)) || 0;
  const cards = readJSON(STORAGE.cards, []);
  const rpg = readJSON(STORAGE.rpg, null);
  const quests = readJSON(STORAGE.quests, null);
  // o nome digitado na abertura não é progresso: quem volta num navegador
  // novo digita o nome antes de a conta ser restaurada da DM
  return (
    !xp &&
    (!Array.isArray(cards) || cards.length === 0) &&
    countKeys(rpg?.items) === 0 &&
    countKeys(rpg?.seen) === 0 &&
    countKeys(rpg?.monsters) === 0 &&
    countKeys(quests?.done) === 0 &&
    countKeys(quests?.accepted) === 0
  );
}

export async function encode(snapshot) {
  const raw = new TextEncoder().encode(JSON.stringify(snapshot));
  const packed = await compress(raw);
  if (packed) return `${MARK}z:${bytesToB64(packed)}`;
  return `${MARK}p:${bytesToB64(raw)}`;
}

export async function decode(text) {
  const raw = String(text || "");
  if (!raw.startsWith(MARK)) return null;
  const body = raw.slice(MARK.length);
  const flag = body.slice(0, 2);
  if (flag !== "z:" && flag !== "p:") return null;
  const b64 = body.slice(2);
  if (!b64 || b64.length > BACKUP.max) return null;
  let bytes;
  try { bytes = b64ToBytes(b64); } catch { return null; }
  if (flag === "z:") {
    bytes = await decompress(bytes);
    if (!bytes) return null;
  }
  let obj;
  try { obj = JSON.parse(new TextDecoder().decode(bytes)); } catch { return null; }
  if (!obj || obj.v !== 1 || typeof obj.keys !== "object" || !obj.keys) return null;
  return obj;
}

export function restore(snapshot) {
  if (!snapshot || snapshot.v !== 1 || typeof snapshot.keys !== "object" || !snapshot.keys) {
    return { ok: false, reason: "backup inválido." };
  }
  let written = 0;
  for (const name of KEYS) {
    const value = snapshot.keys[name];
    if (typeof value !== "string") continue;
    try {
      localStorage.setItem(STORAGE[name], value);
      written++;
    } catch { /* cota cheia: segue o que der */ }
  }
  return { ok: written > 0, keys: written };
}

function readStatus() {
  try {
    const obj = JSON.parse(localStorage.getItem(BACKUP.storage) || "null");
    return obj && typeof obj === "object" ? obj : {};
  } catch { return {}; }
}

function writeStatus(obj) {
  try { localStorage.setItem(BACKUP.storage, JSON.stringify(obj)); } catch { /* sem storage */ }
}

// manda o estado como DM para a própria chave; o relay não lê o conteúdo
export async function saveTo(rede, { force = false } = {}) {
  if (!rede?.ready || !HEX64.test(String(rede.pk || ""))) {
    return { ok: false, reason: "a rede ainda não abriu." };
  }
  const snapshot = collect();
  const hash = hashOf(JSON.stringify({ name: snapshot.name, keys: snapshot.keys }));
  const last = readStatus();
  if (!force && hash === last.hash && Date.now() - (Number(last.at) || 0) < BACKUP.every) {
    return { ok: true, skipped: true, at: Number(last.at) || 0 };
  }
  const text = await encode(snapshot);
  if (text.length > BACKUP.max) return { ok: false, reason: "o estado ficou grande demais para a DM." };
  const res = await rede.sendSelf(text);
  if (!res?.ok) return { ok: false, reason: res?.reason || "nenhum relay aceitou a DM.", relays: res?.relays || 0 };
  writeStatus({ at: snapshot.at, bytes: text.length, hash, relays: res.relays || 0 });
  return { ok: true, at: snapshot.at, bytes: text.length, relays: res.relays || 0 };
}

export async function latestFrom(rede) {
  if (!rede?.ready) return null;
  const list = await rede.selfSavesRecent(BACKUP.days, 6000);
  for (const item of list) {
    const snap = await decode(item.text);
    if (snap) return snap;
  }
  return null;
}

export function createBackup({ rede } = {}) {
  let timer = null;
  let busy = false;
  let started = false;

  const saveNow = (opts) => saveTo(rede, opts);

  const tick = async () => {
    if (busy || document.hidden) return;
    busy = true;
    try { await saveNow(); } catch { /* a próxima rodada tenta de novo */ }
    finally { busy = false; }
  };

  const onHide = () => {
    if (document.hidden && !busy) saveNow().catch(() => {});
  };

  function start() {
    if (started) return;
    started = true;
    timer = setInterval(tick, BACKUP.every);
    document.addEventListener("visibilitychange", onHide);
    window.addEventListener("pagehide", onHide);
  }

  function stop() {
    started = false;
    if (timer) clearInterval(timer);
    timer = null;
    document.removeEventListener("visibilitychange", onHide);
    window.removeEventListener("pagehide", onHide);
  }

  async function restoreIfEmpty() {
    if (!localIsEmpty()) return { ok: false, reason: "esta conta já tem progresso aqui." };
    const snapshot = await latestFrom(rede);
    if (!snapshot) return { ok: false, reason: "nenhum backup encontrado na sua DM." };
    const res = restore(snapshot);
    return { ...res, restored: res.ok, at: snapshot.at };
  }

  async function restoreFromDm() {
    const snapshot = await latestFrom(rede);
    if (!snapshot) return { ok: false, reason: "nenhum backup encontrado na sua DM." };
    const res = restore(snapshot);
    return { ...res, at: snapshot.at };
  }

  return { start, stop, saveNow, restoreIfEmpty, restoreFromDm, status: readStatus, collect, localIsEmpty };
}

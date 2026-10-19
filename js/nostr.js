// A conta do jogador é uma chave Nostr criada no próprio navegador.
// Os canais do jogo carregam os selos `client`/`game`, e só eventos com esses
// selos entram na tela: nada de conteúdo Nostr de fora do mundo.
import { NOSTR, STORAGE } from "./config.js";

const CDN = "https://esm.sh/nostr-tools@2.25.2";
const HEX64 = /^[0-9a-f]{64}$/i;

let toolsPromise = null;
function loadTools() {
  if (!toolsPromise) {
    toolsPromise = import(CDN).catch((err) => {
      toolsPromise = null;
      throw err;
    });
  }
  return toolsPromise;
}

const nowSec = () => Math.floor(Date.now() / 1000);
const clean = (s, max) => String(s ?? "")
  .replace(/[\u0000-\u0008\u000b-\u001f\u007f]/g, " ")
  .replace(/\s+/g, " ")
  .trim()
  .slice(0, max);
const hexOf = (bytes) => Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
function bytesOf(hex) {
  if (!HEX64.test(hex)) return null;
  const out = new Uint8Array(32);
  for (let i = 0; i < 32; i++) out[i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
  return out;
}
function readStore() {
  try {
    const raw = localStorage.getItem(NOSTR.storage);
    const obj = raw ? JSON.parse(raw) : null;
    return obj && typeof obj === "object" ? obj : {};
  } catch { return {}; }
}
function writeStore(obj) {
  try { localStorage.setItem(NOSTR.storage, JSON.stringify(obj)); } catch { /* sem storage */ }
}

function hasTag(ev, name, value) {
  return Array.isArray(ev.tags) && ev.tags.some((t) => Array.isArray(t) && t[0] === name && (value === undefined || t[1] === value));
}
function tagValue(ev, name) {
  const t = Array.isArray(ev.tags) ? ev.tags.find((x) => Array.isArray(x) && x[0] === name) : null;
  return t ? String(t[1] || "") : "";
}
function shortKey(pk) {
  return `${String(pk).slice(0, 8)}…`;
}

export class Rede {
  constructor({ name = "viajante" } = {}) {
    this.name = clean(name, 24) || "viajante";
    this.ready = false;
    this.initPromise = null;
    this.nt = null;
    this.pool = null;
    this.sk = null;
    this.pk = "";
    this.npub = "";
    this.names = new Map();
    this.conversations = new Map();
    this.seenMsgs = new Set();
    this.seenWraps = new Set();
    this.channelCache = new Map();
    this.channelId = "";
    this.channelCb = null;
    this.channelSub = null;
    this.dmSub = null;
    this.presenceSub = null;
    this.presenceTimer = null;
    this.presenceInfo = null;
    this.presence = new Map();
    this.onStatus = null;
    this.onDm = null;
    this.onChannel = null;
    this.onPresence = null;
    this.closed = false;
    this.lastSend = 0;
  }

  status(state, detail = {}) {
    try { this.onStatus?.({ state, ...detail }); } catch { /* quem escuta se vira */ }
  }

  init() {
    if (this.ready || this.closed) return this.ready ? Promise.resolve(true) : Promise.resolve(false);
    if (!this.initPromise) {
      this.initPromise = this.boot().catch((err) => {
        this.initPromise = null;
        console.warn("[rede]", err?.message || err);
        this.status("sem rede", { message: "não deu para falar com os relays agora" });
        throw err;
      });
    }
    return this.initPromise;
  }

  async boot() {
    this.status("abrindo");
    const nt = await loadTools();
    if (this.closed) return false;
    this.nt = nt;

    const stored = readStore();
    let skHex = typeof stored.sk === "string" && HEX64.test(stored.sk) ? stored.sk : "";
    if (!skHex) {
      skHex = hexOf(nt.generateSecretKey());
      writeStore({ ...stored, sk: skHex, created: Date.now() });
    }
    this.sk = bytesOf(skHex);
    this.pk = nt.getPublicKey(this.sk);
    this.npub = nt.nip19.npubEncode(this.pk);
    this.pool = new nt.SimplePool();
    this.stored = readStore();
    this.ready = true;
    this.status("pronta");
    this.watchDms();
    this.announceDmRelays();
    return true;
  }

  setName(name) {
    this.name = clean(name, 24) || "viajante";
  }

  get short() {
    return shortKey(this.pk);
  }

  secret() {
    if (!this.ready) return "";
    try { return this.nt.nip19.nsecEncode(this.sk); } catch { return ""; }
  }

  async importSecret(raw) {
    await this.init();
    const input = String(raw || "").trim();
    let sk = null;
    if (HEX64.test(input)) sk = bytesOf(input);
    else {
      try {
        const dec = this.nt.nip19.decode(input);
        if (dec.type === "nsec" && dec.data instanceof Uint8Array && dec.data.length === 32) sk = dec.data;
      } catch { /* formato errado */ }
    }
    if (!sk) return { ok: false, reason: "isso não parece uma chave nsec." };
    this.sk = sk;
    this.pk = this.nt.getPublicKey(sk);
    this.npub = this.nt.nip19.npubEncode(this.pk);
    writeStore({ ...readStore(), sk: hexOf(sk), created: Date.now() });
    this.resetRuntime();
    this.watchDms();
    this.announceDmRelays();
    this.status("pronta");
    return { ok: true, npub: this.npub };
  }

  async resetIdentity() {
    await this.init();
    const sk = this.nt.generateSecretKey();
    this.sk = sk;
    this.pk = this.nt.getPublicKey(sk);
    this.npub = this.nt.nip19.npubEncode(this.pk);
    writeStore({ sk: hexOf(sk), created: Date.now() });
    this.resetRuntime();
    this.watchDms();
    this.announceDmRelays();
    this.status("pronta");
    return this.npub;
  }

  resetRuntime() {
    try { this.dmSub?.close(); } catch { /* já foi */ }
    try { this.presenceSub?.close(); } catch { /* já foi */ }
    this.dmSub = null;
    this.presenceSub = null;
    this.channelSub?.close();
    this.channelSub = null;
    this.channelCache.clear();
    this.names.clear();
    this.conversations.clear();
    this.seenMsgs.clear();
    this.seenWraps.clear();
    this.presence.clear();
    this.stored = { ...readStore(), dmRelays: "" };
  }

  // ---------- perfil ----------
  async publishProfile({ name, about } = {}) {
    await this.init();
    const content = JSON.stringify({
      name: clean(name || this.name, 24),
      about: clean(about, 240),
      game: NOSTR.tag,
    });
    const ev = this.nt.finalizeEvent({
      kind: 0,
      created_at: nowSec(),
      tags: [["client", NOSTR.client], ["game", NOSTR.tag]],
      content,
    }, this.sk);
    const sent = await this.publish(ev);
    return { ok: sent > 0, relays: sent };
  }

  async announceDmRelays() {
    if (!this.ready || this.closed) return 0;
    const stored = this.stored || readStore();
    const want = `${this.pk}:${NOSTR.relays.join(",")}`;
    if (stored.dmRelays === want) return 0;
    const ev = this.nt.finalizeEvent({
      kind: 10050,
      created_at: nowSec(),
      tags: [
        ...NOSTR.relays.map((url) => ["relay", url]),
        ["client", NOSTR.client],
      ],
      content: "",
    }, this.sk);
    const sent = await this.publish(ev);
    if (sent > 0) {
      this.stored = { ...stored, dmRelays: want };
      writeStore({ ...readStore(), dmRelays: want });
    }
    return sent;
  }

  async publish(ev) {
    if (!this.pool) return 0;
    try {
      const results = await Promise.allSettled(this.pool.publish(NOSTR.relays, ev));
      return results.filter((r) => r.status === "fulfilled").length;
    } catch { return 0; }
  }

  // ---------- canais públicos ----------
  async openChannel(id, onUpdate) {
    await this.init();
    this.channelId = id;
    this.channelCb = typeof onUpdate === "function" ? onUpdate : null;
    if (!this.channelCache.has(id)) {
      this.channelCache.set(id, new Map());
      const filter = { kinds: [1], "#t": [`${NOSTR.namespace}:${id}`], limit: 60 };
      let past = [];
      try { past = await this.pool.querySync(NOSTR.relays, filter); } catch { past = []; }
      for (const ev of past) this.acceptChannel(ev, id);
      this.emitChannel(id);
    }
    if (this.channelSub && this.subChannel === id) return this.channelEvents(id);
    try { this.channelSub?.close(); } catch { /* já foi */ }
    this.subChannel = id;
    this.channelSub = this.pool.subscribe(
      NOSTR.relays,
      { kinds: [1], "#t": [`${NOSTR.namespace}:${id}`], since: nowSec() - 120 },
      {
        onevent: (ev) => {
          if (this.acceptChannel(ev, id)) {
            this.emitChannel(id);
            this.status("pronta", { live: true });
          }
        },
      },
    );
    return this.channelEvents(id);
  }

  closeChannel() {
    try { this.channelSub?.close(); } catch { /* já foi */ }
    this.channelSub = null;
    this.subChannel = "";
    this.channelId = "";
    this.channelCb = null;
  }

  acceptChannel(ev, id) {
    if (!ev || ev.kind !== 1 || !ev.id || !ev.pubkey) return false;
    const bucket = this.channelCache.get(id);
    if (!bucket || bucket.has(ev.id)) return false;
    if (tagValue(ev, "client") !== NOSTR.client) return false;
    if (tagValue(ev, "game") !== NOSTR.tag) return false;
    if (!hasTag(ev, "t", NOSTR.namespace)) return false;
    if (!hasTag(ev, "t", `${NOSTR.namespace}:${id}`)) return false;
    const text = clean(ev.content, 400);
    if (!text) return false;
    const name = clean(tagValue(ev, "name"), 24) || this.nameOf(ev.pubkey);
    this.noteName(ev.pubkey, name);
    bucket.set(ev.id, {
      id: ev.id,
      author: ev.pubkey,
      name,
      text,
      at: Number(ev.created_at) || nowSec(),
      mine: ev.pubkey === this.pk,
    });
    if (bucket.size > 120) {
      const oldest = bucket.keys().next().value;
      bucket.delete(oldest);
    }
    return true;
  }

  channelEvents(id) {
    const bucket = this.channelCache.get(id);
    if (!bucket) return [];
    return Array.from(bucket.values()).sort((a, b) => a.at - b.at);
  }

  emitChannel(id) {
    if (this.channelId !== id) return;
    try { this.channelCb?.(this.channelEvents(id)); } catch { /* ui se vira */ }
  }

  async sendChannel(text, id = this.channelId) {
    await this.init();
    const t = clean(text, 400);
    if (!t) return { ok: false, reason: "mensagem vazia" };
    const now = Date.now();
    if (now - this.lastSend < 1200) return { ok: false, reason: "calma, uma de cada vez" };
    this.lastSend = now;
    const ev = this.nt.finalizeEvent({
      kind: 1,
      created_at: nowSec(),
      tags: [
        ["t", NOSTR.namespace],
        ["t", `${NOSTR.namespace}:${id}`],
        ["client", NOSTR.client],
        ["game", NOSTR.tag],
        ["name", clean(this.name, 24) || "viajante"],
      ],
      content: t,
    }, this.sk);
    const relays = await this.publish(ev);
    this.status(relays > 0 ? "pronta" : "sem rede", { relays });
    if (relays > 0) {
      this.acceptChannel(ev, id);
      this.emitChannel(id);
    }
    return { ok: relays > 0, relays, id: ev.id };
  }

  // ---------- DMs (NIP-17) ----------
  watchDms() {
    if (!this.ready || this.closed || this.dmSub) return;
    const since = nowSec() - 2 * 86400;
    try {
      this.dmSub = this.pool.subscribe(
        NOSTR.relays,
        { kinds: [1059], "#p": [this.pk], since },
        {
          onevent: (ev) => this.handleWrap(ev),
          onclose: () => {
            this.dmSub = null;
            if (!this.closed) setTimeout(() => this.watchDms(), 9000);
          },
        },
      );
    } catch (err) {
      console.warn("[rede] dm", err?.message || err);
    }
  }

  handleWrap(ev) {
    if (!ev || ev.kind !== 1059 || !ev.id || this.seenWraps.has(ev.id)) return;
    this.seenWraps.add(ev.id);
    if (this.seenWraps.size > 500) this.seenWraps.clear();
    let rumor = null;
    try { rumor = this.nt.nip17.unwrapEvent(ev, this.sk); } catch { return; }
    if (!rumor || typeof rumor.content !== "string") return;
    const text = clean(rumor.content, 500);
    if (!text) return;
    const mine = rumor.pubkey === this.pk;
    const at = Number(rumor.created_at) || nowSec();
    if (mine) {
      // A cópia para si mesmo não guarda o destinatário; ela confirma a
      // mensagem que ainda está pendente na conversa local.
      let pending = null;
      for (const msgs of this.conversations.values()) {
        pending = msgs.find((m) => m.pending && m.text === text) || null;
        if (pending) break;
      }
      if (!pending) return;
      pending.id = rumor.id;
      pending.at = at;
      pending.pending = false;
      this.onDm?.({ ...pending, self: true });
      return;
    }
    const peer = rumor.pubkey;
    if (!peer || peer === this.pk) return;
    if (this.seenMsgs.has(rumor.id)) return;
    this.seenMsgs.add(rumor.id);
    if (this.seenMsgs.size > 800) this.seenMsgs.clear();

    const list = this.conversations.get(peer) || [];
    const msg = { id: rumor.id, author: rumor.pubkey, peer, text, at, mine, self: mine };
    list.push(msg);
    list.sort((a, b) => a.at - b.at);
    if (list.length > 200) list.shift();
    this.conversations.set(peer, list);
    if (!this.names.has(peer)) this.noteName(peer, shortKey(peer));
    this.onDm?.(msg);
  }

  async sendDm(peer, text) {
    await this.init();
    const target = String(peer || "").trim();
    if (!HEX64.test(target)) return { ok: false, reason: "preciso da chave pública (npub ou hex) de quem vai receber." };
    const t = clean(text, 500);
    if (!t) return { ok: false, reason: "mensagem vazia" };
    const now = Date.now();
    if (now - this.lastSend < 1200) return { ok: false, reason: "calma, uma de cada vez" };
    this.lastSend = now;
    let wraps = [];
    try {
      wraps = this.nt.nip17.wrapManyEvents(this.sk, [{ publicKey: target }], t);
    } catch (err) {
      return { ok: false, reason: err?.message || "não deu para selar a mensagem." };
    }
    const list = this.conversations.get(target) || [];
    const pending = {
      id: `local:${Math.random().toString(36).slice(2, 10)}`,
      author: this.pk,
      peer: target,
      text: t,
      at: nowSec(),
      mine: true,
      pending: true,
    };
    list.push(pending);
    this.conversations.set(target, list);
    const relays = wraps.length ? await this.publishMany(wraps) : 0;
    this.status(relays > 0 ? "pronta" : "sem rede", { relays });
    if (relays === 0) {
      pending.pending = false;
      pending.failed = true;
      this.onDm?.({ ...pending, self: true });
    }
    return { ok: relays > 0, relays, wraps: wraps.length };
  }

  async publishMany(events) {
    if (!this.pool) return 0;
    try {
      const per = events.flatMap((ev) => this.pool.publish(NOSTR.relays, ev));
      const settled = await Promise.allSettled(per);
      return settled.filter((r) => r.status === "fulfilled").length;
    } catch { return 0; }
  }

  conversation(peer) {
    return (this.conversations.get(peer) || []).slice();
  }

  dmPeers() {
    return Array.from(this.conversations.entries())
      .map(([peer, list]) => ({
        peer,
        name: this.nameOf(peer),
        last: list.length ? list[list.length - 1] : null,
      }))
      .sort((a, b) => (b.last?.at || 0) - (a.last?.at || 0));
  }

  nameOf(pk) {
    if (pk === this.pk) return this.name;
    return this.names.get(pk) || shortKey(pk);
  }

  noteName(pk, name) {
    const n = clean(name, 24);
    if (!pk || !n) return;
    this.names.set(pk, n);
    if (this.names.size > 500) {
      this.names.delete(this.names.keys().next().value);
    }
  }

  // ---------- presença ----------
  async connectPresence(info) {
    await this.init();
    this.presenceInfo = typeof info === "function" ? info : null;
    if (!this.presenceSub) {
      try {
        this.presenceSub = this.pool.subscribe(
          NOSTR.relays,
          { kinds: [20001], "#t": [`${NOSTR.namespace}:presenca`] },
          { onevent: (ev) => this.acceptPresence(ev) },
        );
      } catch (err) {
        console.warn("[rede] presença", err?.message || err);
      }
    }
    if (!this.presenceTimer && !this.closed) {
      this.presenceTimer = setInterval(() => this.publishPresence(), 90000);
    }
    this.publishPresence();
  }

  stopPresence() {
    clearInterval(this.presenceTimer);
    this.presenceTimer = null;
    try { this.presenceSub?.close(); } catch { /* já foi */ }
    this.presenceSub = null;
  }

  async publishPresence() {
    if (!this.ready || !this.pool || this.closed) return;
    const info = this.presenceInfo?.() || {};
    const content = JSON.stringify({
      n: clean(this.name, 24) || "viajante",
      c: clean(info.continent, 16),
      t: clean(info.title, 32),
    });
    const ev = this.nt.finalizeEvent({
      kind: 20001,
      created_at: nowSec(),
      tags: [
        ["t", `${NOSTR.namespace}:presenca`],
        ["client", NOSTR.client],
        ["game", NOSTR.tag],
      ],
      content,
    }, this.sk);
    this.presence.set(this.pk, {
      pk: this.pk,
      name: this.name,
      continent: info.continent || "",
      title: info.title || "",
      at: nowSec(),
      mine: true,
    });
    this.emitPresence();
    const relays = await this.publish(ev);
    this.status(relays > 0 ? "pronta" : "sem rede", { relays });
  }

  acceptPresence(ev) {
    if (!ev || ev.kind !== 20001 || ev.pubkey === this.pk) return;
    if (tagValue(ev, "client") !== NOSTR.client) return;
    if (tagValue(ev, "game") !== NOSTR.tag) return;
    if (!hasTag(ev, "t", `${NOSTR.namespace}:presenca`)) return;
    let data = {};
    try { data = JSON.parse(ev.content || "{}"); } catch { return; }
    const name = clean(data.n, 24);
    if (!name) return;
    this.noteName(ev.pubkey, name);
    this.presence.set(ev.pubkey, {
      pk: ev.pubkey,
      name,
      continent: clean(data.c, 16),
      title: clean(data.t, 32),
      at: Number(ev.created_at) || nowSec(),
      mine: false,
    });
    this.prunePresence();
    this.emitPresence();
  }

  prunePresence() {
    const cutoff = nowSec() - 360;
    for (const [pk, entry] of this.presence) {
      if (entry.at < cutoff) this.presence.delete(pk);
    }
  }

  emitPresence() {
    this.prunePresence();
    const list = Array.from(this.presence.values()).sort((a, b) => b.at - a.at);
    try { this.onPresence?.(list); } catch { /* ui se vira */ }
  }

  presenceList() {
    this.prunePresence();
    return Array.from(this.presence.values()).sort((a, b) => b.at - a.at);
  }

  destroy() {
    this.closed = true;
    this.stopPresence();
    try { this.dmSub?.close(); } catch { /* já foi */ }
    try { this.channelSub?.close(); } catch { /* já foi */ }
    this.dmSub = null;
    this.channelSub = null;
    try { this.pool?.close(NOSTR.relays); } catch { /* já foi */ }
    this.pool = null;
    this.ready = false;
  }
}

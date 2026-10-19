import { MAP_W, MAP_H, NET } from "./config.js";

const CDN = "https://cdn.jsdelivr.net/npm/mqtt@5.10.1/dist/mqtt.min.js";

function loadMqtt() {
  if (window.mqtt) return Promise.resolve(window.mqtt);
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = CDN;
    s.async = true;
    s.onload = () => window.mqtt ? resolve(window.mqtt) : reject(new Error("mqtt sem global"));
    s.onerror = () => reject(new Error("não carregou mqtt"));
    document.head.appendChild(s);
  });
}

const clean = (s, max) => String(s || "").replace(/[\u0000-\u001f<>]/g, "").trim().slice(0, max);

function validColor(c) {
  return typeof c === "string" && /^#[0-9a-f]{6}$/i.test(c) ? c : "#61f4c0";
}

export class Net {
  constructor({ room, name, color, onPeers, onStatus, onChat, onError }) {
    this.room = room;
    this.name = clean(name, 16) || "viajante";
    this.color = validColor(color);
    this.id = "ms_" + Math.random().toString(36).slice(2, 12);
    this.onPeers = onPeers;
    this.onStatus = onStatus;
    this.onChat = onChat;
    this.onError = onError;
    this.client = null;
    this.peers = new Map();
    this.lastChat = 0;
    this.sendEvery = null;
    this.pruneEvery = null;
    this.closed = false;
    this.state = { x: 24, y: 19.5, dir: 0 };
    this.connected = false;
    this.msgCount = 0;
  }

  topic(kind) { return `${NET.prefix}/${this.room}/${kind}`; }

  async connect() {
    this.onStatus?.({ state: "connecting", count: 1 });
    let mqtt;
    try { mqtt = await loadMqtt(); }
    catch (e) { console.warn("[net]", e?.message); this.fail("sem sinal"); return false; }
    if (this.closed) return false;

    return new Promise((resolve) => {
      let settled = false;
      const client = mqtt.connect(NET.broker, {
        clientId: this.id,
        clean: true,
        reconnectPeriod: 4000,
        connectTimeout: 9000,
        keepalive: 30,
        protocolVersion: 4,
      });
      this.client = client;

      const giveUp = setTimeout(() => {
        if (!settled) { settled = true; this.fail("sem sinal"); resolve(false); }
      }, 11000);

      client.on("connect", () => {
        if (this.closed) return;
        this.connected = true;
        clearTimeout(giveUp);
        clearInterval(this.sendEvery);
        clearInterval(this.pruneEvery);
        client.subscribe([
          this.topic("state"),
          this.topic("chat"),
          this.topic("bye"),
        ], { qos: 0 }, (err, granted) => {
          if (err) { this.fail("sem sinal"); if (!settled) { settled = true; resolve(false); } return; }
          this.onStatus?.({ state: "online", count: this.peers.size + 1 });
          this.publishState(true);
          this.sendEvery = setInterval(() => this.publishState(false), NET.stateEvery);
          this.pruneEvery = setInterval(() => this.prune(), 1200);
          if (!settled) { settled = true; resolve(true); }
        });
      });

      client.on("message", (topic, payload) => {
        this.msgCount++;
        try { this.handle(topic, JSON.parse(payload.toString())); }
        catch { /* mensagem de estranho, ignora */ }
      });

      client.on("error", (e) => {
        console.warn("[net]", e?.message);
        if (!this.connected) this.fail("sem sinal");
        else this.onError?.(e);
      });

      client.on("close", () => {
        if (this.connected && !this.closed) {
          this.connected = false;
          this.onStatus?.({ state: "offline", count: this.peers.size + 1 });
        }
      });

      client.on("offline", () => {
        if (!this.closed) this.onStatus?.({ state: "offline", count: this.peers.size + 1 });
      });
    });
  }

  fail(state) {
    this.onStatus?.({ state, count: 1 });
  }

  handle(topic, msg) {
    if (!msg || typeof msg !== "object" || typeof msg.id !== "string") return;
    if (msg.id === this.id) return;
    if (this.peers.size > 40) return;
    const now = Date.now();

    if (topic.endsWith("/bye")) {
      if (this.peers.delete(msg.id)) this.emitPeers();
      return;
    }

    if (topic.endsWith("/state")) {
      const x = Number(msg.x), y = Number(msg.y);
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;
      if (x < 0 || y < 0 || x > MAP_W || y > MAP_H) return;
      const name = clean(msg.n, 16) || "viajante";
      const dir = Number.isInteger(msg.d) && msg.d >= 0 && msg.d <= 3 ? msg.d : 0;
      const color = validColor(msg.c);
      const old = this.peers.get(msg.id);
      const moving = old ? Math.hypot(old.x - x, old.y - y) > 0.015 : false;
      const peer = {
        id: msg.id,
        name,
        color,
        x, y, dir,
        moving,
        lastSeen: now,
        bubble: old?.bubble || null,
      };
      this.peers.set(msg.id, peer);
      this.emitPeers();
      return;
    }

    if (topic.endsWith("/chat")) {
      const peer = this.peers.get(msg.id);
      if (!peer) return;
      const text = clean(msg.txt, 120);
      if (!text) return;
      const last = peer.lastChatAt || 0;
      if (now - last < 800) return;
      peer.lastChatAt = now;
      peer.bubble = { text, until: performance.now() + 7000 };
      this.onChat?.(peer, text);
      this.emitPeers();
    }
  }

  emitPeers() {
    this.onPeers?.(Array.from(this.peers.values()));
  }

  prune() {
    const now = Date.now();
    let changed = false;
    for (const [id, p] of this.peers) {
      if (now - p.lastSeen > NET.peerTimeout) {
        this.peers.delete(id);
        changed = true;
      }
    }
    if (changed) this.emitPeers();
    this.onStatus?.({
      state: this.connected ? "online" : "offline",
      count: this.peers.size + 1,
    });
  }

  setLocal(x, y, dir) {
    this.state = { x, y, dir };
  }

  publishState(force) {
    if (!this.connected || !this.client) return;
    this.client.publish(this.topic("state"), JSON.stringify({
      id: this.id, n: this.name, c: this.color,
      x: Number(this.state.x.toFixed(2)),
      y: Number(this.state.y.toFixed(2)),
      d: this.state.dir,
    }), { qos: 0 });
    if (force) this.emitPeers();
  }

  sendChat(text) {
    const now = Date.now();
    if (now - this.lastChat < 900) return false;
    if (!this.connected || !this.client) return false;
    const cleanText = clean(text, 120);
    if (!cleanText) return false;
    this.lastChat = now;
    this.client.publish(this.topic("chat"), JSON.stringify({
      id: this.id, n: this.name, c: this.color, txt: cleanText,
    }), { qos: 0 });
    return true;
  }

  destroy() {
    this.closed = true;
    clearInterval(this.sendEvery);
    clearInterval(this.pruneEvery);
    if (this.client && this.connected) {
      try {
        this.client.publish(this.topic("bye"), JSON.stringify({ id: this.id }));
        this.client.end(true);
      } catch { /* já foi */ }
    }
    this.client = null;
    this.connected = false;
    this.peers.clear();
  }
}

import { MAP_W, MAP_H, NET } from "../core/runtime-config.js";
import { avatarFromCode } from "../content/avatar.js";
import { Malha } from "./malha.js";

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

function validOutfit(o) {
  return typeof o === "string" && /^[a-z0-9-]{1,20}$/.test(o) ? o : "";
}

// o personagem viaja em cinco campos curtos: "f|chanel|1|1|0"
function validLook(a) {
  return typeof a === "string" && /^[fm]\|[a-z]{3,10}\|\d{1,2}\|\d{1,2}\|\d{1,2}$/.test(a) ? a : "";
}

export class Net {
  constructor({ room, name, color, outfit, look, onPeers, onStatus, onChat, onPvp, onParty, onError }) {
    this.room = room;
    this.name = clean(name, 16) || "viajante";
    this.color = validColor(color);
    this.outfit = validOutfit(outfit);
    this.look = validLook(look);
    this.id = "ms_" + Math.random().toString(36).slice(2, 12);
    this.onPeers = onPeers;
    this.onStatus = onStatus;
    this.onChat = onChat;
    this.onPvp = onPvp;
    this.onParty = onParty;
    this.onError = onError;
    this.lastPvp = 0;
    this.lastPvpSend = 0;
    this.client = null;
    this.peers = new Map();
    this.lastChat = 0;
    this.sendEvery = null;
    this.pruneEvery = null;
    this.closed = false;
    this.state = { x: 24, y: 19.5, dir: 0, m: 0 };
    this.vitals = { hp: 0, hpMax: 1, mana: 0, manaMax: 1 };
    this.connected = false;
    this.msgCount = 0;
    this.pubkey = "";
    this.seq = 0;
    this.ultimoBroker = 0;
    this.vistos = new Map();
    // uma conta é uma pessoa só: a sessão mais nova fica e as outras emudecem
    this.inicio = Date.now();
    this.contaTomada = false;
    this.contaVistaEm = 0;
    this.contaRivais = new Map();
    this.malha = new Malha({
      id: this.id,
      enviarSinal: (para, tipo, dados) => this.publishSignal(para, tipo, dados),
      aoEstado: (msg) => this.absorverEstado(msg),
      aoEvento: (msg) => this.absorverEvento(msg),
      aoMudar: () => this.emitPeers(),
    });
  }

  // sinalização da malha também passa pelo broker: é o único jeito de dois
  // browsers se encontrarem; depois do canal aberto, a conversa é direta
  publishSignal(para, tipo, dados) {
    if (!this.connected || !this.client) return false;
    const corpo = { id: this.id, to: para, kind: tipo };
    if (dados?.sdp) corpo.sdp = dados.sdp;
    if (dados?.candidate) corpo.candidate = dados.candidate;
    this.client.publish(this.topic("malha"), JSON.stringify(corpo), { qos: 1 });
    return true;
  }

  jaVisto(uid) {
    if (!uid) return false;
    if (this.vistos.has(uid)) return true;
    this.vistos.set(uid, Date.now());
    if (this.vistos.size > 400) {
      const corte = Date.now() - 30000;
      for (const [k, t] of this.vistos) if (t < corte) this.vistos.delete(k);
    }
    return false;
  }

  eventoDeMalha(kind, corpo) {
    const msg = { ...corpo, id: corpo.id || this.id };
    if (this.jaVisto(msg.uid)) return;
    if (kind === "chat") this.aplicarChat(msg);
    else if (kind === "pvp") this.aplicarPvp(msg);
    else if (kind === "party") this.aplicarParty(msg);
  }

  absorverEvento(msg) {
    if (!msg || typeof msg !== "object") return;
    if (msg.id === this.id) return;
    const kind = msg.tipo;
    if (kind === "chat" || kind === "pvp" || kind === "party") {
      this.handle(this.topic(kind), msg);
    }
  }

  // o estado que chega pelo canal direto passa pelo mesmo crivo do broker
  absorverEstado(msg) {
    if (!msg || typeof msg !== "object" || typeof msg.id !== "string") return;
    if (msg.id === this.id) return;
    this.handle(this.topic("state"), msg);
    if (!this.mesmaConta(msg)) this.malha.garantir(msg.id);
  }

  // duas abas ou dois aparelhos com a mesma chave. Sem servidor não existe
  // autoridade: a ordem é (inicio, id), que os dois lados calculam igual.
  mesmaConta(msg) {
    return !!this.pubkey && typeof msg.k === "string" && msg.k.toLowerCase() === this.pubkey;
  }

  // a mais nova fica; a mais velha emudece e volta quando a outra sumir
  avaliarConta(msg) {
    const inicioRival = Number(msg.ini) || 0;
    const souMaisNovo = this.inicio > inicioRival
      || (this.inicio === inicioRival && this.id > msg.id);
    if (this.peers.delete(msg.id)) this.emitPeers();
    if (souMaisNovo) {
      this.contaRivais.set(msg.id, Date.now());
      return;
    }
    this.contaVistaEm = Date.now();
    this.contaRivais.delete(msg.id);
    if (!this.contaTomada) {
      this.contaTomada = true;
      // avisa quem estava vendo esta sessão para sumir com o avatar agora,
      // em vez de esperar o tempo limite
      this.publicarSaida();
      this.onStatus?.({ state: "duplicado", count: this.peers.size + 1 });
    }
  }

  publicarSaida() {
    if (!this.client || !this.connected) return;
    try { this.client.publish(this.topic("bye"), JSON.stringify({ id: this.id })); } catch { /* já foi */ }
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
          this.topic("pvp"),
          this.topic("party"),
          this.topic("malha"),
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
    if (msg.id.length > 40) return;
    if (msg.id === this.id) return;
    if (msg.uid && this.jaVisto(msg.uid)) return;
    const now = Date.now();
    if (this.contaRivais.has(msg.id)) {
      // sessão antiga da minha conta: some do mundo e não fala comigo
      if (topic.endsWith("/state")) this.contaRivais.set(msg.id, now);
      return;
    }

    if (topic.endsWith("/bye")) {
      if (this.peers.delete(msg.id)) this.emitPeers();
      return;
    }

    if (topic.endsWith("/malha")) {
      if (msg.to !== this.id) return;
      if (!["offer", "answer", "ice"].includes(msg.kind)) return;
      this.malha.receberSinal(msg.id, msg.kind, msg);
      return;
    }

    if (topic.endsWith("/state")) {
      if (this.mesmaConta(msg)) { this.avaliarConta(msg); return; }
      if (!this.peers.has(msg.id) && this.peers.size >= 40) return;
      const x = Number(msg.x), y = Number(msg.y);
      if (!Number.isFinite(x) || !Number.isFinite(y)) return;
      if (x < 0 || y < 0 || x > MAP_W || y > MAP_H) return;
      const name = clean(msg.n, 16) || "viajante";
      const dir = Number.isInteger(msg.d) && msg.d >= 0 && msg.d <= 7 ? msg.d : 0;
      const color = validColor(msg.c);
      const old = this.peers.get(msg.id);
      const seq = Number(msg.s) || 0;
      if (old && msg.s !== undefined && seq < Number(old.seq || 0)) return;
      const moving = old ? Math.hypot(old.x - x, old.y - y) > 0.015 : false;
      const pubkey = typeof msg.k === "string" && /^[0-9a-f]{64}$/i.test(msg.k) ? msg.k.toLowerCase() : "";
      // Reaproveita o mesmo objeto: a interpolação guarda amostras e posição
      // renderizada nele, e recriar a cada pacote jogaria isso no lixo.
      const peer = old || {};
      if (!old) peer.bubble = null;
      const hpMax = Math.max(1, Number(msg.hmax) || 1);
      const manaMax = Math.max(1, Number(msg.mmax) || 1);
      const hp = Number.isFinite(Number(msg.hp)) ? Math.max(0, Math.min(hpMax, Number(msg.hp))) : null;
      const mana = Number.isFinite(Number(msg.mn)) ? Math.max(0, Math.min(manaMax, Number(msg.mn))) : null;
      peer.vitais = hp === null || mana === null ? null : { hp, hpMax, mana, manaMax };
      Object.assign(peer, {
        id: msg.id,
        name,
        color,
        x, y, dir,
        mount: msg.m === 1 || msg.m === true,
        seq,
        pubkey,
        outfit: validOutfit(msg.o),
        look: avatarFromCode(validLook(msg.a)),
        moving,
        lastSeen: now,
      });
      this.peers.set(msg.id, peer);
      this.emitPeers();
      // achou alguém: tenta o canal direto; o broker fica de reserva
      this.malha.garantir(msg.id);
      return;
    }

    if (topic.endsWith("/pvp")) {
      if (now - this.lastPvp < 120) return;
      if (msg.to !== this.id) return;
      const kind = msg.kind;
      if (!["challenge", "accept", "decline", "attack", "defend", "end"].includes(kind)) return;
      if (kind === "attack") {
        const q = msg.question;
        const ok = q && typeof q.q === "string" && q.q.length >= 4 && q.q.length <= 400
          && Array.isArray(q.options) && q.options.length === 5
          && q.options.every((o) => typeof o === "string" && o.length >= 1 && o.length <= 200)
          && Number.isInteger(q.answer) && q.answer >= 0 && q.answer < q.options.length
          && typeof q.why === "string" && q.why.length <= 500
          && Number.isInteger(msg.damage) && msg.damage >= 1 && msg.damage <= 7
          && typeof msg.nonce === "string" && msg.nonce.length >= 1 && msg.nonce.length <= 40;
        if (!ok) return;
      }
      if (kind === "defend" && (typeof msg.correct !== "boolean" || typeof msg.nonce !== "string")) return;
      if (kind === "end" && typeof msg.winner !== "string") return;
      this.lastPvp = now;
      const peer = this.peers.get(msg.id) || { id: msg.id, name: clean(msg.n, 16) || "viajante" };
      this.onPvp?.(peer, msg);
      return;
    }

    if (topic.endsWith("/party")) {
      if (msg.to !== this.id) return;
      if (!["invite", "accept", "leave", "sync"].includes(msg.act)) return;
      const peer = this.peers.get(msg.id) || { id: msg.id, name: clean(msg.n, 16) || "viajante" };
      this.onParty?.(peer, msg);
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
    for (const [id, t] of this.contaRivais) {
      if (now - t > NET.peerTimeout) this.contaRivais.delete(id);
    }
    // a sessão que mandou nesta aba saiu: ela volta a publicar sozinha
    if (this.contaTomada && now - this.contaVistaEm > NET.peerTimeout) {
      this.contaTomada = false;
      this.contaRivais.clear();
      this.publishState(true);
    }
    if (changed) this.emitPeers();
    this.onStatus?.({
      state: this.contaTomada ? "duplicado" : this.connected ? "online" : "offline",
      count: this.peers.size + 1,
    });
  }

  setLocal(x, y, dir, boost = 0) {
    this.state = { x, y, dir, m: boost > 0.35 ? 1 : 0 };
  }

  // vida e mana vão no mesmo pacote da posição: qualquer um vê a barra do outro
  setVitals(hp, hpMax, mana, manaMax) {
    const num = (n, fallback = 0) => (Number.isFinite(Number(n)) ? Math.max(0, Number(n)) : fallback);
    const maxHp = Math.max(1, num(hpMax, 1));
    const maxMana = Math.max(1, num(manaMax, 1));
    this.vitals = {
      hp: Math.min(maxHp, num(hp)),
      hpMax: maxHp,
      mana: Math.min(maxMana, num(mana)),
      manaMax: maxMana,
    };
  }

  setIdentity(pubkey) {
    this.pubkey = typeof pubkey === "string" && /^[0-9a-f]{64}$/i.test(pubkey) ? pubkey.toLowerCase() : "";
    this.publishState(true);
  }

  setName(name) {
    this.name = clean(name, 16) || "viajante";
    this.publishState(true);
  }

  setOutfit(id) {
    this.outfit = validOutfit(id);
    this.publishState(true);
  }

  setColor(color) {
    this.color = validColor(color);
    this.publishState(true);
  }

  setLook(code) {
    this.look = validLook(code);
    this.publishState(true);
  }

  publishState(force) {
    if (this.contaTomada) return;
    this.seq = (this.seq + 1) % 1000000000;
    const msg = {
      id: this.id, n: this.name, c: this.color,
      x: Number(this.state.x.toFixed(2)),
      y: Number(this.state.y.toFixed(2)),
      d: this.state.dir,
      s: this.seq,
      ini: this.inicio,
      m: this.state.m || undefined,
      k: this.pubkey || undefined,
      o: this.outfit || undefined,
      a: this.look || undefined,
      hp: Math.round(this.vitals.hp),
      hmax: Math.round(this.vitals.hpMax),
      mn: Math.round(this.vitals.mana),
      mmax: Math.round(this.vitals.manaMax),
      ttl: 2,
    };
    const diretos = this.malha.enviarEstado(msg);
    // o broker continua servindo de descoberta e de socorro; com canal direto,
    // o estado vai a 10 Hz por ele e o broker fica só como pano de fundo
    const agora = Date.now();
    if (this.connected && this.client && (force || diretos === 0 || agora - this.ultimoBroker > 400)) {
      this.ultimoBroker = agora;
      this.client.publish(this.topic("state"), JSON.stringify(msg), { qos: 0 });
    }
    if (force) this.emitPeers();
  }

  sendPvp(payload) {
    if (this.contaTomada) return false;
    if (!payload || typeof payload !== "object") return false;
    const kind = payload.kind;
    if (!["challenge", "accept", "decline", "attack", "defend", "end"].includes(kind)) return false;
    const now = Date.now();
    if (now - this.lastPvpSend < 150 && kind !== "end") return false;
    this.lastPvpSend = now;
    const msg = { ...payload, id: this.id, n: this.name, tipo: "pvp", uid: `${this.id}:pvp:${now}:${kind}`, ttl: 2 };
    const diretos = this.malha.enviarEvento(msg);
    if (this.connected && this.client) {
      this.client.publish(this.topic("pvp"), JSON.stringify(msg), { qos: 0 });
    }
    return diretos > 0 || !!this.client;
  }

  sendParty(payload) {
    if (this.contaTomada) return false;
    if (!payload || typeof payload !== "object") return false;
    if (!["invite", "accept", "leave", "sync"].includes(payload.act)) return false;
    const now = Date.now();
    const msg = { ...payload, id: this.id, n: this.name, tipo: "party", uid: `${this.id}:party:${now}:${payload.act}`, ttl: 2 };
    const diretos = this.malha.enviarEvento(msg);
    if (this.connected && this.client) {
      this.client.publish(this.topic("party"), JSON.stringify(msg), { qos: 0 });
    }
    return diretos > 0 || !!this.client;
  }

  sendChat(text) {
    if (this.contaTomada) return false;
    const now = Date.now();
    if (now - this.lastChat < 900) return false;
    const cleanText = clean(text, 120);
    if (!cleanText) return false;
    this.lastChat = now;
    const msg = { id: this.id, n: this.name, c: this.color, txt: cleanText, tipo: "chat", uid: `${this.id}:chat:${now}`, ttl: 2 };
    const diretos = this.malha.enviarEvento(msg);
    if (this.connected && this.client) {
      this.client.publish(this.topic("chat"), JSON.stringify(msg), { qos: 0 });
    }
    return diretos > 0 || !!this.client;
  }

  destroy() {
    this.closed = true;
    clearInterval(this.sendEvery);
    clearInterval(this.pruneEvery);
    if (this.client) {
      if (this.connected) this.publicarSaida();
      // Mesmo offline, o cliente tem um laço de reconexão que precisa parar.
      try { this.client.end(true); } catch { /* já foi */ }
    }
    this.client = null;
    this.connected = false;
    this.malha.fechar();
    this.peers.clear();
  }
}

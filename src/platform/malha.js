// Malha P2P entre jogadores: o broker só apresenta as pessoas; depois do
// encontro a posição e os eventos vão direto de um para o outro por WebRTC
// (data channels). Se o canal não abrir, o broker continua sendo a rede.
// Browser não abre WebSocket de um para o outro: o transporte P2P do browser
// é WebRTC, e é ele que usamos aqui.
export const MALHA = {
  maxPares: 8,
  heartbeat: 1500,
  stun: ["stun:stun.l.google.com:19302", "stun:stun1.l.google.com:19302"],
};

// Quem oferece é o menor id: os dois lados chegam à mesma resposta sem brigar.
export function deveIniciar(idA, idB) {
  return String(idA) < String(idB);
}

export function cabemMais(abertas, maxPares = MALHA.maxPares) {
  return abertas < maxPares;
}

function segura(fn, ...args) {
  try { return fn(...args); } catch { return null; }
}

export class Malha {
  constructor({ id, enviarSinal, aoEstado, aoEvento, aoMudar = null, stun = MALHA.stun, maxPares = MALHA.maxPares, criarConexao = null } = {}) {
    this.id = String(id || "");
    this.enviarSinal = enviarSinal || (() => false);
    this.aoEstado = aoEstado || (() => {});
    this.aoEvento = aoEvento || (() => {});
    this.aoMudar = aoMudar || (() => {});
    this.stun = stun;
    this.maxPares = maxPares;
    this.criarConexao = criarConexao || ((config) => new globalThis.RTCPeerConnection(config));
    this.pares = new Map(); // id -> { pc, estado, evento, pendentes, criadoEm, aberto }
    this.fechada = false;
  }

  get abertas() {
    let n = 0;
    for (const par of this.pares.values()) if (par.aberto) n += 1;
    return n;
  }

  estatisticas() {
    const pares = [];
    for (const [id, par] of this.pares) {
      pares.push({ id, aberto: !!par.aberto, estado: par.pc?.connectionState || "" });
    }
    return { abertas: this.abertas, total: this.pares.size, pares, maxPares: this.maxPares };
  }

  criarPar(peerId) {
    if (this.fechada || !peerId || peerId === this.id || this.pares.has(peerId)) return this.pares.get(peerId) || null;
    if (!cabemMais(this.pares.size, this.maxPares)) return null;
    const pc = segura(() => this.criarConexao({ iceServers: this.stun.map((url) => ({ urls: url })) }));
    if (!pc) return null;
    const par = { pc, estado: null, evento: null, pendentes: [], criadoEm: Date.now(), aberto: false };
    this.pares.set(peerId, par);
    pc.onicecandidate = (ev) => {
      if (ev.candidate) this.enviarSinal(peerId, "ice", { candidate: ev.candidate.toJSON ? ev.candidate.toJSON() : ev.candidate });
    };
    pc.onconnectionstatechange = () => {
      const estado = pc.connectionState;
      if (estado === "failed" || estado === "closed" || estado === "disconnected") {
        if (estado === "failed" || estado === "closed") this.derrubar(peerId);
        else this.aoMudar(this.estatisticas());
      } else {
        this.aoMudar(this.estatisticas());
      }
    };
    pc.ondatachannel = (ev) => this.ligarCanal(peerId, ev.channel);
    return par;
  }

  ligarCanal(peerId, canal) {
    const par = this.pares.get(peerId);
    if (!par) return;
    if (canal.label === "estado") par.estado = canal;
    else if (canal.label === "evento") par.evento = canal;
    canal.binaryType = "arraybuffer";
    canal.onopen = () => {
      if (canal.label === "estado") par.aberto = true;
      this.aoMudar(this.estatisticas());
    };
    if (canal.label === "estado" && canal.readyState === "open") par.aberto = true;
    canal.onclose = () => {
      if (canal.label === "estado") par.aberto = false;
      this.aoMudar(this.estatisticas());
    };
    canal.onmessage = (ev) => {
      let msg = null;
      try { msg = JSON.parse(typeof ev.data === "string" ? ev.data : ""); } catch { return; }
      if (!msg || typeof msg !== "object") return;
      // quem recebeu de um lado repassa para os outros: um jogador continua
      // aparecendo mesmo sem canal direto com todo mundo (ttl limita o repasse)
      if (canal.label === "estado") {
        this.repassar("estado", msg, peerId);
        this.aoEstado(msg, peerId);
      } else {
        this.repassar("evento", msg, peerId);
        this.aoEvento(msg, peerId);
      }
    };
  }

  // Só tenta quando encontra um par; o menor id oferece e o maior espera.
  garantir(peerId) {
    if (!peerId || peerId === this.id || this.fechada) return;
    if (this.pares.has(peerId)) return;
    if (!cabemMais(this.pares.size, this.maxPares)) return;
    if (!deveIniciar(this.id, peerId)) {
      // o lado que espera só cria o par quando a oferta chegar
      this.aoMudar(this.estatisticas());
      return;
    }
    const par = this.criarPar(peerId);
    if (!par) return;
    par.estado = par.pc.createDataChannel("estado", { ordered: false, maxRetransmits: 0 });
    par.evento = par.pc.createDataChannel("evento", { ordered: true });
    this.ligarCanal(peerId, par.estado);
    this.ligarCanal(peerId, par.evento);
    this.oferecer(peerId, par);
  }

  async oferecer(peerId, par = this.pares.get(peerId)) {
    if (!par) return;
    const oferta = await segura(() => par.pc.createOffer());
    if (!oferta) return;
    await segura(() => par.pc.setLocalDescription(oferta));
    this.enviarSinal(peerId, "offer", { sdp: par.pc.localDescription });
  }

  async receberSinal(de, tipo, dados) {
    if (this.fechada || !de || de === this.id || !dados || typeof dados !== "object") return;
    if (tipo === "offer") {
      let par = this.pares.get(de);
      if (!par) par = this.criarPar(de);
      if (!par) return;
      await segura(() => par.pc.setRemoteDescription(dados.sdp));
      await this.aplicarPendentes(de, par);
      const resposta = await segura(() => par.pc.createAnswer());
      if (!resposta) return;
      await segura(() => par.pc.setLocalDescription(resposta));
      this.enviarSinal(de, "answer", { sdp: par.pc.localDescription });
      return;
    }
    const par = this.pares.get(de);
    if (!par) return;
    if (tipo === "answer") {
      await segura(() => par.pc.setRemoteDescription(dados.sdp));
      await this.aplicarPendentes(de, par);
      return;
    }
    if (tipo === "ice" && dados.candidate) {
      if (!par.pc.remoteDescription) par.pendentes.push(dados.candidate);
      else await segura(() => par.pc.addIceCandidate(dados.candidate));
    }
  }

  async aplicarPendentes(de, par) {
    const lista = par.pendentes.splice(0);
    for (const candidate of lista) await segura(() => par.pc.addIceCandidate(candidate));
  }

  repassar(tipo, msg, origem) {
    const ttl = Number(msg?.ttl);
    if (!Number.isFinite(ttl) || ttl <= 0) return 0;
    const corpo = { ...msg, ttl: ttl - 1 };
    let enviados = 0;
    for (const [id, par] of this.pares) {
      if (id === origem) continue;
      const canal = tipo === "estado" ? par.estado : par.evento;
      if (canal?.readyState === "open" && segura(() => canal.send(JSON.stringify(corpo))) !== null) enviados += 1;
    }
    return enviados;
  }

  enviarEstado(msg) {
    let enviados = 0;
    for (const par of this.pares.values()) {
      if (par.aberto && par.estado?.readyState === "open") {
        if (segura(() => par.estado.send(JSON.stringify(msg))) !== null) enviados += 1;
      }
    }
    return enviados;
  }

  enviarEvento(msg) {
    let enviados = 0;
    for (const par of this.pares.values()) {
      if (par.evento?.readyState === "open") {
        if (segura(() => par.evento.send(JSON.stringify(msg))) !== null) enviados += 1;
      }
    }
    return enviados;
  }

  derrubar(peerId) {
    const par = this.pares.get(peerId);
    if (!par) return;
    this.pares.delete(peerId);
    try { par.pc.close(); } catch { /* já foi */ }
    this.aoMudar(this.estatisticas());
  }

  fechar() {
    this.fechada = true;
    for (const id of [...this.pares.keys()]) this.derrubar(id);
  }
}

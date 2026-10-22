// Malha P2P: quem oferece, o limite de pares, os canais e o envio. Sem browser:
// a conexão WebRTC é falsa, mas o fluxo de oferta, resposta e canais é o real.
import assert from "node:assert/strict";
import { Malha, deveIniciar, cabemMais, MALHA } from "../src/platform/malha.js";

class CanalFalso {
  constructor(label) { this.label = label; this.readyState = "open"; this.enviados = []; }
  send(v) { this.enviados.push(v); }
}
class PCFalso {
  constructor() {
    this.connectionState = "new";
    this.localDescription = null;
    this.remoteDescription = null;
    this.channels = [];
    this.candidates = [];
  }
  createDataChannel(label) { const c = new CanalFalso(label); this.channels.push(c); return c; }
  async createOffer() { return { type: "offer", sdp: "oferta-" + Math.random() }; }
  async createAnswer() { return { type: "answer", sdp: "resposta" }; }
  async setLocalDescription(d) { this.localDescription = d; }
  async setRemoteDescription(d) { this.remoteDescription = d; }
  async addIceCandidate(c) { this.candidates.push(c); }
  close() { this.connectionState = "closed"; }
}

// ---- decisões ----
assert.equal(deveIniciar("a", "b"), true);
assert.equal(deveIniciar("b", "a"), false);
assert.equal(deveIniciar("a", "a"), false);
assert.equal(cabemMais(0, 2), true);
assert.equal(cabemMais(2, 2), false);
assert.equal(MALHA.maxPares, 8);
assert.ok(MALHA.stun.length >= 1);

// ---- o menor id oferece ----
const sinais = [];
const a = new Malha({ id: "a", enviarSinal: (para, tipo, dados) => sinais.push({ para, tipo, dados }), criarConexao: () => new PCFalso() });
a.garantir("b");
await new Promise((r) => setTimeout(r, 0));
assert.equal(a.pares.size, 1);
assert.equal(sinais.length, 1);
assert.equal(sinais[0].tipo, "offer");
assert.equal(sinais[0].para, "b");
assert.ok(sinais[0].dados.sdp);
const par = a.pares.get("b");
assert.equal(par.estado.label, "estado");
assert.equal(par.evento.label, "evento");
assert.equal(par.estado.readyState, "open");
a.garantir("b");
await new Promise((r) => setTimeout(r, 0));
assert.equal(a.pares.size, 1, "garantir repetido duplicou o par");

// ---- o maior id espera a oferta e responde ----
const sinaisB = [];
const b = new Malha({ id: "b", enviarSinal: (para, tipo, dados) => sinaisB.push({ para, tipo, dados }), criarConexao: () => new PCFalso() });
b.garantir("a");
await new Promise((r) => setTimeout(r, 0));
assert.equal(b.pares.size, 0, "o lado que espera não pode oferecer");
assert.equal(sinaisB.length, 0);
await b.receberSinal("a", "offer", { sdp: { type: "offer", sdp: "oferta" } });
await new Promise((r) => setTimeout(r, 0));
assert.equal(b.pares.size, 1);
assert.equal(sinaisB.length, 1);
assert.equal(sinaisB[0].tipo, "answer");
assert.equal(b.pares.get("a").pc.remoteDescription.sdp, "oferta");

// ---- candidato depois da oferta e resposta ----
await b.receberSinal("a", "ice", { candidate: { candidate: "c1" } });
assert.equal(b.pares.get("a").pc.candidates.length, 1, "não aplicou o candidato");
await b.receberSinal("a", "answer", { sdp: { type: "answer", sdp: "resposta" } });
assert.equal(b.pares.get("a").pc.candidates.length, 1, "o candidato sumiu");

// ---- envio pelos canais ----
const canalPar = a.pares.get("b");
assert.equal(a.enviarEstado({ x: 1 }), 1);
assert.deepEqual(JSON.parse(canalPar.estado.enviados[0]), { x: 1 });
assert.equal(a.enviarEvento({ tipo: "chat", txt: "oi" }), 1);
assert.equal(JSON.parse(canalPar.evento.enviados[0]).txt, "oi");
canalPar.estado.readyState = "closed";
assert.equal(a.enviarEstado({ x: 2 }), 0, "mandou por canal fechado");
const estat = a.estatisticas();
assert.equal(estat.total, 1);
assert.equal(estat.abertas, 1);
a.fechar();
assert.equal(a.pares.size, 0);
assert.equal(a.fechada, true);

// ---- repasse: um estado recebido de um lado vai para os outros, com ttl ----
const r = new Malha({ id: "r", enviarSinal: () => true, criarConexao: () => new PCFalso() });
r.garantir("s");
r.garantir("t");
await new Promise((res) => setTimeout(res, 0));
const parS = r.pares.get("s"), parT = r.pares.get("t");
assert.ok(parS && parT, "faltou par para o repasse");
parS.estado.onmessage({ data: JSON.stringify({ id: "s", x: 5, ttl: 2 }) });
const repassado = JSON.parse(parT.estado.enviados.at(-1));
assert.equal(repassado.x, 5);
assert.equal(repassado.ttl, 1, "o ttl não diminuiu no repasse");
assert.equal(parS.estado.enviados.length, 0, "repassou de volta para quem mandou");
parS.estado.onmessage({ data: JSON.stringify({ id: "s", x: 6, ttl: 0 }) });
assert.equal(parT.estado.enviados.length, 1, "repassou com ttl zero");

// ---- limite de pares ----
const c = new Malha({ id: "c", enviarSinal: () => true, criarConexao: () => new PCFalso(), maxPares: 1 });
c.garantir("d");
c.garantir("e");
await new Promise((r) => setTimeout(r, 0));
assert.equal(c.pares.size, 1, "passou do limite de pares");

// ---- Net guarda a integração: fonte ----
const fs = await import("node:fs");
const net = fs.readFileSync(new URL("../src/platform/net.js", import.meta.url), "utf8");
assert.ok(net.includes('from "./malha.js"'), "a rede não usa a malha");
assert.ok(net.includes("this.malha.enviarEstado(msg)"), "o estado não vai pelo canal direto");
assert.ok(net.includes("this.malha.garantir(msg.id)"), "a rede não tenta o par direto");
assert.ok(net.includes('this.topic("malha")'), "a sinalização não tem tópico");
assert.ok(net.includes("msg.uid && this.jaVisto(msg.uid)"), "evento duplicado não é filtrado");
console.log("ok malha: oferta e resposta, canais, limite, envio direto e integração com a rede");

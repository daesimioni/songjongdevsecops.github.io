// A conta vale uma pessoa só: duas abas ou dois aparelhos com a mesma chave
// não podem virar dois viajantes no mundo. Roda sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";
import { Net } from "../src/platform/net.js";

const CONTA = "a".repeat(64);
const OUTRA = "b".repeat(64);

function sessao({ id, inicio, pubkey = CONTA, onChat }) {
  const publicados = [];
  const net = new Net({ room: "test", onPeers: () => {}, onChat });
  net.id = id;
  net.inicio = inicio;
  net.pubkey = pubkey;
  net.connected = true;
  net.client = {
    publish: (topico, corpo) => publicados.push({ topico, corpo }),
    end: () => {},
  };
  return { net, publicados };
}

const estado = (net) => ({
  id: net.id, n: "viajante", x: 10, y: 10, d: 0, s: 1,
  k: net.pubkey, ini: net.inicio, hp: 10, hmax: 10, mn: 5, mmax: 5,
});

// ---- a mais nova fica, a mais velha emudece ----
let chats = 0;
const nova = sessao({ id: "ms_nova", inicio: 2000, onChat: () => chats++ });
const velha = sessao({ id: "ms_velha", inicio: 1000 });
velha.net.handle(velha.net.topic("state"), estado(nova.net));
assert.equal(velha.net.contaTomada, true, "a sessão antiga devia ceder a conta");
assert.equal(velha.net.peers.size, 0, "a conta não pode aparecer duas vezes");
assert.ok(velha.publicados.some((p) => p.topico.endsWith("/bye")), "a sessão antiga devia avisar que saiu");
const antes = velha.publicados.length;
velha.net.publishState(true);
assert.equal(velha.publicados.length, antes, "aba em espera não publica estado");
assert.equal(velha.net.sendChat("oi"), false, "aba em espera não fala");
assert.equal(velha.net.sendPvp({ kind: "challenge", to: "ms_nova" }), false, "aba em espera não desafia");

// ---- a mais nova ignora a antiga e continua publicando ----
const antesNova = nova.publicados.length;
nova.net.handle(nova.net.topic("state"), estado(velha.net));
assert.equal(nova.net.contaTomada, false, "a sessão nova não devia ceder");
assert.equal(nova.net.peers.size, 0, "sessão antiga não entra no mundo");
assert.equal(nova.net.contaRivais.has("ms_velha"), true, "a rival devia ficar marcada");
nova.net.publishState(true);
assert.equal(nova.publicados.length, antesNova + 1, "a sessão nova devia publicar");
const corpo = JSON.parse(nova.publicados.at(-1).corpo);
assert.equal(corpo.k, CONTA, "o estado não leva a conta");
assert.equal(corpo.ini, 2000, "o estado não leva o início da sessão");

// ---- evento da sessão antiga não entra ----
nova.net.handle(nova.net.topic("chat"), { id: "ms_velha", txt: "oi", uid: "u1" });
assert.equal(chats, 0, "chat da sessão antiga não devia entrar");

// ---- empate de início: os dois lados escolhem o mesmo vencedor ----
const a = sessao({ id: "ms_a", inicio: 5000 });
const b = sessao({ id: "ms_b", inicio: 5000 });
b.net.handle(b.net.topic("state"), estado(a.net));
assert.equal(b.net.contaTomada, false, "no empate o id maior fica");
a.net.handle(a.net.topic("state"), estado(b.net));
assert.equal(a.net.contaTomada, true, "no empate o id menor cede");

// ---- conta diferente continua no mundo ----
const amigo = sessao({ id: "ms_amigo", inicio: 1, pubkey: OUTRA });
nova.net.handle(nova.net.topic("state"), estado(amigo.net));
assert.equal(nova.net.peers.size, 1, "outra conta devia continuar no mundo");

// ---- sozinha de novo, a aba volta sozinha ----
velha.net.contaVistaEm = Date.now() - 13000;
velha.net.prune();
assert.equal(velha.net.contaTomada, false, "sem a outra sessão, a aba devia voltar");
assert.ok(velha.publicados.at(-1).topico.endsWith("/state"), "ao voltar, devia publicar estado");

// ---- trocar de conta não herda a espera da conta antiga ----
const trocada = sessao({ id: "ms_trocada", inicio: 7000 });
const rival = sessao({ id: "ms_rival", inicio: 9000 });
trocada.net.handle(trocada.net.topic("state"), estado(rival.net));
assert.equal(trocada.net.contaTomada, true, "a conta antiga devia estar em espera");
trocada.net.seq = 500;
trocada.net.setIdentity(OUTRA);
assert.ok(trocada.net.seq > 500, "a sequência voltou ao zero e quem já conhece a sessão descarta o estado");
assert.equal(trocada.net.pubkey, OUTRA, "a chave nova não entrou");
assert.equal(trocada.net.contaTomada, false, "a conta nova não pode nascer em espera");
assert.equal(trocada.net.contaRivais.size, 0, "a conta nova herdou a rival da antiga");
trocada.net.publishState(true);
const corpoNovo = JSON.parse(trocada.publicados.at(-1).corpo);
assert.equal(corpoNovo.k, OUTRA, "o estado devia levar a chave nova");
assert.equal(corpoNovo.ini, trocada.net.inicio, "a sessão nova devia ser a mais nova");

// ---- sem identidade não existe conta para comparar ----
const anon = sessao({ id: "ms_anon", inicio: 9, pubkey: "" });
anon.net.handle(anon.net.topic("state"), { ...estado(anon.net), id: "ms_outro", k: CONTA });
assert.equal(anon.net.contaTomada, false);
assert.equal(anon.net.peers.size, 1, "sem identidade o outro é um viajante comum");

// ---- a tela aprende o estado novo ----
const app = fs.readFileSync(new URL("../src/app/app.js", import.meta.url), "utf8");
assert.match(app, /s === "duplicado"/, "app.js não mostra o estado em espera");
assert.match(app, /estadoRedeAnterior === "duplicado"/, "app.js não avisa quando a conta é assumida");
const social = fs.readFileSync(new URL("../src/ui/social.js", import.meta.url), "utf8");
assert.equal((social.match(/myNet\(\)\?\.setIdentity\?\.\(rede\.pk\)/g) || []).length, 2, "a Rede não avisa a praça da chave nova ao gerar e ao importar");

console.log("ok conta: sessão antiga cede, a nova fica, e a conta não se multiplica");

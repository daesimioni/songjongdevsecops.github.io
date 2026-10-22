// Party no MQTT: com a chave pública do peer conhecida, só entra mensagem
// assinada pela chave certa. Sem chave (cliente antigo), o fluxo antigo vale.
import assert from "node:assert/strict";
import { makeDocument } from "./ui-dom.mjs";
import { createSocial } from "../src/ui/social.js";

const { document } = makeDocument(["rede-body"]);
document.querySelectorAll = () => [];
globalThis.document = document;
const tick = () => new Promise((r) => setTimeout(r, 0));
const inbox = [];

function make(id, pubkey) {
  const rede = {
    presenceList: () => [],
    signText: async (text) => ({ pubkey: `pk-${id}`, sig: "ok", text }),
    verifyText: (proof) => !!proof && proof.sig === "ok" && typeof proof.pubkey === "string",
  };
  const social = createSocial({
    rede,
    player: { name: id },
    toast() {},
    audio: {},
    getPeers: () => [],
    getNet: () => ({ id, sendParty: (msg) => { inbox.push({ from: { id, name: id, pubkey }, msg: structuredClone(msg) }); return true; } }),
  });
  return social;
}

const a = make("a", "pk-a");
const b = make("b", "pk-b");

// convite assinado: sai com prova e é aceito quando a chave bate
a.inviteParty({ id: "b", name: "b" });
await tick();
await tick();
const convite = inbox.shift();
assert.ok(convite, "convite não saiu");
assert.equal(convite.msg.proof?.pubkey, "pk-a", "convite sem assinatura do remetente");
assert.match(convite.msg.proofText, /^mundo-song:party:v1\|invite\|b\|/, "texto assinado não descreve o convite");
b.partyEvent(convite.from, convite.msg);
await tick();
assert.ok(b.partyInvite, "convite assinado deveria ficar pendente");
b.acceptParty();
await tick();
await tick();
const aceite = inbox.shift();
assert.equal(aceite.msg.proof?.pubkey, "pk-b");
a.partyEvent(aceite.from, aceite.msg);
await tick();
assert.deepEqual(a.party?.members.map((m) => m.id), ["a", "b"], "party não se formou com mensagens assinadas");

// sem prova: ignorado quando a chave do remetente é conhecida
b.partyEvent({ id: "a", name: "a", pubkey: "pk-a" }, { act: "sync", party: "x", leader: "a", members: [{ id: "a" }, { id: "b" }] });
await tick();
assert.equal(b.party?.members.length, 2, "mensagem sem prova não pode mexer na party");

// prova de outra chave: ignorada
b.partyEvent({ id: "a", name: "a", pubkey: "pk-a" }, { act: "sync", party: b.party.id, leader: "a", members: [{ id: "a" }, { id: "b" }], proof: { pubkey: "pk-intruso", sig: "ok" }, proofText: "x" });
await tick();
assert.equal(b.party?.members.length, 2, "prova de chave alheia não pode passar");

// peer sem chave (cliente antigo): fluxo legado continua
b.partyEvent({ id: "a", name: "a" }, { act: "sync", party: b.party.id, leader: "a", members: [{ id: "a" }, { id: "b" }] });
await tick();
assert.equal(b.party?.members.length, 2, "peer sem pubkey mantém compatibilidade");

console.log("ok party: convite e aceite assinados, prova de chave alheia e mensagem sem prova rejeitadas");

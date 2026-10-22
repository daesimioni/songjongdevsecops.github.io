// Caderno de conceitos: domínio 0 a 5, revisão espaçada e baralho que prioriza
// o conceito vencido. Roda sem navegador: node test/conceitos.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import { registrarResposta, vencido, resumoConceitos, NIVEIS } from "../src/gameplay/conceitos.js";

const MIN = 60000;
const agora = 1_000_000_000_000;
const c = {};
const e1 = registrarResposta(c, "cs", true, agora);
assert.equal(e1.n, 1, "primeiro acerto deveria abrir o domínio");
assert.equal(e1.r, 1);
assert.equal(e1.due, agora + 30 * MIN, "domínio 1 deveria espaçar 30 minutos");
const e2 = registrarResposta(c, "cs", true, agora);
assert.equal(e2.n, 2);
assert.equal(e2.due, agora + 120 * MIN, "domínio 2 deveria espaçar 2 horas");
const e3 = registrarResposta(c, "cs", false, agora);
assert.equal(e3.n, 1, "erro deveria descer um degrau");
assert.equal(e3.w, 1);
assert.equal(vencido(e1, agora), false, "revisão futura não está vencida");
assert.equal(vencido({ ...e1, due: agora - 1 }, agora), true, "revisão passada está vencida");
assert.equal(vencido(undefined, agora), true, "conceito nunca visto conta como vencido");
for (let i = 0; i < 12; i++) registrarResposta(c, "matematica", true, agora);
assert.equal(c.matematica.n, NIVEIS, "domínio deveria parar em 5");
for (let i = 0; i < 12; i++) registrarResposta(c, "lingua", false, agora);
assert.equal(c.lingua.n, 0, "domínio não pode ficar negativo");
const resumo = resumoConceitos(c, agora + 11 * MIN);
assert.equal(resumo.estudados, 3);
assert.equal(resumo.dominados, 1);
assert.equal(resumo.revisar, 1, "só o conceito de domínio 0 vence em 11 minutos");

// ---- integração com o RPG real ----
const store = new Map();
globalThis.localStorage = { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k), clear: () => store.clear() };
const { RPG } = await import("../src/gameplay/rpg.js");
const { GROUNDS } = await import("../src/content/rpg-data.js");
const ground = GROUNDS.find((g) => g.id === "cs");
const rpg = new RPG();
rpg.startDuel({ id: "conceito-monstro", name: "Alvo", kind: "eye", tier: 1 }, ground);
const areaA = rpg.duel.question.area || "cs";
rpg.answer((rpg.duel.question.answer + 1) % rpg.duel.question.options.length);
assert.equal(rpg.data.conceitos[areaA]?.w, 1, "erro deveria registrar conceito");
rpg.next();
const areaB = rpg.duel.question.area || "cs";
rpg.answer(rpg.duel.question.answer);
assert.ok((rpg.data.conceitos[areaB]?.r || 0) >= 1, "acerto deveria registrar conceito");
rpg.save();
const rpg2 = new RPG();
assert.ok(rpg2.data.conceitos[areaA] || rpg2.data.conceitos[areaB], "conceito não persistiu no save");

// baralho prioriza o conceito vencido
const rpg3 = new RPG();
const deck = rpg3.duelDeck("cs", 1);
assert.ok(deck.length > 2, "baralho curto para o teste de prioridade");
const escolhido = deck[deck.length - 1].area || "cs";
for (const item of deck) rpg3.data.conceitos[item.area || "cs"] = { n: 3, r: 3, w: 0, due: Date.now() + 86400000 };
rpg3.data.conceitos[escolhido] = { n: 1, r: 1, w: 0, due: 0 };
const priorizado = rpg3.duelDeck("cs", 1);
assert.equal(priorizado[0].area || "cs", escolhido, "conceito vencido deveria vir primeiro");

// a tela do diário anuncia o caderno
const app = fs.readFileSync(new URL("../src/app/app.js", import.meta.url), "utf8");
assert.match(app, /Caderno de conceitos/, "diário sem caderno de conceitos");
assert.match(app, /journal-conceito/, "caderno sem linha de conceito");

console.log(`ok conceitos: domínio 0-${NIVEIS}, revisão espaçada, erro desce, save e baralho priorizam vencidos`);

// A Grande Prova: o guardião de três fases, o desfecho que fica no save e a
// tela que não reprova. Roda sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

const { GUARDIAO, GROUND_ACERVO, DESFECHOS, desfechoPorId, estadoDaProva, registrarDesfecho, nomeDoDesfecho } = await import("../src/gameplay/grande-prova.js");
const { RPG } = await import("../src/gameplay/rpg.js");

// ---- o módulo: três desfechos e escolha única ----
assert.equal(DESFECHOS.length, 3, "a prova precisa dos três desfechos");
assert.equal(new Set(DESFECHOS.map((d) => d.id)).size, 3, "desfecho repetido");
for (const d of DESFECHOS) assert.ok(d.nome && d.titulo && d.texto, `desfecho incompleto: ${d.id}`);
const data = {};
assert.equal(estadoDaProva(data), null);
assert.equal(registrarDesfecho(data, "nao-existe", 123), null, "escolha inválida não pode gravar");
const escolhido = registrarDesfecho(data, "abrir", 123);
assert.equal(escolhido?.id, "abrir");
assert.deepEqual(estadoDaProva(data), { escolha: "abrir", at: 123 });
assert.equal(registrarDesfecho(data, "guardar", 456), null, "a segunda escolha não pode sobrescrever");
assert.deepEqual(estadoDaProva(data), { escolha: "abrir", at: 123 }, "a escolha mudou sozinha");
assert.equal(nomeDoDesfecho("abrir"), "Abrir a todas as ilhas");
assert.equal(desfechoPorId("guardar")?.nome, "Guardar o acervo");
assert.equal(estadoDaProva(null), null, "save vazio não quebra");

// ---- o rpg: guardião de três fases, vitória e save ----
const rpg = new RPG();
assert.equal(rpg.data.grandeProva, null, "a prova começou feita");
const abriu = rpg.startDuel(GUARDIAO, GROUND_ACERVO, true);
assert.equal(abriu.ok, true, abriu.reason);
const d = rpg.duel;
assert.equal(d.boss, true);
assert.equal(d.bossPhase, 1);
assert.ok(d.habilidade, "o guardião precisa de habilidade");
const max = d.monsterHpMax;
const c = rpg.combate;
const ini = c.inimigos[0];
ini.hp = Math.floor(max * 0.5);
c.atualizarFase(ini);
assert.equal(d.bossPhase, 2, "a metade da vida devia abrir a fase 2");
ini.hp = Math.floor(max * 0.2);
c.atualizarFase(ini);
assert.equal(d.bossPhase, 3, "um quinto da vida devia abrir a fase 3");
// o último golpe derruba o guardião e a prova vira vitória
c.aplicarDano(ini, 99);
assert.equal(rpg.duel.phase, "victory", "a prova não terminou em vitória");
assert.ok(rpg.duel.result, "a vitória não deixou resultado");
const feito = registrarDesfecho(rpg.data, "guardar", 789);
assert.equal(feito?.id, "guardar");
rpg.save();
const rpg2 = new RPG();
assert.deepEqual(rpg2.data.grandeProva, { escolha: "guardar", at: 789 }, "o desfecho não sobreviveu à recarga");
assert.equal(registrarDesfecho(rpg2.data, "devolver", 999), null, "a prova recarregada aceitou outra escolha");

// ---- a fiação do app, do HTML e da wiki ----
const app = fs.readFileSync(new URL("../src/app/app.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const wiki = fs.readFileSync(new URL("../src/ui/wiki.js", import.meta.url), "utf8");
assert.match(html, /id="desfecho"/, "modal do desfecho ausente");
assert.match(html, /id="biblioteca-prova-btn"/, "botão da prova ausente no acervo");
assert.match(html, /data-close="desfecho"/, "fechar do desfecho ausente");
assert.match(app, /function iniciarGrandeProva\(\)/, "app não inicia a prova");
assert.match(app, /function abrirDesfecho\(\)/, "app não abre o desfecho");
assert.match(app, /estadoDaProva\(rpg\.data\)/, "app não lê o estado da prova");
assert.match(app, /state\.duelEvento === "grande-prova"/, "a vitória não sabe que é a prova");
assert.match(app, /state\.desfechoPendente/, "a vitória não deixa o desfecho pendente");
assert.match(app, /registrarDesfecho\(rpg\.data, d\.id\)/, "a escolha não grava no save");
assert.match(app, /openDuel\(GUARDIAO, GROUND_ACERVO, true\)/, "a prova não abre o duelo do guardião");
assert.match(wiki, /A Grande Prova/, "a wiki não ganhou a ficha do evento");
assert.match(wiki, /guardar, devolver ou abrir/, "a ficha da wiki não cita os desfechos");

console.log(`ok grande prova: guardião boss, fases 1-3, vitória, desfecho "${nomeDoDesfecho("guardar")}" no save`);

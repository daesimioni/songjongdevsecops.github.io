// Facções: três forças, atos que sobem e descem, teto, save, efeito no preço da
// loja e no diário. Roda sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

const {
  FACCOES, LIMITE_REPUTACAO, ATOS, faccaoPorId, atoPorMissao, atosPorDesfecho,
  atosValidos, aplicarAto, registrarMissao, registrarDesfecho, reputacao,
  reputacoes, nivelDaReputacao, ajusteDaCompra, falaDaReputacao,
} = await import("../src/gameplay/faccoes.js");
const { RPG } = await import("../src/gameplay/rpg.js");
const { ITEMS } = await import("../src/content/rpg-data.js");

// ---- três facções, atos válidos ----
assert.equal(FACCOES.length, 3, `são ${FACCOES.length} facções`);
assert.equal(new Set(FACCOES.map((f) => f.id)).size, 3, "facção repetida");
assert.deepEqual(FACCOES.map((f) => f.id), ["concilio", "uniao", "porto"]);
for (const f of FACCOES) assert.ok(f.nome && f.resumo && f.titulo && f.cor, `facção ${f.id} incompleta`);
assert.equal(faccaoPorId("porto")?.nome, "Porto Submerso");
assert.equal(faccaoPorId("nao-existe"), null);
for (const a of ATOS) {
  assert.ok(faccaoPorId(a.faccao), `ato ${a.id} em facção inexistente`);
  assert.ok(a.rotulo && a.delta, `ato ${a.id} sem rótulo ou delta`);
  assert.ok(LIMITE_REPUTACAO === 3 && Number.isInteger(a.delta));
}

// ---- missão sobe uma, desfecho mexe nas três ----
const primeira = atoPorMissao("biblioteca-1");
assert.equal(primeira?.faccao, "porto");
assert.equal(primeira?.delta, 1);
assert.equal(atoPorMissao("nao-existe"), null);
const guardar = atosPorDesfecho("guardar");
assert.equal(guardar.length, 3, "o desfecho mexe em três facções");
assert.deepEqual(Object.fromEntries(guardar.map((a) => [a.faccao, a.delta])), { concilio: 3, porto: -2, uniao: -2 });
assert.equal(atosPorDesfecho("nao-existe").length, 0);

const data = {};
assert.equal(reputacao(data, "porto"), 0, "sem ato, reputação não é zero");
assert.ok(registrarMissao(data, "biblioteca-1"));
assert.equal(reputacao(data, "porto"), 1);
assert.deepEqual(data.faccoes, ["porto-biblioteca"]);
assert.equal(registrarMissao(data, "biblioteca-1"), null, "o ato repetiu");
assert.equal(reputacao(data, "porto"), 1);
assert.equal(aplicarAto(data, "nao-existe"), null);

// desfecho guardar: Concílio sobe ao teto com o chefe de cs e as outras caem
const guardou = {};
registrarMissao(guardou, "chefe-cs-fundamentos");
registrarDesfecho(guardou, "guardar");
assert.equal(reputacao(guardou, "concilio"), 3, "o teto não segurou");
assert.equal(reputacao(guardou, "porto"), -2, "o Porto não desceu");
assert.equal(reputacao(guardou, "uniao"), -2, "a União não desceu");

// devolver: Porto no teto, Concílio e União contra
const devolveu = {};
registrarDesfecho(devolveu, "devolver");
assert.equal(reputacao(devolveu, "porto"), 3);
assert.equal(reputacao(devolveu, "concilio"), -2);
assert.equal(reputacao(devolveu, "uniao"), -2);

// os dois desfechos contrários levam o Porto ao piso -3
const brigou = {};
registrarDesfecho(brigou, "guardar");
registrarDesfecho(brigou, "abrir");
assert.equal(reputacao(brigou, "porto"), -LIMITE_REPUTACAO, "o piso não segurou");
assert.deepEqual(reputacoes(brigou), { concilio: 1, uniao: 1, porto: -3 });
assert.equal(reputacao({ faccoes: ["nao-existe", "porto-biblioteca", "porto-biblioteca"] }, "porto"), 1);

// ---- saneamento do save ----
assert.deepEqual(atosValidos({ faccoes: ["porto-biblioteca", "x", "porto-biblioteca", 7] }), ["porto-biblioteca"]);
assert.deepEqual(atosValidos(null), []);
assert.deepEqual(atosValidos({ faccoes: "porto-biblioteca" }), []);

// ---- o save do rpg guarda a memória e a recarga mantém ----
const rpg = new RPG();
assert.deepEqual(rpg.data.faccoes, []);
aplicarAto(rpg.data, "porto-biblioteca");
aplicarAto(rpg.data, "devolver-porto");
rpg.save();
const rpg2 = new RPG();
assert.deepEqual(rpg2.data.faccoes, ["porto-biblioteca", "devolver-porto"], "a memória não sobreviveu");
assert.equal(reputacao(rpg2.data, "porto"), 3);
rpg2.data.faccoes = ["nao-existe"];
rpg2.save();
assert.deepEqual(new RPG().data.faccoes, [], "o save aceitou ato inexistente");

// ---- a loja sente o Porto: aliado desconta, hostil cobra ----
const peca = Object.entries(ITEMS).find(([, item]) => item.slot === "weapon" && item.price === undefined)?.[0]
  || Object.entries(ITEMS).find(([, item]) => item.slot === "weapon")[0];
assert.ok(peca, "não achei peça de arma no catálogo");
const neutro = new RPG();
const precoNeutro = neutro.priceFor(peca);
const aliado = new RPG();
registrarDesfecho(aliado.data, "devolver");
const precoAliado = aliado.priceFor(peca);
const hostil = new RPG();
registrarDesfecho(hostil.data, "guardar");
registrarDesfecho(hostil.data, "abrir");
const precoHostil = hostil.priceFor(peca);
assert.equal(ajusteDaCompra({ porto: 0 }), 0);
assert.equal(ajusteDaCompra({ porto: 2 }), -1);
assert.equal(ajusteDaCompra({ porto: -2 }), 1);
const materiais = (p) => Object.values(p).reduce((a, b) => a + b, 0);
assert.equal(materiais(precoAliado), materiais(precoNeutro) - 1, "o aliado não teve desconto");
assert.equal(materiais(precoHostil), materiais(precoNeutro) + 1, "o hostil não pagou mais");
assert.ok(Object.values(precoAliado).every((q) => q >= 1), "o desconto zerou um material");

// ---- os rótulos de -3 a +3 ----
assert.equal(nivelDaReputacao(-3).rotulo, "hostil");
assert.equal(nivelDaReputacao(-2).rotulo, "malvisto");
assert.equal(nivelDaReputacao(-1).rotulo, "desconfiado");
assert.equal(nivelDaReputacao(0).rotulo, "neutro");
assert.equal(nivelDaReputacao(1).rotulo, "conhecido");
assert.equal(nivelDaReputacao(2).rotulo, "bem-visto");
assert.equal(nivelDaReputacao(3).rotulo, "aliado");
assert.equal(nivelDaReputacao(9).valor, 3, "o rótulo aceitou fora da faixa");
assert.equal(falaDaReputacao("porto", 0), "", "o neutro falou");
assert.match(falaDaReputacao("porto", 3), /Porto Submerso fala bem/);
assert.match(falaDaReputacao("porto", -3), /não esqueceu/);

// ---- o app, o HTML e a wiki ----
const app = fs.readFileSync(new URL("../src/app/app.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const wiki = fs.readFileSync(new URL("../src/ui/wiki.js", import.meta.url), "utf8");
assert.match(app, /Facções e reputação/, "o diário não tem o painel das facções");
assert.match(app, /function aplicarAtoFaccao\(/, "o app não registra o ato");
assert.match(app, /atoPorMissao\(q\.id\)/, "a missão não move a facção");
assert.match(app, /atosPorDesfecho\(d\.id\)/, "o desfecho não move as facções");
assert.match(app, /A estante reservada/, "a porta do Concílio não existe");
assert.match(app, /O Porto trata você como/, "a loja não fala a reputação");
assert.match(html, /2\.311 fichas/, "a ajuda não tem a contagem nova");
assert.match(wiki, /Facções e reputação/, "a wiki não ganhou a ficha das facções");

console.log(`ok facções: ${FACCOES.length} forças, ${ATOS.length} atos, teto ${LIMITE_REPUTACAO}, save, loja e diário`);

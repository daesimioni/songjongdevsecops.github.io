// Guilda: fundação, quadro de membros e cargos, missões que leem o save, diário
// e a party de oito. Roda sem navegador.
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
  BRASOES, CARGOS, LIMITE_MEMBROS, MISSOES_GUILDA, brasaoPorId, missaoDaGuilda,
  guildaValida, guildaDe, fundarGuilda, recrutar, promover,
  progressoDasMissoes, resgatarMissao, registrarDiario,
} = await import("../src/gameplay/guilda.js");
const { RPG } = await import("../src/gameplay/rpg.js");

// ---- brasões, cargos e missões ----
assert.equal(BRASOES.length, 4, `são ${BRASOES.length} brasões`);
assert.equal(new Set(BRASOES.map((b) => b.id)).size, 4, "brasão repetido");
for (const b of BRASOES) assert.ok(b.nome && b.cor, `brasão ${b.id} incompleto`);
assert.deepEqual(CARGOS.map((c) => c.id), ["lider", "oficial", "membro"]);
assert.equal(brasaoPorId("iara")?.nome, "A Iara");
assert.equal(brasaoPorId("nao-existe"), null);
assert.equal(missaoDaGuilda("fundar")?.meta, 1);
assert.equal(missaoDaGuilda("nao-existe"), null);
assert.equal(LIMITE_MEMBROS, 8);
assert.equal(MISSOES_GUILDA.length, 4);

// ---- fundação: nome, brasão, líder e diário ----
const data = {};
const semNome = fundarGuilda(data, { nome: "  ", brasao: "iara", dono: { id: "p1", nome: "Ari" } });
assert.equal(semNome.ok, false);
assert.match(semNome.erro, /2 a 24/);
assert.equal(fundarGuilda(data, { nome: "X", brasao: "iara", dono: { id: "p1", nome: "Ari" } }).ok, false, "nome de uma letra passou");
assert.equal(fundarGuilda(data, { nome: "Maré Alta", brasao: "iara" }).ok, false, "fundou sem fundador");
const fundou = fundarGuilda(data, { nome: "Maré Alta", brasao: "nao-existe", dono: { id: "p1", nome: "Ari" } });
assert.equal(fundou.ok, true);
assert.equal(fundou.guilda.brasao, "iara", "brasão inválido devia cair no primeiro");
assert.deepEqual(fundou.guilda.membros, [{ id: "p1", nome: "Ari", cargo: "lider" }]);
assert.match(fundou.guilda.diario[0], /Maré Alta foi fundada por Ari/);
assert.equal(fundarGuilda(data, { nome: "Outra", dono: { id: "p2", nome: "Bia" } }).ok, false, "fundou duas vezes");
assert.equal(guildaDe(data)?.nome, "Maré Alta");

// ---- recrutar a party: até oito, sem repetir ----
const entrou = recrutar(data, [
  { id: "p2", nome: "Bia" },
  { id: "p3", nome: "Caio" },
  { id: "p2", nome: "Bia" },
  { id: "", nome: "sem id" },
]);
assert.equal(entrou.ok, true);
assert.equal(entrou.entraram, 2);
assert.equal(entrou.total, 3);
assert.equal(guildaDe(data).membros.length, 3);
for (let i = 4; i <= 12; i++) recrutar(data, [{ id: `p${i}`, nome: `P${i}` }]);
assert.equal(guildaDe(data).membros.length, LIMITE_MEMBROS, "passou do limite de oito");
assert.equal(recrutar(data, [{ id: "p99", nome: "Tarde" }]).ok, false, "entrou com a sede cheia");

// ---- cargos: oficial sobe e desce, líder não se mexe ----
assert.equal(promover(data, "p1"), null, "o líder foi promovido");
const oficial = promover(data, "p2");
assert.equal(oficial.cargo, "oficial");
assert.match(guildaDe(data).diario.at(-1), /Bia agora é oficial/);
assert.equal(promover(data, "p2").cargo, "membro", "o cargo não desceu");
assert.equal(promover(data, "nao-existe"), null);

// ---- missões leem o save ----
const stats = { questsDone: 2, chefes: 0 };
let quadro = progressoDasMissoes(data, stats);
assert.equal(quadro.find((m) => m.id === "fundar").pronto, true);
assert.equal(quadro.find((m) => m.id === "recrutar").feito, 3, "recrutar devia parar na meta");
assert.equal(quadro.find((m) => m.id === "missoes").feito, 2);
assert.equal(quadro.find((m) => m.id === "chefe").pronto, false);
assert.equal(resgatarMissao(data, "fundar", stats).ok, true, "a missão pronta não resgatou");
assert.equal(resgatarMissao(data, "fundar", stats).ok, false, "resgatou duas vezes");
assert.equal(resgatarMissao(data, "chefe", stats).ok, false, "resgatou sem chefe");
quadro = progressoDasMissoes(data, { questsDone: 9, chefes: 2 });
assert.equal(quadro.find((m) => m.id === "missoes").feito, 5);
assert.equal(quadro.find((m) => m.id === "chefe").pronto, true);
assert.equal(resgatarMissao(data, "chefe", { questsDone: 9, chefes: 2 }).ok, true);
assert.deepEqual(guildaDe(data).missoes, ["fundar", "chefe"]);
assert.match(guildaDe(data).diario.at(-1), /Guardião|chefe|Derrubar/);
assert.equal(resgatarMissao(data, "nao-existe", stats).ok, false);
assert.equal(resgatarMissao({}, "fundar", stats).ok, false, "resgatou sem guilda");

// ---- saneamento do save ----
assert.equal(guildaValida(null), null);
assert.equal(guildaValida({ nome: "", membros: [] }), null);
assert.equal(guildaValida({ nome: "Sede", membros: [] }), null, "guilda sem membro passou");
const sujo = guildaValida({
  nome: "  Sede <b>  ",
  brasao: "farol",
  membros: [
    { id: "a", nome: "Ana", cargo: "lider" },
    { id: "a", nome: "Ana de novo", cargo: "oficial" },
    { id: "b", nome: "Bia", cargo: "lider" },
    { id: "", nome: "sem id" },
  ],
  diario: [" primeira ", "<script>"],
  missoes: ["fundar", "fundar", "nao-existe"],
});
assert.equal(sujo.nome, "Sede b", "o saneamento não limpou o nome");
assert.equal(sujo.membros.length, 2, "o id duplicado entrou");
assert.equal(sujo.membros.filter((m) => m.cargo === "lider").length, 1, "ficou com dois líderes");
assert.deepEqual(sujo.missoes, ["fundar"]);
assert.equal(sujo.diario.length, 2);

// ---- o save do rpg guarda a guilda ----
const rpg = new RPG();
assert.equal(rpg.data.guilda, null);
assert.equal(fundarGuilda(rpg.data, { nome: "Sede do Vale", brasao: "livro", dono: { id: "p1", nome: "Ari" } }).ok, true);
recrutar(rpg.data, [{ id: "p2", nome: "Bia" }]);
registrarDiario(rpg.data, "Primeira reunião na sede.");
rpg.save();
const rpg2 = new RPG();
assert.equal(rpg2.data.guilda?.nome, "Sede do Vale");
assert.equal(rpg2.data.guilda?.membros.length, 2);
assert.match(rpg2.data.guilda?.diario.at(-1), /Primeira reunião/);
rpg2.data.guilda = { nome: "", membros: [] };
rpg2.save();
assert.equal(new RPG().data.guilda, null, "o save aceitou guilda inválida");

// ---- o app, o HTML e a wiki ----
const app = fs.readFileSync(new URL("../src/app/app.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const wiki = fs.readFileSync(new URL("../src/ui/wiki.js", import.meta.url), "utf8");
assert.match(app, /function buildGuilda\(/, "o app não monta a sede");
assert.match(app, /function openGuilda\(/, "o app não abre a sede");
assert.match(app, /fundarGuilda\(rpg\.data/, "o app não funda a guilda");
assert.match(app, /recrutarGuilda\(rpg\.data/, "o app não recruta a party");
assert.match(app, /resgatarMissao\(rpg\.data/, "o app não resgata a missão da sede");
assert.match(app, /A guilda \$\{guilda\.nome\}/, "o diário não mostra a sede");
assert.match(html, /id="guilda"/, "o modal da guilda não existe");
const { indiceDaWiki } = await import("../src/ui/wiki.js");
assert.ok(html.includes(`${indiceDaWiki().length.toLocaleString("pt-BR")} fichas`), "a ajuda não acompanha a contagem da wiki");
assert.match(wiki, /Guilda e party/, "a wiki não ganhou a ficha da guilda");

console.log(`ok guilda: ${BRASOES.length} brasões, ${LIMITE_MEMBROS} lugares, ${MISSOES_GUILDA.length} missões, save e party`);

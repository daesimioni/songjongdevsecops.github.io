// O fio da Iara: sete capítulos, a ordem, o desbloqueio por missão, a leitura
// no save e a fala do guia. Roda sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

const { CAPITULOS, IDS_DOS_CAPITULOS, capituloPorId, lidosDaHistoria, estadoDosCapitulos, registrarLeitura, falaAtual } = await import("../src/gameplay/arcos.js");
const { QUESTS } = await import("../src/gameplay/quests.js");
const { RPG } = await import("../src/gameplay/rpg.js");

// ---- sete capítulos, um por continente da história ----
assert.equal(CAPITULOS.length, 7, `o fio tem ${CAPITULOS.length} capítulos`);
assert.equal(new Set(IDS_DOS_CAPITULOS).size, 7, "capítulo repetido");
assert.equal(CAPITULOS[0].continente, "hub");
assert.equal(CAPITULOS[6].continente, "lingua");
assert.deepEqual([...new Set(CAPITULOS.map((c) => c.continente))], ["hub", "cs", "math", "physics", "chem", "music", "lingua"]);
for (const c of CAPITULOS) {
  assert.ok(c.titulo && c.lore && c.fala, `capítulo ${c.id} sem título, lore ou fala`);
  assert.ok(c.lore.includes("Iara") || c.lore.includes("Silêncio"), `lore de ${c.id} fora do fio`);
  assert.ok(QUESTS.some((q) => q.id === c.missao), `missão ${c.missao} de ${c.id} não existe`);
}
assert.equal(capituloPorId("arco-4")?.titulo, "A Maré Partida");
assert.equal(capituloPorId("nao-existe"), null);

// ---- o estado: a missão abre, o anterior lido libera ----
const vazio = estadoDosCapitulos();
assert.equal(vazio.every((c) => !c.aberto && !c.lido), true, "sem marco nada abre");
const comPorto = estadoDosCapitulos({ concluidas: new Set(["tres-passos"]) });
assert.equal(comPorto[0].aberto, true, "Três pedras devia abrir o capítulo 1");
assert.equal(comPorto[1].aberto, false, "o capítulo 2 abriu sem o 1 lido");
const data = {};
const lido1 = registrarLeitura(data, "arco-1", comPorto);
assert.equal(lido1?.id, "arco-1");
assert.deepEqual(data.arcos, ["arco-1"]);
registrarLeitura(data, "arco-1", comPorto);
assert.equal(data.arcos.length, 1, "a leitura duplicou o capítulo");
const comCs = estadoDosCapitulos({ lidos: data.arcos, concluidas: new Set(["tres-passos", "chefe-cs-fundamentos"]) });
assert.equal(comCs[0].lido, true);
assert.equal(comCs[1].aberto, true, "o chefe de cs devia abrir o capítulo 2");
assert.equal(comCs[2].aberto, false, "o capítulo 3 abriu cedo");
const lido2 = registrarLeitura(data, "arco-2", comCs);
assert.equal(lido2?.id, "arco-2");
assert.deepEqual(data.arcos, ["arco-1", "arco-2"]);
assert.equal(registrarLeitura(data, "arco-3", comCs), null, "leu o capítulo bloqueado");
assert.equal(lidosDaHistoria(data).length, 2);
assert.equal(lidosDaHistoria({ arcos: ["arco-1", "nao-existe", "arco-1"] }).length, 1, "o lixo não devia entrar");
const fala = falaAtual(comCs);
assert.equal(fala?.id, "arco-2", `a fala devia ser do capítulo aberto: ${fala?.id}`);
assert.equal(falaAtual(estadoDosCapitulos({ lidos: ["arco-1", "arco-2"] }))?.id, "arco-2", "sem aberto, a fala é do último lido");

// ---- o save do rpg guarda só os capítulos válidos ----
const rpg = new RPG();
assert.deepEqual(rpg.data.arcos, []);
rpg.data.arcos = ["arco-1", "arco-2"];
rpg.save();
const rpg2 = new RPG();
assert.deepEqual(rpg2.data.arcos, ["arco-1", "arco-2"], "a leitura não sobreviveu à recarga");
rpg2.data.arcos = ["arco-1", "nao-existe"];
rpg2.save();
assert.deepEqual(new RPG().data.arcos, ["arco-1"], "o save aceitou capítulo inexistente");

// ---- o app, o HTML e a wiki ----
const app = fs.readFileSync(new URL("../src/app/app.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const wiki = fs.readFileSync(new URL("../src/ui/wiki.js", import.meta.url), "utf8");
assert.match(app, /O fio da Iara/, "o diário não tem a seção do fio");
assert.match(app, /function estadoDaHistoria\(\)/, "o app não calcula o estado dos capítulos");
assert.match(app, /function registrarLeituraArco\(/, "o app não registra a leitura");
assert.match(app, /falaAtual\(estadoDaHistoria\(\)\)/, "o guia não fala o capítulo");
assert.match(app, /ler o capítulo/, "o diário não oferece a leitura");
assert.match(html, /id="journal"/, "diário ausente no HTML");
assert.match(wiki, /O fio da Iara/, "a wiki não ganhou a ficha do fio");

console.log(`ok fio da Iara: ${CAPITULOS.length} capítulos, missão e anterior, leitura no save e fala do guia`);

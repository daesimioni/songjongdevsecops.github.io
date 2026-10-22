// Grafo de pré-requisitos: arestas derivadas da numeração do catálogo, aviso de
// degrau anterior fraco e contrato do caderno. Roda sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

const { IDENTITY_AREAS } = await import("../src/content/identity.js");
const { grafoDeAreas, compararSecao, pontosFracos, GRAFO } = await import("../src/gameplay/grafo.js");

// ---- a numeração decide a ordem, inclusive 1.10 depois de 1.9 ----
assert.ok(compararSecao("1.10", "1.9") > 0, "1.10 precisa vir depois de 1.9");
assert.ok(compararSecao("2.1", "1.9") > 0, "2.1 precisa vir depois de 1.9");
assert.ok(compararSecao("1.2", "1.10") < 0);
assert.equal(compararSecao(null, "1.1"), 0, "sem seção não ordena");
assert.equal(compararSecao("x", "1.1"), 0, "seção inválida não quebra");

// ---- grafo sintético: uma raiz por grupo e aresta para a anterior ----
const sinteticas = [
  { id: "a1", discipline: "x", num: "1.1", name: "A1" },
  { id: "a2", discipline: "x", num: "1.2", name: "A2" },
  { id: "a3", discipline: "x", num: "1.10", name: "A3" },
  { id: "b1", discipline: "y", num: "2.1", name: "B1" },
  { id: "b2", discipline: "y", num: null, name: "B2" },
];
const g = grafoDeAreas(sinteticas);
assert.deepEqual([...g.keys()], ["a2", "a3", "b2"], "a raiz de cada grupo não tem pré-requisito");
assert.deepEqual(g.get("a2"), ["a1"]);
assert.deepEqual(g.get("a3"), ["a2"], "1.10 deveria seguir 1.2");
assert.deepEqual(g.get("b2"), ["b1"], "sem seção, mantém a ordem do array");
assert.equal(grafoDeAreas([]).size, 0);

// ---- grafo real: 86 áreas, uma raiz por grupo, pré do mesmo grupo ----
const grupos = new Set(IDENTITY_AREAS.map((a) => a.discipline));
assert.equal(GRAFO.size, IDENTITY_AREAS.length - grupos.size, "toda área depois da primeira precisa de aresta");
const porId = new Map(IDENTITY_AREAS.map((a) => [a.id, a]));
for (const [area, pre] of GRAFO) {
  assert.ok(porId.has(area), `área sem cadastro: ${area}`);
  assert.ok(porId.has(pre[0]), `pré-requisito sem cadastro: ${pre[0]}`);
  assert.equal(porId.get(area).discipline, porId.get(pre[0]).discipline, `aresta entre grupos: ${area} -> ${pre[0]}`);
}

// ---- quem avançou sem o degrau anterior ----
const areasSint = new Map(sinteticas.map((a) => [a.id, a]));
const aviso = pontosFracos({ a2: { n: 2 }, a1: { n: 0 } }, { grafo: g, areas: areasSint });
assert.equal(aviso.length, 1);
assert.equal(aviso[0].area, "a2");
assert.equal(aviso[0].pre, "a1");
assert.equal(aviso[0].nome, "A2");
assert.equal(aviso[0].nomePre, "A1");
assert.equal(pontosFracos({ a2: { n: 2 }, a1: { n: 2 } }, { grafo: g, areas: areasSint }).length, 0, "pré em dia não avisa");
assert.equal(pontosFracos({ a2: { n: 1 }, a1: { n: 0 } }, { grafo: g, areas: areasSint }).length, 0, "área fraca não avisa antes de avançar");
assert.equal(pontosFracos({}, { grafo: g, areas: areasSint }).length, 0, "sem conceitos não avisa");
assert.equal(pontosFracos({ a2: { n: 2 }, a1: { n: 0 } }, { grafo: g, areas: areasSint, limite: 1 }).length, 1);

// o par real mais adiantado também avisa
const [areaReal, [preReal]] = [...GRAFO.entries()][0];
const real = pontosFracos({ [areaReal]: { n: 3 }, [preReal]: { n: 1 } }, { limite: 5 });
assert.ok(real.some((p) => p.area === areaReal && p.pre === preReal), "o par real não gerou aviso");
assert.ok(real[0].nome && real[0].nomePre, "o aviso precisa dos nomes");

// ---- o caderno usa a seção ----
const app = fs.readFileSync(new URL("../src/app/app.js", import.meta.url), "utf8");
assert.match(app, /from "\.\.\/gameplay\/grafo\.js"/, "o app não importa o grafo");
assert.match(app, /Antes de avançar/, "o caderno não tem a seção de pré-requisitos");
assert.match(app, /pontosFracos\(conceitos, \{ limite: 5 \}\)/, "o caderno não consulta as arestas");

console.log(`ok grafo: ${IDENTITY_AREAS.length} áreas em ${grupos.size} grupos, ${GRAFO.size} arestas, aviso "${real[0].nome} depois de ${real[0].nomePre}"`);

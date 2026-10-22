// Acervo da Biblioteca Afogada: as três alas, a busca sem acento, os destinos
// de cada item e a fiação do cartão do guia e do modal. Roda sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

const { ALAS, itensDaAla, filtrarAcervo, resumoDaAla } = await import("../src/gameplay/acervo.js");
const { SITES, AREAS } = await import("../src/content/config.js");
const { DUNGEONS } = await import("../src/content/dungeon-data.js");

// ---- três alas, com o total de cada uma ----
assert.equal(ALAS.length, 3, "o acervo precisa das três alas");
const conceitos = itensDaAla("conceitos");
const lore = itensDaAla("lore");
const pratica = itensDaAla("pratica");
assert.equal(conceitos.length, SITES.filter((s) => s.post).length, "conceitos fora da contagem de páginas");
assert.equal(lore.length, AREAS.length + DUNGEONS.length, "lore fora da contagem de áreas e cavernas");
assert.equal(pratica.length, 7, `prática com ${pratica.length} continentes`);
assert.deepEqual([conceitos.length, lore.length, pratica.length], [454, 179, 7], "total de cada ala mudou");
assert.equal(resumoDaAla("lore").total, 179);
assert.equal(resumoDaAla("naoexiste").total, 0, "ala inválida devia ser vazia");

// ---- a forma de cada item ----
for (const item of conceitos) {
  assert.ok(item.post && item.nome && item.tipo === "post", `conceito quebrado: ${JSON.stringify(item)}`);
}
for (const item of lore) {
  assert.ok(item.nome && (item.tipo === "area" || item.tipo === "caverna"), `lore quebrada: ${JSON.stringify(item)}`);
  assert.ok(["mundo", "cavernas"].includes(item.categoria), `categoria de lore: ${item.categoria}`);
}
for (const item of pratica) {
  assert.ok(item.continente && item.tipo === "treino", `prática quebrada: ${JSON.stringify(item)}`);
}

// ---- busca sem acento e por continente ----
const algebra = filtrarAcervo(conceitos, "algebra");
assert.ok(algebra.length > 0, "a busca por algebra não achou nada");
assert.ok(algebra.every((i) => /algebra/i.test(i.nome) || /algebra|matem/i.test(i.sub)), "a busca trouxe fora do termo");
const acentuado = filtrarAcervo(conceitos, "álgebra");
assert.equal(acentuado.length, algebra.length, "acento mudou o resultado");
assert.equal(filtrarAcervo(conceitos, "").length, conceitos.length, "busca vazia devia devolver tudo");
assert.equal(filtrarAcervo(conceitos, "   ").length, conceitos.length, "só espaço devia devolver tudo");
assert.equal(filtrarAcervo(conceitos, "zzzz-nao-existe").length, 0, "termo impossível devia zerar");
assert.ok(filtrarAcervo(lore, "matematica").length > 0, "a busca de lore por continente falhou");

// ---- a fiação: modal, alas, botão no guia e destinos ----
const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../src/app/app.js", import.meta.url), "utf8");
assert.match(html, /id="biblioteca"/, "modal do acervo ausente");
assert.match(html, /data-biblioteca-ala="conceitos"/, "aba Conceitos ausente");
assert.match(html, /data-biblioteca-ala="lore"/, "aba Lore ausente");
assert.match(html, /data-biblioteca-ala="pratica"/, "aba Prática ausente");
assert.match(html, /id="biblioteca-filter"/, "busca do acervo ausente");
assert.match(html, /id="biblioteca-list"/, "lista do acervo ausente");
assert.match(html, /data-close="biblioteca"/, "botão de fechar do acervo ausente");
assert.match(app, /from "\.\.\/gameplay\/acervo\.js"/, "o app não importa o acervo");
assert.match(app, /function openBiblioteca\(\)/, "o app não define openBiblioteca");
assert.match(app, /function buildBiblioteca\(\)/, "o app não monta a lista");
assert.match(app, /quests\.isDone\("biblioteca-7"\)/, "o acesso não depende da corrente");
assert.match(app, /entrar no acervo/, "o cartão do guia não oferece o acervo");
assert.match(app, /openPost\(item\.post\)/, "Conceito não abre a página");
assert.match(app, /openWiki\(\{ consulta: `\$\{item\.categoria\}:\$\{item\.nome\}` \}\)/, "Lore não abre a wiki");
assert.match(app, /openTraining\(\{ id: `acervo-\$\{item\.continente\}`/, "Prática não abre o treino");

console.log(`ok acervo: ${conceitos.length} conceitos, ${lore.length} de lore, ${pratica.length} treinos; busca sem acento e fiação`);

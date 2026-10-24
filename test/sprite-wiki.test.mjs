// A wiki de sprites: a página pública, as categorias do kit e o desenho com
// visão, estado e animação. Sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";

const raiz = new URL("../", import.meta.url);
const ler = (caminho) => fs.readFileSync(new URL(caminho, raiz), "utf8");

const { KIT_CATEGORIES, SPRITE_KIT, searchKit, kitBounds, kitAnimation } = await import("../src/content/sprite-kit/catalog.js");

// ---- o kit é grande e navegável ----
assert.ok(SPRITE_KIT.length >= 500, `kit com ${SPRITE_KIT.length} sprites`);
assert.ok(Object.keys(KIT_CATEGORIES).length >= 15, `categorias: ${Object.keys(KIT_CATEGORIES).length}`);
for (const [nome, lista] of Object.entries(KIT_CATEGORIES)) assert.ok(lista.length > 0, `categoria vazia: ${nome}`);
for (const a of SPRITE_KIT) {
  assert.ok(a.id && a.name, `peça sem id ou nome em ${a.category}`);
  assert.ok(Number.isInteger(a.frames) && a.frames >= 1, `${a.id}: quadros inválidos`);
  assert.ok(Array.isArray(a.orientations) && a.orientations.length >= 1, `${a.id}: sem visões`);
  assert.ok(a.orientations.every((d) => Number.isInteger(d) && d >= 0 && d <= 7), `${a.id}: visão fora de 0..7`);
  const b = kitBounds(a.id);
  assert.ok(b.w > 0 && b.h > 0, `${a.id}: sem caixa de desenho`);
}
assert.equal(searchKit({ query: "lobo" }).length > 0, true, "busca por lobo não acha nada");
assert.equal(searchKit({ category: "criaturas" }).length, KIT_CATEGORIES.criaturas.length, "filtro de categoria");

// ---- a animação respeita o estado ----
const bicho = SPRITE_KIT.find((a) => a.category === "criaturas" && a.states?.walk);
assert.ok(bicho, "nenhuma criatura com estado walk");
const andando = kitAnimation(bicho.id, "walk");
assert.equal(andando.loop, true, "andar precisa repetir");
assert.ok(andando.frames >= 2, "andar precisa de mais de um quadro");

// ---- a página pública ----
const html = ler("sprites.html");
assert.match(html, /<title>Wiki de sprites — Vale Partido<\/title>/, "título da página");
assert.match(html, /id="cards"/, "grade de sprites ausente");
assert.match(html, /id="modos"/, "abas de coleção ausentes");
assert.match(html, /id="categorias"/, "chips de categoria ausentes");
assert.match(html, /id="query"/, "busca ausente");
assert.match(html, /id="motion"/, "controle de animação ausente");
assert.match(html, /id="collision"/, "controle de colisão ausente");
assert.match(html, /src="\.\/src\/app\/sprite-wiki\.js"/, "script da wiki ausente");
assert.match(html, /voltar ao jogo/, "link de volta ao jogo ausente");

const js = ler("src/app/sprite-wiki.js");
assert.match(js, /from "\.\.\/content\/sprite-kit\/catalog\.js"/, "wiki não lê o catálogo do kit");
assert.match(js, /from "\.\.\/rendering\/sprite-kit\/index\.js"/, "wiki não usa o desenho do jogo");
assert.match(js, /drawKit\(/, "wiki não desenha sprite");
assert.match(js, /kitAnimation\(/, "wiki não anima");
assert.match(js, /requestAnimationFrame\(tick\)/, "wiki sem laço de animação");
assert.match(js, /IntersectionObserver/, "wiki desenha card fora da tela");
assert.match(js, /kitBounds\(/, "wiki não enquadra a peça");
assert.match(js, /kitColliders\(/, "wiki não mostra colisão");
assert.match(js, /bestiaryModel\(/, "wiki não lista as criaturas do jogo");
assert.match(js, /drawCreatureArt\(/, "wiki não desenha criatura do jogo");
assert.match(js, /drawHuman\(/, "wiki não desenha a gente do vale");
assert.match(js, /itemIconCanvas\(/, "wiki não desenha os itens");
assert.match(js, /COLECOES = \{/, "wiki sem as quatro coleções");

// ---- as coleções têm tamanho de jogo ----
const { bestiaryModel } = await import("../src/ui/bestiary.js");
const { NPCS } = await import("../src/content/content.js");
const { ITEMS } = await import("../src/content/rpg-data.js");
assert.ok(bestiaryModel().todos.length >= 400, `criaturas no bestiário: ${bestiaryModel().todos.length}`);
assert.ok(Object.keys(NPCS).length >= 190, `gente: ${Object.keys(NPCS).length}`);
assert.ok(Object.values(ITEMS).filter((i) => i && i.name).length >= 500, `itens: ${Object.values(ITEMS).length}`);
assert.ok(KIT_CATEGORIES.criaturas.length >= 40, "kit com poucas criaturas");

// ---- o jogo aponta para a wiki e o build leva a página ----
const jogo = ler("index.html");
assert.match(jogo, /href="\.\/sprites\.html"/, "o jogo não aponta para a wiki de sprites");
const build = ler("tools/build.mjs");
assert.match(build, /'sprites\.html'/, "o build não copia a wiki de sprites");

const imagens = SPRITE_KIT.reduce((n, a) => n + (a.frames || 1), 0);
console.log(`ok wiki de sprites: ${SPRITE_KIT.length} sprites em ${Object.keys(KIT_CATEGORIES).length} categorias, ${imagens} quadros, página e build ligados`);

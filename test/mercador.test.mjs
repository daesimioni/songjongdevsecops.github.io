// Mercador de troca: material por material, com perda, sem leilão. Roda sem
// navegador; a tela é coberta pela sonda cdp-loja.mjs.
import assert from "node:assert/strict";
import fs from "node:fs";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

const { RPG } = await import("../src/gameplay/rpg.js");
const { TROCAS, ITEMS } = await import("../src/content/rpg-data.js");
const opcoes = { getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} };

assert.ok(TROCAS.length >= 3, "o mercador precisa de ofertas");
assert.equal(new Set(TROCAS.map((t) => t.id)).size, TROCAS.length, "troca com id repetido");
for (const t of TROCAS) {
  assert.ok(ITEMS[t.de] && ITEMS[t.para], `troca ${t.id} usa material que não existe`);
  assert.ok(t.qtd >= 1 && t.ganho >= 1, `troca ${t.id} com quantidade inválida`);
  assert.notEqual(t.de, t.para, `troca ${t.id} troca material por ele mesmo`);
  // trocar nunca pode render mais material do que consome
  assert.ok(t.ganho < t.qtd, `troca ${t.id} dá lucro (${t.qtd} por ${t.ganho})`);
}

// ---- oferta só aparece possível quando há material ----
{
  store.clear();
  const rpg = new RPG(opcoes);
  const antes = rpg.trocasView();
  assert.equal(antes.length, TROCAS.length, "a mesa não listou todas as trocas");
  assert.ok(antes.every((t) => t.pode === false), "oferta sem material não pode estar possível");

  rpg.addItem("madeira", 4);
  const comMadeira = rpg.trocasView();
  assert.equal(comMadeira.find((t) => t.de === "madeira").pode, true, "4 madeiras deviam abrir a troca");
  assert.equal(comMadeira.find((t) => t.de === "erva").pode, false, "erva sem estoque não pode abrir");
}

// ---- trocar de verdade ----
{
  store.clear();
  const rpg = new RPG(opcoes);
  rpg.addItem("madeira", 5);
  const res = rpg.trocar("madeira-ferro");
  assert.ok(res.ok, `troca recusada: ${res.reason}`);
  assert.equal(rpg.itemCount("madeira"), 1, "a troca não cobrou as quatro madeiras");
  assert.equal(rpg.itemCount("ferro"), 1, "a troca não entregou o ferro");
  assert.match(res.de, /Madeira/, "o retorno precisa do nome do que saiu");
  assert.match(res.para, /Ferro/, "o retorno precisa do nome do que entrou");

  // falta material: recusa sem cobrar nada
  const antes = { madeira: rpg.itemCount("madeira"), veio: rpg.itemCount("veio") };
  const falta = rpg.trocar("erva-veio");
  assert.equal(falta.ok, false, "troca sem material não pode passar");
  assert.match(falta.reason, /Falta/, "o motivo precisa dizer o que falta");
  assert.equal(rpg.itemCount("madeira"), antes.madeira, "troca recusada mexeu na madeira");
  assert.equal(rpg.itemCount("veio"), antes.veio, "troca recusada entregou veio");

  const inexistente = rpg.trocar("troca-que-nao-existe");
  assert.equal(inexistente.ok, false, "troca inexistente não pode passar");

  // exatamente a quantidade: consome tudo e some a chave do save
  rpg.addItem("madeira", 3);
  const exato = rpg.trocar("madeira-ferro");
  assert.ok(exato.ok, "troca com estoque exato devia passar");
  assert.equal(rpg.itemCount("madeira"), 0, "sobrou madeira depois de gastar tudo");
  assert.equal(rpg.data.items.madeira, undefined, "material zerado devia sair do save");
  assert.equal(rpg.itemCount("ferro"), 2, "a segunda troca não entregou ferro");
}

// ---- trocar um material comum por outro mais raro também perde ----
{
  store.clear();
  const rpg = new RPG(opcoes);
  rpg.addItem("madeira", 6);
  assert.ok(rpg.trocar("madeira-veio").ok, "troca de madeira por veio falhou");
  assert.equal(rpg.itemCount("madeira"), 0, "a madeira não foi cobrada");
  assert.equal(rpg.itemCount("veio"), 1, "a troca não entregou o veio");
}

// ---- o save guarda o resultado ----
{
  store.clear();
  const rpg = new RPG(opcoes);
  rpg.addItem("erva", 4);
  rpg.trocar("erva-veio");
  const outro = new RPG(opcoes);
  assert.equal(outro.itemCount("erva"), 0, "a erva gasta voltou depois de recarregar");
  assert.equal(outro.itemCount("veio"), 1, "o veio trocado não sobreviveu ao save");
}

// ---- integração na loja ----
const app = fs.readFileSync(new URL("../src/app/app.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../css/character.css", import.meta.url), "utf8");
assert.match(app, /rpg\.trocasView\(\)/, "a loja não lista as trocas");
assert.match(app, /rpg\.trocar\(t\.id\)/, "a loja não executa a troca");
assert.match(app, /Trocar material/, "a loja não tem a seção do mercador");
assert.match(css, /\.shop-troca\b/, "falta o estilo da linha de troca");
assert.match(css, /\.shop-trocas\b/, "falta o estilo da seção de troca");

console.log("ok mercador: oferta só com material, troca perde quantidade, falta não cobra e o save guarda");

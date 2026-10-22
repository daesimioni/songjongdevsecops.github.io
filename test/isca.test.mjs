// Isca: joga no chão da caverna, os bichos por perto largam o posto por 6s e
// voltam depois. Sem navegador para o item; a sonda cobre o movimento.
import assert from "node:assert/strict";
import fs from "node:fs";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};
const { ITEMS, RECIPES } = await import("../src/content/rpg-data.js");
const { RPG } = await import("../src/gameplay/rpg.js");
const opcoes = { getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} };

// ---- item e receita ----
const isca = ITEMS.isca;
assert.ok(isca, "isca não existe no catálogo");
assert.equal(isca.use, "bait", "a isca precisa ser do tipo bait");
assert.ok(isca.desc.length > 20, "isca sem descrição útil");
const receita = RECIPES.find((r) => r.out === "isca");
assert.ok(receita, "isca sem receita");
for (const id of Object.keys(receita.need)) assert.ok(ITEMS[id], `receita da isca pede ${id} inexistente`);

// ---- usar consome e devolve o efeito ----
store.clear();
const rpg = new RPG(opcoes);
rpg.addItem("isca", 2);
const res = rpg.useItem("isca");
assert.ok(res.ok, `isca não usou: ${res.reason}`);
assert.equal(res.bait, true, "o uso da isca não devolveu bait");
assert.equal(rpg.itemCount("isca"), 1, "a isca devia ser consumida");

// ---- a tela e a caverna estão ligadas ----
const app = fs.readFileSync(new URL("../src/app/app.js", import.meta.url), "utf8");
const inv = fs.readFileSync(new URL("../src/ui/inventory-ui.js", import.meta.url), "utf8");
const dungeon = fs.readFileSync(new URL("../src/app/dungeon.js", import.meta.url), "utf8");
const arte = fs.readFileSync(new URL("../src/rendering/dungeon-art.js", import.meta.url), "utf8");
assert.match(app, /id === "isca"[\s\S]*dungeon\.lure\(8, 6000\)/, "o app não joga a isca no chão");
assert.match(app, /A isca é para a caverna/, "o app não devolve a isca fora da caverna");
assert.match(inv, /item\.use === "bait"/, "a mochila não mostra o botão usar da isca");
assert.match(dungeon, /lure\(raio = 8, ms = 6000\)/, "a caverna não tem o método lure");
assert.match(dungeon, /m\.lure = \{ x, y, until: clock\(\) \+ ms \}/, "o bicho não recebe a isca");
assert.match(dungeon, /if \(m\.lure\)[\s\S]*m\.tx = m\.hx;/, "o bicho não volta para casa depois da isca");
assert.match(dungeon, /drawIsca\(ctx, b\.x \* TILE/, "a isca não é desenhada no chão");
assert.match(arte, /function drawIscaRaw/, "falta o desenho da isca");

console.log("ok isca: item, receita, consumo, lure na caverna, volta para casa e desenho no chão");

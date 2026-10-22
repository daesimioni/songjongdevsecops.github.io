// Ferry do Porto: custo em madeira, cobrança sem negativo, fala do barqueiro e
// a porta paga que leva ao Porto Submerso. Roda sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";
import { FERRY, precoDoFerry, nomeDoMaterial, podePagarFerry, faltaDoFerry, cobrarFerry, falaDoBarqueiro } from "../src/gameplay/ferry.js";

assert.equal(FERRY.material, "madeira");
assert.equal(FERRY.custo, 2);
assert.equal(nomeDoMaterial(), "Madeira Petrificada");
assert.equal(precoDoFerry(), "2 de madeira petrificada");

// ---- quem pode embarcar ----
assert.equal(podePagarFerry({}), false, "sem item não paga");
assert.equal(podePagarFerry({ madeira: 1 }), false, "um não paga dois");
assert.equal(podePagarFerry({ madeira: 2 }), true);
assert.equal(podePagarFerry({ madeira: "3" }), true, "número em texto conta");
assert.equal(podePagarFerry(null), false, "save vazio não quebra");
assert.equal(faltaDoFerry({}), 2);
assert.equal(faltaDoFerry({ madeira: 1 }), 1);
assert.equal(faltaDoFerry({ madeira: 9 }), 0);

// ---- a cobrança desconta e não deixa negativo ----
const itens = { madeira: 5, ferro: 1 };
assert.equal(cobrarFerry(itens), true);
assert.equal(itens.madeira, 3, "não descontou o preço");
assert.equal(itens.ferro, 1, "mexeu em outro item");
assert.equal(cobrarFerry({ madeira: 2 }), true);
const exato = { madeira: 2 };
assert.equal(cobrarFerry(exato), true);
assert.equal("madeira" in exato, false, "a entrada que zera devia sair");
assert.equal(cobrarFerry({ madeira: 1 }), false);
assert.equal(cobrarFerry(null), false);

// ---- o barqueiro tem o que dizer e roda a fala ----
assert.ok(falaDoBarqueiro(0).includes("Porto Submerso"), "a fala não apresenta o destino");
assert.equal(falaDoBarqueiro(0), falaDoBarqueiro(3), "a terceira fala repete a primeira");
assert.notEqual(falaDoBarqueiro(0), falaDoBarqueiro(1), "as falas precisam variar");
assert.ok(falaDoBarqueiro(-1).length > 20, "índice negativo não pode quebrar");

// ---- o save do RPG remove sem furar ----
const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};
const { RPG } = await import("../src/gameplay/rpg.js");
const rpg = new RPG();
rpg.addItem("madeira", 3);
assert.equal(rpg.removeItem("madeira", 2), true);
assert.equal(rpg.itemCount("madeira"), 1, "removeItem descontou errado");
assert.equal(rpg.removeItem("madeira", 5), false, "removeu mais do que tinha");
assert.equal(rpg.itemCount("madeira"), 1, "a recusa não podia debitar");
assert.equal(rpg.removeItem("madeira", 1), true);
assert.equal(rpg.itemCount("madeira"), 0);
const rpg2 = new RPG();
assert.equal(rpg2.itemCount("madeira"), 0, "o save não persistiu");

// ---- a tela oferece a porta e usa as regras ----
const app = fs.readFileSync(new URL("../src/app/app.js", import.meta.url), "utf8");
assert.match(app, /from "\.\.\/gameplay\/ferry\.js"/, "o app não importa o ferry");
assert.match(app, /FERRY\.nome/, "a lista não nomeia o ferry");
assert.match(app, /cobrarFerry\(rpg\.data\.items\)/, "o clique não cobra");
assert.match(app, /enterUnderworld\(\{ semEntrada: true \}\)/, "o ferry não chega sem entrada antiga");
assert.match(app, /toast\(falaDoBarqueiro/, "a conversa do barqueiro não aparece");
assert.match(app, /faltaDoFerry\(rpg\.data\.items\)/, "o botão não diz o que falta");
assert.match(app, /under\.addEventListener\("click", \(\) => enterUnderworld\(\)\)/, "o botão descer passou o evento como opção");

console.log(`ok ferry: ${precoDoFerry()}, cobrança, falta, ${falaDoBarqueiro(0).slice(0, 24)}...`);

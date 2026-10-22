// Texto maior: o cartão de leitura dos painéis cresce 15% no desktop, a escolha
// fica no save e no celular nada muda (o toque já usa letra maior).
import assert from "node:assert/strict";
import fs from "node:fs";
import { STORAGE } from "../src/core/runtime-config.js";

assert.equal(STORAGE.fonte, "mundo-song:fonte:v1", "a chave do texto maior mudou");

const css = fs.readFileSync(new URL("../css/base.css", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../src/app/app.js", import.meta.url), "utf8");

// a regra só vale em tela larga e reduz a largura na mesma proporção do zoom
assert.match(css, /@media \(min-width: 560px\)/, "a regra do texto maior precisa de corte por largura");
assert.match(css, /html\[data-fonte="grande"\] \.modal-card \{\s*width: min\(539px, 81\.7vw\);\s*max-height: min\(69vh, 626px\);\s*zoom: 1\.15;/, "a regra do texto maior não reduz a largura junto do zoom");
assert.match(css, /\.help-ajustes/, "falta o estilo do ajuste na ajuda");

// a ajuda explica e oferece o botão
assert.match(html, /id="btn-fonte"/, "a ajuda não tem o botão de texto maior");
assert.match(html, /texto maior: desligado/, "o botão nasce sem rótulo de estado");
assert.match(html, /vale para os painéis de leitura/, "a ajuda não explica o alcance do texto maior");

// o app lê, aplica e guarda
assert.match(app, /fonte: readJSON\(STORAGE\.fonte, "normal"\)/, "o app não lê a preferência");
assert.match(app, /function aplicarFonte\(valor\)/, "o app não aplica o texto maior");
assert.match(app, /document\.documentElement\.dataset\.fonte = grande \? "grande" : "normal"/, "o dataset do texto maior não é escrito");
assert.match(app, /writeJSON\(STORAGE\.fonte, saved\.fonte\)/, "a preferência não é salva");
assert.match(app, /aplicarFonte\(saved\.fonte\)/, "o app não aplica a preferência ao abrir");
assert.match(app, /btn-fonte"\)\?\.addEventListener/, "o botão de texto maior não tem ação");
assert.match(app, /aplicarFonte\(saved\.fonte === "grande" \? "normal" : "grande"\)/, "o botão não alterna o texto maior");

console.log("ok fonte: regra com corte de largura, botão na ajuda, preferência lida, aplicada e salva");

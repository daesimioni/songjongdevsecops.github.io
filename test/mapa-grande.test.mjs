// Mapa grande: o minimapa em tela cheia, com o mesmo desenho e o estado
// recolhido preservado. Contrato de HTML, CSS e JS; a sonda mede o resto.
import assert from "node:assert/strict";
import fs from "node:fs";

const ler = (rel) => fs.readFileSync(new URL(`../${rel}`, import.meta.url), "utf8");
const html = ler("index.html");
const css = ler("css/base.css");
const app = ler("src/app/app.js");

// ---- o botão existe, fica no cabeçalho do minimapa e anuncia o estado ----
assert.match(html, /id="mini-expandir"[^>]*aria-pressed="false"/, "botão do mapa grande ausente ou sem estado");
assert.match(html, /id="mini-expandir"[^>]*aria-controls="minimap-canvas"/, "botão não aponta para o canvas");
assert.match(html, /abrir o mapa grande/, "botão sem rótulo acessível");
assert.match(html, /id="mini-toggle"/, "o botão de recolher continua necessário");

// ---- o modo grande cobre a tela e não estica o desenho ----
assert.match(css, /\.minimap\.grande\s*\{[^}]*position:\s*fixed/s, "modo grande não sai do canto");
assert.match(css, /\.minimap\.grande\s*\{[^}]*inset:\s*12px/s, "modo grande sem margem de tela");
assert.match(css, /\.minimap\.grande #minimap-canvas\s*\{[^}]*object-fit:\s*contain/s, "canvas pode distorcer");
assert.match(css, /\.minimap\.grande #minimap-canvas\s*\{[^}]*max-height:\s*calc\(100vh - 112px\)/s, "canvas pode passar da tela");

// ---- o JS alterna, dobra o canvas e devolve o estado recolhido ----
assert.match(app, /function pintarMapaGrande\(aberto\)/, "sem função de alternância");
assert.match(app, /classList\.toggle\("grande", aberto\)/, "a classe do modo grande não é aplicada");
assert.match(app, /const lado = aberto \? \[1200, 800\] : \[600, 400\]/, "o canvas não dobra no modo grande");
assert.match(app, /aplicarMiniRecolhido\(false\)/, "mapa recolhido não abre o canvas");
assert.match(app, /aplicarMiniRecolhido\(true\)/, "o estado recolhido não volta ao fechar");
assert.match(app, /e\.key !== "Escape" \|\| !mapaGrande/, "Esc não fecha o mapa grande");
assert.match(app, /botao\.setAttribute\("aria-pressed", String\(aberto\)\)/, "o botão não anuncia o estado");

console.log("ok mapa grande: botão, tela cheia, canvas 1200x800, estado recolhido preservado e Esc");

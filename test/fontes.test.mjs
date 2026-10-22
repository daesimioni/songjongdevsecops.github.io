// Fontes do jogo: ficam no repo, são pré-carregadas e o tamanho do texto vale
// antes do primeiro desenho. Roda sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";

const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../css/base.css", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../src/app/app.js", import.meta.url), "utf8");

// ---- nada de fonte de fora: o visual não pode depender da rede ----
assert.ok(!/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(html), "o HTML ainda busca fonte no Google");
assert.ok(!/@import\s+url\(["']?https?:/.test(css), "o CSS importa fonte externa");
assert.ok(!/fonts\.googleapis\.com|fonts\.gstatic\.com/.test(css), "o CSS ainda aponta para o Google");

// ---- as duas famílias têm @font-face local, com os pesos usados ----
for (const familia of ["Press Start 2P", "Silkscreen"]) {
  assert.match(css, new RegExp(`font-family: "${familia}"`), `sem @font-face de ${familia}`);
}
assert.match(css, /font-family: "Silkscreen";\n  font-style: normal;\n  font-weight: 700;/, "Silkscreen 700 não está declarada");
assert.equal((css.match(/url\("\.\.\/assets\/fonts\//g) || []).length, 6, "as seis fatias de fonte não estão no CSS");
assert.ok(!/font-display: block/.test(css), "font-display block esconderia o texto");

// ---- os arquivos existem de verdade e são woff2 ----
const arquivos = [
  "press-start-2p-400-latino.woff2",
  "press-start-2p-400-latino-ext.woff2",
  "silkscreen-400-latino.woff2",
  "silkscreen-400-latino-ext.woff2",
  "silkscreen-700-latino.woff2",
  "silkscreen-700-latino-ext.woff2",
];
for (const nome of arquivos) {
  const caminho = new URL(`../assets/fonts/${nome}`, import.meta.url);
  assert.ok(fs.existsSync(caminho), `falta ${nome}`);
  const bytes = fs.readFileSync(caminho);
  assert.equal(bytes.subarray(0, 4).toString("latin1"), "wOF2", `${nome} não é woff2`);
  assert.ok(bytes.length > 1000 && bytes.length < 40000, `${nome} com tamanho estranho: ${bytes.length}`);
}

// ---- preload das fontes que a interface usa e preferência antes do desenho ----
assert.match(html, /<link rel="preload" href="assets\/fonts\/press-start-2p-400-latino\.woff2" as="font" type="font\/woff2" crossorigin>/, "sem preload da Press Start 2P");
assert.match(html, /<link rel="preload" href="assets\/fonts\/silkscreen-400-latino\.woff2" as="font" type="font\/woff2" crossorigin>/, "sem preload da Silkscreen 400");
assert.match(html, /<link rel="preload" href="assets\/fonts\/silkscreen-700-latino\.woff2" as="font" type="font\/woff2" crossorigin>/, "sem preload da Silkscreen 700");
const scriptFonte = html.indexOf('localStorage.getItem("mundo-song:fonte:v1")');
const cssLink = html.indexOf('href="css/style.css"');
assert.ok(scriptFonte > 0 && scriptFonte < cssLink, "a preferência de texto é aplicada depois do CSS, com troca no load");
assert.match(html, /dataset\.fonte = "grande"/, "o script da preferência não marca o tamanho grande");
assert.match(app, /function aplicarFonte\(/, "o app perdeu o controle da fonte");
assert.match(app, /document\.documentElement\.dataset\.fonte/, "o app não aplica o tamanho do texto");

console.log(`ok fontes: ${arquivos.length} woff2 locais, preload e tamanho do texto antes do primeiro desenho`);

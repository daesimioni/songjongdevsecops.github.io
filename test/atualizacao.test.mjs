// Atualização do site: versão publicada, manifesto, retomada da sessão e a
// fiação do app. Roda sem navegador: node test/atualizacao.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import {
  ATUALIZACAO, versaoDe, arquivosDoManifesto, lerManifesto, prepararRetomada,
  retomadaValida, guardarRetomada, consumirRetomada, baixarArquivos,
} from "../src/platform/atualizacao.js";
import { versaoDosArquivos, textoDaVersao, CAMINHOS_DA_VERSAO } from "../tools/versao.mjs";

// ---- versão e manifesto ----
assert.equal(versaoDe({ versao: "0123456789abcdef" }), "0123456789abcdef");
assert.equal(versaoDe({ versao: "curta" }), "", "aceitou versão fora do formato");
assert.equal(versaoDe({ versao: "../../etc" }), "");
assert.equal(versaoDe(null), "");
const manifesto = arquivosDoManifesto({
  arquivos: ["index.html", "src/app/app.js", "/etc/passwd", "../fora.js", "https://x/y.js", 7, ""],
});
assert.deepEqual(manifesto, ["index.html", "src/app/app.js"]);
assert.deepEqual(arquivosDoManifesto({ arquivos: Array(500).fill("src/a.js") }).length, ATUALIZACAO.maxArquivos);

// ---- leitura da versão publicada ----
let pedido = null;
const fetchBom = async (url, opcoes) => { pedido = { url, opcoes }; return { ok: true, json: async () => ({ versao: "abcdef0123456789", arquivos: ["index.html"] }) }; };
const lido = await lerManifesto(fetchBom, 1234);
assert.equal(lido.versao, "abcdef0123456789");
assert.match(pedido.url, /^versao\.json\?t=1234$/);
assert.equal(pedido.opcoes.cache, "no-store");
assert.equal((await lerManifesto(async () => ({ ok: false }), 1)), null);
assert.equal((await lerManifesto(async () => { throw new Error("offline"); }, 1)), null);
assert.equal((await lerManifesto(async () => ({ ok: true, json: async () => ({ versao: "x" }) }), 1)), null);

// ---- retomada da sessão ----
const player = { x: 12.5, y: 30, dir: 2, continentId: "math" };
const agora = 1_000_000;
const memoria = new Map();
const storage = {
  getItem: (k) => (memoria.has(k) ? memoria.get(k) : null),
  setItem: (k, v) => memoria.set(k, String(v)),
  removeItem: (k) => memoria.delete(k),
};
assert.equal(guardarRetomada(player, storage, agora), true);
assert.deepEqual(consumirRetomada(storage, agora + 1000), { x: 12.5, y: 30, dir: 2, continente: "math", em: agora });
assert.equal(consumirRetomada(storage, agora + 1000), null, "a retomada foi usada duas vezes");
guardarRetomada(player, storage, agora);
assert.equal(consumirRetomada(storage, agora + ATUALIZACAO.validadeRetomada + 1), null, "aceitou retomada vencida");
const invalida = retomadaValida({ x: "a", y: 2, em: agora }, agora);
assert.equal(invalida, null);
assert.equal(retomadaValida({ x: 1, y: 2, em: agora + 999999 }, agora), null, "aceitou retomada do futuro");
assert.equal(retomadaValida(null, agora), null);
assert.deepEqual(prepararRetomada({ x: 1, y: 2 }, agora).continente, "hub");
assert.equal(consumirRetomada({ getItem: () => "{", removeItem: () => {} }, agora), null, "JSON podre derrubou");

// ---- baixar os arquivos com cache reload ----
const vistos = [];
let n = 0;
const fetchBaixa = async (arquivo, opcoes) => {
  vistos.push({ arquivo, opcoes });
  n += 1;
  if (n === 2) throw new Error("caiu");
  return { ok: n !== 3 };
};
const baixou = await baixarArquivos({ arquivos: ["a.js", "b.js", "c.js", "d.js"] }, fetchBaixa, 2);
assert.equal(baixou.baixados, 2);
assert.equal(baixou.falhas, 2);
assert.equal(vistos.length, 4);
assert.ok(vistos.every((v) => v.opcoes.cache === "reload"), "não pediu cache reload");
assert.ok(vistos.every((v) => ["a.js", "b.js", "c.js", "d.js"].includes(v.arquivo)));
assert.deepEqual(await baixarArquivos({ arquivos: [] }, fetchBaixa), { baixados: 0, falhas: 0 });

// ---- o gerador de versão é determinístico ----
const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "verso-"));
fs.writeFileSync(path.join(tmp, "a.txt"), "um");
fs.writeFileSync(path.join(tmp, "b.txt"), "dois");
const h1 = versaoDosArquivos(tmp, ["a.txt", "b.txt"]);
const h2 = versaoDosArquivos(tmp, ["b.txt", "a.txt"]);
assert.equal(h1, h2, "a ordem dos arquivos mudou a versão");
fs.writeFileSync(path.join(tmp, "b.txt"), "três");
assert.notEqual(versaoDosArquivos(tmp, ["a.txt", "b.txt"]), h1, "o conteúdo não mudou a versão");
assert.match(textoDaVersao(tmp, ["a.txt", "b.txt"]), /"versao": "[a-f0-9]{16}"/);
assert.ok(CAMINHOS_DA_VERSAO.includes("src") && CAMINHOS_DA_VERSAO.includes("index.html"));
fs.rmSync(tmp, { recursive: true, force: true });

// ---- a fiação no app, no HTML e no CI ----
const app = fs.readFileSync(new URL("../src/app/app.js", import.meta.url), "utf8");
const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../css/base.css", import.meta.url), "utf8");
const fluxo = fs.readFileSync(new URL("../.github/workflows/versao.yml", import.meta.url), "utf8");
const versao = JSON.parse(fs.readFileSync(new URL("../versao.json", import.meta.url), "utf8"));
assert.match(app, /from "\.\.\/platform\/atualizacao\.js"/, "o app não importa a atualização");
assert.match(app, /function conferirAtualizacao\(/, "o app não confere a versão");
assert.match(app, /setInterval\(conferirAtualizacao, ATUALIZACAO\.intervalo\)/, "não confere de tempos em tempos");
assert.match(app, /function aplicarAtualizacao\(/, "não aplica a atualização");
assert.match(app, /guardarRetomada\(player\)/, "não guarda a posição antes de recarregar");
assert.match(app, /startGame\(\{ retomar: true \}\)/, "não volta direto ao jogo");
assert.match(html, /id="update-banner"/, "o aviso não existe no HTML");
assert.match(html, /id="update-btn"/, "o botão de atualizar não existe");
assert.match(html, /<\/div>\s*<div id="update-banner"/, "o aviso está dentro do app e vira inert com painel aberto");
assert.match(css, /\.update-banner\s*\{/, "o aviso não tem estilo");
assert.match(css, /\.update-banner\s*\{[^}]*z-index: 70/s, "o aviso não fica acima do mapa grande e dos painéis");
assert.match(fluxo, /node tools\/versao\.mjs/, "o CI não gera a versão");
assert.match(fluxo, /git commit -m "Atualiza a versao publicada"/, "o CI não publica a versão");
assert.match(versaoDe(versao), /^[a-f0-9]{16}$/, "versao.json inválido");
assert.ok(Array.isArray(versao.arquivos) && versao.arquivos.includes("index.html"), "versao.json sem o manifesto");
assert.ok(versao.arquivos.includes("src/app/app.js") && versao.arquivos.includes("src/platform/atualizacao.js"), "o manifesto não lista o código");

console.log(`ok atualização: versão ${versao.versao}, ${versao.arquivos.length} arquivos, retomada e aviso no app`);

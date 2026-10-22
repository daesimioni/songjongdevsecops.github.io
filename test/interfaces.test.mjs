import { readStyles } from "./styles.mjs";
// Interface pass: alvo de toque mínimo, wiki de uma coluna no celular e loja
// sem estouro. A sonda de navegador (`cdp-ui-audit.mjs`) mede os 9 painéis; aqui
// ficam as travas de CSS e a lista de painéis que precisam existir.
// Roda sem navegador: node test/interfaces.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";

const css = readStyles();
const html = fs.readFileSync(new URL("../index.html", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../src/app/app.js", import.meta.url), "utf8");

const problemas = [];
const check = (ok, msg) => { if (!ok) problemas.push(msg); };
check(/font-size: max\(11px, 1em\)/.test(css), "painel sem piso de 11px para texto corrido");
// texto informativo (informação de item, bicho e duelo) também tem piso de 11 px
const cssInfo = [fs.readFileSync(new URL("../css/bestiary.css", import.meta.url), "utf8"), css, fs.readFileSync(new URL("../css/combat.css", import.meta.url), "utf8")].join("\n");
for (const seletor of [".best-trait, .best-weak", ".shop-grid span", ".shop-grid i", ".company-pet span", "#duel-sub"]) {
  const linha = cssInfo.split("\n").find((l) => l.startsWith(seletor)) || "";
  const px = Number((linha.match(/font-size: ([\d.]+)px/) || [])[1] || 0);
  check(px >= 11, `${seletor} abaixo do piso de leitura (${px}px)`);
}
// o botão da troca do mercador também respeita o alvo de 28 px no celular
const linhaTroca = css.split("\n").find((l) => l.startsWith(".shop-troca .shop-buy")) || "";
check(/min-height: 28px/.test(linhaTroca), "botão da troca do mercador abaixo do alvo de 28 px");

// todo painel interno precisa de contêiner com id e ligação de abertura
for (const [id, rotulo] of [
  ["inventory", "mochila"], ["bestiary", "bestiário"], ["journal", "diário"],
  ["sheet", "ficha"], ["help", "ajuda"], ["travel", "viagem"], ["wiki", "wiki"],
  ["duel", "duelo"], ["shop", "loja"],
]) {
  check(new RegExp(`id="${id}"`).test(html), `painel ${rotulo} (#${id}) sumiu do HTML`);
}

// alvo de toque: as abas da wiki e os botões de ação tinham 24-25 px de altura
check(/\.wiki-tab \{[^}]*min-height: 28px/.test(css), "aba da wiki abaixo de 28 px");
check(/\.item-use \{[^}]*min-height: 28px/.test(css), "botão de ação abaixo de 28 px");
check(/\.item-use \{[^}]*display: inline-flex/.test(css), "botão de ação sem centralização");

// celular: wiki em uma coluna e card da loja sem estourar
check(/@media \(max-width: 560px\) \{\s*\.wiki-list \{ grid-template-columns: 1fr; \}/.test(css), "wiki de duas colunas no celular");
check(/\.shop-card \{ width: 100%; \}/.test(css), "card da loja ainda com largura fixa no celular");

// os ganchos de depuração usados pela sonda continuam existindo
check(/openShop: \(\) => openShop\(\)/.test(app), "gancho openShop da sonda sumiu");
check(/openDuel: \(mon, ground, boss, partner\) => openDuel\(/.test(app), "gancho openDuel da sonda sumiu");

assert.equal(problemas.length, 0, `interfaces com ${problemas.length} problema(s):\n- ${problemas.join("\n- ")}`);
console.log("ok interfaces: 9 painéis, alvo de 28 px, wiki de 1 coluna e loja sem estouro no celular");

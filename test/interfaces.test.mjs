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

// rosa dos ventos do mapa grande: oito pontas e o centro
check((html.match(/data-rosa="/g) || []).length === 9, "a rosa do mapa não tem nove pontos");
check(/id="rosa"/.test(html), "a rosa não existe no HTML");
check(/\.minimap\.grande \.rosa \{ display: grid; \}/.test(css), "a rosa não aparece no mapa grande");
check(/function andarPelaRosa\(/.test(app), "o app não navega pela rosa");
check(/renderer\.miniPanBy\(dx, dy\)/.test(app), "a rosa não move o mapa");
check(/renderer\.miniRecenter\(\)/.test(app), "a rosa não volta ao personagem");

// botão usado com o ponteiro solta o foco: o próximo Espaço é da nave, não do botão
check(/let ultimoGesto = "teclado"/.test(app), "sem rastreio do último gesto");
check(/botao\.blur\(\)/.test(app), "botão clicado continua selecionado");
check(/state\.focoDePonteiro/.test(app), "modal aberto no mouse devolve o foco ao botão");
check(/nativeActivation\(e\)/.test(app), "a ativação nativa do teclado sumiu");

// ---- caderno do viajante: uma capa para os cinco painéis de leitura ----
const caderno = fs.readFileSync(new URL("../src/ui/caderno.js", import.meta.url), "utf8");
const sheet = fs.readFileSync(new URL("../src/ui/sheet.js", import.meta.url), "utf8");
const bestiary = fs.readFileSync(new URL("../src/ui/bestiary.js", import.meta.url), "utf8");
check(/from "\.\.\/ui\/caderno\.js"/.test(app) && /criarCaderno\s*\(/.test(app), "o app não monta o caderno");
for (const painel of ["journal", "sheet", "inventory", "bestiary"]) {
  check(new RegExp(`id: "${painel}"`).test(caderno), `o caderno não conhece o painel ${painel}`);
}
check(/classList\.add\("book-card"\)/.test(caderno), "o caderno não dá a moldura ao painel");
check(/class = "book-nav"/.test(caderno) || /className = "book-nav"/.test(caderno), "o caderno não injeta a navegação");
check(/dataset\.page/.test(caderno) && /book-link/.test(caderno), "a navegação do caderno não tem páginas");
// a missão tem um lugar só no HUD e ele é clicável
check((html.match(/id="quest-track"/g) || []).length === 1, "o HUD tem mais de uma trilha de missões");
check(/class="hud-dock"/.test(html), "o HUD não tem o dock de menus");
for (const id of ["btn-chat", "btn-rede", "btn-journal"]) check(new RegExp(`id="${id}"`).test(html), `o dock não tem #${id}`);
check(/data-journal-tab="missoes"/.test(html) && /data-journal-tab="registro"/.test(html), "o diário não tem as duas abas");
check(/trocarAbaDiario/.test(app), "o diário não troca de aba");
check(/sheet-page/.test(sheet) && /paginas\.forja/.test(sheet), "a ficha não tem páginas");
check(/id="best-continentes"/.test(html) && /continenteAtual/.test(bestiary), "o bestiário não filtra por continente");
check(/\.book-card \{[^}]*grid-template-columns: 228px/.test(css), "o caderno não tem a coluna do índice");
// falar fica aberto: a conversa não pode fechar a cada mensagem
check(/renderChatLog\(true\);\s*\$\("chat-input"\)\.focus\(\)/.test(app), "falar fecha depois de enviar");

assert.equal(problemas.length, 0, `interfaces com ${problemas.length} problema(s):\n- ${problemas.join("\n- ")}`);
console.log("ok interfaces: caderno de cinco páginas, HUD com dock, missões com um lugar só e 28 px de alvo");

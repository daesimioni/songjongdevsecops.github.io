// Leitura em voz alta da pergunta da coleta: usa o speechSynthesis do navegador,
// com voz pt-BR quando existe e no-op quando a API não existe. Roda sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";
import { lerPergunta, pararVoz, vozDisponivel } from "../src/ui/voz.js";

const falas = [];
const cancelamentos = [];
let vozes = [{ lang: "en-US", name: "English" }, { lang: "pt-BR", name: "Português" }];

class FalaFalsa {
  constructor(text) {
    this.text = text;
    this.lang = "";
    this.rate = 1;
    this.voice = null;
    this.onend = null;
    this.onerror = null;
  }
}
globalThis.SpeechSynthesisUtterance = FalaFalsa;
globalThis.speechSynthesis = {
  speak: (fala) => falas.push(fala),
  cancel: () => cancelamentos.push(Date.now()),
  getVoices: () => vozes,
};

assert.equal(vozDisponivel(), true, "com a API, a voz está disponível");
const pergunta = { q: "Quanto é 2 + 2?", options: ["3", "4", "5"] };
assert.equal(lerPergunta(pergunta), true, "a pergunta deveria ser lida");
assert.equal(falas.length, 1, "deveria falar uma vez");
const fala = falas[0];
assert.match(fala.text, /^Pergunta\. Quanto é 2 \+ 2\?/, "a leitura começa pela pergunta");
assert.match(fala.text, /A: 3/, "a leitura não diz a alternativa A");
assert.match(fala.text, /B: 4/, "a leitura não diz a alternativa B");
assert.match(fala.text, /C: 5/, "a leitura não diz a alternativa C");
assert.equal(fala.lang, "pt-BR", "a língua da leitura deveria ser português");
assert.ok(fala.rate <= 1, "a leitura não pode acelerar demais");
assert.equal(fala.voice?.lang, "pt-BR", "deveria escolher a voz em português");
assert.ok(cancelamentos.length >= 1, "a leitura nova precisa calar a anterior");

// fim da fala avisa a tela
let terminou = 0;
assert.equal(lerPergunta(pergunta, { onend: () => { terminou++; } }), true);
assert.equal(typeof falas[1].onend, "function", "sem gancho de fim");
falas[1].onend();
assert.equal(terminou, 1, "o fim da fala não avisou");

// pergunta longa não vira leitura sem fim
const longa = { q: "a".repeat(5000), options: [] };
lerPergunta(longa);
assert.ok(falas[2].text.length <= 1200, `leitura longa demais: ${falas[2].text.length}`);
assert.equal(falas[2].text.includes("Alternativas"), false, "sem alternativas não inventa a seção");

// sem pergunta, não fala
const antes = falas.length;
assert.equal(lerPergunta({ q: "   ", options: ["x"] }), false, "pergunta vazia não deveria falar");
assert.equal(lerPergunta(null), false, "sem pergunta não deveria falar");
assert.equal(falas.length, antes, "pergunta vazia não pode chamar o alto-falante");

// parar cala a leitura
cancelamentos.length = 0;
pararVoz();
assert.equal(cancelamentos.length, 1, "parar a voz deveria cancelar");

// sem a API (node puro, navegador antigo), tudo vira no-op e não quebra
delete globalThis.speechSynthesis;
delete globalThis.SpeechSynthesisUtterance;
assert.equal(vozDisponivel(), false, "sem a API a voz não está disponível");
assert.equal(lerPergunta(pergunta), false, "sem a API a leitura não pode fingir");
assert.doesNotThrow(() => pararVoz(), "parar sem a API não pode quebrar");

// ---- integração na fonte ----
const gatherFonte = fs.readFileSync(new URL("../src/ui/gather.js", import.meta.url), "utf8");
const character = fs.readFileSync(new URL("../css/character.css", import.meta.url), "utf8");
assert.match(gatherFonte, /import \{ lerPergunta, pararVoz, vozDisponivel \} from "\.\/voz\.js"/, "a coleta não importa a voz");
assert.match(gatherFonte, /ouvir a pergunta/, "a coleta não mostra o botão de ouvir");
assert.match(gatherFonte, /pararVoz\(\)/, "a coleta não cala a leitura ao fechar ou responder");
assert.match(gatherFonte, /aria-pressed/, "o botão de voz não anuncia o estado");
assert.match(character, /\.duel-voz\b/, "falta o estilo do botão de voz");

console.log("ok voz: leitura pt-BR da pergunta da coleta, fim avisa a tela, vazio e API ausente não quebram");

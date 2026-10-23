// Erro por distrator: versão estável da pergunta, alternativa marcada no save,
// prioridade da pergunta errada e caderno com o erro específico.
import assert from "node:assert/strict";
import fs from "node:fs";
import {
  versaoDaPergunta, registrarDistrator, recentes, erroRecente,
  MAX_DISTRATORES, JANELA_RECENTE,
} from "../src/gameplay/distratores.js";
import { hashDaPergunta } from "../tools/revisar-conteudo.mjs";

const pergunta = {
  q: "Quantos bits tem um dígito hexadecimal?",
  options: ["4", "8", "2", "16", "1"],
  a: 0,
  why: "Cada dígito hexadecimal representa quatro bits.",
};
const agora = 1_000_000_000_000;

// ---- versão: a mesma do revisor, estável e sensível ao conteúdo ----
assert.equal(versaoDaPergunta(pergunta), hashDaPergunta(pergunta), "a versão do save difere da do revisor");
assert.equal(versaoDaPergunta(pergunta), versaoDaPergunta({ ...pergunta }), "a versão precisa ser estável");
assert.match(versaoDaPergunta(pergunta), /^[0-9a-f]{8}$/);
assert.notEqual(versaoDaPergunta(pergunta), versaoDaPergunta({ ...pergunta, options: ["4", "8", "2", "16", "0"] }), "mudar alternativa muda a versão");
assert.notEqual(versaoDaPergunta(pergunta), versaoDaPergunta({ ...pergunta, a: 1 }), "mudar resposta muda a versão");

// ---- registro: conta repetições e guarda o texto marcado ----
const mapa = {};
const primeira = registrarDistrator(mapa, pergunta, "8", agora);
assert.equal(primeira.n, 1);
assert.equal(primeira.t, "8");
assert.equal(primeira.at, agora);
const segunda = registrarDistrator(mapa, pergunta, "2", agora + 1000);
assert.equal(segunda.n, 2, "o segundo erro deveria contar");
assert.equal(segunda.t, "2", "o texto guardado é o do último erro");
assert.equal(registrarDistrator(mapa, pergunta, "   ", agora), null, "alternativa vazia não registra");
assert.equal(registrarDistrator(null, pergunta, "8", agora), null, "save vazio não quebra");

// ---- janela e ordem do caderno ----
assert.equal(erroRecente({ at: agora }, agora + 1000), true);
assert.equal(erroRecente({ at: agora }, agora + JANELA_RECENTE + 1), false, "erro velho sai do caderno");
const outro = { q: "Outra pergunta com texto suficiente?", options: ["A", "B", "C"], a: 0 };
registrarDistrator(mapa, outro, "C", agora + 5000);
const lista = recentes(mapa, 5, agora + 6000);
assert.equal(lista.length, 2);
assert.equal(lista[0].texto, "C", "o erro mais novo vem primeiro");
assert.equal(recentes(mapa, 1, agora + 6000).length, 1);
assert.deepEqual(recentes(mapa, 5, agora + JANELA_RECENTE + 10_000), [], "fora da janela não aparece");

// ---- o save não cresce sem teto ----
const grande = {};
for (let i = 0; i < MAX_DISTRATORES + 5; i++) {
  registrarDistrator(grande, { ...outro, q: `Pergunta número ${i} com texto suficiente?` }, "B", agora + i);
}
assert.equal(Object.keys(grande).length, MAX_DISTRATORES, "o save passou do teto");
assert.equal(Object.values(grande).some((e) => e.at === agora), false, "a entrada mais antiga devia sair");

// ---- integração com o duelo real ----
const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};
const { RPG } = await import("../src/gameplay/rpg.js");
const { GROUNDS } = await import("../src/content/rpg-data.js");
const ground = GROUNDS.find((g) => g.id === "cs");
const rpg = new RPG();
const q = rpg.buildDeck("cs", [1])[0];
const errada = (q.answer + 1) % q.options.length;
assert.match(q.version, /^[0-9a-f]{8}$/, "a pergunta da coleta precisa de versão");
rpg.registrarDistrator(q, errada);
assert.equal(rpg.data.distratores[q.version]?.t, q.options[errada], "o save não guardou a alternativa");
assert.equal(rpg.data.distratores[q.version]?.n, 1);
const erros = rpg.errosRecentes(3);
assert.equal(erros[0]?.q, q.q, "o caderno não achou o enunciado pelo hash");
assert.equal(erros[0]?.marcou, q.options[errada]);
assert.equal(erros[0]?.resposta, q.options[q.answer]);
rpg.save();
const rpg2 = new RPG();
assert.equal(rpg2.data.distratores[q.version]?.t, q.options[errada], "o erro não sobreviveu à recarga");
assert.equal(rpg2.errosRecentes(1)[0]?.q, q.q, "o caderno não sobreviveu à recarga");

// ---- a pergunta errada volta antes no mesmo domínio ----
const rpg3 = new RPG();
const deck = rpg3.duelDeck("cs", 1);
const escolhida = deck.find((item) => item.version);
rpg3.data.conceitos = {};
rpg3.data.distratores = { [escolhida.version]: { t: "x", n: 1, at: Date.now() } };
const ordem = rpg3.duelDeck("cs", 1);
assert.equal(ordem[0].version, escolhida.version, "a pergunta com erro recente deveria vir primeiro");

// ---- a tela mostra a marcada e o caderno ----
const gather = fs.readFileSync(new URL("../src/ui/gather.js", import.meta.url), "utf8");
assert.match(gather, /registrarDistrator/, "a coleta não registra o distrator");
const app = fs.readFileSync(new URL("../src/app/app.js", import.meta.url), "utf8");
assert.match(app, /Erros recentes/, "o diário não lista os erros recentes");
assert.match(app, /errosRecentes\(5\)/, "o diário não consulta o caderno de distratores");

console.log(`ok distratores: versão ${versaoDaPergunta(pergunta)}, contagem, janela de ${JANELA_RECENTE / 86400000} dias, teto ${MAX_DISTRATORES}, save, caderno e prioridade`);

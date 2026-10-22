// Revisor de conteúdo: uma pergunta boa passa, uma quebrada é apontada com o
// motivo, o banco real não tem erro e cada pergunta tem versão única.
import assert from "node:assert/strict";
import { execFileSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import { revisarPergunta, revisarBanco, hashDaPergunta } from "../tools/revisar-conteudo.mjs";

const boa = {
  q: "Quantos bits tem um dígito hexadecimal?",
  options: ["4", "8", "2", "16", "1"],
  a: 0,
  why: "Cada dígito hexadecimal representa quatro bits, por isso agrupar bits fica curto.",
};
assert.deepEqual(revisarPergunta(boa), [], "pergunta boa não pode ter erro");

// ---- cada defeito tem o seu motivo ----
const ruim = { q: "?", options: ["A", "a", ""], a: 9, why: "curta" };
const erros = revisarPergunta(ruim);
assert.ok(erros.some((e) => /enunciado curto/.test(e)), "enunciado curto não foi apontado");
assert.ok(erros.some((e) => /repete outra/.test(e)), "alternativa repetida não foi apontada");
assert.ok(erros.some((e) => /vazia/.test(e)), "alternativa vazia não foi apontada");
assert.ok(erros.some((e) => /fora da faixa/.test(e)), "resposta fora da faixa não foi apontada");
assert.ok(erros.some((e) => /explicação curta/.test(e)), "explicação curta não foi apontada");
assert.ok(revisarPergunta({ ...boa, why: `${boa.why} TODO` }).some((e) => /rascunho/.test(e)), "marca de rascunho não foi apontada");
assert.ok(revisarPergunta({ ...boa, options: ["Todas as alternativas", "A", "B"] }).some((e) => /ambígua/.test(e)), "alternativa ambígua não foi apontada");
assert.deepEqual(revisarPergunta(undefined), ["pergunta: enunciado curto (0 caracteres)", "pergunta: 0 alternativas, esperado de 3 a 6", "pergunta: resposta fora da faixa (undefined)", "pergunta: explicação curta ou ausente"], "pergunta vazia precisa de todos os erros");

// acento, hífen e vírgula mudam a alternativa: não são repetição
assert.deepEqual(
  revisarPergunta({ ...boa, options: ["mas", "más", "mais"], a: 0, why: boa.why }).filter((e) => /repete outra/.test(e)),
  [],
  "mas e más são alternativas diferentes",
);

// ---- a versão muda quando o conteúdo muda ----
assert.equal(hashDaPergunta(boa), hashDaPergunta({ ...boa }), "a versão precisa ser estável");
assert.match(hashDaPergunta(boa), /^[0-9a-f]{8}$/, "a versão é um hexadecimal de oito dígitos");
assert.notEqual(hashDaPergunta(boa), hashDaPergunta({ ...boa, a: 1 }), "mudar a resposta muda a versão");
assert.notEqual(hashDaPergunta(boa), hashDaPergunta({ ...boa, options: ["4", "8", "2", "16", "0"] }), "mudar alternativa muda a versão");

// ---- o banco de verdade ----
const banco = revisarBanco();
assert.ok(banco.total >= 800, `banco com ${banco.total} perguntas`);
assert.equal(banco.versoesUnicas, banco.total, "duas perguntas com a mesma versão");
assert.equal(banco.erros.length, 0, banco.erros.join("\n"));
assert.ok(banco.avisos.length < banco.total, "aviso em toda pergunta não informa nada");

// ---- o comando que o CI roda ----
const saida = execFileSync(process.execPath, [fileURLToPath(new URL("../tools/revisar-conteudo.mjs", import.meta.url))], { encoding: "utf8" });
assert.match(saida, /\d+ perguntas revisadas, \d+ versões únicas, 0 problema/, "o relatório do revisor mudou");

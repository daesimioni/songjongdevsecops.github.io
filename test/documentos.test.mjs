// Os documentos de conceito estão congelados com banner, o índice aponta para o
// mapa único e não se lê como backlog antigo, e o retrato de 2026-10-20 também
// avisa que é histórico. Sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";

const pasta = new URL("../docs/design/", import.meta.url);
const ler = (nome) => fs.readFileSync(new URL(nome, pasta), "utf8");

const conceitos = [
  "00-VISAO.md",
  "01-APRENDIZAGEM.md",
  "02-COMBATE.md",
  "03-ITENS.md",
  "04-BESTIARIO.md",
  "05-MUNDO.md",
  "06-ROADMAP.md",
  "07-DECISOES.md",
  "08-INTERFACE.md",
  "09-LORE.md",
  "10-ESTACOES.md",
  "11-ESTADO-2026-10-20.md",
  "12-CATALOGO.md",
  "13-ALMA-DAS-ILHAS.md",
];
for (const nome of conceitos) {
  const topo = ler(nome).slice(0, 700);
  assert.match(topo, /congelad[oa]/, `${nome} sem banner de congelado`);
  assert.match(topo, /39-BACKLOG-VERIFICADO\.md/, `${nome} sem o mapa de pendências`);
}

// O índice separa conceito, engenharia e histórico e manda para o 39.
const indice = ler("README.md");
assert.match(indice, /39-BACKLOG-VERIFICADO\.md/, "índice sem o mapa único");
assert.match(indice, /\.\.\/README\.md/, "índice sem o estado atual do jogo");
assert.match(indice, /conceito e desenho macro, congelado/i, "índice não marca o conceito como congelado");
assert.match(indice, /histórico/i, "índice não marca as auditorias como histórico");
assert.match(indice, /Decisões que dependem do dono/, "índice não aponta as decisões do dono");
assert.doesNotMatch(indice, /O que ainda precisa do dono/, "voltou a lista antiga de perguntas");
assert.doesNotMatch(indice, /O que vem depois do aval/, "voltou o plano pré-implementação");
assert.doesNotMatch(indice, /Regra de ouro[\s\S]{0,200}aval do dono/, "voltou a regra do aval pré-código");

// O retrato de 2026-10-20 avisa que é retrato, não lista de tarefas.
const retrato = ler("11-ESTADO-2026-10-20.md").slice(0, 700);
assert.match(retrato, /Documento histórico, congelado/, "o retrato não avisa que é histórico");
assert.match(retrato, /39-BACKLOG-VERIFICADO\.md/, "o retrato não aponta o mapa atual");

// O 39 continua sendo o mapa: ondas e decisões.
const mapa = ler("39-BACKLOG-VERIFICADO.md");
assert.match(mapa, /## Onda 1/, "o 39 perdeu a primeira onda");
assert.match(mapa, /Decisões que dependem do dono/, "o 39 perdeu as decisões do dono");

console.log(`ok documentos: ${conceitos.length} conceitos congelados, índice sem as listas antigas e 39 como mapa único`);

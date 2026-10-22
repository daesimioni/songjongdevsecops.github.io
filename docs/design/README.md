# The Learning Valley: conceito, engenharia e histórico

Esta pasta tem três camadas, e nenhuma delas substitui o
[`39-BACKLOG-VERIFICADO.md`](39-BACKLOG-VERIFICADO.md):

- **00 a 13, conceito e desenho macro, congelado.** Descrevem a intenção da data
  em que foram escritos. O `06-ROADMAP.md` e o `11-ESTADO-2026-10-20.md` são
  retratos daquele dia, não listas de tarefas.
- **14 a 19, engenharia atual.** Como o jogo é hoje, com medição e prova.
- **20 a 38, auditorias datadas.** O que foi encontrado e corrigido em cada
  passada. São histórico de trabalho, não pendências.

O estado atual do jogo está no [`../README.md`](../README.md). A lista única de
pendências verificadas e a de decisões do dono estão no
[`39-BACKLOG-VERIFICADO.md`](39-BACKLOG-VERIFICADO.md).

## 1. O jogo em uma página

Um arquipélago educativo em pixel art, jogado a pé, com sete disciplinas
(Computação, Matemática, Física, Química, Música, IA e Língua), duas camadas de
mundo (superfície e subsolo), cidades conurbadas, bestiário, equipamento,
magias, ofícios e um motor de aprendizagem por conceito. O combate é a pergunta;
o mundo responde ao entendimento. A inspiração é o Tibia na estrutura (mundo
aberto, bestiário, slots, magias, cidades, NPCs), não no grind nem na punição.

## 2. Ordem de leitura

0. [`39-BACKLOG-VERIFICADO.md`](39-BACKLOG-VERIFICADO.md): o mapa único do que
   falta, por onda e esforço, e as decisões abertas do dono.
1. `00-VISAO.md` a `13-ALMA-DAS-ILHAS.md`: conceito e desenho macro, congelados
   com banner no topo. `00-VISAO.md` traz a promessa; `01-APRENDIZAGEM.md` é o
   documento mais importante; `02-COMBATE.md` e `05-MUNDO.md` descrevem as duas
   metades do jogo.
2. `14-LEARNING-VALLEY.md` a `19-REVISAO-GERAL.md`: engenharia atual, com
   números medidos. O `19` é a revisão geral; o `14` fecha a entrada do jogo.
3. `20-AUDITORIA-PEDIDOS.md` a `38-OITO-DIRECOES.md`: auditorias datadas, com o
   defeito reproduzido e a correção. Leia como histórico, não como tarefa.

## 3. O que o jogo já decidiu no código

Os números abaixo são os verificados no `39`, não promessas de conceito:

- 86 áreas, 93 cavernas, 454 estações, 94 faróis e 54 travessias entre ilhas;
- 887 perguntas de duelo, 561 itens, 40 receitas, 12 encantos e 12 runas;
- 464 fichas de bestiário, 291 missões, 194 NPCs e 2.309 fichas de wiki;
- domínio de 0 a 5, revisão espaçada, grafo de pré-requisitos, dicas em escada
  e erro por distrator no caderno;
- morte suave, vocações com subcategorias, PvP opt-in e cronômetro desligado;
- pixel art 2D, site estático, sem dependência em runtime e sem pay-to-win;
- mapa grande, ferry pago ao Porto Submerso, elevador de volta, ciclo dia/noite,
  patrulha e perseguição dos bichos.

## 4. Decisões do dono (respondidas em 2026-10-22)

As 13 perguntas do `39` §"Decisões que dependem do dono" foram respondidas pelo
dono em 2026-10-22; as respostas estão registradas lá e o ciclo atual não tinha
pendência de código. O plano em execução está em
[`40-PLANO-EXECUCAO.md`](40-PLANO-EXECUCAO.md): Biblioteca Afogada, Grande Prova
e fio da Iara fechados; facções e guilda em curso. Reabrir uma resposta é uma
decisão nova, registrada no 39.

## 5. Como uma ideia entra no jogo

1. A ideia nasce como conceito nesta pasta ou numa conversa com o dono.
2. Se for pendência real, entra no `39` com esforço e estado, e ganha um teste ou
   uma sonda que prove o resultado.
3. Só então vira código. O que já está no jogo não volta a ser proposta.

## 6. Regra de ouro

O `39` é o mapa. Documento datado não é lista de tarefas. Se um documento antigo
e o `39` discordarem, valem o `39` e o código; se o código discordar do `39`, o
`39` é corrigido na mesma passada.

## 7. Nota de publicação

Esta pasta está versionada no repositório público. Os documentos registram o
desenho e seu histórico; propostas antigas não devem ser confundidas com o
estado implementado. As revisões com falhas reproduzidas e testes ficam nos
registros de auditoria, incluindo `29-CORRECOES-FUNCIONAIS.md`,
`30-COLISOES-INTERFACE-LOGICA.md`, `31-UI-UX.md`, `32-REVISAO-GERAL.md`,
`33-REVISAO-EXTERNA.md`, `34-HABILIDADES-CHEFE.md`, `35-REVISAO-FLUXOS.md`,
`36-REVISAO-ATUAL.md`, `37-ARTE-UNIFICADA.md`, `38-OITO-DIRECOES.md` e
`39-BACKLOG-VERIFICADO.md`.

- [41 — Revisão sistemática das colisões](41-COLISOES-SISTEMATICAS.md): perfis compartilhados, inspeção e regressões.

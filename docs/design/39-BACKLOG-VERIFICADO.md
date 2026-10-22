# Backlog verificado

Este é o mapa único do que ainda falta. Substitui a leitura dos documentos de
planejamento antigos como lista de tarefas: vários deles descrevem o jogo antes
de ele existir, com números que o código já superou.

## Método e estado atual

Auditoria read-only de 2026-10-22 cruzou os documentos 00 a 38 com `src/`,
`test/` e `tools/`. Números do código: 86 áreas, 454 estações, 93 cavernas, 541
itens, 464 fichas, 284 missões, 194 NPCs, 2.251 entradas de wiki, 887 perguntas
de duelo, 120 módulos e 71 testes node. `npm run validate` passa (lint,
contrato de módulos, testes e build) e a matriz de navegador dá 19/19.

Esforço: **P** até um dia, **M** de dois a cinco dias, **G** mais de uma semana.
Estado: **feito**, **parcial**, **ausente**, **decisão** (produto, não código).

## Onda 1: fechar o que é pequeno

| item | estado | o que falta | esforço |
|---|---|---|---|
| ritmo no parceiro + dano do próximo acerto | **feito** | previsão `~X` no duelo e no parceiro, sequência própria, erro zera | P |
| atalho da busca para a lista | **feito** | seta para baixo sai da busca e foca o primeiro resultado (wiki e viagem) | P |
| mochila em sessão longa | **medido** | 60,1 fps curta e 60,2 fps após 75 s, 18 a 19 MB, 0 tarefa longa; não reproduziu em headless, monitorar hardware real | P |
| régua de densidade tipográfica | parcial | piso de 11 px e linha 1.45 em `p, li, dd, dt, label` de painel, com teste; faltam os 131 rótulos menores fora do texto corrido | P |
| índice de estações acessível | **feito** | diário com `role=list`, grupo rotulado por área, nome e estado em cada estação e progresso `aria-live`; wiki tem a categoria Páginas com as 454 estações | P |
| estado vazio que ensina | **feito** | mochila, missões e bestiário dizem o próximo passo; diário mostra as estações por área | P |
| telegrafia do tema pelo chefe | **feito** | baralho guarda a área; chefe mostra `◆ próximo tema: <área>` na cor do continente, testado e medido no navegador | P |
| capa e conjuntos de 3 peças | **feito** | slot `cloak`, duas capas craftáveis, bônus de conjunto (+2 vida e +1 dano) em `equipmentBonus`, desenho atrás do corpo e aviso na ficha; `test/gear.test.mjs` e `cdp-capa.mjs` | P a M |
| ponto fraco do chefe após 2 acertos | **feito** | terceiro acerto seguido soma +1, com nota no feedback e teste no duelo real | P |
| recarga de runa no altar | **feito** | altar cura e devolve uma carga da runa aprendida mais vazia, com teste | P |
| documentos que mentem | **feito** | 03-ITENS, 05-MUNDO, 06-ROADMAP e 10-ESTACOES ganharam aviso de documento congelado apontando o README e este backlog; 14 §AB fecha com a medição e remete a este mapa | P |

## Onda 2: sistemas que já têm casa

| item | estado | o que falta | esforço |
|---|---|---|---|
| grafo de conceitos + domínio 0 a 5 + revisão espaçada + caderno | **núcleo feito** | domínio 0-5 no save, revisão espaçada por área, baralho prioriza vencido e caderno no diário; faltam arestas do grafo, misconceptions, formatos e prova de transferência | M a G |
| misconceptions e escolha adaptativa | parcial | um `why` por pergunta; falta erro por distrator e peso por domínio | M |
| dicas em escada e foco | **feito** | botão de dica no duelo: 1 mana por passo, passo 1 risca duas erradas, passo 2 risca mais uma, passo 3 revela a correta, zera na pergunta nova e leva o foco para a alternativa viva; `test/duelo-dica.test.mjs` e `cdp-dica.mjs` | M |
| formatos de pergunta e prova de transferência | ausente | hoje só A-E; decidir com o dono a colisão com "não há prova final" | G |
| ofícios por continente e mercador de troca | parcial | receitas globais, uma forja; separar ofício por continente e trocar material, sem leilão (decisão registrada) | M |
| magias, encantos e consumíveis no alvo do desenho | parcial | 6 runas, 3 encantos, 18 receitas, 10 consumíveis; alvo era 12 magias, 12 encantos, 9 poções e 15 comidas | M |
| famílias, variantes e fraqueza numérica | parcial | 16 espécies e 25 formas; falta entidade família, elite/antiga/eco, +50% de fraqueza e recompensa por completar | M |
| clima afetando spawn | parcial | clima existe e não muda a composição da caçada | M |
| audição, alerta, patrulha e perseguição | ausente | bicho só passeia; sem estados `?`/`!`, isca ou sono | M |
| escudo que barra erro e resistência por tipo | parcial | `equipmentBonus` só soma vida e dano; escudo real vem de runa/pet | M |
| party humana em combate | ausente | party social de 8 existe, duelo não junta humanos | G |
| passo de pet e idle por espécie | **feito** | gato e sapo alternam quatro patas, coruja/papagaio viram a cabeça, fada pulsa, grilo esfrega a pata, sombra ondula; `test/animacao-idle.test.mjs` [ao andar] alterna patas | M |
| gesto de NPC por papel | **feito** | guia aponta o caminho, monitor ergue a mão, mestre folheia livro; só parado e de frente, fase por posto (`npc.bob`), troca o braço em vez de somar; `test/gesto-npc.test.mjs` e `cdp-gesto-npc.mjs` | M |
| funções das peças temáticas | parcial | oficina/biblioteca/observatório são cenário sólido; dar reparo, página e revelar sala do chefe | M |
| tema de sala por área | parcial | tema por continente, não por área | M |
| teste de fluxo real de loja e duelo | parcial | duelo tem controlador com DOM mínimo; loja só teste estático | M |
| acessibilidade: voz, escala, daltonismo | parcial | teclado, foco e aria-live prontos; **voz feita** (botão ouvir/parar, pt-BR, testes e sonda); faltam escala de fonte e paleta para daltonismo | M |
| save versionado, migração e exportar/importar | parcial | névoa r2 e backup por DM; falta versão global e arquivo manual | M |
| linter de conteúdo | ausente | validação só em teste; falta revisor e versão por pergunta | M |
| ferries, elevadores, ciclo dia/noite, mapa grande, pontes por missão | ausente | skiff, túnel e 54 travessias fixas existem | M cada |
| arcos de NPC, murais e bilhetes | parcial | memória de visitas existe; falta arco e lore no mundo | M |
| presets de build na ficha | ausente | ficha monta peça por peça | P |

## Onda 3: conteúdo grande e endgame

| item | estado | o que falta | esforço |
|---|---|---|---|
| Grande Prova, Biblioteca Afogada, guilda | ausente | corrente de 7 missões, tela de escolha e biblioteca; guilda depende de camada social | G |
| arco principal em capítulos e lore da Iara | ausente | 284 missões geradas, sem arco narrativo | G |
| facções e reputação | ausente | nenhuma facção | G |
| planta de casa por disciplina/ilha | parcial | duas plantas por tipo; falta uma por continente/área | G |
| moeda Selo | ausente | preço em material; decisão de economia | G |
| editor de mapa e WebGL do mundo | ausente | ferramenta e render alternativo | M cada |
| grade de ilhas regular | parcial | catálogo nasce em malha 24x16; jitter exige regenerar o literal e revalidar 2.413 alvos | M |

## Decisões que dependem do dono

1. **Prova final**: o desenho 01 §13 pede exame por continente; o texto atual do
   jogo diz que não há prova final. Escolher um dos dois antes de implementar.
2. **Leilão**: os documentos 03 e 07 proíbem leilão global; o item de troca
   local por material é o que falta de verdade. Confirmar.
3. **Endgame e lore**: Grande Prova, Biblioteca, facções e arcos são semanas de
   conteúdo. Confirmar se entram agora ou ficam como fase seguinte.
4. **Nomes e tom**, **chefe do hub**, **variantes raras** e **bestiário em
   party** continuam como escolha de produto.

## Critério de pronto

Cada item acima só vira **feito** com teste ou sonda que falha sem ele, prova no
navegador quando for interface, `npm run validate` verde, commit, push e
verificação no site publicado.

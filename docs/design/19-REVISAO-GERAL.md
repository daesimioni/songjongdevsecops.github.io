# Revisão geral: tudo em três etapas

O objetivo é melhorar absolutamente tudo no jogo, peça por peça, em três etapas
(auditar, melhorar, auditar e melhorar de novo), com prova medida a cada onda.
Este documento é o estado durável da revisão: o que já passou, o que está em
andamento e o que falta.

## As seis frentes

| frente | o que entra | etapa 1 | etapa 2 | etapa 3 |
|---|---|---|---|---|
| arte por peça | 41 assets ambientais, 26 bichos + chefe, 561 itens, 194 NPCs, 7 pets | auditoria e variantes | detalhe e volume | animação própria |
| mapa | 86 ilhas, pontes, transições, cada bioma | auditoria de densidade | detalhe e unicidade | animação do lugar |
| interfaces | HUD, diário, ficha, mochila, bestiário, wiki, duelo, loja | auditoria de layout | densidade e leitura | microinteração |
| movimento | colisão, passos, câmera, animações | auditoria de área de choque | correção de fantasma | resposta ao toque |
| masmorras e batalha | 93 cavernas, monstros, duelos | auditoria de variedade | tema por sala e bicho | ritmo de combate |
| pedidos já feitos | tudo o que o diário dava como pronto | auditoria na fonte viva | correção do parcial | prova de navegador |

## Inventário auditado

- **Assets ambientais**: 41 peças em 6 grupos (solo 8, vegetação 8, construção
  8, fogo 5, água 4, props 8). Antes: 2 variantes por peça fora fogo e props.
- **Bichos**: 26 formas + chefe; `drawCreatureArt` com contorno e luz no mapa,
  duelo, bestiário e wiki.
- **Itens**: 561 ícones, 278 silhuetas, 38 famílias, contorno e luz gravados no
  cache.
- **Pessoas e pets**: jogador, 194 NPCs e 7 pets com contorno e luz; NPC tem
  papel (guardião, monitor, morador) e objeto do assunto na mão.
- **Mundo**: 86 áreas (70 de catálogo e 16 antigas), 454 estações, 94 faróis,
  93 cavernas e clareiras, 3.816 peças de ambiente, 72 casas com porta e
  interior.
- **Masmorras**: 93 plantas diferentes em 6 modelos, 4 acabamentos de piso,
  entrada embaixo, cidade no alto, chefe longe da boca e uma sala temática por
  disciplina (oficina, biblioteca ou observatório).

## Onda 1 — assets ambientais

| grupo | etapa 1 | etapa 2 | etapa 3 |
|---|---|---|---|
| vegetação | **feito**: 3 variantes por peça (24 silhuetas) | **feito**: espelho por instância | **feito**: verga com o vento (`swayAt`); sem quadro próprio |
| solo | **feito**: 3 variantes por peça (24) | **feito**: decalque espelhado | **feito**: `tufo` com 2 quadros |
| construção | **feito**: 3 variantes por peça (24), com oca redonda, casa com ala, torre com balcão, ruína em arco, galpão com alpendre, poço com balde, cerca com portão e doca em T | não espelha (porta e placa têm lado) | **feito**: rígida por regra, zero quadro e zero inclinação |
| fogo | **feito**: 2 variantes por peça, cova de brasa, braseiro pendurado, tocha de arandela, lanterna de poste e fumaça fina | **feito**: variantes por instância | **feito**: 5 de 5 tipos animam (4 a 8 quadros) |
| água | **feito**: 3 variantes nas três peças quietas e a espuma com 6 quadros | **feito**: espelho por instância | **feito**: espuma 6 quadros, junco e lírio 2 quadros |
| props | **feito**: 3 variantes nas quatro peças quietas, com barril deitado, saco aberto, caixote aberto e fardo redondo | **feito**: espelho nas peças de decoração | **feito**: gaivota com 4 quadros; mobília é estática de propósito |

Silhuetas do grupo: 24 + 24 + 24 + 10 + 10 + 19 = **111** (antes 69).

### Etapa 2 (mais única): espelho por instância

Vegetação, props, água e decalques de solo podem nascer espelhados: a semente da
posição decide, então três variantes viram até seis caras na mesma ilha sem
sprite novo. Construção não espelha (porta e placa têm lado) e o cisalhamento
do vento continua valendo na peça espelhada.

### Etapa 3 (animação): o chão e a beira respiram

Ramo de capim (`tufo`), junco d'água e lírio ganharam dois quadros: o capim
verga meio pixel, o junco balança a ponta e o lírio sobe e desce na ondulação.
A árvore já vergava com a rajada e o fogo já tinha 4 a 8 quadros.

## Registro

| data | onda | o que mudou | prova |
|---|---|---|---|
| 2026-10-21 | páginas antigas, levas 1 a 3 | Vinte e quatro páginas escritas à mão ganharam O que é, Como se usa e Onde quebra, passaram de 460 palavras e ficaram com seis partes | `test/licoes.test.mjs`, `cdp-pagina.mjs`, 33/33 suítes, 19/19 no navegador |
| 2026-10-21 | ritmo do duelo | +1 de dano com 3 acertos, +2 com 5 (teto); "se errar: X" com fase de chefe, haste e espelho; rodada e ritmo na tela; vida do bicho sem decimal | `test/duelo-ritmo.test.mjs`, `cdp-duelo-ritmo.mjs`, 33/33 suítes, 19/19 no navegador |
| 2026-10-21 | passada de interfaces | 9 painéis medidos em 1280 e 390, zero estouro horizontal e zero alvo abaixo de 28 px; abas da wiki e botões de ação cresceram; wiki de 1 coluna no celular; loja sem estouro | `test/interfaces.test.mjs`, `cdp-ui-audit.mjs`, 32/32 suítes, 19/19 no navegador |
| 2026-10-21 | animação de NPC e pet | cabeça parada olha em volta e cabeceia (46 px na cabeça, 0 no corpo); gato pisca e mexe a cauda (60 px na cauda, 13 no olho); passo do NPC confirmado | `test/animacao-idle.test.mjs`, `cdp-anim-idle.mjs`, 31/31 suítes, 19/19 no navegador |
| 2026-10-21 | salas temáticas | 93 cavernas com sala de assinatura: oficina (35), biblioteca (36) e observatório (22), três peças de cenário encostadas na parede e sólidas; miolo livre para o combate | `test/salas.test.mjs`, 30/30 suítes, 19/19 no navegador, sonda `cdp-sala-tema.mjs` |
| 2026-10-21 | contraste | sonda de contraste corrigida para fundo em gradiente e elemento coberto/fora da tela; 218 textos únicos em 10 estados e no 390 px, zero falha | `cdp-contraste.mjs`, autoteste do medidor, 0 falha |
| 2026-10-21 | colisão de cenário | 1.040 caixas novas em 12 tipos (árvore, pedra, barril, caixote, saco, fardo, cerca, poço, ruína, fogo); NPC usa a mesma colisão; caverna auditada no caminho de `state.solids` | `test/fantasmas.test.mjs`, 29/29 suítes, 19/19 no navegador, sonda andando contra barril e árvore |
| 2026-10-21 | construções e interiores | casa, cabana, torre e galpão com escala 2 e porta ampliada; fachada sólida; 72 casas entram em 4 salas fechadas com mobília por casa, mesa de estudo e fogo que descansa; fundo escuro e sem clima lá dentro | `test/casas.test.mjs`, 28/28 suítes, 19/19 no navegador, sonda ao vivo em 60 fps |
| 2026-10-21 | passagens das ilhas | 54 ligações entre ilhas: 31 istmos de terra com piso dos dois biomas, franja de areia e trilha de pedra, 23 pontes; decoração só em tile seco | `test/passagens.test.mjs`, 27/27 suítes, 19/19 no navegador |
| 2026-10-21 | totens e conteúdo | 6 silhuetas, 3 pedras e 3 bases por estação (54 combinações, distribuição medida); página sem frase repetida e sem resposta vazia; baralho do duelo cortado em A-E; auditoria dos pedidos em `20-AUDITORIA-PEDIDOS.md` | 26/26 suítes, 19/19 no navegador, contagem por estação |
| 2026-10-21 | mapa, floresta | árvore em bosque com teto por ilha, copa livre de caminho, totem, NPC e caçada; metrópole com 4 árvores só na beirada; 1.365 para 582 árvores | teste de floresta, 25/25 suítes, 19/19 no navegador, 60,3 fps |
| 2026-10-21 | assets, etapa 2 e 3 | espelho por instância nas peças de vegetação, props, água e solo; três peças pequenas ganharam dois quadros de animação; bicho da caverna ganhou porte próprio (0,90 a 1,06) | 24/24 suítes, 19/19 no navegador, 60,4 fps |
| 2026-10-21 | assets, etapa 1 | vegetação, solo, construção, água, props e fogo com 2 ou 3 variantes: 69 para 105 silhuetas; três variantes fracas foram refeitas depois da auditoria da folha de contato (doca em T, braseiro pendurado e palmeira curta) | folha de contato das 105, 24/24 suítes, 19/19 no navegador, 60,6 fps |
| 2026-10-21 | páginas antigas, levas 4 a 9 | as 69 páginas escritas à mão fecharam curso de seis partes e 460+ palavras; o teste deixou de ter conjunto de exceção e cobra todas | `test/licoes.test.mjs`, `cdp-pagina.mjs`, 54/54 suítes, 19/19 no navegador |
| 2026-10-22 | chefes | fase 2 ganhou habilidade própria e estável para os 93 chefes: couraça, seiva, ímpeto e espelho, com nome na tela e aviso da fase | `test/chefe-habilidades.test.mjs`, `cdp-chefe-habilidade.mjs`, 54/54 suítes, 19/19 no navegador |
| 2026-10-22 | revisão externa | PRs #1 a #4 auditadas no diff inteiro: 53 suítes, matriz 19/19, contraste 0 falha, 2.413 alvos de caverna, 72 casas; README alinhado e fórmula de dano duplicada removida | `docs/design/33-REVISAO-EXTERNA.md`, `npm test`, sondas de contraste e fonte |
| 2026-10-22 | assets, etapa 3 fechada | 41 assets e 111 silhuetas medidos; guarda de animação por grupo (fogo 5/5, água 3/4, solo, props, vegetação pelo vento, construção rígida) no teste de assets | `test/assets.test.mjs`, 54/54 suítes |
| 2026-10-22 | soleira das casas | as 72 portas ganharam degrau de pedra com três runas na cor da área, na fila do cenário; teste falha se a soleira sair ou perder a cor | `test/casas.test.mjs`, `cdp-soleira.mjs`, captura `soleira-casa-*` |
| 2026-10-22 | plantas das casas | cada tipo ganhou duas plantas (8 salas em bolsão de mar) e a semente da casa escolhe; as 72 casas usam as duas plantas do tipo | `test/casas.test.mjs`, `cdp-casa-planta.mjs`, captura `casa-planta-*` |
| 2026-10-22 | morador das casas | uma pessoa por casa, com roupa da área, canto livre perto do fogo e três falas (área, mesa/fogo, a pedra lá fora); interação por F e sem colisão | `test/casas.test.mjs`, `cdp-morador.mjs`, captura `morador-casa-*` |

## Fecho da revisão (2026-10-22)

As seis frentes passaram pelas três etapas com prova medida. O estado abaixo é
o que os testes e sondas desta data mostram, não o que o diário prometeu.

| frente | etapa 1 | etapa 2 | etapa 3 | prova |
|---|---|---|---|---|
| arte por peça | 41 assets, 111 silhuetas, 561 itens, 464 fichas, 194 NPCs e 7 pets com contorno e luz | espelho por instância, detalhe de meio pixel, portes e escalas | fogo 5/5, água 3/4, solo `tufo`, props `gaivota`, vegetação pelo vento, construção rígida; NPC olha/cabeceia e pet pisca | `test/assets.test.mjs`, `test/itens.test.mjs`, `test/bestiary.test.mjs`, `test/animacao-idle.test.mjs`, `cdp-anim-idle.mjs` (cabeça 46 px, corpo 0, cauda 60, olho 13) |
| mapa | 3.816 peças em 86 áreas, 454 estações e 94 faróis | 54 ligações (31 istmos, 23 pontes), floresta com teto, 72 casas com 8 plantas, soleira e morador | vento, mar com crista, clima por bioma; câmera e minimapa | `test/passagens.test.mjs`, `test/floresta.test.mjs`, `test/espaco.test.mjs`, `test/casas.test.mjs`, `cdp-soleira.mjs`, `cdp-casa-planta.mjs`, `cdp-morador.mjs` |
| interfaces | 9 painéis em 1280 e 390 | wiki 2.300 entradas, bestiário 464 fichas, ficha com atualização sem perder foco | foco/inert, teclado nas abas e no duelo A-E, busca com limpar e contagem, avisos acima da tela ativa | `test/interfaces.test.mjs`, `test/ui.test.mjs`, `test/wiki.test.mjs`, `cdp-ui-audit.mjs` (18 painéis, 0 estouro, 0 alvo < 28 px), `cdp-contraste.mjs` (108 textos, 0 falha), `cdp-fonte-ui.mjs` |
| movimento | 1.040 caixas em 12 tipos | zero fantasma em barril, árvore, móvel sorteado e interior; 2.413 alvos de caverna | oito direções, passo, câmera, turbo e toque | `test/fantasmas.test.mjs`, `test/interior-collision.test.mjs`, `test/dungeon-reachability.test.mjs`, `test/movement.test.mjs`, `cdp-fantasma.mjs` |
| masmorras e batalha | 93 cavernas em 6 modelos e 4 pisos | sala temática por disciplina com 279 peças sólidas; 93 chefes | ritmo +1/+2, leitura de turno, fases 2 e 3, habilidade própria por chefe, turnos de PvP | `test/masmorras.test.mjs`, `test/salas.test.mjs`, `test/duelo-ritmo.test.mjs`, `test/chefe-habilidades.test.mjs`, `test/pvp-turnos.test.mjs`, `cdp-chefe-habilidade.mjs`, `cdp-sala-tema.mjs` |
| pedidos já feitos | auditoria dos 38 pedidos na fonte viva | correção de resposta vazia, frase repetida, seis alternativas e páginas curtas | 69 páginas com curso completo, revisão das PRs externas e documentos alinhados | `docs/design/20-AUDITORIA-PEDIDOS.md`, `docs/design/33-REVISAO-EXTERNA.md`, `test/licoes.test.mjs`, `cdp-pagina.mjs` |

Prova de conjunto desta data: `npm test` com **92 testes em 95 arquivos, 92 passaram**;
matriz de navegador **19/19** remedida em 2026-10-22 depois de clima, sono, famílias,
texto maior, marcas do duelo, variantes, bilhetes, arcos, patrulha e perseguição e do desacoplamento
mundo→rendering (`cdp-regressao.mjs`: HUD, mochila 40, bestiário
464, wiki 2.300 em 15 abas, diário 86, viagem 96, névoa r2, caverna, câmera,
vida/mana, mapa recolhido, fps 60,5, 390 px sem estouro, console sem erro do jogo);
matriz de navegador **19/19** (60 fps, 0 erro de console, 0 estouro em 390 px);
contraste **0 falha**; fonte e transbordo **0 fora**. Sondas e capturas em
`temporarios/2026-10-20-mundo-song-pedido/`; site publicado conferido com cache
bust para os arquivos alterados.

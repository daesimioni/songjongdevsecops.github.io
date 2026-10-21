# Revisão geral: tudo em três etapas

O objetivo é melhorar absolutamente tudo no jogo, peça por peça, em três etapas
(auditar, melhorar, auditar e melhorar de novo), com prova medida a cada onda.
Este documento é o estado durável da revisão: o que já passou, o que está em
andamento e o que falta.

## As cinco frentes

| frente | o que entra | etapa 1 | etapa 2 | etapa 3 |
|---|---|---|---|---|
| arte por peça | 38 assets ambientais, 26 bichos + chefe, 538 itens, 194 NPCs, 7 pets | auditoria e variantes | detalhe e volume | animação própria |
| mapa | 86 ilhas, pontes, transições, cada bioma | auditoria de densidade | detalhe e unicidade | animação do lugar |
| interfaces | HUD, diário, ficha, mochila, bestiário, wiki, duelo, loja | auditoria de layout | densidade e leitura | microinteração |
| movimento | colisão, passos, câmera, animações | auditoria de área de choque | correção de fantasma | resposta ao toque |
| masmorras e batalha | 93 cavernas, monstros, duelos | auditoria de variedade | tema por sala e bicho | ritmo de combate |

## Inventário auditado

- **Assets ambientais**: 38 peças em 6 grupos (solo 8, vegetação 8, construção
  8, fogo 5, água 4, props 5). Antes: 2 variantes por peça fora fogo e props.
- **Bichos**: 26 formas + chefe; `drawCreatureArt` com contorno e luz no mapa,
  duelo, bestiário e wiki.
- **Itens**: 538 ícones, 277 silhuetas, 38 famílias, contorno e luz gravados no
  cache.
- **Pessoas e pets**: jogador, 194 NPCs e 7 pets com contorno e luz; NPC tem
  papel (guardião, monitor, morador) e objeto do assunto na mão.
- **Mundo**: 86 áreas (70 de catálogo e 16 antigas), 454 estações, 94 faróis,
  93 cavernas e clareiras, 3.790 peças de ambiente.
- **Masmorras**: 93 plantas diferentes em 6 modelos, 4 acabamentos de piso,
  entrada embaixo, cidade no alto, chefe longe da boca.

## Onda 1 — assets ambientais

| grupo | etapa 1 | etapa 2 | etapa 3 |
|---|---|---|---|
| vegetação | **feito**: 3 variantes por peça (24 silhuetas) | pendente | pendente |
| solo | **feito**: 3 variantes por peça (24) | pendente | pendente |
| construção | **feito**: 3 variantes por peça (24), com oca redonda, casa com ala, torre com balcão, ruína em arco, galpão com alpendre, poço com balde, cerca com portão e doca em T | pendente | pendente |
| fogo | **feito**: 2 variantes por peça, cova de brasa, braseiro pendurado, tocha de arandela, lanterna de poste e fumaça fina | pendente | pendente |
| água | **feito**: 3 variantes nas três peças quietas e a espuma com 6 quadros | pendente | pendente |
| props | **feito**: 3 variantes nas quatro peças quietas, com barril deitado, saco aberto, caixote aberto e fardo redondo | pendente | pendente |

Silhuetas do grupo: 24 + 24 + 24 + 10 + 10 + 13 = **105** (antes 69).

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
| 2026-10-21 | totens e conteúdo | 6 silhuetas, 3 pedras e 3 bases por estação (54 combinações, distribuição medida); página sem frase repetida e sem resposta vazia; baralho do duelo cortado em A-E; auditoria dos pedidos em `20-AUDITORIA-PEDIDOS.md` | 26/26 suítes, 19/19 no navegador, contagem por estação |
| 2026-10-21 | mapa, floresta | árvore em bosque com teto por ilha, copa livre de caminho, totem, NPC e caçada; metrópole com 4 árvores só na beirada; 1.365 para 582 árvores | teste de floresta, 25/25 suítes, 19/19 no navegador, 60,3 fps |
| 2026-10-21 | assets, etapa 2 e 3 | espelho por instância nas peças de vegetação, props, água e solo; três peças pequenas ganharam dois quadros de animação; bicho da caverna ganhou porte próprio (0,90 a 1,06) | 24/24 suítes, 19/19 no navegador, 60,4 fps |
| 2026-10-21 | assets, etapa 1 | vegetação, solo, construção, água, props e fogo com 2 ou 3 variantes: 69 para 105 silhuetas; três variantes fracas foram refeitas depois da auditoria da folha de contato (doca em T, braseiro pendurado e palmeira curta) | folha de contato das 105, 24/24 suítes, 19/19 no navegador, 60,6 fps |

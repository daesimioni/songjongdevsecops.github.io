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
| solo | pendente | pendente | pendente |
| construção | pendente | pendente | pendente |
| fogo | 5 peças animadas; auditar quadros | pendente | pendente |
| água | 7 variantes; auditar ondulação | pendente | pendente |
| props | 9 variantes; auditar gaivota e barril | pendente | pendente |

## Registro

| data | onda | o que mudou | prova |
|---|---|---|---|
| 2026-10-21 | assets, vegetação, etapa 1 | terceira variante em árvore, conífera, palmeira, seca, arbusto, junco, florada e trepadeira: 16 para 24 silhuetas | folha de contato com as 24, teste de assets e 24/24 suítes |

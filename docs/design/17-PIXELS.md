# Pixel fino e animação

A câmera subiu para 2,0 (1,6 em tela pequena) e a **densidade de desenho**
dobrou: cada pixel antigo de arte virou quatro pixels de desenho, e o que era
estático ganhou movimento. O tile agora tem 32 px na tela em vez de 25,6, e a
arte em 2x cai quase 1:1 no dispositivo: o detalhe de meio pixel aparece.

## Sprite em 2x

`js/assets/index.js` pinta o sprite num canvas de `w*2` por `h*2` com o contexto
escalado em 2 e copia no **mesmo tamanho de mundo**. Como a tela desenha a 3,2
pixels de dispositivo por pixel de mundo (dpr 2 × zoom 1,6), a fonte em 2x chega
à tela sem perder o detalhe: o desenho de meio pixel aparece.

A árvore folhuda, a conífera, a palmeira e as construções usam passo de **0,5
pixel** no contorno e nas texturas (casca, telha, junta de pedra, palha). O
`elipseFina()` de `js/assets/vegetacao.js` desenha a copa em linhas de meio
pixel, com chiado no contorno, e a copa ganha moitas de folha em dois tons.

## Chão

O chão continua em bloco de 16x16 tiles (cache de 48 blocos, ~12,6 MB), mas o
quadro passa duas camadas de detalhe de meio pixel por cima: uma marca escura de
1 px e uma clara de 0,5 px por tile, sorteadas por hash. Foi a solução que deu
textura fina sem inflar o cache de chão: a versão em canvas 2x custava quadro na
hora de andar, e a memória ia a 20 MB.

## Animação

| O que | Antes | Agora |
|---|---|---|
| fogueira / braseiro | 4 quadros | 8 quadros |
| tocha | 3 | 6 |
| fumaça | 4 | 6 |
| espuma | 3 | 6 |
| gaivota | 2 | 4 |
| capim | só na rajada | balança sempre (mais forte na rajada) |
| água | tile animado | tile + brilho de meio pixel viajando |
| árvore/arbusto | estático | verga com a rajada (cisalhamento no pé) |
| boneco | passada | respira parado, pisca, quique no passo |
| olho (bicho) | parado | pisca |
| tocha da caverna | halo fixo | halo tremula |

## Custo medido (1280x757, headless)

| Medida | Antes | Depois |
|---|---|---|
| desenho do quadro no vale | ~2,3 ms | ~2,9 ms |
| desenho do quadro na caverna | 0,52 ms | 0,56 ms |
| fps parado | 60,5 | 60,5 |
| andando (16 tiles em 3,2 s) | 56,9 fps / p95 30,3 ms | 59,7 fps / p95 30,3 ms |
| memória do chão | 12,6 MB | 12,6 MB |
| cache de sprite | 240 sprites | 240 sprites em 2x (~5 MB) |

O andar ficou até mais leve que antes: com menos tiles na tela, o detalhe novo
cabe no mesmo orçamento. A resolução forçada em 2x foi testada e recusada: em
tela comum derrubava para 51 fps; o dpr continua seguindo o aparelho e o ganho
vem da arte em 2x com a câmera em 2,0.

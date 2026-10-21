# Assets ambientais

A biblioteca que dá corpo às ilhas fora do Porto do Início. Antes dela, cada
ilha era laje de bioma com ícone de conceito em cima; agora tem vegetação,
construção, fogo, beira d'água e props, com a paleta do bioma e desenho só do
que está na vista.

## Grupos

| Grupo | Arquivo | Assets |
|---|---|---|
| solo | `js/assets/solos.js` | pedra, rachadura, raiz, poça, tufo, folhada, cogumelo, musgo |
| vegetação | `js/assets/vegetacao.js` | árvore, conífera, palmeira, seca, arbusto, junco, florada, trepadeira |
| construção | `js/assets/construcoes.js` | cabana, casa, torre, ruína, galpão, poço, cerca, doca |
| fogo | `js/assets/fogo.js` | fogueira, braseiro, tocha, lanterna, fumaça |
| água | `js/assets/agua.js` | pedra molhada, junco d'água, espuma, lírio |
| props | `js/assets/props.js` | barril, saco, caixote, fardo, gaivota |
| ícones | `js/assets/icones.js` | os 36 enfeites de conceito (livro, frasco, terminal, guindaste, sino...) que antes moravam no renderer |

Cada asset declara `w`, `h`, `variantes`, `quadros`/`ms` quando anima e uma
função `desenhar(g, paleta, variante, quadro)`. O contrato é cobrado por
`test/assets.test.mjs`: tamanho dentro de 64x64, variante válida, animação com
duração e função de desenho.

## Paleta

`paletaDaArea(bioma)` em `js/assets/nucleo.js` monta a paleta a partir do
bioma da área: o material tinge tronco, pedra e telha; o acento da disciplina
tinge folha, tecido, metal e chama. A mesma árvore parece de giz numa ilha e de
cobre em outra sem arte nova. A paleta é calculada uma vez por bioma e
reaproveitada.

## Cache

`js/assets/index.js` pinta cada sprite uma vez por `(tipo, variante, bioma,
quadro)` num canvas fora de tela e guarda num cache LRU de **240 sprites**. O
quadro só faz `drawImage`. O teto prende a memória mesmo depois de visitar as
86 ilhas; medido: o cache chega ao teto depois de duas ilhas e para ali.

## Colocação

`js/assets/povoado.js` roda na geração do mundo e devolve `world.ambiente`.
Regras:

- construção e ruína entram primeiro, na coroa da ilha; vegetação entra depois
  e respeita o espaço delas;
- nada em cima de caminho, praça, ponte, parede ou água (gaivota e fumaça
  flutuam; braseiro fica na borda da praça);
- vegetação com pelo menos um tile de folga entre uma peça e outra;
- ilha pequena completa o piso mínimo de 8 peças com decalque de chão;
- braseiros nas diagonais do farol, fogueira e props junto da construção,
  doca na costa que oferece água a leste.

Medido no mundo inteiro: **2.416 peças em 86 áreas** (mínimo 8, mediana 21),
**82 construções**, **837 árvores**, **30 docas**, **43 fogueiras**, **115
braseiros**. Nada colide: a malha de caminhada é a mesma de antes.

## Desenho no quadro

`js/render.js` desenha o decalque de chão chapado antes das entidades e o que
tem volume na fila ordenada por y. A camada inteira é culled pelo retângulo da
câmera (`js/camera.js`). Fogueira e braseiro acendem um brilho pulsante antes do
sprite. Animação fica em quadro cacheado, com o relógio da cena escolhendo o
quadro: fogueira, braseiro, tocha, lanterna, fumaça, espuma e gaivota.

## Desempenho medido (1280x757, navegador headless)

| Medida | Valor |
|---|---|
| peças visíveis por quadro | 49 a 90 |
| custo de desenho do quadro | 3,0 a 4,2 ms (chão + ambiente) |
| fps | 59,8 a 60,6 |
| cache de sprites | 240 no teto, estável |
| exceções no console | 0 |

A vegetação verga com a rajada do lugar: o renderer passa a inclinação e o
sprite é desenhado com um cisalhamento no pé, sem criar quadro de cache por
posição de vento. Medido: 759 canais de pixel diferentes entre inclinação zero e
0,05.

Não há atlas de sprite: `drawImage` de canvas pequeno é o caminho barato no
canvas 2D e o cache já evita repintura.

# Auditoria dos pedidos: o que foi feito de verdade

Pedido do dono em 2026-10-21: revisitar os pedidos dados como feitos, porque
muita coisa ficou de fora. A regra desta auditoria é simples: **pedido só conta
como feito com prova viva** (teste que roda, arquivo publicado, captura), nunca
com a linha do diário dizendo que foi feito.

## O que foi conferido e está de pé

| pedido | prova viva | veredito |
|---|---|---|
| wiki com 2.246 fichas em 15 categorias | `test/wiki.test.mjs` e a matriz abre o índice | feito |
| 538 itens desenhados, 277 silhuetas | `test/itens.test.mjs` | feito |
| bestiário com 464 criaturas e 93 chefes | matriz de navegador | feito |
| vida e mana acima do herói, no vale e na caverna | `test/vitais.test.mjs` e matriz | feito |
| câmera única no vale e na caverna | `test/camera.test.mjs` | feito |
| 454 estações e 94 faróis alcançáveis a pé | `test/colisao.test.mjs` | feito |
| oito direções em tudo | `test/costas.test.mjs` | feito |
| equipamento acompanha mão e passo | `test/gear.test.mjs` | feito |
| masmorras com seis plantas e quatro pisos | `test/masmorras.test.mjs` | feito |
| névoa versionada `r2` | leitura e gravação em `js/app.js`, save antigo migra | feito |
| mapa não some com a nave | `skiffRear` importado em `render.js` e `skiff.js` | feito |
| arrasto do minimapa de agarrar e puxar | sinal em `render.js` e `test/pixels.test.mjs` | feito em 2026-10-21 20:09 |
| floresta organizada, sem mata na metrópole | `test/floresta.test.mjs` e captura | feito em 2026-10-21 20:06 |
| áreas sem coisa empilhada | `test/espaco.test.mjs` | feito em 2026-10-21 20:16 |
| totens com silhueta própria | contagem por estação: 6 silhuetas, 3 pedras, 3 bases | feito em 2026-10-21 20:23 |
| acessos às ilhas variados, não só ponte sobre o mar | `test/passagens.test.mjs`: 31 istmos de terra e 23 pontes nas 54 ligações, 0 ponto de água aberta; captura do istmo e da ponte em `temporarios/2026-10-20-mundo-song-pedido/` | feito em 2026-10-21 20:33 |
| cabanas ridículas, desproporcionais e sem entrada | `test/casas.test.mjs`: escala 2 em casa, cabana, torre e galpão, 72 fachadas com porta livre e parede sólida, 4 salas fechadas com mesa, fogo e cama; sonda entra, estuda, descansa e sai | feito em 2026-10-21 21:02 |
| colisão de fantasma no mundo | `test/fantasmas.test.mjs`: 1.040 caixas de cenário em 12 tipos (árvore, pedra, barril, caixote, saco, fardo, cerca, fogo); sonda `cdp-fantasma.mjs` anda contra barril e árvore e para; caverna auditada no código (altar, forja, pedra, horta, veio, encantador e baú sólidos) | feito em 2026-10-21 21:10 |

## O que a auditoria pegou de errado

| pedido | o que havia de fato | correção |
|---|---|---|
| "cinco opções A-E, resposta embaralhada" | o banco escreve seis alternativas e o duelo renderizava **seis**, com a letra F aparecendo | `cortaCinco` no baralho: nunca mais de cinco, resposta sempre dentro, teste no `licoes.test.mjs` |
| "páginas sem resposta vazia" | 183 páginas tinham "a resposta é ." | corrigido em 2026-10-21 17:00; auditoria agora dá 0 |
| "conteúdo sem repetição" | 30 páginas repetiam a mesma frase (banco e lição) | frase repetida caiu para 0; lições curtas ganharam parágrafo próprio |

## O que continua em aberto (nada disso vai ser marcado como feito antes da prova)

1. **Animação de NPC e pet**: hoje só respiram; falta passo, cabeceio e o bicho
   de companhia andando com o dono.
2. **69 páginas escritas à mão** do vale e das áreas antigas: continuam com
   quatro partes e 255 a 469 palavras; falta o curso de seis partes do catálogo.
3. **Tema de sala por disciplina** nas masmorras: piso e marca já variam, mas
   forja, biblioteca e observatório ainda não têm sala própria.
4. **Sistema de batalha**: falta ritmo, habilidade de chefe e leitura de turno;
   hoje o duelo é pergunta com vida.
5. **Passada de interfaces**: HUD, diário, ficha, mochila e loja ainda não
   passaram pela auditoria de densidade e leitura.
6. **Contraste**: o pedido "544 textos sem falha" não tem teste vivo; precisa de
   uma varredura de contraste no navegador que possa rodar toda vez.
7. **Etapa 2 e 3 dos assets**: vegetação, solo, construção, água, props e fogo
   já têm variantes; falta fechar animação própria de cada grupo.

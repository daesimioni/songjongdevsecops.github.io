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
| névoa versionada `r2` | leitura e gravação em `src/app/app.js`, save antigo migra | feito |
| mapa não some com a nave | `skiffRear` importado em `render.js` e `skiff.js` | feito |
| arrasto do minimapa de agarrar e puxar | sinal em `render.js` e `test/pixels.test.mjs` | feito em 2026-10-21 20:09 |
| floresta organizada, sem mata na metrópole | `test/floresta.test.mjs` e captura | feito em 2026-10-21 20:06 |
| áreas sem coisa empilhada | `test/espaco.test.mjs` | feito em 2026-10-21 20:16 |
| totens com silhueta própria | contagem por estação: 6 silhuetas, 3 pedras, 3 bases | feito em 2026-10-21 20:23 |
| acessos às ilhas variados, não só ponte sobre o mar | `test/passagens.test.mjs`: 31 istmos de terra e 23 pontes nas 54 ligações, 0 ponto de água aberta; captura do istmo e da ponte em `temporarios/2026-10-20-mundo-song-pedido/` | feito em 2026-10-21 20:33 |
| cabanas ridículas, desproporcionais e sem entrada | `test/casas.test.mjs`: escala 2 em casa, cabana, torre e galpão, 72 fachadas com porta livre e parede sólida, 4 salas fechadas com mesa, fogo e cama; sonda entra, estuda, descansa e sai | feito em 2026-10-21 21:02 |
| colisão de fantasma no mundo | `test/fantasmas.test.mjs`: 1.040 caixas de cenário em 12 tipos (árvore, pedra, barril, caixote, saco, fardo, cerca, fogo); sonda `cdp-fantasma.mjs` anda contra barril e árvore e para; caverna auditada no código (altar, forja, pedra, horta, veio, encantador e baú sólidos) | feito em 2026-10-21 21:10 |
| contraste vivo em todos os estados | sonda `cdp-contraste.mjs` corrigida (gradiente mais próximo e elemento coberto/fora da tela): 218 textos únicos em 10 estados mais 390 px, **0 falha**; autoteste confirma que o medidor acha um par ruim | feito em 2026-10-21 21:20 |
| sala temática por disciplina nas masmorras | `test/salas.test.mjs`: 93 cavernas com sala própria (oficina 35, biblioteca 36, observatório 22), 279 peças de cenário encostadas nas paredes, com caixa sólida; sonda `cdp-sala-tema.mjs` abre uma de cada e fotografa | feito em 2026-10-21 21:29 |
| animação de NPC e pet | `test/animacao-idle.test.mjs` e sonda `cdp-anim-idle.mjs`: cabeça parada mexe 46 px e o corpo 0 (olhar/cabeceio), cauda do gato 60 px e olho 13 px (piscada); o passo do NPC já existia e a sonda confirma | feito em 2026-10-21 21:33 |
| passada de interfaces | sonda `cdp-ui-audit.mjs` mede 9 painéis em 1280 e 390: 0 estouro horizontal, 0 alvo abaixo de 28 px, foco dentro do painel; abas da wiki e botões de ação cresceram, wiki virou 1 coluna no celular e a loja perdeu o estouro de 3 px | feito em 2026-10-21 21:45 |
| ritmo e leitura de turno no duelo | `test/duelo-ritmo.test.mjs`: +1 dano com 3 acertos e +2 com 5 (teto), "se errar: X" com fase/haste/espelho; sonda `cdp-duelo-ritmo.mjs` mostrou rodada, previsão e "ritmo 3: +1 de dano" depois de três acertos; vida do bicho deixou de mostrar decimal | feito em 2026-10-21 21:51 |
| páginas antigas, levas 1 a 3 de 24 | `blocoDeEstudo` ganhou O que é / Como se usa / Onde quebra; 24 páginas passaram de 460 palavras e seis partes (as 16 anteriores mais rainbow, periodic, concord, registers, security, statistics, bonds e energy); sonda `cdp-pagina.mjs` mediu 466 e 482 palavras nas duas últimas com as seis seções | feito em 2026-10-21 22:08 |

## O que a auditoria pegou de errado

| pedido | o que havia de fato | correção |
|---|---|---|
| "cinco opções A-E, resposta embaralhada" | o banco escreve seis alternativas e o duelo renderizava **seis**, com a letra F aparecendo | `cortaCinco` no baralho: nunca mais de cinco, resposta sempre dentro, teste no `licoes.test.mjs` |
| "páginas sem resposta vazia" | 183 páginas tinham "a resposta é ." | corrigido em 2026-10-21 17:00; auditoria agora dá 0 |
| "conteúdo sem repetição" | 30 páginas repetiam a mesma frase (banco e lição) | frase repetida caiu para 0; lições curtas ganharam parágrafo próprio |

## Fechado desde a auditoria (com prova)

| item | prova |
|---|---|
| **69 de 69 páginas escritas à mão** com curso de seis partes e 460+ palavras | `test/licoes.test.mjs` cobra as 69 sem conjunto de exceção; sonda `cdp-pagina.mjs` mediu `timbre` 470, `optics` 472, `cpu` 467, `infinity` 467, `crypto` 466 e `poetry` 481 palavras com as seis seções |
| **Habilidade única de chefe** | `test/chefe-habilidades.test.mjs`: quatro habilidades estáveis em 93 chefes, com couraça, seiva, ímpeto e espelho medidas no RPG real; sonda `cdp-chefe-habilidade.mjs` mostra o nome na tela e o aviso da fase 2 |
| **Etapa 2 e 3 dos assets** | `test/assets.test.mjs` mede 41 assets, 111 silhuetas e a animação de cada grupo: fogo 5 de 5, água 3 de 4, solo `tufo`, props `gaivota`, vegetação pelo vento e construção rígida; guarda falha se um grupo perder a animação |

## Fechamento

Nada nesta auditoria. As dívidas de casas (`22-CASAS.md` §7) fecharam: mobília
sólida, morador e soleira em 2026-10-22, e a segunda planta por tipo na mesma
data. O que resta nos documentos são refinamentos opcionais, sem defeito
conhecido.

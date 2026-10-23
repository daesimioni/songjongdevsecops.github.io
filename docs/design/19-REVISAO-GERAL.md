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
| 2026-10-22 | revisor de conteúdo | ferramenta fora do teste revisa as 887 perguntas do índice com contexto (`continente/dificuldade#posição`); pega duplicata global, alternativa ambígua, rascunho e resposta fora da faixa; cada pergunta ganha versão FNV-1a estável | `test/revisor-conteudo.test.mjs`, `npm run check:conteudo`, 93/93 suítes |
| 2026-10-22 | erro por distrator | o duelo guarda a alternativa marcada com a versão FNV da pergunta (teto 120, purga, janela 7 dias), mostra "Você marcou: X" e o caderno lista os erros recentes com a resposta; a pergunta errada volta antes no mesmo domínio | `test/distratores.test.mjs`, `cdp-distratores.mjs`, 94/94 suítes |
| 2026-10-22 | mapa grande | o minimapa ganhou modo tela cheia sem segundo desenho: canvas 600x400 para 1200x800, 1.256x733 da tela 1.280x757, botão com aria-pressed, Esc devolve ao canto e o estado recolhido volta | `test/mapa-grande.test.mjs`, `cdp-mapa-tela.mjs`, 95/95 suítes |
| 2026-10-22 | ferry do porto | a lista de pedras no hub ganha a travessia paga ao Porto Submerso por 2 de madeira petrificada; sem material o botão fica desabilitado e diz o que falta, com material cobra e desce à camada -2, com fala do barqueiro na chegada | `test/ferry.test.mjs`, `cdp-ferry.mjs`, 96/96 suítes, viagem 96 -> 97 |
| 2026-10-22 | grafo de pré-requisitos | 78 arestas entre as 86 áreas, derivadas da numeração do catálogo (1.1 -> 1.2), com uma raiz por grupo; o caderno mostra "Antes de avançar" quando a área está em 2+ e o pré-requisito em 0/1, com nomes e domínios | `test/grafo.test.mjs`, `cdp-grafo.mjs`, 97/97 suítes |
| 2026-10-22 | elevador do Porto Submerso | a praça da camada -2 ganha o elevador desenhado (plataforma, cordas e alavanca) que sobe à pedra do Porto do Início, sem passar pela boca de uma caverna; arte nova e saída própria no `onExit` | `test/elevador.test.mjs`, `cdp-elevador.mjs`, 98/98 suítes |
| 2026-10-22 | documentos aposentados | o índice da pasta perde as listas antigas de perguntas e o plano pré-implementação, separa conceito, engenharia e histórico e aponta o 39; o retrato de 2026-10-20 ganha o banner histórico; 14 banners cobrados por teste | `test/documentos.test.mjs`, 99/99 suítes |
| 2026-10-22 | escopo aposentado | editor de mapa, WebGL e jitter das ilhas ficam de fora com justificativa medida: o mundo é gerado e testado, o Canvas 2D faz 60,2 fps e o jitter exigiria revalidar 2.413 alvos e 54 ligações | 60,2 fps, 19/19, `test/dungeon-reachability.test.mjs`, `test/passagens.test.mjs` |
| 2026-10-22 | escopo de jogo aposentado | pontes por missão, party em combate e planta por área passam a decisão com justificativa: o mapa não tem mais item ausente ou parcial de código, só as decisões do dono e a resistência por tipo | `test/passagens.test.mjs`, `test/casas.test.mjs`, `test/party-proof.test.mjs`, 99/99 suítes |
| 2026-10-22 | decisões do dono respondidas | as 13 perguntas do 39 foram respondidas (12 de produto e as 4 de escopo confirmadas); o doc 01 §13 ganhou a nota "sem prova final" e o plano do próximo ciclo abriu em `40-PLANO-EXECUCAO.md` | `test/documentos.test.mjs`, 39 e 40 |
| 2026-10-22 | PR #9, colisões e passagens | colisões alinhadas aos assets e movimento, passagens e chegadas corrigidos; 2 testes novos (`collision-profiles`, `landing-collision`) e a ferramenta `render-collisions`; base do plano 40 | `test/colisao.test.mjs`, `test/collision-profiles.test.mjs`, `test/landing-collision.test.mjs`, 101/101 suítes |
| 2026-10-22 | Biblioteca Afogada, corrente | as 7 missões estão no guia com cadeia, metas, save e o título final; a sonda achou o `progress` de docas usando `.size` num array, que travava a missão "Sete faróis", e corrigiu | `test/biblioteca.test.mjs`, `test/content.test.mjs`, 102/102 suítes |
| 2026-10-22 | Biblioteca Afogada, acervo | a corrente abre o acervo com três alas: 454 conceitos, 179 de lore e 7 treinos; busca sem acento, página, wiki e treino, e o cartão do guia mostra a porta | `test/acervo.test.mjs`, `cdp-acervo.mjs`, 103/103 suítes, 19/19 no navegador |
| 2026-10-22 | Grande Prova | o guardião do acervo é chefe de 18 de vida com fases 1-3; a vitória abre os três desfechos, a escolha fica no save e no acervo, e não há exame nem reprovação | `test/grande-prova.test.mjs`, `cdp-grande-prova.mjs`, 104/104 suítes, 19/19 no navegador |
| 2026-10-22 | Fio da Iara | sete capítulos com missão-marco, lore e fala do guia; o diário mostra lido, aberto e bloqueado, a leitura grava no save e a wiki ganhou a ficha (2.309 entradas) | `test/arcos-historia.test.mjs`, `cdp-arco-capitulo.mjs` (13/13), 105/105 suítes, 19/19 no navegador |
| 2026-10-22 | Facções e reputação | Concílio, União e Porto de -3 a +3; missão e desfecho movem os atos, o save guarda, o título de aliado sai no +2, o Porto muda o preço da loja e o Concílio abre a estante reservada | `test/faccoes.test.mjs`, `cdp-faccao.mjs` (14/14), 106/106 suítes, 19/19 no navegador |
| 2026-10-22 | Guilda e party | a sede local com nome e brasão, quadro de oito membros e cargos, recrutamento pela party, quatro missões que leem o save, diário e o título de Guardião da Sede | `test/guilda.test.mjs`, `cdp-guilda.mjs` (15/15), 107/107 suítes, 19/19 no navegador |
| 2026-10-22 | Placa do herói | a vida e a mana ficaram acima do nome, com a mesma folga entre as duas barras, delas para o nome e do nome para a cabeça; a placa é de tela, tamanho fixo e desenhada por último, por cima da noite e da vinheta da casa; a mesma no vale e na caverna, com nome e barras de folgas iguais e barra fixa na metade do nome máximo | `test/vitais.test.mjs`, `cdp-vitais-layout.mjs` (10/10), `cdp-placa-caverna.mjs` (7/7), 108/108 suítes, 19/19 no navegador |
| 2026-10-22 | Atualização sem relogar | o site publica `versao.json` a cada push; o cliente confere a cada minuto e no foco, mostra o aviso com botão, baixa os arquivos com `cache: reload` e recarrega voltando ao mundo na mesma posição, sem título e sem formulário | `test/atualizacao.test.mjs`, `cdp-atualizacao.mjs` (15/15), 109/109 suítes, 19/19 no navegador |
| 2026-10-22 | Fontes locais | as woff2 de Press Start 2P e Silkscreen saíram do Google e moram no repo, com preload; a preferência de texto maior é aplicada antes do primeiro desenho, então a fonte não troca no load | `test/fontes.test.mjs`, `cdp-fontes.mjs` (12/12), 110/110 suítes, 19/19 no navegador |
| 2026-10-22 | Andar na diagonal | o boneco ganhou pose 3/4 de verdade: tronco inclinado para o lado do passo, ombro de trás com um pixel e cabeça virada dois pixels; de costas a nuca é cabelo, não a face, e as oito direções diferem entre si | `test/diagonal.test.mjs`, `cdp-avatar-diag.mjs` (oito poses), 111/111 suítes, 19/19 no navegador |
| 2026-10-22 | Tempo e calendário | o relógio do jogo corre 60x (1 minuto real = 1 hora), o dia tem 24 minutos reais, o calendário é gregoriano desde 18/01/1997 e o HUD mostra data, hora, estação e dia/noite; as quatro estações têm cor e partículas, e chuva, tempestade, tornado, eclipse e neve mexem no céu e no chão | `test/calendario.test.mjs`, `test/dia-noite.test.mjs`, `test/ambiente.test.mjs`, `cdp-calendario.mjs` (14/14), 112/112 suítes, 19/19 no navegador |
| 2026-10-22 | Foco do botão | botão usado com o mouse perde o foco depois do clique e modal aberto no mouse devolve o foco ao jogo, então o Espaço liga a nave em vez de repetir o botão; a ativação por teclado continua igual | `test/interfaces.test.mjs`, `cdp-foco.mjs` (11/11), 112/112 suítes, 19/19 no navegador |
| 2026-10-22 | Malha P2P entre jogadores | o broker apresenta as pessoas e cada par abre um canal WebRTC direto; posição vai por canal não confiável a 10 Hz e eventos por canal confiável, com repasse ttl 2, dedupe por uid e broker de reserva; a espera de peer subiu para 12 s; o teste de duas abas derruba o broker de um lado e a posição continua chegando pelo canal direto | `test/malha.test.mjs`, `cdp-malha.mjs` (10/10), 113/113 suítes, 19/19 no navegador |
| 2026-10-22 | Vida e mana dos pares | vida, mana e máximos viajam no mesmo pacote da posição; cada par desenha a placa do outro no fim do quadro, com as mesmas barras e transparência, então todo mundo vê a vida e a mana de todo mundo | `test/vitais.test.mjs`, `cdp-malha.mjs` (12/12), 113/113 suítes, 19/19 no navegador |
| 2026-10-22 | Caderno do viajante | uma capa para diário, ficha, mochila, bestiário e wiki, com índice lateral e abas internas (missões/registro, resumo/equipamento/perícias/forja); o bestiário ganhou atalho por continente e a wiki pôs as categorias na coluna; o HUD virou três menus (falar, rede, caderno), as missões em andamento subiram para um card clicável e os primeiros passos recolheram | `test/interfaces.test.mjs`, `cdp-caderno-novo.mjs` (cinco páginas), `cdp-ui-audit.mjs` (18 painéis, 0 estouro), `cdp-rede-novo.mjs`, 126/126 suítes, 19/19 no navegador |
| 2026-10-22 | Uma conta, uma pessoa | a mesma chave em duas abas ou aparelhos não vira dois viajantes: a sessão mais nova fica e as outras entram em espera, sem publicar estado, chat, party nem duelo; a espera volta sozinha quando a outra sessão some; trocar ou importar chave pela Rede também troca a sessão da praça, sem herdar a espera da conta antiga e sem reiniciar a sequência; a disputa é decidida por (início, id), igual dos dois lados, e a sessão que sai avisa com bye | `test/conta.test.mjs`, `cdp-conta-unica.mjs` (14/14), `cdp-troca-conta.mjs` (16/16), 126/126 suítes, 19/19 no navegador |
| 2026-10-22 | Rosa dos ventos do mapa | o mapa grande ganhou uma rosa de nove pontos: oito direções andam uma tela e o centro volta a seguir o personagem; no mapa inteiro a rosa aproxima antes de andar | `test/interfaces.test.mjs`, `cdp-mapa-tela.mjs` (rosa, leste e centro), 113/113 suítes, 19/19 no navegador |

## Fecho da revisão (2026-10-22)

As seis frentes passaram pelas três etapas com prova medida. O estado abaixo é
o que os testes e sondas desta data mostram, não o que o diário prometeu.

| frente | etapa 1 | etapa 2 | etapa 3 | prova |
|---|---|---|---|---|
| arte por peça | 41 assets, 111 silhuetas, 561 itens, 464 fichas, 194 NPCs e 7 pets com contorno e luz | espelho por instância, detalhe de meio pixel, portes e escalas | fogo 5/5, água 3/4, solo `tufo`, props `gaivota`, vegetação pelo vento, construção rígida; NPC olha/cabeceia e pet pisca | `test/assets.test.mjs`, `test/itens.test.mjs`, `test/bestiary.test.mjs`, `test/animacao-idle.test.mjs`, `cdp-anim-idle.mjs` (cabeça 46 px, corpo 0, cauda 60, olho 13) |
| mapa | 3.816 peças em 86 áreas, 454 estações e 94 faróis | 54 ligações (31 istmos, 23 pontes), floresta com teto, 72 casas com 8 plantas, soleira e morador | vento, mar com crista, clima por bioma; câmera, minimapa e mapa grande | `test/passagens.test.mjs`, `test/floresta.test.mjs`, `test/espaco.test.mjs`, `test/casas.test.mjs`, `cdp-soleira.mjs`, `cdp-casa-planta.mjs`, `cdp-morador.mjs`, `cdp-mapa-tela.mjs` |
| interfaces | 9 painéis em 1280 e 390 | wiki 2.311 entradas, bestiário 464 fichas, ficha com atualização sem perder foco | foco/inert, teclado nas abas e no duelo A-E, busca com limpar e contagem, avisos acima da tela ativa | `test/interfaces.test.mjs`, `test/ui.test.mjs`, `test/wiki.test.mjs`, `cdp-ui-audit.mjs` (18 painéis, 0 estouro, 0 alvo < 28 px), `cdp-contraste.mjs` (108 textos, 0 falha), `cdp-fonte-ui.mjs` |
| movimento | 1.040 caixas em 12 tipos | zero fantasma em barril, árvore, móvel sorteado e interior; 2.413 alvos de caverna | oito direções, passo, câmera, turbo e toque | `test/fantasmas.test.mjs`, `test/interior-collision.test.mjs`, `test/dungeon-reachability.test.mjs`, `test/movement.test.mjs`, `cdp-fantasma.mjs` |
| masmorras e batalha | 93 cavernas em 6 modelos e 4 pisos | sala temática por disciplina com 279 peças sólidas; 93 chefes | ritmo +1/+2, leitura de turno, fases 2 e 3, habilidade própria por chefe, turnos de PvP | `test/masmorras.test.mjs`, `test/salas.test.mjs`, `test/duelo-ritmo.test.mjs`, `test/chefe-habilidades.test.mjs`, `test/pvp-turnos.test.mjs`, `cdp-chefe-habilidade.mjs`, `cdp-sala-tema.mjs` |
| pedidos já feitos | auditoria dos 38 pedidos na fonte viva | correção de resposta vazia, frase repetida, seis alternativas e páginas curtas | 69 páginas com curso completo, revisão das PRs externas e documentos alinhados | `docs/design/20-AUDITORIA-PEDIDOS.md`, `docs/design/33-REVISAO-EXTERNA.md`, `test/licoes.test.mjs`, `cdp-pagina.mjs` |

Prova de conjunto desta data: `npm test` com **126 testes em 119 arquivos, 126 passaram**;
matriz de navegador **19/19** remedida em 2026-10-22 depois de clima, sono, famílias,
texto maior, marcas do duelo, variantes, bilhetes, arcos, patrulha e perseguição e do desacoplamento
mundo→rendering (`cdp-regressao.mjs`: HUD, mochila 40, bestiário
464, wiki 2.311 em 15 abas, diário 86, viagem 97, névoa r2, caverna, câmera,
vida/mana, mapa recolhido, fps 60,5, 390 px sem estouro, console sem erro do jogo);
matriz de navegador **19/19** (60 fps, 0 erro de console, 0 estouro em 390 px);
contraste **0 falha**; fonte e transbordo **0 fora**. Sondas e capturas em
`temporarios/2026-10-20-mundo-song-pedido/`; site publicado conferido com cache
bust para os arquivos alterados.

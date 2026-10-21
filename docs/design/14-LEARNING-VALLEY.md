# 14. The Learning Valley

Este documento é o contrato da virada de identidade do jogo: novo nome, abertura
cinematográfica, HUD legível, inventário de verdade e as mecânicas de mapa que
faltavam. A ideia central continua: um blog jogável em pixel art, com 86 áreas,
454 páginas e o catálogo inteiro dentro do mundo.

## 1. O que muda

| peça | antes | agora |
|---|---|---|
| nome | Mundo de Song | **The Learning Valley** |
| abertura | cartão de entrada | tela de título com vale animado, logo, brilho e entrada |
| vida e mana | número solto no HUD | barras com número, cor e atualização em tempo real |
| inventário | lista na Ficha | mochila em grade, ícones desenhados, arrastar e soltar, equipamento ao lado |
| equipamento | só atributo | arma, elmo e armadura desenhados no personagem |
| itens no chão | não existiam | itens espalhados pelo bioma, visíveis, coletáveis com F ou botão direito |
| botão direito | nada | menu de contexto: olhar, falar, abrir, pegar, descer, viajar, usar |
| magias | runas escondidas | barra de magias com mana, poções e runas usáveis |

## 2. Fases

### A. Nome e abertura

- [x] trocar nome, título, metadados, marca e textos de ajuda
- [x] tela de título com vale em pixel art animado, estrelas, vagalumes e logo
- [x] entrada em etapas: título, chave, personagem, mundo; sem perder a chave salva
- [x] abertura acessível: botão grande, foco, Esc e leitor de tela

### B. HUD e inventário

- [x] barras de vida e mana sempre visíveis, com número e cor
- [x] painel de mochila em grade, separado da Ficha, aberto por I
- [x] ícones desenhados por tipo de item (poção, runa, arma, armadura, material)
- [x] arrastar e soltar entre mochila e equipamento, com alternativa por clique
- [x] dica do item com nome, descrição, bônus e ação
- [x] equipamento visível no boneco: arma na mão, elmo na cabeça, cor da armadura

### C. Itens no mapa

- [x] itens do bioma espalhados em terra, desenhados no chão e com brilho
- [x] pegar com F, clique ou menu de contexto; mochila cheia recusa
- [x] persistência do que já foi pego

### D. Botão direito e interação

- [x] menu de contexto no mapa com ações do alvo embaixo do cursor
- [x] olhar descreve área, bioma, NPC, monstro ou item
- [x] falar, abrir página, descer, viajar, pegar e andar até aqui
- [x] funciona com teclado e toque (menu longo)

### E. Magias, poções e runas

- [x] barra de magias com custo, tempo de recarga e mana
- [x] magias de cura, luz, ataque e defesa no duelo
- [x] poções de vida e mana, runas de área
- [x] teclas 1 a 4 e clique na barra

### F. Prova

- [x] testes de unidade para inventário, magia, item de chão e menu
- [x] navegador local e ao vivo: abertura, HUD, mochila, arrastar, equipar, pegar, magia, botão direito
- [x] desempenho e carga medidos
- [x] commit e push com evidência

### U. Colisão do tamanho do desenho

- [x] caverna: o teto e o miolo do morro bloqueiam, a boca e a saída ficam
      livres, e o caminho mira a frente da boca
- [x] estação, pedra do porto, enfeites (pilar, terminal, banco, placa, livro,
      orbe, cristal, frasco, caixa) com caixa do tamanho do desenho
- [x] cidade subterrânea: altar, forja e pedra de retorno entram na colisão
- [x] NPC que nasce dentro de prop novo anda para o ponto livre mais próximo
- [x] conferido: 13 caminhos de caverna, morro bloqueado, saída livre, boneco
      parado ao subir, altar/forja/pedra sólidos, todas as suítes verdes

### T. Cor, contraste e rolagem

- [x] uma barra de rolagem para o jogo inteiro: trilho escuro, polegar violeta,
      vertical e horizontal, no Chrome e no Firefox
- [x] cada área pinta o próprio painel: fio, kicker, epígrafe, ponto de viagem
      e grupo do Diário usam o acento da área, nunca como fundo de texto
- [x] texto de acento é acento com branco; pior contraste medido: 8,95:1
- [x] marca, cartão de zona, passos e minimapa com placa/fundo mais opaco para
      não deixar o mundo atravessar a leitura
- [x] conferido no navegador: duas áreas com painéis de cores diferentes, 94
      destinos com 32 acentos, 86 grupos de Diário com acento, barra horizontal
      de teste, 390 px sem estouro, console limpo

### S. Voz do vale

- [x] abertura, ajuda, diário, menus e mensagens sem "blog", "catálogo",
      "página" e "site" quando falam com quem joga
- [x] cada pedra abre com uma epígrafe curta e uma lição que continua precisa:
      a voz fica literária, o conteúdo não vira vago
- [x] NPCs, missões e itens falam como moradores e objetos do vale, não como
      tutoriais
- [x] README, metatags e compartilhamento com a mesma voz
- [x] conferido no navegador: abertura, boas-vindas e página gerada do catálogo
      sem texto de bastidor, com epígrafe e console limpo

### R. Arrastar para andar

- [x] segurar o botão e arrastar no chão faz o boneco seguir o ponteiro, sem
      precisar de um clique por trecho
- [x] o destino é recalculado quando o cursor muda de tile, com respiro de
      140 ms; clique curto continua sendo clique
- [x] arrastar por cima de água ou parede não cancela o caminho que já estava
      em curso
- [x] funciona na superfície e na caverna; o toque longo ainda abre o menu
- [x] conferido no navegador: um pointerdown e dois movimentos andaram sozinhos
      no mundo e na caverna, sem segundo clique; clique curto e menu de toque
      longo continuam

### P. Equipamento por visão

- [x] arma e escudo trocam de lado conforme a direção: frente, perfil esquerdo,
      perfil direito e costas
- [x] de costas arma e escudo ficam atrás do corpo; de perfil o escudo fica no
      braço de trás e a arma aponta para o lado da cara
- [x] o elmo tem três desenhos: frente com abertura, perfil com protetor de
      nariz e costas fechadas
- [x] a peça sai da mão, não do ombro: o punho fica preso ao último par de
      pixels do braço e sobe, desce e balança junto com o passo
- [x] as oito direções chegaram: o passo já era diagonal, mas a visão caía
      sempre em esquerda ou direita. Agora 4 a 7 são diagonais de verdade, com
      cabeça um pixel para o lado, arma no lado do corpo e escudo no braço de
      trás em toda vista que não seja de frente
- [x] arma com contorno escuro para separar do corpo, aço em dois tons, guarda
      dourada, cabo de couro com a mão por cima e pomo na cor da área
- [x] escudo com aro em volta, campo na cor da área, brilho, sombra, cravos nos
      cantos, umbo no meio e a alça aparecendo na borda
- [x] conferido: quatro direções no mapa com arma, elmo, armadura e escudo, e a
      prévia da mochila; node confere lado, camada, distância do punho à mão,
      escudo cobrindo o braço e o balanço entre dois instantes do passo

### Q. Névoa com assinatura

- [x] a névoa guardada leva a assinatura do mapa e da lista de áreas
- [x] save antigo (r1, binário ou outra assinatura) revela a terra dentro das
      áreas novas na primeira abertura e migra para r2
- [x] conferido no navegador: névoa r1 toda zero virou r2 e a estação de uma
      área antiga passou a aparecer no mapa

### O. Desenho granular

- [x] o zoom da superfície trava em 2x (24 a 32 px por tile); antes chegava a
      3,5x em monitor grande e o bloco virava parede
- [x] grão de 1 px em todo tile e tom em mancha de 3 em 3 tiles, não em xadrez
- [x] praça e pedra em lajota pequena, parede em pedra com junta, ponte em tábua
- [x] costa, margem do caminho e borda da praça com dither; espuma pontilhada
- [x] copa de árvore arredondada em spans de 1 px, com camadas, tronco e sombra
- [x] a caverna pinta chão e parede num canvas por descida: o xadrez de 16 px
      saiu, entrou rachadura, cascalho, cogumelo e parede com borda serrada
- [x] conferido: 60 fps a 1x, ~50 a 4x e ~46 a 6x de CPU; 1920x1080 em zoom 2;
      sem erro de console

### N. Coleta com pergunta

- [x] árvore, água e veio viram alvo de `F`, clique ou menu de contexto
- [x] minerar, pescar e cortar madeira sorteiam o recurso e a raridade: comum
      pede pergunta fácil, incomum média, raro difícil; o lendário pede duas
      perguntas seguidas e só entrega se acertar as duas
- [x] a pergunta de cada tier é pedida ao baralho daquele tier, não ao baralho
      misturado: achado comum não pode cair em pergunta difícil
- [x] acertar leva o recurso e XP da perícia; errar não leva nada e não gasta a
      carga do veio
- [x] peixes como comida com cura crescente: lagoa 10, prateado 16, escama azul
      24 (+6 mana) e Peixe do Espelho 40 (+12 mana)
- [x] conferido: 900 sorteios sem recurso fora de ITEMS, tiers 1 a 3 e rodadas do
      lendário; navegador: árvore, pesca comum, lendário com duas perguntas
      (acertar as duas entrega, errar a segunda não entrega) e veio gastando uma
      carga das três

### M. Mochila na caverna

- [x] botão **mochila** no HUD da caverna, ao lado de turbo, ficha e sair
- [x] tecla `I` abre a mochila dentro da caverna, sem sair dela
- [x] a mochila abre por cima da caverna e o Esc fecha só ela
- [x] no celular as teclas somem dos quatro botões e "sair" não é cortado

### L. Perguntas em A-E

- [x] todo duelo e todo PvP mostram cinco alternativas, A a E
- [x] a resposta certa embaralha entre as cinco, sem ficar presa em A, B ou C
- [x] questão com 6 alternativas escritas à mão usa 5 delas, em vez de jogar
      fora e inventar distratores aleatórios
- [x] o preenchimento tenta primeiro alternativas da mesma área, depois do
      continente; pergunta numérica ganha número
- [x] distrator próximo: troca uma palavra pela oposta (maior/menor,
      aproxima/afasta, mantém/muda, muitas/poucas)
- [x] pergunta gerada do catálogo nasce com cinco opções escritas; as de três
      alternativas ganham as duas próximas antes de qualquer pool
- [x] conferido: 1603 perguntas de duelo e 35 cartas de PvP, todas com 5

### K. Formas por nome

- [x] dez formas novas: livro, símbolo, nota, átomo, cristal, engrenagem, nó,
      prisma, vetor e frasco
- [x] a forma sai de palavras do nome, com a disciplina como desempate
- [x] arte, ficha, fraqueza, velocidade, visão e traço de duelo para cada forma
- [x] conferido: 356 nomes em 25 formas, 17 casos de congruência, sem forma
      órfã de arte ou ficha

### J. Nave

- [x] `Espaço` e **Turbo** alternam a nave em vez de exigir segurar, na
      superfície e na caverna
- [x] o mesmo casco da superfície desenha a nave da caverna, com halo, motor e
      linha de velocidade
- [x] soltar a tecla não desliga; auto-repeat e perda de foco não piscam a nave
- [x] o boost sobe e desce suave, e a caverna guarda o próprio estado

### I. Separação das criaturas

- [x] um bicho por sala, com a casa escolhida para maximizar a distância de
      visão dos outros (e do chefe)
- [x] a soma das visões mais os dois passeios cabe entre as casas, com margem
      de 0,4 tile: dois círculos de visão nunca se tocam
- [x] a sala do chefe não tem bicho comum; o chefe espera sozinho
- [x] conferido nas 93 cavernas: 7 bichos por caverna, zero pontos do mapa
      vistos por duas criaturas
- [x] o passeio deixou de ser dois passos e parada: cada bicho tem ritmo próprio
      (velocidade e pausa sorteadas na espécie), anda em cadeia de dois ou três
      pontos, escolhe o ponto **mais longe** dentro do campo e vira a cabeça
      enquanto espera; o chefe passeia devagar pela sala dele
- [x] o campo não mudou de tamanho (0,6 tile para o bicho comum), então a conta
      de separação continua valendo: medido em 8 s, o bicho comum saiu de 0,98
      para 3,85 tiles andados, nenhum ficou parado (mínimo era 0) e ninguém saiu
      do campo; a menor distância entre dois bichos ficou em 12,3 tiles

### H. Minimapa

- [x] minimapa maior (232x155) com marcador em seta e anel, na direção do boneco
- [x] zoom de 1× a 6× pela roda do mouse e pelos botões, com o mapa inteiro no 1×
- [x] coordenada `x y z` e piso, no mundo e no minimapa da caverna
- [x] clique convertido pela janela do zoom, sem perder a caminhada até o ponto
- [x] o mapa inteiro deixou de ser cortado: o base é 560x360 e o canvas mostrava
      só o canto de 300x200
- [x] o minimapa da caverna nasce com a planta inteira apagada e ganha cor no
      que já foi andado: antes ele era um retângulo quase preto nas primeiras
      salas (2% de pixel vivo), agora abre em 31%
- [x] o minimapa da superfície recolhe: o botão do canto deixa só a fita com
      coordenada, piso e o próprio botão (250x227 vira 217x34), a coordenada
      continua viva enquanto anda e o estado fica guardado, então não recolhe a
      cada partida

### G. Bestiário

- [x] tecla B e botão "Bestiário" no menu, com o mesmo caminho pelo Diário
- [x] 93 cavernas por continente, 464 fichas ligadas aos encontros de verdade
- [x] silhueta e `???` até o primeiro encontro; ficha, fraqueza e estado depois
- [x] busca sem acento e filtro por conhecidos, vencidos e por ver
- [x] placar de descobertas, vencidos e chefes, com a caverna atual já aberta
- [x] sprite em canvas por espécie, com a cor que a área deu ao bicho

### V. Caverna com cara de lugar

- [x] planta própria por caverna: o id da área semeia posição, tamanho e
      ligação das dez salas; 93 desenhos distintos, sem duas iguais
- [x] a progressão continua valendo: o id vem da profundidade, então "a" é a
      sala mais perto da entrada e o chefe fica na sala de tier 3 do fundo
- [x] fachada pela pedra do lugar: ruína (giz, ardósia, papel, pergaminho,
      tinta), mina (ferro, cobre, latão, silício), fenda (vidro, cristal,
      obsidiana, âmbar), toca (cerâmica, fibra, ébano) e morro no resto
- [x] a fachada sai da pedra da área, não da cor do chão: corpo no `path`,
      crista clareada, sombra no `base`, acento na luz
- [x] boca de entrada tem placa, luz interna e degrau gasto; a boca do fundo é
      a saída esquecida: vão mais estreito, entulho, mato e nenhuma placa
- [x] a segunda boca fica no lado oposto da área, o mais longe que couber:
      desce de um lado da ilha e volta pelo outro (antes as duas ficavam a
      menos de nove tiles uma da outra em 24 dos 93 pares)

### W. Vento e onda

- [x] o vento virou um lugar: uma frente de rajada atravessa o mapa, com fase
      por posição, então o mesmo trecho de campo verga junto em vez de cada
      folha tremer sozinha
- [x] a pedra da área decide a força: fibra e papel batem forte, cristal,
      obsidiana e vidro quase não mexem (16 materiais mapeados)
- [x] a copa da árvore verga na rajada, solta folha quando ela chega e o capim
      do chão dobra na mesma faixa, inclusive musgo e flor
- [x] o mar ganhou crista que viaja de lado, cava entre duas cristas e espuma
      que respira na costa, em vez de brilho fixo pintado uma vez
- [x] custo medido: terreno de 0,60 para 0,66 ms por quadro na área de grama,
      com fps dentro do ruído da máquina (45,1 com vento, 48,7 sem, e 45,3 na
      segunda medida sem vento)
- [ ] falta fauna e NPC com respiração e passo parado, e clima por bioma
      (chuva, neblina, poeira)

### X. Contraste medido

- [x] medidor de contraste no navegador: para cada texto visível, compõe a cor
      do fundo subindo os pais com transparência e calcula a razão WCAG contra
      o tamanho e o peso da fonte (4,5:1 para texto normal, 3:1 para grande)
- [x] o medidor se testa: um texto quase da cor do fundo é acusado, senão a
      medida não vale
- [x] 10 estados medidos (mundo, mochila, bestiário, diário, ficha, ajuda, menu
      de contexto, viagem, caverna e 390 px de celular): 544 textos, nenhuma
      falha
- limite conhecido: a conta usa `background-color`. Texto sobre gradiente ou
  imagem é aproximado pela cor de trás, então gradiente novo pede nova medida

### Y. Regressão de navegador

- [x] um passeio só, com PASS/FALHA por linha, cobrindo o que já foi entregue:
      HUD, mochila (40 espaços e 8 de equipamento), bestiário (464 fichas),
      diário (86 grupos), viagem (95 destinos), arrastar para andar, névoa em
      `r2:`, caverna abrindo com planta no minimapa, saída por Esc, 390 px sem
      estouro e console limpo
- [x] 12 de 12 passando, rodado no navegador com teclas e ponteiro de verdade
- [x] defeito encontrado no caminho: com modal ou painel aberto o mundo era
      redesenhado atrás do desfoque. A mochila aberta derrubava de 45,7 para
      8,2 fps. Agora o mundo desenha uma vez ao abrir e fica parado enquanto a
      tela está coberta: 56,9 fps com a mochila aberta em sessão curta
- [ ] em sessão longa a mochila aberta voltou a medir 12 a 17 fps, sem o mundo
      sendo redesenhado: falta trace de composição para achar o que repinta

### Z. Título, letra B e botão

- [x] traje só se escolhe uma vez: na criação a lista mostra apenas o que já
      está aberto (6 trajes e 4 cabelos no começo, zero cadeado na tela). Quem
      já tem personagem entra com o que escolheu, sem ver o editor de novo. A
      lista completa, com os 102 trajes e os cadeados, fica no ponto de trajes
      dentro do jogo
- [x] o rótulo de cor de cabelo virou "tom", para não ter dois "cabelo" na
      mesma coluna

- [x] a abertura deixou de ser catálogo: saíram os números ("sete regiões,
      oitenta e seis lugares, quatrocentas e cinquenta e quatro pedras") e
      entrou a promessa do vale. A régua é a de Monument Valley: frase curta,
      imagem concreta (pedra, fogo, caminho), nada de lista, nada de exclamação
- [x] o gancho é a magia que funciona fora: "cada pedra acende uma ideia, e a
      ideia continua funcionando quando você sai" (tela de título) e "o que sai
      daqui não fica aqui" (primeira pedra do porto)
- [x] o mesmo tom foi para as metas de compartilhamento, que também listavam
      números

- [x] a tela de título ganhou o centro que faltava: alto de pedra no meio da
      relva, círculo de runas em perspectiva que gira devagar, pentagrama,
      púlpito de pedra, grimório aberto com páginas, lombada escura, runa acesa
      em cada página e fita marcadora
- [x] magia saindo do livro: três feixes de luz que balançam, brasas subindo em
      espiral, sinais de 3x5 px girando em duas órbitas e velas com chama que
      tremula
- [x] roda de figuras encapuzadas em volta do círculo: as de trás ficam atrás do
      altar, as da frente ficam na frente e maiores, com olhos acesos pela luz
      do livro
- [x] o resto do vale também ganhou detalhe: árvore com tronco, raiz, galho e
      copa em três camadas, pinheiro de quatro andares, casa com chaminé e
      fumaça, estrela que pisca em cruz e reflexo que corre no rio
- [x] layout do título: o cartão deixou de ser uma coluna no meio da tela e
      virou topo (marca e frase) mais pé (botão e assinatura), com `margin-top:
      auto` empurrando o botão. O meio ficou livre para o grimório
- [x] a letra B parecia D: no tamanho pequeno da interface o Press Start 2P
      fechava a barriga de baixo do B. A interface passou a usar Silkscreen, e o
      Press Start ficou só no logo, onde o corpo é grande
- [x] o "Enter" do botão sumia: o `kbd` do jogo é claro (`--ink`) e herdava a
      cor dentro do botão âmbar. Agora o `kbd` da entrada usa tinta escura,
      fundo escuro translúcido e borda escura

### AA. Oito direções

- [x] `dir` vai de 0 a 7 (0 frente, 1 esquerda, 2 direita, 3 costas, 4 baixo-
      esquerda, 5 baixo-direita, 6 cima-esquerda, 7 cima-direita) no mundo e na
      caverna; o caminho automático também escolhe a diagonal
- [x] a diagonal desenha o perfil (ou as costas) com a cabeça deslocada um pixel
      para o lado da caminhada e o segundo olho na borda, então lê como 3/4
- [x] equipamento acompanha: arma no lado para onde o corpo virou, escudo no
      braço de trás em toda vista que não seja de frente
- [x] bicho, NPC, gato, pet, casco e outros viajantes também: bicho espelha e
      inclina, NPC vira oito, pet e gato espelham pelo lado em que andam, e a
      popa do casco aponta para a diagonal
- [x] defeito antigo encontrado no caminho: `skiffRear` era usada no desenho da
      superfície sem estar importada. Com a nave ligada, o laço estourava em
      todo quadro e o boneco, os bichos e os objetos paravam de ser desenhados.
      Era o "o mapa some com a nave" que não reproduzia na medição antiga porque
      a medição contava pixel de cenário, não o boneco
- [x] cenário na diagonal: a escada da boca da caverna desce em diagonal para
      um canto sorteado pela semente (quatro lajotas com contorno, não o mesmo
      degrau reto em toda boca), e o item no chão flutua na diagonal com a fase
      tirada do id, então dois itens vizinhos não sobem no mesmo compasso
- [x] conferido: quatro diagonais andando de verdade no mundo, bicho com
      direção 4 e 7 na caverna, boneco de costas desenhado na caverna depois do
      conserto, escada diagonal da boca visível no recorte 5x, e nenhuma
      exceção no console

## 3. Regras de desenho

- A tela de título é a primeira impressão: vale com camadas, céu em degradê,
  estrelas, aurora, lua com halo, rio refletindo, casas com fumaça, árvores de
  copa redonda e pinheiros, e no meio do vale um grimório aberto num púlpito de
  pedra, dentro de um círculo de runas, com uma roda de figuras encapuzadas,
  brasas subindo e sinais girando. O título fica em cima e o botão no pé, para
  o meio da tela ser da arte. Nada de imagem pesada: tudo desenhado em canvas.
- O inventário usa a mesma paleta do jogo: slots escuros, borda âmbar no item
  selecionado, ícone desenhado no mesmo pixel do mapa.
- Arrastar e soltar no desktop; no celular, tocar no item e tocar no destino.
- Botão direito não é atalho escondido: abre um menu com o que dá para fazer
  naquele lugar.
- O bestiário lê a mesma função que cria o bicho na caverna. Espécie, cor, nome
  e id da ficha e do encontro não podem divergir, senão o jogador caça um bicho
  e vê outro no caderno.
- A forma do bicho vem do nome. Se o nome é "Ácido", a arte tem que ser um
  frasco; se é "Acorde", uma nota. Nome abstrato cai na forma da disciplina,
  nunca num sorteio.
- A nave é um desenho só, em `js/skiff.js`: superfície e caverna não podem
  mostrar cascos diferentes.
- Bicho de caverna tem casa e passeio curto. Dois círculos de visão que se
  tocam deixam o jogador ser visto por dois ao mesmo tempo; a casa é escolhida
  para a soma dos alcances, mais os passeios, caber entre os bichos.
- O minimapa é uma janela, não um selo: o personagem precisa ser achado sem
  apertar os olhos, e o mapa inteiro é o nível 1 do zoom. Coordenada e piso
  ficam à vista, porque é assim que o jogador se localiza no subsolo.

## 4. Andamento

| data | fase | o que entrou | prova |
|---|---|---|---|
| 2026-10-21 | AA | oito direções em tudo: passo diagonal com pose própria (cabeça deslocada, arma do lado, escudo atrás), bicho espelhando, NPC, gato, pet, casco e viajante; e o conserto do `skiffRear` que faltava importar e apagava o boneco com a nave ligada | navegador: quatro diagonais andando no mundo (dir 4, 5, 6, 7) com recorte do boneco, bichos da caverna em dir 4 e 7, boneco de costas na caverna visível depois do conserto, zero exceção; node: oito direções no gearView, direcaoBase e ladoDaDiagonal |
| 2026-10-21 | H | minimapa recolhível: botão no canto fecha o mapa numa fita com coordenada e piso, com aria-expanded e rótulo trocando, e o estado guardado | navegador: caixa de 250x227 para 217x34, canvas escondido, coordenada ainda mudando ao andar (x 91 para 95), recolhido continuou recolhido depois de recarregar e o segundo clique reabriu |
| 2026-10-21 | I | passeio dos bichos: ritmo por espécie (velocidade e pausa sorteadas), cadeia de dois ou três pontos, escolha do ponto mais longe dentro do campo, olhar em volta parado e chefe passeando devagar | navegador: 8 bichos na mesma caverna, 8 s de amostra, andado médio de 0,98 para 3,85 tiles, mínimo de 0 para 2,47, ninguém fora do campo (0,6 tile) e menor distância entre dois em 12,3 tiles; node verde |
| 2026-10-21 | Z | tela de título com grimório no centro e a letra B legível: vale redesenhado (árvore com copa em camadas, pinheiro, casa com fumaça, aurora, lua com halo), alto de pedra com círculo de runas que gira, pentagrama, púlpito, grimório aberto, feixes de luz, brasas e roda de encapuzados; cartão dividido em topo e pé; interface em Silkscreen (Press Start só no logo); `kbd` do botão de entrada com tinta escura | navegador: título em 1280x717 e em 390x844 sem estouro horizontal, recorte 3x do centro mostrando livro, runas, encapuzados e brasas; HUD e bestiário com 464 fichas legíveis na fonte nova, zero transbordo em 1280 e em 390 px; botão com texto `rgb(10,12,24)` sobre âmbar e `kbd` na mesma tinta |
| 2026-10-21 | Y | regressão de navegador e custo do modal: 12 verificações num passeio só (HUD, mochila, bestiário, diário, viagem, arrastar, névoa r2, caverna, Esc, 390 px e console) e o mundo deixou de ser redesenhado atrás do modal | navegador: 12/12 PASS, arrasto moveu o boneco de 91,61 para 96,63, névoa `r2:` de 165 caracteres, caverna com 10 salas e minimapa em 0,305, sem erro de console; fps com a mochila aberta de 8,2 para 56,9 em sessão curta |
| 2026-10-21 | X | contraste medido em todos os estados, com medidor que compõe o fundo transparente e se autotesta | navegador: 10 estados (mundo, mochila, bestiário, diário, ficha, ajuda, menu, viagem, caverna e 390 px), 544 textos, zero abaixo de 4,5:1 (3:1 para texto grande), autoteste acusando par ruim |
| 2026-10-21 | J/H | nave e minimapa da caverna: Espaço liga e desliga na superfície e no subsolo, sem auto-repeat, e o mapa continua desenhado andando com a nave; o minimapa passou a mostrar a planta inteira apagada desde a entrada | navegador: superfície e caverna com sprint ligado, desligado no segundo Espaço, 6 amostras do canvas por trecho (superfície 1,000 de mapa vivo, caverna 0,28 de área iluminada) e minimapa da caverna de 0,015 a 0,306 de pixel vivo; console limpo |
| 2026-10-21 | W | vento e onda: frente de rajada que atravessa o mapa com fase por posição e força por material da área; copa, folha solta, capim, musgo e flor respondem à mesma rajada; o mar ganhou crista que viaja, cava entre cristas e espuma que respira | node: rajada com pico e calmaria, vizinho de 1 tile na mesma frente, 14 tiles adiante em outra fase, pico levando tempo para atravessar 40 tiles, fibra mais forte que cristal, crista do mar andando; navegador: dois quadros congelados no pico e no calmo, crista e quadro seguinte, fps 45,1 com vento e 48,7 sem, terreno 0,66 contra 0,60 ms |
| 2026-10-21 | P | equipamento preso na mão: o punho saiu do ombro e foi para o último par de pixels do braço, subindo, descendo e balançando com o passo; arma ganhou contorno escuro, aço em dois tons, guarda dourada, cabo com a mão por cima e pomo; escudo ganhou aro, brilho, sombra, cravos, umbo e alça | node: quatro direções com parado e andando, punho a no máximo 6 px da mão, escudo a no máximo 6 px do braço e balanço entre dois instantes do passo; navegador: galeria do boneco com espada, escudo, elmo e armadura nas quatro direções |
| 2026-10-21 | V | caverna com cara de lugar: planta semeada pelo id (93 desenhos distintos, progressão por profundidade e chefe no fundo) e fachada pela pedra da área, com a boca do fundo diferente da entrada; a segunda boca foi para o lado oposto da ilha | node: 93 plantas distintas, todas as salas com chão e alcançáveis desde a entrada, chefe em tier 3; navegador: galeria das cinco famílias com a paleta real de cada área e as duas bocas, mina e fenda no mundo com placa e sem placa, console limpo; pares de boca: min 9,2 e mediana 17,0 tiles (antes 7,1 e 12,0, com 24 pares abaixo de 9), zero saída obstruída |
| 2026-10-20 | U | colisão do tamanho do desenho: morro da caverna, estação, pedra, enfeites e altar/forja/pedra da cidade; boca e saída livres; caminho mira a frente; NPC sai de prop novo | navegador: 13 caminhos de caverna, topo do morro sólido, saída livre, boneco parado, altar/forja/pedra sólidos, console limpo; node verde |
| 2026-10-20 | T | paleta e rolagem: barra única escura/violeta na vertical e horizontal; acento por área no fio, kicker, epígrafe, viagem e Diário; texto de acento com contraste 8,95:1; placas nos cartões flutuantes | navegador: dois painéis com cores próprias, 94 destinos e 32 acentos, 86 grupos do Diário com acento, barra horizontal de teste, 390 px sem estouro, console limpo |
| 2026-10-20 | S | voz do vale: abertura, ajuda, diário, menus, NPCs, missões, itens e mensagens reescritos sem "blog/catálogo/página"; cada pedra ganha epígrafe e a lição técnica continua precisa; metas e README na mesma voz | navegador: abertura e boas-vindas sem texto de bastidor, página gerada com epígrafe e lição, console limpo; node verde |
| 2026-10-20 | R | arrastar para andar: segurar o botão e mover o ponteiro faz o boneco seguir o destino, com caminho recalculado por tile na superfície e na caverna; clique curto e toque longo continuam | navegador: um pointerdown e dois movimentos moveram o boneco no mundo e na caverna sem segundo clique, destino mudou no arrasto, clique curto abriu caminho, toque longo abriu o menu, console limpo |
| 2026-10-20 | P | equipamento acompanha a visão: arma e escudo trocam de lado, de costas ficam atrás do corpo, elmo ganha frente, perfil e costas | node: gearView nas quatro direções; navegador: quatro capturas com arma, elmo, armadura e escudo e a prévia da mochila, console limpo |
| 2026-10-20 | Q | névoa guardada com assinatura do mundo; save antigo revela a terra das áreas novas na primeira abertura e migra para r2 | navegador: névoa r1 com tudo zero migrou para r2 e a estação de uma área antiga apareceu no mapa, console limpo |
| 2026-10-20 | O | desenho granular: zoom da superfície em 2x (antes 3,5x), grão de 1 px e tom por mancha, lajota na praça, pedra na parede, tábua na ponte, copa de árvore arredondada, dither na costa e no caminho; caverna com chão e parede pintados uma vez por descida | navegador: 1920x1080 em zoom 2, capturas antes/depois do porto, floresta e caverna, 60 fps a 1x, 49,8 a 4x e 46,5 a 6x de CPU, console limpo; node verde |
| 2026-10-20 | N | coleta com pergunta: veio, árvore e água com raridade de quatro degraus (comum, incomum, raro e lendário); a pergunta vem do tier da raridade pedido sozinho, sem misturar baralhos; o lendário pede duas perguntas seguidas e só entrega acertando as duas; peixes lagoa/prateado/escama azul/Peixe do Espelho com cura 10/16/24/40 | node: 900 sorteios sem recurso fora de ITEMS, fronteiras de raridade, rodadas do lendário e cura crescente dos peixes; navegador: pesca comum, lendário com duas perguntas (duas certas entregam, errar a segunda não entrega), veio gastando 1 de 3 cargas, 390 px sem estouro, console limpo |
| 2026-10-20 | M | mochila no HUD da caverna e tecla I dentro da caverna; o modal abre por cima, Esc fecha só a mochila e a caverna continua; no celular os quatro botões cabem sem cortar sair | navegador: botão visível, clique abriu a mochila com 40 espaços e a caverna atrás, Esc voltou, I abriu, 390 px com turbo/mochila/ficha/sair dentro da tela, console limpo |
| 2026-10-20 | L | perguntas padronizadas em cinco alternativas A-E no duelo e no PvP; a certa embaralha entre as cinco; questão com 6 escritas usa 5; distratores próximos por troca de oposto, semelhança com a resposta e mesma área; as 632 perguntas geradas do catálogo passaram a nascer com 5 opções escritas | node: 1603 perguntas e 35 cartas de PvP com 5, respostas espalhadas, distratores conferidos (Cantor, autovalor, grandes números, integração por partes), PvP 5; navegador: cinco botões A-E, tecla E responde, quinta marcada, console limpo |
| 2026-10-20 | K | a forma do bicho passou a vir do nome: 10 formas novas (livro, símbolo, nota, átomo, cristal, engrenagem, nó, prisma, vetor, frasco), classificador por palavra com disciplina de desempate, e arte, ficha, fraqueza e duelo para todas; 356 nomes cobertos | node: 25 formas com arte/nome/fraqueza, 17 casos de congruência (ácido->frasco, acorde->nota, instrução->engrenagem, autovalores->vetor), sem forma órfã; navegador: bestiário mostra as fichas novas e a separação das 93 cavernas continua com 651 bichos e nenhum ponto visto por dois |
| 2026-10-20 | J | Espaço e Turbo alternam a nave na superfície e na caverna; o casco passou para js/skiff.js e a caverna usa o mesmo desenho, com boost suave e lift do boneco; soltar a tecla não desliga | navegador: espaço liga e continua ligado, espaço de novo desliga, auto-repeat não pisca, Turbo do celular alterna com aria-pressed, caverna liga/desliga e o casco aparece andando, console limpo; node verde |
| 2026-10-20 | I | bichos postados no miolo da sala com passeio de 0,8 tile; posição escolhida para a soma das visões mais os passeios caber entre as casas, com margem de 0,4 tile; sala do chefe sem bicho comum; bestiário passa a listar 464 criaturas | navegador: 93 cavernas, 651 bichos comuns, 7 por caverna, chefe sozinho, folga mínima 0,49 tile, 1.142.784 pontos testados e nenhum visto por dois bichos, console limpo; node verde |
| 2026-10-20 | H | minimapa 232x155 com coordenada x y z, piso, zoom 1× a 6× pela roda e botões, botão mapa inteiro e marcador em seta; caverna ganhou coordenada, profundidade e minimapa de 200x150; o mapa base de 560x360 não é mais cortado no canto | navegador: coordenada x 91 y 61 z 0, zoom 1× a 6×, roda, clique andou 5 tiles, viagem para a Álgebra acompanhou, caverna z -1 com marcador, console limpo |
| 2026-10-20 | G | bestiário com tecla B e botão no menu, 487 fichas de 93 cavernas agrupadas por continente, silhueta até o encontro, busca sem acento, filtros e placar; id de bicho passou a carregar a caverna (antes o mesmo id se repetia entre cavernas do mesmo continente) | node: 93 cavernas, 487 fichas, ids únicos, encontro e vitória sobrevivem ao recarregar; navegador: 487 sprites, 93 grupos, busca "algebra" acha a Cripta da Álgebra, filtros 486/0/487, Diário abre o bestiário, 390 px sem estouro e menu em duas linhas, sem erro de console |
| 2026-10-20 | acesso | expedição na Pedra do Porto lista os 82 faróis do catálogo desde o início; viajar para uma pedra de área marca o continente e o passo de expedição; minimapa mostra silhueta de terra e ponte na névoa | navegador: lista com 82 destinos de expedição e 12 do porto, viagem até a Álgebra chegou na área certa com o passo marcado, sem erro de console |
| 2026-10-20 | revisão | ações de contexto só perto (pegar/abrir/descer/viajar), arrastar para o espaço errado recusa, runa conjura pela mochila, Ficha resume a mochila e abre o painel, equipamento aparece também na caverna, barras com aria, imagem de compartilhamento nova | navegador: item longe só olhar/andar, estação longe idem, arrastar arma para elmo recusado e elmo no lugar certo equipado, runa curou 10 pela mochila, Ficha abriu a mochila, poção de mana 1 para 9, sem erro de console |
| 2026-10-20 | D/E | toque longo abre o menu no celular; menu de treinador tem atacar e usar poção | navegador: pointerdown de toque abriu o menu com andar e olhar; menu de treinador listou falar, atacar (treino), olhar e usar Poção de Café; sem estouro em 390 px |
| 2026-10-20 | D/E | menu de contexto no mapa, magias fora do duelo, poção de mana, barra de magias, passagem para o vale e prévia do boneco equipado na mochila | navegador local e ao vivo: contexto com abrir/olhar e pegar/olhar, magia curou 10 com 3 de mana, drag-and-drop equipou elmo, prévia do boneco com arma e armadura, celular sem estouro em 390 px; 60 fps, 46 a 4x, 42 a 6x |
| 2026-10-20 | A | nome The Learning Valley, metadados, tela de título com vale animado e entrada em etapas | navegador: título com foco no botão, Enter entra, formulário seguinte recebe foco, sem erro de console |
| 2026-10-20 | C | 172 itens no chão (um equipamento e um consumível por área), com brilho, coleta por F ou botão direito e persistência; menu de contexto com olhar, falar, abrir, descer, viajar, pegar e andar; poção de mana, barra de magias e conjuração fora do duelo | navegador: item no chão pego, localStorage com o id, recarga sem respawn; menu de estação com abrir e olhar; menu de item com pegar e olhar; magia curou 10 com 3 de mana; 172 itens, 171 depois de pegar; sem erro de console |
| 2026-10-20 | B | barras de vida e mana, mochila em grade com 40 espaços, ícones em canvas, arrastar e soltar, detalhe do item e equipamento desenhado no boneco | navegador: 40 espaços, 8 espaços de equipamento, item equipado pelo detalhe, barras em 53,8% e 40%, equipamento aplicado ao boneco, sem erro de console; node verde |

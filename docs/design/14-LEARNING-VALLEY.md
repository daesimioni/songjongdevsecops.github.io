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

### P. Equipamento por visão

- [x] arma e escudo trocam de lado conforme a direção: frente, perfil esquerdo,
      perfil direito e costas
- [x] de costas arma e escudo ficam atrás do corpo; de perfil o escudo fica no
      braço de trás e a arma aponta para o lado da cara
- [x] o elmo tem três desenhos: frente com abertura, perfil com protetor de
      nariz e costas fechadas
- [x] conferido: quatro direções no mapa com arma, elmo, armadura e escudo, e a
      prévia da mochila; node confere lado e camada de cada peça

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

### H. Minimapa

- [x] minimapa maior (232x155) com marcador em seta e anel, na direção do boneco
- [x] zoom de 1× a 6× pela roda do mouse e pelos botões, com o mapa inteiro no 1×
- [x] coordenada `x y z` e piso, no mundo e no minimapa da caverna
- [x] clique convertido pela janela do zoom, sem perder a caminhada até o ponto
- [x] o mapa inteiro deixou de ser cortado: o base é 560x360 e o canvas mostrava
      só o canto de 300x200

### G. Bestiário

- [x] tecla B e botão "Bestiário" no menu, com o mesmo caminho pelo Diário
- [x] 93 cavernas por continente, 464 fichas ligadas aos encontros de verdade
- [x] silhueta e `???` até o primeiro encontro; ficha, fraqueza e estado depois
- [x] busca sem acento e filtro por conhecidos, vencidos e por ver
- [x] placar de descobertas, vencidos e chefes, com a caverna atual já aberta
- [x] sprite em canvas por espécie, com a cor que a área deu ao bicho

## 3. Regras de desenho

- A tela de título é a primeira impressão: vale com camadas, céu em degradê,
  estrelas, lua, rio refletindo e vagalumes. Nada de imagem pesada: tudo
  desenhado em canvas, como o resto do jogo.
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

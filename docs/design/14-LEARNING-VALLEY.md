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

## 3. Regras de desenho

- A tela de título é a primeira impressão: vale com camadas, céu em degradê,
  estrelas, lua, rio refletindo e vagalumes. Nada de imagem pesada: tudo
  desenhado em canvas, como o resto do jogo.
- O inventário usa a mesma paleta do jogo: slots escuros, borda âmbar no item
  selecionado, ícone desenhado no mesmo pixel do mapa.
- Arrastar e soltar no desktop; no celular, tocar no item e tocar no destino.
- Botão direito não é atalho escondido: abre um menu com o que dá para fazer
  naquele lugar.

## 4. Andamento

| data | fase | o que entrou | prova |
|---|---|---|---|
| 2026-10-20 | revisão | ações de contexto só perto (pegar/abrir/descer/viajar), arrastar para o espaço errado recusa, runa conjura pela mochila, Ficha resume a mochila e abre o painel, equipamento aparece também na caverna, barras com aria, imagem de compartilhamento nova | navegador: item longe só olhar/andar, estação longe idem, arrastar arma para elmo recusado e elmo no lugar certo equipado, runa curou 10 pela mochila, Ficha abriu a mochila, poção de mana 1 para 9, sem erro de console |
| 2026-10-20 | D/E | toque longo abre o menu no celular; menu de treinador tem atacar e usar poção | navegador: pointerdown de toque abriu o menu com andar e olhar; menu de treinador listou falar, atacar (treino), olhar e usar Poção de Café; sem estouro em 390 px |
| 2026-10-20 | D/E | menu de contexto no mapa, magias fora do duelo, poção de mana, barra de magias, passagem para o vale e prévia do boneco equipado na mochila | navegador local e ao vivo: contexto com abrir/olhar e pegar/olhar, magia curou 10 com 3 de mana, drag-and-drop equipou elmo, prévia do boneco com arma e armadura, celular sem estouro em 390 px; 60 fps, 46 a 4x, 42 a 6x |
| 2026-10-20 | A | nome The Learning Valley, metadados, tela de título com vale animado e entrada em etapas | navegador: título com foco no botão, Enter entra, formulário seguinte recebe foco, sem erro de console |
| 2026-10-20 | C | 172 itens no chão (um equipamento e um consumível por área), com brilho, coleta por F ou botão direito e persistência; menu de contexto com olhar, falar, abrir, descer, viajar, pegar e andar; poção de mana, barra de magias e conjuração fora do duelo | navegador: item no chão pego, localStorage com o id, recarga sem respawn; menu de estação com abrir e olhar; menu de item com pegar e olhar; magia curou 10 com 3 de mana; 172 itens, 171 depois de pegar; sem erro de console |
| 2026-10-20 | B | barras de vida e mana, mochila em grade com 40 espaços, ícones em canvas, arrastar e soltar, detalhe do item e equipamento desenhado no boneco | navegador: 40 espaços, 8 espaços de equipamento, item equipado pelo detalhe, barras em 53,8% e 40%, equipamento aplicado ao boneco, sem erro de console; node verde |

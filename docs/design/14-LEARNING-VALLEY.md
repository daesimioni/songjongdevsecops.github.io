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

- [ ] itens do bioma espalhados em terra, desenhados no chão e com brilho
- [ ] pegar com F, clique ou menu de contexto; mochila cheia recusa
- [ ] queda de item ao vencer duelo na caverna
- [ ] persistência do que já foi pego

### D. Botão direito e interação

- [ ] menu de contexto no mapa com ações do alvo embaixo do cursor
- [ ] olhar descreve área, bioma, NPC, monstro ou item
- [ ] falar, abrir página, descer, viajar, pegar e andar até aqui
- [ ] funciona com teclado e toque (menu longo)

### E. Magias, poções e runas

- [ ] barra de magias com custo, tempo de recarga e mana
- [ ] magias de cura, luz, ataque e defesa no duelo
- [ ] poções de vida e mana, runas de área
- [ ] teclas 1 a 4 e clique na barra

### F. Prova

- [ ] testes de unidade para inventário, magia, item de chão e menu
- [ ] navegador local e ao vivo: abertura, HUD, mochila, arrastar, equipar, pegar, magia, botão direito
- [ ] desempenho e carga medidos
- [ ] commit e push com evidência

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
| 2026-10-20 | A | nome The Learning Valley, metadados, tela de título com vale animado e entrada em etapas | navegador: título com foco no botão, Enter entra, formulário seguinte recebe foco, sem erro de console |
| 2026-10-20 | B | barras de vida e mana, mochila em grade com 40 espaços, ícones em canvas, arrastar e soltar, detalhe do item e equipamento desenhado no boneco | navegador: 40 espaços, 8 espaços de equipamento, item equipado pelo detalhe, barras em 53,8% e 40%, equipamento aplicado ao boneco, sem erro de console; node verde |

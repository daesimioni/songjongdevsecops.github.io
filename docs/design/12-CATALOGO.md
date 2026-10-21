# 12. O catálogo inteiro dentro do mundo

Este documento é o contrato da expansão pedida: **uma área de jogo para cada
seção** do catálogo de conhecimento, com geografia coerente e caminho entre
áreas vizinhas. Ele é a fonte de verdade da execução; cada fase marcada aqui
tem prova no teste do projeto.

## 1. O que conta como área

O catálogo tem 71 seções numeradas nas cinco disciplinas e 11 seções de
interseção, e dentro delas **283 subáreas** e **2.659 tópicos**. Cada seção vira
**uma área** no mapa; cada subárea vira **uma estação** com página e
instrumento. Seção sem subárea (as interseções, por exemplo) tem os tópicos
repartidos em três trilhas, e cada trilha também vira estação.

| peça | por área | onde mora |
|---|---|---|
| 1 estação por subárea (página + instrumento) | 385 páginas: 283 de subárea e 102 de trilha | `catalog-topics.js`, `catalog-gen.js` e `catalog-legacy.js` |
| 1 caverna com 10 salas e chefe | 82 cavernas | `dungeon-data.js` gerado do catálogo |
| 1 clareira de caçada com 3 monstros | 82 clareiras | `rpg-data.js` gerado |
| 1 NPC com missão própria | 82 NPCs | `content.js` e `quests.js` |
| perguntas de subárea | 2 por subárea (566) mais 210 do banco | `catalog-text.js` e `catalog-bank-*` |
| decoração e assinatura próprias | 82 famílias | `world.js` e `render.js` |
| placa, waystone e boca de caverna | 82 de cada | `config.js` |

Contagens-alvo: **16 áreas antigas + 70 novas = 86 áreas** (as 12 seções que já
têm área antiga não são duplicadas; 71 seções + 11 interseções = 82 seções,
12 já cobertas, 70 novas).

### 1.1 A lista de subáreas é o conteúdo

A lista que o dono passou em 2026-10-20 foi copiada inteira para
`js/catalog-topics.js`: 82 seções, 283 subáreas e 2.659 tópicos. O gerador lê
essa lista, e não uma amostra de três tópicos por seção. Cada estação de
subárea abre a página com os tópicos daquela subárea, e o teste
`content.test.mjs` cobra que toda subárea tenha estação e que todo tópico
apareça no corpo de uma página. As 12 seções que já tinham área antiga ganham
as estações de subárea dentro da ilha existente (`catalog-legacy.js`), longe
do farol, do NPC e da clareira de caçada.

A pergunta de cada subárea sai do próprio catálogo: uma pergunta o tópico da
subárea, a outra pergunta em que subárea o tópico aparece. As alternativas são
tópicos e subáreas irmãs, então a resposta é conferível na página.

## 2. Geografia

O mapa cresce para **560 x 360 tiles** (era 300 x 200). O que já existe fica
onde está; o mar novo recebe as áreas do catálogo em **arquipélagos por
disciplina**, com duas regras:

1. **Vizinhança é distância.** Seções consecutivas da mesma disciplina ficam
   lado a lado, em corrente, com ponte curta entre uma e a seguinte. A ordem
   da corrente é a ordem do catálogo.
2. **Interseção é passagem.** Cada área de interseção fica entre os dois
   arquipélagos que ela liga e ganha **túnel** para as duas áreas-mãe (uma
   escada em cada lado), além de ponte para a vizinha mais próxima.

Regiões:

| arquipélago | região no mar | âncora |
|---|---|---|
| Matemática | alto da faixa direita | liga ao continente pelo farol e pelo túnel |
| Computação | meio da faixa direita | idem |
| Química | pé da faixa direita | idem |
| Física | canto inferior esquerdo | idem |
| Língua | centro inferior esquerdo | idem |
| Interseções | nas folgas entre os quarteirões | túneis para as duas mães |

A ilha cresce com a seção: de 3 a 11 estações, o raio vai de 14 a 15 tiles em x
e de 9 a 10 em y (retângulo de 30 a 32 por 20 a 22), contra 22 x 14 de antes.
Entre uma ilha e a vizinha ficam **10 tiles de água**, contra 2. As estações são
postas pela regra do mais longe possível, então a distância média entre duas
estações de uma ilha subiu de 5,9 para 12,4 tiles, e a menor de 2 para 5. Cada
área tem: uma estação por subárea (com adro de pedra e caminho de 1 tile), placa
com o nome, uma pedra de viagem (ou entrada na rede de pedras já existente), boca
de caverna, clareira de caçada e NPC, mais o enfeite proporcional ao tamanho da
ilha: 3.790 peças ambientais e 1.365 árvores no total, contra 2.417 e 840. A
boca da caverna mantém 5 tiles de distância do farol da própria área, 3,2 de
qualquer totem, 2,8 de qualquer NPC e 3,2 de construção, para nada nascer
empilhado; e a construção da ilha guarda 3,5 de gente e de boca de caverna. Caverna e clareira ficam na própria ilha; a caverna desce
para o subsolo e o túnel da conurbação (camada -2) continua sendo o atalho entre
cidades.

## 3. De onde vem o conteúdo

Para não escrever 164 páginas à mão de uma vez e não inventar texto vazio, o
conteúdo de cada área vem de um **banco por disciplina** (`js/catalog-bank.js`):
para cada tópico, uma definição curta, três pontos-chave, um erro comum e uma
pergunta por dificuldade (fácil, média, difícil) com gabarito e explicação.

O gerador (`js/catalog-gen.js`) transforma o banco em:

- post de estação (definição + pontos + erro comum),
- pergunta dos monstros e do treino,
- nome de monstro, chefe, salas da caverna e loot,
- missão do NPC (quiz curto ou caçada),
- texto do NPC (três falas ligadas ao tópico),
- família de decoração e prop de assinatura.

Sem banco preenchido, a área não entra no jogo: o teste cobra cobertura.

## 4. Fases (cada uma termina em commit e prova)

- [x] **F1. Catálogo e geografia.** `catalog.js` com as 82 seções, mapa 560 x 360,
      ilhas posicionadas por disciplina, pontes entre vizinhas, túneis das
      interseções, placas, waystones e bocas. Prova: 86 áreas reconhecidas no
      mapa, 0 sobreposição, toda área com waystone, boca e caminho até vizinha.
- [x] **F2. Gerador e banco de Matemática.** 11 seções (9 novas), 22 páginas,
      cavernas, caçadas, NPCs, missões e 33 perguntas. Prova: contagens e
      navegação de ponta a ponta nas 11 áreas.
- [x] **F3. Física.** 15 seções (11 novas).
- [x] **F4. Química.** 13 seções (11 novas).
- [x] **F5. Computação.** 17 seções (13 novas).
- [x] **F6. Língua.** 15 seções (13 novas).
- [x] **F7. Interseções.** 11 áreas com túnel para as duas mães.
- [x] **F8. Prova final.** 86 áreas, 82 cavernas, 82 clareiras, 82 NPCs de
      missão, 492 perguntas novas, tudo verde no node, no navegador e ao vivo;
      desempenho medido com o mapa maior.

## 5. Registro de execução

| data | fase | o que entrou | prova |
|---|---|---|---|
| 2026-10-20 | F1 | catálogo das 82 seções, mapa 560x360, 70 ilhas posicionadas, 64 pontes e 25 túneis | node: 82 seções, 70 posições sem sobreposição, 64 pontes curtas, 25 túneis; navegador ao vivo com 60 fps e 1,3 ms de desenho |
| 2026-10-20 | F2 | gerador (`catalog-gen.js`) e banco de Matemática (`catalog-bank.js`): 9 áreas, 27 estações, 9 cavernas, 9 caçadas, 18 NPCs (9 com missão), 9 missões, 27 perguntas | node: 25 áreas no mapa, 96 estações, 32 cavernas, 32 clareiras, 55 instrutores, 51 missões, 643 perguntas; navegador: 27 estações de Matemática no mapa, pontes sem buraco, caminho a pé entre seções, página abrindo, caverna com chefe, NPC aceitando e fechando missão |
| 2026-10-20 | F3 | banco de Física (`catalog-bank-physics.js`): 12 áreas novas; 36 estações, 12 cavernas, 12 caçadas, 24 NPCs, 12 missões, 36 perguntas | node: 37 áreas, 132 estações, 44 cavernas, 44 clareiras, 63 missões, 679 perguntas; navegador: 21/21 áreas do catálogo com pacote completo, 21/21 cavernas abrindo, pontes secas, página e missão de Física funcionando |
| 2026-10-20 | F4 | banco de Química (`catalog-bank-chem.js`): 11 áreas novas, 33 tópicos; títulos com acrônimo preservado (DFT) | node: 48 áreas, 165 estações, 55 cavernas, 55 clareiras, 74 missões, 712 perguntas; navegador: 32/32 áreas do catálogo com pacote completo, 32/32 cavernas abrindo, página e missão de Química funcionando; revisão ao vivo 48/48 |
| 2026-10-20 | F5 | banco de Computação (`catalog-bank-cs.js`): 14 áreas novas, 42 tópicos; uma pergunta duplicada foi trocada | node: 62 áreas, 207 estações, 69 cavernas, 69 clareiras, 88 missões, 754 perguntas; navegador: 46/46 áreas do catálogo com pacote completo, 46/46 cavernas abrindo, página e missão de Computação; revisão ao vivo 48/48 |
| 2026-10-20 | F6 | banco de Língua (`catalog-bank-lingua.js`): 13 áreas novas, 39 tópicos | node: 75 áreas, 246 estações, 82 cavernas, 82 clareiras, 101 missões, 793 perguntas; navegador: 59/59 áreas do catálogo com pacote completo, página e missão de Língua; 60 fps com desenho 1,1 ms; revisão ao vivo 48/48 |
| 2026-10-20 | F7 | banco das Interseções (`catalog-bank-inter.js`): 11 áreas, 33 tópicos; cada interseção foi posicionada entre as duas disciplinas-mãe e ligada pelo túnel da conurbação; pontes de corrente caíram de 64 para 54 | node: 86 áreas, 82 seções cobertas com área, caverna, NPC e missão, 93 cavernas, 93 clareiras, 112 missões, 826 perguntas; navegador: 70/70 áreas do catálogo completas, 70 cavernas abrindo, túnel da interseção listando as capitais das duas mães; 14/14 |
| 2026-10-20 | F9 | catálogo completo: 283 subáreas viram estações (220 nas ilhas novas e 63 dentro das ilhas antigas), 32 seções sem subárea viram 3 trilhas, 2.659 tópicos nas páginas, 566 perguntas novas | node: 454 estações, 454 páginas, 385 estações de catálogo, 1.603 perguntas, 283 subáreas com página, 2.659 tópicos cobertos, todas as estações dentro da ilha e sem encostar; navegador: contagem do diário, páginas abrindo, GOD e prova final verdes |
| 2026-10-20 | F8 | varredura final: cobertura das 82 seções, diário com 86 áreas, lista de túneis por continente, desempenho medido com CPU lenta | node: 86 áreas, 279 estações, 93 cavernas, 93 clareiras, 186 bocas, 112 missões, 833 perguntas, 82/82 seções cobertas, 94 faróis; navegador: 15/15 no catálogo e 6/6 na prova final; 60 fps normal, 47 fps a 4x e 45 fps a 6x de CPU; diário reconhece as áreas e interseções; tudo ao vivo |

## 6. Refinamento depois da primeira entrega

| problema | o que mudou | prova |
|---|---|---|
| concordância errada nas etiquetas | artigo derivado do nome da área ("Cripta dos Fundamentos", "Farol dos Fundamentos") | teste de concordância nas 70 áreas |
| estação nova sem instrumento | cada tópico ganha um instrumento vivo por palavra-chave e, na falta, por disciplina | teste de instrumento e navegador abrindo a bancada |
| missão com resposta sempre em A | alternativas giradas por área | teste de variação do gabarito |
| 70 cavernas com a mesma planta | seis plantas (grade, espinha, anel, alas, espiral, cruz), quatro acabamentos de piso, arena de chefe e marca de tesouro; ver `18-MASMORRAS.md` | teste exige 93 plantas, sem sobreposição, chefe longe da boca e tudo alcançável |
| mundo levava 2 s para montar | máscara de espaço usado e índice de área por tile | 42 ms medidos no node |
| névoa de 269 KB a cada 1,5 s | RLE e salvamento a cada 4 s | 391 caracteres medidos no navegador |
| 86 áreas numa lista corrida | diário com blocos recolhíveis e túneis com filtro e cabeçalho | teste de navegador e celular |
| enfeite e placa caindo no mar | ponto puxado para dentro da ilha | teste de decoração na água |
| nome de NPC repetido e id com acento | elencos separados e ids sem acento | teste de nomes únicos |
| ícones de estação sem desenho | terminal e placa desenhados | teste de cobertura de ícones |
| página misturava outros assuntos e resposta vazia | a pedra ensina o assunto dela primeiro; definição do banco só entra quando acrescenta; lista de tópicos, prática e armadilha da seção e mapa vão para o fim, rotulados; a resposta da lição passou a ler o campo `a` | teste de totens: 454 páginas sem resposta vazia, ordem da lição e contraste do caminho |

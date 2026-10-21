# As masmorras: seis plantas e quatro acabamentos

As 93 cavernas do jogo não são mais a mesma grade. A planta sai do id da
caverna (semente estável), escolhe um entre seis desenhos e monta as mesmas dez
salas: entrada, seis salas de trilha, cidade do fundo e dois braços laterais.
`test/masmorras.test.mjs` cobra o resultado em todas elas.

## 1. As seis plantas

| modelo | desenho | o que muda na caminhada |
|---|---|---|
| `grade` | três colunas por duas faixas | trilha larga, salas vizinhas em bloco |
| `espinha` | corredor central com salas dos dois lados | sobe reto e abre para os lados |
| `anel` | salas em volta de um miolo aberto | dá a volta no salão central |
| `alas` | dois blocos, um de cada lado | atravessa de um lado a outro |
| `espiral` | a trilha sobe em volta do centro | caminho em S, sala escondida atrás |
| `cruz` | salão central com quatro braços | quatro pontas para explorar |

Em todas: entrada embaixo (y ≥ 38), cidade no alto (topo até y 11), chefe na
sala mais longe da boca (≥ 20 tiles), nenhuma sala encostando em outra, e uma
árvore de corredores que alcança as dez salas mais três atalhos, para a caverna
ter volta e não ser um fio só. A dificuldade continua vindo do id: `a` e `b` no
tom 1, `c` e `d` no 2, `e` e `f` no 3.

O tamanho das salas também varia (7 a 8 por 5 a 6 tiles; cidade de 16 a 19 por
9), e o miolo do anel fica aberto para o jogador ler o desenho do lugar.

## 2. Quatro acabamentos de piso

O chão é pintado uma vez na descida, junto com a parede, num canvas de 64 x 48
tiles. A planta escolhe o acabamento entre quatro:

1. **terra**: véu de tom, grão, rachadura, cascalho e cogumelo;
2. **laje**: blocos de 8 px em fiadas alternadas, com junta escura;
3. **tijolo**: fiadas de 4 px com junta e grão;
4. **veio**: filamentos do acento correndo pelo piso.

A praça da capital subterrânea cresceu: 20 a 24 tiles de largura por 11 de
altura, com os serviços em três faixas (pedra, mesa de encantamento e túnel no
alto; bicho, mesa de vocação e banco no meio; altar, horta, mestra e forja
embaixo). Nenhuma peça fica a menos de 2,2 tiles da vizinha, contra 0,76 de
antes, quando a horta nascia debaixo da mesa. A função `pracaDaCaverna` é pura e
o teste `espaco.test.mjs` mede o vão em três larguras.

Cada sala ganha uma marca no chão: a arena do chefe tem círculo de runas e
quatro losangos, a sala de tesouro tem ouro espalhado, e a boca de entrada tem
três setas apontando para dentro. A arena do chefe ganha tochas nos dois cantos
de baixo, para o círculo aparecer inteiro.

## 3. Breu legível

A lanterna do aventureiro abre 8,4 tiles (11 com tocha acesa), e o breu fecha em
0,74 de opacidade, não em 0,86. A sala fora da lanterna continua escura, mas o
contorno da parede e o vulto de uma tocha ainda aparecem. O halo da tocha
cresceu de 4,45 para 5,1 tiles e respira com a chama.

## 4. Medido

- 93 cavernas, 93 plantas diferentes, 6 modelos (14 a 18 cavernas cada), 4
  acabamentos;
- as 10 salas de todas as cavernas dentro do mapa, sem sobreposição e
  alcançáveis, chefe a 20 tiles ou mais da boca;
- quadro da caverna: 0,5 ms no navegador headless (16 props, 5 baús, 3 monstros,
  9 tochas e 1.290 tiles na vista), sem regressão de fps no vale (60,5);
- 23 suítes no node e 19/19 no navegador.

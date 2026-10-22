# Animação de NPC e pet: olhar, cabeceio, piscada e cauda

Dívida da auditoria de 2026-10-21: "animação de NPC e pet: hoje só respiram;
falta passo, cabeceio e o bicho de companhia andando com o dono". A auditoria
na fonte mostrou que o **passo já existia** (pernas e braços alternam em
`drawHuman` quando `moving`), e o pet já seguia o dono e balançava o corpo ao
andar. O que faltava era vida **parada**, que é como os NPCs passam a maior
parte do tempo.

## 1. O que foi adicionado

### NPC e jogador parados

`js/human.js` ganhou dois movimentos de cabeça, ligados só quando `moving` é
falso:

- **olhar em volta**: a cabeça desliza 1 px para um lado e para o outro, com
  fase calculada pelo posto (`px`, `py`), então dois NPCs não olham no mesmo
  compasso;
- **cabeceio**: de vez em quando a cabeça desce 1 px, como quem concorda ou
  cochila.

O corpo continua respirando e piscando como antes. A cabeça é a única parte que
se mexe além da respiração, então o efeito não vira dança.

### Gato de companhia

`js/pet-art.js`:

- **piscada**: a cada ~19 s o olho vira uma linha da cor do corpo por um
  instante;
- **cauda**: a ponta da cauda balança em seno, mesmo parado.

O balanço do corpo ao andar e a sombra continuam iguais.

## 2. Medida

Sonda `cdp-anim-idle.mjs`, desenhando os módulos em canvas próprio e contando
pixel alterado:

| cena | região | pixels alterados |
|---|---|---|
| humano parado, t=0 vs t=2992 | cabeça | **46** |
| humano parado, t=0 vs t=2992 | corpo | **0** |
| gato parado, t=0 vs t=2400 | cauda | **60** |
| gato parado, t=0 vs t=2400 | olho | **13** |

Corpo com 0 prova que a mudança é da cabeça, não do respiro. As poses ficaram
em `idle-humano-0.png`, `idle-humano-2992.png`, `idle-gato-0.png` e
`idle-gato-2400.png` em `temporarios/2026-10-20-mundo-song-pedido/`.

## 3. Prova

- `test/animacao-idle.test.mjs`: trava de fonte para olhar, cabeceio, piscada,
  cauda e o passo do NPC.
- 31 suítes node verdes; matriz de navegador 19/19; zero exceção.
- Sonda `cdp-anim-idle.mjs` com as contagens acima.

## 4. Refinamentos opcionais (sem defeito conhecido)

Nada aqui é pendência: a animação existe e é medida; estes itens são desenhos
de profundidade para ondas futuras.

1. **Passo de pet**: o gato balança o corpo ao andar, mas não tem ciclo de
   pernas; um bicho de quatro patas com passo alternado é o próximo desenho.
2. **Idle por espécie**: coruja, sapo, fada, grilo, sombra e papagaio ainda não
   piscam nem têm gesto próprio; a piscada e a cauda só valem para o gato.
3. **Gesto de NPC**: olhar e cabeceio são genéricos; um ferreiro martelando ou
   um mestre folheando livro exigiria desenho por papel.

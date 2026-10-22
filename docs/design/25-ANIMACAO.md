# Animação de NPC e pet: olhar, cabeceio, piscada e cauda

Dívida da auditoria de 2026-10-21: "animação de NPC e pet: hoje só respiram;
falta passo, cabeceio e o bicho de companhia andando com o dono". A auditoria
na fonte mostrou que o **passo já existia** (pernas e braços alternam em
`drawHuman` quando `moving`), e o pet já seguia o dono e balançava o corpo ao
andar. O que faltava era vida **parada**, que é como os NPCs passam a maior
parte do tempo.

## 1. O que foi adicionado

### NPC e jogador parados

`src/rendering/human.js` ganhou dois movimentos de cabeça, ligados só quando `moving` é
falso:

- **olhar em volta**: a cabeça desliza 1 px para um lado e para o outro, com
  fase calculada pelo posto (`px`, `py`), então dois NPCs não olham no mesmo
  compasso;
- **cabeceio**: de vez em quando a cabeça desce 1 px, como quem concorda ou
  cochila.

O corpo continua respirando e piscando como antes. A cabeça é a única parte que
se mexe além da respiração, então o efeito não vira dança.

### Gato de companhia

`src/rendering/pet-art.js`:

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

1. **Passo de pet: feito.** Gato e sapo alternam quatro patas, coruja, papagaio,
   grilo e os demais têm duas; `test/animacao-idle.test.mjs` compara dois
   instantes e prova a alternância.
2. **Idle por espécie: feito.** Coruja vira a cabeça, sapo infla o papo, fada
   pulsa o halo, grilo esfrega a pata, papagaio balança a cabeça e sombra
   ondula; cada um tem sinal próprio no teste.
3. **Gesto de NPC por papel** continua pendente: olhar e cabeceio são genéricos;
   um ferreiro martelando ou um mestre folheando livro exige parâmetro novo.

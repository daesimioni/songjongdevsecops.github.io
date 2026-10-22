# Colisão de cenário: fim dos fantasmas do vale

Dívida da auditoria de 2026-10-21: "varrer o mundo e a caverna atrás de objeto
atravessável que não devia ser". Este documento registra a varredura, a regra
nova e o que ficou de fora de propósito.

## 1. O que havia

O mundo tinha **1.531 caixas** de colisão para **3.854 peças** de ambiente. Só
barravam estação, pedra do porto, boca de caverna, doca, casa e enfeite de
praça. O resto era desenho puro:

| peça | peças | caixas antes |
|---|---|---|
| barril | 30 | 0 |
| caixote | 38 | 0 |
| saco | 31 | 0 |
| fardo | 28 | 0 |
| cerca | 11 | 0 |
| árvore, conífera, palmeira, seca | 589 | 0 |
| pedra | 233 | 0 |
| fogueira e braseiro | 149 | 0 |

O boneco atravessava barril, árvore e fogueira como se não existissem.

## 2. A regra

Cada peça com volume ganhou uma caixa presa ao chão, menor que o desenho
(`CAIXA_CENARIO` em `js/world.js`):

| peça | meia-largura | meia-altura | centro acima da base |
|---|---|---|---|
| árvore / conífera | 0,28 / 0,26 | 0,22 | 0,34 |
| palmeira / seca | 0,24 | 0,20 | 0,34 |
| pedra | 0,36 | 0,24 | 0,30 |
| barril | 0,34 | 0,28 | 0,30 |
| caixote | 0,40 | 0,32 | 0,34 |
| saco | 0,32 | 0,26 | 0,28 |
| fardo | 0,44 | 0,28 | 0,30 |
| cerca | 0,68 | 0,30 | 0,35 |
| poço | 0,80 | 0,50 | 0,42 |
| ruína | 0,95 | 0,55 | 0,50 |
| fogueira | 0,48 | 0,28 | 0,30 |
| braseiro | 0,30 | 0,26 | 0,30 |

Toda caixa cabe no limite do mundo (no máximo 2 tiles de largura e 1,4 de
altura), então não existe parede invisível maior que o desenho. O passeio de
NPC usa a mesma colisão, e os 194 NPCs continuam chegando ao posto.

Resultado: **2.571 caixas sólidas**, sendo **1.040 de cenário**, em 12 tipos.
Os pontos de interesse continuam alcançáveis a pé: a suíte de colisão varre
769.817 células de 1/4 de tile e confere 454 estações, 94 pedras, 186 bocas,
194 NPCs e 172 itens.

## 3. Exceções deliberadas

- **Chão, capim e decoração rasteira não barram**: arbusto, florada, tufo,
  folhada, musgo, rachadura, cogumelo e trepadeira.
- **Água e beira não barram**: junco, lírio, pedra molhada e espuma.
- **Bicho voador e fumaça passam**: gaivota e fumaça.
- **Doca é plataforma**, não obstáculo.
- Árvore não nasce a menos de 2,2 tiles de casa (senão a copa/porta ficava
  trancada) e é removida a menos de 1,5 do morro da caverna e 0,9 da saída.
- Perto de boca de caverna e de porta de casa a caixa é dispensada: a peça
  continua visível, mas não fecha a passagem. São poucas peças (barril 29 de
  30, pedra 207 de 233) e a suíte de colisão confirma que nada ficou preso.

## 4. Caverna

A varredura do subsolo foi feita no caminho de criação de `state.solids`
(`js/dungeon.js`): altar, forja, pedra de retorno, mesa de vocação, encantador,
horta, veio e baú já entram como caixa. Ficam atravessáveis de propósito:

- **conurbação, escada e portal**: são travessia, o corpo pisa em cima para
  interagir;
- **mestra, pet, tochas e monstros**: gente, bicho e luz de parede.

## 5. Prova

- `test/fantasmas.test.mjs`: 1.040 caixas de cenário, 12 tipos sólidos, 15
  tipos que devem ficar abertos, nenhuma caixa maior que o desenho, spawn livre.
- `test/colisao.test.mjs`: todos os pontos de interesse alcançáveis com as
  caixas novas; NPCs não param dentro delas (`test/core.test.mjs`).
- Sonda `cdp-fantasma.mjs` no navegador: andando 1,4 s contra um barril o corpo
  para a 0,50 tile da base; contra uma árvore, a 0,41 tile. Zero exceção.
- 29 suítes node e 19/19 na matriz de navegador; 60 fps.

## 6. Decisões do dono e limites conhecidos

1. **Fechado em 2026-10-22:** a mobília sorteada da casa (barril, caixote, saco,
   fardo, estante, seca e braseiro) barra o corpo, com caixa por posição e troca
   a cada casa; `test/interior-collision.test.mjs` percorre as 72 casas até
   porta, mesa e fogo.
2. A conurbação da caverna pode ganhar caixa fina sem atrapalhar a interação,
   **se o dono preferir que ela barre**. É decisão de gosto, não defeito.
3. Peças muito próximas podem formar bolsão de 1 tile; a suíte prova os pontos
   de interesse (2.413 alvos em 94 visitas), não cada célula isolada. Limite do
   teste, não do mapa.

# Salas temáticas das masmorras

Dívida da auditoria de 2026-10-21: "piso e marca já variam, mas forja,
biblioteca e observatório ainda não têm sala própria". Este documento registra
a sala de assinatura de cada disciplina, onde ela nasce e o que prova.

## 1. O que havia

As 93 cavernas tinham plantas diferentes, quatro acabamentos de piso, cidade,
chefe e baús. A sala de meio de planta era igual em toda disciplina: mesma
parede, mesmo chão, nenhum móvel que dissesse "aqui se forja", "aqui se lê" ou
"aqui se observa".

## 2. O mapa das salas

Cada continente ganhou um tipo de cômodo (`src/content/salas-tematicas.js`):

| continente | sala | cavernas |
|---|---|---|
| Computação, Química | **oficina** (bancada, bigorna, martelo, faísca) | 35 |
| Matemática, Língua, Música, hub | **biblioteca** (estante de três prateleiras, vela, brilho) | 36 |
| Física, IA, interseções | **observatório** (tripé, luneta apontada, estrelas piscando) | 22 |

A sala escolhida é a **terceira sala elegível** da planta, sem ser entrada,
cidade ou arena do chefe, com pelo menos 6 x 5 tiles. A escolha é determinística
pelo desenho da caverna, então a mesma caverna tem sempre a mesma sala.

## 3. Onde as peças ficam

Três peças por sala, encostadas nas paredes (`propsDaSala`):

- canto alto esquerdo: `x = sala.x + 2,2`, `y = sala.y + 1,4`;
- canto alto direito: `x = sala.x + largura - 2,2`, mesmo `y`;
- canto baixo direito: mesma coluna, `y = sala.y + altura - 1,4`.

O miolo fica livre para o combate. Cada peça entra em `state.solids` com caixa
de 0,6 x 0,35 tile, então o corpo e o bicho não atravessam a bancada, a estante
ou o tripé. Se um baú já ocupou o canto, a peça não é colocada ali: 279 peças
brutas, 93 salas, nenhuma empilhada.

## 4. Desenho

As três peças são cenário, sem interação, desenhadas no mesmo `draw` dos props
da caverna:

- **oficina**: bancada de pedra, bigorna, martelo e faísca que pisca;
- **biblioteca**: estante de 32 px com 15 lombadas coloridas, vela e véu de
  luz na cor do continente;
- **observatório**: tripé, tubo inclinado com lente acesa e quatro estrelas
  piscando na parede.

## 5. Prova

- `test/salas.test.mjs`: 93 cavernas, 93 salas, distribuição 35/36/22, três
  peças dentro da sala, sem repetição de posição, longe do miolo.
- 30 suítes node verdes; matriz de navegador 19/19; zero exceção.
- Sonda `cdp-sala-tema.mjs` abre uma caverna de cada tipo, mede as peças
  (`oficina`, `biblioteca`, `observatorio`) e fotografa o cômodo. Capturas:
  `sala-oficina-*`, `sala-biblioteca-*` e `sala-observatorio-*` em
  `temporarios/2026-10-20-mundo-song-pedido/`.

## 6. Refinamentos opcionais (nada disso é pendência de conteúdo)

1. As peças são **cenário com assunto**, não bancada: a forja não forja, a
   biblioteca não abre página e o observatório não revela mapa. Dar função a
   cada uma (reparo, página da área, revelar a sala do chefe) é uma onda nova
   de mecânica, não um defeito da sala.
2. Salas de 7 x 5 deixam a peça a 1,7 tile do centro; o teste de matilha mede o
   aperto e não achou bloqueio.
3. O tema é por continente, não por área: Álgebra e Língua compartilham a
   biblioteca, mudando a paleta. A distinção por área fica como refinamento.

## 6. Peças que respondem (2026-10-22)

As três peças deixaram de ser cenário mudo: cada uma tem `interact: true` e uma
função própria, uma vez por descida.

| peça | efeito | prova |
|---|---|---|
| oficina | afia a arma: +1 de dano por 3 minutos (buff `damage`) | `cdp-pecas-tematicas.mjs`: buff gravado no save |
| biblioteca | guarda uma dica: a próxima pergunta do duelo (ou do treino) abre com duas alternativas erradas riscadas | 2 `.duel-option.riscada` no duelo real, selo consumido |
| observatório | acende a sala do chefe no mapa da caverna | 43 → 78 casas vistas (+35) |

A segunda tecla na mesma peça responde "Esta peça já rendeu o que tinha nesta
descida". O efeito da biblioteca entra pelo `aplicarDicaGuardada` do RPG, que
some do save ao ser gasto (`BUFF_NAMES.dica`). Prova node:
`test/pecas-tematicas.test.mjs`.

## 7. Tema por área, não só por continente (2026-10-22)

Cada peça veste três arranjos, escolhidos pelo id da caverna por
`varianteDaPeca(areaId)` (hash estável): a oficina troca a ferramenta da bancada
(chip, frasco ou engrenagem), a biblioteca troca o arranjo da estante (livros,
pergaminhos ou tomos com globo) e o observatório aponta a luneta para outro
canto do céu, com constelação própria.

A variante entra na chave do cache de sprite, então peças de áreas diferentes
não compartilham bitmap errado. Prova: `test/pecas-tematicas.test.mjs` (estável,
0 a 2, três arranjos na amostra) e sonda `cdp-variantes-sala.mjs`, que desenha as
nove combinações e compara pixel: 3 hashes distintos por peça, 762 a 874 pixels
pintados, zero erro de console. Captura `variantes-sala-*.png`.

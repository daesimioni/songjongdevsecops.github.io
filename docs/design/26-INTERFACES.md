# Passada de interfaces: nove painéis medidos

Dívida da auditoria de 2026-10-21: "HUD, diário, ficha, mochila e loja ainda
não passaram pela auditoria de densidade e leitura". Esta é a varredura, o que
ela achou e o que mudou.

## 1. Como foi medido

Sonda `cdp-ui-audit.mjs`, com o jogo aberto:

- abre **cada painel em separado** (fecha o anterior antes), em 1280 x 860 e em
  390 x 844;
- mede estouro horizontal (elemento cuja borda passa da caixa do painel),
  rolagem vertical, quantidade de alvos de toque, alvos abaixo de 28 x 28 px,
  foco dentro do painel e quantidade de texto;
- fotografa cada estado.

Nove painéis: mochila, bestiário, diário, ficha, ajuda, viagem, wiki, duelo e
loja. A loja e o duelo são abertos pelos ganchos de depuração
(`openShop` e `openDuel`), com um bicho real da Caverna da Álgebra.

## 2. O que a primeira passada achou

| achado | onde | tamanho |
|---|---|---|
| 15 abas da wiki abaixo de 28 px de altura | wiki, 1280 e 390 | 24 px |
| botão "abrir bestiário" baixo | diário | 25 px |
| botões "comprar" baixos | ficha | 25 px |
| wiki em duas colunas no celular | wiki a 390 | colunas de ~170 px |
| card da loja 3 px para fora | loja a 390 | 94vw + padding |

## 3. O que mudou

- `.wiki-tab` e `.item-use` ganharam `min-height: 28px` e centralização; o alvo
  de toque sobe de 24-25 para 28 px sem mudar a fonte.
- a wiki vira **uma coluna** abaixo de 560 px;
- o card da loja passa a `width: 100%` no celular, em vez de 94vw + padding.

## 4. Depois

Medição final da sonda, sem nenhum erro de console:

| painel | 1280: estouro / alvos pequenos | 390: estouro / alvos pequenos |
|---|---|---|
| mochila | 0 / 0 | 0 / 0 |
| bestiário | 0 / 0 | 0 / 0 |
| diário | 0 / 0 | 0 / 0 |
| ficha | 0 / 0 | 0 / 0 |
| ajuda | 0 / 0 | 0 / 0 |
| viagem | 0 / 0 | 0 / 0 |
| wiki | 0 / 0 | 0 / 0 (1 coluna) |
| duelo | 0 / 0 | 0 / 0 |
| loja | 0 / 0 | 0 / 0 |

Rolagem vertical existe e é esperada em todos (a lista é longa); nenhum painel
estoura na horizontal. O foco do teclado entra no painel em todos os nove.

## 5. Prova

- `test/interfaces.test.mjs`: os nove contêineres existem, o alvo de 28 px, a
  wiki de uma coluna, o card da loja e os ganchos das sondas.
- Sonda `cdp-ui-audit.mjs` com o JSON das duas larguras; capturas `ui-*.png` em
  `temporarios/2026-10-20-mundo-song-pedido/`.
- 32 suítes node verdes; matriz de navegador 19/19; zero exceção.

## 6. O que continua em aberto

1. **Densidade tipográfica** não foi julgada: a sonda mede estouro e alvo, não
   se o texto de 10 px cansa. Uma régua de leitura por painel ainda falta.
2. **Navegação por teclado** só garante foco inicial; Tab/Shift+Tab circulam,
   mas não há atalho para pular direto ao primeiro item da lista.
3. **Estado vazio** da mochila e do diário aparece, mas não foi desenhado para
   ensinar o próximo passo; só diz que não há nada.
4. **Loja e duelo** dependem de caverna aberta; a sonda usa gancho de depuração.
   Um teste de fluxo real (mestra, treino) continua faltando.

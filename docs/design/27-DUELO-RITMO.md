# Duelo: ritmo, leitura de turno e vida inteira

Dívida da auditoria de 2026-10-21: "sistema de batalha: falta ritmo, habilidade
de chefe e leitura de turno; hoje o duelo é pergunta com vida". A auditoria na
fonte mostrou que fase de chefe, caráter de bicho, magias, pet e parceiro já
existiam. O que faltava era o **ritmo** do acerto seguido e a **leitura** antes
da escolha. Este documento cobre os dois e o defeito de vida quebrada que a
sonda achou no caminho.

## 1. Ritmo

`src/gameplay/duelo-ritmo.js`:

| acertos seguidos | bônus no dano | aviso |
|---|---|---|
| 2 | 0 | "2 acertos: o terceiro fecha o ritmo (+1 dano)" |
| 3 a 4 | +1 | "ritmo 3: +1 de dano" |
| 5 ou mais | +2 (teto) | "ritmo 5: +2 de dano" |

O bônus entra depois do casco e antes da vida do bicho; desvio que zerou o
golpe não ganha ritmo. A sequência zera no erro, como já acontecia.

## 2. Leitura de turno

Antes das alternativas, a janela mostra:

- **rodada** atual (o número da pergunta na descida);
- **se errar: X de dano**, com a mesma conta que o erro cobra: base do tier,
  +2 por fase de chefe, +metade da base no bicho apressado (`haste`) e zero se
  o espelho segura;
- **ritmo** e o aviso do próximo degrau quando há 2 ou mais acertos seguidos.

No treino, a linha vira "na caverna, esse erro tiraria X de vida", porque o
treino não machuca.

## 3. Vida inteira na tela

A sonda mostrou `94.70000000000002/99` na barra do bicho: o dano pode ter
decimal por vocação, pet e equipamento. A vida passou a ser mostrada com
`Math.ceil` (arredonda para cima) em vez de crua, então um bicho com 0,2 de
vida aparece como 1 e não como 0 vivo.

## 4. Prova

- `test/duelo-ritmo.test.mjs`: degraus do ritmo, teto +2, leitura e golpe
  previsto com fase, haste e espelho; integração no `rpg.js` e `duel.js`.
- Sonda `cdp-duelo-ritmo.mjs`: duelo real da Caverna da Álgebra mostrou
  "Se errar: 3 de dano", "rodada 1", e depois de três acertos
  "ritmo 3: +1 de dano" e "Ritmo: 3 acertos, +1 de dano" no retorno.
  Captura `duelo-ritmo-*.png`.
- 33 suítes node verdes; matriz de navegador 19/19; zero exceção.

## 5. Fechado em 2026-10-22

1. **Habilidade única de chefe: fechada em 2026-10-22.** Cada um dos 93 chefes
   revela uma habilidade estável na fase 2 (couraça, seiva, ímpeto ou espelho),
   com nome na tela e aviso da fase; ver `34-HABILIDADES-CHEFE.md`,
   `test/chefe-habilidades.test.mjs` e `cdp-chefe-habilidade.mjs`.
2. **Ritmo no parceiro: fechado.** Cada parceiro tem a própria sequência, o
   bônus +1/+2 entra no dano dele, o feedback avisa e o erro zera a sequência;
   a tela do parceiro mostra o ritmo e a previsão do próximo acerto.
3. **Leitura do acerto: fechada como aproximada.** A tela mostra
   `Se acertar: ~X`, com perícia, equipamento, caráter do bicho, couraça do
   chefe e o ritmo que o acerto fecharia. O til é honesto: desvio e efeitos de
   subcategoria podem mudar o resultado.

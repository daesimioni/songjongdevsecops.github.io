# Habilidade própria de cada chefe

A fase 2 do chefe deixou de ser só "o erro dói mais". Cada um dos 93 chefes
revela uma habilidade estável, escolhida pelo id dele, e o duelo mostra o nome
antes da escolha e explica a regra no aviso da fase.

## As quatro habilidades

| id | nome | efeito a partir da fase 2 |
|---|---|---|
| `couraca` | couraça viva | todo golpe do jogador rende 1 a menos, sem nunca zerar |
| `seiva` | seiva amarga | cada erro do jogador devolve 2 de vida ao chefe, até o máximo |
| `impeto` | ímpeto cego | o erro custa 2 a mais, e a previsão "se errar" já mostra |
| `espelho` | espelho partido | o primeiro erro da fase 2 é engolido, uma vez por duelo |

A escolha é determinística: `hash(id do chefe) % 4`, então o mesmo chefe sempre
revela a mesma habilidade e o jogador pode aprender o padrão. Fase 1 continua
sem habilidade; fase 3 mantém a habilidade e troca o baralho para difícil.

## Onde a regra mora

- `src/gameplay/chefe-habilidades.js`: tabela, escolha estável e as quatro contas puras
  (`danoDoJogador`, `extraDoErro`, `curaDoChefe`, `espelhoDoChefe`).
- `src/gameplay/rpg.js`: aplica couraça no acerto, ímpeto na conta do erro, seiva no erro
  e espelho no bloqueio; a fase anuncia a habilidade no `phaseNote`.
- `src/ui/duel.js`: mostra `chefe: <nome>` no cabeçalho da vida e o aviso da fase
  no feedback.
- `css/style.css`: `.duel-ability`, na mesma linha da rodada e do ritmo.

## Prova

- `test/chefe-habilidades.test.mjs`: as quatro contas puras, a estabilidade em
  todos os 93 chefes (e as quatro aparecendo), e um duelo real de chefe por
  habilidade medindo dano, cura, bloqueio e previsão. Roda sem navegador.
- Sonda `cdp-chefe-habilidade.mjs`: abre um chefe real, força a fase 2 e mede
  o nome na tela e o aviso da fase; captura `chefe-habilidade-*`.
- Suíte inteira verde e matriz de navegador 19/19 depois da mudança.

## Limite conhecido

A habilidade é sorteada pelo id, não escolhida à mão por tema. Um chefe de
música pode receber couraça, por exemplo; a ligação com o assunto fica por
conta do nome e do aviso, não do desenho. Trocar para uma tabela por disciplina
é uma mudança de dados, sem tocar nas contas.

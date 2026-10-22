# As 69 páginas escritas à mão: levas de enriquecimento

Dívida da auditoria: "69 páginas escritas à mão do vale e das áreas antigas
continuam com quatro partes e 255 a 469 palavras; falta o curso de seis partes
do catálogo". Este documento cobre a primeira leva de oito páginas e registra o
método para as próximas.

## 1. O que faltava

As páginas antigas tinham o corpo escrito à mão (três parágrafos) e recebiam,
no fim, um fecho de quatro partes gerado por `blocoDeEstudo`: limite, pergunta,
para levar e com as mãos. Faltavam as três partes que o catálogo usa para
ensinar: **O que é**, **Como se usa** e **Onde quebra**. Sem elas, a página não
fechava o curso e ficava abaixo das 460 palavras.

## 2. O método

`blocoDeEstudo` passou a aceitar três campos opcionais na lição:

- `oque`: um parágrafo de definição;
- `como`: uma lista de passos de uso;
- `quebra`: o erro comum e por que ele acontece.

Quando os campos existem, o bloco monta as três seções **antes** de "O limite",
mantendo a ordem do catálogo. Página sem os campos continua como antes, então a
mudança não duplica seção em página que já tinha o texto.

## 3. As levas já feitas (69 de 69)

| página | tema | palavras |
|---|---|---|
| generative | música que se joga | 465 |
| harmony | por que dó e sol combinam | 463 |
| ethics | o que a IA não sabe que não sabe | 467 |
| scales | a escala é uma negociação | 466 |
| motion | o pêndulo | 466 |
| rhythm | o tempo também é fração | 462 |
| state | o circuito que lembra | 475 |
| learning | a máquina que ajusta a reta | 472 |
| thermo | a multidão invisível | 465 |
| balance | nada se cria, nada se perde | 464 |
| induction | a corrente que nasce do movimento | 463 |
| pipeline | o ciclo que não para | 462 |
| neural | camadas de bolinhas | 462 |
| vision | a imagem é uma grade | 465 |
| geometry | as formas que existem antes de nós | 472 |
| language | palavras viram números | 465 |
| rainbow | o branco é uma multidão de cores | 483 |
| periodic | a tabela não é uma lista | 465 |
| concord | sujeito e verbo precisam combinar | 463 |
| registers | o lugar onde o número mora | 462 |
| security | esconder a mensagem não é esconder a chave | 464 |
| statistics | a amostra fala, mas com sotaque | 467 |
| bonds | os átomos têm preferências | 461 |
| energy | toda reação tem um preço | 463 |
| timbre | o mesmo dó, outra voz | 472 |
| chance | a moeda não tem memória | 467 |
| counterpoint | duas vozes, um caminho | 469 |
| probability | o sino das causas pequenas | 467 |
| form | o mapa que o ouvido usa | 462 |
| genres | cada texto tem um lugar | 463 |
| gravity | cair de lado sem errar o chão | 467 |
| optics | a luz que se abre | 474 |
| welcome | o vale não tem índice | 633 |
| echo | a nota que dobra de frequência | 474 |
| logic | o tijolo e a ligação | 478 |
| adder | um mais um dá zero e transporte | 496 |
| cpu | uma cidade chamada processador | 468 |
| history | ideia sem oficina não muda nada | 470 |
| infinity | parte do todo no hotel infinito | 468 |
| calculus | a taxa e o acúmulo | 473 |
| poetry | o verso é uma unidade de respiração | 482 |
| networks | camadas que escondem o detalhe | 465 |
| protocols | o acordo de como conversar | 463 |
| heat | energia em trânsito, não coisa guardada | 468 |
| entropy | a seta do tempo é probabilidade | 469 |
| analysis | o resultado vale para a amostra | 466 |
| spectrum | impressão digital da estrutura | 470 |
| tokens | a unidade que o modelo lê | 476 |
| context | o que fica fora não existe | 462 |
| meaning | sentido não é referência | 465 |
| pragmatics | a frase também faz coisas | 465 |
| lenses | onde a luz paralela se encontra | 469 |
| crypto | a chave prova sem se mostrar | 467 |

As sessenta e nove agora têm as seis partes, passam de 460 palavras e não têm
resposta vazia, `undefined` ou frase repetida. No navegador, `generative`
mostrou 464 palavras, `ethics` 466, `thermo` 464, `geometry` 470, `statistics`
466, `rainbow` 482, `timbre` 470, `optics` 472, `cpu` 467, `infinity` 467,
`convolution` 489, `narrative` 477, `crypto` 466 e `poetry` 481, todas com as
seis seções.

## 4. Prova

- `test/licoes.test.mjs`: todas as 69 são cobradas nas três partes novas e no
  piso de 460. O conjunto `ENRIQUECIDAS` foi removido quando a última onda
  fechou: não existe mais página antiga sem cobrança.
- `test/content.test.mjs` verde: nenhuma resposta vazia, nenhuma frase
  repetida, nenhum texto quebrado.
- Sonda `cdp-pagina.mjs`: abre a página pelo painel, mede palavras e as seis
  seções, procura `undefined` e resposta vazia, e fotografa. Capturas
  `pagina-generative-*`, `pagina-ethics-*`, `pagina-thermo-*`,
  `pagina-geometry-*`, `pagina-statistics-*`, `pagina-rainbow-*`,
  `pagina-timbre-*`, `pagina-optics-*`, `pagina-cpu-*` e `pagina-infinity-*`.
- 33 suítes node verdes; matriz de navegador 19/19; zero exceção.

## 5. O que continua em aberto

1. As 69 páginas estão fechadas: curso de seis partes, 460+ palavras e sonda de
   navegador. Não há leva pendente.
2. A ordem das seções novas é fixa; páginas em que "Como se usa" pede mais de
   três passos ainda não têm um formato próprio.
3. O texto novo não foi revisado por leitura humana; a sonda mede estrutura e
   defeito, não estilo.

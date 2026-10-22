# As 69 páginas escritas à mão: primeira leva

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

## 3. Primeira e segunda leva (16 de 69)

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

As dezesseis agora têm as seis partes, passam de 460 palavras e não têm resposta
vazia, `undefined` ou frase repetida. No navegador, `generative` mostrou 464
palavras, `ethics` 466, `thermo` 464 e `geometry` 470, todas com as seis seções.

## 4. Prova

- `test/licoes.test.mjs`: as dezesseis estão no conjunto `ENRIQUECIDAS` e o teste
  cobra as três partes novas e o piso de 460; as outras 53 continuam só com o
  fecho antigo, sem cobrança falsa.
- `test/content.test.mjs` verde: nenhuma resposta vazia, nenhuma frase
  repetida, nenhum texto quebrado.
- Sonda `cdp-pagina.mjs`: abre a página pelo painel, mede palavras e as seis
  seções, procura `undefined` e resposta vazia, e fotografa. Capturas
  `pagina-generative-*`, `pagina-ethics-*`, `pagina-thermo-*` e
  `pagina-geometry-*`.
- 33 suítes node verdes; matriz de navegador 19/19; zero exceção.

## 5. O que continua em aberto

1. **53 páginas** ainda estão com quatro partes e entre 255 e 469 palavras.
   A próxima leva deve seguir o mesmo método, oito por onda.
2. A ordem das seções novas é fixa; páginas em que "Como se usa" pede mais de
   três passos ainda não têm um formato próprio.
3. O texto novo não foi revisado por leitura humana; a sonda mede estrutura e
   defeito, não estilo.

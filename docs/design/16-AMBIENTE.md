# 16. Ambiente por lugar

Hoje o mundo anima igual em todo lugar: uma frente de rajada verga o capim, e o
mar tem crista. Isso funciona, mas é o mesmo vento em oitenta e seis lugares. A
pedra do lugar já decide a paleta, a arquitetura da caverna e o bicho: agora
decide também **o que se mexe no ar**.

Regra: o capim só balança onde há capim. Cada ilha ganha dois ou três elementos
próprios, escolhidos pela disciplina e pelo material dela, com movimento,
frequência e cor saindo da paleta da área.

## O que já existe para servir de base

- 86 áreas, **8 padrões de chão** (ondas 12, grade 16, rachadura 13, dunas 11,
  tijolo 11, runas 10, pontos 8, estrelas 5);
- **16 materiais** (giz 4, ardósia 4, papel 8, cobre 11, vidro 10, ferro 5,
  âmbar 5, cristal 4, cerâmica 4, silício 7, fibra 5, tinta 5, pergaminho 5,
  latão 5, obsidiana 3, ébano 1);
- **6 disciplinas** (matemática 11, física 15, química 13, computação 17, língua
  15, inter 11) mais música e IA com 2 cada;
- 30 tipos de enfeite já desenhados, muitos deles animáveis.

## O kit de cada disciplina

Dois elementos fixos por disciplina, mais um terceiro que vem do material.

| disciplina | elemento 1 | elemento 2 | movimento |
|---|---|---|---|
| matemática | pó de giz caindo | forma geométrica que se fecha e se abre (triângulo, círculo, losango) | queda lenta, montagem em 2 s |
| física | pêndulo oscilando | orbe flutuando com halo | período de 1,4 s, deriva de 3 px |
| química | bolha subindo de um frasco | fumaça fina que se desfaz | subida de 6 px/s, some em 3 s |
| computação | faísca de solda | sequência de luzes piscando em ordem | faísca a cada 2 a 5 s, luzes em 4 tempos |
| língua | folha de papel voando | letra que se desmancha | voo em diagonal, 4 s |
| inter | combina as duas disciplinas da interseção | | herda os dois |
| música | nota subindo | onda sonora que atravessa | 1 nota a cada 6 s |
| ia | pulso de sinapse | nó que pisca | pulso em 2 s, nó em 5 s |

## O terceiro elemento vem do material

| material | elemento |
|---|---|
| giz, ardósia | riscos que aparecem e somem no chão |
| papel, pergaminho | página solta girando |
| tinta | gota que cai e mancha |
| cobre, latão | verdete que pulsa devagar |
| ferro, silício | faísca ocasional |
| vidro, cristal, obsidiana, âmbar | reflexo que varre |
| cerâmica | poeira fina |
| fibra | fiapo que voa |
| ébano | folha escura que cai |

## Vegetação

O capim só balança onde existe capim, musgo ou flor. Nas ilhas de areia, gelo,
rocha ou circuito, o vento aparece no que é da ilha: dunas que escorrem, poeira
que corre, folha seca que atravessa. A frente de rajada continua existindo, mas
ela carrega o que o lugar tem, não um capim genérico.

## Regras

- **nada de partícula sem teto**: no máximo 12 por elemento na tela, desenhadas
  só quando visíveis;
- **semente por área e por dia**: dois viajantes veem a mesma bolha na mesma
  ilha, e o teste consegue prever;
- **a temporada e o evento mandam**: chuva apaga faísca, vento carrega papel,
  neblina esconde bolha, e o evento de silêncio para tudo (item 29);
- **custo medido**: ms de terreno e fps antes e depois, nos três perfis do item
  33.

## Prova

- teste que percorre as 86 áreas e exige, para cada uma, um kit com pelo menos
  dois elementos distintos e nenhum kit igual ao de outra área do mesmo
  material;
- captura de seis ilhas (uma de cada disciplina) mostrando o elemento no ar;
- fps dentro do que foi medido antes do item 29.

## Clima na caçada e relógio sempre andando (2026-10-22)

O clima deixou de ser só cenário e aviso no HUD:

- **chuva** puxa o elenco molhado (`jelly`, `crab`, `slime`, `serpent`);
- **neblina** puxa o que some da vista (`moth`, `wisp`, `eye`, `glyph`);
- **rajada** puxa o que voa (`bat`, `vector`, `ant`, `node`).

A troca é feita por `nomeDaCacada` em `src/content/cacada-clima.js`, posto a
posto, dentro do próprio continente: sala, posto, tier e dificuldade não mudam.
Sem bicho que combine, o rodízio normal da caverna continua.

Dois defeitos apareceram na prova e foram corrigidos: o relógio do clima só
andava dentro do desenho de ambiente, então no **modo leve** a chuva nunca
terminava; agora ele anda no laço do jogo, inclusive dentro da caverna. E o
`forcarEvento` (usado por teste e depuração) trocava o evento sem passar pelos
ganchos `:comeca`/`:termina`, então quem escuta o clima não ficava sabendo;
agora ele passa.

Prova: `test/cacada-clima.test.mjs` (rodízio, chuva, neblina, rajada, fallback e
volta do índice) e sonda `cdp-cacada-clima.mjs`: chuva forçada mudou os 6 bichos
da caverna de computação, todos de espécie molhada, contra 7 no clima limpo; ao
encerrar, o estado voltou a `limpo`. Zero erro de console.

## Ciclo dia/noite (2026-10-22)

O vale agora tem hora: uma volta completa leva 8 minutos. O meio-dia fica no
meio da curva (luz 1, sem véu) e a meia-noite no começo (luz 0, véu de 0,42 em
`rgb(8,12,34)`). O véu é desenhado por cima do mundo, em coordenadas de tela,
então não entra em colisão, lógica, minimapa nem HUD; a troca de dia para noite
avisa uma vez no canto.

Prova: `test/dia-noite.test.mjs` (curva, periodicidade, entrada inválida, hora
forçada para sonda e aviso no laço) e sonda `cdp-dia-noite.mjs`: brilho médio do
canvas caiu de 64,6 no dia para 44,3 na noite (31% mais escuro), zero erro.
Capturas `dia-noite-dia-*.png` e `dia-noite-noite-*.png`.

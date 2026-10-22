# 40. Plano de execução do ciclo seguinte

> Derivado das respostas do dono em 2026-10-22. O mapa de pendências verificadas
> é o [`39-BACKLOG-VERIFICADO.md`](39-BACKLOG-VERIFICADO.md); este documento é a
> ordem de execução do que foi aprovado para o próximo ciclo. Nada aqui entra
> sem teste ou sonda que falhe sem ele, prova no navegador quando for interface,
> `npm run validate` verde, commit, push e verificação no site publicado.

## 1. O que foi decidido

As 13 perguntas do 39 foram respondidas. O ciclo atual fecha sem prova final, sem
leilão, sem chefe no hub, com o tom atual, o bestiário privado, as variantes como
marca da mesma criatura, a fonte como está, a forja global, sem resistência por
tipo, sem texto autoral de misconception e com as sondas CDP fora do repo. As
quatro decisões de escopo foram confirmadas: pontes por missão, party humana em
combate, planta por área e editor/WebGL/jitter ficam de fora.

O endgame e a lore entram no próximo ciclo, nesta ordem.

## 2. O ciclo atual está fechado

- 0 linhas ausente e 0 parciais no 39; o que resta são decisões respondidas.
- 99 testes em 102 arquivos, 19/19 na matriz de navegador a 60,2 fps, 133
  módulos, build de 141 arquivos.
- Site publicado com o 39 e o 40; o revisor de conteúdo roda no `check` e no CI.
- A mochila medida em 60,2 fps após 75 s e 18 a 19 MB; acompanhar em hardware
  real.

## 3. Fases do próximo ciclo

### F1. Biblioteca Afogada (G)

A primeira entrega do endgame é o lugar: uma corrente de 7 missões que abre a
biblioteca, a tela de escolha e o acervo navegável.

- **Entregáveis**: 7 missões encadeadas (`biblioteca-1` a `biblioteca-7`), cada
  uma com pré-requisito na anterior; a tela de escolha do que estudar; o acervo
  com as páginas de lore e os conceitos avançados, com busca; a recompensa
  (relíquia e título); a entrada no diário e na wiki.
- **Prova**: `test/biblioteca.test.mjs` (7 missões, a segunda trancada até a
  primeira, o acervo com as páginas, o save); `cdp-biblioteca.mjs` (entrar,
  escolher, ler, sair); `npm run validate`; site.
- **Depende de**: nada. O conteúdo das páginas usa o acervo existente.

### F2. Grande Prova como evento (M)

Não é exame nem reprovação: é o duelo/evento final opcional da lore, com uma tela
de escolha e um desfecho. A decisão 1 do dono (sem prova final) continua valendo.

- **Entregáveis**: o evento de 3 fases com o guardião da biblioteca; a escolha do
  desfecho (guardar, devolver, abrir); a recompensa; a marca no save e na wiki.
- **Prova**: `test/grande-prova.test.mjs` (as três fases, a escolha, o save, a
  ausência de nota/reprovação); `cdp-grande-prova.mjs` (chegar, escolher, ver o
  desfecho); site.
- **Depende de**: F1 (a biblioteca é o lugar).

### F3. Arco principal em capítulos e lore da Iara (G)

As 284 missões atuais são geradas e não têm fio. O arco transforma o acervo em 7
capítulos, do Silêncio à Iara, com marcos e diálogo.

- **Entregáveis**: `src/gameplay/arcos.js` com 7 capítulos (porto e seis
  disciplinas), cada um com um marco, uma missão de capítulo e uma entrada de
  lore; os NPCs de arco com falas próprias; a linha do tempo no diário e na wiki.
- **Prova**: `test/arcos-historia.test.mjs` (7 capítulos, ordem, desbloqueio por
  marco, save); `cdp-arco-capitulo.mjs` (um capítulo inteiro); wiki.
- **Depende de**: F1 (o acervo) para as entradas de lore.

### F4. Facções e reputação (G)

Três forças com memória do que o jogador fez: o Concílio do Silêncio, a União das
Minas e o Porto.

- **Entregáveis**: reputação de -3 a +3 por facção, atos que sobem e descem,
  recompensas e portas que abrem; o painel no diário; o efeito no preço da loja e
  nas falas dos NPCs.
- **Prova**: `test/faccoes.test.mjs` (ato sobe, ato desce, teto, save, efeito na
  loja); `cdp-faccao.mjs` (um ato e o painel); wiki.
- **Depende de**: F3 (os capítulos definem os atos).

### F5. Guilda e party (G)

A guilda é o lugar social que o desenho pede: sede, fundação, cargos e a party de
8 que já existe. Sem servidor, a guilda é local e usa os convites assinados da
Rede.

- **Entregáveis**: a sede com quadro de membros e cargos; a fundação com nome e
  brasão; as missões de guilda; a party de 8 com o convite assinado; o diário da
  guilda.
- **Prova**: `test/guilda.test.mjs` (fundar, convidar, cargo, save); `cdp-guilda.mjs`
  (fundar e convidar); wiki.
- **Depende de**: F4 (as facções dão o prestígio) e da Rede.

### F6. Refinamentos reabríveis (M cada, só sob demanda)

Não entram sem o dono reabrir: ofícios por continente (3 a 5 receitas por forja),
resistência por tipo (espécie, trait ou disciplina), pontes por missão, party
humana em combate, planta por área, editor de mapa, WebGL e jitter das ilhas.
Cada um tem o custo e o gatilho na tabela de escopo do 39.

## 4. Manutenção do ciclo atual

| item | quando | prova |
|---|---|---|
| mochila em hardware real | a cada sessão longa | 60,2 fps e 18 a 19 MB; se cair, medir e abrir item |
| fps abaixo de 50 | se acontecer | reabrir a decisão de WebGL; o Canvas 2D é o padrão |
| revisor de conteúdo | no `check` e no CI | 887 versões únicas, 0 problema; 9 avisos de explicação repetida para quando o texto for reescrito |
| Pages e fila | a cada push | verificar com cache bust; a fila externa pode atrasar e não é bug |
| documentos | ao fechar cada fase | o 39 é o mapa, o 40 o plano; atualizar os dois e o `docs/design/README.md` |

## 5. Ordem, dependências e marcos

| marco | fase | entrega | prova |
|---|---|---|---|
| M1 | F1 | corrente de 7 missões, tela e acervo | teste, sonda e site |
| M2 | F2 | evento de 3 fases e desfecho | teste, sonda e site |
| M3 | F3 | 7 capítulos e entradas de lore | teste, sonda e wiki |
| M4 | F4 | 3 facções com reputação | teste, sonda e site |
| M5 | F5 | guilda e party | teste, sonda e site |

A ordem é F1, F2, F3, F4, F5. F3 e F4 podem trocar de posição se o conteúdo do
arco atrasar; F5 depende de F4. Cada marco fecha com `npm run validate`, commit,
push e verificação no site, como no ciclo atual.

## 6. O que não entra

As decisões respondidas e as de escopo confirmadas: sem prova final, sem leilão,
sem chefe no hub, tom atual, bestiário privado, variantes como marca, fonte como
está, forja global, sem resistência por tipo, sem texto autoral de misconception,
sondas fora do repo, sem pontes por missão, sem party humana em combate, sem
planta por área e sem editor/WebGL/jitter. Reabrir é uma decisão nova, registrada
no 39.

## 7. Critério de pronto

Cada item só vira **feito** com teste ou sonda que falha sem ele, prova no
navegador quando for interface, `npm run validate` verde, commit, push e
verificação no site publicado, e os números medidos no 39 e neste plano.

## 8. Riscos

- **Conteúdo autoral**: 7 missões, 7 capítulos e 3 facções são semanas; fatiar em
  entregas pequenas e fechar um marco por vez.
- **Guilda sem servidor**: a camada social é local, com convites assinados; não
  prometer tempo real.
- **Grande Prova**: não pode virar exame reprovativo; a decisão 1 vale para ela.
- **Fila do Pages**: externa; não tratar atraso como bug e verificar com cache
  bust.

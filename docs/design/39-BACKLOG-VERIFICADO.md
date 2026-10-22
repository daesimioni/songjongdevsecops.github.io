# Backlog verificado

Este é o mapa único do que ainda falta. Substitui a leitura dos documentos de
planejamento antigos como lista de tarefas: vários deles descrevem o jogo antes
de ele existir, com números que o código já superou.

## Método e estado atual

Auditoria read-only de 2026-10-22 cruzou os documentos 00 a 38 com `src/`,
`test/` e `tools/`. Números do código: 86 áreas, 454 estações, 93 cavernas, 561
itens, 464 fichas, 291 missões, 194 NPCs, 2.311 entradas de wiki, 887 perguntas
de duelo, 153 módulos e 113 testes node. `npm run validate` passa (lint,
contrato de módulos, testes e build) e a matriz de navegador dá 19/19.

Esforço: **P** até um dia, **M** de dois a cinco dias, **G** mais de uma semana.
Estado: **feito**, **medido** e **decisão** (respondida em 2026-10-22). Não há linha ausente nem parcial.

## Onda 1: fechar o que é pequeno

| item | estado | o que falta | esforço |
|---|---|---|---|
| ritmo no parceiro + dano do próximo acerto | **feito** | previsão `~X` no duelo e no parceiro, sequência própria, erro zera | P |
| atalho da busca para a lista | **feito** | seta para baixo sai da busca e foca o primeiro resultado (wiki e viagem) | P |
| mochila em sessão longa | **medido** | 60,1 fps curta e 60,2 fps após 75 s, 18 a 19 MB, 0 tarefa longa; não reproduziu em headless, monitorar hardware real | P |
| régua de densidade tipográfica | **decisão** | o corpo de texto de painel tem piso de 11 px e linha 1.45 (testado) e o texto maior dos painéis cresce 15%. Sondagem achou 178 elementos abaixo de 11 px; **31 informativos subiram para 11 px** (traço/fraqueza do bicho, preço e linha da loja, companhia, subtítulo do duelo) e o botão da troca ganhou alvo de 28 px. Restam **147 rótulos em fonte pixel** (título de seção, aba, selo) desenhados para 7 a 10 px: subir todos mudaria a identidade visual. Piso vale para corpo, não para rótulo de pixel font. Reauditoria dos 18 painéis: 0 estouro, 0 alvo pequeno | P |
| índice de estações acessível | **feito** | diário com `role=list`, grupo rotulado por área, nome e estado em cada estação e progresso `aria-live`; wiki tem a categoria Páginas com as 454 estações | P |
| estado vazio que ensina | **feito** | mochila, missões e bestiário dizem o próximo passo; diário mostra as estações por área | P |
| telegrafia do tema pelo chefe | **feito** | baralho guarda a área; chefe mostra `◆ próximo tema: <área>` na cor do continente, testado e medido no navegador | P |
| capa e conjuntos de 3 peças | **feito** | slot `cloak`, duas capas craftáveis, bônus de conjunto (+2 vida e +1 dano) em `equipmentBonus`, desenho atrás do corpo e aviso na ficha; `test/gear.test.mjs` e `cdp-capa.mjs` | P a M |
| ponto fraco do chefe após 2 acertos | **feito** | terceiro acerto seguido soma +1, com nota no feedback e teste no duelo real | P |
| recarga de runa no altar | **feito** | altar cura e devolve uma carga da runa aprendida mais vazia, com teste | P |
| documentos que mentem | **feito** | os 14 documentos de conceito (00 a 13) estão congelados com aviso apontando o README e este backlog, inclusive o retrato `11-ESTADO-2026-10-20.md`; os de engenharia (14 a 19) trazem medição e as auditorias (20 a 38) são histórico datado. O `docs/design/README.md` separa as três camadas, manda para este mapa e não tem mais as listas antigas "o que ainda precisa do dono" e "o que vem depois do aval"; `test/documentos.test.mjs` cobra os 14 banners, o índice e as decisões | P |

## Onda 2: sistemas que já têm casa

| item | estado | o que falta | esforço |
|---|---|---|---|
| grafo de conceitos + domínio 0 a 5 + revisão espaçada + caderno | **núcleo feito** | domínio 0-5 no save, revisão espaçada por área, baralho prioriza vencido e **ordena a área mais fraca primeiro** (`test/adaptativo.test.mjs`), caderno no diário. **Arestas do grafo**: 78 arestas derivadas da numeração do catálogo (86 áreas em 8 grupos), sem currículo inventado; o caderno ganhou "Antes de avançar" quando a área está em 2+ e o pré-requisito em 0/1 (`test/grafo.test.mjs`, `cdp-grafo.mjs`: "Área da Aritmética · você está em 3, mas Área dos Fundamentos está em 1; revise antes"). Faltam formatos e prova de transferência, decisão na linha própria | M a G |
| misconceptions e escolha adaptativa | **feito** | **escolha adaptativa + erro por distrator**: o baralho começa pela área de menor domínio, área nunca respondida conta como zero e a revisão vencida continua na frente; a pergunta errada nos últimos 7 dias volta antes dentro do mesmo domínio. O duelo grava a alternativa marcada com a versão FNV da pergunta (teto de 120 entradas, purga da mais antiga), mostra "Você marcou: X" no feedback e o diário lista os 5 erros recentes com a resposta certa (`test/distratores.test.mjs`, `cdp-distratores.mjs`: marcada no duelo, 1 linha no caderno, 0 erro de console). **Decisão registrada**: não haverá texto autoral de misconception por distrator nas 887 perguntas; o "porquê" da resposta certa e a alternativa marcada cobrem o erro, e o revisor de conteúdo guarda a versão para quando um distrator mudar | M |
| dicas em escada e foco | **feito** | botão de dica no duelo: 1 mana por passo, passo 1 risca duas erradas, passo 2 risca mais uma, passo 3 revela a correta, zera na pergunta nova e leva o foco para a alternativa viva; `test/duelo-dica.test.mjs` e `cdp-dica.mjs` | M |
| formatos de pergunta e prova de transferência | **decisão** | depende do dono: hoje só A-E e o texto do jogo diz que não há prova final, enquanto o desenho 01 §13 pede exame por continente. Escolher o formato e a prova antes de escrever conteúdo | G |
| ofícios por continente | **decisão** | o **mercador de troca** está feito: quatro ofertas material por material no guardião, com perda e sem leilão (`test/mercador.test.mjs`, `cdp-mercador.mjs`). Separar a receita por continente é conteúdo (quais 3 a 5 peças por forja) e depende do dono; filtrar as 40 receitas atuais, todas do porto, não teria o que filtrar | M |
| magias, encantos e consumíveis no alvo do desenho | **feito** | 12 encantos (`test/encantos.test.mjs`), 12 runas (6 novas em `test/runas-novas.test.mjs`) e 9 poções + 15 comidas, com cura, mana e buff medidos (`test/consumiveis.test.mjs`); wiki 2.308 fichas, 561 itens, 39 receitas | M |
| famílias, variantes e fraqueza numérica | **feito** | 25 formas em 5 famílias, faixa no bestiário e +50% contra a família completa (`test/familias.test.mjs`, previsão 1,1 → 1,7). **Variantes**: eco (10%), elite (5%) e antiga (3%) decididas por caverna e sala, trocando vida, dano, XP, material, cor e nome, com linha no duelo (`test/variantes.test.mjs`, `cdp-variantes-criatura.mjs`: "Sílaba Antiga" com vida 6) | M |
| clima afetando spawn | **feito** | chuva, neblina e rajada trocam o elenco do subsolo pelo clima (`nomeDaCacada`), sem mexer em sala, posto ou tier; o relógio do clima passou a andar no laço (não só no desenho) e o `forcarEvento` emite os ganchos; `test/cacada-clima.test.mjs` e `cdp-cacada-clima.mjs` (6 de 6 bichos molhados na chuva, 7 no limpo) | M |
| audição, alerta, patrulha e perseguição | **feito** | **audição, sono, isca, patrulha e perseguição**: correr perto vira o rosto para o som com `?`; um quinto nasce dormindo (`z`) e acorda com passo perto ou corrida; a **isca** atrai os bichos a menos de 8 tiles por 6 s e quem come não ouve nem vê. A **patrulha** dá a cada bicho acordado uma rota fixa de até quatro pontos em volta do posto (raio 1,4), ida e volta pelo posto; só entra ponto com a reta livre até o posto, e o índice anda mesmo quando o caminho bloqueia. O passo corrido vira **perseguição**: ele caminha até o último ponto ouvido por 2,6 s, desiste se bater parede e volta para casa. O raio maior custou 14% dos bichos (201 → 172 em 31 cavernas), e o espaçamento entre postos acompanha para os campos de visão não se cruzarem. Provas: `test/audicao`, `test/isca`, `test/patrulha`, `cdp-audicao`, `cdp-sono`, `cdp-isca` e `cdp-patrulha` (109 rotas em 137 bichos acordados, 9,4 tiles andados em 20 s, 2 de 3 bichos tocando dois pontos, 0,4 a 1,4 tile de avanço na perseguição, volta a 0,1 a 0,8 do posto) | M |
| escudo que barra erro e resistência por tipo | **feito** | o **escudo equipado** segura o primeiro erro de cada duelo, gasta a carga, avisa na leitura e na ficha, não gasta com runa/espelho e recarrega (`test/escudo-equip.test.mjs`, `cdp-escudo.mjs`: 28 no primeiro erro, 25 no segundo). A **resistência por tipo** fica na decisão 11 do dono (o eixo: espécie, trait ou disciplina); a fraqueza de família (+50%) já é o contra-ataque medido | M |
| party humana em combate | **decisão** | a party social de 8 com convites assinados existe; o duelo cooperativo exigiria sincronização em tempo real entre navegadores e o jogo é estático, sem servidor. Fica single-player no escopo atual; reavaliar junto da camada social | G |
| passo de pet e idle por espécie | **feito** | gato e sapo alternam quatro patas, coruja/papagaio viram a cabeça, fada pulsa, grilo esfrega a pata, sombra ondula; `test/animacao-idle.test.mjs` [ao andar] alterna patas | M |
| gesto de NPC por papel | **feito** | guia aponta o caminho, monitor ergue a mão, mestre folheia livro; só parado e de frente, fase por posto (`npc.bob`), troca o braço em vez de somar; `test/gesto-npc.test.mjs` e `cdp-gesto-npc.mjs` | M |
| funções das peças temáticas | **feito** | as três peças respondem ao F, uma vez por descida: oficina afia (+1 de dano por 3 min), biblioteca guarda uma dica que risca duas alternativas no próximo duelo (e no treino) e observatório acende a sala do chefe no mapa (35 casas medidas); `test/pecas-tematicas.test.mjs` e `cdp-pecas-tematicas.mjs` | M |
| tema de sala por área | **feito** | a peça veste a área, não só o continente: `varianteDaPeca` escolhe pelo id da caverna um de três arranjos (ferramenta da oficina, arranjo da estante, inclinação da luneta); `cdp-variantes-sala.mjs` mede 3 desenhos distintos por peça | M |
| teste de fluxo real de loja e duelo | **feito** | loja aberta pelo guardião com F, compra real (material cobrado, peça na mochila, cartão vira "já é sua") e troca do mercador medidas em `cdp-loja.mjs` e `cdp-mercador.mjs`; o duelo já era exercido por `cdp-duelo-ritmo.mjs`, `cdp-dica.mjs` e `cdp-voz.mjs` com bicho real de caverna | M |
| acessibilidade: voz, escala, daltonismo | **feito** | teclado, foco e aria-live; **voz** (ouvir/parar, pt-BR); **resultado sem cor** (✓ e ✗, letras A-E no toque); **texto maior** nos painéis de leitura (15% no desktop, salvo no save, sem zoom no celular). Provas: `test/voz-duelo`, `test/duel-acessivel`, `test/fonte`, `cdp-voz`, `cdp-duelo-a11y`, `cdp-fonte-maior` (parágrafo 46 → 53 px, zero estouro) | M |
| save versionado, migração e exportar/importar | **feito** | backup carrega `v: 1` e só aplica as chaves conhecidas com valor JSON válido; a Rede ganhou `baixar arquivo` (JSON legível, sem a chave da conta) e `carregar arquivo` (recusa lixo, aplica e recarrega); `test/save-arquivo.test.mjs` e `cdp-save-arquivo.mjs` (7 partes, v1, nome trocado pelo arquivo) | M |
| linter de conteúdo | **feito** | `tools/revisar-conteudo.mjs` revisa as 887 perguntas do índice do jogo (inclui a do fundo): enunciado, 3 a 6 alternativas, duplicata com acento/hífen preservados, resposta na faixa, explicação com 20+ caracteres, marca de rascunho, alternativa ambígua, enunciado repetido no banco inteiro e versão FNV-1a única por pergunta (`--versoes` imprime a de cada uma). Roda no `npm run check` e no CI. Estado medido: 887 versões únicas, 0 problema e 9 avisos de explicação repetida (perguntas de prática/armadilha que compartilham a mesma página). `test/revisor-conteudo.test.mjs` prova que uma pergunta quebrada é apontada e que o banco real passa | M |
| pontes por missão | **decisão** | **ferry, elevador, ciclo dia/noite e mapa grande feitos** (provas em `test/ferry`, `test/elevador`, `test/dia-noite`, `test/mapa-grande`). Uma ponte condicional exigiria regenerar o chão cacheado, o minimapa e revalidar os 2.413 alvos e as 54 ligações em runtime para abrir e fechar um vão; o jogo já tem 54 travessias fixas e a progressão por trilha. Reavaliar se o dono quiser o mapa como progressão explícita | M |
| arcos de NPC, murais e bilhetes | **feito** | **bilhetes**: 93 cavernas com nota na parede da cidade, da lição da área (70), da relíquia (16) ou do lugar (7), lida no F (`test/bilhetes.test.mjs`, `cdp-bilhete.mjs`). **Arco do guardião**: a missão do chefe de cada área virou segundo capítulo, trancada até a trilha fechar, com aviso no cartão; 86 pares medidos (`test/arcos.test.mjs`, `cdp-arcos-npc.mjs`: só a trilha e o aviso, depois o chefe) | M |
| presets de build na ficha | **feito** | a ficha guarda até três retratos do equipamento: `salvar a atual`, `usar` (troca o conjunto inteiro e avisa peça que faltou) e `remover`; save valida slot e sobrevive à recarga; `test/builds.test.mjs` e `cdp-builds.mjs` | P |

## Arquitetura

| item | estado | o que falta | esforço |
|---|---|---|---|
| mundo sem rendering | **feito** | `world.js` não importa mais `rendering/`: a colocação do ambiente foi para `src/world/povoado.js` e o tamanho das construções para `src/content/asset-meta.js`, fonte única entre desenho e mapa; `test/arquitetura.test.mjs` cobra os quatro pontos e a matriz de navegador deu 19/19 com 60,1 fps depois | P |
| arquivos grandes (app 3,4 mil, dungeon 2,2 mil, rpg 1,9 mil linhas) | decisão | cada um é coeso por domínio e o contrato de módulos está sem ciclos (153 módulos, 347 dependências). Separar agora é risco sem ganho medido; reavaliar quando uma mudança precisar tocar o mesmo trecho por três frentes | G |
| sondas CDP fora do repositório | decisão | ver pergunta 10: trazer todas engorda o repositório público com dependência de Chrome | — |

## Onda 3: conteúdo grande e endgame

| item | estado | o que falta | esforço |
|---|---|---|---|
| guilda | **feito** | a sede é local: fundar com nome e brasão, quadro de até oito membros com cargos, recrutamento pela party (o convite assinado continua na Rede), quatro missões que leem o save, diário da sede e o título de Guardião no chefe; o diário abre a sede e a wiki tem a ficha (`test/guilda.test.mjs`, `cdp-guilda.mjs`, 15/15) | G |
| arco principal em capítulos e lore da Iara | **feito** | o fio da Iara tem 7 capítulos (porto e seis disciplinas) com missão-marco, lore e fala do guia; o diário mostra lido, aberto e bloqueado, e o save guarda a leitura (`test/arcos-historia.test.mjs`, `cdp-arco-capitulo.mjs`, 13/13) | G |
| facções e reputação | **feito** | Concílio, União e Porto lembram os atos do jogador de -3 a +3; missão sobe um, o desfecho da Grande Prova sobe três na facção atendida e desce duas nas outras, o título de aliado sai no +2, o Porto muda o preço da loja e o Concílio abre a estante reservada (`test/faccoes.test.mjs`, `cdp-faccao.mjs`, 14/14) | G |
| planta de casa por disciplina/ilha | **decisão** | quatro tipos com duas plantas cada cobrem as 72 casas e a semente do tipo escolhe; uma planta por área seriam 86 desenhos sem ganho de jogo. Reavaliar se o dono quiser variedade visual nas casas | G |
| moeda Selo | **decisão** | preço em material; uma moeda nova é decisão de economia e do dono, não de código | G |
| editor de mapa e WebGL do mundo | **decisão** | não fazer agora: o mundo é gerado por `catalog-*` e os testes de mapa, colisão e alcance são o editor; o Canvas 2D entrega 60,2 fps medidos e 19/19 na matriz de navegador. Migrar para WebGL não tem ganho medido e arrisca a arte; reavaliar se o fps cair abaixo de 50 em hardware real | M cada |
| grade de ilhas regular | **decisão** | a malha 24x16 é a planta do arquipélago, e as ilhas já variam por bioma, tamanho e decoração; o jitter exigiria regenerar o literal e revalidar 2.413 alvos e as 54 ligações, sem ganho medido. Reavaliar se o dono apontar o alinhamento como defeito visual | M |

## Decisões que dependem do dono (respondidas em 2026-10-22)

O dono revisou as 13 perguntas e respondeu todas em 2026-10-22. As respostas
abaixo são a decisão vigente; o plano do próximo ciclo está em
[`40-PLANO-EXECUCAO.md`](40-PLANO-EXECUCAO.md).

| # | pergunta | resposta do dono |
|---|---|---|
| 1 | prova final | manter sem prova final e ajustar o doc 01 §13 com nota datada |
| 2 | leilão | manter a troca local por material, sem leilão |
| 3 | endgame e lore | próximo ciclo, com plano no 40 |
| 4 | nomes e tom | manter o tom atual |
| 5 | chefe do hub | não criar; o porto é seguro |
| 6 | bestiário na party | não compartilhar |
| 7 | variantes | marca da mesma criatura no bestiário |
| 8 | escala de fonte | manter como está (corpo 11 px e texto maior nos painéis) |
| 9 | ofícios | manter a forja global |
| 10 | resistência por tipo | não fazer; escudo e família já cobrem |
| 11 | misconceptions | manter sem texto autoral |
| 12 | sondas CDP | manter fora do repo e documentar o caminho |

## Decisões de escopo (engenharia, confirmadas em 2026-10-22)

O dono confirmou as quatro. Reabrem pelo mesmo caminho se ele apontar o ganho.

| item | por que fica de fora |
|---|---|
| pontes por missão | exigiria regenerar o chão cacheado, o minimapa e os 2.413 alvos em runtime para uma passagem a mais; o jogo tem 54 travessias e a progressão por trilha |
| party humana em combate | o duelo é local e o jogo não tem servidor de estado; a party social de 8 cobre convite e encontro |
| planta de casa por área | 8 plantas cobrem os 4 tipos e as 72 casas; uma por área seriam 86 desenhos sem ganho de jogo |
| editor de mapa, WebGL, jitter das ilhas | o mundo é gerado e testado, o Canvas 2D faz 60,2 fps e o jitter exigiria revalidar 2.413 alvos e 54 ligações |

## Critério de pronto

Cada item acima só vira **feito** com teste ou sonda que falha sem ele, prova no
navegador quando for interface, `npm run validate` verde, commit, push e
verificação no site publicado.

# Backlog verificado

Este é o mapa único do que ainda falta. Substitui a leitura dos documentos de
planejamento antigos como lista de tarefas: vários deles descrevem o jogo antes
de ele existir, com números que o código já superou.

## Método e estado atual

Auditoria read-only de 2026-10-22 cruzou os documentos 00 a 38 com `src/`,
`test/` e `tools/`. Números do código: 86 áreas, 454 estações, 93 cavernas, 561
itens, 464 fichas, 284 missões, 194 NPCs, 2.300 entradas de wiki, 887 perguntas
de duelo, 130 módulos e 92 testes node. `npm run validate` passa (lint,
contrato de módulos, testes e build) e a matriz de navegador dá 19/19.

Esforço: **P** até um dia, **M** de dois a cinco dias, **G** mais de uma semana.
Estado: **feito**, **parcial**, **ausente**, **decisão** (produto, não código).

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
| documentos que mentem | **feito** | todos os documentos de conceito (00 a 13) estão congelados com aviso apontando o README e este backlog; os de engenharia (14 a 38) trazem medição; a pasta `README.md` separa as duas metades. 14 §AB fecha com a prova e remete a este mapa | P |

## Onda 2: sistemas que já têm casa

| item | estado | o que falta | esforço |
|---|---|---|---|
| grafo de conceitos + domínio 0 a 5 + revisão espaçada + caderno | **núcleo feito** | domínio 0-5 no save, revisão espaçada por área, baralho prioriza vencido e **ordena a área mais fraca primeiro** (`test/adaptativo.test.mjs`), caderno no diário; faltam arestas do grafo, misconceptions, formatos e prova de transferência | M a G |
| misconceptions e escolha adaptativa | parcial | **escolha adaptativa feita**: o baralho do duelo começa pela área de menor domínio, área nunca respondida conta como zero e a revisão vencida continua na frente (`test/adaptativo.test.mjs`); falta erro por distrator (conteúdo de 887 perguntas) | M |
| dicas em escada e foco | **feito** | botão de dica no duelo: 1 mana por passo, passo 1 risca duas erradas, passo 2 risca mais uma, passo 3 revela a correta, zera na pergunta nova e leva o foco para a alternativa viva; `test/duelo-dica.test.mjs` e `cdp-dica.mjs` | M |
| formatos de pergunta e prova de transferência | ausente | hoje só A-E; decidir com o dono a colisão com "não há prova final" | G |
| ofícios por continente e mercador de troca | parcial | **mercador de troca feito**: quatro ofertas material por material no guardião de qualquer cidade, sempre com perda e sem leilão (`test/mercador.test.mjs`, `cdp-mercador.mjs`: 5 madeiras → 1 madeira e 1 ferro); falta separar o ofício (receita) por continente | M |
| magias, encantos e consumíveis no alvo do desenho | **feito** | 12 encantos (`test/encantos.test.mjs`), 12 runas (6 novas em `test/runas-novas.test.mjs`) e 9 poções + 15 comidas, com cura, mana e buff medidos (`test/consumiveis.test.mjs`); wiki 2.300 fichas, 561 itens, 39 receitas | M |
| famílias, variantes e fraqueza numérica | **feito** | 25 formas em 5 famílias, faixa no bestiário e +50% contra a família completa (`test/familias.test.mjs`, previsão 1,1 → 1,7). **Variantes**: eco (10%), elite (5%) e antiga (3%) decididas por caverna e sala, trocando vida, dano, XP, material, cor e nome, com linha no duelo (`test/variantes.test.mjs`, `cdp-variantes-criatura.mjs`: "Sílaba Antiga" com vida 6) | M |
| clima afetando spawn | **feito** | chuva, neblina e rajada trocam o elenco do subsolo pelo clima (`nomeDaCacada`), sem mexer em sala, posto ou tier; o relógio do clima passou a andar no laço (não só no desenho) e o `forcarEvento` emite os ganchos; `test/cacada-clima.test.mjs` e `cdp-cacada-clima.mjs` (6 de 6 bichos molhados na chuva, 7 no limpo) | M |
| audição, alerta, patrulha e perseguição | **feito** | **audição, sono, isca, patrulha e perseguição**: correr perto vira o rosto para o som com `?`; um quinto nasce dormindo (`z`) e acorda com passo perto ou corrida; a **isca** atrai os bichos a menos de 8 tiles por 6 s e quem come não ouve nem vê. A **patrulha** dá a cada bicho acordado uma rota fixa de até quatro pontos em volta do posto (raio 1,4), ida e volta pelo posto; só entra ponto com a reta livre até o posto, e o índice anda mesmo quando o caminho bloqueia. O passo corrido vira **perseguição**: ele caminha até o último ponto ouvido por 2,6 s, desiste se bater parede e volta para casa. O raio maior custou 14% dos bichos (201 → 172 em 31 cavernas), e o espaçamento entre postos acompanha para os campos de visão não se cruzarem. Provas: `test/audicao`, `test/isca`, `test/patrulha`, `cdp-audicao`, `cdp-sono`, `cdp-isca` e `cdp-patrulha` (109 rotas em 137 bichos acordados, 9,4 tiles andados em 20 s, 2 de 3 bichos tocando dois pontos, 0,4 a 1,4 tile de avanço na perseguição, volta a 0,1 a 0,8 do posto) | M |
| escudo que barra erro e resistência por tipo | parcial | **escudo equipado feito**: segura o primeiro erro de cada duelo, gasta a carga, avisa na leitura e na ficha, não gasta com runa/espelho e recarrega no duelo seguinte (`test/escudo-equip.test.mjs`, `cdp-escudo.mjs`: vida 28 no primeiro erro, 25 no segundo); falta resistência por tipo (qual tipo: espécie, trait ou disciplina, decisão) | M |
| party humana em combate | ausente | party social de 8 existe, duelo não junta humanos | G |
| passo de pet e idle por espécie | **feito** | gato e sapo alternam quatro patas, coruja/papagaio viram a cabeça, fada pulsa, grilo esfrega a pata, sombra ondula; `test/animacao-idle.test.mjs` [ao andar] alterna patas | M |
| gesto de NPC por papel | **feito** | guia aponta o caminho, monitor ergue a mão, mestre folheia livro; só parado e de frente, fase por posto (`npc.bob`), troca o braço em vez de somar; `test/gesto-npc.test.mjs` e `cdp-gesto-npc.mjs` | M |
| funções das peças temáticas | **feito** | as três peças respondem ao F, uma vez por descida: oficina afia (+1 de dano por 3 min), biblioteca guarda uma dica que risca duas alternativas no próximo duelo (e no treino) e observatório acende a sala do chefe no mapa (35 casas medidas); `test/pecas-tematicas.test.mjs` e `cdp-pecas-tematicas.mjs` | M |
| tema de sala por área | **feito** | a peça veste a área, não só o continente: `varianteDaPeca` escolhe pelo id da caverna um de três arranjos (ferramenta da oficina, arranjo da estante, inclinação da luneta); `cdp-variantes-sala.mjs` mede 3 desenhos distintos por peça | M |
| teste de fluxo real de loja e duelo | **feito** | loja aberta pelo guardião com F, compra real (material cobrado, peça na mochila, cartão vira "já é sua") e troca do mercador medidas em `cdp-loja.mjs` e `cdp-mercador.mjs`; o duelo já era exercido por `cdp-duelo-ritmo.mjs`, `cdp-dica.mjs` e `cdp-voz.mjs` com bicho real de caverna | M |
| acessibilidade: voz, escala, daltonismo | **feito** | teclado, foco e aria-live; **voz** (ouvir/parar, pt-BR); **resultado sem cor** (✓ e ✗, letras A-E no toque); **texto maior** nos painéis de leitura (15% no desktop, salvo no save, sem zoom no celular). Provas: `test/voz-duelo`, `test/duel-acessivel`, `test/fonte`, `cdp-voz`, `cdp-duelo-a11y`, `cdp-fonte-maior` (parágrafo 46 → 53 px, zero estouro) | M |
| save versionado, migração e exportar/importar | **feito** | backup carrega `v: 1` e só aplica as chaves conhecidas com valor JSON válido; a Rede ganhou `baixar arquivo` (JSON legível, sem a chave da conta) e `carregar arquivo` (recusa lixo, aplica e recarrega); `test/save-arquivo.test.mjs` e `cdp-save-arquivo.mjs` (7 partes, v1, nome trocado pelo arquivo) | M |
| linter de conteúdo | ausente | validação só em teste; falta revisor e versão por pergunta | M |
| ferries, elevadores, ciclo dia/noite, mapa grande, pontes por missão | parcial | **ciclo dia/noite feito**: 8 minutos por volta, véu de até 0,42 na meia-noite e 0 no meio-dia, com aviso na troca; `test/dia-noite.test.mjs` e `cdp-dia-noite.mjs` (noite 31% mais escura). Skiff, túnel e 54 travessias fixas existem; faltam ferries, elevadores, mapa grande e pontes por missão | M cada |
| arcos de NPC, murais e bilhetes | **feito** | **bilhetes**: 93 cavernas com nota na parede da cidade, da lição da área (70), da relíquia (16) ou do lugar (7), lida no F (`test/bilhetes.test.mjs`, `cdp-bilhete.mjs`). **Arco do guardião**: a missão do chefe de cada área virou segundo capítulo, trancada até a trilha fechar, com aviso no cartão; 86 pares medidos (`test/arcos.test.mjs`, `cdp-arcos-npc.mjs`: só a trilha e o aviso, depois o chefe) | M |
| presets de build na ficha | **feito** | a ficha guarda até três retratos do equipamento: `salvar a atual`, `usar` (troca o conjunto inteiro e avisa peça que faltou) e `remover`; save valida slot e sobrevive à recarga; `test/builds.test.mjs` e `cdp-builds.mjs` | P |

## Arquitetura

| item | estado | o que falta | esforço |
|---|---|---|---|
| mundo sem rendering | **feito** | `world.js` não importa mais `rendering/`: a colocação do ambiente foi para `src/world/povoado.js` e o tamanho das construções para `src/content/asset-meta.js`, fonte única entre desenho e mapa; `test/arquitetura.test.mjs` cobra os quatro pontos e a matriz de navegador deu 19/19 com 60,1 fps depois | P |
| arquivos grandes (app 3,4 mil, dungeon 2,2 mil, rpg 1,9 mil linhas) | decisão | cada um é coeso por domínio e o contrato de módulos está sem ciclos (130 módulos, 287 dependências). Separar agora é risco sem ganho medido; reavaliar quando uma mudança precisar tocar o mesmo trecho por três frentes | G |
| sondas CDP fora do repositório | decisão | ver pergunta 10: trazer todas engorda o repositório público com dependência de Chrome | — |

## Onda 3: conteúdo grande e endgame

| item | estado | o que falta | esforço |
|---|---|---|---|
| Grande Prova, Biblioteca Afogada, guilda | ausente | corrente de 7 missões, tela de escolha e biblioteca; guilda depende de camada social | G |
| arco principal em capítulos e lore da Iara | ausente | 284 missões geradas, sem arco narrativo | G |
| facções e reputação | ausente | nenhuma facção | G |
| planta de casa por disciplina/ilha | parcial | duas plantas por tipo; falta uma por continente/área | G |
| moeda Selo | ausente | preço em material; decisão de economia | G |
| editor de mapa e WebGL do mundo | ausente | ferramenta e render alternativo | M cada |
| grade de ilhas regular | parcial | catálogo nasce em malha 24x16; jitter exige regenerar o literal e revalidar 2.413 alvos | M |

## Decisões que dependem do dono

1. **Prova final**: o desenho 01 §13 pede exame por continente; o texto atual do
   jogo diz que não há prova final. Escolher um dos dois antes de implementar.
2. **Leilão**: os documentos 03 e 07 proíbem leilão global; o item de troca
   local por material é o que falta de verdade. Confirmar.
3. **Endgame e lore**: Grande Prova, Biblioteca, facções e arcos são semanas de
   conteúdo. Confirmar se entram agora ou ficam como fase seguinte.
4. **Nomes e tom**, **chefe do hub**, **variantes raras** e **bestiário em
   party** continuam como escolha de produto.

Perguntas exatas que ficam abertas depois das entregas de 2026-10-22:

5. **Escala de fonte**: implementada como **texto maior** nos painéis de leitura
   (15% no desktop, opção na Ajuda, salva no save, sem efeito no celular, que já
   usa letra maior). Se quiser que os 131 rótulos do HUD também cresçam, isso
   exige converter px para uma unidade escalável: decidir.
6. **Ofícios por continente**: as 20 receitas atuais são todas do porto, então
   um filtro por continente não teria o que filtrar (conferido no código). A
   decisão é de conteúdo: cada forja ganha 3 a 5 receitas próprias (quais peças,
   que material, que preço) ou a forja fica global e o assunto fecha?
7. **Resistência por tipo**: o escudo equipado já segura um erro por duelo.
   "Resistência por tipo" é por espécie (ex.: cascudos comem menos dano), por
   caráter (divisão, desvio, pressa, casco) ou por disciplina da pergunta?
8. **Variantes elite/antiga/eco**: raras por descida (visual e recompensa
   próprias) ou só em camada profunda? Entram no bestiário como ficha nova ou
   como marca da mesma criatura?
9. **Misconceptions por distrator**: são 887 perguntas; escrever uma explicação
   para cada distrator é trabalho de conteúdo (semanas). Autorar por amostra e
   medir, ou só quando a pergunta voltar a ser reescrita?
10. **Dívida de arquitetura e sondas**: as sondas CDP citadas nos documentos
    vivem fora do repositório (`temporarios/`). Trazer todas para `tools/`
    engorda o repositório público com dependência de Chrome. Trazer só um
    subconjunto de regressão, ou manter fora e documentar o caminho?

## Critério de pronto

Cada item acima só vira **feito** com teste ou sonda que falha sem ele, prova no
navegador quando for interface, `npm run validate` verde, commit, push e
verificação no site publicado.

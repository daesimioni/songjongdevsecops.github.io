# Mundo de Song

No ar em <https://songjongdevsecops.github.io/>.

Um blog pessoal que se atravessa a pé. O site é um arquipélago em pixel art:
você entra com um boneco, cruza pontes e encontra 279 estações. Cada estação é
uma página com um texto curto e um instrumento interativo. Ao todo, 86 áreas:
as 16 originais mais uma para cada seção do catálogo de Matemática, Física,
Química, Computação, Língua Portuguesa e das 11 interseções entre elas.

## O arquipélago

| continente | estações |
|---|---|
| **Porto do Início** | a fonte de boas-vindas e o rádio com um sequenciador de oito passos |
| **Computação** | portas lógicas, somador de quatro bits, flip-flop e contador, CPU de brinquedo e uma linha do tempo da computação |
| **Matemática** | paradoxos do infinito, sólidos platônicos em 3D, derivada e integral, máquina de Galton, fractais e a área da análise (limites, séries, caçada e caverna próprias) |
| **Física** | pêndulo, série de Fourier, gás ideal, prisma de Newton, órbitas gravitacionais e a área do eletromagnetismo (indução, Maxwell, caçada e caverna próprias) |
| **Química** | tabela periódica interativa, moléculas em 3D, titulação, energia de reação, balanceamento e a área orgânica (carbono, polímeros, caçada e caverna próprias) |
| **Música** | polirritmia, intervalos e razões, temperamento e escalas, timbre aditivo, música generativa e a área da acústica (ressonância, instrumentos, caçada e caverna próprias) |
| **Inteligência Artificial** | regressão linear, rede neural que aprende um círculo, tokens e predição, convolução de imagem, ética e a área da visão (convolução, detecção, caçada e caverna próprias) |
| **Vale da Língua** | etimologia, concordância, acentuação e hífen, gêneros textuais, crase e a área da literatura (narrador, poesia, caçada e caverna próprias) |

O mapa tem 300 por 200 tiles, sete continentes e dezesseis áreas temáticas, ilhas, um anel de pontes entre
elas e um porto
central. No subsolo, o túnel da conurbação liga as 21 cidades descobertas, e o Porto Submerso, na camada -2, tem um portal para cada capital. O minimapa começa coberto por névoa e revela o que você anda. Cada
estação descoberta vira um fragmento no diário e soma experiência. As Pedras do
Porto, nas docas, abrem a viagem rápida entre os continentes já visitados.

Segure `Espaço` para acender a nave e cruzar o mapa mais rápido; no celular,
segure o botão **Turbo**. A nave é um pequeno skiff que flutua, balança e deixa
rastro, mas não atravessa água: as pontes continuam sendo caminho.

No teclado: `WASD` ou setas andam; segure duas direções para andar na diagonal.
`Espaço` liga a nave, `F` interage, `Q` abre a conversa, `E` a Rede, `Z` o
diário e `C` a ficha. `Enter` também abre a conversa.

A praça compartilhada mostra outras pessoas na mesma sala. Não existe servidor
próprio: o site é estático e o sinal usa um broker MQTT público por WebSocket.
Se o sinal falhar, o mundo continua funcionando sozinho.

O estado de cada jogador vai a 10 Hz, com número de sequência. O desenho guarda
um pequeno buffer e interpola entre pacotes, então os outros bonecos caminham
contínuos em vez de dar pulinhos; o custo é cerca de 200 ms de atraso visual.

A conversa da sala tem um histórico curto no próprio campo de fala: as mensagens
novas entram embaixo, as antigas sobem e somem, e o que sobra fica guardado na
sessão do navegador por sala. `Q` ou `Enter` abrem a conversa; dentro dela, `Enter`
envia e fecha; depois de fechar, `Enter` ou `Q` abrem de novo. Esc fecha sem enviar.

## Missões

Vinte NPCs vivem no mapa: os sete guias de continente dão missões, seis
treinadores abrem o treino e sete viajantes só conversam. Um `!` flutuante marca
quem tem missão para dar; quando o objetivo está cumprido, ele vira `?`. Aperte
`F` perto deles para aceitar, responder e entregar. São três tipos:

- **caminhada**: abrir estações, acender os sete faróis, mexer em oito
  instrumentos diferentes.
- **pergunta**: um enigma por NPC, com explicação depois da resposta. Errar não
  custa nada, tentar de novo é o ponto.
- **rede**: falar no canal público e mandar uma DM para alguém.
- **caçada**: derrubar três monstros dentro de uma caverna.

Cada missão dá XP e um título. O Diário (`Z`) mostra o que está em andamento,
quanto falta e o que já foi concluído. O cartão do NPC mostra o mesmo progresso
e o botão de concluir quando o objetivo está cumprido.

## Treino na superfície, caçada na caverna

Clique no chão e o boneco anda até ali sozinho, contornando água, parede e
árvore. Clique também no minimapa, desde que o ponto já esteja revelado. Clique
numa estação, NPC ou boca de caverna para ele ir até perto e interagir. Se a
conversa estiver aberta, o clique no mundo fecha a conversa e anda. WASD ou as
setas cancelam o caminho.

A superfície é sala de aula. Em cada clareira com bandeira fica um **instrutor**:
`F` nele abre três treinos (fácil, médio, difícil) com o mesmo tema e o mesmo
baralho da caverna daquele continente. No treino, errar **não tira vida**, a
vitória **não dá loot** e a perícia do continente continua subindo.

Quem paga é o bicho da caverna. Cada monstro abre uma prova de perguntas,
sempre com **seis alternativas, de A a F**, e a vida do bicho é o número de
acertos que ele aguenta:

- **fácil**: 3 acertos, errar tira 2 de vida.
- **médio**: 7 acertos, errar tira 3.
- **difícil**: 12 acertos, errar tira 4.
- **chefe**: 18 acertos, errar tira 6.

O dano por acerto tem teto de 3, então o difícil continua sendo uma conversa
longa mesmo com equipamento completo. O baralho do duelo começa pelas perguntas
do andar do bicho e completa com as dos outros andares do continente, sem
repetir pergunta no mesmo duelo.

Acertar também sobe a perícia do continente (Lógica, Abstração, Mecânica,
Reação, Harmonia, Inferência). A perícia aumenta o dano. Cada vitória dá XP e
item; os monstros voltam depois de cinco minutos, o chefe depois de vinte. O item
do chefe é uma relíquia: cada uma soma 5 de vida máxima.

**Fugir sempre arrisca.** A chance de levar um golpe na fuga cresce com o bicho:
20% no andar de cima, 38% no meio, 55% no fundo e 72% no chefe. O café da horta
tira 10 pontos dessa chance enquanto dura, e o golpe usa o dano do andar. Se a
vida zerar, o boneco acorda no Porto com a vida cheia, sem perder item nem XP.

A **Ficha** (`C`) mostra vida, nível, perícias, mochila e a forja. A vida volta
devagar fora de duelo; a Poção de Café cura 18, o Caldo de Caverna cura 35.

Estações, pedras e mobília barram a passagem. Os NPCs não: cada um passeia de
vez em quando dentro do seu posto (a guia pelo cais, o instrutor pela clareira),
sempre por chão livre, sem entrar em água, árvore ou parede. Na superfície não
há monstro solto. O desenho é ordenado por profundidade, então uma fonte, árvore
ou parede na frente do boneco cobre o corpo dele em vez de ficar sempre atrás.

## Matilha e magias

Quando até quatro monstros veem você na mesma janela, todos perguntam **na
mesma tela**, em duas colunas: o principal à esquerda e a matilha à direita,
cada bicho com a própria pergunta e a própria vida. Cada um pode cair antes dos
outros, e a vitória soma o XP e o loot de todos. Com mais de quatro na janela,
três acompanham o principal e o resto entra na fila; o HUD mostra `matilha N`
enquanto houver fila. Fugir limpa a fila; o risco é do bicho que
está na frente. No celular as colunas empilham, mas as perguntas continuam
juntas.

A barra de **magias** do duelo tem seis runas forjáveis (forja da cidade):

| runa | efeito | receita |
|---|---|---|
| faísca | risca uma alternativa errada da pergunta | veio 2, erva 1 |
| trovão | 2 de dano no monstro da frente, sem responder | ferro 1, veio 2 |
| fogo | 1 de dano em todos os monstros da tela | veio 2, ferro 2 |
| gelo | passa a pergunta sem responder e sem dano | veio 2, madeira 1 |
| cura | recupera 12 de vida | erva 2, veio 1 |
| espelho | o próximo erro não tira vida | veio 3, erva 1 |

Cada uso gasta uma runa; a barra mostra quantas restam. A primeira carga de
uma runa **ensina a magia**: quando as cargas acabam, ela continua saindo por
mana (2 a 4), a mesma mana que alimenta as habilidades dos bichos. Runas
aprendidas aparecem na barra com o custo em mana em vez da carga. Fora do
duelo a runa volta para a mochila em vez de desaparecer.

## Nave, traje e equipamento

A nave fica 4,4 vezes mais rápida que o passo e agora também funciona dentro da
caverna: segure `Espaço` (ou o botão **turbo** no topo da caverna). O boneco vai
parado no casco, sem perna alternando, e o passo é dividido em pedaços para não
atravessar parede na velocidade nova.

O traje é escolha da pessoa, não do lugar. São sete: o **Viajante** desde o
começo e um por continente, aberto ao completar as cinco estações. A **Ficha**
(`C`) abre o editor; a mesma roupa aparece na superfície, na caverna, no duelo e
para os outros jogadores pela rede.

A Ficha também tem **equipamento**: arma, elmo, armadura, pernas, botas, escudo,
anel e colar. Cada peça soma pouco (arma +1 ou +2 de dano; armadura +4 ou +5 de
vida) e cai de baú de caverna ou de chefe. A ideia é fôlego e vocabulário, nunca
resolver a pergunta pelo número. São 23 peças, incluindo anéis e colares.

## Companhia: bichos e montarias

A Ficha (`C`) tem a seção **Companhia**: mana, o bicho que anda com você e as
montarias. Um bicho e uma montaria ficam ativos por vez, e a escolha é o que dá
propósito a cada um.

Todo bicho é domado com três **rações de caverna** na praça subterrânea do
continente onde ele vive. Cada um tem um passivo, uma habilidade com mana e
recarga, e um lugar próprio na aventura:

| bicho | passivo | habilidade | mana | recarga |
|---|---|---|---|---|
| Gato do Porto | +5 vida, +1 luz | faro: risca uma alternativa errada | 2 | 60 s |
| Coruja do Lema | +2 luz | sabedoria: aponta a alternativa certa | 4 | 180 s |
| Sapo de Calcário | +8 vida | cura: recupera 20 de vida | 3 | 120 s |
| Vaga-lume de Vidro | +2 mana máxima | pulso: devolve 3 de mana | 0 | 90 s |
| Grilo do Compasso | +1 mana por acerto | ritmo: +1 de dano por 2 min | 2 | 150 s |
| Sombra da Caixa | +1 dano | aviso: tema e fraqueza do monstro | 1 | 90 s |
| Papagaio do Vale | +3 vida, +1 luz | tagarela: risca duas alternativas | 3 | 120 s |

A **mana** começa em 10, volta 1 a cada 45 segundos e é o combustível das
habilidades. A ficha mostra a mana e a recarga; no duelo, o botão do bicho fica
na coluna da pergunta.

As **montarias** são compradas na ficha com material de caverna e só andam na
superfície: entrar numa boca de caverna desmonta. O cavalo do cais corre 50%
mais rápido, o lobo cinza 30% e enxerga longe, e a tartaruga de vidro anda 12%
mais rápido, mas o casco soma 5 de vida.

O gato do porto só segue depois de domado, e o companheiro de verdade é o bicho
ativo: a espécie que aparece atrás de você na superfície é a mesma que anda
pela trilha da caverna. O gato respeita água, árvore e parede; quando fica longe
demais, reaparece num chão livre atrás de você em vez de atravessar o mar.

## Áreas temáticas

Cada continente pode ter **áreas**, e cada área é um pedaço de mundo com vida
própria: estações, clareira de caçada com instrutor, duas bocas de caverna e uma
caverna só dela, com chefe, material e equipamento. A primeira área pronta é a
**Física · Eletromagnetismo**, numa ilha ligada por ponte ao sul da Física: tem
a Oficina da Indução e a Torre de Maxwell, o NPC Faraday com missão, a Caçada
dos Circuitos e as Galerias do Eletromagneto.

A segunda área pronta é a **Computação · Arquitetura de Computadores**, na
costa leste: Sala do Pipeline, Oficina dos Registradores, Von Neumann com
missão, Caçada das Instruções e a Galeria das Instruções.

A ideia é que cada área cresça até ter o tamanho de um continente de hoje. A
estrutura já é a mesma: a área é declarada em `AREAS` (em `js/config.js`), as
estações entram em `SITES`, a caçada em `GROUNDS` com o campo `dungeon`, e a
caverna em `dungeon-data.js`. O resto (instrutor, bocas, caminho, viagem) o
mundo monta sozinho, e a pedra da área aparece na lista de viagem.

## As cavernas

Cada continente tem **duas bocas de caverna**, uma perto da clareira e outra a
alguns tiles. Elas são pareadas pelo túnel: a escada da entrada volta para a boca
por onde você desceu, a escada do fundo (na cidade subterrânea) sai na outra
boca, e a pedra de retorno devolve à entrada. No minimapa cada boca é um
quadradinho vazado, e cada escada do subsolo vira uma setinha para cima.

A escada é desenhada como subida, não como buraco: degraus que clareiam e
estreitam para o alto, um retângulo de luz da superfície no topo e uma seta de
pedra apontando para cima. O prompt confirma o destino (`F subir para Boca do
Silício`).

`F` numa boca entra no mapa em tela cheia: salas ligadas por túneis, entrada
embaixo, cidade no fundo. Seis temas, um por continente, com paleta, nomes e
bichos próprios, e seis traçados de túnel diferentes: em cotovelo, desvio no
meio, largo, cruzado, serpente e estreito. Metade das cavernas espelha as salas
laterais. O HUD marca a camada (`subsolo -1`).

Lá embaixo valem as mesmas regras do mundo, com uma diferença: o bicho que vê
você começa a batalha sozinho. Ele anda em volta do ninho, tem um raio de visão
e precisa de linha reta até o aventureiro; quando isso acontece, aparece um `!`
e o duelo de perguntas abre. Quanto mais fundo, mais forte: as salas perto da
entrada têm monstros de uma estrela, as do meio de duas, as do fundo de três, e
o chefe fica no último beco, sem alavanca. Ele responde com perguntas médias e
difíceis e deixa a relíquia do continente. Fugir de um encontro sempre pode custar
vida, e o risco está escrito no botão de fuga.

Cada sala tem baú. Baú fundo é selado e pede uma **Chave de Caverna**, que se
faz na forja. A caverna dá ferro, erva, cristal de veio e madeira; os **veios de
cristal** presos nas salas só se abrem com uma **picareta**, que também se forja.

Na cidade subterrânea há forja, altar que devolve vida, três canteiros de erva,
mesa de encantamento, um bicho, a pedra de retorno e a escada para a outra boca.
A **mestra** da cidade vende as peças de equipamento do continente por material:
a arma custa ferro e veio; a armadura custa ferro e erva; pernas, botas, elmo e
escudo têm preço próprio. Não existe moeda. A horta se planta com
semente e cresce em 45 segundos; a primeira horta de cada caverna nasce com uma
erva de presente (e devolve uma semente), para o ciclo começar, e o que você
planta continua plantado na próxima descida. A mesa grava três encantos permanentes: mais
vida, mais dano ou mais luz. O bicho aceita três rações e passa a seguir você,
somando vida e luz. A forja faz picareta, semente, ração, comida, tocha, chave e
bomba.

A **tocha** acende por dois minutos e aumenta a luz; a **bomba** espanta os
bichos num raio de três tiles, sem XP e sem saque. O **café** acelera os passos,
o **assado** aumenta o dano e o **doce** aumenta a vida máxima; o caldo é o cura
grande. `C` abre a Ficha em qualquer lugar, `Esc` sobe de volta para a boca da
caverna. Monstros e chefe guardam o tempo de respawn de sempre; os baús e os
veios se reabrem a cada descida.

## Desempenho

O chão é pintado uma vez em blocos de 16x16 tiles e só o bloco visível é
copiado por frame; água e magma recebem o brilho animado por cima. Rótulos de
NPC, brilho de estação e a névoa do minimapa ficam em sprites prontos, e o que
está fora da tela nem entra na lista de desenho. Não sobra nenhum blend de tela
cheia: as listras de CRT viraram alpha simples, e em tela de toque o blur de
fundo dos botões sai fora.

Quando o frame passa de 26 ms, a resolução interna cai em degraus de 15% (até
60% do tamanho), o que troca nitidez por fluidez em aparelho fraco. No perfil
medido com o navegador headless e CPU reduzida por CDP:

| condição | antes | agora |
|---|---|---|
| CPU 6x mais lenta | ~46 fps | ~46 fps, desenho em ~3 ms e chão em ~1 ms |
| CPU 12x mais lenta | ~22 fps | 36 a 39 fps com resolução em 0.6 |

O número de 12x é o que mais se parece com celular antigo: o ganho vem da
resolução adaptativa, do cache de chão e do corte do que não aparece. O boot
segue em torno de 2,6 s num perfil frio, quase tudo carregando módulo e
montando o mundo.

## No celular

A página é feita para o toque, não adaptada depois:

- **andar**: direcional na base ou toque no chão. Segurar o direcional continua
  andando; **Turbo** acende a nave.
- **agir**: o botão **A** interage com estação, NPC, caverna e baú. No celular ele
  troca o `F` do teclado.
- **tudo à mão**: Falar, Rede, Diário, Ficha, som e ajuda ficam numa linha só no
  topo, com 38 pixels de altura ou mais e sem letra miúda de atalho. A barra de
  status da praça encurta para caber.
- **caverna**: toque no chão para andar e no objeto para interagir; o minimapa
  aparece menor no canto e a ajuda vira "toque no chão, toque no objeto". Ficha e
  sair ficam em botões no topo.
- **conversa**: o campo tem 16 px (o iPhone não dá zoom ao focar) e a barra sobe
  junto com o teclado usando a área visível do navegador.
- **modais**: largura total, altura de 90% da tela, cabeçalho com o fechar preso no
  topo e alternativas de 44 px ou mais. Nada de alvo pequeno.
- **paisagem**: o HUD compacta, o minimapa sai da frente dos botões e a ajuda da
  caverna fica só nos controles. As bordas respeitam o `safe-area-inset` do
  aparelho.

A conferência de toque roda em viewport de 390×844, 360×640 e 844×390, com
eventos de toque reais e sem erro de console.

## Acessibilidade

O jogo inteiro tem caminho de teclado: WASD ou setas andam, `F` interage, `Q`
fala, `E` abre a Rede, `Z` o diário, `C` a ficha e `Esc` fecha. Quando um painel
ou modal abre, o foco entra nele e fica preso até fechar; ao sair, o foco volta
para o botão que abriu. O `Tab` não passeia por trás do diálogo.

O que muda na tela é anunciado: o prompt do chão, o recado da caverna, o
resultado da pergunta e o título do duelo são regiões `aria-live`. Os botões têm
`type`, as imagens têm `alt` e os diálogos apontam para o próprio título com
`aria-labelledby`. Com `prefers-reduced-motion`, as animações de interface param.

Se o navegador não abrir WebGL, o cristal 3D e o visualizador de moléculas não
somem: o primeiro avisa e mantém a explicação; o segundo troca o desenho pelas
abas com a história de cada molécula. O mapa em si é visual: quem usa leitor
de tela anda com as setas e ouve o prompt que anuncia o que está perto. Um índice
de estações fora do mapa ainda não existe, e é a próxima lacuna a resolver.

## A Rede

A conta do jogador é uma chave Nostr criada e guardada no próprio navegador.
Não tem cadastro, e-mail nem servidor nosso. A chave pública (`npub`) identifica
a pessoa; a privada (`nsec`) fica no `localStorage` e pode ser exportada ou
trocada na aba **Conta** da Rede. Quem tiver a nsec controla a conta.

A janela **Rede** (`E`) tem quatro abas:

| aba | o que faz |
|---|---|
| **Mundo** | canais públicos, um geral e um por continente |
| **DMs** | conversas privadas com NIP-17, com selo e cópia local |
| **Pessoas** | quem está no mundo agora, quem está na sua sala e o botão de desafiar |
| **Conta** | chave, perfil público, relays e recomeço de identidade |

Os relays são públicos (`relay.damus.io`, `nos.lol`, `relay.nostr.band` e
`relay.primal.net`). Mensagens de canal são eventos Nostr com os selos
`client=mundo-song` e `game=mundo-song` e um tag de canal
`mundo-song:v3:<canal>`; só eventos com esses selos entram na tela, então
nenhum conteúdo de fora do jogo aparece ali. As DMs usam NIP-17
(gift wrap), então o relay não lê o texto. A presença é um evento efêmero com o
continente em que a pessoa está.

### Backup na sua DM

O jogo guarda a conta inteira na sua própria DM do Nostr. A cada cinco minutos
de jogo, e quando a aba fica escondida, o estado local vira JSON, passa por
gzip, vira base64 e é enviado como DM NIP-17 para a sua chave. O relay só vê um
gift wrap cifrado; ninguém além de quem tem a nsec consegue ler.

O backup inclui cards, xp, docas, névoa, nome, som, sala, missões, rpg e traje.
Ficam de fora a **nsec** (é a chave que decifra a DM, não pode viajar dentro
dela) e o **chat** (conversa de terceiros). O envelope leva a hora do envio, e
a DM só é reenviada quando o estado muda.

Numa conta nova, num navegador novo, o jogo busca os backups dos últimos 30
dias e restaura sozinho o mais recente. Se o navegador já tem progresso, nada é
trocado sem você mandar: a aba **Conta** da Rede mostra a hora do último envio e
tem os botões **salvar agora** e **carregar da DM**. O estado comprimido ocupa
menos de 1 KB na maior parte das contas, então cabe folgado numa DM.

O [nostr-tools](https://github.com/nbd-wtf/nostr-tools) vem de ESM.sh e é
carregado só quando a Rede liga. Se os relays não responderem, o jogo continua
a pé e a Rede avisa.

## Duelo entre jogadores

Na aba **Pessoas**, cada jogador da mesma sala tem um botão **desafiar**. O
convite vai pelo mesmo MQTT da sala, com QoS 0; aceitar não move ninguém de
continente. O desafiante vê cinco cartas, uma por dificuldade (muito fácil a muito
difícil), e escolhe qual mandar. O outro responde em até 30 segundos: acertou,
defendeu e o atacante ataca de novo; errou, toma dano e a vez passa para ele.

Cada um começa com 10 de compostura. O dano é a dificuldade da carta (1 a 5) mais
até 2 de bônus por relíquias: no máximo 7. Quem chega a zero perde e fica **10
segundos desativado**, sem andar nem interagir. Nada de vida, item ou XP é
perdido: é um duelo de conversa, não de saque. O broker é público e as mensagens
não são assinadas, então o duelo vale entre gente que combinou; não é ranking.
Fechar a janela no meio conta como desistência e também desativa. Os pacotes de
pergunta são validados antes de
entrar na tela; a pergunta trafega com as três alternativas e a resposta é
conferida dos dois lados.

## Conferir

A parte que não depende do navegador tem três conferências, e elas rodam em
sequência sem instalar nada:

```bash
node test/core.test.mjs
node test/content.test.mjs
node test/ui.test.mjs
node test/backup.test.mjs
```

A primeira cobre o progresso e a persistência das missões, o filtro que mantém
conteúdo de fora fora dos canais, o ciclo de duelo, dano e chefe, a interpolação
dos outros jogadores, a superfície sem monstro e com um instrutor por clareira, o
treino sem dano e sem loot, o risco de fuga por andar, o dano direto e o respawn,
e a caverna: salas com chão, ligação da entrada até a cidade, linha de visão,
chefe sem alavanca, a forja, os encantamentos, a comida com efeito, o bicho e a
pergunta que casa com o tema. O duelo entre jogadores entra pela mesma prova: as
cinco cartas, a dificuldade que vira dano e a compostura.

A segunda confere o conteúdo inteiro: as 279 estações e seus textos, falas de NPC,
112 missões, itens, equipamento, relíquias por continente, receitas, encantos, as
833 perguntas (sem repetição e com resposta válida), as cinco cartas do PvP por
continente, as 93 cavernas e o mundo montado (93 instrutores, 186 bocas, nenhum
monstro na superfície). Confere também a cobertura das 82 seções do catálogo:
cada uma precisa de área, caverna, NPC com missão e três perguntas próprias.

A terceira confere a casca: id repetido ou faltando, import que não resolve,
botão sem `type`, imagem sem `alt`, link `_blank` sem `rel`, `aria-labelledby`
apontando para id inexistente, `data-close` órfão e `console.log` esquecido.

## Rodar na mão

Não tem build. Basta servir a pasta como arquivo estático:

```bash
python3 -m http.server 8000
```

Depois abra `http://localhost:8000`.

## Estrutura

| caminho | o que é |
|---|---|
| `index.html` | casca da página: mapa, HUD, painéis, modais, viagem, Rede e missões |
| `css/style.css` | o visual, do mundo aos widgets |
| `js/app.js` | laço do jogo, entrada, diário, XP, viagem e estado |
| `js/world.js` | geração do arquipélago, caminhos, pontes, colisão e névoa |
| `js/render.js` | desenho do mundo, das estações, dos bonecos e do minimapa |
| `js/net.js` | sala compartilhada por MQTT sobre WebSocket |
| `js/interp.js` | buffer e interpolação da posição dos outros jogadores |
| `js/nostr.js` | conta, canais, DMs NIP-17, perfis e presença Nostr |
| `js/backup.js` | estado inteiro na própria DM: base64, gzip e restauração |
| `js/quests.js` | missões, progresso, XP e títulos |
| `js/path.js` | caminho A* do clique até o destino |
| `js/rpg.js` | vida, perícias, itens, forja, encantos, buffs, bicho, monstros, treino, fuga e duelo |
| `js/rpg-data.js` | caçadas, monstros, itens, receitas, encantos e as 60 perguntas |
| `js/dungeon.js` | a caverna em tela cheia: mapa, minimapa, visão, veios, horta, bicho e desenho |
| `js/dungeon-data.js` | as seis cavernas: salas, temas, monstros e chefes |
| `js/creature.js` | desenho dos monstros no mapa e no duelo |
| `js/sheet.js` | a ficha de aventureiro |
| `js/duel.js` | a janela de prova contra cada monstro e o treino do instrutor |
| `js/pvp.js` | o duelo de perguntas entre jogadores |
| `js/social.js` | janela da Rede: canais, DMs, pessoas e conta |
| `js/audio.js` | síntese, ambiente e sequenciador |
| `js/content.js` | os 41 textos e as falas dos NPCs |
| `js/config.js` | mapa, continentes, estações, pedras e cores |
| `js/data/elements.js` | os 36 elementos da tabela periódica |
| `js/zones/` | os instrumentos interativos de cada região |
| `wasm/julia.wat` | fonte do módulo WebAssembly do conjunto de Julia |
| `wasm/julia.wasm` | o módulo compilado, de 296 bytes |
| `test/core.test.mjs` | conferência de missões, RPG, treino, fuga, duelo PvP e caverna |
| `test/content.test.mjs` | conferência das 279 estações, perguntas, itens, cavernas, áreas, cobertura do catálogo e mundo |
| `test/ui.test.mjs` | conferência de ids, imports, botões, rótulos e aria |
| `test/backup.test.mjs` | envelope do backup, whitelist, dedupe e restauração |

O módulo wasm é gerado com `wat2wasm`:

```bash
wat2wasm wasm/julia.wat -o wasm/julia.wasm
```

## Editar conteúdo

- Textos e falas: `js/content.js`.
- Posição e nome das estações: `js/config.js`, no array `SITES`.
- Cavernas (salas, temas, monstros, chefes): `js/dungeon-data.js`.
- Receitas, itens e perguntas: `js/rpg-data.js`.
- Elementos da tabela: `js/data/elements.js`.
- Instrumentos: `js/zones/`. Computação, matemática, física e química ficam em
  `cs.js`, `math.js`, `physics.js` e `chem.js`; música em `music.js`; IA em
  `ai.js`; as moléculas em 3D em `molecule.js`.

## Créditos

Three.js, p5.js, MathJax, Plotly, MQTT.js e nostr-tools vêm de CDN. O resto é
JavaScript de navegador, canvas, WebGL, Web Audio e WebAssembly. A fonte de
pixel é do Google Fonts, com queda para monoespaçada do sistema.

Feito por Song Jong, para brincar.

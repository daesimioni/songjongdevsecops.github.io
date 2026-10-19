# Mundo de Song

No ar em <https://songjongdevsecops.github.io/>.

Um blog pessoal que se atravessa a pé. O site é um arquipélago em pixel art:
você entra com um boneco, cruza pontes e encontra 32 estações. Cada estação é
uma página com um texto curto e um instrumento interativo.

## O arquipélago

| continente | estações |
|---|---|
| **Porto do Início** | a fonte de boas-vindas e o rádio com um sequenciador de oito passos |
| **Computaria** | portas lógicas, somador de quatro bits, flip-flop e contador, CPU de brinquedo e uma linha do tempo da computação |
| **Matemática** | paradoxos do infinito, sólidos platônicos em 3D, derivada e integral, máquina de Galton e fractais |
| **Física** | pêndulo, série de Fourier, gás ideal, prisma de Newton e órbitas gravitacionais |
| **Química** | tabela periódica interativa, moléculas em 3D, titulação, energia de reação e balanceamento |
| **Música** | polirritmia, intervalos e razões, temperamento e escalas, timbre aditivo e música generativa |
| **Inteligência Artificial** | regressão linear, rede neural que aprende um círculo, tokens e predição, convolução de imagem e ética |

O mapa tem 180 por 120 tiles, seis continentes, ilhas, pontes e um porto
central. O minimapa começa coberto por névoa e revela o que você anda. Cada
estação descoberta vira um fragmento no diário e soma experiência. As Pedras do
Porto, nas docas, abrem a viagem rápida entre os continentes já visitados.

Segure `Espaço` para acender a nave e cruzar o mapa mais rápido; no celular,
segure o botão **Turbo**. A nave é um pequeno skiff que flutua, balança e deixa
rastro, mas não atravessa água: as pontes continuam sendo caminho.

No teclado: `WASD`, `QEZC` ou setas andam, com `Q`/`E`/`Z`/`C` nas diagonais.
`Espaço` liga a nave, `Enter` interage, `F` abre a ficha, `J` o diário, `T` a
conversa e `R` a Rede.

A praça compartilhada mostra outras pessoas na mesma sala. Não existe servidor
próprio: o site é estático e o sinal usa um broker MQTT público por WebSocket.
Se o sinal falhar, o mundo continua funcionando sozinho.

O estado de cada jogador vai a 10 Hz, com número de sequência. O desenho guarda
um pequeno buffer e interpola entre pacotes, então os outros bonecos caminham
contínuos em vez de dar pulinhos; o custo é cerca de 200 ms de atraso visual.

A conversa da sala tem um histórico curto no próprio campo de fala: as mensagens
novas entram embaixo, as antigas sobem e somem, e o que sobra fica guardado na
sessão do navegador por sala. Enter envia; Esc fecha.

## Missões

Os sete NPCs do mapa dão missões. Um `!` flutuante marca quem tem missão para
dar; quando o objetivo está cumprido, ele vira `?`. Aperte `Enter` perto deles para
aceitar, responder e entregar. São três tipos:

- **caminhada**: abrir estações, acender os sete faróis, mexer em oito
  instrumentos diferentes.
- **pergunta**: um enigma por NPC, com explicação depois da resposta. Errar não
  custa nada, tentar de novo é o ponto.
- **rede**: falar no canal público e mandar uma DM para alguém.
- **caçada**: derrubar três monstros nas clareiras.

Cada missão dá XP e um título. O Diário (`J`) mostra o que está em andamento,
quanto falta e o que já foi concluído. O cartão do NPC mostra o mesmo progresso
e o botão de concluir quando o objetivo está cumprido.

## Caçadas e ficha

Clique no chão e o boneco anda até ali sozinho, contornando água, parede e
árvore. Clique também no minimapa, desde que o ponto já esteja revelado. Clique
numa estação, NPC, monstro ou alavanca para ele ir até perto e interagir. Se a
conversa estiver aberta, o clique no mundo fecha a conversa e anda. WASD, QEZC ou
as setas cancelam o caminho.

Cada continente tem uma clareira de caça com três guardiões e uma alavanca. Cada
monstro abre uma prova de perguntas:

- **fácil**: duas respostas certas derrubam, errar tira 2 de vida.
- **médio**: três certas, errar tira 3.
- **difícil**: três certas, errar tira 4.

Acertar também sobe a perícia do continente (Lógica, Abstração, Mecânica,
Reação, Harmonia, Inferência). A perícia aumenta o dano. Derrubar os três
guardiões acende a alavanca e libera o chefe, que faz quatro perguntas e deixa o
item raro. Cada vitória dá XP e item; os monstros voltam depois de cinco minutos,
o chefe depois de vinte. O item do chefe é uma relíquia: cada uma soma 5 de vida
máxima.

A **Ficha** (`F`) mostra vida, nível, perícias, mochila e a forja. A vida volta
devagar fora de duelo; a Poção de Café cura 18, o Caldo de Caverna cura 35.
Cair num duelo não perde item nem XP: o boneco acorda no Porto com a vida cheia.

Estações, pedras, NPCs, monstros, alavancas e mobília barram a passagem. O
desenho é ordenado por profundidade, então uma fonte, árvore ou parede na frente
do boneco cobre o corpo dele em vez de ficar sempre atrás.

## As cavernas

Ao lado de cada clareira de caça existe uma boca de caverna. `Enter` nela entra
num mapa próprio, em tela cheia: salas ligadas por túneis de três tiles que se
cruzam em anel, entrada embaixo, cidade no fundo. São seis temas, um por
continente, com paleta, nomes de sala e bichos próprios.

Lá embaixo valem as mesmas regras do mundo, com uma diferença: o bicho que vê
você começa a batalha sozinho. Ele anda em volta do ninho, tem um raio de visão
e precisa de linha reta até o aventureiro; quando isso acontece, aparece um `!`
e o duelo de perguntas abre. Quanto mais fundo, mais forte: as salas perto da
entrada têm monstros de uma estrela, as do meio de duas, as do fundo de três, e
o chefe fica no último beco, sem alavanca. Ele responde com perguntas médias e
difíceis e deixa a relíquia do continente.

Cada sala tem baú. Baú fundo é selado e pede uma **Chave de Caverna**, que se
faz na forja. A caverna dá os materiais da forja: ferro, erva, cristal de veio e
madeira. Na cidade subterrânea há uma forja (abre a Ficha), um altar que devolve
a vida a cada 45 segundos, uma horta de ervas que rebrota e uma pedra de retorno.
A receita é curta e honesta: poção, tocha, chave, bomba e caldo.

A **tocha** acende por dois minutos e aumenta a luz; a **bomba** espanta os
bichos num raio de três tiles, sem XP e sem saque. `F` abre a Ficha em qualquer
lugar, `Esc` sobe de volta para a boca da caverna. Monstros e chefe guardam o
tempo de respawn de sempre; os baús se reabrem a cada descida.

## A Rede

A conta do jogador é uma chave Nostr criada e guardada no próprio navegador.
Não tem cadastro, e-mail nem servidor nosso. A chave pública (`npub`) identifica
a pessoa; a privada (`nsec`) fica no `localStorage` e pode ser exportada ou
trocada na aba **Conta** da Rede. Quem tiver a nsec controla a conta.

A janela **Rede** (`R`) tem quatro abas:

| aba | o que faz |
|---|---|
| **Mundo** | canais públicos, um geral e um por continente |
| **DMs** | conversas privadas com NIP-17, com selo e cópia local |
| **Pessoas** | quem está no mundo agora e quem está na sua sala |
| **Conta** | chave, perfil público, relays e recomeço de identidade |

Os relays são públicos (`relay.damus.io`, `nos.lol`, `relay.nostr.band` e
`relay.primal.net`). Mensagens de canal são eventos Nostr com os selos
`client=mundo-song` e `game=mundo-song` e um tag de canal
`mundo-song:v3:<canal>`; só eventos com esses selos entram na tela, então
nenhum conteúdo de fora do jogo aparece ali. As DMs usam NIP-17
(gift wrap), então o relay não lê o texto. A presença é um evento efêmero com o
continente em que a pessoa está.

O [nostr-tools](https://github.com/nbd-wtf/nostr-tools) vem de ESM.sh e é
carregado só quando a Rede liga. Se os relays não responderem, o jogo continua
a pé e a Rede avisa.

## Conferir

A parte que não depende do navegador tem uma conferência só:

```bash
node test/core.test.mjs
```

Ela cobre o progresso e a persistência das missões, o filtro que mantém
conteúdo de fora fora dos canais, o ciclo de duelo, dano, alavanca e chefe, a
interpolação dos outros jogadores e a caverna: salas com chão, ligação da
entrada até a cidade, linha de visão, chefe sem alavanca e a forja.

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
| `js/quests.js` | missões, progresso, XP e títulos |
| `js/path.js` | caminho A* do clique até o destino |
| `js/rpg.js` | vida, perícias, itens, forja, monstros, alavancas e duelo |
| `js/rpg-data.js` | caçadas, monstros, itens, receitas e as 54 perguntas |
| `js/dungeon.js` | a caverna em tela cheia: mapa, visão, batalha por encontro e desenho |
| `js/dungeon-data.js` | as seis cavernas: salas, temas, monstros e chefes |
| `js/creature.js` | desenho dos monstros no mapa e no duelo |
| `js/sheet.js` | a ficha de aventureiro |
| `js/duel.js` | a janela de prova contra cada monstro |
| `js/social.js` | janela da Rede: canais, DMs, pessoas e conta |
| `js/audio.js` | síntese, ambiente e sequenciador |
| `js/content.js` | os 32 textos e as falas dos NPCs |
| `js/config.js` | mapa, continentes, estações, pedras e cores |
| `js/data/elements.js` | os 36 elementos da tabela periódica |
| `js/zones/` | os instrumentos interativos de cada região |
| `wasm/julia.wat` | fonte do módulo WebAssembly do conjunto de Julia |
| `wasm/julia.wasm` | o módulo compilado, de 296 bytes |
| `test/core.test.mjs` | conferência de missões e do filtro dos canais |

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

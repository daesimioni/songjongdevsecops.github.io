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

A praça compartilhada mostra outras pessoas na mesma sala. Não existe servidor
próprio: o site é estático e o sinal usa um broker MQTT público por WebSocket.
Se o sinal falhar, o mundo continua funcionando sozinho.

## Rodar na mão

Não tem build. Basta servir a pasta como arquivo estático:

```bash
python3 -m http.server 8000
```

Depois abra `http://localhost:8000`.

## Estrutura

| caminho | o que é |
|---|---|
| `index.html` | casca da página: mapa, HUD, painéis, modais, viagem |
| `css/style.css` | o visual, do mundo aos widgets |
| `js/app.js` | laço do jogo, entrada, diário, XP, viagem e estado |
| `js/world.js` | geração do arquipélago, caminhos, pontes, colisão e névoa |
| `js/render.js` | desenho do mundo, das estações, dos bonecos e do minimapa |
| `js/net.js` | sala compartilhada por MQTT sobre WebSocket |
| `js/audio.js` | síntese, ambiente e sequenciador |
| `js/content.js` | os 32 textos e as falas dos NPCs |
| `js/config.js` | mapa, continentes, estações, pedras e cores |
| `js/data/elements.js` | os 36 elementos da tabela periódica |
| `js/zones/` | os instrumentos interativos de cada região |
| `wasm/julia.wat` | fonte do módulo WebAssembly do conjunto de Julia |
| `wasm/julia.wasm` | o módulo compilado, de 296 bytes |

O módulo wasm é gerado com `wat2wasm`:

```bash
wat2wasm wasm/julia.wat -o wasm/julia.wasm
```

## Editar conteúdo

- Textos e falas: `js/content.js`.
- Posição e nome das estações: `js/config.js`, no array `SITES`.
- Elementos da tabela: `js/data/elements.js`.
- Instrumentos: `js/zones/`. Computação, matemática, física e química ficam em
  `cs.js`, `math.js`, `physics.js` e `chem.js`; música em `music.js`; IA em
  `ai.js`; as moléculas em 3D em `molecule.js`.

## Créditos

Three.js, p5.js, MathJax, Plotly e MQTT.js vêm de CDN. O resto é JavaScript de
navegador, canvas, WebGL, Web Audio e WebAssembly. A fonte de pixel é do Google
Fonts, com queda para monoespaçada do sistema.

Feito por Song Jong, para brincar.

# Mundo de Song

No ar em <https://songjongdevsecops.github.io/>.

Um blog pessoal que se atravessa a pé. Cada canto do mapa é uma página: você
entra com um boneco, anda em pixel art e mexe no que encontra.

O que tem no mapa:

- **Praça do Começo**: a introdução, a fonte e o rádio do quintal, com um
  sequenciador de oito passos feito de osciladores.
- **Vale da Lógica**: portas E, OU, OU exclusivo e NÃO E, com tabela verdade.
- **Bosque dos Fractais**: uma árvore recursiva desenhada com p5 e o conjunto de
  Julia calculado em WebAssembly.
- **Observatório**: a série de Fourier da onda quadrada, com MathJax e Plotly.
- **Fenda 3D**: um icosaedro em WebGL com Three.js.

A praça compartilhada mostra outras pessoas andando na mesma sala. Não existe
servidor próprio: o site é estático e o sinal usa um broker MQTT público por
WebSocket, com os avatares sincronizados por ele. Se o sinal falhar, o mundo
continua funcionando sozinho.

## Rodar na mão

Não tem build. Basta servir a pasta como arquivo estático:

```bash
python3 -m http.server 8000
```

Depois abra `http://localhost:8000`.

## Estrutura

| caminho | o que é |
|---|---|
| `index.html` | casca da página: mapa, HUD, painéis, modais |
| `css/style.css` | o visual, do mundo aos widgets |
| `js/app.js` | laço do jogo, entrada, painéis e estado |
| `js/world.js` | mapa, colisão, decoração, zonas |
| `js/render.js` | desenho do mundo, dos bonecos e do minimapa |
| `js/net.js` | sala compartilhada por MQTT sobre WebSocket |
| `js/audio.js` | síntese, ambiente e sequenciador |
| `js/content.js` | os textos dos posts e as falas dos NPCs |
| `js/zones/*.js` | os interativos de cada região |
| `wasm/julia.wat` | fonte do módulo WebAssembly do conjunto de Julia |
| `wasm/julia.wasm` | o módulo compilado, de 296 bytes |

O módulo wasm é gerado com `wat2wasm`:

```bash
wat2wasm wasm/julia.wat -o wasm/julia.wasm
```

## Créditos

Three.js, p5.js, MathJax, Plotly e MQTT.js vêm de CDN. O resto é JavaScript de
navegador, canvas, WebGL e WebAssembly. As fontes de pixel são do Google Fonts,
com queda para monoespaçada do sistema.

Feito por Song Jong, para brincar.

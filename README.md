# Vale Partido

**Um RPG em pixel art de ilhas, ruínas e maré.**

No ar em <https://songjongdevsecops.github.io/>.

O mar partiu o vale em ilhas. O que sobrou foram ruínas, feras e gente teimosa.
Você chega ao Porto Partido com uma chave, um boneco e nenhum mapa inteiro:
há o chão que pisa e a maré que decide o resto.

## O mundo

- **86 regiões** ligadas por pontes, túneis e pedras de viagem.
- **93 cavernas** com salas, tesouros, criaturas e um chefe no fundo.
- **464 fichas de criatura** e **93 chefes**, com fraquezas, famílias e variantes.
- **561 itens**, equipamento, forja, encantos e receitas.
- **291 missões** de caçada, coleta, exploração e contrato.
- **5 vocações** com três subcategorias cada.

## Como jogar

| tecla | ação |
|---|---|
| `WASD` ou setas | andar |
| clique ou arraste no chão | seguir o ponteiro |
| `F` | interagir |
| `Espaço` ou `Enter` | parar o marcador na coleta |
| `J` | atacar |
| `K` | segurar a guarda |
| `L` | esquivar |
| `1` a `6` | runas |
| `P` | companheiro |
| `C` | ficha |
| `I` | mochila |
| `Z` | diário |
| `B` | bestiário |
| `Q` | conversa |
| `E` | rede |
| `Esc` | fechar ou sair da caverna |

O combate acontece no próprio mapa: o bicho persegue, telegrafa o bote e
morde de perto. A guarda corta o dano; o aparo no instante do golpe zera e
arma o contra-ataque. A esquiva atravessa o golpe com invulnerabilidade curta.
O chefe muda de fase duas vezes e revela uma habilidade própria.

A coleta é ação, não pergunta. O marcador corre na barra e você para na faixa
clara: faixa larga no comum, estreita no raro, e o lendário pede duas batidas
seguidas. O mesmo vale para a fazenda, a cozinha e a forja.

A **Rede** é a conversa do vale: canais por região, mensagens privadas, praça e
party de até oito. A conta é uma chave criada e guardada no navegador, sem
cadastro e sem servidor central.

## Ambiente

Node.js 22.13 ou superior e npm. A versão de referência está em `.nvmrc`.

```bash
npm ci
npm run dev          # abre em http://127.0.0.1:4173
npm run validate     # lint, módulos, conteúdo, testes, artes e build
```

`npm run build` gera `dist/`; a pasta é descartável e não entra no Git.
O jogo é estático: Canvas 2D, ES modules nativos e nenhum runtime de framework.
A presença no mapa usa MQTT público por WebSocket e a conversa usa relays Nostr
públicos; se o sinal falhar, o vale continua funcionando sozinho.

## Documentação

- [Como contribuir](CONTRIBUTING.md)
- [Arquitetura](docs/architecture.md)
- [Licença](LICENSE)

# Arquitetura do jogo

The Learning Valley é um RPG educacional estático para navegador, com Canvas 2D,
interface HTML/CSS, conteúdo local e presença/conversa opcionais em rede. Usa ES
modules nativos: não exige motor, framework, bundler ou servidor de aplicação.

## Responsabilidades

| Diretório | Responsabilidade |
|---|---|
| `src/app/` | Composição das cenas, estado de sessão e coordenação dos sistemas |
| `src/core/` | Geometria, movimento, A*, câmera, valores vitais e configuração técnica |
| `src/gameplay/` | RPG, missões, perguntas, regras de combate e regras das cavernas |
| `src/world/` | Geração da superfície, ocupação, exploração e população |
| `src/rendering/` | Canvas, sprites, materiais, ambiente visual e caches |
| `src/ui/` | Painéis HTML, fichas, inventário, conversa e navegação por foco |
| `src/platform/` | Storage, backup, áudio, transporte, interpolação e entrada do navegador |
| `src/content/` | Catálogo, textos, itens, aparência, mapas e definições temáticas |
| `src/learning/` | Registro, ciclo de carga e instrumentos interativos |
| `css/` | Estilos por área da interface, com ordem explícita em `style.css` |
| `test/` | Testes de regras, integração, persistência e contratos de interface |
| `tools/` | Análise estrutural, desenvolvimento, build e revisão da arte |
| `docs/design/` | Histórico de decisões e revisões do design do jogo |

## Dependências

`core` depende apenas de `core`. `content` pode usar `content` e `core`.
`rendering` depende desses dois e de módulos de desenho. `platform` pode usar
conteúdo e configuração, mas não cenas ou UI. `gameplay` pode usar `platform`
para persistência, além do núcleo e conteúdo. `learning` usa núcleo e conteúdo.
`ui` compõe os sistemas necessários, sem importar `app`; `app` monta a aplicação.

`world` ainda consulta os metadados e o posicionamento procedural de assets em
`rendering/assets`. Essa dependência é explícita e permitida pelo verificador;
não deve crescer para acessar a cena ou desenhar diretamente. Separar um catálogo
só de metadados é um ponto de melhoria futuro, não uma separação já concluída.

O verificador analisa sintaxe e exports com o parser/linker nativo de ES modules
do Node, sem executar DOM, rede ou storage. Confere as dependências de cada camada,
imports dinâmicos literais, ciclos, recursos HTML, módulos CSS e URLs de recursos
relativos, inclusive o WASM dos fractais. Imports montados em runtime não podem
ser resolvidos estaticamente; o registro atual usa literais.

## Sistemas desacoplados nesta reorganização

- `core/runtime-config.js` contém medidas, movimento e configuração de serviços,
  sem gerar conteúdo. `content/config.js` mantém a montagem do mundo. Reexporta
  constantes antigas para consumidores de conteúdo/testes; o núcleo não o importa.
- `core/random.js` contém o gerador determinístico e hash espacial. Desenhar uma
  criatura não carrega mais o gerador do mundo apenas para obter um hash.
- `gameplay/dungeon-map.js` contém geração, ocupação e linha/cone de visão;
  `dungeon-loot.js`, recompensas; `dungeon-plaza.js`, disposição dos serviços.
- `rendering/dungeon-art.js` desenha personagens e objetos do subsolo;
  `ambient-renderer.js` mantém o desenho e caches do clima.
  `terrain-renderer.js` concentra pisos, vegetação do terreno, água e paredes,
  recebendo mundo, contexto e vento como dependências explícitas.
- `app/surface-movement.js` recebe jogador, mundo e serviços por dependências
  explícitas. Teclado, clique e companheiro usam as mesmas regras sem precisar
  acessar a interface ou persistir dados diretamente.
- `gameplay/question-bank.js` monta índices independentes. Importar o RPG deixou
  de acrescentar perguntas diretamente às tabelas compartilhadas de conteúdo.
- `learning/instruments.js` é o registro de carga sob demanda dos instrumentos.

## Estado, saves e recursos

O RPG e as missões continuam donos do progresso persistido. Os IDs e as chaves de
storage anteriores são preservados. A amostra de química ganhou o ID
`amostra-quimica`, antes sobrescrito pelo item matemático `amostra`. O ID `amostra`
continua representando o item matemático que já era efetivamente salvo; não é
possível inferir uma origem química a partir de saves antigos desse ID.

A convenção de direção continua 0 sul, 1 oeste, 2 leste, 3 norte, 4 sudoeste,
5 sudeste, 6 noroeste, 7 nordeste. Posições são em tiles e o render converte para
unidades de mundo. O WASM e os assets usam URLs relativas compatíveis com Pages.

## Entrega e qualidade

`npm ci` usa o lockfile. ESLint verifica produção, ferramentas e testes. O build
copia somente recursos públicos para `dist/`, reúne o CSS na ordem original e
inclui `.nojekyll`. A CI valida Node 22 e 24 e anexa o pacote; não faz merge nem
publica automaticamente.

A suíte inclui verificações do controlador de movimento, isolamento dos bancos
de perguntas e ferramentas de análise/build/HTTP, além dos testes anteriores.
O verificador de estrutura também é testado com import ausente, export inválido,
ciclo e dependência proibida. Não há cobertura de navegador ponta a ponta na CI;
os testes de DOM usam doubles e a revisão de imagens usa Canvas nativo opcional.

## Limites atuais

A organização de arquivos não elimina toda a dívida de projeto. `app/app.js`,
`app/dungeon.js`, `rendering/render.js` e `gameplay/rpg.js` ainda são grandes e
concentram coordenação ou métodos demais. Eles foram reduzidos por extrações
coesas, sem uma reescrita simultânea das regras. Próximas extrações devem atacar
controladores de painéis, renderização do terreno, ciclo das cenas e componentes
do RPG com testes comportamentais próprios. Não se deve apresentar esta migração
como prova de que o jogo inteiro está perfeito ou sem defeitos.

Referências de implementação: [ES modules no navegador](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript/Guide/Modules),
[test runner do Node](https://nodejs.org/docs/latest-v22.x/api/test.html) e
[configuração do ESLint](https://eslint.org/docs/latest/use/configure/configuration-files).

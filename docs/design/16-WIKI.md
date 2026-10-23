# Wiki do Vale — compêndio do aventureiro

A enciclopédia fica no próprio jogo: **Wiki** ou **H**, no mundo e nas cavernas,
e **ver a wiki** na entrada, antes de criar personagem. Pode ser aberta por link
sem login. O conteúdo é uma referência completa: inclui nomes de chefes,
recompensas e áreas ainda não descobertas. O Bestiário continua sendo o registro
individual de descobertas do jogador.

## Navegar

A abertura apresenta um roteiro da primeira expedição e atalhos para combate,
forja e consulta. As categorias organizam o catálogo; a busca ignora acentos e
maiúsculas e exige todas as palavras digitadas. O nome iniciado pelo primeiro
termo tem prioridade. **Limpar** restaura a categoria atual.

A listagem mostra 80 verbetes por lote. **Mostrar mais** mantém os anteriores e
leva o foco ao primeiro resultado novo. As setas esquerda/direita, Home e End
navegam nas abas; seta para baixo na busca leva ao primeiro resultado.

**Continue explorando** conecta as fichas por identidades dos dados do jogo:

- área ↔ fauna, caverna, relíquia e páginas das estações;
- caverna ↔ chefe e equipamento listado;
- receita ↔ resultado e todos os ingredientes;
- material ↔ receitas e encantos que o consomem;
- missão ↔ personagem, missão anterior, recompensa e área do objetivo;
- traje ↔ missão exigida para desbloqueá-lo;
- capítulo ↔ missão necessária e capítulo anterior;
- desfecho ↔ Guardião do Acervo e facções afetadas.

**Voltar** percorre os verbetes visitados antes de retornar à lista e ao botão
que a abriu. O título recebe foco ao abrir uma ficha longa: a leitura começa no
topo, em vez de saltar para os botões do rodapé.

## Cobertura verificada

Contagens da revisão de 23/10/2026. A interface calcula seus totais diretamente
dos catálogos; esta tabela é um retrato da versão, não uma regra de contagem.
A aba Tudo é um filtro adicional, não uma categoria de conteúdo.

| Categoria | Fonte | Verbetes |
|---|---|---:|
| Mundo | `config.js`, `identity.js` | 86 |
| Cavernas | `dungeon-data.js` | 93 |
| Criaturas | `FAUNA` e chefes das cavernas | 351 |
| Itens | `ITEMS` | 561 |
| Receitas | `RECIPES` | 40 |
| Encantos | `ENCHANTS` | 12 |
| Relíquias | `RELICS` | 86 |
| Pets e montarias | `pets.js` | 10 |
| Missões | `QUESTS` | 291 |
| NPCs | `NPCS`, `NPC_SPAWNS` | 194 |
| Páginas | `POSTS` | 454 |
| Trajes | `OUTFITS` | 102 |
| Vocações | `VOCACOES` | 5 |
| Guias e sistemas | `TIERS`, `SKILLS`, `COMO_JOGAR` | 33 |
| História e facções | `arcos.js`, `faccoes.js`, `grande-prova.js` | 14 |
| **Total** | **15 categorias de conteúdo + aba Tudo** | **2.332** |

Os 14 verbetes de história cobrem sete capítulos da Iara, três facções, três
desfechos e o Guardião do Acervo. Capítulos, desfechos e respostas das perguntas
têm texto recolhido em uma seção de spoiler. Abrir uma seção não altera o save,
não conclui missões e não marca um capítulo como lido no Diário.

## Conteúdo das fichas

| Tipo | Informações de consulta |
|---|---|
| Área | Disciplina, continente, material, farol, coordenadas, fauna e caverna |
| Caverna | Salas, dificuldades, habitantes, chefe, equipamento e planta |
| Criatura | Espécie, família, comportamento, fraqueza e área |
| Item | Tipo traduzido, dano, vida máxima, recuperação de vida/mana e duração, quando definidos |
| Runa | Custo da magia aprendida e precedência de cargas sobre mana |
| Receita | Quantidade produzida e quantidades de todos os ingredientes |
| Missão | Pedido, objetivo, quantidade, região/área, requisito anterior e recompensa |
| NPC | Falas disponíveis, localização e missões relacionadas |
| Vocação | Força, fraqueza, multiplicadores e efeitos das subcategorias |
| Pet | Local de origem, passivo, habilidade, mana e recarga |
| Montaria | Velocidade, preço e efeito |
| Traje | Aparência e missão de desbloqueio, quando existe |
| Facção | Interesse, título, limites de reputação e atos que a modificam |

Campos ausentes na fonte não recebem números inventados. Equipamento listado
para uma caverna não implica taxa de saque garantida. Fraquezas descritivas não
são apresentadas como multiplicadores numéricos. Os guias editoriais explicam os
fluxos; os dados de atributos continuam saindo das tabelas usadas pelo jogo.
`SPELL_MANA` fica em `rpg-data.js`, compartilhado pelo RPG e pela wiki.

## Ilustrações e orientação

**1.428 fichas têm ilustração** na versão revisada. Os cartões e detalhes usam os
renderizadores já existentes para itens, criaturas, chefes, NPCs, pets, trajes,
relíquias e biomas; receitas mostram o resultado fabricado. O guia de combate também mostra capturas reais da caverna em desktop/celular,
reaproveitadas da documentação de combate no mapa. Símbolos de categoria
identificam os demais cartões e são decorativos para leitores de tela. Isso não
substitui nem encerra o trabalho pendente de adaptação autoral dos sprites.

As **86 áreas** apresentam um atlas esquemático calculado de `AREAS` e dos limites
do mapa, com a área selecionada em destaque. As **93 cavernas** apresentam uma
planta baseada em `rooms` e `layout.corridors`, com salas numeradas, legenda
textual, cidade em verde e sala do chefe em laranja. Os corredores indicam as
conexões, não o traçado de cada tile. Os mapas não simulam a posição atual de
inimigos, do jogador ou dos baús. Coordenadas e nomes também aparecem como texto.

## Links, acessibilidade e atualização

Cada verbete tem identidade baseada no ID da fonte. **Copiar link** gera
`?wiki=id:<identidade>` e abre a ficha exata, mesmo que existam nomes repetidos.
Links anteriores `?wiki=categoria:nome` e consultas livres continuam funcionando.
O endereço compartilhado não carrega parâmetros temporários ou fragmentos da
sessão. Sem clipboard, o botão mostra o endereço para cópia manual.

A tela grande mantém categorias à esquerda e leitura à direita. Em telas menores,
as categorias rolam horizontalmente e o conteúdo ocupa uma coluna com rolagem.
O layout preserva foco visível, títulos identificados, rótulos de busca, texto
selecionável, legenda dos mapas e botões acessíveis por teclado.

O índice é construído na primeira abertura e reutilizado durante a sessão; uma
versão nova reconstrói o índice ao carregar. Não há sincronização de alterações
de catálogo durante uma sessão já carregada. A wiki não depende de gerar um
arquivo separado de verbetes.

## Verificação

- `test/wiki.test.mjs`: cobertura de todas as fontes, contagens, busca, ícones,
  integração no mundo/caverna/entrada e compatibilidade dos links antigos.
- `test/wiki-navigation.test.mjs`: paginação integral, abas, foco e busca vazia.
- `test/wiki-encyclopedia.test.mjs`: identidades únicas, relações recíprocas,
  resultados/ingredientes de receitas, atributos, custos de mana, requisitos,
  spoilers recolhidos, plantas, links exatos e navegação entre verbetes.

A revisão visual deve usar o navegador: o DOM mínimo dos testes não simula
layout, contraste ou pixels. As ilustrações e mapas usam os dados atuais; seus
testes não atestam a conclusão da produção de arte pendente.

Revisão no navegador: Chromium headless, 1440×1000, 1024×768, 768×1024,
390×844, 320×568 e 844×390. Conferidas as 15 categorias, ausência de
rolagem horizontal no painel, foco inicial no título, link exato e spoilers.

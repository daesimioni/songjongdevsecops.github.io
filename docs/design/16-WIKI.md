# Wiki do vale

Uma enciclopédia do jogo, aberta para qualquer aventureiro, no menu (`Wiki`, tecla
`H`) e também dentro da caverna. Não é uma cópia do conteúdo: o índice é montado
dos mesmos módulos que o jogo usa, então o que entra no jogo entra na wiki.

## O que tem

| Categoria | Fonte | Entradas |
|---|---|---|
| Mundo | `config.js` (AREAS, WAYSTONES) e `identity.js` | 86 |
| Cavernas | `dungeon-data.js` | 93 |
| Criaturas | `identity.js` (FAUNA) e chefes de `dungeon-data.js` | 351 |
| Itens | `rpg-data.js` (ITEMS) | 538 |
| Receitas | `rpg-data.js` (RECIPES) | 18 |
| Encantos | `rpg-data.js` (ENCHANTS) | 3 |
| Relíquias | `rpg-data.js` (RELICS) | 86 |
| Pets | `pets.js` (PETS e MOUNTS) | 10 |
| Missões | `quests.js` | 284 |
| NPCs | `content.js` (NPCS) | 194 |
| Páginas | `content.js` (POSTS): as 454 pedras | 454 |
| Trajes | `outfits.js` | 102 |
| Vocações | `vocations.js` | 5 |
| Sistemas | `TIERS`, `SKILLS` e os resumos de como jogar | 22 |

Total: **2.246 fichas**. Toda ficha com desenho mostra o ícone: item
(`item-art.js`), bicho (`creature.js`), pet (`pet-art.js`), relíquia (gema),
área (chip do bioma com piso, padrão e acento), caverna (boca de pedra) e traje
(busto com as cores do traje).

Cada entrada mostra os campos que o jogo já tem: disciplina, material e caverna
da área; salas, chefe e equipamento da caverna; tipo e fraqueza do bicho; tipo e
origem do item; quem pede, objetivo e recompensa da missão; fala do NPC; e, para
página, o atalho **abrir página**, que abre a pedra no painel de leitura.

## Como se atualiza

`construirIndice()` lê os módulos na primeira abertura e guarda o índice. Área,
caverna, bicho, item, missão, NPC, página ou vocação nova aparece na próxima
abertura, sem arquivo de wiki para editar e sem risco de ficar velho. O teste
`test/wiki.test.mjs` cobra que a contagem de cada categoria bate com a fonte, que
toda página tem atalho válido e que nenhuma outra categoria tem atalho.

## Busca

Sem acento e sem caixa (`normalizar()` em `src/ui/wiki.js`): "logica" acha "Lógica".
Todas as palavras digitadas precisam aparecer; resultado com nome que começa pelo
termo vem primeiro. As categorias filtram a busca e mostram o total.

## Interface

`src/ui/wiki.js` monta as abas, a lista em cartões e o detalhe com os campos. A lista
mostra no máximo 80 entradas por vez (o total aparece no resumo), então abrir a
wiki não cria 2.005 nós no DOM. O modal reusa `.modal`, `.hud-btn` e o foco
trapeado do jogo; `Esc` fecha, `H` abre e fecha. O índice não é construído no
carregamento do site: só na primeira abertura, e custa poucos milissegundos.

## Acesso

O botão está no HUD da superfície e no HUD da caverna. Não depende de nível,
pedra descoberta ou missão concluída. Também abre antes de criar personagem,
pelo botão da tela de entrada, e por link direto: `?wiki=termo` abre a wiki já
buscando o termo. A wiki pausa o jogo enquanto está aberta, como os outros
modais, e fechar a wiki dentro da caverna não fecha a caverna.

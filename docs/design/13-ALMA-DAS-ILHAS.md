# 13. A alma das ilhas

Este documento é o contrato da fase que vem depois de o catálogo inteiro estar
no mapa: **cada área e cada subárea com identidade própria**, não a mesma pele
repetida por disciplina.

## 1. O que conta como identidade

Os 86 cantos do mapa deixam de ser "uma ilha de Matemática com outra cor". Cada
área passa a ter um registro próprio:

| peça | o que muda por área | onde mora |
|---|---|---|
| bioma | nome, dois tons de piso, cor de caminho, padrão de chão, material da caverna | `js/identity.js` e `js/render.js` |
| fauna | 3 monstros com nome, espécie e cor próprios; chefe da área | `js/identity.js` e `js/rpg-data.js` |
| itens | arma, armadura e elmo com nome, história e números próprios | `js/identity.js` e `js/rpg-data.js` |
| guardião | nome, título, aparência (gênero, cabelo, pele, roupa) e falas | `js/identity.js`, `js/world.js` e `js/content.js` |
| missões | trilha da área (ler estações) e chefe da área | `js/identity.js` e `js/quests.js` |
| traje | um traje por área, aberto pela trilha | `js/identity.js` e `js/outfits.js` |
| caverna | paleta, material, nomes de sala, bichos e chefe da área | `js/catalog-gen.js`, `js/dungeon-data.js` e `js/dungeon.js` |
| página de subárea | texto curado, tópicos, prática e conexões | `js/text/*.js` |

Regra de ouro: **nenhuma área usa o piso, o bicho, o item, o NPC, a missão ou a
caverna de outra**. As quatro áreas bônus (Acústica, Forma Musical, Visão e
Linguagem) entram na conta como qualquer outra.

## 2. Fases

### A. Estrutura (esta rodada)

- [x] `js/identity.js`: registro de identidade para as 86 áreas, com cores,
      padrões, fauna, itens, trajes e estilo de NPC derivados do id (sem repetir
      o tom da disciplina).
- [x] Pisos próprios: cada área ganha dois tipos de tile próprios e um padrão
      de chão; minimapa e render usam a cor do bioma; caminho tingido pela área.
- [x] Itens próprios: 3 por área no registro de itens; caçada, baús e
      equipamento da caverna usam os itens da área.
- [x] Fauna própria: 3 monstros por área com nome, espécie e cor; duelo e
      caverna usam a cor da espécie.
- [x] NPCs próprios: aparência determinística por NPC (gênero, cabelo, pele,
      roupa), sem dois iguais.
- [x] Missões próprias: trilha e chefe por área, com meta verificável.
- [x] Traje próprio: um por área, aberto pela trilha.
- [x] Caverna própria: paleta, material, salas com nomes da área e fauna da
      área.
- [x] Teste de identidade: cobre as 86 áreas, exige unicidade de bioma, fauna,
      itens, NPC e caverna.

### B. Texto curado (uma disciplina por rodada)

- [x] Matemática: 69 subáreas.
- [x] Física: 34 subáreas.
- [x] Química: 37 subáreas.
- [x] Computação: 88 subáreas.
- [x] Língua: 55 subáreas.
- [x] Interseções e bônus: 11 seções de interseção com abertura, prática e erro; as 4 áreas bônus mantêm as páginas feitas à mão.

Cada subárea ganha, na página: abertura curada (2 a 4 frases), o que o catálogo
cobre, uma prática concreta, um erro comum e as conexões com as vizinhas. A
lista de tópicos continua, mas deixa de ser a página inteira.

### C. Acabamento

- [x] Revisar concordância e nomes gerados.
- [x] Conferir que nenhum item, bicho, NPC ou caverna ficou repetido.
- [x] Medir desempenho e carga com o registro novo.
- [x] Rodada completa de navegador no local e no site ao vivo.

## 3. Como a identidade é gerada

Para não escrever 86 tabelas de cor à mão e ainda assim não repetir:

1. cada área tem um matiz próprio, calculado a partir do matiz da disciplina e
   da posição da seção (a interseção fica entre os matizes que liga);
2. o matiz vira dois tons de piso, um de caminho e um de destaque, e um padrão
   de chão entre oito (pontos, grade, ondas, runas, rachaduras, estrelas,
   dunas, tijolos);
3. o nome do bioma é curado, um por área;
4. a fauna sai dos tópicos da seção, com um epíteto próprio, e a espécie gira
   dentro da disciplina;
5. o item carrega o nome da área e uma história curta que cita o bioma e um
   bicho;
6. o guardião tem aparência derivada do id e um título do bioma;
7. a caverna usa o material, a paleta, as salas e a fauna da área.

O que for curado depois (textos longos, nomes de bioma) entra no mesmo registro
e substitui o derivado, sem mudar o resto do jogo.

## 4. Prova

`test/content.test.mjs` passa a exigir:

- 86 biomas, com tipo de piso único e nome único;
- 86 fauna de 3 monstros, com nomes únicos e ao menos uma espécie própria da
  área;
- 258 itens de área (3 por área), ids e nomes únicos;
- 86 guardiões com aparência diferente entre si e dos instrutores;
- 172 missões de área (trilha e chefe) com meta que o jogo sabe medir;
- 86 trajes, um por área, ligados à trilha;
- 93 cavernas com paleta e fauna da área.

O navegador confere: página de subárea abrindo com o texto curado, duelo
mostrando a cor do bicho da área, NPC com aparência própria, diário com as
missões novas e nenhum erro de console.

## 5. Andamento

| data | fase | o que entrou | prova |
|---|---|---|---|
| 2026-10-20 | B | texto curado das cinco disciplinas e das interseções: 283 subáreas com abertura, prática e erro comum, mais 11 aberturas de interseção | node: 69 + 34 + 37 + 88 + 55 = 283 subáreas e 11 seções de interseção, nenhuma sem os três campos; páginas conferidas no navegador |
| 2026-10-20 | C | revisão de concordância, nomes de arma por tipo, conexões entre áreas nas páginas e texto das 23 seções sem subárea | node: 86 biomas e pisos únicos, 258 monstros e 258 itens únicos, 172 missões de área, 86 trajes, 283 páginas com texto e conexões, 34 seções de trilha; navegador local e ao vivo: catálogo 15/15, prova final 6/6, refino 9/9, conta 23/23, GOD 13/13, celular 3/3; 60 fps, 47 fps a 4x, 45 fps a 6x e cerca de 800 ms de DOM |
| 2026-10-20 | A | registro de identidade, pisos, fauna, itens, NPC, missões, trajes e cavernas | node: 86 biomas e 86 tipos de piso únicos, 258 monstros e 258 itens sem repetição, 86 trajes, 172 missões de área, 194 NPCs com aparência distinta, 86 cavernas com fauna e paleta da área; navegador: catálogo 15/15, prova final 6/6, 60 fps | 

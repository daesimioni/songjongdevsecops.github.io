# The Learning Valley: pasta de conceito

Esta pasta é a fase de **conceito e desenho macro** do jogo. A implementação
começou em 2026-10-20, a pedido do dono: o que já está no ar e o que falta está
em `11-ESTADO-2026-10-20.md`. O restante continua sendo desenho; nada entra no
jogo sem virar tarefa e teste.

## 1. O jogo em uma página

Um arquipélago educativo em pixel art, jogado a pé, com seis disciplinas
(Computação, Matemática, Física, Química, Música e IA), duas camadas de mundo
(superfície e subsolo), cidades conurbadas, bestiário, equipamento, magias,
ofícios e um motor de aprendizagem por conceito. O combate é a pergunta; o
mundo responde ao entendimento. A inspiração é o Tibia na estrutura (mundo
aberto, bestiário, slots, magias, cidades, NPCs), não no grind nem na punição.

## 2. Ordem de leitura

1. `00-VISAO.md`: a promessa, os pilares, os loops, o primeiro dia, as decisões.
2. `01-APRENDIZAGEM.md`: o motor educativo; é o documento mais importante.
3. `02-COMBATE.md`: cone de visão, grupo, chefes, dano, morte.
4. `03-ITENS.md`: armas, armaduras, escudos, colares, anéis, magias, runas,
   poções, ofícios, economia.
5. `04-BESTIARIO.md`: famílias, 40 espécies, grupos, loot, chefes.
6. `05-MUNDO.md`: ilhas, pontes, bocas pareadas, conurbação, cidades, NPCs.
7. `06-ROADMAP.md`: auditoria do que falta, fases, critérios de pronto.
8. `07-DECISOES.md`: o porquê de cada escolha e o que faria mudar.
9. `08-INTERFACE.md`: telas, HUD, batalha, ficha, caderno, mapa, mobile.
10. `09-LORE.md`: o Silêncio, as culturas, a Grande Prova, o tom.
11. `10-ESTACOES.md`: as 32 estações, conceitos e auditoria.
12. `11-ESTADO-2026-10-20.md`: o que já virou código, equipamento, bestiário,
    camadas, conurbação e as perguntas abertas para o dono.

## 3. O que está decidido (proposta)

- grafo de conceitos + domínio 0 a 5 + revisão espaçada;
- combate por pergunta com cone de visão em meia lua;
- batalha de grupo com 2 ou 3 monstros e perguntas simultâneas;
- duas camadas de mundo com bocas pareadas, pontes e conurbação;
- slots de equipamento, 6 armas, magias, runas, poções, ofícios;
- bestiário de 8 famílias, 35 espécies comuns e 6 chefes;
- 32 estações viram aulas com prática; 20 NPCs, 30 missões;
- morte suave, sem PvP obrigatório, sem cronômetro obrigatório;
- 600+ perguntas, 150 itens, 40 monstros;
- pixel art 2D, site estático, sem build, sem pay-to-win.

## 4. O que ainda precisa do dono

1. Morte: suave ou com perda pequena de XP.
2. Classes: caminhos livres ou vocações.
3. PvP: opt-in ou zona aberta.
4. Cronômetro: desligado ou opcional.
5. Mapa: anel novo em fases ou expandir o atual.
6. Arte: manter pixel art ou outro estilo.
7. Volume inicial: 600 perguntas ou 300.
8. Nomes e tom: mundo, monstros, magias, cidades.

As recomendações estão em `00-VISAO.md` §9 e `07-DECISOES.md`.

## 5. O que vem depois do aval

1. **Desenho detalhado por área**, um a um:
   - mapa da superfície, ilha por ilha, com coordenadas e marcos;
   - mapa do subsolo, sala por sala, bocas e túneis;
   - telas de combate, grupo, ficha, caderno, mapa;
   - listas finais (40 monstros, 150 itens, 12 magias, 20 NPCs, 30 missões);
   - banco de perguntas por conceito, com formato e misconception;
   - esquema de dados e migração do save.
2. **Plano de implementação** por fases, com critério de pronto.
3. **Implementação**, só então.

## 6. Regra de ouro

Nenhuma linha de código deste conceito entra no jogo sem o desenho detalhado e o
aval do dono. O que existe hoje continua funcionando; a pasta é para pensar
antes de mexer.

## 7. Nota de publicação

Esta pasta está versionada no repositório público. Os documentos registram o
desenho e seu histórico; propostas antigas não devem ser confundidas com o
estado implementado. As revisões com falhas reproduzidas e testes ficam nos
registros de auditoria, incluindo `29-CORRECOES-FUNCIONAIS.md` e
`30-COLISOES-INTERFACE-LOGICA.md`, `31-UI-UX.md`, `32-REVISAO-GERAL.md`,
`33-REVISAO-EXTERNA.md` e `34-HABILIDADES-CHEFE.md`.

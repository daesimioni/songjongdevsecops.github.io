# Roadmap: do conceito ao mundo jogável

Este documento fecha a fase de conceito. Ele não autoriza implementação. A
ordem pedida pelo dono é: conceito, desenho detalhado, revisão, só então código.

## 1. O que já existe (baseline)

- Site estático, sem build, em https://songjongdevsecops.github.io/.
- 7 continentes e 14 áreas temáticas, 65 estações, 21 caçadas e 21 cavernas.
- 29 NPCs de história, 21 instrutores, 40 missões e 600 perguntas.
- Duelo de perguntas, XP, perícias, 49 peças de equipamento, forja, encantos,
  comida, bicho, horta, veios e minmapa.
- Chat/Nostr/MQTT, presença e DMs.
- 42 bocas pareadas, dois sentidos por caverna e camada `subsolo -1` no HUD.
- Testes: `node test/*.test.mjs` e suíte de navegador (CDP).

## 2. Auditoria do que ficou incompleto

| frente | estado | o que falta | prioridade |
|---|---|---|---|
| 32 estações | existem, algumas rasas | cada uma com aula, prática, pergunta e visual | alta |
| 18 missões | lineares e curtas | 3 a 5 passos, escolha, lore, recompensa | alta |
| 60 perguntas | poucas, repetitivas | grafo de conceitos, 600+, formatos | altíssima |
| monstros | 3 formas, nomes | 40 espécies, famílias, cones, grupos | altíssima |
| cavernas | 1 boca, 1 saída | bocas pareadas, rede, cidades | altíssima |
| mapa | 7 regiões, sem pontes todas | anel, pontes, marcos, rios | alta |
| NPcs | 1 fala | árvores, missões, horários, facções | alta |
| multiplayer | chat/presença | party, caçada, estudo, arena | média |
| endgame | não existe | Grande Prova, biblioteca, guilda | média |
| morte | punitiva? | sem perda, respawn no acampamento | alta |
| acessibilidade | parcial | teclado, leitor, contraste, sem cronômetro | alta |
| save | localStorage | versão, migração, exportar | média |
| mobile | jogável | batalha de grupo, inventário, toque | alta |

## 3. Fases

### Fase 0: reparos que não esperam (1 a 2 semanas)
- Toda boca de caverna com subida visível e uma segunda saída.
- Corrigir o minmapa e a bússola.
- Aposentar a pergunta repetida: cooldown e variantes simples.
- Aumentar a variedade imediata de monstros com variantes de cor e
  comportamento (sem inventar 40 ainda).
- Pontes provisórias entre as ilhas já existentes.
- Acessibilidade básica e save versionado.

Critério de pronto: descer em qualquer boca e conseguir voltar ou sair noutro
lugar; nenhuma pergunta repetida em menos de 10 batalhas; jogo jogável no
celular.

### Fase 1: fundação de dados (2 a 4 semanas)
- Esquema de conceito, pergunta, item, monstro, boca, cidade, NPC.
- Linter de conteúdo e importador.
- Grafo de conceitos inicial (6 continentes, 10 conceitos cada).
- Save versionado com migração e exportação.
- Ferramenta de mapa (editor simples ou dados editáveis).
- Testes de conteúdo automatizados.

Critério: 120 perguntas migradas com conceito e formato; linter verde; save
antigo abre.

### Fase 2: combate e equipamento (3 a 5 semanas)
- Cone de visão, alerta, patrulha, fuga.
- Batalha de grupo com 2 a 3 cartões.
- Slots, armas, armaduras, escudos, colares e anéis.
- Magias, runas, poções, mana.
- Dano, morte sem perda, respawn.
- Balanceamento inicial e playtest.

Critério: um encontro de grupo de 3 bichos funciona; 20 itens equipáveis; 3
magias; morte suave; 5 testadores completam a primeira hora.

### Fase 3: mundo de duas camadas (4 a 6 semanas)
- Superfície com 7 ilhas, 7 pontes/ferries, marcos e estradas.
- Subsolo contínuo com 13 bocas pareadas, 7 cidades e a Cidade do Nó.
- Elevadores, mapas, névoa, cartografia.
- Migração do mapa atual sem quebrar o save.

Critério: descer em Computação e emergir em Matemática a pé; nenhuma boca sem
subida; mapa revelado coerente.

### Fase 4: conteúdo (6 a 10 semanas)
- 40 espécies, 8 famílias, 6 chefes, loot e variantes.
- 150 itens, 12 encantos, 12 magias, 15 comidas, 6 bichos, 6 culturas.
- 20 NPCs, facções, 30 missões, estações completas.
- 600+ perguntas com formatos e misconceptions.

Critério: uma ilha inteira jogável do nível 1 ao chefe; bestiário de uma família
completo; 30 perguntas por conceito revisadas.

### Fase 5: aprendizagem (contínua, desde a fase 1)
- Domínio por conceito, caderno, revisão espaçada.
- Adaptação, dicas, modos de estudo, provas.
- Métricas de retenção e conforto.
- Conteúdo e playtest.

Critério: retenção em 7 dias medida; 75% a 85% de acerto médio; nenhum modo
punitivo.

### Fase 6: sociedade e endgame (4 a 6 semanas)
- Party, caçada cooperativa, chefes de guilda, arena opt-in.
- Salas de estudo, mapas compartilhados, mentoria.
- Grande Prova, Biblioteca Afogada, torneio.
- Moderação, privacidade, acessibilidade plena.

Critério: 4 jogadores completam uma caçada em party; nenhum PvP forçado; salas
de estudo funcionam.

### Fase 7: polimento (contínuo)
- Performance, mobile, som, arte, animação, transições, microtexto.
- Playtest com 20+ pessoas, professor, acessibilidade.
- Balanceamento e correção de conteúdo.

## 4. Ordem recomendada

1. Reparos (Fase 0) para o jogo não ficar quebrado enquanto o resto cresce.
2. Dados e aprendizagem (Fases 1 e 5) porque tudo depende disso.
3. Combate e equipamento (Fase 2).
4. Mundo (Fase 3).
5. Conteúdo em massa (Fase 4).
6. Sociedade e endgame (Fase 6).
7. Polimento (Fase 7).

O mapa grande só depois do esquema de dados e do combate, para não refazer duas
vezes. As cavernas pareadas entram na Fase 3, mas a Fase 0 já impede a descida
sem volta.

## 5. Critérios de pronto do jogo

- O jogador entende o mundo nos primeiros 10 minutos e tem uma escolha real aos
  20.
- Toda pergunta tem explicação e um erro plausível.
- Nenhum sistema pune o erro a ponto de desestimular.
- O jogador consegue estudar 1 hora sem sentir que está grindando.
- Uma sessão de 30 minutos termina com algo visível: mapa, item, conceito,
  amizade, lore.
- O jogo funciona no teclado, no toque, sem som e com leitor de tela.
- O conteúdo é correto, revisado e versionado.
- O multiplayer é gentil: ninguém é obrigado a competir.
- O jogo é divertido sem o prêmio; o prêmio é entender.

## 6. Riscos e mitigação

| risco | mitigação |
|---|---|
| escopo explodir | fases com critério de pronto; cortar o que não ensina |
| conteúdo raso | linter, revisão, playtest, misconceptions |
| repetição | grafo, variantes, cooldown, formatos |
| grind | XP por domínio, não por repetição |
| morte punitiva | sem perda, respawn, caderno |
| PvP tóxico | opt-in, arena, sem perda |
| mobile ruim | testar cedo, layout vertical, toque |
| performance | mapa em chunks, objetos pooled, minimapa 5 fps |
| arte inconsistente | paleta por bioma, guia de pixel art |
| conteúdo errado | fonte, revisor, nota de versão |
| multiplayer vazio | assíncrono, NPCs, estudo solo completo |
| save quebrado | versão, migração, exportar |

## 7. O que NÃO fazer

- Implementar antes de aprovar o conceito e o desenho detalhado.
- Trocar a planta das cavernas por um gerador aleatório sem curadoria.
- Encher o mapa de ícones sem significado.
- Copiar o grind do Tibia.
- Fazer 200 itens com +1% de diferença.
- Ranking global que humilha.
- Cronômetro obrigatório.
- Conteúdo gerado por IA sem revisão.
- Publicar o design interno no site sem decisão do dono.

## 8. Próximo passo

1. O dono lê os documentos 00 a 05 e marca o que aprova, o que muda e o que
   corta.
2. Com o aval, fazemos o **desenho detalhado** por área, um a um:
   - mapa da superfície ilha por ilha, com coordenadas;
   - mapa do subsolo sala por sala e as bocas pareadas;
   - telas de combate, grupo, inventário, ficha e mapa;
   - listas finais de 40 monstros, 150 itens, 12 magias, 20 NPCs, 30 missões;
   - banco de perguntas por conceito, com formato e misconception;
   - esquema de dados e migração do save.
3. Só depois disso vem o plano de implementação e o código.

Enquanto o dono não aprovar, nada disso vira código. O que existe hoje continua
no ar; o conceito fica em `docs/design/`, local, sem push para o site.

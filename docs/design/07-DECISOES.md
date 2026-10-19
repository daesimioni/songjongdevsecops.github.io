# Decisões de desenho: o porquê de cada escolha

Este documento existe para o dono discordar com precisão. Cada decisão tem
alternativa, motivo e o que faria a gente mudar de ideia.

## 1. As grandes decisões

| decisão | alternativa | por que | muda se |
|---|---|---|---|
| **grafo de conceitos** no lugar de banco plano | baralho por continente e nível | sem conceito não há revisão, adaptação nem diagnóstico; o baralho plano repete | o custo de autoria for maior que o ganho (não é) |
| **domínio 0 a 5** além do nível | só XP/nível | nível mede tempo; domínio mede aprendizagem; a dificuldade deve seguir o domínio | o jogador achar o mapa de domínio burocrático |
| **sem cronômetro por padrão** | tempo em toda pergunta | pressão atrapalha quem está aprendendo; fluência é opcional | o jogo ficar sem tensão nenhuma (não fica: o grupo pressiona) |
| **caminhos livres** no lugar de classes | vocações fechadas tipo Tibia | o jogador experimenta ferramentas sem recomeçar; a identidade vem do equipamento e da magia | o jogador se perder sem uma classe |
| **morte suave** | perder XP/item | punir erro desestimula estudar; o tempo já é a consequência | o jogo ficar sem risco (a caverna funda ainda assusta) |
| **até 3 monstros por grupo** | 5 ou 6 | legibilidade e carga cognitiva; 3 já intercala assuntos | o playtest mostrar que 4 é confortável |
| **duas camadas de mundo** | cavernas instanciadas | o jogador quer continuidade e conurbação; a descida vira viagem | o mapa contínuo ficar pesado no navegador |
| **bocas pareadas** | uma boca por continente | consertar a descida sem volta; o subsolo vira atalho real | o custo de arte for maior que o ganho |
| **PvP só opt-in** | PvP aberto | estudo não combina com medo; arena resolve a vontade de duelo | houver demanda forte por zona aberta |
| **sem IA corrigindo texto** | LLM avaliando explicação | custo, privacidade, inconsistência; a explicação é autoavaliada com rubrica | houver um modelo local confiável e barato |
| **mapa artesanal** | geração procedural | um mundo educativo precisa de intenção; procedural vira repetição | o mapa artesanal não escalar para o volume |
| **pixel art 2D** | 3D/isométrico | identidade, performance, custo; o que existe já tem alma | o dono quiser outro estilo |
| **sem leilão global** | economia de jogador | inflação e especulação não ensinam; loja local basta | houver economia social madura |
| **cooperação como foco** | ranking competitivo | o objetivo é estudar junto; competição opcional | o público pedir torneio (a arena já cobre) |

## 2. O que o Tibia empresta

| do Tibia | nosso uso | adaptação |
|---|---|---|
| mundo aberto sem seta | exploração a pé, mapa contínuo | ilhas e subsolo com pontes e bocas |
| bestiário | famílias, espécies, loot, lore | cada espécie é uma misconception ou ideia |
| slots de equipamento | armas, armaduras, escudos, colares, anéis | cada peça é uma ferramenta de pensamento |
| magias e runas | 12 magias, 7 runas | magia é estratégia de estudo |
| cidades e NPCs | serviços, diálogos, facções | cidade é escola e abrigo |
| morte | respawn no acampamento | sem perda de item/XP; caderno guarda o erro |
| vocações | caminhos livres | sem classe rígida |
| loot com nome | itens com lore | loot não é lixo |
| casas/guildas | sala de estudo/guilda | sem imposto, sem leilão |

## 3. O que não copiamos do Tibia

- morte que apaga horas;
- grind de milhares de bichos;
- economia opaca e inflação;
- PvP aberto e trapaça;
- classes que impedem experimentar;
- mapa gigante sem sinalização;
- NPCs que só repetem uma frase;
- conteúdo pago para vencer.

## 4. Referências de aprendizagem

| referência | o que usamos | o que rejeitamos |
|---|---|---|
| prática de recuperação | pergunta antes da explicação; revisão | decorar sem contexto |
| repetição espaçada | caderno e intervalos 1/3/7/21/60 | Anki puro, sem mundo |
| intercalação | grupo com assuntos diferentes | blocos longos do mesmo tema |
| feedback elaborado | erro específico + misconception | "errado" genérico |
| fluxo | dificuldade 75 a 85% | dificuldade fixa por nível |
| autodeterminação | escolha de rota, competência visível, vínculo | recompensa extrínseca vazia |
| carga cognitiva | uma ideia por pergunta, texto curto | parede de texto |
| erro produtivo | erro vira cartão e eco | punição humilhante |
| mastery learning | prova por domínio, não por nota | nota única |
| Duolingo | ritmo curto, carinho visual | sequência que pune, notificação agressiva |

## 5. Invariantes do jogo

1. Nenhuma pergunta sem explicação.
2. Nenhum acerto sem consequência no mundo.
3. Nenhum erro que apague progresso de estudo.
4. Nenhum item que responda a pergunta pelo jogador.
5. Nenhum sistema que exija pagar para vencer.
6. Nenhum mapa que prenda o jogador sem saída.
7. Nenhum NPC sem função ou história.
8. Nenhuma tela que esconda o mundo por burocracia.
9. Nenhum grind que não ensine.
10. Nenhum dado pessoal obrigatório.

## 6. Decisões que ainda precisam do dono

1. Morte: suave (recomendo) ou perda pequena de XP.
2. Caminhos: livres (recomendo) ou vocações.
3. PvP: opt-in (recomendo) ou zona aberta.
4. Cronômetro: desligado (recomendo) ou opcional.
5. Mapa: anel novo em fases (recomendo) ou expandir o atual.
6. Arte: manter pixel art (recomendo) ou outro estilo.
7. Volume inicial: 600 perguntas (recomendo) ou 300 para começar.
8. Nomes: aprovar o tom (mundo, monstros, magias, cidades).

## 7. O que faria a gente rever tudo

- Playtest mostrar que o jogador estuda menos com o mundo aberto do que com
  uma lista de perguntas.
- O custo de conteúdo crescer mais que o tempo de implementação.
- O jogo ficar pesado no celular.
- O dono preferir uma experiência mais linear.
- O conteúdo educativo não puder ser revisado na qualidade necessária.

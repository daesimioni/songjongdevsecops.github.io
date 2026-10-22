# Bestiário: famílias, espécies e grupos

> **Documento de conceito, congelado.** O que está abaixo é o desenho na data em
> que foi escrito, não a lista do que falta. Estado atual: [`../README.md`](../README.md);
> pendências verificadas: [`39-BACKLOG-VERIFICADO.md`](39-BACKLOG-VERIFICADO.md).


O bestiário é o catálogo do mundo e a lista de misconceptions que o jogador
enfrenta. Cada família tem um jeito de andar, de ver, de lutar e de perguntar.
Não são 40 skins do mesmo slime: são 8 ecologias.

## 0. O que já existe (2026-10-20)

Sete espécies desenhadas: gosma, olho, golem, morcego, aranha, fogo-fátuo e
escorpião. Cada uma tem cone, alcance, velocidade e comportamento próprios; o
capítulo 3.1 de `11-ESTADO-2026-10-20.md` traz os números. Cada caverna sorteia
entre essas espécies por andar (4 no fácil, 5 no médio, 4 no difícil) e usa 10 a
12 nomes temáticos.

O Diário guarda o mini-bestiário: nome, espécie, andar, tema da sala, fraqueza
de comportamento, uma pergunta típica da dificuldade e o número de encontros.
Os campos vêm de `rpg.noteMonster()` e `rpg.seenView()`; a fraqueza é uma dica
de posicionamento, não um multiplicador de dano.

## 1. As oito famílias

| família | disciplina | ideia | visão | grupo |
|---|---|---|---|---|
| **Falhas** | Computação | o erro que insiste em rodar | curta, rápido alerta | enxame e matilha |
| **Formas** | Matemática | a regra que se esconde na figura | longa, estreita | corte e guarda |
| **Forças** | Física | o empurrão que o mundo dá | longa, muito estreita | guarda |
| **Reagentes** | Química | a transformação que não pede licença | larga, curta | corte e poça |
| **Ecos** | Música | o som que organiza ou desorganiza | 360°, curta | coro |
| **Agentes** | IA | o padrão que aprende com você | larga, longa | conselho |
| **Errantes** | Hub | a vida miúda do arquipélago | curta, distraída | bando |
| **Chefes** | todas | a prova final de um continente | própria | arena |

Cada família tem 5 espécies comuns e 1 chefe. O chefe não é o líder da matilha;
é uma ideia que tomou conta do lugar.

## 2. Espécies

Legenda: **T** = tier (1 a 3), **V** = vida em respostas certas, **D** = dano
por erro, **Visão** = ângulo/alcance, **Formato** = formato de pergunta que
prefere. Nomes de loot são exemplos; a tabela completa fica no dado.

### Falhas (Computação)

| espécie | T | V | D | visão | comportamento | formato | loot |
|---|---|---|---|---|---|---|---|
| Bit | 1 | 2 | 2 | 90°/4 | anda em zigue-zague, alerta rápido | rastrear, múltipla escolha | parafuso |
| Loop | 2 | 3 | 3 | 100°/4 | dá voltas; repete a mesma pergunta se errar | ordenar, achar erro | chip |
| Null | 2 | 3 | 3 | 80°/5 | some por 1 turno; imune a dica no turno | verdadeiro/falso | fita |
| Kernel | 3 | 3 | 4 | 70°/5 | pesado, guarda passagem, chama 1 add | aplicar, rastrear | fita |
| Thread | 3 | 3 | 4 | 130°/4 | rápido, persegue, divide atenção | múltipla escolha, prever | chip |

Lore: as Falhas nasceram de programas que ficaram rodando depois que a máquina
morreu. Elas não odeiam o jogador; só não sabem parar.

### Formas (Matemática)

| espécie | T | V | D | visão | comportamento | formato | loot |
|---|---|---|---|---|---|---|---|
| Primo | 1 | 2 | 2 | 60°/5 | se esconde entre compostos, patrulha em linha | múltipla escolha | régua |
| Lema | 2 | 3 | 3 | 60°/6 | buffa aliados, fica atrás | explicar, associar | teorema |
| Vértice | 2 | 3 | 3 | 70°/5 | patrulha em triângulo, corta caminho | apontar, ordenar | axioma |
| Fractal | 3 | 3 | 4 | 90°/5 | se divide em 2 cópias com metade da vida | transferir, prever | axioma |
| Infinito | 3 | 4 | 4 | 50°/7 | lento, enorme, não desiste | numérico, limite | teorema |

Lore: as Formas são a geometria que sobrou quando as cidades afundaram. Elas
medem tudo, inclusive o jogador.

### Forças (Física)

| espécie | T | V | D | visão | comportamento | formato | loot |
|---|---|---|---|---|---|---|---|
| Íon | 1 | 2 | 2 | 80°/4 | empurra, carga elétrica | unidade, múltipla escolha | ímã |
| Vetor | 2 | 3 | 3 | 50°/6 | aponta o cone para onde vai, investe | prever, numérico | prisma |
| Quanta | 3 | 3 | 4 | 70°/5 | pisca, aparece atrás, teleporta curto | prever, transferir | quanta |
| Órbita | 3 | 3 | 4 | 60°/6 | circula o alvo, ataca de longe | numérico, ordenar | quanta |
| Prisma | 2 | 3 | 3 | 90°/5 | divide a luz, cria ilusão de opções | achar erro, associar | prisma |

Lore: as Forças guardam o observatório que ficou cego. Elas medem o mundo com
uma régua que ninguém mais sabe ler.

### Reagentes (Química)

| espécie | T | V | D | visão | comportamento | formato | loot |
|---|---|---|---|---|---|---|---|
| Átomo | 1 | 2 | 2 | 120°/3 | fica perto da poça, liga-se a outro | associar, múltipla escolha | frasco |
| Mol | 2 | 3 | 3 | 110°/4 | pesado, lento, resiste a dano | numérico, equilíbrio | catalisador |
| Ácido | 2 | 3 | 3 | 130°/3 | deixa poça que dá dano se ficar | verdadeiro/falso, unidade | frasco |
| Cristal | 3 | 3 | 4 | 100°/4 | blindado, reflete a primeira magia | apontar, achar erro | cristal |
| Catalisador | 3 | 3 | 4 | 120°/4 | acelera aliados; se morre, explode | ordenar, prever | catalisador |

Lore: os Reagentes são o que a mina deixou quando a água entrou. Eles mudam de
cor quando o jogador entende.

### Ecos (Música)

| espécie | T | V | D | visão | comportamento | formato | loot |
|---|---|---|---|---|---|---|---|
| Compasso | 1 | 2 | 2 | 360°/2 | anda no pulso, para no compasso | ordenar, múltipla escolha | diapasão |
| Acorde | 2 | 3 | 3 | 360°/3 | buffa o coro, cura 1 | associar, explicar | partitura |
| Harmônico | 2 | 3 | 3 | 360°/3 | ressoa; se errar, a pergunta volta | prever, numérico | metrônomo |
| Síncope | 3 | 3 | 4 | 360°/4 | fora do tempo, embaralha opções | achar erro, transferir | metrônomo |
| Dissonância | 3 | 4 | 4 | 360°/3 | debuffa o jogador, chama coro | explicar, síntese | partitura |

Lore: os Ecos são a acústica das pedras. O conservatório afundou, mas a música
continuou tocando.

### Agentes (IA)

| espécie | T | V | D | visão | comportamento | formato | loot |
|---|---|---|---|---|---|---|---|
| Token | 1 | 2 | 2 | 140°/4 | enxame, fragmenta a pergunta | múltipla escolha, associar | peso |
| Perceptron | 2 | 3 | 3 | 140°/5 | copia a última resposta do jogador | verdadeiro/falso, achar erro | embedding |
| Gradiente | 3 | 3 | 4 | 120°/6 | adapta a dificuldade, sobe o nível | numérico, transferir | matriz |
| Atenção | 3 | 3 | 4 | 180°/6 | vê tudo, não tem costas | explicar, síntese | embedding |
| Ruído | 2 | 3 | 3 | 160°/4 | embaralha opções e esconde uma | achar erro, múltipla escolha | peso |

Lore: os Agentes aprenderam com os erros dos jogadores antes de existir jogador.
A Caixa Preta é o que sobrou de uma pergunta que ninguém respondeu.

### Errantes (Hub)

| espécie | T | V | D | visão | comportamento | formato | loot |
|---|---|---|---|---|---|---|---|
| Caranguejo | 1 | 1 | 1 | 100°/3 | foge, esconde-se na areia | múltipla escolha | selo |
| Gaivota | 1 | 1 | 1 | 120°/3 | rouba item se não for vista | associar | pena |
| Rato | 1 | 1 | 1 | 90°/2 | bando, rápido | múltipla escolha | semente |
| Barata | 1 | 1 | 1 | 110°/2 | corre em linha reta | rastrear | seda |
| Vagalume | 1 | 1 | 1 | 360°/2 | ilumina; não ataca | reconhecer | essência |

Os Errantes existem para o mundo parecer vivo e para o jogador aprender o
básico sem medo. Eles fogem, dão loot pequeno e nunca fazem grupo com outras
famílias.

## 3. Chefes

| chefe | continente | vida | fases | formatos | mecânica | loot |
|---|---|---|---|---|---|---|
| O Compilador Ancestral | CS | 4 | 3 | rastrear, achar erro, transferir | na fase 2 chama 2 Bits; na 3 exige uma síntese | Núcleo de Turing + receita |
| O Infinito Profundo | Math | 4 | 3 | numérico, limite, prova | cresce a cada erro; acerta quem fica parado | Selo do Infinito |
| O Observador Cego | Physics | 4 | 3 | unidade, prever, óptica | apaga a luz; o jogador usa tocha/magia | Pedra Orbital |
| O Catalisador | Chem | 4 | 3 | equilíbrio, energia, ligação | explode ao morrer; escudo/cura importam | Pedra Filosofal |
| A Dissonância | Music | 4 | 2 | intervalo, ritmo, timbre | embaralha o pulso; o jogador marca o tempo | Cravo Bem Temperado |
| A Caixa Preta | AI | 4 | 4 | atenção, avaliação, limites | usa o caderno do jogador contra ele | Fragmento da Caixa Preta |

Cada chefe tem uma **sala própria** com tema, armadilha e uma saída que só abre
depois da vitória. A luta é uma aula, não um saco de pancada.

## 4. Grupos e encontros

| grupo | composição | quando | leitura |
|---|---|---|---|
| enxame | 3 a 5 fracos, 1 pergunta compartilhada, vida única | corredores e campos | rápido, loot miúdo |
| matilha | 2 ou 3 da mesma família, 1 líder | toca | líder buffa; mate primeiro |
| corte | 1 forte + 2 fracos que buffam | sala de chefe menor | mate os fracos ou interrompa |
| conselho | 2 ou 3 famílias diferentes, 1 pergunta cada | encruzilhada, subsolo | intercalação; escolha a ordem |
| guarda | 2 fortes, pouca mobilidade | porta, baú, passagem | bloqueia rota; fuga difícil |
| arena | chefe + adds | sala de chefe | fases |

Regras de composição:

- no máximo 3 cartões visíveis (chefe pode ter 4 com adds, mas viram um cartão
  extra só na fase);
- nunca dois bichos com o mesmo formato na mesma batalha, a não ser enxame;
- o nível do grupo é a média da região; o líder é +1;
- um grupo não nasce em cima do jogador: o cone e o aviso vêm antes.

## 5. Visão e alerta

Os parâmetros de cone estão em `02-COMBATE.md`. O bestiário registra, para cada
espécie, o ângulo, o alcance, a audição e a direção de patrulha. O jogador
aprende a ler:

- cone estreito e comprido = perigo de longe, seguro de perto pelas costas;
- cone largo e curto = perigo de perto, fácil de contornar;
- 360° = ouça e ande devagar;
- bicho parado = geralmente patrulha curta; bicho andando = alcance maior.

## 6. Ecologia e respawn

- Cada espécie tem ninho, raio de patrulha e horário (dia/noite/crepúsculo).
- Respawn: 3 a 10 minutos por região; chefe, 20 a 60 minutos.
- Variantes raras: **elite** (+1 vida, loot melhor), **antiga** (+1 formato
  difícil), **eco** (pergunta que o jogador errou, calma, sem morte).
- Clima e hora mudam a composição: à noite, Ecos e Agentes; de dia, Errantes e
  Formas; na chuva, Reagentes.
- O jogador pode limpar uma toca e ela fica vazia por um tempo; o mundo respira.
- Nada de spawn em cima do jogador nem de fila infinita.

## 7. O bestiário no jogo

- **Entrada** desbloqueada ao ver (50%) e ao derrotar (100%).
- Ficha: família, tier, vida, dano, visão, audição, comportamento, formatos,
  loot, fraqueza, onde mora, lore curta.
- **Fraqueza**: um formato ou elemento que causa +50% (ex.: Fractal tem
  fraqueza em transferência; Cristal, em achar erro).
- **Completar** uma família dá: +1 domínio no conceito da família, uma receita,
  um cosmético e uma página de lore.
- O bestiário é também uma **ferramenta de estudo**: mostra quais conceitos o
  jogador já enfrentou e quais misconceptions ainda aparecem.
- **Ecos**: quando o caderno acumula erros de um conceito, um Eco daquele
  conceito aparece num lugar calmo; derrotá-lo é responder com calma e sem
  dano. É a revisão espaçada vestida de mundo.

## 8. Loot e raridade

| raridade | chance | o que é |
|---|---|---|
| comum | 70% | material, selo, comida |
| incomum | 22% | equipamento tier 2, receita |
| raro | 7% | equipamento tier 3, essência, runa |
| épico | 1% | tier 4, variante, relíquia menor |
| único | chefe/quest | relíquia, magia, chave, lore |

O loot é por espécie, não por sorte pura: o jogador sabe o que procurar. Nada de
20 drops inúteis por minuto; a bolsa tem limite e o inventário é uma decisão.

## 9. Exemplos de encontro

- **Toca de Bits (CS, nível 3):** 3 Bits em enxame, pergunta de rastrear;
  recompensa parafuso, selo, chance de chip.
- **Encruzilhada das Formas (Math, nível 12):** conselho com Primo, Lema e
  Vértice; cada um pergunta um formato; o jogador escolhe a ordem; recompensa
  régua e domínio de geometria.
- **Poço dos Reagentes (Chem, nível 20):** Ácido + Mol; o ácido deixa poça; o
  jogador precisa acertar antes de ficar sem espaço; recompensa frasco e
  catalisador.
- **Sala do Compilador (CS, nível 25):** chefe em 3 fases com 2 Bits na fase 2;
  a fase 3 pede uma síntese de lógica e memória; recompensa Núcleo de Turing.

## 10. O que ainda falta decidir

- Quantas espécies no primeiro corte: 40 é o alvo, 24 é o mínimo viável.
- Nomes definitivos: alguns são provisórios; o dono aprova o tom.
- Variantes raras: quantas e com que frequência.
- Chefe de hub: o Porto tem um chefe ou é só tutorial?
- Bestiário compartilhado em party: cada um vê o seu ou o do grupo?

## Famílias (2026-10-22)

As 25 formas de criatura caem em cinco famílias pelo jeito de lutar:
**Gelatinosos** (slime, jelly, atom, flask), **Alados** (bat, moth, wisp, note,
imp), **Cascudos** (scorpion, golem, beetle, crab, sentinel, crystal, gear,
tome), **Rastejantes** (spider, ant, serpent, node, vector) e **Olhos** (eye,
glyph, prism). O chefe não entra em família.

- o bestiário mostra uma faixa com `conhecidos/total` por família;
- conhecer todas as espécies de uma família grava a família no save, avisa uma
  vez ("Família Gelatinosos estudada: +50% de dano contra ela") e passa a dar
  **+50% de dano** contra as criaturas dela, na previsão e no dano real;
- golpe que zerou (desvio) não é ressuscitado pelo bônus.

Prova: `test/familias.test.mjs` (cobertura das 25 formas, complemento, aviso
único, dano, save) e sonda `cdp-familias.mjs` (5 chips, 4/4 com +50%, previsão
de 1,1 para 1,7 contra a família completa).

## Variantes: eco, elite e antiga (2026-10-22)

Além da família, cada sala pode nascer com uma variante rara, decidida pelo id
da caverna e da sala (estável para todo mundo):

| variante | chance | efeito |
|---|---|---|
| eco | 10% | nome "Eco de ...", dobra o material |
| elite | 5% | sufixo "Elite", vida 50% maior, +1 de dano e 50% mais XP |
| antiga | 3% | sufixo "Antiga", vida dobrada, +1 de dano, XP e material em dobro |

A variante é da criatura, não do bestiário: a ficha continua a mesma espécie.
No duelo, a linha "variante Elite: ..." explica o que mudou. Prova:
`test/variantes.test.mjs` (chance medida em 20 mil chaves, efeitos no RPG) e
sonda `cdp-variantes-criatura.mjs` ("Sílaba Antiga", vida 6, linha na tela).

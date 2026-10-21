# 15. Vocações

O vale tem cinco jeitos de ser aventureiro, como Tibia tem as suas. A vocação não
muda o que o vale ensina: muda **como** você luta, coleta e anda. Cada uma tem
força clara e fraqueza clara, e três subcategorias que se escolhem no caminho.

O duelo aqui é de pergunta: o bicho aguenta N acertos (`TIERS`) e cobra dano a
cada erro. Então a vocação mexe nos multiplicadores desse duelo e nos sistemas que
já existem: vida, mana, visão, furtividade, coleta, pet.

## 1. As cinco

### Mago

Quem resolve por magia: ataque e cura à distância, com mana no lugar de vida.

- **Força**: mana alta, magia de dano e de cura, alcance médio, cura a si mesmo.
- **Fraqueza**: vida baixa, dano físico fraco, depende de mana; sem mana, é o
  mais frágil do vale.
- **Subcategorias**
  - **Arcanista** (o do bem): cura e escudo. Acerto cura 1 de vida a cada 3
    acertos; escudo absorve o próximo erro.
  - **Bruxo** (o do mal): dano e maldição. Acerto envenena o bicho (1 a mais no
    próximo acerto); maldição custa mana e reduz a visão dele.
  - **Ilusionista** (o do meio): confunde. O bicho perde a meia-lua de visão por
    alguns segundos, e você escolhe quando começar o duelo.

### Guerreiro

Força bruta, defesa bruta e porradaria.

- **Força**: vida alta, aguenta mais erros, dano físico alto.
- **Fraqueza**: lento, visão curta, mana baixa (quase não usa magia), e o erro
  cobra mais caro de quem está longe de casa.
- **Subcategorias**
  - **Baluarte**: escudo. Cada erro tira 1 a menos; o escudo quebra e volta.
  - **Bárbaro**: dano. Sem armadura, acerto vale mais; erro tira 2 a mais.
  - **Campeão**: provoca. O bicho vê você de mais longe, mas o duelo paga XP
    extra.

### Atirador

O covarde competente: resolve de longe e não gosta de chegar perto.

- **Força**: alcance grande (vê e é visto de mais longe, começa o duelo antes),
  acerto à distância, bom em caça.
- **Fraqueza**: vida baixa, corpo a corpo ruim (perto, o dano cai), recarga entre
  tiros.
- **Subcategorias**
  - **Besteiro**: precisão. Acerto seguido de acerto soma +1.
  - **Caçador de recompensa**: marca o bicho antes do duelo e ganha item extra.
  - **Alquimista de campo**: bombas e frascos; troca mana por dano em área.

### Assassino

O sorrateiro que mata sem ser visto.

- **Força**: furtividade alta, primeiro acerto vale muito, abre baú trancado sem
  chave, anda mais rápido.
- **Fraqueza**: vida baixa, duelo longo é ruim (o bônus vale no começo), e a
  furtividade cai quando o lugar é iluminado.
- **Subcategorias**
  - **Ladrão**: chaves e baús; abre selado sem gastar chave.
  - **Veneno**: o erro do bicho (acerto seu) deixa veneno que corrói por dois
    turnos.
  - **Sombra**: o primeiro acerto vale o dobro se o bicho não te viu.

### Selvagem

O amigo da natureza: conhece a selva, conversa com bicho e vive do que o mato dá.

- **Força**: coleta muito melhor, pet mais forte, rastreia (vê bicho e item de
  longe), anda bem em mato e areia.
- **Fraqueza**: mana baixa, dano sofrido um pouco maior, e o pet ocupa espaço
  (se ele cai, você fica sem metade da força).
- **Subcategorias**
  - **Domador**: pet com duas habilidades, e o pet luta no seu lugar uma vez.
  - **Ervanário**: coleta raro com mais frequência e faz poção melhor.
  - **Rastreador**: revela bicho, baú e veio no minimapa num raio maior.

## 2. Números

Multiplicadores sobre o que já existe. Todos partem de 1,00.

| vocação | vida | mana | dano no acerto | dano sofrido no erro | alcance | furtividade | coleta | pet |
|---|---|---|---|---|---|---|---|---|
| mago | 0,80 | 1,60 | 1,10 | 1,00 | 1,00 | 1,00 | 1,00 | 1,00 |
| guerreiro | 1,35 | 0,60 | 1,20 | 0,80 | 0,85 | 0,90 | 0,90 | 1,00 |
| atirador | 0,85 | 1,00 | 1,15 (longe) / 0,75 (perto) | 1,10 | 1,45 | 1,10 | 1,05 | 1,00 |
| assassino | 0,85 | 1,00 | 1,10, com 1,60 no primeiro | 1,10 | 1,00 | 1,60 | 1,10 | 1,00 |
| selvagem | 1,05 | 0,80 | 1,00 | 1,05 | 1,10 | 1,05 | **1,45** | **1,50** |

Regra de balanceamento: a soma dos ganhos tem que ser paga em alguma fraqueza, e
nenhuma vocação pode ter todos os multiplicadores acima de 1. Um teste confere
isso.

## 3. Escolha e troca

- **Na criação**, depois do nome e do corpo, uma tela com as cinco, cada uma com
  uma frase de força e uma de fraqueza. É a última decisão antes de entrar.
- **Troca no jogo**: na mesa de vocação da capital subterrânea, uma vez por
  nível, de graça na primeira e com custo de material depois. Trocar zera a
  subcategoria e mantém XP, itens e missões.
- **Subcategoria**: escolhida no nível 10, na mesma mesa, e pode ser trocada
  pagando (não é de graça, senão não é escolha).

## 4. O que a vocação não faz

- não muda o currículo: todas as pedras continuam iguais para todo mundo;
- não tranca área, pergunta nem item;
- não cria classe mais forte para PvP: no duelo entre viajantes os
  multiplicadores de vida e dano são normalizados, e vale só o que é de perícia
  (furtividade, alcance, pet).

## 5. Prova

- teste de balanceamento: ganho pago por fraqueza e nenhuma vocação acima de 1 em
  tudo;
- teste de aplicação: cada multiplicador muda o número certo no duelo e na coleta;
- teste de troca: trocar mantém XP, itens, missões e mapa, e zera só a
  subcategoria;
- navegador: cinco fichas com nome, força e fraqueza na criação, e a mesa de
  vocação abrindo no subsolo.

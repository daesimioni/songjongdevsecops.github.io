# Casas: porte de gente e porta que abre

Pedido do dono em 2026-10-21: as cabanas eram ridículas, desproporcionais,
não davam para entrar e não serviam para nada. Este documento registra o que
mudou, a regra de espaço e o que continua em aberto.

## 1. O problema medido

- A casa tinha **44 x 38 px** e a cabana **36 x 30 px**, com porta de 11 e 9 px.
  O boneco tem cerca de 25 px de altura, então a porta dava menos da metade
  dele e a cabana era quase do tamanho do corpo.
- Nada barrava o corpo: dava para atravessar a parede.
- A fachada era só enfeite: não havia entrada, interior nem uso.

## 2. Porte e colisão

Cada tipo de construção ganhou `escala` em `js/assets/construcoes.js`:

| peça | desenho (px) | escala | tamanho no mundo | porta (desenho → mundo) |
|---|---|---|---|---|
| casa | 44 x 38 | 2 | 88 x 76 px (5,5 x 4,75 tiles) | 14 → 28 px |
| cabana | 36 x 30 | 2 | 72 x 60 px (4,5 x 3,75 tiles) | 11 → 22 px |
| torre | 28 x 52 | 2 | 56 x 104 px (3,5 x 6,5 tiles) | 13 → 26 px |
| galpão | 46 x 32 | 2 | 92 x 64 px (5,75 x 4 tiles) | 14 → 28 px |
| ruína, doca, poço, cerca | como estão | 1,5 | não entram | não entram |

O desenho continua nascendo em 2x e é copiado com `dw = def.w * escala`
(`js/assets/index.js`). A porta foi ampliada no próprio traço da casa, cabana
e torre para caber uma pessoa.

A fachada agora ocupa o chão: a base entra como caixas de colisão de no
máximo 2 tiles de largura por 1,2 de profundidade, na frente do desenho. A
porta fica fora da caixa, então dá para encostar e apertar F.

## 3. Onde a casa pode nascer

Com o dobro do tamanho, a folga cresceu junto (`js/assets/povoado.js`):

- o candidato precisa do retângulo da fachada inteiro em tile macio da ilha;
- a casa não nasce a menos de `largura/2 + 1,3` de um totem;
- nem a menos de `largura/2 + 1,8` de uma boca de caverna;
- nem perto de NPC, farol ou clareira de caçada;
- se a boca da caverna nasceu depois e ainda encosta na fachada, a casa sai
  (a descida vale mais que o enfeite).

Resultado: **72 casas** em 86 áreas (30 torres, 17 galpões, 21 cabanas,
4 casas), contra 71 fachadas minúsculas antes.

## 4. Interiores

Cada tipo tem uma sala própria num bolsão de mar, longe das ilhas
(`INTERIORES` em `js/world.js`):

| sala | posição | tamanho | piso |
|---|---|---|---|
| casa | 492, 330 | 16 x 12 | tábua |
| cabana | 492, 4 | 14 x 11 | tábua |
| torre | 276, 4 | 12 x 13 | mármore |
| galpão | 520, 180 | 18 x 11 | pedra |

A sala nasce cercada de parede, com **uma porta** no meio da parede de baixo.
O spawn fica 1,2 tile acima da porta, virado para ela. Ao entrar, a câmera
salta para o bolsão (`renderer.snap()`), o mar em volta some atrás de um
fundo de tábua escura e o minimapa é escondido (`body.na-casa`).

A mobília é re-sorteada a cada entrada, pela semente da casa: mesa, fogueira,
cama (menos no galpão), estante, barril, caixote, saco, fardo, tocha e planta.
A mesma casa repete o mesmo arranjo; duas casas do mesmo tipo não.

## 5. O que a casa faz

- **F ou toque na porta**: entra.
- **Mesa**: abre a página de estudo da área da casa (o mesmo `openPost` do
  totem, com o conteúdo do lugar).
- **Fogueira**: descansa e devolve vida e mana.
- **Porta**: sai com F ou pisando nela, de volta ao ponto exato da rua.
- Dentro de casa não chove, não venta e o aviso de clima não aparece.
- A posição não é salva: recarregar a página devolve o jogador ao spawn, nunca
  deixa alguém preso no bolsão.

## 6. Prova

- `test/casas.test.mjs`: escala, 72 portas, sala fechada com exatamente uma
  porta, spawn livre, mesa/fogo/cama dentro, mobília determinística e
  diferente entre casas do mesmo tipo.
- 28 suítes node verdes; matriz de navegador 19/19; 60 fps com a sala aberta.
- Sondas: `cdp-casa.mjs` (fachada antes/depois) e `cdp-casa2.mjs` (entrar,
  estudar, descansar, sair) em `temporarios/2026-10-20-mundo-song-pedido/`.

## 7. O que continua em aberto

1. São **quatro plantas** compartilhadas por tipo; a mobília varia, a geometria
   da sala não. O próximo passo é uma planta por disciplina ou por ilha.
2. A mobília é decorativa: não tem colisão, então o corpo passa por cima de
   barril e cama. Fazer cada peça barrar exige caixa própria e um teste de
   caminho dentro da sala.
3. Não há morador dentro de casa. Um NPC por casa, com falas do assunto, daria
   mais vida e uma segunda fonte de dica.
4. A porta de fora é desenhada na fachada; não há soleira, número ou placa
   dizendo o nome da casa.

# Combate: visão em meia lua, grupos e consequência

O combate é a pergunta. O resto é encenação para dar peso e leitura ao momento.
Este documento define como o bicho vê, como o grupo ataca, como o dano funciona
e como o jogador sai vivo sem perder o que estudou.

## 1. Do que existe para o que queremos

Hoje (2026-10-20): cada espécie tem cone em meia-lua (ângulo e alcance próprios),
linha de visão e direção; o cone é desenhado no chão. Quando até quatro bichos
veem o jogador na mesma janela, a batalha abre com todos: principal à esquerda,
matilha à direita, vida e pergunta por bicho, com 6 s de respiro depois da
briga. Fugir limpa a fila e cobra o risco do bicho da frente.

Alvo: cada espécie tem um **campo de visão em meia lua** (setor), com ângulo e
alcance próprios; o jogador pode se aproximar pelas costas. Um grupo pode ver o
jogador ao mesmo tempo e abrir uma **batalha de grupo** com 2 ou 3 perguntas
simultâneas. A fuga, o ruído e a parede importam.

## 2. O campo de visão

Cada monstro tem:

- `angle`: abertura do setor, de 50° a 150°;
- `range`: alcance em tiles, de 3 a 8;
- `facing`: direção atual (patrulha, alerta, combate);
- `hearing`: raio de audição em tiles, de 1 a 5;
- `stealth`: se o jogador andando devagar é mais difícil de ver;
- `alert`: estados `idle`, `suspicious`, `chase`, `engage`.

Regras:

- o setor é desenhado no chão, translúcido, na cor da espécie;
- parede e porta bloqueiam a visão; água não bloqueia;
- o jogador atrás do bicho não é visto, a menos que faça barulho;
- correr (Espaço) dobra o raio de audição e deixa rastro;
- andar devagar (tecla de cuidado) reduz o ruído e a visibilidade;
- se um bicho vê, ele alerta os da mesma família num raio de 4 tiles;
- se o jogador sai do alcance por 3 segundos, o bicho volta ao ninho;
- um bicho nunca atravessa parede nem fica preso: usa o mesmo A* do jogador.

Parâmetros por família (ponto de partida, ajustável no playtest):

| família | ângulo | alcance | audição | comportamento |
|---|---|---|---|---|
| Falhas (CS) | 90° | 4 | 3 | anda em zigue-zague, alerta rápido |
| Formas (Math) | 60° | 6 | 2 | patrulha em polígono, olha longe |
| Forças (Física) | 50° | 7 | 2 | lento, cone estreito e comprido |
| Reagentes (Química) | 120° | 4 | 3 | fica perto da poça, cheira o jogador |
| Ecos (Música) | 360° | 3 | 5 | ouve em volta, não vê longe |
| Agentes (IA) | 140° | 6 | 3 | adapta, observa o caderno, chama reforço |
| Errantes (Hub) | 100° | 3 | 2 | foge, não quer briga |
| Chefes | varia | 6 a 8 | 4 | fases e telegrafia |

## 3. Patrulha e alerta

- **Ninho:** cada bicho tem um ponto de casa e um raio de patrulha; ele não
  persegue para sempre.
- **Patrulha:** escolhe um ponto livre dentro do raio, anda até lá, espera,
  escolhe outro. O desenho mostra a direção do olhar.
- **Suspeita:** ao ouvir ou ver por um instante, para, olha na direção, mostra
  um `?`. Se o jogador sai, volta; se fica, vira `!` e inicia.
- **Perseguição:** anda até o jogador, contorna parede, mas desiste após 5
  tiles do ninho ou 4 segundos sem linha de visão.
- **Grupo:** um `!` pode chamar 1 ou 2 vizinhos da mesma família; o encontro
  nasce com os que chegaram.
- **Sono:** alguns bichos dormem em certas horas; andar devagar passa; correr
  acorda.
- **Isca:** item de carne/erva pode distrair um grupo por alguns segundos.

O jogador sempre tem uma leitura: o cone desenhado, o `?`/`!`, o som e a
mudança de cor. Nada de ataque surpresa sem aviso visual.

## 4. Batalha de grupo

### Composição

- **Matilha:** 2 ou 3 bichos da mesma família, um líder;
- **Corte:** 1 bicho forte e 2 fracos que o buffam;
- **Enxame:** 3 a 5 fracos, um único pool de vida e uma pergunta compartilhada;
- **Conselho:** 2 ou 3 espécies diferentes, uma pergunta cada, intercalação;
- **Chefe:** 1 chefe com fases e, às vezes, 2 adds.

O encontro nasce do grupo que viu o jogador, não de uma lista fixa. O nível e a
composição respeitam a região e o domínio do jogador.

### A tela

- Cada monstro é um cartão com nome, vida (perguntas restantes), humor e a
  pergunta atual.
- Todas as perguntas ficam visíveis ao mesmo tempo. O jogador escolhe por qual
  começar; não há cronômetro por padrão.
- A pergunta ativa recebe foco; as outras ficam legíveis, mas em segundo plano.
- O jogador pode trocar de alvo antes de responder; a pergunta não muda.
- Um contador de **foco** (0 a 5) sobe com acertos e cai com erros; o foco alto
  libera uma habilidade de arma ou magia.
- O log lateral mostra o que aconteceu: "Bit perguntou sobre bits; você acertou;
  Loop tremeu".

### Turnos

1. O jogador responde uma pergunta de um monstro.
2. Acertou: dano no alvo, foco +1; se o dano zera, o cartão sai.
3. Errou: dano no jogador, foco -1; o monstro ganha um "intent" (special) e a
   pergunta volta ao caderno.
4. Depois da resposta, os monstros "agem": cada um cobra um efeito curto
   (telegrafado no cartão), sem nova pergunta imediata. Exemplos: o Olho embaralha
   as opções da próxima; o Golem aumenta o dano do próximo erro; o Coro cura o
   líder; o Agente esconde uma opção.
5. O jogador escolhe o próximo cartão. A batalha acaba quando todos caem ou
   quando o jogador foge.

Não há turno automático que obrigue a responder correndo. "Simultâneo" é ver
todas as perguntas e gerenciar o grupo, não digitar três respostas ao mesmo tempo.

### Fuga

- Fugir é sempre possível fora de chefe, com uma penalidade curta: o jogador
  recua, o grupo fica em alerta e o encontro trava por alguns segundos.
- Em chefe, a fuga é bloqueada pela arena; a saída é vencer ou cair.
- Cair não perde item; o jogador acorda no último acampamento.

## 5. Dano, vida e morte

Atributos mínimos: **vida**, **mana**, **dano**, **defesa**, **velocidade**,
**visão**, **foco** (cargas de dica), **sorte** (loot).

Fórmulas de partida (simples, ajustáveis):

- dano por acerto = `arma + perícia + encanto + buff - resistência`;
- dano por erro = `tier do bicho + modificador - armadura - escudo`;
- vida = `30 + nível + equipamento + relíquias + encantos + bicho`;
- mana = `10 + nível + equipamento`; magias gastam e regeneram com acertos;
- defesa reduz dano de erro, não o dano causado;
- escudo bloqueia **um** erro de um tipo por batalha e quebra (volta na cidade);
- armadura e acessórios dão resistência a tipos de erro (cálculo, unidade,
  definição, sintaxe, equilíbrio, intervalo).

Morte:

- ao chegar a 0, o jogador acorda no último acampamento/taverna, com vida cheia;
- não perde item, XP ou domínio;
- perde o encontro e um pouco de tempo; o caderno guarda as perguntas erradas;
- o bicho volta ao ninho; o baú continua lá;
- uma mensagem curta e gentil, sem tela de humilhação.

A morte é uma pausa, não um castigo. O jogo educativo não pode punir o erro de
forma que desestimule estudar.

## 6. Armas e magias no combate

O combate é onde o equipamento ganha significado:

- **espada:** dano equilibrado; combo de acertos aumenta o dano;
- **clube:** dano alto, interrompe o special do alvo com impacto;
- **machado:** acerto atinge os outros alvos com parte do dano;
- **arco:** mira um ponto fraco; bônus em pergunta de transferência/aplicação;
- **varinha:** dano elemental e mana; bônus em pergunta numérica;
- **cajado:** cura, escudo e dica; bônus em pergunta de explicação;
- **escudo:** bloqueia um erro do tipo escolhido;
- **colar/anel:** passivos (dica extra, visão, sorte, vínculo com bicho).

Magias de combate (ver `03-ITENS.md`): Luz, Contraexemplo, Dedução, Unidade,
Escudo, Cura, Purificar, Síntese. Cada uma resolve um tipo de problema, não só
um número.

## 7. Chefes

Um chefe é uma **aula final**, não um saco de vida.

- 2 a 4 fases; cada fase muda o formato da pergunta (reconhecer → aplicar →
  achar erro → transferir).
- O chefe telegrafa o tema da próxima pergunta com um símbolo e uma fala curta.
- Adds aparecem em fases específicas; matá-los remove um debuff.
- Um "ponto fraco" abre depois de 2 acertos seguidos; acertar nele causa dano
  grande, mas a pergunta é de transferência.
- Se o jogador erra a mesma misconception duas vezes, o chefe "ensina" a
  explicação e a pergunta volta mais fácil; não é punição infinita.
- O loot é único: relíquia, receita, magia, chave de rota, entrada de cidade.

Chefes planejados (detalhe em `04-BESTIARIO.md`):

| continente | chefe | tema | fases |
|---|---|---|---|
| Computação | O Compilador Ancestral | lógica, memória, concorrência | 3 |
| Matemática | O Infinito Profundo | limites, infinito, prova | 3 |
| Física | O Observador Cego | luz, órbitas, medida | 3 |
| Química | O Catalisador | equilíbrio, energia, ligação | 3 |
| Música | A Dissonância | harmonia, ritmo, timbre | 2 |
| IA | A Caixa Preta | atenção, avaliação, limites | 4 |

## 8. Grupo com outros jogadores

- Caçada em party: até 4 jogadores; cada um vê o mesmo grupo de bichos.
- Cada jogador recebe uma pergunta do mesmo encontro (ou a mesma, se o grupo
  for enxame); o dano é somado.
- Ajuda: um jogador pode gastar uma magia de apoio no cartão do outro (dica,
  escudo, cura), sem responder pela pessoa.
- Voz não é obrigatória; o chat da sala e os pings bastam.
- Sem PvP aberto. Duelo amistoso opt-in, sem perda, com pergunta combinada.

## 9. Interface e leitura

- O cone de visão fica no chão, com borda e preenchimento leve; muda de cor no
  alerta.
- O cartão do bicho mostra a família, o formato da pergunta e a vida em perguntas.
- A pergunta ativa é grande; as outras são cartões menores, legíveis.
- O feedback de erro mostra a opção escolhida, a certa, a misconception e a
  explicação.
- O botão de fugir fica visível, com a consequência escrita.
- No celular, os cartões viram uma lista vertical; o alvo ativo fica no topo.
- Acessibilidade: sem piscar rápido, contraste alto, texto ajustável, opção de
  ler a pergunta em voz alta, modo sem tremor.

## 10. Balanceamento

- O nível do jogador abre vida e mana; o **domínio** abre dano e precisão.
- O equipamento dá identidade, não invalida o estudo: nenhuma peça responde
  sozinha.
- O dano dos bichos cresce por região, não por tempo de jogo.
- O encontro médio dura 60 a 120 segundos; chefe, 5 a 10 minutos.
- O jogador deve acertar ~3 de 4 perguntas no seu nível; se acerta tudo, sobe;
  se erra muito, o jogo oferece dica e degrau, não vergonha.
- Nenhum bicho pode stunlar o jogador em loop; especiais têm recarga e aviso.
- O loot tem peso: material comum, peça útil, receita, relíquia. Nada de 20
  itens inúteis por minuto.

## 11. Casos de borda

- **Parede entre o jogador e o bicho:** não vê; não persegue.
- **Água:** o bicho não atravessa; o jogador também não, salvo ponte.
- **Escada/portal:** o bicho não segue para outra sala; a fuga pela escada é
  válida e encerra o encontro.
- **Dois grupos ao mesmo tempo:** o primeiro que vê inicia; o segundo pode
  entrar como add se estiver a 4 tiles e ouvir o chamado.
- **Jogador invisível/stealth:** o bicho ainda ouve se correr; a magia de
  silêncio reduz.
- **Bicho preso:** teleporta de volta ao ninho após 3 segundos preso.
- **Queda de conexão em party:** o jogador fica em espera; o grupo pode
  continuar; ao voltar, entra no próximo turno.
- **Morte em party:** o jogador cai, o grupo pode terminar; renasce no
  acampamento e pode voltar.

## 12. Testes e evidência

- Simulação determinística de encontros (seed) para balancear dano e duração.
- Playtest com tempo, acerto, erros por misconception, sensação de pressão.
- Métrica de "quase morte": se muita gente morre no primeiro contato, o dano
  está alto.
- Métrica de "sem graça": se ninguém usa magia/escudo, o combate está raso.
- Acessibilidade testada com teclado, leitor de tela e celular.

## 13. Decisões abertas

- Cronômetro: recomendo desligado por padrão, com modo fluência opcional.
- Morte: recomendo sem perda de item/XP; só tempo e o caderno.
- PvP: recomendo opt-in, sem perda.
- Tamanho do grupo: 3 bichos é o teto por legibilidade; 4 só em chefe/adds.

## Audição: o passo corrido chega antes da vista (2026-10-22)

Correr dentro de 6,5 tiles de um bicho que ainda **não** vê o jogador faz o
bicho parar, virar o rosto para o som e mostrar `?` por 2,2 s. Andar não faz
barulho, e ouvir não inicia duelo: o combate continua nascendo só da visão. O
bicho já viu (`!`) tem precedência.

Prova: `test/audicao.test.mjs` (raio, barulho só na corrida, chefe fora, direção
cardinal e o `?` no desenho) e sonda `cdp-audicao.mjs` (Bit a 3,2 tiles virou
para leste, sem alerta nem duelo; parado, não reagiu).

## Sono: um quinto das criaturas começa dormindo (2026-10-22)

Um quinto dos bichos de cada descida nasce dormindo, decidido pelo id da
caverna e da sala. Dormindo, ele não passeia, não vê e não inicia duelo; mostra
`z` no lugar do `?`. Acorda com passo a menos de 2,6 tiles ou com corrida dentro
do raio de audição (6,5) e não volta a dormir na mesma descida.

Prova: `test/audicao.test.mjs` (limiares do passo e da corrida) e sonda
`cdp-sono.mjs`: três cavernas com 2, 2 e 1 bicho dormindo; a 5,2 tiles o passo
não acordou; perto e correndo acordou, zero duelo iniciado dormindo.

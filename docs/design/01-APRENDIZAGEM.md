# Aprendizagem: o motor que faz a pergunta ensinar

> **Documento de conceito, congelado.** O que está abaixo é o desenho na data em
> que foi escrito, não a lista do que falta. Estado atual: [`../README.md`](../README.md);
> pendências verificadas: [`39-BACKLOG-VERIFICADO.md`](39-BACKLOG-VERIFICADO.md).


Este documento define como o jogo ensina. Sem isso, o resto é enfeite. A meta
não é "ter muitas perguntas", é **fazer o jogador entender, lembrar e transferir**
sem sentir que está estudando.

## 1. O diagnóstico do que existe hoje

- 60 perguntas, 3 por dificuldade por continente. Pouca variedade e repetição
  rápida, especialmente em sessões longas.
- Quase tudo em múltipla escolha de 3 opções, sem distratores ligados a erros
  reais, sem variantes e sem controle de repetição.
- O acerto dá dano e XP, mas o jogo não sabe **qual conceito** foi aprendido,
  nem quando revisar, nem o que o jogador errou da última vez.
- O tema da sala só reordena o baralho; não há banco por conceito.
- A explicação aparece, mas não volta como revisão programada.
- Não há modo calmo de estudo, prática de formato ou prova de transferência.

O plano abaixo troca o baralho plano por um **grafo de conceitos + banco
tipado + agendamento**.

## 2. Princípios de aprendizagem

1. **Prática de recuperação:** o jogador tenta lembrar antes de ver a resposta.
2. **Repetição espaçada:** o que foi esquecido volta cedo; o dominado volta tarde.
3. **Intercalação:** misturar assuntos e formatos melhora a discriminação e
   reduz a sensação de repetição.
4. **Feedback elaborado:** além de certo/errado, o jogo diz por que e qual
   raciocínio estava faltando.
5. **Erro produtivo:** errar é informação, não humilhação. O erro vira cartão
   no caderno e pode virar um "eco" no mundo.
6. **Andaime que some:** dica, definição e contraexemplo aparecem quando
   precisam e desaparecem quando o jogador já consegue sozinho.
7. **Fluxo:** dificuldade entre 75% e 85% de acerto; nem tédio, nem sufoco.
8. **Autonomia, competência e vínculo:** o jogador escolhe a rota, vê a própria
   evolução e joga com gente.
9. **Carga cognitiva:** uma pergunta, uma ideia; texto curto; opções claras.
10. **Sem escuro:** nada de perder progresso por castigo, nem sequência que
    quebra, nem medo de sair.

## 3. O grafo de conceitos

Cada pergunta pertence a um **conceito**. Cada conceito tem:

- `id` estável, nome, continente, descrição de uma linha;
- pré-requisitos (outros conceitos);
- nível de dificuldade intrínseca (1 a 5);
- estação ou aula que o apresenta;
- monstros que o usam como tema;
- itens, magias ou receitas que o recompensam;
- perguntas (muitas), em formatos diferentes.

Exemplos de conceitos:

| continente | conceitos (amostra) |
|---|---|
| Computação | bit e byte, portas lógicas, complemento de dois, memória, pilha, fila, algoritmo, complexidade, hash, concorrência |
| Matemática | primos, divisibilidade, proporção, funções, derivada, integral, limite, probabilidade, geometria, infinito, prova |
| Física | cinemática, forças, energia, quantidade de movimento, ondas, calor, luz, óptica, gravitação, órbitas |
| Química | átomo, tabela periódica, ligação, mol, estequiometria, ácido-base, equilíbrio, energia de reação, solubilidade |
| Música | pulso, compasso, intervalo, escala, acorde, harmonia, timbre, forma, acústica, proporção |
| IA | dado e amostra, probabilidade, regressão, classificação, rede neural, gradiente, atenção, transformer, avaliação, limites |

O grafo não precisa aparecer inteiro para o jogador. Ele aparece como **mapa de
domínio** no caderno: ilhas de conceito com o nível de cada uma, ligações de
pré-requisito e pontos fracos.

## 4. Domínio por conceito

Cada conceito tem um estado de 0 a 5:

| nível | nome | evidência |
|---|---|---|
| 0 | não visto | nunca encontrou |
| 1 | exposto | viu a explicação, ainda não acertou sozinho |
| 2 | assistido | acertou com dica ou com o formato mais fácil |
| 3 | independente | acertou sem dica no formato padrão |
| 4 | fluente | acertou em formatos variados e com pouco tempo |
| 5 | transferência | aplicou o conceito num contexto novo, explicou ou corrigiu um erro |

O estado sobe com evidência e desce com esquecimento (revisão vencida) e com
erros repetidos. O jogo não mostra "nota"; mostra **domínio**, que é uma leitura
de confiança, não uma prova.

Modelo simples, sem matemática pesada: uma estimativa de acerto por conceito
(atualizada por acerto/erro, dificuldade da pergunta e uso de dica), mais a
data da última prática. Isso basta para escolher a próxima pergunta e agendar a
revisão. Não precisamos de rede neural para isso; precisamos de dados limpos.

## 5. Formatos de pergunta

Múltipla escolha é só um dos formatos. Cada família de monstro prefere alguns
formatos, e cada equipamento/magia interage com eles.

| formato | o que mede | exemplo |
|---|---|---|
| múltipla escolha | reconhecimento e discriminação | "qual porta lógica só dá 1 com as duas entradas ligadas?" |
| verdadeiro/falso com justificativa | crença e contraexemplo | "todo número primo é ímpar; prove ou dê um contraexemplo" |
| numérico com unidade | cálculo e dimensão | "qual a força resultante, em N?" |
| ordenar | processo e causalidade | "ordene as etapas de uma busca em largura" |
| associar | vocabulário e relações | "ligue cada símbolo ao seu significado" |
| apontar no diagrama | leitura de modelo | "clique no nó que armazena o bit" |
| rastrear código | execução mental | "o que este laço imprime na terceira volta?" |
| achar o erro | depuração e rigor | "qual linha quebra a invariante?" |
| prever | hipótese e modelo | "o que acontece com o período se dobrar o comprimento?" |
| explicar em uma linha | síntese e linguagem | "explique o que o catalisador faz sem usar a palavra 'acelera'" |
| construir/ajustar | aplicação prática | "monte o circuito que acende com A e B" |
| transferir | uso em contexto novo | "use a mesma ideia para resolver este caso diferente" |

Cada pergunta declara um formato. O jogo tenta variar o formato do mesmo
conceito antes de aumentar a dificuldade. A variedade é o principal remédio
contra a repetição.

## 6. Distratores que ensinam

Cada opção errada deve representar um **erro plausível**, não um número aleatório:

- "confundiu bit com byte";
- "esqueceu a unidade";
- "aplicou a regra do produto em vez da soma";
- "achou que a ordem dos fatores muda a matriz";
- "confundiu frequência com período".

No banco, cada distrator tem um `misconception` e uma explicação própria. Quando
o jogador escolhe aquela opção, o feedback diz **qual raciocínio** falhou. Isso é
muito mais educativo do que "errado".

## 7. Escolha adaptativa

Ao abrir um encontro, o jogo escolhe:

1. um conceito-alvo (o mais fraco ou o que está para revisar);
2. um formato adequado à família do monstro;
3. uma pergunta com dificuldade que dê ~75% a 85% de acerto estimado;
4. uma variante não vista recentemente.

Se o jogador erra, a próxima pergunta do mesmo encontro é um degrau abaixo ou
traz uma dica. Se acerta com folga, o próximo é um degrau acima ou um formato
diferente. O encontro termina antes do cansaço: 1 a 4 perguntas por bicho,
2 a 3 bichos por grupo, 4 a 8 perguntas por chefe.

## 8. Revisão espaçada e o Caderno de Campo

Toda pergunta respondida vira um cartão no caderno com:

- conceito, formato, data, acerto/erro, dica usada, tempo (quando houver);
- a explicação e o erro específico;
- a próxima revisão.

Intervalos iniciais: 1 dia, 3 dias, 7 dias, 21 dias, 60 dias. Erro volta em
1 dia; acerto sobe um degrau. O jogador pode revisar no caderno a qualquer
momento, sem combate, e ganha um pequeno bônus de domínio (não XP infinito).

O caderno é também uma **ferramenta de estudo**: filtros por continente,
conceito, erro, "nunca acertei", "vence hoje". Exportar em texto para levar
para fora do jogo. Sem conta, sem nuvem obrigatória.

## 9. Modos de estudo

| modo | o que é | para quem |
|---|---|---|
| expedição | mundo normal, combate, loot, caves | sessão de jogo |
| estudo calmo | estações, aulas, prática sem bicho | revisar sem pressão |
| caderno | cartões, revisão espaçada, mapa de domínio | estudar de verdade |
| prova de campo | mistura de formatos, sem dica, sem cronômetro | fechar um continente |
| fluência | cronômetro suave opcional, perguntas já dominadas | quem quer velocidade |
| Grande Prova | expedição final multi-etapa | endgame |

O jogo sugere uma pausa após um tempo configurável, mas nunca bloqueia. Sair no
meio não perde nada; o mundo guarda o estado.

## 10. Dicas e andaimes

Escada de ajuda:

1. releia a pergunta e destaque a palavra-chave;
2. dica conceitual (definição curta);
3. contraexemplo ou caso simples;
4. eliminar uma opção errada (magia/runa);
5. resolver um passo junto (modo estudo apenas).

Cada degrau reduz o XP e o domínio ganho, mas nunca zera. O objetivo é o jogador
resolver; a ajuda é parte do caminho, não vergonha.

## 11. Batalhas de grupo como intercalação

Dois ou três monstros de conceitos diferentes, cada um com sua pergunta, é
intercalação natural. O jogador escolhe a ordem, vê todas as perguntas e
gerencia o foco. Isso treina discriminação entre assuntos e evita o piloto
automático de responder 20 perguntas iguais.

## 12. Conteúdo: o alvo e o pipeline

Alvo mínimo para o jogo parecer grande:

- 30 conceitos por continente (180 no total), com 6 a 12 perguntas cada;
- 600 a 1200 perguntas no banco, com variantes geradas por números, contexto e
  diagrama;
- cada conceito com pelo menos 3 formatos diferentes;
- cada erro plausível com explicação própria;
- cada pergunta com fonte ou revisão humana.

Pipeline:

1. **Autor:** escreve a pergunta no formato do esquema, com conceito, formato,
   distratores, explicação e variantes.
2. **Revisor:** confere correção, clareza, unidade, alternativa e adequação.
3. **Linter:** valida esquema, opções, resposta, explicação, conceito existente,
   formato, tamanho, duplicata e cobertura.
4. **Playtest:** mede acerto, tempo, erros por distrator, comentários.
5. **Publicação:** entra no banco com um id estável e um histórico de versão.

O linter e o playtest são tão importantes quanto o texto. Sem eles, o banco vira
um monte de perguntas repetidas.

## 13. O exame e a transferência

A prova de um continente não é "20 múltiplas escolhas". É uma mistura de:

- 2 perguntas de reconhecimento;
- 2 de aplicação;
- 2 de análise/erro;
- 1 de transferência;
- 1 prática na estação (montar, ajustar, explicar).

O jogador pode repetir; o resultado é domínio, não nota. A Grande Prova combina
conceitos de continentes diferentes e termina com uma síntese.

## 14. Métricas de aprendizagem

- acerto por conceito ao longo do tempo;
- retenção em 7 e 30 dias;
- erro por distrator (qual concepção errada é comum);
- tempo até a primeira resposta certa;
- uso de dica e queda de uso com o tempo;
- transferência: acerto em formato novo;
- cobertura do banco por conceito e formato;
- sessões por dia e duração, para conforto (não para pressão).

## 15. Ética e acessibilidade

- sem ranking global obrigatório, sem sequência que pune, sem loot box;
- sem coleta de dado pessoal; progresso local, exportável;
- fonte ajustável, contraste, paleta para daltonismo, movimento reduzido;
- opção sem cronômetro, sem tremor de tela, sem som obrigatório;
- leitura em voz alta do texto da pergunta (Web Speech API, opcional);
- navegação por teclado e leitor de tela nos painéis;
- conteúdo revisado por professor; erros corrigidos com nota de versão.

## 16. O que não fazer

- banco plano sorteado aleatoriamente;
- XP infinito por repetir a mesma pergunta;
- perguntas com pegadinha de português em vez de conceito;
- elogio vazio ("incrível!") sem explicar;
- cronômetro como punição;
- dificuldade que sobe por nível do jogador, não por domínio;
- conteúdo gerado sem revisão;
- recompensa por tempo de tela, não por aprendizagem.

## 17. Ligação com o resto

- Combate (`02-COMBATE.md`) usa o formato e a dica como parte da luta.
- Itens (`03-ITENS.md`) dão ferramentas para esses formatos: varinha para
  numérico, arco para transferência, escudo para erro, colar para memória.
- Bestiário (`04-BESTIARIO.md`) mapeia famílias a formatos e misconceptions.
- Mundo (`05-MUNDO.md`) distribui conceitos por ilha, caverna e cidade.
- Roadmap (`06-ROADMAP.md`) coloca o banco e o motor antes do enfeite.

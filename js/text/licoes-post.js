// As lições das páginas escritas à mão, antes do catálogo. O corpo original
// continua sendo a explicação; aqui entram o limite, a pergunta que o bicho
// faria, a frase de cabeça e o exercício de mão, para que a pedra antiga
// também se comporte como curso.
export const LICOES_POST = {
  welcome: {
    limite:
      "O vale não tem índice nem prova final: o que existe é caminho e pedra. Quem procura a ordem certa não encontra, porque não há uma. O que há é o próximo passo que faz sentido para quem chegou.",
    pergunta: {
      q: "Qual é a ordem certa para percorrer o vale?",
      a: "Nenhuma: qualquer caminho serve",
      why: "As áreas não exigem pré-requisito de mapa. A ordem existe no assunto, não no chão, e cada pedra se abre para quem chega.",
    },
    levar: "Não há mapa do vale inteiro, só o que você já andou e o próximo passo.",
    maos:
      "Escolha a pedra mais próxima do porto, abra a página dela e leia só a primeira parte. Depois diga em uma frase o que ela guarda, sem consultar de novo.",
  },
  echo: {
    limite:
      "A síntese sonora mostra o mecanismo, não substitui um instrumento. O que o rádio ensina é a relação entre frequência, tempo e envelope, e essa relação vale em qualquer sintetizador.",
    pergunta: {
      q: "O que acontece com a frequência quando uma nota sobe uma oitava?",
      a: "Ela dobra",
      why: "Oitava é razão de dois para um. Dó central em 261,63 Hz tem o Dó acima em 523,25 Hz, e a distância entre eles é a mesma que o ouvido reconhece como a mesma nota.",
    },
    levar: "Uma oitava é o dobro da frequência, e o resto da escala é negociação.",
    maos:
      "Ligue o som, monte um padrão de oito passos e mude uma única voz. Ouça antes e depois e diga o que mudou no clima sem olhar a tela.",
  },
  logic: {
    limite:
      "A porta lógica é o tijolo, e o circuito é a frase. A tentação é achar que só a porta importa; o que decide o comportamento do conjunto é a ligação entre elas, e é ali que o erro de projeto costuma morar.",
    pergunta: {
      q: "O que a porta E devolve quando uma entrada é verdadeira e a outra é falsa?",
      a: "Falso",
      why: "A porta E só devolve verdadeiro quando todas as entradas são verdadeiras. Basta uma falsa para a saída cair, e é isso que a torna útil para condição que exige tudo junto.",
    },
    levar: "A porta é o tijolo; a ligação é o que decide o circuito.",
    maos:
      "Monte a tabela verdade de três portas ligadas em série e diga em que linha a saída acende. Confira contando pelo caminho, não pela tabela pronta.",
  },
  adder: {
    limite:
      "O somador completo resolve a soma de um bit com transporte, e a fila deles soma palavras inteiras. O limite aparece na velocidade: o transporte atravessa a fila e o último bit espera por todos os anteriores.",
    pergunta: {
      q: "Para que serve o transporte na soma binária?",
      a: "Para levar o excesso de uma coluna para a seguinte",
      why: "Quando a soma de dois bits passa de um, o valor que não cabe na coluna vira transporte e entra na coluna da esquerda. Sem ele, a soma de um mais um daria zero e perderia o valor.",
    },
    levar: "Um mais um dá zero com transporte: a coluna seguinte carrega o excesso.",
    maos:
      "Some na mão 1011 mais 0110, uma coluna por vez, e marque cada transporte. Depois confira o resultado em decimal para ver se os dois batem.",
  },
  state: {
    oque:
      "Um circuito sequencial guarda estado: a saída depende não só das entradas de agora, mas do que ele guardou antes. O flip-flop é a célula mínima dessa memória, e o relógio decide o instante em que o novo valor entra. A saída só muda na borda do relógio; entre duas bordas ela permanece estável, mesmo que a entrada mude.",
    como: [
      "Liste as entradas, a saída e o estado que o circuito precisa lembrar.",
      "Monte a tabela de transição: para cada estado e entrada, qual é o próximo estado.",
      "Aplique os pulsos de relógio e leia a saída só depois que cada pulso terminar.",
      "Repita a tabela com o relógio parado e confirme que a saída não se mexe enquanto a entrada muda.",
    ],
    quebra:
      "Ler a saída durante a troca e tratar o valor instável como resposta. O outro erro é confundir circuito combinacional com memória: sem realimentação, não há passado. E relógio com atrasos diferentes nos caminhos cria corrida. Por isso a leitura confiável vem depois do pulso, nunca no meio dele. Um registrador é uma fila de flip-flops com o mesmo relógio; um contador é a mesma fila com lógica de incremento.",
    limite:
      "O flip-flop guarda um bit, e a memória inteira é a repetição dele. O cuidado é o tempo: o valor só é confiável depois que o pulso de relógio terminou, e ler no meio da troca devolve lixo.",
    pergunta: {
      q: "O que um flip-flop guarda?",
      a: "Um bit de estado",
      why: "Ele mantém a saída estável até o próximo pulso de relógio, e é essa memória de um bit que sustenta registrador, contador e memória.",
    },
    levar: "Sem relógio, estado é só fio solto.",
    maos:
      "Desenhe um flip-flop tipo D, dê dois pulsos de relógio com entradas diferentes e diga a saída em cada um. O exercício mostra por que o pulso precisa terminar antes da leitura.",
  },
  cpu: {
    limite:
      "A CPU de brinquedo cabe no que um humano acompanha, e a de verdade troca clareza por paralelismo. O que sobrevive é o ciclo: buscar, decodificar, executar, voltar. Todo processador grande é isso com atalho e promessa de ordem.",
    pergunta: {
      q: "Quais são as etapas do ciclo de instrução?",
      a: "Buscar, decodificar, executar e voltar",
      why: "O processador busca a instrução na memória, decodifica o que ela manda, executa a operação e volta para buscar a próxima. O ciclo se repete sem parar enquanto houver instrução.",
    },
    levar: "Todo processador grande é um ciclo simples com pressa.",
    maos:
      "Escreva um programa de cinco instruções para a CPU de brinquedo e siga o ciclo na mão, anotando registrador e memória a cada passo.",
  },
  history: {
    limite:
      "A linha do tempo mostra sequência, e a história real tem paralelo e esquecimento. Muita coisa foi inventada antes de poder ser usada, e muita foi usada antes de alguém saber por quê. A linha é mapa, não sentença.",
    pergunta: {
      q: "Por que uma invenção isolada não basta para mudar a história?",
      a: "Porque precisa de condição material e rede para funcionar",
      why: "A ideia sozinha não muda nada: precisa de energia, peça, oficina e gente que saiba usar. A história da técnica é a história da condição que permitiu a ideia virar prática.",
    },
    levar: "Ideia sem condição material fica na gaveta.",
    maos:
      "Escolha uma invenção da linha do tempo e escreva as três condições que precisaram existir para ela funcionar fora do papel.",
  },
  infinity: {
    limite:
      "O paradoxo do hotel mostra que infinidade não é número e que parte pode ter o mesmo tamanho do todo. O limite é a intuição: ela foi treinada em conjunto finito, e no infinito a regra muda de nome.",
    pergunta: {
      q: "Dois conjuntos infinitos podem ter tamanhos diferentes?",
      a: "Sim, quando não existe emparelhamento um a um entre eles",
      why: "O critério é a bijeção: se todo elemento de um pode ser pareado com um do outro, os dois têm o mesmo tamanho. Os naturais e os reais não podem, e por isso o infinito dos reais é maior.",
    },
    levar: "No infinito, parte pode ter o mesmo tamanho do todo.",
    maos:
      "Emparelhe naturais com pares e mostre que sobra nenhum par sem par. Depois tente o mesmo com reais entre zero e um e diga onde o emparelhamento falha.",
  },
  geometry: {
    oque:
      "Geometria é o estudo das formas e das relações que sobrevivem ao movimento. Em poliedros convexos, a relação de Euler V - A + F = 2 vale para qualquer tamanho, e os cinco sólidos platônicos são as únicas formas convexas de faces regulares iguais.",
    como: [
      "Conte vértices, arestas e faces com cuidado, marcando cada aresta uma vez só.",
      "Aplique Euler para conferir a contagem antes de tirar conclusão.",
      "Verifique o ângulo em volta de cada vértice e a soma dos ângulos das faces.",
      "Compare com os cinco platônicos e diga por que outro arranjo não fecha.",
      "Desenhe a planificação de cada platônico e conte as faces que se encontram em cada vértice; a soma dos ângulos precisa ser menor que 360 graus. É essa sobra que dobra a forma.",
    ],
    quebra:
      "Contar aresta duas vezes ou esquecer a face de apoio. Aplicar Euler a poliedro não convexo ou com buraco e esperar 2. E confundir sólido platônico com qualquer poliedro regular: a exigência é face, vértice e ângulo iguais em todos os cantos. A contagem certa é a única prova de que a forma fecha.",
    limite:
      "Os cinco sólidos platônicos fecham porque o ângulo em volta do vértice não pode somar 360 graus. O limite não é escolha estética: é restrição de espaço. O mesmo raciocínio proíbe outros poliedros regulares.",
    pergunta: {
      q: "Quantos sólidos platônicos existem?",
      a: "Cinco",
      why: "Tetraedro, cubo, octaedro, dodecaedro e icosaedro são as únicas figuras com faces regulares iguais e mesmo número de faces em cada vértice. A conta do ângulo em volta do vértice não permite uma sexta.",
    },
    levar: "São cinco porque a soma dos ângulos não fecha em 360 graus.",
    maos:
      "Conte faces, arestas e vértices de dois sólidos platônicos e confira a relação de Euler. Depois tente achar um sexto e diga por que não passa.",
  },
  calculus: {
    limite:
      "A derivada mede taxa instantânea e a integral acumula, e o teorema fundamental diz que uma desfaz a outra. O cuidado é com o domínio: a função precisa ser bem comportada no intervalo, e a conta contínua não descreve o que é discreto.",
    pergunta: {
      q: "O que o teorema fundamental do cálculo liga?",
      a: "A derivada e a integral",
      why: "Ele mostra que acumular e derivar são operações inversas, e é isso que permite calcular integral por antiderivada em vez de somar retângulo por retângulo.",
    },
    levar: "Derivar e integrar são dois lados da mesma conta.",
    maos:
      "Estime a derivada de uma curva em um ponto com dois pontos vizinhos, depois aproxime um do outro e veja o valor convergir. Faça o mesmo com a área sob a curva por retângulos.",
  },
  probability: {
    limite:
      "A máquina de Galton mostra o teorema central do limite, não uma prova de destino. Muitos fatores independentes empurram para o sino, e o mesmo raciocínio não vale quando os fatores são dependentes.",
    pergunta: {
      q: "Por que a distribuição da máquina de Galton vira um sino?",
      a: "Porque muitas decisões independentes se somam",
      why: "Cada pino soma um desvio pequeno e independente. A soma de muitos desvios desse tipo converge para a normal, e é o teorema central do limite em ação.",
    },
    levar: "Muitas causas pequenas e independentes desenham um sino.",
    maos:
      "Jogue vinte vezes na máquina, registre o destino de cada bolinha e compare a forma com a curva esperada. Depois diga o que mudaria se um pino fosse viciado.",
  },
  fractal: {
    limite:
      "O fractal repete a forma em escala diferente, e o comprimento cresce com a régua que se usa. O limite é prático: não existe fractal com detalhe infinito na natureza, e por isso a medida só faz sentido dentro da faixa em que a regra se repete.",
    pergunta: {
      q: "O que muda num fractal quando a escala de observação muda?",
      a: "A forma se repete e o comprimento medido muda",
      why: "A autossemelhança faz a mesma estrutura aparecer em escalas diferentes. Medir com régua menor encontra mais detalhe, e o comprimento cresce sem estabilizar.",
    },
    levar: "A régua decide o comprimento que você encontra.",
    maos:
      "Meça o contorno de uma folha com régua de dez e de um centímetro e compare. A diferença é o que mostra que a medida depende da escala.",
  },
  motion: {
    oque:
      "O pêndulo simples é uma massa presa a um fio, oscilando sob a gravidade. Para ângulos pequenos o movimento é aproximadamente harmônico, e o período depende do comprimento e da gravidade, não da massa. A aproximação vale porque, para deslocamentos pequenos, a força restauradora cresce quase proporcional ao afastamento.",
    como: [
      "Meça o comprimento do fio até o centro do peso.",
      "Solte de um ângulo pequeno e cronometre dez oscilações completas.",
      "Divida o tempo por dez, repita com outra massa e compare os períodos.",
      "Repita com amplitude maior e anote quanto o período medido se afasta da fórmula.",
      "Meça o mesmo pêndulo com dois pesos diferentes e confirme que o período não muda. O comprimento é a variável que realmente importa.",
    ],
    quebra:
      "Usar a fórmula de ângulo pequeno com amplitude grande, o que faz o período previsto ficar curto demais. Cronometrar uma oscilação só também aumenta o erro humano. Medir até a ponta do peso, em vez do centro, desloca o comprimento. Se o pêndulo não for simples, com o peso distribuído, o comprimento efetivo muda. O comprimento efetivo é medido até o centro de massa.",
    limite:
      "O pêndulo de Galileu mostrou que o período não depende da massa, e a aproximação só vale para ângulo pequeno. Em ângulo grande, o período cresce e a fórmula simples erra. O experimento é o que sustenta a lei.",
    pergunta: {
      q: "De que depende o período de um pêndulo simples?",
      a: "Do comprimento e da gravidade, não da massa",
      why: "Na aproximação de ângulo pequeno, o período é proporcional à raiz do comprimento sobre a gravidade. A massa aparece dos dois lados da equação e se cancela.",
    },
    levar: "O pêndulo marca o tempo pelo comprimento, não pelo peso.",
    maos:
      "Cronometre dez oscilações de um pêndulo de tamanho conhecido e calcule a gravidade. Depois mude a massa e veja o período continuar o mesmo.",
  },
  waves: {
    limite:
      "Fourier decompõe sinal em senos e cossenos, e o limite é a condição: a função precisa ser bem comportada e o sinal precisa durar o suficiente. Sinais que começam e terminam abruptamente espalham energia por toda a frequência, e isso é física, não defeito da conta.",
    pergunta: {
      q: "O que a transformada de Fourier faz com um sinal?",
      a: "Decompõe o sinal nas frequências que o formam",
      why: "Ela diz quanto de cada frequência existe no sinal. Somar esses componentes de volta reconstrói o original, e é por isso que a transformada é usada em áudio, imagem e rede.",
    },
    levar: "Todo sinal é a soma de senos, e Fourier diz quanto de cada um.",
    maos:
      "Monte um sinal de duas notas no sequenciador e olhe o espectro. Depois desligue uma e veja a linha desaparecer sem mudar a outra.",
  },
  thermo: {
    oque:
      "Termodinâmica é o estudo da energia que passa de um corpo a outro como calor e trabalho. Temperatura mede a agitação média das partículas, pressão mede a chuva de impactos nas paredes, e entropia conta os arranjos possíveis de um estado.",
    como: [
      "Escolha o sistema e o que fica de fora como vizinhança; sem essa fronteira, a conta de energia não fecha.",
      "Meça ou estime temperatura, pressão e volume antes e depois do processo.",
      "Aplique a primeira lei para a energia e a segunda para a entropia, lembrando que no sistema isolado ela não diminui.",
      "Confira unidades e o sinal do trabalho: gás que expande realiza trabalho e perde energia.",
      "Desenhe o ciclo num diagrama de pressão e volume e marque onde entra calor e onde sai trabalho; o desenho denuncia sinal trocado.",
    ],
    quebra:
      "Confundir calor com temperatura: um corpo grande a 30 °C guarda mais energia térmica que um pequeno a 60 °C. Também erra quem espera que a entropia caia num sistema isolado; ela pode cair localmente se o entorno pagar a conta. E o zero absoluto não é atingível.",
    limite:
      "A caixa de gás mostra temperatura como energia cinética média, e a lei dos gases só descreve bem o regime diluído. Gás denso e interação forte pedem correção. O modelo é ponto de partida, não retrato completo.",
    pergunta: {
      q: "O que a temperatura mede num gás?",
      a: "A energia cinética média das partículas",
      why: "Temperatura é a medida do movimento médio das moléculas. Aquecer o gás é aumentar essa média, e a pressão nas paredes cresce junto.",
    },
    levar: "Temperatura é movimento médio; pressão é o choque nas paredes.",
    maos:
      "Aqueça o gás com o volume travado e anote pressão e temperatura. Faça o gráfico e confira se a razão entre as duas se mantém.",
  },
  optics: {
    limite:
      "O prisma separa cores porque o índice de refração muda com a frequência, e cada cor desvia por ângulo diferente. O limite é o material: em vidro diferente a ordem de desvio pode variar, e arco-íris é o mesmo fenômeno com gota em vez de prisma.",
    pergunta: {
      q: "Por que o prisma separa a luz branca em cores?",
      a: "Porque o índice de refração depende da frequência",
      why: "Cada cor desvia por um ângulo ligeiramente diferente ao atravessar o vidro. A luz branca é a soma de todas, e o prisma as separa no espaço.",
    },
    levar: "A cor é frequência, e o vidro desvia cada uma por um ângulo.",
    maos:
      "Aponte luz branca num prisma ou num copo com água e marque a ordem das cores na parede. Depois gire o prisma e explique o que mudou.",
  },
  gravity: {
    limite:
      "O poço gravitacional é analogia de espaço-tempo curvo, e a analogia tem teto: a gravidade não puxa ninguém por uma corda. O que a relatividade diz é que massa e energia curvam a métrica, e o corpo segue a curva mais reta possível.",
    pergunta: {
      q: "O que a relatividade geral diz que a massa faz com o espaço-tempo?",
      a: "Curva o espaço-tempo em volta dela",
      why: "Massa e energia deformam a métrica, e o movimento livre segue essa geometria. A queda livre é o corpo indo pela trajetória mais reta que existe na região.",
    },
    levar: "Gravidade não é puxão, é curva onde o corpo segue reto.",
    maos:
      "Coloque uma bola pesada numa cama elástica e role uma bolinha perto dela. Observe a curva e diga qual pedaço da analogia deixa de valer no espaço de verdade.",
  },
  periodic: {
    limite:
      "A tabela organiza propriedade por número atômico, e a previsão funciona melhor na coluna que na linha. O limite é o bloco de transição, onde as propriedades variam de forma menos linear e a analogia de família aperta.",
    pergunta: {
      q: "O que a posição na tabela periódica diz sobre um átomo?",
      a: "A quantidade de elétrons na camada de valência e o tamanho relativo",
      why: "Coluna diz quantos elétrons de valência o átomo tem, e linha diz quantas camadas. Essas duas informações preveem reatividade e tendência de ganhar ou perder elétron.",
    },
    levar: "A coluna diz como o átomo se comporta; a linha diz o tamanho.",
    maos:
      "Escolha três elementos da mesma coluna e compare raio atômico e reatividade. Depois faça o mesmo com três da mesma linha e explique a diferença.",
  },
  bonds: {
    limite:
      "A forma da molécula decide o encaixe, e a ligação desenhada no papel é média de elétron, não haste. O limite é que a geometria muda com o ambiente: solvente e temperatura podem torcer o que o desenho mostra rígido.",
    pergunta: {
      q: "Por que a forma tridimensional da molécula importa?",
      a: "Porque o encaixe com outra molécula depende da geometria",
      why: "Receptor, enzima e catalisador reconhecem forma antes de reconhecer fórmula. Duas moléculas com os mesmos átomos podem ter formas diferentes e efeitos completamente diferentes.",
    },
    levar: "Fórmula igual não garante efeito igual: a forma decide o encaixe.",
    maos:
      "Monte duas moléculas com os mesmos átomos em arranjos diferentes e diga qual delas encaixa no mesmo receptor, justificando pela geometria.",
  },
  titration: {
    limite:
      "A titulação mede concentração por volume gasto até a equivalência, e o ponto final é visto pelo indicador, que erra um pouco. O limite é a curva de pH: perto do salto, uma gota muda tudo, e a leitura precisa de paciência.",
    pergunta: {
      q: "O que o ponto de equivalência marca numa titulação?",
      a: "O instante em que o titulante neutralizou o analito na proporção da reação",
      why: "Na equivalência, a quantidade de titulante adicionada corresponde exatamente à quantidade que reage com o analito. O indicador só aproxima esse ponto, e a diferença entre os dois é o erro da medida.",
    },
    levar: "A equivalência é conta; o indicador é aviso aproximado.",
    maos:
      "Calcule o volume de equivalência de uma titulação simples e compare com o volume em que o indicador virou. A diferença é o erro que você precisa declarar.",
  },
  energy: {
    limite:
      "A energia de ativação é a barreira que a reação precisa vencer, e o catalisador abaixa a barreira sem mudar o resultado. O limite é a especificidade: catalisador bom para uma reação pode não servir para outra parecida.",
    pergunta: {
      q: "O que um catalisador muda numa reação?",
      a: "A energia de ativação, não o balanço final",
      why: "Ele oferece caminho com barreira menor, e por isso a reação chega mais rápido ao equilíbrio. A energia dos reagentes e dos produtos continua a mesma.",
    },
    levar: "Catalisador encurta o caminho, não muda o destino.",
    maos:
      "Compare a curva de energia de uma reação com e sem catalisador e marque a barreira e o delta final. Depois diga qual dos dois números não mudou.",
  },
  balance: {
    oque:
      "Balancear uma equação química é acertar o inventário de átomos: cada elemento precisa ter a mesma quantidade nos reagentes e nos produtos. Os coeficientes multiplicam moléculas inteiras, nunca trocam a fórmula de uma substância.",
    como: [
      "Escreva as fórmulas corretas dos reagentes e dos produtos, sem inventar subscrito.",
      "Conte os átomos de cada elemento dos dois lados e monte a tabela do inventário.",
      "Ajuste os coeficientes começando pelo elemento que aparece em menos lugares e confira a cada mudança.",
      "Reduza à menor proporção inteira e separe o que é balanço do que é rendimento real.",
      "Monte uma tabela com uma coluna por elemento e uma linha por composto, preencha com coeficiente vezes subscrito e ajuste até as colunas ficarem iguais. A tabela evita contar átomo de memória e mostra onde o coeficiente ainda falta.",
    ],
    quebra:
      "Inventar coeficiente para fechar a conta ou mudar o subscrito da fórmula: subscrito é identidade da substância, coeficiente é quantidade. Também erra quem acha que balancear garante rendimento, e quem confunde mol com massa na hora de converter. A proporção mínima é a resposta, não qualquer múltiplo.",
    limite:
      "Balancear conserva átomo e não conserva massa de molécula solta. O limite é a reação real: a equação diz proporção, e o rendimento diz quanto de fato se formou. Equação balanceada não garante reação completa.",
    pergunta: {
      q: "O que uma equação química balanceada conserva?",
      a: "A quantidade de átomos de cada elemento",
      why: "Balancear é igualar a contagem dos dois lados. A proporção em mols sai daí, e é ela que permite calcular quanto reagente consome quanto produto.",
    },
    levar: "Balancear é contar átomo dos dois lados; rendimento é outra conta.",
    maos:
      "Balanceie uma combustão e calcule quantos mols de gás carbônico saem de um mol de combustível. Depois diga por que o valor real pode ser menor.",
  },
  rhythm: {
    oque:
      "Ritmo é a divisão do tempo em pulsos e subdivisões. Polirritmia acontece quando duas divisões diferentes do mesmo pulso soam juntas, como três contra quatro, e o ciclo só se fecha no mínimo múltiplo comum. O ciclo não precisa ser longo para ser sentido: três contra dois já cria tensão e resolução.",
    como: [
      "Escolha um pulso comum e conte até doze.",
      "Sobreponha um ciclo de três e um de quatro, marcando o início juntos.",
      "Pare no pulso em que os dois ciclos coincidem e recomece a contagem.",
      "Troque as vozes e repita: o ciclo é o mesmo, mas a sensação de quem conduz muda.",
      "Conte o ciclo em voz alta enquanto bate as palmas e não pare na primeira coincidência.",
    ],
    quebra:
      "Achar que o ciclo fecha na primeira coincidência de palmas, quando ele só fecha no mínimo múltiplo comum. Acelerar uma voz para caber na outra também não é polirritmia. Em tempo muito rápido, o ouvido ouve textura e não divisão. A contagem em voz alta ajuda, mas o corpo precisa manter o pulso. O mesmo princípio aparece no compasso composto.",
    limite:
      "Polirritmia é sobreposição de divisões, e o limite é a percepção: o ouvido agrupa o que consegue contar. Acima de certa velocidade, a mistura deixa de ser ritmo e vira textura, e a notação continua correta sem descrever o que se ouve.",
    pergunta: {
      q: "O que uma polirritmia sobrepõe?",
      a: "Duas divisões diferentes do mesmo pulso",
      why: "O mesmo intervalo de tempo é dividido em três numa voz e em quatro na outra. As duas divisões coincidem no começo e no fim do ciclo, e o intervalo entre coincidências é o que dá o balanço.",
    },
    levar: "Ritmo é expectativa; polirritmia é duas expectativas ao mesmo tempo.",
    maos:
      "Bata três palmas num ciclo e quatro no mesmo ciclo, contando até doze. Depois marque onde as duas vozes se encontram e ouça o ciclo fechar.",
  },
  harmony: {
    oque:
      "Consonância é a sensação de estabilidade quando duas frequências soam juntas. Ela nasce da coincidência de harmônicos: razões simples, como 2 para 1 na oitava e 3 para 2 na quinta, alinham os ciclos com mais frequência. A oitava é o caso mais forte porque todos os harmônicos coincidem.",
    como: [
      "Toque as duas notas separadas e depois juntas.",
      "Anote a razão entre as frequências e o desvio em cents.",
      "Aproxime ou afaste até o batimento sumir e guarde o ponto de conforto.",
      "Repita na região grave e na aguda e compare onde o batimento incomoda mais.",
      "Compare o mesmo intervalo tocado por dois instrumentos e veja se a razão explica toda a diferença. O que sobra é timbre e cultura.",
    ],
    quebra:
      "Tomar razão simples como garantia de beleza: o timbre e a região mudam a conta. O temperamento igual estica a quinta de propósito, então a razão pura existe no papel e não exatamente no instrumento. E o que uma época chama de áspero, outra chama de expressivo. Duas notas distantes podem ter razão simples e ainda soar ásperas pelo timbre. O contexto da escala muda o repouso.",
    limite:
      "Intervalo consonante é razão simples de frequência, e o ouvido tolera desafinação dentro de uma faixa. O limite está na cultura: o que soa áspero numa época soa doce em outra, e a razão matemática não decide gosto sozinha.",
    pergunta: {
      q: "O que define a consonância de um intervalo?",
      a: "A razão entre as frequências das duas notas",
      why: "Oitava é razão de dois para um, quinta de três para dois. Quanto mais simples a razão, mais os harmônicos coincidem e mais estável o intervalo soa.",
    },
    levar: "Consonância é razão simples; gosto é época.",
    maos:
      "Toque uma oitava, uma quinta e uma segunda e anote a razão de cada uma. Depois diga qual soa mais estável e relacione com a coincidência de harmônicos.",
  },
  scales: {
    oque:
      "Uma escala é um recorte da oitava em passos. O temperamento igual divide a oitava em doze semitons iguais, espalhando o erro de afinação para que todas as tonalidades funcionem no mesmo instrumento. Cada semitom é a mesma razão, e por isso o erro se distribui em vez de se concentrar.",
    como: [
      "Construa o semitom como a raiz décima segunda de dois.",
      "Multiplique doze vezes e volte à oitava; compare a quinta com a razão 3 para 2.",
      "Ouça a escala temperada e a de razões simples e meça a diferença em cents.",
      "Some doze semitons e verifique que o produto volta exatamente a dois.",
      "Afine um acorde em quintas puras e depois em temperamento igual, e ouça o que muda. A diferença é pequena, mas acumula ao longo do ciclo.",
    ],
    quebra:
      "Chamar o temperamento igual de correto e os anteriores de errados: cada sistema resolve um problema. Instrumento de teclado fixo não volta atrás, mas cordas ajustam durante a execução. A escolha também foi histórica e prática, não só matemática. A comma pitagórica é o resto que aparece quando as quintas puras não fecham a oitava.",
    limite:
      "O temperamento igual divide a oitava em doze partes iguais e desafina cada intervalo de propósito, para poder modular. O limite é histórico: antes dele, instrumentos eram afinados em uma tonalidade e soavam mal em outras, e a escolha nunca foi só matemática.",
    pergunta: {
      q: "Por que o temperamento igual desafina ligeiramente os intervalos?",
      a: "Para permitir modular em qualquer tonalidade",
      why: "Dividir a oitava em doze semitons iguais espalha o erro por todas as notas. Cada quinta fica um pouco estreita, e em troca todas as tonalidades funcionam no mesmo instrumento.",
    },
    levar: "Temperar é espalhar o erro para todas as tonalidades caberem.",
    maos:
      "Calcule a razão de um semitom no temperamento igual e compare com a quinta pura. A diferença, em centésimos, é o preço da modulação.",
  },
  timbre: {
    limite:
      "Timbre é a mistura de harmônicos, e a mesma nota em instrumentos diferentes tem a fundamental igual. O limite é o ataque: o começo do som carrega tanta informação de identidade que dois instrumentos podem soar parecidos se o ataque for imitado.",
    pergunta: {
      q: "O que dá identidade ao timbre de um instrumento?",
      a: "A combinação de harmônicos e o envelope do som",
      why: "A fundamental dá a altura, e os harmônicos com intensidade própria dão a cor. O ataque e o decaimento completam a identidade, e é por isso que a mesma nota soa diferente em cada instrumento.",
    },
    levar: "A nota é a altura; o timbre é a mistura que vem junto.",
    maos:
      "Toque a mesma nota em dois instrumentos e compare o espectro. Depois imite o ataque de um com o outro e veja se a diferença diminui.",
  },
  generative: {
    oque:
      "Música generativa é música feita por uma regra que produz muitas peças possíveis. A regra pode ser uma tabela de transição, uma gramática ou uma simetria, e cada execução escolhe um caminho dentro do espaço que ela permite. A peça não existe antes da execução: o que existe é o conjunto de peças que a regra autoriza.",
    como: [
      "Escolha a unidade que a regra combina: nota, acorde ou célula rítmica.",
      "Defina as transições permitidas e o peso de cada uma.",
      "Fixe a semente, gere, mude um peso e compare as duas execuções.",
      "Anote duas decisões que você tomou e que a máquina não tomou: a regra e o corte.",
      "Escute a peça inteira antes de mudar a regra, para separar o efeito da semente do efeito da tabela.",
    ],
    quebra:
      "Chamar o resultado de aleatório e esquecer a regra que o gerou. A semente muda a execução, não o espaço. O erro oposto é achar que a regra garante qualidade: ela garante coerência, e o corte ainda é decisão de alguém. Sem esse corte, o gerador pode continuar para sempre. A autoria está no desenho do espaço, não em cada nota. A regra sem escuta vira catálogo de possibilidades; a seleção é parte da composição.",
    limite:
      "Música generativa usa regra e aleatoriedade, e o limite é autoria: a regra foi escolhida por alguém, e o resultado é o espaço que ela permite. Chamar de aleatório esconde a decisão que está no código.",
    pergunta: {
      q: "O que uma regra generativa define na música?",
      a: "O espaço de possibilidades, não a peça única",
      why: "A regra diz que notas cabem, em que ordem e com que peso. Cada execução escolhe dentro desse espaço, e o compositor decide o espaço, não cada nota.",
    },
    levar: "Aleatoriedade dentro de regra ainda é autoria da regra.",
    maos:
      "Escreva três regras simples de geração, rode duas vezes e compare. Depois mude uma regra e diga o que mudou no resultado.",
  },
  learning: {
    oque:
      "Aprendizado de máquina ajusta parâmetros para reduzir o erro em exemplos. Na regressão linear, a hipótese é uma reta e a perda é a soma dos erros ao quadrado; aprender é escolher a reta que minimiza essa soma. A perda quadrática pune erro grande mais que erro pequeno, e é isso que dá a reta de melhor ajuste.",
    como: [
      "Marque os pontos no plano e desenhe uma reta candidata.",
      "Calcule o erro de cada ponto, eleve ao quadrado e some.",
      "Mude inclinação e intercepto na direção que reduz a perda; separe um ponto para testar.",
      "Guarde um ponto fora do treino e use-o para medir generalização, não memorização.",
      "Compare a reta de treino com a reta que inclui o ponto guardado. Se a segunda errar muito, o ajuste decorou em vez de aprender.",
    ],
    quebra:
      "Decorar os pontos de treino e chamar isso de aprender: o erro cai na amostra e sobe no dado novo. Extrapolar fora da faixa observada também engana. E correlação alta não prova causa. A taxa de aprendizado também é escolha: passo grande diverge, passo pequeno demora. Separar treino e teste é o que revela a diferença.",
    limite:
      "A regressão linear ajusta reta a dado e só vale dentro da faixa observada. O limite é a extrapolação: fora da faixa, a reta continua e a realidade não. Correlação alta também não prova causa.",
    pergunta: {
      q: "O que a regressão linear minimiza?",
      a: "A soma dos quadrados dos erros",
      why: "O ajuste escolhe a reta que deixa os pontos mais próximos no sentido quadrático. Elevar ao quadrado pune erro grande mais que erro pequeno, e é isso que dá a reta de melhor ajuste.",
    },
    levar: "Reta ajustada descreve a faixa; fora dela, ela inventa.",
    maos:
      "Pegue cinco pontos, ajuste a reta na mão pelo método dos mínimos quadrados e preveja um ponto fora da faixa. Diga por que a previsão não é confiável.",
  },
  neural: {
    oque:
      "Uma rede neural é uma pilha de camadas de somas ponderadas e funções de ativação. Os pesos são ajustados por gradiente para reduzir o erro entre a saída e a resposta certa, e a retropropagação calcula a contribuição de cada peso.",
    como: [
      "Normalize as entradas e defina com clareza qual é a saída esperada.",
      "Escolha a perda e treine em lotes, ajustando os pesos na direção que reduz o erro.",
      "Separe uma parte dos dados para teste e compare o erro de treino com o de teste.",
      "Se o teste piorar enquanto o treino melhora, pare: é sinal de overfitting.",
      "Anote a perda a cada época; curva que para de cair no teste é aviso, não sucesso. Compare com uma linha de base simples antes de comemorar.",
    ],
    quebra:
      "Decorar o treino e chamar de aprender: o erro de treino cai e o de teste sobe. Também erra quem acha que a rede explica a decisão; ela ajusta pesos, não escreve justificativa. Dado sem cobertura vira palpite confiante, e a fronteira aprende o que os exemplos mostraram.",
    limite:
      "Rede neural empilha camadas e ajusta peso por gradiente, e o limite é o dado: sem exemplo que cubra o caso, a rede não aprende. Ela também não explica a decisão, e confiança alta não é garantia de acerto.",
    pergunta: {
      q: "O que o treinamento de uma rede neural ajusta?",
      a: "Os pesos das conexões",
      why: "O erro volta camada por camada e cada peso muda um pouco na direção que reduz a perda. Repetir isso muitas vezes é o que faz a rede aprender o padrão dos exemplos.",
    },
    levar: "Rede aprende o que o dado mostra, inclusive o que não devia.",
    maos:
      "Desenhe uma rede de duas entradas, uma camada escondida e uma saída, e calcule na mão a saída para dois exemplos. Depois diga qual peso precisaria mudar para acertar o segundo.",
  },
  language: {
    oque:
      "Um modelo de linguagem corta o texto em tokens e representa cada um como vetor. Aprender é ajustar pesos para prever o próximo token a partir do contexto; a saída é uma distribuição de probabilidades, não uma consulta a fatos.",
    como: [
      "Tokenize a frase e observe como palavras raras se partem em pedaços.",
      "Consulte a distribuição do próximo token e compare as probabilidades.",
      "Escolha por amostragem ou pelo mais provável e repita com o contexto novo.",
      "Teste a mesma pergunta com contexto diferente e veja a resposta mudar.",
      "Peça ao modelo para continuar uma frase ambígua e repita com uma palavra de contexto; a mudança de distribuição mostra o que ele está usando. A comparação vale mais que uma resposta isolada.",
    ],
    quebra:
      "Confundir fluência com verdade: o modelo pode inventar com segurança porque otimiza plausibilidade. Também erra quem acha que ele guarda o texto original ou consulta um banco de fatos. Contexto curto limita o que ele consegue relacionar, e a resposta muda com a pergunta. Probabilidade alta não é prova. O contexto decide o próximo passo.",
    limite:
      "O modelo de linguagem prevê o próximo token e não consulta o mundo. O limite é a verdade: fluência não é garantia de fato, e a mesma confiança aparece em frase certa e errada. A conferência continua sendo de quem lê.",
    pergunta: {
      q: "O que um modelo de linguagem faz para gerar texto?",
      a: "Prevê o próximo token a partir do contexto",
      why: "Ele calcula probabilidade para cada token possível e escolhe um. Repetir isso token por token produz a frase, e é por isso que coerência local não garante verdade global.",
    },
    levar: "Fluência é probabilidade de sequência, não prova de verdade.",
    maos:
      "Peça ao modelo uma frase e depois peça a fonte de cada afirmação. Marque o que veio com fonte e o que veio só com confiança.",
  },
  vision: {
    oque:
      "Visão computacional trata a imagem como grade de números e aplica filtros locais para extrair bordas, cantos e texturas. A convolução desliza um kernel pela grade e transforma pixels em features; camadas seguintes combinam features em objetos.",
    como: [
      "Represente a imagem em canais de cor e normalize os valores.",
      "Escolha um kernel e passe pela grade para ver o mapa de ativação.",
      "Empilhe camadas e reduza a resolução para ganhar contexto.",
      "Treine o classificador com imagens variadas e teste com uma que nunca apareceu.",
      "Guarde o mapa de ativação de um filtro e compare com a imagem original; o que ele realça mostra o que a rede está usando. Se realçar o fundo, o objeto ainda não foi aprendido.",
    ],
    quebra:
      "Achar que o filtro vê o objeto: ele vê contraste local e não sabe o que é a cena. Mudar a luz, o ângulo ou o fundo pode enganar sem mudar o objeto. E uma rede que acerta o treino pode falhar no mundo real se os exemplos não cobrirem a variação. Contraste local não é entendimento da cena.",
    limite:
      "Convolução aplica filtro local e detecta borda por contraste, e o limite é o contexto: o filtro vê a vizinhança imediata e não sabe o que o objeto é. Por isso a rede precisa de muitas camadas para juntar pedaço em objeto.",
    pergunta: {
      q: "O que uma convolução faz numa imagem?",
      a: "Aplica um filtro pequeno em cada região e realça padrão local",
      why: "O filtro percorre a imagem e calcula uma resposta por posição. Borda, textura e canto aparecem porque o filtro compara pixel vizinho, e a soma dessas respostas forma o mapa de característica.",
    },
    levar: "Convolução vê vizinhança; objeto é conclusão de camada mais funda.",
    maos:
      "Aplique um filtro de borda numa foto e veja o que sobra. Depois diga o que o filtro perdeu que ainda seria necessário para reconhecer o objeto.",
  },
  ethics: {
    oque:
      "Ética de IA é o estudo de quem responde pelas escolhas de um sistema: o dado que ele aprende, o objetivo que otimiza, a métrica que o avalia e o uso que se faz da saída. O modelo não tem intenção nem dever. A pergunta ética começa antes do modelo e continua depois da resposta.",
    como: [
      "Separe o caso em dado, objetivo, métrica e uso.",
      "Pergunte quem escolheu cada peça, quem é afetado e quem responde pelo erro.",
      "Se uma dessas respostas ficar vazia, trate o vazio como parte do problema.",
      "Escreva o caso em uma frase e sublinhe quem sai perdendo se a saída errar.",
      "Leve o caso a alguém que discorde e registre onde a discordância começa; o desacordo também é dado.",
    ],
    quebra:
      "Dizer que o modelo é neutro porque não tem intenção. A neutralidade está no desenho, não no código. Culpar só a máquina também deixa intactas as pessoas que escolhem o dado e aprovam o uso. Trabalho humano invisível faz parte da conta. Uma métrica que só mede acerto não vê o custo de um falso positivo. Auditoria e recurso de revisão fazem parte do sistema.",
    limite:
      "Ética de IA não se resolve com fórmula, e o limite é a decisão: quem escolhe o dado, quem avalia o viés e quem responde pelo erro são pessoas e instituições. Modelo não tem responsabilidade; quem opera tem.",
    pergunta: {
      q: "Quem responde pelo erro de um sistema de IA?",
      a: "Quem projeta, opera e decide com ele",
      why: "O modelo não tem intenção nem dever. A responsabilidade fica com as pessoas e organizações que escolhem o dado, aprovam o uso e agem com base na saída.",
    },
    levar: "Modelo não responde por nada; gente responde.",
    maos:
      "Escolha um uso de IA e liste quem decide, quem é afetado e quem responde se der errado. Se algum ficar vazio, o sistema não está pronto.",
  },
  words: {
    limite:
      "Etimologia explica história da palavra, não o significado de hoje. O limite é a falácia etimológica: o sentido atual não é obrigado a respeitar a origem, e usar a raiz para corrigir o uso é erro de método.",
    pergunta: {
      q: "O que a etimologia de uma palavra explica?",
      a: "A história da forma e do sentido, não a regra do uso atual",
      why: "A palavra muda de sentido com o tempo e com a comunidade. A origem é informação histórica, e o significado de hoje se descreve pelo uso, não pela raiz.",
    },
    levar: "A origem conta de onde veio, não manda no que significa agora.",
    maos:
      "Escolha uma palavra, ache a origem e compare com o sentido atual. Depois escreva uma frase em que a origem levaria a conclusão errada.",
  },
  concord: {
    limite:
      "Concordância liga verbo a sujeito, e o limite são os casos em que o sujeito vem longe ou é composto. A regra é estável, mas a atenção cai: o erro típico é concordar com o substantivo mais próximo.",
    pergunta: {
      q: "Com quem o verbo concorda na frase?",
      a: "Com o sujeito, mesmo que ele esteja longe",
      why: "A concordância é entre sujeito e verbo, e não com o termo mais próximo. Em sujeito composto ou distante, a regra continua sendo o núcleo do sujeito.",
    },
    levar: "O verbo obedece ao sujeito, não ao vizinho mais perto.",
    maos:
      "Pegue três frases com sujeito distante, marque o núcleo e confira a concordância. Depois reescreva uma delas para o erro ficar visível.",
  },
  accents: {
    limite:
      "Acento e hífen seguem regra de prosódia e de composição, e o limite é o acordo: a regra muda com o tempo, e texto antigo pode estar correto pela norma da época. A consulta ao manual atual resolve.",
    pergunta: {
      q: "O que decide a acentuação de uma palavra em português?",
      a: "A posição da sílaba tônica e o tipo de terminação",
      why: "A regra olha onde está a tônica e como a palavra termina. Oxítona, paroxítona e proparoxítona têm regras próprias, e é por isso que a mesma terminação pode ou não levar acento.",
    },
    levar: "Acento é regra de tônica e terminação, não memória solta.",
    maos:
      "Separe dez palavras em oxítona, paroxítona e proparoxítona e aplique a regra de cada grupo. Depois confira no manual só as que ficaram em dúvida.",
  },
  genres: {
    limite:
      "Gênero textual é forma social de texto, e o limite é a mistura: notícia com opinião, receita com narrativa. Os gêneros se combinam, e o que orienta a escrita é a situação, não a lista fechada.",
    pergunta: {
      q: "O que define um gênero textual?",
      a: "A situação de uso e a forma que ela pede",
      why: "Gênero é resposta a uma prática social: informar, instruir, narrar, argumentar. A forma segue a função, e é por isso que a mesma informação muda de gênero conforme o leitor e o objetivo.",
    },
    levar: "Gênero é forma que responde a uma situação de uso.",
    maos:
      "Reescreva a mesma notícia como receita e como carta. Marque o que mudou e diga o que a situação de uso exigiu em cada versão.",
  },
  crase: {
    limite:
      "Crase é fusão de duas vogais iguais, e o teste é substituir por palavra masculina. O limite são as locuções e os nomes próprios: há caso em que a regra geral não decide, e a consulta ao manual é o caminho.",
    pergunta: {
      q: "Quando a crase acontece?",
      a: "Quando o a preposição encontra o a artigo",
      why: "A crase é a fusão de dois a, e por isso só ocorre antes de palavra feminina que aceita artigo. Substituir por termo masculino revela se o artigo estava ali.",
    },
    levar: "Crase é encontro de dois a; sem artigo, não há fusão.",
    maos:
      "Pegue cinco frases com a antes de palavra feminina, aplique o teste do masculino e corrija o que faltar. Depois explique cada correção pela regra.",
  },
  induction: {
    oque:
      "Indução eletromagnética é o aparecimento de corrente quando o fluxo magnético através de um circuito varia no tempo. Ímã parado não gera corrente; o que importa é a mudança do fluxo, não o seu valor.",
    como: [
      "Aproxime e afaste o ímã da bobina e observe o galvanômetro em cada movimento.",
      "Inverta o sentido do movimento e veja a corrente inverter junto.",
      "Aumente a velocidade e compare a intensidade: mais variação por segundo, mais corrente.",
      "Troque a bobina por outra com mais espiras e repita para ver o efeito do enrolamento.",
      "Registre o sentido da corrente para o ímã que entra e para o ímã que sai; a oposição da bobina explica por que os dois sentidos diferem.",
    ],
    quebra:
      "Achar que basta um campo forte e parado; sem variação não há indução. Trocar a lei de Faraday pela de Lenz na hora de explicar o sinal também confunde: uma dá o tamanho, a outra o sentido. E medir a corrente média quando a pergunta pede a instantânea. A variação é a causa, não o campo. O sinal também importa.",
    limite:
      "A indução de Faraday mostra que campo magnético variável gera corrente, e o limite é a variação: campo parado não induz. O sinal depende da taxa de mudança, e por isso a lei é sobre variação, não sobre intensidade.",
    pergunta: {
      q: "O que é necessário para induzir corrente num circuito?",
      a: "Variação do fluxo magnético através dele",
      why: "A lei de Faraday liga a força eletromotriz à taxa de variação do fluxo. Ímã parado perto da bobina não gera corrente; mover o ímã ou variar a corrente gera.",
    },
    levar: "Campo parado não induz nada; o que induz é a variação.",
    maos:
      "Aproxime e afaste um ímã de uma bobina com galvanômetro e anote o sentido da corrente nos dois movimentos. Depois explique a diferença pela variação do fluxo.",
  },
  maxwell: {
    limite:
      "As equações de Maxwell descrevem o campo clássico e preveem a velocidade da luz a partir de constantes elétricas. O limite é o regime quântico: em escala atômica o campo clássico não basta, e a descrição vira probabilidade.",
    pergunta: {
      q: "O que as equações de Maxwell mostram sobre a luz?",
      a: "Que ela é onda de campo elétrico e magnético que se propaga",
      why: "Campo elétrico variável gera magnético e vice-versa, e a combinação se propaga na velocidade que sai das constantes do vácuo. A luz é essa onda, sem precisar de meio material.",
    },
    levar: "Luz é campo que se sustenta e viaja sem meio.",
    maos:
      "Desenhe uma onda com campo elétrico e magnético perpendiculares e mostre por que a variação de um gera o outro. Depois diga o que muda se a frequência dobrar.",
  },
  pipeline: {
    oque:
      "Pipeline é a técnica de sobrepor etapas de instruções diferentes no processador: enquanto uma busca, outra decodifica, outra executa e outra grava. A vazão aumenta, mas a latência de uma instrução continua parecida.",
    como: [
      "Divida o ciclo da instrução em etapas e mantenha uma instrução em cada uma.",
      "Encha a linha e meça quantas instruções terminam por ciclo, não o tempo de uma só.",
      "Trate o desvio com previsão e descarte as instruções do caminho errado.",
      "Separe dependência de dados de dependência de controle ao procurar o gargalo.",
      "Some os ciclos de um trecho curto com e sem pipeline e compare; a conta mostra se a linha está cheia ou se o desvio está custando mais que o ganho. Não olhe só o relógio do processador.",
    ],
    quebra:
      "Confundir vazão com latência: o pipeline não deixa uma instrução mais rápida, ele deixa mais instruções terminarem por ciclo. Desvio mal previsto esvazia a linha e custa ciclos. E dependência de dados entre instruções exige espera ou encaminhamento, senão o resultado sai errado. Linha cheia é o que dá vazão.",
    limite:
      "O ciclo de instrução busca, decodifica, executa e volta, e o limite é o atraso: memória lenta faz o processador esperar, e é por isso que existe cache. O ciclo simples descreve a ordem, não o desempenho real.",
    pergunta: {
      q: "O que o pipeline ganha ao sobrepor etapas?",
      a: "Vazão, não tempo de uma instrução sozinha",
      why: "Cada etapa trabalha em uma instrução diferente ao mesmo tempo. A primeira instrução continua levando o mesmo tempo, mas o processador termina uma por ciclo em regime.",
    },
    levar: "Pipeline encurta a fila, não a instrução.",
    maos:
      "Desenhe um pipeline de cinco etapas e acompanhe três instruções. Marque em que ciclo cada uma termina e compare com a execução sem sobreposição.",
  },
  registers: {
    limite:
      "Registrador é a memória mais rápida e menor, e o limite é a quantidade: poucos registradores obrigam o compilador a derramar valor para a memória. O desempenho depende de quem escolhe o que fica ali.",
    pergunta: {
      q: "Por que existem poucos registradores no processador?",
      a: "Porque são caros em área e em tempo de acesso",
      why: "Registrador fica dentro do núcleo e precisa ser rápido, o que limita quantidade e tamanho. A hierarquia de memória existe para conciliar velocidade com capacidade.",
    },
    levar: "Registrador é rápido e escasso; a hierarquia resolve o resto.",
    maos:
      "Reescreva um cálculo de cinco variáveis usando só três registradores e diga o que precisou ir para a memória. A contagem mostra o custo do derramamento.",
  },
  limits: {
    limite:
      "O limite descreve o comportamento perto do ponto, e o limite é a existência: a função pode não estar definida ali e o limite existir. Confundir valor no ponto com limite é o erro que a definição precisou resolver.",
    pergunta: {
      q: "O que o limite de uma função num ponto descreve?",
      a: "Para onde a função tende quando a entrada se aproxima do ponto",
      why: "O limite olha a vizinhança, não o valor no ponto. A função pode nem existir ali, como no quociente que dá zero sobre zero, e o limite ainda pode existir.",
    },
    levar: "Limite é para onde vai, não o que acontece no ponto.",
    maos:
      "Monte uma tabela com valores cada vez mais perto de 2 para (x²-4)/(x-2) e veja o resultado convergir. Depois diga o valor no ponto e por que os dois não são a mesma coisa.",
  },
  series: {
    limite:
      "Série converge quando a soma dos termos se estabiliza, e o limite é o teste: termo indo a zero é condição necessária, não suficiente. A série harmônica tem termo indo a zero e soma divergindo, e é o contraexemplo que todo mundo precisa.",
    pergunta: {
      q: "O que significa uma série convergir?",
      a: "Que a soma dos termos tende a um valor finito",
      why: "Somar mais termos muda cada vez menos o total. Se o total ultrapassa qualquer limite, a série diverge, mesmo que os termos fiquem pequenos.",
    },
    levar: "Termo pequeno não garante soma finita.",
    maos:
      "Some os primeiros termos de uma série geométrica e de uma harmônica e compare. Depois diga qual estabiliza e por que a outra não.",
  },
  carbon: {
    limite:
      "Carbono faz quatro ligações e monta cadeia, e o limite é a reatividade: nem toda combinação é estável. A regra do octeto prevê o que costuma acontecer, e a química real tem exceção que a contagem sozinha não vê.",
    pergunta: {
      q: "Por que o carbono consegue formar tantos compostos?",
      a: "Porque faz quatro ligações e liga a si mesmo em cadeia",
      why: "Com quatro mãos, o carbono fecha cadeia, ramo e anel, e ainda deixa valência para outros elementos. É essa combinação que dá a variedade da química orgânica.",
    },
    levar: "Quatro ligações e a capacidade de ligar a si mesmo: a vida vem daí.",
    maos:
      "Monte três cadeias com quatro carbonos, uma reta, uma ramificada e um anel, e compare fórmula e propriedade. A diferença mostra o que a topologia faz.",
  },
  polymers: {
    limite:
      "Polímero é cadeia longa de repetição, e o limite é a dispersão: o tamanho varia de molécula para molécula, e a propriedade é média. Por isso o mesmo plástico pode ter comportamento diferente entre lote e lote.",
    pergunta: {
      q: "O que determina a propriedade de um polímero?",
      a: "O tipo de monômero e o tamanho e a organização das cadeias",
      why: "A unidade repetida dá a família, e o comprimento e o empacotamento dão dureza, elasticidade e ponto de fusão. Mudar o processo muda a propriedade sem mudar a fórmula.",
    },
    levar: "Polímero é média: comprimento e organização decidem a propriedade.",
    maos:
      "Compare polietileno de alta e de baixa densidade e explique a diferença pela organização das cadeias, não pela fórmula.",
  },
  acoustics: {
    limite:
      "Ressonância amplia a vibração na frequência natural, e o limite é o amortecimento: sem perda, a amplitude cresce sem teto, e na prática o material sempre perde energia. A ponte que oscila é o aviso de que o projeto precisa prever isso.",
    pergunta: {
      q: "O que acontece na ressonância?",
      a: "O sistema vibra com amplitude grande na frequência natural",
      why: "Quando a excitação bate com a frequência própria, cada empurrão chega na hora certa e soma energia. A amplitude cresce até o amortecimento equilibrar a entrada.",
    },
    levar: "Ressonância é empurrão na hora certa, repetido.",
    maos:
      "Ache a frequência de ressonância de um copo com água variando o nível e batendo de leve. Depois explique por que a altura da água muda a nota.",
  },
  instruments: {
    limite:
      "Corda, tubo e pele geram som por modos de vibração, e o limite é o material: tensão, comprimento e densidade mudam a frequência, e o músico ajusta essas variáveis o tempo todo. A física explica o instrumento, mas não o substitui.",
    pergunta: {
      q: "O que muda a frequência de uma corda vibrante?",
      a: "Comprimento, tensão e densidade linear",
      why: "Corda mais curta, mais tensionada ou mais leve vibra mais rápido. O músico usa esses três controles: pestana, afinação e escolha de encordoamento.",
    },
    levar: "Instrumento é física ajustável nas mãos do músico.",
    maos:
      "Aperte uma corda no meio e compare a nota com a corda solta. Depois calcule a razão de frequência e confira se bate com a oitava.",
  },
  convolution: {
    limite:
      "Convolução aplica filtro local e realça padrão, e o limite é a borda: o filtro não sabe o que está fora da imagem, e o resultado depende de como você preenche a margem. Ignorar isso cria artefato que vira conclusão errada.",
    pergunta: {
      q: "O que um filtro de convolução realça numa imagem?",
      a: "Padrões locais como borda e textura",
      why: "O filtro compara cada pixel com os vizinhos e responde à diferença. Borda aparece porque o contraste é alto, e a mesma conta em outra máscara realça textura ou desfoque.",
    },
    levar: "Filtro vê vizinhança, e a margem da imagem é decisão sua.",
    maos:
      "Aplique uma máscara de borda e uma de desfoque na mesma foto e compare. Depois mude o preenchimento da margem e veja o que muda na beirada.",
  },
  detection: {
    limite:
      "Detecção de objeto junta região e classe, e o limite é a métrica: acerto alto no conjunto de teste pode esconder erro no caso raro. A caixa que envolve o objeto já é decisão de projeto, e ela erra.",
    pergunta: {
      q: "O que uma métrica de detecção precisa medir além de acertar a classe?",
      a: "A localização da caixa em relação ao objeto real",
      why: "Acertar que é um carro e errar onde ele está não serve para dirigir. A métrica combina classe e sobreposição entre caixa prevista e caixa real.",
    },
    levar: "Detectar é dizer o que e onde; errar o onde ainda é erro.",
    maos:
      "Desenhe duas caixas para o mesmo objeto, uma justa e uma deslocada, e calcule a sobreposição. Depois diga qual das duas o sistema deveria aceitar.",
  },
  narrative: {
    limite:
      "Narrador e tempo organizam a história, e o limite é a voz: o mesmo fato muda de sentido conforme quem conta e quando conta. A escolha não é enfeite técnico, é o que o leitor entende como verdade.",
    pergunta: {
      q: "O que o ponto de vista do narrador decide na história?",
      a: "O que o leitor tem acesso e em que ordem",
      why: "O narrador escolhe o que mostra, o que esconde e quando revela. A mesma cena contada por outra voz produz outro sentido, mesmo com os mesmos fatos.",
    },
    levar: "Narrador é filtro: quem conta decide o que existe para o leitor.",
    maos:
      "Reescreva a mesma cena em primeira e em terceira pessoa e marque o que o leitor perdeu em cada versão. A diferença é o efeito da voz.",
  },
  poetry: {
    limite:
      "Métrica e rima são estrutura, e o limite é o verso livre: poema sem metro continua poema, e a análise que só conta sílaba perde o que o texto faz. A forma sustenta o sentido, não o substitui.",
    pergunta: {
      q: "O que a métrica organiza no poema?",
      a: "O ritmo da leitura, contando sílabas poéticas",
      why: "A contagem de sílabas dentro do verso cria expectativa e cadência. A rima reforça o fim do verso, e os dois juntos dão a estrutura sonora que o ouvido reconhece.",
    },
    levar: "Métrica é ritmo; sentido é o que o ritmo carrega.",
    maos:
      "Escande um verso contando sílabas poéticas e leia em voz alta. Depois mude uma palavra e diga o que aconteceu com o ritmo e com o sentido.",
  },
  networks: {
    limite:
      "Rede organiza em camadas e cada camada resolve um problema sem saber das outras. O limite é o vazamento: desempenho, segurança e confiabilidade atravessam camadas, e otimizar uma pode piorar outra.",
    pergunta: {
      q: "Por que a rede é dividida em camadas?",
      a: "Para cada camada resolver um problema sem depender do detalhe da outra",
      why: "A camada de aplicação não precisa saber se o pacote viaja por cabo ou rádio. Trocar a tecnologia embaixo não muda o protocolo em cima, e é isso que permite a rede crescer.",
    },
    levar: "Camada esconde detalhe; o custo aparece quando uma vaza.",
    maos:
      "Siga um pedido de página da aplicação até o cabo e escreva o que cada camada acrescenta. Depois diga onde um atraso maior apareceria.",
  },
  protocols: {
    limite:
      "TCP entrega em ordem e confirma, UDP não confirma, e DNS traduz nome. O limite é a escolha: cada protocolo troca garantia por custo, e usar TCP onde a perda é aceitável paga latência sem ganho.",
    pergunta: {
      q: "Qual a diferença central entre TCP e UDP?",
      a: "TCP confirma e reordena; UDP não garante entrega",
      why: "TCP monta a sequência, confirma recebimento e reenvia o que falta. UDP só envia, e por isso é mais rápido e menos confiável, adequado a voz e vídeo ao vivo.",
    },
    levar: "Protocolo é troca: garantia custa tempo.",
    maos:
      "Compare o caminho de um pacote TCP e um UDP numa perda de rede e diga o que o usuário sente em cada caso.",
  },
  heat: {
    limite:
      "Calor é energia em trânsito por diferença de temperatura, e temperatura não é a mesma coisa que energia total. O limite é o corpo pequeno: um objeto pode ter temperatura alta e pouca energia, e o contrário também.",
    pergunta: {
      q: "O que é calor?",
      a: "Energia que passa de um corpo a outro por diferença de temperatura",
      why: "Calor é processo, não coisa guardada. Ele flui enquanto houver diferença de temperatura e para quando os dois se igualam, e por isso não se fala em calor contido.",
    },
    levar: "Calor é trânsito de energia; temperatura é o nível.",
    maos:
      "Misture água quente e fria em quantidades diferentes e calcule a temperatura final. Depois explique por que a média simples não funciona quando as massas mudam.",
  },
  entropy: {
    limite:
      "Entropia mede dispersão de energia, e o limite é a contagem: em sistema pequeno, flutuação importa e a seta do tempo perde força. A segunda lei é estatística, não proibição absoluta.",
    pergunta: {
      q: "O que a segunda lei da termodinâmica diz sobre a entropia?",
      a: "Que a entropia total de um sistema isolado não diminui",
      why: "A energia se dispersa e as configurações menos ordenadas são maioria. O processo pode até baixar a entropia local, desde que aumente mais em outro lugar.",
    },
    levar: "A seta do tempo aponta para a configuração mais provável.",
    maos:
      "Conte as formas de organizar quatro moedas em cara e coroa e veja qual configuração tem mais arranjos. Depois relacione com a entropia subindo.",
  },
  analysis: {
    limite:
      "A química analítica separa e mede, e o limite é a amostra: resultado bom de amostra mal colhida não vale. O erro de amostragem costuma ser maior que o erro do instrumento.",
    pergunta: {
      q: "O que o resultado de uma análise química representa?",
      a: "A concentração na amostra analisada, não em todo o material",
      why: "A medida descreve a porção que foi colhida e preparada. Se a amostra não representa o lote, o número é preciso e falso ao mesmo tempo.",
    },
    levar: "Instrumento mede a amostra; a amostra representa o lote.",
    maos:
      "Escreva o plano de amostragem de um lote e justifique o número de pontos e a posição de cada um. Depois diga o que aconteceria se você colhesse só do topo.",
  },
  spectrum: {
    limite:
      "Espectro identifica por padrão de absorção e emissão, e o limite é a mistura: dois componentes podem sobrepor banda e esconder um ao outro. A identificação precisa de mais de uma técnica quando a amostra é complexa.",
    pergunta: {
      q: "O que o espectro de uma substância revela?",
      a: "As frequências que ela absorve ou emite, ligadas à sua estrutura",
      why: "Cada arranjo de átomos e ligações tem níveis de energia próprios. As transições permitidas aparecem como linhas, e o conjunto funciona como impressão digital.",
    },
    levar: "Espectro é impressão digital de estrutura, não de cor.",
    maos:
      "Compare o espectro de duas fontes de luz e diga qual linha identifica cada uma. Depois explique por que a cor vista não basta para identificar.",
  },
  form: {
    limite:
      "Forma musical organiza expectativa por repetição e contraste, e o limite é o ouvinte: a mesma estrutura pode soar clara para um e confusa para outro. Forma é mapa, e mapa não é a experiência.",
    pergunta: {
      q: "Para que serve a forma musical?",
      a: "Para organizar repetição, contraste e retorno ao longo do tempo",
      why: "A forma dá ao ouvinte onde se localizar: tema, desenvolvimento e retorno. Sem ela, a peça vira sequência sem memória, e a atenção se dispersa.",
    },
    levar: "Forma é o mapa que o ouvido usa para não se perder.",
    maos:
      "Escute uma peça e marque onde o tema volta. Depois desenhe a forma com letras e diga o que o retorno mudou no sentido.",
  },
  counterpoint: {
    limite:
      "Contraponto combina vozes independentes que soam juntas, e o limite é a inteligibilidade: vozes demais viram textura e o texto se perde. A regra serve à clareza, não ao cumprimento formal.",
    pergunta: {
      q: "O que o contraponto exige entre as vozes?",
      a: "Independência melódica e coerência harmônica ao mesmo tempo",
      why: "Cada voz tem linha própria, mas o encontro entre elas precisa soar consonante. O equilíbrio entre as duas coisas é o que define a escrita contrapontística.",
    },
    levar: "Vozes independentes, encontros coerentes.",
    maos:
      "Escreva duas linhas de quatro notas que se movam em direções opostas e confira os intervalos em cada encontro. Depois diga qual encontro precisa de ajuste.",
  },
  chance: {
    limite:
      "Probabilidade mede crença e frequência, e o limite é a informação: probabilidade não existe no objeto, existe no modelo. Mudar o dado muda a probabilidade sem mudar o mundo.",
    pergunta: {
      q: "O que a esperança matemática representa?",
      a: "O valor médio de um resultado repetido muitas vezes",
      why: "A esperança soma cada resultado multiplicado pela probabilidade dele. Ela não promete o próximo resultado, descreve a média de uma sequência longa.",
    },
    levar: "Probabilidade é do modelo, não do objeto.",
    maos:
      "Calcule a esperança de um jogo simples e decida se vale apostar. Depois repita o jogo dez vezes e compare o resultado com a média esperada.",
  },
  statistics: {
    limite:
      "Média, variância e amostra descrevem dado, e o limite é a distribuição: a média esconde a forma, e a variância esconde a cauda. Olhar só os dois resumos pode esconder o caso que importa.",
    pergunta: {
      q: "O que a variância mede?",
      a: "O quanto os valores se espalham em torno da média",
      why: "Variância é a média do quadrado do desvio. Dois conjuntos com a mesma média podem ter variâncias muito diferentes, e o espalhamento muda a decisão.",
    },
    levar: "Média dá o centro; variância diz se confiar nele.",
    maos:
      "Monte dois conjuntos com a mesma média e variâncias diferentes e faça o gráfico. Depois diga qual dos dois sustenta uma previsão mais segura.",
  },
  tokens: {
    limite:
      "Token é a unidade que o modelo processa, e o limite é a fronteira: token não coincide com palavra nem com sílaba, e cortar texto por token pode partir palavra no meio. A escolha do tokenizador muda o custo e o resultado.",
    pergunta: {
      q: "O que a tokenização faz com o texto?",
      a: "Quebra em unidades que o modelo processa",
      why: "O modelo não lê letra nem palavra: ele lê token. A mesma frase pode gastar quantidades diferentes de token conforme o idioma e o vocabulário do tokenizador.",
    },
    levar: "Token é a unidade do modelo, não a palavra.",
    maos:
      "Tokenize uma frase curta na mão, separando por regra de pedaço comum, e conte os tokens. Depois compare com a contagem de palavras e explique a diferença.",
  },
  context: {
    limite:
      "A janela de contexto é o que o modelo vê de uma vez, e o limite é o esquecimento: o que sai da janela não influencia a resposta. Resumir e reenviar é a estratégia, e ela perde detalhe.",
    pergunta: {
      q: "O que a janela de contexto limita?",
      a: "Quanto texto o modelo consegue considerar de uma vez",
      why: "O modelo só enxerga o que cabe na janela. Conversa longa precisa ser resumida ou recuperada por busca, porque o que fica fora não entra na conta.",
    },
    levar: "Fora da janela, o modelo não vê.",
    maos:
      "Pegue um diálogo longo e marque o ponto em que a janela cortaria. Depois escreva o resumo que você mandaria no lugar do trecho perdido.",
  },
  meaning: {
    limite:
      "Sentido liga expressão e mundo, e o limite é a referência: duas expressões podem apontar o mesmo objeto e não significar a mesma coisa. Significado não é só o que está no mundo.",
    pergunta: {
      q: "O que a referência de uma expressão indica?",
      a: "O objeto ou conjunto do mundo a que ela se aplica",
      why: "Referência é o que a expressão aponta, e sentido é o modo de apresentar esse objeto. Estrela da manhã e estrela da tarde têm a mesma referência e sentidos diferentes.",
    },
    levar: "Sentido não é referência: o mesmo objeto pode ser apresentado de outro jeito.",
    maos:
      "Ache duas expressões com a mesma referência e sentidos diferentes e explique a diferença com um exemplo de frase em que só uma soa adequada.",
  },
  pragmatics: {
    limite:
      "Pragmática estuda o que a frase faz além de dizer, e o limite é o contexto: a mesma frase pode ser pedido, ameaça ou piada. Sem contexto, a análise fica incompleta por definição.",
    pergunta: {
      q: "O que a pragmática estuda?",
      a: "O uso da língua em contexto e o efeito da fala",
      why: "A pragmática olha o que o falante quer fazer com a frase: pedir, prometer, ironizar. O sentido literal é ponto de partida, não resposta final.",
    },
    levar: "A frase não só diz: ela faz algo, e o contexto decide o quê.",
    maos:
      "Pegue uma frase e escreva três contextos em que ela muda de efeito. Depois diga que pista do contexto o ouvinte usa em cada um.",
  },
  lenses: {
    limite:
      "Lente forma imagem por refração, e o limite é a aproximação paraxial: perto do eixo a conta é simples, longe dele aparece aberração. A lente real nunca é o desenho ideal.",
    pergunta: {
      q: "O que a distância focal de uma lente indica?",
      a: "Onde a luz paralela converge depois de atravessar a lente",
      why: "A distância focal é o ponto em que raios paralelos se encontram. Ela decide o aumento e a posição da imagem, junto com a distância do objeto.",
    },
    levar: "Focal é onde a luz paralela se encontra; o resto é aberração.",
    maos:
      "Com uma lente, projete a imagem de uma janela numa parede e meça a distância focal. Depois mova a lente e veja o que acontece com o tamanho da imagem.",
  },
  rainbow: {
    limite:
      "O arco-íris nasce de refração e reflexão na gota, e o limite é o ângulo: a cor que você vê depende da posição do Sol e do seu olho. Arco-íris não está no céu, está na direção.",
    pergunta: {
      q: "O que forma o arco-íris?",
      a: "Refração e reflexão da luz dentro das gotas de água",
      why: "A luz entra na gota, refrata, reflete no fundo e sai separada em cores. O ângulo de saída é diferente por cor, e é isso que separa o arco.",
    },
    levar: "O arco-íris é direção, não objeto no céu.",
    maos:
      "Com um prisma ou copo d'água, projete o espectro e marque a ordem das cores. Depois explique por que a ordem não muda quando você gira a fonte.",
  },
  security: {
    limite:
      "Segurança protege confidencialidade, integridade e disponibilidade, e o limite é o elo humano: a senha reutilizada derrota a criptografia mais forte. O sistema é tão forte quanto o processo mais fraco.",
    pergunta: {
      q: "O que a criptografia garante numa comunicação?",
      a: "Que quem intercepta não lê o conteúdo sem a chave",
      why: "A cifra transforma o texto em algo ilegível sem a chave correta. Ela não impede que a mensagem seja interceptada nem que o servidor seja invadido.",
    },
    levar: "Criptografia protege o conteúdo, não o contexto.",
    maos:
      "Liste cinco dados de um login e diga qual propriedade da segurança cada um precisa. Depois aponte o elo humano de cada proteção.",
  },
  crypto: {
    limite:
      "Assinatura digital prova autoria e integridade com chave privada, e o limite é a chave: quem tem a chave assina como você. Guardar a chave é a parte difícil, e ela não se resolve com algoritmo.",
    pergunta: {
      q: "O que uma assinatura digital prova?",
      a: "Que o conteúdo foi assinado pela chave privada e não mudou",
      why: "A assinatura é calculada sobre o conteúdo com a chave privada. Quem tem a chave pública confere, e qualquer alteração no conteúdo invalida a verificação.",
    },
    levar: "Assinatura prova chave, não pessoa: a chave ainda é sua responsabilidade.",
    maos:
      "Assine um texto curto com uma ferramenta de linha de comando, altere um caractere e verifique de novo. O erro da verificação é a prova de integridade.",
  },
};

// Os textos do arquipélago. Cada estação do mapa é uma página; o instrumento
// interativo mora em js/zones/ e é carregado só quando a pessoa abre o painel.

export const POSTS = {
  welcome: {
    kicker: "porto do início",
    title: "Um arquipélago que se atravessa a pé",
    date: "2026-10-19",
    read: "4 min",
    tags: ["meta", "começo", "rede", "missões"],
    continent: "hub",
    lab: null,
    body: `
      <p>Este blog não tem índice. Tem <strong>mapa</strong>. Você entra com um boneco, atravessa pontes e escolhe por qual continente começar. Cada estação que encontra é uma página: um texto curto e um instrumento para mexer com as mãos.</p>
      <p>São sete continentes. A <em>Computação</em> mostra como saímos de interruptores e areia até processadores. <em>Matemática</em> visita o infinito, as formas, a mudança e o acaso. <em>Física</em> testa pêndulos, ondas, calor, luz e órbitas. <em>Química</em> abre a tabela periódica, as ligações, as reações e o equilíbrio. <em>Música</em> mostra a matemática escondida no som. <em>Inteligência Artificial</em> abre os dados, as redes, a linguagem e os limites. O <em>Vale da Língua</em> desce ao português do Brasil: o som, a palavra, a frase e o texto. Ao todo, 49 fragmentos para descobrir.</p>
      <p>Cada estação abre uma página e soma experiência. O <strong>Diário</strong> guarda o que você já encontrou. As <strong>Pedras do Porto</strong>, os monólitos brilhantes nas docas, levam você de volta a qualquer continente já visitado. A névoa do minimapa só some onde você anda.</p>
      <blockquote>Não tem pressa. O mapa é grande, mas o caminho é seu.</blockquote>
      <p>Os <strong>NPCs</strong> têm missões. Aperte F perto deles: tem caminhada, pergunta e conversa. Cada missão paga experiência e um título, e o Diário mostra quanto falta para a próxima.</p>
      <p>Clique no chão e o boneco vai até ali sozinho. Nas clareiras com bandeira fica um instrutor: com ele você treina o tema da caverna sem perder vida e sem levar item. O bicho de verdade mora na caverna ao lado, e é lá que a prova paga experiência, item e perícia. Fugir também custa: a chance de levar um golpe cresce com o monstro, e café reduz o risco por um tempo. A <strong>Ficha</strong>, na tecla C, mostra tudo.</p>
      <p>Na <strong>Rede</strong> você desafia outro jogador: escolhe uma pergunta de muito fácil a muito difícil e ele responde para se defender. Quem erra perde compostura, não vida, e quem zera fica dez segundos desativado. Nada é perdido além do orgulho.</p>
      <p>A <strong>Rede</strong>, na tecla E, liga você aos outros jogadores: canais por continente, DMs privadas e a lista de quem está no mundo agora. Sua conta é uma chave criada no seu navegador, sem cadastro. Se encontrar outra pessoa na praça, acene.</p>
    `,
  },
  echo: {
    kicker: "rádio do quintal",
    title: "O som também é matemática",
    date: "2026-06-02",
    read: "4 min",
    tags: ["som", "síntese", "web audio"],
    continent: "hub",
    lab: "echo",
    body: `
      <p>Uma nota musical é uma frequência. Dó central, por exemplo, é 261,63 Hz. Dobre a frequência e você tem a mesma nota uma oitava acima. Divida pela metade e tem a mesma nota uma oitava abaixo. O resto da escala é uma negociação entre matemática e costume.</p>
      <p>O sequenciador deste rádio não usa nenhum arquivo de áudio. Cada batida é uma onda gerada na hora pelo Web Audio: um pulso curto para a percussão, um seno com envelope para a nota, um acorde sustentado para o fundo. É síntese sonora do jeito raiz, com osciladores e ganhos.</p>
      <p>Ligue o som no topo da tela, monte um padrão e aperte play. O tempo é dividido em oito passos; cada coluna é um instante, cada linha é uma voz. Pequenas mudanças de padrão mudam o clima inteiro, e nenhum arquivo foi baixado para isso.</p>
      <blockquote>Som é ar mexendo. Música é ar mexendo na hora certa.</blockquote>
    `,
  },

  // ---------------- Computação ----------------
  logic: {
    kicker: "computaria · vale da lógica",
    title: "Portas que pensam",
    date: "2026-09-14",
    read: "5 min",
    tags: ["lógica", "circuitos", "interativo"],
    continent: "cs",
    lab: "logic",
    body: `
      <p>Uma porta lógica é uma promessa pequena: dado isto, devolvo aquilo. O mundo digital inteiro é feito de promessas desse tamanho. Duas entradas, uma saída, uma tabela de verdades, e de repente dá para somar, comparar, lembrar e decidir.</p>
      <p>O <strong>E</strong> só acende quando as duas entradas estão ligadas. O <strong>OU</strong> acende com qualquer uma. O <strong>OU exclusivo</strong> é o chato que gosta de uma coisa por vez. O <strong>NÃO E</strong> é o E do contra. Trocar a porta muda o comportamento sem mudar a fiação, e é aí que a coisa fica boa: lógica é composição.</p>
      <p>Um processador moderno tem bilhões dessas portas, mas nenhuma delas sabe o que está fazendo. A inteligência não está na peça, está no desenho. É a mesma graça de uma frase: as letras não significam nada sozinhas, o arranjo significa tudo.</p>
      <blockquote>Se você consegue descrever a saída em função das entradas, você já entendeu a porta. O resto é escala.</blockquote>
    `,
  },
  adder: {
    kicker: "computaria · oficina dos somadores",
    title: "Como se soma com fios",
    date: "2026-09-21",
    read: "5 min",
    tags: ["circuitos", "binário", "aritmética"],
    continent: "cs",
    lab: "adder",
    body: `
      <p>Somar dois números parece a coisa mais natural do mundo, mas um circuito não sabe somar. Ele sabe combinar sinais. O truque é o mesmo da conta de escola: some uma coluna, anote o resultado e leve o "vai um" para a próxima. No binário, cada coluna só pode dar 0 ou 1, então o "vai um" aparece sempre que a soma passa de 1.</p>
      <p>Um <strong>meio somador</strong> resolve uma coluna: a soma é o OU exclusivo das entradas e o transporte é o E. Um <strong>somador completo</strong> aceita também o transporte que veio de trás. Encadeie quatro somadores completos e você tem um somador de quatro bits: 8 + 5 vira 13 na frente dos seus olhos, um fio de cada vez.</p>
      <p>O detalhe bonito é que ninguém somou nada. O resultado é uma consequência da topologia. É por isso que um computador pode ser rápido e burro ao mesmo tempo: a conta está no desenho dos fios, não na compreensão de quem executa.</p>
    `,
  },
  state: {
    kicker: "computaria · torre dos relógios",
    title: "O tempo dentro do circuito",
    date: "2026-09-28",
    read: "5 min",
    tags: ["circuitos", "memória", "clock"],
    continent: "cs",
    lab: "state",
    body: `
      <p>Um circuito combinacional não tem passado. A saída depende só das entradas de agora. Ele não consegue lembrar de nada. Para lembrar, é preciso um circuito que olhe para si mesmo, realimentado, e que mude de estado só quando um pulso de relógio permitir.</p>
      <p>O <strong>flip-flop</strong> é essa célula de memória mínima: um bit que fica de pé até alguém mandar mudar. O relógio é o metrônomo que arruma a bagunça. Em cada batida, o circuito inteiro compara, decide e atualiza de forma coordenada. Sem ele, os sinais chegariam em horários diferentes e o resultado dependeria da sorte.</p>
      <p>Com memória e relógio nascem as <strong>máquinas de estado</strong>: semáforos, elevadores, protocolos, parsers, o controle do seu processador. São sistemas que sabem onde estão e qual é o próximo passo. A computação começa de verdade quando um circuito aprende a esperar.</p>
    `,
  },
  cpu: {
    kicker: "computaria · catedral do processador",
    title: "Uma cidade chamada processador",
    date: "2026-10-02",
    read: "6 min",
    tags: ["arquitetura", "cpu", "história"],
    continent: "cs",
    lab: "cpu",
    body: `
      <p>Um processador é uma pequena cidade com bairros especializados. Os <strong>registradores</strong> são as gavetas de trabalho. A <strong>ULA</strong> faz as contas. A <strong>unidade de controle</strong> é o chefe que lê a próxima instrução, entende o que deve ser feito e abre os portões certos. A memória é o galpão onde mora o resto.</p>
      <p>O ciclo é sempre o mesmo: <em>buscar</em> a instrução, <em>decodificar</em> o que ela quer, <em>executar</em> e <em>guardar</em> o resultado. Repetido bilhões de vezes por segundo, esse refrão simples desenha desde uma planilha até um jogo. O que muda é a escala e a esperteza de procurar dados antes de serem pedidos.</p>
      <p>Pipelines dividem o trabalho em etapas, como uma linha de montagem. Um desvio de fluxo é uma instrução que manda o código ir por outro caminho, e prever esse caminho antes de saber a resposta é uma das artes mais caras da computação. A CPU de brinquedo abaixo executa um programa de verdade, um passo por vez.</p>
    `,
  },
  history: {
    kicker: "computaria · museu da computação",
    title: "Da areia ao silício",
    date: "2026-10-06",
    read: "7 min",
    tags: ["história", "transistores", "computação"],
    continent: "cs",
    lab: "history",
    body: `
      <p>Antes de existir máquina, existia método. Os dedos contavam, o ábaco organizava, as tábuas da Babilônia guardavam receitas. O desejo era sempre o mesmo: tirar do cérebro a parte mecânica da conta e deixá-la acontecer em outro lugar.</p>
      <p>Babbage desenhou máquinas diferenciais com rodas dentadas. Ada Lovelace viu, numa delas, algo que o inventor não tinha visto: a máquina poderia manipular símbolos, não apenas números. Um século depois, Turing deu nome ao que é calculável, enquanto válvulas, depois transistores e depois circuitos integrados encolhiam o cálculo até caber no bolso.</p>
      <p>Foi uma sequência de apostas sobre materiais. Areia vira silício, silício vira cristal, cristal vira chave liga-desliga. A <strong>Lei de Moore</strong> não é uma lei da natureza, é uma promessa industrial que a indústria se esforçou para cumprir por décadas. Hoje o gargalo não é só o tamanho: é o calor, a energia, a física dos fios minúsculos.</p>
      <blockquote>A história do computador é a história de deixar uma responsabilidade para a matéria.</blockquote>
    `,
  },

  // ---------------- Matemática ----------------
  infinity: {
    kicker: "matemática · salão do infinito",
    title: "O hotel com infinitos quartos",
    date: "2026-09-10",
    read: "5 min",
    tags: ["infinito", "conjuntos", "paradoxos"],
    continent: "math",
    lab: "infinity",
    body: `
      <p>Imagine um hotel com infinitos quartos, todos ocupados. Chega um hóspede. O gerente pede que cada pessoa passe para o quarto seguinte: o hóspede do 1 vai para o 2, o do 2 para o 3, e assim por diante. O quarto 1 fica livre. O hotel estava cheio e ainda assim havia lugar.</p>
      <p>É o tipo de coisa que fez o infinito ser tratado como um perigo até o século XIX. Cantor mostrou que podemos comparar conjuntos infinitos pelo emparelhamento: se cada elemento de um pode ser ligado a um único elemento do outro, eles têm o mesmo tamanho. Os pares e os naturais têm o mesmo tamanho, apesar de os pares parecerem "metade".</p>
      <p>Mais estranho ainda: os números reais <strong>não</strong> podem ser emparelhados com os naturais. Existem mais reais entre 0 e 1 do que números inteiros de todo o universo. Há infinitos maiores que outros. E a maioria deles é grande demais para ser listada, nomeada ou até descrita por uma frase finita.</p>
      <blockquote>O infinito não é um número grande. É uma forma de nunca terminar.</blockquote>
    `,
  },
  geometry: {
    kicker: "matemática · jardim dos sólidos",
    title: "As formas que existem antes de nós",
    date: "2026-08-22",
    read: "4 min",
    tags: ["geometria", "platônicos", "3d"],
    continent: "math",
    lab: "solid",
    body: `
      <p>Um icosaedro tem vinte faces, doze vértices e trinta arestas. É um dos cinco sólidos platônicos, as únicas formas convexas feitas de uma única espécie de polígono regular que fecham o espaço sem sobrar buraco. Tetraedro, cubo, octaedro, dodecaedro, icosaedro. Cinco, e nunca haverá mais.</p>
      <p>A relação de Euler diz que, em qualquer poliedro convexo, <em>vértices - arestas + faces = 2</em>. Não importa o tamanho, a cor ou a história da forma. É uma daquelas verdades que parecem ter sido encontradas, não inventadas. A simetria dos sólidos platônicos aparece em cristais, vírus, dados e na arquitetura de coisas que ainda nem existem.</p>
      <p>Gire o sólido aí embaixo. A câmera e a luz são de brinquedo, mas os triângulos são de verdade: cada aresta é uma reta e cada face é um plano. Geometria é o primeiro lugar onde a matemática vira objeto.</p>
    `,
  },
  calculus: {
    kicker: "matemática · ponte do cálculo",
    title: "A matemática da mudança",
    date: "2026-08-12",
    read: "6 min",
    tags: ["cálculo", "derivada", "integral"],
    continent: "math",
    lab: "calculus",
    body: `
      <p>Existem duas perguntas pequenas que mudaram tudo. A primeira: <strong>quão rápido isto está mudando agora?</strong> A segunda: <strong>quanto se acumulou depois de tanto tempo?</strong> A primeira é a derivada, a segunda é a integral, e o teorema fundamental do cálculo diz que são dois lados da mesma moeda.</p>
      <p>A derivada nasce de uma ideia atrevida: pegue dois pontos de uma curva e calcule a inclinação entre eles; depois aproxime um ponto do outro até a distância virar quase zero. A integral faz o contrário: corta a área debaixo da curva em retângulos finos e soma tudo. Quanto mais finos, mais perto da área verdadeira.</p>
      <p>Newton e Leibniz chegaram a isso por caminhos diferentes, quase ao mesmo tempo, e a briga sobre quem veio primeiro foi mais longa que a matemática. Hoje o cálculo está no GPS, no controle de temperatura, na economia, no áudio digital e no movimento de qualquer coisa que você vê.</p>
      <blockquote>O mundo não é feito de instantes. Mas os instantes são uma boa maneira de entendê-lo.</blockquote>
    `,
  },
  probability: {
    kicker: "matemática · cassino de pascal",
    title: "O acaso tem forma",
    date: "2026-08-02",
    read: "5 min",
    tags: ["probabilidade", "estatística", "distribuições"],
    continent: "math",
    lab: "probability",
    body: `
      <p>Jogue uma moeda cem vezes. Ninguém espera exatamente cinquenta caras. Mas, se repetir a experiência muitas vezes, a distribuição dos resultados começa a desenhar uma curva em forma de sino. O acaso individual é imprevisível; o acaso coletivo tem forma.</p>
      <p>Na <strong>máquina de Galton</strong>, cada bolinha desce por uma grade de pinos e, a cada pino, escolhe esquerda ou direita ao acaso. É como jogar uma moeda em cada linha. No fim, quase todas as bolinhas caem no meio: há muito mais caminhos que levam ao centro do que caminhos que levam a uma ponta. A curva binomial aparece sozinha.</p>
      <p>Com muitas linhas e muitas bolinhas, a binomial se aproxima da <strong>normal</strong>, o teorema central do limite. É por isso que alturas, erros de medida e médias de muitas coisas parecem sino. O acaso não é ausência de regra: é uma regra sobre a frequência com que as coisas acontecem.</p>
    `,
  },
  fractal: {
    kicker: "matemática · bosque dos fractais",
    title: "O infinito cabe num galho",
    date: "2026-07-22",
    read: "6 min",
    tags: ["fractais", "recursão", "wasm"],
    continent: "math",
    lab: "fractal",
    body: `
      <p>Um fractal é uma forma que se repete dentro de si mesma. Um galho vira árvore, a árvore vira galho. Uma regra curta aplicada muitas vezes gera uma complexidade que não caberia em nenhuma descrição linha por linha. É a vitória da receita sobre o bolo.</p>
      <p>A árvore deste bosque nasce de três números: o ângulo entre os galhos, a profundidade da recursão e um pouco de vento. Muda o ângulo e ela deixa de ser árvore e vira coral. Aumenta a profundidade e o desenho começa a ocupar o espaço de um jeito que parece vivo.</p>
      <p>Do lado do conjunto de Julia, a conta é outra. Para cada pixel, o navegador pega um número complexo, aplica <code>z² + c</code> centenas de vezes e pergunta se ele foge para o infinito. Onde foge, pinta de um jeito; onde fica preso, pinta de outro. Essa parte roda em <strong>WebAssembly</strong>: um módulo pequeno calcula os pixels em milissegundos, e o JavaScript conversa com o mouse.</p>
      <blockquote>Fractais são o lugar onde a matemática para de fingir que é discreta e mostra que o infinito tem detalhes.</blockquote>
    `,
  },

  // ---------------- Física ----------------
  motion: {
    kicker: "física · pátio do pêndulo",
    title: "O pêndulo e o tempo",
    date: "2026-07-02",
    read: "5 min",
    tags: ["mecânica", "pêndulo", "energia"],
    continent: "physics",
    lab: "motion",
    body: `
      <p>Galileu teria observado um candelabro balançando na catedral e percebido algo estranho: o tempo de uma ida e volta parecia não depender da amplitude, pelo menos para balanços pequenos. Um pêndulo curto balança mais rápido; um longo, mais devagar. A fórmula do período é <em>T = 2π√(L/g)</em>, e ela não pergunta nada sobre a massa.</p>
      <p>Isso é uma máquina de medir tempo. Um peso, um fio e a gravidade fazem o resto. Relógios de pêndulo dominaram a navegação e a astronomia durante séculos, até o quartzo e o átomo oferecerem pulsações mais estáveis.</p>
      <p>Enquanto balança, a energia troca de roupa: potencial no alto, cinética no meio. Se não houver atrito, a soma fica constante. Se houver, o pêndulo desacelera e a energia vira calor. Nada se perde, apenas muda de forma.</p>
    `,
  },
  waves: {
    kicker: "física · observatório das ondas",
    title: "Toda onda é uma soma de senos",
    date: "2026-06-22",
    read: "7 min",
    tags: ["matemática", "séries", "visualização"],
    continent: "physics",
    lab: "fourier",
    body: `
      <p>Fourier fez uma aposta ousada: qualquer sinal razoável pode ser escrito como uma soma de senos e cossenos. Uma onda quadrada, com seus cantos duros, com seus saltos, é só uma porção de ondas suaves empilhadas com pesos espertos. O observatório existe para você ver essa mágica acontecendo.</p>
      <p>A série da onda quadrada é <em>f(t) = (4/π) Σ sin((2k-1)t)/(2k-1)</em>, com <em>k</em> indo de 1 até o infinito. Com poucos termos, o desenho é uma onda gorda e arredondada. Com muitos, os cantos aparecem. Sempre sobra um sobressalto perto do salto: é o fenômeno de Gibbs, a matemática avisando que convergência não é a mesma coisa que perfeição.</p>
      <p>Isso não é curiosidade de matemático. Compressão de áudio, imagem, rádio, ressonância magnética, análise de vibração: tudo usa a ideia de decompor um sinal em frequências. Quando você ouve um instrumento e reconhece o timbre, está fazendo Fourier com o ouvido.</p>
    `,
  },
  thermo: {
    kicker: "física · fornalha de boltzmann",
    title: "A multidão invisível",
    date: "2026-06-12",
    read: "6 min",
    tags: ["termodinâmica", "entropia", "gás"],
    continent: "physics",
    lab: "thermo",
    body: `
      <p>Não existe um termômetro dentro de uma molécula. Temperatura é uma propriedade da multidão: quanto mais rápida, em média, é a agitação das partículas, mais quente o corpo. Um gás é um enxame de partículas colidindo com as paredes, e a pressão é o resultado dessa chuva de impactos.</p>
      <p>Ao esquentar, as partículas ganham energia e batem mais forte. Ao esfriar, a agitação diminui. No zero absoluto, a menor agitação possível, a temperatura chega a -273,15 °C. Não dá para "esfriar mais" porque não há mais energia de movimento para tirar.</p>
      <p>O segundo princípio da termodinâmica diz que a desordem tende a aumentar. Não por uma força misteriosa, mas por contagem: há muito mais arranjos desordenados do que ordenados. A <strong>entropia</strong> é a matemática dessa contagem. Um copo cai e quebra; cacos não se juntam sozinhos. A flecha do tempo nasce da probabilidade.</p>
    `,
  },
  optics: {
    kicker: "física · prisma de newton",
    title: "A luz que se abre",
    date: "2026-06-02",
    read: "5 min",
    tags: ["óptica", "luz", "espectro"],
    continent: "physics",
    lab: "optics",
    body: `
      <p>Durante muito tempo, a humanidade achou que o branco era a cor mais simples. Newton mostrou o contrário: ao atravessar um prisma, a luz branca se separa num arco de cores. O branco é a soma de todas elas, e o prisma é um separador porque cada cor muda de velocidade de um jeito ligeiramente diferente.</p>
      <p>Esse é o fenômeno da <strong>dispersão</strong>. O índice de refração do vidro depende do comprimento de onda. Quanto menor o comprimento, mais a luz se curva ao entrar e sair. O azul desvia mais que o vermelho, e o espectro aparece.</p>
      <p>A mesma física explica o arco-íris, o céu azul e o vermelho do entardecer. Gotas de água e moléculas de ar fazem com a luz solar o que o prisma faz na mesa. Olhar para o céu é fazer óptica sem perceber.</p>
    `,
  },
  gravity: {
    kicker: "física · órbita de kepler",
    title: "A dança dos corpos",
    date: "2026-05-22",
    read: "6 min",
    tags: ["gravidade", "órbitas", "kepler"],
    continent: "physics",
    lab: "gravity",
    body: `
      <p>Uma pedra cai. A Lua não cai. Newton entendeu que era a mesma coisa: a Lua está caindo sem parar, mas anda de lado rápido o suficiente para não encostar na Terra. A órbita é uma queda contínua em que você erra o chão o tempo todo.</p>
      <p>A força gravitacional cresce com as massas e diminui com o quadrado da distância. Já as leis de Kepler descrevem o que se vê: órbitas elípticas, áreas iguais em tempos iguais, o quadrado do período proporcional ao cubo da distância média. Newton mostrou que essas regras nascem da sua equação.</p>
      <p>Ao mudar a velocidade inicial de um corpo, você muda tudo. Devagar demais, ele cai; rápido demais, escapa; na medida, fica em órbita. É a mesma pergunta que fazemos ao lançar satélites: qual é a velocidade que mantém a queda acontecendo para sempre?</p>
    `,
  },

  // ---------------- Química ----------------
  periodic: {
    kicker: "química · tabela viva",
    title: "A tabela não é uma lista",
    date: "2026-05-10",
    read: "6 min",
    tags: ["química", "elementos", "tabela periódica"],
    continent: "chem",
    lab: "periodic",
    body: `
      <p>Mendeleev não ordenou os elementos alfabeticamente. Colocou-os em fila pelo peso e cortou a fila em períodos, de modo que elementos com comportamento parecido caíssem na mesma coluna. Onde não havia elemento para completar o padrão, ele deixou buracos e previu propriedades. A tabela funcionou antes de os átomos serem compreendidos.</p>
      <p>A explicação veio depois. A coluna diz quantos elétrons de valência o átomo tem; a linha diz quantas camadas. O comportamento químico é, em grande parte, uma história sobre a vontade de completar a última camada. À esquerda, metais que doam elétrons; à direita, não-metais que os querem; no meio, os indecisos.</p>
      <p>Clique nos elementos aí embaixo. O número atômico é a identidade: muda os prótons, muda o elemento. Nêutrons mudam o isótopo. Elétrons mudam o íon. Três números, uma tabela inteira.</p>
    `,
  },
  bonds: {
    kicker: "química · oficina das ligações",
    title: "Os átomos têm preferências",
    date: "2026-04-30",
    read: "6 min",
    tags: ["química", "ligações", "moléculas"],
    continent: "chem",
    lab: "bonds",
    body: `
      <p>Átomos não se tocam por vontade. Eles se ligam porque a configuração resultante tem menos energia e fica mais estável. Em uma <strong>ligação covalente</strong>, dois átomos compartilham elétrons. Em uma <strong>ligação iônica</strong>, um doa e o outro recebe, e os dois viram ímãs de cargas opostas. Em uma <strong>ligação metálica</strong>, os elétrons se soltam e formam um mar coletivo.</p>
      <p>A <strong>eletronegatividade</strong> é a medida da teimosia: quanto um átomo puxa os elétrons compartilhados para si. Quando a diferença entre os dois é grande, a ligação vira iônica. Quando é pequena, covalente. Quando é zero, entre átomos iguais, os elétrons ficam no meio.</p>
      <p>O resultado é a forma das moléculas. A água é curvada porque o oxigênio puxa mais forte e os pares de elétrons empurram uns aos outros. A forma define se uma molécula encaixa em outra, e é por isso que a química vira biologia.</p>
    `,
  },
  titration: {
    kicker: "química · fonte ácida",
    title: "O ponto em que tudo muda",
    date: "2026-04-20",
    read: "5 min",
    tags: ["ácidos", "bases", "ph"],
    continent: "chem",
    lab: "titration",
    body: `
      <p>Ácido é uma substância que doa íons H⁺ em solução; base é a que recebe. O pH mede a concentração desses íons numa escala de 0 a 14. Cada passo na escala é um fator de dez: pH 3 é dez vezes mais ácido que pH 4, e cem vezes mais que pH 5.</p>
      <p>Quando você mistura um ácido com uma base, eles se neutralizam. A curva de titulação mostra o pH subindo aos poucos, mas perto do ponto de equivalência ele salta de repente. É como atravessar uma faixa estreita de equilíbrio e cair do outro lado. Um indicador muda de cor exatamente aí.</p>
      <p>O seu estômago é ácido para digerir e se defender; o seu sangue é levemente básico e precisa ficar assim. A química do corpo é, em grande parte, uma administração constante de pH. Fora dele, enzimas param de funcionar e proteínas mudam de forma.</p>
    `,
  },
  energy: {
    kicker: "química · forja das reações",
    title: "Toda reação tem um preço",
    date: "2026-04-10",
    read: "5 min",
    tags: ["reações", "energia", "catálise"],
    continent: "chem",
    lab: "energy",
    body: `
      <p>Nem toda colisão entre moléculas termina em reação. Para os átomos se reorganizarem, é preciso passar por um estado intermediário incômodo, com ligações velhas esticadas e novas ainda por fazer. O pico dessa montanha é a <strong>energia de ativação</strong>. É o pedágio da reação.</p>
      <p>Se o pedágio for alto, a reação é lenta, mesmo que no fim o sistema fique mais estável. O fósforo do palito pode ficar no ar por muito tempo sem pegar fogo; a faísca fornece o pedágio. Um <strong>catalisador</strong> não muda o destino da reação, apenas encontra um caminho com pedágio menor. Ele não é consumido.</p>
      <p>Reações que liberam energia são <strong>exotérmicas</strong>; as que absorvem são <strong>endotérmicas</strong>. O gráfico abaixo mostra a diferença entre os patamares, o saldo de energia que vai esquentar ou esfriar o ambiente. As enzimas do seu corpo são catalisadores que baixam o pedágio da vida.</p>
    `,
  },
  balance: {
    kicker: "química · balança de lavoisier",
    title: "Nada se cria, nada se perde",
    date: "2026-04-01",
    read: "5 min",
    tags: ["estequiometria", "conservação", "reações"],
    continent: "chem",
    lab: "balance",
    body: `
      <p>Lavoisier fechou reações em recipientes e pesou tudo antes e depois. O número mudava por causa de gases que escapavam, mas a massa do sistema fechado era a mesma. A matéria de um lado tem que aparecer do outro, átomo por átomo. Acertar esse inventário é o que chamamos de balancear uma equação.</p>
      <p>Você não pode inventar um coeficiente para "melhorar" a contabilidade: só pode multiplicar cada composto. O desafio é encontrar os números que deixam a quantidade de cada elemento igual nos dois lados, na menor proporção possível. Feito isso, a equação vira receita de cozinha em escala atômica.</p>
      <p>A <strong>estequiometria</strong> transforma coeficientes em quantidades reais. Dois moles de hidrogênio com um de oxigênio dão dois de água, e não uma quantidade aleatória. Com essas proporções dá para prever rendimento, limitar reagentes e descobrir quanto de produto vai sobrar.</p>
    `,
  },
  // ---------------- Música ----------------
  rhythm: {
    kicker: "música · relógio dos ritmos",
    title: "O tempo também é fração",
    date: "2026-03-24",
    read: "5 min",
    tags: ["ritmo", "fração", "polirritmia"],
    continent: "music",
    lab: "rhythm",
    body: `
      <p>Uma batida não é um instante: é uma divisão do tempo. Quatro batidas por compasso, cada uma dividida em duas, três ou quatro partes. Quando duas divisões diferentes tocam juntas, nasce a <strong>polirritmia</strong>: um ciclo de três contra um ciclo de quatro só volta a coincidir depois de doze pulsos.</p>
      <p>O mínimo múltiplo comum é o maestro invisível. 3 e 4 se encontram em 12. 4 e 5 se encontram em 20. A partitura escrita é uma forma de registrar essas frações para que outras pessoas as reproduzam séculos depois.</p>
      <p>O relógio da estação deixa você ouvir dois ou três ciclos ao mesmo tempo. Não existe batida "errada": existe batida que não fecha. A graça é perceber quando o encontro acontece.</p>
    `,
  },
  harmony: {
    kicker: "música · círculo das razões",
    title: "Por que dó e sol combinam",
    date: "2026-03-17",
    read: "6 min",
    tags: ["harmonia", "razão", "frequência"],
    continent: "music",
    lab: "harmony",
    body: `
      <p>Quando duas notas soam juntas, os ouvidos comparam frequências. Uma oitava é uma razão de 2 para 1. Uma quinta é 3 para 2. Uma quarta é 4 para 3. Essas razões pequenas fazem os ciclos das ondas se alinharem com frequência, e o cérebro lê isso como <em>consonância</em>.</p>
      <p>Não é uma lei da estética, é uma combinação de física e cultura. O <strong>timbre</strong> de cada instrumento já contém uma pilha de harmônicos, e a batida entre frequências próximas cria o <em>batimento</em> que ouvimos como aspereza. Afinar bem é negociar essas batidas até elas sumirem.</p>
      <p>A estação toca pares de notas e mostra a razão. Aumente a diferença em <em>cents</em>, a unidade logarítmica usada para medir desvios de afinação, e veja o batimento aparecer.</p>
    `,
  },
  scales: {
    kicker: "música · escada das escalas",
    title: "A escala é uma negociação",
    date: "2026-03-10",
    read: "6 min",
    tags: ["escala", "temperamento", "afinação"],
    continent: "music",
    lab: "scales",
    body: `
      <p>Dividir a oitava em doze semitons iguais é uma escolha relativamente recente. O <strong>temperamento igual</strong> desafina ligeiramente as quintas para que todas as tonalidades funcionem no mesmo instrumento. A vantagem é poder modular para qualquer tom sem retocar as cordas.</p>
      <p>Os sistemas anteriores, como a afinação pitagórica ou a justa, tinham razões mais puras em algumas notas e intervalos mais ásperos em outras. A <em>comma</em> pitagórica é o resto que sobra quando você empilha doze quintas e espera cair na mesma oitava. A matemática não fecha perfeitamente, e cada cultura decidiu onde esconder o resto.</p>
      <p>Toque a escada e compare doze semitons iguais com uma escala de razões simples. A diferença é pequena em cents, mas o ouvido treinado percebe. Escala é acordo, não descoberta.</p>
    `,
  },
  timbre: {
    kicker: "música · oficina dos timbres",
    title: "O mesmo dó, outra voz",
    date: "2026-03-03",
    read: "5 min",
    tags: ["timbre", "harmônicos", "fourier"],
    continent: "music",
    lab: "timbre",
    body: `
      <p>Um violino e uma flauta podem tocar a mesma nota na mesma altura e ainda assim soar completamente diferentes. A diferença está no <strong>timbre</strong>: a receita de harmônicos que acompanha a frequência fundamental. O violino tem muitos harmônicos e um ataque rápido; a flauta tem poucos e um sopro mais redondo.</p>
      <p>Fourier mostrou que qualquer som periódico é uma soma de senos em múltiplos inteiros da frequência fundamental. O que chamamos de "voz" de um instrumento é o peso relativo de cada um desses senos. Mude os pesos e você muda o instrumento sem mudar a nota.</p>
      <p>Na oficina, ligue e desligue harmônicos e ouça o mesmo dó virar órgão, clarinete ou algo que não existe. O ouvido reconhece o padrão, mesmo quando a nota é a mesma.</p>
    `,
  },
  generative: {
    kicker: "música · máquina de compor",
    title: "Música que se joga",
    date: "2026-02-24",
    read: "5 min",
    tags: ["algoritmos", "markov", "composição"],
    continent: "music",
    lab: "generative",
    body: `
      <p>Compor com regras não é novidade. Bach escreveu variações sobre padrões, Mozart propôs jogos musicais com dados e a música algorítmica do século XX virou campo de experimentação. A regra pode ser uma escala, uma simetria, uma cadeia de Markov ou uma gramática.</p>
      <p>Uma <strong>cadeia de Markov</strong> escolhe a próxima nota olhando apenas a nota atual e uma tabela de probabilidades. Não existe plano global, mas o resultado pode parecer intencional. É o mesmo princípio de um gerador de texto estatístico: o passado recente vira a única memória.</p>
      <p>A máquina desta estação tem uma tabela pequena e uma semente. Toque, mude a semente e veja o que muda. O compositor continua sendo você, mesmo quando delega a escolha.</p>
    `,
  },

  // ---------------- Inteligência Artificial ----------------
  learning: {
    kicker: "ia · praça dos dados",
    title: "A máquina que ajusta a reta",
    date: "2026-02-17",
    read: "6 min",
    tags: ["aprendizado", "regressão", "gradiente"],
    continent: "ai",
    lab: "learning",
    body: `
      <p>A forma mais simples de aprender é ajustar uma reta. Dados espalhados no plano, uma reta candidata e uma pergunta: quanto ela erra? A soma dos erros ao quadrado vira a <strong>função de perda</strong>. Aprender é mexer nos parâmetros para deixar essa perda menor.</p>
      <p>O <strong>gradiente descendente</strong> faz isso aos poucos. Calcula a inclinação do erro em relação a cada parâmetro e dá um passo na direção que diminui o erro. A taxa de aprendizado decide o tamanho do passo. Passo grande demais diverge; pequeno demais demora.</p>
      <p>Na praça, arraste os pontos ou deixe a máquina treinar. O objetivo não é decorar os pontos: é encontrar uma regra que também funcione para pontos que você ainda não viu. Essa diferença entre decorar e generalizar é o coração do aprendizado de máquina.</p>
    `,
  },
  neural: {
    kicker: "ia · torre das camadas",
    title: "Camadas de bolinhas",
    date: "2026-02-10",
    read: "6 min",
    tags: ["redes neurais", "backpropagation", "classificação"],
    continent: "ai",
    lab: "neural",
    body: `
      <p>Um neurônio artificial é uma soma ponderada seguida de uma decisão. Recebe números, multiplica por <strong>pesos</strong>, soma e passa o resultado por uma função de ativação. Sozinho, ele só desenha uma reta. Empilhado em camadas, passa a desenhar curvas e regiões.</p>
      <p>O treino compara a saída com a resposta certa, calcula o erro e usa o <strong>retropropagação</strong> para descobrir quanto cada peso contribuiu para o erro. O ajuste é pequeno e repetido. Não há mágica: há derivadas, muitas vezes derivadas de funções simples.</p>
      <p>A rede desta estação aprende a separar duas classes de pontos. Ela começa errando quase tudo e vai torcendo a fronteira. Quando acerta o treino mas erra o que nunca viu, temos overfitting: decorou a paisagem em vez de aprender o caminho.</p>
    `,
  },
  language: {
    kicker: "ia · fonte das palavras",
    title: "Palavras viram números",
    date: "2026-02-03",
    read: "6 min",
    tags: ["linguagem", "tokens", "llm"],
    continent: "ai",
    lab: "language",
    body: `
      <p>Um modelo de linguagem não lê letras como você. Ele corta o texto em <strong>tokens</strong>, pedaços de palavra ou de sílaba, e transforma cada token num vetor de números. A posição de cada vetor no espaço carrega relações de uso: "rei" fica perto de "rainha" de um jeito que "banana" não fica.</p>
      <p>Gerar texto é prever o próximo token. O modelo calcula uma distribuição de probabilidades sobre o vocabulário e escolhe uma continuação. Repetido muitas vezes, isso produz parágrafos que parecem intencionais. Não existe uma consulta a um banco de fatos: existe um padrão estatístico aprendido em textos.</p>
      <p>É por isso que modelos de linguagem podem alucinar com tanta segurança. A fonte desta estação mostra tokens e uma tabela de continuações de brinquedo. A lição é olhar a probabilidade, não a certeza.</p>
    `,
  },
  vision: {
    kicker: "ia · olho da máquina",
    title: "A imagem é uma grade",
    date: "2026-01-27",
    read: "5 min",
    tags: ["visão", "convolução", "imagem"],
    continent: "ai",
    lab: "vision",
    body: `
      <p>Para a máquina, uma imagem é uma grade de números. Cada pixel tem três canais: vermelho, verde e azul. A primeira camada de uma rede de visão não olha a imagem inteira de uma vez; ela desliza pequenos filtros pela grade, procurando bordas, cantos e texturas. Essa operação é a <strong>convolução</strong>.</p>
      <p>Um filtro de borda responde onde a intensidade muda de repente. Um filtro de desfoque média a vizinhança. Um filtro de nitidez realça a diferença entre um pixel e os vizinhos. Com camadas suficientes, o modelo combina bordas em olhos, olhos em rostos, rostos em objetos.</p>
      <p>Mude o kernel no olho da máquina e veja a mesma grade virar outra coisa. Visão computacional é isso: transformar pixels em features, e features em decisões.</p>
    `,
  },
  ethics: {
    kicker: "ia · sala do juízo",
    title: "O que a IA não sabe que não sabe",
    date: "2026-01-20",
    read: "6 min",
    tags: ["ética", "viés", "limites"],
    continent: "ai",
    lab: "ethics",
    body: `
      <p>Um modelo aprende com o que recebe. Se os dados carregam um preconceito, o modelo aprende o preconceito e o devolve com aparência de objetividade. Não é maldade da máquina: é o desenho do experimento, a escolha do conjunto de treino e a pergunta que foi feita.</p>
      <p>Há limites de outro tipo. Modelos de linguagem inventam com confiança, porque foram treinados para continuar texto plausível, não para consultar a verdade. Sistemas de recomendação otimizam engajamento, não bem-estar. E treinar modelos grandes consome energia, água e trabalho humano invisível na cadeia de dados.</p>
      <p>A sala do juízo propõe casos para você decidir onde está o problema: nos dados, no objetivo, na métrica ou na forma como a resposta é usada. Tecnologia não toma decisões morais sozinha. Alguém escolhe as perguntas.</p>
    `,
  },


  // ---------------- Vale da Língua ----------------
  words: {
    kicker: "vale da língua · praça das palavras",
    title: "A palavra antes da palavra",
    date: "2026-10-20",
    read: "5 min",
    tags: ["etimologia", "latim", "português"],
    continent: "lingua",
    lab: null,
    body: `
      <p>Palavra tem idade. "Escola" veio do grego <em>skholé</em>, que queria dizer ócio, o tempo livre de quem não precisava trabalhar com as mãos. "Página" veio do latim <em>pagina</em>, a folha escrita. "Algoritmo" carrega o nome de al-Khwarizmi, matemático persa do século IX. Nenhuma delas nasceu com o sentido de hoje.</p>
      <p>O português do Brasil é filho do latim, mas foi criado também por línguas indígenas e africanas. "Abacaxi", "mandioca" e "tapioca" vieram do tupi. "Samba", "caçula" e "moleque" vieram de línguas africanas. O vocabulário é um mapa de encontros, e nem todos foram escolhidos pelas pessoas que falavam.</p>
      <p>Quando você descobre a origem de uma palavra, ganha um atalho de memória. "Exceção" vem de <em>exceptio</em>, o ato de tirar de fora. "Concordância" vem de <em>concordia</em>, corações no mesmo lugar. A palavra antiga explica a regra moderna.</p>
      <blockquote>Quem sabe de onde a palavra veio entende melhor por que ela se escreve assim.</blockquote>
    `,
  },
  concord: {
    kicker: "vale da língua · oficina da concordância",
    title: "Sujeito e verbo precisam combinar",
    date: "2026-10-16",
    read: "4 min",
    tags: ["gramática", "concordância", "sintaxe"],
    continent: "lingua",
    lab: null,
    body: `
      <p>Concordância é o acordo entre as partes da frase. Se o sujeito está no plural, o verbo também vai: "os meninos chegaram". Se o sujeito é feminino, o adjetivo acompanha: "a casa velha". Parece simples até aparecer um sujeito comprido ou distante do verbo.</p>
      <p>Em "a lista de materiais chegou", o sujeito é "a lista", não "materiais". O núcleo manda: singular. Já "a maioria dos alunos foi" aceita "foi" porque o núcleo é "maioria"; com "a maioria dos alunos foram" a concordância é com a ideia de plural, e a norma culta prefere a primeira.</p>
      <p>Tem um caso brasileiro famoso: "a gente". A expressão virou sujeito de terceira pessoa do singular, então o certo é "a gente foi", e não "a gente fomos". A língua muda, mas a regra que o texto escrito cobra continua essa.</p>
      <blockquote>O verbo não adivinha o sujeito: ele concorda com o núcleo.</blockquote>
    `,
  },
  accents: {
    kicker: "vale da língua · mural dos acentos",
    title: "O acento é memória da pronúncia",
    date: "2026-10-12",
    read: "5 min",
    tags: ["ortografia", "acentuação", "hífen"],
    continent: "lingua",
    lab: null,
    body: `
      <p>O acento gráfico marca onde a voz pesa. Palavras proparoxítonas, com a força na antepenúltima sílaba, levam acento sempre: lâmpada, médico, ângulo. As paroxítonas, com a força na penúltima, levam acento quando terminam em certos sons, como fácil, órgão e série. As oxítonas, com a força na última, levam acento em terminações como café, caju e parabéns.</p>
      <p>Os monossílabos tônicos também: pá, pé, pó. E há acentos que existem para separar palavras parecidas, como "pôde" e "pode", "têm" e "tem". O acento ajuda a ler em voz alta uma língua que já foi escrita sem ele.</p>
      <p>O hífen é outra memória: guarda a história de uma palavra composta. "Passatempo" já se juntou; "guarda-chuva" ainda não. O acordo ortográfico de 1990 mudou casos, mas não a lógica: quando a composição se consolidou, a hifenização tende a cair.</p>
      <blockquote>Antes de acentuar, diga a palavra em voz alta. O corpo costuma saber.</blockquote>
    `,
  },
  genres: {
    kicker: "vale da língua · biblioteca dos gêneros",
    title: "Todo texto tem um lugar",
    date: "2026-10-08",
    read: "6 min",
    tags: ["literatura", "gêneros", "leitura"],
    continent: "lingua",
    lab: null,
    body: `
      <p>Gênero textual é a combinação entre forma, assunto e situação. Uma receita, uma notícia, um contrato e um poema organizam a linguagem de maneiras diferentes porque fazem coisas diferentes. Não existe texto sem gênero; existe texto cujo gênero você ainda não reconheceu.</p>
      <p>A literatura é um gênero amplo, com subgêneros. <em>Dom Casmurro</em> é romance; as crônicas de Clarice Lispector são textos curtos de jornal que viram literatura; um cordel é poema narrativo popular. Machado de Assis escreveu quase de tudo, e cada forma pedia um jeito de ler.</p>
      <p>A crônica talvez seja o gênero mais brasileiro: nasceu no jornal, fala do cotidiano e cabe em uma coluna. Ela parece simples porque é curta, mas exige uma observação que quase ninguém faz. Ler gêneros diferentes é aprender os atalhos que cada um oferece.</p>
      <blockquote>O texto tem lugar, voz e destino. Saber o gênero é saber com quem se está falando.</blockquote>
    `,
  },
  crase: {
    kicker: "vale da língua · sala da crase",
    title: "O a que vira à",
    date: "2026-10-04",
    read: "5 min",
    tags: ["crase", "regência", "sintaxe"],
    continent: "lingua",
    lab: null,
    body: `
      <p>Crase é o encontro de duas vogais iguais: a preposição "a" com o artigo "a". Escreve-se "à" com acento grave. "Entreguei o documento à diretora" tem preposição exigida pelo verbo entregar e artigo que acompanha diretora. Sem o artigo, não há crase: "entreguei o documento a ela", porque ela não aceita artigo.</p>
      <p>O teste do masculino resolve a maioria dos casos. Se a frase fica natural com "ao", cabe "à": "vou à escola" porque "vou ao colégio". Se fica natural com "a um" ou "para a", cuidado: não é o mesmo encontro. E nomes de lugar, quando vêm sem artigo, não levam acento: "vou a Brasília", mas "volto da Bahia, vou à Bahia".</p>
      <p>A crase também aparece com horas: "às oito". E desaparece quando o verbo não exige a preposição: "cantei a música" não tem crase, porque a música é objeto direto. A regra não é decorar uma lista: é perguntar quem exige a preposição.</p>
      <blockquote>Se dá para trocar por "ao", o "à" está no lugar.</blockquote>
    `,
  },

  // ---------------- Física · eletromagnetismo ----------------
  induction: {
    kicker: "física · oficina da indução",
    title: "A corrente que nasce do movimento",
    date: "2026-09-28",
    read: "5 min",
    tags: ["eletromagnetismo", "indução", "faraday"],
    continent: "physics",
    lab: null,
    body: `
      <p>Em 1831, Faraday aproximou e afastou um ímã de uma bobina com um galvanômetro ligado. Quando o ímã ficava parado, a agulha não mexia. Quando se movia, a agulha pulava. Não era o ímã: era a <strong>variação</strong> do fluxo magnético atravessando a espira.</p>
      <p>Essa é a indução. O campo magnético mudando no tempo gera um campo elétrico que empurra elétrons. O sinal não importa: o que importa é variar. Por isso o gerador gira a bobina em vez de só aproximá-la uma vez.</p>
      <p>A mesma regra explica o transformador: corrente alternada no primário cria fluxo variável no núcleo, e o secundário responde com outra tensão. Uma usina, um carregador de celular e um freio regenerativo trabalham com essa ideia.</p>
      <blockquote>Ímã parado não faz corrente. É o movimento que chama o elétron.</blockquote>
    `,
  },
  maxwell: {
    kicker: "física · torre de maxwell",
    title: "A luz é uma onda de campos",
    date: "2026-09-24",
    read: "6 min",
    tags: ["maxwell", "luz", "ondas"],
    continent: "physics",
    lab: null,
    body: `
      <p>As equações de Maxwell dizem, em quatro linhas, que campo elétrico variando gera campo magnético e campo magnético variando gera campo elétrico. Isso já permite uma onda que se sustenta sozinha, até no vácuo, sem precisar de corda nem de ar para sacudir.</p>
      <p>Quando Maxwell calculou a velocidade dessa onda com números de laboratório, encontrou algo perto de 300 mil quilômetros por segundo. Já se sabia a velocidade da luz. A conclusão caiu no colo: a luz é essa onda. Rádio, micro-ondas, infravermelho, luz visível, ultravioleta e raios X são a mesma coisa em frequências diferentes.</p>
      <p>A luz visível ocupa uma fatia finíssima desse espectro. O olho humano enxerga entre cerca de 400 e 700 nanômetros; a maior parte do eletromagnetismo é invisível e faz tanto barulho quanto um rádio fora da estação.</p>
      <blockquote>O céu inteiro é uma conversa de campos. Os olhos ouviram só uma faixa.</blockquote>
    `,
  },

  // ---------------- Computação · arquitetura ----------------
  pipeline: {
    kicker: "computação · sala do pipeline",
    title: "O ciclo que não para",
    date: "2026-09-20",
    read: "5 min",
    tags: ["arquitetura", "pipeline", "processador"],
    continent: "cs",
    lab: null,
    body: `
      <p>Toda instrução passa por um ciclo: buscar, decodificar, executar e gravar o resultado. Se cada etapa esperasse a anterior terminar, a CPU passaria a maior parte do tempo parada. O <strong>pipeline</strong> resolve isso deixando etapas de instruções diferentes rodarem ao mesmo tempo.</p>
      <p>Enquanto a instrução 1 executa, a 2 decodifica e a 3 busca. É como uma linha de montagem: o carro não fica pronto mais rápido, mas um carro sai por minuto em vez de um por hora. O ganho depende de manter a linha cheia.</p>
      <p>O problema aparece no desvio: se a instrução 3 é um salto, as instruções já buscadas podem estar erradas. O processador aposta num caminho e, se errar, descarta o trabalho. Quem programa pensando em previsão de desvio economiza ciclos sem perceber.</p>
      <blockquote>A linha anda mesmo quando você não vê: cada etapa trabalha numa instrução diferente.</blockquote>
    `,
  },
  registers: {
    kicker: "computação · oficina dos registradores",
    title: "O lugar onde o número mora",
    date: "2026-09-16",
    read: "5 min",
    tags: ["memória", "registradores", "cache"],
    continent: "cs",
    lab: null,
    body: `
      <p>Existe uma escada de memória no computador. Os registradores ficam dentro da CPU e respondem no mesmo ciclo; a cache fica ao lado e responde em poucos ciclos; a memória principal demora dezenas; o disco, milhões. Quanto mais perto, menor e mais caro.</p>
      <p>O programa tenta manter perto o que usa agora. É por isso que percorrer uma lista em ordem costuma ser mais rápido do que pular de um lado para o outro: a cache traz blocos inteiros, e o próximo item já vem junto.</p>
      <p>Na arquitetura de Von Neumann, dados e instruções dividem a mesma memória e o mesmo barramento. Isso é simples e flexível, mas cria um gargalo: a CPU consegue calcular mais rápido do que consegue buscar. A cache é a resposta prática para esse gargalo.</p>
      <blockquote>Memória é distância. Todo desempenho nasce de encurtar a distância entre a conta e o número.</blockquote>
    `,
  },

  // ---------------- Matemática · análise ----------------
  limits: {
    kicker: "matemática · torre dos limites",
    title: "O valor que ninguém alcança",
    date: "2026-10-06",
    read: "6 min",
    tags: ["análise", "limite", "continuidade"],
    continent: "math",
    lab: null,
    body: `
      <p>A pergunta que fundou a análise não é "quanto vale no ponto", e sim "para onde a função vai quando chega perto". Em x igual a 2, a função (x² - 4)/(x - 2) nem existe: dá zero dividido por zero. Mas para x perto de 2 ela vale x + 2 disfarçado, e se aproxima de 4. O limite é 4, mesmo sem a função existir ali.</p>
      <p>Essa distinção parece preciosismo e é a base do cálculo. Derivada é limite de uma razão de variações. Integral é limite de uma soma de retângulos. Sem saber para onde as coisas vão, não se mede velocidade instantânea nem área de curva.</p>
      <p>A definição rigorosa troca a intuição por um jogo de tolerâncias. Para todo épsilon maior que zero existe um delta maior que zero tal que, se x está a menos de delta do ponto, f(x) está a menos de épsilon do limite. Épsilon é a margem que você aceita no resultado; delta é o quanto precisa se aproximar na entrada para garantir aquela margem. Quem vence o jogo para qualquer épsilon ganha o direito de dizer "o limite é L".</p>
      <p>Com isso, continuidade fica fácil de enunciar: a função é contínua no ponto quando o limite existe, a função existe ali e os dois coincidem. O gráfico não pula. É a diferença entre uma estrada e uma escada.</p>
      <blockquote>O limite não pergunta onde você chegou. Pergunta para onde você estava indo.</blockquote>
    `,
  },
  series: {
    kicker: "matemática · sala das séries",
    title: "Somar para sempre e chegar a algum lugar",
    date: "2026-10-02",
    read: "6 min",
    tags: ["análise", "séries", "convergência"],
    continent: "math",
    lab: null,
    body: `
      <p>Somar infinitos números parece pedir uma resposta infinita, mas nem sempre. Some 1/2, depois 1/4, depois 1/8, e assim por diante. Cada metade que falta é preenchida pela seguinte: a soma se aproxima de 1 e nunca passa. A série converge.</p>
      <p>Agora troque por 1 + 1/2 + 1/3 + 1/4. Os termos também vão a zero, e no entanto a soma cresce sem parar. Essa é a série harmônica, e ela diverge. Termo indo a zero não garante convergência: é a condição mais fácil de checar, e a mais fraca.</p>
      <p>Por isso existem critérios. Comparar com uma série geométrica resolve muita coisa. O critério da razão olha o tamanho do termo seguinte sobre o atual. O critério da integral troca a soma por uma área. Nenhum deles é receita universal: cada um funciona numa família de casos, e o analista escolhe o que serve.</p>
      <p>Para o jogo, a lição é a mesma do resto da matemática: o infinito não é um lugar distante, é um processo. Dá para dizer com precisão o que acontece quando ele continua, e é isso que separa "mais ou menos 1" de "converge para 1".</p>
      <blockquote>Infinitas parcelas podem caber num número finito. O contrário também, e é aí que a coisa fica interessante.</blockquote>
    `,
  },

  // ---------------- Química · orgânica ----------------
  carbon: {
    kicker: "química · forja do carbono",
    title: "O átomo que segura quatro coisas",
    date: "2026-09-12",
    read: "5 min",
    tags: ["orgânica", "carbono", "ligações"],
    continent: "chem",
    lab: null,
    body: `
      <p>Carbono tem quatro elétrons na camada de valência. Em vez de perder ou ganhar quatro de uma vez, ele prefere compartilhar: faz quatro ligações covalentes e fica estável. Essa obsessão por quatro é a razão de a vida ser possível.</p>
      <p>Com quatro mãos, o carbono monta cadeias. Cada carbono pode se ligar a outros carbonos, formando filas, ramos e anéis. O metano tem um carbono; o octano tem oito em fila; o grafite tem camadas inteiras; o diamante tem uma rede tridimensional. Mesmo elemento, arranjos diferentes, propriedades completamente diferentes.</p>
      <p>A cadeia ganha personalidade quando outros átomos entram. Um oxigênio ligado a um hidrogênio vira álcool; um oxigênio com dupla ligação vira cetona; um nitrogênio vira amina. São os grupos funcionais. Não é decoreba: o grupo decide o cheiro, a solubilidade e a reação.</p>
      <p>Por isso química orgânica é menos "química do carbono" e mais "química das combinações de carbono". O mesmo esqueleto pode aparecer como açúcar, gordura, proteína ou perfume, só trocando a roupa dos grupos funcionais.</p>
      <blockquote>Quatro ligações, infinitas cadeias. O carbono nunca precisou de mais que isso.</blockquote>
    `,
  },
  polymers: {
    kicker: "química · salão dos polímeros",
    title: "A cadeia que vira plástico e a que vira você",
    date: "2026-09-08",
    read: "6 min",
    tags: ["polímeros", "orgânica", "materiais"],
    continent: "chem",
    lab: null,
    body: `
      <p>Um polímero é uma cadeia longa feita de unidades pequenas repetidas, os monômeros. Eteno vira polietileno; estireno vira isopor e copinho; aminoácidos viram proteína. A ideia é sempre a mesma: repetir um bloco até o conjunto ganhar propriedades que o bloco sozinho não tinha.</p>
      <p>Existem dois jeitos principais de montar. Na adição, os monômeros com dupla ligação se abrem e se ligam sem liberar nada. Na condensação, cada união libera uma molécula pequena, quase sempre água. O polietileno é adição; o poliéster e o náilon são condensação.</p>
      <p>Rigidez, elasticidade e ponto de fusão vêm do empilhamento e dos ramos. Cadeias muito lineares se acomodam ordenadas e formam plásticos resistentes. Cadeias ramificadas embolam e amolecem cedo. A mesma matéria-prima pode virar sacola fina ou cano grosso só mudando a receita.</p>
      <p>A natureza inventou isso antes da indústria. Celulose, proteína, DNA e borracha natural são polímeros. A diferença é que a natureza também aprendeu a desmontar os seus. O plástico comum levou décadas para isso, e é o problema que a reciclagem tenta contornar.</p>
      <blockquote>Repita o bloco mil vezes e ele deixa de ser bloco. Vira substância.</blockquote>
    `,
  },

  // ---------------- Música · acústica ----------------
  acoustics: {
    kicker: "música · câmara acústica",
    title: "Todo corpo tem uma nota que ele gosta",
    date: "2026-09-30",
    read: "5 min",
    tags: ["acústica", "ressonância", "ondas"],
    continent: "music",
    lab: null,
    body: `
      <p>Bata num copo e ele toca uma nota. Mude a quantidade de água e a nota muda. Todo corpo tem frequências naturais, aquelas em que vibra com pouca energia e muita amplitude. Quando um som chega perto de uma delas, o corpo responde junto: é a ressonância.</p>
      <p>O fenômeno não é exclusivo de instrumento. Ponte, prédio, taça de cristal e até a caixa do violão têm modos naturais. Uma força pequena, repetida no ritmo certo, acumula energia a cada ciclo. É por isso que cantor de voz potente quebra taça sem tocar nela.</p>
      <p>Atrás disso estão as ondas estacionárias. Numa corda presa nas duas pontas, as pontas são nós fixos: só cabem padrões em que um número inteiro de meias ondas cabe no comprimento. Essas são as frequências harmônicas, múltiplos da fundamental. O mesmo raciocínio vale para tubos, com nós e ventres nas pontas certas.</p>
      <p>Sala também ressoa. Reflexões atrasadas viram eco ou reverberação; frequências que a sala favorece soam mais altas que as outras. A sala anecoica faz o contrário: absorve tudo e deixa o som nu, sem a assinatura do lugar.</p>
      <blockquote>Ressoar não é gritar mais alto. É chegar no ritmo certo.</blockquote>
    `,
  },
  instruments: {
    kicker: "música · oficina dos instrumentos",
    title: "Corda, tubo e pele: três jeitos de mexer o ar",
    date: "2026-09-26",
    read: "6 min",
    tags: ["instrumentos", "acústica", "timbre"],
    continent: "music",
    lab: null,
    body: `
      <p>Instrumentos de corda funcionam com cordas esticadas. Mais tensão, mais agudo. Mais comprimento, mais grave. Mais massa por metro, mais grave ainda. O violão aperta a corda com o dedo para encurtar o comprimento; o piano usa martelo e cordas de espessuras diferentes.</p>
      <p>Instrumentos de sopro usam a coluna de ar dentro de um tubo. Num tubo aberto nas duas pontas, cabem meias ondas; fechado numa ponta, cabem quartos ímpares. Por isso clarinete e flauta têm dedilhados e extensões diferentes apesar de serem ambos tubos.</p>
      <p>Percussão usa membrana ou barra. A membrana tem modos próprios, e o tambor não produz uma nota limpa: produz um conjunto de frequências que decai em tempos diferentes. É essa mistura que dá o ataque seco e o corpo do som.</p>
      <p>O timbre nasce daí: quais harmônicos aparecem, com que força, e como o som começa e termina. Um violino e uma flauta tocando a mesma nota diferem no conteúdo harmônico e no envelope. A altura é uma só; a identidade é a mistura.</p>
      <blockquote>Três famílias, um objetivo: perturbar o ar de um jeito que o ouvido reconheça.</blockquote>
    `,
  },

  // ---------------- IA · visão ----------------
  convolution: {
    kicker: "ia · sala da convolução",
    title: "A imagem é uma grade de números",
    date: "2026-09-22",
    read: "6 min",
    tags: ["visão", "convolução", "redes"],
    continent: "ai",
    lab: null,
    body: `
      <p>Para o computador, uma foto não é uma cena: é uma grade de números. Cada pixel guarda a intensidade de vermelho, verde e azul. Uma imagem de 1920 por 1080 tem mais de dois milhões de posições, cada uma com três valores. O desenho que você vê é uma interpretação, não o dado.</p>
      <p>A primeira camada de uma rede de visão costuma ser uma convolução. Um filtro pequeno, o kernel, desliza pela grade e calcula uma soma ponderada da vizinhança. Um kernel que compara vizinhos na horizontal destaca bordas verticais; outro destaca texturas; outro borra. A rede aprende os valores do kernel em vez de alguém desenhá-los.</p>
      <p>Depois vem o pooling, que resume regiões e reduz a resolução. A rede perde detalhe fino e ganha campo de visão. Empilhando convolução, ativação e pooling, as primeiras camadas veem bordas e as últimas veem partes de objeto. É a hierarquia da visão em camadas.</p>
      <p>Isso não é o olho humano. O olho faz varredura, ajusta foco, compensa luz e usa contexto. A rede recebe uma grade fixa e procura padrões estatísticos. Funciona muito bem em muitos casos e falha de um jeito que a gente não falha, o que é justamente o assunto interessante.</p>
      <blockquote>Antes de enxergar, a máquina aprende a ler a grade.</blockquote>
    `,
  },
  detection: {
    kicker: "ia · torre da detecção",
    title: "Enxergar é apontar e nomear",
    date: "2026-09-18",
    read: "6 min",
    tags: ["visão", "detecção", "segmentação"],
    continent: "ai",
    lab: null,
    body: `
      <p>Classificar uma imagem responde uma pergunta só: o que é isto? Detectar responde duas: o que é e onde está. A saída vira uma caixa em volta do objeto, com coordenadas e uma classe. Uma foto pode ter várias caixas, e o trabalho é decidir quais ficam.</p>
      <p>Os modelos modernos propõem muitas caixas candidatas e pontuam cada uma. Depois descartam as sobrepostas com pouca diferença, num passo de supressão. O critério de sobreposição compara a área da interseção com a da união. Duas caixas quase iguais contam como a mesma detecção.</p>
      <p>Segmentação vai além da caixa: separa o contorno de cada objeto, pixel por pixel. É mais caro e mais preciso, e é o que permite contar pessoas numa multidão ou medir uma área numa imagem médica.</p>
      <p>O limite aparece quando o modelo vê o que não existe. Uma textura que parece olho, um reflexo que parece placa, uma combinação de pixels que ativa a classe errada. A alucinação não é falha de ótica: é a estatística respondendo com confiança a um padrão que só ela vê.</p>
      <blockquote>Detectar é dizer o que e onde. Confiar é outra pergunta, e não vem no mesmo pacote.</blockquote>
    `,
  },
};

export const NPCS = {
  guia: {
    name: "Dona Zefa",
    lines: [
      "Bem-vindo ao Porto. Sete continentes, mais terra do que os olhos acreditam.",
      "Cada farol da doca acende uma Pedra do Porto. Aperte F nas pedras para voltar rápido.",
      "O diário guarda o que você já viu. Não precisa decorar nada.",
      "Ao lado de cada acampamento de caça tem uma boca de caverna. Lá embaixo o bicho não espera você apertar F: ele vê primeiro.",
      "Na cidade do fundo tem forja, horta, mesa de encanto e um bicho. Nada é de graça: tudo cobra material.",
      "Cada continente tem duas bocas de caverna. A escada do fundo sai na outra. É o túnel que liga as duas.",
      "Complete as cinco estações de um continente e o traje dele abre na Ficha. Roupa é escolha, não prêmio de força.",
    ],
  },
  ada: {
    name: "Ada",
    lines: [
      "Um somador é só uma frase feita de fios. Aprenda a ler a frase e o processador inteiro começa a fazer sentido.",
      "A memória do circuito é o que separa contar de lembrar.",
      "A boca de pedra ao lado do acampamento desce fundo. Lá embaixo o Bit não espera você apertar F: ele sente primeiro.",
      "O baú da caverna às vezes guarda uma chave de fenda longa. Equipe na Ficha: a arma soma dano, não resolve a pergunta.",
      "O olho vê longe e estreito. Chegue por trás e ele continua olhando o corredor vazio.",
    ],
  },
  hypatia: {
    name: "Hypatia",
    lines: [
      "Não tenha pressa no infinito. Ele não tem pressa com você.",
      "A curva que você vê é um acordo entre uma fórmula e a tela. A fórmula é a parte que importa.",
      "A caverna dos números guarda o infinito num poço. Não fique olhando por muito tempo.",
      "Um desvio no meio do túnel não é enfeite: é onde o lema te espera de lado.",
      "A espada da prova corta o problema em casos menores. O primeiro caso é sempre ler o enunciado.",
    ],
  },
  marie: {
    name: "Marie",
    lines: [
      "Mude a velocidade de lançamento e veja o corpo cair ou escapar. A órbita mora num intervalo muito estreito.",
      "Uma medida é sempre uma conversa entre o mundo e o instrumento. O instrumento nunca é mudo.",
      "A caverna mede o que a luz faz no escuro. Leve tocha, e desconfie do que ela ilumina.",
      "O corredor largo é uma arena. O estreito é uma armadilha. Escolha a pergunta antes de escolher o caminho.",
      "As lentes de prisma protegem os olhos e separam a luz. A física é isso: olhar de novo com outro instrumento.",
    ],
  },
  pythagoras: {
    name: "Pitágoras",
    lines: [
      "O som é número se movendo. Razões pequenas soam bem porque as ondas se encontram com frequência.",
      "Uma oitava é 2 para 1. Não inventei isso: o ar já sabia.",
      "O conservatório embaixo da terra tem acústica de pedra. Os monstros chamam aquilo de dissonância.",
      "A serpente do túnel marca o compasso. Se você correr no contratempo, ela ouve.",
      "A casaca de harmonia tem bolso para partitura e para o medo. Os dois cabem.",
    ],
  },
  turing: {
    name: "Turing",
    lines: [
      "A pergunta interessante não é se a máquina pensa. É o que ela consegue fazer com o que recebeu.",
      "Dados ruins produzem confiança boa. É a combinação mais perigosa que existe.",
      "A rede profunda é uma cidade que aprende sozinha. Não confie no que ela diz que lembra.",
      "O corredor estreito é o preferido da aranha. Um passo largo e você já está na teia.",
      "O cajado de vetores aponta o gradiente. Ele não promete que a descida é curta.",
    ],
  },
  mendeleev: {
    name: "Mendeleev",
    lines: [
      "Eu deixei buracos na tabela e apostei que eles seriam ocupados. Dois foram. A natureza me devia essa.",
      "Se você entende por que uma coluna se parece por dentro, já entende metade da química.",
      "A mina tem cristal de veio. A forja da cidade subterrânea transforma o veio em chave.",
      "O avental de alquimista já viu reação que deu errado. É por isso que ele é grosso.",
      "No cruzamento dos túneis, a química muda de lado. O equilíbrio também.",
    ],
  },
  teo: {
    name: "Velho Téo",
    lines: [
      "O casco do barco é de ferro e a vela é de tecido. O que empurra é o mesmo que empurra pergunta: uma força que você não vê.",
      "Repare que cada caverna tem duas bocas. Uma perto do acampamento, outra do outro lado do túnel. Descer por uma é subir pela outra.",
      "A cidade lá embaixo vive de troca: você leva veio, ferro e erva, e volta com pão, runa e encanto. Ninguém usa moeda.",
      "O gato do porto já viu mais expedição partir do que eu. Ele dorme no mesmo lugar e nunca perde a hora.",
      "Se a lanterna apagar no meio do corredor, não corra. Pare, ouça e volte pelo caminho que ainda lembra.",
    ],
  },
  grace: {
    name: "Grace",
    lines: [
      "Programa bom é programa que qualquer pessoa consegue ler de novo. O compilador aceita o resto, a manutenção não.",
      "Antes de perguntar por que o código quebrou, pergunte qual foi a última coisa que você mexeu. Quase sempre é essa.",
      "Um teste que nunca falhou não é um bom teste. É um teste que ninguém sabe se está vivo.",
      "A matilha da caverna é como chamada de função com vários argumentos: se um falha, os outros continuam rodando.",
      "O Chip de Silício é areia que aprendeu a responder sim ou não. O resto é repetição bem feita.",
    ],
  },
  euclides: {
    name: "Euclides",
    lines: [
      "Ponto é o que não tem parte. Parece pouco, mas toda a geometria começa aí.",
      "Quando a prova embolar, volte às definições. O erro quase nunca está no passo difícil, está no passo que você pulou.",
      "Duas retas paralelas não se encontram. Se encontrarem, uma das duas não era reta ou o mundo não era este.",
      "O infinito não é um lugar grande. É uma regra que nunca pede para parar.",
      "A régua áurea não tem marcação porque a razão está na proporção, não nos riscos.",
    ],
  },
  galileu: {
    name: "Galileu",
    lines: [
      "Não acredite no que eu digo. Vá lá e meça. A natureza responde melhor a instrumento do que a opinião.",
      "Duas bolas de pesos diferentes caem quase juntas. O quase é o ar atrapalhando a experiência.",
      "A lua tem manchas e a mancha é montanha. O céu deixou de ser perfeito no dia em que alguém apontou um tubo para ele.",
      "O prisma separa a luz porque cada cor atravessa o vidro com um desvio diferente. Nada de mágica.",
      "O pêndulo não se importa com a cor do peso, só com o comprimento e a gravidade. Anote isso antes de esquecer.",
    ],
  },
  lavoisier: {
    name: "Lavoisier",
    lines: [
      "Na natureza nada se cria e nada se perde: tudo se transforma. O que sobra de um lado aparece do outro.",
      "Se a reação esquenta sozinha, ela está devolvendo energia que guardou nos reagentes.",
      "O catalisador não entra na conta final. Ele abre caminho e sai como entrou.",
      "O cristal de equilíbrio se mexe quando a concentração muda. É a tabela respondendo ao que você fez.",
      "Cuidado com o frasco ácido da caverna. Ele abre caminho e estraga ideia teimosa, mas não é bebida.",
    ],
  },
  bach: {
    name: "Bach",
    lines: [
      "A voz de cima canta, a de baixo responde, e as duas cabem na mesma regra. Isso é contraponto.",
      "O silêncio entre duas notas é tão medido quanto as notas. Quem não conta o silêncio atrasa a frase.",
      "O cravo bem temperado resolveu uma briga antiga: doze teclas que soam quase certas em todas as tonalidades.",
      "Uma oitava dobra a frequência. Uma quinta multiplica por três meios. A música já era matemática antes de ter nome.",
      "A dissonância não é erro. É tensão pedindo resolução. O monstro do conservatório também pede.",
    ],
  },
  alzira: {
    name: "Professora Alzira",
    lines: [
      "Bem-vindo ao Vale da Língua. Aqui a gente estuda a língua que a gente usa para estudar todo o resto.",
      "O som vira sílaba, a sílaba vira palavra, a palavra vira frase e a frase vira texto. Cada estação segue um pedaço desse caminho.",
      "A crase parece pequena e resolve muita briga. Se eliminar o a fica estranho, provavelmente é preposição; se fica normal, pode ser artigo.",
      "Ler gêneros diferentes é aprender atalhos. Uma crônica de jornal cabe em uma coluna e precisa ser lida devagar.",
      "O latim não morreu: ele aparece toda vez que você pergunta por que uma palavra se escreve assim.",
    ],
  },
  "trainer-lingua": {
    name: "Mestre Camilo",
    lines: [
      "Treinar aqui é de graça. Na grota, a mesma pergunta cobra vida e paga item.",
      "Comece pela concordância: acertar o plural do sujeito resolve metade das pegadinhas.",
      "A querida crase só é difícil quando a gente esquece de perguntar quem pede a preposição.",
    ],
  },
  faraday: {
    name: "Faraday",
    lines: [
      "Aqui a gente não decora as quatro equações: mexe na bobina e vê a agulha mexer.",
      "Ímã parado não faz nada. É quando o fluxo varia que a corrente aparece. Tente aí.",
      "Quem trabalha com corrente leva choque, então o escudo de capacitor não é enfeite.",
      "O transformador tem duas bobinas e nenhum contato entre elas. Só o fluxo atravessa.",
      "A luz daqui do vale é só uma faixa pequena do que o campo faz. A torre mede o resto.",
    ],
  },
  "trainer-physics-em": {
    name: "Técnica Ampere",
    lines: [
      "Treino de corrente aqui, no claro e sem susto. A grota é que paga.",
      "Comece pela corrente induzida: é a pergunta que mais aparece.",
      "Se errar não mexe em nada além do orgulho. Destrave o caminho sem perder item.",
    ],
  },
  vonneumann: {
    name: "Von Neumann",
    lines: [
      "Dados e instruções morando na mesma memória: simples de descrever, difícil de alimentar. Esse é o gargalo que leva meu nome.",
      "O registrador é o lugar mais rápido da máquina. Se o número está lá, a conta sai neste ciclo.",
      "Pipeline não deixa a instrução mais rápida. Deixa a linha de montagem andar sem vazio.",
      "Quando o desvio engana a previsão, o processador joga fora o trabalho que já tinha buscado. Programas com caminhos previsíveis voam.",
      "A cache é pequena de propósito: guardar tudo perto seria caro e lento. O truque é guardar o que acabou de ser usado.",
    ],
  },
  "trainer-cs-arch": {
    name: "Técnica Lovelace",
    lines: [
      "Treino de arquitetura é aqui, no claro. A galeria cobra caro por erro de cache.",
      "Comece pelo ciclo de instrução: buscar, decodificar, executar. O resto encaixa.",
      "Se travar, pense no endereço. Toda memória tem um, e a pergunta também.",
    ],
  },
  cauchy: {
    name: "Cauchy",
    lines: [
      "Meu nome ficou colado em dois negócios: o critério de convergência e a definição de limite. Os dois começam com a mesma ideia de tolerância.",
      "Um limite não precisa ser alcançado. Precisa ser perseguido de perto o bastante, para qualquer margem que você aceite.",
      "Se a série dos módulos converge, a série original converge também. Se ela diverge, não quer dizer que a outra divirja: é só o teste que não decidiu.",
      "Cuidado com a ordem das operações. Trocar limite e soma sem justificar já custou a cabeça de muita gente boa.",
      "Aqui do lado fica a estação dos épsilons. Lá dentro, a margem é o próprio chão: escolha errada e a ponte não aparece.",
    ],
  },
  "trainer-math-analysis": {
    name: "Mestre Weierstrass",
    lines: [
      "Treino de análise aqui, no claro e sem soma infinita cobrando juros. O vale é que cobra.",
      "Comece pela definição de limite: é a pergunta que sustenta quase todas as outras.",
      "Série geométrica é o teste mais fácil de aplicar e o mais fácil de esquecer a razão certa.",
    ],
  },
  kekule: {
    name: "Kekulé",
    lines: [
      "O benzeno me apareceu como uma cobra mordendo a própria cauda. Pode rir: o desenho do anel está naquela imagem até hoje.",
      "As seis ligações pi do anel não ficam alternando entre duas posições. Elas se espalham, e por isso o benzeno é simétrico.",
      "Isômero é fórmula igual, arranjo diferente. É como trocar as peças de lugar sem trocar o número de peças.",
      "Carbono com quatro grupos diferentes ganha duas versões que não se sobrepõem, como mão esquerda e direita. Isso é quiralidade.",
      "A forja ao lado trabalha esse carbono quiral. Se a cadeia enrolar errado, ela acerta a pergunta.",
    ],
  },
  "trainer-chem-organic": {
    name: "Mestra Wöhler",
    lines: [
      "Treino de orgânica é aqui, no claro e de jaleco. O bosque é que cobra.",
      "Comece pela tetravalência: sabendo que o carbono faz quatro ligações, a metade das perguntas se resolve.",
      "Não confunda grupo funcional com cadeia. A cadeia é o esqueleto; o grupo é o tempero.",
    ],
  },
  helmholtz: {
    name: "Helmholtz",
    lines: [
      "Fiz um resonador de vidro para provar que o ouvido decompõe o som. Cada esfera respondia a uma faixa estreita.",
      "Ressonância é energia entrando no ritmo certo. Pequena por ciclo, enorme depois de muitos ciclos.",
      "Duas notas quase iguais produzem batimento: a diferença vira uma pulsação lenta. Afine pelo batimento e ele some.",
      "A câmara logo ali foi construída para não devolver nada. O silêncio de dentro é mais estranho que qualquer acorde.",
      "Se a onda estacionária te enrolar, conte os nós. Cada nó é uma ponta que não se mexe.",
    ],
  },
  "trainer-music-acoustics": {
    name: "Mestre Fourier",
    lines: [
      "Treino de acústica aqui, no claro e sem eco atrapalhando. A câmara é que cobra.",
      "Toda onda complicada é soma de senos. Quebre o som em partes e a pergunta fica mais simples.",
      "Ressonância é a pergunta que mais aparece. Decore a condição: frequência excitadora igual à natural.",
    ],
  },
  marr: {
    name: "Marr",
    lines: [
      "Visão é processar informação, não tirar fotografia. A pergunta certa é: que problema o olho resolve e com que conta?",
      "Comece pelas bordas. Elas são mudanças bruscas de intensidade, e quase todo o resto é construído em cima delas.",
      "Há três níveis: o que o sistema faz, como faz e onde isso roda no tecido. Misturar os três é o jeito mais rápido de não entender nenhum.",
      "A câmara escura ao lado transforma luz em número. O que a máquina vê depois é estatística, não cena.",
      "Quando a rede alucina, ela está respondendo com confiança a um padrão que só existe para ela. Isso também ensina sobre o nosso olho.",
    ],
  },
  "trainer-ai-vision": {
    name: "Mestre Rosenblatt",
    lines: [
      "Treino de visão aqui, no claro e com imagem parada. A câmara é que cobra.",
      "Comece pela convolução: kernel pequeno, desliza, soma, destaca borda. O resto é empilhar.",
      "Detecção não é classificação com nome maior. Precisa da caixa, não só da classe.",
    ],
  },
  shannon: {
    name: "Shannon",
    lines: [
      "Informação é o que reduz incerteza. Uma pergunta boa tira muita dúvida de uma vez.",
      "Nove acertos óbvios valem menos que um acerto difícil. Escolha onde colocar a atenção.",
      "Uma sequência aleatória não comprime. Um padrão comprime. É assim que se separa ruído de mensagem.",
      "O modelo aprende o que foi dado a ele, inclusive o que ninguém queria ensinar.",
      "Token é pedaço de palavra. Leia a pergunta em pedaços e a resposta fica menos misteriosa.",
    ],
  },
  "trainer-cs": {
    name: "Técnica Lúcia",
    lines: [
      "A superfície é sala de aula. O bicho de verdade mora na caverna; aqui a gente erra sem perder vida.",
      "Treine o que a ilha ensina: lógica, memória, tempo e algoritmo. A pergunta que você acerta aqui é a que você revê lá embaixo.",
      "Quando estiver pronto, desça pela boca ao lado. O treino não dá loot, mas dá consciência.",
    ],
  },
  "trainer-math": {
    name: "Mestre Vetor",
    lines: [
      "Um treino de matemática não é decorar a resposta: é reconhecer a forma da pergunta.",
      "Aqui você pode errar à vontade. A caverna dos números é logo ali, e ela não perdoa pressa.",
      "Primos, limites, geometria e infinito. Escolha o que dói menos e comece por ele.",
    ],
  },
  "trainer-physics": {
    name: "Instrutora Íris",
    lines: [
      "A luz, o calor e a queda não têm pressa. Você também não precisa ter.",
      "Treine a unidade antes do número. A maioria dos erros mora aí.",
      "Lá embaixo o campo é mais denso. Suba de nível aqui primeiro.",
    ],
  },
  "trainer-chem": {
    name: "Mestre Alquimista",
    lines: [
      "Reação é conversa: alguém cede, alguém recebe, alguém muda de cor.",
      "O treino é o cadinho. Erre aqui, acerte na mina.",
      "A mina cobra equilíbrio e paciência; a forja cobra material.",
    ],
  },
  "trainer-music": {
    name: "Maestro Tom",
    lines: [
      "Ritmo é expectativa. Você aprende quando o pé bate antes de você pensar.",
      "O conservatório afundou, mas o compasso continua. Treine o ouvido aqui.",
      "Intervalo, escala, timbre. A dissonância lá embaixo é só uma pergunta mal resolvida.",
    ],
  },
  "trainer-ai": {
    name: "Operadora Nara",
    lines: [
      "A máquina aprende com o erro. Você também. A diferença é que ela não sente vergonha.",
      "Atenção, gradiente, tokens. Treine o vocabulário antes de descer.",
      "A Caixa Preta usa o seu caderno. Quanto melhor você treinar, menos ela tem para usar.",
    ],
  },
};

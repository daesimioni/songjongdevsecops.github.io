// Os textos do arquipélago. Cada estação do mapa é uma página; o instrumento
// interativo mora em js/zones/ e é carregado só quando a pessoa abre o painel.

export const POSTS = {
  welcome: {
    kicker: "porto do início",
    title: "Um arquipélago que se atravessa a pé",
    date: "2026-10-19",
    read: "4 min",
    tags: ["meta", "começo"],
    continent: "hub",
    lab: null,
    body: `
      <p>Este blog não tem índice. Tem <strong>mapa</strong>. Você entra com um boneco, atravessa pontes e escolhe por qual continente começar. Cada estação que encontra é uma página: um texto curto e um instrumento para mexer com as mãos.</p>
      <p>São quatro continentes. <em>Computaria</em> conta como saímos de interruptores e areia até processadores. <em>Matemática</em> visita o infinito, as formas, a mudança e o acaso. <em>Física</em> testa pêndulos, ondas, calor, luz e órbitas. <em>Química</em> abre a tabela periódica, as ligações, as reações e o equilíbrio. Ao todo, 22 fragmentos para descobrir.</p>
      <p>Cada estação abre uma página e soma experiência. O <strong>Diário</strong> guarda o que você já encontrou. As <strong>Pedras do Porto</strong>, os monólitos brilhantes nas docas, levam você de volta a qualquer continente já visitado. A névoa do minimapa só some onde você anda.</p>
      <blockquote>Não tem pressa. O mapa é grande, mas o caminho é seu.</blockquote>
      <p>Se encontrar outra pessoa na praça, acene. O mundo é compartilhado, sem servidor meu, e cada visitante tem um boneco.</p>
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

  // ---------------- Computaria ----------------
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
};

export const NPCS = {
  guia: {
    name: "Dona Zefa",
    lines: [
      "Bem-vindo ao Porto. Quatro continentes, mais terra do que os olhos acreditam.",
      "Cada farol da doca acende uma Pedra do Porto. Aperte E nas pedras para voltar rápido.",
      "O diário guarda o que você já viu. Não precisa decorar nada.",
    ],
  },
  ada: {
    name: "Ada",
    lines: [
      "Um somador é só uma frase feita de fios. Aprenda a ler a frase e o processador inteiro começa a fazer sentido.",
      "A memória do circuito é o que separa contar de lembrar.",
    ],
  },
  hypatia: {
    name: "Hypatia",
    lines: [
      "Não tenha pressa no infinito. Ele não tem pressa com você.",
      "A curva que você vê é um acordo entre uma fórmula e a tela. A fórmula é a parte que importa.",
    ],
  },
  marie: {
    name: "Marie",
    lines: [
      "Mude a velocidade de lançamento e veja o corpo cair ou escapar. A órbita mora num intervalo muito estreito.",
      "Uma medida é sempre uma conversa entre o mundo e o instrumento. O instrumento nunca é mudo.",
    ],
  },
  mendeleev: {
    name: "Mendeleev",
    lines: [
      "Eu deixei buracos na tabela e apostei que eles seriam ocupados. Dois foram. A natureza me devia essa.",
      "Se você entende por que uma coluna se parece por dentro, já entende metade da química.",
    ],
  },
};

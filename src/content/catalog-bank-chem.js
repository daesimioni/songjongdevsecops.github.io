// Banco de conteúdo de Química: uma seção por área, três tópicos por área.
// Cada tópico é uma estação (página) e uma pergunta de monstro.

export const CHEM_BANK = {
  chem: {
    "chem-fundamentos": [
      {
        name: "Estrutura atômica",
        def: "O átomo tem núcleo de prótons e nêutrons e elétrons em orbitais. A distribuição eletrônica decide como ele se liga.",
        keys: [
          "Prótons definem o elemento; nêutrons definem o isótopo.",
          "Elétrons ocupam níveis e subníveis em ordem de energia.",
          "Carga do íon vem da diferença entre prótons e elétrons.",
        ],
        mistake: "Achar que a massa do átomo está espalhada por todo o volume: quase toda está no núcleo.",
        q: {
          q: "O que diferencia isótopos de um mesmo elemento?",
          o: ["O número de nêutrons", "O número de prótons", "O número de elétrons", "A carga do íon", "O orbital mais externo", "A massa do elétron"],
          a: 0,
          why: "Mesmo número de prótons, nêutrons diferentes: mesma química, massa diferente.",
        },
      },
      {
        name: "Ligações químicas",
        def: "Átomos se ligam para baixar energia. A ligação pode ser iônica, covalente ou metálica, conforme a diferença de eletronegatividade.",
        keys: [
          "Iônica transfere elétrons e forma íons.",
          "Covalente compartilha elétrons.",
          "Ligação de hidrogênio é atração entre moléculas, não ligação química forte.",
        ],
        mistake: "Chamar ponte de hidrogênio de ligação covalente: ela é intermolecular e mais fraca.",
        q: {
          q: "Quando uma ligação tende a ser iônica?",
          o: ["Quando a diferença de eletronegatividade entre os átomos é grande", "Quando os átomos têm a mesma eletronegatividade", "Quando há hidrogênio ligado a carbono", "Quando o átomo tem camada cheia", "Quando a molécula é apolar", "Quando há apenas metais"],
          a: 0,
          why: "Diferença grande favorece a transferência de elétron e a formação de íons.",
        },
      },
      {
        name: "Estequiometria",
        def: "Estequiometria conta matéria em mol. A equação balanceada dá a proporção exata entre reagentes e produtos.",
        keys: [
          "Um mol tem 6,02 vezes 10 elevado a 23 partículas.",
          "Reagente limitante é o que acaba primeiro.",
          "Rendimento compara o produto obtido com o previsto.",
        ],
        mistake: "Esquecer de balancear a equação antes de calcular proporção.",
        q: {
          q: "O que é o reagente limitante?",
          o: ["O que é consumido primeiro e limita a quantidade de produto", "O que está em maior quantidade", "O catalisador da reação", "O produto que sobra", "O reagente mais caro", "O solvente da mistura"],
          a: 0,
          why: "Quando ele acaba, a reação para, mesmo sobrando os outros reagentes.",
        },
      },
    ],
    "chem-geral": [
      {
        name: "Reações e soluções",
        def: "Reações químicas rearranjam átomos. Em solução, a concentração diz quanto soluto existe por volume.",
        keys: [
          "Concentração é quantidade de soluto por volume de solução.",
          "Diluir aumenta o volume e diminui a concentração.",
          "Solubilidade depende de temperatura e do solvente.",
        ],
        mistake: "Diluir e achar que a quantidade de soluto diminui junto.",
        q: {
          q: "Ao diluir uma solução com água, o que acontece com o soluto?",
          o: ["A quantidade continua a mesma e a concentração cai", "A quantidade de soluto dobra", "O soluto evapora", "A concentração sobe", "O soluto muda de fórmula", "A solução fica saturada"],
          a: 0,
          why: "Adicionar solvente espalha o mesmo soluto num volume maior.",
        },
      },
      {
        name: "Equilíbrio ácido-base",
        def: "Ácido doa próton e base recebe. O pH mede a acidez em escala logarítmica.",
        keys: [
          "pH igual a 7 é neutro em água a 25 graus.",
          "Cada unidade de pH é fator 10 na concentração de íon hidrogênio.",
          "Tampão resiste à mudança de pH.",
        ],
        mistake: "Achar que pH 3 é três vezes mais ácido que pH 4: é dez vezes.",
        q: {
          q: "Quanto mais ácida é uma solução de pH 3 em relação à de pH 5?",
          o: ["Cem vezes", "Duas vezes", "Dez vezes", "Mil vezes", "Cinco vezes", "Igual"],
          a: 0,
          why: "A escala é logarítmica: dois pontos de diferença são 10 ao quadrado, cem vezes.",
        },
      },
      {
        name: "Oxidação e redução",
        def: "Em redox, um elemento perde elétrons e outro ganha. A variação de número de oxidação denuncia o processo.",
        keys: [
          "Quem oxida perde elétrons e aumenta o número de oxidação.",
          "Quem reduz ganha elétrons.",
          "Oxidação e redução acontecem juntas.",
        ],
        mistake: "Dizer que oxigênio é obrigatório em toda oxidação: o nome ficou por herança.",
        q: {
          q: "Na oxidação, o que acontece com a espécie?",
          o: ["Perde elétrons e o número de oxidação aumenta", "Ganha elétrons", "Não muda de carga", "Ganha prótons", "Perde massa", "Vira catalisador"],
          a: 0,
          why: "Perder elétron deixa a espécie mais positiva, elevando o número de oxidação.",
        },
      },
    ],
    "chem-inorganica": [
      {
        name: "Química dos elementos",
        def: "A tabela periódica organiza tendências: raio, eletronegatividade e reatividade mudam em direções previsíveis.",
        keys: [
          "Metais alcalinos reagem forte com água.",
          "Gases nobres têm camada cheia e baixa reatividade.",
          "Eletronegatividade cresce para cima e para a direita.",
        ],
        mistake: "Tratar a tabela como lista de nomes sem tendências.",
        q: {
          q: "Para onde a eletronegatividade cresce na tabela?",
          o: ["Para cima e para a direita", "Para baixo e para a esquerda", "Para baixo à direita", "Para cima e à esquerda", "Do centro para as bordas", "Só no grupo dos metais"],
          a: 0,
          why: "Átomos menores e mais à direita atraem elétrons com mais força.",
        },
      },
      {
        name: "Compostos de coordenação",
        def: "Complexos metálicos têm um íon central cercado de ligantes. A geometria e o campo dos ligantes mudam cor e reatividade.",
        keys: [
          "Ligante doa par de elétrons ao metal.",
          "Geometria depende do número de coordenação.",
          "Campo cristalino explica a cor de muitos complexos.",
        ],
        mistake: "Achar que a cor do complexo vem do metal sozinho, sem os ligantes.",
        q: {
          q: "O que o ligante faz num complexo metálico?",
          o: ["Doa par de elétrons para o metal central", "Recebe elétrons do metal e vira ânion sempre", "Aumenta a massa do metal", "Impede a coordenação", "Troca o elemento central", "Neutraliza o solvente"],
          a: 0,
          why: "A ligação coordenada é uma doação de par de elétrons do ligante ao metal.",
        },
      },
      {
        name: "Organometálicos",
        def: "Compostos organometálicos têm ligação carbono-metal e são motores da catálise homogênea.",
        keys: [
          "Ligação carbono-metal pode ser covalente ou iônica.",
          "Catálise homogênea está na mesma fase do reagente.",
          "Acoplamentos formam ligação carbono-carbono.",
        ],
        mistake: "Confundir organometálico com composto orgânico comum que contém metal como impureza.",
        q: {
          q: "O que caracteriza um composto organometálico?",
          o: ["Ter ligação direta entre carbono e metal", "Ter metal dissolvido em solvente", "Ser sempre iônico", "Ter apenas hidrogênio e metal", "Ser um sal inorgânico", "Ser um polímero"],
          a: 0,
          why: "A ligação carbono-metal é o que define a classe e dá a reatividade típica.",
        },
      },
    ],
    "chem-fisica": [
      {
        name: "Termodinâmica química",
        def: "Energia livre decide se a reação acontece por si. Entalpia e entropia puxam em direções diferentes.",
        keys: [
          "Reação espontânea tem energia livre negativa.",
          "Entalpia negativa libera calor.",
          "Entropia positiva aumenta a desordem.",
        ],
        mistake: "Achar que reação que libera calor acontece sempre por si, ignorando a entropia.",
        q: {
          q: "O que uma energia livre de Gibbs negativa indica?",
          o: ["Reação espontânea nas condições dadas", "Reação impossível", "Equilíbrio exato", "Reação instantânea sempre", "Ausência de entalpia", "Aumento de massa"],
          a: 0,
          why: "A energia livre negativa indica que o processo pode ocorrer sem energia externa.",
        },
      },
      {
        name: "Cinética e catálise",
        def: "Cinética estuda a velocidade das reações. Catalisador baixa a barreira de energia sem ser consumido.",
        keys: [
          "Energia de ativação é a barreira a vencer.",
          "Catalisador não muda o equilíbrio, só a velocidade.",
          "Temperatura aumenta a velocidade pelo aumento de colisões eficazes.",
        ],
        mistake: "Achar que catalisador aumenta o rendimento final de uma reação em equilíbrio.",
        q: {
          q: "O que um catalisador muda?",
          o: ["A energia de ativação e a velocidade", "O equilíbrio final", "A massa dos produtos", "A fórmula dos reagentes", "A temperatura", "A entalpia total"],
          a: 0,
          why: "Ele abre um caminho de menor energia; o equilíbrio termodinâmico continua o mesmo.",
        },
      },
      {
        name: "Eletroquímica",
        def: "Eletroquímica converte energia química em elétrica e vice-versa. Pilhas e eletrólise são os dois sentidos.",
        keys: [
          "Ânodo oxida; cátodo reduz.",
          "Potencial de célula positivo indica reação espontânea.",
          "Equação de Nernst corrige o potencial pela concentração.",
        ],
        mistake: "Trocar ânodo e cátodo na pilha e inverter a conclusão.",
        q: {
          q: "O que acontece no ânodo de uma pilha?",
          o: ["Ocorre a oxidação", "Ocorre a redução", "Não há reação", "Ocorre precipitação", "Ocorre neutralização", "Ocorre fusão"],
          a: 0,
          why: "No ânodo sai elétron: a espécie se oxida. No cátodo, o elétron é recebido.",
        },
      },
    ],
    "chem-bioquimica": [
      {
        name: "Biomoléculas",
        def: "Aminoácidos, carboidratos, lipídios e ácidos nucleicos montam a vida. Cada classe tem função e estrutura própria.",
        keys: [
          "Aminoácidos se ligam por ligação peptídica.",
          "Carboidratos são fonte rápida de energia.",
          "Ácidos nucleicos guardam e transmitem informação.",
        ],
        mistake: "Achar que toda gordura é ruim: lipídios formam membranas e guardam energia.",
        q: {
          q: "Que ligação une aminoácidos numa proteína?",
          o: ["Ligação peptídica", "Ligação de hidrogênio", "Ligação iônica", "Ligação metálica", "Ponte dissulfeto", "Ligação glicosídica"],
          a: 0,
          why: "O grupo carboxila de um se liga ao amino do outro, liberando água.",
        },
      },
      {
        name: "Enzimas e catálise",
        def: "Enzimas são catalisadores biológicos com forma específica. O sítio ativo encaixa no substrato como chave em fechadura.",
        keys: [
          "Enzima baixa a energia de ativação.",
          "pH e temperatura alteram a forma e a atividade.",
          "Inibidor competitivo disputa o sítio ativo.",
        ],
        mistake: "Achar que enzima é consumida na reação: ela sai igual.",
        q: {
          q: "O que acontece com a enzima ao final da reação?",
          o: ["Ela está livre para catalisar de novo", "Ela é consumida", "Ela vira produto", "Ela perde a função para sempre", "Ela muda de elemento", "Ela vira substrato"],
          a: 0,
          why: "O catalisador não é consumido: por isso quantidades pequenas bastam.",
        },
      },
      {
        name: "Metabolismo",
        def: "Metabolismo é o conjunto de reações da célula: quebra para obter energia e síntese para construir.",
        keys: [
          "Glicólise quebra glicose no citoplasma.",
          "Ciclo do ácido cítrico roda na mitocôndria.",
          "Fosforilação oxidativa produz a maior parte do ATP.",
        ],
        mistake: "Achar que a célula produz ATP só pela respiração aeróbica: há a via anaeróbia também.",
        q: {
          q: "Onde acontece a glicólise?",
          o: ["No citoplasma", "Na mitocôndria", "No núcleo", "No retículo", "No lisossomo", "Na membrana externa"],
          a: 0,
          why: "A glicólise é citoplasmática e não precisa de oxigênio.",
        },
      },
    ],
    "chem-polimeros": [
      {
        name: "Polimerização",
        def: "Monômeros se ligam formando cadeias longas. Adição encadeia sem perder átomos; condensação perde molécula pequena.",
        keys: [
          "Polimerização por adição abre ligação dupla.",
          "Condensação libera água ou outro subproduto.",
          "Grau de polimerização mede o tamanho da cadeia.",
        ],
        mistake: "Achar que todo plástico vem do mesmo monômero.",
        q: {
          q: "O que diferencia a polimerização por condensação?",
          o: ["Libera uma molécula pequena, como água", "Não altera a massa", "Usa apenas um monômero", "Só ocorre em metais", "Dispensa calor", "Forma apenas ramificações"],
          a: 0,
          why: "Cada ligação formada libera um subproduto pequeno, comum na formação de poliésteres e náilons.",
        },
      },
      {
        name: "Termoplásticos e elastômeros",
        def: "Termoplástico amolece com calor e pode ser remoldado. Termofixo endurece de vez. Elastômero estica e volta.",
        keys: [
          "Termoplásticos têm cadeias lineares ou ramificadas.",
          "Termofixos formam rede reticulada e não amolecem.",
          "Elastômeros têm ligações cruzadas espaçadas.",
        ],
        mistake: "Tentar reciclar termofixo como termoplástico: a rede impede remoldagem.",
        q: {
          q: "Por que o termofixo não pode ser remoldado?",
          o: ["Suas cadeias formam rede reticulada permanente", "Ele derrete fácil", "É feito de metal", "Não tem carbono", "É solúvel em água", "Tem cadeias curtas"],
          a: 0,
          why: "As ligações cruzadas químicas mantêm a forma; aquecer não desfaz a rede sem degradar.",
        },
      },
      {
        name: "Reciclagem química",
        def: "Reciclagem química quebra o polímero em monômeros ou em outros produtos úteis, em vez de só triturar e reformar.",
        keys: [
          "Reciclagem mecânica tritura e remodela.",
          "Reciclagem química despolimeriza.",
          "Separar resinas melhora a qualidade do reciclado.",
        ],
        mistake: "Misturar resinas diferentes e esperar material reciclado forte.",
        q: {
          q: "O que a reciclagem química faz que a mecânica não faz?",
          o: ["Quebra o polímero em moléculas menores", "Só lava o plástico", "Derrete sem separar", "Aumenta a cor", "Só prensa peças", "Mistura resinas"],
          a: 0,
          why: "A despolimerização recupera monômeros ou insumos que voltam à cadeia produtiva.",
        },
      },
    ],
    "chem-materiais": [
      {
        name: "Nanomateriais",
        def: "Nanomateriais têm ao menos uma dimensão pequena e propriedades dominadas pela superfície e pela quântica.",
        keys: [
          "Área superficial cresce muito na nanoescala.",
          "Nanotubos de carbono são fortes e condutores.",
          "Nanopartículas podem ter cor diferente do material comum.",
        ],
        mistake: "Tratar nanopartícula como poeira comum: reatividade e toxicidade podem mudar.",
        q: {
          q: "O que cresce muito quando o material vai para a nanoescala?",
          o: ["A fração de átomos na superfície", "A massa do núcleo", "A constante gravitacional", "O número de prótons", "A cor do material", "A temperatura"],
          a: 0,
          why: "Mais superfície por volume muda reatividade, catálise e propriedades ópticas.",
        },
      },
      {
        name: "Materiais porosos",
        def: "Materiais porosos têm cavidades que absorvem, filtram e catalisam. Zeólitas são peneiras moleculares.",
        keys: [
          "Porosidade é a fração de volume vazio.",
          "Zeólita tem canais de tamanho molecular.",
          "Área superficial alta melhora adsorção e catálise.",
        ],
        mistake: "Achar que material poroso é frágil sempre: depende da estrutura da parede.",
        q: {
          q: "Por que a zeólita serve como peneira molecular?",
          o: ["Os canais têm tamanho que deixa passar só certas moléculas", "Ela derrete fácil", "Ela é metálica", "Tem pH fixo", "É radioativa", "Não tem poros"],
          a: 0,
          why: "A abertura dos canais seleciona moléculas por tamanho e formato.",
        },
      },
      {
        name: "Superfícies funcionais",
        def: "A superfície de um material pode ser tratada para repelir água, aderir tinta ou resistir à corrosão.",
        keys: [
          "Revestimento muda energia superficial.",
          "Superfície hidrofóbica repele água.",
          "Revestimento fino pode falhar por trinca ou desgaste.",
        ],
        mistake: "Achar que revestimento dura para sempre: ele também envelhece.",
        q: {
          q: "O que uma superfície hidrofóbica faz?",
          o: ["Repelir água", "Absorver água", "Deter toda a luz", "Conduzir calor mais rápido", "Mudar de cor com pH", "Criar corrente elétrica"],
          a: 0,
          why: "A baixa energia superficial faz a gota se apoiar sem se espalhar.",
        },
      },
    ],
    "chem-ambiental": [
      {
        name: "Poluentes e remediação",
        def: "Poluente é substância que causa dano no ambiente. Remediação remove, transforma ou imobiliza o contaminante.",
        keys: [
          "Metais pesados não se degradam, só mudam de forma.",
          "Biorremediação usa microrganismos para degradar contaminantes.",
          "Contaminante emergente escapa da análise tradicional.",
        ],
        mistake: "Achar que todo poluente se degrada com o tempo: metal pesado permanece.",
        q: {
          q: "Por que metal pesado exige cuidado por longo prazo?",
          o: ["Ele não se degrada, fica no ambiente e na cadeia alimentar", "Ele evapora rápido", "Ele vira gás inofensivo", "Ele desaparece com luz", "Ele só existe em laboratório", "Ele é radioativo"],
          a: 0,
          why: "Não há biodegradação de metal: ele circula entre água, solo e organismos.",
        },
      },
      {
        name: "Química atmosférica",
        def: "A atmosfera é um reator: luz, oxigênio e umidade transformam gases e formam ozônio, smog e chuva ácida.",
        keys: [
          "Ozônio na estratosfera protege; na troposfera é poluente.",
          "Chuva ácida vem de óxidos de enxofre e nitrogênio.",
          "Reações fotoquímicas dependem da luz solar.",
        ],
        mistake: "Confundir ozônio de superfície com buraco na camada de ozônio; são problemas diferentes.",
        q: {
          q: "Qual processo forma chuva ácida?",
          o: ["Óxidos de enxofre e nitrogênio reagem com água na atmosfera", "Ozônio se acumula no solo", "Metano evapora do solo", "Chumbo se dissolve", "Sal se precipita", "Gás nobre se ioniza"],
          a: 0,
          why: "Esses óxidos formam ácidos sulfúrico e nítrico em contato com a umidade das nuvens.",
        },
      },
      {
        name: "Geoquímica e oceanos",
        def: "A água do mar equilibra carbonatos e nutrientes. O oceano absorve parte do gás carbônico da atmosfera.",
        keys: [
          "Absorção de CO2 acidifica o oceano.",
          "Ciclo do carbonato controla conchas e corais.",
          "Nutrientes limitam a vida marinha.",
        ],
        mistake: "Achar que acidificação é o mesmo que aquecimento global: são efeitos ligados, mas distintos.",
        q: {
          q: "O que a absorção de gás carbônico faz com a água do mar?",
          o: ["Diminui o pH, acidificando", "Aumenta o pH", "Não altera nada", "Aumenta a salinidade sempre", "Torna a água doce", "Congela o oceano"],
          a: 0,
          why: "O CO2 forma ácido carbônico e libera íons hidrogênio, reduzindo o pH.",
        },
      },
    ],
    "chem-industrial": [
      {
        name: "Processos industriais",
        def: "Processo químico industrial soma reação, separação, energia e controle, buscando rendimento e segurança.",
        keys: [
          "Rendimento industrial raramente é total por causa de equilíbrio e perdas.",
          "Reciclo interno devolve reagente não convertido.",
          "Controle de temperatura evita reação descontrolada.",
        ],
        mistake: "Projetar só pelo equilíbrio ideal, esquecendo cinética e segurança.",
        q: {
          q: "Para que serve o reciclo num processo químico?",
          o: ["Devolver reagente não convertido para aumentar o rendimento global", "Aumentar a temperatura", "Dispensar catalisador", "Eliminar a separação", "Mudar o produto", "Reduzir a segurança"],
          a: 0,
          why: "Em vez de descartar, o que não reagiu volta para a entrada e tem nova chance.",
        },
      },
      {
        name: "Catálise industrial",
        def: "Catalisador industrial precisa durar: envenenamento e coque reduzem a atividade com o tempo.",
        keys: [
          "Superfície ativa é onde a reação acontece.",
          "Envenenamento bloqueia sítios ativos.",
          "Regeneração devolve parte da atividade.",
        ],
        mistake: "Ignorar que catalisador se desgasta e pede troca.",
        q: {
          q: "O que é envenenamento de catalisador?",
          o: ["Substância que prende nos sítios ativos e reduz a atividade", "Aumento de temperatura", "Troca do catalisador", "Aumento de pressão", "Mudança de paleta", "Ganho de rendimento"],
          a: 0,
          why: "O veneno ocupa os sítios onde a reação aconteceria, mesmo em concentração pequena.",
        },
      },
      {
        name: "Combustíveis e petróleo",
        def: "Combustível fóssil vem do refino do petróleo: destilação separa frações e conversões ajustam tamanho de cadeia.",
        keys: [
          "Destilação separa por ponto de ebulição.",
          "Craqueamento quebra cadeias longas em curtas.",
          "Combustão libera energia e produz gás carbônico e água.",
        ],
        mistake: "Achar que a gasolina é uma substância pura: é mistura de hidrocarbonetos.",
        q: {
          q: "O que o craqueamento faz no refino?",
          o: ["Quebra cadeias longas em moléculas menores", "Junta moléculas pequenas", "Só resfria o óleo", "Remove água", "Adiciona oxigênio", "Solidifica o petróleo"],
          a: 0,
          why: "Cadeias menores voltam como frações mais leves, como gasolina.",
        },
      },
    ],
    "chem-computacional": [
      {
        name: "Modelagem molecular",
        def: "Modelagem calcula estrutura e energia de moléculas por mecânica molecular ou quântica, conforme o problema.",
        keys: [
          "Mecânica molecular usa campo de força e é rápida.",
          "Química quântica resolve elétrons e é mais cara.",
          "Resultado precisa de validação experimental.",
        ],
        mistake: "Tratar resultado de simulação como medida exata.",
        q: {
          q: "Quando a mecânica molecular é mais indicada?",
          o: ["Para sistemas grandes, com aproximação por campo de força", "Para calcular elétrons de orbitais", "Para reações com quebra de ligação", "Para massas exatas", "Para bandas de energia", "Para núcleos radioativos"],
          a: 0,
          why: "Ela abre mão do detalhe eletrônico em troca de velocidade em sistemas grandes.",
        },
      },
      {
        name: "DFT e estrutura eletrônica",
        def: "A teoria do funcional da densidade calcula a energia a partir da densidade eletrônica, com custo menor que métodos de onda.",
        keys: [
          "Densidade eletrônica substitui a função de onda completa.",
          "Funcional aproximado: resultado depende da escolha.",
          "DFT é padrão em moléculas e sólidos.",
        ],
        mistake: "Achar que todo funcional dá o mesmo resultado; cada um tem seu erro típico.",
        q: {
          q: "O que a DFT aproxima?",
          o: ["A energia em função da densidade eletrônica", "A massa do núcleo", "A temperatura da amostra", "A taxa de reação", "A cor do composto", "A pressão do reator"],
          a: 0,
          why: "O método usa a densidade no lugar da função de onda, com um funcional que aproxima a energia de troca e correlação.",
        },
      },
      {
        name: "Quimioinformática",
        def: "Quimioinformática representa moléculas em dados, busca padrões e prevê propriedades e atividades.",
        keys: [
          "String de SMILES descreve estrutura em texto.",
          "Similaridade estrutural agrupa compostos parecidos.",
          "Modelos de aprendizado precisam de dados representativos.",
        ],
        mistake: "Achar que estrutura parecida garante efeito parecido: pode mudar no detalhe.",
        q: {
          q: "Para que serve um código SMILES?",
          o: ["Representar a estrutura de uma molécula em texto", "Medir a massa", "Aquecer a amostra", "Separar misturas", "Calcular pH", "Nomear enzimas"],
          a: 0,
          why: "É uma notação linear que permite guardar e comparar estruturas em computador.",
        },
      },
    ],
    "chem-outras": [
      {
        name: "Fotoquímica",
        def: "Fotoquímica estuda reações disparadas por luz. O fóton fornece energia e muda a estrutura eletrônica.",
        keys: [
          "Molécula excitada pode reagir de forma diferente.",
          "Fotossíntese usa luz para fixar carbono.",
          "Fotodegradação é a degradação por luz.",
        ],
        mistake: "Achar que calor e luz fazem sempre a mesma coisa: a luz pode excitar caminho específico.",
        q: {
          q: "O que a absorção de luz faz na fotoquímica?",
          o: ["Excita a molécula e abre caminhos de reação", "Só aquece a amostra", "Remove elétrons do núcleo", "Muda o elemento", "Não altera nada", "Cria massa"],
          a: 0,
          why: "O fóton promove a molécula a um estado excitado, com reatividade diferente do estado fundamental.",
        },
      },
      {
        name: "Química forense",
        def: "Química forense identifica substâncias em vestígios e reconstrói fatos com método e cadeia de custódia.",
        keys: [
          "Vestígio pequeno exige técnica sensível.",
          "Cadeia de custódia garante a validade da prova.",
          "Amostra de referência permite comparação.",
        ],
        mistake: "Achar que resultado analítico vale sem documentação da coleta.",
        q: {
          q: "Por que a cadeia de custódia importa na análise forense?",
          o: ["Garante que a amostra não foi alterada desde a coleta", "Deixa a amostra mais pura", "Acelera a análise", "Dispensa o padrão", "Muda a técnica", "Reduz o custo"],
          a: 0,
          why: "Sem registro de quem manuseou e como, a prova perde validade.",
        },
      },
      {
        name: "Química verde",
        def: "Química verde projeta processos com menos resíduo, menos solvente e mais segurança desde o início.",
        keys: [
          "Prevenir resíduo é melhor que tratá-lo.",
          "Solvente mais seguro reduz risco.",
          "Economia de átomos mede quanto reagente vira produto.",
        ],
        mistake: "Chamar de verde todo processo que só troca o solvente e mantém o resto igual.",
        q: {
          q: "O que a economia de átomos mede?",
          o: ["Quanto dos reagentes termina dentro do produto desejado", "O custo do catalisador", "O tempo de reação", "A cor do produto", "A massa do solvente", "A temperatura do reator"],
          a: 0,
          why: "É a razão entre a massa do produto desejado e a massa total de reagentes usados.",
        },
      },
    ],
  },
};

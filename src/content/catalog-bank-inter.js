// Banco de conteúdo das Interseções: uma seção por área, três tópicos por área.
// Cada tópico é uma estação (página) e uma pergunta de monstro.

export const INTER_BANK = {
  inter: {
    "inter-math-physics": [
      {
        name: "Métodos variacionais",
        def: "Princípios variacionais dizem que a natureza escolhe o caminho que extremiza uma quantidade, como a ação. A equação do movimento sai daí.",
        keys: [
          "Ação é integral da lagrangiana no tempo.",
          "Equação de Euler-Lagrange dá o movimento.",
          "Simetria na ação vira lei de conservação.",
        ],
        mistake: "Achar que caminho de mínima ação é sempre o mais curto no espaço.",
        q: {
          q: "O que o princípio da mínima ação determina?",
          o: ["O caminho que extremiza a ação entre dois pontos no tempo", "A velocidade da luz no vácuo", "A massa da partícula", "O campo magnético", "A temperatura do sistema", "A cor do objeto"],
          a: 0,
          why: "A trajetória física é a que torna a ação estacionária, não necessariamente a mais curta.",
        },
      },
      {
        name: "Sistemas dinâmicos",
        def: "Equações diferenciais descrevem sistemas físicos. Estabilidade, ciclo e caos dizem o comportamento de longo prazo.",
        keys: [
          "Ponto fixo estável atrai trajetórias vizinhas.",
          "Bifurcação muda o comportamento quando um parâmetro varia.",
          "Caos é determinístico, mas sensível à condição inicial.",
        ],
        mistake: "Projetar controle supondo linearidade em sistema que satura.",
        q: {
          q: "O que acontece numa bifurcação de um sistema dinâmico?",
          o: ["O comportamento muda de qualidade quando o parâmetro varia", "O sistema para de existir", "A equação perde solução", "A massa dobra", "O tempo acelera", "O estado fica constante"],
          a: 0,
          why: "Pequena mudança de parâmetro pode trocar um equilíbrio por um ciclo, por exemplo.",
        },
      },
      {
        name: "Teoria dos campos",
        def: "Campo é grandeza definida em cada ponto do espaço. A teoria clássica dos campos descreve eletromagnetismo e gravitação como geometria.",
        keys: [
          "Equações de Maxwell descrevem o campo eletromagnético.",
          "Ondas surgem da variação de campo.",
          "A relatividade trata o campo como entidade dinâmica.",
        ],
        mistake: "Imaginar o campo como desenho sobre o espaço, sem energia própria.",
        q: {
          q: "O que uma onda eletromagnética é, na teoria de campos?",
          o: ["Uma perturbação que se propaga nos campos elétrico e magnético", "Um material que viaja", "Uma partícula com massa", "Um fluido invisível", "Uma força de contato", "Uma vibração do ar"],
          a: 0,
          why: "Campos variáveis no tempo se sustentam mutuamente e se propagam, sem precisar de meio material.",
        },
      },
    ],
    "inter-math-chem": [
      {
        name: "Grafos moleculares",
        def: "A molécula pode ser tratada como grafo: átomos são vértices e ligações são arestas. Propriedades estruturais entram na previsão.",
        keys: [
          "Grau do vértice conta ligações do átomo.",
          "Árvore representa molécula sem anéis.",
          "Índices topológicos resumem a estrutura em número.",
        ],
        mistake: "Achar que só a fórmula conta: isômeros têm a mesma fórmula e propriedades diferentes.",
        q: {
          q: "O que um isômero tem igual ao outro?",
          o: ["A fórmula molecular, com arranjo diferente", "A estrutura completa", "A propriedade química", "O ponto de ebulição", "A cor", "A reatividade"],
          a: 0,
          why: "Mesma fórmula, conectividade ou geometria diferente, e por isso comportamento distinto.",
        },
      },
      {
        name: "Cinética modelada",
        def: "A velocidade de reação pode ser modelada por equações diferenciais. Concentração evolui segundo a ordem da reação.",
        keys: [
          "Primeira ordem decai exponencialmente.",
          "Segunda ordem depende do inverso da concentração.",
          "Temperatura muda a constante por Arrhenius.",
        ],
        mistake: "Ler gráfico de decaimento sem verificar se a ordem é de fato primeira.",
        q: {
          q: "Como a concentração decai numa reação de primeira ordem?",
          o: ["Exponencialmente no tempo", "Linearmente no tempo", "Quadraticamente", "Fica constante", "Cresce sem parar", "Oscila"],
          a: 0,
          why: "A lei de velocidade de primeira ordem leva a decaimento exponencial.",
        },
      },
      {
        name: "Otimização de processos",
        def: "Otimização química busca maior rendimento com menor custo, respeitando restrições de temperatura, pressão e segurança.",
        keys: [
          "Restrição define o que não pode ser violado.",
          "Função objetivo mede o que se quer maximizar.",
          "Ótimo local pode não ser o global.",
        ],
        mistake: "Otimizar uma variável isolada e piorar outra que importa.",
        q: {
          q: "O que é função objetivo num problema de otimização?",
          o: ["A quantidade que se quer maximizar ou minimizar", "A regra de segurança", "O erro de medida", "O catalisador usado", "A temperatura ambiente", "O custo fixo"],
          a: 0,
          why: "Ela traduz a meta em número, como rendimento ou custo.",
        },
      },
    ],
    "inter-math-cs": [
      {
        name: "Lógica computacional",
        def: "Lógica formal virou base da computação: proposições, quantificadores e inferência descrevem circuitos e programas.",
        keys: [
          "Satisfatibilidade pergunta se existe atribuição que torne a fórmula verdadeira.",
          "Resolução é regra de inferência automatizável.",
          "Verificação formal prova propriedade do programa.",
        ],
        mistake: "Achar que satisfatibilidade é fácil porque a fórmula é curta.",
        q: {
          q: "O que o problema SAT pergunta?",
          o: ["Se existe atribuição que torna a fórmula verdadeira", "Qual é a raiz da equação", "Quanto tempo o programa leva", "Qual o tipo da variável", "Quantas linhas tem o código", "Qual a saída padrão"],
          a: 0,
          why: "SAT é o problema de satisfatibilidade booleana, central em complexidade e verificação.",
        },
      },
      {
        name: "Teoria dos códigos",
        def: "Códigos corretores usam álgebra para acrescentar redundância e corrigir erro de transmissão.",
        keys: [
          "Código linear é subespaço vetorial.",
          "Distância mínima limita a correção.",
          "Códigos cíclicos usam polinômios sobre corpo finito.",
        ],
        mistake: "Confundir compressão com correção de erro: objetivos opostos.",
        q: {
          q: "O que a redundância num código faz?",
          o: ["Permite detectar e corrigir erro na transmissão", "Reduz o tamanho da mensagem", "Aumenta a velocidade da rede", "Criptografa o conteúdo", "Comprime a imagem", "Elimina o ruído físico"],
          a: 0,
          why: "A repetição controlada permite reconstruir a mensagem mesmo com bits trocados.",
        },
      },
      {
        name: "Análise de algoritmos",
        def: "A matemática da contagem dá o custo dos algoritmos: somas, recorrências e limites assintóticos.",
        keys: [
          "Recorrência descreve custo de divisão e conquista.",
          "Limite assintótico ignora constante e foca a tendência.",
          "Prova de correção usa invariante.",
        ],
        mistake: "Medir tempo em segundos e concluir qual algoritmo é melhor.",
        q: {
          q: "Para que serve um invariante de laço?",
          o: ["Provar que a propriedade vale em cada iteração", "Acelerar o laço", "Reduzir a memória", "Gerar o gráfico", "Medir o tempo", "Traduzir o código"],
          a: 0,
          why: "O invariante se mantém do início ao fim e sustenta a prova de correção.",
        },
      },
    ],
    "inter-math-lingua": [
      {
        name: "Semântica formal",
        def: "Semântica formal traduz frases em estruturas lógicas e calcula condições de verdade.",
        keys: [
          "Quantificador todo e existe têm regras próprias.",
          "Escopo muda o sentido da frase.",
          "Ambiguidade estrutural gera duas leituras formais.",
        ],
        mistake: "Ignorar o escopo e tratar toda leitura como equivalente.",
        q: {
          q: "O que a semântica formal calcula para uma frase?",
          o: ["As condições em que ela é verdadeira", "O número de sílabas", "A classe das palavras", "A origem etimológica", "O ritmo da fala", "A intenção do autor"],
          a: 0,
          why: "Ela modela o significado como condição de verdade, ligando frase a situação.",
        },
      },
      {
        name: "Argumentação formal",
        def: "A estrutura do argumento pode ser checada formalmente: premissas, regra de inferência e conclusão.",
        keys: [
          "Validade depende da forma, não do conteúdo.",
          "Premissa falsa pode gerar conclusão falsa com argumento válido.",
          "Contraexemplo derruba a validade.",
        ],
        mistake: "Achar que argumento com conclusão verdadeira é automaticamente válido.",
        q: {
          q: "O que torna um argumento válido?",
          o: ["A conclusão seguir necessariamente das premissas", "A conclusão ser verdadeira", "O autor ser especialista", "O texto ser longo", "As premissas serem famosas", "O tema ser polêmico"],
          a: 0,
          why: "Validade é sobre a forma da inferência, independente de as premissas serem verdadeiras.",
        },
      },
      {
        name: "Estatística de texto",
        def: "Medir texto permite comparar frequência, extensão e estilo, apoiando análise literária e linguística.",
        keys: [
          "Frequência de palavra ajuda a caracterizar estilo.",
          "Tamanho de frase varia com o gênero.",
          "Correlação não prova autoria.",
        ],
        mistake: "Atribuir autoria a texto só por vocabulário parecido.",
        q: {
          q: "Por que frequência de palavra sozinha não prova autoria?",
          o: ["Porque estilo semelhante pode ter outras causas", "Porque a contagem é proibida", "Porque não existe frequência", "Porque todo autor escreve igual", "Porque o texto muda", "Porque a métrica é secreta"],
          a: 0,
          why: "É indício, não prova: imitação, gênero e época também explicam o padrão.",
        },
      },
    ],
    "inter-physics-chem": [
      {
        name: "Espectroscopia molecular",
        def: "Moléculas absorvem radiação em frequências ligadas a vibração e rotação. O espectro identifica grupos e ligações.",
        keys: [
          "Infravermelho revela grupos funcionais.",
          "Raman complementa o infravermelho.",
          "Ressonância magnética nuclear vê o ambiente do átomo de hidrogênio.",
        ],
        mistake: "Achar que toda absorção visível vem de elétrons: vibração também aparece.",
        q: {
          q: "O que o espectro de infravermelho revela numa molécula?",
          o: ["Grupos funcionais pelas vibrações das ligações", "A massa do núcleo", "O tempo de reação", "A cor do solvente", "A pressão do frasco", "O número de nêutrons"],
          a: 0,
          why: "Cada ligação vibra em frequência característica, e a absorção aparece no infravermelho.",
        },
      },
      {
        name: "Termodinâmica química",
        def: "Energia e entropia decidem a direção das reações. A energia livre junta as duas.",
        keys: [
          "Entalpia mede troca de calor.",
          "Entropia mede dispersão de energia.",
          "Equilíbrio acontece com energia livre zero.",
        ],
        mistake: "Dizer que reação exotérmica é sempre espontânea, ignorando a entropia.",
        q: {
          q: "O que energiza a espontaneidade de uma reação?",
          o: ["A variação negativa de energia livre", "O aumento de massa", "O catalisador", "A cor do frasco", "A agitação mecânica", "A pressão apenas"],
          a: 0,
          why: "A energia livre combina entalpia e entropia e indica se o processo ocorre por si.",
        },
      },
      {
        name: "Fotoquímica",
        def: "Luz fornece energia para excitar moléculas e abrir reações. Cores e fotoestabilidade dependem disso.",
        keys: [
          "Fóton com energia certa excita elétrons.",
          "Estado excitado pode reagir de forma diferente.",
          "Proteção solar e fotodegradação são fotoquímica aplicada.",
        ],
        mistake: "Achar que intensidade substitui frequência na excitação.",
        q: {
          q: "O que decide se um fóton excita uma molécula?",
          o: ["A energia do fóton casar com a transição disponível", "A cor do recipiente", "A massa da molécula", "A pressão do ar", "O tempo de exposição apenas", "O solvente apenas"],
          a: 0,
          why: "Precisa de energia compatível com a diferença entre níveis; muita luz não resolve energia errada.",
        },
      },
    ],
    "inter-physics-cs": [
      {
        name: "Simulação numérica",
        def: "Simular física é integrar equações passo a passo, com erro controlado e validação experimental.",
        keys: [
          "Passo menor reduz erro e aumenta custo.",
          "Conservação de energia testa a qualidade do método.",
          "Simulação precisa de comparação com medida real.",
        ],
        mistake: "Publicar resultado de simulação sem conferir convergência.",
        q: {
          q: "Como verificar se uma simulação física convergiu?",
          o: ["Repetir com passo menor e comparar resultados", "Rodar só uma vez", "Olhar a cor do gráfico", "Aumentar a janela", "Trocar a linguagem", "Medir o tamanho do arquivo"],
          a: 0,
          why: "Se o resultado para de mudar ao refinar o passo, há convergência numérica.",
        },
      },
      {
        name: "Computação quântica",
        def: "Computador quântico usa portas em qubits para explorar amplitudes. Ganho depende do algoritmo.",
        keys: [
          "Embaralhamento e interferência constroem o ganho.",
          "Shor quebra RSA; Grover acelera busca.",
          "Erro quântico exige correção dedicada.",
        ],
        mistake: "Achar que qualquer tarefa fica mais rápida em hardware quântico.",
        q: {
          q: "O que o algoritmo de Grover acelera?",
          o: ["Busca em espaço não ordenado", "Fatoração de primos", "Ordenação de lista", "Cálculo de matriz", "Compactação", "Criptografia simétrica"],
          a: 0,
          why: "Grover dá aceleração quadrática na busca; fatoração é o alvo do algoritmo de Shor.",
        },
      },
      {
        name: "Gêmeos digitais",
        def: "Gêmeo digital é modelo computacional alimentado por dados reais, usado para prever e testar sem mexer no físico.",
        keys: [
          "Modelo precisa de dados de sensor confiáveis.",
          "Serve para simular cenário antes de aplicar.",
          "Divergência entre modelo e real pede recalibração.",
        ],
        mistake: "Tomar o gêmeo como verdade e ignorar o desvio em relação ao real.",
        q: {
          q: "O que um gêmeo digital exige para valer?",
          o: ["Dados reais e calibração contínua", "Só um desenho bonito", "Apenas software pronto", "Nenhum sensor", "Um único teste", "Apenas a nuvem"],
          a: 0,
          why: "Sem alimentação real e recalibração, o modelo se afasta do equipamento.",
        },
      },
    ],
    "inter-physics-lingua": [
      {
        name: "Divulgação científica",
        def: "Divulgar é traduzir ciência para público amplo sem perder a exatidão nem esconder a incerteza.",
        keys: [
          "Analogia ajuda, mas tem limite.",
          "Incerteza faz parte do resultado e deve aparecer.",
          "Sensacionalismo troca precisão por clique.",
        ],
        mistake: "Trocar 'associação' por 'causa' na manchete.",
        q: {
          q: "Qual cuidado a boa divulgação científica mantém?",
          o: ["Não transformar associação em causa", "Esconder a incerteza", "Simplificar até errar", "Trocar dado por opinião", "Evitar fonte", "Falar só com especialista"],
          a: 0,
          why: "Rigor de causalidade é parte da informação: associar não é o mesmo que causar.",
        },
      },
      {
        name: "Redação de artigo",
        def: "Artigo científico organiza objetivo, método, resultado e discussão para permitir replicação.",
        keys: [
          "Método precisa permitir repetição.",
          "Resultado se separa de interpretação.",
          "Referência sustenta o que é dito.",
        ],
        mistake: "Misturar resultado com opinião na seção de resultados.",
        q: {
          q: "O que a seção de método precisa garantir?",
          o: ["Que outro grupo consiga repetir o experimento", "Que o texto fique curto", "Que a conclusão apareça", "Que o autor seja citado", "Que o gráfico seja bonito", "Que a introdução seja longa"],
          a: 0,
          why: "Reprodutibilidade é o critério: sem método claro, o resultado não é verificável.",
        },
      },
      {
        name: "Incerteza explicada",
        def: "Comunicar incerteza é dizer o que a medida garante e o quanto ela pode variar, sem prometer precisão falsa.",
        keys: [
          "Intervalo de confiança dá faixa provável.",
          "Algarismos significativos acompanham a precisão.",
          "Arredondar demais mente sobre a qualidade.",
        ],
        mistake: "Apresentar número com cinco casas quando a medida só sustenta duas.",
        q: {
          q: "O que um intervalo de confiança informa?",
          o: ["A faixa provável do valor, com nível de confiança", "O valor exato", "A causa do fenômeno", "O erro zero", "A opinião do autor", "O tempo do experimento"],
          a: 0,
          why: "Ele expressa incerteza estatística, não certeza absoluta.",
        },
      },
    ],
    "inter-chem-cs": [
      {
        name: "Quimioinformática",
        def: "Em química computacional, moléculas viram dados e modelos preveem propriedades sem sintetizar tudo.",
        keys: [
          "Representação precisa ser fiel o bastante.",
          "Dados de treino definem o alcance do modelo.",
          "Previsão aponta candidato, não substitui ensaio.",
        ],
        mistake: "Confiar em modelo treinado só com uma classe de compostos.",
        q: {
          q: "O que a previsão computacional dá antes do ensaio?",
          o: ["Um candidato provável, que ainda precisa ser testado", "A certeza do resultado", "A síntese pronta", "O preço do frasco", "A cor final", "A patente"],
          a: 0,
          why: "O modelo reduz o espaço de busca; a confirmação continua experimental.",
        },
      },
      {
        name: "Automação de laboratório",
        def: "Robôs e software executam síntese e análise em série, aumentando repetição e reduzindo erro manual.",
        keys: [
          "Automação exige protocolo explícito.",
          "Sensores realimentam o processo.",
          "Falha de calibração escala rápido em série.",
        ],
        mistake: "Automatizar processo que ninguém documentou ainda.",
        q: {
          q: "O que a automação de laboratório exige do protocolo?",
          o: ["Estar explícito e repetível", "Ser secreto", "Mudar a cada execução", "Ser oral", "Depender do operador", "Dispensar medida"],
          a: 0,
          why: "A máquina executa o que foi descrito; protocolo ambíguo vira erro automático.",
        },
      },
      {
        name: "Busca de materiais",
        def: "Descoberta de materiais combina simulação, banco de dados e aprendizado para achar composição com a propriedade desejada.",
        keys: [
          "Descrição da estrutura é o ponto de partida.",
          "Custo da simulação limita a varredura.",
          "Filtro por estabilidade evita candidato impossível.",
        ],
        mistake: "Buscar só pela propriedade e ignorar se o material é estável.",
        q: {
          q: "Por que filtrar candidatos por estabilidade?",
          o: ["Para não propor material que não existe nas condições de uso", "Para acelerar a impressão", "Para reduzir a cor", "Para aumentar a massa", "Para escolher o fornecedor", "Para medir a dureza"],
          a: 0,
          why: "Sem estabilidade termodinâmica, a propriedade prevista não se sustenta no mundo real.",
        },
      },
    ],
    "inter-chem-lingua": [
      {
        name: "Nomenclatura",
        def: "Nomenclatura química é língua técnica: regra estável para nomear substância sem ambiguidade.",
        keys: [
          "Nome segue regra de IUPAC.",
          "Prefixo indica quantidade de átomos.",
          "Nome ambíguo causa risco em laboratório.",
        ],
        mistake: "Usar nome popular em vez do nome técnico em documento oficial.",
        q: {
          q: "Por que a nomenclatura química precisa ser estável?",
          o: ["Para identificar a substância sem ambiguidade", "Para ficar mais bonita", "Para encurtar o texto", "Para traduzir fácil", "Para dispensar a fórmula", "Para escolher a cor"],
          a: 0,
          why: "Nome único evita confundir substância diferente em situação de risco.",
        },
      },
      {
        name: "Relatório de laboratório",
        def: "Relatório registra objetivo, método, dados, análise e conclusão, de forma que outra pessoa refaça o trabalho.",
        keys: [
          "Dado bruto deve ser registrado.",
          "Análise interpreta o dado, sem esconder desvio.",
          "Conclusão responde ao objetivo inicial.",
        ],
        mistake: "Contar só o resultado que deu certo e omitir as medidas fora da curva.",
        q: {
          q: "O que um relatório de laboratório precisa registrar?",
          o: ["Os dados obtidos, inclusive os desvios", "Só o melhor resultado", "A opinião do professor", "A nota esperada", "O resumo do manual", "A lista de compras"],
          a: 0,
          why: "O registro completo é o que permite avaliar erro e refazer o experimento.",
        },
      },
      {
        name: "Comunicação de risco",
        def: "Rotulagem e ficha de segurança comunicam perigo com símbolo, palavra de advertência e instrução clara.",
        keys: [
          "Pictograma tem significado padronizado.",
          "Palavra de advertência indica gravidade.",
          "Instrução de primeiros socorros acompanha o produto.",
        ],
        mistake: "Trocar o símbolo por desenho livre e perder o padrão.",
        q: {
          q: "Para que serve o pictograma de perigo no rótulo?",
          o: ["Indicar o tipo de risco de forma padronizada", "Decorar o frasco", "Mostrar a marca", "Informar o preço", "Indicar a validade", "Traduzir o nome"],
          a: 0,
          why: "O símbolo é reconhecido independente da língua e alerta o risco antes da leitura.",
        },
      },
    ],
    "inter-cs-lingua": [
      {
        name: "Processamento de linguagem",
        def: "Processamento de linguagem natural ensina a máquina a analisar e gerar língua, com tokenização, modelo e avaliação.",
        keys: [
          "Token é a unidade que o modelo processa.",
          "Contexto muda a interpretação da palavra.",
          "Avaliação precisa de conjunto de referência.",
        ],
        mistake: "Medir qualidade do modelo só com exemplos que ele já viu.",
        q: {
          q: "O que é tokenização?",
          o: ["Quebrar o texto em unidades que o modelo processa", "Traduzir a frase", "Corrigir a gramática", "Resumir o texto", "Medir o sentimento", "Gerar imagem"],
          a: 0,
          why: "O modelo trabalha sobre tokens, não sobre letras ou palavras soltas necessariamente.",
        },
      },
      {
        name: "Fala e voz",
        def: "Reconhecimento de fala converte áudio em texto; síntese faz o caminho inverso. Ruído e sotaque são desafios reais.",
        keys: [
          "Áudio vira espectro antes do modelo.",
          "Sotaque e ruído afetam a taxa de erro.",
          "Síntese de voz precisa de prosódia natural.",
        ],
        mistake: "Testar reconhecimento só com gravação limpa de estúdio.",
        q: {
          q: "Que fator mais atrapalha reconhecimento de fala no uso real?",
          o: ["Ruído e variação de sotaque", "A cor do microfone", "O tamanho do arquivo", "A marca do computador", "A hora do dia", "O tipo de teclado"],
          a: 0,
          why: "O modelo treinado em áudio limpo erra mais quando há ruído e sotaque fora do padrão.",
        },
      },
      {
        name: "Busca semântica",
        def: "Busca semântica encontra por sentido usando vetores, não por palavra exata.",
        keys: [
          "Embedding transforma texto em vetor.",
          "Distância entre vetores mede proximidade de sentido.",
          "Busca por palavra exata e por sentido se complementam.",
        ],
        mistake: "Achar que busca semântica substitui a busca exata em nome próprio e código.",
        q: {
          q: "Como a busca semântica encontra texto parecido sem a mesma palavra?",
          o: ["Comparando vetores de sentido", "Contando letras iguais", "Ordenando o alfabeto", "Somando as palavras", "Traduzindo primeiro", "Usando só sinônimo"],
          a: 0,
          why: "O embedding aproxima textos de significado parecido mesmo com vocabulário diferente.",
        },
      },
    ],
    "inter-todas": [
      {
        name: "IA científica",
        def: "IA científica combina dados, simulação e conhecimento de domínio para acelerar descoberta em física e química.",
        keys: [
          "Modelo sem conhecimento de domínio erra o plausível.",
          "Dado experimental valida a previsão.",
          "Colaboração entre especialistas e cientistas de dados é necessária.",
        ],
        mistake: "Aceitar previsão do modelo que viola lei física conhecida.",
        q: {
          q: "Por que a IA científica precisa de conhecimento de domínio?",
          o: ["Para descartar previsão que viola lei conhecida", "Para treinar mais rápido", "Para reduzir a memória", "Para escolher a cor", "Para traduzir artigo", "Para imprimir gráfico"],
          a: 0,
          why: "Sem restrição física, o modelo pode propor algo matematicamente plausível e fisicamente impossível.",
        },
      },
      {
        name: "Descoberta de materiais",
        def: "Descobrir material novo junta simulação, banco de dados, aprendizado e ensaio de laboratório em ciclo.",
        keys: [
          "Ciclo fecha com a síntese e a medida.",
          "Custo do ensaio limita quantos candidatos testar.",
          "Registro do experimento alimenta o próximo passo.",
        ],
        mistake: "Parar na simulação e anunciar material sem síntese.",
        q: {
          q: "O que fecha o ciclo de descoberta de material?",
          o: ["A síntese e a medida experimental", "O gráfico da simulação", "O artigo publicado", "O financiamento", "A patente", "O banco de dados"],
          a: 0,
          why: "Sem síntese e medida, o candidato continua hipótese.",
        },
      },
      {
        name: "Ciência aberta",
        def: "Ciência aberta compartilha dados, código e método para permitir reprodução e reuso por outros grupos.",
        keys: [
          "Dados abertos precisam de licença e contexto.",
          "Código reproduzível inclui ambiente e versão.",
          "Documentação é parte do resultado.",
        ],
        mistake: "Publicar dado sem dicionário e achar que está aberto.",
        q: {
          q: "O que torna um conjunto de dados realmente reutilizável?",
          o: ["Licença, dicionário e contexto de coleta", "Só o arquivo compactado", "Apenas o link", "Apenas o gráfico", "A senha do servidor", "O nome do autor"],
          a: 0,
          why: "Sem contexto e dicionário, quem recebe o dado não sabe o que cada campo significa.",
        },
      },
    ],
  },
};

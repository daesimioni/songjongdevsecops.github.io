// O banco de conteúdo do catálogo. Cada tópico vira uma estação (página),
// uma pergunta de monstro (uma por dificuldade) e matéria-prima de missão.
// O gerador transforma isto em área, caverna, caçada, NPC e missão.

export const BANK = {
  math: {
    "math-fundamentos": [
      {
        name: "Lógica e conectivos",
        def: "Lógica é o estudo das formas válidas de tirar conclusão. Os conectivos montam frases compostas: negação, conjunção, disjunção, condicional e bicondicional.",
        keys: [
          "A negação inverte o valor de verdade da proposição.",
          "A conjunção só é verdadeira quando as duas partes são verdadeiras.",
          "A condicional é falsa apenas quando o antecedente é verdadeiro e o consequente é falso.",
        ],
        mistake: "Confundir a condicional com sua recíproca: P→Q não é a mesma coisa que Q→P.",
        q: {
          q: "Quando a condicional P→Q é falsa?",
          o: ["Quando P é verdadeira e Q é falsa", "Quando P e Q são verdadeiras", "Quando P é falsa e Q é verdadeira", "Quando as duas são falsas", "Quando P e Q são equivalentes", "Quando Q implica P"],
          a: 0,
          why: "A implicação só quebra com antecedente verdadeiro e consequente falso. Nos outros casos ela é verdadeira.",
        },
      },
      {
        name: "Conjuntos e relações",
        def: "Conjunto é coleção de elementos. Relações ligam elementos de dois conjuntos por pares ordenados; funções são relações em que cada entrada tem uma única saída.",
        keys: [
          "União junta os elementos; interseção mantém só os comuns.",
          "Relação de equivalência é reflexiva, simétrica e transitiva.",
          "Cardinalidade conta elementos e distingue conjuntos finitos de infinitos.",
        ],
        mistake: "Achar que todo conjunto infinito tem a mesma cardinalidade: os reais não são enumeráveis.",
        q: {
          q: "O que caracteriza uma relação de equivalência?",
          o: ["Ser reflexiva, simétrica e transitiva", "Ser apenas simétrica", "Ser uma função injetora", "Ser transitiva e antissimétrica", "Ser uma relação de ordem total", "Ser bijetora"],
          a: 0,
          why: "As três propriedades juntas permitem agrupar os elementos em classes de equivalência.",
        },
      },
      {
        name: "Métodos de demonstração",
        def: "Demonstrar é justificar uma afirmação a partir de axiomas e resultados já provados. Cada método serve a um tipo de afirmação.",
        keys: [
          "Prova direta encadeia implicações até a conclusão.",
          "Contraposição prova ¬Q→¬P no lugar de P→Q.",
          "Indução prova caso base e o passo de n para n+1.",
        ],
        mistake: "Usar indução sem o caso base, o que deixa a corrente sem começo.",
        q: {
          q: "Para provar por indução que uma propriedade vale para todo natural, o que é necessário?",
          o: ["Provar o caso base e o passo de n para n+1", "Provar só para n igual a mil", "Provar por contradição uma vez", "Dar um exemplo grande", "Supor a propriedade falsa e parar", "Provar para todos os reais"],
          a: 0,
          why: "Caso base mais passo indutivo sustentam toda a cadeia dos naturais.",
        },
      },
    ],
    "math-aritmetica": [
      {
        name: "Sistemas numéricos",
        def: "Os números se organizam em naturais, inteiros, racionais, irracionais e reais. Cada conjunto amplia o anterior para resolver operações que antes não fechavam.",
        keys: [
          "Racionais são frações de inteiros; irracionais não podem ser escritos assim.",
          "Todo inteiro é racional, mas nem todo racional é inteiro.",
          "A reta real junta racionais e irracionais sem buracos.",
        ],
        mistake: "Chamar de irracional todo número com infinitas casas decimais: 1/3 tem infinitas e é racional.",
        q: {
          q: "Qual número é irracional?",
          o: ["A raiz quadrada de 2", "A fração 1/3", "O inteiro -7", "O decimal 0,25", "A fração 22/7", "O zero"],
          a: 0,
          why: "A raiz de 2 não pode ser escrita como fração de inteiros; 22/7 é só uma aproximação de pi.",
        },
      },
      {
        name: "Primos e fatoração",
        def: "Primo é o inteiro maior que um com exatamente dois divisores. Todo inteiro maior que um se decompõe em primos de forma única.",
        keys: [
          "O teorema fundamental da aritmética garante decomposição única.",
          "Crivo de Eratóstenes lista primos por eliminação de múltiplos.",
          "MDC e MMC saem da fatoração em primos.",
        ],
        mistake: "Contar 1 como primo: ele tem um único divisor, então não é.",
        q: {
          q: "Por que 1 não é primo?",
          o: ["Porque tem apenas um divisor, e primo precisa de exatamente dois", "Porque é ímpar", "Porque é menor que 2 e par", "Porque não pode ser fatorado", "Porque é quadrado perfeito", "Porque é negativo"],
          a: 0,
          why: "Primo exige exatamente dois divisores distintos: 1 e ele mesmo. O 1 só tem o divisor 1.",
        },
      },
      {
        name: "Aritmética modular",
        def: "Trabalhar módulo n é olhar só o resto da divisão por n. Somar, subtrair e multiplicar funcionam normalmente; dividir exige cuidado.",
        keys: [
          "Dois números são congruentes módulo n quando têm o mesmo resto.",
          "O relógio é aritmética módulo 12.",
          "Divisão modular exige inverso, que só existe quando o divisor é coprimo de n.",
        ],
        mistake: "Dividir os dois lados de uma congruência sem verificar se o divisor é invertível.",
        q: {
          q: "Quanto é 17 módulo 5?",
          o: ["2", "3", "1", "0", "4", "5"],
          a: 0,
          why: "17 dividido por 5 dá 3 com resto 2, então 17 é congruente a 2 módulo 5.",
        },
      },
    ],
    "math-algebra": [
      {
        name: "Álgebra linear",
        def: "Álgebra linear estuda vetores, matrizes e transformações lineares. É a linguagem de sistemas de equações, gráficos e aprendizado de máquina.",
        keys: [
          "Autovetores são direções que a transformação não gira.",
          "Determinante mede o quanto a transformação escala áreas.",
          "Posto conta quantas direções independentes a matriz tem.",
        ],
        mistake: "Achar que toda matriz tem autovalores reais: rotações podem ter apenas complexos.",
        q: {
          q: "O que um autovetor representa numa transformação linear?",
          o: ["Uma direção que a transformação não muda de sentido", "Um vetor de tamanho zero", "A soma de todas as colunas", "O determinante da matriz", "Uma linha nula da matriz", "Um vetor sempre unitário"],
          a: 0,
          why: "A transformação leva o autovetor na mesma direção, apenas escalando pelo autovalor.",
        },
      },
      {
        name: "Grupos e anéis",
        def: "Grupo é um conjunto com operação associativa, elemento neutro e inverso. Anel junta duas operações, como soma e multiplicação.",
        keys: [
          "Grupos abelianos têm operação comutativa.",
          "Simetrias de um objeto formam grupo.",
          "Corpo é anel em que todo elemento não nulo tem inverso.",
        ],
        mistake: "Exigir comutatividade em todo grupo: a ordem das rotações costuma mudar o resultado.",
        q: {
          q: "O que um grupo precisa ter?",
          o: ["Operação associativa, elemento neutro e inverso", "Apenas uma operação qualquer", "Distributividade e comutatividade", "Um conjunto finito e um produto escalar", "Pelo menos dois elementos", "Uma métrica"],
          a: 0,
          why: "Associatividade, neutro e inverso são os axiomas; comutatividade é um caso especial.",
        },
      },
      {
        name: "Teoria de Galois",
        def: "Teoria de Galois liga equações polinomiais a simetrias. Ela explica por que algumas equações têm solução por radicais e outras não.",
        keys: [
          "Extensões de corpos têm grupo de automorfismos.",
          "Solubilidade por radicais corresponde a grupo solúvel.",
          "Quinta potência em diante pode não ter fórmula por radicais.",
        ],
        mistake: "Concluir que toda equação de grau cinco é insolúvel: algumas têm solução simples.",
        q: {
          q: "O que a teoria de Galois relaciona?",
          o: ["Equações polinomiais e grupos de simetria", "Números primos e logaritmos", "Matrizes e derivadas", "Funções e integrais", "Grafos e cores", "Probabilidade e estatística"],
          a: 0,
          why: "O grupo de Galois de uma extensão descreve as simetrias das raízes do polinômio.",
        },
      },
    ],
    "math-geometria": [
      {
        name: "Geometria euclidiana",
        def: "Geometria euclidiana estuda pontos, retas, planos e figuras com os postulados clássicos. Ângulos, semelhança e congruência vêm daí.",
        keys: [
          "A soma dos ângulos internos de um triângulo é 180 graus.",
          "Teorema de Pitágoras vale em triângulo retângulo.",
          "Área e volume mudam de escala com o quadrado e o cubo do fator.",
        ],
        mistake: "Usar Pitágoras em triângulo que não é retângulo.",
        q: {
          q: "O que o teorema de Pitágoras exige do triângulo?",
          o: ["Que ele tenha um ângulo reto", "Que ele seja equilátero", "Que tenha lados inteiros", "Que seja isósceles", "Que tenha área par", "Que esteja no plano complexo"],
          a: 0,
          why: "A relação entre catetos e hipotenusa vale apenas para triângulos retângulos.",
        },
      },
      {
        name: "Geometria diferencial",
        def: "Geometria diferencial estuda curvas e superfícies com cálculo: curvatura, geodésicas e variedades. É a base da relatividade geral.",
        keys: [
          "Curvatura mede o quanto uma curva se afasta da reta.",
          "Geodésica é o caminho mais curto numa superfície.",
          "Variedade é espaço que localmente parece plano.",
        ],
        mistake: "Tratar o plano de desenho como se fosse sempre o espaço de curvatura zero.",
        q: {
          q: "O que é uma geodésica?",
          o: ["O caminho mais curto entre pontos numa superfície", "Uma reta desenhada no papel", "A maior curva da superfície", "Uma linha de coordenadas fixas", "O contorno fechado da superfície", "Um plano tangente"],
          a: 0,
          why: "Na esfera, geodésicas são arcos de grande círculo; no plano, são retas.",
        },
      },
      {
        name: "Geometria computacional",
        def: "Geometria computacional resolve problemas geométricos por algoritmos: envoltórias, triangulações, interseções e vizinhança.",
        keys: [
          "Envoltória convexa é o menor polígono que contém todos os pontos.",
          "Diagrama de Voronoi divide o plano pela proximidade dos pontos.",
          "Triangulação decompõe região em triângulos sem sobreposição.",
        ],
        mistake: "Ignorar casos degenerados: três pontos colineares quebram algoritmos ingênuos.",
        q: {
          q: "O que o diagrama de Voronoi representa?",
          o: ["As regiões mais próximas de cada ponto", "A reta que passa por todos os pontos", "A área total do polígono", "A maior distância entre dois pontos", "O número de triângulos possíveis", "A mediana das coordenadas"],
          a: 0,
          why: "Cada célula reúne os pontos do plano cujo vizinho mais próximo é um determinado ponto de referência.",
        },
      },
    ],
    "math-topologia": [
      {
        name: "Espaços topológicos",
        def: "Topologia estuda o que se conserva quando a forma pode esticar sem rasgar. Abertos, fechados, continuidade e conexidade vêm dos axiomas.",
        keys: [
          "Homeomorfismo é transformação contínua com inversa contínua.",
          "Compacidade generaliza conjuntos fechados e limitados.",
          "Conexidade impede separar o espaço em duas partes abertas.",
        ],
        mistake: "Pensar que todo espaço topológico é um espaço métrico.",
        q: {
          q: "O que um homeomorfismo preserva?",
          o: ["A estrutura topológica dos espaços", "As distâncias exatas", "Os ângulos", "As áreas", "As coordenadas", "As retas paralelas"],
          a: 0,
          why: "Homeomorfismos podem esticar e torcer; o que se conserva é a vizinhança, não a métrica.",
        },
      },
      {
        name: "Homologia e nós",
        def: "Homologia conta buracos em diferentes dimensões por meio de cadeias e grupos. Teoria dos nós classifica laços no espaço tridimensional.",
        keys: [
          "Primeiro grupo de homologia conta buracos em anel.",
          "Nó de trevo não é o nó trivial, e isso exige invariante.",
          "Polinômio de Jones é invariante de nós.",
        ],
        mistake: "Achar que homologia distingue todas as formas: espaços diferentes podem ter a mesma homologia.",
        q: {
          q: "Para que serve um invariante de nós?",
          o: ["Provar que dois nós não podem ser deformados um no outro", "Desenhar o nó mais rápido", "Calcular o comprimento da corda", "Medir a espessura do nó", "Contar os cruzamentos sempre", "Prever a cor da corda"],
          a: 0,
          why: "Se o invariante muda, os nós são diferentes; se não muda, o invariante não decide.",
        },
      },
      {
        name: "Análise topológica de dados",
        def: "Análise topológica de dados usa formas contínuas para resumir dados: componentes, buracos e persistência de features em diversas escalas.",
        keys: [
          "Homologia persistente acompanha buracos que nascem e morrem.",
          "Complexo de Vietoris-Rips conecta pontos próximos.",
          "Persistência separa estrutura real de ruído.",
        ],
        mistake: "Ler persistência como prova estatística de um fenômeno.",
        q: {
          q: "O que a homologia persistente mede?",
          o: ["Quais buracos sobrevivem em várias escalas de análise", "A média dos dados", "O desvio padrão das variáveis", "A correlação entre colunas", "A quantidade de linhas da tabela", "A velocidade do cálculo"],
          a: 0,
          why: "A persistência mostra quais features permanecem estáveis quando a escala muda.",
        },
      },
    ],
    "math-edo": [
      {
        name: "Equações diferenciais",
        def: "Equação diferencial relaciona uma função e suas derivadas. Descreve crescimento, decaimento, oscilação e difusão.",
        keys: [
          "Ordem da equação é a maior derivada presente.",
          "Equação linear tem solução geral como soma de particular e homogênea.",
          "Condições iniciais escolhem uma solução dentro da família.",
        ],
        mistake: "Esquecer as condições iniciais e achar que a solução geral é a resposta do problema.",
        q: {
          q: "Para que serve uma condição inicial numa EDO?",
          o: ["Para escolher uma solução entre as infinitas possíveis", "Para aumentar a ordem da equação", "Para transformar a equação em integral", "Para eliminar a derivada", "Para tornar a equação não linear", "Para definir o domínio da função"],
          a: 0,
          why: "A solução geral traz constantes; a condição inicial fixa o valor delas.",
        },
      },
      {
        name: "Sistemas dinâmicos",
        def: "Sistema dinâmico descreve a evolução de um estado no tempo. Pontos fixos, ciclos e estabilidade dizem o destino do sistema.",
        keys: [
          "Ponto fixo é estado que não muda.",
          "Estabilidade indica se perturbações pequenas desaparecem.",
          "Bifurcação é mudança qualitativa quando um parâmetro varia.",
        ],
        mistake: "Concluir estabilidade pelo gráfico de uma única simulação.",
        q: {
          q: "O que é um ponto fixo de um sistema dinâmico?",
          o: ["Um estado que permanece igual ao longo do tempo", "Um ponto onde a derivada é máxima", "O maior valor da trajetória", "Um ponto que nunca é visitado", "Um estado com energia infinita", "O centro geométrico do plano"],
          a: 0,
          why: "No ponto fixo a dinâmica não move o estado: ele é solução constante.",
        },
      },
      {
        name: "Caos determinístico",
        def: "Caos é sensibilidade extrema às condições iniciais em sistema determinístico. Trajetórias próximas se separam exponencialmente.",
        keys: [
          "Expoente de Lyapunov positivo indica caos.",
          "Atrator estranho tem estrutura fractal.",
          "Determinismo não garante previsão de longo prazo.",
        ],
        mistake: "Confundir caos com aleatoriedade: o sistema é determinístico.",
        q: {
          q: "Por que um sistema caótico é difícil de prever?",
          o: ["Pequenos erros iniciais crescem muito rápido", "Porque tem números aleatórios na equação", "Porque não tem equação", "Porque o tempo para de passar", "Porque a solução é sempre infinita", "Porque a derivada não existe"],
          a: 0,
          why: "A sensibilidade às condições iniciais amplifica o erro de medição até ele dominar a previsão.",
        },
      },
    ],
    "math-discreta": [
      {
        name: "Combinatória",
        def: "Combinatória conta arranjos, escolhas e estruturas finitas. Permutação ordena; combinação só escolhe.",
        keys: [
          "Permutação importa ordem; combinação não.",
          "Princípio multiplicativo encadeia escolhas independentes.",
          "Inclusão-exclusão corrige contagens duplicadas.",
        ],
        mistake: "Usar combinação quando a ordem muda o resultado.",
        q: {
          q: "Quantas comissões de 2 pessoas saem de um grupo de 5?",
          o: ["10", "20", "25", "5", "15", "32"],
          a: 0,
          why: "Escolher 2 entre 5 sem ordem é C(5,2) = 10.",
        },
      },
      {
        name: "Teoria dos grafos",
        def: "Grafo é conjunto de vértices ligados por arestas. Modela redes, rotas, dependências e amizades.",
        keys: [
          "Caminho é sequência de arestas que liga vértices.",
          "Árvore é grafo conexo sem ciclo.",
          "Coloração atribui cores a vértices vizinhos diferentes.",
        ],
        mistake: "Achar que grafo sem ciclo é sempre árvore: precisa ser conexo.",
        q: {
          q: "O que caracteriza uma árvore?",
          o: ["Ser conexa e não ter ciclo", "Ter exatamente um ciclo", "Ter todos os vértices isolados", "Ser sempre completa", "Ter mais arestas que vértices", "Não ter caminho entre vértices"],
          a: 0,
          why: "Conexidade mais ausência de ciclos é a definição; sem conexão vira floresta.",
        },
      },
      {
        name: "Códigos corretores",
        def: "Código corretor adiciona redundância para detectar e corrigir erros de transmissão. Distância mínima define quantos erros cabem.",
        keys: [
          "Distância de Hamming conta posições diferentes.",
          "Para corrigir t erros, a distância mínima precisa ser 2t+1.",
          "Reed-Solomon é usado em disco, QR e transmissão.",
        ],
        mistake: "Achar que detectar erro é o mesmo que corrigir erro.",
        q: {
          q: "O que a distância mínima de um código limita?",
          o: ["Quantos erros ele consegue corrigir", "O tamanho do arquivo", "A velocidade da rede", "O número de usuários", "A cor do QR code", "A temperatura do disco"],
          a: 0,
          why: "A distância mínima d permite corrigir até (d-1)/2 erros por palavra.",
        },
      },
    ],
    "math-otimizacao": [
      {
        name: "Otimização convexa",
        def: "Otimização busca o melhor valor de uma função sujeita a restrições. Em problemas convexos, todo mínimo local é global.",
        keys: [
          "Função convexa tem um único vale, sem mínimos locais falsos.",
          "Restrições definem a região viável.",
          "Multiplicadores de Lagrange tratam restrições de igualdade.",
        ],
        mistake: "Tratar problema não convexo como se o mínimo local fosse o global.",
        q: {
          q: "Por que a convexidade ajuda na otimização?",
          o: ["Porque todo mínimo local também é global", "Porque elimina as restrições", "Porque dispensa cálculo", "Porque garante solução inteira", "Porque a função fica constante", "Porque o problema vira linear"],
          a: 0,
          why: "A forma convexa impede vales falsos, então o algoritmo não fica preso num mínimo pior.",
        },
      },
      {
        name: "Pesquisa operacional",
        def: "Pesquisa operacional aplica modelos matemáticos à decisão: filas, transporte, alocação e escalonamento.",
        keys: [
          "Programação linear otimiza função linear com restrições lineares.",
          "Teoria das filas estuda espera e atendimento.",
          "Problema de transporte minimiza custo entre origens e destinos.",
        ],
        mistake: "Arredondar a solução linear sem verificar se continua viável no problema inteiro.",
        q: {
          q: "O que a teoria das filas estuda?",
          o: ["Espera e atendimento em sistemas com chegadas", "Cores de gráficos", "Derivadas de polinômios", "Números primos", "Formas topológicas", "Criptografia"],
          a: 0,
          why: "Ela modela chegadas, serviço e tempo de espera para dimensionar sistemas.",
        },
      },
      {
        name: "Análise numérica",
        def: "Análise numérica resolve problemas por aproximação controlada, com atenção a erro, estabilidade e custo computacional.",
        keys: [
          "Erro de arredondamento cresce com o número de operações.",
          "Método estável não amplifica perturbações.",
          "Condicionamento mede a sensibilidade do problema à entrada.",
        ],
        mistake: "Escolher algoritmo pela velocidade sem olhar estabilidade numérica.",
        q: {
          q: "O que é um método numericamente estável?",
          o: ["Aquele que não amplifica pequenos erros", "Aquele que sempre dá resultado exato", "Aquele que usa menos memória", "Aquele que dispensa iteração", "Aquele que só funciona em inteiros", "Aquele que não tem erro de entrada"],
          a: 0,
          why: "Estabilidade é sobre o crescimento do erro durante as contas, não sobre a existência do erro.",
        },
      },
    ],
    "math-aplicada": [
      {
        name: "Teoria dos jogos",
        def: "Teoria dos jogos estuda decisões em que o resultado depende das escolhas de vários agentes. Equilíbrio de Nash é o ponto em que ninguém melhora mudando sozinho.",
        keys: [
          "Jogo cooperativo permite acordos; não cooperativo não.",
          "Estratégia dominante é melhor qualquer que seja a escolha do outro.",
          "Dilema do prisioneiro mostra equilíbrio pior que a cooperação.",
        ],
        mistake: "Confundir equilíbrio de Nash com resultado ótimo para todos.",
        q: {
          q: "O que é um equilíbrio de Nash?",
          o: ["Situação em que ninguém ganha mudando sozinho de estratégia", "O resultado com maior soma de pontos", "O jogo sem vencedor", "A estratégia mais arriscada", "O ponto de partida do jogo", "A média dos resultados"],
          a: 0,
          why: "No equilíbrio, cada jogador está fazendo o melhor que pode dada a escolha dos outros.",
        },
      },
      {
        name: "Criptografia matemática",
        def: "Criptografia usa problemas difíceis, como fatorar números grandes, para proteger informação. A segurança mora na dificuldade computacional.",
        keys: [
          "RSA depende da dificuldade de fatorar produtos de primos grandes.",
          "Troca de chaves Diffie-Hellman usa logaritmo discreto.",
          "Chave curta reduz a segurança mesmo com algoritmo bom.",
        ],
        mistake: "Achar que esconder o algoritmo protege: a segurança deve estar na chave.",
        q: {
          q: "Em que dificuldade o RSA se apoia?",
          o: ["Fatorar números grandes em primos", "Somar matrizes grandes", "Ordenar listas longas", "Calcular raízes exatas", "Desenhar grafos", "Contar permutações"],
          a: 0,
          why: "Sem a chave privada, recuperar a mensagem exige fatorar o módulo público, problema caro para primos grandes.",
        },
      },
      {
        name: "Matemática biológica",
        def: "Modelos matemáticos descrevem população, epidemia, competição e difusão em sistemas vivos. Equações traduzem hipóteses biológicas.",
        keys: [
          "Modelo SIR divide a população em suscetíveis, infectados e recuperados.",
          "Número reprodutivo básico mede o potencial de contágio.",
          "Modelos são aproximações e pedem validação com dados.",
        ],
        mistake: "Tomar o modelo como verdade sem confrontar com os dados reais.",
        q: {
          q: "O que o número reprodutivo básico R0 indica?",
          o: ["Quantas pessoas em média um infectado contagia", "A taxa de mortalidade", "O tempo de cura", "A quantidade de vacinas", "O total de suscetíveis", "A velocidade do vírus"],
          a: 0,
          why: "R0 acima de 1 indica crescimento do contágio; abaixo de 1, retração.",
        },
      },
    ],
  },
};

// Texto curado de Matemática: uma abertura, uma prática e um erro comum para
// cada subárea. É o que transforma a lista de tópicos em aula.

export const MATH_TEXT = {
  "Lógica matemática": {
    abre: "Lógica matemática estuda quando uma conclusão decorre mesmo das premissas, e não quando ela apenas parece verdadeira. O caminho vai dos conectivos e quantificadores até sistemas formais, completude e decidibilidade.",
    pratica: "Escreva um argumento de duas premissas, traduza para símbolos e procure uma atribuição de valores que deixe as premissas verdadeiras e a conclusão falsa.",
    erro: "Confundir validade com verdade: um argumento pode ser válido e partir de uma premissa falsa.",
  },
  "Teoria dos conjuntos": {
    abre: "A teoria dos conjuntos é a linguagem em que quase toda a matemática é escrita. Ela organiza coleções, funções, relações e tamanhos, inclusive os infinitos que não cabem em lista.",
    pratica: "Compare os conjuntos dos números naturais e dos racionais: construa uma enumeração dos racionais e explique por que os reais não admitem uma.",
    erro: "Tratar conjunto como sacola sem regra: o conjunto dos números grandes não existe, porque a condição precisa ser precisa.",
  },
  "Métodos de demonstração": {
    abre: "Demonstrar é encadear afirmações até que a conclusão seja inevitável. Os métodos diretos, a contraposição, a contradição e a indução cobrem boa parte do que se faz em matemática.",
    pratica: "Prove por indução que a soma dos primeiros n ímpares é n ao quadrado, escrevendo a base, a hipótese e o passo.",
    erro: "Usar a tese como hipótese: começar a prova supondo exatamente o que se quer provar.",
  },
  "Linguagem e representação": {
    abre: "Notação é ferramenta de pensamento: uma definição bem escrita economiza páginas de discussão. Esta subárea trata de símbolos, definições, teoremas e da passagem do concreto para o abstrato.",
    pratica: "Pegue um teorema conhecido e reescreva enunciado, hipóteses e tese em uma notação só sua, sem consultar o original.",
    erro: "Confundir definição com resultado: uma definição escolhe um nome, não descobre uma verdade.",
  },
  "História, filosofia e fundamentos da matemática": {
    abre: "A matemática tem história e disputas: números que demoraram a ser aceitos, crises nos fundamentos e escolas que discordam sobre o que existe. Entender isso evita tratar a notação atual como natural.",
    pratica: "Escolha uma crise, como a descoberta dos irracionais ou o paradoxo de Russell, e conte o que mudou na prática dos matemáticos depois dela.",
    erro: "Decorar nomes e datas sem ligar a mudança conceitual que cada episódio produziu.",
  },
  "Aritmética": {
    abre: "A aritmética é o chão de tudo: operações, frações, razões e porcentagens aparecem em qualquer conta séria. Dominar as propriedades evita decorar regras soltas.",
    pratica: "Resolva o mesmo problema de porcentagem por regra de três e por fator multiplicativo, e compare os dois raciocínios.",
    erro: "Somar porcentagens como se fossem números comuns: dois aumentos de 10 por cento não dão 20 por cento.",
  },
  "Sistemas numéricos": {
    abre: "Naturais, inteiros, racionais, irracionais e complexos resolvem necessidades diferentes. Cada ampliação nasce de uma operação que deixa de ter resposta no conjunto anterior.",
    pratica: "Para cada conjunto, escreva uma equação que tem solução nele e outra que só tem solução no conjunto seguinte.",
    erro: "Achar que irracional é número que não termina: dízimas periódicas são racionais.",
  },
  "Teoria elementar dos números": {
    abre: "Primos, divisibilidade e congruências formam a parte mais antiga e mais usada da teoria dos números. A aritmética modular transforma resto de divisão em uma ferramenta de cálculo.",
    pratica: "Calcule o resto de 2 elevado a 100 por 7 usando o ciclo das potências módulo 7, sem calcular a potência inteira.",
    erro: "Cancelar fatores em congruência sem verificar se o módulo e o fator são coprimos.",
  },
  "Teoria analítica dos números": {
    abre: "A teoria analítica leva cálculo e análise complexa para dentro dos números inteiros. Funções como a zeta de Riemann conectam contagem de primos a propriedades de funções suaves.",
    pratica: "Estude a série de Dirichlet da função zeta e veja como o produto de Euler traduz fatoração única em soma de potências.",
    erro: "Tratar a continuação analítica da zeta como se fosse a mesma série, que só converge em parte do plano.",
  },
  "Teoria algébrica dos números": {
    abre: "A teoria algébrica dos números amplia os inteiros para corpos numéricos e estuda como a fatoração se comporta lá. O que era único em Z pode se quebrar em ideais e classes.",
    pratica: "No anel dos inteiros de um corpo quadrático, procure um número com duas fatorações diferentes e explique o papel dos ideais.",
    erro: "Supor que todo anel de inteiros algébricos tem fatoração única.",
  },
  "Teoria transcendental dos números": {
    abre: "Nem todo número real é raiz de um polinômio com coeficientes inteiros. A teoria transcendental mede o quanto certos números escapam da álgebra e usa aproximações diofantinas para provar isso.",
    pratica: "Reveja a prova de que e é irracional e aponte exatamente onde a hipótese de racionalidade é usada.",
    erro: "Concluir transcendência a partir de irracionalidade: a raiz de dois é irracional e algébrica.",
  },
  "Matemática comercial e financeira": {
    abre: "Juros, descontos, taxas e amortização são matemática aplicada a decisões de dinheiro. O ponto central é comparar valores que acontecem em datas diferentes.",
    pratica: "Compare um financiamento pelo sistema de amortização constante e pela tabela Price, olhando o total pago e o saldo devedor mês a mês.",
    erro: "Somar taxas mensais para obter a anual: juros compostos se multiplicam, não se somam.",
  },
  "Álgebra elementar": {
    abre: "A álgebra elementar troca números por letras para descrever padrões e resolver equações. Fatorar, expandir e resolver sistemas são as operações que sustentam o resto da álgebra.",
    pratica: "Fatore uma expressão do segundo grau por dois caminhos, produto notável e completar quadrado, e confira as raízes.",
    erro: "Cortar termos em uma fração algébrica: só fatores podem ser cancelados.",
  },
  "Álgebra linear": {
    abre: "Vetores, matrizes e transformações lineares aparecem em gráficos, equações e aprendizado de máquina. A álgebra linear procura as direções que uma transformação preserva ou estica.",
    pratica: "Resolva um sistema 3 por 3 por eliminação, depois interprete a solução como interseção de planos.",
    erro: "Multiplicar matrizes na ordem trocada: o produto não é comutativo.",
  },
  "Álgebra abstrata": {
    abre: "Grupos, anéis e corpos capturam o que diferentes estruturas têm em comum. A abstração permite provar um resultado uma vez e aplicá-lo em muitos lugares.",
    pratica: "Verifique os axiomas de grupo para as simetrias de um triângulo e identifique os elementos de ordem 2.",
    erro: "Achar que todo conjunto com operação é grupo: falta inverso, identidade ou associatividade.",
  },
  "Teoria de grupos": {
    abre: "A teoria de grupos estuda simetrias e as regras que elas seguem. Grupos finitos, abelianos, de permutações e de Lie descrevem desde cristais até partículas.",
    pratica: "Monte a tabela de multiplicação do grupo de permutações de três elementos e localize os subgrupos.",
    erro: "Confundir ordem de um elemento com ordem do grupo.",
  },
  "Álgebra comutativa": {
    abre: "A álgebra comutativa estuda anéis em que a multiplicação não se importa com a ordem. Ideais, localização e módulos traduzem geometria em linguagem algébrica.",
    pratica: "Descreva os ideais primos de um anel de polinômios em uma variável e relacione cada um a um ponto.",
    erro: "Tratar ideal como subanel: a multiplicação por qualquer elemento do anel precisa continuar dentro.",
  },
  "Álgebra não comutativa": {
    abre: "Quando a ordem da multiplicação importa, entram matrizes, operadores e álgebras de Lie. Essa área estuda estruturas em que ab e ba podem ser diferentes.",
    pratica: "Encontre duas matrizes 2 por 2 cujo comutador não é zero e interprete o que ele mede.",
    erro: "Reutilizar sem cuidado teoremas da álgebra comutativa em anéis não comutativos.",
  },
  "Álgebra homológica": {
    abre: "A álgebra homológica mede o que não fecha exatamente em sequências de módulos. Complexos, homologia e functores derivados transformam obstruções em invariantes.",
    pratica: "Calcule a homologia de um complexo simples de dois termos e explique o que o núcleo e a imagem dizem.",
    erro: "Achar que homologia sempre detecta buracos geométricos: ela depende do complexo escolhido.",
  },
  "Teoria de representações": {
    abre: "Representar um grupo é fazê-lo agir por transformações lineares. Assim, perguntas sobre simetria viram perguntas sobre matrizes, caracteres e módulos irredutíveis.",
    pratica: "Decomponha a representação de permutações de três elementos em partes irredutíveis e confira as dimensões.",
    erro: "Somar caracteres de representações diferentes como se fossem o mesmo objeto.",
  },
  "Álgebra universal": {
    abre: "A álgebra universal compara estruturas algébricas pela assinatura de operações e identidades. Em vez de estudar grupos ou anéis separadamente, estuda variedades de álgebras.",
    pratica: "Escreva a assinatura de grupos e a de anéis e mostre por que uma não é caso particular da outra sem ajustes.",
    erro: "Chamar de variedade algébrica o mesmo objeto da geometria algébrica: aqui a palavra tem outro sentido.",
  },
  "Teoria de corpos e polinômios": {
    abre: "Corpos e polinômios tratam de raízes, extensões e da impossibilidade de resolver tudo por radicais. A teoria de Galois liga simetrias de raízes à estrutura do corpo.",
    pratica: "Mostre que raiz de dois não pertence aos racionais e descreva a menor extensão que a contém.",
    erro: "Achar que todo polinômio de grau ímpar tem raiz racional: ele tem raiz real, não necessariamente racional.",
  },
  "Teoria das categorias": {
    abre: "A teoria das categorias organiza a matemática por objetos, morfismos e composição. Funtores e transformações naturais comparam estruturas inteiras sem olhar para dentro delas.",
    pratica: "Descreva a categoria dos conjuntos finitos e um funtor que leve cada conjunto ao seu conjunto de partes.",
    erro: "Confundir isomorfismo com igualdade: objetos isomorfos se comportam igual, mas não são o mesmo objeto.",
  },
  "Geometria euclidiana": {
    abre: "A geometria euclidiana constrói figuras com régua, compasso e axiomas. Ângulos, triângulos e polígonos são o laboratório onde a intuição espacial aprende a virar prova.",
    pratica: "Prove que a soma dos ângulos internos de um triângulo é 180 graus usando uma paralela auxiliar.",
    erro: "Usar o quinto postulado sem dizer que está usando: em geometrias não euclidianas a soma muda.",
  },
  "Geometria analítica": {
    abre: "Coordenadas transformam figuras em equações. Retas, cônicas e superfícies passam a ser resolvidas com álgebra, e o desenho vira conferência.",
    pratica: "Encontre a equação da circunferência que passa por três pontos e confira o centro pelas mediatrizes.",
    erro: "Esquecer o sinal ao completar quadrados e deslocar o centro da cônica.",
  },
  "Geometria vetorial": {
    abre: "Vetores dão direção e sentido ao espaço. Produto escalar mede projeção e ângulo, produto vetorial mede área e orientação.",
    pratica: "Calcule a distância de um ponto a um plano usando projeção vetorial e confira com a fórmula da geometria analítica.",
    erro: "Trocar produto escalar por produto vetorial: um dá número, o outro dá vetor.",
  },
  "Geometria diferencial": {
    abre: "A geometria diferencial estuda curvas e superfícies com derivadas. Curvatura, geodésicas e variedades dizem como o espaço se dobra sem precisar de um espaço maior em volta.",
    pratica: "Calcule a curvatura de uma circunferência e de uma hélice e compare o que cada número descreve.",
    erro: "Achar que curvatura zero significa reta: uma superfície plana também tem curvatura zero.",
  },
  "Geometria algébrica": {
    abre: "A geometria algébrica estuda soluções de equações polinomiais como formas geométricas. Variedades, curvas e esquemas unem álgebra comutativa e intuição espacial.",
    pratica: "Desenhe a curva dada por y ao quadrado igual a x ao cubo menos x e identifique onde ela tem componentes.",
    erro: "Desenhar apenas soluções reais e concluir propriedades que valem no plano complexo.",
  },
  "Geometria euclidiana e não euclidiana": {
    abre: "Trocar o postulado das paralelas produz geometrias hiperbólica, elíptica, projetiva e afim. Cada uma tem noção própria de distância, ângulo e reta.",
    pratica: "No modelo do disco de Poincaré, trace duas retas que não se cruzam e verifique o que isso faz com a soma dos ângulos de um triângulo.",
    erro: "Usar desenhos euclidianos para provar afirmações hiperbólicas sem passar pelo modelo.",
  },
  "Geometria topológica": {
    abre: "A geometria topológica estuda propriedades que sobrevivem a deformações contínuas. Superfícies, invariantes e variedades mostram o que é forma e o que é detalhe métrico.",
    pratica: "Classifique uma xícara e uma rosquinha pelo número de furos e explique por que a classificação não usa distância.",
    erro: "Achar que toda deformação vale: cortar e colar muda a topologia.",
  },
  "Geometria simplética e complexa": {
    abre: "Estruturas simpléticas e complexas aparecem na mecânica clássica e na geometria de variedades. Elas dão uma noção de área e de rotação que não depende de métrica.",
    pratica: "Escreva a forma simplética padrão no plano e mostre que ela mede área orientada.",
    erro: "Confundir variedade complexa com variedade real de dimensão par sem estrutura compatível.",
  },
  "Geometria convexa": {
    abre: "A geometria convexa estuda conjuntos que contêm o segmento entre quaisquer dois de seus pontos. Separação por hiperplanos, poliedros e suportes são as ferramentas centrais.",
    pratica: "Dado um conjunto de pontos no plano, encontre a envoltória convexa e escreva os hiperplanos que separam um ponto externo.",
    erro: "Achar que a união de dois convexos é convexa: em geral, não é.",
  },
  "Geometria discreta e computacional": {
    abre: "A geometria computacional resolve problemas geométricos com algoritmos e estruturas de dados. Voronoi, triangulações e envoltórias aparecem em mapas, gráficos e robótica.",
    pratica: "Desenhe o diagrama de Voronoi de cinco pontos e mostre que cada célula é a interseção de semiplanos.",
    erro: "Ignorar casos degenerados, como três pontos colineares, e quebrar o algoritmo.",
  },
  "Cálculo diferencial": {
    abre: "O cálculo diferencial mede mudança. Limite dá sentido a aproximar, derivada mede taxa instantânea e continuidade garante que o gráfico não salta sem aviso.",
    pratica: "Calcule a derivada de uma função por definição e confira o resultado pelas regras usuais.",
    erro: "Derivar sem verificar continuidade e domínio: a regra vale onde a função é diferenciável.",
  },
  "Cálculo integral": {
    abre: "A integral acumula pequenas contribuições e calcula área, volume, trabalho e média. O teorema fundamental liga acumulação e derivada, fechando o ciclo do cálculo.",
    pratica: "Calcule a área entre duas curvas e depois derive a função área para ver o teorema fundamental em ação.",
    erro: "Esquecer a constante de integração ou trocar os limites ao substituir variáveis.",
  },
  "Cálculo multivariável": {
    abre: "Em várias variáveis, a derivada vira gradiente e a integral vira integral múltipla. Divergente e rotacional descrevem como campos se espalham e giram.",
    pratica: "Calcule o gradiente de uma função de duas variáveis e desenhe as curvas de nível com os vetores apontando para onde ela cresce.",
    erro: "Achar que derivadas parciais existirem garante diferenciabilidade.",
  },
  "Análise real": {
    abre: "A análise real dá rigor ao cálculo. Sequências, séries, continuidade uniforme e integração são tratadas com épsilon e delta, sem depender do desenho.",
    pratica: "Prove que a função um sobre x é contínua em todo ponto diferente de zero usando a definição.",
    erro: "Trocar a ordem de quantificadores: continuidade ponto a ponto não é o mesmo que continuidade uniforme.",
  },
  "Análise complexa": {
    abre: "Funções de variável complexa têm derivada em um sentido mais forte, e isso produz resultados surpreendentes. Holomorfia, integrais de contorno e os teoremas de Cauchy conectam cálculo e geometria.",
    pratica: "Calcule a integral de uma função holomorfa em um caminho fechado e compare com o que acontece se houver um polo dentro.",
    erro: "Aplicar a fórmula de Cauchy sem verificar se o ponto está dentro do contorno.",
  },
  "Teoria da medida e integração": {
    abre: "A teoria da medida estende a ideia de tamanho para conjuntos complicados e define a integral de Lebesgue. Os teoremas de convergência dizem quando é seguro trocar limite e integral.",
    pratica: "Mostre que um conjunto enumerável tem medida zero e use isso para integrar uma função que muda em um conjunto denso.",
    erro: "Trocar limite e integral sem uma hipótese de convergência dominada.",
  },
  "Análise funcional": {
    abre: "A análise funcional trata funções como pontos de espaços vetoriais grandes. Espaços normados, de Banach e de Hilbert dão geometria à análise e teoria espectral.",
    pratica: "Verifique se uma sequência de funções converge em norma e compare com a convergência ponto a ponto.",
    erro: "Achar que toda norma vem de um produto interno.",
  },
  "Análise harmônica": {
    abre: "A análise harmônica decompõe funções em ondas e frequências. Séries de Fourier, transformadas e ondaletas mostram quais frequências compõem um sinal.",
    pratica: "Decomponha uma onda quadrada em série de Fourier e observe como as parciais se aproximam dos saltos.",
    erro: "Esperar convergência uniforme para funções com salto.",
  },
  "Teoria da aproximação": {
    abre: "Aproximar é substituir um objeto complicado por outro tratável, com controle de erro. Interpolação, polinômios e aproximação uniforme medem a distância entre o ideal e o calculável.",
    pratica: "Aproxime uma função por um polinômio de Taylor e compare o erro no intervalo com a estimativa teórica.",
    erro: "Escolher pontos de interpolação igualmente espaçados e obter oscilações no fenômeno de Runge.",
  },
  "Equações integrais": {
    abre: "Equações integrais têm a incógnita dentro de uma integral. Fredholm e Volterra aparecem em problemas inversos, física e processamento de sinais.",
    pratica: "Resolva uma equação de Volterra simples por iteração e veja a série de Neumann surgir.",
    erro: "Tratar equação integral como equação diferencial e procurar derivada onde não há.",
  },
  "Cálculo das variações": {
    abre: "O cálculo das variações procura funções que minimizam ou maximizam um funcional. A equação de Euler-Lagrange é a condição de primeira ordem desse problema.",
    pratica: "Encontre a curva de menor comprimento entre dois pontos e depois a braquistócrona, comparando os funcionais.",
    erro: "Aplicar Euler-Lagrange sem verificar as condições de contorno.",
  },
  "Análise assintótica": {
    abre: "A análise assintótica descreve o comportamento de funções perto de um limite. Expansões e métodos perturbativos dizem o tamanho do erro sem exigir solução exata.",
    pratica: "Compare o crescimento de duas funções com logaritmo e potência e escreva a expansão de cada uma em zero.",
    erro: "Somar termos de uma série assintótica como se ela convergisse.",
  },
  "Equações diferenciais ordinárias (EDO)": {
    abre: "Uma EDO relaciona uma função à sua derivada. Modelos de crescimento, oscilação e decaimento são escritos assim, e a solução descreve o futuro do sistema.",
    pratica: "Resolva a equação do crescimento exponencial e depois a logística, comparando os dois comportamentos de longo prazo.",
    erro: "Separar variáveis sem conferir se a função que divide pode ser zero.",
  },
  "Equações diferenciais parciais (EDP)": {
    abre: "EDPs envolvem derivadas em mais de uma variável e descrevem calor, ondas, difusão e equilíbrio. Elípticas, parabólicas e hiperbólicas têm comportamentos qualitativos diferentes.",
    pratica: "Classifique a equação da onda e a do calor e explique por que uma propaga perturbação e a outra difunde.",
    erro: "Usar a mesma condição de contorno para todos os tipos de equação.",
  },
  "Equações de diferenças e recorrências": {
    abre: "Recorrências definem sequências a partir de termos anteriores. São a versão discreta das equações diferenciais e aparecem em algoritmos, finanças e contagem.",
    pratica: "Resolva a recorrência de Fibonacci e compare o crescimento com a razão áurea.",
    erro: "Esquecer que a solução geral de uma recorrência de ordem k precisa de k condições iniciais.",
  },
  "Sistemas dinâmicos": {
    abre: "Sistemas dinâmicos estudam como um estado evolui no tempo. Pontos fixos, órbitas periódicas e caos descrevem desde pêndulos até populações.",
    pratica: "Analise o mapa logístico para dois parâmetros e veja quando ele passa de ponto fixo a ciclo e a caos.",
    erro: "Concluir estabilidade olhando só o desenho: é preciso analisar autovalores ou Lyapunov.",
  },
  "Equações funcionais": {
    abre: "Equações funcionais determinam funções por relações entre seus valores. As equações de Cauchy são o exemplo clássico e mostram como hipóteses de regularidade mudam a solução.",
    pratica: "Resolva a equação de Cauchy nos racionais e depois mostre o que a continuidade acrescenta nos reais.",
    erro: "Assumir continuidade sem declarar: sem ela existem soluções patológicas.",
  },
  "Combinatória enumerativa": {
    abre: "Contar bem é reconhecer estrutura. Princípios de contagem, permutações, combinações e funções geradoras transformam listagem em fórmula.",
    pratica: "Conte as sequências de cinco letras sem repetição e depois com repetição, comparando os princípios usados.",
    erro: "Somar quando os casos se sobrepõem: use inclusão e exclusão.",
  },
  "Teoria dos grafos": {
    abre: "Grafos modelam relações: estradas, redes, dependências e amizades. Caminhos, ciclos, árvores e planaridade respondem perguntas de conexão e custo.",
    pratica: "Ache a árvore geradora mínima de um grafo pequeno por Kruskal e confira com Prim.",
    erro: "Confundir caminho com passeio: caminho não repete vértices.",
  },
  "Combinatória extremal": {
    abre: "A combinatória extremal pergunta qual é o maior ou menor objeto que evita uma configuração proibida. Ramsey mostra que certa desordem é inevitável em estruturas grandes.",
    pratica: "Encontre o maior conjunto de arestas em um grafo de seis vértices sem triângulo e explique o limite.",
    erro: "Achar que um exemplo pequeno prova o caso geral.",
  },
  "Combinatória algébrica": {
    abre: "A combinatória algébrica usa simetria e álgebra para contar. Funções simétricas, partições e representações transformam identidades combinatórias em identidades algébricas.",
    pratica: "Escreva uma função geradora para as partições de um inteiro e compare os coeficientes com a contagem direta até cinco.",
    erro: "Tratar partições como composições: a ordem dos termos importa em uma e não na outra.",
  },
  "Combinatória probabilística": {
    abre: "O método probabilístico prova existência mostrando que um objeto aleatório tem a propriedade desejada com probabilidade positiva. É contar sem construir.",
    pratica: "Prove que existe um grafo com certo número de arestas e sem triângulo usando esperança condicional.",
    erro: "Concluir que um objeto aleatório específico tem a propriedade só porque a esperança é boa.",
  },
  "Teoria dos desenhos combinatórios": {
    abre: "Desenhos em blocos organizam experimentos e comparações. Quadrados latinos e arranjos aparecem em estatística, códigos e torneios.",
    pratica: "Monte um quadrado latino de ordem quatro e verifique que cada símbolo aparece uma vez por linha e por coluna.",
    erro: "Confundir bloco com par: em um desenho, cada bloco pode ter vários elementos.",
  },
  "Teoria dos códigos": {
    abre: "Códigos corretores acrescentam redundância para detectar e corrigir erros. Distância mínima, códigos lineares e Reed-Solomon ligam álgebra linear a transmissão confiável.",
    pratica: "Calcule a distância mínima de um código de repetição e mostre quantos erros ele corrige.",
    erro: "Achar que mais redundância sempre melhora: ela reduz a taxa de informação.",
  },
  "Matroides e estruturas discretas": {
    abre: "Matroides capturam a ideia abstrata de independência, comum a vetores, grafos e empacotamentos. Otimização combinatória encontra aí seus algoritmos gulosos que funcionam.",
    pratica: "Modele as arestas de um grafo como matroide gráfico e verifique os axiomas de independência.",
    erro: "Aplicar guloso em qualquer matroide sem conferir a propriedade de troca.",
  },
  "Teoria da probabilidade": {
    abre: "Probabilidade dá medida à incerteza. Espaços de probabilidade, variáveis aleatórias e distribuições permitem calcular esperança, variância e risco.",
    pratica: "Calcule a esperança de um jogo com dois dados e decida se o jogo é justo.",
    erro: "Somar probabilidades de eventos que não são disjuntos.",
  },
  "Processos estocásticos": {
    abre: "Processos estocásticos descrevem sistemas que evoluem com aleatoriedade. Cadeias de Markov, Poisson e movimento browniano são modelos de fila, chegada e difusão.",
    pratica: "Monte a matriz de transição de uma cadeia de dois estados e calcule a distribuição estacionária.",
    erro: "Assumir independência entre passos de um processo que tem memória.",
  },
  "Estatística descritiva": {
    abre: "A estatística descritiva resume dados sem inferir além deles. Média, mediana, dispersão e gráficos mostram forma, centro e espalhamento.",
    pratica: "Compare média e mediana de um conjunto com um valor extremo e explique qual representa melhor o típico.",
    erro: "Usar média para dados assimétricos sem olhar a distribuição.",
  },
  "Inferência estatística": {
    abre: "Inferência usa amostra para falar da população, com incerteza declarada. Estimadores, intervalos e testes medem o quanto a conclusão pode variar.",
    pratica: "Construa um intervalo de confiança para uma média e interprete o que 95 por cento significa em repetições.",
    erro: "Dizer que o intervalo contém a média com 95 por cento de probabilidade depois de calculado.",
  },
  "Estatística bayesiana": {
    abre: "A estatística bayesiana atualiza crenças com dados. Prior, verossimilhança e posterior formam um ciclo explícito de aprendizado.",
    pratica: "Atualize a probabilidade de uma moeda viciada com dez lançamentos e compare prior uniforme e prior concentrada.",
    erro: "Escolher prior só para obter o resultado desejado e não declarar a escolha.",
  },
  "Modelagem estatística": {
    abre: "Modelos estatísticos relacionam variáveis e erro. Regressão linear e modelos generalizados dizem quanto uma variável muda quando outra muda, com incerteza.",
    pratica: "Ajuste uma regressão simples e verifique resíduos para ver se a relação linear é razoável.",
    erro: "Interpretar correlação como causalidade.",
  },
  "Análises especializadas": {
    abre: "Séries temporais, sobrevivência, espaço e robustez pedem modelos próprios. Cada um lida com dependência, censura ou valores extremos que a regressão comum não cobre.",
    pratica: "Em uma série com tendência, compare previsão por média móvel e por modelo com sazonalidade.",
    erro: "Ignorar autocorrelação e tratar observações vizinhas como independentes.",
  },
  "Otimização matemática": {
    abre: "Otimização procura o melhor ponto de uma função sob restrições. Linear, não linear, convexa e inteira diferem no tipo de solução e no algoritmo.",
    pratica: "Resolva um problema linear de duas variáveis pelo método gráfico e confira o vértice ótimo.",
    erro: "Achar que todo ótimo local é global em problema não convexo.",
  },
  "Pesquisa operacional": {
    abre: "Pesquisa operacional aplica otimização a decisões reais: produção, transporte, filas e alocação. O modelo importa tanto quanto o algoritmo.",
    pratica: "Formule um problema de transporte com duas fábricas e três lojas e resolva pelo custo mínimo.",
    erro: "Modelar arredondando variáveis que precisam ser inteiras e perder a viabilidade.",
  },
  "Análise numérica": {
    abre: "A análise numérica constrói e avalia métodos para resolver problemas com precisão finita. Erro, estabilidade e custo decidem se um método serve na prática.",
    pratica: "Resolva uma equação não linear por bisseção e por Newton e compare número de iterações e garantia.",
    erro: "Confiar no resultado sem estimar o erro de arredondamento.",
  },
  "Computação científica": {
    abre: "Computação científica transforma modelos matemáticos em simulação executável. Malhas, solvers e paralelismo precisam respeitar a matemática e o hardware.",
    pratica: "Simule uma EDO simples por Euler e por Runge-Kutta e compare o erro com passo menor.",
    erro: "Reduzir o passo sem verificar estabilidade e obter mais erro, não menos.",
  },
};

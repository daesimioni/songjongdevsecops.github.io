// As lições das pedras. Cada estação é uma página de curso com seis partes:
// o que é, como se usa, onde quebra, o que perguntam, para levar e com as mãos.
// A chave é o id da área; dentro dela, o nome da estação como aparece no mapa.
// O banco da área (def, keys, mistake e a pergunta) continua entrando junto,
// então a lição só escreve o que é só dela: a explicação, o exemplo, o erro
// explicado, a frase de cabeça e o que fazer com as mãos.
export const LICOES = {
  "inter-math-chem": {
    "Grafos Moleculares": {
      oQue:
        "Uma molécula também é um grafo, e ver assim muda a pergunta. Cada átomo vira um vértice, cada ligação vira uma aresta, e o que interessa deixa de ser a fórmula e passa a ser o desenho: quem está ligado a quem. Duas substâncias com a mesma fórmula podem ter desenhos diferentes, e por isso cheiram, fervem e reagem de formas diferentes. O grafo é o que a fórmula esconde.",
      passos: [
        "Escreva a lista de átomos e ligações do composto; o hidrogênio entra na conta.",
        "Conte o grau de cada vértice, que é o número de ligações que saem daquele átomo.",
        "Compare os índices topológicos do grafo com a propriedade que você quer prever, como ponto de ebulição ou solubilidade.",
      ],
      exemplo:
        "Etanol e éter dimetílico têm a mesma fórmula, C2H6O, e grafos diferentes. No etanol, o oxigênio se liga a um carbono e a um hidrogênio; no éter, ele fica entre dois carbonos. No grafo do etanol aparece um oxigênio de grau dois ligado a um carbono que ainda carrega hidrogênios; no éter, o oxigênio de grau dois tem carbono dos dois lados. A conta é a mesma, o desenho não: o etanol ferve a 78 °C e o éter a −24 °C. A fórmula não distingue os dois; o grafo distingue.",
      quebra:
        "O erro clássico é tratar a fórmula como identidade da substância. Uma calculadora de fórmula devolve a mesma linha para os dois compostos e a conclusão já nasce errada. Antes de comparar propriedades, desenhe o grafo e veja se ele é o mesmo.",
      levar: "Fórmula igual não é molécula igual: o grafo decide.",
      maos:
        "Monte o grafo de uma molécula pequena, como água, metano ou etanol, e conte o grau de cada vértice antes de conferir a resposta.",
    },
    "Cinética Modelada": {
      oQue:
        "Cinética química é a conta do tempo: quanto do reagente sobra a cada instante e com que rapidez o produto aparece. Modelar é escolher uma equação que descreva essa curva e ajustar os parâmetros dela aos dados medidos. A velocidade não é constante; ela depende da concentração que ainda existe, e por isso a curva desacelera sozinha.",
      passos: [
        "Meça a concentração em vários instantes, não só no começo e no fim.",
        "Teste a ordem da reação: veja se a curva fica reta em concentração, em logaritmo ou em inverso.",
        "Ajuste a constante de velocidade com a reta que ficou reta e confira com um ponto que você não usou no ajuste.",
      ],
      exemplo:
        "Numa reação de primeira ordem, a concentração cai pela exponencial do tempo. Se você mede 1,00 mol/L no início e 0,50 mol/L em 10 minutos, a meia-vida é 10 minutos. Em 20 minutos sobram 0,25 mol/L, não 0,00: a curva se aproxima do zero sem encostar. Quem olha só o primeiro trecho e estende a reta anuncia o fim da reação cedo demais. Repare que a queda de 1,00 para 0,50 leva o mesmo tempo que a de 0,50 para 0,25: é essa repetição que define a primeira ordem.",
      quebra:
        "O erro é ajustar a reta no gráfico errado. Em primeira ordem, a reta é do logaritmo da concentração contra o tempo; plotar a concentração crua e chamar a curva de reta produz constante de velocidade sem sentido. Confira a ordem antes de ajustar qualquer coisa.",
      levar: "A reação desacelera porque o reagente acaba, não porque o tempo passa.",
      maos:
        "Escolha dois instantes da curva, calcule a meia-vida e veja se ela se repete; se não se repetir, a ordem não é primeira.",
    },
    "Otimização de Processos": {
      oQue:
        "Otimizar um processo químico é escolher as condições que dão o melhor resultado sem violar o que o reator e a segurança permitem. Temperatura, pressão, vazão e concentração são as alavancas; rendimento, custo e pureza são as metas. Quase sempre há mais de uma meta ao mesmo tempo, e melhorar uma piora outra, então a resposta não é um número, é uma faixa de trocas aceitáveis.",
      passos: [
        "Escreva a função objetivo: o que você quer maximizar ou minimizar, com a unidade certa.",
        "Liste as restrições reais do equipamento e da segurança, com os limites numéricos.",
        "Varra as condições dentro da faixa permitida e registre o custo de cada ganho, para escolher com número na mão.",
      ],
      exemplo:
        "Uma reação rende mais quente, mas acima de 180 °C o catalisador perde atividade e o produto começa a degradar. O ótimo não está no ponto mais quente: está onde o ganho de rendimento ainda paga a perda do catalisador. Se subir de 160 para 170 °C rende 4% a mais e corta 6% da vida do catalisador, a troca é ruim para a batelada longa e boa para a curta. A resposta depende do que você está otimizando.",
      quebra:
        "O erro é otimizar uma variável de cada vez e concluir que achou o ótimo. As variáveis interagem: a melhor temperatura muda quando a pressão muda, e o melhor tempo de residência muda quando a concentração muda. Sem varrer as combinações, o resultado é um ponto bom numa linha e ruim no plano inteiro. Antes de rodar a varredura, escreva também o que não pode acontecer: reação descontrolada, produto fora de especificação, catalisador perdido.",
      levar: "Não existe ótimo sem restrição escrita; sem ela, é só desejo.",
      maos:
        "Desenhe a curva de rendimento contra temperatura, marque o limite do catalisador e veja onde o ganho deixa de compensar.",
    },
  },
  "inter-chem-cs": {
    "Quimioinformática": {
      oQue:
        "Quimioinformática é a química que passa pelo computador: a molécula vira um conjunto de números que o modelo consegue ler, e a pergunta que se faz é qual propriedade sai daqueles números. Não é adivinhação, é interpolação dentro do que os dados de treino já cobriram. O modelo aponta candidato; quem decide se o composto existe e funciona é o ensaio.",
      passos: [
        "Represente a molécula de um jeito fiel, como SMILES, grafo de ligações ou descritores calculados.",
        "Confira se o composto novo é parecido com os que estavam no treino antes de acreditar no número.",
        "Use a previsão como fila de prioridade para o ensaio, nunca como resultado final.",
      ],
      exemplo:
        "Um modelo treinado com cinco mil ésteres acerta bem a solubilidade de ésteres parecidos e erra feio ao receber uma amina ácida: ele interpola, não extrapola. Se a tela devolve logS igual a 0,8 para um composto fora da classe, o número tem a confiança de uma média, não de uma medição. O caminho honesto é perguntar em que faixa de compostos o modelo foi treinado e se o novo cai dentro dela.",
      quebra:
        "O erro é confiar no modelo treinado com uma classe só. Ele responde com número para todo composto, inclusive os que nunca viu, e o número vem com cara de certeza. O viés aparece na hora do ensaio, quando o composto não se comporta como o previsto. Antes de usar a saída, olhe a cobertura do treino.",
      levar: "Previsão boa aponta onde gastar o ensaio; não substitui o ensaio.",
      maos:
        "Escolha duas classes de composto e veja como a mesma representação muda de escala entre elas, e onde o modelo começa a chutar.",
    },
    "Automação de Laboratório": {
      oQue:
        "Automação troca a mão do pesquisador por braço mecânico ou script: pipetagem, diluição, leitura de placa e registro passam a rodar em série, sempre na mesma sequência. O que se ganha é repetibilidade; o que se exige é protocolo escrito, porque a máquina não sabe improvisar quando o líquido sai errado. Sensores e realimentação são o que permitem desviar do erro antes da série inteira.",
      passos: [
        "Escreva o protocolo com volumes, tempos e tolerâncias, do jeito que outra pessoa cumpriria sem você por perto.",
        "Valide o robô com uma bateria de amostras controle antes de soltar a série de verdade.",
        "Registre cada desvio e a ação corretiva, porque falha de calibração escala rápido.",
      ],
      exemplo:
        "Um braço que pipeta 20 µL com erro de 1,5% parece bom. Em cem amostras, o erro se acumula na diluição em série e a curva desvia no fim. A conferência usa balança e padrão de corante: se o volume real sai 2% fora do pedido, a máquina está fora, e o resultado não vai para o caderno como se estivesse bom. A repetição é o produto principal da automação, e ela vale só com controle.",
      quebra:
        "Automatizar processo que ninguém documentou copia o erro para a escala. A falha de calibração, que antes derrubava uma amostra por vez, passa a derrubar a placa inteira, e o prejuízo chega antes do aviso. O protocolo explícito é a diferença entre série e acidente em série.",
      levar: "Robô faz melhor o que já está escrito; o que está na cabeça não existe.",
      maos:
        "Monte uma diluição em série e compare o volume esperado com o medido; se o desvio crescer ao longo da série, há acúmulo de erro.",
    },
    "Busca de Materiais": {
      oQue:
        "Buscar material é varrer um espaço enorme com orçamento pequeno. A busca combina simulação, banco de estruturas e aprendizado para reduzir candidatos antes da síntese. A propriedade desejada é o alvo, mas a estabilidade é o filtro que separa proposta de ficção: material que se decompõe nas condições de uso não serve, por melhor que seja o número que ele apresenta.",
      passos: [
        "Descreva a estrutura e a condição de uso com as variáveis que importam: temperatura, pressão, meio.",
        "Simule a propriedade desejada e a energia de formação do candidato.",
        "Descarte o que não é estável antes de olhar o ranking, para não se apaixonar por número impossível.",
      ],
      exemplo:
        "Uma varredura de dez mil óxidos acha trezentos com band gap na faixa desejada. Só quarenta passam pelo critério de energia de formação e estrutura cristalina conhecida. Os outros duzentos e sessenta são números bonitos em tabela, sem material real por trás. O funil importa mais que o topo da lista, e cada filtro precisa de critério declarado. Sem esse funil, a busca vira gerador de tabela bonita, e a síntese gasta orçamento em composto que a termodinâmica já recusou. A pergunta certa não é qual composto tem o melhor número, e sim qual deles pode existir na hora do uso.",
      quebra:
        "Ordenar só pela propriedade coloca no topo composto que não existe. O ranking precisa de dois critérios, propriedade e estabilidade, e o segundo elimina antes. Quando a lista é curta mas o topo é fantasia, o custo aparece na síntese que não dá certo.",
      levar: "Primeiro o material existe; depois ele é bom no número que você quer.",
      maos:
        "Ordene os candidatos pela propriedade e depois filtre pela estabilidade; conte quantos do topo dez sobrevivem.",
    },
  },
  "math-topologia": {
    "Espaços Topológicos": {
      oQue:
        "Topologia pergunta o que não muda quando a forma pode esticar, torcer e amassar, desde que não rasgue nem cole. O chão disso são os abertos: uma coleção de subconjuntos que respeita os axiomas e define quem é vizinho de quem. Distância sai de cena; sobra a estrutura de continuidade e de conexidade, que é o que a forma guarda.",
      passos: [
        "Fixe o conjunto e diga quais subconjuntos são abertos.",
        "Teste continuidade pela imagem inversa: a pré-imagem de aberto precisa ser aberta.",
        "Compare duas formas por homeomorfismo, ou ache um invariante que separe as duas.",
      ],
      exemplo:
        "Um círculo e um quadrado são o mesmo espaço topológico: existe transformação contínua com inversa contínua entre eles. Já o círculo e o intervalo fechado não são: tirar um ponto do círculo deixa o resto conexo, e tirar o ponto do meio do intervalo parte o conjunto em dois pedaços. Essa diferença é invariante e responde à pergunta sem precisar de régua.",
      quebra:
        "Pensar que todo espaço topológico é métrico é o erro de largada: a definição não pede distância, e muitos espaços úteis não têm métrica nenhuma. Se você começa medindo distância, já provou outra coisa. O axioma é a única régua permitida. Quando a intuição de distância entra no lugar da definição, a prova fica com cara de verdade e não é. Um exemplo ajuda: no conjunto com a topologia trivial, todo subconjunto é aberto de um jeito que nenhuma régua explica.",
      levar: "Esticar não muda a topologia; rasgar muda.",
      maos:
        "Desenhe círculo, quadrado e um oito; marque quantos pedaços sobram ao tirar um ponto de cada um.",
    },
    "Homologia e Nós": {
      oQue:
        "Homologia transforma a pergunta 'quantos buracos tem esta forma' em álgebra: cadeias, bordas e grupos. Ela conta buraco por dimensão, e a conta não se abala quando a forma deforma sem rasgar. Em três dimensões, a mesma ideia classifica nós: um laço que não desata do trivial precisa de um número que sobreviva a todo puxão, e esse número é o invariante.",
      passos: [
        "Desenhe a forma e decomponha em células: pontos, arestas, faces.",
        "Monte as cadeias e o operador de borda e calcule o grupo de homologia.",
        "Compare o grupo, ou o invariante de nó, com o da forma de referência.",
      ],
      exemplo:
        "O nó de trevo tem três cruzamentos e não é o nó trivial. Puxar, torcer e alisar não desfaz; o polinômio de Jones do trevo difere do polinômio trivial, e essa diferença é a prova. Dois desenhos do mesmo nó podem parecer distintos aos olhos e ter o mesmo invariante; é o invariante diferente que garante que os nós também são diferentes.",
      quebra:
        "Achar que homologia distingue todas as formas. Ela não distingue: dois espaços diferentes podem ter o mesmo grupo. Homologia que coincide não prova que as formas são iguais, só que esse invariante não viu a diferença. Confundir as duas coisas leva a concluir demais. A conta também é mais grosseira do que parece: o primeiro grupo vê buraco em anel e não vê buraco esférico, e cada dimensão precisa do seu grupo.",
      levar: "Invariante igual não garante igualdade; invariante diferente garante diferença.",
      maos:
        "Desenhe o trevo e o nó trivial, conte os cruzamentos e veja por que contar cruzamento não basta para separar os dois.",
    },
    "Análise Topológica de Dados": {
      oQue:
        "Análise topológica de dados trata a nuvem de pontos como forma e pergunta quais buracos sobrevivem quando a escala de vizinhança cresce. Em vez de um raio fixo, a homologia persistente acompanha cada buraco: ele nasce numa escala, morre em outra, e a diferença entre as duas é a evidência. O resumo separa estrutura de ruído, com a ressalva de que estrutura não é prova estatística.",
      passos: [
        "Escolha a distância entre pontos e o intervalo de escalas que faz sentido para os dados.",
        "Cresça o raio e registre o nascimento e a morte de cada buraco.",
        "Olhe os buracos que sobrevivem muitas escalas; os que nascem e morrem no mesmo passo são ruído.",
      ],
      exemplo:
        "Numa nuvem em anel, o buraco central nasce cedo e demora a fechar: persiste por muitas escalas. Numa nuvem de ruído puro, os buracos nascem e morrem no mesmo passo. O diagrama de persistência mostra a diferença como pontos longe da diagonal, e o que fica perto da diagonal não merece conclusão. O retrato depende da amostra: poucos pontos desenham anel falso, e muitos pontos apagam estrutura fina. Por isso a escala de análise se escolhe junto com os dados, e não depois de ver o diagrama pronto.",
      quebra:
        "Ler persistência como teste de hipótese. O diagrama mostra forma, não significância; para afirmar efeito é preciso estatística por cima, com teste próprio. Um buraco grande pode ser estrutura real ou artefato da amostragem, e o diagrama sozinho não decide.",
      levar: "Buraco que sobrevive a muitas escalas é estrutura; o resto é ruído.",
      maos:
        "Gere um anel de pontos e um quadrado cheio, rode a persistência e compare o buraco que sobra em cada um.",
    },
  },
  "chem-ambiental": {
    "Química Ambiental": {
      oQue:
        "Química ambiental estuda o que a substância faz depois que sai do frasco: para onde vai, quanto tempo fica e que dano causa. Poluente é o que causa dano no ambiente, e remediação é o conjunto de técnicas que remove, transforma ou imobiliza o contaminante. A diferença entre degradar e imobilizar decide o prazo do problema: o que se degrada pode resolver em anos, o que apenas se imobiliza exige vigilância por décadas.",
      passos: [
        "Identifique a substância e a forma química em que ela chega ao ambiente.",
        "Siga o caminho no solo, na água, no ar e na cadeia alimentar.",
        "Escolha entre remover, transformar ou imobilizar conforme a persistência do contaminante.",
      ],
      exemplo:
        "Chumbo em solo de oficina não evapora nem se degrada: muda de forma e fica. A remediação pode lavar o solo com ácido e recuperar o metal, ou imobilizar com fosfato que forma mineral estável. Já um solvente orgânico pode ser degradado por microrganismos em meses, se houver oxigênio e nutriente. O mesmo esforço de limpeza tem prazos diferentes porque a persistência é diferente, e o monitoramento acompanha esse prazo.",
      quebra:
        "Achar que todo poluente se degrada com o tempo. Metal pesado permanece, muda de forma e sobe na cadeia alimentar: o cuidado é de longo prazo, com medição periódica, não com uma limpeza única. Quando a substância não se degrada, o problema não acaba, só muda de lugar.",
      levar: "O que não se degrada não desaparece; só muda de lugar.",
      maos:
        "Compare um contaminante orgânico e um metal na mesma amostra e veja qual some com o tempo e qual só muda de forma.",
    },
    "Química Atmosférica": {
      oQue:
        "A atmosfera é um reator aberto: luz solar, oxigênio, água e partículas transformam gases continuamente. Ozônio, smog e chuva ácida nascem dessas reações, e o mesmo composto pode proteger numa camada e prejudicar na outra. Entender a atmosfera é separar o gás, a altitude e a reação que ele sofre, porque o nome do gás sozinho não diz o efeito.",
      passos: [
        "Identifique o gás e a altitude em que ele está.",
        "Veja se há luz e água disponíveis para a reação acontecer.",
        "Acompanhe o produto que se forma e o efeito dele sobre a saúde e o material.",
      ],
      exemplo:
        "O ozônio na estratosfera filtra radiação ultravioleta e é protetor. Perto do solo, ele é oxidante e irrita o pulmão: mesmo gás, camada diferente, efeito contrário. Já a chuva ácida vem de óxidos de enxofre e de nitrogênio que reagem com água e voltam como ácido sulfúrico e nítrico, corroendo pedra, solo e metal. A conta começa no gás e termina no material que sofre. Por isso o mesmo poluente pode ser tratado em duas frentes: cortar a emissão que o produz e proteger o que ele ataca.",
      quebra:
        "Confundir ozônio de superfície com buraco na camada de ozônio. São problemas diferentes, com gases e reações diferentes; misturar os dois leva a política ambiental errada. O buraco é perda de ozônio na estratosfera; o ozônio de superfície é excesso produzido por trânsito e indústria.",
      levar: "Mesmo gás pode proteger em cima e envenenar embaixo.",
      maos:
        "Olhe a curva de ozônio por altitude e marque onde ele protege e onde ele irrita.",
    },
    "Geoquímica": {
      oQue:
        "Geoquímica segue os elementos pela crosta, pelos rios e pelos oceanos: de onde vêm, onde se concentram e com o que reagem. Minerais e rochas guardam a memória do processo, e o ciclo do carbonato liga a água, o ar e a vida. É a ponte entre a química de bancada e a escala do planeta, onde o tempo se mede em milhares de anos.",
      passos: [
        "Identifique o mineral ou a fase que contém o elemento.",
        "Siga o ciclo entre rocha, água, atmosfera e seres vivos.",
        "Meça a razão entre isótopos quando precisar saber a origem do material.",
      ],
      exemplo:
        "A calcita das conchas se forma com cálcio e carbonato dissolvidos na água. Quando o oceano absorve mais gás carbônico, o pH cai e o carbonato fica mais escasso: a concha custa mais energia para se formar. O mesmo átomo de carbono que estava no ar entra na água, vira bicarbonato e termina na rocha, num ciclo que leva milhares de anos e passa por todos os reservatórios.",
      quebra:
        "Achar que acidificação e aquecimento são a mesma coisa. São efeitos ligados, com causa comum, mas mecanismos distintos: um mexe com o pH, o outro com a temperatura. Tratar como sinônimo esconde o que cada um exige de resposta, e a resposta não é a mesma. Reduzir emissão de gás carbônico mexe nos dois, mas o efeito sobre o pH já está em curso e continua por séculos.",
      levar: "O carbono não some: muda de reservatório, e cada mudança tem preço.",
      maos:
        "Siga um átomo de carbono do ar até a concha e anote em que reservatório ele para em cada etapa.",
    },
    "Química Oceânica": {
      oQue:
        "A água do mar é uma solução com sais, gases e matéria orgânica em equilíbrio delicado. O sistema carbonato funciona como tampão: segura o pH dentro de uma faixa enquanto recebe ácido ou base. Nutrientes, por outro lado, são o limite da vida: faltando ferro ou nitrogênio, o fitoplâncton não cresce, mesmo com luz e carbono de sobra. A química da superfície não é a do fundo, e a do sedimento não é a da coluna de água.",
      passos: [
        "Meça salinidade e alcalinidade antes de olhar o pH.",
        "Calcule a saturação do carbonato na temperatura local.",
        "Descubra qual nutriente limita a produção naquele ponto.",
        "Separe as amostras por profundidade: superfície, fundo e sedimento contam histórias diferentes.",
      ],
      exemplo:
        "Numa região com bastante nitrogênio e pouco ferro, adicionar nitrogênio não muda a produção: o ferro é o limite. A alcalinidade total diz quanto o oceano ainda consegue neutralizar ácido sem cair de pH. Sedimento e água trocam íons o tempo todo, e a química de fundo não é a da superfície; a média dos dois esconde o lugar onde a vida acontece. Um perfil vertical de alcalinidade mostra a água antiga e fria do fundo guardando carbono por séculos, enquanto a superfície troca gás com a atmosfera todo dia.",
      quebra:
        "Tratar o oceano como um tanque homogêneo. Superfície, fundo e sedimento têm química diferente, e a média esconde exatamente o ponto de interesse. Amostrar só a superfície e concluir sobre o oceano inteiro é o erro que a conta não perdoa. O sedimento, por sua vez, funciona como arquivo: guarda o que a água depositou e devolve devagar, e é lá que se lê o histórico de poluição de uma baía.",
      levar: "O oceano é tampão, não esponja: tem limite de neutralização.",
      maos:
        "Compare a saturação de carbonato na superfície e no fundo e veja em qual das duas a concha se forma mais fácil.",
      pergunta: {
        q: "O que acontece com o carbonato dissolvido quando o pH do mar cai?",
        a: "Ele fica mais escasso e a concha custa mais energia",
        why: "Com menos carbonato disponível, a precipitação de calcita fica mais difícil e o organismo gasta mais para formar a concha.",
      },
    },
  },
  "physics-relatividade": {
    "Relatividade Especial": {
      oQue:
        "A relatividade especial começa com um fato medido: a luz tem a mesma velocidade para todos os observadores, não importa a velocidade de quem mede. Para que isso valha, espaço e tempo precisam ceder. Tempo dilata, comprimento contrai e a simultaneidade deixa de ser absoluta. O preço aparece perto da velocidade da luz; longe dela, a conta clássica continua valendo.",
      passos: [
        "Escolha dois referenciais e diga quem mede o quê.",
        "Calcule o fator de Lorentz a partir da velocidade relativa.",
        "Aplique a dilatação no tempo próprio de quem se move.",
      ],
      exemplo:
        "Um múon criado na alta atmosfera vive 2,2 microssegundos no próprio relógio. Mesmo assim chega ao chão: a 0,99 da velocidade da luz, o fator de Lorentz é cerca de 7, e o tempo medido na Terra estica o suficiente. Para o múon, é a distância que encurta. Os dois descrevem o mesmo encontro com números diferentes, e ambos acertam.",
      quebra:
        "Somar velocidades de forma simples perto da velocidade da luz. 0,9c mais 0,9c não dá 1,8c: a composição relativística se aproxima de c e nunca passa. A soma de Galileu é o caso lento da fórmula certa, não uma regra geral. O mesmo vale para energia: a massa de repouso é energia, e por isso um grama guarda uma quantidade que ninguém consegue queimar de uma vez.",
      levar: "A luz é a mesma para todos; quem cede é o espaço-tempo.",
      maos:
        "Calcule o fator de Lorentz para 0,5c e para 0,99c e veja como a conta cresce perto da luz.",
    },
    "Relatividade Geral": {
      oQue:
        "Relatividade geral troca a força pela geometria: massa e energia curvam o espaço-tempo, e os corpos seguem as geodésicas dessa geometria. Não há corda puxando; há caminho mais reto num espaço que não é plano. A luz também segue a curvatura, e o tempo passa mais devagar onde o campo é mais forte.",
      passos: [
        "Descreva a distribuição de massa e energia do sistema.",
        "Resolva a geometria que ela produz.",
        "Siga a geodésica do corpo ou da luz nessa geometria.",
      ],
      exemplo:
        "A luz de uma estrela que passa raspando o Sol chega desviada, e o desvio foi medido num eclipse: a previsão da geometria bateu com o céu. O mesmo campo atrasa o relógio, e o GPS corrige o tempo dos satélites todo dia, senão o erro de posição cresce quilômetros por dia. A gravidade não puxa o relógio; ela muda o ritmo do tempo.",
      quebra:
        "Pensar que gravidade é só força puxando. A descrição de Newton funciona no dia a dia, mas não explica o desvio da luz nem o ritmo do tempo. Trocar força por geometria não é enfeite: é o que faz a conta acertar perto de massa grande. No sistema solar, a diferença entre as duas descrições é pequena, mas aparece em relógio, órbita e luz curvada, e é medível com relógio atômico em laboratório.",
      levar: "Massa diz ao espaço como curvar; espaço diz à massa como andar.",
      maos:
        "Veja a curvatura em volta de uma massa e siga duas geodésicas que começam paralelas e se aproximam.",
    },
    "Gravitação Teórica": {
      oQue:
        "Buraco negro é o que sobra quando a curvatura fica tão forte que nem a luz escapa de dentro de uma fronteira. Essa fronteira é o horizonte de eventos: não é superfície sólida, é o ponto sem volta. Massa, carga e rotação descrevem o buraco; o resto do que caiu fica atrás do horizonte.",
      passos: [
        "Calcule o raio do horizonte a partir da massa.",
        "Separe o que orbita longe do que cai de vez.",
        "Acompanhe a radiação Hawking como evaporação lenta da massa.",
      ],
      exemplo:
        "Um buraco negro de dez massas solares tem horizonte de cerca de 30 km. Longe dele, a órbita de uma estrela é normal, como a de qualquer massa daquele tamanho; é só perto do horizonte que o caminho deixa de ter volta. A radiação Hawking existe, mas a temperatura é tão baixa que a evaporação leva mais tempo do que a idade do universo.",
      quebra:
        "Achar que buraco negro suga tudo como aspirador. Longe dele, a órbita é a de sempre; o que muda é a região interna ao horizonte. A imagem de sucção vem do desenho, não da conta, e leva a conclusão errada sobre órbitas estáveis. Uma estrela pode girar em volta do buraco por muito tempo sem cair, do mesmo jeito que orbita outra estrela.",
      levar: "O horizonte não é parede: é a linha onde todas as saídas deixam de existir.",
      maos:
        "Compare o raio do horizonte para 1, 10 e 100 massas solares e veja como ele cresce com a massa.",
    },
  },
};

// o nome da estação chega em caixa baixa do banco ("Grafos moleculares") e em
// caixa alta da lista do catálogo ("Grafos Moleculares"); a busca ignora isso
export function licaoDe(areaId, nome) {
  const porArea = LICOES[areaId];
  if (!porArea) return null;
  if (porArea[nome]) return porArea[nome];
  const alvo = String(nome || "").toLowerCase();
  const chave = Object.keys(porArea).find((k) => k.toLowerCase() === alvo);
  return chave ? porArea[chave] : null;
}

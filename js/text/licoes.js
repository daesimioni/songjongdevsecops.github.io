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
  "physics-eletronica": {
    "Semicondutores": {
      contexto:
        "Onde isso aparece: no diodo da fonte, no transistor do celular e no painel solar. A mesma junção que retifica corrente também converte luz em tensão, e o projeto muda pela dopagem e pela geometria, não pela troca do material. Quem entende a banda e o portador entende os três usos de uma vez, e reconhece o limite de cada um.",
      oQue:
        "Semicondutor é o material que fica no meio do caminho: conduz pouco quando puro e passa a conduzir bem quando recebe impureza controlada ou energia. A banda proibida do silício é pequena, então o elétron salta com pouco empurrão. Dopagem é a escolha do tipo de portador: elétron sobrando ou buraco sobrando, e é isso que dá ao componente o comportamento de diodo ou de transistor.",
      passos: [
        "Escolha o material e olhe a largura da banda proibida.",
        "Decida o tipo de dopante para o portador que você quer.",
        "Meça a condutividade em função da temperatura e da dopagem.",
      ],
      exemplo:
        "Silício puro tem cerca de dez bilhões de portadores por centímetro cúbico à temperatura ambiente, o que dá condução fraca. Dopar com fósforo, que tem um elétron a mais, sobe a contagem para cerca de dez quatrilhões e o material vira tipo n. Dopar com boro cria lacunas e vira tipo p. A mesma base, dois comportamentos, e o controle é a concentração do dopante.",
      quebra:
        "Tratar semicondutor como condutor comum. A condução depende de dopagem e de temperatura; aquecer aumenta a condutividade, ao contrário do metal, cuja resistência sobe. Confundir os dois leva a circuito que não funciona na temperatura real, e o erro só aparece no protótipo.",
      levar: "Semicondutor não é condutor pela metade: é condutor que se controla.",
      maos:
        "Compare a curva de condutividade contra temperatura de um metal e de um semicondutor.",
    },
    "Junções e Transistores": {
      contexto:
        "Onde isso aparece: em todo amplificador de áudio, no regulador de tensão e na chave que liga a tela. A diferença entre amplificar e chavear está na polarização, e o mesmo componente serve aos dois usos. Reconhecer a região de operação é o que separa o circuito que funciona do que aquece e queima.",
      oQue:
        "A junção p-n junta os dois tipos de semicondutor e cria uma porta de mão única: conduz num sentido e bloqueia no outro. O transistor põe duas junções juntas e usa essa porta para controlar corrente grande com sinal pequeno. Ele não cria energia; ele abre e fecha a passagem de uma fonte que já existe, e é por isso que o ganho vem acompanhado de fonte.",
      passos: [
        "Identifique as regiões p e n e a polarização aplicada.",
        "Ache o terminal de controle do transistor.",
        "Veja se ele está em corte, em saturação ou na região ativa.",
      ],
      exemplo:
        "Num transistor de junção, uma corrente de base de 1 mA pode controlar 100 mA de coletor, com ganho de 100. O sinal pequeno da base não vira potência: ele libera a corrente que a fonte de alimentação entrega. Se a fonte não tiver corrente suficiente, o ganho não aparece e o circuito distorce o sinal.",
      quebra:
        "Achar que o transistor amplifica energia. Energia não nasce no componente; o que ele faz é controlar um suprimento externo. Projetar amplificador sem dimensionar a fonte é o erro que queima o transistor ou entrega som cortado.",
      levar: "Transistor é torneira: a água vem da fonte, a mão só abre.",
      maos:
        "Varie a corrente de base e meça a de coletor; veja onde o ganho deixa de ser linear.",
    },
    "Supercondutividade": {
      contexto:
        "Onde isso aparece: em ímãs de ressonância magnética, em trens de levitação e nos qubits de alguns computadores. O custo do resfriamento é o que decide se a aplicação fecha a conta, e é por isso que material de temperatura crítica alta vale tanto. O fenômeno é o mesmo; o que muda é o preço de manter o frio, e esse preço entra na decisão de engenharia.",
      oQue:
        "Abaixo de uma temperatura crítica, alguns materiais perdem a resistência por completo e expulsam campo magnético do interior. Não é resistência pequena: é zero, e a corrente pode rodar em circuito fechado por muito tempo sem fonte. O efeito Meissner é a outra metade do fenômeno, e ele não se explica só por resistência nula.",
      passos: [
        "Resfrie o material abaixo da temperatura crítica.",
        "Confirme resistência nula e expulsão de campo magnético.",
        "Verifique se o campo aplicado não destrói o estado supercondutor.",
      ],
      exemplo:
        "O nióbio vira supercondutor perto de 9 K; o YBCO, perto de 92 K, o que permite resfriar com nitrogênio líquido em vez de hélio. Num ímã de ressonância, a corrente circula por anos sem fonte. Se o campo passar do limite crítico, o material volta ao estado normal na hora, e o ímã perde o campo.",
      quebra:
        "Esperar supercondutividade em temperatura ambiente nos materiais comuns. A maioria precisa de hélio ou nitrogênio líquido; prometer aplicação em temperatura ambiente sem material que sustente isso é o erro. O estado também tem limite de campo e de corrente.",
      levar: "Abaixo da crítica, a resistência não é pequena: é zero, e o campo sai do interior.",
      maos:
        "Diminua a temperatura e veja o ponto em que a resistência cai de uma vez; anote a temperatura e o campo crítico.",
    },
  },
  "chem-outras": {
    "Fotoquímica": {
      contexto:
        "Onde isso aparece: na fotossíntese, na cura de resina por luz ultravioleta, no protetor solar e na degradação de tintas. O mesmo fóton que cura também envelhece, e o controle é a dose e o comprimento de onda. Quem projeta com luz precisa saber qual faixa a molécula absorve, não só quanta energia chega.",
      oQue:
        "Fotoquímica estuda reação disparada por luz. O fóton entrega energia e muda a estrutura eletrônica da molécula, que passa a reagir por caminhos que o calor não abre. Luz e calor não são sinônimos: a luz pode excitar um estado específico e escolher o produto, e a cor do que se aplica importa tanto quanto a quantidade.",
      passos: [
        "Veja se a molécula absorve o comprimento de onda disponível.",
        "Relacione a energia do fóton com a transição que ela provoca.",
        "Acompanhe o produto que se forma e a fotodegradação que sobra.",
      ],
      exemplo:
        "A fotossíntese fixa carbono usando luz: o fóton excita a clorofila e a energia vira ligação química. A fotodegradação de um corante segue o mesmo princípio ao contrário: a luz quebra a molécula e a cor some. Em ambos, o comprimento de onda importa, e a reação só acontece se a molécula absorver aquela energia.",
      quebra:
        "Achar que calor e luz fazem sempre a mesma coisa. O calor distribui energia por muitos modos; o fóton pode excitar um estado específico e abrir caminho que o aquecimento não abre. Tratar os dois como equivalentes erra o produto e a velocidade.",
      levar: "Luz não é calor: é energia com endereço.",
      maos:
        "Mude a cor da luz e veja se a reação acontece; só o comprimento absorvido deve funcionar.",
    },
    "Química Forense": {
      contexto:
        "Onde isso aparece: em resíduo de disparo, em droga apreendida, em tinta de atropelamento e em incêndio. Em todos, o vestígio é pequeno e a documentação é o que separa prova de opinião. A técnica mais sensível do mundo não salva a análise se o caminho da amostra não puder ser contado em voz alta.",
      oQue:
        "Química forense identifica substância em vestígio e reconstrói fato com método. O vestígio é pequeno, então a técnica precisa ser sensível, e o resultado só vale se a amostra não foi alterada desde a coleta. É por isso que a cadeia de custódia é parte da análise, e não burocracia que se resolve depois do laudo.",
      passos: [
        "Documente a coleta com local, hora e responsável.",
        "Guarde a amostra de forma que ela não mude até a análise.",
        "Use amostra de referência para comparar e registre cada passo do caminho.",
      ],
      exemplo:
        "Um resíduo de pólvora na mão desaparece com lavagem. Se a coleta não for registrada e a amostra não for guardada em recipiente fechado, a defesa derruba o laudo: não há como provar que o material é o mesmo do local. A contraprova com amostra de referência é o que dá sentido ao número.",
      quebra:
        "Achar que resultado analítico vale sem documentação da coleta. O número pode estar certo e a prova ser inútil se a origem não se sustenta. Cadeia de custódia quebrada transforma análise correta em laudo descartado.",
      levar: "Prova boa é a que se pode reconstruir do vestígio ao laudo.",
      maos:
        "Simule duas amostras, uma documentada e outra não, e veja qual sobrevive a uma pergunta sobre a origem.",
    },
    "Química Verde": {
      contexto:
        "Onde isso aparece: na troca de solvente clorado por água, no catalisador que reduz etapa e no reaproveitamento de subproduto. A métrica entra na planilha antes da compra do insumo, e é ela que sustenta a escolha diante da diretoria. Quem compara rotas pelo rendimento sozinho escolhe a que gera mais resíduo.",
      oQue:
        "Química verde projeta o processo para gerar menos resíduo desde o começo, e não para tratar o resíduo no fim. A escolha do solvente, do catalisador e da rota muda quanto do reagente vira produto e quanto vira descarte. Economia de átomos mede exatamente essa fração, antes de qualquer tratamento, com a estequiometria na mão.",
      passos: [
        "Calcule a massa de produto esperada sobre a massa de reagentes.",
        "Troque solvente e catalisador por opções de menor risco.",
        "Evite etapa que só serve para purificar o que não deveria ter sobrado.",
      ],
      exemplo:
        "Numa reação com economia de átomos de 30%, 70% da massa dos reagentes vira resíduo por definição. Se a rota alternativa chega a 80%, o ganho aparece na conta de descarte e no custo, mesmo que o rendimento percentual seja parecido. A conta é feita antes de ligar o reator, e é ela que compara rotas.",
      quebra:
        "Chamar de verde todo processo que só troca o solvente e mantém o resto igual. Troca de solvente ajuda, mas não é projeto verde se a rota continua gerando o mesmo resíduo. Verde é métrica, não etiqueta.",
      levar: "Resíduo que não nasce não precisa ser tratado.",
      maos:
        "Calcule a economia de átomos de duas rotas e compare com o rendimento que cada uma promete.",
    },
  },
  "cs-emergente": {
    "Computação Quântica": {
      contexto:
        "Onde isso aparece: na migração de RSA para criptografia pós-quântica, na simulação de molécula e em sensores. A parte prática hoje é a defesa, não o ataque, e a agenda de migração não espera o hardware maduro. Quem guarda segredo por vinte anos precisa decidir a criptografia antes disso, e a migração leva mais tempo do que se imagina.",
      oQue:
        "Computador quântico usa qubits e portas unitárias: o estado pode ser superposição de caminhos, e a medida devolve um resultado com probabilidade. Para alguns problemas isso vira atalho real, como fatorar número grande; para a maioria, não. A vantagem depende do algoritmo, não do hardware sozinho, e a correção de erro é parte da conta.",
      passos: [
        "Descreva o problema como circuito de portas.",
        "Veja se existe atalho quântico conhecido para essa classe de problema.",
        "Conte com correção de erro e com o número de qubits físicos necessários.",
      ],
      exemplo:
        "O algoritmo de Shor fatora em tempo polinomial no número de qubits, e é isso que ameaça RSA. Um número de 2048 bits exigiria milhões de qubits físicos com correção de erro; o protótipo atual tem dezenas ou centenas. A ameaça é real no longo prazo, e a resposta prática é migrar a criptografia antes que ela chegue.",
      quebra:
        "Achar que computador quântico resolve qualquer problema mais rápido. Ele acelera classes específicas; para muitas tarefas, a máquina clássica continua melhor e mais barata. Prometer ganho universal é o erro de quem lê só o título.",
      levar: "Quântico é atalho para alguns problemas, não para todos.",
      maos:
        "Compare o custo de fatorar um número por força bruta e pelo algoritmo de Shor em qubits.",
    },
    "Computação Neuromórfica": {
      contexto:
        "Onde isso aparece: em câmera de eventos, em prótese que lê sinal e em sensor de borda com bateria pequena. O ganho some quando o dado chega denso e contínuo, porque a economia vem da esparsidade. Comparar pela carga real, e não pelo anúncio do chip, é o que evita trocar GPU por hardware que não serve, e o teste precisa ser no dado de produção.",
      oQue:
        "Arquitetura neuromórfica imita neurônio e sinapse: o processamento acontece em eventos esparsos, e o gasto acompanha o que se move, não o relógio. Em tarefa sensorial, como visão e áudio, isso rende consumo baixo. Em tarefa geral, ainda não substitui a GPU, e a comparação honesta é por carga de trabalho, não por moda.",
      passos: [
        "Codifique a entrada como eventos, no lugar de quadros fixos.",
        "Meça a densidade de disparos da rede.",
        "Compare consumo e latência com a solução clássica na mesma tarefa.",
      ],
      exemplo:
        "Uma câmera de eventos só reporta pixel que muda: cena parada gera quase nada, e o consumo cai junto. Numa tarefa de reconhecer gesto, um chip neuromórfico gasta miliwatts onde a GPU gasta watts. Na mesma tarefa de treinar um modelo grande, a GPU ganha com folga, e insistir no chip é desperdício de energia, de tempo e de dinheiro de projeto.",
      quebra:
        "Achar que neuromórfico é sempre melhor que GPU. Depende da tarefa e do dado: event-driven brilha com entrada esparsa e sofre quando o dado é denso. Escolher pela moda, e não pela carga, desperdiça dinheiro e atrasa o projeto.",
      levar: "Neuromórfico economiza quando o mundo chega em eventos.",
      maos:
        "Compare a taxa de eventos de uma cena parada e de uma cena com movimento.",
    },
    "Ética e Impacto": {
      contexto:
        "Onde isso aparece: no termo de uso que ninguém lê, no modelo que decide crédito e na automação que muda posto de trabalho. A decisão fica no código e no contrato, e é difícil desfazer depois que o sistema está no ar. Por isso a discussão de ética precisa acontecer na mesma mesa em que se escolhe a arquitetura.",
      oQue:
        "Computação afeta trabalho, privacidade e poder, e decisão técnica também é decisão social. Quem escolhe o que coletar, por quanto tempo e para qual fim está definindo o que pode acontecer com a vida das pessoas depois. Por isso privacidade entra no projeto desde o começo, e não como revisão final quando o sistema já está de pé.",
      passos: [
        "Declare a finalidade de cada dado coletado.",
        "Minimize o que é guardado e defina prazo e acesso.",
        "Escreva o que o sistema faz quando erra e quem responde.",
      ],
      exemplo:
        "Um aplicativo que pede localização para entregar comida precisa dela por minutos. Guardar o histórico por dois anos muda o risco sem melhorar o serviço. A decisão de guardar é técnica na aparência e política no efeito, e a pergunta certa é qual o menor dado que resolve o problema.",
      quebra:
        "Tratar ética como etapa final, depois do sistema pronto. Nessa altura, o dado já foi coletado e o modelo já aprendeu o viés; corrigir custa caro ou não acontece. A decisão de projeto é a que fica, e é ela que o usuário sente.",
      levar: "Dado que não existe não vaza: minimizar é a primeira defesa.",
      maos:
        "Liste os dados que o sistema pede e marque, para cada um, qual problema ele resolve e por quanto tempo precisa ficar.",
    },
  },
  "lingua-pragmatica": {
    "Atos de Fala": {
      contexto:
        "Onde isso aparece: no contrato verbal, no aviso de segurança e no pedido que só vale dito na hora. Uma promessa exige intenção e compromisso; sem eles, a frase é encenação. Já um pedido de desculpa não se resolve com a palavra certa se a ação continua igual.",
      oQue:
        "Falar também é agir. Quando alguém diz que promete, não está descrevendo o mundo: está assumindo compromisso, e a fala cria obrigação que antes não existia. Pedir, advertir, declarar e agradecer são atos com condições próprias, e a condição faz parte do ato tanto quanto a frase.",
      passos: [
        "Separe o que se diz, o ato locutório, do que se faz ao dizer, o ato ilocutório.",
        "Confira se as condições do ato estão presentes na situação.",
        "Veja se o papel de quem fala autoriza o ato que ele realiza.",
      ],
      exemplo:
        "Um juiz diz que declara o casamento e o casamento existe: o papel e a situação autorizam o ato. A mesma frase dita por um estranho na praça não muda nada. Com a promessa é parecido, mas a autorização é interior: quem promete precisa poder cumprir e assumir a obrigação diante de quem ouve.",
      quebra:
        "Achar que declarar oficialmente funciona fora da situação que autoriza o ato. Sem o papel e o contexto, a frase é só frase. O erro oposto é achar que promessa é sempre só palavra: quando as condições valem, o compromisso é real e cobra consequência.",
      levar: "Há frases que não descrevem o mundo: elas mudam o mundo.",
      maos:
        "Diga uma promessa, um pedido e uma advertência e marque, em cada uma, a condição que a torna ato.",
    },
    "Máximas Conversacionais": {
      limite:
        "A teoria descreve cooperação, não conversa hostil. Em interrogatório, propaganda ou briga, as máximas são quebradas de propósito para confundir, e inferir cooperação ali leva a erro. O modelo vale onde as partes querem se entender, e mesmo na conversa cooperativa a inferência pode falhar, porque quem infere completa com o próprio repertório.",
      contexto:
        "Onde isso aparece: na resposta que foge da pergunta, no elogio que corta e no quase chegando de quem nem saiu. A implicatura é o que se infere sem estar dito, e ela pode ser cancelada com uma ressalva. Quem lê só o literal perde o recado.",
      oQue:
        "A conversa segue expectativas de cooperação: quantidade, qualidade, relevância e clareza. Ninguém obedece a isso como regra escrita, mas todos notam quando é quebrado. A quebra proposital gera inferência, e o ouvinte calcula o que o falante quis dizer sem ter dito.",
      passos: [
        "Identifique qual máxima a fala parece quebrar.",
        "Pergunte por que o falante quebraria a expectativa justamente ali.",
        "Formule o sentido inferido e teste se uma ressalva cancela a implicatura.",
      ],
      exemplo:
        "Alguém pergunta se o relatório ficou bom e a resposta é que ele está no prazo. A máxima de quantidade foi quebrada: faltou dizer da qualidade. O ouvinte infere que a qualidade não é boa, e a inferência se cancela se o falante emendar que ficou ótimo.",
      quebra:
        "Tratar implicatura como significado literal da frase. O dicionário não traz o recado; ele nasce do contexto e do cálculo. Confundir os dois faz ler ameaça onde há piada e piada onde há aviso sério.",
      levar: "O que se infere não está escrito, mas foi dito.",
      maos:
        "Responda a uma pergunta com informação parcial e peça a alguém para dizer o que entendeu nas entrelinhas.",
    },
    "Ironia e Humor": {
      limite:
        "Nem toda contradição é ironia. Erro, mentira e mal-entendido também contradizem o contexto, e a diferença está na intenção e na marca. Sem sinal de inversão, atribuir ironia é adivinhação.",
      contexto:
        "Onde isso aparece: na manchete irônica, na legenda que comenta a foto e na piada que só funciona no tom. Sem o contexto, a frase é literal e o efeito desaparece; com contexto demais, a piada morre explicada.",
      oQue:
        "Ironia diz o contrário do que se quer significar, apoiada no contexto e na entonação. O humor joga com ambiguidade e expectativa: monta uma expectativa e quebra no fim. As duas coisas se parecem porque ambas dependem de o ouvinte perceber a distância entre o dito e o pretendido.",
      passos: [
        "Veja se o dito contradiz o que se sabe da situação.",
        "Procure a marca de entonação ou de contexto que sinaliza a inversão.",
        "Teste a leitura literal e veja se ela faz sentido ali.",
      ],
      exemplo:
        "Depois de um dia de chuva no deserto, dizer que o verão está agradável só é irônico para quem sabe do temporal. A mesma frase, numa praia em janeiro, é elogio literal. O contexto e a contradição com o que se sabe é o que sustenta a leitura irônica.",
      quebra:
        "Ler ironia sem contexto e concluir que o falante acredita no que disse. O erro aparece em resposta automática e em processo que toma frase de rede social ao pé da letra. A leitura irônica exige o quadro, não só a palavra.",
      levar: "Ironia não está na frase: está na distância entre a frase e a situação.",
      maos:
        "Escreva a mesma frase para duas situações opostas e veja quando ela vira ironia.",
    },
  },
  "lingua-semitica": {
    "Teoria dos Signos": {
      limite:
        "A divisão em três tipos é ferramenta, não caixa rígida. Um mesmo signo pode funcionar de mais de um modo, e o uso é que decide. Perguntar como ele funciona vale mais do que discuti-lo numa categoria.",
      contexto:
        "Onde isso aparece: no ícone do aplicativo, na seta que aponta e na palavra que nomeia. Distinguir os três evita discussão inútil: bandeira é símbolo, pegada é índice, retrato é ícone. A convenção muda com a cultura, e é por isso que símbolo precisa ser aprendido.",
      oQue:
        "Semiótica estuda signo e sentido. Ícone se parece com o que representa, índice indica por relação causal ou física, símbolo depende de convenção compartilhada. A mesma coisa pode funcionar dos três jeitos: uma foto de fumaça é ícone, a fumaça é índice de fogo e a placa de proibido é símbolo.",
      passos: [
        "Pergunte como o signo se liga ao objeto que representa.",
        "Veja se a ligação é semelhança, causa ou convenção.",
        "Confira se o leitor compartilha a convenção, quando for símbolo.",
      ],
      exemplo:
        "Uma placa vermelha com traço diagonal não se parece com proibido e não é causada por nada: ela vale porque a convenção foi combinada. Já a fumaça não foi combinada com ninguém, ela indica fogo por relação física. O mesmo desenho pode ser ícone numa cultura e símbolo em outra.",
      quebra:
        "Chamar de símbolo tudo que significa, sem distinguir ícone e índice. A confusão faz procurar convenção onde há causa e faz ignorar que o símbolo precisa ser ensinado. Cada tipo de signo exige uma pergunta diferente sobre o sentido.",
      levar: "Símbolo se aprende; ícone se reconhece; índice se conclui.",
      maos:
        "Separe cinco signos do dia a dia em ícone, índice e símbolo e justifique cada um.",
    },
    "Linguagem Visual": {
      limite:
        "Ler intenção em toda escolha pode virar paranoia. Nem todo recorte é ideologia; às vezes é limitação de lente ou de prazo. A pergunta continua, mas a resposta exige contexto de produção, de prazo e de quem publicou a imagem, que raramente aparece no quadro.",
      contexto:
        "Onde isso aparece: na foto de capa, no gráfico que corta o eixo e no close que esconde o contexto. Cor tem valor cultural e não é universal, e o contraste guia o olho para o ponto principal. Quem lê imagem precisa perguntar o que ficou de fora.",
      oQue:
        "Imagem também argumenta: cor, enquadramento, luz e composição orientam a leitura. O enquadramento decide o que aparece e o que fica fora, e essa escolha já é uma tese sobre o que importa. Nenhuma imagem é neutra, porque toda imagem recorta o mundo antes de mostrá-lo.",
      passos: [
        "Descreva o que está dentro do quadro.",
        "Liste o que o recorte deixou de fora.",
        "Veja qual ponto o contraste destaca e que ideia isso sustenta.",
      ],
      exemplo:
        "Uma foto de manifestação enquadrada no rosto de uma pessoa sugere multidão pequena; a mesma cena aberta mostra milhares. Nenhuma das duas mentiu, mas cada uma sustenta conclusão diferente. O enquadramento é a decisão editorial que o olho não vê, e a legenda costuma confirmar ou esconder essa escolha.",
      quebra:
        "Achar que imagem é neutra e não faz escolha. O recorte, a luz e a cor são decisões, e elas chegam antes do texto. Consumir imagem sem perguntar pelo fora do quadro é aceitar a tese sem discutir.",
      levar: "Toda imagem escolhe o que você vê; a pergunta é o que ela escondeu.",
      maos:
        "Pegue uma foto e faça dois recortes dela; escreva a conclusão que cada recorte sugere.",
    },
    "Multimodalidade": {
      limite:
        "Nem toda combinação gera sentido novo. Às vezes a legenda só repete a imagem, e o efeito é redundância. Procurar conflito onde há reforço inventa leitura que o texto não sustenta, e a análise perde credibilidade diante de quem conhece a produção.",
      contexto:
        "Onde isso aparece: no vídeo com trilha tensa, no gráfico com legenda de alerta e na notícia com foto escolhida. Som altera o clima da cena, e o ritmo de edição participa do sentido. A relação entre as partes é o que o leitor monta.",
      oQue:
        "Texto multimodal combina palavra, imagem, som e movimento, e o sentido nasce da relação entre eles. Legenda e imagem podem se reforçar ou se contradizer, e a contradição também significa. Ler só uma das linguagens é ler metade do texto e concluir pelo todo.",
      passos: [
        "Separe cada linguagem e descreva o que ela diz sozinha.",
        "Veja se as partes se reforçam ou se contradizem.",
        "Formule o sentido que nasce da relação entre elas.",
      ],
      exemplo:
        "Uma cena de criança brincando com trilha de suspense muda de sentido: o espectador espera o perigo. A imagem continua alegre, mas o som reescreve a leitura. Quando legenda e imagem se contradizem, o sentido nasce do conflito entre as linguagens, e não da soma delas.",
      quebra:
        "Ler só o texto e ignorar o que a imagem e o som dizem. O recado está na combinação, e a parte ignorada costuma ser justamente a que muda a conclusão. O erro é comum em resumo automático, que lê legenda e não vê cena.",
      levar: "Sentido multimodal é relação: cada parte muda o que a outra diz.",
      maos:
        "Troque a trilha de um vídeo curto e descreva o que mudou no sentido da cena.",
    },
  },
  "math-aplicada": {
    "Teoria dos Jogos": {
      contexto:
        "Onde isso aparece: no leilão, na negociação de preço, no rodízio de trânsito e na disputa por espectro. Estratégia dominante é melhor qualquer que seja a escolha do outro; quando ela existe, o jogo fica previsível. O dilema do prisioneiro mostra o desconforto: o equilíbrio é pior que a cooperação.",
      oQue:
        "Teoria dos jogos estuda decisão quando o resultado depende da escolha dos outros. Cada jogador tem estratégias e ganhos, e o equilíbrio de Nash é o ponto em que ninguém melhora mudando sozinho, mesmo que todos pudessem melhorar juntos. Equilíbrio não é o mesmo que resultado ótimo, e essa diferença é o coração da teoria.",
      passos: [
        "Liste os jogadores, as estratégias de cada um e os ganhos de cada combinação.",
        "Monte a matriz de ganhos com os números do problema.",
        "Procure a célula em que nenhum jogador ganha mudando sozinho de estratégia.",
      ],
      exemplo:
        "No dilema do prisioneiro, cada um tem incentivo para confessar, confesse ou não o outro. O equilíbrio é confissão dos dois, com pena maior do que se ambos ficassem calados. O resultado é estável e coletivamente pior, e é exatamente por isso que o conceito incomoda: ninguém tem motivo individual para sair dele.",
      quebra:
        "Confundir equilíbrio de Nash com resultado ótimo para todos. Nash é estabilidade, não bondade. Uma política pública que só olha o equilíbrio pode aceitar desfecho ruim que a cooperação evitaria.",
      limite:
        "O modelo supõe racionalidade e ganhos conhecidos. Gente real erra, aprende e muda de preferência, e o equilíbrio previsto pode nunca aparecer na prática. O jogo também muda quando é repetido e a reputação entra na conta.",
      levar: "Equilíbrio é onde ninguém se mexe; ótimo é onde todos estariam melhor.",
      maos:
        "Monte a matriz de um jogo 2x2 e encontre a célula em que ninguém ganha mudando sozinho.",
    },
    "Criptografia Matemática": {
      contexto:
        "Onde isso aparece: no cadeado do navegador, na assinatura de documento e na mensagem que viaja pela rede. Troca de chaves Diffie-Hellman usa logaritmo discreto e resolve o problema de combinar segredo em canal público. O elo fraco costuma ser a chave curta ou o gerador de número aleatório ruim.",
      oQue:
        "Criptografia usa problema difícil como fechadura: cifrar é fácil e abrir sem a chave é caro. A segurança mora na dificuldade computacional, não no segredo do método. RSA se apoia em fatorar produto de primos grandes, e chave curta derruba o castelo mesmo com algoritmo bom.",
      passos: [
        "Identifique o problema difícil que sustenta o esquema.",
        "Verifique o tamanho de chave exigido hoje para esse esquema.",
        "Confira de onde vem a aleatoriedade que gera a chave.",
      ],
      exemplo:
        "Um RSA de 2048 bits tem chave longa o bastante para o ataque de fatoração conhecido; 512 bits cai com esforço modesto. O algoritmo não ficou pior, o ataque ficou melhor. Por isso tamanho de chave se revisa com o tempo, e o inventário de sistema antigo é o que revela o risco escondido.",
      quebra:
        "Achar que esconder o algoritmo protege. A segurança deve estar na chave, e o algoritmo público é auditável. Segurança por obscuridade quebra no primeiro vazamento e não resiste a análise.",
      limite:
        "A conta vale para o ataque clássico. Um computador quântico grande muda o custo de fatorar e obriga a migrar o esquema, mesmo que hoje o tamanho esteja adequado.",
      levar: "A fechadura é pública; o segredo é a chave.",
      maos:
        "Compare o tempo de fatorar um número de 64 bits e um de 128 e veja como o custo cresce.",
    },
    "Matemática Biológica": {
      contexto:
        "Onde isso aparece: no plano de vacinação, no manejo de praga e no controle de estoque de leito. O número reprodutivo básico mede o potencial de contágio: quantas pessoas, em média, um infectado contagia num ambiente todo suscetível. Valor acima de um indica crescimento, e a conta orienta onde apertar.",
      oQue:
        "Modelo matemático traduz hipótese biológica em equação: população, epidemia, competição e difusão ganham taxa e predição. O modelo SIR divide a população em suscetíveis, infectados e recuperados e mostra como a epidemia sobe e desce. Modelo é aproximação, e só vale depois de confrontado com dado.",
      passos: [
        "Defina as classes e as taxas do modelo.",
        "Estime o R0 com dado real, não com número escolhido.",
        "Simule cenário e compare a curva prevista com a série observada.",
      ],
      exemplo:
        "Num SIR simples com R0 igual a 3, uma pessoa infecta três enquanto está doente, e a epidemia cresce enquanto houver suscetível. Vacinar não muda o vírus, muda a fração suscetível e derruba o número efetivo. Quando ele cai abaixo de um, a corrente se interrompe.",
      quebra:
        "Tomar o modelo como verdade sem confrontar com os dados. Equação bonita com parâmetro chutado produz previsão confiante e errada. A validação com série real é parte do modelo, não etapa opcional.",
      limite:
        "O SIR supõe mistura homogênea e imunidade permanente. Rede social, variação de comportamento e reinfecção exigem modelo mais fino, e o R0 sozinho não decide política pública.",
      levar: "Modelo bom não adivinha: ele erra de um jeito que se pode medir.",
      maos:
        "Rode um SIR com R0 igual a 1,5 e a 3 e compare a altura e a largura das curvas.",
    },
  },
  "physics-fluidos": {
    "Hidrostática": {
      contexto:
        "Onde isso aparece: no navio que flutua, no balão que sobe e na prensa hidráulica. O empuxo depende do volume submerso e da densidade do fluido, não da massa do corpo. É por isso que ferro oco flutua e ferro maciço afunda, com a mesma massa.",
      oQue:
        "Em fluido em repouso, a pressão cresce com a profundidade e empurra em todas as direções. Pressão é força por área, e a diferença entre a pressão de baixo e a de cima do corpo é o empuxo. Arquimedes resume: empuxo é igual ao peso do fluido deslocado.",
      passos: [
        "Calcule a pressão em cada face do corpo.",
        "Some as forças e compare com o peso do corpo.",
        "Confira o resultado pelo peso do fluido deslocado.",
      ],
      exemplo:
        "Um bloco de um litro submerso em água desloca um quilo de água, e o empuxo é o peso disso, cerca de 10 newtons. Se o bloco pesa 30 newtons, ele afunda; se pesa 5, sobe até deslocar só o necessário. O volume submerso se ajusta sozinho até o equilíbrio.",
      quebra:
        "Achar que o empuxo depende da massa do corpo e não do volume submerso. A confusão leva a esperar que corpo mais pesado receba mais empuxo, quando o que importa é o volume que ele desloca.",
      limite:
        "A fórmula direta vale para fluido em repouso e corpo totalmente envolvido. Com escoamento, superfície livre instável ou capilaridade, a conta simples não fecha e a medição vira necessária.",
      levar: "Flutuar é deslocar o próprio peso em fluido.",
      maos:
        "Pese um objeto no ar e dentro da água e compare a diferença com o peso do volume deslocado.",
    },
    "Escoamento e Turbulência": {
      contexto:
        "Onde isso aparece: no encanamento, no fluxo sanguíneo, na chaminé e na asa. Laminar é previsível; turbulento mistura muito e gasta mais energia. A equação de Bernoulli vale em regime ideal, sem perda, e aplicá-la fora disso inventa energia.",
      oQue:
        "Fluido em movimento pode ser laminar, em camadas previsíveis, ou turbulento, com redemoinhos que misturam tudo. A viscosidade e a velocidade decidem o regime, e o número de Reynolds resume a comparação entre inércia e viscosidade. É ele que diz se a previsão simples vale.",
      passos: [
        "Calcule o número de Reynolds com densidade, velocidade, diâmetro e viscosidade.",
        "Classifique o regime pela faixa do número obtido.",
        "Escolha a equação adequada ao regime e inclua a perda de carga.",
      ],
      exemplo:
        "Água a um metro por segundo num tubo de dois centímetros tem Reynolds perto de vinte mil, bem acima de 2.300, e o escoamento é turbulento. Óleo viscoso no mesmo tubo pode ficar laminar. A mesma velocidade, fluidos diferentes, regimes diferentes, e a perda de carga muda junto.",
      quebra:
        "Usar Bernoulli em tubulação com perda de carga e concluir que a energia apareceu. Sem perda, a conta fecha; com atrito, parte da energia vira calor e a equação precisa de termo de perda.",
      limite:
        "Reynolds é estimativa de regime, não resposta exata. Transição, rugosidade e entrada do tubo fazem a faixa real variar, e o projeto precisa de margem.",
      levar: "O regime decide a equação, não o contrário.",
      maos:
        "Mude a vazão e veja o ponto em que o escoamento deixa de ser laminar.",
    },
    "Aerodinâmica": {
      contexto:
        "Onde isso aparece: no perfil de asa, no defletor do carro e na pá do ventilador. Arrasto cresce com o quadrado da velocidade, então dobrar a velocidade quadruplica a força. É por isso que a economia de combustível cai tanto acima de certa faixa.",
      oQue:
        "Aerodinâmica estuda o ar em volta de corpos que se movem. Sustentação vem da diferença de pressão entre as faces da asa, arrasto é a força que resiste, e a camada-limite é a faixa de ar freada perto da superfície. As três ideias explicam asa, carro e turbina.",
      passos: [
        "Desenhe o perfil e a direção do escoamento.",
        "Identifique a camada-limite e onde ela se separa.",
        "Calcule sustentação e arrasto com os coeficientes da faixa de operação.",
      ],
      exemplo:
        "Um carro a 100 km/h gasta boa parte da potência só vencendo o ar; a 200 km/h o arrasto quadruplica e a potência exigida cresce muito mais rápido que a velocidade. Um spoiler que aumenta a carga pode aumentar o arrasto, e a escolha depende do que se quer.",
      quebra:
        "Explicar a sustentação só pelo tempo de percurso do ar sobre as asas, a história do caminho mais longo. A explicação certa envolve circulação, curvatura e diferença de pressão; a história simples não prevê bem.",
      limite:
        "Coeficientes de sustentação e arrasto valem para a faixa ensaiada. Ângulo alto, gelo na asa ou escoamento separado mudam tudo, e o número medido em túnel não se transfere sem escala.",
      levar: "Arrasto cobra o quadrado da pressa.",
      maos:
        "Compare o arrasto em três velocidades e veja a curva subir ao quadrado.",
    },
  },
  "physics-atomica": {
    "Estrutura Atômica": {
      contexto:
        "Onde isso aparece: na tabela periódica, no isótopo do carbono e no laser. Isótopo tem mesmo número de prótons e nêutrons diferentes; a química é parecida e a massa não. Configuração eletrônica segue ordem de energia e decide a ligação.",
      oQue:
        "O átomo tem núcleo pequeno e denso, com elétrons em orbitais ao redor. O número de prótons define o elemento, e a configuração eletrônica explica a química. Orbital não é órbita circular: é região de probabilidade, e essa diferença muda a forma de pensar a ligação.",
      passos: [
        "Conte os prótons para identificar o elemento.",
        "Conte os nêutrons para saber o isótopo.",
        "Distribua os elétrons pelos níveis e veja a camada de valência.",
      ],
      exemplo:
        "Todo carbono tem seis prótons; com seis nêutrons é o carbono-12, com oito é o carbono-14, que decai e serve para datar material orgânico. A química do carbono não muda com o isótopo, mas a massa e a estabilidade mudam, e a datação depende disso.",
      quebra:
        "Achar que orbital é uma órbita circular com raio definido. O elétron não tem trajetória determinada; o orbital dá a probabilidade de encontrá-lo. A imagem de planeta girando atrapalha a entender ligação, espectro e a própria leitura da tabela periódica.",
      limite:
        "O modelo de níveis funciona bem para átomo isolado e para a química comum. Em átomo pesado, efeito relativístico e correlação eletrônica mexem nos níveis, e a conta simples precisa de correção.",
      levar: "Próton é identidade; nêutron é massa; elétron é química.",
      maos:
        "Monte a configuração eletrônica de dois elementos vizinhos e compare a camada de valência.",
    },
    "Espectroscopia": {
      contexto:
        "Onde isso aparece: na análise de estrela, no teste de chama, no sensor de gás e no laudo de liga metálica. A composição estelar sai da espectroscopia, e o desvio das linhas ainda revela velocidade. Pouca coisa na física rende tanta informação.",
      oQue:
        "Cada átomo absorve e emite cores próprias, porque os níveis de energia são fixos. O espectro de emissão mostra linhas brilhantes; o de absorção mostra faixas escuras no contínuo. Essa assinatura permite identificar material à distância, inclusive estrela que ninguém vai visitar.",
      passos: [
        "Obtenha o espectro com fonte calibrada.",
        "Localize as linhas e compare com a tabela de referência.",
        "Meça a intensidade e o desvio de cada linha.",
      ],
      exemplo:
        "O sódio tem linhas amarelas características perto de 589 nanômetros. Se elas aparecem no espectro de uma estrela, o sódio está lá; se aparecem deslocadas, a estrela se move. O mesmo raciocínio identifica metal em liga e gás em atmosfera.",
      quebra:
        "Achar que espectro contínuo e de linhas são a mesma coisa. Contínuo vem de corpo quente e denso; linhas vêm de transição entre níveis. Sem separar os dois, a leitura da composição sai errada, e a linha de emissão vira ruído de fundo.",
      limite:
        "Linha forte não é quantidade grande: a intensidade depende de temperatura, pressão e da própria transição. Ler abundância exige modelo, e a linha sozinha não fecha a conta.",
      levar: "O átomo assina com luz; o espectro é a assinatura.",
      maos:
        "Compare o espectro de uma lâmpada de sódio e de uma incandescente e marque a diferença.",
    },
    "Átomos Ultrafrios": {
      contexto:
        "Onde isso aparece: no relógio atômico que sustenta o GPS, no sensor inercial e na simulação de material. Lasers resfriam átomos por pressão de radiação, freando o movimento. O condensado não é gás comum frio: é estado quântico coletivo, com coerência de fase.",
      oQue:
        "Resfriando átomos a temperaturas minúsculas, o comprimento de onda quântico cresce e os efeitos deixam de ser só microscópicos. No condensado de Bose-Einstein, muitos átomos ocupam o mesmo estado quântico de menor energia e se comportam como uma onda só. Laser e relógio atômico usam a mesma física de transição.",
      passos: [
        "Resfrie com laser e depois com evaporação.",
        "Confira a temperatura e a densidade da nuvem.",
        "Veja se a fração condensada aparece na medida.",
      ],
      exemplo:
        "Um relógio atômico conta transições de césio a 9,2 bilhões de vezes por segundo e erra menos de um segundo em milhões de anos. O condensado, em laboratório, mostra interferência entre átomos como se fossem onda única. A mesma mecânica quântica, aplicações bem diferentes.",
      quebra:
        "Confundir condensado com gás comum muito frio. A diferença é a ocupação coletiva do mesmo estado, com coerência de fase. Chamar de condensado qualquer gás gelado é erro de definição.",
      limite:
        "O condensado existe por fração de segundo e exige vácuo e armadilha. Fora do laboratório o estado é frágil, e aplicação prática ainda depende de engenharia de vácuo, de óptica estável e de controle de vibração.",
      levar: "Frio extremo não congela a quântica: revela.",
      maos:
        "Compare a velocidade de átomo a temperatura ambiente e a microkelvin e veja o comprimento de onda crescer.",
    },
  },
  "physics-nuclear": {
    "Física Nuclear": {
      contexto:
        "Onde isso aparece: na datação por carbono, no laudo de contaminação e na medicina nuclear. Alfa, beta e gama têm poder de penetração diferente, e o cuidado muda com o tipo. Carbono-14 data matéria orgânica antiga porque a proporção na atmosfera se mantém e o decaimento começa na morte do organismo.",
      oQue:
        "Núcleo instável decai emitindo partícula ou radiação até chegar a uma configuração mais estável. O processo é aleatório no átomo individual e regular no conjunto, e é essa regularidade que a meia-vida mede: o tempo para metade dos núcleos decair. Meia-vida não é o tempo em que a amostra inteira some.",
      passos: [
        "Identifique o isótopo e o tipo de decaimento.",
        "Meça a atividade e compare com a esperada para a massa da amostra.",
        "Aplique a meia-vida para datar o material ou calcular a dose.",
      ],
      exemplo:
        "O carbono-14 tem meia-vida de 5.730 anos. Um osso com metade do carbono-14 esperado tem cerca de 5.730 anos; com um quarto, cerca de 11.460. Duas meias-vidas, dois quartos, e a conta segue a mesma regra para qualquer isótopo. A amostra nunca fica com zero: ela se aproxima do zero sem encostar.",
      quebra:
        "Achar que meia-vida significa que a amostra inteira decai naquele tempo. Metade decai, depois metade do que restou, e a curva não tem fim. Confundir as duas coisas erra a data e erra a dose.",
      limite:
        "A conta supõe amostra fechada, sem ganho nem perda de isótopo. Contaminação, troca com o ambiente ou material muito velho estouram o limite de detecção e invalidam a data.",
      levar: "Meia-vida é metade do que sobrou, não metade do que havia no começo.",
      maos:
        "Calcule a fração restante depois de três meias-vidas e compare com o que a sonda mostra.",
    },
    "Física de Partículas": {
      contexto:
        "Onde isso aparece: no acelerador, no decaimento do méson e no bóson de Higgs. O Higgs explica a massa das partículas elementares, e a descoberta em 2012 fechou uma peça que faltava. O modelo acerta com precisão enorme e ainda assim não é a teoria final.",
      oQue:
        "O Modelo Padrão descreve quarks, léptons e as forças forte, fraca e eletromagnética. Prótons e nêutrons são feitos de quarks, e as forças viajam por bósons: fóton, glúon, W e Z. A gravidade fica fora do modelo, e essa ausência é uma das pistas do que ainda falta.",
      passos: [
        "Identifique a partícula e a força que ela sente.",
        "Desenhe o diagrama de interação com o que entra e o que sai.",
        "Confira a conservação de carga, de energia e de número de família.",
      ],
      exemplo:
        "O decaimento do nêutron em próton, elétron e antineutrino acontece pela força fraca, com bóson W. A carga se conserva, a energia se conserva e o número de família também. O diagrama mostra o caminho, e a conta fecha em cada vértice.",
      quebra:
        "Achar que o Modelo Padrão inclui gravidade. Ele não inclui. Isso não o torna errado no que descreve; torna-o incompleto. Confundir os dois leva a esperar que ele explique a expansão do universo.",
      limite:
        "O modelo não inclui matéria escura nem explica a massa do neutrino como deveria, e a gravidade fica fora. Fora dessas lacunas a precisão é altíssima, e por isso a física procura extensão, não substituição.",
      levar: "O Modelo Padrão acerta quase tudo e não é o fim da história.",
      maos:
        "Desenhe o decaimento do nêutron e confira carga e energia antes e depois.",
    },
    "Astropartículas": {
      contexto:
        "Onde isso aparece: no LHC, no acelerador de hospital e na fonte de luz síncrotron. O acelerador não tira energia do vácuo: ele injeta energia nos campos. O que se mede depois é o rastro do que sobrou, e é dele que se deduz a partícula.",
      oQue:
        "Acelerador empurra partícula a energia alta para criar colisão e revelar estrutura interna. Campo elétrico acelera, campo magnético curva, e o detector mede trajetória e energia dos fragmentos. A colisão recria condição do universo primordial em escala de laboratório.",
      passos: [
        "Identifique o feixe e a energia de projeto.",
        "Veja como o campo curva a trajetória de cada carga.",
        "Meça o rastro no detector e reconstrua a massa da partícula.",
      ],
      exemplo:
        "Um elétron num campo magnético de um tesla com energia de um gigaelétron-volt descreve curva de raio próximo de 3,3 metros. O raio mede o momento, e a curvatura no detector é a régua. Duas partículas com a mesma energia e cargas opostas curvam para lados opostos.",
      quebra:
        "Imaginar que o acelerador tira energia do vácuo. Ele injeta energia nos campos e gasta potência para isso. A conta de energia fecha no sistema, e o que se ganha é concentração, não criação.",
      limite:
        "A energia de colisão cresce, mas o custo e o tamanho crescem mais rápido. Há limite prático de túnel e de ímã, e é por isso que a próxima geração estuda outro esquema de aceleração. O detector, por sua vez, cresce junto: quanto maior a energia, mais fragmento e mais camada de medida.",
      levar: "Acelerador é lupa de energia: concentra para ver o que estava junto.",
      maos:
        "Compare a curvatura de partícula com carga oposta no mesmo campo e veja o que muda.",
      pergunta: {
        q: "O que um detector de raios cósmicos mede na superfície?",
        a: "A cascata de partículas que o raio cósmico produz na atmosfera",
        why: "O raio cósmico de alta energia colide no ar e gera um chuveiro de partículas; o detector mede o rastro do chuveiro e reconstrói a energia e a direção do primário.",
      },
    },
  },
  "physics-condensada": {
    "Estrutura Cristalina": {
      contexto:
        "Onde isso aparece: no laudo de mineral, no projeto de liga e no remédio cristalino. Vidro é amorfo: não tem periodicidade de longo alcance, e por isso não dá picos de difração. A anisotropia é consequência da rede: a propriedade muda com a direção.",
      oQue:
        "Sólido cristalino tem átomos em rede periódica, e a repetição explica dureza, condutividade e anisotropia. A célula unitária é o bloco que se repete, e os índices de Miller nomeiam planos da rede. A difração de raios X revela a estrutura porque o espaçamento é da ordem do comprimento de onda.",
      passos: [
        "Identifique a célula unitária e os parâmetros de rede.",
        "Nomeie os planos de interesse com os índices de Miller.",
        "Compare o padrão de difração com a estrutura proposta.",
      ],
      exemplo:
        "Um cristal de sal tem rede cúbica com aresta de cerca de 0,56 nanômetro. O padrão de difração mostra picos em ângulos que dependem desse espaçamento, e a posição dos picos identifica a estrutura. Mudou a rede, mudou o padrão, e a medida vira impressão digital.",
      quebra:
        "Tratar sólido amorfo como cristal. Vidro não tem periodicidade de longo alcance; tem ordem local e desordem global. Esperar picos de difração de vidro é esperar o que a estrutura não pode dar.",
      limite:
        "A difração dá a média da estrutura, e defeito, impureza e domínio pequeno alargam o pico. Cristal muito pequeno ou mal formado não rende estrutura limpa, e a análise precisa de outra técnica.",
      levar: "A rede periódica é o que dá ao cristal a impressão digital.",
      maos:
        "Compare o padrão de difração de um cristal e de um vidro e veja a diferença.",
    },
    "Bandas e Magnetismo": {
      contexto:
        "Onde isso aparece: no diodo, no ímã permanente e no sensor de campo. A mesma ideia de banda explica por que cobre conduz e diamante não, mesmo sendo os dois sólidos organizados. A temperatura e a dopagem mexem na ocupação e mudam o comportamento.",
      oQue:
        "Em sólido, os níveis eletrônicos se juntam em bandas. A ocupação dessas bandas separa metal, isolante e semicondutor: banda parcialmente cheia conduz, banda cheia com gap grande isola, gap pequeno permite conduzir com pouco estímulo. O magnetismo também nasce da organização dos spins.",
      passos: [
        "Desenhe as bandas de valência e de condução.",
        "Veja a ocupação e o tamanho do gap.",
        "Relacione com a condutividade medida e com a resposta magnética.",
      ],
      exemplo:
        "O cobre tem banda parcialmente cheia e conduz bem; o diamante tem gap de cerca de 5,5 elétron-volt e é isolante; o silício tem gap de 1,1 e conduz quando recebe energia. A diferença não está no átomo sozinho, está no arranjo e na ocupação.",
      quebra:
        "Achar que todo material que conduz um pouco é metal. Condução fraca pode ser semicondutor, eletrólito ou isolante com defeito. A teoria de bandas separa os casos pelo gap e pela ocupação, não pela aparência.",
      limite:
        "A imagem de banda é boa para sólido periódico e bem ordenado. Em vidro metálico, polímero condutor e material fortemente correlacionado, a conta simples precisa de modelo mais fino.",
      levar: "O gap é a distância entre não conduzir e conduzir.",
      maos:
        "Compare o gap de três materiais e preveja qual conduz à temperatura ambiente.",
    },
    "Nanofísica": {
      contexto:
        "Onde isso aparece: no marcador biológico, na célula solar e no catalisador. A nanopartícula não é só uma versão pequena do material: é outra coisa, com propriedade que depende do tamanho. Por isso a especificação precisa dizer diâmetro e revestimento, não só a fórmula.",
      oQue:
        "Em escala nanométrica, superfície e efeito quântico dominam as propriedades. A razão superfície/volume cresce muito, e boa parte dos átomos fica na fronteira. Ponto quântico muda de cor pelo tamanho, e o ouro pode deixar de ser dourado.",
      passos: [
        "Meça o diâmetro e a dispersão de tamanho da amostra.",
        "Calcule a fração de átomos que está na superfície.",
        "Relacione essa fração com a propriedade medida.",
      ],
      exemplo:
        "Um ponto quântico de seleneto de cádmio com dois nanômetros emite azul; com cinco, emite vermelho. O material é o mesmo, o tamanho muda a energia do estado e a cor. A aplicação em tela usa exatamente esse controle de tamanho.",
      quebra:
        "Esperar que nanopartícula tenha as mesmas propriedades do material volumoso. A superfície e o confinamento mudam ponto de fusão, cor, reatividade e magnetismo. Comparar sem declarar o tamanho é comparar coisas diferentes.",
      limite:
        "Abaixo de certo tamanho a partícula fica instável e aglomera, e a medida depende do revestimento. Escalar a síntese mantendo o tamanho é o desafio de produção, e o laboratório não garante a fábrica.",
      levar: "No nano, o tamanho é parte da identidade do material.",
      maos:
        "Compare a cor de duas suspensões de mesmo material com tamanhos diferentes.",
    },
  },
  "physics-plasma": {
    "Ionização e Ondas": {
      contexto:
        "Onde isso aparece: na lâmpada fluorescente, na solda a arco, na aurora e no vento solar. Ondas de plasma têm frequência ligada à densidade de elétrons, e é por isso que a medida de rádio revela densidade. Chamar qualquer gás quente de plasma sem ionização é erro de definição.",
      oQue:
        "Plasma é gás ionizado que responde a campo elétrico e magnético. Elétrons e íons livres tornam o meio condutor, e a resposta coletiva é o que separa plasma de gás quente comum. É o estado mais comum do universo visível: estrela, raio e aurora são plasma.",
      passos: [
        "Meça o grau de ionização do gás.",
        "Confira a resposta a campo magnético.",
        "Veja a frequência de oscilação do plasma e a densidade de elétrons.",
      ],
      exemplo:
        "Num gás a dez mil graus com ionização pequena, a resposta ao campo ainda é fraca; a partir de ionização apreciável, o meio conduz e reflete onda de rádio. A ionosfera reflete ondas curtas e permite comunicação a longa distância por esse motivo.",
      quebra:
        "Chamar qualquer gás quente de plasma sem ionização. A temperatura sozinha não define; o que define é a presença de carga livre e a resposta coletiva. A confusão leva a esperar condução onde não há.",
      limite:
        "A descrição coletiva vale quando há muitos elétrons por esfera de Debye. Plasma muito rarefeito ou muito frio escapa do modelo, e a fronteira entre gás e plasma é gradual.",
      levar: "Plasma não é gás quente: é gás com carga livre que responde junto.",
      maos:
        "Compare a resposta ao ímã de um gás quente e de uma chama ionizada.",
    },
    "Confinamento Magnético": {
      contexto:
        "Onde isso aparece: no tokamak, no stellarator e na garrafa magnética. Alta temperatura sozinha não basta: sem confinamento, o plasma esfria na hora em que encosta no material. O tempo de confinamento e a densidade entram na conta junto com a temperatura.",
      oQue:
        "Campo magnético curva partícula carregada e pode prender plasma quente longe das paredes. Tokamak é câmara em forma de rosca com campo toroidal, e a instabilidade é o inimigo: se o plasma toca a parede, esfria e a reação para. Confinamento é o desafio central da fusão.",
      passos: [
        "Desenhe o campo e a trajetória da partícula carregada.",
        "Meça densidade, temperatura e tempo de confinamento.",
        "Verifique a estabilidade do plasma durante o pulso.",
      ],
      exemplo:
        "Num tokamak, o campo toroidal soma com o campo gerado pela própria corrente do plasma e produz linhas helicoidais. Se a corrente desalinha, a instabilidade cresce e o plasma encosta na parede em milissegundos. O controle da corrente é o que segura a descarga.",
      quebra:
        "Achar que só a temperatura alta basta. Sem confinamento, o plasma esfria na parede e a fusão para. Temperatura, densidade e tempo precisam valer juntos, e o produto é o critério.",
      limite:
        "O tokamak funciona em pulso e sofre com instabilidade; o stellarator busca estabilidade com geometria complexa. Nenhum dos dois resolveu a conta econômica ainda, e o material da parede também é limite.",
      levar: "Fusão é tão difícil pelo confinamento quanto pela temperatura.",
      maos:
        "Siga a trajetória de uma partícula carregada num campo toroidal e veja por que ela não escapa reta.",
    },
    "Fusão Controlada": {
      contexto:
        "Onde isso aparece: no reator experimental, no projeto de usina e no debate sobre resíduo. Fusão não produz resíduo radioativo de longa duração como a fissão, mas ativa o material da parede e exige trítio, que é escasso. A conta técnica e a econômica não são a mesma.",
      oQue:
        "Fusão junta núcleos leves e libera energia, ao contrário da fissão, que quebra núcleo pesado. No Sol a fusão acontece por gravidade; na Terra é preciso plasma quente e confinado. Deutério e trítio são os combustíveis mais estudados, e a reação libera nêutron que carrega a maior parte da energia.",
      passos: [
        "Escolha a reação e calcule a energia liberada por evento.",
        "Aplique o critério de Lawson para o combustível e a geometria.",
        "Veja como extrair a energia que o nêutron carrega.",
      ],
      exemplo:
        "A reação de deutério com trítio libera 17,6 megaelétron-volt, e cerca de 80% vão para o nêutron. O nêutron atravessa o plasma e deposita energia no módulo de parede, que precisa aguentar o fluxo. Sem extrair essa energia, o reator não fecha a conta.",
      quebra:
        "Confundir fusão nuclear com fusão de sólido ou de metal. A palavra é a mesma, o processo não. A confusão aparece em conversa sobre energia e leva a conclusão errada sobre prazo e risco.",
      limite:
        "A fusão ainda não é comercial: o ganho de energia precisa superar o consumo com margem, e o trítio tem de ser reproduzido no próprio reator. O prazo depende de engenharia de material, não só de física de plasma.",
      levar: "Fusão é a energia da estrela, e a dificuldade é trazer a estrela para a Terra.",
      maos:
        "Compare a energia liberada por fusão de deutério-trítio e por fissão de urânio por núcleo.",
    },
  },
  "chem-geral": {
    "Reações e Soluções": {
      contexto:
        "Onde isso aparece: no soro do hospital, no reagente do laboratório e no aditivo do combustível. Solubilidade depende de temperatura e do solvente, e passar do limite deixa precipitado no fundo. A conta de diluição é a mais usada da bancada, e o erro mais comum é achar que diluir remove soluto.",
      oQue:
        "Reação química rearranja átomos: nada some, tudo troca de par. Em solução, a concentração diz quanto soluto existe por volume, e a unidade carrega essa razão. Diluir é acrescentar solvente: o volume cresce, a quantidade de soluto não muda e a concentração cai na mesma proporção.",
      passos: [
        "Meça a concentração inicial e o volume da solução.",
        "Calcule a quantidade de soluto, que não muda na diluição.",
        "Aplique o volume final para achar a concentração nova.",
      ],
      exemplo:
        "Tomar 100 mililitros de solução 1 mol por litro e acrescentar água até 1 litro deixa a concentração em 0,1 mol por litro. A quantidade de soluto continua a mesma, porque só entrou solvente. Se você precisasse de 0,5 mol por litro, o volume final seria 200 mililitros, e a conta é sempre a mesma.",
      quebra:
        "Diluir e achar que a quantidade de soluto diminui junto com a concentração. A quantidade fica; o que cai é a razão. Confundir as duas coisas erra a dose e erra o rendimento da reação.",
      limite:
        "A conta supõe soluto que não reage e volume aditivo. Em solução concentrada o volume pode não somar, e reação com o solvente muda a quantidade real.",
      levar: "Diluir espalha o mesmo soluto em mais volume.",
      maos:
        "Dilua uma solução colorida em três volumes e compare a cor com a concentração calculada.",
    },
    "Equilíbrio Ácido-base": {
      contexto:
        "Onde isso aparece: no sangue, no refrigerante, no solo agrícola e no tratamento de água. pH igual a 7 é neutro em água a 25 graus, e a neutralidade muda com a temperatura. A escala logarítmica engana quem lê como se fosse linear.",
      oQue:
        "Ácido doa próton e base recebe. O pH mede a acidez em escala logarítmica, então cada unidade é fator dez na concentração de íon hidrogênio. Tampão resiste à mudança de pH porque tem par ácido-base que consome o que chega.",
      passos: [
        "Identifique o ácido e a base do sistema em estudo.",
        "Calcule a concentração de íon hidrogênio a partir do pH.",
        "Veja se há tampão e qual a capacidade dele antes de prever o pH final.",
      ],
      exemplo:
        "pH 3 tem concentração de íon hidrogênio de 0,001 mol por litro; pH 5 tem 0,00001. A diferença é de cem vezes, não de duas. Por isso um refrigerante com pH perto de 3 é bem mais ácido que café com pH 5, e a boca sente a diferença.",
      quebra:
        "Achar que pH 3 é três vezes mais ácido que pH 4. É dez vezes. A leitura linear da escala leva a subestimar acidez e a errar a dose de neutralizante.",
      limite:
        "O pH mede atividade, não concentração total, e em solução muito concentrada a conta simples desvia. Fora da faixa da água, solvente diferente muda a escala.",
      levar: "pH é régua de potência: uma unidade é dez vezes.",
      maos:
        "Meça o pH de três soluções e calcule a razão de acidez entre elas.",
    },
    "Oxidação e Redução": {
      contexto:
        "Onde isso aparece: na pilha, na ferrugem, no clareamento e na respiração celular. A pilha separa as duas metades para obrigar o elétron a passar pelo circuito, e a corrente é o elétron em trânsito. O número de oxidação é a contabilidade que revela quem fez o quê.",
      oQue:
        "Em redox, um elemento perde elétrons e outro ganha, sempre juntos: não existe doador sem receptor. A variação do número de oxidação denuncia o processo, e quem perde elétrons oxida. Oxigênio não é obrigatório, apesar do nome que ficou por herança.",
      passos: [
        "Atribua número de oxidação a cada átomo da reação.",
        "Veja quem aumentou e quem diminuiu de número.",
        "Balanceie os elétrons e confira a carga total dos dois lados.",
      ],
      exemplo:
        "Na formação da ferrugem, o ferro passa de zero para mais três e perde elétrons; o oxigênio passa de zero para menos dois e ganha. Os dois processos somam zero em elétrons. Sem o oxigênio como receptor, o ferro não oxidaria nessa condição.",
      quebra:
        "Dizer que oxigênio é obrigatório em toda oxidação. O nome ficou por herança, e a definição é perda de elétron. Enxofre, cloro e até hidrogênio podem oxidar em reação sem oxigênio.",
      limite:
        "Número de oxidação é contabilidade formal, não carga real em ligação covalente. Em composto com ligação polar a atribuição é convenção, e a conclusão sobre mecanismo exige mais que a conta.",
      levar: "Redox é dança de elétron: um perde, outro ganha, ninguém fica sem par.",
      maos:
        "Atribua número de oxidação nas duas metades de uma reação e veja quem oxidou.",
    },
  },
  "chem-polimeros": {
    "Polimerização": {
      contexto:
        "Onde isso aparece: no plástico do copo, na fibra do tecido e na resina da pintura. Todo plástico vem de monômero, mas não do mesmo; polietileno, náilon e PET têm rotas diferentes. A escolha da rota muda o subproduto e o custo de purificação.",
      oQue:
        "Monômeros se ligam formando cadeia longa, e o tamanho da cadeia decide a propriedade. Adição encadeia sem perder átomo; condensação perde molécula pequena a cada ligação. O grau de polimerização mede quantas unidades entraram na cadeia.",
      passos: [
        "Identifique o monômero e a ligação que se abre.",
        "Veja se a rota libera subproduto a cada ligação.",
        "Calcule o grau de polimerização pela massa molar.",
      ],
      exemplo:
        "O polietileno vem do etileno, que abre a ligação dupla e encadeia sem perder nada. O náilon vem de dois monômeros e perde água a cada ligação formada. A mesma ideia de cadeia, rotas diferentes, e a água precisa sair para a reação continuar. Se a rota perde molécula pequena, o rendimento em massa já nasce menor, e a purificação precisa contar esse resíduo. No projeto de processo, a rota de condensação costuma pedir etapa de secagem que a de adição dispensa.",
      quebra:
        "Achar que todo plástico vem do mesmo monômero. Cada polímero tem sua matéria-prima e sua rota, e misturar resina na reciclagem produz material fraco.",
      limite:
        "A descrição por grau de polimerização supõe cadeia linear e distribuição estreita. Ramificação, copolímero e reticulação mudam a propriedade mesmo com a mesma massa média.",
      levar: "Polímero é cadeia: o monômero é o elo, a rota é a solda.",
      maos:
        "Compare a massa de dois polímeros e calcule o grau de polimerização de cada um.",
    },
    "Termoplásticos e Elastômeros": {
      contexto:
        "Onde isso aparece: na garrafa, no pneu e na resina da bancada. A reciclagem segue a estrutura: termoplástico volta ao forno, termofixo não. Separar os dois antes de triturar decide se o reciclado presta.",
      oQue:
        "Termoplástico amolece com calor e pode ser remoldado porque as cadeias deslizam. Termofixo endurece de vez porque forma rede reticulada permanente. Elastômero estica e volta porque tem ligações cruzadas espaçadas.",
      passos: [
        "Veja se as cadeias são lineares ou reticuladas.",
        "Aqueça e observe se o material amolece antes de queimar.",
        "Teste a recuperação elástica depois de esticar.",
      ],
      exemplo:
        "Uma garrafa de PET amolece e pode virar fibra; uma resina epóxi cura e não amolece mais, mesmo aquecida. O pneu é elastômero: estica bastante e volta ao tamanho, com poucas ligações cruzadas bem espaçadas. Um termofixo comum, como a baquelite, já foi termoplástico antes de curar: a cura fecha a rede e o caminho de volta deixa de existir.",
      quebra:
        "Tentar reciclar termofixo como termoplástico. A rede impede a remoldagem, e o material só quebra ou vira carga. Confundir os dois estraga o lote de reciclado.",
      limite:
        "A fronteira não é absoluta: existe termoplástico com reticulação leve e elastômero que envelhece e perde elasticidade. A classificação orienta, mas o ensaio de fusão decide na prática, e por isso a reciclagem de termofixo vai por moagem e uso como carga, não por remoldagem. Quem projeta peça que precisa voltar ao forno escolhe termoplástico desde o início, e a escolha é de projeto.",
      levar: "Termoplástico volta ao forno; termofixo só volta a ser pó.",
      maos:
        "Aqueça uma amostra de cada tipo e veja qual amolece antes de queimar.",
    },
    "Reciclagem Química": {
      contexto:
        "Onde isso aparece: no PET de garrafa, no poliuretano de colchão e no resíduo misto que a mecânica não aceita. Separar resinas melhora a qualidade do reciclado, e a mistura é o principal inimigo. O custo de energia decide se a rota fecha a conta.",
      oQue:
        "Reciclagem química quebra o polímero em monômero ou em produto útil, em vez de só triturar e reformar. Reciclagem mecânica tritura e remodela, e perde qualidade a cada ciclo. A química devolve a matéria-prima e permite fechar o ciclo.",
      passos: [
        "Identifique a resina e o grau de sujeira do resíduo.",
        "Escolha a rota e o catalisador adequados.",
        "Meça o rendimento em monômero e a pureza do produto.",
      ],
      exemplo:
        "O PET pode voltar a monômero por glicólise, com etileno glicol aquecido, e o produto serve para nova resina. A mecânica do mesmo PET perde viscosidade a cada ciclo e limita o uso. A rota química custa mais energia e devolve material de qualidade maior. Quanto mais seletiva a rota, menos resíduo sobra no fim, e o ganho aparece no balanço inteiro. A conta de energia por quilo de monômero recuperado é o número que decide se a planta sai do papel.",
      quebra:
        "Misturar resinas diferentes e esperar material reciclado forte. A mistura gera interface fraca, e o produto racha. A separação é a etapa que decide o resultado, e ela custa.",
      limite:
        "A reciclagem química consome energia e solvente, e nem toda resina tem rota economicamente viável. O balanço ambiental precisa contar essa energia, não só o resíduo evitado.",
      levar: "Reciclar quimicamente é desmontar o polímero para montar de novo.",
      maos:
        "Compare o rendimento de monômero em duas temperaturas de despolimerização.",
    },
  },
  "chem-materiais": {
    "Nanomateriais": {
      contexto:
        "Onde isso aparece: no reforço de compósito, no sensor e no catalisador. A mesma substância em nano pode ser reativa e tóxica de um jeito que o pó comum não é, e o cuidado de manuseio muda. A especificação precisa de tamanho e revestimento.",
      oQue:
        "Nanomaterial tem ao menos uma dimensão pequena, e a superfície passa a dominar a propriedade. A fração de átomos na superfície cresce muito, e efeito quântico aparece. Nanotubo de carbono é forte e condutor; nanopartícula pode ter cor diferente do material comum.",
      passos: [
        "Meça a dimensão e a distribuição de tamanho.",
        "Calcule a fração de átomos na superfície.",
        "Relacione essa fração com a propriedade de interesse.",
      ],
      exemplo:
        "Um cubo de 10 centímetros tem quase nenhum átomo na superfície; o mesmo volume em cubos de 10 nanômetros tem fração enorme. Por isso a nanopartícula de ouro pode ser vermelha e catalisar reação que o ouro maciço não catalisa. A medida de tamanho precisa vir com o método: microscopia, espalhamento e área superficial dão números diferentes. Por isso a ficha do material traz o método junto com o número.",
      quebra:
        "Tratar nanopartícula como poeira comum. A reatividade e a toxicidade podem mudar com o tamanho, e a poeira fina exige cuidado próprio. Comparar sem medir tamanho é comparar materiais diferentes.",
      limite:
        "O efeito depende de tamanho, forma e revestimento, e a partícula tende a aglomerar. A medida no pó seco não representa o que acontece em suspensão, e a aplicação exige ensaio no meio real.",
      levar: "No nano, a superfície é metade do material.",
      maos:
        "Calcule a fração de átomos na superfície para dois tamanhos de partícula.",
    },
    "Materiais Porosos": {
      contexto:
        "Onde isso aparece: no filtro de água, no craqueamento do petróleo e no secante da embalagem. A zeólita seleciona pela geometria do canal, e é isso que a torna seletiva. Material poroso não é frágil por definição: depende da parede.",
      oQue:
        "Material poroso tem cavidade que absorve, filtra e catalisa. Porosidade é a fração de volume vazio, e a área superficial alta melhora adsorção e catálise. Zeólita é peneira molecular porque o canal tem tamanho de molécula.",
      passos: [
        "Meça a porosidade e a distribuição de tamanho de poro.",
        "Calcule a área superficial disponível.",
        "Teste a seletividade com molécula de tamanho conhecido.",
      ],
      exemplo:
        "Uma zeólita com canal de 0,4 nanômetro deixa passar água e barra molécula maior. No craqueamento, o canal força a molécula a entrar numa posição específica e a reação acontece ali. A geometria faz a seleção que o catalisador sozinho não faria. A distribuição de tamanho de poro importa mais que a média, porque o canal estreito é o que decide quem entra. Medir só a média é como descrever uma peneira pelo diâmetro médio dos fios, e o resultado não prevê a passagem da molécula real.",
      quebra:
        "Achar que material poroso é sempre frágil. A parede pode ser cristalina e resistente, como na zeólita. Confundir porosidade com fraqueza leva a descartar material bom.",
      limite:
        "A seletividade vale enquanto o poro não entope. Depósito de coque, umidade e impureza bloqueiam o canal, e o material perde desempenho com o uso.",
      levar: "Poro é porta do tamanho da molécula que se quer deixar entrar.",
      maos:
        "Compare a adsorção de duas moléculas de tamanhos diferentes na mesma zeólita.",
    },
    "Superfícies Funcionais": {
      contexto:
        "Onde isso aparece: no vidro autolimpante, na panela antiaderente e na proteção contra corrosão. Revestimento fino pode falhar por trinca ou desgaste, e ele também envelhece. A rugosidade pode amplificar o efeito ou criar ponto de falha.",
      oQue:
        "A superfície pode ser tratada para repelir água, aderir tinta ou resistir à corrosão. Revestimento muda a energia superficial, e a gota se comporta de acordo. Superfície hidrofóbica repele água, e o efeito depende da química e da rugosidade.",
      passos: [
        "Meça o ângulo de contato da gota.",
        "Veja a composição e a espessura do revestimento.",
        "Teste a resistência ao desgaste e à corrosão.",
      ],
      exemplo:
        "Numa superfície hidrofóbica a gota fica quase esférica, com ângulo de contato acima de 90 graus; numa superfície que molha, a gota espalha. O ângulo é a medida objetiva do efeito, e ele muda com a limpeza e com o desgaste.",
      quebra:
        "Achar que revestimento dura para sempre. Ele também envelhece, trinca e desgasta, e a proteção cai antes de a falha aparecer a olho nu. Manutenção faz parte do projeto, e limpar a superfície pode restaurar o efeito por um tempo, com intervalo que também é parâmetro de projeto. Sem esse número, a promessa de durabilidade não se sustenta em campo, e o ensaio de exposição real é a última palavra.",
      limite:
        "O efeito é de superfície, e arranhão expõe o material de baixo. Em ambiente com abrasão, o revestimento fino não sustenta, e a solução pode ser outro material, não outra camada.",
      levar: "Revestimento é roupa: protege até gastar.",
      maos:
        "Meça o ângulo de contato de uma gota antes e depois de limpar a superfície.",
    },
  },
  "chem-industrial": {
    "Processos Industriais": {
      contexto:
        "Onde isso aparece: na planta de amônia, na refinaria e na fábrica de fertilizante. O reciclo interno aumenta o rendimento global sem mudar a conversão por passagem, e a purga evita acúmulo de inertes. Projetar só pelo equilíbrio ideal esquece cinética e segurança.",
      oQue:
        "Processo químico industrial soma reação, separação, energia e controle, e o objetivo é rendimento com segurança. Reação raramente converte tudo, por causa de equilíbrio e de perda, então o reciclo devolve o que não reagiu. Controle de temperatura existe para evitar reação descontrolada, não só para melhorar número.",
      passos: [
        "Monte o fluxograma com reação, separação e reciclo.",
        "Calcule a conversão por passagem e a conversão global.",
        "Verifique a purga e o acúmulo de inertes no loop.",
      ],
      exemplo:
        "Numa síntese com conversão de 20% por passagem, o reciclo devolve os 80% que não reagiram, e o rendimento global sobe bem acima de 20%. O limite aparece com os inertes, que se acumulam e pedem purga. Sem purga, o reciclo sufoca a planta e a pressão sobe sem controle.",
      quebra:
        "Projetar só pelo equilíbrio ideal e esquecer a cinética e a segurança. O equilíbrio diz onde a reação para; a cinética diz quanto tempo leva, e o reator tem volume e temperatura limitados.",
      limite:
        "O reciclo perfeito existe no papel; na prática, pressão, purga e custo de compressão limitam. A conta fecha na planta inteira, não na conversão da reação isolada.",
      levar: "Reciclo não cria reagente: devolve o que sobrou para tentar de novo.",
      maos:
        "Calcule a conversão global de um processo com reciclo e sem reciclo e compare.",
    },
    "Catálise Industrial": {
      contexto:
        "Onde isso aparece: no craqueamento, na hidrogenação e no conversor catalítico. Enxofre, chumbo e metais pesados envenenam de forma difícil de reverter; coque sai por queima controlada. Ignorar o desgaste no projeto é decidir por troca cara depois.",
      oQue:
        "Catalisador industrial precisa durar. A reação acontece na superfície ativa, e envenenamento bloqueia sítio com substância que se prende. Coque cobre a superfície com carbono e reduz a atividade, e regeneração devolve parte do desempenho.",
      passos: [
        "Meça a atividade ao longo do tempo de operação.",
        "Identifique o agente que está reduzindo a atividade.",
        "Escolha entre regenerar o leito e trocar a carga.",
      ],
      exemplo:
        "Um catalisador de hidrogenação perde atividade em semanas com enxofre na carga. O enxofre se liga ao sítio ativo e não sai com tratamento térmico. Já o coque no craqueamento queima em corrente de ar e devolve a maior parte da atividade, e por isso a unidade alterna reação e regeneração.",
      quebra:
        "Ignorar que catalisador se desgasta e pede troca. O projeto que não prevê regeneração nem estoque de reposição para na primeira queda de atividade, e o prejuízo é parada não planejada.",
      limite:
        "Regeneração devolve parte da atividade, nunca tudo: cada ciclo deixa perda. A vida útil total é a soma dos ciclos, e o metal também sinteriza com o calor, e a troca programada custa menos que a parada não planejada.",
      levar: "Catalisador bom é o que dura; o melhor é o que se regenera.",
      maos:
        "Compare a atividade nova e a usada e veja quanto de sítio se perdeu.",
    },
    "Combustíveis e Petróleo": {
      contexto:
        "Onde isso aparece: no posto, na petroquímica e no gás de cozinha. A mistura de hidrocarbonetos na gasolina tem faixa de ebulição e aditivos, e por isso a especificação é medida em laboratório. Combustão libera energia e produz gás carbônico e água, e a conta de emissão acompanha o carbono que entrou.",
      oQue:
        "Combustível fóssil vem do refino do petróleo. Destilação separa frações por ponto de ebulição, e conversões ajustam tamanho de cadeia. Craqueamento quebra cadeia longa em curta; reforma reorganiza para aumentar octanagem. A gasolina é mistura, não substância pura.",
      passos: [
        "Identifique a fração e a faixa de ebulição dela.",
        "Escolha a conversão que leva ao produto desejado.",
        "Verifique a especificação do combustível e a emissão associada.",
      ],
      exemplo:
        "O petróleo cru destila em faixas: gás no topo, gasolina, diesel, óleo e resíduo no fundo. Se a demanda por gasolina é maior que a fração natural, o craqueamento quebra molécula maior para produzir mais. A planta se ajusta à demanda, não à composição original.",
      quebra:
        "Achar que a gasolina é substância pura. É mistura de hidrocarbonetos com faixa de ebulição e aditivos, e o comportamento no motor depende da mistura. Tratar como pura erra a volatilidade e a octanagem.",
      limite:
        "O refino é otimização de mercado e de especificação, e a transição energética muda a demanda. A mesma planta pode precisar de outra mistura, e o ativo fica preso ao produto que ajudou a criar.",
      levar: "Refinar é separar e recompor: a molécula certa para o uso certo.",
      maos:
        "Compare a faixa de ebulição de três frações e veja o que cada uma vira.",
    },
  },
  "chem-computacional": {
    "Modelagem Molecular": {
      contexto:
        "Onde isso aparece: no desenho de fármaco, no estudo de proteína e na triagem de catalisador. A escolha do método é decisão de custo e de validade: campo de força não quebra ligação. Resultado de simulação precisa de validação experimental.",
      oQue:
        "Modelagem calcula estrutura e energia de molécula por mecânica molecular ou quântica, conforme o problema. Mecânica molecular usa campo de força, é rápida e serve para sistema grande. Química quântica resolve elétrons, custa mais e serve quando a ligação muda.",
      passos: [
        "Defina a pergunta e o tamanho do sistema.",
        "Escolha o método compatível com a pergunta.",
        "Valide o resultado contra dado experimental ou método mais caro.",
      ],
      exemplo:
        "Simular uma proteína inteira com química quântica é inviável hoje; o campo de força dá a conformação em tempo razoável. Já para saber se uma ligação se rompe, o campo de força não serve, e a conta quântica entra no sítio ativo. Muitas vezes o estudo combina os dois métodos.",
      quebra:
        "Tratar resultado de simulação como medida exata. O número tem erro de método e de parâmetro, e a barra de erro não aparece sozinha. Simulação guia o experimento, não substitui.",
      limite:
        "O campo de força é ajustado para uma classe de molécula; fora dela o erro cresce sem aviso. A quântica também depende de funcional e base, e o resultado herda essa escolha.",
      levar: "Simulação é lanterna: ilumina o caminho, não é o caminho.",
      maos:
        "Compare a mesma molécula por campo de força e por método quântico e veja a diferença de energia.",
    },
    "DFT e Estrutura Eletrônica": {
      contexto:
        "Onde isso aparece: no estudo de catalisador, de banda de semicondutor e de reação. Cada funcional tem erro típico: alguns erram gap, outros erram energia de ligação. Escolher o funcional é escolher o que a conta vai acertar.",
      oQue:
        "A teoria do funcional da densidade calcula a energia a partir da densidade eletrônica, com custo menor que métodos de onda. A densidade substitui a função de onda completa, e o funcional aproximado é a escolha que define o erro. É padrão em molécula e sólido.",
      passos: [
        "Monte a geometria e escolha a base de cálculo.",
        "Escolha o funcional pelo tipo de propriedade buscada.",
        "Compare com dado experimental ou com método mais caro.",
      ],
      exemplo:
        "Para gap de sólido, funcional simples subestima; para energia de formação, o erro muda de sinal. O mesmo sistema, funcionais diferentes, respostas diferentes. Por isso o artigo sério declara o funcional e mostra o teste com um caso conhecido.",
      quebra:
        "Achar que todo funcional dá o mesmo resultado. Cada um tem erro típico, e comparar números de funcionais diferentes sem declarar é comparar coisas distintas.",
      limite:
        "DFT é teoria de estado fundamental; estado excitado e dinâmica pedem extensão. Sistema fortemente correlacionado escapa da aproximação simples, e o erro não é pequeno.",
      levar: "O funcional escolhe o que a conta enxerga; o erro vem junto.",
      maos:
        "Rode o mesmo sistema com dois funcionais e compare com o valor experimental.",
    },
    "Quimioinformática": {
      contexto:
        "Onde isso aparece: no banco de compostos, na triagem virtual e no registro de patente. Estrutura parecida não garante efeito parecido: um detalhe pode mudar a atividade. O código é a chave que liga molécula a dado.",
      oQue:
        "Quimioinformática representa molécula em dado, busca padrão e prevê propriedade. A string de SMILES descreve a estrutura em texto, e similaridade estrutural agrupa compostos parecidos. Modelo de aprendizado precisa de dado representativo, senão prevê fora da faixa.",
      passos: [
        "Converta a estrutura em representação canônica.",
        "Calcule descritores ou similaridade com os compostos conhecidos.",
        "Verifique se o composto está na faixa coberta pelo treino.",
      ],
      exemplo:
        "Dois compostos com SMILES parecidos podem ter atividade oposta por causa de um grupo. A similaridade mede o quanto a estrutura se parece, não o quanto o efeito se parece. O filtro por similaridade reduz a lista, e o ensaio decide.",
      quebra:
        "Achar que estrutura parecida garante efeito parecido. Pode mudar no detalhe, e o modelo aprende o que os dados mostram. A conclusão vale para a faixa treinada, não para toda a química. Por isso a triagem termina em ensaio, e o modelo só ordena a fila de candidatos, com o critério declarado antes da conta.",
      limite:
        "SMILES não guarda conformação nem estereoquímica em todos os casos, e a representação canônica depende da ferramenta. Duas strings podem descrever a mesma molécula, e o banco precisa normalizar.",
      levar: "Estrutura em texto é o começo: o dado e o ensaio decidem.",
      maos:
        "Escreva o SMILES de duas moléculas parecidas e veja o que muda na similaridade.",
    },
  },
  "physics-outras": {
    "Biofísica": {
      contexto:
        "Onde isso aparece: na respiração, no impulso nervoso e no remédio que atravessa a membrana. Difusão não precisa de bomba: ela acontece por agitação, e a célula gasta energia para ir contra o gradiente. O transporte ativo existe justamente porque a difusão sozinha não basta.",
      oQue:
        "Biofísica aplica física a sistema vivo: membrana, proteína, força molecular e transporte. Difusão move partícula do mais concentrado ao menos concentrado por movimento térmico, sem bomba. Membrana mantém potencial elétrico dos dois lados, e proteína muda de forma ao receber energia ou ligante.",
      passos: [
        "Meça o gradiente de concentração.",
        "Veja se a membrana permite a passagem da molécula.",
        "Compare o tempo de difusão com o tamanho do sistema.",
      ],
      exemplo:
        "Uma molécula pequena atravessa a membrana em milissegundos por difusão; uma proteína não atravessa sem canal. O tempo de difusão cresce com o quadrado da distância, e é por isso que célula grande precisa de transporte ativo e de fluxo interno.",
      quebra:
        "Achar que difusão precisa de bomba. Ela acontece por movimento térmico e dissipa gradiente. A bomba existe para criar gradiente, não para difundir.",
      limite:
        "A difusão simples descreve meio homogêneo e partícula sem interação. Em citoplasma cheio de obstáculo, o movimento é mais lento que a conta ideal, e a célula compensa com fluxo.",
      levar: "Difusão é o mundo se misturando sozinho.",
      maos:
        "Compare o tempo de difusão para duas distâncias e veja o crescimento ao quadrado.",
    },
    "Física Médica": {
      contexto:
        "Onde isso aparece: na radiografia, na tomografia e na radioterapia. Radioterapia concentra dose no volume do tumor e poupa o entorno, com direções combinadas. Exame de imagem não é inofensivo e não se repete sem critério.",
      oQue:
        "Física médica usa radiação e imagem para diagnosticar e tratar. A dose é energia depositada por massa de tecido, e o objetivo é suficiente sem ferir. Raios X atravessam tecido mole e são barrados por osso, e é da diferença que nasce o contraste.",
      passos: [
        "Identifique o tipo de radiação e a energia dela.",
        "Calcule a dose depositada no tecido.",
        "Compare com o limite e justifique o exame ou o tratamento.",
      ],
      exemplo:
        "Uma tomografia de tórax deposita dose equivalente a dezenas de radiografias. O benefício aparece quando o exame muda a conduta, e é essa a justificativa. Acumular exame sem pergunta clínica só soma risco.",
      quebra:
        "Achar que exame de imagem é sempre inofensivo e pode repetir sem critério. Dose se acumula, e o risco é probabilístico. O princípio é justificar cada exame, não fazer por hábito.",
      limite:
        "A dose medida no aparelho não é a dose no órgão, e o cálculo depende de modelo. Em criança e gestante, a sensibilidade muda, e a conta precisa de coeficiente próprio. O histórico de exames do paciente entra no cálculo, e não só o exame de agora.",
      levar: "Dose é energia por massa: o número tem que ser justificado.",
      maos:
        "Compare a dose de dois exames e discuta o que cada um acrescenta ao diagnóstico.",
    },
    "Física Ambiental": {
      contexto:
        "Onde isso aparece: no gelo que derrete, na cidade que aquece e no painel solar. Neve tem albedo alto e devolve luz; asfalto tem albedo baixo e esquenta. Difusão atmosférica espalha poluente conforme vento e estabilidade, e a previsão depende dos dois. O albedo da nuvem também entra no balanço, e é por isso que tempo e clima são contas com escalas diferentes.",
      oQue:
        "Física ambiental modela clima, dispersão de poluente, radiação solar e balanço de energia da Terra. Albedo é a fração da radiação que a superfície reflete, e ele muda com o material e com a cobertura. Efeito estufa retém radiação infravermelha emitida pela superfície.",
      passos: [
        "Meça a radiação incidente e a refletida.",
        "Calcule o albedo pela razão entre as duas.",
        "Relacione com o balanço de energia e com a temperatura.",
      ],
      exemplo:
        "Neve fresca reflete até 90% da luz solar; oceano reflete menos de 10%. Trocar gelo por água escura aumenta a energia absorvida e aquece mais, num ciclo que se reforça. O albedo não é detalhe: é termo do balanço.",
      quebra:
        "Confundir efeito estufa, que existe naturalmente, com camada de ozônio. São fenômenos diferentes, com gases e altitudes diferentes. Misturar os dois leva a política ambiental errada.",
      limite:
        "Albedo de superfície é medido por satélite e depende do ângulo e da nuvem. O valor local não representa o planeta, e a conta climática usa média com peso.",
      levar: "Superfície clara devolve luz; escura guarda calor.",
      maos:
        "Compare a temperatura de duas superfícies com albedo diferente sob a mesma lâmpada.",
    },
  },
  "math-fundamentos": {
    "Lógica Matemática": {
      contexto:
        "Onde isso aparece: na prova, no circuito digital e na consulta de banco com condições. A negação inverte o valor de verdade; a conjunção só é verdadeira com as duas partes verdadeiras. A condicional é a que mais engana, e confundi-la com a recíproca é o erro clássico.",
      oQue:
        "Lógica é o estudo das formas válidas de tirar conclusão. Os conectivos montam frases compostas: negação, conjunção, disjunção, condicional e bicondicional, e cada um tem tabela de verdade. A validade depende da forma, não do conteúdo da frase.",
      passos: [
        "Isole as proposições simples e dê nome a cada uma.",
        "Monte a tabela de verdade dos conectivos envolvidos.",
        "Veja em que linha a fórmula falha e o que isso significa.",
      ],
      exemplo:
        "A condicional P→Q é falsa só na linha em que P é verdadeira e Q é falsa. Se chove e não molho, a promessa 'se chover, eu molho' falhou. Nas outras três linhas a condicional se sustenta, inclusive quando P é falsa: a promessa não é quebrada por não chover.",
      quebra:
        "Confundir a condicional com a recíproca. P→Q não é Q→P: 'se chove, molho' não autoriza 'se molho, chove'. A recíproca tem outra tabela, e trocar uma pela outra invalida a prova.",
      limite:
        "A tabela cobre lógica clássica bivalente. Em lógica intuicionista, a negação dupla não se cancela sempre, e o terceiro excluído não vale por padrão.",
      levar: "A condicional só falha quando a promessa é quebrada: antecedente verdadeiro, consequente falso.",
      maos:
        "Monte a tabela de P→Q e marque a única linha em que ela dá falso.",
    },
    "Teoria dos Conjuntos": {
      contexto:
        "Onde isso aparece: na consulta de banco, na classificação de planta e na definição de função. União junta, interseção mantém o comum, e a cardinalidade distingue finito de infinito. Os reais não são enumeráveis, e essa diferença separa dois infinitos.",
      oQue:
        "Conjunto é coleção de elementos. Relações ligam elementos de dois conjuntos por pares ordenados; funções são relações em que cada entrada tem uma única saída. A relação de equivalência organiza o conjunto em classes que não se misturam.",
      passos: [
        "Descreva o conjunto e a relação que se quer testar.",
        "Teste reflexiva, simétrica e transitiva, uma de cada vez.",
        "Veja as classes de equivalência que a relação produz.",
      ],
      exemplo:
        "A relação 'tem o mesmo resto na divisão por três' no conjunto dos inteiros é reflexiva, simétrica e transitiva, e parte o conjunto em três classes. Já 'menor que' não é reflexiva nem simétrica, então não é equivalência. O teste é direto e decide.",
      quebra:
        "Achar que todo conjunto infinito tem a mesma cardinalidade. Os naturais são enumeráveis; os reais não são, e há mais reais que naturais. Tratar todo infinito como igual apaga o resultado de Cantor.",
      limite:
        "Axiomas de conjunto têm variação: o axioma da escolha pode ser aceito ou negado sem contradizer a base. O que se prova depende do sistema escolhido, e a escolha precisa ser declarada.",
      levar: "Conjunto é coleção; relação é par; função é relação com uma saída por entrada.",
      maos:
        "Teste três relações do dia a dia nos três critérios e veja quais são equivalência.",
    },
    "Métodos de Demonstração": {
      contexto:
        "Onde isso aparece: no teorema, no algoritmo e no laudo que precisa de garantia. Prova direta encadeia implicação; contraposição troca a direção; indução cobre o infinito com caso base e passo. Cada método serve a um tipo de afirmação.",
      oQue:
        "Demonstrar é justificar uma afirmação a partir de axiomas e resultados já provados. A prova não é retórica: cada passo precisa seguir de definição, axioma ou resultado anterior. O método é escolhido pela forma da afirmação, não pelo gosto de quem escreve.",
      passos: [
        "Escreva a afirmação e o que se assume no início.",
        "Escolha o método pela forma da afirmação.",
        "Feche cada passo com a justificativa que o autoriza.",
      ],
      exemplo:
        "Para provar que a soma dos n primeiros ímpares é n ao quadrado, a indução faz o caso base n igual a um e o passo de n para n mais um. O passo soma o próximo ímpar, que é 2n mais um, e chega ao quadrado seguinte. Sem o caso base, a corrente não tem começo e nada está provado.",
      quebra:
        "Usar indução sem o caso base. O passo pode valer para todo n e a afirmação ainda ser falsa, porque falta o ponto de partida. A base não é formalidade: é o primeiro elo.",
      limite:
        "Indução prova para todo natural, não para real nem para conjunto sem ordem. Afirmação sobre contínuo pede outro método, e a prova por exaustão só vale quando o conjunto é finito e pequeno.",
      levar: "Prova é corrente: cada elo preso ao anterior, e a base presa no chão.",
      maos:
        "Prove por indução a soma dos n primeiros ímpares e escreva o caso base e o passo separados.",
    },
    "Linguagem e Representação": {
      contexto:
        "Onde isso aparece: na notação de somatório, no símbolo de derivada e na definição de limite. Notação boa encurta a prova e reduz ambiguidade; notação ruim esconde hipótese. A convenção é parte da matemática, não enfeite.",
      oQue:
        "A linguagem matemática é ferramenta de precisão: símbolo, definição, lema e teorema formam camadas. Definição fixa o sentido, lema é resultado auxiliar, teorema é resultado principal, e corolário sai de graça do teorema. Abstração e generalização permitem aplicar a mesma estrutura a problemas diferentes.",
      passos: [
        "Declare as definições antes de usar qualquer símbolo.",
        "Separe hipótese de tese na frase do resultado.",
        "Escolha a notação que deixa a estrutura visível para quem lê.",
      ],
      exemplo:
        "O mesmo teorema escrito com somatório e escrito por extenso tem o mesmo conteúdo, mas a versão simbólica deixa a estrutura visível e a prova curta. Já a notação inventada no meio do texto quebra a leitura, porque ninguém combinou o símbolo. Clareza é acordo, e o acordo precisa estar escrito no começo do texto, antes do primeiro símbolo que ninguém definiu.",
      quebra:
        "Usar símbolo sem definir. O leitor interpreta diferente, e a prova deixa de ser conferível. A definição é o contrato da leitura, e sem ela o texto vira adivinhação.",
      limite:
        "Notação muito compacta esconde hipótese e prejudica a revisão. Em ensino e em prova, o excesso de símbolo custa mais do que economiza, e a escolha depende de quem lê, do espaço da página e do que o texto quer destacar.",
      levar: "Notação é contrato: sem definição, cada leitor assina um.",
      maos:
        "Reescreva uma definição com símbolo e por extenso e compare o que ficou mais claro.",
      pergunta: {
        q: "Por que a mesma ideia matemática precisa de notação estável?",
        a: "Porque a notação fixa o significado e evita leitura ambígua",
        why: "Sem símbolo combinado, cada leitor interpreta a expressão de um jeito, e a prova deixa de ser conferível.",
      },
    },
    "História, Filosofia e Fundamentos da Matemática": {
      contexto:
        "Onde isso aparece: no debate sobre axioma, no paradoxo e no currículo escolar. Platonismo, formalismo e construtivismo respondem de formas diferentes à pergunta sobre o que é um número. A definição que usamos hoje é o ponto de chegada de uma discussão longa.",
      oQue:
        "A história da matemática mostra resultado construído, contestado e corrigido. Os sistemas numéricos ganharam forma com a necessidade de contar, medir e resolver equação; a crise dos fundamentos no começo do século vinte mostrou limite do formalismo. Conhecer o caminho evita tratar convenção como verdade eterna.",
      passos: [
        "Identifique o problema histórico que gerou a ideia.",
        "Veja a definição atual e a que pergunta ela responde.",
        "Compare com a crítica que contestou essa definição.",
      ],
      exemplo:
        "O zero demorou a ser aceito como número porque a ideia de nada com regra própria incomodava; hoje ele é a peça que faz a aritmética fechar. Da mesma forma, o infinito passou de paradoxo a objeto com cardinalidade, depois de Cantor. O conceito muda quando a ferramenta muda.",
      quebra:
        "Tratar a definição atual como a única possível. Cada definição resolveu um problema de seu tempo, e outra convenção pode servir a outro propósito. A história mostra que a matemática também tem escolha.",
      limite:
        "A leitura histórica não substitui a prova. Saber por que o conceito surgiu ajuda a entender, mas a validade do teorema se decide pela demonstração, não pela cronologia.",
      levar: "A matemática tem história: o que hoje é definição já foi discussão.",
      maos:
        "Escolha um conceito e conte o problema que ele veio resolver e o que ele deixou de fora.",
      pergunta: {
        q: "O que a história da matemática mostra sobre os resultados que usamos?",
        a: "Que eles foram construídos, contestados e corrigidos ao longo do tempo",
        why: "A definição atual é o ponto de chegada de um debate, e conhecer o caminho evita tratar convenção como verdade eterna.",
      },
    },
  },
  "math-edo": {
    "Equações Diferenciais Ordinárias (EDO)": {
      contexto:
        "Onde isso aparece: no decaimento de fármaco, no resfriamento do café e no circuito com capacitor. A equação relaciona a função e a derivada, e a solução é uma família. A condição inicial escolhe qual membro da família responde ao problema real.",
      oQue:
        "Equação diferencial relaciona uma função e suas derivadas. Descreve crescimento, decaimento, oscilação e difusão, e a ordem é a maior derivada presente. Equação linear tem solução geral como soma da particular com a homogênea, e a condição inicial fixa a constante.",
      passos: [
        "Classifique a equação por ordem e por linearidade.",
        "Resolva a homogênea e ache uma solução particular.",
        "Aplique a condição inicial para escolher a solução do problema.",
      ],
      exemplo:
        "O decaimento radioativo segue a derivada proporcional à quantidade presente, e a solução é exponencial com meia-vida constante. A família de soluções tem infinitas exponenciais; saber que havia 100 gramas no início escolhe uma. Sem a condição inicial, a resposta é família, não resposta.",
      quebra:
        "Esquecer as condições iniciais e achar que a solução geral é a resposta do problema. A geral descreve todas as histórias possíveis; a inicial diz qual delas aconteceu.",
      limite:
        "Solução analítica existe para classe estreita de equações. Fora dela, a resposta vem por método numérico, com erro e estabilidade na conta, e o comportamento pode mudar de forma perto de singularidade.",
      levar: "A equação desenha a família; a condição inicial aponta o membro.",
      maos:
        "Resolva a equação de decaimento e mostre duas soluções diferentes mudando só a condição inicial.",
    },
    "Equações Diferenciais Parciais (EDP)": {
      contexto:
        "Onde isso aparece: no calor que se espalha na barra, na onda na corda e na difusão de poluente. A incógnita depende de mais de uma variável, e a condição de contorno entra junto com a inicial. Sem contorno, a conta não descreve o domínio real.",
      oQue:
        "EDP relaciona derivadas parciais de uma função de várias variáveis. Ela descreve campo e meio contínuo, onde o valor em cada ponto evolui junto com os vizinhos. A solução depende da equação, da condição inicial e da condição de contorno, e as três formam o problema.",
      passos: [
        "Classifique a equação: elíptica, parabólica ou hiperbólica.",
        "Escreva as condições inicial e de contorno do domínio real.",
        "Resolva por separação de variáveis ou por método numérico.",
      ],
      exemplo:
        "A equação do calor numa barra com pontas em temperatura fixa tem solução que decai para o perfil estacionário. A forma da solução vem da série de Fourier, e o coeficiente de cada termo vem da condição inicial. Trocar a condição de contorno muda o destino, não só a velocidade.",
      quebra:
        "Resolver a equação sem olhar o contorno. A mesma EDP em domínio diferente tem solução diferente, e ignorar a borda produz resposta que não vale no problema. O contorno não é detalhe: é parte da definição.",
      limite:
        "Solução fechada existe para geometria simples e equação linear. Domínio irregular, coeficiente variável e não linearidade pedem discretização, e aí entram malha, estabilidade e custo.",
      levar: "EDP é o meio contínuo: equação, início e borda andam juntos.",
      maos:
        "Resolva a equação do calor numa barra e mude a temperatura das pontas para ver o novo destino.",
      pergunta: {
        q: "O que a condição de contorno faz numa EDP?",
        a: "Define o que acontece na borda do domínio e escolhe a solução",
        why: "Sem ela o problema fica subdeterminado, e a mesma equação admite soluções incompatíveis com o domínio real.",
      },
    },
    "Equações de Diferenças e Recorrências": {
      contexto:
        "Onde isso aparece: no juro composto, no algoritmo recursivo e na população que se conta por geração. O tempo é discreto, e o estado de hoje define o de amanhã. Iterar é rodar a regra, e o destino aparece depois de muitos passos.",
      oQue:
        "Equação de diferenças relaciona termos consecutivos de uma sequência, e recorrência é a regra que gera cada termo a partir dos anteriores. O sistema é dinâmico em tempo discreto: ponto fixo é valor que não muda, e estabilidade diz se a iteração volta para ele depois de uma perturbação.",
      passos: [
        "Escreva a recorrência e o valor inicial.",
        "Ache o ponto fixo igualando o termo ao anterior.",
        "Teste a estabilidade iterando a partir de valor próximo.",
      ],
      exemplo:
        "A recorrência que multiplica por 1,1 a cada passo cresce sem parar, e o ponto fixo é zero, instável. Já a que faz média com o valor anterior converge para a média, e o ponto fixo é estável. A regra é parecida; a taxa decide o destino.",
      quebra:
        "Confundir recorrência com fórmula fechada. A recorrência descreve o passo, não o valor em n; para prever longe é preciso iterar ou resolver a forma fechada, e nem toda recorrência tem forma simples.",
      limite:
        "A análise de ponto fixo descreve comportamento local. Longe dele, ciclo e caos podem aparecer, e a linearização não decide. A simulação entra para ver o regime global, e o mapa da recorrência desenhado à mão ajuda a enxergar o destino antes de rodar conta longa.",
      levar: "Recorrência é o futuro escrito em função do presente.",
      maos:
        "Itere a mesma recorrência com dois valores iniciais próximos e veja se as trajetórias se juntam ou se separam.",
      pergunta: {
        q: "Quando a iteração de uma recorrência linear converge para o ponto fixo?",
        a: "Quando o fator de amplificação tem módulo menor que um",
        why: "A cada passo o erro é multiplicado pelo fator; com módulo abaixo de um o erro encolhe e a trajetória se aproxima do ponto fixo.",
      },
    },
    "Sistemas Dinâmicos": {
      contexto:
        "Onde isso aparece: no pêndulo, no clima e na população de predador e presa. O estado evolui no tempo, e o retrato de fase mostra para onde as trajetórias vão. Ponto fixo, ciclo e atrator organizam a leitura.",
      oQue:
        "Sistema dinâmico descreve a evolução de um estado no tempo. Ponto fixo é estado que não muda; estabilidade indica se perturbação pequena desaparece; bifurcação é mudança qualitativa quando um parâmetro varia. O atrator é o conjunto para onde as trajetórias tendem.",
      passos: [
        "Escreva o estado e a regra de evolução.",
        "Ache os pontos fixos e linearize em volta deles.",
        "Varra o parâmetro para localizar bifurcação e mudança de regime.",
      ],
      exemplo:
        "No pêndulo com atrito, o repouso é ponto fixo estável: empurrão pequeno volta. Sem atrito, o mesmo ponto deixa de ser atrator e a trajetória vira ciclo. A equação não mudou de forma; o parâmetro mudou o regime.",
      quebra:
        "Concluir estabilidade pelo gráfico de uma única simulação. Uma trajetória bonita não prova nada sobre as outras; a conclusão exige análise dos pontos fixos e do espaço de estados.",
      limite:
        "A linearização vale perto do ponto fixo. Em sistema não linear forte, o comportamento global pode ser caótico mesmo com todos os pontos fixos estáveis, e a conta local não vê.",
      levar: "Dinâmica é mapa de destinos: para onde o estado vai quando o tempo passa.",
      maos:
        "Desenhe o retrato de fase de um pêndulo com e sem atrito e compare os destinos.",
    },
    "Equações Funcionais": {
      contexto:
        "Onde isso aparece: na média que precisa ser consistente, na função exponencial definida pela propriedade e no algoritmo que exige invariante. A incógnita é a função inteira, e a equação diz como ela se comporta ao combinar entradas.",
      oQue:
        "Equação funcional determina uma função por propriedade, sem derivada explícita. A equação de Cauchy é o exemplo clássico: a soma das entradas vira soma das saídas, e as soluções dependem das hipóteses. Estabilidade funcional pergunta se a propriedade aproximada ainda garante função próxima.",
      passos: [
        "Teste valores simples para descobrir candidatos.",
        "Use as hipóteses de regularidade: continuidade, monotonicidade, mensurabilidade.",
        "Verifique se a candidata satisfaz a equação em todo o domínio.",
      ],
      exemplo:
        "A equação que pede soma virando soma tem a reta como solução quando se assume continuidade; sem essa hipótese, existem soluções patológicas construídas com base de Hamel. A hipótese não é enfeite: ela separa as soluções que a intuição aceita das que a definição permite. Em aplicação, a hipótese costuma vir da própria situação: a função é contínua porque descreve grandeza física que não salta.",
      quebra:
        "Achar que a propriedade sozinha determina a função. Sem hipótese de regularidade, a equação admite solução que ninguém espera. A hipótese precisa entrar antes da conclusão.",
      limite:
        "A estabilidade funcional garante proximidade, não igualdade, e a constante pode ser grande. Em aplicação, o erro tolerado decide se a garantia serve, e a constante da estabilidade pode ser grande o bastante para tornar a garantia inútil na prática, mesmo com o teorema verdadeiro.",
      levar: "Equação funcional descreve o comportamento, não o desenho do gráfico.",
      maos:
        "Teste três funções na equação de Cauchy e veja quais cumprem a propriedade para todo par.",
      pergunta: {
        q: "Por que a equação funcional precisa de hipótese de regularidade?",
        a: "Porque sem ela a equação admite soluções patológicas",
        why: "A propriedade sozinha não impede função construída de forma arbitrária; continuidade ou monotonicidade restringe o conjunto de soluções.",
      },
    },
  },
  "math-otimizacao": {
    "Otimização Matemática": {
      contexto:
        "Onde isso aparece: no custo de produção, no trajeto mais curto e no ajuste de modelo. A função objetivo diz o que se quer, e as restrições dizem o que é permitido. Em problema convexo, a busca local não engana.",
      oQue:
        "Otimização busca o melhor valor de uma função sujeita a restrições. Em problema convexo, todo mínimo local é global, e a garantia vem da forma da função e da região viável. Multiplicadores de Lagrange tratam restrição de igualdade, e a solução fica onde o gradiente da função é paralelo ao da restrição.",
      passos: [
        "Escreva a função objetivo e as restrições com unidade.",
        "Verifique se o problema é convexo e se a região viável é fechada.",
        "Resolva e confira se a solução está na fronteira ou no interior.",
      ],
      exemplo:
        "Minimizar custo sujeito a produção mínima é problema linear, e o ótimo cai num vértice da região viável. Já a função com dois vales tem mínimo local falso, e a busca de gradiente para no primeiro que encontra. A convexidade é o que separa os dois casos.",
      quebra:
        "Tratar problema não convexo como se o mínimo local fosse o global. O algoritmo para no primeiro vale e devolve resposta que parece certa. Sem garantia de convexidade, a busca precisa de reinício ou de método global.",
      limite:
        "Convexidade garante o ótimo, mas não garante que ele seja único nem que o método convirja rápido. Condicionamento ruim faz a descida demorar, e a solução numérica tem erro.",
      levar: "O ótimo é o melhor valor que respeita as restrições, não o melhor valor imaginável.",
      maos:
        "Desenhe duas funções, uma convexa e outra com dois vales, e veja onde a busca de gradiente para.",
    },
    "Pesquisa Operacional": {
      contexto:
        "Onde isso aparece: na rota de entrega, na fila do caixa e na escala de plantão. Modelo matemático entra na decisão, e a solução precisa caber no tempo de quem decide. A conta não escolhe por você; ela mostra o custo de cada escolha.",
      oQue:
        "Pesquisa operacional aplica modelo matemático à decisão: fila, transporte, alocação e escalonamento. Programação linear otimiza função linear com restrição linear, e a teoria das filas estuda espera e atendimento. O problema de transporte minimiza custo entre origem e destino.",
      passos: [
        "Formule o problema com variáveis, objetivo e restrições.",
        "Escolha o modelo: linear, fila, transporte, escala.",
        "Resolva e teste a sensibilidade do resultado ao dado de entrada.",
      ],
      exemplo:
        "Distribuir estoque entre dois depósitos e três lojas é problema de transporte: o custo por rota entra na matriz, e a oferta e a demanda entram como restrição. A solução ótima deixa de usar a rota mais barata quando ela esgota a oferta. O modelo mostra a troca, não só o número.",
      quebra:
        "Arredondar a solução linear sem verificar se continua viável no problema inteiro. Meia entrega não existe, e o arredondamento pode violar restrição. A solução contínua é limite, não resposta final.",
      limite:
        "O modelo é tão bom quanto o dado: demanda errada produz plano errado com cara de ótimo. A realidade também muda enquanto o plano roda, e a decisão precisa de revisão.",
      levar: "Pesquisa operacional transforma decisão em troca explícita.",
      maos:
        "Monte uma matriz de custo pequena e resolva a alocação ótima, depois mude um custo e veja a solução mudar.",
    },
    "Análise Numérica": {
      contexto:
        "Onde isso aparece: na raiz de equação sem fórmula, na integral sem primitiva e na simulação de engenharia. O resultado é aproximação com erro declarado, e a escolha do método importa. Velocidade sem estabilidade produz número errado rápido.",
      oQue:
        "Análise numérica resolve problema por aproximação controlada, com atenção a erro, estabilidade e custo. Erro de arredondamento cresce com o número de operações, e condicionamento mede a sensibilidade do problema à entrada. Método estável não amplifica perturbação pequena.",
      passos: [
        "Meça o condicionamento do problema antes de escolher o método.",
        "Escolha o método pela estabilidade e pela ordem do erro.",
        "Estime o erro e compare com a tolerância pedida.",
      ],
      exemplo:
        "Somar um milhão de números muito pequenos em ponto flutuante acumula erro; somar em ordem crescente de magnitude reduz a perda. O problema é o mesmo, o algoritmo muda o resultado. Estabilidade é escolha, não sorte.",
      quebra:
        "Escolher algoritmo pela velocidade sem olhar estabilidade numérica. O método rápido que amplifica erro entrega resposta confiante e errada, e a diferença só aparece quando alguém confere com precisão maior.",
      limite:
        "O erro estimado depende do modelo de arredondamento e do dado. Em problema mal condicionado, nenhum algoritmo salva: a entrada já não determina a saída com precisão.",
      levar: "Número calculado vem com erro; quem não declara o erro não sabe o que entregou.",
      maos:
        "Some a mesma lista em duas ordens e compare o resultado com a soma de precisão alta.",
    },
    "Computação Científica": {
      contexto:
        "Onde isso aparece: na previsão de tempo, no projeto de ponte e no ensaio virtual de motor. Simulação numérica ocupa supercomputador e transforma equação em conta. O resultado precisa de validação contra experimento, senão é desenho bonito.",
      oQue:
        "Computação científica resolve equação por simulação numérica, com modelagem, discretização e alto desempenho. A modelagem escolhe o que entra na equação, e a discretização escolhe como o contínuo vira malha. Matemática assistida por computador inclui prova verificada e cálculo simbólico.",
      passos: [
        "Escolha o modelo e a escala do fenômeno.",
        "Discretize com malha adequada ao gradiente do campo.",
        "Valide o resultado contra experimento ou solução conhecida.",
      ],
      exemplo:
        "Simular o escoamento em volta de uma asa com malha grossa perde a camada-limite e prevê sustentação errada. Refinar a malha perto da parede melhora o resultado e multiplica o custo. O equilíbrio entre malha e tempo de máquina é decisão de engenharia, não de gosto. Em muitos casos, o modelo físico erra mais que a malha, e refinar a conta não resolve o erro de hipótese.",
      quebra:
        "Confiar no resultado da simulação sem validação. Malha, modelo de turbulência e condição de contorno podem errar juntos, e a imagem colorida não mostra o erro. Sem experimento ou caso conhecido, não há prova.",
      limite:
        "Refinar a malha tem custo que cresce rápido, e o modelo físico pode ser o limitante antes da malha. Em fenômeno multiescala, nenhuma malha única cobre tudo, e o acoplamento entre escalas vira o problema principal. Por isso a validação é feita em casos de referência antes do caso novo.",
      levar: "Simulação é experimento de conta: precisa de modelo, malha e conferência.",
      maos:
        "Rode a mesma simulação com duas malhas e compare a diferença no ponto de interesse.",
      pergunta: {
        q: "Por que a simulação numérica precisa de validação experimental?",
        a: "Porque modelo, malha e contorno podem errar juntos sem aviso",
        why: "O resultado numérico herda as escolhas do modelador; só a comparação com dado real ou caso conhecido mostra se a conta representa o fenômeno.",
      },
    },
  },
  "math-aritmetica": {
    "Aritmética": {
      contexto:
        "Onde isso aparece: na compra, na receita e na conta de luz. Fração, porcentagem e potência são a mesma ideia escrita de jeitos diferentes, e a ordem das operações muda o resultado. Estimativa antes da conta pega erro grosseiro.",
      oQue:
        "Aritmética é a gramática do número: operação, fração, razão, porcentagem, potência e raiz. Cada operação tem prioridade e cada representação tem uso. Notação científica encurta número grande, e arredondamento declara a precisão que se tem.",
      passos: [
        "Escreva a expressão com parênteses explícitos.",
        "Transforme fração e porcentagem numa mesma forma antes de comparar.",
        "Estime antes de calcular e confira a ordem de grandeza do resultado.",
      ],
      exemplo:
        "20% de 250 é 50: um quinto de 250. A conta de cabeça pega o erro antes da calculadora. Já 2 mais 3 vezes 4 é 14, não 20, porque a multiplicação vem antes. A regra de prioridade não é capricho: ela mantém a fatoração legível e evita ambiguidade na escrita.",
      quebra:
        "Confundir porcentagem com proporção direta em aumento e desconto encadeados. Aumentar 10% e depois descontar 10% não volta ao valor original: 100 vira 110 e depois 99. A base muda a cada passo.",
      limite:
        "A aritmética exata cobre inteiro e racional; irracional entra por aproximação, e aí o erro precisa ser declarado. Em conta financeira longa, o arredondamento por passo muda o total.",
      levar: "A ordem da operação e a base da porcentagem decidem o resultado.",
      maos:
        "Calcule um aumento e um desconto de 10% em sequência e veja o valor final.",
      pergunta: {
        q: "Por que 1/3 tem dízima infinita e ainda assim é racional?",
        a: "Porque é fração de inteiros e a dízima se repete em ciclo",
        why: "Racional é todo número que se escreve como fração de inteiros; a repetição periódica é consequência da divisão, não sinal de irracionalidade.",
      },
    },
    "Sistemas Numéricos": {
      contexto:
        "Onde isso aparece: na reta real, na representação binária e no computador que só guarda fração. Cada conjunto amplia o anterior para fechar uma operação: inteiro fecha subtração, racional fecha divisão. Irracional não é dízima infinita; é o que não se escreve como fração.",
      oQue:
        "Os números se organizam em naturais, inteiros, racionais, irracionais, reais e complexos. Cada conjunto amplia o anterior para resolver operações que antes não fechavam, e a reta real junta racionais e irracionais sem buraco. Bases posicionais mudam a escrita, não o número.",
      passos: [
        "Identifique a operação que precisa fechar.",
        "Escolha o menor conjunto que a contém.",
        "Escreva o número na forma que prova a que conjunto ele pertence.",
      ],
      exemplo:
        "A raiz de dois é irracional: não existe fração de inteiros que a represente, e a prova por contradição mostra que a suposição de fração leva a par e ímpar ao mesmo tempo. Já um terço tem dízima infinita e é racional, porque é fração. Dízima infinita não é critério.",
      quebra:
        "Chamar de irracional todo número com infinitas casas decimais. Um terço tem infinitas e é racional. O critério é a representação em fração, não o tamanho da escrita.",
      limite:
        "A construção dos reais depende de completude, e a definição rigorosa usa corte ou sequência de Cauchy. Sem isso, a reta é intuição, não objeto definido.",
      levar: "O conjunto cresce para fechar a operação que faltava.",
      maos:
        "Classifique dez números nos conjuntos e justifique cada um pela representação.",
    },
    "Teoria Elementar dos Números": {
      contexto:
        "Onde isso aparece: na criptografia, no código de barras e na prova de divisibilidade. Primo é tijolo da fatoração, e congruência é relógio. Trabalhar módulo n simplifica conta gigante.",
      oQue:
        "Teoria elementar dos números estuda divisibilidade, primo, fatoração e congruência. Todo inteiro maior que um se decompõe em primos de forma única, e trabalhar módulo n é olhar só o resto. Somar, subtrair e multiplicar funcionam normalmente; dividir exige inverso.",
      passos: [
        "Fatore o número ou reduza a conta módulo n.",
        "Verifique se o divisor é coprimo antes de dividir numa congruência.",
        "Confira o resultado com uma conta pequena do mesmo resto.",
      ],
      exemplo:
        "17 módulo 5 é 2, porque 17 é três vezes 5 mais 2. Para saber em que algarismo termina 2 elevado a 100, reduza o expoente módulo 4: o ciclo do 2 tem quatro posições, e 100 deixa resto zero, então o algarismo é 6. A conta gigante vira conta pequena.",
      quebra:
        "Dividir os dois lados de uma congruência sem verificar se o divisor é invertível. Módulo 6, dividir por 2 não é permitido porque 2 não tem inverso, e a conclusão sai errada.",
      limite:
        "A aritmética modular funciona bem no anel dos inteiros; em módulo composto, nem todo elemento tem inverso. A estrutura muda, e o cálculo precisa respeitar isso.",
      levar: "Primo é tijolo; módulo é relógio.",
      maos:
        "Calcule o último algarismo de 2 elevado a 100 reduzindo o expoente módulo 4.",
    },
    "Teoria Analítica dos Números": {
      contexto:
        "Onde isso aparece: na estimativa de quantos primos existem até um valor e na prova de que há infinitos primos em progressão. A análise entra para contar o que a aritmética sozinha não conta. Função zeta liga primo a série.",
      oQue:
        "Teoria analítica dos números usa ferramenta de análise para responder pergunta de contagem. A função zeta de Riemann codifica os primos numa série, e o teorema dos números primos dá a ordem de grandeza da contagem. Problema aditivo pergunta quantas somas de duas parcelas caem num conjunto.",
      passos: [
        "Traduza a contagem numa função de x.",
        "Escreva a série ou o produto de Euler correspondente.",
        "Use estimativa assintótica e compare com a contagem numérica.",
      ],
      exemplo:
        "O teorema dos números primos diz que a quantidade até x é próxima de x dividido pelo logaritmo de x. Para x igual a um milhão, a estimativa dá cerca de 72 mil, e a contagem real é 78 mil. A ordem de grandeza acerta; o termo de erro é a parte difícil.",
      quebra:
        "Confundir estimativa assintótica com fórmula exata. O teorema diz o comportamento para x grande; para x pequeno, a diferença pode ser grande. Usar como igualdade erra a conta.",
      limite:
        "A hipótese de Riemann, sobre os zeros da zeta, ainda não foi provada, e muitos resultados dependem dela. Sem essa prova, a estimativa carrega folga maior do que se gostaria.",
      levar: "A análise conta primos por aproximação, e a aproximação é o resultado.",
      maos:
        "Compare a contagem real de primos até mil com a estimativa x sobre log x.",
      pergunta: {
        q: "O que o teorema dos números primos afirma?",
        a: "Que a quantidade de primos até x cresce como x dividido pelo logaritmo de x",
        why: "É um resultado assintótico: descreve a ordem de grandeza da contagem para x grande, não uma fórmula exata para cada x.",
      },
    },
    "Teoria Algébrica dos Números": {
      contexto:
        "Onde isso aparece: na solução de equação que não cabe nos racionais e na fatoração que deixa de ser única. Ampliar o corpo resolve uma equação e cria outro problema. Ideal entra para recuperar a fatoração única.",
      oQue:
        "Teoria algébrica dos números estuda corpo numérico, inteiro algébrico e ideal. Ampliar o corpo dos racionais com uma raiz resolve equação que antes não tinha solução, mas a fatoração única pode se perder. Ideais são a estrutura que devolve a fatoração num anel maior.",
      passos: [
        "Identifique o polinômio e o corpo que contém a raiz.",
        "Veja se o anel de inteiros mantém fatoração única.",
        "Troque número por ideal quando a fatoração única não valer.",
      ],
      exemplo:
        "No anel dos inteiros de um corpo quadrático, um número pode se fatorar de duas maneiras diferentes em irredutíveis. O ideal contorna: cada ideal se fatora de forma única em ideal primo. A fatoração volta, mas no nível do ideal, não do elemento.",
      quebra:
        "Achar que a fatoração única vale em qualquer anel de inteiros algébricos. Não vale. A suposição leva a prova falsa, e o contraexemplo clássico mostra a falha.",
      limite:
        "A teoria descreve bem o anel de Dedekind, que tem a propriedade boa. Fora dessa classe, a estrutura é mais complicada e a conclusão muda, e o contraexemplo deixa de ser exceção para virar aviso sobre generalização: o que se prova é sempre relativo à estrutura do anel em questão.",
      levar: "Quando o número não fatora bem, o ideal fatora.",
      maos:
        "Procure um anel de inteiros algébricos sem fatoração única e mostre duas fatorações do mesmo elemento.",
      pergunta: {
        q: "Por que a teoria algébrica troca número por ideal?",
        a: "Porque em alguns anéis de inteiros algébricos a fatoração única se perde",
        why: "O ideal recupera a fatoração única num nível mais fino, e a teoria consegue provar o que o elemento sozinho não permite.",
      },
    },
    "Teoria Transcendental dos Números": {
      contexto:
        "Onde isso aparece: na prova de que pi e e não são raiz de polinômio e na aproximação de número por fração. A pergunta é quão bem um irracional se aproxima de racional. Quanto melhor a aproximação, mais longe do algébrico o número fica.",
      oQue:
        "Número algébrico é raiz de polinômio com coeficiente inteiro; transcendente não é. Aproximação diofantina mede quão perto um irracional chega de fração, e a medida de irracionalidade quantifica isso. A transcendência prova que nenhum polinômio captura o número.",
      passos: [
        "Suponha que o número é algébrico e escreva o polinômio que o anula.",
        "Use a aproximação racional para gerar contradição.",
        "Conclua a transcendência e verifique a hipótese usada.",
      ],
      exemplo:
        "A prova de que e é transcendente supõe polinômio com coeficiente inteiro que anula e, e chega a contradição pela aproximação da série. O mesmo tipo de argumento vale para pi, com mais trabalho. O número não é raiz de polinômio nenhum.",
      quebra:
        "Achar que todo irracional é transcendente. A raiz de dois é irracional e algébrica, porque resolve x ao quadrado menos dois igual a zero. Irracionalidade e transcendência são categorias diferentes.",
      limite:
        "Provar transcendência é difícil e caso a caso. Não existe método geral que decida para qualquer número, e muitas constantes ainda estão em aberto, o que faz da área um conjunto de provas isoladas com técnica própria, cada uma ajustada ao número e ao método que melhor o cerca.",
      levar: "Algébrico é raiz de polinômio; transcendente escapa de todos.",
      maos:
        "Mostre que a raiz de dois é algébrica e compare com a definição de transcendente.",
      pergunta: {
        q: "Qual é a diferença entre irracional e transcendente?",
        a: "Irracional não é fração de inteiros; transcendente não é raiz de polinômio com coeficiente inteiro",
        why: "A raiz de dois é irracional e algébrica; pi e e são transcendentes. Todo transcendente é irracional, mas nem todo irracional é transcendente.",
      },
    },
    "Matemática Comercial e Financeira": {
      contexto:
        "Onde isso aparece: no financiamento, no cartão e na decisão de comprar à vista. Juro composto é exponencial disfarçada, e taxa ao mês não se converte em ao ano por multiplicação simples. O valor do dinheiro muda com o tempo.",
      oQue:
        "Matemática financeira compara dinheiro em instantes diferentes. Juro simples cresce linear, juro composto cresce exponencial, e a taxa equivalente converte prazo sem mudar o efeito. Valor presente traz o fluxo futuro para hoje, e a amortização reparte o pagamento entre juro e principal.",
      passos: [
        "Desenhe a linha do tempo dos fluxos de caixa.",
        "Converta toda taxa para a mesma unidade de prazo.",
        "Compare valor presente em vez de somar valor nominal.",
      ],
      exemplo:
        "Uma taxa de 1% ao mês não é 12% ao ano: um mais 0,01 elevado a 12 menos um dá cerca de 12,68%. Em trinta anos, a diferença entre 12% e 12,68% muda o montante em milhares. A conversão é exponencial, e a conta de juros compostos segue a mesma regra.",
      quebra:
        "Somar taxa de juros simples quando o regime é composto. A soma ignora o juro sobre juro, e o resultado subestima o custo. Em prazo longo, o erro cresce sem aviso.",
      limite:
        "O modelo supõe taxa constante e ausência de inflação ou risco. Em cenário real, a taxa muda e a decisão envolve incerteza, que a conta sozinha não resolve.",
      levar: "Dinheiro tem data: comparar exige trazer tudo para o mesmo instante.",
      maos:
        "Converta 1% ao mês para ao ano pelas duas contas, simples e composta, e compare.",
      pergunta: {
        q: "Por que 1% ao mês não é 12% ao ano em juro composto?",
        a: "Porque o juro do mês seguinte incide sobre o montante já corrigido",
        why: "A conversão é exponencial: um mais 0,01 elevado a 12 menos um dá cerca de 12,68%, e a diferença cresce com o prazo.",
      },
    },
  },
  "math-discreta": {
    "Combinatória Enumerativa": {
      contexto:
        "Onde isso aparece: na senha, na fila, no campeonato e no teste de sorteio. Contar não é listar: é achar a estrutura da escolha. Permutação ordena, combinação só escolhe, e a diferença entre as duas é o fator que decide a conta.",
      oQue:
        "Combinatória conta arranjos, escolhas e estruturas finitas. O princípio multiplicativo encadeia escolhas independentes, e o aditivo soma casos que não se sobrepõem. Função geradora transforma a contagem em coeficiente de série, e inclusão-exclusão corrige a contagem que contou duas vezes.",
      passos: [
        "Decida se a ordem importa e se a repetição é permitida.",
        "Escolha entre permutação, arranjo e combinação.",
        "Corrija sobreposição com inclusão-exclusão quando os casos se cruzam.",
      ],
      exemplo:
        "Uma comissão de duas pessoas num grupo de cinco não tem ordem: escolher Ana e Bia é o mesmo que Bia e Ana. A conta é cinco vezes quatro dividido por dois, que dá dez. Já uma fila de duas pessoas do mesmo grupo tem ordem e dá vinte. A divisão pela permutação dos escolhidos é o que corrige a contagem.",
      quebra:
        "Contar arranjo quando o problema pede combinação. A resposta sai multiplicada pelo fatorial dos escolhidos, e o erro passa despercebido quando o número é grande. Perguntar se a ordem importa resolve antes de calcular.",
      limite:
        "A fórmula fechada vale para conjunto sem estrutura especial. Com restrição de vizinhança, grupo repetido ou simetria, a contagem direta erra e pede inclusão-exclusão ou função geradora.",
      levar: "Conte escolhas, não listas: a estrutura decide a fórmula.",
      maos:
        "Conte as comissões de duas pessoas de cinco e confira listando os pares.",
    },
    "Teoria dos Grafos": {
      contexto:
        "Onde isso aparece: na rota de entrega, na rede social e na dependência entre tarefas. Vértice é coisa, aresta é relação, e a pergunta vira estrutura. Caminho, ciclo e conectividade respondem quase tudo.",
      oQue:
        "Grafo é conjunto de vértices ligados por arestas. Modela rede, rota, dependência e amizade. Árvore é grafo conectado e sem ciclo; planar é o que desenha sem cruzamento; coloração separa vizinhos em grupos, e grafo de fluxo carrega capacidade na aresta.",
      passos: [
        "Desenhe os vértices e as arestas do problema.",
        "Verifique conectividade e presença de ciclo.",
        "Escolha o algoritmo pela estrutura: busca, coloração ou fluxo.",
      ],
      exemplo:
        "Numa rede de sete cidades, uma árvore conecta todas com seis estradas e nenhum caminho alternativo: tirar uma estrada parte a rede. Acrescentar a sétima estrada cria um ciclo, e aí existe rota alternativa. Conectado e sem ciclo é a definição que garante o número de arestas.",
      quebra:
        "Chamar de árvore todo grafo conectado. Conectividade sozinha não basta: com ciclo, o grafo deixa de ser árvore e a contagem de arestas muda.",
      limite:
        "A intuição de desenho falha em grafo grande e em grafo não planar. Propriedade como planaridade e número cromático exige prova, não figura.",
      levar: "Grafo é relação desenhada: conexão e ciclo dizem o resto.",
      maos:
        "Monte uma árvore de cinco vértices e depois acrescente uma aresta para ver o ciclo nascer.",
    },
    "Combinatória Extremal": {
      contexto:
        "Onde isso aparece: no limite de conexão de uma rede, no tamanho de conjunto sem padrão proibido e no campeonato sem empate. A pergunta é quanto cabe antes de a estrutura obrigar certo padrão. Ramsey mostra que, em conjunto grande, padrão aparece de qualquer jeito. O exemplo mais conhecido é o jantar de seis pessoas: sempre há três que se conhecem todas ou três que não se conhecem nenhuma, e o número exigido para casos maiores ainda é mistério.",
      oQue:
        "Combinatória extremal pergunta o maior ou o menor tamanho de estrutura que evita ou força uma propriedade. O teorema de Ramsey diz que em grupo grande sempre existe subconjunto organizado, e o extremal clássico conta quantas arestas cabem sem formar triângulo. O resultado costuma ser limite, não fórmula exata.",
      passos: [
        "Formule a propriedade proibida ou exigida.",
        "Construa exemplo que evita a propriedade e mostre o limite inferior.",
        "Prove que acima daquele tamanho a propriedade aparece, fechando o limite superior.",
      ],
      exemplo:
        "Num jantar com seis pessoas, sempre há três que se conhecem todas ou três que não se conhecem nenhuma. Isso é um caso pequeno de Ramsey. O número exato para casos maiores é desconhecido, e o que se prova são cotas: o padrão aparece antes do que a intuição espera.",
      quebra:
        "Achar que o número de Ramsey é fácil de calcular por tentativa. Os valores crescem rápido e são desconhecidos além de casos pequenos. Confundir cota com valor exato leva a afirmação falsa.",
      limite:
        "Cotas extremas costumam ser frouxas, e o valor exato é difícil. Em aplicação, o limite garante existência, mas não dá construção explícita.",
      levar: "Estrutura grande obriga padrão: é disso que Ramsey trata.",
      maos:
        "Desenhe um grafo de seis vértices colorido em duas cores e procure o triângulo monocromático.",
      pergunta: {
        q: "O que o teorema de Ramsey garante?",
        a: "Que estrutura grande contém subconjunto organizado, de qualquer jeito",
        why: "A garantia vale para qualquer coloração: em conjunto grande o padrão monocromático aparece, e o número de Ramsey mede o tamanho necessário.",
      },
    },
    "Combinatória Algébrica": {
      contexto:
        "Onde isso aparece: na contagem de partição, na simetria de polinômio e na representação de grupo. A ideia é trocar a contagem direta por estrutura algébrica, e o coeficiente passa a carregar o número. Função simétrica resume a informação que a permutação não muda.",
      oQue:
        "Combinatória algébrica liga contagem a estrutura algébrica. Função simétrica é invariante por permutação e organiza partição; representação combinatória descreve objeto discreto com álgebra. A conta que era caso a caso vira coeficiente de produto.",
      passos: [
        "Identifique a simetria que o problema tem.",
        "Escreva a função geradora ou simétrica correspondente.",
        "Extraia o coeficiente da estrutura que se quer contar.",
      ],
      exemplo:
        "O número de partições de um inteiro em partes pode ser lido no coeficiente da série que multiplica fatores de um sobre um menos x elevado a k. Cada fator representa uma parte possível, e o coeficiente conta as combinações. A lista infinita vira produto finito de leitura.",
      quebra:
        "Aplicar fórmula simétrica sem checar a simetria do problema. Se a estrutura não é invariante por permutação, a função simétrica conta outra coisa. A hipótese precisa valer antes da conta.",
      limite:
        "A tradução algébrica pode ser elegante e cara de calcular. Coeficiente de série grande exige método assintótico, e a forma fechada nem sempre existe. O preço da elegância é a conta: a série costuma crescer rápido, e o coeficiente exato sai por recorrência ou por computador. Em problema de contagem séria, a função geradora vem junto de estimativa assintótica e de conferência em casos pequenos.",
      levar: "Contar com simetria é contar uma vez o que se repete.",
      maos:
        "Escreva a função geradora das partições de cinco e confira o coeficiente contando à mão."
      ,
      pergunta: {
        q: "O que uma função simétrica preserva?",
        a: "O valor quando as variáveis são permutadas",
        why: "A invariância por permutação é a definição; ela permite resumir estruturas que só diferem pela ordem dos elementos.",
      },
    },
    "Combinatória Probabilística": {
      contexto:
        "Onde isso aparece: na prova de que existe grafo com certa propriedade e no limite de algoritmo aleatório. O argumento é de existência: se a probabilidade de falhar é menor que um, então existe exemplo bom. Não se constrói o objeto; prova-se que ele tem de estar lá.",
      oQue:
        "Método probabilístico prova existência mostrando que escolha aleatória tem probabilidade positiva de dar certo. Estimativa de esperança e de desvio sustentam o argumento, e a conclusão é sobre existência, não sobre construção. É ferramenta de combinatória quando a contagem direta é inviável. Esse tipo de argumento resolve existência que a contagem exata não alcança, e o exemplo costuma ser encontrado depois, por busca dirigida.",
      passos: [
        "Escolha a distribuição aleatória sobre as estruturas.",
        "Estime a probabilidade do evento ruim ou a esperança do parâmetro.",
        "Conclua que existe estrutura fora do evento ruim.",
      ],
      exemplo:
        "Para mostrar que existe grafo com número cromático alto e sem triângulo, o argumento sorteia arestas e mostra que a probabilidade de falhar nas duas condições é menor que um. Então algum grafo sorteado cumpre as duas. O método não diz qual, mas garante que existe.",
      quebra:
        "Confundir existência com construção. O método probabilístico garante que o objeto existe, mas não entrega o objeto. Quem precisa do grafo explícito tem de buscar algoritmo, não só o argumento.",
      limite:
        "A cota pode ser fraca e o objeto raro. Probabilidade positiva não diz que o sorteio comum acha o objeto, e a distribuição escolhida muda a força do resultado.",
      levar: "Se a escolha aleatória acerta com chance maior que zero, o objeto existe.",
      maos:
        "Sorteie grafos pequenos e veja com que frequência aparece o padrão procurado.",
      pergunta: {
        q: "O que o método probabilístico prova em combinatória?",
        a: "A existência de estrutura com a propriedade, sem construí-la",
        why: "Se a probabilidade de sucesso é positiva, algum objeto da distribuição cumpre a propriedade; o argumento não entrega o objeto explicitamente.",
      },
    },
    "Teoria dos Desenhos Combinatórios": {
      contexto:
        "Onde isso aparece: no planejamento de experimento, no torneio com rodada equilibrada e no quadrado latino de sudoku. O desenho reparte elementos em blocos com regra de incidência. A regra garante comparação justa entre tratamentos.",
      oQue:
        "Desenho combinatório organiza elementos em blocos com condição de incidência. Quadrado latino arranja símbolos sem repetir em linha nem coluna, e planejamento de experimento usa isso para separar efeito de tratamento de efeito de ordem. O desenho é estrutura, não enfeite de tabela.",
      passos: [
        "Defina tratamentos, blocos e a condição de balanceamento.",
        "Construa o desenho ou verifique se o existente cumpre a condição.",
        "Analise o resultado separando efeito de tratamento e de bloco.",
      ],
      exemplo:
        "Um teste de quatro pneus em quatro carros pode ser organizado em quadrado latino: cada carro recebe os quatro pneus em ordem diferente, e cada posição recebe cada pneu uma vez. Assim, efeito de carro e de ordem não se confundem com efeito de pneu. O desenho é o que permite comparar. Em experimento agrícola, o desenho em blocos completos ao acaso foi o que separou efeito de solo do efeito de variedade, e a lição vale para qualquer área.",
      quebra:
        "Usar desenho desbalanceado e analisar como se fosse balanceado. O efeito de bloco entra na conta como se fosse tratamento, e a conclusão sai torta. O balanceamento é condição de validade.",
      limite:
        "O desenho existe para certos parâmetros; nem toda combinação de tamanho admite. Quando não existe, o plano precisa de aproximação ou de bloco incompleto, com perda de precisão.",
      levar: "Desenho bom compara o que interessa e isola o resto.",
      maos:
        "Monte um quadrado latino de quatro por quatro e confira que nenhum símbolo repete em linha ou coluna.",
      pergunta: {
        q: "Para que serve um quadrado latino num experimento?",
        a: "Para variar a ordem sem confundir efeito de tratamento com efeito de ordem",
        why: "Cada tratamento aparece uma vez em cada linha e coluna, então o efeito de bloco e de posição se separa do efeito que se quer medir.",
      },
    },
    "Teoria dos Códigos": {
      contexto:
        "Onde isso aparece: no disco, na transmissão por rádio e no QR code. Código corretor acrescenta redundância para detectar e corrigir erro, e a distância mínima diz quantos erros cabem. Redundância é o preço da confiabilidade.",
      oQue:
        "Código corretor adiciona redundância para detectar e corrigir erro de transmissão. A distância mínima entre palavras é o que limita quantos erros o código corrige: com distância d, corrige até (d−1)/2. Código linear tem estrutura algébrica que facilita a decodificação.",
      passos: [
        "Escolha o código e calcule a distância mínima.",
        "Veja quantos erros o canal pode introduzir.",
        "Decodifique pela palavra válida mais próxima e confira se está dentro do limite.",
      ],
      exemplo:
        "Um código com distância mínima três corrige um erro por palavra: duas palavras válidas ficam a três posições, e um erro aproxima de uma sem chegar na outra. Com distância quatro, corrige um e detecta dois. A conta é geométrica e vale para todo código.",
      quebra:
        "Confundir detecção com correção. Detectar erro é saber que houve; corrigir é saber qual palavra foi enviada. A distância que garante uma não garante a outra, e o projeto precisa das duas.",
      limite:
        "Corrigir mais erro custa mais redundância, e a taxa útil cai. Em canal com erro em rajada, o modelo de erro independente não vale, e o código precisa de entrelaçamento.",
      levar: "Distância mínima é a régua: ela diz quantos erros o código perdoa.",
      maos:
        "Calcule a distância mínima de um código pequeno e veja quantos erros ele corrige.",
    },
    "Matroides e Estruturas Discretas": {
      contexto:
        "Onde isso aparece: na árvore geradora mínima, na alocação de recurso e no algoritmo guloso que funciona sem prova caso a caso. Matroide é a estrutura que diz quando o guloso é ótimo. Independência combinatória generaliza a ideia de conjunto sem dependência.",
      oQue:
        "Matroide é estrutura com noção de independência que respeita dois axiomas: subconjunto de independente é independente, e troca entre conjuntos de tamanhos diferentes. Essa estrutura garante que o algoritmo guloso resolve otimização. Otimização combinatória usa isso para justificar escolha local. Árvore geradora mínima, emparelhamento e base de espaço vetorial são exemplos clássicos, cada um com o guloso certo funcionando.",
      passos: [
        "Identifique o conjunto base e a noção de independência.",
        "Verifique os axiomas de matroide.",
        "Se valerem, use o guloso e confie na otimalidade.",
      ],
      exemplo:
        "Em grafo, o conjunto de arestas sem ciclo forma matroide; por isso o algoritmo de Kruskal, que escolhe a aresta mais barata sem fechar ciclo, acha a árvore geradora mínima. Já o problema do caixeiro viajante não forma matroide, e o guloso falha. A estrutura explica a diferença.",
      quebra:
        "Usar guloso em problema que não é matroide e supor que o resultado é ótimo. O algoritmo entrega solução boa e não avisa que é só boa. Sem os axiomas, a garantia não existe. O teste rápido é procurar contraexemplo: se o guloso falhar em caso pequeno, a estrutura não é matroide e a prova não vem.",
      limite:
        "Matroide garante otimalidade para função de peso linear. Com restrição extra ou objetivo não linear, a estrutura não basta, e o problema pode ficar difícil.",
      levar: "Guloso só é ótimo quando a estrutura permite.",
      maos:
        "Rode o guloso num grafo pequeno e depois num problema não matroide e compare.",
      pergunta: {
        q: "Por que o algoritmo guloso resolve otimização em matroide?",
        a: "Porque a estrutura de independência garante que a escolha local leva ao ótimo global",
        why: "Os axiomas de matroide permitem trocar elementos sem perder independência, e disso sai a prova de que o guloso é ótimo para peso linear.",
      },
    },
  },
  "math-geometria": {
    "Geometria Euclidiana": {
      contexto:
        "Onde isso aparece: na planta da casa, no telhado e na sombra que mede altura. Ângulo, semelhança e congruência resolvem o que a régua não alcança. O teorema de Pitágoras é a ponte entre comprimento e perpendicularidade.",
      oQue:
        "Geometria euclidiana estuda ponto, reta, plano e figura a partir dos postulados clássicos. Ângulo, semelhança e congruência vêm daí, e área e volume saem da decomposição. A construção com régua e compasso é o teste histórico de que o objeto existe.",
      passos: [
        "Identifique os elementos dados e o que se quer medir ou provar.",
        "Procure triângulo retângulo, semelhança ou congruência que ligue os dados.",
        "Aplique a relação e confira a coerência das unidades.",
      ],
      exemplo:
        "Um poste de 4 metros projeta sombra de 3 metros, e uma pessoa de 1,8 metro projeta sombra de 1,35. A semelhança de triângulos resolve a altura do poste sem subir nele. Já o Pitágoras exige triângulo retângulo: sem o ângulo de 90 graus, a relação entre lados muda.",
      quebra:
        "Usar Pitágoras em triângulo que não é retângulo. A conta fecha no papel e erra na obra. A hipótese do ângulo reto é parte do teorema, não detalhe do desenho.",
      limite:
        "A geometria euclidiana vale no plano e no espaço de curvatura zero. Em superfície curva, a soma dos ângulos do triângulo deixa de ser 180 graus, e a conta precisa de outra geometria.",
      levar: "Semelhança resolve o que a régua não alcança.",
      maos:
        "Meça a sombra de um objeto e a sua própria sombra e calcule a altura pela semelhança.",
    },
    "Geometria Analítica": {
      contexto:
        "Onde isso aparece: no gráfico de função, no GPS e no projeto de peça por coordenada. A figura vira equação, e o problema de desenho vira problema de álgebra. Interseção de curva é sistema de equações.",
      oQue:
        "Geometria analítica coloca coordenadas no plano e no espaço e traduz figura em equação. Ponto é par ordenado, reta é relação linear, cônica é equação de segundo grau. Distância, ângulo e interseção saem de fórmula algébrica.",
      passos: [
        "Escolha o sistema de coordenadas e a origem que simplificam a conta.",
        "Escreva a equação da figura e a da outra figura.",
        "Resolva o sistema para achar interseção ou posição relativa.",
      ],
      exemplo:
        "A reta que passa por dois pontos tem equação que vem da inclinação e de um ponto. Duas retas são paralelas quando a inclinação é igual e o coeficiente linear difere; coincidentes quando os dois coeficientes batem. A pergunta geométrica virou comparação de número.",
      quebra:
        "Esquecer a origem e a escala ao interpretar o gráfico. A mesma figura desenhada em escala diferente parece outra, e a leitura do coeficiente muda. A conta está certa; a interpretação não. Em três dimensões, o plano tem equação linear com três coeficientes, e a distância de ponto a plano sai da norma do vetor normal, com sinal que indica o lado do plano. A escolha da equação depende do que se quer medir: distância, interseção ou ângulo.",
      limite:
        "A coordenada cartesiana descreve bem o plano, mas nem toda figura tem equação simples. Curva definida por processo, como fractal, não se escreve por polinômio, e a análise muda.",
      levar: "Coordenada transforma desenho em conta.",
      maos:
        "Ache a interseção de uma reta e uma circunferência resolvendo o sistema e confira no gráfico.",
      pergunta: {
        q: "O que a equação de uma reta representa no plano cartesiano?",
        a: "O conjunto de pontos que satisfazem a relação entre x e y",
        why: "Cada par ordenado que cumpre a equação está na reta; a equação é a descrição algébrica da figura geométrica.",
      },
    },
    "Geometria Vetorial": {
      contexto:
        "Onde isso aparece: na força resultante, na projeção de sombra e no motor 3D. Vetor carrega direção, sentido e tamanho, e a operação respeita isso. Produto escalar mede alinhamento; produto vetorial mede área e perpendicularidade.",
      oQue:
        "Geometria vetorial trata o vetor como ente com direção, sentido e módulo, e define soma, múltiplo e produto. O produto escalar entrega número ligado ao cosseno do ângulo, e o vetorial entrega vetor perpendicular aos dois. Reta e plano no espaço ganham equação vetorial.",
      passos: [
        "Escreva os vetores em coordenadas.",
        "Escolha o produto pela pergunta: ângulo e projeção pedem escalar; perpendicular pede vetorial.",
        "Interprete o resultado com a unidade e o sinal.",
      ],
      exemplo:
        "Dois vetores de módulo 3 e 4 com produto escalar 0 são perpendiculares, porque o cosseno é zero. O produto vetorial deles tem módulo 12 e aponta na perpendicular, que é a área do paralelogramo formado. O mesmo par de vetores responde a duas perguntas diferentes.",
      quebra:
        "Trocar produto escalar por vetorial sem olhar o tipo de resposta. Um devolve número, o outro devolve vetor. Usar o errado quebra a conta e a interpretação geométrica. Em física, o escalar aparece no trabalho e o vetorial no torque, e a mesma conta muda de nome quando muda o contexto, mas a interpretação tem de acompanhar. O produto misto, que combina os três, acrescenta o volume do paralelepípedo.",
      limite:
        "O produto vetorial é próprio do espaço tridimensional. Em dimensão maior, a perpendicularidade existe, mas o produto vetorial clássico não generaliza do mesmo jeito.",
      levar: "Escalar mede alinhamento; vetorial mede área e perpendicular.",
      maos:
        "Calcule o produto escalar e o vetorial de dois vetores e compare o que cada um informa.",
      pergunta: {
        q: "O que o produto escalar informa sobre dois vetores?",
        a: "O quanto um aponta na direção do outro, ligado ao cosseno do ângulo",
        why: "O produto escalar é o produto dos módulos pelo cosseno do ângulo entre eles; zero indica perpendicularidade.",
      },
    },
    "Geometria Diferencial": {
      contexto:
        "Onde isso aparece: na curva da estrada, na casca do ovo e na curvatura do espaço na relatividade. A ferramenta é o cálculo, e a pergunta é como a forma se dobra sem referência externa. Geodésica é o caminho mais curto na superfície.",
      oQue:
        "Geometria diferencial estuda curva e superfície com cálculo: curvatura, geodésica e variedade. A curvatura mede o quanto a curva se afasta da reta ou a superfície do plano, e a geodésica generaliza a reta para o espaço curvo. É a base da relatividade geral.",
      passos: [
        "Parametrize a curva ou a superfície.",
        "Calcule a curvatura e o referencial móvel.",
        "Ache a geodésica pela equação ou pela variação do comprimento.",
      ],
      exemplo:
        "Na esfera, a geodésica é o arco de círculo máximo, e é por isso que o voo entre duas cidades longe do equador parece curvar no mapa plano. A curvatura da esfera é constante e positiva; a da sela é negativa. O sinal muda o comportamento das geodésicas.",
      quebra:
        "Achar que geodésica é sempre a linha reta do desenho. Na superfície curva, a reta do papel não é o caminho mais curto. A intuição plana engana.",
      limite:
        "A conta local descreve vizinhança pequena. Comportamento global, como fechamento de geodésica, depende da topologia da superfície e não sai da curvatura sozinha.",
      levar: "Curvatura é o que a forma faz sem sair dela mesma.",
      maos:
        "Desenhe duas geodésicas na esfera e veja o que acontece quando elas se cruzam.",
    },
    "Geometria Algébrica": {
      contexto:
        "Onde isso aparece: na curva de nível, na interseção de superfície e no código corretor. A figura é o conjunto de soluções de polinômio. Traduzir figura em equação permite usar álgebra para provar propriedade geométrica.",
      oQue:
        "Geometria algébrica estuda variedade algébrica: o conjunto de pontos que anulam um sistema de polinômios. Curva e superfície algébrica ganham grau e singularidade, e ideal é o objeto algébrico correspondente. Geometria aritmética estuda solução inteira e racional das mesmas equações.",
      passos: [
        "Escreva o sistema de polinômios que define a figura.",
        "Veja o grau e a dimensão da variedade.",
        "Estude singularidade e interseção com outras variedades.",
      ],
      exemplo:
        "A circunferência é a variedade definida por x ao quadrado mais y ao quadrado igual a um. Interseção com a reta y igual a x dá dois pontos, e a conta é resolver o sistema. A figura e o sistema são a mesma coisa escrita de dois jeitos.",
      quebra:
        "Supor que toda equação polinomial desenha figura suave. A curva pode ter bico, cruzamento ou ponto isolado, e a geometria muda no ponto singular. Ignorar a singularidade erra a conclusão sobre interseção. O grau da equação controla quantas interseções são esperadas, e o teorema de Bézout formaliza essa contagem no caso sem singularidade.",
      limite:
        "O estudo clássico pede corpo algebricamente fechado. Sobre os racionais, a mesma equação pode ter pouquíssima solução, e a geometria aritmética é bem mais difícil.",
      levar: "Figura algébrica é conjunto de soluções de polinômio.",
      maos:
        "Escreva a equação de uma circunferência e ache a interseção com uma reta.",
      pergunta: {
        q: "O que é uma variedade algébrica?",
        a: "O conjunto de pontos que anulam um sistema de polinômios",
        why: "A definição liga a figura geométrica ao ideal gerado pelos polinômios, e é essa ligação que permite usar álgebra para provar propriedade da figura.",
      },
    },
    "Geometria Euclidiana e Não Euclidiana": {
      contexto:
        "Onde isso aparece: no mapa da Terra, na navegação e no modelo cosmológico. Trocar o postulado das paralelas muda a soma dos ângulos do triângulo. Cada geometria é uma escolha axiomática com aplicação própria.",
      oQue:
        "A geometria não euclidiana troca o postulado das paralelas. Na hiperbólica, por um ponto passam infinitas paralelas e a soma dos ângulos do triângulo é menor que 180 graus; na elíptica, não passa nenhuma e a soma é maior. Geometria projetiva e afim estudam o que sobrevive a outra transformação.",
      passos: [
        "Identifique qual postulado está sendo trocado.",
        "Veja o modelo concreto: esfera, disco ou plano projetivo.",
        "Recalcule a propriedade que dependia do postulado antigo.",
      ],
      exemplo:
        "Num triângulo na esfera com três ângulos de 90 graus, a soma dá 270 graus, e cada lado é arco de círculo máximo. No plano, a mesma construção é impossível. A diferença não é de desenho: é de axioma. Na elíptica, o modelo é a esfera com pontos antipodais identificados, e a distância é o arco menor; a soma dos ângulos passa de 180 graus em qualquer triângulo, e a distância entre dois pontos é o arco menor, não a corda.",
      quebra:
        "Usar resultado euclidiano em geometria curva. A soma dos ângulos, a relação de Pitágoras e o paralelismo mudam. Aplicar a fórmula antiga no modelo novo erra por construção.",
      limite:
        "Cada geometria tem modelo e alcance próprios. A escolha depende do problema físico, e não existe uma mais verdadeira em abstrato: existem axiomas e consequências.",
      levar: "Mudar o axioma muda o mundo que a geometria descreve.",
      maos:
        "Desenhe um triângulo na bola e meça a soma dos ângulos.",
      pergunta: {
        q: "O que muda na geometria hiperbólica em relação à euclidiana?",
        a: "O postulado das paralelas: por um ponto passam infinitas retas paralelas",
        why: "Com a troca, a soma dos ângulos do triângulo fica menor que 180 graus e várias relações euclidianas deixam de valer.",
      },
    },
    "Geometria Topológica": {
      contexto:
        "Onde isso aparece: na classificação de superfície, no mapa do globo e no estudo de forma que estica. A pergunta é o que sobrevive a deformação contínua. Gênero e orientabilidade separam as superfícies fechadas.",
      oQue:
        "Geometria topológica estuda propriedade que não muda por deformação contínua. Superfície fechada se classifica por gênero e orientabilidade: esfera, toro, plano projetivo e soma conexa. Invariante geométrico liga propriedade de forma a estrutura topológica.",
      passos: [
        "Determine se a superfície é fechada e orientável.",
        "Conte o gênero, que é o número de furos.",
        "Classifique pela lista e compare com a forma estudada.",
      ],
      exemplo:
        "A esfera e o toro não são a mesma superfície: o toro tem um furo e a esfera não. Já a caneca e o toro são o mesmo objeto topológico, porque a caneca tem exatamente um furo na alça. A deformação não cria nem destrói furo. A soma conexa de dois toros é o toro de dois furos, e a classificação diz que toda superfície fechada orientável é uma esfera com alças; a borda entra como disco removido. A orientabilidade separa o toro do plano projetivo, e o gênero conta quantas alças a superfície tem. A caneca e o toro são o mesmo objeto; a caneca com duas alças não é.",
      quebra:
        "Confundir topologia com geometria. Duas formas podem ser topologicamente iguais e geometricamente diferentes: mesma estrutura, distância e curvatura distintas. A pergunta precisa dizer qual propriedade interessa.",
      limite:
        "A classificação completa vale para superfície fechada. Com borda, dimensão maior ou singularidade, a lista cresce e o problema fica mais difícil.",
      levar: "Topologia conta furos; geometria mede distâncias.",
      maos:
        "Classifique uma caneca, uma bola e uma rosquinha por gênero e orientabilidade.",
      pergunta: {
        q: "O que a topologia de superfícies classifica?",
        a: "Superfícies pela estrutura: gênero e orientabilidade",
        why: "A classificação ignora distância e curvatura e usa apenas o que sobrevive a deformação contínua, como o número de furos.",
      },
    },
    "Geometria Simplética e Complexa": {
      contexto:
        "Onde isso aparece: na mecânica hamiltoniana, na óptica e no estudo de variedade de Kähler. A forma simplética mede área orientada e gera o fluxo do sistema. A estrutura complexa dá o que a real não tem.",
      oQue:
        "Geometria simplética estuda variedade com forma que mede área orientada e define fluxo hamiltoniano. Geometria complexa estuda variedade com estrutura de número complexo, e a de Kähler junta as duas. Aplicação vai da mecânica clássica à física matemática.",
      passos: [
        "Identifique a forma simplética e verifique se é fechada e não degenerada.",
        "Obtenha o campo de vetor hamiltoniano a partir da função de energia.",
        "Veja se a estrutura complexa é compatível, no caso de Kähler.",
      ],
      exemplo:
        "No plano com coordenadas de posição e momento, a forma simplética mede a área orientada do paralelogramo formado por dois vetores. O fluxo hamiltoniano preserva essa área, e é por isso que o volume no espaço de fase se conserva. A conta geométrica sustenta a lei física. Em mecânica, a função de energia é o hamiltoniano, e as equações de movimento saem da forma simplética sem precisar de coordenada especial.",
      quebra:
        "Tratar a forma simplética como métrica. Ela mede área orientada, não distância. Trocar uma pela outra muda o que se conserva e a interpretação do fluxo.",
      limite:
        "A estrutura simplética existe em dimensão par. Em dimensão ímpar, o análogo é a variedade de Poisson, com comportamento diferente.",
      levar: "Simplética mede área que o fluxo não muda.",
      maos:
        "Calcule a área orientada de dois vetores no plano de fase e veja o sinal.",
      pergunta: {
        q: "O que uma variedade simplética carrega que a diferencia de uma variedade comum?",
        a: "Uma forma que mede área orientada e gera o fluxo hamiltoniano",
        why: "A forma é fechada e não degenerada, e é ela que define a dinâmica e garante a conservação do volume no espaço de fase.",
      },
    },
    "Geometria Convexa": {
      contexto:
        "Onde isso aparece: no projeto de antena, no corte de material e na otimização. Conjunto convexo contém o segmento entre dois pontos quaisquer. A convexidade simplifica: mínimo local vira global, e separação de conjunto vira teorema.",
      oQue:
        "Geometria convexa estuda conjunto que contém o segmento entre dois de seus pontos. Poliedro é interseção de semiespaço, e hiperplano de suporte toca a fronteira sem cortar o conjunto. Separação de conjuntos garante que dois convexos disjuntos podem ser separados por plano.",
      passos: [
        "Verifique a convexidade pela definição ou pela representação.",
        "Escreva o conjunto como interseção de semiespaço, quando possível.",
        "Use separação ou suporte para resolver o problema de otimização.",
      ],
      exemplo:
        "Um polígono regular é convexo; uma estrela de cinco pontas não é, porque o segmento entre duas pontas sai da figura. No problema de otimização com função convexa e região convexa, qualquer mínimo local é global, e a busca não precisa de reinício. A forma garante a conta. O teorema de separação, que garante plano entre dois convexos disjuntos, é a base do algoritmo de máquina de vetor de suporte.",
      quebra:
        "Supor convexidade pela aparência do desenho. Figura regular pode ter reentrância pequena que quebra a propriedade, e a otimização perde a garantia. A definição tem de ser verificada, não intuída.",
      limite:
        "Convexidade garante otimalidade, mas o custo computacional cresce com a dimensão. Em dimensão alta, o volume some nas pontas e os algoritmos sofrem, mesmo com a estrutura boa.",
      levar: "Convexo é o que não tem reentrância: toda corda fica dentro.",
      maos:
        "Teste três figuras na definição e veja qual delas não é convexa.",
      pergunta: {
        q: "O que a convexidade garante num problema de otimização?",
        a: "Que todo mínimo local também é global",
        why: "Com função e região convexas, não existe vale falso: qualquer ponto que não melhora por perto já é o melhor da região.",
      },
    },
    "Geometria Discreta e Computacional": {
      contexto:
        "Onde isso aparece: no mapa de cobertura de antena, na malha de jogo e no recorte de imagem. O problema é geométrico, mas a solução é algoritmo. Envoltória convexa, triangulação e vizinhança são os blocos.",
      oQue:
        "Geometria computacional resolve problema geométrico por algoritmo: envoltória convexa, triangulação, interseção e vizinhança. Diagrama de Voronoi reparte o plano pelo ponto mais próximo, e a triangulação de Delaunay é a dual. A eficiência depende da estrutura e do caso degenerado.",
      passos: [
        "Formule o problema em termos de ponto, reta e região.",
        "Escolha o algoritmo pela estrutura: varredura, divisão e conquista ou incremental.",
        "Trate caso degenerado: ponto colinear, coincidente e sobre a borda.",
      ],
      exemplo:
        "Numa lista de antenas, o diagrama de Voronoi diz qual está mais perto de cada ponto, e a célula de cada antena é a área de cobertura. A fronteira entre duas células é a mediatriz. O mapa de cobertura sai direto da estrutura geométrica.",
      quebra:
        "Ignorar caso degenerado no algoritmo. Ponto colinear e ponto coincidente quebram a ordenação e a interseção, e o programa falha em entrada real, mesmo com a teoria certa.",
      limite:
        "O algoritmo ótimo em teoria pode ser lento na prática por constante e memória. Em entrada enorme e dimensão alta, a maldição da dimensionalidade muda a escolha.",
      levar: "Geometria computacional é desenho com prova de tempo.",
      maos:
        "Desenhe quatro pontos e trace o diagrama de Voronoi deles à mão.",
    },
  },
  "math-algebra": {
    "Álgebra Elementar": {
      contexto:
        "Onde isso aparece: na fórmula de juros, na área do terreno e no ajuste de escala. A expressão é a receita da conta, e fatorar é desmontar a receita. Produto notável resume padrão que aparece toda hora.",
      oQue:
        "Álgebra elementar manipula expressão com incógnita mantendo a igualdade. Produto notável é atalho de multiplicação, fatoração é o caminho de volta, e polinômio é a expressão de grau definido. Resolver equação é isolar o valor que torna a sentença verdadeira.",
      passos: [
        "Identifique o padrão antes de expandir a expressão.",
        "Fatore quando a conta for de ida e volta.",
        "Confira a solução substituindo na equação original.",
      ],
      exemplo:
        "x ao quadrado menos nove fatora em x menos três vezes x mais três; a forma fatorada mostra as raízes três e menos três de imediato, e a expandida não mostra. Já x mais dois ao quadrado é x ao quadrado mais quatro x mais quatro, não x ao quadrado mais quatro. Esquecer o termo do meio é o erro clássico do produto notável.",
      quebra:
        "Cancelar termo que está somado, não multiplicado. Em x mais três sobre três, o três não cancela o três: o correto é x sobre três mais um. Cancelar soma muda o valor e a resposta.",
      limite:
        "Fatoração simples existe para polinômio de grau baixo; em grau alto a raiz pode não ter fórmula por radicais, e a solução vem por método numérico ou por estrutura de corpo.",
      levar: "Fatorar é trocar conta por leitura.",
      maos:
        "Fatore x ao quadrado menos cinco x mais seis e veja as raízes na forma fatorada.",
      pergunta: {
        q: "Por que fatorar ajuda a resolver uma equação polinomial?",
        a: "Porque cada fator igual a zero dá uma raiz de imediato",
        why: "O produto é zero quando um dos fatores é zero, então a forma fatorada transforma a equação de grau alto em equações simples.",
      },
    },
    "Álgebra Linear": {
      contexto:
        "Onde isso aparece: na rotação de imagem, no sistema de equações e no modelo de aprendizado. Matriz é transformação, e o sistema linear é a pergunta de qual vetor cai onde. Autovalor e autovetor revelam a direção que a transformação não gira.",
      oQue:
        "Álgebra linear estuda vetor, matriz e transformação linear. O sistema linear pergunta qual vetor satisfaz a equação, e a matriz descreve como o espaço se deforma. O autovetor é a direção que a transformação mantém, e o autovalor é quanto ela estica nessa direção.",
      passos: [
        "Escreva o sistema em forma de matriz.",
        "Verifique se existe solução e se ela é única pelo determinante.",
        "Ache autovalor e autovetor quando a pergunta for sobre direção.",
      ],
      exemplo:
        "Numa transformação que estica o eixo x em dobro e mantém o y, o vetor (1,0) é autovetor com autovalor dois, e (0,1) é autovetor com autovalor um. A matriz é diagonal, e a leitura é direta. Se o determinante fosse zero, a transformação amassaria o plano numa reta.",
      quebra:
        "Achar que o determinante nulo só significa conta errada. Determinante zero quer dizer que a transformação perde dimensão e o sistema pode não ter solução única. Confundir os dois leva a insistir num sistema impossível.",
      limite:
        "A diagonalização exige autovetor suficiente; matriz com autovalor repetido pode não diagonalizar. Nesse caso a forma de Jordan descreve o que sobra, e a leitura fica mais fina.",
      levar: "Autovetor é a direção que a transformação não gira.",
      maos:
        "Ache os autovetores de uma matriz diagonal e de uma matriz de rotação, e compare.",
    },
    "Álgebra Abstrata": {
      contexto:
        "Onde isso aparece: na simetria do cristal, na aritmética modular e no código corretor. A estrutura é o que importa, não o objeto: número, matriz e permutação podem seguir a mesma regra. Grupo captura a ideia de operação com inverso.",
      oQue:
        "Álgebra abstrata estuda estrutura algébrica: conjunto com operação e axiomas. Grupo exige fechamento, associatividade, neutro e inverso; anel junta duas operações, como soma e multiplicação, e ideal é subconjunto que absorve produto. A mesma prova vale para objetos diferentes com a mesma estrutura.",
      passos: [
        "Liste o conjunto e a operação.",
        "Confira fechamento, associatividade, neutro e inverso.",
        "Veja qual estrutura mais fraca já garante o resultado que se quer.",
      ],
      exemplo:
        "Os inteiros com soma formam grupo; com multiplicação, não, porque a maioria não tem inverso inteiro. Já os inteiros módulo n com soma formam grupo finito, e o relógio é o modelo. A mesma regra vale para os dois, e o que muda é o conjunto.",
      quebra:
        "Supor que toda estrutura com operação tem inverso. Sem inverso, não há grupo, e a divisão deixa de valer. A hipótese precisa ser verificada, não presumida.",
      limite:
        "A estrutura abstrata garante o que os axiomas dizem e nada além. Propriedade que depende de ordem ou de topologia exige estrutura extra, e o teorema abstrato não alcança.",
      levar: "Álgebra abstrata pergunta a regra, não o objeto.",
      maos:
        "Verifique se os inteiros com multiplicação formam grupo e aponte o axioma que falha.",
    },
    "Teoria de Grupos": {
      contexto:
        "Onde isso aparece: na simetria do poliedro, na resolução do cubo mágico e na física de partícula. Grupo de simetria descreve o que se pode fazer sem mudar a figura. Grupos finitos, abelianos e de Lie cobrem casos diferentes.",
      oQue:
        "Teoria de grupos estuda simetria e operação. Grupo de permutação organiza embaralhamento, grupo abeliano tem operação comutativa, e grupo de Lie é contínuo, com estrutura de variedade. A classificação de grupo finito simples organiza os blocos de que todo grupo é feito. O grupo também aparece na simetria do cristal, e a lista de simples é uma das maiores conquistas da área.",
      passos: [
        "Identifique o conjunto de simetrias e a composição como operação.",
        "Veja se o grupo é abeliano, finito ou contínuo.",
        "Decomponha em subgrupo normal e quociente para simplificar.",
      ],
      exemplo:
        "O triângulo equilátero tem seis simetrias: três rotações e três reflexões. Compor duas reflexões dá rotação, e por isso o grupo não é abeliano. O cubo mágico tem grupo enorme, e a solução é uma sequência de elemento que leva ao neutro.",
      quebra:
        "Compor simetrias na ordem errada. Em grupo não abeliano, a ordem importa: girar e depois refletir não é o mesmo que refletir e depois girar. Escrever a composição ao contrário inverte o resultado.",
      limite:
        "A classificação completa vale para grupo finito. Grupo contínuo e grupo infinito têm estrutura mais rica, e a lista de simples não resolve o caso.",
      levar: "Grupo é a álgebra da simetria.",
      maos:
        "Liste as seis simetrias do triângulo e componha duas reflexões para ver a rotação.",
      pergunta: {
        q: "Como a composição de duas reflexões aparece num grupo de simetria?",
        a: "Como uma rotação, e não como outra reflexão",
        why: "Refletir duas vezes equivale a girar; é essa regra de composição que faz o grupo do triângulo ter seis elementos.",
      },
    },
    "Álgebra Comutativa": {
      contexto:
        "Onde isso aparece: na geometria algébrica, na fatoração de polinômio e no código. Anel comutativo é a base, e ideal é o que permite quociente. A fatoração única que falha no anel de inteiros algébricos é recuperada no nível do ideal.",
      oQue:
        "Álgebra comutativa estuda anel comutativo, ideal e módulo. Ideal primo e maximal organizam o quociente, e localização concentra a informação num ponto. O teorema da base de Hilbert garante que anel de polinômio sobre corpo é noetheriano. A noetherianidade é o que permite falar em variedade algébrica sem processo infinito, e ela é hipótese em quase todo teorema da área.",
      passos: [
        "Identifique o anel e o ideal de interesse.",
        "Veja se o ideal é primo ou maximal pelo quociente.",
        "Use localização quando só a vizinhança do ponto importa.",
      ],
      exemplo:
        "No anel dos inteiros, os ideais primos são os gerados por primo, e o quociente por eles é corpo. O ideal gerado por 6 não é primo, porque o quociente tem divisor de zero. A estrutura do quociente revela a natureza do ideal.",
      quebra:
        "Tratar ideal como subanel qualquer. Ideal absorve produto por elemento do anel, e essa propriedade é o que faz o quociente funcionar. Sem ela, a construção não fecha.",
      limite:
        "A teoria clássica supõe anel noetheriano e comutativo. Fora disso, a estrutura de ideal muda, e a conclusão sobre fatoração não se transporta.",
      levar: "O quociente revela o ideal.",
      maos:
        "Veja o quociente dos inteiros pelo ideal gerado por 6 e encontre os divisores de zero.",
      pergunta: {
        q: "O que o teorema da base de Hilbert garante?",
        a: "Que o anel de polinômios sobre corpo é noetheriano",
        why: "Todo ideal do anel de polinômios é gerado por conjunto finito, o que sustenta a teoria de variedade algébrica.",
      },
    },
    "Álgebra Não Comutativa": {
      contexto:
        "Onde isso aparece: na matriz de rotação, no quaternion da computação gráfica e na mecânica quântica. A ordem da conta importa, e a estrutura muda. Anel de matriz e álgebra de Lie são os exemplos centrais.",
      oQue:
        "Álgebra não comutativa estuda anel e álgebra em que a ordem do produto importa. Matriz é o exemplo mais comum, e quaternion estende o complexo sem comutar. Álgebra de Lie captura a estrutura do comutador e aparece na física. A mecânica quântica usa a não comutatividade de posição e momento, e o comutador vira a relação de incerteza; a ordem do produto deixa de ser detalhe e passa a ser princípio físico.",
      passos: [
        "Verifique se o produto comuta em exemplo pequeno.",
        "Identifique o comutador e a estrutura que ele gera.",
        "Use representação matricial para tornar a conta concreta.",
      ],
      exemplo:
        "Duas rotações no espaço tridimensional não comutam: girar em torno de x e depois de y dá resultado diferente da ordem inversa. O comutador de duas matrizes de rotação é outra matriz, ligada à álgebra de Lie. A conta gráfica sente a diferença.",
      quebra:
        "Aplicar regra de anel comutativo em anel não comutativo. O binômio quadrado e a fatoração mudam, e a conta que ignorar a ordem erra. A regra precisa ser reescrita com comutador.",
      limite:
        "A teoria não comutativa é mais difícil e menos unificada. Teorema clássico de anel comutativo não se transporta, e cada classe exige ferramenta própria.",
      levar: "Onde a ordem importa, o produto não é número: é transformação.",
      maos:
        "Componha duas rotações de 90 graus em ordens diferentes e compare o resultado.",
      pergunta: {
        q: "Por que a ordem importa na álgebra não comutativa?",
        a: "Porque o produto de duas transformações pode depender da ordem em que são aplicadas",
        why: "Rotações e matrizes em geral não comutam; o resultado de a depois b é diferente de b depois a, e o comutador mede essa diferença.",
      },
    },

    "Álgebra Homológica": {
      contexto:
        "Onde isso aparece: no cálculo de buraco de espaço, na prova de existência em geometria e na teoria de feixe. A ideia é medir o defeito de uma sequência exata. Complexo de cadeias organiza a conta.",
      oQue:
        "Álgebra homológica estuda complexo de cadeias e a homologia que mede a falha da exatidão. Functor derivado estende functor que não preserva exatidão, e cohomologia captura o obstáculo. Categoria derivada organiza os objetos para que a conta fique natural.",
      passos: [
        "Monte o complexo de cadeias com os operadores de borda.",
        "Calcule o núcleo e a imagem para achar a homologia.",
        "Interprete o grupo de homologia como obstáculo ou buraco. Os grupos de dimensões diferentes dão os números de Betti, e a sequência exata liga espaço, subespaço e quociente, o que permite calcular o grupo de um a partir dos outros dois.",
      ],
      exemplo:
        "No complexo de um espaço, o primeiro grupo de homologia conta buraco em anel: o ciclo que não é borda representa o buraco. Se o grupo é trivial, todo ciclo é borda e o buraco não existe. A conta transforma pergunta geométrica em álgebra.",
      quebra:
        "Achar que homologia e cohomologia dão sempre a mesma informação. Elas se relacionam, mas a construção é diferente e a dualidade depende do coeficiente. Trocar uma pela outra sem motivo muda o resultado.",
      limite:
        "A conta descreve a estrutura do complexo, não do espaço original. Escolher o complexo errado, ou coeficiente inadequado, produz homologia que não responde à pergunta geométrica.",
      levar: "Homologia mede o que sobra quando o ciclo não é borda.",
      maos:
        "Desenhe um anel e um disco e compare o primeiro grupo de homologia dos dois.",
      pergunta: {
        q: "O que o primeiro grupo de homologia mede?",
        a: "Os buracos em anel que não são preenchidos por uma borda",
        why: "O grupo é o núcleo do operador de borda sobre a imagem do operador seguinte; o ciclo que não é borda representa o buraco.",
      },
    },
    "Teoria de Representações": {
      contexto:
        "Onde isso aparece: na espectroscopia, na simetria de molécula e na classificação de partícula. Representar é trocar elemento abstrato por matriz, e o caráter resume a matriz por traço. A conta fica concreta sem perder a estrutura.",
      oQue:
        "Teoria de representações estuda como grupo ou álgebra age em espaço vetorial. Representação irredutível é o bloco que não se decompõe, e o caráter é o traço da matriz, que identifica a representação. Simetria de sistema físico vira decomposição em bloco. A tabela de caráter de grupo finito é quadrada e ortogonal, e a decomposição de qualquer representação sai de projeção com a tabela, e o número de irredutíveis fica determinado pelo grupo, sem precisar construir cada espaço de representação.",
      passos: [
        "Escolha o grupo e o espaço em que ele age.",
        "Decomponha em representações irredutíveis.",
        "Use o caráter para identificar e somar os blocos.",
      ],
      exemplo:
        "No grupo de rotação do plano, a representação de dimensão dois é irredutível sobre os reais, porque não existe reta invariante. Sobre os complexos, ela se decompõe em duas de dimensão um. O corpo muda a decomposição, e a escolha do corpo é parte do problema.",
      quebra:
        "Somar caráter de representações sem verificar se são do mesmo grupo e do mesmo corpo. O número perde sentido, e a conclusão de decomposição sai errada.",
      limite:
        "A teoria clássica de caráter vale para grupo finito e corpo adequado. Grupo infinito e representação de dimensão infinita exigem análise funcional, e a tabela de caráter não basta.",
      levar: "Representar é trocar simetria abstrata por matriz concreta.",
      maos:
        "Escreva as matrizes de duas simetrias do triângulo e calcule os traços.",
      pergunta: {
        q: "O que o caráter de uma representação guarda?",
        a: "O traço das matrizes, que identifica a representação",
        why: "O traço é invariante por mudança de base e distingue as representações irredutíveis, permitindo decompor sem escrever cada matriz.",
      },
    },
    "Álgebra Universal": {
      contexto:
        "Onde isso aparece: na definição de estrutura comum entre grupo, anel e reticulado, e na verificação de propriedade por identidade. A pergunta é o que vale para toda álgebra com a mesma assinatura. A prova vale em muitos casos de uma vez.",
      oQue:
        "Álgebra universal estuda estrutura definida por operação e identidade. Variedade algébrica, no sentido universal, é a classe que satisfaz conjunto de identidade; reticulado algébrico ordena com encontro e junção. A generalidade permite uma prova para muitos objetos. A mesma assinatura pode ter identidades diferentes, e a classe muda com elas.",
      passos: [
        "Liste as operações e a aridade de cada uma.",
        "Escreva as identidades que definem a classe.",
        "Verifique se o resultado usa só essas identidades.",
      ],
      exemplo:
        "Grupo e anel têm operações diferentes, mas a lei de De Morgan vale em qualquer reticulado distributivo, e a prova usa só encontro e junção. Por isso o mesmo teorema serve para conjunto com união e interseção e para lógica proposicional. A estrutura abstrata economiza prova.",
      quebra:
        "Aplicar teorema de álgebra universal em estrutura que não cumpre a assinatura. Se a operação não existe ou a identidade falha, a prova não vale. A generalidade tem pré-requisito.",
      limite:
        "Identidade não captura toda propriedade: ordem total, continuidade e finitude exigem estrutura extra. O que a álgebra universal prova é exatamente o que a identidade determina.",
      levar: "Uma prova de identidade vale em toda álgebra que a cumpre.",
      maos:
        "Verifique a lei de De Morgan num reticulado de conjuntos e na lógica proposicional.",
      pergunta: {
        q: "O que define uma variedade na álgebra universal?",
        a: "Uma classe de álgebras que satisfaz um conjunto de identidades",
        why: "A assinatura fixa as operações e as identidades fixam a classe; teorema provado por identidade vale em toda álgebra da classe.",
      },
    },
    "Teoria de Corpos e Polinômios": {
      contexto:
        "Onde isso aparece: na solução de equação, no código de Reed-Solomon e no problema clássico da trissecção do ângulo. O corpo é o lugar onde o polinômio tem raiz. A simetria das raízes decide se existe fórmula por radicais.",
      oQue:
        "Teoria de corpos estuda extensão de corpo e polinômio irredutível. A extensão é o menor corpo que contém as raízes, e o grupo de Galois mede a simetria delas. A solubilidade por radicais depende de o grupo ser solúvel.",
      passos: [
        "Verifique a irreducibilidade do polinômio sobre o corpo base.",
        "Construa o corpo de raízes e o grupo de Galois.",
        "Veja se o grupo é solúvel para decidir sobre fórmula por radicais.",
      ],
      exemplo:
        "A equação de grau dois resolve por radicais porque o grupo de Galois é pequeno e solúvel. A quíntica geral não resolve, porque o grupo de simetria das raízes não é solúvel. O critério é de estrutura, não de esforço de conta.",
      quebra:
        "Achar que toda equação polinomial tem fórmula por radicais. Acima do grau quatro, a geral não tem, e a razão é o grupo de simetria. Tentar a fórmula é perder tempo com o que já foi provado impossível.",
      limite:
        "A não solubilidade vale para a equação geral; equação particular de grau cinco pode resolver por radicais. O critério é o grupo daquela equação, não o grau sozinho.",
      levar: "A simetria das raízes decide se a fórmula existe.",
      maos:
        "Compare o grupo de Galois de uma equação de grau dois com o da quíntica geral.",
    },
    "Teoria das Categorias": {
      contexto:
        "Onde isso aparece: na tradução entre estruturas, no tipo de linguagem de programação e na construção de banco de dados. Categoria organiza objeto e seta, e functor traduz uma categoria na outra. A conta fica independente do objeto concreto.",
      oQue:
        "Teoria das categorias estuda objeto, morfismo e composição. Functor leva objeto e morfismo de uma categoria para outra preservando composição, e transformação natural compara dois funtores. Limite e colimite generalizam construção universal como produto e soma.",
      passos: [
        "Identifique os objetos e os morfismos da situação.",
        "Veja se a construção é limite ou colimite de um diagrama.",
        "Use a propriedade universal em vez de construir o objeto à mão.",
      ],
      exemplo:
        "O produto cartesiano de dois conjuntos é o limite do diagrama de dois objetos: para qualquer conjunto que projeta nos dois, existe uma única seta para o produto. A mesma definição vale para grupo, espaço e tipo, e por isso o teorema vale em todos. A generalidade vem da propriedade, não do objeto.",
      quebra:
        "Confundir o objeto com a propriedade universal que ele cumpre. Dois objetos não iguais podem cumprir a mesma propriedade e ser isomorfos; tratar como diferentes é perder a abstração.",
      limite:
        "A abstração não decide existência: o limite pode não existir na categoria. A prova categórica vale condicionalmente, e a construção concreta ainda precisa mostrar que o objeto existe.",
      levar: "Categoria troca o objeto pela relação entre objetos.",
      maos:
        "Descreva o produto de dois conjuntos pela propriedade universal e confira no produto cartesiano.",
      pergunta: {
        q: "O que um functor preserva entre duas categorias?",
        a: "Objetos, morfismos e a composição deles",
        why: "O functor leva cada objeto e cada seta de forma que compor antes ou depois dá o mesmo resultado, o que permite transportar construção de uma categoria para outra.",
      },
    },
  },
  "physics-quantica": {
    "Mecânica Quântica": {
      contexto:
        "Onde isso aparece: no laser, no transistor e na imagem médica. O estado é descrito por função de onda, e a medida devolve valor probabilístico. A conta não diz o resultado de uma medida, diz a distribuição de resultados.",
      oQue:
        "Mecânica quântica descreve o estado atômico por função de onda, e o observável vira operador. A equação de Schrödinger dá a evolução do estado, e a medida projeta o estado num autovalor. O princípio da incerteza impede conhecer posição e momento com precisão total ao mesmo tempo.",
      passos: [
        "Escreva o estado e o operador do observável.",
        "Resolva a equação para achar os autovalores possíveis.",
        "Calcule a distribuição de probabilidade e a incerteza.",
      ],
      exemplo:
        "Num átomo de hidrogênio, o elétron não tem órbita circular definida: a função de onda dá a região provável, e cada nível tem energia bem definida. A transição entre níveis emite fóton de frequência calculada, e a cor do espectro confirma a conta. A precisão do modelo é enorme, e a imagem de planeta girando não serve.",
      quebra:
        "Tratar incerteza como limitação do instrumento. Ela é propriedade do estado, não da balança: par de observável incompatível não tem valor simultâneo definido. A confusão leva a esperar medida mais precisa que o possível.",
      limite:
        "A descrição vale para sistema isolado e escala atômica. Com ambiente interagindo, a decoerência apaga a superposição, e o comportamento clássico emerge na escala grande.",
      levar: "A conta quântica entrega distribuição, não certeza.",
      maos:
        "Compare a energia de dois níveis do hidrogênio e a frequência do fóton emitido.",
    },
    "Fundamentos Quânticos": {
      contexto:
        "Onde isso aparece: no debate sobre medida, na criptografia quântica e na computação. Superposição e emaranhamento não têm análogo clássico, e a interpretação ainda é discutida. O experimento decide o que a teoria diz.",
      oQue:
        "Fundamentos quânticos tratam medida, superposição, emaranhamento e decoerência. A medida projetou o estado e destruiu a superposição, e o emaranhamento correlaciona partes distantes sem permitir mensagem instantânea. A interpretação escolhe como contar a história, mas as previsões coincidem.",
      passos: [
        "Descreva o estado conjunto, não só o de cada parte.",
        "Calcule a correlação que a medida revela.",
        "Verifique se a operação permite transmitir informação.",
      ],
      exemplo:
        "Dois fótons emaranhados em polarização mostram correlação perfeita: medir um diz o resultado do outro. Mas o resultado do primeiro é aleatório, e quem mede não controla o que envia. A correlação aparece só quando as duas listas são comparadas, e é por isso que não há mensagem instantânea.",
      quebra:
        "Achar que emaranhamento permite comunicação mais rápida que a luz. A correlação é real, e o resultado individual é aleatório, então nada é transmitido. A confusão é o erro mais comum da área.",
      limite:
        "A interpretação não muda a previsão. O debate sobre colapso, muitos mundos e variáveis ocultas é filosófico até que um experimento separe as alternativas, e hoje as previsões batem.",
      levar: "Emaranhamento correlaciona sem transmitir.",
      maos:
        "Simule duas listas de medida emaranhada e mostre que cada lista sozinha parece aleatória.",
    },
    "Teoria Quântica de Campos": {
      contexto:
        "Onde isso aparece: na colisão de partícula, no vácuo quântico e na correção de massa. O campo é o objeto, e a partícula é excitação dele. A conta soma contribuição de processo, ordem a ordem, e a renormalização doma o infinito.",
      oQue:
        "Teoria quântica de campos trata partícula como excitação de campo, e a interação como termo no lagrangiano. O diagrama de Feynman organiza a soma das contribuições por ordem de acoplamento, e a renormalização absorve o infinito em parâmetro medido. A eletrodinâmica quântica é o caso mais preciso da física. O vácuo do campo não é vazio: tem flutuação, e ela desloca a energia dos níveis, num efeito medido com precisão. O acoplamento muda com a escala de energia, e é isso que a renormalização descreve: sem ela, a soma diverge e a teoria perde poder de previsão, mesmo descrevendo bem o processo de curta distância. O acoplamento muda com a escala de energia, e é isso que a renormalização descreve.",
      passos: [
        "Escreva o lagrangiano com o termo de interação.",
        "Desenhe os diagramas por ordem de acoplamento.",
        "Calcule a amplitude e renormalize os parâmetros.",
      ],
      exemplo:
        "No espalhamento elétron-elétron, o diagrama de um fóton trocado dá a contribuição principal, e os diagramas com mais laço dão correção pequena. A soma até certa ordem bate com a medida em casas decimais. O diagrama não é desenho: é termo de conta.",
      quebra:
        "Tratar diagrama como figura ilustrativa. Cada traço e cada vértice tem regra de conta, e o sinal e o fator importam. Desenhar sem a regra não produz amplitude.",
      limite:
        "A série é assintótica, não convergente: somar mais ordem pode não melhorar. A gravidade quântica fica fora do esquema, e a teoria não é completa.",
      levar: "Campo é o objeto; partícula é o campo vibrando.",
      maos:
        "Desenhe o diagrama de troca de um fóton e identifique os vértices de interação.",
      pergunta: {
        q: "O que um diagrama de Feynman representa?",
        a: "Uma contribuição de amplitude para um processo, numa ordem de acoplamento",
        why: "Cada diagrama tem regra de conta e corresponde a um termo da série de perturbação; somar as ordens dá a amplitude prevista.",
      },
    },
    "Informação e Tecnologias Quânticas": {
      contexto:
        "Onde isso aparece: no computador quântico, na criptografia e no sensor. Qubit é a unidade, e a superposição cresce exponencial com o número de qubits. Emaranhamento entra como recurso, não como curiosidade.",
      oQue:
        "Informação quântica usa qubit, porta e circuito. O estado de n qubits tem duas elevado a n amplitudes, e a medida devolve um resultado só. Emaranhamento é recurso para teletransporte e correção de erro, e a correção é obrigatória para uso prático.",
      passos: [
        "Escreva o estado em amplitudes, não em bits.",
        "Aplique as portas como transformação unitária.",
        "Conte com decoerência e correção de erro no resultado.",
      ],
      exemplo:
        "Três qubits descrevem oito amplitudes, e uma porta de Hadamard em cada um cria superposição de todas as oito. A medida devolve uma delas com probabilidade dada pelo quadrado da amplitude. Não existe acesso às oito de uma vez, e é essa diferença que limita o algoritmo quântico.",
      quebra:
        "Achar que o computador quântico testa todas as possibilidades de uma vez. A medida entrega um resultado, e o ganho depende de interferência construída pelo algoritmo. Sem isso, não há vantagem.",
      limite:
        "O número de qubits físicos necessários é muito maior que o lógico por causa da correção de erro. A decoerência e o ruído limitam o circuito, e o ganho aparece só para classe específica de problema.",
      levar: "Qubit guarda amplitude; a medida devolve um resultado.",
      maos:
        "Escreva as amplitudes de dois qubits e veja quantas portas Hadamard são necessárias.",
    },
  },
  "physics-astro": {
    "Astronomia": {
      contexto:
        "Onde isso aparece: no telescópio, no catálogo de estrela e no relógio de posição. A astronomia observacional mede luz: posição, brilho e espectro. Cada medida responde a uma pergunta diferente sobre o objeto.",
      oQue:
        "Astronomia observacional mede posição, fluxo e espectro dos astros. Astrometria dá coordenada e movimento, fotometria dá brilho, e espectroscopia dá composição e velocidade. A instrumentação decide o que se pode medir, e o telescópio é a janela. A astronomia moderna olha faixa que o olho não vê: rádio, infravermelho e raio X, e cada faixa revela processo diferente do mesmo objeto, e o brilho é medido por comparação com estrela de referência, não por número absoluto.",
      passos: [
        "Escolha a banda e o instrumento para a pergunta.",
        "Calibre a medida com estrela de referência.",
        "Corrija atmosfera e instrumento antes de interpretar.",
      ],
      exemplo:
        "Medir brilho de estrela em duas bandas dá cor, e a cor dá temperatura. Medir o desvio do espectro dá velocidade radial, e é assim que se acha exoplaneta pela oscilação da estrela. Uma medida bem calibrada responde várias perguntas. A escala de distância usa degrau: paralaxe para perto, Cefeida para média, supernova para longe, e cada degrau calibra o seguinte. O erro de um degrau se propaga para cima, e é por isso que a calibração vale tanto. O céu não é laboratório com régua: a distância é inferida, e a inferência carrega hipótese.",
      quebra:
        "Interpretar brilho sem calibrar com referência. A atmosfera e o instrumento alteram o fluxo, e a comparação entre noites erra. A calibração é parte da medida.",
      limite:
        "A atmosfera bloqueia faixa inteira do espectro, e o chão não vê tudo. Satélite e telescópio espacial cobrem o que falta, mas com custo e tempo próprios.",
      levar: "A luz é a única amostra que o astrônomo recebe.",
      maos:
        "Compare a cor de duas estrelas no catálogo e veja a temperatura correspondente.",
      pergunta: {
        q: "O que a fotometria mede em astronomia?",
        a: "O fluxo de luz do objeto em uma banda, ligado ao brilho",
        why: "O fluxo calibrado dá magnitude e cor, e a cor revela temperatura; fotometria e espectroscopia juntas descrevem o objeto.",
      },
    },
    "Astrofísica": {
      contexto:
        "Onde isso aparece: no diagrama de estrela, na nebulosa e no exoplaneta. A estrela é esfera de plasma em equilíbrio entre gravidade e pressão. A cor revela temperatura, e o espectro revela composição e movimento.",
      oQue:
        "Astrofísica aplica física à estrela e ao sistema planetário. A estrela se sustenta pelo equilíbrio entre gravidade e pressão de radiação, e a cor indica temperatura. Formação estelar, evolução e meio interestelar contam a história do objeto.",
      passos: [
        "Meça cor, luminosidade e espectro da estrela.",
        "Coloque no diagrama de luminosidade e temperatura.",
        "Compare com modelo de evolução estelar.",
      ],
      exemplo:
        "Uma estrela azul tem superfície mais quente que uma vermelha, e a cor revela a temperatura. O diagrama de luminosidade e temperatura separa anã, gigante e supergigante, e a posição indica a fase da evolução. A mesma física explica o Sol e a estrela distante.",
      quebra:
        "Achar que estrela vermelha é mais quente por ser mais brilhante no céu. A cor indica temperatura, e a luminosidade depende também do tamanho. Comparar as duas grandezas sem o diagrama confunde.",
      limite:
        "O modelo de evolução depende de composição e massa, e a medida de distância entra na conta de luminosidade. Sem distância confiável, a conclusão sobre a estrela fica presa.",
      levar: "Cor é temperatura; luminosidade é tamanho e temperatura juntos.",
      maos:
        "Coloque três estrelas no diagrama de luminosidade e temperatura e classifique cada uma.",
    },
    "Cosmologia": {
      contexto:
        "Onde isso aparece: na expansão do universo, no fundo cósmico e na matéria escura. A história inteira está na radiação de fundo e na distribuição de galáxia. O modelo padrão junta expansão, matéria e energia escura.",
      oQue:
        "Cosmologia estuda origem e evolução do universo. A expansão afasta as galáxias, e o desvio para o vermelho mede a velocidade de afastamento. A radiação cósmica de fundo é o eco do universo primordial, e a formação de estrutura separa matéria escura de matéria comum.",
      passos: [
        "Meça o desvio para o vermelho da galáxia.",
        "Relacione com a distância pela lei de Hubble.",
        "Compare o resultado com o modelo de expansão.",
      ],
      exemplo:
        "O fundo cósmico tem temperatura de cerca de 2,7 kelvin e mostra flutuação minúscula que corresponde à semente da estrutura atual. O padrão das flutuações é o que sustenta o modelo com matéria escura e energia escura. A conta bate com a observação em detalhe.",
      quebra:
        "Confundir expansão com galáxia se afastando dentro do espaço. É o próprio espaço que estica, e por isso a distância cresce sem que o objeto se mova localmente. A imagem errada leva a contradição sobre velocidade.",
      limite:
        "O modelo padrão não explica o que é a matéria escura nem a energia escura. A expansão acelerada é medida, e a causa é desconhecida, então a teoria é incompleta.",
      levar: "O fundo cósmico é a foto mais antiga do universo.",
      maos:
        "Compare a temperatura do fundo cósmico com a de uma superfície conhecida.",
    },
    "Ciências Planetárias": {
      contexto:
        "Onde isso aparece: na atmosfera de Marte, no interior da Terra e no cometa. O planeta é sistema com atmosfera, superfície e interior acoplados. A missão mede o que o modelo precisa explicar.",
      oQue:
        "Ciências planetárias estudam atmosfera, superfície, interior e formação de planeta. A atmosfera tem balanço de energia e circulação, a superfície registra impacto e erosão, e o interior sustenta campo magnético e vulcão. Pequeno corpo do sistema solar guarda material primordial.",
      passos: [
        "Escolha a camada que a pergunta investiga.",
        "Combine medida remota e dado de missão.",
        "Monte o modelo de balanço ou de composição e compare.",
      ],
      exemplo:
        "Marte tem atmosfera fina e fria, e a água líquida não dura na superfície; o registro geológico mostra que já houve rio. O balanço de energia e a perda atmosférica explicam a diferença com a Terra. O planeta é o mesmo tipo de objeto com parâmetro diferente. A detecção de exoplaneta mostra o limite do método: trânsito mede raio, velocidade radial mede massa, e cada técnica enxerga uma faixa de sistema. A atmosfera do exoplaneta só aparece quando o trânsito permite medir a luz que atravessa, e a medida é minúscula.",
      quebra:
        "Explicar a atmosfera planetária só pela distância do Sol. A composição e a massa também decidem o que fica e o que escapa. A distância é parte da conta, não a conta inteira. A composição medida por espectro é a de uma camada, e o interior do planeta tem de ser inferido por modelo e por sismo.",
      limite:
        "O dado de missão é caro e esparso, e o modelo tem de preencher lacuna. A extrapolação para outro planeta exige cuidado, porque o parâmetro medido é local.",
      levar: "Planeta é sistema: atmosfera, superfície e interior respondem juntos.",
      maos:
        "Compare o balanço de energia de dois planetas com atmosferas diferentes.",
      pergunta: {
        q: "Por que Marte perdeu a água líquida da superfície?",
        a: "Porque a atmosfera fina mantém pressão baixa e a água evapora ou congela",
        why: "Pressão e temperatura baixas deixam a água instável na superfície; a perda atmosférica ao longo do tempo agravou o quadro.",
      },
    },
  },
  "physics-fundamentos": {
    "Fundamentos da Física": {
      contexto:
        "Onde isso aparece: no laboratório, na engenharia e na conta do dia a dia. Medir é comparar com padrão, e a unidade é parte do número. Análise dimensional confere a conta antes de ela ficar cara.",
      oQue:
        "Fundamentos da física fixam grandeza, unidade e medida. O Sistema Internacional define sete unidades básicas, e toda outra grandeza sai da combinação delas. Análise dimensional confere consistência, e lei de conservação dá o que não muda no processo.",
      passos: [
        "Escreva a grandeza com a unidade e o padrão usado.",
        "Reduza tudo a unidade básica antes de comparar.",
        "Confira a dimensão dos dois lados da equação.",
      ],
      exemplo:
        "A velocidade tem dimensão de comprimento por tempo; a aceleração, comprimento por tempo ao quadrado. Se uma equação de movimento soma velocidade com aceleração, a dimensão não fecha e a equação está errada antes de qualquer conta. A conferência custa segundos e evita erro grande.",
      quebra:
        "Somar grandeza de unidade diferente sem converter. Metro com centímetro, hora com segundo: o número parece certo e a resposta erra por fator conhecido. Converter antes de somar é obrigatório.",
      limite:
        "A análise dimensional confere forma, não valor. Constante adimensional não aparece na conferência, e a equação pode estar dimensionalmente certa e fisicamente errada.",
      levar: "Unidade é parte da medida, não enfeite do número.",
      maos:
        "Escreva três equações e confira a dimensão de cada lado antes de resolver.",
    },
    "Física Experimental": {
      contexto:
        "Onde isso aparece: no relatório de laboratório, no laudo de calibração e no teste de produto. A medida vem com incerteza, e o erro tem tipo. O experimento é planejado para separar efeito de ruído.",
      oQue:
        "Física experimental planeja, mede e calibra. Toda medida tem incerteza, que vem do instrumento, do método e do objeto, e o erro sistemático desloca todas as medidas para o mesmo lado. O erro aleatório varia e diminui com repetição; o sistemático só sai com calibração.",
      passos: [
        "Planeje o experimento para separar a variável de interesse do resto.",
        "Calibre o instrumento com padrão conhecido.",
        "Registre incerteza e repita para estimar a dispersão.",
      ],
      exemplo:
        "Uma balança descalibrada soma 10 gramas em toda medida: o erro é sistemático, e repetir não resolve. Já a leitura que varia entre 10,1 e 9,9 gramas é aleatória, e a média de várias medidas aproxima o valor. Separar os dois tipos decide o que corrigir.",
      quebra:
        "Repetir a medida e achar que o erro sistemático some. Repetição reduz dispersão aleatória, não desvio de calibração. A média de muitas medidas erradas continua errada. A folha de dados registra a incerteza de cada instrumento, e o relatório declara o método de calibração usado, senão o número não se reproduz. O caderno de laboratório é parte do experimento: sem ele, nem o erro nem a correção podem ser conferidos depois.",
      limite:
        "A incerteza declarada depende do modelo de erro. Em sistema com fonte não controlada, a barra pode estar subestimada, e a comparação com teoria fica falsa.",
      levar: "Erro aleatório se dilui; erro sistemático se corrige.",
      maos:
        "Meça a mesma peça dez vezes, calcule a média e a dispersão, e veja o que repete.",
      pergunta: {
        q: "Qual erro desloca todas as medidas para o mesmo lado?",
        a: "O erro sistemático, como o da balança descalibrada",
        why: "Ele vem do instrumento ou do método e não diminui com repetição; a correção vem da calibração contra padrão conhecido.",
      },
    },
    "Física Teórica": {
      contexto:
        "Onde isso aparece: no modelo climático, na teoria de partícula e no cálculo de engenharia. Teoria é modelo com previsão, e modelo efetivo vale na faixa em que foi construído. A derivação transforma princípio em número comparável.",
      oQue:
        "Física teórica formula modelo, deriva previsão e compara com medida. Princípio fundamental gera equação, e modelo efetivo descreve só a escala de interesse, ignorando o detalhe menor. A previsão precisa ser falsificável, senão não é teoria.",
      passos: [
        "Escolha o princípio e o grau de aproximação.",
        "Derive a previsão com a matemática adequada.",
        "Compare com dado e declare a faixa de validade.",
      ],
      exemplo:
        "A mecânica de Newton prevê a órbita de planeta com precisão, e a relatividade geral corrige o detalhe perto de massa grande. Nenhuma das duas é errada: cada uma vale na faixa em que foi testada. Trocar de modelo sem declarar a faixa confunde precisão com verdade.",
      quebra:
        "Tratar modelo efetivo como descrição final. O modelo foi construído para uma escala e generaliza mal fora dela. A extrapolação sem teste é palpite com equação.",
      limite:
        "Toda teoria tem faixa de validade. Fora dela, a previsão diverge ou perde sentido, e a física procura modelo mais geral, não conserto do antigo. O modelo efetivo é o que a engenharia usa todo dia, e a faixa de validade vai escrita no manual. Extrapolar para fora dela e apresentar como previsão é o erro que a revisão por pares pega rápido.",
      levar: "Teoria é modelo com faixa: prever e declarar onde vale.",
      maos:
        "Compare a previsão de dois modelos na mesma faixa e veja onde eles se separam.",
      pergunta: {
        q: "O que é um modelo efetivo em física?",
        a: "Um modelo que vale numa faixa de escala e ignora o detalhe fora dela",
        why: "O modelo efetivo resume o que importa na escala de interesse; fora dessa faixa, os graus de liberdade ignorados voltam a pesar e a previsão perde validade.",
      },
    },
    "Física Computacional": {
      contexto:
        "Onde isso aparece: na previsão de tempo, no projeto de carro e no ensaio de material. A conta substitui o experimento caro, e o passo escolhido muda o resultado. Simulação é ferramenta com erro declarado.",
      oQue:
        "Física computacional resolve equação por simulação numérica: diferença finita, Monte Carlo, dinâmica molecular e elemento finito. A escolha do passo muda o resultado, e o passo menor reduz o erro de discretização ao custo de mais conta. A validação contra caso conhecido é parte do método.",
      passos: [
        "Escolha o método pela equação e pela escala.",
        "Diminua o passo até o resultado estabilizar.",
        "Valide com caso de solução conhecida.",
      ],
      exemplo:
        "Numa simulação de queda com passo de um segundo, a velocidade muda aos saltos e o resultado desvia; com passo de um centésimo, a curva se aproxima da solução exata. Diminuir o passo até o número não mudar mais é o teste de convergência. Sem esse teste, o resultado é chute com cara de conta.",
      quebra:
        "Escolher o passo pelo tempo de máquina e não pelo erro. Passo grande acelera a conta e distorce o resultado, e a diferença só aparece na comparação. O teste de convergência não é opcional.",
      limite:
        "Passo menor custa mais e nem sempre aumenta a precisão: arredondamento e modelo podem dominar. Existe passo ótimo, e a busca é parte do trabalho.",
      levar: "Simulação converge quando o resultado para de mudar com o passo.",
      maos:
        "Rode a mesma simulação com dois passos e compare a diferença no ponto final.",
    },
    "História, Filosofia e Fundamentos Conceituais": {
      contexto:
        "Onde isso aparece: no debate sobre determinismo, na interpretação da quântica e no ensino da física. A pergunta é o que a lei física afirma sobre o mundo. Causalidade, espaço e tempo mudaram de sentido com a relatividade e a quântica.",
      oQue:
        "História e filosofia da física estudam como a teoria nasceu e o que ela afirma. Causalidade e determinismo dizem que o estado presente determina o futuro pelas leis, e a mecânica quântica tensiona essa ideia. A interpretação escolhe como contar a história, e a previsão segue igual.",
      passos: [
        "Identifique o problema conceitual que a teoria respondeu.",
        "Separe o que é previsão do que é interpretação.",
        "Veja que experiência separaria as alternativas.",
      ],
      exemplo:
        "A relatividade mostrou que simultaneidade depende do referencial, e o conceito de tempo absoluto caiu. A equação não mudou de resultado por causa da filosofia; o que mudou foi o que se entende por tempo. Conceito e medida caminham juntos. A história mostra teoria substituída por outra mais geral, e o que fica é o limite em que a antiga continua valendo. Sem separar previsão de interpretação, o debate vira opinião e perde o vínculo com o experimento.",
      quebra:
        "Tomar interpretação como consequência da equação. A equação prevê probabilidade, e a interpretação diz o que isso significa. Confundir as duas transforma debate filosófico em resultado experimental.",
      limite:
        "A filosofia não decide a física, e a física não resolve toda questão conceitual. Enquanto o experimento não separa, a escolha é de coerência e de linguagem.",
      levar: "Teoria prevê; interpretação diz o que a previsão significa.",
      maos:
        "Descreva duas interpretações da medida quântica e veja que previsão as distingue.",
      pergunta: {
        q: "O que o princípio da causalidade afirma na física clássica?",
        a: "Que o estado presente determina o estado futuro pelas leis do movimento",
        why: "Na mecânica clássica, condição inicial e lei determinam a trajetória; a mecânica quântica mantém a evolução determinística do estado, mas a medida devolve resultado probabilístico.",
      },
    },
  },
  "physics-mecanica": {
    "Cinemática": {
      contexto:
        "Onde isso aparece: no carro que freia, na bola lançada e no vídeo que mede movimento. A cinemática descreve sem perguntar a causa. Posição, velocidade e aceleração são a mesma história em três derivadas.",
      oQue:
        "Cinemática descreve o movimento sem perguntar a causa. Posição, velocidade e aceleração se ligam por derivada e integral, e a trajetória é o caminho no espaço. No ponto mais alto do lançamento vertical, a velocidade é zero e a aceleração continua a da gravidade.",
      passos: [
        "Escolha o referencial e o sentido positivo.",
        "Escreva a função de posição ou a equação do movimento.",
        "Derive para velocidade e aceleração e confira o sinal.",
      ],
      exemplo:
        "Uma bola lançada para cima a 20 metros por segundo sobe cerca de 20 metros e volta em quatro segundos. No topo, a velocidade é zero, e a aceleração continua 9,8 metros por segundo ao quadrado para baixo. É a aceleração que faz a bola voltar, não a velocidade.",
      quebra:
        "Achar que no ponto mais alto a aceleração também é zero. A velocidade é zero por um instante, e a gravidade continua agindo. Confundir os dois leva a concluir que a bola pararia no ar.",
      limite:
        "A descrição supõe aceleração conhecida e referencial inercial. Com resistência do ar ou referencial acelerado, a equação simples deixa de valer e a conta precisa de termo extra.",
      levar: "No topo a velocidade zera; a aceleração não.",
      maos:
        "Meça a altura máxima de um lançamento e compare com a previsão sem resistência do ar.",
    },
    "Dinâmica": {
      contexto:
        "Onde isso aparece: no freio do carro, no elevador e no foguete. A força muda o movimento, e a massa mede a resistência à mudança. Ação e reação atuam em corpos diferentes, e é isso que permite o avanço.",
      oQue:
        "Dinâmica liga força, massa e movimento pelas três leis de Newton. Sem força resultante, a velocidade não muda; com força, a aceleração é proporcional e inversamente proporcional à massa. Ação e reação têm mesmo módulo e sentido oposto, em corpos diferentes.",
      passos: [
        "Isole o corpo e desenhe as forças que atuam nele.",
        "Some as forças e aplique a segunda lei.",
        "Verifique se cada ação tem reação em outro corpo.",
      ],
      exemplo:
        "Num elevador que sobe acelerando, a normal é maior que o peso, e a pessoa sente-se mais pesada. Se o cabo arrebenta, a aceleração é a da gravidade e a normal é zero: a sensação é de flutuar. A mesma pessoa, forças diferentes.",
      quebra:
        "Somar ação e reação no mesmo corpo. As duas atuam em corpos distintos e não se cancelam. Colocá-las no mesmo diagrama de forças produz equilíbrio que não existe.",
      limite:
        "As leis valem em referencial inercial. Em referencial acelerado, aparece força fictícia, e a conta precisa somá-la para funcionar.",
      levar: "Força muda velocidade; massa mede a resistência a mudar.",
      maos:
        "Desenhe as forças num elevador subindo e descendo e compare a normal com o peso.",
    },
    "Mecânica Analítica": {
      contexto:
        "Onde isso aparece: no pêndulo duplo, na órbita e no robô articulado. Trocar força por energia simplifica o problema com vínculo. A lagrangiana organiza a conta, e a simetria dá a lei de conservação. A formulação hamiltoniana troca a coordenada por posição e momento, e o espaço de fase mostra o retrato do sistema de uma vez, sem resolver equação por equação. O preço é abstração: a coordenada deixa de ser distância e passa a ser o que o vínculo permite.",
      oQue:
        "Mecânica analítica reformula a dinâmica por energia e coordenada generalizada. A lagrangiana é diferença entre energia cinética e potencial, e a equação de Euler-Lagrange dá o movimento. O princípio da ação estacionária escolhe a trajetória, e simetria gera conservação pelo teorema de Noether.",
      passos: [
        "Escolha as coordenadas generalizadas que respeitam o vínculo.",
        "Escreva a lagrangiana em termos delas.",
        "Aplique Euler-Lagrange e identifique a simetria.",
      ],
      exemplo:
        "No pêndulo simples, a coordenada é o ângulo, e a lagrangiana já embute o vínculo do fio. A equação que sai é mais curta que a conta com força e tensão. Com o comprimento fixo, a simetria de rotação não gera conservação porque o vínculo quebra a translação.",
      quebra:
        "Escrever a lagrangiana com coordenada que não respeita o vínculo. A conta fica maior e a equação errada. A escolha da coordenada é a metade do trabalho.",
      limite:
        "O formalismo supõe vínculo ideal e força conservativa. Com atrito ou vínculo não holonômico, entra termo extra, e a forma simples não fecha.",
      levar: "Trocar força por energia é trocar a conta por uma mais curta.",
      maos:
        "Escreva a lagrangiana do pêndulo simples e compare com a conta por força.",
      pergunta: {
        q: "O que a mecânica analítica troca em relação à newtoniana?",
        a: "Força e vetor por energia e coordenada generalizada",
        why: "A lagrangiana descreve o sistema com vínculo já embutido e gera a equação de movimento por derivação, o que simplifica problema com restrição.",
      },
    },
    "Mecânica dos Corpos Rígidos": {
      contexto:
        "Onde isso aparece: na roda, no giroscópio e no equilíbrio da ponte. Rotação tem inércia própria, e o torque faz o papel da força. O momento de inércia depende de onde a massa está.",
      oQue:
        "Mecânica do corpo rígido estuda rotação, torque e momento de inércia. O torque é força vezes braço, e o momento de inércia mede a resistência à rotação, dependendo da distribuição de massa. O giroscópio conserva o eixo e sustenta o equilíbrio.",
      passos: [
        "Identifique o eixo de rotação e o momento de inércia.",
        "Calcule o torque resultante.",
        "Aplique a segunda lei na forma angular e confira o equilíbrio.",
      ],
      exemplo:
        "Uma roda de bicicleta girando segura a bicicleta em pé: o momento angular conserva a direção do eixo, e o giroscópio resiste à mudança. Já uma porta gira mais fácil quando empurrada longe da dobradiça, porque o braço do torque aumenta. A mesma força, efeito diferente. A patinadora que recolhe os braços gira mais rápido porque o momento angular se conserva e o momento de inércia diminui; a energia cinética de rotação cresce à custa do trabalho dos braços. O mesmo princípio estabiliza a bicicleta e orienta o satélite.",
      quebra:
        "Usar massa no lugar de momento de inércia na conta de rotação. Dois corpos com a mesma massa giram diferente se a massa está distribuída de outro jeito. A distribuição importa.",
      limite:
        "O corpo rígido ideal não deforma. Em estrutura real, a deformação entra e a conta de corpo rígido vira aproximação, que falha perto de ressonância.",
      levar: "Na rotação, a massa conta pelo lugar onde está.",
      maos:
        "Compare o giro de duas rodas de mesma massa com raios diferentes.",
      pergunta: {
        q: "Por que o momento de inércia depende da distribuição de massa?",
        a: "Porque a massa longe do eixo resiste mais à rotação",
        why: "O momento de inércia soma massa vezes distância ao quadrado do eixo; por isso duas rodas de mesma massa giram diferente se o raio muda.",
      },
    },
    "Mecânica Celeste": {
      contexto:
        "Onde isso aparece: na órbita de satélite, na maré e no calendário. A gravidade organiza o movimento, e a órbita é consequência da lei. O problema de dois corpos tem solução fechada, o de três não.",
      oQue:
        "Mecânica celeste aplica gravitação a órbita. A lei da gravitação explica da queda da maçã ao período dos planetas, e a terceira lei de Kepler relaciona período orbital e raio. O problema de dois corpos tem solução exata; o de três é caótico em geral.",
      passos: [
        "Escreva a força gravitacional e a energia do sistema.",
        "Relacione período e raio pela terceira lei de Kepler.",
        "Verifique perturbação quando houver mais de dois corpos.",
      ],
      exemplo:
        "Um satélite em órbita baixa dá a volta em cerca de 90 minutos; na órbita geoestacionária, em 24 horas. O período cresce com o raio elevado a três meios, e é isso que a terceira lei de Kepler diz. A conta vale para planeta, lua e satélite.",
      quebra:
        "Achar que a órbita depende da massa do satélite. No problema de dois corpos, a trajetória depende da massa central; o satélite pequeno segue a mesma órbita. A confusão leva a esperar órbita diferente para corpo mais pesado.",
      limite:
        "A solução exata vale para dois corpos. Com terceiro corpo, a órbita perturba e o sistema pode ficar caótico, como no caso de três corpos, e a previsão de longo prazo se perde.",
      levar: "A gravidade é a mesma que faz a maçã cair e o planeta girar.",
      maos:
        "Calcule o período de um satélite em duas altitudes e compare com a terceira lei de Kepler.",
    },
    "Oscilações e Ondas Mecânicas": {
      contexto:
        "Onde isso aparece: no pêndulo do relógio, na corda do instrumento e no prédio que balança. A oscilação tem frequência própria, e a ressonância amplia. Onda é oscilação que viaja. A velocidade da onda depende do meio, e a frequência é do emissor; juntas, elas determinam o comprimento de onda. Numa corda, a tensão e a densidade linear decidem a velocidade, e o instrumento afina por isso. A ressonância de uma corda também depende do comprimento, e é ela que separa o harmônico que se ouve.",
      oQue:
        "Oscilação é movimento periódico em torno de equilíbrio. O movimento harmônico tem frequência própria, o amortecimento reduz a amplitude e a ressonância acontece quando a frequência externa bate com a natural. Onda mecânica é a oscilação que se propaga no meio.",
      passos: [
        "Identifique a força restauradora e a frequência natural.",
        "Veja o amortecimento e a fonte externa.",
        "Compare a frequência da fonte com a natural.",
      ],
      exemplo:
        "Um pêndulo de um metro oscila com período de cerca de dois segundos, e o relógio de pêndulo usa isso. Se o empurrão vier no ritmo do período, a amplitude cresce: é ressonância. A mesma conta explica o prédio que balança com o vento.",
      quebra:
        "Achar que ressonância sempre aumenta a amplitude até quebrar. O amortecimento limita o ganho, e a frequência de ressonância desloca. Sem amortecimento, a conta diverge no papel e não representa o real.",
      limite:
        "O modelo linear vale para amplitude pequena. Com amplitude grande, o pêndulo deixa de ser harmônico, e a frequência depende da amplitude.",
      levar: "Ressonância é a frequência certa encontrando a estrutura certa.",
      maos:
        "Meça o período de um pêndulo de dois comprimentos e compare com a previsão.",
      pergunta: {
        q: "O que acontece na ressonância?",
        a: "A amplitude cresce porque a frequência externa bate com a natural",
        why: "A energia entra em fase com a oscilação e se acumula; o amortecimento limita o crescimento, mas o ganho ainda é grande.",
      },
    },
    "Mecânica do Contínuo": {
      contexto:
        "Onde isso aparece: na viga da ponte, no escoamento do rio e na previsão de onda. O meio é contínuo, e a conta usa densidade e tensão. A equação de conservação vale para cada volume pequeno. Sólido e fluido entram no mesmo esquema: muda a constitutiva, que no fluido liga tensão à taxa de deformação, e não à deformação. A conta do escoamento precisa ainda da condição de contorno e da hipótese de incompressibilidade, e cada uma altera o resultado. A malha de cálculo precisa acompanhar o gradiente: onde o escoamento muda rápido, o elemento tem de ser menor.",
      oQue:
        "Mecânica do contínuo trata meio como distribuição contínua de massa. Tensão e deformação descrevem o esforço, e a conservação de massa, momento e energia gera as equações do movimento. A equação constitutiva liga tensão e deformação do material.",
      passos: [
        "Escolha o volume de controle e as grandezas conservadas.",
        "Escreva as equações de conservação.",
        "Aplique a equação constitutiva do material.",
      ],
      exemplo:
        "Numa viga sob carga, a tensão cresce na parte tracionada e na comprimida; a equação constitutiva do aço liga essa tensão à deformação. O dimensionamento usa a tensão admissível, e o cálculo é o mesmo que sustenta a ponte e o eixo do motor.",
      quebra:
        "Tratar o material como rígido ideal e ignorar a deformação. A estrutura real deforma, e a tensão concentra em canto e furo. Ignorar isso subestima o risco.",
      limite:
        "A equação constitutiva linear vale para pequena deformação. Com deformação grande, plasticidade ou fratura, a conta muda e o modelo linear não serve.",
      levar: "Contínuo é meio com tensão: conservar e relacionar pelo material.",
      maos:
        "Desenhe a distribuição de tensão numa viga e marque tração e compressão.",
      pergunta: {
        q: "O que a equação constitutiva faz na mecânica do contínuo?",
        a: "Liga a tensão à deformação do material",
        why: "As equações de conservação valem para qualquer meio; a constitutiva diz como aquele material responde ao esforço e fecha o sistema.",
      },
    },
  },
  "chem-fundamentos": {
    "Conceitos Fundamentais": {
      contexto:
        "Onde isso aparece: na fórmula do remédio, no rótulo do sal e no exame de sangue. Átomo é a unidade, elemento é o tipo, e a combinação faz a substância. Isótopo e íon mudam massa e carga sem trocar o elemento.",
      oQue:
        "Conceitos fundamentais fixam átomo, elemento, isótopo, íon e molécula. Elemento é definido pelo número de prótons, isótopo varia o nêutron, e íon varia o elétron, o que muda a carga. A molécula é o conjunto ligado, e a fórmula resume a composição.",
      passos: [
        "Conte prótons para identificar o elemento.",
        "Veja nêutrons para o isótopo e elétrons para a carga.",
        "Escreva a fórmula e confira a neutralidade da espécie.",
      ],
      exemplo:
        "O sódio tem onze prótons; o íon sódio tem onze prótons e dez elétrons, e por isso carga mais um. Já o cloro tem dezessete prótons, e o íon cloreto tem dezoito elétrons. O cloreto de sódio junta os dois em proporção um para um, e a fórmula mostra o equilíbrio. A carga total do composto é sempre zero, e é por isso que a proporção entre os íons não é escolha.",
      quebra:
        "Chamar de elemento qualquer átomo parecido. Isótopo tem massa diferente e continua sendo o mesmo elemento; íon tem carga e também. O critério é o próton, não a massa nem a carga.",
      limite:
        "A definição vale para átomo isolado. Em sólido metálico e em plasma, os elétrons não pertencem a um átomo só, e a contagem de carga fica distribuída.",
      levar: "Próton diz o elemento; nêutron diz a massa; elétron diz a carga.",
      maos:
        "Escreva três espécies com o mesmo elemento e identifique isótopo e íon em cada uma.",
      pergunta: {
        q: "O que distingue um íon de um átomo neutro?",
        a: "O número de elétrons, que difere do número de prótons",
        why: "O próton identifica o elemento e não muda na ionização; ganhar ou perder elétron cria a carga e mantém o elemento.",
      },
    },
    "Estrutura Atômica": {
      contexto:
        "Onde isso aparece: na tabela periódica, no isótopo do carbono e no laser. O núcleo concentra a massa, e o elétron ocupa orbital. A configuração eletrônica explica a ligação e o espectro.",
      oQue:
        "Estrutura atômica descreve núcleo e elétron. O núcleo tem próton e nêutron, e o elétron ocupa orbital com número quântico. Isótopo tem mesmo número de prótons e nêutrons diferentes, e a configuração eletrônica decide a química.",
      passos: [
        "Conte prótons e nêutrons do núcleo.",
        "Distribua os elétrons pelos orbitais pela ordem de energia.",
        "Veja a camada de valência e a tendência de ganhar ou perder elétron.",
      ],
      exemplo:
        "O carbono-12 e o carbono-14 têm seis prótons cada e seis ou oito nêutrons. A química é a mesma, e a massa muda; por isso o carbono-14 serve para datar. A configuração eletrônica idêntica explica a química igual. A massa diferente aparece na densidade e na velocidade de difusão, e a datação explora exatamente isso.",
      quebra:
        "Achar que isótopo é outro elemento. O número de prótons não muda, e a tabela periódica coloca os dois no mesmo lugar. Confundir massa com identidade erra a classificação.",
      limite:
        "O modelo de orbital funciona bem para átomo isolado. Em átomo pesado, efeito relativístico e correlação eletrônica mexem nos níveis e a conta simples precisa de correção.",
      levar: "Isótopo muda massa, não elemento.",
      maos:
        "Compare o número de nêutrons de dois isótopos do mesmo elemento.",
    },
    "Ligações Químicas": {
      contexto:
        "Onde isso aparece: no sal de cozinha, no diamante e no metal do fio. A diferença de eletronegatividade decide o tipo de ligação. Tipo de ligação explica ponto de fusão, condução e solubilidade.",
      oQue:
        "Átomos se ligam para baixar energia. A ligação é iônica quando a diferença de eletronegatividade é grande, covalente quando é pequena, e metálica quando os elétrons circulam pela rede. A estrutura de Lewis mostra os elétrons de valência.",
      passos: [
        "Compare a eletronegatividade dos átomos.",
        "Decida o tipo de ligação e desenhe a estrutura de Lewis.",
        "Relacione o tipo com a propriedade observada.",
      ],
      exemplo:
        "O sódio doa elétron e o cloro recebe: a diferença de eletronegatividade é grande, a ligação é iônica, e o sólido conduz quando fundido. Já o carbono com carbono compartilha par, a ligação é covalente, e o diamante não conduz. O tipo explica a diferença.",
      quebra:
        "Classificar a ligação pela aparência ou pelo nome do composto. O critério é a diferença de eletronegatividade e a estrutura. Chamar todo composto de metal de iônico erra a propriedade.",
      limite:
        "A fronteira entre iônica e covalente é gradual. Ligação com diferença intermediária tem caráter misto, e a classificação rígida simplifica demais.",
      levar: "Ligação é elétron compartilhado, doado ou solto na rede.",
      maos:
        "Compare a diferença de eletronegatividade de três pares e classifique a ligação.",
    },
    "Estequiometria": {
      contexto:
        "Onde isso aparece: na receita industrial, na dose do fármaco e no rendimento do processo. A equação balanceada dá a proporção, e o mol é a ponte entre massa e número de partícula. O reagente limitante decide quanto produto sai.",
      oQue:
        "Estequiometria conta matéria em mol. A equação balanceada dá a proporção exata entre reagente e produto, e a massa molar converte massa em mol. O reagente limitante é o que se esgota primeiro, e o rendimento compara o produto obtido com o previsto.",
      passos: [
        "Balanceie a equação e escreva as proporções.",
        "Converta a massa dada em mol e veja quem é o limitante.",
        "Calcule o produto teórico e compare com o obtido.",
      ],
      exemplo:
        "Na síntese da água, dois mol de hidrogênio reagem com um de oxigênio e formam dois de água. Se você tem três mol de hidrogênio e um de oxigênio, o oxigênio limita, e o produto é dois mol. O hidrogênio sobra, e o rendimento se calcula sobre o produto previsto.",
      quebra:
        "Calcular o produto pelo reagente que está em maior quantidade. O limitante é o que se esgota primeiro, e escolher o outro superestima o rendimento. A comparação em mol resolve.",
      limite:
        "A conta supõe reação completa e pura. Reação lateral, impureza e perda mecânica reduzem o rendimento, e o processo real soma esses fatores.",
      levar: "A equação dá a proporção; o limitante decide quanto sai.",
      maos:
        "Calcule o produto teórico de uma reação com dois reagentes e identifique o limitante.",
    },
    "Estados e Propriedades da Matéria": {
      contexto:
        "Onde isso aparece: no gelo, no gás do botijão e no fluido supercrítico da extração. O estado depende de temperatura e pressão, e a mudança não troca a substância. A propriedade coletiva explica o comportamento.",
      oQue:
        "Estados e propriedades descrevem sólido, líquido, gás e fluido supercrítico. A mudança de estado conserva a substância e altera o arranjo e a energia; a temperatura e a pressão decidem o estado. A propriedade da matéria vem da interação entre as partículas.",
      passos: [
        "Identifique a substância e as condições de temperatura e pressão.",
        "Localize o estado no diagrama de fase.",
        "Veja a energia envolvida na mudança de estado.",
      ],
      exemplo:
        "A água ferve a 100 graus ao nível do mar e a cerca de 70 graus no alto da montanha, porque a pressão muda. No ponto triplo, os três estados coexistem. O diagrama de fase mostra o mapa, e a mesma água segue o mapa. A energia de cada transição é medida pela quantidade de calor trocada, e o patamar de temperatura durante a fusão mostra que a energia vai para romper a organização, não para esquentar. O mesmo raciocínio explica por que o suor resfria: a evaporação leva energia embora, e a pele cede calor para a mudança de estado.",
      quebra:
        "Achar que a mudança de estado altera a substância. Vapor e gelo são água, com arranjo e energia diferentes. Confundir estado com identidade química leva a conclusão errada sobre reação.",
      limite:
        "O diagrama de fase descreve substância pura. Mistura tem faixa de temperatura e composição variável, e o mapa simples não basta.",
      levar: "Mudança de estado muda o arranjo, não a substância.",
      maos:
        "Desenhe o diagrama de fase da água e marque os pontos de fusão e ebulição.",
      pergunta: {
        q: "O que uma mudança de estado conserva?",
        a: "A substância; mudam o arranjo e a energia",
        why: "Vapor, água e gelo têm a mesma composição química; a transição altera a organização das partículas e troca energia, sem criar substância nova.",
      },
    },
  },
  "chem-inorganica": {
    "Química dos Elementos": {
      contexto:
        "Onde isso aparece: na pilha, no vidro e no catalisador. A tabela periódica organiza tendência, e a posição prevê comportamento. Raio, eletronegatividade e reatividade mudam em direção previsível.",
      oQue:
        "Química dos elementos estuda grupo e período da tabela. A eletronegatividade cresce para a direita e para cima, o raio cresce para a esquerda e para baixo, e a reatividade segue a tendência. Metal de transição tem orbital d e cor própria.",
      passos: [
        "Localize o elemento no grupo e no período.",
        "Compare a tendência com os vizinhos.",
        "Relacione a posição com a reação observada.",
      ],
      exemplo:
        "O flúor é o mais eletronegativo, e o césio o menos; por isso o fluoreto puxa elétron com força. O raio do sódio é maior que o do cloro, e o íon sódio é menor que o átomo porque perdeu camada. A posição na tabela explica os dois. A mesma tendência prevê qual halogênio reage mais forte e qual metal perde elétron com mais facilidade, e a previsão se confere no experimento. É assim que a tabela deixa de ser pôster e vira ferramenta de previsão.",
      quebra:
        "Decorar propriedade sem olhar a posição. A tendência permite prever o comportamento de elemento que você nunca viu. Sem ela, cada caso vira memorização solta.",
      limite:
        "A tendência tem exceção, principalmente em metais de transição e em lantanídeo. A regra orienta, e o dado medido corrige.",
      levar: "A posição na tabela prevê o comportamento do elemento.",
      maos:
        "Compare a eletronegatividade de três elementos do mesmo período e veja a direção.",
    },
    "Compostos Inorgânicos": {
      contexto:
        "Onde isso aparece: no ácido do estômago, na cal da parede e no sal do mar. Óxido, ácido, base e sal são famílias com reação típica. A nomenclatura diz a composição antes de qualquer conta.",
      oQue:
        "Compostos inorgânicos se organizam em óxido, ácido, base, sal e hidreto. Ácido doa próton, base recebe, e a neutralização produz sal e água. A nomenclatura combina os nomes dos elementos com o sufixo que indica o estado de oxidação.",
      passos: [
        "Identifique as famílias dos reagentes.",
        "Preveja o produto pela regra da família.",
        "Balanceie e confira a carga do composto.",
      ],
      exemplo:
        "Ácido clorídrico com hidróxido de sódio produz cloreto de sódio e água: a neutralização troca os pares. Já um óxido ácido com água produz ácido, e um óxido básico com água produz base. A família do reagente indica o produto antes da conta.",
      quebra:
        "Escrever fórmula sem conferir a carga. O composto precisa ser neutro, e o número de cada íon vem da carga. Ignorar isso produz fórmula que não existe.",
      limite:
        "A classificação simples não cobre composto de coordenação e polímero inorgânico. Nessas famílias a estrutura pesa mais que a regra de par, e a nomenclatura própria entra.",
      levar: "A família do reagente anuncia o produto da reação.",
      maos:
        "Preveja o produto de duas neutralizações e confira a fórmula pela carga.",
      pergunta: {
        q: "O que a reação de neutralização produz?",
        a: "Sal e água, a partir de ácido e base",
        why: "O próton do ácido e a hidroxila da base formam água, e os íons restantes se combinam no sal; a carga total fecha em zero.",
      },
    },
    "Química de Coordenação": {
      contexto:
        "Onde isso aparece: no pigmento, no catalisador e no exame de ferro no sangue. O íon central cerca-se de ligante, e a geometria decide cor e reatividade. O campo do ligante separa os níveis do metal.",
      oQue:
        "Composto de coordenação tem íon metálico central e ligante ao redor. O ligante doa par de elétron, e a geometria depende do número de coordenação. A teoria de campo ligante explica a cor pela separação dos níveis de energia do metal.",
      passos: [
        "Identifique o metal, o estado de oxidação e o ligante.",
        "Conte a coordenação e preveja a geometria.",
        "Veja a separação de campo e a cor resultante.",
      ],
      exemplo:
        "O íon cobre em solução aquosa aparece azul porque os ligantes de água separam os níveis do metal e a absorção cai no vermelho. Trocar o ligante muda a separação e a cor. É por isso que a mesma solução muda de tom com reagente diferente.",
      quebra:
        "Tratar o ligante como simples espectador. Ele doa elétron e muda a energia dos orbitais do metal, o que altera cor, magnetismo e reatividade. Ignorar o ligante erra a propriedade. Um ligante de campo forte separa mais os níveis e desloca a absorção, e o mesmo metal passa de azul para amarelo só trocando o parceiro. A química de coordenação é a química do que está em volta do metal.",
      limite:
        "A teoria de campo ligante é modelo, não descrição completa. Em complexo com metal pesado, o acoplamento spin-órbita pesa, e a conta simples não acerta tudo.",
      levar: "O ligante muda a energia do metal e a cor do complexo.",
      maos:
        "Compare a cor de duas soluções do mesmo metal com ligantes diferentes.",
      pergunta: {
        q: "O que o ligante faz num complexo metálico?",
        a: "Doa par de elétrons ao metal e altera a energia dos orbitais",
        why: "A doação forma a ligação de coordenação e separa os níveis do metal; a separação muda a cor, o magnetismo e a reatividade do complexo.",
      },
    },
    "Química Organometálica": {
      contexto:
        "Onde isso aparece: na catálise do plástico, no remédio e no processo industrial. A ligação carbono-metal é o motor, e o ciclo catalítico organiza a transformação. O metal segura o fragmento e muda a reatividade.",
      oQue:
        "Composto organometálico tem ligação carbono-metal e é base da catálise homogênea. O ciclo catalítico alterna estados de oxidação e etapas de inserção e eliminação. Reação de acoplamento forma ligação carbono-carbono com metal como intermediário.",
      passos: [
        "Desenhe o ciclo catalítico com os estados do metal.",
        "Veja onde o substrato entra e onde sai o produto.",
        "Confira a contagem de elétron e o estado de oxidação em cada etapa.",
      ],
      exemplo:
        "No acoplamento que forma biarila, o paládio alterna entre estados de oxidação e organiza os dois fragmentos antes de uni-los. O metal não é consumido no fim, e por isso é catalisador. A conta de elétron em cada etapa mostra se o ciclo fecha. Se o metal não volta ao estado inicial, o processo é reagente e não catalisador, e o balanço denuncia.",
      quebra:
        "Achar que o metal entra no produto. Na catálise homogênea ele volta ao estado inicial, e o produto sai sem o metal. Confundir reagente com catalisador erra o balanço.",
      limite:
        "O ciclo ideal supõe etapas limpas. Reação lateral, envenenamento e decomposição do ligante desviam o catalisador, e o rendimento cai com o tempo.",
      levar: "Metal organiza o fragmento e devolve o produto sem se gastar.",
      maos:
        "Desenhe as etapas de um ciclo catalítico e marque onde o produto sai.",
    },
    "Química Inorgânica Avançada": {
      contexto:
        "Onde isso aparece: no supercondutor, no ímã de terras raras e no catalisador de cluster. A estrutura do sólido e o arranjo de metal definem a propriedade. A química supramolecular junta as partes por interação fraca.",
      oQue:
        "Química inorgânica avançada estuda sólido, cluster, supramolécula, terra rara e bioinorgânica. Cluster tem vários átomos metálicos ligados entre si, e a propriedade coletiva difere da soma dos átomos. A terra rara entra em ímã e em luminóforo por causa do orbital f.",
      passos: [
        "Identifique a estrutura do sólido ou do cluster.",
        "Veja a ligação entre os centros metálicos.",
        "Relacione a estrutura com a propriedade de interesse.",
      ],
      exemplo:
        "Um cluster metálico de três centros tem elétrons compartilhados entre os três, e a ligação não é a soma de três ligações isoladas. É essa deslocalização que muda cor, magnetismo e reatividade. A estrutura coletiva explica o que o átomo sozinho não explica. O mesmo arranjo de três centros aparece em enzima e em catalisador industrial, e a química bioinorgânica acompanha essa ponte. O centro metálico da enzima faz catálise com a mesma lógica do catalisador de laboratório, e a estrutura é quem conta a história da seletividade. Mistura de óxido e terra rara, por sua vez, dá o ímã que sustenta o motor elétrico e o sensor de campo.",
      quebra:
        "Tratar cluster como conjunto de complexos independentes. Os centros interagem e compartilham elétron, e a propriedade é coletiva. A soma de partes erra o comportamento.",
      limite:
        "A descrição exige cálculo de estrutura eletrônica e, em muitos casos, dado de difração. Modelo simples orienta, mas não substitui a medida da estrutura real.",
      levar: "No cluster, a propriedade é dos centros juntos, não de cada um.",
      maos:
        "Desenhe um cluster de dois metais e marque os elétrons compartilhados.",
      pergunta: {
        q: "O que caracteriza um composto de cluster?",
        a: "Vários átomos metálicos ligados diretamente entre si",
        why: "A ligação metal-metal compartilha elétrons entre os centros, e a propriedade coletiva do cluster não se explica pela soma de complexos isolados.",
      },
    },
  },
  "chem-bioquimica": {
    "Biomoléculas": {
      contexto:
        "Onde isso aparece: no rótulo do alimento, no exame de sangue e no remédio. Cada classe de biomolécula tem função e estrutura própria. A ligação que monta a cadeia decide a propriedade do conjunto.",
      oQue:
        "Biomoléculas são aminoácido, carboidrato, lipídio e ácido nucleico. Cada classe tem monômero e ligação típica: aminoácido se une por ligação peptídica, açúcar por glicosídica, e nucleotídeo por fosfodiéster. A estrutura define a função. Celulose e amido são ambos polímero de glicose, e a diferença está na ligação: o corpo humano digere um e não o outro, e a mesma molécula vira alimento ou fibra. O teste de glicemia explora a velocidade de quebra: monossacarídeo sobe rápido, amido sobe devagar.",
      passos: [
        "Identifique a classe e o monômero.",
        "Veja a ligação que une as unidades.",
        "Relacione a estrutura com a função no organismo.",
      ],
      exemplo:
        "Dois aminoácidos se unem pelo grupo carboxila de um com o amino do outro, e sai água: é a ligação peptídica. A cadeia cresce e a ordem dos aminoácidos vira informação. A mesma lógica monta proteína, amido e DNA, com monômero diferente.",
      quebra:
        "Achar que a ligação é igual em todas as classes. Peptídica, glicosídica e fosfodiéster são diferentes, e a enzima que quebra uma não quebra a outra. Generalizar erra a digestão e o teste.",
      limite:
        "A estrutura simples não explica toda função. Enovelamento, modificação e interação com membrana mudam o comportamento, e a bioquímica estrutural entra aí.",
      levar: "Cada biomolécula tem monômero e ligação próprios.",
      maos:
        "Desenhe a ligação peptídica entre dois aminoácidos e marque a água que sai.",
    },
    "Estrutura e Função de Proteínas": {
      contexto:
        "Onde isso aparece: na enzima da digestão, no anticorpo e no receptor do remédio. A forma decide o encaixe, e o encaixe decide a função. Desnaturar a proteína é perder a forma e a função junto.",
      oQue:
        "Proteína tem estrutura primária, secundária, terciária e quaternária. O enovelamento leva a cadeia à forma ativa, e o sítio ativo encaixa no substrato. A enzima acelera a reação e sai livre no fim, pronta para catalisar de novo.",
      passos: [
        "Identifique a sequência e a estrutura da proteína.",
        "Localize o sítio ativo e o substrato.",
        "Veja como a forma muda com temperatura, pH ou ligante.",
      ],
      exemplo:
        "A enzima digestiva trabalha no estômago ácido e perde função no intestino, porque o pH muda a forma. Já a enzima do intestino trabalha no pH básico. A mesma cadeia, formas diferentes, funções diferentes. A enzima não muda o equilíbrio da reação: ela acelera o caminho, e o equilíbrio final continua o mesmo. A especificidade vem do encaixe: substrato de forma errada não entra no sítio ativo.",
      quebra:
        "Achar que a enzima é consumida na reação. Ela sai livre e pode repetir o ciclo; o substrato é que vira produto. Confundir enzima com reagente erra o balanço e a dose.",
      limite:
        "A forma ativa depende do ambiente. Temperatura, pH e sal alteram o enovelamento, e a atividade cai antes de a proteína se desfazer por completo.",
      levar: "Forma é função: desnaturar a proteína é desligar a máquina.",
      maos:
        "Compare a atividade de uma enzima em dois pH e veja onde ela para.",
    },
    "Metabolismo": {
      contexto:
        "Onde isso aparece: na dieta, no exercício e no exame de glicose. Metabolismo quebra para obter energia e sintetiza para construir. A via tem local próprio na célula, e o local importa.",
      oQue:
        "Metabolismo é o conjunto de reações da célula, dividido em catabolismo e anabolismo. A glicólise acontece no citoplasma e o ciclo do ácido cítrico e a fosforilação oxidativa na mitocôndria. A energia passa por transportador antes de virar ATP.",
      passos: [
        "Identifique a via e o local celular.",
        "Veja qual molécula entra e qual sai.",
        "Conte o saldo de ATP e de transportador de elétron.",
      ],
      exemplo:
        "A glicólise quebra glicose em piruvato no citoplasma e rende pouco ATP. Se houver oxigênio, o piruvato entra na mitocôndria e o saldo cresce muito na fosforilação oxidativa. Sem oxigênio, a via para na fermentação, com saldo pequeno. O oxigênio é o aceptor final da cadeia, e é ele que permite extrair o resto da energia do alimento. O ciclo do ácido cítrico também fornece intermediário para a síntese de aminoácido e de lipídio, e por isso não é só via de queima.",
      quebra:
        "Achar que toda energia da glicose sai na glicólise. A maior parte vem da cadeia de elétron, na mitocôndria. Parar a conta na primeira via subestima o rendimento.",
      limite:
        "O esquema clássico descreve célula e tecido comuns. Metabolismo varia com tecido, hormônio e condição, e o mesmo caminho tem regulação própria em cada contexto.",
      levar: "A célula quebra e constrói ao mesmo tempo, em locais diferentes.",
      maos:
        "Siga uma glicose da boca até a mitocôndria e anote o saldo em cada etapa.",
    },
    "Biologia Molecular Química": {
      contexto:
        "Onde isso aparece: no teste de paternidade, na vacina de RNA e na edição gênica. A informação está na sequência, e a química do ácido nucleico permite copiar e reparar. Erro na cópia vira mutação.",
      oQue:
        "Biologia molecular química estuda replicação, transcrição e tradução. O DNA copia pela complementaridade das bases, e o reparo corrige erro. A expressão gênica converte sequência em proteína, e a modificação química regula o processo.",
      passos: [
        "Identifique a fita molde e a base complementar.",
        "Veja a etapa: replicação, transcrição ou tradução.",
        "Acompanhe a modificação que regula a expressão.",
      ],
      exemplo:
        "Na replicação, a adenina de uma fita pareia com timina da nova, e a guanina com citosina. A enzima copia e o reparo confere. Se a cópia troca uma base e o reparo não corrige, a mutação passa para a célula filha. O RNA mensageiro leva a receita ao ribossomo, e o transportador leva o aminoácido, e é nessa tradução que a sequência vira proteína. O reparo por excisão remove a base errada e a polimerase preenche o vazio; falha nesse reparo aparece ligada a câncer, e é por isso que a enzima de reparo é alvo de estudo.",
      quebra:
        "Tratar a cópia como perfeita. A polimerase erra às vezes, e o reparo é o que mantém a taxa baixa. Ignorar o reparo superestima a estabilidade do genoma.",
      limite:
        "O modelo de complementaridade não explica toda regulação. Metilação, estrutura da cromatina e RNA regulador mudam a expressão sem mudar a sequência.",
      levar: "A informação está na sequência; a química copia, repara e regula.",
      maos:
        "Escreva a fita complementar de um trecho curto de DNA.",
      pergunta: {
        q: "O que a replicação do DNA garante?",
        a: "Que cada célula filha receba uma cópia da informação",
        why: "A complementaridade das bases permite copiar a fita molde com alta fidelidade, e o reparo corrige o erro que escapa, mantendo a informação ao longo das divisões.",
      },
    },
    "Especializações": {
      contexto:
        "Onde isso aparece: no desenvolvimento de fármaco, no laudo clínico e na membrana celular. A especialização aplica a química a um problema concreto. O candidato a remédio precisa de efeito, seletividade e segurança.",
      oQue:
        "Especializações incluem química medicinal, bioquímica clínica, enzimologia, bioquímica estrutural e de membranas. A química medicinal otimiza estrutura para melhorar efeito e reduzir toxicidade, e a clínica mede marcador para diagnóstico. Cada área usa a mesma base com pergunta própria.",
      passos: [
        "Defina a pergunta prática: efeito, diagnóstico ou estrutura.",
        "Escolha o método e o modelo adequados.",
        "Valide com dado de paciente, de ensaio ou de estrutura.",
      ],
      exemplo:
        "Na química medicinal, trocar um grupo da molécula pode aumentar a potência e piorar a solubilidade. O candidato precisa passar por absorção, metabolismo e toxicidade, e cada etapa é uma disciplina. A otimização é negociação entre propriedades, não busca de um número só. O ensaio clínico compara com controle, e o efeito precisa superar o risco para o candidato virar remédio. A bioquímica clínica usa marcador para diagnóstico precoce: a enzima do fígado no sangue indica lesão, e a leitura depende do valor de referência da população. A bioquímica de membranas, por sua vez, estuda o transporte e o receptor, e é ali que muitos fármacos agem, do anestésico ao antialérgico.",
      quebra:
        "Achar que molécula potente no tubo é remédio. Absorção, distribuição, metabolismo e excreção decidem se ela chega ao alvo. A potência é uma parte da conta.",
      limite:
        "O modelo de laboratório não representa todo paciente. População, genética e doença mudam a resposta, e o ensaio clínico é o que fecha a avaliação.",
      levar: "Remédio é molécula que chega ao alvo e sai sem estrago.",
      maos:
        "Compare duas moléculas parecidas e liste o que muda em potência e em solubilidade.",
      pergunta: {
        q: "O que a química medicinal busca ao otimizar um candidato?",
        a: "Melhorar o efeito no alvo e reduzir a toxicidade ao mesmo tempo",
        why: "A otimização negocia potência, seletividade, absorção e segurança; melhorar só um dos números pode inviabilizar o candidato.",
      },
    },
  },
  "chem-fisica": {
    "Termodinâmica Química": {
      contexto:
        "Onde isso aparece: no motor, na pilha e na reação que não acontece. Energia livre decide a espontaneidade, e entalpia e entropia puxam em direções diferentes. Reação que libera calor pode não acontecer se a desordem cair muito.",
      oQue:
        "Termodinâmica química estuda energia e espontaneidade. A energia livre de Gibbs combina entalpia e entropia, e a negativa indica reação espontânea nas condições dadas. Equilíbrio acontece quando a energia livre é mínima, e o potencial químico decide o sentido do fluxo.",
      passos: [
        "Calcule a variação de entalpia e de entropia.",
        "Combine na energia livre pela temperatura.",
        "Veja o sinal e conclua a espontaneidade nas condições reais.",
      ],
      exemplo:
        "A combustão do papel libera calor e acontece por si, porque a entropia também cresce. Já a formação de gelo libera calor e só acontece abaixo de zero, porque a entropia cai. O sinal da energia livre junta as duas tendências e responde pela condição.",
      quebra:
        "Achar que reação que libera calor acontece sempre por si. A entropia pode impedir, e a temperatura decide o peso de cada termo. Ignorar a entropia erra a previsão de espontaneidade.",
      limite:
        "A conta de energia livre padrão vale nas condições padrão. Concentração diferente desloca o equilíbrio, e a correção da atividade entra para o sistema real. O gráfico de energia livre contra a composição mostra o mínimo, e é para lá que o sistema caminha sozinho.",
      levar: "A energia livre é a soma das tendências, com peso da temperatura.",
      maos:
        "Compare a espontaneidade de duas reações com sinais diferentes de entropia.",
    },
    "Cinética Química": {
      contexto:
        "Onde isso aparece: na conserva do alimento, no catalisador do carro e no fogo. A velocidade depende da colisão eficaz, e a barreira de ativação decide a altura. Catalisador abaixa a barreira sem mudar o equilíbrio.",
      oQue:
        "Cinética estuda a velocidade da reação. A energia de ativação é a barreira a vencer, e o catalisador a reduz sem ser consumido. A temperatura aumenta a velocidade pelo aumento de colisão eficaz, e a lei de velocidade relaciona concentração e taxa.",
      passos: [
        "Meça a velocidade em várias concentrações.",
        "Determine a ordem pela lei de velocidade.",
        "Veja o efeito de temperatura e de catalisador na constante.",
      ],
      exemplo:
        "Uma reação com catalisador chega ao mesmo equilíbrio mais rápido. O catalisador não muda a quantidade final de produto, muda o tempo para chegar lá. O gráfico de energia contra o caminho mostra a barreira menor, sem mexer nos dois patamares.",
      quebra:
        "Achar que catalisador aumenta o rendimento final. Ele acelera a chegada ao equilíbrio e não desloca a posição. Confundir velocidade com rendimento é o erro clássico da cinética.",
      limite:
        "O modelo simples supõe etapa determinante única e meio homogêneo. Em catálise heterogênea, difusão e superfície entram, e a lei aparente muda. A temperatura entra pela equação de Arrhenius, e dobrar a temperatura pode multiplicar a velocidade por fator grande, porque a fração de colisão eficaz cresce rápido.",
      levar: "Catalisador muda o tempo, não o destino.",
      maos:
        "Compare a curva de energia com e sem catalisador e meça o tempo de reação.",
    },
    "Eletroquímica": {
      contexto:
        "Onde isso aparece: na pilha, na galvanoplastia e na ferrugem. A célula separa oxidação e redução para forçar o elétron pelo circuito. Ânodo oxida, cátodo reduz, e a ponte salina fecha o circuito iônico.",
      oQue:
        "Eletroquímica converte energia química em elétrica e vice-versa. No ânodo ocorre a oxidação, no cátodo a redução, e o potencial de célula positivo indica reação espontânea. A equação de Nernst corrige o potencial pela concentração.",
      passos: [
        "Identifique quem oxida e quem reduz.",
        "Some os potenciais para achar o potencial da célula.",
        "Aplique Nernst para a concentração real.",
      ],
      exemplo:
        "Na pilha de zinco e cobre, o zinco oxida no ânodo e o cobre reduz no cátodo. O potencial positivo mostra que a reação acontece por si, e o elétron caminha pelo fio. Inverter a leitura de ânodo e cátodo inverte a conclusão toda. A ponte salina não transporta elétron: ela fecha o circuito iônico, e sem ela a pilha para mesmo com os eletrodos no lugar. Na eletrólise, a fonte externa empurra a reação no sentido contrário, e o potencial aplicado precisa superar o da célula.",
      quebra:
        "Trocar ânodo e cátodo e inverter a conclusão. O ânodo é sempre onde ocorre oxidação, na pilha e na eletrólise. O nome não depende de ser positivo ou negativo.",
      limite:
        "O potencial padrão supõe concentração unitária. Fora disso, Nernst corrige; com sobretensão e queda ôhmica, a célula real entrega menos que o previsto.",
      levar: "Ânodo oxida, cátodo reduz, sempre.",
      maos:
        "Monte duas pilhas e confira o sentido do elétron pelo potencial de célula.",
    },
    "Química Quântica": {
      contexto:
        "Onde isso aparece: no espectro, na ligação e na simulação de fármaco. O elétron da molécula ocupa orbital que se espalha por vários núcleos. A conta quântica explica ligação, cor e reatividade.",
      oQue:
        "Química quântica descreve a estrutura eletrônica molecular por orbital, que é a distribuição de probabilidade do elétron. A combinação de orbitais atômicos gera ligante e antiligante, e a ocupação decide estabilidade. Método aproximado e DFT calculam a energia sem resolver a equação exata.",
      passos: [
        "Monte a geometria e escolha o método.",
        "Calcule os orbitais moleculares e a ocupação.",
        "Compare a energia com dado espectroscópico ou termoquímico.",
      ],
      exemplo:
        "Na molécula de oxigênio, a ocupação dos orbitais antiligantes explica o paramagnetismo, que a estrutura de Lewis não prevê. A conta quântica acerta o que o desenho de traço erra. É por isso que a teoria de orbital molecular entrou no lugar da regra simples. A mesma conta explica a cor do complexo: a transição entre orbitais absorve comprimento de onda específico, e a cor que sobra é a que se vê. O mesmo raciocínio vale para o semicondutor: a ocupação da banda define o gap e a cor do material. O método de cálculo é o mesmo, e a diferença está no tamanho do sistema e na aproximação escolhida.",
      quebra:
        "Tratar orbital molecular como traço de ligação. O orbital é distribuição de elétron, e a ocupação importa mais que o desenho. Contar traço e concluir magnetismo erra o caso do oxigênio.",
      limite:
        "Os métodos aproximados têm erro típico e dependem da base e do funcional. O resultado é modelo, e a validação com experimento é parte do trabalho.",
      levar: "Orbital molecular é elétron espalhado, não traço de caneta.",
      maos:
        "Compare a previsão de Lewis e de orbital molecular para o magnetismo do oxigênio.",
      pergunta: {
        q: "O que um orbital molecular descreve?",
        a: "A distribuição de probabilidade dos elétrons na molécula",
        why: "O orbital é obtido pela combinação dos orbitais atômicos e mostra onde o elétron pode estar; a ocupação desses orbitais explica ligação, cor e magnetismo.",
      },
    },
    "Química Estatística": {
      contexto:
        "Onde isso aparece: no cálculo de entropia, na constante de equilíbrio e na simulação. A função de partição resume os estados acessíveis, e dela saem as propriedades macroscópicas. A ponte entre micro e macro é estatística.",
      oQue:
        "Química estatística liga estado microscópico a propriedade macroscópica pela função de partição. A distribuição de Boltzmann diz a população dos níveis, e a função de partição gera energia, entropia e constante de equilíbrio. A dinâmica molecular amostra o estado e estima o transporte.",
      passos: [
        "Liste os estados acessíveis e a energia de cada um.",
        "Calcule a função de partição na temperatura dada.",
        "Derive a propriedade macroscópica e compare com a medida.",
      ],
      exemplo:
        "Dois isômeros com energias próximas têm população parecida na temperatura ambiente; a diferença de energia decide a razão. A função de partição de cada um entra na constante de equilíbrio. O número que parece só microscópico aparece na conta de laboratório. A entropia medida por calorimetria confere com a entropia calculada pela função de partição, e o encontro das duas é a prova do modelo. A energia livre também sai da função de partição, o que fecha a ponte entre mecânica estatística e termodinâmica. A simulação de dinâmica molecular é a mesma ideia em movimento: amostra o estado e calcula o transporte.",
      quebra:
        "Achar que a população depende só da energia. Ela depende da temperatura e do número de estados com aquela energia. Ignorar a degenerescência erra a razão entre isômeros.",
      limite:
        "A conta exige amostragem suficiente do espaço de estados. Em sistema com barreira alta, a simulação fica presa e não vê o estado de interesse, e o resultado enviesa.",
      levar: "A função de partição é a ponte entre estado e medida.",
      maos:
        "Calcule a razão de população de dois níveis com diferença de energia conhecida.",
      pergunta: {
        q: "O que a função de partição liga?",
        a: "Os estados microscópicos às propriedades macroscópicas",
        why: "Ela soma o peso de Boltzmann de cada estado acessível, e dessa soma saem energia, entropia, pressão e constante de equilíbrio na temperatura dada.",
      },
    },
    "Fenômenos Interfaciais": {
      contexto:
        "Onde isso aparece: no detergente, na tinta e no catalisador poroso. A superfície tem energia própria, e a molécula se acumula nela. Adsorção, tensão superficial e coloide explicam o que acontece na fronteira.",
      oQue:
        "Fenômenos interfaciais estudam superfície, adsorção, tensão e coloide. Adsorção prende molécula na superfície sem entrar no volume, e tensão superficial mede a energia da interface. Micela se forma quando o surfactante passa da concentração crítica.",
      passos: [
        "Identifique a interface e as fases envolvidas.",
        "Meça a adsorção em função da concentração.",
        "Veja a tensão e a formação de micela acima da crítica.",
      ],
      exemplo:
        "O detergente abaixa a tensão da água e forma micela em volta da gordura, que sai na lavagem. Abaixo da concentração crítica, não há micela e a limpeza é fraca. A curva de tensão contra concentração mostra o ponto de virada. A mesma ideia explica por que a água sobe pelo papel e por que a tinta molha a parede: a interface decide o caminho, e a química de superfície controla a molhabilidade. O surfactante tem cabeça hidrofílica e cauda hidrofóbica, e é essa dupla natureza que permite montar a micela em meio aquoso. Acima da concentração crítica, a interface some e a micela domina; abaixo, a molécula fica dispersa e a limpeza cai junto com o efeito da superfície.",
      quebra:
        "Confundir adsorção com absorção. Adsorção fica na superfície; absorção entra no volume. A confusão erra a capacidade do material e a curva de saturação.",
      limite:
        "A isoterma simples supõe superfície homogênea e camada única. Em material poroso e superfície heterogênea, a curva real desvia, e o modelo precisa de correção.",
      levar: "Na interface, a molécula muda de comportamento.",
      maos:
        "Compare a tensão da água com e sem detergente e veja o ponto de micela.",
      pergunta: {
        q: "O que a adsorção faz?",
        a: "Prende a molécula na superfície sem entrar no volume do material",
        why: "A adsorção ocupa sítio na interface e satura em certa concentração; é diferente de absorção, que penetra no volume.",
      },
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

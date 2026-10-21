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
        "A energia de colisão cresce, mas o custo e o tamanho crescem mais rápido. Há limite prático de túnel e de ímã, e é por isso que a próxima geração estuda outro esquema de aceleração.",
      levar: "Acelerador é lupa de energia: concentra para ver o que estava junto.",
      maos:
        "Compare a curvatura de partícula com carga oposta no mesmo campo e veja o que muda.",
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

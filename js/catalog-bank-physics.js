// Banco de conteúdo de Física: uma seção por área, três tópicos por área.
// Cada tópico é uma estação (página) e uma pergunta de monstro.

export const PHYSICS_BANK = {
  physics: {
    "physics-fundamentos": [
      {
        name: "Grandezas e unidades",
        def: "Medir é comparar com um padrão. O Sistema Internacional fixa sete unidades básicas, e toda outra grandeza sai da combinação delas.",
        keys: [
          "Grandeza derivada é produto ou quociente das básicas.",
          "Análise dimensional confere se uma equação faz sentido.",
          "Mudar de unidade não muda a grandeza, só o número.",
        ],
        mistake: "Somar grandezas de dimensões diferentes, como metro com segundo.",
        q: {
          q: "Para que serve a análise dimensional?",
          o: ["Conferir se os dois lados de uma equação têm a mesma dimensão", "Calcular o valor exato da medida", "Escolher o instrumento", "Corrigir o erro aleatório", "Definir o padrão de massa", "Transformar graus em radianos"],
          a: 0,
          why: "Se as dimensões não batem, a equação está errada, mesmo que os números fechem por acaso.",
        },
      },
      {
        name: "Medida e incerteza",
        def: "Toda medida tem incerteza. Ela vem do instrumento, do método e do próprio objeto, e precisa ser declarada junto com o valor.",
        keys: [
          "Erro aleatório varia para mais e para menos; repetir reduz o efeito.",
          "Erro sistemático desloca todas as medidas no mesmo sentido.",
          "Resultado se escreve com valor e incerteza na mesma unidade.",
        ],
        mistake: "Relatar muitas casas decimais que a incerteza não sustenta.",
        q: {
          q: "Qual erro desloca todas as medidas para o mesmo lado?",
          o: ["O erro sistemático", "O erro aleatório", "O erro de leitura ocasional", "A flutuação térmica", "O erro de arredondamento", "A variância"],
          a: 0,
          why: "O sistemático vem de calibração ou método, então atinge todas as medidas igualmente.",
        },
      },
      {
        name: "Física computacional",
        def: "Simulação substitui a conta impossível por passos pequenos no tempo. A escolha do passo muda o resultado.",
        keys: [
          "Passo menor custa mais tempo e reduz o erro de discretização.",
          "Método de Monte Carlo usa sorteio para estimar integrais e probabilidades.",
          "Simulação não substitui o experimento: precisa ser validada.",
        ],
        mistake: "Confiar na simulação sem comparar com nenhum dado real.",
        q: {
          q: "O que acontece ao diminuir o passo de tempo numa simulação?",
          o: ["O erro de discretização cai e o custo sobe", "O erro some sem custo", "A física muda de lei", "O resultado fica aleatório", "A simulação deixa de ser determinística", "O tempo de execução cai"],
          a: 0,
          why: "Passos menores aproximam melhor a derivada, mas exigem mais iterações.",
        },
      },
    ],
    "physics-mecanica": [
      {
        name: "Cinemática",
        def: "Cinemática descreve o movimento sem perguntar a causa: posição, velocidade e aceleração ao longo do tempo.",
        keys: [
          "Velocidade é a taxa de variação da posição.",
          "Aceleração é a taxa de variação da velocidade.",
          "Em queda livre, a aceleração é a mesma para corpos de massas diferentes, sem ar.",
        ],
        mistake: "Achar que velocidade zero implica aceleração zero.",
        q: {
          q: "No ponto mais alto de um lançamento vertical, o que é verdade?",
          o: ["A velocidade é zero e a aceleração continua a da gravidade", "Velocidade e aceleração são zero", "A aceleração é zero e a velocidade máxima", "As duas apontam para cima", "A velocidade dobra", "A aceleração inverte de sinal"],
          a: 0,
          why: "A velocidade zera por um instante, mas a gravidade continua puxando para baixo.",
        },
      },
      {
        name: "Leis de Newton",
        def: "As três leis ligam força, massa e movimento. Sem força resultante, a velocidade não muda.",
        keys: [
          "Primeira lei: inércia, o movimento continua se nada empurrar.",
          "Segunda lei: força resultante é massa vezes aceleração.",
          "Terceira lei: toda ação tem reação de mesmo módulo e sentido oposto, em corpos diferentes.",
        ],
        mistake: "Somar ação e reação no mesmo corpo e concluir que nada se move.",
        q: {
          q: "Ação e reação atuam em qual corpo?",
          o: ["Em corpos diferentes, cada um recebendo uma força", "No mesmo corpo, se anulando", "Só no corpo mais pesado", "Só no corpo em movimento", "No corpo que empurra apenas", "No centro de massa"],
          a: 0,
          why: "O par age em corpos distintos; por isso não se cancela no mesmo diagrama de forças.",
        },
      },
      {
        name: "Mecânica celeste",
        def: "A gravidade organiza órbitas. A lei da gravitação explica desde a queda da maçã até o período dos planetas.",
        keys: [
          "Força gravitacional cai com o quadrado da distância.",
          "Órbitas elípticas têm o corpo central num dos focos.",
          "A terceira lei de Kepler liga período e raio orbital.",
        ],
        mistake: "Pensar que a Lua não cai: ela cai continuamente ao redor da Terra.",
        q: {
          q: "O que a terceira lei de Kepler relaciona?",
          o: ["Período orbital e raio da órbita", "Massa e peso", "Velocidade e aceleração", "Força e energia", "Temperatura e pressão", "Carga e campo"],
          a: 0,
          why: "O quadrado do período é proporcional ao cubo do semieixo maior da órbita.",
        },
      },
    ],
    "physics-fluidos": [
      {
        name: "Hidrostática",
        def: "Em fluido em repouso, a pressão cresce com a profundidade e empurra em todas as direções.",
        keys: [
          "Pressão é força por área.",
          "A pressão cresce com a profundidade segundo a densidade do fluido.",
          "Empuxo é igual ao peso do fluido deslocado.",
        ],
        mistake: "Achar que o empuxo depende da massa do corpo e não do volume submerso.",
        q: {
          q: "Do que depende o empuxo sobre um corpo submerso?",
          o: ["Do volume de fluido deslocado e da densidade do fluido", "Da massa do corpo apenas", "Da cor do fluido", "Da forma do recipiente", "Da profundidade apenas", "Da temperatura do corpo"],
          a: 0,
          why: "O empuxo é o peso do fluido deslocado: densidade do fluido vezes volume submerso vezes gravidade.",
        },
      },
      {
        name: "Escoamento e turbulência",
        def: "Fluido em movimento pode ser laminar, em camadas, ou turbulento, com redemoinhos. A viscosidade e a velocidade decidem o regime.",
        keys: [
          "Número de Reynolds compara inércia e viscosidade.",
          "Escoamento laminar é previsível; turbulento mistura muito.",
          "Equação de Bernoulli vale em regime ideal, sem perda.",
        ],
        mistake: "Usar Bernoulli em tubulação com perda de carga e concluir energia do nada.",
        q: {
          q: "O que o número de Reynolds indica?",
          o: ["Se o escoamento tende a laminar ou turbulento", "A massa do fluido", "A pressão atmosférica", "A cor do fluido", "A altura da coluna", "O calor específico"],
          a: 0,
          why: "É a razão entre forças inerciais e viscosas; valores altos indicam turbulência.",
        },
      },
      {
        name: "Aerodinâmica",
        def: "Aerodinâmica estuda o ar em torno de corpos que se movem. Sustentação, arrasto e camada-limite explicam asas e carros.",
        keys: [
          "Sustentação vem da diferença de pressão entre as faces da asa.",
          "Arrasto cresce com o quadrado da velocidade.",
          "Camada-limite é a faixa de ar freada perto da superfície.",
        ],
        mistake: "Explicar a sustentação só pelo tempo de percurso do ar sobre as asas.",
        q: {
          q: "Como o arrasto varia com a velocidade?",
          o: ["Cresce com o quadrado da velocidade", "Fica constante", "Cresce linearmente", "Diminui com a velocidade", "Depende só da massa", "Só da altitude"],
          a: 0,
          why: "A força de arrasto é proporcional à densidade, à área e ao quadrado da velocidade.",
        },
      },
    ],
    "physics-eletronica": [
      {
        name: "Semicondutores",
        def: "Semicondutor conduz pouco em temperatura ambiente e muito quando recebe impurezas ou energia. É a base do diodo e do transistor.",
        keys: [
          "Silício puro tem banda proibida pequena.",
          "Dopagem tipo n doa elétrons; tipo p cria lacunas.",
          "Temperatura aumenta a condutividade do semicondutor.",
        ],
        mistake: "Tratar semicondutor como condutor comum: a condução depende de dopagem e temperatura.",
        q: {
          q: "O que a dopagem faz num semicondutor?",
          o: ["Aumenta a quantidade de portadores de carga", "Aumenta a resistência sempre", "Torna o material isolante", "Muda a massa do elétron", "Elimina a banda proibida", "Impede a corrente"],
          a: 0,
          why: "As impurezas doam elétrons ou criam lacunas, controlando a condutividade.",
        },
      },
      {
        name: "Junções e transistores",
        def: "A junção p-n conduz num sentido e bloqueia no outro. O transistor usa duas junções para amplificar ou chavear.",
        keys: [
          "Diodo polarizado diretamente conduz.",
          "Transistor de junção controla corrente grande com corrente pequena.",
          "Transistor de efeito de campo controla por tensão, quase sem corrente de porta.",
        ],
        mistake: "Achar que o transistor amplifica energia: ele controla um suprimento externo.",
        q: {
          q: "O que o transistor faz num amplificador?",
          o: ["Usa um sinal pequeno para controlar um sinal grande de uma fonte", "Cria energia do nada", "Converte calor em eletricidade", "Aumenta a carga elétrica", "Muda a frequência da rede", "Bloqueia toda a corrente"],
          a: 0,
          why: "A amplificação é controle: a energia vem da fonte de alimentação, não do sinal.",
        },
      },
      {
        name: "Supercondutividade",
        def: "Abaixo de certa temperatura, alguns materiais conduzem sem resistência e expulsam campo magnético.",
        keys: [
          "Resistência cai a zero abaixo da temperatura crítica.",
          "Efeito Meissner expulsa o campo magnético do interior.",
          "Correntes persistentes rodam sem fonte por muito tempo.",
        ],
        mistake: "Esperar supercondutividade em temperatura ambiente nos materiais comuns.",
        q: {
          q: "O que acontece com a resistência abaixo da temperatura crítica?",
          o: ["Vai a zero", "Dobra", "Cai pela metade", "Fica igual", "Vira infinita", "Oscila"],
          a: 0,
          why: "É a assinatura do estado supercondutor: corrente sem perda.",
        },
      },
    ],
    "physics-relatividade": [
      {
        name: "Relatividade especial",
        def: "Com a velocidade da luz constante para todos, espaço e tempo deixam de ser absolutos. Tempo dilata e comprimento contrai.",
        keys: [
          "Nada com massa chega à velocidade da luz.",
          "Tempo passa mais devagar para quem se move rápido em relação ao observador.",
          "Energia e massa se relacionam por E igual a m c ao quadrado.",
        ],
        mistake: "Somar velocidades de forma simples perto da velocidade da luz.",
        q: {
          q: "O que acontece com o tempo de um relógio em alta velocidade?",
          o: ["Passa mais devagar em relação ao observador parado", "Passa mais rápido", "Fica igual sempre", "Para completamente em qualquer velocidade", "Volta no tempo", "Depende só da massa"],
          a: 0,
          why: "É a dilatação temporal prevista pela relatividade especial, medida em múons e relógios atômicos.",
        },
      },
      {
        name: "Relatividade geral",
        def: "Gravidade é geometria: massa e energia curvam o espaço-tempo, e os corpos seguem as geodésicas dessa geometria.",
        keys: [
          "A luz encurva ao passar perto de massa.",
          "O tempo passa mais devagar em campo gravitacional forte.",
          "Equações de Einstein relacionam curvatura e energia.",
        ],
        mistake: "Pensar que a gravidade é só uma força puxando; ela é geometria do espaço-tempo.",
        q: {
          q: "Na relatividade geral, o que a gravidade é?",
          o: ["A curvatura do espaço-tempo causada por massa e energia", "Uma força magnética", "O atrito do vácuo", "O peso do éter", "A expansão do ar", "Uma aceleração constante universal"],
          a: 0,
          why: "Corpos livres seguem geodésicas na geometria curvada; não há força de gravidade no sentido newtoniano.",
        },
      },
      {
        name: "Buracos negros",
        def: "Buraco negro é região onde a curvatura é tão forte que nada escapa de dentro do horizonte de eventos.",
        keys: [
          "Horizonte de eventos é a fronteira de não retorno.",
          "Buraco negro tem massa, carga e rotação.",
          "Radiação Hawking faz o buraco evaporar muito devagar.",
        ],
        mistake: "Achar que buraco negro suga tudo como aspirador; longe dele a órbita é normal.",
        q: {
          q: "O que é o horizonte de eventos?",
          o: ["A fronteira a partir da qual nada escapa", "A superfície sólida do buraco negro", "O centro de massa", "A borda da galáxia", "O disco de matéria", "O ponto de maior temperatura"],
          a: 0,
          why: "Dentro do horizonte, a velocidade de escape supera a da luz.",
        },
      },
    ],
    "physics-quantica": [
      {
        name: "Mecânica quântica",
        def: "No mundo atômico, o estado é descrito por função de onda, e medidas devolvem valores probabilísticos.",
        keys: [
          "Energia é quantizada em níveis.",
          "Princípio da incerteza limita posição e momento ao mesmo tempo.",
          "Efeito túnel permite atravessar barreira sem energia suficiente.",
        ],
        mistake: "Imaginar o elétron como bolinha com trajetória definida dentro do átomo.",
        q: {
          q: "O que o princípio da incerteza impede?",
          o: ["Conhecer posição e momento com precisão total ao mesmo tempo", "Medir a massa", "Ver cores", "Contar elétrons", "Aquecer o sistema", "Detectar fótons"],
          a: 0,
          why: "Quanto mais precisa a posição, menos precisa pode ser a medida do momento, e vice-versa.",
        },
      },
      {
        name: "Emaranhamento",
        def: "Partículas emaranhadas formam um estado conjunto: medir uma determina correlações na outra, não importa a distância.",
        keys: [
          "O emaranhamento não transmite sinal mais rápido que a luz.",
          "Ele é recurso para criptografia e computação quântica.",
          "Medir uma parte altera o estado conjunto.",
        ],
        mistake: "Achar que emaranhamento permite mandar mensagem instantânea.",
        q: {
          q: "Por que o emaranhamento não permite comunicação instantânea?",
          o: ["O resultado da medida é aleatório; a correlação só aparece comparando", "Porque a luz é lenta", "Porque o estado se desfaz", "Porque a distância importa", "Porque a medida destrói a partícula", "Porque só funciona no vácuo"],
          a: 0,
          why: "Cada lado vê ruído; a correlação exige comparar os resultados por um canal clássico.",
        },
      },
      {
        name: "Informação quântica",
        def: "Qubit é a unidade de informação quântica: pode estar em superposição e se emaranhar com outros.",
        keys: [
          "n qubits descrevem 2 elevado a n amplitudes.",
          "Portas quânticas são transformações unitárias.",
          "Correção de erro quântico exige redundância e medições cuidadosas.",
        ],
        mistake: "Achar que um qubit guarda todos os valores ao mesmo tempo e basta lê-lo.",
        q: {
          q: "Quantas amplitudes um conjunto de 3 qubits descreve?",
          o: ["8", "3", "6", "9", "12", "2"],
          a: 0,
          why: "Cada qubit dobra o espaço de estados: 2 elevado a 3 é 8 amplitudes.",
        },
      },
    ],
    "physics-atomica": [
      {
        name: "Estrutura atômica",
        def: "O átomo tem núcleo pequeno e denso, com elétrons em orbitais ao redor. Os níveis explicam a química.",
        keys: [
          "Número atômico é a quantidade de prótons.",
          "Isótopos têm mesmo número de prótons e nêutrons diferentes.",
          "Configuração eletrônica segue ordem de energia.",
        ],
        mistake: "Achar que orbital é uma órbita circular com raio definido.",
        q: {
          q: "O que define o elemento químico?",
          o: ["O número de prótons", "O número de nêutrons", "A massa total", "O número de elétrons", "A cor do átomo", "O tamanho do núcleo"],
          a: 0,
          why: "O número atômico identifica o elemento; nêutrons diferentes geram isótopos.",
        },
      },
      {
        name: "Espectroscopia",
        def: "Cada átomo absorve e emite cores próprias, porque os níveis de energia são fixos. Isso permite identificar material à distância.",
        keys: [
          "Espectro de emissão mostra linhas brilhantes.",
          "Espectro de absorção mostra faixas escuras.",
          "Composição estelar sai da espectroscopia.",
        ],
        mistake: "Achar que espectro contínuo e de linhas são a mesma coisa.",
        q: {
          q: "O que o espectro de linhas revela?",
          o: ["A composição e os níveis de energia do material", "A distância exata", "A massa do objeto", "A cor real do gás", "A temperatura sem erro", "O tempo de exposição"],
          a: 0,
          why: "As linhas aparecem em energias específicas de cada elemento, funcionando como assinatura.",
        },
      },
      {
        name: "Átomos ultrafrios",
        def: "Resfriando átomos a temperaturas minúsculas, efeitos quânticos ficam visíveis em escala macroscópica.",
        keys: [
          "Condensado de Bose-Einstein junta muitos átomos no mesmo estado.",
          "Lasers resfriam átomos por pressão de radiação.",
          "Relógios atômicos usam transições ultraestáveis.",
        ],
        mistake: "Confundir condensado com gás comum frio: é um estado quântico coletivo.",
        q: {
          q: "O que é um condensado de Bose-Einstein?",
          o: ["Muitos átomos no mesmo estado quântico de menor energia", "Um gás que virou líquido", "Um plasma quente", "Um sólido cristalino", "Uma mistura de gases", "Um átomo isolado"],
          a: 0,
          why: "Abaixo da temperatura crítica, os átomos ocupam coletivamente o estado fundamental.",
        },
      },
    ],
    "physics-nuclear": [
      {
        name: "Radioatividade",
        def: "Núcleos instáveis decaem emitindo partículas ou radiação. O tempo de meia-vida mede a rapidez do processo.",
        keys: [
          "Alfa, beta e gama têm poderes de penetração diferentes.",
          "Meia-vida é o tempo para metade dos núcleos decair.",
          "Carbono-14 data matéria orgânica antiga.",
        ],
        mistake: "Achar que meia-vida significa que a amostra inteira decai naquele tempo.",
        q: {
          q: "O que é meia-vida?",
          o: ["O tempo para metade dos núcleos decair", "O tempo de vida do núcleo mais estável", "O tempo de meia amostra evaporar", "A metade do tempo de meia-vida anterior", "O tempo de uma reação química", "A duração da emissão gama"],
          a: 0,
          why: "É o tempo característico para a quantidade de núcleos cair à metade.",
        },
      },
      {
        name: "Modelo Padrão",
        def: "O Modelo Padrão descreve quarks, léptons e as forças forte, fraca e eletromagnética. A gravidade fica de fora.",
        keys: [
          "Prótons e nêutrons são feitos de quarks.",
          "Bósons carregam as forças: fóton, glúon, W e Z.",
          "O Higgs explica a massa das partículas elementares.",
        ],
        mistake: "Achar que o Modelo Padrão inclui gravidade.",
        q: {
          q: "Qual força fica fora do Modelo Padrão?",
          o: ["A gravidade", "A eletromagnética", "A forte", "A fraca", "A nuclear residual", "A de contato"],
          a: 0,
          why: "O Modelo Padrão descreve três interações; a gravidade ainda não está incluída.",
        },
      },
      {
        name: "Aceleradores",
        def: "Aceleradores empurram partículas a energias altas para criar colisões e revelar estrutura interna.",
        keys: [
          "Campos elétricos aceleram; campos magnéticos curvam.",
          "Detectores medem trajetória e energia dos fragmentos.",
          "Colisões recriam condições do universo primordial.",
        ],
        mistake: "Imaginar que o acelerador tira a energia do vácuo: ele injeta energia nos campos.",
        q: {
          q: "Para que servem os detectores num acelerador?",
          o: ["Medir trajetória e energia das partículas produzidas", "Acelerar as partículas", "Resfriar os ímãs", "Gerar o vácuo", "Fornecer a energia", "Limpar o feixe"],
          a: 0,
          why: "A colisão produz fragmentos; os detectores reconstroem o que aconteceu a partir deles.",
        },
      },
    ],
    "physics-condensada": [
      {
        name: "Estrutura cristalina",
        def: "Sólidos cristalinos têm átomos em rede periódica. A simetria da rede explica dureza, condutividade e anisotropia.",
        keys: [
          "Célula unitária é o bloco que se repete.",
          "Índices de Miller descrevem planos da rede.",
          "Difração de raios X revela a estrutura cristalina.",
        ],
        mistake: "Tratar sólido amorfo como cristal: vidro não tem periodicidade de longo alcance.",
        q: {
          q: "O que a difração de raios X revela?",
          o: ["A estrutura cristalina do material", "A cor do material", "A massa molar", "A temperatura", "A dureza", "A condutividade"],
          a: 0,
          why: "Os picos de difração correspondem aos planos da rede, permitindo reconstruir o arranjo atômico.",
        },
      },
      {
        name: "Bandas e magnetismo",
        def: "Em sólidos, os níveis eletrônicos formam bandas. A ocupação dessas bandas separa metal, isolante e semicondutor.",
        keys: [
          "Banda de valência cheia e gap grande dá isolante.",
          "Gap pequeno dá semicondutor.",
          "Banda parcialmente cheia dá metal.",
        ],
        mistake: "Achar que todo material que conduz um pouco é metal.",
        q: {
          q: "O que distingue isolante de metal pela teoria de bandas?",
          o: ["Ocupação da banda e tamanho do gap", "A massa dos núcleos", "A temperatura ambiente", "A cor do material", "O número de prótons", "A forma da amostra"],
          a: 0,
          why: "Metal tem banda parcialmente cheia; isolante tem gap grande sem portadores disponíveis.",
        },
      },
      {
        name: "Nanofísica",
        def: "Em escala nanométrica, superfície e efeitos quânticos dominam as propriedades. Ouro pode deixar de ser dourado.",
        keys: [
          "Razão superfície/volume cresce muito no nano.",
          "Pontos quânticos mudam de cor pelo tamanho.",
          "Efeitos quânticos passam a mandar no comportamento.",
        ],
        mistake: "Esperar que nanopartícula tenha exatamente as mesmas propriedades do material volumoso.",
        q: {
          q: "Por que nanopartículas se comportam diferente do mesmo material em volume?",
          o: ["A superfície domina e efeitos quânticos crescem", "A química muda de elemento", "A gravidade muda", "O núcleo atômico diminui", "A luz fica mais lenta", "A massa some"],
          a: 0,
          why: "Com poucos átomos, a fração na superfície e os níveis discretos alteram cor, reatividade e condutividade.",
        },
      },
    ],
    "physics-plasma": [
      {
        name: "Ionização e ondas",
        def: "Plasma é gás ionizado que responde a campos elétricos e magnéticos. É o estado mais comum do universo visível.",
        keys: [
          "Plasma conduz eletricidade e é afetado por campo magnético.",
          "Ondas de plasma têm frequência ligada à densidade de elétrons.",
          "Estrelas e descargas elétricas produzem plasma.",
        ],
        mistake: "Chamar qualquer gás quente de plasma sem ionização.",
        q: {
          q: "O que define um plasma?",
          o: ["Gás com elétrons e íons livres, condutor e sensível a campo", "Qualquer gás acima de mil graus", "Um líquido ionizado", "Um sólido condutor", "Uma mistura de gases", "Um gás em baixa pressão"],
          a: 0,
          why: "A presença de cargas livres é o que dá ao plasma condutividade e resposta coletiva aos campos.",
        },
      },
      {
        name: "Confinamento magnético",
        def: "Campos magnéticos curvam as partículas carregadas e podem prender plasma quente longe das paredes.",
        keys: [
          "Tokamak é uma câmara em forma de rosca com campo toroidal.",
          "Instabilidade pode fazer o plasma tocar a parede e esfriar.",
          "Confinamento é o desafio central da fusão.",
        ],
        mistake: "Achar que só a temperatura alta basta: sem confinamento, o plasma esfria na hora.",
        q: {
          q: "Por que o plasma precisa ficar confinado?",
          o: ["Para manter alta temperatura e densidade longe das paredes", "Para ficar mais pesado", "Para virar sólido", "Para emitir luz", "Para perder carga", "Para resfriar os ímãs"],
          a: 0,
          why: "Ao tocar a parede, o plasma esfria e a reação de fusão para.",
        },
      },
      {
        name: "Fusão controlada",
        def: "Fusão junta núcleos leves e libera energia. No Sol acontece por gravidade; na Terra precisa de plasma quente e confinado.",
        keys: [
          "Deutério e trítio são os combustíveis mais estudados.",
          "A reação libera nêutrons, que carregam a maior parte da energia.",
          "Fusão não produz resíduo radioativo de longa duração como a fissão.",
        ],
        mistake: "Confundir fusão nuclear com fusão de sólido ou de metais.",
        q: {
          q: "Qual combinação é a mais estudada para fusão na Terra?",
          o: ["Deutério e trítio", "Urânio e chumbo", "Hidrogênio e hélio neutros", "Carbono e oxigênio", "Ferro e níquel", "Nêutron e elétron"],
          a: 0,
          why: "É a reação com maior seção de choque em temperaturas alcançáveis e libera energia alta.",
        },
      },
    ],
    "physics-astro": [
      {
        name: "Física estelar",
        def: "Estrelas são esferas de plasma sustentadas pelo equilíbrio entre gravidade e pressão de radiação. A cor revela a temperatura.",
        keys: [
          "A sequência principal liga luminosidade e temperatura.",
          "Estrelas produzem energia por fusão de hidrogênio.",
          "Estrelas grandes vivem menos e terminam em explosão, ou em buraco negro.",
        ],
        mistake: "Achar que estrela vermelha é mais fria por ser pequena; a cor indica temperatura superficial.",
        q: {
          q: "O que a cor de uma estrela indica?",
          o: ["Sua temperatura superficial", "Seu tamanho exato", "Sua idade exata", "Sua distância", "Sua massa total", "Seu campo magnético"],
          a: 0,
          why: "Estrelas azuis são quentes; vermelhas, mais frias. A cor sai do espectro, não do tamanho.",
        },
      },
      {
        name: "Galáxias",
        def: "Galáxia é conjunto de estrelas, gás, poeira e matéria escura, mantido pela gravidade. A Via Láctea é uma espiral.",
        keys: [
          "Curvas de rotação indicam matéria escura.",
          "Galáxias se agrupam em aglomerados e superaglomerados.",
          "Colisões de galáxias alteram a formação de estrelas.",
        ],
        mistake: "Pensar que galáxias colidindo significa estrelas batendo: o espaço entre elas é enorme.",
        q: {
          q: "O que as curvas de rotação das galáxias sugerem?",
          o: ["A presença de matéria escura", "Que a gravidade não existe", "Que as estrelas são todas iguais", "Que a galáxia está parada", "Que o universo é pequeno", "Que há apenas gás"],
          a: 0,
          why: "A rotação observada é rápida demais para a massa visível; falta massa que não emite luz.",
        },
      },
      {
        name: "Cosmologia",
        def: "Cosmologia estuda a origem e a evolução do universo. A expansão, o fundo cósmico e a formação de estruturas contam a história.",
        keys: [
          "O universo se expande desde um estado quente e denso.",
          "Radiação cósmica de fundo é o eco do universo jovem.",
          "Idade estimada: cerca de 13,8 bilhões de anos.",
        ],
        mistake: "Imaginar o Big Bang como explosão num ponto do espaço já existente.",
        q: {
          q: "O que a radiação cósmica de fundo mostra?",
          o: ["O universo jovem, quando ficou transparente", "O centro da Via Láctea", "A superfície do Sol", "O buraco negro mais próximo", "A composição dos planetas", "A idade das estrelas atuais"],
          a: 0,
          why: "É a luz liberada quando o plasma esfriou o suficiente para os elétrons se ligarem aos núcleos.",
        },
      },
    ],
    "physics-outras": [
      {
        name: "Biofísica",
        def: "Biofísica aplica física a sistemas vivos: membranas, proteínas, forças moleculares e transporte.",
        keys: [
          "Difusão move partículas do mais concentrado ao menos concentrado.",
          "Membranas mantêm potencial elétrico nos dois lados.",
          "Proteínas mudam de forma ao receber energia ou ligante.",
        ],
        mistake: "Achar que difusão precisa de bomba; ela acontece por movimento térmico.",
        q: {
          q: "O que a difusão faz espontaneamente?",
          o: ["Espalha partículas do meio mais concentrado para o menos concentrado", "Junta partículas no mesmo ponto", "Só funciona com energia externa", "Para quando a célula morre", "Move apenas cargas elétricas", "Impede o equilíbrio"],
          a: 0,
          why: "O movimento térmico leva ao equilíbrio, sem gasto de energia da célula.",
        },
      },
      {
        name: "Física médica",
        def: "Física médica usa radiação e imagem para diagnosticar e tratar. A dose precisa ser suficiente sem ferir.",
        keys: [
          "Raios X atravessam tecidos moles e são barrados por osso.",
          "Dose é energia depositada por massa.",
          "Radioterapia concentra dose no volume do tumor.",
        ],
        mistake: "Achar que exame de imagem é sempre inofensivo e pode repetir sem critério.",
        q: {
          q: "O que a dose mede em física médica?",
          o: ["A energia de radiação depositada por massa de tecido", "O tempo do exame", "A voltagem do aparelho", "A espessura do osso", "A cor da imagem", "A temperatura do tubo"],
          a: 0,
          why: "A dose em gray mede energia absorvida por quilograma, ligada ao risco biológico.",
        },
      },
      {
        name: "Física ambiental",
        def: "Física ambiental modela clima, dispersão de poluentes, radiação solar e balanço de energia da Terra.",
        keys: [
          "Efeito estufa retém radiação infravermelha emitida pela superfície.",
          "Difusão atmosférica espalha poluentes conforme vento e estabilidade.",
          "Albedo é a fração de luz refletida por uma superfície.",
        ],
        mistake: "Confundir efeito estufa, que existe naturalmente, com camada de ozônio.",
        q: {
          q: "O que é albedo?",
          o: ["A fração da radiação que a superfície reflete", "O calor retido na atmosfera", "A quantidade de chuva", "A velocidade do vento", "A espessura da camada de ozônio", "A umidade do ar"],
          a: 0,
          why: "Superfícies claras, como gelo, refletem mais; escuras absorvem mais.",
        },
      },
    ],
  },
};

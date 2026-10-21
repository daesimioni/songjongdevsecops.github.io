// As lições dos totens gerados dentro das áreas antigas (as trilhas e as
// subáreas que o catálogo acrescentou às doze ilhas reaproveitadas). Mesma
// estrutura das lições do catálogo, com a chave sendo o id da área antiga.
export const LICOES_LEGADO = {
  "physics-em": {
    "Eletrostática": {
      oQue:
        "A trilha começa na carga parada e termina no campo em movimento. Carga elétrica cria campo, campo cria força sobre outra carga, e o potencial mede a energia por unidade de carga nesse caminho. Quando a carga se move, entra a parte magnética; quando a fonte varia, o campo se desprende e viaja. É uma história só, contada em cinco estações.",
      passos: [
        "Comece pela carga e pela força entre duas, com sinal e distância, para fixar a unidade e a direção.",
        "Descreva o campo e o potencial no ponto de interesse, sem calcular força nova em cada caso.",
        "Deixe a fonte variar: acompanhe a indução e veja o campo se desprender como onda.",
      ],
      exemplo:
        "Duas placas paralelas com cargas opostas criam, entre elas, campo quase uniforme e potencial que cai de forma linear. Uma carga de teste solta no meio sente força constante e acelera em linha reta. Se você afasta as placas mantendo a carga, o campo e o potencial mudam; se você liga e desliga a fonte rapidamente, aparece campo magnético variável e parte da energia escapa como onda. A mesma montagem didática conduz da eletrostática à radiação.",
      quebra:
        "O erro é tratar a força elétrica como ação instantânea a distância. Mexer numa carga não muda a força na outra no mesmo instante: a mudança viaja como campo. Essa visão de ação à distância funciona em problema lento e falha em antena, em óptica e em qualquer coisa que oscile rápido.",
      limite:
        "A eletrostática vale para carga parada. Quando a carga acelera, a parte magnética entra e a descrição fica incompleta sem ela. O limite está no regime, não na fórmula.",
      pergunta: {
        q: "O que a lei de Coulomb mede entre duas cargas paradas?",
        a: "A força proporcional ao produto das cargas e inversa ao quadrado da distância",
        why: "A força cresce com o produto das cargas e cai com o quadrado da distância. A direção é a da reta que une as duas, e o sinal decide se atrai ou repele.",
      },
      levar: "Campo não é truque de conta: é o que transporta a ação e leva tempo.",
      maos:
        "Desenhe numa folha o caminho carga, campo, potencial, indução e onda. Em cada seta, escreva em uma frase o que muda de uma estação para a seguinte e onde a velocidade da luz entra.",
    },
    "Potencial Elétrico": {
      oQue:
        "Potencial é altura elétrica: energia por unidade de carga. Carga positiva desce a escada do potencial e ganha energia cinética; o campo aponta para onde o potencial cai. Num circuito, a fonte é a bomba que mantém a diferença e a corrente é o que desce pelos fios. A parte magnética entra quando a carga se move, porque corrente cria campo em volta do próprio fio.",
      passos: [
        "Escolha a referência de potencial, em geral o negativo da fonte, e meça a diferença entre dois pontos.",
        "Percorra o circuito somando as quedas de potencial e confira se a soma fecha no zero.",
        "Olhe o efeito magnético da corrente: direção do campo pela regra da mão e magnitude pela distância.",
      ],
      exemplo:
        "Numa pilha de nove volts ligada a um resistor, o potencial cai nove volts ao longo do caminho. Antes do resistor, a diferença é grande; depois, caiu. A corrente é a mesma no fio inteiro, e a potência dissipada é o produto da tensão pela corrente. Em volta do fio, um campo magnético circular acompanha a corrente, e ele cresce quando a corrente cresce. Desligar a fonte derruba o potencial e o campo magnético junto.",
      quebra:
        "O erro é dizer que potencial é energia. Potencial é energia dividida pela carga, e por isso a mesma pilha move mais carga sem ter mais voltagem. Outro erro é somar tensão sem sinal: a queda e a elevação têm sentidos opostos, e ignorar isso faz o balanço não fechar.",
      limite:
        "Potencial é definido a menos de uma constante: só a diferença tem sentido físico. Escolher a referência errada não muda a física, mas muda toda conta, então fixe a referência e diga qual é.",
      pergunta: {
        q: "O que a diferença de potencial entre dois pontos mede?",
        a: "A energia por unidade de carga entre eles",
        why: "Potencial é energia dividida por carga. A diferença entre dois pontos diz quanta energia uma carga ganha ou perde ao ir de um para o outro, e é isso que a fonte mantém.",
      },
      levar: "Potencial é altura, campo é inclinação, corrente é o que desce.",
      maos:
        "Monte um circuito de uma pilha e duas lâmpadas em série, meça a tensão em cada uma e confira se a soma bate com a da pilha. Depois explique onde o potencial mais caiu.",
    },
    "Campos Elétricos": {
      oQue:
        "Campo elétrico é a grandeza que diz, em cada ponto, a força por unidade de carga. Ele existe mesmo sem carga de teste ali e carrega energia no espaço vazio. Com campo magnético junto, a força sobre uma carga em movimento é a de Lorentz, e é ela que desvia partícula, acende tela e gera corrente em gerador. Quando o campo varia, a combinação dos dois se propaga como onda.",
      passos: [
        "Desenhe o campo no ponto de interesse, com direção e sentido, antes de calcular qualquer força.",
        "Aplique a força de Lorentz somando a parte elétrica e a parte magnética, com o sinal da carga.",
        "Se a fonte varia, verifique se a mudança se propaga como onda e a que velocidade no meio.",
      ],
      exemplo:
        "Um elétron entra numa região de campo magnético uniforme com velocidade perpendicular. A força é perpendicular à velocidade, então ele descreve círculo em vez de acelerar em linha reta. Aumente o campo e o raio diminui; aumente a velocidade e o raio cresce. Se em vez de campo parado houver campo elétrico oscilando, o elétron oscila e irradia, e a energia sai como onda eletromagnética.",
      quebra:
        "O erro é separar campo elétrico e campo magnético como se fossem coisas independentes. Quem mede em um referencial vê campo elétrico onde outro vê magnético, e a divisão depende de quem observa. Tratar os dois como entidades separadas quebra na relatividade e esconde o mecanismo da onda.",
      limite:
        "A força de Lorentz descreve carga de teste em campo dado. Para o campo produzido pela própria carga em movimento, é preciso resolver o sistema junto, e é aí que entra a eletrodinâmica.",
      pergunta: {
        q: "O que a força de Lorentz sobre uma carga leva em conta?",
        a: "O campo elétrico e o campo magnético, junto com a velocidade da carga",
        why: "A parte elétrica empurra na direção do campo; a parte magnética é perpendicular à velocidade e ao campo. As duas se somam, e o sinal da carga decide o sentido.",
      },
      levar: "Elétrico e magnético são dois modos de ver o mesmo campo.",
      maos:
        "Desenhe a força sobre uma carga em três direções de velocidade num campo magnético e diga em qual caso ela é máxima e em qual é nula. Depois justifique pela fórmula de Lorentz.",
    },
  },
  "cs-arch": {
    "Arquitetura de Conjuntos de Instruções": {
      oQue:
        "A trilha trata do contrato entre software e hardware. O conjunto de instruções é a lista do que o processador promete fazer, e a microarquitetura é como ele cumpre a promessa. Em volta disso ficam pipeline, hierarquia de memória, barramento e paralelismo. Desempenho não sai de uma peça: sai do equilíbrio entre elas.",
      passos: [
        "Escreva o que a instrução promete e o que ela não promete, porque é isso que o compilador pode assumir.",
        "Meça o gargalo real do programa: conta, memória, entrada e saída ou latência de rede.",
        "Escolha onde paralelizar ou especializar, sabendo que ganho em uma parte é limitado pelo resto.",
      ],
      exemplo:
        "Dois processadores com o mesmo conjunto de instruções rodam o mesmo binário e entregam desempenho diferente. Um tem cache maior e pipeline mais profundo; o outro tem mais núcleos e barramento melhor. Num programa de conta pesada, o primeiro ganha; num programa que atende muitas conexões, o segundo ganha. O contrato é igual, a implementação não, e a escolha depende da carga.",
      quebra:
        "O erro é comparar processador só pela frequência. Ciclo mais curto não compensa espera de memória nem instrução que não cabe no pipeline. Do outro lado, mais núcleos não ajudam programa sequencial. A comparação honesta usa a carga real e o gargalo medido.",
      limite:
        "A ISA é contrato estável, e a microarquitetura muda a cada geração. Programa compilado para a ISA continua rodando; o desempenho é que muda. Compatibilidade se mede no contrato, não no tempo de execução.",
      pergunta: {
        q: "O que o conjunto de instruções define?",
        a: "As operações que o software pode pedir ao processador",
        why: "A ISA lista instruções, registradores e modos de endereçamento. O compilador escreve para esse contrato, e qualquer implementação que o cumpra roda o mesmo binário.",
      },
      levar: "O conjunto de instruções é contrato; desempenho é o que a implementação faz dele.",
      maos:
        "Pegue um mesmo programa em duas máquinas e meça tempo, uso de memória e uso de núcleo. Depois diga qual peça da arquitetura explica a diferença.",
    },
    "Microarquitetura": {
      oQue:
        "Microarquitetura é o circuito que cumpre o contrato da arquitetura. A instrução é dividida em etapas, as etapas se sobrepõem, desvios são previstos e a memória é organizada em camadas. O objetivo é um só: manter a unidade de execução ocupada, escondendo a espera de memória e o custo de decidir o próximo passo.",
      passos: [
        "Divida a instrução em etapas e desenhe o pipeline com o que cada etapa lê e escreve.",
        "Identifique a bolha: desvio mal previsto, dependência de dado ou falta de cache.",
        "Atace o gargalo com a ferramenta certa: preditor melhor, mais cache ou execução fora de ordem.",
      ],
      exemplo:
        "Num pipeline de cinco etapas, uma instrução por ciclo em regime é o ideal. Um desvio previsto errado descarta as instruções que já entraram e cria bolha de alguns ciclos. Num laço com desvio frequente, o preditor pode errar uma vez a cada muitas voltas, e o custo aparece no tempo total. A microarquitetura é a engenharia de reduzir esse desperdício sem estourar consumo e área.",
      quebra:
        "O erro é achar que mais estágios sempre melhora. Pipeline profundo aumenta a penalidade de desvio e o custo de recuperação, e ainda gasta energia. Em carga com muitos desvios imprevisíveis, o pipeline curto ganha. A decisão é medida, não deduzida do número de estágios.",
      limite:
        "Pipeline profundo ganha vazão e perde em desvio e energia. O ponto ótimo depende da carga, e não existe profundidade universal que sirva para todo programa.",
      pergunta: {
        q: "O que o pipeline ganha ao sobrepor etapas?",
        a: "Vazão de instruções concluídas, não latência de uma instrução sozinha",
        why: "Cada etapa trabalha em uma instrução diferente ao mesmo tempo. A primeira continua levando o mesmo tempo, mas o processador passa a terminar uma por ciclo em regime.",
      },
      levar: "Microarquitetura é a engenharia de esconder a espera, e a espera muda com a carga.",
      maos:
        "Desenhe um pipeline de cinco etapas e simule um laço de quatro instruções com um desvio. Conte as bolhas e calcule quantos ciclos o laço leva.",
    },
    "Processadores": {
      oQue:
        "O processador real junta tudo: previsão de desvio, memória em camadas, vários núcleos e aceleradores. O limite deixou de ser a conta e passou a ser a espera e a energia. Por isso a pergunta de projeto hoje é onde colocar o trabalho, não só como fazer a conta mais rápida.",
      passos: [
        "Meça o gargalo com contador de desempenho antes de escolher a solução.",
        "Verifique quanto do programa é paralelo de verdade, porque a parte sequencial limita o ganho.",
        "Escolha o acelerador certo para a parte que domina e mantenha a memória alimentando ele.",
      ],
      exemplo:
        "Um programa com noventa por cento do tempo em multiplicação de matrizes ganha muito com GPU, porque a parte paralela é grande e regular. O mesmo programa com muita decisão condicional ganha pouco, porque a GPU espera e o desvio atrapalha. A lei de Amdahl diz o teto: com noventa por cento paralelo, o ganho máximo é dez vezes, por mais núcleos que se comprem.",
      quebra:
        "O erro é achar que núcleo mais rápido resolve tudo. Processador rápido parado esperando memória não entrega. O outro erro é ignorar a lei de Amdahl e prometer ganho linear com o número de núcleos. A parte sequencial sempre cobra o pedágio.",
      limite:
        "A lei supõe carga fixa. Com problema maior, a parte paralela cresce e o ganho muda. A conta é ponto de partida para a decisão, não veredito sobre a máquina.",
      pergunta: {
        q: "O que a lei de Amdahl calcula?",
        a: "O ganho máximo possível com a parte paralela do programa",
        why: "O ganho é limitado pela fração sequencial. Com metade do tempo em parte sequencial, nenhuma quantidade de núcleos dobra o desempenho, porque o resto do programa espera.",
      },
      levar: "Processador rápido parado esperando memória não é rápido. A conta de ganho começa pelo gargalo medido, e só depois escolhe a peça.",
      maos:
        "Calcule o ganho máximo de um programa com oitenta por cento paralelo ao passar de um para oito núcleos. Depois diga por que o ganho medido costuma ser menor.",
    },
  },
  "chem-organic": {
    "Fundamentos de Química Orgânica": {
      oQue:
        "Química orgânica começa no carbono: quatro ligações, cadeia estável e uma variedade enorme de arranjos. Representar a molécula é metade do trabalho, porque a mesma fórmula pode esconder estruturas diferentes, com propriedades diferentes. Grupo funcional, isomeria e quiralidade são as lentes que transformam fórmula em estrutura.",
      passos: [
        "Desenhe a cadeia com todos os carbonos e hidrogênios implícitos e marque o grupo funcional.",
        "Verifique a isomeria: constitucional, geométrica e óptica, nesta ordem.",
        "Confira a estereoquímica no carbono com quatro grupos diferentes e diga se é R ou S.",
      ],
      exemplo:
        "O ácido lático tem um carbono ligado a quatro grupos diferentes: hidrogênio, hidroxila, metila e carboxila. Existem duas formas que são imagem no espelho uma da outra e não se sobrepõem. As duas têm a mesma fórmula e o mesmo ponto de fusão, e uma gira a luz para um lado e a outra para o outro. O corpo usa uma delas; a outra é quase inerte. A fórmula não distingue, o arranjo distingue.",
      quebra:
        "O erro é ignorar a estereoquímica porque o desenho no plano parece suficiente. Em fármaco, o enantiômero errado pode ser inativo ou tóxico, e a síntese que produz mistura não resolve o problema. A estrutura tridimensional é parte da identidade, não detalhe de desenho.",
      limite:
        "A nomenclatura R e S resolve a maioria dos casos, e não todos. Molécula com mais de um centro quiral precisa de descritor por centro, e a mistura tem nome próprio.",
      pergunta: {
        q: "O que a quiralidade de uma molécula exige?",
        a: "Um carbono com quatro grupos diferentes e sem plano de simetria",
        why: "Com quatro grupos distintos, a molécula e sua imagem no espelho não se sobrepõem. Os dois arranjos são enantiômeros, e podem ter efeito biológico diferente.",
      },
      levar: "Fórmula é começo; a estrutura tridimensional é a molécula.",
      maos:
        "Desenhe os dois enantiômeros do ácido lático e marque o carbono quiral com os quatro grupos. Depois diga qual propriedade física muda entre eles e qual não muda, e explique a diferença pela simetria do arranjo.",
    },
    "Classes de Compostos Orgânicos": {
      oQue:
        "A classe do composto é decidida pelo grupo funcional, e o grupo decide a propriedade: solubilidade, ponto de ebulição, acidez e reatividade. Hidrocarboneto, álcool, éter, aldeído, cetona, ácido, éster, amina e amida são famílias com comportamento próprio. Reconhecer o grupo é prever o comportamento antes de medir.",
      passos: [
        "Localize o grupo funcional na estrutura e nomeie a família.",
        "Compare a molécula com a família: polaridade, ligação de hidrogênio e tamanho da cadeia.",
        "Preveja solubilidade em água e ponto de ebulição, e confira na tabela.",
      ],
      exemplo:
        "Etano e etanol diferem por um oxigênio e um hidrogênio. O etano é gás apolar e não se dissolve em água; o etanol é líquido, faz ligação de hidrogênio e se mistura em qualquer proporção. A diferença de ponto de ebulição é enorme para uma mudança tão pequena de fórmula, e a causa é o grupo funcional, não o número de carbonos.",
      quebra:
        "O erro é decorar nome sem olhar o grupo. Quem sabe que álcool tem hidroxila prevê ligação de hidrogênio; quem só decorou a lista não prevê nada. Outro erro é achar que cadeia maior sempre ferve mais: o grupo funcional pode inverter a ordem.",
      limite:
        "A família prevê tendência, não comportamento exato. Cadeia longa, ramificação e vizinhança mudam solubilidade e ebulição dentro da mesma família.",
      pergunta: {
        q: "O que define a família de um composto orgânico?",
        a: "O grupo funcional presente na estrutura",
        why: "Álcool tem hidroxila, cetona tem carbonila, amina tem nitrogênio. O grupo decide polaridade e reatividade, e a cadeia ajusta o tamanho do efeito.",
      },
      levar: "O grupo funcional decide o comportamento; a cadeia ajusta a força do efeito, e a posição do grupo muda tudo.",
      maos:
        "Escolha três moléculas com o mesmo número de carbonos e grupos diferentes, preveja a ordem de ponto de ebulição e confira. Depois explique pela polaridade, repita com cadeias de tamanhos diferentes para separar o efeito do grupo do efeito do tamanho, e anote qual das duas variáveis mandou mais na sua previsão.",
    },
    "Mecanismos de Reação": {
      oQue:
        "Mecanismo é a história de como a reação acontece, passo a passo, com seta mostrando o movimento de elétron. Nucleófilo ataca, eletrófilo recebe, grupo sai, ligação se forma ou se rompe. Entender o mecanismo permite prever produto e explicar seletividade, em vez de memorizar reação por reação.",
      passos: [
        "Identifique quem tem elétron disponível e quem tem carga parcial positiva.",
        "Desenhe a seta curva do par de elétrons e confira a carga em cada passo.",
        "Verifique se o produto respeita octeto e se a estereoquímica faz sentido.",
      ],
      exemplo:
        "Na substituição nucleofílica, o nucleófilo ataca o carbono que carrega o grupo de saída. No mecanismo concertado, a entrada e a saída acontecem juntas e a estereoquímica inverte; no mecanismo em etapas, forma-se intermediário e a estereoquímica se mistura. A mesma equação geral produz resultados diferentes conforme o caminho, e o caminho é o mecanismo.",
      quebra:
        "O erro é desenhar seta que não representa movimento de elétron, ou seta que sai do lugar nenhum. Cada seta precisa sair de par de elétrons ou de ligação e chegar a átomo ou ligação. Mecanismo com seta errada pode até chegar ao produto certo por sorte, e não explica nada.",
      limite:
        "Mecanismo é modelo, não filmagem. Ele explica o produto e prevê estereoquímica, e pode ser refinado quando aparece dado novo. Modelo bom é o que erra de forma identificável.",
      pergunta: {
        q: "O que a seta curva representa no mecanismo?",
        a: "O movimento de um par de elétrons",
        why: "A seta sai de uma ligação ou de um par isolado e chega ao átomo ou à ligação que recebe os elétrons. Ler a seta é seguir a conta de elétron, não a intuição.",
      },
      levar: "Mecanismo é o caminho; o produto é consequência dele.",
      maos:
        "Pegue uma reação de substituição, desenhe o mecanismo com setas e explique por que a estereoquímica do produto é aquela. Depois tente o mecanismo alternativo e mostre o que mudaria.",
    },
    "Síntese Orgânica": {
      oQue:
        "Síntese é construir a molécula alvo a partir de peças disponíveis, de preferência em poucas etapas e com bom rendimento. A retrossíntese desmonta o alvo em fragmentos e revela a ligação que precisa ser formada. Planejamento também é saber o que proteger: grupo reativo que não deve participar entra bloqueado e sai depois.",
      passos: [
        "Desenhe o alvo e corte uma ligação de cada vez, imaginando reagente que a formaria.",
        "Escolha a rota com menos etapas e com reagente disponível, e marque os grupos que precisam de proteção.",
        "Escreva a sequência, incluindo desproteção e purificação, e estime o rendimento global.",
      ],
      exemplo:
        "A aspirina se forma pela reação entre ácido salicílico e anidrido acético. O ácido salicílico tem hidroxila e carboxila, e a acetilação ataca a hidroxila. Se a molécula tivesse outro grupo reativo, ele precisaria de proteção antes, e a retrossíntese mostraria onde cortar. Cada etapa perde rendimento, e uma rota de cinco etapas com noventa por cento cada entrega só metade do material inicial.",
      quebra:
        "O erro é planejar a rota sem olhar os outros grupos reativos da molécula. O reagente ataca o grupo que você quer e também o que você esqueceu, e a seletividade cai. Proteção e ordem das etapas não são detalhe de especialista: são o que faz a síntese funcionar.",
      limite:
        "Retrossíntese não garante rota viável. Reagente disponível, custo e segurança decidem a rota final, e a síntese de verdade sempre perde rendimento em cada etapa.",
      pergunta: {
        q: "Para que serve a retrossíntese?",
        a: "Para desmontar o alvo em fragmentos e achar a ligação a formar",
        why: "Cortar a molécula no lugar certo revela o reagente que formaria aquela ligação. Repetir o corte até chegar a material disponível dá a rota de trás para frente.",
      },
      levar: "Síntese é desmontar o alvo e contar o rendimento de cada etapa.",
      maos:
        "Faça a retrossíntese de uma molécula simples em duas etapas e calcule o rendimento global supondo oitenta por cento por etapa. Depois diga qual etapa vale a pena otimizar.",
    },
    "Especializações": {
      oQue:
        "As especializações são interseções da orgânica com outros assuntos: aromático com orbital, organometálico com metal, fotoquímica com luz, produtos naturais com biologia. Cada uma tem vocabulário próprio, e todas compartilham a mesma lógica de grupo funcional e mecanismo. A especialização não substitui o fundamento; ela aplica.",
      passos: [
        "Identifique a interseção que o problema pede: orbital, metal, luz, biomolécula ou superfície.",
        "Traga o conceito da outra área com a unidade certa, como energia de fóton ou número de oxidação.",
        "Volte para a estrutura orgânica e verifique se o produto faz sentido químico e estereoquímico.",
      ],
      exemplo:
        "O benzeno é estável porque os elétrons pi se espalham em orbital deslocalizado, e essa estabilidade explica por que ele substitui em vez de adicionar. Já um composto organometálico usa o metal para formar ligação carbono-metal, que é reativa de um jeito que o carbono comum não é. Em fotoquímica orgânica, a luz excita e abre caminho que o aquecimento não abriria. O mesmo esqueleto de carbono se comporta diferente conforme a interseção.",
      quebra:
        "O erro é tratar a especialização como assunto isolado e esquecer o fundamento. Quem decora reação de aromático sem entender deslocalização não prevê reatividade nova. Quem estuda organometálico sem olhar elétron não explica seletividade. A interseção é encontro, não ilha.",
      limite:
        "A regra de Hückel vale para anel plano e conjugado. Anel distorcido ou com heteroátomo exige cuidado, e a contagem de elétrons pi não é a única pergunta.",
      pergunta: {
        q: "O que a aromaticidade muda na reatividade?",
        a: "O composto substitui em vez de adicionar, para preservar a deslocalização",
        why: "A energia de deslocalização torna o anel estável. Adicionar quebraria essa estabilidade, então a reação típica troca um hidrogênio por outro grupo e mantém o anel.",
      },
      levar: "Especialização é o fundamento aplicado com outra lente.",
      maos:
        "Escolha duas especializações e escreva o que cada uma acrescenta ao mesmo esqueleto de carbono. Depois diga qual pergunta só a interseção responde.",
    },
  },
  "math-analysis": {
    "Cálculo diferencial": {
      oQue:
        "O cálculo diferencial responde a uma pergunta só: com que rapidez isto muda agora? A derivada é o limite da razão entre variação de saída e variação de entrada, e o limite é o que permite falar de taxa instantânea sem dividir por zero. Continuidade garante que a curva não salta; derivada garante que ela tem inclinação definida. Aproximação local e otimização saem as duas da mesma ideia.",
      passos: [
        "Verifique continuidade no ponto antes de derivar, porque derivada exige curva sem salto.",
        "Calcule a derivada pela regra adequada e interprete o sinal: cresce, decresce ou para.",
        "Use a derivada para achar extremo: iguale a zero, confira a segunda derivada e compare com as bordas.",
      ],
      exemplo:
        "A posição de um corpo em queda é proporcional ao quadrado do tempo. A derivada dessa posição é a velocidade, que cresce linearmente; a derivada da velocidade é a aceleração, que fica constante. Se você mede a posição em instantes próximos e calcula a razão, o valor se aproxima da velocidade instantânea conforme o intervalo encolhe. A tabela de razões é a derivada aparecendo numericamente, antes de qualquer fórmula.",
      quebra:
        "O erro é derivar sem olhar o domínio. Função com bico, como o valor absoluto, é contínua e não tem derivada no bico. Outro erro é achar que derivada zero significa mínimo: pode ser máximo ou ponto de sela. O teste da segunda derivada e a comparação com a borda do intervalo decidem o tipo.",
      limite:
        "A derivada descreve o comportamento local. Longe do ponto, a reta tangente se afasta da curva, e a aproximação linear precisa de termo de segunda ordem. O limite é o raio em que a aproximação ainda serve.",
      pergunta: {
        q: "O que a derivada de uma função num ponto mede?",
        a: "A taxa de variação instantânea naquele ponto",
        why: "A derivada é o limite da razão entre variação de saída e de entrada quando o intervalo tende a zero. Ela dá a inclinação da tangente, que é a taxa instantânea.",
      },
      levar: "Derivada é taxa instantânea: o que a reta tangente diz da curva.",
      maos:
        "Monte uma tabela de posição contra tempo, calcule a razão entre pontos vizinhos e veja o valor convergir para a velocidade. Depois derive a fórmula e compare com a tabela.",
    },
    "Cálculo integral": {
      oQue:
        "O cálculo integral responde à pergunta espelho: quanto se acumulou depois de tanto tempo? A integral definida é o limite de soma de retângulos, e a indefinida é a família de funções cuja derivada devolve o integrando. O teorema fundamental liga as duas, e é ele que permite calcular área por antiderivada em vez de somar retângulo por retângulo.",
      passos: [
        "Desenhe a região e corte em pedaços cuja área você sabe escrever, para entender o que a integral soma.",
        "Escolha a técnica: substituição, partes ou fração parcial, conforme a forma do integrando.",
        "Calcule a primitiva, aplique os limites e confira o sinal e a unidade do resultado.",
      ],
      exemplo:
        "A área sob a curva de velocidade contra tempo é a distância percorrida. Se a velocidade é constante, a área é retângulo e a conta é trivial. Se a velocidade cresce linearmente, a área é triângulo, e a integral da reta devolve a posição quadrática. A unidade confirma: velocidade em metro por segundo vezes tempo em segundo dá metro. O sinal negativo aparece quando a curva fica abaixo do eixo, e ele tem significado físico, não é enfeite.",
      quebra:
        "O erro é integrar sem olhar o domínio e a singularidade. Integral imprópria precisa de limite, e a primitiva pode explodir no ponto. Outro erro é esquecer a constante na indefinida e usá-la como se fosse definida. A constante desaparece na diferença, e quem não entende isso erra conta simples.",
      limite:
        "A integral de Riemann exige função bem comportada, e há função que ela não integra. A integral de Lebesgue amplia o alcance, e o preço é mais teoria. Para o uso comum, a diferença aparece em função com muitas descontinuidades.",
      pergunta: {
        q: "O que a integral definida calcula?",
        a: "O acúmulo da grandeza ao longo do intervalo",
        why: "A integral soma contribuições infinitesimais no intervalo. Área, distância e carga total são o mesmo cálculo com unidade diferente.",
      },
      levar: "Integral é acúmulo; derivada é taxa. O teorema fundamental diz que uma desfaz a outra.",
      maos:
        "Estime a área de uma curva com dez retângulos e depois com cem, e compare com a integral exata. A diferença entre as duas estimativas mostra o erro de discretização.",
    },
    "Cálculo multivariável": {
      oQue:
        "Com várias variáveis, a derivada vira derivada parcial e o conceito central passa a ser direção. O gradiente aponta para onde a função cresce mais rápido; divergente e rotacional descrevem como um campo se espalha e gira. Integrais múltiplas acumulam em área e volume, e os teoremas de Green, Gauss e Stokes transformam integral de fronteira em integral de interior, que é a mesma ideia do teorema fundamental em dimensão maior.",
      passos: [
        "Escolha as variáveis independentes e escreva a função no domínio, com a região desenhada.",
        "Calcule derivadas parciais e monte o gradiente; interprete a direção e o módulo.",
        "Para integrar em região, escolha a ordem de integração que deixa os limites mais simples e confira o jacobiano.",
      ],
      exemplo:
        "Numa chapa com temperatura variável, o gradiente aponta para onde o calor cresce mais rápido, e o fluxo de calor corre no sentido oposto. O divergente do fluxo diz onde há fonte ou sumidouro de calor. A integral dupla da temperatura sobre a chapa dá a temperatura média. Os três conceitos são a mesma cena vista por lentes diferentes, e é isso que o cálculo multivariável organiza.",
      quebra:
        "O erro é trocar a ordem de integração sem ajustar os limites. A região não é retângulo, e os limites de dentro dependem da variável de fora. Outro erro é esquecer o jacobiano na mudança de coordenada e obter área errada em coordenada polar.",
      limite:
        "Os teoremas exigem campo suave e fronteira bem comportada. Com canto ou singularidade, é preciso dividir a região. O resultado continua valendo por partes, desde que a conta respeite onde a hipótese falha.",
      pergunta: {
        q: "Para onde o gradiente de uma função aponta?",
        a: "Para a direção de maior crescimento da função",
        why: "O gradiente reúne as derivadas parciais e aponta para onde a função cresce mais rápido. O módulo dele é a taxa de crescimento nessa direção.",
      },
      levar: "Gradiente é a seta do crescimento; divergente e rotacional descrevem o campo.",
      maos:
        "Desenhe o gradiente de uma função simples em quatro pontos e confira a direção com a derivada parcial. Depois integre a mesma função numa região não retangular e escreva os limites.",
    },
    "Análise real": {
      oQue:
        "A análise real é o cálculo feito com rigor: cada passagem justificada por definição e teorema, sem apelo à intuição do desenho. Sequência, série, convergência e continuidade uniforme ganham definição precisa, e os teoremas de convergência dizem quando é permitido trocar limite e integral. É a fundação que sustenta o resto da matemática aplicada.",
      passos: [
        "Escreva a definição do conceito com quantificadores explícitos, sem abreviar.",
        "Teste a definição em exemplo e contraexemplo antes de usar o teorema.",
        "Verifique as hipóteses do teorema uma a uma; é ali que a prova se sustenta.",
      ],
      exemplo:
        "A sequência um sobre n converge para zero: para qualquer tolerância, existe um ponto a partir do qual todos os termos ficam dentro dela. Já a série dos inversos diverge, mesmo com termos indo a zero. O contraexemplo derruba a intuição de que termo pequeno basta. A prova de convergência da série geométrica usa a razão, e a hipótese de razão menor que um é o que faz a conta fechar.",
      quebra:
        "O erro é trocar limite e integral sem verificar convergência dominada. A troca parece innocente e produz resultado errado quando a função concentra massa. Outro erro é confundir continuidade com continuidade uniforme: a primeira é local, a segunda vale para o domínio inteiro.",
      limite:
        "A análise real clássica trabalha com espaço métrico completo. Em espaço incompleto, sequência de Cauchy pode não convergir, e a conclusão muda. O limite é a hipótese de completeza, não a definição de limite.",
      pergunta: {
        q: "O que a continuidade uniforme garante que a continuidade simples não garante?",
        a: "Que a mesma tolerância serve para todos os pontos do domínio",
        why: "Na continuidade simples, a tolerância depende do ponto. Na uniforme, existe uma só escolha que vale no domínio inteiro, e é isso que permite trocar limite e integral com segurança.",
      },
      levar: "Rigor é escrever a hipótese antes de usar o teorema.",
      maos:
        "Prove pela definição que uma sequência simples converge e escreva a escolha de N em função da tolerância. Depois tente a mesma prova para uma série divergente e veja onde ela trava.",
    },
    "Análise complexa": {
      oQue:
        "Função de variável complexa tem derivada no sentido complexo, e isso é muito mais forte que ter derivadas parciais. Holomorfia implica que a função é analítica, tem série de potência e integra por caminho de forma independente do caminho. Os teoremas de Cauchy e o cálculo de resíduos transformam integrais difíceis em contas de singularidade, e os mapeamentos conformes resolvem problema de contorno por mudança de forma.",
      passos: [
        "Verifique as condições de Cauchy-Riemann antes de chamar a função de holomorfa.",
        "Escolha o contorno que aproveita a simetria e evite a singularidade, ou cerque ela.",
        "Calcule o resíduo no polo e aplique o teorema para obter a integral.",
      ],
      exemplo:
        "A função um sobre z tem singularidade na origem e é holomorfa em todo o resto. A integral dela em volta de um círculo fechado que cerca a origem vale duas pi i, independente do raio. O resultado não depende do caminho, só de quantas voltas e de quais singularidades ficaram dentro. É esse fato que transforma integral de contorno em contagem de resíduo.",
      quebra:
        "O erro é aplicar o teorema de Cauchy com singularidade dentro do contorno. A hipótese é função holomorfa na região simplesmente conexa, e o polo quebra isso. Outro erro é confundir derivada complexa com derivada parcial e concluir holomorfia sem checar Cauchy-Riemann.",
      limite:
        "O cálculo de resíduos funciona para polo isolado. Singularidade essencial exige série de Laurent inteira, e corte de ramo exige escolher o ramo com cuidado. O método é poderoso dentro dessas hipóteses.",
      pergunta: {
        q: "O que o teorema de Cauchy diz sobre a integral de uma função holomorfa?",
        a: "Que a integral em contorno fechado é zero quando não há singularidade dentro",
        why: "Se a função é holomorfa na região simplesmente conexa, a integral ao longo de qualquer caminho fechado se anula. O valor só aparece quando há polo dentro do contorno.",
      },
      levar: "Contorno fechado conta singularidade, não mede caminho.",
      maos:
        "Calcule a integral de um sobre z em dois círculos de raios diferentes e confira que o valor é o mesmo. Depois mova o centro do círculo para fora da origem e explique o novo resultado.",
    },
    "Teoria da medida e integração": {
      oQue:
        "Medida atribui tamanho a conjunto de forma que a soma funcione em união disjunta. Com ela, a integral de Lebesgue parte de função simples e amplia o que se pode integrar. Os teoremas de convergência dizem quando limite e integral comutam, e a medida de probabilidade é o mesmo objeto com massa total um. É a linguagem que sustenta probabilidade e análise moderna.",
      passos: [
        "Defina o espaço e a sigma-álgebra dos conjuntos que recebem medida.",
        "Construa a integral por função simples e verifique convergência monótona.",
        "Aplique o teorema adequado para trocar limite e integral e confira a hipótese de dominância.",
      ],
      exemplo:
        "No intervalo de zero a um, a medida de um conjunto pode ser o comprimento. A função que vale um nos racionais e zero nos irracionais não é integrável por Riemann, porque o conjunto de descontinuidade é denso. A integral de Lebesgue dela é zero, porque o conjunto dos racionais tem medida zero. O exemplo mostra o ganho: a integral passa a ignorar conjunto de medida nula.",
      quebra:
        "O erro é supor que todo conjunto tem medida. Com axioma da escolha, existe conjunto não mensurável, e a teoria precisa excluí-lo antes de somar. Outro erro é trocar limite e integral sem dominante integrável e aceitar o resultado.",
      limite:
        "A integral de Lebesgue exige medida completa para operar com igualdade quase certa. Em espaço sem essa completude, conjunto de medida nula pode causar exceção. A hipótese é técnica e necessária.",
      pergunta: {
        q: "O que significa dizer que uma propriedade vale quase certamente?",
        a: "Que ela vale fora de um conjunto de medida nula",
        why: "O conjunto de exceção pode existir e não altera integral nem probabilidade. É o critério que a teoria da medida usa para ignorar caso isolado sem perder rigor.",
      },
      levar: "Medida nula é exceção que a integral não vê.",
      maos:
        "Mostre que um conjunto finito tem medida zero no intervalo e explique por que a integral de uma função não muda ao alterar o valor dela nesse conjunto.",
    },
    "Análise funcional": {
      oQue:
        "Análise funcional trata espaço de funções como espaço vetorial com distância, e função vira ponto. Norma mede tamanho, completude garante que sequência de Cauchy converge, e operador linear entre esses espaços generaliza matriz. A teoria espectral é a versão infinita de autovalor, e é ela que aparece na mecânica quântica e na equação diferencial.",
      passos: [
        "Escolha o espaço e a norma adequada ao problema, porque a topologia muda com ela.",
        "Verifique se o operador é limitado ou compacto antes de falar em espectro.",
        "Aplique o teorema espectral ou o ponto fixo de Banach e confira a hipótese de completude.",
      ],
      exemplo:
        "No espaço das funções contínuas com norma do máximo, a convergência é uniforme. No espaço com norma da integral, a mesma sequência pode convergir sem convergir ponto a ponto. O mesmo conjunto, duas normas, dois comportamentos. A escolha da norma não é formalidade: é ela que decide qual teorema vale.",
      quebra:
        "O erro é usar resultado de espaço de Hilbert em espaço de Banach qualquer. O produto interno dá ortogonalidade e projeção, e sem ele a conclusão cai. Outro erro é tratar operador não limitado como se fosse contínuo, o que quebra a conta de espectro.",
      limite:
        "A teoria espectral completa vale para operador autoadjunto e compacto. Fora disso, o espectro pode ser contínuo e a decomposição muda de forma. O teorema tem hipótese, e ela é o limite.",
      pergunta: {
        q: "O que a completude de um espaço normado garante?",
        a: "Que toda sequência de Cauchy converge para um ponto do espaço",
        why: "Completude é o que permite usar limite sem sair do espaço. Sem ela, a sequência se aproxima e o limite fica fora, e teorema de ponto fixo deixa de valer.",
      },
      levar: "O espaço é a norma: trocar a norma troca os teoremas.",
      maos:
        "Compare a convergência de uma sequência de funções na norma do máximo e na norma da integral e diga em qual das duas ela converge. Depois explique a diferença pela definição.",
    },
    "Análise harmônica": {
      oQue:
        "Análise harmônica decompõe função em componentes de frequência. Fourier faz isso com seno e cosseno, a transformada estende para função não periódica e a ondaleta faz a mesma ideia com janela que muda de escala. O objetivo é sempre separar o sinal no que varia devagar e no que varia rápido, e assim medir, filtrar e reconstruir.",
      passos: [
        "Escolha a ferramenta pela natureza do sinal: série para periódico, transformada para transitório, ondaleta para mudança local.",
        "Calcule os coeficientes e verifique a reconstrução com poucos termos.",
        "Interprete o espectro em frequência e relacione com o que se vê no tempo.",
      ],
      exemplo:
        "Um sinal de duas notas é a soma de duas frequências, e o espectro mostra dois picos. Se você corta a banda acima de certa frequência e reconstrói, o som muda de timbre sem perder a melodia. Se corta a fundamental, a nota desaparece e sobra o harmônico. O mesmo procedimento serve para imagem: filtro de frequência borra ou realça borda.",
      quebra:
        "O erro é analisar sinal curto e concluir frequência exata. A janela finita alarga o pico, e a resolução em frequência depende da duração. Outro erro é ignorar a fase e reconstruir só com magnitude, o que muda a forma do sinal.",
      limite:
        "A transformada de Fourier supõe sinal que decai ou é periódico. Sinal que cresce sem limite exige distribuição, e o tratamento muda. O limite é a classe de função, não a definição.",
      pergunta: {
        q: "O que a transformada de Fourier informa sobre um sinal?",
        a: "Quanto de cada frequência existe no sinal",
        why: "Ela decompõe o sinal em componentes senoidais e devolve a amplitude e a fase de cada frequência. Somar os componentes reconstrói o sinal original.",
      },
      levar: "Tempo e frequência são duas vistas do mesmo sinal.",
      maos:
        "Monte um sinal com duas frequências, olhe o espectro e depois corte uma delas. Compare o sinal antes e depois e diga o que mudou no tempo e no espectro.",
    },
    "Teoria da aproximação": {
      oQue:
        "Aproximar é trocar uma função complicada por outra que se calcula e se manipula. Interpolação passa pelos pontos, ajuste minimiza erro, e a norma decide o que é erro pequeno. A escolha do polinômio e do critério muda o resultado, e o estudo do erro diz o quanto a aproximação vale longe dos pontos conhecidos.",
      passos: [
        "Escolha o critério: passar pelos pontos ou minimizar erro em norma.",
        "Escolha a família de aproximação e verifique se ela captura o comportamento da função.",
        "Estime o erro no intervalo inteiro, não só nos pontos usados no ajuste.",
      ],
      exemplo:
        "Interpolar cinco pontos com polinômio de grau quatro acerta nos pontos e pode oscilar entre eles. Aumentar o número de pontos igualmente espaçados pode piorar a oscilação nas bordas, que é o fenômeno de Runge. A escolha de pontos de Chebyshev reduz o problema. A lição é que passar por mais pontos não garante aproximar melhor no intervalo.",
      quebra:
        "O erro é avaliar a aproximação só nos pontos de ajuste. Ali o erro é zero por construção, e a conclusão é sempre boa. Outro erro é usar grau alto sem controlar condicionamento, e a conta perde precisão por cancelamento.",
      limite:
        "O teorema de aproximação garante existência, não algoritmo estável. Em ponto flutuante, a melhor aproximação teórica pode ser instável de calcular. O limite é a aritmética real.",
      pergunta: {
        q: "O que a interpolação garante nos pontos usados no ajuste?",
        a: "Que a função aproximada passa exatamente por eles",
        why: "Interpolar é construir função que coincide nos pontos dados. Entre os pontos, o erro depende da função e do grau escolhido, e pode ser grande.",
      },
      levar: "Passar pelos pontos não é aproximar bem no intervalo.",
      maos:
        "Interpole quatro pontos com reta e com parábola, e estime o erro num ponto intermediário. Depois diga qual das duas aproximações se comporta melhor fora dos pontos.",
    },
    "Equações integrais": {
      oQue:
        "Equação integral tem a incógnita dentro da integral, e isso muda o problema. Fredholm integra em domínio fixo, Volterra integra até a variável, e o método de solução depende disso. Muitos problemas de física chegam assim, e o problema inverso é o caso em que se quer a causa a partir do efeito medido.",
      passos: [
        "Classifique a equação: Fredholm ou Volterra, linear ou não, de primeira ou segunda espécie.",
        "Escolha o método: substituição sucessiva, núcleo separável ou transformada.",
        "Verifique convergência do método e condicionamento antes de confiar na solução numérica.",
      ],
      exemplo:
        "Uma equação de Volterra com núcleo simples pode ser resolvida por derivação, porque o limite superior é a variável. A mesma equação em forma de Fredholm não permite derivar e pede outro caminho. O tipo da equação decide o método, e escolher errado leva a conta que não fecha.",
      quebra:
        "O erro é tratar problema inverso como se fosse direto. A inversa pode ser instável, e pequeno ruído na medida vira grande erro na causa. Regularização é necessária, e ignorar isso produz solução que parece precisa e não é.",
      limite:
        "A teoria de Fredholm garante solução para núcleo bem comportado e autovalor fora do espectro. Perto do autovalor, a solução explode. O limite é o espectro do operador.",
      pergunta: {
        q: "O que caracteriza uma equação de Volterra?",
        a: "A integral vai até a própria variável independente",
        why: "O limite superior variável permite derivar a equação e transformar o problema em equação diferencial. Em Fredholm, o limite é fixo e o caminho é outro.",
      },
      levar: "Equação integral é problema de operador; o tipo decide o método.",
      maos:
        "Resolva uma equação de Volterra simples derivando os dois lados e confira a solução na equação original. Depois tente o mesmo com Fredholm e mostre onde a derivada não ajuda, explicando qual propriedade do limite impede o mesmo truque.",
    },
    "Cálculo das variações": {
      oQue:
        "Cálculo das variações procura a função que torna um funcional estacionário, em vez de procurar o ponto que zera derivada. A incógnita é curva inteira, e a condição vira equação de Euler-Lagrange. É a ferramenta da mecânica analítica, da óptica e da otimização com vínculo, e a mesma estrutura aparece em qualquer problema de extremo com integral.",
      passos: [
        "Escreva o funcional com a variável, a função e a derivada dela.",
        "Aplique Euler-Lagrange e resolva a equação diferencial que sai.",
        "Confira a condição de contorno e compare a energia ou o custo com uma solução vizinha.",
      ],
      exemplo:
        "A braquistócrona é a curva de descida mais rápida entre dois pontos, e não é a reta. O funcional é o tempo total, e Euler-Lagrange devolve a cicloide. A reta minimiza distância e não minimiza tempo, porque a curva que desce rápido ganha velocidade e compensa o caminho maior. O exemplo mostra que o critério do funcional não é o critério geométrico.",
      quebra:
        "O erro é achar que estacionário significa mínimo. O funcional pode ter máximo ou ponto de sela, e a segunda variação decide. Outro erro é esquecer a condição de contorno, o que produz família de solução em vez da curva do problema.",
      limite:
        "Euler-Lagrange exige funcional diferenciável e função suave. Com quebra ou restrição desigual, entram condições de salto e multiplicador. O limite é a suavidade da solução procurada.",
      pergunta: {
        q: "O que o cálculo das variações procura?",
        a: "A função que torna um funcional estacionário",
        why: "A incógnita é a curva inteira. A condição de derivada nula do funcional gera a equação de Euler-Lagrange, que dá a função procurada.",
      },
      levar: "Variação procura a curva que extremiza o custo total.",
      maos:
        "Escreva o funcional de comprimento e de tempo para uma curva entre dois pontos. Depois mostre por que a reta vence no comprimento e perde no tempo.",
    },
    "Análise assintótica": {
      oQue:
        "Análise assintótica descreve o comportamento de função em limite, quando o valor exato não ajuda. A expansão em série diz o termo dominante e a ordem do erro, e o método perturbativo resolve problema que não tem solução fechada. O resultado não é o valor em um ponto: é a lei de escala que vale quando o parâmetro vai a zero ou ao infinito.",
      passos: [
        "Identifique a variável grande ou pequena e o parâmetro que controla o limite.",
        "Expanda em série e guarde o primeiro termo, com a ordem do resto.",
        "Valide a expansão contra solução numérica ou experimento na faixa em que ela vale.",
      ],
      exemplo:
        "Para x grande, a função raiz de x mais um se comporta como raiz de x, e a correção é da ordem de um sobre raiz de x. Guardar só o primeiro termo dá erro que parece pequeno e cresce quando x diminui. A expansão diz onde ela serve, e isso é mais útil que o valor exato em um ponto.",
      quebra:
        "O erro é usar expansão além do raio de validade. Série assintótica pode divergir e ainda ser útil nos primeiros termos, e truncar no lugar errado dá resultado pior que a aproximação grosseira. Outro erro é confundir ordem do erro com erro absoluto.",
      limite:
        "Série assintótica não converge necessariamente. O critério é o erro após truncar, não a convergência da série inteira. Por isso o número de termos bom depende do valor do parâmetro.",
      pergunta: {
        q: "O que uma expansão assintótica descreve?",
        a: "O comportamento da função num limite, com a ordem do erro",
        why: "Ela dá o termo dominante e os termos de correção quando o parâmetro vai a zero ou ao infinito. Serve para lei de escala, não para valor exato em qualquer ponto.",
      },
      levar: "Assintótica dá a lei do limite, com a ordem do erro junto.",
      maos:
        "Expanda uma função simples para x grande e compare o valor aproximado com o exato em dois valores de x. Depois diga em qual dos dois a expansão de dois termos vale mais.",
    },
  },
  "physics-thermo": {
    "Termodinâmica clássica": {
      oQue:
        "Termodinâmica clássica descreve o que acontece com energia em sistema grande, sem olhar molécula por molécula. Temperatura, calor, trabalho e energia interna são as variáveis, e as duas leis dizem o balanço e a direção. Potencial termodinâmico é a função que decide o equilíbrio em cada condição, e a transição de fase é o ponto em que a organização muda de forma.",
      passos: [
        "Defina o sistema, a fronteira e o que atravessa ela: calor, trabalho ou matéria.",
        "Escreva o balanço de energia e identifique as variáveis que ficam presas.",
        "Use o potencial adequado à condição e verifique o sentido do processo pela segunda lei.",
      ],
      exemplo:
        "Um gás preso num cilindro com pistão recebe calor e se expande. A energia interna sobe, parte vira trabalho de empurrar o pistão e o resto aparece como aumento de temperatura. Se a expansão é rápida, o processo não é quase estático e a conta de equilíbrio não vale. A escolha do caminho importa, e é por isso que a função de estado é diferente do calor trocado.",
      quebra:
        "O erro é tratar calor como função de estado. Calor e trabalho dependem do caminho, e só a energia interna e a entropia não dependem. Outro erro é aplicar equação de gás ideal em vapor perto da condensação, onde a interação entre moléculas já pesa.",
      limite:
        "A termodinâmica clássica supõe equilíbrio ou passagem lenta entre equilíbrios. Em processo rápido, a variável nem tem valor único no sistema. O limite é o regime quase estático.",
      pergunta: {
        q: "O que a primeira lei da termodinâmica afirma?",
        a: "Que a variação de energia interna é o calor recebido menos o trabalho realizado",
        why: "A energia não some: entra como calor, sai como trabalho e o resto muda a energia interna. O balanço fecha com sinal respeitado em cada termo.",
      },
      levar: "Calor e trabalho dependem do caminho; energia interna não.",
      maos:
        "Aqueça um gás com o pistão travado e depois destravado, e compare o trabalho em cada caso. Depois diga qual das duas grandezas mudou e qual ficou igual.",
    },
    "Transferência de calor": {
      oQue:
        "Transferência de calor acontece por três caminhos: condução, convecção e radiação. Condução passa de molécula para molécula no material, convecção carrega o calor com o fluido em movimento, e radiação viaja como onda eletromagnética sem precisar de meio. Isolar é escolher qual desses caminhos cortar, e quase sempre há mais de um atuando ao mesmo tempo.",
      passos: [
        "Identifique o caminho dominante: sólido parado, fluido em movimento ou superfície quente no vácuo.",
        "Calcule o fluxo com a lei do caminho dominante e compare com os outros dois.",
        "Escolha o isolamento que ataca o caminho dominante e meça de novo depois.",
      ],
      exemplo:
        "Uma parede de casa perde calor por condução, e o ar parado do lado de dentro ajuda pouco. O vidro perde por condução e por radiação, e a janela com duas camadas e gás no meio corta a condução e a convecção interna. Se o Sol bate e o vidro aquece, a radiação entra como fonte. Isolar por um caminho só resolve parte, e o resto reaparece na medição.",
      quebra:
        "O erro é isolar o caminho que parece óbvio e esquecer outro. Telhado isolado com sótão ventilado perde por convecção; parede grossa com vidro simples perde pela janela. Outro erro é confundir temperatura com fluxo: superfície muito quente e pequena pode perder menos que superfície morna e grande.",
      limite:
        "A lei de condução vale em regime estacionário e material homogêneo. Em parede com camadas e umidade, a condutividade muda e o cálculo simples erra. O limite é a uniformidade do material.",
      pergunta: {
        q: "Quais são os três caminhos de transferência de calor?",
        a: "Condução, convecção e radiação",
        why: "Condução passa pelo material, convecção leva calor com o fluido em movimento e radiação viaja como onda eletromagnética. Quase sempre mais de um atua junto.",
      },
      levar: "Isolar é cortar o caminho dominante, não todos de uma vez.",
      maos:
        "Compare o tempo de resfriamento de dois copos iguais, um encapado e um nu, e diga qual caminho o encapamento cortou. Depois repita com vento e veja a convecção entrar.",
    },
    "Mecânica estatística": {
      oQue:
        "Mecânica estatística liga o mundo microscópico ao macroscópico por contagem. Macroestado é o que se mede, como pressão e temperatura; microestado é a configuração de cada partícula. O ensemble reúne os microestados compatíveis, e a distribuição de probabilidade entre eles explica por que a grandeza macroscópica é estável. Flutuação mede o quanto ela se afasta da média.",
      passos: [
        "Defina o ensemble adequado: sistema isolado, em banho térmico ou com troca de partícula.",
        "Conte ou integre os microestados acessíveis e monte a distribuição de probabilidade.",
        "Calcule a média e a flutuação da grandeza de interesse e compare com a medida.",
      ],
      exemplo:
        "Um gás em equilíbrio tem moléculas com velocidades distribuídas em faixa larga. A distribuição de Maxwell-Boltzmann diz quantas estão em cada faixa, e a cauda de alta velocidade explica evaporação e reação química que ocorrem abaixo da energia média. A média não descreve todo mundo: parte pequena da população carrega o comportamento raro.",
      quebra:
        "O erro é usar a distribuição clássica em gás quântico degenerado. Em temperatura baixa e densidade alta, a estatística de Fermi-Dirac ou Bose-Einstein muda a conta, e a conclusão clássica erra. O limite é o regime de validade.",
      limite:
        "A contagem supõe ergodicidade, ou seja, que a média no tempo iguala a média no ensemble. Em sistema com vidro de spin ou memória longa, a igualdade falha. O limite é essa hipótese, e ela nem sempre vale.",
      pergunta: {
        q: "O que um ensemble descreve?",
        a: "A distribuição de probabilidade dos microestados compatíveis com o macroestado",
        why: "O ensemble reúne cópias do sistema com o mesmo macroestado e atribui peso a cada microestado. A média nesse conjunto dá a grandeza medida.",
      },
      levar: "Medida macroscópica é média de contagem microscópica.",
      maos:
        "Simule dez partículas com energia total fixa e conte quantas configurações deixam a energia dividida de cada jeito. Depois diga qual divisão é a mais provável e por quê. Repita com vinte partículas e veja se a distribuição fica mais estreita em torno do valor mais provável.",
    },
    "Física estatística de sistemas complexos": {
      oQue:
        "Sistemas complexos têm muitas partes que interagem, e o todo exibe comportamento que a parte não mostra. Perto do ponto crítico, correlação cresce e uma mudança pequena de parâmetro muda a fase inteira. Fora do equilíbrio aparecem processo irreversível, auto-organização e rede; e a ferramenta deixa de ser só a distribuição de equilíbrio.",
      passos: [
        "Identifique a variável de ordem e o parâmetro que a controla.",
        "Meça a correlação e o tempo de relaxação perto da transição.",
        "Trate o sistema como rede quando a interação não for local: vizinho, grau e caminho importam.",
      ],
      exemplo:
        "Num modelo de rede com contato, cada nó tem estado e muda com os vizinhos. Abaixo de certa taxa de contágio, o efeito morre; acima, atinge parte grande da rede. O ponto de transição depende da estrutura da rede, não só da média de contatos. Dois sistemas com o mesmo número médio de vizinhos podem se comportar diferente, e a topologia é a variável que faltava.",
      quebra:
        "O erro é tratar média como descrição completa. Em rede heterogênea, poucos nós concentram conexões e dominam o comportamento. Outro erro é supor equilíbrio em sistema que muda mais rápido que o tempo de relaxação.",
      limite:
        "A analogia de transição de fase vale quando há escala bem definida. Em sistema pequeno ou com ruído alto, o conceito se esfumaça e a transição suave não pode ser medida com precisão.",
      pergunta: {
        q: "O que acontece com a correlação perto de um ponto crítico?",
        a: "Ela cresce e o alcance aumenta",
        why: "Perto da transição, uma parte influencia a outra a distância maior. O tempo de relaxação também cresce, e é isso que torna o sistema lento e sensível.",
      },
      levar: "Perto do crítico, distância e tempo perdem a escala curta.",
      maos:
        "Simule uma rede pequena com regra de contágio e varra a taxa. Marque onde o efeito passa de pequeno para grande e diga o que a média escondeu. Depois troque a rede por uma com poucos nós muito conectados e compare o ponto de transição.",
    },
  },
  "physics-optics": {
    "Óptica geométrica": {
      oQue:
        "Óptica geométrica trata a luz como raio e resolve o caminho por reflexão e refração. Lente e espelho formam imagem, e a posição e o tamanho saem da equação de lente fina. Instrumento óptico é combinação de elementos que amplia, inverte ou separa imagem. A aproximação vale quando o comprimento de onda é pequeno diante do objeto.",
      passos: [
        "Desenhe o raio principal e o eixo óptico, e marque objeto, lente e imagem.",
        "Aplique a equação de lente fina e o aumento, respeitando o sinal de cada grandeza.",
        "Confira se a imagem é real ou virtual e se o resultado faz sentido no desenho.",
      ],
      exemplo:
        "Um objeto a duas distâncias focais de uma lente convergente forma imagem real do outro lado, mesma distância, invertida e do mesmo tamanho. Aproxime o objeto para dentro da distância focal e a imagem vira virtual, direita e maior, do mesmo lado. A equação muda de sinal e o desenho confirma. O mesmo instrumento serve para projetar e para ampliar, dependendo da posição.",
      quebra:
        "O erro é ignorar o sinal na equação de lente. Distância de imagem negativa significa imagem virtual, e quem descarta o sinal perde a informação principal. Outro erro é usar a aproximação paraxial em lente rápida, onde a aberração esférica já distorce a imagem.",
      limite:
        "A óptica geométrica ignora difração e interferência. Em abertura pequena ou detalhe fino, o raio não descreve o que acontece e a óptica física entra. O limite é o tamanho do comprimento de onda diante da abertura.",
      pergunta: {
        q: "O que uma lente convergente faz com raios paralelos?",
        a: "Concentra-os no ponto focal",
        why: "A refração na superfície curva desvia os raios paralelos para um ponto comum. A distância desse ponto à lente é a distância focal.",
      },
      levar: "Raio desenha o caminho; o sinal da equação diz se a imagem é real.",
      maos:
        "Com uma lente, projete a imagem de uma janela na parede e meça as distâncias. Depois mova o objeto e veja em que ponto a imagem deixa de aparecer na parede.",
    },
    "Óptica física": {
      oQue:
        "Óptica física trata a luz como onda e explica o que o raio não explica: interferência, difração e polarização. Duas ondas somam amplitude e produzem franja clara e escura conforme a diferença de caminho. Difração é o alargamento ao passar por abertura, e polarização é a direção de vibração. A coerência é o que torna a franja visível.",
      passos: [
        "Calcule a diferença de caminho entre as duas ondas que se encontram.",
        "Compare com o comprimento de onda para saber se a soma é construtiva ou destrutiva.",
        "Verifique a coerência da fonte e o tamanho da abertura antes de prever a franja.",
      ],
      exemplo:
        "Duas fendas iluminadas por luz coerente produzem franjas na tela. No centro, a diferença de caminho é zero e a franja é clara. Ao deslocar para o lado, a diferença cresce e a franja escurece quando vale meio comprimento de onda. A distância entre franjas depende do comprimento de onda e da separação das fendas, e é esse arranjo que mede comprimento de onda com precisão.",
      quebra:
        "O erro é esperar franja com fonte comum e incoerente. Sem coerência, as fases mudam rápido e o padrão se apaga. Outro erro é ignorar a largura da fenda: abertura larga alarga a difração e reduz o contraste.",
      limite:
        "A descrição ondulatória clássica perde quando a luz é fraca ao ponto de contar fóton. Aí entra a óptica quântica, e o padrão de franja aparece estatisticamente. O limite é a intensidade, não a óptica.",
      pergunta: {
        q: "O que a polarização descreve na luz?",
        a: "A direção de vibração do campo elétrico",
        why: "A onda eletromagnética vibra em direção perpendicular à propagação. O polarizador seleciona uma direção e corta a componente perpendicular.",
      },
      levar: "Franja é diferença de caminho; polarização é direção de vibração.",
      maos:
        "Olhe uma tela por dois filtros polarizadores e gire um deles. Anote o que acontece com a intensidade em cada ângulo e explique pela direção de vibração, dizendo em que posição a luz passa quase toda e em que posição ela é cortada.",
    },
    "Óptica quântica": {
      oQue:
        "Óptica quântica trata a luz como fóton e o campo como operador. A energia vem em pacote proporcional à frequência, e a emissão e a absorção são transições entre níveis. Estados não clássicos, como o comprimido e o emaranhado, não têm descrição por onda clássica, e é neles que a diferença aparece em medição.",
      passos: [
        "Determine o nível de energia e a transição que a fonte pode fazer.",
        "Calcule a energia do fóton e compare com a diferença entre níveis.",
        "Verifique se o estado é clássico ou não clássico antes de aplicar a descrição ondulatória.",
      ],
      exemplo:
        "Um átomo só absorve fóton de energia compatível com a diferença entre dois níveis. Por isso a lâmpada de sódio emite amarelo característico, e o mesmo átomo absorve essa cor. Aumentar a intensidade aumenta o número de fótons, não a energia de cada um. Se a energia não casa, nada acontece, por mais luz que incida.",
      quebra:
        "O erro é achar que intensidade substitui frequência. O fóton tem energia definida pela frequência, e a transição exige casamento. Outro erro é tratar emaranhamento como correlação clássica: a medição conjunta viola desigualdade que a correlação comum respeita.",
      limite:
        "A descrição de fóton único exige fonte e detector adequados, e o experimento é sensível a perda. Em luz intensa, a descrição clássica volta a funcionar bem. O limite é o regime de contagem.",
      pergunta: {
        q: "O que determina a energia de um fóton?",
        a: "A frequência da radiação",
        why: "A energia é proporcional à frequência, com a constante de Planck. Dobrar a frequência dobra a energia de cada fóton, independente da intensidade.",
      },
      levar: "Fóton tem energia pela frequência; intensidade muda a quantidade.",
      maos:
        "Compare a cor de duas fontes e diga qual tem fóton mais energético. Depois explique por que a mais fraca pode excitar e a mais forte não, calculando a energia de cada fóton a partir da frequência.",
    },
    "Fotônica e tecnologias ópticas": {
      oQue:
        "Fotônica usa a luz para transportar, processar e medir informação. Laser dá luz coerente, fibra guia a luz por longa distância, guia de onda integra o circuito e cristal fotônico controla a propagação. Sensoriamento, comunicação e óptica não linear são aplicações da mesma física de propagação e confinamento.",
      passos: [
        "Escolha a faixa de comprimento de onda que o material e o detector atendem.",
        "Verifique perda e dispersão no caminho, porque fibra longa acumula os dois.",
        "Projete o confinamento: guia, fibra ou cavidade, conforme a função desejada.",
      ],
      exemplo:
        "Numa fibra óptica, a luz fica confinada por reflexão total e viaja quilômetros com perda pequena. A dispersão alarga o pulso e limita a taxa, e por isso existem fibra de dispersão deslocada e compensação. O mesmo confinamento em escala de chip vira guia de onda e permite modulator e detector no mesmo substrato. A física é a mesma; o que muda é a escala e o material.",
      quebra:
        "O erro é projetar link longo só pela atenuação e esquecer a dispersão. O pulso chega com energia e borrado, e a taxa cai. Outro erro é usar laser sem controle de coerência e fase onde a aplicação exige as duas.",
      limite:
        "A fibra comum tem janela de baixa perda no infravermelho próximo. Fora dela, a perda cresce e o material muda de comportamento. O limite é a janela do material.",
      pergunta: {
        q: "O que mantém a luz confinada dentro da fibra óptica?",
        a: "A reflexão total na interface entre núcleo e casca",
        why: "O núcleo tem índice maior que a casca, e o ângulo raso faz a luz refletir totalmente. Sem escapar, ela percorre a fibra por reflexões sucessivas.",
      },
      levar: "Fibra guia por reflexão total; dispersão limita a taxa.",
      maos:
        "Compare a perda de um link curto e de um longo com a mesma fibra e diga o que domina em cada caso. Depois explique o efeito da dispersão no pulso e por que ele limita a taxa mesmo quando a potência chega.",
    },
  },
  "chem-analytical": {
    "Análise qualitativa": {
      oQue:
        "Análise qualitativa responde que espécie está presente, sem medir quanto. O caminho é teste que produz resposta observável: cor, precipitado, gás ou mudança de condutividade. A identificação precisa de teste que distinga a espécie das parecidas, e por isso o resultado vem de bateria de testes, não de um só.",
      passos: [
        "Liste as espécies possíveis e o teste que separa cada uma das outras.",
        "Execute o teste com controle positivo e negativo, para saber o que é resposta e o que é ruído.",
        "Combine os resultados e elimine hipótese incompatível até sobrar uma.",
      ],
      exemplo:
        "Para identificar cátion em solução, o teste de chama dá cor característica, e o precipitado com reagente específico confirma. O sódio pinta de amarelo e o potássio de lilás, e a cor pode ser mascarada pela mistura. Por isso o teste de chama sozinho não fecha: ele levanta hipótese, e o precipitado confirma ou derruba. A conclusão nasce da combinação, não de uma observação isolada.",
      quebra:
        "O erro é aceitar um teste único como prova. Íon parecido pode dar resposta parecida, e a conclusão fica ambígua. Outro erro é esquecer o controle: sem ele, a cor do reagente pode ser confundida com a cor do produto.",
      limite:
        "Os testes clássicos têm limite de detecção e sofrem interferência de matriz. Em amostra complexa, a identificação exige separação antes. O limite é a concentração e a companhia. Controle positivo e negativo não são enfeite: são eles que dizem se o teste funcionou naquela matriz.",
      pergunta: {
        q: "O que a análise qualitativa determina?",
        a: "Quais espécies estão presentes na amostra",
        why: "Ela identifica a substância por teste que produz resposta observável. A quantidade fica para a análise quantitativa, que é outro problema.",
      },
      levar: "Qualitativa diz o que é; a combinação de testes fecha a resposta.",
      maos:
        "Escolha três íons e escreva o teste que separa cada um dos outros dois. Depois diga qual par continuaria ambíguo com um teste só e repita a bateria com uma mistura dos três, para ver se a combinação continua fechando a resposta.",
    },
    "Análise quantitativa": {
      oQue:
        "Análise quantitativa mede quanto de uma espécie existe. Gravimetria pesa o produto isolado, volumetria mede volume de solução de concentração conhecida, e a titulação é o caso mais comum. Padronizar a solução e calcular a concentração com unidade certa é o que transforma leitura de bureta em resultado.",
      passos: [
        "Padronize a solução titulante contra padrão primário e registre a concentração real.",
        "Pese ou meça o volume da amostra com a precisão que o método exige.",
        "Calcule a quantidade por estequiometria e expresse o resultado com incerteza.",
      ],
      exemplo:
        "Numa titulação ácido-base, o volume gasto até a virada do indicador entra na conta com a concentração do titulante. Se a solução não foi padronizada, a conta parte de concentração nominal e o erro entra direto no resultado. A repetição em triplicata mostra a dispersão, e a média sem a dispersão esconde a qualidade da medida.",
      quebra:
        "O erro é usar concentração nominal sem padronizar. O titulante absorve umidade e muda de concentração com o tempo, e a conta fica errada sem aviso. Outro erro é escolher indicador com faixa longe do ponto de equivalência e ler o volume no lugar errado.",
      limite:
        "A volumetria exige reação rápida, completa e com estequiometria conhecida. Reação lenta ou com produto instável não serve. O limite é a química da reação, não a bureta.",
      pergunta: {
        q: "O que a padronização de uma solução garante?",
        a: "A concentração real do titulante",
        why: "A solução preparada tem concentração nominal, e a padronização contra padrão primário mede o valor verdadeiro. Sem ela, todo cálculo de titulação carrega o desvio.",
      },
      levar: "Sem padronizar, a bureta mede volume e a conta mente.",
      maos:
        "Calcule a concentração de uma amostra a partir do volume gasto e da concentração do titulante. Depois refaça com a concentração dez por cento maior e veja o quanto o resultado muda, e repita a conta com a metade da amostra para ver se o resultado escala como esperado.",
    },
    "Métodos espectroscópicos": {
      oQue:
        "Métodos espectroscópicos medem a interação da radiação com a matéria. Absorção na faixa ultravioleta e visível vê transição eletrônica, infravermelho vê vibração, Raman vê polarizabilidade, ressonância magnética nuclear vê o ambiente do hidrogênio e espectrometria de massas mede relação massa-carga. Cada técnica responde a uma pergunta diferente.",
      passos: [
        "Escolha a técnica pela informação que falta: grupo funcional, estrutura, massa ou concentração.",
        "Prepare a amostra no estado que a técnica exige e registre o espectro na faixa adequada.",
        "Interprete as bandas contra tabela e confirme com segunda técnica quando a estrutura for nova.",
      ],
      exemplo:
        "Uma amostra com carbonila mostra banda forte perto de 1700 cm menos um no infravermelho, e a mesma amostra pode ter absorção fraca no Raman. O espectro ultravioleta mostra conjugação, não o esqueleto inteiro. A massa exata confirma a fórmula, e a ressonância magnética nuclear mostra quantos hidrogênios existem em cada ambiente. Nenhuma técnica sozinha fecha estrutura complexa, e a combinação é o método.",
      quebra:
        "O erro é interpretar banda de amostra contaminada. Umidade e solvente aparecem no espectro e são confundidos com grupo da molécula. Outro erro é usar tabela sem olhar o estado físico e o efeito de ligação de hidrogênio, que desloca a banda.",
      limite:
        "Cada técnica tem janela e limite de detecção. Espécie sem cromóforo não aparece no ultravioleta, e composto não volátil não entra na espectrometria sem preparo. O limite é a propriedade que a técnica enxerga.",
      pergunta: {
        q: "Que informação o espectro de infravermelho dá sobre a molécula?",
        a: "Os grupos funcionais, pelas frequências de vibração das ligações",
        why: "Cada tipo de ligação vibra em frequência característica. A absorção nessa faixa identifica o grupo, e a posição exata indica a vizinhança.",
      },
      levar: "Cada técnica enxerga uma propriedade; estrutura sai da combinação.",
      maos:
        "Escolha um grupo funcional e procure a banda característica dele no infravermelho. Depois diga qual outra técnica usaria para confirmar a estrutura, e escolha uma molécula com dois grupos funcionais para dizer qual banda distingue cada um.",
    },
    "Métodos de separação": {
      oQue:
        "Separar é distribuir os componentes entre duas fases de forma diferente. Cromatografia faz isso com fase móvel e estacionária, e cada componente sai no tempo que a interação com as duas fases determina. Extração usa solubilidade, destilação usa volatilidade e eletroforese usa carga. A escolha depende da propriedade que distingue os componentes.",
      passos: [
        "Identifique a propriedade que separa os componentes: volatilidade, polaridade, carga ou tamanho.",
        "Escolha a técnica e a fase que exploram essa propriedade.",
        "Ajuste a condição até a resolução entre picos ser suficiente, e valide com padrão.",
      ],
      exemplo:
        "Numa cromatografia gasosa, a amostra vaporiza e é arrastada por gás. Componente que interage mais com a fase estacionária demora mais para sair, e o tempo de retenção identifica. Dois compostos com volatilidade parecida podem não separar na coluna escolhida, e a troca de fase muda a ordem. Resolução é o critério, não apenas o pico aparecer, e um pico estreito e separado vale mais que dois picos largados e sobrepostos.",
      quebra:
        "O erro é achar que pico separado no gráfico é componente puro. Coeluato pode esconder dois componentes no mesmo pico, e a identificação fica errada. Outro erro é escolher coluna pela disponibilidade sem olhar a polaridade da amostra.",
      limite:
        "A separação gasta tempo e amostra, e a resolução cresce com o comprimento da coluna até o custo pesar. Em amostra com centenas de componentes, uma técnica só não resolve. O limite é prático, não teórico.",
      pergunta: {
        q: "O que o tempo de retenção numa cromatografia indica?",
        a: "A interação do componente com as fases móvel e estacionária",
        why: "Componente que fica mais tempo na fase estacionária demora mais para sair. O tempo de retenção, comparado com padrão, ajuda a identificar.",
      },
      levar: "Separação explora uma diferença de propriedade entre as fases.",
      maos:
        "Separe tinta de caneta em papel com álcool e observe as manchas. Depois explique por que as cores sobem alturas diferentes e meça a altura de cada mancha para dizer qual cor interagiu mais com o papel.",
    },
    "Métodos eletroanalíticos": {
      oQue:
        "Métodos eletroanalíticos medem corrente, potencial ou condutância para descobrir concentração. Potenciometria mede diferença de potencial sem consumir a amostra, voltametria varre potencial e mede corrente, e sensores eletroquímicos exploram reação na superfície do eletrodo. São rápidos, portáteis e sensíveis a matriz suja.",
      passos: [
        "Escolha o eletrodo e o eletrólito de suporte adequados à espécie.",
        "Calibre com soluções de concentração conhecida na faixa de interesse.",
        "Meça a amostra e confira com adição de padrão quando a matriz for complexa.",
      ],
      exemplo:
        "Um medidor de pH usa eletrodo de vidro e mede potencial que varia com a atividade do íon hidrogênio. Ele precisa de calibração com solução tampão antes de usar, porque o eletrodo envelhece e desvia. A leitura estável é sinal de equilíbrio; leitura que oscila indica eletrodo sujo ou bolha. O número só vale depois da calibração, e a calibração em dois tampões revela o desvio em toda a faixa, não só num ponto.",
      quebra:
        "O erro é medir sem calibrar naquele dia. O eletrodo desvia com o uso e a leitura parece plausível. Outro erro é ignorar o efeito da força iônica da amostra, que muda o potencial medido sem mudar a concentração real.",
      limite:
        "Potenciometria mede atividade, não concentração, e a diferença aparece em solução concentrada. Voltametria é sensível a oxigênio dissolvido e exige purga. O limite é a condição da solução, e a calibração vale para o dia e para a faixa em que foi feita.",
      pergunta: {
        q: "O que um eletrodo de pH mede?",
        a: "A atividade do íon hidrogênio na solução",
        why: "O potencial do eletrodo de vidro responde à atividade do íon hidrogênio. A calibração com tampão converte potencial em valor de pH.",
      },
      levar: "Eletrodo descalibrado dá número plausível e errado.",
      maos:
        "Calibre um medidor de pH com dois tampões e meça uma amostra. Depois meça de novo sem recalibrar e compare; a diferença mostra o peso da calibração. Repita com uma amostra de pH conhecido e veja se o valor bate; se não bater, a calibração ou o eletrodo está errado, e o teste separa os dois casos.",
    },
    "Metrologia química": {
      oQue:
        "Metrologia química é a ciência de saber o quanto o número vale. Calibração liga resposta do instrumento a padrão, rastreabilidade conecta o padrão a referência nacional, e limite de detecção diz o menor valor que se distingue do ruído. Incerteza e validação dizem o quanto confiar no resultado e em que faixa.",
      passos: [
        "Calibre o instrumento com padrão rastreável na faixa de uso.",
        "Determine limite de detecção e de quantificação a partir do ruído e da curva.",
        "Estime a incerteza combinando as fontes e valide o método com material de referência.",
      ],
      exemplo:
        "Uma curva de calibração com cinco pontos tem coeficiente de determinação alto e ainda pode ter limite de quantificação ruim. A resposta perto de zero é dominada por ruído, e o método não distingue concentração pequena. O limite de detecção se calcula pelo desvio do branco multiplicado por fator próprio, e o resultado abaixo dele deve ser reportado como não detectado, não como zero. A curva com poucos pontos perto do limite esconde essa fronteira.",
      quebra:
        "O erro é reportar valor abaixo do limite de quantificação como se fosse medida. O número existe na tela e não tem significado. Outro erro é calcular incerteza só da repetição e esquecer calibração, pureza do padrão e preparo da amostra.",
      limite:
        "A incerteza é declarada para o escopo validado. Mudar matriz ou faixa de concentração exige nova validação. O limite é o escopo, e ele precisa estar escrito no laudo.",
      pergunta: {
        q: "O que o limite de detecção indica?",
        a: "A menor quantidade que o método distingue do ruído",
        why: "Abaixo do limite, o sinal se confunde com a variação do branco. Detectar é diferente de quantificar com incerteza aceitável.",
      },
      levar: "Número abaixo do limite é ruído com casas decimais.",
      maos:
        "Desenhe uma curva de calibração com cinco pontos e marque o limite de quantificação. Depois diga o que faria com um resultado que caiu abaixo dele e como registraria isso no laudo.",
    },
    "Outras especialidades analíticas": {
      oQue:
        "As especialidades analíticas são interseções: traço exige concentração e pré-concentração, forense exige cadeia de custódia, clínica exige matriz biológica, ambiental exige baixo limite e materiais exigem superfície. Técnica hifenada junta separação e detecção no mesmo instrumento, e é a resposta para amostra complexa.",
      passos: [
        "Defina a matriz e a faixa de concentração, porque elas decidem o preparo.",
        "Escolha a técnica e o preparo que removem interferência antes da medida.",
        "Registre a cadeia de custódia quando o resultado tiver consequência legal.",
      ],
      exemplo:
        "Análise de traço em água exige pré-concentração antes da medida, porque o instrumento não enxerga concentração tão baixa direto. A extração em fase sólida concentra o analito e remove matriz. Sem esse passo, o limite de detecção do método não se alcança, por melhor que seja o detector. Preparo é metade do método.",
      quebra:
        "O erro é transplantar método de uma matriz para outra sem validar. Sangue, solo e água têm interferência diferente, e o mesmo protocolo pode dar resultado falso. Outro erro é perder a cadeia de custódia na amostra forense, o que invalida a prova.",
      limite:
        "Cada especialidade tem custo e tempo próprios, e a escolha do método é decisão de projeto. Método mais sensível pode ser mais lento e mais caro. O limite é o orçamento e o prazo, não a técnica.",
      pergunta: {
        q: "Por que a análise de traço costuma exigir pré-concentração?",
        a: "Porque a concentração é menor que o limite do instrumento",
        why: "O detector tem piso, e a amostra diluída fica abaixo dele. Pré-concentrar aumenta a quantidade do analito antes da medida e traz o sinal para a faixa útil.",
      },
      levar: "Matriz manda no método: preparo é metade da análise.",
      maos:
        "Escolha uma matriz, como água ou solo, e escreva o preparo necessário para medir um analito em concentração baixa. Depois justifique cada etapa pela interferência que ela remove.",
    },
  },
  "math-prob": {
    "Teoria da probabilidade": {
      oQue:
        "Probabilidade é medida de crença com regra: parte de espaço de resultados, atribui peso a evento e exige que a soma dê um. Variável aleatória transforma resultado em número, e distribuição diz com que peso cada valor aparece. Esperança e variância resumem a distribuição, e independência é o que permite multiplicar. Os teoremas limite explicam por que média de muitas medidas vira sino.",
      passos: [
        "Defina o espaço amostral e o evento com precisão, sem ambiguidade.",
        "Atribua probabilidade e verifique se a soma dos casos disjuntos bate com um.",
        "Calcule esperança e variância, e verifique a independência antes de multiplicar probabilidade.",
      ],
      exemplo:
        "Ao lançar dois dados, a soma sete tem seis combinações em trinta e seis, e a soma dois tem uma. A esperança da soma é sete, e a variância mede o espalhamento em torno dele. Já a probabilidade de soma sete dado que o primeiro dado deu três muda, porque condicionar restringe o espaço. O resultado condicional não é o incondicional, e confundir os dois é o erro mais comum em aposta.",
      quebra:
        "O erro é multiplicar probabilidade de evento dependente como se fosse independente. Dois eventos que compartilham causa não são independentes, e a conta conjunta erra. Outro erro é confundir probabilidade condicional com a conjunta e inverter a condição.",
      limite:
        "Probabilidade clássica supõe espaço de resultados equiprovável ou modelo bem definido. Em situação com informação incompleta, a atribuição depende do modelo e não do objeto. O limite está na modelagem.",
      pergunta: {
        q: "O que a probabilidade condicional mede?",
        a: "A probabilidade de um evento dado que outro já ocorreu",
        why: "O espaço amostral se restringe ao evento condicionante. A conta divide a probabilidade conjunta pela do condicionante, e o resultado pode ser maior ou menor que o original.",
      },
      levar: "Condicionar estreita o espaço; não é a mesma conta de antes.",
      maos:
        "Calcule a probabilidade de soma sete em dois dados antes e depois de saber que o primeiro deu três. Depois explique a diferença pelo espaço que sobrou.",
    },
    "Processos estocásticos": {
      oQue:
        "Processo estocástico é sequência de variáveis aleatórias indexada no tempo. Cadeia de Markov tem memória curta: o próximo estado depende só do atual. Processo de Poisson conta evento raro no tempo, e movimento browniano é o limite de caminhada aleatória. Martingale descreve jogo justo, e difusão descreve espalhamento. Cada um modela um tipo de dependência temporal.",
      passos: [
        "Defina o estado e a regra de transição, e verifique se a propriedade de Markov é razoável.",
        "Determine a distribuição de chegada ou de passo, e o tempo característico.",
        "Calcule a distribuição estacionária ou o tempo de primeira passagem, conforme a pergunta.",
      ],
      exemplo:
        "Numa fila, o número de clientes muda a cada chegada e a cada atendimento. A cadeia de Markov da fila diz a probabilidade de o sistema estar cheio, e a distribuição estacionária diz o tempo médio de espera. Se a taxa de chegada passa da capacidade de atendimento, não há distribuição estacionária e a fila cresce sem limite. O modelo avisa antes do colapso.",
      quebra:
        "O erro é aplicar cadeia de Markov quando o próximo estado depende do histórico. Em sistema com memória longa, a previsão erra e a conta de estacionário não vale. Outro erro é supor taxa de chegada constante em horário de pico, quando ela muda.",
      limite:
        "A distribuição estacionária existe sob condição de ergodicidade e taxa de atendimento maior que a de chegada. Fora disso, o processo não estabiliza. O limite é a condição de estabilidade.",
      pergunta: {
        q: "O que a propriedade de Markov afirma?",
        a: "Que o próximo estado depende apenas do estado atual",
        why: "A memória do processo é de um passo. O passado não acrescenta informação para prever o futuro além do estado presente.",
      },
      levar: "Markov troca memória longa por um estado presente bem escolhido.",
      maos:
        "Monte uma cadeia de dois estados com probabilidades de transição e calcule a distribuição depois de três passos. Depois compare com a estacionária.",
    },
    "Estatística descritiva": {
      oQue:
        "Estatística descritiva resume dado sem inferir nada além dele. Média, mediana e moda dão o centro, e variância, desvio e intervalo dão o espalhamento. Distribuição empírica é a contagem dos valores observados, e visualização é o resumo que mostra a forma. Resumo bom não esconde a cauda nem o valor extremo.",
      passos: [
        "Limpe o dado e verifique unidade, valor ausente e duplicata antes de resumir.",
        "Calcule centro e dispersão, e olhe a distribuição empírica em gráfico.",
        "Verifique valor extremo e assimetria antes de escolher a média como resumo.",
      ],
      exemplo:
        "Dois grupos com a mesma média podem ter variâncias muito diferentes. Um tem notas próximas do centro e o outro tem metade perto de dez e metade perto de zero. A média esconde a diferença, e o desvio mostra. Se a distribuição tem cauda longa, a mediana descreve melhor o caso típico, e a média é puxada pelo extremo.",
      quebra:
        "O erro é resumir com média sem olhar a forma. Média alta com cauda longa não significa que a maioria está alta. Outro erro é comparar grupos com tamanhos muito diferentes sem mostrar a dispersão, o que faz diferença pequena parecer grande.",
      limite:
        "A descrição vale para o conjunto observado e não se extrapola sozinha. Conclusão sobre população exige inferência, com hipótese e incerteza. O limite é o escopo do dado.",
      pergunta: {
        q: "Quando a mediana descreve melhor que a média?",
        a: "Quando a distribuição tem valores extremos ou assimetria",
        why: "A mediana divide o conjunto ao meio e não é puxada por extremo. A média soma todos e se desloca com um valor muito grande.",
      },
      levar: "Média sem dispersão e sem forma é metade do retrato.",
      maos:
        "Monte dois conjuntos com a mesma média e variâncias diferentes, e desenhe os dois no gráfico. Depois diga qual resumo você usaria para descrever cada um e por quê. Repita com um valor extremo acrescentado e veja a média se deslocar e a mediana quase não mudar.",
    },
    "Inferência estatística": {
      oQue:
        "Inferência estatística usa amostra para falar da população, com incerteza declarada. Estimação pontual dá um número, e intervalo de confiança dá faixa. Teste de hipótese compara dado com hipótese nula e devolve probabilidade de resultado tão extremo quanto o observado. Poder é a chance de detectar efeito que existe, e a escolha entre método paramétrico e não paramétrico depende da suposição que se aceita.",
      passos: [
        "Defina a população, a amostra e a hipótese antes de olhar o resultado.",
        "Escolha o estimador e calcule o intervalo com o nível de confiança declarado.",
        "Interprete o valor-p como compatibilidade com a nula, não como probabilidade de a nula ser verdadeira.",
      ],
      exemplo:
        "Um teste compara duas dietas e devolve valor-p de 0,03. Isso significa que, se não houvesse diferença, um resultado tão extremo apareceria em três por cento das amostras. Não significa que a chance de a dieta funcionar é noventa e sete por cento. Com milhares de participantes, diferença minúscula vira significativa, e com poucos, diferença grande pode não aparecer.",
      quebra:
        "O erro é ler valor-p como probabilidade de hipótese. Ele é calculado supondo a nula verdadeira, e não mede a chance dela. Outro erro é testar muitas hipóteses e reportar só a que deu significativa, o que infla falso positivo.",
      limite:
        "O intervalo de confiança supõe modelo e amostra aleatória. Amostra viesada produz intervalo estreito e errado. O limite é a representatividade, não o tamanho.",
      pergunta: {
        q: "O que um intervalo de confiança de noventa e cinco por cento informa?",
        a: "A faixa que conteria o valor verdadeiro em noventa e cinco por cento das amostras repetidas",
        why: "O nível se refere ao procedimento, não a uma probabilidade sobre o parâmetro fixo. Repetir a amostragem produziria intervalos que cobrem o valor em noventa e cinco por cento dos casos.",
      },
      levar: "Valor-p mede compatibilidade com a nula, não a chance dela.",
      maos:
        "Simule duas amostras de uma população sem diferença, calcule o valor-p e repita dez vezes. Conte quantas vezes deu significativo e compare com o nível escolhido.",
    },
    "Estatística bayesiana": {
      oQue:
        "Estatística bayesiana trata o parâmetro como incerteza e atualiza crença com dado. A priori resume o que se sabia antes, a verossimilhança traz o dado e a posterior combina as duas. Modelo hierárquico organiza parâmetro em níveis, e Monte Carlo via cadeias de Markov aproxima a posterior quando a conta exata não fecha.",
      passos: [
        "Escreva a priori com justificativa e verifique se ela domina o resultado.",
        "Escreva a verossimilhança do dado e combine para obter a posterior.",
        "Amostre ou aproxime a posterior e confira convergência antes de resumir.",
      ],
      exemplo:
        "Num teste de moeda, a priori diz que ela é provavelmente justa, e cinquenta lançamentos com trinta caras atualizam essa crença. A posterior fica entre a priori e a frequência observada, e o peso do dado cresce com o número de lançamentos. Com priori muito forte e pouco dado, a crença quase não muda. A escolha da priori é decisão explícita, não detalhe.",
      quebra:
        "O erro é usar priori conveniente e esconder que ela decide o resultado. Com poucos dados, a priori pesa muito, e a conclusão vira opinião disfarçada de estatística. Outro erro é rodar cadeia sem verificar convergência e resumir amostra que ainda não estabilizou.",
      limite:
        "A posterior é condicional ao modelo e à priori. Modelo errado produz posterior confiante e errada. O limite é a especificação, não o algoritmo.",
      pergunta: {
        q: "O que a distribuição posterior representa?",
        a: "A crença sobre o parâmetro depois de observar o dado",
        why: "A posterior combina a priori com a verossimilhança. Ela é a atualização da incerteza, condicionada ao modelo e ao dado observado.",
      },
      levar: "Bayes atualiza crença; a priori continua sendo decisão sua.",
      maos:
        "Atualize a crença sobre uma moeda com dez lançamentos e duas prioris diferentes. Depois compare as posteriores e diga quanto o dado conseguiu mover cada uma. Repita com uma priori mais forte e veja quanto o mesmo dado ainda consegue mover a crença.",
    },
    "Modelagem estatística": {
      oQue:
        "Modelo estatístico liga variável resposta a explicativas, com erro declarado. Regressão linear ajusta reta e resume o efeito em coeficiente; a não linear flexibiliza a forma. Modelo linear generalizado estende para resposta binária ou contagem, modelo misto acomoda medida repetida, e ANOVA compara médias entre grupos. A escolha depende da natureza da resposta e da estrutura do dado.",
      passos: [
        "Defina a resposta e as explicativas, e verifique a estrutura de agrupamento do dado.",
        "Escolha a família do modelo conforme o tipo de resposta e ajuste com diagnóstico.",
        "Interprete o coeficiente com unidade e intervalo, e confira a qualidade do ajuste.",
      ],
      exemplo:
        "Para prever tempo de entrega a partir de distância, a reta dá coeficiente em minuto por quilômetro. Se a resposta é se o cliente comprou ou não, a reta pode prever valor fora de zero e um, e o modelo logístico é o adequado. Com várias medidas da mesma pessoa, o modelo misto separa variação entre pessoas e dentro da pessoa. Usar reta em tudo produz previsão que viola a natureza do dado.",
      quebra:
        "O erro é interpretar coeficiente como causalidade. O modelo descreve associação no dado, e variável omitida pode explicar as duas coisas. Outro erro é ignorar a estrutura de grupo e tratar medida repetida como independente, o que encolhe o erro e infla a significância.",
      limite:
        "O modelo vale na faixa e na população observada. Extrapolar para fora da faixa é suposição, não previsão. O limite é o suporte do dado.",
      pergunta: {
        q: "O que o coeficiente de uma regressão linear indica?",
        a: "A variação média da resposta por unidade da explicativa",
        why: "O coeficiente mede a inclinação ajustada, mantendo as outras variáveis do modelo constantes. Ele descreve associação no dado, não prova causa.",
      },
      levar: "Modelo descreve associação; causa exige desenho, não coeficiente.",
      maos:
        "Ajuste uma reta a cinco pontos, interprete o coeficiente com unidade e preveja um valor fora da faixa. Depois diga por que a previsão é frágil.",
    },
    "Análises especializadas": {
      oQue:
        "As análises especializadas respondem a estrutura específica do dado: série temporal tem ordem no tempo, sobrevivência tem censura, dado espacial tem vizinhança, e experimento tem desenho. Método robusto resiste a valor extremo, amostragem garante representação, e inferência causal exige desenho que separe efeito de confusão. A técnica segue a pergunta e a estrutura.",
      passos: [
        "Identifique a estrutura: tempo, censura, espaço, grupo ou desenho experimental.",
        "Escolha o método que respeita essa estrutura e verifique as suposições dele.",
        "Valide com dado reservado ou com desenho que permita checar o resultado.",
      ],
      exemplo:
        "Numa série de vendas com tendência e sazonalidade, a média simples esconde o padrão. O modelo de série temporal separa tendência, sazonalidade e ruído, e a previsão usa os três. Já num estudo de sobrevivência, quem saiu do estudo sem evento não pode ser descartado: a censura entra na verossimilhança. Ignorar a estrutura produz número que parece certo e não responde à pergunta.",
      quebra:
        "O erro é usar método padrão em dado com estrutura especial. Tratar medida repetida como independente, ou ignorar censura, ou comparar grupo não equivalente, tudo isso produz estimativa enviesada. Outro erro é escolher método pela moda e não pela pergunta.",
      limite:
        "Cada método tem suposição que o dado precisa cumprir. Quando a suposição falha, a estimativa perde sentido mesmo com intervalo estreito. O limite é a suposição, e ela precisa ser testada.",
      pergunta: {
        q: "Por que a censura importa na análise de sobrevivência?",
        a: "Porque quem não teve o evento ainda carrega informação sobre o tempo",
        why: "Descartar o censurado enviesa a estimativa para cima ou para baixo. O método usa o tempo observado até a saída do estudo, sem inventar evento que não aconteceu.",
      },
      levar: "A estrutura do dado decide o método, não o contrário.",
      maos:
        "Pegue uma série com tendência e calcule a média dos primeiros e dos últimos pontos. Depois diga o que a média escondeu e qual modelo usaria. Por fim, calcule a mesma média com e sem o último ponto e veja o quanto a tendência pesa.",
    },
  },
  "lingua-semantics": {
    "Semântica lexical": {
      oQue:
        "Semântica lexical estuda o significado das palavras e as relações entre elas. Sinônimo aproxima sentido sem ser idêntico, antônimo opõe, polissemia é uma palavra com vários sentidos relacionados e homonímia é coincidência de forma com sentidos sem relação. Hipônimo é o termo mais específico dentro do hiperônimo, e campo semântico agrupa palavras que dividem espaço de sentido.",
      passos: [
        "Liste os sentidos da palavra e verifique se estão relacionados ou são coincidência.",
        "Teste a substituição em contexto para separar sinônimo de quase sinônimo.",
        "Organize o campo semântico com hiperônimo e hipônimos antes de comparar.",
      ],
      exemplo:
        "Banco pode ser assento, instituição financeira ou acúmulo de dados. Os sentidos são relacionados por forma, não por significado, e o contexto decide qual vale. Já manga de camisa e manga fruta são homônimos: a forma coincidiu e os sentidos não têm relação. A distinção importa para dicionário e para tradução, porque o tratamento é diferente.",
      quebra:
        "O erro é tratar sinônimo como substituição livre. Dois sinônimos podem diferir em registro, em colocação e em implicação, e trocar um pelo outro muda o texto. Outro erro é chamar de polissemia o que é homonímia, e inventar relação que não existe.",
      limite:
        "A fronteira entre polissemia e homonímia é difusa e depende da história da palavra. Dicionário antigo e atual podem classificar de forma diferente. O limite é histórico, não lógico, e a classificação precisa citar a fonte que usou.",
      pergunta: {
        q: "Qual a diferença entre polissemia e homonímia?",
        a: "Na polissemia os sentidos são relacionados; na homonímia, não",
        why: "Polissemia é uma palavra que estendeu o sentido por metáfora ou especialização. Homonímia é coincidência de forma entre palavras de origem diferente.",
      },
      levar: "Sentido relacionado é polissemia; coincidência de forma é homonímia.",
      maos:
        "Escolha uma palavra com vários sentidos, liste os usos e classifique cada par como polissemia ou homonímia. Depois justifique pela relação de sentido e compare com um dicionário, vendo se a ordem dos sentidos corresponde à frequência de uso que você observou.",
    },
    "Semântica frasal": {
      oQue:
        "Semântica frasal calcula o significado da frase a partir das partes e da estrutura. Composição diz que o todo vem da combinação, e a estrutura sintática decide o escopo. Ambiguidade estrutural aparece quando duas árvores produzem duas leituras com as mesmas palavras. Pressuposição é o que a frase assume, e quantificação liga a frase ao conjunto de objetos.",
      passos: [
        "Separe a frase em constituintes e monte a árvore sintática.",
        "Combine os significados pela regra de composição e verifique o escopo de cada operador.",
        "Teste a leitura em situação concreta para ver se corresponde ao uso.",
      ],
      exemplo:
        "A frase o menino viu o homem com o binóculo tem duas leituras: o menino usou o binóculo ou o homem estava com ele. As palavras são as mesmas; a diferença é onde o sintagma com o binóculo se liga na árvore. A semântica formal não escolhe a leitura, ela mostra as duas estruturas e explica a ambiguidade pela posição.",
      quebra:
        "O erro é atribuir ambiguidade ao léxico quando ela é estrutural. Trocar a palavra não resolve, porque o problema está na ligação. Outro erro é ignorar pressuposição e tratar a frase como se afirmasse só o que está explícito.",
      limite:
        "A composição funciona bem para língua com estrutura regular. Expressão idiomática e metáfora resistem à composição literal e pedem tratamento à parte. O limite é a produtividade da regra, e a exceção não invalida o método: ela delimita o alcance dele.",
      pergunta: {
        q: "O que caracteriza uma ambiguidade estrutural?",
        a: "Duas leituras geradas por duas estruturas sintáticas da mesma frase",
        why: "As palavras são iguais e a diferença está na ligação entre constituintes. Cada árvore produz uma condição de verdade diferente.",
      },
      levar: "Ambiguidade estrutural é a árvore, não a palavra.",
      maos:
        "Pegue uma frase ambígua, desenhe duas árvores e escreva a leitura de cada uma. Depois diga qual contexto desfaz a ambiguidade e reescreva a frase de modo que só uma leitura sobreviva.",
    },
    "Semântica dos verbos e argumentos": {
      oQue:
        "O verbo organiza a frase em papéis: quem age, quem sofre, quem experiencia, o que causa e com que instrumento. A estrutura argumental diz quantos e quais participantes o verbo exige. O mesmo participante pode mudar de papel conforme a construção, e a voz passiva reorganiza sem mudar o fato. Papel semântico é o que permite entender quem fez o quê além da ordem das palavras.",
      passos: [
        "Identifique o verbo e os participantes que ele exige para a frase ser completa.",
        "Atribua papel semântico a cada participante, com teste de paráfrase.",
        "Compare com a construção passiva e verifique se o fato descrito continua o mesmo.",
      ],
      exemplo:
        "Em o vento quebrou a janela, o vento é causa e a janela é paciente. Em a janela quebrou, a mesma janela vira sujeito sem agente, e a frase não diz quem quebrou. A estrutura muda a informação disponível, e a interpretação acompanha. Já em o vidro quebrou fácil, o verbo ganha leitura de propriedade, e o participante muda de papel outra vez.",
      quebra:
        "O erro é confundir sujeito sintático com agente. Na passiva, o sujeito é o paciente, e quem lê rápido atribui ação à pessoa errada. Outro erro é supor que todo verbo exige agente, quando muitos descrevem processo sem causa explícita.",
      limite:
        "A lista de papéis varia entre teorias, e a mesma frase pode receber análise diferente sem mudar o fato. O limite é o quadro teórico, não a língua.",
      pergunta: {
        q: "O que a estrutura argumental de um verbo define?",
        a: "Quantos e quais participantes a frase exige",
        why: "O verbo pede argumentos, como sujeito e objeto. A estrutura diz quais são obrigatórios e qual papel cada um recebe na cena descrita.",
      },
      levar: "Papel semântico diz quem fez o quê, além da ordem da frase.",
      maos:
        "Pegue três verbos e escreva uma frase com cada, marcando agente e paciente. Depois passe uma para a passiva e mostre o que mudou e o que não mudou no texto original.",
    },
    "Semântica temporal e modal": {
      oQue:
        "Tempo e aspecto localizam o evento e dizem como ele se distribui. Tempo é a relação com o momento da fala; aspecto é se a ação é pontual, durativa ou habitual. Modalidade cobre possibilidade, necessidade e certeza, e o condicional abre hipótese. Contrafactual fala do que não aconteceu, e por isso exige marcação própria.",
      passos: [
        "Localize o evento no tempo e identifique o aspecto: pontual, durativo ou habitual.",
        "Identifique o operador modal e o grau de certeza que ele expressa.",
        "Teste a frase em contexto para separar possibilidade de necessidade.",
      ],
      exemplo:
        "Eu lia e eu li descrevem o mesmo verbo em aspectos diferentes: o primeiro é habitual ou durativo no passado, o segundo é pontual. Eu devo sair pode expressar obrigação ou probabilidade, e o contexto decide. Se eu tivesse saído antes fala de um passado que não aconteceu, e a consequência fica suspensa. Tempo, aspecto e modalidade são camadas distintas.",
      quebra:
        "O erro é tratar tempo verbal como tempo real. Presente pode falar do futuro e passado pode expressar cortesia, e a leitura depende do contexto. Outro erro é ler deve sempre como obrigação e ignorar a leitura de probabilidade.",
      limite:
        "A marcação de tempo depende da língua e da cultura. Língua sem flexão de tempo expressa a ordem por outro recurso, como partícula ou advérbio. O limite é o sistema da língua, não a lógica, e é por isso que tradução de tempo exige cuidado.",
      pergunta: {
        q: "O que o aspecto verbal informa?",
        a: "Como a ação se distribui no tempo: pontual, durativa ou habitual",
        why: "O aspecto descreve o desenrolar interno do evento, enquanto o tempo o localiza em relação à fala. Os dois são independentes e podem combinar.",
      },
      levar: "Tempo localiza; aspecto diz como a ação se desenrola.",
      maos:
        "Escreva a mesma ideia em três aspectos diferentes e diga o que muda na leitura. Depois acrescente um modal e explique o grau de certeza, e diga qual marcação o português usa para cada combinação.",
    },
    "Semântica pragmática": {
      oQue:
        "Pragmática estuda o que a frase faz além do que ela diz. Implicatura é o que o falante sugere sem afirmar, e o ouvinte calcula pela cooperação e pelo contexto. Ironia inverte o sentido literal, pressuposição carrega informação dada como certa, e subentendido fica por conta do ouvinte. A mesma frase muda de efeito conforme a situação.",
      passos: [
        "Identifique o que a frase afirma literalmente e o que ela pressupõe.",
        "Verifique a intenção provável pelo contexto e pela relação entre os falantes.",
        "Teste a implicatura: se ela pode ser cancelada sem contradição, é implicatura, não acarretamento.",
      ],
      exemplo:
        "Alguém diz está frio aqui e outra pessoa fecha a janela. A frase não pediu nada, e o pedido foi inferido. O mesmo enunciado em dia quente vira ironia. A implicatura se cancela com uma frase seguinte, e o acarretamento não. Distinguir os dois é o que permite analisar o texto sem inventar intenção.",
      quebra:
        "O erro é tratar implicatura como significado literal e cobrar do falante o que ele só sugeriu. Outro erro é ignorar o contexto e ler ironia onde não há. A análise precisa separar o dito do sugerido e dizer qual é qual.",
      limite:
        "A intenção do falante não é observável diretamente, e a análise reconstrói hipótese. Contexto cultural muda o cálculo, e o que soa irônico numa comunidade não soa em outra. O limite é a inferência, não a frase, e o analista precisa declarar qual contexto assumiu.",
      pergunta: {
        q: "O que uma implicatura é?",
        a: "Um sentido sugerido que não está afirmado literalmente",
        why: "O falante comunica mais do que diz, e o ouvinte calcula pela situação. A implicatura pode ser cancelada sem tornar a fala contraditória.",
      },
      levar: "O dito e o sugerido são camadas diferentes; a análise separa as duas.",
      maos:
        "Pegue uma fala curta e escreva três leituras possíveis em contextos diferentes. Depois diga qual é literal e quais são implicatura. Por fim, marque qual leitura o contexto imediato autoriza e qual seria invenção do analista.",
    },
  },
  "cs-net": {
    "Fundamentos de redes": {
      oQue:
        "Rede é o caminho entre dois programas que querem conversar. O modelo em camadas organiza esse caminho: física, enlace, rede, transporte e aplicação. Endereço IP identifica a máquina, porta identifica o programa, e roteador decide por onde o pacote segue. Máscara, sub-rede, NAT e DHCP são a contabilidade que faz esse endereçamento funcionar no mundo real.",
      passos: [
        "Desenhe o caminho da origem ao destino e diga que camada decide cada salto.",
        "Cuide do endereçamento: rede, máscara, gateway e servidor de nome para cada ponta.",
        "Teste em ordem: link, endereço, rota e nome, antes de culpar a aplicação.",
      ],
      exemplo:
        "Um computador com endereço na mesma sub-rede do destino entrega o quadro direto, sem roteador. Se o destino está em outra sub-rede, o pacote vai para o gateway, e cada salto escolhe o próximo por tabela de rota. O DNS entra antes de tudo: sem resolver o nome, o programa nem sabe para onde mandar. Quando a página não abre, o teste de ping e o de resolução de nome separam os dois problemas.",
      quebra:
        "O erro é culpar a aplicação quando o problema está embaixo. Página que não abre pode ser nome não resolvido, rota ausente ou cabo solto, e cada um tem teste próprio. Outro erro é configurar máscara errada e achar que o vizinho está inalcançável quando a conta de sub-rede é que está errada.",
      limite:
        "A arquitetura em camadas supõe que cada uma pode ser trocada sem afetar a outra. Na prática, firewall e NAT espiem camadas e quebram a promessa. O limite é a caixa do meio.",
      pergunta: {
        q: "O que distingue endereço IP de porta?",
        a: "O IP identifica a máquina; a porta identifica o programa",
        why: "O endereço leva o pacote até o computador, e a porta entrega ao processo certo. Sem a porta, o sistema não saberia qual programa recebe a mensagem.",
      },
      levar: "Rede se testa de baixo para cima: link, endereço, rota e nome.",
      maos:
        "Desenhe duas sub-redes com um roteador entre elas e diga, para um pacote, o caminho de cada salto. Depois explique onde o NAT entraria.",
    },
    "Protocolos": {
      oQue:
        "Protocolo é acordo de como conversar: formato da mensagem, ordem e o que fazer quando algo falha. TCP garante entrega e ordem, UDP abre mão das duas para ganhar velocidade, e ICMP reporta erro de rede. HTTP carrega a web, TLS cifra, SSH administra, e a dupla SMTP e IMAP cuida de correio. Cada um escolhe a garantia que o uso precisa.",
      passos: [
        "Escolha o transporte pela garantia necessária: ordem e confirmação ou velocidade.",
        "Monte a mensagem no formato do protocolo de aplicação, com cabeçalho e corpo.",
        "Trate o erro previsto pelo protocolo: retransmissão, timeout ou código de status.",
      ],
      exemplo:
        "Numa chamada de vídeo, UDP é a escolha porque atraso de pacote perdido estraga mais que a perda em si. Baixar arquivo pede TCP, porque byte fora de ordem inutiliza o arquivo. A página usa HTTP sobre TLS sobre TCP, e o certificado prova que o servidor é quem diz ser. Trocar o transporte sem rever o uso produz sistema que perde dado ou que espera demais.",
      quebra:
        "O erro é usar TCP onde a perda é aceitável e pagar latência sem ganho. Outro erro é achar que TLS resolve tudo: ele protege o conteúdo em trânsito e não impede servidor invadido nem senha fraca. A garantia é do trecho, não do sistema inteiro.",
      limite:
        "Cada protocolo tem escopo e não cobre o que está fora dele. HTTPS não garante que o site é honesto, só que a conexão é cifrada e o nome confere. O limite é o que o protocolo promete.",
      pergunta: {
        q: "Por que vídeo ao vivo costuma usar UDP em vez de TCP?",
        a: "Porque perder um pacote atrasa menos que esperar a retransmissão",
        why: "TCP reenvia o que falta e segura a entrega em ordem, o que aumenta a latência. Em vídeo, quadro perdido passa e o próximo continua, e a conversa segue fluida.",
      },
      levar: "Protocolo é troca: garantia custa tempo.",
      maos:
        "Compare o mesmo envio em TCP e UDP numa rede com perda e descreva o que o usuário sente. Depois diga qual dos dois escolheria para arquivo e qual para voz.",
    },
    "Infraestrutura de rede": {
      oQue:
        "Infraestrutura é o que sustenta o caminho: cabo, rádio, switch, roteador, VPN e balanceador. LAN cobre o prédio, WAN liga cidades, Wi-Fi e celular trocam o cabo por rádio, e VPN constrói túnel sobre rede pública. SDN separa controle de encaminhamento, e balanceador distribui carga entre servidores.",
      passos: [
        "Desenhe a topologia com os pontos de falha e a capacidade de cada enlace.",
        "Escolha a tecnologia por distância, mobilidade e confiabilidade exigidas.",
        "Meça latência, perda e saturação em cada trecho antes de otimizar.",
      ],
      exemplo:
        "Um prédio com Wi-Fi único sofre quando muitos usuários conectam no mesmo ponto. A solução não é aumentar a potência: é distribuir pontos, separar rede de convidado e usar canal diferente. No link entre cidades, a VPN protege o tráfego e não aumenta a banda; se o enlace satura, a criptografia só acrescenta atraso. Cada camada da infraestrutura resolve um problema e cria outro.",
      quebra:
        "O erro é resolver saturação com mais potência de rádio. Potência não aumenta capacidade e ainda cria interferência. Outro erro é somar links sem balanceamento e achar que a banda dobrou, quando o fluxo continua saindo por um caminho só.",
      limite:
        "Rádio compartilha meio e sofre interferência; cabo tem limite físico de distância e ruído. A escolha é sempre troca entre alcance, capacidade e custo. O limite é o meio, e o meio compartilhado cobra em interferência, em canal disputado e em potência.",
      pergunta: {
        q: "O que uma VPN garante?",
        a: "Que o tráfego vai cifrado por um túnel até o outro ponto",
        why: "A VPN protege o conteúdo no caminho público, mas não aumenta banda nem esconde o fato de haver tráfego. A proteção vale entre os pontos do túnel.",
      },
      levar: "Infraestrutura é troca entre alcance, capacidade e custo.",
      maos:
        "Desenhe a rede de uma casa com dois andares e diga onde colocaria cada ponto de acesso, com o canal de cada um. Depois justifique pela capacidade e pela interferência, e estime quantos usuários cada ponto atende sem degradar.",
    },
    "Redes avançadas": {
      oQue:
        "Redes avançadas atacam o que a rede básica não resolve: latência, escala e heterogeneidade. Engenharia de tráfego decide caminho por política, SDN programa a rede, CDN aproxima conteúdo do usuário e P2P distribui carga entre pares. Rede tolerante a interrupção guarda o pacote até aparecer caminho, e IoT e datacenter trazem restrição própria.",
      passos: [
        "Meça o que limita: latência, perda, banda ou custo de trânsito.",
        "Escolha a técnica pelo limite: cache e CDN para conteúdo, SDN para política, P2P para distribuição.",
        "Verifique se a técnica nova convive com a rede existente e com a segurança.",
      ],
      exemplo:
        "Um site com público em três continentes não fica rápido só com servidor melhor. A CDN copia o conteúdo para pontos próximos do usuário, e a distância deixa de ser o gargalo. Já um serviço de distribuição de arquivo grande ganha com P2P, porque cada par ajuda a servir. A técnica certa depende de qual recurso está escasso, e não existe uma resposta só.",
      quebra:
        "O erro é aplicar SDN ou P2P sem medir o problema. A complexidade nova cobra operação e segurança, e o ganho pode não aparecer na medição feita antes e depois. Outro erro é esquecer que cache serve conteúdo velho e precisa de política de invalidação.",
      limite:
        "Rede tolerante a interrupção aceita atraso longo em troca de entrega. Em aplicação interativa, o atraso é pior que a perda. O limite é a tolerância do uso.",
      pergunta: {
        q: "O que uma CDN melhora?",
        a: "A distância entre o conteúdo e o usuário",
        why: "A cópia fica em ponto próximo, e o tempo de ida e volta cai. A origem só é consultada quando o conteúdo não está no cache.",
      },
      levar: "Cada técnica avançada ataca um recurso escasso por vez.",
      maos:
        "Escolha um serviço e diga o recurso escasso dele. Depois proponha a técnica que ataca esse recurso e explique o custo que ela traz.",
    },
    "Telecomunicações": {
      oQue:
        "Telecomunicação leva sinal por um meio, e o problema é sempre o mesmo: mandar informação com o menor erro possível dentro da banda disponível. Modulação coloca o dado numa portadora, codificação de canal acrescenta proteção, e antena converte corrente em onda. Fibra, rádio e satélite são meios com compromisso diferente entre alcance, banda e latência.",
      passos: [
        "Calcule a banda e a relação sinal-ruído disponíveis no meio.",
        "Escolha modulação e codificação que caibam nessa banda e resistam ao ruído previsto.",
        "Verifique o orçamento de enlace: potência, ganho de antena, perda de caminho e sensibilidade.",
      ],
      exemplo:
        "Num enlace de rádio, aumentar a ordem da modulação manda mais bits por símbolo e exige mais relação sinal-ruído. Se a chuva ou a distância pioram o sinal, a taxa cai e o enlace perde qualidade. O projeto escolhe a modulação pela pior condição, não pela melhor, e a escolha segue a pior condição o tempo todo. Fibra tem banda enorme e sofre com dispersão, e satélite cobre área gigante com latência alta.",
      quebra:
        "O erro é projetar enlace pela condição de sol e esquecer chuva, obstáculo e interferência. O sistema funciona no teste e cai no campo. Outro erro é confundir banda com latência: link largo pode ser lento para resposta curta.",
      limite:
        "O teorema de Shannon dá o teto de taxa para dada relação sinal-ruído. Nenhuma modulação passa desse teto. O limite é físico, não de equipamento, e o enlace bom é o que funciona no pior dia.",
      pergunta: {
        q: "O que a modulação faz?",
        a: "Coloca a informação numa portadora para transmitir pelo meio",
        why: "A portadora tem frequência adequada ao meio, e a modulação varia amplitude, fase ou frequência para representar o dado. A escolha decide quantos bits cabem por símbolo.",
      },
      levar: "Banda e ruído dão o teto; modulação só chega perto dele.",
      maos:
        "Compare fibra, rádio e satélite em banda, latência e alcance. Depois diga qual escolheria para vídeo ao vivo em cidade e qual para aldeia remota.",
    },
  },
  "lingua-literature": {
    "Teoria literária": {
      oQue:
        "Teoria literária pergunta o que faz um texto ser literatura e como ele produz efeito. Narrador, foco, personagem, enredo, espaço e tempo são as peças da narrativa; verso, ritmo e figura são as do poema. Estilo e intertextualidade ligam o texto a outros textos, e interpretação é o trabalho de sustentar leitura com evidência do próprio texto.",
      passos: [
        "Identifique o gênero e os elementos que organizam o texto.",
        "Localize a voz que narra e o ponto de vista, e veja o que o leitor tem acesso.",
        "Sustente a interpretação com passagem do texto, não com impressão solta.",
      ],
      exemplo:
        "Um conto narrado em primeira pessoa por personagem que não entende o que acontece produz efeito diferente do mesmo fato narrado por voz onisciente. O leitor descobre junto com o narrador ou sabe mais que ele, e a tensão muda. A escolha do foco não é detalhe técnico: é o que decide onde o leitor fica na cena.",
      quebra:
        "O erro é confundir narrador com autor. Quem narra é construção do texto, e a opinião dele não é a do escritor. Outro erro é interpretar sem citar passagem e transformar leitura em opinião, que qualquer outra leitura derruba. A leitura boa se defende no texto.",
      limite:
        "A interpretação é sempre de alguém e de um momento, e outra geração lê diferente. O texto sustenta várias leituras e não qualquer uma. O limite é a evidência disponível.",
      pergunta: {
        q: "O que o foco narrativo decide?",
        a: "O que o leitor tem acesso e de que lugar acompanha a história",
        why: "O foco define se a narração é em primeira ou terceira pessoa e quanto o narrador sabe. Isso controla informação, suspense e identificação.",
      },
      levar: "Narrador é construção; autor é outra pessoa.",
      maos:
        "Reescreva um parágrafo de narração em primeira pessoa na terceira e diga o que o leitor ganhou e perdeu. Depois justifique a escolha do texto original.",
    },
    "Gêneros literários": {
      oQue:
        "Gênero literário é forma que responde a uma expectativa: lírica canta, épica narra feito heroico, dramática representa em cena. Romance, conto, crônica e novela são formas narrativas com extensão e ritmo próprios. Teatro e poesia popular têm circuito e convenção próprios, e a literatura oral guarda versão que muda a cada contador.",
      passos: [
        "Identifique a forma e o circuito: texto para ler, para ouvir ou para encenar.",
        "Compare extensão, ritmo e grau de fechamento com o gênero declarado.",
        "Verifique se o texto mistura gêneros e o que a mistura produz.",
      ],
      exemplo:
        "O conto aponta para um efeito único e fecha rápido; o romance permite trama paralela e tempo longo. A crônica parte de fato pequeno e vira reflexão, e o leitor reconhece a assinatura. Um texto que se anuncia romance e termina como conto pode estar fazendo exatamente isso de propósito, e a leitura precisa notar.",
      quebra:
        "O erro é classificar por tamanho e ignorar a expectativa que o texto cria. Conto curto não é romance resumido, e crônica não é notícia. Outro erro é tratar gênero como regra fixa, quando ele é convenção que o texto pode torcer.",
      limite:
        "A fronteira entre gêneros é histórica e muda com o tempo. O que hoje é romance começou como carta e memória. O limite é a convenção da época, e o texto que mistura gêneros pede leitura que nomeie a mistura, não que escolha um rótulo só.",
      pergunta: {
        q: "O que distingue conto de romance?",
        a: "A extensão e a estrutura de conflito, não só o número de páginas",
        why: "O conto concentra o efeito numa linha e fecha; o romance abre trama paralela, tempo e personagem secundária. A diferença é de forma, não de tamanho.",
      },
      levar: "Gênero é expectativa que o texto confirma ou torce.",
      maos:
        "Pegue uma notícia curta e reescreva como crônica e como conto. Depois diga o que cada gênero obrigou a inventar e a cortar. Por fim, troque o final de cada versão e veja se o gênero resiste.",
    },
    "Literatura brasileira": {
      oQue:
        "A literatura brasileira se forma na colônia e se pensa como nação no Romantismo. Barroco, arcadismo e romantismo trazem projeto estético e político, e o Realismo de Machado muda o foco para o comportamento e a hipocrisia. O Modernismo de 1922 rompe com a forma parnasiana e assume a língua falada. Regionalismo, literatura indígena, afro-brasileira e periférica ampliam o que se chama de literatura nacional.",
      passos: [
        "Localize o texto no período e identifique o projeto estético dele.",
        "Veja como o texto trata a língua e a nação, que são as duas perguntas constantes.",
        "Leia a fortuna crítica do período sem confundir resumo escolar com leitura do texto.",
      ],
      exemplo:
        "Memórias Póstumas de Brás Cubas, de 1881, narra depois da morte e zomba do leitor. O gesto rompe a confiança do narrador realista tradicional e abre o caminho do Realismo brasileiro. Já Macunaíma, de 1928, junta folclore, língua falada e paródia para construir identidade nacional sem ufanismo. Os dois marcam ruptura, cada um no seu período, e a comparação mostra o que muda no projeto literário.",
      quebra:
        "O erro é decorar período sem ler o texto e reduzir obra a rótulo. Machado não é só Realismo, e Drummond não é só Modernismo. Outro erro é tratar literatura indígena e afro-brasileira como apêndice, quando são produção com poética própria e lugar no cânone em disputa.",
      limite:
        "O recorte nacional é discussão, não fato natural. O que entra na literatura brasileira muda com o cânone e com a crítica. O limite é a disputa, e ela é parte do assunto.",
      pergunta: {
        q: "O que a Semana de Arte Moderna de 1922 propôs?",
        a: "Ruptura com a forma parnasiana e afirmação da língua e da cultura brasileiras",
        why: "O Modernismo recusou a rigidez formal e a imitação europeia, incorporou a fala brasileira e a pesquisa de raiz. A proposta era estética e política ao mesmo tempo.",
      },
      levar: "Período é mapa; o texto é o território.",
      maos:
        "Compare um poema parnasiano e um modernista em forma e língua. Depois diga o que o segundo recusou e o que ganhou com a recusa.",
    },
    "Literatura portuguesa": {
      oQue:
        "A literatura portuguesa vai da cantiga medieval ao romance contemporâneo. O humanismo de Gil Vicente leva o teatro à corte, o classicismo de Camões fixa o épico em Os Lusíadas, e o barroco de Vieira trabalha o sermão como arquitetura. Arcadismo, Romantismo e Realismo de Eça acompanham a história do país, e o Modernismo de Pessoa e Orpheu muda a poesia em 1915.",
      passos: [
        "Localize o texto no período e na instituição que o sustentou, corte, imprensa ou escola.",
        "Identifique o projeto de língua e de nação que o texto carrega.",
        "Compare com o período brasileiro correspondente, que herda e transforma o modelo.",
      ],
      exemplo:
        "Os Lusíadas cantam a viagem de Vasco da Gama e, junto com ela, o projeto imperial português. A epopeia usa o mar como espaço de destino e a mitologia como linguagem. Já a poesia de Pessoa desmonta a voz única e cria heterônimos com poética própria. O gesto moderno é o oposto da epopeia: em vez de um eu nacional, vários eus que não concordam.",
      quebra:
        "O erro é ler o épico como documento e achar que a viagem é o assunto principal. O assunto é o sentido que Portugal atribui à viagem. Outro erro é tratar Pessoa como um só autor sem distinguir os heterônimos e a obra ortônima.",
      limite:
        "A periodização deixa de fora texto que não coube no rótulo, e a crítica revê a lista. Autora e autor esquecidos voltam ao cânone com pesquisa nova. O limite é a seleção, não a produção.",
      pergunta: {
        q: "O que os heterônimos de Fernando Pessoa criam?",
        a: "Vozes poéticas distintas, com obra e estilo próprios",
        why: "Caeiro, Reis e Campos não são pseudônimos, são autores fictícios com poética diferente. A obra ortônima convive com eles, e o conjunto recusa a voz única.",
      },
      levar: "Camões funda a voz nacional; Pessoa a multiplica e desfaz.",
      maos:
        "Leia um trecho de Camões e um de Pessoa e compare a voz do eu poético. Depois diga o que cada uma faz com a ideia de nação.",
    },
    "Literaturas de língua portuguesa": {
      oQue:
        "As literaturas de Angola, Moçambique, Cabo Verde, Guiné-Bissau, São Tomé e Timor constroem voz própria depois da colonização. Cada uma negocia língua, oralidade e história nacional. A relação com Portugal não é cópia: é retomada crítica, e a língua portuguesa carrega marca local. Ler essas literaturas é ler o português como língua plural.",
      passos: [
        "Localize o país e o momento histórico da obra, independência e guerra são marcos.",
        "Veja como o texto usa oralidade, língua local e memória coletiva.",
        "Evite ler a obra só como documento nacional; procure o trabalho de forma.",
      ],
      exemplo:
        "Mia Couto, em Moçambique, inventa palavra e mistura oralidade para criar uma língua que não é a do colonizador nem a de antes. Pepetela, em Angola, usa o romance para narrar a formação nacional e a desilusão depois da independência. Cabo Verde escreve a seca e a emigração como condição. A língua comum não apaga a diferença de experiência.",
      quebra:
        "O erro é ler essas literaturas como apêndice da portuguesa e buscar só exotismo. Outro erro é exigir que representem o país inteiro e cobrar da obra um papel de documento. A literatura faz outra coisa: elabora experiência e forma, e isso vale para os dois lados da comparação.",
      limite:
        "A tradução interna e a edição fora do país limitam o alcance, e muita obra circula pouco. O limite é de mercado e de arquivo, não de qualidade.",
      pergunta: {
        q: "O que a literatura moçambicana de Mia Couto faz com a língua portuguesa?",
        a: "Mistura oralidade e invenção lexical, criando uma língua local",
        why: "O texto incorpora ritmo e expressão oral e cria palavra nova. A língua deixa de ser só herança e vira material de invenção nacional.",
      },
      levar: "Português é língua plural: a norma comum não apaga a experiência local.",
      maos:
        "Compare um conto moçambicano e um angolano em tema e língua. Depois diga o que a comparação mostra e o que ela não permite concluir.",
    },
    "Crítica e pesquisa literária": {
      oQue:
        "Crítica literária sustenta leitura com método e evidência. História literária organiza período, crítica textual estuda versão e transmissão, e as abordagens histórica, sociológica, feminista e pós-colonial fazem perguntas diferentes ao mesmo texto. Estudos comparados aproximam literaturas, e adaptação leva a obra para outra linguagem. Pesquisa literária é arquivo, leitura e argumento.",
      passos: [
        "Escolha a pergunta e o método que ela pede, sem misturar abordagens.",
        "Reúna evidência: passagem do texto, edição, manuscrito, recepção ou contexto.",
        "Escreva o argumento e submeta a leitura ao texto, não ao contrário.",
      ],
      exemplo:
        "Uma leitura feminista pergunta como o texto constrói gênero e silencia voz; uma leitura sociológica pergunta que grupo social a obra representa e para quem fala. As duas podem usar a mesma passagem e chegar a conclusões diferentes, e nenhuma é automaticamente melhor. O que se exige é que a pergunta esteja clara e a evidência sustente o argumento.",
      quebra:
        "O erro é aplicar o conceito e forçar o texto a confirmar a tese. A leitura vira ilustração de teoria e perde o que o texto tinha de resistência. Outro erro é citar edição sem crítica e tratar versão como definitiva, quando o texto mudou entre edições. A pergunta vem antes da conclusão, e a conclusão pode ser que o texto resiste à pergunta, o que já é resultado.",
      limite:
        "Toda abordagem ilumina e esconde. Nenhum método lê o texto inteiro, e a escolha é do pesquisador. O limite é a pergunta, e ela precisa ser declarada.",
      pergunta: {
        q: "O que a crítica textual investiga?",
        a: "A transmissão e as versões do texto",
        why: "Ela compara manuscrito, edição e variante para estabelecer o texto e entender a história dele. A versão que se lê depende desse trabalho.",
      },
      levar: "Método é pergunta declarada, não conclusão antecipada.",
      maos:
        "Escolha uma passagem e faça duas perguntas diferentes a ela, uma histórica e uma de forma. Depois diga o que cada pergunta iluminou e o que ficou de fora.",
    },
  },
  "cs-security": {
    "Fundamentos de segurança": {
      oQue:
        "Segurança da informação protege três propriedades: confidencialidade, integridade e disponibilidade. O trabalho começa na modelagem de ameaças, que pergunta quem ataca, com que acesso e para quê. Superfície de ataque é tudo que está exposto, e controle é a medida que reduz risco. Arquitetura de segurança distribui controles em camadas, e o padrão seguro parte do fechado.",
      passos: [
        "Modele a ameaça: ativo, atacante, caminho e impacto de cada cenário.",
        "Liste a superfície exposta e escolha controle para cada caminho relevante.",
        "Aplique defesa em profundidade e verifique o padrão: o que não foi liberado fica fechado.",
      ],
      exemplo:
        "Um sistema de login expõe formulário, API, banco e recuperação de senha. Cada um é caminho de ataque. Limitar tentativa protege a senha, mas não protege a recuperação; cifrar o banco protege o vazamento, mas não protege a sessão roubada. O controle certo depende do caminho, e por isso a defesa é em camadas. Um controle só deixa o resto aberto, e o atacante escolhe a porta mais fraca do conjunto.",
      quebra:
        "O erro é tratar segurança como produto instalado no fim. Firewall não corrige código com falha nem senha reutilizada. Outro erro é confiar no perímetro e liberar tudo dentro dele: uma vez que o atacante entra, ele anda livre pela rede interna e o estrago é maior que o da porta de entrada.",
      limite:
        "Segurança absoluta não existe; o que existe é risco aceito e documentado. Custo de controle cresce e usabilidade cai com cada camada. O limite é a decisão de risco, e ela é do dono do sistema.",
      pergunta: {
        q: "O que as três propriedades da segurança protegem?",
        a: "Confidencialidade, integridade e disponibilidade da informação",
        why: "Confidencialidade impede leitura indevida, integridade impede alteração indevida, e disponibilidade garante acesso quando precisa. Cada ataque costuma mirar uma delas.",
      },
      levar: "Segurança é risco aceito e documentado, não selo de invulnerável.",
      maos:
        "Escolha um sistema simples, liste três ativos e um caminho de ataque para cada. Depois proponha um controle por caminho e diga o custo e o efeito de cada um.",
    },
    "Criptografia": {
      oQue:
        "Criptografia transforma mensagem em texto ilegível sem chave. Simétrica usa a mesma chave para cifrar e decifrar, assimétrica usa par de chaves, hash resume sem volta e assinatura prova origem e integridade. Certificado liga chave pública a identidade, e PKI é a cadeia que sustenta essa ligação. A troca de chaves combina as duas famílias para ter velocidade e segurança.",
      passos: [
        "Escolha a primitiva pela propriedade que precisa: sigilo, integridade ou autenticidade.",
        "Troque a chave simétrica com algoritmo assimétrico e verifique o certificado do outro lado.",
        "Rotacione a chave e registre o período de validade e o responsável por ela.",
      ],
      exemplo:
        "Numa conexão TLS, o cliente valida o certificado do servidor, combina uma chave simétrica e segue cifrando o tráfego com ela. O certificado prova que a chave pública pertence ao nome, e o handshake troca a chave sem que o observador a veja. Se o certificado está expirado, o navegador avisa. A garantia é do trecho, e o servidor ainda pode estar comprometido: cadeado não é atestado de honestidade.",
      quebra:
        "O erro é confundir hash com cifra. Hash não volta, e cifra volta com a chave. Outro erro é usar chave simétrica dura e não rotacionar, ou reaproveitar IV e nonce, que quebra a garantia mesmo com algoritmo forte e dá a impressão de que a proteção existe.",
      limite:
        "Criptografia protege conteúdo em trânsito e em repouso, não o endpoint comprometido. Chave que vaza derrota tudo. O limite é a gestão de chave, não o algoritmo.",
      pergunta: {
        q: "O que a criptografia assimétrica resolve que a simétrica não resolve?",
        a: "A troca de chave entre partes que nunca se viram",
        why: "O par de chaves permite combinar uma chave de sessão sem transmiti-la em claro. A simétrica só funciona depois que as duas partes já compartilham segredo.",
      },
      levar: "Algoritmo forte com chave mal gerida não protege nada.",
      maos:
        "Gere um par de chaves, assine um texto e verifique a assinatura. Depois altere um caractere e veja a verificação falhar, explicando qual propriedade da mensagem foi violada.",
    },
    "Identidade e controle de acesso": {
      oQue:
        "Autenticação prova quem é, autorização decide o que pode, e as duas coisas são separadas. MFA soma fatores, federação e SSO evitam senha repetida, e OAuth, OIDC e SAML resolvem cenários diferentes de delegação. RBAC dá papel, ABAC dá atributo, e menor privilégio é a regra que limita o dano quando algo falha. Segredo é credencial e merece cofre, não arquivo de configuração.",
      passos: [
        "Separe autenticação de autorização e defina o que cada papel pode fazer.",
        "Aplique menor privilégio e revise permissão acumulada com o tempo.",
        "Guarde segredo em cofre, rotacione e remova o que não está em uso.",
      ],
      exemplo:
        "Um serviço de relatório precisa ler uma tabela e não precisa escrever nela. A conta com permissão de escrita funciona e amplia o dano se o serviço for comprometido. O papel só de leitura reduz o estrago. Se a mesma conta é usada em três serviços, a rotação vira problema e o rastro se perde. Identidade própria por serviço é parte do controle, não burocracia.",
      quebra:
        "O erro é dar permissão de administrador para resolver logo. O privilégio fica e o dano possível cresce. Outro erro é confundir autenticação forte com autorização correta: MFA não impede que o usuário autenticado acesse o que não devia, e a conta legítima pode ser o caminho do abuso.",
      limite:
        "O controle de acesso depende da identidade ser confiável, e federação estende a confiança para outro domínio. Se o provedor cai ou erra, o acesso quebra ou abre. O limite é a confiança delegada.",
      pergunta: {
        q: "O que o princípio do menor privilégio determina?",
        a: "Dar só a permissão necessária para a tarefa, pelo tempo necessário",
        why: "Permissão mínima reduz o alcance de um comprometimento. A conta que só lê não pode apagar, mesmo que seja invadida.",
      },
      levar: "Autenticar não é autorizar: quem entrou ainda precisa de limite.",
      maos:
        "Liste os papéis de um sistema pequeno e a permissão mínima de cada um. Depois procure uma conta que hoje tem mais poder do que a tarefa dela exige e diga o que cortaria.",
    },
    "Segurança de redes": {
      oQue:
        "Segurança de rede controla o que entra, o que sai e o que circula entre segmentos. Firewall filtra por regra, IDS detecta e IPS bloqueia, segmentação limita o movimento lateral, e VPN protege o tráfego em rede pública. Zero Trust abandona a ideia de dentro confiável, e monitoramento contínuo transforma tráfego em evidência. A rede é tratada como hostil mesmo quando é interna.",
      passos: [
        "Desenhe os segmentos e o que cada um precisa alcançar.",
        "Escreva regra de firewall pelo mínimo necessário e revise a regra ampla antiga.",
        "Monitore o tráfego e alerte sobre desvio do padrão esperado.",
      ],
      exemplo:
        "Uma rede plana deixa o computador da recepção alcançar o banco de dados. Segmentar separa o que não precisa conversar, e a regra permite só a porta necessária. Se um equipamento é comprometido, o atacante não anda de graça. A segmentação não impede o ataque inicial, mas muda o alcance dele, e é isso que dá tempo para responder antes do estrago total.",
      quebra:
        "O erro é confiar na rede interna e esquecer o movimento lateral. Outro erro é regra ampla criada para resolver incidente e nunca removida. A regra fica, o risco fica, e ninguém lembra por que ela existe, o que transforma a exceção em arquitetura.",
      limite:
        "Firewall não inspeciona tráfego cifrado nem impede ataque de aplicação. Detecção depende de assinatura ou de comportamento, e as duas erram. O limite é o que a caixa enxerga.",
      pergunta: {
        q: "O que a segmentação de rede limita?",
        a: "O movimento lateral de quem já entrou",
        why: "Separar a rede em zonas restringe o alcance de um equipamento comprometido. Sem segmentação, o atacante alcança tudo que a rede alcança.",
      },
      levar: "Segmentar não evita a entrada; encurta o caminho depois dela.",
      maos:
        "Desenhe uma rede plana, marque o que não precisa conversar e proponha duas zonas com a regra entre elas. Depois diga o que ainda passaria e por quê.",
    },
    "Segurança de aplicações": {
      oQue:
        "Segurança de aplicação começa no desenho e continua no código e na dependência. Modelagem de ameaças antecipa o ataque, análise estática lê o código, análise dinâmica exercita a aplicação rodando, e teste de segurança confirma a falha. Vulnerabilidade de memória, falha de API e dependência desatualizada são as famílias mais comuns. Supply chain é a parte que vem de fora e entra no produto.",
      passos: [
        "Modele a ameaça por fluxo de dado e marque onde entra dado não confiável.",
        "Valide entrada, escape saída e trate a dependência como parte do código.",
        "Rode análise estática e dinâmica no pipeline e bloqueie falha crítica.",
      ],
      exemplo:
        "Uma consulta montada por concatenação de texto aceita entrada que muda o comando no banco. Validar e parametrizar resolve, e escapar sozinho é frágil porque cada banco tem regra própria. A falha não aparece no teste feliz e aparece na primeira tentativa de ataque. O teste de segurança precisa exercitar entrada hostil, não só o caminho previsto, e é por isso que teste funcional não substitui teste de segurança.",
      quebra:
        "O erro é tratar segurança como etapa final e revisar só antes de publicar. A falha de desenho não se corrige no fim sem refazer. Outro erro é confiar na dependência sem olhar versão e procedência, e o supply chain entra inteiro no produto sem aparecer no código escrito pela equipe.",
      limite:
        "Nenhuma análise cobre o que não foi modelado. Ferramenta encontra padrão conhecido e não substitui o desenho. O limite é a cobertura do modelo.",
      pergunta: {
        q: "O que a análise estática verifica?",
        a: "O código sem executar, procurando padrão de falha conhecida",
        why: "Ela lê o código e compara com regra de falha, sem rodar o programa. Falha que depende de dado em tempo de execução escapa e precisa da análise dinâmica.",
      },
      levar: "Falha de desenho não se corrige no fim do projeto.",
      maos:
        "Pegue uma função que recebe texto e monta consulta, e reescreva com parâmetro. Depois explique por que a versão parametrizada resiste à entrada hostil que quebrava a anterior.",
    },
    "Resposta e investigação": {
      oQue:
        "Resposta a incidente é processo, não improviso: preparar, identificar, conter, erradicar, recuperar e aprender. Monitoramento e SIEM juntam evento, detecção transforma sinal em alerta, e threat intelligence dá contexto sobre o atacante. Forense preserva evidência, e exercício testa o processo antes do incidente real. Pentest autorizado, red team e threat hunting são formas de procurar a falha antes do atacante.",
      passos: [
        "Prepare contato, papel e canal de decisão antes do incidente.",
        "Ao detectar, contenha sem destruir evidência e registre a linha do tempo.",
        "Encerre com recuperação verificada e registro do que mudou no processo.",
      ],
      exemplo:
        "Um alerta mostra acesso incomum ao banco. A primeira reação de desligar a máquina contém o ataque e apaga a memória que diria como o atacante entrou. A contenção correta isola a rede e preserva o disco. A investigação reconstrói o caminho, e o aprendizado corrige a falha que permitiu a entrada. Desligar sem pensar troca a investigação por um reinício, e o mesmo ataque volta na semana seguinte.",
      quebra:
        "O erro é apagar a evidência na pressa de conter. Outro erro é tratar o incidente como problema técnico isolado e não comunicar quem precisa decidir. A resposta envolve negócio, jurídico e comunicação, e a demora em acionar essas áreas custa mais que a falha original.",
      limite:
        "A investigação depende de log existente e de relógio sincronizado. Sem registro, o caminho não se reconstrói. O limite é a evidência que sobrou, e ela precisa ser pensada antes do incidente.",
      pergunta: {
        q: "Qual é a ordem geral da resposta a incidente?",
        a: "Preparar, identificar, conter, erradicar, recuperar e aprender",
        why: "A ordem evita conter antes de entender e recuperar antes de erradicar. O aprendizado fecha o ciclo e devolve a correção ao processo.",
      },
      levar: "Conter sem preservar evidência é perder a explicação do incidente.",
      maos:
        "Escreva a linha do tempo de um incidente fictício e marque onde estaria cada evidência. Depois diga qual ação de contenção preservaria o registro e qual o apagaria.",
    },
    "Segurança de infraestrutura": {
      oQue:
        "Segurança de infraestrutura é reduzir superfície em servidor, endpoint, container e nuvem. Hardening desliga o que não é usado, patch corrige falha conhecida, e postura mede a distância entre o estado atual e o desejado. Infrastructure as Code permite revisar e reproduzir a configuração, e container e Kubernetes exigem atenção própria de imagem, permissão e rede.",
      passos: [
        "Inventarie o que roda, a versão e quem pode alterar.",
        "Aplique hardening e patch com janela definida e verificação depois.",
        "Verifique a postura contra a linha de base e trate o desvio como incidente.",
      ],
      exemplo:
        "Um servidor com serviço de arquivo exposto sem necessidade amplia a superfície. Desligar o serviço reduz o risco e não custa desempenho. Um container com imagem antiga carrega biblioteca vulnerável, e a correção vem de reconstruir a imagem, não de entrar nela e atualizar à mão. O processo precisa reconstruir, porque a próxima instância nasce da imagem e repete a falha que você acabou de corrigir.",
      quebra:
        "O erro é corrigir a máquina rodando e não corrigir a imagem. A próxima réplica nasce vulnerável de novo. Outro erro é aplicar patch sem testar e derrubar serviço, o que ensina a equipe a evitar patch e amplia o risco em vez de reduzir.",
      limite:
        "Hardening e patch reduzem falha conhecida e não impedem ataque novo. A postura é retrato do momento e envelhece. O limite é a velocidade da mudança.",
      pergunta: {
        q: "O que o hardening faz num servidor?",
        a: "Reduz a superfície desligando o que não é necessário",
        why: "Cada serviço e porta expostos são caminho possível. Desligar o que não é usado reduz o que pode ser atacado sem perder função.",
      },
      levar: "Corrigir a máquina sem corrigir a imagem garante que a falha volte.",
      maos:
        "Liste cinco serviços de um servidor e classifique cada um como necessário ou removível. Depois diga o que o hardening faria e o que precisaria ser testado antes de desligar.",
    },
    "Governança e privacidade": {
      oQue:
        "Governança transforma segurança em decisão repetível: política, conformidade, auditoria e gestão de vulnerabilidade. Continuidade e recuperação de desastre definem quanto tempo o serviço pode parar e quanto dado pode perder. Proteção de dado pessoal tem base legal e finalidade, e risco de terceiro entra no cálculo porque fornecedor também falha.",
      passos: [
        "Escreva a política com dono, prazo e consequência, sem frase genérica.",
        "Defina RTO e RPO do serviço e teste a recuperação, não só o plano.",
        "Mapeie dado pessoal, base legal e retenção, e revise contrato de terceiro.",
      ],
      exemplo:
        "Um plano de recuperação que nunca foi testado não é plano, é intenção. O teste mostra que o backup existe e que a restauração leva mais tempo que o RTO prometido. A diferença entre promessa e prática aparece no incidente real. O mesmo vale para dado pessoal: guardar sem finalidade e sem prazo de descarte cria passivo, e a política só vale se houver rotina que a cumpra.",
      quebra:
        "O erro é ter política sem dono e sem verificação. Documento bonito não muda comportamento. Outro erro é tratar conformidade como fim e segurança como consequência, quando o objetivo é proteger e a norma é meio; a auditoria aprovada não garante que o sistema está seguro.",
      limite:
        "Governança depende de decisão de negócio e de orçamento, e não se resolve só na técnica. Risco aceito precisa de registro e de prazo. O limite é a decisão do dono.",
      pergunta: {
        q: "O que RTO e RPO definem?",
        a: "O tempo máximo de parada e a perda máxima de dado aceitável",
        why: "RTO é quanto o serviço pode ficar fora, e RPO é quanto dado pode se perder no desastre. Os dois orientam backup, replicação e teste de recuperação.",
      },
      levar: "Plano não testado é promessa; governança é rotina com dono.",
      maos:
        "Defina RTO e RPO de um serviço pequeno e diga que backup e teste cumprem os dois. Depois aponte onde a rotina atual falharia no primeiro incidente.",
    },
  },
};

// o nome da estação chega em caixa baixa da seção e em caixa alta do título;
// a busca ignora isso, como no catálogo
export function licaoDeLegado(areaId, nome) {
  const porArea = LICOES_LEGADO[areaId];
  if (!porArea) return null;
  if (porArea[nome]) return porArea[nome];
  const alvo = String(nome || "").toLowerCase();
  const chave = Object.keys(porArea).find((k) => k.toLowerCase() === alvo);
  return chave ? porArea[chave] : null;
}

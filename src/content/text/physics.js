// Texto curado de Física: abertura, prática e erro comum por subárea.

export const PHYSICS_TEXT = {
  "Fundamentos da física": {
    abre: "Física começa medindo e comparando. Grandezas, unidades e análise dimensional impedem que uma conta bonita esconda uma resposta impossível.",
    pratica: "Monte uma fórmula para o período de um pêndulo e use análise dimensional para descobrir de que ela pode depender.",
    erro: "Somar grandezas de unidades diferentes sem converter, ou aceitar resultado com dimensão errada.",
  },
  "Física experimental": {
    abre: "Experimento é pergunta desenhada para ter resposta. Planejamento, instrumentação e aquisição de dados decidem a qualidade do que se conclui.",
    pratica: "Meça o tempo de queda de um objeto várias vezes, estime a incerteza e compare o valor com a previsão teórica.",
    erro: "Repetir a medida sempre do mesmo jeito e chamar a média de resultado sem olhar o erro sistemático.",
  },
  "Física teórica": {
    abre: "A física teórica constrói modelos e deriva consequências antes de olhar o experimento. Uma boa teoria diz onde ela mesma falha.",
    pratica: "Pegue a lei de Coulomb, imponha simetria esférica e derive o campo de uma casca carregada.",
    erro: "Confundir modelo com realidade: o mapa não é o território, e todo modelo tem domínio de validade.",
  },
  "Física computacional": {
    abre: "Simulação é experimento dentro do computador. Métodos numéricos e Monte Carlo permitem explorar sistemas que não cabem na bancada.",
    pratica: "Simule um oscilador amortecido por Euler e por Runge-Kutta e compare a energia ao longo do tempo.",
    erro: "Escolher passo pequeno demais sem olhar custo, ou grande demais sem testar estabilidade.",
  },
  "História, filosofia e fundamentos conceituais": {
    abre: "As leis físicas têm história e pressupostos. Discutir causalidade, determinismo e mudança de paradigma evita tratar a física atual como óbvia.",
    pratica: "Compare a noção de tempo em Newton e em Einstein e aponte qual observação forçou a mudança.",
    erro: "Contar a história como sequência de gênios sem mostrar o problema que cada teoria resolveu.",
  },
  "Cinemática": {
    abre: "Cinemática descreve o movimento sem perguntar ainda por que ele acontece. Posição, velocidade e aceleração são taxas que se conectam por derivada e integral.",
    pratica: "Desenhe os gráficos de posição, velocidade e aceleração de um carro que freia e confira a relação entre as inclinações.",
    erro: "Confundir velocidade com aceleração: velocidade constante tem aceleração zero.",
  },
  "Dinâmica": {
    abre: "Dinâmica explica o movimento por forças. As três leis de Newton ligam força, massa e aceleração, e energia e momento dão atalhos quando a força é complicada.",
    pratica: "Desenhe o diagrama de forças de um bloco em plano inclinado e resolva por Newton e por energia.",
    erro: "Esquecer o par ação e reação: as duas forças atuam em corpos diferentes.",
  },
  "Mecânica analítica": {
    abre: "Lagrange e Hamilton reescrevem a mecânica em termos de energia e coordenadas. O princípio da ação estacionária substitui o diagrama de forças por uma condição global.",
    pratica: "Escreva o lagrangiano do pêndulo simples e derive a equação de movimento.",
    erro: "Escolher coordenadas que não descrevem todos os graus de liberdade e perder vínculos.",
  },
  "Mecânica dos corpos rígidos": {
    abre: "Corpo rígido gira e translada ao mesmo tempo. Torque, momento de inércia e momento angular são as versões rotacionais de força, massa e momento.",
    pratica: "Calcule o momento de inércia de uma barra em relação a uma ponta e a relação com o centro.",
    erro: "Usar a mesma inércia para qualquer eixo de rotação.",
  },
  "Mecânica celeste": {
    abre: "A gravitação organiza órbitas e marés. O problema de dois corpos mostra que a trajetória fechada é exceção, não regra.",
    pratica: "Derive a terceira lei de Kepler para uma órbita circular e discuta o caso elíptico.",
    erro: "Achar que a gravidade some no espaço: ela diminui com o quadrado da distância, não desaparece.",
  },
  "Oscilações e ondas mecânicas": {
    abre: "Oscilação é movimento que se repete, e onda é oscilação que viaja. Frequência, amplitude e fase descrevem os dois, e ressonância amplifica quando o ritmo coincide.",
    pratica: "Meça o período de um pêndulo com amplitudes diferentes e veja onde a aproximação de pequenos ângulos começa a falhar.",
    erro: "Somar amplitudes de ondas fora de fase como se estivessem sempre alinhadas.",
  },
  "Mecânica do contínuo": {
    abre: "Meios contínuos tratam matéria como distribuição de massa e tensão. Conservação e deformação descrevem fluidos, sólidos e materiais sem olhar átomo por átomo.",
    pratica: "Aplique a conservação de massa a um tubo com seção variável e relacione velocidade e área.",
    erro: "Tratar tensão como força: tensão é força por área.",
  },
  "Termodinâmica clássica": {
    abre: "Termodinâmica estuda energia, calor e trabalho em escala macroscópica. As leis dizem o que pode acontecer, mas não a velocidade de cada processo.",
    pratica: "Calcule o trabalho em uma expansão isotérmica e compare com uma adiabática no mesmo diagrama.",
    erro: "Dizer que calor é uma substância guardada no corpo: calor é energia em trânsito.",
  },
  "Transferência de calor": {
    abre: "Calor passa por condução, convecção e radiação. Cada mecanismo tem lei própria e escala própria, e juntos explicam do forno à atmosfera.",
    pratica: "Compare a perda de calor de uma parede por condução e de uma panela por radiação usando as leis de Fourier e Stefan-Boltzmann.",
    erro: "Aplicar a lei de condução a um fluido em movimento sem considerar convecção.",
  },
  "Mecânica estatística": {
    abre: "A mecânica estatística liga o microscópico ao macroscópico. Microestados, ensembles e entropia explicam por que a termodinâmica funciona sem acompanhar cada partícula.",
    pratica: "Conte os microestados de dois spins e mostre como a entropia cresce ao aumentar o número de partículas.",
    erro: "Confundir equilíbrio com repouso: equilíbrio estatístico tem muita agitação microscópica.",
  },
  "Física estatística de sistemas complexos": {
    abre: "Sistemas complexos ficam longe do equilíbrio e exibem fenômenos coletivos. Transições de fase e criticalidade mostram como o todo muda sem que a regra local mude.",
    pratica: "Estude um modelo de Ising pequeno e observe a magnetização perto da temperatura crítica.",
    erro: "Explicar o comportamento coletivo olhando uma partícula isolada.",
  },
  "Óptica geométrica": {
    abre: "A óptica geométrica trata a luz como raio. Reflexão, refração e lentes permitem construir imagens e instrumentos com traçado simples.",
    pratica: "Trace os raios de um objeto diante de uma lente convergente e classifique a imagem formada.",
    erro: "Usar a equação das lentes sem respeitar os sinais das convenções.",
  },
  "Óptica física": {
    abre: "Quando a luz se comporta como onda, aparecem interferência, difração e polarização. Esses efeitos não cabem no raio e revelam a natureza ondulatória.",
    pratica: "Faça a experiência de dupla fenda com uma lanterna e um cartão e estime o comprimento de onda pela separação das franjas.",
    erro: "Achar que duas fontes comuns produzem interferência estável: falta coerência.",
  },
  "Óptica quântica": {
    abre: "A óptica quântica descreve a luz por fótons e estados quânticos. Emissão, absorção e contagem de fótons explicam efeitos que a onda clássica não alcança.",
    pratica: "Explique o efeito fotoelétrico com a hipótese de Einstein e mostre por que a intensidade sozinha não resolve.",
    erro: "Dizer que o fóton é uma bolinha: ele é uma excitação do campo, com energia bem definida.",
  },
  "Fotônica e tecnologias ópticas": {
    abre: "Fotônica controla a luz para comunicar, medir e processar. Lasers, fibras e guias de onda transformam princípios ópticos em tecnologia.",
    pratica: "Trace a luz dentro de uma fibra por reflexão total interna e calcule o ângulo crítico para um vidro típico.",
    erro: "Ignorar perdas por dispersão e atenuação ao dimensionar um enlace óptico.",
  },
  "Relatividade especial": {
    abre: "A relatividade especial nasce da constância da velocidade da luz. Espaço e tempo deixam de ser absolutos e passam a se misturar em um único espaço-tempo.",
    pratica: "Calcule a dilatação temporal de um relógio em velocidade próxima à da luz e compare com a aproximação clássica.",
    erro: "Aplicar a soma clássica de velocidades em regime relativístico.",
  },
  "Relatividade geral": {
    abre: "A relatividade geral entende gravidade como geometria do espaço-tempo. Massa e energia curvam o espaço-tempo, e a curvatura diz como corpos se movem.",
    pratica: "Descreva a precessão do periélio de Mercúrio como efeito da curvatura e compare com a previsão newtoniana.",
    erro: "Pensar que a gravidade é só uma força que puxa: na relatividade geral, ela é a própria geometria.",
  },
  "Gravitação teórica": {
    abre: "Gravitação teórica testa os limites da relatividade geral. Teorias alternativas, gravitação semiclássica e singularidades indicam onde a teoria atual precisa de ajuda.",
    pratica: "Explique o problema da singularidade no centro de um buraco negro e por que a gravidade quântica é uma tentativa de resposta.",
    erro: "Tratar uma extrapolação matemática como previsão física sem discutir o domínio de validade.",
  },
  "Mecânica quântica": {
    abre: "Na mecânica quântica, estados e observáveis não são números comuns, e a medida altera o que se mede. A equação de Schrödinger descreve como o estado evolui.",
    pratica: "Resolva a partícula na caixa e compare os níveis de energia com o tamanho da caixa.",
    erro: "Imaginar a função de onda como trajetória da partícula: ela descreve amplitude de probabilidade.",
  },
  "Fundamentos quânticos": {
    abre: "Superposição, medição e emaranhamento são o coração conceitual da teoria. Interpretações diferentes discordam sobre o que a função de onda representa.",
    pratica: "Explique o experimento de Stern-Gerlach e o que a quantização do spin mostra sobre medição.",
    erro: "Dizer que a partícula está nos dois lugares ao mesmo tempo sem definir em que sentido a superposição é preparada.",
  },
  "Teoria quântica de campos": {
    abre: "Campos quânticos unem relatividade e mecânica quântica. Partículas aparecem como excitações do campo, e os diagramas de Feynman organizam cálculos de interação.",
    pratica: "Descreva a criação de um par partícula-antipartícula a partir de um campo e o papel da energia.",
    erro: "Confundir diagrama de Feynman com desenho de trajetórias reais.",
  },
  "Informação e tecnologias quânticas": {
    abre: "Qubits, portas e circuitos usam estados quânticos para processar informação. Emaranhamento e interferência permitem algoritmos sem análogo clássico direto.",
    pratica: "Monte um circuito de Hadamard seguido de medição e explique por que o resultado é aleatório.",
    erro: "Achar que um qubit guarda um bit escondido: a medição não revela um valor que já estava lá.",
  },
  "Física nuclear": {
    abre: "O núcleo é pequeno, denso e governado por força forte. Estrutura, radioatividade e reações nucleares explicam da estabilidade dos elementos à energia das estrelas.",
    pratica: "Compare a energia de ligação por núcleon de núcleos leves e pesados e relacione com fissão e fusão.",
    erro: "Confundir meia-vida com tempo de vida: metade da amostra decai em cada meia-vida, não toda ela.",
  },
  "Física de partículas": {
    abre: "A física de partículas organiza os constituintes elementares e suas interações. Quarks, léptons e bósons formam o Modelo Padrão, que ainda não é a palavra final.",
    pratica: "Classifique um conjunto de partículas por carga, spin e família e veja quais interações são permitidas.",
    erro: "Achar que o Modelo Padrão explica a gravidade ou a matéria escura.",
  },
  "Astropartículas": {
    abre: "Astropartículas chegam do espaço e trazem informação sobre os processos mais energéticos do Universo. Raios cósmicos, neutrinos e matéria escura são mensageiros e enigmas ao mesmo tempo.",
    pratica: "Explique por que neutrinos atravessam a Terra e por que isso os torna bons mensageiros astronômicos.",
    erro: "Tratar matéria escura como uma partícula já identificada: ela ainda não foi detectada diretamente.",
  },
  "Astronomia": {
    abre: "Astronomia observa o céu e mede posições, brilhos e espectros. Instrumentação e astrometria transformam luz antiga em distância, composição e movimento.",
    pratica: "Use o paralaxe de uma estrela próxima para estimar sua distância e discuta o limite do método.",
    erro: "Confundir magnitude aparente com luminosidade intrínseca.",
  },
  "Astrofísica": {
    abre: "Astrofísica aplica física a estrelas, planetas e galáxias. Formação, evolução e estrutura estelar explicam o que a luz conta sobre o passado do Universo.",
    pratica: "Desenhe o diagrama de Hertzsprung-Russell de um aglomerado e identifique a sequência principal.",
    erro: "Achar que toda estrela brilhante é grande: brilho aparente depende também da distância.",
  },
  "Cosmologia": {
    abre: "Cosmologia estuda o Universo como um todo. Expansão, radiação cósmica de fundo e formação de estruturas contam a história desde o início observável.",
    pratica: "Explique como o desvio para o vermelho de galáxias sustenta a expansão e por que ele não significa que estamos no centro.",
    erro: "Imaginar a expansão como galáxias voando para dentro de um espaço vazio já existente.",
  },
  "Ciências planetárias": {
    abre: "Ciências planetárias comparam mundos. Atmosferas, superfícies e interiores ligam a física de materiais à história de cada planeta.",
    pratica: "Compare a atmosfera de Vênus e a da Terra e discuta o efeito estufa em escalas diferentes.",
    erro: "Transferir uma explicação da Terra para outro planeta sem conferir pressão e composição.",
  },
};

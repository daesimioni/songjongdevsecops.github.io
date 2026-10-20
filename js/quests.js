// Missões: cada NPC tem uma pergunta ou uma tarefa. O objetivo é sempre
// verificável no estado do jogo, então a missão nunca "acha" que terminou.
import { backupCorrupt } from "./storage.js";
import { SITES, STORAGE } from "./config.js";

import { CATALOG_CONTENT } from "./catalog-gen.js";

export const QUESTS = [
  {
    id: "tres-passos",
    npc: "guia",
    giver: "Dona Zefa",
    title: "Três passos no mapa",
    brief: "Abra três estações. Quaisquer três. O mapa não cobra ordem, cobra caminhada.",
    goal: { type: "cards", count: 3 },
    reward: { xp: 24, title: "Aprendiz do Porto" },
  },
  {
    id: "sete-farois",
    npc: "guia",
    giver: "Dona Zefa",
    title: "Sete faróis acesos",
    brief: "Pise nos sete continentes. O farol acende quando você chega, não quando você espia de longe.",
    goal: { type: "docks", count: 7 },
    reward: { xp: 50, title: "Cartógrafo" },
  },
  {
    id: "mao-na-massa",
    npc: "guia",
    giver: "Dona Zefa",
    title: "Mão na massa",
    brief: "Mexa em oito instrumentos diferentes. Olhar não conta: clique, arraste, gire, aperte.",
    goal: { type: "labs", count: 8 },
    reward: { xp: 45, title: "Curioso perigoso" },
  },
  {
    id: "cacador",
    npc: "guia",
    giver: "Dona Zefa",
    title: "Caçador de perguntas",
    brief: "Desça numa caverna e derrube três monstros. Cada um guarda uma pergunta e deixa um item.",
    goal: { type: "hunts", count: 3 },
    reward: { xp: 45, title: "Caçador" },
  },
  {
    id: "voz-do-mundo",
    npc: "guia",
    giver: "Dona Zefa",
    title: "A voz do mundo",
    brief: "Mande uma mensagem no canal público e uma DM para alguém. A rede só existe quando alguém fala.",
    goal: { type: "social", keys: ["chat:public", "chat:dm"] },
    reward: { xp: 40, title: "Mensageiro" },
  },
  {
    id: "mundo-inteiro",
    npc: "guia",
    giver: "Dona Zefa",
    title: "O mundo inteiro",
    brief: "Duzentos e setenta e nove fragmentos, sete continentes e o catálogo inteiro, uma volta completa. Quando o mapa acabar, o Porto ainda vai estar aqui.",
    goal: { type: "cards", count: 279 },
    reward: { xp: 150, title: "Mundo de Song" },
  },
  {
    id: "vai-um",
    npc: "ada",
    giver: "Ada",
    title: "O vai um",
    brief: "Uma pergunta de fio. Se errar, o mundo não cai: você tenta de novo.",
    goal: { type: "quiz" },
    quiz: {
      question: "No meio somador, qual porta gera o transporte, o famoso vai um?",
      options: ["A porta E", "O OU exclusivo", "A porta NÃO"],
      answer: 0,
      why: "A soma de um bit é o OU exclusivo. O transporte só nasce quando as duas entradas são 1, e isso é o E.",
    },
    reward: { xp: 30, title: "Aprendiz de Ada" },
  },
  {
    id: "fios-vivos",
    npc: "ada",
    giver: "Ada",
    title: "Fios vivos",
    brief: "Abra as cinco estações da Computação. Um processador só faz sentido quando as partes conversam.",
    goal: { type: "cards", continent: "cs", count: 5 },
    reward: { xp: 40, title: "Fios Vivos" },
  },
  {
    id: "formas-puras",
    npc: "hypatia",
    giver: "Hypatia",
    title: "Formas puras",
    brief: "Visite as cinco estações da Matemática. O infinito, os sólidos, a curva, o acaso e a árvore.",
    goal: { type: "cards", continent: "math", count: 5 },
    reward: { xp: 40, title: "Formas Puras" },
  },
  {
    id: "hotel-infinito",
    npc: "hypatia",
    giver: "Hypatia",
    title: "O hotel lotado",
    brief: "Hilbert alugou todos os quartos de um hotel infinito. Chega mais um hóspede.",
    goal: { type: "quiz" },
    quiz: {
      question: "O hotel tem infinitos quartos, todos ocupados. O que ainda cabe fazer?",
      options: ["Nada, a lotação é total", "Construir um andar novo", "Pedir que cada hóspede vá para o quarto seguinte"],
      answer: 2,
      why: "Cada hóspede do quarto n vai para n+1, o quarto 1 fica livre e o novo hóspede entra. Infinito mais um continua infinito.",
    },
    reward: { xp: 30, title: "Hóspede do Infinito" },
  },
  {
    id: "medida-certa",
    npc: "marie",
    giver: "Marie",
    title: "Medida certa",
    brief: "As cinco estações da Física. Meça o pêndulo, a onda, o calor, a luz e a órbita.",
    goal: { type: "cards", continent: "physics", count: 5 },
    reward: { xp: 40, title: "Medida Certa" },
  },
  {
    id: "pendulo",
    npc: "marie",
    giver: "Marie",
    title: "O tempo do pêndulo",
    brief: "Um pêndulo simples, uma régua e um cronômetro. O que muda o período?",
    goal: { type: "quiz" },
    quiz: {
      question: "O período de um pêndulo simples depende principalmente de quê?",
      options: ["Da massa do peso", "Da cor do fio", "Do comprimento do fio"],
      answer: 2,
      why: "Para pequenas oscilações, T = 2π√(L/g). A massa não aparece na conta. O comprimento, sim.",
    },
    reward: { xp: 30, title: "Aprendiz de Marie" },
  },
  {
    id: "tabela-completa",
    npc: "mendeleev",
    giver: "Mendeleev",
    title: "Tabela completa",
    brief: "As cinco estações da Química. A tabela, as ligações, a titulação, a energia e o equilíbrio.",
    goal: { type: "cards", continent: "chem", count: 5 },
    reward: { xp: 40, title: "Tabela Completa" },
  },
  {
    id: "coluna",
    npc: "mendeleev",
    giver: "Mendeleev",
    title: "A coluna que se parece",
    brief: "A tabela tem colunas com personalidade. O que uma coluna compartilha?",
    goal: { type: "quiz" },
    quiz: {
      question: "Elementos na mesma coluna da tabela periódica têm em comum o quê?",
      options: ["A mesma camada de valência", "O mesmo número de massa", "O mesmo estado físico"],
      answer: 0,
      why: "A coluna agrupa quem tem a mesma configuração da camada de valência. Por isso o comportamento químico se repete.",
    },
    reward: { xp: 30, title: "Aprendiz de Mendeleev" },
  },
  {
    id: "razao-sonora",
    npc: "pythagoras",
    giver: "Pitágoras",
    title: "Razão sonora",
    brief: "As cinco estações da Música. Ritmo, intervalo, temperamento, timbre e a máquina de compor.",
    goal: { type: "cards", continent: "music", count: 5 },
    reward: { xp: 40, title: "Razão Sonora" },
  },
  {
    id: "oitava",
    npc: "pythagoras",
    giver: "Pitágoras",
    title: "A razão da oitava",
    brief: "Dobre a frequência e a nota se repete. Só falta dizer a razão.",
    goal: { type: "quiz" },
    quiz: {
      question: "Uma oitava acima corresponde a qual razão de frequência?",
      options: ["3 para 2", "5 para 4", "2 para 1"],
      answer: 2,
      why: "Dobrar a frequência dá a mesma nota uma oitava acima. A razão 2:1 é a mais simples que existe depois de 1:1.",
    },
    reward: { xp: 30, title: "Afinador" },
  },
  {
    id: "sala-de-maquinas",
    npc: "turing",
    giver: "Turing",
    title: "Sala de máquinas",
    brief: "As cinco estações de Inteligência Artificial. Dados, camadas, palavras, visão e limites.",
    goal: { type: "cards", continent: "ai", count: 5 },
    reward: { xp: 40, title: "Sala de Máquinas" },
  },
  {
    id: "pergunta-certa",
    npc: "turing",
    giver: "Turing",
    title: "A pergunta certa",
    brief: "Todo mundo pergunta se a máquina pensa. Eu perguntei outra coisa.",
    goal: { type: "quiz" },
    quiz: {
      question: "O teste de Turing foi proposto para medir o quê?",
      options: ["Se a máquina é consciente", "Se a conversa dela é indistinguível de uma humana", "A velocidade de processamento"],
      answer: 1,
      why: "O teste troca a pergunta impossível, se a máquina pensa, por uma observável: a conversa engana um juiz humano?",
    },
    reward: { xp: 30, title: "Aprendiz de Turing" },
  },
  {
    id: "quarto-chines",
    npc: "turing",
    giver: "Turing",
    title: "O quarto chinês",
    brief: "Uma pessoa dentro de um quarto responde em chinês seguindo regras. Ela entende a língua?",
    goal: { type: "quiz" },
    quiz: {
      question: "No argumento do quarto chinês, o que a pessoa demonstra saber?",
      options: ["Que entende chinês", "Que sabe seguir regras sem entender o significado", "Que criou a língua"],
      answer: 1,
      why: "O ponto é a diferença entre manipular símbolos e compreender. O argumento questiona se a máquina entende ou só executa.",
    },
    reward: { xp: 34, title: "Intérprete do Quarto" },
  },
  {
    id: "corda-nos",
    npc: "pythagoras",
    giver: "Pitágoras",
    title: "A corda de treze nós",
    brief: "Uma corda com doze espaços iguais faz um triângulo reto. Quais lados?",
    goal: { type: "quiz" },
    quiz: {
      question: "Qual trio forma um triângulo retângulo?",
      options: ["3, 4 e 5", "2, 3 e 4", "5, 6 e 7"],
      answer: 0,
      why: "3² + 4² = 9 + 16 = 25 = 5². Os egípcios usavam essa corda para acertar o ângulo reto.",
    },
    reward: { xp: 34, title: "Cordão de Treze Nós" },
  },
  {
    id: "queda-sem-ar",
    npc: "marie",
    giver: "Marie",
    title: "A queda sem ar",
    brief: "Sem resistência do ar, pena e martelo caem juntos. Por quê?",
    goal: { type: "quiz" },
    quiz: {
      question: "Por que a pena e o martelo caem juntos no vácuo?",
      options: ["Porque o martelo fica mais leve", "Porque a aceleração da gravidade é a mesma para os dois", "Porque a pena tem mais massa"],
      answer: 1,
      why: "A força é proporcional à massa, e a aceleração resultante é a mesma. Sem ar, não há empuxo nem arrasto.",
    },
    reward: { xp: 34, title: "Queda Livre" },
  },
  {
    id: "coluna-vazia",
    npc: "mendeleev",
    giver: "Mendeleev",
    title: "A coluna que faltava",
    brief: "Eu deixei buracos na tabela. O que eu esperava encontrar neles?",
    goal: { type: "quiz" },
    quiz: {
      question: "Mendeleev deixou buracos na tabela periódica porque...",
      options: ["Não sabia desenhar", "Acreditava que elementos ainda não descobertos ocupariam aqueles lugares", "Queria enfeitar"],
      answer: 1,
      why: "O padrão das propriedades pedia elementos ausentes; o gálio e o germânio apareceram depois perto do previsto.",
    },
    reward: { xp: 34, title: "Profeta da Tabela" },
  },
  {
    id: "quinta-e-oitava",
    npc: "pythagoras",
    giver: "Pitágoras",
    title: "A quinta e a oitava",
    brief: "Duas razões pequenas que o ouvido reconhece. Qual é a da quinta justa?",
    goal: { type: "quiz" },
    quiz: {
      question: "A quinta justa tem razão de frequência de...",
      options: ["2:1", "3:2", "4:3"],
      answer: 1,
      why: "3:2 é a quinta justa; 2:1 é a oitava; 4:3 é a quarta justa.",
    },
    reward: { xp: 34, title: "Ouvido de Razão" },
  },
  {
    id: "exemplo-enganoso",
    npc: "turing",
    giver: "Turing",
    title: "O exemplo que engana",
    brief: "Um modelo acerta todo o treino e erra a rua. Que nome tem isso?",
    goal: { type: "quiz" },
    quiz: {
      question: "Um modelo que acerta o treino e erra dados novos tem...",
      options: ["subajuste", "sobreajuste", "viés de hardware"],
      answer: 1,
      why: "Sobreajuste é decorar o treino, incluindo o ruído. O teste em dados separados revela a diferença.",
    },
    reward: { xp: 34, title: "Olho de Teste" },
  },
  {
    id: "palavra-certa",
    npc: "alzira",
    giver: "Professora Alzira",
    title: "A palavra certa",
    brief: "Uma frase, uma crase e uma escolha. Se errar, ninguém morre: você tenta de novo.",
    goal: { type: "quiz" },
    quiz: {
      question: "Qual frase usa a crase corretamente?",
      options: ["Vou a escola.", "Vou à escola.", "Vou há escola."],
      answer: 1,
      why: "Vou a algum lugar, e escola pede artigo: a + a = à. A forma de testar é trocar por um substantivo masculino: vou ao colégio.",
    },
    reward: { xp: 30, title: "Guardião da Crase" },
  },
  {
    id: "vale-das-letras",
    npc: "alzira",
    giver: "Professora Alzira",
    title: "O vale inteiro",
    brief: "Visite as cinco estações do Vale da Língua. O som, a palavra, a frase, o texto e o acento.",
    goal: { type: "cards", continent: "lingua", count: 5 },
    reward: { xp: 40, title: "Leitor do Vale" },
  },
  {
    id: "corrente-sem-ima-parado",
    npc: "faraday",
    giver: "Faraday",
    title: "Ímã parado, agulha parada",
    brief: "A bobina do vale só responde quando o fluxo muda. Qual é a condição?",
    goal: { type: "quiz" },
    quiz: {
      question: "O que faz aparecer corrente induzida numa bobina?",
      options: ["A variação do fluxo magnético", "Um ímã parado ao lado", "Aquecer o fio"],
      answer: 0,
      why: "A lei de Faraday liga a força eletromotriz à taxa de variação do fluxo. Ímã parado não muda o fluxo e não gera corrente.",
    },
    reward: { xp: 32, title: "Aprendiz de Faraday" },
  },
  {
    id: "ciclo-completo",
    npc: "vonneumann",
    giver: "Von Neumann",
    title: "O ciclo completo",
    brief: "Buscar, decodificar, executar e gravar. Qual é a ordem do ciclo?",
    goal: { type: "quiz" },
    quiz: {
      question: "Qual é a ordem do ciclo de instrução?",
      options: ["buscar, decodificar, executar", "executar, buscar, decodificar", "decodificar, gravar, buscar"],
      answer: 0,
      why: "A CPU busca a instrução na memória, decodifica o que ela manda e só então executa. No fim, grava o resultado.",
    },
    reward: { xp: 32, title: "Arquiteto de Bolso" },
  },
  {
    id: "jogo-do-epsilon",
    npc: "cauchy",
    giver: "Cauchy",
    title: "O jogo do épsilon",
    brief: "A margem que você aceita no resultado decide o quanto precisa se aproximar na entrada.",
    goal: { type: "quiz" },
    quiz: {
      question: "O que a definição épsilon-delta de limite garante?",
      options: [
        "Para todo épsilon existe um delta que mantém f(x) perto do limite",
        "Que a função sempre alcança o limite no ponto",
        "Que o limite é sempre um número inteiro",
      ],
      answer: 0,
      why: "Você escolhe a margem do resultado, e a definição cobra uma margem na entrada. Se dá para vencer para qualquer épsilon, o limite existe e vale L.",
    },
    reward: { xp: 36, title: "Aprendiz de Cauchy" },
  },
  {
    id: "anel-que-nao-fecha",
    npc: "kekule",
    giver: "Kekulé",
    title: "O anel que não fecha",
    brief: "Seis carbonos, seis hidrogênios e uma simetria que não deixa o desenho parar quieto.",
    goal: { type: "quiz" },
    quiz: {
      question: "Por que o benzeno é representado por um anel com um círculo no meio?",
      options: [
        "Porque os elétrons pi estão deslocalizados pelos seis carbonos",
        "Porque ele tem seis ligações simples fixas",
        "Porque ele é um hidrocarboneto de cadeia aberta",
      ],
      answer: 0,
      why: "O anel tem seis carbonos com elétrons pi que circulam por igual. O círculo resume isso: não há uma ligação dupla fixa em cada posição.",
    },
    reward: { xp: 34, title: "Guardião do Anel" },
  },
  {
    id: "nota-que-insiste",
    npc: "helmholtz",
    giver: "Helmholtz",
    title: "A nota que insiste",
    brief: "Toda taça tem uma frequência preferida. O que precisa acontecer para ela responder?",
    goal: { type: "quiz" },
    quiz: {
      question: "O que provoca ressonância num corpo?",
      options: [
        "Uma vibração na frequência natural dele",
        "Qualquer som, desde que alto",
        "Uma vibração muito acima da natural",
      ],
      answer: 0,
      why: "Quando a excitação bate com um modo natural, a energia se acumula ciclo após ciclo e a amplitude cresce. Fora dessa frequência, o corpo responde pouco.",
    },
    reward: { xp: 34, title: "Ouvinte de Helmholtz" },
  },
  {
    id: "borda-que-denuncia",
    npc: "marr",
    giver: "Marr",
    title: "A borda que denuncia",
    brief: "O kernel pequeno desliza pela imagem e procura uma mudança brusca. O que ele destaca?",
    goal: { type: "quiz" },
    quiz: {
      question: "O que um filtro de convolução para bordas destaca na imagem?",
      options: [
        "Mudanças bruscas de intensidade entre vizinhos",
        "A cor média da imagem inteira",
        "O nome dos objetos presentes",
      ],
      answer: 0,
      why: "O kernel compara vizinhos: onde a intensidade muda rápido, a resposta é alta. É assim que a rede começa a separar contorno de superfície.",
    },
    reward: { xp: 36, title: "Olho de Marr" },
  },
  {
    id: "narrador-duvida",
    npc: "machado",
    giver: "Machado",
    title: "A versão de quem conta",
    brief: "Bentinho conta a própria história com muita certeza. O que o leitor deve fazer com essa certeza?",
    goal: { type: "quiz" },
    quiz: {
      question: "O que caracteriza um narrador não confiável?",
      options: [
        "Conta a história de um ponto de vista que pode distorcer os fatos",
        "Nunca participa da história",
        "Sabe exatamente o que todos pensam",
      ],
      answer: 0,
      why: "O narrador não confiável tem limite ou interesse, e o texto dá pistas para o leitor duvidar. Em Dom Casmurro, a acusação de Bentinho é a versão dele, não a verdade do romance.",
    },
    reward: { xp: 36, title: "Leitor Desconfiado" },
  },
  {
    id: "pacote-que-desvia",
    npc: "baran",
    giver: "Barán",
    title: "O pacote que desvia",
    brief: "A rede não reserva um caminho fixo. O que ela faz com cada pedaço da mensagem?",
    goal: { type: "quiz" },
    quiz: {
      question: "Por que a comutação de pacotes é mais resiliente que a de circuito?",
      options: [
        "Cada pacote pode seguir por outro caminho se um enlace cair",
        "Ela reserva uma linha exclusiva para cada conversa",
        "Ela não precisa de endereço de destino",
      ],
      answer: 0,
      why: "Como cada pacote carrega destino e é encaminhado salto a salto, a rede pode desviar de um enlace quebrado. A linha exclusiva é justamente o oposto.",
    },
    reward: { xp: 36, title: "Cartógrafo de Rotas" },
  },
  {
    id: "nada-se-perde",
    npc: "carnot",
    giver: "Carnot",
    title: "Nada se perde, tudo se espalha",
    brief: "Uma máquina térmica não converte todo o calor em trabalho. Por que sobra sempre alguma coisa?",
    goal: { type: "quiz" },
    quiz: {
      question: "Por que nenhuma máquina térmica converte todo o calor recebido em trabalho?",
      options: [
        "Porque parte do calor precisa ser rejeitada para a fonte fria",
        "Porque o atrito sempre consome todo o calor",
        "Porque a energia se transforma em massa",
      ],
      answer: 0,
      why: "A segunda lei exige uma fonte fria: o rendimento máximo é 1 - Tf/Tq. Sem rejeitar calor, o ciclo não fecha.",
    },
    reward: { xp: 38, title: "Aprendiz de Carnot" },
  },
  {
    id: "branco-e-multidao",
    npc: "huygens",
    giver: "Huygens",
    title: "O branco é uma multidão",
    brief: "A luz branca atravessa um prisma e sai colorida. Por que as cores se separam?",
    goal: { type: "quiz" },
    quiz: {
      question: "Por que o prisma separa a luz branca em cores?",
      options: [
        "Porque o índice de refração depende da frequência",
        "Porque o vidro aquece a luz",
        "Porque a luz perde energia ao entrar",
      ],
      answer: 0,
      why: "Cada frequência muda de velocidade de um jeito e desvia num ângulo diferente. O violeta desvia mais que o vermelho.",
    },
    reward: { xp: 38, title: "Aprendiz de Huygens" },
  },
  {
    id: "segredo-em-publico",
    npc: "diffie",
    giver: "Diffie",
    title: "Segredo em público",
    brief: "Duas pessoas querem combinar uma chave sem que ninguém que escuta consiga descobri-la. Como?",
    goal: { type: "quiz" },
    quiz: {
      question: "O que a troca de chaves de Diffie-Hellman permite?",
      options: [
        "Combinar um segredo por um canal público sem revelá-lo",
        "Cifrar sem nenhuma chave",
        "Guardar senhas em texto",
      ],
      answer: 0,
      why: "As duas partes trocam valores públicos e calculam o mesmo segredo. Quem escuta vê os valores, mas não consegue calcular o segredo.",
    },
    reward: { xp: 38, title: "Guardião da Chave" },
  },
  {
    id: "amostra-honesta",
    npc: "liebig",
    giver: "Liebig",
    title: "A amostra honesta",
    brief: "Um resultado preciso pode estar errado se a amostra não representar o todo. O que fazer?",
    goal: { type: "quiz" },
    quiz: {
      question: "O que faz uma amostra ser representativa?",
      options: [
        "Manter a mesma composição do todo que se quer medir",
        "Ser a maior quantidade possível",
        "Ser coletada sempre no mesmo ponto",
      ],
      answer: 0,
      why: "Representar é manter a proporção do todo. Coletar sempre no mesmo ponto pode ser preciso e enviesado ao mesmo tempo.",
    },
    reward: { xp: 36, title: "Olho Analítico" },
  },
  {
    id: "motivo-que-volta",
    npc: "schoenberg",
    giver: "Schoenberg",
    title: "O motivo que volta",
    brief: "Uma forma musical vive de repetir e mudar. O que a variação precisa preservar?",
    goal: { type: "quiz" },
    quiz: {
      question: "O que uma variação musical preserva do tema?",
      options: [
        "A identidade reconhecível, mesmo mudando ritmo, harmonia ou timbre",
        "Exatamente as mesmas notas e o mesmo andamento",
        "Apenas o título da peça",
      ],
      answer: 0,
      why: "A variação transforma a superfície e mantém a estrutura reconhecível. Se nada muda, é repetição; se tudo muda, o tema desaparece.",
    },
    reward: { xp: 38, title: "Arquiteto de Formas" },
  },
  {
    id: "moeda-sem-memoria",
    npc: "laplace",
    giver: "Laplace",
    title: "A moeda sem memória",
    brief: "Deu cara dez vezes. A moeda justa deve coroa na próxima? O que a independência diz?",
    goal: { type: "quiz" },
    quiz: {
      question: "Depois de dez caras numa moeda justa, a probabilidade de coroa no próximo lance é...",
      options: ["1/2, porque os lances são independentes", "maior que 1/2, para compensar", "zero, porque a sequência continua"],
      answer: 0,
      why: "A moeda não tem memória. A probabilidade continua 1/2. O que se aproxima da média é a proporção em muitas jogadas, não o próximo resultado.",
    },
    reward: { xp: 38, title: "Apostador Cético" },
  },
  {
    id: "janela-curta",
    npc: "chomsky",
    giver: "Chomsky",
    title: "A janela curta",
    brief: "O modelo só vê o que cabe no contexto. O que acontece com o que ficou de fora?",
    goal: { type: "quiz" },
    quiz: {
      question: "O que acontece com uma informação que fica fora da janela de contexto?",
      options: [
        "O modelo não a considera ao gerar a resposta",
        "O modelo lembra dela para sempre",
        "Ela é apagada do texto original",
      ],
      answer: 0,
      why: "A janela é o limite do que entra no cálculo. Informação fora dela não influencia a resposta, mesmo que esteja no histórico da conversa.",
    },
    reward: { xp: 38, title: "Leitor de Contexto" },
  },
  {
    id: "entre-as-linhas",
    npc: "saussure",
    giver: "Saussure",
    title: "Entre as linhas",
    brief: "Alguém diz “está calor aqui” e abre a janela. O que a frase estava fazendo?",
    goal: { type: "quiz" },
    quiz: {
      question: "Quando alguém diz “está calor aqui” e espera que você abra a janela, o que ocorreu?",
      options: [
        "Um ato de fala indireto: a constatação funciona como pedido",
        "Um erro de semântica",
        "Uma pressuposição falsa",
      ],
      answer: 0,
      why: "A frase constata um fato, mas no contexto realiza um pedido. A pragmática estuda essa distância entre o literal e a ação.",
    },
    reward: { xp: 38, title: "Leitor de Entrelinhas" },
  },
];

QUESTS.push(...CATALOG_CONTENT.quests);

const QUEST_BY_ID = new Map(QUESTS.map((q) => [q.id, q]));

function readData() {
  try {
    const raw = localStorage.getItem(STORAGE.quests);
    const obj = raw ? JSON.parse(raw) : null;
    if (!obj || typeof obj !== "object") return {};
    return {
      accepted: obj.accepted && typeof obj.accepted === "object" ? obj.accepted : {},
      done: obj.done && typeof obj.done === "object" ? obj.done : {},
      quiz: obj.quiz && typeof obj.quiz === "object" ? obj.quiz : {},
      stats: obj.stats && typeof obj.stats === "object" ? obj.stats : {},
      titles: Array.isArray(obj.titles) ? obj.titles.filter((t) => typeof t === "string") : [],
      title: typeof obj.title === "string" ? obj.title : "",
    };
  } catch { return {}; }
}
function emptyData() {
  return { accepted: {}, done: {}, quiz: {}, stats: {}, titles: [], title: "" };
}

export class Quests {
  constructor({ getCards, getDocks, gainXp, onReady, onChange, toast } = {}) {
    this.getCards = getCards || (() => new Set());
    this.getDocks = getDocks || (() => new Set());
    this.gainXp = gainXp || (() => {});
    this.onReady = onReady || (() => {});
    this.onChange = onChange || (() => {});
    this.toast = toast || (() => {});
    backupCorrupt(STORAGE.quests);
    this.data = { ...emptyData(), ...readData() };
    if (!this.data.stats.labs || !Array.isArray(this.data.stats.labs)) this.data.stats.labs = [];
    this.readyNotified = new Set();
    for (const q of QUESTS) {
      if (this.data.accepted[q.id] && this.ready(q)) this.readyNotified.add(q.id);
    }
  }

  save() {
    try { localStorage.setItem(STORAGE.quests, JSON.stringify(this.data)); } catch { /* sem storage */ }
  }

  get titles() { return this.data.titles.slice(); }
  get title() { return this.data.title || ""; }

  isDone(id) { return !!this.data.done[id]; }
  isAccepted(id) { return !!this.data.accepted[id]; }

  offersFor(npc) {
    return QUESTS.filter((q) => q.npc === npc);
  }

  markFor(npc) {
    const offers = this.offersFor(npc);
    if (!offers.length) return "";
    if (offers.some((q) => this.ready(q))) return "ready";
    if (offers.some((q) => !this.isDone(q.id) && !this.isAccepted(q.id))) return "available";
    return "";
  }

  progress(q) {
    if (!q) return { have: 0, need: 1 };
    const goal = q.goal;
    let have = 0;
    let need = 1;
    if (goal.type === "cards") {
      need = goal.count;
      have = goal.continent
        ? SITES.filter((s) => s.continent === goal.continent && this.getCards().has(s.post)).length
        : this.getCards().size;
    } else if (goal.type === "docks") {
      need = goal.count;
      // área temática também marca doca, com prefixo; o Cartógrafo conta
      // continentes, não pedaços deles.
      have = [...this.getDocks()].filter((id) => !id.startsWith("area:")).size;
    } else if (goal.type === "labs") {
      need = goal.count;
      have = this.data.stats.labs.length;
    } else if (goal.type === "hunts") {
      need = goal.count;
      have = Number(this.data.stats.hunts || 0);
    } else if (goal.type === "social") {
      need = goal.keys.length;
      have = goal.keys.filter((k) => Number(this.data.stats[k] || 0) > 0).length;
    } else if (goal.type === "quiz") {
      need = 1;
      have = this.data.quiz[q.id] ? 1 : 0;
    }
    return { have: Math.min(have, need), need };
  }

  ready(q) {
    if (!q || this.isDone(q.id) || !this.isAccepted(q.id)) return false;
    const { have, need } = this.progress(q);
    return have >= need;
  }

  accept(id) {
    const q = QUEST_BY_ID.get(id);
    if (!q || this.isDone(id) || this.isAccepted(id)) return false;
    this.data.accepted[id] = Date.now();
    this.save();
    this.changed();
    return true;
  }

  answer(id, index) {
    const q = QUEST_BY_ID.get(id);
    if (!q?.quiz) return { ok: false };
    if (this.data.quiz[id]) return { ok: true, correct: true, why: q.quiz.why, already: true };
    const correct = Number(index) === q.quiz.answer;
    if (correct) {
      this.data.quiz[id] = true;
      this.save();
      this.changed();
    }
    return { ok: true, correct, why: q.quiz.why };
  }

  complete(id) {
    const q = QUEST_BY_ID.get(id);
    if (!q || !this.ready(q)) return { ok: false };
    this.data.done[id] = Date.now();
    delete this.data.accepted[id];
    this.readyNotified.delete(id);
    if (q.reward?.title && !this.data.titles.includes(q.reward.title)) {
      this.data.titles.push(q.reward.title);
    }
    if (q.reward?.title) this.data.title = q.reward.title;
    this.save();
    if (q.reward?.xp) this.gainXp(q.reward.xp);
    this.changed();
    return { ok: true, quest: q, xp: q.reward?.xp || 0, title: q.reward?.title || "" };
  }

  report(kind, value) {
    if (!kind) return;
    let changed = false;
    if (kind === "lab") {
      if (value && !this.data.stats.labs.includes(value)) {
        this.data.stats.labs.push(value);
        changed = true;
      }
    } else {
      this.data.stats[kind] = Number(this.data.stats[kind] || 0) + 1;
      changed = true;
    }
    if (!changed) return;
    this.save();
    this.changed();
  }

  changed() {
    for (const q of QUESTS) {
      if (!this.ready(q) || this.readyNotified.has(q.id)) continue;
      this.readyNotified.add(q.id);
      this.toast(`${q.title} pronta. Volte e fale com ${q.giver}.`, 4600);
      this.onReady?.(q);
    }
    this.onChange?.();
  }

  active() {
    return QUESTS.filter((q) => this.isAccepted(q.id) && !this.isDone(q.id));
  }

  done() {
    return QUESTS.filter((q) => this.isDone(q.id));
  }

  setTitle(title) {
    const t = String(title || "");
    if (!this.data.titles.includes(t)) return false;
    this.data.title = t;
    this.save();
    this.onChange?.();
    return true;
  }
}

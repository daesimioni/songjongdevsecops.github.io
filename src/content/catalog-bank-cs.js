// Banco de conteúdo de Computação: uma seção por área, três tópicos por área.
// Cada tópico é uma estação (página) e uma pergunta de monstro.

export const CS_BANK = {
  cs: {
    "cs-fundamentos": [
      {
        name: "Representação da informação",
        def: "Computador guarda tudo em bits. Texto, imagem, som e número viram sequências binárias com regra combinada.",
        keys: [
          "Binário usa duas potências: 0 e 1.",
          "Hexadecimal encurta a escrita de quatro bits.",
          "Ponto flutuante aproxima reais e tem erro de arredondamento.",
        ],
        mistake: "Achar que 0,1 + 0,2 dá exatamente 0,3 em ponto flutuante.",
        q: {
          q: "Quantos bits tem um dígito hexadecimal?",
          o: ["4", "8", "2", "16", "1", "10"],
          a: 0,
          why: "Cada dígito hexadecimal representa quatro bits, por isso agrupar bits fica curto.",
        },
      },
      {
        name: "Lógica digital",
        def: "Portas lógicas combinam bits por operações booleanas. Circuitos montam somas, comparações e memória.",
        keys: [
          "AND só dá 1 com as duas entradas em 1.",
          "OR dá 1 se qualquer entrada for 1.",
          "Flip-flop guarda um bit.",
        ],
        mistake: "Confundir porta OR com XOR: no XOR, entradas iguais dão 0.",
        q: {
          q: "Qual porta dá 1 apenas quando as entradas são diferentes?",
          o: ["XOR", "AND", "OR", "NOR", "NAND", "NOT"],
          a: 0,
          why: "O ou-exclusivo liga só na diferença: 0 com 1 ou 1 com 0.",
        },
      },
      {
        name: "Fundamentos de programação",
        def: "Programa é sequência de instruções sobre dados. Variáveis, condicionais, repetições e funções compõem o básico.",
        keys: [
          "Função recebe dados e devolve resultado, com nome próprio.",
          "Condicional escolhe caminho conforme teste.",
          "Repetição executa enquanto a condição valer.",
        ],
        mistake: "Esquecer de atualizar a variável da condição e travar em laço infinito.",
        q: {
          q: "O que garante o fim de uma repetição simples?",
          o: ["A condição ficar falsa em algum momento", "O computador parar sozinho", "Usar sempre soma", "Declarar a variável fora do laço", "Chamar a função dentro do laço", "Usar mais memória"],
          a: 0,
          why: "Sem alterar o estado que a condição lê, o laço nunca termina.",
        },
      },
    ],
    "cs-algoritmos": [
      {
        name: "Algoritmos clássicos",
        def: "Algoritmos resolvem tarefas conhecidas por passos finitos. Busca e ordenação são os exemplos de entrada.",
        keys: [
          "Busca binária exige lista ordenada.",
          "Divisão e conquista quebra o problema em partes menores.",
          "Programação dinâmica guarda resultados para não repetir conta.",
        ],
        mistake: "Usar busca binária em lista desordenada.",
        q: {
          q: "O que a busca binária exige da lista?",
          o: ["Estar ordenada", "Ter tamanho par", "Ter números inteiros", "Ser pequena", "Estar em memória secundária", "Ter elementos únicos"],
          a: 0,
          why: "Ela descarta metade a cada passo comparando com o elemento do meio; sem ordem, a comparação não vale.",
        },
      },
      {
        name: "Estruturas de dados",
        def: "Estrutura organiza dados para a operação ser barata: pilha, fila, lista, árvore, tabela hash e grafo.",
        keys: [
          "Pilha empilha e desempilha no topo.",
          "Fila atende por ordem de chegada.",
          "Tabela hash acha por chave quase direto.",
        ],
        mistake: "Usar lista para busca por chave e depois estranhar a lentidão.",
        q: {
          q: "Qual estrutura atende primeiro o que chegou primeiro?",
          o: ["Fila", "Pilha", "Árvore binária", "Tabela hash", "Grafo", "Heap"],
          a: 0,
          why: "A fila é FIFO: entra no fim, sai do começo.",
        },
      },
      {
        name: "Complexidade",
        def: "Complexidade descreve como o custo cresce com o tamanho da entrada. Importa a tendência, não o segundo exato.",
        keys: [
          "Busca linear é proporcional ao tamanho.",
          "Busca binária cresce com o logaritmo do tamanho.",
          "Ordenação por comparação não desce do n log n.",
        ],
        mistake: "Comparar algoritmos só com entrada pequena e concluir que são iguais.",
        q: {
          q: "O que O(n log n) indica numa ordenação?",
          o: ["Crescimento próximo do limite teórico de comparações", "Execução instantânea", "Custo constante", "Custo quadrático", "Uso de memória zero", "Erro de arredondamento"],
          a: 0,
          why: "É o limite conhecido para ordenar por comparação; quicksort e mergesort chegam perto disso.",
        },
      },
    ],
    "cs-teorica": [
      {
        name: "Computabilidade",
        def: "Computabilidade pergunta o que pode ser resolvido por passos mecânicos. Existem problemas sem algoritmo.",
        keys: [
          "Máquina de Turing é o modelo de referência.",
          "Problema da parada não tem solução geral.",
          "Função computável tem procedimento finito que a calcula.",
        ],
        mistake: "Achar que todo problema bem definido pode ser programado.",
        q: {
          q: "O que o problema da parada demonstra?",
          o: ["Que nem todo problema tem algoritmo que sempre decida", "Que programas sempre terminam", "Que a memória é infinita", "Que toda linguagem é igual", "Que a recursão é proibida", "Que o tempo importa mais que o espaço"],
          a: 0,
          why: "É indecidível saber, para todo programa e entrada, se ele para.",
        },
      },
      {
        name: "Complexidade",
        def: "Classes de complexidade agrupam problemas de custo parecido. P e NP são as mais conhecidas.",
        keys: [
          "P são problemas resolvidos em tempo polinomial.",
          "NP são problemas cuja solução se verifica em tempo polinomial.",
          "NP-completo é o mais difícil dentro de NP.",
        ],
        mistake: "Concluir que P é diferente de NP: isso continua aberto.",
        q: {
          q: "O que significa NP?",
          o: ["A solução pode ser verificada em tempo polinomial", "É impossível resolver", "Resolve em tempo constante", "Usa memória infinita", "É sempre exponencial", "Não tem algoritmo"],
          a: 0,
          why: "NP trata da verificação rápida de uma resposta dada, não de encontrá-la rápido.",
        },
      },
      {
        name: "Autômatos e linguagens",
        def: "Autômatos reconhecem linguagens. A hierarquia vai do autômato finito à máquina de Turing.",
        keys: [
          "Autômato finito reconhece linguagem regular.",
          "Expressão regular descreve linguagem regular.",
          "Autômato com pilha reconhece linguagem livre de contexto.",
        ],
        mistake: "Tentar reconhecer parênteses balanceados com autômato finito puro.",
        q: {
          q: "Que máquina reconhece linguagem livre de contexto?",
          o: ["Autômato com pilha", "Autômato finito", "Máquina de Turing apenas", "Circuito combinacional", "Tabela hash", "Árvore binária"],
          a: 0,
          why: "A pilha guarda aninhamento, o que o autômato finito não consegue lembrar.",
        },
      },
    ],
    "cs-linguagens": [
      {
        name: "Paradigmas",
        def: "Paradigma é o jeito de organizar o programa: imperativo, funcional, orientado a objetos, lógico e reativo.",
        keys: [
          "Funcional trata cálculo como composição de funções.",
          "Orientado a objetos agrupa estado e comportamento.",
          "Imperativo descreve passo a passo do estado.",
        ],
        mistake: "Achar que uma linguagem pertence a um único paradigma.",
        q: {
          q: "O que caracteriza o paradigma funcional?",
          o: ["Compor funções e evitar estado mutável", "Usar só variáveis globais", "Executar linha a linha sem funções", "Guardar tudo em objetos", "Depender de herança", "Usar apenas ponteiros"],
          a: 0,
          why: "O foco é transformar valores por funções, evitando efeitos colaterais.",
        },
      },
      {
        name: "Compiladores",
        def: "Compilador traduz código para outra forma: léxico, sintaxe, semântica, representação intermediária e geração.",
        keys: [
          "Análise léxica quebra o texto em tokens.",
          "Análise sintática monta árvore conforme a gramática.",
          "Otimização reescreve mantendo o comportamento.",
        ],
        mistake: "Achar que erro de sintaxe é erro de lógica do programa.",
        q: {
          q: "O que a análise sintática faz?",
          o: ["Monta a árvore conforme a gramática da linguagem", "Traduz para binário final", "Otimiza o código", "Remove comentários", "Executa o programa", "Aloca memória"],
          a: 0,
          why: "Ela confere a estrutura das frases do programa, não o sentido final.",
        },
      },
      {
        name: "Sistemas de tipos",
        def: "Tipos classificam valores e limitam operações. Tipagem estática confere antes de executar; dinâmica, durante.",
        keys: [
          "Tipo estático pega erro cedo.",
          "Tipo dinâmico dá flexibilidade e adia o erro.",
          "Polimorfismo permite a mesma operação em tipos diferentes.",
        ],
        mistake: "Confundir tipagem estática com tipagem forte: são eixos diferentes.",
        q: {
          q: "O que a tipagem estática faz?",
          o: ["Confere os tipos antes da execução", "Checa tipos só em execução", "Elimina todos os erros", "Dispensa testes", "Troca tipos automaticamente", "Aumenta a memória"],
          a: 0,
          why: "O compilador verifica os tipos na compilação e recusa o programa antes de rodar.",
        },
      },
    ],
    "cs-engenharia": [
      {
        name: "Requisitos e arquitetura",
        def: "Requisitos dizem o que o sistema precisa fazer; arquitetura diz como as partes se organizam para isso.",
        keys: [
          "Requisito funcional descreve comportamento.",
          "Requisito não funcional descreve qualidade, como desempenho e segurança.",
          "Acoplamento baixo e coesão alta facilitam mudar.",
        ],
        mistake: "Começar a codar sem saber o critério de aceitação do requisito.",
        q: {
          q: "O que é requisito não funcional?",
          o: ["Uma qualidade do sistema, como desempenho ou segurança", "Uma tela do sistema", "Um caso de uso", "Uma regra de negócio", "Um teste unitário", "Uma tabela do banco"],
          a: 0,
          why: "Ele não descreve o que o sistema faz, mas como ele deve se comportar.",
        },
      },
      {
        name: "Testes de software",
        def: "Teste compara comportamento esperado com o obtido. A pirâmide vai de unitário a integração e sistema.",
        keys: [
          "Teste unitário isola a menor parte.",
          "Teste de integração verifica a ligação entre partes.",
          "Teste de regressão impede que algo já corrigido quebre de novo.",
        ],
        mistake: "Achar que passar nos testes unitários garante o sistema inteiro funcionando.",
        q: {
          q: "Para que serve o teste de regressão?",
          o: ["Garantir que algo que já funcionava não quebrou", "Testar só a interface", "Medir a velocidade da rede", "Aumentar a cobertura sem motivo", "Substituir o teste unitário", "Documentar o código"],
          a: 0,
          why: "Ele repete as verificações antigas a cada mudança para pegar quebra silenciosa.",
        },
      },
      {
        name: "Ciclo de vida",
        def: "Ciclo de vida organiza o trabalho: requisito, projeto, construção, teste, entrega e manutenção.",
        keys: [
          "Integração contínua junta e testa a cada mudança.",
          "Entrega contínua deixa o software pronto para sair.",
          "Dívida técnica é atraso consciente que cobra juros.",
        ],
        mistake: "Achar que entrega contínua significa publicar sem controle.",
        q: {
          q: "O que é dívida técnica?",
          o: ["Solução mais rápida que deixa custo para depois", "Um empréstimo bancário do time", "Um bug obrigatório", "Uma tarefa de design", "Uma métrica de vendas", "Um tipo de teste"],
          a: 0,
          why: "A escolha apressada funciona agora, mas cobra manutenção maior mais tarde.",
        },
      },
    ],
    "cs-sistemas": [
      {
        name: "Processos e concorrência",
        def: "Processo é programa em execução, com memória própria. Threads compartilham memória e precisam de sincronização.",
        keys: [
          "Escalonador decide quem roda na CPU.",
          "Condição de corrida acontece sem sincronização.",
          "Deadlock é espera circular que trava tudo.",
        ],
        mistake: "Proteger tudo com um único lock e chamar isso de solução eficiente.",
        q: {
          q: "Duas threads alteram a mesma variável sem sincronizar. O que pode acontecer?",
          o: ["O resultado depender da ordem de execução", "O programa compilar mais rápido", "A memória dobrar", "O disco encher", "O processo virar thread", "A CPU reduzir o clock"],
          a: 0,
          why: "Sem sincronização, a ordem das leituras e escritas muda o valor final.",
        },
      },
      {
        name: "Memória virtual",
        def: "Memória virtual dá a cada processo a ilusão de espaço contínuo, com páginas trazidas do disco quando necessário.",
        keys: [
          "Paginação divide a memória em blocos do mesmo tamanho.",
          "Falta de página faz o sistema buscar no disco.",
          "Memória swap é lenta comparada à RAM.",
        ],
        mistake: "Achar que aumentar swap resolve falta de memória física sem custo.",
        q: {
          q: "O que acontece numa falta de página?",
          o: ["O sistema busca a página no armazenamento", "O processo é apagado", "A CPU desliga", "A memória é liberada toda", "O disco é formatado", "A página vira cache"],
          a: 0,
          why: "A página faltante é carregada do disco para a RAM, o que custa tempo.",
        },
      },
      {
        name: "Sistemas de arquivos",
        def: "Sistema de arquivos organiza dados em arquivos e diretórios, com metadados, permissões e journaling.",
        keys: [
          "Permissão controla leitura, escrita e execução.",
          "Journaling registra a intenção antes de aplicar.",
          "Cache acelera leitura e escrita.",
        ],
        mistake: "Achar que apagar o arquivo garante que o dado desapareceu do disco.",
        q: {
          q: "Para que serve o journaling?",
          o: ["Registrar operações para recuperar o sistema depois de queda", "Acelerar a internet", "Compactar arquivos", "Criptografar tudo", "Aumentar a RAM", "Limpar o cache"],
          a: 0,
          why: "O diário de operações permite refazer ou desfazer o que ficou pela metade.",
        },
      },
    ],
    "cs-distribuida": [
      {
        name: "Consistência e consenso",
        def: "Sistemas distribuídos combinam nós independentes. Consenso decide um valor mesmo com falhas e atrasos.",
        keys: [
          "Raft e Paxos resolvem consenso.",
          "Consistência forte custa latência.",
          "Consistência eventual admite leituras antigas por um tempo.",
        ],
        mistake: "Esperar consistência forte e alta disponibilidade ao mesmo tempo sob partição.",
        q: {
          q: "O que o teorema CAP diz que não dá para ter ao mesmo tempo sob partição?",
          o: ["Consistência e disponibilidade plenas", "Latência e banda", "Disco e memória", "Segurança e velocidade", "Duas réplicas", "Criptografia e compressão"],
          a: 0,
          why: "Com a rede partida, o sistema escolhe entre responder sempre ou responder só o valor correto.",
        },
      },
      {
        name: "Computação de alto desempenho",
        def: "Computação de alto desempenho divide o trabalho entre muitos núcleos e máquinas, com comunicação coordenada.",
        keys: [
          "Paralelismo acelera só a parte paralelizável.",
          "Lei de Amdahl mostra o teto do ganho.",
          "Comunicação entre nós pode dominar o custo.",
        ],
        mistake: "Esperar ganho linear ao dobrar núcleos, ignorando a parte sequencial.",
        q: {
          q: "O que a lei de Amdahl calcula?",
          o: ["O ganho máximo com paralelização parcial", "O custo da energia", "O tempo de disco", "A latência da rede", "O número de núcleos", "A capacidade da memória"],
          a: 0,
          why: "A fração sequencial limita o ganho, por mais núcleos que existam.",
        },
      },
      {
        name: "Nuvem e borda",
        def: "Nuvem oferece recursos sob demanda; borda aproxima o processamento do usuário para reduzir latência.",
        keys: [
          "IaaS, PaaS e SaaS diferem no que fica sob sua responsabilidade.",
          "Escalonamento automático acompanha a demanda.",
          "Computação de borda reduz ida e volta até o servidor central.",
        ],
        mistake: "Achar que nuvem elimina a necessidade de arquitetar para falha.",
        q: {
          q: "O que a computação de borda busca reduzir?",
          o: ["A latência, processando perto do usuário", "O custo do disco", "A memória RAM", "O tamanho do código", "A segurança", "A quantidade de dados"],
          a: 0,
          why: "Processar perto evita a viagem até o datacenter e volta.",
        },
      },
    ],
    "cs-dados": [
      {
        name: "Modelagem e SQL",
        def: "Modelo relacional organiza dados em tabelas ligadas por chaves. SQL consulta e altera esses dados.",
        keys: [
          "Chave primária identifica a linha.",
          "Chave estrangeira referencia outra tabela.",
          "Junção combina tabelas por condição.",
        ],
        mistake: "Duplicar coluna em vez de criar relação e depois achar que é normal.",
        q: {
          q: "Para que serve a chave estrangeira?",
          o: ["Referenciar a linha de outra tabela e garantir integridade", "Ordenar a tabela", "Compactar os dados", "Criptografar a coluna", "Acelerar a internet", "Criar índice automaticamente"],
          a: 0,
          why: "Ela liga as tabelas e impede referência a algo que não existe.",
        },
      },
      {
        name: "Bancos não relacionais",
        def: "Bancos não relacionais trocam o esquema rígido por modelos flexíveis: chave-valor, documento, coluna e grafo.",
        keys: [
          "Chave-valor é rápido para busca por chave.",
          "Documento guarda estrutura aninhada.",
          "Grafo é forte para relações profundas.",
        ],
        mistake: "Usar banco de documentos para dados que exigem forte integridade relacional.",
        q: {
          q: "Qual modelo é mais natural para rede social de amizades?",
          o: ["Grafo", "Chave-valor", "Colunar", "Tabela hash", "Fila", "Pilha"],
          a: 0,
          why: "Relações entre entidades e travessia são o ponto forte do modelo de grafo.",
        },
      },
      {
        name: "Engenharia de dados",
        def: "Engenharia de dados move e organiza informação: extração, transformação, carga, qualidade e linhagem.",
        keys: [
          "ETL extrai, transforma e carrega.",
          "Pipeline em lote roda por janela de tempo.",
          "Streaming processa conforme chega.",
        ],
        mistake: "Montar pipeline sem monitorar qualidade: erro pequeno contamina a análise.",
        q: {
          q: "Qual a diferença central entre lote e streaming?",
          o: ["Lote processa janelas; streaming processa conforme chega", "Streaming não usa dados", "Lote é sempre mais rápido", "Streaming só funciona em banco relacional", "Lote não pode transformar dados", "Streaming não tem latência"],
          a: 0,
          why: "O lote espera acumular; o streaming reage evento a evento.",
        },
      },
    ],
    "cs-ia": [
      {
        name: "Aprendizado de máquina",
        def: "Aprendizado de máquina ajusta modelo a partir de dados. Supervisionado usa rótulo; não supervisionado procura estrutura.",
        keys: [
          "Supervisionado aprende entrada e saída esperada.",
          "Não supervisionado agrupa e reduz dimensão.",
          "Validação separa dados de treino e de teste.",
        ],
        mistake: "Avaliar o modelo nos mesmos dados do treino e achar que ele generaliza.",
        q: {
          q: "Por que separar dados de treino e de teste?",
          o: ["Para medir a generalização em dados não vistos", "Para treinar mais rápido", "Para reduzir a memória", "Para aumentar o rótulo", "Para evitar GPU", "Para limpar os dados"],
          a: 0,
          why: "Treinar e testar no mesmo conjunto esconde a falta de generalização.",
        },
      },
      {
        name: "Redes profundas",
        def: "Redes neurais empilham camadas e ajustam pesos por gradiente. Convolução olha vizinhança; atenção olha relações.",
        keys: [
          "Retropropagação calcula o gradiente dos pesos.",
          "Convolução é forte em imagem.",
          "Transformers usam atenção e dominam texto.",
        ],
        mistake: "Achar que mais camadas sempre melhora: pode piorar sem dados e regularização.",
        q: {
          q: "O que a atenção faz num transformer?",
          o: ["Pondera a relação entre posições da sequência", "Reduz a imagem", "Remove ruído do disco", "Compacta o modelo", "Aumenta a resolução", "Ordena os dados"],
          a: 0,
          why: "A atenção decide quais partes da entrada importam para cada posição de saída.",
        },
      },
      {
        name: "IA confiável",
        def: "Sistema confiável precisa ser explicável, robusto, justo e supervisionado. Desempenho alto não basta.",
        keys: [
          "Explicabilidade ajuda a confiar e a corrigir.",
          "Viés nos dados vira viés na decisão.",
          "Supervisão humana é obrigatória em decisão sensível.",
        ],
        mistake: "Tratar acurácia alta como prova de equidade.",
        q: {
          q: "Por que medir viés em sistemas de IA?",
          o: ["Porque o modelo pode reproduzir desigualdade dos dados", "Porque o modelo é sempre neutro", "Porque acurácia é suficiente", "Porque o viés é só técnico", "Porque a lei proíbe estatística", "Porque reduz o custo"],
          a: 0,
          why: "O aprendizado reflete os dados; sem avaliação, a discriminação passa despercebida.",
        },
      },
    ],
    "cs-devops": [
      {
        name: "Automação e CI/CD",
        def: "Automação repete build e teste a cada mudança. Integração contínua junta código; entrega contínua prepara o release.",
        keys: [
          "Pipeline roda build, teste e empacotamento.",
          "Infraestrutura como código descreve ambiente em arquivo.",
          "Rollback rápido reduz o dano de um deploy ruim.",
        ],
        mistake: "Achar que pipeline verde é garantia de produção saudável.",
        q: {
          q: "O que a infraestrutura como código permite?",
          o: ["Descrever ambiente em arquivo versionado e reproduzível", "Dispensar teste", "Compilar mais rápido", "Eliminar servidores", "Ignorar logs", "Trocar linguagem"],
          a: 0,
          why: "O ambiente deixa de ser ajuste manual e vira artefato versionado e auditável.",
        },
      },
      {
        name: "Confiabilidade e SLI",
        def: "SRE mede confiabilidade com indicadores de nível de serviço e define teto de erro aceitável.",
        keys: [
          "SLI é a medida real, como latência ou erro.",
          "SLO é a meta para o SLI.",
          "Orçamento de erro autoriza arriscar dentro do limite.",
        ],
        mistake: "Perseguir disponibilidade de 100 por cento sem custo nem pausa para mudança.",
        q: {
          q: "O que é orçamento de erro?",
          o: ["A margem de falha aceitável dentro da meta de serviço", "O dinheiro do time", "O erro do desenvolvedor", "A cota de disco", "A quantidade de logs", "O tempo de deploy"],
          a: 0,
          why: "É a folga entre a meta e o ideal, usada para decidir quanto risco vale correr.",
        },
      },
      {
        name: "Observabilidade",
        def: "Observabilidade é conseguir explicar o estado interno a partir de métricas, logs e rastros distribuídos.",
        keys: [
          "Métrica é número no tempo.",
          "Log é evento detalhado.",
          "Rastro mostra o caminho de uma requisição entre serviços.",
        ],
        mistake: "Coletar métrica sem alarme significativo e descobrir o problema pelo cliente.",
        q: {
          q: "O que um rastro distribuído mostra?",
          o: ["O caminho e o tempo de cada etapa da requisição", "A cor do log", "O espaço em disco", "A senha do serviço", "O código-fonte inteiro", "A topologia física do prédio"],
          a: 0,
          why: "Ele liga as etapas entre serviços e mostra onde a requisição demorou ou falhou.",
        },
      },
    ],
    "cs-interfaces": [
      {
        name: "Desenvolvimento web",
        def: "Aplicação web separa estrutura, estilo e comportamento, e envia dados por rede entre cliente e servidor.",
        keys: [
          "HTML descreve estrutura; CSS, aparência; JavaScript, comportamento.",
          "API leva dados entre cliente e servidor.",
          "Latência e tamanho do recurso afetam a experiência.",
        ],
        mistake: "Carregar tudo no cliente e achar que a segurança está garantida.",
        q: {
          q: "Qual é o papel do JavaScript numa página?",
          o: ["Dar comportamento e interação no navegador", "Definir as cores", "Estruturar o texto", "Guardar o banco", "Criptografar o disco", "Servir a página"],
          a: 0,
          why: "Ele roda no cliente e responde a eventos, alterando a página em tempo real.",
        },
      },
      {
        name: "Interação humano-computador",
        def: "IHC estuda como pessoas usam sistemas, buscando usabilidade, acessibilidade e menos erro.",
        keys: [
          "Teste com usuário revela problema que a equipe não vê.",
          "Acessibilidade beneficia quem usa leitor de tela e teclado.",
          "Consistência reduz carga de aprendizado.",
        ],
        mistake: "Testar só com a própria equipe e concluir que a interface é fácil.",
        q: {
          q: "Por que testar com usuários reais?",
          o: ["Porque eles revelam dificuldades que a equipe não percebe", "Porque substitui testes de código", "Porque mede a velocidade da rede", "Porque garante a segurança", "Porque reduz o escopo", "Porque elimina a documentação"],
          a: 0,
          why: "Quem conhece o sistema já sabe onde clicar; quem não conhece mostra o atrito real.",
        },
      },
      {
        name: "Gráficos e jogos",
        def: "Gráficos em tempo real desenham cenas quadro a quadro. Física, rede e tempo de quadro definem a experiência do jogo.",
        keys: [
          "Taxa de quadros baixa prejudica o controle.",
          "Interpolação suaviza a posição recebida pela rede.",
          "Nível de detalhe reduz custo do que está longe.",
        ],
        mistake: "Medir desempenho só no computador mais forte.",
        q: {
          q: "O que a interpolação faz em jogos com rede?",
          o: ["Suaviza a posição entre pacotes recebidos", "Aumenta a taxa de quadros", "Reduz o tráfego a zero", "Corrige a física", "Criptografa os dados", "Gera o mapa"],
          a: 0,
          why: "Ela estima posições intermediárias, evitando que o corpo salte a cada pacote.",
        },
      },
    ],
    "cs-hardware": [
      {
        name: "Sistemas embarcados",
        def: "Embarcado é computador dentro de aparelho com função própria, com memória e energia limitadas.",
        keys: [
          "Firmware roda direto no microcontrolador.",
          "Tempo real exige resposta dentro do prazo.",
          "Consumo de energia limita o projeto.",
        ],
        mistake: "Projetar embarcado como se tivesse a memória de um computador comum.",
        q: {
          q: "O que caracteriza um sistema de tempo real?",
          o: ["A resposta precisa acontecer dentro do prazo definido", "Rodar só em servidor", "Ter tela grande", "Usar internet sempre", "Ter memória ilimitada", "Usar somente Linux"],
          a: 0,
          why: "O prazo faz parte da correção: resposta certa tarde demais é falha.",
        },
      },
      {
        name: "Internet das Coisas",
        def: "IoT liga sensores e atuadores à rede. Conectividade traz automação e também superfície de ataque.",
        keys: [
          "Sensores medem; atuadores agem.",
          "Atualização remota é essencial para corrigir falha.",
          "Segurança fraca em dispositivo barato vira porta de entrada.",
        ],
        mistake: "Publicar dispositivo com senha padrão e schemática aberta.",
        q: {
          q: "Por que a atualização remota importa em IoT?",
          o: ["Permite corrigir falhas em aparelhos já instalados", "Aumenta a bateria", "Reduz o tamanho", "Dispensa senha", "Melhora a cor do LED", "Troca o protocolo"],
          a: 0,
          why: "Sem atualização, um defeito descoberto depois só se resolve indo até o aparelho.",
        },
      },
      {
        name: "Robótica",
        def: "Robô junta percepção, planejamento e controle. Ele precisa localizar-se, decidir o caminho e agir.",
        keys: [
          "SLAM mapeia e localiza ao mesmo tempo.",
          "Cinemática calcula movimento sem olhar a força.",
          "Sensor tem ruído e incerteza, então sempre há filtro.",
        ],
        mistake: "Achar que o robô enxerga o mundo com precisão perfeita.",
        q: {
          q: "O que SLAM resolve?",
          o: ["Mapear o ambiente e se localizar ao mesmo tempo", "Somar vetores", "Carregar a bateria", "Trocar a garra", "Calcular a força", "Compilar o firmware"],
          a: 0,
          why: "Sem mapa pronto nem posição conhecida, o robô constrói os dois simultaneamente.",
        },
      },
    ],
    "cs-dataciencia": [
      {
        name: "Preparação de dados",
        def: "Antes de modelar, o dado precisa ser coletado, limpo, transformado e explorado. Metade do trabalho mora aí.",
        keys: [
          "Valor faltante pode ser removido, imputado ou marcado.",
          "Normalização põe variáveis em escala comparável.",
          "Análise exploratória revela padrão e erro antes do modelo.",
        ],
        mistake: "Treinar modelo com dado sujo e culpar o algoritmo.",
        q: {
          q: "Por que normalizar variáveis antes de alguns modelos?",
          o: ["Para colocar grandezas diferentes em escala comparável", "Para apagar valores", "Para reduzir linhas", "Para trocar o tipo", "Para criptografar", "Para ordenar a tabela"],
          a: 0,
          why: "Modelos sensíveis a distância ficam dominados pela variável de maior escala sem normalização.",
        },
      },
      {
        name: "Aprendizado estatístico",
        def: "Modelo preditivo equilibra ajuste e generalização. Validação cruzada estima o desempenho em dados novos.",
        keys: [
          "Sobreajuste é decorar o treino e errar no novo.",
          "Subajuste é simples demais para o padrão.",
          "Validação cruzada divide os dados em partes.",
        ],
        mistake: "Escolher modelo pela métrica no treino.",
        q: {
          q: "O que é sobreajuste?",
          o: ["O modelo decorou o treino e generaliza mal", "O modelo é simples demais", "O modelo não treinou", "O dado está vazio", "A métrica é binária", "O teste falhou"],
          a: 0,
          why: "Ele captura ruído específico do treino e perde desempenho em dados novos.",
        },
      },
      {
        name: "MLOps",
        def: "MLOps leva modelo para produção com versionamento, monitoramento e reavaliação contínua.",
        keys: [
          "Modelo em produção pode degradar com dado novo.",
          "Deriva de dados é mudança no perfil da entrada.",
          "Registro de modelo guarda versão e métrica.",
        ],
        mistake: "Publicar modelo e nunca mais medir o desempenho real.",
        q: {
          q: "O que é deriva de dados?",
          o: ["Mudança no perfil dos dados que chegam ao modelo", "Erro de sintaxe", "Falha de disco", "Troca de linguagem", "Aumento de memória", "Mudança de senha"],
          a: 0,
          why: "Se a entrada muda, o modelo treinado no perfil antigo perde precisão.",
        },
      },
    ],
    "cs-emergente": [
      {
        name: "Computação quântica",
        def: "Computador quântico usa qubits e portas unitárias. Certos problemas ganham atalho, mas a maioria não.",
        keys: [
          "Superposição permite explorar amplitudes.",
          "Algoritmo de Shor ameaça RSA.",
          "Correção de erro é necessária para uso prático.",
        ],
        mistake: "Achar que computador quântico resolve qualquer problema mais rápido.",
        q: {
          q: "O que o algoritmo de Shor ameaça?",
          o: ["A criptografia baseada em fatoração, como RSA", "A memória RAM", "O protocolo HTTP", "O armazenamento em disco", "A impressão", "O DNS apenas"],
          a: 0,
          why: "Ele fatora números grandes em tempo polinomial no modelo quântico, quebrando a base do RSA.",
        },
      },
      {
        name: "Computação neuromórfica",
        def: "Arquitetura neuromórfica imita o funcionamento de neurônios e sinapses, gastando pouco em tarefas sensoriais.",
        keys: [
          "Eventos esparsos economizam energia.",
          "Spiking neuron dispara em picos.",
          "Ainda não substitui a GPU em tarefas gerais.",
        ],
        mistake: "Achar que neuromórfico é sempre melhor que GPU: depende da tarefa.",
        q: {
          q: "O que caracteriza o processamento neuromórfico?",
          o: ["Eventos esparsos e baixo consumo em tarefas sensoriais", "Clock mais alto que a GPU", "Uso exclusivo de nuvem", "Ausência de memória", "Execução só sequencial", "Somente aritmética inteira"],
          a: 0,
          why: "O gasto acontece quando há evento, o que economiza energia em fluxo sensorial.",
        },
      },
      {
        name: "Ética e impacto",
        def: "Computação afeta trabalho, privacidade e poder. Decisão técnica também é decisão social.",
        keys: [
          "Dado pessoal exige finalidade e cuidado.",
          "Automação desloca tarefas e muda postos.",
          "Sistema que decide precisa de recurso e explicação.",
        ],
        mistake: "Tratar ética como etapa final, depois do sistema pronto.",
        q: {
          q: "Por que privacidade deve entrar no projeto desde o começo?",
          o: ["Porque a coleta e o uso de dado pessoal têm consequência real", "Porque deixa o código menor", "Porque acelera o build", "Porque reduz a memória", "Porque elimina testes", "Porque melhora a fonte"],
          a: 0,
          why: "Decidir depois pode exigir refazer o sistema e já ter exposto pessoas.",
        },
      },
    ],
  },
};

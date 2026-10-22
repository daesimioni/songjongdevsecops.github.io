// Texto curado de Computação, primeira metade (4.1 a 4.9). "Fundamentos" e
// "Especializações" da seção 4.6 usam a chave com o número da seção.

export const CS_A_TEXT = {
  "Pensamento computacional": {
    abre: "Pensamento computacional é decompor um problema, reconhecer padrões e escrever uma solução em passos que outra pessoa ou máquina possa executar. A abstração decide o que importa e o que pode ficar de fora.",
    pratica: "Pegue uma tarefa do dia, como organizar uma fila, e escreva o algoritmo em passos numerados, incluindo os casos de erro.",
    erro: "Começar a programar antes de saber qual problema está sendo resolvido.",
  },
  "Representação da informação": {
    abre: "Computadores guardam tudo como sequências de bits. Bases numéricas, texto e imagens são convenções para interpretar esses bits de forma útil.",
    pratica: "Converta um número entre binário, decimal e hexadecimal e depois codifique uma palavra em ASCII.",
    erro: "Confundir o valor com a representação: o número 10 não é o mesmo que o texto 10.",
  },
  "Lógica digital": {
    abre: "Portas lógicas realizam operações booleanas com sinais elétricos. Somadores, registradores e processadores são combinações dessas portas.",
    pratica: "Monte a tabela verdade de um somador de um bit e compare a soma com a porta OU exclusivo.",
    erro: "Achar que toda saída 1 é verdadeira em qualquer contexto: o significado depende da convenção do circuito.",
  },
  "Fundamentos de programação": {
    abre: "Variáveis, tipos, expressões e controle de fluxo são o vocabulário mínimo de qualquer linguagem. Aprender a ler o que o programa faz vale mais do que decorar sintaxe.",
    pratica: "Escreva um programa que leia três números e diga qual é o maior, sem usar função pronta de ordenação.",
    erro: "Trocar atribuição por comparação dentro de uma condição.",
  },
  "Abstração computacional": {
    abre: "Abstração esconde detalhes atrás de contratos. Funções, interfaces e modelos de computação permitem raciocinar sem olhar para a implementação inteira.",
    pratica: "Descreva uma função de busca só pelo contrato de entrada e saída e depois implemente duas versões diferentes.",
    erro: "Vazar detalhe de implementação no contrato e prender quem usa a função.",
  },
  "Algoritmos fundamentais": {
    abre: "Busca e ordenação são os algoritmos que aparecem em todo lugar. Comparar versões lineares, binárias e por divisão mostra como a escolha muda o custo.",
    pratica: "Implemente busca binária e teste com um vetor de tamanho ímpar e outro par, incluindo o caso de elemento ausente.",
    erro: "Usar busca binária em vetor desordenado.",
  },
  "Estruturas de dados": {
    abre: "Estruturas de dados organizam memória para que as operações fiquem baratas. Listas, pilhas, filas, árvores e tabelas de dispersão têm custos e usos diferentes.",
    pratica: "Compare o custo de inserir no início de um vetor e de uma lista ligada.",
    erro: "Escolher a estrutura pela fama e não pelo padrão de acesso do problema.",
  },
  "Análise de algoritmos": {
    abre: "Análise de algoritmos mede crescimento, não segundos de uma máquina. Notação assintótica compara o custo quando a entrada cresce.",
    pratica: "Conte as operações de dois algoritmos de ordenação no melhor e no pior caso e escreva a ordem de crescimento.",
    erro: "Comparar tempos de execução em máquinas diferentes e concluir complexidade.",
  },
  "Projeto avançado de algoritmos": {
    abre: "Algoritmos avançados combinam estruturas, grafos, geometria e programação dinâmica. O projeto começa pela modelagem e pela escolha da técnica.",
    pratica: "Modele um problema de rotas como grafo ponderado e escolha entre Dijkstra e Bellman-Ford conforme os pesos.",
    erro: "Aplicar Dijkstra com pesos negativos e obter resposta errada.",
  },
  "Resolução de problemas computacionais": {
    abre: "Resolver problema computacional é traduzir enunciado em modelo, entradas, saídas e restrições. A estrutura certa costuma simplificar mais que a otimização prematura.",
    pratica: "Leia um enunciado, escreva as restrições de tamanho e só então escolha o algoritmo.",
    erro: "Ignorar os limites de entrada e propor uma solução que não passa no tempo.",
  },
  "Teoria da computabilidade": {
    abre: "Computabilidade pergunta o que pode ser calculado por um procedimento finito. Máquinas de Turing e funções computáveis delimitam o que nenhum programa resolve.",
    pratica: "Explique por que o problema da parada não pode ser decidido por um programa geral.",
    erro: "Confundir problema difícil com problema impossível.",
  },
  "Teoria da complexidade computacional": {
    abre: "Complexidade classifica problemas pelo custo de resolvê-los. P, NP e NP-completos organizam a fronteira entre o tratável e o que ainda não se sabe.",
    pratica: "Mostre uma redução simples entre dois problemas e explique o que ela preserva.",
    erro: "Dizer que NP significa não polinomial: NP é a classe dos problemas com certificado verificável em tempo polinomial.",
  },
  "Autômatos e linguagens formais": {
    abre: "Autômatos reconhecem linguagens e modelam máquinas de estado. Finitos, de pilha e Turing correspondem a classes cada vez mais poderosas.",
    pratica: "Construa um autômato finito para números binários múltiplos de três e teste algumas entradas.",
    erro: "Tentar reconhecer linguagem que exige memória ilimitada com autômato finito.",
  },
  "Lógica e computação": {
    abre: "A lógica formal sustenta circuitos, linguagens e verificação de programas. Proposições, predicados e regras de inferência viram algoritmos de prova e de projeto.",
    pratica: "Escreva a condição de um programa em lógica e verifique se ela cobre todos os casos.",
    erro: "Confundir a lógica do programa com a lógica do domínio que ele modela.",
  },
  "Fundamentos de sistemas de tipos": {
    abre: "Tipos classificam valores e restringem operações. Sistemas estáticos e dinâmicos trocam segurança por flexibilidade, e tipos algébricos modelam dados compostos.",
    pratica: "Modele um resultado que pode ser sucesso ou erro com um tipo que obrigue o tratamento dos dois casos.",
    erro: "Usar tipo genérico demais e perder a garantia que o sistema de tipos poderia dar.",
  },
  "Teoria da informação": {
    abre: "Informação é redução de incerteza. Entropia e informação mútua medem o quanto um sinal diz sobre outro e fundamentam compressão e comunicação.",
    pratica: "Calcule a entropia de uma moeda justa e de uma moeda viciada e compare.",
    erro: "Confundir quantidade de dados com quantidade de informação.",
  },
  "Paradigmas de programação": {
    abre: "Paradigmas são estilos de organizar o cálculo. Imperativo, funcional, orientado a objetos e declarativo resolvem o mesmo problema com modelos diferentes.",
    pratica: "Resolva a mesma soma de lista em estilo imperativo e funcional e compare o que cada versão deixa explícito.",
    erro: "Misturar paradigmas sem critério e criar código que não é bom em nenhum dos dois.",
  },
  "Projeto de linguagens": {
    abre: "Projetar linguagem é decidir sintaxe, semântica e o que o programador pode expressar com clareza. Toda escolha facilita um uso e complica outro.",
    pratica: "Escreva a gramática de uma linguagem de calculadora e teste uma expressão com parênteses.",
    erro: "Definir sintaxe ambígua e deixar a semântica depender de sorte.",
  },
  "Compiladores e interpretadores": {
    abre: "Compiladores traduzem código para outra representação. Análise léxica, sintática, semântica e geração de código transformam texto em execução.",
    pratica: "Implemente um analisador de expressões aritméticas com precedência e veja a árvore sintática.",
    erro: "Aceitar sintaxe inválida porque o analisador só olha o primeiro token.",
  },
  "Programação de baixo nível": {
    abre: "Programação de baixo nível lida com registradores, memória e chamadas de sistema. Entender assembly e ABI torna visível o que a linguagem de alto nível esconde.",
    pratica: "Compile uma função simples e leia o assembly gerado, identificando os registradores usados.",
    erro: "Assumir que a ordem dos argumentos na linguagem é a mesma da ABI.",
  },
  "Ferramentas de desenvolvimento": {
    abre: "Editores, depuradores, linters e sistemas de build moldam a produtividade. Ferramenta boa reduz erro repetido e deixa o problema aparecer.",
    pratica: "Configure um linter, encontre um aviso real e corrija a causa em vez de silenciar a regra.",
    erro: "Desligar o aviso em vez de corrigir o código que o provocou.",
  },
  "Análise e requisitos": {
    abre: "Requisitos dizem o que o sistema deve fazer e para quem. Separar funcional de não funcional evita construir a coisa certa do jeito errado.",
    pratica: "Escreva três requisitos funcionais e três não funcionais para uma fila de atendimento.",
    erro: "Aceitar requisito que não pode ser verificado.",
  },
  "Arquitetura e design": {
    abre: "Arquitetura organiza componentes e dependências. Camadas, hexágonos e serviços são desenhos para isolar mudança e manter o acoplamento sob controle.",
    pratica: "Desenhe as dependências de um sistema pequeno e aponte qual módulo pode mudar sem arrastar os outros.",
    erro: "Adotar microsserviços antes de ter um problema que justifique a distribuição.",
  },
  "Desenvolvimento de software": {
    abre: "Desenvolver é transformar requisito em código revisável. Revisão, integração e disciplina de commits protegem o time do retrabalho.",
    pratica: "Faça uma revisão de código procurando um caso de erro não tratado.",
    erro: "Misturar refatoração grande com correção no mesmo commit.",
  },
  "Testes de software": {
    abre: "Teste é a prova de que o comportamento esperado continua valendo. Unitário, integração e ponta a ponta cobrem camadas diferentes.",
    pratica: "Escreva um teste que falha antes da correção e passa depois.",
    erro: "Testar só o caminho feliz e esquecer entrada inválida e limite.",
  },
  "Qualidade de software": {
    abre: "Qualidade não é só ausência de bug: inclui confiabilidade, desempenho, manutenibilidade e experiência. Métrica sem contexto vira vaidade.",
    pratica: "Escolha uma métrica de qualidade, defina como medi-la e o que faria o time mudar de decisão.",
    erro: "Perseguir cobertura de teste alta com testes que não verificam comportamento.",
  },
  "Ciclo de vida e evolução": {
    abre: "Software nasce, cresce e envelhece. Ágil, incremental e entrega contínua são formas de lidar com mudança em vez de congelar requisito.",
    pratica: "Divida uma entrega grande em três incrementos que cada um já funcione sozinho.",
    erro: "Chamar de ágil uma sequência de entregas sem feedback.",
  },
  "Gestão de engenharia": {
    abre: "Gestão técnica equilibra prazo, risco e capacidade. Estimativa e priorização são ferramentas de decisão, não promessas.",
    pratica: "Estime uma tarefa por decomposição e registre a incerteza junto com o número.",
    erro: "Prometer uma data sem separar o que é conhecido do que é suposição.",
  },
  "4.6|Fundamentos": {
    abre: "Sistemas operacionais coordenam processos, memória e dispositivos. Processo e thread são unidades de execução com custos e isolamentos diferentes.",
    pratica: "Explique o que acontece quando dois processos tentam escrever no mesmo arquivo ao mesmo tempo.",
    erro: "Achar que thread é sempre mais rápida: concorrência sem cuidado gera corrida.",
  },
  "Memória": {
    abre: "Memória virtual dá a cada processo a ilusão de um espaço contínuo. Paginação e substituição de páginas decidem o que fica na memória física.",
    pratica: "Simule a política FIFO e a LRU em uma sequência de acessos e compare as faltas de página.",
    erro: "Confundir memória virtual com memória física disponível.",
  },
  "Armazenamento e sistemas de arquivos": {
    abre: "Sistemas de arquivos organizam dados persistentes com nomes, permissões e blocos. O desenho afeta desempenho, recuperação e segurança.",
    pratica: "Descreva o que acontece no disco ao salvar um arquivo e ao removê-lo.",
    erro: "Achar que apagar arquivo garante que os dados sumiram do disco.",
  },
  "Núcleo e interfaces": {
    abre: "O núcleo concentra as operações privilegiadas. Monolítico e microkernel trocam desempenho por isolamento e modularidade.",
    pratica: "Compare o caminho de uma chamada de sistema em um kernel monolítico e em um microkernel.",
    erro: "Colocar política de aplicação dentro do núcleo e aumentar o risco de falha.",
  },
  "4.6|Especializações": {
    abre: "Linux e Windows implementam os mesmos conceitos com decisões diferentes. Gerenciamento de processos, permissões e drivers mudam a forma de operar.",
    pratica: "Compare como cada sistema lida com permissões de arquivo e serviço em segundo plano.",
    erro: "Copiar comando de um sistema para outro sem conferir sintaxe e semântica.",
  },
  "Fundamentos de redes": {
    abre: "Redes transportam dados entre máquinas por camadas. OSI e TCP/IP organizam endereçamento, transporte e aplicação.",
    pratica: "Siga um pacote do navegador até o servidor e diga em que camada cada decisão acontece.",
    erro: "Confundir endereço IP com endereço MAC.",
  },
  "Protocolos": {
    abre: "Protocolos são acordos de comunicação. TCP, UDP e ICMP resolvem confiabilidade, velocidade e diagnóstico com garantias diferentes.",
    pratica: "Compare o que acontece quando um pacote se perde em TCP e em UDP.",
    erro: "Usar UDP para dados que exigem entrega garantida sem tratar a perda.",
  },
  "Infraestrutura de rede": {
    abre: "Infraestrutura física e lógica sustenta a comunicação. LANs, WANs, switches e roteadores têm papéis e domínios de colisão diferentes.",
    pratica: "Desenhe uma rede com dois setores e diga onde ficam switch, roteador e firewall.",
    erro: "Ligar redes diferentes no mesmo switch sem separar domínio de broadcast.",
  },
  "Redes avançadas": {
    abre: "Redes avançadas controlam tráfego e caminho de forma programável. SDN, engenharia de tráfego e virtualização separam plano de controle e plano de dados.",
    pratica: "Explique como uma política central pode redirecionar tráfego sem configurar cada switch.",
    erro: "Achar que SDN elimina a necessidade de entender roteamento.",
  },
  "Telecomunicações": {
    abre: "Telecomunicações levam sinal por meio físico. Modulação, ruído e largura de banda determinam quanto e quão longe se transmite.",
    pratica: "Compare uma modulação em amplitude e uma em frequência quanto à resistência a ruído.",
    erro: "Ignorar a relação sinal-ruído ao calcular alcance.",
  },
  "Sistemas distribuídos": {
    abre: "Sistemas distribuídos coordenam máquinas que falham de forma independente. Consistência, partição e latência são restrições que nenhum desenho elimina.",
    pratica: "Explique o que acontece com uma escrita quando a rede se parte entre dois nós.",
    erro: "Prometer consistência forte e disponibilidade total ao mesmo tempo sob partição.",
  },
  "Armazenamento distribuído": {
    abre: "Armazenamento distribuído replica e fragmenta dados entre nós. Consenso e replicação decidem o que sobrevive a falhas.",
    pratica: "Descreva a diferença entre replicação síncrona e assíncrona em caso de queda.",
    erro: "Achar que replicar resolve tudo sem tratar conflito de escrita.",
  },
  "Computação de alto desempenho": {
    abre: "HPC usa paralelismo e clusters para resolver problemas grandes. Comunicação e balanceamento de carga costumam limitar mais que a CPU.",
    pratica: "Compare speedup teórico e real de um cálculo dividido em quatro processos.",
    erro: "Medir ganho ignorando o custo de comunicação.",
  },
  "Sistemas de nuvem": {
    abre: "Nuvem é aluguel de capacidade com automação. IaaS, PaaS e SaaS mudam o que o time precisa operar.",
    pratica: "Descreva o que você ainda precisa operar em cada modelo de serviço.",
    erro: "Achar que nuvem elimina capacidade ou custo de arquitetura.",
  },
  "Computação de borda": {
    abre: "Borda aproxima processamento da origem dos dados. Latência, banda e privacidade justificam levar parte do sistema para perto do dispositivo.",
    pratica: "Decida o que processar no dispositivo e o que enviar para a nuvem em um sensor de câmera.",
    erro: "Mandar tudo para a nuvem e chamar de borda.",
  },
};

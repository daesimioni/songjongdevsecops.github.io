// Alternativas reescritas à mão para as perguntas em que a resposta certa era a
// única longa: dava para acertar pelo tamanho. Chave é o enunciado; valor é a
// lista de alternativas na ordem original, com o índice da certa.
// Entra em `js/rpg-data.js` depois de todas as perguntas e antes do jogo.

export const OPCOES_MELHORES = {
  "Um registrador é...": {
    "o": [
      "memória muito rápida dentro da CPU",
      "memória lenta que guarda o sistema inteiro",
      "um disco externo ligado por cabo",
      "um cabo de rede entre máquinas",
      "uma placa que converte energia"
    ],
    "a": 0
  },
  "Qual é a diferença entre hardware e software?": {
    "o": [
      "Hardware é a parte física; software é o programa",
      "Hardware é o programa; software é a parte física",
      "Os dois são físicos e só mudam de cor",
      "Os dois são programas, um pago e um grátis",
      "Hardware é o gabinete; software é o teclado"
    ],
    "a": 0
  },
  "Um servidor é...": {
    "o": [
      "uma máquina que fornece serviços a clientes",
      "um programa que só desenha a tela",
      "um tipo de teclado usado em rede",
      "um arquivo que guarda senhas",
      "um cabo que liga dois computadores"
    ],
    "a": 0
  },
  "O que o TCP garante que o protocolo de datagrama não garante?": {
    "o": [
      "Entrega ordenada e confiável, com confirmação e reenvio.",
      "Endereços IP fixos e permanentes na rede",
      "Compressão automática de todos os pacotes",
      "Criptografia de ponta a ponta por padrão",
      "Escolha do caminho mais curto entre máquinas"
    ],
    "a": 0
  },
  "O que o problema da parada demonstra?": {
    "o": [
      "Que nem todo problema tem algoritmo que sempre decida",
      "Que todos os programas terminam com memória",
      "Que a memória infinita resolve qualquer conta",
      "Que toda linguagem termina no mesmo tempo",
      "Que a recursão é proibida em máquina finita"
    ],
    "a": 0
  },
  "O que é requisito não funcional?": {
    "o": [
      "Uma qualidade do sistema, como desempenho ou segurança",
      "Uma tela do sistema que o usuário vê",
      "Um caso de uso descrito pelo cliente",
      "Uma regra de negócio do domínio",
      "Um teste unitário automatizado"
    ],
    "a": 0
  },
  "O que o teorema CAP diz que não dá para ter ao mesmo tempo sob partição?": {
    "o": [
      "Consistência e disponibilidade plenas",
      "Latência e banda de rede ao mesmo tempo",
      "Disco e memória no mesmo servidor",
      "Segurança e velocidade na mesma máquina",
      "Duas réplicas idênticas em todo momento"
    ],
    "a": 0
  },
  "Para que serve a chave estrangeira?": {
    "o": [
      "Referenciar a linha de outra tabela e garantir integridade",
      "Ordenar a tabela pela chave primária",
      "Compactar os dados guardados na tabela",
      "Criptografar a coluna de senha do usuário",
      "Criar um índice automaticamente na tabela"
    ],
    "a": 0
  },
  "Por que separar dados de treino e de teste?": {
    "o": [
      "Para medir a generalização em dados não vistos",
      "Para treinar o modelo muito mais rápido",
      "Para reduzir o uso de memória do processo",
      "Para evitar o uso de GPU no treinamento",
      "Para limpar os dados duplicados da base"
    ],
    "a": 0
  },
  "O que a infraestrutura como código permite?": {
    "o": [
      "Descrever ambiente em arquivo versionado e reproduzível",
      "Dispensar os testes de integração do time",
      "Compilar o código mais rápido na máquina",
      "Eliminar a necessidade de servidores físicos",
      "Ignorar os logs de acesso da aplicação"
    ],
    "a": 0
  },
  "Qual é o papel do JavaScript numa página?": {
    "o": [
      "Dar comportamento e interação no navegador",
      "Definir as cores e o espaçamento do texto",
      "Estruturar o texto e as seções e listas",
      "Guardar o banco de dados no servidor",
      "Criptografar o disco do computador"
    ],
    "a": 0
  },
  "O que caracteriza um sistema de tempo real?": {
    "o": [
      "A resposta precisa acontecer dentro do prazo definido",
      "Rodar apenas em servidor dedicado e caro",
      "Ter tela grande com atualização constante",
      "Usar internet em tempo integral na máquina",
      "Ter memória ilimitada para todos os processos"
    ],
    "a": 0
  },
  "Por que normalizar variáveis antes de alguns modelos?": {
    "o": [
      "Para colocar grandezas diferentes em escala comparável",
      "Para apagar os valores fora da curva",
      "Para reduzir o número de linhas da tabela",
      "Para trocar o tipo das colunas do banco",
      "Para ordenar a tabela pela chave primária"
    ],
    "a": 0
  },
  "O que o algoritmo de Shor ameaça?": {
    "o": [
      "A criptografia baseada em fatoração, como RSA",
      "A memória RAM dos servidores atuais",
      "O protocolo HTTP usado na web",
      "O armazenamento em disco dos clientes",
      "O sistema de nomes DNS da internet"
    ],
    "a": 0
  },
  "O que é tokenização?": {
    "o": [
      "Quebrar o texto em unidades que o modelo processa",
      "Traduzir a frase para outra língua",
      "Corrigir a gramática do texto escrito",
      "Resumir o texto em uma única linha",
      "Medir o sentimento da frase analisada"
    ],
    "a": 0
  },
  "A cache existe para quê?": {
    "o": [
      "Encurtar a distância entre CPU e memória",
      "Aumentar o clock do processador principal",
      "Traduzir o binário na hora da execução",
      "Dobrar a memória do sistema disponível",
      "Evitar o uso do disco externo de dados"
    ],
    "a": 0
  },
  "O pipeline acelera porque...": {
    "o": [
      "sobrepõe etapas de instruções diferentes",
      "aumenta o clock de cada etapa executada",
      "reduz a memória usada no laço de execução",
      "elimina a busca de instruções na memória",
      "dobra o número de núcleos do processador"
    ],
    "a": 0
  },
  "Cache de dados serve para...": {
    "o": [
      "dar acesso rápido ao que já foi usado",
      "aumentar o espaço em disco disponível",
      "traduzir o binário na hora da execução",
      "reduzir o clock do processador principal",
      "guardar tudo permanentemente no disco"
    ],
    "a": 0
  },
  "O que é um deadlock?": {
    "o": [
      "Processos esperando recursos uns dos outros",
      "Um erro de digitação no código fonte",
      "Uma memória cheia por falta de espaço",
      "Um laço que termina muito rápido",
      "Uma fila que anda sem parar nunca"
    ],
    "a": 0
  },
  "Complexidade O(1) significa...": {
    "o": [
      "tempo constante em relação à entrada",
      "tempo linear em relação ao tamanho dela",
      "espaço zero para qualquer entrada dada",
      "tempo quadrático no pior caso possível",
      "tempo logarítmico no tamanho da entrada"
    ],
    "a": 0
  },
  "Um tipo de dado define...": {
    "o": [
      "que operações fazem sentido para o valor",
      "a cor da tela do programa em execução",
      "o nome do arquivo aberto pelo usuário",
      "a senha do usuário logado no sistema",
      "a versão da linguagem usada no projeto"
    ],
    "a": 0
  },
  "Uma branch no Git serve para...": {
    "o": [
      "desenvolver uma linha de mudanças em paralelo",
      "apagar o repositório inteiro de uma vez",
      "compactar os arquivos antigos do projeto",
      "traduzir o código para binário na hora",
      "assinar os commits do time inteiro"
    ],
    "a": 0
  },
  "Uma função pura...": {
    "o": [
      "dá a mesma saída para a mesma entrada e não tem efeito colateral",
      "modifica o estado global sempre que chamada",
      "usa números aleatórios na conta que faz",
      "depende do relógio do sistema para responder",
      "guarda o resultado em disco a cada chamada"
    ],
    "a": 0
  },
  "Uma exceção em programação é...": {
    "o": [
      "um evento que interrompe o fluxo normal e pode ser tratado",
      "um erro de digitação no editor de texto",
      "uma variável sem tipo definido no código",
      "um comentário mal escrito no arquivo",
      "uma biblioteca desatualizada no projeto"
    ],
    "a": 0
  },
  "Um vetor dinâmico é...": {
    "o": [
      "um array que cresce quando precisa",
      "uma lista ligada por ponteiros soltos",
      "um banco de dados guardado em memória",
      "uma pilha de tamanho fixo na memória",
      "um arquivo de texto aberto pelo programa"
    ],
    "a": 0
  },
  "Por que guardar senha com hash e salt?": {
    "o": [
      "O hash não volta ao original, e o salt evita tabelas prontas e hashes iguais.",
      "Para ocupar menos espaço em disco no servidor",
      "Para poder mostrar a senha ao usuário depois",
      "Porque o sal criptografa a senha e a protege",
      "Para deixar o login mais rápido no sistema"
    ],
    "a": 0
  },
  "O que significa NP?": {
    "o": [
      "A solução pode ser verificada em tempo polinomial",
      "É impossível resolver na prática diária",
      "Resolve em tempo constante para qualquer caso",
      "Usa memória infinita em toda execução",
      "É sempre exponencial no melhor caso"
    ],
    "a": 0
  },
  "O que a análise sintática faz?": {
    "o": [
      "Monta a árvore conforme a gramática da linguagem",
      "Traduz o programa para binário final",
      "Otimiza o código gerado pelo compilador",
      "Remove os comentários do arquivo fonte",
      "Executa o programa linha por linha"
    ],
    "a": 0
  },
  "O que acontece numa falta de página?": {
    "o": [
      "O sistema busca a página no armazenamento",
      "O processo é apagado da memória",
      "A CPU desliga para economizar energia",
      "O disco é formatado na hora do erro",
      "A página vira cache do disco rígido"
    ],
    "a": 0
  },
  "O que a lei de Amdahl calcula?": {
    "o": [
      "O ganho máximo com paralelização parcial",
      "O custo de energia do cluster inteiro",
      "O tempo de acesso ao disco principal",
      "A latência da rede sem fio do local",
      "O número ideal de núcleos da máquina"
    ],
    "a": 0
  },
  "O que a atenção faz num transformer?": {
    "o": [
      "Pondera a relação entre posições da sequência",
      "Reduz a imagem para caber na memória",
      "Remove o ruído do disco de armazenamento",
      "Compacta o modelo em menos parâmetros",
      "Ordena os dados por valor crescente"
    ],
    "a": 0
  },
  "O que é orçamento de erro?": {
    "o": [
      "A margem de falha aceitável dentro da meta de serviço",
      "O dinheiro reservado do time de plantão",
      "O erro do desenvolvedor novo no projeto",
      "A cota de disco do serviço em produção",
      "O tempo de deploy do dia de hoje"
    ],
    "a": 0
  },
  "Por que a atualização remota importa em IoT?": {
    "o": [
      "Permite corrigir falhas em aparelhos já instalados",
      "Aumenta a bateria do aparelho no campo",
      "Reduz o tamanho do firmware instalado",
      "Dispensa a senha de acesso do aparelho",
      "Troca o protocolo de rede automaticamente"
    ],
    "a": 0
  },
  "O que é sobreajuste?": {
    "o": [
      "O modelo decorou o treino e generaliza mal",
      "O modelo é simples demais para o dado",
      "O modelo não chegou a treinar o bastante",
      "O dado de entrada está vazio no treino",
      "A métrica escolhida é binária por natureza"
    ],
    "a": 0
  },
  "O que caracteriza o processamento neuromórfico?": {
    "o": [
      "Eventos esparsos e baixo consumo em tarefas sensoriais",
      "Clock mais alto que a GPU do mercado",
      "Uso exclusivo de nuvem para processar",
      "Ausência de memória interna no chip",
      "Execução sempre sequencial das tarefas"
    ],
    "a": 0
  },
  "Por que o problema da parada é indecidível?": {
    "o": [
      "Porque um programa geral se contradiz ao analisar a si mesmo",
      "Porque não cabe na memória do computador",
      "Porque a CPU é finita e lenta demais",
      "Porque o código é muito longo para caber",
      "Porque a linguagem usada é muito nova"
    ],
    "a": 0
  },
  "Duas chaves diferentes caem no mesmo balde de uma tabela hash. Isso é...": {
    "o": [
      "Uma colisão, tratada por encadeamento ou sondagem",
      "Um erro fatal de sintaxe no programa",
      "Uma árvore binária desbalanceada",
      "Um índice criado sem chave primária",
      "Um laço infinito dentro do hash"
    ],
    "a": 0
  },
  "O que a pergunta P versus NP quer dizer?": {
    "o": [
      "Se todo problema verificável rápido é resolvível rápido",
      "Se a velocidade da luz é finita no vácuo",
      "Se NP é indecidível na prática diária",
      "Se a memória do computador é limitada",
      "Se o disco é mais lento que a memória"
    ],
    "a": 0
  },
  "A arquitetura de Von Neumann tem...": {
    "o": [
      "memória compartilhada entre dados e instruções",
      "duas CPUs separadas por um barramento",
      "só registradores, sem memória externa",
      "memória separada só para instruções",
      "memória separada só para os dados"
    ],
    "a": 0
  },
  "O que é uma máquina de Turing universal?": {
    "o": [
      "Uma máquina que simula qualquer outra máquina de Turing",
      "Um computador quântico de laboratório",
      "Um teclado mecânico programável",
      "Uma máquina que só soma números",
      "Um compilador de linguagens novas"
    ],
    "a": 0
  },
  "O que significa NP-completo?": {
    "o": [
      "Um problema tão difícil quanto os mais difíceis de NP",
      "Um problema impossível de descrever",
      "Um problema de soma simples e rápida",
      "Um problema só de ordenação de lista",
      "Um problema de tempo constante"
    ],
    "a": 0
  },
  "Por que um desvio mal previsto custa caro no pipeline?": {
    "o": [
      "As instruções já buscadas são descartadas",
      "A memória aquece e perde os dados",
      "O clock dobra de frequência na hora",
      "O disco precisa girar de novo do zero",
      "A rede fica congestionada no enlace"
    ],
    "a": 0
  },
  "Congestionamento acontece quando...": {
    "o": [
      "a demanda passa da capacidade do enlace",
      "o cabo é novo e muito mais rápido",
      "o pacote é pequeno demais na rede",
      "o enlace está vazio quase todo tempo",
      "o roteador está desligado no momento"
    ],
    "a": 0
  },
  "Deadlock difere de livelock porque...": {
    "o": [
      "no deadlock os processos ficam parados; no livelock mudam sem progredir",
      "os dois são a mesma coisa na prática",
      "livelock só existe em rede sem fio",
      "deadlock é mais rápido que livelock",
      "livelock termina sempre em timeout"
    ],
    "a": 0
  },
  "JOIN em SQL serve para...": {
    "o": [
      "combinar linhas de tabelas por uma condição",
      "apagar uma tabela inteira do banco",
      "ordenar o banco por uma coluna só",
      "somar os valores de uma tabela",
      "criar uma tabela nova vazia"
    ],
    "a": 0
  },
  "Concorrência difere de paralelismo porque...": {
    "o": [
      "concorrência intercala tarefas; paralelismo executa ao mesmo tempo",
      "são sinônimos na prática do dia a dia",
      "paralelismo é sempre mais lento que a fila",
      "concorrência exige dois núcleos físicos",
      "paralelismo só existe em rede local"
    ],
    "a": 0
  },
  "Um cache miss acontece quando...": {
    "o": [
      "o dado não está no cache e precisa ser buscado",
      "o cache está cheio de dados antigos",
      "o processador desliga por causa do calor",
      "o dado está no cache e é lido rápido",
      "a memória principal está vazia no momento"
    ],
    "a": 0
  },
  "Compilação JIT acontece...": {
    "o": [
      "durante a execução, com trechos compilados sob demanda",
      "só antes de instalar o programa na máquina",
      "nunca acontece na linguagem Java",
      "apenas na compilação estática do código",
      "só quando o código é interpretado puro"
    ],
    "a": 0
  },
  "Uma árvore binária de busca mantém...": {
    "o": [
      "menores à esquerda e maiores à direita",
      "todos os nós com o mesmo valor guardado",
      "só um filho por nó, sempre à esquerda",
      "maiores à esquerda e menores à direita",
      "a raiz sempre no meio da lista ligada"
    ],
    "a": 0
  },
  "Um mutex serve para...": {
    "o": [
      "garantir exclusão mútua numa região crítica",
      "apagar a memória do processo inteiro",
      "aumentar a banda da rede local",
      "traduzir o código binário na hora",
      "guardar o resultado em disco sempre"
    ],
    "a": 0
  },
  "Injeção de SQL acontece quando...": {
    "o": [
      "entrada maliciosa vira comando no banco",
      "o banco está vazio e sem tabelas",
      "a consulta é lenta no servidor de dados",
      "a senha do usuário é curta demais",
      "o índice da tabela está corrompido"
    ],
    "a": 0
  },
  "Custo amortizado descreve...": {
    "o": [
      "o custo médio ao longo de muitas operações",
      "o pior caso de uma única operação",
      "o custo de memória total do programa",
      "o tempo de compilação do código fonte",
      "o custo fixo de inicialização do sistema"
    ],
    "a": 0
  },
  "O princípio de Kerckhoffs diz que...": {
    "o": [
      "o sistema deve ser seguro mesmo com o algoritmo público",
      "a chave deve ser pública e compartilhada",
      "não se deve usar chave em nenhum caso",
      "o algoritmo deve ficar secreto para sempre",
      "a senha deve ser curta e sempre fixa"
    ],
    "a": 0
  },
  "A máscara de sub-rede serve para...": {
    "o": [
      "separar a parte de rede da parte de host no endereço.",
      "ocultar o endereço IP do computador.",
      "traduzir nomes em endereços de rede.",
      "criptografar o tráfego que passa na rede.",
      "definir a velocidade da placa de rede."
    ],
    "a": 0
  },
  "O que O(n log n) indica numa ordenação?": {
    "o": [
      "Crescimento próximo do limite teórico de comparações",
      "Execução instantânea em qualquer entrada",
      "Custo constante para toda entrada dada",
      "Custo quadrático no pior caso possível",
      "Uso de memória zero durante o processo"
    ],
    "a": 0
  },
  "O que é dívida técnica?": {
    "o": [
      "Solução mais rápida que deixa custo para depois",
      "Um empréstimo bancário feito pelo time",
      "Um bug que precisa existir no código",
      "Uma tarefa de design visual do produto",
      "Uma métrica de vendas da empresa"
    ],
    "a": 0
  },
  "Para que serve o journaling?": {
    "o": [
      "Registrar operações para recuperar o sistema depois de queda",
      "Acelerar a internet do servidor local",
      "Compactar os arquivos antigos do disco",
      "Criptografar todos os dados do sistema",
      "Aumentar a memória RAM disponível"
    ],
    "a": 0
  },
  "O que a computação de borda busca reduzir?": {
    "o": [
      "A latência, processando perto do usuário",
      "O custo do disco no servidor central",
      "A memória RAM usada pelo aparelho",
      "O tamanho do código gerado no build",
      "A quantidade de dados que fica salva"
    ],
    "a": 0
  },
  "Qual a diferença central entre lote e streaming?": {
    "o": [
      "Lote processa janelas; streaming processa conforme chega",
      "Streaming não usa dados em lote nenhum",
      "Lote é sempre mais rápido que streaming",
      "Streaming só funciona em banco relacional",
      "Lote não pode transformar dados de entrada"
    ],
    "a": 0
  },
  "O que um rastro distribuído mostra?": {
    "o": [
      "O caminho e o tempo de cada etapa da requisição",
      "A cor do log que aparece no terminal",
      "O espaço em disco usado pela aplicação",
      "A senha do serviço interno da empresa",
      "A topologia física do prédio inteiro"
    ],
    "a": 0
  },
  "O que a interpolação faz em jogos com rede?": {
    "o": [
      "Suaviza a posição entre pacotes recebidos",
      "Aumenta a taxa de quadros do jogo",
      "Reduz o tráfego de rede a zero",
      "Corrige a física do personagem no chão",
      "Criptografa os pacotes enviados ao servidor"
    ],
    "a": 0
  },
  "O que SLAM resolve?": {
    "o": [
      "Mapear o ambiente e se localizar ao mesmo tempo",
      "Somar vetores de força no braço do robô",
      "Carregar a bateria do robô na base",
      "Trocar a garra do braço mecânico",
      "Compilar o firmware antigo do aparelho"
    ],
    "a": 0
  },
  "O que é deriva de dados?": {
    "o": [
      "Mudança no perfil dos dados que chegam ao modelo",
      "Erro de sintaxe no código do projeto",
      "Falha física do disco do servidor",
      "Troca de linguagem pelo time novo",
      "Aumento de memória do host principal"
    ],
    "a": 0
  },
  "Por que privacidade deve entrar no projeto desde o começo?": {
    "o": [
      "Porque a coleta e o uso de dado pessoal têm consequência real",
      "Porque deixa o código menor e mais claro",
      "Porque acelera o build do projeto inteiro",
      "Porque reduz a memória usada pelo sistema",
      "Porque elimina a necessidade de testes"
    ],
    "a": 0
  },
  "Uma linguagem de programação serve para...": {
    "o": [
          "escrever instruções para a máquina",
          "traduzir a tela em imagens fixas",
          "guardar arquivos no disco rígido",
          "medir a velocidade do processador",
          "conectar o computador à tomada"
    ],
    "a": 0
  },
  "Criptografia simétrica usa...": {
    "o": [
          "a mesma chave para cifrar e decifrar",
          "duas chaves, uma pública e uma privada",
          "uma chave pública trocada a cada mensagem",
          "a senha do usuário como chave única",
          "nenhuma chave, só embaralha os bits"
    ],
    "a": 0
  },
  "O que um compilador faz?": {
    "o": [
          "Traduz o código para outra linguagem antes de rodar",
          "Executa o código linha por linha, sem traduzir",
          "Guarda o código em disco para rodar mais tarde",
          "Desenha a interface e trata os eventos de entrada",
          "Compara o código com o padrão e aponta o erro"
    ],
    "a": 0
  },
  "O que é uma API?": {
    "o": [
          "Um contrato para dois programas conversarem",
          "Um banco de dados que guarda as mensagens",
          "Uma senha que libera o acesso ao sistema",
          "Um programa que desenha a tela do usuário",
          "Uma linguagem usada só por servidores"
    ],
    "a": 0
  },
  "O que é uma condição de corrida?": {
    "o": [
          "O resultado depende da ordem de acesso concorrente",
          "O disco enche porque os arquivos não são apagados",
          "O sistema reinicia sozinho ao detectar um erro",
          "O mesmo trecho roda sempre na mesma ordem",
          "A memória cresce sem que ninguém a libere"
    ],
    "a": 0
  },
  "Deadlock difere de livelock porque...": {
    "o": [
          "no deadlock os processos ficam parados; no livelock mudam sem progredir",
          "no deadlock os processos avançam; no livelock ficam parados",
          "no deadlock só um processo trava; no livelock todos travam",
          "no deadlock a memória acaba; no livelock o disco enche",
          "no deadlock o erro é fatal; no livelock ele é ignorado"
    ],
    "a": 0
  },
  "Memória virtual permite...": {
    "o": [
          "usar disco como extensão e isolar processos",
          "aumentar a velocidade do processador",
          "guardar arquivos mesmo com o PC desligado",
          "rodar dois sistemas operacionais ao mesmo tempo",
          "comprimir as imagens exibidas na tela"
    ],
    "a": 0
  },
  "O coletor de lixo...": {
    "o": [
          "libera memória que não é mais alcançável",
          "apaga os arquivos temporários do sistema",
          "compacta o disco para liberar espaço",
          "fecha os programas que pararam de responder",
          "limpa o cache do navegador ao fechar"
    ],
    "a": 0
  },
  "Uma operação idempotente...": {
    "o": [
          "repetida produz o mesmo resultado",
          "repetida altera o estado a cada chamada",
          "executada uma vez só, nunca duas vezes",
          "deve ser desfeita manualmente se falhar",
          "só funciona dentro de uma transação aberta"
    ],
    "a": 0
  },
  "Uma transação de banco é...": {
    "o": [
          "uma unidade atômica de trabalho",
          "um lote de comandos rodados em ordem",
          "uma cópia de segurança feita à noite",
          "um índice que acelera as consultas",
          "uma sessão aberta por um usuário"
    ],
    "a": 0
  },
  "Empuxo é a força...": {
    "o": [
          "que um fluido exerce para cima",
          "que a gravidade exerce sobre o corpo",
          "que o atrito opõe ao movimento",
          "que o corpo exerce sobre o fluido",
          "que a pressão atmosférica aplica"
    ],
    "a": 0
  },
  "Temperatura mede...": {
    "o": [
          "a agitação média das partículas",
          "o calor total que o corpo guarda",
          "a pressão que o gás faz na parede",
          "a energia cinética total do corpo",
          "o tempo que o corpo leva para aquecer"
    ],
    "a": 0
  },
  "Uma lente convergente...": {
    "o": [
          "aproxima raios paralelos num foco",
          "afasta raios paralelos de um foco",
          "não desvia os raios que atravessam",
          "espalha a luz em cores separadas",
          "inverte a imagem sem mudar o foco"
    ],
    "a": 0
  },
  "A luz muda de direção ao entrar na água porque...": {
    "o": [
          "muda de velocidade ao passar de um meio para outro.",
          "perde energia ao bater na superfície da água.",
          "é atraída pela massa de água do copo.",
          "encontra um meio com mais massa e mais peso.",
          "a luz é uma partícula e portanto tem peso."
    ],
    "a": 0
  },
  "Para que serve a análise dimensional?": {
    "o": [
          "Conferir se os dois lados de uma equação têm a mesma dimensão",
          "Encontrar o valor numérico exato da medida",
          "Escolher o instrumento mais adequado ao experimento",
          "Corrigir o erro aleatório de cada leitura",
          "Definir o padrão de massa do sistema internacional"
    ],
    "a": 0
  },
  "No ponto mais alto de um lançamento vertical, o que é verdade?": {
    "o": [
          "A velocidade é zero e a aceleração continua a da gravidade",
          "A velocidade e a aceleração são ambas zero",
          "A aceleração é zero e a velocidade é máxima",
          "A velocidade e a aceleração apontam para cima",
          "A aceleração inverte de sinal e a velocidade dobra"
    ],
    "a": 0
  },
  "Do que depende o empuxo sobre um corpo submerso?": {
    "o": [
          "Do volume de fluido deslocado e da densidade do fluido",
          "Da massa do corpo e da sua profundidade",
          "Da forma do recipiente e da cor do fluido",
          "Da profundidade do corpo e da pressão do ar",
          "Da temperatura do corpo e da massa do fluido"
    ],
    "a": 0
  },
  "O que acontece com o tempo de um relógio em alta velocidade?": {
    "o": [
          "Passa mais devagar em relação ao observador parado",
          "Passa mais rápido em relação ao observador parado",
          "Fica igual para qualquer observador",
          "Para completamente em qualquer velocidade",
          "Depende só da massa do relógio"
    ],
    "a": 0
  },
  "O que o princípio da incerteza impede?": {
    "o": [
          "Conhecer posição e momento com precisão total ao mesmo tempo",
          "Conhecer a massa de uma partícula isolada",
          "Detectar um fóton com um sensor comum",
          "Medir a carga elétrica de um elétron",
          "Aquecer um sistema sem fornecer energia"
    ],
    "a": 0
  },
  "O que a difração de raios X revela?": {
    "o": [
          "A estrutura cristalina do material",
          "A cor e o brilho da superfície polida",
          "A massa molar e a densidade do composto",
          "A dureza e a condutividade térmica",
          "A temperatura de fusão do cristal"
    ],
    "a": 0
  },
  "O que define um plasma?": {
    "o": [
          "Gás com elétrons e íons livres, condutor e sensível a campo",
          "Qualquer gás aquecido acima de mil graus",
          "Um líquido ionizado que conduz corrente",
          "Um sólido condutor com elétrons livres",
          "Uma mistura de gases em baixa pressão"
    ],
    "a": 0
  },
  "O que a difusão faz espontaneamente?": {
    "o": [
          "Espalha partículas do meio mais concentrado para o menos concentrado",
          "Junta partículas do meio menos concentrado no mais concentrado",
          "Move partículas só quando há energia externa",
          "Move apenas cargas elétricas em um campo",
          "Impede que o sistema chegue ao equilíbrio"
    ],
    "a": 0
  },
  "O que o espectro de infravermelho revela numa molécula?": {
    "o": [
          "Grupos funcionais pelas vibrações das ligações",
          "A massa do núcleo e o número de nêutrons",
          "O tempo de reação e a cor do solvente",
          "A pressão do frasco e a temperatura",
          "O número de nêutrons do isótopo"
    ],
    "a": 0
  },
  "Como verificar se uma simulação física convergiu?": {
    "o": [
          "Repetir com passo menor e comparar resultados",
          "Rodar uma única vez e olhar o gráfico",
          "Aumentar a janela até o resultado mudar",
          "Trocar a linguagem e medir o arquivo",
          "Medir o tamanho do arquivo de saída"
    ],
    "a": 0
  },
  "O momento linear total se conserva quando...": {
    "o": [
          "Não há força externa resultante",
          "Não há atrito entre os corpos que colidem",
          "A colisão é perfeitamente inelástica",
          "A energia cinética se conserva na colisão",
          "O sistema está isolado de campos gravitacionais"
    ],
    "a": 0
  },
  "A terceira lei de Newton diz que...": {
    "o": [
          "Toda ação tem uma reação de mesmo módulo e sentido oposto",
          "A força resultante é sempre constante",
          "O movimento continua até uma força parar",
          "A reação é maior quando a massa é maior",
          "Ação e reação se anulam no mesmo corpo"
    ],
    "a": 0
  },
  "A primeira lei da termodinâmica diz que...": {
    "o": [
          "a energia se conserva, contando calor e trabalho",
          "a entropia de um sistema isolado sempre aumenta",
          "o calor flui sempre do frio para o quente",
          "o trabalho de um ciclo é sempre nulo",
          "a temperatura permanece constante em qualquer processo"
    ],
    "a": 0
  },
  "Trabalho é...": {
    "o": [
          "força na direção do deslocamento",
          "força vezes tempo de aplicação",
          "energia térmica de um corpo",
          "potência dividida pelo tempo",
          "massa vezes aceleração"
    ],
    "a": 0
  },
  "Uma onda transversal vibra...": {
    "o": [
          "perpendicular à direção de propagação",
          "paralela à direção de propagação",
          "em círculos ao redor do eixo",
          "sempre no sentido da gravidade",
          "na mesma direção da velocidade da fonte"
    ],
    "a": 0
  },
  "O calor latente muda...": {
    "o": [
          "o estado físico sem mudar a temperatura",
          "a massa do corpo sem mudar o volume",
          "a cor do material sem mudar a massa",
          "a temperatura sem mudar o estado",
          "a pressão sem mudar a temperatura"
    ],
    "a": 0
  },
  "O comprimento de onda é...": {
    "o": [
          "a distância entre dois picos consecutivos",
          "a altura máxima que a onda alcança",
          "a velocidade com que a onda se propaga",
          "o tempo que a onda leva para repetir",
          "a energia que a onda transporta"
    ],
    "a": 0
  },
  "Calor específico é...": {
    "o": [
          "energia para variar 1 grau por unidade de massa",
          "o calor total que um corpo recebe",
          "a temperatura máxima que um corpo atinge",
          "a energia para mudar de estado físico",
          "a massa de água equivalente ao corpo"
    ],
    "a": 0
  },
  "A dispersão da luz branca no prisma acontece porque...": {
    "o": [
          "cada cor tem índice de refração diferente",
          "o prisma aquece a luz que o atravessa",
          "a luz perde energia ao entrar no vidro",
          "as cores têm massas diferentes na luz",
          "o vidro reflete só as cores quentes"
    ],
    "a": 0
  },
  "Entropia mede...": {
    "o": [
          "a dispersão da energia, ligada ao número de arranjos possíveis.",
          "a velocidade média das moléculas do gás.",
          "a pressão que o gás faz nas paredes.",
          "o calor específico do material aquecido.",
          "a massa total do sistema isolado."
    ],
    "a": 0
  },
  "A imagem formada por um espelho plano é...": {
    "o": [
          "virtual, do mesmo tamanho e atrás do espelho.",
          "real, menor e formada na frente do espelho.",
          "real, invertida e maior que o objeto.",
          "virtual e sempre menor que o objeto.",
          "virtual, invertida e na frente do espelho."
    ],
    "a": 0
  },
  "Ação e reação atuam em qual corpo?": {
    "o": [
          "Em corpos diferentes, cada um recebendo uma força",
          "No mesmo corpo, se anulando por completo",
          "Só no corpo mais pesado dos dois",
          "Só no corpo que está em movimento",
          "No centro de massa do sistema"
    ],
    "a": 0
  },
  "O que o número de Reynolds indica?": {
    "o": [
          "Se o escoamento tende a laminar ou turbulento",
          "A massa do fluido que atravessa a seção",
          "A pressão atmosférica sobre o fluido",
          "A altura da coluna de fluido no tubo",
          "O calor específico do fluido aquecido"
    ],
    "a": 0
  },
  "O que o transistor faz num amplificador?": {
    "o": [
          "Usa um sinal pequeno para controlar um sinal grande de uma fonte",
          "Converte calor da fonte em eletricidade",
          "Aumenta a carga elétrica disponível",
          "Muda a frequência da rede elétrica",
          "Bloqueia toda a corrente do circuito"
    ],
    "a": 0
  },
  "Na relatividade geral, o que a gravidade é?": {
    "o": [
          "A curvatura do espaço-tempo causada por massa e energia",
          "Uma força magnética entre massas",
          "O atrito do vácuo entre corpos",
          "O peso do éter que preenche o espaço",
          "Uma aceleração constante universal"
    ],
    "a": 0
  },
  "Por que o emaranhamento não permite comunicação instantânea?": {
    "o": [
          "O resultado da medida é aleatório; a correlação só aparece comparando",
          "Porque a luz ainda é lenta demais para a distância",
          "Porque o estado se desfaz ao separar as partículas",
          "Porque a medida destrói a partícula medida",
          "Porque o efeito só funciona no vácuo perfeito"
    ],
    "a": 0
  },
  "O que o espectro de linhas revela?": {
    "o": [
          "A composição e os níveis de energia do material",
          "A distância exata entre a fonte e o sensor",
          "A massa total do objeto observado",
          "A cor real do gás sem influência do olho",
          "O tempo de exposição do filme usado"
    ],
    "a": 0
  },
  "Por que o plasma precisa ficar confinado?": {
    "o": [
          "Para manter alta temperatura e densidade longe das paredes",
          "Para ficar mais pesado e não flutuar",
          "Para virar sólido ao tocar a parede",
          "Para emitir mais luz visível ao olho",
          "Para perder carga e virar gás neutro"
    ],
    "a": 0
  },
  "O que a dose mede em física médica?": {
    "o": [
          "A energia de radiação depositada por massa de tecido",
          "O tempo total que o exame durou",
          "A voltagem aplicada no aparelho",
          "A espessura do osso atravessado",
          "A temperatura do tubo de raios X"
    ],
    "a": 0
  },
  "O que energiza a espontaneidade de uma reação?": {
    "o": [
          "A variação negativa de energia livre",
          "O aumento da massa dos reagentes",
          "A presença de um catalisador",
          "A cor do frasco em que ocorre",
          "A agitação mecânica da mistura"
    ],
    "a": 0
  },
  "O teorema de Noether relaciona...": {
    "o": [
          "Simetrias e leis de conservação",
          "Calor e trabalho em um ciclo",
          "Massa e cor de um corpo",
          "Pressão e volume de um gás",
          "Carga e campo elétrico"
    ],
    "a": 0
  },
  "Um transformador troca tensão porque...": {
    "o": [
          "a variação de fluxo acopla duas bobinas",
          "aquece o fio até mudar a corrente",
          "divide a corrente entre dois circuitos",
          "o ferro do núcleo conduz a tensão",
          "os ímãs giram dentro da bobina"
    ],
    "a": 0
  },
  "O que a entropia mede?": {
    "o": [
          "O número de arranjos possíveis de um sistema",
          "A velocidade da luz no meio",
          "A carga elétrica acumulada",
          "O trabalho realizado num ciclo",
          "A temperatura absoluta do sistema"
    ],
    "a": 0
  },
  "A dualidade onda-partícula diz que...": {
    "o": [
          "A matéria e a luz mostram onda ou partícula conforme o experimento",
          "Só a luz é onda e só a matéria é partícula",
          "A partícula não existe, é só onda",
          "Todo corpo é onda quando está parado",
          "A onda e a partícula são dois corpos distintos"
    ],
    "a": 0
  },
  "O princípio da incerteza diz que...": {
    "o": [
          "posição e momento não têm precisão simultânea arbitrária",
          "tudo é incerto no mundo quântico",
          "a luz é sempre onda e nunca partícula",
          "a energia não se conserva em escala pequena",
          "o observador cria a partícula ao medir"
    ],
    "a": 0
  },
  "O rendimento de Carnot depende de...": {
    "o": [
          "das temperaturas das fontes quente e fria",
          "da massa e da pressão do gás",
          "da cor e do material do cilindro",
          "do volume do reservatório quente",
          "da velocidade do pistão no ciclo"
    ],
    "a": 0
  },
  "Entropia pode ser vista como...": {
    "o": [
          "o número de arranjos compatíveis com o macroestado",
          "a energia total guardada no sistema",
          "a temperatura absoluta do sistema",
          "o trabalho que o sistema pode fazer",
          "a massa de cada estado acessível"
    ],
    "a": 0
  },
  "O efeito Doppler explica...": {
    "o": [
          "a mudança de frequência por movimento relativo",
          "a cor dos objetos iluminados",
          "a gravidade entre duas massas",
          "o desvio da luz ao passar no vidro",
          "o aquecimento de um corpo em atrito"
    ],
    "a": 0
  },
  "Um gás ideal supõe...": {
    "o": [
          "colisões elásticas e volume das moléculas desprezível",
          "moléculas com volume grande e colisões inelásticas",
          "pressão zero em qualquer temperatura",
          "forças atrativas fortes entre as moléculas",
          "moléculas paradas até receber calor"
    ],
    "a": 0
  },
  "Fótons têm...": {
    "o": [
          "energia proporcional à frequência",
          "massa de repouso maior que zero",
          "carga elétrica negativa",
          "tamanho comparável ao do átomo",
          "spin inteiro e carga positiva"
    ],
    "a": 0
  },
  "O efeito Hall separa cargas...": {
    "o": [
          "por uma corrente num campo magnético",
          "por gravidade num fluido parado",
          "por atrito entre dois metais",
          "por aquecimento de um cristal",
          "por pressão num gás ionizado"
    ],
    "a": 0
  },
  "Um corpo negro emite...": {
    "o": [
          "radiação com espectro que depende da temperatura",
          "luz só visível e de uma cor fixa",
          "nada, por definição de corpo negro",
          "radiação igual em qualquer temperatura",
          "luz polarizada de comprimento fixo"
    ],
    "a": 0
  },
  "A lei de Faraday diz que...": {
    "o": [
          "variação de fluxo magnético induz tensão",
          "carga gera campo elétrico ao redor",
          "ação e reação têm mesmo módulo",
          "corrente constante gera tensão nula",
          "campo magnético atrai cargas paradas"
    ],
    "a": 0
  },
  "Dilatação térmica é...": {
    "o": [
          "aumento de dimensões com a temperatura",
          "mudança de massa com a temperatura",
          "perda de carga elétrica ao aquecer",
          "mudança de estado com a pressão",
          "aumento de densidade com o calor"
    ],
    "a": 0
  },
  "O princípio de Pascal diz que...": {
    "o": [
          "pressão aplicada a um fluido se transmite igualmente",
          "a pressão diminui com a profundidade",
          "o fluido não exerce força nas paredes",
          "o empuxo depende só do volume do corpo",
          "a vazão é igual em qualquer seção"
    ],
    "a": 0
  },
  "Por que o céu é azul?": {
    "o": [
          "Porque o espalhamento é maior para os comprimentos de onda curtos.",
          "Porque o Sol emite mais luz azul que as outras cores.",
          "Porque o ar tem uma cor própria que se vê de longe.",
          "Porque a luz azul viaja mais rápido que o vermelho.",
          "Porque a atmosfera absorve o vermelho antes de o azul."
    ],
    "a": 0
  },
  "O que a terceira lei de Kepler relaciona?": {
    "o": [
          "Período orbital e raio da órbita",
          "Massa e peso de um planeta",
          "Velocidade e aceleração orbital",
          "Força gravitacional e energia",
          "Temperatura e pressão da atmosfera"
    ],
    "a": 0
  },
  "O que é o horizonte de eventos?": {
    "o": [
          "A fronteira a partir da qual nada escapa",
          "A superfície sólida do buraco negro",
          "O centro de massa da estrela colapsada",
          "A borda da galáxia que o contém",
          "O disco de matéria que cai nele"
    ],
    "a": 0
  },
  "O que é um condensado de Bose-Einstein?": {
    "o": [
          "Muitos átomos no mesmo estado quântico de menor energia",
          "Um gás que virou líquido por resfriamento",
          "Um plasma quente e muito ionizado",
          "Um sólido cristalino com núcleos ordenados",
          "Uma mistura de dois gases inertes"
    ],
    "a": 0
  },
  "Para que servem os detectores num acelerador?": {
    "o": [
          "Medir trajetória e energia das partículas produzidas",
          "Acelerar as partículas até a colisão",
          "Resfriar os ímãs do acelerador",
          "Gerar o vácuo dentro do tubo",
          "Fornecer a energia para o feixe"
    ],
    "a": 0
  },
  "Por que nanopartículas se comportam diferente do mesmo material em volume?": {
    "o": [
          "A superfície domina e efeitos quânticos crescem",
          "A química muda e o elemento vira outro",
          "A gravidade muda na escala pequena",
          "O núcleo atômico diminui de tamanho",
          "A massa do material desaparece"
    ],
    "a": 0
  },
  "O que é albedo?": {
    "o": [
          "A fração da radiação que a superfície reflete",
          "O calor retido na atmosfera",
          "A quantidade de chuva anual",
          "A velocidade do vento na superfície",
          "A umidade do ar sobre o solo"
    ],
    "a": 0
  },
  "O que decide se um fóton excita uma molécula?": {
    "o": [
          "A energia do fóton casar com a transição disponível",
          "A cor do recipiente onde ela está",
          "A massa da molécula e da pressão",
          "A pressão do ar dentro do frasco",
          "O tempo de exposição à luz"
    ],
    "a": 0
  },
  "O que um gêmeo digital exige para valer?": {
    "o": [
          "Dados reais e calibração contínua",
          "Só um desenho bonito do equipamento",
          "Apenas software pronto de prateleira",
          "Nenhum sensor nem histórico de dados",
          "Um único teste de campo no início"
    ],
    "a": 0
  },
  "O que um intervalo de confiança informa?": {
    "o": [
          "A faixa provável do valor, com nível de confiança",
          "O valor exato da medida do experimento",
          "A causa do fenômeno que se mediu",
          "O erro zero de um instrumento aferido",
          "O tempo total do experimento"
    ],
    "a": 0
  },
  "Um indicador ácido-base muda de cor...": {
    "o": [
          "perto do ponto de virada do pH",
          "quando a solução esquenta ou esfria",
          "sempre que o pH fica neutro",
          "quando a solução congela no frasco",
          "só depois da titulação terminar"
    ],
    "a": 0
  },
  "O átomo é...": {
    "o": [
          "a menor unidade de um elemento",
          "a menor parte de uma mistura",
          "um grupo de moléculas ligadas",
          "uma partícula com carga elétrica",
          "a menor unidade de um composto"
    ],
    "a": 0
  },
  "Para que serve uma titulação?": {
    "o": [
          "Para determinar a concentração de uma solução por reação com volume conhecido.",
          "Para separar os componentes por ponto de ebulição.",
          "Para medir a cor de uma solução em um tubo.",
          "Para pesar o precipitado formado no frasco.",
          "Para acelerar a reação com um catalisador."
    ],
    "a": 0
  },
  "Ao diluir uma solução com água, o que acontece com o soluto?": {
    "o": [
          "A quantidade continua a mesma e a concentração cai",
          "A quantidade de soluto dobra com a água",
          "O soluto evapora junto com o solvente",
          "A concentração sobe porque há mais volume",
          "O soluto muda de fórmula química"
    ],
    "a": 0
  },
  "O que uma energia livre de Gibbs negativa indica?": {
    "o": [
          "Reação espontânea nas condições dadas",
          "Reação impossível naquelas condições",
          "Equilíbrio exato entre reagentes e produtos",
          "Reação instantânea em qualquer temperatura",
          "Ausência total de entalpia no sistema"
    ],
    "a": 0
  },
  "O que diferencia a polimerização por condensação?": {
    "o": [
          "Libera uma molécula pequena, como água",
          "Não altera a massa da cadeia final",
          "Usa sempre um único tipo de monômero",
          "Só acontece com metais no meio",
          "Dispensa calor em qualquer processo"
    ],
    "a": 0
  },
  "Por que metal pesado exige cuidado por longo prazo?": {
    "o": [
          "Ele não se degrada, fica no ambiente e na cadeia alimentar",
          "Ele evapora rápido na temperatura ambiente",
          "Ele vira gás inofensivo com o tempo",
          "Ele desaparece quando recebe luz do sol",
          "Ele só existe dentro do laboratório"
    ],
    "a": 0
  },
  "Para que serve o reciclo num processo químico?": {
    "o": [
          "Devolver reagente não convertido para aumentar o rendimento global",
          "Aumentar a temperatura do reator principal",
          "Dispensar o catalisador da etapa lenta",
          "Eliminar a etapa de separação do produto",
          "Mudar o produto que sai no final"
    ],
    "a": 0
  },
  "Quando a mecânica molecular é mais indicada?": {
    "o": [
          "Para sistemas grandes, com aproximação por campo de força",
          "Para calcular os elétrons dos orbitais",
          "Para reações com quebra de ligação",
          "Para obter massas atômicas exatas",
          "Para bandas de energia em metais"
    ],
    "a": 0
  },
  "O que a absorção de luz faz na fotoquímica?": {
    "o": [
          "Excita a molécula e abre caminhos de reação",
          "Só aquece a amostra sem mudar nada",
          "Remove elétrons do núcleo atômico",
          "Muda o elemento químico da amostra",
          "Não altera a molécula de forma alguma"
    ],
    "a": 0
  },
  "O que a previsão computacional dá antes do ensaio?": {
    "o": [
          "Um candidato provável, que ainda precisa ser testado",
          "A certeza absoluta do resultado final",
          "A síntese pronta para publicar",
          "O preço do frasco no fornecedor",
          "A cor final do composto obtido"
    ],
    "a": 0
  },
  "Por que a nomenclatura química precisa ser estável?": {
    "o": [
          "Para identificar a substância sem ambiguidade",
          "Para deixar os nomes mais bonitos",
          "Para encurtar o texto dos artigos",
          "Para dispensar a fórmula estrutural",
          "Para escolher a cor do composto"
    ],
    "a": 0
  },
  "A cromatografia separa por...": {
    "o": [
          "diferença de afinidade entre as fases",
          "diferença de peso atômico dos átomos",
          "cor apenas, sem interação química",
          "tamanho do frasco usado na coluna"
    ],
    "a": 0
  },
  "Um mol é...": {
    "o": [
          "uma quantidade com o número de Avogadro",
          "uma unidade de massa atômica padrão",
          "um volume fixo de qualquer gás",
          "uma concentração em gramas por litro"
    ],
    "a": 0
  },
  "Balancear uma equação garante...": {
    "o": [
          "a mesma quantidade de átomos dos dois lados",
          "o mesmo volume de gás nos dois lados",
          "a mesma cor das soluções envolvidas",
          "o mesmo número de moléculas de cada tipo"
    ],
    "a": 0
  },
  "Solubilidade é...": {
    "o": [
          "a quantidade máxima de soluto que dissolve",
          "a cor que a solução apresenta",
          "a massa total do solvente usado",
          "a velocidade com que o soluto some"
    ],
    "a": 0
  },
  "A ligação metálica envolve...": {
    "o": [
          "elétrons livres compartilhados entre íons",
          "pares de elétrons fixos nos átomos",
          "prótons que circulam pela rede",
          "íons positivos ligados por pontes"
    ],
    "a": 0
  },
  "Concentração é...": {
    "o": [
          "quantidade de soluto por volume de solução",
          "massa do solvente em cada frasco",
          "cor da solução depois de diluída",
          "temperatura em que o soluto dissolve"
    ],
    "a": 0
  },
  "A eletrólise usa...": {
    "o": [
          "corrente elétrica para forçar uma reação",
          "calor apenas para decompor o composto",
          "luz para romper as ligações químicas",
          "pressão para separar os componentes"
    ],
    "a": 0
  },
  "Um hidrocarboneto saturado tem...": {
    "o": [
          "só ligações simples entre carbonos",
          "ligações duplas entre os carbonos",
          "anéis aromáticos na cadeia",
          "triplas ligações na estrutura"
    ],
    "a": 0
  },
  "Uma solução saturada está...": {
    "o": [
          "no limite de soluto dissolvido",
          "sem nenhum soluto dissolvido",
          "sempre mais diluída que as outras",
          "com metade do soluto que caberia"
    ],
    "a": 0
  },
  "Quando uma ligação tende a ser iônica?": {
    "o": [
          "Quando a diferença de eletronegatividade entre os átomos é grande",
          "Quando os átomos têm eletronegatividade igual",
          "Quando há hidrogênio ligado a carbono",
          "Quando o átomo tem a camada cheia",
          "Quando a molécula formada é apolar"
    ],
    "a": 0
  },
  "O que um catalisador muda?": {
    "o": [
          "A energia de ativação e a velocidade",
          "O equilíbrio final da reação",
          "A massa total dos produtos",
          "A fórmula química dos reagentes",
          "A entalpia total do sistema"
    ],
    "a": 0
  },
  "O que acontece com a enzima ao final da reação?": {
    "o": [
          "Ela está livre para catalisar de novo",
          "Ela é consumida junto com o substrato",
          "Ela se transforma no produto final",
          "Ela muda de elemento após a catálise",
          "Ela passa a ser o substrato da enzima"
    ],
    "a": 0
  },
  "Por que o termofixo não pode ser remoldado?": {
    "o": [
          "Suas cadeias formam rede reticulada permanente",
          "Ele derrete fácil com pouco calor",
          "É feito de metal e não de polímero",
          "Não tem carbono na composição",
          "Tem cadeias curtas e muito soltas"
    ],
    "a": 0
  },
  "Por que a zeólita serve como peneira molecular?": {
    "o": [
          "Os canais têm tamanho que deixa passar só certas moléculas",
          "Ela derrete fácil e prende o soluto",
          "Ela é metálica e conduz corrente",
          "Tem pH fixo em qualquer solução",
          "Não possui poros na sua estrutura"
    ],
    "a": 0
  },
  "Qual processo forma chuva ácida?": {
    "o": [
          "Óxidos de enxofre e nitrogênio reagem com água na atmosfera",
          "Ozônio se acumula perto do solo",
          "Metano evapora do solo úmido",
          "Chumbo se dissolve na água da chuva",
          "Sal se precipita nas nuvens altas"
    ],
    "a": 0
  },
  "O que é envenenamento de catalisador?": {
    "o": [
          "Substância que prende nos sítios ativos e reduz a atividade",
          "Aumento de temperatura no leito catalítico",
          "Troca do catalisador por outro mais novo",
          "Aumento de pressão dentro do reator",
          "Mudança na cor do catalisador usado"
    ],
    "a": 0
  },
  "O que a DFT aproxima?": {
    "o": [
          "A energia em função da densidade eletrônica",
          "A massa exata do núcleo atômico",
          "A temperatura da amostra aquecida",
          "A taxa de reação em cada instante",
          "A cor final do composto formado"
    ],
    "a": 0
  },
  "Por que a cadeia de custódia importa na análise forense?": {
    "o": [
          "Garante que a amostra não foi alterada desde a coleta",
          "Deixa a amostra mais pura para o exame",
          "Acelera a análise no laboratório",
          "Dispensa o padrão de comparação",
          "Reduz o custo do laudo pericial"
    ],
    "a": 0
  },
  "O que um relatório de laboratório precisa registrar?": {
    "o": [
          "Os dados obtidos, inclusive os desvios",
          "Só o melhor resultado da série",
          "A opinião pessoal do professor",
          "A nota que se espera receber",
          "A lista de compras do laboratório"
    ],
    "a": 0
  },
  "O princípio de Le Chatelier diz que o sistema...": {
    "o": [
          "Resiste à perturbação e desloca o equilíbrio",
          "Ignora a perturbação e fica igual",
          "Vira outro elemento químico qualquer",
          "Aumenta a massa total do sistema"
    ],
    "a": 0
  },
  "O que a energia de ligação mede?": {
    "o": [
          "A energia para quebrar uma ligação",
          "O pH da solução em equilíbrio",
          "A massa total do átomo isolado",
          "A cor final do composto estável"
    ],
    "a": 0
  },
  "A espectrometria identifica substâncias por...": {
    "o": [
          "padrão de absorção ou emissão de luz",
          "cheiro característico da amostra",
          "densidade apenas, sem outra medida",
          "ponto de fusão medido no capilar"
    ],
    "a": 0
  },
  "Um erro sistemático...": {
    "o": [
          "desloca todas as medidas no mesmo sentido",
          "varia ao acaso entre as medidas",
          "não afeta nunca a média das medidas",
          "só aparece na última medida feita"
    ],
    "a": 0
  },
  "A eletronegatividade mede...": {
    "o": [
          "a tendência de um átomo atrair elétrons",
          "a massa atômica do elemento",
          "o raio médio do núcleo atômico",
          "o número de nêutrons do isótopo"
    ],
    "a": 0
  },
  "A lei de Hess diz que a entalpia depende...": {
    "o": [
          "dos estados inicial e final, não do caminho",
          "do caminho detalhado da reação",
          "só da pressão aplicada ao sistema",
          "apenas da temperatura do reator"
    ],
    "a": 0
  },
  "Um orbital descreve...": {
    "o": [
          "a região provável de encontrar o elétron",
          "a órbita exata do elétron no átomo",
          "o núcleo e seus prótons internos",
          "o caminho fixo em torno do núcleo"
    ],
    "a": 0
  },
  "Kp e Kc diferem porque...": {
    "o": [
          "Kp usa pressões parciais; Kc usa concentrações",
          "são sempre iguais para qualquer reação",
          "Kp só vale para sólidos e líquidos",
          "Kc usa pressão e Kp usa volume"
    ],
    "a": 0
  },
  "Ressonância estabiliza uma molécula porque...": {
    "o": [
          "os elétrons se espalham por mais de uma posição",
          "aumenta a massa da molécula formada",
          "elimina as ligações entre os átomos",
          "congela a geometria numa só forma"
    ],
    "a": 0
  },
  "Aromaticidade pede...": {
    "o": [
          "anel plano com elétrons π deslocalizados",
          "cadeia aberta com ligações simples",
          "só ligações simples na estrutura",
          "pelo menos um anel que não seja plano"
    ],
    "a": 0
  },
  "Entalpia mede...": {
    "o": [
          "energia térmica a pressão constante",
          "a entropia do sistema isolado",
          "a massa molar do composto puro",
          "a carga elétrica total do íon"
    ],
    "a": 0
  },
  "Energia de ativação é...": {
    "o": [
          "a barreira mínima para a reação começar",
          "a energia total guardada nos produtos",
          "o calor total liberado na reação",
          "a energia do estado final do produto"
    ],
    "a": 0
  },
  "O estado de transição é...": {
    "o": [
          "a configuração de maior energia no caminho",
          "o produto final estável da reação",
          "o reagente inicial colocado no frasco",
          "o catalisador usado na etapa lenta"
    ],
    "a": 0
  },
  "Um grupo funcional é...": {
    "o": [
          "um conjunto de átomos que define o comportamento",
          "a cadeia inteira de carbonos da molécula",
          "um isótopo radioativo do elemento",
          "o nome comercial dado ao composto"
    ],
    "a": 0
  },
  "Polaridade de uma molécula depende...": {
    "o": [
          "da distribuição de carga e da geometria",
          "só da massa molar do composto",
          "só do nome oficial da substância",
          "só da cor observada no frasco"
    ],
    "a": 0
  },
  "A conservação da massa diz que...": {
    "o": [
          "a massa total dos reagentes é a dos produtos",
          "a massa some ao longo da reação",
          "só vale para reações com sólidos",
          "a massa dobra quando há catalisador"
    ],
    "a": 0
  },
  "O que é o reagente limitante?": {
    "o": [
          "O que é consumido primeiro e limita a quantidade de produto",
          "O que está em maior quantidade na mistura",
          "O catalisador que acelera a reação",
          "O produto que sobra no final",
          "O solvente que dissolve a mistura"
    ],
    "a": 0
  },
  "Na oxidação, o que acontece com a espécie?": {
    "o": [
          "Perde elétrons e o número de oxidação aumenta",
          "Ganha elétrons e o número de oxidação cai",
          "Não muda de carga em nenhum instante",
          "Ganha prótons no núcleo do átomo",
          "Perde massa e vira um isótopo"
    ],
    "a": 0
  },
  "O que a reciclagem química faz que a mecânica não faz?": {
    "o": [
          "Quebra o polímero em moléculas menores",
          "Só lava o plástico que chega picado",
          "Derrete o plástico sem separar resinas",
          "Só prensa as peças em blocos grandes",
          "Mistura as resinas sem separá-las"
    ],
    "a": 0
  },
  "O que o craqueamento faz no refino?": {
    "o": [
          "Quebra cadeias longas em moléculas menores",
          "Junta moléculas pequenas em cadeias longas",
          "Só resfria o óleo que sai da torre",
          "Remove a água emulsionada no óleo",
          "Adiciona oxigênio às moléculas"
    ],
    "a": 0
  },
  "Para que serve um código SMILES?": {
    "o": [
          "Representar a estrutura de uma molécula em texto",
          "Medir a massa da amostra no balão",
          "Aquecer a amostra no banho maria",
          "Separar as misturas na coluna cromatográfica",
          "Calcular o pH da solução tampão"
    ],
    "a": 0
  },
  "O que a economia de átomos mede?": {
    "o": [
          "Quanto dos reagentes termina dentro do produto desejado",
          "O custo total do catalisador usado",
          "O tempo total da reação no reator",
          "A cor final do produto obtido",
          "A massa de solvente descartada"
    ],
    "a": 0
  },
  "Por que filtrar candidatos por estabilidade?": {
    "o": [
          "Para não propor material que não existe nas condições de uso",
          "Para acelerar a impressão do relatório",
          "Para reduzir a cor do composto",
          "Para aumentar a massa do produto",
          "Para escolher o fornecedor do insumo"
    ],
    "a": 0
  },
  "Para que serve o pictograma de perigo no rótulo?": {
    "o": [
          "Indicar o tipo de risco de forma padronizada",
          "Decorar o frasco com um símbolo bonito",
          "Mostrar a marca do fabricante do frasco",
          "Informar o preço do produto na loja",
          "Indicar a validade do reagente"
    ],
    "a": 0
  },
  "Um limite descreve...": {
    "o": [
          "o valor que uma sequência se aproxima",
          "o valor máximo que a sequência atinge",
          "a média aritmética dos termos dela",
          "o primeiro termo da sequência dada",
          "a soma de todos os termos da lista"
    ],
    "a": 0
  },
  "O que significa dizer que uma sequência converge para L?": {
    "o": [
          "Os termos ficam tão perto de L quanto se queira, a partir de certo ponto.",
          "Em algum índice a sequência vale exatamente L.",
          "A média dos termos da sequência é L.",
          "A sequência é sempre crescente e termina em L.",
          "Todos os termos ficam iguais a L depois de um ponto."
    ],
    "a": 0
  },
  "Numa rede de visão, a convolução serve para...": {
    "o": [
          "combinar cada pixel com a vizinhança, procurando padrões locais.",
          "guardar a imagem inteira dentro de uma única cor.",
          "traduzir a imagem em texto para o usuário.",
          "apagar o ruído da imagem por completo.",
          "aumentar a resolução da imagem de entrada."
    ],
    "a": 0
  },
  "O que um autovetor representa numa transformação linear?": {
    "o": [
          "Uma direção que a transformação não muda de sentido",
          "Um vetor de tamanho zero por definição",
          "A soma de todas as colunas da matriz",
          "O determinante da matriz aplicada",
          "Uma linha nula da matriz original"
    ],
    "a": 0
  },
  "O que um homeomorfismo preserva?": {
    "o": [
          "A estrutura topológica dos espaços",
          "As distâncias exatas entre os pontos",
          "Os ângulos entre as retas do plano",
          "As áreas das figuras transformadas",
          "As coordenadas dos pontos na malha"
    ],
    "a": 0
  },
  "O que é um equilíbrio de Nash?": {
    "o": [
          "Situação em que ninguém ganha mudando sozinho de estratégia",
          "O resultado com a maior soma de pontos",
          "O jogo sem nenhum vencedor declarado",
          "A estratégia mais arriscada da rodada",
          "O ponto de partida de qualquer jogo"
    ],
    "a": 0
  },
  "O que o princípio da mínima ação determina?": {
    "o": [
          "O caminho que extremiza a ação entre dois pontos no tempo",
          "A velocidade da luz em qualquer vácuo",
          "A massa da partícula em movimento",
          "O campo magnético gerado pela carga",
          "A temperatura do sistema isolado"
    ],
    "a": 0
  },
  "O que um isômero tem igual ao outro?": {
    "o": [
          "A fórmula molecular, com arranjo diferente",
          "A estrutura completa dos átomos",
          "A propriedade química observada",
          "O ponto de ebulição da substância",
          "A cor e a reatividade química"
    ],
    "a": 0
  },
  "O que o problema SAT pergunta?": {
    "o": [
          "Se existe atribuição que torna a fórmula verdadeira",
          "Qual é a raiz da equação dada",
          "Quanto tempo o programa leva para rodar",
          "Qual o tipo da variável de entrada",
          "Quantas linhas tem o código fonte"
    ],
    "a": 0
  },
  "Por que a IA científica precisa de conhecimento de domínio?": {
    "o": [
          "Para descartar previsão que viola lei conhecida",
          "Para treinar o modelo mais rápido",
          "Para reduzir a memória usada no treino",
          "Para escolher a cor do gráfico",
          "Para traduzir os artigos antigos"
    ],
    "a": 0
  },
  "O teorema de Bayes atualiza o quê?": {
    "o": [
          "A probabilidade de uma hipótese diante da evidência",
          "A média dos dados observados no teste",
          "O determinante da matriz de dados",
          "A variância da amostra coletada",
          "A moda da distribuição original"
    ],
    "a": 0
  },
  "Um número é divisível por 3 quando...": {
    "o": [
          "A soma dos algarismos é múltipla de 3",
          "O último algarismo é igual a 3",
          "O número é ímpar e maior que três",
          "O último algarismo é par ou cinco",
          "A diferença entre os algarismos é 3"
    ],
    "a": 0
  },
  "A definição épsilon-delta de limite garante...": {
    "o": [
          "que a função fica perto do limite para todo ponto perto",
          "que a função é sempre crescente perto do ponto",
          "que o limite é um número inteiro qualquer",
          "que a função é contínua em todo o domínio"
    ],
    "a": 0
  },
  "A série harmônica, soma de 1/n...": {
    "o": [
          "diverge, mesmo com termos indo a zero",
          "converge para 1 no limite infinito",
          "converge para e, a base dos logaritmos",
          "converge para zero quando n cresce"
    ],
    "a": 0
  },
  "A lei dos grandes números diz que...": {
    "o": [
          "a média amostral se aproxima da esperada com muitas repetições",
          "todo jogo tem a sorte garantida no longo prazo",
          "a variância da amostra sempre diminui",
          "a probabilidade de acerto cresce a cada rodada"
    ],
    "a": 0
  },
  "Uma função é sobrejetora quando...": {
    "o": [
          "todo elemento do contradomínio é imagem de algum ponto",
          "cada entrada tem duas saídas possíveis",
          "a função é constante em todo o domínio",
          "cada imagem tem no máximo uma entrada"
    ],
    "a": 0
  },
  "Um número irracional...": {
    "o": [
          "não pode ser escrito como fração de inteiros",
          "tem dízima finita e periódica",
          "é sempre negativo na reta real",
          "é sempre raiz de um polinômio"
    ],
    "a": 0
  },
  "Média ponderada usa...": {
    "o": [
          "pesos diferentes para cada valor",
          "só os valores extremos da lista",
          "a mediana no lugar da média",
          "a moda da distribuição dos dados"
    ],
    "a": 0
  },
  "Uma progressão aritmética tem...": {
    "o": [
          "diferença constante entre termos",
          "razão constante entre os termos",
          "termos escolhidos ao acaso na reta",
          "soma constante entre os termos"
    ],
    "a": 0
  },
  "Um número primo tem...": {
    "o": [
          "exatamente dois divisores positivos",
          "apenas um divisor positivo na conta",
          "infinitos divisores positivos",
          "sempre dois algarismos na base dez"
    ],
    "a": 0
  },
  "A mediana é...": {
    "o": [
          "o valor central dos dados ordenados",
          "o valor mais frequente da lista",
          "a média aritmética dos valores",
          "a diferença entre o maior e o menor"
    ],
    "a": 0
  },
  "A função inversa...": {
    "o": [
          "desfaz a operação da função original",
          "é sempre uma função quadrática",
          "não existe para funções crescentes",
          "tem o mesmo gráfico da original"
    ],
    "a": 0
  },
  "Motivo, na música, é...": {
    "o": [
          "a menor ideia reconhecível que se repete e varia.",
          "o compasso inteiro que abre a obra.",
          "a tonalidade principal escolhida para a peça.",
          "o instrumento que toca a melodia principal.",
          "o final da seção que fecha a frase."
    ],
    "a": 0
  },
  "A atenção, dentro do transformer, serve para...": {
    "o": [
          "ponderar quais partes do texto importam para cada passo.",
          "guardar a resposta final antes de imprimir.",
          "impedir que o modelo repita as mesmas palavras.",
          "traduzir automaticamente qualquer idioma.",
          "contar quantas palavras tem a entrada."
    ],
    "a": 0
  },
  "Por que 1 não é primo?": {
    "o": [
          "Porque tem apenas um divisor, e primo precisa de exatamente dois",
          "Porque é ímpar e todo primo é par",
          "Porque é menor que 2 e por isso é par",
          "Porque não pode ser fatorado em nenhum caso",
          "Porque é quadrado perfeito de si mesmo"
    ],
    "a": 0
  },
  "Para que serve um invariante de nós?": {
    "o": [
          "Provar que dois nós não podem ser deformados um no outro",
          "Desenhar o nó mais rápido na tela",
          "Calcular o comprimento total da corda",
          "Medir a espessura do nó no desenho",
          "Contar os cruzamentos de qualquer desenho"
    ],
    "a": 0
  },
  "O que a teoria das filas estuda?": {
    "o": [
          "Espera e atendimento em sistemas com chegadas",
          "Cores usadas nos gráficos de rede",
          "Derivadas de polinômios de grau alto",
          "Números primos e sua distribuição",
          "Formas topológicas e suas bordas"
    ],
    "a": 0
  },
  "O que acontece numa bifurcação de um sistema dinâmico?": {
    "o": [
          "O comportamento muda de qualidade quando o parâmetro varia",
          "O sistema para de existir de repente",
          "A equação perde todas as soluções",
          "A massa do sistema dobra de valor",
          "O estado fica constante para sempre"
    ],
    "a": 0
  },
  "O que a redundância num código faz?": {
    "o": [
          "Permite detectar e corrigir erro na transmissão",
          "Reduz o tamanho da mensagem enviada",
          "Aumenta a velocidade da rede local",
          "Criptografa o conteúdo da mensagem",
          "Comprime a imagem antes de enviar"
    ],
    "a": 0
  },
  "O que torna um argumento válido?": {
    "o": [
          "A conclusão seguir necessariamente das premissas",
          "A conclusão ser verdadeira no mundo real",
          "O autor ser especialista no assunto",
          "O texto ser longo e bem escrito",
          "As premissas serem famosas e aceitas"
    ],
    "a": 0
  },
  "O que fecha o ciclo de descoberta de material?": {
    "o": [
          "A síntese e a medida experimental",
          "O gráfico bonito da simulação",
          "O artigo publicado na revista",
          "O financiamento aprovado do projeto",
          "O banco de dados organizado do grupo"
    ],
    "a": 0
  },
  "O axioma da escolha é independente de ZF. Isso quer dizer que...": {
    "o": [
          "Pode ser aceito ou negado sem contradizer ZF",
          "É falso em qualquer sistema axiomático",
          "Não pode ser usado em nenhuma prova",
          "Vale só para conjuntos finitos",
          "Foi provado a partir dos axiomas de ZF"
    ],
    "a": 0
  },
  "Uma sequência de Cauchy é aquela em que...": {
    "o": [
          "os termos ficam arbitrariamente próximos entre si",
          "os termos são todos inteiros positivos",
          "a soma dos termos sempre diverge",
          "cada termo é maior que o anterior"
    ],
    "a": 0
  },
  "O que é um conjunto incontável?": {
    "o": [
          "Um conjunto sem fim que não pode ser listado em sequência",
          "Um conjunto vazio sem nenhum elemento",
          "Um conjunto com apenas dois elementos",
          "Um conjunto finito de números reais"
    ],
    "a": 0
  },
  "O que o teorema da incompletude de Gödel mostra?": {
    "o": [
          "Que há verdades não demonstráveis em sistemas consistentes fortes",
          "Que toda conta tem resposta em algum sistema",
          "Que a matemática é inútil na prática",
          "Que nenhum sistema tem axiomas",
          "Que todo teorema pode ser provado por computador"
    ],
    "a": 0
  },
  "O teorema do valor médio garante que existe um ponto onde...": {
    "o": [
          "a derivada iguala a taxa média de variação",
          "a função é constante em todo o intervalo",
          "a integral definida é igual a zero",
          "a derivada é maior que qualquer valor"
    ],
    "a": 0
  },
  "Um conjunto é enumerável quando...": {
    "o": [
          "pode ser posto em bijeção com os naturais",
          "é finito e tem poucos elementos",
          "tem medida de Lebesgue igual a zero",
          "é um subconjunto dos números reais"
    ],
    "a": 0
  },
  "Uma matriz quadrada é invertível quando...": {
    "o": [
          "o determinante é diferente de zero",
          "a matriz é simétrica e real",
          "tem muitos elementos iguais a zero",
          "a diagonal principal é toda de uns"
    ],
    "a": 0
  },
  "Um limite lateral...": {
    "o": [
          "aproxima-se por um dos lados do ponto",
          "é o limite quando x vai ao infinito",
          "é a derivada calculada no ponto dado",
          "só existe em funções sempre contínuas"
    ],
    "a": 0
  },
  "Uma sequência converge quando...": {
    "o": [
          "seus termos se aproximam de um limite",
          "cresce sempre sem nunca oscilar",
          "alterna de sinal sem parar nunca",
          "fica constante desde o primeiro termo"
    ],
    "a": 0
  },
  "Um autovalor de uma matriz é...": {
    "o": [
          "um escalar que mantém a direção do autovetor",
          "o determinante da matriz quadrada",
          "a soma de todos os elementos dela",
          "o traço dividido pelo número de linhas"
    ],
    "a": 0
  },
  "Integração por partes vem...": {
    "o": [
          "da regra do produto na derivada",
          "do teorema de Pitágoras nos triângulos",
          "da média aritmética dos extremos",
          "da definição de limite lateral"
    ],
    "a": 0
  },
  "O teorema de Taylor aproxima uma função por...": {
    "o": [
          "um polinômio em torno de um ponto",
          "uma reta só, sem nenhuma curvatura",
          "uma constante igual ao valor médio",
          "uma parábola que passa na origem"
    ],
    "a": 0
  },
  "Um limite no infinito descreve...": {
    "o": [
          "o comportamento quando x cresce sem parar",
          "o valor da função no ponto zero",
          "a derivada da função no ponto",
          "o valor máximo que a função atinge"
    ],
    "a": 0
  },
  "Uma derivada parcial mede...": {
    "o": [
          "a taxa de variação em relação a uma variável, mantendo as outras fixas",
          "a área total sob a superfície da função",
          "o máximo global da função no domínio",
          "a média da função em toda a região",
          "o volume delimitado pelo gráfico da função"
    ],
    "a": 0
  },
  "A lei dos cossenos generaliza...": {
    "o": [
          "o teorema de Pitágoras para qualquer triângulo",
          "a média aritmética para dados agrupados",
          "a derivada para funções compostas",
          "a regra de três para proporções"
    ],
    "a": 0
  },
  "A distribuição de Poisson modela...": {
    "o": [
          "contagem de eventos raros num intervalo",
          "altura de pessoas numa população",
          "soma dos valores de dois dados lançados",
          "tempo até a primeira falha do equipamento"
    ],
    "a": 0
  },
  "O espaço amostral é...": {
    "o": [
          "o conjunto de todos os resultados possíveis",
          "um resultado só do experimento",
          "a média dos resultados obtidos",
          "a probabilidade de cada evento"
    ],
    "a": 0
  },
  "Um número transcendente é...": {
    "o": [
          "não é raiz de polinômio com coeficientes inteiros",
          "sempre racional e periódico no decimal",
          "sempre infinito e não limitado",
          "a raiz de qualquer polinômio de grau 2"
    ],
    "a": 0
  },
  "Por que a série harmônica diverge se os termos vão para zero?": {
    "o": [
          "Termo indo a zero não garante soma finita: a soma acumulada cresce sem teto.",
          "Porque ela alterna de sinal a cada termo.",
          "Porque o primeiro termo é maior que 1.",
          "Porque a razão entre termos é maior que 1.",
          "Ela não diverge: a soma total é finita."
    ],
    "a": 0
  },
  "O que a teoria de Galois relaciona?": {
    "o": [
          "Equações polinomiais e grupos de simetria",
          "Números primos e logaritmos naturais",
          "Matrizes e derivadas parciais",
          "Funções e integrais definidas",
          "Grafos e coloração de vértices"
    ],
    "a": 0
  },
  "O que a homologia persistente mede?": {
    "o": [
          "Quais buracos sobrevivem em várias escalas de análise",
          "A média dos dados coletados no teste",
          "O desvio padrão das variáveis medidas",
          "A correlação entre as colunas da tabela",
          "A quantidade de linhas da tabela"
    ],
    "a": 0
  },
  "O que o número reprodutivo básico R0 indica?": {
    "o": [
          "Quantas pessoas em média um infectado contagia",
          "A taxa de mortalidade da doença",
          "O tempo médio de cura do paciente",
          "A quantidade de vacinas necessárias",
          "O total de pessoas suscetíveis"
    ],
    "a": 0
  },
  "O que uma onda eletromagnética é, na teoria de campos?": {
    "o": [
          "Uma perturbação que se propaga nos campos elétrico e magnético",
          "Um material que viaja pelo espaço vazio",
          "Uma partícula com massa de repouso",
          "Um fluido invisível que preenche o vácuo",
          "Uma força de contato entre duas cargas"
    ],
    "a": 0
  },
  "O que é função objetivo num problema de otimização?": {
    "o": [
          "A quantidade que se quer maximizar ou minimizar",
          "A regra de segurança do processo",
          "O erro de medida do instrumento",
          "O catalisador usado na reação",
          "A temperatura ambiente do laboratório"
    ],
    "a": 0
  },
  "Para que serve um invariante de laço?": {
    "o": [
          "Provar que a propriedade vale em cada iteração",
          "Acelerar a execução do laço no processador",
          "Reduzir a memória usada pelo programa",
          "Gerar o gráfico do desempenho",
          "Medir o tempo de execução do laço"
    ],
    "a": 0
  },
  "O que torna um conjunto de dados realmente reutilizável?": {
    "o": [
          "Licença, dicionário e contexto de coleta",
          "Só o arquivo compactado em zip",
          "Apenas o link para baixar o arquivo",
          "Apenas o gráfico gerado na análise",
          "O nome do autor no cabeçalho do arquivo"
    ],
    "a": 0
  },
  "A semântica estuda...": {
    "o": [
          "o significado das palavras e frases",
          "a pronúncia dos sons da fala",
          "a pontuação e a acentuação",
          "a ordem das palavras na frase",
          "a história das palavras antigas"
    ],
    "a": 0
  },
  "Rima é...": {
    "o": [
          "semelhança de som no fim ou interior do verso",
          "repetição da mesma palavra no verso",
          "pausa que separa dois versos",
          "contagem das sílabas de um verso",
          "divisão do poema em estrofes"
    ],
    "a": 0
  },
  "Sentido literal e sentido figurado se distinguem porque...": {
    "o": [
          "o figurado depende do contexto para dizer outra coisa.",
          "o literal é sempre mais antigo que o figurado.",
          "o figurado é errado e deve ser evitado.",
          "o literal só existe na fala cotidiana.",
          "os dois são idênticos na prática."
    ],
    "a": 0
  },
  "O que um par mínimo demonstra?": {
    "o": [
          "Que a troca de um único som muda o significado",
          "Que a palavra é longa e difícil",
          "Que a escrita segue sempre a fala",
          "Que há sílaba tônica na palavra",
          "Que o texto é ambíguo na leitura"
    ],
    "a": 0
  },
  "O que o preconceito linguístico faz?": {
    "o": [
          "Desqualifica a pessoa pela variedade que ela fala",
          "Corrige a gramática da fala popular",
          "Ensina a norma padrão na escola",
          "Compara os dialetos de cada região",
          "Registra a fala em pesquisa de campo"
    ],
    "a": 0
  },
  "Qual é a diferença entre coesão e coerência?": {
    "o": [
          "Coesão liga as partes; coerência dá unidade de sentido",
          "As duas são a mesma coisa na prática",
          "Coesão é sobre ortografia; coerência, sobre pontuação",
          "Coesão é só repetição; coerência, só o tema",
          "Coerência é a ordem das palavras na frase"
    ],
    "a": 0
  },
  "O que caracteriza um texto expositivo?": {
    "o": [
          "Explicar um assunto sem defender posição",
          "Contar uma história com personagens",
          "Convencer o leitor a mudar de ideia",
          "Dar comandos para o leitor executar",
          "Descrever um lugar com detalhes"
    ],
    "a": 0
  },
  "O que caracteriza o gênero lírico?": {
    "o": [
          "A expressão da emoção pelo ritmo e pela imagem",
          "O enredo longo com muitos personagens",
          "O diálogo escrito para o palco",
          "A notícia factual com data e fonte",
          "A instrução de uso de um aparelho"
    ],
    "a": 0
  },
  "O que a escuta ativa faz?": {
    "o": [
          "Confirma e retoma o que o outro disse antes de responder",
          "Só espera a vez de falar sem ouvir",
          "Interrompe para discordar do outro",
          "Muda de assunto quando fica difícil",
          "Fala mais alto para ser ouvido"
    ],
    "a": 0
  },
  "O que é polissemia?": {
    "o": [
          "Uma palavra com vários sentidos relacionados",
          "Duas palavras iguais com origens diferentes",
          "Uma palavra antiga que saiu de uso",
          "Uma gíria usada por um grupo",
          "Um erro de ortografia comum"
    ],
    "a": 0
  },
  "O que caracteriza o símbolo na semiótica?": {
    "o": [
          "A relação convencional com o que representa",
          "A semelhança física com o objeto",
          "A relação de causa e efeito",
          "A cor escolhida para representar",
          "O tamanho do objeto representado"
    ],
    "a": 0
  },
  "Por que a tradução palavra por palavra costuma falhar?": {
    "o": [
          "Porque expressões e sentidos não funcionam igual nas duas línguas",
          "Porque muda o autor do texto original",
          "Porque diminui o texto traduzido",
          "Porque aumenta a pontuação da frase",
          "Porque altera a ortografia das palavras"
    ],
    "a": 0
  },
  "Referência e sentido são diferentes porque...": {
    "o": [
          "duas expressões podem apontar para o mesmo objeto com sentidos distintos",
          "sentido é o som da palavra e referência é a classe gramatical",
          "referência é a classe gramatical e sentido é o som",
          "os dois termos são sinônimos na filosofia da linguagem"
    ],
    "a": 0
  },
  "Uma implicatura conversacional é...": {
    "o": [
          "um sentido sugerido sem ser dito literalmente",
          "uma mentira dita de propósito ao ouvinte",
          "um erro de concordância na fala",
          "uma verdade dita sem nenhum contexto"
    ],
    "a": 0
  },
  "O sujeito oculto é...": {
    "o": [
          "não aparece, mas pode ser identificado",
          "inexistente na oração analisada",
          "sempre o objeto direto da frase",
          "o mesmo que sujeito indeterminado",
          "o verbo que não tem concordância"
    ],
    "a": 0
  },
  "Denotação e conotação diferem porque...": {
    "o": [
          "denotação é o sentido literal; conotação é figurado",
          "são iguais na prática da leitura",
          "conotação é erro de gramática",
          "denotação só aparece na poesia"
    ],
    "a": 0
  },
  "Oração subordinada é...": {
    "o": [
          "a que exerce função na principal",
          "a que é independente na frase",
          "a que não tem verbo nenhum",
          "a que repete o sujeito da anterior"
    ],
    "a": 0
  },
  "Um conectivo...": {
    "o": [
          "liga ideias e estabelece relação",
          "nomeia os objetos e as pessoas",
          "marca o plural das palavras da frase",
          "indica o tempo verbal da oração"
    ],
    "a": 0
  },
  "Ambiguidade lexical é...": {
    "o": [
          "uma palavra com mais de um sentido possível.",
          "uma frase longa e difícil de ler.",
          "um erro de concordância verbal.",
          "um sotaque regional muito marcado.",
          "um silêncio longo no meio da fala."
    ],
    "a": 0
  },
  "O que é implicatura conversacional?": {
    "o": [
          "Um sentido inferido do contexto, não dito literalmente",
          "Um erro de gramática na fala espontânea",
          "Uma palavra nova criada por um grupo",
          "Um tipo de acento regional marcado",
          "Uma figura de sintaxe da norma"
    ],
    "a": 0
  },
  "O que uma refutação faz na redação argumentativa?": {
    "o": [
          "Responde ao contra-argumento e reforça a tese",
          "Repete a tese sem apresentar prova",
          "Muda de assunto quando fica difícil",
          "Conta uma história para ilustrar",
          "Lista opiniões sem nenhuma ordem"
    ],
    "a": 0
  },
  "O que a indução faz?": {
    "o": [
          "Generaliza a partir de casos observados",
          "Deduz do geral para o particular",
          "Inventa a premissa que faltava",
          "Troca o tema no meio do texto",
          "Apela sempre à emoção do leitor"
    ],
    "a": 0
  },
  "Qual é o problema de ler o slide durante a apresentação?": {
    "o": [
          "A fala perde função e a atenção se dispersa",
          "O público aprende mais e mais rápido",
          "O tempo da apresentação diminui",
          "A apresentação fica mais clara",
          "O slide melhora com a leitura"
    ],
    "a": 0
  },
  "O que é empréstimo linguístico?": {
    "o": [
          "Palavra incorporada de outra língua por contato",
          "Erro de concordância na fala popular",
          "Mudança de acento na mesma palavra",
          "Palavra inventada sem uso nenhum",
          "Cópia de um texto sem citar fonte"
    ],
    "a": 0
  },
  "Por que a consistência terminológica importa?": {
    "o": [
          "Porque o termo técnico tem sentido fixo no domínio",
          "Porque deixa o texto mais bonito",
          "Porque aumenta o tamanho do texto",
          "Porque dispensa a definição inicial",
          "Porque evita a tradução do texto"
    ],
    "a": 0
  },
  "O que o enquadramento faz numa imagem?": {
    "o": [
          "Decide o que aparece e o que fica fora",
          "Define a resolução do arquivo",
          "Escolhe a fonte da legenda",
          "Mede a intensidade da luz na cena",
          "Corrige a cor da fotografia"
    ],
    "a": 0
  },
  "Qual é a diferença entre revisão e editoração?": {
    "o": [
          "Revisão ajusta língua e sentido; editoração prepara a publicação",
          "As duas corrigem só a ortografia do texto",
          "Editoração escreve o texto do começo",
          "Revisão escolhe a capa e o formato",
          "Editoração traduz o texto para outra língua"
    ],
    "a": 0
  },
  "O foco narrativo em primeira pessoa...": {
    "o": [
          "limita a informação ao que o narrador sabe",
          "é sempre onisciente na narrativa",
          "não tem narrador dentro da história",
          "mostra o que todos os personagens pensam"
    ],
    "a": 0
  },
  "Uma pressuposição é...": {
    "o": [
          "uma informação tomada como dada pela frase",
          "uma pergunta indireta na fala",
          "um sinônimo perfeito da palavra",
          "uma afirmação negada no final"
    ],
    "a": 0
  },
  "Um ato de fala é...": {
    "o": [
          "a ação realizada ao dizer algo, como prometer ou pedir",
          "a pronúncia correta das palavras",
          "o número de sílabas da palavra",
          "a ordem das palavras na frase",
          "o significado literal do dicionário"
    ],
    "a": 0
  },
  "A ambiguidade estrutural vem...": {
    "o": [
          "da sintaxe permitir duas leituras",
          "do léxico ter palavras raras",
          "da prosódia marcar a entonação",
          "da pontuação marcar as pausas"
    ],
    "a": 0
  },
  "Metonímia é...": {
    "o": [
          "trocar um termo por outro próximo",
          "exagerar a expressão de propósito",
          "suavizar uma ideia desagradável",
          "repetir o som no fim do verso"
    ],
    "a": 0
  },
  "A coesão lexical ocorre por...": {
    "o": [
          "repetição, sinônimo ou hiperônimo",
          "só pontuação e acentuação",
          "só conectivo entre as orações",
          "só a ordem das palavras na frase"
    ],
    "a": 0
  },
  "Regência verbal estuda...": {
    "o": [
          "a relação entre verbo e complemento",
          "a acentuação das palavras",
          "a pontuação usada na frase",
          "a concordância do sujeito"
    ],
    "a": 0
  },
  "Concordância nominal...": {
    "o": [
          "faz adjetivo e artigo acompanharem o substantivo",
          "concorda o verbo com o sujeito",
          "marca o plural só no verbo",
          "define a regência do verbo"
    ],
    "a": 0
  },
  "Coesão referencial...": {
    "o": [
          "retoma termos por pronome, sinônimo ou elipse",
          "usa só conectivos entre as frases",
          "marca os parágrafos do texto",
          "define o tema do primeiro parágrafo"
    ],
    "a": 0
  },
  "Intertextualidade implícita...": {
    "o": [
          "referencia outro texto sem citar",
          "copia o texto original com aspas",
          "resume outro texto em poucas linhas",
          "traduz o texto para outra língua"
    ],
    "a": 0
  },
  "Pressuposição é...": {
    "o": [
          "a informação que o enunciado toma como já dada.",
          "a resposta que o ouvinte deve dar.",
          "a mensagem principal do parágrafo.",
          "o erro cometido por quem fala.",
          "o oposto exato do sentido literal."
    ],
    "a": 0
  },
  "O que sustenta a leitura irônica de uma frase?": {
    "o": [
          "O contexto e a contradição com o que se sabe",
          "A pontuação usada na frase apenas",
          "O número de sílabas da frase",
          "A classe gramatical das palavras",
          "O dicionário consultado sozinho"
    ],
    "a": 0
  },
  "O que define um gênero do discurso?": {
    "o": [
          "Uma forma de enunciado ligada a uma situação comunicativa",
          "Só a extensão do texto na página",
          "Só o tipo de letra escolhido",
          "Apenas o assunto tratado no texto",
          "O número de páginas do original"
    ],
    "a": 0
  },
  "O que a leitura crítica faz com a fonte?": {
    "o": [
          "Verifica origem, método e interesse antes de aceitar",
          "Ignora a fonte se o texto for bonito",
          "Aceita porque está escrito e publicado",
          "Só olha a data da publicação",
          "Dispensa evidência para acreditar"
    ],
    "a": 0
  },
  "Por que revisar além da ortografia?": {
    "o": [
          "Para ajustar clareza, coesão e adequação ao leitor",
          "Porque a ortografia não importa no texto",
          "Para aumentar o texto com exemplos",
          "Para trocar o tema do trabalho",
          "Para encurtar o texto sem critério"
    ],
    "a": 0
  },
  "O que é o argumento espantalho?": {
    "o": [
          "Distorcer a posição do outro para atacá-la com facilidade",
          "Citar uma autoridade famosa na área",
          "Apelar à emoção de quem está lendo",
          "Generalizar cedo a partir de um caso",
          "Repetir a tese sem nenhuma prova"
    ],
    "a": 0
  },
  "O que o hipertexto permite?": {
    "o": [
          "Leitura por caminhos ligados, não só linear",
          "Texto sem imagens nem formatação",
          "Leitura em voz alta do texto",
          "Texto sem autor nem data de publicação",
          "Correção ortográfica automática"
    ],
    "a": 0
  },
  "O que fortalece a posição num debate?": {
    "o": [
          "Responder ao argumento do outro com evidência",
          "Falar mais alto que todos os outros",
          "Interromper sempre que possível",
          "Mudar de assunto quando pressionado",
          "Ignorar a pergunta feita pelo outro"
    ],
    "a": 0
  },
  "O que um acordo ortográfico muda?": {
    "o": [
          "A grafia oficial, não a pronúncia",
          "A pronúncia das palavras do país",
          "A gramática toda da língua",
          "O vocabulário usado no dia a dia",
          "O sotaque regional dos falantes"
    ],
    "a": 0
  },
  "Qual é a função de um glossário?": {
    "o": [
          "Explicar termos usados num texto ou domínio",
          "Listar todas as palavras da língua",
          "Corrigir a ortografia do texto",
          "Traduzir o texto para outra língua",
          "Contar quantas palavras tem o texto"
    ],
    "a": 0
  },
  "O que acontece quando legenda e imagem se contradizem?": {
    "o": [
          "O sentido nasce do conflito entre as linguagens",
          "A imagem perde o sentido e o texto vale",
          "O texto vence sempre e a imagem é ignorada",
          "Nada muda no sentido final da peça",
          "O leitor ignora os dois por completo"
    ],
    "a": 0
  },
  "Por que o gênero gramatical é difícil para alguns aprendizes?": {
    "o": [
          "Porque pode não existir na língua materna deles",
          "Porque não tem nenhuma regra na língua",
          "Porque muda de cor em cada região",
          "Porque só existe no plural das palavras",
          "Porque depende sempre do verbo"
    ],
    "a": 0
  }
};

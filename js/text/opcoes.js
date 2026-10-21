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
  }
};

// Texto curado de Computação, segunda metade (4.10 a 4.16).

export const CS_B_TEXT = {
  "Modelagem de dados": {
    abre: "Modelar dados é decidir o que existe no domínio e como as coisas se relacionam. Conceitual, lógico e físico são níveis de detalhe, não etapas burocráticas.",
    pratica: "Modele um empréstimo de livros com entidades, atributos e cardinalidades antes de pensar em tabelas.",
    erro: "Começar pela tabela e deixar o domínio se adaptar ao banco.",
  },
  "Bancos de dados relacionais": {
    abre: "O modelo relacional organiza dados em relações e usa SQL para consultá-los. Chaves, integridade e normalização protegem consistência.",
    pratica: "Escreva uma consulta com junção, agregação e filtro e confira o resultado com dados pequenos.",
    erro: "Usar junção sem condição e multiplicar linhas sem perceber.",
  },
  "Bancos não relacionais": {
    abre: "Bancos não relacionais escolhem outro modelo de consistência ou de formato. Chave-valor, documentos, colunas e grafos atendem acessos diferentes.",
    pratica: "Compare guardar um pedido em documento e em tabelas normalizadas, olhando leitura e escrita.",
    erro: "Adotar NoSQL sem entender o padrão de consulta que o sistema precisa.",
  },
  "Sistemas analíticos": {
    abre: "Sistemas analíticos preparam dados para pergunta e decisão. Data warehouses, data lakes e modelagem dimensional organizam história e agregação.",
    pratica: "Descreva um esquema estrela para vendas com uma tabela fato e três dimensões.",
    erro: "Copiar o modelo transacional para o analítico e perder desempenho em agregação.",
  },
  "Engenharia de dados": {
    abre: "Engenharia de dados move e transforma dados com confiabilidade. ETL, ELT e orquestração cuidam de ordem, falha e repetição.",
    pratica: "Desenhe um pipeline que ingere, limpa e publica uma tabela, com o que fazer em caso de falha.",
    erro: "Pipeline sem idempotência que duplica dados a cada reexecução.",
  },
  "Sistemas de informação empresariais": {
    abre: "Sistemas empresariais integram processos e registros. Transacional, ERP e CRM precisam de regra de negócio explícita e trilha de auditoria.",
    pratica: "Escolha um processo de compra e descreva os estados pelos quais ele passa.",
    erro: "Automatizar processo sem definir quem pode mudar de estado.",
  },
  "Fundamentos de IA": {
    abre: "IA clássica representa conhecimento e raciocina sobre ele. Busca, regras e planejamento resolvem problemas antes de qualquer aprendizado estatístico.",
    pratica: "Modele um quebra-cabeça como grafo de estados e descreva a busca em largura até a solução.",
    erro: "Chamar de IA qualquer sistema com regra fixa e esperar generalização que ele não tem.",
  },
  "Aprendizado de máquina": {
    abre: "Aprendizado de máquina ajusta modelo a dados para generalizar. Supervisionado, não supervisionado e semissupervisionado mudam o tipo de sinal disponível.",
    pratica: "Separe treino e teste de um conjunto pequeno e compare o erro nos dois.",
    erro: "Avaliar no mesmo dado usado para treinar e concluir que o modelo generaliza.",
  },
  "Aprendizado profundo": {
    abre: "Redes profundas empilham transformações aprendidas. Convolução, atenção e normalização viram indutores poderosos quando há dado e cuidado.",
    pratica: "Explique por que uma camada convolucional é adequada a imagem e não a uma tabela comum.",
    erro: "Aumentar profundidade sem dado suficiente e culpar o treino pelo overfitting.",
  },
  "Modelos de linguagem e IA generativa": {
    abre: "Modelos de linguagem aprendem distribuição de sequências e geram texto por predição. Contexto, tokenização e avaliação mudam o comportamento.",
    pratica: "Compare a saída de um modelo com contexto curto e longo para a mesma pergunta e discuta o que mudou.",
    erro: "Tratar fluência como garantia de fato.",
  },
  "Visão computacional": {
    abre: "Visão computacional transforma pixels em informação. Detecção, segmentação e classificação exigem representação adequada e dados representativos.",
    pratica: "Descreva as etapas de um detector de objetos e onde cada erro pode aparecer.",
    erro: "Avaliar modelo com imagens do mesmo cenário do treino e superestimar o desempenho.",
  },
  "Áudio e fala": {
    abre: "Áudio e fala lidam com sinal temporal. Espectrograma, reconhecimento e síntese precisam de alinhamento e ruído controlado.",
    pratica: "Explique por que o mesmo reconhecedor erra mais em gravação com eco.",
    erro: "Treinar com voz limpa e esperar o mesmo resultado em ambiente ruidoso.",
  },
  "Planejamento e sistemas autônomos": {
    abre: "Planejamento escolhe sequência de ações para atingir objetivo. Reforço aprende por recompensa, e segurança exige limite explícito.",
    pratica: "Escreva a função de recompensa de um agente que deve chegar ao destino sem bater.",
    erro: "Recompensa mal desenhada que premia o comportamento errado.",
  },
  "IA confiável": {
    abre: "IA confiável cobre explicação, robustez, justiça e privacidade. Um modelo que acerta sem poder ser auditado não serve para toda decisão.",
    pratica: "Para um modelo de crédito, liste três grupos de risco e como testar viés.",
    erro: "Publicar métrica agregada e ignorar desempenho ruim em subgrupo.",
  },
  "Fundamentos de segurança": {
    abre: "Segurança protege confidencialidade, integridade e disponibilidade. Modelagem de ameaças identifica ativo, adversário e caminho de ataque antes do incidente.",
    pratica: "Faça a modelagem de ameaças de um login simples, listando ativos e superfícies.",
    erro: "Comprar ferramenta antes de saber qual ameaça está sendo tratada.",
  },
  "Criptografia": {
    abre: "Criptografia usa chave para transformar mensagem. Simétrica e assimétrica resolvem problemas diferentes, e protocolos combinam as duas.",
    pratica: "Explique por que troca de chave usa criptografia assimétrica e dados usam simétrica.",
    erro: "Inventar algoritmo próprio e chamar de seguro.",
  },
  "Identidade e controle de acesso": {
    abre: "Identidade responde quem é, acesso responde o que pode. Autenticação e autorização são etapas separadas.",
    pratica: "Descreva um fluxo de login com segundo fator e o que acontece se o token vazar.",
    erro: "Confundir autenticação com autorização e liberar tudo para quem entrou.",
  },
  "Segurança de redes": {
    abre: "Segurança de rede controla tráfego e detecta anomalia. Firewall, IDS e segmentação reduzem superfície de ataque.",
    pratica: "Desenhe uma regra de firewall que permita só o necessário para um serviço web.",
    erro: "Regra ampla demais que abre porta que ninguém precisava.",
  },
  "Segurança de aplicações": {
    abre: "Aplicação segura valida entrada, escapa saída e protege sessão. Injeção, XSS e falha de controle de acesso são erros de desenho e de código.",
    pratica: "Encontre em um formulário de exemplo onde falta validação e onde falta escape.",
    erro: "Confiar em validação só no navegador.",
  },
  "Resposta e investigação": {
    abre: "Resposta a incidente contém dano e aprende com ele. Monitoramento, SIEM e preservação de evidência sustentam a investigação.",
    pratica: "Escreva os primeiros cinco passos ao detectar acesso anômalo em um servidor.",
    erro: "Reiniciar a máquina antes de coletar evidência.",
  },
  "Segurança de infraestrutura": {
    abre: "Infraestrutura endurecida reduz caminho de ataque. Hardening, patch e inventário são manutenção contínua.",
    pratica: "Liste três configurações padrão inseguras e o ajuste recomendado.",
    erro: "Endurecer uma vez e nunca revisar após mudança de serviço.",
  },
  "Governança e privacidade": {
    abre: "Governança define política, responsabilidade e conformidade. Privacidade trata dado pessoal com base legal e minimização.",
    pratica: "Para um cadastro, liste quais dados são necessários e por quanto tempo guardar.",
    erro: "Coletar dado sem finalidade declarada e guardar para sempre.",
  },
  "DevOps": {
    abre: "DevOps aproxima desenvolvimento e operação por automação. Integração contínua e entrega contínua reduzem o custo de mudar.",
    pratica: "Descreva um pipeline mínimo que testa e publica uma aplicação.",
    erro: "Automatizar implantação sem teste automatizado antes.",
  },
  "SRE — engenharia de confiabilidade de sites": {
    abre: "SRE trata confiabilidade com orçamento de erro. Disponibilidade, latência e taxa de erro orientam prioridade.",
    pratica: "Defina um SLI e um SLO para uma API e diga o que fazer quando o orçamento acaba.",
    erro: "Prometer 100 por cento de disponibilidade e não ter plano para falha.",
  },
  "Observabilidade": {
    abre: "Observabilidade permite entender sistema em produção. Métricas, logs e rastros respondem perguntas diferentes.",
    pratica: "Escolha uma pergunta operacional e diga qual dos três sinais a responde melhor.",
    erro: "Coletar log sem estrutura e não conseguir filtrar por request.",
  },
  "Engenharia de plataforma": {
    abre: "Plataforma oferece caminho pronto para o time entregar. Golden paths reduzem decisão repetida sem tirar autonomia.",
    pratica: "Descreva um caminho padrão para criar serviço com repositório, pipeline e observabilidade.",
    erro: "Criar plataforma que só funciona para o time que a construiu.",
  },
  "Infraestrutura e automação": {
    abre: "Infraestrutura como código torna ambiente reproduzível. Linux, containers e Kubernetes exigem entender estado e declaratividade.",
    pratica: "Escreva o manifesto de um serviço com limite de recurso e sonda de saúde.",
    erro: "Aplicar manifesto sem revisar o que será alterado.",
  },
  "Operações em nuvem": {
    abre: "Operação em nuvem lida com identidade, rede, custo e região. Arquitetura precisa considerar falha e latência do provedor.",
    pratica: "Liste três decisões de arquitetura que mudam o custo mensal.",
    erro: "Ignorar limite de conta e permissão ao automatizar.",
  },
  "DevSecOps": {
    abre: "DevSecOps coloca segurança no pipeline. Análise de dependência e segredo fora do código evitam falha repetida.",
    pratica: "Adicione ao pipeline uma verificação de segredo e uma de dependência vulnerável.",
    erro: "Deixar a análise de segurança como etapa manual no fim.",
  },
  "Engenharia de releases": {
    abre: "Release é mudança controlada. Canary, blue-green e rollback tornam a implantação observável e reversível.",
    pratica: "Escolha uma estratégia para uma mudança de banco e explique o rollback.",
    erro: "Implantar tudo de uma vez sem métrica de saúde.",
  },
  "Desenvolvimento web": {
    abre: "Web combina HTML, CSS e JavaScript no navegador. Semântica, acessibilidade e desempenho são parte do produto, não enfeite.",
    pratica: "Construa um formulário acessível com rótulo, foco visível e mensagem de erro.",
    erro: "Usar div clicável no lugar de botão e quebrar teclado e leitor de tela.",
  },
  "Aplicações móveis": {
    abre: "Aplicativo móvel lida com tela pequena, bateria e rede instável. Android e iOS impõem ciclo de vida e permissões próprios.",
    pratica: "Descreva o que acontece com uma requisição quando o app vai para segundo plano.",
    erro: "Assumir conexão permanente e perder dado do usuário.",
  },
  "Interação humano-computador": {
    abre: "IHC estuda pessoas usando sistemas. Usabilidade, ergonomia e acessibilidade medem esforço e barreira.",
    pratica: "Peça a alguém para realizar uma tarefa e anote onde a pessoa hesita.",
    erro: "Testar com a equipe e concluir que o usuário real vai entender.",
  },
  "Computação gráfica e multimídia": {
    abre: "Computação gráfica transforma modelo em imagem. Renderização, geometria e compressão equilibram qualidade e custo.",
    pratica: "Explique a diferença entre rasterizar e traçar raios em uma cena simples.",
    erro: "Ignorar o custo de memória de textura ao planejar o visual.",
  },
  "Jogos e ambientes interativos": {
    abre: "Jogo é sistema interativo com regra, estado e resposta. Motor, física e laço de atualização sustentam a experiência.",
    pratica: "Descreva o laço de um jogo simples com entrada, atualização, colisão e desenho.",
    erro: "Prender a lógica ao quadro por segundo e quebrar a física em máquina lenta.",
  },
  "Engenharia de hardware": {
    abre: "Hardware transforma lógica em circuito. Portas, temporização e integração decidem frequência, consumo e confiabilidade.",
    pratica: "Descreva o caminho de um sinal de clock em um contador simples.",
    erro: "Ignorar atraso de propagação ao projetar caminho crítico.",
  },
  "Sistemas embarcados": {
    abre: "Embarcado é computador dedicado dentro de outro produto. Microcontrolador, firmware e tempo real impõem restrição de memória e resposta.",
    pratica: "Liste o que precisa acontecer em um semáforo a cada interrupção de tempo.",
    erro: "Usar alocação dinâmica sem limite em sistema de memória pequena.",
  },
  "Internet das Coisas": {
    abre: "IoT conecta sensor, atuador e rede. Consumo, alcance e atualização de firmware definem o ciclo de vida do dispositivo.",
    pratica: "Descreva o que o dispositivo faz se a rede cair por uma hora.",
    erro: "Projetar dispositivo sem caminho de atualização segura.",
  },
  "Robótica": {
    abre: "Robótica junta percepção, planejamento e atuação. Cinemática e dinâmica dizem o que o corpo pode fazer e com que esforço.",
    pratica: "Explique por que a cinemática inversa pode ter mais de uma solução.",
    erro: "Planejar trajetória sem considerar limite de torque.",
  },
  "Sistemas ciberfísicos": {
    abre: "Sistema ciberfísico acopla software e mundo físico. Sensores, atuadores e controle exigem garantia de tempo e segurança.",
    pratica: "Descreva um laço de controle de temperatura com sensor, decisão e atuador.",
    erro: "Ignorar atraso de sensor e criar oscilação no controle.",
  },
  "Preparação e exploração de dados": {
    abre: "Dado bruto não serve para decisão. Coleta, limpeza e exploração revelam problema de qualidade antes do modelo.",
    pratica: "Em uma tabela pequena, encontre valor ausente, duplicado e fora de faixa.",
    erro: "Preencher ausente com zero sem saber o que zero significa no domínio.",
  },
  "Mineração de dados": {
    abre: "Mineração procura padrão em dado. Associação, agrupamento e regra descrevem estrutura sem necessariamente prever.",
    pratica: "Encontre um padrão de cesta de compra em um conjunto pequeno e diga o suporte.",
    erro: "Tratar coincidência em dado pequeno como regra geral.",
  },
  "Aprendizado estatístico": {
    abre: "Aprendizado estatístico equilibra ajuste e generalização. Validação cruzada e regularização medem o que o modelo aprendeu de verdade.",
    pratica: "Compare erro de treino e validação em modelo simples e em modelo muito flexível.",
    erro: "Escolher modelo pelo erro de treino.",
  },
  "Engenharia de machine learning": {
    abre: "ML em produção exige pipeline, versionamento e monitoramento. Dado e modelo precisam ser reproduzíveis.",
    pratica: "Descreva como detectar que a distribuição dos dados de entrada mudou.",
    erro: "Treinar uma vez e nunca monitorar deriva.",
  },
  "Especialidades": {
    abre: "Aplicações estatísticas especializadas levam modelagem a economia, saúde e biologia. Cada domínio impõe estrutura e validação próprias.",
    pratica: "Compare uma série econômica e uma sequência biológica quanto a dependência temporal.",
    erro: "Importar modelo de um domínio sem revisar as hipóteses.",
  },
};

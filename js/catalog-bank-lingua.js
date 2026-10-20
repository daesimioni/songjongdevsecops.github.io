// Banco de conteúdo de Língua Portuguesa: uma seção por área, três tópicos
// por área. Cada tópico é uma estação (página) e uma pergunta de monstro.

export const LINGUA_BANK = {
  lingua: {
    "lingua-gramatica": [
      {
        name: "Fonética e fonologia",
        def: "Fonética estuda os sons da fala; fonologia estuda como cada língua organiza esses sons em unidades que distinguem palavras.",
        keys: [
          "Fonema é a unidade sonora que muda significado.",
          "Par mínimo é duas palavras que só diferem por um som.",
          "A letra não é igual ao som: uma letra pode ter vários sons.",
        ],
        mistake: "Contar letras como se fossem fonemas e concluir que a palavra tem mais sons.",
        q: {
          q: "O que um par mínimo demonstra?",
          o: ["Que a troca de um único som muda o significado", "Que a palavra é longa", "Que a escrita segue a fala", "Que há sílaba tônica", "Que o texto é ambíguo", "Que a frase é agramatical"],
          a: 0,
          why: "Como em pata e bata, a diferença de um fonema basta para distinguir palavras.",
        },
      },
      {
        name: "Morfologia",
        def: "Morfologia estuda a estrutura da palavra: radical, afixos e desinências formam o sentido e a flexão.",
        keys: [
          "Prefixo entra antes do radical; sufixo, depois.",
          "Derivação cria palavra nova; flexão só varia forma.",
          "Composição junta dois radicais.",
        ],
        mistake: "Chamar de derivação o que é apenas flexão de plural ou de gênero.",
        q: {
          q: "O que a derivação faz que a flexão não faz?",
          o: ["Cria uma palavra nova", "Muda só o número", "Muda só o tempo verbal", "Muda a entonação", "Muda a ordem da frase", "Muda o alfabeto"],
          a: 0,
          why: "Na derivação nasce outro vocábulo, como em pedra e pedreiro; a flexão mantém o mesmo vocábulo.",
        },
      },
      {
        name: "Sintaxe e concordância",
        def: "Sintaxe organiza os termos da oração. A concordância faz verbo e sujeito, artigo e substantivo combinarem.",
        keys: [
          "Sujeito e verbo concordam em número e pessoa.",
          "Orações subordinadas exercem função dentro da principal.",
          "A ordem dos termos muda o foco, mas não a função.",
        ],
        mistake: "Concordar com o termo mais próximo em vez do sujeito em casos como a maioria dos alunos chegou.",
        q: {
          q: "Com o que o verbo concorda na oração?",
          o: ["Com o sujeito", "Com o objeto direto", "Com o adjunto adverbial", "Com o predicativo sempre", "Com o aposto", "Com a conjunção"],
          a: 0,
          why: "A regra geral é a concordância entre verbo e sujeito em número e pessoa.",
        },
      },
    ],
    "lingua-pragmatica": [
      {
        name: "Atos de fala",
        def: "Falar também é agir: pedir, prometer, advertir e declarar são atos com condições próprias.",
        keys: [
          "Ato locutório é o que se diz; ilocutório, o que se faz ao dizer.",
          "Uma promessa exige intenção e compromisso.",
          "Certos atos dependem do papel de quem fala.",
        ],
        mistake: "Achar que declarar algo oficialmente funciona fora da situação que autoriza o ato.",
        q: {
          q: "O que acontece quando alguém diz eu prometo e realmente assume o compromisso?",
          o: ["Realiza um ato ilocutório de promessa", "Apenas descreve uma ação", "Comete erro de sintaxe", "Muda de assunto", "Cria uma pressuposição falsa", "Faz uma pergunta retórica"],
          a: 0,
          why: "O ato de prometer se realiza no próprio dizer, dado o compromisso assumido.",
        },
      },
      {
        name: "Máximas conversacionais",
        def: "A conversa segue expectativas de cooperação: quantidade, qualidade, relevância e clareza. Quebrar a expectativa gera inferência.",
        keys: [
          "Implicatura é o que se infere sem estar dito.",
          "A implicatura pode ser cancelada por uma ressalva.",
          "Ironia costuma nascer da quebra proposital da máxima de qualidade.",
        ],
        mistake: "Tratar implicatura como significado literal da frase.",
        q: {
          q: "O que é implicatura conversacional?",
          o: ["Um sentido inferido do contexto, não dito literalmente", "Um erro de gramática", "Uma palavra nova", "Um tipo de acento", "Uma figura de sintaxe", "Uma falha de concordância"],
          a: 0,
          why: "Ela nasce da cooperação e do contexto, podendo ser cancelada sem contradição.",
        },
      },
      {
        name: "Ironia e humor",
        def: "Ironia diz o contrário do que se quer significar, apoiada no contexto e na entonação. O humor joga com ambiguidade e expectativa.",
        keys: [
          "O contexto decide se a frase é irônica.",
          "Ambiguidade é matéria-prima de piada.",
          "A quebra de expectativa é o núcleo de muitas piadas.",
        ],
        mistake: "Ler ironia sem contexto e concluir que o falante acredita no que disse.",
        q: {
          q: "O que sustenta a leitura irônica de uma frase?",
          o: ["O contexto e a contradição com o que se sabe", "A pontuação apenas", "O número de sílabas", "A classe gramatical", "O tempo verbal", "O dicionário sozinho"],
          a: 0,
          why: "Sem o contexto, a frase parece afirmação séria; é o contexto que inverte o sentido.",
        },
      },
    ],
    "lingua-linguistica": [
      {
        name: "Sociolinguística",
        def: "Sociolinguística estuda a variação ligada a região, grupo social e situação. Toda variedade é sistemática.",
        keys: [
          "Variação regional convive com a norma padrão.",
          "Preconceito linguístico julga a pessoa pela variedade.",
          "Registro muda conforme a situação, não conforme o valor da pessoa.",
        ],
        mistake: "Chamar de erro o que é variação linguística legítima.",
        q: {
          q: "O que o preconceito linguístico faz?",
          o: ["Desqualifica a pessoa pela variedade que ela fala", "Corrige a gramática", "Ensina a norma padrão", "Compara dialetos", "Registra a fala", "Traduz o texto"],
          a: 0,
          why: "Ele transforma diferença linguística em julgamento social, sem base científica.",
        },
      },
      {
        name: "Linguística histórica",
        def: "Linguística histórica estuda a mudança das línguas no tempo, comparando formas e reconstruindo etapas anteriores.",
        keys: [
          "O português vem do latim vulgar.",
          "Mudança fonética é regular em grande parte dos casos.",
          "Cognatos ajudam a reconstruir a origem comum.",
        ],
        mistake: "Achar que a língua antiga era mais correta que a atual.",
        q: {
          q: "De que língua o português se originou?",
          o: ["Do latim", "Do grego", "Do árabe", "Do espanhol", "Do francês", "Do galego moderno"],
          a: 0,
          why: "O português é língua românica, formada a partir do latim falado na Península Ibérica.",
        },
      },
      {
        name: "Psicolinguística",
        def: "Psicolinguística investiga como o cérebro produz e compreende linguagem: acesso lexical, leitura e aquisição.",
        keys: [
          "A criança adquire a língua sem ensino formal.",
          "Leitura fluente automatiza o reconhecimento de palavras.",
          "O processamento é incremental: decidimos enquanto ouvimos.",
        ],
        mistake: "Achar que compreender é só decodificar palavra por palavra.",
        q: {
          q: "O que a psicolinguística investiga?",
          o: ["Como o cérebro processa a linguagem", "A etimologia das palavras", "As regras de pontuação", "A história literária", "A tradução automática", "A ortografia oficial"],
          a: 0,
          why: "Ela estuda os processos mentais de produção, compreensão e aquisição da língua.",
        },
      },
    ],
    "lingua-discurso": [
      {
        name: "Coesão e coerência",
        def: "Coesão liga as partes do texto por conectivos e retomadas; coerência é a unidade de sentido que o texto constrói.",
        keys: [
          "Conjunção, pronome e repetição criam coesão.",
          "Coerência depende do conhecimento de mundo e da situação.",
          "Texto coeso pode ser incoerente se contradiz o sentido.",
        ],
        mistake: "Achar que encher o texto de conectivos garante coerência.",
        q: {
          q: "Qual é a diferença entre coesão e coerência?",
          o: ["Coesão liga as partes; coerência dá unidade de sentido", "As duas são a mesma coisa", "Coesão é sobre ortografia", "Coerência é sobre pontuação", "Coesão é só repetição", "Coerência é só tema"],
          a: 0,
          why: "A coesão é a amarração formal; a coerência é a possibilidade de o texto fazer sentido como um todo.",
        },
      },
      {
        name: "Análise do discurso",
        def: "Análise do discurso estuda como o texto constrói posição, identidade e relação de poder no contexto histórico.",
        keys: [
          "O lugar de fala afeta o que pode ser dito.",
          "Intertextualidade liga textos entre si.",
          "Discurso institucional costuma usar linguagem impessoal.",
        ],
        mistake: "Analisar só a frase e ignorar quem fala, para quem e em que situação.",
        q: {
          q: "O que a intertextualidade estuda?",
          o: ["As relações de sentido entre textos", "A divisão silábica", "A concordância verbal", "A etimologia", "A pontuação", "O número de parágrafos"],
          a: 0,
          why: "Textos dialogam por citação, paródia, retomada e referência, e esse diálogo produz sentido.",
        },
      },
      {
        name: "Gêneros do discurso",
        def: "Gênero é forma relativamente estável de enunciado, ligada a uma situação: receita, notícia, edital, mensagem e assim por diante.",
        keys: [
          "O gênero organiza conteúdo, estilo e forma.",
          "Gêneros digitais misturam imagem, texto e interação.",
          "Mudar de gênero muda o que é adequado dizer.",
        ],
        mistake: "Avaliar texto jornalístico com as regras de um relatório técnico.",
        q: {
          q: "O que define um gênero do discurso?",
          o: ["Uma forma de enunciado ligada a uma situação comunicativa", "Só a extensão do texto", "Só o tipo de letra", "Apenas o assunto", "O número de páginas", "O autor apenas"],
          a: 0,
          why: "O gênero nasce da atividade social e estabiliza conteúdo, estilo e estrutura.",
        },
      },
    ],
    "lingua-leitura": [
      {
        name: "Compreensão literal",
        def: "Compreensão literal é localizar o que o texto diz: informação explícita, tema e estrutura.",
        keys: [
          "Localizar informação exige marcar o que está escrito.",
          "Tema é o assunto central; ideia principal é o que se afirma sobre ele.",
          "Resumo curto testa a compreensão literal.",
        ],
        mistake: "Responder com opinião quando a pergunta pede informação do texto.",
        q: {
          q: "O que a compreensão literal exige?",
          o: ["Recuperar informação explícita no texto", "Inventar uma conclusão", "Opinar sobre o assunto", "Comparar com outros textos", "Corrigir a gramática", "Reescrever o final"],
          a: 0,
          why: "Ela fica no que está dito, sem inferência adicional.",
        },
      },
      {
        name: "Inferência",
        def: "Inferir é concluir o que o texto não diz explicitamente, com base no dito e no conhecimento de mundo.",
        keys: [
          "Pressuposto é o que o texto toma como dado.",
          "Subentendido depende do contexto da enunciação.",
          "Toda inferência precisa de apoio no texto.",
        ],
        mistake: "Projetar na leitura algo que o texto não autoriza.",
        q: {
          q: "Qual é o limite de uma inferência válida?",
          o: ["Ela precisa ter apoio no texto e no contexto", "Ela pode inventar qualquer coisa", "Ela dispensa o texto", "Ela vale só em literatura", "Ela precisa de dados numéricos", "Ela é sempre do autor"],
          a: 0,
          why: "Sem apoio textual, deixa de ser leitura e passa a ser projeção do leitor.",
        },
      },
      {
        name: "Leitura crítica",
        def: "Ler criticamente é avaliar fonte, argumento e evidência, separando fato de opinião e percebendo interesse.",
        keys: [
          "Fonte confiável mostra origem e método.",
          "Falácia argumentativa não prova a conclusão.",
          "Fato verificável difere de opinião sobre o fato.",
        ],
        mistake: "Aceitar afirmação por ser bem escrita e ter número no meio.",
        q: {
          q: "O que a leitura crítica faz com a fonte?",
          o: ["Verifica origem, método e interesse antes de aceitar", "Ignora a fonte se o texto for bonito", "Aceita porque está escrito", "Só olha a data", "Só olha o autor", "Dispensa evidência"],
          a: 0,
          why: "A confiabilidade depende de saber quem produziu, como e com qual interesse.",
        },
      },
    ],
    "lingua-redacao": [
      {
        name: "Estruturas textuais",
        def: "Texto se organiza em tipos: narração, descrição, exposição, argumentação e injunção. Cada um tem marca própria.",
        keys: [
          "Narração conta fatos em sequência.",
          "Exposição explica sem defender tese.",
          "Injunção orienta ação, como receita e manual.",
        ],
        mistake: "Defender tese em texto que deveria só explicar.",
        q: {
          q: "O que caracteriza um texto expositivo?",
          o: ["Explicar um assunto sem defender posição", "Contar uma história", "Convencer o leitor", "Dar comandos", "Descrever um lugar", "Fazer poesia"],
          a: 0,
          why: "A exposição informa e organiza o conhecimento; a argumentação é que defende tese.",
        },
      },
      {
        name: "Redação argumentativa",
        def: "Argumentar é sustentar tese com evidência, antecipar objeção e concluir com progressão lógica.",
        keys: [
          "Tese é a afirmação a sustentar.",
          "Evidência sustenta e pode ser verificada.",
          "Refutação responde ao contra-argumento.",
        ],
        mistake: "Dar opinião sem evidência e chamar isso de argumento.",
        q: {
          q: "O que uma refutação faz na redação argumentativa?",
          o: ["Responde ao contra-argumento e reforça a tese", "Repete a tese sem prova", "Muda de assunto", "Conta uma história", "Lista opiniões", "Finaliza o texto"],
          a: 0,
          why: "Refutar mostra que a objeção foi considerada e não derruba a posição defendida.",
        },
      },
      {
        name: "Revisão e clareza",
        def: "Revisar é reler procurando erro, ambiguidade e excesso. Clareza e concisão são escolhas, não enfeite.",
        keys: [
          "Frase longa demais esconde o sujeito e a ação.",
          "Voz passiva esconde o agente com facilidade.",
          "Reescrever melhora mais que só corrigir ortografia.",
        ],
        mistake: "Achar que revisão é só passar corretor ortográfico.",
        q: {
          q: "Por que revisar além da ortografia?",
          o: ["Para ajustar clareza, coesão e adequação ao leitor", "Porque a ortografia não importa", "Para aumentar o texto", "Para trocar o tema", "Para mudar o autor", "Para encurtar sem critério"],
          a: 0,
          why: "A revisão textual ajusta o que o texto faz com o leitor, não apenas a grafia.",
        },
      },
    ],
    "lingua-argumentacao": [
      {
        name: "Retórica",
        def: "Retórica estuda a persuasão: ethos, credibilidade; pathos, emoção; logos, razão e evidência.",
        keys: [
          "Ethos é a imagem de quem fala.",
          "Pathos apela à emoção do público.",
          "Logos organiza prova racional.",
        ],
        mistake: "Chamar de argumento o que é só apelo emocional.",
        q: {
          q: "O que ethos representa no discurso?",
          o: ["A credibilidade de quem fala", "A emoção do público", "A prova numérica", "A conclusão do texto", "O tema central", "O gênero textual"],
          a: 0,
          why: "Ethos é a confiança que o orador inspira; sem ela, o argumento perde força.",
        },
      },
      {
        name: "Lógica informal",
        def: "Lógica informal avalia argumentos do dia a dia: dedução, indução e analogia, com força e limite de cada um.",
        keys: [
          "Dedução parte do geral e conclui o caso particular.",
          "Indução generaliza a partir de casos observados.",
          "Analogia transfere semelhança, mas não prova.",
        ],
        mistake: "Tratar generalização feita a partir de poucos casos como lei.",
        q: {
          q: "O que a indução faz?",
          o: ["Generaliza a partir de casos observados", "Deduz do geral para o particular", "Inventa a premissa", "Troca o tema", "Apela à emoção", "Repete a conclusão"],
          a: 0,
          why: "Ela vai do particular para o geral e por isso mesmo é provável, não certa.",
        },
      },
      {
        name: "Falácias",
        def: "Falácia é argumento que parece válido, mas não sustenta a conclusão. Tem nome e diagnóstico.",
        keys: [
          "Ad hominem ataca a pessoa, não a tese.",
          "Espantalho distorce a posição do outro para refutá-la.",
          "Falso dilema reduz a duas opções o que tem várias.",
        ],
        mistake: "Responder à pessoa em vez de responder ao argumento.",
        q: {
          q: "O que é o argumento espantalho?",
          o: ["Distorcer a posição do outro para atacá-la com facilidade", "Citar autoridade", "Apelar à emoção", "Generalizar cedo", "Repetir a tese", "Usar dado falso"],
          a: 0,
          why: "Ele substitui a tese real por uma versão enfraquecida e vence essa versão.",
        },
      },
    ],
    "lingua-generos": [
      {
        name: "Gêneros literários",
        def: "Literatura se organiza em lírico, narrativo e dramático. Conto, romance, crônica e poema têm marcas próprias.",
        keys: [
          "Narrativa tem narrador, enredo e personagens.",
          "Lírico organiza a emoção pelo ritmo e pela imagem.",
          "Dramático se constrói para o palco.",
        ],
        mistake: "Classificar todo texto curto como conto, mesmo sem narrativa.",
        q: {
          q: "O que caracteriza o gênero lírico?",
          o: ["A expressão da emoção pelo ritmo e pela imagem", "O enredo longo", "O diálogo para o palco", "A notícia factual", "A instrução de uso", "O relatório técnico"],
          a: 0,
          why: "O lírico trabalha a subjetividade e a sonoridade, não a sequência de fatos.",
        },
      },
      {
        name: "Gêneros jornalísticos",
        def: "Jornalismo se organiza em notícia, reportagem, entrevista, editorial e artigo de opinião, com contratos diferentes.",
        keys: [
          "Notícia relata fato com apuração.",
          "Editorial expressa posição do veículo.",
          "Reportagem aprofunda com contexto e fonte.",
        ],
        mistake: "Tratar artigo de opinião como notícia isenta.",
        q: {
          q: "Qual gênero expressa a posição do veículo?",
          o: ["Editorial", "Notícia", "Reportagem", "Entrevista", "Resumo", "Edital"],
          a: 0,
          why: "O editorial é o espaço institucional de opinião do jornal.",
        },
      },
      {
        name: "Gêneros digitais",
        def: "Gêneros digitais misturam texto, imagem e interação: post, thread, meme, wiki, podcast e comentário.",
        keys: [
          "Multimodalidade combina linguagens no mesmo enunciado.",
          "Hipertexto permite caminho não linear.",
          "Meme depende de repertório compartilhado para funcionar.",
        ],
        mistake: "Avaliar post de rede social com o mesmo contrato de uma notícia.",
        q: {
          q: "O que o hipertexto permite?",
          o: ["Leitura por caminhos ligados, não só linear", "Texto sem imagens", "Leitura em voz alta", "Texto sem autor", "Tradução automática", "Correção ortográfica"],
          a: 0,
          why: "Os links criam caminhos alternativos de leitura e de sentido.",
        },
      },
    ],
    "lingua-oralidade": [
      {
        name: "Conversação",
        def: "Na conversa, os turnos se alternam com marcas de tomada de palavra, pausa e retomada. O ouvinte participa.",
        keys: [
          "Tomada de turno é sinalizada por pausa e entonação.",
          "Marcador conversacional organiza a fala.",
          "Escuta ativa confirma o que o outro disse.",
        ],
        mistake: "Achar que conversa é só falar, sem escutar nem sinalizar.",
        q: {
          q: "O que a escuta ativa faz?",
          o: ["Confirma e retoma o que o outro disse antes de responder", "Só espera a vez de falar", "Interrompe para discordar", "Muda de assunto", "Fala mais alto", "Ignora o contexto"],
          a: 0,
          why: "Ela mostra compreensão e evita responder a algo que o outro não disse.",
        },
      },
      {
        name: "Apresentações",
        def: "Apresentação oral organiza abertura, desenvolvimento e fechamento, com apoio visual que não compete com a fala.",
        keys: [
          "Abertura anuncia o assunto e o objetivo.",
          "Slide demais desvia a atenção do que se fala.",
          "Ensaio reduz o vício de leitura do roteiro.",
        ],
        mistake: "Ler o slide em voz alta e chamar isso de apresentação.",
        q: {
          q: "Qual é o problema de ler o slide durante a apresentação?",
          o: ["A fala perde função e a atenção se dispersa", "O público aprende mais", "O tempo diminui", "A apresentação fica mais clara", "O slide melhora", "A voz fica melhor"],
          a: 0,
          why: "O slide é apoio visual; lido em voz alta, duplica a informação e desliga o público.",
        },
      },
      {
        name: "Debate",
        def: "Debate exige ouvir, responder e sustentar posição com evidência, respeitando regra de tempo e de réplica.",
        keys: [
          "Argumento precisa responder ao que foi dito.",
          "Interromper não é argumentar.",
          "Conceder um ponto fortalece a credibilidade.",
        ],
        mistake: "Repetir a tese mais alto em vez de responder ao contra-argumento.",
        q: {
          q: "O que fortalece a posição num debate?",
          o: ["Responder ao argumento do outro com evidência", "Falar mais alto", "Interromper sempre", "Mudar de assunto", "Ignorar a pergunta", "Repetir a tese"],
          a: 0,
          why: "O debate se ganha na resposta ao ponto apresentado, não no volume.",
        },
      },
    ],
    "lingua-historia": [
      {
        name: "Formação do português",
        def: "O português nasceu do latim falado na Península Ibérica, com influência de línguas germânicas e árabes.",
        keys: [
          "Latim vulgar é a base das línguas românicas.",
          "O galego-português medieval deu origem ao português e ao galego.",
          "Vocabulário árabe entrou em muitas áreas, como agricultura e matemática.",
        ],
        mistake: "Achar que o português veio direto do latim clássico escrito, sem camadas populares.",
        q: {
          q: "Que língua está na base do português?",
          o: ["O latim vulgar", "O grego clássico", "O árabe", "O galego moderno", "O espanhol", "O francês"],
          a: 0,
          why: "A língua falada pelos romanos na Península evoluiu até o galego-português e depois ao português.",
        },
      },
      {
        name: "Mudanças linguísticas",
        def: "Línguas mudam em som, forma e sentido. A mudança é contínua e não é decadência.",
        keys: [
          "Mudança fonética pode ser regular em séries de palavras.",
          "Mudança semântica altera o sentido de uma palavra.",
          "Empréstimo lexical entra por contato cultural.",
        ],
        mistake: "Ver mudança como empobrecimento da língua.",
        q: {
          q: "O que é empréstimo linguístico?",
          o: ["Palavra incorporada de outra língua por contato", "Erro de concordância", "Mudança de acento", "Palavra inventada sem uso", "Cópia de texto", "Tradução literal"],
          a: 0,
          why: "O contato entre línguas traz vocabulário novo, que se adapta à fonologia local.",
        },
      },
      {
        name: "Políticas linguísticas",
        def: "Política linguística decide o status das línguas na escola, na mídia e no Estado, e afeta quem fala o quê.",
        keys: [
          "Norma padrão é escolha histórica, não superioridade natural.",
          "Línguas minoritárias podem ser protegidas por lei.",
          "Acordo ortográfico é decisão política e não muda a fala.",
        ],
        mistake: "Achar que a norma padrão é a única forma correta de falar.",
        q: {
          q: "O que um acordo ortográfico muda?",
          o: ["A grafia oficial, não a pronúncia", "A pronúncia das palavras", "A gramática toda", "O vocabulário", "O sotaque regional", "A sintaxe"],
          a: 0,
          why: "O acordo unifica a escrita entre países; a fala segue caminho próprio.",
        },
      },
    ],
    "lingua-lexico": [
      {
        name: "Lexicologia",
        def: "Lexicologia estuda o vocabulário: formação, sentido, famílias de palavras e relações como sinonímia.",
        keys: [
          "Sinônimos próximos raramente são intercambiáveis em todo contexto.",
          "Polissemia é uma palavra com vários sentidos relacionados.",
          "Homonímia é coincidência de forma com sentidos distintos.",
        ],
        mistake: "Tratar sinônimos como se fossem idênticos em qualquer situação.",
        q: {
          q: "O que é polissemia?",
          o: ["Uma palavra com vários sentidos relacionados", "Duas palavras iguais com origens diferentes", "Uma palavra antiga", "Uma gíria", "Um erro de ortografia", "Um tipo de acento"],
          a: 0,
          why: "Na polissemia, os sentidos se ligam historicamente, como em folha de papel e folha de árvore.",
        },
      },
      {
        name: "Terminologia",
        def: "Terminologia organiza os termos técnicos de uma área, buscando precisão e consistência.",
        keys: [
          "Termo técnico é definido dentro de um domínio.",
          "Consistência terminológica evita mal-entendido.",
          "Glossário fixa o sentido para o leitor.",
        ],
        mistake: "Trocar o termo técnico por sinônimo aproximado e perder a precisão.",
        q: {
          q: "Por que a consistência terminológica importa?",
          o: ["Porque o termo técnico tem sentido fixo no domínio", "Porque deixa o texto mais bonito", "Porque aumenta o texto", "Porque dispensa definição", "Porque muda o autor", "Porque evita tradução"],
          a: 0,
          why: "Usar nomes diferentes para o mesmo conceito confunde quem lê.",
        },
      },
      {
        name: "Dicionários e glossários",
        def: "Dicionário registra o vocabulário geral; glossário explica termos de um texto; tesauro organiza por sentido.",
        keys: [
          "Dicionário pode ser descritivo ou prescritivo.",
          "Glossário é limitado ao texto ou domínio.",
          "Tesauro agrupa por campo semântico.",
        ],
        mistake: "Consultar dicionário e achar que o primeiro sentido é o único possível.",
        q: {
          q: "Qual é a função de um glossário?",
          o: ["Explicar termos usados num texto ou domínio", "Listar todas as palavras da língua", "Corrigir a ortografia", "Traduzir para outra língua", "Contar palavras", "Definir a gramática"],
          a: 0,
          why: "O glossário é local: explica o vocabulário específico daquela obra ou área.",
        },
      },
    ],
    "lingua-semitica": [
      {
        name: "Teoria dos signos",
        def: "Semiótica estuda signos e seus sentidos: ícone, índice e símbolo funcionam de modos diferentes.",
        keys: [
          "Ícone se parece com o que representa.",
          "Índice indica por relação causal ou física.",
          "Símbolo depende de convenção compartilhada.",
        ],
        mistake: "Chamar de símbolo tudo que significa, sem distinguir ícone e índice.",
        q: {
          q: "O que caracteriza o símbolo na semiótica?",
          o: ["A relação convencional com o que representa", "A semelhança física", "A relação de causa e efeito", "A cor usada", "O tamanho", "O som"],
          a: 0,
          why: "O símbolo vale por acordo social, como a palavra e a placa de trânsito.",
        },
      },
      {
        name: "Linguagem visual",
        def: "Imagem também argumenta: cor, enquadramento, luz e composição orientam a leitura.",
        keys: [
          "Enquadramento decide o que fica visível.",
          "Cor tem valor cultural e não é universal.",
          "Contraste guia o olho para o ponto principal.",
        ],
        mistake: "Achar que imagem é neutra e não faz escolha.",
        q: {
          q: "O que o enquadramento faz numa imagem?",
          o: ["Decide o que aparece e o que fica fora", "Define a resolução", "Escolhe a fonte", "Mede a intensidade", "Traduz o texto", "Corrige a cor"],
          a: 0,
          why: "Recortar é escolher: o fora de quadro também produz sentido.",
        },
      },
      {
        name: "Multimodalidade",
        def: "Texto multimodal combina palavra, imagem, som e movimento; o sentido nasce da relação entre eles.",
        keys: [
          "Legenda e imagem podem se reforçar ou se contradizer.",
          "Som altera o clima da cena.",
          "Ritmo de edição participa do sentido.",
        ],
        mistake: "Ler só o texto e ignorar o que a imagem e o som dizem.",
        q: {
          q: "O que acontece quando legenda e imagem se contradizem?",
          o: ["O sentido nasce do conflito entre as linguagens", "A imagem perde o sentido", "O texto vence sempre", "Nada muda", "A legenda é apagada", "O leitor ignora os dois"],
          a: 0,
          why: "Na multimodalidade, o sentido é a relação entre os modos, inclusive quando discordam.",
        },
      },
    ],
    "lingua-traducao": [
      {
        name: "Tradução",
        def: "Traduzir é recriar sentido entre línguas, equilibrando fidelidade ao texto e naturalidade no destino.",
        keys: [
          "Tradução literal pode soar estranha no idioma de chegada.",
          "Contexto e gênero orientam escolhas.",
          "Termo técnico costuma ter equivalente fixo na área.",
        ],
        mistake: "Traduzir palavra por palavra e perder a expressão idiomática.",
        q: {
          q: "Por que a tradução palavra por palavra costuma falhar?",
          o: ["Porque expressões e sentidos não funcionam igual nas duas línguas", "Porque muda o autor", "Porque diminui o texto", "Porque aumenta a pontuação", "Porque altera a ortografia", "Porque exige dicionário"],
          a: 0,
          why: "Cada língua organiza sentido de modo próprio; a tradução precisa recriar a função do texto.",
        },
      },
      {
        name: "Revisão e editoração",
        def: "Revisão ajusta língua e sentido; editoração organiza o texto para publicação, com padrão e checagem.",
        keys: [
          "Revisão em duas passadas pega mais erro.",
          "Padrão editorial garante consistência.",
          "Correção de prova é a última barreira antes de imprimir.",
        ],
        mistake: "Achar que revisão e editoração são a mesma etapa.",
        q: {
          q: "Qual é a diferença entre revisão e editoração?",
          o: ["Revisão ajusta língua e sentido; editoração prepara a publicação", "As duas corrigem só ortografia", "Editoração escreve o texto", "Revisão escolhe a capa", "São sinônimos", "Editoração traduz"],
          a: 0,
          why: "A revisão cuida do texto; a editoração cuida do texto no projeto gráfico e no padrão editorial.",
        },
      },
      {
        name: "Português para estrangeiros",
        def: "Ensinar português a quem fala outra língua exige atenção a estruturas que não existem na língua materna do aluno.",
        keys: [
          "Gênero gramatical costuma ser difícil para quem vem de língua sem gênero.",
          "Verbo e preposição pedem prática de uso.",
          "Contexto autêntico acelera a aprendizagem.",
        ],
        mistake: "Ensinar português para estrangeiro com a mesma gramática da escola brasileira.",
        q: {
          q: "Por que o gênero gramatical é difícil para alguns aprendizes?",
          o: ["Porque pode não existir na língua materna deles", "Porque não tem regra", "Porque muda de cor", "Porque só existe no plural", "Porque é sempre irregular", "Porque depende do verbo"],
          a: 0,
          why: "Sem equivalente na língua de origem, a marcação de gênero precisa ser aprendida no uso.",
        },
      },
    ],
  },
};

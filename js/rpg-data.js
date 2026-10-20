// O conteúdo das caçadas: monstros por continente, perguntas por dificuldade,
// itens e as seis perícias. Cada pergunta tem uma explicação curta porque o
// objetivo é ensinar, não só vencer.

export const SKILLS = {
  cs: { name: "Lógica", desc: "fios, portas, algoritmos e máquinas", color: "#61f4c0" },
  math: { name: "Abstração", desc: "formas, provas, limites e acaso", color: "#b48cff" },
  physics: { name: "Mecânica", desc: "forças, ondas, calor, luz e órbitas", color: "#ff7aa8" },
  chem: { name: "Reação", desc: "átomos, ligações, equilíbrio e energia", color: "#7ee787" },
  music: { name: "Harmonia", desc: "razões, ritmo, timbre e forma", color: "#ffb26b" },
  ai: { name: "Inferência", desc: "dados, redes, linguagem e limites", color: "#6bd5ff" },
};

export const TIERS = {
  // hp é quantas perguntas certas o bicho aguenta; dano é o que ele tira
  // quando você erra. Fácil pede 3, médio 7, difícil 12, chefe 18.
  1: { name: "fácil", stars: "★", hp: 3, xp: 10, damage: 2 },
  2: { name: "médio", stars: "★★", hp: 7, xp: 18, damage: 3 },
  3: { name: "difícil", stars: "★★★", hp: 12, xp: 30, damage: 4 },
  4: { name: "chefe", stars: "☠", hp: 18, xp: 60, damage: 6 },
};

export const ITEMS = {
  parafuso: { name: "Parafuso de Bronze", continent: "cs", desc: "Rosca de latão que nunca espanou. Dizem que veio do primeiro somador." },
  chip: { name: "Chip de Silício", continent: "cs", desc: "Um pedaço de areia que aprendeu a pensar em binário." },
  fita: { name: "Fita Perfurada", continent: "cs", desc: "Um trecho de fita com furos que já foram um programa." },
  nucleo: { name: "Núcleo de Turing", continent: "cs", relic: true, desc: "Um anel de metal com uma fita gravada. Relíquia: +5 de vida máxima." },
  regua: { name: "Régua Áurea", continent: "math", desc: "Uma régua sem marcações, só com uma razão que insiste em aparecer." },
  teorema: { name: "Teorema Engarrafado", continent: "math", desc: "Uma garrafa com uma prova dentro. A rolha é o lema." },
  axioma: { name: "Axioma de Bolso", continent: "math", desc: "Uma frase curta que você aceita sem provar. Use com cuidado." },
  infinito: { name: "Selo do Infinito", continent: "math", relic: true, desc: "Um símbolo que cabe no bolso e não cabe na cabeça. Relíquia: +5 de vida máxima." },
  ima: { name: "Ímã de Campo", continent: "physics", desc: "Atrai ferrugem, bússolas e perguntas sobre linhas invisíveis." },
  prisma: { name: "Prisma de Newton", continent: "physics", desc: "Um vidro triangular que separa a luz em sete desculpas." },
  quanta: { name: "Quanta de Bolso", continent: "physics", desc: "Um pacote de energia que só aparece quando você olha." },
  orbita: { name: "Pedra Orbital", continent: "physics", relic: true, desc: "Uma pedra que caiu de um lugar onde cair é girar. Relíquia: +5 de vida máxima." },
  frasco: { name: "Frasco de Reagente", continent: "chem", desc: "Vidro âmbar com um líquido que muda de ideia conforme o pH." },
  catalisador: { name: "Catalisador Raro", continent: "chem", desc: "Acelera a reação sem gastar a si mesmo. O sonho de todo professor." },
  cristal: { name: "Cristal de Equilíbrio", continent: "chem", desc: "Um cristal que se desloca quando você mexe na concentração." },
  pedra: { name: "Pedra Filosofal", continent: "chem", relic: true, desc: "Não transforma chumbo em ouro, mas transforma curioso em químico. Relíquia: +5 de vida máxima." },
  carbono: { name: "Carbono de Quatro Mãos", continent: "chem", desc: "Um átomo que segura quatro coisas ao mesmo tempo e nunca deixa cair." },
  cadeia: { name: "Cadeia Curta", continent: "chem", desc: "Quatro carbonos em fila. O começo de quase tudo que é vivo." },
  solvente: { name: "Solvente Teimoso", continent: "chem", desc: "Dissolve o que ninguém queria dissolver, inclusive a paciência." },
  "pedra-kekule": { name: "Pedra de Kekulé", continent: "chem", relic: true, desc: "Uma pedra em forma de anel que parece ter duas versões ao mesmo tempo. Relíquia: +5 de vida máxima." },
  amostra: { name: "Amostra Representativa", continent: "chem", desc: "Pequena, mas honesta: representa o todo sem puxar para um lado." },
  titulante: { name: "Titulante Azul", continent: "chem", desc: "Cai gota a gota até a cor virar. O ponto final é uma decisão." },
  espectro: { name: "Espectro de Bolso", continent: "chem", desc: "Uma faixa de cores que denuncia o que está na amostra." },
  "pedra-liebig": { name: "Pedra de Liebig", continent: "chem", relic: true, desc: "Uma pedra de laboratório com marcas de mil medições. Relíquia: +5 de vida máxima." },
  diapasao: { name: "Diapasão de Bolso", continent: "music", desc: "Um Lá de 440 Hz que cabe na mão e no ouvido." },
  partitura: { name: "Partitura Viva", continent: "music", desc: "Papel que se mexe quando ninguém está lendo." },
  metronomo: { name: "Metrônomo Quebrado", continent: "music", desc: "Marca o tempo certo com uma pequena hesitação humana." },
  cravo: { name: "Cravo Bem Temperado", continent: "music", relic: true, desc: "Um teclado em miniatura com doze teclas e infinitas discussões. Relíquia: +5 de vida máxima." },
  harmonico: { name: "Harmônico Solto", continent: "music", desc: "Um múltiplo da fundamental que se soltou e vive procurando o nó." },
  tubo: { name: "Tubo de Órgão", continent: "music", desc: "Um cano que ressoa numa nota só. Sopre e ele responde." },
  membrana: { name: "Membrana de Tambor", continent: "music", desc: "Pele esticada que guarda o golpe e devolve em onda." },
  "pedra-helmholtz": { name: "Pedra de Helmholtz", continent: "music", relic: true, desc: "Uma esfera oca que ressoa quando o som certo chega. Relíquia: +5 de vida máxima." },
  motivo: { name: "Motivo Curto", continent: "music", desc: "Três notas que se recusam a sair da cabeça. O começo de uma forma." },
  tema: { name: "Tema Inteiro", continent: "music", desc: "Um motivo que cresceu e ganhou personalidade própria." },
  coda: { name: "Coda Final", continent: "music", desc: "O que vem depois do fim para confirmar que acabou." },
  "pedra-hildegard": { name: "Pedra de Hildegard", continent: "music", relic: true, desc: "Uma pedra com uma melodia gravada em espiral. Relíquia: +5 de vida máxima." },
  peso: { name: "Peso Sináptico", continent: "ai", desc: "Um número pequeno que muda de valor toda vez que você aprende." },
  embedding: { name: "Vetor de Significado", continent: "ai", desc: "Uma seta que aponta para o lugar onde as palavras se parecem." },
  matriz: { name: "Matriz Esparsa", continent: "ai", desc: "Uma tabela cheia de zeros que aprendeu a guardar só o que importa." },
  caixa: { name: "Fragmento da Caixa Preta", continent: "ai", relic: true, desc: "Uma placa opaca com uma luz que pisca quando ninguém entende. Relíquia: +5 de vida máxima." },
  pixel: { name: "Pixel Teimoso", continent: "ai", desc: "O menor pedaço de imagem, com a cor que insiste em ficar." },
  borda: { name: "Borda Afiada", continent: "ai", desc: "Onde uma cor acaba e outra começa. É por aí que a máquina começa a enxergar." },
  kernel: { name: "Kernel de Bolso", continent: "ai", desc: "Uma matriz pequena que desliza pela imagem procurando padrão." },
  "pedra-marr": { name: "Pedra de Marr", continent: "ai", relic: true, desc: "Uma pedra com camadas de bordas gravadas. Relíquia: +5 de vida máxima." },
  prompt: { name: "Prompt Curto", continent: "ai", desc: "Uma instrução que cabe numa linha e muda tudo o que vem depois." },
  contexto: { name: "Contexto Longo", continent: "ai", desc: "Uma janela que guarda o começo da conversa até o fim." },
  vocabulario: { name: "Vocabulário Vivo", continent: "ai", desc: "Lista de pedaços de palavra que cresce a cada texto lido." },
  "pedra-chomsky": { name: "Pedra de Chomsky", continent: "ai", relic: true, desc: "Uma pedra com uma gramática gravada em camadas. Relíquia: +5 de vida máxima." },
  pergaminho: { name: "Pergaminho Velho", continent: "lingua", desc: "Folha que guardou uma frase por tempo demais. A tinta ainda pega no dedo." },
  tinta: { name: "Tinta Ferrogálica", continent: "lingua", desc: "Escurece com o tempo. Escreve, mancha e não sai fácil." },
  letra: { name: "Letra Solta", continent: "lingua", desc: "Uma letra que se desprendeu da palavra e ainda procura o lugar dela." },
  camoes: { name: "Pedra de Camões", continent: "lingua", relic: true, desc: "Uma pedra com uma estrofe gasta pelo mar. Relíquia: +5 de vida máxima." },
  verso: { name: "Verso Solto", continent: "lingua", desc: "Uma linha que perdeu a estrofe e ainda procura a rima." },
  estrofe: { name: "Estrofe Inteira", continent: "lingua", desc: "Quatro versos que decidiram ficar juntos." },
  pagina: { name: "Página em Branco", continent: "lingua", desc: "O lugar onde a história ainda pode ser qualquer uma." },
  "pedra-machado": { name: "Pedra de Machado", continent: "lingua", relic: true, desc: "Uma pedra com um narrador gravado que jura estar contando a verdade. Relíquia: +5 de vida máxima." },
  sentido: { name: "Sentido Duplo", continent: "lingua", desc: "Uma palavra que aponta para dois lados ao mesmo tempo." },
  ironia: { name: "Ironia Fina", continent: "lingua", desc: "Diz o contrário do que quer dizer e espera que você perceba." },
  implicatura: { name: "Implicatura", continent: "lingua", desc: "O que foi sugerido sem ser dito. Mora no intervalo entre as linhas." },
  "pedra-saussure": { name: "Pedra de Saussure", continent: "lingua", relic: true, desc: "Uma pedra com significante de um lado e significado do outro. Relíquia: +5 de vida máxima." },
  cobre: { name: "Cobre Enrolado", continent: "physics", desc: "Fio brilhante que conduz corrente e paciência." },
  bobina: { name: "Bobina de Cobre", continent: "physics", desc: "Espiral de fio que transforma movimento em corrente." },
  fusivel: { name: "Fusível Queimado", continent: "physics", desc: "Morreu para salvar o resto. Merece um lugar na mochila." },
  capacitor: { name: "Capacitor de Vidro", continent: "physics", desc: "Guarda carga por um instante e devolve de uma vez." },
  "pedra-faraday": { name: "Pedra de Faraday", continent: "physics", relic: true, desc: "Uma gaiola de metal em miniatura que afasta o barulho elétrico. Relíquia: +5 de vida máxima." },
  calor: { name: "Calor de Bolso", continent: "physics", desc: "Energia em trânsito, nunca parada. Esquenta a mão e a pergunta." },
  ciclo: { name: "Ciclo Fechado", continent: "physics", desc: "Um caminho que volta ao começo, mas nunca de graça." },
  entropia: { name: "Entropia Solta", continent: "physics", desc: "Uma medida de bagunça que só aumenta quando ninguém arruma." },
  "pedra-carnot": { name: "Pedra de Carnot", continent: "physics", relic: true, desc: "Uma pedra que promete o melhor rendimento possível e não entrega mais que isso. Relíquia: +5 de vida máxima." },
  lente: { name: "Lente de Bolso", continent: "physics", desc: "Vidro curvo que decide para onde a luz vai. A imagem agradece." },
  reflexo: { name: "Reflexo Teimoso", continent: "physics", desc: "Uma luz que bateu no espelho e voltou com a mesma ideia." },
  "arco-iris": { name: "Arco-Íris Engarrafado", continent: "physics", desc: "Sete cores que estavam juntas e agora se apresentam em ordem." },
  "pedra-huygens": { name: "Pedra de Huygens", continent: "physics", relic: true, desc: "Uma pedra que trata cada ponto da frente de onda como uma nova fonte. Relíquia: +5 de vida máxima." },
  instrucao: { name: "Instrução Perdida", continent: "cs", desc: "Um pedaço de programa que se soltou no meio do ciclo." },
  registrador: { name: "Registrador Dourado", continent: "cs", desc: "Guarda um número inteiro e não deixa ninguém ler sem permissão." },
  barramento: { name: "Barramento Largo", continent: "cs", desc: "Fios paralelos por onde os dados viajam em fila." },
  "pedra-von-neumann": { name: "Pedra de Von Neumann", continent: "cs", relic: true, desc: "Um pequeno programa gravado em pedra. Relíquia: +5 de vida máxima." },
  pacote: { name: "Pacote Perdido", continent: "cs", desc: "Um envelope de dados com endereço de origem e destino. Chegou atrasado, mas chegou." },
  datagrama: { name: "Datagrama Solto", continent: "cs", desc: "Vai sem prometer ordem nem entrega. Às vezes é exatamente o que se precisa." },
  handshake: { name: "Aperto de Mão", continent: "cs", desc: "Três mensagens para começar uma conversa. Nenhuma delas é pessoal." },
  "pedra-baran": { name: "Pedra de Barán", continent: "cs", relic: true, desc: "Uma pedra dividida em pedaços que sempre acham o caminho. Relíquia: +5 de vida máxima." },
  limite: { name: "Limite de Bolso", continent: "math", desc: "Um valor que nunca chega, mas chega perto o bastante." },
  serie: { name: "Série Infinita", continent: "math", desc: "Uma soma que continua mesmo depois de você desistir." },
  epsilon: { name: "Épsilon de Vidro", continent: "math", desc: "Pequeno o suficiente para caber em qualquer tolerância." },
  "pedra-cauchy": { name: "Pedra de Cauchy", continent: "math", relic: true, desc: "Uma pedra que se aproxima da resposta sem nunca encostar. Relíquia: +5 de vida máxima." },
  dado: { name: "Dado Viciado", continent: "math", desc: "Cai seis com frequência suspeita. A probabilidade não acredita em sorte." },
  amostra: { name: "Amostra Aleatória", continent: "math", desc: "Pequena, mas sorteada sem preferência. Fala do todo com margem." },
  outlier: { name: "Outlier Teimoso", continent: "math", desc: "Um ponto que se afasta da média e puxa a conversa para o lado dele." },
  "pedra-laplace": { name: "Pedra de Laplace", continent: "math", relic: true, desc: "Uma pedra que calcula o futuro se souber tudo do presente. Relíquia: +5 de vida máxima." },
  // equipamento temático: cada continente deixa uma arma e uma peça de roupa
  "chave-longa": { name: "Chave de Fenda Longa", continent: "cs", slot: "weapon", weapon: "club", damage: 1, desc: "Um clube de oficina. Aperta parafuso e ideia teimosa." },
  "colete-malha": { name: "Colete de Malha", continent: "cs", slot: "armor", hp: 5, desc: "Anéis de cobre trançados. Pesa, mas segura o tranco." },
  "espada-prova": { name: "Espada da Prova", continent: "math", slot: "weapon", weapon: "sword", damage: 1, desc: "Corta o problema em casos menores. A lâmina é uma reta." },
  "manto-giz": { name: "Manto de Giz", continent: "math", slot: "armor", hp: 4, desc: "Deixa um rastro branco no chão. Bom para lembrar o caminho." },
  "cajado-luz": { name: "Cajado de Luz", continent: "physics", slot: "weapon", weapon: "wand", damage: 2, desc: "Um tubo de vidro com um fóton teimoso dentro." },
  "lentes-prisma": { name: "Lentes Prismáticas", continent: "physics", slot: "helmet", hp: 3, desc: "Separa o mundo em cores. Também protege os olhos do clarão." },
  "frasco-acido": { name: "Frasco de Ácido", continent: "chem", slot: "weapon", weapon: "wand", damage: 1, desc: "Não é poção. Serve para abrir caminho, não para beber." },
  "avental-alquimista": { name: "Avental de Alquimista", continent: "chem", slot: "armor", hp: 5, desc: "Manchado de todas as reações que deram quase certo." },
  "batuta-maestro": { name: "Batuta do Maestro", continent: "music", slot: "weapon", weapon: "rod", damage: 1, desc: "Marca o tempo e o ponto. O silêncio também é parte da frase." },
  "casaca-harmonia": { name: "Casaca de Harmonia", continent: "music", slot: "armor", hp: 4, desc: "Forro de veludo e bolsos para partituras roubadas." },
  "cajado-vetores": { name: "Cajado de Vetores", continent: "ai", slot: "weapon", weapon: "rod", damage: 2, desc: "Aponta para a direção do gradiente. Não pergunte para onde." },
  "capuz-dados": { name: "Capuz de Dados", continent: "ai", slot: "helmet", hp: 3, desc: "Um capuz cheio de pesos pequenos. Aquece a cabeça e a inferência." },
  "pena-poeta": { name: "Pena do Poeta", continent: "lingua", slot: "weapon", weapon: "rod", damage: 1, desc: "Uma pena que já escreveu versos e recados. A ponta ainda corta." },
  "sobretudo-pergaminho": { name: "Sobretudo de Pergaminho", continent: "lingua", slot: "armor", hp: 4, desc: "Páginas costuradas com linha de algodão. Segura o frio e o corretivo." },
  "oculos-revisor": { name: "Óculos do Revisor", continent: "lingua", slot: "helmet", hp: 3, desc: "Lentes que enxergam vírgula fora de lugar a três metros." },
  "anel-virgula": { name: "Anel de Vírgula", continent: "lingua", slot: "ring", damage: 1, desc: "Uma vírgula de prata que dá uma pausa no meio do golpe." },
  "colar-rima": { name: "Colar de Rima", continent: "lingua", slot: "necklace", damage: 1, desc: "Duas contas que terminam no mesmo som. Uma puxa a outra." },
  "caneta-narrativa": { name: "Caneta Narrativa", continent: "lingua", slot: "weapon", weapon: "rod", damage: 2, desc: "Escreve o golpe antes de ele acontecer. A tinta decide o ponto de vista." },
  "casaco-personagem": { name: "Casaco de Personagem", continent: "lingua", slot: "armor", hp: 5, desc: "Tem bolsos para segredos e um forro que muda de acordo com quem veste." },
  "oculos-narrador": { name: "Óculos do Narrador", continent: "lingua", slot: "helmet", hp: 3, desc: "Enxergam a cena por dentro da cabeça de quem está contando." },
  "anel-sentido": { name: "Anel de Sentido", continent: "lingua", slot: "ring", damage: 1, desc: "Encontra o segundo sentido do golpe antes de ele terminar." },
  "manto-pragmatica": { name: "Manto de Pragmática", continent: "lingua", slot: "armor", hp: 4, desc: "Muda de significado conforme a situação. O impacto não sabe o que vestir." },
  "oculos-ironia": { name: "Óculos de Ironia", continent: "lingua", slot: "helmet", hp: 3, desc: "Veem o contrário do que está escrito. O ataque perde a piada." },
  "anel-bobina": { name: "Anel de Bobina", continent: "physics", slot: "ring", damage: 1, desc: "Uma espira de cobre no dedo. Gira o golpe junto com o campo." },
  "escudo-capacitor": { name: "Escudo de Capacitor", continent: "physics", slot: "shield", hp: 4, desc: "Segura a carga do golpe e devolve depois, devagar." },
  "anel-carnot": { name: "Anel de Carnot", continent: "physics", slot: "ring", damage: 1, desc: "Aproveita a diferença de temperatura do golpe e não desperdiça." },
  "manto-termico": { name: "Manto Térmico", continent: "physics", slot: "armor", hp: 4, desc: "Isola o corpo para o calor não sair. O frio também não entra." },
  "capuz-entropia": { name: "Capuz de Entropia", continent: "physics", slot: "helmet", hp: 3, desc: "Desorganiza a mira do inimigo. A bagunça trabalha a seu favor." },
  "oculos-optica": { name: "Óculos de Óptica", continent: "physics", slot: "helmet", hp: 3, desc: "Corrigem o foco do que está longe. O detalhe chega antes do golpe." },
  "manto-luz": { name: "Manto de Luz", continent: "physics", slot: "armor", hp: 4, desc: "Tecido que reflete o bastante para o impacto perder a direção." },
  "anel-foco": { name: "Anel de Foco", continent: "physics", slot: "ring", damage: 1, desc: "Concentra o golpe num ponto só, como uma lente bem ajustada." },
  "manto-dieletrico": { name: "Manto Dielétrico", continent: "physics", slot: "armor", hp: 4, desc: "Tecido que não conduz. Bom para quem trabalha perto de corrente." },
  "anel-pipeline": { name: "Anel de Pipeline", continent: "cs", slot: "ring", damage: 1, desc: "Uma volta de fio que adianta a próxima etapa antes de a atual acabar." },
  "capuz-registrador": { name: "Capuz de Registrador", continent: "cs", slot: "helmet", hp: 3, desc: "Guarda a última ideia bem quentinha, pronta para o próximo ciclo." },
  "escudo-barramento": { name: "Escudo de Barramento", continent: "cs", slot: "shield", hp: 4, desc: "Largo e cheio de vias. Segura o impacto e distribui o resto." },
  "anel-roteador": { name: "Anel Roteador", continent: "cs", slot: "ring", damage: 1, desc: "Encontra o próximo salto do golpe antes de ele sair." },
  "manto-malha": { name: "Manto de Malha", continent: "cs", slot: "armor", hp: 4, desc: "Uma malha de nós que redireciona o impacto por vários caminhos." },
  "capuz-latencia": { name: "Capuz de Latência", continent: "cs", slot: "helmet", hp: 3, desc: "Guarda a resposta até o momento certo. O susto chega atrasado." },
  "anel-serie": { name: "Anel de Série", continent: "math", slot: "ring", damage: 1, desc: "Uma soma infinita enrolada no dedo. Converge para um golpe." },
  "manto-limite": { name: "Manto de Limite", continent: "math", slot: "armor", hp: 4, desc: "Chega tão perto do corpo que quase é o corpo." },
  "escudo-delta": { name: "Escudo de Delta", continent: "math", slot: "shield", hp: 4, desc: "A tolerância que segura o golpe e ainda deixa passar o essencial." },
  "anel-probavel": { name: "Anel Provável", continent: "math", slot: "ring", damage: 1, desc: "Aposta no golpe mais provável e acerta com frequência." },
  "manto-amostra": { name: "Manto de Amostra", continent: "math", slot: "armor", hp: 4, desc: "Cobre uma parte do corpo e representa o todo." },
  "oculos-estatistica": { name: "Óculos de Estatística", continent: "math", slot: "helmet", hp: 3, desc: "Veem a tendência no meio do ruído. Um ponto fora da curva não engana." },
  "anel-sinapse": { name: "Anel de Sinapse", continent: "hub", slot: "ring", damage: 1, desc: "Um anel que lembra o último caminho. Relíquia de chefe da Computação." },
  "colar-constante": { name: "Colar da Constante", continent: "hub", slot: "necklace", hp: 5, desc: "A conta que não muda quando o mundo muda. Relíquia de chefe de Música." },
  "pernas-reforcadas": { name: "Perneiras de Cálculo", continent: "math", slot: "legs", hp: 3, desc: "Joelheiras de couro com fórmulas gravadas. Ajudam a subir a escada." },
  "botas-marcha": { name: "Botas de Marcha", continent: "physics", slot: "boots", hp: 2, desc: "Solado de borracha e mola de aço. O caminho parece menor." },
  "escudo-cristal": { name: "Escudo de Cristal", continent: "chem", slot: "shield", hp: 4, desc: "Uma lâmina de cristal de equilíbrio. Segura o golpe e devolve a cor." },
  "oculos-organicos": { name: "Óculos Orgânicos", continent: "chem", slot: "helmet", hp: 3, desc: "Lentes que enxergam a cadeia inteira, não só o carbono da ponta." },
  "jaleco-organico": { name: "Jaleco Orgânico", continent: "chem", slot: "armor", hp: 5, desc: "Tecido de fibra longa, feito de cadeias que aprenderam a não rasgar." },
  "colar-quiral": { name: "Colar Quiral", continent: "chem", slot: "necklace", hp: 5, desc: "Duas metades que só encaixam de um jeito. O golpe erra a mão." },
  "anel-analitico": { name: "Anel Analítico", continent: "chem", slot: "ring", damage: 1, desc: "Mede a pureza do golpe antes de aplicar. Nada de reagente desperdiçado." },
  "avental-analitico": { name: "Avental Analítico", continent: "chem", slot: "armor", hp: 4, desc: "Bolsos para tubos, pinças e amostras que não podem se misturar." },
  "oculos-espectro": { name: "Óculos de Espectro", continent: "chem", slot: "helmet", hp: 3, desc: "Enxergam a cor exata do que está vindo. O veneno perde o disfarce." },
  "anel-harmonico": { name: "Anel Harmônico", continent: "music", slot: "ring", damage: 1, desc: "Quando o golpe encontra a frequência certa, o anel responde junto." },
  "manto-acustico": { name: "Manto Acústico", continent: "music", slot: "armor", hp: 4, desc: "Tecido que absorve o eco e deixa o corpo mais quieto." },
  "fones-eco": { name: "Fones do Eco", continent: "music", slot: "helmet", hp: 3, desc: "Auscultam o que vem antes de chegar. O susto perde a vantagem." },
  "anel-forma": { name: "Anel de Forma", continent: "music", slot: "ring", damage: 1, desc: "Fecha o golpe numa cadência que o inimigo não esperava." },
  "manto-contraponto": { name: "Manto de Contraponto", continent: "music", slot: "armor", hp: 4, desc: "Duas camadas de tecido que se movem em vozes independentes." },
  "oculos-forma": { name: "Óculos de Forma", continent: "music", slot: "helmet", hp: 3, desc: "Enxergam o motivo escondido no meio da bagunça." },
  "lente-convolucao": { name: "Lente de Convolução", continent: "ai", slot: "helmet", hp: 3, desc: "Passeia pelo mundo procurando bordas. O detalhe aparece antes do susto." },
  "manto-pixels": { name: "Manto de Pixels", continent: "ai", slot: "armor", hp: 4, desc: "Coberto de quadradinhos que trocam de cor e confundem a mira." },
  "anel-detector": { name: "Anel Detector", continent: "ai", slot: "ring", damage: 1, desc: "Uma caixinha em volta do alvo. O golpe já sabe onde acertar." },
  "anel-contexto": { name: "Anel de Contexto", continent: "ai", slot: "ring", damage: 1, desc: "Lembra do último golpe e ajusta o próximo. A conversa tem memória curta." },
  "manto-tokens": { name: "Manto de Tokens", continent: "ai", slot: "armor", hp: 4, desc: "Costurado com pedaços de palavras. Cada rasgo vira uma nova frase." },
  "capuz-prompt": { name: "Capuz de Prompt", continent: "ai", slot: "helmet", hp: 3, desc: "Uma instrução bordada na aba. Quem veste pede antes de apanhar." },
  "runa-faisca": { name: "Runa da Faísca", continent: "hub", use: "spark", desc: "Uma carga de magia: elimina uma alternativa errada na pergunta atual do duelo. Some ao usar." },
  "runa-trovao": { name: "Runa do Trovão", continent: "hub", use: "thunder", desc: "Dá 2 de dano no monstro da frente sem responder pergunta. Some ao usar." },
  "runa-fogo": { name: "Runa do Fogo", continent: "hub", use: "fire", desc: "Dá 1 de dano em todos os monstros da tela, inclusive a matilha. Some ao usar." },
  "runa-gelo": { name: "Runa do Gelo", continent: "hub", use: "ice", desc: "Congela o tempo: passa a pergunta atual sem responder e sem levar dano. Some ao usar." },
  "runa-cura": { name: "Runa da Cura", continent: "hub", use: "heal", desc: "Recupera 12 de vida durante o duelo. Some ao usar." },
  "runa-espelho": { name: "Runa do Espelho", continent: "hub", use: "mirror", desc: "O próximo erro não tira vida sua. Some ao usar." },
  "colar-corrente": { name: "Colar de Corrente", continent: "cs", slot: "necklace", hp: 4, desc: "Uma corrente de elos pequenos que nunca emperra." },
  "anel-fractal": { name: "Anel Fractal", continent: "math", slot: "ring", damage: 1, desc: "A mesma forma em todas as escalas. Cabe no dedo e não acaba." },
  "colar-inercia": { name: "Colar de Inércia", continent: "physics", slot: "necklace", hp: 4, desc: "Um peso que insiste em continuar fazendo o que já fazia." },
  "anel-equilibrio": { name: "Anel de Equilíbrio", continent: "chem", slot: "ring", hp: 3, desc: "Um anel que se desloca quando você mexe na concentração." },
  "colar-ressonancia": { name: "Colar de Ressonância", continent: "music", slot: "necklace", damage: 1, desc: "Duas lâminas que vibram na mesma frequência." },
  "anel-atencao": { name: "Anel de Atenção", continent: "ai", slot: "ring", hp: 3, desc: "Cada pedra olha para uma parte diferente do problema." },
  pocao: { name: "Poção de Café", continent: "hub", heal: 18, desc: "Recupera 18 de vida. Gosto de fio elétrico, efeito de segunda-feira." },
  ferro: { name: "Ferro Bruto", continent: "hub", desc: "Um pedaço de veio escuro. A forja transforma em ferramenta." },
  erva: { name: "Erva de Caverna", continent: "hub", desc: "Cresce onde a luz não chega. Cheira a remédio e a terra molhada." },
  veio: { name: "Cristal de Veio", continent: "hub", desc: "Guarda um pouco de luz. Serve para tocha e para poção." },
  madeira: { name: "Madeira Petrificada", continent: "hub", desc: "Madeira que virou pedra. Ainda tem veio, ainda queima." },
  chave: { name: "Chave de Caverna", continent: "hub", desc: "Abre baús selados do subsolo. Some depois de usada." },
  tocha: { name: "Tocha de Veio", continent: "hub", use: "light", desc: "Acesa, aumenta a luz da caverna por dois minutos." },
  bomba: { name: "Bomba de Ferro", continent: "hub", use: "bomb", desc: "Estoura perto de você e espanta os bichos num raio curto. Não dá XP nem saque." },
  caldo: { name: "Caldo de Caverna", continent: "hub", heal: 35, desc: "Culinária de fundo de mina: cura 35. Erva, café e paciência." },
  cafe: { name: "Café da Madrugada", continent: "hub", heal: 5, buff: { id: "speed", ms: 90000 }, desc: "Cura 5 e acelera os passos por 90 segundos. Gosto de pedra molhada." },
  assado: { name: "Assado de Fundo de Mina", continent: "hub", heal: 45, buff: { id: "damage", ms: 180000 }, desc: "Cura 45 e dá +1 de dano por 3 minutos. Cozinha de expedição." },
  doce: { name: "Doce de Erva", continent: "hub", heal: 15, buff: { id: "maxhp", ms: 180000 }, desc: "Cura 15 e dá +5 de vida máxima por 3 minutos. Sobremesa de caverna." },
  picareta: { name: "Picareta de Veio", continent: "hub", desc: "Ferramenta de mineração. Com ela, os veios de cristal das cavernas se abrem." },
  semente: { name: "Semente de Erva", continent: "hub", desc: "Planta na horta da cidade subterrânea. Cresce em 45 segundos." },
  racao: { name: "Ração de Caverna", continent: "hub", desc: "A comida do bicho da cidade. Três rações e ele passa a seguir você." },
};

export const RECIPES = [
  { id: "pocao", name: "Poção de Café", out: "pocao", qty: 1, need: { erva: 2, veio: 1 } },
  { id: "tocha", name: "Tocha de Veio", out: "tocha", qty: 1, need: { madeira: 1, veio: 1 } },
  { id: "chave", name: "Chave de Caverna", out: "chave", qty: 1, need: { ferro: 2, madeira: 1 } },
  { id: "bomba", name: "Bomba de Ferro", out: "bomba", qty: 1, need: { ferro: 1, veio: 1 } },
  { id: "caldo", name: "Caldo de Caverna", out: "caldo", qty: 1, need: { erva: 2, pocao: 1 } },
  { id: "picareta", name: "Picareta de Veio", out: "picareta", qty: 1, need: { ferro: 3, madeira: 2 } },
  { id: "semente", name: "Sementes de Erva", out: "semente", qty: 2, need: { erva: 1 } },
  { id: "racao", name: "Ração de Caverna", out: "racao", qty: 2, need: { erva: 1, veio: 1 } },
  { id: "cafe", name: "Café da Madrugada", out: "cafe", qty: 1, need: { erva: 1, pocao: 1 } },
  { id: "assado", name: "Assado de Fundo de Mina", out: "assado", qty: 1, need: { caldo: 1, madeira: 1 } },
  { id: "doce", name: "Doce de Erva", out: "doce", qty: 1, need: { erva: 2, veio: 1 } },
  { id: "runa-faisca", name: "Runa da Faísca", out: "runa-faisca", qty: 1, need: { veio: 2, erva: 1 } },
  { id: "runa-trovao", name: "Runa do Trovão", out: "runa-trovao", qty: 1, need: { ferro: 1, veio: 2 } },
  { id: "runa-fogo", name: "Runa do Fogo", out: "runa-fogo", qty: 1, need: { veio: 2, ferro: 2 } },
  { id: "runa-gelo", name: "Runa do Gelo", out: "runa-gelo", qty: 1, need: { veio: 2, madeira: 1 } },
  { id: "runa-cura", name: "Runa da Cura", out: "runa-cura", qty: 1, need: { erva: 2, veio: 1 } },
  { id: "runa-espelho", name: "Runa do Espelho", out: "runa-espelho", qty: 1, need: { veio: 3, erva: 1 } },
];

export const ENCHANTS = [
  { id: "vigor", name: "Encanto de Vigor", desc: "+10 de vida máxima.", need: { veio: 4, erva: 4 } },
  { id: "furor", name: "Encanto de Furor", desc: "+1 de dano em cada resposta certa.", need: { veio: 5, ferro: 5 } },
  { id: "luz", name: "Encanto de Luz", desc: "A lanterna da caverna enxerga mais longe.", need: { veio: 3, madeira: 3 } },
];

const GROUNDS_RAW = [
  {
    id: "cs",
    continent: "cs",
    name: "Caçada dos Fios",
    center: { x: 92, y: 26 },
    banner: { x: 0, y: -3 },
    lever: { x: -3, y: 3 },
    loot: ["parafuso", "chip", "fita"],
    bossLoot: "nucleo",
    monsters: [
      { id: "cs-m1", name: "Bit", tier: 1, kind: "slime", dx: -3, dy: -2 },
      { id: "cs-m2", name: "Loop", tier: 2, kind: "eye", dx: 3, dy: -2 },
      { id: "cs-m3", name: "Kernel", tier: 3, kind: "golem", dx: 0, dy: 3 },
    ],
    boss: { id: "cs-boss", name: "O Compilador", kind: "boss", dx: 0, dy: 0 },
  },
  {
    id: "math",
    continent: "math",
    name: "Caçada das Formas",
    center: { x: 156, y: 63 },
    banner: { x: 0, y: -3 },
    lever: { x: -3, y: 3 },
    loot: ["regua", "teorema", "axioma"],
    bossLoot: "infinito",
    monsters: [
      { id: "math-m1", name: "Primo", tier: 1, kind: "slime", dx: -3, dy: -2 },
      { id: "math-m2", name: "Lema", tier: 2, kind: "eye", dx: 3, dy: -2 },
      { id: "math-m3", name: "Axioma", tier: 3, kind: "golem", dx: 0, dy: 3 },
    ],
    boss: { id: "math-boss", name: "O Infinito", kind: "boss", dx: 0, dy: 0 },
  },
  {
    id: "physics",
    continent: "physics",
    name: "Caçada dos Campos",
    center: { x: 90, y: 105 },
    banner: { x: 0, y: -3 },
    lever: { x: -3, y: 3 },
    loot: ["ima", "prisma", "quanta"],
    bossLoot: "orbita",
    monsters: [
      { id: "physics-m1", name: "Íon", tier: 1, kind: "slime", dx: -3, dy: -2 },
      { id: "physics-m2", name: "Vetor", tier: 2, kind: "eye", dx: 3, dy: -2 },
      { id: "physics-m3", name: "Quanta", tier: 3, kind: "golem", dx: 0, dy: 3 },
    ],
    boss: { id: "physics-boss", name: "O Observador", kind: "boss", dx: 0, dy: 0 },
  },
  {
    id: "chem",
    continent: "chem",
    name: "Caçada das Ligações",
    center: { x: 21, y: 63 },
    banner: { x: 0, y: -3 },
    lever: { x: -3, y: 3 },
    loot: ["frasco", "catalisador", "cristal"],
    bossLoot: "pedra",
    monsters: [
      { id: "chem-m1", name: "Átomo", tier: 1, kind: "slime", dx: -3, dy: -2 },
      { id: "chem-m2", name: "Mol", tier: 2, kind: "eye", dx: 3, dy: -2 },
      { id: "chem-m3", name: "Catalisador", tier: 3, kind: "golem", dx: 0, dy: 3 },
    ],
    boss: { id: "chem-boss", name: "O Reagente", kind: "boss", dx: 0, dy: 0 },
  },
  {
    id: "music",
    continent: "music",
    name: "Caçada dos Sons",
    center: { x: 44, y: 32 },
    banner: { x: 0, y: -3 },
    lever: { x: -3, y: 3 },
    loot: ["diapasao", "partitura", "metronomo"],
    bossLoot: "cravo",
    monsters: [
      { id: "music-m1", name: "Compasso", tier: 1, kind: "slime", dx: -3, dy: -2 },
      { id: "music-m2", name: "Acorde", tier: 2, kind: "eye", dx: 3, dy: -2 },
      { id: "music-m3", name: "Harmônico", tier: 3, kind: "golem", dx: 0, dy: 3 },
    ],
    boss: { id: "music-boss", name: "A Dissonância", kind: "boss", dx: 0, dy: 0 },
  },
  {
    id: "ai",
    continent: "ai",
    name: "Caçada das Máquinas",
    center: { x: 136, y: 32 },
    banner: { x: 0, y: -3 },
    lever: { x: -3, y: 3 },
    loot: ["peso", "embedding", "matriz"],
    bossLoot: "caixa",
    monsters: [
      { id: "ai-m1", name: "Token", tier: 1, kind: "slime", dx: -3, dy: -2 },
      { id: "ai-m2", name: "Perceptron", tier: 2, kind: "eye", dx: 3, dy: -2 },
      { id: "ai-m3", name: "Gradiente", tier: 3, kind: "golem", dx: 0, dy: 3 },
    ],
    boss: { id: "ai-boss", name: "A Caixa Preta", kind: "boss", dx: 0, dy: 0 },
  },
  {
    id: "lingua",
    continent: "lingua",
    name: "Caçada das Palavras",
    center: { x: 29, y: 98 },
    banner: { x: 0, y: -3 },
    lever: { x: -3, y: 3 },
    loot: ["pergaminho", "tinta", "letra"],
    bossLoot: "camoes",
    monsters: [
      { id: "lingua-m1", name: "Sílaba", tier: 1, kind: "slime", dx: -3, dy: -2 },
      { id: "lingua-m2", name: "Verbo", tier: 2, kind: "eye", dx: 3, dy: -2 },
      { id: "lingua-m3", name: "Sintaxe", tier: 3, kind: "golem", dx: 0, dy: 3 },
    ],
    boss: { id: "lingua-boss", name: "O Latim Ancestral", kind: "boss", dx: 0, dy: 0 },
  },
  {
    id: "physics-em",
    continent: "physics",
    dungeon: "dungeon-physics-em",
    name: "Caçada dos Circuitos",
    center: { x: 152, y: 99 },
    banner: { x: 0, y: -3 },
    lever: { x: -3, y: 3 },
    loot: ["bobina", "fusivel", "capacitor"],
    bossLoot: "pedra-faraday",
    monsters: [
      { id: "physics-em-m1", name: "Ímã", tier: 1, kind: "slime", dx: -3, dy: -2 },
      { id: "physics-em-m2", name: "Bobina", tier: 2, kind: "eye", dx: 3, dy: -2 },
      { id: "physics-em-m3", name: "Corrente", tier: 3, kind: "wisp", dx: 0, dy: 3 },
    ],
    boss: { id: "physics-em-boss", name: "O Eletromagneto", kind: "boss", dx: 0, dy: 0 },
  },
  {
    id: "cs-arch",
    continent: "cs",
    dungeon: "dungeon-cs-arch",
    name: "Caçada das Instruções",
    center: { x: 212, y: 14 },
    banner: { x: 0, y: -3 },
    lever: { x: -3, y: 3 },
    loot: ["instrucao", "registrador", "barramento"],
    bossLoot: "pedra-von-neumann",
    monsters: [
      { id: "cs-arch-m1", name: "Instrução", tier: 1, kind: "slime", dx: -3, dy: -2 },
      { id: "cs-arch-m2", name: "Registrador", tier: 2, kind: "eye", dx: 3, dy: -2 },
      { id: "cs-arch-m3", name: "Pipeline", tier: 3, kind: "golem", dx: 0, dy: 3 },
    ],
    boss: { id: "cs-arch-boss", name: "O Von Neumann", kind: "boss", dx: 0, dy: 0 },
  },
  {
    id: "math-analysis",
    continent: "math",
    dungeon: "dungeon-math-analysis",
    name: "Caçada dos Limites",
    center: { x: 230, y: 68 },
    banner: { x: 0, y: -3 },
    lever: { x: -3, y: 3 },
    loot: ["limite", "serie", "epsilon"],
    bossLoot: "pedra-cauchy",
    monsters: [
      { id: "math-analysis-m1", name: "Limite", tier: 1, kind: "slime", dx: -3, dy: -2 },
      { id: "math-analysis-m2", name: "Série", tier: 2, kind: "eye", dx: 3, dy: -2 },
      { id: "math-analysis-m3", name: "Derivada", tier: 3, kind: "golem", dx: 0, dy: 3 },
    ],
    boss: { id: "math-analysis-boss", name: "O Limite", kind: "boss", dx: 0, dy: 0 },
  },
  {
    id: "chem-organic",
    continent: "chem",
    dungeon: "dungeon-chem-organic",
    name: "Caçada do Carbono",
    center: { x: 34, y: 145 },
    banner: { x: 0, y: -3 },
    lever: { x: -3, y: 3 },
    loot: ["carbono", "cadeia", "solvente"],
    bossLoot: "pedra-kekule",
    monsters: [
      { id: "chem-organic-m1", name: "Carbono", tier: 1, kind: "slime", dx: -3, dy: -2 },
      { id: "chem-organic-m2", name: "Cadeia", tier: 2, kind: "eye", dx: 3, dy: -2 },
      { id: "chem-organic-m3", name: "Polímero", tier: 3, kind: "golem", dx: 0, dy: 3 },
    ],
    boss: { id: "chem-organic-boss", name: "O Carbono Quiral", kind: "boss", dx: 0, dy: 0 },
  },
  {
    id: "music-acoustics",
    continent: "music",
    dungeon: "dungeon-music-acoustics",
    name: "Caçada dos Ecos",
    center: { x: 55, y: 74 },
    banner: { x: 0, y: -3 },
    lever: { x: -3, y: 3 },
    loot: ["harmonico", "tubo", "membrana"],
    bossLoot: "pedra-helmholtz",
    monsters: [
      { id: "music-acoustics-m1", name: "Ressonância", tier: 1, kind: "slime", dx: -3, dy: -2 },
      { id: "music-acoustics-m2", name: "Harmônico", tier: 2, kind: "eye", dx: 3, dy: -2 },
      { id: "music-acoustics-m3", name: "Eco", tier: 3, kind: "wisp", dx: 0, dy: 3 },
    ],
    boss: { id: "music-acoustics-boss", name: "O Eco Profundo", kind: "boss", dx: 0, dy: 0 },
  },
  {
    id: "ai-vision",
    continent: "ai",
    dungeon: "dungeon-ai-vision",
    name: "Caçada da Imagem",
    center: { x: 172, y: 14 },
    banner: { x: 0, y: -3 },
    lever: { x: -3, y: 3 },
    loot: ["pixel", "borda", "kernel"],
    bossLoot: "pedra-marr",
    monsters: [
      { id: "ai-vision-m1", name: "Pixel", tier: 1, kind: "slime", dx: -3, dy: 1 },
      { id: "ai-vision-m2", name: "Borda", tier: 2, kind: "eye", dx: 3, dy: 2 },
      { id: "ai-vision-m3", name: "Objeto", tier: 3, kind: "golem", dx: 0, dy: 4 },
    ],
    boss: { id: "ai-vision-boss", name: "A Alucinação", kind: "boss", dx: 0, dy: 0 },
  },
  {
    id: "lingua-literature",
    continent: "lingua",
    dungeon: "dungeon-lingua-literature",
    name: "Caçada da Narrativa",
    center: { x: 34, y: 178 },
    banner: { x: 0, y: -3 },
    lever: { x: -3, y: 3 },
    loot: ["verso", "estrofe", "pagina"],
    bossLoot: "pedra-machado",
    monsters: [
      { id: "lingua-literature-m1", name: "Verso", tier: 1, kind: "slime", dx: -3, dy: -2 },
      { id: "lingua-literature-m2", name: "Estrofe", tier: 2, kind: "eye", dx: 3, dy: -2 },
      { id: "lingua-literature-m3", name: "Narrador", tier: 3, kind: "golem", dx: 0, dy: 3 },
    ],
    boss: { id: "lingua-literature-boss", name: "O Narrador Não Confiável", kind: "boss", dx: 0, dy: 0 },
  },
  {
    id: "cs-net",
    continent: "cs",
    dungeon: "dungeon-cs-net",
    name: "Caçada dos Pacotes",
    center: { x: 256, y: 18 },
    banner: { x: 0, y: -3 },
    lever: { x: -3, y: 3 },
    loot: ["pacote", "datagrama", "handshake"],
    bossLoot: "pedra-baran",
    monsters: [
      { id: "cs-net-m1", name: "Pacote", tier: 1, kind: "slime", dx: -3, dy: 2 },
      { id: "cs-net-m2", name: "Datagrama", tier: 2, kind: "eye", dx: 3, dy: 2 },
      { id: "cs-net-m3", name: "Roteador", tier: 3, kind: "golem", dx: 0, dy: 4 },
    ],
    boss: { id: "cs-net-boss", name: "O Roteador Antigo", kind: "boss", dx: 0, dy: 0 },
  },
  {
    id: "physics-thermo",
    continent: "physics",
    dungeon: "dungeon-physics-thermo",
    name: "Caçada do Calor",
    center: { x: 120, y: 142 },
    banner: { x: 0, y: -3 },
    lever: { x: -3, y: 3 },
    loot: ["calor", "ciclo", "entropia"],
    bossLoot: "pedra-carnot",
    monsters: [
      { id: "physics-thermo-m1", name: "Calor", tier: 1, kind: "wisp", dx: -3, dy: 2 },
      { id: "physics-thermo-m2", name: "Ciclo", tier: 2, kind: "eye", dx: 3, dy: 2 },
      { id: "physics-thermo-m3", name: "Entropia", tier: 3, kind: "golem", dx: 0, dy: 4 },
    ],
    boss: { id: "physics-thermo-boss", name: "O Motor Perfeito", kind: "boss", dx: 0, dy: 0 },
  },
  {
    id: "chem-analytical",
    continent: "chem",
    dungeon: "dungeon-chem-analytical",
    name: "Caçada dos Vestígios",
    center: { x: 78, y: 142 },
    banner: { x: 0, y: -3 },
    lever: { x: -3, y: 3 },
    loot: ["amostra", "titulante", "espectro"],
    bossLoot: "pedra-liebig",
    monsters: [
      { id: "chem-analytical-m1", name: "Amostra", tier: 1, kind: "slime", dx: -3, dy: 2 },
      { id: "chem-analytical-m2", name: "Titulante", tier: 2, kind: "eye", dx: 3, dy: 2 },
      { id: "chem-analytical-m3", name: "Espectro", tier: 3, kind: "wisp", dx: 0, dy: 4 },
    ],
    boss: { id: "chem-analytical-boss", name: "O Reagente Puro", kind: "boss", dx: 0, dy: 0 },
  },
  {
    id: "music-form",
    continent: "music",
    dungeon: "dungeon-music-form",
    name: "Caçada da Forma",
    center: { x: 276, y: 58 },
    banner: { x: 0, y: -3 },
    lever: { x: -3, y: 3 },
    loot: ["motivo", "tema", "coda"],
    bossLoot: "pedra-hildegard",
    monsters: [
      { id: "music-form-m1", name: "Motivo", tier: 1, kind: "slime", dx: -3, dy: 2 },
      { id: "music-form-m2", name: "Tema", tier: 2, kind: "eye", dx: 3, dy: 2 },
      { id: "music-form-m3", name: "Fuga", tier: 3, kind: "wisp", dx: 0, dy: 4 },
    ],
    boss: { id: "music-form-boss", name: "A Fuga Final", kind: "boss", dx: 0, dy: 0 },
  },
  {
    id: "math-prob",
    continent: "math",
    dungeon: "dungeon-math-prob",
    name: "Caçada do Acaso",
    center: { x: 276, y: 88 },
    banner: { x: 0, y: -3 },
    lever: { x: -3, y: 3 },
    loot: ["dado", "amostra", "outlier"],
    bossLoot: "pedra-laplace",
    monsters: [
      { id: "math-prob-m1", name: "Dado", tier: 1, kind: "slime", dx: -3, dy: 1 },
      { id: "math-prob-m2", name: "Amostra", tier: 2, kind: "eye", dx: 3, dy: 1 },
      { id: "math-prob-m3", name: "Outlier", tier: 3, kind: "golem", dx: 0, dy: 3 },
    ],
    boss: { id: "math-prob-boss", name: "O Acaso", kind: "boss", dx: 0, dy: 0 },
  },
  {
    id: "ai-language",
    continent: "ai",
    dungeon: "dungeon-ai-language",
    name: "Caçada dos Tokens",
    center: { x: 226, y: 142 },
    banner: { x: 0, y: -3 },
    lever: { x: -3, y: 3 },
    loot: ["prompt", "contexto", "vocabulario"],
    bossLoot: "pedra-chomsky",
    monsters: [
      { id: "ai-language-m1", name: "Token", tier: 1, kind: "slime", dx: -3, dy: 1 },
      { id: "ai-language-m2", name: "Prompt", tier: 2, kind: "eye", dx: 3, dy: 1 },
      { id: "ai-language-m3", name: "Alucinação", tier: 3, kind: "wisp", dx: 0, dy: 3 },
    ],
    boss: { id: "ai-language-boss", name: "O Papagaio Estatístico", kind: "boss", dx: 0, dy: 0 },
  },
  {
    id: "lingua-semantics",
    continent: "lingua",
    dungeon: "dungeon-lingua-semantics",
    name: "Caçada do Sentido",
    center: { x: 276, y: 142 },
    banner: { x: 0, y: -3 },
    lever: { x: -3, y: 3 },
    loot: ["sentido", "ironia", "implicatura"],
    bossLoot: "pedra-saussure",
    monsters: [
      { id: "lingua-semantics-m1", name: "Sentido", tier: 1, kind: "slime", dx: -3, dy: 1 },
      { id: "lingua-semantics-m2", name: "Ironia", tier: 2, kind: "eye", dx: 3, dy: 1 },
      { id: "lingua-semantics-m3", name: "Ambiguidade", tier: 3, kind: "wisp", dx: 0, dy: 3 },
    ],
    boss: { id: "lingua-semantics-boss", name: "O Duplo Sentido", kind: "boss", dx: 0, dy: 0 },
  },
  {
    id: "physics-optics",
    continent: "physics",
    dungeon: "dungeon-physics-optics",
    name: "Caçada da Luz",
    center: { x: 82, y: 178 },
    banner: { x: 0, y: -3 },
    lever: { x: -3, y: 3 },
    loot: ["lente", "reflexo", "arco-iris"],
    bossLoot: "pedra-huygens",
    monsters: [
      { id: "physics-optics-m1", name: "Reflexo", tier: 1, kind: "wisp", dx: -3, dy: 1 },
      { id: "physics-optics-m2", name: "Prisma", tier: 2, kind: "eye", dx: 3, dy: 1 },
      { id: "physics-optics-m3", name: "Espectro", tier: 3, kind: "golem", dx: 0, dy: 3 },
    ],
    boss: { id: "physics-optics-boss", name: "O Espectro Branco", kind: "boss", dx: 0, dy: 0 },
  },
];

export const GROUNDS = GROUNDS_RAW.map((g) => ({
  ...g,
  monsters: g.monsters.map((m) => ({
    ...m,
    x: g.center.x + m.dx,
    y: g.center.y + m.dy,
    hp: TIERS[m.tier].hp,
    level: m.tier * 3,
  })),
  boss: {
    ...g.boss,
    x: g.center.x + g.boss.dx,
    y: g.center.y + g.boss.dy,
    hp: TIERS[4].hp,
    tier: 4,
    level: 12,
  },
  lever: { x: g.center.x + g.lever.x, y: g.center.y + g.lever.y },
  bannerPos: { x: g.center.x + g.banner.x, y: g.center.y + g.banner.y },
}));

export const QUESTIONS = {
  cs: {
    1: [
      { q: "Quantos valores diferentes cabem em 8 bits?", options: ["8", "64", "256"], a: 2, why: "Cada bit dobra as possibilidades: 2⁸ = 256 combinações." },
      { q: "Qual porta lógica só devolve 1 quando as duas entradas valem 1?", options: ["OU", "E", "NÃO"], a: 1, why: "A porta E é exigente: as duas entradas precisam estar ligadas." },
      { q: "O que um flip-flop guarda?", options: ["Um bit", "Uma soma", "Um relógio"], a: 0, why: "O flip-flop é a célula de memória mínima: um bit que fica de pé até o clock mandar mudar." },
      { q: "O ciclo de instrução começa por...", options: ["buscar a instrução na memória", "somar dois números", "ligar a ventoinha"], a: 0, why: "Antes de executar, a CPU busca a instrução e a decodifica. O resto vem depois." },
      { q: "Um registrador é...", options: ["memória muito rápida dentro da CPU", "um disco externo", "um cabo de rede"], a: 0, why: "Registradores guardam os operandos que a ULA usa agora, com acesso quase imediato." },
      { q: "A ULA faz...", options: ["operações aritméticas e lógicas", "armazenar arquivos", "resfriar o processador"], a: 0, why: "A unidade lógica e aritmética soma, compara e aplica portas lógicas sobre os dados." },
    ],
    2: [
      { q: "Em complemento de dois, o byte 11111111 representa qual número?", options: ["-1", "255", "-128"], a: 0, why: "Em complemento de dois, todos os bits em 1 valem -1. O 255 aparece se você ler como inteiro sem sinal." },
      { q: "Por que um algoritmo O(n log n) vence um O(n²) quando n cresce?", options: ["Porque tem menos constantes", "Porque cresce mais devagar", "Porque usa menos memória sempre"], a: 1, why: "Constantes importam para n pequeno, mas o termo que cresce mais devagar domina no limite." },
      { q: "A cache existe para quê?", options: ["Encurtar a distância entre CPU e memória", "Aumentar o clock", "Traduzir binário"], a: 0, why: "A cache guarda perto o que acabou de ser usado, evitando esperar a memória principal." },
      { q: "O pipeline acelera porque...", options: ["sobrepõe etapas de instruções diferentes", "aumenta o clock", "reduz a memória"], a: 0, why: "Enquanto uma instrução executa, a próxima busca e a seguinte decodifica: as etapas se sobrepõem." },
      { q: "Cache de dados serve para...", options: ["dar acesso rápido ao que já foi usado", "aumentar o disco", "traduzir binário"], a: 0, why: "Ela guarda cópias de dados recentes. Acertar na cache evita uma ida à memória principal." },
      { q: "Um endereço de memória identifica...", options: ["uma posição de memória", "uma cor", "um arquivo de vídeo"], a: 0, why: "É o número da posição onde o dado mora. Sem endereço não há como buscar nem gravar." },
    ],
    3: [
      { q: "Por que o problema da parada é indecidível?", options: ["Porque não cabe na memória", "Porque um programa geral se contradiz ao analisar a si mesmo", "Porque a CPU é finita"], a: 1, why: "Turing mostrou que um programa que decide se outro para pode ser alimentado com si mesmo e gerar uma contradição." },
      { q: "Duas chaves diferentes caem no mesmo balde de uma tabela hash. Isso é...", options: ["Uma colisão, tratada por encadeamento ou sondagem", "Um erro fatal", "Uma árvore"], a: 0, why: "Colisão é normal. O balde vira uma lista ou o algoritmo procura o próximo espaço livre." },
      { q: "O que a pergunta P versus NP quer dizer?", options: ["Se todo problema verificável rápido é resolvível rápido", "Se a luz é finita", "Se NP é indecidível"], a: 0, why: "Verificar uma solução pode ser fácil e encontrá-la difícil. A pergunta é se essas duas classes coincidem." },
      { q: "A arquitetura de Von Neumann tem...", options: ["memória compartilhada entre dados e instruções", "duas CPUs separadas", "só registradores"], a: 0, why: "Dados e instruções dividem a mesma memória e o mesmo barramento, o que cria o gargalo de Von Neumann." },
      { q: "Um desvio condicional serve para...", options: ["mudar o fluxo do programa", "somar dois números", "limpar o cache"], a: 0, why: "Ele decide se o próximo endereço é a instrução seguinte ou um salto, conforme uma condição." },
    ],
  },
  math: {
    1: [
      { q: "Qual é o único número primo par?", options: ["1", "2", "4"], a: 1, why: "Só o 2 é primo e par. Qualquer outro par maior que 2 é divisível por 2." },
      { q: "A derivada de x² é...", options: ["2x", "x", "x³/3"], a: 0, why: "Pela regra do tombo, x² vira 2x. A integral de x² é x³/3." },
      { q: "A soma dos ângulos internos de um triângulo euclidiano é...", options: ["90°", "180°", "360°"], a: 1, why: "No plano, os três ângulos sempre somam 180°. Em geometrias curvas, isso muda." },
      { q: "Um limite descreve...", options: ["o valor que uma sequência se aproxima", "o valor máximo", "a média dos termos"], a: 0, why: "O limite fala do comportamento perto de um ponto, não necessariamente do valor no ponto." },
      { q: "Uma função é contínua quando...", options: ["não há salto no ponto", "é sempre crescente", "tem derivada zero"], a: 0, why: "Continuidade é o gráfico não pular: o limite se aproxima do valor da função." },
      { q: "A derivada mede...", options: ["a taxa de variação", "o valor médio", "a área total"], a: 0, why: "A derivada é a inclinação da reta tangente: quanto a função muda por unidade." },
    ],
    2: [
      { q: "O teorema de Bayes atualiza o quê?", options: ["A média dos dados", "A probabilidade de uma hipótese diante da evidência", "O determinante"], a: 1, why: "Bayes combina a crença anterior com a verossimilhança da evidência para obter a crença posterior." },
      { q: "O limite de (1 + 1/n)ⁿ, com n tendendo ao infinito, é...", options: ["1", "e", "infinito"], a: 1, why: "Essa expressão é uma das definições do número e, aproximadamente 2,718." },
      { q: "Um número é divisível por 3 quando...", options: ["Termina em 3", "A soma dos algarismos é múltipla de 3", "É ímpar"], a: 1, why: "Como 10 deixa resto 1 na divisão por 3, cada algarismo contribui com seu próprio valor para o resto." },
      { q: "A definição épsilon-delta de limite garante...", options: ["que a função fica perto do limite para todo ponto perto", "que a função é crescente", "que o limite é inteiro"], a: 0, why: "Para qualquer épsilon existe um delta: se x está a menos de delta, f(x) está a menos de épsilon do limite." },
      { q: "A série harmônica, soma de 1/n...", options: ["diverge, mesmo com termos indo a zero", "converge para 1", "converge para e"], a: 0, why: "Os termos vão a zero, mas a soma cresce sem limite. Termo indo a zero não garante convergência." },
      { q: "A integral definida pode ser vista como...", options: ["a soma de áreas infinitesimais", "a inclinação da reta", "o valor máximo"], a: 0, why: "A integral acumula áreas de retângulos cada vez mais finos. É o inverso da derivada." },
    ],
    3: [
      { q: "O hotel de Hilbert mostra que...", options: ["Um infinito enumerável ainda comporta mais um", "Todo infinito é igual", "Infinito não pode ser contado"], a: 0, why: "Mova cada hóspede do quarto n para n+1 e o quarto 1 fica livre. Infinito mais um continua infinito." },
      { q: "O axioma da escolha é independente de ZF. Isso quer dizer que...", options: ["É falso", "Pode ser aceito ou negado sem contradizer ZF", "Não pode ser usado"], a: 1, why: "Independência significa que ZF não prova nem refuta o axioma: dá para construir mundos matemáticos com e sem ele." },
      { q: "O primeiro teorema de Gödel diz que, em sistemas fortes e consistentes...", options: ["Tudo é demonstrável", "Existem verdades não demonstráveis", "A aritmética é inconsistente"], a: 1, why: "Há sentenças verdadeiras que o sistema não consegue provar. Completude e consistência não cabem juntas nesse nível." },
      { q: "Uma sequência de Cauchy é aquela em que...", options: ["os termos ficam arbitrariamente próximos entre si", "os termos são todos inteiros", "a soma diverge"], a: 0, why: "Os termos se aproximam uns dos outros. Em espaços completos, isso equivale a convergir." },
      { q: "A convergência absoluta de uma série implica...", options: ["convergência comum", "divergência", "soma zero"], a: 0, why: "Se a soma dos módulos converge, a série original também converge, em qualquer ordem." },
    ],
  },
  physics: {
    1: [
      { q: "A unidade de força no SI é...", options: ["joule", "newton", "watt"], a: 1, why: "Força se mede em newton. Joule é energia e watt é potência." },
      { q: "A luz no vácuo viaja a cerca de...", options: ["300 km/s", "300 mil km/s", "3 mil km/s"], a: 1, why: "São aproximadamente 300.000 km/s, ou 3 × 10⁸ m/s." },
      { q: "Sem resistência do ar, uma pena e um martelo...", options: ["Caem juntos", "A pena cai primeiro", "O martelo cai primeiro"], a: 0, why: "A aceleração da gravidade é a mesma para os dois. A diferença cotidiana vem do ar." },
      { q: "Corrente elétrica é...", options: ["movimento de cargas", "luz visível", "calor parado"], a: 0, why: "Corrente é carga em movimento. A luz e o calor podem aparecer como efeito, mas não são a corrente." },
      { q: "Partir um ímã ao meio produz...", options: ["dois ímãs com dois polos cada", "um polo norte solto", "nada magnético"], a: 0, why: "Não existe monopolo magnético: cada metade ganha seus próprios polos norte e sul." },
      { q: "Qual destes materiais é bom condutor?", options: ["cobre", "borracha", "vidro"], a: 0, why: "O cobre tem elétrons livres. Borracha e vidro são isolantes." },
    ],
    2: [
      { q: "O momento linear total se conserva quando...", options: ["Não há força externa resultante", "Há atrito", "Há colisão inelástica"], a: 0, why: "Sem força externa resultante, o momento total não muda. Na colisão inelástica ele se conserva, mas a energia não." },
      { q: "Uma onda que muda de meio e de velocidade pode...", options: ["Refratar", "Desaparecer", "Virar partícula sempre"], a: 0, why: "A mudança de velocidade na fronteira desvia a frente de onda. É a refração." },
      { q: "Em um sistema isolado, a entropia tende a...", options: ["Aumentar", "Diminuir", "Ficar constante sempre"], a: 0, why: "A segunda lei diz que a entropia total de um sistema isolado não diminui. O aumento é a seta do tempo." },
      { q: "Mover um ímã perto de uma bobina gera...", options: ["corrente induzida", "corrente nula sempre", "um novo ímã"], a: 0, why: "É a variação do fluxo magnético que induz corrente. Ímã parado não gera nada." },
      { q: "Em um resistor, tensão e corrente são...", options: ["proporcionais, V = R · i", "sempre iguais a zero", "medidas em joules"], a: 0, why: "A lei de Ohm diz que a tensão sobre o resistor é a resistência vezes a corrente." },
      { q: "Um capacitor serve para...", options: ["guardar carga elétrica", "guardar água", "gerar combustível"], a: 0, why: "Duas placas separadas por um isolante acumulam cargas opostas e devolvem energia depois." },
    ],
    3: [
      { q: "No efeito fotoelétrico, aumentar a intensidade sem mudar a frequência...", options: ["Aumenta a energia de cada elétron", "Aumenta o número de elétrons emitidos", "Não muda nada"], a: 1, why: "A energia de cada fóton depende da frequência. Mais intensidade significa mais fótons, logo mais elétrons." },
      { q: "A relatividade restrita afirma que a velocidade da luz...", options: ["Depende do observador", "É a mesma para observadores inerciais", "Só vale no vácuo quente"], a: 1, why: "A invariância da luz é o postulado que obriga o tempo e o espaço a se ajustarem." },
      { q: "O teorema de Noether relaciona...", options: ["Simetrias e leis de conservação", "Calor e trabalho", "Massa e cor"], a: 0, why: "Cada simetria contínua gera uma quantidade conservada: translação gera momento, rotação gera momento angular." },
      { q: "A luz é uma onda eletromagnética porque...", options: ["campo elétrico e magnético oscilam juntos", "o ar empurra a luz", "ela tem massa de repouso"], a: 0, why: "Os dois campos se sustentam: a variação de um gera o outro, e o conjunto viaja no vácuo." },
      { q: "Um transformador troca tensão porque...", options: ["a variação de fluxo acopla duas bobinas", "aquece o fio", "divide a corrente em duas"], a: 0, why: "A corrente alternada no primário cria fluxo variável no núcleo, que induz tensão no secundário." },
    ],
  },
  chem: {
    1: [
      { q: "A fórmula da água é...", options: ["H2O", "CO2", "O2"], a: 0, why: "Dois hidrogênios e um oxigênio. O CO2 é gás carbônico e O2 é oxigênio molecular." },
      { q: "pH 7, a 25 °C, é...", options: ["Ácido", "Neutro", "Básico"], a: 1, why: "A água pura tem pH 7. Abaixo disso é ácido, acima é básico." },
      { q: "O número atômico é a quantidade de...", options: ["Nêutrons", "Prótons", "Moléculas"], a: 1, why: "O número atômico é o número de prótons e define o elemento." },
      { q: "O carbono forma quantas ligações estáveis?", options: ["Quatro", "Duas", "Seis"], a: 0, why: "Com quatro elétrons na camada de valência, o carbono faz quatro ligações covalentes. É a base da vida." },
      { q: "Um hidrocarboneto tem apenas...", options: ["Carbono e hidrogênio", "Carbono e oxigênio", "Nitrogênio e enxofre"], a: 0, why: "Hidrocarboneto é cadeia de carbono com hidrogênio. Metano, eteno e benzeno são exemplos." },
    ],
    2: [
      { q: "Uma ligação covalente compartilha...", options: ["Elétrons", "Prótons", "Nêutrons"], a: 0, why: "Os átomos compartilham pares de elétrons. Prótons e nêutrons ficam no núcleo." },
      { q: "Um mol contém aproximadamente...", options: ["6,02 × 10²³ partículas", "10⁶ partículas", "3,14 partículas"], a: 0, why: "O número de Avogadro é 6,02 × 10²³. É a ponte entre a escala atômica e a escala de laboratório." },
      { q: "Ao aumentar a concentração de um reagente em equilíbrio, o sistema...", options: ["Desloca para os produtos", "Não muda", "Desloca para os reagentes"], a: 0, why: "Le Chatelier: o sistema consome parte do excesso, deslocando para o lado que usa aquele reagente." },
      { q: "O anel do benzeno é desenhado com ligações alternadas porque...", options: ["Os elétrons pi se espalham pelo anel", "Ele tem seis carbonos em linha", "Ele é um ácido forte"], a: 0, why: "As seis ligações pi não ficam fixas: formam uma nuvem deslocalizada. O anel é simétrico." },
      { q: "Dois isômeros têm...", options: ["A mesma fórmula e arranjo diferente", "A mesma fórmula e o mesmo arranjo", "Fórmulas diferentes"], a: 0, why: "Isômeros compartilham a fórmula molecular, mas os átomos estão ligados ou dispostos de outro jeito." },
    ],
    3: [
      { q: "Uma variação negativa de energia livre de Gibbs indica...", options: ["Processo espontâneo", "Processo impossível", "Equilíbrio perfeito"], a: 0, why: "ΔG negativo significa que o processo pode ocorrer espontaneamente nas condições dadas." },
      { q: "Um catalisador acelera a reação porque...", options: ["Aumenta a temperatura", "Diminui a energia de ativação", "Muda o ΔG"], a: 1, why: "Ele abre um caminho com barreira menor. O equilíbrio não muda, só a velocidade de chegar nele." },
      { q: "O princípio de Le Chatelier diz que o sistema...", options: ["Resiste à perturbação e desloca o equilíbrio", "Ignora a perturbação", "Vira outro elemento"], a: 0, why: "Pressão, temperatura ou concentração alteram o equilíbrio numa direção que alivia a mudança." },
      { q: "Um carbono quiral precisa de...", options: ["Quatro grupos diferentes ligados", "Duas ligações duplas", "Ser sempre aromático"], a: 0, why: "Com quatro grupos distintos, o carbono vira centro quiral e a molécula ganha duas formas que não se sobrepõem." },
      { q: "Na polimerização por condensação, cada ligação...", options: ["Libera uma molécula pequena", "Só libera calor", "Consome um metal"], a: 0, why: "Os monômeros se unem e soltam água ou outra molécula pequena. Na adição, nada é liberado." },
    ],
  },
  music: {
    1: [
      { q: "Uma oitava acima equivale a...", options: ["Dobrar a frequência", "Triplicar a frequência", "Somar 12 Hz"], a: 0, why: "Dobrar a frequência dá a mesma nota uma oitava acima. É a razão 2:1." },
      { q: "Uma oitava tem quantos semitons?", options: ["7", "12", "24"], a: 1, why: "A escala temperada divide a oitava em 12 semitons iguais." },
      { q: "Andamento é...", options: ["A altura da nota", "A velocidade da pulsação", "O timbre"], a: 1, why: "Andamento é o tempo: quantas pulsações por minuto. Altura é frequência e timbre é a cor do som." },
      { q: "Uma corda de violão produz som porque...", options: ["Vibra e move o ar", "Aquece o ar ao redor", "Reflete a luz das notas"], a: 0, why: "A corda vibra, empurra o ar em ondas de pressão e o ouvido transforma isso em som." },
      { q: "Um som mais agudo tem...", options: ["Maior frequência", "Maior amplitude", "Maior duração"], a: 0, why: "Agudo e grave são altura: frequência maior, mais ciclos por segundo. Amplitude é volume." },
    ],
    2: [
      { q: "A quinta justa tem razão de frequência próxima de...", options: ["3:2", "2:1", "9:8"], a: 0, why: "A quinta justa é 3:2. A oitava é 2:1 e a segunda maior é 9:8." },
      { q: "A série harmônica é formada por...", options: ["Múltiplos inteiros da fundamental", "Ruído branco", "Apenas a fundamental"], a: 0, why: "Os harmônicos são 2f, 3f, 4f... e dão a identidade do timbre." },
      { q: "O temperamento igual divide a oitava em...", options: ["12 semitons iguais", "7 tons desiguais", "Razões pitagóricas"], a: 0, why: "Todos os semitons têm a mesma razão, o que permite modular para qualquer tom ao custo de pequenos desvios." },
      { q: "Um tubo fechado numa das pontas ressoa nos...", options: ["Múltiplos ímpares da fundamental", "Múltiplos pares da fundamental", "Só na fundamental"], a: 0, why: "A ponta fechada vira nó e a aberta vira ventre: cabem quartos de onda ímpares, não todos os múltiplos." },
      { q: "Ressonância ocorre quando uma vibração...", options: ["Encontra a frequência natural do corpo", "Tem amplitude zero", "Atravessa o vácuo"], a: 0, why: "Quando a frequência excitadora bate com a natural, o corpo acumula energia e a amplitude cresce." },
    ],
    3: [
      { q: "Na música serial, o compositor organiza...", options: ["As doze notas em uma série", "Apenas acordes perfeitos", "Só o ritmo"], a: 0, why: "A série dodecafônica dá peso igual às doze notas e gera variações por inversão, retrogradação e transposição." },
      { q: "Fourier mostra que um som pode ser decomposto em...", options: ["Senos e cossenos", "Apenas ruído", "Acordes inteiros"], a: 0, why: "Qualquer sinal periódico é uma soma de senos e cossenos com frequências múltiplas." },
      { q: "Afinação pitagórica e temperamento igual diferem porque...", options: ["As razões puras não fecham a oitava em 12 passos iguais", "A pitagórica é mais nova", "O temperamento não usa oitavas"], a: 0, why: "Empilhar quintas puras nunca volta exatamente à mesma oitava. O temperamento igual distribui a diferença." },
      { q: "O batimento é ouvido quando duas frequências estão...", options: ["Próximas e interferem", "Idênticas e somam", "Muito distantes"], a: 0, why: "A diferença pequena cria reforço e cancelamento alternados. O resultado é uma pulsação lenta, o batimento." },
      { q: "O timbre de um instrumento vem principalmente de...", options: ["Seus harmônicos e envelope", "Sua altura e duração", "Seu volume apenas"], a: 0, why: "A mistura de harmônicos e o ataque, sustento e queda do som dão a identidade de cada instrumento." },
    ],
  },
  ai: {
    1: [
      { q: "Um token em um modelo de linguagem é...", options: ["Um pedaço de texto", "Uma GPU", "Uma senha"], a: 0, why: "O texto é cortado em pedaços, palavras ou subpalavras, e cada pedaço vira um número." },
      { q: "Aprendizado supervisionado usa...", options: ["Dados com rótulos", "Só dados sem rótulos", "Nenhum dado"], a: 0, why: "O modelo aprende a partir de exemplos com resposta certa. Sem rótulo, é aprendizado não supervisionado." },
      { q: "Uma rede neural é feita de...", options: ["Camadas de neurônios artificiais", "Fios de cobre", "Transistores apenas"], a: 0, why: "São camadas de unidades simples conectadas por pesos ajustáveis." },
      { q: "Para a máquina, uma imagem é...", options: ["Uma grade de números", "Um texto livre", "Um som gravado"], a: 0, why: "Cada pixel vira um ou mais números. A rede enxerga uma matriz, não o desenho." },
      { q: "Um pixel é...", options: ["A menor unidade da imagem", "Um tipo de rede neural", "Um filtro de cor"], a: 0, why: "Pixel é a menor amostra da imagem. Todos juntos formam a grade que a rede processa." },
    ],
    2: [
      { q: "Overfitting acontece quando o modelo...", options: ["Decora o treino e generaliza mal", "Não aprende nada", "Fica rápido demais"], a: 0, why: "Ele aprende ruído dos exemplos e erra em dados novos. O oposto é subajuste." },
      { q: "O gradiente descendente ajusta os pesos na direção...", options: ["De menor erro", "De maior erro", "Aleatória"], a: 0, why: "O gradiente aponta para onde o erro cresce; descer nele é caminhar na direção contrária." },
      { q: "Uma convolução é especialmente útil para...", options: ["Imagens e padrões locais", "Senhas", "Planilhas"], a: 0, why: "O mesmo filtro pequeno percorre a imagem inteira, detectando bordas e texturas em qualquer posição." },
    ],
    3: [
      { q: "A atenção em transformadores permite...", options: ["Pesar relações entre tokens distantes", "Treinar sem dados", "Dispensar a GPU"], a: 0, why: "Cada token consulta os outros e decide quanto importa cada um, sem depender só da distância na frase." },
      { q: "Um modelo simples demais tende a...", options: ["Subajustar", "Sobreajustar", "Nunca errar"], a: 0, why: "Ele não captura a estrutura dos dados. O complexo demais tende ao sobreajuste." },
      { q: "Alinhamento de IA pergunta...", options: ["Como fazer o objetivo da máquina coincidir com o humano", "Como acelerar a rede", "Como reduzir tokens"], a: 0, why: "Um sistema pode maximizar a métrica errada. Alinhar é fazer a métrica representar o que realmente queremos." },
    ],
  },
  lingua: {
    1: [
      { q: "Qual frase está com a concordância certa?", options: ["Os meninos chegou cedo.", "Os meninos chegaram cedo.", "Os menino chega cedo."], a: 1, why: "Sujeito no plural pede verbo no plural: os meninos chegaram." },
      { q: "Qual palavra está escrita corretamente?", options: ["excessão", "exceção", "eceção"], a: 1, why: "Escreve-se exceção, com ç depois do x. Excessão não existe." },
      { q: "Complete: \"Queria ir, ___ chovia.\"", options: ["mais", "mas", "más"], a: 1, why: "Mas é conjunção de oposição. Mais indica quantidade e más é o feminino plural de mau." },
      { q: "Qual é o plural de cidadão?", options: ["cidadões", "cidadãos", "cidadães"], a: 1, why: "O plural é cidadãos. Muitos substantivos em -ão fazem plural em -ãos, como cidadão, irmão e mão." },
      { q: "Em “A menina comprou o livro”, o sujeito é...", options: ["A menina", "o livro", "comprou"], a: 0, why: "O sujeito pratica a ação: a menina comprou. O livro é o objeto direto." },
      { q: "Qual frase usa a vírgula corretamente?", options: ["Maria comprou pão, leite e café.", "Maria, comprou pão leite e café.", "Maria comprou, pão leite e café."], a: 0, why: "A vírgula separa itens de uma enumeração e não deve separar o sujeito do verbo." },
      { q: "Qual dessas palavras é um verbo?", options: ["cidade", "correr", "bonito"], a: 1, why: "Correr é ação, portanto verbo. Cidade é substantivo e bonito é adjetivo." },
      { q: "Na fala brasileira, “a gente” pede qual forma?", options: ["A gente fomos.", "A gente foi.", "A gente fui."], a: 1, why: "A expressão a gente funciona como sujeito de terceira pessoa do singular, então o verbo fica foi." },
      { q: "Quem conta a história é...", options: ["O narrador", "O autor", "O personagem principal"], a: 0, why: "Narrador é a voz que conta dentro do texto; autor é quem escreveu. Os dois não se confundem." },
      { q: "Um soneto tem...", options: ["Catorze versos", "Dez versos", "Quatro versos"], a: 0, why: "O soneto clássico tem catorze versos, distribuídos em dois quartetos e dois tercetos." },
    ],
    2: [
      { q: "Complete: “Não sei ___ ele faltou.”", options: ["porque", "por que", "porquê"], a: 1, why: "Em pergunta indireta usa-se por que separado, sem acento. Porque explica e porquê é substantivo." },
      { q: "Complete: “Vou ___ escola.”", options: ["a", "à", "há"], a: 1, why: "Crase é a soma da preposição a com o artigo a: vou à escola. Há indica tempo passado." },
      { q: "Qual frase está na voz passiva?", options: ["O menino quebrou o vidro.", "O vidro foi quebrado pelo menino.", "O menino se quebrou."], a: 1, why: "Na passiva o sujeito sofre a ação: o vidro foi quebrado. A primeira está na ativa." },
      { q: "Em “Dei o livro ao amigo”, o objeto indireto é...", options: ["o livro", "ao amigo", "Dei"], a: 1, why: "O livro é objeto direto; ao amigo é objeto indireto, com preposição." },
      { q: "“Seus olhos são dois oceanos” é...", options: ["metáfora", "metonímia", "hipérbole"], a: 0, why: "A metáfora compara sem usar como: os olhos são os oceanos, não parecem." },
      { q: "Complete: “___ dez anos que ele partiu.”", options: ["Fazem", "Faz", "Faz-se"], a: 1, why: "O verbo fazer indicando tempo decorrido é impessoal e fica no singular: faz dez anos." },
      { q: "Qual palavra é proparoxítona?", options: ["café", "lâmpada", "papel"], a: 1, why: "Proparoxítona tem a força na antepenúltima sílaba, como lâm-pa-da. Todas levam acento." },
      { q: "Complete: “Ele passou ___ na prova.”", options: ["mal", "mau", "máo"], a: 0, why: "Mal é o oposto de bem e pode ser advérbio. Mau é o oposto de bom e é adjetivo." },
      { q: "O narrador que sabe tudo sobre as personagens é...", options: ["Onisciente", "Personagem", "Testemunha"], a: 0, why: "O narrador onisciente conhece pensamentos e fatos que as personagens não contam. O testemunha só relata o que viu." },
      { q: "Em poesia, métrica é...", options: ["A contagem das sílabas poéticas", "O assunto do poema", "O nome do autor"], a: 0, why: "Métrica conta sílabas poéticas, com elisões próprias da fala do verso. Não é a mesma contagem da gramática." },
    ],
    3: [
      { q: "Qual oração é subordinada substantiva objetiva direta?", options: ["Espero que você venha.", "Quando chove, fico em casa.", "Ele corre como um atleta."], a: 0, why: "A oração completa o verbo esperar sem preposição, então é objeto direto do verbo." },
      { q: "Em “Entreguei o documento à diretora”, a crase é...", options: ["preposição a + artigo a", "acento de ênfase", "artigo definido"], a: 0, why: "Entregar a algo a alguém: a preposição encontra o artigo de a diretora e vira à." },
      { q: "Qual colocação pronominal segue a norma-padrão?", options: ["Me empresta o livro.", "Empresta-me o livro.", "Empresta me o livro."], a: 1, why: "Com verbo no início da fala, a próclise não cabe na norma-padrão: usa-se a ênclise, empresta-me." },
      { q: "“Chorei rios de lágrimas” é...", options: ["hipérbole", "eufemismo", "antítese"], a: 0, why: "Hipérbole é exagero proposital. Eufemismo suaviza e antítese opõe ideias." },
      { q: "Quem escreveu Dom Casmurro?", options: ["Machado de Assis", "José de Alencar", "Clarice Lispector"], a: 0, why: "Machado de Assis publicou Dom Casmurro em 1899. Capitu e Bentinho são personagens do romance." },
      { q: "Em “O povo elegeu o prefeito”, o predicado é...", options: ["verbal", "nominal", "verbo-nominal"], a: 0, why: "O núcleo do predicado é o verbo eleger, verbo significativo. Não há predicativo do sujeito." },
      { q: "O discurso indireto livre mistura...", options: ["A voz do narrador e a do personagem", "Duas línguas diferentes", "Narrador e leitor"], a: 0, why: "No indireto livre, a fala do personagem aparece sem aspas nem verbo de dizer, embutida na voz do narrador." },
      { q: "Intertextualidade é...", options: ["O diálogo entre textos", "Cópia sem intenção", "Um resumo do enredo"], a: 0, why: "Um texto retoma, cita ou transforma outro. É conversa entre obras, não plágio nem resumo." },
    ],
  },
};

// Perguntas que puxam o assunto das salas do fundo da caverna: entram no
// baralho difícil de cada continente e o tema da sala as coloca na frente.
export const DEEP_QUESTIONS = {
  lingua: {
    q: "Em “Havia muitos livros na sala”, o sujeito é...",
    options: ["muitos livros", "não existe sujeito", "a sala"],
    a: 1,
    why: "O verbo haver no sentido de existir é impessoal: a oração não tem sujeito. Muitos livros é o objeto direto.",
  },
  cs: {
    q: "Um escalonador de processos decide o quê?",
    options: ["Qual instrução roda em cada núcleo agora", "Qual é o IP da máquina", "Quanto custa um byte"],
    a: 0,
    why: "O escalonador escolhe a ordem e o núcleo de cada processo. O IP é da rede e o byte é unidade de memória.",
  },
  math: {
    q: "O que o teorema de Cantor mostra sobre o conjunto das partes de um conjunto?",
    options: ["Ele é sempre maior que o conjunto original", "Ele é sempre igual", "Ele é sempre vazio"],
    a: 0,
    why: "Não existe correspondência um a um entre um conjunto e o conjunto de todos os seus subconjuntos.",
  },
  physics: {
    q: "Por que a luz de uma estrela se curva perto do Sol?",
    options: ["A massa curva o espaço-tempo por onde a luz passa", "O ar do espaço empurra a luz", "A luz tem massa de repouso"],
    a: 0,
    why: "Na relatividade geral a gravidade é a geometria do espaço-tempo, e a luz segue essa geometria.",
  },
  chem: {
    q: "O que uma solução tampão faz quando recebe um ácido?",
    options: ["Resiste à mudança de pH", "Vira uma base forte", "Evapora mais rápido"],
    a: 0,
    why: "O tampão consome o ácido adicionado com sua base conjugada e mantém o pH quase estável.",
  },
  music: {
    q: "O que o timbre de um instrumento descreve?",
    options: ["A mistura de harmônicos que dá a cor do som", "A altura da nota apenas", "O volume máximo"],
    a: 0,
    why: "Dois instrumentos na mesma nota soam diferentes porque os harmônicos e seus envelopes mudam.",
  },
  ai: {
    q: "O que a atenção faz numa rede neural?",
    options: ["Pondera quais partes da entrada importam mais", "Apaga os pesos antigos", "Aumenta a resolução da tela"],
    a: 0,
    why: "A atenção calcula pesos para cada token ou posição, em vez de tratar toda a entrada do mesmo jeito.",
  },
};

// Perguntas extras por continente: mais variedade em cada dificuldade, com o
// mesmo cuidado de alternativa única e explicação curta.
export const EXTRA_QUESTIONS = {
  cs: {
    1: [
      { q: "O que um byte guarda?", options: ["Oito bits", "Um bit", "Mil bits"], a: 0, why: "Um byte é um grupo de oito bits, o suficiente para 256 combinações." },
    ],
    2: [
      { q: "O que faz um sistema operacional?", options: ["Organiza processos, memória e arquivos", "Desenha os pixels da tela", "Traduz o código para outra língua"], a: 0, why: "O sistema operacional distribui os recursos da máquina entre os programas e guarda o que precisa durar." },
    ],
    3: [
      { q: "O que é uma máquina de Turing universal?", options: ["Uma máquina que simula qualquer outra máquina de Turing", "Um computador quântico", "Um teclado mecânico"], a: 0, why: "Ela recebe a descrição de outra máquina e executa o mesmo comportamento, o que fundamenta a ideia de computação geral." },
    ],
  },
  math: {
    1: [
      { q: "Quanto é 7 × 8?", options: ["54", "56", "64"], a: 1, why: "Sete grupos de oito somam 56. Também é 8 × 7, pela comutatividade." },
    ],
    2: [
      { q: "O teorema de Pitágoras vale para qual triângulo?", options: ["Qualquer triângulo", "Todo triângulo retângulo", "Só triângulos equiláteros"], a: 1, why: "A soma dos quadrados dos catetos é o quadrado da hipotenusa em triângulos retângulos." },
    ],
    3: [
      { q: "O que é um conjunto incontável?", options: ["Um conjunto sem fim que não pode ser listado em sequência", "Um conjunto vazio", "Um conjunto de dois elementos"], a: 0, why: "Os reais são incontáveis: não existe uma lista que os enumere todos, mesmo com infinitas posições." },
    ],
  },
  physics: {
    1: [
      { q: "Qual é a unidade de energia no SI?", options: ["newton", "joule", "pascal"], a: 1, why: "Energia e trabalho se medem em joule. Newton é força e pascal é pressão." },
    ],
    2: [
      { q: "A terceira lei de Newton diz que...", options: ["Toda ação tem uma reação de mesmo módulo e sentido oposto", "A força é sempre constante", "O movimento sempre para"], a: 0, why: "As forças vêm em pares, aplicadas em corpos diferentes. É por isso que empurrar uma parede também empurra você." },
    ],
    3: [
      { q: "O que a entropia mede?", options: ["O número de arranjos possíveis de um sistema", "A velocidade da luz", "A carga elétrica"], a: 0, why: "Quanto mais arranjos compatíveis com o estado, maior a entropia. A segunda lei diz que ela tende a crescer num sistema isolado." },
    ],
  },
  chem: {
    1: [
      { q: "Qual é o símbolo químico do ferro?", options: ["F", "Fe", "Fr"], a: 1, why: "Ferro é Fe, do latim ferrum. F é flúor e Fr é frâncio." },
    ],
    2: [
      { q: "O que é uma solução?", options: ["Uma mistura homogênea de soluto e solvente", "Um elemento puro", "Uma reação que não acontece"], a: 0, why: "Na solução as partículas se misturam de forma uniforme; a água com sal é o exemplo clássico." },
    ],
    3: [
      { q: "O que uma enzima faz numa reação?", options: ["Baixa a energia de ativação", "Muda o produto final", "Aumenta a temperatura"], a: 0, why: "A enzima oferece um caminho com barreira menor, acelerando a reação sem ser consumida." },
    ],
  },
  music: {
    1: [
      { q: "Quantas notas diferentes tem a escala maior?", options: ["5", "7", "12"], a: 1, why: "A escala maior tem sete graus antes de repetir a tônica na oitava." },
    ],
    2: [
      { q: "Um acorde menor é formado por...", options: ["Tônica, terça menor e quinta justa", "Duas oitavas", "Só a tônica"], a: 0, why: "A terça menor é o que dá o caráter melancólico ao acorde, em contraste com a terça maior." },
    ],
    3: [
      { q: "O que é dissonância?", options: ["Uma combinação que pede resolução", "Um som sem frequência", "Um silêncio"], a: 0, why: "Intervalos dissonantes criam tensão e costumam resolver em consonâncias. Não é erro, é tensão." },
    ],
  },
  ai: {
    1: [
      { q: "O que é um conjunto de treino?", options: ["Exemplos usados para ajustar o modelo", "A tela do computador", "O teste final"], a: 0, why: "O modelo aprende padrões nesses exemplos. O conjunto de teste fica separado para medir generalização." },
    ],
    2: [
      { q: "Para que serve uma função de perda?", options: ["Medir o erro do modelo", "Guardar os dados", "Aumentar a memória"], a: 0, why: "A perda transforma o erro numa medida que o treino tenta reduzir, ajustando os pesos." },
    ],
    3: [
      { q: "O que é viés em um modelo?", options: ["Um erro sistemático que favorece certos casos", "A velocidade do treino", "O tamanho da tela"], a: 0, why: "Viés é um desvio que se repete e não se corrige só com mais dados; vem dos dados, da métrica ou do desenho." },
    ],
  },
};

for (const [continent, tiers] of Object.entries(EXTRA_QUESTIONS)) {
  for (const [tier, list] of Object.entries(tiers)) QUESTIONS[continent][tier].push(...list);
}

export const EXTRA_QUESTIONS_2 = {
  cs: {
    1: [{ q: "Qual número binário vem depois de 101?", options: ["110", "100", "111"], a: 0, why: "101 é 5; somando 1 dá 6, que em binário é 110." }],
    2: [{ q: "O que é um deadlock?", options: ["Processos esperando recursos uns dos outros", "Um erro de digitação", "Uma memória cheia"], a: 0, why: "Cada processo segura um recurso e espera outro; sem ordem, ninguém solta e todos param." }],
    3: [{ q: "O que significa NP-completo?", options: ["Um problema tão difícil quanto os mais difíceis de NP", "Um problema impossível", "Um problema de soma"], a: 0, why: "Se um NP-completo tiver solução rápida, todos os problemas de NP também têm." }],
  },
  math: {
    1: [{ q: "Qual é a raiz quadrada de 81?", options: ["8", "9", "11"], a: 1, why: "9 × 9 = 81. A raiz é o número que, multiplicado por si, dá o radicando." }],
    2: [{ q: "O que é uma função injetora?", options: ["Cada saída vem de no máximo uma entrada", "Toda entrada tem duas saídas", "Uma função constante"], a: 0, why: "Injetora não repete saída: entradas diferentes levam a saídas diferentes." }],
    3: [{ q: "O que o teorema fundamental do cálculo liga?", options: ["Derivada e integral", "Primos e frações", "Seno e cosseno"], a: 0, why: "Derivar e integrar são operações inversas; a área sob a curva e a taxa de variação se conectam." }],
  },
  physics: {
    1: [{ q: "Qual é a unidade de potência no SI?", options: ["joule", "watt", "newton"], a: 1, why: "Potência é energia por tempo, medida em watt. Joule é energia e newton é força." }],
    2: [{ q: "O que é inércia?", options: ["A tendência de manter o movimento", "A força da gravidade", "O atrito do ar"], a: 0, why: "Um corpo sem força resultante continua parado ou em velocidade constante. É a primeira lei de Newton." }],
    3: [{ q: "A dualidade onda-partícula diz que...", options: ["A matéria e a luz mostram onda ou partícula conforme o experimento", "Só a luz é onda", "A partícula não existe"], a: 0, why: "O comportamento depende do arranjo experimental; os dois modelos são necessários." }],
  },
  chem: {
    1: [{ q: "Qual gás as plantas absorvem na fotossíntese?", options: ["oxigênio", "gás carbônico", "nitrogênio"], a: 1, why: "As plantas usam CO2 e água, com luz, para produzir glicose e liberar oxigênio." }],
    2: [{ q: "Um ácido de Brønsted é uma espécie que...", options: ["doa próton", "recebe elétron", "doa nêutron"], a: 0, why: "Na definição de Brønsted, ácido doa H+ e base recebe H+. Elétron é a definição de Lewis." }],
    3: [{ q: "O que a energia de ligação mede?", options: ["A energia para quebrar uma ligação", "O pH da solução", "A massa do átomo"], a: 0, why: "É a energia necessária para separar os átomos ligados. Ligação mais forte, energia maior." }],
  },
  music: {
    1: [{ q: "Quantos tempos tem um compasso 4/4?", options: ["2", "4", "8"], a: 1, why: "O numerador diz quatro tempos por compasso; o denominador diz que a semínima vale um tempo." }],
    2: [{ q: "O que é uma cadência?", options: ["Uma fórmula de encerramento musical", "Um instrumento de sopro", "Uma nota alterada"], a: 0, why: "A cadência é o gesto que fecha ou suspende a frase, como a pontuação de uma oração." }],
    3: [{ q: "O que é modulação?", options: ["Mudar de tonalidade dentro da música", "Aumentar o volume", "Afinar o instrumento"], a: 0, why: "A música muda o centro tonal, às vezes de forma preparada, às vezes abrupta." }],
  },
  ai: {
    1: [{ q: "Em classificação, o que é uma classe?", options: ["Uma categoria de resposta", "Uma camada da rede", "Um tipo de GPU"], a: 0, why: "O modelo escolhe entre classes, como gato ou cachorro. A camada é estrutura, não resposta." }],
    2: [{ q: "Para que serve a regularização?", options: ["Penalizar complexidade e reduzir overfitting", "Aumentar o número de classes", "Apagar os dados"], a: 0, why: "A regularização desencoraja pesos grandes e ajuda o modelo a generalizar, não a decorar." }],
    3: [{ q: "O que é um modelo generativo?", options: ["Um modelo que aprende a produzir dados parecidos com os de treino", "Um modelo que só classifica", "Um banco de dados"], a: 0, why: "Ele aprende a distribuição dos dados e gera novas amostras, como texto, imagem ou som." }],
  },
};

for (const [continent, tiers] of Object.entries(EXTRA_QUESTIONS_2)) {
  for (const [tier, list] of Object.entries(tiers)) QUESTIONS[continent][tier].push(...list);
}

export const EXTRA_QUESTIONS_3 = {
  cs: {
    1: [
      { q: "Em binário, quanto é 1 + 1?", options: ["10", "11", "2"], a: 0, why: "Um mais um estoura o bit e vira 10 em binário, que é 2 em decimal." },
      { q: "O que uma variável guarda?", options: ["Um valor que pode mudar", "Uma constante imutável", "Um arquivo"], a: 0, why: "A variável é um nome para um espaço que guarda um valor; o valor pode mudar durante o programa." },
    ],
    2: [
      { q: "Uma pilha (stack) segue qual ordem?", options: ["FIFO, o primeiro que entra sai primeiro", "LIFO, o último que entra sai primeiro", "Aleatória"], a: 1, why: "A pilha empilha e desempilha no topo: o último a entrar é o primeiro a sair. A fila é FIFO." },
      { q: "O que um compilador faz?", options: ["Traduz o código para outra linguagem antes de rodar", "Executa o código linha a linha", "Desenha a tela"], a: 0, why: "O compilador traduz o programa para código de máquina ou outra linguagem; o interpretador executa aos poucos." },
    ],
    3: [
      { q: "O que a notação O grande descreve?", options: ["Como o custo cresce com o tamanho da entrada", "O número exato de operações", "A memória do disco"], a: 0, why: "O grande O compara o crescimento, ignorando constantes. Ele não promete o tempo exato." },
      { q: "O que é uma condição de corrida?", options: ["O resultado depende da ordem de acesso concorrente", "Um erro de compilação", "Uma corrida de dados no disco"], a: 0, why: "Duas execuções disputam o mesmo recurso e a ordem muda o resultado. Exclusão mútua ou imutabilidade resolvem." },
    ],
  },
  math: {
    1: [
      { q: "Qual é a área de um retângulo de 3 por 5?", options: ["8", "15", "16"], a: 1, why: "A área é base vezes altura: 3 × 5 = 15. O 8 seria o perímetro dividido por 2." },
      { q: "Quanto é 12 ÷ 4?", options: ["2", "3", "4"], a: 1, why: "Doze dividido em quatro grupos iguais dá três em cada grupo." },
    ],
    2: [
      { q: "Qual é a probabilidade de duas caras seguidas numa moeda justa?", options: ["1/2", "1/4", "1/8"], a: 1, why: "Cada cara tem 1/2; os eventos independentes multiplicam: 1/2 × 1/2 = 1/4." },
      { q: "A derivada de sen x é...", options: ["cos x", "-cos x", "sen x"], a: 0, why: "A derivada do seno é o cosseno. A do cosseno é menos o seno." },
    ],
    3: [
      { q: "O que o teorema da incompletude de Gödel mostra?", options: ["Que há verdades não demonstráveis em sistemas consistentes fortes", "Que toda conta tem resposta", "Que a matemática é inútil"], a: 0, why: "Um sistema suficientemente forte e consistente não prova todas as verdades aritméticas. Isso não o torna inútil: mostra limites." },
      { q: "O valor esperado de um dado justo de seis faces é...", options: ["3", "3,5", "6"], a: 1, why: "A média ponderada é (1+2+3+4+5+6)/6 = 3,5. O valor esperado não precisa ser um resultado possível." },
    ],
  },
  physics: {
    1: [
      { q: "Velocidade média é...", options: ["distância dividida pelo tempo", "massa vezes aceleração", "força dividida pela área"], a: 0, why: "v = Δs/Δt. Massa vezes aceleração é força, e força por área é pressão." },
      { q: "A frequência se mede em...", options: ["joule", "hertz", "newton"], a: 1, why: "Hertz é um ciclo por segundo. Joule é energia e newton é força." },
    ],
    2: [
      { q: "A energia cinética de um corpo é...", options: ["m·v", "½·m·v²", "m·g·h"], a: 1, why: "A energia do movimento cresce com o quadrado da velocidade. m·g·h é a energia potencial gravitacional." },
      { q: "A refração acontece quando a onda...", options: ["muda de meio e de velocidade", "bate e volta", "para de vibrar"], a: 0, why: "A mudança de velocidade na fronteira desvia a frente de onda. Voltar é reflexão." },
    ],
    3: [
      { q: "O princípio da incerteza diz que...", options: ["posição e momento não têm precisão simultânea arbitrária", "tudo é incerto", "a luz é sempre onda"], a: 0, why: "O produto das incertezas tem um limite mínimo. Não é ignorância do instrumento, é da natureza quântica." },
      { q: "A conservação da energia afirma que...", options: ["a energia não some, só se transforma", "a energia sempre aumenta", "a energia só existe em movimento"], a: 0, why: "A energia total de um sistema isolado permanece; ela muda de forma, como calor, movimento ou ligação." },
    ],
  },
  chem: {
    1: [
      { q: "Qual é o símbolo do sódio?", options: ["S", "Na", "So"], a: 1, why: "Sódio é Na, do latim natrium. S é enxofre." },
      { q: "Um pH menor que 7 indica...", options: ["ácido", "neutro", "básico"], a: 0, why: "Abaixo de 7 a solução é ácida; acima é básica. A escala é logarítmica." },
    ],
    2: [
      { q: "Massa molar é...", options: ["a massa de um mol de substância", "a massa de um átomo só", "o volume de um gás"], a: 0, why: "A massa molar usa o mol como ponte entre a escala atômica e a de laboratório." },
      { q: "Oxidação é...", options: ["perda de elétrons", "ganho de prótons", "perda de nêutrons"], a: 0, why: "Quem oxida perde elétrons; quem reduz ganha. As duas coisas acontecem juntas." },
    ],
    3: [
      { q: "A constante de equilíbrio indica...", options: ["a extensão da reação no equilíbrio", "a velocidade inicial", "a cor da solução"], a: 0, why: "Ela compara produtos e reagentes no equilíbrio. Não diz quanto tempo levou para chegar lá." },
      { q: "Um catalisador não muda...", options: ["a posição do equilíbrio", "a energia de ativação", "a velocidade da reação"], a: 0, why: "Ele acelera os dois sentidos igualmente; o equilíbrio final é o mesmo, só chega mais rápido." },
    ],
  },
  music: {
    1: [
      { q: "Forte e piano indicam...", options: ["intensidade", "altura", "timbre"], a: 0, why: "Dinâmica é volume. Altura é frequência e timbre é a cor do som." },
      { q: "Um semitom é...", options: ["o menor intervalo da escala temperada", "uma oitava", "um acorde"], a: 0, why: "A escala temperada divide a oitava em 12 semitons iguais." },
    ],
    2: [
      { q: "A relativa menor de Dó maior é...", options: ["Lá menor", "Mi menor", "Sol menor"], a: 0, why: "A relativa menor fica uma terça menor abaixo e usa as mesmas notas: Dó maior e Lá menor." },
      { q: "Síncope é...", options: ["um acento fora do tempo forte", "um instrumento de sopro", "uma pausa longa"], a: 0, why: "A síncope desloca o acento para o contratempo ou para uma parte fraca, criando impulso." },
    ],
    3: [
      { q: "A forma sonata organiza...", options: ["exposição, desenvolvimento e recapitulação", "só refrões", "apenas improvisos"], a: 0, why: "A exposição apresenta os temas, o desenvolvimento os transforma e a recapitulação os resolve na tônica." },
      { q: "Contraponto é...", options: ["linhas melódicas simultâneas e independentes", "um solo sem acompanhamento", "uma afinação"], a: 0, why: "Cada voz tem seu desenho e ainda assim forma um tecido; é diferente de melodia com acompanhamento de acordes." },
    ],
  },
  ai: {
    1: [
      { q: "Em um conjunto de dados, uma feature é...", options: ["uma característica de entrada", "a resposta esperada", "o nome do modelo"], a: 0, why: "A feature descreve o exemplo; o rótulo é a resposta que queremos prever." },
      { q: "O rótulo de um exemplo supervisionado é...", options: ["a resposta esperada", "uma coluna de entrada", "o tamanho do arquivo"], a: 0, why: "No aprendizado supervisionado, cada exemplo vem com a resposta certa para o modelo comparar." },
    ],
    2: [
      { q: "A precisão mede...", options: ["dos positivos previstos, quantos são certos", "dos positivos reais, quantos foram achados", "o tempo de treino"], a: 0, why: "Precisão é acertos entre os que o modelo marcou como positivos. Recall é quantos positivos reais foram achados." },
      { q: "O recall mede...", options: ["dos positivos reais, quantos foram encontrados", "dos previstos, quantos são certos", "a memória da GPU"], a: 0, why: "Recall alto significa poucos positivos esquecidos; pode vir com mais falsos positivos." },
    ],
    3: [
      { q: "Aprendizado por reforço aprende com...", options: ["recompensa e punição", "rótulos fixos", "tabelas prontas"], a: 0, why: "O agente age e recebe sinal de recompensa; ele ajusta a política para maximizar a recompensa ao longo do tempo." },
      { q: "Um modelo de difusão gera dados...", options: ["removendo ruído aos poucos", "sorteando pixels", "copiando o treino"], a: 0, why: "O treino aprende a desfazer ruído; a geração parte do ruído e o remove em passos até formar a amostra." },
    ],
  },
};

for (const [continent, tiers] of Object.entries(EXTRA_QUESTIONS_3)) {
  for (const [tier, list] of Object.entries(tiers)) QUESTIONS[continent][tier].push(...list);
}

export const EXTRA_QUESTIONS_4 = {
  cs: {
    3: [
      { q: "Por que um desvio mal previsto custa caro no pipeline?", options: ["As instruções já buscadas são descartadas", "A memória aquece", "O clock dobra"], a: 0, why: "O processador aposta no caminho e adianta trabalho. Se o desvio for outro, esse trabalho é jogado fora." },
      { q: "Qual é a diferença entre processo e thread?", options: ["Threads compartilham o espaço de endereço do processo", "Processos são sempre mais rápidos", "Threads não têm pilha"], a: 0, why: "Threads do mesmo processo compartilham memória; processos têm espaços separados e conversam por IPC." },
      { q: "A hierarquia de cache explora...", options: ["Localidade temporal e espacial", "Endereços aleatórios", "Um clock fixo"], a: 0, why: "Programas repetem dados e acessam vizinhos; guardar o que acabou de ser usado evita ir longe de novo." },
    ],
  },
  math: {
    3: [
      { q: "O teorema do valor médio garante que existe um ponto onde...", options: ["a derivada iguala a taxa média de variação", "a função é constante", "a integral é zero"], a: 0, why: "Entre dois pontos, a taxa média aparece em algum ponto intermediário com derivada igual a ela, se f for contínua e derivável." },
      { q: "Um conjunto é enumerável quando...", options: ["pode ser posto em bijeção com os naturais", "é finito", "tem medida zero"], a: 0, why: "Enumerar é listar em sequência indexada pelos naturais. Inteiros e racionais são enumeráveis; reais não são." },
      { q: "A integral de Riemann pode falhar em funções...", options: ["com muitas descontinuidades", "constantes", "polinomiais"], a: 0, why: "Oscilações demais impedem que a soma de Riemann convirja. A integral de Lebesgue cobre mais casos." },
    ],
  },
  physics: {
    3: [
      { q: "Por que a luz não escapa de um buraco negro?", options: ["A velocidade de escape excede a da luz", "O vácuo bloqueia fótons", "A luz perde massa"], a: 0, why: "A gravidade é tão intensa que a velocidade de escape passa de c. Nenhuma trajetória para fora cabe do horizonte." },
      { q: "Na relatividade restrita, o intervalo entre dois eventos é...", options: ["invariante entre referenciais inerciais", "sempre maior em repouso", "dependente só da distância"], a: 0, why: "Tempo e espaço mudam juntos de modo que o intervalo espaço-tempo fica igual para todos os observadores inerciais." },
      { q: "Num processo espontâneo de um sistema isolado, a entropia...", options: ["aumenta", "diminui", "fica sempre constante"], a: 0, why: "A segunda lei diz que a entropia total de um sistema isolado não diminui. Processos reversíveis ideais ficam constantes." },
    ],
  },
  chem: {
    3: [
      { q: "A energia de ionização cresce ao longo do período porque...", options: ["a carga nuclear efetiva aumenta", "o raio atômico aumenta", "os nêutrons diminuem"], a: 0, why: "Com mais prótons puxando os mesmos elétrons de valência, fica mais difícil arrancar um elétron." },
      { q: "Um tampão resiste à mudança de pH porque...", options: ["tem ácido e base conjugados", "tem pH 7 fixo", "não tem água"], a: 0, why: "O par ácido-base consome o que é adicionado. Por isso a variação de pH fica pequena até o tampão esgotar." },
      { q: "Enantiômeros são...", options: ["imagens especulares não sobreponíveis", "sempre iguais em tudo", "moléculas sem carbono"], a: 0, why: "Eles têm a mesma fórmula e os mesmos grupos, mas não se sobrepõem por rotação, como mãos esquerda e direita." },
    ],
  },
  music: {
    3: [
      { q: "A fuga é uma forma em que...", options: ["um tema entra em vozes sucessivas", "só um instrumento toca", "não há contraponto"], a: 0, why: "O sujeito aparece em uma voz, depois em outras, sobrepostas. É contraponto levado ao formato de composição." },
      { q: "Uma cadência deceptiva...", options: ["foge da tônica esperada", "termina na tônica", "não tem acorde"], a: 0, why: "O ouvido espera resolver na tônica e o acorde desvia, criando surpresa. É um gesto de suspensão." },
      { q: "O contraponto estuda...", options: ["a combinação de linhas melódicas independentes", "o volume do amplificador", "a afinação do piano"], a: 0, why: "As vozes têm contorno próprio e soam juntas, como no coral. Harmonia pensa acordes; contraponto pensa linhas." },
    ],
  },
  ai: {
    3: [
      { q: "A função de perda mede...", options: ["o erro entre predição e alvo", "o tamanho do dataset", "a velocidade da GPU"], a: 0, why: "Ela dá um número para o quanto a saída está errada. O gradiente desce na direção que reduz esse número." },
      { q: "Overfitting costuma aparecer quando...", options: ["o modelo é complexo demais para o dado", "faltam parâmetros", "o treino é curto"], a: 0, why: "Com capacidade de sobra, o modelo decora o treino, inclusive o ruído, e perde generalização." },
      { q: "A atenção em transformers permite...", options: ["pesar relações entre todos os tokens", "substituir a descida de gradiente", "guardar os pesos em cache"], a: 0, why: "Cada token consulta os outros e recebe pesos, o que captura dependências mesmo longe na sequência." },
      { q: "Generalização é...", options: ["ter bom desempenho em dados não vistos", "decorar o conjunto de treino", "aumentar a memória da GPU"], a: 0, why: "Generalizar é aplicar o que aprendeu a casos novos. Decorar o treino pode dar nota alta nele e nota baixa fora." },
      { q: "Um viés nos dados de treino pode...", options: ["ser reproduzido e amplificado pelo modelo", "sumir com mais camadas", "só afetar a velocidade"], a: 0, why: "O modelo aprende a estatística que recebe. Se um grupo aparece menos ou sempre associado a algo, a predição herda isso." },
    ],
  },
  lingua: {
    3: [
      { q: "Em “Ele disse que viria”, a oração subordinada é...", options: ["substantiva objetiva direta", "adjetiva", "adverbial"], a: 0, why: "A oração completa o sentido de dizer, sem preposição, e funciona como objeto direto: é substantiva objetiva direta." },
      { q: "Na norma-padrão, assistir no sentido de ver pede...", options: ["a preposição a", "objeto direto sem preposição", "predicativo do sujeito"], a: 0, why: "O verbo assistir, nesse sentido, é transitivo indireto: assistir ao filme. Na fala informal, a forma direta aparece." },
      { q: "A coesão por elipse acontece quando...", options: ["um termo já conhecido é omitido", "o nome é repetido", "usa-se um sinônimo"], a: 0, why: "A elipse deixa o termo subentendido pelo contexto, sem repeti-lo. Sinônimo é coesão lexical." },
      { q: "O foco narrativo em primeira pessoa...", options: ["limita a informação ao que o narrador sabe", "é sempre onisciente", "não tem narrador"], a: 0, why: "O narrador-personagem só conta o que viveu ou percebeu. Isso cria mistério e restringe o que o leitor pode saber." },
    ],
  },
};

for (const [continent, tiers] of Object.entries(EXTRA_QUESTIONS_4)) {
  for (const [tier, list] of Object.entries(tiers)) QUESTIONS[continent][tier].push(...list);
}

// Redes: mais duas perguntas por dificuldade para a área da Computação.
export const EXTRA_QUESTIONS_5 = {
  cs: {
    1: [
      { q: "Um pacote de rede leva...", options: ["endereço de origem e destino", "só o texto", "uma senha"], a: 0, why: "O cabeçalho do pacote diz de onde veio e para onde vai. O conteúdo é a carga útil." },
      { q: "Um endereço IP identifica...", options: ["uma máquina na rede", "um arquivo no disco", "um tipo de cabo"], a: 0, why: "O IP é o endereço lógico usado para entregar pacotes. O nome do arquivo é outra camada." },
    ],
    2: [
      { q: "TCP difere de UDP porque...", options: ["garante entrega e ordem", "é sempre mais rápido", "não usa porta"], a: 0, why: "TCP confirma, reordena e retransmite. UDP só envia; quem precisa de garantia implementa por cima." },
      { q: "O DNS serve para...", options: ["traduzir nome em endereço IP", "criptografar o tráfego", "medir a latência"], a: 0, why: "O DNS é a lista telefônica da rede: nome legível vira IP. Criptografia é outra camada." },
    ],
    3: [
      { q: "Comutação de pacotes ganha de circuito porque...", options: ["compartilha a rede sem reservar caminho", "garante banda fixa", "não precisa de endereço"], a: 0, why: "Vários fluxos usam o mesmo enlace, cada pacote escolhe o caminho. É mais eficiente para dados em rajada." },
      { q: "Congestionamento acontece quando...", options: ["a demanda passa da capacidade do enlace", "o cabo é novo", "o pacote é pequeno"], a: 0, why: "Filas crescem, pacotes atrasam e são descartados. TCP recua para aliviar; UDP não." },
    ],
  },
};

for (const [continent, tiers] of Object.entries(EXTRA_QUESTIONS_5)) {
  for (const [tier, list] of Object.entries(tiers)) QUESTIONS[continent][tier].push(...list);
}

// Termodinâmica: duas perguntas por dificuldade.
export const EXTRA_QUESTIONS_6 = {
  physics: {
    1: [
      { q: "Calor é...", options: ["energia em trânsito por diferença de temperatura", "a temperatura de um corpo", "uma substância que esquenta"], a: 0, why: "Calor é energia que passa de um corpo a outro por diferença de temperatura. Não é o que o corpo contém." },
      { q: "A temperatura mede...", options: ["a agitação média das partículas", "o calor total do corpo", "a pressão do gás"], a: 0, why: "Temperatura é uma medida da energia cinética média das partículas. Calor total depende também da massa." },
    ],
    2: [
      { q: "A primeira lei da termodinâmica diz que...", options: ["a energia se conserva, contando calor e trabalho", "a entropia sempre aumenta", "o calor nunca passa"], a: 0, why: "A variação de energia interna é o calor recebido menos o trabalho realizado. É conservação de energia." },
      { q: "A segunda lei da termodinâmica diz que...", options: ["a entropia total de um sistema isolado não diminui", "a energia pode sumir", "o calor vai do frio ao quente sozinho"], a: 0, why: "Processos espontâneos aumentam a entropia total. O calor só vai do frio ao quente com trabalho externo." },
    ],
    3: [
      { q: "O rendimento de Carnot depende de...", options: ["das temperaturas das fontes quente e fria", "da massa do gás", "da cor do material"], a: 0, why: "O limite é 1 - Tf/Tq, em kelvin. Nenhuma máquina entre essas temperaturas supera esse valor." },
      { q: "Entropia pode ser vista como...", options: ["o número de arranjos compatíveis com o macroestado", "a energia total do sistema", "a temperatura absoluta"], a: 0, why: "Quanto mais arranjos microscópicos produzem o mesmo estado macroscópico, maior a entropia. Boltzmann ligou as duas escalas." },
    ],
  },
};

for (const [continent, tiers] of Object.entries(EXTRA_QUESTIONS_6)) {
  for (const [tier, list] of Object.entries(tiers)) QUESTIONS[continent][tier].push(...list);
}

// Química analítica: duas perguntas por dificuldade.
export const EXTRA_QUESTIONS_7 = {
  chem: {
    1: [
      { q: "Uma amostra representativa...", options: ["reflete o todo sem puxar para um lado", "é sempre a maior possível", "é a mais colorida"], a: 0, why: "A amostra precisa conter a mesma proporção do que se quer medir. Tamanho não conserta coleta tendenciosa." },
      { q: "Um indicador ácido-base muda de cor...", options: ["perto do ponto de virada do pH", "quando esquenta", "sempre em pH 7"], a: 0, why: "Cada indicador tem uma faixa de virada. Escolher o indicador errado dá o ponto final no lugar errado." },
    ],
    2: [
      { q: "Na titulação, o ponto de equivalência é...", options: ["quando o titulante neutraliza o analito", "o começo da reação", "quando a solução ferve"], a: 0, why: "É a proporção estequiométrica entre titulante e analito. O indicador só sinaliza perto dele." },
      { q: "A cromatografia separa por...", options: ["diferença de afinidade entre as fases", "peso atômico", "cor apenas"], a: 0, why: "Cada componente interage de um jeito com a fase estacionária e a móvel, e por isso anda em velocidades diferentes." },
    ],
    3: [
      { q: "A espectrometria identifica substâncias por...", options: ["padrão de absorção ou emissão de luz", "cheiro", "densidade apenas"], a: 0, why: "Cada espécie absorve ou emite comprimentos de onda característicos. O espectro é uma impressão digital." },
      { q: "Um erro sistemático...", options: ["desloca todas as medidas no mesmo sentido", "varia ao acaso", "não afeta a média"], a: 0, why: "Ele é enviesado: balança descalibrada, reagente impuro. Repetir não resolve; calibrar sim." },
    ],
  },
};

for (const [continent, tiers] of Object.entries(EXTRA_QUESTIONS_7)) {
  for (const [tier, list] of Object.entries(tiers)) QUESTIONS[continent][tier].push(...list);
}

// Forma musical: duas perguntas por dificuldade.
export const EXTRA_QUESTIONS_8 = {
  music: {
    1: [
      { q: "Um motivo musical é...", options: ["uma ideia curta e reconhecível", "a música inteira", "o silêncio entre notas"], a: 0, why: "O motivo é a menor célula com identidade. Ele pode ser repetido, invertido e combinado para construir a forma." },
      { q: "A forma binária organiza a música em...", options: ["duas partes, A e B", "um refrão só", "doze compassos iguais"], a: 0, why: "AB é a forma binária: uma seção apresenta, a outra contrasta. Não é o mesmo que verso e refrão." },
    ],
    2: [
      { q: "A forma sonata costuma apresentar...", options: ["exposição, desenvolvimento e reexposição", "só improviso", "apenas um acorde"], a: 0, why: "Os temas aparecem, são transformados no desenvolvimento e voltam na reexposição, em geral na tônica." },
      { q: "No contraponto, as vozes...", options: ["têm contorno próprio e soam juntas", "fazem sempre a mesma nota", "não se relacionam"], a: 0, why: "Cada linha melódica tem independência, mas o conjunto precisa soar coerente. É diferente de melodia com acompanhamento." },
    ],
    3: [
      { q: "Na fuga, o sujeito...", options: ["entra em vozes sucessivas", "é um acorde final", "não se repete"], a: 0, why: "O sujeito aparece numa voz e depois nas outras, sobreposto. A fuga é contraponto em forma de composição." },
      { q: "Uma variação musical mantém...", options: ["a identidade do tema, mudando a superfície", "sempre a mesma instrumentação", "o mesmo andamento obrigatório"], a: 0, why: "Variação reconhece o tema apesar das mudanças de ritmo, harmonia ou timbre. A identidade está na estrutura." },
    ],
  },
};

for (const [continent, tiers] of Object.entries(EXTRA_QUESTIONS_8)) {
  for (const [tier, list] of Object.entries(tiers)) QUESTIONS[continent][tier].push(...list);
}

// Probabilidade: duas perguntas por dificuldade.
export const EXTRA_QUESTIONS_9 = {
  math: {
    1: [
      { q: "A probabilidade de um evento varia entre...", options: ["0 e 1", "0 e 100", "-1 e 1"], a: 0, why: "Probabilidade é uma proporção entre 0 e 1. Em porcentagem, vai de 0% a 100%, mas o valor matemático é 0 a 1." },
      { q: "Jogar uma moeda justa duas vezes, a probabilidade de duas caras é...", options: ["1/4", "1/2", "1"], a: 0, why: "Os lançamentos são independentes: 1/2 vezes 1/2 dá 1/4. O resultado anterior não muda o próximo." },
    ],
    2: [
      { q: "A probabilidade condicional P(A|B) mede...", options: ["a chance de A sabendo que B ocorreu", "a chance de B sem saber de A", "a soma de A e B"], a: 0, why: "O espaço amostral encolhe para B. P(A|B) = P(A e B)/P(B), quando P(B) não é zero." },
      { q: "A lei dos grandes números diz que...", options: ["a média amostral se aproxima da esperada com muitas repetições", "todo jogo tem sorte garantida", "a variância sempre diminui"], a: 0, why: "Com n grande, a média das amostras tende à média da distribuição. Não garante resultado em uma rodada." },
    ],
    3: [
      { q: "A variância mede...", options: ["o espalhamento em torno da média", "o valor mais frequente", "a soma dos dados"], a: 0, why: "Variância é a média dos quadrados dos desvios. Duas séries com a mesma média podem ter variâncias bem diferentes." },
      { q: "O teorema de Bayes permite...", options: ["atualizar a probabilidade com informação nova", "prever o futuro sem dados", "provar que todo evento é independente"], a: 0, why: "Bayes combina a crença anterior com a verossimilhança do dado observado para produzir a posterior." },
    ],
  },
};

for (const [continent, tiers] of Object.entries(EXTRA_QUESTIONS_9)) {
  for (const [tier, list] of Object.entries(tiers)) QUESTIONS[continent][tier].push(...list);
}

// Linguagem de máquina: duas perguntas por dificuldade.
export const EXTRA_QUESTIONS_10 = {
  ai: {
    1: [
      { q: "Um token, para um modelo de linguagem, é...", options: ["um pedaço de texto", "uma GPU", "uma senha"], a: 0, why: "O texto é cortado em tokens, que podem ser palavras ou pedaços de palavra. Cada token vira um número." },
      { q: "Um modelo de linguagem aprende principalmente a...", options: ["prever o próximo token", "traduzir sem dados", "desenhar imagens"], a: 0, why: "O treino é prever o que vem depois, dado o contexto. Dessa tarefa simples emergem outras capacidades." },
    ],
    2: [
      { q: "A janela de contexto define...", options: ["quanto texto o modelo consegue considerar de uma vez", "o número de camadas", "a velocidade da GPU"], a: 0, why: "Tudo o que está fora da janela não entra no cálculo. Por isso conversas longas precisam resumir ou recuperar trechos." },
      { q: "A temperatura na geração controla...", options: ["o grau de aleatoriedade na escolha do próximo token", "a velocidade do treino", "o tamanho do vocabulário"], a: 0, why: "Temperatura baixa escolhe quase sempre o mais provável; alta distribui a escolha e aumenta a variedade." },
    ],
    3: [
      { q: "Perplexidade mede...", options: ["o quanto o modelo se surpreende com o texto", "a quantidade de parâmetros", "a memória usada"], a: 0, why: "Quanto menor a perplexidade, melhor o modelo prevê aquele texto. É uma medida de surpresa média." },
      { q: "Uma alucinação de modelo de linguagem é...", options: ["uma resposta fluente sem base nos fatos", "um erro de digitação", "uma falha de energia"], a: 0, why: "O modelo gera o que é provável no texto, não o que é verdadeiro. Fluência e verdade são coisas diferentes." },
    ],
  },
};

for (const [continent, tiers] of Object.entries(EXTRA_QUESTIONS_10)) {
  for (const [tier, list] of Object.entries(tiers)) QUESTIONS[continent][tier].push(...list);
}

// Semântica e pragmática: duas perguntas por dificuldade.
export const EXTRA_QUESTIONS_11 = {
  lingua: {
    1: [
      { q: "A semântica estuda...", options: ["o significado das palavras e frases", "a pronúncia", "a pontuação apenas"], a: 0, why: "Semântica é o estudo do significado literal. Pragmática é o uso do significado na situação." },
      { q: "Duas palavras sinônimas...", options: ["têm sentido parecido em muitos contextos", "têm sempre o mesmo som", "nunca mudam de sentido"], a: 0, why: "Sinônimos se aproximam, mas raramente são intercambiáveis em todo contexto. Registrar e ironia mudam a escolha." },
    ],
    2: [
      { q: "Referência e sentido são diferentes porque...", options: ["duas expressões podem apontar para o mesmo objeto com sentidos distintos", "sentido é o som da palavra", "referência é a classe gramatical"], a: 0, why: "Estrela da manhã e estrela da tarde apontam para Vênus, mas apresentam modos diferentes de chegar lá." },
      { q: "Uma implicatura conversacional é...", options: ["um sentido sugerido sem ser dito literalmente", "uma mentira", "um erro de concordância"], a: 0, why: "O falante sugere algo e o ouvinte infere pelo contexto. Cancelar a implicatura é possível; cancelar a verdade literal não." },
    ],
    3: [
      { q: "Uma pressuposição é...", options: ["uma informação tomada como dada pela frase", "uma pergunta indireta", "um sinônimo perfeito"], a: 0, why: "“Você parou de fumar?” pressupõe que a pessoa fumava. A negação mantém a pressuposição." },
      { q: "Um ato de fala é...", options: ["a ação realizada ao dizer algo, como prometer ou pedir", "a pronúncia correta", "o número de sílabas"], a: 0, why: "Falar é agir: pedir, prometer, batizar, advertir. A pragmática estuda essas ações e suas condições." },
    ],
  },
};

for (const [continent, tiers] of Object.entries(EXTRA_QUESTIONS_11)) {
  for (const [tier, list] of Object.entries(tiers)) QUESTIONS[continent][tier].push(...list);
}

// Lote grande rumo às 600: cinco perguntas por dificuldade em cada continente.
export const EXTRA_QUESTIONS_12 = {
  cs: {
    1: [
      { q: "O que é um bit?", options: ["Um valor 0 ou 1", "Um dígito decimal", "Um conjunto de oito bytes"], a: 0, why: "Bit é a menor unidade de informação: dois estados. O byte junta oito bits." },
      { q: "Qual periférico é de saída?", options: ["Monitor", "Teclado", "Mouse"], a: 0, why: "O monitor mostra o resultado. Teclado e mouse enviam entrada para a máquina." },
      { q: "O que é um arquivo?", options: ["Um conjunto nomeado de dados", "Um programa em execução", "Um pente de memória"], a: 0, why: "O arquivo tem nome e conteúdo guardado. O programa em execução é processo." },
      { q: "Qual memória perde o conteúdo ao desligar?", options: ["RAM", "SSD", "Pendrive"], a: 0, why: "A RAM é volátil. SSD e pendrive guardam dados sem energia." },
      { q: "O que é um algoritmo?", options: ["Uma sequência finita de passos", "Uma linguagem de programação", "Uma peça de hardware"], a: 0, why: "Algoritmo é o procedimento. Linguagem é como se escreve e hardware é onde roda." },
    ],
    2: [
      { q: "Compilador difere de interpretador porque...", options: ["traduz o código antes de executar", "executa linha por linha", "não lê o código-fonte"], a: 0, why: "O compilador gera código executável; o interpretador traduz e executa aos poucos." },
      { q: "O que é uma API?", options: ["Um contrato para dois programas conversarem", "Um banco de dados", "Uma linguagem de marcação"], a: 0, why: "A API define chamadas e formatos. Quem implementa pode mudar por dentro sem quebrar o contrato." },
      { q: "O que o Git guarda?", options: ["O histórico de versões do código", "As senhas do sistema", "A memória RAM"], a: 0, why: "O Git versiona arquivos e permite comparar, voltar e juntar mudanças." },
      { q: "Complexidade O(1) significa...", options: ["tempo constante em relação à entrada", "tempo linear", "espaço zero"], a: 0, why: "O custo não cresce com o tamanho da entrada. Não quer dizer instantâneo, só constante." },
      { q: "Uma fila segue qual ordem?", options: ["FIFO, o primeiro que entra sai primeiro", "LIFO, o último que entra sai primeiro", "Ordem aleatória"], a: 0, why: "Fila atende por ordem de chegada. Pilha é LIFO." },
    ],
    3: [
      { q: "Deadlock difere de livelock porque...", options: ["no deadlock os processos ficam parados; no livelock mudam sem progredir", "os dois são iguais", "livelock só existe em rede"], a: 0, why: "No deadlock ninguém avança; no livelock os processos reagem e mudam de estado, mas o trabalho não conclui." },
      { q: "Memória virtual permite...", options: ["usar disco como extensão e isolar processos", "aumentar o clock da CPU", "dispensar a RAM"], a: 0, why: "Cada processo vê um espaço próprio; páginas vão para o disco quando falta RAM." },
      { q: "O coletor de lixo...", options: ["libera memória que não é mais alcançável", "apaga arquivos do disco", "desliga a CPU"], a: 0, why: "Ele encontra objetos sem referência e devolve o espaço. Não gerencia arquivos." },
      { q: "Uma operação idempotente...", options: ["repetida produz o mesmo resultado", "nunca falha", "é sempre mais rápida"], a: 0, why: "Repetir não muda o efeito. É o que permite repetir uma requisição com segurança." },
      { q: "JOIN em SQL serve para...", options: ["combinar linhas de tabelas por uma condição", "apagar uma tabela", "ordenar o banco"], a: 0, why: "O JOIN relaciona tabelas por chave. Apagar é DELETE e ordenar é ORDER BY." },
    ],
  },
  math: {
    1: [
      { q: "Quanto é 2³?", options: ["8", "6", "9"], a: 0, why: "Dois multiplicado por si três vezes: 2 × 2 × 2 = 8." },
      { q: "Um ângulo reto mede...", options: ["90 graus", "180 graus", "45 graus"], a: 0, why: "Reto é um quarto de volta: 90 graus. Raso é 180." },
      { q: "Qual é o valor aproximado de π?", options: ["3,14", "2,71", "1,41"], a: 0, why: "π é a razão entre circunferência e diâmetro, aproximadamente 3,14159." },
      { q: "Qual fração é equivalente a 1/2?", options: ["2/4", "1/3", "2/3"], a: 0, why: "Multiplicar numerador e denominador por 2 dá 2/4, a mesma proporção." },
      { q: "Quanto é 1/4 + 1/4?", options: ["1/2", "1/8", "2/8"], a: 0, why: "Mesmo denominador: soma os numeradores, 2/4, que simplifica para 1/2." },
    ],
    2: [
      { q: "Uma função é sobrejetora quando...", options: ["todo elemento do contradomínio é imagem de algum ponto", "cada entrada tem duas saídas", "é constante"], a: 0, why: "Sobrejetora cobre todo o contradomínio. Injetora não repete saída; bijetora faz as duas coisas." },
      { q: "A média de 2, 4, 6 e 8 é...", options: ["5", "4", "6"], a: 0, why: "Soma 20, divide por 4: média 5. A mediana seria 5 também." },
      { q: "Um número irracional...", options: ["não pode ser escrito como fração de inteiros", "tem dízima finita", "é sempre negativo"], a: 0, why: "π e √2 são irracionais: a expansão decimal não termina nem repete." },
      { q: "A probabilidade complementar de 0,3 é...", options: ["0,7", "0,3", "1,3"], a: 0, why: "O complemento é 1 menos a probabilidade: 1 - 0,3 = 0,7." },
      { q: "Qual é a derivada de 3x?", options: ["3", "3x", "x²"], a: 0, why: "A derivada de uma reta é o coeficiente angular. 3x cresce 3 por unidade." },
    ],
    3: [
      { q: "O teorema de Bolzano garante...", options: ["uma raiz num intervalo com troca de sinal", "um máximo global", "derivada zero em todo ponto"], a: 0, why: "Se f é contínua e troca de sinal entre a e b, existe c com f(c)=0." },
      { q: "Uma matriz quadrada é invertível quando...", options: ["o determinante é diferente de zero", "é simétrica", "tem muitos zeros"], a: 0, why: "Determinante zero indica colunas dependentes; sem inversa. Diferente de zero, a inversa existe." },
      { q: "Um limite lateral...", options: ["aproxima-se por um dos lados do ponto", "é o limite no infinito", "é a derivada"], a: 0, why: "Limites laterais podem diferir. A função tem limite no ponto só quando os dois coincidem." },
      { q: "Na distribuição normal, a média fica...", options: ["no centro da curva", "na cauda direita", "fora da curva"], a: 0, why: "A normal é simétrica em torno da média, que coincide com mediana e moda." },
      { q: "Uma série convergente tem...", options: ["soma tendendo a um valor finito", "soma infinita", "termos sempre crescentes"], a: 0, why: "A sequência de somas parciais tende a um limite finito. Termos crescendo impedem convergência." },
    ],
  },
  physics: {
    1: [
      { q: "A unidade de massa no SI é...", options: ["quilograma", "grama", "libra"], a: 0, why: "O SI usa o quilograma. Grama é submúltiplo e libra é unidade imperial." },
      { q: "Velocidade é...", options: ["distância por tempo", "tempo por distância", "força por massa"], a: 0, why: "v = d/t. Aceleração é variação de velocidade por tempo." },
      { q: "O que a gravidade faz entre massas?", options: ["atrai", "repele", "não interage"], a: 0, why: "A força gravitacional é atrativa e cresce com as massas." },
      { q: "Um circuito aberto...", options: ["não deixa a corrente passar", "aumenta a corrente", "carrega a bateria"], a: 0, why: "Sem caminho fechado, não há corrente contínua. O interruptor aberto é isso." },
      { q: "O som precisa de...", options: ["um meio material", "vácuo", "luz"], a: 0, why: "O som é onda de pressão; sem meio, não se propaga. A luz viaja no vácuo." },
    ],
    2: [
      { q: "A aceleração da gravidade na Terra é cerca de...", options: ["9,8 m/s²", "3 m/s²", "20 m/s²"], a: 0, why: "Perto da superfície, g ≈ 9,8 m/s². A aceleração muda a velocidade em 9,8 m/s a cada segundo." },
      { q: "Trabalho é...", options: ["força na direção do deslocamento", "tempo vezes massa", "energia térmica"], a: 0, why: "W = F·d·cos θ. Força perpendicular ao movimento não realiza trabalho." },
      { q: "Na lei de Ohm, a tensão é...", options: ["resistência vezes corrente", "resistência dividida por corrente", "corrente dividida por resistência"], a: 0, why: "V = R·i. Aumentar a resistência com a mesma corrente exige mais tensão." },
      { q: "Uma onda transversal vibra...", options: ["perpendicular à direção de propagação", "paralela à propagação", "em círculos"], a: 0, why: "Corda e luz são exemplos transversais. O som no ar é longitudinal." },
      { q: "O calor latente muda...", options: ["o estado físico sem mudar a temperatura", "a massa do corpo", "a cor do material"], a: 0, why: "Durante a mudança de fase, a energia reorganiza as ligações e a temperatura fica constante." },
    ],
    3: [
      { q: "A entropia de um cristal perfeito a 0 K tende a...", options: ["zero", "infinito", "um valor negativo"], a: 0, why: "A terceira lei diz que a entropia se aproxima de zero quando a temperatura absoluta tende a zero." },
      { q: "O efeito Doppler explica...", options: ["a mudança de frequência por movimento relativo", "a cor dos objetos", "a gravidade"], a: 0, why: "Aproximar comprime as frentes de onda e aumenta a frequência; afastar faz o contrário." },
      { q: "Um gás ideal supõe...", options: ["colisões elásticas e volume das moléculas desprezível", "moléculas com volume grande", "pressão zero sempre"], a: 0, why: "O modelo despreza interações e volume próprio. Funciona bem em baixa pressão." },
      { q: "A lei de Ampère relaciona...", options: ["corrente e campo magnético", "carga e campo elétrico", "massa e energia"], a: 0, why: "A circulação do campo magnético depende da corrente que atravessa a área." },
      { q: "Fótons têm...", options: ["energia proporcional à frequência", "massa de repouso", "carga elétrica"], a: 0, why: "E = hf. O fóton não tem massa de repouso nem carga; tem energia e momento." },
    ],
  },
  chem: {
    1: [
      { q: "Qual é o símbolo do oxigênio?", options: ["O", "Ox", "Om"], a: 0, why: "O símbolo vem do nome latino oxygenium. É uma letra maiúscula." },
      { q: "A água congelada está no estado...", options: ["sólido", "líquido", "gasoso"], a: 0, why: "Abaixo de 0 °C, a água vira gelo. O estado depende de temperatura e pressão." },
      { q: "Uma solução é...", options: ["uma mistura homogênea", "um composto puro", "um elemento"], a: 0, why: "Soluto e solvente formam uma fase única. Liga metálica é mistura, mas não solução." },
      { q: "O átomo é...", options: ["a menor unidade de um elemento", "uma molécula", "um íon"], a: 0, why: "O átomo mantém as propriedades do elemento. A molécula junta dois ou mais átomos." },
      { q: "O pH da água pura é...", options: ["7", "0", "14"], a: 0, why: "A 25 °C, a água pura é neutra, com pH 7. Ácido abaixo, básico acima." },
    ],
    2: [
      { q: "A ligação iônica ocorre por...", options: ["transferência de elétrons", "compartilhamento de elétrons", "fusão de núcleos"], a: 0, why: "Um átomo cede e outro recebe elétrons, formando íons que se atraem." },
      { q: "Uma reação exotérmica...", options: ["libera calor", "absorve calor", "não troca energia"], a: 0, why: "A entalpia dos produtos é menor; a diferença sai como calor." },
      { q: "Um mol é...", options: ["uma quantidade com o número de Avogadro", "uma unidade de massa", "um volume fixo"], a: 0, why: "Um mol contém 6,02 × 10²³ partículas. A massa depende da substância." },
      { q: "A destilação separa por...", options: ["diferença de ponto de ebulição", "diferença de cor", "tamanho das partículas"], a: 0, why: "O componente mais volátil evapora primeiro e é condensado. É separação por ebulição." },
      { q: "Um óxido é composto de...", options: ["oxigênio e outro elemento", "só hidrogênio", "um metal puro"], a: 0, why: "Óxido tem oxigênio na fórmula. Ferrugem é óxido de ferro." },
    ],
    3: [
      { q: "A eletronegatividade mede...", options: ["a tendência de um átomo atrair elétrons", "a massa atômica", "o raio do núcleo"], a: 0, why: "Cresce para a direita e para cima na tabela. Flúor é o mais eletronegativo." },
      { q: "A lei de Hess diz que a entalpia depende...", options: ["dos estados inicial e final, não do caminho", "do caminho da reação", "só da pressão"], a: 0, why: "A entalpia é função de estado. Somar etapas que levam ao mesmo resultado dá a mesma variação." },
      { q: "Um nucleófilo...", options: ["doa um par de elétrons", "recebe um próton", "é sempre positivo"], a: 0, why: "Nucleófilo ataca região pobre em elétrons. Pode ser neutro ou negativo." },
      { q: "Uma solução tampão resiste...", options: ["à variação de pH", "à evaporação", "à oxidação"], a: 0, why: "O par ácido-base conjugado consome ácido ou base adicionados e segura o pH." },
      { q: "Isótopos têm...", options: ["mesmo número de prótons e diferente de nêutrons", "mesma massa e cargas opostas", "mesmo número de nêutrons"], a: 0, why: "O elemento é definido pelos prótons. A massa muda com os nêutrons." },
    ],
  },
  music: {
    1: [
      { q: "As notas da escala maior de Dó são...", options: ["Dó Ré Mi Fá Sol Lá Si", "Dó Ré Mi Sol Lá", "Dó Fá Sol Si"], a: 0, why: "A escala maior tem sete notas antes de voltar à oitava. Os sustenidos e bemóis vêm das outras escalas." },
      { q: "Um acorde é...", options: ["três ou mais notas simultâneas", "uma nota só", "um ritmo"], a: 0, why: "A tríade é o acorde básico, com três notas. Duas notas já formam intervalo." },
      { q: "Uma pausa na música é...", options: ["um silêncio com duração", "uma nota longa", "um acorde"], a: 0, why: "A pausa tem valor rítmico e conta no compasso como qualquer figura." },
      { q: "Um compasso 3/4 tem...", options: ["três tempos", "quatro tempos", "dois tempos"], a: 0, why: "O numerador diz quantos tempos; o denominador diz qual figura vale um tempo." },
      { q: "Qual destes é instrumento de corda?", options: ["Violão", "Flauta", "Tambor"], a: 0, why: "O violão vibra cordas. Flauta é sopro e tambor é percussão." },
    ],
    2: [
      { q: "A escala menor natural tem...", options: ["terça menor", "terça maior", "quarta aumentada"], a: 0, why: "A distância de um tom e meio entre tônica e terça define o som menor." },
      { q: "Uma quinta justa tem...", options: ["sete semitons", "cinco semitons", "doze semitons"], a: 0, why: "De Dó a Sol há sete semitons. A oitava tem doze." },
      { q: "A harmonia estuda...", options: ["acordes e relações entre eles", "o ritmo", "o timbre"], a: 0, why: "Harmonia trata combinações verticais. Melodia é horizontal e ritmo é tempo." },
      { q: "Um cânone é...", options: ["a mesma melodia em vozes defasadas", "uma forma binária", "um solo"], a: 0, why: "A voz seguinte repete a anterior com atraso. É contraponto baseado em imitação." },
      { q: "Transposição muda...", options: ["a tonalidade mantendo a melodia", "o ritmo", "o timbre"], a: 0, why: "A mesma melodia sobe ou desce de tom. As relações entre notas se mantêm." },
    ],
    3: [
      { q: "Um acorde de sétima diminuta tem...", options: ["quatro notas com terças menores", "três notas", "uma tríade maior"], a: 0, why: "Empilha três terças menores. É instável e pede resolução." },
      { q: "A série harmônica explica...", options: ["o timbre dos instrumentos", "o ritmo", "a intensidade"], a: 0, why: "A presença e a força dos harmônicos dão a cor do som." },
      { q: "Contraponto invertível...", options: ["troca as vozes mantendo a validade", "repete a melodia", "dobra o volume"], a: 0, why: "A combinação continua correta com as vozes em posições trocadas." },
      { q: "Modular para o tom da dominante é...", options: ["subir uma quinta", "descer uma oitava", "manter o tom"], a: 0, why: "A dominante está uma quinta acima. É a modulação mais comum." },
      { q: "A forma rondó...", options: ["alterna refrão e episódios", "é sempre ABA", "é uma sonata"], a: 0, why: "O tema volta entre seções contrastantes: ABACA e variações." },
    ],
  },
  ai: {
    1: [
      { q: "O que é um dataset?", options: ["Um conjunto de dados", "Um modelo treinado", "Uma GPU"], a: 0, why: "O dataset reúne exemplos usados no treino ou na avaliação." },
      { q: "O que é um rótulo?", options: ["A resposta esperada", "Uma entrada", "Um peso"], a: 0, why: "No supervisionado, o rótulo acompanha o exemplo e diz qual é a resposta certa." },
      { q: "Qual tarefa é supervisionada?", options: ["Classificar com exemplos rotulados", "Agrupar sem rótulos", "Gerar texto sem alvo"], a: 0, why: "Supervisionado aprende com pares entrada-resposta. Agrupar é não supervisionado." },
      { q: "Para que serve uma GPU no treino?", options: ["Paralelizar contas de matriz", "Guardar arquivos", "Imprimir resultados"], a: 0, why: "As operações de rede são matriciais e paralelizáveis; a GPU faz muitas ao mesmo tempo." },
      { q: "O que é um modelo?", options: ["Uma função ajustada aos dados", "Um banco de dados", "Um algoritmo fixo sem parâmetros"], a: 0, why: "O modelo tem parâmetros aprendidos. O algoritmo é o procedimento de ajuste." },
    ],
    2: [
      { q: "Um conjunto de validação serve para...", options: ["medir generalização durante o desenvolvimento", "acelerar o treino", "aumentar os dados"], a: 0, why: "Ele fica fora do treino e estima o desempenho em dados novos." },
      { q: "Dropout no treino...", options: ["desliga unidades ao acaso", "apaga os dados", "aumenta a taxa de aprendizado"], a: 0, why: "Desligar unidades evita dependência excessiva e funciona como regularização." },
      { q: "A matriz de confusão mostra...", options: ["acertos e erros por classe", "os pesos da rede", "as camadas"], a: 0, why: "Cruza previsto e real. Dela saem precisão, recall e F1 por classe." },
      { q: "Um embedding é...", options: ["um vetor que representa significado", "uma imagem", "um rótulo"], a: 0, why: "Palavras e itens viram vetores próximos quando têm uso parecido." },
      { q: "Aprendizado não supervisionado...", options: ["busca estrutura sem rótulos", "usa rótulos", "só usa reforço"], a: 0, why: "Agrupamento e redução de dimensionalidade são exemplos sem resposta certa." },
    ],
    3: [
      { q: "Gradiente descendente estocástico usa...", options: ["mini-lotes de dados", "todos os dados por passo", "nenhum dado"], a: 0, why: "Cada passo estima o gradiente com um lote pequeno, mais rápido e ruidoso." },
      { q: "Batch normalization...", options: ["estabiliza as ativações", "remove camadas", "aumenta os rótulos"], a: 0, why: "Normaliza as ativações por lote e facilita o treino de redes profundas." },
      { q: "Um transformer usa...", options: ["atenção multi-cabeça", "só convolução", "só recorrência"], a: 0, why: "A atenção pesa relações entre tokens; não há recorrência obrigatória." },
      { q: "Reward hacking é...", options: ["o agente otimizar a métrica errada", "aumentar a recompensa correta", "explorar os dados"], a: 0, why: "O agente explora brechas da recompensa e produz o comportamento medido, não o desejado." },
      { q: "Um modelo de difusão aprende...", options: ["a reverter ruído", "a classificar apenas", "a podar pesos"], a: 0, why: "O treino aprende a desfazer ruído; a geração parte do ruído e o remove em passos." },
    ],
  },
  lingua: {
    1: [
      { q: "Um substantivo...", options: ["nomeia seres e coisas", "indica ação", "indica qualidade"], a: 0, why: "Substantivo é o núcleo do nome. Verbo indica ação e adjetivo qualifica." },
      { q: "O artigo definido feminino é...", options: ["a", "uma", "o"], a: 0, why: "A é definido e feminino. Uma é indefinido." },
      { q: "O plural de pão é...", options: ["pães", "pãos", "pãens"], a: 0, why: "Pão faz pães. A terminação -ão tem plurais irregulares." },
      { q: "Qual palavra é oxítona?", options: ["café", "lâmpada", "mesa"], a: 0, why: "Oxítona tem a força na última sílaba: ca-fé. Lâmpada é proparoxítona e mesa é paroxítona." },
      { q: "Uma frase interrogativa...", options: ["faz uma pergunta", "dá uma ordem", "expressa emoção"], a: 0, why: "A interrogativa pede informação. Imperativa ordena e exclamativa expressa emoção." },
    ],
    2: [
      { q: "O objeto direto...", options: ["completa o verbo sem preposição", "vem sempre com preposição", "é o sujeito"], a: 0, why: "Verbo transitivo direto pede complemento sem preposição obrigatória." },
      { q: "Uma oração coordenada...", options: ["não depende de outra", "é sempre subordinada", "não tem verbo"], a: 0, why: "Coordenadas são independentes entre si; subordinadas exercem função numa principal." },
      { q: "A voz passiva analítica usa...", options: ["ser mais particípio", "ter mais particípio", "ir mais infinitivo"], a: 0, why: "O livro foi escrito: ser + particípio. A passiva sintética usa se." },
      { q: "O antônimo de escasso é...", options: ["abundante", "raro", "pequeno"], a: 0, why: "Escasso é pouco; abundante é muito. Raro e pequeno não são opostos diretos." },
      { q: "Um texto dissertativo...", options: ["defende uma ideia", "narra fatos", "só descreve"], a: 0, why: "Dissertar é argumentar. Narrar conta e descrever caracteriza." },
    ],
    3: [
      { q: "As orações subordinadas adjetivas são introduzidas por...", options: ["pronome relativo", "conjunção integrante", "preposição"], a: 0, why: "Que, qual, cujo retomam o antecedente e funcionam como adjetivo." },
      { q: "Na norma-padrão, obedecer pede...", options: ["a preposição a", "objeto direto", "predicativo"], a: 0, why: "Obedecer é transitivo indireto: obedecer a alguém. Na fala, a forma direta aparece." },
      { q: "A ambiguidade estrutural vem...", options: ["da sintaxe permitir duas leituras", "do léxico", "da prosódia"], a: 0, why: "A mesma estrutura pode ser lida de dois jeitos, como vi a moça com o binóculo." },
      { q: "Intertextualidade explícita é...", options: ["citação direta de outro texto", "paródia sem marca", "resumo do enredo"], a: 0, why: "A referência aparece no texto. A implícita exige que o leitor reconheça." },
      { q: "Um argumento de autoridade...", options: ["apoia-se em um especialista", "usa dado estatístico", "usa exemplo"], a: 0, why: "A força vem do reconhecimento de quem fala. Dado e exemplo são outros tipos de argumento." },
    ],
  },
};

for (const [continent, tiers] of Object.entries(EXTRA_QUESTIONS_12)) {
  for (const [tier, list] of Object.entries(tiers)) QUESTIONS[continent][tier].push(...list);
}

// Segundo lote: mais cinco por dificuldade, temas distintos do primeiro.
export const EXTRA_QUESTIONS_13 = {
  cs: {
    1: [
      { q: "Qual é a diferença entre hardware e software?", options: ["Hardware é a parte física; software é o programa", "Os dois são físicos", "Software é o gabinete"], a: 0, why: "Hardware é o que se toca; software é a instrução que roda nele." },
      { q: "A unidade central de processamento é...", options: ["a CPU", "o HD", "o monitor"], a: 0, why: "A CPU executa instruções. HD guarda e monitor mostra." },
      { q: "Uma linguagem de programação serve para...", options: ["escrever instruções para a máquina", "limpar o teclado", "aumentar a memória"], a: 0, why: "Ela expressa algoritmos de forma legível, depois traduzida para a máquina." },
      { q: "Um backup serve para...", options: ["recuperar dados se algo falhar", "acelerar a internet", "esfriar o computador"], a: 0, why: "A cópia em outro lugar permite restaurar depois de falha ou perda." },
      { q: "Uma rede local conecta...", options: ["máquinas próximas", "países", "só impressoras"], a: 0, why: "LAN cobre um espaço pequeno, como casa ou escritório. WAN cobre longas distâncias." },
    ],
    2: [
      { q: "O sistema binário usa...", options: ["só dois símbolos, 0 e 1", "dez símbolos", "oito símbolos"], a: 0, why: "É a base 2. Cada posição vale uma potência de 2." },
      { q: "Um tipo de dado define...", options: ["que operações fazem sentido para o valor", "a cor da tela", "o nome do arquivo"], a: 0, why: "Inteiro, texto e lista têm operações diferentes. O tipo evita combinações sem sentido." },
      { q: "Um teste unitário verifica...", options: ["uma parte pequena do código isolada", "o sistema inteiro", "a velocidade da internet"], a: 0, why: "Ele testa uma função ou módulo com entradas controladas." },
      { q: "Uma branch no Git serve para...", options: ["desenvolver uma linha de mudanças em paralelo", "apagar o repositório", "compactar arquivos"], a: 0, why: "Branches separam trabalhos e depois podem ser juntadas na principal." },
      { q: "SQL é usado para...", options: ["consultar bancos relacionais", "desenhar interfaces", "compilar código"], a: 0, why: "SQL consulta tabelas relacionais. Interfaces usam HTML/CSS e compilar é outra etapa." },
    ],
    3: [
      { q: "Complexidade de espaço mede...", options: ["memória extra usada pelo algoritmo", "tempo de execução", "número de arquivos"], a: 0, why: "Tempo e espaço são custos separados. Um algoritmo rápido pode gastar muita memória." },
      { q: "Concorrência difere de paralelismo porque...", options: ["concorrência intercala tarefas; paralelismo executa ao mesmo tempo", "são sinônimos", "paralelismo é sempre mais lento"], a: 0, why: "Um núcleo pode alternar tarefas concorrentes. Paralelismo exige execução simultânea." },
      { q: "Um cache miss acontece quando...", options: ["o dado não está no cache e precisa ser buscado", "o cache está cheio", "o processador desliga"], a: 0, why: "O acesso vai para a memória mais lenta. A taxa de acertos mede a eficiência do cache." },
      { q: "As propriedades ACID de uma transação são...", options: ["atomicidade, consistência, isolamento e durabilidade", "velocidade, cor, tamanho e peso", "API, cache, índice e log"], a: 0, why: "Elas garantem que a transação não fique pela metade e sobreviva a falhas." },
      { q: "Compilação JIT acontece...", options: ["durante a execução, com trechos compilados sob demanda", "só antes de instalar", "nunca em Java"], a: 0, why: "A máquina virtual compila trechos quentes em tempo de execução para ganhar velocidade." },
    ],
  },
  math: {
    1: [
      { q: "O perímetro de um quadrado de lado 4 é...", options: ["16", "8", "12"], a: 0, why: "Quatro lados iguais: 4 × 4 = 16. A área seria 16 também, por coincidência." },
      { q: "Qual destes é primo?", options: ["11", "15", "21"], a: 0, why: "11 só é divisível por 1 e por ele mesmo. 15 e 21 têm outros divisores." },
      { q: "20% de 150 é...", options: ["30", "20", "15"], a: 0, why: "20% é 0,2; 0,2 × 150 = 30." },
      { q: "Um triângulo equilátero tem...", options: ["três lados iguais", "dois lados iguais", "lados todos diferentes"], a: 0, why: "Equilátero é o caso de três lados e três ângulos iguais." },
      { q: "Quanto é -3 + 5?", options: ["2", "-2", "8"], a: 0, why: "Na reta numérica, sair de -3 e andar 5 chega a 2." },
    ],
    2: [
      { q: "Regra de três resolve problemas de...", options: ["proporcionalidade", "geometria espacial", "probabilidade"], a: 0, why: "Duas grandezas proporcionais permitem achar o quarto valor pela razão." },
      { q: "A função f(x) = 2x + 1 é...", options: ["afim", "quadrática", "exponencial"], a: 0, why: "Tem a forma ax + b, com grau 1. O gráfico é uma reta." },
      { q: "Média ponderada usa...", options: ["pesos diferentes para cada valor", "só os valores extremos", "a mediana"], a: 0, why: "Cada valor é multiplicado pelo seu peso antes da divisão pela soma dos pesos." },
      { q: "Uma combinação de 3 elementos escolhidos 2 a 2 é...", options: ["3", "6", "9"], a: 0, why: "C(3,2) = 3. A ordem não importa; se importasse, seria arranjo 6." },
      { q: "log₁₀(100) é...", options: ["2", "10", "1"], a: 0, why: "Log é o expoente: 10² = 100. O resultado é 2." },
    ],
    3: [
      { q: "Uma sequência converge quando...", options: ["seus termos se aproximam de um limite", "cresce sempre", "alterna sem parar"], a: 0, why: "Para qualquer margem, a partir de certo ponto todos os termos ficam perto do limite." },
      { q: "Um espaço vetorial é fechado sob...", options: ["soma e multiplicação por escalar", "apenas soma", "apenas produto interno"], a: 0, why: "As duas operações precisam dar resultados dentro do espaço, com os axiomas usuais." },
      { q: "Um autovalor de uma matriz é...", options: ["um escalar que mantém a direção do autovetor", "o determinante", "a soma dos elementos"], a: 0, why: "Av = λv. O autovetor só muda de escala pelo autovalor." },
      { q: "Integração por partes vem...", options: ["da regra do produto na derivada", "do teorema de Pitágoras", "da média"], a: 0, why: "É a regra do produto integrada: ∫u dv = uv - ∫v du." },
      { q: "O teorema de Taylor aproxima uma função por...", options: ["um polinômio em torno de um ponto", "uma reta só", "uma constante"], a: 0, why: "Quanto mais termos, melhor a aproximação perto do ponto, com erro dado pelo resto." },
    ],
  },
  physics: {
    1: [
      { q: "O atrito age...", options: ["contra o movimento relativo", "a favor do movimento", "só no vácuo"], a: 0, why: "Ele se opõe ao deslizamento entre superfícies e dissipa energia." },
      { q: "Empuxo é a força...", options: ["que um fluido exerce para cima", "da gravidade", "do atrito"], a: 0, why: "O fluido deslocado empurra o corpo para cima, conforme Arquimedes." },
      { q: "Temperatura mede...", options: ["a agitação média das partículas", "o calor total", "a pressão"], a: 0, why: "É uma medida intensiva; calor total depende da massa e do material." },
      { q: "Eletricidade estática aparece quando...", options: ["cargas se acumulam num corpo", "a corrente é contínua", "o circuito fecha"], a: 0, why: "Atrito ou contato transfere elétrons e cria desequilíbrio de carga." },
      { q: "Uma lente convergente...", options: ["aproxima raios paralelos num foco", "afasta os raios", "não desvia a luz"], a: 0, why: "Lentes convexas convergem; côncavas divergem." },
    ],
    2: [
      { q: "A quantidade de movimento é...", options: ["massa vezes velocidade", "massa vezes aceleração", "força vezes tempo"], a: 0, why: "p = mv. O impulso é força vezes tempo e muda a quantidade de movimento." },
      { q: "Potência é...", options: ["energia por unidade de tempo", "força por área", "massa por volume"], a: 0, why: "P = W/t, medida em watt. Força por área é pressão." },
      { q: "Dois resistores em série têm resistência equivalente...", options: ["igual à soma", "igual ao produto", "menor que o menor"], a: 0, why: "Em série, a corrente é a mesma e as tensões se somam. Em paralelo, o inverso se soma." },
      { q: "O comprimento de onda é...", options: ["a distância entre dois picos consecutivos", "a altura da onda", "a velocidade"], a: 0, why: "É a repetição espacial. A frequência é a repetição temporal." },
      { q: "Pressão é...", options: ["força por área", "força por volume", "massa por área"], a: 0, why: "P = F/A, medida em pascal. A mesma força em área menor pressiona mais." },
    ],
    3: [
      { q: "O momento angular se conserva quando...", options: ["o torque externo é nulo", "a força é nula", "a massa aumenta"], a: 0, why: "Sem torque resultante, L = Iω fica constante; por isso patinador gira mais ao fechar os braços." },
      { q: "A irreversibilidade de um processo vem...", options: ["do aumento da entropia total", "da conservação da energia", "do vácuo"], a: 0, why: "A energia se conserva, mas a entropia cresce em processos espontâneos." },
      { q: "O efeito Hall separa cargas...", options: ["por uma corrente num campo magnético", "por gravidade", "por atrito"], a: 0, why: "A força magnética empurra portadores para um lado, criando tensão transversal." },
      { q: "Interferência destrutiva ocorre quando...", options: ["as ondas chegam em oposição de fase", "as amplitudes somam", "a frequência é zero"], a: 0, why: "Cristas encontram vales e se cancelam. Em fase, a interferência é construtiva." },
      { q: "Um corpo negro emite...", options: ["radiação com espectro que depende da temperatura", "luz só visível", "nada"], a: 0, why: "O espectro desloca para frequências maiores quando a temperatura sobe, pela lei de Wien." },
    ],
  },
  chem: {
    1: [
      { q: "Uma mistura heterogênea...", options: ["mostra fases distintas", "tem uma fase só", "é um elemento"], a: 0, why: "Água e óleo têm fases visíveis. Solução é homogênea." },
      { q: "Combustão é uma reação que...", options: ["libera energia e consome oxigênio", "absorve energia sempre", "não usa oxigênio"], a: 0, why: "Queima típica é exotérmica e oxidante. Nem toda combustão usa O2 puro, mas a ideia é essa." },
      { q: "O sal de cozinha é...", options: ["cloreto de sódio", "bicarbonato", "açúcar"], a: 0, why: "NaCl. O sódio e o cloro formam ligação iônica." },
      { q: "Um ácido, em solução, libera...", options: ["íons H+", "íons OH-", "elétrons livres"], a: 0, why: "Na definição de Arrhenius, ácido libera H+ e base libera OH-." },
      { q: "Densidade é...", options: ["massa por volume", "massa por tempo", "volume por área"], a: 0, why: "d = m/V. Um corpo denso pode afundar em outro menos denso." },
    ],
    2: [
      { q: "Balancear uma equação garante...", options: ["a mesma quantidade de átomos dos dois lados", "o mesmo volume", "a mesma cor"], a: 0, why: "A matéria se conserva. Os coeficientes ajustam os átomos sem mexer nos índices." },
      { q: "Solubilidade é...", options: ["a quantidade máxima de soluto que dissolve", "a cor da solução", "a massa do solvente"], a: 0, why: "Depende de temperatura e pressão. Passar do limite precipita." },
      { q: "Se pOH é 4, o pH é...", options: ["10", "4", "14"], a: 0, why: "pH + pOH = 14 a 25 °C. Então pH 10, solução básica." },
      { q: "A ligação metálica envolve...", options: ["elétrons livres compartilhados entre íons", "pares de elétrons fixos", "prótons"], a: 0, why: "O mar de elétrons explica condutividade e maleabilidade." },
      { q: "Uma reação de precipitação forma...", options: ["um sólido insolúvel", "só gás", "um ácido"], a: 0, why: "Dois íons solúveis se combinam e formam um composto insolúvel que desce." },
    ],
    3: [
      { q: "Um orbital descreve...", options: ["a região provável de encontrar o elétron", "a órbita exata", "o núcleo"], a: 0, why: "A mecânica quântica fala em probabilidade. Orbital não é uma trajetória." },
      { q: "Kp e Kc diferem porque...", options: ["Kp usa pressões parciais; Kc usa concentrações", "são sempre iguais", "Kp só vale para sólidos"], a: 0, why: "A constante termodinâmica pode ser expressa em pressão ou concentração, com relação pela temperatura." },
      { q: "Uma cinética de primeira ordem tem...", options: ["tempo de meia-vida constante", "velocidade independente da concentração", "meia-vida que dobra"], a: 0, why: "A meia-vida não depende da concentração inicial. Ordem zero e segunda têm outras regras." },
      { q: "Ressonância estabiliza uma molécula porque...", options: ["os elétrons se espalham por mais de uma posição", "aumenta a massa", "elimina as ligações"], a: 0, why: "A deslocalização baixa a energia e distribui a carga. Benzeno é o exemplo clássico." },
      { q: "Aromaticidade pede...", options: ["anel plano com elétrons π deslocalizados", "cadeia aberta", "só ligações simples"], a: 0, why: "Além do anel plano, a contagem de elétrons π segue a regra de Hückel." },
    ],
  },
  music: {
    1: [
      { q: "O pentagrama tem...", options: ["cinco linhas e quatro espaços", "três linhas e dois espaços", "seis linhas"], a: 0, why: "As notas se posicionam nas linhas e nos espaços; as claves definem a altura." },
      { q: "A clave de sol é usada para...", options: ["registros mais agudos", "registros graves", "percussão"], a: 0, why: "A clave de sol marca o Sol na segunda linha. A de fá serve ao registro grave." },
      { q: "Um tom equivale a...", options: ["dois semitons", "um semitom", "cinco semitons"], a: 0, why: "A escala se move por tons e semitons. O piano mostra o semitom entre teclas vizinhas." },
      { q: "Intensidade musical é...", options: ["o volume do som", "a altura da nota", "o timbre"], a: 0, why: "Forte, piano e seus intermediários indicam dinâmica, não altura." },
      { q: "Uma orquestra sinfônica tem...", options: ["cordas, sopros e percussão", "só cordas", "só metais"], a: 0, why: "As famílias se combinam. A formação varia conforme a obra." },
    ],
    2: [
      { q: "A escala pentatônica tem...", options: ["cinco notas", "sete notas", "doze notas"], a: 0, why: "Penta significa cinco. É comum em várias culturas e evita semitons mais tensos." },
      { q: "Um acorde maior é formado por...", options: ["tônica, terça maior e quinta justa", "tônica, terça menor e quinta", "duas notas"], a: 0, why: "A terça maior define o som maior. A tríade menor baixa essa terça em um semitom." },
      { q: "Uma progressão harmônica é...", options: ["uma sequência de acordes", "uma sequência de notas", "um andamento"], a: 0, why: "A progressão cria movimento e expectativa no campo harmônico." },
      { q: "A forma ternária é...", options: ["A-B-A", "A-B", "A-A-A"], a: 0, why: "Apresenta, contrasta e volta. A binária é A-B." },
      { q: "Textura musical descreve...", options: ["quantas vozes e como se relacionam", "o volume", "a tonalidade"], a: 0, why: "Monofônica, homofônica e polifônica são texturas. Não é dinâmica." },
    ],
    3: [
      { q: "Contratempo é...", options: ["um acento que desloca a expectativa do tempo forte", "um silêncio", "uma nota alterada"], a: 0, why: "A acentuação cai fora do pulso esperado e cria síncope." },
      { q: "Enarmonia é...", options: ["nomes diferentes para o mesmo som", "o mesmo nome para sons diferentes", "uma escala"], a: 0, why: "Fá sustenido e Sol bemol soam iguais no temperamento, mas têm função diferente." },
      { q: "Os modos gregos são...", options: ["sete escalas derivadas da escala maior", "doze acordes", "ritmos"], a: 0, why: "Cada modo começa numa nota da escala maior e tem cor própria, como dórico e frígio." },
      { q: "O serialismo dodecafônico organiza...", options: ["as doze notas numa série", "só acordes perfeitos", "só o ritmo"], a: 0, why: "A série dá peso igual às doze notas e permite inversão, retrogradação e transposição." },
      { q: "O espectro harmônico de um som mostra...", options: ["as frequências e suas amplitudes", "o andamento", "a forma"], a: 0, why: "É a decomposição de Fourier. A mistura de harmônicos define o timbre." },
    ],
  },
  ai: {
    1: [
      { q: "IA é o mesmo que aprendizado de máquina?", options: ["Não; aprendizado de máquina é uma parte da IA", "Sim, são sinônimos", "Aprendizado é mais amplo"], a: 0, why: "IA é o campo; aprendizado de máquina é uma abordagem dentro dele." },
      { q: "Um chatbot é...", options: ["um sistema que conversa com o usuário", "um banco de dados", "uma GPU"], a: 0, why: "Ele recebe texto ou fala e responde. Pode usar regras ou modelos." },
      { q: "Um sistema de recomendação usa...", options: ["histórico e preferências para sugerir", "senhas", "compiladores"], a: 0, why: "Ele aprende padrões de consumo e ranqueia itens para cada pessoa." },
      { q: "Visão computacional lida com...", options: ["imagens e vídeos", "só texto", "só áudio"], a: 0, why: "A entrada é visual: pixels organizados em grade." },
      { q: "Dado tabular é...", options: ["organizado em linhas e colunas", "uma imagem", "um áudio"], a: 0, why: "Planilhas e tabelas são o formato clássico para modelos supervisionados." },
    ],
    2: [
      { q: "Uma árvore de decisão divide os dados por...", options: ["perguntas sobre atributos", "sorteio", "gradiente"], a: 0, why: "Cada nó testa uma feature e separa os exemplos até chegar a uma folha." },
      { q: "Agrupamento (clustering) busca...", options: ["grupos de exemplos parecidos", "rótulos conhecidos", "pesos"], a: 0, why: "É não supervisionado: os grupos emergem da proximidade nos dados." },
      { q: "F1 combina...", options: ["precisão e recall", "tempo e memória", "viés e variância"], a: 0, why: "É a média harmônica das duas métricas. Boa quando as classes são desbalanceadas." },
      { q: "Underfitting acontece quando o modelo...", options: ["é simples demais para o padrão", "decora o treino", "tem dados demais"], a: 0, why: "Ele erra no treino e no teste. Falta capacidade ou treino." },
      { q: "Aprendizado por transferência...", options: ["reaproveita um modelo treinado em outra tarefa", "apaga o modelo", "só usa regras"], a: 0, why: "O conhecimento aprendido serve de ponto de partida e reduz dados necessários." },
    ],
    3: [
      { q: "Um transformer precisa de codificação posicional porque...", options: ["a atenção não sabe a ordem dos tokens sozinha", "não usa atenção", "o texto é curto"], a: 0, why: "A atenção é invariante à ordem; a posição entra como informação adicional." },
      { q: "Uma função de ativação serve para...", options: ["introduzir não linearidade", "apagar pesos", "normalizar dados"], a: 0, why: "Sem ela, camadas empilhadas continuam lineares. ReLU e sigmoide são exemplos." },
      { q: "O otimizador Adam combina...", options: ["momento e taxa adaptativa por parâmetro", "só gradiente puro", "só ruído"], a: 0, why: "Ele estima primeiro e segundo momentos e ajusta o passo de cada peso." },
      { q: "Vazamento de dados acontece quando...", options: ["informação do teste entra no treino", "o modelo é pequeno", "a GPU esquenta"], a: 0, why: "A avaliação fica otimista e não reflete dados novos. Separar antes de treinar é essencial." },
      { q: "Avaliação humana é importante porque...", options: ["métricas automáticas não capturam tudo o que importa", "substitui o treino", "mede a GPU"], a: 0, why: "Qualidade, segurança e utilidade exigem julgamento que a métrica isolada não cobre." },
    ],
  },
  lingua: {
    1: [
      { q: "A sílaba tônica é...", options: ["a mais forte da palavra", "a primeira sempre", "a última sempre"], a: 0, why: "É a que recebe mais intensidade. A posição define oxítona, paroxítona e proparoxítona." },
      { q: "Um encontro vocálico pode ser...", options: ["ditongo, tritongo ou hiato", "só ditongo", "só hiato"], a: 0, why: "Depende de quantas vogais e da pronúncia. Hiato separa em sílabas." },
      { q: "O adjetivo...", options: ["qualifica o substantivo", "substitui o nome", "indica ação"], a: 0, why: "Ele caracteriza: casa grande, dia bonito. Pronome substitui e verbo indica ação." },
      { q: "Um pronome pessoal é...", options: ["eu, tu, ele", "casa, mesa", "bonito, alto"], a: 0, why: "Ele representa uma pessoa do discurso. Casa é substantivo e bonito é adjetivo." },
      { q: "O ponto final...", options: ["encerra uma frase declarativa", "indica pergunta", "separa itens"], a: 0, why: "A interrogação usa ponto de interrogação e a enumeração usa vírgula." },
    ],
    2: [
      { q: "O sujeito oculto é...", options: ["não aparece, mas pode ser identificado", "inexistente", "sempre o objeto"], a: 0, why: "Em chegamos cedo, o sujeito nós está subentendido pela desinência." },
      { q: "Um predicado nominal tem como núcleo...", options: ["um nome, com verbo de ligação", "um verbo de ação", "um advérbio"], a: 0, why: "Ele atribui estado ou qualidade: ela está feliz. O núcleo é o predicativo." },
      { q: "Uma conjunção liga...", options: ["orações ou termos", "só palavras iguais", "só nomes próprios"], a: 0, why: "Ela conecta ideias, com valor de adição, oposição, causa e outros." },
      { q: "Denotação e conotação diferem porque...", options: ["denotação é o sentido literal; conotação é figurado", "são iguais", "conotação é erro"], a: 0, why: "Cobra é animal na denotação e pessoa dura na conotação." },
      { q: "Narrar em primeira pessoa...", options: ["usa eu ou nós como voz", "usa sempre ele", "não tem narrador"], a: 0, why: "O narrador participa ou testemunha. Isso limita a informação ao que ele sabe." },
    ],
    3: [
      { q: "Um período composto tem...", options: ["mais de uma oração", "só uma oração", "só frases nominais"], a: 0, why: "Cada verbo ou locução verbal costuma marcar uma oração. O período simples tem uma." },
      { q: "Na norma-padrão, preferir pede...", options: ["preposição a", "objeto direto", "predicativo"], a: 0, why: "Prefiro isto a aquilo. A comparação exige a preposição." },
      { q: "Metonímia é...", options: ["trocar um termo por outro próximo", "exagerar", "suavizar"], a: 0, why: "Ler Machado pelo livro é metonímia: autor pelo obra. Exagero é hipérbole." },
      { q: "A coesão lexical ocorre por...", options: ["repetição, sinônimo ou hiperônimo", "só pontuação", "só conectivo"], a: 0, why: "O texto retoma termos por relações de sentido, não só por conectivos." },
      { q: "Um argumento por analogia...", options: ["compara casos semelhantes", "cita autoridade", "usa estatística"], a: 0, why: "A força depende da semelhança relevante entre os casos comparados." },
    ],
  },
};

for (const [continent, tiers] of Object.entries(EXTRA_QUESTIONS_13)) {
  for (const [tier, list] of Object.entries(tiers)) QUESTIONS[continent][tier].push(...list);
}

// Terceiro lote: seis por dificuldade em quatro continentes.
export const EXTRA_QUESTIONS_14 = {
  cs: {
    1: [
      { q: "O que é a memória ROM?", options: ["Memória não volátil de leitura", "Memória que apaga ao desligar", "Um tipo de processador"], a: 0, why: "A ROM guarda firmware e não perde o conteúdo sem energia. A RAM é volátil." },
      { q: "O mouse é um periférico de...", options: ["entrada", "saída", "armazenamento"], a: 0, why: "Ele envia posição e cliques. Monitor e impressora são saída." },
      { q: "Uma pasta serve para...", options: ["organizar arquivos", "executar programas", "aumentar a memória"], a: 0, why: "A pasta é uma estrutura de organização, não um programa nem hardware." },
      { q: "HTTP é um protocolo de...", options: ["transferência de hipertexto", "compactação de arquivos", "senha"], a: 0, why: "É o acordo usado na web para pedir e receber recursos." },
      { q: "Um servidor é...", options: ["uma máquina que fornece serviços a clientes", "um tipo de teclado", "um arquivo"], a: 0, why: "O cliente pede, o servidor responde. Podem ser programas na mesma máquina." },
      { q: "Uma senha forte é...", options: ["longa e única", "igual em todos os sites", "o nome do cachorro"], a: 0, why: "Comprimento e exclusividade dificultam adivinhação e reuso em vazamentos." },
    ],
    2: [
      { q: "Um banco relacional organiza dados em...", options: ["tabelas com chaves", "arquivos soltos", "vetores apenas"], a: 0, why: "Tabelas, linhas e colunas com chaves primárias e estrangeiras definem as relações." },
      { q: "Um índice de banco serve para...", options: ["acelerar buscas", "compactar o disco", "criptografar"], a: 0, why: "Ele mantém uma estrutura ordenada que evita varrer a tabela inteira." },
      { q: "Uma função pura...", options: ["dá a mesma saída para a mesma entrada e não tem efeito colateral", "modifica o estado global", "usa números aleatórios"], a: 0, why: "Pureza facilita teste e raciocínio. Efeito colateral e aleatoriedade quebram a promessa." },
      { q: "Uma exceção em programação é...", options: ["um evento que interrompe o fluxo normal e pode ser tratado", "um erro de digitação", "uma variável"], a: 0, why: "O tratamento evita que a falha derrube o programa inteiro." },
      { q: "Depurar é...", options: ["encontrar e corrigir defeitos", "apagar o código", "compilar mais rápido"], a: 0, why: "Depuração investiga o comportamento real contra o esperado e corrige a causa." },
      { q: "GET em HTTP serve para...", options: ["pedir um recurso", "apagar um recurso", "enviar senha no corpo"], a: 0, why: "GET lê. POST cria, PUT substitui e DELETE remove." },
    ],
    3: [
      { q: "Uma transação de banco é...", options: ["uma unidade atômica de trabalho", "uma consulta qualquer", "um backup"], a: 0, why: "Ela confirma tudo ou desfaz tudo, mantendo consistência mesmo com falha." },
      { q: "Uma árvore binária de busca mantém...", options: ["menores à esquerda e maiores à direita", "todos os nós iguais", "só um filho"], a: 0, why: "A ordenação permite descartar metade a cada comparação, se a árvore estiver equilibrada." },
      { q: "Um mutex serve para...", options: ["garantir exclusão mútua numa região crítica", "apagar memória", "aumentar a rede"], a: 0, why: "Só uma thread entra por vez, evitando condição de corrida." },
      { q: "Paginação divide a memória em...", options: ["páginas de tamanho fixo", "variáveis contínuas", "discos"], a: 0, why: "Páginas simplificam o mapeamento e permitem trocar blocos para o disco." },
      { q: "Injeção de SQL acontece quando...", options: ["entrada maliciosa vira comando no banco", "o banco está vazio", "a consulta é lenta"], a: 0, why: "Consultas montadas por concatenação deixam a entrada virar código. Prepared statements evitam." },
      { q: "Custo amortizado descreve...", options: ["o custo médio ao longo de muitas operações", "o pior caso isolado", "o custo de memória"], a: 0, why: "Uma operação cara pode pagar por muitas baratas, como no vetor dinâmico." },
    ],
  },
  math: {
    1: [
      { q: "Quantos lados tem um hexágono?", options: ["6", "5", "8"], a: 0, why: "Hexa significa seis. O hexágono regular tem seis lados e seis ângulos iguais." },
      { q: "10% de 250 é...", options: ["25", "10", "50"], a: 0, why: "10% é dividir por 10: 250/10 = 25." },
      { q: "O dobro de 3/4 é...", options: ["3/2", "3/8", "6/8"], a: 0, why: "Multiplicar por 2: 6/4, que simplifica para 3/2." },
      { q: "Um número par é...", options: ["divisível por 2", "primo sempre", "negativo sempre"], a: 0, why: "A divisão por 2 dá resto zero. Zero também é par." },
      { q: "Quanto é 5!?", options: ["120", "25", "60"], a: 0, why: "5! = 5 × 4 × 3 × 2 × 1 = 120." },
      { q: "A soma dos ângulos internos de um quadrilátero é...", options: ["360 graus", "180 graus", "540 graus"], a: 0, why: "A fórmula (n-2)·180 dá 360 para n=4." },
    ],
    2: [
      { q: "Uma progressão aritmética tem...", options: ["diferença constante entre termos", "razão constante", "termos aleatórios"], a: 0, why: "Soma-se sempre a mesma razão. A geométrica multiplica por razão constante." },
      { q: "Uma progressão geométrica tem...", options: ["razão constante entre termos", "diferença constante", "só termos positivos"], a: 0, why: "Cada termo é o anterior vezes a razão. Pode alternar de sinal." },
      { q: "A área do círculo é...", options: ["πr²", "2πr", "πd"], a: 0, why: "2πr é o comprimento da circunferência. A área cresce com o quadrado do raio." },
      { q: "Um número primo tem...", options: ["exatamente dois divisores positivos", "um divisor", "infinitos divisores"], a: 0, why: "Um e ele mesmo. O número 1 não é primo porque só tem um divisor." },
      { q: "A mediana é...", options: ["o valor central dos dados ordenados", "o mais frequente", "a média"], a: 0, why: "Com quantidade par, é a média dos dois centrais. Outliers afetam menos que a média." },
      { q: "A função inversa...", options: ["desfaz a operação da função original", "é sempre quadrática", "não existe"], a: 0, why: "Compor f com sua inversa devolve a entrada, quando a inversa existe." },
    ],
    3: [
      { q: "Um limite no infinito descreve...", options: ["o comportamento quando x cresce sem parar", "o valor no ponto zero", "a derivada"], a: 0, why: "Pode tender a um número, a infinito ou não existir. É sobre tendência, não sobre chegar." },
      { q: "Uma derivada parcial mede...", options: ["a taxa de variação em relação a uma variável, mantendo as outras fixas", "a área total", "o máximo global"], a: 0, why: "É o cálculo multivariável: cada direção tem sua taxa." },
      { q: "A matriz identidade tem...", options: ["1 na diagonal e 0 fora dela", "todos os elementos 1", "só zeros"], a: 0, why: "Multiplicar por ela não muda o vetor, como o número 1 na multiplicação." },
      { q: "A lei dos cossenos generaliza...", options: ["o teorema de Pitágoras para qualquer triângulo", "a média", "a derivada"], a: 0, why: "Ela inclui o cosseno do ângulo e se reduz a Pitágoras quando o ângulo é reto." },
      { q: "A distribuição de Poisson modela...", options: ["contagem de eventos raros num intervalo", "altura de pessoas", "soma de dados"], a: 0, why: "É usada para chamadas por minuto, defeitos por lote e eventos independentes no tempo." },
      { q: "O espaço amostral é...", options: ["o conjunto de todos os resultados possíveis", "um resultado só", "a média"], a: 0, why: "A probabilidade é definida sobre subconjuntos do espaço amostral." },
    ],
  },
  physics: {
    1: [
      { q: "A unidade de tempo no SI é...", options: ["segundo", "minuto", "hora"], a: 0, why: "O SI usa o segundo. Minuto e hora são aceitos, mas não são a unidade base." },
      { q: "Massa mede...", options: ["a quantidade de matéria", "o peso", "a velocidade"], a: 0, why: "Massa é propriedade do corpo; peso é a força gravitacional sobre ele." },
      { q: "Um ímã produz...", options: ["campo magnético", "campo elétrico apenas", "luz"], a: 0, why: "Cargas em movimento e ímãs geram campo magnético, que atrai materiais ferromagnéticos." },
      { q: "A luz branca é...", options: ["uma mistura de cores", "uma cor pura", "invisível"], a: 0, why: "O prisma separa a mistura. Cada cor tem seu comprimento de onda." },
      { q: "Fusão é a passagem de...", options: ["sólido para líquido", "líquido para gás", "gás para sólido"], a: 0, why: "Derreter é fundir. Líquido para gás é vaporização." },
      { q: "Um condutor é um material que...", options: ["permite a passagem de corrente", "bloqueia a corrente", "só conduz calor"], a: 0, why: "Metais têm elétrons livres. Isolantes dificultam a corrente." },
    ],
    2: [
      { q: "Frequência é...", options: ["ciclos por segundo", "altura da onda", "distância percorrida"], a: 0, why: "Medida em hertz. Período é o tempo de um ciclo e é o inverso da frequência." },
      { q: "Amplitude é...", options: ["o deslocamento máximo da onda", "a distância entre cristas", "a velocidade"], a: 0, why: "A amplitude se relaciona à energia e ao volume. Comprimento de onda é a repetição espacial." },
      { q: "Energia potencial gravitacional é...", options: ["mgh", "mv²/2", "ma"], a: 0, why: "Depende da massa, da gravidade e da altura. A cinética é mv²/2." },
      { q: "Corrente alternada...", options: ["muda de sentido periodicamente", "só vai num sentido", "não tem tensão"], a: 0, why: "A rede elétrica usa CA porque facilita transformadores e transmissão." },
      { q: "Um espelho plano forma...", options: ["imagem virtual do mesmo tamanho", "imagem real invertida", "nenhuma imagem"], a: 0, why: "A imagem fica atrás do espelho, direita e simétrica." },
      { q: "Calor específico é...", options: ["energia para variar 1 grau por unidade de massa", "calor total", "temperatura máxima"], a: 0, why: "Materiais diferentes esquentam em ritmos diferentes para a mesma energia." },
    ],
    3: [
      { q: "A lei de Faraday diz que...", options: ["variação de fluxo magnético induz tensão", "carga gera campo elétrico", "ação e reação"], a: 0, why: "A fem induzida é proporcional à taxa de variação do fluxo. É a base do gerador." },
      { q: "Um campo conservativo tem...", options: ["trabalho independente do caminho", "trabalho sempre nulo", "força variável"], a: 0, why: "Só depende dos pontos inicial e final. A gravidade é conservativa." },
      { q: "Dilatação térmica é...", options: ["aumento de dimensões com a temperatura", "mudança de massa", "perda de carga"], a: 0, why: "As partículas vibram mais e se afastam. Trilhos e pontes precisam de folga." },
      { q: "O princípio de Pascal diz que...", options: ["pressão aplicada a um fluido se transmite igualmente", "a pressão some no fundo", "o fluido não exerce força"], a: 0, why: "É a base do elevador hidráulico: força pequena em área pequena vira força grande." },
      { q: "Um semicondutor tem...", options: ["condutividade entre condutor e isolante", "resistência infinita", "supercondutividade sempre"], a: 0, why: "Silício e germânio conduzem sob condições controladas, o que permite transistores." },
      { q: "A constante de Planck relaciona...", options: ["energia e frequência", "massa e peso", "força e área"], a: 0, why: "E = hf. É a constante que marca a escala quântica." },
    ],
  },
  chem: {
    1: [
      { q: "Qual é o símbolo do carbono?", options: ["C", "Ca", "Co"], a: 0, why: "C é carbono; Ca é cálcio e Co é cobalto." },
      { q: "Uma base...", options: ["recebe prótons ou libera OH-", "libera H+", "não reage"], a: 0, why: "Na definição de Brønsted, base recebe H+. Em água, isso aumenta o pH." },
      { q: "Evaporação é a passagem de...", options: ["líquido para gás", "gás para líquido", "sólido para gás"], a: 0, why: "Acontece na superfície, mesmo abaixo do ponto de ebulição." },
      { q: "Uma liga é...", options: ["uma mistura de metais", "um elemento puro", "um ácido"], a: 0, why: "Bronze e aço são ligas. As propriedades mudam em relação aos metais puros." },
      { q: "Qual gás usamos para respirar?", options: ["Oxigênio", "Nitrogênio", "Hélio"], a: 0, why: "A célula usa O2 na respiração celular. O nitrogênio é a maior parte do ar, mas não é consumido." },
      { q: "Uma molécula é...", options: ["um conjunto de átomos ligados", "um átomo isolado", "um íon"], a: 0, why: "A ligação pode ser covalente ou iônica; a molécula é a unidade resultante." },
    ],
    2: [
      { q: "Concentração é...", options: ["quantidade de soluto por volume de solução", "massa do solvente", "cor da solução"], a: 0, why: "Pode ser em mol/L, g/L ou outra razão. É a base da estequiometria em solução." },
      { q: "Neutralização é a reação entre...", options: ["ácido e base", "dois ácidos", "dois metais"], a: 0, why: "Forma sal e água, com variação de pH em direção ao neutro." },
      { q: "A eletrólise usa...", options: ["corrente elétrica para forçar uma reação", "calor apenas", "luz"], a: 0, why: "É o contrário da pilha: energia elétrica impulsiona a reação não espontânea." },
      { q: "Um hidrocarboneto saturado tem...", options: ["só ligações simples entre carbonos", "ligações duplas", "anéis aromáticos"], a: 0, why: "Saturado significa sem ligações duplas ou triplas. Alcanos são exemplos." },
      { q: "Uma solução saturada está...", options: ["no limite de soluto dissolvido", "sem soluto", "sempre diluída"], a: 0, why: "Mais soluto não dissolve e precipita. Aquecer pode aumentar o limite." },
      { q: "Redução é...", options: ["ganho de elétrons", "perda de elétrons", "perda de massa"], a: 0, why: "Reduzir carga positiva. Oxidação é perda de elétrons; as duas andam juntas." },
    ],
    3: [
      { q: "Entalpia mede...", options: ["energia térmica a pressão constante", "entropia", "massa molar"], a: 0, why: "A variação de entalpia indica calor trocado em pressão constante." },
      { q: "Energia de ativação é...", options: ["a barreira mínima para a reação começar", "a energia dos produtos", "o calor total"], a: 0, why: "O catalisador abaixa essa barreira sem mudar os estados inicial e final." },
      { q: "O estado de transição é...", options: ["a configuração de maior energia no caminho", "o produto final", "o reagente inicial"], a: 0, why: "É o ponto mais alto do caminho de reação, instável e transitório." },
      { q: "Um grupo funcional é...", options: ["um conjunto de átomos que define o comportamento", "a cadeia inteira", "um isótopo"], a: 0, why: "Álcool, cetona e amina têm grupos diferentes e reagem de jeitos diferentes." },
      { q: "Polaridade de uma molécula depende...", options: ["da distribuição de carga e da geometria", "só da massa", "do nome"], a: 0, why: "Ligações polares podem se cancelar numa geometria simétrica, como no CO2." },
      { q: "A conservação da massa diz que...", options: ["a massa total dos reagentes é a dos produtos", "a massa some", "só vale para sólidos"], a: 0, why: "Em sistema fechado, os átomos se rearranjam mas não desaparecem." },
    ],
  },
};

for (const [continent, tiers] of Object.entries(EXTRA_QUESTIONS_14)) {
  for (const [tier, list] of Object.entries(tiers)) QUESTIONS[continent][tier].push(...list);
}

// Quarto lote: fecha a meta de 600 perguntas.
export const EXTRA_QUESTIONS_15 = {
  music: {
    1: [
      { q: "Uma nota musical é...", options: ["um som com altura definida", "um ritmo", "um silêncio"], a: 0, why: "A nota tem frequência reconhecível. Ruído não tem altura definida." },
      { q: "Ritmo é...", options: ["a organização das durações", "a altura das notas", "o timbre"], a: 0, why: "O ritmo distribui sons e silêncios no tempo, com pulso e acentuação." },
      { q: "Melodia é...", options: ["uma sequência de notas", "um acorde", "um instrumento"], a: 0, why: "É a linha horizontal, percebida como ideia musical." },
      { q: "Um violão comum tem...", options: ["seis cordas", "quatro cordas", "doze cordas"], a: 0, why: "O violão clássico tem seis. O baixo tem quatro e a guitarra pode ter seis." },
      { q: "Um refrão é...", options: ["a parte que se repete", "o início instrumental", "o solo"], a: 0, why: "Ele volta com a mesma letra ou melodia e ancora a forma." },
      { q: "Afinação é...", options: ["ajustar as alturas ao padrão", "aumentar o volume", "mudar o ritmo"], a: 0, why: "Cada corda ou tubo é ajustado para a frequência de referência." },
    ],
    2: [
      { q: "Uma terça é um intervalo de...", options: ["três graus", "duas oitavas", "um semitom"], a: 0, why: "De Dó a Mi há três graus. Pode ser maior ou menor." },
      { q: "Uma tríade é um acorde de...", options: ["três notas", "duas notas", "quatro notas"], a: 0, why: "Tônica, terça e quinta. A sétima forma acordes de quatro notas." },
      { q: "Compasso composto tem...", options: ["subdivisão ternária", "só dois tempos", "subdivisão binária"], a: 0, why: "6/8, 9/8 e 12/8 dividem cada tempo em três." },
      { q: "O que é uma anacruse?", options: ["Nota ou notas antes do primeiro tempo forte", "Uma pausa no fim", "Um acorde de três notas"], a: 0, why: "A anacruse prepara a entrada do compasso e não conta como tempo forte." },
      { q: "A escala cromática tem...", options: ["doze semitons", "sete notas", "cinco notas"], a: 0, why: "Percorre todas as teclas dentro de uma oitava, sem pular semitons." },
      { q: "Dinâmica musical é...", options: ["a variação de intensidade", "a altura", "o timbre"], a: 0, why: "Forte e piano são dinâmicas. Não mudam a nota, mudam o volume." },
    ],
    3: [
      { q: "Uma nona é...", options: ["uma extensão de acorde além da oitava", "um intervalo de dois semitons", "um ritmo"], a: 0, why: "Acordes de jazz e bossa usam nonas, décimas primeiras e décimas terceiras." },
      { q: "Baixo cifrado é...", options: ["uma notação de harmonia com números sobre o baixo", "um instrumento", "uma escala"], a: 0, why: "Os números indicam intervalos acima da nota do baixo, típicos do barroco." },
      { q: "Imitação em contraponto é...", options: ["repetir um motivo em outra voz", "tocar mais forte", "mudar o timbre"], a: 0, why: "A segunda voz retoma a ideia, às vezes transposta ou invertida." },
      { q: "Modulação diatônica é...", options: ["mudança para um tom próximo", "volta à tônica", "mudança de instrumento"], a: 0, why: "Geralmente para a dominante ou relativa, com acordes comuns aos dois tons." },
      { q: "Uma obra cíclica...", options: ["faz temas voltarem em movimentos diferentes", "não tem forma", "é sempre improvisada"], a: 0, why: "O retorno do tema une os movimentos, como na Sinfonia Fantástica." },
      { q: "Ruído branco tem...", options: ["energia parecida em todas as frequências", "só uma frequência", "volume zero"], a: 0, why: "O espectro é plano. Ruído rosa distribui a energia de outro jeito." },
    ],
  },
  ai: {
    1: [
      { q: "Inteligência artificial é...", options: ["um campo que constrói sistemas para tarefas cognitivas", "um único algoritmo", "um banco de dados"], a: 0, why: "O campo inclui busca, aprendizado, visão, linguagem e planejamento." },
      { q: "Um algoritmo de busca serve para...", options: ["explorar opções até encontrar uma solução", "compactar dados", "desenhar imagens"], a: 0, why: "Pode ser cego, heurístico ou informado, conforme usa informação do problema." },
      { q: "Um assistente virtual é...", options: ["uma interface conversacional para tarefas", "um hardware", "um banco"], a: 0, why: "Ele interpreta pedidos e responde ou executa ações." },
      { q: "Reconhecimento de voz converte...", options: ["fala em texto", "texto em fala", "imagem em texto"], a: 0, why: "Texto para fala é síntese. Imagem para texto é OCR ou legenda." },
      { q: "Tradução automática...", options: ["converte texto entre idiomas", "resume", "classifica"], a: 0, why: "Modelos neurais aprendem correspondências entre línguas a partir de pares de frases." },
      { q: "Dado estruturado está...", options: ["organizado em tabelas ou esquemas", "em texto livre", "em áudio"], a: 0, why: "Colunas e tipos definidos facilitam consulta e treino." },
    ],
    2: [
      { q: "Validação cruzada...", options: ["divide os dados em dobras para avaliar", "aumenta o modelo", "apaga outliers"], a: 0, why: "Cada dobra serve de teste enquanto as outras treinam, reduzindo a dependência de uma divisão." },
      { q: "Acurácia mede...", options: ["a proporção de acertos", "a velocidade", "a memória"], a: 0, why: "Pode enganar em classes desbalanceadas; precisão e recall complementam." },
      { q: "Regressão prevê...", options: ["um número", "uma classe", "um texto"], a: 0, why: "Classificação prevê categoria; regressão prevê valor contínuo." },
      { q: "Classificação binária tem...", options: ["duas classes", "dez classes", "nenhuma classe"], a: 0, why: "Sim ou não, spam ou não. Multiclassa tem três ou mais." },
      { q: "Engenharia de features é...", options: ["criar variáveis úteis para o modelo", "apagar colunas", "trocar a GPU"], a: 0, why: "Boas features carregam informação que o modelo consegue usar." },
      { q: "Um pipeline de ML organiza...", options: ["as etapas de dados, treino e avaliação", "só o deploy", "só a coleta"], a: 0, why: "Repetir as mesmas etapas de forma consistente evita vazamento e erro manual." },
    ],
    3: [
      { q: "Regularização L2...", options: ["penaliza a soma dos quadrados dos pesos", "remove dados", "aumenta a taxa"], a: 0, why: "Pesos grandes são desencorajados, o que suaviza o modelo e reduz overfitting." },
      { q: "Um autoencoder aprende...", options: ["uma representação comprimida dos dados", "a classificar apenas", "a gerar rótulos"], a: 0, why: "Ele reconstrói a entrada a partir de um gargalo, forçando uma representação útil." },
      { q: "Aprendizado auto-supervisionado...", options: ["cria o alvo a partir dos próprios dados", "usa rótulos humanos", "só usa reforço"], a: 0, why: "Prever a próxima palavra ou completar uma parte são tarefas auto-supervisionadas." },
      { q: "Destilação de modelo...", options: ["treina um modelo menor para imitar o maior", "apaga o modelo", "aumenta camadas"], a: 0, why: "O aluno aprende as saídas do professor e fica mais leve para servir." },
      { q: "Busca em feixe mantém...", options: ["as k melhores hipóteses a cada passo", "só uma hipótese", "todas as hipóteses"], a: 0, why: "É um meio-termo entre guloso e exaustivo, comum em tradução." },
      { q: "Calibração de probabilidade verifica...", options: ["se a confiança corresponde à frequência de acerto", "a velocidade", "o tamanho"], a: 0, why: "Um modelo calibrado que diz 80% deve acertar cerca de 80% desses casos." },
    ],
  },
  lingua: {
    1: [
      { q: "Um verbo indica...", options: ["ação ou estado", "nome", "qualidade"], a: 0, why: "Correr é ação; ser é estado. Substantivo nomeia e adjetivo qualifica." },
      { q: "Uma sílaba é...", options: ["uma unidade sonora com vogal", "uma palavra", "uma frase"], a: 0, why: "A vogal é o núcleo. Consoantes se agrupam em torno dela." },
      { q: "O artigo indefinido é...", options: ["um, uma", "o, a", "este, esta"], a: 0, why: "Indefinido generaliza; definido especifica." },
      { q: "Rima é...", options: ["semelhança de som no fim ou interior do verso", "repetição de palavra", "pausa"], a: 0, why: "Pode ser consoante ou toante, conforme os sons que coincidem." },
      { q: "Um parágrafo organiza...", options: ["um bloco de ideias", "uma sílaba", "uma letra"], a: 0, why: "Cada parágrafo desenvolve uma unidade e ajuda o leitor a acompanhar." },
      { q: "Um título...", options: ["nomeia e orienta a leitura", "encerra o texto", "substitui o primeiro parágrafo"], a: 0, why: "Ele antecipa o assunto e ajuda a decidir se vale ler." },
    ],
    2: [
      { q: "Sujeito composto tem...", options: ["mais de um núcleo", "um núcleo", "nenhum núcleo"], a: 0, why: "João e Maria chegaram: dois núcleos. O verbo fica no plural." },
      { q: "Verbo transitivo é...", options: ["o que precisa de complemento", "o que não precisa", "o que é sempre impessoal"], a: 0, why: "Transitivo direto pede objeto direto; indireto pede preposição." },
      { q: "Oração subordinada é...", options: ["a que exerce função na principal", "a independente", "a sem verbo"], a: 0, why: "Ela completa, qualifica ou indica circunstância da oração principal." },
      { q: "Um conectivo...", options: ["liga ideias e estabelece relação", "nomeia objetos", "marca plural"], a: 0, why: "E, mas, porque e portanto indicam adição, oposição, causa e conclusão." },
      { q: "Uma comparação...", options: ["aproxima dois termos com como", "substitui um termo", "exagera"], a: 0, why: "A metáfora dispensa o como; a comparação explicita a semelhança." },
      { q: "Texto injuntivo...", options: ["instrui ou orienta", "narra", "argumenta"], a: 0, why: "Receitas e manuais são injuntivos: dizem o que fazer." },
    ],
    3: [
      { q: "Coordenação ocorre entre orações...", options: ["independentes", "dependentes", "sem verbo"], a: 0, why: "Nenhuma exerce função na outra; podem ser ligadas por conjunção." },
      { q: "Regência verbal estuda...", options: ["a relação entre verbo e complemento", "a acentuação", "a pontuação"], a: 0, why: "Define se o complemento pede preposição e qual." },
      { q: "Concordância nominal...", options: ["faz adjetivo e artigo acompanharem o substantivo", "concorda o verbo com o sujeito", "marca o plural"], a: 0, why: "É a harmonia de gênero e número dentro do grupo nominal." },
      { q: "Coesão referencial...", options: ["retoma termos por pronome, sinônimo ou elipse", "usa só conectivos", "marca parágrafos"], a: 0, why: "Ela mantém o fio do texto sem repetir sempre a mesma palavra." },
      { q: "Argumento de causa e consequência...", options: ["liga um fato ao efeito dele", "cita autoridade", "compara casos"], a: 0, why: "A força depende de mostrar que a causa realmente produz o efeito." },
      { q: "Intertextualidade implícita...", options: ["referencia outro texto sem citar", "copia com aspas", "resume"], a: 0, why: "A paródia e a alusão exigem que o leitor reconheça a obra de origem." },
    ],
  },
};

for (const [continent, tiers] of Object.entries(EXTRA_QUESTIONS_15)) {
  for (const [tier, list] of Object.entries(tiers)) QUESTIONS[continent][tier].push(...list);
}

// Seis perguntas de fecho para bater 600.
export const EXTRA_QUESTIONS_16 = {
  cs: {
    2: [
      { q: "Um vetor dinâmico é...", options: ["um array que cresce quando precisa", "uma lista ligada", "um banco de dados"], a: 0, why: "Ele guarda em bloco contíguo e realoca quando enche, com custo amortizado." },
    ],
  },
  math: {
    3: [
      { q: "Um número transcendente é...", options: ["não é raiz de polinômio com coeficientes inteiros", "sempre racional", "sempre infinito"], a: 0, why: "π e e são transcendentes. Todo transcendente é irracional, mas nem todo irracional é transcendente." },
    ],
  },
  physics: {
    3: [
      { q: "Um fóton é...", options: ["o quantum de luz", "uma partícula com carga", "uma onda sonora"], a: 0, why: "É a unidade de energia da radiação eletromagnética, sem massa de repouso." },
    ],
  },
  chem: {
    2: [
      { q: "Um indicador redox muda de cor conforme...", options: ["o potencial de oxidação", "a temperatura", "a massa"], a: 0, why: "Ele alterna entre formas oxidadas e reduzidas com cores diferentes." },
    ],
  },
  music: {
    2: [
      { q: "Uma clave é...", options: ["um símbolo que fixa as alturas no pentagrama", "um acorde", "um andamento"], a: 0, why: "A clave de sol, fá ou dó define qual nota fica em cada linha." },
    ],
  },
  ai: {
    3: [
      { q: "Inferência é...", options: ["usar um modelo treinado para prever", "treinar o modelo", "coletar dados"], a: 0, why: "Treino ajusta pesos; inferência aplica o modelo a uma entrada nova." },
    ],
  },
};

for (const [continent, tiers] of Object.entries(EXTRA_QUESTIONS_16)) {
  for (const [tier, list] of Object.entries(tiers)) QUESTIONS[continent][tier].push(...list);
}

// Óptica: duas perguntas por dificuldade.
export const EXTRA_QUESTIONS_17 = {
  physics: {
    1: [
      { q: "No vácuo, a luz se propaga...", options: ["em linha reta", "em curva fechada", "parada"], a: 0, why: "Sem meio para desviar, o raio segue reto. A curvatura perto de massas enormes é da relatividade geral." },
      { q: "Um espelho plano forma uma imagem...", options: ["virtual, do mesmo tamanho", "real, invertida", "menor que o objeto"], a: 0, why: "A imagem fica atrás do espelho, direita e simétrica. Espelho côncavo pode formar imagem real." },
      { q: "A cor de um objeto depende...", options: ["da luz que ele reflete", "da luz que ele absorve toda", "do som ao redor"], a: 0, why: "O objeto absorve algumas frequências e reflete outras; o olho recebe as refletidas." },
    ],
    2: [
      { q: "A refração acontece quando a luz...", options: ["muda de meio e de velocidade", "bate e volta", "é absorvida"], a: 0, why: "A mudança de velocidade na fronteira desvia o raio, conforme Snell." },
      { q: "Uma lente divergente...", options: ["espalha raios paralelos", "junta raios num foco", "não desvia a luz"], a: 0, why: "A lente côncava espalha os raios. A convergente junta num foco." },
      { q: "A dispersão da luz branca no prisma acontece porque...", options: ["cada cor tem índice de refração diferente", "o prisma aquece a luz", "a luz perde energia"], a: 0, why: "O vidro desvia cada frequência de um jeito, separando o espectro." },
    ],
    3: [
      { q: "Interferência destrutiva ocorre quando duas ondas...", options: ["chegam em oposição de fase", "têm a mesma fase", "têm frequências zero"], a: 0, why: "Crista encontra vale e a amplitude resultante cai. Em fase, a interferência é construtiva." },
      { q: "Polarização mostra que a luz...", options: ["é uma onda transversal", "é longitudinal", "não é onda"], a: 0, why: "O campo elétrico oscila perpendicular à propagação. Filtros selecionam uma direção." },
    ],
  },
};

for (const [continent, tiers] of Object.entries(EXTRA_QUESTIONS_17)) {
  for (const [tier, list] of Object.entries(tiers)) QUESTIONS[continent][tier].push(...list);
}

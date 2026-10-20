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
  diapasao: { name: "Diapasão de Bolso", continent: "music", desc: "Um Lá de 440 Hz que cabe na mão e no ouvido." },
  partitura: { name: "Partitura Viva", continent: "music", desc: "Papel que se mexe quando ninguém está lendo." },
  metronomo: { name: "Metrônomo Quebrado", continent: "music", desc: "Marca o tempo certo com uma pequena hesitação humana." },
  cravo: { name: "Cravo Bem Temperado", continent: "music", relic: true, desc: "Um teclado em miniatura com doze teclas e infinitas discussões. Relíquia: +5 de vida máxima." },
  harmonico: { name: "Harmônico Solto", continent: "music", desc: "Um múltiplo da fundamental que se soltou e vive procurando o nó." },
  tubo: { name: "Tubo de Órgão", continent: "music", desc: "Um cano que ressoa numa nota só. Sopre e ele responde." },
  membrana: { name: "Membrana de Tambor", continent: "music", desc: "Pele esticada que guarda o golpe e devolve em onda." },
  "pedra-helmholtz": { name: "Pedra de Helmholtz", continent: "music", relic: true, desc: "Uma esfera oca que ressoa quando o som certo chega. Relíquia: +5 de vida máxima." },
  peso: { name: "Peso Sináptico", continent: "ai", desc: "Um número pequeno que muda de valor toda vez que você aprende." },
  embedding: { name: "Vetor de Significado", continent: "ai", desc: "Uma seta que aponta para o lugar onde as palavras se parecem." },
  matriz: { name: "Matriz Esparsa", continent: "ai", desc: "Uma tabela cheia de zeros que aprendeu a guardar só o que importa." },
  caixa: { name: "Fragmento da Caixa Preta", continent: "ai", relic: true, desc: "Uma placa opaca com uma luz que pisca quando ninguém entende. Relíquia: +5 de vida máxima." },
  pixel: { name: "Pixel Teimoso", continent: "ai", desc: "O menor pedaço de imagem, com a cor que insiste em ficar." },
  borda: { name: "Borda Afiada", continent: "ai", desc: "Onde uma cor acaba e outra começa. É por aí que a máquina começa a enxergar." },
  kernel: { name: "Kernel de Bolso", continent: "ai", desc: "Uma matriz pequena que desliza pela imagem procurando padrão." },
  "pedra-marr": { name: "Pedra de Marr", continent: "ai", relic: true, desc: "Uma pedra com camadas de bordas gravadas. Relíquia: +5 de vida máxima." },
  pergaminho: { name: "Pergaminho Velho", continent: "lingua", desc: "Folha que guardou uma frase por tempo demais. A tinta ainda pega no dedo." },
  tinta: { name: "Tinta Ferrogálica", continent: "lingua", desc: "Escurece com o tempo. Escreve, mancha e não sai fácil." },
  letra: { name: "Letra Solta", continent: "lingua", desc: "Uma letra que se desprendeu da palavra e ainda procura o lugar dela." },
  camoes: { name: "Pedra de Camões", continent: "lingua", relic: true, desc: "Uma pedra com uma estrofe gasta pelo mar. Relíquia: +5 de vida máxima." },
  cobre: { name: "Cobre Enrolado", continent: "physics", desc: "Fio brilhante que conduz corrente e paciência." },
  bobina: { name: "Bobina de Cobre", continent: "physics", desc: "Espiral de fio que transforma movimento em corrente." },
  fusivel: { name: "Fusível Queimado", continent: "physics", desc: "Morreu para salvar o resto. Merece um lugar na mochila." },
  capacitor: { name: "Capacitor de Vidro", continent: "physics", desc: "Guarda carga por um instante e devolve de uma vez." },
  "pedra-faraday": { name: "Pedra de Faraday", continent: "physics", relic: true, desc: "Uma gaiola de metal em miniatura que afasta o barulho elétrico. Relíquia: +5 de vida máxima." },
  instrucao: { name: "Instrução Perdida", continent: "cs", desc: "Um pedaço de programa que se soltou no meio do ciclo." },
  registrador: { name: "Registrador Dourado", continent: "cs", desc: "Guarda um número inteiro e não deixa ninguém ler sem permissão." },
  barramento: { name: "Barramento Largo", continent: "cs", desc: "Fios paralelos por onde os dados viajam em fila." },
  "pedra-von-neumann": { name: "Pedra de Von Neumann", continent: "cs", relic: true, desc: "Um pequeno programa gravado em pedra. Relíquia: +5 de vida máxima." },
  limite: { name: "Limite de Bolso", continent: "math", desc: "Um valor que nunca chega, mas chega perto o bastante." },
  serie: { name: "Série Infinita", continent: "math", desc: "Uma soma que continua mesmo depois de você desistir." },
  epsilon: { name: "Épsilon de Vidro", continent: "math", desc: "Pequeno o suficiente para caber em qualquer tolerância." },
  "pedra-cauchy": { name: "Pedra de Cauchy", continent: "math", relic: true, desc: "Uma pedra que se aproxima da resposta sem nunca encostar. Relíquia: +5 de vida máxima." },
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
  "anel-bobina": { name: "Anel de Bobina", continent: "physics", slot: "ring", damage: 1, desc: "Uma espira de cobre no dedo. Gira o golpe junto com o campo." },
  "escudo-capacitor": { name: "Escudo de Capacitor", continent: "physics", slot: "shield", hp: 4, desc: "Segura a carga do golpe e devolve depois, devagar." },
  "manto-dieletrico": { name: "Manto Dielétrico", continent: "physics", slot: "armor", hp: 4, desc: "Tecido que não conduz. Bom para quem trabalha perto de corrente." },
  "anel-pipeline": { name: "Anel de Pipeline", continent: "cs", slot: "ring", damage: 1, desc: "Uma volta de fio que adianta a próxima etapa antes de a atual acabar." },
  "capuz-registrador": { name: "Capuz de Registrador", continent: "cs", slot: "helmet", hp: 3, desc: "Guarda a última ideia bem quentinha, pronta para o próximo ciclo." },
  "escudo-barramento": { name: "Escudo de Barramento", continent: "cs", slot: "shield", hp: 4, desc: "Largo e cheio de vias. Segura o impacto e distribui o resto." },
  "anel-serie": { name: "Anel de Série", continent: "math", slot: "ring", damage: 1, desc: "Uma soma infinita enrolada no dedo. Converge para um golpe." },
  "manto-limite": { name: "Manto de Limite", continent: "math", slot: "armor", hp: 4, desc: "Chega tão perto do corpo que quase é o corpo." },
  "escudo-delta": { name: "Escudo de Delta", continent: "math", slot: "shield", hp: 4, desc: "A tolerância que segura o golpe e ainda deixa passar o essencial." },
  "anel-sinapse": { name: "Anel de Sinapse", continent: "hub", slot: "ring", damage: 1, desc: "Um anel que lembra o último caminho. Relíquia de chefe da Computação." },
  "colar-constante": { name: "Colar da Constante", continent: "hub", slot: "necklace", hp: 5, desc: "A conta que não muda quando o mundo muda. Relíquia de chefe de Música." },
  "pernas-reforcadas": { name: "Perneiras de Cálculo", continent: "math", slot: "legs", hp: 3, desc: "Joelheiras de couro com fórmulas gravadas. Ajudam a subir a escada." },
  "botas-marcha": { name: "Botas de Marcha", continent: "physics", slot: "boots", hp: 2, desc: "Solado de borracha e mola de aço. O caminho parece menor." },
  "escudo-cristal": { name: "Escudo de Cristal", continent: "chem", slot: "shield", hp: 4, desc: "Uma lâmina de cristal de equilíbrio. Segura o golpe e devolve a cor." },
  "oculos-organicos": { name: "Óculos Orgânicos", continent: "chem", slot: "helmet", hp: 3, desc: "Lentes que enxergam a cadeia inteira, não só o carbono da ponta." },
  "jaleco-organico": { name: "Jaleco Orgânico", continent: "chem", slot: "armor", hp: 5, desc: "Tecido de fibra longa, feito de cadeias que aprenderam a não rasgar." },
  "colar-quiral": { name: "Colar Quiral", continent: "chem", slot: "necklace", hp: 5, desc: "Duas metades que só encaixam de um jeito. O golpe erra a mão." },
  "anel-harmonico": { name: "Anel Harmônico", continent: "music", slot: "ring", damage: 1, desc: "Quando o golpe encontra a frequência certa, o anel responde junto." },
  "manto-acustico": { name: "Manto Acústico", continent: "music", slot: "armor", hp: 4, desc: "Tecido que absorve o eco e deixa o corpo mais quieto." },
  "fones-eco": { name: "Fones do Eco", continent: "music", slot: "helmet", hp: 3, desc: "Auscultam o que vem antes de chegar. O susto perde a vantagem." },
  "lente-convolucao": { name: "Lente de Convolução", continent: "ai", slot: "helmet", hp: 3, desc: "Passeia pelo mundo procurando bordas. O detalhe aparece antes do susto." },
  "manto-pixels": { name: "Manto de Pixels", continent: "ai", slot: "armor", hp: 4, desc: "Coberto de quadradinhos que trocam de cor e confundem a mira." },
  "anel-detector": { name: "Anel Detector", continent: "ai", slot: "ring", damage: 1, desc: "Uma caixinha em volta do alvo. O golpe já sabe onde acertar." },
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
    ],
    3: [
      { q: "Qual oração é subordinada substantiva objetiva direta?", options: ["Espero que você venha.", "Quando chove, fico em casa.", "Ele corre como um atleta."], a: 0, why: "A oração completa o verbo esperar sem preposição, então é objeto direto do verbo." },
      { q: "Em “Entreguei o documento à diretora”, a crase é...", options: ["preposição a + artigo a", "acento de ênfase", "artigo definido"], a: 0, why: "Entregar a algo a alguém: a preposição encontra o artigo de a diretora e vira à." },
      { q: "Qual colocação pronominal segue a norma-padrão?", options: ["Me empresta o livro.", "Empresta-me o livro.", "Empresta me o livro."], a: 1, why: "Com verbo no início da fala, a próclise não cabe na norma-padrão: usa-se a ênclise, empresta-me." },
      { q: "“Chorei rios de lágrimas” é...", options: ["hipérbole", "eufemismo", "antítese"], a: 0, why: "Hipérbole é exagero proposital. Eufemismo suaviza e antítese opõe ideias." },
      { q: "Quem escreveu Dom Casmurro?", options: ["Machado de Assis", "José de Alencar", "Clarice Lispector"], a: 0, why: "Machado de Assis publicou Dom Casmurro em 1899. Capitu e Bentinho são personagens do romance." },
      { q: "Em “O povo elegeu o prefeito”, o predicado é...", options: ["verbal", "nominal", "verbo-nominal"], a: 0, why: "O núcleo do predicado é o verbo eleger, verbo significativo. Não há predicativo do sujeito." },
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

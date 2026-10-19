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
  1: { name: "fácil", stars: "★", hp: 2, xp: 10, damage: 2 },
  2: { name: "médio", stars: "★★", hp: 3, xp: 18, damage: 3 },
  3: { name: "difícil", stars: "★★★", hp: 3, xp: 30, damage: 4 },
  4: { name: "chefe", stars: "☠", hp: 4, xp: 60, damage: 6 },
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
  diapasao: { name: "Diapasão de Bolso", continent: "music", desc: "Um Lá de 440 Hz que cabe na mão e no ouvido." },
  partitura: { name: "Partitura Viva", continent: "music", desc: "Papel que se mexe quando ninguém está lendo." },
  metronomo: { name: "Metrônomo Quebrado", continent: "music", desc: "Marca o tempo certo com uma pequena hesitação humana." },
  cravo: { name: "Cravo Bem Temperado", continent: "music", relic: true, desc: "Um teclado em miniatura com doze teclas e infinitas discussões. Relíquia: +5 de vida máxima." },
  peso: { name: "Peso Sináptico", continent: "ai", desc: "Um número pequeno que muda de valor toda vez que você aprende." },
  embedding: { name: "Vetor de Significado", continent: "ai", desc: "Uma seta que aponta para o lugar onde as palavras se parecem." },
  matriz: { name: "Matriz Esparsa", continent: "ai", desc: "Uma tabela cheia de zeros que aprendeu a guardar só o que importa." },
  caixa: { name: "Fragmento da Caixa Preta", continent: "ai", relic: true, desc: "Uma placa opaca com uma luz que pisca quando ninguém entende. Relíquia: +5 de vida máxima." },
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
    ],
    2: [
      { q: "Em complemento de dois, o byte 11111111 representa qual número?", options: ["-1", "255", "-128"], a: 0, why: "Em complemento de dois, todos os bits em 1 valem -1. O 255 aparece se você ler como inteiro sem sinal." },
      { q: "Por que um algoritmo O(n log n) vence um O(n²) quando n cresce?", options: ["Porque tem menos constantes", "Porque cresce mais devagar", "Porque usa menos memória sempre"], a: 1, why: "Constantes importam para n pequeno, mas o termo que cresce mais devagar domina no limite." },
      { q: "A cache existe para quê?", options: ["Encurtar a distância entre CPU e memória", "Aumentar o clock", "Traduzir binário"], a: 0, why: "A cache guarda perto o que acabou de ser usado, evitando esperar a memória principal." },
    ],
    3: [
      { q: "Por que o problema da parada é indecidível?", options: ["Porque não cabe na memória", "Porque um programa geral se contradiz ao analisar a si mesmo", "Porque a CPU é finita"], a: 1, why: "Turing mostrou que um programa que decide se outro para pode ser alimentado com si mesmo e gerar uma contradição." },
      { q: "Duas chaves diferentes caem no mesmo balde de uma tabela hash. Isso é...", options: ["Uma colisão, tratada por encadeamento ou sondagem", "Um erro fatal", "Uma árvore"], a: 0, why: "Colisão é normal. O balde vira uma lista ou o algoritmo procura o próximo espaço livre." },
      { q: "O que a pergunta P versus NP quer dizer?", options: ["Se todo problema verificável rápido é resolvível rápido", "Se a luz é finita", "Se NP é indecidível"], a: 0, why: "Verificar uma solução pode ser fácil e encontrá-la difícil. A pergunta é se essas duas classes coincidem." },
    ],
  },
  math: {
    1: [
      { q: "Qual é o único número primo par?", options: ["1", "2", "4"], a: 1, why: "Só o 2 é primo e par. Qualquer outro par maior que 2 é divisível por 2." },
      { q: "A derivada de x² é...", options: ["2x", "x", "x³/3"], a: 0, why: "Pela regra do tombo, x² vira 2x. A integral de x² é x³/3." },
      { q: "A soma dos ângulos internos de um triângulo euclidiano é...", options: ["90°", "180°", "360°"], a: 1, why: "No plano, os três ângulos sempre somam 180°. Em geometrias curvas, isso muda." },
    ],
    2: [
      { q: "O teorema de Bayes atualiza o quê?", options: ["A média dos dados", "A probabilidade de uma hipótese diante da evidência", "O determinante"], a: 1, why: "Bayes combina a crença anterior com a verossimilhança da evidência para obter a crença posterior." },
      { q: "O limite de (1 + 1/n)ⁿ, com n tendendo ao infinito, é...", options: ["1", "e", "infinito"], a: 1, why: "Essa expressão é uma das definições do número e, aproximadamente 2,718." },
      { q: "Um número é divisível por 3 quando...", options: ["Termina em 3", "A soma dos algarismos é múltipla de 3", "É ímpar"], a: 1, why: "Como 10 deixa resto 1 na divisão por 3, cada algarismo contribui com seu próprio valor para o resto." },
    ],
    3: [
      { q: "O hotel de Hilbert mostra que...", options: ["Um infinito enumerável ainda comporta mais um", "Todo infinito é igual", "Infinito não pode ser contado"], a: 0, why: "Mova cada hóspede do quarto n para n+1 e o quarto 1 fica livre. Infinito mais um continua infinito." },
      { q: "O axioma da escolha é independente de ZF. Isso quer dizer que...", options: ["É falso", "Pode ser aceito ou negado sem contradizer ZF", "Não pode ser usado"], a: 1, why: "Independência significa que ZF não prova nem refuta o axioma: dá para construir mundos matemáticos com e sem ele." },
      { q: "O primeiro teorema de Gödel diz que, em sistemas fortes e consistentes...", options: ["Tudo é demonstrável", "Existem verdades não demonstráveis", "A aritmética é inconsistente"], a: 1, why: "Há sentenças verdadeiras que o sistema não consegue provar. Completude e consistência não cabem juntas nesse nível." },
    ],
  },
  physics: {
    1: [
      { q: "A unidade de força no SI é...", options: ["joule", "newton", "watt"], a: 1, why: "Força se mede em newton. Joule é energia e watt é potência." },
      { q: "A luz no vácuo viaja a cerca de...", options: ["300 km/s", "300 mil km/s", "3 mil km/s"], a: 1, why: "São aproximadamente 300.000 km/s, ou 3 × 10⁸ m/s." },
      { q: "Sem resistência do ar, uma pena e um martelo...", options: ["Caem juntos", "A pena cai primeiro", "O martelo cai primeiro"], a: 0, why: "A aceleração da gravidade é a mesma para os dois. A diferença cotidiana vem do ar." },
    ],
    2: [
      { q: "O momento linear total se conserva quando...", options: ["Não há força externa resultante", "Há atrito", "Há colisão inelástica"], a: 0, why: "Sem força externa resultante, o momento total não muda. Na colisão inelástica ele se conserva, mas a energia não." },
      { q: "Uma onda que muda de meio e de velocidade pode...", options: ["Refratar", "Desaparecer", "Virar partícula sempre"], a: 0, why: "A mudança de velocidade na fronteira desvia a frente de onda. É a refração." },
      { q: "Em um sistema isolado, a entropia tende a...", options: ["Aumentar", "Diminuir", "Ficar constante sempre"], a: 0, why: "A segunda lei diz que a entropia total de um sistema isolado não diminui. O aumento é a seta do tempo." },
    ],
    3: [
      { q: "No efeito fotoelétrico, aumentar a intensidade sem mudar a frequência...", options: ["Aumenta a energia de cada elétron", "Aumenta o número de elétrons emitidos", "Não muda nada"], a: 1, why: "A energia de cada fóton depende da frequência. Mais intensidade significa mais fótons, logo mais elétrons." },
      { q: "A relatividade restrita afirma que a velocidade da luz...", options: ["Depende do observador", "É a mesma para observadores inerciais", "Só vale no vácuo quente"], a: 1, why: "A invariância da luz é o postulado que obriga o tempo e o espaço a se ajustarem." },
      { q: "O teorema de Noether relaciona...", options: ["Simetrias e leis de conservação", "Calor e trabalho", "Massa e cor"], a: 0, why: "Cada simetria contínua gera uma quantidade conservada: translação gera momento, rotação gera momento angular." },
    ],
  },
  chem: {
    1: [
      { q: "A fórmula da água é...", options: ["H2O", "CO2", "O2"], a: 0, why: "Dois hidrogênios e um oxigênio. O CO2 é gás carbônico e O2 é oxigênio molecular." },
      { q: "pH 7, a 25 °C, é...", options: ["Ácido", "Neutro", "Básico"], a: 1, why: "A água pura tem pH 7. Abaixo disso é ácido, acima é básico." },
      { q: "O número atômico é a quantidade de...", options: ["Nêutrons", "Prótons", "Moléculas"], a: 1, why: "O número atômico é o número de prótons e define o elemento." },
    ],
    2: [
      { q: "Uma ligação covalente compartilha...", options: ["Elétrons", "Prótons", "Nêutrons"], a: 0, why: "Os átomos compartilham pares de elétrons. Prótons e nêutrons ficam no núcleo." },
      { q: "Um mol contém aproximadamente...", options: ["6,02 × 10²³ partículas", "10⁶ partículas", "3,14 partículas"], a: 0, why: "O número de Avogadro é 6,02 × 10²³. É a ponte entre a escala atômica e a escala de laboratório." },
      { q: "Ao aumentar a concentração de um reagente em equilíbrio, o sistema...", options: ["Desloca para os produtos", "Não muda", "Desloca para os reagentes"], a: 0, why: "Le Chatelier: o sistema consome parte do excesso, deslocando para o lado que usa aquele reagente." },
    ],
    3: [
      { q: "Uma variação negativa de energia livre de Gibbs indica...", options: ["Processo espontâneo", "Processo impossível", "Equilíbrio perfeito"], a: 0, why: "ΔG negativo significa que o processo pode ocorrer espontaneamente nas condições dadas." },
      { q: "Um catalisador acelera a reação porque...", options: ["Aumenta a temperatura", "Diminui a energia de ativação", "Muda o ΔG"], a: 1, why: "Ele abre um caminho com barreira menor. O equilíbrio não muda, só a velocidade de chegar nele." },
      { q: "O princípio de Le Chatelier diz que o sistema...", options: ["Resiste à perturbação e desloca o equilíbrio", "Ignora a perturbação", "Vira outro elemento"], a: 0, why: "Pressão, temperatura ou concentração alteram o equilíbrio numa direção que alivia a mudança." },
    ],
  },
  music: {
    1: [
      { q: "Uma oitava acima equivale a...", options: ["Dobrar a frequência", "Triplicar a frequência", "Somar 12 Hz"], a: 0, why: "Dobrar a frequência dá a mesma nota uma oitava acima. É a razão 2:1." },
      { q: "Uma oitava tem quantos semitons?", options: ["7", "12", "24"], a: 1, why: "A escala temperada divide a oitava em 12 semitons iguais." },
      { q: "Andamento é...", options: ["A altura da nota", "A velocidade da pulsação", "O timbre"], a: 1, why: "Andamento é o tempo: quantas pulsações por minuto. Altura é frequência e timbre é a cor do som." },
    ],
    2: [
      { q: "A quinta justa tem razão de frequência próxima de...", options: ["3:2", "2:1", "9:8"], a: 0, why: "A quinta justa é 3:2. A oitava é 2:1 e a segunda maior é 9:8." },
      { q: "A série harmônica é formada por...", options: ["Múltiplos inteiros da fundamental", "Ruído branco", "Apenas a fundamental"], a: 0, why: "Os harmônicos são 2f, 3f, 4f... e dão a identidade do timbre." },
      { q: "O temperamento igual divide a oitava em...", options: ["12 semitons iguais", "7 tons desiguais", "Razões pitagóricas"], a: 0, why: "Todos os semitons têm a mesma razão, o que permite modular para qualquer tom ao custo de pequenos desvios." },
    ],
    3: [
      { q: "Na música serial, o compositor organiza...", options: ["As doze notas em uma série", "Apenas acordes perfeitos", "Só o ritmo"], a: 0, why: "A série dodecafônica dá peso igual às doze notas e gera variações por inversão, retrogradação e transposição." },
      { q: "Fourier mostra que um som pode ser decomposto em...", options: ["Senos e cossenos", "Apenas ruído", "Acordes inteiros"], a: 0, why: "Qualquer sinal periódico é uma soma de senos e cossenos com frequências múltiplas." },
      { q: "Afinação pitagórica e temperamento igual diferem porque...", options: ["As razões puras não fecham a oitava em 12 passos iguais", "A pitagórica é mais nova", "O temperamento não usa oitavas"], a: 0, why: "Empilhar quintas puras nunca volta exatamente à mesma oitava. O temperamento igual distribui a diferença." },
    ],
  },
  ai: {
    1: [
      { q: "Um token em um modelo de linguagem é...", options: ["Um pedaço de texto", "Uma GPU", "Uma senha"], a: 0, why: "O texto é cortado em pedaços, palavras ou subpalavras, e cada pedaço vira um número." },
      { q: "Aprendizado supervisionado usa...", options: ["Dados com rótulos", "Só dados sem rótulos", "Nenhum dado"], a: 0, why: "O modelo aprende a partir de exemplos com resposta certa. Sem rótulo, é aprendizado não supervisionado." },
      { q: "Uma rede neural é feita de...", options: ["Camadas de neurônios artificiais", "Fios de cobre", "Transistores apenas"], a: 0, why: "São camadas de unidades simples conectadas por pesos ajustáveis." },
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
};

// Perguntas que puxam o assunto das salas do fundo da caverna: entram no
// baralho difícil de cada continente e o tema da sala as coloca na frente.
export const DEEP_QUESTIONS = {
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

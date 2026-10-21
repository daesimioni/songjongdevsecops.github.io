// As cavernas: cada área tem a sua descida, semeada pelo id do lugar, com o
// chefe, a fauna, a pedra e a paleta daquele ponto do vale. As sete capitais
// (uma por disciplina) são as cidades do fundo, alcançadas pela conurbação.

import { CATALOG_CONTENT } from "./catalog-gen.js";
import { AREA_ITEMS, BIOMES, FAUNA } from "./identity.js";

export const DUNGEON_LAYOUT = {
  width: 64,
  height: 48,
  rooms: [
    { id: "entrada", x: 26, y: 39, w: 12, h: 6, tier: 0, kind: "entrance" },
    { id: "a", x: 12, y: 31, w: 9, h: 7, tier: 1 },
    { id: "b", x: 27, y: 29, w: 11, h: 7, tier: 1 },
    { id: "c", x: 45, y: 31, w: 9, h: 7, tier: 2 },
    { id: "d", x: 12, y: 17, w: 9, h: 7, tier: 2 },
    { id: "e", x: 27, y: 16, w: 11, h: 7, tier: 3 },
    { id: "f", x: 45, y: 17, w: 9, h: 7, tier: 3 },
    { id: "cidade", x: 23, y: 2, w: 18, h: 10, tier: 3, kind: "city" },
    // dois braços laterais que fecham o labirinto em anel
    { id: "g", x: 2, y: 24, w: 8, h: 6, tier: 2 },
    { id: "h", x: 55, y: 24, w: 7, h: 6, tier: 3 },
  ],
  corridors: [
    ["entrada", "b"],
    ["b", "a"],
    ["b", "c"],
    ["a", "d"],
    ["c", "f"],
    ["d", "e"],
    ["e", "f"],
    ["e", "cidade"],
    ["d", "b"],
    // atalhos que fecham o labirinto em anel: dá para se perder, e dá para
    // voltar por outro caminho.
    ["a", "e"],
    ["c", "d"],
    ["a", "g"],
    ["d", "g"],
    ["f", "h"],
    ["c", "h"],
  ],
  bossRoom: "f",
};

const COMMON = {
  cs: {
    name: "Catacumbas do Silício",
    sub: "onde os fios antigos ainda pulsam",
    material: "ferro",
    tunnel: "elbow",
    equipment: ["chave-longa", "colete-malha", "colar-corrente"],
    shift: { a: [-2, 1], c: [2, -1], g: [1, 2] },
    boss: "O Compilador Ancestral",
    rooms: [
      ["Boca do Silício", "entrada"],
      ["Galeria dos Fios", "circuitos"],
      ["Salão dos Relés", "lógica"],
      ["Arquivo Morto", "memória"],
      ["Forja do Relógio", "tempo"],
      ["Câmara dos Algoritmos", "algoritmos"],
      ["Poço dos Dados", "dados"],
      ["Cidade do Núcleo", "cidade"],
      ["Sala dos Barramentos", "dados"],
      ["Cripta dos Periféricos", "memória"],
    ],
    monsters: ["Bit", "Laço", "Núcleo", "Cache", "Pilha", "Fio", "Relé", "Relógio", "Byte", "Nó", "Linha", "Barramento"],
    palette: { floor: "#173230", floor2: "#102522", wall: "#0a1719", wallTop: "#20423f", accent: "#61f4c0" },
  },
  math: {
    name: "Lavras do Infinito",
    sub: "corredores que não terminam na primeira volta",
    material: "veio",
    tunnel: "split",
    equipment: ["espada-prova", "manto-giz", "pernas-reforcadas", "anel-fractal"],
    shift: { b: [2, 1], d: [-2, -2], h: [-1, 2] },
    boss: "O Infinito Profundo",
    rooms: [
      ["Boca dos Números", "entrada"],
      ["Corredor dos Números Primos", "primos"],
      ["Sala dos Sólidos", "geometria"],
      ["Cripta dos Limites", "limites"],
      ["Poço do Infinito", "infinito"],
      ["Mercado dos Axiomas", "axiomas"],
      ["Torre dos Fractais", "fractais"],
      ["Cidade do Cálculo", "cidade"],
      ["Câmara dos Conjuntos", "axiomas"],
      ["Escada de Cantor", "infinito"],
    ],
    monsters: ["Fator", "Lema", "Axioma", "Delta", "Sigma", "Vértice", "Prova", "Limite", "Órbita", "Fractal"],
    palette: { floor: "#242044", floor2: "#191632", wall: "#100e24", wallTop: "#373066", accent: "#b48cff" },
  },
  physics: {
    name: "Cavernas do Campo",
    sub: "o calor, a luz e a queda moram aqui embaixo",
    material: "ferro",
    tunnel: "wide",
    equipment: ["cajado-luz", "lentes-prisma", "botas-marcha", "colar-inercia"],
    shift: { a: [2, 2], c: [-2, 2], e: [1, -1], h: [-2, 1] },
    boss: "O Observador Cego",
    rooms: [
      ["Fenda do Campo", "entrada"],
      ["Túnel do Pêndulo", "pêndulo"],
      ["Sala das Ondas", "ondas"],
      ["Forja do Calor", "calor"],
      ["Prisma Subterrâneo", "luz"],
      ["Observatório Cego", "órbita"],
      ["Poço Gravitacional", "gravidade"],
      ["Cidade das Órbitas", "cidade"],
      ["Câmara de Vácuo", "calor"],
      ["Poço de Kepler", "órbita"],
    ],
    monsters: ["Íon", "Vetor", "Quanta", "Fóton", "Pêndulo", "Entropia", "Massa", "Campo", "Órbita", "Prisma"],
    palette: { floor: "#33202a", floor2: "#261820", wall: "#170d13", wallTop: "#4a2c3b", accent: "#ff7aa8" },
  },
  chem: {
    name: "Minas do Reagente",
    sub: "um labirinto que muda de cor conforme o pH",
    material: "erva",
    tunnel: "cross",
    equipment: ["frasco-acido", "avental-alquimista", "escudo-cristal", "anel-equilibrio"],
    shift: { b: [-2, 2], d: [2, 1], g: [-1, -2] },
    boss: "O Catalisador",
    rooms: [
      ["Boca do Reagente", "entrada"],
      ["Galeria dos Elementos", "elementos"],
      ["Lago Ácido", "ácidos"],
      ["Forno de Ativação", "energia"],
      ["Câmara do Equilíbrio", "equilíbrio"],
      ["Mina de Cristais", "cristais"],
      ["Poço das Ligações", "ligações"],
      ["Cidade das Moléculas", "cidade"],
      ["Sala dos Isótopos", "elementos"],
      ["Cripta dos Polímeros", "ligações"],
    ],
    monsters: ["Átomo", "Mol", "Catalisador", "Elétron", "Próton", "Base", "Ácido", "Cristal", "Ligação", "Reagente"],
    palette: { floor: "#17301f", floor2: "#102318", wall: "#09160e", wallTop: "#245032", accent: "#7ee787" },
  },
  music: {
    name: "Conservatório Subterrâneo",
    sub: "a acústica das pedras guarda compassos antigos",
    material: "madeira",
    tunnel: "zigzag",
    equipment: ["batuta-maestro", "casaca-harmonia", "colar-ressonancia"],
    shift: { a: [-1, -2], c: [1, 2], e: [-2, 1] },
    boss: "A Dissonância",
    rooms: [
      ["Fenda Sonora", "entrada"],
      ["Corredor dos Compassos", "ritmo"],
      ["Sala dos Harmônicos", "harmonia"],
      ["Câmara do Silêncio", "silêncio"],
      ["Oficina dos Timbres", "timbre"],
      ["Poço das Razões", "razões"],
      ["Galeria das Escalas", "escalas"],
      ["Praça da Ópera", "cidade"],
      ["Sala dos Modos", "escalas"],
      ["Câmara da Reverberação", "timbre"],
    ],
    monsters: ["Compasso", "Acorde", "Harmônico", "Timbre", "Oitava", "Quinta", "Escala", "Síncope", "Ressonância", "Dissonância"],
    palette: { floor: "#332715", floor2: "#261d0f", wall: "#171009", wallTop: "#4e3b1e", accent: "#ffb26b" },
  },
  ai: {
    name: "Rede Profunda",
    sub: "túneis de dados e uma cidade que aprende sozinha",
    material: "veio",
    tunnel: "narrow",
    equipment: ["cajado-vetores", "capuz-dados", "anel-atencao"],
    shift: { b: [1, -2], d: [-2, 1], f: [2, -1] },
    boss: "A Caixa Preta",
    rooms: [
      ["Boca da Máquina", "entrada"],
      ["Túneis dos Dados", "dados"],
      ["Sala dos Pesos", "pesos"],
      ["Poço do Gradiente", "gradiente"],
      ["Câmara da Atenção", "atenção"],
      ["Mina de Vetores", "vetores"],
      ["Galeria dos Tokens", "tokens"],
      ["Cidade das Máquinas", "cidade"],
      ["Sala dos Hiperparâmetros", "pesos"],
      ["Cripta do Contexto", "atenção"],
    ],
    monsters: ["Token", "Perceptron", "Gradiente", "Peso", "Vetor", "Camada", "Atenção", "Época", "Ruído", "Caixa"],
    palette: { floor: "#122b3b", floor2: "#0c1f2b", wall: "#07131b", wallTop: "#204760", accent: "#6bd5ff" },
  },
  lingua: {
    name: "Grotas da Língua",
    sub: "onde as palavras se formam, se flexionam e se perdem",
    material: "tinta",
    tunnel: "split",
    equipment: ["pena-poeta", "sobretudo-pergaminho", "oculos-revisor", "anel-virgula"],
    shift: { a: [2, -1], c: [-2, 2], g: [1, -2] },
    boss: "O Latim Ancestral",
    rooms: [
      ["Boca da Língua", "entrada"],
      ["Galeria dos Fonemas", "fonemas"],
      ["Salão dos Verbos", "verbos"],
      ["Cripta da Crase", "crase"],
      ["Arquivo dos Acentos", "acentos"],
      ["Oficina das Frases", "sintaxe"],
      ["Torre dos Gêneros", "generos"],
      ["Praça da Gramática", "cidade"],
      ["Câmara da Pontuação", "pontuacao"],
      ["Poço do Latim", "etimologia"],
    ],
    monsters: ["Sílaba", "Verbo", "Fonema", "Acento", "Hífen", "Crase", "Sintaxe", "Metáfora", "Estrofe", "Rima", "Pontuação", "Concordância"],
    palette: { floor: "#3a2f22", floor2: "#2a2218", wall: "#1a140c", wallTop: "#57452e", accent: "#e8c07a" },
  },
  "physics-em": {
    continent: "physics",
    name: "Galerias do Eletromagneto",
    sub: "fios, campos e cargas dormindo na pedra",
    material: "cobre",
    tunnel: "cross",
    equipment: ["anel-bobina", "escudo-capacitor", "manto-dieletrico"],
    shift: { b: [-2, 2], d: [2, -1], h: [-1, 1] },
    boss: "O Eletromagneto",
    rooms: [
      ["Boca da Corrente", "entrada"],
      ["Sala das Cargas", "cargas"],
      ["Corredor da Indução", "indução"],
      ["Cripta do Capacitor", "capacitância"],
      ["Oficina das Bobinas", "bobinas"],
      ["Poço do Campo", "campo"],
      ["Torre de Maxwell", "ondas"],
      ["Praça da Corrente", "cidade"],
      ["Câmara dos Fusíveis", "resistência"],
      ["Galeria do Ímã", "magnetismo"],
    ],
    monsters: ["Ímã", "Bobina", "Capacitor", "Resistor", "Fusível", "Corrente", "Faísca", "Campo", "Carga", "Onda", "Voltagem"],
    palette: { floor: "#3a2a20", floor2: "#2a1e16", wall: "#1a120c", wallTop: "#5a3f2c", accent: "#ffb26b" },
  },
  "cs-arch": {
    continent: "cs",
    name: "Galeria das Instruções",
    sub: "um processador antigo que ainda tenta terminar o ciclo",
    material: "ferro",
    tunnel: "wide",
    equipment: ["anel-pipeline", "capuz-registrador", "escudo-barramento"],
    shift: { a: [2, 1], c: [-2, -1], g: [1, 2] },
    boss: "O Von Neumann",
    rooms: [
      ["Boca da Instrução", "entrada"],
      ["Sala dos Registradores", "registradores"],
      ["Corredor do Pipeline", "pipeline"],
      ["Cripta do Cache", "cache"],
      ["Oficina da ULA", "ula"],
      ["Poço dos Endereços", "endereços"],
      ["Torre do Clock", "clock"],
      ["Praça da Arquitetura", "cidade"],
      ["Câmara dos Desvios", "desvios"],
      ["Arquivo de Memória", "memória"],
    ],
    monsters: ["Instrução", "Registrador", "Pipeline", "ULA", "Cache", "Barramento", "Clock", "Endereço", "Desvio", "Memória", "Salto"],
    palette: { floor: "#143330", floor2: "#0e2523", wall: "#081716", wallTop: "#1e4a44", accent: "#61f4c0" },
  },
  "math-analysis": {
    continent: "math",
    name: "Vale dos Limites",
    sub: "onde toda soma infinita tenta chegar a algum lugar",
    material: "veio",
    tunnel: "narrow",
    equipment: ["anel-serie", "manto-limite", "escudo-delta"],
    shift: { b: [-2, 1], e: [2, -1], h: [-1, -2] },
    boss: "O Limite Silencioso",
    rooms: [
      ["Boca da Sequência", "entrada"],
      ["Sala dos Épsilons", "épsilon"],
      ["Corredor das Séries", "séries"],
      ["Cripta da Convergência", "convergência"],
      ["Oficina das Derivadas", "derivadas"],
      ["Poço das Integrais", "integrais"],
      ["Torre de Cauchy", "cauchy"],
      ["Praça da Análise", "cidade"],
      ["Câmara do Delta", "delta"],
      ["Galeria do Infinito", "infinito"],
    ],
    monsters: ["Sequência", "Série", "Épsilon", "Delta", "Derivada", "Integral", "Convergência", "Divergência", "Cauchy", "Continuidade", "Limite"],
    palette: { floor: "#2c2440", floor2: "#1f1930", wall: "#120f1e", wallTop: "#413463", accent: "#c9a4ff" },
  },
  "chem-organic": {
    continent: "chem",
    name: "Bosque do Carbono",
    sub: "onde as cadeias crescem e se enrolam sozinhas",
    material: "erva",
    tunnel: "zigzag",
    equipment: ["oculos-organicos", "jaleco-organico", "colar-quiral"],
    shift: { a: [-1, 2], c: [2, -1], h: [1, 1] },
    boss: "O Carbono Quiral",
    rooms: [
      ["Clareira do Carbono", "entrada"],
      ["Galho das Ligações", "ligações"],
      ["Trilha das Cadeias", "cadeias"],
      ["Cripta dos Aromáticos", "aromáticos"],
      ["Oficina dos Álcoois", "álcoois"],
      ["Poço dos Ácidos", "ácidos"],
      ["Torre dos Polímeros", "polímeros"],
      ["Praça da Vida", "cidade"],
      ["Câmara dos Isômeros", "isômeros"],
      ["Bosque da Quiralidade", "quiralidade"],
    ],
    monsters: ["Carbono", "Cadeia", "Eteno", "Benzeno", "Álcool", "Cetona", "Éster", "Polímero", "Isômero", "Quiral", "Amida"],
    palette: { floor: "#1c3322", floor2: "#14261a", wall: "#0a1710", wallTop: "#2c4f34", accent: "#7ee787" },
  },
  "music-acoustics": {
    continent: "music",
    name: "Câmara dos Ecos",
    sub: "uma sala que devolve cada som com um pouco de atraso",
    material: "madeira",
    tunnel: "cross",
    equipment: ["anel-harmonico", "manto-acustico", "fones-eco"],
    shift: { b: [2, -1], d: [-1, 2], g: [2, 1] },
    boss: "O Eco Profundo",
    rooms: [
      ["Boca do Eco", "entrada"],
      ["Sala da Ressonância", "ressonância"],
      ["Corredor dos Harmônicos", "harmônicos"],
      ["Oficina dos Tubos", "tubos"],
      ["Cripta das Cordas", "cordas"],
      ["Poço das Membranas", "membranas"],
      ["Torre do Silêncio", "anecoica"],
      ["Praça dos Ecos", "cidade"],
      ["Câmara dos Batimentos", "batimentos"],
      ["Galeria do Decaimento", "decaimento"],
    ],
    monsters: ["Ressonância", "Harmônico", "Eco", "Tubo", "Corda", "Membrana", "Nó", "Ventre", "Batimento", "Timbre", "Decaimento"],
    palette: { floor: "#332a1c", floor2: "#261f14", wall: "#17110a", wallTop: "#4e3f2c", accent: "#ffb26b" },
  },
  "ai-vision": {
    continent: "ai",
    name: "Câmara Escura",
    sub: "a imagem entra pelo buraco e sai como número",
    material: "veio",
    tunnel: "narrow",
    equipment: ["lente-convolucao", "manto-pixels", "anel-detector"],
    shift: { b: [-2, 2], d: [2, -1], h: [-1, 1] },
    boss: "A Alucinação",
    rooms: [
      ["Boca da Imagem", "entrada"],
      ["Sala dos Pixels", "pixels"],
      ["Corredor das Bordas", "bordas"],
      ["Oficina dos Kernels", "convolução"],
      ["Cripta do Pooling", "pooling"],
      ["Poço das Features", "features"],
      ["Torre da Classificação", "classificação"],
      ["Praça da Detecção", "cidade"],
      ["Câmara da Segmentação", "segmentação"],
      ["Galeria das Alucinações", "alucinação"],
    ],
    monsters: ["Pixel", "Borda", "Filtro", "Kernel", "Pooling", "Feature", "Classe", "Caixa", "Rosto", "Ruído", "Alucinação"],
    palette: { floor: "#132b3a", floor2: "#0d1f2a", wall: "#07131a", wallTop: "#204a5f", accent: "#6bd5ff" },
  },
  "lingua-literature": {
    continent: "lingua",
    name: "Biblioteca das Vozes",
    sub: "cada corredor conta a mesma história de um jeito",
    material: "tinta",
    tunnel: "split",
    equipment: ["caneta-narrativa", "casaco-personagem", "oculos-narrador"],
    shift: { a: [1, 2], c: [-2, -1], g: [-1, 2] },
    boss: "O Narrador Não Confiável",
    rooms: [
      ["Boca da História", "entrada"],
      ["Sala do Narrador", "narrador"],
      ["Corredor do Foco", "foco"],
      ["Cripta do Tempo", "tempo"],
      ["Oficina dos Versos", "versos"],
      ["Poço da Métrica", "métrica"],
      ["Torre das Rimas", "rimas"],
      ["Praça das Personagens", "cidade"],
      ["Câmara do Intertexto", "intertexto"],
      ["Galeria do Silêncio", "silêncio"],
    ],
    monsters: ["Verso", "Estrofe", "Narrador", "Capitu", "Rima", "Metáfora", "Personagem", "Foco", "Tempo", "Voz", "Silêncio"],
    palette: { floor: "#33291d", floor2: "#261e15", wall: "#17110b", wallTop: "#503f2b", accent: "#e8c07a" },
  },
  "cs-net": {
    continent: "cs",
    name: "Malha dos Pacotes",
    sub: "cada corredor entrega a mensagem por um caminho diferente",
    material: "ferro",
    tunnel: "wide",
    equipment: ["anel-roteador", "manto-malha", "capuz-latencia"],
    shift: { a: [2, -1], c: [-1, 2], h: [1, -2] },
    boss: "O Roteador Antigo",
    rooms: [
      ["Boca da Malha", "entrada"],
      ["Sala dos Pacotes", "pacotes"],
      ["Corredor das Camadas", "camadas"],
      ["Cripta dos Endereços", "endereços"],
      ["Oficina do Roteamento", "roteamento"],
      ["Poço do TCP", "transporte"],
      ["Torre do DNS", "nomes"],
      ["Praça das Redes", "cidade"],
      ["Câmara do Congestionamento", "congestionamento"],
      ["Galeria do Firewall", "segurança"],
    ],
    monsters: ["Pacote", "Datagrama", "Roteador", "Switch", "Porta", "Máscara", "Handshake", "Timeout", "Firewall", "Ping", "Congestão"],
    palette: { floor: "#16302c", floor2: "#102420", wall: "#081715", wallTop: "#21463f", accent: "#61f4c0" },
  },
  "physics-thermo": {
    continent: "physics",
    name: "Fornalha do Ciclo",
    sub: "calor entra, trabalho sai, e nem tudo volta",
    material: "ferro",
    tunnel: "elbow",
    equipment: ["anel-carnot", "manto-termico", "capuz-entropia"],
    shift: { b: [2, 1], d: [-2, -2], g: [1, 1] },
    boss: "O Motor Perfeito",
    rooms: [
      ["Boca da Fornalha", "entrada"],
      ["Sala do Calor", "calor"],
      ["Corredor da Entropia", "entropia"],
      ["Cripta do Ciclo", "ciclos"],
      ["Oficina das Máquinas", "trabalho"],
      ["Poço da Pressão", "pressão"],
      ["Torre de Carnot", "rendimento"],
      ["Praça da Termodinâmica", "cidade"],
      ["Câmara do Equilíbrio", "equilíbrio"],
      ["Galeria do Frio", "frio"],
    ],
    monsters: ["Calor", "Ciclo", "Entropia", "Vapor", "Pistão", "Pressão", "Turbina", "Gelo", "Motor", "Válvula", "Forno"],
    palette: { floor: "#33221f", floor2: "#261916", wall: "#170d0b", wallTop: "#4e302a", accent: "#ff7aa8" },
  },
  "chem-analytical": {
    continent: "chem",
    name: "Laboratório dos Vestígios",
    sub: "cada frasco guarda uma resposta pela metade",
    material: "erva",
    tunnel: "split",
    equipment: ["anel-analitico", "avental-analitico", "oculos-espectro"],
    shift: { a: [1, -2], c: [2, 1], h: [-1, 2] },
    boss: "O Reagente Puro",
    rooms: [
      ["Boca do Vestígio", "entrada"],
      ["Sala das Amostras", "amostras"],
      ["Corredor da Titulação", "titulação"],
      ["Cripta dos Indicadores", "indicadores"],
      ["Oficina da Cromatografia", "separação"],
      ["Poço do Espectro", "espectro"],
      ["Torre da Gravimetria", "medição"],
      ["Praça do Laboratório", "cidade"],
      ["Câmara dos Erros", "erro"],
      ["Galeria da Pureza", "pureza"],
    ],
    monsters: ["Amostra", "Titulante", "Espectro", "Indicador", "Precipitado", "Eluente", "Bureta", "Balança", "Impureza", "Vestígio", "Reagente"],
    palette: { floor: "#1b3324", floor2: "#14261b", wall: "#0a1710", wallTop: "#2e4f36", accent: "#7ee787" },
  },
  "music-form": {
    continent: "music",
    name: "Palácio das Formas",
    sub: "cada salão repete o mesmo motivo de um jeito novo",
    material: "madeira",
    tunnel: "zigzag",
    equipment: ["anel-forma", "manto-contraponto", "oculos-forma"],
    shift: { b: [-2, 1], e: [2, -1], g: [1, 2] },
    boss: "A Fuga Final",
    rooms: [
      ["Boca do Motivo", "entrada"],
      ["Sala da Forma", "forma"],
      ["Corredor das Variações", "variação"],
      ["Cripta da Sonata", "sonata"],
      ["Oficina do Contraponto", "contraponto"],
      ["Poço da Fuga", "fuga"],
      ["Torre da Cadência", "cadência"],
      ["Praça das Vozes", "cidade"],
      ["Câmara do Desenvolvimento", "desenvolvimento"],
      ["Galeria da Coda", "coda"],
    ],
    monsters: ["Motivo", "Tema", "Fuga", "Variação", "Sujeito", "Resposta", "Cadência", "Canon", "Coda", "Contraponto", "Episódio"],
    palette: { floor: "#33291d", floor2: "#261e15", wall: "#17110b", wallTop: "#503f2b", accent: "#ffb26b" },
  },
  "math-prob": {
    continent: "math",
    name: "Cassino do Acaso",
    sub: "cada mesa cobra uma aposta e mostra uma distribuição",
    material: "veio",
    tunnel: "cross",
    equipment: ["anel-probavel", "manto-amostra", "oculos-estatistica"],
    shift: { b: [2, 1], d: [-2, -1], h: [1, 2] },
    boss: "O Acaso",
    rooms: [
      ["Boca da Aposta", "entrada"],
      ["Sala da Probabilidade", "probabilidade"],
      ["Corredor da Esperança", "esperança"],
      ["Cripta da Variância", "variância"],
      ["Oficina das Amostras", "amostragem"],
      ["Poço de Bayes", "bayes"],
      ["Torre dos Grandes Números", "limites"],
      ["Praça do Cassino", "cidade"],
      ["Câmara dos Outliers", "outliers"],
      ["Galeria do Risco", "risco"],
    ],
    monsters: ["Dado", "Amostra", "Outlier", "Moeda", "Baralho", "Desvio", "Ruído", "Tendência", "Aposta", "Sorte", "Acaso"],
    palette: { floor: "#2c2440", floor2: "#1f1930", wall: "#120f1e", wallTop: "#413463", accent: "#b48cff" },
  },
  "ai-language": {
    continent: "ai",
    name: "Floresta dos Tokens",
    sub: "cada clareira prevê a próxima palavra",
    material: "veio",
    tunnel: "narrow",
    equipment: ["anel-contexto", "manto-tokens", "capuz-prompt"],
    shift: { a: [2, 2], c: [-2, 2], g: [1, -1] },
    boss: "O Papagaio Estatístico",
    rooms: [
      ["Boca do Token", "entrada"],
      ["Sala do Prompt", "prompt"],
      ["Corredor do Contexto", "contexto"],
      ["Cripta da Atenção", "atenção"],
      ["Oficina dos Embeddings", "embeddings"],
      ["Poço da Predição", "predição"],
      ["Torre da Perplexidade", "perplexidade"],
      ["Praça da Linguagem", "cidade"],
      ["Câmara do Viés", "viés"],
      ["Galeria das Alucinações", "alucinação"],
    ],
    monsters: ["Token", "Prompt", "Contexto", "Atenção", "Embedding", "Perplexidade", "Viés", "Alucinação", "Corpus", "Gradiente", "Papagaio"],
    palette: { floor: "#122b3b", floor2: "#0c1f2b", wall: "#07131b", wallTop: "#204760", accent: "#6bd5ff" },
  },
  "lingua-semantics": {
    continent: "lingua",
    name: "Câmara dos Sentidos",
    sub: "a mesma frase pode querer dizer duas coisas",
    material: "tinta",
    tunnel: "split",
    equipment: ["anel-sentido", "manto-pragmatica", "oculos-ironia"],
    shift: { a: [-2, 1], c: [1, -2], g: [2, 2] },
    boss: "O Duplo Sentido",
    rooms: [
      ["Boca do Sentido", "entrada"],
      ["Sala da Referência", "referência"],
      ["Corredor dos Sinônimos", "sinonímia"],
      ["Cripta da Ambiguidade", "ambiguidade"],
      ["Oficina das Pressuposições", "pressuposição"],
      ["Poço das Implicaturas", "implicatura"],
      ["Torre dos Atos de Fala", "atos de fala"],
      ["Praça da Pragmática", "cidade"],
      ["Câmara da Ironia", "ironia"],
      ["Galeria do Contexto", "contexto"],
    ],
    monsters: ["Sentido", "Ironia", "Ambiguidade", "Referência", "Sinônimo", "Pressuposto", "Implicatura", "Metáfora", "Contexto", "Ato", "Duplo"],
    palette: { floor: "#33291d", floor2: "#261e15", wall: "#17110b", wallTop: "#503f2b", accent: "#e8c07a" },
  },
  "physics-optics": {
    continent: "physics",
    name: "Galeria do Prisma",
    sub: "a luz entra branca e sai em sete cores",
    material: "veio",
    tunnel: "split",
    equipment: ["oculos-optica", "manto-luz", "anel-foco"],
    shift: { b: [2, -2], e: [-1, 2], h: [2, 1] },
    boss: "O Espectro Branco",
    rooms: [
      ["Boca da Luz", "entrada"],
      ["Sala das Lentes", "lentes"],
      ["Corredor dos Espelhos", "reflexão"],
      ["Cripta da Refração", "refração"],
      ["Oficina da Dispersão", "dispersão"],
      ["Poço das Cores", "cores"],
      ["Torre do Espectro", "espectro"],
      ["Praça da Óptica", "cidade"],
      ["Câmara da Miragem", "miragem"],
      ["Galeria da Retina", "visão"],
    ],
    monsters: ["Reflexo", "Prisma", "Espectro", "Lente", "Raio", "Miragem", "Fóton", "Foco", "Cor", "Sombra", "Brilho"],
    palette: { floor: "#33202a", floor2: "#261820", wall: "#170d13", wallTop: "#4a2c3b", accent: "#ff7aa8" },
  },
  "cs-security": {
    continent: "cs",
    name: "Cofre dos Segredos",
    sub: "cada porta pede uma chave que você não pode mostrar",
    material: "ferro",
    tunnel: "narrow",
    equipment: ["anel-seguro", "manto-cifra", "capuz-chave"],
    shift: { a: [2, 2], c: [-1, -2], h: [2, -1] },
    boss: "A Chave Mestra",
    rooms: [
      ["Boca da Cifra", "entrada"],
      ["Sala das Chaves", "chaves"],
      ["Corredor do Hash", "hash"],
      ["Cripta da Assinatura", "assinatura"],
      ["Oficina do TLS", "tls"],
      ["Poço do Firewall", "firewall"],
      ["Torre das Senhas", "senhas"],
      ["Praça da Segurança", "cidade"],
      ["Câmara dos Segredos", "segredos"],
      ["Galeria do Cofre", "cofre"],
    ],
    monsters: ["Cifra", "Assinatura", "Firewall", "Chave", "Hash", "Salt", "Token", "Certificado", "Senha", "Cofre", "Ruído"],
    palette: { floor: "#16302c", floor2: "#102420", wall: "#081715", wallTop: "#21463f", accent: "#61f4c0" },
  },
};

// as cavernas do catálogo entram antes de virar lista
Object.assign(COMMON, CATALOG_CONTENT.dungeons);

export const DUNGEONS = Object.entries(COMMON).map(([key, d]) => {
  const continent = d.continent || key;
  // a planta vem do id da caverna: mesma regra de progressão, desenho diferente
  const planta = plantaDaCaverna(key);
  const nomes = d.rooms || [];
  const rooms = planta.rooms.map((room, i) => ({
    ...room,
    name: nomes[i]?.[0] || room.id,
    theme: nomes[i]?.[1] || room.id,
  }));
  return {
    id: `dungeon-${key}`,
    continent,
    ...d,
    rooms,
    layout: {
      width: planta.W,
      height: planta.H,
      rooms,
      corridors: planta.corridors,
      bossRoom: planta.bossRoom,
    },
    tunnel: d.tunnel || "elbow",
  };
});

// toda caverna usa a paleta, o material, o equipamento e a fauna da área
for (const d of DUNGEONS) {
  const areaId = d.id.replace(/^dungeon-/, "");
  const itens = AREA_ITEMS[areaId];
  const bioma = BIOMES[areaId];
  const fauna = FAUNA[areaId];
  if (!itens || !bioma || !fauna) continue;
  d.equipment = [itens.weapon.id, itens.armor.id, itens.helmet.id];
  d.palette = { floor: bioma.floor, floor2: bioma.base, wall: "#0b0d18", wallTop: bioma.path, accent: bioma.accent };
  d.fauna = fauna.map((f) => f.kind);
  d.faunaAccents = fauna.map((f) => f.accent);
  d.faunaNames = fauna.map((f) => f.name);
  d.material = bioma.material;
  d.bossAccent = bioma.accent;
}

// ---------------------------------------------------------------- quem vive
// A espécie e a cor de um bicho saem do nome e da disciplina, do mesmo jeito
// que a caverna o desenha. O bestiário lê daqui para não inventar um bicho
// diferente do que o jogador encontra lá embaixo.
// A forma do bicho vem do nome, não de um sorteio: "Ácido" vira frasco,
// "Acorde" vira nota, "Instrução" vira engrenagem. O nome carrega uma pista do
// que se espera, e a arte do duelo, do mapa e do bestiário segue essa pista.
// A ordem importa: o que é específico vem antes do que é genérico.
const FORMA_POR_PALAVRA = [
  [/\b(teorema|axioma|lema|prova|corolario|definicao|demonstracao|postulado|conjectura|paradoxo)(?:s|es)?\b/, "tome"],
  [/\b(livro|tomo|fabula|resenha|reportagem|redacao|relatorio|artigo|narrativa|personagem|narrador|estrofe|conto|cronica|roteiro|argumentacao|texto|leitura|literatura|historia|canon|capitu|comunicacao|producao|escrita|discurso|romance|poesia|poema|resumo|manual|norma|documentacao|certificado|referencia|bibliografia|antologia|ensaio|editorial|entrevista|teatro|cinema|midia|episodio)(?:s|es)?\b/, "tome"],
  [/\b(letra|silaba|fonema|acento|crase|hifen|pontuacao|sintaxe|concordancia|verbo|sujeito|sinonimo|metafora|rima|verso|gramatica|ortografia|lexico|terminologia|traducao|latim|lingua|fonetica|morfologia|semantica|pragmatica|implicatura|ambiguidade|pressuposto|refutacao|genero|regencia|colocacao|estilistica|prosodia|alofone|diccao|clareza|corpus|logica|proposicional|silogismo|sons da fala)(?:s|es)?\b/, "glyph"],
  [/\b(acorde|oitava|quinta|compasso|timbre|harmonico|ressonancia|dissonancia|sincope|cadencia|batimento|ritmo|melodia|semitom|afinacao|instrumento|orquestra|contraponto|coda|silencio|coral|cancao|partitura|clave|pausa|musica|frequencia|acustica|canon|fuga|motivo|repouso|pulso)(?:s|es)?\b/, "note"],
  [/\b(prisma|lente|espectro|reflexo|miragem|refracao|difracao|optica|foton|polarizacao)(?:s|es)?\b/, "prism"],
  [/\b(atom|atomos|atomica|eletron|proton|neutron|ion|molecula|ligacao|isomero|cetona|ester|amida|benzeno|eteno|carbono|quiral|reatividade|fissao|fusao|radio|orbital|valencia|estequiometria|eletroquimica|fisico-quimica|oxido|ozonio|carbonato|fertilizante|farmaceutica|bioquimica|proteina|enzima|fosforilacao|metabolismo|celula|composto|compostos|complexo|complexos)(?:s|es)?\b/, "atom"],
  [/\b(acido|reagente|solucao|eluente|titulante|precipitado|impureza|catalisador|cristalizacao|destilacao|extracao|solvente|frasco|bureta|erlenmeyer|bequer|indicador|eletrolise|equilibrio)(?:s|es)?\b/, "flask"],
  [/\b(membrana|membranas|micela|micelas|polimero|polimeros|gelatina|espuma|emulsao|bolha|bolhas|coloide|mucosa)(?:s|es)?\b/, "jelly"],
  [/\b(gosma|limo|lodo|pasta|cola|resina|celulose|mistura|conjunto|conjuntos|grupo|grupos|classe|classes|familia|familias|colecao|colecoes|populacao|enxame|matilha|rebanho)(?:s|es)?\b/, "slime"],
  [/\b(engrenagem|maquina|mecanismo|motor|turbina|pistao|roda|rotacao|relogio|clock|barramento|registrador|instrucao|pipeline|ula|processador|cpu|memoria|cache|disco|fusivel|resistor|capacitor|bobina|valvula|transistor|circuito|hardware|interruptor|switch|porta|fio|rele|bomba|forno|torno|alavanca|esteira|servidor|datacenter|infraestrutura|sensor|antena|pendulo|balanca)(?:s|es)?\b/, "gear"],
  [/\b(handshake|ping|timeout|pacote|datagrama|roteador|token|embedding|perceptron|peso|pesos|epoca|feature|pooling|multiagentes|nuvem|virtual|kernel|fila|filas|heaps|hash|logs|telemetria|consistencia|sincronizacao|armazenamento|banco|bancos|dataset|contexto|prompt|bit|byte|pixel|borda|caixa|classificacao|regressao|dado|dados|amostra|rede|redes|grafo|grafos|conexao|conexoes)(?:s|es)?\b/, "node"],
  [/\b(vetor|vetores|gradiente|direcao|deslocamento|seta|forca|forcas|momento|impulso|aceleracao|velocidade|autovalor|autovalores|autovetor|autovetores)(?:s|es)?\b/, "vector"],
  [/\b(olho|olhos|visao|atencao|foco|observa|vigia|percep|reconhecimento|outlier|vies)(?:s|es)?\b/, "eye"],
  [/\b(fogo|chama|faisca|luz|brilho|raio|energia|calor|plasma|quanta|vapor|estrela|sol|magma|entropia|carga|voltagem|corrente|magnetismo|ima|orbita|eletric)(?:s|es)?\b/, "wisp"],
  [/\b(pedra|rocha|golem|corpo|corpos|estrutura|estruturas|solido|solidos|material|materiais|massa|gravidade|dureza|metal|metais|ferro|aco|argila|muralha|monumento)(?:s|es)?\b/, "golem"],
  [/\b(teia|aranha|malha|trama|armadilha|entrelacamento|cobertura)(?:s|es)?\b/, "spider"],
  [/\b(linha|linhas|corda|cadeia|sequencia|sequencias|serie|series|curva|trajetoria|espiral|recursao|recorrencia|ciclo|ciclos|laco|loop|fluxo|limite|convergencia|divergencia|continuidade|funcao|funcoes|equacao|equacoes|tensor|campo|campos|onda|ondas|geodesica|derivada|integral|irracional|irracionais)(?:s|es)?\b/, "serpent"],
  [/\b(colonia|formiga|algoritmo|algoritmos|automato|automatos|processamento|execucao|procedimento|rotina|tarefa|tarefas|desvio|salto|passo)(?:s|es)?\b/, "ant"],
  [/\b(mariposa|borboleta|asa|asas|voo|navegacao|migracao|orientacao|padrao|padroes)(?:s|es)?\b/, "moth"],
  [/\b(morcego|sonar|noite|sombra|sombrio|eco|ecos)(?:s|es)?\b/, "bat"],
  [/\b(besouro|casco|concha|carapaca|elitro|arquivo|registro|acervo)(?:s|es)?\b/, "beetle"],
  [/\b(caranguejo|praia|litoral|pinca|defesa|porto)(?:s|es)?\b/, "crab"],
  [/\b(escorpiao|veneno|ferrao|toxina|peconha|pungente)(?:s|es)?\b/, "scorpion"],
  [/\b(duende|trapaca|erro|erros|equivoco|ironia|sorte|acaso|caos|mentira|ilusao|confusao|ruido|falha|bug|alucinacao|moeda|moedas|baralho|baralhos|aposta|apostas|tendencia|tendencias)(?:s|es)?\b/, "imp"],
  [/\b(sentinela|firewall|protocolo|senha|cifra|criptografia|seguranca|autenticacao|cofre|validacao|verificacao|teste|testes|chave|codigo)(?:s|es)?\b/, "sentinel"],
  [/\b(cristal|cristais|zeolita|zeolitas|mineral|minerais|simetria|topologia|variedade|variedades|geometria|fractal|vertice|vertices|poliedro|reticulado|estrutural|amorfo|amorfos|nano|nanomateriais|semiconductor)(?:s|es)?\b/, "crystal"],
];

// a disciplina decide quando o nome é abstrato demais para a palavra resolver
const FORMA_POR_DISCIPLINA = {
  math: [
    [/(topologia|topologico|topologicos|espacos topologicos)/, "spider"],
    [/(otimizacao|otimizacoes)/, "vector"],
    [/(conjunto|conjuntos|grupo|grupos|anel|aneis|classe|classes|familia|familias)/, "slime"],
  ],
  physics: [
    [/(turbina|pistao|motor|bobina|capacitor|resistor|valvula|transistor|circuito|ima|fusivel|pendulo|balanca|forno)/, "gear"],
    [/(mecanica|dinamica|hidrostatica|termodinamica)/, "golem"],
  ],
  chem: [
    [/(acido|base|reagente|solubilidade|solucao|titulante|precipitado|precipitacao|impureza|catalisador|eluente|indicador|equilibrio)/, "flask"],
  ],
  cs: [
    [/(firewall|senha|cifra|criptografia|seguranca|certificado|assinatura|autenticacao|cofre|verificacao|testes|protocolo)/, "sentinel"],
    [/(representacao|conhecimento|agente|agentes|aprendizado|reforco|recomendacao|recomendacoes|rede|redes|sistema|sistemas|banco|bancos|dados|nuvem|servidor|virtual|kernel|fila|filas|hash|logs|telemetria|arquitetura da informacao)/, "node"],
  ],
  ai: [
    [/(camada|camadas|sistema|sistemas|agentes|multiagentes|contexto|prompt|embedding|perceptron)/, "node"],
    [/(visao|atencao|percepcao|reconhecimento|imagem|imagens|rosto|classificacao)/, "eye"],
  ],
  lingua: [[/(familia|familias|classe|classes|conjunto|conjuntos)/, "glyph"]],
};

const FORMA_PADRAO = {
  math: "crystal", physics: "wisp", chem: "atom", cs: "gear", ai: "node", music: "note", lingua: "glyph",
};

const semAcento = (texto) => String(texto).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function creatureKind(def, name) {
  const n = semAcento(name);
  for (const [re, forma] of FORMA_POR_DISCIPLINA[def.continent] || []) {
    if (re.test(n)) return forma;
  }
  for (const [re, forma] of FORMA_POR_PALAVRA) {
    if (re.test(n)) return forma;
  }
  return FORMA_PADRAO[def.continent] || "slime";
}

// o accent continua vindo da identidade da área: o bicho pode mudar de forma
// com o nome, mas a cor da ilha permanece
function faunaIndex(def, name) {
  const alvo = String(name).toLowerCase();
  return (def.faunaNames || []).findIndex((nome) => nome.toLowerCase() === alvo);
}

function creatureSeed(name, k = 0) {
  return [...String(name)].reduce((sum, ch) => sum + ch.charCodeAt(0), 0) + k;
}

export function creatureAccent(def, name, k = 0) {
  const idx = faunaIndex(def, name);
  if (idx >= 0 && def.faunaAccents?.[idx]) return def.faunaAccents[idx];
  const accents = def.faunaAccents || [];
  return accents[creatureSeed(name, k) % accents.length] || def.palette?.accent || def.bossAccent || "#b48cff";
}

// o id carrega a caverna: sem isso, o bicho "a" de toda caverna de Física era
// o mesmo bicho, e matar um marcava o outro como morto
export function creatureId(def, roomId, k = 0) {
  return `dg-${def.id.replace(/^dungeon-/, "")}-${roomId}-m${k}`;
}

// A ficha que o bestiário mostra: os nomes que se repetem entre salas viram um
// bicho só, com todos os ids em que ele pode aparecer.
export function dungeonCreatures(def) {
  const porNome = new Map();
  const bossRoom = (def.layout || DUNGEON_LAYOUT).bossRoom;
  let n = 0;
  for (const room of def.rooms) {
    if (room.kind === "entrance" || room.kind === "city") continue;
    const nome = def.monsters[n % def.monsters.length] || "Coisa";
    n++;
    // a sala do chefe não tem bicho comum: o chefe fica sozinho para não
    // dividir a visão do jogador com outro bicho
    if (bossRoom && room.id === bossRoom) continue;
    const tier = Math.max(1, Math.min(3, Number(room.tier) || 1));
    const id = creatureId(def, room.id);
    const chave = nome.toLowerCase();
    const atual = porNome.get(chave);
    if (atual) {
      atual.ids.push(id);
      atual.salas.push(room.name);
    } else {
      porNome.set(chave, {
        id,
        ids: [id],
        nome,
        tipo: creatureKind(def, nome),
        tier,
        accent: creatureAccent(def, nome),
        chefe: false,
        salas: [room.name],
      });
    }
  }
  const bichos = [...porNome.values()];
  if (def.boss) {
    const sala = def.rooms.find((r) => r.id === (def.layout || DUNGEON_LAYOUT).bossRoom) || def.rooms[def.rooms.length - 2];
    bichos.push({
      id: `${def.id}-boss`,
      ids: [`${def.id}-boss`],
      nome: def.boss,
      tipo: "boss",
      tier: 4,
      accent: def.bossAccent || def.palette?.accent || "#ffc857",
      chefe: true,
      chave: def.id,
      salas: [sala?.name || "sala do chefe"],
    });
  }
  return bichos;
}

// ------------------------------------------------- planta da caverna
// As 93 cavernas já têm nome, tema, bichos, chefe e paleta próprios. O que
// faltava era o desenho do mapa: todas usavam a mesma planta de dez salas com
// pequenos deslocamentos. Agora a planta é semeada pelo id da caverna, então
// cada uma tem salas em lugares diferentes, com a mesma regra de progressão:
// perto da entrada o bicho é fraco, no fundo fica o chefe.
function sementeDe(texto) {
  let h = 2166136261;
  for (let i = 0; i < texto.length; i++) {
    h ^= texto.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function sorteador(semente) {
  let a = semente >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function plantaDaCaverna(chave) {
  const rnd = sorteador(sementeDe(chave));
  const W = 64;
  const H = 48;
  const centro = (r) => ({ x: r.x + Math.floor(r.w / 2), y: r.y + Math.floor(r.h / 2) });

  // entrada embaixo, em posição e largura sorteadas
  const entW = 10 + Math.floor(rnd() * 3);
  const entX = Math.max(2, Math.min(W - entW - 2, Math.round(W / 2 - entW / 2 + (rnd() * 12 - 6))));
  const entrada = { id: "entrada", kind: "entrance", x: entX, y: 38 + Math.floor(rnd() * 2), w: entW, h: 6, tier: 0 };

  // a cidade do fundo, no alto
  const cidW = 16 + Math.floor(rnd() * 5);
  const cidX = Math.max(2, Math.min(W - cidW - 2, Math.round(W / 2 - cidW / 2 + (rnd() * 8 - 4))));
  const cidade = { id: "cidade", kind: "city", x: cidX, y: 2, w: cidW, h: 10, tier: 3 };

  // seis salas em duas faixas de três colunas, tamanho e deslocamento sorteados
  const colunas = [15, 28, 41];
  const soltos = [];
  for (let banda = 0; banda < 2; banda++) {
    for (let c = 0; c < 3; c++) {
      soltos.push({
        x: colunas[c] + Math.floor(rnd() * 3),
        y: (banda === 0 ? 13 : 26) + Math.floor(rnd() * 4),
        w: 7 + Math.floor(rnd() * 4),
        h: 5 + Math.floor(rnd() * 3),
      });
    }
  }
  // o id vem da profundidade: "a" é a sala mais perto da entrada, "f" o fundo.
  // A tabela de tom por id mantém a progressão de dificuldade de antes.
  const distancia = (r) => Math.hypot(centro(r).x - centro(entrada).x, centro(r).y - centro(entrada).y);
  const ordem = [...soltos].sort((x, y) => distancia(x) - distancia(y));
  const TOM = { a: 1, b: 1, c: 2, d: 2, e: 3, f: 3 };
  const salas = ordem.map((s, i) => {
    const id = "abcdef"[i];
    return { id, x: s.x, y: s.y, w: s.w, h: s.h, tier: TOM[id] };
  });

  // braços laterais: um curto e barato, outro fundo e caro
  const g = { id: "g", x: 2, y: 20 + Math.floor(rnd() * 5), w: 8, h: 6, tier: 2 };
  const h = { id: "h", x: 54, y: 20 + Math.floor(rnd() * 5), w: 8, h: 6, tier: 3 };

  const rooms = [entrada, ...salas, cidade, g, h];
  const corridors = [
    ["entrada", "a"],
    ["a", "b"], ["b", "c"], ["c", "d"], ["d", "e"], ["e", "f"],
    ["f", "cidade"],
    ["b", "e"],
    ["a", "g"], ["c", "g"],
    ["e", "h"], ["f", "h"],
  ];
  return { W, H, rooms, corridors, bossRoom: "f" };
}

export function dungeonById(id) {
  if (!id) return null;
  return DUNGEONS.find((d) => d.id === id) || (id === CONURBATION.id ? CONURBATION : null);
}

// A camada -2: uma praça central sob o mar, com um portal para cada capital
// subterrânea. Não tem bicho nem chefe: é o nó que liga as cidades.
const HUB_ROOMS = [
  { id: "cidade", x: 22, y: 14, w: 20, h: 12, tier: 3, kind: "city", name: "Praça do Porto Submerso", theme: "cidade" },
  { id: "entrada", x: 28, y: 38, w: 8, h: 5, tier: 0, kind: "entrance", name: "Escada do Porto Submerso", theme: "entrada" },
  { id: "cs", x: 4, y: 6, w: 8, h: 6, tier: 1, name: "Portal da Computação", theme: "computação" },
  { id: "math", x: 26, y: 2, w: 12, h: 6, tier: 1, name: "Portal da Matemática", theme: "matemática" },
  { id: "physics", x: 52, y: 6, w: 8, h: 6, tier: 1, name: "Portal da Física", theme: "física" },
  { id: "chem", x: 54, y: 22, w: 8, h: 6, tier: 1, name: "Portal da Química", theme: "química" },
  { id: "music", x: 52, y: 36, w: 8, h: 6, tier: 1, name: "Portal da Música", theme: "música" },
  { id: "ai", x: 4, y: 34, w: 8, h: 6, tier: 1, name: "Portal da IA", theme: "ia" },
  { id: "lingua", x: 4, y: 20, w: 8, h: 6, tier: 1, name: "Portal da Língua", theme: "língua" },
];
const HUB_CORRIDORS = [
  ["cidade", "cs"], ["cidade", "math"], ["cidade", "physics"],
  ["cidade", "chem"], ["cidade", "music"], ["cidade", "ai"],
  ["cidade", "lingua"], ["cidade", "entrada"],
];

export const CONURBATION = {
  id: "dungeon-conurbation",
  continent: "hub",
  name: "Porto Submerso",
  sub: "a camada que liga todas as cidades por baixo do mar",
  material: "ferro",
  tunnel: "wide",
  equipment: [],
  boss: "",
  hub: true,
  layer: -2,
  rooms: HUB_ROOMS,
  corridors: HUB_CORRIDORS,
  layout: { width: 64, height: 48, rooms: HUB_ROOMS, corridors: HUB_CORRIDORS, bossRoom: null },
  portals: [
    { defId: "dungeon-cs", x: 8, y: 9, label: "descer à cidade da Computação" },
    { defId: "dungeon-math", x: 32, y: 5, label: "descer à cidade da Matemática" },
    { defId: "dungeon-physics", x: 56, y: 9, label: "descer à cidade da Física" },
    { defId: "dungeon-chem", x: 58, y: 25, label: "descer à cidade da Química" },
    { defId: "dungeon-music", x: 56, y: 39, label: "descer à cidade da Música" },
    { defId: "dungeon-ai", x: 8, y: 37, label: "descer à cidade da IA" },
    { defId: "dungeon-lingua", x: 8, y: 23, label: "descer à cidade da Língua" },
  ],
  palette: { floor: "#1a2436", floor2: "#131a29", wall: "#080d16", wallTop: "#2a3a57", accent: "#6bd5ff" },
};

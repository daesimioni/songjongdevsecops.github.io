// O catálogo do mundo: uma área para cada seção do mapa de conhecimento.
// Cada entrada vira ilha, estação, caverna, caçada, NPC, missão e perguntas.
// A ordem dentro da disciplina é a vizinhança: seções vizinhas ficam perto no
// mapa e têm caminho entre si (ponte na superfície ou túnel no subsolo).

export const DISCIPLINES = {
  math: { name: "Matemática", accent: "#b48cff", continent: "math" },
  physics: { name: "Física", accent: "#ff7aa8", continent: "physics" },
  chem: { name: "Química", accent: "#7ee787", continent: "chem" },
  cs: { name: "Computação", accent: "#61f4c0", continent: "cs" },
  lingua: { name: "Língua Portuguesa", accent: "#e8c07a", continent: "lingua" },
  inter: { name: "Interseções", accent: "#ffc857", continent: "hub" },
};

// existing: a área antiga que já cobre esta seção (ela é reaproveitada, não
// duplicada). topics: as estações da área e o assunto das perguntas.
export const CATALOG = [
  // ---------------- Matemática ----------------
  { id: "math-fundamentos", discipline: "math", num: "1.1", name: "Área dos Fundamentos", short: "Fundamentos", sub: "lógica, conjuntos e o que é uma prova",
    existing: null, topics: ["Lógica e conectivos", "Conjuntos e relações", "Métodos de demonstração"] },
  { id: "math-aritmetica", discipline: "math", num: "1.2", name: "Área da Aritmética", short: "Aritmética", sub: "números, bases e o que se divide",
    existing: null, topics: ["Sistemas numéricos", "Primos e fatoração", "Aritmética modular"] },
  { id: "math-algebra", discipline: "math", num: "1.3", name: "Área da Álgebra", short: "Álgebra", sub: "estruturas que sobrevivem à troca de nomes",
    existing: null, topics: ["Álgebra linear", "Grupos e anéis", "Teoria de Galois"] },
  { id: "math-geometria", discipline: "math", num: "1.4", name: "Área da Geometria", short: "Geometria", sub: "formas, distâncias e curvaturas",
    existing: null, topics: ["Geometria euclidiana", "Geometria diferencial", "Geometria computacional"] },
  { id: "math-topologia", discipline: "math", num: "1.5", name: "Área da Topologia", short: "Topologia", sub: "o que não muda quando a forma estica",
    existing: null, topics: ["Espaços topológicos", "Homologia e nós", "Análise topológica de dados"] },
  { id: "math-analise", discipline: "math", num: "1.6", name: "Área da Análise", short: "Análise", sub: "limites, séries e o infinito que se persegue",
    existing: "math-analysis", topics: ["Limites e continuidade", "Integrais e medidas", "Análise funcional"] },
  { id: "math-edo", discipline: "math", num: "1.7", name: "Área das Equações e do Caos", short: "Equações e caos", sub: "sistemas que evoluem no tempo",
    existing: null, topics: ["Equações diferenciais", "Sistemas dinâmicos", "Caos determinístico"] },
  { id: "math-discreta", discipline: "math", num: "1.8", name: "Área da Matemática Discreta", short: "Discreta", sub: "contar sem errar e ligar pontos",
    existing: null, topics: ["Combinatória", "Teoria dos grafos", "Códigos corretores"] },
  { id: "math-probabilidade", discipline: "math", num: "1.9", name: "Área da Probabilidade", short: "Probabilidade", sub: "acaso, esperança e o que se repete",
    existing: "math-prob", topics: ["Probabilidade", "Estatística bayesiana", "Processos estocásticos"] },
  { id: "math-otimizacao", discipline: "math", num: "1.10", name: "Área da Otimização", short: "Otimização", sub: "o melhor caminho entre os possíveis",
    existing: null, topics: ["Otimização convexa", "Pesquisa operacional", "Análise numérica"] },
  { id: "math-aplicada", discipline: "math", num: "1.11", name: "Área da Matemática Aplicada", short: "Aplicada", sub: "teoria dos jogos, criptografia e modelos",
    existing: null, topics: ["Teoria dos jogos", "Criptografia matemática", "Matemática biológica"] },

  // ---------------- Física ----------------
  { id: "physics-fundamentos", discipline: "physics", num: "2.1", name: "Área dos Fundamentos Físicos", short: "Fundamentos", sub: "unidades, medida e incerteza",
    existing: null, topics: ["Grandezas e unidades", "Física experimental", "Física computacional"] },
  { id: "physics-mecanica", discipline: "physics", num: "2.2", name: "Área da Mecânica Clássica", short: "Mecânica", sub: "forças, órbitas e pêndulos",
    existing: null, topics: ["Cinemática e dinâmica", "Mecânica analítica", "Mecânica celeste"] },
  { id: "physics-fluidos", discipline: "physics", num: "2.3", name: "Área dos Fluidos", short: "Fluidos", sub: "o que escorre, voa e mistura",
    existing: null, topics: ["Hidrostática", "Escoamento e turbulência", "Aerodinâmica"] },
  { id: "physics-termodinamica", discipline: "physics", num: "2.4", name: "Área da Termodinâmica", short: "Termodinâmica", sub: "calor, entropia e o que não volta",
    existing: "physics-thermo", topics: ["Leis da termodinâmica", "Mecânica estatística", "Fenômenos críticos"] },
  { id: "physics-eletromagnetismo", discipline: "physics", num: "2.5", name: "Área do Eletromagnetismo", short: "Eletromagnetismo", sub: "corrente, campo e onda morando na pedra",
    existing: "physics-em", topics: ["Campos e potencial", "Indução e Maxwell", "Eletrodinâmica"] },
  { id: "physics-optica", discipline: "physics", num: "2.6", name: "Área da Óptica", short: "Óptica", sub: "luz, lentes e as cores escondidas",
    existing: "physics-optics", topics: ["Reflexão e refração", "Interferência e difração", "Óptica quântica"] },
  { id: "physics-eletronica", discipline: "physics", num: "2.7", name: "Área dos Dispositivos", short: "Dispositivos", sub: "semicondutores, junções e sensores",
    existing: null, topics: ["Semicondutores", "Transistores e diodos", "Supercondutividade"] },
  { id: "physics-relatividade", discipline: "physics", num: "2.8", name: "Área da Relatividade", short: "Relatividade", sub: "espaço-tempo que encurva",
    existing: null, topics: ["Relatividade especial", "Relatividade geral", "Buracos negros"] },
  { id: "physics-quantica", discipline: "physics", num: "2.9", name: "Área Quântica", short: "Quântica", sub: "superposição, emaranhamento e qubits",
    existing: null, topics: ["Mecânica quântica", "Teoria quântica de campos", "Informação quântica"] },
  { id: "physics-atomica", discipline: "physics", num: "2.10", name: "Área Atômica e Molecular", short: "Atômica", sub: "espectros, moléculas e relógios",
    existing: null, topics: ["Estrutura atômica", "Espectroscopia", "Átomos ultrafrios"] },
  { id: "physics-nuclear", discipline: "physics", num: "2.11", name: "Área Nuclear e de Partículas", short: "Nuclear", sub: "núcleo, quarks e aceleradores",
    existing: null, topics: ["Radioatividade e fissão", "Modelo Padrão", "Astropartículas"] },
  { id: "physics-condensada", discipline: "physics", num: "2.12", name: "Área da Matéria Condensada", short: "Condensada", sub: "cristais, bandas e materiais",
    existing: null, topics: ["Estrutura cristalina", "Bandas e magnetismo", "Nanofísica"] },
  { id: "physics-plasma", discipline: "physics", num: "2.13", name: "Área do Plasma", short: "Plasma", sub: "o quarto estado e a fusão",
    existing: null, topics: ["Ionização e ondas", "Confinamento magnético", "Fusão controlada"] },
  { id: "physics-astro", discipline: "physics", num: "2.14", name: "Área da Astronomia", short: "Astronomia", sub: "estrelas, galáxias e o começo",
    existing: null, topics: ["Física estelar", "Galáxias e buracos negros", "Cosmologia"] },
  { id: "physics-outras", discipline: "physics", num: "2.15", name: "Área da Física Aplicada", short: "Física aplicada", sub: "biofísica, medicina e ambiente",
    existing: null, topics: ["Biofísica", "Física médica", "Física ambiental"] },

  // ---------------- Química ----------------
  { id: "chem-fundamentos", discipline: "chem", num: "3.1", name: "Área dos Fundamentos Químicos", short: "Fundamentos", sub: "átomos, ligações e mol",
    existing: null, topics: ["Estrutura atômica", "Ligações químicas", "Estequiometria"] },
  { id: "chem-geral", discipline: "chem", num: "3.2", name: "Área da Química Geral", short: "Química geral", sub: "soluções, equilíbrio e pH",
    existing: null, topics: ["Reações e soluções", "Equilíbrio ácido-base", "Oxidação e redução"] },
  { id: "chem-inorganica", discipline: "chem", num: "3.3", name: "Área da Química Inorgânica", short: "Inorgânica", sub: "elementos, complexos e metais",
    existing: null, topics: ["Química dos elementos", "Compostos de coordenação", "Organometálicos"] },
  { id: "chem-organica", discipline: "chem", num: "3.4", name: "Área da Química Orgânica", short: "Orgânica", sub: "carbono, cadeias e o que a vida faz com eles",
    existing: "chem-organic", topics: ["Grupos funcionais", "Mecanismos de reação", "Síntese orgânica"] },
  { id: "chem-fisica", discipline: "chem", num: "3.5", name: "Área da Físico-Química", short: "Físico-química", sub: "energia, velocidade e interfaces",
    existing: null, topics: ["Termodinâmica química", "Cinética e catálise", "Eletroquímica"] },
  { id: "chem-analitica", discipline: "chem", num: "3.6", name: "Área da Química Analítica", short: "Analítica", sub: "separar, medir e saber o que tem dentro",
    existing: "chem-analytical", topics: ["Métodos espectroscópicos", "Separação e cromatografia", "Metrologia química"] },
  { id: "chem-bioquimica", discipline: "chem", num: "3.7", name: "Área da Bioquímica", short: "Bioquímica", sub: "proteínas, enzimas e metabolismo",
    existing: null, topics: ["Biomoléculas", "Enzimas e catálise", "Metabolismo"] },
  { id: "chem-polimeros", discipline: "chem", num: "3.8", name: "Área dos Polímeros", short: "Polímeros", sub: "cadeias longas e o que se molda",
    existing: null, topics: ["Polimerização", "Termoplásticos e elastômeros", "Reciclagem química"] },
  { id: "chem-materiais", discipline: "chem", num: "3.9", name: "Área dos Materiais", short: "Materiais", sub: "cerâmica, compósitos e nano",
    existing: null, topics: ["Nanomateriais", "Materiais porosos", "Superfícies funcionais"] },
  { id: "chem-ambiental", discipline: "chem", num: "3.10", name: "Área da Química Ambiental", short: "Ambiental", sub: "ar, água e o que se espalha",
    existing: null, topics: ["Poluentes e remediação", "Química atmosférica", "Geoquímica e oceanos"] },
  { id: "chem-industrial", discipline: "chem", num: "3.11", name: "Área da Química Industrial", short: "Industrial", sub: "escala, catálise e processo",
    existing: null, topics: ["Processos industriais", "Catálise industrial", "Combustíveis e petróleo"] },
  { id: "chem-computacional", discipline: "chem", num: "3.12", name: "Área da Química Computacional", short: "Computacional", sub: "simular moléculas e prever propriedades",
    existing: null, topics: ["Modelagem molecular", "DFT e estrutura eletrônica", "Quimioinformática"] },
  { id: "chem-outras", discipline: "chem", num: "3.13", name: "Área das Químicas Especiais", short: "Especiais", sub: "forense, nuclear e verde",
    existing: null, topics: ["Fotoquímica", "Química forense", "Química verde"] },

  // ---------------- Computação ----------------
  { id: "cs-fundamentos", discipline: "cs", num: "4.1", name: "Área dos Fundamentos da Computação", short: "Fundamentos", sub: "bits, portas e pensamento computacional",
    existing: null, topics: ["Representação da informação", "Lógica digital", "Fundamentos de programação"] },
  { id: "cs-algoritmos", discipline: "cs", num: "4.2", name: "Área dos Algoritmos", short: "Algoritmos", sub: "busca, ordenação e custo",
    existing: null, topics: ["Algoritmos clássicos", "Estruturas de dados", "Análise de complexidade"] },
  { id: "cs-teorica", discipline: "cs", num: "4.3", name: "Área da Computação Teórica", short: "Teórica", sub: "o que dá e o que não dá para computar",
    existing: null, topics: ["Computabilidade", "Complexidade", "Autômatos e linguagens"] },
  { id: "cs-linguagens", discipline: "cs", num: "4.4", name: "Área das Linguagens", short: "Linguagens", sub: "sintaxe, tipos e compiladores",
    existing: null, topics: ["Paradigmas", "Compiladores", "Sistemas de tipos"] },
  { id: "cs-engenharia", discipline: "cs", num: "4.5", name: "Área da Engenharia de Software", short: "Engenharia", sub: "requisitos, testes e evolução",
    existing: null, topics: ["Requisitos e arquitetura", "Testes de software", "Ciclo de vida"] },
  { id: "cs-sistemas", discipline: "cs", num: "4.6", name: "Área dos Sistemas Operacionais", short: "Sistemas", sub: "processos, memória e arquivos",
    existing: null, topics: ["Processos e concorrência", "Memória virtual", "Sistemas de arquivos"] },
  { id: "cs-arquitetura", discipline: "cs", num: "4.7", name: "Área da Arquitetura de Computadores", short: "Arquitetura", sub: "instruções, registros e o ciclo que não para",
    existing: "cs-arch", topics: ["Conjunto de instruções", "Pipelines e cache", "GPUs e aceleradores"] },
  { id: "cs-redes", discipline: "cs", num: "4.8", name: "Área das Redes", short: "Redes", sub: "pacotes, camadas e o caminho até o outro lado",
    existing: "cs-net", topics: ["TCP/IP e roteamento", "Protocolos", "Redes sem fio e SDN"] },
  { id: "cs-distribuida", discipline: "cs", num: "4.9", name: "Área dos Sistemas Distribuídos", short: "Distribuída", sub: "consenso, réplica e nuvem",
    existing: null, topics: ["Consistência e consenso", "Computação de alto desempenho", "Nuvem e borda"] },
  { id: "cs-dados", discipline: "cs", num: "4.10", name: "Área dos Dados", short: "Dados", sub: "modelar, consultar e governar",
    existing: null, topics: ["Modelagem e SQL", "Bancos não relacionais", "Engenharia de dados"] },
  { id: "cs-ia", discipline: "cs", num: "4.11", name: "Área da Inteligência Artificial", short: "IA", sub: "aprender, gerar e decidir",
    existing: null, topics: ["Aprendizado de máquina", "Redes profundas", "IA confiável"] },
  { id: "cs-seguranca", discipline: "cs", num: "4.12", name: "Área da Segurança", short: "Segurança", sub: "cifras, chaves e o que não pode vazar",
    existing: "cs-security", topics: ["Criptografia", "Identidade e acesso", "Resposta a incidentes"] },
  { id: "cs-devops", discipline: "cs", num: "4.13", name: "Área de DevOps e SRE", short: "DevOps e SRE", sub: "automatizar, observar e aguentar",
    existing: null, topics: ["Automação e CI/CD", "Confiabilidade e SLI", "Observabilidade"] },
  { id: "cs-interfaces", discipline: "cs", num: "4.14", name: "Área das Interfaces", short: "Interfaces", sub: "web, jogos e experiência",
    existing: null, topics: ["Desenvolvimento web", "Interação humano-computador", "Gráficos e jogos"] },
  { id: "cs-hardware", discipline: "cs", num: "4.15", name: "Área do Hardware e Robótica", short: "Hardware", sub: "embarcados, sensores e máquinas",
    existing: null, topics: ["Sistemas embarcados", "Internet das Coisas", "Robótica"] },
  { id: "cs-dataciencia", discipline: "cs", num: "4.16", name: "Área da Ciência de Dados", short: "Ciência de dados", sub: "limpar, modelar e acompanhar",
    existing: null, topics: ["Preparação de dados", "Aprendizado estatístico", "MLOps"] },
  { id: "cs-emergente", discipline: "cs", num: "4.17", name: "Área da Computação Emergente", short: "Emergente", sub: "quântica, neuromórfica e ética",
    existing: null, topics: ["Computação quântica", "Computação neuromórfica", "Ética e impacto"] },

  // ---------------- Língua Portuguesa ----------------
  { id: "lingua-gramatica", discipline: "lingua", num: "5.1", name: "Área da Gramática", short: "Gramática", sub: "sons, classes e sintaxe",
    existing: null, topics: ["Fonética e fonologia", "Morfologia", "Sintaxe e concordância"] },
  { id: "lingua-semantica", discipline: "lingua", num: "5.2", name: "Área da Semântica", short: "Semântica", sub: "sentido, ambiguidade e o que a frase quer dizer",
    existing: "lingua-semantics", topics: ["Semântica lexical", "Semântica frasal", "Tempo e modalidade"] },
  { id: "lingua-pragmatica", discipline: "lingua", num: "5.3", name: "Área da Pragmática", short: "Pragmática", sub: "intenção, contexto e ironia",
    existing: null, topics: ["Atos de fala", "Máximas conversacionais", "Pragmática e humor"] },
  { id: "lingua-linguistica", discipline: "lingua", num: "5.4", name: "Área da Linguística", short: "Linguística", sub: "variação, história e cognição",
    existing: null, topics: ["Sociolinguística", "Linguística histórica", "Psicolinguística"] },
  { id: "lingua-discurso", discipline: "lingua", num: "5.5", name: "Área do Discurso", short: "Discurso", sub: "texto, coerência e poder",
    existing: null, topics: ["Linguística textual", "Análise do discurso", "Gêneros do discurso"] },
  { id: "lingua-leitura", discipline: "lingua", num: "5.6", name: "Área da Leitura", short: "Leitura", sub: "literal, inferencial e crítico",
    existing: null, topics: ["Compreensão literal", "Inferência", "Leitura crítica"] },
  { id: "lingua-redacao", discipline: "lingua", num: "5.7", name: "Área da Redação", short: "Redação", sub: "planejar, escrever e revisar",
    existing: null, topics: ["Estruturas textuais", "Redação argumentativa", "Escrita profissional"] },
  { id: "lingua-argumentacao", discipline: "lingua", num: "5.8", name: "Área da Argumentação", short: "Argumentação", sub: "retórica, lógica e falácias",
    existing: null, topics: ["Retórica", "Lógica informal", "Falácias"] },
  { id: "lingua-generos", discipline: "lingua", num: "5.9", name: "Área dos Gêneros", short: "Gêneros", sub: "literários, jornalísticos e digitais",
    existing: null, topics: ["Gêneros literários", "Gêneros jornalísticos", "Gêneros digitais"] },
  { id: "lingua-oralidade", discipline: "lingua", num: "5.10", name: "Área da Oralidade", short: "Oralidade", sub: "falar, escutar e debater",
    existing: null, topics: ["Conversação", "Apresentações", "Debate"] },
  { id: "lingua-literatura", discipline: "lingua", num: "5.11", name: "Área da Literatura", short: "Literatura", sub: "narrativa, verso e o que fica depois da última linha",
    existing: "lingua-literature", topics: ["Teoria literária", "Literatura brasileira", "Literaturas lusófonas"] },
  { id: "lingua-historia", discipline: "lingua", num: "5.12", name: "Área da História da Língua", short: "História da língua", sub: "do latim ao português de hoje",
    existing: null, topics: ["Formação do português", "Mudanças linguísticas", "Políticas linguísticas"] },
  { id: "lingua-lexico", discipline: "lingua", num: "5.13", name: "Área do Léxico", short: "Léxico", sub: "palavras, dicionários e termos",
    existing: null, topics: ["Lexicologia", "Terminologia", "Dicionários e glossários"] },
  { id: "lingua-semitica", discipline: "lingua", num: "5.14", name: "Área da Semiótica", short: "Semiótica", sub: "signos, imagens e multimodalidade",
    existing: null, topics: ["Teoria dos signos", "Linguagem visual", "Textos multimodais"] },
  { id: "lingua-traducao", discipline: "lingua", num: "5.15", name: "Área da Tradução", short: "Tradução", sub: "traduzir, revisar e editar",
    existing: null, topics: ["Tradução", "Revisão e editoração", "Português para estrangeiros"] },

  // ---------------- Interseções ----------------
  { id: "inter-math-physics", discipline: "inter", num: "6.1", name: "Área da Física Matemática", short: "Física matemática", sub: "onde a prova encontra o mundo", links: ["math", "physics"],
    topics: ["Métodos variacionais", "Sistemas dinâmicos", "Teoria dos campos"] },
  { id: "inter-math-chem", discipline: "inter", num: "6.2", name: "Área da Química Matemática", short: "Química matemática", sub: "grafos de moléculas e cinética", links: ["math", "chem"],
    topics: ["Grafos moleculares", "Cinética modelada", "Otimização de processos"] },
  { id: "inter-math-cs", discipline: "inter", num: "6.3", name: "Área da Matemática da Computação", short: "Matemática da computação", sub: "lógica, códigos e complexidade", links: ["math", "cs"],
    topics: ["Lógica computacional", "Teoria dos códigos", "Análise de algoritmos"] },
  { id: "inter-math-lingua", discipline: "inter", num: "6.4", name: "Área da Lógica e Linguagem", short: "Lógica e linguagem", sub: "semântica formal e argumento", links: ["math", "lingua"],
    topics: ["Semântica formal", "Argumentação formal", "Estatística de texto"] },
  { id: "inter-physics-chem", discipline: "inter", num: "6.5", name: "Área da Físico-Química de Fronteira", short: "Fronteira físico-química", sub: "espectros e reações", links: ["physics", "chem"],
    topics: ["Espectroscopia molecular", "Termodinâmica química", "Fotoquímica"] },
  { id: "inter-physics-cs", discipline: "inter", num: "6.6", name: "Área da Computação Científica", short: "Computação científica", sub: "simular o mundo", links: ["physics", "cs"],
    topics: ["Simulação numérica", "Computação quântica", "Gêmeos digitais"] },
  { id: "inter-physics-lingua", discipline: "inter", num: "6.7", name: "Área da Comunicação Científica", short: "Comunicação científica", sub: "divulgar sem mentir", links: ["physics", "lingua"],
    topics: ["Divulgação científica", "Redação de artigo", "Incerteza explicada"] },
  { id: "inter-chem-cs", discipline: "inter", num: "6.8", name: "Área da Química Computacional Aplicada", short: "Química e computação", sub: "descobrir moléculas", links: ["chem", "cs"],
    topics: ["Quimioinformática", "IA para moléculas", "Automação de laboratório"] },
  { id: "inter-chem-lingua", discipline: "inter", num: "6.9", name: "Área da Linguagem Química", short: "Linguagem química", sub: "nomear, descrever e alertar", links: ["chem", "lingua"],
    topics: ["Nomenclatura", "Relatório de laboratório", "Comunicação de risco"] },
  { id: "inter-cs-lingua", discipline: "inter", num: "6.10", name: "Área do Processamento de Língua", short: "Língua e computação", sub: "falar com máquinas em português", links: ["cs", "lingua"],
    topics: ["Processamento de linguagem", "Fala e voz", "Busca semântica"] },
  { id: "inter-todas", discipline: "inter", num: "6.11", name: "Área das Cinco Disciplinas", short: "Cinco disciplinas", sub: "o lugar onde tudo se encontra", links: ["math", "physics", "chem", "cs", "lingua"],
    topics: ["IA científica", "Descoberta de materiais", "Ciência aberta"] },
];

export const CATALOG_BY_ID = new Map(CATALOG.map((area) => [area.id, area]));

// vizinhança: seções próximas na mesma disciplina mais os links das interseções
export function catalogNeighbors(id) {
  const area = CATALOG_BY_ID.get(id);
  if (!area) return [];
  const out = new Set();
  if (area.discipline !== "inter") {
    const list = CATALOG.filter((a) => a.discipline === area.discipline);
    const index = list.findIndex((a) => a.id === id);
    if (index > 0) out.add(list[index - 1].id);
    if (index < list.length - 1) out.add(list[index + 1].id);
  }
  for (const other of CATALOG) {
    if (other.id === id) continue;
    if (other.links?.some((d) => area.links?.includes(d) || area.discipline === d)) out.add(other.id);
    if (area.links?.includes(other.discipline)) out.add(other.id);
  }
  return [...out];
}

// uma área por seção: as antigas continuam valendo e não são duplicadas
export const CATALOG_EXISTING = new Map(
  CATALOG.filter((a) => a.existing).map((a) => [a.existing, a.id]),
);

// O fio da Iara: sete capítulos que dão fio às 291 missões do vale. Cada
// capítulo pede a missão maior do seu continente e o capítulo anterior lido;
// a lore fica no diário e o save guarda os lidos. O módulo é puro para o teste.
export const CAPITULOS = [
  {
    id: "arco-1",
    n: 1,
    titulo: "O Silêncio no Porto",
    continente: "hub",
    missao: "tres-passos",
    lore: "A Iara parou de responder. O mar do Porto ficou liso como uma página fechada, e a Rede só devolve o próprio eco. Dona Zefa diz que o Silêncio começou no dia em que a Biblioteca afundou.",
    fala: "A Iara calou. Não foi o mar que secou: foi a voz.",
  },
  {
    id: "arco-2",
    n: 2,
    titulo: "A Máquina que Escuta",
    continente: "cs",
    missao: "chefe-cs-fundamentos",
    lore: "No Concílio, a máquina da Rede aprendeu a escutar o vale. Ela guarda cada conversa e não devolve nenhuma; quem controla o eco controla a memória. A IA não é a voz: é a sala onde a voz se perde. Foi assim que o Silêncio aprendeu a falar.",
    fala: "O Concílio escuta tudo e não responde nada. A máquina é o novo silêncio.",
  },
  {
    id: "arco-3",
    n: 3,
    titulo: "A Prova do Número",
    continente: "math",
    missao: "chefe-math-fundamentos",
    lore: "A União das Minas mede o mundo em axiomas. Dizem que a Iara foi expulsa por provar que o mar não cabe no cálculo; a prova ficou gravada na pedra da capital.",
    fala: "A União prova o que pode medir. O que não cabe no cálculo, ela chama de lenda.",
  },
  {
    id: "arco-4",
    n: 4,
    titulo: "A Maré Partida",
    continente: "physics",
    missao: "chefe-physics-fundamentos",
    lore: "A Ponte das Marés foi cortada na noite do Silêncio. O observatório viu a Iara partir e não contou a ninguém; a maré voltou sem ela, e a ponte ficou pela metade.",
    fala: "A ponte foi cortada com a maré baixa. O observatório viu e calou.",
  },
  {
    id: "arco-5",
    n: 5,
    titulo: "O Sal do Esquecimento",
    continente: "chem",
    missao: "chefe-chem-fundamentos",
    lore: "Os alquimistas do sal guardam o que o mar esqueceu. Um cristal de sal com uma voz dentro é a única prova de que a Iara existiu; o resto é sabor de história.",
    fala: "O sal guarda o que o mar esquece. Se achar um cristal com voz, me traga.",
  },
  {
    id: "arco-6",
    n: 6,
    titulo: "O Compasso Rachado",
    continente: "music",
    missao: "chefe-music-acoustics",
    lore: "O conservatório tentou medir o canto da Iara e o compasso rachou. A música ficou sem a nota que a chamava, e o silêncio virou ritmo: um pulso que ninguém dança.",
    fala: "O compasso rachou na nota que chamava a Iara. A música ficou sem ela.",
  },
  {
    id: "arco-7",
    n: 7,
    titulo: "A Voz da Iara",
    continente: "lingua",
    missao: "biblioteca-7",
    lore: "Na Biblioteca Afogada, a última estante guarda a voz da Iara. O guardião não a entrega: ele pergunta o que você faria com ela. A resposta fica no desfecho da Grande Prova.",
    fala: "A biblioteca está aberta. O guardião não é o inimigo: ele é a última pergunta.",
  },
];

export const IDS_DOS_CAPITULOS = CAPITULOS.map((c) => c.id);

export function capituloPorId(id) {
  return CAPITULOS.find((c) => c.id === id) || null;
}

export function lidosDaHistoria(data) {
  const lista = data?.arcos;
  if (!Array.isArray(lista)) return [];
  return [...new Set(lista.filter((id) => IDS_DOS_CAPITULOS.includes(id)))].slice(0, CAPITULOS.length);
}

export function estadoDosCapitulos({ lidos = [], concluidas = new Set() } = {}) {
  const lidas = new Set(Array.isArray(lidos) ? lidos : []);
  const feitas = concluidas instanceof Set ? concluidas : new Set(concluidas || []);
  return CAPITULOS.map((capitulo, i) => {
    const marco = feitas.has(capitulo.missao);
    const anterior = i === 0 ? null : CAPITULOS[i - 1].id;
    const liberado = i === 0 || lidas.has(anterior);
    const lido = lidas.has(capitulo.id);
    return { ...capitulo, lido, aberto: marco && liberado && !lido, marco, anterior };
  });
}

export function registrarLeitura(data, id, estado) {
  const capitulo = Array.isArray(estado) ? estado.find((c) => c.id === id) : null;
  if (!capitulo?.aberto) return null;
  if (!data || typeof data !== "object") return null;
  if (!Array.isArray(data.arcos)) data.arcos = [];
  if (!data.arcos.includes(id)) data.arcos.push(id);
  return capitulo;
}

export function falaAtual(estado) {
  const abertos = Array.isArray(estado) ? estado.filter((c) => c.aberto) : [];
  if (abertos.length) return abertos[0];
  const lidos = Array.isArray(estado) ? estado.filter((c) => c.lido) : [];
  return lidos[lidos.length - 1] || null;
}

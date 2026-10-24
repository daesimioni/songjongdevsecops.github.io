// Reskin do mundo: o jogo deixa de ser educativo e passa a ser um RPG de
// ilhas partidas. O módulo troca os textos de superfície (continentes, áreas,
// criaturas, itens, páginas e missões) sem tocar nos ids, no save nem na
// geometria do mapa. A chamada acontece antes de createWorld().
import { AREAS, CONTINENTS, SITES, WAYSTONES, NPC_SPAWNS } from "../content/config.js";
import { SKILLS, ITEMS, GROUNDS } from "../content/rpg-data.js";
import { DUNGEONS } from "../content/dungeon-data.js";
import { POSTS, NPCS } from "../content/content.js";
import { QUESTS } from "./quests.js";
import { CAPITULOS } from "./arcos.js";
import { OUTFITS } from "../content/outfits.js";
import { PETS } from "../content/pets.js";
import { FACCOES, ATOS } from "./faccoes.js";

export const JOGO = {
  nome: "Vale Partido",
  sub: "um RPG de ilhas, ruínas e maré",
  versao: "2026",
};

const hash = (texto) => {
  let h = 2166136261;
  for (let i = 0; i < String(texto).length; i++) h = Math.imul(h ^ String(texto).charCodeAt(i), 16777619);
  return h >>> 0;
};
const pick = (arr, h) => arr[h % arr.length];
const cap = (texto) => {
  const t = String(texto || "").trim();
  return t ? t[0].toUpperCase() + t.slice(1) : t;
};

// ---------------------------------------------------------------- dicionário
// Troca os termos que ainda entregam aula. A ordem importa: o plural vem antes
// do singular para "Axiomas" não virar "Pedrass".
const TROCAS = [
  [/\bThe Learning Valley\b/gi, "Vale Partido"],
  [/\bNúcleo de Turing\b/gi, "Núcleo Antigo"],
  [/\bTuring\b/gi, "Antigo"], [/\bSinapse\b/gi, "Faísca"], [/\bCompilador\b/gi, "Forjador"],
  [/\bInfinito\b/gi, "Abismo"], [/\bCatalisador\b/gi, "Faísca"], [/\bDissonância\b/gi, "Eco"],
  [/\bSilício\b/gi, "Vidro"], [/\bBinário\b/gi, "Gêmeo"], [/\bBinária\b/gi, "Gêmea"],
  [/\baprendizado\b/gi, "instinto"], [/\baprender\b/gi, "sobreviver"],
  [/\bconhecimento\b/gi, "saber antigo"], [/\bciência\b/gi, "saber"],
  [/\beducação\b/gi, "criação"], [/\beducacional\b/gi, "de aventura"],
  [/\blição\b/gi, "crônica"], [/\baula\b/gi, "runa"], [/\bcurso\b/gi, "trilha"],
  [/\bexercício\b/gi, "prova"], [/\bpergunta\b/gi, "enigma"],
  [/\bteorema\b/gi, "lenda"], [/\baxiomas?\b/gi, "pedras"], [/\baxioma\b/gi, "pedra"],
  [/\bnúmeros?\b/gi, "moedas"], [/\bálgebras?\b/gi, "runas"], [/\bálgebra\b/gi, "runa"],
  [/\binvariantes\b/gi, "selos"], [/\blimites\b/gi, "marés"], [/\blimite\b/gi, "maré"],
  [/\bderivadas?\b/gi, "correntes"], [/\bintegrais?\b/gi, "totais"],
  [/\bcálculo\b/gi, "maré"], [/\bfunções\b/gi, "selos"], [/\bfunção\b/gi, "selo"],
  [/\bvetores\b/gi, "dardos"], [/\bvetor\b/gi, "dardo"], [/\bmatrizes\b/gi, "grades"],
  [/\bmatriz\b/gi, "grade"], [/\bprobabilidade\b/gi, "sorte"], [/\bestatística\b/gi, "contagem"],
  [/\bgeometria\b/gi, "formas"], [/\bálgebra linear\b/gi, "runas lineares"],
  [/\bfísica\b/gi, "força"], [/\bquímica\b/gi, "alquimia"], [/\bbiologia\b/gi, "vida"],
  [/\bcomputação\b/gi, "engenho"], [/\balgoritmos?\b/gi, "rituais"],
  [/\bprogramação\b/gi, "tecitura"], [/\bsoftware\b/gi, "tecitura"],
  [/\bhardware\b/gi, "ferragem"], [/\bdados\b/gi, "tesouros"], [/\bbits?\b/gi, "faíscas"],
  [/\bbytes?\b/gi, "pedras"], [/\bchips?\b/gi, "placas"], [/\bcompilador\b/gi, "forjador"],
  [/\bcircuitos?\b/gi, "correntes"], [/\bprotocolos?\b/gi, "pactos"],
  [/\bredes neurais\b/gi, "malhas sombrias"], [/\brede neural\b/gi, "malha sombria"],
  [/\brede\b/gi, "malha"], [/\bmodelos?\b/gi, "sombras"], [/\binteligência artificial\b/gi, "astúcia falsa"],
  [/\binteligência\b/gi, "astúcia"], [/\bartificial\b/gi, "falsa"], [/\brobôs?\b/gi, "autômatos"],
  [/\bsensores?\b/gi, "olhos"], [/\bvisão\b/gi, "olhar"], [/\blinguagem\b/gi, "fala"],
  [/\btokens?\b/gi, "selos"], [/\bprompt\b/gi, "sussurro"], [/\bética\b/gi, "juramento"],
  [/\bfilosofia\b/gi, "sabedoria"], [/\blógica\b/gi, "astúcia"], [/\bgramática\b/gi, "sintaxe"],
  [/\bsemântica\b/gi, "sentido"], [/\bpragmática\b/gi, "costume"], [/\bliteratura\b/gi, "contos"],
  [/\bpoesia\b/gi, "canto"], [/\bnarrativa\b/gi, "crônica"], [/\bledura\b/gi, "contos"],
  [/\b redação\b/gi, " escrita"], [/\bargumentação\b/gi, "discórdia"], [/\bgêneros\b/gi, "vozes"],
  [/\boralidade\b/gi, "fala"], [/\bléxico\b/gi, "vocabulário"], [/\bsemiótica\b/gi, "sinais"],
  [/\btradução\b/gi, "passagem"], [/\bmúsica\b/gi, "ecos"], [/\bharmonia\b/gi, "ritmo"],
  [/\bmelodia\b/gi, "canto"], [/\britmo\b/gi, "pulso"], [/\btimbre\b/gi, "cor"],
  [/\bfrequência\b/gi, "pulso"], [/\bressonância\b/gi, "eco"], [/\bacústica\b/gi, "ecos"],
  [/\bátomos?\b/gi, "faíscas"], [/\bmoléculas?\b/gi, "nós"], [/\bproteínas?\b/gi, "fios"],
  [/\bDNA\b/gi, "corda"], [/\bgenes?\b/gi, "marcas"], [/\bcélulas?\b/gi, "sementes"],
  [/\breações?\b/gi, "feitiços"], [/\bentropia\b/gi, "cinzas"], [/\beletromagnético\b/gi, "tempestade"],
  [/\bquântico\b/gi, "espectral"], [/\bquântica\b/gi, "espectral"], [/\batômico\b/gi, "faiscante"],
  [/\bnuclear\b/gi, "fogo"], [/\bcondensada\b/gi, "gélida"], [/\bplasma\b/gi, "vento"],
  [/\bestelar\b/gi, "das estrelas"], [/\bórbita\b/gi, "roda"], [/\bgravidade\b/gi, "peso"],
  [/\benergia\b/gi, "chama"], [/\bonda\b/gi, "maré"], [/\bluz\b/gi, "brilho"],
  [/\bóptica\b/gi, "prismas"], [/\bprismático\b/gi, "cristal"], [/\bfluidos?\b/gi, "marés"],
  [/\bmáquinas?\b/gi, "engrenagens"], [/\bengenharia\b/gi, "forja"], [/\barquitetura\b/gi, "fortaleza"],
  [/\bsegurança\b/gi, "muralha"], [/\bcriptografia\b/gi, "selos"], [/\binterface\b/gi, "vitrine"],
  [/\bdevops\b/gi, "forja"], [/\bdistribuída\b/gi, "das ilhas"], [/\bdistribuído\b/gi, "das ilhas"],
  [/\bemergente\b/gi, "portal"], [/\bcomputabilidade\b/gi, "ruínas"], [/\bautômatos?\b/gi, "golens"],
  [/\bdispositivos\b/gi, "relíquias"], [/\bmateriais\b/gi, "metais"], [/\bpolímeros\b/gi, "correntes"],
  [/\bcarbono\b/gi, "carvão"], [/\banalítica\b/gi, "lupa"], [/\bbiomolecular\b/gi, "do bosque"],
  [/\bindustrial\b/gi, "da forja"], [/\bcomputacional\b/gi, "das engrenagens"],
  [/\bambiental\b/gi, "do lago"], [/\binorgânica\b/gi, "da pedra"], [/\belementos\b/gi, "runas"],
  [/\bfísico-química\b/gi, "poções"], [/\bmatemática\b/gi, "formas"], [/\bmatemático\b/gi, "das formas"],
  [/\bcomputação\b/gi, "engenho"], [/\bdisciplina\b/gi, "trilha"], [/\bconteúdo\b/gi, "saber"],
  [/\bcatálogo\b/gi, "mapa"], [/\benciclopédia\b/gi, "codex"], [/\bwiki\b/gi, "codex"],
  [/\bquestões\b/gi, "provas"], [/\bquestão\b/gi, "prova"], [/\bexame\b/gi, "provação"],
  [/\bmonografia\b/gi, "crônica"], [/\btese\b/gi, "lenda"], [/\bpesquisa\b/gi, "busca"],
  [/\blaboratório\b/gi, "oficina"], [/\bexperimento\b/gi, "ritual"], [/\bmedição\b/gi, "medida"],
  [/\bhipótese\b/gi, "presságio"], [/\bteoria\b/gi, "lenda"], [/\bconceito\b/gi, "signo"],
  [/\bdefinição\b/gi, "marca"], [/\bexplicação\b/gi, "sussurro"], [/\bexercícios\b/gi, "provas"],
  [/\bsubárea\b/gi, "trilha"], [/\bseção\b/gi, "caminho"], [/\btópico\b/gi, "tema"],
  [/\bprofessor\b/gi, "mestre"], [/\bprofessora\b/gi, "mestra"], [/\baluno\b/gi, "aprendiz"],
  [/\baluna\b/gi, "aprendiz"], [/\bestudante\b/gi, "viajante"], [/\bescola\b/gi, "fortaleza"],
  [/\buniversidade\b/gi, "cidadela"], [/\bacervo\b/gi, "tesouro"], [/\bbiblioteca\b/gi, "cripta"],
  [/\bbibliotecas\b/gi, "criptas"], [/\bconhecimentos\b/gi, "saberes"],
];
function limpar(texto) {
  let t = String(texto || "");
  for (const [re, troca] of TROCAS) t = t.replace(re, (m) => (/^[A-ZÁÉÍÓÚÂÊÔÃÕÇ]/.test(m) ? cap(troca) : troca));
  return t.replace(/\s{2,}/g, " ").trim();
}

// ---------------------------------------------------------------- regiões
const REGIAO = {
  hub: { nome: "Porto Partido", sub: "o último cais antes das ilhas", adj: "do Porto", prep: "do" },
  cs: { nome: "Cidadela de Ferro", sub: "oficinas, forjas e máquinas antigas", adj: "de Ferro", prep: "da" },
  math: { nome: "Reino das Formas", sub: "pedras que mudam de forma quando ninguém olha", adj: "das Formas", prep: "do" },
  physics: { nome: "Costa dos Ventos", sub: "falésias, marés e tempestades", adj: "dos Ventos", prep: "da" },
  chem: { nome: "Bosque dos Frascos", sub: "ervas, vapores e alquimia", adj: "dos Frascos", prep: "do" },
  music: { nome: "Vale dos Ecos", sub: "ruínas que ainda cantam", adj: "dos Ecos", prep: "do" },
  ai: { nome: "Névoa de Vidro", sub: "olhos que observam no escuro", adj: "de Vidro", prep: "da" },
  lingua: { nome: "Costa dos Contos", sub: "arquivos afogados e histórias", adj: "dos Contos", prep: "da" },
};
const HABILIDADE = {
  cs: { name: "Engenho", desc: "armas, armaduras e máquinas antigas" },
  math: { name: "Arcano", desc: "runas, formas e o que não se vê" },
  physics: { name: "Vigor", desc: "força, maré e tempestade" },
  chem: { name: "Alquimia", desc: "ervas, venenos e elixires" },
  music: { name: "Eco", desc: "voz, ritmo e encantamento" },
  ai: { name: "Instinto", desc: "olhos, sombras e presságios" },
};
const SUB_AREA = [
  "onde a maré deixou pedra e osso",
  "um caminho entre ruína e mato",
  "o chão range antes de ceder",
  "há fumaça no ar e ninguém sabe de onde",
  "as paredes guardam marcas de fogueira",
  "um lugar que o mapa esqueceu",
  "o vento entra por frestas que ninguém abriu",
  "dizem que ainda se ouve um sino",
  "a água cobre o que a pressa deixou",
  "entre a costa e o escuro",
  "uma ruína que não devia estar de pé",
  "a trilha some no mato e volta adiante",
];
const SALA = [
  "Boca da Gruta", "Galeria dos Ossos", "Salão dos Ecos", "Câmara do Cristal",
  "Forja Antiga", "Cripta dos Segredos", "Poço das Sombras", "Praça do Fogo",
  "Passagem Partida", "Coração da Ruína",
];
const CRIATURA = {
  slime: ["Gosma", "Lodo", "Viscoso", "Poça", "Gelatina", "Baba"],
  eye: ["Olho", "Vigia", "Observador", "Pupila", "Sentinela", "Espião"],
  bat: ["Morcego", "Asa", "Vespertino", "Sombra", "Guano", "Nocturno"],
  spider: ["Aranha", "Teia", "Perna", "Tecelã", "Viúva", "Fio"],
  wisp: ["Fogo", "Faísca", "Brasa", "Chama", "Fátuo", "Vela"],
  scorpion: ["Escorpião", "Ferrão", "Casca", "Cauda", "Pinça", "Areia"],
  golem: ["Golem", "Pedra", "Colosso", "Muralha", "Bloco", "Titã"],
  ant: ["Formiga", "Obreira", "Colônia", "Mandíbula", "Trilha", "Enxame"],
  moth: ["Mariposa", "Asa", "Poeira", "Luz", "Pano", "Noite"],
  beetle: ["Besouro", "Élitro", "Casco", "Chifre", "Cerne", "Cocho"],
  crab: ["Caranguejo", "Pinça", "Casca", "Maré", "Concha", "Pedra"],
  jelly: ["Água-viva", "Gelatina", "Tentáculo", "Maré", "Véu", "Bolha"],
  imp: ["Diabrete", "Trapaça", "Chifre", "Cauda", "Sopro", "Riso"],
  sentinel: ["Sentinela", "Armadura", "Vigia", "Placa", "Guarda", "Elmo"],
  serpent: ["Serpente", "Escama", "Cobra", "Anel", "Língua", "Nó"],
  tome: ["Tomo", "Capa", "Página", "Lombada", "Tinta", "Conto"],
  glyph: ["Símbolo", "Marca", "Signo", "Runa", "Traço", "Sel"],
  note: ["Nota", "Eco", "Acorde", "Som", "Pulso", "Canto"],
  atom: ["Faísca", "Núcleo", "Órbita", "Centelha", "Prisma", "Cor"],
  crystal: ["Cristal", "Prisma", "Veio", "Aresta", "Luz", "Gema"],
  gear: ["Engrenagem", "Roda", "Dente", "Eixo", "Mola", "Ferro"],
  node: ["Nó", "Malha", "Fio", "Elo", "Ponto", "Trama"],
  prism: ["Prisma", "Refração", "Cor", "Face", "Vidro", "Luz"],
  vector: ["Dardo", "Vetor", "Ponta", "Rumo", "Traço", "Seta"],
  flask: ["Frasco", "Ampola", "Veneno", "Vapor", "Cristal", "Poção"],
  boss: ["Vulto", "Colosso", "Sombra", "Carrasco", "Guardião", "Espectro"],
};
const EPITETO = ["da Maré", "das Sombras", "do Ferro", "dos Ossos", "do Fogo", "da Névoa", "do Vale", "das Ruínas", "do Abismo", "da Costa", "do Bosque", "do Porto"];
const CHEFE_ADJ = ["O Vigia", "O Senhor", "A Rainha", "O Carrasco", "A Guardiã", "O Arauto", "O Devorador", "A Sombra", "O Rei", "A Serpente", "O Colosso", "A Chama"];
const PEOPLE = ["Ada", "Bruna", "Caio", "Dara", "Elias", "Fábio", "Gara", "Hélia", "Ivo", "Jana", "Kael", "Lia", "Mauro", "Nara", "Oriel", "Pia", "Quim", "Rafa", "Sara", "Tadeu", "Ulisses", "Vera", "Wanda", "Ximena", "Yara", "Zeca", "Alba", "Bento", "Cíntia", "Davi", "Ester", "Fausto", "Gilda", "Heitor", "Íris", "Joana", "Lapo", "Mila", "Nuno", "Olga"];
const EPITETOS = ["do Cais", "da Maré", "das Ruínas", "do Ferro", "dos Ecos", "da Névoa", "do Bosque", "dos Contos", "do Vento", "da Pedra", "do Fogo", "da Sombra"];
const FALAS = [
  "A maré mudou o caminho de novo. Olhe onde pisa.",
  "Não confie no que brilha no escuro; confie no que range.",
  "Já vi viajante voltar de lá. Não voltou inteiro.",
  "A forja come o que você traz. Traga bastante.",
  "Se ouvir um sino, não responda.",
  "As ruínas pagam bem a quem não tem pressa.",
  "O porto lembra de quem parte. Não sei se lembra de quem volta.",
  "Há um atalho pela costa, mas a costa tem dentes.",
  "Meu avô dizia que o mar não cobra entrada, só saída.",
  "Compre uma tocha. A escuridão não negocia.",
  "Se o bicho te viu primeiro, corra. Se não, bata.",
  "A pedra que você não abriu ainda está esperando.",
  "O chefe não dorme. Ele finge.",
  "O que você não carrega, alguém vai carregar.",
  "Não beba a água parada. Já foi gente.",
  "A costa dos contos é bonita de longe.",
  "Tem gente que desce e vira parte do lugar.",
  "A maré baixa mostra o que o porto escondeu.",
  "Contrato é contrato. Mas um pouco de ouro ajuda.",
];
const ABERTURA = [
  "Dizem que esta ruína foi erguida antes da maré.",
  "O vento entra por frestas que ninguém abriu.",
  "Há marcas de fogueira no chão, ainda mornas.",
  "Os antigos chamavam este lugar de casa.",
  "A pedra aqui é mais velha que o nome do porto.",
  "Alguém tentou construir em cima e desistiu no meio.",
  "O chão range como um navio velho.",
  "Há um sino sem badalo pendurado na parede.",
];
const MEIO = [
  "Quem passa perto ouve um nome que não é o seu.",
  "As pedras guardam nomes de quem tentou ficar.",
  "A água cobre o que a pressa deixou para trás.",
  "Há um caminho para baixo, e ele não está no mapa.",
  "As marcas na parede foram feitas por alguém com pressa.",
  "O sal come o ferro e deixa a forma.",
  "Os corvos daqui não cantam; esperam.",
  "Uma tocha acesa aqui dura menos que o normal.",
];
const FIM = [
  "Leve só o que puder carregar.",
  "Volte antes que a maré feche a passagem.",
  "Nem todo brilho é tesouro.",
  "O vale não cobra entrada; cobra saída.",
  "Se achar uma porta, bata antes de abrir.",
  "Alguém vai sentir falta do que você levar.",
];
const SITE_NOUN = {
  fountain: "Fonte", radio: "Torre", gate: "Portão", chip: "Forja", clock: "Relógio",
  cpu: "Núcleo", book: "Cripta", infinity: "Círculo", shape: "Pedra", curve: "Arco",
  dice: "Dados", tree: "Bosque", pendulum: "Pêndulo", wave: "Maré", heat: "Fornalha",
  prism: "Prisma", planet: "Observatório", table: "Mesa", molecule: "Nó", flask: "Frasco",
  fire: "Fogueira", scale: "Balança", note: "Sino", piano: "Teclado", speaker: "Voz",
  chart: "Mapa", network: "Malha", text: "Pergaminho", eye: "Olho", sign: "Placa",
  terminal: "Portal", chain: "Corrente",
};
const AREA_POR_ID = new Map(AREAS.map((a) => [a.id, a]));
const NOME_ANTIGO_NPC = new Map();

function areaDaSite(site) {
  return AREAS.find((a) => a.rect && site.x >= a.rect.x && site.x <= a.rect.x + a.rect.w && site.y >= a.rect.y && site.y <= a.rect.y + a.rect.h)
    || AREAS.find((a) => a.continent === site.continent)
    || null;
}
function areaDaCaverna(def) {
  const chave = String(def.id).replace(/^dungeon-/, "");
  return AREA_POR_ID.get(chave) || AREAS.find((a) => a.continent === def.continent) || null;
}
function regiao(continent) {
  return REGIAO[continent] || REGIAO.hub;
}
const PREFIXOS = {
  hub: ["Cais", "Fonte", "Torre", "Porto", "Muralha"],
  cs: ["Forja", "Torre", "Forte", "Oficina", "Cidadela", "Ferraria"],
  math: ["Jardim", "Praça", "Penhasco", "Enseada", "Canteiro", "Muralha"],
  physics: ["Costa", "Pico", "Forja", "Observatório", "Falésia", "Vale"],
  chem: ["Bosque", "Horto", "Alambique", "Mina", "Estufa", "Pântano"],
  music: ["Vale", "Coreto", "Pátio", "Cripta", "Sino", "Clareira"],
  ai: ["Névoa", "Vale", "Torre", "Olho", "Portal", "Abismo"],
  lingua: ["Costa", "Cripta", "Mercado", "Claustro", "Conto", "Varanda"],
  inter: ["Encruzilhada", "Praça", "Portão", "Ponte", "Marco", "Ilha"],
};
const MATERIA = {
  giz: "Pó", "ardósia": "Ardósia", cobre: "Cobre", vidro: "Vidro", ferro: "Ferro",
  "âmbar": "Âmbar", cristal: "Cristal", "cerâmica": "Barro", "silício": "Vidro",
  fibra: "Corda", papel: "Pergaminho", pergaminho: "Pergaminho", tinta: "Tinta",
  "ébano": "Ébano", "latão": "Latão", veludo: "Veludo", obsidiana: "Obsidiana",
  pedra: "Pedra", madeira: "Madeira", erva: "Erva",
};
const usadosArea = new Set();
function nomeDeArea(area) {
  const chave = area?.id || "area";
  const prefixos = PREFIXOS[area?.continent] || PREFIXOS.inter;
  const material = MATERIA[area?.biome?.material] || MATERIA[area?.biome?.floorKind] || "Pedra";
  for (let i = 0; i < prefixos.length; i++) {
    const base = `${prefixos[(hash(chave) + i) % prefixos.length]} de ${material}`;
    if (!usadosArea.has(base)) { usadosArea.add(base); return base; }
  }
  for (const qual of ["Antigo", "Perdido", "Partido", "Sombrio", "Esquecido", "Quebrado"]) {
    const extra = `${prefixos[hash(chave) % prefixos.length]} de ${material} ${qual}`;
    if (!usadosArea.has(extra)) { usadosArea.add(extra); return extra; }
  }
  for (const qual of ["do Norte", "da Maré", "dos Ossos", "das Brumas", "do Eco", "da Cinza", "do Sal", "do Vento", "da Aurora", "do Poente", "das Raízes", "do Trovão", "da Ferrugem", "do Silêncio", "das Sombras", "do Lodo"]) {
    const extra = `${prefixos[hash(chave) % prefixos.length]} de ${material} ${qual}`;
    if (!usadosArea.has(extra)) { usadosArea.add(extra); return extra; }
  }
  const unico = `${prefixos[hash(chave) % prefixos.length]} de ${material} ${usadosArea.size}`;
  usadosArea.add(unico);
  return unico;
}

export function nomeDeCriatura(nomeOriginal, kind = "slime", areaId = "") {
  const h = hash(`${nomeOriginal}|${kind}|${areaId}`);
  const base = pick(CRIATURA[kind] || CRIATURA.slime, h);
  const area = AREA_POR_ID.get(String(areaId).replace(/^dungeon-/, ""));
  const lugar = area ? nomeDeArea(area).split(" ").slice(-1)[0] : "";
  const epiteto = pick(EPITETO, h >>> 5);
  return (lugar && h % 3 === 0 ? `${base} ${epiteto} de ${lugar}` : `${base} ${epiteto}`).slice(0, 34);
}

export function nomeDeChefe(nomeOriginal, areaId = "") {
  const h = hash(`${nomeOriginal}|chefe|${areaId}`);
  const area = AREA_POR_ID.get(String(areaId).replace(/^dungeon-/, ""));
  const lugar = area ? nomeDeArea(area) : pick(["Ruína", "Maré", "Vale"], h);
  return `${pick(CHEFE_ADJ, h)} ${pick(["de", "da", "do"], h >>> 7)} ${lugar}`.slice(0, 38);
}

// O título da missão nasce do tipo de trabalho, não do nome de um estudioso.
function tituloDeMissao(q) {
  const area = AREA_POR_ID.get(q?.goal?.area) || null;
  const lugar = area ? ` de ${area.name}` : "";
  const base = {
    cards: ["Andarilho das Pedras", "Guia das Ruínas", "Batedor do Vale"],
    docks: ["Faroleiro da Costa", "Marujo das Ilhas", "Vigia do Cais"],
    hunts: ["Caçador dos Ossos", "Matador de Feras", "Batedor das Cavernas"],
    social: ["Voz da Maré", "Ouvinte do Porto"],
    bosses: ["Senhor das Ruínas", "Quebra-Guardiões", "Coroa Partida"],
  }[q?.goal?.type] || ["Viajante do Vale"];
  return pick(base, hash(q?.id)).replace(/ (d[aeo]s?|do) .*$/, "") + lugar;
}

export function nomeDeSala(room, indice = 0) {
  return SALA[indice % SALA.length];
}

function loreHtml(area, seed) {
  const h = hash(seed);
  const nome = area ? nomeDeArea(area) : "as ilhas";
  const p1 = `${pick(ABERTURA, h)} ${area ? `Este é um pedaço de ${nome}.` : ""}`;
  const p2 = pick(MEIO, h >>> 4);
  const p3 = pick(FIM, h >>> 8);
  return `<p>${p1}</p><p>${p2}</p><p>${p3}</p>`;
}

export function aplicarReskin() {
  usadosArea.clear();
  for (const [id, c] of Object.entries(CONTINENTS)) {
    const r = REGIAO[id];
    if (!r) continue;
    c.name = r.nome;
    c.sub = r.sub;
  }
  for (const [id, s] of Object.entries(SKILLS)) {
    const h = HABILIDADE[id];
    if (!h) continue;
    s.name = h.name;
    s.desc = h.desc;
  }
  for (const area of AREAS) {
    const nome = nomeDeArea(area);
    area.name = nome;
    area.sub = pick(SUB_AREA, hash(area.id));
    if (area.biome) { area.biome.name = nome; area.biome.short = area.sub; }
  }
  const usadosSitio = new Set();
  for (const site of SITES) {
    const area = areaDaSite(site);
    const noun = SITE_NOUN[site.icon] || "Santuário";
    const alvo = area ? area.name : regiao(site.continent).nome;
    let nome = "";
    for (let k = 0; k < EPITETOS.length && !nome; k++) {
      const cand = `${noun} ${pick(EPITETOS, hash(`${site.post}|${k}`))} · ${alvo}`;
      if (!usadosSitio.has(cand)) nome = cand;
    }
    if (!nome) nome = `${noun} · ${alvo} ${usadosSitio.size}`;
    usadosSitio.add(nome);
    site.name = nome;
    site.label = nome;
    const post = POSTS[site.post];
    if (post) {
      post.kicker = regiao(post.continent || site.continent).nome;
      post.title = nome;
      post.meta = `fragmento de lore · ${alvo}`;
      post.tags = ["lore"];
      post.lab = null;
      post.body = loreHtml(area, post.id || site.id || site.post);
    }
  }
  for (const way of WAYSTONES) {
    const area = AREA_POR_ID.get(way.id);
    way.name = `Farol de ${area ? area.name : regiao(way.continent).nome}`;
  }
  const equipamento = { weapon: "Espada", club: "Malho", sword: "Espada", wand: "Cajado", rod: "Bastão",
    helmet: "Elmo", armor: "Peitoral", shield: "Escudo", ring: "Anel", necklace: "Colar",
    legs: "Perneiras", boots: "Botas", cloak: "Capa" };
  const material = ["Ferro", "Cobre", "Vidro", "Âmbar", "Cristal", "Obsidiana", "Ébano", "Latão", "Prata", "Ouro", "Pedra", "Gelo"];
  const aindaAula = /matem|físic|químic|computa|álgebra|cálculo|teorema|axioma|átomo|molécula|neur|algorit|lógica|gramát|música|ciência|estud|aula|lição|curso|pergunta|prova|resposta|aprend|pensar|provar|gêmeo|binári|sinápt|music|literat|bibliotec|fonema|sintaxe|semânt|pragmát|discurso|narrat|poes|gramát|wiki|acervo|bit|byte|cpu|chip|dados|software|código|programa|engenh|estatíst|probabil|geometr|função|vetor|matriz|derivada|integral|fóton|quânt|elétron|célula|proteína|quanta|órbita|orbita|newton|einstein|tema|fita|sintaxe|fonema|semântic|discurso|redação|gênero|oralidade|léxico|imã|prisma|régua|compasso|relatividade|entropia|plasma|nuclear|sensor|autômato|turing/i;
  for (const [id, item] of Object.entries(ITEMS)) {
    if (!item || typeof item !== "object") continue;
    if (item.slot) {
      const base = equipamento[item.slot] || "Peça";
      const tipo = item.weapon && equipamento[item.weapon] ? equipamento[item.weapon] : base;
      item.name = `${tipo} de ${pick(material, hash(id))} ${pick(EPITETO, hash(id) >>> 4)}`;
      item.desc = "Uma peça de quem desce às ruínas e volta.";
    } else {
      if (item.name) item.name = cap(limpar(item.name));
      if (item.desc) item.desc = limpar(item.desc);
      if (aindaAula.test(`${item.name} ${item.desc || ""}`)) {
        const h = hash(id);
        const prefixo = item.heal || item.mana || item.use === "food" ? "Frasco" : item.relic ? "Talismã" : pick(["Fragmento", "Pedra", "Selo", "Cristal", "Âmbar"], h);
        item.name = `${prefixo} de ${pick(material, h >>> 4)} ${pick(EPITETO, h >>> 8)}`;
        item.desc = item.relic
          ? "Uma relíquia tirada das ruínas. +5 de vida máxima."
          : "Um achado de quem desce às ruínas e volta inteiro.";
      }
    }
  }
  const TIPO_CAVERNA = ["Gruta", "Cripta", "Mina", "Ruína", "Catacumba", "Caverna"];
  const usadosCaverna = new Set();
  for (const def of DUNGEONS) {
    const area = areaDaCaverna(def);
    // a área já foi renomeada acima: a caverna herda o nome dela
    const base = area ? area.name : "Ruínas Partidas";
    let nome = "";
    for (let k = 0; k < TIPO_CAVERNA.length && !nome; k++) {
      const cand = `${TIPO_CAVERNA[(hash(def.id) + k) % TIPO_CAVERNA.length]}: ${base}`.slice(0, 52);
      if (!usadosCaverna.has(cand)) nome = cand;
    }
    usadosCaverna.add(nome);
    def.name = nome;
    def.sub = pick(SUB_AREA, hash(`${def.id}|sub`));
    (def.rooms || []).forEach((room, i) => {
      room.name = nomeDeSala(room, i, def.id);
    });
  }
  for (const ground of GROUNDS) {
    ground.name = `Caçada ${regiao(ground.continent).adj}`;
    if (ground.boss?.name) ground.boss.name = nomeDeChefe(ground.boss.name, ground.id);
    for (const monster of ground.monsters || []) {
      monster.name = nomeDeCriatura(monster.name, monster.kind, ground.id);
    }
  }
  let i = 0;
  for (const [id, npc] of Object.entries(NPCS)) {
    if (!npc || typeof npc !== "object") continue;
    const antigo = npc.name;
    const nome = `${PEOPLE[i % PEOPLE.length]} ${EPITETOS[hash(id) % EPITETOS.length]}`;
    npc.name = nome;
    NOME_ANTIGO_NPC.set(antigo, nome);
    npc.label = pick(["guia da ilha", "gente da maré", "voz do porto", "morador das ruínas", "vigia da costa"], hash(`${id}|label`));
    npc.lines = [...Array(5)].map((_, k) => FALAS[(hash(`${id}|${k}`) + k) % FALAS.length]);
    i++;
  }
  for (const spawn of NPC_SPAWNS) {
    const npc = NPCS[spawn.id];
    if (npc) spawn.label = npc.name;
  }
  for (const q of QUESTS) {
    const tipo = q.goal?.type;
    // sistemas que deixaram de existir na superfície: a missão vira caçada
    if (tipo === "labs" || tipo === "quiz") q.goal = { ...q.goal, type: "hunts", count: q.goal.count || 3 };
    delete q.quiz; // não existe mais pergunta de missão na superfície
    const n = q.goal?.count || 1;
    q.title = {
      cards: `Pedras do caminho (${n})`,
      docks: `Faróis da costa (${n})`,
      hunts: `Caçada nas ruínas (${n})`,
      social: "Vozes da maré",
      bosses: `Senhores das ruínas (${n})`,
    }[q.goal?.type] || "Trabalho de viajante";
    q.brief = {
      cards: `Abra ${n} pedras antigas. O vale não cobra ordem, cobra caminhada.`,
      docks: `Pise em ${n} marcos da costa. Um farol só acende quando você chega.`,
      hunts: `Desça às ruínas e derrote ${n} criatura${n === 1 ? "" : "s"}. Volte com o que sobrar.`,
      social: "Fale com outro viajante no canal público e numa mensagem privada.",
      bosses: `Enfrente ${n} senhores das ruínas. Cada um guarda uma passagem.`,
    }[q.goal?.type] || "Alguém no porto precisa de uma mão.";
    if (q.giver && NOME_ANTIGO_NPC.has(q.giver)) q.giver = NOME_ANTIGO_NPC.get(q.giver);
    if (q.reward?.title) q.reward.title = tituloDeMissao(q);
  }
  // o fio da Iara também perde a moldura de aula
  const AJUSTE_CAPITULO = [
    [/A Prova do Número/g, "A Pedra que Mede"],
    [/A Máquina que Escuta/g, "A Engrenagem que Escuta"],
    [/em axiomas/g, "em pedras"],
    [/por provar que o mar não cabe no cálculo; a prova ficou/g, "por mostrar que o mar não cabe na medida; a marca ficou"],
    [/A IA não é a voz: é a sala onde a voz se perde\. /g, ""],
    [/a Rede só devolve/g, "a malha só devolve"],
    [/prova de que a Iara existiu/g, "sinal de que a Iara existiu"],
    [/ele pergunta o que você faria com ela/g, "ele cobra o que você faria com ela"],
    [/no desfecho da Grande Prova/g, "no desfecho do Julgamento"],
  ];
  for (const c of CAPITULOS) {
    let titulo = c.titulo;
    let lore = c.lore;
    for (const [re, troca] of AJUSTE_CAPITULO) { titulo = titulo.replace(re, troca); lore = lore.replace(re, troca); }
    c.titulo = limpar(titulo);
    c.lore = limpar(lore).replace(/a engrenagens/g, "a engrenagem").replace(/A ecos/g, "O eco").replace(/a malha/g, "a malha");
    c.fala = limpar(c.fala).replace(/A ecos/g, "O eco");
  }
  // as facções falam do vale, não de disciplina
  for (const f of FACCOES) {
    if (f.resumo) f.resumo = limpar(f.resumo);
    if (f.quer) f.quer = limpar(f.quer).replace(/a prova aberta/i, "o selo aberto");
    if (f.titulo) f.titulo = limpar(f.titulo);
  }
  const AJUSTE_ATO = [
    [/Ajudou o Porto a abrir a Biblioteca Afogada/g, "Ajudou o Porto a abrir o arquivo afogado"],
    [/Venceu o chefe dos fundamentos da Computação/g, "Venceu o senhor das ruínas do engenho"],
    [/Venceu o chefe dos fundamentos da Matemática/g, "Venceu o senhor das ruínas das formas"],
    [/Guardou a voz no acervo/g, "Guardou a voz no tesouro"],
    [/Tirou a voz do acervo/g, "Tirou a voz do tesouro"],
    [/Negou a prova à União/g, "Negou a voz à União"],
    [/Levou a prova para fora do cálculo/g, "Levou a voz para fora da União"],
    [/Abriu a prova para todos/g, "Abriu a voz para todos"],
    [/Abriu o que o Concílio guardava/g, "Abriu o que o Concílio guardava"],
  ];
  for (const a of ATOS) {
    if (!a.rotulo) continue;
    let r = a.rotulo;
    for (const [re, troca] of AJUSTE_ATO) r = r.replace(re, troca);
    a.rotulo = limpar(r);
  }
  // trajes: nome e descrição de fantasia, id e missão intactos
  const AJUSTE_TRAJE = {
    silicio: ["Traje de Vidro", "fios de cobre e vidro que brilham no escuro"],
    geometra: ["Traje de Formas", "linhas exatas e pó de giz"],
    luz: ["Traje de Luz", "lentes, marés e um cinto de ferramentas"],
    alquimista: ["Traje de Alquimista", "vidro âmbar e mãos que não tremem"],
    adivinho: ["Traje de Vidro", "sombras no bolso e um olho no futuro"],
    cacador: ["Traje de Caçador", "couro gasto de quem já atravessou o escuro"],
  };
  for (const o of OUTFITS) {
    if (AJUSTE_TRAJE[o.id]) [o.name, o.desc] = AJUSTE_TRAJE[o.id];
    if (o.id.startsWith("traje-")) {
      o.name = `Traje de ${pick(["Vidro", "Âmbar", "Cristal", "Ferro", "Obsidiana", "Sal"], hash(o.id))} ${pick(EPITETO, hash(o.id) >>> 4)}`;
      o.desc = `a roupa de quem explorou cada canto de ${AREA_POR_ID.get(o.id.replace(/^traje-/, ""))?.name || "uma ilha"}`;
    }
    if (o.desc && /pergunta|estud|aula|prova|disciplina|matéria/i.test(o.desc)) o.desc = "pano de quem já atravessou o escuro e voltou";
  }
  for (const pet of Object.values(PETS)) {
    pet.where = `Cidade ${regiao(pet.continent).adj}`;
    pet.name = pet.name.replace(/do Lema$/, "da Vigília").replace(/da Caixa$/, "do Vidro");
  }
}

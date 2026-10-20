// Texto das estações do catálogo: título, artigo, instrumento e as perguntas
// que saem dos tópicos da subárea. Fica separado do gerador para as estações
// das áreas antigas usarem exatamente o mesmo formato.

import { SECTION_TOPICS } from "./catalog-topics.js";
import { DISCIPLINES } from "./catalog.js";

const SMALL = new Set(["e", "de", "da", "do", "das", "dos", "em", "no", "na", "nos", "nas", "a", "o", "as", "os", "um", "uma", "para", "com", "por", "ao", "à"]);

export const titleCase = (text) => String(text || "").split(/\s+/).map((word, i) => {
  const clean = word.toLowerCase();
  if (word.length <= 5 && word === word.toUpperCase() && /[A-Z]/.test(word)) return word;
  if (i > 0 && SMALL.has(clean)) return clean;
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}).join(" ");

// artigo da área, para "Cripta dos Fundamentos" e não "Cripta da Fundamentos"
export function articleOf(name) {
  const m = /^Área (da|das|do|dos) (.+)$/.exec(String(name || ""));
  if (m) return { article: m[1], noun: m[2] };
  return { article: "da", noun: String(name || "").replace(/^Área /, "") };
}

export const ICONS = {
  math: ["shape", "infinity", "curve", "dice", "chart", "clock"],
  physics: ["pendulum", "wave", "planet", "heat", "prism", "scale"],
  chem: ["flask", "molecule", "fire", "table", "scale", "chain"],
  cs: ["chip", "cpu", "network", "terminal", "chart", "radio"],
  lingua: ["book", "text", "eye", "sign", "note", "chart"],
  inter: ["book", "chart", "eye", "terminal", "wave", "network"],
};

const LAB_RULES = [
  [/lógic|prova|demonstra|contraexemplo|argument/, "logic"],
  [/infinit|limite|série|sucess|assíntot/, "infinity"],
  [/derivada|integral|cálculo|equaç|diferen/, "calculus"],
  [/probab|estatístic|aleat|distribui|amostr/, "probability"],
  [/fractal|caos|dimens|topolog/, "fractal"],
  [/onda|frequên|harmônic|fourier|som|áudio|música/, "fourier"],
  [/movimento|força|pêndulo|cinemát|mecânic|inércia/, "motion"],
  [/calor|termodinâm|entropia|temperatura|energia livre/, "thermo"],
  [/luz|óptic|lente|cor|espectro|fóton/, "optics"],
  [/gravit|órbita|estrela|galáx|cosmo|planet|astro/, "gravity"],
  [/elemento|períod|tabela/, "periodic"],
  [/ligação|molécul|orbital|estrutura molecular/, "bonds"],
  [/ácido|base|ph|titula|equilíbrio|solução/, "titration"],
  [/oxida|reduç|eletroquím|bateria/, "energy"],
  [/equilíbrio químico|balanço|estequiometr/, "balance"],
  [/bit|binári|porta|circuito|somador/, "adder"],
  [/processo|concorr|thread|estado|sistema operacional/, "state"],
  [/cpu|processador|cache|pipeline|microarquitetura/, "cpu"],
  [/históri|étic|impacto/, "history"],
  [/linguagem|texto|token|semântic|palavra/, "language"],
  [/fala|voz|som|oral/, "echo"],
  [/aprendizado|neural|inteligência artificial|\bia\b|treinamento/, "learning"],
  [/visão|imagem|pixel/, "vision"],
];
const LAB_FALLBACK = {
  math: ["logic", "infinity", "calculus", "probability"],
  physics: ["motion", "optics", "gravity"],
  chem: ["periodic", "bonds", "titration"],
  cs: ["adder", "cpu", "state"],
  lingua: ["language", "echo", "history"],
  inter: ["learning", "fourier", "language"],
};

export function labFor(text, discipline, index) {
  const alvo = String(text || "").toLowerCase();
  for (const [re, lab] of LAB_RULES) if (re.test(alvo)) return lab;
  const list = LAB_FALLBACK[discipline] || LAB_FALLBACK.math;
  return list[index % list.length];
}

const html = (text) => String(text).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
export const topicLabel = (text) => String(text || "").trim().replace(/[.;:]$/, "").trim();
const hashText = (text) => {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  return h >>> 0;
};

// Corpo da página: a subárea, o que o catálogo lista nela e as vizinhas.
export function subareaBody({ sectionNum, sectionName, discipline, name, topics, siblings = [] }) {
  const disc = DISCIPLINES[discipline]?.name || DISCIPLINES.math.name;
  const lista = topics.map((t) => `<li>${html(t)}</li>`).join("");
  const vizinhas = siblings.filter((s) => s !== name);
  const linha = vizinhas.length
    ? `<p>Na mesma área: ${vizinhas.map((s) => `<em>${html(s)}</em>`).join(", ")}.</p>`
    : "";
  return `<p>Estação da subárea <strong>${html(name)}</strong>, na seção <strong>${html(sectionName)}</strong> de ${html(disc)}. O catálogo reúne aqui ${topics.length} ${topics.length === 1 ? "tópico" : "tópicos"}.</p><ul>${lista}</ul>${linha}`;
}

// Todas as subáreas de uma disciplina, para tirar alternativas quando a seção
// tem uma subárea só.
function poolDisciplina(discipline, sectionNum) {
  const out = [];
  for (const [num, sec] of Object.entries(SECTION_TOPICS)) {
    if (num === sectionNum || num[0] !== sectionNum[0]) continue;
    for (const [nome, topicos] of sec.subareas || []) out.push({ nome, topicos, secao: sec.name });
  }
  return out;
}

// Duas perguntas por subárea: uma pergunta o tópico, a outra pergunta o lugar.
// As alternativas saem do próprio catálogo, então a resposta é conferível.
export function subareaQuiz({ sectionNum, sectionName, discipline, subarea, siblings, salt = 0 }) {
  const nome = subarea.name;
  const topicos = subarea.topics;
  if (!topicos.length) return [];
  const secao = SECTION_TOPICS[sectionNum];
  const irmas = (secao.subareas || []).filter(([n]) => n !== nome);
  const outras = irmas.length >= 2 ? irmas : [...irmas, ...poolDisciplina(discipline, sectionNum).map((p) => [p.nome, p.topicos])];
  // pergunta 1: de quem é este tópico. Só serve tópico que não se repete em
  // outra subárea da mesma seção, senão a pergunta teria duas respostas.
  const unicos = topicos.filter((t) => {
    const alvo = topicLabel(t).toLowerCase();
    return !(secao.subareas || []).some(([n, l]) => n !== nome && l.some((x) => topicLabel(x).toLowerCase() === alvo));
  });
  const base = unicos.length ? unicos : topicos;
  const certo = base[hashText(nome + "topico" + salt) % base.length];

  const usados = new Set([nome, topicLabel(certo).toLowerCase()]);
  const alternativas = [];
  for (const [n, lista] of outras) {
    if (usados.has(n) || !lista.length) continue;
    const topico = lista[hashText(n + salt) % lista.length];
    const rotulo = topicLabel(topico).toLowerCase();
    if (usados.has(rotulo)) continue;
    usados.add(n);
    usados.add(rotulo);
    alternativas.push({ nome: n, topico });
    if (alternativas.length >= 2) break;
  }
  if (alternativas.length < 2) return [];
  const d1 = alternativas[0], d2 = alternativas[1];
  const opcoes1 = [certo, d1.topico, d2.topico];
  const pos = hashText(nome + "pos" + salt) % 3;
  const opts1 = [...opcoes1];
  [opts1[0], opts1[pos]] = [opts1[pos], opts1[0]];
  const pergunta1 = {
    q: `Qual destes tópicos o catálogo coloca na subárea ${nome}, dentro de ${sectionName}?`,
    options: opts1.map(topicLabel),
    a: opts1.indexOf(certo),
    why: `No catálogo, "${topicLabel(certo)}" está em ${nome}, dentro de ${sectionName}. "${topicLabel(d1.topico)}" fica em ${d1.nome} e "${topicLabel(d2.topico)}" em ${d2.nome}.`,
  };

  // pergunta 2: onde mora este tópico
  const nomes = [nome, d1.nome, d2.nome];
  const pos2 = hashText(nome + "pos2" + salt) % 3;
  const opts2 = [...nomes];
  [opts2[0], opts2[pos2]] = [opts2[pos2], opts2[0]];
  const pergunta2 = {
    q: `O tópico "${topicLabel(certo)}" aparece em qual subárea do catálogo?`,
    options: opts2,
    a: opts2.indexOf(nome),
    why: `${topicLabel(certo)} é um dos tópicos de ${nome}, na seção ${sectionName}. As outras duas opções são ${d1.nome} e ${d2.nome}.`,
  };
  return [pergunta1, pergunta2];
}

// Seção sem subárea (as interseções, por exemplo): reparte os tópicos em três
// trilhas, cada uma com a sua página.
export function trilhas(topics, quantas = 3) {
  const grupos = Array.from({ length: quantas }, () => []);
  topics.forEach((t, i) => grupos[i % quantas].push(t));
  return grupos.filter((g) => g.length);
}

// Perguntas de uma trilha: qual tópico está nesta parte e em qual parte está
// este tópico. As três partes são a própria divisão da página.
export function trilhaQuiz({ sectionName, groups, index, salt = 0 }) {
  const topicos = groups[index] || [];
  if (!topicos.length || groups.length < 2) return [];
  const certo = topicos[hashText(sectionName + index + salt) % topicos.length];
  const outros = [];
  for (let passo = 1; passo < groups.length && outros.length < 2; passo++) {
    const g = groups[(index + passo) % groups.length];
    const t = g[hashText(sectionName + passo + salt) % g.length];
    if (topicLabel(t).toLowerCase() !== topicLabel(certo).toLowerCase()) outros.push(t);
  }
  if (outros.length < 2) return [];
  const opcoes = [certo, outros[0], outros[1]];
  const pos = hashText(sectionName + "trilha" + salt) % 3;
  [opcoes[0], opcoes[pos]] = [opcoes[pos], opcoes[0]];
  const partes = groups.map((_, i) => `Parte ${i + 1}`);
  return [{
    q: `Qual destes tópicos o catálogo lista na parte ${index + 1} da seção ${sectionName}?`,
    options: opcoes.map(topicLabel),
    a: opcoes.indexOf(certo),
    why: `A seção ${sectionName} está dividida em ${groups.length} partes. "${topicLabel(certo)}" está na parte ${index + 1}; as outras duas opções vêm de outras partes.`,
  }, {
    q: `Em qual parte da seção ${sectionName} o catálogo lista "${topicLabel(certo)}"?`,
    options: partes,
    a: index,
    why: `"${topicLabel(certo)}" aparece na parte ${index + 1} da seção, junto com os outros tópicos daquela trilha.`,
  }];
}

// Texto das estações do catálogo: título, artigo, instrumento e as perguntas
// que saem dos tópicos da subárea. Fica separado do gerador para as estações
// das áreas antigas usarem exatamente o mesmo formato.

import { SECTION_TOPICS } from "./catalog-topics.js";
import { CATALOG_BY_ID, DISCIPLINES, catalogNeighbors } from "./catalog.js";
import { MATH_TEXT } from "./text/math.js";
import { PHYSICS_TEXT } from "./text/physics.js";
import { CHEM_TEXT } from "./text/chem.js";
import { CS_A_TEXT } from "./text/cs-a.js";
import { CS_B_TEXT } from "./text/cs-b.js";
import { LINGUA_TEXT } from "./text/lingua.js";

// texto curado por disciplina; o que ainda não tem curadoria usa só a lista
const CURADO = { math: MATH_TEXT, physics: PHYSICS_TEXT, chem: CHEM_TEXT, cs: { ...CS_A_TEXT, ...CS_B_TEXT }, lingua: LINGUA_TEXT };

const SMALL = new Set(["e", "de", "da", "do", "das", "dos", "em", "no", "na", "nos", "nas", "a", "o", "as", "os", "um", "uma", "para", "com", "por", "ao", "à"]);

export const titleCase = (text) => String(text || "").split(/\s+/).map((word, i) => {
  const clean = word.toLowerCase();
  if (word.length <= 5 && word === word.toUpperCase() && /[A-Z]/.test(word)) return word;
  if (i > 0 && SMALL.has(clean)) return clean;
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}).join(" ");

// artigo da área, para "Cripta dos Fundamentos" e não "Cripta da Fundamentos"
export function articleOf(name) {
  const m = /^Área (de|da|das|do|dos) (.+)$/.exec(String(name || ""));
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

// Uma linha de respiro antes da lição. Muda com o nome da pedra, então duas
// páginas vizinhas não abrem com a mesma frase.
const EPIGRAFES = [
  "Há pedras que só se abrem quando alguém para.",
  "O vale não explica. Mostra.",
  "Quem passou antes deixou uma marca. Quem passa agora deixa outra.",
  "Toda pergunta volta com outra roupa.",
  "O caminho entre saber e ver é mais curto do que parece.",
  "A pedra está fria. O que ela guarda, não.",
  "Nada aqui pede pressa.",
  "O que se aprende aqui já estava no chão, esperando um nome.",
  "O silêncio também ensina; ele só não avisa.",
  "Há mais de um jeito de chegar à mesma resposta.",
];

export function epigrafe(name) {
  return EPIGRAFES[hashText(String(name || "")) % EPIGRAFES.length];
}

// Corpo da pedra: a abertura curada, as marcas da subárea e os caminhos
// vizinhos, sem falar de catálogo ou de página para quem está lendo.
// Com lição escrita (js/text/licoes.js), a página vira o curso de seis partes
// que o totem promete: o que é, como se usa, onde quebra, o que perguntam,
// para levar e com as mãos.
const frase = (texto) => {
  const limpo = String(texto || "").trim();
  if (!limpo) return "";
  return /[.!?]$/.test(limpo) ? limpo : `${limpo}.`;
};

export function subareaBody({ sectionNum, sectionName, discipline, name, topics, siblings = [], catalogId = null, licao = null, bankTopic = null, perguntas = [], extra = null }) {
  const lista = topics.map((t) => `<li>${html(t)}</li>`).join("");
  const vizinhas = siblings.filter((s) => s !== name);
  const curado = extra || CURADO[discipline]?.[`${sectionNum}|${name}`] || CURADO[discipline]?.[name];
  const abertura = curado
    ? `<p>${curado.abre}</p>`
    : `<p>Uma pedra baixa, coberta de marcas. ${html(name)}, no caminho de ${html(sectionName)}.</p>`;
  const pratica = curado ? `<p><strong>Com as mãos.</strong> ${curado.pratica}</p>` : "";
  const erro = curado ? `<p><strong>O passo em falso.</strong> ${curado.erro}</p>` : "";
  // as conexões são as áreas ligadas por ponte ou túnel no mapa
  const areasVizinhas = catalogId
    ? catalogNeighbors(catalogId).slice(0, 4).map((id) => CATALOG_BY_ID.get(id)?.short).filter(Boolean)
    : [];
  const conexoes = areasVizinhas.length
    ? `<p>Os caminhos daqui seguem para ${areasVizinhas.map((v) => `<em>${html(v)}</em>`).join(", ")}.</p>`
    : "";
  const linha = vizinhas.length
    ? `<p>Na mesma área, outras pedras: ${vizinhas.map((s) => `<em>${html(s)}</em>`).join(", ")}.</p>`
    : "";
  if (!licao) {
    return `<p class="page-epigrafe">${epigrafe(name)}</p>${abertura}<p><strong>${html(name)}</strong> é o nome desta pedra, no caminho de ${html(sectionName)}. Ela guarda ${topics.length} ${topics.length === 1 ? "marca" : "marcas"}.</p><ul>${lista}</ul>${pratica}${erro}${conexoes}${linha}`;
  }
  const marcas = Array.isArray(bankTopic?.keys) ? bankTopic.keys : [];
  const listaPerguntas = [...perguntas, licao.pergunta].filter((q) => q && q.q);
  const perguntam = listaPerguntas
    .filter((q) => q && q.q)
    .map((q) => {
      const certa = Array.isArray(q.o) ? q.o[q.a] : q.answer;
      return `<p><em>Se perguntarem</em> ${html(q.q)} <em>a resposta é</em> <strong>${html(certa || "")}</strong>. ${frase(q.why)}</p>`;
    })
    .join("");
  return [
    `<p class="page-epigrafe">${epigrafe(name)}</p>`,
    abertura,
    `<p><strong>O que é.</strong> ${frase(licao.oQue)} ${frase(bankTopic?.def)}</p>`,
    marcas.length ? `<p>${marcas.map(frase).join(" ")}</p>` : "",
    `<p><strong>Como se usa.</strong> O caminho é sempre o mesmo, e o exemplo abaixo faz ele inteiro.</p>`,
    `<ol>${(licao.passos || []).map((p) => `<li>${frase(p)}</li>`).join("")}</ol>`,
    `<p>${frase(licao.exemplo)}</p>`,
    `<p><strong>Onde quebra.</strong> ${frase(bankTopic?.mistake)} ${frase(licao.quebra)}</p>`,
    perguntam ? `<p><strong>O que perguntam.</strong> O bicho da área cobra a ideia, não a decoreba. Estes são os formatos que já apareceram:</p>${perguntam}` : "",
    `<blockquote><strong>Para levar.</strong> ${frase(licao.levar)}</blockquote>`,
    `<p><strong>Com as mãos.</strong> ${frase(licao.maos)}</p>`,
    `<p><strong>As marcas desta pedra.</strong> ${topics.length} ${topics.length === 1 ? "marca" : "marcas"} para reconhecer no caminho: </p><ul>${lista}</ul>`,
    pratica,
    erro,
    conexoes,
    linha,
  ].filter(Boolean).join("");
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
  const outras = [...irmas, ...poolDisciplina(discipline, sectionNum).map((p) => [p.nome, p.topicos])];
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
    if (alternativas.length >= 4) break;
  }
  if (alternativas.length < 4) return [];
  const d1 = alternativas[0];
  const opcoes1 = [certo, ...alternativas.slice(0, 4).map((a) => a.topico)];
  const pos = hashText(nome + "pos" + salt) % opcoes1.length;
  const opts1 = [...opcoes1];
  [opts1[0], opts1[pos]] = [opts1[pos], opts1[0]];
  const pergunta1 = {
    q: `Qual destes tópicos o catálogo coloca na subárea ${nome}, dentro de ${sectionName}?`,
    options: opts1.map(topicLabel),
    a: opts1.indexOf(certo),
    why: `No catálogo, "${topicLabel(certo)}" está em ${nome}, dentro de ${sectionName}. As outras opções vêm de subáreas vizinhas, como ${d1.nome}.`,
  };

  // pergunta 2: onde mora este tópico
  const nomes = [nome, ...alternativas.slice(0, 4).map((a) => a.nome)];
  const pos2 = hashText(nome + "pos2" + salt) % nomes.length;
  const opts2 = [...nomes];
  [opts2[0], opts2[pos2]] = [opts2[pos2], opts2[0]];
  const pergunta2 = {
    q: `O tópico "${topicLabel(certo)}" aparece em qual subárea do catálogo?`,
    options: opts2,
    a: opts2.indexOf(nome),
    why: `${topicLabel(certo)} é um dos tópicos de ${nome}, na seção ${sectionName}. As outras opções são subáreas vizinhas, como ${d1.nome}.`,
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
  const usados = new Set([topicLabel(certo).toLowerCase()]);
  const outros = [];
  for (let passo = 1; passo < groups.length && outros.length < 4; passo++) {
    const g = groups[(index + passo) % groups.length];
    for (let k = 0; k < g.length && outros.length < 4; k++) {
      const t = g[(hashText(sectionName + passo + salt) + k) % g.length];
      const rotulo = topicLabel(t).toLowerCase();
      if (usados.has(rotulo)) continue;
      usados.add(rotulo);
      outros.push(t);
    }
  }
  if (outros.length < 4) return [];
  const opcoes = [certo, ...outros];
  const pos = hashText(sectionName + "trilha" + salt) % opcoes.length;
  [opcoes[0], opcoes[pos]] = [opcoes[pos], opcoes[0]];
  const partes = groups.map((_, i) => `Parte ${i + 1}`);
  for (const extra of ["Todas as partes", "Nenhuma destas partes", "Fora da seção"]) {
    if (partes.length >= 5) break;
    partes.push(extra);
  }
  const certaParte = `Parte ${index + 1}`;
  const opcoesParte = [certaParte, ...partes.filter((p) => p !== certaParte).slice(0, 4)];
  const posParte = hashText(sectionName + "parte" + salt) % opcoesParte.length;
  [opcoesParte[0], opcoesParte[posParte]] = [opcoesParte[posParte], opcoesParte[0]];
  return [{
    q: `Qual destes tópicos o catálogo lista na parte ${index + 1} da seção ${sectionName}?`,
    options: opcoes.map(topicLabel),
    a: opcoes.indexOf(certo),
    why: `A seção ${sectionName} está dividida em ${groups.length} partes. "${topicLabel(certo)}" está na parte ${index + 1}; as outras opções vêm de partes vizinhas.`,
  }, {
    q: `Em qual parte da seção ${sectionName} o catálogo lista "${topicLabel(certo)}"?`,
    options: opcoesParte,
    a: opcoesParte.indexOf(certaParte),
    why: `"${topicLabel(certo)}" aparece na parte ${index + 1} da seção, junto com os outros tópicos daquela trilha.`,
  }];
}

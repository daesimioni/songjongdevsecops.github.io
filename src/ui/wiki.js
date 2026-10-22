// A wiki do vale. Ela não tem texto próprio: o índice é montado dos mesmos
// módulos que o jogo usa (área, caverna, bicho, item, missão, NPC, vocação e
// página), então o que entra no jogo entra na wiki. A busca e as categorias
// são só uma vista sobre esse índice.
import { AREAS, WAYSTONES, CONTINENTS } from "../content/config.js";
import { DISCIPLINES } from "../content/catalog.js";

import { DUNGEONS } from "../content/dungeon-data.js";
import { focusFirstVisible } from "./search-ui.js";
import { ITEMS, MONSTER_LABELS, MONSTER_WEAKNESS, RELICS, RECIPES, ENCHANTS, SKILLS, TIERS } from "../content/rpg-data.js";
import { QUESTS } from "../gameplay/quests.js";
import { POSTS, NPCS } from "../content/content.js";
import { FAUNA, BIOMES } from "../content/identity.js";
import { VOCACOES } from "../content/vocations.js";
import { PETS, MOUNTS } from "../content/pets.js";
import { OUTFITS } from "../content/outfits.js";
import { itemIconCanvas } from "../rendering/item-art.js";
import { drawCreatureArt } from "../rendering/creature.js";
import { drawPetSprite } from "../rendering/pet-art.js";

const CATEGORIAS = [
  { id: "tudo", nome: "Tudo" },
  { id: "mundo", nome: "Mundo" },
  { id: "cavernas", nome: "Cavernas" },
  { id: "criaturas", nome: "Criaturas" },
  { id: "itens", nome: "Itens" },
  { id: "receitas", nome: "Receitas" },
  { id: "encantamentos", nome: "Encantos" },
  { id: "reliquias", nome: "Relíquias" },
  { id: "pets", nome: "Pets" },
  { id: "missoes", nome: "Missões" },
  { id: "npcs", nome: "NPCs" },
  { id: "paginas", nome: "Páginas" },
  { id: "trajes", nome: "Trajes" },
  { id: "vocacoes", nome: "Vocações" },
  { id: "sistemas", nome: "Sistemas" },
];

const CAVERNA_POR_AREA = new Map(DUNGEONS.map((d) => [d.id.replace(/^dungeon-/, ""), d]));
const PEDRA_POR_AREA = new Map(WAYSTONES.map((w) => [w.id, w]));
const NOME_POR_ID = new Map(AREAS.map((a) => [a.id, a.name]));
const MATERIAL_POR_AREA = new Map(AREAS.map((a) => [a.id, BIOMES[a.id]?.material || ""]));

const OBJETIVO = {
  cards: "abrir pedras",
  creatures: "vencer criaturas",
  bosses: "vencer chefes",
  gather: "colher materiais",
  delivery: "entregar item",
  dungeon: "descer numa caverna",
  explore: "explorar lugares",
  fish: "pescar",
};

function normalizar(texto) {
  return String(texto || "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase();
}

// Resumos dos sistemas que não saem de uma tabela. Ficam aqui curtos de
// propósito: a wiki aponta o comando e a regra, não escreve um manual.
export const COMO_JOGAR = [
  {
    nome: "A Grande Prova",
    resumo: "o evento de três fases que abre o acervo; a escolha fica no save",
    campos: [
      ["Abertura", "a corrente das sete missões da Biblioteca Afogada"],
      ["Fases", "três; a fase 2 revela a habilidade e a 3 aperta a pergunta"],
      ["Desfecho", "guardar, devolver ou abrir; a escolha não pode ser refeita"],
    ],
  },
  {
    nome: "Começando",
    resumo: "criar a chave, escolher a vocação e acordar no porto",
    campos: [
      ["Conta", "a chave é a conta; sem chave o vale abre, a Rede não"],
      ["Vocação", "a última decisão da criação, e não dá para entrar sem ela"],
      ["Primeiro passo", "a Fonte das Boas-vindas, no Porto do Início"],
    ],
  },
  {
    nome: "O fio da Iara",
    resumo: "sete capítulos que dão fio às missões do vale",
    campos: [
      ["Abertura", "o primeiro capítulo abre com Três pedras, no porto"],
      ["Ordem", "cada capítulo pede a missão do continente e o anterior lido"],
      ["Leitura", "o Diário (Z) mostra o lido, o aberto e o que falta"],
    ],
  },
  {
    nome: "Andar e interagir",
    resumo: "WASD ou setas, clique no chão, arrastar para guiar",
    campos: [
      ["Teclas", "W A S D ou setas; clique no chão; arraste para seguir"],
      ["Interagir", "F perto do objeto, ou o menu de contexto"],
      ["Nave", "Espaço liga e desliga a nave na superfície"],
    ],
  },
  {
    nome: "Combate",
    resumo: "cada bicho é uma pergunta de cinco alternativas",
    campos: [
      ["Regra", "acertar tira vida do bicho; errar custa vida sua"],
      ["Magia", "teclas 1 a 6 usam as runas aprendidas e gastam mana"],
      ["Fuga", "sair do cone de visão evita o encontro"],
    ],
  },
  {
    nome: "Itens e equipamento",
    resumo: "mochila de 40 espaços, oito peças de equipamento e forja",
    campos: [
      ["Mochila", "I abre; clicar no item mostra usar, equipar e descartar"],
      ["Equipamento", "arma, armadura, elmo, escudo, anel, colar, pernas e botas"],
      ["Forja", "a cidade subterrânea funde runas, encantos e receitas"],
    ],
  },
  {
    nome: "Cavernas",
    resumo: "descer, acender a tocha, achar o chefe e voltar",
    campos: [
      ["Entrada", "F na boca da caverna; a boca do fundo tem outra saída"],
      ["Tocha", "acende por tempo e aumenta o alcance da luz"],
      ["Saída", "Esc sobe pela escada, sem perder o que achou"],
    ],
  },
  {
    nome: "Coleta e pesca",
    resumo: "árvore, água e veio respondem com uma pergunta",
    campos: [
      ["Alvos", "árvore, água, veio e canteiro; F responde"],
      ["Raridade", "acertar rende material; peixe raro pede duas perguntas"],
      ["Clima", "chuva rende mais na coleta"],
    ],
  },
  {
    nome: "Missões e diário",
    resumo: "NPC pede, o diário guarda e a recompensa paga",
    campos: [
      ["Aceitar", "F no NPC; o pedido entra no diário"],
      ["Acompanhar", "Z mostra o que falta e o quanto"],
      ["Recompensa", "XP, título e uma peça do assunto da área"],
    ],
  },
  {
    nome: "Pets e montarias",
    resumo: "domar um bicho, dar ração e montar na cidade",
    campos: [
      ["Pet", "segue, ajuda no duelo e tem passivo próprio"],
      ["Montaria", "comprada na cidade; acelera e não entra em caverna"],
      ["Troca", "a mesa da cidade troca vocação e subcategoria"],
    ],
  },
  {
    nome: "Viagem",
    resumo: "ponte para a vizinha, pedra do porto e túnel da conurbação",
    campos: [
      ["A pé", "cada ilha liga à vizinha por ponte ou picada"],
      ["Pedra do porto", "acende para quem já chegou longe"],
      ["Túnel", "a conurbação passa por baixo das fronteiras"],
    ],
  },
  {
    nome: "Rede e praça",
    resumo: "a conversa é Nostr, e a chave é sua",
    campos: [
      ["Chave", "feita no navegador, sem cadastro; quem tem a chave tem a conta"],
      ["Canais", "por região, e mensagem privada"],
      ["Praça", "quem está na mesma sala vê o boneco e a fala"],
    ],
  },
  {
    nome: "Progressão",
    resumo: "pedra abre, diário marca, nível sobe",
    campos: [
      ["Pedras", "454 páginas; cada uma marca o diário e dá XP"],
      ["Nível", "sobe com XP de pedra, missão e bicho"],
      ["Névoa", "cobre o que você ainda não andou"],
    ],
  },
  {
    nome: "Salvamento",
    resumo: "o save vive no navegador, com backup",
    campos: [
      ["Onde", "armazenamento local do navegador"],
      ["Backup", "o menu de backup exporta e importa o save"],
      ["Sem storage", "a sessão vale só até fechar a aba"],
    ],
  },
];

function nomeItem(id) {
  return ITEMS[id]?.name || id || "";
}

// ---- índice ---------------------------------------------------------------

export function construirIndice() {
  const saida = [];
  const add = (cat, nome, resumo, campos = [], extra = {}) => {
    const limpos = campos.filter(([, v]) => v !== undefined && v !== null && String(v).trim() !== "");
    const busca = normalizar([nome, resumo, cat, ...limpos.flat()].join(" "));
    saida.push({ cat, nome, resumo, campos: limpos, busca, ...extra });
  };

  // Mundo: uma entrada por área.
  for (const area of AREAS) {
    const bio = BIOMES[area.id] || {};
    const disc = DISCIPLINES[bio.discipline];
    const cave = CAVERNA_POR_AREA.get(area.id);
    const pedra = PEDRA_POR_AREA.get(area.id);
    const campos = [
      ["Disciplina", disc?.name || bio.discipline || ""],
      ["Continente", CONTINENTS[bio.continent]?.name || bio.continent || ""],
      ["Material", bio.material || ""],
      ["Pedra", pedra ? (pedra.label || pedra.name || "farol da área") : ""],
      ["Caverna", cave ? cave.name : ""],
      ["Chefe da caverna", cave?.boss || ""],
    ];
    add("mundo", area.name, bio.name || area.sub || "", campos, { tags: [area.id, bio.material || ""], icone: { tipo: "bioma", bioma: bio } });
  }

  // Cavernas: uma entrada por caverna, com salas, chefe e equipamento.
  for (const d of DUNGEONS) {
    const areaId = d.id.replace(/^dungeon-/, "");
    const campos = [
      ["Área", NOME_POR_ID.get(areaId) || CONTINENTS[d.continent]?.name || ""],
      ["Continente", CONTINENTS[d.continent]?.name || d.continent || ""],
      ["Material", d.material || MATERIAL_POR_AREA.get(areaId) || ""],
      ["Salas", d.rooms?.length ? String(d.rooms.length) : ""],
      ["Chefe", d.boss || ""],
      ["Equipamento", (d.equipment || []).map(nomeItem).join(", ")],
    ];
    add("cavernas", d.name, d.sub || "", campos, { tags: [areaId, d.id], icone: { tipo: "caverna", accent: d.accent || BIOMES[areaId]?.accent || "#ffc857" } });
  }

  // Criaturas: a fauna de cada área, mais os chefes das cavernas.
  for (const [areaId, lista] of Object.entries(FAUNA)) {
    const areaNome = NOME_POR_ID.get(areaId) || BIOMES[areaId]?.name || areaId;
    for (const bicho of lista) {
      const tipo = MONSTER_LABELS[bicho.kind] || bicho.kind || "";
      add("criaturas", bicho.name, `${tipo} de ${areaNome}`, [
        ["Área", areaNome],
        ["Tipo", tipo],
        ["Fraqueza", MONSTER_WEAKNESS[bicho.kind] || ""],
      ], { tags: ["bicho", bicho.kind], icone: { tipo: "bicho", kind: bicho.kind, accent: bicho.accent || BIOMES[areaId]?.accent || "#61f4c0" } });
    }
  }
  for (const d of DUNGEONS) {
    if (!d.boss) continue;
    add("criaturas", d.boss, `chefe de ${d.name}`, [
      ["Caverna", d.name],
      ["Papel", "chefe do fundo"],
    ], { tags: ["chefe", d.id] });
  }

  // Itens: o catálogo inteiro, com o tipo e a origem.
  for (const item of Object.values(ITEMS)) {
    if (!item?.name) continue;
    add("itens", item.name, item.desc || "", [
      ["Tipo", item.slot || item.weapon || ""],
      ["Origem", CONTINENTS[item.continent]?.name || item.continent || ""],
      ["Descrição", item.desc || ""],
    ], { tags: [item.id || "", item.slot || ""], icone: { tipo: "item", item } });
  }

  // Missões: quem pede, o que fazer e o que paga.
  for (const q of QUESTS) {
    const objetivo = OBJETIVO[q.goal?.type] || q.goal?.type || "";
    const pagamento = [
      q.reward?.xp ? `${q.reward.xp} XP` : "",
      q.reward?.title || "",
      q.reward?.item ? nomeItem(q.reward.item) : "",
    ].filter(Boolean).join(" · ");
    add("missoes", q.title, `de ${q.giver || q.npc}`, [
      ["Quem pede", q.giver || q.npc || ""],
      ["Objetivo", q.goal ? `${objetivo}${q.goal.count ? ` (${q.goal.count})` : ""}` : ""],
      ["Recompensa", pagamento],
      ["Brief", q.brief || ""],
    ], { tags: [q.npc || "", q.goal?.type || ""] });
  }

  // NPCs: nome, primeira fala e quantas falas tem.
  for (const [id, npc] of Object.entries(NPCS)) {
    const linhas = Array.isArray(npc.lines) ? npc.lines : [];
    add("npcs", npc.name || id, linhas[0] || "", [
      ["Fala", linhas[0] || ""],
      ["Falas", linhas.length ? String(linhas.length) : ""],
    ], { tags: [id] });
  }

  // Páginas: as 454 pedras, com atalho para abrir a página.
  for (const [id, post] of Object.entries(POSTS)) {
    if (!post?.title) continue;
    add("paginas", post.title, post.kicker || "", [
      ["Seção", post.kicker || ""],
      ["Data", post.date || ""],
      ["Marcas", (post.tags || []).join(", ")],
      ["Continente", CONTINENTS[post.continent]?.name || post.continent || ""],
    ], { tags: post.tags || [], abrir: id });
  }

  // Vocações: força, fraqueza e subcategorias.
  for (const v of VOCACOES) {
    const subs = (v.subs || []).map((s) => `${s.name}: ${s.efeito || s.desc || ""}`);
    add("vocacoes", v.name, v.forca || "", [
      ["Força", v.forca || ""],
      ["Fraqueza", v.fraqueza || ""],
      ["Subcategorias", subs.join(" · ")],
    ], { tags: ["vocacao", ...(v.subs || []).map((s) => s.id)] });
  }

  // Receitas: o que sai, quanto sai e o que gasta.
  for (const receita of RECIPES) {
    const saidaItem = ITEMS[receita.out]?.name || receita.out;
    const precisa = Object.entries(receita.need || {})
      .map(([id, n]) => `${n}x ${ITEMS[id]?.name || id}`)
      .join(", ");
    add("receitas", receita.name, `produz ${receita.qty || 1}x ${saidaItem}`, [
      ["Produz", `${receita.qty || 1}x ${saidaItem}`],
      ["Ingredientes", precisa],
      ["Onde", "forja da cidade"],
    ], { tags: ["receita", receita.out] });
  }

  // Encantamentos de equipamento.
  for (const enc of ENCHANTS) {
    const precisa = Object.entries(enc.need || {})
      .map(([id, n]) => `${n}x ${ITEMS[id]?.name || id}`)
      .join(", ");
    add("encantamentos", enc.name, enc.desc || "", [
      ["Efeito", enc.desc || ""],
      ["Ingredientes", precisa],
    ], { tags: ["encanto", enc.id] });
  }

  // Relíquias: uma por área, guardada no fundo da caverna.
  for (const rel of Object.values(RELICS)) {
    const areaId = String(rel.id || "").replace(/-reliquia$/, "");
    const cave = CAVERNA_POR_AREA.get(areaId);
    add("reliquias", rel.name, rel.desc || "", [
      ["Área", NOME_POR_ID.get(areaId) || areaId],
      ["Caverna", cave?.name || ""],
      ["Efeito", rel.desc || ""],
    ], { tags: ["reliquia", areaId], icone: { tipo: "gema", accent: rel.accent || "#ffc857" } });
  }

  // Pets e montarias: como se consegue e o que cada um faz.
  for (const [id, pet] of Object.entries(PETS)) {
    const passivo = Object.entries(pet.passive || {}).map(([k, v]) => `${k} +${v}`).join(", ");
    add("pets", pet.name, `pet de ${CONTINENTS[pet.continent]?.name || pet.continent || ""}`, [
      ["Tipo", "pet"],
      ["Origem", pet.where || ""],
      ["Passivo", passivo],
      ["Habilidade", pet.ability ? `${pet.ability.name}: ${pet.ability.desc}${pet.ability.mana ? ` (mana ${pet.ability.mana})` : ""}` : ""],
    ], { tags: ["pet", id], icone: { tipo: "pet", kind: pet.kind } });
  }
  for (const [id, mont] of Object.entries(MOUNTS)) {
    const preco = Object.entries(mont.price || {})
      .map(([k, v]) => `${v}x ${ITEMS[k]?.name || k}`)
      .join(", ");
    add("pets", mont.name, "montaria", [
      ["Tipo", "montaria"],
      ["Velocidade", mont.speed ? `${mont.speed}x` : ""],
      ["Preço", preco],
      ["Efeito", mont.desc || ""],
    ], { tags: ["montaria", id] });
  }

  // Trajes: o que muda é a cor, não o atributo.
  for (const traje of OUTFITS) {
    add("trajes", traje.name, traje.desc || "", [
      ["Continente", CONTINENTS[traje.continent]?.name || traje.continent || ""],
      ["Descrição", traje.desc || ""],
    ], { tags: ["traje", traje.id], icone: { tipo: "traje", traje } });
  }

  // Sistemas: o que não é item nem lugar, mas decide o jogo.
  for (const [num, tier] of Object.entries(TIERS)) {
    add("sistemas", `Dificuldade ${tier.name}`, `${tier.stars || ""} · ${tier.hp} de vida, ${tier.xp} XP`, [
      ["Estrelas", tier.stars || ""],
      ["Vida do bicho", String(tier.hp)],
      ["XP", String(tier.xp)],
      ["Dano por erro", String(tier.damage)],
    ], { tags: ["dificuldade", "combate", num] });
  }
  for (const [id, skill] of Object.entries(SKILLS)) {
    add("sistemas", skill.name, skill.desc || "", [
      ["Disciplina", CONTINENTS[id]?.name || id],
      ["Descrição", skill.desc || ""],
    ], { tags: ["habilidade", id] });
  }
  for (const sistema of COMO_JOGAR) {
    add("sistemas", sistema.nome, sistema.resumo, sistema.campos, { tags: ["como jogar", "sistema"] });
  }

  return saida;
}

let indice = null;
export function indiceDaWiki() {
  if (!indice) indice = construirIndice();
  return indice;
}

export function categoriasDaWiki(entradas = indiceDaWiki()) {
  return CATEGORIAS.map((c) => ({
    ...c,
    total: c.id === "tudo" ? entradas.length : entradas.filter((e) => e.cat === c.id).length,
  }));
}

// Busca: todas as palavras precisam aparecer; nome que começa com o termo vem
// antes. Sem acento e sem caixa, porque ninguém digita acento no meio do jogo.
export function buscarNaWiki(consulta = "", categoria = "tudo", limite = 80) {
  const termos = normalizar(consulta).split(/\s+/).filter(Boolean);
  const base = indiceDaWiki().filter((e) => categoria === "tudo" || e.cat === categoria);
  const achados = termos.length
    ? base.filter((e) => termos.every((t) => e.busca.includes(t)))
    : base;
  if (!termos.length) return achados.slice(0, limite);
  const primeiro = normalizar(termos[0]);
  return achados
    .map((e, i) => ({ e, i, prioridade: normalizar(e.nome).startsWith(primeiro) ? 0 : 1 }))
    .sort((a, b) => a.prioridade - b.prioridade || a.i - b.i)
    .slice(0, limite)
    .map((x) => x.e);
}

// Link direto: `itens:Espada da Prova` abre a categoria e busca o nome; um
// termo solto continua sendo busca em tudo.
export function separarConsulta(consulta = "") {
  const texto = String(consulta || "");
  const m = /^([a-z]+):(.+)$/.exec(texto);
  if (m && CATEGORIAS.some((c) => c.id === m[1])) return { categoria: m[1], termo: m[2].trim() };
  return { categoria: "tudo", termo: texto.trim() };
}

// ---- interface ------------------------------------------------------------

let ligado = false;
let limiteVisivel = 80;
let origemDetalhe = null;
let categoriaAtual = "tudo";
let abrirPost = null;
let fecharModal = null;

function el(tag, classe, texto) {
  const node = document.createElement(tag);
  if (classe) node.className = classe;
  if (texto !== undefined) node.textContent = texto;
  return node;
}

const $ = (id) => document.getElementById(id);

function montarAbas() {
  const box = $("wiki-tabs");
  if (!box) return;
  box.textContent = "";
  for (const c of categoriasDaWiki()) {
    const tab = el("button", "wiki-tab", c.id === "tudo" ? `${c.nome} ${c.total}` : `${c.nome} ${c.total}`);
    tab.type = "button";
    tab.dataset.cat = c.id;
    tab.id = `wiki-tab-${c.id}`;
    tab.tabIndex = c.id === categoriaAtual ? 0 : -1;
    tab.setAttribute("aria-controls", "wiki-list");
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-selected", String(c.id === categoriaAtual));
    const escolher = (id) => {
      categoriaAtual = id;
      limiteVisivel = 80;
      mostrarDetalhe(null);
      montarAbas();
      renderizarLista();
      const selected = [...box.querySelectorAll(".wiki-tab")].find(node => node.dataset.cat === id);
      selected?.focus({ preventScroll: true });
      selected?.scrollIntoView({ block: "nearest", inline: "nearest" });
    };
    tab.addEventListener("click", () => escolher(c.id));
    tab.addEventListener("keydown", (event) => {
      const categorias = categoriasDaWiki();
      const index = categorias.findIndex(item => item.id === c.id);
      let next;
      if (event.key === "ArrowRight") next = (index + 1) % categorias.length;
      else if (event.key === "ArrowLeft") next = (index - 1 + categorias.length) % categorias.length;
      else if (event.key === "Home") next = 0;
      else if (event.key === "End") next = categorias.length - 1;
      else return;
      event.preventDefault();
      escolher(categorias[next].id);
    });
    box.appendChild(tab);
  }
}

function renderizarLista() {
  const lista = $("wiki-list");
  const detalhe = $("wiki-detail");
  const resumo = $("wiki-resumo");
  if (!lista) return;
  lista.hidden = false;
  if (detalhe) detalhe.hidden = true;
  const consulta = $("wiki-search")?.value || "";
  const achados = buscarNaWiki(consulta, categoriaAtual, Infinity);
  const more = $("wiki-more");
  if (more) {
    more.dataset.remaining = String(achados.length > limiteVisivel);
    more.hidden = achados.length <= limiteVisivel;
    more.textContent = `mostrar mais ${Math.min(80, Math.max(0, achados.length - limiteVisivel))}`;
  }
  lista.setAttribute("aria-labelledby", `wiki-tab-${categoriaAtual}`);
  const total = indiceDaWiki().filter((e) => categoriaAtual === "tudo" || e.cat === categoriaAtual).length;
  if (resumo) {
    const cat = categoriasDaWiki().find((c) => c.id === categoriaAtual);
    resumo.textContent = consulta
      ? `${achados.length} resultados em ${cat?.nome || "tudo"} para "${consulta}" · mostrando ${Math.min(limiteVisivel, achados.length)}`
      : `${total} ${total === 1 ? "entrada" : "entradas"} em ${cat?.nome || "tudo"} · mostrando ${Math.min(limiteVisivel, achados.length)}`;
  }
  lista.textContent = "";
  if (!achados.length) {
    lista.appendChild(el("p", "wiki-vazio", "nada encontrado. tente outro termo ou outra categoria."));
    return;
  }
  for (const entrada of achados.slice(0, limiteVisivel)) {
    const cat = CATEGORIAS.find((c) => c.id === entrada.cat)?.nome || entrada.cat;
    const botao = el("button", "wiki-item");
    botao.type = "button";
    botao.append(
      el("em", "", cat),
      el("b", "", entrada.nome),
      el("span", "", entrada.resumo || ""),
    );
    botao.addEventListener("click", () => { origemDetalhe = botao; mostrarDetalhe(entrada); });
    lista.appendChild(botao);
  }
}

function iconeDaEntrada(icone) {
  const cv = document.createElement("canvas");
  cv.width = 64;
  cv.height = 64;
  cv.className = "wiki-icone";
  const g = cv.getContext("2d");
  if (!g) return cv;
  g.imageSmoothingEnabled = false;
  if (icone.tipo === "item") {
    const base = itemIconCanvas(icone.item);
    g.drawImage(base, 0, 0, 64, 64);
  } else if (icone.tipo === "bicho") {
    g.save();
    g.translate(32, 58);
    drawCreatureArt(g, icone.kind, icone.accent, 0, 2, 0);
    g.restore();
  } else if (icone.tipo === "pet") {
    drawPetSprite(g, icone.kind, 32, 58, 0, false, 0);
  } else if (icone.tipo === "bioma") {
    const b = icone.bioma || {};
    const base = b.base || "#1c1a2e";
    const piso = b.floor || "#231e39";
    const caminho = b.path || "#312c5e";
    const acento = b.accent || "#ffc857";
    g.fillStyle = base;
    g.fillRect(0, 0, 64, 64);
    g.fillStyle = piso;
    g.fillRect(6, 6, 52, 52);
    // padrão do piso: onda, ponto ou rachadura, o mesmo nome do bioma
    g.fillStyle = b.accent2 || acento;
    g.globalAlpha = 0.35;
    if (b.pattern === "dots") {
      for (let y = 10; y < 58; y += 8) for (let x = 10; x < 58; x += 8) g.fillRect(x, y, 2, 2);
    } else if (b.pattern === "cracks") {
      g.fillRect(10, 30, 18, 1);
      g.fillRect(28, 30, 1, 10);
      g.fillRect(40, 18, 1, 16);
      g.fillRect(40, 34, 10, 1);
    } else {
      for (let y = 12; y < 58; y += 8) for (let x = 10; x < 54; x += 10) g.fillRect(x + (y % 16 ? 2 : 0), y, 6, 1);
    }
    g.globalAlpha = 1;
    g.fillStyle = caminho;
    g.fillRect(28, 6, 8, 52);
    g.fillRect(6, 28, 52, 8);
    g.fillStyle = acento;
    g.fillRect(26, 26, 12, 12);
    g.fillStyle = "rgba(255,255,255,0.25)";
    g.fillRect(28, 28, 8, 2);
  } else if (icone.tipo === "caverna") {
    const acento = icone.accent || "#ffc857";
    g.fillStyle = "#0b0d18";
    g.fillRect(0, 0, 64, 64);
    g.fillStyle = "#232437";
    g.fillRect(4, 30, 56, 30);
    g.beginPath();
    g.arc(32, 34, 22, Math.PI, Math.PI * 2);
    g.fill();
    g.fillStyle = "#05070f";
    g.beginPath();
    g.arc(32, 36, 15, Math.PI, Math.PI * 2);
    g.fill();
    g.fillRect(17, 36, 30, 20);
    g.fillStyle = acento;
    g.globalAlpha = 0.8;
    g.fillRect(29, 46, 6, 6);
    g.globalAlpha = 1;
    g.fillStyle = "rgba(255,255,255,0.2)";
    g.fillRect(12, 32, 4, 2);
    g.fillRect(48, 38, 3, 2);
  } else if (icone.tipo === "traje") {
    const c = icone.traje?.colors || {};
    g.fillStyle = "#0b0d18";
    g.fillRect(0, 0, 64, 64);
    g.fillStyle = c.skin || "#e8b98c";
    g.fillRect(24, 10, 16, 16);
    g.fillStyle = c.hair || "#2a2438";
    g.fillRect(23, 8, 18, 6);
    g.fillRect(23, 12, 3, 6);
    g.fillRect(38, 12, 3, 6);
    g.fillStyle = c.shirt || "#61f4c0";
    g.fillRect(20, 26, 24, 20);
    g.fillStyle = c.accent || "#fff3d1";
    g.fillRect(20, 42, 24, 3);
    g.fillStyle = c.pants || "#2f2c45";
    g.fillRect(22, 46, 8, 14);
    g.fillRect(34, 46, 8, 14);
    g.fillStyle = "#05070f";
    g.fillRect(25, 17, 2, 2);
    g.fillRect(37, 17, 2, 2);
  } else if (icone.tipo === "gema") {
    const cor = icone.accent || "#ffc857";
    g.fillStyle = "rgba(4,6,14,0.7)";
    g.fillRect(6, 6, 52, 52);
    g.fillStyle = cor;
    g.beginPath();
    g.moveTo(32, 8);
    g.lineTo(52, 28);
    g.lineTo(32, 56);
    g.lineTo(12, 28);
    g.closePath();
    g.fill();
    g.fillStyle = "rgba(255,255,255,0.5)";
    g.fillRect(28, 16, 4, 16);
    g.fillRect(22, 24, 4, 8);
    g.fillStyle = "rgba(0,0,0,0.25)";
    g.fillRect(32, 32, 12, 12);
  }
  return cv;
}

function mostrarDetalhe(entrada) {
  const lista = $("wiki-list");
  const detalhe = $("wiki-detail");
  if (!detalhe) return;
  if (!entrada) {
    detalhe.hidden = true;
    detalhe.textContent = "";
    if (lista) lista.hidden = false;
    return;
  }
  if (lista) lista.hidden = true;
  if ($("wiki-more")) $("wiki-more").hidden = true;
  detalhe.hidden = false;
  detalhe.textContent = "";
  const cat = CATEGORIAS.find((c) => c.id === entrada.cat)?.nome || entrada.cat;
  detalhe.append(
    el("p", "wiki-cat", cat),
    el("h3", "", entrada.nome),
  );
  if (entrada.icone) detalhe.appendChild(iconeDaEntrada(entrada.icone));
  if (entrada.campos.length) {
    const dl = el("dl");
    for (const [rotulo, valor] of entrada.campos) {
      dl.append(el("dt", "", rotulo), el("dd", "", valor));
    }
    detalhe.appendChild(dl);
  }
  const acoes = el("div", "wiki-acoes");
  const voltar = el("button", "hud-btn", "voltar");
  voltar.type = "button";
  voltar.addEventListener("click", () => {
    detalhe.hidden = true;
    if (lista) lista.hidden = false;
    if ($("wiki-more")) $("wiki-more").hidden = $("wiki-more").dataset.remaining !== "true";
    if (origemDetalhe && lista?.contains(origemDetalhe)) origemDetalhe.focus({ preventScroll: true });
    else $("wiki-search")?.focus();
  });
  acoes.appendChild(voltar);
  const link = el("button", "hud-btn", "copiar link");
  link.type = "button";
  link.addEventListener("click", async () => {
    const url = `${location.origin}${location.pathname}?wiki=${encodeURIComponent(`${entrada.cat}:${entrada.nome}`)}`;
    try {
      await navigator.clipboard.writeText(url);
      link.textContent = "link copiado";
    } catch {
      // sem permissão de área de transferência: mostra o endereço para copiar
      link.textContent = url;
    }
  });
  acoes.appendChild(link);
  if (entrada.abrir && abrirPost) {
    const abrir = el("button", "hud-btn", "abrir página");
    abrir.type = "button";
    abrir.addEventListener("click", () => {
      const id = entrada.abrir;
      if (fecharModal) fecharModal(); else fecharWiki();
      abrirPost(id);
    });
    acoes.appendChild(abrir);
  }
  detalhe.appendChild(acoes);
  voltar.focus();
}

function fecharWiki() {
  const modal = $("wiki");
  if (modal && !modal.hidden) {
    modal.hidden = true;
  }
  mostrarDetalhe(null);
}

export function configurarWiki({ abrirPost: abrir, fechar } = {}) {
  abrirPost = abrir || null;
  fecharModal = fechar || null;
}

export function abrirWiki(consulta = "") {
  if (!ligado) {
    ligado = true;
    $("wiki-search")?.addEventListener("input", () => { limiteVisivel = 80; renderizarLista(); });
    // seta para baixo sai da busca e entra no primeiro resultado visível
    $("wiki-search")?.addEventListener("keydown", (event) => {
      if (event.key !== "ArrowDown") return;
      if (!focusFirstVisible($("wiki-list"), ".wiki-item")) return;
      event.preventDefault();
    });
    $("wiki-more")?.addEventListener("click", () => {
      const previous = limiteVisivel;
      limiteVisivel += 80;
      renderizarLista();
      const next = $("wiki-list")?.querySelectorAll(".wiki-item")[previous];
      next?.focus({ preventScroll: true });
      next?.scrollIntoView({ block: "nearest" });
    });
  }
  const alvo = separarConsulta(consulta);
  categoriaAtual = alvo.categoria;
  limiteVisivel = 80;
  origemDetalhe = null;
  const busca = $("wiki-search");
  if (busca) busca.value = alvo.termo;
  mostrarDetalhe(null);
  montarAbas();
  renderizarLista();
  busca?.focus();
}

export const wikiUi = { abrir: abrirWiki, fechar: fecharWiki, configurar: configurarWiki, indice: indiceDaWiki, categorias: categoriasDaWiki, buscar: buscarNaWiki };

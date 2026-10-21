// A wiki do vale. Ela não tem texto próprio: o índice é montado dos mesmos
// módulos que o jogo usa (área, caverna, bicho, item, missão, NPC, vocação e
// página), então o que entra no jogo entra na wiki. A busca e as categorias
// são só uma vista sobre esse índice.
import { AREAS, WAYSTONES, CONTINENTS } from "./config.js";
import { DISCIPLINES } from "./catalog.js";
import { CATALOG_CONTENT } from "./catalog-gen.js";
import { DUNGEONS } from "./dungeon-data.js";
import { ITEMS, MONSTER_LABELS, MONSTER_WEAKNESS } from "./rpg-data.js";
import { QUESTS } from "./quests.js";
import { POSTS, NPCS } from "./content.js";
import { FAUNA, AREA_ITEMS, BIOMES } from "./identity.js";
import { VOCACOES } from "./vocations.js";

const CATEGORIAS = [
  { id: "tudo", nome: "Tudo" },
  { id: "mundo", nome: "Mundo" },
  { id: "cavernas", nome: "Cavernas" },
  { id: "criaturas", nome: "Criaturas" },
  { id: "itens", nome: "Itens" },
  { id: "missoes", nome: "Missões" },
  { id: "npcs", nome: "NPCs" },
  { id: "paginas", nome: "Páginas" },
  { id: "vocacoes", nome: "Vocações" },
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
    add("mundo", area.name, bio.name || area.sub || "", campos, { tags: [area.id, bio.material || ""] });
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
    add("cavernas", d.name, d.sub || "", campos, { tags: [areaId, d.id] });
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
      ], { tags: ["bicho", bicho.kind] });
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
    ], { tags: [item.id || "", item.slot || ""] });
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

// ---- interface ------------------------------------------------------------

let ligado = false;
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
    tab.setAttribute("role", "tab");
    tab.setAttribute("aria-selected", String(c.id === categoriaAtual));
    tab.addEventListener("click", () => {
      categoriaAtual = c.id;
      mostrarDetalhe(null);
      montarAbas();
      renderizarLista();
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
  const achados = buscarNaWiki(consulta, categoriaAtual);
  const total = indiceDaWiki().filter((e) => categoriaAtual === "tudo" || e.cat === categoriaAtual).length;
  if (resumo) {
    const cat = categoriasDaWiki().find((c) => c.id === categoriaAtual);
    resumo.textContent = consulta
      ? `${achados.length} de ${total} em ${cat?.nome || "tudo"} para "${consulta}"`
      : `${total} ${total === 1 ? "entrada" : "entradas"} em ${cat?.nome || "tudo"}`;
  }
  lista.textContent = "";
  if (!achados.length) {
    lista.appendChild(el("p", "wiki-vazio", "nada encontrado. tente outro termo ou outra categoria."));
    return;
  }
  for (const entrada of achados) {
    const cat = CATEGORIAS.find((c) => c.id === entrada.cat)?.nome || entrada.cat;
    const botao = el("button", "wiki-item");
    botao.type = "button";
    botao.append(
      el("em", "", cat),
      el("b", "", entrada.nome),
      el("span", "", entrada.resumo || ""),
    );
    botao.addEventListener("click", () => mostrarDetalhe(entrada));
    lista.appendChild(botao);
  }
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
  detalhe.hidden = false;
  detalhe.textContent = "";
  const cat = CATEGORIAS.find((c) => c.id === entrada.cat)?.nome || entrada.cat;
  detalhe.append(
    el("p", "wiki-cat", cat),
    el("h3", "", entrada.nome),
  );
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
    $("wiki-search")?.focus();
  });
  acoes.appendChild(voltar);
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

export function abrirWiki() {
  if (!ligado) {
    ligado = true;
    $("wiki-search")?.addEventListener("input", () => renderizarLista());
  }
  categoriaAtual = "tudo";
  const busca = $("wiki-search");
  if (busca) busca.value = "";
  mostrarDetalhe(null);
  montarAbas();
  renderizarLista();
  busca?.focus();
}

export const wikiUi = { abrir: abrirWiki, fechar: fecharWiki, configurar: configurarWiki, indice: indiceDaWiki, categorias: categoriasDaWiki, buscar: buscarNaWiki };

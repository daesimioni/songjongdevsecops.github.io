// Wiki de sprites: catálogo navegável do kit modular, das criaturas do
// bestiário, da gente do vale e dos itens. Cada peça é desenhada pela mesma
// função que o jogo usa, com visão, estado e animação quando existem.
import {
  KIT_CATEGORIES,
  SPRITE_KIT,
  searchKit,
  kitBounds,
  kitColliders,
  kitAnimation,
} from "../content/sprite-kit/catalog.js";
import { drawKit } from "../rendering/sprite-kit/index.js";
import { bestiaryModel } from "../ui/bestiary.js";
import { NPCS } from "../content/content.js";
import { NPC_SPAWNS } from "../content/config.js";
import { GROUNDS, ITEMS } from "../content/rpg-data.js";
import { npcStyle } from "../content/identity.js";
import { aplicarReskin } from "../gameplay/reskin.js";
import { drawCreatureArt } from "../rendering/creature.js";
import { drawHuman } from "../rendering/human.js";
import { itemIconCanvas } from "../rendering/item-art.js";

const $ = (id) => document.getElementById(id);
const DIRECOES = [
  "Frente",
  "Esquerda",
  "Direita",
  "Trás",
  "Diagonal inferior esquerda",
  "Diagonal inferior direita",
  "Diagonal superior esquerda",
  "Diagonal superior direita",
];
const LARGURA = 440;
const ALTURA = 340;

let modo = "kit";
let categoria = "";
let cards = [];
const visiveis = new Set();
const media = window.matchMedia("(prefers-reduced-motion: reduce)");
$("motion").checked = !media.matches;
media.addEventListener("change", () => { $("motion").checked = !media.matches; });

const observer = new IntersectionObserver((entradas) => {
  for (const e of entradas) {
    if (e.isIntersecting) {
      visiveis.add(e.target);
    } else {
      visiveis.delete(e.target);
      // solta a memória do canvas que saiu da tela; ele volta quando reaparecer
      const canvas = e.target.querySelector("canvas");
      if (canvas && canvas.width !== 1) { canvas.width = 1; canvas.height = 1; }
    }
  }
}, { rootMargin: "160px" });

// ---- dados das quatro coleções -------------------------------------------
aplicarReskin();

const gente = (() => {
  const vistos = new Set();
  const lista = [];
  const porSpawn = (id, accent, continent, gender) => {
    if (vistos.has(id)) return;
    const ficha = NPCS[id];
    if (!ficha) return;
    vistos.add(id);
    const estilo = npcStyle(id, accent, continent, gender);
    lista.push({
      id,
      nome: ficha.name,
      grupo: "gente",
      tags: [estilo.label || ficha.label || "gente do vale", estilo.role || ""].filter(Boolean),
      estilo,
    });
  };
  for (const spawn of NPC_SPAWNS) porSpawn(spawn.id, spawn.accent, spawn.continent, spawn.gender);
  for (const g of GROUNDS) {
    const id = `trainer-${g.id}`;
    const ficha = NPCS[id];
    if (!ficha) continue;
    porSpawn(id, ficha.accent || g.accent, g.continent, g.trainerGender);
  }
  return lista;
})();

const criaturas = bestiaryModel().todos.map((bicho) => ({
  id: bicho.id,
  nome: bicho.nome,
  grupo: "criatura",
  tags: [bicho.chefe ? "chefe" : "bicho", bicho.tipo, `tier ${bicho.tier}`],
  tipo: bicho.tipo,
  accent: bicho.accent || "#b48cff",
  chefe: Boolean(bicho.chefe),
}));

const itens = Object.entries(ITEMS)
  .filter(([, item]) => item && typeof item === "object" && item.name)
  .map(([id, item]) => ({
    id,
    nome: item.name,
    grupo: "item",
    tags: [item.slot || item.kind || "item", item.continent || "", item.relic ? "relíquia" : ""].filter(Boolean),
    item,
  }));

const COLECOES = {
  kit: { nome: "Kit modular", dados: SPRITE_KIT, tipo: "kit" },
  criaturas: { nome: "Criaturas", dados: criaturas, tipo: "criatura" },
  gente: { nome: "Gente", dados: gente, tipo: "gente" },
  itens: { nome: "Itens", dados: itens, tipo: "item" },
};

// ---- abas e chips --------------------------------------------------------
for (const [id, c] of Object.entries(COLECOES)) {
  const b = document.createElement("button");
  b.type = "button";
  b.dataset.modo = id;
  b.textContent = `${c.nome} ${c.dados.length}`;
  $("modos").append(b);
}
$("modos").addEventListener("click", (e) => {
  const b = e.target.closest?.("button[data-modo]");
  if (!b) return;
  modo = b.dataset.modo;
  categoria = "";
  sincronizar();
  montar();
});

const chips = document.createElement("div");
chips.style.display = "contents";
const todas = document.createElement("button");
todas.type = "button";
todas.dataset.cat = "";
todas.textContent = `todos ${SPRITE_KIT.length}`;
chips.append(todas);
for (const [nome, lista] of Object.entries(KIT_CATEGORIES)) {
  const b = document.createElement("button");
  b.type = "button";
  b.dataset.cat = nome;
  b.textContent = `${nome} ${lista.length}`;
  chips.append(b);
}
$("categorias").append(chips);
$("categorias").addEventListener("click", (e) => {
  const b = e.target.closest?.("button[data-cat]");
  if (!b || modo !== "kit") return;
  categoria = b.dataset.cat;
  sincronizar();
  montar();
});

function sincronizar() {
  for (const b of $("modos").querySelectorAll("button")) {
    b.setAttribute("aria-pressed", String(b.dataset.modo === modo));
  }
  for (const b of $("categorias").querySelectorAll("button")) {
    b.setAttribute("aria-pressed", String(b.dataset.cat === categoria));
  }
  const kit = modo === "kit";
  $("categorias").hidden = !kit;
  $("rotulo-colisao").hidden = !kit;
  $("collision").hidden = !kit;
}

const params = new URLSearchParams(location.search);
if (params.get("q")) $("query").value = params.get("q");
if (params.get("cat") && KIT_CATEGORIES[params.get("cat")]) categoria = params.get("cat");
if (COLECOES[params.get("modo")]) modo = params.get("modo");
sincronizar();

function url() {
  const p = new URLSearchParams();
  if (modo !== "kit") p.set("modo", modo);
  if (modo === "kit" && categoria) p.set("cat", categoria);
  if ($("query").value.trim()) p.set("q", $("query").value.trim());
  const texto = p.toString();
  history.replaceState(null, "", texto ? `?${texto}` : location.pathname);
}

// ---- montagem dos cards --------------------------------------------------
function filtrarKit() {
  return searchKit({ category: categoria, query: $("query").value }).map((a) => ({
    id: a.id,
    nome: a.name,
    grupo: "kit",
    tags: (a.tags || []).slice(0, 4),
    raw: a,
  }));
}

function normalizar(texto) {
  return String(texto || "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();
}

function filtrar() {
  if (modo === "kit") return filtrarKit();
  const q = normalizar($("query").value);
  return COLECOES[modo].dados.filter((item) => normalizar(`${item.nome} ${item.id} ${item.tags.join(" ")}`).includes(q));
}

function montar() {
  observer.disconnect();
  visiveis.clear();
  $("cards").replaceChildren();
  const achados = filtrar();
  if (!achados.length) {
    const vazio = document.createElement("p");
    vazio.className = "vazio";
    vazio.textContent = "Nenhum sprite com esse filtro. Tente outro nome ou categoria.";
    $("cards").append(vazio);
  }
  cards = achados.map((item) => criarCard(item));
  const colecao = COLECOES[modo];
  $("status").textContent = `${cards.length} sprite${cards.length === 1 ? "" : "s"} · ${colecao.nome} · ${colecao.dados.length} na coleção`;
  url();
}

function criarCard(item) {
  const article = document.createElement("article");
  article.dataset.id = item.id;

  const titulo = document.createElement("h2");
  titulo.textContent = item.nome;
  article.append(titulo);

  if (item.tags?.length) {
    const tags = document.createElement("div");
    tags.className = "tags";
    for (const tag of item.tags) {
      if (!tag) continue;
      const s = document.createElement("span");
      s.textContent = tag;
      tags.append(s);
    }
    article.append(tags);
  }

  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;
  canvas.setAttribute("role", "img");
  canvas.setAttribute("aria-label", `${item.nome}, sprite`);
  article.append(canvas);

  const code = document.createElement("code");
  code.textContent = item.id;
  article.append(code);

  const info = document.createElement("small");
  article.append(info);

  const linha = document.createElement("div");
  linha.className = "linha";

  let direction = null;
  let state = null;
  if (item.grupo === "kit") {
    if ((item.raw.orientations || []).length > 1) {
      direction = selectDirecao(item);
      linha.append(direction);
    }
    if (item.raw.states) {
      state = document.createElement("select");
      state.setAttribute("aria-label", `Estado de ${item.nome}`);
      for (const s of Object.keys(item.raw.states)) state.add(new window.Option(s, s));
      state.value = item.raw.defaultState && item.raw.states[item.raw.defaultState] ? item.raw.defaultState : Object.keys(item.raw.states)[0];
      linha.append(state);
    }
  } else if (item.grupo === "criatura" || item.grupo === "gente") {
    direction = selectDirecao(item, item.grupo === "criatura" ? 0 : 4);
    linha.append(direction);
    state = document.createElement("select");
    state.setAttribute("aria-label", `Estado de ${item.nome}`);
    state.add(new window.Option("parado", "idle"));
    state.add(new window.Option("andando", "walk"));
    linha.append(state);
  }

  const copiar = document.createElement("button");
  copiar.type = "button";
  copiar.textContent = "copiar id";
  copiar.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(item.id);
      copiar.textContent = "copiado";
      setTimeout(() => { copiar.textContent = "copiar id"; }, 1200);
    } catch {
      $("status").textContent = "Não deu para copiar neste navegador.";
    }
  });
  linha.append(copiar);
  article.append(linha);

  $("cards").append(article);
  observer.observe(article);
  return { article, canvas, info, direction, state, item };
}

function selectDirecao(item, padrao = 0) {
  const s = document.createElement("select");
  s.setAttribute("aria-label", `Visão de ${item.nome}`);
  const lista = item.grupo === "kit" ? item.raw.orientations : [0, 1, 2, 3, 4, 5, 6, 7];
  for (const i of lista) s.add(new window.Option(DIRECOES[i], i));
  s.value = String(lista.includes(padrao) ? padrao : lista[0]);
  return s;
}

$("query").addEventListener("input", montar);
$("limpar").addEventListener("click", () => {
  $("query").value = "";
  categoria = "";
  sincronizar();
  montar();
});
montar();

// ---- desenho e animação --------------------------------------------------
function tick(time) {
  for (const c of cards) {
    if (!visiveis.has(c.article)) continue;
    if (c.canvas.width !== LARGURA) { c.canvas.width = LARGURA; c.canvas.height = ALTURA; }
    const g = c.canvas.getContext("2d");
    g.clearRect(0, 0, LARGURA, ALTURA);
    if (c.item.grupo === "kit") desenharKit(g, c, time);
    else if (c.item.grupo === "criatura") desenharCriatura(g, c, time);
    else if (c.item.grupo === "gente") desenharGente(g, c, time);
    else desenharItem(g, c);
  }
  requestAnimationFrame(tick);
}

function desenharKit(g, c, time) {
  const direction = c.direction ? Number(c.direction.value) : 0;
  const state = c.state ? c.state.value : undefined;
  const b = kitBounds(c.item.id, { direction, state });
  g.save();
  const escala = Math.min(5, 360 / Math.max(1, b.w), 260 / Math.max(1, b.h));
  g.translate(LARGURA / 2 - (b.x + b.w / 2) * escala, ALTURA / 2 - (b.y + b.h / 2) * escala);
  g.scale(escala, escala);
  g.imageSmoothingEnabled = false;
  const anim = kitAnimation(c.item.id, state);
  drawKit(g, c.item.id, 0, 0, {
    direction,
    state,
    tempo: $("motion").checked && anim.loop ? time : $("motion").checked ? time % (c.item.raw.frames * c.item.raw.ms + 500) : 0,
  });
  if ($("collision").checked) {
    if (c.item.raw.area) desenharArea(g, c.item.raw, direction);
    g.strokeStyle = "#83e89c";
    g.lineWidth = 0.5;
    for (const p of kitColliders(c.item.id, 0, 0, { direction, state })) {
      g.strokeRect((p.x - p.hw) * 16, (p.y - p.hh) * 16, p.hw * 32, p.hh * 32);
    }
  }
  g.restore();
  c.info.textContent = `${b.w - 2 * (b.padding ?? 3)} × ${b.h - 2 * (b.padding ?? 3)} px · ${c.item.raw.frames} quadro(s) · ${c.item.raw.layer}`;
}

function desenharCriatura(g, c, time) {
  const direction = Number(c.direction?.value || 0);
  const state = c.state?.value || "idle";
  g.save();
  g.translate(LARGURA / 2, ALTURA * 0.72);
  drawCreatureArt(g, c.item.tipo, c.item.accent, time / 1000, 8, direction, state === "walk", state);
  g.restore();
  c.info.textContent = `modelo ${c.item.tipo} · ${c.item.chefe ? "chefe" : "bicho"} · 8 visões`;
}

function desenharGente(g, c, time) {
  const direction = Number(c.direction?.value || 0);
  const moving = (c.state?.value || "idle") === "walk";
  const { colors, look, scale } = c.item.estilo;
  g.save();
  g.translate(LARGURA / 2, ALTURA * 0.8);
  drawHuman(g, 0, 0, direction, moving, time, colors, Math.min(8, 6.5 * (scale || 1)), look);
  g.restore();
  c.info.textContent = `${c.item.estilo.label || "gente"} · ${c.item.estilo.role || ""} · 8 visões`;
}

function desenharItem(g, c) {
  const icone = itemIconCanvas(c.item.item);
  g.save();
  g.imageSmoothingEnabled = false;
  g.drawImage(icone, LARGURA / 2 - 80, ALTURA / 2 - 80, 160, 160);
  g.restore();
  c.info.textContent = `${icone.width} × ${icone.height} px`;
}

function desenharArea(g, a, direction) {
  const { shape, radius, range, width, halfAngle } = a.area;
  const angulo = [
    Math.PI / 2,
    Math.PI,
    0,
    -Math.PI / 2,
    Math.PI * 0.75,
    Math.PI * 0.25,
    -Math.PI * 0.75,
    -Math.PI * 0.25,
  ][direction];
  g.save();
  g.rotate(angulo);
  g.strokeStyle = "#83e89c";
  g.lineWidth = 0.7;
  g.beginPath();
  if (shape === "line" || shape === "projectile") g.rect(0, -width / 2, range, width);
  else if (shape === "cone") {
    g.moveTo(0, 0);
    g.arc(0, 0, range, -halfAngle, halfAngle);
    g.closePath();
  } else {
    g.arc(0, 0, radius, 0, Math.PI * 2);
    if (shape === "ring") {
      g.moveTo(radius - width, 0);
      g.arc(0, 0, radius - width, 0, Math.PI * 2);
    }
  }
  g.stroke();
  g.restore();
}

requestAnimationFrame(tick);

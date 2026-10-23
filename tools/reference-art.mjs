import { createReferenceLibrary } from "../src/platform/reference-art.js";
import { referenceRecipe } from "../src/content/reference-art/recipes.js";
import {
  drawReference,
  referenceBounds,
} from "../src/rendering/reference-art/index.js";
const $ = (id) => document.getElementById(id),
  library = createReferenceLibrary(),
  visible = new Set(),
  observer = new window.IntersectionObserver((entries) => {
    for (const e of entries)
      e.isIntersecting ? visible.add(e.target) : visible.delete(e.target);
  });
let manifest,
  cards = [],
  generation = 0;
const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
$("motion").checked = !motion.matches;
motion.addEventListener("change", () => {
  $("motion").checked = !motion.matches;
});
function reset() {
  observer.disconnect();
  visible.clear();
  cards = [];
  $("cards").replaceChildren();
}
function card(a) {
  const article = document.createElement("article"),
    title = document.createElement("h2"),
    canvas = document.createElement("canvas"),
    id = document.createElement("code"),
    hint = document.createElement("small");
  title.textContent = a.label;
  canvas.width = 400;
  canvas.height = 300;
  canvas.setAttribute("aria-label", a.label);
  id.textContent = a.id;
  hint.textContent =
    a.category === "componentes"
      ? "Componente modular: definir montagem e corpo na cena."
      : "Receita nativa para composição futura.";
  article.append(title, canvas, id, hint);
  const direction = document.createElement("select");
  direction.setAttribute("aria-label", "Vista de " + a.label);
  for (const d of a.orientations)
    direction.add(
      new window.Option(
        [
          "Frente",
          "Esquerda",
          "Direita",
          "Trás",
          "Sudoeste",
          "Sudeste",
          "Noroeste",
          "Nordeste",
        ][d],
        d,
      ),
    );
  article.append(direction);
  const state = document.createElement("select");
  state.setAttribute("aria-label", "Pose de " + a.label);
  for (const s of a.states || ["idle"])
    state.add(
      new window.Option(
        {
          idle: "Repouso",
          walk: "Andar",
          attack: "Ataque",
          hit: "Impacto",
          death: "Morte",
        }[s],
        s,
      ),
    );
  state.hidden = !a.states;
  article.append(state);
  const mode = document.createElement("select");
  mode.setAttribute("aria-label", "Uso da magia");
  for (const m of ["icon", "effect"])
    mode.add(new window.Option(m === "icon" ? "Ícone" : "Efeito", m));
  mode.hidden = a.category !== "magias";
  article.append(mode);
  $("cards").append(article);
  observer.observe(article);
  cards.push({ article, a, canvas, direction, state, mode });
}
async function refresh() {
  if (!manifest) return;
  const token = ++generation;
  reset();
  const category = $("category").value,
    count = manifest.categories[category].count,
    total = Math.ceil(count / 24),
    page = Math.max(1, Math.min(total, Number($("page").value) || 1));
  $("page").value = page;
  $("page").max = total;
  $("pages").textContent = "/ " + total;
  $("previous").disabled = page === 1;
  $("next").disabled = page === total;
  $("status").textContent = "Carregando…";
  try {
    const rows = [];
    for (let at = (page - 1) * 24; at < Math.min(page * 24, count); ) {
      const data = await library.page(category, Math.floor(at / 1024)),
        start = at % 1024,
        take = Math.min(data.length - start, Math.min(page * 24, count) - at);
      rows.push(...data.slice(start, start + take));
      at += take;
    }
    if (token !== generation) return;
    for (const row of rows) card(referenceRecipe(category, row));
    $("status").textContent =
      `${rows.length} receitas exibidas de ${count.toLocaleString("pt-BR")}.`;
  } catch (e) {
    if (token === generation) $("status").textContent = e.message;
  }
}
$("category").addEventListener("change", () => {
  $("page").value = 1;
  refresh();
});
$("page").addEventListener("change", refresh);
$("previous").addEventListener("click", () => {
  $("page").value = Number($("page").value) - 1;
  refresh();
});
$("next").addEventListener("click", () => {
  $("page").value = Number($("page").value) + 1;
  refresh();
});
$("reset").addEventListener("click", refresh);
$("search").addEventListener("submit", async (e) => {
  e.preventDefault();
  const token = ++generation;
  try {
    const a = await library.asset($("id").value.trim());
    if (token !== generation) return;
    if (!a) throw new Error("Arte não encontrada");
    reset();
    $("category").value = a.category;
    $("previous").disabled = true;
    $("next").disabled = true;
    card(a);
    $("status").textContent = "Arte selecionada por ID.";
  } catch (e) {
    if (token === generation) $("status").textContent = e.message;
  }
});
function tick(time) {
  for (const c of cards) {
    if (!visible.has(c.article)) continue;
    const mode = c.mode.value,
      b = referenceBounds(c.a, { mode }),
      g = c.canvas.getContext("2d"),
      scale = Math.min(3, 350 / b.w, 250 / b.h),
      state = c.state.value,
      tempo = $("motion").checked
        ? ["attack", "hit", "death"].includes(state)
          ? time % 1300
          : time
        : 0;
    g.clearRect(0, 0, 400, 300);
    g.save();
    g.translate(200 - (b.x + b.w / 2) * scale, 150 - (b.y + b.h / 2) * scale);
    g.scale(scale, scale);
    g.imageSmoothingEnabled = false;
    drawReference(g, c.a, 0, 0, {
      direction: Number(c.direction.value),
      state,
      mode,
      tempo,
    });
    g.restore();
  }
  window.requestAnimationFrame(tick);
}
window.requestAnimationFrame(tick);
try {
  manifest = await library.manifest();
  $("inventory").textContent =
    `${manifest.references.toLocaleString("pt-BR")} referências; ${manifest.recipes.toLocaleString("pt-BR")} receitas. Pacotes carregados sob demanda.`;
  for (const [name, group] of Object.entries(manifest.categories))
    $("category").add(new window.Option(`${name} (${group.count})`, name));
  $("category").value = "criaturas";
  await refresh();
} catch (e) {
  $("status").textContent = e.message;
}

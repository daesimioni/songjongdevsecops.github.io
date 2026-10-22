import {
  KIT_CATEGORIES,
  searchKit,
  kitBounds,
  kitColliders,
  kitAnimation,
} from "../src/content/sprite-kit/catalog.js";
import { drawKit } from "../src/rendering/sprite-kit/index.js";
const $ = (id) => document.getElementById(id);
for (const category of Object.keys(KIT_CATEGORIES)) {
  $("category").add(new window.Option(category, category));
}
const media = window.matchMedia("(prefers-reduced-motion: reduce)");
$("motion").checked = !media.matches;
media.addEventListener("change", () => {
  $("motion").checked = !media.matches;
});
let cards = [];
const visible = new Set();
const observer = new window.IntersectionObserver((entries) =>
  entries.forEach((e) =>
    e.isIntersecting ? visible.add(e.target) : visible.delete(e.target),
  ),
);
function refresh() {
  observer.disconnect();
  visible.clear();
  $("cards").replaceChildren();
  cards = searchKit({
    category: $("category").value,
    query: $("query").value,
  }).map((a) => {
    const article = document.createElement("article");
    const h = document.createElement("h2");
    h.textContent = a.name;
    article.append(h);
    const canvas = document.createElement("canvas");
    canvas.width = 440;
    canvas.height = 340;
    canvas.setAttribute("aria-label", a.name);
    article.append(canvas);
    const code = document.createElement("code");
    code.textContent = a.id;
    article.append(code);
    const info = document.createElement("small");
    article.append(info);
    const direction = document.createElement("select");
    direction.setAttribute("aria-label", "Orientação de " + a.name);
    a.orientations.forEach((i) =>
      direction.add(
        new window.Option(
          [
            "Frente",
            "Esquerda",
            "Direita",
            "Trás",
            "Diagonal inferior esquerda",
            "Diagonal inferior direita",
            "Diagonal superior esquerda",
            "Diagonal superior direita",
          ][i],
          i,
        ),
      ),
    );
    article.append(direction);
    const state = document.createElement("select");
    state.setAttribute("aria-label", "Estado de " + a.name);
    Object.keys(a.states || { default: [] }).forEach((s) =>
      state.add(new window.Option(s, s)),
    );
    state.hidden = !a.states;
    article.append(state);
    $("cards").append(article);
    observer.observe(article);
    return { article, canvas, info, direction, state, a };
  });
  $("status").textContent =
    `${cards.length} peças encontradas · ${Object.keys(KIT_CATEGORIES).length} categorias`;
}
$("query").addEventListener("input", refresh);
$("category").addEventListener("change", refresh);
refresh();
function tick(time) {
  for (const c of cards) {
    if (!visible.has(c.article)) continue;
    const direction = Number(c.direction.value),
      state = c.a.states ? c.state.value : undefined;
    const b = kitBounds(c.a.id, { direction, state });
    const g = c.canvas.getContext("2d");
    g.clearRect(0, 0, 440, 340);
    g.save();
    const scale = Math.min(5, 360 / b.w, 260 / b.h);
    g.translate(220 - (b.x + b.w / 2) * scale, 170 - (b.y + b.h / 2) * scale);
    g.scale(scale, scale);
    g.imageSmoothingEnabled = false;
    drawKit(g, c.a.id, 0, 0, {
      direction,
      state,
      tempo: $("motion").checked
        ? kitAnimation(c.a.id, state).loop
          ? time
          : time % (c.a.frames * c.a.ms + 500)
        : 0,
    });
    if ($("collision").checked) {
      if (c.a.area) drawArea(g, c.a, direction);
      g.strokeStyle = "#83e89c";
      g.lineWidth = 0.5;
      for (const p of kitColliders(c.a.id, 0, 0, { direction, state }))
        g.strokeRect(
          (p.x - p.hw) * 16,
          (p.y - p.hh) * 16,
          p.hw * 32,
          p.hh * 32,
        );
    }
    g.restore();
    c.info.textContent = `${b.w - 2 * (b.padding ?? 3)} × ${b.h - 2 * (b.padding ?? 3)} px · ${c.a.frames} quadro(s) · ${c.a.layer}`;
  }
  window.requestAnimationFrame(tick);
}
window.requestAnimationFrame(tick);

function drawArea(g, a, direction) {
  const { shape, radius, range, width, halfAngle } = a.area;
  const angle = [
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
  g.rotate(angle);
  g.strokeStyle = "#83e89c";
  g.lineWidth = 0.7;
  g.beginPath();
  if (shape === "line" || shape === "projectile")
    g.rect(0, -width / 2, range, width);
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

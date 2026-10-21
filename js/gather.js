// Coleta: minerar, pescar e cortar madeira custam pergunta do continente.
// Quanto mais valioso o achado, mais difícil: o lendário pede duas seguidas.
import { ITEMS } from "./rpg-data.js";
import { CONTINENTS } from "./config.js";
import { itemIconElement } from "./item-art.js";

const $ = (id) => document.getElementById(id);
const LETTERS = "ABCDE";
const NOMES = { vein: "mineração", tree: "madeira", water: "pesca" };
const RARIDADE = { comum: "comum", incomum: "incomum", raro: "raro", lendario: "lendário" };
const DIFICULDADE = { 1: "fácil", 2: "média", 3: "difícil" };

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
}

// O sorteio é puro: o mesmo tipo sempre devolve um recurso que existe em
// ITEMS e um tier de pergunta de 1 a 3. O lendário pede duas perguntas.
export function rollGather(kind, rand = Math.random, extra = {}) {
  // a coleta da vocação puxa o sorteio para baixo: 1,45 dá 45% mais chance de
  // cair no raro e no lendário, sem mudar o comum
  const coleta = Math.max(0.1, Number(extra.coleta) || 1);
  const r = Math.min(0.999, rand() / coleta);
  const dois = () => rand() < 0.5;
  if (kind === "vein") {
    if (r < 0.55) return { resource: "veio", qty: dois() ? 2 : 1, tier: 1, grade: "comum" };
    if (r < 0.85) return { resource: "ferro", qty: 1, tier: 2, grade: "incomum" };
    const raro = ITEMS[extra.material] && extra.material !== "veio" && extra.material !== "ferro"
      ? extra.material
      : "cristal";
    if (r < 0.97) return { resource: raro, qty: 1, tier: 3, grade: "raro" };
    return { resource: raro, qty: 2, tier: 3, grade: "lendario", rounds: 2 };
  }
  if (kind === "tree") {
    if (r < 0.7) return { resource: "madeira", qty: dois() ? 2 : 1, tier: 1, grade: "comum" };
    if (r < 0.95) return { resource: "madeira", qty: dois() ? 3 : 2, tier: 2, grade: "incomum" };
    if (r < 0.99) return { resource: "madeira", qty: 4, tier: 3, grade: "raro" };
    return { resource: "madeira", qty: 6, tier: 3, grade: "lendario", rounds: 2 };
  }
  if (r < 0.6) return { resource: "peixe", qty: dois() ? 2 : 1, tier: 1, grade: "comum" };
  if (r < 0.88) return { resource: "peixe-prata", qty: 1, tier: 2, grade: "incomum" };
  if (r < 0.98) return { resource: "peixe-raro", qty: 1, tier: 3, grade: "raro" };
  return { resource: "peixe-lendario", qty: 1, tier: 3, grade: "lendario", rounds: 2 };
}

export function createGather({ rpg, audio, toast, onClose }) {
  let current = null;
  let etapa = 0;
  let pick = -1;
  let done = false;
  let resultado = "";

  // A pergunta é do tier do achado. O baralho de cada tier é pedido sozinho:
  // juntar os tiers numa chamada só ordena por tema e poderia servir uma
  // pergunta difícil num achado comum. Só desce para os vizinhos se o tier
  // pedido não tiver pergunta escrita para o continente.
  function perguntasPara(continent, tier, quantas) {
    const out = [];
    const tentados = new Set();
    for (const t of [tier, 2, 1, 3]) {
      if (tentados.has(t)) continue;
      tentados.add(t);
      for (const q of rpg.buildDeck(continent, [t])) {
        if (out.some((o) => o.q === q.q)) continue;
        out.push(q);
        if (out.length >= quantas) return out;
      }
    }
    return out;
  }

  function open(ctx) {
    const questions = perguntasPara(ctx.continent, ctx.reward.tier, ctx.reward.rounds || 1);
    if (!questions.length) {
      toast("As perguntas desta região ainda não foram escritas.", 3200);
      return false;
    }
    current = { ...ctx, questions };
    etapa = 0;
    pick = -1;
    done = false;
    resultado = "";
    render();
    return true;
  }

  function close() {
    current = null;
    onClose?.();
  }

  function escolher(i) {
    if (!current || done) return;
    done = true;
    pick = i;
    const q = current.questions[etapa];
    if (i !== q.answer) {
      resultado = "errou";
      audio.error?.();
      render();
      return;
    }
    rpg.addSkillXp(current.continent, q.tier);
    rpg.save();
    if (etapa < current.questions.length - 1) {
      resultado = "mais";
      audio.blip?.();
      render();
      return;
    }
    const { reward } = current;
    const ok = current.commit ? current.commit(reward) : true;
    if (ok) {
      rpg.addItem(reward.resource, reward.qty);
      rpg.save();
      resultado = "levou";
      audio.chime?.();
    } else {
      resultado = "vazio";
      audio.error?.();
    }
    render();
  }

  function advance() {
    if (!current || !done) return;
    if (resultado === "mais") {
      etapa++;
      pick = -1;
      done = false;
      resultado = "";
      audio.blip?.();
      render();
      return;
    }
    close();
  }

  function render() {
    if (!current) return;
    const { kind, continent, reward } = current;
    const q = current.questions[etapa];
    const total = current.questions.length;
    const item = ITEMS[reward.resource] || { name: reward.resource };
    const certo = pick === q.answer;
    $("gather-kicker").textContent = `COLETA · ${NOMES[kind] || "recurso"} · ${CONTINENTS[continent]?.name || ""}`;
    $("gather-title").textContent = item.name;
    $("gather-sub").textContent = done
      ? resultado === "levou"
        ? `guardado · +${reward.qty} no inventário`
        : resultado === "vazio"
          ? "o lugar já estava vazio"
          : resultado === "mais"
            ? `${etapa + 1} de ${total} · mais uma`
            : "a pergunta venceu · nada foi levado"
      : total > 1
        ? `${RARIDADE[reward.grade]} · ${total} perguntas seguidas · acerte todas para levar ${reward.qty}×`
        : `${RARIDADE[reward.grade]} · pergunta ${DIFICULDADE[reward.tier]} · acerte para levar ${reward.qty}×`;
    const art = $("gather-art");
    if (art) {
      art.textContent = "";
      art.appendChild(itemIconElement({ id: reward.resource, ...item }));
    }
    const body = $("gather-body");
    body.textContent = "";
    body.appendChild(el("p", "duel-question", q.q));
    const opts = el("div", "duel-options");
    q.options.forEach((text, i) => {
      const b = el("button", "duel-option");
      b.type = "button";
      b.appendChild(el("kbd", "", LETTERS[i] || String(i + 1)));
      b.appendChild(el("span", "", text));
      if (done) {
        b.disabled = true;
        if (i === q.answer) b.classList.add("right");
        else if (i === pick) b.classList.add("wrong");
      } else {
        b.addEventListener("click", () => escolher(i));
      }
      opts.appendChild(b);
    });
    body.appendChild(opts);
    if (done) {
      const fb = el("div", `duel-feedback ${certo ? "good" : "bad"}`);
      const rotulo = certo
        ? resultado === "mais"
          ? "Acertou. Guarde o fôlego: vem outra."
          : resultado === "levou"
            ? total > 1
              ? `Acertou as ${total}. +${reward.qty} ${item.name}.`
              : `Acertou. +${reward.qty} ${item.name}.`
            : "Acertou, mas o lugar já estava vazio."
        : total > 1
          ? "Errou. O achado fundo escapou."
          : "Errou. O recurso continua no lugar.";
      fb.appendChild(el("b", "", rotulo));
      fb.appendChild(el("span", "", q.why));
      body.appendChild(fb);
      const next = el("button", "duel-next", resultado === "mais" ? "continuar" : "fechar");
      next.type = "button";
      next.addEventListener("click", advance);
      body.appendChild(next);
    }
  }

  return {
    open,
    close,
    answer: escolher,
    advance,
    isOpen: () => !!current,
  };
}

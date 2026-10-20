// Coleta: minerar, pescar e cortar madeira custam uma pergunta do continente
// em que você está. Quanto mais valioso o achado, mais difícil a pergunta.
import { ITEMS } from "./rpg-data.js";
import { CONTINENTS } from "./config.js";
import { itemIconElement } from "./item-art.js";

const $ = (id) => document.getElementById(id);
const LETTERS = "ABCDE";
const NOMES = { vein: "mineração", tree: "madeira", water: "pesca" };
const RARIDADE = { 1: "comum", 2: "raro", 3: "muito raro" };
const DIFICULDADE = { 1: "fácil", 2: "média", 3: "difícil" };

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
}

// O sorteio é puro: o mesmo tipo sempre devolve um recurso que existe em
// ITEMS, com tier 1 a 3. O tier é a dificuldade da pergunta.
export function rollGather(kind, rand = Math.random, extra = {}) {
  const r = rand();
  const dois = () => rand() < 0.5;
  if (kind === "vein") {
    if (r < 0.55) return { resource: "veio", qty: dois() ? 2 : 1, tier: 1 };
    if (r < 0.85) return { resource: "ferro", qty: 1, tier: 2 };
    const raro = ITEMS[extra.material] && extra.material !== "veio" && extra.material !== "ferro"
      ? extra.material
      : "cristal";
    return { resource: raro, qty: 1, tier: 3 };
  }
  if (kind === "tree") {
    if (r < 0.7) return { resource: "madeira", qty: dois() ? 2 : 1, tier: 1 };
    if (r < 0.95) return { resource: "madeira", qty: dois() ? 3 : 2, tier: 2 };
    return { resource: "madeira", qty: 4, tier: 3 };
  }
  if (r < 0.65) return { resource: "peixe", qty: dois() ? 2 : 1, tier: 1 };
  if (r < 0.92) return { resource: "peixe", qty: dois() ? 3 : 2, tier: 2 };
  return { resource: "peixe-raro", qty: 1, tier: 3 };
}

export function createGather({ rpg, audio, toast, onClose }) {
  let current = null;
  let pick = -1;
  let done = false;
  let resultado = "";

  // A pergunta é do tier do achado. Se aquele tier não tiver pergunta escrita
  // para o continente, desce para os vizinhos em vez de não abrir a coleta.
  function questionFor(continent, tier) {
    const ordem = [tier, 2, 1, 3].filter((t, i, a) => a.indexOf(t) === i);
    return rpg.buildDeck(continent, ordem)[0] || null;
  }

  function open(ctx) {
    const question = questionFor(ctx.continent, ctx.reward.tier);
    if (!question) {
      toast("As perguntas desta região ainda não foram escritas.", 3200);
      return false;
    }
    current = { ...ctx, question };
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
    const { question, reward } = current;
    if (i === question.answer) {
      const ok = current.commit ? current.commit(reward) : true;
      if (ok) {
        rpg.addItem(reward.resource, reward.qty);
        rpg.addSkillXp(current.continent, reward.tier);
        rpg.save();
        resultado = "levou";
        audio.chime?.();
      } else {
        resultado = "vazio";
        audio.error?.();
      }
    } else {
      resultado = "errou";
      audio.error?.();
    }
    render();
  }

  function render() {
    if (!current) return;
    const { kind, continent, reward, question } = current;
    const item = ITEMS[reward.resource] || { name: reward.resource };
    const certo = pick === question.answer;
    $("gather-kicker").textContent = `COLETA · ${NOMES[kind] || "recurso"} · ${CONTINENTS[continent]?.name || ""}`;
    $("gather-title").textContent = item.name;
    $("gather-sub").textContent = done
      ? resultado === "levou"
        ? `guardado · +${reward.qty} no inventário`
        : resultado === "vazio"
          ? "o lugar já estava vazio"
          : "a pergunta venceu · nada foi levado"
      : `${RARIDADE[reward.tier]} · pergunta ${DIFICULDADE[reward.tier]} · acerte para levar ${reward.qty}×`;
    const art = $("gather-art");
    if (art) {
      art.textContent = "";
      art.appendChild(itemIconElement({ id: reward.resource, ...item }));
    }
    const body = $("gather-body");
    body.textContent = "";
    body.appendChild(el("p", "duel-question", question.q));
    const opts = el("div", "duel-options");
    question.options.forEach((text, i) => {
      const b = el("button", "duel-option");
      b.type = "button";
      b.appendChild(el("kbd", "", LETTERS[i] || String(i + 1)));
      b.appendChild(el("span", "", text));
      if (done) {
        b.disabled = true;
        if (i === question.answer) b.classList.add("right");
        else if (i === pick) b.classList.add("wrong");
      } else {
        b.addEventListener("click", () => escolher(i));
      }
      opts.appendChild(b);
    });
    body.appendChild(opts);
    if (done) {
      const fb = el("div", `duel-feedback ${certo ? "good" : "bad"}`);
      fb.appendChild(el("b", "", certo
        ? resultado === "levou"
          ? `Acertou. +${reward.qty} ${item.name}.`
          : "Acertou, mas o lugar já estava vazio."
        : "Errou. O recurso continua no lugar."));
      fb.appendChild(el("span", "", question.why));
      body.appendChild(fb);
      const next = el("button", "duel-next", "fechar");
      next.type = "button";
      next.addEventListener("click", close);
      body.appendChild(next);
    }
  }

  return {
    open,
    close,
    answer: escolher,
    advance: () => { if (done) close(); },
    isOpen: () => !!current,
  };
}

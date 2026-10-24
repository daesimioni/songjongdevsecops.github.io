// Coleta: o achado pede um golpe certeiro, não uma pergunta. A barra corre e
// o jogador para o marcador na faixa; o lendário exige duas batidas seguidas.
import { ITEMS } from "../content/rpg-data.js";
import { CONTINENTS } from "../content/config.js";
import { itemIconElement } from "../rendering/item-art.js";

const $ = (id) => document.getElementById(id);
const NOMES = { vein: "mineração", tree: "lenhador", water: "pesca", farm: "fazenda", cook: "culinária" };
const RARIDADE = { comum: "comum", incomum: "incomum", raro: "raro", lendario: "lendário" };
const VERBO = { vein: "picar", tree: "cortar", water: "lançar a rede", farm: "colher", cook: "preparar" };
const VELOCIDADE = 0.42; // fração da barra por segundo

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
}

// A faixa fica no centro; a dificuldade só estreita a janela.
export function faixaDoTier(tier) {
  return tier >= 3 ? 16 : tier === 2 ? 24 : 32;
}

export function acertouFaixa(pos, tier) {
  return Math.abs(Number(pos) - 50) <= faixaDoTier(tier) / 2;
}

// O sorteio é puro: o mesmo tipo sempre devolve um recurso que existe em
// ITEMS e um tier de 1 a 3. O lendário pede duas batidas.
export function rollGather(kind, rand = Math.random, extra = {}) {
  const coleta = Math.max(0.1, Number(extra.coleta) || 1);
  const comum = kind === "vein" ? 0.55 : kind === "tree" ? 0.7 : 0.6;
  const sorteio = rand();
  const r = Math.min(0.999, sorteio < comum ? sorteio : comum + (sorteio - comum) * coleta);
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
  let done = false;
  let resultado = "";
  let pos = 50;
  let dir = 1;
  let raf = 0;
  let ultimo = 0;

  function totalDeRodadas() {
    return current?.reward?.rounds || 1;
  }

  function pararBarra() {
    if (raf) cancelAnimationFrame(raf);
    raf = 0;
  }

  function andarBarra(t) {
    if (!current || done) return;
    const dt = ultimo ? Math.min(50, t - ultimo) : 16;
    ultimo = t;
    pos += dir * VELOCIDADE * dt;
    if (pos >= 100) { pos = 100; dir = -1; }
    else if (pos <= 0) { pos = 0; dir = 1; }
    const marcador = $("gather-body")?.querySelector?.(".skill-marker");
    if (marcador) marcador.style.left = `${pos}%`;
    raf = requestAnimationFrame(andarBarra);
  }

  function iniciarBarra() {
    pararBarra();
    pos = 50;
    dir = 1;
    ultimo = 0;
    raf = requestAnimationFrame(andarBarra);
  }

  function open(ctx) {
    pararBarra();
    current = { ...ctx };
    etapa = 0;
    done = false;
    resultado = "";
    render();
    iniciarBarra();
    return true;
  }

  function close() {
    pararBarra();
    current = null;
    onClose?.();
  }

  function focusAction() {
    const body = $("gather-body");
    const node = body?.querySelector?.(done ? ".duel-next" : ".skill-tentar");
    node?.focus?.();
  }

  function tentar() {
    if (!current || done) return false;
    done = true;
    pararBarra();
    const tier = current.reward.tier;
    if (!acertouFaixa(pos, tier)) {
      resultado = "errou";
      audio.error?.();
      render();
      focusAction();
      return false;
    }
    if (etapa < totalDeRodadas() - 1) {
      resultado = "mais";
      audio.blip?.();
      render();
      focusAction();
      return true;
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
    focusAction();
    return ok;
  }

  function advance() {
    if (!current || !done) return;
    if (resultado === "mais") {
      etapa++;
      done = false;
      resultado = "";
      render();
      iniciarBarra();
      focusAction();
      return;
    }
    close();
  }

  function render() {
    if (!current) return;
    const { kind, continent, reward } = current;
    const total = totalDeRodadas();
    const item = ITEMS[reward.resource] || { name: reward.resource };
    const faixa = faixaDoTier(reward.tier);
    $("gather-kicker").textContent = `COLETA · ${NOMES[kind] || "recurso"} · ${CONTINENTS[continent]?.name || ""}`;
    $("gather-title").textContent = item.name;
    $("gather-sub").textContent = done
      ? resultado === "levou"
        ? `guardado · +${reward.qty} no inventário`
        : resultado === "vazio"
          ? "o lugar já estava vazio"
          : resultado === "mais"
            ? `${etapa + 1} de ${total} · mais uma batida`
            : "o golpe passou longe · nada foi levado"
      : total > 1
        ? `${RARIDADE[reward.grade]} · ${total} batidas seguidas · acerte a faixa ${total} vezes`
        : `${RARIDADE[reward.grade]} · faixa ${reward.tier === 3 ? "estreita" : reward.tier === 2 ? "média" : "larga"} · acerte para levar ${reward.qty}×`;
    const art = $("gather-art");
    if (art) {
      art.textContent = "";
      art.appendChild(itemIconElement({ id: reward.resource, ...item }));
    }
    const body = $("gather-body");
    body.textContent = "";

    const meter = el("div", "skill-meter");
    meter.setAttribute("role", "img");
    meter.setAttribute("aria-label", `faixa de ${faixa} por cento no centro; marcador em ${Math.round(pos)} por cento`);
    const zone = el("i", "skill-zone");
    zone.style.left = `${50 - faixa / 2}%`;
    zone.style.width = `${faixa}%`;
    const marker = el("i", "skill-marker");
    marker.style.left = `${pos}%`;
    meter.append(zone, marker);
    body.appendChild(meter);

    if (!done) {
      const botao = el("button", "skill-tentar", `${VERBO[kind] || "tentar"} · parar o marcador`);
      botao.type = "button";
      botao.addEventListener("click", tentar);
      body.appendChild(botao);
      const dica = el("p", "skill-dica");
      dica.innerHTML = "Aperte <kbd>Espaço</kbd> ou <kbd>Enter</kbd> quando o marcador cruzar a faixa clara.";
      body.appendChild(dica);
      return;
    }

    const fb = el("div", `duel-feedback ${resultado === "errou" ? "bad" : "good"}`);
    const rotulo = resultado === "errou"
      ? "O golpe passou longe. O recurso continua no lugar."
      : resultado === "vazio"
        ? "Acertou, mas o lugar já estava vazio."
        : resultado === "mais"
          ? "Acertou. Guarde o fôlego: vem outra."
          : `Acertou. +${reward.qty} ${item.name}.`;
    fb.appendChild(el("b", "", rotulo));
    body.appendChild(fb);
    const next = el("button", "duel-next", resultado === "mais" ? "continuar" : "fechar");
    next.type = "button";
    next.addEventListener("click", advance);
    body.appendChild(next);
  }

  return {
    open,
    close,
    tentar,
    advance,
    isOpen: () => !!current,
    isDone: () => done,
    get pos() { return pos; },
  };
}

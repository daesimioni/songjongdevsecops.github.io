// O bestiário: cada caverna do vale, quem vive nela e o que o jogador já
// encarou. Silhueta até o primeiro encontro; ficha inteira depois.
import { AREAS, CONTINENTS, CONTINENT_ORDER } from "../content/config.js";
import { DUNGEONS, dungeonCreatures } from "../content/dungeon-data.js";
import { MONSTER_LABELS, MONSTER_TRAITS, MONSTER_WEAKNESS, TIERS } from "../content/rpg-data.js";
import { drawCreatureArt } from "../rendering/creature.js";

const el = (tag, cls = "", text = "") => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text) node.textContent = text;
  return node;
};

const semAcento = (texto) => String(texto).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

const FILTROS = [
  { id: "todos", label: "todos" },
  { id: "vistos", label: "conhecidos" },
  { id: "vencidos", label: "vencidos" },
  { id: "por-ver", label: "por ver" },
];

// Monta o catálogo inteiro a partir das cavernas: 93 cavernas, 464 criaturas.
// É dado puro, sem DOM, para o teste conferir sem navegador.
export function bestiaryModel() {
  const areas = new Map(AREAS.map((area) => [area.id, area]));
  const grupos = new Map();
  for (const cid of CONTINENT_ORDER) {
    grupos.set(cid, {
      id: cid,
      nome: CONTINENTS[cid]?.name || cid,
      accent: CONTINENTS[cid]?.accent || "#b48cff",
      cacadas: [],
    });
  }
  for (const def of DUNGEONS) {
    const chave = def.id.replace(/^dungeon-/, "");
    const area = areas.get(chave) || null;
    const accent = area?.biome?.accent || def.bossAccent || def.palette?.accent || "#b48cff";
    const grupo = grupos.get(def.continent);
    if (!grupo) continue;
    grupo.cacadas.push({
      id: def.id,
      nome: def.name,
      area: area?.name || "",
      accent,
      bichos: dungeonCreatures(def),
    });
  }
  const continentes = [...grupos.values()].filter((grupo) => grupo.cacadas.length);
  const todos = [];
  for (const grupo of continentes) {
    for (const cacada of grupo.cacadas) {
      for (const bicho of cacada.bichos) todos.push({ ...bicho, cacada, grupo });
    }
  }
  return { continentes, todos, total: todos.length, chefes: todos.filter((bicho) => bicho.chefe).length };
}

export function createBestiary({ rpg, getAreaId }) {
  const modelo = bestiaryModel();
  const sprites = new Map();
  const abertos = new Set();
  let filtro = "todos";
  let busca = "";
  let preparado = false;

  const dados = () => rpg?.data || {};
  const conhecido = (bicho) => {
    const d = dados();
    if (bicho.ids?.some((id) => d.met?.[id] || d.monsters?.[id])) return true;
    return Boolean(bicho.chefe && bicho.chave && d.bosses?.[bicho.chave]);
  };
  const vencido = (bicho) => {
    const d = dados();
    if (bicho.ids?.some((id) => d.monsters?.[id])) return true;
    return Boolean(bicho.chefe && bicho.chave && d.bosses?.[bicho.chave]);
  };

  function resumo() {
    let vistos = 0;
    let vencidos = 0;
    let chefes = 0;
    for (const bicho of modelo.todos) {
      const caiu = vencido(bicho);
      if (caiu || conhecido(bicho)) vistos++;
      if (caiu) {
        vencidos++;
        if (bicho.chefe) chefes++;
      }
    }
    return { total: modelo.total, vistos, vencidos, chefes, chefesTotal: modelo.chefes };
  }

  function sprite(bicho, visto) {
    const chave = `${bicho.tipo}|${visto ? bicho.accent : "oculto"}|${bicho.chefe ? "b" : "m"}`;
    if (sprites.has(chave)) return sprites.get(chave);
    const canvas = document.createElement("canvas");
    canvas.width = 64;
    canvas.height = 64;
    const ctx = canvas.getContext("2d");
    if (!ctx) return "";
    ctx.imageSmoothingEnabled = false;
    ctx.translate(32, 58);
    drawCreatureArt(ctx, bicho.tipo, visto ? bicho.accent : "#4d5b7d", 0, bicho.chefe ? 1 : 1.45);
    const url = canvas.toDataURL("image/png");
    sprites.set(chave, url);
    return url;
  }

  function combina(bicho, cacada, grupo) {
    const termo = semAcento(busca.trim());
    if (termo) {
      const alvo = semAcento(`${bicho.nome} ${bicho.tipo} ${MONSTER_LABELS[bicho.tipo] || ""} ${cacada.nome} ${cacada.area} ${grupo.nome}`);
      if (!alvo.includes(termo)) return false;
    }
    if (filtro === "vistos") return conhecido(bicho);
    if (filtro === "vencidos") return vencido(bicho);
    if (filtro === "por-ver") return !conhecido(bicho);
    return true;
  }

  function carta(bicho) {
    const visto = conhecido(bicho);
    const caiu = vencido(bicho);
    const card = el("article", `best-card t${bicho.tier}${visto ? "" : " oculto"}${bicho.chefe ? " chefe" : ""}`);
    const retrato = el("div", "best-sprite");
    const img = document.createElement("img");
    img.src = sprite(bicho, visto);
    img.alt = visto ? "" : "silhueta de uma criatura ainda não encontrada";
    img.width = 64;
    img.height = 64;
    retrato.appendChild(img);

    const ficha = el("div", "best-ficha");
    ficha.appendChild(el("b", "best-nome", visto ? bicho.nome : "???"));
    const especie = bicho.chefe
      ? "chefe da caçada"
      : `${MONSTER_LABELS[bicho.tipo] || bicho.tipo} · ${TIERS[bicho.tier]?.stars || ""} ${TIERS[bicho.tier]?.name || ""}`;
    ficha.appendChild(el("span", "best-especie", especie));
    if (visto) {
      const trait = MONSTER_TRAITS[bicho.tipo]?.label;
      const weak = MONSTER_WEAKNESS[bicho.tipo];
      if (trait) ficha.appendChild(el("span", "best-trait", trait));
      if (weak) ficha.appendChild(el("span", "best-weak", `fraqueza: ${weak}`));
      ficha.appendChild(el("i", "best-state", caiu ? "vencido" : "encontrado, ainda de pé"));
      card.title = `${bicho.nome} · ${especie}${trait ? ` · ${trait}` : ""}${weak ? ` · fraqueza: ${weak}` : ""}`;
    } else {
      ficha.appendChild(el("span", "best-trait", "por encontrar na caverna"));
      card.title = "criatura ainda não encontrada";
    }
    card.append(retrato, ficha);
    return card;
  }

  function desenhar() {
    const lista = document.getElementById("best-list");
    if (!lista) return;
    const r = resumo();
    const texto = document.getElementById("best-progress");
    if (texto) texto.textContent = `${r.vistos} de ${r.total} criaturas descobertas`;
    const meter = document.getElementById("best-meter-fill");
    if (meter) meter.style.width = `${r.total ? Math.round((r.vistos / r.total) * 100) : 0}%`;
    const barra = document.getElementById("best-meter");
    if (barra) {
      barra.setAttribute("aria-valuemax", String(r.total));
      barra.setAttribute("aria-valuenow", String(r.vistos));
    }
    const numeros = document.getElementById("best-stats");
    if (numeros) {
      numeros.textContent = "";
      for (const [valor, rotulo] of [[`${r.vistos}/${r.total}`, "descobertos"], [`${r.vencidos}`, "vencidos"], [`${r.chefes}/${r.chefesTotal}`, "chefes"]]) {
        const tile = el("div", "best-numero");
        tile.append(el("b", "", valor), el("span", "", rotulo));
        numeros.appendChild(tile);
      }
    }
    // famílias: o jogador vê o que já conhece e o que a família rende
    const familias = document.getElementById("best-familias");
    if (familias) {
      familias.textContent = "";
      for (const familia of rpg?.familiasView?.() || []) {
        const chip = el("div", `best-familia${familia.completa ? " completa" : ""}`);
        chip.setAttribute("role", "listitem");
        chip.append(
          el("b", "", familia.nome),
          el("span", "", `${familia.conhecidos}/${familia.total}${familia.completa ? " · +50% de dano" : ""}`),
        );
        chip.title = familia.desc;
        familias.appendChild(chip);
      }
    }
    for (const botao of document.querySelectorAll("#best-tabs .best-tab")) {
      const ativo = botao.dataset.filtro === filtro;
      botao.setAttribute("aria-pressed", ativo ? "true" : "false");
      const quantos = modelo.todos.filter((bicho) => {
        if (botao.dataset.filtro === "vistos") return conhecido(bicho);
        if (botao.dataset.filtro === "vencidos") return vencido(bicho);
        if (botao.dataset.filtro === "por-ver") return !conhecido(bicho);
        return true;
      }).length;
      const rotulo = FILTROS.find((f) => f.id === botao.dataset.filtro)?.label || "";
      botao.textContent = `${rotulo} ${quantos}`;
    }

    const filtrando = filtro !== "todos" || busca.trim() !== "";
    const visiveis = modelo.todos.filter((bicho) => combina(bicho, bicho.cacada, bicho.grupo));
    lista.textContent = "";
    if (!visiveis.length) {
      lista.appendChild(el("p", "best-vazio", "Nenhuma criatura com esse filtro. Tente outro continente ou limpe a busca."));
      return;
    }
    for (const grupo of modelo.continentes) {
      const cacadas = grupo.cacadas.filter((cacada) => cacada.bichos.some((bicho) => combina(bicho, cacada, grupo)));
      if (!cacadas.length) continue;
      const secao = el("section", "best-continente");
      secao.style.setProperty("--c", grupo.accent);
      const achados = grupo.cacadas.flatMap((cacada) => cacada.bichos).filter(conhecido).length;
      const totalGrupo = grupo.cacadas.flatMap((cacada) => cacada.bichos).length;
      const head = el("header", "best-continente-head");
      head.append(el("h3", "", grupo.nome), el("span", "", `${achados}/${totalGrupo} descobertos`));
      const caixa = el("div", "best-cacadas");
      for (const cacada of cacadas) {
        const det = document.createElement("details");
        det.className = "best-cacada";
        det.dataset.cacada = cacada.id;
        det.open = filtrando || abertos.has(cacada.id);
        if (!filtrando) {
          det.addEventListener("toggle", () => {
            if (det.open) abertos.add(cacada.id);
            else abertos.delete(cacada.id);
          });
        }
        const sum = document.createElement("summary");
        const ponto = el("i", "best-dot");
        ponto.style.background = cacada.accent;
        const lugar = cacada.area ? `${cacada.area} · ${grupo.nome}` : grupo.nome;
        const achadosCacada = cacada.bichos.filter(conhecido).length;
        sum.append(ponto, el("b", "", cacada.nome), el("span", "best-lugar", lugar), el("span", "best-contagem", `${achadosCacada}/${cacada.bichos.length}`));
        const cards = el("div", "best-cards");
        for (const bicho of cacada.bichos.filter((b) => combina(b, cacada, grupo))) cards.appendChild(carta(bicho));
        det.append(sum, cards);
        caixa.appendChild(det);
      }
      secao.append(head, caixa);
      lista.appendChild(secao);
    }
  }

  function preparar() {
    if (preparado) return;
    preparado = true;
    const tabs = document.getElementById("best-tabs");
    if (tabs) {
      for (const item of FILTROS) {
        const botao = el("button", "best-tab", item.label);
        botao.type = "button";
        botao.dataset.filtro = item.id;
        botao.setAttribute("aria-pressed", item.id === filtro ? "true" : "false");
        botao.addEventListener("click", () => {
          filtro = item.id;
          desenhar();
        });
        tabs.appendChild(botao);
      }
    }
    const campo = document.getElementById("best-search");
    campo?.addEventListener("input", () => {
      busca = campo.value;
      desenhar();
    });
  }

  function abrir() {
    const area = getAreaId?.();
    const cacadaAtual = area ? (area.startsWith("dungeon-") ? area : `dungeon-${area}`) : "";
    if (cacadaAtual) abertos.add(cacadaAtual);
    preparar();
    desenhar();
    // o modal só aparece depois desta chamada: espera o quadro para rolar até
    // a caverna onde o jogador está, em vez de abrir no topo da lista
    if (cacadaAtual) {
      const alvo = document.querySelector(`#best-list details[data-cacada="${cacadaAtual}"]`);
      if (alvo) requestAnimationFrame(() => alvo.scrollIntoView({ block: "nearest" }));
    }
  }

  return { open: abrir, render: desenhar, summary: resumo };
}

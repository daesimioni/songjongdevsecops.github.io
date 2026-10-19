// A ficha do aventureiro: vida, perícias, itens, forja e o que cada coisa faz.
import { CONTINENTS } from "./config.js";
import { ITEMS, RECIPES } from "./rpg-data.js";

const $ = (id) => document.getElementById(id);

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
}

function accentOf(continent) {
  return CONTINENTS[continent]?.accent || "#ffc857";
}

export function createSheet({ rpg, getLevel, getXp, getTitle, toast, audio, onUse }) {
  function render() {
    const body = $("sheet-body");
    if (!body) return;
    body.textContent = "";
    const level = getLevel();
    const hp = rpg.hp();
    const hpMax = rpg.hpMax();
    const title = getTitle?.() || "";

    const top = el("div", "sheet-top");
    const id = el("div", "sheet-id");
    id.append(
      el("b", "", `Nível ${level}`),
      el("span", "", `${getXp()} XP · ${title || "sem título"}`),
    );
    const vitals = el("div", "sheet-vitals");
    const hpLabel = el("div", "sheet-hp-label");
    hpLabel.append(el("span", "", "vida"), el("b", "", `${hp}/${hpMax}`));
    const hpBar = el("div", "sheet-bar");
    const hpFill = el("i");
    hpFill.style.width = `${hpMax ? Math.round((hp / hpMax) * 100) : 0}%`;
    hpBar.appendChild(hpFill);
    vitals.append(hpLabel, hpBar);
    top.append(id, vitals);
    body.appendChild(top);

    body.appendChild(el("h3", "sheet-sec", "Perícias"));
    const grid = el("div", "sheet-skills");
    for (const s of rpg.skillsView()) {
      const card = el("div", "skill-card");
      card.style.setProperty("--c", s.color);
      const head = el("div", "skill-head");
      head.append(el("b", "", s.name), el("span", "", `nv ${s.level}`));
      const bar = el("div", "sheet-bar");
      const fill = el("i");
      fill.style.width = `${s.pct}%`;
      bar.appendChild(fill);
      const foot = el("div", "skill-foot");
      foot.append(el("span", "", s.desc), el("span", "", `dano ${s.damage}`));
      card.append(head, bar, foot);
      grid.appendChild(card);
    }
    body.appendChild(grid);

    body.appendChild(el("h3", "sheet-sec", "Mochila"));
    const inv = rpg.inventoryList();
    if (!inv.length) {
      body.appendChild(el("p", "sheet-empty", "A mochila está vazia. Os monstros das caçadas deixam alguma coisa."));
    } else {
      const list = el("div", "sheet-items");
      for (const item of inv) {
        const card = el("div", "item-card");
        card.style.setProperty("--c", accentOf(item.continent));
        const icon = el("span", "item-icon", item.name.slice(0, 1));
        const text = el("div", "item-text");
        text.append(el("b", "", `${item.name} ×${item.qty}`), el("span", "", item.desc));
        card.append(icon, text);
        if (item.heal || item.use === "light" || item.use === "bomb") {
          const use = el("button", "item-use", "usar");
          use.type = "button";
          use.addEventListener("click", () => {
            const res = rpg.useItem(item.id);
            if (!res.ok) { toast(res.reason, 3200); return; }
            if (res.healed) toast(`+${res.healed} de vida.`, 2400);
            else if (res.light) toast("A tocha acende.", 2400);
            else if (res.bomb) toast("A bomba estoura.", 2400);
            audio.blip();
            onUse?.(item.id, res);
            render();
          });
          card.appendChild(use);
        }
        list.appendChild(card);
      }
      body.appendChild(list);
    }

    body.appendChild(el("h3", "sheet-sec", "Forja e alquimia"));
    const recipes = el("div", "sheet-recipes");
    for (const recipe of RECIPES) {
      const card = el("div", "recipe-card");
      const need = Object.entries(recipe.need)
        .map(([id, n]) => `${ITEMS[id]?.name || id} ${rpg.itemCount(id)}/${n}`)
        .join(" · ");
      card.append(el("b", "", recipe.name), el("span", "", need));
      const make = el("button", "item-use", "fazer");
      make.type = "button";
      make.addEventListener("click", () => {
        const res = rpg.craft(recipe.id);
        if (!res.ok) {
          toast(res.reason, 3200);
          audio.error?.();
          return;
        }
        toast(`${res.item.name} feito.`, 2600);
        audio.chime();
        render();
      });
      card.appendChild(make);
      recipes.appendChild(card);
    }
    body.appendChild(recipes);

    const note = el("p", "sheet-note");
    note.textContent = "Responder certo nas caçadas sobe a perícia do continente, que aumenta o dano contra os monstros. A caverna dá ferro, erva, cristal e madeira: a forja transforma em poção, tocha e chave. Tocha acesa aumenta a luz no subsolo por dois minutos.";
    body.appendChild(note);
  }

  return { render };
}

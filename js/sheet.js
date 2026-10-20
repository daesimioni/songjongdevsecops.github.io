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

function passiveText(passive = {}) {
  return [
    passive.hp ? `+${passive.hp} vida` : "",
    passive.sight ? `+${passive.sight} luz` : "",
    passive.damage ? `+${passive.damage} dano` : "",
    passive.manaMax ? `+${passive.manaMax} mana` : "",
    passive.manaHit ? `+${passive.manaHit} mana por acerto` : "",
  ].filter(Boolean).join(", ") || "sem passivo";
}

export function createSheet({ rpg, getLevel, getXp, getTitle, toast, audio, onUse, onOutfits, onPetAbility }) {
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

    const buffs = rpg.buffView();
    if (buffs.length) {
      body.appendChild(el("p", "sheet-buffs", `efeitos: ${buffs.map((b) => `${b.name} ${b.left}s`).join(" · ")}`));
    }
    // ---------- companhia: bichos e montarias ----------
    body.appendChild(el("h3", "sheet-sec", "Companhia"));
    const mana = rpg.mana();
    const manaMax = rpg.manaMax();
    const manaLabel = el("div", "sheet-hp-label");
    manaLabel.append(el("span", "", "mana"), el("b", "", `${mana}/${manaMax}`));
    const manaBar = el("div", "sheet-bar mana");
    const manaFill = el("i");
    manaFill.style.width = `${manaMax ? Math.round((mana / manaMax) * 100) : 0}%`;
    manaBar.appendChild(manaFill);
    body.append(manaLabel, manaBar);
    body.appendChild(el("p", "company-hint", "mana paga as habilidades do bicho ativo; runa é carga guardada, gasta uma por uso."));

    const company = el("div", "company");
    const pet = rpg.activePet();
    if (pet) {
      const cd = rpg.petCdLeft(pet.id);
      const row = el("div", "company-pet");
      const use = el("button", "item-use", cd > 0
        ? `${pet.ability.name} · ${Math.ceil(cd / 1000)}s`
        : `${pet.ability.name} · ${pet.ability.mana} mana`);
      use.type = "button";
      use.disabled = cd > 0 || (pet.ability.id !== "mana" && mana < pet.ability.mana);
      use.addEventListener("click", () => {
        const res = rpg.usePetAbility({ duel: false });
        if (!res.ok) { toast(res.reason, 3200); audio.error?.(); render(); return; }
        onPetAbility?.(res);
        render();
      });
      row.append(
        el("b", "", pet.name),
        el("span", "", `passivo: ${passiveText(pet.passive)} · ${pet.ability.desc}`),
        use,
      );
      company.appendChild(row);
    } else {
      company.appendChild(el("p", "sheet-empty", "Nenhum bicho anda com você ainda. Dê três rações ao bicho da praça subterrânea do continente."));
    }

    const roster = el("div", "pet-roster");
    for (const p of rpg.petsView()) {
      const card = el("div", `pet-card${p.active ? " on" : ""}`);
      const head = el("div", "pet-head");
      head.append(el("b", "", p.name), el("span", "", p.tamed ? "domado" : `afeição ${p.bond}/${p.max}`));
      card.append(head, el("span", "pet-where", `${p.where} · ${passiveText(p.passive)}`));
      if (p.tamed && !p.active) {
        const pick = el("button", "item-use", "chamar");
        pick.type = "button";
        pick.addEventListener("click", () => {
          const res = rpg.setPet(p.id);
          if (!res.ok) { toast(res.reason, 2600); return; }
          toast(`${p.name} agora anda com você.`, 2600);
          audio.blip();
          render();
        });
        card.appendChild(pick);
      }
      roster.appendChild(card);
    }
    company.appendChild(roster);

    const stable = el("div", "mount-list");
    for (const m of rpg.mountsView()) {
      const row = el("div", "mount-row");
      const price = Object.entries(m.price).map(([id, qty]) => `${ITEMS[id]?.name || id} ${qty}`).join(" · ");
      row.append(el("b", "", m.name), el("span", "", `${m.desc} (${price})`));
      const action = el("button", "item-use", m.owned ? (m.active ? "desmontar" : "montar") : "comprar");
      action.type = "button";
      action.disabled = !m.owned && !m.can;
      action.addEventListener("click", () => {
        if (!m.owned) {
          const res = rpg.buyMount(m.id);
          if (!res.ok) { toast(res.reason, 3000); return; }
          toast(`${res.name} é sua e já está selada.`, 3200);
          audio.chime();
        } else {
          const res = rpg.setMount(m.active ? null : m.id);
          toast(res.ok
            ? (m.active ? `${m.name} descansa no cais.` : `${m.name} pronta para a estrada.`)
            : res.reason, 2800);
          audio.blip();
        }
        render();
      });
      row.appendChild(action);
      stable.appendChild(row);
    }
    company.appendChild(stable);
    body.appendChild(company);

    if (onOutfits) {
      const look = el("button", "sheet-outfit", "trocar traje");
      look.type = "button";
      look.addEventListener("click", () => onOutfits());
      body.appendChild(look);
    }

    body.appendChild(el("h3", "sheet-sec", "Equipamento"));
    const gear = el("div", "sheet-gear");
    for (const slot of rpg.equippedView()) {
      const row = el("div", "gear-row");
      row.append(el("span", "gear-slot", slot.name), el("b", "", slot.item ? slot.item.name : "vazio"));
      if (slot.item) {
        const off = el("button", "item-use", "tirar");
        off.type = "button";
        off.addEventListener("click", () => {
          rpg.unequip(slot.slot);
          audio.blip();
          render();
        });
        row.appendChild(off);
      }
      gear.appendChild(row);
    }
    const bagGear = rpg.inventoryList().filter((item) => item.slot && rpg.data.equipped?.[item.slot] !== item.id);
    for (const item of bagGear) {
      const row = el("div", "gear-row");
      const bonus = [item.damage ? `+${item.damage} dano` : "", item.hp ? `+${item.hp} vida` : ""].filter(Boolean).join(" · ");
      row.append(el("span", "gear-slot", item.slot), el("b", "", `${item.name}${bonus ? ` (${bonus})` : ""}`));
      const on = el("button", "item-use", "equipar");
      on.type = "button";
      on.addEventListener("click", () => {
        const res = rpg.equip(item.id);
        if (!res.ok) { toast(res.reason, 2600); return; }
        toast(`${item.name} equipado.`, 2400);
        audio.blip();
        render();
      });
      row.appendChild(on);
      gear.appendChild(row);
    }
    body.appendChild(gear);

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
      body.appendChild(el("p", "sheet-empty", "A mochila está vazia. Os monstros das cavernas deixam alguma coisa."));
    } else {
      const list = el("div", "sheet-items");
      for (const item of inv) {
        const card = el("div", "item-card");
        card.style.setProperty("--c", accentOf(item.continent));
        const icon = el("span", "item-icon", item.name.slice(0, 1));
        const text = el("div", "item-text");
        text.append(el("b", "", `${item.name} ×${item.qty}`), el("span", "", item.desc));
        card.append(icon, text);
        if (item.heal || item.use === "light" || item.use === "bomb" || item.use === "spark") {
          const use = el("button", "item-use", "usar");
          use.type = "button";
          use.addEventListener("click", () => {
            const res = rpg.useItem(item.id);
            if (!res.ok) { toast(res.reason, 3200); return; }
            const accepted = onUse?.(item.id, res) !== false;
            const bits = [];
            if (res.healed) bits.push(`+${res.healed} de vida`);
            if (res.buff) bits.push(`${res.buff.name} ${Math.round(res.buff.ms / 1000)}s`);
            if (bits.length) toast(bits.join(" · "), 3000);
            else if ((res.light || res.bomb) && accepted) {
              toast(res.light ? "A tocha acende." : "A bomba estoura.", 2400);
            }
            audio.blip();
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

    body.appendChild(el("h3", "sheet-sec", "Encantamentos"));
    const enchants = el("div", "sheet-recipes");
    for (const enchant of rpg.enchantsView()) {
      const card = el("div", "recipe-card enchant-card");
      const need = Object.entries(enchant.need)
        .map(([id, n]) => `${ITEMS[id]?.name || id} ${rpg.itemCount(id)}/${n}`)
        .join(" · ");
      card.append(
        el("b", "", enchant.name),
        el("span", "", `${enchant.desc} ${enchant.owned ? "já gravado." : need}`),
      );
      const make = el("button", "item-use", enchant.owned ? "ativo" : "encantar");
      make.type = "button";
      make.disabled = enchant.owned;
      make.addEventListener("click", () => {
        const res = rpg.enchant(enchant.id);
        if (!res.ok) {
          toast(res.reason, 3200);
          audio.error?.();
          return;
        }
        toast(`${res.enchant.name} gravado.`, 3000);
        audio.chime();
        render();
      });
      card.appendChild(make);
      enchants.appendChild(card);
    }
    body.appendChild(enchants);

    const note = el("p", "sheet-note");
    note.textContent = "Responder certo nas caçadas sobe a perícia do continente, que aumenta o dano. A caverna dá ferro, erva, cristal e madeira; a forja faz ferramentas, comida, tocha, chave e bomba. Os veios de cristal pedem picareta, a horta pede semente e o bicho da cidade pede ração. Encantamentos ficam para sempre.";
    body.appendChild(note);
  }

  return { render };
}

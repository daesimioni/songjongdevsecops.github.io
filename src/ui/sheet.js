// A ficha do aventureiro: vida, perícias, itens, forja e o que cada coisa faz.
import { petAbilityNeedsDuel } from "../gameplay/rpg.js";
import { ITEMS, RECIPES } from "../content/rpg-data.js";

const $ = (id) => document.getElementById(id);

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
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

export function createSheet({ rpg, getLevel, getXp, getTitle, toast, audio, onOutfits, onLook, onPetAbility, onInventory, onCooking }) {
  let refresh = () => {};
  let abaFicha = "resumo";
  function render() {
    const body = $("sheet-body");
    if (!body) return;
    body.textContent = "";
    refresh = () => {};
    // quatro páginas curtas em vez de um rolo: resumo, equipamento, perícias e forja
    const paginas = {
      resumo: el("section", "sheet-page"),
      equipamento: el("section", "sheet-page"),
      pericias: el("section", "sheet-page"),
      forja: el("section", "sheet-page"),
    };
    const rotulosFicha = { resumo: "Resumo", equipamento: "Equipamento", pericias: "Perícias", forja: "Forja" };
    const botoesAba = new Map();
    const abasFicha = el("div", "book-tabs");
    abasFicha.setAttribute("role", "tablist");
    abasFicha.setAttribute("aria-label", "seções da ficha");
    function trocarAbaFicha(id) {
      abaFicha = id;
      for (const [chave, botao] of botoesAba) {
        const on = chave === id;
        botao.className = on ? "book-tab on" : "book-tab";
        botao.setAttribute("aria-selected", on ? "true" : "false");
        botao.tabIndex = on ? 0 : -1;
      }
      for (const [chave, pagina] of Object.entries(paginas)) pagina.hidden = chave !== id;
    }
    for (const [id, rotulo] of Object.entries(rotulosFicha)) {
      const botao = el("button", "book-tab", rotulo);
      botao.type = "button";
      botao.id = `sheet-tab-${id}`;
      botao.setAttribute("role", "tab");
      botao.setAttribute("aria-controls", `sheet-page-${id}`);
      botao.addEventListener("click", () => trocarAbaFicha(id));
      abasFicha.appendChild(botao);
      botoesAba.set(id, botao);
    }
    abasFicha.addEventListener("keydown", (event) => {
      const keys = ["ArrowRight", "ArrowLeft", "Home", "End"];
      if (!keys.includes(event.key)) return;
      const buttons = [...botoesAba.values()];
      const index = buttons.indexOf(document.activeElement);
      if (index < 0) return;
      event.preventDefault();
      const next = event.key === "Home" ? 0 : event.key === "End" ? buttons.length - 1
        : (index + (event.key === "ArrowRight" ? 1 : -1) + buttons.length) % buttons.length;
      buttons[next].click();
      buttons[next].focus({ preventScroll: true });
    });
    body.appendChild(abasFicha);
    for (const [id, pagina] of Object.entries(paginas)) {
      pagina.id = `sheet-page-${id}`;
      pagina.dataset.sheetPage = id;
      pagina.setAttribute("role", "tabpanel");
      pagina.setAttribute("aria-labelledby", `sheet-tab-${id}`);
      body.appendChild(pagina);
    }
    trocarAbaFicha(abaFicha);
    let destino = paginas.resumo;
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
    destino.appendChild(top);

    // ---------- vocação: o jeito de lutar, com força e fraqueza à vista ----
    const voc = rpg.vocacao();
    const sub = rpg.sub();
    destino.appendChild(el("h3", "sheet-sec", "Vocação"));
    const vbox = el("div", "sheet-vocation");
    vbox.appendChild(el("b", "", voc.name));
    vbox.appendChild(el("span", "", sub ? `${sub.name}: ${sub.efeito}` : (level >= 10 ? "subcategoria aberta: escolha na mesa do subsolo" : "a subcategoria abre no nível 10")));
    vbox.appendChild(el("span", "sheet-vocation-weak", `força: ${voc.forca} · fraqueza: ${voc.fraqueza}`));
    destino.appendChild(vbox);

    const buffs = rpg.buffView();
    if (buffs.length) {
      destino.appendChild(el("p", "sheet-buffs", `efeitos: ${buffs.map((b) => `${b.name} ${b.left}s`).join(" · ")}`));
    }
    // ---------- companhia: bichos e montarias ----------
    destino.appendChild(el("h3", "sheet-sec", "Companhia"));
    const mana = rpg.mana();
    const manaMax = rpg.manaMax();
    const manaLabel = el("div", "sheet-hp-label");
    manaLabel.append(el("span", "", "mana"), el("b", "", `${mana}/${manaMax}`));
    const manaBar = el("div", "sheet-bar mana");
    const manaFill = el("i");
    manaFill.style.width = `${manaMax ? Math.round((mana / manaMax) * 100) : 0}%`;
    manaBar.appendChild(manaFill);
    destino.append(manaLabel, manaBar);
    destino.appendChild(el("p", "company-hint", "Mana paga habilidades e runas aprendidas. Cargas de runa são gastas antes da mana."));

    let petUse = null;
    const company = el("div", "company");
    const pet = rpg.activePet();
    if (pet) {
      const row = el("div", "company-pet");
      const use = el("button", "item-use");
      use.type = "button";
      petUse = use;
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

    // Atualiza os valores sem reconstruir botões e perder o foco do teclado.
    refresh = () => {
      const currentMana = rpg.mana();
      const maximum = rpg.manaMax();
      manaLabel.children[1].textContent = `${currentMana}/${maximum}`;
      manaFill.style.width = `${maximum ? Math.round(currentMana / maximum * 100) : 0}%`;
      hpLabel.children[1].textContent = `${rpg.hp()}/${rpg.hpMax()}`;
      hpFill.style.width = `${Math.round(rpg.hp() / rpg.hpMax() * 100)}%`;
      if (petUse && pet) {
        const onlyDuel = petAbilityNeedsDuel(pet.ability.id);
        const left = rpg.petCdLeft(pet.id);
        petUse.textContent = onlyDuel ? `${pet.ability.name} · somente em combate`
          : left > 0 ? `${pet.ability.name} · ${Math.ceil(left / 1000)}s`
            : `${pet.ability.name} · ${pet.ability.mana} mana`;
        petUse.disabled = onlyDuel || left > 0 || (pet.ability.id !== "mana" && currentMana < pet.ability.mana);
      }
    };
    refresh();

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
    destino.appendChild(company);

    if (onOutfits || onLook) {
      const row = el("div", "sheet-look-row");
      if (onLook) {
        const bodyBtn = el("button", "sheet-outfit", "mudar personagem");
        bodyBtn.type = "button";
        bodyBtn.addEventListener("click", () => onLook());
        row.appendChild(bodyBtn);
      }
      if (onOutfits) {
        const look = el("button", "sheet-outfit", "trocar traje");
        look.type = "button";
        look.addEventListener("click", () => onOutfits());
        row.appendChild(look);
      }
      destino.appendChild(row);
    }

    destino = paginas.equipamento;
    destino.appendChild(el("h3", "sheet-sec", "Equipamento"));
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
    destino.appendChild(gear);
    const bonusGear = rpg.equipmentBonus();
    destino.appendChild(el("p", "company-hint", `${bonusGear.conjunto
      ? "Conjunto fechado: três peças do mesmo continente dão +2 de vida e +1 de dano."
      : "Três peças do mesmo continente fecham conjunto: +2 de vida e +1 de dano."}${bonusGear.shield ? " Escudo equipado segura o primeiro golpe de cada combate." : ""}`));

    destino.appendChild(el("h3", "sheet-sec", "Builds"));
    const builds = el("div", "sheet-builds");
    const listaBuilds = rpg.buildsView();
    if (!listaBuilds.length) {
      builds.appendChild(el("p", "sheet-empty", "Nenhuma build guardada. Monte o conjunto e salve um retrato para trocar tudo de uma vez."));
    }
    for (const b of listaBuilds) {
      const row = el("div", "build-row");
      row.append(el("b", "", b.nome), el("span", "build-pecas", `${b.pecas} peça${b.pecas === 1 ? "" : "s"}`));
      const usar = el("button", "item-use", "usar");
      usar.type = "button";
      usar.addEventListener("click", () => {
        const res = rpg.usarBuild(b.index);
        if (!res.ok) { toast(res.reason, 2800); return; }
        const falta = res.faltando.length ? ` Falta: ${res.faltando.join(", ")}.` : "";
        toast(`Build ${res.nome}: ${res.equipadas} peça${res.equipadas === 1 ? "" : "s"} equipada${res.equipadas === 1 ? "" : "s"}.${falta}`, 3200);
        audio.blip();
        render();
      });
      const tirar = el("button", "item-use", "remover");
      tirar.type = "button";
      tirar.addEventListener("click", () => {
        const res = rpg.removerBuild(b.index);
        if (!res.ok) { toast(res.reason, 2600); return; }
        toast(`Build ${res.nome} removida.`, 2400);
        audio.blip();
        render();
      });
      row.append(usar, tirar);
      builds.appendChild(row);
    }
    const salvarBuildRow = el("div", "build-row build-salvar");
    const nomeBuild = el("input", "build-nome");
    nomeBuild.placeholder = "nome da build";
    nomeBuild.maxLength = 16;
    nomeBuild.setAttribute("aria-label", "nome da build nova");
    const salvarBuild = el("button", "item-use", "salvar a atual");
    salvarBuild.type = "button";
    salvarBuild.disabled = listaBuilds.length >= 3;
    salvarBuild.addEventListener("click", () => {
      const res = rpg.salvarBuild(nomeBuild.value);
      if (!res.ok) { toast(res.reason, 2800); return; }
      toast(`Build ${res.nome} guardada.`, 2400);
      audio.blip();
      render();
    });
    salvarBuildRow.append(nomeBuild, salvarBuild);
    builds.appendChild(salvarBuildRow);
    destino.appendChild(builds);
    destino.appendChild(el("p", "company-hint", "A build guarda o retrato do que está vestido. Três é o limite; usar troca o conjunto inteiro."));

    destino = paginas.pericias;
    destino.appendChild(el("h3", "sheet-sec", "Perícias"));
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
    destino.appendChild(grid);

    // a mochila de verdade mora no painel em grade; aqui fica só o resumo
    destino = paginas.equipamento;
    destino.appendChild(el("h3", "sheet-sec", "Mochila"));
    const inv = rpg.inventoryList();
    if (!inv.length) {
      destino.appendChild(el("p", "sheet-empty", "A mochila está vazia. Explore o chão e as cavernas para encher."));
    } else {
      const resumo = el("div", "sheet-bag-resumo");
      const total = inv.reduce((n, item) => n + item.qty, 0);
      const texto = el("div", "sheet-bag-text");
      texto.append(el("b", "", `${inv.length} tipo${inv.length === 1 ? "" : "s"} · ${total} itens`), el("span", "", "grade, equipamento e detalhe do item"));
      const abrir = el("button", "item-use", "abrir mochila");
      abrir.type = "button";
      abrir.addEventListener("click", () => onInventory?.());
      resumo.append(texto, abrir);
      destino.appendChild(resumo);
    }

    destino = paginas.forja;
    destino.appendChild(el("h3", "sheet-sec", "Forja e alquimia"));
    const recipes = el("div", "sheet-recipes");
    for (const recipe of RECIPES) {
      const card = el("div", "recipe-card");
      const need = Object.entries(recipe.need)
        .map(([id, n]) => `${ITEMS[id]?.name || id} ${rpg.itemCount(id)}/${n}`)
        .join(" · ");
      card.append(el("b", "", recipe.name), el("span", "", need));
      const make = el("button", "item-use", "fazer");
      make.type = "button";
      const pode = Object.entries(recipe.need).every(([id, n]) => rpg.itemCount(id) >= n);
      make.addEventListener("click", () => {
        const produto = ITEMS[recipe.out];
        // comida e poção passam pela pergunta da região antes de sair da forja
        const comida = produto && (produto.heal || produto.mana || produto.buff);
        if (comida && pode && onCooking?.(recipe)) return;
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
    destino.appendChild(recipes);

    destino.appendChild(el("h3", "sheet-sec", "Encantamentos"));
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
    destino.appendChild(enchants);

    const note = el("p", "sheet-note");
    note.textContent = "Responder certo nas caçadas sobe a perícia da região, e a perícia aumenta o dano. A caverna dá ferro, erva, cristal e madeira. A forja transforma; a horta devolve; a comida e a poção pedem uma pergunta da região; o bicho da cidade aprende a confiar. Encantamentos ficam.";
    destino.appendChild(note);
  }

  return { render, refresh: () => refresh() };
}

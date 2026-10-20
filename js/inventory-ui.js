// A mochila em grade: equipamento à esquerda, itens no meio e detalhe à
// direita. Funciona com arrastar e soltar no desktop e com toque no celular.

import { itemIconElement, itemAccent } from "./item-art.js";

const el = (tag, cls = "", text = "") => {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text) node.textContent = text;
  return node;
};

const SLOTS = 40;

function statsDe(item) {
  const bits = [];
  if (item.damage) bits.push(`+${item.damage} dano`);
  if (item.hp) bits.push(`+${item.hp} vida`);
  if (item.weapon) bits.push(`tipo ${item.weapon}`);
  if (item.relic) bits.push("relíquia");
  return bits.join(" · ");
}

export function createInventoryUI({ rpg, toast, audio, onUse, onChange }) {
  let selecionado = null;
  let ultimo = null;
  let gradePreparada = false;

  function abrirDetalhe(item) {
    const box = document.getElementById("inv-detail");
    if (!box) return;
    box.textContent = "";
    if (!item) {
      const titulo = el("h3", "inv-detail-title", "sua mochila");
      const texto = el("p", "inv-detail-text", "Arraste uma peça para o espaço de equipamento ou toque no item para ver o que ele faz. O que você veste aparece no boneco.");
      box.append(titulo, texto);
      return;
    }
    const head = el("div", "inv-detail-head");
    head.append(itemIconElement(item));
    const nome = el("div", "inv-detail-name");
    nome.append(el("b", "", item.name), el("span", "", `${item.qty || 1} unidade${(item.qty || 1) > 1 ? "s" : ""}`));
    head.appendChild(nome);
    box.appendChild(head);
    if (item.desc) box.appendChild(el("p", "inv-detail-text", item.desc));
    const bonus = statsDe(item);
    if (bonus) box.appendChild(el("p", "inv-detail-bonus", bonus));
    const acoes = el("div", "inv-detail-actions");
    if (item.slot) {
      const equipado = rpg.data.equipped?.[item.slot] === item.id;
      const botao = el("button", "inv-action", equipado ? "tirar" : "equipar");
      botao.type = "button";
      botao.addEventListener("click", () => {
        const res = equipado ? rpg.unequip(item.slot) : rpg.equip(item.id);
        if (!res.ok) { toast(res.reason, 2600); return; }
        toast(equipado ? `${item.name} saiu.` : `${item.name} equipado.`, 2200);
        audio.blip();
        render();
        onChange?.();
      });
      acoes.appendChild(botao);
    }
    const consumivel = item.heal || item.mana || item.use === "light" || item.use === "bomb" || item.use === "spark";
    if (consumivel) {
      const usar = el("button", "inv-action usar", "usar");
      usar.type = "button";
      usar.addEventListener("click", () => {
        const res = rpg.useItem(item.id);
        if (!res.ok) { toast(res.reason, 3200); return; }
        const aceito = onUse?.(item.id, res) !== false;
        const bits = [];
        if (res.healed) bits.push(`+${res.healed} de vida`);
        if (res.mana) bits.push(`+${res.mana} de mana`);
        if (res.buff) bits.push(`${res.buff.name} ${Math.round(res.buff.ms / 1000)}s`);
        if (bits.length) toast(bits.join(" · "), 3000);
        else if ((res.light || res.bomb) && aceito) toast(res.light ? "A tocha acende." : "A bomba estoura.", 2400);
        audio.blip();
        render();
        onChange?.();
      });
      acoes.appendChild(usar);
    }
    box.appendChild(acoes);
  }

  function selecionar(item) {
    selecionado = item;
    ultimo = item;
    render();
  }

  function botaoSlot(item, origem, slotNome) {
    const slot = el("button", `inv-slot ${origem === "equip" ? "equip-slot" : "bag-slot"}${item ? " tem-item" : ""}`);
    slot.type = "button";
    if (origem === "equip") slot.dataset.slot = slotNome;
    if (item) {
      slot.style.setProperty("--c", itemAccent(item));
      slot.title = item.name;
      slot.setAttribute("aria-label", `${item.name}${item.qty > 1 ? `, ${item.qty} unidades` : ""}`);
      slot.appendChild(itemIconElement(item));
      if (item.qty > 1) slot.appendChild(el("span", "inv-qty", `×${item.qty}`));
      slot.draggable = true;
      slot.addEventListener("dragstart", (e) => {
        e.dataTransfer?.setData("text/plain", origem === "equip" ? `slot:${slotNome}` : item.id);
        if (e.dataTransfer) e.dataTransfer.effectAllowed = "move";
        slot.classList.add("arrastando");
      });
      slot.addEventListener("dragend", () => slot.classList.remove("arrastando"));
      slot.addEventListener("click", () => selecionar(item));
      slot.addEventListener("dblclick", () => {
        if (item.slot) {
          const equipado = rpg.data.equipped?.[item.slot] === item.id;
          const res = equipado ? rpg.unequip(item.slot) : rpg.equip(item.id);
          if (res.ok) { audio.blip(); render(); onChange?.(); }
        }
      });
    } else {
      slot.setAttribute("aria-label", origem === "equip" ? `espaço de ${slotNome}, vazio` : "espaço vazio");
    }
    return slot;
  }

  function aceitarSolta(target, origem) {
    target.addEventListener("dragover", (e) => {
      e.preventDefault();
      target.classList.add("alvo");
    });
    target.addEventListener("dragleave", () => target.classList.remove("alvo"));
    target.addEventListener("drop", (e) => {
      e.preventDefault();
      target.classList.remove("alvo");
      const dado = e.dataTransfer?.getData("text/plain") || "";
      if (origem === "equip") {
        if (dado.startsWith("slot:")) return;
        const res = rpg.equip(dado);
        if (!res.ok) { toast(res.reason, 2600); return; }
        toast(`${res.item.name} equipado.`, 2200);
        audio.blip();
        render();
        onChange?.();
      } else if (dado.startsWith("slot:")) {
        const res = rpg.unequip(dado.slice(5));
        if (res.ok) { audio.blip(); render(); onChange?.(); }
      }
    });
  }

  function render() {
    const equipBox = document.getElementById("inv-equip");
    const grid = document.getElementById("inv-grid");
    const count = document.getElementById("inv-count");
    if (!equipBox || !grid) return;
    equipBox.textContent = "";
    equipBox.appendChild(el("h3", "inv-sec", "equipado"));
    const linha = el("div", "inv-equip-grid");
    equipBox.appendChild(linha);
    const equipados = rpg.equippedView();
    for (const slotInfo of equipados) {
      const wrap = el("div", "equip-wrap");
      wrap.appendChild(el("span", "equip-name", slotInfo.name));
      const slot = botaoSlot(slotInfo.item, "equip", slotInfo.slot);
      aceitarSolta(slot, "equip");
      if (slotInfo.item) {
        const acoes = el("div", "equip-acoes");
        const off = el("button", "inv-mini", "tirar");
        off.type = "button";
        off.addEventListener("click", () => {
          rpg.unequip(slotInfo.slot);
          audio.blip();
          render();
          onChange?.();
        });
        acoes.appendChild(off);
        wrap.appendChild(slot);
        wrap.appendChild(acoes);
      } else {
        wrap.appendChild(slot);
      }
      linha.appendChild(wrap);
    }
    // o que está vestido mora no espaço de equipamento, não se repete na grade
    const vestidos = new Set(Object.values(rpg.data.equipped || {}));
    const itens = rpg.inventoryList()
      .map((i) => (vestidos.has(i.id) ? { ...i, qty: i.qty - 1 } : i))
      .filter((i) => i.qty > 0);
    if (count) count.textContent = `${itens.length} tipo${itens.length === 1 ? "" : "s"} · ${itens.reduce((n, i) => n + i.qty, 0)} itens`;
    grid.textContent = "";
    const total = Math.max(SLOTS, itens.length + (itens.length % 8 ? 8 - (itens.length % 8) : 0));
    for (let i = 0; i < total; i++) {
      const item = itens[i] || null;
      const slot = botaoSlot(item, "bag");
      if (!item) {
        slot.classList.add("vazio");
      } else if (selecionado && selecionado.id === item.id) {
        slot.classList.add("selecionado");
      }
      grid.appendChild(slot);
      if (i === 0) aceitarSolta(slot, "bag");
    }
    // o espaço vazio também aceita item equipado de volta
    for (const slot of grid.querySelectorAll(".bag-slot.vazio")) aceitarSolta(slot, "bag");
    // a grade também aceita soltar para desequipar
    if (!gradePreparada) {
      gradePreparada = true;
      grid.addEventListener("dragover", (e) => e.preventDefault());
      grid.addEventListener("drop", (e) => {
        const dado = e.dataTransfer?.getData("text/plain") || "";
        if (!dado.startsWith("slot:")) return;
        e.preventDefault();
        if (rpg.unequip(dado.slice(5)).ok) { audio.blip(); render(); onChange?.(); }
      });
    }
    const atual = ultimo ? rpg.inventoryList().find((i) => i.id === ultimo.id) : null;
    abrirDetalhe(atual);
  }

  return {
    render,
    open() {
      selecionado = null;
      ultimo = null;
      render();
    },
    refresh: render,
  };
}

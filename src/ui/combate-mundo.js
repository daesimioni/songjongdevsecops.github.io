export function createWorldCombatHud({ rpg, getCombat, getHost = () => document.body, toast }) {
  const panel = document.createElement("section");
  panel.id = "world-combat";
  panel.hidden = true;
  panel.setAttribute("aria-label", "Combate no mapa");
  const status = document.createElement("p");
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  const controls = document.createElement("div");
  const help = document.createElement("small");
  help.textContent = "Mova-se pelo mapa para lutar ou se afastar. J atacar · K defender · L esquivar · P companheiro";
  panel.append(status, controls, help);
  document.body.append(panel);
  function action(key) {
    const battle = getCombat();
    if (!battle?.active) return false;
    let result;
    if (key === "j") battle.attack();
    else if (key === "k") battle.defend(true);
    else if (key === "l") battle.dodge();
    else if (key === "p") result = battle.pet();
    else if (/^[1-6]$/.test(key)) {
      const spell = rpg.spellbarView()[Number(key) - 1];
      if (spell) result = battle.spell(spell.id);
    } else return false;
    if (result?.reason) toast?.(result.reason, 1800);
    return true;
  }
  let signature = "", last = 0;
  function button(text, key) {
    const b = document.createElement("button");
    b.type = "button"; b.textContent = text;
    b.dataset.key = key;
    if (key === "k") {
      b.setAttribute("aria-pressed", "false");
      b.addEventListener("pointerdown", e => { e.preventDefault(); b.setPointerCapture?.(e.pointerId); action(key); });
      for (const name of ["pointerup", "pointercancel", "lostpointercapture"]) b.addEventListener(name, () => getCombat()?.defend(false));
      b.addEventListener("keydown", e => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); action(key); } });
      b.addEventListener("keyup", () => getCombat()?.defend(false));
      b.addEventListener("blur", () => getCombat()?.defend(false));
    } else b.addEventListener("click", () => action(key));
    return b;
  }
  function update(now) {
    const host = getHost();
    if (panel.parentNode !== host) host.append(panel);
    const battle = getCombat();
    if (panel.hidden !== !battle?.active) panel.hidden = !battle?.active;
    if (panel.hidden || now - last < 100) return;
    last = now;
    const enemies = battle.model.vivos();
    const text = enemies.map(e => `${e.nome}: ${Math.ceil(e.hp)}/${e.hpMax}`).join(" · ");
    if (status.textContent !== text) status.textContent = text;
    const spells = rpg.spellbarView().slice(0, 6);
    const next = spells.map(s => s.id).join("|");
    if (signature !== next || !controls.childNodes.length) {
      signature = next;
      controls.replaceChildren(button("Atacar · J", "j"), button("Defender · K", "k"), button("Esquivar · L", "l"), button("Companheiro · P", "p"));
      spells.forEach((s, i) => controls.append(button(`${s.name || s.id} · ${i + 1}`, String(i + 1))));
    }
    const model = battle.model;
    for (const b of controls.querySelectorAll("button")) {
      const key = b.dataset.key;
      if (key === "k") b.setAttribute("aria-pressed", String(model.jogador.defendendo));
      if (key === "j") b.disabled = model.agora < model.jogador.ataquePronto;
      if (key === "l") b.disabled = model.agora < model.jogador.esquivaPronto;
      if (/^[1-6]$/.test(key)) b.disabled = model.agora < (model.magias.get(spells[Number(key) - 1]?.id) || 0);
    }
  }
  window.addEventListener("keyup", e => { if (e.key.toLowerCase() === "k") getCombat()?.defend(false); });
  window.addEventListener("blur", () => getCombat()?.defend(false));
  return { action, update };
}

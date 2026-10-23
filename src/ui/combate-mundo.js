import { COMBAT_ATLAS } from "../rendering/combat-vfx.js";

export function createWorldCombatHud({ rpg, getCombat, getHost = () => document.body, toast }) {
  const panel = document.createElement("section");
  panel.id = "world-combat";
  panel.hidden = true;
  panel.setAttribute("aria-label", "Combate no mapa");
  const status = document.createElement("p");
  status.setAttribute("role", "status");
  status.setAttribute("aria-live", "polite");
  const targetBar = document.createElement("progress");
  targetBar.setAttribute("aria-label", "Vida do alvo");
  const controls = document.createElement("div");
  controls.className = "combat-actions";
  const runes = document.createElement("div");
  runes.className = "combat-runes";
  const help = document.createElement("small");
  help.textContent = "Segure K para defender · L para esquivar · Afaste-se para recuar";
  panel.append(status, targetBar, controls, runes, help);
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
    b.type = "button";
    const icon = document.createElement("span");
    icon.className = "combat-icon"; icon.setAttribute("aria-hidden", "true");
    const row = key === "j" ? 0 : key === "k" ? 1 : key === "l" ? 3 : 7;
    icon.style.backgroundImage = `url("${COMBAT_ATLAS.href}")`;
    icon.style.backgroundPosition = `-96px -${row * 32}px`;
    const label = document.createElement("span"); label.textContent = text;
    const shortcut = document.createElement("kbd"); shortcut.textContent = key.toUpperCase();
    b.append(icon, label, shortcut);
    b.setAttribute("aria-label", `${text}, tecla ${key.toUpperCase()}`);
    if (key === "k") b.title = "Mantenha pressionado para defender. Defenda no instante do golpe para aparar.";
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
    const target = battle.model.target && !battle.model.target.morte ? battle.model.target : battle.model.inimigoAoAlcance() || enemies[0];
    const text = target ? `${target.nome} · ${Math.ceil(target.hp)}/${target.hpMax}${enemies.length > 1 ? ` · +${enemies.length - 1}` : ""}` : "Combate";
    targetBar.max = target?.hpMax || 1; targetBar.value = target?.hp || 0;
    if (status.textContent !== text) status.textContent = text;
    const spells = rpg.spellbarView().slice(0, 6);
    const next = spells.map(s => s.id).join("|");
    if (signature !== next || !controls.childNodes.length) {
      signature = next;
      controls.replaceChildren(button("Atacar", "j"), button("Defender", "k"), button("Esquivar", "l"), button("Pet", "p"));
      runes.replaceChildren(...spells.map((s, i) => button(s.name || s.id, String(i + 1))));
      runes.hidden = !spells.length;
    }
    const model = battle.model;
    for (const b of panel.querySelectorAll("button")) {
      const key = b.dataset.key;
      if (key === "k") b.setAttribute("aria-pressed", String(model.jogador.defendendo));
      const ready = key === "j" ? model.jogador.ataquePronto : key === "l" ? model.jogador.esquivaPronto : /^[1-6]$/.test(key) ? model.magias.get(spells[Number(key) - 1]?.id) || 0 : 0;
      const duration = key === "j" ? 450 : key === "l" ? 1100 : 1250;
      b.style.setProperty("--cooldown", `${Math.max(0, Math.min(1, (ready - model.agora) / duration)) * 100}%`);
      if (key === "j") b.disabled = model.agora < model.jogador.ataquePronto;
      if (key === "l") b.disabled = model.agora < model.jogador.esquivaPronto;
      if (/^[1-6]$/.test(key)) b.disabled = model.agora < (model.magias.get(spells[Number(key) - 1]?.id) || 0);
    }
  }
  window.addEventListener("keyup", e => { if (e.key.toLowerCase() === "k") getCombat()?.defend(false); });
  window.addEventListener("blur", () => getCombat()?.defend(false));
  return { action, update };
}

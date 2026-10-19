// A janela do duelo: monstro, vida, pergunta, consequência e recompensa.
import { CONTINENTS } from "./config.js";
import { ITEMS, TIERS } from "./rpg-data.js";
import { drawCreature } from "./creature.js";

const $ = (id) => document.getElementById(id);
let lastPick = null;

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
}

export function createDuel({ rpg, toast, audio, onClose, onVictory }) {
  let timer = null;

  function accent() {
    return CONTINENTS[rpg.duel?.ground.continent]?.accent || "#ffc857";
  }

  function drawSprite() {
    const canvas = $("duel-sprite");
    if (!canvas || !rpg.duel) return;
    const ctx = canvas.getContext("2d");
    const w = canvas.width;
    const h = canvas.height;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, w, h);
    const glow = ctx.createRadialGradient(w / 2, h * 0.62, 4, w / 2, h * 0.62, w * 0.45);
    glow.addColorStop(0, "rgba(180, 140, 255, 0.16)");
    glow.addColorStop(1, "rgba(180, 140, 255, 0)");
    ctx.fillStyle = glow;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = "rgba(5, 8, 20, 0.55)";
    ctx.beginPath();
    ctx.ellipse(w / 2, h * 0.82, w * 0.3, 8, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.save();
    ctx.translate(w / 2, h * 0.83);
    const scale = rpg.duel.boss ? 4 : 4.8;
    drawCreature(ctx, rpg.duel.boss ? "boss" : rpg.duel.monster.kind, accent(), performance.now(), scale);
    ctx.restore();
  }

  function startSprite() {
    stopSprite();
    timer = setInterval(drawSprite, 90);
  }

  function stopSprite() {
    if (timer) clearInterval(timer);
    timer = null;
  }

  function open(monster, ground, boss = false) {
    const res = rpg.startDuel(monster, ground, boss);
    if (!res.ok) {
      toast(res.reason || "Este monstro não está mais aqui.", 3600);
      return false;
    }
    lastPick = null;
    render();
    startSprite();
    return true;
  }

  function close() {
    stopSprite();
    rpg.flee();
    lastPick = null;
  }

  function bar(label, value, max, cls) {
    const wrap = el("div", `duel-bar ${cls}`);
    const head = el("div", "duel-bar-head");
    head.append(el("span", "", label), el("b", "", `${Math.max(0, value)}/${max}`));
    const track = el("div", "duel-bar-track");
    const fill = el("i");
    fill.style.width = `${max ? Math.max(0, Math.min(100, Math.round((value / max) * 100))) : 0}%`;
    track.appendChild(fill);
    wrap.append(head, track);
    return wrap;
  }

  function render() {
    const d = rpg.duel;
    const card = $("duel");
    if (!d) {
      if (card) card.hidden = true;
      return;
    }
    const tier = TIERS[d.tier];
    $("duel-kicker").textContent = `${d.ground.name} · ${d.boss ? "chefe" : tier.name}`;
    $("duel-name").textContent = d.monster.name;
    $("duel-sub").textContent = `nível ${d.monster.level} · ${tier.stars} · ${d.boss ? "pergunta final" : "duelo de perguntas"}`;
    const meta = $("duel-meta");
    meta.textContent = "";
    meta.append(
      bar("vida do monstro", d.monsterHp, d.monsterHpMax, "enemy"),
      bar("sua vida", rpg.hp(), rpg.hpMax(), "self"),
    );
    drawSprite();

    const body = $("duel-body");
    body.textContent = "";
    if (d.phase === "victory" || d.phase === "defeat") {
      renderEnd(body, d);
      return;
    }
    const q = d.question;
    body.appendChild(el("p", "duel-question", q.q));
    const opts = el("div", "duel-options");
    q.options.forEach((text, i) => {
      const b = el("button", "duel-option");
      b.type = "button";
      b.appendChild(el("kbd", "", String(i + 1)));
      b.appendChild(el("span", "", text));
      if (d.phase === "feedback") {
        b.disabled = true;
        if (i === q.answer) b.classList.add("right");
        else if (i === lastPick) b.classList.add("wrong");
      } else {
        b.addEventListener("click", () => answer(i));
      }
      opts.appendChild(b);
    });
    body.appendChild(opts);

    if (d.phase === "feedback") {
      const fb = d.feedback;
      const box = el("div", `duel-feedback ${fb.correct ? "good" : "bad"}`);
      box.appendChild(el("b", "", fb.correct ? "Acertou." : `Errou. Você levou ${fb.damage} de dano.`));
      box.appendChild(el("span", "", fb.why));
      body.appendChild(box);
      const next = el("button", "duel-next", "continuar");
      next.type = "button";
      next.addEventListener("click", advance);
      body.appendChild(next);
    } else {
      const foot = el("p", "duel-hint", "Responda com 1, 2 ou 3. Errar tira vida; acertar tira vida do monstro.");
      body.appendChild(foot);
    }
  }

  function renderEnd(body, d) {
    const win = d.phase === "victory";
    const box = el("div", `duel-end ${win ? "win" : "lose"}`);
    box.appendChild(el("h3", "", win ? "Monstro derrotado" : "Você caiu"));
    if (win && d.result) {
      box.appendChild(el("p", "", `+${d.result.xp} XP · perícia de ${CONTINENTS[d.ground.continent]?.name || "continente"} subiu.`));
      const loot = el("div", "duel-loot");
      for (const item of d.result.loot) {
        loot.appendChild(el("span", "loot-chip", `${ITEMS[item.id]?.name || "Item"} ×${item.qty}`));
      }
      box.appendChild(loot);
    } else {
      box.appendChild(el("p", "", "Você acordou no Porto do Início com a vida cheia. Nada foi perdido."));
    }
    body.appendChild(box);
    const b = el("button", "duel-next", win ? "voltar ao mapa" : "levantar");
    b.type = "button";
    b.addEventListener("click", advance);
    body.appendChild(b);
  }

  function answer(index) {
    if (!rpg.duel || rpg.duel.phase !== "question") return;
    lastPick = index;
    const res = rpg.answer(index);
    if (res.correct) audio.blip();
    else audio.error?.();
    if (rpg.duel.phase === "victory") {
      audio.chime();
      onVictory?.();
    }
    render();
  }

  function advance() {
    if (!rpg.duel) return;
    if (rpg.duel.phase === "victory" || rpg.duel.phase === "defeat") {
      rpg.next();
      lastPick = null;
      stopSprite();
      onClose?.();
      return;
    }
    const res = rpg.next();
    if (res?.phase === "question") render();
  }

  return { open, close, answer, advance, render, drawSprite };
}

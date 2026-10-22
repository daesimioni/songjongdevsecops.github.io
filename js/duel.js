// A janela do duelo: monstro, vida, pergunta, consequência e recompensa.
import { CONTINENTS } from "./config.js";
import { ITEMS, TIERS, MONSTER_TRAITS } from "./rpg-data.js";
import { drawCreatureArt } from "./creature.js";
import { leituraDeRitmo } from "./duelo-ritmo.js";

const $ = (id) => document.getElementById(id);
const LETTERS = "ABCDE";
let lastPick = null;
let sparked = [];
let hinted = null;
let petInfo = "";

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
}

export function createDuel({ rpg, toast, audio, onClose, onVictory }) {
  let timer = null;

  function accent() {
    return rpg.duel?.monster?.accent || CONTINENTS[rpg.duel?.ground.continent]?.accent || "#ffc857";
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
    const scale = rpg.duel.boss ? 4.3 : 5.2;
    drawCreatureArt(ctx, rpg.duel.boss ? "boss" : rpg.duel.monster.kind, accent(), performance.now(), scale);
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

  const SPELL_LABELS = {
    "runa-faisca": "faísca · risca uma alternativa",
    "runa-trovao": "trovão · 2 de dano no da frente",
    "runa-fogo": "fogo · 1 de dano em todos",
    "runa-gelo": "gelo · passa a pergunta",
    "runa-cura": "cura · recupera 12",
    "runa-espelho": "espelho · o próximo erro não dói",
  };

  function open(monster, ground, boss = false, partner = null) {
    const res = rpg.startDuel(monster, ground, boss, partner);
    if (!res.ok) {
      toast(res.reason || "Este monstro não está mais aqui.", 3600);
      return false;
    }
    lastPick = null;
    sparked = [];
    hinted = null;
    petInfo = "";
    render();
    startSprite();
    return true;
  }

  function close() {
    stopSprite();
    rpg.flee();
    lastPick = null;
    sparked = [];
  }

  function openTraining(continent, tier, theme, monster) {
    const res = rpg.startTraining(continent, tier, theme, monster);
    if (!res.ok) {
      toast(res.reason || "O treino não abriu agora.", 3200);
      return false;
    }
    lastPick = null;
    sparked = [];
    hinted = null;
    petInfo = "";
    render();
    startSprite();
    return true;
  }

  function bar(label, value, max, cls) {
    const wrap = el("div", `duel-bar ${cls}`);
    const head = el("div", "duel-bar-head");
    // dano pode ter decimal (vocação, pet, equipamento); a vida mostra inteiro
    // para não aparecer 94.70000000000002/99 na tela
    head.append(el("span", "", label), el("b", "", `${Math.max(0, Math.ceil(value))}/${Math.ceil(max)}`));
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
    const continent = CONTINENTS[d.ground.continent]?.name || d.ground.name;
    const phaseLabel = d.boss && (d.bossPhase || 1) > 1 ? ` · fase ${d.bossPhase}` : "";
    $("duel-kicker").textContent = d.training
      ? `TREINO · ${continent}`
      : `${d.ground.name} · ${d.boss ? "chefe" : tier.name}${phaseLabel}`;
    const risk = $("duel-risk");
    if (risk) {
      risk.textContent = d.training
        ? " · treino, sem dano"
        : ` · risco ${Math.round(rpg.fleeRisk(d.monster) * 100)}%`;
    }
    $("duel-name").textContent = d.monster.name;
    const trait = MONSTER_TRAITS[d.monster?.kind]?.label || "";
    const nivel = d.monster.level ?? "?";
    const baseSub = d.training
      ? `nível ${nivel} · ${tier.stars} · treino sem dano e sem loot`
      : `nível ${nivel} · ${tier.stars} · ${d.boss ? "pergunta final" : "duelo de perguntas"}`;
    $("duel-sub").textContent = trait ? `${baseSub} · ${trait}` : baseSub;
    const meta = $("duel-meta");
    meta.textContent = "";
    const hpLabel = d.boss ? `vida do chefe · fase ${d.bossPhase || 1}` : "vida do monstro";
    meta.append(
      bar(hpLabel, d.monsterHp, d.monsterHpMax, "enemy"),
      bar("sua vida", rpg.hp(), rpg.hpMax(), "self"),
    );
    rpg.pulse();
    meta.appendChild(bar("mana", rpg.mana(), rpg.manaMax(), "mana"));
    // leitura de turno: rodada e ritmo de acertos ficam à vista antes de escolher
    meta.appendChild(el("span", "duel-round", `rodada ${(d.deckIndex || 0) + 1}`));
    const ritmo = leituraDeRitmo(d.seguidos || 0);
    if (ritmo) meta.appendChild(el("em", "duel-combo", ritmo));
    if (d.boss && d.habilidade) meta.appendChild(el("span", "duel-ability", `chefe: ${d.habilidade.nome}`));
    drawSprite();

    const body = $("duel-body");
    body.textContent = "";
    if (d.phase === "victory" || d.phase === "defeat") {
      renderEnd(body, d);
      return;
    }
    const q = d.question;
    const live = (d.partners || []).filter((p) => !p.done);
    const cols = el("div", `duel-cols${live.length ? " has-partners" : ""}`);
    const main = el("div", "duel-col main");
    cols.appendChild(main);
    main.appendChild(el("p", "duel-question", q.q));
    // o número que o erro vai custar, antes da escolha: fase de chefe e caráter
    // do bicho entram na conta, e o espelho aparece como zero
    const previsao = rpg.erroPrevisto();
    main.appendChild(el("p", "duel-read",
      d.training
        ? `Na caverna, esse erro tiraria ${previsao} de vida.`
        : `Se errar: ${previsao} de dano${d.shield ? " (o espelho segura uma vez)" : ""}.`));
    const opts = el("div", "duel-options");
    q.options.forEach((text, i) => {
      const b = el("button", "duel-option");
      b.type = "button";
      b.appendChild(el("kbd", "", LETTERS[i] || String(i + 1)));
      b.appendChild(el("span", "", text));
      if (d.monsterHp <= 0) b.disabled = true;
      if (hinted === i) b.classList.add("hinted");
      if (sparked.includes(i)) {
        b.disabled = true;
        b.classList.add("sparked");
      } else if (d.phase === "feedback") {
        b.disabled = true;
        if (i === q.answer) b.classList.add("right");
        else if (i === lastPick) b.classList.add("wrong");
      } else {
        b.addEventListener("click", () => answer(i));
      }
      opts.appendChild(b);
    });
    main.appendChild(opts);
    if (d.monsterHp <= 0) main.appendChild(el("p", "duel-hint", "Este monstro caiu. Vença os demais da matilha para concluir o duelo."));

    if (d.phase === "feedback") {
      const fb = d.feedback;
      const box = el("div", `duel-feedback ${fb.correct ? "good" : "bad"}`);
      box.setAttribute("role", "status");
      const wrong = fb.training
        ? `Errou. Na caverna isso tiraria ${fb.damage} de vida.`
        : `Errou. Você levou ${fb.damage} de dano.`;
      const label = fb.spell || (fb.blocked ? "A proteção segurou o golpe." : fb.correct ? "Acertou." : wrong);
      box.appendChild(el("b", "", label));
      box.appendChild(el("span", "", fb.why));
      if (fb.note) box.appendChild(el("em", "duel-note", fb.note));
      if (fb.phaseNote) box.appendChild(el("em", "duel-phase", fb.phaseNote));
      main.appendChild(box);
      const next = el("button", "duel-next", "continuar");
      next.type = "button";
      next.addEventListener("click", advance);
      main.appendChild(next);
    } else {
      const pet = rpg.activePet();
      if (pet) {
        const cd = rpg.petCdLeft(pet.id);
        const pb = el("button", "duel-pet", cd > 0
          ? `${pet.name} · ${pet.ability.name} em ${Math.ceil(cd / 1000)}s`
          : `${pet.name} · ${pet.ability.name} · ${pet.ability.mana} mana`);
        pb.type = "button";
        pb.disabled = cd > 0 || (pet.ability.id !== "mana" && rpg.mana() < pet.ability.mana);
        pb.addEventListener("click", usePet);
        main.appendChild(pb);
      }
      const runes = rpg.spellbarView();
      if (runes.length) {
        const bar = el("div", "duel-spells");
        for (const spell of runes) {
          const label = SPELL_LABELS[spell.id] || spell.name;
          const cost = spell.charges
            ? `${spell.charges} carga${spell.charges > 1 ? "s" : ""}`
            : `${spell.mana} mana`;
          const rune = el("button", "duel-rune", `${label} · ${cost}`);
          rune.type = "button";
          if (spell.id === "runa-faisca" && sparked.length > 0) rune.disabled = true;
          rune.addEventListener("click", () => castSpell(spell.id));
          bar.appendChild(rune);
        }
        main.appendChild(bar);
      }
      if (petInfo) main.appendChild(el("p", "duel-petinfo", petInfo));
      const foot = el("p", "duel-hint", "Toque numa alternativa (ou A a E no teclado). Errar tira vida; acertar tira vida do monstro.");
      main.appendChild(foot);
    }
    if (live.length) {
      const side = el("div", "duel-col extras");
      side.appendChild(el("p", "duel-col-tag", `matilha · ${live.length} bicho${live.length > 1 ? "s" : ""} na mesma rodada`));
      (d.partners || []).forEach((p, i) => {
        if (!p.done) side.appendChild(partnerCard(p, i));
      });
      cols.appendChild(side);
    }
    body.appendChild(cols);
  }

  function dPhaseBloqueada() { return rpg.duel?.phase !== "question"; }

  function partnerCard(p, who) {
    const box = el("div", "duel-partner");
    const head = el("div", "duel-partner-head");
    head.append(el("span", "", "também está aqui"), el("b", "", p.monster.name));
    box.appendChild(head);
    box.appendChild(bar("vida do parceiro", p.hp, p.hpMax, "enemy"));
    if (p.feedback) {
      const fb = el("div", `duel-feedback ${p.feedback.correct ? "good" : "bad"}`);
      fb.setAttribute("role", "status");
      fb.appendChild(el("b", "", p.feedback.blocked ? "A proteção segurou o golpe." : p.feedback.correct ? "Acertou." : `Errou. Levou ${p.feedback.damage} de dano.`));
      fb.appendChild(el("span", "", p.feedback.why));
      box.appendChild(fb);
      const next = el("button", "duel-next small", "continuar com este bicho");
      next.type = "button";
      next.disabled = dPhaseBloqueada();
      next.addEventListener("click", () => { rpg.partnerNext(who); render(); });
      box.appendChild(next);
    } else {
      box.appendChild(el("p", "duel-question partner", p.question.q));
      box.appendChild(el("p", "duel-read", `Se errar: ${rpg.erroPrevisto(p.monster, p.tier, 1)} de dano.`));
      const opts = el("div", "duel-options partner-options");
      p.question.options.forEach((text, i) => {
        const b = el("button", "duel-option");
        b.type = "button";
        b.appendChild(el("kbd", "", LETTERS[i] || String(i + 1)));
        b.appendChild(el("span", "", text));
        b.disabled = dPhaseBloqueada();
        b.addEventListener("click", () => {
          const res = rpg.answerPartner(i, who);
          if (!res?.ok) return;
          if (res.correct) audio.blip(); else audio.error?.();
          if (rpg.duel.phase === "victory") {
            audio.chime();
            if (!rpg.duel.training) onVictory?.(rpg.duel.result);
          }
          render();
        });
        opts.appendChild(b);
      });
      box.appendChild(opts);
    }
    return box;
  }

  function renderEnd(body, d) {
    const win = d.phase === "victory";
    const box = el("div", `duel-end ${win ? "win" : "lose"}`);
    box.appendChild(el("h3", "", d.training ? (win ? "Treino concluído" : "Treino encerrado") : (win ? "O guardião caiu" : "O vale o devolveu")));
    if (d.training) {
      box.appendChild(el("p", "", win
        ? "Sem sangue, sem saque. A perícia da região subiu; a pergunta volta quando você quiser."
        : "Sem sangue. O treino existe para o erro não acontecer lá embaixo."));
    } else if (win && d.result) {
      box.appendChild(el("p", "", `+${d.result.xp} XP · perícia de ${CONTINENTS[d.ground.continent]?.name || "continente"} subiu.`));
      const loot = el("div", "duel-loot");
      for (const item of d.result.loot) {
        loot.appendChild(el("span", "loot-chip", `${ITEMS[item.id]?.name || "Item"} ×${item.qty}`));
      }
      box.appendChild(loot);
    } else {
      box.appendChild(el("p", "", "Você acordou no Porto do Início, com a vida cheia. O vale não guardou o que aconteceu."));
    }
    body.appendChild(box);
    const b = el("button", "duel-next", win ? "voltar ao mapa" : "levantar");
    b.type = "button";
    b.addEventListener("click", advance);
    body.appendChild(b);
  }

  function usePet() {
    if (!rpg.duel || rpg.duel.phase !== "question") return false;
    const res = rpg.usePetAbility({ duel: true });
    if (!res.ok) {
      toast(res.reason, 3200);
      audio.error?.();
      render();
      return false;
    }
    if (res.sparks) sparked.push(...res.sparks);
    else if (res.effect === "sabedoria") hinted = res.answer;
    else if (res.effect === "aviso") {
      petInfo = `${res.pet.name}: ${res.monster} é ${TIERS[res.tier]?.stars || ""} ${TIERS[res.tier]?.name || ""} e puxa ${res.theme || "o tema da sala"}.`;
    } else if (res.effect === "cura") {
      toast(`${res.pet.name} curou ${res.healed} de vida.`, 2800);
    } else if (res.effect === "ritmo") {
      toast(`${res.pet.name} marcou o ritmo: +1 de dano por dois minutos.`, 3000);
    } else if (res.effect === "mana") {
      toast(`${res.pet.name} devolveu 3 de mana.`, 2600);
    }
    audio.blip();
    render();
    return true;
  }

  function castSpell(id) {
    if (!rpg.duel || rpg.duel.phase !== "question") return false;
    if (id === "runa-faisca") return spark();
    const res = rpg.castSpell(id);
    if (!res.ok) { toast(res.reason, 2800); return false; }
    audio.blip();
    if (res.healed) toast(`A runa curou ${res.healed} de vida.`, 2400);
    if (rpg.duel.phase === "victory") {
      audio.chime();
      if (!rpg.duel.training) onVictory?.(rpg.duel.result);
    }
    render();
    return true;
  }

  function spark() {
    if (!rpg.duel || rpg.duel.phase !== "question" || sparked.length) return false;
    const res = rpg.castSpell("runa-faisca");
    if (!res.ok) { toast(res.reason, 2800); return false; }
    const q = rpg.duel.question;
    const wrong = q.options.map((_, i) => i).filter((i) => i !== q.answer);
    if (!wrong.length) return false;
    sparked.push(wrong[Math.floor(Math.random() * wrong.length)]);
    audio.blip();
    render();
    return true;
  }

  function answer(index) {
    if (!rpg.duel || rpg.duel.phase !== "question") return;
    if (sparked.includes(index)) return;
    lastPick = index;
    const res = rpg.answer(index);
    if (!res.ok) return;
    if (res.correct) audio.blip();
    else audio.error?.();
    if (rpg.duel.phase === "victory") {
      audio.chime();
      if (!rpg.duel.training) onVictory?.(rpg.duel.result);
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
    sparked = [];
    hinted = null;
    petInfo = "";
    const res = rpg.next();
    if (res?.phase === "question") render();
  }

  return { open, openTraining, close, answer, advance, render, drawSprite, spark, usePet };
}

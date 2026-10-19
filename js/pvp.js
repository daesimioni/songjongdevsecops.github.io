// Duelo de perguntas entre jogadores. O atacante escolhe uma pergunta de uma
// lista de cinco dificuldades; o outro responde para se defender. Quem perde a
// compostura fica desativado por alguns segundos, sem perder item nem vida.
import { CONTINENTS, CONTINENT_ORDER } from "./config.js";

const $ = (id) => document.getElementById(id);
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));
const DIFFICULTY = ["", "muito fácil", "fácil", "média", "difícil", "muito difícil"];
const COMPOSURE = 10;
const CHALLENGE_MS = 20000;
const DEFEND_MS = 30000;
const DOWN_MS = 10000;

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
}

export function createPvp({ rpg, toast, audio, player, getNet, isBusy, openPanel, closePanel, onDown }) {
  const state = {
    phase: "idle",
    peer: null,
    myComp: COMPOSURE,
    theirComp: COMPOSURE,
    questions: [],
    current: null,
    damage: 0,
    nonce: null,
    finished: false,
    closing: false,
    timer: null,
    countdown: null,
    deadline: 0,
  };

  const myId = () => getNet?.()?.id || "";
  const peerName = () => state.peer?.name || "o outro";

  function clearTimers() {
    if (state.timer) { clearTimeout(state.timer); state.timer = null; }
    if (state.countdown) { clearInterval(state.countdown); state.countdown = null; }
  }

  function later(ms, fn) {
    if (state.timer) clearTimeout(state.timer);
    state.timer = setTimeout(() => {
      state.timer = null;
      fn();
    }, ms);
  }

  function continent() {
    const id = player.continentId;
    if (id && id !== "hub" && CONTINENTS[id]) return id;
    const list = CONTINENT_ORDER.filter((c) => c !== "hub" && CONTINENTS[c]);
    return list[Math.floor(Math.random() * list.length)] || "cs";
  }

  function send(payload) {
    const net = getNet?.();
    if (!net || !state.peer) return false;
    return !!net.sendPvp({ ...payload, to: state.peer.id });
  }

  function bars() {
    const wrap = el("div", "pvp-bars");
    for (const [label, value, cls] of [
      ["você", state.myComp, "mine"],
      [peerName(), state.theirComp, "theirs"],
    ]) {
      const row = el("div", `pvp-bar-row ${cls}`);
      const head = el("div", "pvp-bar-head");
      head.append(el("span", "", label), el("b", "", `${value}/${COMPOSURE}`));
      const track = el("div", "pvp-bar");
      const fill = el("i");
      fill.style.width = `${Math.max(0, Math.round((value / COMPOSURE) * 100))}%`;
      track.appendChild(fill);
      row.append(head, track);
      wrap.appendChild(row);
    }
    return wrap;
  }

  function setHead(title, sub) {
    $("pvp-title").textContent = title;
    $("pvp-sub").textContent = sub;
  }

  function render() {
    const body = $("pvp-body");
    if (!body) return;
    body.textContent = "";
    const phase = state.phase;
    if (phase === "idle") return;

    if (phase === "challenging") {
      setHead("Convite de duelo", "O outro lado precisa aceitar.");
      body.append(
        el("p", "pvp-text", `Convite enviado para ${peerName()}. Se aceitar, você começa atacando.`),
        el("p", "pvp-note", "O duelo não tira vida nem item. O perdedor fica desativado por 10 segundos."),
      );
      const cancel = el("button", "pvp-action", "cancelar convite");
      cancel.type = "button";
      cancel.addEventListener("click", () => {
        send({ kind: "decline" });
        close();
      });
      body.appendChild(cancel);
      return;
    }

    if (phase === "incoming") {
      setHead("Alguém te desafiou", `${peerName()} quer um duelo de perguntas.`);
      body.append(
        el("p", "pvp-text", "Se aceitar, ele começa atacando. Você responde para se defender."),
        el("p", "pvp-note", "Sem perda de vida ou item; o perdedor fica 10 segundos desativado."),
      );
      const row = el("div", "pvp-actions");
      const yes = el("button", "pvp-action", "aceitar");
      yes.type = "button";
      yes.addEventListener("click", () => {
        send({ kind: "accept" });
        audio.chime();
        startMatch("defender");
      });
      const no = el("button", "pvp-action ghost", "recusar");
      no.type = "button";
      no.addEventListener("click", () => {
        send({ kind: "decline" });
        close();
      });
      row.append(yes, no);
      body.appendChild(row);
      return;
    }

    if (phase === "choosing") {
      setHead("Sua vez de atacar", `Escolha a pergunta que ${peerName()} vai responder.`);
      body.appendChild(bars());
      body.appendChild(el("p", "pvp-note", "Quanto mais difícil, maior o dano. Se ele acertar, ele se defende e você ataca de novo. Se errar, toma o dano e a vez passa para ele."));
      const list = el("div", "pvp-questions");
      state.questions.forEach((q, i) => {
        const card = el("button", "pvp-question");
        card.type = "button";
        card.append(
          el("span", `pvp-diff d${q.difficulty}`, DIFFICULTY[q.difficulty]),
          el("b", "", q.q),
          el("i", "", `dano ${q.damage}`),
        );
        card.addEventListener("click", () => attack(i));
        list.appendChild(card);
      });
      body.appendChild(list);
      return;
    }

    if (phase === "waiting") {
      setHead("Aguardando resposta", `${peerName()} está respondendo.`);
      body.appendChild(bars());
      if (state.current) {
        body.appendChild(el("p", "pvp-text", `Sua pergunta: ${state.current.q}`));
        body.appendChild(el("p", "pvp-note", `Dano se errar: ${state.damage}.`));
      } else {
        body.appendChild(el("p", "pvp-text", `${peerName()} vai escolher uma pergunta para você.`));
      }
      return;
    }

    if (phase === "defending") {
      setHead("Defenda-se", `${peerName()} mandou uma pergunta.`);
      body.appendChild(bars());
      body.appendChild(el("p", "pvp-text", state.current?.q || "Pergunta indisponível."));
      const options = el("div", "pvp-options");
      (state.current?.options || []).forEach((text, i) => {
        const b = el("button", "pvp-option");
        b.type = "button";
        b.append(el("kbd", "", String(i + 1)), el("span", "", text));
        b.addEventListener("click", () => answerDefense(i));
        options.appendChild(b);
      });
      body.appendChild(options);
      body.appendChild(el("p", "pvp-timer", "responda em 30s"));
      const give = el("button", "pvp-action ghost", "não sei");
      give.type = "button";
      give.addEventListener("click", () => answerDefense(-1));
      body.appendChild(give);
      startCountdown();
      return;
    }

    if (phase === "over") {
      const won = state.result === "win";
      setHead(won ? "Você venceu" : "Você foi desativado", won ? `${peerName()} perdeu a compostura.` : `${peerName()} venceu o duelo.`);
      body.appendChild(bars());
      body.appendChild(el("p", "pvp-text", won
        ? "Sem item perdido, sem vida perdida. A vitória é só a resposta certa na hora certa."
        : "Você fica 10 segundos desativado. Nada foi perdido; a próxima pergunta continua no caderno."));
      const back = el("button", "pvp-action", "voltar ao mundo");
      back.type = "button";
      back.addEventListener("click", close);
      body.appendChild(back);
    }
  }

  function open() {
    render();
    openPanel?.();
  }

  function close() {
    if (state.closing) return;
    state.closing = true;
    clearTimers();
    state.phase = "idle";
    state.peer = null;
    state.current = null;
    state.questions = [];
    state.finished = false;
    closePanel?.();
    state.closing = false;
  }

  function over(result) {
    if (state.finished) return;
    state.finished = true;
    state.phase = "over";
    state.result = result;
    clearTimers();
    if (result === "lose") {
      onDown?.(DOWN_MS);
      toast("Você foi desativado por 10 segundos. Nada foi perdido.", 3600);
    } else {
      toast("Duelo vencido. O outro lado ficou desativado por 10 segundos.", 3200);
      audio.chime();
    }
    render();
  }

  function startMatch(role) {
    clearTimers();
    state.myComp = COMPOSURE;
    state.theirComp = COMPOSURE;
    state.finished = false;
    state.current = null;
    state.nonce = null;
    state.result = null;
    if (role === "attacker") {
      state.phase = "choosing";
      state.questions = rpg.pvpQuestions(continent());
      if (!state.questions.length) {
        toast("Sem perguntas para duelar agora.", 3200);
        close();
        return;
      }
    } else {
      state.phase = "waiting";
    }
    render();
    openPanel?.();
  }

  function attack(index) {
    if (state.phase !== "choosing") return;
    const q = state.questions[index];
    if (!q) return;
    const nonce = Math.random().toString(36).slice(2, 12);
    state.current = q;
    state.damage = q.damage;
    state.nonce = nonce;
    const sent = send({
      kind: "attack",
      question: {
        q: q.q, options: q.options.slice(), answer: q.answer, why: q.why,
      },
      damage: q.damage,
      nonce,
    });
    if (!sent) {
      toast("O ataque não saiu. A Rede pode ter caído.", 3200);
      return;
    }
    state.phase = "waiting";
    render();
  }

  function startCountdown() {
    if (state.countdown) clearInterval(state.countdown);
    state.deadline = Date.now() + DEFEND_MS;
    state.countdown = setInterval(() => {
      if (state.phase !== "defending") {
        clearInterval(state.countdown);
        state.countdown = null;
        return;
      }
      const left = Math.max(0, Math.ceil((state.deadline - Date.now()) / 1000));
      const node = $("pvp-timer");
      if (node) node.textContent = `responda em ${left}s`;
      if (left <= 0) {
        clearInterval(state.countdown);
        state.countdown = null;
        answerDefense(-1);
      }
    }, 250);
  }

  function answerDefense(index) {
    if (state.phase !== "defending" || !state.current) return;
    clearTimers();
    const correct = index === state.current.answer;
    send({ kind: "defend", correct, nonce: state.nonce });
    if (correct) {
      audio.blip();
      state.current = null;
      state.phase = "waiting";
      render();
      return;
    }
    state.myComp = Math.max(0, state.myComp - state.damage);
    audio.error?.();
    state.current = null;
    if (state.myComp <= 0) {
      send({ kind: "end", winner: state.peer.id });
      over("lose");
      return;
    }
    state.phase = "choosing";
    state.questions = rpg.pvpQuestions(continent());
    render();
  }

  function handleDefend(msg) {
    if (state.phase !== "waiting" || !state.current || msg.nonce !== state.nonce) return;
    clearTimers();
    state.current = null;
    if (msg.correct) {
      state.phase = "choosing";
      state.questions = rpg.pvpQuestions(continent());
      render();
      return;
    }
    state.theirComp = Math.max(0, state.theirComp - state.damage);
    if (state.theirComp <= 0) {
      over("win");
      return;
    }
    state.phase = "waiting";
    render();
  }

  function handleAttack(peer, msg) {
    if (!state.peer || state.peer.id !== peer.id) return;
    if (state.phase !== "waiting") return;
    state.current = msg.question;
    state.damage = msg.damage;
    state.nonce = msg.nonce;
    state.phase = "defending";
    render();
  }

  function challenge(peer) {
    const net = getNet?.();
    if (!net) {
      toast("A Rede não está ligada. Entre na praça para desafiar alguém.", 3400);
      return false;
    }
    if (!peer?.id || peer.id === net.id) return false;
    if (state.phase !== "idle") {
      toast("Já tem um duelo em andamento.", 2600);
      return false;
    }
    if (isBusy?.()) {
      toast("Feche o que está aberto antes de desafiar.", 2800);
      return false;
    }
    if (!net.sendPvp?.({ kind: "challenge", to: peer.id })) {
      toast("Não consegui enviar o convite agora.", 3000);
      return false;
    }
    state.peer = { id: String(peer.id).slice(0, 40), name: String(peer.name || "viajante").slice(0, 16) };
    state.phase = "challenging";
    open();
    later(CHALLENGE_MS, () => {
      if (state.phase === "challenging") {
        send({ kind: "decline" });
        toast("O convite expirou.", 2800);
        close();
      }
    });
    return true;
  }

  function handle(peer, msg) {
    if (!peer?.id || peer.id === myId()) return;
    const kind = msg?.kind;
    const samePeer = state.peer && state.peer.id === peer.id;

    if (kind === "challenge") {
      if (state.phase !== "idle" || isBusy?.()) {
        getNet?.()?.sendPvp?.({ kind: "decline", to: peer.id });
        return;
      }
      state.peer = { id: peer.id, name: String(peer.name || "viajante").slice(0, 16) };
      state.phase = "incoming";
      open();
      later(CHALLENGE_MS, () => {
        if (state.phase === "incoming") {
          getNet?.()?.sendPvp?.({ kind: "decline", to: peer.id });
          close();
        }
      });
      return;
    }

    if (kind === "accept") {
      if (state.phase !== "challenging" || !samePeer) return;
      clearTimers();
      audio.chime();
      startMatch("attacker");
      return;
    }

    if (kind === "decline") {
      if (!samePeer && state.phase !== "challenging") return;
      clearTimers();
      toast(state.phase === "challenging" ? "O convite foi recusado." : "O duelo foi encerrado.", 2800);
      if (state.phase === "challenging" || state.phase === "incoming") close();
      return;
    }

    if (!samePeer) return;

    if (kind === "attack") {
      handleAttack(peer, msg);
      return;
    }
    if (kind === "defend") {
      handleDefend(msg);
      return;
    }
    if (kind === "end") {
      if (state.phase === "over" || state.finished) return;
      clearTimers();
      over(String(msg.winner) === myId() ? "win" : "lose");
    }
  }

  function abort() {
    if (state.closing) return;
    const active = ["choosing", "waiting", "defending", "over"].includes(state.phase);
    const pending = ["challenging", "incoming"].includes(state.phase);
    if (state.peer) {
      if (pending) {
        getNet?.()?.sendPvp?.({ kind: "decline", to: state.peer.id });
      } else if (active && state.phase !== "over") {
        getNet?.()?.sendPvp?.({ kind: "end", to: state.peer.id, winner: state.peer.id });
        onDown?.(DOWN_MS);
        toast("Você desistiu do duelo e ficou desativado.", 3200);
      }
    }
    clearTimers();
    state.phase = "idle";
    state.peer = null;
    state.current = null;
    state.questions = [];
    state.finished = false;
  }

  return {
    challenge,
    handle,
    abort,
    get state() { return state; },
  };
}

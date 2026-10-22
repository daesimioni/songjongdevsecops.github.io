// A janela da Rede: conta, canais do mundo, DMs e quem está por perto.
// Constrói o DOM na mão para nunca injetar conteúdo de relay como HTML.
import { NOSTR } from "../core/runtime-config.js";
import { CONTINENTS } from "../content/config.js";

const $ = (id) => document.getElementById(id);

const CONTINENT_LABEL = {
  hub: "Porto do Início",
  ...Object.fromEntries(Object.values(CONTINENTS).map((c) => [c.id, c.name])),
};

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
}

function shortNpub(npub) {
  const s = String(npub || "");
  return s.length > 18 ? `${s.slice(0, 12)}…${s.slice(-4)}` : s;
}

function clock(at) {
  const d = new Date((Number(at) || 0) * 1000);
  if (!Number.isFinite(d.getTime())) return "";
  return d.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" });
}

function hueOf(pk) {
  const n = parseInt(String(pk).slice(0, 6), 16);
  return Number.isFinite(n) ? n % 360 : 200;
}

export async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    try {
      const ta = document.createElement("textarea");
      ta.value = text;
      ta.style.position = "fixed";
      ta.style.opacity = "0";
      document.body.appendChild(ta);
      ta.select();
      const ok = document.execCommand("copy");
      ta.remove();
      return ok;
    } catch { return false; }
  }
}

export function createSocial({ rede, backup, quests, player, getPeers, getNet, getLevel, getTitle, setName, toast, audio, onChallenge }) {
  const ui = {
    open: false,
    tab: "mundo",
    channel: NOSTR.channels[0].id,
    thread: null,
    unread: new Map(),
    connecting: false,
    offline: false,
    secretShown: false,
    profileAbout: "",
    party: null,
    partyInvite: null,
  };

  const partyInvites = new Set();
  const body = $("rede-body");
  const tabs = Array.from(document.querySelectorAll("[data-rede-tab]"));

  function bind() {
    for (const tab of tabs) {
      tab.addEventListener("click", () => {
        ui.tab = tab.dataset.redeTab;
        if (ui.tab === "dms") ui.unread.clear();
        if (ui.tab !== "conta") ui.secretShown = false;
        render();
      });
    }
    rede.onStatus = ({ state }) => {
      setStatus(state);
      if (ui.open && ui.tab === "conta") render();
    };
    rede.onChannel = () => {
      if (ui.open && ui.tab === "mundo") renderMessages();
    };
    rede.onDm = (msg) => {
      if (!msg) return;
      const peer = msg.peer;
      if (msg.mine) {
        if (ui.open && ui.tab === "dms" && ui.thread === peer) renderThread();
        return;
      }
      const n = (ui.unread.get(peer) || 0) + 1;
      ui.unread.set(peer, n);
      updateBadge();
      const name = rede.nameOf(peer);
      toast(`${name}: ${String(msg.text).slice(0, 90)}`, 5600);
      try { audio.blip(); } catch { /* som opcional */ }
      if (ui.open && ui.tab === "dms") {
        if (ui.thread === peer) renderThread();
        else renderDmList();
      }
    };
    rede.onPresence = () => {
      if (ui.open && ui.tab === "pessoas") renderPeople();
    };
  }

  function setStatus(state) {
    const label = $("rede-status");
    if (!label) return;
    const map = {
      "abrindo": "acordando a chave e procurando os relays...",
      "pronta": "conectada. sua chave vive neste navegador.",
      "sem rede": "os relays não responderam. o mundo continua a pé.",
    };
    label.textContent = map[state] || state;
    label.dataset.state = state;
  }

  function updateBadge() {
    let total = 0;
    for (const n of ui.unread.values()) total += n;
    const dot = $("rede-dot");
    const badge = $("rede-dm-badge");
    if (dot) dot.hidden = total === 0;
    if (badge) {
      badge.hidden = total === 0;
      badge.textContent = total > 9 ? "9+" : String(total);
    }
  }

  function render() {
    if (!ui.open) return;
    for (const tab of tabs) tab.classList.toggle("on", tab.dataset.redeTab === ui.tab);
    renderAccount();
    body.textContent = "";
    if (!rede.ready) {
      body.appendChild(el("p", "rede-empty", ui.offline
        ? "A Rede não abriu agora. O mundo continua a pé; tente de novo quando o sinal voltar."
        : "A chave ainda está sendo preparada. Os relays podem demorar alguns segundos."));
      if (ui.offline) {
        const retry = el("button", "rede-send", "tentar de novo");
        retry.type = "button";
        retry.addEventListener("click", () => {
          ui.offline = false;
          ui.connecting = true;
          rede.init()
            .then(() => { ui.connecting = false; if (ui.open) render(); })
            .catch(() => { ui.offline = true; ui.connecting = false; if (ui.open) render(); });
        });
        body.appendChild(retry);
      } else if (!ui.connecting) {
        ui.connecting = true;
        rede.init()
          .then(() => { ui.connecting = false; if (ui.open) render(); })
          .catch(() => { ui.offline = true; ui.connecting = false; if (ui.open) render(); });
      }
      return;
    }
    if (ui.tab === "mundo") renderMundo();
    else if (ui.tab === "dms") renderDms();
    else if (ui.tab === "pessoas") renderPeople();
    else renderConta();
  }

  function renderAccount() {
    const box = $("rede-account");
    box.textContent = "";
    const left = el("div", "rede-id");
    const name = el("b", "", player.name || "viajante");
    const meta = el("span", "rede-id-meta");
    const title = getTitle?.();
    meta.textContent = title ? `${title} · nível ${getLevel?.() || 1}` : `nível ${getLevel?.() || 1}`;
    left.append(name, meta);
    const key = el("button", "rede-key", rede.ready && rede.npub ? shortNpub(rede.npub) : "chave local");
    key.type = "button";
    key.title = "Copiar sua chave pública";
    key.addEventListener("click", async () => {
      if (!rede.ready) return;
      const ok = await copyText(rede.npub);
      toast(ok ? "chave pública copiada. É ela que você passa para receber DM." : rede.npub, 4200);
    });
    box.append(left, key);
  }

  // ---------- mundo ----------
  function renderMundo() {
    body.textContent = "";
    const wrap = el("div", "rede-pane");
    const channels = el("div", "rede-channels");
    for (const ch of NOSTR.channels) {
      const b = el("button", `rede-chip${ch.id === ui.channel ? " on" : ""}`, ch.name);
      b.type = "button";
      b.title = ch.sub;
      b.addEventListener("click", () => {
        if (ui.channel === ch.id) return;
        ui.channel = ch.id;
        renderMundo();
      });
      channels.appendChild(b);
    }
    const info = el("p", "rede-hint", NOSTR.channels.find((c) => c.id === ui.channel)?.sub || "");
    const msgs = el("div", "rede-msgs");
    msgs.id = "rede-msgs";
    const form = el("form", "rede-form");
    const input = el("input", "");
    input.maxLength = 280;
    input.placeholder = `falar em ${NOSTR.channels.find((c) => c.id === ui.channel)?.name || "mundo"}`;
    input.autocomplete = "off";
    input.setAttribute("aria-label", "mensagem para o canal");
    const send = el("button", "rede-send", "enviar");
    send.type = "submit";
    form.append(input, send);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      send.disabled = true;
      const res = await rede.sendChannel(text, ui.channel);
      send.disabled = false;
      if (!res.ok) {
        toast(res.reason || "a mensagem não saiu. Tente de novo.", 3600);
        return;
      }
      input.value = "";
      input.focus();
      quests.report("chat:public");
      renderMessages();
    });
    wrap.append(channels, info, msgs, form);
    body.appendChild(wrap);
    renderMessages();
    loadChannel();
  }

  function loadChannel() {
    if (!rede.ready) return;
    const box = $("rede-msgs");
    if (box) {
      box.textContent = "";
      box.appendChild(el("p", "rede-empty", "puxando as últimas mensagens..."));
    }
    rede.openChannel(ui.channel, () => {
      if (ui.open && ui.tab === "mundo") renderMessages();
    }).then(() => {
      if (ui.open && ui.tab === "mundo") renderMessages();
    }).catch(() => {
      if (box) {
        box.textContent = "";
        box.appendChild(el("p", "rede-empty", "o canal não abriu agora. Os relays podem estar fora."));
      }
    });
  }

  function renderMessages() {
    const box = $("rede-msgs");
    if (!box) return;
    const list = rede.channelEvents(ui.channel);
    box.textContent = "";
    if (!list.length) {
      box.appendChild(el("p", "rede-empty", "Ninguém falou neste canal ainda. Você pode começar."));
      return;
    }
    for (const msg of list) {
      const row = el("div", `rede-msg${msg.mine ? " mine" : ""}`);
      const head = el("div", "rede-msg-head");
      const who = el("b", "", msg.mine ? "você" : msg.name);
      who.style.color = `hsl(${hueOf(msg.author)} 85% 72%)`;
      const when = el("span", "", clock(msg.at));
      head.append(who, when);
      const text = el("p", "", msg.text);
      row.append(head, text);
      box.appendChild(row);
    }
    box.scrollTop = box.scrollHeight;
  }

  // ---------- DMs ----------
  function renderDms() {
    if (ui.thread) { renderThread(); return; }
    renderDmList();
  }

  function renderDmList() {
    body.textContent = "";
    const wrap = el("div", "rede-pane");
    const peers = rede.dmPeers();
    const msgs = el("div", "rede-msgs rede-dm-list");
    if (!peers.length) {
      msgs.appendChild(el("p", "rede-empty", "Nenhuma conversa ainda. Abra Pessoas para chamar alguém, ou cole uma chave abaixo."));
    }
    for (const p of peers) {
      const row = el("button", "rede-dm-row");
      row.type = "button";
      const left = el("span", "rede-dm-left");
      const name = el("b", "", p.name);
      const last = el("span", "", p.last ? `${p.last.mine ? "você: " : ""}${p.last.text}` : "conversa vazia");
      left.append(name, last);
      const right = el("span", "rede-dm-right");
      const unread = ui.unread.get(p.peer) || 0;
      if (unread) {
        const badge = el("em", "rede-unread", unread > 9 ? "9+" : String(unread));
        right.appendChild(badge);
      }
      right.appendChild(el("span", "rede-dm-time", p.last ? clock(p.last.at) : ""));
      row.append(left, right);
      row.addEventListener("click", () => {
        ui.thread = p.peer;
        ui.unread.delete(p.peer);
        updateBadge();
        renderDms();
      });
      msgs.appendChild(row);
    }
    const form = el("form", "rede-form rede-form-key");
    const input = el("input", "");
    input.placeholder = "chave pública (npub1... ou hex)";
    input.autocomplete = "off";
    input.spellcheck = false;
    input.setAttribute("aria-label", "chave pública de quem vai receber");
    const go = el("button", "rede-send", "conversar");
    go.type = "submit";
    form.append(input, go);
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const raw = input.value.trim();
      const pk = parsePeer(raw);
      if (!pk) { toast("cole um npub ou uma chave hex de 64 caracteres.", 4200); return; }
      ui.thread = pk;
      input.value = "";
      renderDms();
    });
    const add = el("div", "rede-add");
    add.append(el("span", "rede-hint", "conversa nova"), form);
    wrap.append(msgs, add);
    body.appendChild(wrap);
  }

  function parsePeer(raw) {
    if (!raw) return "";
    if (/^[0-9a-f]{64}$/i.test(raw)) return raw.toLowerCase();
    try {
      if (rede.nt) {
        const dec = rede.nt.nip19.decode(raw);
        if (dec.type === "npub" && typeof dec.data === "string") return dec.data;
      }
    } catch { /* formato errado */ }
    return "";
  }

  function renderThread() {
    body.textContent = "";
    const peer = ui.thread;
    const wrap = el("div", "rede-pane rede-thread");
    const head = el("div", "rede-thread-head");
    const back = el("button", "rede-back", "voltar");
    back.type = "button";
    back.addEventListener("click", () => { ui.thread = null; renderDms(); });
    const who = el("div", "rede-thread-who");
    who.appendChild(el("b", "", rede.nameOf(peer)));
    who.appendChild(el("span", "rede-id-meta", shortNpub(peerNpub(peer))));
    head.append(back, who);
    const msgs = el("div", "rede-msgs");
    const list = rede.conversation(peer);
    if (!list.length) {
      msgs.appendChild(el("p", "rede-empty", "Esta conversa está vazia. Diga alguma coisa, a chave já é sua."));
    }
    for (const msg of list) {
      const row = el("div", `rede-msg${msg.mine ? " mine" : ""}${msg.pending ? " pending" : ""}${msg.failed ? " failed" : ""}`);
      const meta = el("div", "rede-msg-head");
      meta.append(
        el("b", "", msg.mine ? "você" : rede.nameOf(peer)),
        el("span", "", msg.pending ? "enviando" : msg.failed ? "não saiu" : clock(msg.at)),
      );
      row.append(meta, el("p", "", msg.text));
      msgs.appendChild(row);
    }
    const form = el("form", "rede-form");
    const input = el("input", "");
    input.maxLength = 400;
    input.placeholder = `mensagem privada para ${rede.nameOf(peer)}`;
    input.autocomplete = "off";
    input.setAttribute("aria-label", "mensagem privada");
    const send = el("button", "rede-send", "enviar");
    send.type = "submit";
    form.append(input, send);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      const text = input.value.trim();
      if (!text) return;
      send.disabled = true;
      const res = await rede.sendDm(peer, text);
      send.disabled = false;
      if (!res.ok) { toast(res.reason || "a DM não saiu.", 3800); return; }
      input.value = "";
      input.focus();
      quests.report("chat:dm");
      renderThread();
    });
    wrap.append(head, msgs, form);
    body.appendChild(wrap);
    msgs.scrollTop = msgs.scrollHeight;
  }

  function peerNpub(pk) {
    try { return rede.nt ? rede.nt.nip19.npubEncode(pk) : pk; } catch { return pk; }
  }

  // ---------- pessoas ----------
  function myNet() { return getNet?.() || null; }

  function partyMembersText(members) {
    return (members || []).map((m) => m.name || m.id).join(", ");
  }

  // mensagem de party assinada: quem recebe só aceita se a chave do remetente
  // bater com a prova. Sem assinador (teste/stub), o envio continua direto.
  function sendParty(payload) {
    const net = myNet();
    if (!net?.sendParty) return false;
    if (!rede?.signText) return !!net.sendParty(payload);
    const texto = `mundo-song:party:v1|${payload.act}|${payload.to || ""}|${payload.party || ""}|${payload.leader || ""}|${Date.now()}`;
    const enviar = (proof) => net.sendParty({ ...payload, proof: proof || null, proofText: proof ? texto : "" });
    Promise.resolve().then(() => rede.signText(texto)).then(enviar).catch(() => enviar(null));
    return true;
  }

  function inviteToParty(peer) {
    const net = myNet();
    if (!net || !peer?.id || peer.id === net.id) return;
    if (!ui.party) {
      ui.party = {
        id: `party_${Math.random().toString(36).slice(2, 10)}`,
        leader: net.id,
        members: [{ id: net.id, name: player.name || "você" }],
      };
    }
    if (ui.party.leader !== net.id) { toast("Peça ao líder para convidar essa pessoa.", 2600); return; }
    if (ui.party.members.length >= 8) { toast("A party já tem oito pessoas.", 2600); return; }
    if (ui.party.members.some((m) => m.id === peer.id)) {
      toast(`${peer.name || "Essa pessoa"} já está na party.`, 2200);
      return;
    }
    if (!sendParty({
      act: "invite", to: peer.id, party: ui.party.id, leader: ui.party.leader,
    })) { toast("Não consegui enviar o convite. Confira a Rede.", 3000); return; }
    partyInvites.add(peer.id);
    toast(`Convite de party enviado para ${peer.name || "o jogador"}.`, 2600);
    renderPeople();
  }

  function acceptPartyInvite() {
    const invite = ui.partyInvite;
    if (!invite || ui.party) return;
    if (!sendParty({ act: "accept", to: invite.fromId, party: invite.party })) {
      toast("Não consegui aceitar o convite. Confira a Rede.", 3000); return;
    }
    ui.party = {
      id: invite.party, leader: invite.leader,
      members: [{ id: invite.leader, name: invite.fromName }, { id: myNet()?.id || "eu", name: player.name || "você" }],
    };
    ui.partyInvite = null;
    toast("Você entrou na party.", 2600);
    renderPeople();
  }

  function leaveParty() {
    if (!ui.party) return;
    for (const member of ui.party.members) {
      if (member.id !== myNet()?.id) sendParty({ act: "leave", to: member.id, party: ui.party.id });
    }
    partyInvites.clear();
    ui.party = null;
    toast("Você saiu da party.", 2200);
    renderPeople();
  }

  function syncParty() {
    if (!ui.party || ui.party.leader !== myNet()?.id) return;
    for (const member of ui.party.members) {
      if (member.id !== myNet()?.id) sendParty({ act: "sync", to: member.id, party: ui.party.id, leader: ui.party.leader, members: ui.party.members });
    }
  }

  function partyEvent(peer, msg) {
    if (!peer?.id || !msg || typeof msg.party !== "string" || !/^[a-z0-9_-]{1,40}$/i.test(msg.party)) return;
    // com a chave pública do peer conhecida, a mensagem precisa vir assinada
    if (peer.pubkey) {
      if (!rede?.verifyText || !msg.proof || !msg.proofText || msg.proof.pubkey !== peer.pubkey) return;
      Promise.resolve().then(() => rede.verifyText(msg.proof, msg.proofText))
        .then((ok) => { if (ok) processarParty(peer, msg); })
        .catch(() => {});
      return;
    }
    processarParty(peer, msg);
  }

  function processarParty(peer, msg) {
    if (msg.act === "invite") {
      if (msg.leader !== peer.id) return;
      if (ui.party) { sendParty({ act: "leave", to: peer.id, party: msg.party }); return; }
      ui.partyInvite = { fromId: peer.id, fromName: peer.name || "viajante", party: msg.party, leader: msg.leader || peer.id };
      toast(`${peer.name || "Alguém"} convidou você para uma party.`, 3800);
      if (ui.open && ui.tab === "pessoas") renderPeople();
      return;
    }
    if (msg.act === "accept") {
      if (!ui.party || msg.party !== ui.party.id || ui.party.leader !== myNet()?.id
        || !partyInvites.delete(peer.id)) return;
      if (ui.party.members.length >= 8) {
        sendParty({ act: "leave", to: peer.id, party: ui.party.id });
        return;
      }
      if (!ui.party.members.some((m) => m.id === peer.id)) ui.party.members.push({ id: peer.id, name: peer.name || "viajante" });
      syncParty();
      toast(`${peer.name || "Alguém"} entrou na party.`, 2600);
      if (ui.open && ui.tab === "pessoas") renderPeople();
      return;
    }
    if (msg.act === "sync") {
      if (!ui.party || msg.party !== ui.party.id || peer.id !== ui.party.leader || msg.leader !== peer.id) return;
      if (!Array.isArray(msg.members) || msg.members.length > 8) return;
      const members = msg.members.filter(m => m && typeof m.id === "string" && m.id.length > 0 && m.id.length <= 40)
        .map(m => ({ id: m.id, name: String(m.name || "viajante").slice(0, 16) }));
      if (members.length !== msg.members.length || new Set(members.map(m => m.id)).size !== members.length
        || !members.some(m => m.id === myNet()?.id) || !members.some(m => m.id === peer.id)) return;
      ui.party.members = members;
      if (ui.open && ui.tab === "pessoas") renderPeople();
      return;
    }
    if (msg.act === "leave") {
      if (!ui.party || msg.party !== ui.party.id || !ui.party.members.some(m => m.id === peer.id)) return;
      if (peer.id === ui.party.leader) {
        ui.party = null;
        partyInvites.clear();
        toast("O líder saiu e a party terminou.", 3000);
      } else {
        ui.party.members = ui.party.members.filter((m) => m.id !== peer.id);
        syncParty();
      }
      if (ui.open && ui.tab === "pessoas") renderPeople();
    }
  }

  function renderPeople() {
    body.textContent = "";
    const wrap = el("div", "rede-pane");
    if (ui.partyInvite) {
      const banner = el("div", "rede-card party-invite");
      banner.appendChild(el("h3", "rede-sec", "Convite de party"));
      banner.appendChild(el("p", "rede-hint", `${ui.partyInvite.fromName} chamou você para uma party.`));
      const row = el("div", "rede-keyrow");
      const yes = el("button", "rede-send", "entrar na party");
      yes.type = "button";
      yes.addEventListener("click", acceptPartyInvite);
      const no = el("button", "rede-mini", "recusar");
      no.type = "button";
      no.addEventListener("click", () => { ui.partyInvite = null; renderPeople(); });
      row.append(yes, no);
      banner.appendChild(row);
      wrap.appendChild(banner);
    }
    const party = el("div", "rede-people");
    party.appendChild(el("h3", "rede-sec", ui.party ? `Sua party (${ui.party.members.length})` : "Sua party"));
    if (ui.party) {
      party.appendChild(el("p", "rede-hint", partyMembersText(ui.party.members)));
      const out = el("button", "rede-mini", "sair da party");
      out.type = "button";
      out.addEventListener("click", leaveParty);
      party.appendChild(out);
    } else {
      party.appendChild(el("p", "rede-empty", "Sem party. Convide alguém da sua sala pelo botão ao lado do nome."));
    }
    wrap.appendChild(party);
    const online = rede.presenceList();
    const section = el("div", "rede-people");
    section.appendChild(el("h3", "rede-sec", `No mundo agora (${Math.max(0, online.length - 1)})`));
    const others = online.filter((p) => p.pk !== rede.pk);
    if (!others.length) {
      section.appendChild(el("p", "rede-empty", "Ninguém mais acendeu a Rede nos últimos minutos. Chame alguém pelo canal geral."));
    }
    for (const p of others) {
      section.appendChild(personRow(p.name, p.title || CONTINENT_LABEL[p.continent] || "", p.pk));
    }
    wrap.appendChild(section);

    const room = el("div", "rede-people");
    room.appendChild(el("h3", "rede-sec", "Na sua sala, pelo mapa"));
    const peers = (getPeers?.() || []).filter((p) => p && p.id);
    if (!peers.length) {
      room.appendChild(el("p", "rede-empty", "A praça está vazia. O convite da sala está no botão do topo."));
    }
    for (const p of peers) {
      const sub = p.pubkey ? "com chave" : "sem chave da Rede";
      const row = personRow(p.name || "viajante", sub, p.pubkey || "");
      if (!p.pubkey) row.querySelector("button")?.remove();
      const duel = el("button", "rede-mini", "desafiar");
      duel.type = "button";
      duel.title = "duelo de perguntas, sem perder vida";
      duel.addEventListener("click", () => {
        if (!onChallenge) return;
        onChallenge({ id: p.id, name: p.name, pubkey: p.pubkey || "" });
        close();
      });
      row.appendChild(duel);
      if (p.id !== myNet()?.id) {
        const invite = el("button", "rede-mini", ui.party ? "convidar" : "montar party");
        invite.type = "button";
        invite.addEventListener("click", () => inviteToParty(p));
        row.appendChild(invite);
      }
      room.appendChild(row);
    }
    wrap.appendChild(room);
    body.appendChild(wrap);
  }

  function personRow(name, sub, pk) {
    const row = el("div", "rede-person");
    const left = el("div", "rede-person-left");
    left.append(el("b", "", name), el("span", "", sub));
    const dm = el("button", "rede-mini", "DM");
    dm.type = "button";
    dm.disabled = !pk;
    dm.addEventListener("click", () => {
      ui.thread = pk;
      ui.tab = "dms";
      render();
    });
    row.append(left, dm);
    return row;
  }

  // ---------- conta ----------
  function renderConta() {
    body.textContent = "";
    const wrap = el("div", "rede-pane rede-conta");
    const npub = rede.npub;
    const card = el("div", "rede-card");
    card.appendChild(el("h3", "rede-sec", "Sua chave"));
    card.appendChild(el("p", "rede-hint", "A conta é uma chave criada neste navegador. Quem tiver a chave controla a conta, então não mostre para ninguém."));
    const npubRow = el("div", "rede-keyrow");
    const code = el("code", "rede-code", shortNpub(npub || "ainda sem chave"));
    const copy = el("button", "rede-mini", "copiar npub");
    copy.type = "button";
    copy.addEventListener("click", async () => {
      const ok = await copyText(npub);
      toast(ok ? "npub copiado." : "não deu para copiar.", 2600);
    });
    npubRow.append(code, copy);
    card.appendChild(npubRow);

    const secretRow = el("div", "rede-keyrow");
    const secret = el("code", "rede-code", ui.secretShown ? rede.secret() : "chave••••••••••••••••••••••••");
    const toggle = el("button", "rede-mini", ui.secretShown ? "esconder" : "mostrar chave");
    toggle.type = "button";
    toggle.addEventListener("click", () => {
      ui.secretShown = !ui.secretShown;
      renderConta();
    });
    secretRow.append(secret, toggle);
    card.appendChild(secretRow);
    if (ui.secretShown) {
      const copySecret = el("button", "rede-mini", "copiar chave");
      copySecret.type = "button";
      copySecret.addEventListener("click", async () => {
        const ok = await copyText(rede.secret());
        toast(ok ? "chave copiada. Guarde longe de print e de chat." : "não deu para copiar.", 4200);
      });
      card.appendChild(copySecret);
    }
    const warn = el("p", "rede-warn", "Importar outra chave troca sua identidade e suas DMs neste navegador.");
    card.appendChild(warn);
    wrap.appendChild(card);

    // backup da conta: o estado inteiro vai cifrado para a própria DM
    const bk = el("div", "rede-card");
    bk.appendChild(el("h3", "rede-sec", "Backup na sua DM"));
    const st = backup?.status?.() || {};
    const when = Number(st.at) || 0;
    bk.appendChild(el("p", "rede-hint", when
      ? `Último envio ${new Date(when).toLocaleString("pt-BR")} · ${st.bytes || 0} caracteres`
      : "Nenhum backup enviado desta conta ainda."));
    bk.appendChild(el("p", "rede-hint", "A cada cinco minutos de jogo o estado inteiro vai cifrado para a sua própria DM, no Nostr. A chave nunca entra no backup."));
    const bkRow = el("div", "rede-keyrow");
    const saveNow = el("button", "rede-mini", "salvar agora");
    saveNow.type = "button";
    saveNow.disabled = !backup;
    saveNow.addEventListener("click", async () => {
      if (!backup) return;
      saveNow.disabled = true;
      const res = await backup.saveNow({ force: true });
      saveNow.disabled = false;
      toast(res.ok
        ? (res.skipped ? "nada mudou desde o último backup." : "backup enviado para a sua DM.")
        : (res.reason || "não deu para salvar agora."), 4200);
      if (ui.tab === "conta") render();
    });
    const loadNow = el("button", "rede-mini", "carregar da DM");
    loadNow.type = "button";
    loadNow.disabled = !backup;
    loadNow.addEventListener("click", async () => {
      if (!backup) return;
      if (!confirm("Carregar o último backup da sua DM? O progresso deste navegador será trocado.")) return;
      loadNow.disabled = true;
      const res = await backup.restoreFromDm();
      loadNow.disabled = false;
      if (!res.ok) { toast(res.reason || "nenhum backup encontrado.", 4200); return; }
      toast("conta restaurada. Recarregando o mundo.", 4200);
      setTimeout(() => location.reload(), 1500);
    });
    bkRow.append(saveNow, loadNow);
    bk.appendChild(bkRow);
    wrap.appendChild(bk);

    const imp = el("form", "rede-card rede-form-stack");
    imp.appendChild(el("h3", "rede-sec", "Importar chave"));
    const impInput = el("input", "");
    impInput.placeholder = "cole a sua chave aqui";
    impInput.setAttribute("aria-label", "chave da conta para importar");
    impInput.autocomplete = "off";
    impInput.spellcheck = false;
    const impBtn = el("button", "rede-send", "usar esta chave");
    impBtn.type = "submit";
    imp.append(impInput, impBtn);
    imp.addEventListener("submit", async (e) => {
      e.preventDefault();
      const raw = impInput.value.trim();
      if (!raw) return;
      if (!confirm("Trocar a identidade deste navegador pela chave colada?")) return;
      impBtn.disabled = true;
      const res = await rede.importSecret(raw);
      impBtn.disabled = false;
      if (!res.ok) { toast(res.reason, 4200); return; }
      impInput.value = "";
      ui.thread = null;
      ui.unread.clear();
      toast("identidade trocada. Suas DMs agora são desta chave.", 4400);
      render();
    });
    wrap.appendChild(imp);

    const prof = el("form", "rede-card rede-form-stack");
    prof.appendChild(el("h3", "rede-sec", "Perfil público"));
    const nameInput = el("input", "");
    nameInput.value = player.name || "";
    nameInput.maxLength = 24;
    nameInput.placeholder = "seu apelido";
    nameInput.setAttribute("aria-label", "seu apelido no perfil público");
    nameInput.autocomplete = "off";
    const about = el("textarea", "");
    about.maxLength = 240;
    about.rows = 3;
    about.placeholder = "uma linha sobre você (opcional)";
    about.setAttribute("aria-label", "sobre você no perfil público");
    about.value = ui.profileAbout;
    about.addEventListener("input", () => { ui.profileAbout = about.value; });
    const pub = el("button", "rede-send", "publicar perfil");
    pub.type = "submit";
    prof.append(nameInput, about, pub);
    prof.addEventListener("submit", async (e) => {
      e.preventDefault();
      const name = nameInput.value.trim().slice(0, 24);
      if (!name) { nameInput.focus(); return; }
      pub.disabled = true;
      rede.setName(name);
      setName?.(name);
      const res = await rede.publishProfile({ name, about: about.value });
      pub.disabled = false;
      toast(res.ok ? `perfil publicado em ${res.relays} relay(s).` : "os relays não aceitaram o perfil agora.", 4200);
      renderAccount();
    });
    wrap.appendChild(prof);

    const relays = el("div", "rede-card");
    relays.appendChild(el("h3", "rede-sec", "Relays"));
    relays.appendChild(el("p", "rede-hint", "Os quatro relays públicos que este mundo usa. Eles guardam o que é público; a DM viaja selada."));
    const list = el("ul", "rede-relay-list");
    for (const url of NOSTR.relays) list.appendChild(el("li", "", url));
    relays.appendChild(list);
    wrap.appendChild(relays);

    const danger = el("div", "rede-card");
    danger.appendChild(el("h3", "rede-sec", "Recomeçar"));
    danger.appendChild(el("p", "rede-hint", "Gerar uma chave nova cria outra identidade. A antiga continua existindo na rede, mas você perde o acesso por aqui."));
    const reset = el("button", "rede-mini danger", "gerar nova identidade");
    reset.type = "button";
    reset.addEventListener("click", async () => {
      if (!confirm("Gerar uma chave nova? A identidade atual sai deste navegador.")) return;
      await rede.resetIdentity();
      ui.thread = null;
      ui.unread.clear();
      ui.secretShown = false;
      toast("nova identidade criada.", 3200);
      render();
    });
    danger.appendChild(reset);
    wrap.appendChild(danger);
    body.appendChild(wrap);
  }

  function open() {
    ui.open = true;
    ui.secretShown = false;
    updateBadge();
    render();
  }

  function close() {
    ui.open = false;
    ui.secretShown = false;
    rede.closeChannel();
  }

  function connect() {
    rede.init()
      .then(() => {
        rede.connectPresence(() => ({
          continent: player.continentId || "",
          title: getTitle?.() || "",
        }));
        if (ui.open) render();
      })
      .catch(() => {
        if (ui.open) render();
      });
  }

  bind();
  updateBadge();
  return { open, close, connect, updateBadge, partyEvent, inviteParty: inviteToParty, acceptParty: acceptPartyInvite, leaveParty, get thread() { return ui.thread; }, get party() { return ui.party; }, get partyInvite() { return ui.partyInvite; } };
}

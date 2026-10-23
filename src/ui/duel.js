// A tela do combate: arena, vida, J ataque, K defesa, L esquiva e as runas.
// O modelo vive em gameplay/combate.js; aqui só desenha e traduz teclas.
import { CONTINENTS } from "../content/config.js";
import { ITEMS, TIERS, MONSTER_TRAITS } from "../content/rpg-data.js";
import { drawCreatureArt } from "../rendering/creature.js";
import { drawHuman } from "../rendering/human.js";
import { ARENA } from "../gameplay/combate.js";
import { VARIANTE_POR_ID } from "../world/variantes.js";

const $ = (id) => document.getElementById(id);
const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function el(tag, cls, text) {
  const node = document.createElement(tag);
  if (cls) node.className = cls;
  if (text != null) node.textContent = text;
  return node;
}

export function createDuel({ rpg, toast, audio, onClose, onVictory, getAvatar }) {
  let combate = null;
  let raf = 0;
  let ultimo = 0;
  let fimMostrado = false;
  const flutuantes = [];
  const teclas = { cima: false, baixo: false, esquerda: false, direita: false };
  let ponteiro = null;
  let skills = [];

  const painel = () => $("duel");
  const canvas = () => $("duel-arena");

  function fundo(ctx) {
    ctx.fillStyle = "#080c18";
    ctx.fillRect(0, 0, ARENA.w, ARENA.h);
    const t = 48;
    for (let y = 0; y < ARENA.h; y += t) {
      for (let x = 0; x < ARENA.w; x += t) {
        const par = ((x / t) + (y / t)) % 2 === 0;
        ctx.fillStyle = par ? "rgba(28, 34, 66, 0.45)" : "rgba(16, 22, 44, 0.45)";
        ctx.fillRect(x + 1, y + 1, t - 2, t - 2);
      }
    }
    ctx.strokeStyle = "rgba(97, 244, 192, 0.09)";
    ctx.lineWidth = 1;
    for (let x = 0; x <= ARENA.w; x += t) {
      ctx.beginPath(); ctx.moveTo(x + 0.5, 0); ctx.lineTo(x + 0.5, ARENA.h); ctx.stroke();
    }
    for (let y = 0; y <= ARENA.h; y += t) {
      ctx.beginPath(); ctx.moveTo(0, y + 0.5); ctx.lineTo(ARENA.w, y + 0.5); ctx.stroke();
    }
    const brilho = ctx.createRadialGradient(ARENA.w / 2, ARENA.h / 2, 80, ARENA.w / 2, ARENA.h / 2, ARENA.w * 0.7);
    brilho.addColorStop(0, "rgba(97, 244, 192, 0.035)");
    brilho.addColorStop(1, "rgba(3, 5, 14, 0.5)");
    ctx.fillStyle = brilho;
    ctx.fillRect(0, 0, ARENA.w, ARENA.h);
    ctx.strokeStyle = "rgba(151, 140, 190, 0.28)";
    ctx.lineWidth = 2;
    ctx.strokeRect(1, 1, ARENA.w - 2, ARENA.h - 2);
  }

  function desenharTelegramas(ctx) {
    for (const inimigo of combate.inimigos) {
      if (inimigo.morte) continue;
      if (inimigo.especial) {
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 90, 134, 0.10)";
        ctx.strokeStyle = "rgba(255, 90, 134, 0.75)";
        ctx.lineWidth = 3;
        ctx.arc(inimigo.x, inimigo.y, 150, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      } else if (inimigo.vento) {
        ctx.beginPath();
        ctx.fillStyle = "rgba(255, 90, 134, 0.08)";
        ctx.strokeStyle = "rgba(255, 90, 134, 0.55)";
        ctx.lineWidth = 2;
        ctx.arc(inimigo.x, inimigo.y, 82 + inimigo.raio, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
      }
    }
  }

  function desenharBarraInimigo(ctx, inimigo) {
    const w = Math.max(46, Math.min(110, inimigo.nome.length * 5));
    const x = inimigo.x - w / 2;
    const y = inimigo.y - 66;
    ctx.fillStyle = "rgba(4, 6, 14, 0.82)";
    ctx.fillRect(x - 1, y - 1, w + 2, 7);
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
    ctx.fillRect(x, y, w, 5);
    ctx.fillStyle = inimigo.boss ? "#ffc857" : "#ff5a86";
    ctx.fillRect(x, y, w * clamp(inimigo.hp / inimigo.hpMax, 0, 1), 5);
  }

  function desenharJogador(ctx, agora) {
    const j = combate.jogador;
    const avatar = getAvatar?.() || {};
    if (agora < j.invulneravelAte) {
      ctx.save();
      ctx.globalAlpha = 0.45;
      ctx.fillStyle = "rgba(97, 244, 192, 0.16)";
      ctx.beginPath();
      ctx.arc(j.x, j.y - 18, 26, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
    drawHuman(ctx, j.x, j.y, j.dir, j.movendo, agora, avatar.colors || {}, 2.7, avatar.look || null, avatar.gear || null);
    if (j.defendendo) {
      ctx.beginPath();
      ctx.strokeStyle = "rgba(107, 213, 255, 0.75)";
      ctx.lineWidth = 3;
      ctx.arc(j.x, j.y - 18, 28, Math.PI * 0.15, Math.PI * 1.85);
      ctx.stroke();
    }
  }

  function desenharGolpe(ctx, agora) {
    const j = combate.jogador;
    if (agora >= j.ataqueVisualAte) return;
    const angulos = { 0: Math.PI / 2, 1: Math.PI, 2: 0, 3: -Math.PI / 2 };
    const centro = angulos[j.dir] ?? 0;
    ctx.beginPath();
    ctx.strokeStyle = "rgba(255, 243, 209, 0.9)";
    ctx.lineWidth = 5;
    ctx.arc(j.x, j.y - 16, 60, centro - Math.PI * 0.45, centro + Math.PI * 0.45);
    ctx.stroke();
  }

  function desenharInimigos(ctx, agora) {
    for (const inimigo of combate.inimigos) {
      if (inimigo.morte) continue;
      const accent = inimigo.monster?.accent || CONTINENTS[combate.ground?.continent]?.accent || "#ffc857";
      ctx.save();
      if (agora < inimigo.hitAte) ctx.globalAlpha = 0.55;
      ctx.translate(inimigo.x, inimigo.y);
      const escala = inimigo.boss ? 4.8 : 2.8 + inimigo.tier * 0.4;
      drawCreatureArt(ctx, inimigo.boss ? "boss" : inimigo.kind, accent, agora, escala);
      ctx.restore();
      desenharBarraInimigo(ctx, inimigo);
      if (inimigo.boss) {
        ctx.fillStyle = "rgba(255, 200, 87, 0.9)";
        ctx.font = "10px Silkscreen, monospace";
        ctx.textAlign = "center";
        ctx.fillText(`fase ${inimigo.phase}`, inimigo.x, inimigo.y - 74);
      }
    }
  }

  function desenharFlutuantes(ctx, agora) {
    for (let i = flutuantes.length - 1; i >= 0; i--) {
      const f = flutuantes[i];
      if (agora >= f.ate) { flutuantes.splice(i, 1); continue; }
      const p = 1 - (f.ate - agora) / 700;
      ctx.globalAlpha = Math.max(0, Math.min(1, (f.ate - agora) / 300));
      ctx.fillStyle = f.cor;
      ctx.font = "bold 15px Silkscreen, monospace";
      ctx.textAlign = "center";
      ctx.fillText(f.texto, f.x, f.y - 30 - p * 26);
    }
    ctx.globalAlpha = 1;
  }

  function desenhar() {
    const cv = canvas();
    if (!cv || !combate) return;
    const ctx = cv.getContext("2d");
    if (!ctx) return;
    const agora = combate.agora;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, cv.width, cv.height);
    fundo(ctx);
    desenharTelegramas(ctx);
    desenharInimigos(ctx, agora);
    desenharJogador(ctx, agora);
    desenharGolpe(ctx, agora);
    desenharFlutuantes(ctx, agora);
  }

  function barra(idTexto, idFill, valor, max, idBarra) {
    const texto = $(idTexto);
    if (texto) texto.textContent = `${Math.max(0, Math.ceil(valor))}/${Math.ceil(max)}`;
    const fill = $(idFill);
    if (fill) fill.style.width = `${max ? clamp(Math.round((valor / max) * 100), 0, 100) : 0}%`;
    const barra = $(idBarra);
    if (barra) {
      barra.setAttribute("aria-valuemax", String(Math.ceil(max)));
      barra.setAttribute("aria-valuenow", String(Math.max(0, Math.ceil(valor))));
    }
  }

  function montarInimigos() {
    const box = $("duel-enemies");
    if (!box) return;
    box.textContent = "";
    for (const inimigo of combate.inimigos) {
      const linha = el("div", "duel-enemy");
      const head = el("div", "duel-enemy-head");
      head.append(el("b", "", inimigo.nome), el("span", "", inimigo.boss ? "chefe" : TIERS[inimigo.tier]?.stars || ""));
      const hp = el("em", "duel-enemy-hp", `${Math.ceil(inimigo.hp)}/${Math.ceil(inimigo.hpMax)}`);
      head.appendChild(hp);
      const trilha = el("div", "duel-bar-track");
      trilha.appendChild(el("i"));
      linha.append(head, trilha);
      box.appendChild(linha);
    }
  }

  function atualizarInimigos() {
    const box = $("duel-enemies");
    if (!box) return;
    const linhas = box.querySelectorAll(".duel-enemy");
    combate.inimigos.forEach((inimigo, i) => {
      const linha = linhas[i];
      if (!linha) return;
      const fill = linha.querySelector(".duel-bar-track i");
      if (fill) fill.style.width = `${clamp(Math.round((inimigo.hp / inimigo.hpMax) * 100), 0, 100)}%`;
      const hp = linha.querySelector(".duel-enemy-hp");
      if (hp) hp.textContent = `${Math.max(0, Math.ceil(inimigo.hp))}/${Math.ceil(inimigo.hpMax)}`;
      linha.classList.toggle("morto", inimigo.morte);
    });
  }

  function montarSkills() {
    const box = $("duel-skills");
    if (!box) return;
    box.textContent = "";
    skills = (rpg.spellbarView?.() || []).slice(0, 6);
    if (!skills.length) {
      box.appendChild(el("p", "duel-sem-runa", "Sem runas. A forja da cidade subterrânea ensina a primeira."));
      return;
    }
    skills.forEach((magia, i) => {
      const botao = el("button", "duel-skill");
      botao.type = "button";
      botao.dataset.magia = magia.id;
      botao.append(el("kbd", "", String(i + 1)), el("span", "", magia.name));
      botao.appendChild(el("em", "", magia.charges ? `×${magia.charges}` : `${magia.mana} mana`));
      botao.addEventListener("click", () => usarMagia(magia.id));
      box.appendChild(botao);
    });
  }

  function atualizarSkills() {
    const box = $("duel-skills");
    if (!box) return;
    const agora = combate?.agora || 0;
    for (const botao of box.querySelectorAll(".duel-skill")) {
      const magia = skills.find((m) => m.id === botao.dataset.magia);
      if (!magia) continue;
      const pronto = combate?.magias.get(magia.id) || 0;
      const carga = rpg.itemCount?.(magia.id) || 0;
      const semMana = !carga && rpg.mana() < magia.mana;
      botao.disabled = !combate || combate.phase !== "combat" || agora < pronto || semMana;
      const custo = botao.querySelector("em");
      if (custo) custo.textContent = carga ? `×${carga}` : `${magia.mana} mana`;
    }
    const pet = rpg.activePet?.();
    const bicho = $("duel-pet");
    if (bicho) {
      bicho.hidden = !pet;
      if (pet) {
        const cd = rpg.petCdLeft?.(pet.id) || 0;
        bicho.disabled = !combate || combate.phase !== "combat" || cd > 0;
        bicho.textContent = cd > 0 ? `${pet.ability.name} · ${Math.ceil(cd / 1000)}s` : `${pet.ability.name} (P)`;
      }
    }
  }

  function aviso(texto, ms = 1400) {
    const node = $("duel-alert");
    if (!node) return;
    node.textContent = texto;
    node.hidden = false;
    node.dataset.ate = String(performance.now() + ms);
  }

  function flutuar(x, y, texto, cor) {
    flutuantes.push({ x, y, texto, cor, ate: combate.agora + 700 });
    if (flutuantes.length > 24) flutuantes.shift();
  }

  function processarEventos(eventos) {
    for (const evento of eventos) {
      if (evento.tipo === "ataque") {
        if (evento.alvo) flutuar(evento.alvo.x, evento.alvo.y - 30, evento.valor > 0 ? `-${evento.valor}` : "errou", evento.valor > 0 ? "#fff3d1" : "#9c96b8");
        if (evento.valor > 0) audio.blip?.();
      } else if (evento.tipo === "dano") {
        flutuar(combate.jogador.x, combate.jogador.y - 44, `-${evento.valor}`, evento.bloqueado ? "#6bd5ff" : "#ff5a86");
        audio.error?.();
      } else if (evento.tipo === "bloqueou") {
        flutuar(combate.jogador.x, combate.jogador.y - 44, "defendeu", "#6bd5ff");
        audio.click?.();
      } else if (evento.tipo === "aparou") {
        flutuar(combate.jogador.x, combate.jogador.y - 44, "aparou!", "#61f4c0");
        audio.chime?.();
      } else if (evento.tipo === "esquiva") {
        flutuar(combate.jogador.x, combate.jogador.y - 44, "esquiva", "#9ecbff");
      } else if (evento.tipo === "desviou") {
        if (evento.inimigo) flutuar(evento.inimigo.x, evento.inimigo.y - 34, "desviou", "#9c96b8");
      } else if (evento.tipo === "acertou") {
        if (evento.inimigo) flutuar(evento.inimigo.x, evento.inimigo.y - 34, `-${evento.valor}`, "#ffc857");
      } else if (evento.tipo === "magia") {
        if (evento.inimigo) flutuar(evento.inimigo.x, evento.inimigo.y - 36, `-${evento.valor}`, "#b48cff");
        audio.blip?.();
      } else if (evento.tipo === "curaJogador") {
        flutuar(combate.jogador.x, combate.jogador.y - 44, `+${evento.valor}`, "#61f4c0");
        audio.chime?.();
      } else if (evento.tipo === "cura") {
        if (evento.inimigo) flutuar(evento.inimigo.x, evento.inimigo.y - 34, `+${evento.valor}`, "#61f4c0");
      } else if (evento.tipo === "fase") {
        aviso(`Fase ${evento.fase}: ele ficou mais forte.`);
        audio.chime?.();
      } else if (evento.tipo === "matou") {
        aviso(`${evento.inimigo.nome} caiu.`);
        audio.chime?.();
      } else if (evento.tipo === "telegrafo" && evento.especial) {
        aviso("O chão está tremendo: saia da área.");
      } else if (evento.tipo === "area") {
        aviso(evento.valor > 0 ? `-${evento.valor} de vida` : "Você saiu da área.", 1600);
      }
    }
  }

  function atualizarHud() {
    if (!combate) return;
    const j = combate.jogador;
    barra("duel-hp-text", "duel-hp-fill", j.hp, j.hpMax, "duel-hp-bar");
    barra("duel-mana-text", "duel-mana-fill", rpg.mana(), rpg.manaMax(), "duel-mana-bar");
    atualizarInimigos();
    const combo = $("duel-combo");
    if (combo) {
      combo.hidden = j.combo < 2;
      combo.textContent = j.combo >= 2 ? `ritmo ${j.combo} · +${j.combo >= 5 ? 2 : 1} de dano` : "";
    }
    const fase = $("duel-phase");
    if (fase) {
      const principal = combate.principal;
      fase.hidden = !principal?.boss || principal.phase < 2;
      fase.textContent = principal?.boss ? `fase ${principal.phase}` : "";
    }
    const alerta = $("duel-alert");
    if (alerta && alerta.dataset.ate && performance.now() > Number(alerta.dataset.ate)) {
      alerta.hidden = true;
      delete alerta.dataset.ate;
    }
    atualizarSkills();
  }

  function entradaAtual() {
    return {
      mx: (teclas.direita ? 1 : 0) - (teclas.esquerda ? 1 : 0),
      my: (teclas.baixo ? 1 : 0) - (teclas.cima ? 1 : 0),
    };
  }

  function loop(ts) {
    if (!combate || !painel() || painel().hidden) return;
    const dt = clamp((ts - (ultimo || ts)) / 1000, 0, 0.05);
    ultimo = ts;
    const eventos = combate.passo(dt, entradaAtual());
    processarEventos(eventos);
    desenhar();
    atualizarHud();
    if (combate.phase === "victory" || combate.phase === "defeat") {
      if (!fimMostrado) mostrarFim();
      return;
    }
    raf = requestAnimationFrame(loop);
  }

  function iniciarLoop() {
    cancelAnimationFrame(raf);
    ultimo = 0;
    fimMostrado = false;
    raf = requestAnimationFrame(loop);
  }

  function recolherPonteiro() {
    ponteiro = null;
    if (combate) combate.jogador.alvo = null;
  }

  function eventoTela(e) {
    if (!combate || combate.phase !== "combat") return false;
    const k = String(e.key || "").toLowerCase();
    if (k === "j") { combate.atacar(); return true; }
    if (k === "k") { combate.defender(true); return true; }
    if (k === "l") { combate.esquivar(); return true; }
    if (k === "p") { usarBicho(); return true; }
    if (/^[1-6]$/.test(k)) {
      const magia = skills[Number(k) - 1];
      if (magia) usarMagia(magia.id);
      return true;
    }
    if (k === "w" || k === "arrowup") teclas.cima = true;
    else if (k === "s" || k === "arrowdown") teclas.baixo = true;
    else if (k === "a" || k === "arrowleft") teclas.esquerda = true;
    else if (k === "d" || k === "arrowright") teclas.direita = true;
    else return false;
    combate.jogador.alvo = null;
    return true;
  }

  function soltarTecla(e) {
    const k = String(e.key || "").toLowerCase();
    if (k === "k") combate?.defender(false);
    if (k === "w" || k === "arrowup") teclas.cima = false;
    if (k === "s" || k === "arrowdown") teclas.baixo = false;
    if (k === "a" || k === "arrowleft") teclas.esquerda = false;
    if (k === "d" || k === "arrowright") teclas.direita = false;
  }

  function usarMagia(id) {
    const res = combate?.usarMagia(id);
    if (!res || !res.ok) {
      if (res?.reason && res.reason !== "A runa ainda está esfriando.") toast(res.reason, 2400);
      return false;
    }
    atualizarHud();
    return true;
  }

  function usarBicho() {
    const res = combate?.usarBicho();
    if (!res || !res.ok) { if (res?.reason) toast(res.reason, 2400); return false; }
    atualizarHud();
    return true;
  }

  function textoDoResultado() {
    const d = rpg.duel;
    const r = d?.result || {};
    if (d?.training) return { titulo: "Treino encerrado", texto: "Sem morte e sem saque. A perícia da região subiu um pouco; o bicho de verdade espera na caverna.", loot: [] };
    if (r.error) return { titulo: "O bicho caiu", texto: "A recompensa não pôde ser gravada agora.", loot: [] };
    return { titulo: "O bicho caiu", texto: `+${r.xp || 0} XP · a passagem segue.`, loot: r.loot || [] };
  }

  function mostrarFim() {
    fimMostrado = true;
    const d = rpg.duel;
    const venceu = d?.phase === "victory";
    const body = $("duel-body");
    const controles = $("duel-controls");
    const fugir = $("duel-flee");
    if (controles) controles.hidden = true;
    if (fugir) fugir.hidden = true;
    if (!body) return;
    body.hidden = false;
    body.textContent = "";
    body.classList.toggle("win", !!venceu);
    body.classList.toggle("lose", !venceu);
    if (venceu) {
      const dados = textoDoResultado();
      body.append(el("h3", "", dados.titulo), el("p", "", dados.texto));
      if (dados.loot.length) {
        const chips = el("div", "duel-loot");
        for (const item of dados.loot) chips.appendChild(el("span", "loot-chip", `${ITEMS[item.id]?.name || item.id} ×${item.qty}`));
        body.appendChild(chips);
      }
      audio.chime?.();
      if (!d?.training) onVictory?.(d?.result);
      const botao = el("button", "duel-next", "voltar ao mundo");
      botao.type = "button";
      botao.addEventListener("click", avancar);
      body.appendChild(botao);
      botao.focus?.();
    } else {
      body.append(
        el("h3", "", "Você caiu"),
        el("p", "", "O altar do porto devolveu sua vida. A caverna espera quando você voltar."),
      );
      audio.error?.();
      const botao = el("button", "duel-next", "voltar ao mundo");
      botao.type = "button";
      botao.addEventListener("click", avancar);
      body.appendChild(botao);
      botao.focus?.();
    }
  }

  function avancar() {
    rpg.next();
    cancelAnimationFrame(raf);
    combate = null;
    onClose?.();
  }

  function configurarAbertura() {
    const d = rpg.duel;
    if (!d) return;
    const tier = TIERS[d.tier] || TIERS[1];
    const continente = CONTINENTS[d.ground?.continent]?.name || d.ground?.name || "";
    $("duel-kicker").textContent = d.training ? `treino · ${continente}` : `${d.ground?.name || "caverna"} · ${d.boss ? "chefe" : tier.name}`;
    $("duel-name").textContent = d.monster?.name || "criatura";
    const trait = MONSTER_TRAITS[d.monster?.kind]?.label || "";
    const nivel = d.monster?.level ?? "?";
    const base = d.training
      ? `nível ${nivel} · ${tier.stars} · treino sem morte e sem saque`
      : `nível ${nivel} · ${tier.stars} · combate`;
    $("duel-sub").textContent = trait ? `${base} · ${trait}` : base;
    const habilidade = $("duel-ability");
    if (habilidade) {
      habilidade.hidden = !(d.boss && d.habilidade?.nome);
      habilidade.textContent = d.boss && d.habilidade?.nome ? `${d.habilidade.nome}: ${d.habilidade.nota}` : "";
    }
    const variante = VARIANTE_POR_ID.get(d.monster?.variante);
    const chipVariante = $("duel-variant");
    if (chipVariante) {
      chipVariante.hidden = !variante;
      chipVariante.textContent = variante ? `${variante.nome}: ${variante.desc}` : "";
    }
    $("duel-risk").textContent = d.training ? " · treino" : ` · risco de fuga ${Math.round(rpg.fleeRisk(d.monster) * 100)}%`;
    $("duel-body").hidden = true;
    $("duel-controls").hidden = false;
    $("duel-flee").hidden = false;
    $("duel-alert").textContent = "";
    $("duel-alert").hidden = true;
    montarInimigos();
    montarSkills();
    desenhar();
    atualizarHud();
  }

  function abrir() {
    combate = rpg.combate;
    if (!combate) return false;
    fimMostrado = false;
    flutuantes.length = 0;
    teclas.cima = teclas.baixo = teclas.esquerda = teclas.direita = false;
    ponteiro = null;
    configurarAbertura();
    iniciarLoop();
    requestAnimationFrame(() => $("duel-arena")?.focus?.({ preventScroll: true }));
    return true;
  }

  function open(monster, ground, boss = false, partner = null) {
    const res = rpg.startDuel(monster, ground, boss, partner);
    if (!res.ok) {
      toast(res.reason || "Este monstro não está mais aqui.", 3600);
      return false;
    }
    return abrir();
  }

  function openTraining(continent, tier, theme, monster) {
    const res = rpg.startTraining(continent, tier, theme, monster);
    if (!res.ok) {
      toast(res.reason || "O treino não abriu agora.", 3200);
      return false;
    }
    return abrir();
  }

  function close() {
    cancelAnimationFrame(raf);
    recolherPonteiro();
    if (rpg.duel) rpg.flee();
    combate = null;
    flutuantes.length = 0;
  }

  const ataque = $("duel-attack");
  if (ataque) ataque.addEventListener("click", () => { combate?.atacar(); atualizarHud(); });
  const defesa = $("duel-guard");
  if (defesa) {
    const segurar = (e) => { e.preventDefault(); combate?.defender(true); };
    const soltar = () => combate?.defender(false);
    defesa.addEventListener("pointerdown", segurar);
    defesa.addEventListener("pointerup", soltar);
    defesa.addEventListener("pointerleave", soltar);
    defesa.addEventListener("pointercancel", soltar);
    defesa.addEventListener("keydown", (e) => { if (e.key === " " || e.key === "Enter") { e.preventDefault(); combate?.defender(true); } });
    defesa.addEventListener("keyup", () => combate?.defender(false));
  }
  const esquiva = $("duel-dodge");
  if (esquiva) esquiva.addEventListener("click", () => { combate?.esquivar(); });
  const bicho = $("duel-pet");
  if (bicho) bicho.addEventListener("click", usarBicho);

  const tela = canvas();
  if (tela) {
    const mover = (e) => {
      if (!combate || combate.phase !== "combat") return;
      const r = tela.getBoundingClientRect();
      const x = ((e.clientX - r.left) / r.width) * ARENA.w;
      const y = ((e.clientY - r.top) / r.height) * ARENA.h;
      ponteiro = { x, y };
      combate.jogador.alvo = ponteiro;
    };
    tela.addEventListener("pointerdown", (e) => { e.preventDefault(); tela.setPointerCapture?.(e.pointerId); mover(e); });
    tela.addEventListener("pointermove", (e) => { if (ponteiro) mover(e); });
    tela.addEventListener("pointerup", recolherPonteiro);
    tela.addEventListener("pointercancel", recolherPonteiro);
    tela.addEventListener("pointerleave", recolherPonteiro);
  }

  window.addEventListener("keyup", soltarTecla);

  return { open, openTraining, close, tecla: eventoTela, solta: soltarTecla, avancar, get combate() { return combate; } };
}

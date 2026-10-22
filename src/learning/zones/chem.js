// Química: tabela periódica, titulação, energia de reação e balanceamento.
import { ELEMENTS, CAT_COLORS, CAT_NAMES } from "../../content/data/elements.js";

export async function mount(el, api, variant) {
  if (variant === "periodic") return mountPeriodic(el, api);
  if (variant === "titration") return mountTitration(el, api);
  if (variant === "energy") return mountEnergy(el, api);
  if (variant === "balance") return mountBalance(el, api);
  el.innerHTML = '<p class="widget-fail">Instrumento de Química desconhecido.</p>';
  return () => {};
}

/* ---------------- tabela periódica ---------------- */
function mountPeriodic(el, api) {
  let selected = ELEMENTS[0];
  el.innerHTML = `
    <div class="widget">
      <div class="widget-head">
        <span class="widget-label">tabela viva</span>
        <span class="widget-hint">recorte dos 36 primeiros</span>
      </div>
      <div class="periodic-scroll"><div class="periodic-grid" id="periodic-grid"></div></div>
      <div class="periodic-detail" id="periodic-detail"></div>
      <p class="widget-note">Leia a tabela por colunas: a mesma coluna reúne átomos com a mesma vontade química, porque têm o mesmo número de elétrons na última camada. As linhas contam camadas. O número atômico é a identidade do elemento.</p>
    </div>
  `;
  const grid = el.querySelector("#periodic-grid");
  const detail = el.querySelector("#periodic-detail");

  function renderDetail() {
    const cat = CAT_NAMES[selected.cat];
    const color = CAT_COLORS[selected.cat];
    detail.innerHTML = `
      <div class="periodic-card" style="--c:${color}">
        <div class="periodic-symbol"><b>${selected.sym}</b><span>${selected.z}</span></div>
        <div class="periodic-text">
          <h4>${selected.name}</h4>
          <p class="periodic-meta">grupo ${selected.group} · período ${selected.period} · ${cat}</p>
          <p>${selected.fact}</p>
        </div>
      </div>
    `;
  }
  function render() {
    grid.textContent = "";
    for (const e of ELEMENTS) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "el" + (e.z === selected.z ? " on" : "");
      b.style.gridColumn = e.group;
      b.style.gridRow = e.period;
      b.style.setProperty("--c", CAT_COLORS[e.cat]);
      b.innerHTML = `<span>${e.z}</span><b>${e.sym}</b>`;
      b.setAttribute("aria-label", `${e.name}, número atômico ${e.z}`);
      b.addEventListener("click", () => {
        selected = e;
        for (const other of grid.querySelectorAll(".el")) other.classList.remove("on");
        b.classList.add("on");
        renderDetail();
        api.audio.blip();
      });
      grid.appendChild(b);
    }
    renderDetail();
  }
  render();
  return () => {};
}

/* ---------------- titulação ---------------- */
function mountTitration(el, api) {
  const W = 380, H = 270;
  const Va = 25, CaMmol = 2.5;
  let Vb = 0;
  el.innerHTML = `
    <div class="widget">
      <div class="widget-head">
        <span class="widget-label">fonte ácida</span>
        <span class="widget-hint">25 mL de HCl 0,1 M + NaOH 0,1 M</span>
      </div>
      <div class="widget-canvas-wrap"><canvas id="tit-canvas" width="380" height="270"></canvas></div>
      <div class="w-row">
        <label for="tit-v">base adicionada</label>
        <input id="tit-v" class="w-range" type="range" min="0" max="50" step="0.1" value="0">
        <b id="tit-v-label" style="font-family:var(--mono);color:var(--amber)">0,0 mL</b>
        <button type="button" class="w-btn" id="tit-add">+ 1 mL</button>
        <button type="button" class="w-btn" id="tit-reset">zerar</button>
      </div>
      <div class="tit-readout" id="tit-info"></div>
      <div class="w-row"><span class="mini-label">indicador</span><span class="tit-indicator" id="tit-indicator">fenolftaleína</span></div>
      <p class="widget-note">Perto do ponto de equivalência, o pH salta. O indicador muda de cor nessa faixa. O ácido e a base não desaparecem: viram água e sal, e o que sobra decide o pH final.</p>
    </div>
  `;
  const canvas = el.querySelector("#tit-canvas");
  const ctx = canvas.getContext("2d");
  const slider = el.querySelector("#tit-v");
  const vLabel = el.querySelector("#tit-v-label");
  const info = el.querySelector("#tit-info");
  const indicator = el.querySelector("#tit-indicator");

  function pHAt(v) {
    const mmolB = CaMmol * (v / 25);
    if (Math.abs(v - 25) < 0.001) return 7;
    if (mmolB < CaMmol) {
      const h = (CaMmol - mmolB) / (Va + v);
      return -Math.log10(Math.max(1e-14, h));
    }
    const oh = (mmolB - CaMmol) / (Va + v);
    return 14 + Math.log10(Math.max(1e-14, oh));
  }
  function pHColor(ph) {
    if (ph < 4) return "#ff7a5c";
    if (ph < 6.5) return "#ffc857";
    if (ph < 7.5) return "#a9e8c0";
    if (ph < 9) return "#7ee787";
    return "#ff7aa8";
  }
  function draw() {
    ctx.fillStyle = "#05070f";
    ctx.fillRect(0, 0, W, H);
    const left = 34, right = 28, top = 18, bottom = 38;
    const pw = W - left - right, ph = H - top - bottom;
    const X = (v) => left + v / 50 * pw;
    const Y = (p) => top + (14 - p) / 14 * ph;
    // grade
    ctx.strokeStyle = "rgba(180,140,255,0.1)";
    ctx.lineWidth = 1;
    for (let p = 0; p <= 14; p += 2) {
      ctx.beginPath(); ctx.moveTo(left, Y(p)); ctx.lineTo(W - right, Y(p)); ctx.stroke();
    }
    for (let v = 0; v <= 50; v += 10) {
      ctx.beginPath(); ctx.moveTo(X(v), top); ctx.lineTo(X(v), H - bottom); ctx.stroke();
    }
    ctx.strokeStyle = "rgba(220,215,255,0.5)";
    ctx.beginPath(); ctx.moveTo(left, H - bottom); ctx.lineTo(W - right, H - bottom); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(left, top); ctx.lineTo(left, H - bottom); ctx.stroke();
    // equivalência
    ctx.strokeStyle = "rgba(255,200,87,0.35)";
    ctx.setLineDash([4, 4]);
    ctx.beginPath(); ctx.moveTo(X(25), top); ctx.lineTo(X(25), H - bottom); ctx.stroke();
    ctx.setLineDash([]);
    // curva
    ctx.strokeStyle = "#6bd5ff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 300; i++) {
      const v = i / 300 * 50;
      const p = pHAt(v);
      if (i === 0) ctx.moveTo(X(v), Y(p)); else ctx.lineTo(X(v), Y(p));
    }
    ctx.stroke();
    // ponto atual
    const phNow = pHAt(Vb);
    ctx.fillStyle = pHColor(phNow);
    ctx.beginPath(); ctx.arc(X(Vb), Y(phNow), 5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(255,255,255,0.5)";
    ctx.beginPath(); ctx.arc(X(Vb), Y(phNow), 8, 0, Math.PI * 2); ctx.stroke();
    // textos
    ctx.fillStyle = "rgba(220,215,255,0.55)";
    ctx.font = "10px ui-monospace, monospace";
    ctx.fillText("pH", 10, top + 8);
    ctx.fillText("0", 10, Y(0) + 3);
    ctx.fillText("7", 10, Y(7) + 3);
    ctx.fillText("14", 6, Y(14) + 3);
    ctx.fillText("volume de base (mL)", left + 46, H - 10);
    ctx.fillText("equivalência", X(25) + 4, top + 10);
    info.innerHTML = `volume <b>${Vb.toFixed(1)} mL</b> · pH <b>${phNow.toFixed(2)}</b> · ${phNow < 6.8 ? "ácido" : phNow > 7.4 ? "básico" : "neutro"}`;
    indicator.textContent = Vb < 25 ? "incolor (meio ácido)" : "rosa (meio básico)";
    indicator.style.color = phNow > 8.2 ? "#ff7aa8" : "#9c96b8";
    indicator.style.borderColor = phNow > 8.2 ? "rgba(255,122,168,0.6)" : "var(--line)";
  }
  slider.addEventListener("input", () => { Vb = Number(slider.value); vLabel.textContent = `${Vb.toFixed(1)} mL`; draw(); });
  el.querySelector("#tit-add").addEventListener("click", () => {
    Vb = Math.min(50, Vb + 1);
    slider.value = String(Vb);
    vLabel.textContent = `${Vb.toFixed(1)} mL`;
    draw(); api.audio.blip();
  });
  el.querySelector("#tit-reset").addEventListener("click", () => {
    Vb = 0; slider.value = "0"; vLabel.textContent = "0,0 mL"; draw();
  });
  draw();
  return () => {};
}

/* ---------------- energia de ativação ---------------- */
function mountEnergy(el, api) {
  const W = 380, H = 270;
  let Ea = 86;
  let catalyst = false;
  let exo = true;
  el.innerHTML = `
    <div class="widget">
      <div class="widget-head">
        <span class="widget-label">forja das reações</span>
        <span class="widget-hint">o pedágio da reação</span>
      </div>
      <div class="widget-canvas-wrap"><canvas id="ener-canvas" width="380" height="270"></canvas></div>
      <div class="w-row">
        <label for="ener-ea">barreira</label>
        <input id="ener-ea" class="w-range" type="range" min="30" max="120" step="1" value="86">
        <b id="ener-ea-label" style="font-family:var(--mono);color:var(--amber)">86</b>
        <button type="button" class="w-btn" id="ener-cat">catalisador</button>
        <button type="button" class="w-btn" id="ener-type">exotérmica</button>
      </div>
      <div class="phys-readout" id="ener-info"></div>
      <p class="widget-note">O catalisador não muda o saldo final, só o caminho. Ele abaixa o pico e deixa mais colisões terem energia suficiente para atravessar. O corpo faz isso com enzimas o tempo todo.</p>
    </div>
  `;
  const canvas = el.querySelector("#ener-canvas");
  const ctx = canvas.getContext("2d");
  const eaIn = el.querySelector("#ener-ea");
  const eaLabel = el.querySelector("#ener-ea-label");
  const info = el.querySelector("#ener-info");

  function draw() {
    ctx.fillStyle = "#05070f";
    ctx.fillRect(0, 0, W, H);
    const left = 46, right = 24, top = 30, bottom = 40;
    const pw = W - left - right, ph = H - top - bottom;
    const reactY = exo ? top + ph * 0.72 : top + ph * 0.38;
    const prodY = exo ? top + ph * 0.86 : top + ph * 0.24;
    const barrier = Ea * 1.45;
    const barrierCat = barrier * 0.58;
    const X = (x) => left + x * pw;
    const curve = (x, isCat) => {
      const smooth = x < 0.35 ? 0 : x > 0.65 ? 1 : (x - 0.35) / 0.3;
      const base = reactY + (prodY - reactY) * (smooth * smooth * (3 - 2 * smooth));
      const bar = (isCat ? barrierCat : barrier) * Math.exp(-Math.pow((x - 0.5) / 0.11, 2));
      return base - bar;
    };
    // eixos
    ctx.strokeStyle = "rgba(220,215,255,0.35)";
    ctx.beginPath(); ctx.moveTo(left, H - bottom); ctx.lineTo(W - right, H - bottom); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(left, top); ctx.lineTo(left, H - bottom); ctx.stroke();
    // níveis
    ctx.setLineDash([5, 4]);
    ctx.strokeStyle = "rgba(255,200,87,0.35)";
    ctx.beginPath(); ctx.moveTo(left, reactY); ctx.lineTo(X(0.28), reactY); ctx.stroke();
    ctx.strokeStyle = "rgba(126,231,135,0.35)";
    ctx.beginPath(); ctx.moveTo(X(0.72), prodY); ctx.lineTo(W - right, prodY); ctx.stroke();
    ctx.setLineDash([]);
    // curva catalisada
    if (catalyst) {
      ctx.strokeStyle = "rgba(180,140,255,0.55)";
      ctx.lineWidth = 1.5;
      ctx.setLineDash([4, 4]);
      ctx.beginPath();
      for (let i = 0; i <= 200; i++) {
        const x = i / 200;
        const y = curve(x, true);
        if (i === 0) ctx.moveTo(X(x), y); else ctx.lineTo(X(x), y);
      }
      ctx.stroke();
      ctx.setLineDash([]);
    }
    // curva principal
    ctx.strokeStyle = "#ffc857";
    ctx.lineWidth = 2.4;
    ctx.beginPath();
    for (let i = 0; i <= 200; i++) {
      const x = i / 200;
      const y = curve(x, false);
      if (i === 0) ctx.moveTo(X(x), y); else ctx.lineTo(X(x), y);
    }
    ctx.stroke();
    // seta da barreira
    ctx.strokeStyle = "#ff7aa8";
    ctx.beginPath(); ctx.moveTo(X(0.5) + 14, reactY); ctx.lineTo(X(0.5) + 14, reactY - barrier); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(X(0.5) + 10, reactY - barrier + 6); ctx.lineTo(X(0.5) + 14, reactY - barrier); ctx.lineTo(X(0.5) + 18, reactY - barrier + 6); ctx.stroke();
    // rótulos
    ctx.fillStyle = "rgba(220,215,255,0.65)";
    ctx.font = "10px ui-monospace, monospace";
    ctx.fillText("reagentes", left + 4, reactY - 7);
    ctx.fillText("produtos", W - right - 58, prodY + 15);
    ctx.fillText("energia", 8, top + 8);
    ctx.fillText("caminho da reação", left + 78, H - 12);
    ctx.fillStyle = "#ff7aa8";
    ctx.fillText(`Ea = ${Ea}`, X(0.5) + 22, reactY - barrier / 2);
    const dh = exo ? "libera energia" : "absorve energia";
    info.innerHTML = `reação <b>${exo ? "exotérmica" : "endotérmica"}</b> · ${dh} · barreira <b>${Ea}</b>${catalyst ? " · catalisador ligado" : ""}`;
  }
  eaIn.addEventListener("input", () => { Ea = Number(eaIn.value); eaLabel.textContent = Ea; draw(); });
  el.querySelector("#ener-cat").addEventListener("click", (e) => {
    catalyst = !catalyst;
    e.target.classList.toggle("on", catalyst);
    e.target.setAttribute("aria-pressed", String(catalyst));
    draw(); api.audio.blip();
  });
  el.querySelector("#ener-type").addEventListener("click", (e) => {
    exo = !exo;
    e.target.textContent = exo ? "exotérmica" : "endotérmica";
    draw(); api.audio.blip();
  });
  draw();
  return () => {};
}

/* ---------------- balanceamento ---------------- */
function mountBalance(el, api) {
  const EQUATIONS = [
    {
      left: [{ label: "H₂", atoms: { H: 2 } }, { label: "O₂", atoms: { O: 2 } }],
      right: [{ label: "H₂O", atoms: { H: 2, O: 1 } }],
      solution: [2, 1, 2],
    },
    {
      left: [{ label: "CH₄", atoms: { C: 1, H: 4 } }, { label: "O₂", atoms: { O: 2 } }],
      right: [{ label: "CO₂", atoms: { C: 1, O: 2 } }, { label: "H₂O", atoms: { H: 2, O: 1 } }],
      solution: [1, 2, 1, 2],
    },
    {
      left: [{ label: "Fe", atoms: { Fe: 1 } }, { label: "O₂", atoms: { O: 2 } }],
      right: [{ label: "Fe₂O₃", atoms: { Fe: 2, O: 3 } }],
      solution: [4, 3, 2],
    },
  ];
  let idx = 0;
  let coefs = EQUATIONS[0].left.concat(EQUATIONS[0].right).map(() => 1);
  el.innerHTML = `
    <div class="widget">
      <div class="widget-head">
        <span class="widget-label">balança de lavoisier</span>
        <span class="widget-hint">conserte o inventário</span>
      </div>
      <div class="balance-eq" id="bal-eq"></div>
      <div class="w-row">
        <button type="button" class="w-btn" id="bal-check">verificar</button>
        <button type="button" class="w-btn" id="bal-next">próxima equação</button>
      </div>
      <div class="balance-feedback" id="bal-feedback">Ajuste os coeficientes até cada elemento ter a mesma quantidade dos dois lados.</div>
      <p class="widget-note">Você não pode mexer nas fórmulas, só nos coeficientes. O menor conjunto inteiro que fecha a conta é a resposta. No fim, a proporção vira receita: dois de hidrogênio para um de oxigênio dão dois de água.</p>
    </div>
  `;
  const eq = el.querySelector("#bal-eq");
  const fb = el.querySelector("#bal-feedback");

  function species() { return EQUATIONS[idx].left.concat(EQUATIONS[idx].right); }
  function reset() {
    coefs = species().map(() => 1);
    render();
  }
  function gcd(a, b) { return b ? gcd(b, a % b) : a; }
  function render() {
    const all = species();
    const leftCount = all.length - EQUATIONS[idx].right.length;
    eq.textContent = "";
    all.forEach((sp, i) => {
      const wrap = document.createElement("span");
      wrap.className = "bal-species";
      if (i === leftCount) {
        const arrow = document.createElement("b");
        arrow.className = "bal-arrow";
        arrow.textContent = "→";
        eq.appendChild(arrow);
      }
      const minus = document.createElement("button");
      minus.type = "button"; minus.className = "bal-btn"; minus.textContent = "−";
      const num = document.createElement("b");
      num.textContent = coefs[i];
      const plus = document.createElement("button");
      plus.type = "button"; plus.className = "bal-btn"; plus.textContent = "+";
      minus.addEventListener("click", () => { coefs[i] = Math.max(1, coefs[i] - 1); render(); });
      plus.addEventListener("click", () => { coefs[i] = Math.min(9, coefs[i] + 1); render(); });
      wrap.append(minus, num, plus);
      const formula = document.createElement("span");
      formula.className = "bal-formula";
      formula.textContent = sp.label;
      wrap.appendChild(formula);
      if (i < all.length - 1 && i !== leftCount - 1) {
        const plusSign = document.createElement("span");
        plusSign.className = "bal-plus";
        plusSign.textContent = "+";
        wrap.appendChild(plusSign);
      }
      eq.appendChild(wrap);
    });
    fb.textContent = "Ajuste os coeficientes até cada elemento ter a mesma quantidade dos dois lados.";
    fb.className = "balance-feedback";
  }
  function check() {
    const all = species();
    const left = {}, right = {};
    all.forEach((sp, i) => {
      const target = i < EQUATIONS[idx].left.length ? left : right;
      for (const [el, n] of Object.entries(sp.atoms)) target[el] = (target[el] || 0) + n * coefs[i];
    });
    const els = new Set([...Object.keys(left), ...Object.keys(right)]);
    const diffs = [];
    for (const e of els) if ((left[e] || 0) !== (right[e] || 0)) diffs.push(`${e}: ${left[e] || 0} × ${right[e] || 0}`);
    if (diffs.length) {
      fb.className = "balance-feedback bad";
      fb.textContent = `ainda não: ${diffs.join(" · ")}`;
      api.audio.error();
      return;
    }
    const g = coefs.reduce((a, b) => gcd(a, b), 0);
    if (g > 1) {
      fb.className = "balance-feedback warn";
      fb.textContent = "está balanceada, mas dá para simplificar: divida todos os coeficientes pelo mesmo número.";
      api.audio.blip();
      return;
    }
    fb.className = "balance-feedback good";
    fb.textContent = `fechou. ${coefs.join(" : ")} é a menor proporção inteira.`;
    api.audio.chime();
  }
  el.querySelector("#bal-check").addEventListener("click", check);
  el.querySelector("#bal-next").addEventListener("click", () => {
    idx = (idx + 1) % EQUATIONS.length;
    reset(); api.audio.open();
  });
  reset();
  return () => {};
}

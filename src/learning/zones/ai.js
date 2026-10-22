// Inteligência Artificial: regressão, rede neural, tokens, convolução e ética.

export async function mount(el, api, variant) {
  if (variant === "learning") return mountLearning(el, api);
  if (variant === "neural") return mountNeural(el, api);
  if (variant === "language") return mountLanguage(el, api);
  if (variant === "vision") return mountVision(el, api);
  if (variant === "ethics") return mountEthics(el, api);
  el.innerHTML = '<p class="widget-fail">Instrumento de IA desconhecido.</p>';
  return () => {};
}

/* ---------------- regressão linear ---------------- */
function mountLearning(el, api) {
  const W = 380, H = 240;
  let points = [];
  let w = -0.2, b = 0.85;
  let lr = 0.12;
  let epoch = 0;
  let timer = null;
  let loss = 0;

  function makeData() {
    points = [];
    for (let i = 0; i < 16; i++) {
      const x = (i + 0.5) / 16 + (Math.random() - 0.5) * 0.04;
      const y = Math.max(0.04, Math.min(0.96, 0.62 * x + 0.2 + (Math.random() - 0.5) * 0.18));
      points.push({ x, y });
    }
    w = -0.2; b = 0.85; epoch = 0; loss = mse();
  }
  function mse() {
    return points.reduce((s, p) => s + Math.pow(w * p.x + b - p.y, 2), 0) / points.length;
  }
  el.innerHTML = `
    <div class="widget">
      <div class="widget-head">
        <span class="widget-label">praça dos dados</span>
        <span class="widget-hint">a reta que aprende</span>
      </div>
      <div class="widget-canvas-wrap"><canvas id="learn-canvas" width="380" height="240"></canvas></div>
      <div class="w-row">
        <button type="button" class="w-btn" id="learn-train">treinar</button>
        <button type="button" class="w-btn" id="learn-new">novos dados</button>
        <label for="learn-lr">passo</label>
        <input id="learn-lr" class="w-range" type="range" min="1" max="40" step="1" value="12">
        <b id="learn-lr-label" style="font-family:var(--mono);color:var(--amber)">0.12</b>
      </div>
      <div class="ai-readout" id="learn-info"></div>
      <p class="widget-note">A perda mede o erro médio ao quadrado. O gradiente aponta para onde aumentar a perda; o treino anda no sentido contrário. Passo grande pula o vale, passo pequeno demora. O objetivo é generalizar, não decorar os pontos.</p>
    </div>
  `;
  const canvas = el.querySelector("#learn-canvas");
  const ctx = canvas.getContext("2d");
  const info = el.querySelector("#learn-info");
  const trainBtn = el.querySelector("#learn-train");

  function draw() {
    ctx.fillStyle = "#05070f";
    ctx.fillRect(0, 0, W, H);
    const left = 28, bottom = 24, top = 16, right = 16;
    const pw = W - left - right, ph = H - top - bottom;
    const X = (x) => left + x * pw;
    const Y = (y) => top + (1 - y) * ph;
    ctx.strokeStyle = "rgba(180,140,255,0.12)";
    for (let i = 0; i <= 4; i++) {
      ctx.beginPath(); ctx.moveTo(X(i / 4), top); ctx.lineTo(X(i / 4), H - bottom); ctx.stroke();
      ctx.beginPath(); ctx.moveTo(left, Y(i / 4)); ctx.lineTo(W - right, Y(i / 4)); ctx.stroke();
    }
    ctx.strokeStyle = "rgba(220,215,255,0.45)";
    ctx.beginPath(); ctx.moveTo(left, H - bottom); ctx.lineTo(W - right, H - bottom); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(left, top); ctx.lineTo(left, H - bottom); ctx.stroke();
    // resíduos
    for (const p of points) {
      ctx.strokeStyle = "rgba(255,122,168,0.25)";
      ctx.beginPath(); ctx.moveTo(X(p.x), Y(p.y)); ctx.lineTo(X(p.x), Y(w * p.x + b)); ctx.stroke();
    }
    // reta
    ctx.strokeStyle = "#ffc857";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(X(0), Y(b)); ctx.lineTo(X(1), Y(w + b)); ctx.stroke();
    // pontos
    for (const p of points) {
      ctx.fillStyle = "#6bd5ff";
      ctx.beginPath(); ctx.arc(X(p.x), Y(p.y), 3, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = "rgba(220,215,255,0.55)";
    ctx.font = "10px ui-monospace, monospace";
    ctx.fillText("x", W - 22, H - 8);
    ctx.fillText("y", 9, 16);
    info.innerHTML = `reta y = <b>${w.toFixed(2)}x ${b >= 0 ? "+" : "-"} ${Math.abs(b).toFixed(2)}</b> · perda <b>${loss.toFixed(4)}</b> · época ${epoch}`;
  }
  function step() {
    const n = points.length;
    let gw = 0, gb = 0;
    for (const p of points) {
      const e = w * p.x + b - p.y;
      gw += 2 * e * p.x / n;
      gb += 2 * e / n;
    }
    w -= lr * gw;
    b -= lr * gb;
    epoch++;
    loss = mse();
    draw();
  }
  function start() {
    if (timer) {
      clearInterval(timer); timer = null; trainBtn.textContent = "treinar";
      return;
    }
    trainBtn.textContent = "pausar";
    timer = setInterval(() => {
      for (let i = 0; i < 5; i++) step();
    }, 40);
  }
  trainBtn.addEventListener("click", start);
  el.querySelector("#learn-new").addEventListener("click", () => {
    if (timer) { clearInterval(timer); timer = null; trainBtn.textContent = "treinar"; }
    makeData(); draw(); api.audio.blip();
  });
  el.querySelector("#learn-lr").addEventListener("input", (e) => {
    lr = Number(e.target.value) / 100;
    el.querySelector("#learn-lr-label").textContent = lr.toFixed(2);
  });
  makeData();
  draw();
  return () => { if (timer) clearInterval(timer); };
}

/* ---------------- rede neural ---------------- */
function mountNeural(el, api) {
  const W = 380, H = 250;
  const HID = 8;
  let points = [];
  let W1, b1, W2, b2, W3, b3;
  let epoch = 0, running = false, timer = null, acc = 0;

  const rand = (s = 0.8) => (Math.random() * 2 - 1) * s;
  const sig = (x) => 1 / (1 + Math.exp(-x));
  const tanh = Math.tanh;

  function init() {
    W1 = Array.from({ length: HID }, () => [rand(), rand()]);
    b1 = Array.from({ length: HID }, () => rand(0.3));
    W2 = Array.from({ length: HID }, () => Array.from({ length: HID }, () => rand(0.5)));
    b2 = Array.from({ length: HID }, () => rand(0.3));
    W3 = Array.from({ length: HID }, () => rand(0.5));
    b3 = 0;
    epoch = 0; acc = 0;
  }
  function makeData() {
    points = [];
    for (let i = 0; i < 120; i++) {
      const x = Math.random(), y = Math.random();
      const r = Math.hypot(x - 0.5, y - 0.5);
      const label = r < 0.23 ? 1 : 0;
      points.push({ x, y, label });
    }
    init();
  }
  function forward(x, y) {
    const ix = (x - 0.5) * 2, iy = (y - 0.5) * 2;
    const h1 = new Array(HID), h2 = new Array(HID);
    for (let i = 0; i < HID; i++) h1[i] = tanh(b1[i] + W1[i][0] * ix + W1[i][1] * iy);
    for (let i = 0; i < HID; i++) {
      let z = b2[i];
      for (let j = 0; j < HID; j++) z += W2[i][j] * h1[j];
      h2[i] = tanh(z);
    }
    let z = b3;
    for (let j = 0; j < HID; j++) z += W3[j] * h2[j];
    return { out: sig(z), h1, h2 };
  }
  function trainEpoch(lr = 0.25) {
    for (const p of points) {
      const { out, h1, h2 } = forward(p.x, p.y);
      const d3 = out - p.label;
      const d2 = new Array(HID), d1 = new Array(HID);
      for (let i = 0; i < HID; i++) d2[i] = W3[i] * d3 * (1 - h2[i] * h2[i]);
      for (let j = 0; j < HID; j++) {
        let s = 0;
        for (let i = 0; i < HID; i++) s += W2[i][j] * d2[i];
        d1[j] = s * (1 - h1[j] * h1[j]);
      }
      for (let i = 0; i < HID; i++) {
        W3[i] -= lr * d3 * h2[i];
      }
      b3 -= lr * d3;
      for (let i = 0; i < HID; i++) {
        for (let j = 0; j < HID; j++) W2[i][j] -= lr * d2[i] * h1[j];
        b2[i] -= lr * d2[i];
      }
      for (let i = 0; i < HID; i++) {
        W1[i][0] -= lr * d1[i] * ((p.x - 0.5) * 2);
        W1[i][1] -= lr * d1[i] * ((p.y - 0.5) * 2);
        b1[i] -= lr * d1[i];
      }
    }
    epoch++;
    let correct = 0;
    for (const p of points) if ((forward(p.x, p.y).out > 0.5 ? 1 : 0) === p.label) correct++;
    acc = correct / points.length;
  }

  el.innerHTML = `
    <div class="widget">
      <div class="widget-head">
        <span class="widget-label">torre das camadas</span>
        <span class="widget-hint">duas entradas, duas camadas, uma decisão</span>
      </div>
      <div class="widget-canvas-wrap"><canvas id="neural-canvas" width="380" height="250"></canvas></div>
      <div class="w-row">
        <button type="button" class="w-btn" id="neural-train">treinar</button>
        <button type="button" class="w-btn" id="neural-new">novos pontos</button>
        <span class="ai-readout" id="neural-info"></span>
      </div>
      <p class="widget-note">A fronteira começa torta e sem sentido. A cada erro, os pesos mudam um pouco. O que você vê é a rede tentando separar dentro de um círculo de fora. Se acertar o treino e falhar no que não viu, é overfitting.</p>
    </div>
  `;
  const canvas = el.querySelector("#neural-canvas");
  const ctx = canvas.getContext("2d");
  const info = el.querySelector("#neural-info");
  const btn = el.querySelector("#neural-train");

  function draw() {
    ctx.fillStyle = "#05070f";
    ctx.fillRect(0, 0, W, H);
    const left = 18, top = 18, size = 220;
    const X = (x) => left + x * size;
    const Y = (y) => top + (1 - y) * size;
    // fronteira
    const cols = 32, rows = 32;
    const cw = size / cols, ch = size / rows;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        const v = forward((i + 0.5) / cols, 1 - (j + 0.5) / rows).out;
        ctx.fillStyle = v > 0.5 ? `rgba(97,244,192,${0.06 + (v - 0.5) * 0.22})` : `rgba(255,122,168,${0.06 + (0.5 - v) * 0.22})`;
        ctx.fillRect(left + i * cw, top + j * ch, cw + 0.5, ch + 0.5);
      }
    }
    ctx.strokeStyle = "rgba(220,215,255,0.25)";
    ctx.strokeRect(left, top, size, size);
    for (const p of points) {
      ctx.fillStyle = p.label ? "#61f4c0" : "#ff7aa8";
      ctx.beginPath(); ctx.arc(X(p.x), Y(p.y), 2.2, 0, Math.PI * 2); ctx.fill();
    }
    // rede à direita
    const nx = 282;
    const layers = [2, HID, HID, 1];
    const xs = [nx, nx + 30, nx + 60, nx + 88];
    layers.forEach((count, li) => {
      for (let i = 0; i < count; i++) {
        const yy = top + 30 + (i + 0.5) * (size - 60) / count;
        ctx.fillStyle = li === 0 ? "#6bd5ff" : li === 3 ? "#ffc857" : "rgba(180,140,255,0.75)";
        ctx.beginPath(); ctx.arc(xs[li], yy, count > 8 ? 2 : 3.4, 0, Math.PI * 2); ctx.fill();
      }
    });
    ctx.fillStyle = "rgba(220,215,255,0.5)";
    ctx.font = "9px ui-monospace, monospace";
    ctx.fillText("x,y", nx - 6, top + 14);
    ctx.fillText("camadas", nx + 26, top + 14);
    ctx.fillText("saída", nx + 79, top + 14);
    info.textContent = `época ${epoch} · acerto ${(acc * 100).toFixed(0)}%`;
  }
  function train() {
    if (running) {
      running = false;
      if (timer) clearInterval(timer);
      timer = null;
      btn.textContent = "treinar";
      return;
    }
    running = true;
    btn.textContent = "pausar";
    timer = setInterval(() => {
      for (let i = 0; i < 4; i++) trainEpoch();
      draw();
      if (epoch > 400) { clearInterval(timer); timer = null; running = false; btn.textContent = "treinar"; }
    }, 50);
  }
  btn.addEventListener("click", train);
  el.querySelector("#neural-new").addEventListener("click", () => {
    if (timer) { clearInterval(timer); timer = null; running = false; btn.textContent = "treinar"; }
    makeData(); draw(); api.audio.blip();
  });
  makeData();
  draw();
  return () => { if (timer) clearInterval(timer); };
}

/* ---------------- tokens e predição ---------------- */
function mountLanguage(el, api) {
  const CORPUS = [
    "o mundo de song é um arquipélago jogável",
    "cada estação é uma página e um instrumento",
    "a música é matemática e o som é ar mexendo",
    "a inteligência artificial aprende com dados",
    "o modelo prevê o próximo token do texto",
    "o texto vira uma sequência de tokens",
    "a rede neural ajusta os pesos com o erro",
    "dados ruins produzem confiança boa",
    "a ciência é uma conversa com o mundo",
    "o mapa tem ilhas pontes e caminhos",
    "a matemática aparece no ritmo e na harmonia",
  ];
  const tokenize = (text) => (text.toLowerCase().match(/[a-záàâãéêíóôõúç0-9]+|[.,!?]/g) || []);
  const uni = new Map();
  const bi = new Map();
  for (const text of CORPUS) {
    const ts = tokenize(text);
    for (const t of ts) uni.set(t, (uni.get(t) || 0) + 1);
    for (let i = 0; i < ts.length - 1; i++) {
      if (!bi.has(ts[i])) bi.set(ts[i], new Map());
      const m = bi.get(ts[i]);
      m.set(ts[i + 1], (m.get(ts[i + 1]) || 0) + 1);
    }
  }
  el.innerHTML = `
    <div class="widget">
      <div class="widget-head">
        <span class="widget-label">fonte das palavras</span>
        <span class="widget-hint">tokens e probabilidades</span>
      </div>
      <label class="token-label" for="lang-input">texto</label>
      <input id="lang-input" class="token-input" value="o mundo de song é" maxlength="120">
      <div class="token-chips" id="lang-tokens"></div>
      <div class="prob-list" id="lang-probs"></div>
      <p class="widget-note">Este modelo é um brinquedo: olha só o token anterior e conta o que veio depois no corpus. Um modelo de linguagem grande faz algo parecido em escala enorme, com vetores e atenção. Em ambos os casos, a saída é uma aposta, não uma consulta à verdade.</p>
    </div>
  `;
  const input = el.querySelector("#lang-input");
  const chips = el.querySelector("#lang-tokens");
  const probs = el.querySelector("#lang-probs");
  function render() {
    const ts = tokenize(input.value);
    chips.innerHTML = ts.map((t) => `<span class="token-chip">${t.replace(/</g, "&lt;")}</span>`).join("");
    const last = ts[ts.length - 1];
    let source = bi.get(last);
    let label = `depois de "${last || "?"}"`;
    if (!source) { source = uni; label = "sem contexto, frequência geral"; }
    const total = [...source.values()].reduce((a, b) => a + b, 0) || 1;
    const rows = [...source.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6);
    probs.innerHTML = `<p class="prob-label">próximo token · ${label}</p>` + rows.map(([t, c]) => {
      const p = c / total;
      return `<div class="prob-row"><span>${t.replace(/</g, "&lt;")}</span><i><b style="width:${(p * 100).toFixed(1)}%"></b></i><em>${(p * 100).toFixed(1)}%</em></div>`;
    }).join("");
  }
  input.addEventListener("input", render);
  render();
  return () => {};
}

/* ---------------- visão / convolução ---------------- */
function mountVision(el, api) {
  const KERNELS = {
    borda: { name: "borda", k: [-1, -1, -1, -1, 8, -1, -1, -1, -1] },
    desfoque: { name: "desfoque", k: [1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9] },
    nitidez: { name: "nitidez", k: [0, -1, 0, -1, 5, -1, 0, -1, 0] },
    relevo: { name: "relevo", k: [-2, -1, 0, -1, 1, 1, 0, 1, 2] },
  };
  let kernel = "borda";
  let imageIndex = 0;
  const S = 40;
  const src = document.createElement("canvas");
  src.width = S; src.height = S;
  const sctx = src.getContext("2d");
  const out = document.createElement("canvas");
  out.width = S; out.height = S;
  const octx = out.getContext("2d");

  function makeImage() {
    sctx.fillStyle = "#0a1020";
    sctx.fillRect(0, 0, S, S);
    imageIndex++;
    if (imageIndex % 4 === 1) {
      sctx.fillStyle = "#6bd5ff";
      sctx.beginPath(); sctx.arc(20, 20, 12, 0, Math.PI * 2); sctx.fill();
      sctx.fillStyle = "#0a1020";
      sctx.beginPath(); sctx.arc(15, 17, 2, 0, Math.PI * 2); sctx.fill();
      sctx.beginPath(); sctx.arc(25, 17, 2, 0, Math.PI * 2); sctx.fill();
      sctx.fillRect(15, 25, 10, 2);
    } else if (imageIndex % 4 === 2) {
      sctx.fillStyle = "#ffb26b";
      sctx.beginPath(); sctx.moveTo(20, 6); sctx.lineTo(35, 34); sctx.lineTo(5, 34); sctx.closePath(); sctx.fill();
    } else if (imageIndex % 4 === 3) {
      for (let i = 0; i < S; i += 8) {
        sctx.fillStyle = i % 16 ? "#b48cff" : "#0a1020";
        sctx.fillRect(i, 0, 4, S);
      }
    } else {
      const g = sctx.createLinearGradient(0, 0, S, S);
      g.addColorStop(0, "#61f4c0");
      g.addColorStop(1, "#0a1020");
      sctx.fillStyle = g;
      sctx.fillRect(0, 0, S, S);
      sctx.fillStyle = "#ff7aa8";
      sctx.beginPath(); sctx.arc(20, 20, 8, 0, Math.PI * 2); sctx.fill();
    }
  }
  function convolve() {
    const data = sctx.getImageData(0, 0, S, S);
    const od = octx.createImageData(S, S);
    const k = KERNELS[kernel].k;
    for (let y = 0; y < S; y++) {
      for (let x = 0; x < S; x++) {
        let r = 0, g = 0, b = 0;
        for (let ky = -1; ky <= 1; ky++) {
          for (let kx = -1; kx <= 1; kx++) {
            const px = Math.min(S - 1, Math.max(0, x + kx));
            const py = Math.min(S - 1, Math.max(0, y + ky));
            const i = (py * S + px) * 4;
            const w = k[(ky + 1) * 3 + (kx + 1)];
            r += data.data[i] * w;
            g += data.data[i + 1] * w;
            b += data.data[i + 2] * w;
          }
        }
        const o = (y * S + x) * 4;
        od.data[o] = Math.max(0, Math.min(255, r));
        od.data[o + 1] = Math.max(0, Math.min(255, g));
        od.data[o + 2] = Math.max(0, Math.min(255, b));
        od.data[o + 3] = 255;
      }
    }
    octx.putImageData(od, 0, 0);
  }
  el.innerHTML = `
    <div class="widget">
      <div class="widget-head">
        <span class="widget-label">olho da máquina</span>
        <span class="widget-hint">um filtro de cada vez</span>
      </div>
      <div class="w-tabs">
        ${Object.entries(KERNELS).map(([key, v]) => `<button type="button" class="w-tab" data-k="${key}" aria-selected="${key === kernel}">${v.name}</button>`).join("")}
      </div>
      <div class="widget-canvas-wrap"><canvas id="vision-canvas" width="380" height="210"></canvas></div>
      <div class="w-row">
        <button type="button" class="w-btn" id="vision-new">outra imagem</button>
        <span class="ai-readout" id="vision-info"></span>
      </div>
      <p class="widget-note">A imagem original é uma grade de pixels. O filtro 3 por 3 desliza por ela e produz uma nova grade. Bordas, desfoque e relevo são pesos diferentes no mesmo gesto. Redes de visão profundas empilham muitos desses filtros.</p>
    </div>
  `;
  const canvas = el.querySelector("#vision-canvas");
  const ctx = canvas.getContext("2d");
  const info = el.querySelector("#vision-info");
  function draw() {
    convolve();
    ctx.fillStyle = "#05070f";
    ctx.fillRect(0, 0, 380, 210);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(src, 26, 28, 150, 150);
    ctx.drawImage(out, 204, 28, 150, 150);
    ctx.strokeStyle = "rgba(180,140,255,0.25)";
    ctx.strokeRect(26, 28, 150, 150);
    ctx.strokeRect(204, 28, 150, 150);
    ctx.fillStyle = "rgba(220,215,255,0.6)";
    ctx.font = "10px ui-monospace, monospace";
    ctx.fillText("entrada", 26, 18);
    ctx.fillText(`saída · ${KERNELS[kernel].name}`, 204, 18);
    info.textContent = `kernel 3×3 · ${KERNELS[kernel].k.map((v) => Number(v.toFixed(2))).join(" ")}`;
  }
  for (const b of el.querySelectorAll("[data-k]")) {
    b.addEventListener("click", () => {
      kernel = b.dataset.k;
      for (const o of el.querySelectorAll("[data-k]")) o.setAttribute("aria-selected", String(o === b));
      draw(); api.audio.blip();
    });
  }
  el.querySelector("#vision-new").addEventListener("click", () => { makeImage(); draw(); api.audio.blip(); });
  makeImage();
  draw();
  return () => {};
}

/* ---------------- ética ---------------- */
function mountEthics(el, api) {
  const QUIZ = [
    {
      q: "Um sistema de contratação aprende com currículos antigos e passa a rejeitar mais um grupo. Onde começa o problema?",
      options: ["No algoritmo, que é malvado.", "Nos dados históricos e no objetivo escolhido.", "No candidato, que não se encaixa."],
      answer: 1,
      why: "O modelo aprende o padrão dos dados. Se o histórico já era enviesado, a máquina amplifica o viés com aparência de neutralidade. A escolha do objetivo e da métrica é humana.",
    },
    {
      q: "Um modelo de linguagem inventa uma lei que não existe, com citação e tudo. O que aconteceu?",
      options: ["Ele consultou uma fonte errada.", "Ele gerou uma continuação plausível, não uma verdade verificada.", "Ele quis enganar."],
      answer: 1,
      why: "Modelos de linguagem otimizam a probabilidade do próximo token, não a verdade. Uma citação inventada pode ser mais provável, no padrão aprendido, do que um 'não sei'.",
    },
    {
      q: "Um feed otimiza tempo de tela e as pessoas ficam mais tempo, mas também mais ansiosas. O problema está em qual escolha?",
      options: ["Na interface.", "No objetivo e na métrica.", "Na velocidade do servidor."],
      answer: 1,
      why: "Se a métrica é tempo de tela, o sistema fica excelente em produzir tempo de tela. Ansiedade não entra na conta. Métrica é uma decisão de valor, não um detalhe técnico.",
    },
    {
      q: "Um serviço treina com conversas privadas sem consentimento. Qual é a pergunta certa antes de treinar?",
      options: ["O modelo fica mais preciso?", "As pessoas autorizaram o uso e entendem o alcance?", "A conta de energia fecha?"],
      answer: 1,
      why: "Precisão não substitui consentimento. Proveniência, privacidade e o que acontece com os dados são parte do desenho, junto com o custo energético e o trabalho humano invisível.",
    },
  ];
  let i = 0, score = 0, answered = false;
  el.innerHTML = `
    <div class="widget">
      <div class="widget-head">
        <span class="widget-label">sala do juízo</span>
        <span class="widget-hint">quatro decisões humanas</span>
      </div>
      <div class="quiz">
        <div class="quiz-top"><span id="eth-count"></span><span id="eth-score"></span></div>
        <p class="quiz-question" id="eth-q"></p>
        <div class="quiz-options" id="eth-options"></div>
        <div class="quiz-feedback" id="eth-feedback" hidden></div>
        <div class="w-row"><button type="button" class="w-btn" id="eth-next" hidden></button></div>
      </div>
      <p class="widget-note">Não existe resposta técnica para "qual é o objetivo certo". Existe decisão, documentação e responsabilidade. A IA não assina embaixo; alguém assina.</p>
    </div>
  `;
  const count = el.querySelector("#eth-count");
  const scoreEl = el.querySelector("#eth-score");
  const qEl = el.querySelector("#eth-q");
  const opts = el.querySelector("#eth-options");
  const fb = el.querySelector("#eth-feedback");
  const next = el.querySelector("#eth-next");
  function advance() {
    if (i < QUIZ.length - 1) { i++; render(); return; }
    qEl.textContent = `Fim. Você acertou ${score} de ${QUIZ.length}.`;
    opts.textContent = ""; fb.hidden = true; next.hidden = false;
    next.textContent = "jogar de novo";
    next.onclick = () => { i = 0; score = 0; render(); };
  }
  function render() {
    answered = false;
    const q = QUIZ[i];
    count.textContent = `caso ${i + 1} de ${QUIZ.length}`;
    scoreEl.textContent = `acertos: ${score}`;
    qEl.textContent = q.q;
    opts.textContent = ""; fb.hidden = true; next.hidden = true;
    next.onclick = advance;
    q.options.forEach((text, idx) => {
      const b = document.createElement("button");
      b.type = "button"; b.className = "quiz-option"; b.textContent = text;
      b.addEventListener("click", () => {
        if (answered) return;
        answered = true;
        const correct = idx === q.answer;
        if (correct) score++;
        for (const [k, o] of [...opts.children].entries()) {
          o.disabled = true;
          if (k === q.answer) o.classList.add("right");
          else if (k === idx) o.classList.add("wrong");
        }
        fb.hidden = false;
        fb.innerHTML = `<b>${correct ? "certo." : "quase."}</b> ${q.why}`;
        scoreEl.textContent = `acertos: ${score}`;
        next.hidden = false;
        next.textContent = i === QUIZ.length - 1 ? "ver resultado" : "próximo caso";
        api.audio[correct ? "blip" : "error"]();
      });
      opts.appendChild(b);
    });
  }
  render();
  return () => {};
}

// Música: ritmo, razões, temperamento, timbre e composição generativa.

function ctxOf(api) {
  return api.audio.isEnabled() ? api.audio.ctx : null;
}
function tone(api, freq, { dur = 0.3, type = "sine", vol = 0.12, when = 0 } = {}) {
  const ctx = ctxOf(api);
  if (!ctx) return;
  const t = ctx.currentTime + when;
  const o = ctx.createOscillator();
  o.type = type;
  o.frequency.value = freq;
  const g = ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.linearRampToValueAtTime(vol, t + 0.008);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(api.audio.output);
  o.start(t); o.stop(t + dur + 0.03);
}
function playPartials(api, base, weights, dur = 0.9) {
  weights.forEach((w, i) => {
    if (w > 0.01) tone(api, base * (i + 1), { dur, type: "sine", vol: 0.035 + w * 0.12 });
  });
}
function playPair(api, f1, f2, dur = 1.1) {
  tone(api, f1, { dur, type: "sine", vol: 0.1 });
  tone(api, f2, { dur, type: "sine", vol: 0.1 });
}

export async function mount(el, api, variant) {
  if (variant === "rhythm") return mountRhythm(el, api);
  if (variant === "harmony") return mountHarmony(el, api);
  if (variant === "scales") return mountScales(el, api);
  if (variant === "timbre") return mountTimbre(el, api);
  if (variant === "generative") return mountGenerative(el, api);
  el.innerHTML = '<p class="widget-fail">Instrumento de Música desconhecido.</p>';
  return () => {};
}

/* ---------------- polirritmia ---------------- */
function mountRhythm(el, api) {
  const W = 380, H = 220;
  let playing = false;
  let phase = 0;
  let lastPhase = 0;
  let bpm = 96;
  let raf = 0, last = 0;
  const active = new Set([3, 4]);
  const colors = { 3: "#ffb26b", 4: "#6bd5ff", 5: "#b48cff" };
  const freqs = { 3: 277.18, 4: 369.99, 5: 493.88 };

  el.innerHTML = `
    <div class="widget">
      <div class="widget-head">
        <span class="widget-label">relógio dos ritmos</span>
        <span class="widget-hint">quantas subdivisões cabem no mesmo tempo?</span>
      </div>
      <div class="widget-canvas-wrap"><canvas id="rhythm-canvas" width="380" height="220"></canvas></div>
      <div class="w-row">
        <button type="button" class="w-btn" id="rhythm-play">tocar</button>
        <button type="button" class="w-btn" id="rhythm-3">3</button>
        <button type="button" class="w-btn" id="rhythm-4">4</button>
        <button type="button" class="w-btn" id="rhythm-5">5</button>
        <label for="rhythm-bpm">bpm</label>
        <input id="rhythm-bpm" class="w-range" type="range" min="60" max="150" step="1" value="96">
        <b id="rhythm-bpm-label" style="font-family:var(--mono);color:var(--amber)">96</b>
      </div>
      <p class="rhythmic-note" id="rhythm-info"></p>
      <p class="widget-note">Três contra quatro é o clássico da polirritmia. Cada ciclo de três e cada ciclo de quatro divide o mesmo compasso; os encontros acontecem nos múltiplos comuns. Com 3, 4 e 5 juntos, o mínimo múltiplo comum é 60, mas o ouvido sente antes de contar.</p>
    </div>
  `;
  const canvas = el.querySelector("#rhythm-canvas");
  const ctx = canvas.getContext("2d");
  const playBtn = el.querySelector("#rhythm-play");
  const info = el.querySelector("#rhythm-info");
  const bpmLabel = el.querySelector("#rhythm-bpm-label");

  function lcm(a, b) { return a * b / (function g(x, y) { return y ? g(y, x % y) : x; })(a, b); }
  function lcmAll() { return [...active].reduce((a, b) => lcm(a, b), 1); }
  function updateInfo() {
    info.textContent = `${[...active].join(" contra ")} · encontro a cada ${lcmAll()} pulsos`;
  }
  function draw() {
    ctx.fillStyle = "#05070f";
    ctx.fillRect(0, 0, W, H);
    const left = 56, right = 18, top = 26, rowH = 44;
    const width = W - left - right;
    ctx.font = "10px ui-monospace, monospace";
    for (const n of [3, 4, 5]) {
      const y = top + (n - 3) * rowH;
      const on = active.has(n);
      ctx.fillStyle = on ? colors[n] : "rgba(220,215,255,0.2)";
      ctx.fillText(`${n}`, 22, y + 5);
      ctx.strokeStyle = on ? "rgba(220,215,255,0.15)" : "rgba(220,215,255,0.05)";
      ctx.beginPath(); ctx.moveTo(left - 8, y); ctx.lineTo(left + width, y); ctx.stroke();
      for (let i = 0; i < n; i++) {
        const x = left + (i / n) * width;
        ctx.fillStyle = on ? colors[n] : "rgba(220,215,255,0.15)";
        ctx.fillRect(x - 1, y - 6, 2, 6);
      }
      const hits = Math.floor(phase * n);
      if (on) {
        const x = left + (hits / n) * width;
        ctx.fillRect(x - 1, y - 18, 3, 18);
      }
    }
    // playhead
    const px = left + phase * width;
    ctx.fillStyle = "rgba(255,255,255,0.6)";
    ctx.fillRect(px, top - 12, 1, rowH * 3);
    ctx.fillStyle = "rgba(220,215,255,0.35)";
    ctx.fillText("um compasso", left, H - 12);
  }
  function trigger() {
    for (const n of [3, 4, 5]) {
      if (!active.has(n)) continue;
      for (let i = 0; i < n; i++) {
        const t = i / n;
        if (t > lastPhase && t <= phase) {
          tone(api, freqs[n], { dur: 0.07, type: "triangle", vol: 0.09 });
        }
      }
    }
  }
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    if (playing) {
      lastPhase = phase;
      phase += dt / (4 * 60 / bpm);
      if (phase >= 1) { phase -= 1; lastPhase = -0.001; }
      trigger();
    }
    draw();
  }
  for (const n of [3, 4, 5]) {
    const b = el.querySelector(`#rhythm-${n}`);
    b.classList.toggle("on", active.has(n));
    b.addEventListener("click", () => {
      if (active.has(n)) { if (active.size > 1) active.delete(n); }
      else active.add(n);
      b.classList.toggle("on", active.has(n));
      updateInfo();
      api.audio.blip();
    });
  }
  playBtn.addEventListener("click", () => {
    playing = !playing;
    if (playing) api.enableSound();
    playBtn.textContent = playing ? "parar" : "tocar";
    playBtn.classList.toggle("on", playing);
    lastPhase = -0.001;
    if (playing) { phase = 0; last = 0; }
    api.audio.open();
  });
  el.querySelector("#rhythm-bpm").addEventListener("input", (e) => { bpm = Number(e.target.value); bpmLabel.textContent = bpm; });
  updateInfo();
  draw();
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}

/* ---------------- intervalos ---------------- */
function mountHarmony(el, api) {
  const INTERVALS = [
    { name: "oitava", n: 2, d: 1 },
    { name: "quinta", n: 3, d: 2 },
    { name: "quarta", n: 4, d: 3 },
    { name: "terça maior", n: 5, d: 4 },
    { name: "terça menor", n: 6, d: 5 },
    { name: "segunda maior", n: 9, d: 8 },
    { name: "trítono", n: 45, d: 32 },
  ];
  let selected = 1;
  let detune = 0;
  const base = 220;
  el.innerHTML = `
    <div class="widget">
      <div class="widget-head">
        <span class="widget-label">círculo das razões</span>
        <span class="widget-hint">consonância é proporção</span>
      </div>
      <div class="w-tabs" id="harm-tabs">
        ${INTERVALS.map((it, i) => `<button type="button" class="w-tab" data-i="${i}" aria-selected="${i === 1}">${it.name}</button>`).join("")}
      </div>
      <div class="widget-canvas-wrap"><canvas id="harm-canvas" width="380" height="190"></canvas></div>
      <div class="w-row">
        <button type="button" class="w-btn" id="harm-play">tocar as duas</button>
        <label for="harm-detune">desafinação</label>
        <input id="harm-detune" class="w-range" type="range" min="-50" max="50" step="1" value="0">
        <b id="harm-detune-label" style="font-family:var(--mono);color:var(--amber)">0 cents</b>
      </div>
      <div class="harm-readout" id="harm-info"></div>
      <p class="widget-note">Razões pequenas alinham os ciclos das ondas e soam estáveis. Desafine uma das notas em poucos cents e o batimento aparece: a aspereza é a diferença entre as frequências, não um defeito do ouvido.</p>
    </div>
  `;
  const canvas = el.querySelector("#harm-canvas");
  const ctx = canvas.getContext("2d");
  const info = el.querySelector("#harm-info");
  const detuneIn = el.querySelector("#harm-detune");
  const detuneLabel = el.querySelector("#harm-detune-label");
  let raf = 0, t0 = 0;

  function secondFreq() {
    const it = INTERVALS[selected];
    const f = base * it.n / it.d;
    return f * Math.pow(2, detune / 1200);
  }
  function cents() {
    const it = INTERVALS[selected];
    return 1200 * Math.log2(it.n / it.d) + detune;
  }
  function draw(now) {
    ctx.fillStyle = "#05070f";
    ctx.fillRect(0, 0, 380, 190);
    const f1 = base, f2 = secondFreq();
    const phase = now * 0.003;
    for (let i = 0; i < 2; i++) {
      ctx.strokeStyle = i ? "rgba(255,178,107,0.7)" : "rgba(107,213,255,0.7)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      for (let x = 0; x <= 360; x += 2) {
        const y = 90 + Math.sin((x / 360) * Math.PI * 4 * (i ? f2 / f1 : 1) + phase * (i ? 1.7 : 1)) * 28;
        if (x === 0) ctx.moveTo(10 + x, y); else ctx.lineTo(10 + x, y);
      }
      ctx.stroke();
    }
    // soma
    ctx.strokeStyle = "rgba(255,255,255,0.35)";
    ctx.beginPath();
    for (let x = 0; x <= 360; x += 2) {
      const y = 90 + (Math.sin((x / 360) * Math.PI * 4 + phase) + Math.sin((x / 360) * Math.PI * 4 * (f2 / f1) + phase * 1.7)) * 14;
      if (x === 0) ctx.moveTo(10 + x, y); else ctx.lineTo(10 + x, y);
    }
    ctx.stroke();
    ctx.fillStyle = "rgba(220,215,255,0.5)";
    ctx.font = "10px ui-monospace, monospace";
    ctx.fillText("duas ondas e a soma", 12, 16);
  }
  function update() {
    const it = INTERVALS[selected];
    const f2 = secondFreq();
    info.innerHTML = `razão <b>${it.n}:${it.d}</b> · ${base.toFixed(1)} Hz e ${f2.toFixed(1)} Hz · <b>${cents().toFixed(1)} cents</b> · batimento ${Math.abs(f2 - base).toFixed(1)} Hz`;
  }
  function loop(now) {
    raf = requestAnimationFrame(loop);
    draw(now);
  }
  for (const b of el.querySelectorAll("#harm-tabs [data-i]")) {
    b.addEventListener("click", () => {
      selected = Number(b.dataset.i);
      for (const o of el.querySelectorAll("#harm-tabs [data-i]")) o.setAttribute("aria-selected", String(o === b));
      update(); api.audio.blip();
    });
  }
  el.querySelector("#harm-play").addEventListener("click", () => {
    api.enableSound();
    const f2 = secondFreq();
    playPair(api, base, f2, 1.4);
    update();
  });
  detuneIn.addEventListener("input", () => {
    detune = Number(detuneIn.value);
    detuneLabel.textContent = `${detune} cents`;
    update();
  });
  update();
  raf = requestAnimationFrame(loop);
  return () => cancelAnimationFrame(raf);
}

/* ---------------- escalas ---------------- */
function mountScales(el, api) {
  const NAMES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B", "C"];
  const JUST = [1, 16 / 15, 9 / 8, 6 / 5, 5 / 4, 4 / 3, 45 / 32, 3 / 2, 8 / 5, 5 / 3, 9 / 5, 15 / 8, 2];
  const root = 261.63;
  let mode = "equal";
  let selected = 0;
  el.innerHTML = `
    <div class="widget">
      <div class="widget-head">
        <span class="widget-label">escada das escalas</span>
        <span class="widget-hint">doze passos, duas negociações</span>
      </div>
      <div class="w-tabs">
        <button type="button" class="w-tab" data-mode="equal" aria-selected="true">temperamento igual</button>
        <button type="button" class="w-tab" data-mode="just" aria-selected="false">entonação justa</button>
      </div>
      <div class="piano" id="piano"></div>
      <div class="scale-readout" id="scale-info"></div>
      <div class="scale-cents" id="scale-cents"></div>
      <p class="widget-note">No temperamento igual, cada semitom tem a mesma razão de 2^(1/12). Na entonação justa, as razões são frações simples, mas nem toda transposição soa igual. A diferença em cents mostra onde cada sistema esconde a comma.</p>
    </div>
  `;
  const piano = el.querySelector("#piano");
  const info = el.querySelector("#scale-info");
  const centsEl = el.querySelector("#scale-cents");
  function freq(n) {
    if (mode === "equal") return root * Math.pow(2, n / 12);
    return root * JUST[n];
  }
  function render() {
    piano.textContent = "";
    const black = new Set([1, 3, 6, 8, 10]);
    for (let n = 0; n < 12; n++) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "key" + (black.has(n) ? " black" : "") + (n === selected ? " on" : "");
      b.innerHTML = `<span>${NAMES[n]}</span>`;
      b.addEventListener("click", () => {
        selected = n;
        api.enableSound();
        tone(api, freq(n), { dur: 0.5, type: mode === "equal" ? "triangle" : "sine", vol: 0.13 });
        render(); updateInfo();
      });
      piano.appendChild(b);
    }
    centsEl.innerHTML = NAMES.slice(0, 12).map((name, n) => {
      const d = 1200 * Math.log2(freq(n) / (root * Math.pow(2, n / 12)));
      return `<span><b>${name}</b>${d >= 0 ? "+" : ""}${d.toFixed(1)}¢</span>`;
    }).join("");
  }
  function updateInfo() {
    const f = freq(selected);
    const eq = root * Math.pow(2, selected / 12);
    const d = 1200 * Math.log2(f / eq);
    info.innerHTML = `${NAMES[selected]} · <b>${f.toFixed(2)} Hz</b> · ${d >= 0 ? "+" : ""}${d.toFixed(1)} cents em relação ao temperamento igual`;
  }
  for (const b of el.querySelectorAll("[data-mode]")) {
    b.addEventListener("click", () => {
      mode = b.dataset.mode;
      for (const o of el.querySelectorAll("[data-mode]")) o.setAttribute("aria-selected", String(o === b));
      render(); updateInfo(); api.audio.blip();
    });
  }
  render(); updateInfo();
  return () => {};
}

/* ---------------- timbre ---------------- */
function mountTimbre(el, api) {
  let weights = [1, 0.5, 0.2, 0.1, 0.05, 0.02];
  const PRESETS = {
    flauta: [1, 0.08, 0.03, 0.01, 0, 0],
    clarinete: [1, 0, 0.55, 0, 0.3, 0, 0.18],
    violino: [1, 0.7, 0.5, 0.35, 0.28, 0.22],
    órgão: [1, 0.8, 0.6, 0.5, 0.4, 0.3],
  };
  el.innerHTML = `
    <div class="widget">
      <div class="widget-head">
        <span class="widget-label">oficina dos timbres</span>
        <span class="widget-hint">a receita de harmônicos</span>
      </div>
      <div class="widget-canvas-wrap"><canvas id="timbre-canvas" width="380" height="170"></canvas></div>
      <div class="timbre-sliders" id="timbre-sliders"></div>
      <div class="w-row">
        <button type="button" class="w-btn" id="timbre-play">tocar o dó</button>
        ${Object.keys(PRESETS).map((k) => `<button type="button" class="w-btn" data-preset="${k}">${k}</button>`).join("")}
      </div>
      <p class="widget-note">A frequência fundamental é sempre a mesma. O que muda é a mistura de harmônicos. Desligue todos menos o primeiro e você ouve uma flauta; ligue os ímpares e aparece um clarinete; empilhe todos e o som fica brilhante.</p>
    </div>
  `;
  const canvas = el.querySelector("#timbre-canvas");
  const ctx = canvas.getContext("2d");
  const slidersEl = el.querySelector("#timbre-sliders");
  const sliders = [];
  for (let i = 0; i < 6; i++) {
    const wrap = document.createElement("label");
    wrap.className = "timbre-slider";
    wrap.innerHTML = `<span>${i + 1}×</span>`;
    const input = document.createElement("input");
    input.type = "range"; input.min = "0"; input.max = "100"; input.value = String(weights[i] * 100);
    input.className = "w-range";
    input.addEventListener("input", () => {
      weights[i] = Number(input.value) / 100;
      draw();
    });
    wrap.appendChild(input);
    slidersEl.appendChild(wrap);
    sliders.push(input);
  }
  function draw() {
    ctx.fillStyle = "#05070f";
    ctx.fillRect(0, 0, 380, 170);
    const sum = weights.reduce((a, b) => a + b, 0) || 1;
    ctx.strokeStyle = "#ffb26b";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    for (let x = 0; x <= 360; x += 2) {
      let y = 0;
      for (let h = 0; h < 6; h++) y += weights[h] * Math.sin((x / 360) * Math.PI * 4 * (h + 1));
      y = 85 + (y / sum) * 55;
      if (x === 0) ctx.moveTo(10 + x, y); else ctx.lineTo(10 + x, y);
    }
    ctx.stroke();
    // barras dos harmônicos
    for (let h = 0; h < 6; h++) {
      const bh = weights[h] * 60;
      ctx.fillStyle = `rgba(107,213,255,${0.3 + weights[h] * 0.6})`;
      ctx.fillRect(20 + h * 58, 155 - bh, 12, bh);
      ctx.fillStyle = "rgba(220,215,255,0.4)";
      ctx.font = "9px ui-monospace, monospace";
      ctx.fillText(`${h + 1}`, 24 + h * 58, 167);
    }
    ctx.fillStyle = "rgba(220,215,255,0.45)";
    ctx.fillText("onda resultante", 12, 16);
  }
  for (const b of el.querySelectorAll("[data-preset]")) {
    b.addEventListener("click", () => {
      const p = PRESETS[b.dataset.preset];
      weights = weights.map((_, i) => p[i] || 0);
      sliders.forEach((s, i) => { s.value = String(weights[i] * 100); });
      draw(); api.audio.blip();
    });
  }
  el.querySelector("#timbre-play").addEventListener("click", () => {
    api.enableSound();
    playPartials(api, 261.63, weights, 1.1);
  });
  draw();
  return () => {};
}

/* ---------------- música generativa ---------------- */
function mountGenerative(el, api) {
  const SCALE = [261.63, 293.66, 329.63, 392.0, 440.0];
  const NAMES = ["C", "D", "E", "G", "A"];
  const W = 380, H = 220;
  const TRANS = [
    [0.10, 0.45, 0.25, 0.15, 0.05],
    [0.20, 0.10, 0.40, 0.20, 0.10],
    [0.15, 0.25, 0.10, 0.35, 0.15],
    [0.10, 0.20, 0.30, 0.10, 0.30],
    [0.20, 0.15, 0.25, 0.30, 0.10],
  ];
  let sequence = [];
  let seed = 7;
  let playing = false;
  let playIndex = -1;
  let timer = null;
  let bpm = 110;
  el.innerHTML = `
    <div class="widget">
      <div class="widget-head">
        <span class="widget-label">máquina de compor</span>
        <span class="widget-hint">regras simples, resultado surpreendente</span>
      </div>
      <div class="widget-canvas-wrap"><canvas id="gen-canvas" width="380" height="220"></canvas></div>
      <div class="w-row">
        <button type="button" class="w-btn" id="gen-new">gerar</button>
        <button type="button" class="w-btn" id="gen-play">tocar</button>
        <label for="gen-bpm">bpm</label>
        <input id="gen-bpm" class="w-range" type="range" min="70" max="160" step="1" value="110">
        <b id="gen-bpm-label" style="font-family:var(--mono);color:var(--amber)">110</b>
        <span class="widget-hint" id="gen-seed"></span>
      </div>
      <p class="widget-note">A tabela de transição decide a próxima nota a partir da atual. Não há plano global: há probabilidade local. Mude a semente e a melodia muda, mas o estilo continua. É o mesmo truque de um gerador de texto, em escala de brinquedo.</p>
    </div>
  `;
  const canvas = el.querySelector("#gen-canvas");
  const ctx = canvas.getContext("2d");
  const seedEl = el.querySelector("#gen-seed");
  const bpmLabel = el.querySelector("#gen-bpm-label");

  function rand() {
    seed = (seed * 1664525 + 1013904223) % 4294967296;
    return seed / 4294967296;
  }
  function generate() {
    sequence = [];
    let cur = Math.floor(rand() * 5);
    for (let i = 0; i < 16; i++) {
      sequence.push(cur);
      const r = rand();
      let acc = 0, next = 0;
      for (let j = 0; j < 5; j++) { acc += TRANS[cur][j]; if (r <= acc) { next = j; break; } }
      cur = next;
    }
    playIndex = -1;
    seedEl.textContent = `semente ${seed}`;
    draw();
  }
  function draw() {
    ctx.fillStyle = "#05070f";
    ctx.fillRect(0, 0, W, H);
    const left = 30, right = 14, top = 18, bottom = 28;
    const cw = (W - left - right) / 16;
    const rh = (H - top - bottom) / 5;
    for (let n = 0; n < 5; n++) {
      ctx.fillStyle = "rgba(220,215,255,0.4)";
      ctx.font = "10px ui-monospace, monospace";
      ctx.fillText(NAMES[n], 8, top + (4 - n) * rh + rh / 2 + 3);
    }
    for (let i = 0; i < 16; i++) {
      for (let n = 0; n < 5; n++) {
        const x = left + i * cw, y = top + (4 - n) * rh;
        ctx.strokeStyle = "rgba(180,140,255,0.1)";
        ctx.strokeRect(x + 1, y + 1, cw - 2, rh - 2);
      }
      if (sequence[i] !== undefined) {
        const n = sequence[i];
        const x = left + i * cw, y = top + (4 - n) * rh;
        ctx.fillStyle = i === playIndex ? "#ffb26b" : "rgba(180,140,255,0.75)";
        ctx.fillRect(x + 3, y + 3, cw - 6, rh - 6);
      }
    }
    // matriz de transição num canto reservado
    ctx.fillStyle = "rgba(8,12,24,0.92)";
    ctx.fillRect(W - 132, H - 66, 126, 56);
    ctx.strokeStyle = "rgba(172,142,255,0.25)";
    ctx.strokeRect(W - 132, H - 66, 126, 56);
    ctx.fillStyle = "rgba(220,215,255,0.5)";
    ctx.font = "9px ui-monospace, monospace";
    ctx.fillText("matriz de transição", W - 126, H - 52);
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        ctx.fillStyle = `rgba(${Math.round(200 - TRANS[i][j] * 120)},${Math.round(140 + TRANS[i][j] * 80)},255,${0.25 + TRANS[i][j] * 0.6})`;
        ctx.fillRect(W - 126 + j * 18, H - 44 + i * 8, 14, 5);
      }
    }
  }
  function stop() {
    playing = false;
    if (timer) clearTimeout(timer);
    timer = null;
    playIndex = -1;
    draw();
    el.querySelector("#gen-play").textContent = "tocar";
  }
  function play() {
    if (playing) { stop(); return; }
    api.enableSound();
    if (!sequence.length) generate();
    playing = true;
    el.querySelector("#gen-play").textContent = "parar";
    let i = 0;
    const step = () => {
      if (!playing) return;
      playIndex = i % sequence.length;
      tone(api, SCALE[sequence[playIndex]], { dur: 0.22, type: "triangle", vol: 0.11 });
      draw();
      i++;
      timer = setTimeout(step, 60000 / bpm);
    };
    step();
  }
  el.querySelector("#gen-new").addEventListener("click", () => { stop(); generate(); api.audio.blip(); });
  el.querySelector("#gen-play").addEventListener("click", play);
  el.querySelector("#gen-bpm").addEventListener("input", (e) => { bpm = Number(e.target.value); bpmLabel.textContent = bpm; });
  generate();
  return () => stop();
}

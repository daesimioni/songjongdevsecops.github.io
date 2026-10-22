// Bosque: uma árvore recursiva em p5 e um conjunto de Julia calculado em WASM.

const P5_CDN = "https://cdn.jsdelivr.net/npm/p5@1.11.3/lib/p5.min.js";

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = resolve;
    s.onerror = () => reject(new Error("falha ao carregar " + src));
    document.head.appendChild(s);
  });
}

export async function mount(el, api) {
  el.innerHTML = `
    <div class="widget">
      <div class="widget-head">
        <span class="widget-label">laboratório de formas</span>
        <span class="widget-hint">duas formas de infinito</span>
      </div>
      <div class="w-tabs" role="tablist">
        <button type="button" class="w-tab" role="tab" data-tab="tree" aria-selected="true">árvore</button>
        <button type="button" class="w-tab" role="tab" data-tab="julia" aria-selected="false">conjunto de julia</button>
      </div>

      <div class="w-panel" data-panel="tree">
        <div class="widget-canvas-wrap" id="tree-stage"></div>
        <div class="w-row">
          <label for="f-angle">ângulo</label>
          <input id="f-angle" class="w-range" type="range" min="8" max="55" value="26">
          <label for="f-depth">profundidade</label>
          <input id="f-depth" class="w-range" type="range" min="4" max="11" value="9">
          <label for="f-wind">vento</label>
          <input id="f-wind" class="w-range" type="range" min="0" max="100" value="45">
        </div>
        <p class="widget-note" id="tree-note">A mesma regra aplicada nove vezes vira uma árvore. Diminua a profundidade e veja a receita aparecer.</p>
      </div>

      <div class="w-panel" data-panel="julia" hidden>
        <div class="widget-canvas-wrap"><canvas id="julia-canvas" width="360" height="260"></canvas></div>
        <div class="w-row">
          <label for="j-iters">iterações</label>
          <input id="j-iters" class="w-range" type="range" min="60" max="300" value="180">
          <button type="button" class="w-btn" id="j-random">outro c</button>
        </div>
        <p class="julia-readout" id="j-readout">c = -0.800 + 0.156i</p>
        <p class="widget-note">Mova o mouse sobre a imagem para escolher o parâmetro c. Cada ponto é uma conta repetida até decidir se foge ou fica. Quem calcula é um módulo WebAssembly de 296 bytes.</p>
      </div>
    </div>
  `;

  const tabs = [...el.querySelectorAll("[data-tab]")];
  const panels = [...el.querySelectorAll("[data-panel]")];
  const cleanups = [];
  let tree = null;
  let julia = null;

  function selectTab(name) {
    for (const t of tabs) t.setAttribute("aria-selected", String(t.dataset.tab === name));
    for (const p of panels) p.hidden = p.dataset.panel !== name;
    if (name === "tree" && !tree) tree = startTree(el, api, cleanups);
    if (name === "julia" && !julia) julia = startJulia(el, api, cleanups);
    if (tree) tree.setActive(name === "tree");
    if (julia) julia.setActive(name === "julia");
  }

  for (const t of tabs) t.addEventListener("click", () => { selectTab(t.dataset.tab); api.audio.blip(); });
  selectTab("tree");

  return () => {
    tree?.destroy();
    julia?.destroy();
    for (const fn of cleanups.splice(0)) fn();
  };
}

function startTree(el, api, cleanups) {
  const stage = el.querySelector("#tree-stage");
  const note = el.querySelector("#tree-note");
  const angle = el.querySelector("#f-angle");
  const depth = el.querySelector("#f-depth");
  const wind = el.querySelector("#f-wind");
  let instance = null;
  let destroyed = false;

  const params = () => ({
    angle: Number(angle.value) * Math.PI / 180,
    depth: Number(depth.value),
    wind: Number(wind.value) / 100,
  });

  const updateNote = () => {
    const p = params();
    note.textContent = `A mesma regra aplicada ${p.depth} vezes vira uma árvore. ` +
      (p.depth <= 5 ? "Agora dá para contar os galhos." : "Agora o infinito começa a aparecer.");
  };
  for (const s of [angle, depth, wind]) s.addEventListener("input", updateNote);

  stage.innerHTML = '<div class="widget-loading">carregando p5...</div>';
  loadScript(P5_CDN).then(() => {
    if (destroyed) return;
    instance = new window.p5((p) => {
      p.setup = () => {
        stage.textContent = "";
        const c = p.createCanvas(360, 260);
        c.parent(stage);
        p.pixelDensity(1);
        p.frameRate(30);
        p.noStroke();
      };
      p.draw = () => {
        const cfg = params();
        p.background(5, 8, 16);
        // chão e estrelas
        p.noStroke();
        p.fill(20, 32, 30);
        p.rect(0, 232, 360, 28);
        p.fill(97, 244, 192, 40);
        for (let i = 0; i < 26; i++) {
          const x = (i * 97) % 360;
          const y = (i * 53) % 210;
          p.rect(x, y, 1, 1);
        }
        p.push();
        p.translate(180, 232);
        branch(p, 62, 12, cfg.depth, cfg.angle, cfg.wind, 0);
        p.pop();
      };
      const branch = (p, len, w, d, a, windAmt, level, maxDepth) => {
        if (d <= 0 || len < 1.2) {
          p.fill(97, 244, 192, 180);
          p.circle(0, 0, 2.2);
          return;
        }
        const sway = Math.sin(p.frameCount * 0.015 + level * 0.7) * windAmt * 0.07 * level;
        p.stroke(110 + level * 4, 120 + level * 5, 190 - level * 4);
        p.strokeWeight(Math.max(0.7, w));
        p.line(0, 0, 0, -len);
        p.translate(0, -len);
        p.push();
        p.rotate(a + sway);
        branch(p, len * 0.72, w * 0.68, d - 1, a, windAmt, level + 1, maxDepth);
        p.pop();
        p.push();
        p.rotate(-a + sway);
        branch(p, len * 0.72, w * 0.68, d - 1, a, windAmt, level + 1, maxDepth);
        p.pop();
        if (Math.random() < 0.02) {
          p.fill(255, 200, 87, 120);
          p.circle(0, 0, 1.6);
        }
      };
    }, stage);
  }).catch(() => {
    stage.innerHTML = `<p class="widget-fail" style="padding:16px">p5 não carregou agora. O conjunto de Julia continua funcionando na outra aba.</p>`;
  });

  updateNote();
  return {
    setActive() {},
    destroy() {
      destroyed = true;
      if (instance) { try { instance.remove(); } catch { /* já foi */ } instance = null; }
    },
  };
}

function startJulia(el, api, cleanups) {
  const canvas = el.querySelector("#julia-canvas");
  const readout = el.querySelector("#j-readout");
  const iters = el.querySelector("#j-iters");
  const random = el.querySelector("#j-random");
  const ctx = canvas.getContext("2d");
  const off = document.createElement("canvas");
  const OW = 240, OH = 180;
  off.width = OW; off.height = OH;
  const offctx = off.getContext("2d");
  const img = offctx.createImageData(OW, OH);
  const palette = buildPalette();

  let wasm = null;
  let memory = null;
  let juliaFn = null;
  let counts = null;
  let raf = 0;
  let active = false;
  let destroyed = false;
  let last = 0;
  let autoT = 0;
  let target = { x: -0.8, y: 0.156 };
  let cur = { x: -0.8, y: 0.156 };
  let pointer = null;

  const jitter = () => {
    const a = autoT * 0.00023;
    target = {
      x: -0.75 + Math.cos(a * 1.7) * 0.16 + Math.sin(a * 0.7) * 0.05,
      y: Math.sin(a * 1.3) * 0.22 + Math.cos(a * 0.53) * 0.04,
    };
  };

  function buildPalette() {
    const stops = ["#05070f", "#1d1a54", "#4a2a92", "#a04ab8", "#ff5fa2", "#ffc857", "#fff3d1"];
    const cols = [];
    for (let i = 0; i < 256; i++) {
      const t = i / 255 * (stops.length - 1);
      const a = Math.floor(t), b = Math.min(a + 1, stops.length - 1);
      const k = t - a;
      const ca = parseHex(stops[a]), cb = parseHex(stops[b]);
      cols.push([
        Math.round(ca[0] + (cb[0] - ca[0]) * k),
        Math.round(ca[1] + (cb[1] - ca[1]) * k),
        Math.round(ca[2] + (cb[2] - ca[2]) * k),
      ]);
    }
    return cols;
  }
  function parseHex(h) {
    const n = parseInt(h.slice(1), 16);
    return [(n >> 16) & 255, (n >> 8) & 255, n & 255];
  }

  async function initWasm() {
    try {
      const url = new URL("../../../wasm/julia.wasm", import.meta.url);
      const res = await fetch(url);
      const bytes = await res.arrayBuffer();
      const { instance } = await WebAssembly.instantiate(bytes, {});
      wasm = instance;
      memory = wasm.exports.memory;
      juliaFn = wasm.exports.julia;
      juliaFn(0, OW, OH, cur.x, cur.y, Number(iters.value));
      counts = new Uint32Array(memory.buffer, 0, OW * OH);
    } catch (e) {
      console.error("[julia]", e);
      offctx.fillStyle = "#05070f";
      offctx.fillRect(0, 0, OW, OH);
      offctx.fillStyle = "#ff7aa8";
      offctx.font = "11px monospace";
      offctx.fillText("wasm indisponível", 12, 24);
      drawOff();
    }
  }

  function drawOff() {
    const max = Number(iters.value);
    for (let i = 0; i < OW * OH; i++) {
      const n = counts ? counts[i] : 0;
      const t = n >= max ? 0 : Math.floor(Math.pow(n / max, 0.34) * 255);
      const c = palette[t];
      const o = i * 4;
      img.data[o] = c[0];
      img.data[o + 1] = c[1];
      img.data[o + 2] = c[2];
      img.data[o + 3] = 255;
    }
    offctx.putImageData(img, 0, 0);
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(off, 0, 0, canvas.width, canvas.height);
    readout.textContent = `c = ${cur.x.toFixed(3)} ${cur.y >= 0 ? "+" : "-"} ${Math.abs(cur.y).toFixed(3)}i · ${max} iterações`;
  }

  function frame(now) {
    if (destroyed) return;
    raf = requestAnimationFrame(frame);
    if (!active) return;
    if (now - last < 45) return;
    last = now;
    autoT += 16;
    if (!pointer) jitter();
    cur.x += (target.x - cur.x) * 0.08;
    cur.y += (target.y - cur.y) * 0.08;
    if (juliaFn && counts) {
      juliaFn(0, OW, OH, cur.x, cur.y, Number(iters.value));
      drawOff();
    }
  }

  function onMove(e) {
    const r = canvas.getBoundingClientRect();
    pointer = {
      x: ((e.clientX - r.left) / r.width - 0.5) * 0.9,
      y: ((e.clientY - r.top) / r.height - 0.5) * 0.9,
    };
    target = { x: -0.8 + pointer.x, y: pointer.y };
  }
  function onLeave() { pointer = null; }
  canvas.addEventListener("pointermove", onMove);
  canvas.addEventListener("pointerleave", onLeave);
  random.addEventListener("click", () => {
    pointer = null;
    autoT = Math.random() * 100000;
    jitter();
    api.audio.blip();
  });
  iters.addEventListener("input", () => {
    if (juliaFn && counts) {
      juliaFn(0, OW, OH, cur.x, cur.y, Number(iters.value));
      drawOff();
    }
  });

  initWasm().then(() => {
    if (destroyed) return;
    drawOff();
    raf = requestAnimationFrame(frame);
  });
  cleanups.push(() => {
    destroyed = true;
    cancelAnimationFrame(raf);
    canvas.removeEventListener("pointermove", onMove);
    canvas.removeEventListener("pointerleave", onLeave);
  });

  return {
    setActive(v) { active = v; },
    destroy() {
      destroyed = true;
      cancelAnimationFrame(raf);
    },
  };
}

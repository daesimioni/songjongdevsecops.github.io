// Observatório: a série de Fourier da onda quadrada, com MathJax e Plotly.

const MATHJAX = "https://cdn.jsdelivr.net/npm/mathjax@3/es5/tex-mml-chtml.js";
const PLOTLY = "https://cdn.jsdelivr.net/npm/plotly.js-dist-min@2.35.2/plotly.min.js";

function loadScript(src) {
  return new Promise((resolve, reject) => {
    if (document.querySelector(`script[src="${src}"]`)) { resolve(); return; }
    const s = document.createElement("script");
    s.src = src;
    s.async = true;
    s.onload = resolve;
    s.onerror = () => reject(new Error("falha " + src));
    document.head.appendChild(s);
  });
}

function series(t, n) {
  let sum = 0;
  for (let k = 1; k <= n; k++) {
    const odd = 2 * k - 1;
    sum += Math.sin(odd * t) / odd;
  }
  return (4 / Math.PI) * sum;
}

export async function mount(el, api) {
  el.innerHTML = `
    <div class="widget">
      <div class="widget-head">
        <span class="widget-label">luneta de fourier</span>
        <span class="widget-hint">arraste os harmônicos</span>
      </div>
      <div class="math-block" id="fourier-math" aria-label="Fórmula da série de Fourier">
        <span class="math-fallback">f(t) ≈ (4/π) · Σ sin((2k-1)t) / (2k-1), k = 1..N</span>
      </div>
      <div class="plot-wrap" id="fourier-plot" style="height:320px"></div>
      <div class="w-row">
        <label for="f-harm">harmônicos N</label>
        <input id="f-harm" class="w-range" type="range" min="1" max="30" value="3">
        <b id="f-harm-label" style="font-family:var(--mono);color:var(--amber)">3</b>
        <span class="widget-hint" id="f-gibbs"></span>
      </div>
      <p class="widget-note">A linha tracejada é a onda quadrada de verdade. A linha acesa é a soma dos primeiros N senos. Os cantos nunca ficam perfeitos: o sobressalto perto do salto é o fenômeno de Gibbs, e ele não some quando N cresce, só fica mais fino.</p>
    </div>
  `;

  const plotEl = el.querySelector("#fourier-plot");
  const slider = el.querySelector("#f-harm");
  const label = el.querySelector("#f-harm-label");
  const gibbs = el.querySelector("#f-gibbs");
  const mathEl = el.querySelector("#fourier-math");
  let plotly = null;
  let alive = true;

  const t = [];
  for (let i = 0; i <= 480; i++) t.push(-Math.PI + (2 * Math.PI * i) / 480);
  const square = t.map((x) => Math.sign(Math.sin(x)) || 1);

  const layout = {
    paper_bgcolor: "rgba(0,0,0,0)",
    plot_bgcolor: "#05070f",
    font: { family: "ui-monospace, monospace", color: "#9c96b8", size: 11 },
    margin: { l: 44, r: 16, t: 18, b: 34 },
    showlegend: true,
    legend: { orientation: "h", x: 0, y: 1.14, font: { size: 11 } },
    xaxis: { title: "t", gridcolor: "rgba(172,142,255,0.12)", zerolinecolor: "rgba(172,142,255,0.25)" },
    yaxis: { title: "f(t)", range: [-1.65, 1.65], gridcolor: "rgba(172,142,255,0.12)", zerolinecolor: "rgba(172,142,255,0.25)" },
    hovermode: "x unified",
  };

  function data(n) {
    const approx = t.map((x) => series(x, n));
    return [
      {
        x: t, y: square, type: "scatter", mode: "lines", name: "onda quadrada",
        line: { color: "rgba(180,140,255,0.55)", width: 2, dash: "dot" },
        hoverinfo: "skip",
      },
      {
        x: t, y: approx, type: "scatter", mode: "lines", name: `soma com N=${n}`,
        line: { color: "#ffc857", width: 2.2 },
      },
    ];
  }

  function update() {
    const n = Number(slider.value);
    label.textContent = n;
    if (plotly) {
      plotly.react(plotEl, data(n), layout, { displayModeBar: false, responsive: true });
      gibbs.textContent = n < 5 ? "ainda parece uma onda gorda" : n < 15 ? "os cantos estão acordando" : "mais fino, nunca perfeito";
    }
  }

  slider.addEventListener("input", update);

  Promise.all([loadScript(PLOTLY), loadScript(MATHJAX).catch(() => null)])
    .then(() => {
      if (!alive) return;
      if (window.Plotly) {
        plotly = window.Plotly;
        plotly.newPlot(plotEl, data(Number(slider.value)), layout, { displayModeBar: false, responsive: true });
        update();
      } else {
        plotEl.innerHTML = '<p class="widget-fail" style="padding:18px">Plotly não carregou agora; a fórmula continua logo acima.</p>';
      }
      if (window.MathJax?.typesetPromise) {
        mathEl.innerHTML = "\\[ f(t) \\approx \\frac{4}{\\pi} \\sum_{k=1}^{N} \\frac{\\sin((2k-1)t)}{2k-1} \\]";
        window.MathJax.startup?.promise?.then(() => window.MathJax.typesetPromise([mathEl]));
      }
    })
    .catch((e) => {
      console.error("[fourier]", e);
      plotEl.innerHTML = '<p class="widget-fail" style="padding:18px">O gráfico não carregou agora.</p>';
    });

  return () => {
    alive = false;
    if (plotly) { try { plotly.purge(plotEl); } catch { /* já foi */ } }
  };
}

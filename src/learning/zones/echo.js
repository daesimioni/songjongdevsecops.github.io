// Rádio do quintal: um sequenciador de oito passos com síntese na hora.

const ROWS = ["bumbo", "nota", "brilho"];

function emptyPattern() {
  return ROWS.map(() => Array.from({ length: 8 }, () => false));
}

function defaultPattern() {
  const p = emptyPattern();
  p[0][0] = true; p[0][4] = true;
  p[1][2] = true; p[1][6] = true;
  p[2][0] = true; p[2][3] = true; p[2][7] = true;
  return p;
}

export async function mount(el, api) {
  const pattern = defaultPattern();
  let playing = false;
  let bpm = 96;
  let seq = null;
  let raf = null;
  let destroyed = false;

  el.innerHTML = `
    <div class="widget">
      <div class="widget-head">
        <span class="widget-label">rádio do quintal</span>
        <span class="widget-hint">oito passos, três vozes, zero arquivos</span>
      </div>
      <div class="seq" id="seq-grid" aria-label="Sequenciador de oito passos"></div>
      <div class="w-row">
        <button type="button" class="w-btn" id="seq-play">tocar</button>
        <label for="seq-bpm">bpm</label>
        <input id="seq-bpm" class="w-range" type="range" min="60" max="160" value="96">
        <b id="seq-bpm-label" style="font-family:var(--mono);color:var(--amber)">96</b>
        <button type="button" class="w-btn" id="seq-clear">limpar</button>
        <button type="button" class="w-btn" id="seq-random">sorteio</button>
      </div>
      <p class="widget-note">Se o som estiver desligado no topo da tela, o botão de tocar liga junto. Cada batida é uma onda criada na hora pelo Web Audio; não existe arquivo de áudio neste site.</p>
    </div>
  `;

  const grid = el.querySelector("#seq-grid");
  const playBtn = el.querySelector("#seq-play");
  const bpmInput = el.querySelector("#seq-bpm");
  const bpmLabel = el.querySelector("#seq-bpm-label");
  const cells = [];

  for (let r = 0; r < ROWS.length; r++) {
    const l = document.createElement("span");
    l.className = "row-label";
    l.textContent = ROWS[r];
    grid.appendChild(l);
    cells[r] = [];
    for (let c = 0; c < 8; c++) {
      const b = document.createElement("button");
      b.type = "button";
      b.className = pattern[r][c] ? "on" : "";
      b.setAttribute("aria-label", `${ROWS[r]} passo ${c + 1}`);
      b.setAttribute("aria-pressed", String(pattern[r][c]));
      b.addEventListener("click", () => {
        pattern[r][c] = !pattern[r][c];
        b.classList.toggle("on", pattern[r][c]);
        b.setAttribute("aria-pressed", String(pattern[r][c]));
        if (playing) api.audio.blip();
      });
      grid.appendChild(b);
      cells[r][c] = b;
    }
  }

  function highlight(step) {
    for (let r = 0; r < ROWS.length; r++) {
      cells[r].forEach((b, c) => b.classList.toggle("now", c === step));
    }
  }

  function start() {
    if (!api.audio.isEnabled()) api.enableSound();
    seq = api.audio.startSequencer(pattern, bpm, (step) => {
      if (destroyed) return;
      highlight(step);
    });
    if (!seq) return;
    playing = true;
    playBtn.textContent = "parar";
    playBtn.classList.add("on");
    api.audio.open();
  }

  function stop() {
    api.audio.stopSequencer();
    playing = false;
    playBtn.textContent = "tocar";
    playBtn.classList.remove("on");
    highlight(-1);
    api.audio.close();
  }

  playBtn.addEventListener("click", () => { if (playing) stop(); else start(); });
  bpmInput.addEventListener("input", () => {
    bpm = Number(bpmInput.value);
    bpmLabel.textContent = bpm;
    if (playing) start();
  });
  el.querySelector("#seq-clear").addEventListener("click", () => {
    for (let r = 0; r < ROWS.length; r++) {
      for (let c = 0; c < 8; c++) {
        pattern[r][c] = false;
        cells[r][c].classList.remove("on");
        cells[r][c].setAttribute("aria-pressed", "false");
      }
    }
  });
  el.querySelector("#seq-random").addEventListener("click", () => {
    for (let r = 0; r < ROWS.length; r++) {
      for (let c = 0; c < 8; c++) {
        const density = r === 0 ? 0.22 : r === 1 ? 0.3 : 0.18;
        pattern[r][c] = Math.random() < density;
        cells[r][c].classList.toggle("on", pattern[r][c]);
        cells[r][c].setAttribute("aria-pressed", String(pattern[r][c]));
      }
    }
    if (playing) start();
    api.audio.blip();
  });

  return () => {
    destroyed = true;
    if (playing) api.audio.stopSequencer();
    if (raf) cancelAnimationFrame(raf);
    highlight(-1);
    // a grade some junto com o painel
  };
}

// Matemática: infinito, cálculo e a máquina de Galton.

export async function mount(el, api, variant) {
  if (variant === "infinity") return mountInfinity(el, api);
  if (variant === "calculus") return mountCalculus(el, api);
  if (variant === "galton") return mountGalton(el, api);
  el.innerHTML = '<p class="widget-fail">Instrumento de Matemática desconhecido.</p>';
  return () => {};
}

/* ---------------- quiz do infinito ---------------- */
function mountInfinity(el, api) {
  const QUIZ = [
    {
      q: "Um hotel tem infinitos quartos e todos estão ocupados. Chega mais um hóspede. O que acontece?",
      options: [
        "Nada, o hotel está cheio.",
        "Cabe: cada hóspede vai para o quarto seguinte e o quarto 1 fica livre.",
        "Só cabe se alguém desistir do quarto.",
      ],
      answer: 1,
      why: "Esse é o hotel de Hilbert. Com infinitos quartos, sempre há espaço para mais um: deslocar todo mundo uma casa adiante libera o primeiro.",
    },
    {
      q: "O conjunto dos números pares é menor que o conjunto dos números naturais?",
      options: [
        "Sim, os pares são metade dos naturais.",
        "Não: dá para emparelhar cada natural com um par, sem sobrar nenhum.",
        "Depende do dia.",
      ],
      answer: 1,
      why: "Cantor comparou infinitos por emparelhamento. A função n → 2n liga cada natural a um par único. Dois conjuntos infinitos podem ter o mesmo tamanho mesmo quando um parece 'caber' no outro.",
    },
    {
      q: "Existem mais números entre 0 e 1 ou mais números naturais?",
      options: [
        "Mais naturais, porque eles vão até o infinito.",
        "A mesma quantidade.",
        "Mais reais entre 0 e 1: eles não podem ser listados um a um.",
      ],
      answer: 2,
      why: "O argumento diagonal de Cantor mostra que nenhuma lista de reais entre 0 e 1 consegue conter todos. Existem infinitos maiores que outros.",
    },
    {
      q: "Quanto vale 0,999... com infinitos noves?",
      options: [
        "É quase 1, mas um pouquinho menor.",
        "É exatamente 1.",
        "Não é um número.",
      ],
      answer: 1,
      why: "0,999... é outra escrita de 1. Se x = 0,999..., então 10x = 9,999... e 10x - x = 9, logo x = 1. O infinito não deixa espaço para uma diferença.",
    },
  ];
  let i = 0, score = 0, answered = false;
  el.innerHTML = `
    <div class="widget">
      <div class="widget-head">
        <span class="widget-label">paradoxos do infinito</span>
        <span class="widget-hint">quatro perguntas</span>
      </div>
      <div class="quiz">
        <div class="quiz-top"><span id="quiz-count"></span><span id="quiz-score"></span></div>
        <p class="quiz-question" id="quiz-q"></p>
        <div class="quiz-options" id="quiz-options"></div>
        <div class="quiz-feedback" id="quiz-feedback" hidden></div>
        <div class="w-row"><button type="button" class="w-btn" id="quiz-next" hidden>próxima</button></div>
      </div>
      <p class="widget-note">Infinito não é um número. É uma propriedade de conjuntos que nunca terminam. Comparar infinitos exige uma ferramenta diferente: o emparelhamento.</p>
    </div>
  `;
  const count = el.querySelector("#quiz-count");
  const scoreEl = el.querySelector("#quiz-score");
  const qEl = el.querySelector("#quiz-q");
  const opts = el.querySelector("#quiz-options");
  const fb = el.querySelector("#quiz-feedback");
  const next = el.querySelector("#quiz-next");

  function render() {
    answered = false;
    const q = QUIZ[i];
    count.textContent = `pergunta ${i + 1} de ${QUIZ.length}`;
    scoreEl.textContent = `acertos: ${score}`;
    qEl.textContent = q.q;
    opts.textContent = "";
    fb.hidden = true;
    next.hidden = true;
    next.onclick = advance;
    q.options.forEach((text, idx) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "quiz-option";
      b.textContent = text;
      b.addEventListener("click", () => {
        if (answered) return;
        answered = true;
        const correct = idx === q.answer;
        if (correct) score++;
        for (const [k, btn] of [...opts.children].entries()) {
          btn.disabled = true;
          if (k === q.answer) btn.classList.add("right");
          else if (k === idx) btn.classList.add("wrong");
        }
        fb.hidden = false;
        fb.innerHTML = `<b>${correct ? "certo." : "quase."}</b> ${q.why}`;
        scoreEl.textContent = `acertos: ${score}`;
        next.hidden = false;
        next.textContent = i === QUIZ.length - 1 ? "ver resultado" : "próxima";
        api.audio[correct ? "blip" : "error"]();
      });
      opts.appendChild(b);
    });
  }
  function advance() {
    if (i < QUIZ.length - 1) { i++; render(); return; }
    qEl.textContent = `Fim. Você acertou ${score} de ${QUIZ.length}.`;
    opts.textContent = "";
    fb.hidden = true;
    next.hidden = false;
    next.textContent = "jogar de novo";
    next.onclick = () => { i = 0; score = 0; render(); };
  }
  next.onclick = advance;
  render();
  return () => {};
}

/* ---------------- cálculo ---------------- */
function mountCalculus(el, api) {
  const W = 420, H = 280;
  const X0 = -3, X1 = 3, Y0 = -3, Y1 = 3;
  const f = (x) => 0.18 * x * x * x - 0.9 * x + 1;
  const df = (x) => 0.54 * x * x - 0.9;
  const F = (x) => 0.045 * Math.pow(x, 4) - 0.45 * x * x + x;
  let mode = "tangent";
  let x0 = 0.8;
  let n = 8;

  el.innerHTML = `
    <div class="widget">
      <div class="widget-head">
        <span class="widget-label">ponte do cálculo</span>
        <span class="widget-hint">mude o ponto e veja a conta</span>
      </div>
      <div class="w-tabs">
        <button type="button" class="w-tab" data-mode="tangent" aria-selected="true">derivada</button>
        <button type="button" class="w-tab" data-mode="area" aria-selected="false">integral</button>
      </div>
      <div class="widget-canvas-wrap"><canvas id="calc-canvas" width="420" height="280"></canvas></div>
      <div class="w-row" id="calc-controls">
        <label for="calc-x" id="calc-label">x</label>
        <input id="calc-x" class="w-range" type="range" min="-2.6" max="2.6" step="0.01" value="0.8">
        <b id="calc-x-val" style="font-family:var(--mono);color:var(--amber)">0.80</b>
      </div>
      <div class="calc-readout" id="calc-readout"></div>
      <p class="widget-note" id="calc-note">A reta tangente mostra a taxa de mudança instantânea. A inclinação dela é a derivada no ponto.</p>
    </div>
  `;
  const canvas = el.querySelector("#calc-canvas");
  const ctx = canvas.getContext("2d");
  const slider = el.querySelector("#calc-x");
  const label = el.querySelector("#calc-label");
  const val = el.querySelector("#calc-x-val");
  const readout = el.querySelector("#calc-readout");
  const note = el.querySelector("#calc-note");


  function px(x) { return 24 + (x - X0) / (X1 - X0) * (W - 48); }
  function py(y) { return H - 24 - (y - Y0) / (Y1 - Y0) * (H - 48); }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    ctx.fillStyle = "#05070f";
    ctx.fillRect(0, 0, W, H);
    // grade
    ctx.strokeStyle = "rgba(172,142,255,0.1)";
    ctx.lineWidth = 1;
    for (let gx = -3; gx <= 3; gx++) {
      ctx.beginPath(); ctx.moveTo(px(gx), 0); ctx.lineTo(px(gx), H); ctx.stroke();
    }
    for (let gy = -3; gy <= 3; gy++) {
      ctx.beginPath(); ctx.moveTo(0, py(gy)); ctx.lineTo(W, py(gy)); ctx.stroke();
    }
    // eixos
    ctx.strokeStyle = "rgba(220,215,255,0.45)";
    ctx.beginPath(); ctx.moveTo(px(0), 0); ctx.lineTo(px(0), H); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(0, py(0)); ctx.lineTo(W, py(0)); ctx.stroke();
    // curva
    ctx.strokeStyle = "#b48cff";
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let i = 0; i <= 300; i++) {
      const x = X0 + (X1 - X0) * i / 300;
      const y = f(x);
      if (i === 0) ctx.moveTo(px(x), py(y)); else ctx.lineTo(px(x), py(y));
    }
    ctx.stroke();

    if (mode === "tangent") {
      const y = f(x0);
      const m = df(x0);
      ctx.strokeStyle = "#ffc857";
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(px(X0), py(y + m * (X0 - x0)));
      ctx.lineTo(px(X1), py(y + m * (X1 - x0)));
      ctx.stroke();
      ctx.fillStyle = "#ffc857";
      ctx.beginPath(); ctx.arc(px(x0), py(y), 4, 0, Math.PI * 2); ctx.fill();
      readout.innerHTML = `f(${x0.toFixed(2)}) = <b>${y.toFixed(3)}</b> &nbsp; f'(${x0.toFixed(2)}) = <b>${m.toFixed(3)}</b>`;
      note.textContent = "A reta tangente mostra a taxa de mudança instantânea. A inclinação dela é a derivada no ponto.";
    } else {
      const a = -2, b = 2;
      const dx = (b - a) / n;
      let sum = 0;
      ctx.fillStyle = "rgba(97,244,192,0.13)";
      ctx.strokeStyle = "rgba(97,244,192,0.3)";
      for (let i = 0; i < n; i++) {
        const x = a + i * dx;
        const h = Math.abs(f(x));
        const base = Math.min(0, f(x));
        sum += f(x) * dx;
        ctx.fillRect(px(x), py(base + h), Math.max(1, px(x + dx) - px(x) - 0.5), Math.abs(py(base) - py(base + h)));
        ctx.strokeRect(px(x), py(base + h), Math.max(1, px(x + dx) - px(x) - 0.5), Math.abs(py(base) - py(base + h)));
      }
      const exact = F(b) - F(a);
      readout.innerHTML = `soma de ${n} retângulos = <b>${sum.toFixed(3)}</b> &nbsp; área exata = <b>${exact.toFixed(3)}</b>`;
      note.textContent = "A integral corta a área em retângulos e soma. Quanto mais fino o corte, mais perto do valor exato.";
    }
  }

  function updateControls() {
    if (mode === "tangent") {
      label.textContent = "x";
      slider.min = "-2.6"; slider.max = "2.6"; slider.step = "0.01";
      slider.value = String(x0);
      val.textContent = x0.toFixed(2);
    } else {
      label.textContent = "retângulos";
      slider.min = "1"; slider.max = "60"; slider.step = "1";
      slider.value = String(n);
      val.textContent = n;
    }
    draw();
  }
  slider.addEventListener("input", () => {
    if (mode === "tangent") x0 = Number(slider.value);
    else n = Math.round(Number(slider.value));
    val.textContent = mode === "tangent" ? x0.toFixed(2) : n;
    draw();
  });
  for (const tab of el.querySelectorAll("[data-mode]")) {
    tab.addEventListener("click", () => {
      mode = tab.dataset.mode;
      for (const t of el.querySelectorAll("[data-mode]")) t.setAttribute("aria-selected", String(t === tab));
      updateControls();
      api.audio.blip();
    });
  }
  updateControls();
  return () => {};
}

/* ---------------- máquina de galton ---------------- */
function mountGalton(el, api) {
  const W = 420, H = 300;
  const ROWS = 10;
  const BINS = ROWS + 1;
  const boardTop = 34;
  const rowH = 19;
  const bottomY = boardTop + ROWS * rowH + 12;
  const stepX = 15;
  const cx = W / 2;
  const bins = Array(BINS).fill(0);
  const balls = [];
  let queue = 0;
  let total = 0;
  let raf = 0;
  let last = 0;

  el.innerHTML = `
    <div class="widget">
      <div class="widget-head">
        <span class="widget-label">máquina de galton</span>
        <span class="widget-hint">o acaso vira sino</span>
      </div>
      <div class="widget-canvas-wrap"><canvas id="galton-canvas" width="420" height="300"></canvas></div>
      <div class="w-row">
        <button type="button" class="w-btn" id="galton-one">jogar 1</button>
        <button type="button" class="w-btn" id="galton-many">jogar 30</button>
        <button type="button" class="w-btn" id="galton-clear">limpar</button>
        <span class="widget-hint" id="galton-total">0 bolinhas</span>
      </div>
      <p class="widget-note">Cada bolinha desce uma fileira e escolhe esquerda ou direita ao acaso. Existem muito mais caminhos que terminam no centro do que nas pontas, então o monte se forma sozinho. Com mais fileiras, o perfil se aproxima de uma curva normal.</p>
    </div>
  `;
  const canvas = el.querySelector("#galton-canvas");
  const ctx = canvas.getContext("2d");
  const totalEl = el.querySelector("#galton-total");

  function spawn() {
    if (queue <= 0) return;
    queue--;
    const path = [0];
    let x = 0;
    for (let r = 0; r < ROWS; r++) {
      x += Math.random() < 0.5 ? -1 : 1;
      path.push(x);
    }
    balls.push({ path, row: 0, t: 0, bin: (path[path.length - 1] + ROWS) / 2, done: false });
  }

  function draw() {
    ctx.fillStyle = "#05070f";
    ctx.fillRect(0, 0, W, H);
    // pinos
    for (let r = 0; r < ROWS; r++) {
      const count = r + 1;
      for (let i = 0; i < count; i++) {
        const x = cx + (i - (count - 1) / 2) * stepX;
        const y = boardTop + r * rowH;
        ctx.fillStyle = "rgba(180,140,255,0.45)";
        ctx.beginPath(); ctx.arc(x, y, 1.3, 0, Math.PI * 2); ctx.fill();
      }
    }
    // histograma
    const maxVal = Math.max(1, ...bins);
    const binW = 30;
    const startX = cx - (BINS * binW) / 2;
    for (let i = 0; i < BINS; i++) {
      const h = (bins[i] / maxVal) * 58;
      const x = startX + i * binW;
      ctx.fillStyle = "rgba(255,200,87,0.55)";
      ctx.fillRect(x + 2, bottomY - h, binW - 4, h);
      ctx.strokeStyle = "rgba(255,200,87,0.25)";
      ctx.strokeRect(x + 2, bottomY - h, binW - 4, h);
    }
    // bolinhas
    for (const b of balls) {
      let x, y;
      if (b.row >= ROWS) {
        x = cx + b.bin * stepX;
        y = bottomY - 2;
      } else {
        const from = b.path[b.row];
        const to = b.path[b.row + 1];
        const e = b.t;
        x = cx + (from + (to - from) * e) * stepX;
        y = boardTop + b.row * rowH + rowH * e;
      }
      ctx.fillStyle = "#61f4c0";
      ctx.beginPath(); ctx.arc(x, y, 2.2, 0, Math.PI * 2); ctx.fill();
    }
    ctx.fillStyle = "rgba(220,215,255,0.5)";
    ctx.font = "10px ui-monospace, monospace";
    ctx.textAlign = "center";
    ctx.fillText("cada pino: esquerda ou direita", cx, H - 8);
    ctx.textAlign = "left";
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - (last || now)) / 1000);
    last = now;
    if (queue > 0 && balls.length < 80) spawn();
    for (const b of balls) {
      if (b.done) continue;
      b.t += dt * 5.2;
      if (b.t >= 1) {
        b.t = 0;
        b.row++;
        if (b.row >= ROWS) {
          b.done = true;
          bins[b.bin]++;
          total++;
        }
      }
    }
    for (let i = balls.length - 1; i >= 0; i--) if (balls[i].done) balls.splice(i, 1);
    totalEl.textContent = `${total} bolinhas`;
    draw();
  }
  el.querySelector("#galton-one").addEventListener("click", () => { queue += 1; api.audio.blip(); });
  el.querySelector("#galton-many").addEventListener("click", () => { queue += 30; api.audio.blip(); });
  el.querySelector("#galton-clear").addEventListener("click", () => {
    queue = 0; balls.length = 0; bins.fill(0); total = 0; draw();
  });
  draw();
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}

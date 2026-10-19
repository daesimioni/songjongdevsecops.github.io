// Computaria: somadores, memória, processador de brinquedo e linha do tempo.

export async function mount(el, api, variant) {
  if (variant === "adder") return mountAdder(el, api);
  if (variant === "state") return mountState(el, api);
  if (variant === "cpu") return mountCpu(el, api);
  if (variant === "timeline") return mountTimeline(el, api);
  el.innerHTML = '<p class="widget-fail">Instrumento de Computaria desconhecido.</p>';
  return () => {};
}

/* ---------------- somador ---------------- */
function mountAdder(el, api) {
  let a = 5, b = 3;
  el.innerHTML = `
    <div class="widget">
      <div class="widget-head">
        <span class="widget-label">somador de quatro bits</span>
        <span class="widget-hint">clique nos bits</span>
      </div>
      <div class="addr-grid">
        <div class="addr-row"><span class="addr-label">A</span><span class="addr-bits" id="addr-a"></span></div>
        <div class="addr-row"><span class="addr-label">B</span><span class="addr-bits" id="addr-b"></span></div>
      </div>
      <div class="addr-equation">
        <code id="addr-eq">0101 + 0011</code>
        <b id="addr-sum">= 01000</b>
      </div>
      <div class="addr-decimal" id="addr-dec"></div>
      <div class="addr-stages" id="addr-stages"></div>
      <div class="w-row">
        <button type="button" class="w-btn" id="addr-rand">sortear</button>
        <button type="button" class="w-btn" id="addr-zero">zerar</button>
        <span class="widget-hint">o transporte viaja de um bloco para o próximo</span>
      </div>
      <p class="widget-note">Cada bloco é um somador completo: recebe dois bits e o transporte que veio de trás, devolve a soma e o próximo transporte. Quatro blocos em fila somam números de quatro bits. O quinto bit da resposta é o transporte final.</p>
    </div>
  `;
  const aWrap = el.querySelector("#addr-a");
  const bWrap = el.querySelector("#addr-b");
  const eq = el.querySelector("#addr-eq");
  const sumEl = el.querySelector("#addr-sum");
  const dec = el.querySelector("#addr-dec");
  const stages = el.querySelector("#addr-stages");

  function bitsMarkup(wrap, value, key) {
    wrap.textContent = "";
    for (let i = 3; i >= 0; i--) {
      const on = (value >> i) & 1;
      const btn = document.createElement("button");
      btn.type = "button";
      btn.className = "bit" + (on ? " on" : "");
      btn.textContent = on;
      btn.setAttribute("aria-label", `bit ${i} de ${key}`);
      btn.addEventListener("click", () => {
        if (key === "a") a ^= (1 << i); else b ^= (1 << i);
        api.audio.blip();
        render();
      });
      wrap.appendChild(btn);
    }
  }

  function bin(v, n) { return v.toString(2).padStart(n, "0"); }

  function render() {
    bitsMarkup(aWrap, a, "a");
    bitsMarkup(bWrap, b, "b");
    const total = a + b;
    eq.textContent = `${bin(a, 4)} + ${bin(b, 4)}`;
    sumEl.textContent = `= ${bin(total, 5)}`;
    dec.textContent = `${a} + ${b} = ${total}`;
    let carry = 0;
    stages.textContent = "";
    for (let i = 0; i < 4; i++) {
      const ai = (a >> i) & 1;
      const bi = (b >> i) & 1;
      const s = ai ^ bi ^ carry;
      const cout = (ai + bi + carry) >= 2 ? 1 : 0;
      const box = document.createElement("div");
      box.className = "addr-stage";
      box.innerHTML = `
        <span class="addr-stage-bit">A${i}=${ai}</span>
        <span class="addr-stage-bit">B${i}=${bi}</span>
        <span class="addr-stage-bit">c=${carry}</span>
        <span class="addr-stage-out">S${i}=${s}</span>
        <span class="addr-carry ${cout ? "on" : ""}">→${cout}</span>
      `;
      stages.appendChild(box);
      carry = cout;
    }
    const finalBox = document.createElement("div");
    finalBox.className = "addr-stage addr-final";
    finalBox.innerHTML = `<span class="addr-stage-out">transporte final S4=${carry}</span>`;
    stages.appendChild(finalBox);
  }

  el.querySelector("#addr-rand").addEventListener("click", () => {
    a = Math.floor(Math.random() * 16);
    b = Math.floor(Math.random() * 16);
    api.audio.blip();
    render();
  });
  el.querySelector("#addr-zero").addEventListener("click", () => {
    a = 0; b = 0; render(); api.audio.blip();
  });
  render();
  return () => {};
}

/* ---------------- contador / flip-flop ---------------- */
function mountState(el, api) {
  let value = 0;
  let timer = null;
  el.innerHTML = `
    <div class="widget">
      <div class="widget-head">
        <span class="widget-label">contador de quatro bits</span>
        <span class="widget-hint">cada pulso guarda um estado</span>
      </div>
      <div class="state-stage">
        <div class="state-leds" id="state-leds"></div>
        <div class="state-readout"><b id="state-dec">0</b><span>em decimal</span></div>
      </div>
      <div class="w-row">
        <button type="button" class="w-btn" id="state-pulse">pulso de clock</button>
        <button type="button" class="w-btn" id="state-auto">rodar sozinho</button>
        <button type="button" class="w-btn" id="state-reset">zerar</button>
      </div>
      <div class="state-diagram">
        <div class="state-box"><span>D</span><b>flip-flop</b><span>Q</span></div>
        <div class="state-arrow">← clock</div>
        <div class="state-box state-box-2"><span>Q</span><b>próximo bit</b><span>Q'</span></div>
      </div>
      <p class="widget-note">Um circuito combinacional esquece tudo assim que a entrada muda. Este contador não esquece: cada pulso de relógio atualiza os quatro bits e o valor fica guardado. É a diferença entre calcular e lembrar. O contador de quatro bits dá a volta em 16 passos.</p>
    </div>
  `;
  const leds = el.querySelector("#state-leds");
  const dec = el.querySelector("#state-dec");
  const autoBtn = el.querySelector("#state-auto");
  function render() {
    leds.textContent = "";
    for (let i = 3; i >= 0; i--) {
      const on = (value >> i) & 1;
      const bit = document.createElement("span");
      bit.className = "state-led" + (on ? " on" : "");
      bit.textContent = on;
      leds.appendChild(bit);
    }
    dec.textContent = value;
  }
  function pulse() {
    value = (value + 1) & 15;
    render();
    api.audio.blip();
  }
  el.querySelector("#state-pulse").addEventListener("click", pulse);
  el.querySelector("#state-reset").addEventListener("click", () => { value = 0; render(); api.audio.open(); });
  autoBtn.addEventListener("click", () => {
    if (timer) {
      clearInterval(timer); timer = null; autoBtn.textContent = "rodar sozinho";
    } else {
      timer = setInterval(pulse, 650);
      autoBtn.textContent = "pausar";
    }
  });
  render();
  return () => { if (timer) clearInterval(timer); };
}

/* ---------------- cpu de brinquedo ---------------- */
function mountCpu(el, api) {
  const PROGRAM = [
    { op: "LDA", arg: 5, text: "LDA 5" },
    { op: "ADD", arg: 3, text: "ADD 3" },
    { op: "STA", arg: 8, text: "STA 8" },
    { op: "LDB", arg: 2, text: "LDB 2" },
    { op: "ADD", arg: 7, text: "ADD 7" },
    { op: "STA", arg: 9, text: "STA 9" },
    { op: "HLT", arg: 0, text: "HLT" },
  ];
  let A = 0, B = 0, PC = 0, halted = false, last = "controle";
  const mem = Array(10).fill(0);

  el.innerHTML = `
    <div class="widget">
      <div class="widget-head">
        <span class="widget-label">cpu de brinquedo</span>
        <span class="widget-hint">buscar · decodificar · executar</span>
      </div>
      <div class="cpu-datapath">
        <div class="cpu-part" data-part="controle"><b>controle</b><span>lê a instrução</span></div>
        <div class="cpu-arrow">→</div>
        <div class="cpu-part" data-part="regs"><b>registradores</b><span>A=<i id="cpu-a">0</i> B=<i id="cpu-b">0</i></span></div>
        <div class="cpu-arrow">↔</div>
        <div class="cpu-part" data-part="ula"><b>ULA</b><span>soma e compara</span></div>
      </div>
      <div class="cpu-program" id="cpu-program"></div>
      <div class="cpu-grid">
        <div class="cpu-mem"><span class="mini-label">memória</span><div id="cpu-mem"></div></div>
        <div class="cpu-status">
          <span class="mini-label">estado</span>
          <p id="cpu-status">PC = 0. Aperte passo para começar.</p>
          <div class="w-row">
            <button type="button" class="w-btn" id="cpu-step">passo</button>
            <button type="button" class="w-btn" id="cpu-run">rodar</button>
            <button type="button" class="w-btn" id="cpu-reset">reiniciar</button>
          </div>
        </div>
      </div>
      <p class="widget-note">O programa carrega 5 em A, soma 3, guarda em mem[8], carrega 2 em B, soma 7 em A e guarda em mem[9]. No fim, mem[8]=8 e mem[9]=9. Uma CPU real faz o mesmo com bilhões de instruções por segundo, em pipeline e com previsão de desvio.</p>
    </div>
  `;
  const progEl = el.querySelector("#cpu-program");
  const memEl = el.querySelector("#cpu-mem");
  const status = el.querySelector("#cpu-status");
  const aEl = el.querySelector("#cpu-a");
  const bEl = el.querySelector("#cpu-b");
  let runTimer = null;

  function render() {
    progEl.innerHTML = PROGRAM.map((p, i) =>
      `<div class="cpu-line ${i === PC ? "now" : ""} ${i < PC ? "done" : ""}"><span>${i}</span><code>${p.text}</code></div>`).join("");
    memEl.innerHTML = mem.map((v, i) =>
      `<div class="cpu-cell ${v ? "has" : ""}"><span>${i}</span><b>${v}</b></div>`).join("");
    aEl.textContent = A;
    bEl.textContent = B;
    for (const p of el.querySelectorAll(".cpu-part")) {
      p.classList.toggle("active", p.dataset.part === last);
    }
  }
  function reset() {
    A = 0; B = 0; PC = 0; halted = false; last = "controle";
    mem.fill(0);
    status.textContent = "PC = 0. Memória zerada.";
    render();
    if (runTimer) { clearInterval(runTimer); runTimer = null; }
    el.querySelector("#cpu-run").textContent = "rodar";
  }
  function step() {
    if (halted) { status.textContent = "HLT. O programa terminou. Reinicie para rodar de novo."; return; }
    const ins = PROGRAM[PC];
    if (!ins) { halted = true; return; }
    if (ins.op === "LDA") { A = ins.arg; last = "regs"; }
    else if (ins.op === "LDB") { B = ins.arg; last = "regs"; }
    else if (ins.op === "ADD") { A = (A + ins.arg) & 255; last = "ula"; }
    else if (ins.op === "SUB") { A = (A - ins.arg) & 255; last = "ula"; }
    else if (ins.op === "STA") { mem[ins.arg] = A; last = "mem"; }
    else if (ins.op === "HLT") { halted = true; last = "controle"; }
    status.textContent = `${ins.text} → ${halted ? "HLT" : "PC = " + (PC + 1)}`;
    PC++;
    if (PC >= PROGRAM.length) halted = true;
    api.audio.blip();
    render();
  }
  el.querySelector("#cpu-step").addEventListener("click", step);
  el.querySelector("#cpu-reset").addEventListener("click", reset);
  el.querySelector("#cpu-run").addEventListener("click", (e) => {
    if (runTimer) {
      clearInterval(runTimer); runTimer = null; e.target.textContent = "rodar";
    } else {
      runTimer = setInterval(() => { if (halted) { clearInterval(runTimer); runTimer = null; el.querySelector("#cpu-run").textContent = "rodar"; } else step(); }, 700);
      e.target.textContent = "pausar";
    }
  });
  render();
  return () => { if (runTimer) clearInterval(runTimer); };
}

/* ---------------- linha do tempo ---------------- */
function mountTimeline(el, api) {
  const ERAS = [
    { year: "~3000 a.C.", tag: "contar", title: "O ábaco", text: "Fichas e hastes representam quantidades. A conta sai da cabeça e vai para as mãos. Versões do ábaco aparecem na Mesopotâmia, na China e no Japão." },
    { year: "1642", tag: "máquina", title: "A pascalina", text: "Blaise Pascal construiu uma calculadora de rodas dentadas para ajudar o pai, que trabalhava com impostos. Somava e subtraía com transporte automático." },
    { year: "1804", tag: "automação", title: "O tear de Jacquard", text: "Cartões perfurados dizem ao tear quais fios levantar. É uma das primeiras máquinas programáveis: o desenho vira uma sequência de instruções." },
    { year: "1837", tag: "ideia", title: "Babbage e Ada", text: "A máquina analítica é projetada com unidade de cálculo, memória e instruções. Ada Lovelace percebe que ela pode manipular símbolos, não só números." },
    { year: "1936", tag: "teoria", title: "A máquina de Turing", text: "Turing formaliza o que significa calcular. Uma fita, um cabeçote e regras simples bastam para descrever qualquer computação efetiva." },
    { year: "1945", tag: "válvula", title: "ENIAC", text: "Dezoito mil válvulas, 30 toneladas, cálculos de artilharia e, depois, a bomba de hidrogênio. O computador eletrônico começa grande e quente." },
    { year: "1947", tag: "transistor", title: "O transistor", text: "Bardeen, Brattain e Shockley fazem uma chave de estado sólido, menor e mais confiável que a válvula. A eletrônica encontra seu tijolo fundamental." },
    { year: "1958", tag: "chip", title: "O circuito integrado", text: "Kilby e Noyce colocam vários componentes no mesmo pedaço de silício. A miniaturização deixa de ser artesanato e vira indústria." },
    { year: "1971", tag: "micro", title: "O microprocessador", text: "O Intel 4004 junta a CPU em um único chip. O computador deixa de ser uma sala e começa a caber numa placa." },
    { year: "1981", tag: "pessoal", title: "O PC", text: "O IBM PC populariza um padrão aberto de hardware. Clones, placas e software disparam. A computação vai para a mesa de casa." },
    { year: "1991", tag: "rede", title: "A web", text: "Tim Berners-Lee junta hipertexto, URL e HTTP. Documentos viram uma teia navegável, e a internet ganha uma cara para o público." },
    { year: "2007", tag: "bolso", title: "O smartphone", text: "Tela multitoque, GPS, câmera e internet no mesmo objeto. O computador vira acessório do corpo e a interface vira gesto." },
    { year: "2022", tag: "modelos", title: "A IA generativa", text: "Modelos de linguagem passam a produzir texto, código e imagem em escala. A computação começa a lidar com a própria linguagem como matéria-prima." },
  ];
  let i = 0;
  el.innerHTML = `
    <div class="widget">
      <div class="widget-head">
        <span class="widget-label">linha do tempo</span>
        <span class="widget-hint">da areia ao silício</span>
      </div>
      <div class="timeline-strip" id="tl-strip"></div>
      <div class="timeline-detail" id="tl-detail"></div>
      <div class="w-row">
        <button type="button" class="w-btn" id="tl-prev">anterior</button>
        <button type="button" class="w-btn" id="tl-next">próximo</button>
        <span class="widget-hint" id="tl-count"></span>
      </div>
      <p class="widget-note">A história não é uma linha reta de invenções isoladas. Cada passo depende de materiais, dinheiro, guerras, oficinas e pessoas que enxergaram uma possibilidade antes dos outros.</p>
    </div>
  `;
  const strip = el.querySelector("#tl-strip");
  const detail = el.querySelector("#tl-detail");
  const count = el.querySelector("#tl-count");

  function render() {
    strip.innerHTML = ERAS.map((e, idx) =>
      `<button type="button" class="tl-dot ${idx === i ? "on" : ""}" data-i="${idx}"><span></span><b>${e.year}</b></button>`).join("");
    const era = ERAS[i];
    detail.innerHTML = `
      <div class="tl-year">${era.year}</div>
      <div class="tl-tag">${era.tag}</div>
      <h4>${era.title}</h4>
      <p>${era.text}</p>
    `;
    count.textContent = `${i + 1} de ${ERAS.length}`;
    for (const b of strip.querySelectorAll("button")) {
      b.addEventListener("click", () => { i = Number(b.dataset.i); render(); api.audio.blip(); });
    }
  }
  el.querySelector("#tl-prev").addEventListener("click", () => { i = (i - 1 + ERAS.length) % ERAS.length; render(); api.audio.blip(); });
  el.querySelector("#tl-next").addEventListener("click", () => { i = (i + 1) % ERAS.length; render(); api.audio.blip(); });
  render();
  return () => {};
}

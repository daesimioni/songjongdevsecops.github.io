// Bancada de portas lógicas: duas entradas, uma porta, uma lâmpada.

const GATES = {
  and: { name: "E", symbol: "A · B", fn: (a, b) => a && b },
  or: { name: "OU", symbol: "A + B", fn: (a, b) => a || b },
  xor: { name: "OUX", symbol: "A ⊕ B", fn: (a, b) => a !== b },
  nand: { name: "NÃO E", symbol: "¬(A · B)", fn: (a, b) => !(a && b) },
};

export async function mount(el, api) {
  let a = false;
  let b = false;
  let gate = "and";

  el.innerHTML = `
    <div class="widget">
      <div class="widget-head">
        <span class="widget-label">bancada de portas</span>
        <span class="widget-hint">ligue as entradas, troque a porta</span>
      </div>
      <div class="w-row">
        <button type="button" class="switch" data-in="a" aria-pressed="false"><span>entrada A</span><span class="dot"></span></button>
        <button type="button" class="switch" data-in="b" aria-pressed="false"><span>entrada B</span><span class="dot"></span></button>
      </div>
      <div class="w-tabs" role="tablist" aria-label="Porta lógica">
        ${Object.entries(GATES).map(([key, g]) =>
          `<button type="button" class="w-tab" role="tab" data-gate="${key}" aria-selected="${key === gate}">${g.name}</button>`).join("")}
      </div>
      <svg class="gate-svg" viewBox="0 0 420 220" role="img" aria-label="Circuito: duas entradas passam por uma porta lógica e acendem uma lâmpada">
        <path class="gate-wire" id="wire-a" d="M52 74 H120 Q150 74 150 92 L155 92"/>
        <path class="gate-wire" id="wire-b" d="M52 146 H120 Q150 146 150 128 L155 128"/>
        <path class="gate-wire" id="wire-out" d="M235 110 H312"/>
        <circle class="gate-node" id="node-a" cx="36" cy="74" r="8"/>
        <circle class="gate-node" id="node-b" cx="36" cy="146" r="8"/>
        <text class="gate-text" x="36" y="52">A</text>
        <text class="gate-text" x="36" y="172">B</text>
        <rect class="gate-body" x="155" y="70" width="80" height="80" rx="8"/>
        <text class="gate-text" id="gate-name" x="195" y="115">E</text>
        <circle class="gate-node" id="out-node" cx="235" cy="110" r="5"/>
        <circle class="lamp" id="lamp" cx="336" cy="110" r="18"/>
        <g id="lamp-rays">
          <line class="lamp-ray" x1="336" y1="82" x2="336" y2="72"/>
          <line class="lamp-ray" x1="336" y1="138" x2="336" y2="148"/>
          <line class="lamp-ray" x1="308" y1="110" x2="298" y2="110"/>
          <line class="lamp-ray" x1="364" y1="110" x2="374" y2="110"/>
          <line class="lamp-ray" x1="316" y1="90" x2="309" y2="83"/>
          <line class="lamp-ray" x1="356" y1="130" x2="363" y2="137"/>
          <line class="lamp-ray" x1="356" y1="90" x2="363" y2="83"/>
          <line class="lamp-ray" x1="316" y1="130" x2="309" y2="137"/>
        </g>
        <text class="gate-text" x="336" y="170" style="fill: var(--muted)">lâmpada</text>
        <text class="gate-text" x="195" y="190" id="expr-text" style="fill: var(--mint); font-size: 12px">A · B</text>
      </svg>
      <table class="truth" aria-label="Tabela verdade">
        <thead><tr><th>A</th><th>B</th><th id="th-out">A · B</th></tr></thead>
        <tbody id="truth-body"></tbody>
      </table>
      <p class="widget-note" id="logic-note">O E só acende com as duas entradas ligadas.</p>
    </div>
  `;

  const lamp = el.querySelector("#lamp");
  const wireA = el.querySelector("#wire-a");
  const wireB = el.querySelector("#wire-b");
  const wireOut = el.querySelector("#wire-out");
  const nodeA = el.querySelector("#node-a");
  const nodeB = el.querySelector("#node-b");
  const outNode = el.querySelector("#out-node");
  const gateName = el.querySelector("#gate-name");
  const exprText = el.querySelector("#expr-text");
  const thOut = el.querySelector("#th-out");
  const truthBody = el.querySelector("#truth-body");
  const note = el.querySelector("#logic-note");
  const switchA = el.querySelector('[data-in="a"]');
  const switchB = el.querySelector('[data-in="b"]');

  const notes = {
    and: "O E só acende com as duas entradas ligadas. É o operador do 'e também'.",
    or: "O OU acende se qualquer uma estiver ligada. É o 'ou' inclusivo, não o da dúvida.",
    xor: "O OU exclusivo acende quando as entradas são diferentes. É o 'um ou outro, não os dois'.",
    nand: "O NÃO E é o E com a saída invertida. Com ele dá para construir qualquer outro circuito.",
  };

  function render() {
    const g = GATES[gate];
    const out = g.fn(a, b);
    switchA.setAttribute("aria-pressed", String(a));
    switchB.setAttribute("aria-pressed", String(b));
    nodeA.classList.toggle("on", a);
    nodeB.classList.toggle("on", b);
    outNode.classList.toggle("on", out);
    wireA.classList.toggle("live", a);
    wireB.classList.toggle("live", b);
    wireOut.classList.toggle("live", out);
    lamp.classList.toggle("on", out);
    gateName.textContent = g.name;
    exprText.textContent = g.symbol;
    thOut.textContent = g.symbol;
    note.textContent = notes[gate];
    truthBody.innerHTML = [false, false, true, true].map((av, i) => {
      const bv = [false, true, false, true][i];
      const ov = g.fn(av, bv);
      const active = av === a && bv === b;
      return `<tr class="${active ? "active" : ""}">
        <td>${av ? 1 : 0}</td><td>${bv ? 1 : 0}</td><td>${ov ? 1 : 0}</td>
      </tr>`;
    }).join("");
  }

  function toggle(which) {
    if (which === "a") a = !a; else b = !b;
    api.audio.blip();
    render();
  }

  switchA.addEventListener("click", () => toggle("a"));
  switchB.addEventListener("click", () => toggle("b"));
  for (const btn of el.querySelectorAll("[data-gate]")) {
    btn.addEventListener("click", () => {
      gate = btn.dataset.gate;
      for (const other of el.querySelectorAll("[data-gate]")) {
        other.setAttribute("aria-selected", String(other === btn));
      }
      api.audio.open();
      render();
    });
  }

  render();

  return () => {
    // os nós morrem junto com o painel; nada global ficou pendurado
  };
}

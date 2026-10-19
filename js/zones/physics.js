// Física: pêndulo, gás, prisma e órbita.

export async function mount(el, api, variant) {
  if (variant === "pendulum") return mountPendulum(el, api);
  if (variant === "thermo") return mountThermo(el, api);
  if (variant === "optics") return mountOptics(el, api);
  if (variant === "gravity") return mountGravity(el, api);
  el.innerHTML = '<p class="widget-fail">Instrumento de Física desconhecido.</p>';
  return () => {};
}

/* ---------------- pêndulo ---------------- */
function mountPendulum(el, api) {
  const W = 380, H = 280;
  const px = 190, py = 34;
  let L = 1.4, g = 9.8, damping = 0.02;
  let theta = 0.7, omega = 0;
  let raf = 0, last = 0, running = true;
  const trail = [];

  el.innerHTML = `
    <div class="widget">
      <div class="widget-head">
        <span class="widget-label">pêndulo de galileu</span>
        <span class="widget-hint">T = 2π√(L/g)</span>
      </div>
      <div class="widget-canvas-wrap"><canvas id="pend-canvas" width="380" height="280"></canvas></div>
      <div class="w-row">
        <label for="pend-l">comprimento</label>
        <input id="pend-l" class="w-range" type="range" min="0.5" max="2.5" step="0.05" value="1.4">
        <label for="pend-g">gravidade</label>
        <input id="pend-g" class="w-range" type="range" min="1.6" max="25" step="0.1" value="9.8">
        <label for="pend-d">atrito</label>
        <input id="pend-d" class="w-range" type="range" min="0" max="0.2" step="0.005" value="0.02">
      </div>
      <div class="w-row">
        <button type="button" class="w-btn" id="pend-push">empurrar</button>
        <button type="button" class="w-btn" id="pend-stop">pausar</button>
        <button type="button" class="w-btn" id="pend-reset">reiniciar</button>
        <span class="phys-readout" id="pend-info"></span>
      </div>
      <p class="widget-note">Para balanços pequenos, o período não depende da amplitude nem da massa. Só do comprimento e da gravidade. Mude o comprimento e veja o relógio mudar de ritmo.</p>
    </div>
  `;
  const canvas = el.querySelector("#pend-canvas");
  const ctx = canvas.getContext("2d");
  const info = el.querySelector("#pend-info");
  const lIn = el.querySelector("#pend-l");
  const gIn = el.querySelector("#pend-g");
  const dIn = el.querySelector("#pend-d");
  const stopBtn = el.querySelector("#pend-stop");

  function draw() {
    ctx.fillStyle = "#05070f";
    ctx.fillRect(0, 0, W, H);
    const Lpx = L * 92;
    const bx = px + Math.sin(theta) * Lpx;
    const by = py + Math.cos(theta) * Lpx;
    trail.push([bx, by]);
    if (trail.length > 48) trail.shift();
    // arco de referência
    ctx.strokeStyle = "rgba(180,140,255,0.12)";
    ctx.beginPath(); ctx.arc(px, py, Lpx, Math.PI * 0.35, Math.PI * 0.65); ctx.stroke();
    // rastro
    for (let i = 0; i < trail.length; i++) {
      const [tx, ty] = trail[i];
      ctx.fillStyle = `rgba(255,122,168,${i / trail.length * 0.35})`;
      ctx.fillRect(tx - 1, ty - 1, 2, 2);
    }
    // haste
    ctx.strokeStyle = "#b8b0d8";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(px, py); ctx.lineTo(bx, by); ctx.stroke();
    // pivô
    ctx.fillStyle = "#3a3358";
    ctx.fillRect(px - 7, py - 5, 14, 9);
    ctx.fillStyle = "#ffc857";
    ctx.fillRect(px - 2, py - 6, 4, 4);
    // massa
    const tilt = Math.max(0, Math.min(1, Math.abs(omega) / 4));
    ctx.fillStyle = "#ffc857";
    ctx.beginPath(); ctx.arc(bx, by, 11, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.35)";
    ctx.beginPath(); ctx.arc(bx - 3, by - 3, 4, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = `rgba(255,122,168,${0.2 + tilt * 0.5})`;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.arc(bx, by, 14, 0, Math.PI * 2); ctx.stroke();
    // energia
    const energy = 0.5 * L * L * omega * omega + g * L * (1 - Math.cos(theta));
    const T = 2 * Math.PI * Math.sqrt(L / g);
    info.innerHTML = `T = <b>${T.toFixed(2)} s</b> · ângulo ${(theta * 180 / Math.PI).toFixed(0)}° · energia ${energy.toFixed(2)}`;
  }

  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.03, (now - (last || now)) / 1000);
    last = now;
    if (running) {
      const alpha = -(g / L) * Math.sin(theta) - damping * omega;
      omega += alpha * dt;
      theta += omega * dt;
      if (Math.abs(theta) > Math.PI * 0.95) { theta = Math.sign(theta) * Math.PI * 0.95; omega *= -0.6; }
    }
    draw();
  }

  function reset() {
    theta = 0.7; omega = 0; trail.length = 0;
    draw();
  }
  lIn.addEventListener("input", () => { L = Number(lIn.value); trail.length = 0; });
  gIn.addEventListener("input", () => { g = Number(gIn.value); trail.length = 0; });
  dIn.addEventListener("input", () => { damping = Number(dIn.value); });
  el.querySelector("#pend-push").addEventListener("click", () => { omega += 1.25; api.audio.blip(); });
  el.querySelector("#pend-reset").addEventListener("click", () => { reset(); api.audio.open(); });
  stopBtn.addEventListener("click", () => {
    running = !running;
    stopBtn.textContent = running ? "pausar" : "continuar";
  });
  draw();
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}

/* ---------------- gás ---------------- */
function mountThermo(el, api) {
  const W = 400, H = 260;
  const box = { x: 18, y: 18, w: 364, h: 208 };
  const parts = [];
  let T = 300;
  let hits = 0;
  let lastPressure = 0;
  let raf = 0, last = 0;

  function speed() { return 0.35 + Math.sqrt(T) * 0.06; }
  function reset() {
    parts.length = 0;
    for (let i = 0; i < 76; i++) {
      const a = Math.random() * Math.PI * 2;
      const s = speed();
      parts.push({
        x: box.x + 6 + Math.random() * (box.w - 12),
        y: box.y + 6 + Math.random() * (box.h - 12),
        vx: Math.cos(a) * s,
        vy: Math.sin(a) * s,
      });
    }
  }
  reset();

  el.innerHTML = `
    <div class="widget">
      <div class="widget-head">
        <span class="widget-label">caixa de gás</span>
        <span class="widget-hint">temperatura é agitação</span>
      </div>
      <div class="widget-canvas-wrap"><canvas id="thermo-canvas" width="400" height="260"></canvas></div>
      <div class="w-row">
        <label for="thermo-t">temperatura</label>
        <input id="thermo-t" class="w-range" type="range" min="80" max="900" step="10" value="300">
        <b id="thermo-t-label" style="font-family:var(--mono);color:var(--amber)">300 K</b>
        <button type="button" class="w-btn" id="thermo-reset">reembaralhar</button>
      </div>
      <div class="phys-readout" id="thermo-info"></div>
      <p class="widget-note">As partículas não têm termômetro. A temperatura é a média da agitação. A pressão vem dos choques contra as paredes: mais temperatura, mais choques, mais pressão. O volume aqui é fixo.</p>
    </div>
  `;
  const canvas = el.querySelector("#thermo-canvas");
  const ctx = canvas.getContext("2d");
  const tIn = el.querySelector("#thermo-t");
  const tLabel = el.querySelector("#thermo-t-label");
  const info = el.querySelector("#thermo-info");

  function adjust() {
    const target = speed();
    for (const p of parts) {
      const m = Math.hypot(p.vx, p.vy) || 1;
      p.vx = p.vx / m * target;
      p.vy = p.vy / m * target;
    }
  }
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.04, (now - (last || now)) / 1000);
    last = now;
    // movimento
    for (const p of parts) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < box.x + 5) { p.x = box.x + 5; p.vx = Math.abs(p.vx); hits++; }
      if (p.x > box.x + box.w - 5) { p.x = box.x + box.w - 5; p.vx = -Math.abs(p.vx); hits++; }
      if (p.y < box.y + 5) { p.y = box.y + 5; p.vy = Math.abs(p.vy); hits++; }
      if (p.y > box.y + box.h - 5) { p.y = box.y + box.h - 5; p.vy = -Math.abs(p.vy); hits++; }
    }
    // desenho
    ctx.fillStyle = "#05070f";
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(255,159,107,0.45)";
    ctx.lineWidth = 2;
    ctx.strokeRect(box.x, box.y, box.w, box.h);
    for (const p of parts) {
      const sp = Math.hypot(p.vx, p.vy);
      const k = Math.min(1, sp / 3);
      const r = Math.round(107 + k * 148);
      const g = Math.round(213 - k * 90);
      const b = Math.round(255 - k * 180);
      ctx.fillStyle = `rgb(${r},${g},${b})`;
      ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3);
    }
    ctx.fillStyle = "rgba(220,215,255,0.45)";
    ctx.font = "10px ui-monospace, monospace";
    ctx.fillText("volume fixo · cada choque conta", 22, H - 8);
    if (now - (frame.p ?? now) > 600) {
      lastPressure = hits;
      hits = 0;
      frame.p = now;
    }
  }
  tIn.addEventListener("input", () => {
    T = Number(tIn.value);
    tLabel.textContent = `${T} K`;
    adjust();
  });
  el.querySelector("#thermo-reset").addEventListener("click", () => { reset(); api.audio.blip(); });
  adjust();
  raf = requestAnimationFrame(frame);
  const timer = setInterval(() => {
    info.innerHTML = `T = <b>${T} K</b> · colisões/s ≈ <b>${lastPressure}</b> · pressão relativa <b>${(lastPressure * Math.sqrt(T) / 900).toFixed(1)}</b>`;
  }, 650);
  return () => { cancelAnimationFrame(raf); clearInterval(timer); };
}

/* ---------------- prisma ---------------- */
function mountOptics(el, api) {
  const W = 400, H = 260;
  let angle = 45;
  let material = "vidro";
  const MATS = { vidro: 1.52, agua: 1.33, diamante: 2.42 };
  const COLORS = ["#ff5b5b", "#ff9f43", "#ffd166", "#7ee787", "#6bd5ff", "#7c9cff", "#c77dff"];

  el.innerHTML = `
    <div class="widget">
      <div class="widget-head">
        <span class="widget-label">prisma de newton</span>
        <span class="widget-hint">branco é a soma de todas</span>
      </div>
      <div class="widget-canvas-wrap"><canvas id="opt-canvas" width="400" height="260"></canvas></div>
      <div class="w-row">
        <label for="opt-angle">incidência</label>
        <input id="opt-angle" class="w-range" type="range" min="20" max="70" step="1" value="45">
        <b id="opt-angle-label" style="font-family:var(--mono);color:var(--amber)">45°</b>
        <select id="opt-mat" class="w-btn">
          <option value="vidro">vidro (n=1,52)</option>
          <option value="agua">água (n=1,33)</option>
          <option value="diamante">diamante (n=2,42)</option>
        </select>
      </div>
      <div class="phys-readout" id="opt-info"></div>
      <p class="widget-note">A luz branca entra e cada comprimento de onda desvia um pouco diferente. Quanto maior o índice de refração do material, maior a separação. O desenho é esquemático: as cores estão exageradas para caber na tela.</p>
    </div>
  `;
  const canvas = el.querySelector("#opt-canvas");
  const ctx = canvas.getContext("2d");
  const aIn = el.querySelector("#opt-angle");
  const aLabel = el.querySelector("#opt-angle-label");
  const mat = el.querySelector("#opt-mat");
  const info = el.querySelector("#opt-info");

  function draw() {
    ctx.fillStyle = "#05070f";
    ctx.fillRect(0, 0, W, H);
    ctx.strokeStyle = "rgba(180,140,255,0.08)";
    for (let x = 0; x < W; x += 20) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
    for (let y = 0; y < H; y += 20) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

    const p1 = [200, 54], p2 = [132, 196], p3 = [268, 196];
    ctx.fillStyle = "rgba(180,140,255,0.16)";
    ctx.strokeStyle = "rgba(220,208,255,0.7)";
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.moveTo(...p1); ctx.lineTo(...p2); ctx.lineTo(...p3); ctx.closePath();
    ctx.fill(); ctx.stroke();

    const t = 0.34 + angle / 220;
    const entry = [p1[0] + (p2[0] - p1[0]) * t, p1[1] + (p2[1] - p1[1]) * t];
    const t2 = 0.58;
    const exit = [p1[0] + (p3[0] - p1[0]) * t2, p1[1] + (p3[1] - p1[1]) * t2];
    // raio branco
    ctx.strokeStyle = "rgba(255,255,255,0.9)";
    ctx.lineWidth = 2.5;
    ctx.beginPath(); ctx.moveTo(14, entry[1] - 16); ctx.lineTo(entry[0], entry[1]); ctx.stroke();
    // dentro do prisma
    ctx.strokeStyle = "rgba(255,255,255,0.55)";
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(entry[0], entry[1]); ctx.lineTo(exit[0], exit[1]); ctx.stroke();
    // leque
    const spread = (MATS[material] - 1.2) * 34 + (angle - 20) * 0.25;
    COLORS.forEach((c, i) => {
      const k = (i - 3) / 3;
      const ex = 388;
      const ey = exit[1] + k * spread + (i - 3) * 1.5;
      ctx.strokeStyle = c;
      ctx.lineWidth = 1.8;
      ctx.beginPath(); ctx.moveTo(exit[0], exit[1]); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.globalAlpha = 0.16;
      ctx.lineWidth = 5;
      ctx.beginPath(); ctx.moveTo(exit[0], exit[1]); ctx.lineTo(ex, ey); ctx.stroke();
      ctx.globalAlpha = 1;
    });
    ctx.fillStyle = "rgba(255,255,255,0.75)";
    ctx.font = "10px ui-monospace, monospace";
    ctx.fillText("luz branca", 16, entry[1] - 22);
    ctx.fillStyle = "rgba(220,215,255,0.6)";
    ctx.fillText("prisma", 184, 216);
    info.innerHTML = `material: <b>${material}</b> · n = <b>${MATS[material]}</b> · separação ${spread.toFixed(0)} px`;
  }
  aIn.addEventListener("input", () => { angle = Number(aIn.value); aLabel.textContent = `${angle}°`; draw(); });
  mat.addEventListener("change", () => { material = mat.value; draw(); api.audio.blip(); });
  draw();
  return () => {};
}

/* ---------------- órbita ---------------- */
function mountGravity(el, api) {
  const W = 400, H = 280;
  const cx = 200, cy = 140;
  const GM = 150000;
  let mult = 1;
  let planet = { x: 320, y: 140, vx: 0, vy: 0 };
  let trail = [];
  let raf = 0, last = 0;
  let status = "pronto";

  el.innerHTML = `
    <div class="widget">
      <div class="widget-head">
        <span class="widget-label">poço gravitacional</span>
        <span class="widget-hint">cair sem bater</span>
      </div>
      <div class="widget-canvas-wrap"><canvas id="grav-canvas" width="400" height="280"></canvas></div>
      <div class="w-row">
        <label for="grav-v">velocidade de lançamento</label>
        <input id="grav-v" class="w-range" type="range" min="0.6" max="1.5" step="0.01" value="1">
        <b id="grav-v-label" style="font-family:var(--mono);color:var(--amber)">1.00×</b>
        <button type="button" class="w-btn" id="grav-launch">lançar</button>
      </div>
      <div class="phys-readout" id="grav-info"></div>
      <p class="widget-note">A velocidade circular é a que faz o corpo errar o chão para sempre. Um pouco mais e ele escapa; um pouco menos e a órbita encolhe. A órbita é uma queda contínua com a direção certa.</p>
    </div>
  `;
  const canvas = el.querySelector("#grav-canvas");
  const ctx = canvas.getContext("2d");
  const vIn = el.querySelector("#grav-v");
  const vLabel = el.querySelector("#grav-v-label");
  const info = el.querySelector("#grav-info");

  function launch() {
    const r = 120;
    const vCirc = Math.sqrt(GM / r);
    planet = { x: cx + r, y: cy, vx: 0, vy: -vCirc * mult };
    trail = [];
    status = "em órbita";
    api.audio.blip();
  }
  function draw() {
    ctx.fillStyle = "#05070f";
    ctx.fillRect(0, 0, W, H);
    // grade radial
    ctx.strokeStyle = "rgba(255,200,87,0.08)";
    for (const r of [40, 80, 120, 160, 200]) {
      ctx.beginPath(); ctx.arc(cx, cy, r, 0, Math.PI * 2); ctx.stroke();
    }
    // estrela
    const glow = ctx.createRadialGradient(cx, cy, 2, cx, cy, 28);
    glow.addColorStop(0, "rgba(255,200,87,0.55)");
    glow.addColorStop(1, "rgba(255,200,87,0)");
    ctx.fillStyle = glow;
    ctx.fillRect(cx - 30, cy - 30, 60, 60);
    ctx.fillStyle = "#ffd479";
    ctx.beginPath(); ctx.arc(cx, cy, 9, 0, Math.PI * 2); ctx.fill();
    // rastro
    for (let i = 0; i < trail.length; i++) {
      const [x, y] = trail[i];
      ctx.fillStyle = `rgba(107,213,255,${i / trail.length * 0.45})`;
      ctx.fillRect(x - 1, y - 1, 2, 2);
    }
    // planeta
    ctx.fillStyle = "#6bd5ff";
    ctx.beginPath(); ctx.arc(planet.x, planet.y, 4.5, 0, Math.PI * 2); ctx.fill();
    ctx.strokeStyle = "rgba(107,213,255,0.4)";
    ctx.beginPath(); ctx.arc(planet.x, planet.y, 8, 0, Math.PI * 2); ctx.stroke();
    ctx.fillStyle = "rgba(220,215,255,0.55)";
    ctx.font = "10px ui-monospace, monospace";
    ctx.fillText("arraste a velocidade e lance", 16, H - 10);
    ctx.fillStyle = "#ffc857";
    ctx.fillText(status, 16, 18);
  }
  function frame(now) {
    raf = requestAnimationFrame(frame);
    const dt = 0.032 * 2.2;
    last = now;
    const dx = cx - planet.x, dy = cy - planet.y;
    const r2 = Math.max(80, dx * dx + dy * dy);
    const r = Math.sqrt(r2);
    const a = GM / r2;
    planet.vx += a * dx / r * dt;
    planet.vy += a * dy / r * dt;
    planet.x += planet.vx * dt;
    planet.y += planet.vy * dt;
    trail.push([planet.x, planet.y]);
    if (trail.length > 420) trail.shift();
    if (r < 16) status = "colidiu";
    else if (r > 420) status = "escapou";
    else status = "em queda livre";
    const speed = Math.hypot(planet.vx, planet.vy);
    info.innerHTML = `distância <b>${r.toFixed(0)} px</b> · velocidade <b>${speed.toFixed(1)}</b> · ${status}`;
    draw();
  }
  vIn.addEventListener("input", () => { mult = Number(vIn.value); vLabel.textContent = `${mult.toFixed(2)}×`; });
  el.querySelector("#grav-launch").addEventListener("click", launch);
  launch();
  raf = requestAnimationFrame(frame);
  return () => cancelAnimationFrame(raf);
}

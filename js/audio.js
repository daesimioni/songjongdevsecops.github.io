// Som sintetizado na hora, sem arquivo nenhum. O contexto só nasce depois de
// um gesto da pessoa (o botão de entrar), como pede o navegador.

const PENTA = [0, 2, 4, 7, 9, 12, 14, 16];

export function createAudio() {
  let ctx = null;
  let master = null;
  let ambient = null;
  let enabled = false;
  let stepTimer = null;
  let seq = null;

  function ensure() {
    if (!ctx) {
      const AC = window.AudioContext || window.webkitAudioContext;
      if (!AC) return null;
      ctx = new AC();
      master = ctx.createGain();
      master.gain.value = 0.7;
      master.connect(ctx.destination);
      ambient = ctx.createGain();
      ambient.gain.value = 0;
      ambient.connect(master);
      startAmbient();
    }
    if (ctx.state === "suspended") ctx.resume();
    return ctx;
  }

  function startAmbient() {
    if (!ctx) return;
    const filter = ctx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.value = 320;
    filter.Q.value = 0.7;
    filter.connect(ambient);
    for (const [f, type, det] of [[55, "sine", 0], [82.41, "triangle", 4], [110, "sine", -3]]) {
      const o = ctx.createOscillator();
      o.type = type;
      o.frequency.value = f;
      o.detune.value = det;
      const g = ctx.createGain();
      g.gain.value = 0.05;
      o.connect(g).connect(filter);
      o.start();
    }
    const lfo = ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = ctx.createGain();
    lfoGain.gain.value = 0.012;
    lfo.connect(lfoGain).connect(ambient.gain);
    lfo.start();
  }

  function setEnabled(v) {
    enabled = !!v;
    if (enabled) {
      const c = ensure();
      if (!c) return false;
      master.gain.setTargetAtTime(0.7, c.currentTime, 0.08);
      ambient.gain.setTargetAtTime(0.5, c.currentTime, 0.4);
    } else if (ctx) {
      master.gain.setTargetAtTime(0, ctx.currentTime, 0.06);
    }
    return true;
  }

  function isEnabled() { return enabled; }

  function unlock() {
    if (!enabled) return;
    ensure();
    ambient.gain.setTargetAtTime(0.5, ctx.currentTime, 0.5);
  }

  function tone({ freq = 440, type = "sine", dur = 0.2, vol = 0.15,
    slideTo = null, attack = 0.005, release = 0.12 }) {
    if (!enabled || !ensure()) return;
    const t = ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = type;
    o.frequency.setValueAtTime(freq, t);
    if (slideTo) o.frequency.exponentialRampToValueAtTime(Math.max(20, slideTo), t + dur);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + attack);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur + release);
    o.connect(g).connect(master);
    o.start(t);
    o.stop(t + dur + release + 0.02);
  }

  function blip() { tone({ freq: 660, type: "square", dur: 0.05, vol: 0.05 }); }
  function chime() {
    [523.25, 659.25, 783.99].forEach((f, i) => {
      setTimeout(() => tone({ freq: f, type: "triangle", dur: 0.35, vol: 0.12 }), i * 90);
    });
  }
  function open() {
    tone({ freq: 220, type: "sine", dur: 0.18, vol: 0.08, slideTo: 440 });
  }
  function close() {
    tone({ freq: 330, type: "sine", dur: 0.14, vol: 0.06, slideTo: 165 });
  }
  function footstep() {
    tone({ freq: 90, type: "sine", dur: 0.05, vol: 0.025, slideTo: 60 });
  }
  function error() {
    tone({ freq: 140, type: "sawtooth", dur: 0.12, vol: 0.05 });
  }

  function kick(time) {
    if (!ctx) return;
    const t = time || ctx.currentTime;
    const o = ctx.createOscillator();
    o.type = "sine";
    o.frequency.setValueAtTime(150, t);
    o.frequency.exponentialRampToValueAtTime(42, t + 0.12);
    const g = ctx.createGain();
    g.gain.setValueAtTime(0.32, t);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
    o.connect(g).connect(master);
    o.start(t); o.stop(t + 0.18);
  }

  function note(row, col, time) {
    if (!ctx) return;
    const t = time || ctx.currentTime;
    const base = row === 0 ? 110 : row === 1 ? 220 : 440;
    const semis = PENTA[col % PENTA.length] + (row === 2 ? 12 : 0);
    const f = base * Math.pow(2, semis / 12);
    const o = ctx.createOscillator();
    o.type = row === 0 ? "triangle" : "square";
    o.frequency.value = f;
    const g = ctx.createGain();
    const vol = row === 0 ? 0.16 : row === 1 ? 0.07 : 0.035;
    const dur = row === 0 ? 0.22 : 0.12;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.linearRampToValueAtTime(vol, t + 0.008);
    g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
    o.connect(g).connect(master);
    o.start(t); o.stop(t + dur + 0.02);
  }

  // sequenciador de 8 passos; pattern é uma matriz [3][8]
  function startSequencer(pattern, bpm = 96, onStep = null) {
    stopSequencer();
    if (!enabled) { ensure(); enabled = true; setEnabled(true); }
    const stepDur = 60 / bpm / 2; // colcheias
    let step = 0;
    let nextTime = ctx.currentTime + 0.08;
    stepTimer = setInterval(() => {
      if (!ctx) return;
      while (nextTime < ctx.currentTime + 0.12) {
        for (let row = 0; row < 3; row++) {
          if (pattern[row] && pattern[row][step % 8]) {
            if (row === 0) kick(nextTime);
            else note(row, step, nextTime);
          }
        }
        if (onStep) onStep(step % 8);
        step++;
        nextTime += stepDur;
      }
    }, 25);
    seq = { stop: stopSequencer, setBpm: null };
    return seq;
  }

  function stopSequencer() {
    if (stepTimer) clearInterval(stepTimer);
    stepTimer = null;
    seq = null;
  }

  return {
    unlock, setEnabled, isEnabled, chime, blip, open, close, footstep, error,
    startSequencer, stopSequencer,
    get ctx() { return ctx; },
  };
}

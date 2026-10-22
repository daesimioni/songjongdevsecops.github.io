// Interpolação dos outros jogadores. Cada pacote vira uma amostra com hora de
// chegada; o desenho usa um instante no passado, entre duas amostras. É o que
// transforma o estado de 10 Hz em caminhada contínua.
export const TELEPORT_DISTANCE = 8;

export function addPeerSample(peer, x, y, now, t = now) {
  if (!peer.samples) peer.samples = [];
  const last = peer.samples[peer.samples.length - 1];
  if (last && Math.hypot(x - last.x, y - last.y) > TELEPORT_DISTANCE) {
    peer.samples.length = 0;
  }
  peer.samples.push({ t, x, y });
  if (peer.samples.length > 12) peer.samples.shift();
}

// O remetente manda um número de sequência a cada estado (10 Hz). Usar a
// sequência para datar as amostras evita que pacotes que chegam juntos virem
// um pulo: o intervalo de envio é conhecido, mesmo quando a rede agrupa.
export function feedPeer(peer, now, stateEvery = 100, interpDelay = 200) {
  if (!peer.samples) peer.samples = [];
  const seq = Number(peer.seq) || 0;
  if (!seq) {
    addPeerSample(peer, peer.x, peer.y, now);
    return;
  }
  if (peer.lastSeq === undefined) {
    peer.lastSeq = seq;
    peer.lastSampleT = now - interpDelay;
    addPeerSample(peer, peer.x, peer.y, now, peer.lastSampleT);
    return;
  }
  if (seq < peer.lastSeq) {
    // pacote atrasado: descarta. Só trata como reinício se o número voltou
    // muito para trás (outro navegador, outra sessão).
    if (peer.lastSeq - seq > 100) {
      peer.samples.length = 0;
      peer.lastSeq = seq;
      peer.lastSampleT = now - interpDelay;
      addPeerSample(peer, peer.x, peer.y, now, peer.lastSampleT);
    }
    return;
  }
  if (seq === peer.lastSeq) return;
  const steps = Math.min(10, seq - peer.lastSeq);
  peer.lastSampleT += stateEvery * steps;
  addPeerSample(peer, peer.x, peer.y, now, peer.lastSampleT);
  peer.lastSeq = seq;
  if (peer.samples.length === 1) {
    peer.lastSampleT = now - interpDelay;
    peer.samples[0].t = peer.lastSampleT;
  }
}

export function peerRenderPosition(peer, now, delay = 200) {
  const s = peer.samples;
  if (!s || !s.length) return { x: peer.x, y: peer.y };
  const target = now - delay;
  if (target <= s[0].t) return { x: s[0].x, y: s[0].y };
  for (let i = 1; i < s.length; i++) {
    if (s[i].t >= target) {
      const a = s[i - 1];
      const b = s[i];
      const span = b.t - a.t;
      const f = span > 0 ? (target - a.t) / span : 1;
      return {
        x: a.x + (b.x - a.x) * f,
        y: a.y + (b.y - a.y) * f,
      };
    }
  }
  const a = s[s.length - 2];
  const b = s[s.length - 1];
  if (!a) return { x: b.x, y: b.y };
  const span = b.t - a.t;
  const extra = Math.min(120, target - b.t);
  if (span > 0 && extra > 0) {
    return {
      x: b.x + ((b.x - a.x) / span) * extra,
      y: b.y + ((b.y - a.y) / span) * extra,
    };
  }
  return { x: b.x, y: b.y };
}

// Patrulha: rota fixa de quatro pontos em volta do posto. O bicho escolhe o
// próximo ponto ao chegar no atual, então a volta é previsível e o jogador
// aprende o ritmo em vez de encarar um passeio sorteado a cada pausa.
// O raio é o mesmo do passeio (roam): a colocação dos postos já reserva esse
// disco, e patrulhar mais longe furaria a garantia de que dois campos de visão
// não se cruzam.
const OITAVOS = 8;

export function rotaDePatrulha({ x, y, seed, raio = 0.6 } = {}) {
  const px = Number(x);
  const py = Number(y);
  const r = Number(raio);
  if (!Number.isFinite(px) || !Number.isFinite(py) || !Number.isFinite(r) || r <= 0) return [];
  let h = 0;
  for (const ch of String(seed ?? "")) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  const inicio = h % OITAVOS;
  const passo = 1 + ((h >>> 8) % 2);
  return [0, passo, passo * 2, passo * 3].map((giro) => {
    const a = (((inicio + giro) % OITAVOS) * Math.PI) / 4;
    return { x: +(px + Math.cos(a) * r).toFixed(2), y: +(py + Math.sin(a) * r).toFixed(2) };
  });
}

export function pontoDaRota({ rota, indice } = {}) {
  if (!Array.isArray(rota) || !rota.length) return null;
  const i = Number.isInteger(indice) ? ((indice % rota.length) + rota.length) % rota.length : 0;
  const ponto = rota[i];
  return ponto && Number.isFinite(ponto.x) && Number.isFinite(ponto.y) ? ponto : null;
}

// Audição do bicho: correr faz barulho. Quem está perto e ainda não viu o
// jogador vira para o som e mostra "?"; o duelo continua nascendo só da visão.
export const RAIO_DE_AUDICAO = 6.5;

export function ouveOPassoS({ sprint, dist, vendo, boss } = {}) {
  if (!sprint || boss || vendo) return false;
  const d = Number(dist);
  return Number.isFinite(d) && d > 0.2 && d < RAIO_DE_AUDICAO;
}

// Direção cardinal para onde olhar: 0 sul, 1 oeste, 2 leste, 3 norte.
export function direcaoPara(x, y, tx, ty) {
  const dx = Number(tx) - Number(x);
  const dy = Number(ty) - Number(y);
  if (!Number.isFinite(dx) || !Number.isFinite(dy)) return 0;
  if (dx === 0 && dy === 0) return 0;
  if (Math.abs(dx) > Math.abs(dy)) return dx > 0 ? 2 : 1;
  return dy > 0 ? 0 : 3;
}

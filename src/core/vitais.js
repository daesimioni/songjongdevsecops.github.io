// Frações de vida e mana para as barrinhas do nome do jogador. Fora do jogo
// (nó de teste) não há canvas: a conta é pura e o desenho mora no renderer.
export function fracoesDeVida({ hp = 0, hpMax = 0, mana = 0, manaMax = 0 } = {}) {
  const vida = hpMax > 0 ? Math.max(0, Math.min(1, hp / hpMax)) : 0;
  const manaFracao = manaMax > 0 ? Math.max(0, Math.min(1, mana / manaMax)) : 0;
  return { vida, mana: manaFracao };
}

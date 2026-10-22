// Frações de vida e mana para as barrinhas do nome do jogador. Fora do jogo
// (nó de teste) não há canvas: a conta é pura e o desenho mora no renderer.
export function fracoesDeVida({ hp = 0, hpMax = 0, mana = 0, manaMax = 0 } = {}) {
  const vida = hpMax > 0 ? Math.max(0, Math.min(1, hp / hpMax)) : 0;
  const manaFracao = manaMax > 0 ? Math.max(0, Math.min(1, mana / manaMax)) : 0;
  return { vida, mana: manaFracao };
}

// A placa do nome fica embaixo e as barras de vida e mana ficam acima dela,
// com folga entre as duas barras e entre elas e a placa. O layout é puro para
// o teste medir a ordem e o espaçamento sem navegador.
export function layoutDaPlacaDoNome(py) {
  const alto = 2, folga = 3, vao = 4;
  const alturaNome = 9;
  const topoNome = py - 11;
  const alturaBarras = alto * 2 + folga * 3;
  const topoBarras = topoNome - vao - alturaBarras;
  return {
    alto, folga, vao, alturaNome, topoNome, alturaBarras, topoBarras,
    topoVida: topoBarras + folga,
    topoMana: topoBarras + folga * 2 + alto,
  };
}

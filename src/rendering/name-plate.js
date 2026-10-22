// A placa do jogador: nome, vida e mana em pixels de tela, tamanho fixo e
// sempre por cima do mundo. A mesma no vale, na caverna e dentro de casa.
import { fracoesDeVida } from "../core/vitais.js";

export const PLACA = {
  fonte: "10px ui-monospace, monospace",
  alturaNome: 16,
  paddingNome: 4,
  barra: 4,
  vaoBarras: 5,
  paddingBarras: 4,
  vao: 4,
  gapCabeca: 4,
  // metade da largura do nome máximo (dezesseis letras): nome comprido não
  // estica a vida
  larguraBarras: 52,
};

// A folga do nome para a cabeça é a mesma das barras para o nome; o layout é
// puro para o teste medir sem navegador.
export function geometriaDaPlaca(cabecaY) {
  const alturaBarras = PLACA.paddingBarras * 2 + PLACA.barra * 2 + PLACA.vaoBarras;
  const nomeTopo = Math.round(cabecaY - PLACA.gapCabeca - PLACA.alturaNome);
  const barrasTopo = Math.round(nomeTopo - PLACA.vao - alturaBarras);
  return { alturaBarras, nomeTopo, barrasTopo };
}

export function desenharPlacaDoJogador(ctx, { nome, cor, vitais, x, cabecaY } = {}) {
  if (!ctx || !nome) return;
  const p = PLACA;
  ctx.save();
  // a placa vive na tela: nada de escala, câmera, noite ou vinheta por cima
  ctx.setTransform(1, 0, 0, 1, 0, 0);
  ctx.font = p.fonte;
  ctx.textAlign = "center";
  const larguraNome = Math.ceil(ctx.measureText(String(nome)).width) + p.paddingNome * 2;
  const { alturaBarras, nomeTopo, barrasTopo } = geometriaDaPlaca(cabecaY);

  // placa das barras
  const xBarras = Math.round(x - p.larguraBarras / 2);
  ctx.fillStyle = "rgba(8,10,20,0.78)";
  ctx.beginPath();
  ctx.roundRect(xBarras, barrasTopo, p.larguraBarras, alturaBarras, 3);
  ctx.fill();
  const f = fracoesDeVida(vitais);
  const bx = xBarras + p.paddingBarras;
  const bw = p.larguraBarras - p.paddingBarras * 2;
  const vidaY = barrasTopo + p.paddingBarras;
  const manaY = vidaY + p.barra + p.vaoBarras;
  ctx.fillStyle = "#3a1f2c";
  ctx.fillRect(bx, vidaY, bw, p.barra);
  ctx.fillStyle = "#ff5a86";
  ctx.fillRect(bx, vidaY, Math.round(bw * f.vida), p.barra);
  ctx.fillStyle = "#16283a";
  ctx.fillRect(bx, manaY, bw, p.barra);
  ctx.fillStyle = "#6bd5ff";
  ctx.fillRect(bx, manaY, Math.round(bw * f.mana), p.barra);

  // placa do nome
  const xNome = Math.round(x - larguraNome / 2);
  ctx.fillStyle = "rgba(8,10,20,0.7)";
  ctx.beginPath();
  ctx.roundRect(xNome, nomeTopo, larguraNome, p.alturaNome, 3);
  ctx.fill();
  ctx.fillStyle = cor || "#eae4ff";
  ctx.fillText(String(nome), Math.round(x), nomeTopo + 12);
  ctx.textAlign = "left";
  ctx.restore();
}

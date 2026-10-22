// Deformação só da parte flexível: a faixa inferior (tronco/raízes) não muda.
// Buffer único reaproveitado; somente poses novas passam por este caminho.
let buffer;
export function paintFoliage(g, def, p, v, q, type) {
  if (typeof document === "undefined" || typeof g.drawImage !== "function")
    return def.desenhar(g, p, v, q);
  const pad = 8,
    w = (def.w + pad * 2) * 2,
    h = (def.h + pad * 2) * 2;
  if (!buffer) buffer = document.createElement("canvas");
  if (buffer.width !== w) buffer.width = w;
  if (buffer.height !== h) buffer.height = h;
  const a = buffer.getContext("2d");
  a.setTransform(2, 0, 0, 2, pad * 2, pad * 2);
  a.clearRect(-pad, -pad, def.w + pad * 2, def.h + pad * 2);
  def.desenhar(a, p, v, q);
  const root = type === "arvore" || type === "conifera" ? 12 : 4;
  const bend = [0, 1, 0, -1][q % 4] * (type === "seca" ? 1.5 : 0.65);
  for (let row = 0; row < h; row++) {
    const y = row / 2 - pad,
      flex = Math.max(0, 1 - y / Math.max(1, def.h - root));
    const dx = Math.round(bend * flex * flex * 2) / 2;
    g.drawImage(buffer, 0, row, w, 1, -pad + dx, y, w / 2, 0.5);
  }
}

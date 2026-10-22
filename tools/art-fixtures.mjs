// Matriz de estados compartilhada por pranchas e prova de pixels nativos.
import * as art from "../src/rendering/dungeon-art.js";
const accent = "#78bfa7";
export const fixtures = [
  ...[
    "drawTorch",
    "drawAltar",
    "drawElevador",
    "drawMesa",
    "drawForge",
    "drawWaystone",
    "drawPortal",
    "drawTunnel",
    "drawKeeper",
    "drawEnchanter",
  ].map((name) => ({
    id: name,
    draw: (g, t) => art[name](g, 0, 0, t, accent),
  })),
  ...["drawOficina", "drawBiblioteca", "drawObservatorio"].flatMap((name) =>
    [0, 1, 2].map((v) => ({
      id: `${name}/${v}`,
      draw: (g, t) => art[name](g, 0, 0, t, accent, v),
    })),
  ),
  ...[false, true].map((open) => ({
    id: `bau/${open}`,
    draw: (g) => art.drawChest(g, 0, 0, open, accent),
  })),
  ...[
    [false, false],
    [true, false],
    [true, true],
  ].map(([planted, ready]) => ({
    id: `horta/${planted}/${ready}`,
    draw: (g, t) => art.drawPlot(g, 0, 0, t, accent, planted, ready),
  })),
  ...[0, 3].map((charges) => ({
    id: `veio/${charges}`,
    draw: (g, t) => art.drawVein(g, 0, 0, t, accent, charges),
  })),
  { id: "escada", draw: (g, t) => art.drawStairs(g, 0, 0, accent, t) },
  { id: "bilhete", draw: (g, t) => art.drawBilhete(g, 0, 0, t, accent) },
  { id: "isca", draw: (g, t) => art.drawIsca(g, 0, 0, t, accent) },
  {
    id: "edificio",
    draw: (g) =>
      art.drawBuilding(g, -15, -28, 30, 28, { wallTop: "#768887" }, accent),
  },
];

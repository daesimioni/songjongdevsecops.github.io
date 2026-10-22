// Vocabulário dos móveis do subsolo: cantaria, madeira, metal, vidro e papel.
// Todo detalhe respeita o alfa já desenhado, inclusive portas e vãos.
export const FIXTURE_DETAILS = Object.freeze({
  drawChest: "wood",
  drawStairs: "stone",
  drawTorch: "fire",
  drawAltar: "stone",
  drawElevador: "metal",
  drawMesa: "paper",
  drawForge: "fire",
  drawOficina: "metal",
  drawBiblioteca: "paper",
  drawObservatorio: "glass",
  drawBilhete: "paper",
  drawIsca: "organic",
  drawWaystone: "rune",
  drawPortal: "rune",
  drawTunnel: "stone",
  drawKeeper: "cloth",
  drawPlot: "organic",
  drawVein: "crystal",
  drawEnchanter: "rune",
});
export function detailFixture(g, name, time = 0) {
  const material = FIXTURE_DETAILS[name];
  if (!material) return;
  const line = (x, y, w, h, c) => {
    g.fillStyle = c;
    g.fillRect(x, y, w, h);
  };
  g.save();
  g.globalCompositeOperation = "source-atop";
  if (material === "wood") {
    for (let i = 0; i < 5; i++) {
      line(-6 + i * 3, -7, 0.5, 6, "#362d2c");
      line(-5 + i * 3, -8, 0.5, 0.5, "#ddc295");
    }
    line(-5, -3, 10, 0.5, "#b08754");
  } else if (material === "stone") {
    for (let y = -23; y < -2; y += 4)
      for (let x = -16 + (y % 3); x < 17; x += 7) {
        line(x, y, 5, 0.5, "#222a3a");
        line(x, y, 0.5, 3, "#6e7786");
      }
  } else if (material === "metal" || material === "fire") {
    for (let i = 0; i < 6; i++) {
      line(-10 + i * 4, -8, 0.5, 0.5, "#eed6af");
      line(-10 + i * 4, -7, 0.5, 0.5, "#202d3d");
    }
    line(-9, -11, 16, 0.5, "#91a0ab");
    line(7, -9, 0.5, 6, "#202d3d");
    if (material === "fire") {
      const phase = Math.floor(time / 120) % 4;
      for (let i = 0; i < 4; i++)
        line(
          -4 + i * 2,
          -8 - ((i + phase) % 3),
          0.5,
          0.5,
          i % 2 ? "#ffc67a" : "#ffeac1",
        );
    }
  } else if (material === "paper") {
    for (let i = 0; i < 6; i++) {
      line(-8 + i * 3, -12, 0.5, 3, "#dcc6a1");
      line(-8 + i * 3, -9, 0.5, 0.5, "#756b7a");
    }
    line(-9, -5, 18, 0.5, "#ad8761");
  } else if (material === "glass" || material === "crystal") {
    for (let i = 0; i < 4; i++) {
      line(-6 + i * 4, -16 + (i % 2), 0.5, 3, "#d7e7d7");
      line(-5 + i * 4, -12 + (i % 2), 0.5, 2, "#2c3b53");
    }
  } else if (material === "organic") {
    for (let i = 0; i < 7; i++) {
      line(
        -8 + ((i * 3) % 16),
        -4 - (i % 3),
        1,
        0.5,
        i % 2 ? "#8eae72" : "#3c644c",
      );
    }
  } else if (material === "cloth") {
    line(-3, -10, 0.5, 7, "#d5c09d");
    line(3, -9, 0.5, 6, "#222c41");
    line(-4, -4, 8, 0.5, "#b1a283");
  } else if (material === "rune") {
    for (let side = -1; side <= 1; side += 2) {
      line(side * 8, -14, 0.5, 5, "#b2bca4");
      line(side * 8 - 1, -14, 2, 0.5, "#e1d8ac");
      line(side * 8 - 1, -9, 2, 0.5, "#2b344c");
    }
    line(-3, -3, 6, 0.5, "#7f8c85");
  }
  g.restore();
}

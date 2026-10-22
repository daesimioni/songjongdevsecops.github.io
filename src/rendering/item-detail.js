// Detalhes de fabricação por família, no espaço lógico 32 × 32 do inventário.
// Recorte à própria peça conserva cada silhueta e a legibilidade do slot.
export function detailItem(g, family, seed) {
  const gold = "#d9b981",
    light = "#f0e9d4",
    shadow = "#273344";
  const line = (x, y, w, h, c) => {
    g.fillStyle = c;
    g.fillRect(x, y, w, h);
  };
  g.save();
  g.globalCompositeOperation = "source-atop";
  if (
    ["lamina", "espada", "malho", "maca", "chave", "ferramenta"].includes(
      family,
    )
  ) {
    for (let i = 0; i < 4; i++) {
      line(14 + i * 0.5, 7 + i * 3, 0.5, 2, light);
      line(17 + i * 0.5, 8 + i * 3, 0.5, 2, shadow);
    }
    for (let i = 0; i < 4; i++)
      line(12 + i * 0.5, 22 + i, 4, 0.5, i % 2 ? gold : shadow);
    line(12, 20, 7, 0.5, gold);
    line(13, 20, 1, 1, light);
  } else if (
    ["bastao", "cetro", "cajado", "batuta", "tocha"].includes(family)
  ) {
    for (let i = 0; i < 5; i++) {
      line(14, 13 + i * 2, 2, 0.5, shadow);
      line(14, 14 + i * 2, 0.5, 1, gold);
    }
    line(14, 7, 0.5, 4, light);
    line(13, 9, 1, 1, "#fff7db");
  } else if (
    [
      "manto",
      "casaca",
      "colete",
      "avental",
      "capa",
      "capuz",
      "turbante",
      "perneiras",
    ].includes(family)
  ) {
    for (let side = -1; side <= 1; side += 2)
      for (let i = 0; i < 6; i++) {
        line(
          16 + side * (4 + i * 0.5),
          12 + i * 2,
          0.5,
          2,
          i % 2 ? gold : shadow,
        );
        line(16 + side * 6, 25 - i * 1.5, 0.5, 0.5, light);
      }
    for (let i = 0; i < 3; i++) line(15.5, 14 + i * 3, 0.5, 0.5, gold);
    line(10, 26, 12, 0.5, gold);
  } else if (
    ["elmo", "coroa", "mascara", "escudo", "botas", "fones"].includes(family)
  ) {
    for (let i = 0; i < 6; i++) {
      line(9 + i * 2, 10 + (i % 3) * 5, 0.5, 0.5, light);
      line(10 + i * 2, 11 + (i % 3) * 5, 0.5, 0.5, shadow);
    }
    line(12, 8, 1, 6, light);
    line(21, 14, 0.5, 8, shadow);
    line(14, 19, 4, 0.5, gold);
    line(15.5, 18, 0.5, 3, gold);
  } else if (
    ["gema", "lente", "oculos", "frasco", "pocao", "bomba"].includes(family)
  ) {
    line(11, 12, 0.5, 7, light);
    line(12, 10, 2, 0.5, light);
    line(13, 21, 7, 0.5, light);
    line(21, 13, 0.5, 8, shadow);
    line(16, 8, 3, 0.5, gold);
    for (let i = 0; i < 3; i++)
      line(13 + ((seed + i * 3) % 5), 18 + i * 2, 0.5, 0.5, light);
  } else if (["anel", "colar"].includes(family)) {
    for (let i = 0; i < 8; i++)
      line(
        10 + ((i * 3) % 12),
        11 + ((i * 7) % 11),
        0.5,
        0.5,
        i % 3 ? gold : light,
      );
    line(14, 10, 1, 0.5, light);
    line(18, 17, 0.5, 2, shadow);
  } else if (["livro", "runa", "pena", "caneta"].includes(family)) {
    for (let i = 0; i < 5; i++)
      line(11, 11 + i * 2, 3 + ((seed + i) % 5), 0.5, i % 2 ? shadow : gold);
    line(10, 8, 0.5, 16, light);
    line(20, 11, 0.5, 11, shadow);
    line(11, 25, 10, 0.5, light);
  } else if (["planta", "comida", "peixe"].includes(family)) {
    for (let i = 0; i < 7; i++) {
      line(
        10 + ((i * 3) % 12),
        12 + ((i * 5) % 11),
        0.5,
        1,
        i % 3 ? gold : shadow,
      );
    }
    line(13, 16, 0.5, 6, light);
    line(16, 15, 3, 0.5, light);
  } else if (family === "tech") {
    for (let side = -1; side <= 1; side += 2)
      for (let i = 0; i < 5; i++) {
        line(16 + side * 7, 10 + i * 2, 2, 0.5, gold);
        line(16 + side * 3, 12 + i * 2, 2, 0.5, light);
      }
    line(12, 10, 7, 0.5, shadow);
    line(12, 10, 0.5, 10, light);
  }
  g.restore();
}

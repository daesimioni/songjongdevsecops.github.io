import { familiaDe } from "./item-art.js";
// A família do inventário também decide o que se veste. Óculos e coroas não
// podem virar o mesmo elmo de aço só porque ocupam o mesmo slot.
export function drawHeadgear(g, item, base) {
  const family = item.name ? familiaDe(item) : "elmo",
    color = item.accent || "#b8b0d8";
  const rect = (x, y, w, h, c) => {
    g.fillStyle = c;
    g.fillRect(x, y, w, h);
  };
  const back = base === 3,
    profile = base === 1 || base === 2,
    front = base === 1 ? -1 : 1;
  if (family === "oculos" || family === "lente") {
    if (back) {
      rect(-5, -17, 10, 0.5, "#625967");
      return;
    }
    for (const side of profile || family === "lente" ? [front] : [-1, 1]) {
      rect(side < 0 ? -4 : 1, -18, 3, 3, color);
      rect(side < 0 ? -3.5 : 1.5, -17.5, 2, 2, "#6b9ca4");
      rect(side < 0 ? -3.5 : 1.5, -17.5, 0.5, 0.5, "#eef0d4");
    }
    rect(-1, -17, 2, 0.5, color);
    return;
  }
  if (family === "fones") {
    rect(-5, -23, 10, 1, color);
    rect(-6, -22, 1, 5, color);
    rect(5, -22, 1, 5, color);
    rect(-6, -19, 2, 4, "#293b4c");
    rect(4, -19, 2, 4, "#293b4c");
    rect(-6, -19, 0.5, 3, color);
    rect(5, -19, 0.5, 3, color);
    return;
  }
  if (family === "coroa") {
    rect(-5, -22, 10, 2, color);
    for (const x of [-4, 0, 3]) {
      rect(x, -25, 1, 3, color);
      rect(x, -25, 0.5, 0.5, "#f2e1b5");
    }
    rect(-3, -21, 6, 0.5, "#765d4b");
    if (!back) rect(-0.5, -22, 1, 1, "#a6d1bd");
    return;
  }
  if (family === "mascara") {
    if (back) {
      rect(-5, -18, 10, 1, color);
      return;
    }
    rect(profile ? (front < 0 ? -4 : 1) : -4, -18, profile ? 3 : 8, 4, color);
    rect(
      profile ? (front < 0 ? -4 : 3) : -3,
      -15,
      profile ? 1 : 6,
      0.5,
      "#30354b",
    );
    return;
  }
  if (family === "turbante") {
    rect(-4, -24, 8, 5, color);
    rect(-5, -22, 10, 2, color);
    for (let i = 0; i < 3; i++)
      rect(-3 + i, -23 + i, 6 - i, 0.5, i % 2 ? "#e4cfaa" : "#6c6772");
    rect(back ? 2 : -4, -23, 2, 2, "#d8ba83");
    return;
  }
  if (family === "capuz") {
    rect(-4, -25, 8, 2, color);
    rect(-5, -23, 10, 4, color);
    if (back) {
      rect(-5, -19, 10, 6, color);
      rect(0, -23, 0.5, 9, "#354253");
    } else {
      rect(-5, -20, profile && front < 0 ? 1 : 2, 7, color);
      rect(
        profile && front > 0 ? 4 : 3,
        -20,
        profile && front > 0 ? 1 : 2,
        7,
        color,
      );
      rect(-3, -20, 6, 0.5, "#273447");
      rect(-4, -21, 2, 0.5, "#cbbda5");
    }
    return;
  }
  // Elmo: face fechada atrás, aba e abertura frontal, proteção de nuca no perfil.
  rect(-5, -23, 10, 2, color);
  rect(-3, -23, 3, 0.5, "#e4ddc5");
  if (back) {
    rect(-5, -21, 10, 7, color);
    rect(-4, -14, 8, 1, color);
    rect(0, -22, 0.5, 8, "#4c5265");
  } else if (profile) {
    rect(front < 0 ? -5 : 3, -21, 2, 6, color);
    rect(front < 0 ? 2 : -4, -21, 2, 4, "#58617a");
  } else {
    rect(-5, -21, 2, 5, color);
    rect(3, -21, 2, 5, color);
    rect(-3, -21, 6, 0.5, "#333f56");
  }
}

export function detailGarment(g, item, base, turn, width) {
  if (!item) return;
  const family = familiaDe(item),
    rect = (x, y, w, h, c) => {
      g.fillStyle = c;
      g.fillRect(x, y, w, h);
    };
  if (base === 3) {
    rect(turn, -12, 0.5, 7, "rgba(10,19,34,.3)");
    rect(-width + 1, -12, width * 2 - 2, 0.5, "rgba(244,228,192,.3)");
    return;
  }
  if (family === "avental") {
    rect(-3 + turn, -11, 6, 7, "#c5bda4");
    rect(-2 + turn, -12, 4, 2, "#c5bda4");
    rect(-2 + turn, -7, 4, 2, "#8c9588");
    rect(-2 + turn, -7, 4, 0.5, "#eee0bb");
  } else if (family === "colete") {
    rect(-1 + turn, -12, 2, 8, "#263b4c");
    rect(-3 + turn, -11, 1, 4, "rgba(246,228,187,.3)");
    rect(2 + turn, -11, 1, 4, "rgba(246,228,187,.3)");
  } else if (family === "casaca") {
    rect(turn, -12, 0.5, 8, "#263b4c");
    for (let i = 0; i < 3; i++)
      rect(turn + 1, -11 + i * 2, 0.5, 0.5, "#d5bb88");
    rect(-3, -7, 2, 0.5, "#28374a");
    rect(2, -7, 2, 0.5, "#28374a");
  } else {
    for (let side = -1; side <= 1; side += 2)
      rect(side * (width - 1), -10, 0.5, 5, "rgba(246,228,187,.24)");
    rect(-width + 1, -5, width * 2 - 2, 0.5, "#c2aa80");
  }
}

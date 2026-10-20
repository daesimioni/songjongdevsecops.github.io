// Ícones dos itens desenhados em canvas, no mesmo pixel do mapa. Cada tipo tem
// forma própria: poção, runa, arma, armadura, elmo, bota, escudo, comida,
// material e chave. O cache evita redesenhar o mesmo ícone.

const CORES = {
  cs: "#61f4c0",
  math: "#b48cff",
  physics: "#ff7aa8",
  chem: "#7ee787",
  music: "#ffb26b",
  ai: "#6bd5ff",
  lingua: "#e8c07a",
  hub: "#ffc857",
};

const cache = new Map();

function corDe(item) {
  if (item.heal) return "#ff7aa8";
  if (item.mana) return "#6bd5ff";
  if (item.use === "light") return "#ffc857";
  if (item.use === "bomb") return "#ff9f6b";
  return CORES[item.continent] || "#ffc857";
}

function pintar(ctx, x, y, w, h, cor) {
  ctx.fillStyle = cor;
  ctx.fillRect(x, y, w, h);
}

function desenhar(ctx, item) {
  const c = corDe(item);
  const escuro = "rgba(4, 6, 14, 0.85)";
  ctx.clearRect(0, 0, 32, 32);
  const id = item.id || "";
  const slot = item.slot;

  if (slot === "weapon") {
    if (item.weapon === "wand" || item.weapon === "rod") {
      pintar(ctx, 14, 14, 3, 14, "#6b4a2a");
      pintar(ctx, 15, 11, 2, 4, "#8a6a4a");
      pintar(ctx, 12, 7, 8, 7, escuro);
      pintar(ctx, 13, 8, 6, 5, c);
      pintar(ctx, 15, 9, 2, 3, "#fff3d1");
      pintar(ctx, 10, 6, 2, 2, c);
      pintar(ctx, 20, 12, 2, 2, c);
    } else if (item.weapon === "club") {
      pintar(ctx, 15, 15, 3, 13, "#6b4a2a");
      pintar(ctx, 11, 5, 11, 11, escuro);
      pintar(ctx, 12, 6, 9, 9, "#8a6a4a");
      pintar(ctx, 13, 7, 7, 2, c);
      pintar(ctx, 13, 10, 7, 2, "#5c4028");
    } else {
      pintar(ctx, 7, 24, 7, 3, "#6b4a2a");
      pintar(ctx, 9, 21, 3, 4, "#8a6a4a");
      pintar(ctx, 11, 6, 4, 15, "#d8d2ea");
      pintar(ctx, 12, 5, 2, 3, "#fff");
      pintar(ctx, 12, 7, 1, 13, c);
      pintar(ctx, 7, 19, 12, 2, c);
    }
  } else if (slot === "armor") {
    pintar(ctx, 7, 8, 18, 16, escuro);
    pintar(ctx, 8, 9, 16, 14, c);
    pintar(ctx, 10, 11, 12, 3, "rgba(255,255,255,0.22)");
    pintar(ctx, 6, 11, 3, 8, c);
    pintar(ctx, 23, 11, 3, 8, c);
    pintar(ctx, 13, 16, 6, 7, "#101426");
  } else if (slot === "helmet") {
    pintar(ctx, 7, 9, 18, 15, escuro);
    pintar(ctx, 8, 10, 16, 12, c);
    pintar(ctx, 10, 20, 12, 4, "#101426");
    pintar(ctx, 11, 22, 10, 3, c);
    pintar(ctx, 15, 9, 3, 14, "rgba(255,255,255,0.2)");
  } else if (slot === "boots") {
    pintar(ctx, 8, 8, 6, 14, escuro);
    pintar(ctx, 9, 9, 4, 12, c);
    pintar(ctx, 8, 21, 10, 4, c);
    pintar(ctx, 18, 8, 6, 14, escuro);
    pintar(ctx, 19, 9, 4, 12, c);
    pintar(ctx, 14, 21, 10, 4, c);
  } else if (slot === "legs") {
    pintar(ctx, 9, 8, 14, 16, escuro);
    pintar(ctx, 10, 9, 5, 14, c);
    pintar(ctx, 17, 9, 5, 14, c);
    pintar(ctx, 15, 9, 2, 9, "#101426");
  } else if (slot === "shield") {
    pintar(ctx, 8, 7, 16, 17, escuro);
    pintar(ctx, 9, 8, 14, 15, c);
    pintar(ctx, 12, 11, 8, 9, "#101426");
    pintar(ctx, 15, 12, 2, 7, "#fff3d1");
  } else if (id.startsWith("runa-") || id === "runa") {
    pintar(ctx, 8, 7, 16, 19, escuro);
    pintar(ctx, 9, 8, 14, 17, "#3a3550");
    pintar(ctx, 10, 9, 12, 3, c);
    pintar(ctx, 13, 13, 2, 8, c);
    pintar(ctx, 11, 15, 6, 2, c);
    pintar(ctx, 15, 5, 2, 3, c);
  } else if (item.heal || item.mana || item.use === "light" || item.use === "bomb") {
    pintar(ctx, 10, 10, 12, 16, escuro);
    pintar(ctx, 11, 12, 10, 13, "rgba(220,235,255,0.22)");
    pintar(ctx, 12, 16, 8, 8, c);
    pintar(ctx, 13, 16, 6, 3, "rgba(255,255,255,0.4)");
    pintar(ctx, 13, 7, 6, 4, "#8a8fb5");
    pintar(ctx, 11, 5, 10, 3, "#6b4a2a");
    if (item.use === "bomb") {
      pintar(ctx, 20, 7, 3, 3, "#ffc857");
      pintar(ctx, 22, 4, 2, 4, "#8a6a4a");
    }
  } else if (item.use === "food" || id === "cafe" || id === "erva") {
    pintar(ctx, 7, 17, 18, 7, "#0b1224");
    if (id === "erva") {
      pintar(ctx, 13, 13, 6, 10, "#2f7a4a");
      pintar(ctx, 9, 10, 6, 8, "#3f9a5e");
      pintar(ctx, 17, 9, 6, 9, "#2f7a4a");
    } else {
      pintar(ctx, 8, 16, 16, 7, "#b07a3a");
      pintar(ctx, 9, 15, 14, 3, "#d8a45a");
      pintar(ctx, 12, 12, 8, 4, "#8a5a2a");
    }
  } else if (["ferro", "veio", "madeira", "erva", "semente", "pocao", "chave"].includes(id)) {
    if (id === "chave") {
      pintar(ctx, 8, 14, 10, 4, c);
      pintar(ctx, 18, 12, 8, 8, escuro);
      pintar(ctx, 19, 13, 6, 6, c);
      pintar(ctx, 21, 15, 2, 2, "#101426");
      pintar(ctx, 6, 12, 4, 8, c);
    } else {
      pintar(ctx, 9, 12, 14, 12, escuro);
      pintar(ctx, 10, 13, 12, 10, c);
      pintar(ctx, 12, 15, 8, 2, "rgba(255,255,255,0.3)");
      pintar(ctx, 12, 19, 8, 2, "rgba(0,0,0,0.25)");
    }
  } else {
    pintar(ctx, 9, 11, 14, 14, escuro);
    pintar(ctx, 10, 12, 12, 12, c);
    pintar(ctx, 12, 14, 8, 2, "rgba(255,255,255,0.25)");
    pintar(ctx, 13, 9, 6, 3, "#6b4a2a");
  }
}

export function itemIconCanvas(item) {
  const chave = item?.id || "item";
  if (cache.has(chave)) return cache.get(chave);
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  canvas.className = "item-art";
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.imageSmoothingEnabled = false;
    desenhar(ctx, item || {});
  }
  cache.set(chave, canvas);
  return canvas;
}

export function itemAccent(item) {
  return corDe(item || {});
}

// versão para colocar na tela: copia o desenho cacheado para um canvas novo,
// porque o mesmo canvas não pode aparecer em dois lugares do DOM
export function itemIconElement(item) {
  const base = itemIconCanvas(item);
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  canvas.className = base.className;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.imageSmoothingEnabled = false;
    ctx.drawImage(base, 0, 0);
  }
  return canvas;
}

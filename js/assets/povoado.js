// A camada de ambiente: vegetação, construção, fogo, água e props espalhados
// pelas 86 ilhas. A regra é a mesma em toda parte e o resultado muda com o
// bioma: material decide telhado, parede e tronco; disciplina decide árvore e
// construção. Nada aqui colide, e tudo é preso a tile macio longe do caminho,
// da praça e de estação, então a malha de caminhada continua intacta.
//
// A ordem importa: a construção e a ruína entram primeiro e ocupam o miolo da
// coroa da ilha; a vegetação entra depois e respeita o espaço delas.
import { TILE_KIND as K } from "../config.js";
import { BIOMES } from "../identity.js";

const MACIOS = new Set([K.GRASS, K.MOSS, K.FLOWER, K.SAND]);
const DUREZA = {
  math: "torre", physics: "torre", ai: "torre",
  cs: "galpao", chem: "galpao",
  lingua: "casa", music: "casa", hub: "casa",
};
const ARVORE = {
  math: "conifera", physics: "conifera", ai: "conifera", cs: "conifera",
  chem: "arvore", lingua: "arvore", music: "arvore", hub: "arvore",
};
const DECAL = {
  math: ["rachadura", "pedra", "tufo", "folhada"],
  physics: ["pedra", "rachadura", "tufo", "musgo"],
  chem: ["cogumelo", "folhada", "musgo", "tufo"],
  cs: ["pedra", "rachadura", "folhada", "tufo"],
  ai: ["pedra", "rachadura", "tufo", "musgo"],
  music: ["folhada", "tufo", "pedra", "musgo"],
  lingua: ["folhada", "tufo", "musgo", "pedra"],
  hub: ["folhada", "tufo", "pedra", "musgo"],
};

export function espalharAmbiente({ areas, get, hash2, waystones, hunts = [], gente = [], livre = () => true }) {
  const ambiente = [];
  const ocupado = new Set();
  const emPe = new Set();
  const chave = (x, y) => `${Math.floor(x * 2)},${Math.floor(y * 2)}`;
  const pertoEmPe = (x, y, raio) => {
    for (let dy = -raio; dy <= raio; dy++) {
      for (let dx = -raio; dx <= raio; dx++) {
        if (emPe.has(`${Math.floor(x) + dx},${Math.floor(y) + dy}`)) return true;
      }
    }
    return false;
  };
  const por = (x, y, tipo, extra = {}, espaco = 0) => {
    const k = chave(x, y);
    if (ocupado.has(k)) return null;
    if (espaco && pertoEmPe(x, y, espaco)) return null;
    ocupado.add(k);
    if (espaco) emPe.add(`${Math.floor(x)},${Math.floor(y)}`);
    const item = { tipo, x, y, ...extra };
    ambiente.push(item);
    return item;
  };

  for (let ai = 0; ai < areas.length; ai++) {
    const area = areas[ai];
    const bio = BIOMES[area.id] || area.biome;
    if (!bio) continue;
    const disc = bio.discipline || area.continent || "hub";
    const { cx, cy, rx, ry } = area.land;
    const macio = (x, y) => {
      const t = get(x, y);
      return MACIOS.has(t) || t === area.floor || t === area.base;
    };
    const agua = (x, y) => get(x, y) === K.WATER;
    const trilha = (x, y, raio = 1) => {
      for (let dy = -raio; dy <= raio; dy++) {
        for (let dx = -raio; dx <= raio; dx++) {
          const t = get(x + dx, y + dy);
          if (t === K.PATH || t === K.PLAZA || t === K.BRIDGE || t === K.WALL) return true;
        }
      }
      return false;
    };
    const naIlha = (x, y) => {
      const dx = (x - cx) / rx, dy = (y - cy) / ry;
      return dx * dx + dy * dy <= 0.94;
    };
    const pode = (x, y, raio = 1) => x >= 1 && y >= 1 && naIlha(x, y) && macio(x, y) && !trilha(x, y, raio) && livre(x, y);

    // ---- construção: uma por ilha, na coroa, entrando antes da vegetação ----
    const angulo = hash2(ai * 13 + 5, ai * 7 + 2) * Math.PI * 2;
    let bx = 0, by = 0, achou = false;
    for (let i = 0; i < 8 && !achou; i++) {
      const a = angulo + i * (Math.PI / 4);
      bx = Math.round(cx + Math.cos(a) * rx * 0.64);
      by = Math.round(cy + Math.sin(a) * ry * 0.64);
      achou = pode(bx, by, 1);
    }
    if (achou) {
      let tipo = DUREZA[disc] || "casa";
      if (["papel", "pergaminho", "ébano", "tinta", "fibra"].includes(bio.material)) tipo = "cabana";
      if (["vidro", "cristal", "obsidiana"].includes(bio.material)) tipo = "torre";
      por(bx + 0.5, by + 0.5, tipo, { bioma: area.id }, 3);
      if (tipo !== "torre") por(bx + 0.7, by - 2.2, "fumaca", { bioma: area.id });
      const props = ["barril", "saco", "caixote", "fardo"];
      for (let i = 0; i < 2; i++) {
        const px = bx + (i ? 2 : -2), py = by + (i ? 1 : 2);
        if (pode(px, py, 0)) {
          por(px + 0.5, py + 0.5, props[Math.floor(hash2(px, py) * props.length)], { bioma: area.id }, 1);
        }
      }
      if (hash2(ai + 2, ai + 9) < 0.3) {
        for (let i = 0; i < 2; i++) {
          const cx2 = bx + 3 + i, cy2 = by + 2;
          if (naIlha(cx2, cy2) && macio(cx2, cy2)) {
            por(cx2 + 0.5, cy2 + 0.5, "cerca", { bioma: area.id }, 1);
          }
        }
      }
      if (hash2(ai, ai + 3) < 0.7) {
        // procura o canto livre em volta da construção: um deles sempre cabe
        for (const [dx, dy] of [[3, 2], [-3, 2], [2, 3], [-2, 3]]) {
          const fx = bx + dx, fy = by + dy;
          if (naIlha(fx, fy) && macio(fx, fy)) {
            if (por(fx + 0.5, fy + 0.5, "fogueira", { bioma: area.id }, 1)) break;
          }
        }
      } else if (hash2(ai + 1, ai + 5) < 0.35) {
        const px = bx + 3, py = by;
        if (pode(px, py, 0)) por(px + 0.5, py + 0.5, "poco", { bioma: area.id }, 1);
      }
    }

    // ---- ruína como segunda construção em parte das ilhas ----
    if (hash2(ai * 5, ai * 11) < 0.34) {
      const a2 = angulo + 2.1;
      const rx2 = Math.round(cx + Math.cos(a2) * rx * 0.58);
      const ry2 = Math.round(cy + Math.sin(a2) * ry * 0.58);
      if (pode(rx2, ry2, 1)) {
        por(rx2 + 0.5, ry2 + 0.5, "ruina", { bioma: area.id }, 3);
        por(rx2 + 1.4, ry2 + 0.7, "trepadeira", { bioma: area.id, camada: "chao" });
      }
    }

    // ---- praça: braseiros na borda do disco, que é PLAZA ----
    const pedra = waystones.find((w) => area.rect &&
      w.x >= area.rect.x && w.x <= area.rect.x + area.rect.w &&
      w.y >= area.rect.y && w.y <= area.rect.y + area.rect.h);
    if (pedra) {
      for (const [dx, dy] of [[3.6, 3.6], [-3.6, 3.6]]) {
        const px = Math.round(pedra.x + dx), py = Math.round(pedra.y + dy);
        // ilha grande tem enseada perto da pedra: braseiro não entra na água
        if (!naIlha(px, py) || !macio(px, py) || agua(px, py)) continue;
        if (!ocupado.has(chave(px + 0.5, py + 0.5))) {
          por(px + 0.5, py + 0.5, "braseiro", { bioma: area.id }, 1);
        }
      }
    }

    // metrópole é praça e telhado, não floresta: capim fino e árvore só na borda
    const metropole = !area.catalog;

    // ---- árvore grande: primeiro a floresta, depois o capim ----
    // Antes cada tile sorteava árvore com a mesma densidade do capim, e a copa
    // de 36 x 46 cobria caminho, totem e telhado. Agora a árvore nasce em
    // bosque (célula grossa de 7 tiles), com 2 tiles de folga entre copas e um
    // teto por ilha, então a região metropolitana não vira floresta fechada.
    const ARVORES = new Set(["arvore", "conifera", "palmeira", "seca"]);
    const pertoDaCacada = (x, y) => hunts.some((h) => Math.abs(h.x - (x + 0.5)) < 3 && Math.abs(h.y - (y + 0.5)) < 3);
    const pertoDeGente = (x, y) => gente.some((n) => Math.abs(n.x - (x + 0.5)) < 2.4 && Math.abs(n.y - (y + 0.5)) < 2.4);
    const maxArvores = metropole
      ? 4
      : Math.min(14, Math.max(5, Math.round((area.rect.w * area.rect.h) / 62)));
    let arvores = 0;
    for (let y = Math.floor(area.rect.y); y < Math.ceil(area.rect.y + area.rect.h) && arvores < maxArvores; y++) {
      for (let x = Math.floor(area.rect.x); x < Math.ceil(area.rect.x + area.rect.w) && arvores < maxArvores; x++) {
        if (metropole) {
          // praça arborizada: a árvore fica no arredor, nunca no miolo
          const nx = (x + 0.5 - area.land.cx) / area.land.rx;
          const ny = (y + 0.5 - area.land.cy) / area.land.ry;
          if (Math.hypot(nx, ny) < 0.5) continue;
        } else {
          const bosque = hash2(Math.floor(x / 7) + ai * 13, Math.floor(y / 7) - ai * 7);
          if (bosque < 0.32) continue;
        }
        if (hash2(x * 7 + ai * 5, y * 11 - ai) > (metropole ? 0.06 : 0.18)) continue;
        if (!pode(x, y, 1)) continue;
        if (pertoDaCacada(x, y) || pertoDeGente(x, y)) continue;
        const px = x + 0.5, py = y + 0.5;
        const t = get(x, y);
        let tipo = ARVORE[disc] || "arvore";
        if (t === K.SAND) tipo = "palmeira";
        else if (hash2(x + 9, y + 4) < 0.16) tipo = "seca";
        else if (tipo === "arvore" && hash2(x + 5, y + 8) < 0.35) tipo = "conifera";
        if (!por(px, py, tipo, { bioma: area.id }, 2)) continue;
        arvores++;
      }
    }

    // ---- cobertura rasteira: mancha por disciplina, sem tocar no caminho ----
    const densidade = metropole ? 0.1 : 0.2;
    for (let y = Math.floor(area.rect.y); y < Math.ceil(area.rect.y + area.rect.h); y++) {
      for (let x = Math.floor(area.rect.x); x < Math.ceil(area.rect.x + area.rect.w); x++) {
        if (hash2(x * 3 + ai, y * 5 + ai * 7) > densidade) continue;
        if (!pode(x, y)) continue;
        const px = x + 0.5, py = y + 0.5;
        const tipo = hash2(x + 2, y + 3) < 0.5 ? "arbusto" : "florada";
        por(px, py, tipo, { bioma: area.id }, 1);
      }
    }

    // ---- decalques de chão: textura entre uma árvore e outra ----
    for (let y = Math.floor(area.rect.y); y < Math.ceil(area.rect.y + area.rect.h); y++) {
      for (let x = Math.floor(area.rect.x); x < Math.ceil(area.rect.x + area.rect.w); x++) {
        if (hash2(x * 11 + ai * 3, y * 7 + ai) > 0.05) continue;
        if (!pode(x, y, 0)) continue;
        const lista = DECAL[disc] || DECAL.hub;
        const tipo = lista[Math.floor(hash2(x + 4, y + 6) * lista.length)];
        por(x + 0.5, y + 0.5, tipo, { bioma: area.id, camada: "chao" });
      }
    }

    // ---- beira d'água: junco, pedra molhada, lírio e espuma ----
    for (let y = Math.floor(area.rect.y); y < Math.ceil(area.rect.y + area.rect.h); y++) {
      for (let x = Math.floor(area.rect.x); x < Math.ceil(area.rect.x + area.rect.w); x++) {
        if (hash2(x * 5 + 1, y * 3 + 7) > 0.16) continue;
        if (!pode(x, y, 0)) continue;
        const beira = agua(x + 1, y) || agua(x - 1, y) || agua(x, y + 1) || agua(x, y - 1);
        if (!beira) continue;
        const h = hash2(x + 7, y + 2);
        const tipo = h < 0.4 ? "juncoAgua" : h < 0.68 ? "pedraAgua" : h < 0.86 ? "lirio" : "espuma";
        por(x + 0.5, y + 0.5, tipo, { bioma: area.id, camada: "chao" });
      }
    }

    // ---- doca: uma por ilha, na costa que oferece água a leste ----
    let doca = false;
    for (let y = Math.floor(area.rect.y + 2); y < Math.ceil(area.rect.y + area.rect.h - 2) && !doca; y++) {
      for (let x = Math.ceil(area.rect.x + area.rect.w - 3); x > area.rect.x + 2 && !doca; x--) {
        if (!pode(x, y, 0)) continue;
        if (!agua(x + 1, y) || !agua(x + 2, y) || !agua(x + 2, y + 1)) continue;
        por(x + 0.5, y + 0.5, "doca", { bioma: area.id }, 1);
        doca = true;
      }
    }

    // ---- piso mínimo: ilha pequena também recebe textura ----
    let daArea = 0;
    for (const a of ambiente) if (a.bioma === area.id) daArea++;
    if (daArea < 8) {
      for (let y = Math.floor(area.rect.y); y < Math.ceil(area.rect.y + area.rect.h) && daArea < 8; y++) {
        for (let x = Math.floor(area.rect.x); x < Math.ceil(area.rect.x + area.rect.w) && daArea < 8; x++) {
          // decalque não colide: a ilha pequena não fica lisa por causa da
          // exclusão de estação, só não pode cair em caminho nem na água
          if (!naIlha(x, y) || !macio(x, y) || trilha(x, y, 0)) continue;
          por(x + 0.5, y + 0.5, "tufo", { bioma: area.id, camada: "chao" });
          daArea++;
        }
      }
    }

    // ---- gaivotas sobre a água, duas por ilha ----
    for (let i = 0; i < 2; i++) {
      const gx = Math.round(area.rect.x + hash2(ai + i * 3, ai + 1) * area.rect.w);
      const gy = Math.round(area.rect.y + hash2(ai + i * 5, ai + 2) * area.rect.h);
      if (agua(gx, gy)) por(gx + 0.5, gy + 0.5, "gaivota", { bioma: area.id });
    }
  }

  return ambiente;
}

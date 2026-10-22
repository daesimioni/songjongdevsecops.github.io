import { finishMaterial } from "../art-style.js";
const MATERIAL = {
  solo: "stone",
  vegetacao: "leaf",
  construcao: "wood",
  props: "wood",
  fogo: "metal",
  agua: "water",
};

// Revisão explícita de cada peça. Coordenadas normalizadas conservam a base
// e os vãos do desenho original; source-atop impede criar massa sem colisão.
export const ASSET_DETAILS = Object.freeze({
  pedra: "faces e inclusões minerais",
  rachadura: "lábio de pedra e ramificações",
  raiz: "casca e nós",
  poca: "reflexos concêntricos",
  tufo: "lâminas e sementes",
  folhada: "nervuras e folhas secas",
  cogumelo: "lamelas e pintas",
  musgo: "almofadas e esporos",
  arvore: "ramos, folhas agrupadas e casca",
  conifera: "agulhas e pinhas",
  palmeira: "folíolos e anéis",
  seca: "fissuras e líquen",
  arbusto: "folhas, bagas e galhos",
  junco: "espigas e pólen",
  florada: "pétalas, miolo e folhas",
  trepadeira: "nervuras e brotos",
  cabana: "palha e amarrações",
  casa: "telhas, reboco e soleira",
  torre: "cantaria e seteiras",
  ruina: "fissuras e líquen",
  galpao: "tábuas e ferragens",
  poco: "pedras e corda",
  cerca: "veios e pregos",
  doca: "tábuas molhadas e cracas",
  barril: "aduelas e aros rebitados",
  saco: "costuras e trama",
  caixote: "encaixes e pregos",
  fardo: "fibras e cordas",
  mesa: "tampo e encaixes",
  cama: "costuras e dobras",
  estante: "lombadas e prateleiras",
  gaivota: "rêmiges, cauda e bico",
  fogueira: "carvão e brasas",
  braseiro: "grade e rebites",
  tocha: "fibras e fuligem",
  lanterna: "vidro e armação",
  fumaca: "volutas translúcidas",
  pedraAgua: "linha molhada e reflexo",
  juncoAgua: "espigas e ondulação",
  espuma: "bolhas e cristas",
  lirio: "nervuras e pétalas",
});
export function detailAsset(g, p, v, q, type, group, w, h) {
  const pixel = (x, y, dx, dy, color) => {
    g.fillStyle = color;
    g.fillRect(x, y, dx, dy);
  };
  const line = (points, color, width = 0.5) => {
    g.strokeStyle = color;
    g.lineWidth = width;
    g.beginPath();
    points.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
    g.stroke();
  };
  const cx = w / 2,
    wave = [0, 0.5, 0, -0.5][q % 4];
  g.save();
  g.globalCompositeOperation = "source-atop";
  switch (type) {
    case "arvore":
    case "arbusto": {
      const count = type === "arvore" ? 24 : 10;
      for (let i = 0; i < count; i++) {
        const angle = i * 2.399,
          r = 2 + (i % 5) * w * 0.065,
          x = cx + Math.cos(angle) * r,
          y = h * 0.43 + Math.sin(angle) * r * 0.7;
        pixel(
          x + wave * (i % 3),
          y,
          2,
          0.5,
          i % 3 ? p.folhaClara : p.folhaEscura,
        );
        pixel(x + 1 + wave * (i % 3), y - 0.5, 0.5, 1, p.folha);
        if (type === "arbusto" && i % 4 === v) pixel(x, y + 1, 1, 1, p.brasa);
      }
      for (let i = 0; i < 5; i++)
        line(
          [
            [cx - 1 + (i % 2), h - 12 + i * 2],
            [cx + 0.5, h - 11 + i * 2],
            [cx - 0.5, h - 10 + i * 2],
          ],
          p.tronco,
          0.5,
        );
      break;
    }
    case "conifera":
      for (let tier = 0; tier < 5; tier++)
        for (let side = -1; side <= 1; side += 2) {
          const y = 8 + tier * 7;
          for (let needle = 0; needle < 4; needle++)
            line(
              [
                [cx + side * (needle + 1), y + needle],
                [cx + side * (needle + 3) + wave, y + needle + 2],
              ],
              p.folhaClara,
              0.5,
            );
          if (tier % 2 === v % 2)
            pixel(cx + side * (tier + 1), y + 4, 1, 2, p.troncoClaro);
        }
      break;
    case "palmeira":
      for (let i = 0; i < 7; i++) {
        pixel(cx, h - 5 - i * 3, 2, 0.5, p.troncoClaro);
        pixel(cx + 2, h - 4 - i * 3, 1, 0.5, p.tronco);
      }
      for (let side = -1; side <= 1; side += 2)
        for (let i = 1; i < 6; i++)
          line(
            [
              [cx + side * i * 2, h * 0.5],
              [cx + side * i * 2 + wave, h * 0.5 + 2 + i * 0.5],
            ],
            p.folhaClara,
            0.5,
          );
      break;
    case "seca":
      for (let i = 0; i < 7; i++)
        line(
          [
            [cx - 1, h - 4 - i * 3],
            [cx + 1, h - 6 - i * 3],
            [cx, h - 7 - i * 3],
          ],
          i % 3 ? p.troncoClaro : p.folhaEscura,
          0.5,
        );
      break;
    case "junco":
    case "juncoAgua":
      for (let i = 0; i < 5; i++) {
        const x = 3 + i * 3;
        pixel(x + wave, h - 13 - (i % 3) * 3, 0.5, 2, p.luz);
        line(
          [
            [x, h - 2],
            [x + 2, h - 8],
          ],
          p.folhaClara,
          0.5,
        );
      }
      break;
    case "florada":
      for (let i = 0; i < 5; i++) {
        const x = 3 + i * 3.5,
          y = 4 + ((i * 3 + v) % 5);
        pixel(x + wave, y, 1, 0.5, p.luz);
        pixel(x - 0.5 + wave, y + 1, 0.5, 1, p.tecido);
        line(
          [
            [x, h - 3],
            [x - 2, h - 5],
            [x, h - 4],
          ],
          p.folhaClara,
          0.5,
        );
      }
      break;
    case "trepadeira":
      for (let i = 0; i < 7; i++)
        line(
          [
            [4 + ((i * 3) % 7), 3 + i * 4],
            [6 + ((i * 3) % 7) + wave, 4 + i * 4],
          ],
          p.folhaClara,
          0.5,
        );
      break;
    case "cabana":
      for (let y = 5; y < h * 0.55; y += 2)
        for (let x = 4 + (y % 3); x < w - 4; x += 3)
          line(
            [
              [x, y],
              [x + 1, y + 2],
            ],
            (x + y) % 3 ? p.troncoClaro : p.tronco,
            0.5,
          );
      line(
        [
          [cx - 7, h - 11],
          [cx - 7, h - 3],
        ],
        p.madeiraClara,
        0.5,
      );
      break;
    case "casa":
      for (let y = 5; y < h * 0.48; y += 3)
        for (let x = 3 + (y % 2) * 2; x < w - 3; x += 5) {
          line(
            [
              [x, y],
              [x + 4, y],
              [x + 4, y + 2],
            ],
            p.telhaClara,
            0.5,
          );
        }
      line(
        [
          [4, h - 8],
          [7, h - 9],
          [8, h - 6],
        ],
        p.pedraEscura,
        0.5,
      );
      pixel(cx - 4, h - 2, 8, 0.5, p.pedraClara);
      break;
    case "torre":
    case "ruina":
      for (let y = 8; y < h - 3; y += 4)
        for (let x = 3 + (y % 3); x < w - 3; x += 7)
          line(
            [
              [x, y],
              [x + 5, y],
              [x + 5, y + 3],
            ],
            p.pedraEscura,
            0.5,
          );
      for (let i = 0; i < 8; i++)
        pixel(
          3 + ((i * 7 + v) % Math.max(1, w - 6)),
          h - 3 - (i % 4),
          1,
          0.5,
          p.folhaEscura,
        );
      break;
    case "galpao":
    case "cerca":
    case "doca":
    case "caixote":
    case "mesa":
      for (let x = 3; x < w - 3; x += 4) {
        line(
          [
            [x, h * 0.45],
            [x + 0.5, h * 0.65],
            [x, h - 3],
          ],
          p.tronco,
          0.5,
        );
        pixel(x, h * 0.53, 0.5, 0.5, p.metalClaro);
      }
      if (type === "doca")
        for (let i = 0; i < 9; i++)
          pixel(
            3 + i * 4,
            h - 3 - (i % 3),
            1,
            0.5,
            i % 2 ? p.pedraClara : p.folhaEscura,
          );
      if (type === "mesa")
        line(
          [
            [4, h * 0.4],
            [w - 4, h * 0.4],
          ],
          p.madeiraClara,
          0.5,
        );
      break;
    case "poco":
      for (let i = 0; i < 6; i++)
        line(
          [
            [cx - 1, h * 0.2 + i * 2],
            [cx + 1, h * 0.2 + i * 2 + 1],
          ],
          p.troncoClaro,
          0.5,
        );
      for (let x = 4; x < w - 3; x += 4) pixel(x, h - 5, 0.5, 3, p.pedraEscura);
      break;
    case "barril":
      for (let i = 0; i < 3; i++) {
        pixel(4 + i * 4, 7, 0.5, 0.5, p.metalClaro);
        pixel(4 + i * 4, h - 7, 0.5, 0.5, p.metalClaro);
        line(
          [
            [4 + i * 3, 9],
            [5 + i * 3, h - 9],
          ],
          p.troncoClaro,
          0.5,
        );
      }
      break;
    case "saco":
    case "fardo":
      for (let y = 5; y < h - 3; y += 2)
        for (let x = 4; x < w - 3; x += 2)
          pixel(
            x + (y % 3) * 0.25,
            y,
            0.5,
            0.5,
            (x + y) % 4 ? p.troncoClaro : p.tronco,
          );
      line(
        [
          [cx - 2, 4],
          [cx, 6],
          [cx + 2, 4],
        ],
        p.tecido,
        0.5,
      );
      break;
    case "cama":
      for (let i = 0; i < 6; i++)
        line(
          [
            [4 + i * 2, h * 0.48],
            [5 + i * 2, h * 0.55],
            [4 + i * 2, h - 5],
          ],
          i % 2 ? p.tecido : p.contorno,
          0.5,
        );
      line(
        [
          [4, h * 0.4],
          [w - 4, h * 0.4],
        ],
        p.luz,
        0.5,
      );
      break;
    case "estante":
      for (let i = 0; i < 9; i++) {
        const x = 3 + (i % 5) * 3,
          y = 5 + Math.floor(i / 5) * 7;
        pixel(x, y, 1, 0.5, p.luz);
        pixel(x, y + 3, 1, 0.5, p.metalClaro);
      }
      break;
    case "gaivota":
      for (let side = -1; side <= 1; side += 2)
        for (let i = 0; i < 4; i++)
          line(
            [
              [cx + side * (2 + i), h * 0.5],
              [cx + side * (4 + i), h * 0.5 + 2 + wave],
            ],
            p.pedraEscura,
            0.5,
          );
      break;
    case "pedra":
    case "pedraAgua":
      for (let i = 0; i < 5; i++) {
        const x = 3 + i * 3,
          y = h * 0.5 + (i % 3);
        line(
          [
            [x, y],
            [x + 1, y + 1],
            [x + 3, y],
          ],
          i % 2 ? p.pedraEscura : p.pedraClara,
          0.5,
        );
      }
      if (type === "pedraAgua")
        line(
          [
            [2, h - 3 + wave],
            [w - 3, h - 3 + wave],
          ],
          p.luz,
          0.5,
        );
      break;
    case "rachadura":
      for (let i = 0; i < 3; i++)
        line(
          [
            [5 + i * 5, h * 0.5],
            [6 + i * 5, h * 0.5 + 2],
            [8 + i * 5, h * 0.5 + 2],
          ],
          p.pedraClara,
          0.5,
        );
      break;
    case "raiz":
      for (let i = 0; i < 6; i++)
        pixel(3 + i * 3, 4 + (i % 4), 0.5, 1, p.troncoClaro);
      break;
    case "tufo":
      for (let i = 0; i < 7; i++)
        line(
          [
            [cx, h - 2],
            [2 + i * 2 + wave, 3 + (i % 3)],
          ],
          i % 2 ? p.folhaClara : p.folhaEscura,
          0.5,
        );
      break;
    case "folhada":
      for (let i = 0; i < 7; i++) {
        const x = 2 + i * 2.5,
          y = 3 + ((i * 3) % 5);
        line(
          [
            [x, y],
            [x + 2, y + 1],
            [x + 3, y],
          ],
          p.troncoClaro,
          0.5,
        );
      }
      break;
    case "cogumelo":
      for (let i = 0; i < 5; i++) {
        pixel(3 + i * 2, 3 + (i % 2), 0.5, 0.5, p.luz);
        line(
          [
            [4 + i * 2, 6],
            [5 + i * 2, 7],
          ],
          p.tronco,
          0.5,
        );
      }
      break;
    case "musgo":
      for (let i = 0; i < 15; i++)
        pixel(
          2 + ((i * 7) % Math.max(1, w - 4)),
          2 + ((i * 3) % Math.max(1, h - 4)),
          0.5,
          0.5,
          i % 3 ? p.folhaClara : p.folhaEscura,
        );
      break;
    case "poca":
    case "espuma":
    case "lirio":
      for (let i = 0; i < 3; i++) {
        const y = h * 0.4 + i * 2;
        line(
          [
            [3 + i + wave, y],
            [7 + i + wave, y - 0.5],
            [10 + i + wave, y],
          ],
          type === "lirio" ? p.folhaClara : p.luz,
          0.5,
        );
      }
      if (type === "lirio")
        for (let side = -1; side <= 1; side += 2)
          line(
            [
              [cx, h * 0.4],
              [cx + side * 4, h * 0.5],
              [cx + side * 2, h * 0.6],
            ],
            p.folhaEscura,
            0.5,
          );
      break;
    case "fogueira":
    case "braseiro":
    case "tocha":
      for (let i = 0; i < 4; i++) {
        pixel(
          cx - 3 + i * 2,
          h - 4 - (i % 2),
          0.5,
          0.5,
          (i + q) % 3 ? p.brasa : p.luz,
        );
        pixel(cx - 2 + i, h - 10 - ((q + i) % 6), 0.5, 1, p.luz);
      }
      if (type === "braseiro")
        for (let x = cx - 5; x < cx + 6; x += 2)
          pixel(x, h - 6, 0.5, 0.5, p.metalClaro);
      break;
    case "lanterna":
      line(
        [
          [cx - 2, h - 9],
          [cx - 2, h - 5],
        ],
        p.luz,
        0.5,
      );
      line(
        [
          [cx + 2, h - 9],
          [cx + 2, h - 5],
        ],
        p.metalClaro,
        0.5,
      );
      pixel(cx, h - 12, 0.5, 1, p.metalClaro);
      break;
    case "fumaca":
      g.globalAlpha = 0.13;
      for (let i = 0; i < 4; i++)
        line(
          [
            [cx - 3 + wave, h - 5 - i * 3],
            [cx + wave, h - 7 - i * 3],
            [cx + 3 + wave, h - 6 - i * 3],
          ],
          p.pedraClara,
          0.5,
        );
      break;
    default:
      throw new Error(`Asset sem revisão de arte: ${type}`);
  }
  g.restore();
  finishMaterial(g, w, h, MATERIAL[group], v);
}

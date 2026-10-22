import { detailItem } from "./item-detail.js";
import { finishMaterial } from "./art-style.js";
// Ícones dos itens desenhados em canvas, no mesmo pixel do mapa. A forma vem
// da PALAVRA do nome (família) e de parâmetros sorteados pelo id: comprimento,
// largura, guarda, ponta, pedra e brilho. Antes vinha só do slot, então 94
// armas eram quatro silhuetas trocando a cor.

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

const ESCURO = "rgba(4,6,14,0.88)";
const METAL = "#d8d2ea";
const METAL_ESCURO = "#8a8fb5";
const MADEIRA = "#6b4a2a";
const MADEIRA_CLARA = "#8a6a4a";
const COURO = "#5a4030";
const LUZ = "rgba(255,255,255,0.35)";

const cache = new Map();

// A palavra do nome decide a família; o id decide os parâmetros. Nome que não
// casa com nenhuma família cai em "ferramenta" e ainda desenha, nunca fica sem
// ícone.
const POR_PALAVRA = {
  lâmina: "lamina", espada: "espada", florete: "espada", sabre: "lamina",
  bastão: "bastao", varinha: "bastao", cetro: "cetro", cajado: "cajado",
  malho: "malho", martelo: "malho", maça: "maca",
  batuta: "batuta", pena: "pena", caneta: "caneta", frasco: "frasco",
  chave: "chave", "chave-de-fenda": "chave",
  manto: "manto", casaca: "casaca", sobretudo: "casaca", casaco: "casaca", jaleco: "casaca",
  colete: "colete", avental: "avental", capa: "capa",
  capuz: "capuz", elmo: "elmo", coroa: "coroa", máscara: "mascara",
  turbante: "turbante", óculos: "oculos", lentes: "oculos", lente: "lente", fones: "fones",
  escudo: "escudo", broquel: "escudo", rodela: "escudo",
  anel: "anel", colar: "colar", perneiras: "perneiras", botas: "botas",
  pedra: "gema", cristal: "gema", prisma: "gema", núcleo: "tech",
  runa: "runa", selo: "runa",
  poção: "pocao", tocha: "tocha", bomba: "bomba",
  peixe: "peixe", erva: "planta", semente: "planta",
  pergaminho: "livro", tinta: "livro", letra: "livro", verso: "livro",
  estrofe: "livro", página: "livro", partitura: "livro", motivo: "livro",
  tema: "livro", coda: "livro", diálogo: "livro",
  chip: "tech", instrução: "tech", registrador: "tech", barramento: "tech",
  pacote: "tech", datagrama: "tech", fita: "tech", cadeia: "tech", pixel: "tech",
  borda: "tech", kernel: "tech", prompt: "tech", contexto: "tech",
  régua: "ferramenta", ímã: "ferramenta", picareta: "ferramenta", tubo: "ferramenta",
  diapasão: "ferramenta", metrônomo: "ferramenta", cravo: "ferramenta",
  harmônico: "ferramenta", parafuso: "ferramenta", catalisador: "ferramenta",
};

function primeiraPalavra(nome) {
  return String(nome || "").trim().split(/\s+/)[0].toLowerCase();
}

export function familiaDe(item) {
  const palavra = primeiraPalavra(item?.name);
  if (POR_PALAVRA[palavra]) return POR_PALAVRA[palavra];
  const slot = item?.slot;
  if (slot === "weapon") return "ferramenta";
  if (slot === "armor") return "manto";
  if (slot === "helmet") return "capuz";
  if (slot === "shield") return "escudo";
  if (slot === "ring") return "anel";
  if (slot === "necklace") return "colar";
  if (slot === "legs") return "perneiras";
  if (slot === "boots") return "botas";
  if (item?.heal || item?.mana) return "pocao";
  if (item?.use === "food") return "comida";
  return "ferramenta";
}

function semente(txt) {
  let h = 2166136261;
  for (let i = 0; i < txt.length; i++) {
    h ^= txt.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

// parâmetros estáveis: o mesmo id dá sempre a mesma peça
function param(item) {
  const s = semente(String(item?.id || item?.name || "item"));
  return {
    L: 13 + (s % 4),          // comprimento
    W: 2 + ((s >>> 3) % 2),   // largura
    G: (s >>> 5) % 3,         // guarda / aba
    T: (s >>> 7) % 2,         // ponta / topo
    D: (s >>> 9) % 3,         // adorno
    S: (s >>> 11) % 2,        // brilho
    A: (s >>> 13) % 4,        // assimetria
  };
}

function corDe(item) {
  if (item.heal) return "#ff7aa8";
  if (item.mana) return "#6bd5ff";
  if (item.use === "light") return "#ffc857";
  if (item.use === "bomb") return "#ff9f6b";
  return CORES[item.continent] || "#ffc857";
}

function maisEscuro(hex) {
  if (typeof hex !== "string" || hex[0] !== "#" || hex.length !== 7) return "#2a2438";
  const n = parseInt(hex.slice(1), 16);
  const r = Math.max(0, ((n >> 16) & 255) - 60);
  const g = Math.max(0, ((n >> 8) & 255) - 60);
  const b = Math.max(0, (n & 255) - 60);
  return `rgb(${r},${g},${b})`;
}

function pintar(ctx, x, y, w, h, cor) {
  ctx.fillStyle = cor;
  ctx.fillRect(x, y, w, h);
}

function comContorno(ctx, x, y, w, h, cor, borda = ESCURO) {
  pintar(ctx, x, y, w, h, borda);
  pintar(ctx, x + 1, y + 1, w - 2, h - 2, cor);
}

// ---- armas ---------------------------------------------------------------
function armaLamina(ctx, c, q) {
  const x = 16 - (q.W >> 1);
  comContorno(ctx, x, 20 - q.L, q.W + 2, q.L + 2, METAL);
  pintar(ctx, x, 6 + (20 - q.L), 1, q.L - 2, c); // fio com a cor da área
  if (q.T) pintar(ctx, x + 1, 20 - q.L - 2, 1, 2, METAL);
  pintar(ctx, 11 - q.G, 20, 10 + q.G * 2, 2, maisEscuro(c)); // guarda
  pintar(ctx, 15, 22, 2, 4, MADEIRA); // punho
  pintar(ctx, 14 - (q.D === 0 ? 1 : 0), 26, 4, 2, c); // pomo
  if (q.S) pintar(ctx, x + 1, 8 + (20 - q.L), 1, 4, LUZ);
}

function armaEspada(ctx, c, q) {
  const x = 15;
  comContorno(ctx, x, 16 - q.L - 2, 4, q.L + 4, METAL);
  pintar(ctx, x, 16 - q.L, 1, q.L, c);
  pintar(ctx, x + 1, 16 - q.L, 1, q.L, "rgba(255,255,255,0.5)");
  pintar(ctx, 16, 16 - q.L - 3, 1, 3, METAL);
  pintar(ctx, 9, 18, 6, 2, maisEscuro(c)); // guarda em asa
  pintar(ctx, 17, 18, 6, 2, maisEscuro(c));
  if (q.D === 1) pintar(ctx, 15, 19, 2, 2, c); // pedra na guarda
  pintar(ctx, 15, 20, 2, 5, MADEIRA);
  pintar(ctx, 14, 25, 4, 2, c);
}

function armaMalho(ctx, c, q) {
  pintar(ctx, 15, 10, 2, 17, MADEIRA);
  comContorno(ctx, 9, 4 + q.D, 14, 8 - q.D, maisEscuro(c));
  pintar(ctx, 10, 5 + q.D, 12, 2, c);
  pintar(ctx, 10, 9, 12, 1, ESCURO);
  if (q.S) pintar(ctx, 11, 6 + q.D, 3, 1, LUZ);
}

function armaMaca(ctx, c, q) {
  pintar(ctx, 15, 12, 2, 15, MADEIRA);
  comContorno(ctx, 11, 4, 10, 9, METAL_ESCURO);
  pintar(ctx, 12, 5, 8, 7, maisEscuro(c));
  for (const [dx, dy] of [[16, 1], [16, 14], [8, 8], [23, 8]]) pintar(ctx, dx, dy, 2, 2, c);
  pintar(ctx, 14, 7, 2, 2, c);
  if (q.S) pintar(ctx, 13, 6, 2, 1, LUZ);
}

function armaBastao(ctx, c, q) {
  pintar(ctx, 15, 8, 2, 20, MADEIRA);
  pintar(ctx, 15, 8, 1, 19, MADEIRA_CLARA);
  comContorno(ctx, 12, 2 + q.D, 8, 7, c);
  pintar(ctx, 14, 4 + q.D, 4, 3, "rgba(255,255,255,0.4)");
  pintar(ctx, 15, 13, 2, 3, maisEscuro(c));
  if (q.T) pintar(ctx, 11, 1 + q.D, 2, 2, c);
}

function armaCetro(ctx, c, q) {
  pintar(ctx, 15, 10, 2, 18, METAL_ESCURO);
  pintar(ctx, 11, 9, 10, 2, c);
  pintar(ctx, 18, 11, 2, 8, maisEscuro(c)); // laço
  comContorno(ctx, 13, 2, 6, 7, METAL);
  pintar(ctx, 15, 3, 2, 5, c);
  if (q.D === 2) pintar(ctx, 12, 1, 2, 2, c);
}

function armaCajado(ctx, c, q) {
  pintar(ctx, 15, 6, 2, 23, MADEIRA);
  pintar(ctx, 15, 6, 1, 22, MADEIRA_CLARA);
  pintar(ctx, 11, 3, 6, 2, c); // volta do cajado
  pintar(ctx, 10, 4, 2, 4, c);
  pintar(ctx, 9, 7, 2, 2, c);
  if (q.T) pintar(ctx, 15, 2, 2, 3, "#ffe3a1");
}

function armaBatuta(ctx, c, q) {
  pintar(ctx, 16, 7, 1, 18, MADEIRA_CLARA);
  pintar(ctx, 15, 24, 3, 4, COURO);
  pintar(ctx, 16, 4, 1, 3, c);
  if (q.S) pintar(ctx, 17, 10, 1, 3, LUZ);
}

function armaPena(ctx, c, q) {
  for (let i = 0; i < 4; i++) {
    pintar(ctx, 10 + i, 8 + i * 3, 3, 3, i % 2 ? maisEscuro(c) : c);
  }
  pintar(ctx, 12, 20, 2, 2, METAL);
  pintar(ctx, 11, 22, 1, 2, METAL_ESCURO);
}

function armaCaneta(ctx, c, q) {
  comContorno(ctx, 14, 6, 5, 16, maisEscuro(c));
  pintar(ctx, 15, 8, 3, 12, c);
  pintar(ctx, 18, 6, 1, 7, METAL); // clipe
  pintar(ctx, 15, 22, 3, 2, METAL_ESCURO);
  if (q.S) pintar(ctx, 16, 10, 1, 4, LUZ);
}

function armaFrasco(ctx, c, q) {
  pintar(ctx, 13, 4, 6, 3, METAL_ESCURO);
  pintar(ctx, 14, 7, 4, 6, "rgba(220,235,255,0.25)");
  pintar(ctx, 13, 13, 6, 2, METAL_ESCURO);
  pintar(ctx, 11, 15, 10, 9, ESCURO);
  pintar(ctx, 12, 16, 8, 7, c);
  pintar(ctx, 13, 17, 2, 2, LUZ);
}

function armaChave(ctx, c, q) {
  pintar(ctx, 14, 16, 4, 10, COURO);
  pintar(ctx, 15, 6, 2, 10, METAL);
  pintar(ctx, 14, 4, 4, 3, c);
  if (q.T) pintar(ctx, 13, 3, 6, 1, METAL_ESCURO);
}

// ---- armaduras -----------------------------------------------------------
function pecaManto(ctx, c, q) {
  pintar(ctx, 8, 7, 16, 6, maisEscuro(c));
  comContorno(ctx, 6, 12 - q.G, 20, 14 + q.G, c);
  pintar(ctx, 12, 4, 8, 6, maisEscuro(c)); // capuz
  pintar(ctx, 13, 5, 6, 4, ESCURO);
  pintar(ctx, 15, 11, 2, 2, "#ffe3a1");
  pintar(ctx, 6, 24, 20, 2, maisEscuro(c));
}

function pecaCasaca(ctx, c, q) {
  comContorno(ctx, 8, 6, 16, 20, c);
  pintar(ctx, 12, 6, 8, 7, ESCURO); // lapela em V
  pintar(ctx, 15, 12, 2, 12, maisEscuro(c));
  for (let i = 0; i < 3; i++) pintar(ctx, 14 - q.G, 10 + i * 4, 1, 1, "#ffe3a1");
  pintar(ctx, 8, 19, 16, 2, COURO);
  pintar(ctx, 9, 6, 2, 8, LUZ);
}

function pecaColete(ctx, c, q) {
  comContorno(ctx, 9, 7, 14, 15, c);
  pintar(ctx, 13, 7, 6, 6, ESCURO);
  pintar(ctx, 15, 14, 2, 7, maisEscuro(c));
  pintar(ctx, 10, 8, 2, 12, "rgba(255,255,255,0.2)");
  if (q.D) pintar(ctx, 15, 12, 2, 2, "#ffe3a1");
}

function pecaAvental(ctx, c, q) {
  comContorno(ctx, 9, 9, 14, 16, c);
  pintar(ctx, 11, 6, 2, 4, maisEscuro(c));
  pintar(ctx, 19, 6, 2, 4, maisEscuro(c));
  pintar(ctx, 12, 15, 8, 4, ESCURO); // bolso
  pintar(ctx, 13, 16, 6, 1, "rgba(255,255,255,0.3)");
  if (q.S) pintar(ctx, 10, 10, 2, 12, LUZ);
}

function pecaCapa(ctx, c, q) {
  comContorno(ctx, 7, 7, 18, 19, c);
  pintar(ctx, 12, 5, 8, 4, maisEscuro(c)); // gola
  pintar(ctx, 16, 8, 2, 16, maisEscuro(c));
  pintar(ctx, 7, 24, 18, 2, ESCURO);
  if (q.D === 2) pintar(ctx, 10, 12, 2, 2, "#ffe3a1");
}

// ---- elmos ---------------------------------------------------------------
function pecaCapuz(ctx, c, q) {
  comContorno(ctx, 8, 6, 16, 16, c);
  pintar(ctx, 11, 12, 10, 9, ESCURO);
  pintar(ctx, 13, 14, 2, 2, "#171326");
  pintar(ctx, 17, 14, 2, 2, "#171326");
  pintar(ctx, 15, 2, 2, 5, maisEscuro(c));
  if (q.S) pintar(ctx, 9, 8, 2, 6, LUZ);
}

function pecaElmo(ctx, c, q) {
  comContorno(ctx, 8, 7, 16, 15, METAL);
  pintar(ctx, 9, 8, 5, 14, maisEscuro(c));
  pintar(ctx, 11, 14, 12, 2, ESCURO); // fenda
  pintar(ctx, 15, 10, 2, 8, METAL_ESCURO);
  if (q.D) pintar(ctx, 15, 3, 2, 4, c); // crista
  pintar(ctx, 10, 20, 12, 2, METAL_ESCURO);
}

function pecaCoroa(ctx, c, q) {
  pintar(ctx, 8, 13, 16, 8, ESCURO);
  pintar(ctx, 9, 14, 14, 6, c);
  for (const x of [9, 15, 21]) pintar(ctx, x, 8, 2, 6, c);
  pintar(ctx, 15, 5 - q.T, 2, 4, c);
  pintar(ctx, 12, 16, 2, 2, "#ff7aa8");
  pintar(ctx, 18, 16, 2, 2, "#6bd5ff");
  if (q.S) pintar(ctx, 10, 15, 1, 4, LUZ);
}

function pecaMascara(ctx, c, q) {
  comContorno(ctx, 8, 8, 16, 11, c);
  pintar(ctx, 10, 11, 4, 3, "#14121f");
  pintar(ctx, 18, 11, 4, 3, "#14121f");
  pintar(ctx, 12, 16, 8, 1, maisEscuro(c));
  pintar(ctx, 7, 17, 2, 3, maisEscuro(c));
  pintar(ctx, 23, 17, 2, 3, maisEscuro(c));
}

function pecaTurbante(ctx, c, q) {
  comContorno(ctx, 8, 7, 16, 10, c);
  for (let i = 0; i < 3; i++) pintar(ctx, 9, 9 + i * 3, 14, 1, maisEscuro(c));
  pintar(ctx, 15, 4, 2, 3, "#ffe3a1");
  pintar(ctx, 18, 5, 3, 2, "#ffe3a1");
  if (q.D === 1) pintar(ctx, 19, 8, 2, 2, "#6bd5ff");
}

function pecaOculos(ctx, c, q) {
  pintar(ctx, 8, 12, 7, 5, ESCURO);
  pintar(ctx, 17, 12, 7, 5, ESCURO);
  pintar(ctx, 9, 13, 5, 3, c);
  pintar(ctx, 18, 13, 5, 3, c);
  pintar(ctx, 15, 14, 2, 1, METAL_ESCURO);
  pintar(ctx, 7, 13, 2, 1, METAL_ESCURO);
  pintar(ctx, 23, 13, 2, 1, METAL_ESCURO);
}

function pecaLente(ctx, c) {
  pintar(ctx, 10, 8, 12, 12, ESCURO);
  pintar(ctx, 11, 9, 10, 10, c);
  pintar(ctx, 13, 11, 3, 3, "rgba(255,255,255,0.5)");
  pintar(ctx, 15, 20, 2, 7, METAL_ESCURO);
}

function pecaFones(ctx, c, q) {
  pintar(ctx, 9, 6, 14, 2, METAL_ESCURO);
  pintar(ctx, 8, 7, 2, 8, ESCURO);
  pintar(ctx, 22, 7, 2, 8, ESCURO);
  pintar(ctx, 7, 13, 5, 8, c);
  pintar(ctx, 20, 13, 5, 8, c);
  pintar(ctx, 8, 17, 3, 2, maisEscuro(c));
  pintar(ctx, 21, 17, 3, 2, maisEscuro(c));
}

// ---- miudezas ------------------------------------------------------------
function pecaEscudo(ctx, c, q) {
  comContorno(ctx, 8, 6, 16, 16, METAL_ESCURO);
  pintar(ctx, 9, 7, 14, 12, c);
  pintar(ctx, 9, 19, 14, 2, maisEscuro(c));
  for (let i = 0; i < 3; i++) pintar(ctx, 13 + i, 21 + i, 6 - i * 2, 1, METAL_ESCURO);
  pintar(ctx, 14, 11, 4, 4, METAL);
  pintar(ctx, 15, 9, 2, 8, "#ffe3a1");
}

function pecaAnel(ctx, c, q) {
  const r = 2 + q.G;
  pintar(ctx, 16 - r - 3, 11, (r + 3) * 2, 10, ESCURO);
  pintar(ctx, 16 - r - 2, 12, (r + 2) * 2, 8, METAL);
  pintar(ctx, 16 - r - 1, 14, (r + 1) * 2, 4, "rgba(0,0,0,0.45)");
  pintar(ctx, 14, 6, 4, 4, c);
  if (q.S) pintar(ctx, 15, 7, 1, 1, LUZ);
}

function pecaColar(ctx, c, q) {
  for (let i = 0; i < 5; i++) pintar(ctx, 8 + i * 4, 9 + (i === 2 ? -1 : 0), 2, 2, METAL);
  pintar(ctx, 14, 12, 4, 3, ESCURO);
  pintar(ctx, 15, 13, 2, 6, c);
  pintar(ctx, 15, 6, 2, 3, METAL_ESCURO);
}

function pecaPerneiras(ctx, c, q) {
  comContorno(ctx, 8, 5, 7, 20, maisEscuro(c));
  pintar(ctx, 9, 6, 5, 18, c);
  pintar(ctx, 17, 5, 7, 20, maisEscuro(c));
  pintar(ctx, 18, 6, 5, 18, c);
  pintar(ctx, 9, 10, 5, 1, LUZ);
  pintar(ctx, 18, 10, 5, 1, LUZ);
}

function pecaBotas(ctx, c, q) {
  comContorno(ctx, 8, 8, 6, 12, COURO);
  pintar(ctx, 9, 9, 4, 9, c);
  pintar(ctx, 8, 18, 10, 4, c);
  comContorno(ctx, 18, 8, 6, 12, COURO);
  pintar(ctx, 19, 9, 4, 9, c);
  pintar(ctx, 16, 18, 10, 4, c);
  if (q.S) pintar(ctx, 10, 10, 2, 1, LUZ);
}

function pecaGema(ctx, c, q) {
  const r = 3 + q.D;
  pintar(ctx, 16 - r - 1, 16 - r - 1, (r + 1) * 2, (r + 1) * 2, ESCURO);
  pintar(ctx, 16 - r, 16 - r, r * 2, r * 2, c);
  pintar(ctx, 16 - r + 1, 16 - r + 1, r, r, "rgba(255,255,255,0.3)");
  pintar(ctx, 15, 6, 2, 4, c);
  if (q.S) pintar(ctx, 14, 15, 2, 6, LUZ);
}

function pecaRuna(ctx, c, q) {
  comContorno(ctx, 8, 5, 16, 22, "#3a3550");
  pintar(ctx, 10, 7, 12, 3, c);
  pintar(ctx, 15, 10, 2, 9, c);
  pintar(ctx, 11, 14, 9, 2, c);
  pintar(ctx, 12, 20, 8, 2, maisEscuro(c));
}

function pecaFerramenta(ctx, c, q) {
  pintar(ctx, 15, 12, 2, 16, MADEIRA);
  pintar(ctx, 10, 6, 12, 6, ESCURO);
  pintar(ctx, 11, 7, 10, 4, c);
  pintar(ctx, 13, 8, 4, 1, LUZ);
  if (q.T) pintar(ctx, 16 - 1, 13, 4, 2, METAL_ESCURO);
}

function pecaLivro(ctx, c, q) {
  comContorno(ctx, 8, 7, 16, 19, maisEscuro(c));
  pintar(ctx, 10, 9, 12, 3, c);
  pintar(ctx, 10, 13, 3, 9, "#d9d0ff");
  for (let i = 0; i < 3; i++) pintar(ctx, 14, 14 + i * 3, 7, 1, "#d9d0ff");
  pintar(ctx, 10, 24, 12, 1, ESCURO);
}

function pecaComida(ctx, c, q) {
  pintar(ctx, 7, 17, 18, 7, "#0b1224");
  pintar(ctx, 8, 16, 16, 7, "#b07a3a");
  pintar(ctx, 9, 15, 14, 3, "#d8a45a");
  pintar(ctx, 12, 12, 8, 3, c);
  if (q.S) pintar(ctx, 10, 18, 3, 1, "rgba(255,255,255,0.35)");
}

function pecaPlanta(ctx, c, q) {
  pintar(ctx, 7, 18, 18, 6, "#0b1224");
  pintar(ctx, 14, 12, 4, 11, "#2f7a4a");
  pintar(ctx, 9, 10, 6, 8, c);
  pintar(ctx, 17, 9, 6, 9, maisEscuro(c));
  if (q.D) pintar(ctx, 15, 6, 2, 4, c);
}

function pecaTech(ctx, c, q) {
  comContorno(ctx, 9, 8, 14, 16, "#162032");
  pintar(ctx, 11, 11, 10, 2, c);
  pintar(ctx, 11, 15, 10, 2, maisEscuro(c));
  for (let i = 0; i < 4; i++) {
    pintar(ctx, 6, 10 + i * 3, 3, 1, METAL_ESCURO);
    pintar(ctx, 23, 10 + i * 3, 3, 1, METAL_ESCURO);
  }
  if (q.S) pintar(ctx, 12, 12, 1, 1, LUZ);
}

function pecaPocao(ctx, c, q) {
  pintar(ctx, 13, 3, 6, 3, MADEIRA);
  pintar(ctx, 11, 6, 10, 6, "rgba(220,235,255,0.22)");
  pintar(ctx, 10, 10, 12, 15, ESCURO);
  pintar(ctx, 11, 11, 10, 13, "rgba(220,235,255,0.22)");
  pintar(ctx, 12, 15, 8, 8, c);
  pintar(ctx, 13, 16, 2, 2, LUZ);
  if (q.D === 1) pintar(ctx, 13, 6, 6, 2, "#c9a227");
}

function pecaTocha(ctx, c) {
  pintar(ctx, 15, 10, 2, 17, MADEIRA);
  pintar(ctx, 14, 6, 4, 5, c);
  pintar(ctx, 15, 3, 2, 4, "#ffe3a1");
  pintar(ctx, 13, 8, 1, 2, "#ffc857");
  pintar(ctx, 18, 8, 1, 2, "#ffc857");
}

function pecaBomba(ctx, c, q) {
  pintar(ctx, 16, 6, 2, 4, MADEIRA);
  pintar(ctx, 17, 3, 2, 3, "#ffc857");
  comContorno(ctx, 9, 9, 14, 14, "#2a2438");
  pintar(ctx, 11, 11, 10, 10, maisEscuro(c));
  pintar(ctx, 14, 14, 4, 4, c);
  if (q.S) pintar(ctx, 12, 12, 2, 1, LUZ);
}

function pecaPeixe(ctx, c, q) {
  const cor = q.D === 2 ? "#ffc857" : q.D === 1 ? "#6bd5ff" : c;
  pintar(ctx, 5, 11, 4, 4, cor);
  pintar(ctx, 4, 13, 4, 5, cor);
  pintar(ctx, 8, 12, 15, 9, ESCURO);
  pintar(ctx, 9, 13, 13, 7, cor);
  pintar(ctx, 13, 10, 6, 3, cor);
  pintar(ctx, 18, 15, 2, 2, "#101426");
  pintar(ctx, 9, 14, 11, 1, "rgba(255,255,255,0.35)");
}

const DESENHOS = {
  lamina: armaLamina, espada: armaEspada, malho: armaMalho, maca: armaMaca,
  bastao: armaBastao, cetro: armaCetro, cajado: armaCajado, batuta: armaBatuta,
  pena: armaPena, caneta: armaCaneta, frasco: armaFrasco, chave: armaChave,
  manto: pecaManto, casaca: pecaCasaca, colete: pecaColete, avental: pecaAvental, capa: pecaCapa,
  capuz: pecaCapuz, elmo: pecaElmo, coroa: pecaCoroa, mascara: pecaMascara,
  turbante: pecaTurbante, oculos: pecaOculos, lente: pecaLente, fones: pecaFones,
  escudo: pecaEscudo, anel: pecaAnel, colar: pecaColar, perneiras: pecaPerneiras, botas: pecaBotas,
  gema: pecaGema, runa: pecaRuna, ferramenta: pecaFerramenta, livro: pecaLivro,
  comida: pecaComida, planta: pecaPlanta, tech: pecaTech, pocao: pecaPocao,
  tocha: pecaTocha, bomba: pecaBomba, peixe: pecaPeixe,
};

function desenhar(ctx, item) {
  const c = corDe(item);
  ctx.clearRect(0, 0, 32, 32);
  const familia = familiaDe(item);
  const desenho = DESENHOS[familia] || pecaFerramenta;
  // textura do material: entra por cima do desenho, em dois ou três pixels
  desenho(ctx, c, param(item));
  if (item.material === "cobre") {
    pintar(ctx, 12, 20, 2, 2, "rgba(90,200,160,0.45)");
  } else if (item.material === "vidro") {
    pintar(ctx, 19, 10, 2, 6, "rgba(220,240,255,0.25)");
  } else if (item.material === "cristal") {
    pintar(ctx, 19, 12, 1, 4, "rgba(255,255,255,0.45)");
  } else if (item.material === "ferro") {
    pintar(ctx, 13, 12, 6, 1, "rgba(255,255,255,0.18)");
  }
}

export const FAMILIAS = Object.keys(DESENHOS);

export function itemIconCanvas(item) {
  const chave = JSON.stringify([item?.id || "item",item?.name,item?.accent,item?.continent,item?.material,item?.slot]);
  if (cache.has(chave)) return cache.get(chave);
  const canvas = document.createElement("canvas");
  canvas.width = 32;
  canvas.height = 32;
  canvas.className = "item-art";
  const ctx = canvas.getContext("2d");
  if (ctx) {
    ctx.imageSmoothingEnabled = false;
    desenhar(ctx, item || {});
    const family=familiaDe(item);
    detailItem(ctx,family,semente(chave));
    const material=['manto','casaca','colete','avental','capa','capuz','perneiras'].includes(family)?'cloth'
      : ['bastao','cajado','batuta','livro'].includes(family)?'wood':'metal';
    finishMaterial(ctx,32,32,material,semente(chave));
    // Acabamento: o ícone cru ganha contorno escuro de um pixel e um véu de
    // luz em cima. É feito uma vez por item, no cache, e vale para todo o catálogo.
    const S = 40;
    const bruto = document.createElement("canvas");
    bruto.width = S;
    bruto.height = S;
    const gb = bruto.getContext("2d");
    // no teste o canvas é de mentira e não tem drawImage: o desenho cru basta
    if (!gb || typeof gb.drawImage !== "function") {
      cache.set(chave, canvas);
      return canvas;
    }
    gb.imageSmoothingEnabled = false;
    gb.drawImage(canvas, 4, 4);
    gb.globalCompositeOperation = "source-atop";
    const luz = gb.createLinearGradient(0, 4, 0, 36);
    luz.addColorStop(0, "rgba(255,255,255,0.20)");
    luz.addColorStop(0.5, "rgba(255,255,255,0)");
    luz.addColorStop(1, "rgba(0,0,0,0.34)");
    gb.fillStyle = luz;
    gb.fillRect(0, 0, S, S);
    gb.globalCompositeOperation = "source-over";
    const silhueta = document.createElement("canvas");
    silhueta.width = S;
    silhueta.height = S;
    const gs = silhueta.getContext("2d");
    gs.imageSmoothingEnabled = false;
    gs.drawImage(bruto, 0, 0);
    gs.globalCompositeOperation = "source-in";
    gs.fillStyle = "rgba(4,6,14,0.9)";
    gs.fillRect(0, 0, S, S);
    gs.globalCompositeOperation = "source-over";
    ctx.clearRect(0, 0, 32, 32);
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [1, -1], [-1, 1], [1, 1]]) {
      ctx.drawImage(silhueta, -4 + dx, -4 + dy);
    }
    ctx.drawImage(bruto, -4, -4);
    ctx.imageSmoothingEnabled = false;
  }
  if(cache.size>=640)cache.delete(cache.keys().next().value);
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

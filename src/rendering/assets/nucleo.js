// Núcleo da biblioteca de assets ambientais: cor, paleta por material e cache
// de sprite. Cada grupo (solo, vegetação, construção, fogo, água, props) só
// descreve como se desenha; quem desenha no quadro é o cache, uma vez por
// variante, e depois é um drawImage. Assim o detalhe não custa quadro.
//
// O cache tem teto e descarta o sprite mais antigo: visitar 86 áreas não enche
// a memória, porque só nasce sprite do que apareceu na tela.

export function misturar(a, b, t) {
  const pa = parseInt(a.slice(1), 16), pb = parseInt(b.slice(1), 16);
  const r = Math.round(((pa >> 16) & 255) * (1 - t) + ((pb >> 16) & 255) * t);
  const g = Math.round(((pa >> 8) & 255) * (1 - t) + ((pb >> 8) & 255) * t);
  const bl = Math.round((pa & 255) * (1 - t) + (pb & 255) * t);
  return `#${((r << 16) | (g << 8) | bl).toString(16).padStart(6, "0")}`;
}

export const claro = (hex, t) => misturar(hex, "#ffffff", t);
export const escuro = (hex, t) => misturar(hex, "#05070d", t);

// A paleta sai do bioma da área: o material decide o tom do tronco, da pedra e
// da telha; o acento da disciplina decide a folha e o tecido. É o que faz a
// mesma árvore parecer de giz numa ilha e de cobre em outra.
export function paletaDaArea(bioma) {
  const acento = bioma?.accent2 || bioma?.accent || "#ffc857";
  const base = bioma?.floor || "#1c1a2e";
  const caminho = bioma?.path || "#312c5e";
  // a folha puxa para o verde e guarda só um resto do acento; sem isso a
  // árvore da matemática vira silhueta roxa e some no chão
  const folha = misturar(acento, "#5fae6a", 0.72);
  const pedra = misturar(base, "#8b90ad", 0.55);
  const madeira = misturar("#8a5f3a", caminho, 0.2);
  return {
    chave: [bioma?.id || "generico", acento, base, caminho].join("|"),
    contorno: escuro(misturar(base, "#05070d", 0.5), 0.45),
    tronco: escuro(madeira, 0.25),
    troncoClaro: claro(madeira, 0.12),
    folha,
    folhaClara: claro(folha, 0.24),
    folhaEscura: escuro(folha, 0.22),
    pedra,
    pedraClara: claro(pedra, 0.16),
    pedraEscura: escuro(pedra, 0.28),
    madeira,
    madeiraClara: claro(madeira, 0.2),
    telha: escuro(misturar(acento, "#a34f36", 0.55), 0.1),
    telhaClara: claro(misturar(acento, "#a34f36", 0.55), 0.18),
    metal: acento,
    metalClaro: claro(acento, 0.25),
    tecido: misturar(acento, "#e8dfc8", 0.45),
    luz: "#ffe3a1",
    fogo: "#ffb26b",
    brasa: "#ff7a3d",
    sombra: "rgba(2,6,10,0.34)",
  };
}

// Cache LRU de sprite. `fabrica` existe para o teste rodar sem navegador.
export function criarCache(limite = 240, fabrica = () => document.createElement("canvas"), maxBytes = 8 * 1024 * 1024) {
  const mapa = new Map();
  let bytes = 0, acertos = 0, faltas = 0, descartes = 0;
  const remover = () => {
    const chave = mapa.keys().next().value;
    if (chave === undefined) return;
    const tela = mapa.get(chave);
    bytes -= tela.width * tela.height * 4;
    mapa.delete(chave); descartes++;
  };
  return {
    pegar(chave, largura, altura, desenhar) {
      const achado = mapa.get(chave);
      if (achado && achado.width === largura && achado.height === altura) {
        acertos++; mapa.delete(chave); mapa.set(chave, achado); return achado;
      }
      if (achado) { bytes -= achado.width * achado.height * 4; mapa.delete(chave); }
      faltas++;
      const tela = fabrica(); tela.width = largura; tela.height = altura;
      const g = tela.getContext("2d");
      if (!g) return tela;
      g.imageSmoothingEnabled = false; desenhar(g);
      const custo = largura * altura * 4;
      if (limite <= 0 || custo > maxBytes) return tela;
      while (mapa.size && (mapa.size >= limite || bytes + custo > maxBytes)) remover();
      mapa.set(chave, tela); bytes += custo;
      return tela;
    },
    tem(chave) { return mapa.has(chave); },
    get tamanho() { return mapa.size; },
    get stats() { return { acertos, faltas, descartes, bytes, maxBytes, tamanho: mapa.size }; },
    limpar() { mapa.clear(); bytes = 0; acertos = 0; faltas = 0; descartes = 0; },
  };
}

// Escolha determinística: o mesmo tile devolve sempre a mesma variante, então
// a ilha não troca de cara quando a pessoa recarrega.
export { variantIndex as variante } from "../../core/random.js";

// Quadro de animação pelo relógio da cena, com o mesmo passo em toda a ilha.
export function quadroAnimado(tempo, quadros, ms = 160) {
  return Math.floor(tempo / ms) % quadros;
}

// Cor com alfa, usada pelos ícones de conceito.
export function hexA(hex, a) {
  const n = parseInt(hex.slice(1), 16);
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${a})`;
}

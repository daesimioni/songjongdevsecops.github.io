// Tamanho de mundo das construções: fonte única para quem desenha e para quem
// coloca a peça no mapa. O desenho importa daqui; o mundo também, e assim o
// mundo deixa de depender do módulo de rendering.
export const ASSET_SIZE = {
  cabana: { w: 36, h: 30, escala: 2 },
  casa: { w: 44, h: 38, escala: 2 },
  torre: { w: 28, h: 52, escala: 2 },
  ruina: { w: 42, h: 28, escala: 1.5 },
  galpao: { w: 46, h: 32, escala: 2 },
  poco: { w: 22, h: 22, escala: 1.5 },
  cerca: { w: 20, h: 14, escala: 1.5 },
  doca: { w: 42, h: 20, escala: 1.5 },
};

// tamanho final, já com a escala de construção
export function tamanhoDoAsset(tipo) {
  const def = ASSET_SIZE[tipo];
  if (!def) return null;
  const escala = def.escala || 1;
  return { w: def.w * escala, h: def.h * escala };
}

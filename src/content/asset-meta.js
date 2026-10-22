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

// Metadados dos demais assets; desenho e colisão leem os mesmos valores.
export const ASSET_META = {
  ...Object.fromEntries(Object.entries(ASSET_SIZE).map(([tipo,def])=>[tipo,{...def,variantes:3,grupo:"construcao"}])),

  "arvore": {
    "w": 36,
    "h": 46,
    "variantes": 3,
    "grupo": "vegetacao"
  },
  "conifera": {
    "w": 26,
    "h": 48,
    "variantes": 3,
    "grupo": "vegetacao"
  },
  "palmeira": {
    "w": 34,
    "h": 48,
    "variantes": 3,
    "grupo": "vegetacao"
  },
  "seca": {
    "w": 26,
    "h": 36,
    "variantes": 3,
    "grupo": "vegetacao"
  },
  "arbusto": {
    "w": 22,
    "h": 18,
    "variantes": 3,
    "grupo": "vegetacao"
  },
  "junco": {
    "w": 18,
    "h": 24,
    "variantes": 3,
    "grupo": "vegetacao"
  },
  "florada": {
    "w": 22,
    "h": 15,
    "variantes": 3,
    "grupo": "vegetacao"
  },
  "trepadeira": {
    "w": 14,
    "h": 34,
    "variantes": 3,
    "grupo": "vegetacao"
  },
  "barril": {
    "w": 16,
    "h": 20,
    "variantes": 3,
    "grupo": "props"
  },
  "saco": {
    "w": 16,
    "h": 16,
    "variantes": 3,
    "grupo": "props"
  },
  "caixote": {
    "w": 18,
    "h": 18,
    "variantes": 3,
    "grupo": "props"
  },
  "fardo": {
    "w": 20,
    "h": 15,
    "variantes": 3,
    "grupo": "props"
  },
  "mesa": {
    "w": 26,
    "h": 18,
    "variantes": 2,
    "grupo": "props"
  },
  "cama": {
    "w": 28,
    "h": 20,
    "variantes": 2,
    "grupo": "props"
  },
  "estante": {
    "w": 20,
    "h": 34,
    "variantes": 2,
    "grupo": "props"
  },
  "gaivota": {
    "w": 18,
    "h": 12,
    "variantes": 1,
    "grupo": "props"
  },
  "pedraAgua": {
    "w": 20,
    "h": 14,
    "variantes": 3,
    "grupo": "agua"
  },
  "juncoAgua": {
    "w": 22,
    "h": 26,
    "variantes": 3,
    "grupo": "agua"
  },
  "espuma": {
    "w": 22,
    "h": 9,
    "variantes": 1,
    "grupo": "agua"
  },
  "lirio": {
    "w": 18,
    "h": 12,
    "variantes": 3,
    "grupo": "agua"
  },
  "fogueira": {
    "w": 24,
    "h": 20,
    "variantes": 2,
    "grupo": "fogo"
  },
  "braseiro": {
    "w": 16,
    "h": 22,
    "variantes": 2,
    "grupo": "fogo"
  },
  "tocha": {
    "w": 10,
    "h": 24,
    "variantes": 2,
    "grupo": "fogo"
  },
  "lanterna": {
    "w": 14,
    "h": 24,
    "variantes": 2,
    "grupo": "fogo"
  },
  "fumaca": {
    "w": 16,
    "h": 30,
    "variantes": 2,
    "grupo": "fogo"
  },
  "pedra": {
    "w": 20,
    "h": 12,
    "variantes": 3,
    "grupo": "solo"
  },
  "rachadura": {
    "w": 22,
    "h": 12,
    "variantes": 3,
    "grupo": "solo"
  },
  "raiz": {
    "w": 22,
    "h": 12,
    "variantes": 3,
    "grupo": "solo"
  },
  "poca": {
    "w": 20,
    "h": 12,
    "variantes": 3,
    "grupo": "solo"
  },
  "tufo": {
    "w": 16,
    "h": 11,
    "variantes": 3,
    "grupo": "solo"
  },
  "folhada": {
    "w": 20,
    "h": 10,
    "variantes": 3,
    "grupo": "solo"
  },
  "cogumelo": {
    "w": 18,
    "h": 12,
    "variantes": 3,
    "grupo": "solo"
  },
  "musgo": {
    "w": 20,
    "h": 10,
    "variantes": 3,
    "grupo": "solo"
  }

};

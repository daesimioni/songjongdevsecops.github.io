import { box as b, ball as o, entry as e, table, tree } from "./primitives.js";
const seat = (back = false) => [
  ...table(10, 10, 9),
  ...(back ? [b(0, -9, 9, 10, 2, 12, "wood")] : []),
];
const shelf = (w, h, mat = "wood") => [
  b(-w / 2 + 1, -5, 0, 2, 10, h, mat),
  b(w / 2 - 1, -5, 0, 2, 10, h, mat),
  ...[0, 9, 18].filter((z) => z < h).map((z) => b(0, -5, z, w, 10, 2, mat)),
];
export const furniture = [
  e("cadeira", "Cadeira", seat(true)),
  e("banco", "Banco", seat()),
  e("banco-longo", "Banco de praça", [
    ...table(28, 9, 9),
    b(0, -8, 9, 28, 2, 10, "wood"),
  ]),
  e("mesa-jantar", "Mesa de jantar", table(28, 18, 14)),
  e("mesa-redonda", "Mesa redonda", [
    b(0, -7, 0, 4, 4, 12, "wood"),
    o(0, -7, 12, 20, 16, 3, "wood", true),
  ]),
  e("escrivaninha", "Escrivaninha", [
    ...table(24, 14, 14),
    b(7, -7, 2, 8, 12, 10, "wood", true, "drawers"),
  ]),
  e("cama-solteiro", "Cama de solteiro", [
    b(0, -14, 0, 14, 28, 7, "wood"),
    b(0, -14, 7, 12, 26, 3, "cloth"),
    b(0, -24, 10, 10, 5, 2, "paper"),
    b(0, -27, 0, 16, 2, 18, "wood"),
  ]),
  e("beliche", "Beliche", [
    b(0, -14, 0, 16, 28, 5, "wood"),
    b(0, -14, 22, 16, 28, 3, "wood"),
    b(0, -14, 25, 14, 26, 2, "cloth"),
    b(-7, -14, 0, 2, 28, 30, "wood"),
  ]),
  e("sofa", "Sofá", [
    b(0, -7, 0, 28, 14, 8, "cloth"),
    b(0, -13, 8, 28, 2, 11, "cloth"),
    b(-13, -7, 8, 2, 14, 6, "cloth"),
    b(13, -7, 8, 2, 14, 6, "cloth"),
  ]),
  e("poltrona", "Poltrona", [
    b(0, -7, 0, 16, 14, 8, "cloth"),
    b(0, -13, 8, 16, 2, 12, "cloth"),
    b(-7, -7, 8, 2, 14, 5, "wood"),
    b(7, -7, 8, 2, 14, 5, "wood"),
  ]),
  e("armario", "Armário", [b(0, -6, 0, 20, 12, 30, "wood", true, "door")]),
  e("comoda", "Cômoda", [b(0, -6, 0, 22, 12, 15, "wood", true, "drawers")]),
  e("estante-vazia", "Estante vazia", shelf(20, 30)),
  e("estante-livros", "Estante de livros", [
    ...shelf(20, 30),
    ...[0, 1, 2, 3, 4].flatMap((i) => [
      b(i * 3 - 6, -5, 2, 2, 7, 6, i % 2 ? "cloth" : "paper", false),
      b(i * 3 - 6, -5, 11, 2, 7, 6, "leather", false),
    ]),
  ]),
  e("biombo", "Biombo", [
    b(-8, -1, 0, 8, 2, 24, "cloth"),
    b(0, -2, 0, 8, 2, 24, "paper"),
    b(8, -3, 0, 8, 2, 24, "cloth"),
  ]),
  e("tapete", "Tapete", [b(0, -10, 0, 28, 20, 0, "cloth", false)], {
    layer: "ground",
  }),
  e(
    "banheira",
    "Banheira",
    [b(0, -7, 0, 24, 14, 9, "marble"), b(0, -7, 9, 20, 10, 0, "water", false)],
    { frames: 8 },
  ),
  e("pia", "Pia", [
    b(0, -5, 0, 14, 10, 12, "marble"),
    b(0, -5, 12, 10, 6, 0, "water", false),
    b(0, -9, 12, 2, 2, 7, "copper"),
  ]),
  e("fogao", "Fogão", [
    b(0, -7, 0, 18, 14, 13, "iron", true, "door"),
    b(-4, -7, 13, 5, 5, 1, "basalt"),
    b(4, -7, 13, 5, 5, 1, "basalt"),
  ]),
  e(
    "lareira",
    "Lareira",
    [
      b(-9, -5, 0, 4, 10, 20, "brick"),
      b(9, -5, 0, 4, 10, 20, "brick"),
      b(0, -5, 18, 22, 10, 4, "stone"),
      o(0, -5, 0, 10, 5, 12, "fire"),
    ],
    { frames: 8 },
  ),
];
export const storage = [
  ...[
    ["pequeno", 10, 8],
    ["medio", 16, 12],
    ["grande", 24, 18],
  ].flatMap(([id, w, h]) => [
    e("caixote-" + id, "Caixote " + id, [
      b(0, -w / 2, 0, w, w, h, "wood", true, "crate"),
    ]),
    e("barril-" + id, "Barril " + id, [
      { ...o(0, -w / 2, 0, w, w, h, "wood", true), detail: "barrel" },
    ]),
    e("saco-" + id, "Saco " + id, [
      o(0, -w / 2, 0, w, w, h, "straw", true),
      b(0, -w / 2, h, 4, 4, 2, "rope"),
    ]),
  ]),
  e("bau", "Baú", [
    b(0, -6, 0, 18, 12, 10, "wood", true, "crate"),
    b(0, -6, 10, 18, 12, 3, "iron"),
  ]),
  e("pote", "Pote de barro", [
    o(0, -5, 0, 10, 10, 12, "clay", true),
    b(0, -5, 12, 6, 6, 1, "basalt"),
  ]),
  e("cesto", "Cesto de vime", [
    b(0, -5, 0, 12, 10, 8, "straw", true, "boards"),
  ]),
  e("pilha-toras", "Pilha de toras", [
    ...[-5, 0, 5].map((x) => o(x, -8, 0, 5, 16, 5, "bark", true)),
    o(0, -8, 5, 5, 16, 5, "bark"),
  ]),
  e("pilha-pedra", "Pilha de pedras", [
    o(-4, -5, 0, 10, 10, 7, "stone", true),
    o(5, -5, 0, 8, 8, 6, "stone", true),
    o(0, -5, 5, 8, 8, 5, "stone"),
  ]),
  e("pilha-livros", "Pilha de livros", [
    b(0, -4, 0, 10, 8, 2, "cloth"),
    b(1, -4, 2, 9, 8, 2, "paper"),
    b(-1, -4, 4, 10, 7, 2, "leather"),
  ]),
  e("rack-armas", "Suporte de armas", [
    ...shelf(18, 22),
    ...[-5, 0, 5].map((x) => b(x, -5, 3, 1, 1, 24, "iron", false)),
  ]),
  e("palete", "Palete", [
    ...[-5, 0, 5].map((x) => b(x, -8, 0, 3, 16, 2, "wood")),
    b(0, -8, 2, 16, 16, 1, "wood", true, "boards"),
  ]),
];
export const workshops = [
  e("bigorna", "Bigorna", [
    b(0, -4, 0, 8, 8, 3, "iron"),
    b(0, -4, 3, 5, 5, 8, "iron"),
    b(0, -4, 11, 18, 7, 4, "iron"),
  ]),
  e(
    "forja",
    "Forja",
    [
      b(0, -8, 0, 20, 16, 10, "brick"),
      b(0, -8, 10, 14, 10, 1, "fire", false),
      b(0, -14, 10, 20, 4, 20, "brick"),
    ],
    { frames: 8 },
  ),
  e("bancada", "Bancada de carpinteiro", [
    ...table(28, 14, 14),
    b(12, -5, 10, 3, 4, 7, "iron"),
    b(-3, -7, 14, 12, 3, 1, "wood", false),
  ]),
  e("serra", "Cavalete de serra", [
    ...table(20, 10, 12),
    b(0, -5, 12, 20, 1, 3, "iron", false),
  ]),
  e("tear", "Tear", [
    b(-9, -5, 0, 2, 10, 26, "wood"),
    b(9, -5, 0, 2, 10, 26, "wood"),
    b(0, -5, 24, 20, 2, 2, "wood"),
    b(0, -5, 8, 16, 1, 14, "cloth", false),
  ]),
  e("roca", "Roca de fiar", [
    b(0, -5, 0, 16, 10, 3, "wood"),
    o(0, -5, 3, 16, 3, 16, "wood", false),
    b(7, -5, 0, 2, 2, 25, "wood"),
  ]),
  e("oleiro", "Roda de oleiro", [
    b(0, -6, 0, 14, 12, 5, "wood"),
    o(0, -6, 10, 12, 12, 2, "stone", true),
    o(0, -6, 12, 7, 7, 8, "clay"),
  ]),
  e("forno", "Forno de cerâmica", [
    o(0, -10, 0, 22, 20, 24, "brick", true),
    b(0, -1, 0, 8, 2, 9, "basalt", false),
  ]),
  e("prensa", "Prensa tipográfica", [
    ...table(22, 14, 10),
    b(-8, -7, 10, 3, 3, 24, "iron"),
    b(8, -7, 10, 3, 3, 24, "iron"),
    b(0, -7, 31, 20, 4, 3, "wood"),
    b(0, -7, 20, 14, 10, 2, "iron"),
  ]),
  e("alvo", "Alvo de treino", [
    b(0, -3, 0, 3, 6, 14, "wood"),
    o(0, -3, 12, 16, 3, 16, "straw", true),
    o(0, -1, 16, 6, 1, 6, "tile"),
  ]),
];
export const nature = [
  ...[
    ["carvalho", 22, 26, "leaf"],
    ["pinheiro", 28, 18, "moss"],
    ["betula", 24, 18, "leaf"],
    ["salgueiro", 20, 30, "leaf"],
    ["macieira", 16, 22, "leaf"],
    ["cerejeira", 18, 24, "pink"],
    ["outono", 20, 26, "leafDry"],
  ].map(([id, h, c, mat]) =>
    e(id, "Árvore " + id, treeSpecies(id, h, c, mat), {
      frames: 8,
      tags: ["arvore", "vento"],
    }),
  ),
  e("toco", "Toco", [
    b(0, -4, 0, 9, 8, 7, "bark"),
    b(0, -4, 7, 8, 7, 1, "wood"),
  ]),
  e("tronco-caido", "Tronco caído", [o(0, -5, 0, 26, 10, 8, "bark", true)]),
  ...[
    ["pedregulho", 10, 8],
    ["rochedo", 24, 22],
    ["monolito", 10, 32],
  ].map(([id, w, h]) =>
    e(id, id, [o(0, -w / 3, 0, w, w * 0.7, h, "stone", true)]),
  ),
  ...[
    ["samambaia", "leaf"],
    ["capim", "grass"],
    ["lavanda", "purple"],
    ["flor-amarela", "gold"],
    ["flor-azul", "blue"],
    ["flor-rosa", "pink"],
    ["urtiga", "moss"],
  ].map(([id, mat]) =>
    e(
      id,
      id,
      [
        b(0, -3, 0, 1, 1, 6, "leaf", false),
        ...[-3, 0, 3].map((x, i) => o(x, -3, 3 + (i % 2) * 2, 5, 4, 6, mat)),
      ],
      { frames: 8, tags: ["planta", "vento"] },
    ),
  ),
  e("cacto", "Cacto", [
    b(0, -3, 0, 4, 4, 18, "leaf"),
    b(-4, -3, 8, 5, 3, 3, "leaf"),
    b(-6, -3, 10, 3, 3, 6, "leaf"),
    b(5, -3, 5, 5, 3, 3, "leaf"),
  ]),
  e("cogumelos", "Cogumelos", [
    ...[-3, 3].flatMap((x, i) => [
      b(x, -3, 0, 2, 2, 4 + i * 2, "paper", false),
      o(x, -3, 4 + i * 2, 7, 6, 3, "tile"),
    ]),
  ]),
  e("cristal", "Cristal", [
    o(0, -4, 0, 8, 8, 18, "glass", true),
    o(5, -3, 0, 5, 5, 10, "purple", true),
  ]),
  e("estalagmite", "Estalagmite", [o(0, -4, 0, 8, 8, 20, "stone", true)]),
];
export const agriculture = [
  ...[
    ["trigo", "straw"],
    ["milho", "gold"],
    ["cenoura", "clay"],
    ["repolho", "leaf"],
    ["tomate", "tile"],
    ["abobora", "copper"],
  ].flatMap(([id, mat]) => [
    e(
      id + "-broto",
      id + " — broto",
      [b(0, -4, 0, 10, 8, 0, "earth", false), o(0, -4, 0, 4, 4, 3, "leaf")],
      { layer: "ground" },
    ),
    e(
      id + "-maduro",
      id + " — maduro",
      [b(0, -4, 0, 10, 8, 0, "earth", false), ...crop(id, mat)],
      { frames: 8 },
    ),
  ]),
  e("canteiro", "Canteiro", [
    b(0, -8, 0, 30, 16, 2, "earth", false),
    b(-15, -8, 0, 2, 16, 3, "wood"),
    b(15, -8, 0, 2, 16, 3, "wood"),
  ]),
  e("espantalho", "Espantalho", [
    b(0, -3, 0, 2, 2, 22, "wood"),
    b(0, -3, 15, 20, 2, 2, "wood"),
    b(0, -3, 9, 8, 3, 9, "cloth", false),
    o(0, -3, 19, 7, 5, 7, "straw"),
  ]),
  e("colmeia", "Colmeia", [
    ...table(12, 10, 6),
    o(0, -5, 6, 12, 10, 14, "straw", true),
  ]),
  e(
    "bebedouro",
    "Bebedouro",
    [b(0, -5, 0, 24, 10, 6, "stone"), b(0, -5, 6, 20, 7, 0, "water", false)],
    { frames: 8 },
  ),
  e("composteira", "Composteira", [
    b(0, -8, 0, 16, 16, 8, "wood", true, "boards"),
    o(0, -8, 8, 14, 14, 4, "earth"),
  ]),
  e("feno", "Fardo de feno", [b(0, -7, 0, 18, 14, 12, "straw", true, "crate")]),
];
export const civic = [
  e("placa", "Placa de direção", [
    b(0, -2, 0, 2, 2, 18, "wood"),
    b(0, -2, 15, 18, 2, 6, "wood", false, "sign"),
  ]),
  e("quadro-avisos", "Quadro de avisos", [
    b(-8, -2, 0, 2, 3, 24, "wood"),
    b(8, -2, 0, 2, 3, 24, "wood"),
    b(0, -2, 12, 20, 2, 14, "wood", false),
    b(-4, -0.5, 15, 6, 1, 8, "paper", false),
    b(4, -0.5, 18, 5, 1, 6, "paper", false),
  ]),
  e(
    "fonte",
    "Fonte",
    [
      o(0, -10, 0, 28, 20, 4, "stone", true),
      o(0, -10, 4, 24, 16, 1, "water"),
      b(0, -10, 4, 4, 4, 20, "stone"),
      o(0, -10, 22, 12, 10, 2, "water"),
    ],
    { frames: 8 },
  ),
  e("estatua", "Estátua", [
    b(0, -5, 0, 14, 10, 5, "stone"),
    b(0, -5, 5, 7, 5, 16, "marble"),
    o(0, -5, 21, 7, 6, 8, "marble"),
  ]),
  e(
    "poste-luz",
    "Poste de iluminação",
    [
      b(0, -2, 0, 4, 4, 3, "iron"),
      b(0, -2, 3, 2, 2, 28, "iron"),
      b(0, -2, 29, 7, 6, 8, "gold", false),
    ],
    { frames: 8 },
  ),
  e(
    "bandeira",
    "Bandeira",
    [b(0, -2, 0, 2, 2, 32, "wood"), b(7, -2, 21, 12, 1, 10, "cloth", false)],
    { frames: 8 },
  ),
  e("tenda-mercado", "Tenda de mercado", [
    ...table(32, 16, 12),
    b(-15, -14, 0, 2, 2, 30, "wood"),
    b(15, -14, 0, 2, 2, 30, "wood"),
    b(0, -8, 29, 34, 18, 2, "cloth", false),
  ]),
  e("carrinho", "Carrinho de mão", [
    b(0, -8, 5, 16, 16, 7, "wood"),
    o(0, -1, 0, 4, 4, 7, "iron", true),
    b(-6, -20, 5, 2, 10, 2, "wood"),
    b(6, -20, 5, 2, 10, 2, "wood"),
  ]),
  e("carroca", "Carroça", [
    b(0, -12, 6, 24, 24, 3, "wood"),
    ...[-12, 12].map((x) => o(x, -12, 0, 3, 16, 12, "wood", true)),
    b(-11, -12, 9, 2, 24, 7, "wood"),
    b(11, -12, 9, 2, 24, 7, "wood"),
  ]),
  e("barraca", "Barraca de acampamento", [
    b(-9, -10, 0, 2, 20, 15, "cloth"),
    b(9, -10, 0, 2, 20, 15, "cloth"),
    b(0, -10, 14, 20, 20, 2, "cloth", false),
  ]),
  e("ponte", "Módulo de ponte", [
    b(0, -8, 0, 16, 16, 2, "wood", false, "boards"),
    b(-7, -8, 2, 1, 16, 8, "wood"),
    b(7, -8, 2, 1, 16, 8, "wood"),
  ]),
  e("boia", "Boia", [o(0, -4, 0, 9, 8, 4, "tile")], { frames: 8 }),
  e("ancora", "Âncora", [
    b(0, -3, 0, 2, 2, 15, "iron"),
    b(0, -3, 2, 14, 2, 2, "iron"),
    b(-6, -3, 2, 2, 2, 5, "iron"),
    b(6, -3, 2, 2, 2, 5, "iron"),
  ]),
  e("sarcofago", "Sarcófago", [
    b(0, -14, 0, 14, 28, 10, "stone", true, "masonry"),
    b(0, -14, 10, 16, 30, 2, "marble"),
  ]),
  e("lapide", "Lápide", [
    b(0, -3, 0, 12, 6, 3, "stone"),
    b(0, -3, 3, 9, 3, 14, "stone", true, "sign"),
  ]),
];
export const learning = [
  e("lousa", "Lousa", [
    b(-9, -3, 0, 2, 5, 27, "wood"),
    b(9, -3, 0, 2, 5, 27, "wood"),
    b(0, -3, 10, 24, 2, 18, "basalt", false, "sign"),
  ]),
  e("globo", "Globo terrestre", [
    ...table(12, 10, 7),
    o(0, -5, 7, 12, 10, 12, "blue"),
  ]),
  e("telescopio", "Telescópio", [
    b(-5, -5, 0, 2, 2, 12, "iron"),
    b(5, -5, 0, 2, 2, 12, "iron"),
    b(0, -7, 10, 5, 15, 5, "copper"),
    b(0, -14, 10, 7, 2, 7, "glass", false),
  ]),
  e("microscopio", "Microscópio", [
    b(0, -4, 0, 10, 8, 2, "iron"),
    b(3, -4, 2, 2, 2, 13, "iron"),
    b(0, -4, 13, 8, 3, 3, "iron"),
    b(-3, -4, 10, 2, 2, 5, "glass", false),
  ]),
  e(
    "alambique",
    "Alambique",
    [
      ...table(20, 12, 9),
      o(-5, -6, 9, 8, 8, 10, "copper"),
      b(3, -6, 17, 9, 2, 2, "copper"),
      o(7, -6, 9, 5, 5, 6, "glass"),
    ],
    { frames: 8 },
  ),
  e("balanca", "Balança", [
    b(0, -5, 0, 12, 8, 2, "iron"),
    b(0, -5, 2, 2, 2, 16, "copper"),
    b(0, -5, 17, 20, 1, 1, "copper"),
    ...[-8, 8].map((x) => o(x, -5, 10, 7, 6, 2, "copper")),
  ]),
  e("computador", "Computador", [
    ...table(20, 12, 12),
    b(0, -8, 12, 12, 3, 10, "iron"),
    b(0, -6, 14, 10, 1, 6, "circuit", false),
    b(0, -3, 12, 12, 3, 1, "paper", false),
  ]),
  e(
    "servidor",
    "Servidor",
    [
      b(0, -6, 0, 14, 12, 30, "iron", true, "drawers"),
      ...[4, 10, 16, 22].map((z) => b(3, 0, z, 2, 1, 1, "gold", false)),
    ],
    { frames: 8 },
  ),
  e("piano", "Piano", [
    b(0, -7, 0, 26, 14, 23, "wood"),
    b(0, -1, 12, 24, 4, 2, "checkers", false),
  ]),
  e("harpa", "Harpa", [
    b(0, -4, 0, 16, 8, 3, "wood"),
    b(-6, -4, 3, 2, 2, 26, "gold"),
    b(6, -4, 3, 2, 2, 20, "wood"),
    b(0, -4, 26, 14, 2, 2, "wood"),
    ...[-3, 0, 3].map((x) => b(x, -4, 3, 1, 1, 23, "straw", false)),
  ]),
  e("tambor", "Tambor", [
    o(0, -6, 0, 12, 12, 12, "leather", true),
    b(0, -6, 12, 12, 12, 1, "paper"),
  ]),
  e("estante-musical", "Estante de partitura", [
    b(0, -4, 0, 2, 2, 18, "iron"),
    b(0, -4, 16, 12, 2, 8, "paper", false, "sign"),
  ]),
  e("xadrez", "Mesa de xadrez", [
    ...table(18, 18, 12),
    b(0, -9, 12, 16, 16, 1, "checkers", false),
  ]),
  e("relogio", "Relógio de praça", [
    b(0, -3, 0, 4, 6, 22, "wood"),
    o(0, -3, 20, 14, 3, 14, "paper", false),
  ]),
];

function treeSpecies(id, h, c, mat) {
  if (id === "pinheiro")
    return [
      b(0, -2, 0, 4, 4, h, "bark"),
      ...[0, 1, 2].map((i) => ({
        ...o(0, -3, 10 + i * 8, c - i * 4, c * 0.6, 16, mat),
        kind: "cone",
      })),
    ];
  if (id === "salgueiro")
    return [
      ...tree(h, c, mat),
      ...[-10, -5, 5, 10].map((x) => o(x, -3, h - 9, 5, 5, 18, mat)),
    ];
  if (id === "betula")
    return [
      b(0, -2, 0, 3, 3, h, "paper"),
      ...[-4, 0, 4].map((x, i) => o(x, -3, h - 5 + i * 4, 12, 10, 13, mat)),
    ];
  if (id === "macieira")
    return [
      ...tree(h, c, mat),
      ...[-6, 0, 6].map((x, i) =>
        o(x, 0, h + 2 + (i % 2) * 3, 3, 3, 3, "tile"),
      ),
    ];
  return tree(h, c, mat);
}
function crop(id, mat) {
  if (id === "trigo")
    return [-3, 0, 3].flatMap((x) => [
      b(x, -4, 0, 0.5, 0.5, 9, "straw", false),
      o(x, -4, 7, 2, 2, 5, mat),
    ]);
  if (id === "milho")
    return [
      b(0, -4, 0, 1, 1, 14, "leaf", false),
      o(-2, -4, 6, 3, 3, 6, mat),
      o(2, -4, 9, 5, 2, 2, "leaf"),
    ];
  if (id === "cenoura")
    return [
      o(0, -4, 0, 3, 3, 5, mat),
      ...[-2, 0, 2].map((x) => b(x, -4, 4, 1, 1, 5, "leaf", false)),
    ];
  if (id === "repolho")
    return [o(0, -4, 0, 9, 7, 5, mat), o(0, -4, 3, 5, 4, 3, "moss")];
  if (id === "tomate")
    return [
      b(0, -4, 0, 1, 1, 12, "wood", false),
      o(0, -4, 4, 8, 4, 7, "leaf"),
      ...[-2, 2].map((x) => o(x, -2, 6 + x, 3, 2, 3, mat)),
    ];
  return [o(0, -4, 0, 10, 8, 7, mat), b(0, -4, 7, 1, 1, 2, "leaf", false)];
}

import { box as b, ball as o, entry as e, roof, slab } from "./primitives.js";
export const coast = [
  e("coral-ramificado", "Coral ramificado", [
    b(0, -3, 0, 2, 2, 12, "pink"),
    ...[-1, 1].flatMap((s) => [
      b(s * 3, -3, 4, 6, 2, 2, "pink", false),
      b(s * 5, -3, 4, 2, 2, 7, "pink", false),
    ]),
  ]),
  e("coral-cerebro", "Coral-cérebro", [o(0, -5, 0, 13, 10, 8, "purple", true)]),
  e(
    "coral-tubos",
    "Coral de tubos",
    [-4, 0, 4].map((x, i) => b(x, -4, 0, 3, 4, 6 + i * 3, "copper", true)),
  ),
  e(
    "alga-fita",
    "Alga de fita",
    [-3, 0, 3].map((x, i) => b(x, -3, 0, 1, 1, 10 + i * 3, "leaf", false)),
    { frames: 8 },
  ),
  e(
    "alga-leque",
    "Alga em leque",
    [-4, -2, 0, 2, 4].map((x, i) =>
      o(x, -3, 0, 3, 2, 10 - Math.abs(i - 2) * 2, "moss"),
    ),
    { frames: 8 },
  ),
  e(
    "loto",
    "Lótus",
    [
      o(0, -5, 0, 14, 10, 1, "leaf"),
      ...[-3, 0, 3].map((x) => o(x, -5, 1, 5, 4, 3, "pink")),
    ],
    { frames: 8 },
  ),
  e(
    "vitoria-regia",
    "Vitória-régia",
    [o(0, -8, 0, 24, 16, 1, "leaf"), o(3, -9, 1, 5, 4, 2, "pink")],
    { frames: 8 },
  ),
  e(
    "taboa",
    "Taboa",
    [-3, 0, 3].flatMap((x, i) => [
      b(x, -3, 0, 1, 1, 10 + i * 2, "leaf", false),
      o(x, -3, 9 + i * 2, 2, 2, 5, "bark"),
    ]),
    { frames: 8 },
  ),
  e("concha-espiral", "Concha espiral", [
    o(0, -4, 0, 8, 8, 6, "sand"),
    o(-1, -4, 4, 4, 4, 3, "paper"),
  ]),
  e(
    "concha-leque",
    "Concha leque",
    [-3, 0, 3].map((x, i) => o(x, -3, 0, 4, 6, 5 - Math.abs(i - 1), "pink")),
  ),
  e("ostra", "Ostra com pérola", [
    o(0, -4, 0, 10, 8, 2, "stone"),
    o(0, -5, 2, 8, 4, 5, "stone"),
    o(0, -2, 2, 3, 3, 3, "paper"),
  ]),
  e("estrela-mar", "Estrela-do-mar", [
    b(0, -3, 0, 2, 10, 1, "copper", false),
    b(0, -3, 0, 10, 2, 1, "copper", false),
    b(0, -3, 0, 6, 6, 1, "copper", false),
  ]),
  e("ourico", "Ouriço-do-mar", [
    o(0, -4, 0, 9, 8, 5, "purple"),
    ...[-3, 0, 3].map((x) => b(x, -4, 0, 1, 1, 8, "basalt", false)),
  ]),
  e("pedra-recife", "Rocha de recife", [
    o(0, -8, 0, 22, 16, 10, "stone", true),
    o(-5, -5, 7, 6, 5, 3, "pink"),
  ]),
  e(
    "espuma-costeira",
    "Espuma costeira",
    [-6, -2, 2, 6].map((x) => o(x, -3, 0, 7, 4, 1, "paper")),
    { frames: 8, layer: "ground" },
  ),
  e(
    "onda",
    "Crista de onda",
    [
      b(0, -5, 0, 30, 10, 2, "water", false),
      ...[-10, -5, 0, 5, 10].map((x) => o(x, -5, 2, 8, 3, 2, "paper")),
    ],
    { frames: 8, layer: "ground" },
  ),
  e(
    "cachoeira",
    "Módulo de cachoeira",
    [
      b(0, -2, 0, 16, 2, 32, "water", false),
      ...[-5, 0, 5].map((x) => b(x, -1, 0, 1, 1, 30, "paper", false)),
    ],
    { frames: 8, layer: "overlay" },
  ),
  e(
    "mangue",
    "Raízes de mangue",
    [
      ...[-5, 5].map((x) => b(x, -6, 0, 2, 10, 6, "bark")),
      b(0, -6, 5, 4, 4, 19, "bark"),
      o(0, -6, 21, 22, 16, 12, "leaf"),
    ],
    { frames: 8 },
  ),
  e("pilar-doca", "Pilar de doca", [
    b(0, -3, 0, 5, 6, 12, "wood"),
    b(0, -3, 10, 6, 7, 1, "rope"),
  ]),
  e(
    "passarela",
    "Passarela de doca",
    [b(0, -8, 0, 16, 16, 2, "wood", false, "boards")],
    { layer: "ground" },
  ),
  e("escada-doca", "Escada de doca", [
    b(-4, -2, 0, 1, 2, 18, "iron"),
    b(4, -2, 0, 1, 2, 18, "iron"),
    ...[3, 7, 11, 15].map((z) => b(0, -2, z, 8, 2, 1, "iron", false)),
  ]),
  e("amarracao", "Cabeço de amarração", [
    b(0, -4, 0, 10, 8, 2, "iron"),
    b(0, -4, 2, 4, 4, 7, "iron"),
    b(0, -4, 8, 9, 5, 2, "iron"),
  ]),
  e("rede-pesca", "Rede de pesca", [
    b(-9, -2, 0, 2, 3, 20, "wood"),
    b(9, -2, 0, 2, 3, 20, "wood"),
    ...[-6, -3, 0, 3, 6].map((x) => b(x, -2, 4, 1, 1, 14, "rope", false)),
    ...[5, 9, 13, 17].map((z) => b(0, -2, z, 18, 1, 1, "rope", false)),
  ]),
  e("vara-pesca", "Vara de pesca", [
    b(0, -2, 0, 1, 1, 26, "wood"),
    b(4, -2, 7, 1, 1, 18, "rope", false),
    b(2, -2, 25, 5, 1, 1, "wood", false),
  ]),
  e("armadilha-lagosta", "Armadilha para crustáceos", [
    b(0, -7, 0, 16, 14, 8, "wood", true, "crate"),
    b(0, 0, 2, 7, 1, 4, "basalt", false),
  ]),
  e("cesto-peixes", "Cesto de peixes", [
    b(0, -5, 0, 14, 10, 6, "straw", true, "boards"),
    ...[-4, 0, 4].map((x) => o(x, -5, 6, 3, 8, 2, "blue")),
  ]),
  e("barco-pesca", "Barco de pesca", [
    o(0, -16, 0, 22, 40, 7, "wood", true),
    b(0, -16, 6, 16, 24, 2, "basalt", false),
    b(0, -23, 8, 18, 3, 2, "wood", false),
    b(0, -10, 8, 18, 3, 2, "wood", false),
  ]),
  e(
    "bote-vela",
    "Bote a vela",
    [
      o(0, -16, 0, 22, 40, 7, "wood", true),
      b(0, -16, 6, 2, 2, 32, "wood"),
      b(8, -16, 16, 14, 1, 20, "cloth", false),
    ],
    { frames: 8 },
  ),
  e("naufragio", "Destroços de naufrágio", [
    o(-4, -14, 0, 20, 28, 6, "bark", true),
    b(4, -14, 3, 2, 2, 22, "wood"),
    b(0, -4, 0, 20, 4, 3, "wood"),
  ]),
  e(
    "boia-sinal",
    "Boia de sinalização",
    [
      o(0, -6, 0, 14, 12, 3, "tile"),
      b(0, -6, 2, 2, 2, 10, "iron", false),
      b(4, -6, 8, 7, 1, 5, "cloth", false),
    ],
    { frames: 8 },
  ),
  e("boia-salvamento", "Boia salva-vidas", [
    o(0, -6, 0, 14, 12, 2, "tile"),
    o(0, -6, 1, 7, 5, 1, "water"),
  ]),
  e("sino-porto", "Sino do porto", [
    b(-5, -2, 0, 2, 3, 20, "wood"),
    b(5, -2, 0, 2, 3, 20, "wood"),
    b(0, -2, 19, 14, 3, 2, "wood"),
    o(0, -2, 11, 7, 5, 7, "copper"),
  ]),
  e(
    "farol-pequeno",
    "Farol de sinalização",
    [
      b(0, -7, 0, 14, 14, 32, "stone", true, "masonry"),
      b(0, -7, 32, 18, 18, 2, "iron", false),
      b(0, -7, 34, 12, 12, 8, "gold", false),
      roof(0, -7, 42, 18, 18, 5, "tile"),
    ],
    { frames: 8 },
  ),
  e("ponte-corda", "Ponte de corda", [
    b(0, -8, 0, 16, 16, 1, "wood", false, "boards"),
    ...[-7, 7].map((x) => b(x, -8, 8, 1, 16, 1, "rope", true)),
  ]),
  e(
    "fonte-termal",
    "Fonte termal",
    [o(0, -12, 0, 34, 24, 3, "stone", true), o(0, -12, 3, 28, 18, 1, "water")],
    { frames: 8 },
  ),
  e("tesouro-pirata", "Tesouro pirata", [
    b(0, -6, 0, 18, 12, 8, "wood", true, "crate"),
    ...[-4, 0, 4].map((x) => o(x, -6, 8, 4, 4, 3, "gold")),
    b(0, -11, 8, 18, 2, 10, "wood", false),
  ]),
];
export const terrainEdges = ["sand", "water", "moss", "snow"].flatMap(
  (material) =>
    [
      "norte",
      "sul",
      "oeste",
      "leste",
      "canto-no",
      "canto-ne",
      "canto-so",
      "canto-se",
    ].map((side, i) => {
      const x =
        i === 2 || i === 4 || i === 6
          ? -4
          : i === 3 || i === 5 || i === 7
            ? 4
            : 0;
      const y =
        i === 0 || i === 4 || i === 5
          ? -12
          : i === 1 || i === 6 || i === 7
            ? -4
            : -8;
      return e(
        `transicao-${material}-${side}`,
        `Transição ${material} ${side}`,
        [
          ...slab("grass", 16, 16, 0),
          b(
            x,
            y,
            0,
            i < 2 ? 16 : 8,
            i === 2 || i === 3 ? 16 : 8,
            0,
            material,
            false,
          ),
        ],
        {
          layer: "ground",
          frames: material === "water" ? 8 : 1,
          tags: ["autotile", "transicao", "encaixe", side],
        },
      );
    }),
);
export const wildPlants = [
  e(
    "bambu",
    "Touceira de bambu",
    [-3, 0, 3].flatMap((x, i) => [
      b(x, -4, 0, 1, 1, 24 + i * 3, "leaf"),
      o(x + 2, -4, 14 + i * 3, 7, 3, 2, "leaf"),
    ]),
    { frames: 8 },
  ),
  e(
    "palmeira-coqueiro",
    "Coqueiro",
    [
      b(0, -3, 0, 4, 4, 27, "bark"),
      ...[-1, 1].flatMap((s) => [
        o(s * 8, -3, 25, 19, 5, 5, "leaf"),
        o(s * 4, -8, 28, 8, 14, 3, "leaf"),
      ]),
      o(2, -2, 24, 4, 4, 4, "wood"),
    ],
    { frames: 8 },
  ),
  e("pinheiro-nevado", "Pinheiro nevado", [
    b(0, -3, 0, 4, 4, 22, "bark"),
    ...[0, 1, 2].map((i) => ({
      ...o(0, -3, 8 + i * 7, 22 - i * 5, 12, 16, "snow"),
      kind: "cone",
    })),
  ]),
  e("arvore-morta", "Árvore morta", [
    b(0, -3, 0, 4, 4, 28, "bark"),
    b(-6, -3, 15, 10, 2, 2, "bark"),
    b(-10, -3, 15, 2, 2, 8, "bark"),
    b(6, -3, 22, 10, 2, 2, "bark"),
  ]),
  e(
    "arbusto-frutas",
    "Arbusto de frutas",
    [
      o(0, -5, 0, 18, 10, 10, "leaf", true),
      ...[-5, 0, 5].map((x) => o(x, -1, 5, 2, 2, 2, "purple")),
    ],
    { frames: 8 },
  ),
  e(
    "rosa",
    "Roseira",
    [
      b(0, -3, 0, 1, 1, 8, "leaf", false),
      o(-3, -3, 3, 6, 3, 3, "leaf"),
      o(0, -3, 8, 6, 5, 4, "pink"),
    ],
    { frames: 8 },
  ),
  e(
    "girassol",
    "Girassol",
    [
      b(0, -3, 0, 1, 1, 16, "leaf", false),
      o(0, -3, 14, 12, 2, 12, "gold"),
      o(0, -2, 16, 5, 2, 5, "bark"),
    ],
    { frames: 8 },
  ),
  e(
    "nenufar",
    "Nenúfar",
    [o(0, -6, 0, 16, 12, 1, "leaf"), o(3, -6, 1, 5, 4, 2, "paper")],
    { frames: 8 },
  ),
  e(
    "vinha",
    "Videira",
    [
      b(0, -2, 0, 1, 2, 23, "bark", false),
      ...[-6, -2, 2, 6].map((x, i) => o(x, -2, 5 + i * 5, 9, 3, 5, "leaf")),
    ],
    { frames: 8, layer: "overlay" },
  ),
  e(
    "mandragora",
    "Mandrágora",
    [
      o(0, -4, 0, 5, 5, 8, "earth"),
      ...[-1, 1].map((s) => o(s * 3, -4, 6, 7, 3, 3, "leaf")),
    ],
    { frames: 8 },
  ),
  e("cristal-gelo", "Cristal de gelo", [
    ...[-3, 0, 3].map((x, i) => ({
      ...o(x, -4, 0, 5, 5, 12 + i * 4, "ice", true),
      kind: "cone",
    })),
  ]),
  e("rocha-musgo", "Rocha com musgo", [
    o(0, -6, 0, 18, 12, 10, "stone", true),
    o(-2, -6, 8, 12, 8, 3, "moss"),
  ]),
  e("tronco-oco", "Tronco oco", [
    o(0, -6, 0, 28, 12, 9, "bark", true),
    o(11, -6, 2, 3, 8, 5, "basalt"),
  ]),
  e("ninho", "Ninho com ovos", [
    o(0, -4, 0, 12, 8, 3, "straw"),
    ...[-2, 2].map((x) => o(x, -4, 2, 3, 3, 4, "paper")),
  ]),
  e(
    "teia",
    "Teia de aranha",
    [
      b(0, -1, 8, 18, 1, 1, "paper", false),
      b(0, -1, 0, 1, 1, 18, "paper", false),
      b(0, -1, 0, 10, 1, 1, "paper", false),
    ],
    { layer: "overlay" },
  ),
  e("cogumelo-gigante", "Cogumelo gigante", [
    b(0, -4, 0, 4, 4, 20, "paper"),
    o(0, -4, 18, 26, 16, 8, "tile"),
    ...[-7, 2, 7].map((x) => o(x, -4, 24, 3, 3, 1, "paper")),
  ]),
];

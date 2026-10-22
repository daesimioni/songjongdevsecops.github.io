import { box, roof, entry, slab, pole } from "./primitives.js";
export const ground = [
  ...[
    ["grama", "Relva", "grass"],
    ["terra", "Terra batida", "earth"],
    ["areia", "Areia", "sand"],
    ["neve", "Neve", "snow"],
    ["cascalho", "Cascalho", "stone"],
    ["pedra", "Lajota de pedra", "stone"],
    ["tijolo", "Piso de tijolos", "brick"],
    ["madeira", "Assoalho", "wood"],
    ["marmore", "Mármore", "marble"],
    ["basalto", "Basalto", "basalt"],
    ["musgo", "Pedra musgosa", "moss"],
    ["metal", "Chapa de metal", "iron"],
    ["vidro", "Vidro reforçado", "glass"],
    ["circuito", "Piso de circuito", "circuit"],
    ["partitura", "Piso de partitura", "paper"],
    ["xadrez", "Ladrilho xadrez", "checkers"],
    ["barro", "Barro úmido", "clay"],
    ["gelo", "Gelo", "ice"],
    ["palha", "Palha", "straw"],
    ["folhas", "Folhas secas", "leafDry"],
    ["agua", "Água", "water"],
    ["lava", "Lava", "fire"],
  ].map(([id, name, mat]) =>
    entry(id, name, slab(mat, 16, 16, 0), {
      layer: "ground",
      frames: ["water", "fire"].includes(mat) ? 8 : 1,
      tags: ["piso", "modular", "tile"],
    }),
  ),
  ...["reta", "canto", "ponta", "ilha"].map((shape, i) =>
    entry(
      "margem-" + shape,
      "Margem " + shape,
      [
        ...slab("water", 16, 16, 0),
        box(
          i === 1 ? -4 : 0,
          i === 2 ? -4 : -2,
          0,
          i === 1 ? 8 : 16,
          i === 3 ? 8 : 4,
          1,
          "sand",
          false,
          shape,
        ),
      ],
      { layer: "ground", frames: 8, tags: ["costa", "agua", "encaixe"] },
    ),
  ),
  ...["reta", "curva", "bifurcacao", "cruzamento"].map((shape, i) =>
    entry(
      "caminho-" + shape,
      "Caminho " + shape,
      [
        ...slab("grass", 16, 16, 0),
        box(0, i === 1 ? -4 : -8, 0, 6, i === 1 ? 8 : 16, 0, "earth", false),
        ...(i
          ? [
              box(
                i === 1 || i === 2 ? 4 : 0,
                -8,
                0,
                i === 1 || i === 2 ? 8 : 16,
                6,
                0,
                "earth",
                false,
              ),
            ]
          : []),
      ],
      { layer: "ground", tags: ["trilha", "modular"] },
    ),
  ),
];
const materials = [
  ["pedra", "stone"],
  ["tijolo", "brick"],
  ["madeira", "wood"],
  ["barro", "clay"],
  ["ferro", "iron"],
  ["gelo", "ice"],
];
export const architecture = materials.flatMap(([name, mat]) => [
  entry(
    "parede-" + name,
    "Parede de " + name,
    [box(0, -2, 0, 16, 4, 28, mat, true, "masonry")],
    { snap: 1, tags: ["parede", "modular"] },
  ),
  entry(
    "canto-" + name,
    "Canto de " + name,
    [
      box(0, -2, 0, 16, 4, 28, mat, true, "masonry"),
      box(-6, -8, 0, 4, 16, 28, mat, true, "masonry"),
    ],
    { tags: ["parede", "canto", "modular"] },
  ),
  entry(
    "coluna-" + name,
    "Coluna de " + name,
    [
      box(0, -4, 0, 10, 8, 3, mat),
      box(0, -4, 3, 6, 6, 26, mat),
      box(0, -4, 29, 10, 8, 3, mat),
    ],
    { tags: ["coluna", "suporte"] },
  ),
  entry(
    "arco-" + name,
    "Arco de " + name,
    [
      box(-10, -2, 0, 4, 4, 25, mat),
      box(10, -2, 0, 4, 4, 25, mat),
      box(0, -2, 24, 24, 4, 5, mat, false),
      box(0, -2, 29, 10, 4, 3, mat, false),
    ],
    { tags: ["passagem", "arco"] },
  ),
]);
architecture.push(
  ...[
    ["telha", "tile"],
    ["palha", "straw"],
    ["ardosia", "basalt"],
    ["cobre", "copper"],
    ["vidro", "glass"],
  ].flatMap(([id, mat]) => [
    entry(
      "telhado-" + id,
      "Telhado de " + id,
      [roof(0, -16, 0, 32, 32, 14, mat)],
      { layer: "roof", tags: ["cobertura", "modular"] },
    ),
    entry(
      "beiral-" + id,
      "Beiral de " + id,
      [box(0, -4, 0, 16, 8, 2, mat, false, "boards")],
      { layer: "roof", tags: ["cobertura", "beiral"] },
    ),
  ]),
  ...[
    ["madeira", "wood"],
    ["ferro", "iron"],
    ["pedra", "stone"],
  ].map(([id, mat]) => {
    const frame = [
      box(-8, -2, 0, 3, 4, 24, mat),
      box(8, -2, 0, 3, 4, 24, mat),
      box(0, -2, 24, 19, 4, 3, mat, false),
    ];
    return entry("porta-" + id, "Porta de " + id, [], {
      defaultState: "closed",
      states: {
        closed: [...frame, box(0, -2, 0, 13, 2, 23, mat, true, "door")],
        open: [...frame, box(-7, -8, 0, 2, 14, 23, mat, true, "door")],
      },
      tags: ["porta", "passagem", "interativo"],
    });
  }),
  entry(
    "janela-madeira",
    "Janela de venezianas",
    [
      box(0, -2, 10, 12, 2, 12, "glass", false),
      box(-7, -2, 9, 3, 3, 14, "wood", false),
      box(7, -2, 9, 3, 3, 14, "wood", false),
      box(0, -2, 8, 16, 4, 2, "stone", false),
    ],
    { layer: "overlay", tags: ["janela", "fachada"] },
  ),
  entry(
    "janela-vitral",
    "Vitral",
    [
      box(0, -1, 8, 12, 2, 16, "stainedGlass", false, "window"),
      box(0, -1, 7, 16, 3, 2, "stone", false),
    ],
    { layer: "overlay", tags: ["janela", "templo"] },
  ),
  entry(
    "chamine",
    "Chaminé",
    [
      box(0, -4, 0, 8, 8, 16, "brick", false),
      box(0, -4, 16, 10, 10, 2, "stone", false),
      ballSmoke(),
    ],
    { layer: "roof", frames: 8, tags: ["fumaca", "cobertura"] },
  ),
  ...[4, 8, 12].map((h) =>
    entry(
      "escada-" + h,
      "Escada de " + h + " degraus",
      Array.from({ length: h }, (_, i) =>
        box(0, -(i + 0.5) * 2, 0, 16, 2, (i + 1) * 2, "stone", true, "steps"),
      ),
      { tags: ["acesso", "escada"] },
    ),
  ),
  entry("rampa", "Rampa de madeira", [roof(0, -8, 0, 16, 16, 8, "wood")], {
    tags: ["decoracao", "rampa"],
    note: "Peça visual; não altera elevação nem navegação.",
  }),
  entry(
    "fundacao",
    "Fundação",
    [box(0, -8, 0, 32, 16, 4, "stone", true, "masonry")],
    { tags: ["base", "modular"] },
  ),
  entry(
    "soleira",
    "Soleira",
    [box(0, -3, 0, 16, 6, 1, "stone", false, "steps")],
    { layer: "ground", tags: ["porta", "acesso"] },
  ),
);
function ballSmoke() {
  return {
    kind: "smoke",
    x: 0,
    y: -4,
    z: 20,
    w: 8,
    d: 8,
    h: 14,
    material: "smoke",
    solid: false,
  };
}
export const boundaries = [
  ...[
    ["madeira", "wood"],
    ["ferro", "iron"],
    ["pedra", "stone"],
    ["corda", "rope"],
    ["sebe", "leaf"],
  ].flatMap(([id, mat]) => [
    entry(
      "cerca-" + id,
      "Cerca de " + id,
      [
        pole(-7, -1, 0, 12, mat),
        pole(7, -1, 0, 12, mat),
        box(0, -1, 5, 16, 1, 2, mat),
        box(0, -1, 10, 16, 1, 1, mat),
      ],
      { tags: ["limite", "modular"] },
    ),
    entry("poste-" + id, "Poste de " + id, [box(0, -2, 0, 4, 4, 15, mat)], {
      tags: ["limite", "suporte"],
    }),
  ]),
  entry("portao", "Portão de curral", [], {
    defaultState: "closed",
    states: {
      closed: [
        pole(-10, -1, 0, 16),
        pole(10, -1, 0, 16),
        box(0, -1, 5, 18, 2, 8, "wood", true, "boards"),
      ],
      open: [
        pole(-10, -1, 0, 16),
        pole(10, -1, 0, 16),
        box(-9, -9, 5, 2, 18, 8, "wood"),
      ],
    },
    tags: ["passagem", "curral"],
  }),
  entry(
    "trilho",
    "Trilho",
    [
      ...slab("earth", 16, 16, 0),
      ...[-5, 5].map((x) => box(x, -8, 1, 1, 16, 1, "iron", false)),
      ...[-3, -8, -13].map((y) => box(0, y, 0, 14, 2, 1, "wood", false)),
    ],
    { layer: "ground", tags: ["mina", "transporte", "modular"] },
  ),
  entry(
    "mureta",
    "Mureta",
    [box(0, -2, 0, 16, 4, 8, "stone", true, "masonry")],
    { tags: ["limite", "modular"] },
  ),
  entry("meio-fio", "Meio-fio", [box(0, -1, 0, 16, 2, 2, "stone", false)], {
    layer: "ground",
    tags: ["rua", "modular"],
  }),
];

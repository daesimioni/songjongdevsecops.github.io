import { drawCreatureModel } from "../creature-models.js";
import { directionVector } from "../../core/movement.js";
import { EFFECT_ELEMENTS } from "../../content/sprite-kit/effects.js";
import { paintKitEffect } from "./effects.js";
import { volumePainter } from "../actor-volume.js";
function tint(color, offset) {
  return (
    "#" +
    [1, 3, 5]
      .map((i) =>
        Math.max(0, Math.min(255, parseInt(color.slice(i, i + 2), 16) + offset))
          .toString(16)
          .padStart(2, "0"),
      )
      .join("")
  );
}
export function paintKitCreature(
  g,
  a,
  { direction = 0, state = "idle", frame = 0 } = {},
) {
  const painter = volumePainter(g, direction),
    phase = (frame * Math.PI) / 4,
    w = a.width,
    l = a.length,
    c = a.color,
    dark = tint(c, -35),
    light = tint(c, 25),
    bone = "#e0d5b3";
  const walk = state === "walk",
    attack = state === "attack",
    death = state === "death",
    step = walk ? Math.sin(phase) * 2 : 0,
    breath = death ? 0 : Math.sin(phase) * 0.35;
  const collapse = death ? 1 - frame / 9 : 1;
  const transform = ([x, y, z]) => [
    x + (state === "hit" ? Math.sin((frame * Math.PI) / 7) * -3 : 0),
    y,
    z * collapse + (death ? 0 : breath),
  ];
  const B = (x, y, z, rx, ry, rz, color = c) => {
    const p = transform([x, y, z]);
    painter.ball(...p, rx, ry, Math.max(0.5, rz * collapse), color);
  };
  const L = (points, color = c, width = 1) =>
    painter.line(points.map(transform), color, width);
  const P = (points, color = c) => painter.plane(points.map(transform), color);
  const F = (x, y, z, spacing = 2) => {
    const p = transform([x, y, z]);
    painter.face(
      ...p,
      spacing,
      "#172539",
      state === "hit" || death || (state === "idle" && frame === 7),
    );
  };
  const thrust = attack ? Math.sin((frame * Math.PI) / 7) * 4 : 0;
  function legs(count = 4, height = 10) {
    for (const side of [-1, 1])
      for (let i = 0; i < count / 2; i++) {
        const y = (i - (count / 2 - 1) / 2) * l;
        const swing = step * (i % 2 ? side : -side);
        L(
          [
            [side * w * 0.7, y, height],
            [side * w * 0.8, y + swing * 0.5, height / 2],
            [side * w * 0.8, y + swing, Math.max(0, side * step) * 0.5],
          ],
          dark,
          2,
        );
        B(side * w * 0.8, y + swing, 1, 2, 2, 1, dark);
      }
  }
  function wings(span = 18, z = 16) {
    for (const side of [-1, 1]) {
      const flap = Math.sin(phase) * 5;
      P(
        [
          [side * w * 0.4, 0, z],
          [side * span, -3, z + flap],
          [side * (span - 3), -l, z + flap - 2],
          [side * w, -l * 0.5, z - 2],
        ],
        light,
      );
      for (let i = 0; i < 3; i++)
        L(
          [
            [side * w, 0, z],
            [side * (span - i * 2), -4 - i * 2, z + flap - 1],
          ],
          dark,
          0.7,
        );
    }
  }
  if (a.family === "quadruped") {
    legs(4, ["rabbit", "rat"].includes(a.species) ? 4 : 11);
    B(0, -1, ["rabbit", "rat"].includes(a.species) ? 5 : 12, w, l, w * 0.65);
    const hz = ["rabbit", "rat"].includes(a.species) ? 8 : 19;
    B(0, l * 0.7 + thrust, hz, w * 0.65, w * 0.65, w * 0.65, light);
    B(0, l + thrust, hz - 2, w * 0.4, w * 0.5, w * 0.3, light);
    B(0, l * 1.3 + thrust, hz - 1, 1, 1, 1, dark);
    for (const side of [-1, 1]) {
      const earHeight =
        a.species === "rabbit" ? 7 : a.species === "horse" ? 4 : 3;
      B(side * w * 0.5, l * 0.6, hz + w * 0.6, 1.5, 2, earHeight, dark);
      if (["deer", "goat", "cow"].includes(a.species)) {
        L(
          [
            [side * w * 0.5, l * 0.6, hz + 2],
            [side * w * 0.8, l * 0.5, hz + 9],
            [side * w * 1.1, l * 0.6, hz + 12],
          ],
          bone,
          1,
        );
        if (a.species === "deer")
          L(
            [
              [side * w * 0.8, l * 0.5, hz + 9],
              [side * w * 1.3, l * 0.8, hz + 8],
            ],
            bone,
            1,
          );
      }
      if (a.species === "boar")
        L(
          [
            [side * 3, l + 2, hz - 2],
            [side * 5, l + 3, hz + 2],
          ],
          bone,
          1.5,
        );
    }
    F(0, l * 0.95 + thrust, hz + 1, w * 0.3);
    const tail = a.species === "fox" ? 8 : a.species === "rat" ? 12 : 5;
    L(
      [
        [0, -l, 12],
        [Math.sin(phase) * 2, -l - tail * 0.5, 9],
        [Math.sin(phase) * 3, -l - tail, 7],
      ],
      dark,
      a.species === "fox" ? 4 : 1.5,
    );
    if (a.species === "sheep")
      for (let i = 0; i < 7; i++)
        B(
          Math.sin(i * 2) * w * 0.6,
          Math.cos(i * 2) * l * 0.6,
          15,
          3,
          3,
          3,
          bone,
        );
    if (a.species === "cow")
      for (const [x, y] of [
        [-3, -4],
        [4, 2],
      ])
        B(x, y, 16, 3, 3, 1, dark);
    if (["wolf", "dog", "fox"].includes(a.species))
      B(0, 0, 17, w * 0.6, l * 0.6, 2, dark);
  } else if (a.family === "bird") {
    const ground = ["chicken", "duck"].includes(a.species),
      z = ground ? 7 : 14;
    if (ground) legs(2, 6);
    else wings(w * 2.8, z + 2);
    B(0, 0, z, w, l, w);
    B(0, l * 0.6, z + 7, w * 0.65, w * 0.6, w * 0.65, light);
    P(
      [
        [-2, l, z + 6],
        [2, l, z + 6],
        [0, l + 5 + thrust, z + 4],
      ],
      "#d1ae68",
    );
    F(0, l * 0.85, z + 8, 2);
    P(
      [
        [-3, -l * 0.6, z],
        [3, -l * 0.6, z],
        [0, -l - 5, z + 2],
      ],
      dark,
    );
    if (ground)
      for (const side of [-1, 1])
        B(side * w * 0.75, 0, z, w * 0.3, l * 0.6, 2, dark);
    if (a.species === "chicken")
      for (let i = 0; i < 3; i++) B(0, l * 0.5 + i, z + 11, 1, 1, 2, "#b86657");
    if (a.species === "owl")
      for (const side of [-1, 1]) B(side * 2, l * 0.9, z + 8, 2, 1, 2, bone);
  } else if (a.family === "reptile") {
    const fish = ["fish", "shark"].includes(a.species),
      z = fish ? 7 : 5;
    if (!fish) legs(4, 5);
    B(0, 0, z, w, l, fish ? 4 : 3, c);
    B(0, l * 0.8 + thrust, z + 1, w * 0.65, w * 0.7, 3, light);
    F(0, l + thrust, z + 3, w * 0.35);
    const tail = Math.sin(phase) * 3;
    P(
      [
        [-2, -l * 0.7, z],
        [2, -l * 0.7, z],
        [tail + 5, -l - 7, z],
        [tail, -l - 4, z + 3],
        [tail - 5, -l - 7, z],
      ],
      dark,
    );
    if (fish) {
      for (const side of [-1, 1])
        P(
          [
            [side * w * 0.5, 0, z],
            [side * (w + 5), -4, z + 2],
            [side * w * 0.6, -6, z],
          ],
          light,
        );
      if (a.species === "shark")
        P(
          [
            [0, -4, z + 2],
            [0, -6, z + 11],
            [0, 3, z + 2],
          ],
          dark,
        );
    }
    if (a.species === "turtle") {
      B(0, -1, 7, w, l * 0.8, 5, dark);
      for (let i = 0; i < 5; i++)
        B(
          Math.sin(i * 2) * w * 0.5,
          Math.cos(i * 2) * l * 0.4,
          11,
          2,
          2,
          1,
          light,
        );
    }
    if (a.species === "frog")
      for (const side of [-1, 1]) B(side * 3, l * 0.5, 9, 2, 2, 2, bone);
    if (a.species === "crocodile")
      for (let i = 0; i < 6; i++)
        P(
          [
            [-1, -l + i * 4, 7],
            [0, -l + i * 4, 11],
            [1, -l + i * 4, 7],
          ],
          dark,
        );
  } else if (a.family === "invertebrate") {
    const z = a.species === "snail" ? 4 : 10;
    if (a.species === "snail") {
      B(0, 0, 3, 4, 9, 2, light);
      B(0, -2, 8, 5, 5, 5, c);
      for (const side of [-1, 1])
        L(
          [
            [side * 2, 6, 3],
            [side * 3, 8, 8],
          ],
          dark,
          1,
        );
    } else {
      for (const side of [-1, 1])
        for (let i = 0; i < 3; i++)
          L(
            [
              [side * 2, 3 - i * 3, z],
              [side * 5, 3 - i * 3 + step, z - 2],
              [side * 7, 3 - i * 3 + step, z - 5],
            ],
            dark,
            0.8,
          );
      B(0, -2, z, w, l, w * 0.7);
      B(0, l * 0.7, z + 2, 3, 3, 3, light);
      F(0, l + 1, z + 3, 1.5);
      if (a.species === "mantis")
        for (const side of [-1, 1])
          L(
            [
              [side * 2, l * 0.3, z],
              [side * 8, l + thrust, z + 4],
              [side * 4, l + 3 + thrust, z + 1],
            ],
            dark,
            2,
          );
      else {
        const span = a.species === "butterfly" ? 14 : 10;
        for (const side of [-1, 1])
          for (const yy of [-4, 2])
            P(
              [
                [side * 2, yy, z + 1],
                [side * span, yy - 3, z + 3 + Math.sin(phase) * 5],
                [side * (span - 2), yy + 4, z + 2],
                [side * 2, yy + 3, z],
              ],
              a.species === "butterfly" ? light : "#c1d9d5",
            );
      }
      if (["bee", "wasp"].includes(a.species))
        for (let i = 0; i < 3; i++)
          B(0, -l * 0.5 + i * 2, z + 2, w * 0.9, 1, 1, dark);
      for (const side of [-1, 1])
        L(
          [
            [side, l, z + 3],
            [side * 3, l + 3, z + 6],
          ],
          dark,
          0.7,
        );
    }
  } else if (a.family === "humanoid") {
    for (const side of [-1, 1]) {
      L(
        [
          [side * 2, 0, 12],
          [side * 3, side * step, 6],
          [side * 3, side * step, 1],
        ],
        dark,
        a.species === "skeleton" ? 1 : 3,
      );
      B(side * 3, side * step + 1, 1, 2, 3, 1, dark);
      L(
        [
          [side * 4, 0, 22],
          [side * 6, thrust, 16],
          [side * 5, 3 + thrust, 12],
        ],
        light,
        a.species === "skeleton" ? 1 : 2,
      );
    }
    B(0, 0, 18, w, 4, 7, c);
    B(0, 0, 29, 4, 3, 5, light);
    F(0, 3, 30, 1.5);
    if (a.species === "skeleton") {
      for (let i = 0; i < 4; i++)
        L(
          [
            [-3, 3, 16 + i * 2],
            [0, 4, 15 + i * 2],
            [3, 3, 16 + i * 2],
          ],
          bone,
          1,
        );
      B(0, 3, 27, 2, 1, 1, dark);
    }
    if (["orc", "goblin"].includes(a.species))
      for (const side of [-1, 1])
        P(
          [
            [side * 3, 0, 31],
            [side * 8, 0, 33],
            [side * 4, 2, 28],
          ],
          c,
        );
    if (a.species === "knight") {
      B(0, -0.5, 31, 5, 4, 5, "#a4adb6");
      L(
        [
          [-3, 3, 30],
          [3, 3, 30],
        ],
        dark,
        2,
      );
      L(
        [
          [6, 4, 12],
          [6, 4 + thrust, 27],
        ],
        bone,
        2,
      );
    }
    if (a.species === "mage") {
      P(
        [
          [-6, -2, 12],
          [6, -2, 12],
          [4, 0, 25],
          [-4, 0, 25],
        ],
        dark,
      );
      P(
        [
          [-6, 0, 33],
          [0, 0, 44],
          [6, 0, 33],
        ],
        c,
      );
      L(
        [
          [7, 4, 0],
          [7, 4, 31],
        ],
        "#ac8b61",
        1.5,
      );
      B(7, 4, 32, 2, 2, 3, "#b8b5db");
    }
  } else if (a.family === "mythical") {
    if (a.species === "mimic") {
      P(
        [
          [-8, -6, 2],
          [8, -6, 2],
          [8, 6, 2],
          [-8, 6, 2],
        ],
        dark,
      );
      B(0, 0, 8, 8, 7, 6, c);
      B(0, -2, 16 + thrust, 8, 6, 3, light);
      for (const x of [-5, -2, 2, 5])
        P(
          [
            [x - 1, 6, 13],
            [x + 1, 6, 13],
            [x, 6, 8],
          ],
          bone,
        );
      L(
        [
          [0, 5, 6],
          [3, 9 + thrust, 7],
          [0, 12 + thrust, 7],
        ],
        "#b77987",
        2,
      );
      F(0, 6, 17, 3);
    } else {
      legs(a.species === "phoenix" ? 2 : 4, 10);
      B(0, 0, 14, w, l, 6, c);
      const heads = a.species === "hydra" ? 3 : 1;
      for (let i = 0; i < heads; i++) {
        const x = (i - (heads - 1) / 2) * 6;
        L(
          [
            [0, l * 0.4, 14],
            [x, l * 0.7, 24],
            [x, l + thrust, 27],
          ],
          c,
          4,
        );
        B(x, l + thrust, 27, 4, 4, 4, light);
        F(x, l + 3 + thrust, 28, 1.5);
      }
      if (a.species !== "hydra") wings(Math.min(28, w * 2.6), 19);
      L(
        [
          [0, -l, 14],
          [Math.sin(phase) * 4, -l - 6, 10],
          [Math.sin(phase) * 5, -l - 12, 8],
        ],
        dark,
        3,
      );
      for (const side of [-1, 1])
        L(
          [
            [side * 3, l, 30],
            [side * 5, l - 2, 36],
          ],
          bone,
          1.5,
        );
    }
  } else {
    const float = 3 + Math.sin(phase) * 1.2;
    B(0, 0, 14 + float, w, l, 10, c);
    B(0, 1, 29 + float, 5, 4, 5, light);
    F(0, 4, 30 + float, 2);
    for (const side of [-1, 1]) {
      B(side * (w + 2), thrust, 17 + float, 3, 3, 5, c);
      for (let i = 0; i < 3; i++)
        B(side * (w + 4 + i), thrust, 10 + i * 4, 1.5, 1.5, 2, light);
    }
    for (let i = 0; i < 4; i++) {
      const t = phase + (i * Math.PI) / 2;
      B(Math.sin(t) * 9, Math.cos(t) * 5, 5 + i * 2, 2, 2, 2, light);
    }
    if (a.species === "ice")
      for (const side of [-1, 1])
        P(
          [
            [side * 3, 0, 32],
            [side * 8, 0, 42],
            [side * 6, 0, 29],
          ],
          bone,
        );
  }
  painter.flush();
}

export function paintMonsterCast(
  g,
  a,
  { direction = 0, state = "attack", frame = 0 } = {},
) {
  const f = directionVector(direction),
    amount = state === "attack" ? Math.sin((frame * Math.PI) / 7) * 3 : 0;
  const effect = {
    ...a,
    form:
      state === "telegraph" ? "aviso" : state === "impact" ? "impacto" : a.form,
  };
  if (state === "telegraph") paintKitEffect(g, effect, { direction, frame });
  g.save();
  g.translate(f.x * amount, f.y * amount);
  drawCreatureModel(
    g,
    a.model,
    EFFECT_ELEMENTS[a.element].color,
    frame * 100,
    direction,
    state === "attack",
  );
  g.restore();
  if (state !== "telegraph") {
    g.save();
    g.translate(f.x * 8, f.y * 8 - 4);
    paintKitEffect(g, effect, { direction, frame });
    g.restore();
  }
}

import { volumePainter, gait } from "./actor-volume.js";

export const CREATURE_MODELS = Object.freeze({
  slime: "gel",
  eye: "eye",
  bat: "wing",
  spider: "arthropod",
  wisp: "spirit",
  scorpion: "arthropod",
  golem: "biped",
  ant: "arthropod",
  moth: "wing",
  beetle: "arthropod",
  crab: "arthropod",
  jelly: "gel",
  imp: "biped",
  sentinel: "biped",
  serpent: "serpent",
  tome: "book",
  glyph: "relic",
  note: "relic",
  atom: "orbital",
  crystal: "crystal",
  gear: "relic",
  node: "orbital",
  prism: "crystal",
  vector: "relic",
  flask: "flask",
  boss: "biped",
});
// Oito poses fecham a passada. Energia orbital e líquido precisam do ciclo
// longo; parado usa 32 poses para respiração e piscada menos frequentes.
export function creatureFrameCount(kind, moving) {
  return moving && !["orbital", "flask"].includes(CREATURE_MODELS[kind])
    ? 8
    : 32;
}
export function drawCreatureModel(g, kind, color, time, dir, moving = false) {
  const a = volumePainter(g, dir),
    { ball, line, plane, face } = a,
    walk = gait(time, moving),
    family = CREATURE_MODELS[kind];
  const gold = "#e8bd78",
    dark = "#253348",
    light = "#e9ecd6",
    step = walk.step;
  const bob = moving
    ? Math.abs(walk.step) * 0.5
    : Math.sin((time * Math.PI) / 800) * 0.5;
  const blink = !moving && Math.floor(time / 180) % 27 === 0;
  if (family === "arthropod") {
    const count = kind === "spider" ? 4 : 3,
      wide = kind === "crab" ? 8 : 5;
    for (const side of [-1, 1])
      for (let i = 0; i < count; i++) {
        const y = (i - (count - 1) / 2) * 3,
          phase =
            Math.sin((time * Math.PI) / 200 + i * Math.PI + side) *
            (moving ? 1.3 : 0.12);
        line(
          [
            [side * wide, y, 5],
            [side * (wide + 4), y + phase, 3],
            [side * (wide + 6), y + phase + step, 0],
          ],
          dark,
          1.5,
        );
        ball(side * (wide + 4), y + phase, 3, 1, 1, 1, color);
      }
    ball(0, -3, 6, wide, kind === "ant" ? 7 : 5, 4, color);
    ball(
      0,
      4,
      6,
      kind === "ant" ? 3 : wide * 0.75,
      3,
      3,
      kind === "ant" ? dark : color,
    );
    face(0, 6, 7, 2, gold);
    line(
      [
        [0, -7, 8],
        [0, -2, 10],
        [0, 2, 8],
      ],
      dark,
      0.8,
    );
    if (kind === "spider")
      for (const x of [-2, 0, 2]) ball(x, -3, 10, 0.6, 0.6, 0.5, gold);
    if (kind === "beetle") {
      for (const side of [-1, 1])
        line(
          [
            [side, 6, 7],
            [side * 2, 10, 8],
            [side * 4, 12, 8],
          ],
          gold,
          1,
        );
    }
    if (kind === "ant")
      for (const side of [-1, 1])
        line(
          [
            [side, 6, 8],
            [side * 2, 10, 11],
            [side * 4, 11, 10],
          ],
          color,
          1,
        );
    if (kind === "scorpion") {
      line(
        [
          [0, -5, 5],
          [0, -10, 9],
          [0, -10, 16],
          [0, -5, 18],
          [0, -2, 14],
        ],
        dark,
        3,
      );
      ball(0, -2, 15, 1.5, 2, 1.5, gold);
    }
    if (kind === "crab" || kind === "scorpion")
      for (const side of [-1, 1]) {
        line(
          [
            [side * 4, 3, 4],
            [side * 10, 6, 5],
          ],
          color,
          2,
        );
        ball(side * 11, 8, 6, 3, 3, 2.5, color);
        line(
          [
            [side * 11, 8, 6],
            [side * 11, 11, 6],
          ],
          dark,
          1,
        );
      }
  } else if (family === "wing") {
    const flap = Math.sin(
        moving ? (time * Math.PI) / 200 : (time * Math.PI * 9) / 1600,
      ),
      moth = kind === "moth";
    for (const side of [-1, 1]) {
      ball(side * 9, -1, 12 + flap * 3, moth ? 7 : 9, 4, moth ? 5 : 2, color);
      line(
        [
          [side * 2, 0, 10],
          [side * 9, 1, 13 + flap * 3],
          [side * 16, -2, 12 + flap * 3],
        ],
        gold,
        0.7,
      );
      if (moth) ball(side * 10, 1, 13 + flap * 3, 2, 1, 2, dark);
      line(
        [
          [side * 2, 3, 13],
          [side * 3, 5, 18],
          [side * 5, 6, 19],
        ],
        gold,
        1,
      );
    }
    ball(0, 0, 10, 3, 6, 5, dark);
    ball(0, 4, 14, 3, 3, 3, color);
    face(0, 6, 15, 1.5, gold);
  } else if (family === "biped") {
    const boss = kind === "boss",
      imp = kind === "imp",
      size = boss ? 1.5 : imp ? 0.75 : 1;
    for (const side of [-1, 1]) {
      const stride = side * step * 2;
      ball(side * 4 * size, stride, 3, 3 * size, 3, 3, dark);
      ball(
        side * 4 * size,
        stride * 0.6,
        7 * size,
        2.5 * size,
        2.5,
        5 * size,
        color,
      );
      ball(side * 8 * size, -stride, 15 * size, 3 * size, 3, 6 * size, color);
      ball(side * 8 * size, 1 - stride, 10 * size, 2.5 * size, 2, 2, dark);
      if (boss || imp)
        line(
          [
            [side * 3 * size, 0, 25 * size],
            [side * 5 * size, 0, 29 * size],
            [side * 7 * size, 2, 30 * size],
          ],
          gold,
          2,
        );
    }
    ball(
      0,
      0,
      15 * size,
      7 * size,
      4,
      8 * size,
      kind === "sentinel" ? dark : color,
    );
    ball(0, 1, 24 * size, 5 * size, 4, 4 * size, color);
    face(0, 4.5, 25 * size, 2 * size, kind === "boss" ? "#ff8aa7" : gold);
    // Placas, juntas e símbolo só no plano frontal. Costas têm rebites e eixo.
    line(
      [
        [-5 * size, -3, 18 * size],
        [0, -4, 19 * size],
        [5 * size, -3, 18 * size],
      ],
      gold,
      0.8,
    );
    if (a.view.front) {
      ball(0, 4, 16 * size, 1.5, 1, 2, gold);
      line(
        [
          [-4, 4, 12 * size],
          [4, 4, 12 * size],
        ],
        dark,
        1,
      );
    } else
      line(
        [
          [0, -4, 10 * size],
          [0, -4, 21 * size],
        ],
        gold,
        1,
      );
  } else if (family === "serpent") {
    for (let i = 10; i >= 0; i--) {
      const y = -i * 1.7,
        x =
          Math.sin(
            (moving ? (time * Math.PI) / 400 : (time * Math.PI * 3) / 1600) +
              i * 0.7,
          ) *
          i *
          0.45;
      ball(x, y, 3 + i * 0.25, Math.max(1, 4 - i * 0.25), 2.8, 3, color);
      ball(x - 1, y, 5 + i * 0.25, 0.7, 0.7, 0.5, gold);
    }
    ball(0, 3, 12, 4, 4, 5, color);
    face(0, 6, 14, 2, gold);
    line(
      [
        [0, 6, 10],
        [0, 9, 9],
        [1, 11, 10],
      ],
      "#e7808d",
      0.7,
    );
  } else if (family === "gel" || family === "spirit" || family === "eye") {
    const jelly = kind === "jelly",
      eye = kind === "eye",
      spirit = kind === "wisp";
    const z = (jelly ? 16 : eye ? 12 : spirit ? 13 : 7) + bob;
    if (jelly || spirit)
      for (let i = 0; i < 5; i++) {
        const x = (i - 2) * 2.5;
        line(
          [
            [x, -1, z - 3],
            [x + Math.sin((time * Math.PI) / 400 + i) * 2, 0, 4],
            [x + Math.sin((time * Math.PI) / 400 + i + 1) * 2, 1, 2],
          ],
          color,
          1,
        );
      }
    ball(
      0,
      0,
      z,
      eye ? 10 : spirit ? 5 : 10,
      jelly ? 7 : 8,
      jelly ? 7 : spirit ? 6 : 7,
      color,
    );
    if (eye) {
      ball(0, 6, z, 7, 2, blink ? 1 : 6, light);
      if (!blink) {
        ball(0, 8, z, 3, 1, 4, color);
        ball(0, 9, z, 1, 1, 2, dark);
      }
    } else face(0, 6, z, 3, light, blink);
    ball(-3, 1, z + 4, 2, 2, 1, light);
    if (!a.view.front)
      line(
        [
          [-3, -5, z],
          [0, -7, z + 2],
          [3, -5, z],
        ],
        dark,
        0.7,
      );
  } else if (family === "book") {
    for (const side of [-1, 1]) {
      const page = [
        [0, 0, 8 + bob],
        [side * 12, -2, 10 + bob],
        [side * 11, -2, 23 + bob],
        [0, 0, 21 + bob],
      ];
      plane(
        page.map(([x, y, z]) => [x, y - 1, z]),
        color,
      );
      plane(page, light, 0.1);
      line([...page, page[0]], gold, 0.8, 0.2);
      for (let row = 0; row < 4; row++)
        line(
          [
            [side * 2, 0.2, 12 + row * 2 + bob],
            [side * 8, -1.2, 13 + row * 2 + bob],
          ],
          dark,
          0.7,
          0.3,
        );
      line(
        [
          [side * 11, -1.9, 11 + bob],
          [side * 11, -1.9, 21 + bob],
        ],
        "#aaa88d",
        0.7,
        0.4,
      );
    }
    line(
      [
        [0, -1, 7 + bob],
        [0, -1, 23 + bob],
      ],
      gold,
      2,
    );
    face(0, 1, 14 + bob, 3, gold);
  } else if (family === "flask") {
    ball(0, 0, 9 + bob, 7, 6, 7, "#accbd2");
    ball(0, 0, 7 + bob, 5, 5, 4, color);
    ball(0, 0, 18 + bob, 3, 3, 5, "#9cb7c5");
    ball(0, 0, 23 + bob, 4, 3, 1.5, gold);
    for (let i = 0; i < 3; i++)
      ball(
        Math.sin(i + (time * Math.PI) / 1600) * 2,
        1,
        6 + ((time * 0.005 + i * 3) % 8),
        0.7,
        0.7,
        0.7,
        light,
      );
    face(0, 5, 11 + bob, 2, gold);
  } else if (family === "crystal") {
    if (kind === "prism") {
      const front = [
          [-8, 3, 3],
          [8, 3, 3],
          [0, 3, 25],
        ],
        back = front.map(([x, , z]) => [x, -3, z]);
      plane(back, "#397b8b");
      plane([back[0], back[2], front[2], front[0]], "#a3dbc9");
      plane([back[1], back[2], front[2], front[1]], color);
      plane(front, "#5aa9a8");
      line([...front, front[0]], light, 0.7, 0.2);
      for (let i = 0; i < 4; i++)
        line(
          [
            [3, 4, 12],
            [10 + i, 6, 10 + i * 2],
          ],
          ["#e59b8c", gold, "#95ce9e", "#8dbbd7"][i],
          0.6,
          0.3,
        );
    } else
      for (let i = 0; i < 5; i++) {
        const angle = i * 2.4,
          x = Math.cos(angle) * 5,
          y = Math.sin(angle) * 4,
          height = i === 0 ? 25 : 14 + i;
        const tip = [x, y, height],
          left = [x - 3, y, 2],
          right = [x + 3, y, 3],
          ridge = [x, y + 2, 4];
        plane([left, tip, ridge], i % 2 ? "#8dc4c5" : color);
        plane([ridge, tip, right], "#387981");
        line([left, tip, right], light, 0.7, 0.2);
        line([ridge, tip], gold, 0.6, 0.2);
      }
    face(0, 4, 12, 2, gold);
  } else if (family === "orbital") {
    if (kind === "node") {
      const top = 21 + bob,
        bottom = 7 + bob;
      plane(
        [
          [-4, -4, bottom],
          [-4, -4, top],
          [4, -4, top],
          [4, -4, bottom],
        ],
        "#315c77",
      );
      plane(
        [
          [-4, 4, bottom],
          [-4, 4, top],
          [4, 4, top],
          [4, 4, bottom],
        ],
        color,
      );
      plane(
        [
          [-4, -4, top],
          [-4, 4, top],
          [4, 4, top],
          [4, -4, top],
        ],
        "#aacdb8",
      );
      // Quatro paredes fecham o núcleo: no perfil não sobra só a tampa.
      for (const side of [-1, 1]) {
        plane(
          [
            [side * 4, -4, bottom],
            [side * 4, 4, bottom],
            [side * 4, 4, top],
            [side * 4, -4, top],
          ],
          side < 0 ? "#76a6a8" : "#3b7187",
        );
      }
      for (const side of [-1, 1])
        for (const y of [-6, 6]) {
          line(
            [
              [side * 3, 0, 14 + bob],
              [side * 10, y, 14 + bob],
            ],
            gold,
            0.8,
          );
          ball(side * 10, y, 14 + bob, 2, 2, 2, color);
          ball(side * 10, y + 1, 15 + bob, 0.6, 0.6, 0.6, light);
        }
      line(
        [
          [0, -4, 9 + bob],
          [0, -4, 19 + bob],
        ],
        gold,
        0.7,
      );
    } else {
      ball(0, 0, 13 + bob, 4, 4, 4, color);
      for (let orbit = 0; orbit < 3; orbit++) {
        const pts = [];
        for (let i = 0; i <= 20; i++) {
          const theta = (i * Math.PI) / 10;
          pts.push([
            Math.cos(theta) * 11,
            Math.sin(theta) * 8,
            13 + Math.sin(theta + orbit * 2) * 6 + bob,
          ]);
        }
        line(pts, orbit === 0 ? gold : color, 0.7);
        const angle = (time * Math.PI) / 1600 + orbit * 2;
        ball(
          Math.cos(angle) * 11,
          Math.sin(angle) * 8,
          13 + Math.sin(angle + orbit * 2) * 6 + bob,
          1.5,
          1.5,
          1.5,
          light,
        );
      }
    }
    face(0, 3, 14 + bob, 1.5, gold);
  } else {
    if (kind === "gear") {
      for (let i = 0; i < 10; i++) {
        const theta = (i * Math.PI) / 5 + (time * Math.PI) / 4000;
        ball(Math.cos(theta) * 9, 0, 14 + Math.sin(theta) * 9, 2, 2, 2, color);
      }
      ball(0, 0, 14, 7, 3, 7, dark);
      ball(0, 1, 14, 3, 2, 3, gold);
    } else if (kind === "note") {
      ball(-4, 0, 5 + bob, 4, 3, 2, color);
      ball(5, 0, 8 + bob, 4, 3, 2, color);
      line(
        [
          [-2, 0, 5 + bob],
          [-2, 0, 24 + bob],
          [7, 0, 26 + bob],
          [7, 0, 8 + bob],
        ],
        color,
        2,
      );
    } else if (kind === "vector") {
      line(
        [
          [0, 0, 3 + bob],
          [0, 0, 25 + bob],
          [-5, 0, 19 + bob],
          [0, 0, 25 + bob],
          [5, 0, 19 + bob],
        ],
        color,
        3,
      );
      line(
        [
          [0, -2, 5 + bob],
          [0, -2, 22 + bob],
        ],
        gold,
        0.7,
      );
    } else {
      line(
        [
          [-6, 0, 5 + bob],
          [-6, 0, 23 + bob],
          [5, 0, 23 + bob],
          [5, 0, 15 + bob],
          [-3, 0, 15 + bob],
          [6, 0, 5 + bob],
        ],
        color,
        3,
      );
      ball(0, 0, 14 + bob, 2, 2, 2, gold);
    }
    face(0, 2, 12 + bob, 2, light);
  }
  a.flush();
}

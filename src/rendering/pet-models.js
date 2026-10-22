import { volumePainter, gait } from "./actor-volume.js";

export function drawPetModel(g, kind, colors, t, moving, dir) {
  const a = volumePainter(g, dir),
    { ball, line, face } = a,
    walk = gait(t, moving);
  const z = walk.breath + walk.lift;
  const blink = !moving && t % 3200 < 120;
  if (kind === "wisp" || kind === "shade") {
    const float = Math.sin((t * Math.PI) / (moving ? 400 : 800)) * 1.5,
      width =
        kind === "shade"
          ? 5.5 + Math.sin((t * Math.PI) / (moving ? 400 : 800))
          : 4;
    ball(0, 0, 8 + float, width, 4, kind === "shade" ? 7 : 4, colors.body);
    for (let i = 0; i < 4; i++) {
      const x = (i - 1.5) * 2;
      line(
        [
          [x, 0, 6 + float],
          [x + Math.sin((t * Math.PI) / 400 + i), -2, 2],
          [x + Math.sin((t * Math.PI) / 400 + i + 1), -4, 1],
        ],
        colors.light,
        1,
      );
    }
    face(0, 3, 9 + float, 1.5, colors.eye, blink);
    if (kind === "wisp") {
      const p = a.view.project(0, 0, 8 + float),
        brilho = 1 + Math.sin((t * Math.PI) / (moving ? 400 : 800)) * 0.15;
      g.globalAlpha = 0.18;
      g.fillStyle = colors.light;
      g.beginPath();
      g.arc(p.x, p.y, 7 * brilho, 0, Math.PI * 2);
      g.fill();
      g.globalAlpha = 1;
      ball(0, 2, 10 + float, 1, 1, 1, colors.eye);
    }
  } else if (kind === "cat") {
    const cauda = Math.sin((t * Math.PI) / 400) * 1.6;
    line(
      [
        [0, -5, 5 + z],
        [cauda, -9, 7 + z],
        [cauda + 1, -10, 11 + z],
      ],
      colors.body,
      2,
    );
    for (const side of [-1, 1])
      for (const front of [-1, 1]) {
        const stride = walk.step * side * front * 1.6;
        ball(
          side * 2.8,
          front * 3 + stride,
          1 + Math.max(0, stride) * 0.5,
          1.2,
          1.5,
          1.5,
          colors.body,
        );
        line(
          [
            [side * 2.8, front * 3, 4 + z],
            [side * 2.8, front * 3 + stride, 1],
          ],
          colors.body,
          1.5,
        );
      }
    ball(0, -1, 5 + z, 4, 6, 3.5, colors.body);
    ball(0, 4, 9 + z, 4, 3.5, 3.5, colors.body);
    for (const side of [-1, 1]) {
      line(
        [
          [side * 2.5, 3, 11 + z],
          [side * 3, 3, 14 + z],
          [side, 4, 11 + z],
        ],
        colors.body,
        2,
      );
      line(
        [
          [side * 3, 5, 8 + z],
          [side * 6, 5, 8 + z],
        ],
        colors.light,
        0.5,
      );
    }
    face(0, 6.5, 10 + z, 1.7, colors.eye, blink);
    if (a.view.front) ball(0, 7, 8.5 + z, 0.7, 0.6, 0.5, "#d992a3");
    for (let i = 0; i < 3; i++)
      line(
        [
          [-3, -3 + i * 2, 7 + z],
          [-1, -3 + i * 2, 8 + z],
        ],
        colors.light,
        0.6,
      );
  } else if (kind === "frog") {
    for (const side of [-1, 1]) {
      const stride = walk.step * side * 2;
      ball(side * 5, -2, 2 + z, 2.5, 3, 2, colors.body);
      line(
        [
          [side * 5, -2, 2 + z],
          [side * 6, 2 + stride, 1],
        ],
        colors.light,
        1.5,
      );
      ball(side * 3, 4 - stride, 1, 1.5, 2, 1, colors.body);
    }
    ball(0, 0, 4 + z, 6, 5, 3.5, colors.body);
    ball(0, 3, 6 + z, 5, 3, 3, colors.light);
    for (const side of [-1, 1])
      ball(side * 3, 4, 9 + z, 1.7, 1.5, 1.8, colors.body);
    face(0, 5, 9 + z, 3, colors.eye, blink);
    if (a.view.front)
      ball(
        0,
        5,
        3 + z,
        2 + (moving ? 0 : Math.sin((t * Math.PI) / 1600)) * 0.7,
        1,
        1.5,
        colors.light,
      );
    for (const side of [-1, 1])
      ball(side * 3, -1, 7 + z, 1, 1, 0.5, colors.light);
  } else if (kind === "cricket") {
    for (const side of [-1, 1])
      for (let i = 0; i < 3; i++) {
        const stride = moving
          ? walk.step * side * (i % 2 ? -1 : 1)
          : Math.sin((t * Math.PI) / 400 + i) * 0.5;
        line(
          [
            [side * 2, i * 2 - 2, 4],
            [side * (i === 0 ? 6 : 4), i * 2 - 3, 6],
            [side * 5, i * 2 + stride, 0],
          ],
          colors.body,
          1,
        );
      }
    ball(0, -1, 4 + z, 3, 5, 2.5, colors.body);
    ball(0, 4, 7 + z, 2.5, 2, 2, colors.light);
    for (const side of [-1, 1])
      line(
        [
          [side, 5, 8 + z],
          [side * 2, 7, 11 + z],
          [side * 3, 9, 12 + z],
        ],
        colors.body,
        0.7,
      );
    face(0, 5.5, 7 + z, 1.5, colors.eye, blink);
    line(
      [
        [0, -5, 6 + z],
        [0, 2, 6 + z],
      ],
      colors.light,
      0.7,
    );
  } else {
    const owl = kind === "owl",
      turn = moving ? 0 : Math.round(Math.sin((t * Math.PI) / 1600) * 2);
    for (const side of [-1, 1]) {
      const stride = walk.step * side;
      ball(side * 2, stride, 1, 1, 2, 1, "#dca866");
      const wing = moving
        ? Math.sin((t * Math.PI) / 200) * 3
        : Math.sin((t * Math.PI) / 1600) * 0.3;
      ball(side * 5, 0, 7 + wing + z, 2, 4, 3, colors.body);
      if (!owl) ball(side * 5, 1, 7 + wing + z, 1, 3, 1, "#488aaa");
    }
    line(
      [
        [0, -2, 5 + z],
        [0, -7, 2 + z],
      ],
      owl ? colors.body : "#376f8e",
      owl ? 2 : 3,
    );
    ball(0, 0, 7 + z, 4.5, 3.5, 5, colors.body);
    ball(0, 1, 7 + z, 3, 3, 3.5, colors.light);
    ball(turn * 0.4, 2, 12 + z, owl ? 4.5 : 3.5, 3, 3.5, colors.body);
    if (owl) {
      for (const side of [-1, 1]) {
        ball(side * 2 + turn * 0.4, 4, 12 + z, 1.8, 1, 2, colors.light);
        line(
          [
            [side * 3, 2, 14 + z],
            [side * 4, 2, 16 + z],
          ],
          colors.body,
          1.5,
        );
      }
    } else ball(turn * 0.4 - 1, 2, 15 + z, 2, 2, 1.5, "#d96a56");
    face(turn * 0.4, 4.8, 12 + z, owl ? 2 : 1.5, colors.eye, blink);
    if (a.view.front) ball(turn * 0.4, 6, 10 + z, 1, 2, 1, "#e8b04a");
    for (let row = 0; row < 3; row++)
      for (const side of [-1, 1])
        ball(
          side * (row % 2 ? 1 : 2),
          1,
          5 + row * 2 + z,
          0.5,
          3,
          0.5,
          colors.body,
        );
  }
  a.flush();
}

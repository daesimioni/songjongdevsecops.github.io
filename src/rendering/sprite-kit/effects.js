import { directionVector } from "../../core/movement.js";
import { EFFECT_ELEMENTS } from "../../content/sprite-kit/effects.js";
function line(g, points, color, width = 1) {
  g.strokeStyle = color;
  g.lineWidth = width;
  g.beginPath();
  points.forEach(([x, y], i) => (i ? g.lineTo(x, y) : g.moveTo(x, y)));
  g.stroke();
}
function diamond(g, x, y, size, color) {
  g.fillStyle = color;
  g.beginPath();
  g.moveTo(x, y - size);
  g.lineTo(x + size * 0.6, y);
  g.lineTo(x, y + size);
  g.lineTo(x - size * 0.6, y);
  g.closePath();
  g.fill();
}
function particle(g, x, y, size, palette, phase = 0) {
  const { color, light, dark, particle: kind } = palette;
  g.fillStyle = color;
  if (kind === "flame") {
    diamond(g, x, y - size * 0.4, size, color);
    diamond(g, x + 0.5, y, size * 0.55, light);
    g.fillStyle = dark;
    g.fillRect(x - size * 0.3, y + size * 0.5, size * 0.6, 1);
  } else if (kind === "shard") {
    diamond(g, x, y, size, color);
    line(
      g,
      [
        [x, y - size],
        [x, y + size],
      ],
      light,
      0.7,
    );
  } else if (kind === "skull") {
    g.fillRect(x - size * 0.6, y - size, size * 1.2, size);
    g.fillRect(x - size * 0.3, y, size * 0.6, size * 0.4);
    g.fillStyle = dark;
    g.fillRect(x - size * 0.4, y - size * 0.6, 1, 1);
    g.fillRect(x + size * 0.2, y - size * 0.6, 1, 1);
  } else if (kind === "spark") {
    line(
      g,
      [
        [x - 2, y - size],
        [x + 1, y - 1],
        [x - 1, y + 1],
        [x + 2, y + size],
      ],
      color,
      2,
    );
    line(
      g,
      [
        [x - 1, y - size],
        [x + 1, y],
        [x, y + size],
      ],
      light,
      0.5,
    );
  } else if (kind === "rock") {
    g.fillRect(x - size * 0.7, y - size * 0.5, size * 1.4, size);
    g.fillStyle = light;
    g.fillRect(x - size * 0.5, y - size * 0.4, size * 0.7, 1);
  } else if (kind === "star") {
    line(
      g,
      [
        [x - size, y],
        [x + size, y],
      ],
      light,
      1,
    );
    line(
      g,
      [
        [x, y - size],
        [x, y + size],
      ],
      color,
      2,
    );
    diamond(g, x, y, size * 0.4, light);
  } else if (kind === "slash") {
    line(
      g,
      [
        [x - size, y + size],
        [x, y - 1],
        [x + size, y - size],
      ],
      color,
      2,
    );
    line(
      g,
      [
        [x, y],
        [x + size, y - size],
      ],
      light,
      0.7,
    );
  } else if (kind === "rune") {
    diamond(g, x, y, size, color);
    g.fillStyle = dark;
    g.fillRect(x - 1, y - 1, 2, 2);
  } else if (kind === "curl") {
    line(
      g,
      [
        [x - size, y + 1],
        [x, y - size * 0.4],
        [x + size, y],
        [x + size * 0.5, y + 2],
      ],
      color,
      1,
    );
  } else {
    g.beginPath();
    g.ellipse(x, y, size * 0.7, size, 0, 0, Math.PI * 2);
    g.fill();
    g.fillStyle = light;
    g.fillRect(x - size * 0.3, y - size * 0.5, 1, 1);
    if (kind === "drop") diamond(g, x, y - size * 0.5, size * 0.6, color);
  }
  if (phase % 3 === 0) {
    g.fillStyle = light;
    g.fillRect(x + size + 1, y - 1, 0.7, 0.7);
  }
}
export function paintKitEffect(g, a, { direction = 0, frame = 0 } = {}) {
  const p = EFFECT_ELEMENTS[a.element],
    f = directionVector(direction),
    right = { x: f.y, y: -f.x },
    t = frame / 7,
    phase = (frame * Math.PI) / 4;
  const point = (along, across = 0, height = 0) => [
    f.x * along + right.x * across,
    f.y * along + right.y * across - height,
  ];
  const dot = (along, across, height, size, i = 0) =>
    particle(g, ...point(along, across, height), size, p, frame + i);
  const ring = (r, width = 1, color = p.color) => {
    g.strokeStyle = color;
    g.lineWidth = width;
    g.beginPath();
    g.ellipse(0, 0, r, r, 0, 0, Math.PI * 2);
    g.stroke();
  };
  if (a.form === "projetil") {
    for (let i = 5; i >= 0; i--)
      dot(
        8 + t * 34 - i * 3,
        Math.sin(phase + i) * 1.5,
        8,
        Math.max(1, 5 - i * 0.7),
        i,
      );
  } else if (a.form === "raio") {
    const points = Array.from({ length: 13 }, (_, i) =>
      point(i * 4, i === 0 || i === 12 ? 0 : Math.sin(i * 3 + phase) * 2, 7),
    );
    line(g, points, p.dark, 5);
    line(g, points, p.color, 3);
    line(g, points, p.light, 1);
    for (let i = 0; i < 6; i++) dot(i * 8, Math.sin(i + phase) * 5, 7, 2, i);
  } else if (a.form === "cone") {
    for (let row = 0; row < 5; row++)
      for (let col = -row; col <= row; col++)
        dot(
          5 + row * 8,
          col * 3.5,
          4 + Math.sin(phase + row) * 2,
          2 + ((frame + col + row + 16) % 3),
          row + col,
        );
  } else if (a.form === "corte") {
    const points = Array.from({ length: 13 }, (_, i) => {
      const angle = -1.1 + (i / 12) * 2.2;
      return point(
        Math.cos(angle) * 22,
        Math.sin(angle) * 22,
        8 + Math.sin(phase) * 2,
      );
    });
    line(g, points, p.dark, 5);
    line(g, points, p.color, 3);
    line(g, points.slice(2, 10), p.light, 1);
    for (let i = 0; i < 3; i++) dot(15 + i * 4, (t - 0.5) * 20, 8, 2, i);
  } else if (a.form === "coluna") {
    ring(12, 2, p.dark);
    for (let i = 0; i < 10; i++)
      dot(
        Math.sin(i + phase) * 3,
        Math.cos(i * 2 + phase) * 4,
        i * 5,
        4 + ((i + frame) % 2),
        i,
      );
  } else if (a.form === "rastro") {
    for (let i = 0; i < 12; i++)
      dot(i * 4, Math.sin(i + phase) * 3, 1, 1 + ((i + frame) % 3), i);
  } else if (a.form === "aviso") {
    ring(24, 1, p.dark);
    ring(22, 0.7, p.light);
    for (let i = 0; i < 8; i++) {
      const angle = (i * Math.PI) / 4;
      particle(
        g,
        Math.cos(angle) * 20,
        Math.sin(angle) * 13,
        1.5,
        p,
        i + frame,
      );
    }
    line(
      g,
      [
        [-3, -3],
        [3, 3],
      ],
      p.color,
      1,
    );
    line(
      g,
      [
        [-3, 3],
        [3, -3],
      ],
      p.color,
      1,
    );
  } else if (a.form === "campo") {
    ring(24, 0.6, p.dark);
    for (let i = 0; i < 20; i++) {
      const angle = i * 2.4,
        r = 5 + ((i * 7) % 19);
      particle(
        g,
        Math.cos(angle) * r,
        Math.sin(angle) * r * 0.65 - Math.sin(phase + i) * 2,
        2 + (i % 2),
        p,
        i + frame,
      );
    }
  } else if (a.form === "anel") {
    const radius = 5 + t * 19;
    ring(radius, 2);
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6;
      particle(
        g,
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.65,
        2,
        p,
        i + frame,
      );
    }
  } else if (a.form === "erupcao") {
    ring(20, 1, p.dark);
    for (let i = 0; i < 7; i++) {
      const x = (i - 3) * 5,
        h = 5 + Math.sin((i + frame) * 0.7) ** 2 * 20;
      line(
        g,
        [
          [x, 3],
          [x, 3 - h],
        ],
        p.dark,
        4,
      );
      particle(g, x, 3 - h, 4, p, i + frame);
    }
  } else {
    const radius =
      (a.form === "explosao" ? 4 : 2) + t * (a.form === "explosao" ? 23 : 13);
    ring(radius, 0.7, p.dark);
    for (let i = 0; i < 12; i++) {
      const angle = (i * Math.PI) / 6 + phase * 0.08;
      particle(
        g,
        Math.cos(angle) * radius,
        Math.sin(angle) * radius * 0.65 - 5,
        Math.max(1, 5 - t * 3),
        p,
        i + frame,
      );
    }
    particle(g, 0, -7, Math.max(1, 8 - t * 6), p, frame);
  }
}
export function paintKitWeather(g, a, { frame = 0 } = {}) {
  const t = frame / 16,
    kind = a.phenomenon;
  const ellipse = (x, y, rx, ry, color) => {
    g.fillStyle = color;
    g.beginPath();
    g.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
    g.fill();
  };
  if (["eclipse", "sun", "rainbow", "aurora", "cloud", "fog"].includes(kind)) {
    if (kind === "eclipse") {
      ellipse(0, -40, 24, 24, "#e0bf78");
      ellipse(5 + Math.sin(t * Math.PI * 2) * 10, -43, 23, 23, "#243040");
      for (let i = 0; i < 8; i++) {
        const angle = (i * Math.PI) / 4;
        line(
          g,
          [
            [Math.cos(angle) * 26, -40 + Math.sin(angle) * 26],
            [Math.cos(angle) * 30, -40 + Math.sin(angle) * 30],
          ],
          "#f4dca1",
          1,
        );
      }
    }
    if (kind === "sun") {
      ellipse(-28, -66, 13, 13, "#ecd296");
      for (let i = 0; i < 7; i++)
        line(
          g,
          [
            [-22 + i * 4, -49],
            [-4 + i * 8, 18],
          ],
          i % 2 ? "#afac86" : "#c7bd8d",
          1,
        );
    }
    if (kind === "rainbow") {
      for (const [i, c] of [
        "#b27473",
        "#cda67c",
        "#d0c78c",
        "#85a58d",
        "#719da9",
        "#8b83a9",
      ].entries()) {
        g.beginPath();
        g.strokeStyle = c;
        g.lineWidth = 2;
        g.arc(0, 0, 44 - i * 2, Math.PI, Math.PI * 2);
        g.stroke();
      }
    }
    if (kind === "aurora")
      for (let i = 0; i < 42; i++) {
        const x = -60 + i * 3,
          y = -54 + Math.sin(i * 0.2 + t * Math.PI * 2) * 12;
        line(
          g,
          [
            [x, y],
            [x, y + 13 + (i % 5) * 3],
          ],
          i % 3 ? "#73a49c" : "#9e8eac",
          2,
        );
      }
    if (kind === "cloud" || kind === "fog")
      for (let i = 0; i < 6; i++)
        ellipse(
          -40 + i * 16 + Math.sin(t * Math.PI * 2) * 2,
          kind === "fog" ? -8 + (i % 2) * 7 : -65 + (i % 2) * 5,
          17,
          kind === "fog" ? 5 : 9,
          i % 2 ? "#9aaeb3" : "#b2c0be",
        );
    return;
  }
  if (kind === "lightning" || kind === "storm") {
    for (let j = 0; j < 2; j++) {
      const x = -24 + j * 45;
      const points = [
        [x, -88],
        [x - 5, -65],
        [x + 4, -66],
        [x - 6 + Math.sin(t * Math.PI * 2) * 3, -30],
      ];
      line(g, points, "#697b9b", 4);
      line(g, points, "#e4e3bd", 1);
    }
    if (kind === "lightning") return;
  }
  for (let i = 0; i < 30; i++) {
    const x = -59 + ((i * 37 + (frame * 118) / 16) % 118),
      y = -89 + ((i * 23 + (frame * 116) / 16) % 116);
    if (kind === "rain" || kind === "storm")
      line(
        g,
        [
          [x, y],
          [x - 2, y + 6],
        ],
        "#8bb8c8",
        0.7,
      );
    else if (kind === "snow" || kind === "ash") {
      g.fillStyle = kind === "snow" ? "#d6e6dd" : "#939b9b";
      g.fillRect(
        x + Math.sin(i + t * Math.PI * 2) * 2,
        y,
        kind === "snow" ? 1.5 : 1,
        1,
      );
    } else if (kind === "hail") {
      diamond(g, x, y, 1.5, "#b9d7d9");
    } else if (kind === "wind") {
      line(
        g,
        [
          [x - 2, y],
          [x + 5, y - 1],
          [x + 8, y],
        ],
        "#aac1b2",
        0.6,
      );
    } else if (["leaves", "petals", "dust"].includes(kind)) {
      diamond(
        g,
        x,
        y,
        kind === "dust" ? 1 : 2,
        kind === "leaves"
          ? "#aaa172"
          : kind === "petals"
            ? "#cda0b2"
            : "#bda77e",
      );
    } else if (kind === "meteor") {
      line(
        g,
        [
          [x - 6, y - 8],
          [x, y],
        ],
        "#a78984",
        1,
      );
      diamond(g, x, y, 2, "#ead29b");
    } else if (kind === "fireflies") {
      g.fillStyle = i % 3 === frame % 3 ? "#f0dda0" : "#8fa178";
      g.fillRect(x, y, 1.5, 1.5);
    }
  }
}

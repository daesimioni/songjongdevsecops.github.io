import { directionVector } from "../core/movement.js";

// Espaço do personagem: x = direita, y = frente, z = altura. A câmera nunca
// gira: rumo altera os volumes, não achata uma fotografia frontal.
export function actorView(dir) {
  const f = directionVector(dir);
  return {
    forward: f,
    right: { x: f.y, y: -f.x },
    project(x, y, z = 0) {
      return { x: x * f.y + y * f.x, y: (-x * f.x + y * f.y) * 0.52 - z };
    },
    depth(x, y) {
      return -x * f.x + y * f.y;
    },
    front: f.y > -0.1,
    profile: Math.abs(f.x) > 0.9,
  };
}
export function gait(time, moving = true) {
  const phase = (time * Math.PI) / 200;
  return {
    step: moving ? Math.sin(phase) : 0,
    lift: moving ? Math.abs(Math.sin(phase)) * 0.8 : 0,
    breath: moving ? 0 : Math.sin((time * Math.PI) / 1600) * 0.35,
    phase,
  };
}
// Elipsoides rasterizados, sem antialias: luz fixa no mundo e três patamares
// de material. A fila é ordenada pelo plano do chão, inclusive cauda e patas.
export function volumePainter(g, dir) {
  const view = actorView(dir),
    parts = [];
  function ball(x, y, z, rx, ry, rz, color, detail = null) {
    parts.push({
      depth: view.depth(x, y),
      paint() {
        const c = view.project(x, y, z);
        const width = Math.hypot(rx * view.right.x, ry * view.forward.x);
        const height = Math.hypot(
          Math.hypot(rx * view.right.y, ry * view.forward.y) * 0.52,
          rz,
        );
        const rows = [];
        for (let dy = -height; dy < height; dy += 0.5) {
          const span = Math.sqrt(Math.max(0, 1 - (dy / height) ** 2)) * width;
          const l = Math.round((c.x - span) * 2) / 2,
            r = Math.round((c.x + span) * 2) / 2;
          if (r > l)
            rows.push({ dy, l, r, span, y: Math.round((c.y + dy) * 2) / 2 });
        }
        g.fillStyle = color;
        for (const r of rows) g.fillRect(r.l, r.y, r.r - r.l, 0.5);
        g.fillStyle = "rgba(10,19,34,.32)";
        for (const r of rows) {
          const width = Math.max(0.5, r.span * 0.33);
          g.fillRect(r.r - width, r.y, width, 0.5);
        }
        g.fillStyle = "rgba(255,236,197,.25)";
        for (const r of rows)
          if (r.dy < -height * 0.15)
            g.fillRect(r.l + 0.5, r.y, Math.max(0.5, r.span * 0.35), 0.5);
        if (detail) detail(c, view);
      },
    });
  }
  function line(points, color, width = 1, offset = 0) {
    const depth =
      points.reduce((n, p) => n + view.depth(p[0], p[1]), 0) / points.length;
    parts.push({
      depth: depth + offset,
      paint() {
        g.strokeStyle = color;
        g.lineWidth = width;
        g.beginPath();
        points.forEach((p, i) => {
          const q = view.project(...p);
          if (i) g.lineTo(q.x, q.y);
          else g.moveTo(q.x, q.y);
        });
        g.stroke();
      },
    });
  }
  function plane(points, color, offset = 0) {
    const depth =
      points.reduce((n, p) => n + view.depth(p[0], p[1]), 0) / points.length;
    parts.push({
      depth: depth + offset,
      paint() {
        g.fillStyle = color;
        g.beginPath();
        points.forEach((p, i) => {
          const q = view.project(...p);
          i ? g.lineTo(q.x, q.y) : g.moveTo(q.x, q.y);
        });
        g.closePath();
        g.fill();
      },
    });
  }
  function face(x, y, z, spacing, color, blink = false) {
    if (!view.front) return;
    for (const side of [-1, 1]) {
      // O olho distante desaparece no perfil e reaparece no três quartos.
      if (view.profile && side * view.forward.x < 0) continue;
      const p = view.project(x + side * spacing, y, z);
      parts.push({
        depth: view.depth(x + side * spacing, y) + 0.3,
        paint() {
          g.fillStyle = "#0c1526";
          g.fillRect(
            Math.round(p.x) - 1,
            Math.round(p.y) - 1,
            2,
            blink ? 1 : 2,
          );
          if (!blink) {
            g.fillStyle = color;
            g.fillRect(Math.round(p.x), Math.round(p.y) - 1, 1, 1);
          }
        },
      });
    }
  }
  return {
    view,
    ball,
    line,
    plane,
    face,
    flush() {
      parts.sort((a, b) => a.depth - b.depth);
      for (const p of parts) p.paint();
    },
  };
}

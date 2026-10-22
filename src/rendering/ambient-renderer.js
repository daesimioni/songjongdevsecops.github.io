import { criarAmbiente, ambienteDe } from "./ambient.js";
import { BIOMES } from "../content/identity.js";

export function createAmbientRenderer(ctx) {
  // ---- ambiente por ilha: estação, evento e partículas do lugar ----
  const relogioAmbiente = criarAmbiente({ semente: 20261021 });
  const kitsAmbiente = new Map();
  function kitDaArea(area) {
    if (!area) return null;
    if (!kitsAmbiente.has(area.id)) {
      kitsAmbiente.set(area.id, ambienteDe(area.id, BIOMES[area.id], area.links || []));
    }
    return kitsAmbiente.get(area.id);
  }
  function ruido(n) {
    const x = Math.sin(n * 127.1 + 311.7) * 43758.5453;
    return x - Math.floor(x);
  }
  // no máximo 8 partículas por elemento: o teto do desenho é 12
  function drawAmbient(area, time, camX, camY, viewW, viewH, cena = null) {
    const kit = kitDaArea(area);
    if (!kit) return;
    const ev = relogioAmbiente.tick(time);
    const id = ev.evento?.id || "";
    const intensidade = ev.intensidade || 0;
    const chuva = id === "chuva" ? intensidade : 0;
    const vento = id === "rajada" ? intensidade : 0;
    const neblina = id === "neblina" ? intensidade : 0;
    if (id === "silencio" && intensidade > 0.4) return;
    const cor = kit.cor || "#ffc857";
    const W = viewW + 80;
    const H = viewH + 80;
    ctx.save();
    ctx.globalAlpha = 1;
    for (const tipo of kit.elementos) {
      // chuva apaga o que é faísca, e neblina come metade do que sobe
      if (chuva > 0.25 && (tipo === "faisca" || tipo === "luzes")) continue;
      const folhagem = tipo === "folha" || tipo === "folha-escura" || tipo === "pagina";
      const n = tipo === "pendulo" || tipo === "forma" || tipo === "onda"
        ? 1
        : folhagem && relogioAmbiente.estacao === "outono" ? 12 : 7;
      for (let i = 0; i < n; i++) {
        const s = kit.semente + i * 37;
        const bx = camX + (ruido(s) * W) - 40;
        const by = camY + (ruido(s + 1) * H) - 40;
        const a = (0.35 + ruido(s + 2) * 0.4) * (1 - neblina * 0.5);
        ctx.fillStyle = cor;
        ctx.globalAlpha = a;
        if (tipo === "po-giz") {
          const y = camY + ((by - camY + time * 0.012) % H);
          ctx.fillRect(bx, y, 1, 1);
        } else if (tipo === "forma") {
          const f = (time / 2400 + ruido(s) * 0.2) % 1;
          const r = 3 + Math.min(f, 0.5) * 10;
          ctx.strokeStyle = cor;
          ctx.lineWidth = 1;
          ctx.beginPath();
          for (let k = 0; k < 3; k++) {
            const ang = (k / 3) * Math.PI * 2 - Math.PI / 2 + time * 0.0002;
            const px = bx + Math.cos(ang) * r;
            const py = by + Math.sin(ang) * r;
            if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.closePath();
          ctx.stroke();
        } else if (tipo === "pendulo") {
          const ang = Math.sin(time / 700) * 0.6;
          ctx.fillStyle = "rgba(220,210,240,0.5)";
          for (let k = 0; k < 6; k++) ctx.fillRect(bx + Math.sin(ang) * k * 2, by + k * 2, 1, 1);
          ctx.fillStyle = cor;
          ctx.fillRect(bx + Math.sin(ang) * 12 - 1, by + 12, 3, 3);
        } else if (tipo === "orbe") {
          const float = Math.sin(time / 900 + i) * 3;
          ctx.beginPath();
          ctx.arc(bx, by + float, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.globalAlpha = a * 0.25;
          ctx.beginPath();
          ctx.arc(bx, by + float, 6, 0, Math.PI * 2);
          ctx.fill();
        } else if (tipo === "bolha") {
          const y = camY + ((by - camY - time * 0.02) % H + H) % H;
          ctx.globalAlpha = a * 0.8;
          ctx.fillRect(bx, y, 2, 2);
        } else if (tipo === "fumaca") {
          const y = camY + ((by - camY - time * 0.008) % H + H) % H;
          ctx.globalAlpha = a * 0.35;
          ctx.fillRect(bx, y, 3, 1);
          ctx.fillRect(bx + 1, y - 2, 2, 1);
        } else if (tipo === "faisca") {
          const fase = (time / 2600 + ruido(s) * 3) % 1;
          if (fase > 0.08) continue;
          ctx.fillStyle = "#fff3d1";
          ctx.fillRect(bx, by, 1, 1);
          ctx.fillRect(bx - 1, by, 1, 1);
          ctx.fillRect(bx + 1, by, 1, 1);
          ctx.fillRect(bx, by - 1, 1, 1);
        } else if (tipo === "luzes") {
          const ligado = Math.floor(time / 350) % 4;
          ctx.globalAlpha = ligado === i % 4 ? a : a * 0.15;
          ctx.fillRect(bx, by, 2, 2);
        } else if (tipo === "folha") {
          const x = camX + ((bx - camX + time * 0.02 * (1 + vento)) % W);
          const y = by + Math.sin(time / 700 + i) * 6;
          ctx.globalAlpha = a * 0.85;
          ctx.fillRect(x, y, 2, 2);
        } else if (tipo === "letra") {
          const fase = (time / 4000 + ruido(s)) % 1;
          ctx.globalAlpha = a * (1 - fase);
          ctx.fillRect(bx, by, 1, 3);
          ctx.fillRect(bx - 1, by, 1, 1);
          ctx.fillRect(bx + 1, by, 1, 1);
        } else if (tipo === "nota") {
          const y = camY + ((by - camY - time * 0.018) % H + H) % H;
          ctx.fillRect(bx, y, 2, 1);
          ctx.fillRect(bx + 1, y - 4, 1, 5);
        } else if (tipo === "onda") {
          ctx.strokeStyle = cor;
          ctx.lineWidth = 1;
          ctx.beginPath();
          const x0 = camX + ((time * 0.06) % (viewW + 120)) - 60;
          for (let k = 0; k < 24; k += 3) {
            const px = x0 - k;
            const py = by + Math.sin(k * 0.4 + time * 0.003) * 4;
            if (k === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
          }
          ctx.stroke();
        } else if (tipo === "pulso") {
          const r = 2 + ((time / 2000 + ruido(s)) % 1) * 9;
          ctx.globalAlpha = a * 0.5;
          ctx.strokeStyle = cor;
          ctx.beginPath();
          ctx.arc(bx, by, r, 0, Math.PI * 2);
          ctx.stroke();
        } else if (tipo === "no") {
          const on = Math.floor(time / 1200 + i) % 5 === 0;
          ctx.globalAlpha = on ? a : a * 0.3;
          ctx.fillRect(bx, by, 2, 2);
          ctx.globalAlpha = a * 0.3;
          ctx.fillRect(bx - 3, by, 3, 1);
        } else if (tipo === "risco") {
          const fase = (time / 5200 + ruido(s)) % 1;
          if (fase > 0.5) continue;
          ctx.globalAlpha = a * (1 - fase * 2) * 0.7;
          ctx.fillRect(bx, by, 4, 1);
          ctx.fillRect(bx + 4, by + 1, 3, 1);
        } else if (tipo === "pagina") {
          const giro = Math.abs(Math.sin(time / 1200 + i));
          ctx.globalAlpha = a * 0.8;
          ctx.fillRect(bx, by, Math.max(1, Math.round(3 * giro)), 3);
        } else if (tipo === "gota") {
          const y = camY + ((by - camY + time * 0.05) % H);
          ctx.globalAlpha = a * 0.9;
          ctx.fillRect(bx, y, 1, 2);
        } else if (tipo === "verdete") {
          ctx.globalAlpha = a * (0.4 + Math.sin(time / 3000 + i) * 0.2);
          ctx.fillRect(bx, by, 2, 1);
        } else if (tipo === "reflexo") {
          const faixa = (time / 3000 + ruido(s)) % 1;
          if (faixa > 0.4) continue;
          ctx.globalAlpha = a * (0.5 - Math.abs(faixa - 0.2) * 2);
          ctx.fillRect(bx, by, 6, 1);
        } else if (tipo === "poeira") {
          const x = bx + Math.sin(time / 900 + i) * 4;
          const y = by + Math.cos(time / 700 + i) * 2;
          ctx.globalAlpha = a * 0.5;
          ctx.fillRect(x, y, 1, 1);
        } else if (tipo === "fiapo") {
          const x = camX + ((bx - camX + time * 0.03 * (1 + vento)) % W);
          ctx.globalAlpha = a * 0.7;
          ctx.fillRect(x, by + Math.sin(time / 500 + i) * 3, 2, 1);
        } else if (tipo === "folha-escura") {
          const y = camY + ((by - camY + time * 0.014) % H);
          ctx.globalAlpha = a * 0.8;
          ctx.fillRect(bx, y, 2, 1);
        }
      }
    }
    ctx.globalAlpha = 1;
    // clima: chuva cai na tela inteira, neblina lava a cor, revoada sobe.
    // Dentro de casa o teto segura a chuva e a neblina.
    if (chuva > 0.05 && !cena?.interior) {
      ctx.strokeStyle = `rgba(180,210,240,${0.18 * chuva})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < 40; i++) {
        const x = camX + ruido(i + 3) * viewW;
        const y = camY + ((ruido(i + 9) * viewH + time * 0.35) % viewH);
        ctx.moveTo(x, y);
        ctx.lineTo(x - 2, y + 6);
      }
      ctx.stroke();
    }
    if (neblina > 0.05 && !cena?.interior) {
      ctx.fillStyle = `rgba(190,200,220,${0.10 * neblina})`;
      ctx.fillRect(camX, camY, viewW, viewH);
    }
    ctx.restore();
  }

  return { drawAmbient, relogioAmbiente };
}

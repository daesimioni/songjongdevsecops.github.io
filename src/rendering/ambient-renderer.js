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
    // o relógio do clima anda no laço do jogo, não no desenho: no modo leve a
    // camada some, mas a chuva continua começando e terminando
    const evento = relogioAmbiente.eventoAtual?.evento || null;
    const id = evento?.id || "";
    const intensidade = evento ? relogioAmbiente.intensidade() : 0;
    const chuva = id === "chuva" || id === "tempestade" ? intensidade : 0;
    const vento = id === "rajada" ? intensidade : 0;
    const neblina = id === "neblina" ? intensidade : 0;
    // diagnóstico da sonda: prova qual evento a camada desenhou neste quadro
    relogioAmbiente.ultimoDesenho = { id, intensidade, temKit: !!kit, interior: !!cena?.interior };
    if (id === "silencio" && intensidade > 0.4) return;
    const cor = kit?.cor || "#ffc857";
    const W = viewW + 80;
    const H = viewH + 80;
    ctx.save();
    ctx.globalAlpha = 1;
    for (const tipo of kit?.elementos || []) {
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
          ctx.fillRect(bx,y,1,.5);ctx.globalAlpha=a*.3;ctx.fillRect(bx+1,y+1,.5,.5);
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
          ctx.fillRect(bx+Math.sin(ang)*12-1,by+12,3,3);
          ctx.fillStyle='#e1dbc0';ctx.fillRect(bx+Math.sin(ang)*12-.5,by+12.5,.5,.5);
        } else if (tipo === "orbe") {
          const float = Math.sin(time / 900 + i) * 3;
          ctx.beginPath();
          ctx.arc(bx, by + float, 3, 0, Math.PI * 2);
          ctx.fill();
          ctx.fillStyle='#d9e9cf';ctx.fillRect(bx-1,by+float-1.5,1,.5);ctx.fillStyle=cor;
          ctx.globalAlpha = a * 0.25;
          ctx.beginPath();
          ctx.arc(bx, by + float, 6, 0, Math.PI * 2);
          ctx.fill();
        } else if (tipo === "bolha") {
          const y = camY + ((by - camY - time * 0.02) % H + H) % H;
          ctx.globalAlpha = a * 0.8;
          // Bolha com borda e reflexo; o centro deixa ver o chão.
          ctx.fillRect(bx,y,2,.5);ctx.fillRect(bx-.5,y+.5,.5,1.5);
          ctx.fillRect(bx+2,y+.5,.5,1.5);ctx.fillRect(bx,y+2,2,.5);
          ctx.globalAlpha=a;ctx.fillStyle='#e1e8d2';ctx.fillRect(bx,y,.5,.5);
        } else if (tipo === "fumaca") {
          const y = camY + ((by - camY - time * 0.008) % H + H) % H;
          ctx.globalAlpha = a * 0.35;
          ctx.fillRect(bx-1,y,4,1);ctx.fillRect(bx,y-1,3,1);
          ctx.fillRect(bx+1,y-2,2,1);ctx.globalAlpha=a*.15;ctx.fillRect(bx-2,y+1,5,.5);
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
          ctx.fillRect(bx,by,2,2);ctx.fillStyle='#e4e9ce';ctx.fillRect(bx,by,.5,.5);ctx.fillStyle=cor;
        } else if (tipo === "folha") {
          const x = camX + ((bx - camX + time * 0.02 * (1 + vento)) % W);
          const y = by + Math.sin(time / 700 + i) * 6;
          ctx.globalAlpha = a * 0.85;
          const width=1+Math.abs(Math.sin(time/500+i));
          ctx.fillRect(x,y,width,1);ctx.fillRect(x+.5,y-1,width,.5);
          ctx.globalAlpha=a*.5;ctx.fillRect(x+.5,y+1,.5,1);
        } else if (tipo === "letra") {
          const fase = (time / 4000 + ruido(s)) % 1;
          ctx.globalAlpha = a * (1 - fase);
          ctx.fillRect(bx, by, 1, 3);
          ctx.fillRect(bx - 1, by, 1, 1);
          ctx.fillRect(bx + 1, by, 1, 1);
        } else if (tipo === "nota") {
          const y = camY + ((by - camY - time * 0.018) % H + H) % H;
          ctx.fillRect(bx,y,2,1);ctx.fillRect(bx+1,y-1,1,.5);
          ctx.globalAlpha=a*.5;ctx.fillRect(bx+.5,y+1,.5,1);
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
          ctx.fillRect(bx,by,2,2);ctx.fillStyle='#e4e9ce';ctx.fillRect(bx,by,.5,.5);ctx.fillStyle=cor;
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
          const width=Math.max(1,Math.round(3*giro));
          ctx.fillRect(bx,by,width,4);ctx.fillStyle='#293c51';
          ctx.fillRect(bx+.5,by+1,Math.max(.5,width-1),.5);ctx.fillRect(bx+.5,by+2,Math.max(.5,width-1.5),.5);
        } else if (tipo === "gota") {
          const y = camY + ((by - camY + time * 0.05) % H);
          ctx.globalAlpha = a * 0.9;
          ctx.fillRect(bx,y,.5,2);ctx.fillRect(bx-.5,y+2,1.5,.5);
          ctx.globalAlpha=a*.35;ctx.fillRect(bx,y-2,.5,1);
        } else if (tipo === "verdete") {
          ctx.globalAlpha = a * (0.4 + Math.sin(time / 3000 + i) * 0.2);
          ctx.fillRect(bx,by,1.5,.5);ctx.fillRect(bx+.5,by+.5,.5,.5);
        } else if (tipo === "reflexo") {
          const faixa = (time / 3000 + ruido(s)) % 1;
          if (faixa > 0.4) continue;
          ctx.globalAlpha = a * (0.5 - Math.abs(faixa - 0.2) * 2);
          ctx.fillRect(bx,by,6,.5);ctx.globalAlpha=a*.2;ctx.fillRect(bx+1,by+1,3,.5);
        } else if (tipo === "poeira") {
          const x = bx + Math.sin(time / 900 + i) * 4;
          const y = by + Math.cos(time / 700 + i) * 2;
          ctx.globalAlpha = a * 0.5;
          ctx.fillRect(x, y, 1, 1);
        } else if (tipo === "fiapo") {
          const x = camX + ((bx - camX + time * 0.03 * (1 + vento)) % W);
          ctx.globalAlpha = a * 0.7;
          const y=by+Math.sin(time/500+i)*3;
          ctx.fillRect(x,y,1,.5);ctx.fillRect(x+1,y+.5,1,.5);ctx.fillRect(x+2,y+1,1,.5);
        } else if (tipo === "folha-escura") {
          const y = camY + ((by - camY + time * 0.014) % H);
          ctx.globalAlpha = a * 0.8;
          ctx.fillRect(bx,y,2,1);ctx.fillRect(bx+1,y-1,1,.5);
          ctx.globalAlpha=a*.5;ctx.fillRect(bx+.5,y+1,.5,1);
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
    if (!cena?.interior) {
      // ---- estação: cada uma tem cor e partícula própria no céu ----
      const estacao = relogioAmbiente.estacao;
      const corEstacao = estacao === "primavera" ? "255,190,225"
        : estacao === "verao" ? "255,205,120"
        : estacao === "outono" ? "255,150,70" : "170,205,255";
      ctx.fillStyle = `rgba(${corEstacao},${estacao === "inverno" ? 0.07 : 0.05})`;
      ctx.fillRect(camX, camY, viewW, viewH);
      const quantas = estacao === "inverno" ? 42 : estacao === "primavera" ? 28 : 20;
      for (let i = 0; i < quantas; i++) {
        const s = i * 53 + 11;
        const x = camX + ((ruido(s) * viewW + time * (estacao === "outono" ? 0.02 : 0.012) * (1 + ruido(s + 3))) % viewW);
        const y = camY + ((ruido(s + 1) * viewH + time * (estacao === "inverno" ? 0.03 : 0.012)) % viewH);
        if (estacao === "inverno") {
          ctx.fillStyle = "rgba(240,247,255,0.92)";
          ctx.fillRect(x, y, 2, 2);
        } else if (estacao === "primavera") {
          ctx.fillStyle = "rgba(255,190,225,0.85)";
          ctx.fillRect(x, y + Math.sin(time / 700 + i) * 2, 2, 1);
        } else if (estacao === "verao") {
          ctx.fillStyle = "rgba(255,230,150,0.45)";
          ctx.fillRect(x, y, 1, 1);
        } else {
          ctx.fillStyle = "rgba(224,140,70,0.85)";
          ctx.fillRect(x, y + Math.sin(time / 600 + i) * 2, 2, 1);
        }
      }
    }
    // ---- eventos que tomam a tela inteira ----
    if (id === "tempestade" && intensidade > 0.05) {
      const fase = (time / 5200) % 1;
      const relampago = fase > 0.9 ? Math.sin(((fase - 0.9) / 0.1) * Math.PI) : 0;
      if (relampago > 0.02) {
        ctx.fillStyle = `rgba(235,245,255,${0.5 * relampago * intensidade})`;
        ctx.fillRect(camX, camY, viewW, viewH);
      }
      ctx.strokeStyle = `rgba(210,230,255,${0.45 * intensidade})`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < 70; i++) {
        const x = camX + ruido(i + 31) * viewW;
        const y = camY + ((ruido(i + 17) * viewH + time * 0.5) % viewH);
        ctx.moveTo(x, y);
        ctx.lineTo(x - 3, y + 9);
      }
      ctx.stroke();
    }
    if (id === "tornado" && intensidade > 0.03) {
      const cx = camX + viewW * (0.38 + 0.24 * ruido(Math.floor(time / 9000)));
      const base = camY + viewH * 0.94;
      const altura = viewH * 0.58 * intensidade;
      // funil: faixas que alargam para cima, com a boca girando devagar
      for (let k = 0; k < 26; k++) {
        const f = k / 26;
        const raio = (3 + f * 34) * intensidade;
        const y = base - f * altura;
        const x = cx + Math.sin(time / 140 + k * 0.8) * (raio * 0.4);
        ctx.fillStyle = `rgba(168,178,200,${0.26 + f * 0.24 * intensidade})`;
        ctx.fillRect(x - raio * 0.5, y, raio, 3);
      }
      // nuvem escura no topo do funil
      ctx.fillStyle = `rgba(24,30,46,${0.55 * intensidade})`;
      ctx.beginPath();
      ctx.ellipse(cx, base - altura - 6, 46 * intensidade, 12 * intensidade, 0, 0, Math.PI * 2);
      ctx.fill();
      // detritos girando em volta
      for (let i = 0; i < 34; i++) {
        const f = ruido(i + 3);
        const raio = (6 + f * 34) * intensidade;
        const ang = time / 110 + i;
        const x = cx + Math.cos(ang) * raio;
        const y = base - f * altura + Math.sin(ang) * 6;
        ctx.fillStyle = `rgba(238,226,198,${0.85 * intensidade})`;
        ctx.fillRect(x, y, 2.5, 2);
      }
      // poeira levantada no chão
      ctx.fillStyle = `rgba(196,178,150,${0.3 * intensidade})`;
      ctx.beginPath();
      ctx.ellipse(cx, base, 52 * intensidade, 10 * intensidade, 0, 0, Math.PI * 2);
      ctx.fill();
    }
    if (id === "eclipse" && intensidade > 0.02) {
      ctx.fillStyle = `rgba(2,4,12,${0.55 * intensidade})`;
      ctx.fillRect(camX, camY, viewW, viewH);
      const cx = camX + viewW * 0.5, cy = camY + viewH * 0.18;
      const raio = Math.min(viewW, viewH) * 0.1 * intensidade;
      const coroa = ctx.createRadialGradient(cx, cy, raio * 0.85, cx, cy, raio * 2.4);
      coroa.addColorStop(0, `rgba(255, 224, 150, ${0.75 * intensidade})`);
      coroa.addColorStop(0.35, `rgba(255, 200, 110, ${0.28 * intensidade})`);
      coroa.addColorStop(1, "rgba(255, 200, 110, 0)");
      ctx.fillStyle = coroa;
      ctx.beginPath();
      ctx.arc(cx, cy, raio * 2.4, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = "#05070f";
      ctx.beginPath();
      ctx.arc(cx, cy, raio, 0, Math.PI * 2);
      ctx.fill();
    }
    if (id === "neve" && intensidade > 0.03) {
      for (let i = 0; i < 120; i++) {
        const x = camX + ((ruido(i + 5) * viewW + time * 0.02 * (1 + ruido(i)) ) % viewW);
        const y = camY + ((ruido(i + 7) * viewH + time * 0.06) % viewH);
        ctx.fillStyle = `rgba(248,252,255,${0.9 * intensidade})`;
        ctx.fillRect(x, y, 2, 2);
      }
    }
    ctx.restore();
  }

  return { drawAmbient, relogioAmbiente };
}

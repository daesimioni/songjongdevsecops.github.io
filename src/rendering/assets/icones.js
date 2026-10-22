import { detailConcept } from "./concept-detail.js";
import { spritePose } from "../sprite-cache.js";
import { artTick } from "../art-style.js";
import { artTime } from "../art-style.js";
// Grupo ícones: os enfeites de conceito que já existiam (livro, frasco,
// terminal, compasso, guindaste, sino, gaivota...). O desenho é o mesmo de
// antes, agora morando na biblioteca de assets junto dos grupos ambientais.
// As poses usam o cache compartilhado, com material, acento e fase de cada peça.
import { TILE } from "../../core/runtime-config.js";
import { hexA } from "./nucleo.js";

  let lampSprite = null;
  function lampGlow() {
    if (lampSprite) return lampSprite;
    lampSprite = document.createElement("canvas");
    lampSprite.width = 36;
    lampSprite.height = 36;
    const g = lampSprite.getContext("2d");
    const grad = g.createRadialGradient(18, 18, 0, 18, 18, 18);
    grad.addColorStop(0, "rgba(255, 214, 128, 0.55)");
    grad.addColorStop(1, "rgba(255, 214, 128, 0)");
    g.fillStyle = grad;
    g.fillRect(0, 0, 36, 36);
    return lampSprite;
  }

function desenharIconeBase(g, d, time) {
    time = artTime(time);
    const px = d.x * TILE, py = d.y * TILE;
    // Reflexo de contato comum aos instrumentos de bancada, sem animar paredes.
    if(['bench','crate','terminal','rack','pillar'].includes(d.type)){
      g.fillStyle='rgba(5,12,25,.32)';g.beginPath();g.ellipse(px,py+9,7,2,0,0,Math.PI*2);g.fill();
    }
    if (d.type === "lamp") {
      g.fillStyle = "rgba(2, 6, 10, 0.4)";
      g.beginPath(); g.ellipse(px, py + 12, 6, 2.4, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#2b2438";
      g.fillRect(px - 1, py - 10, 2, 22);
      g.fillStyle = "#4a3f5f";
      g.fillRect(px - 3, py - 12, 6, 2);
      const glow = 0.78 + Math.sin(time * 0.003 + d.x) * 0.16;
      g.globalAlpha = glow;
      g.drawImage(lampGlow(), px - 18, py - 28);
      g.globalAlpha = 1;
      g.fillStyle = "#ffe3a1";
      g.fillRect(px - 1, py - 11, 2, 2);
    } else if (d.type === "sign") {
      g.fillStyle = "#2a2130";
      g.fillRect(px - 1, py - 6, 2, 16);
      g.fillStyle = "#1a1526";
      g.fillRect(px - 8, py - 12, 16, 7);
      g.strokeStyle = d.accent;
      g.globalAlpha = 0.8;
      g.strokeRect(px - 7.5, py - 11.5, 15, 6);
      g.globalAlpha = 1;
      g.fillStyle = d.accent;
      g.fillRect(px - 5, py - 9, 10, 1);
      g.fillRect(px - 5, py - 7, 6, 0.5);
    } else if (d.type === "mushroom") {
      const hue = d.hue > 0.7 ? "#6bd5ff" : "#61f4c0";
      g.fillStyle = "#d8d0c4";
      g.fillRect(px, py + 3, 2, 4);
      g.fillStyle = hue;
      g.fillRect(px - 2, py, 6, 3);
      g.fillStyle = "rgba(255,255,255,0.5)";
      g.fillRect(px - 1, py + 1, 1, 1);
    } else if (d.type === "shard") {
      const a = 0.5 + Math.sin(time * 0.002 + d.x) * 0.2;
      g.fillStyle = `rgba(255, 122, 168, ${a * 0.25})`;
      g.fillRect(px - 6, py - 10, 12, 20);
      g.fillStyle = "#ff9bc0";
      g.beginPath();
      g.moveTo(px, py - 9); g.lineTo(px + 3, py + 2); g.lineTo(px, py + 6);
      g.lineTo(px - 3, py + 2); g.closePath(); g.fill();
    } else if (d.type === "star") {
      const a = 0.35 + Math.sin(time * 0.003 + d.x * 3) * 0.3;
      g.fillStyle = `rgba(200, 180, 255, ${a})`;
      g.fillRect(px, py - 1, 1, 3);
      g.fillRect(px - 1, py, 3, 1);
    } else if (d.type === "node") {
      g.fillStyle = "rgba(97, 244, 192, 0.35)";
      g.fillRect(px, py, 2, 2);
      g.strokeStyle = "rgba(97, 244, 192, 0.12)";
      g.beginPath();
      g.moveTo(px, py); g.lineTo(px + 8, py);
      g.stroke();
    } else if (d.type === "petal") {
      g.fillStyle = "rgba(255, 200, 87, 0.35)";
      g.fillRect(px, py, 1, 1);
    } else if (d.type === "bench") {
      g.fillStyle = "rgba(2,6,10,0.35)";
      g.beginPath(); g.ellipse(px + 8, py + 10, 10, 3, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#2a2030";
      g.fillRect(px + 1, py + 6, 2, 5);
      g.fillRect(px + 13, py + 6, 2, 5);
      g.fillStyle = "#6b4a2f";
      g.fillRect(px - 2, py + 2, 20, 4);
      g.fillStyle = "#8a623d";
      g.fillRect(px - 2, py + 2, 20, 1);
      g.fillStyle = "#4a3322";
      g.fillRect(px - 2, py + 6, 20, 1);
      g.fillStyle = "#5a3d28";
      g.fillRect(px - 2, py - 6, 2, 9);
      g.fillRect(px + 16, py - 6, 2, 9);
      g.fillStyle = "#7a5636";
      g.fillRect(px - 2, py - 6, 20, 2);
    } else if (d.type === "terminal") {
      const a = d.accent || "#61f4c0";
      g.fillStyle = "rgba(2,6,10,0.35)";
      g.beginPath(); g.ellipse(px + 7, py + 12, 8, 2.5, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#162032";
      g.fillRect(px, py - 16, 14, 28);
      g.fillStyle = "#22304a";
      g.fillRect(px + 2, py - 14, 10, 4);
      g.fillStyle = hexA(a, 0.75);
      for (let i = 0; i < 3; i++) {
        if (Math.sin(time * 0.002 + i * 2 + d.x) > -0.2) {
          g.fillRect(px + 3 + i * 3, py - 5 + i * 3, 2, 1);
        }
      }
      g.fillStyle = "rgba(255,255,255,0.08)";
      g.fillRect(px + 2, py - 9, 10, 1);
    } else if (d.type === "pillar") {
      const a = d.accent || "#b48cff";
      g.fillStyle = "rgba(2,6,10,0.35)";
      g.beginPath(); g.ellipse(px + 6, py + 12, 8, 2.5, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#2a2648";
      g.fillRect(px, py - 14, 12, 26);
      g.fillStyle = "#3d3766";
      g.fillRect(px + 1, py - 14, 3, 24);
      g.fillStyle = "#1c1933";
      g.fillRect(px - 2, py + 10, 16, 4);
      g.fillStyle = hexA(a, 0.8);
      g.fillRect(px + 4, py - 8, 4, 1);
      g.fillRect(px + 5, py - 10, 2, 5);
    } else if (d.type === "book") {
      const a = d.accent || "#ffc857";
      g.fillStyle = "#2a1f33";
      g.fillRect(px - 6, py + 4, 14, 5);
      g.fillStyle = "#4a3a5c";
      g.fillRect(px - 5, py, 13, 4);
      g.fillStyle = a;
      g.fillRect(px - 4, py + 1, 11, 1);
      g.fillStyle = "#d9d0ff";
      g.fillRect(px - 3, py - 5, 10, 4);
      g.fillStyle = "#8d82b8";
      g.fillRect(px - 3, py - 5, 1, 4);
    } else if (d.type === "orb") {
      const a = d.accent || "#ff7aa8";
      const bob = Math.sin(time * 0.002 + d.x * 3) * 3;
      g.fillStyle = hexA(a, 0.16);
      g.beginPath(); g.arc(px, py + bob, 12, 0, Math.PI * 2); g.fill();
      g.strokeStyle = hexA(a, 0.8);
      g.lineWidth = 1;
      g.beginPath(); g.arc(px, py + bob, 5, 0, Math.PI * 2); g.stroke();
      g.beginPath(); g.ellipse(px, py + bob, 10, 3, 0.4, 0, Math.PI * 2); g.stroke();
    } else if (d.type === "crystal") {
      const a = d.accent || "#ff7aa8";
      const glow = 0.25 + Math.sin(time * 0.002 + d.x) * 0.1;
      g.fillStyle = hexA(a, glow);
      g.fillRect(px - 6, py - 14, 12, 26);
      g.fillStyle = a;
      g.beginPath();
      g.moveTo(px, py - 16); g.lineTo(px + 4, py - 1);
      g.lineTo(px + 1, py + 8); g.lineTo(px - 4, py - 2);
      g.closePath(); g.fill();
      g.fillStyle = "rgba(255,255,255,0.4)";
      g.fillRect(px - 1, py - 8, 1, 5);
    } else if (d.type === "flask") {
      const a = d.accent || "#7ee787";
      g.fillStyle = "#d9d0e8";
      g.fillRect(px - 4, py - 14, 8, 2);
      g.fillRect(px - 2, py - 12, 4, 7);
      g.beginPath();
      g.moveTo(px - 2, py - 5); g.lineTo(px - 8, py + 9);
      g.lineTo(px + 8, py + 9); g.lineTo(px + 2, py - 5);
      g.closePath(); g.fill();
      g.fillStyle = hexA(a, 0.75);
      g.beginPath();
      g.moveTo(px - 5, py + 2); g.lineTo(px - 8, py + 9);
      g.lineTo(px + 8, py + 9); g.lineTo(px + 5, py + 2);
      g.closePath(); g.fill();
    } else if (d.type === "bubble") {
      const a = d.accent || "#7ee787";
      const bob = Math.sin(time * 0.003 + d.x * 5) * 2;
      g.strokeStyle = hexA(a, 0.55);
      g.lineWidth = 1;
      g.beginPath(); g.arc(px, py + bob, 3, 0, Math.PI * 2); g.stroke();
      g.beginPath(); g.arc(px + 4, py - 5 + bob, 1.6, 0, Math.PI * 2); g.stroke();
    } else if (d.type === "note") {
      const a = d.accent || "#ffb26b";
      const bob = Math.sin(time * 0.002 + d.x * 3) * 3;
      g.fillStyle = hexA(a, 0.18);
      g.beginPath(); g.arc(px, py + bob, 10, 0, Math.PI * 2); g.fill();
      g.fillStyle = a;
      g.beginPath(); g.ellipse(px - 2, py + 5 + bob, 4, 3, -0.3, 0, Math.PI * 2); g.fill();
      g.fillRect(px + 1, py - 10 + bob, 2, 16);
      g.fillRect(px + 1, py - 10 + bob, 6, 2);
    } else if (d.type === "speaker") {
      const a = d.accent || "#ffb26b";
      g.fillStyle = "#2a2038";
      g.fillRect(px - 7, py - 6, 7, 12);
      g.fillStyle = "#4a3a5c";
      g.beginPath();
      g.moveTo(px, py - 6); g.lineTo(px + 7, py - 11);
      g.lineTo(px + 7, py + 11); g.lineTo(px, py + 6); g.closePath(); g.fill();
      const pulse = 0.3 + Math.sin(time * 0.003 + d.x) * 0.2;
      g.strokeStyle = hexA(a, pulse);
      g.beginPath(); g.arc(px + 8, py, 9, -0.7, 0.7); g.stroke();
      g.beginPath(); g.arc(px + 8, py, 15, -0.6, 0.6); g.stroke();
    } else if (d.type === "synapse") {
      const a = d.accent || "#6bd5ff";
      const pulse = 0.35 + Math.sin(time * 0.002 + d.x * 4) * 0.25;
      g.strokeStyle = hexA(a, pulse);
      g.beginPath();
      g.moveTo(px - 8, py + 6); g.lineTo(px, py - 6); g.lineTo(px + 8, py + 6);
      g.stroke();
      g.fillStyle = hexA(a, 0.8);
      g.beginPath(); g.arc(px - 8, py + 6, 2, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(px, py - 6, 2, 0, Math.PI * 2); g.fill();
      g.beginPath(); g.arc(px + 8, py + 6, 2, 0, Math.PI * 2); g.fill();
    } else if (d.type === "wave") {
      const a = d.accent || "#ffb26b";
      g.strokeStyle = hexA(a, 0.45);
      g.lineWidth = 1;
      g.beginPath();
      for (let i = -8; i <= 8; i += 2) {
        const yy = py + Math.sin(i * 0.8 + time * 0.003) * 3;
        if (i === -8) g.moveTo(px + i, yy); else g.lineTo(px + i, yy);
      }
      g.stroke();
    } else if (d.type === "antenna") {
      const a = d.accent || "#6bd5ff";
      g.strokeStyle = "#2a3048"; g.lineWidth = 2;
      g.beginPath(); g.moveTo(px, py + 10); g.lineTo(px, py - 18); g.stroke();
      g.strokeStyle = hexA(a, 0.55); g.lineWidth = 1;
      for (let r = 5; r <= 13; r += 4) { g.beginPath(); g.arc(px, py - 18, r, -2.4, -0.7); g.stroke(); }
      g.fillStyle = a; g.fillRect(px - 1, py - 20, 2, 2);
    } else if (d.type === "rack") {
      const a = d.accent || "#61f4c0";
      g.fillStyle = "#141c2b"; g.fillRect(px - 7, py - 20, 14, 30);
      g.fillStyle = "#24324a"; g.fillRect(px - 5, py - 18, 10, 26);
      for (let i = 0; i < 4; i++) {
        g.fillStyle = Math.sin(time * 0.003 + i + d.x) > 0 ? a : "#1c2a3a";
        g.fillRect(px - 4, py - 15 + i * 5, 2, 2);
        g.fillStyle = "#0d1420"; g.fillRect(px, py - 15 + i * 5, 3, 2);
      }
    } else if (d.type === "lock") {
      const a = d.accent || "#ffc857";
      g.strokeStyle = "#3a4466"; g.lineWidth = 2;
      g.beginPath(); g.arc(px, py - 10, 5, Math.PI, 0); g.stroke();
      g.fillStyle = "#24304a"; g.fillRect(px - 7, py - 10, 14, 13);
      g.fillStyle = hexA(a, 0.85); g.fillRect(px - 1, py - 5, 2, 4);
      g.fillRect(px - 2, py - 1, 4, 2);
    } else if (d.type === "compass") {
      const a = d.accent || "#b48cff";
      g.strokeStyle = "#4a4466"; g.lineWidth = 1;
      g.beginPath(); g.arc(px, py, 8, 0, Math.PI * 2); g.stroke();
      g.strokeStyle = hexA(a, 0.9);
      g.beginPath(); g.moveTo(px - 5, py + 4); g.lineTo(px + 4, py - 5); g.stroke();
      g.fillStyle = a; g.fillRect(px - 1, py - 1, 2, 2);
    } else if (d.type === "die") {
      const a = d.accent || "#b48cff";
      g.fillStyle = "#2a2438"; g.fillRect(px - 6, py - 6, 12, 12);
      g.fillStyle = a;
      for (const [dx, dy] of [[-3,-3],[3,-3],[0,0],[-3,3],[3,3]]) g.fillRect(px + dx, py + dy, 2, 2);
    } else if (d.type === "coil") {
      const a = d.accent || "#ffb26b";
      g.strokeStyle = hexA(a, 0.7); g.lineWidth = 1;
      for (let i = 0; i < 4; i++) { g.beginPath(); g.arc(px, py - i * 3, 6, 0, Math.PI * 2); g.stroke(); }
      g.fillStyle = "#2a3048"; g.fillRect(px - 7, py + 9, 14, 3);
    } else if (d.type === "gauge") {
      const a = d.accent || "#ff7aa8";
      g.strokeStyle = "#3a3a55"; g.lineWidth = 2;
      g.beginPath(); g.arc(px, py, 7, Math.PI, 0); g.stroke();
      const ang = -Math.PI + (0.5 + Math.sin(time * 0.002 + d.x) * 0.35) * Math.PI;
      g.strokeStyle = a; g.lineWidth = 1;
      g.beginPath(); g.moveTo(px, py); g.lineTo(px + Math.cos(ang) * 6, py + Math.sin(ang) * 6); g.stroke();
    } else if (d.type === "lens") {
      const a = d.accent || "#ff7aa8";
      g.fillStyle = "#1a2434"; g.fillRect(px - 1, py - 2, 2, 10);
      g.fillStyle = hexA(a, 0.28); g.beginPath(); g.ellipse(px, py - 6, 5, 8, 0, 0, Math.PI * 2); g.fill();
      g.strokeStyle = hexA(a, 0.8); g.lineWidth = 1; g.beginPath(); g.ellipse(px, py - 6, 5, 8, 0, 0, Math.PI * 2); g.stroke();
      g.fillStyle = "rgba(255,255,255,0.35)"; g.fillRect(px - 2, py - 10, 1, 3);
    } else if (d.type === "molecule") {
      const a = d.accent || "#7ee787";
      g.strokeStyle = hexA(a, 0.5); g.lineWidth = 1;
      g.beginPath(); g.moveTo(px - 7, py + 5); g.lineTo(px, py - 5); g.lineTo(px + 7, py + 5); g.stroke();
      g.fillStyle = hexA(a, 0.85);
      for (const [dx, dy] of [[-7,5],[0,-5],[7,5]]) { g.beginPath(); g.arc(px + dx, py + dy, 2.4, 0, Math.PI * 2); g.fill(); }
    } else if (d.type === "quill") {
      const a = d.accent || "#e8c07a";
      g.strokeStyle = a; g.lineWidth = 1;
      g.beginPath(); g.moveTo(px - 5, py + 9); g.quadraticCurveTo(px + 2, py - 8, px + 7, py - 12); g.stroke();
      g.fillStyle = hexA(a, 0.5); g.fillRect(px + 4, py - 13, 4, 2); g.fillRect(px + 2, py - 10, 4, 2);
    } else if (d.type === "mask") {
      const a = d.accent || "#e8c07a";
      g.fillStyle = "#2a2438"; g.fillRect(px - 7, py - 10, 14, 12);
      g.fillStyle = hexA(a, 0.8);
      g.fillRect(px - 5, py - 7, 3, 2); g.fillRect(px + 2, py - 7, 3, 2);
      g.beginPath(); g.arc(px, py + 1, 4, 0, Math.PI); g.fill();
    } else if (d.type === "metronome") {
      const a = d.accent || "#ffb26b";
      g.fillStyle = "#2a2438";
      g.beginPath(); g.moveTo(px, py - 18); g.lineTo(px + 7, py + 10); g.lineTo(px - 7, py + 10); g.closePath(); g.fill();
      const swing = Math.sin(time * 0.004 + d.x) * 6;
      g.strokeStyle = a; g.lineWidth = 1;
      g.beginPath(); g.moveTo(px, py + 7); g.lineTo(px + swing, py - 14); g.stroke();
      g.fillStyle = a; g.fillRect(px + swing - 1, py - 15, 2, 2);
    } else if (d.type === "crate") {
      // caixote do cais: tábua, travessa e prego
      const a = d.accent || "#ffc857";
      g.fillStyle = "rgba(2,6,10,0.35)";
      g.beginPath(); g.ellipse(px + 1, py + 7, 8, 2.4, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#4a3322"; g.fillRect(px - 6, py - 5, 13, 12);
      g.fillStyle = "#6b4a2f"; g.fillRect(px - 5, py - 4, 11, 10);
      g.fillStyle = "#7d5a38"; g.fillRect(px - 5, py - 4, 11, 1);
      g.fillStyle = "#3d2a1a"; g.fillRect(px - 5, py - 1, 11, 1); g.fillRect(px - 1, py - 4, 1, 10);
      g.fillStyle = hexA(a, 0.8); g.fillRect(px - 4, py + 3, 1, 1); g.fillRect(px + 3, py + 3, 1, 1);
    } else if (d.type === "crane") {
      // guindaste: base, mastro, lança sobre a água e o cabo com o caixote
      const a = d.accent || "#ffc857";
      g.fillStyle = "rgba(2,6,10,0.4)";
      g.beginPath(); g.ellipse(px, py + 9, 11, 3, 0, 0, Math.PI * 2); g.fill();
      g.fillStyle = "#3a2a1e"; g.fillRect(px - 7, py + 5, 15, 4);
      g.fillStyle = "#5a4030"; g.fillRect(px - 2, py - 22, 4, 28);
      g.fillStyle = "#7a5636"; g.fillRect(px - 1, py - 22, 1, 27);
      g.strokeStyle = "#5a4030"; g.lineWidth = 2;
      g.beginPath(); g.moveTo(px, py - 22); g.lineTo(px + 18, py - 20); g.stroke();
      g.strokeStyle = "#8a623d"; g.lineWidth = 1;
      g.beginPath(); g.moveTo(px, py - 23); g.lineTo(px + 18, py - 21); g.stroke();
      const balanco = Math.sin(time * 0.0016 + d.x) * 1.5;
      g.strokeStyle = "rgba(220,210,190,0.7)";
      g.beginPath(); g.moveTo(px + 18, py - 20); g.lineTo(px + 18 + balanco, py - 8); g.stroke();
      g.fillStyle = "#6b4a2f"; g.fillRect(px + 15 + balanco, py - 8, 7, 6);
      g.fillStyle = "#3d2a1a"; g.fillRect(px + 15 + balanco, py - 5, 7, 1);
      g.fillStyle = a; g.fillRect(px - 1, py - 24, 2, 2);
    } else if (d.type === "bell") {
      // sino do porto: armação, sino e badalo
      const a = d.accent || "#ffc857";
      g.fillStyle = "#3a2a1e";
      g.fillRect(px - 1, py - 12, 3, 22);
      g.fillRect(px - 8, py - 12, 17, 2);
      g.fillStyle = "#5a4030"; g.fillRect(px - 9, py - 12, 3, 2);
      g.fillStyle = "#c9a227";
      g.beginPath();
      g.moveTo(px - 5, py - 9); g.lineTo(px + 5, py - 9);
      g.lineTo(px + 7, py - 1); g.lineTo(px - 7, py - 1);
      g.closePath(); g.fill();
      g.fillStyle = "#8f6f1a"; g.fillRect(px - 7, py - 2, 15, 2);
      const bal = Math.sin(time * 0.006 + d.x) * 1;
      g.fillStyle = a; g.fillRect(px - 1 + bal, py - 1, 2, 3);
      g.fillStyle = "#2a2438"; g.fillRect(px - 1, py - 10, 2, 1);
    } else if (d.type === "mast") {
      // mastro com bandeira que tremula
      g.fillStyle = "#4a3322"; g.fillRect(px - 1, py - 26, 3, 34);
      g.fillStyle = "#7a5636"; g.fillRect(px - 1, py - 26, 1, 33);
      const onda = Math.sin(time * 0.004 + d.x) * 2;
      g.fillStyle = d.accent || "#ffc857";
      g.beginPath();
      g.moveTo(px + 2, py - 25);
      g.lineTo(px + 13, py - 23 + onda);
      g.lineTo(px + 2, py - 18);
      g.closePath(); g.fill();
      g.fillStyle = "rgba(255,255,255,0.35)";
      g.fillRect(px + 3, py - 23, 3, 1);
    } else if (d.type === "gull") {
      // gaivota: duas asas que sobem e descem, sem sombra no chão
      const t = time * 0.005 + d.x * 6;
      const asa = Math.sin(t) * 2;
      const x = px;
      const y = py - 16 + Math.sin(time * 0.0012 + d.x * 9) * 3;
      g.fillStyle = "rgba(240,244,255,0.9)";
      g.fillRect(x - 3, y - 1 + asa, 3, 1);
      g.fillRect(x + 1, y - 1 + asa, 3, 1);
      g.fillRect(x - 1, y, 2, 1);
      g.fillStyle = "rgba(255,200,87,0.9)";
      g.fillRect(x + 1, y, 1, 1);
    }
  }


export function desenharIcone(g,d,time=0) {
  if(typeof document==='undefined')return desenharIconeBase(g,d,time);
  const tick=artTick(time+(d.x||0)*23,120)%32;
  const key=`concept:${d.type}:${d.accent}:${d.hue}:${tick}`;
  const pose=spritePose(key,112,128,ctx=>{
    ctx.translate(56,92);desenharIconeBase(ctx,{...d,x:0,y:0},tick*120);detailConcept(ctx,d.type);
  },'metal');
  g.save();g.imageSmoothingEnabled=false;g.drawImage(pose,d.x*TILE-56,d.y*TILE-92);g.restore();
}

export const ICONES = new Set([
  "antenna", "bell", "bench", "book", "bubble", "coil", "compass", "crane", "crate", "crystal", "die", "flask", "gauge", "gull", "lamp", "lens", "lock", "mask", "mast", "metronome", "molecule", "mushroom", "node", "note", "orb", "petal", "pillar", "quill", "rack", "shard", "sign", "speaker", "star", "synapse", "terminal", "wave",
]);

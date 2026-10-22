import { spritePose } from "./sprite-cache.js";
import { artTick, artTime } from "./art-style.js";
import { drawHuman } from "./human.js";
import { drawPetSprite } from "./pet-art.js";
// ---------- desenho ----------
function drawAdventurerRaw(ctx, x, y, dir, moving, t, avatar = {}, look = null, gear = null) {
  // O mesmo boneco da superfície, com capa e lanterna por cima. A nave é
  // desenhada por drawSkiff, em skiff.js, para o casco ser o mesmo nos dois
  // lugares.
  const c = { hair: "#3a2a55", skin: "#f0c9a8", shirt: "#61f4c0", pants: "#2f3a66", ...avatar };
  const animate = moving;
  const frame = animate ? Math.floor(t / 115) % 4 : 0;
  const swing = animate ? [0, 1, 0, -1][frame] : 0;
  const bob = animate && (frame === 1 || frame === 3) ? -1 : 0;
  ctx.save();
  ctx.translate(x, y + bob);
  // capa atrás do corpo, balançando com o passo
  ctx.fillStyle = "#242844";
  ctx.fillRect(-6 + (swing > 0 ? 1 : 0), -15, 12, 11);
  ctx.fillStyle = "#1b1f37";
  ctx.fillRect(-5, -5 + (swing < 0 ? 1 : 0), 10, 2);
  drawHuman(ctx, 0, 0, dir, animate, t, c, 1, look, gear);
  // lanterna na mão direita, com halo curto
  ctx.fillStyle = "rgba(255,200,87,0.16)";
  ctx.beginPath();
  ctx.arc(7, -7, 4.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2a2438";
  ctx.fillRect(6, -9, 3, 4);
  ctx.fillStyle = "#ffc857";
  ctx.fillRect(7, -8, 1, 2);
  ctx.restore();
}

function drawChestRaw(ctx, x, y, opened, accent) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.ellipse(0, 0, 7, 2.4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#4b3320";
  ctx.fillRect(-7, -9, 14, 9);
  ctx.fillStyle = "#6b4a2c";
  ctx.fillRect(-7, -9, 14, 3);
  ctx.fillStyle='#b18b58';ctx.fillRect(-6,-8,12,.5);
  ctx.fillStyle='#291c1c';for(const xx of [-4,0,4])ctx.fillRect(xx,-5,.5,4);
  ctx.fillStyle='#aea3ac';ctx.fillRect(-6,-7,1,.5);ctx.fillRect(5,-7,1,.5);
  if (opened) {
    ctx.fillStyle = "#1a120c";
    ctx.fillRect(-6, -9, 12, 4);
    ctx.fillStyle = "#6b4a2c";
    ctx.fillRect(-8, -13, 16, 3);
  } else {
    ctx.fillStyle = accent;
    ctx.fillRect(-2, -6, 4, 4);
    ctx.fillStyle = "#2b1d10";
    ctx.fillRect(-1, -5, 2, 2);
  }
  ctx.restore();
}

function drawStairsRaw(ctx, x, y, accent, t = 0) {
  const glow = 0.5 + Math.sin(t * 0.004) * 0.16;
  ctx.save();
  ctx.translate(x, y);
  // sombra no chão
  ctx.fillStyle = "rgba(0,0,0,0.38)";
  ctx.beginPath();
  ctx.ellipse(0, 0, 13, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  // vão da escada
  ctx.fillStyle = "#070a13";
  ctx.fillRect(-11, -24, 22, 24);
  // degraus: cada um sobe 4px e afina 1px de cada lado, e o de cima é o mais claro
  const treads = [
    [-10, -4, 20, "#2f3a5c", "#4d5d90"],
    [-9, -8, 18, "#374469", "#56699f"],
    [-8, -12, 16, "#40507b", "#6177af"],
    [-7, -16, 14, "#4a5c8d", "#6e86bf"],
    [-6, -20, 12, "#55699c", "#7d95cf"],
  ];
  for (const [dx, dy, w, riser, tread] of treads) {
    ctx.fillStyle = riser;
    ctx.fillRect(dx, dy, w, 3);
    ctx.fillStyle = tread;
    ctx.fillRect(dx, dy - 1, w, 1);
  }
  // paredes laterais
  ctx.fillStyle = "#141a29";
  ctx.fillRect(-13, -24, 2, 25);
  ctx.fillRect(11, -24, 2, 25);
  ctx.fillStyle = "#2b3654";
  ctx.fillRect(-13, -24, 2, 1);
  ctx.fillRect(11, -24, 2, 1);
  // a abertura lá em cima, com a luz da superfície vazando pela pedra
  ctx.fillStyle = `rgba(255,233,176,${0.55 + glow * 0.3})`;
  ctx.fillRect(-6, -24, 12, 2);
  const halo = ctx.createRadialGradient(0, -26, 1, 0, -26, 13);
  halo.addColorStop(0, `rgba(255,233,176,${0.2 + glow * 0.12})`);
  halo.addColorStop(1, "rgba(255,233,176,0)");
  ctx.fillStyle = halo;
  ctx.fillRect(-14, -40, 28, 18);
  // seta de pedra apontando para cima, para o sentido não deixar dúvida
  ctx.fillStyle = `rgba(255,233,176,${0.55 + glow * 0.3})`;
  ctx.fillRect(-1, -38, 2, 1);
  ctx.fillRect(-2, -37, 4, 1);
  ctx.fillRect(-3, -36, 6, 1);
  ctx.fillRect(-1, -35, 2, 5);
  ctx.restore();
}

function drawTorchRaw(ctx, x, y, t, accent) {
  const flick = Math.sin(t * 0.013 + x * 0.7) * 0.5 + Math.sin(t * 0.031 + y) * 0.3;
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#2a1c12";
  ctx.fillRect(-1, -7, 2, 7);
  ctx.fillStyle = "#ff9f43";
  ctx.fillRect(-2, -11 + flick, 4, 4);
  ctx.fillStyle = "#ffd166";
  ctx.fillRect(-1, -12 + flick, 2, 3);
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.16;
  ctx.beginPath();
  ctx.arc(0, -9, 13, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();
}

function drawAltarRaw(ctx, x, y, t, accent) {
  const glow = 0.16 + Math.sin(t * 0.004) * 0.06;
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.ellipse(0, 0, 12, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2c3350";
  ctx.fillRect(-10, -8, 20, 8);
  ctx.fillStyle = "#3d4770";
  ctx.fillRect(-8, -13, 16, 6);
  ctx.fillStyle = accent;
  ctx.globalAlpha = glow;
  ctx.beginPath();
  ctx.arc(0, -14, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.globalAlpha = 1;
  ctx.fillRect(-2, -17, 4, 5);
  ctx.restore();
}

// Mesa de vocação: estante baixa com o livro das cinco cartas aberto e duas
// velas. O brilho muda de cor com o tempo, como se a página virasse sozinha.
function drawMesaRaw(ctx, x, y, t, accent) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.ellipse(0, 1, 14, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#3a2b22";
  ctx.fillRect(-13, -8, 26, 8);
  ctx.fillStyle = "#5a4030";
  ctx.fillRect(-13, -9, 26, 2);
  ctx.fillStyle = "#1b1626";
  ctx.fillRect(-8, -14, 16, 6);
  ctx.fillStyle = "#d8d0e8";
  ctx.fillRect(-7, -13, 7, 4);
  ctx.fillRect(1, -13, 6, 4);
  ctx.fillStyle = accent;
  ctx.fillRect(-6, -12, 5, 1);
  ctx.fillRect(2, -12, 4, 1);
  const brilho = 0.5 + Math.sin(t * 0.004) * 0.25;
  ctx.globalAlpha = brilho;
  ctx.fillStyle = "#ffe3a1";
  ctx.fillRect(-11, -12, 2, 3);
  ctx.fillRect(9, -12, 2, 3);
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawForgeRaw(ctx, x, y, t, accent) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.ellipse(0, 0, 13, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#37304a";
  ctx.fillRect(-11, -10, 22, 10);
  ctx.fillStyle = "#4a3f60";
  ctx.fillRect(-8, -15, 16, 6);
  ctx.fillStyle = "#1b1626";
  ctx.fillRect(-5, -13, 10, 4);
  const f = Math.sin(artTime(t) * 0.017) * 1.4;
  ctx.fillStyle='#786680';for(const xx of [-8,-3,2,7])ctx.fillRect(xx,-4,3,.5);
  ctx.fillStyle='#171423';ctx.fillRect(-8,-9,.5,6);ctx.fillRect(7,-9,.5,6);
  ctx.fillStyle = "#ff7a3d";
  ctx.fillRect(-4, -12 + f, 8, 2);
  ctx.fillStyle = "#ffd166";
  ctx.fillRect(-2, -12 + f, 4, 1);
  ctx.fillStyle = accent;
  ctx.fillRect(-6, -8, 12, 1);
  ctx.restore();
}

// ---- sala temática: cada disciplina tem um cômodo com a sua cara ----
function drawOficinaRaw(ctx, x, y, t, accent) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath(); ctx.ellipse(0, 0, 15, 4, 0, 0, Math.PI * 2); ctx.fill();
  // bancada de pedra e bigorna
  ctx.fillStyle = "#2a2438";
  ctx.fillRect(-13, -9, 26, 9);
  ctx.fillStyle = "#3a3350";
  ctx.fillRect(-13, -11, 26, 3);
  ctx.fillStyle = "#16131f";
  ctx.fillRect(-7, -18, 14, 6);
  ctx.fillRect(-4, -22, 8, 4);
  ctx.fillStyle = "#4a4560";
  ctx.fillRect(-6, -17, 12, 1);
  ctx.fillStyle = accent;
  ctx.fillRect(-8, -9, 16, 1);
  // martelo e faísca
  ctx.fillStyle = "#6b4b2a";
  ctx.fillRect(8, -25, 2, 10);
  ctx.fillStyle = "#9aa3b8";
  ctx.fillRect(6, -27, 6, 3);
  const f = Math.sin(t * 0.02);
  ctx.fillStyle = "#ffd166";
  ctx.fillRect(-3 + f * 4, -21 - Math.abs(f) * 3, 1, 1);
  ctx.fillRect(2 - f * 3, -24, 1, 1);
  ctx.restore();
}

function drawBibliotecaRaw(ctx, x, y, t, accent) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath(); ctx.ellipse(0, 0, 12, 4, 0, 0, Math.PI * 2); ctx.fill();
  // estante alta, com três prateleiras de livros
  ctx.fillStyle = "#1b1626";
  ctx.fillRect(-10, -32, 20, 32);
  ctx.fillStyle = "#382a44";
  ctx.fillRect(-9, -31, 18, 30);
  const cores = ["#b48cff", "#61f4c0", "#ffd166", "#ff7a7a", "#8ab6ff"];
  for (let s = 0; s < 3; s++) {
    const base = -27 + s * 9;
    ctx.fillStyle = "#241d33";
    ctx.fillRect(-8, base + 6, 16, 2);
    for (let i = 0; i < 5; i++) {
      ctx.fillStyle = cores[(i + s) % cores.length];
      ctx.fillRect(-7 + i * 3, base, 2, 6);
    }
  }
  // vela acesa e brilho do conhecimento
  ctx.fillStyle = "#ffd166";
  ctx.fillRect(11, -18, 2, 3);
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.25 + Math.sin(t * 0.005) * 0.1;
  ctx.fillRect(-9, -31, 18, 24);
  ctx.globalAlpha = 1;
  ctx.restore();
}

function drawObservatorioRaw(ctx, x, y, t, accent) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath(); ctx.ellipse(0, 0, 12, 4, 0, 0, Math.PI * 2); ctx.fill();
  // tripé
  ctx.strokeStyle = "#4a4560";
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, -14); ctx.lineTo(-8, 0);
  ctx.moveTo(0, -14); ctx.lineTo(8, 0);
  ctx.moveTo(0, -14); ctx.lineTo(0, -2);
  ctx.stroke();
  // tubo apontado para o céu
  ctx.save();
  ctx.translate(0, -16);
  ctx.rotate(-0.55);
  ctx.fillStyle = "#1b1626";
  ctx.fillRect(-14, -4, 28, 8);
  ctx.fillStyle = "#3a3350";
  ctx.fillRect(-13, -3, 26, 6);
  ctx.fillStyle = "#8ab6ff";
  ctx.fillRect(-14, -2, 3, 4);
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.6 + Math.sin(t * 0.004) * 0.2;
  ctx.fillRect(-14, -2, 2, 4);
  ctx.globalAlpha = 1;
  ctx.restore();
  // estrelas piscando na parede
  for (let i = 0; i < 4; i++) {
    const a = 0.35 + Math.sin(t * 0.003 + i * 2.1) * 0.3;
    ctx.fillStyle = `rgba(180,220,255,${a.toFixed(2)})`;
    ctx.fillRect(-8 + i * 6, -30 + (i % 2) * 4, 1, 1);
  }
  ctx.restore();
}

function drawWaystoneRaw(ctx, x, y, t, accent) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.ellipse(0, 0, 9, 3, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2a3048";
  ctx.fillRect(-6, -22, 12, 22);
  ctx.fillStyle = "#3b4466";
  ctx.fillRect(-4, -20, 8, 17);
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.55 + Math.sin(t * 0.003) * 0.25;
  ctx.fillRect(-2, -17, 4, 4);
  ctx.fillRect(-3, -11, 6, 1);
  ctx.restore();
}

function drawPortalRaw(ctx, x, y, t, accent) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.beginPath();
  ctx.ellipse(0, 0, 15, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2a3048";
  ctx.fillRect(-15, -30, 5, 30);
  ctx.fillRect(10, -30, 5, 30);
  ctx.fillRect(-15, -34, 30, 6);
  ctx.fillStyle = "#0b1020";
  ctx.fillRect(-10, -29, 20, 28);
  const pulse = 0.35 + Math.sin(t * 0.003) * 0.2;
  ctx.globalAlpha = pulse;
  ctx.fillStyle = accent;
  ctx.fillRect(-8, -27, 16, 25);
  ctx.globalAlpha = pulse + 0.2;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1;
  for (let i = 0; i < 3; i++) {
    const yy = -24 + ((t * 0.02 + i * 8) % 22);
    ctx.beginPath();
    ctx.moveTo(-7, yy);
    ctx.lineTo(7, yy - 3);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
  ctx.fillStyle = accent;
  ctx.fillRect(-17, -37, 3, 3);
  ctx.fillRect(14, -37, 3, 3);
  ctx.restore();
}

function drawTunnelRaw(ctx, x, y, t, accent) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.beginPath();
  ctx.ellipse(0, 0, 12, 3.4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#242a3c";
  ctx.fillRect(-11, -16, 22, 16);
  ctx.fillStyle = "#0a0d17";
  ctx.beginPath();
  ctx.arc(0, -15, 9, Math.PI, 0);
  ctx.fill();
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.5 + Math.sin(t * 0.004) * 0.2;
  ctx.fillRect(-7, -14, 2, 8);
  ctx.fillRect(5, -14, 2, 8);
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#3b4466";
  ctx.fillRect(-12, -18, 4, 3);
  ctx.fillRect(8, -18, 4, 3);
  ctx.restore();
}

function drawKeeperRaw(ctx, x, y, t, accent) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(0,0,0,0.4)";
  ctx.beginPath();
  ctx.ellipse(0, 0, 6.5, 2.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#5a4a2a";
  ctx.fillRect(-5, -13, 10, 13);
  ctx.fillStyle = "#8a7440";
  ctx.fillRect(-5, -13, 2, 13);
  ctx.fillStyle = "#c9a37c";
  ctx.fillRect(-4, -19, 8, 6);
  ctx.fillStyle = "#d9d2c2";
  ctx.fillRect(-4, -21, 8, 3);
  ctx.fillRect(-5, -19, 2, 4);
  ctx.fillStyle = "#101426";
  ctx.fillRect(-2, -17, 1, 1);
  ctx.fillRect(1, -17, 1, 1);
  ctx.fillStyle = accent;
  ctx.fillRect(-1, -14, 2, 2);
  ctx.restore();
}

function drawPlotRaw(ctx, x, y, t, accent, planted, ready) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "#2a2116";
  ctx.fillRect(-10, -7, 20, 7);
  ctx.fillStyle = "#1a2a1c";
  ctx.fillRect(-9, -6, 18, 1);
  for (let i = 0; i < 3; i++) {
    const sway = Math.sin(t * 0.003 + i * 1.4) * 0.7;
    if (ready) {
      ctx.fillStyle = accent;
      ctx.fillRect(-7 + i * 6, -13 + sway, 2, 6);
      ctx.fillRect(-4 + i * 6, -11 - sway, 2, 5);
    } else if (planted) {
      ctx.fillStyle = "#4a7a4e";
      ctx.fillRect(-7 + i * 6, -8, 2, 2);
    } else {
      ctx.fillStyle = "#3a2f22";
      ctx.fillRect(-6 + i * 6, -5, 2, 1);
    }
  }
  ctx.restore();
}

function drawVeinRaw(ctx, x, y, t, accent, charges) {
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.ellipse(0, 0, 11, 3.5, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2c2b3e";
  ctx.fillRect(-10, -9, 20, 9);
  ctx.fillRect(-7, -14, 14, 6);
  if (charges > 0) {
    const glow = 0.5 + Math.sin(t * 0.004) * 0.25;
    ctx.globalAlpha = glow;
    ctx.fillStyle = accent;
    ctx.fillRect(-6, -12, 3, 5);
    ctx.fillRect(1, -13, 3, 7);
    ctx.fillRect(5, -10, 2, 3);
    ctx.globalAlpha = 1;
  } else {
    ctx.fillStyle = "#4c4a58";
    ctx.fillRect(-6, -11, 2, 3);
    ctx.fillRect(2, -12, 2, 4);
  }
  ctx.restore();
}

export function drawPet(ctx, x, y, t, accent, kind, tamed) {
  ctx.save();
  if (tamed) {
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.22 + Math.sin(t * 0.004) * 0.08;
    ctx.beginPath();
    ctx.ellipse(x, y + 1, 9, 3.4, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.globalAlpha = 1;
  }
  drawPetSprite(ctx, kind, x, y, t, false);
  ctx.restore();
}

function drawEnchanterRaw(ctx, x, y, t, accent) {
  const glow = 0.35 + Math.sin(t * 0.004) * 0.18;
  ctx.save();
  ctx.translate(x, y);
  ctx.fillStyle = "rgba(0,0,0,0.35)";
  ctx.beginPath();
  ctx.ellipse(0, 0, 12, 4, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#2d3048";
  ctx.fillRect(-11, -9, 22, 9);
  ctx.fillStyle = "#3f4468";
  ctx.fillRect(-9, -13, 18, 4);
  ctx.globalAlpha = glow;
  ctx.strokeStyle = accent;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.arc(0, -12, 7, 0, Math.PI * 2);
  ctx.stroke();
  ctx.globalAlpha = 1;
  ctx.fillStyle = accent;
  ctx.fillRect(-1, -22 + Math.sin(t * 0.005) * 1.2, 2, 6);
  ctx.restore();
}

export function drawBuilding(ctx, x, y, w, h, palette, accent) {
  ctx.fillStyle = "rgba(0,0,0,0.32)";
  ctx.fillRect(x + 2, y + h - 4, w, 4);
  ctx.fillStyle = "#232842";
  ctx.fillRect(x, y, w, h);
  ctx.fillStyle = palette.wallTop;
  ctx.fillRect(x, y, w, 3);
  ctx.fillStyle = accent;
  ctx.globalAlpha = 0.55;
  ctx.fillRect(x + 4, y + 6, 3, 4);
  ctx.fillRect(x + w - 8, y + 6, 3, 4);
  ctx.globalAlpha = 1;
  ctx.fillStyle = "#0a0d18";
  ctx.fillRect(x + w / 2 - 3, y + h - 9, 6, 9);
}

export function drawDungeonSprite(name,paint,timeIndex,ctx,x,y,...args) {
  const values=args.slice();
  if(timeIndex!==null)values[timeIndex]=artTick(values[timeIndex]+x*17+y*23,120)*120;
  const key=JSON.stringify(['dungeon',name,...values]);
  const pose=spritePose(key,112,112,g=>{g.translate(56,86);paint(g,0,0,...values);},'stone');
  ctx.save();ctx.imageSmoothingEnabled=false;ctx.drawImage(pose,x-56,y-86);ctx.restore();
}
export function drawAdventurer(ctx,x,y,...args) { drawDungeonSprite("drawAdventurer",drawAdventurerRaw,2,ctx,x,y,...args); }
export function drawChest(ctx,x,y,...args) { drawDungeonSprite("drawChest",drawChestRaw,null,ctx,x,y,...args); }
export function drawStairs(ctx,x,y,...args) { drawDungeonSprite("drawStairs",drawStairsRaw,1,ctx,x,y,...args); }
export function drawTorch(ctx,x,y,...args) { drawDungeonSprite("drawTorch",drawTorchRaw,0,ctx,x,y,...args); }
export function drawAltar(ctx,x,y,...args) { drawDungeonSprite("drawAltar",drawAltarRaw,0,ctx,x,y,...args); }
export function drawMesa(ctx,x,y,...args) { drawDungeonSprite("drawMesa",drawMesaRaw,0,ctx,x,y,...args); }
export function drawForge(ctx,x,y,...args) { drawDungeonSprite("drawForge",drawForgeRaw,0,ctx,x,y,...args); }
export function drawOficina(ctx,x,y,...args) { drawDungeonSprite("drawOficina",drawOficinaRaw,0,ctx,x,y,...args); }
export function drawBiblioteca(ctx,x,y,...args) { drawDungeonSprite("drawBiblioteca",drawBibliotecaRaw,0,ctx,x,y,...args); }
export function drawObservatorio(ctx,x,y,...args) { drawDungeonSprite("drawObservatorio",drawObservatorioRaw,0,ctx,x,y,...args); }
export function drawWaystone(ctx,x,y,...args) { drawDungeonSprite("drawWaystone",drawWaystoneRaw,0,ctx,x,y,...args); }
export function drawPortal(ctx,x,y,...args) { drawDungeonSprite("drawPortal",drawPortalRaw,0,ctx,x,y,...args); }
export function drawTunnel(ctx,x,y,...args) { drawDungeonSprite("drawTunnel",drawTunnelRaw,0,ctx,x,y,...args); }
export function drawKeeper(ctx,x,y,...args) { drawDungeonSprite("drawKeeper",drawKeeperRaw,0,ctx,x,y,...args); }
export function drawPlot(ctx,x,y,...args) { drawDungeonSprite("drawPlot",drawPlotRaw,0,ctx,x,y,...args); }
export function drawVein(ctx,x,y,...args) { drawDungeonSprite("drawVein",drawVeinRaw,0,ctx,x,y,...args); }
export function drawEnchanter(ctx,x,y,...args) { drawDungeonSprite("drawEnchanter",drawEnchanterRaw,0,ctx,x,y,...args); }

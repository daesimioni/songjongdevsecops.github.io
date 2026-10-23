import { directionAngle, directionVector } from "../core/movement.js";

export const COMBAT_ATLAS = new URL("../../assets/combat/action-vfx-v1.png", import.meta.url);
export const EFFECT_ROWS = Object.freeze({ slash: 0, shield: 1, impact: 2, dash: 3, claw: 4, fire: 5, ice: 6, energy: 7 });
let atlas;
function getAtlas() {
  if (!atlas && typeof Image !== "undefined") {
    atlas = new Image();
    atlas.src = COMBAT_ATLAS.href;
  }
  return atlas?.complete && atlas.naturalWidth ? atlas : null;
}
// Pré-carrega uma vez; não cria imagens ou requisições por partícula.
getAtlas();
export function effectFrame(age, duration) {
  if (age < 0 || age >= duration) return -1;
  return Math.min(7, Math.floor(age / duration * 8));
}
export function drawEffect(ctx, kind, frame, x, y, size = 36, angle = 0, alpha = 1) {
  const image = getAtlas();
  if (!image || frame < 0 || !(kind in EFFECT_ROWS)) return;
  ctx.save();
  ctx.imageSmoothingEnabled = false;
  ctx.globalAlpha *= alpha;
  ctx.translate(x, y); ctx.rotate(angle);
  ctx.drawImage(image, frame * 64, EFFECT_ROWS[kind] * 64, 64, 64, -size / 2, -size / 2, size, size);
  ctx.restore();
}
// Deslocamento apenas visual: as coordenadas e colisões permanecem exatas.
export function combatPose(actor, now, player = false) {
  if (!actor) return { x: 0, y: 0, alpha: 1 };
  const dir = directionVector(player && now < actor.ataqueVisualAte ? actor.ataqueDir ?? actor.dir : actor.dir);
  let amount = 0;
  if (player && now < actor.ataqueVisualAte) {
    const p = 1 - (actor.ataqueVisualAte - now) / 260;
    amount = Math.sin(Math.max(0, p) * Math.PI) * 2.5;
  } else if (!player && actor.vento) {
    amount = -1.5;
  } else if (player && actor.defendendo) amount = -0.8;
  return { x: dir.x * amount, y: dir.y * amount, alpha: player && now < actor.esquivaAte ? 0.65 : 1 };
}
export function drawCombatEvents(ctx, model) {
  for (const e of model.efeitos || []) {
    const age = model.agora - e.em;
    const x = e.x / 3, y = e.y / 3 - 10;
    const tx = (e.alvoX ?? e.x) / 3, ty = (e.alvoY ?? e.y) / 3 - 12;
    const angle = directionAngle(e.dir);
    const draw = (kind, duration, px, py, size, rotation = 0) => drawEffect(ctx, kind, effectFrame(age, duration), px, py, size, rotation);
    if (e.tipo === "ataque") draw("slash", 260, model.jogador.x / 3, model.jogador.y / 3 - 10, 42, angle);
    else if (e.tipo === "golpeInimigo") draw("claw", 300, tx, ty, 38, directionAngle(e.alvoDir));
    else if (e.tipo === "guarda" || e.tipo === "escudo") draw("shield", 300, x, y, 25);
    else if (e.tipo === "esquiva" && !Number.isFinite(e.alvoX)) draw("dash", 320, x, y + 8, 38, angle);
    else if (e.tipo === "aparou" || e.tipo === "bloqueou" || e.bloqueado) {
      draw("shield", 340, x, y, 28);
      draw("impact", 240, x, y, e.tipo === "aparou" ? 32 : 20);
    } else if (e.tipo === "acertou") draw("impact", 240, tx, ty, 26);
    else if (e.tipo === "magia") draw(e.magia === "runa-fogo" ? "fire" : e.magia === "runa-gelo" ? "ice" : e.magia === "runa-punhal" ? "slash" : "energy", 480, tx, ty, 38);
    else if (e.tipo === "dano" || e.tipo === "area") draw("claw", 240, x, y, 25, angle + Math.PI);
    else if (e.tipo === "curaJogador" || e.tipo === "bicho" || e.tipo === "mana" || e.tipo === "eco" || e.tipo === "lente") draw("energy", 420, x, y, 30);
    else if (e.tipo === "matou") draw("dash", 480, tx, ty + 8, 34);

    const hit = e.tipo === "acertou", hurt = e.tipo === "dano" || e.tipo === "area";
    const label = e.tipo === "aparou" ? "APAROU" : e.tipo === "bloqueou" ? "BLOQUEIO" : e.tipo === "desviou" || e.tipo === "errou" ? "ERROU" : e.tipo === "curaJogador" && e.valor > 0 ? `+${e.valor}` : (hit || hurt) && e.valor > 0 ? `−${e.valor}` : null;
    if (label && age >= 0 && age < 780) {
      ctx.save();
      ctx.globalAlpha *= Math.min(1, (780 - age) / 200);
      ctx.font = "bold 6px monospace"; ctx.textAlign = "center";
      ctx.lineWidth = 2; ctx.strokeStyle = "#0b101b";
      ctx.fillStyle = hurt ? "#ff9b99" : hit ? "#fff0be" : "#a3f6e7";
      const px = hit || e.tipo === "desviou" ? tx : x;
      const py = (hit || e.tipo === "desviou" ? ty : y) - 16 - age / 65;
      ctx.strokeText(label, px, py); ctx.fillText(label, px, py);
      ctx.restore();
    }
  }
}

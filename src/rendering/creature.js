import { spritePose } from "./sprite-cache.js";
import { artTime, artTick } from "./art-style.js";
import { drawCreatureModel, creatureFrameCount } from "./creature-models.js";
import { drawGeneratedCreature, hasGeneratedCreature } from "./generated-creature.js";
export function drawCreature(ctx, kind, accent, time = 0, scale = 1, dir = 0, semSombra = false, moving = false) {
  ctx.save();ctx.scale(scale,scale);
  if(!semSombra){ctx.fillStyle='rgba(2,4,10,.32)';ctx.beginPath();ctx.ellipse(0,0,kind==='boss'?22:13,3.4,0,0,Math.PI*2);ctx.fill();}
  if (hasGeneratedCreature(kind) && drawGeneratedCreature(ctx, kind, time, 1, dir, moving)) { ctx.restore(); return; }
  drawCreatureModel(ctx,kind,accent,artTime(time),dir,moving);ctx.restore();
}

// ---------------------------------------------------------------------------
// Composição comum a mapa, duelo e bestiário. Folga cobre chifres e passo;
// poses finitas conservam a memória e permitem reutilizar ciclos de animação.
export function drawCreatureArt(ctx, kind, accent, time = 0, scale = 1, dir = 0, moving = false) {
  if (hasGeneratedCreature(kind) && typeof document !== "undefined") {
    ctx.save();
    ctx.fillStyle='rgba(2,4,10,0.32)';ctx.beginPath();ctx.ellipse(0,0,13*scale,3.4*scale,0,0,Math.PI*2);ctx.fill();
    if (drawGeneratedCreature(ctx, kind, time, scale, dir, moving)) { ctx.restore(); return; }
    ctx.restore();
  }
  if (typeof document === "undefined") { drawCreature(ctx,kind,accent,time,scale,dir,false,moving); return; }
  const S = 80, OX = 40, OY = 64;
  const tick=artTick(time,100)%creatureFrameCount(kind,moving), poseTime=tick*100;
  const sprite=spritePose(`creature:${kind}:${accent}:${dir}:${moving}:${tick}`,S,S,a=>{
    a.translate(OX,OY);drawCreature(a,kind,accent,poseTime,1,dir,true,moving);
  },'stone');
  ctx.save();ctx.fillStyle='rgba(2,4,10,0.32)';ctx.beginPath();
  ctx.ellipse(0,0,(kind==='boss'?22:13)*scale,(kind==='boss'?5:3.4)*scale,0,0,Math.PI*2);ctx.fill();
  ctx.imageSmoothingEnabled=false;ctx.scale(scale,scale);ctx.drawImage(sprite,-OX,-OY);ctx.restore();
}

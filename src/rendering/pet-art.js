import { drawPetModel } from "./pet-models.js";
import { spritePose } from "./sprite-cache.js";
import { artTime, artTick } from "./art-style.js";
// Desenho dos bichos companheiros, um por espécie. Usado na superfície, na
// caverna (trilha atrás do jogador) e na praça onde o bicho é domado.
// Cada bicho tem silhueta e cor próprias para o jogador reconhecer quem o
// acompanha sem abrir a ficha.
export const PET_COLORS = {
  cat: { body: "#6b5b73", light: "#8a7893", eye: "#ffc857" },
  owl: { body: "#8a6a45", light: "#b08a5c", eye: "#ffe9b0" },
  frog: { body: "#4e8a4a", light: "#6faf5f", eye: "#f7f0b0" },
  wisp: { body: "#c9a227", light: "#ffe9a0", eye: "#fff3c4" },
  cricket: { body: "#3f6b3a", light: "#5d8f4e", eye: "#ffe9b0" },
  shade: { body: "#3b2d55", light: "#57417c", eye: "#b48cff" },
  parrot: { body: "#4f9a4a", light: "#7ec96a", eye: "#ffe9b0" },
};

// O bicho pequeno do jogador com o mesmo acabamento dos monstros: contorno de
// um pixel e luz comum. Cada pose vem da anatomia direcional da espécie.
export function drawPetSprite(ctx, kind, x, y, t = 0, moving = false, dir = 0) {
  if (typeof document === "undefined") return desenharPet(ctx,kind,x,y,t,moving,dir);
  const tick=artTick(t,100)%(moving?8:32);
  const pose=spritePose(`pet:${kind}:${moving}:${dir}:${tick}`,56,56,g=>{
    g.translate(28,40);desenharPet(g,kind,0,0,tick*100,moving,dir,true);
  },'cloth');
  ctx.save();ctx.fillStyle='rgba(2,4,10,0.3)';ctx.beginPath();ctx.ellipse(x,y,kind==='frog'?7:5,2,0,0,Math.PI*2);ctx.fill();
  ctx.imageSmoothingEnabled=false;ctx.drawImage(pose,x-28,y-40);ctx.restore();
}

function desenharPet(ctx, kind, x, y, t = 0, moving = false, dir = 0, semSombra = false) {
  ctx.save();ctx.translate(x,y);
  if(!semSombra){ctx.fillStyle='rgba(2,4,10,0.3)';ctx.beginPath();ctx.ellipse(0,0,kind==='frog'?7:5,2,0,0,Math.PI*2);ctx.fill();}
  drawPetModel(ctx,kind,PET_COLORS[kind]||PET_COLORS.cat,artTime(t),moving,dir);ctx.restore();
}

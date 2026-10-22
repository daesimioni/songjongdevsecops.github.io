// Caixas no plano do chão, em tiles. Bordas apenas encostadas não se sobrepõem.
export function validBody(x, y, w, h) {
  return [x,y,w,h].every(Number.isFinite) && w > 0 && h > 0;
}
export function boxesOverlap(a, b) {
  return Math.abs(a.x-b.x) < a.hw+b.hw && Math.abs(a.y-b.y) < a.hh+b.hh;
}
export function touchesSolidTiles(x, y, w, h, solid) {
  if (!validBody(x,y,w,h)) return true;
  const left=Math.floor(x-w/2), right=Math.ceil(x+w/2)-1;
  const top=Math.floor(y-h/2), bottom=Math.ceil(y+h/2)-1;
  for(let ty=top;ty<=bottom;ty++)for(let tx=left;tx<=right;tx++)if(solid(tx,ty))return true;
  return false;
}
// Retângulos locais [esquerda, cima, direita, baixo], relativos ao pé do sprite.
export function projectCollisionBoxes(rects, x, y, scale = 1, mirrored = false) {
  return rects.map(([left,top,right,bottom])=>({
    x:x+(left+right)/2*scale*(mirrored?-1:1), y:y+(top+bottom)/2*scale,
    hw:(right-left)/2*scale, hh:(bottom-top)/2*scale,
  }));
}

export function segmentFree(from,to,canOccupy){
  const distance=Math.hypot(to.x-from.x,to.y-from.y);
  if(!Number.isFinite(distance))return false;
  const steps=Math.max(1,Math.ceil(distance/.08));
  for(let i=1;i<=steps;i++)if(!canOccupy(from.x+(to.x-from.x)*i/steps,from.y+(to.y-from.y)*i/steps))return false;
  return true;
}

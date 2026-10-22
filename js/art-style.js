// Direção comum: luz quente à esquerda, sombra fria, textura de meio pixel.
// Acabamento só na criação do sprite, sempre recortado pela silhueta original.
export const ART_STYLE = Object.freeze({ outline:'#080e1c', light:'#fff0c9', shadow:'#142039' });
let motion = true;
export function setArtMotion(enabled) { motion = Boolean(enabled); }
export function artTime(time) { return motion ? Math.max(0, Number(time) || 0) : 0; }
export function artFrame(time, frames = 16, ms = 100, seed = 0) {
  return motion ? (Math.floor(artTime(time) / ms) + Math.abs(Math.trunc(seed))) % frames : 0;
}
export function finishMaterial(g,w,h,material='stone',seed=0) {
  if (typeof g.createLinearGradient !== 'function') return;
  g.save();g.globalCompositeOperation='source-atop';
  const light=g.createLinearGradient(0,0,w,h);
  light.addColorStop(0,'rgba(255,236,190,0.18)');
  light.addColorStop(.46,'rgba(255,236,190,0)');
  light.addColorStop(1,'rgba(12,25,49,0.23)');
  g.fillStyle=light;g.fillRect(0,0,w,h);
  // Textura discreta: os espaços vazios não recebem pixels novos.
  const step=material==='cloth'?3:material==='leaf'?4:5;
  for(let y=2;y<h-1;y+=step)for(let x=2;x<w-1;x+=step){
    const n=(x*31+y*17+seed*13)>>>0;
    if(n%3)continue;
    g.fillStyle=n%2?'rgba(255,241,206,0.13)':'rgba(7,15,32,0.18)';
    g.fillRect(x+(n%3)*.5,y,material==='wood'?2:.5,material==='cloth'?1:.5);
  }
  g.restore();
}
// Relógio sem loop artificial: mantém continuidade ao aquecer poses no LRU.
export function artTick(time,ms=100) { return Math.floor(artTime(time)/ms); }

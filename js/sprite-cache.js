import {criarCache} from './assets/nucleo.js';
import {finishMaterial,ART_STYLE} from './art-style.js';
const cache=criarCache(240,undefined,12*1024*1024);
const scratch=new Map();
function buffers(w,h) {
  const key=`${w}:${h}`;let pair=scratch.get(key);
  if(!pair||pair.busy){
    const raw=document.createElement('canvas'),mask=document.createElement('canvas');
    raw.width=mask.width=w;raw.height=mask.height=h;pair={raw,mask,busy:false};
    if(!scratch.get(key)?.busy){if(scratch.size>=4)scratch.delete(scratch.keys().next().value);scratch.set(key,pair);}
  }
  pair.busy=true;return pair;
}
const NEIGHBORS=[[-1,0],[1,0],[0,-1],[0,1],[-1,-1],[1,-1],[-1,1],[1,1]];
// Contorno e acabamento são compostos uma vez por pose, não por drawImage.
export function spritePose(key,w,h,paint,material='cloth') {
  return cache.pegar(key,w,h,g=>{
    const pair=buffers(w,h),{raw,mask}=pair;
    try {
    const a=raw.getContext('2d');a.setTransform(1,0,0,1,0,0);a.clearRect(0,0,w,h);
    a.save();a.imageSmoothingEnabled=false;try {paint(a);} finally {a.restore();}
    finishMaterial(a,w,h,material,17);
    const b=mask.getContext('2d');b.setTransform(1,0,0,1,0,0);b.clearRect(0,0,w,h);b.globalCompositeOperation='source-over';b.drawImage(raw,0,0);
    b.globalCompositeOperation='source-in';b.fillStyle=ART_STYLE.outline;b.fillRect(0,0,w,h);
    for(const [x,y]of NEIGHBORS)g.drawImage(mask,x,y);
    g.drawImage(raw,0,0);
    } finally {pair.busy=false;}
  });
}
export function spriteCacheStats(){return {...cache.stats,scratchBytes:[...scratch.values()].reduce((n,p)=>n+p.raw.width*p.raw.height*8,0)};}
export function clearSpriteCache(){cache.limpar();scratch.clear();}

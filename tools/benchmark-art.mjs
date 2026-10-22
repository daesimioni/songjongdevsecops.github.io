import {pathToFileURL} from 'node:url';
import {resolve} from 'node:path';
const {createCanvas}=await import(pathToFileURL(process.env.ART_CANVAS_MODULE));
let canvases=0,draws=0;globalThis.document={createElement(){canvases++;return createCanvas(1,1);}};
const root=resolve(process.argv[2]||'.');
const module=path=>import(pathToFileURL(`${root}/src/rendering/${path}`));
const {drawCreatureArt,COSTAS}=await module('creature.js');
const {drawPetSprite,PET_COLORS}=await module('pet-art.js');
const {desenharAsset,cacheDeAssets,GRUPOS}=await module('assets/index.js');
let stats=()=>null;try{stats=(await module('sprite-cache.js')).spriteCacheStats;}catch{}
const canvas=createCanvas(1024,768),g=canvas.getContext('2d'),draw=g.drawImage.bind(g);
g.drawImage=(...args)=>{draws++;return draw(...args);};
const creatures=Object.keys(COSTAS),pets=Object.keys(PET_COLORS),types=Object.values(GRUPOS).flatMap(Object.keys);
const bio={id:'bench',accent:'#61f4c0',floor:'#27283f',path:'#423b57'};
const durations=[];
for(let pass=0;pass<3;pass++){
 const begin=performance.now();
 for(let frame=0;frame<180;frame++){
  const time=frame*1000/60;g.clearRect(0,0,1024,768);
  for(let i=0;i<creatures.length;i++){g.save();g.translate(50+(i%10)*90,75+Math.floor(i/10)*90);drawCreatureArt(g,creatures[i],bio.accent,time,1,i%8);g.restore();}
  for(let i=0;i<pets.length;i++)drawPetSprite(g,pets[i],60+i*100,380,time,true,i%8);
  for(let i=0;i<types.length;i++)desenharAsset(g,types[i],30+(i%14)*70,440+Math.floor(i/14)*100,{tempo:time,bioma:bio,seed:i});
 }
 durations.push(performance.now()-begin);
}
console.log(JSON.stringify({medianMs:durations.sort((a,b)=>a-b)[1],durations,frames:540,draws,canvases,spriteCache:stats(),environmentCache:cacheDeAssets().stats||{tamanho:cacheDeAssets().tamanho}}));

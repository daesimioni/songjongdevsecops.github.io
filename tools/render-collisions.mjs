// ART_CANVAS_MODULE=/.../@napi-rs/canvas/index.js node tools/render-collisions.mjs /tmp/colisoes.png
import {pathToFileURL} from 'node:url';
import {writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
const {createCanvas}=await import(process.env.ART_CANVAS_MODULE ? pathToFileURL(process.env.ART_CANVAS_MODULE).href : '@napi-rs/canvas');
globalThis.document={createElement:()=>createCanvas(1,1)};
const {desenharAsset,GRUPOS}=await import('../src/rendering/assets/index.js');
const {assetColliders}=await import('../src/content/collision-bodies.js');
const {variantIndex}=await import('../src/core/random.js');
const {ASSET_COLLISION}=await import('../src/content/collision-profiles.js');
const kinds=Object.values(GRUPOS).flatMap(Object.keys).filter(k=>ASSET_COLLISION[k].length);
const cellW=180,cellH=142,cv=createCanvas(cellW*3,kinds.length*cellH),g=cv.getContext('2d');
g.fillStyle='#111827';g.fillRect(0,0,cv.width,cv.height);
let boxes=0;const hashes=[];
for(let row=0;row<kinds.length;row++)for(let variant=0;variant<3;variant++){
 const kind=kinds[row];let seed=0;
 const def=Object.values(GRUPOS).find(defs=>kind in defs)[kind];
 while(variantIndex(seed,def.variantes)!==variant%def.variantes)seed+=.17;
 const x=cellW*(variant+.5),y=row*cellH+118;
 g.save();g.translate(x,y);g.scale(1.35,1.35);
 desenharAsset(g,kind,0,0,{tempo:720,seed});
 g.strokeStyle='#ffe474';g.fillStyle='rgba(255,228,116,.25)';g.lineWidth=.6;
 for(const b of assetColliders(kind,0,0,seed)){
  g.fillRect((b.x-b.hw)*16,(b.y-b.hh)*16,b.hw*32,b.hh*32);
  g.strokeRect((b.x-b.hw)*16,(b.y-b.hh)*16,b.hw*32,b.hh*32);boxes++;
 }
 g.strokeStyle='#63d9ed';g.beginPath();g.moveTo(-5,0);g.lineTo(5,0);g.moveTo(0,-3);g.lineTo(0,3);g.stroke();g.restore();
 g.fillStyle='#d6dfed';g.font='11px monospace';g.fillText(`${kind} / ${variant%def.variantes}`,x-cellW/2+10,y+17);
 hashes.push(createHash('sha256').update(g.getImageData(variant*cellW,row*cellH,cellW,cellH).data).digest('hex'));
}
const output=process.argv[2]||'/tmp/colisoes.png';await writeFile(output,cv.toBuffer('image/png'));
console.log(JSON.stringify({kinds:kinds.length,views:kinds.length*3,boxes,distinct:new Set(hashes).size,output}));

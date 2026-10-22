// Prova opcional de pixels reais; mesma dependência temporária do render-art.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const {createCanvas}=await import(pathToFileURL(process.env.ART_CANVAS_MODULE));
globalThis.document={createElement:()=>createCanvas(1,1)};
const {GRUPOS,assetDe}=await import('../js/assets/index.js');
const {paletaDaArea}=await import('../js/assets/nucleo.js');
let renders=0,animated=0;
for(const [group,types]of Object.entries(GRUPOS))for(const id of Object.keys(types)){
 const def=assetDe(id);
 for(let v=0;v<(def.variantes||1);v++)for(const accent of ['#61f4c0','#b48cff','#ffb26b']){
  const hashes=new Set();
  for(let q=0;q<(def.quadros||1);q++){
   const cv=createCanvas((def.w+16)*2,(def.h+16)*2),g=cv.getContext('2d');g.scale(2,2);g.translate(8,8);
   def.desenhar(g,paletaDaArea({id:'check',accent}),v,q);
   const pixels=g.getImageData(0,0,cv.width,cv.height).data;
   assert.ok(pixels.some((n,i)=>i%4===3&&n>0),`${id}/${v}/${q} não pode ser vazio`);
   hashes.add(createHash('sha256').update(pixels).digest('hex'));renders++;
  }
  if(def.quadros){assert.ok(hashes.size>1,`${id}/${v} anuncia animação sem mudar pixels`);animated++;}
 }
}
console.log(JSON.stringify({renders,animatedVariants:animated,types:Object.values(GRUPOS).reduce((n,g)=>n+Object.keys(g).length,0)}));
const {COSTAS,drawCreatureArt}=await import('../js/creature.js');
const {PET_COLORS,drawPetSprite}=await import('../js/pet-art.js');
const {ICONES,desenharIcone}=await import('../js/assets/icones.js');
const {ITEMS}=await import('../js/rpg-data.js');
const {itemIconCanvas}=await import('../js/item-art.js');
let entities=0;
const visible=(paint,id)=>{const cv=createCanvas(180,180),g=cv.getContext('2d');g.translate(90,120);paint(g);assert.ok(g.getImageData(0,0,180,180).data.some((n,i)=>i%4===3&&n>0),`${id}: vazio`);entities++;};
for(const kind of Object.keys(COSTAS))for(let dir=0;dir<8;dir++)visible(g=>drawCreatureArt(g,kind,'#61d5b2',720,1,dir),`${kind}/${dir}`);
for(const kind of Object.keys(PET_COLORS))for(let dir=0;dir<8;dir++)visible(g=>drawPetSprite(g,kind,0,0,720,true,dir),`${kind}/${dir}`);
for(const type of ICONES)visible(g=>desenharIcone(g,{type,x:0,y:0,accent:'#61d5b2',hue:.8},720),type);
for(const [id,item]of Object.entries(ITEMS))visible(g=>g.drawImage(itemIconCanvas({id,...item}),0,0),id);
const {spritePose}=await import('../js/sprite-cache.js');
const one=spritePose('probe',32,32,g=>{g.fillStyle='#f00';g.fillRect(6,6,7,8);});
const hash=cv=>createHash('sha256').update(cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data).digest('hex');
const old=hash(one);
for(let i=0;i<300;i++)spritePose(`reuse-${i}`,32,32,g=>{g.fillStyle='#00f';g.fillRect(i%12,2,3,4);});
assert.equal(hash(one),old,'reuso de buffers não altera sprite já emitido');
console.log(JSON.stringify({entities,allRenders:renders+entities}));

import {CREATURE_MODELS} from '../src/rendering/creature-models.js';
// Prova de pixels reais, executada por validate e pela CI.
import assert from 'node:assert/strict';
import {pathToFileURL} from 'node:url';
import {createHash} from 'node:crypto';
const {createCanvas}=await import(process.env.ART_CANVAS_MODULE ? pathToFileURL(process.env.ART_CANVAS_MODULE).href : '@napi-rs/canvas');
globalThis.document={createElement:()=>createCanvas(1,1)};
const {GRUPOS,assetDe}=await import('../src/rendering/assets/index.js');
const {paletaDaArea}=await import('../src/rendering/assets/nucleo.js');
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
const {drawCreatureArt}=await import('../src/rendering/creature.js');
const {PET_COLORS,drawPetSprite}=await import('../src/rendering/pet-art.js');
const {ICONES,desenharIcone}=await import('../src/rendering/assets/icones.js');
const {ITEMS}=await import('../src/content/rpg-data.js');
const {itemIconCanvas}=await import('../src/rendering/item-art.js');
let entities=0;
const visible=(paint,id)=>{const cv=createCanvas(180,180),g=cv.getContext('2d');g.translate(90,120);paint(g);assert.ok(g.getImageData(0,0,180,180).data.some((n,i)=>i%4===3&&n>0),`${id}: vazio`);entities++;};
for(const kind of Object.keys(CREATURE_MODELS))for(let dir=0;dir<8;dir++)visible(g=>drawCreatureArt(g,kind,'#61d5b2',720,1,dir),`${kind}/${dir}`);
for(const kind of Object.keys(PET_COLORS))for(let dir=0;dir<8;dir++)visible(g=>drawPetSprite(g,kind,0,0,720,true,dir),`${kind}/${dir}`);
for(const type of ICONES)visible(g=>desenharIcone(g,{type,x:0,y:0,accent:'#61d5b2',hue:.8},720),type);
for(const [id,item]of Object.entries(ITEMS))visible(g=>g.drawImage(itemIconCanvas({id,...item}),0,0),id);
const {spritePose}=await import('../src/rendering/sprite-cache.js');
const one=spritePose('probe',32,32,g=>{g.fillStyle='#f00';g.fillRect(6,6,7,8);});
const hash=cv=>createHash('sha256').update(cv.getContext('2d').getImageData(0,0,cv.width,cv.height).data).digest('hex');
const old=hash(one);
for(let i=0;i<300;i++)spritePose(`reuse-${i}`,32,32,g=>{g.fillStyle='#00f';g.fillRect(i%12,2,3,4);});
assert.equal(hash(one),old,'reuso de buffers não altera sprite já emitido');
console.log(JSON.stringify({entities,allRenders:renders+entities}));
// A direção deve mudar pixels mesmo no mesmo quadro, sem depender do tempo.
const {drawHuman}=await import('../src/rendering/human.js');
const {drawSkiff}=await import('../src/rendering/skiff.js');
const directional=[...Object.keys(CREATURE_MODELS).map(k=>[k,(g,d)=>drawCreatureArt(g,k,'#61d5b2',720,1,d)]),...Object.keys(PET_COLORS).map(k=>['pet:'+k,(g,d)=>drawPetSprite(g,k,0,0,720,true,d)]),['human',(g,d)=>drawHuman(g,0,0,d,true,720,{skin:'#d9b08c',hair:'#584252',shirt:'#4e9b89',pants:'#403d5c'})],['skiff',(g,d)=>drawSkiff(g,0,0,d,720,1,true)]];
for(const [id,paint]of directional){
 const views=Array.from({length:8},(_,d)=>{const cv=createCanvas(180,180),g=cv.getContext('2d');g.translate(90,120);paint(g,d);return hash(cv);});
 assert.equal(new Set(views).size,8,`${id}: vistas duplicadas`);
}
console.log(JSON.stringify({directionalFamilies:directional.length,directionalViews:directional.length*8}));
// As poses devem caber na área útil, inclusive chifres, antenas e garras.
const {drawCreature}=await import('../src/rendering/creature.js');
let poses=0;
for(const kind of Object.keys(CREATURE_MODELS))for(let dir=0;dir<8;dir++)for(let tick=0;tick<32;tick++){
 const cv=createCanvas(80,80),g=cv.getContext('2d');g.translate(40,64);
 drawCreature(g,kind,'#61d5b2',tick*100,1,dir,true,true);
 const p=g.getImageData(0,0,80,80).data;
 for(let i=0;i<80;i++)assert.ok(!p[(i*80)*4+3]&&!p[(i*80+79)*4+3]&&!p[i*4+3]&&!p[(79*80+i)*4+3],`${kind}/${dir}/${tick}: pose cortada`);
 poses++;
}
const {setArtMotion}=await import('../src/rendering/art-style.js');
for(const kind of Object.keys(CREATURE_MODELS)){
 const captures=[];setArtMotion(false);
 for(const time of [100,9100]){const cv=createCanvas(180,180),g=cv.getContext('2d');g.translate(90,120);drawCreatureArt(g,kind,'#61d5b2',time,1,5,true);captures.push(hash(cv));}
 assert.equal(captures[0],captures[1],`${kind}: redução de movimento instável`);setArtMotion(true);
}
const {fixtures}=await import('./art-fixtures.mjs');
for(const fixture of fixtures)for(const t of [0,700,1600])visible(g=>fixture.draw(g,t),fixture.id);
const {HAIRS,GENDERS}=await import('../src/content/avatar.js');
const {OUTFITS}=await import('../src/content/outfits.js');
let avatars=0;
for(const outfit of OUTFITS)for(const hair of HAIRS)for(const gender of GENDERS)for(let dir=0;dir<8;dir++){
 const cv=createCanvas(80,80),g=cv.getContext('2d');g.translate(40,64);
 drawHuman(g,0,0,dir,true,720,outfit.colors,1,{hair:hair.id,gender:gender.id});
 assert.ok(g.getImageData(20,20,40,48).data.some((n,i)=>i%4===3&&n),`${outfit.id}/${hair.id}/${gender.id}/${dir}: vazio`);avatars++;
}
console.log(JSON.stringify({clippedPosesChecked:poses,fixtureStates:fixtures.length*3,avatarCombinations:avatars,allRenders:renders+entities+poses+avatars}));
const {drawCaveFacade}=await import('../src/rendering/cave-art.js');
let caves=0;
for(const material of ['giz','ferro','vidro','fibra','outro'])for(const entrada of [true,false])for(const seed of [.1,.5,.9])for(const time of [0,700,1600,2400]){
 visible(g=>drawCaveFacade(g,{px:0,py:0,material,entrada,seed,time,pedra:'#788895',meio:'#425365',fundo:'#192333',acento:'#83b89e'}),material);caves++;
}
const {TILE_STYLE}=await import('../src/content/identity.js');
const {createTerrainRenderer}=await import('../src/rendering/terrain-renderer.js');
const {windMood}=await import('../src/rendering/wind.js');
const {TILE_KIND:K}=await import('../src/core/runtime-config.js');
let terrains=0;
for(const key of [...new Set([...Object.keys(TILE_STYLE).map(Number),...Object.values(K)])])for(const time of [0,700,1600,2400]){
 const t=Number(key);
 visible(g=>{const ground=createTerrainRenderer({ctx:g,world:{get:()=>t,areaAt:()=>null},getWindMood:()=>windMood(null)});ground.drawGroundOn(g,0,0,t,time,false);ground.drawGroundOn(g,0,0,t,time,true);ground.groundGrain(g,0,0,t);if(t===K.TREE)ground.drawTree(0,0,time);if(t===K.WALL)ground.drawWall(0,0);},`terreno/${key}`);terrains++;
}
console.log(JSON.stringify({caveStates:caves,terrainStates:terrains,totalRenders:renders+entities+poses+avatars}));
// Núcleo cúbico precisa das paredes laterais; tampa e satélites sozinhos
// passavam na prova de sprite não vazio, mas deixavam o corpo desaparecer.
for(const dir of [1,2]){
 const cv=createCanvas(80,80),g=cv.getContext('2d');g.translate(40,64);
 drawCreature(g,'node','#61d5b2',700,1,dir,true,false);
 const center=g.getImageData(37,46,6,9).data;
 assert.ok(center.filter((value,i)=>i%4===3&&value>0).length>=40,`node/${dir}: parede lateral ausente`);
}
let equipmentViews=0;
const wearableSlots=['weapon','armor','legs','boots','helmet','shield','cloak'];
for(const item of Object.values(ITEMS).filter(item=>wearableSlots.includes(item.slot)))for(let dir=0;dir<8;dir++){
 visible(g=>drawHuman(g,0,0,dir,true,720,{skin:'#d9b08c',hair:'#584252',shirt:'#4e9b89',pants:'#403d5c'},1,{hair:'curto'},{[item.slot]:item}),item.id);equipmentViews++;
}
for(const dir of [3,6,7]){
 const cv=createCanvas(80,80),g=cv.getContext('2d');g.translate(40,64);
 drawHuman(g,0,0,dir,false,1000,{skin:'#d9b08c',hair:'#584252',shirt:'#4e9b89',pants:'#403d5c'},1,{hair:'curto'},{cloak:{accent:'#bd8871'}});
 const pixels=g.getImageData(38,54,4,4).data;
 assert.ok(pixels.some((n,i)=>i%4===0&&n===189&&pixels[i+1]===136&&pixels[i+2]===113),`capa/${dir}: dorso coberto pelo tronco`);
}
console.log(JSON.stringify({equipmentViews,totalRenders:renders+entities+poses+avatars}));

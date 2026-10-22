import assert from 'node:assert/strict';
import {criarCache,paletaDaArea} from '../src/rendering/assets/nucleo.js';
import {artFrame,setArtMotion} from '../src/rendering/art-style.js';
import {spritePose,clearSpriteCache,spriteCacheStats} from '../src/rendering/sprite-cache.js';
let created=0,outputDraws=0;
const context=()=>new Proxy({imageSmoothingEnabled:false,drawImage(){outputDraws++;},createLinearGradient(){return {addColorStop(){}};}},{get:(o,k)=>k in o?o[k]:()=>{},set:(o,k,v)=>(o[k]=v,true)});
const factory=()=>{created++;return {width:0,height:0,getContext:()=>context()};};
globalThis.document={createElement:factory};
let paints=0;
const c=criarCache(100,factory,800);
c.pegar('a',10,10,()=>{});c.pegar('b',10,10,()=>{});c.pegar('a',10,10,()=>{});c.pegar('c',10,10,()=>{});
assert.equal(c.stats.bytes,800);assert.equal(c.tem('b'),false,'pressão por bytes respeita LRU');
assert.equal(c.tem('a'),true);assert.equal(c.stats.acertos,1);
c.pegar('oversized',20,20,()=>{});assert.equal(c.tem('oversized'),false);assert.equal(c.stats.bytes,800);
criarCache(0,factory).pegar('zero',10,10,()=>{});
assert.notEqual(paletaDaArea({id:'mesma',accent:'#000000'}).chave,paletaDaArea({id:'mesma',accent:'#ffffff'}).chave,'troca de paleta não reaproveita sprite antigo');
clearSpriteCache();
const first=spritePose('pose',32,32,()=>{paints++;});
for(let i=0;i<100;i++)assert.equal(spritePose('pose',32,32,()=>{paints++;}),first);
assert.equal(paints,1);assert.equal(spriteCacheStats().acertos,100);
const initial=created;
for(let i=0;i<20;i++)spritePose(`new-${i}`,32,32,()=>{});
assert.equal(created-initial,20,'buffers temporários são reaproveitados: somente saída nasce por pose');
assert.ok(spriteCacheStats().bytes<=spriteCacheStats().maxBytes);
setArtMotion(false);assert.equal(artFrame(9000,8,100,3),0);assert.equal(artFrame(250,8,100,3),0);
setArtMotion(true);assert.notEqual(artFrame(0,8,100,0),artFrame(0,8,100,1),'instâncias têm fase própria');

const {desenharAsset,assetDe,tamanhoDoAsset}=await import('../src/rendering/assets/index.js');
const calls=[],dest=context();dest.drawImage=(...args)=>calls.push(args);
desenharAsset(dest,'casa',300,200,{bioma:{id:'ancora',accent:'#61f4c0'},seed:3});
const house=assetDe('casa'),e=house.escala||1,pad=8*e,last=calls.at(-1);
assert.deepEqual(last.slice(1),[Math.round(300-house.w*e/2)-pad,Math.round(200-house.h*e)-pad,house.w*e+pad*2,house.h*e+pad*2],'margem não desloca casa nem escala o corpo');
assert.deepEqual(tamanhoDoAsset('casa'),{w:house.w*e,h:house.h*e},'ocupação usada pelo mundo não cresce com margem');
// Uma passada inteira com todos os móveis precisa caber no cache. Depois do
// aquecimento não se alocam novas telas ao repetir o mesmo ciclo.
const {drawCreatureArt}=await import('../src/rendering/creature.js');
const {CREATURE_MODELS}=await import('../src/rendering/creature-models.js');
const {drawPetSprite,PET_COLORS}=await import('../src/rendering/pet-art.js');
clearSpriteCache();const target=context();
const cycle=()=>{for(let frame=0;frame<32;frame++){
 for(const kind of Object.keys(CREATURE_MODELS))drawCreatureArt(target,kind,'#61d5b2',frame*100,1,5,true);
 for(const kind of Object.keys(PET_COLORS))drawPetSprite(target,kind,0,0,frame*100,true,5);
}};
cycle();const warm=spriteCacheStats();cycle();
assert.equal(spriteCacheStats().faltas,warm.faltas,'ciclo aquecido não deve refazer sprites');
assert.ok(spriteCacheStats().bytes<=spriteCacheStats().maxBytes);

import {ASSET_META} from "../src/content/asset-meta.js";
import assert from 'node:assert/strict';
import {boxesOverlap,touchesSolidTiles} from '../src/core/collision.js';
import {assetColliders,GRUPOS} from '../src/rendering/assets/index.js';
import {ASSET_COLLISION,DUNGEON_COLLISION} from '../src/content/collision-profiles.js';
import {dungeonPropColliders,stationColliders} from '../src/content/collision-bodies.js';
import {moveWithCollision,directionVector} from '../src/core/movement.js';
import {PLAYER_W,PLAYER_H} from '../src/core/runtime-config.js';
import {boxFree} from '../src/gameplay/dungeon-map.js';
const map={W:3,H:3,grid:Uint8Array.from([0,0,0,0,1,0,0,0,0])};
const solid=(x,y)=>x!==1||y!==1;
assert.equal(touchesSolidTiles(1.5,1.5,1,1,solid),false,'encostar na borda não invade parede');
assert.equal(touchesSolidTiles(1.5000001,1.5,1,1,solid),true,'invasão pequena não pode atravessar a margem');
for(const bad of [NaN,Infinity,-Infinity]){
 assert.equal(touchesSolidTiles(bad,1,.5,.5,solid),true);
 assert.equal(boxFree(map,bad,1.5),false);
}
assert.deepEqual(new Set(Object.values(GRUPOS).flatMap(Object.keys)),new Set(Object.keys(ASSET_COLLISION)));
// Medidas independentes da tabela: a base desenhada do galpão tem 40px × 2.
const warehouse=assetColliders('galpao',20,30.5,0)[0];
assert.equal(warehouse.hw*2,80/16);
assert.equal(warehouse.y+warehouse.hh,30.5,'pé inclui o deslocamento de meio tile da cena');
assert.equal(warehouse.hh*2,32/16);
for(const defs of Object.values(GRUPOS))for(const [kind,def] of Object.entries(defs)){
 assert.equal(def.w,ASSET_META[kind].w);assert.equal(def.h,ASSET_META[kind].h);
 assert.equal(def.variantes||1,ASSET_META[kind].variantes);
 assert.equal(def.escala||1,ASSET_META[kind].escala||1);
}
const tiny=stationColliders({x:0,y:0,minor:true})[0];
const regular=stationColliders({x:0,y:0,minor:false})[0];
assert.ok(tiny.hw<regular.hw,'totens menores não herdam a caixa dos grandes');
for(const kind of Object.keys(DUNGEON_COLLISION)){
 const boxes=dungeonPropColliders({kind,x:20,y:20});
 assert.ok(boxes.every(b=>[b.x,b.y,b.hw,b.hh].every(Number.isFinite)&&b.hw>0&&b.hh>0));
}
const portal=dungeonPropColliders({kind:'portal',x:20,y:20});
assert.equal(portal.length,2);
assert.ok(!portal.some(b=>boxesOverlap({x:20,y:20,hw:PLAYER_W/2,hh:PLAYER_H/2},b)),'vão do portal continua aberto');
let sweeps=0;
for(const [group,defs] of Object.entries(GRUPOS))for(const kind of Object.keys(defs)){
 for(let seed=0;seed<8;seed++)for(const box of assetColliders(kind,20,20,seed)){
  const canOccupy=(x,y)=>!boxesOverlap({x,y,hw:PLAYER_W/2,hh:PLAYER_H/2},box);
  for(let dir=0;dir<8;dir++){
   const v=directionVector(dir),distance=Math.hypot(box.hw,box.hh)+4;
   const p={x:box.x-v.x*distance,y:box.y-v.y*distance,dir};
   moveWithCollision(p,v.x*distance*2,v.y*distance*2,canOccupy,false);
   assert.ok(canOccupy(p.x,p.y),`${group}/${kind}: penetração em direção ${dir}`);
   assert.ok(!canOccupy(p.x+v.x*1e-4,p.y+v.y*1e-4),`${kind}: ficou afastado da superfície`);
   assert.ok((p.x-box.x)*v.x+(p.y-box.y)*v.y<0,`${kind}: atravessou a estrutura`);
   sweeps++;
  }
 }
}
console.log(`ok perfis: escala, âncora, vão, precisão e ${sweeps} varreduras em oito direções`);

import assert from 'node:assert/strict';
import {houseTargets,nextResidentLine} from '../js/house-interactions.js';
import {createWorld} from '../js/world.js';
import {findInteractionPath,tileWalkable} from '../js/path.js';
import {advancePath} from '../js/movement.js';
import {PLAYER_W,PLAYER_H,MAP_W,MAP_H} from '../js/config.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};
const world=createWorld(),used=new Set();let visits=0;
for(const house of world.casas) {
 const room=world.prepararInterior(house);used.add(room);const targets=houseTargets(room,world.interiorProps);
 assert.equal(targets.length,4,`${house.id} tem quatro alvos inclusive morador`);
 const resident=targets.find(t=>t.kind==='morador');
 assert.equal(world.boxCollides(resident.obj.x,resident.obj.y,PLAYER_W,PLAYER_H),false,`${house.id}: morador fora de sólidos`);
 for(const target of targets) {
  const path=findInteractionPath(MAP_W,MAP_H,(x,y,pad)=>tileWalkable(world,x,y,pad),room.spawn,target.obj,{radius:target.radius});
  assert.ok(path?.length,`${house.id}: caminho para ${target.kind}`);
  const p={...room.spawn},result=advancePath(p,path.slice(),100,(x,y)=>!world.boxCollides(x,y,PLAYER_W,PLAYER_H));
  assert.equal(result.blocked,false,`${house.id}: caminhada para ${target.kind}`);
  assert.ok(Math.hypot(p.x-target.obj.x,p.y-target.obj.y)<=target.radius+1e-6);
  visits++;
 }
}
assert.equal(used.size,8);assert.equal(visits,288);
const house={},area={name:'Geometria',sub:'formas e medidas'};
const first=nextResidentLine(house,area);
assert.match(first,/Geometria/,'primeira conversa apresenta área');
assert.match(nextResidentLine(house,area),/mesa/);
assert.match(nextResidentLine(house,area),/pedra/);
assert.equal(nextResidentLine(house,area),first);

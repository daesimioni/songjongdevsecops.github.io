import assert from 'node:assert/strict';
globalThis.localStorage={getItem:()=>null,setItem(){}};
const {createWorld}=await import('../src/world/world.js');
const {findInteractionPath,tileWalkable}=await import('../src/core/path.js');
const {MAP_W,MAP_H}=await import('../src/core/runtime-config.js');
const {assetColliders}=await import('../src/rendering/assets/index.js');
const {hash2}=await import('../src/core/random.js');
const {advancePath}=await import('../src/core/movement.js');
const {PLAYER_W,PLAYER_H}=await import('../src/content/config.js');
const w=createWorld();
const failures=[];
for(const house of w.casas) {
 const room=w.prepararInterior(house);
 if(w.boxCollides(room.spawn.x,room.spawn.y,PLAYER_W,PLAYER_H)) failures.push(`${house.id}: spawn bloqueado`);
 for(const prop of w.interiorProps.filter(p=>['barril','caixote','saco','fardo','estante','seca','braseiro'].includes(p.tipo))) {
  for(const box of assetColliders(prop.tipo,prop.x,prop.y+.5,hash2(prop.x*3,prop.y*7)))
   if(!w.boxCollides(box.x,box.y,.05,.05))failures.push(`${house.id}: ${prop.tipo} atravessável`);
 }
 for(const [name,target] of [['porta',room.door],['mesa',room.mesa],['fogo',room.lareira]]) {
  const path=findInteractionPath(MAP_W,MAP_H,(x,y,pad)=>tileWalkable(w,x,y,pad),room.spawn,target,{radius:1.7});
  if(path) {
   const position={...room.spawn};
   const result=advancePath(position,path.slice(),100,(x,y)=>!w.boxCollides(x,y,PLAYER_W,PLAYER_H));
   if(result.blocked || !result.finished)failures.push(`${house.id}: caminhada até ${name} trava`);
  }
  if(!path || Math.hypot(path.at(-1).x-target.x,path.at(-1).y-target.y)>1.7) failures.push(`${house.id}: ${name} inacessível`);
 }
}
assert.deepEqual(failures,[]);
console.log(`ok interiores: ${w.casas.length} casas, móveis sólidos, spawn e três acessos`);

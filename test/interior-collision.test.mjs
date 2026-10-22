import assert from 'node:assert/strict';
globalThis.localStorage={getItem:()=>null,setItem(){}};
const {createWorld}=await import('../js/world.js');
const {findPath}=await import('../js/path.js');
const {advancePath}=await import('../js/movement.js');
const {PLAYER_W,PLAYER_H}=await import('../js/config.js');
const w=createWorld();
const failures=[];
for(const house of w.casas) {
 const room=w.prepararInterior(house);
 if(w.boxCollides(room.spawn.x,room.spawn.y,PLAYER_W,PLAYER_H)) failures.push(`${house.id}: spawn bloqueado`);
 for(const prop of w.interiorProps.filter(p=>['barril','caixote','saco','fardo','estante','seca','braseiro'].includes(p.tipo))) {
  if(!w.boxCollides(prop.x,prop.y-.3,PLAYER_W,PLAYER_H)) failures.push(`${house.id}: ${prop.tipo} atravessável`);
 }
 for(const [name,target] of [['porta',room.door],['mesa',room.mesa],['fogo',room.lareira]]) {
  const path=findPath(w,room.spawn,target);
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

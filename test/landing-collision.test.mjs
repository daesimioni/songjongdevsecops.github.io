import assert from 'node:assert/strict';
import {createWorld} from '../src/world/world.js';
import {findLanding} from '../src/core/path.js';
import {PLAYER_W,PLAYER_H} from '../src/core/runtime-config.js';
import {assetColliders} from '../src/content/collision-bodies.js';
import {hash2} from '../src/core/random.js';
const world=createWorld();
for(const stone of world.waystones){
 const landing=findLanding(world,stone);
 assert.ok(landing,`${stone.id}: não há chegada segura`);
 assert.ok(!world.boxCollides(landing.x,landing.y,PLAYER_W,PLAYER_H));
 assert.notDeepEqual(landing,{x:stone.x,y:stone.y},'elevador não pode deixar corpo dentro do marco');
}
const room=world.prepararInterior(world.casas[0]);
const furniture=world.interiorProps.find(p=>p.tipo==='mesa');
const box=assetColliders(furniture.tipo,furniture.x,furniture.y+.5,hash2(furniture.x*3,furniture.y*7))[0];
assert.ok(world.boxCollides(box.x,box.y,.02,.02));
world.limparInterior();
assert.equal(world.interiorProps.length,0);
assert.equal(world.boxCollides(box.x,box.y,.02,.02),false,'não pode sobrar móvel invisível na sala inativa');
assert.ok(!world.boxCollides(room.spawn.x,room.spawn.y,PLAYER_W,PLAYER_H));
assert.equal(findLanding({boxCollides:()=>true},{x:10,y:10}),null);
console.log(`ok chegadas: ${world.waystones.length} faróis, elevador fora da base e limpeza de interiores`);

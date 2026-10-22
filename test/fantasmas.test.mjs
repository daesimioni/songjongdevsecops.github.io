// Cada sólido renderizado precisa ter suas caixas; não basta colidir no centro.
import assert from 'node:assert/strict';
import {createWorld} from '../src/world/world.js';
import {assetColliders,GRUPOS} from '../src/rendering/assets/index.js';
import {hash2} from '../src/core/random.js';
import {ASSET_COLLISION} from '../src/content/collision-profiles.js';
import {PLAYER_W,PLAYER_H} from '../src/core/runtime-config.js';
// Spawn lives in content, not in technical configuration.
import {SPAWN} from '../src/content/config.js';
const w=createWorld();let objects=0,parts=0;
assert.deepEqual(new Set(Object.keys(ASSET_COLLISION)),new Set(Object.values(GRUPOS).flatMap(Object.keys)));
for(const a of w.ambiente){
 const expected=assetColliders(a.tipo,a.x,a.y+.5,hash2(a.x*5,a.y*11));
 const actual=w.props.filter(p=>p.source===a);
 assert.equal(actual.length,expected.length,`${a.tipo}: objeto visível com parte sem colisão`);
 if(expected.length)objects++;
 for(const box of expected){
  parts++;
  for(const dx of [-.9,0,.9])for(const dy of [-.9,0,.9])
   assert.ok(w.boxCollides(box.x+box.hw*dx,box.y+box.hh*dy,.02,.02),`${a.tipo}: falha na extensão da base`);
 }
}
assert.ok(!w.boxCollides(SPAWN.x,SPAWN.y,PLAYER_W,PLAYER_H));
console.log(`ok sólidos visíveis: ${objects} objetos, ${parts} partes e política explícita dos 41 assets`);

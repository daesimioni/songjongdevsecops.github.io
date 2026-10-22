import assert from 'node:assert/strict';
import { advancePath, moveWithCollision, directionVector, directionAngle } from '../src/core/movement.js';
const free = x => x < .8 || x > 1.2;
for (const speed of [.2, 1, 20]) {
  const p = {x:.5, y:.5};
  const path = [{x:1.5,y:.5}];
  for (let i=0;i<10 && p.x < .79;i++) advancePath(p,path,speed,free);
  assert.ok(p.x < .8, 'rota nunca pula parede intermediária, nem em turbo');
}
const p={x:0,y:0};
const route=[{x:0,y:0},{x:1,y:0},{x:1,y:1}];
assert.equal(advancePath(p,route,1.2,()=>true).blocked,false);
assert.ok(Math.abs(p.x-1)<1e-8 && Math.abs(p.y-.2)<1e-8, 'distância respeitada na quina');
assert.equal(route.length,1);
advancePath(p,route,.8,()=>true);
assert.equal(route.length,0);
assert.equal(p.dir,0);
const still={x:.5,y:.5};
const blocked=advancePath(still,[{x:1.5,y:1.5}],2,(x,y)=>x<.8 || y<.8);
assert.ok(blocked.blocked && still.x < .8, 'rota diagonal não desliza para fora do caminho');
const manual={x:.5,y:.5};
moveWithCollision(manual,10,1,x=>x<.8);
assert.ok(manual.x<.8 && manual.y>1.4, 'teclado respeita parede e desliza no eixo livre');
for(let d=0;d<8;d++) {
 const v=directionVector(d), a=directionAngle(d);
 assert.ok(Math.abs(Math.hypot(v.x,v.y)-1)<1e-8);
 assert.ok(Math.abs(Math.cos(a)-v.x)<1e-8 && Math.abs(Math.sin(a)-v.y)<1e-8, 'cone desenhado e visão concordam');
}
console.log('ok movimento: varredura, turbo, diagonais, orçamento de distância e oito direções');

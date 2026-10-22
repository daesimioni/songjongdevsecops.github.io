import assert from 'node:assert/strict';
import { DIRECTIONS, directionVector, facingDirection, moveWithCollision } from '../js/movement.js';
import { skiffRear } from '../js/skiff.js';
for(let dir=0;dir<8;dir++){
 const [dx,dy]=DIRECTIONS[dir];
 assert.equal(facingDirection(dx,dy),dir);
 const v=directionVector(dir),rear=skiffRear(dir);
 assert.ok(Math.abs(Math.hypot(v.x,v.y)-1)<1e-10);
 assert.ok(Math.abs(v.x*rear.x+v.y*rear.y+1)<1e-10,'popa oposta à proa');
 const p={x:0,y:0,dir:0};moveWithCollision(p,v.x*.5,v.y*.5,()=>true);
 assert.equal(p.dir,dir);assert.ok(Math.abs(Math.hypot(p.x,p.y)-.5)<1e-10);
}
const sliding={x:0,y:0,dir:3};
moveWithCollision(sliding,.4,.4,(x)=>x===0);
assert.equal(sliding.dir,0,'deslizar para baixo não deve manter diagonal solicitada');
moveWithCollision(sliding,-.4,-.4,()=>false);
assert.equal(sliding.dir,0,'bloqueio completo conserva orientação');
console.log('ok oito direções: velocidade normalizada, popa oposta, colisão e orientação real');

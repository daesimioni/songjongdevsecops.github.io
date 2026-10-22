import assert from 'node:assert/strict';
import { dungeonCanSeePlayer } from '../js/dungeon.js';
const map = {W:20,H:20,grid:new Uint8Array(400).fill(1)};
const directions = [[0,1],[-1,0],[1,0],[0,-1],[-1,1],[1,1],[-1,-1],[1,-1]];
for (let dir=0;dir<8;dir++) {
  const [dx,dy]=directions[dir];
  const monster={alive:true,x:10.5,y:10.5,dir,vision:6,fov:.7};
  assert.equal(dungeonCanSeePlayer(map,monster,{x:10.5+dx*2,y:10.5+dy*2}),true,`frente ${dir}`);
  assert.equal(dungeonCanSeePlayer(map,monster,{x:10.5-dx*2,y:10.5-dy*2}),false,`costas ${dir}`);
}
map.grid[11*20+11]=0;
assert.equal(dungeonCanSeePlayer(map,{alive:true,x:10.5,y:10.5,dir:5,vision:6},{x:12.5,y:12.5}),false,'parede bloqueia diagonal');
console.log('ok visão: cone normalizado em oito direções, costas e parede');

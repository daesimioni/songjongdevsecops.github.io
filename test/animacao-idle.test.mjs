import assert from 'node:assert/strict';
import fs from 'node:fs';
import {drawPetSprite,PET_COLORS} from '../src/rendering/pet-art.js';
import {actorView,gait} from '../src/rendering/actor-volume.js';
import {setArtMotion} from '../src/rendering/art-style.js';
const human=fs.readFileSync(new URL('../src/rendering/human.js',import.meta.url),'utf8');
assert.match(human,/const olhar = moving \? 0 : Math\.round\(Math\.sin/,'NPC deve olhar parado');
assert.match(human,/const cabeceio = !moving/,'NPC deve cabecear parado');
assert.match(human,/ctx\.translate\(\(diag \? ladoDiag \* 2 : ladoDiag\) \+ olhar, cabeceio\)/,'gesto deve chegar à cabeça');
function draw(kind,t,moving=false,dir=0){
  const ops=[];let color;
  const ctx={save(){},restore(){},translate(){},scale(){},beginPath(){},
    set fillStyle(c){color=c;},set strokeStyle(c){color=c;},
    fillRect(...p){ops.push(['pixel',color,...p]);},
    ellipse(...p){ops.push(['ellipse',color,...p]);},arc(...p){ops.push(['arc',color,...p]);},
    moveTo(...p){ops.push(['move',...p]);},lineTo(...p){ops.push(['line',...p]);},
    fill(){ops.push(['fill',color]);},stroke(){ops.push(['stroke',color]);},
  };
  drawPetSprite(ctx,kind,0,0,t,moving,dir);return ops;
}
for(const kind of Object.keys(PET_COLORS))for(let dir=0;dir<8;dir++){
  const idle=draw(kind,1000,false,dir),later=draw(kind,2200,false,dir);
  assert.ok(idle.some(o=>o[0]==='pixel'),`${kind}/${dir}: vazio`);
  assert.notDeepEqual(idle,later,`${kind}/${dir}: parado sem animação`);
  assert.notDeepEqual(draw(kind,100,true,dir),draw(kind,250,true,dir),`${kind}/${dir}: passo congelado`);
  setArtMotion(false);
  assert.deepEqual(draw(kind,100,false,dir),draw(kind,7200,false,dir),`${kind}/${dir}: ignora redução de movimento`);
  setArtMotion(true);
}
const eyes=ops=>ops.filter(o=>o[0]==='pixel'&&o[1]===PET_COLORS.cat.eye).length;
assert.ok(eyes(draw('cat',3000))>eyes(draw('cat',0)),'gato fecha os olhos ao piscar');
assert.equal(eyes(draw('cat',3000,false,3)),0,'nuca não mostra olhos');
assert.equal(eyes(draw('cat',3000,false,2)),1,'perfil mostra um olho');
assert.equal(eyes(draw('cat',3000,false,5)),2,'três quartos mostra os dois olhos');
const a=gait(100),b=gait(250);
assert.ok(a.step*b.step<0,'apoio alterna a fase');
assert.equal(gait(100,false).step,0,'parado não caminha');
for(let dir=0;dir<8;dir++){
  const view=actorView(dir),near=view.project(0,3),far=view.project(0,-3);
  assert.ok((near.x-far.x)*view.forward.x+(near.y-far.y)*view.forward.y>0,'avanço segue o rumo');
  const low=view.project(3,4,0),high=view.project(3,4,5);
  assert.equal(low.x,high.x,'altura não inclina com a direção');assert.equal(low.y-high.y,5);
}
console.log('ok animação: sete espécies paradas/em movimento nas oito vistas, apoio, piscada, oclusão e redução de movimento');

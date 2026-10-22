import assert from 'node:assert/strict';
import {RPG} from '../src/gameplay/rpg.js';
import {GROUNDS} from '../src/content/rpg-data.js';
import {HABILIDADES,danoDoJogador} from '../src/gameplay/chefe-habilidades.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};
const ground=GROUNDS.find(g=>g.id==='cs');
const make=id=>{const r=new RPG();r.data.levers[ground.id]=true;r.startDuel(ground.boss,ground,true);r.duel.habilidade=HABILIDADES.find(h=>h.id===id);r.duel.bossPhase=2;r.duel.monsterHp=8;r.duel.monsterHpMax=20;return r;};
for(const id of ['couraca','seiva','impeto','espelho']) {
  const r=make(id),d=r.duel;
  const predicted=r.erroPrevisto();const hp=r.hp();
  r.answer((d.question.answer+1)%d.question.options.length);
  assert.equal(hp-r.hp(),predicted,`previsão e dano real coincidem em ${id}`);
}
for(const protect of ['shield','pet']) {
  const r=make('espelho'),d=r.duel;
  if(protect==='shield')d.shield=true;
  else {r.data.sub='domador';r.data.pets.gato={bond:3};r.data.petActive='gato';}
  r.answer((d.question.answer+1)%d.question.options.length);
  assert.equal(d.espelhoUsado,true);
  if(protect==='shield')assert.equal(d.shield,true,'espelho do chefe não gasta também runa de proteção');
  else assert.equal(Boolean(d.petUsado),false,'espelho não gasta também proteção do domador');
}
const r=make('couraca');r.addItem('runa-trovao');const before=r.duel.monsterHp;
r.castSpell('runa-trovao');
assert.equal(before-r.duel.monsterHp,1,'couraça também reduz o golpe de trovão');
assert.equal(danoDoJogador('couraca',2,0),0,'couraça nunca transforma golpe sem dano em dano positivo');

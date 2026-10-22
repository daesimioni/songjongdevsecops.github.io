import assert from 'node:assert/strict';
import {RPG} from '../js/rpg.js';
import {ITEMS} from '../js/rpg-data.js';
globalThis.localStorage={getItem:()=>null,setItem(){}};
for(const [id,item] of Object.entries(ITEMS).filter(([,item])=>item.heal||item.mana||item.buff)) {
  const rpg=new RPG();rpg.data.hp=1;rpg.data.mana=0;rpg.data.manaAt=Date.now();rpg.addItem(id,1);
  const result=rpg.useItem(id);
  assert.equal(result.ok,true,`${id} deve aceitar o uso anunciado no inventário`);
  assert.equal(rpg.itemCount(id),0);
  assert.ok(result.healed||result.mana||result.buff);
}
const rpg=new RPG();rpg.addItem('peixe-raro',2);
rpg.data.hp=rpg.hpMax();rpg.data.mana=rpg.manaMax();
assert.equal(rpg.useItem('peixe-raro').ok,false,'comida mista com vida e mana cheias não é desperdiçada');
assert.equal(rpg.itemCount('peixe-raro'),2);
rpg.data.mana=0;
assert.equal(rpg.useItem('peixe-raro').mana,6,'vida cheia não impede recuperar mana');
rpg.data.hp=1;rpg.data.mana=rpg.manaMax();
assert.equal(rpg.useItem('peixe-raro').healed,24,'mana cheia não impede recuperar vida');

for(const id of [null,undefined,1])assert.equal(rpg.useItem(id).ok,false);

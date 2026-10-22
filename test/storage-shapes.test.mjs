import assert from 'node:assert/strict';
import {readSavedJSON} from '../js/storage.js';
let raw;
globalThis.localStorage = {getItem:()=>raw};
for (const value of [null, [], true, 4, 'texto']) {
  raw = JSON.stringify(value);
  assert.deepEqual(readSavedJSON('npc',{}),{}, 'memória e primeiros passos sempre são registros');
}
for (const value of [null, {}, false, '12', -1, 1e309]) {
  raw = JSON.stringify(value);
  assert.equal(readSavedJSON('xp',0),0,'XP inválido não produz nível negativo/infinito');
}
raw = '12'; assert.equal(readSavedJSON('xp',0),12);
raw = '{"guia":2}'; assert.deepEqual(readSavedJSON('npc',{}),{guia:2});
raw = '123'; assert.equal(readSavedJSON('name',''),'');
raw = 'null'; assert.deepEqual(readSavedJSON('cards',[]),[]);
raw = '{quebrado'; assert.equal(readSavedJSON('name',''),'');

const {STORAGE} = await import('../js/config.js');
const {Quests,QUESTS} = await import('../js/quests.js');
raw = '{"accepted":[],"done":[],"quiz":[],"stats":[]}';
let saved;
globalThis.localStorage = {getItem:k=>k===STORAGE.quests?raw:null,setItem:(k,v)=>{saved=v;}};
const quests = new Quests();
quests.accept(QUESTS[0].id);
quests.save();
assert.ok(Number.isFinite(JSON.parse(saved).accepted[QUESTS[0].id]), 'missão aceita continua serializável após save com listas no lugar de registros');

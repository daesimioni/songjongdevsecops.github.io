import assert from 'node:assert/strict';
import {makeDocument} from './ui-dom.mjs';
import {createSocial} from '../js/social.js';
const {document}=makeDocument(['rede-body']);document.querySelectorAll=()=>[];globalThis.document=document;
const people=new Map(),queue=[];
const make=id=>{
  const social=createSocial({rede:{presenceList:()=>[]},player:{name:id},toast(){},audio:{},getPeers:()=>[],getNet:()=>({id,sendParty:msg=>{queue.push({from:{id,name:id},msg:structuredClone(msg)});return true;}})});
  people.set(id,social);return social;
};
const drain=()=>{let limit=100;while(queue.length){assert.ok(limit-->0,'protocolo não cria loop');const {from,msg}=queue.shift();assert.ok(msg.to,'mensagem tem destinatário');people.get(msg.to)?.partyEvent(from,msg);}};
const a=make('a'),b=make('b'),c=make('c');
a.inviteParty({id:'b'});drain();b.acceptParty();drain();
assert.deepEqual(b.party.members.map(m=>m.id),['a','b']);
a.inviteParty({id:'c'});drain();c.acceptParty();drain();
assert.deepEqual(a.party.members.map(m=>m.id),['a','b','c']);
assert.deepEqual(b.party.members.map(m=>m.id),['a','b','c'],'membro antigo recebe nova composição');
assert.deepEqual(c.party.members.map(m=>m.id),['a','b','c']);
const party=a.party.id;
b.partyEvent({id:'intruso'},{act:'sync',party,leader:'intruso',members:[]});
assert.equal(b.party.members.length,3,'apenas líder pode sincronizar grupo');
a.partyEvent({id:'intruso'},{act:'accept',party});
assert.equal(a.party.members.length,3,'aceite sem convite não insere intruso');
b.partyEvent({id:'a'},{act:'leave',party:'outra-party'});
assert.ok(b.party,'saída de outra party não dissolve grupo atual');
b.leaveParty();drain();
assert.equal(b.party,null);
assert.deepEqual(a.party.members.map(m=>m.id),['a','c']);
assert.deepEqual(c.party.members.map(m=>m.id),['a','c'],'saída atualiza todos');
a.leaveParty();drain();
assert.equal(c.party,null,'saída do líder dissolve grupo nos outros clientes');

const guests=Array.from({length:8},(_,i)=>make(`guest${i}`));
for(let i=0;i<guests.length;i++)a.inviteParty({id:`guest${i}`});
drain();
for(const guest of guests){guest.acceptParty();drain();}
assert.equal(a.party.members.length,8,'aceites concorrentes respeitam capacidade');
assert.equal(guests.at(-1).party,null,'convite aceito após lotação recebe encerramento');
a.leaveParty();drain();

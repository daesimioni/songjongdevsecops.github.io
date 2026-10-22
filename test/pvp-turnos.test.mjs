import assert from 'node:assert/strict';
import { makeDocument } from './ui-dom.mjs';
const {document} = makeDocument(['pvp-title','pvp-sub','pvp-body']);
globalThis.document = document;
const timers = new Map(); let sequence = 0;
const originals = [globalThis.setTimeout,globalThis.clearTimeout,globalThis.setInterval,globalThis.clearInterval];
globalThis.setTimeout = (fn,ms) => { const id = ++sequence; timers.set(id,{fn,ms}); return id; };
globalThis.clearTimeout = id => timers.delete(id);
globalThis.setInterval = globalThis.setTimeout;
globalThis.clearInterval = globalThis.clearTimeout;
const {createPvp} = await import('../src/ui/pvp.js');
const question = {q:'Teste?',options:['A','B','C','D','E'],answer:0,damage:2};
const peer = {id:'other',name:'Outro'};
const pvp = createPvp({rpg:{pvpQuestions:()=>[question]},audio:{chime(){},blip(){}},toast(){},player:{continentId:'cs'},getNet:()=>({id:'me',sendPvp:()=>true})});
try {
  await pvp.challenge(peer);
  pvp.handle(peer,{kind:'accept'});
  const card = document.getElementById('pvp-body').querySelector('.pvp-question');
  card.handlers.click();
  assert.equal(pvp.state.phase,'waiting');
  pvp.handle(peer,{kind:'attack',question,damage:7,nonce:'early'});
  assert.equal(pvp.state.phase,'waiting','ataque não pode substituir pergunta aguardando resposta');
  pvp.handle(peer,{kind:'defend',correct:false,nonce:pvp.state.nonce});
  assert.equal(pvp.state.current,null);
  assert.ok([...timers.values()].some(t=>t.ms===150000));
  pvp.handle(peer,{kind:'attack',question,damage:2,nonce:'next'});
  assert.equal(pvp.state.phase,'defending');
  assert.equal([...timers.values()].some(t=>t.ms===150000),false,'novo ataque cancela prazo da espera anterior');
  assert.ok([...timers.values()].some(t=>t.ms===250),'prazo de defesa continua ativo');
} finally {
  pvp.abort();
  [globalThis.setTimeout,globalThis.clearTimeout,globalThis.setInterval,globalThis.clearInterval] = originals;
}

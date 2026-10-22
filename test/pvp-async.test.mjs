import assert from 'node:assert/strict';
import {makeDocument} from './ui-dom.mjs';
import {createPvp} from '../js/pvp.js';
const {document}=makeDocument(['pvp-title','pvp-sub','pvp-body']);globalThis.document=document;
const sent=[],pending=[];
const peer={id:'outro',pubkey:'key'};
const options={rpg:{pvpQuestions:()=>[]},toast(){},audio:{chime(){},blip(){}},player:{},getNet:()=>({id:'eu',sendPvp:m=>{sent.push(m);return true;}})};
const settle=async()=>{for(let i=0;i<8;i++)await Promise.resolve();};
let pvp=createPvp({...options,signer:()=>new Promise(resolve=>pending.push(resolve))});
try {
  await pvp.challenge(peer); await settle();
  pvp.abort();
  await pvp.challenge(peer); await settle();
  pending[0]({old:true});await settle();
  assert.equal(sent.filter(m=>m.kind==='challenge').length,0,'assinatura de convite cancelado não entra em convite novo para mesma pessoa');
  pending[1]({new:true});await settle();
  assert.equal(sent.filter(m=>m.kind==='challenge').length,1);
} finally {pvp.abort();}
pvp=createPvp({...options,signer:()=>{throw Error('signer indisponível');}});
try {
  assert.equal(await pvp.challenge(peer),true);await settle();
  assert.equal(sent.at(-1).kind,'challenge','falha síncrona de assinatura usa convite sem prova');
} finally {pvp.abort();}
const originalNow=Date.now;
let resolveProof;
pvp=createPvp({...options,verifier:()=>new Promise(r=>{resolveProof=r;})});
try {
  pvp.handle(peer,{kind:'challenge',proof:{pubkey:'key'},proofText:'proof'});await settle();
  document.getElementById('pvp-body').querySelector('.pvp-action').handlers.click();
  pvp.handle(peer,{kind:'attack',question:{q:'Q',options:['A','B'],answer:0},damage:2,nonce:'n'});
  const deadline=pvp.state.deadline;
  Date.now=()=>deadline-10000;
  resolveProof(true);await settle();
  assert.equal(pvp.state.verified,true);
  assert.equal(pvp.state.deadline,deadline,'verificação tardia não reinicia tempo de defesa');
} finally {Date.now=originalNow;pvp.abort();}
let stale;
pvp=createPvp({...options,verifier:()=>new Promise(r=>{stale=r;})});
try {
  pvp.handle(peer,{kind:'challenge',proof:{pubkey:'key'},proofText:'proof'});await settle();
  pvp.abort();pvp.handle(peer,{kind:'challenge'});
  stale(true);await settle();
  assert.equal(pvp.state.verified,false,'identidade não herda verificação de convite anterior');
} finally {pvp.abort();}

let down=0;
pvp=createPvp({...options,onDown:()=>{down++;}});
try {
  await pvp.challenge(peer);
  pvp.handle(peer,{kind:'end',winner:peer.id});
  assert.equal(pvp.state.phase,'challenging','pacote de fim não aplica derrota antes de convite ser aceito');
  assert.equal(down,0);
} finally {pvp.abort();}

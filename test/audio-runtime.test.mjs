import assert from 'node:assert/strict';
import {createAudio} from '../src/platform/audio.js';
globalThis.window = {};
let audio = createAudio();
assert.equal(audio.setEnabled(true),false);
assert.equal(audio.isEnabled(),false,'API ausente não anuncia som ligado');
assert.doesNotThrow(()=>audio.unlock());
assert.equal(audio.startSequencer([[true]],96),null,'sequenciador sem AudioContext não quebra');
window.AudioContext = class {constructor(){throw Error('indisponível');}};
assert.equal(createAudio().setEnabled(true),false);
let starts=0, resumes=0;
const connections=[];
const param = ()=>({value:0,setValueAtTime(){},setTargetAtTime(){},exponentialRampToValueAtTime(){},linearRampToValueAtTime(){}});
const node = ()=>({gain:param(),frequency:param(),detune:param(),Q:param(),connect(target){connections.push(target);return target;},start(){starts++;},stop(){}});
window.AudioContext = class {
  constructor(){this.currentTime=1;this.destination=node();this.state='suspended';}
  createGain(){return node();} createOscillator(){return node();} createBiquadFilter(){return node();}
  resume(){resumes++;return Promise.reject(Error('aguarda gesto'));}
};
const oldSet=globalThis.setInterval,oldClear=globalThis.clearInterval;
let tick=null;
globalThis.setInterval=fn=>{tick=fn;return 1;};globalThis.clearInterval=()=>{tick=null;};
try {
  audio=createAudio();
  assert.equal(audio.setEnabled(true),true);
  await Promise.resolve();
  assert.ok(resumes>0);
  for (const bpm of [0,-1,NaN,Infinity,301]) assert.equal(audio.startSequencer([[true]],bpm),null);
  assert.ok(audio.startSequencer([[true,true,true,true,true,true,true,true]],96));
  audio.ctx.currentTime+=3600;
  const before=starts; tick();
  assert.ok(starts-before<=2,'voltar de aba suspensa não dispara milhares de sons atrasados');
  audio.setEnabled(false);
  const muted=starts;tick();
  assert.equal(starts,muted,'som desligado não agenda notas');
  assert.ok(audio.output,'instrumentos têm saída controlada pelo volume geral');

} finally {audio.stopSequencer();globalThis.setInterval=oldSet;globalThis.clearInterval=oldClear;}

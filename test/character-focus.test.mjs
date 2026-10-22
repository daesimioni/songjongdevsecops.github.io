import assert from 'node:assert/strict';
import {makeDocument} from './ui-dom.mjs';
const {document,Node}=makeDocument([], {canvas:true});globalThis.document=document;
const {renderCharacterEditor}=await import('../src/ui/character.js');
const {AVATAR_DEFAULT}=await import('../src/content/avatar.js');
const mount=new Node();let look={...AVATAR_DEFAULT},outfit='viajante',vocation='guerreiro';
const draw=()=>renderCharacterEditor(mount,{look,colors:{},outfit,vocation,
 outfits:[{id:'viajante',name:'Viajante'},{id:'camiseta',name:'Camiseta'}],
 vocations:[{id:'guerreiro',name:'Guerreiro'},{id:'mago',name:'Mago'}],
 onVocation:id=>{vocation=id;draw();},onOutfit:id=>{outfit=id;draw();},onChange:patch=>{look={...look,...patch};draw();}});
draw();
for(const key of ['gender:m','hair:curto','outfit:camiseta','pele:2','vocation:mago']) {
 const button=mount.querySelectorAll('[data-look-key]').find(n=>n.dataset.lookKey===key);
 assert.ok(button,key);button.focus();button.handlers.click();
 assert.ok(mount.contains(document.activeElement),'foco não fica no botão removido');
 assert.equal(document.activeElement.dataset.lookKey,key);
 assert.equal(document.activeElement.getAttribute('aria-pressed'),'true','escolha atual anunciada');
}
assert.equal(look.gender,'m');assert.equal(look.hair,'curto');assert.equal(look.skin,2);assert.equal(outfit,'camiseta');assert.equal(vocation,'mago');
console.log('ok personagem: foco e seleção ao trocar corpo, cabelo, traje, cor e vocação');

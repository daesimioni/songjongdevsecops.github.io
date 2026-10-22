import assert from 'node:assert/strict';
import {createInstrumentLoader} from '../src/learning/instrument-loader.js';
class Element {
 constructor(){this.children=[];this.text='';}
 set textContent(s){this.children=[];this.text=s;}
 get textContent(){return this.text+this.children.map(c=>c.textContent).join('');}
 appendChild(c){c.parent=this;this.children.push(c);}
 remove(){if(this.parent)this.parent.children=this.parent.children.filter(c=>c!==this);}
}
const doc={createElement:()=>new Element()};
const deferred=()=>{let resolve,reject;const promise=new Promise((r,j)=>{resolve=r;reject=j;});return{promise,resolve,reject};};
const root=new Element(),errors=[];
const controller=createInstrumentLoader({document:doc,onError:e=>errors.push(e)});
// Import antigo não monta após trocar de aula, mesmo ao reabrir o mesmo ID.
let mounted=0, cleaned=0;
const old=deferred();
const a=controller.load(root,()=>old.promise);
await controller.load(root,async()=>({mount:el=>{el.textContent='aula atual';return()=>cleaned++;}}));
old.resolve({mount:()=>mounted++});await a;
assert.equal(mounted,0);assert.equal(root.textContent,'aula atual');
// Erro atrasado não apaga a aula atual nem exibe falha fora de contexto.
const failed=deferred();
const b=controller.load(root,()=>failed.promise);
await controller.load(root,async()=>({mount:el=>{el.textContent='nova aula';}}));
failed.reject(new Error('import antigo'));await b;
assert.equal(root.textContent,'nova aula');assert.equal(errors.length,0);
assert.equal(cleaned,1);
// Montagem assíncrona tem nó isolado e limpa animação ao terminar depois de fechar.
const finish=deferred();let detached;
const c=controller.load(root,async()=>({mount:async el=>{detached=el;await finish.promise;el.textContent='velha';return()=>cleaned++;}}));
await Promise.resolve();
controller.clear();
await controller.load(root,async()=>({mount:el=>{el.textContent='visível';}}));
finish.resolve();await c;
assert.equal(detached.textContent,'velha');assert.equal(root.textContent,'visível');assert.equal(cleaned,2);
controller.clear();assert.equal(root.children.length,0);
console.log('ok instrumentos: import obsoleto, erro atrasado, montagem isolada e limpeza');

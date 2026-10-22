import assert from 'node:assert/strict';
const ctx=new Proxy({}, {get:(o,k)=>o[k]??(k==='createLinearGradient'?()=>({addColorStop(){}}):()=>{}),set:(o,k,v)=>(o[k]=v,true)});
class Element {
 constructor(tag='div'){this.tagName=tag.toUpperCase();this.children=[];this.dataset={};this.style={setProperty(){}};this.className='';this.handlers={};this.classList={add:c=>{this.className+=' '+c;},remove(){}};}
 append(...nodes){this.children.push(...nodes);}
 appendChild(node){this.append(node);}
 set textContent(value){this.children=[];this.text=value;}
 get textContent(){return (this.text||'')+this.children.map(n=>n.textContent).join('');}
 setAttribute(){}
 addEventListener(type,fn){this.handlers[type]=fn;}
 getContext(){return ctx;}
 contains(node){return this===node||this.children.some(c=>c.contains(node));}
 querySelectorAll(selector){return this.children.flatMap(c=>[c,...c.querySelectorAll('*')]).filter(c=>selector==='*'||(selector==='[data-inv-focus]'?!!c.dataset.invFocus:selector==='button'?c.tagName==='BUTTON':selector==='.bag-slot.vazio'?c.className.includes('bag-slot')&&c.className.includes('vazio'):false));}
 querySelector(selector){return this.querySelectorAll(selector)[0]||null;}
 focus(){document.activeElement=this;}
}
const ids=new Map(['inv-detail','inv-equip','inv-grid','inv-count'].map(k=>[k,new Element()]));
globalThis.document={activeElement:null,getElementById:id=>ids.get(id),createElement:tag=>new Element(tag)};
const store=new Map();globalThis.localStorage={getItem:k=>store.get(k)??null,setItem:(k,v)=>store.set(k,String(v))};
const {RPG}=await import('../js/rpg.js');const {createInventoryUI}=await import('../js/inventory-ui.js');
const rpg=new RPG();rpg.addItem('pocao',2);rpg.data.hp=1;
const ui=createInventoryUI({rpg,toast(){},audio:{blip(){}}});ui.open();
let slot=ids.get('inv-grid').querySelectorAll('[data-inv-focus]').find(n=>n.dataset.invFocus==='item:pocao');
slot.focus();slot.handlers.click();
assert.equal(document.activeElement.dataset.invFocus,'item:pocao','seleção mantém foco no item após renderizar');
for(let i=0;i<2;i++) {
 const use=ids.get('inv-detail').querySelectorAll('[data-inv-focus]').find(n=>n.dataset.invFocus==='use:pocao');
 use.focus();use.handlers.click();
 assert.ok([...ids.values()].some(root=>root.contains(document.activeElement)),'ação deixa foco em elemento atual');
 if(i===0)assert.equal(document.activeElement.dataset.invFocus,'use:pocao','consumível restante mantém ação focada');
}
assert.equal(rpg.itemCount('pocao'),0);
assert.ok(ids.get('inv-grid').contains(document.activeElement),'último consumível devolve foco à grade');
console.log('ok mochila: foco preservado na seleção, uso repetido e fim do consumível');

// DOM mínimo para testar controladores; não simula layout nem pixels.
export function makeDocument(ids = [], { canvas = false } = {}) {
  const ctx = new Proxy({}, { get: (o,k) => o[k] ?? (String(k).startsWith('create') ? () => ({addColorStop(){}}) : () => {}), set: (o,k,v) => (o[k]=v,true) });
  const roots = new Map();
  const doc = { activeElement: null };
  class Node {
    constructor(tag='div') { this.tagName=tag.toUpperCase();this.tabIndex=['BUTTON','INPUT','SELECT','TEXTAREA'].includes(this.tagName)?0:-1;this.children=[];this.dataset={};this.attrs={};this.hidden=false;this.inert=false;this.className='';this.text='';this.value='';this.handlers={};this.ownerDocument=doc;this.scrollTop=0;this.style={setProperty(){}};this.classList={contains:c=>this.className.split(' ').includes(c),add:(...cs)=>{this.className=[...new Set([...this.className.split(' ').filter(Boolean),...cs])].join(' ');},remove:(...cs)=>{this.className=this.className.split(' ').filter(c=>!cs.includes(c)).join(' ');}}; }
    append(...nodes){for(const n of nodes){n.parent=this;this.children.push(n);}}
    appendChild(n){this.append(n);return n;}
    set textContent(s){for(const n of this.children)n.parent=null;this.children=[];this.text=String(s);}
    get textContent(){return this.text+this.children.map(n=>n.textContent).join(' ');}
    setAttribute(k,v){this.attrs[k]=String(v);}
    getAttribute(k){return this.attrs[k]??null;}
    addEventListener(k,fn){this.handlers[k]=fn;}
    contains(n){return this===n||this.children.some(c=>c.contains(n));}
    querySelectorAll(s){return this.children.flatMap(c=>[c,...c.querySelectorAll('*')]).filter(c=>s==='*'||(s[0]==='.'?c.className.split(' ').includes(s.slice(1)):s==='[data-look-key]'?!!c.dataset.lookKey:s.includes('button')?['BUTTON','INPUT'].includes(c.tagName)&&!c.disabled:c.tagName===s.toUpperCase()));}
    querySelector(s){return this.querySelectorAll(s)[0]||null;}
    closest(s){for(let n=this;n;n=n.parent)if(s==='[inert]'&&n.inert)return n;return null;}
    getClientRects(){for(let n=this;n;n=n.parent)if(n.hidden)return [];return [{}];}
    focus(){doc.activeElement=this;}
    scrollIntoView(){}
    getContext(){return canvas?ctx:null;}
  }
  doc.createElement=tag=>new Node(tag);
  for(const id of ids){const n=new Node();n.id=id;roots.set(id,n);}
  doc.getElementById=id=>roots.get(id)||[...roots.values()].flatMap(r=>r.querySelectorAll('*')).find(n=>n.id===id)||null;
  return {document:doc,roots,Node};
}

// Monta as visitas reais. Canvas neutro só permite construir o cenário;
// caminhos e colisões abaixo usam as funções de produção, sem simular pixels.
import assert from 'node:assert/strict';
const context=new Proxy({}, {get:(o,k)=>o[k]??(k==='createLinearGradient'||k==='createRadialGradient'?()=>({addColorStop(){}}):()=>{}),set:(o,k,v)=>(o[k]=v,true)});
const node=()=>({hidden:false,dataset:{},style:{},classList:{add(){},remove(){},toggle(){}},
 addEventListener(){},setAttribute(){},querySelector(){return null;},getContext:()=>context});
const elements=new Map();
globalThis.document={createElement:node,querySelectorAll:()=>[],getElementById:id=>{
 if(id==='dg-map')return null;
 if(!elements.has(id))elements.set(id,node());return elements.get(id);
}};
globalThis.window={addEventListener(){},matchMedia:()=>({matches:false}),innerWidth:1280,innerHeight:720,devicePixelRatio:1};
globalThis.localStorage={getItem:()=>null,setItem(){}};
globalThis.requestAnimationFrame=()=>1;globalThis.cancelAnimationFrame=()=>{};
const {createDungeon,dungeonBoxFree,dungeonLineOfSight}=await import('../js/dungeon.js');
const {DUNGEONS,CONURBATION}=await import('../js/dungeon-data.js');
const {findInteractionPath}=await import('../js/path.js');
const {RPG}=await import('../js/rpg.js');
const {advancePath}=await import('../js/movement.js');
const visits=[...DUNGEONS,CONURBATION];
const dg=createDungeon({rpg:new RPG(),audio:{open(){},close(){}}});
const failures=[];let total=0;
for(const def of visits) {
 assert.equal(dg.open(def),true);
 const s=dg.state;
 if(!dungeonBoxFree(s.map,s.player.x,s.player.y,0,s.solids))failures.push(`${def.id}: entrada bloqueada`);
 for(const target of [...s.props.filter(p=>p.interact),...s.chests]) {
  total++;
  const path=findInteractionPath(s.map.W,s.map.H,(x,y,pad)=>dungeonBoxFree(s.map,x+.5,y+.5,pad,s.solids),s.player,target,{goalPad:.16,
   canInteract:(a,b)=>dungeonLineOfSight(s.map,a.x,a.y,b.x,b.y)});
  const end=path?.at(-1);
  if(!end || Math.hypot(end.x-target.x,end.y-target.y)>1.7 || !dungeonLineOfSight(s.map,end.x,end.y,target.x,target.y))
   failures.push(`${def.id}: ${target.kind} ${target.x},${target.y} inacessível`);
  if(path) {
   const player={...s.player};
   const walked=advancePath(player,path,1000,(x,y)=>dungeonBoxFree(s.map,x,y,0,s.solids));
   if(walked.blocked || !walked.finished)failures.push(`${def.id}: caminhada até ${target.kind} trava`);
  }
 }
 dg.enterCity();
 if(!dungeonBoxFree(s.map,s.player.x,s.player.y,0,s.solids))failures.push(`${def.id}: chegada à cidade bloqueada`);
 dg.close();
}
assert.equal(failures.length,0,failures.join("\n"));
console.log(`ok visitas reais: ${visits.length} visitas e ${total} alvos alcançáveis com sólidos`);

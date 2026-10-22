// Uso: npm run art:render -- /tmp/arte
// Ferramenta de revisão; nenhuma dependência é carregada pelo jogo.
import {pathToFileURL} from 'node:url';
import {mkdir,writeFile} from 'node:fs/promises';
const {createCanvas}=await import(process.env.ART_CANVAS_MODULE ? pathToFileURL(process.env.ART_CANVAS_MODULE).href : '@napi-rs/canvas');
globalThis.document={createElement:()=>createCanvas(1,1)};
globalThis.localStorage={getItem:()=>null,setItem(){}};
const {GRUPOS,assetDe,desenharAsset}=await import('../src/rendering/assets/index.js');
const {paletaDaArea}=await import('../src/rendering/assets/nucleo.js');
const {drawCreatureArt}=await import('../src/rendering/creature.js');
const {CREATURE_MODELS}=await import('../src/rendering/creature-models.js');
const {drawPetSprite,PET_COLORS}=await import('../src/rendering/pet-art.js');
const {drawHuman}=await import('../src/rendering/human.js');
const {itemIconCanvas}=await import('../src/rendering/item-art.js');
const {ITEMS}=await import('../src/content/rpg-data.js');
const {desenharIcone,ICONES}=await import('../src/rendering/assets/icones.js');
const {drawCaveFacade}=await import('../src/rendering/cave-art.js');
const {drawSkiff}=await import('../src/rendering/skiff.js');
const out=process.argv[2]||'/tmp/valley-art';await mkdir(out,{recursive:true});
const bio={id:'preview',accent:'#61f4c0',floor:'#292738',path:'#53415a'},p=paletaDaArea(bio);
function sheet(entries,draw,cols=7,w=170,h=138,time=720){const cv=createCanvas(cols*w,Math.ceil(entries.length/cols)*h),g=cv.getContext('2d');g.fillStyle='#111725';g.fillRect(0,0,cv.width,cv.height);g.imageSmoothingEnabled=false;entries.forEach((item,i)=>{const x=(i%cols)*w,y=Math.floor(i/cols)*h;g.fillStyle=i%2?'#1b2332':'#192130';g.fillRect(x+3,y+3,w-6,h-6);g.save();g.translate(x+w/2,y+h-28);draw(g,item,time);g.restore();g.fillStyle='#d4deeb';g.font='11px monospace';g.fillText(typeof item==='string'?item:item.id,x+9,y+h-10);});return cv;}
const env=Object.entries(GRUPOS).flatMap(([group,defs])=>Object.keys(defs));
const drawEnv=(g,id,t)=>{
 const def=assetDe(id),scale=Math.min(3,140/(def.w*(def.escala||1)),96/(def.h*(def.escala||1)));
 g.scale(scale,scale);desenharAsset(g,id,0,0,{tempo:t,bioma:bio,seed:3});
};
const sheets={ambiente:sheet(env,drawEnv),criaturas:sheet(Object.keys(CREATURE_MODELS),(g,k,t)=>drawCreatureArt(g,k,'#61d5b2',t,2)),companhia:sheet([...Object.keys(PET_COLORS),'pessoa-frente','pessoa-costas','nave'],(g,k,t)=>{g.scale(3,3);if(PET_COLORS[k])drawPetSprite(g,k,0,0,t,true);else if(k==='nave')drawSkiff(g,0,-5,0,t,1,true);else drawHuman(g,0,0,k.endsWith('costas')?3:0,true,t,{skin:'#d9b08c',hair:'#584252',shirt:'#4e9b89',pants:'#403d5c',accent:'#e7c385'},1);}),itens:sheet(Object.entries(ITEMS).map(([id,item])=>({id,...item})),(g,item)=>g.drawImage(itemIconCanvas(item),-24,-48,48,48),20,60,78),conceitos:sheet([...ICONES],(g,k,t)=>{g.scale(2,2);desenharIcone(g,{type:k,x:0,y:0,accent:'#61d5b2',hue:.8},t);}),cavernas:sheet(['giz','ferro','vidro','fibra','desconhecido'],(g,k,t)=>{g.scale(2,2);drawCaveFacade(g,{px:0,py:0,pedra:'#716d86',meio:'#514969',fundo:'#161b2c',acento:'#61d5b2',seed:.6,time:t,entrada:true,material:k});})};
for(const [name,cv]of Object.entries(sheets))await writeFile(`${out}/${name}.png`,cv.toBuffer('image/png'));
// Quatro tempos para observar movimento sem depender do navegador.
for(let i=0;i<4;i++)await writeFile(`${out}/animacao-${i}.png`,sheet(env,drawEnv,7,170,138,i*230).toBuffer('image/png'));
console.log(JSON.stringify({assets:env.length,criaturas:Object.keys(CREATURE_MODELS).length,pets:Object.keys(PET_COLORS).length,itens:Object.keys(ITEMS).length,icones:ICONES.size,out}));
for(let i=0;i<8;i++){
 const cv=createCanvas(840,300),g=cv.getContext('2d');g.fillStyle='#182232';g.fillRect(0,0,840,300);g.imageSmoothingEnabled=false;
 ['arvore','casa','fogueira','lanterna','juncoAgua','gaivota'].forEach((id,k)=>{g.save();g.translate(70+k*140,155);g.scale(1.4,1.4);desenharAsset(g,id,0,0,{tempo:i*120,bioma:bio,seed:k});g.restore();});
 ['slime','bat','spider','jelly','boss','tome'].forEach((id,k)=>{g.save();g.translate(70+k*140,245);drawCreatureArt(g,id,'#61d5b2',i*120,1.6);g.restore();});
 Object.keys(PET_COLORS).forEach((id,k)=>drawPetSprite(g,id,80+k*110,283,i*120,true,k%8));
 await writeFile(`${out}/scene-${i}.png`,cv.toBuffer('image/png'));
}
// Cada linha mostra as oito vistas da mesma entidade no mesmo instante.
const actors=[...Object.keys(CREATURE_MODELS),...Object.keys(PET_COLORS).map(k=>'pet:'+k),'human','skiff'];
const views=actors.flatMap(kind=>Array.from({length:8},(_,dir)=>({id:`${kind} ${dir}`,kind,dir})));
const directional=sheet(views,(g,{kind,dir},t)=>{
 g.scale(2,2);
 if(kind.startsWith('pet:'))drawPetSprite(g,kind.slice(4),0,0,t,true,dir);
 else if(kind==='human')drawHuman(g,0,0,dir,true,t,{skin:'#d9b08c',hair:'#584252',shirt:'#4e9b89',pants:'#403d5c',eyes:'#14121f',accent:'#e7c385'});
 else if(kind==='skiff')drawSkiff(g,0,0,dir,t,1,true);
 else drawCreatureArt(g,kind,'#61d5b2',t,1,dir);
},8,115,125);
await writeFile(`${out}/oito-direcoes.png`,directional.toBuffer('image/png'));
const {fixtures}=await import('./art-fixtures.mjs');
const props=sheet(fixtures,(g,entry,t)=>{g.scale(2,2);entry.draw(g,t);},7,130,130);
await writeFile(`${out}/subsolo.png`,props.toBuffer('image/png'));
const {HAIRS,GENDERS}=await import('../src/content/avatar.js');
const looks=HAIRS.flatMap(hair=>GENDERS.flatMap(gender=>Array.from({length:8},(_,dir)=>({id:`${hair.id}/${gender.id}/${dir}`,hair:hair.id,gender:gender.id,dir}))));
await writeFile(`${out}/avatares.png`,sheet(looks,(g,entry,t)=>{g.scale(2,2);drawHuman(g,0,0,entry.dir,true,t,{skin:'#d9b08c',hair:'#584252',shirt:'#4e9b89',pants:'#403d5c'},1,entry);},8,100,100).toBuffer('image/png'));
for(let frame=0;frame<8;frame++){
 const cv=sheet(views,(g,{kind,dir})=>{
   g.scale(2,2);const t=frame*100;
   if(kind.startsWith('pet:'))drawPetSprite(g,kind.slice(4),0,0,t,true,dir);
   else if(kind==='human')drawHuman(g,0,0,dir,true,t,{skin:'#d9b08c',hair:'#584252',shirt:'#4e9b89',pants:'#403d5c'});
   else if(kind==='skiff')drawSkiff(g,0,0,dir,t,1,true);
   else drawCreatureArt(g,kind,'#61d5b2',t,1,dir,true);
 },8,115,125);
 await writeFile(`${out}/direcoes-${frame}.png`,cv.toBuffer('image/png'));
}
const {TILE_STYLE}=await import('../src/content/identity.js');
const {createTerrainRenderer}=await import('../src/rendering/terrain-renderer.js');
const {windMood}=await import('../src/rendering/wind.js');
const {TILE_KIND:K}=await import('../src/core/runtime-config.js');
const terrain=sheet([...new Set([...Object.keys(TILE_STYLE).map(Number),...Object.values(K)])],(g,key,t)=>{
 const id=Number(key);g.translate(-32,-64);g.scale(4,4);
 const renderer=createTerrainRenderer({ctx:g,world:{get:()=>id,areaAt:()=>null},getWindMood:()=>windMood(null)});
 renderer.drawGroundOn(g,0,0,id,t,false);renderer.drawGroundOn(g,0,0,id,t,true);renderer.groundGrain(g,0,0,id);if(id===K.TREE)renderer.drawTree(0,0,t);if(id===K.WALL)renderer.drawWall(0,0);
},12,90,100);
await writeFile(`${out}/terrenos.png`,terrain.toBuffer('image/png'));
const wearable=Object.entries(ITEMS).filter(([,item])=>['weapon','armor','legs','boots','helmet','shield','cloak'].includes(item.slot)).map(([id,item])=>({id,item}));
await writeFile(`${out}/equipamentos.png`,sheet(wearable,(g,{item},t)=>{g.scale(2,2);drawHuman(g,0,0,5,true,t,{skin:'#d9b08c',hair:'#584252',shirt:'#4e9b89',pants:'#403d5c'},1,{hair:'curto'},{[item.slot]:item});},12,90,100).toBuffer('image/png'));

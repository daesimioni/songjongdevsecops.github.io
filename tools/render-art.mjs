// Uso: ART_CANVAS_MODULE=/caminho/@napi-rs/canvas/index.js node tools/render-art.mjs /tmp/arte
// Ferramenta de revisão; nenhuma dependência é carregada pelo jogo.
import {pathToFileURL} from 'node:url';
import {mkdir,writeFile} from 'node:fs/promises';
const {createCanvas}=await import(pathToFileURL(process.env.ART_CANVAS_MODULE));
globalThis.document={createElement:()=>createCanvas(1,1)};
globalThis.localStorage={getItem:()=>null,setItem(){}};
const {GRUPOS,desenharAsset}=await import('../js/assets/index.js');
const {paletaDaArea}=await import('../js/assets/nucleo.js');
const {drawCreatureArt,COSTAS}=await import('../js/creature.js');
const {drawPetSprite,PET_COLORS}=await import('../js/pet-art.js');
const {drawHuman}=await import('../js/human.js');
const {itemIconCanvas}=await import('../js/item-art.js');
const {ITEMS}=await import('../js/rpg-data.js');
const {desenharIcone,ICONES}=await import('../js/assets/icones.js');
const {drawCaveFacade}=await import('../js/cave-art.js');
const {drawSkiff}=await import('../js/skiff.js');
const out=process.argv[2]||'/tmp/valley-art';await mkdir(out,{recursive:true});
const bio={id:'preview',accent:'#61f4c0',floor:'#292738',path:'#53415a'},p=paletaDaArea(bio);
function sheet(entries,draw,cols=7,w=170,h=138,time=720){const cv=createCanvas(cols*w,Math.ceil(entries.length/cols)*h),g=cv.getContext('2d');g.fillStyle='#111725';g.fillRect(0,0,cv.width,cv.height);g.imageSmoothingEnabled=false;entries.forEach((item,i)=>{const x=(i%cols)*w,y=Math.floor(i/cols)*h;g.fillStyle=i%2?'#1b2332':'#192130';g.fillRect(x+3,y+3,w-6,h-6);g.save();g.translate(x+w/2,y+h-28);draw(g,item,time);g.restore();g.fillStyle='#d4deeb';g.font='11px monospace';g.fillText(typeof item==='string'?item:item.id,x+9,y+h-10);});return cv;}
const env=Object.entries(GRUPOS).flatMap(([group,defs])=>Object.keys(defs));
const drawEnv=(g,id,t)=>desenharAsset(g,id,0,0,{tempo:t,bioma:bio,seed:3});
const sheets={ambiente:sheet(env,drawEnv),criaturas:sheet(Object.keys(COSTAS),(g,k,t)=>drawCreatureArt(g,k,'#61d5b2',t,2)),companhia:sheet([...Object.keys(PET_COLORS),'pessoa-frente','pessoa-costas','nave'],(g,k,t)=>{g.scale(3,3);if(PET_COLORS[k])drawPetSprite(g,k,0,0,t,true);else if(k==='nave')drawSkiff(g,0,-5,0,t,1,true);else drawHuman(g,0,0,k.endsWith('costas')?3:0,true,t,{skin:'#d9b08c',hair:'#584252',shirt:'#4e9b89',pants:'#403d5c',accent:'#e7c385'},1);}),itens:sheet(Object.entries(ITEMS).map(([id,item])=>({id,...item})),(g,item)=>g.drawImage(itemIconCanvas(item),-24,-48,48,48),20,60,78),conceitos:sheet([...ICONES],(g,k,t)=>{g.scale(2,2);desenharIcone(g,{type:k,x:0,y:0,accent:'#61d5b2',hue:.8},t);}),cavernas:sheet(['giz','ferro','vidro','fibra','desconhecido'],(g,k,t)=>{g.scale(2,2);drawCaveFacade(g,{px:0,py:0,pedra:'#716d86',meio:'#514969',fundo:'#161b2c',acento:'#61d5b2',seed:.6,time:t,entrada:true,material:k});})};
for(const [name,cv]of Object.entries(sheets))await writeFile(`${out}/${name}.png`,cv.toBuffer('image/png'));
// Quatro tempos para observar movimento sem depender do navegador.
for(let i=0;i<4;i++)await writeFile(`${out}/animacao-${i}.png`,sheet(env,drawEnv,7,170,138,i*230).toBuffer('image/png'));
console.log(JSON.stringify({assets:env.length,criaturas:Object.keys(COSTAS).length,pets:Object.keys(PET_COLORS).length,itens:Object.keys(ITEMS).length,icones:ICONES.size,out}));
for(let i=0;i<8;i++){
 const cv=createCanvas(840,300),g=cv.getContext('2d');g.fillStyle='#182232';g.fillRect(0,0,840,300);g.imageSmoothingEnabled=false;
 ['arvore','casa','fogueira','lanterna','juncoAgua','gaivota'].forEach((id,k)=>{g.save();g.translate(70+k*140,155);g.scale(1.4,1.4);desenharAsset(g,id,0,0,{tempo:i*120,bioma:bio,seed:k});g.restore();});
 ['slime','bat','spider','jelly','boss','tome'].forEach((id,k)=>{g.save();g.translate(70+k*140,245);drawCreatureArt(g,id,'#61d5b2',i*120,1.6);g.restore();});
 Object.keys(PET_COLORS).forEach((id,k)=>drawPetSprite(g,id,80+k*110,283,i*120,true,k%8));
 await writeFile(`${out}/scene-${i}.png`,cv.toBuffer('image/png'));
}

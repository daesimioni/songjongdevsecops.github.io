import {pathToFileURL} from 'node:url';
import {writeFile,mkdir} from 'node:fs/promises';
const {createCanvas,loadImage}=await import(pathToFileURL(process.env.ART_CANVAS_MODULE));
const before=process.argv[2],after=process.argv[3],out=process.argv[4]||'docs/art/antes-depois.png';
const examples=[['ambiente',17,'Casa'],['ambiente',8,'Vegetação'],['ambiente',24,'Fogueira'],['ambiente',33,'Barril'],['criaturas',6,'Golem'],['criaturas',25,'Chefe'],['criaturas',15,'Livro'],['companhia',0,'Gato'],['companhia',6,'Papagaio'],['companhia',7,'Personagem']];
const cv=createCanvas(1360,examples.length/2*230+60),g=cv.getContext('2d');g.imageSmoothingEnabled=false;g.fillStyle='#101725';g.fillRect(0,0,cv.width,cv.height);g.fillStyle='#e8ddc8';g.font='bold 20px sans-serif';g.fillText('THE LEARNING VALLEY · evolução da arte',24,34);
const loaded=new Map();
for(let i=0;i<examples.length;i++){
 const [sheet,index,label]=examples[i],x=i%2*680,y=60+Math.floor(i/2)*230;

 const pair=[];
 for(const path of [before,after]){
  const key=`${path}/${sheet}.png`;let img=loaded.get(key);if(!img){img=await loadImage(key);loaded.set(key,img);}
  const tile=createCanvas(162,114),t=tile.getContext('2d');t.drawImage(img,index%7*170+4,Math.floor(index/7)*138+3,162,114,0,0,162,114);pair.push(tile);
 }
 let minX=161,minY=113,maxX=0,maxY=0;
 for(const tile of pair){const data=tile.getContext('2d').getImageData(0,0,162,114).data,bg=[data[0],data[1],data[2]];
  for(let yy=0;yy<114;yy++)for(let xx=0;xx<162;xx++){const k=(yy*162+xx)*4;if(Math.max(...bg.map((v,c)=>Math.abs(data[k+c]-v)))<6)continue;minX=Math.min(minX,xx);maxX=Math.max(maxX,xx);minY=Math.min(minY,yy);maxY=Math.max(maxY,yy);}
 }
 minX=Math.max(0,minX-3);minY=Math.max(0,minY-3);maxX=Math.min(161,maxX+3);maxY=Math.min(113,maxY+3);
 const w=maxX-minX+1,h=maxY-minY+1,scale=Math.min(4,Math.floor(310/w),Math.floor(185/h));
 for(let column=0;column<2;column++)g.drawImage(pair[column],minX,minY,w,h,x+12+column*340+(324-w*scale)/2,y+29+(190-h*scale)/2,w*scale,h*scale);
}
for(let i=0;i<examples.length;i++){const x=i%2*680,y=60+Math.floor(i/2)*230;g.fillStyle='#101725';g.fillRect(x,y,680,27);g.fillStyle='#bfcfdd';g.font='15px monospace';g.fillText(`${examples[i][2]} · antes`,x+22,y+20);g.fillText('depois',x+360,y+20);}
await mkdir(out.substring(0,out.lastIndexOf('/')),{recursive:true});await writeFile(out,cv.toBuffer('image/png'));

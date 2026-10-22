import { directionVector } from '../core/movement.js';
import { artTime } from './art-style.js';
import {actorView} from './actor-volume.js';
export function skiffRear(dir) {
  const {x,y}=directionVector(dir);return {x:-x,y:-y};
}
export function drawSkiff(ctx,px,py,dir,time,boost=1,moving=false) {
  if(boost<=.01)return;
  time=artTime(time);const view=actorView(dir),bob=Math.sin(time*.007)*1.1;
  ctx.save();ctx.translate(px,py);ctx.globalAlpha=Math.min(1,boost);
  ctx.fillStyle='rgba(2,4,10,.32)';ctx.beginPath();ctx.ellipse(0,4,12,3.2,0,0,Math.PI*2);ctx.fill();
  const poly=(pts,color)=>{ctx.fillStyle=color;ctx.beginPath();pts.forEach((v,i)=>{const p=view.project(v[0],v[1],v[2]+2-bob);i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y);});ctx.closePath();ctx.fill();};
  const line=(pts,color,width=1)=>{ctx.strokeStyle=color;ctx.lineWidth=width;ctx.beginPath();pts.forEach((v,i)=>{const p=view.project(v[0],v[1],v[2]+2-bob);i?ctx.lineTo(p.x,p.y):ctx.moveTo(p.x,p.y);});ctx.stroke();};
  const hull=[[-5,-11],[5,-11],[7,-7],[6,5],[0,15],[-6,5],[-7,-7]];
  // Espessura vertical permanece vertical em todos os rumos; a proa gira no
  // plano do chão e não roda o desenho inteiro como uma placa de papel.
  poly(hull.map(([x,y])=>[x,y,0]),'#091d2c');
  const faces=hull.map((p,i)=>({a:p,b:hull[(i+1)%hull.length],depth:view.depth((p[0]+hull[(i+1)%hull.length][0])/2,(p[1]+hull[(i+1)%hull.length][1])/2)})).sort((a,b)=>a.depth-b.depth);
  for(const {a,b}of faces)poly([[...a,0],[...b,0],[...b,4],[...a,4]],view.project((a[0]+b[0])/2,(a[1]+b[1])/2).x>0?'#244b63':'#416e80');
  poly(hull.map(([x,y])=>[x,y,4]),'#367b8e');
  line([...hull,hull[0]].map(([x,y])=>[x,y,4]),'#8bcdbb',.8);
  for(const side of [-1,1]){
    poly([[side*5,-9,4],[side*10,-9,2],[side*9,-3,2],[side*5,-2,4]],'#1c435d');
    line([[side*6,-8,4],[side*8,-7,3]],side<0?'#efb38b':'#8cdbad',1);
  }
  poly([[-3,-4,4],[3,-4,4],[3,4,4],[-3,4,4]],'#0c243e');
  poly([[-3,-4,4],[-3,-3,8],[2,-3,8],[3,4,4]],'#79c3cc');
  line([[-2,-3,8],[1,-3,8],[2,2,5]],'#d4eee0',.7);
  for(let i=0;i<4;i++)line([[-5,-7+i*4,4],[-3,-7+i*4,4]],'#153b51',.7);
  poly([[-2,7,4],[0,11,4],[2,7,4]],'#e6bc77');
  const exhaust=4+Math.sin(time*.018)*1.2;
  poly([[-2,-11,3],[2,-11,3],[1,-11-exhaust,3],[-1,-11-exhaust,3]],'#8fdaed');
  line([[0,-11,3],[0,-13,3]],'#fff0c6',1);
  if(moving)for(let i=0;i<3;i++)line([[(i-1)*3,-16-i*4,1],[(i-1)*3,-21-i*4,1]],'rgba(190,232,245,.38)',.7);
  ctx.restore();
}

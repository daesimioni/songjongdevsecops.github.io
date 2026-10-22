import {finishMaterial} from '../art-style.js';
const MATERIAL={solo:'stone',vegetacao:'leaf',construcao:'wood',props:'wood',fogo:'metal',agua:'water'};
// Detalhe por objeto, colocado sobre o material existente, sem mudar seu tamanho.
export function detailAsset(g,p,v,q,type,group,w,h) {
  g.save();g.globalCompositeOperation='source-atop';
  if(group==='construcao'){
    // Rejunte e lascas na base, ferragens e pregos no beiral.
    g.fillStyle=p.contorno;
    for(let x=5+v;x<w-3;x+=7){g.fillRect(x,h-5,.5,3);g.fillRect(x+1,h-9,3,.5);}
    g.fillStyle=p.pedraClara;for(let x=5;x<w-4;x+=9)g.fillRect(x,h-4,2,.5);
    g.fillStyle=p.metalClaro;g.fillRect(w*.28,h*.52,.5,.5);g.fillRect(w*.72,h*.52,.5,.5);
  } else if(group==='vegetacao'){
    // Veios foliares e pontos de luz quebram grandes manchas lisas da copa.
    g.fillStyle=p.folhaClara;
    for(let i=0;i<8;i++){const x=3+(i*7+v*3+q*.5)%(w-6),y=4+(i*11)%(Math.max(5,h-12));g.fillRect(x,y,1.5,.5);}
    g.fillStyle=p.troncoClaro;g.fillRect(w/2-.5,h-9,.5,5);
  } else if(group==='props'&&type!=='gaivota'){
    g.fillStyle=p.tronco;for(let x=4;x<w-3;x+=4)g.fillRect(x,h*.45,.5,Math.max(1,h*.3));
    g.fillStyle=p.metalClaro;g.fillRect(3,h*.43,.5,.5);g.fillRect(w-4,h*.43,.5,.5);
  } else if(group==='solo'){
    g.fillStyle=p.pedraClara;for(let i=0;i<4;i++)g.fillRect(3+(i*5+v)%(w-5),3+(i*3)%(h-4),1,.5);
  } else if(group==='agua'){
    const offset=[0,.5,1,.5][q%4];g.fillStyle='rgba(207,242,255,0.48)';
    g.fillRect(2+offset,h-3,3,.5);g.fillRect(w-7-offset,h-2,2,.5);
  } else if(group==='fogo'&&type!=='fumaca'){
    g.fillStyle=p.luz;g.fillRect(w/2+Math.sin(q*1.4)*2,Math.max(0,h-17-q%3),.5,1);
    g.fillStyle=p.troncoClaro;g.fillRect(w/2-2,h-4,1,.5);
  }
  g.restore();finishMaterial(g,w,h,MATERIAL[group],v);
}

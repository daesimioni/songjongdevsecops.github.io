// Pequenos volumes e marcas próprias; nunca cobre a área central dos olhos.
export function creatureDetail(g,kind,accent,t) {
  const line=(x,y,w,h,c)=>{g.fillStyle=c;g.fillRect(x,y,w,h);};
  const light='rgba(255,238,202,0.56)',dark='rgba(9,20,36,0.52)';
  if(kind==='slime'){line(-8,-9,2,1,light);line(5,-6,2,1,dark);line(-5,-4,10,.5,light);}
  else if(kind==='eye'){line(-9,-13,1,6,light);line(7,-13,1,5,dark);line(-1,-15,1,1,'#fff7dd');}
  else if(['bat','moth'].includes(kind)){
    g.strokeStyle=dark;g.lineWidth=.5;for(const side of [-1,1]){g.beginPath();g.moveTo(side*3,-8);g.lineTo(side*13,-11);g.lineTo(side*8,-6);g.stroke();}
    line(-1,-17,1,2,light);
  } else if(['spider','scorpion','ant','beetle','crab'].includes(kind)){
    line(-5,-5,10,.5,light);line(-4,-3,8,.5,dark);
    for(const side of [-1,1])for(let i=0;i<3;i++)line(side*(7+i*2),-4+i,1,.5,light);
    if(kind==='beetle')line(0,-12,.5,7,dark);
  } else if(['golem','sentinel','boss'].includes(kind)){
    line(-7,-21,2,.5,light);line(5,-19,2,.5,light);
    line(-8,-10,5,.5,dark);line(3,-10,5,.5,dark);
    line(-5,-5,2,1,light);line(4,-5,2,1,light);
    g.fillStyle=accent;g.fillRect(-1,-8,2,2);g.fillStyle=light;g.fillRect(-.5,-8,.5,.5);
  } else if(['wisp','jelly','imp'].includes(kind)){
    line(-4,-7,1,3,light);line(3,-6,1,2,light);
    const beat=Math.sin(t*.006)*.5;line(-2,-3+beat,1,1,accent);line(2,-2-beat,.5,1,light);
  } else if(kind==='serpent'){
    g.strokeStyle=light;g.lineWidth=.5;g.beginPath();g.moveTo(-3,-24);g.quadraticCurveTo(12,-13,-6,-4);g.stroke();
  } else if(kind==='tome'){
    for(let y=-18;y<-8;y+=3){line(-9,y,5,.5,dark);line(3,y,5,.5,dark);}line(0,-20,.5,15,light);
  } else if(['glyph','note','gear','vector'].includes(kind)){
    line(-4,-4,2,.5,light);line(1,-7,1,2,dark);line(-1,-12,1,1,light);
  } else if(['atom','node','prism','crystal','flask'].includes(kind)){
    line(-3,-17,.5,5,light);line(3,-8,.5,3,dark);
    const flash=Math.sin(t*.004)>.6;line(-1,-19,flash?1.5:.5,.5,light);
    if(kind==='flask'){line(-4,-7,8,.5,light);line(-2,-5,1,1,'rgba(255,255,255,.7)');}
  }
}

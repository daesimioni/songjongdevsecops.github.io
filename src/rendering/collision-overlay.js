import {TILE,PLAYER_W,PLAYER_H} from '../core/runtime-config.js';
// Diagnóstico opt-in (?collisions=1), usando os mesmos corpos da consulta física.
export function drawCollisionOverlay(ctx,boxes,player,view,solid){
  ctx.save();ctx.lineWidth=.6;
  ctx.fillStyle='rgba(245,75,70,.12)';
  for(let y=Math.floor(view.y/TILE);y<=Math.ceil((view.y+view.h)/TILE);y++)
    for(let x=Math.floor(view.x/TILE);x<=Math.ceil((view.x+view.w)/TILE);x++)
      if(solid(x,y))ctx.fillRect(x*TILE,y*TILE,TILE,TILE);
  ctx.strokeStyle='#ffcf52';ctx.fillStyle='rgba(255,207,82,.22)';
  for(const box of boxes){
    if(box.active&&!box.active())continue;
    const x=(box.x-box.hw)*TILE,y=(box.y-box.hh)*TILE,w=box.hw*2*TILE,h=box.hh*2*TILE;
    if(x+w<view.x||x>view.x+view.w||y+h<view.y||y>view.y+view.h)continue;
    ctx.fillRect(x,y,w,h);ctx.strokeRect(x,y,w,h);
  }
  ctx.strokeStyle='#66eaff';ctx.strokeRect((player.x-PLAYER_W/2)*TILE,(player.y-PLAYER_H/2)*TILE,PLAYER_W*TILE,PLAYER_H*TILE);
  ctx.restore();
}

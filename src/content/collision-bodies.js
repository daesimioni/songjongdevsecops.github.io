import { kitAsset, kitColliders } from "./sprite-kit/catalog.js";
import { ASSET_META } from "./asset-meta.js";
import { variantIndex } from "../core/random.js";
import { projectCollisionBoxes } from '../core/collision.js';
import { TILE } from '../core/runtime-config.js';
import { DUNGEON_COLLISION, assetCollisionProfile } from './collision-profiles.js';
export function dungeonPropColliders(prop) {
  let boxes;
  if(prop.kind==='building') {
    boxes=prop.solid ? [{x:prop.x+prop.w/TILE/2,y:prop.y+prop.h/TILE/2,hw:prop.w/TILE/2,hh:prop.h/TILE/2}] : [];
  } else {
    const profile=DUNGEON_COLLISION[prop.kind];
    if(!profile)throw new Error(`Objeto do subsolo sem política de colisão: ${prop.kind}`);
    boxes=projectCollisionBoxes(profile,prop.x,prop.y,1/TILE);
  }
  return boxes.map((box,part)=>({...box,source:prop,tipo:prop.kind,part}));
}
export function stationColliders(station) {
  const k=station.minor?.72:.92;
  const rects=station.icon==='fountain'?[[-16,-4,16,8]]:
    station.icon==='radio'?[[-8,4,8,11],[-2,-2,2,4]]:[[-12*k,2*k,12*k,7*k],[-10*k,-2*k,10*k,2*k]];
  return projectCollisionBoxes(rects,station.x,station.y,1/TILE);
}

// O renderer desenha os objetos de pé em a.y + 0,5; a cena fornece esse pé.
export function assetColliders(tipo,x,y,seed=0,options={}){
  if(kitAsset(tipo)) return kitColliders(tipo,x,y,options);
  const def=ASSET_META[tipo];
  if(!def)throw new Error(`Asset desconhecido: ${tipo}`);
  const v=variantIndex(seed,def.variantes||1);
  const mirrored=['vegetacao','props','agua','solo'].includes(def.grupo)&&variantIndex(seed+17.3,2)===1;
  return projectCollisionBoxes(assetCollisionProfile(tipo,v),x,y,(def.escala||1)/TILE,mirrored)
    .map((box,part)=>({...box,tipo,part}));
}

// Ocupação física na base de cada sprite, em pixels lógicos relativos ao pé.
// Copa, telhado, brilho e sombra não são paredes. Arrays vazios são decisões
// explícitas para chão, plantas flexíveis, fumaça e criaturas decorativas.
export const ASSET_COLLISION = {
  arvore:[[-4.5,-14,5.5,-2]], conifera:[[-3,-13,3,-2]],
  palmeira:[[-3,-13,3,-2]], seca:[[-3,-14,3,-2]],
  arbusto:[[-8,-7,8,-2]], junco:[], florada:[], trepadeira:[],
  cabana:[[-12,-14,12,-2],[-14,-3,14,0]], casa:[[-17,-19,17,-1]],
  torre:[[-8,-12,8,-2]], galpao:[[-20,-16,20,0]],
  ruina:[[-17,-13,-7,-1],[1,-10,15,-1]],
  poco:[[-8,-10,8,-2]], cerca:[[-8,-11,8,-1]],
  // A tábua da doca é piso; os quatro mourões são sólidos.
  doca:[[-17,-12,-14,-1],[-8,-12,-5,-1],[5,-12,8,-1],[14,-12,17,-1]],
  pedra:[[-8,-6,8,-1]], rachadura:[], raiz:[], poca:[], tufo:[], folhada:[], musgo:[], cogumelo:[],
  barril:[[-6,-11,6,-2]], saco:[[-6,-9,6,-2]],
  caixote:[[-8,-12,8,-2]], fardo:[[-8,-9,8,-1]],
  mesa:[[-12,-12,12,-2]], cama:[[-13,-14,13,-2]], estante:[[-9,-10,9,-1]],
  gaivota:[], pedraAgua:[], juncoAgua:[], espuma:[], lirio:[],
  fogueira:[[-9,-8,9,-1]], braseiro:[[-5,-9,5,-1]],
  tocha:[[-2,-7,2,-1]], lanterna:[[-3,-7,3,-1]], fumaca:[],
};
export function assetCollisionProfile(tipo, variant = 0) {
  if (!(tipo in ASSET_COLLISION)) throw new Error(`Asset sem política de colisão: ${tipo}`);
  // A ala da casa e o arco da ruína mudam a ocupação, não só a textura.
  if(tipo==='doca' && variant===2)return [...ASSET_COLLISION.doca,[5,2,6,6],[14,3,15,7]];
  if(tipo==='cabana' && variant===2)return [[-10,-14,10,-5],[-11,-12,11,-6],[-7,-5,7,-2],[-5,-2,5,-1]];
  if(tipo==='casa' && variant===2)return [...ASSET_COLLISION.casa,[-22,-14,-17,-1]];
  if(tipo==='ruina' && variant===2)return [[-13,-13,-5,0],[5,-13,13,0]];
  return ASSET_COLLISION[tipo];
}
// Objetos do subsolo são desenhados diretamente em pixels de mundo, sem +0,5.
export const DUNGEON_COLLISION = {
  altar:[[-10,-8,10,0]], forge:[[-11,-10,11,0]], vocacao:[[-13,-9,13,0]],
  enchanter:[[-11,-9,11,0]], plot:[[-10,-7,10,0]], vein:[[-10,-9,10,0]],
  oficina:[[-13,-11,13,0]], biblioteca:[[-10,-10,10,0]],
  observatorio:[[-9,-5,9,1]], waystone:[[-6,-8,6,0]],
  chest:[[-7,-9,7,0]], keeper:[[-5,-4,5,0]], pet:[], torch:[], stairs:[], bilhete:[], isca:[], elevador:[[-12,-8,-10,0],[10,-8,12,0]],
  portal:[[-15,-12,-10,0],[10,-12,15,0]],
  conurbation:[[-11,-12,-7,0],[7,-12,11,0]],
};
export const CAVE_COLLISION = [[-20,-14,-7,0],[7,-14,20,0],[-16,-26,16,-14],[-8,-31,8,-26]];

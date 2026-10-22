import assert from 'node:assert/strict';
import { Net } from '../js/net.js';
let attacks = 0;
const net = new Net({ room: 'test', onPvp: () => attacks++ });
for (let dir = 0; dir < 8; dir++) {
  net.handle(net.topic('state'), {id:'peer', x:10, y:10, d:dir});
  assert.equal(net.peers.get('peer').dir, dir, 'rede preserva oito direções');
}
const attack = {id:'peer', to:net.id, kind:'attack', damage:2, nonce:'turn1',
  question:{q:'Qual alternativa?',options:['a','b','c','d','e'],answer:4,why:'A quinta.'}};
net.handle(net.topic('pvp'), attack);
assert.equal(attacks, 1, 'ataque A-E chega ao defensor');
net.lastPvp = 0;
net.handle(net.topic('pvp'), {...attack, question:{...attack.question, answer:5}});
assert.equal(attacks, 1, 'índice fora da pergunta é recusado');
for (let i=1; i<40; i++) net.handle(net.topic('state'), {id:`peer${i}`,x:10,y:10});
net.handle(net.topic('state'), {id:'extra',x:10,y:10});
assert.equal(net.peers.size,40);
net.handle(net.topic('state'), {id:'peer',x:11,y:10,d:7});
assert.equal(net.peers.get('peer').x,11, 'sala cheia continua atualizando conhecidos');
net.handle(net.topic('bye'), {id:'peer'});
assert.equal(net.peers.size,39, 'saída funciona com sala cheia');
let ended = false;
net.client = {end: () => {ended=true;}};
net.connected = false;
net.destroy();
assert.equal(ended,true,'destruir offline para reconexões');
console.log('ok rede: oito direções, PvP A-E, limite de pares e desconexão offline');

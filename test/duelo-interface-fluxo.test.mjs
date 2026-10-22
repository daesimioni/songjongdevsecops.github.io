// Fluxo real do controlador com DOM mínimo; não substitui inspeção visual.
import assert from 'node:assert/strict';
class Element {
  constructor() { this.children = []; this.text = ''; this.style = {}; this.classList = { add() {} }; this.handlers = {}; }
  set textContent(v) { this.text = String(v); this.children = []; }
  get textContent() { return this.text + this.children.map(c => c.textContent).join(' '); }
  append(...nodes) { this.children.push(...nodes); }
  appendChild(node) { this.append(node); return node; }
  setAttribute() {}
  addEventListener(event, fn) { this.handlers[event] = fn; }
}
const elements = new Map();
globalThis.document = {
  createElement: () => new Element(),
  getElementById: id => {
    if (id === 'duel-sprite') return null;
    if (!elements.has(id)) elements.set(id, new Element());
    return elements.get(id);
  },
};
const store = new Map();
globalThis.localStorage = { getItem: k => store.get(k) ?? null, setItem: (k,v) => store.set(k,String(v)) };
const { RPG } = await import('../js/rpg.js');
const { GROUNDS } = await import('../js/rpg-data.js');
const { createDuel } = await import('../js/duel.js');
const rpg = new RPG(); let wins = 0, defeated = 0;
const ui = createDuel({ rpg, audio: { blip() {}, chime() {} }, toast() {}, onVictory: result => { wins++; defeated = result.defeated; } });
const ground = GROUNDS.find(g => g.id === 'cs');
try {
  ui.open({id:'ui-main',name:'Principal',kind:'slime',tier:1}, ground, false,
    {id:'ui-partner',name:'Parceiro',kind:'eye',tier:2});
  assert.match(elements.get('duel-meta').textContent, /mana/, 'mana visível sem pet');
  while (rpg.duel.monsterHp > 0) {
    if (rpg.duel.phase === 'feedback') ui.advance();
    else ui.answer(rpg.duel.question.answer);
  }
  assert.equal(wins, 0);
  assert.match(elements.get('duel-body').textContent, /Vença os demais/);
  const walk = node => [node, ...node.children.flatMap(walk)];
  while (!rpg.duel.partner.done) {
    ui.render();
    const partner = walk(elements.get('duel-body')).find(e => e.className === 'duel-partner');
    const nodes = walk(partner);
    if (rpg.duel.partner.feedback) nodes.find(e => e.textContent === 'continuar com este bicho').handlers.click();
    else nodes.filter(e => e.className === 'duel-option')[rpg.duel.partner.question.answer].handlers.click();
  }
  assert.equal(wins, 1, 'último parceiro dispara evento de vitória e missão uma vez');
  assert.equal(defeated, 2, 'vitória informa dois monstros para a missão');
  assert.match(elements.get('duel-body').textContent, /voltar ao mapa/);
} finally { ui.close(); }
console.log('ok controlador do duelo: mana, principal primeiro, matilha e evento de vitória');

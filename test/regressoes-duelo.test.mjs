import assert from 'node:assert/strict';
const store = new Map();
globalThis.localStorage = { getItem: k => store.get(k) ?? null, setItem: (k,v) => store.set(k,String(v)) };
const { RPG } = await import('../js/rpg.js');
const { GROUNDS, MONSTER_TRAITS } = await import('../js/rpg-data.js');
const fresh = () => { store.clear(); return new RPG(); };
const ground = GROUNDS.find(g => g.id === 'cs');
let rpg = fresh();
rpg.data.pets.papagaio = { bond: 3 };
rpg.data.petActive = 'papagaio';
assert.equal(rpg.usePetAbility().ok, false, 'papagaio fora da pergunta não lança exceção nem consome mana');
assert.equal(rpg.data.petCd.tagarela, undefined);
const main = { id: 'reg-main', name: 'Principal', kind: 'slime', tier: 1 };
const partner = { id: 'reg-partner', name: 'Parceiro', kind: 'eye', tier: 2 };
rpg = fresh();
let xp = 0;
rpg.gainXp = n => { xp += n; };
rpg.startDuel(main, ground, false, [partner]);
const before = rpg.hp();
for (const invalid of [-1, 5, NaN, null, '0', 0.5]) assert.equal(rpg.answer(invalid).ok, false);
assert.equal(rpg.hp(), before, 'entrada inválida não tira vida');
while (rpg.duel.monsterHp > 0) {
  if (rpg.duel.phase === 'feedback') rpg.next();
  else rpg.answer(rpg.duel.question.answer);
}
assert.equal(rpg.duel.phase, 'question', 'principal cair não apaga a matilha');
assert.equal(xp, 0, 'recompensa espera a matilha');
assert.equal(rpg.answer(rpg.duel.question.answer).ok, false, 'não farma perícia no principal morto');
while (!rpg.duel.partner.done) {
  if (rpg.duel.partner.feedback) rpg.partnerNext();
  else rpg.answerPartner(rpg.duel.partner.question.answer);
}
assert.equal(rpg.duel.phase, 'victory');
assert.ok(xp > 0);
assert.equal(rpg.answerPartner(0).ok, false, 'vitória não repete recompensa');
for (const vocation of ['guerreiro', 'atirador', 'mago']) {
  for (const kind of ['slime', ...Object.keys(MONSTER_TRAITS).filter(k => MONSTER_TRAITS[k].id === 'haste')]) {
    rpg = fresh(); rpg.setVocation(vocation);
    rpg.startDuel({ ...main, kind, tier: 2 }, ground);
    const expected = rpg.erroPrevisto();
    const hp = rpg.hp();
    rpg.answer((rpg.duel.question.answer + 1) % 5);
    assert.equal(hp - rpg.hp(), expected, `previsão coincide com dano: ${vocation}/${kind}`);
  }
}
rpg = fresh();
rpg.addItem('ferro', Infinity);
rpg.addItem('ferro', NaN);
assert.equal(rpg.itemCount('ferro'), 0, 'quantidade inválida não corrompe inventário');
console.log('ok regressões: matilha principal primeiro, previsão real, papagaio, entradas e inventário');
rpg = fresh();
rpg.startDuel(main, ground, false, [partner, partner]);
assert.equal(rpg.duel.partners.length, 1, 'mesmo bicho não duplica luta nem loot');
rpg = fresh();
rpg.addItem('veio', 2); rpg.addItem('erva', 1);
assert.equal(rpg.craft('runa-faisca').ok, true);
assert.equal(new RPG().data.spells['runa-faisca'], true, 'magia forjada persiste antes de usar a carga');
// O caráter do parceiro segue as mesmas regras do inimigo principal.
const random = Math.random;
try {
  for (const trait of ['armor', 'dodge', 'divide', 'haste']) {
    const kind = Object.keys(MONSTER_TRAITS).find(k => MONSTER_TRAITS[k].id === trait);
    assert.ok(kind, `caráter existente: ${trait}`);
    rpg = fresh(); rpg.startDuel(main, ground, false, [{...partner,kind}]);
    const p = rpg.duel.partner;
    if (trait === 'armor' || trait === 'dodge') {
      const hp = p.hp;
      const damage = rpg.damageFor('cs');
      Math.random = () => 0;
      rpg.answerPartner(p.question.answer);
      assert.equal(hp-p.hp, trait === 'dodge' ? 0 : Math.max(1, damage-1));
      Math.random = random;
    } else {
      p.hp = 2;
      const expected = rpg.erroPrevisto(p.monster,p.tier,1), hp = rpg.hp();
      rpg.answerPartner((p.question.answer+1)%5);
      assert.equal(hp-rpg.hp(),expected);
      if (trait === 'divide') assert.ok(p.hp > 2, 'parceiro se recompõe no erro');
    }
  }
} finally { Math.random = random; }
rpg = fresh(); rpg.startDuel(main, ground, false, partner);
rpg.duel.monsterHp = 1; rpg.addItem('runa-trovao',1);
rpg.castSpell('runa-trovao');
assert.equal(rpg.duel.phase,'question','trovão fatal no principal também espera matilha');

// Regressões do combate: matilha espera todos, entrada inválida não quebra,
// caráter do parceiro vale, runa forjada persiste e trovão fatal espera a fila.
import assert from "node:assert/strict";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};
const { RPG } = await import("../src/gameplay/rpg.js");
const { GROUNDS, MONSTER_TRAITS } = await import("../src/content/rpg-data.js");
const fresh = () => { store.clear(); return new RPG(); };
const ground = GROUNDS.find((g) => g.id === "cs");
const main = { id: "reg-main", name: "Principal", kind: "slime", tier: 1 };
const partner = { id: "reg-partner", name: "Parceiro", kind: "eye", tier: 2 };

let rpg = fresh();
rpg.data.pets.papagaio = { bond: 3 };
rpg.data.petActive = "papagaio";
assert.equal(rpg.usePetAbility().ok, false, "papagaio fora do combate não lança exceção");
assert.equal(rpg.data.petCd.tagarela, undefined, "papagaio fora do combate não entra em recarga");

rpg = fresh();
let xp = 0;
rpg.gainXp = (n) => { xp += n; };
rpg.startDuel(main, ground, false, [partner]);
const c = rpg.combate;
assert.equal(c.usarMagia(null).ok, false, "magia nula não quebra");
assert.equal(c.usarMagia("nao-existe").ok, false, "magia inventada não quebra");
assert.equal(c.atacar(), true, "atacar sem alvo não quebra");
c.aplicarDano(c.inimigos[0], 99);
assert.equal(rpg.duel.phase, "combat", "o principal cair não apaga a matilha");
assert.equal(xp, 0, "a recompensa espera a matilha");
c.aplicarDano(c.inimigos[1], 99);
assert.equal(rpg.duel.phase, "victory");
assert.ok(xp > 0, "matilha inteira dá XP");
rpg.next();

// mesmo bicho repetido não vira parceiro
rpg = fresh();
rpg.startDuel(main, ground, false, [partner, partner]);
assert.equal(rpg.duel.partners.length, 1, "mesmo bicho não duplica luta nem loot");
rpg.flee();

// runa forjada persiste antes de usar a carga
rpg = fresh();
rpg.addItem("veio", 2);
rpg.addItem("erva", 1);
assert.equal(rpg.craft("runa-faisca").ok, true);
assert.equal(new RPG().data.spells["runa-faisca"], true, "magia forjada persiste antes de usar a carga");

// caráter do parceiro segue as mesmas regras
try {
  for (const trait of ["armor", "dodge", "divide", "haste"]) {
    const kind = Object.keys(MONSTER_TRAITS).find((k) => MONSTER_TRAITS[k].id === trait);
    assert.ok(kind, `caráter existente: ${trait}`);
    rpg = fresh();
    rpg.startDuel(main, ground, false, [{ ...partner, kind }]);
    const p = rpg.combate.inimigos[1];
    p.hp = 50;
    p.hpMax = 50;
    p.proximoAtaque = 1e9;
    if (trait === "armor" || trait === "dodge") {
      const aleatorio = rpg.combate.random;
      rpg.combate.random = () => 0;
      const dano = rpg.combate.danoNoInimigo(p, false);
      assert.equal(dano, trait === "dodge" ? 0 : Math.max(1, rpg.damageFor("cs") - 1), `caráter ${trait}`);
      rpg.combate.random = aleatorio;
    } else if (trait === "divide") {
      p.hp = 2;
      p.curaPronto = 0;
      rpg.combate.agora = 6000;
      rpg.combate.atualizarInimigo(p, 16);
      assert.ok(p.hp > 2, "parceiro com divide se recompõe");
    } else {
      rpg.combate.agora = 1000;
      p.vento = false;
      rpg.combate.resolverGolpe(p);
      const espera = rpg.combate.agora;
      assert.ok(p.proximoAtaque - espera < 2300, "haste deveria atacar mais rápido");
    }
  }
} finally { /* nada a restaurar */ }

// trovão fatal no principal ainda espera a matilha
rpg = fresh();
rpg.startDuel(main, ground, false, partner);
rpg.combate.inimigos[0].hp = 1;
rpg.combate.inimigos[0].x = rpg.combate.jogador.x + 20;
rpg.combate.inimigos[0].y = rpg.combate.jogador.y;
rpg.data.spells["runa-trovao"] = true;
rpg.data.mana = rpg.manaMax();
assert.equal(rpg.combate.usarMagia("runa-trovao").ok, true);
assert.equal(rpg.duel.phase, "combat", "trovão fatal no principal espera o parceiro");
rpg.combate.aplicarDano(rpg.combate.inimigos[1], 99);
assert.equal(rpg.duel.phase, "victory");

rpg = fresh();
rpg.addItem("ferro", Infinity);
rpg.addItem("ferro", NaN);
assert.equal(rpg.itemCount("ferro"), 0, "quantidade inválida não corrompe inventário");
console.log("ok regressões: matilha, entradas, papagaio, runa, caráteres e trovão fatal");

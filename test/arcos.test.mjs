// Arco do NPC: a segunda missão do guardião só abre depois da trilha da área.
// Mede o encadeamento, a lista de ofertas, o marcador e o aviso do cartão.
import assert from "node:assert/strict";
import fs from "node:fs";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

const { QUESTS, Quests } = await import("../src/gameplay/quests.js");

// ---- todo chefe de área é o segundo capítulo da trilha ----
const trilhas = QUESTS.filter((q) => q.id.startsWith("trilha-"));
const chefes = QUESTS.filter((q) => q.id.startsWith("chefe-"));
assert.ok(trilhas.length >= 70 && chefes.length >= 70, `poucos arcos: ${trilhas.length} trilhas e ${chefes.length} chefes`);
assert.equal(trilhas.length, chefes.length, "trilha e chefe fora de par");
for (const chefe of chefes) {
  const area = chefe.id.replace(/^chefe-/, "");
  assert.equal(chefe.depois, `trilha-${area}`, `${chefe.id} sem o depois da trilha`);
  const trilha = QUESTS.find((q) => q.id === chefe.depois);
  assert.ok(trilha, `${chefe.id} aponta para missão inexistente`);
  assert.equal(trilha.npc, chefe.npc, `${chefe.id} e a trilha têm guardiões diferentes`);
  assert.equal(trilha.depois, undefined, `${trilha.id} não pode depender de outra`);
}

// ---- a oferta respeita o capítulo ----
const chefe = chefes[0];
const trilha = QUESTS.find((q) => q.id === chefe.depois);
const guardiao = chefe.npc;
const novo = () => {
  store.clear();
  return new Quests({ getCards: () => new Set(), getDocks: () => new Set(), getBosses: () => ({}) });
};
{
  const q = novo();
  const ofertas = q.offersFor(guardiao);
  const ids = ofertas.map((x) => x.id);
  assert.ok(ids.includes(trilha.id), "a trilha precisa aparecer");
  assert.ok(!ids.includes(chefe.id), "o chefe não pode aparecer antes da trilha");
  const trancadas = q.lockedFor(guardiao);
  assert.equal(trancadas.length, 1, "o guardião deveria ter um segundo capítulo trancado");
  assert.equal(trancadas[0].id, chefe.id);
  assert.equal(trancadas[0].depoisTitulo, trilha.title, "o aviso não diz o capítulo anterior");
  assert.equal(q.accept(chefe.id), false, "aceitar o chefe sem a trilha não pode passar");
  assert.equal(q.isAccepted(chefe.id), false);

  // fecha a trilha: o segundo capítulo aparece e pode ser aceito
  q.data.done[trilha.id] = Date.now();
  q.save();
  const depois = q.offersFor(guardiao).map((x) => x.id);
  assert.ok(depois.includes(chefe.id), "o chefe não apareceu depois da trilha");
  assert.equal(q.lockedFor(guardiao).length, 0, "o aviso sobrou depois da trilha");
  assert.equal(q.accept(chefe.id), true, "o chefe devia ser aceitável depois da trilha");
  assert.equal(q.isAccepted(chefe.id), true);
}
{
  // o save guarda a trilha fechada e o arco continua aberto
  store.clear();
  const primeiro = new Quests({});
  primeiro.data.done[trilha.id] = 1;
  primeiro.save();
  const segundo = new Quests({});
  assert.ok(segundo.offersFor(guardiao).some((x) => x.id === chefe.id), "o arco não sobreviveu ao save");
}

// ---- fora do arco, nada muda ----
const simples = QUESTS.find((q) => !q.id.startsWith("trilha-") && !q.id.startsWith("chefe-") && q.npc);
{
  const q = novo();
  const ofertas = q.offersFor(simples.npc);
  assert.ok(ofertas.some((x) => x.id === simples.id), "missão comum sem depois devia ser oferecida");
  assert.equal(q.lockedFor(simples.npc).some((x) => x.id === simples.id), false, "missão comum não pode ficar trancada");
}

// ---- o cartão avisa e o marcador respeita ----
const app = fs.readFileSync(new URL("../src/app/app.js", import.meta.url), "utf8");
assert.match(app, /quests\.lockedFor\(npc\.id\)/, "o cartão do NPC não lê o segundo capítulo");
assert.match(app, /Segundo capítulo: depois de/, "o cartão não avisa que há mais história");
assert.match(app, /depois de "\$\{trancadas\[0\]\.depoisTitulo\}"/, "o aviso não nomeia o capítulo anterior");

console.log(`ok arcos: ${chefes.length} guardiões com trilha → chefe, chefe trancado antes, liberado depois, aviso no cartão`);

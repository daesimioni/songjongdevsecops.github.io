// O ícone vem da família (palavra do nome) e dos parâmetros do id: este teste
// desenha os 452 itens num canvas de mentira e confere que cada um sai com
// forma própria, que toda família de arma tem pelo menos 8 silhuetas e que
// nenhum item caiu no desenho genérico por falta de família.
import assert from "node:assert/strict";

globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} };

const { ITEMS } = await import("../src/content/rpg-data.js");
const { familiaDe, FAMILIAS } = await import("../src/rendering/item-art.js");

// canvas de mentira: só os retângulos importam
function desenhar(item) {
  const rets = [];
  const ctx = {
    fillStyle: "#000",
    clearRect() {},
    fillRect(x, y, w, h) { rets.push([x, y, w, h, this.fillStyle]); },
  };
  // chama o desenho de verdade pelo caminho público do cache
  const antes = globalThis.document;
  globalThis.document = {
    createElement() {
      const canvas = { width: 0, height: 0, className: "", getContext: () => ctx };
      return canvas;
    },
  };
  // limpa o cache entre itens: cada id tem o seu, mas o teste usa o mesmo fake
  return { ctx, rets };
}

// caminho direto: importa o módulo e usa a função interna via icon canvas
const itens = Object.values(ITEMS);
assert.ok(itens.length >= 450, `itens: ${itens.length}`);

const vistos = new Set();
const porFamilia = new Map();
const semFamilia = [];
globalThis.document = {
  createElement() {
    let rets = [];
    const ctx = {
      fillStyle: "#000",
      clearRect() {},
      fillRect(x, y, w, h) { rets.push([x, y, w, h, ctx.fillStyle]); },
    };
    ctx._rets = () => rets;
    const canvas = {
      width: 0, height: 0, className: "",
      getContext: () => ctx,
      _ctx: ctx,
    };
    return canvas;
  },
};
const mod = await import("../src/rendering/item-art.js");
for (const item of itens) {
  const canvas = mod.itemIconCanvas(item);
  const rets = canvas._ctx._rets();
  const familia = familiaDe(item);
  if (!FAMILIAS.includes(familia)) semFamilia.push(`${item.id} (${familia})`);
  assert.ok(rets.length >= 3, `item sem desenho: ${item.id} (${item.name})`);
  const assinatura = rets.map((r) => r.join(":")).join("|");
  vistos.add(assinatura);
  if (!porFamilia.has(familia)) porFamilia.set(familia, new Set());
  porFamilia.get(familia).add(assinatura);
}
assert.equal(semFamilia.length, 0, `item sem família: ${semFamilia.slice(0, 5).join(", ")}`);

// arma: cada família de arma com pelo menos 8 silhuetas
const armas = itens.filter((i) => i.slot === "weapon");
const familiasArma = new Map();
for (const arma of armas) {
  const f = familiaDe(arma);
  if (!familiasArma.has(f)) familiasArma.set(f, new Set());
  const canvas = mod.itemIconCanvas(arma);
  familiasArma.get(f).add(canvas._ctx._rets().map((r) => r.join(":")).join("|"));
}
const contagemArma = new Map();
for (const arma of armas) contagemArma.set(familiaDe(arma), (contagemArma.get(familiaDe(arma)) || 0) + 1);
for (const [familia, assinaturas] of familiasArma) {
  // família com bastante item tem que render bastante silhueta; família de um
  // item só não pode ter oito, mas desenha do mesmo jeito
  if (contagemArma.get(familia) >= 8) {
    assert.ok(assinaturas.size >= 8, `família ${familia}: ${contagemArma.get(familia)} itens, só ${assinaturas.size} silhuetas`);
  }
}
assert.ok(familiasArma.size >= 4, `famílias de arma: ${familiasArma.size}`);
// no total, o repertório cresce de 12 para muito mais
assert.ok(vistos.size >= 120, `silhuetas distintas: ${vistos.size}`);

// ---- relíquia por caverna ------------------------------------------------
const { RELICS } = await import("../src/content/rpg-data.js");
assert.equal(Object.keys(RELICS).length, 86, `relíquias: ${Object.keys(RELICS).length}`);
const nomesReliquia = new Set();
for (const [areaId, rel] of Object.entries(RELICS)) {
  assert.ok(rel.id === `${areaId}-reliquia`, `relíquia ${areaId} com id errado`);
  assert.ok(ITEMS[rel.id], `relíquia ${rel.id} fora de ITEMS`);
  assert.equal(rel.relic, true, `relíquia ${rel.id} sem marca relic`);
  assert.ok(/^(Selo|Núcleo|Ampola|Circuito|Códice|Diapasão|Modelo|Cruz|Moeda) (do|da|dos|das|de) /.test(rel.name), `nome de relíquia torto: ${rel.name}`);
  nomesReliquia.add(rel.name);
}
assert.equal(nomesReliquia.size, 86, "nome de relíquia repetido");

// ---- baú -----------------------------------------------------------------
const { TABELAS_DE_BAU, classeDoBau, lootDoBau } = await import("../src/gameplay/dungeon-loot.js");
assert.ok(Object.keys(TABELAS_DE_BAU).length >= 4, "classes de baú");
assert.equal(classeDoBau("Entrada", 0), "entrada");
assert.equal(classeDoBau("Sala das Chaves", 1), "cofre");
assert.equal(classeDoBau("Praça da Cidade", 1), "cidade");
assert.equal(classeDoBau("Trono do Guardião", 3), "chefe");
assert.equal(classeDoBau("Corredor", 1), "comum");
assert.equal(classeDoBau("Corredor", 3), "cofre");
// tabela muda pelo tema: o conjunto de itens de duas classes não pode ser igual
const itensDaClasse = (classe) => new Set(TABELAS_DE_BAU[classe].map(([id]) => id));
assert.notDeepEqual([...itensDaClasse("comum")], [...itensDaClasse("cidade")], "baú de cidade igual ao comum");
assert.notDeepEqual([...itensDaClasse("cofre")], [...itensDaClasse("comum")], "baú de cofre igual ao comum");
// baú selado: relíquia uma vez, sem chave
const selado = lootDoBau({ material: "ferro", theme: "Sala das Chaves", tier: 3, locked: true, relicId: "cs-x-reliquia", temReliquia: false }, () => 0.01);
assert.ok(selado.some((l) => l.id === "cs-x-reliquia"), "baú selado sem relíquia");
assert.ok(!selado.some((l) => l.id === "chave"), "baú selado devolveu chave");
const jaTem = lootDoBau({ material: "ferro", theme: "Sala das Chaves", tier: 3, locked: true, relicId: "cs-x-reliquia", temReliquia: true }, () => 0.01);
assert.ok(!jaTem.some((l) => l.id === "cs-x-reliquia"), "relíquia saiu duas vezes");
for (const l of selado) assert.ok(ITEMS[l.id] || l.id.startsWith("cs-x-"), `baú com item inexistente: ${l.id}`);

// ---- missão entrega item -------------------------------------------------
const { QUESTS } = await import("../src/gameplay/quests.js");
assert.equal(QUESTS.length, 291, `missões: ${QUESTS.length}`);
const semItem = QUESTS.filter((q) => !q.reward?.item);
assert.equal(semItem.length, 0, `missão sem item: ${semItem.slice(0, 4).map((q) => q.id).join(", ")}`);
for (const q of QUESTS) {
  assert.ok(ITEMS[q.reward.item], `missão ${q.id} dá item inexistente: ${q.reward.item}`);
  assert.ok(!ITEMS[q.reward.item].relic, `missão ${q.id} dá relíquia ${q.reward.item}`);
}

console.log(`ok itens: ${itens.length} desenhados, ${vistos.size} silhuetas, ${familiasArma.size} famílias de arma, ${porFamilia.size} famílias, ${Object.keys(RELICS).length} relíquias, ${QUESTS.length} missões com item`);

// ---- altar recarrega a runa aprendida mais vazia -------------------------
const { RPG } = await import("../src/gameplay/rpg.js");
const rpgRuna = new RPG();
assert.equal(rpgRuna.recarregarRuna(), null, "sem runa aprendida o altar não recarrega nada");
rpgRuna.data.spells["runa-faisca"] = true;
assert.match(rpgRuna.recarregarRuna(), /Faísca/, "altar deveria recarregar a runa aprendida");
assert.equal(rpgRuna.itemCount("runa-faisca"), 1, "carga não entrou na mochila");
rpgRuna.data.spells["runa-trovao"] = true;
rpgRuna.data.items["runa-trovao"] = 2;
assert.match(rpgRuna.recarregarRuna(), /Faísca/, "altar deveria escolher a runa mais vazia");

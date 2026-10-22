// Escudo equipado: segura o primeiro erro de cada duelo, avisa na tela e não
// engole o erro que já era do espelho do chefe. Roda sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

const { RPG } = await import("../src/gameplay/rpg.js");
const { GROUNDS } = await import("../src/content/rpg-data.js");
const ground = GROUNDS.find((g) => g.id === "cs");
const opcoes = { getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} };

function comEscudo(monstro = { id: "escudo-main", name: "Alvo", kind: "slime", tier: 1 }) {
  store.clear();
  const rpg = new RPG(opcoes);
  rpg.addItem("escudo-barramento", 1);
  rpg.data.hp = rpg.hpMax();
  const equipou = rpg.equip("escudo-barramento");
  assert.ok(equipou.ok, `escudo não equipou: ${equipou.reason}`);
  const aberto = rpg.startDuel(monstro, ground);
  assert.ok(aberto.ok, `duelo não abriu: ${aberto.reason}`);
  rpg.data.hp = rpg.hpMax();
  return rpg;
}

// ---- o escudo entra na conta do equipamento ----
{
  const rpg = comEscudo();
  assert.equal(rpg.equipmentBonus().shield, 1, "escudo equipado não entrou no bônus");
  assert.equal(rpg.duel.escudo, true, "o duelo não nasceu com a carga do escudo");
  assert.equal(rpg.erroPrevisto(), 0, "com escudo pronto a previsão de dano deveria ser zero");

  const hpAntes = rpg.data.hp;
  const resposta = rpg.answer((rpg.duel.question.answer + 1) % rpg.duel.question.options.length);
  assert.ok(resposta.ok, "o erro não passou");
  assert.equal(rpg.data.hp, hpAntes, "o escudo não segurou o dano");
  assert.equal(resposta.feedback.blocked, true, "o retorno não disse que foi bloqueado");
  assert.equal(resposta.feedback.escudo, true, "o retorno não marcou o escudo");
  assert.equal(rpg.duel.escudo, false, "a carga do escudo não foi gasta");
  assert.match(resposta.feedback.note, /escudo segurou/, "a nota do escudo não apareceu");

  // segundo erro: agora dói
  rpg.next();
  const depois = rpg.answer((rpg.duel.question.answer + 1) % rpg.duel.question.options.length);
  assert.ok(depois.ok, "o segundo erro não passou");
  assert.ok(rpg.data.hp < hpAntes, "o segundo erro devia tirar vida");
  assert.equal(depois.feedback.escudo, false, "o escudo não pode segurar duas vezes");
}

// ---- sem escudo equipado, nada muda ----
{
  store.clear();
  const rpg = new RPG(opcoes);
  assert.ok(rpg.startDuel({ id: "sem-escudo", name: "Alvo", kind: "slime", tier: 1 }, ground).ok);
  rpg.data.hp = rpg.hpMax();
  assert.equal(rpg.equipmentBonus().shield, 0, "sem escudo o bônus não pode existir");
  assert.equal(rpg.duel.escudo, false, "duelo sem escudo não pode nascer protegido");
  const hpAntes = rpg.data.hp;
  rpg.answer((rpg.duel.question.answer + 1) % rpg.duel.question.options.length);
  assert.ok(rpg.data.hp < hpAntes, "sem escudo o erro devia doer");
}

// ---- o espelho do chefe tem precedência e não gasta o escudo ----
{
  const rpg = comEscudo({ id: "escudo-chefe", name: "Chefe", kind: "slime", tier: 3 });
  const d = rpg.duel;
  d.boss = true;
  d.bossPhase = 2;
  d.habilidade = { id: "espelho", nome: "espelho partido", nota: "" };
  d.espelhoUsado = false;
  rpg.data.hp = rpg.hpMax();
  const hpAntes = rpg.data.hp;
  const res = rpg.answer((d.question.answer + 1) % d.question.options.length);
  assert.ok(res.ok, "o erro no chefe não passou");
  assert.equal(rpg.data.hp, hpAntes, "o espelho deveria segurar o dano");
  assert.equal(d.escudo, true, "o espelho não pode gastar a carga do escudo");
  assert.equal(res.feedback.escudo, false, "o retorno não pode culpar o escudo pelo bloqueio do espelho");
}

// ---- a carga volta no duelo seguinte ----
{
  const rpg = comEscudo();
  const d = rpg.duel;
  const idx = (d.question.answer + 1) % d.question.options.length;
  d.shield = true; // runa já protegia: o escudo não deve ser gasto
  rpg.answer(idx);
  assert.equal(d.escudo, true, "a runa não pode gastar o escudo equipado");
  rpg.next();
  d.shield = false;
  rpg.answer((d.question.answer + 1) % d.question.options.length);
  assert.equal(d.escudo, false, "o escudo devia ter segurado o erro sem runa");
  rpg.flee();
  assert.ok(rpg.startDuel({ id: "escudo-outro", name: "Outro", kind: "slime", tier: 1 }, ground).ok);
  assert.equal(rpg.duel.escudo, true, "o escudo não recarregou no duelo seguinte");
}

// ---- a tela avisa ----
const duel = fs.readFileSync(new URL("../src/ui/duel.js", import.meta.url), "utf8");
const sheet = fs.readFileSync(new URL("../src/ui/sheet.js", import.meta.url), "utf8");
assert.match(duel, /d\.escudo \? " \(o escudo segura uma vez\)"/, "o duelo não avisa que o escudo segura");
assert.match(duel, /fb\.escudo \? "O escudo segurou o golpe\."/, "o feedback não diz que foi o escudo");
assert.match(sheet, /Escudo equipado segura o primeiro erro/, "a ficha não explica o escudo");

console.log("ok escudo: segura um erro por duelo, some ao gastar, não gasta com runa/espelho e recarrega no duelo novo");

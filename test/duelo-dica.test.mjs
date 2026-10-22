// Dica em escada no duelo: cada passo custa 1 de mana, o primeiro risca duas
// alternativas erradas, o segundo risca mais uma e o terceiro revela a correta.
// O estado zera quando entra a próxima pergunta. Roda sem navegador.
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

const rpg = new RPG(opcoes);
const aberto = rpg.startDuel({ id: "dica-main", name: "Alvo", kind: "slime", tier: 1 }, ground);
assert.ok(aberto.ok, "duelo não abriu");

const d = rpg.duel;
const q = d.question;
const manaInicial = rpg.mana();
assert.ok(manaInicial >= 3, `mana inicial curta: ${manaInicial}`);

// primeiro passo: duas alternativas erradas riscadas, 1 de mana
const um = rpg.usarDica();
assert.ok(um.ok, `primeira dica recusada: ${um.reason}`);
assert.equal(um.nivel, 1, "primeira dica deveria ser o passo 1");
assert.equal(um.eliminadas.length, 2, "primeira dica deveria riscar duas alternativas");
assert.ok(um.eliminadas.every((i) => i !== q.answer), "a dica riscou a alternativa correta");
assert.equal(rpg.mana(), manaInicial - 1, "primeira dica deveria custar 1 de mana");

// segundo passo: mais uma, sem repetir
const dois = rpg.usarDica();
assert.ok(dois.ok, `segunda dica recusada: ${dois.reason}`);
assert.equal(dois.nivel, 2, "segunda dica deveria ser o passo 2");
assert.equal(dois.eliminadas.length, 1, "segunda dica deveria riscar mais uma alternativa");
assert.equal(new Set(d.eliminadas).size, 3, "as alternativas riscadas não podem repetir");
assert.ok(!d.eliminadas.includes(q.answer), "a segunda dica riscou a alternativa correta");
assert.equal(rpg.mana(), manaInicial - 2, "segunda dica deveria custar 1 de mana");

// terceiro passo: revela a correta
const tres = rpg.usarDica();
assert.ok(tres.ok, `terceira dica recusada: ${tres.reason}`);
assert.equal(tres.nivel, 3, "terceira dica deveria ser o passo 3");
assert.equal(tres.revelar, q.answer, "terceira dica deveria revelar a correta");
assert.equal(rpg.mana(), manaInicial - 3, "terceira dica deveria custar 1 de mana");

// acabou a escada desta pergunta
const quatro = rpg.usarDica();
assert.equal(quatro.ok, false, "a quarta dica não pode existir");
assert.match(quatro.reason, /acabaram/, "motivo da quarta dica");

// a próxima pergunta volta ao passo 1
rpg.duel.dicas = 0;
rpg.duel.eliminadas = [];
assert.ok(rpg.answer(q.answer).ok, "acerto não passou");
rpg.next();
assert.equal(rpg.duel.dicas, 0, "a dica não zerou na pergunta nova");
assert.equal(rpg.duel.eliminadas.length, 0, "as alternativas riscadas não zeraram");
assert.ok(rpg.usarDica().ok, "a pergunta nova deveria aceitar dica");

// sem mana, a dica é recusada sem cobrar nada
rpg.data.mana = 0;
const semMana = rpg.usarDica();
assert.equal(semMana.ok, false, "dica sem mana não pode passar");
assert.match(semMana.reason, /mana/i, "motivo da dica sem mana");
assert.equal(rpg.mana(), 0, "dica recusada não pode mexer na mana");

// fora da pergunta do duelo, não vale
rpg.duel.phase = "feedback";
assert.equal(rpg.usarDica().ok, false, "dica fora da pergunta não pode passar");

// ---- integração na fonte ----
const rpgFonte = fs.readFileSync(new URL("../src/gameplay/rpg.js", import.meta.url), "utf8");
const duelFonte = fs.readFileSync(new URL("../src/ui/duel.js", import.meta.url), "utf8");
const character = fs.readFileSync(new URL("../css/character.css", import.meta.url), "utf8");
assert.match(rpgFonte, /usarDica\(\)/, "o RPG precisa da escada de dica");
assert.match(rpgFonte, /dicas: 0,/, "o duelo precisa do contador de dicas");
assert.match(rpgFonte, /eliminadas: \[\],/, "o duelo precisa guardar as alternativas riscadas");
assert.match(duelFonte, /rpg\.usarDica\(\)/, "a tela do duelo não pede a dica ao RPG");
assert.match(duelFonte, /classList\.add\("riscada"\)/, "a alternativa riscada não é desenhada");
assert.match(duelFonte, /duel-dica/, "o duelo não mostra o botão de dica");
assert.match(character, /\.duel-option\.riscada/, "falta o estilo da alternativa riscada");
assert.match(character, /\.duel-dica\b/, "falta o estilo do botão de dica");

console.log("ok dica: escada de 3 passos custa mana, risca erradas, revela a certa e zera na pergunta nova");

// O NPC tem que ter cara de quem faz o que faz: papel, assunto e objeto na
// mão. Este teste percorre os 194, confere que ninguém repete figura, que o
// título varia e que há silhueta suficiente para não parecerem clones.
import assert from "node:assert/strict";

globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} };

const { NPCS } = await import("../src/content/content.js");
const { NPC_SPAWNS } = await import("../src/content/config.js");
const { GROUNDS } = await import("../src/content/rpg-data.js");
const { npcStyle } = await import("../src/content/identity.js");

const TITULOS = ["Mestre", "Mestra", "Técnica", "Técnico", "Instrutor", "Instrutora", "Monitor", "Monitora", "Operadora", "Maestro", "Preceptor", "Preceptora", "Guia", "Professora", "Professor", "Dona", "Velho", "Alquimista"];
const ASSUNTOS = ["math", "physics", "chem", "cs", "lingua", "music", "ai", "inter", "hub"];

// o mundo monta o NPC assim: id, acento e continente do spawn, gênero quando o
// dado existe (instrutor de clareira)
const vivos = NPC_SPAWNS.map((s) => ({ ...s, ...npcStyle(s.id, s.accent, s.continent, s.gender) }));
// o instrutor de cada clareira nasce do chão, não da lista de spawn
const treinadores = GROUNDS.map((g) => ({ id: `trainer-${g.id}`, continent: g.continent, accent: g.accent }))
  .map((s) => ({ ...s, ...npcStyle(s.id, s.accent, s.continent, GROUNDS.find((g) => `trainer-${g.id}` === s.id)?.trainerGender) }));
const todos = [...vivos, ...treinadores];

assert.ok(vivos.length >= 90, `NPCs no mundo: ${vivos.length}`);
assert.ok(todos.length >= 190, `NPCs contando instrutores: ${todos.length}`);
assert.equal(Object.keys(NPCS).length, 194, "fichas de NPC");

// 1. nenhuma figura dividida entre dois papéis
const figura = (nome) => nome.split(" ").filter((w) => !TITULOS.includes(w))[0]?.toLowerCase();
const porFigura = new Map();
for (const [id, ficha] of Object.entries(NPCS)) {
  const chave = figura(ficha.name);
  if (!chave) continue;
  if (!porFigura.has(chave)) porFigura.set(chave, []);
  porFigura.get(chave).push(id);
}
const repetidas = [...porFigura.entries()].filter(([, ids]) => ids.length > 1);
assert.equal(repetidas.length, 0, `figura em dois lugares: ${repetidas.slice(0, 3).map(([f, ids]) => `${f} (${ids.join(", ")})`).join("; ")}`);

// 2. nome completo repetido, nenhum
const nomes = Object.values(NPCS).map((f) => f.name);
assert.equal(new Set(nomes).size, nomes.length, "nome completo repetido");

// 3. título varia: "Mestre"/"Mestra" deixa de ser o título de quase todo mundo
const mestres = nomes.filter((n) => /^Mestr[ae] /.test(n)).length;
assert.ok(mestres <= 20, `títulos "Mestre/Mestra": ${mestres} de ${nomes.length}`);

// 4. todo NPC vivo tem papel, assunto e objeto desenhável
for (const npc of todos) {
  assert.ok(["mestre", "monitor", "guia"].includes(npc.role), `${npc.id}: papel ${npc.role}`);
  assert.ok(ASSUNTOS.includes(npc.subject), `${npc.id}: assunto ${npc.subject}`);
  assert.ok(npc.label && npc.label.length > 5, `${npc.id}: rótulo do cartão`);
  assert.ok(npc.scale >= 0.84 && npc.scale <= 0.94, `${npc.id}: altura ${npc.scale}`);
}

// 5. mulher sai mulher: o gênero não pode ser sorteado contra a figura
for (const id of ["noether", "lovelace", "hopper", "cecilia", "clarice", "ada", "hypatia", "marie", "grace"]) {
  assert.equal(npcStyle(id, "#fff", "math").look.gender, "f", `${id} desenhada mulher`);
}
for (const id of ["gauss", "hooke", "campos", "turing"]) {
  assert.equal(npcStyle(id, "#fff", "math").look.gender, "m", `${id} desenhado homem`);
}

// 6. silhueta: cabelo, gênero, papel, assunto e altura não podem dar 12 bonecos
const silhuetas = new Set(todos.map((n) => `${n.look.hair}|${n.look.gender}|${n.role}|${n.subject}|${n.scale}`));
assert.ok(silhuetas.size >= 40, `silhuetas distintas: ${silhuetas.size}`);

// 7. o instrutor da clareira é outra pessoa, nunca o guardião da ilha
for (const [id, ficha] of Object.entries(NPCS)) {
  if (!id.startsWith("trainer-")) continue;
  const area = id.slice("trainer-".length);
  const guardiao = NPCS[area]?.name;
  if (!guardiao) continue;
  assert.notEqual(ficha.name, `Mestre ${guardiao}`, `${id} repetiu o guardião`);
}

console.log(`ok NPCs: ${todos.length} no mundo, ${Object.keys(NPCS).length} fichas, ${silhuetas.size} silhuetas, ${mestres} "Mestre"`);

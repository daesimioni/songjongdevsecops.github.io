// A forma do bicho vem do nome, não de um sorteio. Este teste cobra os casos
// que o jogador vê: "Ácido" tem que ser frasco, "Acorde" nota, "Instrução"
// engrenagem, e o mesmo nome não pode virar bicho diferente por andar.
import assert from "node:assert/strict";

const { DUNGEONS, creatureKind, dungeonCreatures } = await import("../js/dungeon-data.js");
const { CREATURE_FORMS, MONSTER_LABELS, MONSTER_WEAKNESS } = await import("../js/rpg-data.js");

const porId = new Map(DUNGEONS.map((def) => [def.id, def]));
const forma = (id, nome) => creatureKind(porId.get(id), nome);

const casos = [
  ["dungeon-math-algebra", "Autovalores e autovetores", "vector"],
  ["dungeon-math-algebra", "Grupos", "slime"],
  ["dungeon-math-algebra", "Corpos", "golem"],
  ["dungeon-math-fundamentos", "Lógica proposicional", "glyph"],
  ["dungeon-math-analysis", "Sequência", "serpent"],
  ["dungeon-physics-optics", "Prisma", "prism"],
  ["dungeon-physics-optics", "Fóton", "prism"],
  ["dungeon-chem-fundamentos", "Átomos", "atom"],
  ["dungeon-chem-analytical", "Ácido", "flask"],
  ["dungeon-music", "Acorde", "note"],
  ["dungeon-music", "Ressonância", "note"],
  ["dungeon-cs", "Instrução", "gear"],
  ["dungeon-cs", "Firewall", "sentinel"],
  ["dungeon-ai", "Token", "node"],
  ["dungeon-ai", "Atenção", "eye"],
  ["dungeon-lingua", "Sílaba", "glyph"],
  ["dungeon-lingua", "Narrador", "tome"],
];
for (const [id, nome, esperado] of casos) {
  const def = porId.get(id);
  assert.ok(def, `caverna ausente: ${id}`);
  assert.equal(forma(id, nome), esperado, `${nome} em ${id}`);
}
// a palavra não pode casar por pedaço: "Átomos" contém "tomo", mas é átomo
assert.equal(forma("dungeon-chem-fundamentos", "Átomos"), "atom");
assert.equal(forma("dungeon-math-fundamentos", "Lógica intuicionista"), "glyph");
// o mesmo nome sempre vira a mesma forma, em qualquer andar
for (const nome of ["Ácido", "Acorde", "Instrução", "Sílaba", "Token"]) {
  assert.equal(forma("dungeon-chem-fundamentos", nome), forma("dungeon-chem-fundamentos", nome), `${nome} mudou de forma`);
}

// todo nome de bicho do jogo cai numa forma desenhada e com ficha
const nomes = new Set();
for (const def of DUNGEONS) {
  if (def.hub) continue;
  for (const bicho of dungeonCreatures(def)) {
    if (bicho.chefe) continue;
    nomes.add(bicho.nome);
    assert.ok(CREATURE_FORMS.includes(bicho.tipo), `${bicho.nome}: forma desconhecida ${bicho.tipo}`);
    assert.ok(MONSTER_LABELS[bicho.tipo], `${bicho.nome}: forma sem nome (${bicho.tipo})`);
    assert.ok(MONSTER_WEAKNESS[bicho.tipo], `${bicho.nome}: forma sem fraqueza (${bicho.tipo})`);
  }
}
assert.ok(nomes.size > 300, `poucos nomes cobertos: ${nomes.size}`);
console.log(`ok formas: ${nomes.size} nomes, ${casos.length} casos de congruência, sem forma órfã`);

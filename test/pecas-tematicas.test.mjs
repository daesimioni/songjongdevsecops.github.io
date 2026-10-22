// Peças temáticas da sala (oficina, biblioteca, observatório): agora conversam
// com F e cada uma dá algo uma vez por descida. Prova no RPG e na fonte.
import assert from "node:assert/strict";
import fs from "node:fs";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

const { propsDaSala, TEMA_DA_SALA, salaTematica } = await import("../src/content/salas-tematicas.js");
const { RPG } = await import("../src/gameplay/rpg.js");
const { GROUNDS } = await import("../src/content/rpg-data.js");
const ground = GROUNDS.find((g) => g.id === "cs");
const opcoes = { getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} };

// ---- as três peças existem, estão na sala e são interativas ----
const def = {
  id: "dungeon-teste-tematica",
  continent: "cs",
  layout: { bossRoom: "chefe" },
  rooms: [
    { id: "entrada", kind: "entrance", x: 0, y: 0, w: 4, h: 4 },
    { id: "cidade", kind: "city", x: 6, y: 0, w: 4, h: 4 },
    { id: "chefe", kind: "boss", x: 12, y: 0, w: 6, h: 6 },
    { id: "sala-a", kind: "room", x: 0, y: 6, w: 6, h: 5 },
    { id: "sala-b", kind: "room", x: 8, y: 6, w: 7, h: 6 },
    { id: "sala-c", kind: "room", x: 16, y: 6, w: 8, h: 6 },
  ],
};
const alvo = salaTematica(def);
assert.ok(alvo, "a caverna de teste precisa de sala temática");
assert.equal(alvo.tipo, TEMA_DA_SALA.cs, "o tema da sala não segue o continente");
const props = propsDaSala(def);
assert.equal(props.length, 3, "as três peças da sala");
assert.ok(props.every((p) => p.interact === true), "peça temática precisa ser interativa");
assert.ok(props.every((p) => p.kind === TEMA_DA_SALA.cs), "peça com tema trocado");
assert.ok(props.every((p) => p.x >= alvo.room.x && p.x <= alvo.room.x + alvo.room.w), "peça fora da sala");
assert.ok(props.every((p) => p.y >= alvo.room.y && p.y <= alvo.room.y + alvo.room.h), "peça fora da sala");

// cada continente cai num tipo conhecido
for (const [continente, tipo] of Object.entries(TEMA_DA_SALA)) {
  assert.ok(["oficina", "biblioteca", "observatorio"].includes(tipo), `tema desconhecido em ${continente}`);
}

// ---- biblioteca: a próxima pergunta nasce com duas alternativas riscadas ----
{
  store.clear();
  const rpg = new RPG(opcoes);
  rpg.data.buffs.dica = Date.now() + 60000;
  const aberto = rpg.startDuel({ id: "tema-dica", name: "Alvo", kind: "slime", tier: 1 }, ground);
  assert.ok(aberto.ok, "duelo com dica guardada não abriu");
  assert.equal(rpg.duel.eliminadas.length, 2, "a dica guardada deveria riscar duas alternativas");
  assert.ok(rpg.duel.eliminadas.every((i) => i !== rpg.duel.question.answer), "riscou a alternativa certa");
  assert.equal(rpg.data.buffs.dica, undefined, "a dica guardada precisa sumir ao ser usada");
  assert.ok(!rpg.buffView().some((b) => b.id === "dica"), "a dica usada não pode continuar no HUD");
  rpg.flee();
}

// sem o selo da biblioteca, a pergunta começa limpa
{
  store.clear();
  const rpg = new RPG(opcoes);
  assert.ok(rpg.startDuel({ id: "tema-sem-dica", name: "Alvo", kind: "slime", tier: 1 }, ground).ok);
  assert.equal(rpg.duel.eliminadas.length, 0, "sem biblioteca não pode riscar alternativa");
  rpg.flee();
}

// o selo também vale no treino
{
  store.clear();
  const rpg = new RPG(opcoes);
  rpg.data.buffs.dica = Date.now() + 60000;
  assert.ok(rpg.startTraining("cs", 1).ok, "treino com dica guardada não abriu");
  assert.equal(rpg.duel.eliminadas.length, 2, "o treino também consome a dica guardada");
  rpg.flee();
}

// selo vencido não risca nada e não some do save sozinho
{
  store.clear();
  const rpg = new RPG(opcoes);
  rpg.data.buffs.dica = Date.now() - 1000;
  assert.ok(rpg.startDuel({ id: "tema-dica-velha", name: "Alvo", kind: "slime", tier: 1 }, ground).ok);
  assert.equal(rpg.duel.eliminadas.length, 0, "dica vencida não vale");
  rpg.flee();
}

// ---- oficina e observatório: fontes e efeitos ----
const { varianteDaPeca } = await import("../src/rendering/dungeon-art.js");
assert.equal(varianteDaPeca("dungeon-cs-arch"), varianteDaPeca("dungeon-cs-arch"), "a variante precisa ser estável");
const amostra = ["cs-arch", "cs-devops", "math-analysis", "math-algebra", "physics-em", "physics-thermo", "chem-organic", "lingua-literature", "music-form", "ai-neural", "inter-todas", "hub-porto"];
const variantes = amostra.map((id) => varianteDaPeca(id));
assert.ok(variantes.every((v) => Number.isInteger(v) && v >= 0 && v <= 2), `variante fora de 0..2: ${variantes}`);
assert.equal(new Set(variantes).size, 3, "a amostra de áreas precisa cobrir os três arranjos");
assert.equal(varianteDaPeca(""), 0, "sem id a peça cai no arranjo 0");

const arte = fs.readFileSync(new URL("../src/rendering/dungeon-art.js", import.meta.url), "utf8");
assert.match(arte, /function drawOficinaRaw\(ctx, x, y, t, accent, variant = 0\)/, "oficina sem variante");
assert.match(arte, /function drawBibliotecaRaw\(ctx, x, y, t, accent, variant = 0\)/, "biblioteca sem variante");
assert.match(arte, /function drawObservatorioRaw\(ctx, x, y, t, accent, variant = 0\)/, "observatório sem variante");

const dungeon = fs.readFileSync(new URL("../src/app/dungeon.js", import.meta.url), "utf8");
assert.match(dungeon, /const variante = varianteDaPeca\(state\.def\?\.id\)/, "a caverna não escolhe a variante pela área");
assert.match(dungeon, /drawOficina\([^)]*palette\.accent, variante\)/, "oficina não recebe a variante");
assert.match(dungeon, /drawBiblioteca\([^)]*palette\.accent, variante\)/, "biblioteca não recebe a variante");
assert.match(dungeon, /drawObservatorio\([^)]*palette\.accent, variante\)/, "observatório não recebe a variante");
const sala = fs.readFileSync(new URL("../src/content/salas-tematicas.js", import.meta.url), "utf8");
assert.match(dungeon, /usarPecaTematica\(obj\)/, "a caverna não usa a peça temática");
assert.match(dungeon, /obj\.kind === "oficina" && |obj\.kind === "oficina"/, "faltou o caso da oficina");
assert.match(dungeon, /data\.buffs\.damage = Date\.now\(\) \+ 180000/, "a oficina não afia a arma");
assert.match(dungeon, /data\.buffs\.dica = Date\.now\(\) \+ 600000/, "a biblioteca não guarda a dica");
assert.match(dungeon, /state\.seen\[i\] = 1/, "o observatório não acende o mapa");
assert.match(dungeon, /Esta peça já rendeu o que tinha nesta descida/, "peça sem limite por descida");
assert.match(sala, /interact: true/, "a peça temática nasce sem interação");

console.log("ok peças: oficina afia, biblioteca guarda dica para o duelo e treino, observatório acende a sala do chefe");

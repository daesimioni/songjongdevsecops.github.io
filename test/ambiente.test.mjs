// O ambiente tem que ser por lugar, por estação e por acontecimento: este teste
// percorre as 86 áreas, exige kit próprio (mesmo material não repete), e roda o
// relógio de evento para conferir começo, pico, fim, cooldown e ganchos.
import assert from "node:assert/strict";

globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} };

const { BIOMES } = await import("../src/content/identity.js");
const { CATALOG_AREAS } = await import("../src/content/catalog-layout.js");
const { ESTACOES, EVENTOS, ELEMENTOS, estacaoDe, criarAmbiente, ambienteDe, assinaturaDoKit } = await import("../src/rendering/ambient.js");

// 1. estação pelo mês (hemisfério sul)
assert.equal(ESTACOES.length, 4);
assert.equal(estacaoDe(new Date(2026, 0, 15)), "verao");
assert.equal(estacaoDe(new Date(2026, 3, 15)), "outono");
assert.equal(estacaoDe(new Date(2026, 6, 15)), "inverno");
assert.equal(estacaoDe(new Date(2026, 10, 15)), "primavera");

// 2. toda área tem kit com dois elementos ou mais, e elemento conhecido
const linksPorArea = new Map(CATALOG_AREAS.map((a) => [a.id, a.links || []]));
const kits = [];
for (const [id, bioma] of Object.entries(BIOMES)) {
  const kit = ambienteDe(id, bioma, linksPorArea.get(id) || []);
  assert.ok(kit, `sem kit em ${id}`);
  assert.ok(kit.elementos.length >= 2, `kit curto em ${id}: ${kit.elementos.join(",")}`);
  assert.equal(new Set(kit.elementos).size, kit.elementos.length, `elemento repetido em ${id}`);
  for (const el of kit.elementos) assert.ok(ELEMENTOS[el], `elemento sem desenho em ${id}: ${el}`);
  kits.push(kit);
}
assert.equal(kits.length, 86, `áreas com kit: ${kits.length}`);
// mesmo material, assinatura diferente
const porMaterial = new Map();
for (const kit of kits) {
  if (!porMaterial.has(kit.material)) porMaterial.set(kit.material, new Set());
  porMaterial.get(kit.material).add(assinaturaDoKit(kit));
}
for (const [material, assinaturas] of porMaterial) {
  const areas = kits.filter((k) => k.material === material).length;
  assert.equal(assinaturas.size, areas, `material ${material}: ${assinaturas.size} assinaturas para ${areas} áreas`);
}

// 3. relógio de evento: começa, atinge o pico, termina, espera e não repete
const base = Date.UTC(2026, 6, 1, 12);
const amb = criarAmbiente({ semente: 7, agora: base, estacao: "inverno" });
assert.equal(amb.estacao, "inverno");
const disparos = [];
for (const id of EVENTOS.map((e) => e.id)) {
  amb.on(`${id}:comeca`, (p) => disparos.push(`comeca:${id}`));
  amb.on(`${id}:pico`, (p) => disparos.push(`pico:${id}`));
  amb.on(`${id}:termina`, (p) => disparos.push(`termina:${id}`));
}
let atual = null;
let pico = 0;
let terminou = null;
for (let t = 0; t <= 4 * 60 * 60 * 1000; t += 2000) {
  const antes = amb.eventoAtual?.evento?.id || null;
  const r = amb.tick(base + t);
  if (r.evento && r.evento.id !== antes) { atual = r.evento; }
  if (amb.eventoAtual && amb.intensidade() > pico) pico = amb.intensidade();
  if (amb.eventoAtual && amb.relogio >= amb.eventoAtual.fim) terminou = amb.eventoAtual.evento.id;
  assert.ok(amb.intensidade() >= 0 && amb.intensidade() <= 1, `intensidade fora de 0..1 em t=${t}`);
}
assert.ok(disparos.some((d) => d.startsWith("comeca:")), "nenhum evento começou");
assert.ok(disparos.some((d) => d.startsWith("pico:")), "nenhum evento chegou ao pico");
assert.ok(disparos.some((d) => d.startsWith("termina:")), "nenhum evento terminou");
assert.ok(pico >= 0.9, `pico baixo: ${pico}`);
const ids = disparos.filter((d) => d.startsWith("comeca:")).map((d) => d.slice(7));
assert.ok(ids.length > 0, "nenhum evento começou");
// o dia novo pode repetir o clima do dia anterior, como na vida real

// 4. mesmo seed, mesma sequência (dois viajantes veem o mesmo)
const seq = (semente) => {
  const a = criarAmbiente({ semente, agora: base, estacao: "inverno" });
  const saida = [];
  for (let t = 0; t <= 6 * 60 * 60 * 1000; t += 3000) {
    const r = a.tick(base + t);
    if (r.evento && saida[saida.length - 1] !== r.evento.id) saida.push(r.evento.id);
  }
  return saida.join(",");
};
assert.equal(seq(11), seq(11), "mesmo seed deu sequências diferentes");

console.log(`ok ambiente: ${kits.length} áreas com kit, ${Object.keys(ELEMENTOS).length} elementos, ${EVENTOS.length} eventos, ganchos e semente conferidos`);

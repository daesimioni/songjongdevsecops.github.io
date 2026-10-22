// A biblioteca de assets ambientais e a camada que a usa no mundo. Cobra o
// contrato de cada grupo (tamanho, variante e desenho), o cache com teto, a
// paleta por bioma e a colocação: nada em cima de caminho, praça ou água, e
// vegetação com espaço entre uma peça e outra. Roda sem navegador:
// node test/assets.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";

globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} };

const assets = await import("../js/assets/index.js");
const nucleo = await import("../js/assets/nucleo.js");
const { BIOMES } = await import("../js/identity.js");
const { TILE_KIND: K } = await import("../js/config.js");

const problemas = [];
const check = (ok, msg) => { if (!ok) problemas.push(msg); };

// ---- contrato de cada grupo ----
const TOTAL = assets.totalDeAssets();
check(TOTAL >= 30, `biblioteca com ${TOTAL} assets, esperado ao menos 30`);
for (const grupo of ["solo", "vegetacao", "construcao", "fogo", "agua", "props"]) {
  const tipos = assets.tiposDoGrupo(grupo);
  check(tipos.length >= 3, `grupo ${grupo}: ${tipos.length} assets, esperado ao menos 3`);
  for (const tipo of tipos) {
    const def = assets.assetDe(tipo);
    check(!!def, `${tipo}: sem definição`);
    if (!def) continue;
    check(def.w > 0 && def.h > 0 && def.w <= 64 && def.h <= 64, `${tipo}: tamanho fora da faixa (${def.w}x${def.h})`);
    check(typeof def.desenhar === "function", `${tipo}: sem desenhar`);
    check((def.variantes || 1) >= 1, `${tipo}: variantes inválidas`);
    if (def.quadros) {
      check(def.quadros >= 2, `${tipo}: animação com ${def.quadros} quadro`);
      check(def.ms > 0, `${tipo}: animação sem duração`);
    }
  }
}
check(assets.temAsset("arvore") && assets.temAsset("casa") && assets.temAsset("fogueira"), "faltou asset central");

// ---- animação própria de cada grupo (etapa 3 dos assets) ----
// fogo e água vivem de quadro; props tem a gaivota; solo tem o tufo; vegetação
// verga com o vento no render; construção é rígida por regra e não pode ganhar
// quadro nem inclinação.
const animados = (grupo) => assets.tiposDoGrupo(grupo).filter((tipo) => assets.assetDe(tipo)?.quadros > 1);
check(animados("fogo").length === assets.tiposDoGrupo("fogo").length, `fogo: só ${animados("fogo").length} de ${assets.tiposDoGrupo("fogo").length} animam`);
check(animados("agua").length >= 3, `água: só ${animados("agua").length} tipos animam`);
check(animados("solo").includes("tufo"), "solo: tufo sem quadro");
check(animados("props").includes("gaivota"), "props: gaivota sem quadro");
check(animados("construcao").length === 0, "construção não pode animar por quadro");
check(animados("vegetacao").length === 0, "vegetação anima pelo vento, não por quadro");

// ---- paleta: muda com o bioma e é estável ----
const p1 = nucleo.paletaDaArea(BIOMES["math-fundamentos"]);
const p2 = nucleo.paletaDaArea(BIOMES["chem-organic"]);
check(/^#[0-9a-f]{6}$/.test(p1.folha) && /^#[0-9a-f]{6}$/.test(p2.folha), "folha não é cor hexadecimal");
check(p1.folha !== p2.folha, "a folha não muda com o bioma");
check(nucleo.paletaDaArea(BIOMES["math-fundamentos"]).folha === p1.folha, "paleta não é estável");

// ---- variante determinística e quadro de animação ----
check(nucleo.variante(42, 3) === nucleo.variante(42, 3), "variante não é determinística");
for (let seed = 0; seed < 40; seed++) {
  const v = nucleo.variante(seed, 3);
  check(v >= 0 && v < 3, `variante ${v} fora da faixa`);
}
check(nucleo.quadroAnimado(0, 4, 100) === 0, "quadro inicial errado");
check(nucleo.quadroAnimado(350, 4, 100) === 3, "quadro animado errado");
check(nucleo.quadroAnimado(400, 4, 100) === 0, "animação não voltou ao primeiro quadro");

// ---- cache com teto ----
let criados = 0;
const cache = nucleo.criarCache(3, () => {
  criados++;
  return { width: 0, height: 0, getContext: () => ({ imageSmoothingEnabled: true, fillRect() {} }) };
});
const a = cache.pegar("a", 10, 10, (g) => g.fillRect(0, 0, 1, 1));
const a2 = cache.pegar("a", 10, 10, () => { throw new Error("não devia desenhar de novo"); });
check(a === a2, "cache não devolveu o mesmo sprite");
check(a.width === 10 && a.height === 10, "sprite sem tamanho aplicado");
cache.pegar("b", 10, 10, () => {});
cache.pegar("c", 10, 10, () => {});
check(cache.tamanho === 3, `cache com ${cache.tamanho}, esperado 3`);
cache.pegar("d", 10, 10, () => {});
check(cache.tamanho <= 3, `cache passou do teto: ${cache.tamanho}`);
check(!cache.tem("a"), "cache não descartou o item mais antigo");
check(criados === 4, `fabrica chamada ${criados} vezes, esperado 4`);

// ---- colocação no mundo ----
const { createWorld } = await import("../js/world.js");
const { ICONES } = await import("../js/assets/icones.js");
const world = createWorld();
check(world.ambiente.length >= 1800, `camada de ambiente com ${world.ambiente.length} peças, esperado ao menos 1800`);
const porTipo = {};
const porArea = {};
for (const a of world.ambiente) {
  porTipo[a.tipo] = (porTipo[a.tipo] || 0) + 1;
  porArea[a.bioma] = (porArea[a.bioma] || 0) + 1;
  check(!!assets.assetDe(a.tipo), `peça com tipo sem asset: ${a.tipo}`);
  check(!!BIOMES[a.bioma], `peça com bioma inválido: ${a.bioma}`);
}
const areas = Object.keys(BIOMES);
check(Object.keys(porArea).length === areas.length, `só ${Object.keys(porArea).length} de ${areas.length} áreas com ambiente`);
for (const id of areas) {
  check((porArea[id] || 0) >= 8, `${id}: ${porArea[id] || 0} peças de ambiente, esperado ao menos 8`);
}
check((porTipo.arvore || 0) + (porTipo.conifera || 0) + (porTipo.palmeira || 0) >= 500, `poucas árvores: ${JSON.stringify(porTipo)}`);
check((porTipo.torre || 0) + (porTipo.casa || 0) + (porTipo.cabana || 0) + (porTipo.galpao || 0) >= 60, `poucas construções: ${JSON.stringify(porTipo)}`);
check((porTipo.braseiro || 0) >= 80, `poucos braseiros: ${porTipo.braseiro || 0}`);
check((porTipo.doca || 0) >= 20, `poucas docas: ${porTipo.doca || 0}`);
check((porTipo.fogueira || 0) >= 20, `poucas fogueiras: ${porTipo.fogueira || 0}`);

// chão: nada em cima de caminho, praça, ponte ou parede; água só para gaivota
for (const a of world.ambiente) {
  const t = world.get(Math.floor(a.x), Math.floor(a.y));
  const bloqueado = t === K.PATH || t === K.PLAZA || t === K.BRIDGE || t === K.WALL;
  // braseiro fica na praça; gaivota e fumaça flutuam sobre a cena
  const perdoa = a.tipo === "braseiro" || a.tipo === "gaivota" || a.tipo === "fumaca";
  if (!perdoa) check(!bloqueado, `${a.tipo} em tile bloqueado (${Math.floor(a.x)},${Math.floor(a.y)})`);
  if (a.tipo !== "gaivota" && a.tipo !== "fumaca") check(t !== K.WATER, `${a.tipo} dentro da água (${Math.floor(a.x)},${Math.floor(a.y)})`);
}

// vegetação com espaço: nada de duas peças no mesmo miolo de 3x3
const vegetal = new Set(["arvore", "conifera", "palmeira", "seca", "arbusto", "florada"]);
const chaves = new Set();
for (const a of world.ambiente) {
  if (!vegetal.has(a.tipo)) continue;
  chaves.add(`${Math.floor(a.x)},${Math.floor(a.y)}`);
}
for (const a of world.ambiente) {
  if (!vegetal.has(a.tipo)) continue;
  const x = Math.floor(a.x), y = Math.floor(a.y);
  for (let dy = -1; dy <= 1; dy++) {
    for (let dx = -1; dx <= 1; dx++) {
      if (dx === 0 && dy === 0) continue;
      check(!chaves.has(`${x + dx},${y + dy}`), `vegetação colada em ${x},${y} (+${dx},+${dy})`);
    }
  }
}

// ---- o renderer usa a biblioteca e desenha só a vista ----
const render = fs.readFileSync(new URL("../js/render.js", import.meta.url), "utf8");
check(/from "\.\/assets\/index\.js"/.test(render), "render.js não importa a biblioteca");
check(/world\.ambiente/.test(render), "render.js não desenha a camada de ambiente");
check(/stats\.assets = 0/.test(render), "render.js não zera a contagem de assets do quadro");
check(/from "\.\/assets\/icones\.js"/.test(render), "render.js não importa os ícones da biblioteca");
check(/desenharIcone\(ctx, d, time\)/.test(render), "render.js não delega o ícone para a biblioteca");
check(!/d\.type === "/.test(render), "render.js ainda desenha ícone inline");
check(/inclinacao/.test(render) && /swayAt\(a\.x, a\.y, time, moodAtual\)/.test(render), "vegetação sem balanço de vento");
for (const tipo of ["lamp", "sign", "terminal", "crane", "gull", "book", "flask"]) {
  check(ICONES.has(tipo), `ícone ${tipo} fora da biblioteca`);
}
const tiposDecor = new Set(world.decor.map((d) => d.type));
for (const tipo of tiposDecor) check(ICONES.has(tipo), `decor ${tipo} sem ícone na biblioteca`);
check(/camada === "chao"[\s\S]{0,200}desenharAsset/.test(render), "decalque de chão não entra antes do volume");

assert.equal(problemas.length, 0, `assets com ${problemas.length} problema(s):\n- ${problemas.slice(0, 12).join("\n- ")}`);
console.log(`ok assets: ${TOTAL} assets em 6 grupos, ${world.ambiente.length} peças em ${areas.length} áreas, ${porTipo.torre + porTipo.casa + porTipo.cabana + porTipo.galpao} construções, ${(porTipo.arvore || 0) + (porTipo.conifera || 0) + (porTipo.palmeira || 0)} árvores`);

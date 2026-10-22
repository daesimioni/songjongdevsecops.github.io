// Colisão de fantasma: o que tem volume no cenário barra o corpo. Antes só
// estação, pedra do porto, boca de caverna e doca barravam; barril, caixote,
// árvore e fogueira eram desenho puro e o boneco atravessava.
// Roda sem navegador: node test/fantasmas.test.mjs
import assert from "node:assert/strict";

globalThis.localStorage = { getItem: () => null, setItem: () => {}, removeItem: () => {}, clear: () => {} };

const { createWorld } = await import("../src/world/world.js");
const { PLAYER_W, PLAYER_H, SPAWN } = await import("../src/content/config.js");

const problemas = [];
const check = (ok, msg) => { if (!ok) problemas.push(msg); };
const world = createWorld();

// tipos que o jogador vê como objeto de volume e agora precisam barrar
const SOLIDOS = ["arvore", "conifera", "palmeira", "seca", "pedra", "barril", "caixote", "saco", "fardo", "cerca", "fogueira", "braseiro"];
// tipos que são chão, capim, bicho ou decoração rasteira: o corpo passa
const PASSAGEIS = ["arbusto", "florada", "tufo", "folhada", "musgo", "rachadura", "cogumelo", "trepadeira", "juncoAgua", "lirio", "pedraAgua", "espuma", "gaivota", "fumaca", "doca"];

const ambientais = {};
for (const a of world.ambiente) ambientais[a.tipo] = (ambientais[a.tipo] || 0) + 1;
const porTipo = {};
for (const p of world.props) {
  if (!p.tipo || String(p.tipo).startsWith("casa:") || String(p.tipo).startsWith("movel:")) continue;
  porTipo[p.tipo] = (porTipo[p.tipo] || 0) + 1;
}

for (const tipo of SOLIDOS) {
  const pecas = ambientais[tipo] || 0;
  const caixas = porTipo[tipo] || 0;
  check(caixas >= 1, `${tipo}: nenhuma colisão de cenário`);
  // perto de boca de caverna e de porta de casa a caixa é dispensada de
  // propósito; 85% cobre essa folga sem esconder um tipo inteiro
  check(caixas >= Math.ceil(pecas * 0.85), `${tipo}: ${caixas} caixas para ${pecas} peças`);
  for (const p of world.props) {
    if (p.tipo !== tipo) continue;
    check(p.x >= 0 && p.y >= 0 && p.x <= 560 && p.y <= 360, `${tipo} com caixa fora do mapa`);
    check(world.boxCollides(p.x, p.y, PLAYER_W, PLAYER_H), `${tipo} com caixa que não barra o corpo`);
  }
}

for (const tipo of PASSAGEIS) {
  check(!porTipo[tipo], `${tipo} ganhou colisão de cenário e devia deixar passar`);
}

// a casa continua sólida e a porta livre (o detalhe mora em casas.test.mjs)
const comTipoCasa = world.props.filter((p) => String(p.tipo || "").startsWith("casa:"));
check(comTipoCasa.length >= world.casas.length * 2, `casas com ${comTipoCasa.length} caixas, esperado 2+ por fachada`);

// nenhuma caixa de cenário pode ser maior que o desenho: o limite do mundo
// inteiro é 2 tiles de largura e 1,4 de altura
for (const p of world.props) {
  if (!p.tipo) continue;
  check(p.hw <= 1.05, `caixa ${p.tipo} larga demais: hw ${p.hw}`);
  check(p.hh <= 0.7 || String(p.tipo).startsWith("casa:"), `caixa ${p.tipo} alta demais: hh ${p.hh}`);
}

// e o cenário sólido não fecha caminho: a suíte de colisão cobre os pontos de
// interesse; aqui só se confere que o spawn continua livre
check(!world.boxCollides(SPAWN.x, SPAWN.y, PLAYER_W, PLAYER_H), "spawn com caixa de cenário em cima");

const total = Object.values(porTipo).reduce((s, n) => s + n, 0);
check(total >= 900, `poucas caixas de cenário: ${total}`);
assert.equal(problemas.length, 0, `fantasmas com ${problemas.length} problema(s):\n${problemas.slice(0, 12).join("\n")}`);
console.log(`ok fantasmas: ${total} caixas de cenário em ${Object.keys(porTipo).length} tipos; ${world.casas.length} casas sólidas e ${Object.keys(ambientais).length} tipos de ambiente auditados`);

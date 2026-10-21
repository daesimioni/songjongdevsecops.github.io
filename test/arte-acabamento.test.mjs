// Acabamento da arte: todo bicho e todo ícone de item ganham contorno escuro
// de um pixel e véu de luz, e o desenho é o mesmo em mapa, duelo, bestiário e
// wiki. Sem isso o sprite era uma mancha chapada e o ícone sumia no painel.
// Roda sem navegador: node test/arte-acabamento.test.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const problemas = [];
const check = (ok, msg) => { if (!ok) problemas.push(msg); };
const ler = (nome) => readFileSync(new URL(`../js/${nome}`, import.meta.url), "utf8");

const creature = ler("creature.js");
check(/export function drawCreatureArt\(/.test(creature), "bicho sem versão com acabamento");
check(/drawCreature\(a, kind, accent, time, 1, dir, true\)/.test(creature), "acabamento sem desenhar o bicho limpo");
check(/source-atop/.test(creature), "acabamento sem véu de luz preso ao corpo");
check(/source-in/.test(creature), "acabamento sem silhueta para o contorno");
check(/for \(const \[dx, dy\] of \[\[-1, 0\], \[1, 0\], \[0, -1\], \[0, 1\], \[-1, -1\], \[1, -1\], \[-1, 1\], \[1, 1\]\]\)/.test(creature), "contorno com menos de oito direções");
check(/semSombra/.test(creature), "sombra do chão entrando no contorno");

for (const [arquivo, alvo] of [
  ["dungeon.js", "drawCreatureArt(ctx, m.kind, m.accent"],
  ["duel.js", "drawCreatureArt(ctx, rpg.duel.boss ? \"boss\""],
  ["bestiary.js", "drawCreatureArt(ctx, bicho.tipo"],
  ["wiki.js", "drawCreatureArt(g, icone.kind"],
]) {
  const fonte = ler(arquivo);
  check(fonte.includes("drawCreatureArt"), `${arquivo} ainda desenha bicho sem acabamento`);
  check(fonte.includes(alvo), `${arquivo} não usa o acabamento no desenho`);
}

const itens = ler("item-art.js");
check(/gs\.globalCompositeOperation = "source-in"/.test(itens), "ícone de item sem silhueta para o contorno");
check(/gb\.globalCompositeOperation = "source-atop"/.test(itens), "ícone de item sem véu de luz");
check(/for \(const \[dx, dy\] of \[\[-1, 0\], \[1, 0\], \[0, -1\], \[0, 1\], \[-1, -1\], \[1, -1\], \[-1, 1\], \[1, 1\]\]\)/.test(itens), "contorno de item com menos de oito direções");
check(/cache\.set\(chave, canvas\)/.test(itens), "acabamento fora do cache: refaz a cada ícone");

// a arte não pode encolher o bicho no contorno: o canvas tem folga para o traço
check(/const S = 112, OX = 56, OY = 92;/.test(creature), "canvas do bicho sem folga para o contorno");

assert.equal(problemas.length, 0, `acabamento com ${problemas.length} problema(s):\n- ${problemas.join("\n- ")}`);
console.log("ok acabamento: bicho com contorno de oito direções e luz, em mapa, duelo, bestiário e wiki; item com contorno e luz no cache");

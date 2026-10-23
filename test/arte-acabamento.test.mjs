import { sourcePaths } from "./source-paths.mjs";
// Acabamento da arte: todo bicho e todo ícone de item ganham contorno escuro
// de um pixel e véu de luz, e o desenho é o mesmo em mapa, combate, bestiário e
// wiki. Sem isso o sprite era uma mancha chapada e o ícone sumia no painel.
// Roda sem navegador: node test/arte-acabamento.test.mjs
import assert from "node:assert/strict";
import { readFileSync } from "node:fs";

const problemas = [];
const check = (ok, msg) => { if (!ok) problemas.push(msg); };
const ler = (nome) => readFileSync(new URL(`../${sourcePaths[nome]}`, import.meta.url), "utf8");

const creature = ler("creature.js");
check(/export function drawCreatureArt\(/.test(creature), "bicho sem versão com acabamento");
const compositor = ler("sprite-cache.js"), style = ler("art-style.js");
check(creature.includes('spritePose('), "criatura não usa composição de pose cacheada");
check(compositor.includes('source-in'), "composição sem silhueta do contorno");
check(style.includes('source-atop'), "acabamento não recorta à silhueta");
check(compositor.includes('[-1,-1]') && compositor.includes('[1,1]'), "contorno sem diagonais");
check(/semSombra/.test(creature), "sombra do chão entrando no contorno");

for (const [arquivo, alvo] of [
  ["dungeon.js", "drawCreatureArt(ctx, m.kind, m.accent"],
  ["duel.js", "drawCreatureArt(ctx, inimigo.boss ? \"boss\""],
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
check(/const S = 80, OX = 40, OY = 64;/.test(creature), "canvas do bicho sem folga para o contorno");

// gente e bicho de companhia usam o mesmo acabamento
const render = ler("render.js");
check(/function desenharComAcabamento\(/.test(render), "pessoa sem versão com acabamento");
check(/drawNpcComAcabamento\(npc, px, py, bob, time, colors\)/.test(render), "NPC sem acabamento");
check(/desenharComAcabamento\(player\.x \* TILE, player\.y \* TILE - lift \+ bob/.test(render), "jogador sem acabamento");

const pet = ler("pet-art.js");
check(/function desenharPet\(ctx, kind, x, y, t = 0, moving = false, dir = 0, semSombra = false\)/.test(pet), "pet sem desenho separado da sombra");
check(pet.includes("spritePose("), "pet não compartilha contorno e iluminação cacheados");

assert.equal(problemas.length, 0, `acabamento com ${problemas.length} problema(s):\n- ${problemas.join("\n- ")}`);
console.log("ok acabamento: bicho, pessoa e pet com contorno de oito direções e luz; item com contorno e luz no cache");

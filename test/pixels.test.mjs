import { sourcePaths } from "./source-paths.mjs";
// O contrato do pixel fino: sprite de asset nasce em 2x (cada pixel antigo
// vira quatro), o chão ganha detalhe de meio pixel, as animações têm mais
// quadros e o boneco respira e pisca. Roda sem navegador:
// node test/pixels.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";

const problemas = [];
const check = (ok, msg) => { if (!ok) problemas.push(msg); };
const ler = (nome) => fs.readFileSync(new URL(`../${sourcePaths[nome]}`, import.meta.url), "utf8");

const assets = ler("assets/index.js");
const render = ler("render.js") + ler("terrain-renderer.js");
const veg = ler("assets/vegetacao.js");
const fogo = ler("assets/fogo.js");
const agua = ler("assets/agua.js");
const props = ler("assets/props.js");
const human = ler("human.js");
const creature = fs.readFileSync(new URL("../src/rendering/creature-models.js",import.meta.url),"utf8");
const dungeon = ler("dungeon.js");

// ---- sprite de asset em 2x ----
check(/\(def\.w \+ pad \* 2\) \* 2, \(def\.h \+ pad \* 2\) \* 2/.test(assets), "sprite de asset não nasce em 2x");
check(/g\.scale\(2, 2\)/.test(assets), "desenho do asset não é escalado para 2x");
check(/const e = def\.escala \|\| 1;/.test(assets) && /const dw = def\.w \* e, dh = def\.h \* e;/.test(assets), "asset não lê a escala da construção");
check(/ctx\.drawImage\(sprite, dx - margin, dy - margin, sw, sh\)/.test(assets), "sprite 2x não é copiado no tamanho de mundo");
check(/ctx\.drawImage\(sprite, -dw \/ 2 - margin, -dh - margin, sw, sh\)/.test(assets), "balanço não copia o sprite 2x no tamanho certo");

// ---- chão com detalhe de meio pixel ao vivo ----
check(/const detalhe = \(cor, semente, tamanho\) =>/.test(render), "sem passada de detalhe do chão");
check(/detalhe\("rgba\(0,0,0,0\.10\)"/.test(render) && /detalhe\("rgba\(255,255,255,0\.07\)"/.test(render), "detalhe do chão sem as duas passadas");
check(/0\.5 \+ hash2/.test(render), "detalhe do chão não usa posição de meio pixel");
check(/detalhe\("rgba\(0,0,0,0\.10\)"/.test(render) && /detalhe\("rgba\(255,255,255,0\.07\)"/.test(render), "detalhe do chão não é chamado no quadro");

// ---- vegetação desenhada em passo fino ----
check(/for \(let y = -ry; y < ry; y \+= 0\.5\)/.test(veg), "elipse da copa não usa passo de meio pixel");
check(/row \+= 0\.5/.test(veg), "conífera não usa passo de meio pixel");
check(/elipseFina/.test(veg), "vegetação sem elipse fina");
check(/const vegetal = assetDe\(a\.tipo\)\?\.grupo === "vegetacao"/.test(render), "vento não separa vegetação de construção");
check(/const inclinacao = vegetal \? swayAt\(a\.x, a\.y, time, moodAtual\) \* 0\.03 : 0/.test(render), "vento ainda verga construção");

// ---- animações com mais quadros ----
const quadros = (fonte, tipo) => {
  const m = new RegExp(`${tipo}: \\{[^}]*quadros: (\\d+)`).exec(fonte);
  return m ? Number(m[1]) : 0;
};
check(quadros(fogo, "fogueira") >= 8, `fogueira com ${quadros(fogo, "fogueira")} quadros`);
check(quadros(fogo, "braseiro") >= 8, "braseiro com poucos quadros");
check(quadros(fogo, "tocha") >= 6, "tocha com poucos quadros");
check(quadros(fogo, "fumaca") >= 6, "fumaça com poucos quadros");
check(quadros(agua, "espuma") >= 6, "espuma com poucos quadros");
check(quadros(props, "gaivota") >= 4, "gaivota com poucos quadros");

// ---- boneco e bicho animados ----
check(/const respira = moving \? 0 : Math\.sin/.test(human), "boneco não respira parado");
check(/const pisca = !moving/.test(human), "boneco não pisca");
check(/const quique = moving/.test(human), "passo sem quique");
check(/const blink = !moving && Math\.floor\(time \/ 180\) % 27 === 0/.test(creature), "olho do bicho não pisca");
check(/a tocha tremula/.test(dungeon), "halo da tocha não tremula");

// ---- arrasto do minimapa: agarrar e puxar ----
const renderFonte = fs.readFileSync(new URL("../src/rendering/render.js", import.meta.url), "utf8");
check(/miniPan\.x -= dx \* k/.test(renderFonte), "arrasto do mapa empurra a câmera em vez de puxar o mapa");
check(/miniPan\.y -= dy \* k/.test(renderFonte), "arrasto vertical do mapa no sentido errado");

// ---- a resolução forçada não voltou: dpr segue o aparelho ----
check(/dpr = Math\.min\(2, window\.devicePixelRatio \|\| 1\) \* quality/.test(render), "dpr com piso forçado (perde fps em tela comum)");
check(/Math\.round\(\(larg - 2\) \* f\.vida\)/.test(render), "barra de vida do nome não usa a fração");

assert.equal(problemas.length, 0, `pixels com ${problemas.length} problema(s):\n- ${problemas.join("\n- ")}`);
console.log("ok pixels: sprite 2x, chão em meio pixel, árvores em passo fino, fogo/fumaça/espuma/gaivota com mais quadros e boneco com respiração, piscada e quique");

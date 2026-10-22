// Elevador do Porto Submerso: prop só no hub, arte própria e a saída que sobe
// ao porto em vez da boca de uma caverna. Roda sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";
import { pracaDaCaverna } from "../src/gameplay/dungeon-plaza.js";

const city = { x: 10, y: 10, w: 20, h: 12 };
const hub = pracaDaCaverna({ id: "dungeon-conurbation", hub: true, continent: "hub" }, city);
const cidade = pracaDaCaverna({ id: "dungeon-cs", hub: false, continent: "cs" }, city);
const elevador = hub.find((p) => p.kind === "elevador");
assert.ok(elevador, "o Porto Submerso ficou sem elevador");
assert.equal(cidade.some((p) => p.kind === "elevador"), false, "cidade de continente não tem elevador");
assert.equal(elevador.interact, true, "elevador precisa ser interativo");
assert.ok(elevador.label.includes("porto"), `rótulo do elevador: ${elevador.label}`);
assert.ok(elevador.x > city.x && elevador.x < city.x + city.w, "elevador fora da praça no eixo x");
assert.ok(elevador.y > city.y && elevador.y < city.y + city.h, "elevador fora da praça no eixo y");
// não nasce em cima de outro interativo
const outros = hub.filter((p) => p !== elevador && p.interact);
const menor = Math.min(...outros.map((p) => Math.hypot(p.x - elevador.x, p.y - elevador.y)));
assert.ok(menor >= 1.5, `elevador a ${menor.toFixed(2)} de outro interativo`);
// no hub não existe túnel da conurbação: o elevador não duplica o menu
assert.equal(hub.some((p) => p.kind === "conurbation"), false);

const ler = (rel) => fs.readFileSync(new URL(`../${rel}`, import.meta.url), "utf8");
const dungeon = ler("src/app/dungeon.js");
const app = ler("src/app/app.js");
const arte = ler("src/rendering/dungeon-art.js");

assert.match(dungeon, /obj\.kind === "elevador"/, "o controlador não trata o elevador");
assert.match(dungeon, /onElevador\?\.\(\)/, "o elevador não avisa o app");
assert.match(dungeon, /drawElevador\(ctx, prop\.x \* TILE/, "o elevador não é desenhado");
assert.match(arte, /export function drawElevador/, "falta o desenho do elevador");
assert.match(app, /onElevador: \(\) => dungeon\?\.close\("elevador"\)/, "o app não fecha a caverna pelo elevador");
assert.match(app, /if \(kind === "elevador"\)/, "o app não trata a saída do elevador");
assert.match(app, /WAYSTONES\.find\(\(w\) => w\.id === "hub"\)/, "a subida não vai à pedra do porto");
assert.match(app, /O elevador subiu ao Porto do Início/, "falta o aviso da subida");

console.log(`ok elevador: no Porto Submerso a ${menor.toFixed(1)} do prop mais perto, saída para a pedra do porto`);

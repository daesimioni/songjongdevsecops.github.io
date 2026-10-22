// Clima mudando a caçada: chuva, neblina e rajada trocam o elenco do subsolo
// dentro do próprio continente, sem mexer em sala, posto ou dificuldade.
import assert from "node:assert/strict";
import fs from "node:fs";
import { CLIMA_CAÇADA, nomeDaCacada } from "../src/content/cacada-clima.js";

const nomes = ["Bit", "Laço", "Núcleo", "Cache", "Pilha", "Fio"];
const kinds = { Bit: "slime", Laço: "serpent", Núcleo: "atom", Cache: "node", Pilha: "crystal", Fio: "wisp" };
const kindOf = (nome) => kinds[nome];

// sem clima, o rodízio normal da caverna
assert.equal(nomeDaCacada(nomes, 0, 1, "limpo", kindOf), "Bit");
assert.equal(nomeDaCacada(nomes, 3, 1, "limpo", kindOf), "Cache");
assert.equal(nomeDaCacada(nomes, 6, 1, "limpo", kindOf), "Bit", "o índice precisa dar a volta");
assert.equal(nomeDaCacada(nomes, -1, 1, "limpo", kindOf), "Fio", "índice negativo precisa dar a volta");
assert.equal(nomeDaCacada([], 0, 1, "chuva", kindOf), "", "caverna sem elenco não pode inventar bicho");
assert.equal(nomeDaCacada(null, 0, 1, "chuva", kindOf), "", "elenco nulo não pode quebrar");
assert.equal(nomeDaCacada(nomes, 0, 1, "tempestade-de-ideias", kindOf), "Bit", "clima desconhecido cai no rodízio");

// a chuva puxa o bicho molhado mais próximo do posto
assert.equal(nomeDaCacada(nomes, 1, 1, "chuva", kindOf), "Laço", "chuva devia puxar a serpente");
assert.equal(nomeDaCacada(nomes, 0, 1, "chuva", kindOf), "Bit", "o posto que já é molhado fica");
assert.equal(nomeDaCacada(nomes, 4, 1, "chuva", kindOf), "Bit", "a busca dá a volta no elenco");
// a neblina puxa o que some da vista
assert.equal(nomeDaCacada(nomes, 0, 1, "neblina", kindOf), "Fio", "neblina devia puxar o fogo-fátuo");
// a rajada puxa o que voa
assert.equal(nomeDaCacada(nomes, 0, 1, "rajada", kindOf), "Cache", "rajada devia puxar o nó");

// sem bicho que combine, o rodízio normal continua
const semCombate = ["Núcleo", "Pilha"];
assert.equal(nomeDaCacada(semCombate, 0, 1, "chuva", () => "atom"), "Núcleo", "sem bicho do clima, mantém o posto");
assert.equal(nomeDaCacada(nomes, 0, 1, "chuva", null), "Bit", "sem leitura de espécie, mantém o posto");

// ---- os climas e o uso na caverna ----
assert.deepEqual(Object.keys(CLIMA_CAÇADA).sort(), ["chuva", "neblina", "rajada"]);
for (const [clima, lista] of Object.entries(CLIMA_CAÇADA)) {
  assert.ok(lista.length >= 3, `clima ${clima} com elenco curto`);
  assert.equal(new Set(lista).size, lista.length, `clima ${clima} repete espécie`);
}
const dungeon = fs.readFileSync(new URL("../src/app/dungeon.js", import.meta.url), "utf8");
const app = fs.readFileSync(new URL("../src/app/app.js", import.meta.url), "utf8");
assert.match(dungeon, /nomeDaCacada\(names, n, tier, String\(getClima/, "a caverna não usa o clima no elenco");
assert.match(dungeon, /getClima = null/, "a caverna não recebe o clima");
assert.match(app, /getClima: \(\) => state\.clima \|\| "limpo"/, "o app não entrega o clima à caverna");
assert.match(app, /state\.clima = id/, "o app não acompanha o evento de clima");
assert.match(app, /state\.clima = "limpo"/, "o app não limpa o clima quando o evento termina");

console.log("ok caçada: chuva, neblina e rajada trocam o elenco do posto e o app acompanha o clima");

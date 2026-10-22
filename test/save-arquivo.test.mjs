// Save em arquivo: o mesmo JSON do backup na DM, baixado e carregado à mão.
// A leitura aceita só chaves conhecidas e valores JSON válidos. Sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

const { collect, serialize, parseArquivo, aplicarArquivo } = await import("../src/platform/backup.js");
const { BACKUP, STORAGE } = await import("../src/core/runtime-config.js");

store.clear();
store.set(STORAGE.name, JSON.stringify("Viajante"));
store.set(STORAGE.cards, JSON.stringify(["a", "b"]));
store.set(STORAGE.rpg, JSON.stringify({ hp: 12, skills: { cs: 3 } }));
store.set(STORAGE.quests, JSON.stringify({ done: ["x"] }));

// ---- ida: o arquivo é o mesmo conteúdo do backup ----
const coletado = collect();
assert.equal(coletado.v, 1, "o save precisa de versão global");
assert.equal(coletado.keys.rpg, store.get(STORAGE.rpg), "o arquivo não pode reescrever o save");
assert.equal(coletado.keys.quests, store.get(STORAGE.quests));
assert.equal(coletado.keys.cards, store.get(STORAGE.cards));
assert.equal(coletado.keys.nostr, undefined, "a chave da conta nunca entra no arquivo");

const texto = serialize();
assert.equal(typeof texto, "string");
const lido = JSON.parse(texto);
assert.equal(lido.v, 1, "o arquivo baixado precisa carregar a versão");
assert.equal(lido.name, "Viajante", "o nome do jogador vai no arquivo");

// ---- volta: aplicar restaura o progresso ----
const voltou = parseArquivo(texto);
assert.equal(voltou.ok, true, `arquivo do próprio jogo recusado: ${voltou.reason}`);
assert.equal(voltou.name, "Viajante");
assert.deepEqual(Object.keys(voltou.keys).sort(), ["cards", "name", "quests", "rpg"], "faltou parte do save");

store.clear();
assert.equal(aplicarArquivo(voltou), 4, "deveria aplicar as quatro partes");
assert.equal(store.get(STORAGE.rpg), coletado.keys.rpg, "o RPG não voltou igual");
assert.equal(store.get(STORAGE.quests), coletado.keys.quests, "as missões não voltaram iguais");
assert.equal(store.get(STORAGE.name), JSON.stringify("Viajante"), "o nome não voltou");

// ---- o que não é backup do jogo é recusado ----
const recusas = [
  ["texto solto", "isso não é json"],
  ["objeto vazio", "{}"],
  ["versão futura", JSON.stringify({ v: 2, keys: { rpg: "{}" } })],
  ["sem chaves", JSON.stringify({ v: 1 })],
  ["chaves que não são objeto", JSON.stringify({ v: 1, keys: "rpg" })],
  ["nada aproveitável", JSON.stringify({ v: 1, keys: { rpg: "não é json" } })],
  ["lista de saves", JSON.stringify([{ v: 1, keys: { rpg: "{}" } }])],
];
for (const [nome, entrada] of recusas) {
  const r = parseArquivo(entrada);
  assert.equal(r.ok, false, `aceitou ${nome}`);
  assert.equal(typeof r.reason, "string", `recusa de ${nome} sem motivo`);
}

// chave desconhecida e valor grande demais ficam de fora, sem derrubar o resto
const sujo = JSON.stringify({
  v: 1,
  name: "x".repeat(200),
  keys: {
    rpg: JSON.stringify({ hp: 1 }),
    senha: JSON.stringify("não"),
    cards: "x".repeat(BACKUP.max + 1),
  },
});
const limpo = parseArquivo(sujo);
assert.equal(limpo.ok, true, "arquivo com lixo deveria aproveitar o que presta");
assert.deepEqual(Object.keys(limpo.keys), ["rpg"], "chave desconhecida ou gigante entrou no save");
assert.ok(limpo.name.length <= 24, "o nome do arquivo precisa ser cortado");

// aplicar só mexe no que é do jogo, mesmo com um objeto forjado
store.clear();
const forjado = { ok: true, keys: { rpg: JSON.stringify({ hp: 9 }), senha: JSON.stringify("x") } };
assert.equal(aplicarArquivo(forjado), 1, "aplicou chave fora do save");
assert.equal(store.get(STORAGE.rpg), forjado.keys.rpg);
assert.equal(store.has("mundo-song:senha:v1"), false, "chave forjada foi escrita");
assert.equal(aplicarArquivo({ ok: false, keys: { rpg: "{}" } }), 0, "arquivo recusado não pode aplicar");

// ---- integração na tela ----
const social = fs.readFileSync(new URL("../src/ui/social.js", import.meta.url), "utf8");
assert.match(social, /import \{ serialize, parseArquivo, aplicarArquivo \} from "\.\.\/platform\/backup\.js"/, "a Rede não usa o arquivo manual");
assert.match(social, /baixar arquivo/);
assert.match(social, /carregar arquivo/);
assert.match(social, /application\/json/);
assert.match(social, /aplicarArquivo\(parsed\)/);

console.log("ok save em arquivo: versao 1, chaves conhecidas, valores JSON, lixo recusado e progresso restaurado");

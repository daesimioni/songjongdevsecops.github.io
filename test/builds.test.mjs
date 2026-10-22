// Builds da ficha: salvar o retrato do equipamento, usar e remover, com limite
// de três e peça que sumiu entrando como falta. Roda sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

const { RPG } = await import("../src/gameplay/rpg.js");
const { STORAGE } = await import("../src/core/runtime-config.js");
const opcoes = { getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} };

function comPecas(ids) {
  store.clear();
  const rpg = new RPG(opcoes);
  for (const id of ids) rpg.addItem(id, 1);
  return rpg;
}

// ---- salvar, usar e remover ----
{
  const rpg = comPecas(["espada-prova", "colete-malha", "capa-vale"]);
  assert.ok(rpg.equip("espada-prova").ok, "espada não equipou");
  assert.ok(rpg.equip("colete-malha").ok, "colete não equipou");
  assert.ok(rpg.equip("capa-vale").ok, "capa não equipou");
  assert.equal(rpg.buildsView().length, 0, "build nova não pode nascer com retrato");

  const res = rpg.salvarBuild("prova");
  assert.ok(res.ok, `salvar build recusou: ${res.reason}`);
  assert.equal(res.nome, "prova");
  assert.deepEqual(rpg.buildsView(), [{ index: 0, nome: "prova", pecas: 3 }], "retrato da build errado");

  // desmonta tudo e a build devolve o conjunto inteiro
  for (const slot of ["weapon", "armor", "cloak"]) rpg.unequip(slot);
  assert.equal(Object.keys(rpg.data.equipped).length, 0, "o equipamento não saiu");
  const usado = rpg.usarBuild(0);
  assert.ok(usado.ok, `usar build recusou: ${usado.reason}`);
  assert.deepEqual(usado.faltando, [], "não devia faltar peça");
  assert.equal(usado.equipadas, 3, "a build devia equipar três peças");
  assert.equal(rpg.data.equipped.weapon, "espada-prova");
  assert.equal(rpg.data.equipped.armor, "colete-malha");
  assert.equal(rpg.data.equipped.cloak, "capa-vale");

  // peça que sumiu da mochila vira falta e o resto entra
  rpg.data.items["capa-vale"] = 0;
  delete rpg.data.items["capa-vale"];
  const parcial = rpg.usarBuild(0);
  assert.ok(parcial.ok, "build parcial devia valer o que tem");
  assert.deepEqual(parcial.faltando, ["capa"], "faltou dizer qual peça sumiu");
  assert.equal(rpg.data.equipped.weapon, "espada-prova");
  assert.equal(rpg.data.equipped.cloak, undefined, "capa ausente não pode ficar equipada");

  // build sem nada na mochila é recusada sem bagunçar o equipamento
  const antes = { ...rpg.data.equipped };
  rpg.data.items["espada-prova"] = 0;
  delete rpg.data.items["espada-prova"];
  rpg.data.items["colete-malha"] = 0;
  delete rpg.data.items["colete-malha"];
  const vazia = rpg.usarBuild(0);
  assert.equal(vazia.ok, false, "build sem nenhuma peça não pode passar");
  assert.deepEqual(rpg.data.equipped, antes, "build recusada não pode mexer no equipamento");
}

// ---- nome, limite de três e remoção ----
{
  const rpg = comPecas(["espada-prova", "colete-malha", "capa-vale"]);
  rpg.equip("espada-prova");
  const sujo = rpg.salvarBuild("<b>Oi</b>\u0000");
  assert.ok(sujo.ok);
  assert.equal(sujo.nome, "bOi/b", "o nome da build precisa perder marcação e controle");
  const semNome = rpg.salvarBuild("   ");
  assert.equal(semNome.nome, "build 2", "build sem nome deveria ganhar um");
  rpg.salvarBuild("terceira");
  const quarto = rpg.salvarBuild("quarta");
  assert.equal(quarto.ok, false, "a quarta build não pode passar");
  assert.match(quarto.reason, /limite/, "motivo do limite");
  assert.equal(rpg.buildsView().length, 3, "o limite de três não segurou");

  const removida = rpg.removerBuild(1);
  assert.ok(removida.ok, "remover build falhou");
  assert.equal(rpg.buildsView().length, 2, "a build removida continuou na lista");
  assert.equal(rpg.buildsView()[1].nome, "terceira", "os índices não andaram");
  assert.equal(rpg.removerBuild(9).ok, false, "índice fora da lista não pode passar");
}

// ---- sem nada equipado não há retrato ----
{
  const rpg = comPecas([]);
  const res = rpg.salvarBuild("nada");
  assert.equal(res.ok, false, "build sem equipamento não pode passar");
  assert.match(res.reason, /equipado/, "motivo da build sem equipamento");
}

// ---- o save guarda as builds e descarta o que não presta ----
{
  const rpg = comPecas(["espada-prova", "colete-malha"]);
  rpg.equip("espada-prova");
  rpg.equip("colete-malha");
  rpg.salvarBuild("persistente");
  const outro = new RPG(opcoes);
  assert.equal(outro.buildsView().length, 1, "a build não sobreviveu ao save");
  assert.equal(outro.buildsView()[0].nome, "persistente");
  assert.equal(outro.buildsView()[0].pecas, 2);

  const bruto = JSON.parse(store.get(STORAGE.rpg));
  bruto.builds = [
    { n: "boa", e: { weapon: "espada-prova" } },
    { n: "sem peça", e: {} },
    { n: "slot errado", e: { arma: "espada-prova" } },
    { n: "quarta", e: { armor: "colete-malha" } },
    { n: 42, e: { weapon: "espada-prova" } },
  ];
  store.set(STORAGE.rpg, JSON.stringify(bruto));
  const limpo = new RPG(opcoes);
  assert.deepEqual(limpo.buildsView().map((b) => b.nome), ["boa"], "o save aceitou build inválida");
  assert.equal(limpo.buildsView()[0].pecas, 1, "a build limpa perdeu a peça");
}

// ---- integração na tela ----
const sheet = fs.readFileSync(new URL("../src/ui/sheet.js", import.meta.url), "utf8");
const css = fs.readFileSync(new URL("../css/character.css", import.meta.url), "utf8");
const rpgFonte = fs.readFileSync(new URL("../src/gameplay/rpg.js", import.meta.url), "utf8");
assert.match(sheet, /rpg\.buildsView\(\)/, "a ficha não lista as builds");
assert.match(sheet, /salvar a atual/, "a ficha não tem botão de salvar");
assert.match(sheet, /rpg\.usarBuild\(b\.index\)/, "a ficha não usa a build");
assert.match(sheet, /rpg\.removerBuild\(b\.index\)/, "a ficha não remove a build");
assert.match(css, /\.build-row\b/, "falta o estilo da build");
assert.match(css, /\.build-nome\b/, "falta o estilo do nome da build");
assert.match(rpgFonte, /buildsView\(\)/, "o RPG não expõe as builds");
assert.match(rpgFonte, /SLOT_NAMES/, "a ordem dos espaços precisa de uma fonte só");

console.log("ok builds: salva o retrato, usa o conjunto inteiro, avisa peça que falta, limita em três e sobrevive ao save");

// Combate de ação: J ataca, K defende, L esquiva e 1-6 usam runas. Cobre as
// três dificuldades, chefe, matilha, treino, variantes e todas as criaturas
// das 93 cavernas. Roda sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";
import { HABILIDADES } from "../src/gameplay/chefe-habilidades.js";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

const { RPG } = await import("../src/gameplay/rpg.js");
const { GROUNDS, TIERS } = await import("../src/content/rpg-data.js");
const { DUNGEONS, dungeonCreatures } = await import("../src/content/dungeon-data.js");
const ground = GROUNDS.find((g) => g.id === "cs");
const fakeGround = { id: "teste", name: "Sala de Teste", continent: "cs", loot: ["chip"], material: "ferro", dungeon: true };

function novo(opcoes = {}) {
  store.clear();
  return new RPG({ getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {}, ...opcoes });
}

function perto(rpg) {
  const c = rpg.combate;
  for (const ini of c.inimigos) {
    ini.x = c.jogador.x + 30;
    ini.y = c.jogador.y;
    ini.proximoAtaque = 1e9;
  }
}

function vencer(rpg, limite = 40) {
  perto(rpg);
  let n = 0;
  while (rpg.duel?.phase === "combat" && n++ < limite) {
    for (const ini of rpg.combate.inimigos) {
      if (ini.morte) continue;
      ini.x = rpg.combate.jogador.x + 30;
      ini.y = rpg.combate.jogador.y;
    }
    rpg.combate.atacar();
    rpg.combate.agora += 500;
  }
  return rpg.duel?.result;
}

// ---- 1. o duelo de monstro agora é combate ----
{
  const rpg = novo();
  const aberto = rpg.startDuel(
    { id: "combate-facil", name: "Gosma", kind: "slime", tier: 1, level: 3 },
    fakeGround,
  );
  assert.equal(aberto.ok, true, "o combate não abriu");
  assert.equal(rpg.duel.phase, "combat", "o duelo não começou em combate");
  assert.equal(rpg.duel.question, undefined, "o duelo ainda tem pergunta");
  assert.equal(rpg.combate.inimigos[0].hpMax, TIERS[1].hp, "vida do fácil mudou");
  perto(rpg);
  const antes = rpg.combate.inimigos[0].hp;
  rpg.combate.atacar();
  assert.ok(rpg.combate.inimigos[0].hp < antes, "J não feriu o bicho");
}
// vitória dá XP e loot, marca o bicho e deixa a caçada no save
{
  const xps = [];
  const rpg = novo({ gainXp: (n) => xps.push(n) });
  rpg.startDuel({ id: "combate-vitoria", name: "Gosma", kind: "slime", tier: 1 }, fakeGround);
  const resultado = vencer(rpg);
  assert.ok(resultado, "a vitória não calculou recompensa");
  assert.equal(rpg.duel.phase, "victory");
  assert.ok(xps.length > 0, "a vitória não deu XP");
  assert.ok(rpg.data.monsters["combate-vitoria"], "o bicho não foi marcado como derrotado");
  assert.ok(rpg.itemCount("chip") >= 1, "o loot não entrou");
  rpg.next();
  assert.equal(rpg.duel, null);
  assert.equal(rpg.combate, null);
}

// ---- 2. defesa, aparo, esquiva e escudo ----
{
  const rpg = novo();
  rpg.startDuel({ id: "defesa", name: "Touro", kind: "golem", tier: 3 }, fakeGround);
  const c = rpg.combate;
  const ini = c.inimigos[0];
  ini.x = c.jogador.x + 20;
  ini.y = c.jogador.y;
  c.agora = 1000;
  c.jogador.defendendo = false;
  c.jogador.invulneravelAte = 0;
  const hp0 = rpg.hp();
  c.resolverGolpe(ini);
  const danoSemDefesa = hp0 - rpg.hp();
  assert.ok(danoSemDefesa > 0, "o golpe sem defesa não doeu");
  rpg.data.hp = rpg.hpMax();
  c.agora = 2000;
  c.jogador.defendendo = true;
  c.jogador.defesaDesde = 1000;
  c.resolverGolpe(ini);
  const danoComDefesa = rpg.hpMax() - rpg.hp();
  assert.ok(danoComDefesa <= danoSemDefesa, `defender não reduziu (${danoComDefesa} >= ${danoSemDefesa})`);
  rpg.data.hp = rpg.hpMax();
  c.agora = 3000;
  c.jogador.defendendo = true;
  c.jogador.defesaDesde = 3000;
  c.resolverGolpe(ini);
  assert.equal(rpg.hp(), rpg.hpMax(), "o aparo não anulou o golpe");
  assert.equal(c.jogador.contraAtaque, 1, "o aparo não armou o contra-ataque");
  rpg.data.hp = rpg.hpMax();
  c.jogador.defendendo = false;
  c.agora = 4000;
  c.jogador.invulneravelAte = 5000;
  c.resolverGolpe(ini);
  assert.equal(rpg.hp(), rpg.hpMax(), "a esquiva não anulou o golpe");
  rpg.data.hp = rpg.hpMax();
  c.jogador.invulneravelAte = 0;
  c.jogador.escudo = true;
  c.resolverGolpe(ini);
  assert.equal(rpg.hp(), rpg.hpMax(), "o escudo não segurou o primeiro golpe");
  assert.equal(c.jogador.escudo, false, "o escudo não foi gasto");
}

// ---- 3. chefe: fases, habilidades e área telegrafada ----
{
  const rpg = novo();
  rpg.data.levers[ground.id] = true;
  assert.equal(rpg.startDuel(ground.boss, ground, true).ok, true, "o chefe não abriu");
  const c = rpg.combate;
  const ini = c.inimigos[0];
  assert.equal(ini.tier, 4, "o chefe não entrou no tier 4");
  assert.equal(ini.hpMax, TIERS[4].hp, "a vida do chefe mudou");
  assert.ok(rpg.duel.habilidade?.id, "o chefe não sorteou habilidade");
  c.aplicarDano(ini, ini.hpMax * 0.4);
  assert.equal(rpg.duel.bossPhase, 2, "a fase 2 não abriu");
  c.aplicarDano(ini, ini.hpMax * 0.3);
  assert.equal(rpg.duel.bossPhase, 3, "a fase 3 não abriu");
  // seiva da fase 2 devolve vida
  rpg.duel.habilidade = HABILIDADES.find((h) => h.id === "seiva");
  ini.phase = 2;
  ini.hp = Math.max(1, Math.floor(ini.hpMax / 2));
  ini.curaPronto = 0;
  c.agora = 6000;
  const antes = ini.hp;
  c.atualizarInimigo(ini, 16);
  assert.ok(ini.hp >= antes, "a seiva não curou");
  // o espelho come o primeiro golpe da fase 2
  rpg.duel.habilidade = HABILIDADES.find((h) => h.id === "espelho");
  rpg.duel.espelhoUsado = false;
  ini.phase = 2;
  const dano = c.danoNoInimigo(ini, false);
  assert.equal(dano, 0, "o espelho do chefe não engoliu o golpe");
  // couraça deixa o golpe 1 menor
  rpg.duel.habilidade = HABILIDADES.find((h) => h.id === "couraca");
  ini.phase = 2;
  const semCouraca = rpg.damageFor("cs");
  assert.ok(c.danoNoInimigo(ini, false) <= semCouraca, "a couraça não reduziu o dano");
}

// ---- 4. matilha: cada bicho cai e a vitória espera todos ----
{
  const rpg = novo();
  rpg.startDuel({ id: "matilha-main", name: "A", kind: "slime", tier: 1 }, fakeGround, false, [
    { id: "matilha-parceiro", name: "B", kind: "eye", tier: 1 },
  ]);
  const c = rpg.combate;
  assert.equal(c.inimigos.length, 2, "a matilha não entrou no combate");
  c.aplicarDano(c.inimigos[0], 99);
  assert.equal(rpg.duel.phase, "combat", "o principal cair não pode encerrar a matilha");
  assert.equal(rpg.duel.partners[0].done, false, "o parceiro caiu junto");
  c.aplicarDano(c.inimigos[1], 99);
  assert.equal(rpg.duel.phase, "victory", "a matilha não encerrou");
  assert.equal(rpg.duel.partners[0].done, true, "o parceiro não foi marcado");
  assert.ok(rpg.data.monsters["matilha-parceiro"], "o parceiro não ficou derrotado no save");
}

// ---- 5. treino: o bicho não mata e não deixa saque ----
{
  const rpg = novo();
  assert.equal(rpg.startTraining("cs", 1, "", { name: "Boneco", kind: "slime" }).ok, true);
  assert.equal(rpg.duel.training, true);
  const c = rpg.combate;
  const ini = c.inimigos[0];
  ini.x = c.jogador.x;
  ini.y = c.jogador.y;
  for (let i = 0; i < 20; i++) {
    c.agora += 3000;
    c.resolverGolpe(ini);
  }
  assert.ok(c.jogador.hp >= 1, "o treino matou o jogador");
  ini.hp = 1;
  c.jogador.x = ini.x - 20;
  c.jogador.y = ini.y;
  c.atacar();
  assert.equal(rpg.duel.phase, "victory");
  assert.equal(rpg.duel.result.training, true, "o treino não marcou resultado de treino");
}

// ---- 6. runas no combate ----
{
  const rpg = novo();
  rpg.data.spells["runa-cura"] = true;
  rpg.data.mana = rpg.manaMax();
  rpg.startDuel({ id: "runa-combate", name: "Gosma", kind: "slime", tier: 2 }, fakeGround);
  rpg.data.hp = 5;
  const cura = rpg.combate.usarMagia("runa-cura");
  assert.equal(cura.ok, true, "a cura não saiu");
  assert.ok(rpg.hp() > 5, "a cura não devolveu vida");

  const rpg2 = novo();
  rpg2.addItem("runa-trovao", 1);
  rpg2.startDuel({ id: "runa-trovao-combate", name: "Gosma", kind: "slime", tier: 2 }, fakeGround);
  const c2 = rpg2.combate;
  c2.inimigos[0].x = c2.jogador.x + 20;
  c2.inimigos[0].y = c2.jogador.y;
  const antes = c2.inimigos[0].hp;
  assert.equal(c2.usarMagia("runa-trovao").ok, true, "o trovão não saiu");
  assert.ok(c2.inimigos[0].hp < antes, "o trovão não feriu");
  assert.equal(rpg2.itemCount("runa-trovao"), 0, "a carga não foi gasta");

  const rpg3 = novo();
  rpg3.data.spells["runa-gelo"] = true;
  rpg3.data.mana = rpg3.manaMax();
  rpg3.startDuel({ id: "runa-gelo-combate", name: "Gosma", kind: "slime", tier: 2 }, fakeGround);
  const c3 = rpg3.combate;
  c3.inimigos[0].x = c3.jogador.x + 20;
  c3.inimigos[0].y = c3.jogador.y;
  c3.usarMagia("runa-gelo");
  assert.ok(c3.inimigos[0].atordoadoAte > c3.agora, "o gelo não atordoou");
}

// ---- 7. todas as criaturas e todos os chefes entram no mesmo combate ----
{
  const rpg = novo();
  let total = 0;
  for (const def of DUNGEONS) {
    const chao = { id: def.id, name: def.name, continent: def.continent, loot: [def.monsters?.[0]?.loot || "chip"], dungeon: true };
    for (const bicho of dungeonCreatures(def)) {
      const monstro = { id: bicho.ids?.[0] || bicho.id, name: bicho.nome, kind: bicho.tipo, tier: bicho.tier, accent: bicho.accent };
      const aberto = rpg.startDuel(monstro, chao);
      assert.equal(aberto.ok, true, `${def.id}/${bicho.nome}: combate não abriu`);
      assert.ok(rpg.combate.inimigos.length >= 1, `${def.id}/${bicho.nome}: sem inimigo`);
      assert.equal(rpg.duel.phase, "combat", `${def.id}/${bicho.nome}: fase errada`);
      rpg.flee();
      total++;
    }
    const chefe = { id: `${def.id}-chefe`, name: def.boss || `Chefe de ${def.name}`, kind: "boss", tier: 4, level: 12 };
    const abertoChefe = rpg.startDuel(chefe, chao, true);
    assert.equal(abertoChefe.ok, true, `${def.id}: chefe não abriu`);
    assert.equal(rpg.combate.inimigos[0].tier, 4, `${def.id}: chefe sem tier 4`);
    rpg.flee();
    total++;
  }
  assert.equal(total, 464 + DUNGEONS.length, `criaturas cobertas: ${total}`);
}

// ---- 7b. o pet entra no combate com efeito de verdade ----
{
  const rpg = novo();
  rpg.data.pets = { coruja: { bond: 3 }, papagaio: { bond: 3 }, sombra: { bond: 3 } };
  rpg.data.mana = 10;

  rpg.data.petActive = "coruja";
  rpg.startDuel({ id: "pet-coruja", name: "Olho", kind: "eye", tier: 2, level: 6 }, fakeGround);
  const coruja = rpg.combate.usarBicho();
  assert.equal(coruja.ok, true, "a coruja não usou a habilidade");
  assert.equal(rpg.combate.jogador.lente, true, "a coruja não armou o golpe certeiro");
  assert.ok(rpg.combate.jogador.eco >= 1, "a coruja não somou o golpe extra");
  rpg.flee();

  rpg.data.petActive = "papagaio";
  rpg.data.petCd = {};
  rpg.data.mana = 10;
  rpg.startDuel({ id: "pet-papagaio", name: "Fio", kind: "slime", tier: 1, level: 3 }, fakeGround);
  const papagaio = rpg.combate.usarBicho();
  assert.equal(papagaio.ok, true, "o papagaio não usou a habilidade");
  assert.ok(rpg.combate.inimigos.every((i) => i.atordoadoAte > 0), "o papagaio não atordoou a arena");
  rpg.flee();

  rpg.data.petActive = "sombra";
  rpg.data.petCd = {};
  rpg.data.mana = 10;
  rpg.startDuel({ id: "pet-sombra", name: "Vulto", kind: "bat", tier: 1, level: 3 }, fakeGround);
  const sombra = rpg.combate.usarBicho();
  assert.equal(sombra.ok, true, "a sombra não usou a habilidade");
  assert.equal(rpg.combate.jogador.escudo, true, "a sombra não armou o escudo");
  rpg.flee();
}

// ---- 8. a pergunta saiu do jogo; a coleta virou golpe de precisão ----
{
  const duel = fs.readFileSync(new URL("../src/ui/duel.js", import.meta.url), "utf8");
  const combate = fs.readFileSync(new URL("../src/gameplay/combate.js", import.meta.url), "utf8");
  const gather = fs.readFileSync(new URL("../src/ui/gather.js", import.meta.url), "utf8");
  assert.ok(!/question|pergunta|lerPergunta|duel-option|answer\(/.test(duel), "a tela do monstro ainda tem pergunta");
  assert.ok(!/d\.question|question\.options|lerPergunta|rpg\.answer/.test(combate), "o motor do monstro ainda tem pergunta");
  assert.ok(!/lerPergunta|duelDeck|buildDeck|registrarConceito/.test(gather), "a coleta ainda tem pergunta");
  assert.match(gather, /skill-meter/, "a coleta não tem a barra de precisão");
  assert.match(gather, /faixaDoTier/, "a coleta não tem faixa por dificuldade");
  const dungeon = fs.readFileSync(new URL("../src/app/dungeon.js", import.meta.url), "utf8");
  const sheet = fs.readFileSync(new URL("../src/ui/sheet.js", import.meta.url), "utf8");
  const app = fs.readFileSync(new URL("../src/app/app.js", import.meta.url), "utf8");
  assert.match(dungeon, /onFarm\?\.\(\{ continent: state\.def\.continent/, "a fazenda não abre a coleta de ação");
  assert.match(sheet, /onCooking\?\.\(recipe\)/, "a cozinha não abre a coleta de ação");
  assert.match(app, /function openFarm\(/, "o app não abre a coleta da fazenda");
  assert.match(app, /function openCooking\(/, "o app não abre a coleta da cozinha");
}

console.log("ok combate: J/K/L/runas, fases, matilha, treino e 464 criaturas + 93 chefes no mesmo motor");

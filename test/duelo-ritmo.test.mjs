// Ritmo do duelo: sequência de acertos soma dano (teto +2), a leitura de turno
// mostra o golpe previsto e a cobrança real vem do erroPrevisto do RPG.
// Roda sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";
import { bonusDeRitmo, leituraDeRitmo } from "../src/gameplay/duelo-ritmo.js";

const problemas = [];
const check = (ok, msg) => { if (!ok) problemas.push(msg); };

// ---- ritmo ----
check(bonusDeRitmo(0) === 0, "ritmo em 0 acertos");
check(bonusDeRitmo(2) === 0, "ritmo antes de 3 acertos");
check(bonusDeRitmo(3) === 1 && bonusDeRitmo(4) === 1, "ritmo de 3-4 acertos");
check(bonusDeRitmo(5) === 2 && bonusDeRitmo(40) === 2, "ritmo deveria parar em +2");
check(leituraDeRitmo(0) === "" && leituraDeRitmo(1) === "", "leitura sem ritmo");
check(/terceiro fecha o ritmo/.test(leituraDeRitmo(2)), "aviso de 2 acertos");
check(/\+1 de dano/.test(leituraDeRitmo(3)), "leitura de +1");
check(/\+2 de dano/.test(leituraDeRitmo(5)), "leitura de +2");

// ---- integração na fonte ----
const rpg = fs.readFileSync(new URL("../src/gameplay/rpg.js", import.meta.url), "utf8");
const duel = fs.readFileSync(new URL("../src/ui/duel.js", import.meta.url), "utf8");
const ritmo = fs.readFileSync(new URL("../src/gameplay/duelo-ritmo.js", import.meta.url), "utf8");
check(/import \{ bonusDeRitmo \} from "\.\/duelo-ritmo\.js"/.test(rpg), "rpg não importa o ritmo");
check(/bonusDeRitmo\(d\.seguidos\)/.test(rpg), "acerto não soma ritmo");
check(/import \{ leituraDeRitmo \} from "\.\.\/gameplay\/duelo-ritmo\.js"/.test(duel), "duelo não importa a leitura");
check(/rpg\.erroPrevisto\(\)/.test(duel), "previsão deve usar a conta real do RPG");
check(/erroPrevisto\(/.test(rpg), "RPG deve ter a conta única do erro");
check(!/danoPrevisto/.test(ritmo), "fórmula de dano duplicada não pode voltar ao módulo de ritmo");
check(/duel-read/.test(duel) && /Se errar: \$\{previsao\} de dano/.test(duel), "duelo não mostra o dano previsto");
check(/Se acertar: ~\$\{rpg\.acertoPrevisto\(\)\}/.test(duel), "duelo não mostra o dano do próximo acerto");
check(/acertoPrevistoParceiro\(p\)/.test(duel) && /leituraDeRitmo\(p\.seguidos/.test(duel), "parceiro sem previsão/ritmo na tela");
check(/acertoPrevisto\(\)/.test(rpg) && /acertoPrevistoParceiro\(p\)/.test(rpg), "RPG sem a conta do próximo acerto");
check(/duel-combo/.test(duel) && /duel-round/.test(duel), "duelo não mostra rodada/ritmo");
check(/duel-theme/.test(duel) && /próximo tema/.test(duel), "duelo não telegrafa o tema da próxima pergunta");
check(/area: q\.area/.test(rpg), "baralho não guarda a área da pergunta");

// ---- RPG real: previsão do acerto e ritmo do parceiro ----
const store = new Map();
globalThis.localStorage = { getItem: (k) => (store.has(k) ? store.get(k) : null), setItem: (k, v) => store.set(k, String(v)), removeItem: (k) => store.delete(k), clear: () => store.clear() };
const { RPG } = await import("../src/gameplay/rpg.js");
const { GROUNDS } = await import("../src/content/rpg-data.js");
const ground = GROUNDS.find((g) => g.id === "cs");
const opcoes = { getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} };

// previsão do acerto: perícia, caráter, couraça e ritmo entram na conta
{
  store.clear();
  const rpgReal = new RPG(opcoes);
  rpgReal.data.skills.cs = 50; // nível 10: dano 3
  rpgReal.startDuel({ id: "previsao-main", name: "Alvo", kind: "slime", tier: 1 }, ground);
  check(rpgReal.acertoPrevisto() === 3, `previsão base deveria ser 3, veio ${rpgReal.acertoPrevisto()}`);
  rpgReal.duel.seguidos = 2;
  check(rpgReal.acertoPrevisto() === 4, "o terceiro acerto deveria fechar +1 de ritmo");
  rpgReal.duel.seguidos = 4;
  check(rpgReal.acertoPrevisto() === 5, "o quinto acerto deveria fechar +2 de ritmo");
  rpgReal.duel.seguidos = 0;
  rpgReal.duel.boss = true;
  rpgReal.duel.bossPhase = 2;
  rpgReal.duel.habilidade = { id: "couraca", nome: "couraça viva", nota: "" };
  check(rpgReal.acertoPrevisto() === 2, "couraça deveria comer 1 do próximo acerto");
}

// ritmo do parceiro: 1, 1 e 2 de dano; erro zera a sequência
{
  store.clear();
  const rpgReal = new RPG(opcoes);
  const partner = { id: "ritmo-parceiro", name: "Parceiro", kind: "slime", tier: 2 };
  const main = { id: "ritmo-main", name: "Principal", kind: "slime", tier: 1 };
  check(rpgReal.startDuel(main, ground, false, [partner]).ok, "duelo com parceiro não abriu");
  const p = rpgReal.duel.partner;
  p.hp = 20;
  p.hpMax = 20;
  rpgReal.data.hp = rpgReal.hpMax();
  const danos = [];
  for (let i = 0; i < 3; i++) {
    const antes = p.hp;
    check(rpgReal.answerPartner(p.question.answer).ok, `parceiro não aceitou o acerto ${i + 1}`);
    danos.push(antes - p.hp);
    if (i < 2) rpgReal.partnerNext(0);
  }
  check(danos[0] === 1 && danos[1] === 1 && danos[2] === 2, `ritmo do parceiro errado: ${danos.join(",")}`);
  check(p.seguidos === 3, `parceiro deveria estar com 3 seguidos, está com ${p.seguidos}`);
  check(/Ritmo do parceiro/.test(p.feedback?.note || ""), "feedback do parceiro sem nota de ritmo");
  rpgReal.partnerNext(0);
  rpgReal.answerPartner((p.question.answer + 1) % p.question.options.length);
  check(p.seguidos === 0, "erro do parceiro deveria zerar a sequência");
}

assert.equal(problemas.length, 0, `duelo com ${problemas.length} problema(s):\n- ${problemas.join("\n- ")}`);
console.log("ok duelo: ritmo +1/+2 com teto, leitura na tela e cobrança única pelo erroPrevisto");

// Ritmo do combate: acertos seguidos somam dano, com teto de +2, e a leitura
// aparece no HUD. Roda sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";
import { bonusDeRitmo, leituraDeRitmo } from "../src/gameplay/duelo-ritmo.js";

const problemas = [];
const check = (ok, msg) => { if (!ok) problemas.push(msg); };

check(bonusDeRitmo(0) === 0, "ritmo em 0 acertos");
check(bonusDeRitmo(2) === 0, "ritmo antes de 3 acertos");
check(bonusDeRitmo(3) === 1 && bonusDeRitmo(4) === 1, "ritmo de 3-4 acertos");
check(bonusDeRitmo(5) === 2 && bonusDeRitmo(40) === 2, "ritmo deveria parar em +2");
check(leituraDeRitmo(0) === "" && leituraDeRitmo(1) === "", "leitura sem ritmo");
check(/terceiro fecha o ritmo/.test(leituraDeRitmo(2)), "aviso de 2 acertos");
check(/\+1 de dano/.test(leituraDeRitmo(3)), "leitura de +1");
check(/\+2 de dano/.test(leituraDeRitmo(5)), "leitura de +2");

const combate = fs.readFileSync(new URL("../src/gameplay/combate.js", import.meta.url), "utf8");
const duel = fs.readFileSync(new URL("../src/ui/duel.js", import.meta.url), "utf8");
check(/import \{ bonusDeRitmo \} from "\.\/duelo-ritmo\.js"/.test(combate), "o combate não importa o ritmo");
check(/bonusDeRitmo\(j\.combo\)/.test(combate), "o acerto não soma ritmo");
check(/duel-combo/.test(duel) && /ritmo \$\{j\.combo\}/.test(duel), "o HUD do combate não mostra o ritmo");

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};
const { RPG } = await import("../src/gameplay/rpg.js");
const { GROUNDS } = await import("../src/content/rpg-data.js");
const ground = GROUNDS.find((g) => g.id === "cs");
const rpg = new RPG({ getLevel: () => 1, gainXp: () => {}, toast: () => {}, audio: {} });
rpg.data.skills.cs = 50; // nível 10: dano base 3
assert.ok(rpg.startDuel({ id: "ritmo-combate", name: "Alvo", kind: "slime", tier: 3 }, ground).ok);
const c = rpg.combate;
const alvo = c.inimigos[0];
alvo.hp = 100;
alvo.hpMax = 100;
alvo.proximoAtaque = 1e9;
c.jogador.x = 100;
c.jogador.y = 100;
alvo.x = 130;
alvo.y = 100;
const danos = [];
for (let i = 0; i < 3; i++) {
  const antes = alvo.hp;
  c.atacar();
  danos.push(Math.round((antes - alvo.hp) * 10) / 10);
  c.agora += 500;
}
check(danos[0] === 3 && danos[1] === 3 && danos[2] === 4, `ritmo errado: ${danos.join(",")}`);
check(c.jogador.combo === 3, `combo devia ser 3, veio ${c.jogador.combo}`);
// levar um golpe zera o ritmo
c.jogador.defendendo = false;
c.jogador.invulneravelAte = 0;
c.agora += 1000;
alvo.x = c.jogador.x + 20;
c.resolverGolpe(alvo);
check(c.jogador.combo === 0, "o golpe recebido não zerou o ritmo");

assert.equal(problemas.length, 0, `ritmo com ${problemas.length} problema(s):\n- ${problemas.join("\n- ")}`);
console.log("ok ritmo: +1/+2 com teto, HUD mostra a sequência e o golpe recebido zera");

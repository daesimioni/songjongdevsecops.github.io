// Ritmo do duelo: sequência de acertos soma dano (teto +2) e a leitura de turno
// mostra o golpe previsto antes da escolha. Roda sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";
import { bonusDeRitmo, leituraDeRitmo, danoPrevisto } from "../js/duelo-ritmo.js";

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

// ---- golpe previsto ----
check(danoPrevisto({ danoBase: 2 }) === 2, "erro base");
check(danoPrevisto({ danoBase: 2, bossPhase: 2 }) === 4, "fase 2 deveria somar 2");
check(danoPrevisto({ danoBase: 2, bossPhase: 3 }) === 6, "fase 3 deveria somar 4");
check(danoPrevisto({ danoBase: 2, trait: "haste" }) === 3, "haste deveria bater de novo");
check(danoPrevisto({ danoBase: 3, trait: "haste" }) === 5, "haste com base 3");
check(danoPrevisto({ danoBase: 2, bossPhase: 2, trait: "haste" }) === 5, "fase e haste juntos");
check(danoPrevisto({ danoBase: 9, escudo: true }) === 0, "espelho deveria segurar");

// ---- integração na fonte ----
const rpg = fs.readFileSync(new URL("../js/rpg.js", import.meta.url), "utf8");
const duel = fs.readFileSync(new URL("../js/duel.js", import.meta.url), "utf8");
check(/import \{ bonusDeRitmo \} from "\.\/duelo-ritmo\.js"/.test(rpg), "rpg não importa o ritmo");
check(/bonusDeRitmo\(d\.seguidos\)/.test(rpg), "acerto não soma ritmo");
check(/import \{ leituraDeRitmo \} from "\.\/duelo-ritmo\.js"/.test(duel), "duelo não importa a leitura");
check(/rpg\.erroPrevisto\(\)/.test(duel), "previsão deve usar a conta real do RPG");
check(/duel-read/.test(duel) && /Se errar: \$\{previsao\} de dano/.test(duel), "duelo não mostra o dano previsto");
check(/duel-combo/.test(duel) && /duel-round/.test(duel), "duelo não mostra rodada/ritmo");

assert.equal(problemas.length, 0, `duelo com ${problemas.length} problema(s):\n- ${problemas.join("\n- ")}`);
console.log("ok duelo: ritmo +1/+2 com teto, golpe previsto com fase/haste/espelho e leitura na tela");

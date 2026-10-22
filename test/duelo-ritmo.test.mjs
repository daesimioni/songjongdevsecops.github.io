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
check(/duel-combo/.test(duel) && /duel-round/.test(duel), "duelo não mostra rodada/ritmo");

assert.equal(problemas.length, 0, `duelo com ${problemas.length} problema(s):\n- ${problemas.join("\n- ")}`);
console.log("ok duelo: ritmo +1/+2 com teto, leitura na tela e cobrança única pelo erroPrevisto");

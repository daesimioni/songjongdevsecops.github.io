// Audição do bicho: correr perto e fora da vista vira o bicho para o som e
// acende "?"; andar não faz barulho, e ouvir não inicia duelo. Sem navegador.
import assert from "node:assert/strict";
import fs from "node:fs";
import { ouveOPassoS, direcaoPara, acordaComOPasso, RAIO_DE_AUDICAO, RAIO_QUE_ACORDA } from "../src/world/audicao.js";

// ---- quem ouve o passo ----
assert.equal(ouveOPassoS({ sprint: true, dist: 4, vendo: false, boss: false }), true, "corrida perto devia ser ouvida");
assert.equal(ouveOPassoS({ sprint: false, dist: 4, vendo: false }), false, "andar não pode fazer barulho");
assert.equal(ouveOPassoS({ sprint: true, dist: 4, vendo: true }), false, "quem já vê não precisa ouvir");
assert.equal(ouveOPassoS({ sprint: true, dist: 7, vendo: false }), false, "além do raio não pode ouvir");
assert.equal(ouveOPassoS({ sprint: true, dist: 0.1, vendo: false }), false, "colado demais não é audição");
assert.equal(ouveOPassoS({ sprint: true, dist: 4, vendo: false, boss: true }), false, "chefe não entra no susto");
assert.equal(ouveOPassoS({ sprint: true, dist: "x", vendo: false }), false, "distância inválida não pode quebrar");
assert.equal(ouveOPassoS({}), false, "sem nada não ouve");
assert.equal(ouveOPassoS({ sprint: true, dist: RAIO_DE_AUDICAO - 0.01, vendo: false }), true, "o limite de dentro precisa valer");

// ---- para onde olhar ----
assert.equal(direcaoPara(0, 0, 0, 3), 0, "sul");
assert.equal(direcaoPara(0, 0, 3, 0), 2, "leste");
assert.equal(direcaoPara(0, 0, -3, 0), 1, "oeste");
assert.equal(direcaoPara(0, 0, 0, -3), 3, "norte");
assert.equal(direcaoPara(0, 0, 4, 1), 2, "o eixo maior decide");
assert.equal(direcaoPara(0, 0, 1, 4), 0, "vertical quando empata para baixo");
assert.equal(direcaoPara(0, 0, 0, 0), 0, "parado não pode dar NaN");
assert.equal(direcaoPara(0, 0, NaN, 1), 0, "coordenada inválida não pode quebrar");

// ---- sono: o passo perto ou a corrida acordam ----
assert.equal(acordaComOPasso({ dist: 1, sprint: false }), true, "pisar perto devia acordar");
assert.equal(acordaComOPasso({ dist: 4, sprint: false }), false, "andar longe não pode acordar");
assert.equal(acordaComOPasso({ dist: 4, sprint: true }), true, "correr no raio devia acordar");
assert.equal(acordaComOPasso({ dist: 7, sprint: true }), false, "correr longe não pode acordar");
assert.equal(acordaComOPasso({ dist: RAIO_QUE_ACORDA - 0.01, sprint: false }), true, "o limite de perto precisa valer");
assert.equal(acordaComOPasso({ dist: "x", sprint: true }), false, "distância inválida não pode acordar");
assert.equal(acordaComOPasso({}), false, "sem nada não acorda");

// ---- a caverna usa a audição sem iniciar duelo ----
const dungeon = fs.readFileSync(new URL("../src/app/dungeon.js", import.meta.url), "utf8");
assert.match(dungeon, /ouveOPassoS\(\{ sprint: state\.sprint, dist: distOuve, vendo: canSeePlayer\(m\), boss: m\.boss \}\)/, "a caverna não chama a audição");
assert.match(dungeon, /m\.ouvindo = t \+ 2200/, "o bicho não guarda o tempo de escuta");
assert.match(dungeon, /m\.dir = direcaoPara\(m\.x, m\.y, state\.player\.x, state\.player\.y\)/, "o bicho não vira para o som");
assert.match(dungeon, /else if \(m\.ouvindo > clock\(\)\)[\s\S]*fillText\("\?"/, "o ? não é desenhado");
assert.match(dungeon, /if \(m\.dorme\) \{\s*if \(!acordaComOPasso\(\{ dist: distOuve, sprint: state\.sprint \}\)\) continue;\s*m\.dorme = false;/, "o bicho dormindo não acorda pelo passo");
assert.match(dungeon, /if \(h % 5 === 0\) m\.dorme = true;/, "nenhum bicho nasce dormindo");
assert.match(dungeon, /else if \(m\.dorme\)[\s\S]*fillText\("z"/, "o z do sono não é desenhado");
// a audição não pode chamar startAlert nem onEncounter
const bloco = dungeon.slice(dungeon.indexOf("if (ouveOPassoS"), dungeon.indexOf("if (t >= m.waitUntil)"));
assert.ok(!/startAlert|onEncounter/.test(bloco), "ouvir não pode iniciar duelo");

console.log("ok audição: corrida no raio vira o bicho para o som com ?, andar não faz barulho e ouvir não luta");

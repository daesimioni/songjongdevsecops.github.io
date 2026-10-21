// A peça de equipamento sai da mão e anda com o braço: o teste desenha o
// boneco num canvas de mentira, guarda os retângulos e confere a distância do
// punho até a mão e se o punho muda de altura quando o passo muda.
import assert from "node:assert/strict";

const { drawHuman, gearView, direcaoBase, ladoDaDiagonal } = await import("../js/human.js");

const colors = { shirt: "#2f6f86", pants: "#1b1c2c", shoes: "#101426", skin: "#f0c9a8", hair: "#3a2a55", eyes: "#14121f", accent: "#fff3d1" };
const look = { gender: "f", hair: "longo" };
const gear = {
  weapon: { weapon: "sword", accent: "#61f4c0" },
  shield: { accent: "#ffc857" },
  helmet: { accent: "#b8b0d8" },
  armor: { accent: "#2f6f86" },
};

// canvas de mentira: só os retângulos importam
function desenhar(dir, moving, time) {
  const rets = [];
  let estilo = "#000";
  const ctx = {
    save() {},
    restore() {},
    translate() {},
    scale() {},
    beginPath() {},
    ellipse() {},
    fill() {},
    set fillStyle(v) { estilo = v; },
    get fillStyle() { return estilo; },
    fillRect(x, y, w, h) { rets.push({ x, y, w, h, cor: estilo }); },
  };
  drawHuman(ctx, 0, 0, dir, moving, time, colors, 1, look, gear);
  return rets;
}

const perto = (a, b, tol) => Math.abs(a - b) <= tol;

for (const dir of [0, 1, 2, 3, 4, 5, 6, 7]) {
  for (const moving of [false, true]) {
    const rets = desenhar(dir, moving, 90);
    const mao = rets.filter((r) => r.cor === colors.skin && r.w === 2 && r.h === 2);
    const punho = rets.filter((r) => r.cor === "#61f4c0");
    const escudo = rets.filter((r) => r.cor === "#ffc857");
    assert.ok(mao.length >= 2, `dir ${dir}: as duas mãos aparecem`);
    assert.ok(punho.length >= 1, `dir ${dir}: o pomo da arma aparece`);
    assert.ok(escudo.length >= 1, `dir ${dir}: o campo do escudo aparece`);

    // o punho tem que estar na altura da mão, não do ombro
    const alturaMao = Math.min(...mao.map((r) => r.y));
    const alturaPunho = Math.max(...punho.map((r) => r.y + r.h));
    assert.ok(
      alturaPunho - alturaMao >= 0 && alturaPunho - alturaMao <= 6,
      `dir ${dir} moving ${moving}: punho a ${alturaPunho - alturaMao} px da mão`,
    );

    // o escudo cobre o braço daquele lado, não flutua longe do corpo
    const xMao = mao.map((r) => r.x);
    const xEscudo = escudo.map((r) => r.x + r.w / 2);
    const maisPerto = Math.min(...xMao.map((mx) => Math.min(...xEscudo.map((ex) => Math.abs(ex - mx)))));
    assert.ok(maisPerto <= 6, `dir ${dir}: escudo a ${maisPerto} px da mão`);
  }
}

// andando, o punho sobe e desce junto com o braço
const parado = desenhar(2, false, 0).filter((r) => r.cor === "#61f4c0");
const passoA = desenhar(2, true, 0).filter((r) => r.cor === "#61f4c0");
const passoB = desenhar(2, true, 98).filter((r) => r.cor === "#61f4c0");
const altura = (lista) => Math.max(...lista.map((r) => r.y + r.h));
assert.ok(
  altura(parado) !== altura(passoA) || altura(passoA) !== altura(passoB),
  "o punho acompanha o passo",
);
assert.ok(
  passoA.some((r) => r.x !== passoB[0]?.x) || altura(passoA) !== altura(passoB),
  "o punho balança entre dois instantes do passo",
);

// oito direções: quatro diagonais novas, cada uma com lado e camada próprios
assert.deepEqual([0, 1, 2, 3, 4, 5, 6, 7].map(direcaoBase), [0, 1, 2, 3, 1, 2, 3, 3], "diagonal usa perfil ou costas");
assert.deepEqual([0, 4, 5, 6, 7].map(ladoDaDiagonal), [0, -1, 1, -1, 1], "lado da diagonal");
const g4 = gearView(4);
const g5 = gearView(5);
assert.equal(g4.armaLado, -1, "diagonal baixo-esquerda arma à esquerda");
assert.equal(g5.armaLado, 1, "diagonal baixo-direita arma à direita");
assert.equal(gearView(6).armaAtras, true, "diagonal cima-esquerda arma atrás");
assert.equal(gearView(5).armaAtras, false, "diagonal baixo-direita arma na frente");
for (const dir of [0, 1, 2, 3, 4, 5, 6, 7]) {
  assert.equal(gearView(dir).escudoAtras, dir !== 0, `dir ${dir}: escudo atrás menos de frente`);
}

console.log("ok equipamento sai da mão, cobre o braço e acompanha o passo");

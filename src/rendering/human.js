import {drawHeadgear,detailGarment} from "./gear-art.js";
import { actorView } from "./actor-volume.js";
import { artTime } from "./art-style.js";
import { hairById } from "../content/avatar.js";

// O lado e a camada de cada peça de equipamento mudam com a visão. De frente
// arma e escudo aparecem inteiros; de costas os dois ficam atrás do corpo; de
// perfil o escudo fica no braço de trás e a arma aponta para o lado da cara.
// Oito direções: 0 frente, 1 esquerda, 2 direita, 3 costas e as quatro
// diagonais (4 baixo-esquerda, 5 baixo-direita, 6 cima-esquerda, 7 cima-direita).
export function gearView(dir) {
  const ladoDiag = dir === 4 || dir === 6 ? -1 : dir === 5 || dir === 7 ? 1 : 0;
  // na diagonal a arma fica do lado para onde o corpo virou
  const armaLado = ladoDiag || (dir === 0 || dir === 2 ? 1 : -1);
  return {
    armaLado,
    escudoLado: -armaLado,
    armaAtras: dir === 3 || dir === 6 || dir === 7,
    // só de frente os dois braços estão à vista; em qualquer outra vista o
    // escudo fica no braço de trás, senão ele cobre o peito
    escudoAtras: dir !== 0,
  };
}

// A diagonal desenha o perfil (ou as costas) com a cabeça um pixel para o lado
// e o tronco virado: é o 3/4 de quem está andando torto no mapa.
export function direcaoBase(dir) {
  if (dir === 4) return 1;
  if (dir === 5) return 2;
  if (dir === 6 || dir === 7) return 3;
  return dir;
}

export function ladoDaDiagonal(dir) {
  if (dir === 4 || dir === 6) return -1;
  if (dir === 5 || dir === 7) return 1;
  return 0;
}

// O mesmo boneco na superfície e no subsolo: cabelo, gênero e cores vêm do
// personagem salvo. Quem chama decide o chão, a sombra e o que fica por cima.
// `gesture` é o papel de NPC (guia, monitor, mestre): parado, ele ganha um
// gesto próprio no lugar do braço morto.
export function drawHuman(ctx, px, py, dir, moving, time, colors, scale = 1, look = null, gear = null, gesture = null) {
  time = artTime(time);
  const s = scale;
  const step = moving ? Math.sin(time * 0.016) : 0;
  // parado, o corpo respira: meio pixel para cima e para baixo, sem trocar a
  // pose. É o que tira o boneco de estátua.
  const respira = moving ? 0 : Math.sin(time * 0.0042) * 0.45;
  // pisca de vez em quando; o olho fechado é uma linha de 1 px
  const pisca = !moving && Math.floor(time / 170) % 23 === 0;
  // parado, a cabeça olha em volta e às vezes cabeceia. A fase vem do posto,
  // então dois NPCs não olham no mesmo compasso e a praça não fica coreografada
  const olhar = moving ? 0 : Math.round(Math.sin(time * 0.0011 + px * 0.07 + py * 0.05));
  const cabeceio = !moving && Math.sin(time * 0.0017 + px * 0.03 + py * 0.05) > 0.9 ? -1 : 0;
  // passo com quique: o corpo sobe e desce um terço de pixel no compasso
  const quique = moving ? -Math.abs(Math.sin(time * 0.016)) * 0.6 : 0;
  ctx.save();
  ctx.translate(px, py + respira + quique);
  ctx.scale(s, s);
  // Ombros e profundidade acompanham o plano de visão do rosto.
  const view = actorView(dir);

  ctx.fillStyle = "rgba(2,4,10,0.38)";
  ctx.beginPath();
  ctx.ellipse(0, 0, 6.5, 2.6, 0, 0, Math.PI * 2);
  ctx.fill();

  // o que está equipado muda o desenho: cor da armadura, elmo, arma e escudo
  const equip = gear || {};
  const shirt = equip.armor?.accent || colors.shirt;
  const pants = equip.legs?.accent || colors.pants;
  const shoes = equip.boots?.accent || colors.shoes || "#1b1c2c";
  const legOff = step > 0 ? 1 : step < -0 ? -1 : 0;
  const lift = moving ? Math.abs(step) * 1.1 : 0;
  const hair = hairById(look?.hair);
  const base = direcaoBase(dir);
  const ladoDiag = ladoDaDiagonal(dir);
  // diagonal é 3/4: tronco inclinado para o lado do passo, ombro de trás
  // escondido e cabeça deslocada dois pixels, senão parece andar de lado
  const diag = ladoDiag !== 0;
  // feminino tem ombro mais estreito e quadril mais largo; masculino o contrário
  const fem = look?.gender !== "m";
  const shoulder = fem ? 4 : 5;
  const armX = shoulder + 1;

  // cabelo que cai nas costas fica atrás do corpo
  if (hair.back) {
    ctx.fillStyle = colors.hair;
    const cabeloX = diag ? ladoDiag : 0;
    ctx.fillRect(-4 + cabeloX, -21, 8, 8 + hair.back);
    ctx.fillRect(-5 + cabeloX, -19, 1, Math.max(0, hair.back - 2));
    ctx.fillRect(4 + cabeloX, -19, 1, Math.max(0, hair.back - 2));
  }

  // A capa fica atrás na frente e cobre o dorso nas vistas de costas.
  const desenharCapa = () => {
    if (!equip.cloak) return;
    const cor = equip.cloak.accent || "#6b4a8f";
    const bal = moving ? Math.sin(time * 0.01) * 1.2 : 0;
    ctx.fillStyle = "#1a1428";
    ctx.beginPath();
    ctx.moveTo(-5, -20); ctx.lineTo(5, -20);
    ctx.lineTo(6 + bal, -4); ctx.lineTo(-6 + bal, -4);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = cor;
    ctx.beginPath();
    ctx.moveTo(-4, -19); ctx.lineTo(4, -19);
    ctx.lineTo(5 + bal, -5); ctx.lineTo(-5 + bal, -5);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = "rgba(255,255,255,0.18)";
    ctx.fillRect(-4, -19, 8, 1);
  };
  if(base!==3)desenharCapa();

  // Arma e escudo trocam de lado com a visão. De costas os dois ficam atrás
  // do corpo; de lado o escudo fica no braço de trás. O desenho é feito do
  // lado direito e espelhado, para não duplicar cada peça de arte.
  const { armaLado, escudoLado, armaAtras, escudoAtras } = gearView(dir);
  const comLado = (lado, fn) => {
    ctx.save();
    ctx.scale(lado, 1);
    fn();
    ctx.restore();
  };
  const desenharArma = () => {
    const arma = equip.weapon;
    if (!arma) return;
    const gume = arma.accent || "#d8d2ea";
    // a peça sai da mão, não do ombro: a mão é o último par de pixels do braço
    // daquele lado, e ela sobe e desce com o passo
    const maoY = -6 + (armaLado > 0 ? -1 : 1) * Math.max(0, legOff);
    const hx = armX - 1;
    const balanco = moving ? Math.sin(time * 0.016) * 0.7 : 0;
    comLado(armaLado, () => {
      if (arma.weapon === "wand" || arma.weapon === "rod") {
        // cajado: cabo comprido na mão, ponta com a pedra da área
        ctx.fillStyle = "#5b3a22";
        ctx.fillRect(hx, maoY - 12, 2, 15);
        ctx.fillStyle = "#7a5433";
        ctx.fillRect(hx, maoY - 12, 1, 14);
        ctx.fillStyle = "#3a2414";
        ctx.fillRect(hx, maoY - 1, 2, 1);
        ctx.fillStyle = gume;
        ctx.fillRect(hx - 1, maoY - 16, 4, 4);
        ctx.fillStyle = "rgba(255,255,255,0.55)";
        ctx.fillRect(hx - 1, maoY - 16, 1, 1);
        ctx.fillStyle = "rgba(0,0,0,0.22)";
        ctx.fillRect(hx + 1, maoY - 13, 2, 1);
      } else if (arma.weapon === "club") {
        // maça: cabo curto e cabeça pesada, com cravos
        ctx.fillStyle = "#5b3a22";
        ctx.fillRect(hx, maoY - 8, 2, 10);
        ctx.fillStyle = gume;
        ctx.fillRect(hx - 2, maoY - 15, 6, 7);
        ctx.fillRect(hx - 1, maoY - 16, 4, 1);
        ctx.fillStyle = "rgba(255,255,255,0.22)";
        ctx.fillRect(hx - 2, maoY - 15, 2, 1);
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.fillRect(hx - 1, maoY - 12, 4, 1);
        ctx.fillRect(hx, maoY - 10, 3, 1);
      } else {
        // espada: contorno escuro para separar do corpo, aço no meio, gume
        // claro na borda de fora, guarda dourada, cabo de couro e pomo na cor
        // da área. Tudo preso na mão, que sobe e desce com o passo.
        const px0 = hx + 1 + (balanco > 0 ? 1 : 0);
        ctx.fillStyle = "#20233a";
        ctx.fillRect(px0 - 1, maoY - 12, 4, 12);
        ctx.fillStyle = "#a9b0c9";
        ctx.fillRect(px0, maoY - 12, 2, 10);
        ctx.fillStyle = "#e8eefb";
        ctx.fillRect(px0 + 1, maoY - 11, 1, 8);
        ctx.fillStyle = "#6b7292";
        ctx.fillRect(px0, maoY - 11, 1, 8);
        // guarda
        ctx.fillStyle = "#c9a227";
        ctx.fillRect(px0 - 2, maoY - 3, 6, 1);
        ctx.fillRect(px0 - 2, maoY - 2, 1, 1);
        ctx.fillRect(px0 + 3, maoY - 2, 1, 1);
        // cabo, com a mão por cima para o punho parecer seguro
        ctx.fillStyle = "#4a2f1b";
        ctx.fillRect(px0, maoY - 1, 2, 3);
        ctx.fillStyle = colors.skin;
        ctx.fillRect(px0, maoY, 2, 1);
        ctx.fillStyle = gume;
        ctx.fillRect(px0 - 1, maoY + 2, 4, 2);
        ctx.fillStyle = "rgba(0,0,0,0.3)";
        ctx.fillRect(px0 - 1, maoY + 3, 4, 1);
      }
    });
  };
  const desenharEscudo = () => {
    if (!equip.shield) return;
    const cor = equip.shield.accent || "#ffc857";
    const maoY = -6 + (escudoLado > 0 ? -1 : 1) * Math.max(0, legOff);
    const hx = armX - 1;
    comLado(escudoLado, () => {
      // broquel no antebraço: aro escuro em volta, campo na cor da área, umbo
      // de metal e a alça aparecendo na borda de baixo
      const sx0 = hx - 2;
      const sy0 = maoY - 4;
      ctx.fillStyle = "#0a0d19";
      ctx.fillRect(sx0 - 1, sy0 + 1, 8, 11);
      ctx.fillRect(sx0, sy0, 6, 13);
      ctx.fillStyle = cor;
      ctx.fillRect(sx0, sy0 + 1, 6, 11);
      ctx.fillStyle = "rgba(255,255,255,0.2)";
      ctx.fillRect(sx0, sy0 + 1, 1, 10);
      ctx.fillRect(sx0 + 1, sy0 + 1, 4, 1);
      ctx.fillStyle = "rgba(0,0,0,0.28)";
      ctx.fillRect(sx0 + 5, sy0 + 2, 1, 9);
      ctx.fillRect(sx0 + 1, sy0 + 11, 4, 1);
      // cravos nos cantos e umbo no meio
      ctx.fillStyle = "rgba(0,0,0,0.35)";
      ctx.fillRect(sx0 + 1, sy0 + 2, 1, 1);
      ctx.fillRect(sx0 + 4, sy0 + 2, 1, 1);
      ctx.fillRect(sx0 + 1, sy0 + 10, 1, 1);
      ctx.fillRect(sx0 + 4, sy0 + 10, 1, 1);
      ctx.fillStyle = "#e8e2f6";
      ctx.fillRect(sx0 + 2, sy0 + 5, 2, 3);
      ctx.fillStyle = "#9aa0bd";
      ctx.fillRect(sx0 + 2, sy0 + 7, 2, 1);
      ctx.fillStyle = "#6b4a2a";
      ctx.fillRect(sx0 + 1, sy0 + 12, 4, 1);
    });
  };
  if (armaAtras) desenharArma();
  if (escudoAtras) desenharEscudo();

  // Pés no plano do chão, com apoio alternado e avanço no rumo real.
  const passoLateral = diag ? 3.4 : 2.5;
  const feet=[-1,1].map(side=>{
    const stride=step*side*2,ground=view.project(side*passoLateral,stride,0);
    return {side,ground,lift:Math.max(0,step*side)*lift,depth:view.depth(side*passoLateral,stride)};
  }).sort((a,b)=>a.depth-b.depth);
  for(const foot of feet){
    const x=foot.ground.x,y=foot.ground.y-foot.lift;
    ctx.fillStyle=pants;ctx.fillRect(Math.round(x)-1.5,-5,3,Math.max(1,5+y));
    ctx.fillStyle=shoes;ctx.fillRect(Math.round(x)-1.5,y-1,3,1.5);
    ctx.fillStyle='rgba(255,236,204,.25)';ctx.fillRect(Math.round(x)-1,y-1,1,.5);
  }

  // Frente, flanco e costas têm planos próprios. Luz fica à esquerda da
  // câmera: espelhar a direção não espelha a iluminação do mundo.
  const turn=view.forward.x,frontWidth=view.profile?shoulder*.55:shoulder*(diag?0.82:1);
  // na diagonal o ombro de cima vai para o lado do passo e o quadril acompanha
  // menos: é a inclinação que faz a leitura de quem caminha torto
  const turnTopo = diag ? ladoDiag * 2.2 : turn;
  const turnBase = diag ? ladoDiag * 0.6 : 0;
  ctx.fillStyle=shirt;
  ctx.beginPath();ctx.moveTo(-frontWidth+turnTopo,-13);ctx.lineTo(frontWidth+turnTopo,-13);
  ctx.lineTo(frontWidth+turnBase,-4);ctx.lineTo(-frontWidth+turnBase,-4);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(255,236,204,.22)';ctx.fillRect(-frontWidth+turnTopo+1,-12,1,7);
  ctx.fillStyle='rgba(8,18,32,.3)';ctx.fillRect(frontWidth+turnTopo-1,-12,1,8);
  ctx.fillStyle=pants;ctx.fillRect(-frontWidth,-5,frontWidth*2,2);
  if(base===3){
    ctx.fillStyle='rgba(8,18,32,.3)';ctx.fillRect(turnTopo,-12,.5,7);
    ctx.fillStyle=colors.accent||'#e5c792';ctx.fillRect(-2+turnTopo,-12,4,.5);
  }else{
    ctx.fillStyle='rgba(255,236,204,.35)';ctx.fillRect(-2+turnTopo,-13,1,2);ctx.fillRect(1+turnTopo,-13,1,2);
  }

  detailGarment(ctx,equip.armor,base,turnTopo,frontWidth);
  if(base===3)desenharCapa();

  // braços. Parado, o papel do NPC troca o braço do lado do gesto: guia aponta
  // o caminho, monitor ergue a mão, mestre segura um livro aberto. O ciclo é
  // lento e a fase vem do lugar, então dois mestres não folheiam juntos.
  const gestoCiclo = moving || !gesture || base === 3
    ? 0
    : Math.sin(time * 0.0009 + px * 0.05 + py * 0.04);
  const gestoForca = gestoCiclo > 0.3 ? (gestoCiclo - 0.3) / 0.7 : 0;
  const ladoGesto = base === 1 ? -1 : 1;
  const bracoLonge = diag ? -ladoDiag : 0; // +1: braço direito longe; -1: esquerdo
  // o ombro de trás fica com um pixel só, colado na borda do tronco inclinado;
  // a mão continua aparecendo
  const largEsq = bracoLonge === -1 ? 1 : 2;
  const largDir = bracoLonge === 1 ? 1 : 2;
  const bordaEsq = -frontWidth + turnBase;
  const bordaDir = frontWidth + turnBase;
  const xEsq = bracoLonge === -1 ? bordaEsq - 0.5 : -armX;
  const xDir = bracoLonge === 1 ? bordaDir - 0.5 : armX - 1;
  ctx.fillStyle = shirt;
  ctx.fillRect(xEsq, -12 + Math.max(0, legOff), largEsq, 6);
  if (gestoForca > 0) {
    ctx.save();
    ctx.scale(ladoGesto, 1);
    const mao = Math.round(gestoForca * 2);
    if (gesture === "guia") {
      // braço esticado na altura do ombro, mão aberta apontando
      ctx.fillStyle = shirt;
      ctx.fillRect(armX - 1, -12 - mao, 3 + mao, 2);
      ctx.fillStyle = colors.skin;
      ctx.fillRect(armX + 1 + mao, -12 - mao, 2, 2);
    } else if (gesture === "monitor") {
      // mão erguida, de quem pede a palavra
      ctx.fillStyle = shirt;
      ctx.fillRect(armX - 1, -13 - mao, 2, 3 + mao);
      ctx.fillStyle = colors.skin;
      ctx.fillRect(armX - 1, -15 - mao, 2, 2);
    } else {
      // mestre folheando: livro aberto na frente do peito
      ctx.fillStyle = "#e8e2f6";
      ctx.fillRect(-3, -11 - mao, 6, 2);
      ctx.fillStyle = "#8d84a8";
      ctx.fillRect(-1, -11 - mao, 2, 2);
      ctx.fillStyle = colors.skin;
      ctx.fillRect(-5, -10 - mao, 2, 2);
      ctx.fillRect(3, -10 - mao, 2, 2);
    }
    ctx.restore();
  } else {
    ctx.fillRect(xDir, -12 - Math.max(0, legOff), largDir, 6);
  }
  ctx.fillStyle = colors.skin;
  ctx.fillRect(xEsq, -6 + Math.max(0, legOff), 2, 2);
  if (!gestoForca) ctx.fillRect(xDir, -6 - Math.max(0, legOff), 2, 2);

  // cabeça: na diagonal ela desliza um pixel para o lado da caminhada e, parada,
  // olha em volta (1 px) e cabeceia de vez em quando
  ctx.save();
  if (ladoDiag || olhar || cabeceio) ctx.translate((diag ? ladoDiag * 2 : ladoDiag) + olhar, cabeceio);
  ctx.fillStyle = colors.skin;
  // Têmporas, bochechas e queixo recortam o quadrado da cabeça.
  ctx.beginPath();ctx.moveTo(-3,-20);ctx.lineTo(3,-20);ctx.lineTo(4,-18);
  ctx.lineTo(4,-15);ctx.lineTo(2,-12);ctx.lineTo(-2,-12);ctx.lineTo(-4,-15);ctx.lineTo(-4,-18);ctx.closePath();ctx.fill();
  ctx.fillStyle='rgba(108,65,64,.24)';ctx.fillRect(3,-18,1,3);ctx.fillRect(-2,-13,4,.5);
  ctx.fillStyle='rgba(255,231,190,.26)';ctx.fillRect(-3,-18,.5,3);ctx.fillRect(-2,-19,3,.5);
  // de costas a nuca é cabelo: sem isso a face aparece atrás da cabeça
  if (base === 3) {
    ctx.fillStyle = colors.hair;
    ctx.beginPath();
    ctx.moveTo(-4,-21);ctx.lineTo(4,-21);ctx.lineTo(4,-14);
    ctx.lineTo(2,-12);ctx.lineTo(-2,-12);ctx.lineTo(-4,-14);
    ctx.closePath();ctx.fill();
  }
  // cabelo: topo, costeleta e nuca, sempre deixando o rosto de fora
  ctx.fillStyle = colors.hair;
  const crown = -20 - hair.cap;
  ctx.fillRect(-4, crown, 8, hair.cap + 1);
  if (hair.cap >= 3) {
    ctx.fillRect(-5, crown + 1, 1, 2);
    ctx.fillRect(4, crown + 1, 1, 2);
  }
  if (hair.bun) {
    ctx.fillRect(-3, crown - hair.bun + 1, 6, hair.bun - 1);
    ctx.fillRect(-2, crown - hair.bun, 4, hair.bun);
  }
  if (hair.crest) ctx.fillRect(-1, crown - hair.crest, 2, hair.crest + 2);
  if (hair.pompadour) {
    ctx.fillRect(-3, crown - hair.pompadour + 1, 7, hair.pompadour - 1);
    ctx.fillRect(-2, crown - hair.pompadour, 5, 1);
  }
  if (hair.curl) {
    for (const x of [-5, -2, 2, 4]) ctx.fillRect(x, crown + (x % 2 ? -1 : 1), 2, 2);
  }
  if (hair.wave) {
    for (const y of [crown + 1, crown + 4, crown + 7]) {
      ctx.fillRect(-6, y, 2, 3);
      ctx.fillRect(5, y + 1, 2, 3);
    }
  }
  if (hair.side) {
    if (base === 0) {
      ctx.fillRect(-5, -20, 1, hair.side);
      ctx.fillRect(4, -20, 1, hair.side);
    } else if (base === 1) {
      ctx.fillRect(2, -20, 3, hair.side + 1);
    } else if (base === 2) {
      ctx.fillRect(-5, -20, 3, hair.side + 1);
    } else {
      ctx.fillRect(-4, -20, 8, Math.min(7, hair.side + 2));
    }
  }
  if (hair.bang && base !== 3) ctx.fillRect(-4, -20, 8, hair.bang);
  // cabelo comprido cai pelos lados do corpo, senão a camisa come tudo
  if (hair.back) {
    const bottom = -21 + 8 + hair.back;
    ctx.fillRect(-6, -20, 2, bottom + 20);
    ctx.fillRect(4, -20, 2, bottom + 20);
  }
  if (hair.braid) {
    const side = dir === 1 || dir === 3 ? 3 : -7;
    for (let i = 0; i < hair.braid; i++) {
      ctx.fillRect(side + (i % 2 ? 1 : 0), -16 + i * 4, 3, 4);
    }
  }

  if (hair.tail) {
    const tailY = hair.tailY ?? -18;
    if (base === 0) {
      ctx.fillRect(-8, tailY, 3, hair.tail);
      ctx.fillRect(5, tailY, 3, hair.tail);
    } else if (base === 3) {
      ctx.fillRect(-3, tailY + 1, 6, hair.tail - 1);
    } else {
      const tx = base === 1 ? 4 : -9;
      ctx.fillRect(tx, tailY, 5, hair.tail);
    }
  }
  // Mechas seguem o corte escolhido, sem apagar coque, trança ou franja.
  ctx.save();ctx.globalCompositeOperation='source-atop';
  ctx.fillStyle='rgba(255,226,188,.22)';ctx.fillRect(-3,crown+1,2,.5);
  ctx.fillRect(-2,crown+2,.5,Math.max(1,hair.cap-1));
  ctx.fillStyle='rgba(10,18,31,.3)';ctx.fillRect(2,crown+1,.5,Math.max(1,hair.cap));
  ctx.restore();
  if(equip.helmet)drawHeadgear(ctx,equip.helmet,base);
  // rosto: olho e nariz do lado para onde anda
  ctx.fillStyle = colors.eyes || "#14121f";
  const olhoAlto = pisca ? 1 : 2;
  if (base === 0) {
  ctx.fillRect(-2, -17, 1, olhoAlto);
  ctx.fillRect(1, -17, 1, olhoAlto);
  } else if (base === 1) {
  ctx.fillRect(-3, -17, 1, olhoAlto);
  } else if (base === 2) {
  ctx.fillRect(2, -17, 1, olhoAlto);
  }
  if (base === 1 || base === 2) {
  ctx.fillStyle = colors.skin;
  ctx.fillRect(base === 1 ? -5 : 4, -16, 1, 2);
  }
  // na diagonal de frente o segundo olho aparece na borda mais próxima
  if (dir === 4 || dir === 5) {
    ctx.fillStyle = colors.eyes || "#14121f";
    ctx.fillRect(dir === 4 ? 1 : -2, -17, 1, 1);
  }
  ctx.restore();
  // detalhe no peito
  ctx.fillStyle = colors.accent || "#fff3d1";
  if(base !== 3) ctx.fillRect(-1, -11, 2, 2);

  // Costuras, botões, cinto e luz no ombro: mesmo vocabulário dos itens.
  ctx.fillStyle='rgba(255,236,204,.4)';ctx.fillRect(-shoulder+1,-12,2,.5);
  ctx.fillRect(-3,-8,.5,3);ctx.fillStyle='rgba(8,18,32,.38)';ctx.fillRect(-3,-4,6,1);
  ctx.fillStyle=colors.accent||'#e5c792';ctx.fillRect(-.5,-4,1,1);
  if(base!==3){ctx.fillStyle='rgba(255,240,205,.5)';ctx.fillRect(.5,-9,.5,.5);ctx.fillRect(.5,-7,.5,.5);}
  if (!armaAtras) desenharArma();
  if (!escudoAtras) desenharEscudo();

  ctx.restore();
  }

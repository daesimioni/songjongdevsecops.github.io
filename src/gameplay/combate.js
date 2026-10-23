// Combate de ação: o duelo de monstros deixou de ser pergunta. O jogador
// anda, ataca com J, defende com K, esquiva com L e usa as runas com 1-6.
// O modelo não toca no DOM: a tela lê o estado e desenha.
import { facingDirection } from "../core/movement.js";
import { TIERS, MONSTER_TRAITS } from "../content/rpg-data.js";
import { bonusDeRitmo } from "./duelo-ritmo.js";
import { danoDoJogador, curaDoChefe, espelhoDoChefe, extraDoErro } from "./chefe-habilidades.js";

export const ARENA = { w: 960, h: 420, margem: 34 };

export const COMBATE = {
  velocidade: 205,
  ataqueAlcance: 74,
  ataqueRecarga: 450,
  defesaReducao: 0.22,
  defesaParryMs: 180,
  esquivaMs: 175,
  esquivaVelocidade: 560,
  esquivaRecarga: 1100,
  jogadorRaio: 15,
  magiaRecarga: 1250,
};

const clamp = (v, a, b) => Math.max(a, Math.min(b, v));

function normalizar(x, y) {
  const d = Math.hypot(x, y);
  if (d < 0.0001) return { x: 0, y: 0, d: 0 };
  return { x: x / d, y: y / d, d };
}

const direcaoDe = (x, y) => facingDirection(x, y, 0);

function criarInimigo(entrada, indice, { rpg, boss, random }) {
  const monster = entrada.monster || entrada;
  const tier = clamp(Number(boss && indice === 0 ? 4 : entrada.tier || monster.tier || 1), 1, 4);
  const hpMax = Number(entrada.hpMax) || (boss ? TIERS[4].hp : Math.round(TIERS[tier].hp * (Number(monster.hpMult) || 1)));
  const fase = Math.floor(indice / 2);
  const x = boss ? ARENA.w * 0.68 : ARENA.w * (0.62 + (indice % 2) * 0.13);
  const y = boss ? ARENA.h * 0.45 : ARENA.h * (0.3 + fase * 0.16 + (indice % 2) * 0.06);
  return {
    indice,
    monster,
    nome: String(monster.name || "criatura").slice(0, 40),
    kind: monster.kind || "slime",
    tier,
    boss: !!boss && indice === 0,
    x: clamp(x, ARENA.margem, ARENA.w - ARENA.margem),
    y: clamp(y, ARENA.margem, ARENA.h - ARENA.margem),
    dir: 2,
    raio: boss ? 36 : 16 + tier * 2,
    hp: Number(entrada.hp) || hpMax,
    hpMax,
    morte: false,
    hitAte: 0,
    atordoadoAte: 0,
    venenoAte: 0,
    venenoDano: 0,
    proximoAtaque: 700 + indice * 260,
    ventoAte: 0,
    vento: false,
    especialAte: 0,
    especialPronto: 7200,
    especial: false,
    curaPronto: 2500,
    phase: 1,
    flash: 0,
  };
}

export class Combate {
  constructor({ rpg, monster, ground, boss = false, partners = [], training = false, random = Math.random }) {
    this.rpg = rpg;
    this.ground = ground;
    this.boss = !!boss;
    this.training = !!training;
    this.random = random;
    this.agora = 0;
    this.phase = "combat";
    this.eventos = [];
    // Histórico visual independente da fila consumida pelo áudio/UI. As posições
    // são fotografadas na emissão: um impacto não segue o alvo que se afastou.
    this.efeitos = [];
    this.jogador = {
      x: ARENA.w * 0.24,
      y: ARENA.h * 0.7,
      dir: 2,
      movendo: false,
      hp: rpg.hp(),
      hpMax: rpg.hpMax(),
      mana: rpg.mana(),
      manaMax: rpg.manaMax(),
      ataquePronto: 0,
      ataqueVisualAte: 0,
      defendendo: false,
      defesaDesde: -9999,
      esquivaAte: 0,
      esquivaPronto: 0,
      esquivaX: 0,
      esquivaY: 0,
      invulneravelAte: 0,
      escudo: false,
      eco: 0,
      lente: false,
      contraAtaque: 0,
      bruxoPendente: false,
      combo: 0,
      ataques: 0,
      feridoAte: 0,
      parryAte: -9999,
      alvo: null,
    };
    this.inimigos = [monster, ...partners].map((entrada, indice) =>
      criarInimigo(entrada, indice, { rpg, boss: this.boss, random }),
    );
    this.magias = new Map();
    this.rpg.duel.monsterHp = this.inimigos[0].hp;
    this.rpg.duel.monsterHpMax = this.inimigos[0].hpMax;
  }

  visivel(a, b) { return !this.space?.visible || this.space.visible(a, b); }

  posicionar(actor, antes, x, y) {
    if (this.space?.move) {
      actor.x = antes.x; actor.y = antes.y;
      this.space.move(actor, x - antes.x, y - antes.y);
      return;
    }
    actor.x = clamp(x, ARENA.margem, ARENA.w - ARENA.margem);
    actor.y = clamp(y, ARENA.margem, ARENA.h - ARENA.margem);
  }

  adicionar(monster) {
    if (!this.space || this.phase !== "combat" || this.training || monster.boss ||
        this.inimigos.length >= 12 || this.inimigos.some(e => e.monster.id === monster.id)) return null;
    const indice = this.inimigos.length;
    const inimigo = criarInimigo(monster, indice, { rpg: this.rpg, boss: false, random: this.random });
    inimigo.proximoAtaque += this.agora;
    this.inimigos.push(inimigo);
    this.rpg.duel.partners.push({ monster, tier: inimigo.tier, hp: inimigo.hp, hpMax: inimigo.hpMax, done: false });
    return inimigo;
  }

  get principal() {
    return this.inimigos[0];
  }

  emitir(evento) {
    this.eventos.push(evento);
    const j = this.jogador, alvo = evento.inimigo || evento.alvo;
    this.efeitos.push({
      tipo: evento.tipo, valor: evento.valor, magia: evento.magia,
      vazio: evento.vazio, bloqueado: evento.bloqueado,
      em: this.agora, x: j.x, y: j.y, dir: j.dir,
      alvoX: alvo?.x, alvoY: alvo?.y, alvoDir: alvo?.dir,
    });
    if (this.efeitos.length > 96) this.efeitos.splice(0, this.efeitos.length - 96);
    return evento;
  }

  vivos() {
    return this.inimigos.filter((inimigo) => !inimigo.morte);
  }

  inimigoAoAlcance(alcance = COMBATE.ataqueAlcance) {
    if (this.target && !this.target.morte) {
      const distance = Math.hypot(this.target.x - this.jogador.x, this.target.y - this.jogador.y) - this.target.raio;
      return distance <= alcance && this.visivel(this.jogador, this.target) ? this.target : null;
    }
    let melhor = null;
    let menor = Infinity;
    for (const inimigo of this.vivos()) {
      const d = Math.hypot(inimigo.x - this.jogador.x, inimigo.y - this.jogador.y) - inimigo.raio;
      if (d <= alcance && d < menor && this.visivel(this.jogador, inimigo)) {
        menor = d;
        melhor = inimigo;
      }
    }
    return melhor;
  }

  atacar() {
    const j = this.jogador;
    if (this.phase !== "combat" || j.defendendo || this.agora < j.esquivaAte) return false;
    if (this.agora < j.ataquePronto) return false;
    j.ataquePronto = this.agora + COMBATE.ataqueRecarga;
    j.ataqueVisualAte = this.agora + 260;
    j.ataqueDir = j.dir;
    j.ataques++;
    const alvo = this.inimigoAoAlcance();
    if (!alvo) {
      j.combo = 0;
      this.emitir({ tipo: "ataque", valor: 0, vazio: true });
      return true;
    }
    j.dir = direcaoDe(alvo.x - j.x, alvo.y - j.y);
    j.ataqueDir = j.dir;
    j.combo++;
    const dano = this.danoNoInimigo(alvo, false);
    this.emitir({ tipo: "ataque", alvo, valor: dano, x: alvo.x, y: alvo.y });
    return true;
  }

  defender(ativo) {
    const j = this.jogador;
    if (this.phase !== "combat") return false;
    const antes = j.defendendo;
    j.defendendo = !!ativo;
    if (j.defendendo && !antes) {
      j.defesaDesde = this.agora;
      this.emitir({ tipo: "guarda" });
    }
    return true;
  }

  esquivar() {
    const j = this.jogador;
    if (this.phase !== "combat" || this.agora < j.esquivaPronto) return false;
    let { x, y } = normalizar(j.alvo ? j.alvo.x - j.x : 0, j.alvo ? j.alvo.y - j.y : 0);
    if (!x && !y) {
      const perto = this.vivos().sort((a, b) => Math.hypot(a.x - j.x, a.y - j.y) - Math.hypot(b.x - j.x, b.y - j.y))[0];
      if (perto) {
        ({ x, y } = normalizar(j.x - perto.x, j.y - perto.y));
      } else {
        ({ x, y } = normalizar(j.dir === 1 ? -1 : 1, 0));
      }
    }
    j.esquivaX = x;
    j.esquivaY = y;
    j.esquivaAte = this.agora + COMBATE.esquivaMs;
    j.esquivaPronto = this.agora + COMBATE.esquivaRecarga;
    j.invulneravelAte = this.agora + COMBATE.esquivaMs + 70;
    j.dir = direcaoDe(x, y);
    this.emitir({ tipo: "esquiva" });
    return true;
  }

  passo(dt, entrada = {}) {
    if (this.phase !== "combat") {
      const pendentes = this.eventos.splice(0);
      return pendentes;
    }
    const ms = clamp(Number(dt) * 1000 || 0, 0, 60);
    this.agora += ms;
    this.efeitos = this.efeitos.filter(e => this.agora - e.em < 1000);
    this.moverJogador(ms, entrada);
    for (const inimigo of this.inimigos) {
      if (this.phase !== "combat") break;
      this.atualizarInimigo(inimigo, ms);
    }
    this.atualizarVeneno(ms);
    this.sincronizar();
    return this.eventos.splice(0);
  }

  moverJogador(ms, entrada) {
    const j = this.jogador;
    const dt = ms / 1000;
    const antes = { x: j.x, y: j.y };
    let x = 0;
    let y = 0;
    j.movendo = false;
    if (this.agora < j.esquivaAte) {
      j.x += j.esquivaX * COMBATE.esquivaVelocidade * dt;
      j.y += j.esquivaY * COMBATE.esquivaVelocidade * dt;
      j.movendo = true;
    } else if (!this.space?.externalPlayer) {
      if (Number.isFinite(entrada.mx) || Number.isFinite(entrada.my)) {
        ({ x, y } = normalizar(Number(entrada.mx) || 0, Number(entrada.my) || 0));
      }
      if (!x && !y && j.alvo) {
        const alvo = normalizar(j.alvo.x - j.x, j.alvo.y - j.y);
        if (alvo.d > 8) ({ x, y } = alvo);
        else j.alvo = null;
      }
      if (x || y) {
        const fator = j.defendendo ? 0.45 : 1;
        j.x += x * COMBATE.velocidade * fator * dt;
        j.y += y * COMBATE.velocidade * fator * dt;
        j.dir = direcaoDe(x, y);
        j.movendo = true;
      }
    }
    this.posicionar(j, antes, j.x, j.y);
  }

  atualizarInimigo(inimigo, ms) {
    if (inimigo.morte) return;
    const j = this.jogador;
    const dt = ms / 1000;
    const trait = MONSTER_TRAITS[inimigo.kind]?.id;
    if (this.agora < inimigo.atordoadoAte) return;
    if (inimigo.boss && inimigo.phase >= 2 && this.agora >= inimigo.especialPronto && !inimigo.especial) {
      inimigo.especial = true;
      inimigo.especialAte = this.agora + 900;
      this.emitir({ tipo: "telegrafo", inimigo, especial: true });
      return;
    }
    if (inimigo.especial) {
      if (this.agora >= inimigo.especialAte) {
        inimigo.especial = false;
        inimigo.especialPronto = this.agora + 7800;
        this.areaDoChefe(inimigo);
      }
      return;
    }
    if (inimigo.vento) {
      if (this.agora >= inimigo.ventoAte) this.resolverGolpe(inimigo);
      return;
    }
    const dist = Math.hypot(j.x - inimigo.x, j.y - inimigo.y);
    if (dist > 74 + inimigo.raio || !this.visivel(inimigo, j)) {
      const destino = this.space?.chase?.(inimigo, j) || j;
      const passo = normalizar(destino.x - inimigo.x, destino.y - inimigo.y);
      const velocidade = (82 + inimigo.tier * 20 + (inimigo.boss ? 10 : 0) + (inimigo.phase - 1) * 9) * dt;
      // separa um pouco os bichos da matilha para não virarem um bloco só
      let sx = 0;
      let sy = 0;
      for (const outro of this.inimigos) {
        if (outro === inimigo || outro.morte) continue;
        const dx = inimigo.x - outro.x;
        const dy = inimigo.y - outro.y;
        const d = Math.hypot(dx, dy);
        if (d > 0 && d < 64) {
          sx += (dx / d) * (1 - d / 64);
          sy += (dy / d) * (1 - d / 64);
        }
      }
      this.posicionar(inimigo, { x: inimigo.x, y: inimigo.y },
        inimigo.x + passo.x * velocidade + sx * 26 * dt,
        inimigo.y + passo.y * velocidade + sy * 26 * dt);
      inimigo.dir = direcaoDe(passo.x, passo.y);
    } else if (this.agora >= inimigo.proximoAtaque) {
      inimigo.vento = true;
      inimigo.ventoAte = this.agora + (inimigo.boss ? 470 : 420 + inimigo.tier * 20);
      this.emitir({ tipo: "telegrafo", inimigo });
    }
    const seiva = inimigo.boss && this.rpg.duel?.habilidade?.id === "seiva" && inimigo.phase >= 2;
    if ((trait === "divide" || seiva) && this.agora >= inimigo.curaPronto && inimigo.hp < inimigo.hpMax) {
      const antes = inimigo.hp;
      inimigo.hp = seiva
        ? curaDoChefe("seiva", inimigo.phase, inimigo.hp, inimigo.hpMax)
        : Math.min(inimigo.hpMax, inimigo.hp + Math.max(1, Math.round(inimigo.hpMax * 0.12)));
      inimigo.curaPronto = this.agora + 4200;
      this.emitir({ tipo: "cura", inimigo, valor: inimigo.hp - antes });
    }
  }

  resolverGolpe(inimigo) {
    inimigo.vento = false;
    const j = this.jogador;
    inimigo.dir = direcaoDe(j.x - inimigo.x, j.y - inimigo.y);
    this.emitir({ tipo: "golpeInimigo", inimigo });
    const dist = Math.hypot(j.x - inimigo.x, j.y - inimigo.y);
    const trait = MONSTER_TRAITS[inimigo.kind]?.id;
    const cooldown = (inimigo.boss ? 1550 : 2150 - inimigo.tier * 130) * (inimigo.phase > 1 ? 0.82 : 1) * (trait === "haste" ? 0.78 : 1);
    inimigo.proximoAtaque = this.agora + cooldown;
    if (dist > 82 + inimigo.raio || !this.visivel(inimigo, j)) {
      this.emitir({ tipo: "errou", inimigo });
      return;
    }
    if (this.agora < j.invulneravelAte) {
      this.emitir({ tipo: "esquiva", inimigo });
      return;
    }
    const parry = j.defendendo && this.agora - j.defesaDesde <= COMBATE.defesaParryMs;
    if (parry) {
      j.combo = 0;
      j.contraAtaque = 1;
      j.parryAte = this.agora + 180;
      this.emitir({ tipo: "aparou", inimigo });
      return;
    }
    let dano = TIERS[inimigo.tier]?.damage || 2;
    if (inimigo.boss) {
      dano += Math.max(0, (inimigo.phase - 1) * 2);
      dano += extraDoErro(this.rpg.duel?.habilidade?.id, inimigo.phase);
    }
    dano += Number(inimigo.monster.danoExtra) || 0;
    dano = this.rpg.danoSofrido(dano);
    const bloqueado = j.defendendo;
    if (bloqueado) dano = Math.max(0, Math.round(dano * COMBATE.defesaReducao));
    if (j.escudo) {
      j.escudo = false;
      dano = 0;
    } else if (!bloqueado && this.rpg.data.sub === "domador" && this.rpg.activePet() && !this.petEscudoUsado) {
      this.petEscudoUsado = true;
      dano = 0;
    }
    if (dano > 0) {
      this.ferirJogador(dano);
      j.combo = 0;
      j.feridoAte = this.agora + 220;
      this.emitir({ tipo: "dano", inimigo, valor: dano, bloqueado });
    } else {
      this.emitir({ tipo: "bloqueou", inimigo, valor: 0, bloqueado });
    }
  }

  areaDoChefe(inimigo) {
    const j = this.jogador;
    const dist = Math.hypot(j.x - inimigo.x, j.y - inimigo.y);
    if (dist > 150 || !this.visivel(inimigo, j) || this.agora < j.invulneravelAte) {
      this.emitir({ tipo: "esquiva", inimigo, especial: true });
      return;
    }
    let dano = this.rpg.danoSofrido((TIERS[inimigo.tier]?.damage || 4) + 2);
    if (j.defendendo) dano = Math.max(0, Math.round(dano * 0.3));
    if (j.escudo) { j.escudo = false; dano = 0; }
    if (dano > 0) this.ferirJogador(dano);
    this.emitir({ tipo: "area", inimigo, valor: dano });
  }

  ferirJogador(dano) {
    const j = this.jogador;
    if (this.training) {
      j.hp = Math.max(1, j.hp - dano);
      return;
    }
    const res = this.rpg.takeDamage(dano);
    j.hp = res.hp;
    if (res.dead) this.derrota();
  }

  danoNoInimigo(inimigo, magia = false) {
    const j = this.jogador;
    let dano = Number(this.rpg.damageFor(this.ground.continent)) || 1;
    const trait = MONSTER_TRAITS[inimigo.kind]?.id;
    if (trait === "armor") dano = Math.max(1, dano - 1);
    if (!magia && trait === "dodge" && !j.lente && this.random() < 0.18) {
      j.combo = 0;
      this.emitir({ tipo: "desviou", inimigo });
      return 0;
    }
    if (inimigo.boss) {
      const antes = dano;
      dano = danoDoJogador(this.rpg.duel?.habilidade?.id, inimigo.phase, dano);
      if (dano !== antes) this.emitir({ tipo: "couraca", inimigo });
      if (espelhoDoChefe(this.rpg.duel?.habilidade?.id, inimigo.phase, this.espelhoUsado)) {
        this.espelhoUsado = true;
        if (this.rpg.duel) this.rpg.duel.espelhoUsado = true;
        this.emitir({ tipo: "espelho", inimigo });
        return 0;
      }
    }
    if (this.rpg.familiaCompleta(inimigo.kind)) {
      dano = Math.max(1, Math.round(dano * 1.5));
      this.emitir({ tipo: "familia", inimigo });
    }
    const ritmo = bonusDeRitmo(j.combo);
    if (ritmo) dano += ritmo;
    if (this.rpg.data.sub === "besteiro" && j.combo > 1) dano += 1;
    if (this.rpg.data.sub === "sombra" && j.ataques === 1 && this.rpg.duel?.surprise) dano *= 2;
    if (this.rpg.data.sub === "bruxo" && j.bruxoPendente) {
      dano += 1;
      j.bruxoPendente = false;
    }
    if (j.eco > 0) {
      dano += j.eco;
      j.eco = 0;
    }
    if (j.lente) {
      dano += 1;
      j.lente = false;
    }
    if (this.agora < j.parryAte) {
      dano += 2;
      j.parryAte = -9999;
    }
    if (this.rpg.data.sub === "arcanista" && j.ataques > 0 && j.ataques % 3 === 0) {
      const curado = this.rpg.heal(1);
      if (curado) this.emitir({ tipo: "curaJogador", valor: curado });
    }
    if (this.rpg.data.sub === "bruxo") j.bruxoPendente = true;
    if (this.rpg.data.sub === "veneno") {
      inimigo.venenoAte = this.agora + 2000;
      inimigo.venenoDano = 1;
    }
    dano = Math.max(0, Math.round(dano * 10) / 10);
    if (dano > 0) {
      const manaPorAcerto = Number(this.rpg.activePet()?.passive?.manaHit) || 0;
      if (manaPorAcerto) this.rpg.addMana(manaPorAcerto);
    }
    this.aplicarDano(inimigo, dano);
    return dano;
  }

  // magia tem dano próprio: couraça, casco e família entram, mas o ritmo de
  // golpes corpo a corpo não soma na runa
  danoMagia(inimigo, dano) {
    if (!inimigo || inimigo.morte || dano <= 0) return 0;
    let d = dano;
    const trait = MONSTER_TRAITS[inimigo.kind]?.id;
    if (trait === "armor") d = Math.max(1, d - 1);
    if (inimigo.boss) {
      const antes = d;
      d = danoDoJogador(this.rpg.duel?.habilidade?.id, inimigo.phase, d);
      if (d !== antes) this.emitir({ tipo: "couraca", inimigo });
      if (espelhoDoChefe(this.rpg.duel?.habilidade?.id, inimigo.phase, this.espelhoUsado)) {
        this.espelhoUsado = true;
        if (this.rpg.duel) this.rpg.duel.espelhoUsado = true;
        this.emitir({ tipo: "espelho", inimigo });
        return 0;
      }
    }
    if (this.rpg.familiaCompleta(inimigo.kind)) d = Math.max(1, Math.round(d * 1.5));
    if (this.jogador.eco > 0) {
      d += this.jogador.eco;
      this.jogador.eco = 0;
    }
    this.aplicarDano(inimigo, Math.max(0, Math.round(d * 10) / 10));
    return d;
  }

  aplicarDano(inimigo, dano) {
    if (inimigo.morte || dano <= 0) return;
    inimigo.hp = Math.max(0, Math.round((inimigo.hp - dano) * 10) / 10);
    inimigo.hitAte = this.agora + 140;
    this.emitir({ tipo: "acertou", inimigo, valor: dano });
    if (inimigo === this.principal) this.rpg.duel.monsterHp = inimigo.hp;
    else {
      const parceiro = this.rpg.duel.partners?.[inimigo.indice - 1];
      if (parceiro) parceiro.hp = inimigo.hp;
    }
    if (inimigo.hp <= 0) this.matar(inimigo);
    else this.atualizarFase(inimigo);
  }

  atualizarFase(inimigo) {
    if (!inimigo.boss) return;
    const ratio = inimigo.hp / inimigo.hpMax;
    const fase = ratio <= 0.33 ? 3 : ratio <= 0.66 ? 2 : 1;
    if (fase <= inimigo.phase) return;
    inimigo.phase = fase;
    this.rpg.duel.bossPhase = fase;
    this.emitir({ tipo: "fase", inimigo, fase });
  }

  matar(inimigo) {
    if (inimigo.morte) return;
    inimigo.morte = true;
    inimigo.hp = 0;
    if (inimigo === this.principal) {
      this.rpg.duel.monsterHp = 0;
    } else {
      const parceiro = this.rpg.duel.partners?.[inimigo.indice - 1];
      if (parceiro) parceiro.done = true;
      if (inimigo.monster?.id) this.rpg.data.monsters[inimigo.monster.id] = Date.now();
    }
    if (this.space?.rewardOne) {
      const resultado = this.space.rewardOne(inimigo);
      this.worldResult ||= { xp: 0, loot: [], defeated: 0 };
      this.worldResult.xp += resultado.xp || 0;
      this.worldResult.loot.push(...(resultado.loot || []));
      this.worldResult.defeated++;
      this.rpg.save();
    }
    this.emitir({ tipo: "matou", inimigo });
    if (!this.vivos().length) this.vitoria();
  }

  atualizarVeneno() {
    for (const inimigo of this.inimigos) {
      if (inimigo.morte || !inimigo.venenoAte || this.agora < inimigo.venenoAte) continue;
      inimigo.venenoAte = 0;
      this.aplicarDano(inimigo, inimigo.venenoDano || 1);
    }
  }

  sincronizar() {
    const j = this.jogador;
    j.mana = this.rpg.mana();
    j.manaMax = this.rpg.manaMax();
    j.hpMax = this.rpg.hpMax();
    if (!this.training) j.hp = this.rpg.hp();
  }

  vitoria() {
    if (this.phase !== "combat") return;
    this.phase = "victory";
    const d = this.rpg.duel;
    d.phase = "victory";
    d.monsterHp = 0;
    try {
      d.result = this.space?.rewardOne ? this.worldResult : this.rpg.victory(d);
    } catch (err) {
      d.result = { xp: 0, loot: [], error: err?.message || "erro" };
    }
    this.rpg.save();
    this.emitir({ tipo: "vitoria", resultado: d.result });
  }

  derrota() {
    if (this.phase !== "combat") return;
    this.phase = "defeat";
    const d = this.rpg.duel;
    d.phase = "defeat";
    this.rpg.data.hp = this.rpg.hpMax();
    this.rpg.save();
    // takeDamage já executou o respawn; não teleportar duas vezes.
    this.emitir({ tipo: "derrota" });
  }

  usarMagia(id) {
    if (this.phase !== "combat") return { ok: false, reason: "O combate já acabou." };
    const magia = (this.rpg.spellbarView() || []).find((m) => m.id === id);
    if (!magia) return { ok: false, reason: "Você ainda não aprendeu essa runa." };
    const pronto = this.magias.get(id) || 0;
    if (this.agora < pronto) return { ok: false, reason: "A runa ainda está esfriando." };
    const temCarga = this.rpg.itemCount(id) > 0;
    if (!temCarga && !magia.learned) return { ok: false, reason: "Forje uma carga na forja ou aprenda a runa." };
    if (!temCarga && this.rpg.mana() < magia.mana) return { ok: false, reason: `Falta mana (${this.rpg.mana()}/${magia.mana}).` };
    const alvo = this.inimigoAoAlcance(150);
    if (["runa-faisca", "runa-trovao", "runa-gelo", "runa-punhal"].includes(id) && !alvo) {
      return { ok: false, reason: "Nenhum bicho ao alcance da runa." };
    }
    if (temCarga) {
      this.rpg.data.items[id]--;
      if (this.rpg.data.items[id] <= 0) delete this.rpg.data.items[id];
      this.rpg.data.spells[id] = true;
    } else {
      this.rpg.data.mana = clamp(this.rpg.mana() - magia.mana, 0, this.rpg.manaMax());
    }
    this.magias.set(id, this.agora + COMBATE.magiaRecarga);
    const eventos = [];
    const ferir = (inimigo, dano) => {
      if (!inimigo || (this.space && (Math.hypot(inimigo.x - this.jogador.x, inimigo.y - this.jogador.y) - inimigo.raio > 150 || !this.visivel(this.jogador, inimigo)))) return;
      const antes = inimigo.hp;
      this.danoMagia(inimigo, dano);
      const real = Math.round((antes - inimigo.hp) * 10) / 10;
      if (real) eventos.push({ tipo: "magia", inimigo, valor: real, magia: id });
    };
    if (id === "runa-cura") {
      const curado = this.rpg.heal(12);
      eventos.push({ tipo: "curaJogador", valor: curado });
    } else if (id === "runa-bencao") {
      const curado = this.rpg.heal(8);
      this.jogador.escudo = true;
      eventos.push({ tipo: "curaJogador", valor: curado });
    } else if (id === "runa-espelho") {
      this.jogador.escudo = true;
      eventos.push({ tipo: "escudo" });
    } else if (id === "runa-mente") {
      this.rpg.addMana(6);
      this.jogador.mana = this.rpg.mana();
      eventos.push({ tipo: "mana" });
    } else if (id === "runa-eco") {
      this.jogador.eco += 2;
      eventos.push({ tipo: "eco" });
    } else if (id === "runa-lente") {
      this.jogador.lente = true;
      eventos.push({ tipo: "lente" });
    } else if (id === "runa-faisca") {
      ferir(alvo, 1);
    } else if (id === "runa-trovao") {
      ferir(alvo, 2 + (this.rpg.data.sub === "alquimista" ? 1 : 0));
    } else if (id === "runa-gelo") {
      ferir(alvo, 1);
      if (alvo && !alvo.morte) alvo.atordoadoAte = this.agora + 1800;
    } else if (id === "runa-fogo") {
      for (const inimigo of this.vivos()) ferir(inimigo, 1 + (this.rpg.data.sub === "alquimista" ? 1 : 0));
    } else if (id === "runa-punhal") {
      ferir(alvo, 1);
      this.jogador.eco += 1;
    } else if (id === "runa-corrente") {
      for (const inimigo of this.vivos()) ferir(inimigo, 1);
    }
    this.rpg.save();
    for (const evento of eventos) this.emitir(evento);
    return { ok: true, magia, eventos };
  }

  usarBicho() {
    const res = this.rpg.usePetAbility({ duel: true });
    if (!res.ok) return res;
    if (res.lente) this.jogador.lente = true;
    // a coruja lê a fraqueza: além do golpe certeiro, soma 1 no mesmo acerto
    if (res.effect === "sabedoria") this.jogador.eco += 1;
    if (res.effect === "tagarela") for (const inimigo of this.vivos()) {
      if (!this.space || this.visivel(this.jogador, inimigo) && Math.hypot(inimigo.x - this.jogador.x, inimigo.y - this.jogador.y) - inimigo.raio <= 150) inimigo.atordoadoAte = this.agora + 1700;
    }
    if (res.effect === "aviso") this.jogador.escudo = true;
    if (res.healed) this.emitir({ tipo: "curaJogador", valor: res.healed });
    if (res.mana) this.jogador.mana = this.rpg.mana();
    this.emitir({ tipo: "bicho", res });
    return res;
  }
}

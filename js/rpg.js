// O estado de RPG: vida, perícias, itens, monstros derrotados e o duelo de
// perguntas. Tudo vive no localStorage; o mundo compartilhado continua sendo
// só posição e conversa.
import { STORAGE } from "./config.js";
import { SKILLS, TIERS, ITEMS, QUESTIONS } from "./rpg-data.js";

const RESPAWN_MS = 5 * 60 * 1000;
const BOSS_RESPAWN_MS = 20 * 60 * 1000;
const MAX_SKILL_XP = 50;
const SKILL_STEP = 5;

const now = () => Date.now();
const clamp = (n, lo, hi) => Math.max(lo, Math.min(hi, n));

function emptyData() {
  return {
    hp: null,
    skills: {},
    items: {},
    monsters: {},
    bosses: {},
    levers: {},
  };
}

function readData() {
  try {
    const raw = localStorage.getItem(STORAGE.rpg);
    const obj = raw ? JSON.parse(raw) : null;
    if (!obj || typeof obj !== "object") return emptyData();
    const data = emptyData();
    if (Number.isFinite(obj.hp)) data.hp = obj.hp;
    for (const k of Object.keys(SKILLS)) {
      data.skills[k] = clamp(Number(obj.skills?.[k]) || 0, 0, MAX_SKILL_XP);
    }
    for (const [id, qty] of Object.entries(obj.items || {})) {
      if (ITEMS[id] && Number(qty) > 0) data.items[id] = Math.floor(Number(qty));
    }
    for (const [id, at] of Object.entries(obj.monsters || {})) {
      if (Number.isFinite(at)) data.monsters[id] = at;
    }
    for (const [id, at] of Object.entries(obj.bosses || {})) {
      if (Number.isFinite(at)) data.bosses[id] = at;
    }
    for (const [id, on] of Object.entries(obj.levers || {})) {
      if (on) data.levers[id] = true;
    }
    return data;
  } catch {
    return emptyData();
  }
}

function shuffle(list) {
  const a = list.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const QUESTION_INDEX = new Map();
function indexQuestions() {
  for (const [continent, tiers] of Object.entries(QUESTIONS)) {
    QUESTION_INDEX.set(continent, tiers);
  }
}
indexQuestions();

export class RPG {
  constructor({ gainXp, toast, audio, onRespawn, getLevel } = {}) {
    this.gainXp = gainXp || (() => {});
    this.toast = toast || (() => {});
    this.audio = audio;
    this.onRespawn = onRespawn || (() => {});
    this.getLevel = getLevel || (() => 1);
    this.data = readData();
    this.duel = null;
    this.lastRegen = now();
    this.ensureHp();
    this.save();
  }

  ensureHp() {
    const max = this.hpMax();
    if (!Number.isFinite(this.data.hp)) this.data.hp = max;
    this.data.hp = clamp(this.data.hp, 0, max);
  }

  save() {
    try { localStorage.setItem(STORAGE.rpg, JSON.stringify(this.data)); } catch { /* sem storage */ }
  }

  relics() {
    return Object.entries(this.data.items)
      .filter(([id, qty]) => qty > 0 && ITEMS[id]?.relic)
      .length;
  }

  hpMax() {
    return 30 + (Math.max(1, this.getLevel()) - 1) * 4 + this.relics() * 5;
  }

  hp() {
    this.ensureHp();
    return this.data.hp;
  }

  heal(n) {
    const max = this.hpMax();
    const before = this.hp();
    this.data.hp = clamp(before + n, 0, max);
    this.save();
    return this.data.hp - before;
  }

  tick(ts = now()) {
    if (this.duel) return;
    if (ts - this.lastRegen < 9000) return;
    this.lastRegen = ts;
    if (this.hp() < this.hpMax()) {
      this.data.hp = Math.min(this.hpMax(), this.hp() + 1);
      this.save();
    }
  }

  // ---------- perícias ----------
  skillXp(id) {
    return clamp(Number(this.data.skills[id]) || 0, 0, MAX_SKILL_XP);
  }

  skillLevel(id) {
    return Math.floor(this.skillXp(id) / SKILL_STEP);
  }

  skillProgress(id) {
    const xp = this.skillXp(id);
    return {
      xp,
      max: MAX_SKILL_XP,
      level: Math.floor(xp / SKILL_STEP),
      next: Math.min(SKILL_STEP, MAX_SKILL_XP - xp),
      pct: Math.round((xp / MAX_SKILL_XP) * 100),
    };
  }

  addSkillXp(id, n) {
    if (!SKILLS[id] || n <= 0) return;
    this.data.skills[id] = clamp(this.skillXp(id) + n, 0, MAX_SKILL_XP);
  }

  damageFor(id) {
    const skill = this.skillLevel(id);
    if (skill >= 10) return 3;
    if (skill >= 6) return 2;
    return 1;
  }

  // ---------- itens ----------
  addItem(id, qty = 1) {
    if (!ITEMS[id] || qty <= 0) return;
    this.data.items[id] = (this.data.items[id] || 0) + Math.floor(qty);
    this.save();
  }

  itemCount(id) {
    return this.data.items[id] || 0;
  }

  useItem(id) {
    if (id !== "pocao") return { ok: false, reason: "Este item não se usa agora." };
    if (this.itemCount(id) <= 0) return { ok: false, reason: "Você não tem essa poção." };
    if (this.hp() >= this.hpMax()) return { ok: false, reason: "Sua vida já está cheia." };
    this.data.items[id]--;
    if (this.data.items[id] <= 0) delete this.data.items[id];
    const healed = this.heal(ITEMS[id].heal || 15);
    this.save();
    return { ok: true, healed };
  }

  inventoryList() {
    return Object.entries(this.data.items)
      .filter(([id, qty]) => ITEMS[id] && qty > 0)
      .map(([id, qty]) => ({ id, qty, ...ITEMS[id] }))
      .sort((a, b) => a.name.localeCompare(b.name, "pt-BR"));
  }

  // ---------- monstros ----------
  monsterAlive(id) {
    const at = this.data.monsters[id];
    return !Number.isFinite(at) || now() - at > RESPAWN_MS;
  }

  monsterRespawnIn(id) {
    const at = this.data.monsters[id];
    if (!Number.isFinite(at)) return 0;
    return Math.max(0, Math.ceil((RESPAWN_MS - (now() - at)) / 1000));
  }

  allMonstersDown(ground) {
    return ground.monsters.every((m) => !this.monsterAlive(m.id));
  }

  leverPulled(groundId) {
    return !!this.data.levers[groundId];
  }

  leverReady(ground) {
    return !this.leverPulled(ground.id) && this.allMonstersDown(ground);
  }

  pullLever(ground) {
    if (this.leverPulled(ground.id)) {
      return { ok: false, reason: "A passagem já está aberta. O chefe espera lá dentro." };
    }
    if (!this.allMonstersDown(ground)) {
      const left = ground.monsters.filter((m) => this.monsterAlive(m.id)).length;
      return { ok: false, reason: `O selo ainda resiste. Faltam ${left} guardião(ões).` };
    }
    this.data.levers[ground.id] = true;
    this.save();
    return { ok: true, ground };
  }

  bossAlive(ground) {
    if (!this.leverPulled(ground.id)) return false;
    const at = this.data.bosses[ground.id];
    return !Number.isFinite(at) || now() - at > BOSS_RESPAWN_MS;
  }

  bossRespawnIn(groundId) {
    const at = this.data.bosses[groundId];
    if (!Number.isFinite(at)) return 0;
    return Math.max(0, Math.ceil((BOSS_RESPAWN_MS - (now() - at)) / 1000));
  }

  // ---------- duelo ----------
  prepQuestion(continent, tier) {
    const bank = QUESTION_INDEX.get(continent)?.[tier] || [];
    if (!bank.length) return null;
    const q = bank[Math.floor(Math.random() * bank.length)];
    const options = q.options.map((text, i) => ({ text, ok: i === q.a }));
    const mixed = shuffle(options);
    return {
      q: q.q,
      options: mixed.map((o) => o.text),
      answer: mixed.findIndex((o) => o.ok),
      why: q.why,
    };
  }

  buildDeck(continent, tiers) {
    const deck = [];
    for (const tier of tiers) {
      const bank = QUESTION_INDEX.get(continent)?.[tier] || [];
      for (const q of bank) {
        const options = q.options.map((text, i) => ({ text, ok: i === q.a }));
        const mixed = shuffle(options);
        deck.push({
          q: q.q,
          options: mixed.map((o) => o.text),
          answer: mixed.findIndex((o) => o.ok),
          why: q.why,
          tier,
        });
      }
    }
    return shuffle(deck);
  }

  startDuel(monster, ground, boss = false) {
    if (boss ? !this.bossAlive(ground) : !this.monsterAlive(monster.id)) {
      return { ok: false, reason: "Este monstro não está mais aqui." };
    }
    const tiers = boss ? [1, 2, 3] : [monster.tier];
    const deck = this.buildDeck(ground.continent, tiers);
    if (!deck.length) return { ok: false, reason: "As perguntas deste continente ainda não foram escritas." };
    const hp = boss ? TIERS[4].hp : TIERS[monster.tier].hp;
    this.duel = {
      monster,
      ground,
      boss,
      tier: boss ? 4 : monster.tier,
      deck,
      deckIndex: 0,
      question: deck[0],
      monsterHp: hp,
      monsterHpMax: hp,
      phase: "question",
      feedback: null,
      result: null,
    };
    return { ok: true, duel: this.duel };
  }

  currentQuestion() {
    return this.duel?.question || null;
  }

  answer(index) {
    const d = this.duel;
    if (!d || d.phase !== "question") return { ok: false };
    const correct = Number(index) === d.question.answer;
    if (correct) {
      this.addSkillXp(d.ground.continent, 1);
      d.monsterHp = Math.max(0, d.monsterHp - this.damageFor(d.ground.continent));
      d.feedback = { correct: true, why: d.question.why, damage: 0 };
      if (d.monsterHp <= 0) {
        d.phase = "victory";
        d.result = this.victory(d);
        this.save();
      } else {
        d.phase = "feedback";
        this.save();
      }
    } else {
      const damage = TIERS[d.tier].damage;
      this.data.hp = Math.max(0, this.hp() - damage);
      d.feedback = { correct: false, why: d.question.why, damage };
      if (this.data.hp <= 0) {
        this.data.hp = this.hpMax();
        d.phase = "defeat";
        this.save();
        this.onRespawn?.();
      } else {
        d.phase = "feedback";
        this.save();
      }
    }
    return { ok: true, correct, phase: d.phase, feedback: d.feedback, duel: d };
  }

  victory(d) {
    const ground = d.ground;
    const monster = d.monster;
    const tier = d.boss ? 4 : monster.tier;
    const itemId = ground.loot[Math.min(2, Math.max(0, (d.boss ? 3 : tier) - 1))] || ground.loot[0];
    const loot = [{ id: itemId, qty: 1 }];
    if (d.boss) loot.push({ id: "pocao", qty: 1 });
    else if (Math.random() < 0.28) loot.push({ id: "pocao", qty: 1 });
    for (const l of loot) this.addItem(l.id, l.qty);
    this.addSkillXp(ground.continent, 2);
    const xp = TIERS[tier].xp;
    this.gainXp(xp);
    if (d.boss) {
      this.data.bosses[ground.id] = now();
      this.data.levers[ground.id] = true;
    } else {
      this.data.monsters[monster.id] = now();
    }
    return { xp, loot, item: ITEMS[itemId], boss: d.boss };
  }

  next() {
    const d = this.duel;
    if (!d) return null;
    if (d.phase === "victory" || d.phase === "defeat") {
      const result = { phase: d.phase, result: d.result, boss: d.boss, monster: d.monster };
      this.duel = null;
      this.save();
      return result;
    }
    if (d.phase !== "feedback") return null;
    d.feedback = null;
    d.phase = "question";
    d.deckIndex++;
    if (d.deckIndex >= d.deck.length) {
      d.deck = shuffle(d.deck);
      d.deckIndex = 0;
      if (d.deck.length > 1 && d.question && d.deck[0].q === d.question.q) {
        [d.deck[0], d.deck[1]] = [d.deck[1], d.deck[0]];
      }
    }
    d.question = d.deck[d.deckIndex];
    return { phase: "question", duel: d };
  }

  flee() {
    if (!this.duel) return;
    this.duel = null;
    this.save();
  }

  // ---------- leitura para a ficha ----------
  skillsView() {
    return Object.entries(SKILLS).map(([id, s]) => ({
      id,
      ...s,
      ...this.skillProgress(id),
      damage: this.damageFor(id),
    }));
  }
}

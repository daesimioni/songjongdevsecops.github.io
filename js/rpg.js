// O estado de RPG: vida, perícias, itens, monstros derrotados e o duelo de
// perguntas. Tudo vive no localStorage; o mundo compartilhado continua sendo
// só posição e conversa.
import { backupCorrupt } from "./storage.js";
import { STORAGE } from "./config.js";
import { SKILLS, TIERS, ITEMS, QUESTIONS, RECIPES, ENCHANTS, DEEP_QUESTIONS } from "./rpg-data.js";
import { BOND_MAX, MANA_MS, PETS, MOUNTS, petById, mountById } from "./pets.js";

const RESPAWN_MS = 5 * 60 * 1000;
const BOSS_RESPAWN_MS = 20 * 60 * 1000;
const MAX_SKILL_XP = 50;
const SKILL_STEP = 5;
const BUFF_NAMES = { speed: "passos rápidos", damage: "dano extra", maxhp: "vida extra" };
const PET_ABILITY_IDS = new Set(Object.values(PETS).map((pet) => pet.ability.id));

// Palavras que aproximam a pergunta do tema da sala. O tema vem do mapa; a
// pergunta não precisa citar a palavra exata para puxar assunto.
const THEME_WORDS = {
  circuitos: ["circuito", "fio", "transistor", "porta", "sinal"],
  lógica: ["lógica", "booleano", "proposição", "porta", "verdade"],
  memória: ["memória", "cache", "registrador", "ram", "guardar"],
  tempo: ["clock", "frequência", "ciclo", "tempo", "atraso"],
  algoritmos: ["algoritmo", "complexidade", "ordena", "busca", "passo", "escalonador", "processo", "núcleo"],
  dados: ["dado", "tabela", "amostra", "estatística", "probabilidade"],
  primos: ["primo", "divisível", "fator", "divisão", "número"],
  geometria: ["triângulo", "ângulo", "geometria", "forma", "distância"],
  limites: ["limite", "derivada", "integral", "contínu", "tende"],
  infinito: ["infinito", "hilbert", "cardinal", "cantor", "enumerável"],
  axiomas: ["axioma", "teorema", "prova", "lema", "demonstra"],
  fractais: ["fractal", "autossemelhante", "iteração", "dimensão", "recurs"],
  pêndulo: ["pêndulo", "oscila", "período", "gravidade", "amplitude"],
  ondas: ["onda", "frequência", "comprimento", "ressonância", "som"],
  calor: ["calor", "temperatura", "entropia", "energia", "térmic"],
  luz: ["luz", "fóton", "prisma", "cor", "óptica"],
  órbita: ["órbita", "gravidade", "satélite", "kepler", "escape"],
  gravidade: ["gravidade", "massa", "queda", "newton", "peso"],
  elementos: ["elemento", "tabela", "átomo", "próton", "elétron"],
  ácidos: ["ácido", "ph", "base", "reação", "neutraliza"],
  energia: ["energia", "ativação", "reação", "calor", "entalpia"],
  equilíbrio: ["equilíbrio", "concentração", "reação", "tampão", "desloca"],
  cristais: ["cristal", "rede", "sal", "estrutura", "sólido"],
  ligações: ["ligação", "molécula", "átomo", "valência", "química"],
  ritmo: ["ritmo", "compasso", "tempo", "batida", "pulso"],
  harmonia: ["harmonia", "acorde", "intervalo", "tom", "consonância"],
  silêncio: ["silêncio", "pausa", "som", "ruído", "repouso"],
  timbre: ["timbre", "harmônico", "instrumento", "som", "voz"],
  razões: ["razão", "oitava", "frequência", "proporção", "quinta"],
  escalas: ["escala", "tom", "semitom", "modo", "afinação"],
  pesos: ["peso", "sinapse", "treino", "rede", "neurônio"],
  gradiente: ["gradiente", "descida", "erro", "aprendizado", "derivada"],
  atenção: ["atenção", "token", "contexto", "transformer", "consulta"],
  vetores: ["vetor", "embedding", "dimensão", "espaço", "distância"],
  tokens: ["token", "texto", "vocabulário", "modelo", "palavra"],
};

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
    enchants: {},
    buffs: {},
    pets: {},
    petActive: null,
    petCd: {},
    mana: null,
    manaAt: 0,
    mounts: {},
    mountActive: null,
    equipped: {},
    seen: {},
    plots: {},
    plotGift: {},
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
    for (const enchant of ENCHANTS) {
      if (obj.enchants?.[enchant.id]) data.enchants[enchant.id] = true;
    }
    for (const [id, at] of Object.entries(obj.buffs || {})) {
      if (BUFF_NAMES[id] && Number.isFinite(at) && at > now()) data.buffs[id] = at;
    }
    // bichos: a versão antiga só tinha o gato (obj.pet.bond)
    const petsRaw = obj.pets && typeof obj.pets === "object" ? obj.pets : null;
    if (petsRaw) {
      for (const id of Object.keys(PETS)) {
        const bond = clamp(Number(petsRaw[id]?.bond) || 0, 0, BOND_MAX);
        if (bond > 0) data.pets[id] = { bond };
      }
    } else {
      const bond = clamp(Number(obj.pet?.bond) || 0, 0, BOND_MAX);
      if (bond > 0) data.pets.gato = { bond };
    }
    if (typeof obj.petActive === "string" && data.pets[obj.petActive]?.bond >= BOND_MAX) {
      data.petActive = obj.petActive;
    } else {
      const first = Object.keys(data.pets).find((id) => data.pets[id].bond >= BOND_MAX);
      data.petActive = first || null;
    }
    for (const [id, at] of Object.entries(obj.petCd || {})) {
      if (PET_ABILITY_IDS.has(id) && Number.isFinite(at) && at > 0) data.petCd[id] = at;
    }
    if (Number.isFinite(obj.mana)) data.mana = clamp(Number(obj.mana), 0, 30);
    if (Number.isFinite(obj.manaAt)) data.manaAt = Number(obj.manaAt);
    for (const id of Object.keys(MOUNTS)) {
      if (obj.mounts?.[id]) data.mounts[id] = true;
    }
    if (typeof obj.mountActive === "string" && data.mounts[obj.mountActive]) data.mountActive = obj.mountActive;
    for (const [slot, id] of Object.entries(obj.equipped || {})) {
      if (ITEMS[id]?.slot === slot && Number(data.items[id]) > 0) data.equipped[slot] = id;
    }
    for (const [kind, entry] of Object.entries(obj.seen || {})) {
      if (!/^[a-z]{3,10}$/.test(kind) || !entry || typeof entry !== "object") continue;
      const count = clamp(Number(entry.count) || 0, 0, 9999);
      if (!count) continue;
      data.seen[kind] = {
        count,
        name: String(entry.name || "").replace(/[<>\u0000-\u001f]/g, "").slice(0, 24) || kind,
        tier: clamp(Number(entry.tier) || 1, 1, 4),
      };
    }
    for (const [key, plot] of Object.entries(obj.plots || {})) {
      if (typeof key !== "string" || key.length > 40 || !plot || typeof plot !== "object") continue;
      if (!plot.planted) continue;
      const readyAt = Number(plot.readyAt);
      if (!Number.isFinite(readyAt)) continue;
      data.plots[key] = { planted: true, readyAt };
    }
    for (const [key, used] of Object.entries(obj.plotGift || {})) {
      if (typeof key === "string" && key.length <= 40 && used) data.plotGift[key] = true;
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
  for (const [continent, q] of Object.entries(DEEP_QUESTIONS)) {
    const tiers = QUESTION_INDEX.get(continent);
    if (tiers?.[3]) tiers[3].push(q);
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
    backupCorrupt(STORAGE.rpg);
    this.data = readData();
    this.duel = null;
    this.cave = false;
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

  noteMonster(monster) {
    if (!monster?.kind) return;
    const kind = String(monster.kind).toLowerCase().replace(/[^a-z]/g, "").slice(0, 10);
    if (!kind) return;
    const entry = this.data.seen[kind] || { count: 0, name: monster.name || kind, tier: monster.tier || 1 };
    entry.count = Math.min(9999, entry.count + 1);
    entry.name = String(monster.name || entry.name).replace(/[<>\u0000-\u001f]/g, "").slice(0, 24);
    entry.tier = clamp(Number(monster.tier) || entry.tier || 1, 1, 4);
    this.data.seen[kind] = entry;
    this.save();
  }

  seenView() {
    const labels = { slime: "gosma", eye: "olho", golem: "golem", bat: "morcego", spider: "aranha", wisp: "fogo-fátuo", scorpion: "escorpião", boss: "chefe" };
    return Object.entries(this.data.seen)
      .map(([kind, entry]) => ({ kind, label: labels[kind] || kind, ...entry }))
      .sort((a, b) => b.tier - a.tier || b.count - a.count || a.kind.localeCompare(b.kind));
  }

  equipmentBonus() {
    let hp = 0, damage = 0;
    for (const [slot, id] of Object.entries(this.data.equipped || {})) {
      const item = ITEMS[id];
      if (!item || item.slot !== slot || this.itemCount(id) <= 0) continue;
      hp += Number(item.hp) || 0;
      damage += Number(item.damage) || 0;
    }
    return { hp, damage };
  }

  priceFor(id) {
    const item = ITEMS[id];
    if (!item?.slot) return null;
    const table = {
      weapon: { ferro: 3, veio: 2 },
      helmet: { ferro: 2, veio: 1 },
      armor: { ferro: 2, erva: 2 },
      legs: { veio: 2, erva: 2 },
      boots: { madeira: 2, veio: 1 },
      shield: { ferro: 3, veio: 1 },
      ring: { veio: 3, erva: 2 },
      necklace: { erva: 3, veio: 2 },
    };
    return table[item.slot] ? { ...table[item.slot] } : null;
  }

  buy(id) {
    const item = ITEMS[id];
    const price = this.priceFor(id);
    if (!price) return { ok: false, reason: "A mestra não vende essa peça." };
    if (item.slot && this.itemCount(id) > 0) return { ok: false, reason: "Você já tem essa peça." };
    for (const [mat, qty] of Object.entries(price)) {
      if (this.itemCount(mat) < qty) return { ok: false, reason: `Falta ${ITEMS[mat]?.name || mat}.` };
    }
    for (const [mat, qty] of Object.entries(price)) {
      this.data.items[mat] -= qty;
      if (this.data.items[mat] <= 0) delete this.data.items[mat];
    }
    this.addItem(id, 1);
    this.save();
    return { ok: true, item, price };
  }

  equip(id) {
    const item = ITEMS[id];
    if (!item?.slot) return { ok: false, reason: "Isso não é equipamento." };
    if (this.itemCount(id) <= 0) return { ok: false, reason: "Você não tem essa peça." };
    this.data.equipped[item.slot] = id;
    this.save();
    return { ok: true, slot: item.slot, item };
  }

  unequip(slot) {
    if (!this.data.equipped?.[slot]) return { ok: false, reason: "Esse espaço já está vazio." };
    delete this.data.equipped[slot];
    this.save();
    return { ok: true, slot };
  }

  equippedView() {
    const names = { weapon: "arma", helmet: "elmo", armor: "armadura", legs: "pernas", boots: "botas", shield: "escudo", ring: "anel", necklace: "colar" };
    return Object.entries(names).map(([slot, name]) => {
      const id = this.data.equipped?.[slot];
      return { slot, name, item: id && this.itemCount(id) > 0 ? { id, ...ITEMS[id] } : null };
    });
  }

  hpMax() {
    let max = 30 + (Math.max(1, this.getLevel()) - 1) * 4 + this.relics() * 5 + this.equipmentBonus().hp;
    if (this.data.enchants.vigor) max += 10;
    if (this.buffActive("maxhp")) max += 5;
    max += Number(this.activePet()?.passive.hp) || 0;
    if (!this.cave) max += Number(MOUNTS[this.data.mountActive]?.hp) || 0;
    return max;
  }

  buffActive(id) {
    return Number.isFinite(this.data.buffs[id]) && this.data.buffs[id] > now();
  }

  speedMult() {
    return this.buffActive("speed") ? 1.3 : 1;
  }

  lightBonus() {
    return (this.data.enchants.luz ? 3 : 0)
      + (Number(this.activePet()?.passive.sight) || 0)
      + (this.cave ? 0 : Number(MOUNTS[this.data.mountActive]?.sight) || 0);
  }

  buffView() {
    return Object.entries(this.data.buffs)
      .filter(([id, at]) => BUFF_NAMES[id] && at > now())
      .map(([id, at]) => ({ id, name: BUFF_NAMES[id], left: Math.ceil((at - now()) / 1000) }));
  }

  // ---------- companhia: bichos e montarias ----------
  setCave(on) {
    this.cave = !!on;
  }

  activePet() {
    const id = this.data.petActive;
    if (!id || !PETS[id]) return null;
    if ((this.data.pets[id]?.bond || 0) < BOND_MAX) return null;
    return { id, ...PETS[id] };
  }

  petTamed(id = null) {
    if (id) return (this.data.pets[id]?.bond || 0) >= BOND_MAX;
    return !!this.activePet();
  }

  petsView() {
    return Object.entries(PETS).map(([id, pet]) => {
      const bond = clamp(Number(this.data.pets[id]?.bond) || 0, 0, BOND_MAX);
      return {
        id,
        name: pet.name,
        continent: pet.continent,
        where: pet.where,
        bond,
        max: BOND_MAX,
        tamed: bond >= BOND_MAX,
        active: this.data.petActive === id,
        passive: pet.passive,
        ability: pet.ability,
        cdLeft: this.petCdLeft(id),
        mana: this.mana(),
      };
    });
  }

  feedPet(id) {
    const pet = petById(id);
    if (!pet) return { ok: false, reason: "Este bicho não vive aqui." };
    if (this.petTamed(id)) return { ok: false, reason: `O ${pet.name} já segue você.` };
    if (this.itemCount("racao") <= 0) return { ok: false, reason: "Falta ração de caverna." };
    this.data.items.racao--;
    if (this.data.items.racao <= 0) delete this.data.items.racao;
    const entry = this.data.pets[id] || { bond: 0 };
    entry.bond = clamp(entry.bond + 1, 0, BOND_MAX);
    this.data.pets[id] = entry;
    if (entry.bond >= BOND_MAX && !this.activePet()) this.data.petActive = id;
    this.save();
    return { ok: true, bond: entry.bond, tamed: entry.bond >= BOND_MAX, name: pet.name };
  }

  setPet(id) {
    if (!this.petTamed(id)) return { ok: false, reason: "Esse bicho ainda não confia em você." };
    this.data.petActive = id;
    this.save();
    return { ok: true };
  }

  petCdLeft(id = this.data.petActive) {
    const pet = petById(id);
    if (!pet) return 0;
    return Math.max(0, (Number(this.data.petCd?.[pet.ability.id]) || 0) - now());
  }

  manaMax() {
    return 10 + (Number(this.activePet()?.passive.manaMax) || 0);
  }

  mana() {
    if (this.data.mana == null) {
      this.data.mana = this.manaMax();
      this.data.manaAt = now();
    }
    return clamp(Math.round(Number(this.data.mana)), 0, this.manaMax());
  }

  addMana(n) {
    if (!n) return;
    this.data.mana = clamp(this.mana() + n, 0, this.manaMax());
    this.save();
  }

  // mana volta com o tempo; chamado pelo laço do jogo e pelo duelo
  pulse() {
    if (this.data.mana == null) {
      this.data.mana = this.manaMax();
      this.data.manaAt = now();
      this.save();
      return;
    }
    const max = this.manaMax();
    const at = Number(this.data.manaAt) || now();
    const gain = Math.floor((now() - at) / MANA_MS);
    if (gain <= 0) return;
    this.data.mana = clamp(Number(this.data.mana) + gain, 0, max);
    this.data.manaAt = at + gain * MANA_MS;
    this.save();
  }

  usePetAbility({ duel = false } = {}) {
    const pet = this.activePet();
    if (!pet) return { ok: false, reason: "Nenhum bicho tamed está ativo." };
    const ab = pet.ability;
    const left = this.petCdLeft(pet.id);
    if (left > 0) return { ok: false, cooldown: left, reason: `${pet.name} ainda está descansando (${Math.ceil(left / 1000)}s).` };
    const inDuel = duel && this.duel && this.duel.phase === "question";
    if (["faro", "sabedoria", "aviso"].includes(ab.id) && !inDuel) {
      return { ok: false, reason: "Essa habilidade só funciona na pergunta de um duelo." };
    }
    this.pulse();
    if (ab.id !== "mana" && this.mana() < ab.mana) {
      return { ok: false, reason: `Falta mana (${this.mana()}/${ab.mana}).` };
    }
    const out = { ok: true, pet: { id: pet.id, name: pet.name }, ability: ab, effect: ab.id };
    if (ab.id === "faro") {
      const wrong = this.duel.question.options.map((_, i) => i).filter((i) => i !== this.duel.question.answer);
      if (!wrong.length) return { ok: false, reason: "Esta pergunta não tem alternativa para riscar." };
      out.spark = wrong[Math.floor(Math.random() * wrong.length)];
    }
    if (ab.id === "sabedoria") out.answer = this.duel.question.answer;
    if (ab.id === "aviso") {
      out.theme = this.duel.question.theme || this.duel.ground.theme || "";
      out.tier = this.duel.boss ? 4 : this.duel.monster.tier || 1;
      out.monster = this.duel.monster.name || "o monstro";
    }
    if (ab.id === "cura") out.healed = this.heal(20);
    if (ab.id === "mana") {
      out.mana = 3;
      this.data.mana = clamp(this.mana() + 3, 0, this.manaMax());
    }
    if (ab.id === "ritmo") {
      this.data.buffs.damage = now() + 120000;
      out.buff = { id: "damage", name: BUFF_NAMES.damage, ms: 120000 };
    }
    if (ab.id !== "mana") this.data.mana = clamp(this.mana() - ab.mana, 0, this.manaMax());
    this.data.petCd[ab.id] = now() + ab.cd;
    this.save();
    return out;
  }

  mountsView() {
    return Object.entries(MOUNTS).map(([id, mount]) => ({
      id,
      name: mount.name,
      speed: mount.speed,
      desc: mount.desc,
      price: mount.price,
      owned: !!this.data.mounts[id],
      active: this.data.mountActive === id,
      can: this.canBuyMount(id),
    }));
  }

  canBuyMount(id) {
    const mount = mountById(id);
    if (!mount || this.data.mounts[id]) return false;
    return Object.entries(mount.price).every(([item, qty]) => this.itemCount(item) >= qty);
  }

  buyMount(id) {
    const mount = mountById(id);
    if (!mount) return { ok: false, reason: "Esta montaria não existe." };
    if (this.data.mounts[id]) return { ok: false, reason: "Você já tem esta montaria." };
    if (!this.canBuyMount(id)) return { ok: false, reason: "Falta material para a montaria." };
    for (const [item, qty] of Object.entries(mount.price)) {
      this.data.items[item] -= qty;
      if (this.data.items[item] <= 0) delete this.data.items[item];
    }
    this.data.mounts[id] = true;
    if (!this.data.mountActive) this.data.mountActive = id;
    this.save();
    return { ok: true, name: mount.name };
  }

  setMount(id) {
    if (id && !this.data.mounts[id]) return { ok: false, reason: "Você ainda não tem essa montaria." };
    this.data.mountActive = id || null;
    this.save();
    return { ok: true };
  }

  mountSpeedMult() {
    if (this.cave) return 1;
    return Number(MOUNTS[this.data.mountActive]?.speed) || 1;
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

  takeDamage(n) {
    const before = this.hp();
    const lost = Math.min(before, Math.max(0, Math.floor(n)));
    this.data.hp = before - lost;
    const dead = this.data.hp <= 0;
    if (dead) this.data.hp = this.hpMax();
    this.save();
    if (dead) this.onRespawn?.();
    return { lost, dead, hp: this.data.hp, max: this.hpMax() };
  }

  fleeRisk(monster) {
    if (!monster) return 0;
    const tier = monster.boss ? 4 : clamp(Number(monster.tier) || 1, 1, 3);
    const base = [0, 0.2, 0.38, 0.55, 0.72][tier] || 0.5;
    const speed = this.buffActive("speed") ? 0.1 : 0;
    return clamp(base - speed, 0.05, 0.9);
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
    let damage = skill >= 10 ? 3 : skill >= 6 ? 2 : 1;
    if (this.data.enchants.furor) damage++;
    if (this.buffActive("damage")) damage++;
    damage += Number(this.activePet()?.passive.damage) || 0;
    return damage + this.equipmentBonus().damage;
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
    const item = ITEMS[id];
    const rune = id.startsWith("runa-");
    if (!item || !(rune || ["pocao", "tocha", "bomba", "caldo", "cafe", "assado", "doce"].includes(id))) {
      return { ok: false, reason: "Este item não se usa agora." };
    }
    if (this.itemCount(id) <= 0) return { ok: false, reason: `Você não tem ${item.name}.` };
    if (id === "tocha") {
      this.data.items[id]--;
      if (this.data.items[id] <= 0) delete this.data.items[id];
      this.save();
      return { ok: true, light: 120000, name: item.name };
    }
    if (id === "bomba") {
      this.data.items[id]--;
      if (this.data.items[id] <= 0) delete this.data.items[id];
      this.save();
      return { ok: true, bomb: true, name: item.name };
    }
    if (rune) {
      const d = this.duel;
      if (!d || d.phase !== "question") return { ok: false, reason: "A runa só funciona na pergunta de um duelo." };
      if (id === "runa-espelho" && d.shield) return { ok: false, reason: "O espelho já está armado." };
      this.data.items[id]--;
      if (this.data.items[id] <= 0) delete this.data.items[id];
      if (id === "runa-faisca") {
        this.save();
        return { ok: true, spark: true, name: item.name };
      }
      if (id === "runa-cura") {
        const healed = this.heal(12);
        this.save();
        return { ok: true, healed, name: item.name };
      }
      if (id === "runa-espelho") {
        d.shield = true;
        this.save();
        return { ok: true, shield: true, name: item.name };
      }
      if (id === "runa-gelo") {
        d.feedback = { correct: true, spell: item.name, damage: 0, why: "O gelo segurou o tempo: a pergunta passou sem resposta e sem dano." };
        d.phase = "feedback";
        this.save();
        return { ok: true, name: item.name };
      }
      // trovão acerta o da frente; fogo passa por todos, matilha incluída
      const dmg = id === "runa-fogo" ? 1 : 2;
      d.monsterHp = Math.max(0, d.monsterHp - dmg);
      if (id === "runa-fogo") {
        for (const p of d.partners || []) {
          if (p.done) continue;
          p.hp = Math.max(0, p.hp - dmg);
          if (p.hp <= 0) {
            p.done = true;
            this.data.monsters[p.monster.id] = now();
          }
        }
      }
      d.feedback = {
        correct: true,
        spell: item.name,
        damage: 0,
        why: id === "runa-fogo" ? "O fogo passou por todos os bichos da tela." : "O trovão bateu no monstro da frente.",
      };
      if (d.monsterHp <= 0) {
        d.phase = "victory";
        d.result = this.victory(d);
      } else {
        d.phase = "feedback";
      }
      this.save();
      return { ok: true, name: item.name, victory: d.phase === "victory" };
    }
    // comida com efeito pode ser usada de vida cheia: o buff ainda vale
    if (!item.buff && this.hp() >= this.hpMax()) return { ok: false, reason: "Sua vida já está cheia." };
    this.data.items[id]--;
    if (this.data.items[id] <= 0) delete this.data.items[id];
    const healed = this.heal(item.heal || 0);
    if (item.buff) this.data.buffs[item.buff.id] = now() + item.buff.ms;
    this.save();
    return {
      ok: true,
      healed,
      buff: item.buff ? { id: item.buff.id, name: BUFF_NAMES[item.buff.id] || item.buff.id, ms: item.buff.ms } : null,
    };
  }

  enchantsView() {
    return ENCHANTS.map((e) => {
      const owned = !!this.data.enchants[e.id];
      let can = true;
      for (const [id, need] of Object.entries(e.need)) {
        if (this.itemCount(id) < need) can = false;
      }
      return { ...e, owned, can };
    });
  }

  enchant(id) {
    const enchant = ENCHANTS.find((e) => e.id === id);
    if (!enchant) return { ok: false, reason: "Este encanto não existe." };
    if (this.data.enchants[id]) return { ok: false, reason: "Este encanto já está na sua lanterna." };
    for (const [itemId, need] of Object.entries(enchant.need)) {
      if (this.itemCount(itemId) < need) {
        return { ok: false, reason: `Falta ${ITEMS[itemId]?.name || itemId}.` };
      }
    }
    for (const [itemId, need] of Object.entries(enchant.need)) {
      this.data.items[itemId] -= need;
      if (this.data.items[itemId] <= 0) delete this.data.items[itemId];
    }
    this.data.enchants[id] = true;
    this.save();
    return { ok: true, enchant };
  }

  craft(recipeId) {
    const recipe = RECIPES.find((r) => r.id === recipeId);
    if (!recipe) return { ok: false, reason: "Esta receita não existe." };
    for (const [id, need] of Object.entries(recipe.need)) {
      if (this.itemCount(id) < need) {
        return { ok: false, reason: `Falta ${ITEMS[id]?.name || id} (${this.itemCount(id)}/${need}).` };
      }
    }
    for (const [id, need] of Object.entries(recipe.need)) {
      this.data.items[id] -= need;
      if (this.data.items[id] <= 0) delete this.data.items[id];
    }
    this.addItem(recipe.out, recipe.qty);
    return { ok: true, recipe, item: ITEMS[recipe.out] };
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
    // nas cavernas não existe alavanca: o chefe está sempre no fundo, só some
    // enquanto o corpo esfria.
    if (!ground.dungeon && !this.leverPulled(ground.id)) return false;
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

  // As salas têm tema. A pergunta que combina com o tema vai para a frente do
  // baralho; o resto continua no sorteio. Sem tema, é sorteio puro.
  themeScore(text, hint) {
    if (!hint) return 0;
    const body = String(text).toLowerCase();
    const theme = String(hint).toLowerCase();
    const words = [theme, ...(THEME_WORDS[theme] || [])];
    let score = 0;
    for (const w of words) if (w.length >= 3 && body.includes(w)) score += 3;
    return score;
  }

  buildDeck(continent, tiers, hint = "") {
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
          score: this.themeScore(`${q.q} ${q.why}`, hint),
        });
      }
    }
    return shuffle(deck).sort((a, b) => b.score - a.score);
  }

  startDuel(monster, ground, boss = false, partner = null) {
    if (boss ? !this.bossAlive(ground) : !this.monsterAlive(monster.id)) {
      return { ok: false, reason: "Este monstro não está mais aqui." };
    }
    const extras = (Array.isArray(partner) ? partner : partner ? [partner] : [])
      .filter((p) => p && p.id !== monster.id && this.monsterAlive(p.id))
      .slice(0, 2);
    const tiers = boss ? [2, 3] : [monster.tier];
    const deck = this.buildDeck(ground.continent, tiers, monster?.theme || ground.theme);
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
      shield: false,
      partners: [],
      get partner() { return this.partners[0] || null; },
      phase: "question",
      feedback: null,
      result: null,
    };
    for (const p of extras) {
      const ptier = clamp(Number(p.tier) || 1, 1, 3);
      const pdeck = this.buildDeck(ground.continent, [ptier], p.theme || ground.theme);
      if (!pdeck.length) continue;
      this.duel.partners.push({
        monster: p,
        tier: ptier,
        deck: pdeck,
        deckIndex: 0,
        question: pdeck[0],
        hp: TIERS[ptier].hp,
        hpMax: TIERS[ptier].hp,
        feedback: null,
        done: false,
      });
    }
    return { ok: true, duel: this.duel };
  }

  currentQuestion() {
    return this.duel?.question || null;
  }

  pvpQuestions(continent = "cs") {
    const pool = QUESTION_INDEX.get(continent) || QUESTION_INDEX.get("cs");
    if (!pool) return [];
    const used = new Set();
    const buckets = {
      1: shuffle(pool[1] || []),
      2: shuffle(pool[2] || []),
      3: shuffle(pool[3] || []),
    };
    const all = shuffle([...(pool[1] || []), ...(pool[2] || []), ...(pool[3] || [])]);
    const pick = (tier) => {
      const bucket = buckets[tier] || [];
      while (bucket.length) {
        const q = bucket.pop();
        if (!used.has(q.q)) { used.add(q.q); return q; }
      }
      while (all.length) {
        const q = all.pop();
        if (!used.has(q.q)) { used.add(q.q); return q; }
      }
      return null;
    };
    const itemBonus = Math.min(2, this.relics());
    const specs = [[1, 1, 1], [1, 2, 2], [2, 3, 3], [3, 4, 4], [3, 5, 5]];
    const list = [];
    for (const [tier, difficulty, base] of specs) {
      const q = pick(tier);
      if (!q) continue;
      const options = q.options.map((text, i) => ({ text, ok: i === q.a }));
      const mixed = shuffle(options);
      list.push({
        q: q.q,
        options: mixed.map((o) => o.text),
        answer: mixed.findIndex((o) => o.ok),
        why: q.why,
        tier,
        difficulty,
        base,
        damage: base + itemBonus,
      });
    }
    return list;
  }

  startTraining(continent, tier, theme = "", monster = null) {
    const level = clamp(Number(tier) || 1, 1, 3);
    const deck = this.buildDeck(continent, [level], theme);
    if (!deck.length) return { ok: false, reason: "As perguntas deste continente ainda não foram escritas." };
    const hp = TIERS[level].hp;
    const dummy = {
      id: `training-${continent}-${level}`,
      name: monster?.name || "Boneco de Treino",
      kind: monster?.kind || (level >= 3 ? "golem" : level === 2 ? "eye" : "slime"),
      tier: level,
      level: level * 3,
      theme,
    };
    this.duel = {
      monster: dummy,
      ground: {
        id: "training",
        continent,
        name: `Treino de ${continent}`,
        training: true,
        loot: [],
        bossLoot: null,
      },
      boss: false,
      training: true,
      tier: level,
      deck,
      deckIndex: 0,
      question: deck[0],
      monsterHp: hp,
      monsterHpMax: hp,
      shield: false,
      partners: [],
      get partner() { return this.partners[0] || null; },
      phase: "question",
      feedback: null,
      result: null,
    };
    return { ok: true, duel: this.duel };
  }


  answer(index) {
    const d = this.duel;
    if (!d || d.phase !== "question") return { ok: false };
    const correct = Number(index) === d.question.answer;
    if (correct) {
      this.addSkillXp(d.ground.continent, 1);
      this.addMana(Number(this.activePet()?.passive.manaHit) || 0);
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
      const blocked = !!d.shield;
      if (blocked) d.shield = false;
      const damage = blocked ? 0 : TIERS[d.tier].damage;
      if (d.training) {
        d.feedback = { correct: false, why: d.question.why, damage, blocked, training: true };
        d.phase = "feedback";
        return { ok: true, correct, phase: d.phase, feedback: d.feedback, duel: d };
      }
      this.data.hp = Math.max(0, this.hp() - damage);
      d.feedback = { correct: false, why: d.question.why, damage, blocked };
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

  answerPartner(index, who = 0) {
    const d = this.duel;
    const p = d?.partners?.[who];
    if (!d || !p || p.done || p.feedback || d.phase !== "question") return { ok: false };
    const correct = Number(index) === p.question.answer;
    if (correct) {
      this.addSkillXp(d.ground.continent, 1);
      this.addMana(Number(this.activePet()?.passive.manaHit) || 0);
      p.hp = Math.max(0, p.hp - this.damageFor(d.ground.continent));
      p.feedback = { correct: true, why: p.question.why, damage: 0 };
      if (p.hp <= 0) {
        p.done = true;
        this.data.monsters[p.monster.id] = now();
      }
      this.save();
      return { ok: true, correct, partner: true, who, done: p.done };
    }
    const blocked = !!d.shield;
    if (blocked) d.shield = false;
    const damage = blocked ? 0 : TIERS[p.tier].damage;
    this.data.hp = Math.max(0, this.hp() - damage);
    p.feedback = { correct: false, why: p.question.why, damage, blocked };
    if (this.data.hp <= 0) {
      this.data.hp = this.hpMax();
      d.phase = "defeat";
      this.save();
      this.onRespawn?.();
    } else {
      this.save();
    }
    return { ok: true, correct, partner: true, who, phase: d.phase };
  }

  partnerNext(who = 0) {
    const d = this.duel;
    const p = d?.partners?.[who];
    if (!d || !p || p.done) return null;
    if (!p.feedback) return { phase: d.phase, partner: p };
    p.feedback = null;
    if (p.hp <= 0) { p.done = true; return { phase: d.phase, partner: p }; }
    p.deckIndex++;
    if (p.deckIndex >= p.deck.length) {
      p.deck = shuffle(p.deck);
      p.deckIndex = 0;
      if (p.deck.length > 1 && p.question && p.deck[0].q === p.question.q) {
        [p.deck[0], p.deck[1]] = [p.deck[1], p.deck[0]];
      }
    }
    p.question = p.deck[p.deckIndex];
    return { phase: d.phase, partner: p };
  }

  victory(d) {
    if (d.training) return { training: true, xp: 0, loot: [] };
    const ground = d.ground;
    const monster = d.monster;
    const tier = d.boss ? 4 : monster.tier;
    const itemId = d.boss ? ground.bossLoot : ground.loot[Math.min(2, Math.max(0, tier - 1))];
    const loot = [{ id: itemId || ground.loot[0], qty: 1 }];
    if (ground.material) loot.push({ id: ground.material, qty: d.boss ? 3 : 1 });
    if (d.boss) loot.push({ id: "pocao", qty: 1 });
    else if (Math.random() < 0.28) loot.push({ id: "pocao", qty: 1 });
    for (const l of loot) this.addItem(l.id, l.qty);
    if (d.boss) {
      const accessory = ground.continent === "cs" ? "anel-sinapse" : ground.continent === "music" ? "colar-constante" : null;
      if (accessory && this.itemCount(accessory) <= 0) {
        loot.push({ id: accessory, qty: 1 });
        this.addItem(accessory, 1);
      }
    }
    let xp = TIERS[tier].xp;
    for (const p of (d.partners || []).filter((x) => x.done)) {
      const ptier = p.tier;
      const pItem = ground.loot[Math.min(2, Math.max(0, ptier - 1))];
      if (pItem) { loot.push({ id: pItem, qty: 1 }); this.addItem(pItem, 1); }
      if (ground.material) { loot.push({ id: ground.material, qty: 1 }); this.addItem(ground.material, 1); }
      xp += TIERS[ptier].xp;
    }
    this.addSkillXp(ground.continent, 2);
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

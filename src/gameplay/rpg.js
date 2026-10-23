import { THEME_WORDS, shuffle, OPTION_COUNT, looksNumeric, numericDistractors, variantesProximas, porSemelhanca, QUESTION_INDEX } from "./question-bank.js";
// O estado de RPG: vida, perícias, itens, monstros derrotados e o combate de
// ação. Tudo vive no localStorage; o mundo compartilhado continua sendo só
// posição e conversa.
import { backupCorrupt } from "../platform/storage.js";
import { STORAGE } from "../core/runtime-config.js";
import { SKILLS, TIERS, ITEMS, RECIPES, TROCAS, ENCHANTS, MONSTER_TRAITS, MONSTER_LABELS, MONSTER_WEAKNESS } from "../content/rpg-data.js";
import { BOND_MAX, MANA_MS, PETS, MOUNTS, petById, mountById } from "../content/pets.js";
import { VOCACAO_PADRAO, VOC_POR_ID, subcategoriaDe, vocacaoDe, multDe } from "../content/vocations.js";
import { Combate } from "./combate.js";
import { habilidadeDoChefe } from "./chefe-habilidades.js";
import { registrarResposta, vencido, resumoConceitos, conceitoDe } from "./conceitos.js";
import { versaoDaPergunta, registrarDistrator as registrarErro, recentes as errosRecentesDoSave, erroRecente, purgar as purgarDistratores } from "./distratores.js";
import { estadoDaProva } from "./grande-prova.js";
import { lidosDaHistoria } from "./arcos.js";
import { atosValidos, reputacoes, ajusteDaCompra } from "./faccoes.js";
import { guildaValida } from "./guilda.js";
import { FAMILIAS, FAMILIA_POR_ID, familiaDeKind } from "../content/familias.js";

const RESPAWN_MS = 5 * 60 * 1000;
const BOSS_RESPAWN_MS = 20 * 60 * 1000;
const MAX_SKILL_XP = 50;
const SKILL_STEP = 5;
const BUFF_NAMES = { speed: "passos rápidos", damage: "dano extra", maxhp: "vida extra", dica: "dica da biblioteca" };
// a ordem dos espaços de equipamento, do corpo para os acessórios
const SLOT_NAMES = { weapon: "arma", helmet: "elmo", armor: "armadura", legs: "pernas", boots: "botas", shield: "escudo", cloak: "capa", ring: "anel", necklace: "colar" };
// custo em mana de cada runa aprendida; sem carga guardada, é por aqui que ela sai
const SPELL_MANA = {
  "runa-faisca": 2,
  "runa-trovao": 3,
  "runa-fogo": 4,
  "runa-gelo": 3,
  "runa-cura": 3,
  "runa-espelho": 2,
  "runa-bencao": 4,
  "runa-mente": 1,
  "runa-eco": 3,
  "runa-punhal": 2,
  "runa-corrente": 3,
  "runa-lente": 4,
};
export const petAbilityNeedsDuel = (id) => ["faro", "tagarela", "sabedoria", "aviso"].includes(id);
const PET_ABILITY_IDS = new Set(Object.values(PETS).map((pet) => pet.ability.id));

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
    spells: {},
    buffs: {},
    pets: {},
    petActive: null,
    petCd: {},
    mana: null,
    manaAt: 0,
    mounts: {},
    mountActive: null,
    equipped: {},
    builds: [],
    seen: {},
    met: {},
    conceitos: {},
    distratores: {},
    grandeProva: null,
    arcos: [],
    faccoes: [],
    guilda: null,
    familias: {},
    plots: {},
    plotGift: {},
    // vocação: padrão para save antigo, que nunca escolheu
    vocation: VOCACAO_PADRAO,
    sub: "",
    // mesa de vocação: troca grátis uma vez por nível, subcategoria grátis na
    // primeira escolha
    vocacaoLivre: 0,
    subUsada: false,
  };
}

function readData() {
  try {
    const raw = localStorage.getItem(STORAGE.rpg);
    const obj = raw ? JSON.parse(raw) : null;
    if (!obj || typeof obj !== "object") return emptyData();
    const data = emptyData();
    if (Number.isFinite(obj.hp)) data.hp = obj.hp;
    if (VOC_POR_ID.has(obj.vocation)) data.vocation = obj.vocation;
    if (obj.sub && subcategoriaDe(obj.sub)?.vocacao === data.vocation) data.sub = obj.sub;
    if (Number.isFinite(obj.vocacaoLivre)) data.vocacaoLivre = obj.vocacaoLivre;
    if (obj.subUsada) data.subUsada = true;
    for (const k of Object.keys(SKILLS)) {
      data.skills[k] = clamp(Number(obj.skills?.[k]) || 0, 0, MAX_SKILL_XP);
    }
    for (const [id, qty] of Object.entries(obj.items || {})) {
      if (ITEMS[id] && Number.isFinite(Number(qty)) && Number(qty) >= 1) data.items[id] = Math.floor(Number(qty));
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
    for (const id of Object.keys(SPELL_MANA)) {
      if (obj.spells?.[id]) data.spells[id] = true;
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
    // builds: retratos do equipamento, no máximo três, só com peça de slot válido
    for (const b of Array.isArray(obj.builds) ? obj.builds.slice(0, 3) : []) {
      if (!b || typeof b.n !== "string" || !b.e || typeof b.e !== "object") continue;
      const pecas = {};
      for (const [slot, id] of Object.entries(b.e)) {
        if (ITEMS[id]?.slot === slot) pecas[slot] = id;
      }
      if (!Object.keys(pecas).length) continue;
      data.builds.push({ n: b.n.slice(0, 16), e: pecas });
    }
    for (const [id, at] of Object.entries(obj.familias || {})) {
      if (FAMILIA_POR_ID.has(id) && Number.isFinite(at)) data.familias[id] = at;
    }
    for (const [id, at] of Object.entries(obj.met || {})) {
      if (!/^[a-z0-9-]{2,60}$/.test(id) || !Number.isFinite(at)) continue;
      data.met[id] = at;
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
      const saved = data.seen[kind];
      if (SKILLS[entry.continent]) saved.continent = entry.continent;
      for (const [field, max] of [["theme", 20], ["sample", 90]]) {
        if (typeof entry[field] === "string") saved[field] = entry[field].replace(/[<>\u0000-\u001f]/g, "").slice(0, max);
      }
    }
    for (const [area, entry] of Object.entries(obj.conceitos || {})) {
      if (typeof area !== "string" || area.length > 40 || !entry || typeof entry !== "object") continue;
      data.conceitos[area] = {
        n: clamp(Number(entry.n) || 0, 0, 5),
        r: Math.max(0, Math.floor(Number(entry.r) || 0)),
        w: Math.max(0, Math.floor(Number(entry.w) || 0)),
        due: Number.isFinite(Number(entry.due)) ? Number(entry.due) : 0,
      };
    }
    for (const [versao, entry] of Object.entries(obj.distratores || {})) {
      if (!/^[0-9a-f]{8}$/.test(versao) || !entry || typeof entry !== "object") continue;
      const texto = String(entry.t || "").replace(/[<>\u0000-\u001f]/g, "").trim().slice(0, 160);
      if (!texto) continue;
      data.distratores[versao] = {
        t: texto,
        n: clamp(Number(entry.n) || 1, 1, 9999),
        at: Number.isFinite(Number(entry.at)) ? Number(entry.at) : 0,
      };
    }
    purgarDistratores(data.distratores);
    const prova = estadoDaProva(obj);
    if (prova) data.grandeProva = { escolha: prova.escolha, at: Number.isFinite(prova.at) ? prova.at : 0 };
    data.arcos = lidosDaHistoria(obj);
    data.faccoes = atosValidos(obj);
    data.guilda = guildaValida(obj.guilda);
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

  // ---- vocação -------------------------------------------------------------
  vocacao() {
    return vocacaoDe(this.data.vocation);
  }

  sub() {
    return subcategoriaDe(this.data.sub);
  }

  bonus() {
    return multDe(this.data.vocation);
  }

  setVocation(id) {
    const v = VOC_POR_ID.get(id);
    if (!v) return { ok: false, reason: "vocação desconhecida" };
    const mudou = this.data.vocation !== id;
    this.data.vocation = id;
    // trocar de vocação zera a subcategoria: ela é do caminho antigo
    if (mudou) this.data.sub = "";
    this.ensureHp();
    this.save();
    return { ok: true, mudou, vocacao: v };
  }

  custoVocacao() {
    // a primeira troca de cada nível é de graça; a segunda custa material
    return this.data.vocacaoLivre === this.getLevel() ? { ferro: 3, veio: 2 } : null;
  }

  trocarVocacao(id) {
    if (!VOC_POR_ID.has(id)) return { ok: false, reason: "vocação desconhecida" };
    if (this.data.vocation === id) return { ok: false, reason: "essa já é a sua vocação" };
    const custo = this.custoVocacao();
    if (custo) {
      for (const [mat, qtd] of Object.entries(custo)) {
        if (this.itemCount(mat) < qtd) return { ok: false, reason: `faltam materiais: ${mat} ${qtd}` };
      }
      for (const [mat, qtd] of Object.entries(custo)) {
        this.data.items[mat] -= qtd;
        if (this.data.items[mat] <= 0) delete this.data.items[mat];
      }
    } else {
      this.data.vocacaoLivre = this.getLevel();
    }
    const res = this.setVocation(id);
    return { ...res, custo };
  }

  custoSub() {
    return this.data.subUsada ? { veio: 4, erva: 2 } : null;
  }

  trocarSub(id) {
    const s = subcategoriaDe(id);
    if (!s) return { ok: false, reason: "subcategoria desconhecida" };
    if (s.vocacao !== this.data.vocation) return { ok: false, reason: "não é da sua vocação" };
    if (this.getLevel() < 10) return { ok: false, reason: "a subcategoria abre no nível 10" };
    if (this.data.sub === id) return { ok: false, reason: "essa já é a sua subcategoria" };
    const custo = this.custoSub();
    if (custo) {
      for (const [mat, qtd] of Object.entries(custo)) {
        if (this.itemCount(mat) < qtd) return { ok: false, reason: `faltam materiais: ${mat} ${qtd}` };
      }
      for (const [mat, qtd] of Object.entries(custo)) {
        this.data.items[mat] -= qtd;
        if (this.data.items[mat] <= 0) delete this.data.items[mat];
      }
    }
    this.data.sub = id;
    this.data.subUsada = true;
    this.save();
    return { ok: true, sub: s, custo };
  }

  setSub(id) {
    const s = subcategoriaDe(id);
    if (!s || s.vocacao !== this.data.vocation) return { ok: false, reason: "essa subcategoria não é da sua vocação" };
    if (this.getLevel() < 10) return { ok: false, reason: "a subcategoria abre no nível 10" };
    this.data.sub = id;
    this.save();
    return { ok: true, sub: s };
  }

  noteMonster(monster) {
    if (!monster?.kind) return;
    const kind = String(monster.kind).toLowerCase().replace(/[^a-z]/g, "").slice(0, 10);
    if (!kind) return;
    const entry = this.data.seen[kind] || { count: 0, name: monster.name || kind, tier: monster.tier || 1 };
    entry.count = Math.min(9999, entry.count + 1);
    entry.name = String(monster.name || entry.name).replace(/[<>\u0000-\u001f]/g, "").slice(0, 24);
    entry.tier = clamp(Number(monster.tier) || entry.tier || 1, 1, 4);
    // o diário mostra de onde o bicho veio e uma pergunta típica da dificuldade
    const continent = String(monster.continent || "").toLowerCase().slice(0, 12);
    if (continent) entry.continent = continent;
    if (monster.theme) entry.theme = String(monster.theme).replace(/[<>\u0000-\u001f]/g, "").slice(0, 20);
    const bank = QUESTION_INDEX.get(entry.continent)?.[entry.tier] || [];
    if (bank.length) entry.sample = bank[entry.count % bank.length].q.slice(0, 90);
    this.data.seen[kind] = entry;
    // conhecer a última espécie da família rende a fraqueza estudada
    this.revisarFamilias();
    // o bestiário guarda a criatura pelo id: encontrar já revela a ficha
    const id = String(monster.id || "").toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 60);
    if (id) this.data.met[id] = now();
    this.save();
  }

  // Família estudada: todas as espécies conhecidas rendem +50% de dano contra
  // ela, registrado uma vez no save e avisado na tela.
  revisarFamilias() {
    const completas = [];
    for (const familia of FAMILIAS) {
      if (this.data.familias?.[familia.id]) continue;
      if (!familia.kinds.every((kind) => Number(this.data.seen[kind]?.count) > 0)) continue;
      this.data.familias = this.data.familias || {};
      this.data.familias[familia.id] = now();
      completas.push(familia);
    }
    for (const familia of completas) {
      this.toast(`Família ${familia.nome} estudada: +50% de dano contra ela.`, 5200);
    }
    return completas;
  }

  familiaDe(kind) {
    return familiaDeKind(kind);
  }

  familiaCompleta(kind) {
    const familia = familiaDeKind(kind);
    return Boolean(familia && this.data.familias?.[familia.id]);
  }

  familiasView() {
    return FAMILIAS.map((familia) => {
      const conhecidos = familia.kinds.filter((kind) => Number(this.data.seen[kind]?.count) > 0).length;
      return {
        id: familia.id,
        nome: familia.nome,
        desc: familia.desc,
        total: familia.kinds.length,
        conhecidos,
        completa: Boolean(this.data.familias?.[familia.id]),
      };
    });
  }

  seenView() {
    return Object.entries(this.data.seen)
      .map(([kind, entry]) => ({ kind, label: MONSTER_LABELS[kind] || kind, weakness: MONSTER_WEAKNESS[kind] || "observar o movimento", trait: MONSTER_TRAITS[kind]?.label || "", ...entry }))
      .sort((a, b) => b.tier - a.tier || b.count - a.count || a.kind.localeCompare(b.kind));
  }

  equipmentBonus() {
    let hp = 0, damage = 0, shield = 0;
    const porContinente = new Map();
    for (const [slot, id] of Object.entries(this.data.equipped || {})) {
      const item = ITEMS[id];
      if (!item || item.slot !== slot || this.itemCount(id) <= 0) continue;
      hp += Number(item.hp) || 0;
      damage += Number(item.damage) || 0;
      // escudo equipado segura o primeiro golpe do combate, uma vez por combate
      if (slot === "shield") shield = 1;
      if (item.continent) porContinente.set(item.continent, (porContinente.get(item.continent) || 0) + 1);
    }
    // três peças do mesmo continente formam conjunto: +2 de vida e +1 de dano
    const conjunto = [...porContinente.values()].some((n) => n >= 3);
    if (conjunto) { hp += 2; damage += 1; }
    return { hp, damage, conjunto, shield };
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
      cloak: { erva: 2, veio: 2 },
      ring: { veio: 3, erva: 2 },
      necklace: { erva: 3, veio: 2 },
    };
    if (!table[item.slot]) return null;
    const price = { ...table[item.slot] };
    // o Porto é quem vende: a reputação mexe no material mais caro da peça
    const ajuste = ajusteDaCompra(reputacoes(this.data));
    if (ajuste) {
      const caro = Object.keys(price).sort((a, b) => price[b] - price[a])[0];
      price[caro] = Math.max(1, price[caro] + ajuste);
    }
    return price;
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

  // Mercador de troca: sempre perde material, e a falta não cobra nada.
  trocasView() {
    return TROCAS.map((t) => ({
      id: t.id,
      de: t.de,
      deNome: ITEMS[t.de]?.name || t.de,
      qtd: t.qtd,
      para: t.para,
      paraNome: ITEMS[t.para]?.name || t.para,
      ganho: t.ganho,
      pode: this.itemCount(t.de) >= t.qtd,
    }));
  }

  trocar(id) {
    const t = TROCAS.find((x) => x.id === id);
    if (!t) return { ok: false, reason: "Essa troca não existe." };
    if (this.itemCount(t.de) < t.qtd) {
      return { ok: false, reason: `Falta ${ITEMS[t.de]?.name || t.de}: a troca pede ${t.qtd}.` };
    }
    this.data.items[t.de] -= t.qtd;
    if (this.data.items[t.de] <= 0) delete this.data.items[t.de];
    this.addItem(t.para, t.ganho);
    this.save();
    return {
      ok: true, de: ITEMS[t.de]?.name || t.de, qtd: t.qtd,
      para: ITEMS[t.para]?.name || t.para, ganho: t.ganho,
    };
  }

  // Builds: um retrato do que está vestido, para trocar o conjunto inteiro.
  // Três é o limite; a peça que sumiu da mochila entra como falta, não quebra.
  buildsView() {
    return (this.data.builds || []).map((b, index) => ({
      index,
      nome: b.n,
      pecas: Object.keys(b.e || {}).length,
    }));
  }

  salvarBuild(nome) {
    const equipado = this.data.equipped || {};
    if (!Object.keys(equipado).length) return { ok: false, reason: "Nada equipado para guardar nesta build." };
    this.data.builds = Array.isArray(this.data.builds) ? this.data.builds : [];
    if (this.data.builds.length >= 3) return { ok: false, reason: "Três builds é o limite. Remova uma antes." };
    const limpo = String(nome || "").replace(/[<>\u0000-\u001f]/g, "").trim().slice(0, 16)
      || `build ${this.data.builds.length + 1}`;
    this.data.builds.push({ n: limpo, e: { ...equipado } });
    this.save();
    return { ok: true, nome: limpo, index: this.data.builds.length - 1 };
  }

  usarBuild(index) {
    const b = this.data.builds?.[index];
    if (!b) return { ok: false, reason: "Essa build não existe." };
    const equipe = {};
    const faltando = [];
    for (const slot of Object.keys(SLOT_NAMES)) {
      const id = b.e?.[slot];
      if (!id) continue;
      if (this.itemCount(id) <= 0) { faltando.push(SLOT_NAMES[slot]); continue; }
      equipe[slot] = id;
    }
    if (!Object.keys(equipe).length) return { ok: false, reason: "Nenhuma peça desta build está na mochila." };
    this.data.equipped = equipe;
    this.save();
    return { ok: true, nome: b.n, equipadas: Object.keys(equipe).length, faltando };
  }

  removerBuild(index) {
    if (!Array.isArray(this.data.builds) || !this.data.builds[index]) {
      return { ok: false, reason: "Essa build não existe." };
    }
    const [fora] = this.data.builds.splice(index, 1);
    this.save();
    return { ok: true, nome: fora.n };
  }

  equippedView() {
    return Object.entries(SLOT_NAMES).map(([slot, name]) => {
      const id = this.data.equipped?.[slot];
      return { slot, name, item: id && this.itemCount(id) > 0 ? { id, ...ITEMS[id] } : null };
    });
  }

  hpMax() {
    // a vocação multiplica o corpo (base + nível), não o que veio de item:
    // assim uma armadura de +5 continua valendo +5 em qualquer vocação
    const corpo = 30 + (Math.max(1, this.getLevel()) - 1) * 4;
    let max = corpo * this.bonus().vida + this.relics() * 5 + this.equipmentBonus().hp;
    if (this.data.enchants.vigor) max += 10;
    if (this.data.enchants.couro) max += 5;
    if (this.buffActive("maxhp")) max += 5;
    max += Number(this.activePet()?.passive.hp) || 0;
    if (!this.cave) max += Number(MOUNTS[this.data.mountActive]?.hp) || 0;
    return Math.max(1, Math.round(max));
  }

  buffActive(id) {
    return Number.isFinite(this.data.buffs[id]) && this.data.buffs[id] > now();
  }

  speedMult() {
    const base = this.buffActive("speed") ? 1.3 : 1;
    return base * (this.data.enchants.passo ? 1.1 : 1);
  }

  lightBonus() {
    return (this.data.enchants.luz ? 3 : 0)
      + (this.data.enchants.olho ? 2 : 0)
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
    // mesma regra da vida: mana de bicho entra depois do multiplicador
    return Math.max(1, Math.round(10 * this.bonus().mana + (this.data.enchants.folego ? 5 : 0)
      + (Number(this.activePet()?.passive.manaMax) || 0)));
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
    const current = now();
    const savedAt = Number(this.data.manaAt);
    // Saves antigos e relógios corrigidos precisam de uma origem válida.
    if (!Number.isFinite(savedAt) || savedAt <= 0 || savedAt > current || this.data.mana >= max) {
      this.data.mana = clamp(Number(this.data.mana), 0, max);
      this.data.manaAt = current;
      return;
    }
    const at = savedAt;
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
    const emCombate = !!this.combate && this.combate.phase === "combat";
    if (petAbilityNeedsDuel(ab.id) && !(duel && emCombate)) {
      return { ok: false, reason: "Essa habilidade só funciona no combate." };
    }
    this.pulse();
    if (ab.id !== "mana" && this.mana() < ab.mana) {
      return { ok: false, reason: `Falta mana (${this.mana()}/${ab.mana}).` };
    }
    const out = { ok: true, pet: { id: pet.id, name: pet.name }, ability: ab, effect: ab.id };
    if (ab.id === "faro") out.lente = true;
    if (ab.id === "tagarela") out.stun = 1700;
    if (ab.id === "sabedoria") out.lente = true;
    if (ab.id === "aviso") out.shield = true;
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

  // Consulta da biblioteca: a próxima pergunta da coleta nasce com duas
  // alternativas erradas riscadas. O selo vale uma vez e some do save ao gastar.
  dicaGuardadaNaPergunta(q) {
    if (!q || !Array.isArray(q.options) || !this.buffActive("dica")) return [];
    const erradas = q.options.map((_, i) => i).filter((i) => i !== q.answer);
    const eliminadas = shuffle(erradas).slice(0, Math.min(2, erradas.length));
    delete this.data.buffs.dica;
    this.save();
    return eliminadas;
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

  damageFor(id, longe = true) {
    const skill = this.skillLevel(id);
    let damage = skill >= 10 ? 3 : skill >= 6 ? 2 : 1;
    if (this.data.enchants.furor) damage++;
    if (this.data.enchants.punho) damage++;
    if (this.buffActive("damage")) damage++;
    damage += (Number(this.activePet()?.passive.damage) || 0) * this.bonus().pet;
    damage += this.equipmentBonus().damage;
    // o atirador é forte de longe e fraco de perto; a vocação entra depois da
    // soma, então vale para perícia, equipamento e pet
    const mult = this.data.vocation === "atirador" ? (longe ? 1.15 : 0.75) : this.bonus().dano;
    damage *= mult;
    if (this.data.sub === "barbaro" && !this.data.equipped?.armor) damage += 1;
    // teto de 4: sem teto o bicho difícil de 18 vira uma luta fácil para quem
    // juntou equipamento e encantamento
    return Math.min(4, Math.round(damage * 10) / 10);
  }

  // o golpe do bicho cobra por vocação, e duas subcategorias mexem na conta
  danoSofrido(base) {
    let dano = base * this.bonus().sofrido;
    if (this.data.enchants.couraca) dano *= 0.9;
    if (this.data.sub === "baluarte") dano -= 1;
    if (this.data.sub === "barbaro") dano += 2;
    return Math.max(1, Math.round(dano));
  }

  // ---------- caderno de conceitos ----------
  registrarConceito(area, acertou, continent = this.duel?.ground?.continent) {
    if (!this.data.conceitos || typeof this.data.conceitos !== "object") this.data.conceitos = {};
    return registrarResposta(this.data.conceitos, conceitoDe(area, continent), acertou, now());
  }

  conceitosResumo() {
    return resumoConceitos(this.data.conceitos, now());
  }

  // erro por distrator: guarda a alternativa marcada e a versão da pergunta
  registrarDistrator(pergunta, indice) {
    const marcada = pergunta?.options?.[indice];
    if (typeof marcada !== "string" || !marcada) return null;
    if (!this.data.distratores || typeof this.data.distratores !== "object") this.data.distratores = {};
    return registrarErro(this.data.distratores, pergunta, marcada, now());
  }

  // últimas perguntas erradas, com o texto do banco: o save guarda a versão e
  // o caderno mostra o enunciado, a alternativa marcada e a resposta certa
  errosRecentes(limite = 5) {
    const lista = errosRecentesDoSave(this.data.distratores, limite);
    if (!lista.length) return [];
    const banco = new Map();
    for (const tiers of QUESTION_INDEX.values()) {
      for (const perguntas of Object.values(tiers)) {
        for (const q of perguntas) banco.set(versaoDaPergunta(q), q);
      }
    }
    return lista
      .map((entry) => {
        const q = banco.get(entry.versao);
        if (!q) return null;
        return { q: q.q, marcou: entry.texto, resposta: q.options[q.a], n: entry.n, at: entry.at };
      })
      .filter(Boolean);
  }

  // ---------- itens ----------
  addItem(id, qty = 1) {
    if (!ITEMS[id] || !Number.isFinite(qty) || qty < 1) return;
    this.data.items[id] = (this.data.items[id] || 0) + Math.floor(qty);
    this.save();
  }

  // tira item do save; devolve false sem mexer se não há o suficiente
  removeItem(id, qty = 1) {
    const atual = Number(this.data.items[id]) || 0;
    const n = Math.floor(Number(qty));
    if (!ITEMS[id] || !Number.isFinite(n) || n < 1 || atual < n) return false;
    if (atual === n) delete this.data.items[id];
    else this.data.items[id] = atual - n;
    this.save();
    return true;
  }

  itemCount(id) {
    return this.data.items[id] || 0;
  }

  // o altar devolve uma carga da runa aprendida que estiver mais vazia
  recarregarRuna() {
    const aprendidas = Object.keys(this.data.spells || {})
      .filter((id) => id.startsWith("runa-") && this.data.spells[id] && ITEMS[id]);
    if (!aprendidas.length) return null;
    aprendidas.sort((a, b) => this.itemCount(a) - this.itemCount(b) || a.localeCompare(b));
    const id = aprendidas[0];
    this.addItem(id, 1);
    return ITEMS[id].name;
  }

  // magia no mapa, fora do combate: cura de verdade, o resto é
  // efeito de cena (luz, faísca, fogo) pago com mana ou carga
  castWorldSpell(id) {
    if (!ITEMS[id] || !SPELL_MANA[id]) return { ok: false, reason: "Essa magia não existe." };
    const cost = SPELL_MANA[id];
    const temCarga = this.itemCount(id) > 0;
    if (!temCarga && !this.data.spells[id]) return { ok: false, reason: "Você ainda não aprendeu essa runa. Forje uma na forja." };
    if (!temCarga && this.mana() < cost) return { ok: false, reason: `Falta mana (${this.mana()}/${cost}).` };
    if (temCarga) {
      this.data.items[id]--;
      if (this.data.items[id] <= 0) delete this.data.items[id];
      this.data.spells[id] = true;
    } else {
      this.data.mana = clamp(this.mana() - cost, 0, this.manaMax());
    }
    const item = ITEMS[id];
    let healed = 0;
    if (id === "runa-cura") healed = this.heal(10);
    if (id === "runa-bencao") healed = this.heal(8);
    this.save();
    return { ok: true, name: item.name, healed, manaCost: temCarga ? 0 : cost, charge: temCarga, effect: id };
  }

  spellbarView() {
    return Object.keys(SPELL_MANA).map((id) => ({
      id,
      name: ITEMS[id]?.name || id,
      mana: SPELL_MANA[id],
      charges: this.itemCount(id),
      learned: !!this.data.spells[id],
    })).filter((spell) => spell.learned || spell.charges > 0);
  }

  useItem(id) {
    const item = ITEMS[id];
    const rune = typeof id === "string" && id.startsWith("runa-");
    if (!item || !(rune || item.heal || item.mana || item.buff || ["tocha", "bomba", "isca"].includes(id))) {
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
    if (id === "isca") {
      this.data.items[id]--;
      if (this.data.items[id] <= 0) delete this.data.items[id];
      this.save();
      return { ok: true, bait: true, name: item.name };
    }
    if (rune) {
      // a runa se usa no combate, pela barra de magias (1-6)
      return { ok: false, reason: "A runa se usa no combate, pela barra de magias." };
    }
    // comida com efeito pode ser usada de vida cheia: o buff ainda vale
    if (!item.buff && (item.heal || item.mana)
      && (!item.heal || this.hp() >= this.hpMax())
      && (!item.mana || this.mana() >= this.manaMax())) {
      return { ok: false, reason: item.heal && item.mana ? "Sua vida e mana já estão cheias."
        : item.heal ? "Sua vida já está cheia." : "Sua mana já está cheia." };
    }
    this.data.items[id]--;
    if (this.data.items[id] <= 0) delete this.data.items[id];
    const healed = this.heal(item.heal || 0);
    let mana = 0;
    if (item.mana) {
      mana = Math.min(item.mana, this.manaMax() - this.mana());
      this.data.mana = clamp(this.mana() + mana, 0, this.manaMax());
    }
    if (item.buff) this.data.buffs[item.buff.id] = now() + item.buff.ms;
    this.save();
    return {
      ok: true,
      healed,
      mana,
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
    if (String(recipe.out).startsWith("runa-")) this.data.spells[recipe.out] = true;
    this.save();
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
  // As salas têm tema. A pergunta que combina com o tema vai para a frente do
  // baralho; o resto continua no sorteio. Sem tema, é sorteio puro.
  optionPool(continent, tier, area = "", baseOnly = false) {
    if (!this.pool) this.pool = new Map();
    const key = `${continent}:${tier}:${area}:${baseOnly ? "base" : "todos"}`;
    if (this.pool.has(key)) return this.pool.get(key);
    const pool = [];
    const seen = new Set();
    const bank = QUESTION_INDEX.get(continent) || {};
    for (const t of [tier, 1, 2, 3]) {
      for (const q of bank[t] || []) {
        if (area && q.area !== area) continue;
        if (baseOnly && q.area) continue;
        for (const text of q.options) {
          const clean = String(text).trim();
          if (!clean || clean.length > 44) continue;
          const low = clean.toLowerCase();
          if (seen.has(low)) continue;
          seen.add(low);
          pool.push(clean);
        }
      }
    }
    this.pool.set(key, pool);
    return pool;
  }

  // toda pergunta oferece cinco alternativas, A a E: com três o chute acerta
  // demais. As que faltam vêm do próprio banco do continente, e pergunta
  // numérica ganha número, não palavra.
  padOptions(options, answer, continent, tier, area = "", question = "") {
    const entries = options.map((text, i) => ({ text: String(text).trim(), ok: i === answer }));
    // pergunta com mais alternativas que o padrão: mantém a certa e corta as
    // outras, em vez de descartar as opções escritas à mão e inventar duas
    let escolhidas = entries;
    if (entries.length > OPTION_COUNT) {
      escolhidas = [entries[answer], ...shuffle(entries.filter((_, i) => i !== answer)).slice(0, OPTION_COUNT - 1)];
    }
    const list = escolhidas.map((e) => e.text);
    const correct = escolhidas.find((e) => e.ok)?.text || "";
    const seen = new Set(list.map((s) => s.toLowerCase()));
    const push = (text) => {
      const clean = String(text).trim();
      if (!clean || list.length >= OPTION_COUNT) return;
      const low = clean.toLowerCase();
      if (seen.has(low)) return;
      seen.add(low);
      list.push(clean);
    };
    // a resposta certa também embaralha: com o preenchimento no fim, ela
    // ficaria sempre em A, B ou C e o jogador aprenderia a ignorar D e E
    const finalizar = () => {
      const finalEntries = escolhidas.map((e) => ({ text: e.text, ok: e.ok }));
      for (const text of list.slice(escolhidas.length)) finalEntries.push({ text, ok: false });
      const final = shuffle(finalEntries);
      return { options: final.map((o) => o.text), answer: final.findIndex((o) => o.ok) };
    };
    // já tem as cinco escritas à mão: não precisa pescar nem ordenar pool
    if (list.length >= OPTION_COUNT) return finalizar();
    const numeric = looksNumeric(correct);
    if (numeric) for (const n of numericDistractors(correct)) push(n);
    else for (const variante of variantesProximas(correct, seen)) push(variante);
    if (list.length >= OPTION_COUNT) return finalizar();
    // primeiro as alternativas da própria área; para pergunta sem área,
    // respostas de outras perguntas-base são mais próximas de um enunciado
    // conceitual do que rótulos de tópico do catálogo
    if (area) {
      const areaPool = this.optionPool(continent, tier, area);
      for (const text of porSemelhanca(areaPool.filter((s) => looksNumeric(s) === numeric), correct, question)) push(text);
      if (list.length >= OPTION_COUNT) return finalizar();
      for (const text of porSemelhanca(areaPool, correct, question)) push(text);
    } else {
      const basePool = this.optionPool(continent, tier, "", true);
      for (const text of porSemelhanca(basePool.filter((s) => looksNumeric(s) === numeric), correct, question)) push(text);
      if (list.length >= OPTION_COUNT) return finalizar();
      for (const text of porSemelhanca(basePool, correct, question)) push(text);
    }
    if (list.length >= OPTION_COUNT) return finalizar();
    const pool = this.optionPool(continent, tier);
    for (const text of porSemelhanca(pool.filter((s) => looksNumeric(s) === numeric), correct, question)) push(text);
    if (list.length >= OPTION_COUNT) return finalizar();
    for (const text of porSemelhanca(pool, correct, question)) push(text);
    return finalizar();
  }

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
        const filled = this.padOptions(mixed.map((o) => o.text), mixed.findIndex((o) => o.ok), continent, tier, q.area, q.q);
        deck.push({
          q: q.q,
          version: versaoDaPergunta(q),
          options: filled.options,
          answer: filled.answer,
          why: q.why,
          area: q.area,
          tier,
          score: this.themeScore(`${q.q} ${q.why}`, hint) + (q.deep ? 1 : 0),
        });
      }
    }
    return shuffle(deck).sort((a, b) => b.score - a.score);
  }

  duelDeck(continent, tier, hint = "") {
    const order = tier >= 3 ? [3, 2, 1] : tier === 2 ? [2, 1, 3] : [1, 2, 3];
    const seen = new Set();
    const deck = [];
    for (const t of order) {
      for (const item of this.buildDeck(continent, [t], hint)) {
        if (seen.has(item.q)) continue;
        seen.add(item.q);
        deck.push(item);
      }
    }
    // conceito vencido volta antes (revisão espaçada) e, dentro do mesmo grupo,
    // a área mais fraca vem primeiro: o duelo começa onde o domínio é menor.
    const agora = now();
    const due = (item) => (item.area && vencido(this.data.conceitos?.[item.area], agora) ? 1 : 0);
    const dominio = (item) => {
      if (!item.area) return 3;
      const n = Number(this.data.conceitos?.[item.area]?.n);
      return Number.isFinite(n) ? n : 0;
    };
    // dentro do mesmo domínio, a pergunta que ele errou nos últimos dias volta
    // antes: o erro específico também é informação de revisão
    const erro = (item) => (erroRecente(this.data.distratores?.[item.version], agora) ? 1 : 0);
    return deck.sort((a, b) => due(b) - due(a) || dominio(a) - dominio(b) || erro(b) - erro(a));
  }

  startDuel(monster, ground, boss = false, partner = null) {
    if (boss ? !this.bossAlive(ground) : !this.monsterAlive(monster.id)) {
      return { ok: false, reason: "Este monstro não está mais aqui." };
    }
    const vistos = new Set([monster.id]);
    const extras = (Array.isArray(partner) ? partner : partner ? [partner] : [])
      .filter((p) => {
        if (!p || vistos.has(p.id) || !this.monsterAlive(p.id)) return false;
        vistos.add(p.id);
        return true;
      })
      .slice(0, 3);
    const tier = boss ? 4 : clamp(Number(monster.tier) || 1, 1, 3);
    const hp = boss ? TIERS[4].hp : Math.round(TIERS[tier].hp * (Number(monster.hpMult) || 1));
    // a matilha entra com a mesma vida que teria sozinha; o combate marca cada
    // uma como derrotada quando ela cai
    const parceiros = extras.map((p) => {
      const ptier = clamp(Number(p.tier) || 1, 1, 3);
      const php = TIERS[ptier].hp;
      return { monster: p, tier: ptier, hp: php, hpMax: php, done: false };
    });
    this.duel = {
      monster,
      ground,
      boss,
      tier,
      monsterHp: hp,
      monsterHpMax: hp,
      bossPhase: 1,
      habilidade: boss ? habilidadeDoChefe(monster) : null,
      espelhoUsado: false,
      escudo: this.equipmentBonus().shield > 0 || !!this.data.enchants.escudo,
      shield: false,
      eco: 0,
      partners: parceiros,
      get partner() { return this.partners[0] || null; },
      phase: "combat",
      training: false,
      result: null,
      surprise: !this.cave,
      petUsado: false,
    };
    this.combate = new Combate({
      rpg: this,
      monster: { monster, tier, hp, hpMax: hp },
      partners: parceiros,
      ground,
      boss,
      training: false,
    });
    this.combate.jogador.escudo = this.duel.escudo;
    return { ok: true, duel: this.duel, combate: this.combate };
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
      const filled = this.padOptions(mixed.map((o) => o.text), mixed.findIndex((o) => o.ok), continent, tier, q.area, q.q);
      list.push({
        q: q.q,
        options: filled.options,
        answer: filled.answer,
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
      monsterHp: hp,
      monsterHpMax: hp,
      bossPhase: 1,
      habilidade: null,
      espelhoUsado: false,
      escudo: false,
      shield: false,
      eco: 0,
      partners: [],
      get partner() { return null; },
      phase: "combat",
      result: null,
      surprise: false,
      petUsado: false,
    };
    this.combate = new Combate({
      rpg: this,
      monster: { monster: dummy, tier: level, hp, hpMax: hp },
      partners: [],
      ground: this.duel.ground,
      training: true,
    });
    return { ok: true, duel: this.duel, combate: this.combate };
  }

  victory(d) {
    if (d.training) return { training: true, xp: 0, loot: [] };
    const ground = d.ground;
    const monster = d.monster;
    const tier = d.boss ? 4 : monster.tier;
    const itemId = d.boss ? ground.bossLoot : ground.loot[Math.min(2, Math.max(0, tier - 1))];
    const loot = [{ id: itemId || ground.loot[0], qty: Math.max(1, Number(monster?.lootMult) || 1) }];
    if (ground.material) loot.push({ id: ground.material, qty: (d.boss ? 3 : 1) * (Number(monster?.lootMult) || 1) });
    if (d.boss) loot.push({ id: "pocao", qty: 1 });
    else if (Math.random() < 0.28) loot.push({ id: "pocao", qty: 1 });
    // caçador de recompensa: a caçada rende uma peça a mais
    if (this.data.sub === "cacador" && ground.material) loot.push({ id: ground.material, qty: 1 });
    // sorte: uma em cada quatro vitórias devolve material extra
    if (this.data.enchants.sorte && ground.material && Math.random() < 0.25) loot.push({ id: ground.material, qty: 1 });
    for (const l of loot) this.addItem(l.id, l.qty);
    if (d.boss) {
      const accessory = ground.continent === "cs" ? "anel-sinapse" : ground.continent === "music" ? "colar-constante" : null;
      if (accessory && this.itemCount(accessory) <= 0) {
        loot.push({ id: accessory, qty: 1 });
        this.addItem(accessory, 1);
      }
    }
    let xp = Math.round(TIERS[tier].xp * (Number(monster?.xpMult) || 1));
    for (const p of (d.partners || []).filter((x) => x.done)) {
      const ptier = p.tier;
      const pItem = ground.loot[Math.min(2, Math.max(0, ptier - 1))];
      if (pItem) { loot.push({ id: pItem, qty: 1 }); this.addItem(pItem, 1); }
      if (ground.material) { loot.push({ id: ground.material, qty: 1 }); this.addItem(ground.material, 1); }
      xp += TIERS[ptier].xp;
    }
    // campeão ganha XP extra no duelo: a briga que rende
    if (this.data.sub === "campeao") xp = Math.round(xp * 1.2);
    if (this.data.enchants.avo) xp = Math.round(xp * 1.1);
    this.addSkillXp(ground.continent, 2);
    this.gainXp(xp);
    if (d.boss) {
      this.data.bosses[ground.id] = now();
      this.data.levers[ground.id] = true;
    } else {
      this.data.monsters[monster.id] = now();
    }
    return { xp, loot, item: ITEMS[itemId], boss: d.boss, defeated: 1 + (d.partners || []).filter((p) => p.done).length };
  }

  next() {
    const d = this.duel;
    if (!d) return null;
    if (d.phase === "victory" || d.phase === "defeat") {
      const result = { phase: d.phase, result: d.result, boss: d.boss, monster: d.monster };
      this.duel = null;
      this.combate = null;
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
    d.dicas = 0;
    d.eliminadas = [];
    d.revelada = false;
    return { phase: "question", duel: d };
  }

  flee() {
    if (!this.duel) return;
    this.duel = null;
    this.combate = null;
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

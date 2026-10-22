// O backup da conta: o estado local vira base64 cifrado na DM do jogador.
// Aqui só o que dá para conferir sem rede: o envelope, o que entra e o que
// nunca entra, o dedupe e a volta do estado.
import assert from "node:assert/strict";

const store = new Map();
globalThis.localStorage = {
  getItem: (k) => (store.has(k) ? store.get(k) : null),
  setItem: (k, v) => store.set(k, String(v)),
  removeItem: (k) => store.delete(k),
  clear: () => store.clear(),
};

const { STORAGE, BACKUP } = await import("../src/content/config.js");
const backup = await import("../src/platform/backup.js");

// estado de uma conta com progresso
store.set(STORAGE.name, JSON.stringify("Ada"));
store.set(STORAGE.xp, JSON.stringify(42));
store.set(STORAGE.cards, JSON.stringify(["cs-1", "cs-2"]));
store.set(STORAGE.quests, JSON.stringify({ done: { q1: true }, accepted: { q2: true }, titles: [] }));
store.set(STORAGE.rpg, JSON.stringify({ hp: 30, items: { pocao: 2 }, seen: { slime: { count: 3 } }, monsters: {}, equipped: {} }));
store.set(STORAGE.outfit, JSON.stringify("viajante"));
store.set(STORAGE.explored, "AAAA");
// o que nunca pode sair: a chave e a conversa
store.set(STORAGE.nostr, JSON.stringify({ sk: "a".repeat(64), created: 1 }));
store.set(`${STORAGE.chat}:praca`, "mensagem de outra pessoa");

const snap = backup.collect();
assert.equal(snap.v, 1, "versão do envelope");
assert.equal(snap.name, "Ada", "nome no envelope");
assert.equal(snap.keys.nostr, undefined, "a nsec não entra no backup");
assert.equal(snap.keys.chat, undefined, "o chat não entra no backup");
assert.ok(snap.keys.rpg && snap.keys.xp && snap.keys.cards, "progresso entra no backup");

const text = await backup.encode(snap);
assert.ok(text.startsWith(BACKUP.mark), "marcador do backup no começo da DM");
const round = await backup.decode(text);
assert.equal(round.keys.xp, JSON.stringify(42), "o estado volta igual do envelope");
assert.equal(round.keys.rpg, snap.keys.rpg, "o rpg volta inteiro");
assert.equal(round.keys.nostr, undefined, "decode não inventa a nsec");

assert.equal(await backup.decode("outra coisa"), null, "DM comum não é backup");
assert.equal(await backup.decode(BACKUP.mark + "z:lixo"), null, "base64 inválido é recusado");
assert.equal(await backup.decode(BACKUP.mark + "x:AAAA"), null, "formato desconhecido é recusado");
assert.equal(await backup.decode(BACKUP.mark + "p:" + "A".repeat(BACKUP.max + 10)), null, "backup grande demais é recusado");

// restaurar escreve só o que está na lista
store.clear();
const res = backup.restore(round);
assert.equal(res.ok, true, "restauração aplica o estado");
assert.equal(store.get(STORAGE.xp), JSON.stringify(42), "xp restaurado");
assert.equal(store.get(STORAGE.nostr), undefined, "restauração não cria chave");
assert.equal(store.get(`${STORAGE.chat}:praca`), undefined, "restauração não escreve chat");
assert.equal(backup.restore({ v: 1, keys: {} }).ok, false, "backup vazio não é restaurado");

// conta vazia é exatamente o caso do primeiro boot
assert.equal(backup.localIsEmpty(), false, "conta com progresso não conta como vazia");
store.clear();
assert.equal(backup.localIsEmpty(), true, "conta sem nada é vazia");
store.set(STORAGE.name, JSON.stringify("Nome digitado"));
assert.equal(backup.localIsEmpty(), true, "nome digitado na abertura não é progresso");

// envio: rede falsa, dedupe e volta
const sent = [];
const fakeRede = {
  ready: true,
  pk: "b".repeat(64),
  sendSelf: async (payload) => {
    sent.push(payload);
    return { ok: true, relays: 2 };
  },
  selfSavesRecent: async () => sent.map((t, i) => ({ at: Date.now() + i, text: t })).reverse(),
};
store.set(STORAGE.name, JSON.stringify("Ada"));
store.set(STORAGE.xp, JSON.stringify(42));
const first = await backup.saveTo(fakeRede, { force: true });
assert.equal(first.ok, true, "primeiro backup sai");
assert.equal(sent.length, 1, "uma DM por backup");
const parsed = await backup.decode(sent[0]);
assert.equal(parsed.keys.xp, JSON.stringify(42), "a DM leva o estado de verdade");

const again = await backup.saveTo(fakeRede);
assert.equal(again.skipped, true, "sem mudança não manda de novo");
assert.equal(sent.length, 1, "dedupe segura a DM repetida");

store.set(STORAGE.xp, JSON.stringify(43));
const changed = await backup.saveTo(fakeRede);
assert.equal(changed.ok, true, "mudança de estado manda backup");
assert.equal(sent.length, 2, "entrou uma DM nova");

const off = await backup.saveTo({ ready: false, pk: "" });
assert.equal(off.ok, false, "sem rede não tenta enviar");

const latest = await backup.latestFrom(fakeRede);
assert.equal(latest.keys.xp, JSON.stringify(43), "latestFrom pega o backup mais novo");

// conta nova num navegador novo: o estado volta da DM
store.clear();
const ctrl = backup.createBackup({ rede: fakeRede });
const restored = await ctrl.restoreIfEmpty();
assert.equal(restored.restored, true, "conta vazia restaura da DM");
assert.equal(store.get(STORAGE.xp), JSON.stringify(43), "xp voltou");
assert.equal(store.get(STORAGE.nostr), undefined, "a chave continua sendo a deste navegador");

// conta com progresso não é sobrescrita sozinha
store.set(STORAGE.xp, JSON.stringify(100));
const ctrl2 = backup.createBackup({ rede: fakeRede });
const kept = await ctrl2.restoreIfEmpty();
assert.equal(kept.restored, undefined, "conta com progresso não é trocada no boot");
assert.equal(store.get(STORAGE.xp), JSON.stringify(100), "progresso local continua");

console.log("ok backup da conta na DM: envelope, whitelist, dedupe e restauração");

// A rede demora; uma descoberta durante a espera não pode ser apagada.
store.clear();
let release;
const delayed = { ...fakeRede, selfSavesRecent: () => new Promise(resolve => { release = resolve; }) };
const pending = backup.createBackup({ rede: delayed }).restoreIfEmpty();
store.set(STORAGE.xp, JSON.stringify(7));
release([{ text: sent[0] }]);
assert.equal((await pending).ok, false);
assert.equal(store.get(STORAGE.xp), '7', 'progresso durante a busca do backup é preservado');
for (const progress of [{ skills: { cs: 1 } }, { pets: { gato: { bond: 1 } } }, { spells: { 'runa-cura': true } }]) {
  store.clear(); store.set(STORAGE.rpg, JSON.stringify(progress));
  assert.equal(backup.localIsEmpty(), false, 'perícia, pet e magia são progresso mesmo sem XP');
}
store.clear();
store.set(STORAGE.xp, '91');
store.set(STORAGE.cards, '["local"]');
const originalSet = localStorage.setItem;
let blocked = false;
localStorage.setItem = (key, value) => {
  if (key === STORAGE.xp && !blocked) { blocked = true; throw new Error('quota'); }
  originalSet(key, value);
};
assert.equal(backup.restore(round).ok, false, 'falha parcial não anuncia sucesso');
localStorage.setItem = originalSet;
assert.equal(store.get(STORAGE.xp), '91');
assert.equal(store.get(STORAGE.cards), '["local"]', 'falha desfaz chave que já tinha sido restaurada');

// Restauração é um retrato completo, sem itens/progresso posteriores ao save.
store.clear();
store.set(STORAGE.rpg, '{"items":{"ferro":9}}');
store.set(STORAGE.nostr, 'identidade-local');
assert.equal(backup.restore({v:1, keys:{xp:'12'}}).ok, true);
assert.equal(store.has(STORAGE.rpg), false, 'remove progresso ausente no retrato');
assert.equal(store.get(STORAGE.nostr), 'identidade-local', 'preserva identidade fora do backup');
const intact = new Map(store);
assert.equal(backup.restore({v:1, keys:{xp:'13',cards:'{quebrado'}}).ok, false);
assert.deepEqual(store, intact, 'JSON inválido é recusado antes da primeira escrita');
store.set(STORAGE.steps, '{"walk":true}');
assert.equal(backup.collect().keys.steps, '{"walk":true}', 'primeiros passos fazem parte do backup');
assert.equal((await backup.saveTo({...fakeRede, sendSelf:async()=>{throw Error('offline');}},{force:true})).ok,false);
const unavailable = backup.createBackup({rede:{ready:true,selfSavesRecent:async()=>{throw Error('offline');}}});
assert.equal((await unavailable.restoreFromDm()).ok,false,'erro de rede devolve resposta para reabilitar UI');
store.clear();
assert.equal((await unavailable.restoreIfEmpty()).ok,false,'erro de rede no boot não interrompe entrada');

store.set(STORAGE.quests, '{"stats":{"labs":["cs-circuitos"]}}');
assert.equal(backup.localIsEmpty(),false,'instrumentos explorados impedem restauração automática por cima');
store.clear();
store.set(STORAGE.xp, '55');
store.set(STORAGE.rpg, '{"items":{"ferro":9}}');
const beforeFailedReplacement = new Map(store);
localStorage.setItem = (key,value) => {
  if (key === STORAGE.steps) throw Error('quota');
  originalSet(key,value);
};
assert.equal(backup.restore({v:1,keys:{xp:'2',steps:'{}'}}).ok,false);
localStorage.setItem = originalSet;
assert.deepEqual(store,beforeFailedReplacement,'rollback recupera também chaves removidas do retrato');

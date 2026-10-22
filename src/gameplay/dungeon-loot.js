// ---- tabela de baú -------------------------------------------------------
// A tabela muda pelo tipo de sala e pelo material da caverna. Baú selado
// entrega a relíquia da caverna uma vez, e o baú do chefe tem a sua própria.
export const TABELAS_DE_BAU = {
  entrada: [["pocao", 0.45, 1], ["racao", 0.3, 1], ["veio", 0.25, 1]],
  comum: [["veio", 0.5, 1], ["pocao", 0.35, 1], ["erva", 0.3, 1], ["ferro", 0.25, 1], ["chave", 0.12, 1]],
  cofre: [["chave", 0.55, 1], ["pocao-mana", 0.35, 1], ["veio", 0.35, 1], ["cristal", 0.18, 1]],
  cidade: [["racao", 0.4, 1], ["cafe", 0.3, 1], ["assado", 0.25, 1], ["pocao", 0.3, 1]],
  chefe: [["pocao-mana", 0.5, 1], ["veio", 0.5, 2], ["tocha", 0.3, 1], ["picareta", 0.15, 1]],
};

export function classeDoBau(theme = "", tier = 0) {
  const t = String(theme).toLowerCase();
  if (/trono|chefe|guardi|fundo/.test(t)) return "chefe";
  if (/cofre|chave|senha|segredo|tls|hash|assinatura|cifra|cripto/.test(t)) return "cofre";
  if (/cidade|pra|feira|mercado|porto|cais/.test(t)) return "cidade";
  if (/entrada|boca|escada|portal/.test(t)) return "entrada";
  return tier >= 3 ? "cofre" : "comum";
}

export function lootDoBau({ material, theme, tier = 0, locked = false, relicId = null, temReliquia = true, gearLivre = [] }, rnd = Math.random) {
  const classe = classeDoBau(theme, tier);
  const loot = [{ id: material, qty: locked ? 4 : 2 }];
  for (const [id, chance, qty] of TABELAS_DE_BAU[classe]) {
    // baú selado não devolve a chave: o custo da chave tem que doer um pouco
    if (locked && id === "chave") continue;
    if (rnd() < chance) loot.push({ id, qty });
  }
  // sem chave no selado, e a relíquia só sai uma vez por caverna
  if (locked && relicId && !temReliquia) loot.push({ id: relicId, qty: 1 });
  if (gearLivre.length && rnd() < 0.35) loot.push({ id: gearLivre[Math.floor(rnd() * gearLivre.length)], qty: 1 });
  return loot;
}

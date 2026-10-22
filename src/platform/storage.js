// Antes de qualquer módulo sobrescrever um save que não abre, guarda o texto
// original em "<chave>:bak". Assim um JSON truncado ou de versão antiga não
// vira save vazio sem deixar rastro.
export function backupCorrupt(key) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return;
    JSON.parse(raw);
  } catch {
    try {
      const bak = `${key}:bak`;
      if (!localStorage.getItem(bak)) localStorage.setItem(bak, localStorage.getItem(key));
    } catch { /* sem storage */ }
  }
}

// O JSON pode abrir e ainda ter um tipo incompatível com o consumidor.
export function readSavedJSON(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (raw == null) return fallback;
    const value = JSON.parse(raw);
    if (fallback === null) return value;
    if (Array.isArray(fallback)) return Array.isArray(value) ? value : fallback;
    if (typeof fallback === "object") {
      return value && typeof value === "object" && !Array.isArray(value) ? value : fallback;
    }
    if (typeof value !== typeof fallback) return fallback;
    if (typeof value === "number" && (!Number.isFinite(value) || value < 0)) return fallback;
    return value;
  } catch { return fallback; }
}

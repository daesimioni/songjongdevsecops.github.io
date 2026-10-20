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

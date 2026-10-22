export const normalizeSearch = value => String(value || '').normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim();
export function filterGroupedList(list, query) {
  const terms = normalizeSearch(query).split(/\s+/).filter(Boolean);
  let group = null, foundInGroup = false, count = 0;
  const finish = () => { if (group) group.hidden = !foundInGroup; };
  for (const node of list.children) {
    if (node.classList.contains('travel-group')) {
      finish(); group = node; foundInGroup = false; continue;
    }
    const text = normalizeSearch(node.textContent);
    node.hidden = !terms.every(term => text.includes(term));
    if (!node.hidden) { count++; foundInGroup = true; }
  }
  finish();
  return count;
}

// atalho comum das buscas: sair do campo e entrar no primeiro resultado visível
export function focusFirstVisible(container, selector) {
  if (!container) return false;
  const first = [...container.querySelectorAll(selector)]
    .find((node) => !node.hidden && node.getClientRects().length > 0);
  if (!first) return false;
  first.focus({ preventScroll: true });
  first.scrollIntoView({ block: "nearest" });
  return true;
}

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

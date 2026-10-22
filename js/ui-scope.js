const SELECTOR = 'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';
export function availableFocusTargets(container) {
  return [...container.querySelectorAll(SELECTOR)].filter(node => node.tabIndex >= 0 && !node.closest('[inert]') && node.getClientRects().length > 0);
}
export function createUiScope({ root, getActive, exceptions = [] }) {
  function sync() {
    const active = getActive();
    for (const node of root.children) {
      node.inert = !!active && node !== active && !node.contains(active) && !exceptions.includes(node);
    }
    return active;
  }
  function trap(event) {
    const active = getActive();
    if (!active) return false;
    const items = availableFocusTargets(active);
    const focused = root.ownerDocument.activeElement;
    const first = items[0], last = items.at(-1);
    if (!first) { event.preventDefault(); return true; }
    if (!active.contains(focused) || (!event.shiftKey && focused === last) || (event.shiftKey && focused === first)) {
      event.preventDefault();
      (event.shiftKey ? last : first).focus({ preventScroll: true });
      return true;
    }
    return false;
  }
  return { sync, trap };
}

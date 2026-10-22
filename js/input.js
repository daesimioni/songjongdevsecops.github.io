export function isTextEntry(target) {
  return !!(target?.isContentEditable || target?.closest?.('input, textarea, select, [contenteditable=""], [contenteditable="true"]'));
}
export function nativeActivation(event) {
  return (event.key === 'Enter' || event.key === ' ')
    && !!event.target?.closest?.('button, a[href], summary, [role="button"]');
}

// Cada abertura tem seu próprio nó e sua geração. Imports e montagens lentos
// podem terminar depois de fechar ou trocar a aula, sem tocar na aula atual.
export function createInstrumentLoader({ document, onError = () => {} }) {
  let generation = 0, root = null, cleanup = null;
  function clear() {
    generation++;
    const dispose = cleanup;
    cleanup = null;
    root?.remove();
    root = null;
    try { dispose?.(); } catch (error) { onError(error); }
  }
  async function load(container, loader, context, variant) {
    clear();
    const current = generation;
    const mount = document.createElement('div');
    mount.className = 'instrument-mount';
    root = mount;
    const loading = document.createElement('div');
    loading.className = 'widget-loading';
    loading.textContent = 'acendendo os instrumentos...';
    mount.appendChild(loading);
    container.appendChild(mount);
    try {
      const mod = await loader();
      if (current !== generation) return;
      mount.textContent = '';
      const dispose = await mod.mount(mount, context, variant);
      if (current !== generation) {
        if (typeof dispose === 'function') dispose();
        return;
      }
      cleanup = typeof dispose === 'function' ? dispose : null;
    } catch (error) {
      if (current !== generation) return;
      mount.textContent = '';
      const message = document.createElement('p');
      message.className = 'widget-fail';
      message.textContent = 'O instrumento não carregou agora. O texto continua aqui; recarregue e tente de novo.';
      mount.appendChild(message);
      onError(error);
    }
  }
  return { load, clear };
}

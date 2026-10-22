import { readFileSync } from 'node:fs';
export function readStyles() {
  const entry = readFileSync(new URL('../css/style.css', import.meta.url), 'utf8');
  return entry.replace(/@import url\("([^"\n]+)"\);/g, (_, path) => readFileSync(new URL('../css/' + path, import.meta.url), 'utf8'));
}

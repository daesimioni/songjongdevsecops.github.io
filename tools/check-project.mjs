// Parse and link browser ES modules without executing DOM, network or storage.
import { SourceTextModule } from 'node:vm';
import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, relative, dirname, extname } from 'node:path';
import { fileURLToPath } from 'node:url';
const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const allowed = {
  core: ['core'],
  content: ['content', 'core'],
  rendering: ['rendering', 'content', 'core'],
  platform: ['platform', 'content', 'core'],
  gameplay: ['gameplay', 'platform', 'content', 'core'],
  world: ['world', 'content', 'core'],
  ui: ['ui', 'gameplay', 'platform', 'rendering', 'content', 'core', 'world'],
  app: ['app', 'ui', 'gameplay', 'platform', 'rendering', 'content', 'core', 'world'],
};
export async function inspectProject(projectRoot = root) {
  const errors = [], modules = new Map(), graph = new Map();
  async function walk(dir) {
    for (const item of await readdir(dir, { withFileTypes: true })) {
      const path = resolve(dir, item.name);
      if (item.isDirectory()) await walk(path);
      else if (extname(path) === '.js') {
        const source = await readFile(path, 'utf8');
        modules.set(path, { source, module: new SourceTextModule(source, { identifier: path }) });
      }
    }
  }
  await walk(resolve(projectRoot, 'src'));
  function targetOf(specifier, path) {
    if (!specifier.startsWith('.')) throw new Error(`${relative(projectRoot,path)}: import não local ${specifier}`);
    const target = resolve(dirname(path), specifier);
    if (!modules.has(target)) throw new Error(`${relative(projectRoot,path)}: módulo ausente ${specifier}`);
    return target;
  }
  for (const [path, { source, module }] of modules) {
    const deps = [...module.dependencySpecifiers];
    // Import dinâmico também entra no grafo implantável.
    for (const match of source.matchAll(/\bimport\(\s*['"]([^'"]+)['"]\s*\)/g)) deps.push(match[1]);
    const targets = [];
    for (const specifier of new Set(deps)) {
      try {
        const target = targetOf(specifier, path);
        targets.push(target);
        const owner = relative(resolve(projectRoot, 'src'), path).split('/')[0];
        const dependency = relative(resolve(projectRoot, 'src'), target).split('/')[0];
        if (!allowed[owner]?.includes(dependency)) errors.push(`${relative(projectRoot,path)}: ${owner} não pode depender de ${dependency}`);
      } catch (error) { errors.push(error.message); }
    }
    graph.set(path, targets);
    // Validate relative resource URLs, including the optional fractal WASM.
    for (const match of source.matchAll(/new URL\(\s*['"]([^'"]+)['"]\s*,\s*import\.meta\.url\s*\)/g)) {
      const target = resolve(dirname(path), match[1]);
      try { if (!(await stat(target)).isFile()) throw new Error(); }
      catch { errors.push(`${relative(projectRoot,path)}: recurso ausente ${match[1]}`); }
    }
  }
  // Detect cycles instead of allowing a new ordering-dependent initialization.
  const visiting = new Set(), done = new Set();
  function visit(path, stack = []) {
    if (visiting.has(path)) { errors.push(`Ciclo: ${[...stack,path].map(p=>relative(projectRoot,p)).join(' -> ')}`); return; }
    if (done.has(path)) return;
    visiting.add(path);
    for (const dep of graph.get(path) || []) visit(dep, [...stack,path]);
    visiting.delete(path); done.add(path);
  }
  for (const path of modules.keys()) visit(path);
  // Native linking checks named exports, including modules not used by bootstrap.
  if (!errors.length) for (const { module } of modules.values()) {
    if (module.status === 'unlinked') {
      try { await module.link((specifier, parent) => modules.get(targetOf(specifier,parent.identifier)).module); }
      catch (error) { errors.push(error.message); }
    }
  }
  const html = await readFile(resolve(projectRoot, 'index.html'), 'utf8');
  for (const match of html.matchAll(/(?:src|href)="([^"#?]+)"/g)) {
    if (/^(?:https?:|data:|mailto:)/.test(match[1])) continue;
    try { if (!(await stat(resolve(projectRoot,match[1]))).isFile()) throw new Error(); }
    catch { errors.push(`index.html: recurso ausente ${match[1]}`); }
  }
  const stylesheet = await readFile(resolve(projectRoot,'css/style.css'),'utf8');
  for (const match of stylesheet.matchAll(/@import url\("([^"\n]+)"\);/g)) {
    try { if (!(await stat(resolve(projectRoot,'css',match[1]))).isFile()) throw new Error(); }
    catch { errors.push(`CSS: módulo ausente ${match[1]}`); }
  }
  return { modules: modules.size, imports: [...graph.values()].reduce((n,deps)=>n+deps.length,0), errors };
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const result = await inspectProject();
  if (result.errors.length) { console.error(result.errors.join('\n')); process.exitCode = 1; }
  else console.log(`Estrutura válida: ${result.modules} módulos, ${result.imports} dependências, sem ciclos ou imports inválidos.`);
}

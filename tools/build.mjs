// Static distribution: no bundler, transpiler or runtime dependencies.
import { cp, mkdir, rm, writeFile, readdir, stat, readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
export async function build(root = projectRoot) {
  const output = resolve(root, 'dist');
  await rm(output, { recursive:true, force:true });
  await mkdir(output, { recursive:true });
  for (const entry of ['index.html', 'sprites.html', 'src', 'assets', 'wasm', 'LICENSE']) {
    await cp(resolve(root,entry), resolve(output,entry), { recursive:true });
  }
  await mkdir(resolve(output,'css'));
  const entry = await readFile(resolve(root,'css/style.css'), 'utf8');
  let bundled = entry;
  for (const match of entry.matchAll(/@import url\("([^"\n]+)"\);/g)) {
    bundled = bundled.replace(match[0], await readFile(resolve(root,'css',match[1]), 'utf8'));
  }
  await writeFile(resolve(output,'css/style.css'), bundled);
  // GitHub Pages must serve ES module directories as static files.
  await writeFile(resolve(output,'.nojekyll'), '');
  let files = 0, bytes = 0;
  async function count(dir) {
    for (const item of await readdir(dir, { withFileTypes:true })) {
      const path = resolve(dir,item.name);
      if (item.isDirectory()) await count(path);
      else { files++; bytes += (await stat(path)).size; }
    }
  }
  await count(output);
  console.log(`Distribuição: ${files} arquivos, ${(bytes/1024/1024).toFixed(2)} MiB em dist/`);
  return output;
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await build();

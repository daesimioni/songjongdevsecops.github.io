import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
import { build } from '../tools/build.mjs';
import { createStaticServer } from '../tools/serve.mjs';
const root = await mkdtemp(join(tmpdir(),'valley-project-'));
let server;
try {
  for (const dir of ['src/core','src/ui','assets','wasm','css']) await mkdir(join(root,dir),{recursive:true});
  await writeFile(join(root,'index.html'),'<link rel="stylesheet" href="css/style.css"><script type="module" src="src/core/example.js"></script>');
  await writeFile(join(root,'LICENSE'),'license');
  await writeFile(join(root,'src/core/example.js'),'export const example = 1;');
  await writeFile(join(root,'src/ui/example.js'),'export const ui = 1;');
  await writeFile(join(root,'css/style.css'),'@import url("./base.css");');
  await writeFile(join(root,'css/base.css'),':root { color: red; }');
  await writeFile(join(root,'private.txt'),'must not ship');
  const checker = new URL('../tools/check-project.mjs',import.meta.url).href;
  function inspect() {
    return JSON.parse(execFileSync(process.execPath,['--experimental-vm-modules','--input-type=module','-e',`import {inspectProject} from ${JSON.stringify(checker)}; console.log(JSON.stringify(await inspectProject(${JSON.stringify(root)})));`],{encoding:'utf8',stdio:['ignore','pipe','pipe']}));
  }
  assert.deepEqual(inspect().errors,[]);
  await writeFile(join(root,'src/core/example.js'),'import {ui} from "../ui/example.js"; export const example = ui;');
  assert.ok(inspect().errors.some(e=>e.includes('core não pode depender de ui')));
  await writeFile(join(root,'src/core/example.js'),'import {missing} from "./absent.js";');
  assert.ok(inspect().errors.some(e=>e.includes('módulo ausente')));
  await writeFile(join(root,'src/core/example.js'),'import {missing} from "./other.js"; export const example = missing;');
  await writeFile(join(root,'src/core/other.js'),'export const other = 1;');
  assert.ok(inspect().errors.some(e=>e.includes('does not provide an export')));
  await writeFile(join(root,'src/core/other.js'),'import "./example.js"; export const missing=1;');
  assert.ok(inspect().errors.some(e=>e.startsWith('Ciclo:')));
  await writeFile(join(root,'src/core/example.js'),'export const example = 1;');
  await rm(join(root,'src/core/other.js'));
  const output = await build(root);
  const builtCSS = await readFile(join(output,'css/style.css'),'utf8');
  assert.ok(builtCSS.includes('color: red'));assert.ok(!builtCSS.includes('@import'));
  await assert.rejects(readFile(join(output,'private.txt')));
  server = createStaticServer(output);
  await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
  const base = `http://127.0.0.1:${server.address().port}`;
  assert.equal((await fetch(base)).status,200);
  assert.match((await fetch(base+'/src/core/example.js')).headers.get('content-type'),/javascript/);
  assert.equal((await fetch(base+'/private.txt')).status,404);
  assert.equal((await fetch(base+'/package.json')).status,404);
  assert.equal((await fetch(base+'/src/core/example.js',{method:'HEAD'})).status,200);
  assert.equal((await fetch(base,{method:'POST'})).status,405);
} finally {
  if(server) await new Promise(resolve=>server.close(resolve));
  await rm(root,{recursive:true,force:true});
}
console.log('ok ferramentas: imports, camadas, ciclos, exports, CSS reunido e distribuição HTTP');

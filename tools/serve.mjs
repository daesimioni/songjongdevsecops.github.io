import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { resolve, dirname, extname, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const publicRoots = new Set(['index.html', 'src', 'css', 'assets', 'wasm']);
const mime = { '.html':'text/html; charset=utf-8', '.js':'text/javascript; charset=utf-8', '.mjs':'text/javascript; charset=utf-8', '.css':'text/css; charset=utf-8', '.svg':'image/svg+xml', '.png':'image/png', '.gif':'image/gif', '.wasm':'application/wasm', '.json':'application/json' };
export function createStaticServer(root = projectRoot) {
  const allowed = new Set([...publicRoots, ...(root === projectRoot ? ['tools', 'docs'] : [])]);
  return createServer(async (request, response) => {
    if (!['GET', 'HEAD'].includes(request.method)) { response.writeHead(405, { Allow:'GET, HEAD' }).end(); return; }
    try {
      const url = new URL(request.url, 'http://localhost');
      const path = decodeURIComponent(url.pathname === '/' ? '/index.html' : url.pathname);
      const target = resolve(root, '.' + path);
      const first = path.split('/')[1];
      if (!target.startsWith(root + sep) || !allowed.has(first)) { response.writeHead(404).end(); return; }
      if (!(await stat(target)).isFile()) { response.writeHead(404).end(); return; }
      const body = await readFile(target);
      response.writeHead(200, { 'Content-Type':mime[extname(target)] || 'application/octet-stream', 'Cache-Control':'no-store', 'X-Content-Type-Options':'nosniff' });
      response.end(request.method === 'HEAD' ? undefined : body);
    } catch (error) { response.writeHead(error instanceof URIError ? 400 : 404).end(); }
  });
}
if (process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const port = Number(process.env.PORT || 4173);
  if (!Number.isInteger(port) || port < 1 || port > 65535) throw new Error('PORT deve estar entre 1 e 65535');
  const server = createStaticServer();
  server.on('error', error => { console.error(error.message); process.exitCode = 1; });
  server.listen(port, '127.0.0.1', () => console.log(`The Learning Valley: http://127.0.0.1:${port}`));
}

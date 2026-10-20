// Conferência estática da casca: ids, imports, botões, rótulos e atributos de
// acessibilidade. Roda sem navegador: node test/ui.test.mjs
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..");
const html = fs.readFileSync(path.join(root, "index.html"), "utf8");
const jsFiles = [];
function walk(dir) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) walk(full);
    else if (entry.name.endsWith(".js")) jsFiles.push(full);
  }
}
walk(path.join(root, "js"));

const faults = [];
const check = (cond, message) => { if (!cond) faults.push(message); };

// ids únicos e todos os alvos existentes
const ids = [...html.matchAll(/\bid="([^"]+)"/g)].map((m) => m[1]);
const idSet = new Set(ids);
check(idSet.size === ids.length, `ids repetidos no index.html: ${ids.filter((id, i) => ids.indexOf(id) !== i).join(", ")}`);

// ids criados em tempo de execução por módulos (documentados aqui de propósito)
const dynamicIds = new Set(["rede-msgs", "pvp-timer"]);
const referenced = new Set();
for (const file of jsFiles) {
  const source = fs.readFileSync(file, "utf8");
  for (const m of source.matchAll(/\$\("([^"]+)"\)/g)) referenced.add(m[1]);
  for (const m of source.matchAll(/getElementById\("([^"]+)"\)/g)) referenced.add(m[1]);
}
for (const id of referenced) {
  check(idSet.has(id) || dynamicIds.has(id), `js referencia #${id}, que não existe no index.html`);
}

// imports relativos resolvem e exportam o que prometem
const exportsByFile = new Map();
for (const file of jsFiles) {
  const source = fs.readFileSync(file, "utf8");
  const names = new Set();
  for (const m of source.matchAll(/export\s+(?:async\s+)?function\s+([A-Za-z_$][\w$]*)/g)) names.add(m[1]);
  for (const m of source.matchAll(/export\s+(?:const|let|var|class)\s+([A-Za-z_$][\w$]*)/g)) names.add(m[1]);
  for (const m of source.matchAll(/export\s*\{([^}]+)\}/g)) {
    for (const raw of m[1].split(",")) {
      const name = raw.trim().split(/\s+as\s+/)[0];
      if (name) names.add(name);
    }
  }
  exportsByFile.set(path.normalize(file), names);
}
for (const file of jsFiles) {
  const source = fs.readFileSync(file, "utf8");
  for (const m of source.matchAll(/import\s*\{([^}]+)\}\s*from\s*"([^"]+)"/g)) {
    const [, names, spec] = m;
    if (!spec.startsWith(".")) continue;
    const target = path.normalize(path.join(path.dirname(file), spec));
    check(exportsByFile.has(target), `${path.relative(root, file)} importa ${spec}, que não existe`);
    if (!exportsByFile.has(target)) continue;
    for (const raw of names.split(",")) {
      const name = raw.trim().split(/\s+as\s+/)[0];
      if (!name) continue;
      check(exportsByFile.get(target).has(name), `${path.relative(root, file)} importa ${name} de ${spec}, mas não há export`);
    }
  }
}

// botões, imagens, links e rótulos
for (const m of html.matchAll(/<button\b([^>]*)>/g)) {
  check(/\btype="/.test(m[1]), `botão sem type: ${m[0].slice(0, 70)}`);
}
for (const m of html.matchAll(/<img\b([^>]*)>/g)) {
  check(/\balt="/.test(m[1]), `imagem sem alt: ${m[0].slice(0, 70)}`);
}
for (const m of html.matchAll(/<a\b([^>]*target="_blank"[^>]*)>/g)) {
  check(/\brel="/.test(m[1]), `link _blank sem rel: ${m[0].slice(0, 70)}`);
}
for (const m of html.matchAll(/<label\b([^>]*)for="([^"]+)"/g)) {
  check(idSet.has(m[2]), `label aponta para #${m[2]}, que não existe`);
}
for (const m of html.matchAll(/aria-labelledby="([^"]+)"/g)) {
  for (const id of m[1].split(/\s+/)) check(idSet.has(id), `aria-labelledby aponta para #${id}, que não existe`);
}
for (const m of html.matchAll(/data-close="([^"]+)"/g)) {
  check(idSet.has(m[1]), `botão fecha #${m[1]}, que não existe`);
}

// nenhum handler inline e nenhum console.log esquecido
for (const m of html.matchAll(/\son(?:click|submit|change|input)="/g)) {
  faults.push(`handler inline no HTML: ${m[0]}`);
}
for (const file of jsFiles) {
  const source = fs.readFileSync(file, "utf8");
  check(!/console\.log\(/.test(source), `${path.relative(root, file)} tem console.log esquecido`);
}

assert.equal(faults.length, 0, `casca com ${faults.length} problema(s):\n- ${faults.join("\n- ")}`);
console.log("ok casca: ids, imports, botões, rótulos, aria e handlers");

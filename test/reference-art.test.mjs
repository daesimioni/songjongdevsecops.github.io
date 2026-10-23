import test from "node:test";
import assert from "node:assert/strict";
import { gzipSync } from "node:zlib";
import { createHash } from "node:crypto";
import {
  referenceRecipe,
  referenceFrame,
  parseReferenceId,
} from "../src/content/reference-art/recipes.js";
import { createReferenceLibrary } from "../src/platform/reference-art.js";
import { referenceBodies } from "../src/content/reference-art/bodies.js";
const row = [
  "1234567890abcdef1234",
  Buffer.alloc(128, 0x11).toString("base64"),
  1,
  false,
  "fisico",
  "wolf",
  "quadruped",
  "",
];
function fixture() {
  const encoded = Buffer.from(gzipSync(JSON.stringify([row]))).toString(
      "base64",
    ),
    payload = Buffer.from(encoded),
    descriptor = {
      file: "criaturas-0000.json.gz.txt",
      first: row[0],
      last: row[0],
      count: 1,
      bytes: payload.length,
      decodedBytes: Buffer.byteLength(JSON.stringify([row])),
      sha256: createHash("sha256").update(payload).digest("hex"),
    };
  return {
    payload,
    manifest: {
      version: 2,
      grid: 16,
      pageSize: 1024,
      recipes: 1,
      references: 2,
      categories: { criaturas: { count: 1, pages: [descriptor] } },
    },
  };
}
test("receitas validam dados e expõem oito vistas, poses e corpos separados", () => {
  const a = referenceRecipe("criaturas", row);
  assert.equal(a.grid.length, 256);
  assert.equal(a.orientations.length, 8);
  assert.equal(a.states.length, 5);
  assert.equal(referenceFrame(a, 850, "walk"), 0);
  assert.equal(referenceFrame(a, 85000, "death"), 7);
  assert.ok(referenceBodies(a)[0].hw > 0);
  assert.deepEqual(referenceBodies(referenceRecipe("componentes", row)), []);
  assert.throws(() =>
    referenceRecipe("criaturas", [...row.slice(0, 2), 99, ...row.slice(3)]),
  );
  assert.throws(() => parseReferenceId("arte/../../secret"));
  assert.throws(() => referenceFrame(a, 0, "ausente"));
});
test("carregador é preguiçoso, reúne chamadas, verifica hash e recupera falhas", async () => {
  const { manifest, payload } = fixture();
  let calls = 0,
    fail = false,
    corrupt = false;
  const fetcher = async (url) => {
    calls++;
    if (url.pathname.endsWith("manifest.json")) return Response.json(manifest);
    if (fail) {
      fail = false;
      return new Response("", { status: 503 });
    }
    const copy = Buffer.from(payload);
    if (corrupt) copy[20] ^= 1;
    return new Response(copy);
  };
  const library = createReferenceLibrary({ fetcher });
  assert.equal(calls, 0);
  await library.manifest();
  const [a, b] = await Promise.all([
    library.page("criaturas", 0),
    library.page("criaturas", 0),
  ]);
  assert.equal(a, b);
  assert.equal(calls, 2);
  assert.ok(Object.isFrozen(a));
  assert.equal((await library.asset("arte/criaturas/" + row[0])).key, row[0]);
  assert.equal(
    await library.asset("arte/criaturas/00000000000000000000"),
    null,
  );
  library.clear();
  fail = true;
  await assert.rejects(library.page("criaturas", 0), /Falha/);
  await library.page("criaturas", 0);
  library.clear();
  corrupt = true;
  await assert.rejects(library.page("criaturas", 0), /Integridade/);
  corrupt = false;
  await library.page("criaturas", 0);
  assert.ok(library.stats().bytes <= library.stats().maxBytes);
  const empty = createReferenceLibrary({ fetcher, maxBytes: 0 });
  await empty.page("criaturas", 0);
  assert.equal(empty.stats().pages, 0);
});
test("catálogo de atualização mantém manifesto e deixa pacotes sob demanda", async () => {
  const { arquivosDaVersao } = await import("../tools/versao.mjs");
  const { fileURLToPath } = await import("node:url");
  const files = arquivosDaVersao(
    fileURLToPath(new URL("../", import.meta.url)),
  );
  assert.ok(files.includes("assets/reference-art/manifest.json"));
  assert.ok(
    !files.some(
      (p) => p.startsWith("assets/reference-art/") && p.endsWith(".txt"),
    ),
  );
});

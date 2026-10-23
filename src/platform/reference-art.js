import {
  parseReferenceId,
  referenceRecipe,
  CATEGORIES,
} from "../content/reference-art/recipes.js";
export function createReferenceLibrary({
  base = new URL("../../assets/reference-art/manifest.json", import.meta.url),
  fetcher = fetch,
  maxPages = 8,
  maxBytes = 4 * 1024 * 1024,
} = {}) {
  const cache = new Map(),
    pending = new Map();
  let catalog = null,
    bytes = 0,
    epoch = 0;
  async function manifest() {
    if (!catalog)
      catalog = (async () => {
        const r = await fetcher(new URL("manifest.json", base), {
          cache: "no-cache",
        });
        if (!r.ok) throw new Error("Catálogo indisponível");
        const m = await r.json();
        if (
          m.version !== 2 ||
          m.grid !== 16 ||
          m.pageSize !== 1024 ||
          !Number.isSafeInteger(m.recipes) ||
          !Number.isSafeInteger(m.references) ||
          m.references < m.recipes
        )
          throw new Error("Catálogo inválido");
        let total = 0;
        for (const [category, group] of Object.entries(m.categories)) {
          if (
            !CATEGORIES.includes(category) ||
            !Number.isSafeInteger(group.count) ||
            !Array.isArray(group.pages)
          )
            throw new Error("Categoria inválida");
          let count = 0,
            previous = "";
          for (const p of group.pages) {
            if (
              !new RegExp("^" + category + "-[0-9]{4}\\.json\\.gz\\.txt$").test(
                p.file,
              ) ||
              !/^[a-f0-9]{20}$/.test(p.first) ||
              !/^[a-f0-9]{20}$/.test(p.last) ||
              p.first > p.last ||
              p.first <= previous ||
              !Number.isSafeInteger(p.count) ||
              p.count < 1 ||
              p.count > 1024 ||
              !Number.isSafeInteger(p.bytes) ||
              p.bytes < 1 ||
              p.bytes > 1024 * 1024 ||
              !Number.isSafeInteger(p.decodedBytes) ||
              p.decodedBytes < 1 ||
              p.decodedBytes > 1024 * 1024 ||
              !/^[a-f0-9]{64}$/.test(p.sha256)
            )
              throw new Error("Página inválida");
            previous = p.last;
            count += p.count;
            Object.freeze(p);
          }
          if (count !== group.count) throw new Error("Contagem inválida");
          total += count;
          Object.freeze(group.pages);
          Object.freeze(group);
        }
        if (total !== m.recipes) throw new Error("Total inválido");
        Object.freeze(m.categories);
        return Object.freeze(m);
      })().catch((e) => {
        catalog = null;
        throw e;
      });
    return catalog;
  }
  async function page(category, index) {
    const m = await manifest(),
      p = m.categories[category]?.pages[index];
    if (!p) throw new Error("Página inexistente");
    if (cache.has(p.file)) {
      const entry = cache.get(p.file);
      cache.delete(p.file);
      cache.set(p.file, entry);
      return entry.rows;
    }
    if (pending.has(p.file)) return pending.get(p.file);
    const generation = epoch;
    const job = (async () => {
      const url = new URL(p.file, base);
      url.searchParams.set("v", p.sha256.slice(0, 16));
      const response = await fetcher(url);
      if (!response.ok) throw new Error("Falha no pacote");
      const encoded = await response.arrayBuffer();
      if (encoded.byteLength !== p.bytes) throw new Error("Pacote incompleto");
      const hash = Array.from(
        new Uint8Array(await crypto.subtle.digest("SHA-256", encoded)),
        (v) => v.toString(16).padStart(2, "0"),
      ).join("");
      if (hash !== p.sha256) throw new Error("Integridade inválida");
      const compressed = Uint8Array.from(
        atob(new TextDecoder().decode(encoded)),
        (c) => c.charCodeAt(0),
      );
      const reader = new Response(compressed).body
          .pipeThrough(new DecompressionStream("gzip"))
          .getReader(),
        chunks = [];
      let length = 0;
      try {
        for (;;) {
          const { done, value } = await reader.read();
          if (done) break;
          length += value.length;
          if (length > p.decodedBytes) {
            await reader.cancel();
            throw new Error("Limite de descompressão excedido");
          }
          chunks.push(value);
        }
      } finally {
        reader.releaseLock();
      }
      if (length !== p.decodedBytes) throw new Error("Tamanho inválido");
      const buffer = new Uint8Array(length);
      let at = 0;
      for (const c of chunks) {
        buffer.set(c, at);
        at += c.length;
      }
      const rows = JSON.parse(
        new TextDecoder("utf8", { fatal: true }).decode(buffer),
      );
      if (
        !Array.isArray(rows) ||
        rows.length !== p.count ||
        rows[0]?.[0] !== p.first ||
        rows.at(-1)?.[0] !== p.last
      )
        throw new Error("Índice inválido");
      let previous = "";
      for (const row of rows) {
        referenceRecipe(category, row);
        if (row[0] <= previous) throw new Error("Ordem inválida");
        previous = row[0];
        Object.freeze(row);
      }
      Object.freeze(rows);
      if (generation === epoch && length <= maxBytes && maxPages > 0) {
        while (
          cache.size &&
          (cache.size >= maxPages || bytes + length > maxBytes)
        ) {
          const key = cache.keys().next().value;
          bytes -= cache.get(key).bytes;
          cache.delete(key);
        }
        cache.set(p.file, { rows, bytes: length });
        bytes += length;
      }
      return rows;
    })();
    pending.set(p.file, job);
    try {
      return await job;
    } finally {
      if (pending.get(p.file) === job) pending.delete(p.file);
    }
  }
  async function asset(id) {
    const { category, key } = parseReferenceId(id),
      m = await manifest(),
      pages = m.categories[category]?.pages || [];
    let lo = 0,
      hi = pages.length - 1;
    while (lo <= hi) {
      const mid = (lo + hi) >> 1,
        p = pages[mid];
      if (key < p.first) hi = mid - 1;
      else if (key > p.last) lo = mid + 1;
      else {
        const rows = await page(category, mid),
          row = rows.find((r) => r[0] === key);
        return row ? referenceRecipe(category, row) : null;
      }
    }
    return null;
  }
  return Object.freeze({
    manifest,
    page,
    asset,
    clear() {
      epoch++;
      cache.clear();
      pending.clear();
      bytes = 0;
    },
    stats: () => ({ pages: cache.size, bytes, maxPages, maxBytes }),
  });
}

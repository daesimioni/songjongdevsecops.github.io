export const MATERIALS = Object.freeze([
  "",
  "#8c9698",
  "#a77948",
  "#83664d",
  "#648a58",
  "#698aa1",
  "#458eae",
  "#91d2ce",
  "#637480",
  "#d9b56c",
  "#b98662",
  "#dbd3b0",
  "#9e88af",
  "#e99a45",
  "#cfbf8c",
  "#abd2d8",
]);
export const CATEGORIES = Object.freeze([
  "criaturas",
  "componentes",
  "terrenos",
  "magias",
  "efeitos",
  "projeteis",
  "interface",
  "cartografia",
  "vegetacao",
  "equipamentos",
  "armas",
  "construcoes",
  "mobilia",
  "alimentos",
  "documentos",
  "recipientes",
  "recursos",
  "vazios",
]);
export const STATES = Object.freeze(["idle", "walk", "attack", "hit", "death"]);
export const BASES = Object.freeze({
  cadeira: "kit/mobiliario/cadeira",
  "mesa-jantar": "kit/mobiliario/mesa-jantar",
  "cama-solteiro": "kit/mobiliario/cama-solteiro",
  "estante-livros": "kit/mobiliario/estante-livros",
  armario: "kit/mobiliario/armario",
  "barril-medio": "kit/armazenamento/barril-medio",
  "caixote-medio": "kit/armazenamento/caixote-medio",
  carvalho: "kit/natureza/carvalho",
  samambaia: "kit/natureza/samambaia",
  "parede-pedra": "kit/arquitetura/parede-pedra",
  "porta-madeira": "kit/arquitetura/porta-madeira",
  "telhado-telha": "kit/arquitetura/telhado-telha",
  "pilha-livros": "kit/armazenamento/pilha-livros",
});
export function parseReferenceId(id) {
  const pieces = typeof id === "string" ? id.split("/") : [];
  if (
    pieces.length !== 3 ||
    pieces[0] !== "arte" ||
    !CATEGORIES.includes(pieces[1]) ||
    !/^[a-f0-9]{20}$/.test(pieces[2])
  )
    throw new Error("Identificador de arte inválido");
  return { category: pieces[1], key: pieces[2] };
}
export function referenceRecipe(category, row) {
  if (!CATEGORIES.includes(category) || !Array.isArray(row) || row.length !== 8)
    throw new Error("Receita inválida");
  const [key, encoded, ratio, animated, sourceElement, species, family, motif] =
    row;
  let element = sourceElement;
  parseReferenceId(`arte/${category}/${key}`);
  if (
    !Number.isFinite(ratio) ||
    ratio < 0.25 ||
    ratio > 4 ||
    typeof animated !== "boolean" ||
    ![element, species, family, motif].every(
      (s) => typeof s === "string" && s.length < 50,
    ) ||
    ![
      "fogo",
      "gelo",
      "morte",
      "terra",
      "energia",
      "agua",
      "vento",
      "veneno",
      "luz",
      "fisico",
    ].includes(element)
  )
    throw new Error("Metadados inválidos");
  let packed;
  try {
    packed = atob(encoded);
  } catch {
    throw new Error("Grade inválida");
  }
  if (packed.length !== 128) throw new Error("Dimensão da grade inválida");
  const grid = Object.freeze(
    Array.from(packed, (c) => [
      c.charCodeAt(0) >> 4,
      c.charCodeAt(0) & 15,
    ]).flat(),
  );
  if (
    element === "fisico" &&
    ["efeitos", "projeteis", "magias"].includes(category)
  ) {
    const counts = new Map();
    for (const m of grid) if (m) counts.set(m, (counts.get(m) || 0) + 1);
    const dominant = [...counts].sort((a, b) => b[1] - a[1])[0]?.[0];
    element =
      {
        13: "fogo",
        15: "gelo",
        6: "agua",
        5: "energia",
        12: "morte",
        9: "luz",
        4: "terra",
      }[dominant] || element;
  }
  const actor = category === "criaturas",
    effect = ["efeitos", "projeteis", "magias"].includes(category);
  return Object.freeze({
    id: `arte/${category}/${key}`,
    category,
    key,
    seed: parseInt(key.slice(0, 8), 16),
    grid,
    ratio,
    animated,
    element,
    species,
    family,
    motif,
    label: `${motif ? motif.replaceAll("-", " ") : { criaturas: "Habitante", componentes: "Módulo", magias: "Selo", efeitos: "Manifestação", projeteis: "Disparo", terrenos: "Revestimento", recursos: "Ornamento", vegetacao: "Planta", mobilia: "Móvel", construcoes: "Estrutura", equipamentos: "Proteção", armas: "Armamento", alimentos: "Provisão", documentos: "Códice", recipientes: "Recipiente", cartografia: "Carta", interface: "Elemento", vazios: "Espaço transparente" }[category] || category} · ${element} · ${key.slice(0, 5)}`,
    frames:
      actor ||
      effect ||
      animated ||
      category === "vegetacao" ||
      (category === "terrenos" && ["agua", "fogo", "veneno"].includes(element))
        ? 8
        : 1,
    ms: 100,
    states: actor ? STATES : null,
    orientations: Object.freeze(
      [
        "interface",
        "cartografia",
        "alimentos",
        "documentos",
        "vazios",
      ].includes(category)
        ? [0]
        : actor || effect || ["armas", "equipamentos"].includes(category)
          ? [0, 1, 2, 3, 4, 5, 6, 7]
          : [0, 1, 2, 3],
    ),
  });
}
export function referenceFrame(a, time = 0, state = "idle") {
  if (a.states && !a.states.includes(state)) throw new Error("Pose inválida");
  const tick = Math.floor(Math.max(0, Number.isFinite(time) ? time : 0) / a.ms),
    loop = a.states
      ? ["idle", "walk"].includes(state)
      : !["efeitos", "projeteis"].includes(a.category);
  return loop ? tick % a.frames : Math.min(a.frames - 1, tick);
}

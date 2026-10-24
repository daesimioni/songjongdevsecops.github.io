// Utilidades de nome que sobraram do catálogo antigo: artigo, título e rótulo.
// Ficam aqui porque a identidade das áreas (bioma, fauna, item e caverna) usa
// as três para montar nomes sem depender de texto de estudo.

const SMALL = new Set(["e", "de", "da", "do", "das", "dos", "em", "no", "na", "nos", "nas", "a", "o", "as", "os", "um", "uma", "para", "com", "por", "ao", "à"]);

export const titleCase = (text) => String(text || "").split(/\s+/).map((word, i) => {
  const clean = word.toLowerCase();
  if (word.length <= 5 && word === word.toUpperCase() && /[A-Z]/.test(word)) return word;
  if (i > 0 && SMALL.has(clean)) return clean;
  return clean.charAt(0).toUpperCase() + clean.slice(1);
}).join(" ");

// artigo da área, para "Cripta dos Fundamentos" e não "Cripta da Fundamentos"
export function articleOf(name) {
  const m = /^Área (de|da|das|do|dos) (.+)$/.exec(String(name || ""));
  if (m) return { article: m[1], noun: m[2] };
  return { article: "da", noun: String(name || "").replace(/^Área /, "") };
}

export const topicLabel = (text) => String(text || "").trim().replace(/[.;:]$/, "").trim();

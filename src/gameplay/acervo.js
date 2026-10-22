// Acervo da Biblioteca Afogada: as três alas abertas pela corrente de sete
// missões. Conceitos são as páginas de estação; Lore são as áreas e as
// cavernas; Prática são os treinos por continente. A função é pura para o
// teste medir as listas sem DOM.
import { SITES, AREAS, CONTINENTS, CONTINENT_ORDER } from "../content/config.js";
import { DUNGEONS } from "../content/dungeon-data.js";

export const ALAS = [
  { id: "conceitos", nome: "Conceitos", desc: "as 454 páginas de estação, por continente" },
  { id: "lore", nome: "Lore", desc: "as 86 áreas e as 93 cavernas do vale" },
  { id: "pratica", nome: "Prática", desc: "treino por continente, sem dano" },
];

const semAcento = (texto) => String(texto).normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

export function itensDaAla(ala) {
  if (ala === "conceitos") {
    return SITES.filter((site) => site.post).map((site) => ({
      id: `post:${site.post}`,
      nome: site.name,
      sub: CONTINENTS[site.continent]?.name || site.continent,
      tipo: "post",
      post: site.post,
      continente: site.continent,
    }));
  }
  if (ala === "lore") {
    return [
      ...AREAS.map((area) => ({
        id: `area:${area.id}`,
        nome: area.name,
        sub: "área",
        tipo: "area",
        categoria: "mundo",
        continente: area.continent,
      })),
      ...DUNGEONS.map((def) => ({
        id: `caverna:${def.id}`,
        nome: def.name,
        sub: CONTINENTS[def.continent]?.name || "caverna",
        tipo: "caverna",
        categoria: "cavernas",
        continente: def.continent,
      })),
    ];
  }
  if (ala === "pratica") {
    return CONTINENT_ORDER.filter((c) => c !== "hub").map((c) => ({
      id: `treino:${c}`,
      nome: `Treino de ${CONTINENTS[c]?.name || c}`,
      sub: "sem dano",
      tipo: "treino",
      continente: c,
    }));
  }
  return [];
}

export function filtrarAcervo(itens, texto) {
  const q = semAcento(texto).trim();
  if (!q) return itens;
  return itens.filter((item) => semAcento(`${item.nome} ${item.sub}`).includes(q));
}

export function resumoDaAla(ala) {
  const itens = itensDaAla(ala);
  return { total: itens.length, ala: ALAS.find((a) => a.id === ala) || null };
}

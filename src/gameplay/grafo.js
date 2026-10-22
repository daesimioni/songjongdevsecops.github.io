// Grafo de pré-requisitos entre áreas. A trilha é a numeração das seções do
// catálogo (1.1 antes de 1.2, 4.1 antes de 4.2): a aresta não é inventada, ela
// vem da ordem em que o curso apresenta as áreas. O caderno usa as arestas para
// avisar quando o jogador avança numa área sem o degrau anterior.
import { IDENTITY_AREAS } from "../content/identity.js";

export function chaveDeSecao(num) {
  if (typeof num !== "string" || !/^\d+(?:\.\d+)*$/.test(num)) return null;
  return num.split(".").map(Number);
}

export function compararSecao(a, b) {
  const ka = chaveDeSecao(a);
  const kb = chaveDeSecao(b);
  if (!ka || !kb) return 0;
  const n = Math.max(ka.length, kb.length);
  for (let i = 0; i < n; i++) {
    const d = (ka[i] ?? 0) - (kb[i] ?? 0);
    if (d) return d;
  }
  return 0;
}

export function grafoDeAreas(areas = IDENTITY_AREAS) {
  const grupos = new Map();
  for (const area of areas) {
    if (!area?.id) continue;
    const grupo = area.discipline || area.continent || "geral";
    if (!grupos.has(grupo)) grupos.set(grupo, []);
    grupos.get(grupo).push(area);
  }
  const grafo = new Map();
  for (const lista of grupos.values()) {
    const ordenada = [...lista].sort((a, b) => compararSecao(a.num, b.num));
    for (let i = 1; i < ordenada.length; i++) grafo.set(ordenada[i].id, [ordenada[i - 1].id]);
  }
  return grafo;
}

export const GRAFO = grafoDeAreas();
const AREAS_POR_ID = new Map(IDENTITY_AREAS.map((area) => [area.id, area]));

// Áreas em que o jogador já está (domínio 2+) mas o pré-requisito ficou para
// trás (0 ou 1). O caderno lê isso como "revise antes".
export function pontosFracos(conceitos, { grafo = GRAFO, areas = AREAS_POR_ID, limite = 5 } = {}) {
  const dominio = (id) => Math.max(0, Math.min(5, Number(conceitos?.[id]?.n) || 0));
  const avisos = [];
  for (const [area, pre] of grafo) {
    const dArea = dominio(area);
    const dPre = dominio(pre[0]);
    if (dArea < 2 || dPre >= 2) continue;
    avisos.push({
      area,
      pre: pre[0],
      dArea,
      dPre,
      nome: areas.get(area)?.name || area,
      nomePre: areas.get(pre[0])?.name || pre[0],
    });
  }
  return avisos.sort((a, b) => b.dArea - a.dArea || a.dPre - b.dPre).slice(0, Math.max(1, Math.min(20, limite)));
}

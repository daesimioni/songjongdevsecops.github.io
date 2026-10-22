import { kitAsset, kitColliders } from "./catalog.js";
const item = (category, slug, x, y, options = {}) => ({
  id: `kit/${category}/${slug}`,
  x,
  y,
  ...options,
});
// Examples use world tiles and exact sprite anchors. They do not modify a save.
export const KIT_BLUEPRINTS = {
  oficina: [
    item("oficios", "bancada", 0, 0),
    item("oficios", "bigorna", 2, 0),
    item("oficios", "forja", 4, 0),
    item("armazenamento", "pilha-toras", 0, 2),
    item("armazenamento", "rack-armas", 4, 2),
  ],
  biblioteca: [
    item("mobiliario", "estante-livros", 0, 0),
    item("mobiliario", "estante-livros", 2, 0),
    item("mobiliario", "mesa-jantar", 1, 3),
    item("mobiliario", "cadeira", 1, 4),
    item("aprendizado", "globo", 4, 2),
  ],
  laboratorio: [
    item("aprendizado", "alambique", 0, 0),
    item("aprendizado", "balanca", 2, 0),
    item("aprendizado", "computador", 4, 0),
    item("aprendizado", "servidor", 6, 0),
  ],
  fazenda: [
    item("agricultura", "trigo-maduro", 0, 0),
    item("agricultura", "milho-maduro", 1, 0),
    item("agricultura", "abobora-maduro", 2, 0),
    item("agricultura", "espantalho", 3, 0),
    item("agricultura", "bebedouro", 1, 2),
    item("agricultura", "colmeia", 4, 2),
  ],
  praca: [
    item("comunidade", "fonte", 0, 0),
    item("mobiliario", "banco-longo", -3, 0),
    item("comunidade", "quadro-avisos", 3, 0),
    item("comunidade", "poste-luz", 0, 3),
  ],
  acampamento: [
    item("comunidade", "barraca", 0, 0),
    item("comunidade", "carroca", 3, 0),
    item("armazenamento", "bau", 0, 2),
    item("armazenamento", "barril-medio", 3, 2),
  ],
  salaDeMusica: [
    item("aprendizado", "piano", 0, 0),
    item("aprendizado", "harpa", 3, 0),
    item("aprendizado", "tambor", 5, 0),
    item("aprendizado", "estante-musical", 3, 2),
  ],
};
export function placeBlueprint(name, { x = 0, y = 0 } = {}) {
  const source = KIT_BLUEPRINTS[name];
  if (!source) throw new Error(`Modelo desconhecido: ${name}`);
  return source.map((p) => {
    if (!kitAsset(p.id)) throw new Error(`Peça desconhecida: ${p.id}`);
    return {
      ...p,
      x: p.x + x,
      y: p.y + y,
      colliders: kitColliders(p.id, p.x + x, p.y + y, p),
    };
  });
}

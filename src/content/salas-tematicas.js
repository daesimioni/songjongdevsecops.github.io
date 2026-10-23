// Sala temática de cada caverna: a disciplina ganha um cômodo com a cara dela.
// A forja (oficina), a biblioteca e o observatório são cenário, não estação:
// ficam encostados na parede da sala escolhida e não fecham caminho.
export const TEMA_DA_SALA = {
  cs: "oficina",
  chem: "oficina",
  math: "biblioteca",
  lingua: "biblioteca",
  music: "biblioteca",
  hub: "biblioteca",
  physics: "observatorio",
  ai: "observatorio",
  inter: "observatorio",
};

// escolhe a sala do meio da planta, longe da boca, da cidade e do chefe
export function salaTematica(def) {
  if (!def || !Array.isArray(def.rooms)) return null;
  const boss = def.layout?.bossRoom;
  const candidatas = def.rooms.filter((r) =>
    r.kind !== "entrance" && r.kind !== "city" && r.id !== boss && r.w >= 6 && r.h >= 5);
  if (!candidatas.length) return null;
  // A escolha antiga era o terceiro item da lista e caía na sala "c" em todas
  // as 93 cavernas. Agora é a sala mais central da planta: o desenho muda com
  // o modelo, então o cômodo temático também muda.
  const largura = Number(def.layout?.width) || 64;
  const altura = Number(def.layout?.height) || 48;
  const distancia = (r) => Math.hypot(r.x + r.w / 2 - largura / 2, r.y + r.h / 2 - altura / 2);
  const sala = [...candidatas].sort((a, b) => distancia(a) - distancia(b) || a.id.localeCompare(b.id))[0];
  const tipo = TEMA_DA_SALA[def.continent] || "biblioteca";
  return { tipo, room: sala };
}

// Salas dos três veios de cristal. A sala temática e a do chefe ficam de fora:
// antes o veio nascia a um tile da peça de cenário e as duas coisas se
// encostavam no canto. Se a temática ocupar a/c/e, o veio vai para a próxima
// sala livre, sem perder a conta de três por caverna.
export function salasDosVeios(def) {
  if (!def || !Array.isArray(def.rooms)) return [];
  const tema = salaTematica(def)?.room?.id;
  const boss = def.layout?.bossRoom;
  const ordem = ["a", "c", "e", "b", "d", "g", "h", "f"];
  return ordem
    .filter((id) => id !== tema && id !== boss && def.rooms.some((r) => r.id === id))
    .slice(0, 3);
}

// três peças encostadas nas paredes: canto alto esquerdo, canto alto direito e
// canto baixo direito. O centro da sala fica livre para o combate.
export function propsDaSala(def) {
  const alvo = salaTematica(def);
  if (!alvo) return [];
  const { tipo, room } = alvo;
  // as três peças conversam com o jogador (F): cada uma dá algo uma vez por
  // descida, e o miolo da sala continua livre para o combate
  return [
    { kind: tipo, x: room.x + 2.2, y: room.y + 1.4, special: true, interact: true },
    { kind: tipo, x: room.x + room.w - 2.2, y: room.y + 1.4, special: true, interact: true },
    { kind: tipo, x: room.x + room.w - 2.2, y: room.y + room.h - 1.4, special: true, interact: true },
  ];
}

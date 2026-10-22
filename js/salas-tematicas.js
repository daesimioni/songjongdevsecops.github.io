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
  const sala = candidatas[Math.min(2, candidatas.length - 1)];
  const tipo = TEMA_DA_SALA[def.continent] || "biblioteca";
  return { tipo, room: sala };
}

// três peças encostadas nas paredes: canto alto esquerdo, canto alto direito e
// canto baixo direito. O centro da sala fica livre para o combate.
export function propsDaSala(def) {
  const alvo = salaTematica(def);
  if (!alvo) return [];
  const { tipo, room } = alvo;
  return [
    { kind: tipo, x: room.x + 2.2, y: room.y + 1.4, special: true },
    { kind: tipo, x: room.x + room.w - 2.2, y: room.y + 1.4, special: true },
    { kind: tipo, x: room.x + room.w - 2.2, y: room.y + room.h - 1.4, special: true },
  ];
}

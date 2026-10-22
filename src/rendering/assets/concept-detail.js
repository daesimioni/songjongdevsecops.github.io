export const CONCEPT_MATERIALS = Object.freeze({
  antenna: "metal",
  bell: "metal",
  bench: "wood",
  book: "paper",
  bubble: "glass",
  coil: "metal",
  compass: "metal",
  crane: "metal",
  crate: "wood",
  crystal: "glass",
  die: "stone",
  flask: "glass",
  gauge: "metal",
  gull: "feather",
  lamp: "metal",
  lens: "glass",
  lock: "metal",
  mask: "cloth",
  mast: "wood",
  metronome: "wood",
  molecule: "glass",
  mushroom: "organic",
  node: "metal",
  note: "metal",
  orb: "glass",
  petal: "organic",
  pillar: "stone",
  quill: "feather",
  rack: "wood",
  shard: "glass",
  sign: "wood",
  speaker: "metal",
  star: "metal",
  synapse: "glass",
  terminal: "metal",
  wave: "glass",
});
export function detailConcept(g, type) {
  const material = CONCEPT_MATERIALS[type];
  if (!material) throw new Error(`Conceito sem material: ${type}`);
  g.save();
  g.globalCompositeOperation = "source-atop";
  if (material === "wood" || material === "paper") {
    g.fillStyle = "#bda37a";
    for (let i = 0; i < 5; i++) g.fillRect(-6 + i * 3, -5, 0.5, 3);
    g.fillStyle = "#243142";
    g.fillRect(-6, 1, 12, 0.5);
  } else if (material === "metal") {
    g.fillStyle = "#e1d8bc";
    for (const x of [-5, 5])
      for (const y of [-5, 4]) g.fillRect(x, y, 0.5, 0.5);
    g.fillStyle = "#2b3a50";
    g.fillRect(4, -6, 0.5, 7);
  } else if (material === "glass") {
    g.fillStyle = "rgba(240,250,225,.65)";
    g.fillRect(-4, -7, 0.5, 4);
    g.fillRect(-3, -8, 2, 0.5);
    g.fillStyle = "rgba(13,28,46,.3)";
    g.fillRect(4, -1, 0.5, 4);
  } else if (material === "stone") {
    g.fillStyle = "#869496";
    g.fillRect(-5, -7, 3, 0.5);
    g.fillRect(-4, -2, 0.5, 3);
    g.fillStyle = "#283447";
    g.fillRect(2, 3, 3, 0.5);
  } else if (material === "organic" || material === "feather") {
    g.fillStyle = "#c4d0a1";
    for (let i = 0; i < 5; i++) g.fillRect(-4 + i * 2, -4 + (i % 3), 1, 0.5);
  } else {
    g.fillStyle = "#cbb894";
    for (let i = 0; i < 5; i++) g.fillRect(-4 + i * 2, 4, 0.5, 0.5);
  }
  g.restore();
}

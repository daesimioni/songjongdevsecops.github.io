// Companhia do aventureiro: bichos (pets) e montarias.
//
// Cada bicho tem um passivo e uma habilidade ativa com mana e recarga; cada
// montaria troca velocidade por outro conforto. Um pet e uma montaria ficam
// ativos por vez, e é a escolha que dá propósito: não existe bicho que serve
// para tudo. Os bichos são domados na cidade subterrânea do continente onde
// vivem, com três rações; as montarias são compradas no cais.


export const BOND_MAX = 3;
export const MANA_MS = 45000;

export const PETS = {
  gato: {
    name: "Gato do Porto",
    kind: "cat",
    continent: "cs",
    where: "Cidade do Núcleo",
    passive: { hp: 5, sight: 1 },
    ability: { id: "faro", name: "faro", mana: 2, cd: 60000, desc: "mostra o ponto fraco: o próximo golpe acerta" },
  },
  coruja: {
    name: "Coruja do Lema",
    kind: "owl",
    continent: "math",
    where: "Cidade do Cálculo",
    passive: { sight: 2 },
    ability: { id: "sabedoria", name: "sabedoria", mana: 4, cd: 180000, desc: "lê a fraqueza: o próximo golpe soma 2 e não desvia" },
  },
  sapo: {
    name: "Sapo de Calcário",
    kind: "frog",
    continent: "physics",
    where: "Cidade das Órbitas",
    passive: { hp: 8 },
    ability: { id: "cura", name: "cura", mana: 3, cd: 120000, desc: "recupera 20 de vida" },
  },
  vaga: {
    name: "Vaga-lume de Vidro",
    kind: "wisp",
    continent: "chem",
    where: "Cidade das Moléculas",
    passive: { manaMax: 2 },
    ability: { id: "mana", name: "pulso", mana: 0, cd: 90000, desc: "devolve 3 de mana, de graça, a cada 90 segundos" },
  },
  grilo: {
    name: "Grilo do Compasso",
    kind: "cricket",
    continent: "music",
    where: "Praça da Ópera",
    passive: { manaHit: 1 },
    ability: { id: "ritmo", name: "ritmo", mana: 2, cd: 150000, desc: "+1 de dano por dois minutos" },
  },
  papagaio: {
    name: "Papagaio do Vale",
    kind: "parrot",
    continent: "lingua",
    where: "Praça da Gramática",
    passive: { hp: 3, sight: 1 },
    ability: { id: "tagarela", name: "tagarela", mana: 3, cd: 120000, desc: "distrai os bichos por dois segundos" },
  },
  sombra: {
    name: "Sombra da Caixa",
    kind: "shade",
    continent: "ai",
    where: "Cidade das Máquinas",
    passive: { damage: 1 },
    ability: { id: "aviso", name: "aviso", mana: 1, cd: 90000, desc: "arma um escudo contra o próximo golpe" },
  },
};

export const PET_BY_CONTINENT = {
  cs: "gato",
  math: "coruja",
  physics: "sapo",
  chem: "vaga",
  music: "grilo",
  ai: "sombra",
  lingua: "papagaio",
};

export const MOUNTS = {
  cavalo: {
    name: "Cavalo do Cais",
    speed: 1.5,
    price: { ferro: 4, erva: 2 },
    desc: "o mais rápido da grama e da estrada. Não entra em caverna.",
  },
  lobo: {
    name: "Lobo Cinza",
    speed: 1.3,
    sight: 1,
    price: { ferro: 3, veio: 2 },
    desc: "um pouco mais lento, mas enxerga longe no escuro.",
  },
  tartaruga: {
    name: "Tartaruga de Vidro",
    speed: 1.12,
    hp: 5,
    price: { veio: 3, erva: 3 },
    desc: "devagar, porém o casco segura +5 de vida.",
  },
};

export function petById(id) {
  return PETS[id] || null;
}

export function mountById(id) {
  return MOUNTS[id] || null;
}


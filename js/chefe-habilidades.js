// Habilidade própria de cada chefe: a fase 2 deixa de ser só "dano maior".
// A escolha é determinística pelo id do chefe, então o mesmo chefe sempre
// revela a mesma habilidade e o jogador pode aprender o padrão.
export const HABILIDADES = [
  {
    id: "couraca",
    nome: "couraça viva",
    nota: "A armadura come 1 ponto de cada golpe seu enquanto ele está ferido.",
  },
  {
    id: "seiva",
    nome: "seiva amarga",
    nota: "Cada erro seu devolve 2 de vida a ele enquanto ele está ferido.",
  },
  {
    id: "impeto",
    nome: "ímpeto cego",
    nota: "Ferido, ele bate mais forte: o erro dói 2 a mais.",
  },
  {
    id: "espelho",
    nome: "espelho partido",
    nota: "O primeiro erro da fase 2 é engolido pelo espelho.",
  },
];

// hash estável e barato: o id do chefe é único por masmorra
export function habilidadeDoChefe(monster) {
  const chave = String(monster?.id || monster?.name || "chefe");
  let h = 0;
  for (let i = 0; i < chave.length; i++) h = (h * 31 + chave.charCodeAt(i)) >>> 0;
  return HABILIDADES[h % HABILIDADES.length];
}

// dano que o jogador causa no chefe, já com a couraça da fase 2
export function danoDoJogador(habilidadeId, fase, dano) {
  if (habilidadeId === "couraca" && (fase || 1) >= 2) return Math.max(1, dano - 1);
  return dano;
}

// dano extra que o erro custa por causa do ímpeto
export function extraDoErro(habilidadeId, fase) {
  return habilidadeId === "impeto" && (fase || 1) >= 2 ? 2 : 0;
}

// vida do chefe depois da seiva
export function curaDoChefe(habilidadeId, fase, atual, max) {
  if (habilidadeId !== "seiva" || (fase || 1) < 2) return atual;
  return Math.min(max, atual + 2);
}

// o espelho segura um erro por duelo, só a partir da fase 2
export function espelhoDoChefe(habilidadeId, fase, usado) {
  return habilidadeId === "espelho" && (fase || 1) >= 2 && !usado;
}

export function notaDaHabilidade(habilidade) {
  return habilidade ? `${habilidade.nome}: ${habilidade.nota}` : "";
}

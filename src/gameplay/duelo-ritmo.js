// Ritmo do duelo: a sequência de acertos vira dano extra, com teto de +2, e a
// leitura de turno diz quanto o erro deve doer antes da pessoa escolher.
// Fica fora do rpg e do render para poder ser medido sem navegador.
export const RITMO_MAX = 2;

export function bonusDeRitmo(seguidos = 0) {
  if (seguidos >= 5) return 2;
  if (seguidos >= 3) return 1;
  return 0;
}

export function leituraDeRitmo(seguidos = 0) {
  if (seguidos >= 5) return `ritmo ${seguidos}: +2 de dano`;
  if (seguidos >= 3) return `ritmo ${seguidos}: +1 de dano`;
  if (seguidos === 2) return "2 acertos: o terceiro fecha o ritmo (+1 dano)";
  return "";
}

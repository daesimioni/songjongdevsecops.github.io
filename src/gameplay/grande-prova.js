// A Grande Prova: o evento de três fases que fecha a Biblioteca Afogada. O
// combate usa o chefe de três fases; depois da vitória o jogador escolhe o
// desfecho, e a escolha fica no save. Não há exame, nota nem reprovação.
export const GUARDIAO = {
  id: "guardiao-acervo",
  name: "Guardião do Acervo",
  kind: "tome",
  tier: 3,
  level: 12,
  theme: "biblioteca",
};

// O chão do evento: a biblioteca é de língua, e o chefe luta na arena como
// qualquer outro. `dungeon: true` libera o chefe sem depender de alavanca.
export const GROUND_ACERVO = {
  id: "acervo",
  continent: "lingua",
  theme: "biblioteca",
  name: "Biblioteca Afogada",
  dungeon: true,
  bossLoot: "pergaminho",
  loot: ["letra", "verso", "estrofe"],
  material: "tinta",
};

export const DESFECHOS = [
  {
    id: "guardar",
    nome: "Guardar o acervo",
    titulo: "Guardião do Acervo",
    texto: "Fechar a porta e conservar o que a Iara deixou. O vale continua ouvindo o que já sabe.",
  },
  {
    id: "devolver",
    nome: "Devolver ao vale",
    titulo: "O que Devolveu a Voz",
    texto: "Abrir as estantes às ilhas. O que estava afogado volta a circular, com o risco de se perder de novo.",
  },
  {
    id: "abrir",
    nome: "Abrir a todas as ilhas",
    titulo: "O que Abriu a Porta",
    texto: "A Biblioteca deixa de ter dono. Qualquer um lê, copia e contesta; o acervo vira praça.",
  },
];

export function desfechoPorId(id) {
  return DESFECHOS.find((d) => d.id === id) || null;
}

export function estadoDaProva(data) {
  const g = data?.grandeProva;
  if (!g || typeof g !== "object" || !desfechoPorId(g.escolha)) return null;
  return { escolha: g.escolha, at: Number(g.at) || 0 };
}

// Grava o desfecho uma vez; a segunda escolha não sobrescreve a primeira.
export function registrarDesfecho(data, escolha, agora = Date.now()) {
  if (!data || typeof data !== "object") return null;
  if (estadoDaProva(data)) return null;
  const desfecho = desfechoPorId(escolha);
  if (!desfecho) return null;
  data.grandeProva = { escolha: desfecho.id, at: Number(agora) || Date.now() };
  return desfecho;
}

export function nomeDoDesfecho(escolha) {
  return desfechoPorId(escolha)?.nome || "";
}

// Marca de resultado sem depender de cor: verde e rosa não chegam para todo
// mundo, então a alternativa certa ganha ✓ e a errada escolhida ganha ✗.
export function marcaDaOpcao(fase, indice, resposta, ultimaEscolha) {
  if (fase !== "feedback" || !Number.isInteger(resposta)) return "";
  if (indice === resposta) return "✓";
  if (indice === ultimaEscolha) return "✗";
  return "";
}

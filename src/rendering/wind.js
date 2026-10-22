// O vento do vale. Uma frente de rajada atravessa o mapa: a fase depende da
// posição, então o vento chega numa faixa, passa e volta, em vez de cada folha
// tremer sozinha. A pedra do lugar decide a força e a velocidade: fibra e papel
// batem forte, cristal e ferro quase não mexem.
const MOOD_POR_MATERIAL = {
  fibra: { forca: 1.35, velocidade: 1.25 },
  papel: { forca: 1.2, velocidade: 1.15 },
  pergaminho: { forca: 1.1, velocidade: 1.05 },
  tinta: { forca: 1, velocidade: 1 },
  giz: { forca: 0.9, velocidade: 0.95 },
  "ardósia": { forca: 0.75, velocidade: 0.9 },
  "cerâmica": { forca: 0.85, velocidade: 0.9 },
  "ébano": { forca: 0.6, velocidade: 0.75 },
  cobre: { forca: 0.7, velocidade: 0.85 },
  "latão": { forca: 0.7, velocidade: 0.85 },
  ferro: { forca: 0.55, velocidade: 0.8 },
  "silício": { forca: 0.5, velocidade: 0.8 },
  vidro: { forca: 0.45, velocidade: 0.7 },
  cristal: { forca: 0.35, velocidade: 0.65 },
  obsidiana: { forca: 0.3, velocidade: 0.6 },
  "âmbar": { forca: 0.4, velocidade: 0.7 },
};

const PADRAO = { forca: 1, velocidade: 1 };

export function windMood(material) {
  return MOOD_POR_MATERIAL[material] || PADRAO;
}

// Rajada em [0,1]. A frente anda em diagonal e o quadrado deixa o pico curto:
// quase todo o tempo é calmo, e de vez em quando a faixa inteira verga junto.
export function gustAt(x, y, time, mood = PADRAO) {
  const forca = mood.forca ?? 1;
  const velocidade = mood.velocidade ?? 1;
  const fase = (x * 0.19 + y * 0.11) * 2.1 - time * 0.00035 * 9 * velocidade;
  const frente = Math.sin(fase);
  const curta = Math.max(0, frente);
  return Math.min(1, curta * curta * forca);
}

// Deslocamento lateral que a folha, a copa ou a água recebem, em pixels. A
// direção troca devagar, para o vale não parecer ventania de um lado só.
export function swayAt(x, y, time, mood = PADRAO) {
  const direcao = Math.sin(time * 0.00006 + 1.3) >= 0 ? 1 : -1;
  const rajada = gustAt(x, y, time, mood);
  const tremor = Math.sin(time * 0.0016 + x * 0.9 + y * 0.6) * 0.35;
  return direcao * (rajada * 2.4 + tremor);
}

// A onda do mar: fase própria, mais lenta que o vento e com duas direções, para
// a crista viajar de lado em vez de pulsar no lugar.
export function ondaAt(x, y, time) {
  const a = Math.sin((x * 0.55 + y * 0.85) - time * 0.0022);
  const b = Math.sin((x * 0.21 - y * 0.34) - time * 0.0011 + 1.7) * 0.5;
  return (a + b) / 1.5;
}

// Espuma da costa: respira mais devagar que a crista.
export function espumaAt(x, y, time) {
  return 0.5 + Math.sin(time * 0.0013 + x * 0.7 + y * 0.5) * 0.5;
}

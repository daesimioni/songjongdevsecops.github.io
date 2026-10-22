import { PET_BY_CONTINENT, PETS } from "../content/pets.js";
// A praça da capital subterrânea, em três faixas: serviços no alto, mesa no
// meio, horta e forja embaixo. Sai numa função pura para o teste medir o vão
// de cada peça sem abrir navegador.
export function pracaDaCaverna(def, city) {
  const props = [];
  const alta = city.y + 3.0;
  const meia = city.y + 5.6;
  const baixa = city.y + 7.8;
  props.push({ kind: "altar", x: city.x + city.w * 0.13, y: baixa, label: "altar que devolve vida", interact: true });
  props.push({ kind: "forge", x: city.x + city.w * 0.87, y: baixa, label: "forja do subsolo", interact: true });
  props.push({ kind: "waystone", x: city.x + city.w * 0.25, y: alta, label: "pedra de retorno", interact: true });
  if (!def.hub) props.push({ kind: "conurbation", x: city.x + city.w * 0.75, y: alta, label: "túnel da conurbação", interact: true });
  props.push({ kind: "keeper", x: city.x + city.w * 0.63, y: baixa, label: "conversar com a mestra", interact: true });
  props.push({ kind: "enchanter", x: city.x + city.w * 0.5, y: alta, label: "mesa de encantamento", interact: true });
  const petId = PET_BY_CONTINENT[def.continent] || "gato";
  props.push({
    kind: "pet",
    petId,
    x: city.x + city.w * 0.18,
    y: meia,
    label: `oferecer ração ao ${PETS[petId]?.name || "bicho"}`,
    interact: true,
  });
  for (let i = 0; i < 3; i++) {
    props.push({
      kind: "plot",
      x: city.x + city.w * 0.3 + i * 2.2,
      y: baixa,
      plotKey: `${def.id}:${i}`,
      planted: false,
      readyAt: 0,
      interact: true,
      label: "horta de ervas",
    });
  }
  if (!def.hub) props.push({
    kind: "stairs",
    x: city.x + city.w * 0.2,
    y: city.y + city.h - 1.4,
    stairMouth: "far",
    label: "subir pelo túnel até a outra boca",
    interact: true,
  });
  return props;
}

// Objetos do subsolo compartilham material, contorno e poses com o mundo.

// A mesma lista atende proximidade, clique e testes das plantas das casas.
export function houseTargets(room, props = []) {
  if (!room) return [];
  const targets = [
    {kind:"porta",obj:{...room.door,name:"porta da casa"},radius:1.5,hitRadius:1.1},
    {kind:"mesa",obj:{...room.mesa,name:"mesa de estudo"},radius:1.7,hitRadius:1.2},
    {kind:"lareira",obj:{...room.lareira,name:"fogueira"},radius:1.7,hitRadius:1.2},
  ];
  const resident = props.find(p => p.tipo === "morador");
  if (resident) targets.push({kind:"morador",obj:{...resident,name:"morador"},radius:1.7,hitRadius:1.2});
  return targets;
}

export function nextResidentLine(house, area) {
  if (!house.frasesMorador) {
    house.frasesMorador = [
      `${area?.name || "Esta área"}: ${area?.sub || "o assunto que dá nome à casa"}.`,
      "A mesa ali estuda; o fogo ali descansa. A casa é sua enquanto você estiver aqui.",
      "Quem mora aqui aprendeu no caminho, não no livro. A pedra lá fora conta o resto.",
    ];
    house.falaMorador = 0;
  }
  const index = house.falaMorador || 0;
  const text = house.frasesMorador[index];
  house.falaMorador = (index + 1) % house.frasesMorador.length;
  return text;
}

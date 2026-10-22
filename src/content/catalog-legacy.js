// As subáreas das doze seções que já tinham área feita à mão. Em vez de ilha
// nova, as estações entram na ilha que já existe, longe do farol, do NPC, da
// clareira de caçada e das duas estações antigas.

import { CATALOG, DISCIPLINES } from "./catalog.js";
import { SECTION_TOPICS } from "./catalog-topics.js";
import { ICONS, articleOf, labFor, subareaBody, titleCase, topicLabel, trilhas } from "./catalog-text.js";
import { placeStations } from "./catalog-place.js";
import { SECAO_TEXT } from "./text/secoes.js";
import { licaoDeLegado } from "./text/licoes-legado.js";

const dentroDoRetangulo = (rect, p) =>
  p.x >= rect.x - 1 && p.x <= rect.x + rect.w + 1 && p.y >= rect.y - 1 && p.y <= rect.y + rect.h + 1;

// Pergunta de seção: a página mostra a prática e a armadilha do caminho, e a
// pergunta cobra exatamente esse texto. As alternativas vêm de outras seções,
// então dá para conferir lendo a página.
const SECAO_KEYS = Object.keys(SECAO_TEXT);
function quizDeSecao(num, secaoNome, pagina, campo, salt) {
  const texto = SECAO_TEXT[num];
  if (!texto?.[campo]) return null;
  const certa = texto[campo];
  // distratores do mesmo tamanho: alternativa curta ao lado de uma longa
  // entrega a resposta pelo tamanho
  const outras = SECAO_KEYS
    .filter((k) => k !== String(num) && SECAO_TEXT[k][campo])
    .map((k) => SECAO_TEXT[k][campo])
    .sort((a, b) => Math.abs(a.length - certa.length) - Math.abs(b.length - certa.length));
  const opcoes = [certa];
  for (const alt of outras) {
    if (opcoes.length >= 4) break;
    if (!opcoes.includes(alt)) opcoes.push(alt);
  }
  if (opcoes.length < 4) return null;
  const pos = (salt * 7) % opcoes.length;
  [opcoes[0], opcoes[pos]] = [opcoes[pos], opcoes[0]];
  const pratica = campo === "pratica";
  return {
    q: `${pratica ? "Prática" : "Armadilha"} em ${pagina} (${secaoNome}): segundo a página, qual é a ${pratica ? "prática recomendada" : "armadilha apontada"}?`,
    options: opcoes,
    a: opcoes.indexOf(certa),
    why: `A página ${pratica ? "recomenda" : "aponta"}: ${certa}`,
  };
}

export function buildLegacyContent({ areas, sites, waystones, npcSpawns }) {
  const posts = {};
  const novos = [];
  const questions = [];

  for (const area of areas) {
    const secaoArea = CATALOG.find((c) => c.existing === area.id);
    if (!secaoArea) continue;
    const secao = SECTION_TOPICS[secaoArea.num];
    if (!secao) continue;
    const discipline = DISCIPLINES[secaoArea.discipline] || DISCIPLINES.math;
    const { noun } = articleOf(area.name);

    const reservados = [];
    for (const s of sites) if (dentroDoRetangulo(area.rect, s)) reservados.push(s);
    const pedra = waystones.find((w) => w.id === area.id);
    if (pedra) reservados.push(pedra);
    for (const n of npcSpawns) if (dentroDoRetangulo(area.rect, n)) reservados.push(n);
    if (area.hunt) reservados.push(area.hunt);

    const lista = [];
    let tierDaArea = 0;
    if (secao.subareas?.length) {
      const posicoes = placeStations(area.land, secao.subareas.length, reservados);
      secao.subareas.forEach(([nome, topicos], i) => lista.push({
        nome, topicos, trilha: false, pos: posicoes[i],
      }));
    } else if (secao.topics?.length) {
      const grupos = trilhas(secao.topics, 3);
      const posicoes = placeStations(area.land, grupos.length, reservados);
      grupos.forEach((topicos, i) => lista.push({
        nome: topicLabel(topicos[0]), topicos, trilha: true, pos: posicoes[i],
      }));
    }

    lista.forEach((item, i) => {
      const id = `${area.id}-t${i + 1}`;
      const nome = titleCase(item.nome);
      const pos = item.pos || { x: pedra?.x ?? area.land.cx, y: pedra?.y ?? area.land.cy };
      novos.push({
        id,
        continent: area.continent,
        name: nome,
        label: nome,
        x: pos.x,
        y: pos.y,
        post: id,
        accent: area.accent,
        icon: (ICONS[secaoArea.discipline] || ICONS.inter)[i % 6],
        minor: true,
        catalog: true,
        legacy: true,
      });
      const trilhaTexto = SECAO_TEXT[secaoArea.num];
      // a página da trilha também é curso de seis partes: a abertura da seção
      // entra no lugar da abertura padrão, e a prática e a armadilha da seção
      // continuam na página porque a pergunta cobra exatamente esse texto
      const extraTrilha = item.trilha && trilhaTexto
        ? { abre: `${trilhaTexto.abre} <strong>Trilha ${i + 1} de ${lista.length}.</strong> Esta parte da seção <strong>${secao.name}</strong> reúne os tópicos abaixo.`, pratica: trilhaTexto.pratica, erro: trilhaTexto.erro }
        : null;
      const corpo = subareaBody({
        sectionNum: secaoArea.num,
        sectionName: secao.name,
        discipline: secaoArea.discipline,
        name: item.nome,
        topics: item.topicos,
        siblings: lista.map((x) => x.nome),
        catalogId: secaoArea.id,
        licao: licaoDeLegado(area.id, item.nome),
        extra: extraTrilha,
      });
      posts[id] = {
        kicker: `${discipline.name.toLowerCase()} · ${noun.toLowerCase()}`,
        title: nome,
        date: "2026-10-20",
        read: "2 min",
        tags: [discipline.name.toLowerCase(), noun.toLowerCase()],
        continent: area.continent,
        lab: labFor(`${item.nome} ${item.topicos.join(" ")}`, secaoArea.discipline, i),
        body: corpo,
      };
      // a página de seção cobra a prática e a armadilha que ela mesma mostra
      for (const [campo, salto] of [["pratica", i * 3 + 1], ["erro", i * 5 + 2]]) {
        const q = quizDeSecao(secaoArea.num, secao.name, nome, campo, salto);
        if (!q) continue;
        questions.push({ continent: area.continent, area: area.id, tier: (tierDaArea++) % 3 + 1, q });
      }
    });
  }

  return { sites: novos, posts, questions };
}

// As subáreas das doze seções que já tinham área feita à mão. Em vez de ilha
// nova, as estações entram na ilha que já existe, longe do farol, do NPC, da
// clareira de caçada e das duas estações antigas.

import { CATALOG, DISCIPLINES } from "./catalog.js";
import { SECTION_TOPICS } from "./catalog-topics.js";
import { ICONS, articleOf, labFor, subareaBody, subareaQuiz, titleCase, topicLabel, trilhaQuiz, trilhas } from "./catalog-text.js";
import { placeStations } from "./catalog-place.js";
import { SECAO_TEXT } from "./text/secoes.js";

const dentroDoRetangulo = (rect, p) =>
  p.x >= rect.x - 1 && p.x <= rect.x + rect.w + 1 && p.y >= rect.y - 1 && p.y <= rect.y + rect.h + 1;

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
    let gruposTrilha = null;
    if (secao.subareas?.length) {
      const posicoes = placeStations(area.land, secao.subareas.length, reservados);
      secao.subareas.forEach(([nome, topicos], i) => lista.push({
        nome, topicos, trilha: false, pos: posicoes[i],
      }));
    } else if (secao.topics?.length) {
      const grupos = trilhas(secao.topics, 3);
      gruposTrilha = grupos;
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
      const trilhaTexto = item.trilha ? SECAO_TEXT[secaoArea.num] : null;
      const corpo = item.trilha
        ? `${trilhaTexto ? `<p>${trilhaTexto.abre}</p>` : ""}<p><strong>Trilha ${i + 1} de ${lista.length}.</strong> Esta parte da seção <strong>${secao.name}</strong> reúne os tópicos abaixo.</p><ul>${item.topicos.map((t) => `<li>${t}</li>`).join("")}</ul>${trilhaTexto ? `<p><strong>Prática:</strong> ${trilhaTexto.pratica}</p><p><strong>Erro comum:</strong> ${trilhaTexto.erro}</p>` : ""}`
        : subareaBody({
            sectionNum: secaoArea.num,
            sectionName: secao.name,
            discipline: secaoArea.discipline,
            name: item.nome,
            topics: item.topicos,
            siblings: lista.map((x) => x.nome),
            catalogId: secaoArea.id,
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
      if (item.trilha) {
        const quizzes = trilhaQuiz({ sectionName: secao.name, groups: gruposTrilha || [], index: i, salt: i * 5 + 1 });
        for (const q of quizzes) questions.push({ continent: area.continent, area: area.id, tier: (i % 3) + 1, q });
      } else {
        const quizzes = subareaQuiz({
          sectionNum: secaoArea.num,
          sectionName: secao.name,
          discipline: secaoArea.discipline,
          subarea: { name: item.nome, topics: item.topicos },
          siblings: lista.map((x) => x.nome),
          salt: i * 5 + 3,
        });
        for (const q of quizzes) questions.push({ continent: area.continent, area: area.id, tier: (i % 3) + 1, q });
      }
    });
  }

  return { sites: novos, posts, questions };
}

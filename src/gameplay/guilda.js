// A guilda é local: fundação com nome e brasão, sede com quadro de membros e
// cargos, missões que leem o save e um diário do que aconteceu. Sem servidor:
// quem entra é a party, que já usa o convite assinado da Rede.
export const BRASOES = [
  { id: "iara", nome: "A Iara", cor: "#8fe3cf" },
  { id: "farol", nome: "O Farol", cor: "#ffd479" },
  { id: "livro", nome: "O Livro", cor: "#9ecbff" },
  { id: "engrenagem", nome: "A Engrenagem", cor: "#ff9e7a" },
];

export const CARGOS = [
  { id: "lider", nome: "líder" },
  { id: "oficial", nome: "oficial" },
  { id: "membro", nome: "membro" },
];

export const LIMITE_MEMBROS = 8;

// As missões da guilda leem o que o vale já registra: não inventam contador.
export const MISSOES_GUILDA = [
  {
    id: "fundar",
    titulo: "Fundar a sede",
    meta: 1,
    premio: "1 pergaminho",
    progresso: ({ fundada, membros }) => (fundada && membros > 0 ? 1 : 0),
  },
  {
    id: "recrutar",
    titulo: "Recrutar três companheiros",
    meta: 3,
    premio: "1 pergaminho",
    progresso: ({ membros }) => Math.max(0, membros - 1),
  },
  {
    id: "missoes",
    titulo: "Concluir cinco missões do vale",
    meta: 5,
    premio: "2 pergaminhos",
    progresso: ({ questsDone }) => Math.min(5, questsDone),
  },
  {
    id: "chefe",
    titulo: "Derrubar um chefe de caverna",
    meta: 1,
    premio: "título de Guardião da Sede",
    progresso: ({ chefes }) => Math.min(1, chefes),
  },
];

const BRASAO_POR_ID = new Map(BRASOES.map((b) => [b.id, b]));
const CARGO_POR_ID = new Map(CARGOS.map((c) => [c.id, c]));
const MISSAO_POR_ID = new Map(MISSOES_GUILDA.map((m) => [m.id, m]));
const NOME_MIN = 2;
const NOME_MAX = 24;
const LIMITE_DIARIO = 50;

const limpar = (texto, limite) => String(texto ?? "").replace(/[<>\u0000-\u001f]/g, "").trim().slice(0, limite);

export function brasaoPorId(id) {
  return BRASAO_POR_ID.get(id) || null;
}

export function missaoDaGuilda(id) {
  return MISSAO_POR_ID.get(id) || null;
}

function membroValido(obj) {
  if (!obj || typeof obj !== "object") return null;
  const id = limpar(obj.id, 80);
  const nome = limpar(obj.nome, 24);
  if (!id || !nome) return null;
  const cargo = CARGO_POR_ID.has(obj.cargo) ? obj.cargo : "membro";
  return { id, nome, cargo };
}

// Sanear o save: nome e brasão válidos, no máximo oito membros de id único,
// um só líder, diário curto e só missão resgatada conhecida.
export function guildaValida(obj) {
  if (!obj || typeof obj !== "object") return null;
  const nome = limpar(obj.nome, NOME_MAX);
  if (nome.length < NOME_MIN) return null;
  const brasao = BRASAO_POR_ID.has(obj.brasao) ? obj.brasao : BRASOES[0].id;
  const membros = [];
  const vistos = new Set();
  for (const bruto of Array.isArray(obj.membros) ? obj.membros : []) {
    const membro = membroValido(bruto);
    if (!membro || vistos.has(membro.id)) continue;
    vistos.add(membro.id);
    membros.push(membro);
    if (membros.length >= LIMITE_MEMBROS) break;
  }
  if (!membros.length) return null;
  let lideres = 0;
  for (const m of membros) {
    if (m.cargo === "lider") lideres += 1;
  }
  if (lideres !== 1) for (const m of membros) m.cargo = "membro";
  if (!membros.some((m) => m.cargo === "lider")) membros[0].cargo = "lider";
  const diario = (Array.isArray(obj.diario) ? obj.diario : [])
    .map((linha) => limpar(linha, 180))
    .filter(Boolean)
    .slice(-LIMITE_DIARIO);
  const resgatadas = (Array.isArray(obj.missoes) ? obj.missoes : [])
    .filter((id) => MISSAO_POR_ID.has(id));
  return { nome, brasao, membros, diario, missoes: [...new Set(resgatadas)] };
}

export function guildaDe(data) {
  return data?.guilda || null;
}

export function registrarDiario(data, texto) {
  const guilda = guildaDe(data);
  const linha = limpar(texto, 180);
  if (!guilda || !linha) return false;
  guilda.diario.push(linha);
  if (guilda.diario.length > LIMITE_DIARIO) guilda.diario.splice(0, guilda.diario.length - LIMITE_DIARIO);
  return true;
}

export function fundarGuilda(data, { nome, brasao, dono } = {}) {
  if (guildaDe(data)) return { ok: false, erro: "A guilda já foi fundada." };
  const limpo = limpar(nome, NOME_MAX);
  if (limpo.length < NOME_MIN) return { ok: false, erro: `O nome precisa de ${NOME_MIN} a ${NOME_MAX} letras.` };
  const idDono = limpar(dono?.id, 80);
  const nomeDono = limpar(dono?.nome, 24);
  if (!idDono || !nomeDono) return { ok: false, erro: "A sede precisa de um fundador." };
  const brasaoId = BRASAO_POR_ID.has(brasao) ? brasao : BRASOES[0].id;
  data.guilda = {
    nome: limpo,
    brasao: brasaoId,
    membros: [{ id: idDono, nome: nomeDono, cargo: "lider" }],
    diario: [`A guilda ${limpo} foi fundada por ${nomeDono}.`],
    missoes: [],
  };
  return { ok: true, guilda: data.guilda };
}

// Quem entra é a party: o convite assinado já foi aceito lá. Aqui só o quadro.
export function recrutar(data, companheiros) {
  const guilda = guildaDe(data);
  if (!guilda) return { ok: false, erro: "Fundem a guilda primeiro." };
  let entraram = 0;
  for (const bruto of Array.isArray(companheiros) ? companheiros : []) {
    if (guilda.membros.length >= LIMITE_MEMBROS) break;
    const membro = membroValido({ id: bruto?.id, nome: bruto?.nome, cargo: "membro" });
    if (!membro || guilda.membros.some((m) => m.id === membro.id)) continue;
    guilda.membros.push(membro);
    entraram += 1;
  }
  if (entraram) registrarDiario(data, `${entraram} companheiro${entraram === 1 ? "" : "s"} entrou${entraram === 1 ? "" : "ram"} na sede.`);
  return { ok: entraram > 0, entraram, total: guilda.membros.length };
}

// Cargo anda em ciclo entre membro e oficial; o líder não se rebaixa sozinho.
export function promover(data, id) {
  const guilda = guildaDe(data);
  const membro = guilda?.membros.find((m) => m.id === id);
  if (!membro || membro.cargo === "lider") return null;
  membro.cargo = membro.cargo === "oficial" ? "membro" : "oficial";
  registrarDiario(data, `${membro.nome} agora é ${CARGO_POR_ID.get(membro.cargo).nome}.`);
  return membro;
}

export function progressoDasMissoes(data, { questsDone = 0, chefes = 0 } = {}) {
  const guilda = guildaDe(data);
  const base = {
    fundada: !!guilda,
    membros: guilda?.membros.length || 0,
    questsDone,
    chefes,
  };
  return MISSOES_GUILDA.map((m) => {
    const feito = Math.min(m.meta, Math.max(0, Number(m.progresso(base)) || 0));
    return {
      id: m.id,
      titulo: m.titulo,
      premio: m.premio,
      feito,
      meta: m.meta,
      pronto: !!guilda && feito >= m.meta,
      resgatada: !!guilda?.missoes.includes(m.id),
    };
  });
}

export function resgatarMissao(data, id, stats = {}) {
  const guilda = guildaDe(data);
  const missao = MISSAO_POR_ID.get(id);
  if (!guilda || !missao) return { ok: false, erro: "Essa missão não existe." };
  if (guilda.missoes.includes(id)) return { ok: false, erro: "A recompensa já foi resgatada." };
  const progresso = progressoDasMissoes(data, stats).find((m) => m.id === id);
  if (!progresso?.pronto) return { ok: false, erro: "A missão ainda não está pronta." };
  guilda.missoes.push(id);
  registrarDiario(data, `A sede cumpriu "${missao.titulo}": ${missao.premio}.`);
  return { ok: true, missao };
}

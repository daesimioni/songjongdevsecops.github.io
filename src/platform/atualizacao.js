// Atualização do vale: o site é estático e a aba pode ficar aberta por dias.
// Esta camada lê a versão publicada, avisa quando muda e prepara a volta ao
// jogo sem perder sessão: o save e a chave ficam no storage, a posição vai na
// sessão e o clique baixa os arquivos novos antes de recarregar.
export const ATUALIZACAO = {
  arquivo: "versao.json",
  intervalo: 60000,
  chaveRetomada: "mundo-song:retomar:v1",
  validadeRetomada: 5 * 60 * 1000,
  maxArquivos: 400,
  paralelo: 6,
};

const VERSAO = /^[a-f0-9]{8,64}$/;

export function versaoDe(obj) {
  const versao = String(obj?.versao ?? "");
  return VERSAO.test(versao) ? versao : "";
}

// Sanear o manifesto: só caminho relativo do próprio site, sem URL externa,
// sem subir de pasta e sem lista infinita.
export function arquivosDoManifesto(obj) {
  const lista = Array.isArray(obj?.arquivos) ? obj.arquivos : [];
  return lista
    .filter((caminho) => typeof caminho === "string"
      && caminho.length > 0
      && caminho.length < 160
      && !caminho.startsWith("/")
      && !caminho.includes("..")
      && !/^[a-z][a-z0-9+.-]*:/i.test(caminho))
    .slice(0, ATUALIZACAO.maxArquivos);
}

export async function lerManifesto(fetchImpl = globalThis.fetch, agora = Date.now()) {
  if (typeof fetchImpl !== "function") return null;
  try {
    const resposta = await fetchImpl(`${ATUALIZACAO.arquivo}?t=${agora}`, { cache: "no-store" });
    if (!resposta?.ok) return null;
    const dados = await resposta.json();
    const versao = versaoDe(dados);
    if (!versao) return null;
    return { versao, arquivos: arquivosDoManifesto(dados) };
  } catch {
    return null;
  }
}

export function prepararRetomada(player, agora = Date.now()) {
  return {
    x: Number(player?.x),
    y: Number(player?.y),
    dir: Number(player?.dir) || 0,
    continente: String(player?.continentId || "hub"),
    em: agora,
  };
}

export function retomadaValida(obj, agora = Date.now()) {
  if (!obj || typeof obj !== "object") return null;
  const x = Number(obj.x);
  const y = Number(obj.y);
  const em = Number(obj.em);
  const dir = Number(obj.dir) || 0;
  if (!Number.isFinite(x) || !Number.isFinite(y) || !Number.isFinite(em)) return null;
  if (agora - em > ATUALIZACAO.validadeRetomada || em - agora > 60000) return null;
  const continente = String(obj.continente || "hub");
  return {
    x, y, dir,
    continente: /^[a-z][a-z0-9-]{1,15}$/.test(continente) ? continente : "hub",
    em,
  };
}

export function guardarRetomada(player, storage = globalThis.sessionStorage, agora = Date.now()) {
  try {
    storage.setItem(ATUALIZACAO.chaveRetomada, JSON.stringify(prepararRetomada(player, agora)));
    return true;
  } catch {
    return false;
  }
}

export function consumirRetomada(storage = globalThis.sessionStorage, agora = Date.now()) {
  try {
    const bruto = storage.getItem(ATUALIZACAO.chaveRetomada);
    storage.removeItem(ATUALIZACAO.chaveRetomada);
    return bruto ? retomadaValida(JSON.parse(bruto), agora) : null;
  } catch {
    return null;
  }
}

// Baixa o manifesto com `cache: reload` para o navegador trocar o cache HTTP
// dos arquivos; depois o reload já pega o código novo. Falha de um arquivo não
// impede a volta: o reload tenta o que faltou pela rede.
export async function baixarArquivos(manifesto, fetchImpl = globalThis.fetch, paralelo = ATUALIZACAO.paralelo) {
  const arquivos = arquivosDoManifesto(manifesto);
  if (!arquivos.length || typeof fetchImpl !== "function") return { baixados: 0, falhas: arquivos.length };
  let baixados = 0;
  let falhas = 0;
  let proximo = 0;
  const trabalhadores = Array.from({ length: Math.max(1, Math.min(paralelo, arquivos.length)) }, async () => {
    while (proximo < arquivos.length) {
      const arquivo = arquivos[proximo++];
      try {
        const resposta = await fetchImpl(arquivo, { cache: "reload" });
        if (resposta?.ok) baixados += 1;
        else falhas += 1;
      } catch {
        falhas += 1;
      }
    }
  });
  await Promise.all(trabalhadores);
  return { baixados, falhas };
}

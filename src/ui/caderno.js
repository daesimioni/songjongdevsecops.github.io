// O caderno do viajante: uma capa só para diário, ficha, mochila e bestiário.
// Cada painel continua sendo um modal com o próprio conteúdo; aqui ele ganha a
// mesma moldura, a mesma navegação e o mesmo lugar na tela.
const PAGINAS = [
  { id: "journal", chave: "diario", nome: "Diário", sub: "missões e o que você viu", tecla: "Z", icone: "diario" },
  { id: "sheet", chave: "ficha", nome: "Ficha", sub: "vocação, perícias e companhia", tecla: "C", icone: "ficha" },
  { id: "inventory", chave: "mochila", nome: "Mochila", sub: "itens e equipamento", tecla: "I", icone: "mochila" },
  { id: "bestiary", chave: "bestiario", nome: "Bestiário", sub: "quem vive no vale", tecla: "B", icone: "bicho" },
];

const ICONES = {
  diario: '<path d="M3.5 2.5h9v11h-9z"/><path d="M5.5 5.5h5M5.5 8h5M5.5 10.5h3"/>',
  ficha: '<circle cx="8" cy="5" r="2.4"/><path d="M3.5 13.5c0-2.4 2-3.8 4.5-3.8s4.5 1.4 4.5 3.8"/>',
  mochila: '<path d="M4.5 5.5h7l1 8h-9z"/><path d="M6 5.5V4a2 2 0 0 1 4 0v1.5"/><path d="M6.5 8.5h3"/>',
  bicho: '<circle cx="5" cy="5.5" r="1.4"/><circle cx="11" cy="5.5" r="1.4"/><circle cx="3" cy="9" r="1.2"/><circle cx="13" cy="9" r="1.2"/><path d="M5 12c.7-1.6 1.7-2.4 3-2.4s2.3.8 3 2.4c-1 .7-2 1-3 1s-2-.3-3-1z"/>',
  livro: '<path d="M2.5 3.5h4.5v10H2.5zM9 3.5h4.5v10H9z"/><path d="M4.5 6h1M11 6h1"/>',
  falar: '<path d="M3 3.5h10v7H8l-3 3v-3H3z"/>',
  rede: '<circle cx="5.5" cy="5.5" r="2"/><circle cx="11" cy="6.5" r="1.6"/><path d="M2.5 13c0-2 1.4-3.2 3.5-3.2s3.5 1.2 3.5 3.2M9.5 13c0-1.6 1-2.6 2.3-2.6 1.2 0 2.2.8 2.2 2.2"/>',
  ajuda: '<path d="M6 6a2 2 0 1 1 3 1.8c-.7.4-1 .9-1 1.7"/><path d="M8 12.2v.3"/>',
  som: '<path d="M3 6.5h2.5L9 4v8L5.5 9.5H3z"/><path d="M11 6c.8.6 1.2 1.2 1.2 2s-.4 1.4-1.2 2"/>',
};

function svg(nome, classe = "") {
  const node = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  node.setAttribute("viewBox", "0 0 16 16");
  node.setAttribute("width", "16");
  node.setAttribute("height", "16");
  node.setAttribute("fill", "none");
  node.setAttribute("stroke", "currentColor");
  node.setAttribute("stroke-width", "1.3");
  node.setAttribute("stroke-linecap", "square");
  node.setAttribute("aria-hidden", "true");
  if (classe) node.setAttribute("class", classe);
  node.innerHTML = ICONES[nome] || ICONES.livro;
  return node;
}

function armar(pagina, links, abrir, podeAbrir) {
  const painel = document.getElementById(pagina.id);
  const card = painel?.querySelector(".modal-card");
  if (!card || card.dataset.caderno === "1") return false;
  card.dataset.caderno = "1";
  card.classList.add("book-card");

  const main = document.createElement("div");
  main.className = "book-main";
  while (card.firstChild) main.appendChild(card.firstChild);

  const nav = document.createElement("nav");
  nav.className = "book-nav";
  nav.setAttribute("aria-label", "caderno do viajante");

  const titulo = document.createElement("p");
  titulo.className = "book-nav-title";
  const marca = document.createElement("b");
  marca.textContent = "Caderno";
  const sub = document.createElement("span");
  sub.textContent = "do viajante";
  titulo.append(marca, sub);
  nav.appendChild(titulo);

  const lista = document.createElement("div");
  lista.className = "book-nav-list";
  for (const item of PAGINAS) {
    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "book-link";
    botao.dataset.page = item.id;
    botao.setAttribute("aria-label", `${item.nome}: ${item.sub}`);
    botao.setAttribute("title", `${item.nome} (${item.tecla})`);
    botao.setAttribute("aria-controls", item.id);
    botao.append(svg(item.icone, "book-ic"));
    const texto = document.createElement("span");
    texto.className = "book-txt";
    const nome = document.createElement("b");
    nome.textContent = item.nome;
    const pequeno = document.createElement("small");
    pequeno.textContent = item.sub;
    texto.append(nome, pequeno);
    botao.append(texto);
    const tecla = document.createElement("kbd");
    tecla.textContent = item.tecla;
    botao.append(tecla);
    botao.addEventListener("click", () => {
      if (podeAbrir?.(item.id) === false) return;
      abrir?.(item.id);
    });
    lista.appendChild(botao);
    if (!links.has(item.id)) links.set(item.id, []);
    links.get(item.id).push({ botao, pequeno, sub: item.sub, titulo: botao.title });
  }
  nav.appendChild(lista);

  const pe = document.createElement("div");
  pe.className = "book-nav-foot";
  const ajuda = document.createElement("button");
  ajuda.type = "button";
  ajuda.className = "book-tool";
  ajuda.setAttribute("aria-label", "Ajuda");
  ajuda.title = "Ajuda";
  ajuda.append(svg("ajuda"));
  ajuda.addEventListener("click", () => document.getElementById("btn-help")?.click());
  const som = document.createElement("button");
  som.type = "button";
  som.className = "book-tool";
  som.setAttribute("aria-label", "Ligar ou desligar o som");
  som.title = "Som";
  som.append(svg("som"));
  som.addEventListener("click", () => document.getElementById("btn-sound")?.click());
  const dica = document.createElement("span");
  dica.className = "book-nav-dica";
  dica.textContent = "Esc volta ao mundo";
  pe.append(ajuda, som, dica);
  nav.appendChild(pe);

  card.append(nav, main);
  return true;
}

export function criarCaderno({ abrir, contagens, podeAbrir } = {}) {
  const links = new Map();
  let montado = false;
  function montar() {
    if (montado) return;
    let algum = false;
    for (const pagina of PAGINAS) algum = armar(pagina, links, abrir, podeAbrir) || algum;
    montado = algum;
  }
  function atualizar() {
    if (!montado) return;
    let valores = {};
    try { valores = contagens?.() || {}; } catch { valores = {}; }
    for (const pagina of PAGINAS) {
      const extra = valores[pagina.chave];
      for (const alvo of links.get(pagina.id) || []) {
        alvo.pequeno.textContent = extra || pagina.sub;
      }
    }
  }
  function marcar(id) {
    montar();
    atualizar();
    for (const [chave, copias] of links) {
      const ativo = chave === id;
      for (const alvo of copias) {
        alvo.botao.classList.toggle("on", ativo);
        const liberado = podeAbrir?.(chave) !== false;
        alvo.botao.disabled = !liberado;
        alvo.botao.title = liberado ? alvo.titulo : "entre no vale para abrir esta página";
        if (ativo) alvo.botao.setAttribute("aria-current", "page");
        else alvo.botao.removeAttribute("aria-current");
      }
    }
  }
  return { marcar, atualizar, montar };
}

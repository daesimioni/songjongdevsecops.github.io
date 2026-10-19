// Os textos do blog. Cada lugar do mapa é um post; o interativo mora em
// js/zones/ e é carregado só quando a pessoa abre o painel.

export const POSTS = {
  welcome: {
    kicker: "praça do começo",
    title: "Um blog que se atravessa a pé",
    date: "2026-10-19",
    read: "3 min",
    tags: ["meta", "começo"],
    zone: "plaza",
    live: null,
    body: `
      <p>Todo blog é uma lista. Você rola, clica, abre uma aba nova, perde o fio. Eu queria testar outra coisa: e se o blog fosse um <strong>lugar</strong>? Em vez de índices, uma praça. Em vez de posts, cenários. Você entra com um boneco, anda e escolhe por onde começar.</p>
      <p>Este é o resultado. Um mundo pequeno em pixel art, feito à mão em canvas, com um pedaço de física, um pedaço de teimosia e nada de framework de interface. Cada região é uma ideia que me interessa: lógica, fractais, séries de Fourier, 3D, síntese sonora. As coisas não são só lidas, são mexidas.</p>
      <p>A fonte do site é um monte de JavaScript puro e arquivos estáticos. Não existe servidor meu guardando nada. O mapa roda no seu navegador, e a praça compartilhada usa um canal público só para mostrar quem mais está por aqui.</p>
      <blockquote>Não tem currículo aqui. Este canto é para experimentar, errar e olhar de perto.</blockquote>
      <p>Fica à vontade. Passeie, entre nos lugares, deixe o boneco parado olhando as coisas. Se encontrar alguém, acene. O mundo é pequeno, mas é seu também enquanto você está nele.</p>
    `,
  },
  logic: {
    kicker: "vale da lógica",
    title: "Portas que pensam",
    date: "2026-09-14",
    read: "5 min",
    tags: ["lógica", "interativo"],
    zone: "logic",
    live: "logic",
    body: `
      <p>Uma porta lógica é uma promessa pequena: dado isto, devolvo aquilo. O mundo digital inteiro é feito de promessas desse tamanho. Duas entradas, uma saída, uma tabela de verdades, e de repente dá para somar, comparar, lembrar e decidir.</p>
      <p>O <strong>E</strong> só acende quando as duas entradas estão ligadas. O <strong>OU</strong> acende com qualquer uma. O <strong>OU exclusivo</strong> é o chato que gosta de uma coisa por vez. O <strong>NÃO E</strong> é o E do contra. Trocar a porta muda o comportamento sem mudar a fiação, e é aí que a coisa fica boa: lógica é composição.</p>
      <p>Um processador moderno tem bilhões dessas portas, mas nenhuma delas sabe o que está fazendo. A inteligência não está na peça, está no desenho. É a mesma graça de uma frase: as letras não significam nada sozinhas, o arranjo significa tudo.</p>
      <p>No painel aí embaixo tem um circuito de brinquedo. Ligue as entradas, troque a porta, veja a lâmpada. Depois tente achar uma combinação que acenda a lâmpada com o <em>OU exclusivo</em> e apague com o <em>E</em> usando as mesmas entradas. É um jeito barato de sentir a diferença entre os operadores.</p>
      <blockquote>Se você consegue descrever a saída em função das entradas, você já entendeu a porta. O resto é escala.</blockquote>
    `,
  },
  fractal: {
    kicker: "bosque dos fractais",
    title: "O infinito cabe num galho",
    date: "2026-08-02",
    read: "6 min",
    tags: ["fractais", "recursão", "wasm"],
    zone: "fractal",
    live: "fractal",
    body: `
      <p>Um fractal é uma forma que se repete dentro de si mesma. Um galho vira árvore, a árvore vira galho. Uma regra curta aplicada muitas vezes gera uma complexidade que não caberia em nenhuma descrição linha por linha. É a vitória da receita sobre o bolo.</p>
      <p>A árvore deste bosque nasce de três números: o ângulo entre os galhos, a profundidade da recursão e um pouco de vento. Muda o ângulo e ela deixa de ser árvore e vira coral. Aumenta a profundidade e o desenho começa a ocupar o espaço de um jeito que parece vivo.</p>
      <p>Do lado do conjunto de Julia, a conta é outra. Para cada pixel, o navegador pega um número complexo, aplica <code>z² + c</code> centenas de vezes e pergunta se ele foge para o infinito. Onde foge, pinta de um jeito; onde fica preso, pinta de outro. O resultado é aquela fronteira infinita que não tem superfície nem espessura.</p>
      <p>Essa parte roda em <strong>WebAssembly</strong>: um módulo pequeno, compilado de um arquivo de texto, calcula os pixels em milissegundos. O JavaScript desenha e conversa com o mouse. É uma divisão de trabalho boa: a conta pesada para o wasm, a conversa com a pessoa para o resto.</p>
      <blockquote>Fractais são o lugar onde a matemática para de fingir que é discreta e mostra que o infinito tem detalhes.</blockquote>
    `,
  },
  fourier: {
    kicker: "observatório",
    title: "Toda onda é uma soma de senos",
    date: "2026-07-11",
    read: "7 min",
    tags: ["matemática", "séries", "visualização"],
    zone: "observatory",
    live: "fourier",
    body: `
      <p>Fourier fez uma aposta ousada: qualquer sinal razoável pode ser escrito como uma soma de senos e cossenos. Uma onda quadrada, com seus cantos duros, com seus saltos, é só uma porção de ondas suaves empilhadas com pesos espertos. O observatório existe para você ver essa mágica acontecendo.</p>
      <p>A série da onda quadrada é <em>f(t) = (4/π) Σ sin((2k-1)t)/(2k-1)</em>, com <em>k</em> indo de 1 até o infinito. Com poucos termos, o desenho é uma onda gorda e arredondada. Com muitos, os cantos aparecem. Sempre sobra um sobressalto perto do salto: é o fenômeno de Gibbs, a matemática avisando que convergência não é a mesma coisa que perfeição.</p>
      <p>Isso não é curiosidade de matemático. Compressão de áudio, imagem, rádio, ressonância magnética, análise de vibração: tudo usa a ideia de decompor um sinal em frequências. Quando você ouve um instrumento e reconhece o timbre, está fazendo Fourier com o ouvido.</p>
      <p>Arraste o número de harmônicos no gráfico. Repare que a curva não melhora de forma linear: cada termo novo conserta uma parte e mexe em outra. É um bom lembrete de que aproximar não é só somar esforço, é escolher o que somar.</p>
      <blockquote>O mundo é cheio de coisas que parecem complicadas e são, na verdade, uma soma de coisas simples com pesos diferentes.</blockquote>
    `,
  },
  solid: {
    kicker: "fenda 3D",
    title: "Sólidos que giram",
    date: "2026-06-03",
    read: "4 min",
    tags: ["3d", "webgl", "geometria"],
    zone: "rift",
    live: "solid",
    body: `
      <p>Um icosaedro tem vinte faces, doze vértices e trinta arestas. É um dos cinco sólidos platônicos, uma daquelas formas que existem antes de qualquer vontade humana. Girar um deles na tela é uma das coisas mais baratas e mais bonitas que o navegador sabe fazer.</p>
      <p>Por baixo, o WebGL transforma vértices em triângulos e triângulos em pixels. O Three.js embrulha essa conversa em objetos com posição, material e luz. O que você vê aqui é um cristal de arestas acesas e uma nuvem de pontos ao redor, girando devagar, com a câmera reagindo ao mouse.</p>
      <p>A fenda é o lugar onde o mundo 2D se abre para o 3D. Tem gente que acha que um blog é texto. Eu acho que um blog pode ser um lugar com pedras flutuando no escuro, desde que o texto ainda seja bom.</p>
      <p>Arraste para girar. No celular, deslize o dedo. A rotação automática volta quando você solta. Nada disso precisa de servidor: é só o seu navegador desenhando triângulos a sessenta quadros por segundo.</p>
    `,
  },
  echo: {
    kicker: "rádio do quintal",
    title: "O som também é matemática",
    date: "2026-05-17",
    read: "4 min",
    tags: ["som", "síntese", "web audio"],
    zone: "plaza",
    live: "echo",
    body: `
      <p>Uma nota musical é uma frequência. Dó central, por exemplo, é 261,63 Hz. Dobre a frequência e você tem a mesma nota uma oitava acima. Divida pela metade e tem a mesma nota uma oitava abaixo. O resto da escala é uma negociação entre matemática e costume.</p>
      <p>O sequenciador deste rádio não usa nenhum arquivo de áudio. Cada batida é uma onda gerada na hora pelo Web Audio: um pulso curto para a percussão, um seno com envelope para a nota, um acorde sustentado para o fundo. É síntese sonora do jeito raiz, com osciladores e ganhos.</p>
      <p>Ligue o som no topo da tela, monte um padrão e aperte play. O tempo é dividido em oito passos; cada coluna é um instante, cada linha é uma voz. Pequenas mudanças de padrão mudam o clima inteiro, e nenhum arquivo foi baixado para isso.</p>
      <blockquote>Som é ar mexendo. Música é ar mexendo na hora certa.</blockquote>
    `,
  },
};

export const NPCS = {
  coruja: {
    name: "Coruja",
    lines: [
      "As árvores daqui crescem com a mesma regra, do tronco à ponta.",
      "Se você contar os galhos de uma, me avisa. Eu perdi a conta em 1729.",
    ],
  },
  robo: {
    name: "Bento",
    lines: [
      "Estou calculando a soma de senos que desenha o horizonte.",
      "Ainda faltam alguns harmônicos. Sempre faltam.",
    ],
  },
  gato: {
    name: "Gato",
    lines: ["prrrr...", "miau. (ele parece saber mais do que diz)"],
  },
  guia: {
    name: "Dona Zefa",
    lines: [
      "Bem-vindo à praça, meu filho. O mundo é pequeno, mas ninguém termina de ver.",
      "Aperte E nas coisas que brilham. E não pise na água, que é fria.",
    ],
  },
};

# Revisão de UI e UX — 23/10/2026

## Critérios

- Fontes locais e identidade em pixel art preservadas. Etiquetas que usavam 6–8 px passam a 12 px; atalhos compactos usam 10 px.
- Texto corrido de ajuda e instruções em fonte do sistema, com entrelinha de 1,65. Cor secundária mais clara sobre o fundo escuro.
- Ações dos painéis com altura mínima de 44 px; campos com 16 px para leitura e para evitar ampliação automática no iOS.
- Janelas limitadas pela altura dinâmica disponível, com rolagem contida, cabeçalho e botão de fechar acessíveis.
- O modo de texto grande aumenta as letras no computador e no celular, sem diminuir a janela nem aplicar zoom geométrico.
- Navegação do Caderno com legendas visíveis. Em telas muito estreitas, as cinco páginas ocupam duas linhas. Ficha e Diário respondem a setas, Home e End.
- Foco inicial de páginas do Caderno no fechamento, em vez de selecionar visualmente o Diário em todas as páginas. A Wiki continua priorizando a busca.
- Ajuda organizada por assuntos em seções expansíveis.

## Defeitos corrigidos

| Área | Problema | Resultado |
| --- | --- | --- |
| Todos os módulos CSS | Etiquetas entre 6 e 8 px | Piso de leitura aumentado no próprio módulo |
| Caderno | Abas sem legenda e corte lateral no celular | Nomes visíveis, distribuição adaptada à largura |
| Ficha | Abas fora do ciclo Tab sem navegação pelas setas | Seleção e foco com setas, Home e End |
| Mochila | Três colunas não cabiam na página com índice lateral | Duas colunas em tela larga e uma no celular; detalhe abaixo |
| Mochila | Nomes dos equipamentos quebravam letra por letra | Etiquetas em fonte de leitura |
| Wiki | Cards comprimidos, textos e botão de paginação sobrepostos | Linhas crescem com o conteúdo; rolagem na página |
| Loja | Produtos herdavam a largura da janela | Largura independente para os produtos da grade |
| HUD | Marca, calendário e menus disputavam espaço | Redistribuição em tablet e celular; ações com legendas |
| Texto grande | Cartão encolhia e o celular ignorava a preferência | Aumento tipográfico independente da geometria |
| Mapa/contexto | Conteúdo podia exceder a janela | Limites pela área disponível e rolagem do menu |
| Instrumentos | Elementos da tabela periódica ficavam pequenos para toque | Células maiores com rolagem horizontal própria |
| Ajuda | Um bloco extenso de instruções | Consulta por seis assuntos |

## Reprodução da auditoria em navegador

O jogo continua sem dependência de navegador automatizado em produção. Em um ambiente de QA com Playwright:

```bash
npm install --no-save --package-lock=false playwright
npx playwright install chromium
node tools/audit-ui.mjs
UI_TOUCH=1 UI_OUTPUT=/tmp/valley-touch node tools/audit-ui.mjs
UI_TOUCH=1 UI_LARGE=1 UI_OUTPUT=/tmp/valley-large node tools/audit-ui.mjs
```

`UI_BROWSER` permite escolher um executável Chromium já instalado.
`UI_PLAYWRIGHT_MODULE` permite reutilizar uma instalação de Playwright fora do projeto.
`UI_SCREENSHOTS=0` desliga as capturas; `UI_VIEWPORTS` aceita uma lista JSON de resoluções para repetir um caso.
O script usa uma sessão local descartável, sem entrar na praça compartilhada e sem enviar mensagens.

A matriz usa 1440×900, 1024×768, 768×1024, 390×844, 320×568 e 844×390.
Abre os fluxos reais de Diário, Ficha, Mochila, Bestiário, Wiki, Ajuda, Rede, Loja,
Viagem, Vocações, Biblioteca, Guilda, NPC, Coleta, Treino, Trajes, Personagem e Combate.
Mede os limites das janelas, transbordamento horizontal e botões com conteúdo cortado;
confere foco contido e navegação da Ficha; grava JSON e capturas de tela.
Durante a medição, congela somente o loop de animação do jogo. Isso verifica layout,
não desempenho, tempo de reação no combate ou conectividade entre jogadores.

O resultado não substitui testes em aparelhos físicos, Safari/Firefox, leitores de tela
ou uma sessão com dois jogadores conectados. Estados de administração, desfecho e
convites PvP exigem seus respectivos contextos de jogo; a estrutura e os estilos
compartilhados foram revisados, sem simular aprovação ou experiência nesses estados.

## Resultado desta revisão

- Chromium: 108 combinações de painel e resolução com texto normal, sem erros de JavaScript, transbordamento horizontal ou botões cortados.
- Texto ampliado: matriz de 108 combinações; o único transbordamento encontrado foi a aba de continente do Bestiário em 320×568. Após a correção, os 18 painéis dessa resolução foram repetidos e passaram, incluindo foco e navegação por teclado.
- Inspeção visual de capturas representativas em desktop, celular e paisagem. A inspeção identificou a compressão vertical da Wiki, que a checagem de largura sozinha não detectava.
- Suíte de 132 arquivos executada: 131 passaram inicialmente; a única falha era a expectativa antiga de fonte de 8 px. Essa expectativa foi atualizada e o teste passou na repetição, junto aos testes de interface, foco, acessibilidade do combate e mercador.
- Lint, integridade dos módulos e revisão das 887 perguntas passaram. Permanecem os nove avisos de conteúdo já informados pelo revisor.
- Distribuição estática gerada pelo build.

As capturas são amostras; não se declara revisão manual de cada uma das milhares de fichas geradas nem homologação de navegadores que não foram executados.

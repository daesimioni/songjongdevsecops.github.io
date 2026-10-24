# Manifesto da lixeira

Uma entrada por item descartado. Ordem: mais recente no topo.

Formato:

```markdown
## AAAA-MM-DD — <assunto>
- **Origem:** <caminho de onde saiu> (<procedência>)
- **Motivo:** <por que saiu>
- **Era/contexto:** <o que aquilo era na época, para que servia>
- **Reverter:** <comando ou passos>
- **Tamanho:** <tamanho>
```

---

<!-- entradas abaixo -->

## 2026-10-23 — aprendizagem e instrumentos
- **Pasta:** `2026-10-23-aprendizagem-e-instrumentos/`
- **Origem:** `src/learning/`, `css/learning.css` e `test/instrument-loader.test.mjs` (código do jogo)
- **Motivo:** o jogo deixou de ser educativo; o laboratório de instrumentos não tinha mais ponto de entrada desde o reskin, que zera `post.lab`.
- **Era/contexto:** camada que carregava os "laboratórios" interativos de música, fractal, lógica e afins nas páginas do vale.
- **Reverter:** devolver `learning/` para `src/`, `learning.css` para `css/` e `instrument-loader.test.mjs` para `test/`; restaurar os imports em `src/app/app.js`, o `@import` em `css/style.css` e a camada `learning` em `tools/check-project.mjs`.
- **Tamanho:** 200K

## 2026-10-23 — sistemas de estudo (perguntas, wiki, acervo, PvP)
- **Pasta:** `2026-10-23-sistemas-de-estudo/`
- **Origem:** `src/ui/wiki.js`, `src/ui/pvp.js`, `src/gameplay/acervo.js`, `src/gameplay/grande-prova.js`, `src/gameplay/question-bank.js`, `src/gameplay/conceitos.js`, `src/gameplay/distratores.js`, `src/gameplay/grafo.js`, `src/content/catalog-bank*.js`, `src/content/catalog-legacy.js`, `src/content/text/` (lições, seções, perguntas legadas), `css/wiki.css`, `css/wiki-encyclopedia.css`, `assets/wiki/`, testes e revisores correspondentes.
- **Motivo:** o Vale Partido é RPG de ação e não tem pergunta, resposta, prova, wiki ou acervo. O gerador do mundo passou a produzir só área, estação, lore, caverna, caçada, NPC e missão.
- **Era/contexto:** camada educativa do The Learning Valley: banco de 887 perguntas, 454 páginas de lição, enciclopédia de 2.311 fichas, duelo de pergunta entre jogadores e a Grande Prova da Biblioteca Afogada.
- **Reverter:** devolver as pastas para `src/`, `css/` e `assets/`; restaurar imports em `app.js`, `content.js`, `rpg-data.js`, `quests.js`, `identity.js` e os testes; os commits anteriores a 2026-10-23 têm o estado íntegro.
- **Tamanho:** 1,6M de código e conteúdo (o dist caiu de 438 para 424 arquivos só nesta primeira passada; a segunda removeu o texto das lições).

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

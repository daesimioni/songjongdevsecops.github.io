# Contribuir com The Learning Valley

## Ambiente e comandos

Node.js 22.13 ou superior e npm. A versão de referência está em `.nvmrc`.

```bash
npm ci
npm run dev
npm run validate
```

O servidor abre em `http://127.0.0.1:4173`. `PORT=8000 npm run dev` altera a porta.
`npm run validate` executa análise estática, contratos dos módulos, testes e build.
`npm run build` gera `dist/`; a pasta é descartável e não entra no Git.

Para conferir arte procedural com Canvas nativo, instale `@napi-rs/canvas` em
um ambiente separado e defina `ART_CANVAS_MODULE` com o caminho de `index.js`:

```bash
ART_CANVAS_MODULE=/caminho/@napi-rs/canvas/index.js npm run art:check
ART_CANVAS_MODULE=/caminho/@napi-rs/canvas/index.js npm run art:render -- /tmp/arte
```

Essas verificações opcionais complementam a inspeção visual e não medem qualidade
artística. Elas não adicionam dependências ao navegador.

## Onde modificar

Consulte [a arquitetura](docs/architecture.md) antes de criar módulos. Regras
numéricas e geométricas ficam fora do DOM. Conteúdo não importa cenas ou UI.
Renderizadores recebem estado e desenham; não concedem itens nem alteram saves.
A composição das cenas pertence a `src/app/`.

Os módulos usam ES modules nativos e imports relativos com extensão `.js`.
Não crie um arquivo que reexporta o projeto inteiro: isso oculta dependências e
pode reintroduzir ciclos. A análise estrutural verifica imports estáticos e os
imports dinâmicos literais dos instrumentos.

Preserve as oito direções de `src/core/movement.js`, as unidades em tiles e as
chaves de persistência em `src/core/runtime-config.js`. Mudanças de formato de
save precisam de migração e de teste com estado anterior. Não renomeie IDs de
itens existentes sem tratar a compatibilidade.

Use UTF-8, dois espaços e LF conforme `.editorconfig`. Novos módulos devem ter
uma responsabilidade definida; extraia funções por coesão e dependências, sem
criar abstrações vazias. O lint bloqueia símbolos indefinidos, código morto,
chaves duplicadas e imports ou variáveis sem uso no código de produção.

## Testes e revisão

Inclua testes comportamentais para regras, persistência, rede e mudanças de
contrato. Testes que leem código fonte existentes continuam válidos, mas novos
comportamentos devem ser exercitados diretamente sempre que possível.

Confira manualmente as cenas afetadas em desktop e toque, teclado, foco,
pausa, movimento diagonal e retorno de tela. Uma suíte verde não substitui essa
revisão visual. Registre no PR o que foi observado e o que não pôde ser validado.

Trabalhe em branch própria, com commits descritivos em português, seguindo o
histórico. O PR deve explicar o problema, o comportamento final, as validações e
as limitações relevantes. A CI anexa `dist/` para inspeção e não faz publicação.

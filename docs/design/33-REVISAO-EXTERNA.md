# Revisão externa das PRs #1 a #4

Base: `15d07a4` (fim da onda de conteúdo) até `4692b3d` (merge do PR #4).
São 56 arquivos, 1.697 linhas somadas e 290 removidas, com correções de
colisão, caminhada, interface, combate, save, backup e rede. Esta revisão lê o
diff inteiro, roda as provas e registra o que ficou de fora.

## O que foi conferido

| prova | resultado |
|---|---|
| `npm test` (mesmo comando do CI) | 53 arquivos, 53 passaram, 0 falharam, ~38 s |
| Matriz de navegador | 19/19, 60,2 fps no mundo, 0 estouro em 390 px, 0 erro de jogo no console |
| Contraste | 108 textos em cinco telas, 0 falha |
| Fonte e transbordo | HUD em `system-ui`, 0 elemento fora em 1280 e 390 |
| Alvos de caverna | 94 visitas, 2.413 alvos alcançáveis com sólidos |
| Interiores | 72 casas, móveis sólidos, spawn livre, três acessos |
| Site publicado | `travel-status` no `index.html` e `atualizarFaseChefe` no `js/rpg.js`, com cache bust |

## Problemas encontrados e corrigidos

1. **README desatualizado em três pontos.** O PvP passou a trafegar cinco
   alternativas (o texto dizia três), o banco tem 538 itens indexados (dizia
   447, número de antes da expansão de equipamento) e o `npm test` roda 53
   conferências (dizia seis). Corrigido.
2. **Código morto no módulo de ritmo.** `danoPrevisto` duplicava a conta de dano
   que o `erroPrevisto` do RPG passou a ser a única fonte; só o teste a usava.
   Removida, e o teste agora guarda a regra de fonte única em vez de repetir a
   fórmula.

## O que não foi verificado

- O workflow `.github/workflows/test.yml` nunca rodou no GitHub Actions nesta
  revisão; o comando local é o mesmo, mas Node 22 do CI contra Node 26 da
  máquina não foi comparado.
- A inspeção das telas novas é de navegador headless em 1280 e 390, sem leitor
  de tela, teclado físico e aparelho real.
- O jogo não foi jogado de ponta a ponta nas quatro frentes; as provas cobrem
  os controladores reais em Node, a matriz de interface e os alvos de colisão.

## Veredito

Nenhuma regressão apareceu nas provas executadas. As mudanças externas são
coerentes com os documentos 29 a 32 e com o código; os dois ajustes acima
alinharam documentação e código ao estado real.

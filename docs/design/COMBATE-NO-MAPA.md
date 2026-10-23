# Combate no próprio mapa

Os encontros não abrem mais o modal `duel`. O monstro da caverna continua na
sua posição e passa da patrulha à perseguição. O jogador mantém as coordenadas,
a câmera e o movimento da cena. Treinos e o guardião da Grande Prova também
usam a cena atual; seus atores aparecem em chão livre com passagem até o jogador.

![Combate na caverna, 1280×800](combate-no-mapa/desktop.png)

![Controles na caverna, 390×844](combate-no-mapa/mobile.png)

## Regras e integração

- J: atacar; K: manter guarda; L: esquivar; 1–6: runas; P: companheiro.
  Há botões para ponteiro/toque, foco visível, estado da guarda e recargas.
- Alvos, golpes, runas e área verificam alcance e linha de visão. Movimento e
  esquiva fazem varredura contra as colisões do mapa e dos objetos sólidos.
- Perseguição recalcula rotas quando há obstáculos. Até 12 inimigos podem entrar
  no mesmo combate; não há fila que abre outra arena depois da vitória.
- Cada morte entrega recompensa uma vez e grava progresso imediatamente.
  Recuar dos demais não perde o XP de quem já caiu nem o entrega novamente.
- Fuga acontece ao afastar-se dos inimigos ou alcançar uma saída. A vida do
  sobrevivente fica no ator durante a visita; não há recuo automático do jogador,
  golpe aleatório de fuga ou saída instantânea por Esc durante o combate.
- Vitória permanece no mapa. Derrota executa o respawn uma vez, sem copiar a
  posição antiga sobre a chegada ao porto. Painéis/aba oculta pausam a ação.
- Os sprites atuais são reutilizados. A produção das novas artes segue como
  tarefa separada; esta alteração não marca nenhuma referência como adaptada.

## Arquivos

`gameplay/combate.js` mantém dano, habilidades, fases e regras. Seus limites
de arena são apenas o padrão isolado usado pelos testes/legado; no jogo, o
adaptador `gameplay/combate-mundo.js` fornece posições, movimento e visibilidade
da cena. Esse adaptador não toca no DOM nem desenha.

`app/dungeon.js` liga os monstros existentes, patrulhas, rotas e colisões.
`app/app.js` liga encontros de superfície, treinos e Grande Prova.
`rendering/combate-mundo.js` desenha vida, golpes, guarda e áreas no mapa;
`ui/combate-mundo.js` oferece controles na cena ativa. `ui/duel.js` é legado,
não montado pelo app e sem rota de abertura do modal no fluxo atual.

## Verificação

`npm run validate`: 139 testes aprovados, contrato de módulos/conteúdo,
verificação das artes existentes e build aprovados. Testes novos em
`test/combate-mundo.test.mjs` cobrem posições fora da antiga arena, paredes,
esquiva, fuga com vida preservada, recompensa parcial, vitória e respawn.

Verificação adicional em Chromium headless, modo debug/leve, nos tamanhos
1280×800 e 390×844: encontro de superfície sem modal, combate natural na
caverna, mapa não pausado, arena antiga oculta, HUD dentro da caverna e golpe J
reduzindo a vida de 12 para 11. As capturas acima são desses cenários reais.
O teste usa o estado de debug para entrar na cena; não é teste do onboarding.

# UI e UX — foco, avisos e navegação

Revisão específica após o merge do PR #2.

## Problemas observados na interface publicada

A inspeção foi feita num navegador real, em 1363×936, numa sessão solo de teste:

- Shift+Tab na tela de título levou o foco ao botão Ajuda atrás da abertura.
- Escolher Guerreiro na criação reconstruiu os controles e deixou o foco no
  documento, em vez de mantê-lo na opção escolhida.
- A wiki anunciava 2.246 entradas, renderizava 80 e não oferecia continuação.
- O aviso tinha z-index 8; a wiki tinha z-index 95. Avisos podiam ficar cobertos.
- Os botões de zoom do minimapa mediam 22×22 px.

A prévia local foi tentada no mesmo navegador e retornou conexão recusada.
A inspeção acima é da versão publicada antes desta alteração, não uma captura
ou medição do layout novo.

## Correções

### Uma tela ativa por vez

`ui-scope.js` isola as telas com `inert`, mantém os avisos acessíveis e contém o
Tab na abertura, criação, painel, modal ou caverna ativa. As trocas de tela
sincronizam esse estado antes de mover ou devolver o foco. Um observador de
`hidden` cobre as transições assíncronas. Elementos fixos são reconhecidos por
seus retângulos visíveis, em vez de serem descartados por `offsetParent` nulo.

A wiki ganhou destino de retorno ao HUD, e janelas abertas na caverna têm
retorno aos botões correspondentes da caverna. Cada etapa da entrada posiciona
o foco no seu primeiro campo ou ação. Corpo, cabelo, traje e vocação anunciam a
seleção; o editor preserva o foco durante sua reconstrução.

### Mensagens e controles legíveis

Avisos ficam acima das janelas, com quebra de texto longa. Cabeçalhos de modal
permanecem visíveis ao rolar também no desktop. Títulos não comprimem o botão
de fechar. Rótulos da entrada e textos de resultados receberam tamanhos maiores.
Em dispositivos de toque, os controles dos modais, HUD, minimapa e amostras de
cor têm alvo mínimo de 44 px; campos usam 16 px para evitar zoom involuntário.

### Wiki completa e navegável

A lista começa com 80 resultados e oferece “mostrar mais” até alcançar todas
as entradas. O resumo diferencia total encontrado e quantidade exibida. A
primeira entrada nova recebe foco ao expandir. Voltar de uma ficha devolve o
foco ao item de origem, mantendo a lista em vez de mandar a pessoa à busca.
Abas usam uma parada de Tab e aceitam setas, Home e End; a aba selecionada é
trazida à vista. No celular, a faixa de categorias rola horizontalmente e a
lista tem espaço de rolagem próprio.

### Busca de destinos com feedback

A busca aceita termos sem acento e múltiplas palavras. Cabeçalhos sem destinos
visíveis somem. Quantidade de resultados, mensagem de vazio e botão de limpar
explicam o estado. Ao abrir a viagem, o foco vai ao filtro; limpar devolve o
foco ao campo.

## Verificação

- `ui-scope.test.mjs`: isolamento, ciclo de Tab, retorno à entrada e elementos fixos.
- `character-focus.test.mjs`: foco e seleção em cinco tipos de escolha.
- `wiki-navigation.test.mjs`: expansão até o índice inteiro, contagem, retorno,
  setas das abas e busca sem resultados.
- `travel-search.test.mjs`: acentos, múltiplos termos, grupos vazios e limpeza.
- `npm test`: **49 arquivos aprovados**, sem falhas ou testes pulados.
- `git diff --check`: limpo.

Os testes de controlador usam DOM mínimo. As mudanças de CSS ainda precisam
ser inspecionadas na prévia ou após publicação; não se afirma que tamanhos,
contraste ou ausência de sobreposição tenham sido medidos no layout novo.

# Revisão da main atual e conclusão da atividade

Base relida: `09a82f0`, incluindo os oito commits posteriores ao merge do PR #4.
As novas habilidades dos chefes, duas plantas por tipo, soleiras, moradores,
conteúdo ampliado e remoção da fórmula duplicada foram preservados.

As correções de áudio, consumíveis, perguntas, PvP e party do PR #5 foram
integradas a essa base. O registro correspondente passou para o documento 35,
para manter os documentos 33 e 34 já acrescentados na main.

## Novas falhas reproduzidas

1. **Espelho do chefe:** a previsão anunciava dano mesmo quando o primeiro erro
   seria anulado. Esse erro também consumia a runa de proteção do jogador ou a
   proteção do domador. A previsão agora considera o espelho disponível e apenas
   ele é gasto nesse erro; as outras proteções continuam disponíveis.
2. **Couraça e runas:** trovão ignorava a redução do golpe na fase 2. A mesma
   função passa a tratar esse dano. Golpe de dano zero continua zero.
3. **Morador e clique:** o novo morador só existia na busca por proximidade. O
   clique não o reconhecia; a conversa começava na segunda frase, pulando a
   apresentação da área. Proximidade e clique usam a mesma lista dos quatro
   alvos da casa, e a sequência começa pela apresentação.
4. **Menu e alcance:** o menu contextual não oferecia ações das casas/interiores.
   Clique e menu também usavam um alcance maior que o da interação por F e da
   chegada automática. As ações das casas aparecem no menu, e o alcance considera
   o tipo do alvo; para cavernas, a distância é medida na saída da boca.
5. **README:** a quantidade fixa de conferências já estava desatualizada. O texto
   explica o comando sem uma contagem que fica obsoleta ao adicionar testes.

## Prova e conclusão

Dois arquivos novos exercitam a proteção dos chefes e os interiores. O teste
percorre 288 alvos (porta, mesa, fogo e morador nas 72 casas), com caminhada real
sob colisão, nas oito plantas. Confere também a primeira fala e o ciclo completo
do morador. O teste dos chefes compara previsão com dano real nas quatro
habilidades, preserva proteções sobrepostas e verifica a couraça com trovão.

`npm test` executa 61 arquivos após a integração e as novas regressões. A suíte
inclui conteúdo, assets, interfaces, saves, protocolo, colisões, 94 visitas às
cavernas/conurbação e seus 2.413 alvos. `git diff --check` verifica os patches.

A atividade foi concluída como revisão de código com correções reproduzidas,
testes, integração da main e commits no PR. As medições de navegador registradas
pelo autor nos documentos 19 e 33 não foram refeitas nesta rodada e não são
apresentadas como prova nova. DOM/áudio/transporte simulados não substituem
inspeção visual, audição ou testes de perda de pacotes no serviço real.

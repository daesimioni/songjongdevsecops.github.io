# Revisão funcional de 2026-10-21

O projeto continua sendo um RPG educativo estático: exploração a pé, aulas e
instrumentos, perguntas como combate, progressão suave e rede opcional. Esta
revisão corrige comportamento implementado; não transforma propostas antigas
do desenho em funcionalidades novas.

## Falhas reproduzidas e corrigidas

| falha | correção | prova executável |
|---|---|---|
| Principal cair encerrava o duelo com parceiros vivos | Vitória espera todos; principal caído não aceita novas respostas; último parceiro dispara recompensa e evento de missão | `regressoes-duelo.test.mjs`, `duelo-interface-fluxo.test.mjs` |
| Previsão ignorava vocação, subcategoria e proteção do domador | Interface e cobrança usam `erroPrevisto`; espelho não gasta também a proteção do pet | `regressoes-duelo.test.mjs` |
| Parceiros ignoravam casco, desvio, pressa e recomposição | Caráter aplicado também à matilha; dano mostrado em cada pergunta | `regressoes-duelo.test.mjs`, revisão da cobrança compartilhada |
| Papagaio fora do duelo acessava pergunta inexistente | Habilidade exige pergunta, como os demais pets de dica | `regressoes-duelo.test.mjs` |
| Mesmo parceiro podia entrar várias vezes | IDs deduplicados antes de montar a matilha | `regressoes-duelo.test.mjs` |
| Entradas inválidas podiam virar erro e tirar vida | Resposta exige índice inteiro dentro das alternativas | `regressoes-duelo.test.mjs` |
| Mana só aparecia no duelo quando havia pet | Barra disponível também a quem usa magia sem pet | `duelo-interface-fluxo.test.mjs` |
| Forjar ensinava magia depois da última gravação | Aprendizado salvo antes do retorno da forja | `regressoes-duelo.test.mjs` |
| Quantidade infinita ou inválida podia estragar inventário | Validação finita na entrada e na leitura do save | `regressoes-duelo.test.mjs` |
| Bônus de coleta reduzia qualidade e impedia lendários | Bônus amplia a faixa acima do comum | `coleta-bonus.test.mjs`, 10.000 sorteios por tipo e bônus |
| Rede rejeitava as perguntas A–E do PvP | Recepção aceita cinco alternativas e índice correspondente | `rede-protocolo.test.mjs`; amostra de 1.050 perguntas reais aceita |
| Rede descartava direções 4 a 7 | Oito direções preservadas nos pares | `rede-protocolo.test.mjs` |
| Monstro diagonal tinha vetor de visão zero | Cone com vetor normalizado nas oito direções e linha de visão | `visao-diagonal.test.mjs` |
| Limite de pares podia congelar atualizações e saídas | Limite vale só para entrada de novos pares | `rede-protocolo.test.mjs` |
| Destruir conexão offline deixava cliente reconectando | Cliente encerrado também offline | `rede-protocolo.test.mjs` |
| Backup podia apagar progresso feito durante a busca | Estado vazio conferido novamente depois da resposta da rede | `backup.test.mjs` |
| Conta com só perícia, pet ou magia era tratada como vazia | Esses registros também contam como progresso | `backup.test.mjs` |
| Restauração parcial era anunciada como sucesso | Falha tenta desfazer gravações e retorna erro explícito | `backup.test.mjs`, simulação de falha de cota |
| `npm test` só rodava o arquivo core | Executa todos os `*.test.mjs`, isolados e sequenciais | `package.json` |
| README descrevia mapa e dano antigos | Dimensões 560×360 e vida/dano base diferenciados de acertos | `src/content/config.js`, `src/content/rpg-data.js`, `src/gameplay/rpg.js` |

## Validação e limites

- `npm test`: **38 arquivos aprovados**, sem falha, cancelamento ou teste pulado.
- `git diff --check`: sem erro de whitespace.
- O teste do controlador usa DOM mínimo e exercita ações e callbacks reais;
  não mede layout, contraste, canvas nem interação física no navegador.
- Não foi possível rodar Chromium local: não há executável instalado e o
  download pelo Playwright devolveu arquivo inválido. Não há nova comprovação
  visual, de FPS ou de layout nesta revisão.
- MQTT/relays públicos e duas contas reais não foram exercitados; o protocolo
  foi testado localmente sem enviar mensagens externas.
- Os documentos anteriores são históricos; seus números de suítes e alegações
  de capturas não constituem validação desta alteração.

Não se declara o jogo livre de todos os defeitos. A auditoria visual e um
playtest integral continuam necessários, assim como distinguir propostas de
conteúdo e funcionalidades ainda não implementadas de regressões no código.

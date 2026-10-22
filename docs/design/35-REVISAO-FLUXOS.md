# Revisão de fluxos, áudio e rede

Base: `4692b3d`, após o merge do PR #4.

## Problemas corrigidos

- Os quatro peixes tinham cura/mana e botão de uso, mas eram recusados pela lista
  fixa de consumíveis. O RPG agora reconhece os efeitos declarados dos alimentos.
  Comida mista não é consumida com ambos os recursos cheios, mas pode recuperar
  apenas o recurso que estiver faltando. IDs inválidos devolvem erro.
- Na coleta, um índice inválido encerrava a pergunta como erro. Agora a entrada é
  validada antes de alterar o estado. Depois de responder e ao avançar, coleta e
  combate colocam o foco na próxima ação disponível, incluindo a matilha.
- Dicas podiam gastar carga/mana no monstro principal já morto. Elas são recusadas
  nesse estado e os botões ficam desabilitados; cura e dano em área continuam
  disponíveis. Faro/tagarela também consideram alternativas já eliminadas.
- Sem Web Audio, o sequenciador e o desbloqueio podiam acessar contexto nulo;
  construção e retomada do contexto também podiam falhar sem tratamento. O áudio
  passa a indicar indisponibilidade e o HUD mantém a opção desligada. O
  sequenciador valida o andamento e não tenta tocar todo o atraso de uma aba
  suspensa ao retomar.
- Os instrumentos musicais ligavam o áudio a cada nota e conectavam diretamente
  à saída do navegador, ignorando o controle geral. Agora o gesto de tocar liga
  o som e as notas passam pelo ganho geral; timers não religam o som desligado.
- No PvP, assinatura/verificação atrasada de um convite podia afetar outro convite
  para a mesma pessoa. As respostas ficam vinculadas ao objeto do convite original.
  Falha síncrona de assinatura também usa o convite sem prova. Verificação tardia
  não reinicia os 30 segundos de defesa. Fim de duelo não aplica derrota em convite
  pendente nem aceita um vencedor que não participa da disputa.
- A saída da party não informava destinatário, portanto os outros clientes a
  descartavam. Agora cada membro recebe a saída. Entrada de novo membro atualiza
  todos os participantes, em vez de apenas o recém-chegado. Apenas o líder convida
  e sincroniza; aceites exigem convite pendente; há limite de oito participantes.
  Atualizações inválidas, duplicadas ou de outra party são recusadas. Falha de envio
  não é anunciada como convite/aceite concluído.

## Validação e limites

A suíte `npm test` contém 58 arquivos. Cinco arquivos novos exercitam o áudio e
um compositor real com nós simulados, assinaturas/verificações atrasadas no PvP,
controle e foco das perguntas, todos os consumíveis com efeitos declarados e o
fluxo de uma party com três clientes, usando uma fila de transporte simulada.
Os testes anteriores de conteúdo, colisões, caminhos, saves e interfaces seguem
incluídos. `git diff --check` verifica os patches.

Os testes de áudio não medem o som ouvido; DOM mínimo não mede layout. A fila de
party não reproduz perda de pacotes, desconexão ou entrega por broker real. O
protocolo MQTT continua sem autenticação criptográfica das mensagens de party;
validar remetente/estado lógico não resolve falsificação de IDs no transporte.
Esta rodada não equivale a jogar todas as combinações ou validar todas as CDNs
em todos os navegadores.

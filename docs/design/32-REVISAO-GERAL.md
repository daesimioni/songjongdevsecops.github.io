# Revisão geral após o PR #3

Base: `aaf2a77`, com as correções anteriores integradas.

## Falhas corrigidas

- **Mana:** save com `manaAt` zerado nunca regenerava; relógio voltando para trás
  paralisava a regeneração. O pulso estabelece uma origem válida e limita o
  recurso ao máximo atual. Tempo com mana cheia não fica acumulado como reserva.
- **Chefes:** fogo e trovão reduziam vida sem disparar as fases 2 e 3. Respostas e
  runas agora compartilham a transição, o aviso e a troca de baralho.
- **PvP:** `waiting` representava tanto aguardar uma resposta quanto aguardar um
  ataque. Um ataque recebido podia substituir a própria pergunta pendente.
  O receptor exige que a pergunta anterior esteja resolvida e limpa o prazo
  anterior antes de iniciar a defesa.
- **Ficha:** descanso e mana eram calculados só ao abrir a tela. Uma atualização
  leve, chamada pelo pulso do jogo, atualiza vida, mana e habilidade sem recriar
  os controles ou tirar o foco. Habilidades exclusivas de duelo são identificadas
  e ficam indisponíveis na ficha. A explicação de mana e cargas foi atualizada.
- **Saves:** JSON sintaticamente válido, mas com `null`, listas ou tipos errados
  no lugar da memória de NPCs e dos primeiros passos, podia quebrar esses fluxos.
  A leitura verifica o tipo esperado. XP inválido não vira nível negativo ou
  infinito. Missões também rejeitam listas no lugar dos registros: propriedades
  de missão atribuídas a listas desapareciam ao serializar o save.
- **Backup:** restaurar apenas as chaves presentes misturava o retrato antigo com
  itens e progresso posteriores. A restauração substitui todas as chaves da lista
  permitida, valida JSON antes de escrever e recupera inclusive chaves removidas
  se falhar. A névoa continua usando seu formato base64. Identidade e chat ficam
  fora dessa operação.
- **Backup e rede:** os primeiros passos entram no retrato. Instrumentos explorados
  contam como progresso para bloquear restauração automática. Falhas de envio e
  busca retornam um resultado de erro, permitindo que a interface reabilite os
  botões em vez de abandonar uma Promise rejeitada.

## Validação

`npm test` executa 53 arquivos de teste, incluindo quatro arquivos novos para
combate/mana, turnos PvP, tipos de save e atualização da ficha. O teste de backup
foi ampliado com substituição de retrato, dados inválidos, primeiros passos,
falhas de rede e recuperação de chaves removidas. A suíte mantém os testes de
colisão e de acesso aos 2.413 alvos das 94 visitas às cavernas e conurbação,
interiores, interface, conteúdo e protocolo.

A entrada e o carregamento da partida no modo solo foram conferidos no navegador
na versão publicada. As alterações desta revisão foram verificadas pelos
controladores reais em Node com DOM mínimo quando necessário; isso não equivale
à inspeção visual dos novos controles em todos os dispositivos. Rede externa,
CDNs e todas as combinações possíveis de jogo não foram testadas integralmente.

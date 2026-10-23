# Continuidade: adaptação autoral integral dos sprites

Estado conferido em 2026-10-23. **Trabalho artístico integral não concluído.**
Este documento é autossuficiente: o próximo agente não precisa deste chat.
Leia também `../../AGENTS.md` e `sprites-status.json`. Atualize este plano e o
estado por referência em cada entrega; não substitua evidências por percentuais.

## Quem executa e quando

Pedido do usuário: continuar no **GPT 6.1 Sol em modo leve**, com ferramenta
real de geração de imagens. **Não atribuir a produção visual ao DeepSeek**,
inclusive por delegação: ele não tem a geração de imagens prevista neste fluxo.
Sem ferramenta disponível, não iniciar nem simular produção de arte. Deixar a
etapa pendente e informar essa limitação quando ela for solicitada. Isso não
bloqueia trabalho de código explicitamente solicitado em outra tarefa.
Estes arquivos não trocam o modelo nem fazem o agente iniciar trabalho sozinho.

## O que foi pedido

Recriar TODAS as referências dos três ZIPs em arte própria coerente com o jogo,
detalhada, organizada, otimizada e utilizável. Não copiar os bitmaps. Inspirar-se
em cada referência, preservando a identidade funcional e os detalhes relevantes.
Reconstruir objetos compostos de atlas; não contar fragmentos como monstros.

- Tudo que se move: frente, trás, esquerda, direita e quatro diagonais reais;
  poses e movimentos congruentes, com a lógica de leitura de um RPG como Tibia.
- Criaturas: repouso, caminhada, ataque, impacto e morte; ataque próprio de cada
  monstro, sem trocar criaturas diferentes por um mesmo modelo genérico.
- Cenário: pisos, bordas, transições, muros, construções, mar/água, plantas,
  árvores, flores, grama e demais objetos. Animar onde fizer sentido.
- Combate: fogo, gelo, morte, terra, energia, físico, água e demais elementos;
  projéteis, ataques em área, verticais e diagonais, com início/meio/fim legíveis.
- Clima e ambiente: chuva, vento, eclipse e demais eventos úteis, consistentes
  com os sistemas e o estilo existentes. Organizar também a expansão futura.
- Integrar os assets e as colisões correspondentes sem alterar arbitrariamente
  balanceamento, mapas, saves ou regras. Biblioteca para uso futuro e substituição
  de arte usada no jogo são entregas distintas; registrar ambas separadamente.

## Estado real ao retomar

PR [#12](https://github.com/songjongdevsecops/songjongdevsecops.github.io/pull/12)
foi integrado em main. Entregou inventário e biblioteca Canvas procedural:
264.075 referências, 218.769 receitas, 45.306 aliases de duplicatas, 18 categorias.
Isso **não** representa 218.769 artes individuais completas.
Há 170.249 componentes técnicos de atlas, 30.077 recursos, 8.871 terrenos e
2.736 receitas de criaturas, estas com apenas 51 combinações de modelos/famílias.
IDs distintos podem renderizar desenhos semelhantes. Oito vistas renderizáveis
não comprovam adaptação fiel. Não houve revisão artística integral por referência.

PR [#13](https://github.com/songjongdevsecops/songjongdevsecops.github.io/pull/13),
branch `feat/curadoria-autoral-integral`, era **rascunho, não integrado** nesta
conferência; verifique o estado atual antes de retomar. Commit inicial
`4df7756d002df506e5ebf9549a8ddba5ab842da5`. Contém avisos de pendência,
`tools/references/progress.mjs`, `docs/art/referencias/curadoria.json` e um estudo
de lobo em oito vistas, sem ciclos completos ou integração ao jogo.
Não recrie nem sobrescreva esse trabalho sem lê-lo. Não assuma que esses arquivos
existem em main antes de verificar o PR/branch.

**Zero adaptações individuais integralmente concluídas e verificadas.**
Todas as referências permanecem pendentes de revisão e adaptação integral;
nenhuma exceção de conclusão foi registrada. O lobo é só um rascunho.

## Fontes: como recuperar sem este chat

Os ZIPs originais completos agora estão públicos no GitHub, na branch separada
`references/original-art-archives`. Consulte [a recuperação verificada](ORIGINAIS-REFERENCIAS.md).
Não é necessário obter anexos da conta original ou pedir que sejam reenviados.
Todos os bytes foram preservados em 63 partes, com um script que entrega os três
ZIPs originais e confere os hashes. Não faça merge dessa branch em main.

```sh
python3 tools/references/download-originals.py --destination ../original-art-references
```

Se este script ainda não estiver no checkout, use o endereço imutável e as
instruções de recuperação do documento acima. O índice e os ZIPs públicos
permitem retomar o trabalho em outra conta sem este chat.

| Arquivo | Bytes | SHA-256 |
|---|---:|---|
| magias.zip | 1316455 | e7a6446a99fc4e9c6d5f3ab74815a6b0b9ae2b9a02452b805afd50e7255e0be1 |
| criaturas.zip | 18624681 | 72df67f1036ff828a70cd4e6a087841789894632f7d23eea679d2cc46a3a9fcb |
| sprites-completos.zip | 488360779 | db353357ddd2821657e265b42cbb04d0f3b39fcdd1b86d60b8e2e7140ed7d06e |

Confirme os hashes antes de trabalhar. Não commite os ZIPs nem extraia caminhos
de arquivos sem proteção contra travessia. Eles incluem nomes com codificação
legada; preserve o caminho exato do índice como identidade.

O git já guarda a lista COMPLETA das pendências em
`docs/art/referencias/cobertura-0000.ndjson.gz.txt` até `cobertura-0032.ndjson.gz.txt`.
São gzip codificado em base64, contendo NDJSON com linhas:
`[ZIP, membro exato, ID da receita, largura, altura, quantidade de quadros]`.
Sem registro individual de conclusão, cada linha é pendente; não é necessário
copiar 264 mil linhas para um novo Markdown. Aliases também exigem verificar se
a mesma entrega cobre de fato todos os detalhes/quadros das referências.

## Arquivos e comandos para começar

- `assets/reference-art/manifest.json`: categorias, páginas, hashes e contagens.
- `src/content/reference-art/recipes.js`: receitas, direções e poses existentes.
- `src/content/reference-art/bodies.js`: projeção/corpos atuais, não garantia de
  colisão de toda arte nova; conferir no mundo.
- `src/rendering/reference-art/index.js`: renderizador procedural anterior.
- `src/rendering/sprite-kit/`: modelos nativos e paleta para comparar estilo.
- `src/platform/reference-art.js`: carregamento opcional com hashes e caches.
- `tools/reference-art.html` e `.mjs`: catálogo de receitas, não lista de aprovadas.
- `tools/references/compile.py`: compilação anterior; recompilar não conclui arte.
- `tools/references/check.mjs`: integridade/renderização, não aprovação visual.
- `docs/art/referencias/README.md` e `validation.json`: método e provas técnicas.

```sh
git status --short
git fetch origin
# Conferir main e PR #13 antes de criar a branch de trabalho.
npm ci
npm run dev
# Catálogo em /tools/reference-art.html no endereço informado pelo servidor.
node tools/references/check.mjs
# Se os arquivos do PR #13 estiverem presentes:
node tools/references/progress.mjs
node tools/references/progress.mjs '/Wolf.gif'
```

O script de progresso do PR #13 é um checkpoint: aceita apenas estudos draft ou
rejected, conta aprovações como zero e NÃO implementa o fluxo final de conclusão.
Amplie-o com estados reais e evidências ao entregar as primeiras artes completas;
não altere a constante para inflar progresso. Rascunhos não são produção.

## Próximas ações, na ordem

1. Conferir código/PRs atuais e recuperar os três ZIPs com hashes verificados.
   Ler o índice completo e as exceções já registradas, sem refazer o inventário.
2. Recuperar o lobo do PR #13. Origem exata no JSON, ID
   `arte/criaturas/d6162e2326bb7c61840d`. A imagem 1774×887 é estudo conceitual,
   não atlas pronto. Primeira tentativa de 160 quadros foi rejeitada por
   espaçamento irregular. Não a usar como animação de produção.
3. Concluir um asset verticalmente: referência e todos os quadros relevantes →
   desenho próprio → oito vistas → cinco ciclos → recorte/âncora/durações →
   colisão → integração no motor → revisão em cena e registro. Escolher tamanho
   de tile/escala/paleta com base no jogo atual, sem assumir que a resolução
   solicitada ao gerador corresponde ao arquivo retornado.
4. Validar esse fluxo e continuar em lotes pequenos, sem parar no lobo. Cobrir
   cada uma das 18 categorias e cada registro original. Fragmentos devem ser
   associados a uma montagem própria rastreável; não descartados silenciosamente.
5. Manter relatório por lote com quantidades reais, referências cobertas,
   pendências restantes, imagens revisadas, commits e próximos IDs exatos.
6. Só encerrar a tarefa integral quando não restar referência sem correspondência
   autoral completa, evidência visual e integração ou destino futuro explícito.

## Registro obrigatório por referência/entrega

Guardar em git o ZIP+membro exato, ID, estado, arquivos de saída e hashes,
referências cobertas quando compartilhadas, dimensões, direções, estados,
quadros, durações e âncora; corpo de colisão quando aplicável; caminho de uso
no motor ou destino da biblioteca futura; provas visuais e resultado da revisão;
problemas ainda abertos e próximo passo concreto. Um asset pode ter mais de uma
tentativa: não perder o histórico ao atualizar um hash.

Estados recomendados: pending → draft → animation → integration → review → done.
`blocked` e `rejected` permanecem pendentes e devem ter motivo. Só `done` reduz
pendências, após revisão real. Registrar a revisão feita pelo agente não exige
criar um novo pedido de aprovação ao usuário. Não inventar revisores/evidências.

## Critérios de conclusão e verificações

- Identidade e detalhes próprios por referência; nada de relevo 16×16 como
  substituto de criatura, rotação plana como vista ou espelhamento como solução
  universal para assimetrias. Duplicatas só compartilham entrega após comparação.
- Vistas reconhecíveis e proporcionais; lado traseiro reconstruído; escala,
  iluminação, paleta e densidade de pixels consistentes no jogo.
- Movimento e orientação coincidem, inclusive diagonais. Âncoras estáveis,
  quadros sem cortes/vazamentos, transições sem saltos. Ataque/impacto/morte
  terminam corretamente; caminhada e repouso têm ciclos congruentes.
- Pisos e muros conectam sem frestas; água/vegetação/clima animam sem artefatos.
  Ataques direcionais, áreas e duração correspondem à leitura no jogo.
- Objetos grandes têm colisão correspondente ao corpo sólido, sem bloquear copa,
  efeitos visuais ou áreas transparentes indevidamente. Testar todas as vistas.
- Inspecionar imagens e animações reais no motor, em cena; verificar desktop e
  touch, redução de movimento, carregamento/cache e ausência de regressões.
- `npm run validate` e `node tools/references/check.mjs --all` verificam código
  e renderização. Não provam fidelidade ou qualidade artística. Incluir testes
  específicos quando a integração mudar comportamento.
- Não enviar referências originais por engano no build. Persistir os assets
  gerados dentro do projeto, não só em pasta temporária do gerador.

## Entrega e próximo handoff

Branch e commits em português; PR com escopo real e evidências, sem push direto
ou merge automático em main. O usuário já autorizou o trabalho: não pedir
permissão novamente para cada lote reversível. Não declarar conclusão ao esgotar
créditos: commitar o progresso, atualizar registros, informar bloqueios e IDs
seguintes e manter o restante pendente. Preservar este aviso até a conclusão
integral comprovada. Não atribuir automaticamente esta tarefa a sessões DeepSeek.

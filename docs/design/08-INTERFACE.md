# Interface: o mundo primeiro, o painel depois

O jogo é jogado no mapa, não em menus. Toda tela existe para devolver o jogador
ao mundo com uma decisão melhor. Este documento desenha as telas, os fluxos e o
toque, ainda em texto, para aprovação antes do código.

## 1. Princípios

1. **Mundo primeiro.** O HUD é fino; o mapa ocupa a tela. Painel abre por cima,
   fecha com Esc e devolve o controle.
2. **Três toques.** Qualquer ação comum (usar poção, abrir mapa, trocar arma)
   cabe em até três toques ou uma tecla.
3. **Legível antes de bonito.** Fonte pixel para título, mono para número,
   contraste alto; nada de texto sobre textura sem fundo.
4. **Sem beco sem saída.** Toda tela tem saída visível; todo erro tem próximo
   passo; todo vazio tem uma dica.
5. **Consistência.** Mesmas teclas, mesmos ícones, mesmas cores de continente,
   mesmas posições.
6. **Toque e teclado de primeira classe.** Não é desktop com toque adaptado.
7. **Sem escuro.** Nada de botão que engana, custo escondido, contagem
   regressiva que pune.

## 2. Linguagem visual

- Pixel art 16 px por tile, câmera 2 a 4x, sem suavização.
- Paleta por bioma; o acento do continente marca item, magia e perigo.
- Título em `Press Start 2P`; corpo em mono; número tabular.
- Ícones desenhados no mesmo grid de 16, nunca emoji como ícone principal.
- Sombra dura, luz suave, partículas discretas; sem blur no mundo.
- Animações curtas (120 a 220 ms), com opção de reduzir.
- Cor nunca é o único sinal: forma + cor + texto.

## 3. HUD global

```
┌──────────────────────────────────────────────────────────────┐
│ THE LEARNING VALLEY     ● praça  42/60  Nv 12  ❤ 48/60  ◈ 20/30  │
│                                      mapa  ficha  diário  ?  │
│                                                              │
│                                                              │
│                        (mundo / canvas)                      │
│                                                              │
│  [buff: café 1:20]                         [sala: praça]      │
│  [A] andar  [F] interagir  [Q] falar  [C] ficha  [Esc]       │
└──────────────────────────────────────────────────────────────┘
```

- Vida e mana em número e barra; buffs em chips com tempo.
- Nível, domínio do continente, sala e conexão.
- Botões: mapa (M), ficha (C), diário (Z), Rede (E), ajuda (?).
- O chat é uma linha embaixo, com histórico curto; Enter abre, Enter envia e
  fecha.
- Avisos (toast) no alto, curtos, com ícone e uma linha; nunca cobrem o mapa
  por muito tempo.
- O HUD some em cutscene, mirante e diálogo importante; volta com qualquer
  tecla.

## 4. Exploração

- Câmera segue com suavidade; a escala é a mesma no vale e na caverna (`js/camera.js`, 1,3 a 1,6 conforme a janela); balanço só em impacto.
- Menu: Diário, Bestiário, Mochila, Ficha, **Wiki** (`H`) e Ajuda; a wiki reúne tudo sobre o jogo e é montada dos mesmos dados (`docs/design/16-WIKI.md`).
- Nome do lugar aparece ao entrar; some depois de 3 s; o chip fica.
- Bichos mostram o **cone de visão** no chão, o estado (`?`, `!`) e a direção do
  olhar.
- Interação: objeto próximo ganha contorno e prompt com tecla; no celular,
  toque no objeto.
- Caminho de clique: linha pontilhada curta, destino marcado, cancelar com
  qualquer direção.
- Mapa: minimapa no canto, névoa, marcadores de boca, cidade, baú, chefe e
  missão; clique no minimapa anda até o ponto explorado.
- Mirantes: ao chegar, um cartão-postal desenha a região e revela o mapa.
- Clima e hora mudam a luz e o som; nunca escondem o caminho.
- Party: nome e vida dos companheiros em chips pequenos; sem poluir.

## 5. Batalha solo

```
┌──────────────────────────────────────────────────────────────┐
│ CATACUMBAS DO SILÍCIO · FÁCIL                    fugir [Esc]  │
│                                                              │
│   [sprite do bicho]        Bit · nível 3 · ★                 │
│                            vida do bicho  ███░░  2/3          │
│                            sua vida       █████  28/30       │
│                                                              │
│   O que um flip-flop guarda?                                 │
│   ┌──────────────────────────────────────────────────────┐   │
│   │ 1  Uma soma                                          │   │
│   ├──────────────────────────────────────────────────────┤   │
│   │ 2  Um relógio                                        │   │
│   ├──────────────────────────────────────────────────────┤   │
│   │ 3  Um bit                                            │   │
│   └──────────────────────────────────────────────────────┘   │
│   responder 1, 2 ou 3 · dica [H] · magia [1..9] · item [I]   │
└──────────────────────────────────────────────────────────────┘
```

- O bicho, a vida e a pergunta no mesmo campo de visão.
- Feedback: opção escolhida, opção certa, misconception e explicação; o botão
  "continuar" é explícito.
- Dica em escada; magia e item abrem um painel rápido sem sair da batalha.
- Sem cronômetro por padrão; modo fluência mostra um anel fino e não pune.
- Fuga sempre visível em bicho comum; em chefe, bloqueada com aviso.

## 6. Batalha de grupo

```
┌──────────────────────────────────────────────────────────────┐
│ CONSELHO DA ENCRUZILHADA                      fugir [Esc]    │
│ foco ●●●○○                                                   │
│ ┌──────────────┐ ┌──────────────┐ ┌──────────────┐          │
│ │ Primo  ██░░  │ │ Lema   ███░  │ │ Vértice ████ │          │
│ │ múltipla     │ │ explicar     │ │ apontar      │          │
│ │ "qual é o    │ │ "por que o   │ │ "clique no   │          │
│ │ único primo  │ │ lema vale?"  │ │ vértice..."  │          │
│ │ par?"        │ │              │ │              │          │
│ │ [opções]     │ │ [opções]     │ │ [diagrama]   │          │
│ └──────────────┘ └──────────────┘ └──────────────┘          │
│ intents: Lema protege Vértice · Primo vai perguntar de novo  │
│ log: você acertou Primo; Lema curou 1; Vértice está alerta   │
└──────────────────────────────────────────────────────────────┘
```

- Um cartão por bicho; a pergunta inteira visível em cada um.
- O jogador escolhe a ordem; o alvo ativo ganha destaque.
- Foco sobe com acerto, cai com erro, libera a habilidade da arma.
- Intents telegrafados no rodapé do cartão.
- No celular, os cartões viram uma lista vertical com abas; a pergunta ativa
  fica no topo e as outras mostram só o nome e a vida.
- Sem turno forçado: o jogador responde quando quiser.

## 7. Chefe

- Barra de fases no topo; cada fase mostra o formato da pergunta.
- Ponto fraco aparece depois de 2 acertos; o alvo muda de cor.
- Adds entram como cartões extras; matar remove um debuff.
- A fala do chefe ensina o tema; a derrota não humilha.
- A saída só abre depois da vitória; antes, a porta mostra o cadeado.

## 8. Ficha

```
┌──────────────────────────────────────────────────────────────┐
│ FICHA DE AVENTUREIRO                               fechar Esc│
│ Zed · Nv 12 · 480 XP · Cartógrafo                            │
│ ❤ 48/60  ◈ 20/30  dano 4  defesa 6  velocidade 5  visão 7   │
│                                                              │
│  [capacete] [colar] [arma] [escudo] [anel]                   │
│  [armadura] [pernas] [botas] [bicho]                         │
│                                                              │
│  conjuntos: Circuito 3/4 · Axioma 0/4                        │
│  encantos: Vigor · Luz                                        │
│  buffs: café 1:20                                             │
│  bicho: raposa, vínculo 2/3                                   │
│                                                              │
│  perícias  Lógica 3 · Abstração 2 · ...                      │
│  domínio   bits 4 · portas 3 · ...                           │
│                                                              │
│  [mochila] [magias] [ofícios] [caderno]                      │
└──────────────────────────────────────────────────────────────┘
```

- Boneco de slots, não lista solta.
- Comparar item: ao passar o mouse, mostra a diferença nos atributos.
- Conjuntos e encantos com o efeito escrito; nada de número sem nome.
- Presets de build (3 slots) para trocar rápido.
- O domínio é uma lista curta por continente, não uma parede de 180 conceitos;
  o detalhe fica no caderno.

## 9. Mochila

- Categorias: arma, armadura, consumível, material, receita, relíquia, mapa.
- Busca e filtro; ordenar por tipo, raridade, continente.
- Usar/equipar/dar/descartar com confirmação só no descarte.
- Sem peso; limite por slots de categoria para não virar planilha.
- Item mostra lore curta e para que serve; receita mostra onde se faz.

## 10. Caderno

O coração educativo, fora do combate.

```
┌──────────────────────────────────────────────────────────────┐
│ CADERNO DE CAMPO                                    fechar   │
│ hoje: 12 revisões · 3 erros · 8 dominados                    │
│                                                              │
│ [revisar agora]  [por continente]  [por erro]  [exportar]    │
│                                                              │
│ mapa de domínio:                                             │
│   Computação  ███░░  bits, portas, memória                    │
│   Matemática  ██░░░  primos, limites                          │
│   ...                                                        │
│                                                              │
│ cartões:                                                     │
│ ┌──────────────────────────────────────────────────────────┐ │
│ │ bits · múltipla escolha · errado 2x · vence hoje          │ │
│ │ "quantos valores cabem em 8 bits?"                       │ │
│ │ erro: confundiu bit com byte                             │ │
│ │ [revisar] [ver explicação]                               │ │
│ └──────────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────────┘
```

- Revisão sem bicho, sem dano, com a mesma pergunta e explicação.
- Exportar em texto/markdown para estudar fora.
- Filtro "nunca acertei", "vence hoje", "errei por unidade".
- O caderno não pune; mostra progresso e próximo passo.

## 11. Mapa e cartografia

- Tecla M abre o mapa grande; abas superfície/subsolo.
- Névoa por tile; o que foi andado aparece; o que foi visto de mirante aparece
  em contorno.
- Marcadores: cidade, boca, baú, chefe, missão, NPC, segredo, waystone,
  elevador.
- Clique no mapa: marca um pino; não anda sozinho (o mapa é leitura, não
  teletransporte).
- Legenda com cores e símbolos; filtros por tipo.
- O item "mapa de cartógrafo" revela contornos; a bússola aponta o norte e a
  boca mais próxima.

## 12. Cidade e serviços

- Praça central com placas e ícones; cada serviço tem uma porta e um NPC.
- Forja: receitas em cards, material na mão, botão "forjar", resultado na hora.
- Alquimia: poções/runas com efeito e duração.
- Encanto: peça + encanto + custo; confirmação clara; sem risco.
- Horta: canteiros visuais, estado e tempo; plantar/colher com um toque.
- Canil: bicho, vínculo, ração; sem fome punitiva.
- Banco: guardar, retirar, trocar; sem leilão global.
- Taverna: descansar (vida cheia, respawn), ouvir rumor, montar party.
- Guilda: missões, reputação, sala de estudo.
- Arena: duelo opt-in, treino, ranking local opcional.

## 13. Diálogo

- Retrato pixel, nome, uma fala curta por vez, opções claras.
- Opções com consequência: perguntar, aceitar, recusar, usar domínio
  (se o jogador já domina o conceito, uma opção extra).
- Missão: gancho, objetivo, recompensa, "aceitar" explícito.
- Sem parede de texto; o NPC pode repetir e aprofundar se o jogador quiser.
- O NPC lembra do que o jogador fez; a saudação muda.

## 14. Social

- Chat da sala, DMs, lista de quem está por perto; já existe.
- Party: convite, vida, mapa, caçada; até 4.
- Guilda: nome, marca, membros, missões, sala; sem imposto.
- Arena: duelo opt-in, regras claras, sem perda.
- Salas de estudo: mesa, pergunta compartilhada, caderno do grupo; sem voz
  obrigatória.
- Segurança: denúncia, bloqueio, moderação, privacidade; nada de conteúdo de
  fora.

## 15. Onboarding

- Primeiros 10 minutos sem parede de texto: andar, conversar, primeira caçada,
  primeira poção, primeiro mapa.
- Cada sistema aparece quando é necessário, com uma dica curta e uma prática.
- O jogador pode pular o tutorial e voltar depois.
- A primeira morte é ensinada como pausa, não fracasso.

## 16. Mobile

- Direcional na esquerda, ações na direita (A interagir, Turbo, mapa, ficha).
- Toque no chão anda; toque no objeto interage; toque no bicho inicia.
- Batalha de grupo em lista vertical; pergunta ativa no topo; trocar de alvo
  por aba.
- Ficha e mochila em tela cheia com rolagem; botões grandes.
- HUD recolhível; mapa em tela cheia.
- Performance: 60 fps no desktop, 30 fps estável no celular médio; minimapa a
  5 fps; sem partículas pesadas.
- Testar em tela pequena, com uma mão, com sol na tela (contraste).

## 17. Acessibilidade

- Fonte 3 tamanhos; contraste alto; paletas para daltonismo.
- Movimento reduzido; sem flash; tremor desligável.
- Sem cronômetro por padrão; modo fluência opcional.
- Leitura em voz alta da pergunta (Web Speech API quando disponível).
- Navegação por teclado em todos os painéis; foco visível.
- Leitor de tela: HTML semântico, rótulos, ordem lógica; o canvas do mundo tem
  resumo textual do entorno.
- Legendas e avisos sonoros visuais.
- Sem dependência de cor, som ou reflexo para vencer.

## 18. Estados vazios, erro e offline

- Vazio: uma dica e um próximo passo, nunca tela em branco.
- Erro de rede: o jogo continua solo; a Rede avisa e reconecta.
- Save: versão, migração, aviso se falhar; exportar/importar manual.
- Conteúdo faltando: a pergunta não aparece; o jogo mostra "em revisão" e não
  trava.
- Batalha perdida por conexão: o estado é restaurado; sem punição.

## 19. Regras de UX

- Custo sempre visível antes de confirmar.
- Destrutivo só com confirmação; o resto tem desfazer.
- Atalhos consistentes e mostrados no botão.
- Nada de cooldown escondido; nada de loot box.
- Texto curto, voz ativa, português do Brasil.
- Toda tela nova tem que responder: "o que eu faço agora?".
- Se um sistema precisa de tutorial de 10 minutos, o sistema está errado.

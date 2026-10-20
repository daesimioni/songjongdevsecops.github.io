# Itens: ferramentas de pensamento

Equipamento no Mundo de Song não é número maior. É uma forma de olhar o
problema. Cada peça responde a uma pergunta: "que tipo de estudante eu quero ser
hoje?".

## 0. O que já existe (2026-10-20)

- 8 espaços equipáveis (arma, elmo, armadura, pernas, botas, escudo, anel,
  colar), 49 peças com bônus passivo e 6 runas consumíveis.
- Cada continente tem arma, armadura e uma peça de acessório ou escudo; as
  áreas temáticas acrescentaram mais três peças cada.
- Acesso: baú de caverna, chefe, forja (materiais) e loja da mestra na cidade
  subterrânea. O bônus entra em `RPG.equipmentBonus()` e para no teto de +4 de
  dano e +16 de vida por conjunto.
- Runas: faísca, trovão, fogo, gelo, cura e espelho. O primeiro uso aprende a
  magia; depois ela sai por mana (2 a 4), sem gastar a carga.
- O que falta do desenho abaixo: capa, conjuntos de 3 peças, ofícios por
  continente e leilão. Nada disso está implementado.

## 1. Slots

| slot | o que faz | exemplos |
|---|---|---|
| arma | define o estilo de dano e o formato de pergunta favorecido | espada, clube, machado, arco, varinha, cajado |
| escudo | bloqueia um erro de um tipo por batalha | broquel, escudo de kite, escudo de torre |
| capacete | visão, foco, resistência a confusão | capuz, elmo, coroa |
| armadura | vida e defesa; resistência a tipos de erro | túnica, cota, manto |
| pernas | velocidade e esquiva | calças, grevas, saiote |
| botas | terreno, silêncio, velocidade | sandálias, botas, botas de veio |
| colar | memória, dica, vínculo, mana | colar de contas, amuleto, gargantilha |
| anel | hábito, sorte, dano, revisão | anel de cobre, anel de selo, anel de luz |
| capa (fase 2) | cosmético + um passivo de viagem | capa de cartógrafo, manto de chuva |

Regra: **nada de slot vazio punindo**. O jogador começa com espada de madeira,
túnica de viagem e sandálias; os outros slots abrem naturalmente.

## 2. Atributos

Poucos e legíveis:

- **vida** (HP), **mana**, **dano**, **defesa**;
- **velocidade** (mundo e fuga), **visão** (raio de luz e cone),
- **foco** (cargas de dica por descanso), **sorte** (loot e variantes raras);
- resistências por tipo de erro: cálculo, unidade, definição, sintaxe,
  equilíbrio, intervalo, atenção.

Tipos de erro vêm das misconceptions do banco de perguntas. Um elmo que
"resiste a confusão" reduz o dano de erros de definição; uma bota que "silencia"
reduz a audição do bicho.

## 3. Armas

Seis categorias, cada uma com uma identidade e uma afinidade de formato.

| arma | identidade | afinidade | fraqueza |
|---|---|---|---|
| espada | equilibrada, combo | múltipla escolha e aplicar | sem especialidade |
| clube | impacto, interrompe special | verdadeiro/falso, definição | lenta, menos alvos |
| machado | área, sangra grupo | ordenar, causa e efeito | dano menor no alvo único |
| arco | precisão, ponto fraco | transferência, prever | exige linha de visão |
| varinha | elemental, mana | numérico, unidades | pouca vida/defesa |
| cajado | apoio, dica, cura | explicar, síntese | dano baixo |

Tiers: **noviço** (madeira/bronze), **aprendiz** (ferro), **estudioso** (prata e
essência), **mestre** (cristal), **lendário** (relíquia). Cada continente tem um
tema visual e um passivo de continente.

Exemplos de nomes (um por categoria e continente, para dar identidade):

| continente | espada | clube | machado | arco | varinha | cajado |
|---|---|---|---|---|---|---|
| Computação | Lâmina de Cobre | Martelo de Clock | Machado de Barramento | Arco de Pulso | Varinha de Silício | Cajado do Compilador |
| Matemática | Espada da Razão | Clava do Axioma | Machado Fractal | Arco de Compasso | Varinha do Infinito | Cajado da Prova |
| Física | Lâmina de Vetor | Martelo de Massa | Machado de Entropia | Arco de Órbita | Varinha de Fóton | Cajado do Campo |
| Química | Espada de Valência | Clava do Reagente | Machado de Ligação | Arco de Cristal | Varinha de pH | Cajado do Equilíbrio |
| Música | Lâmina de Compasso | Clava do Tambor | Machado de Dissonância | Arco de Corda | Varinha de Timbre | Cajado da Harmonia |
| IA | Espada de Token | Clava de Peso | Machado de Gradiente | Arco de Atenção | Varinha de Vetor | Cajado da Rede |

Cada arma tem 3 a 5 variantes por tier, com um passivo curto:

- espada: "a cada 2 acertos seguidos, +1 de dano";
- clube: "acerto em pergunta de definição interrompe o special";
- machado: "acerto atinge os outros alvos com 50% do dano";
- arco: "pergunta de transferência causa +50% e ignora 1 de defesa";
- varinha: "pergunta numérica dá +1 mana e +1 de dano elemental";
- cajado: "explicação certa dá 1 carga de dica ao grupo".

## 4. Armaduras, capacetes, pernas e botas

Conjuntos por continente, com tema e passivo de 3 peças. Exemplo:

| conjunto | peças | bônus de 3 peças | resistência |
|---|---|---|---|
| Circuito (CS) | capuz, túnica, calças, botas | +1 dica em pergunta de código | sintaxe |
| Axioma (Math) | elmo, manto, grevas, sandálias | +1 tolerância numérica | cálculo |
| Campo (Física) | óculos, casaco, calças, botas | +1 visão e +5% velocidade | unidade |
| Reagente (Química) | máscara, avental, calças, botas | +10 vida e +1 poção | equilíbrio |
| Harmonia (Música) | tiara, casaco, saia, sapatos | +5 mana e +1 dica | intervalo |
| Rede (IA) | capuz, manto, calças, botas | +1 sorte e +5% loot | atenção |
| Porto (Hub) | chapéu, túnica, calças, sandálias | +5 vida, +1 velocidade | nenhuma |

Cada peça tem 3 tiers (aprendiz, estudioso, mestre); o lendário é único e vem de
chefe/quest. As resistências reduzem o dano de erro daquele tipo, não o dano
físico.

Capacetes variam em **visão** (cone e luz), **foco** (dica) e **resistência a
confusão** (opções embaralhadas). Pernas variam em **velocidade** e **esquiva**
(especial do bicho). Botas variam em **terreno** (areia, pedra, neve, água rasa),
**silêncio** (audição) e **velocidade**.

## 5. Escudos

| escudo | bloqueios | especial |
|---|---|---|
| broquel | 1 erro de cálculo | leve, não atrasa |
| escudo de kite | 1 erro de unidade ou definição | equilibrado |
| escudo de torre | 1 erro de qualquer tipo, mas -1 velocidade | pesado |
| escudo de espelho | reflete o próximo special | raro, chefe de IA |
| escudo de coral | cura 5 ao bloquear | raro, Química |

O escudo quebra ao bloquear e é reparado na cidade (custo baixo) ou com kit.
Não há durabilidade diária; só o bloqueio consome.

## 6. Colares e anéis

Passivos pequenos, mas que mudam a sessão:

| colar | efeito |
|---|---|
| Contas de Estudo | +1 carga de dica por descanso |
| Amuleto da Memória | revisão do caderno rende +1 domínio |
| Gargantilha do Bicho | +1 vínculo por ração |
| Colar de Luz | +1 visão na caverna |
| Medalhão do Grupo | cura 5 ao terminar batalha em party |

| anel | efeito |
|---|---|
| Anel de Cobre | +1 dano em perguntas de reconhecimento |
| Anel de Selo | +5% de loot |
| Anel de Luz | tocha dura +30 s |
| Anel de Hábito | primeira pergunta do dia dá +2 domínio |
| Anel de Sorte | 1 variante rara por sessão |
| Anel do Silêncio | audição dos bichos -1 |

Um colar + um anel equipados; trocar é livre fora de combate. Nada de conjunto
obrigatório; os anéis são para experimentar.

## 7. Magias

Magia é uma **estratégia de estudo** com custo. Escolas: Lógica (CS/Math),
Matéria (Física/Química), Expressão (Música/IA/Hub).

| magia | escola | efeito | custo |
|---|---|---|---|
| Luz | Expressão | revela o mapa e o cone por 30 s | 2 mana |
| Contraexemplo | Lógica | elimina uma opção errada | 3 |
| Dedução | Lógica | mostra a definição do conceito | 2 |
| Unidade | Matéria | confere a unidade da resposta numérica | 2 |
| Escudo | Matéria | bloqueia 1 erro até o fim da batalha | 4 |
| Cura | Expressão | cura 15 + nível | 3 |
| Purificar | Matéria | remove confusão/silêncio/peso | 3 |
| Síntese | Lógica | liga dois conceitos; +dano em transferência | 5 |
| Inspiração | Expressão | +1 dica grátis | 2 |
| Mapa | Expressão | desenha a sala no minimapa | 2 |
| Tempo | Lógica | pausa o cronômetro opcional por 15 s | 2 |
| Salto | Matéria | recua 3 tiles, saindo do cone | 4 |

Cada magia é aprendida com um NPC/estação e sobe de nível (1 a 3): alcance,
duração, número de usos. Não há árvore de 50 nós; são 12 ferramentas.

## 8. Runas

Runas são magias consumíveis, feitas na alquimia. Servem para quem não quer
gastar mana ou para emergência.

| runa | efeito | receita |
|---|---|---|
| Runa de Luz | tocha de 2 min | veio 1 + erva 1 |
| Runa de Contraexemplo | elimina 1 opção | veio 2 + ferro 1 |
| Runa de Cura | cura 25 | erva 2 + caldo 1 |
| Runa de Escudo | bloqueia 1 erro | ferro 1 + veio 2 |
| Runa de Unidade | confere unidade | veio 1 + cristal 1 |
| Runa de Fuga | sai do encontro comum | madeira 1 + veio 1 |
| Runa de Grupo | dá 1 dica a todos da party | erva 2 + veio 2 |

## 9. Poções e comida

| item | efeito | duração |
|---|---|---|
| Poção de Café | cura 18 | imediato |
| Caldo de Caverna | cura 35 | imediato |
| Café da Madrugada | cura 5, +30% velocidade | 90 s |
| Assado de Fundo de Mina | cura 45, +1 dano | 180 s |
| Doce de Erva | cura 15, +5 vida máxima | 180 s |
| Poção de Mana | +10 mana | imediato |
| Elixir de Foco | +2 dicas | até descansar |
| Poção de Resistência | -50% dano de um tipo de erro | 120 s |
| Poção da Sorte | +1 variante rara | 1 batalha |

Comida não substitui estudo: os buffs são pequenos e temporários; a vida e o
domínio continuam sendo o centro.

## 10. Crafting, encantamento e ofícios

Estações na cidade (superfície e subsolo):

- **Forja:** armas, armaduras, ferramentas (picareta, anzol, panela).
- **Alquimia:** poções, runas, essências.
- **Mesa de encanto:** encantos permanentes em peças.
- **Cozinha:** comida e buffs.
- **Horta:** sementes, ervas, ingredientes.
- **Canil/Estábulo:** ração, vínculo, bicho.
- **Bancada de cartografia:** mapas, marcadores, bússola.

Cada ofício tem 3 tiers; subir exige receitas, materiais e uma pequena tarefa
(um pedido de NPC, uma pergunta prática). Nada de "craftar 100 vezes a mesma
coisa" para subir.

### Encantos

| encanto | efeito | custo |
|---|---|---|
| Vigor | +10 vida máxima | veio 4 + erva 4 |
| Furor | +1 dano por acerto | veio 5 + ferro 5 |
| Luz | +3 raio de luz | veio 3 + madeira 3 |
| Memória | 1 revisão extra por dia | veio 3 + erva 3 |
| Pele | -1 dano de erro | ferro 4 + madeira 2 |
| Pressa | +10% velocidade | madeira 3 + veio 2 |
| Sorte | +10% loot | veio 4 + cristal 1 |
| Vínculo | bicho ganha +1 vida | erva 3 + veio 2 |
| Silêncio | audição dos bichos -1 | madeira 3 + erva 2 |
| Foco | +1 dica por descanso | veio 4 + erva 4 |
| Chama | tocha +60 s | veio 2 + madeira 2 |
| Eco | 1 dica de graça por batalha | cristal 1 + veio 3 |

Cada peça aceita 1 encanto; trocar custa materiais, não perde a peça. Sem risco
de quebrar; o jogo não precisa de cassino.

### Agricultura

- 6 culturas: erva, café, trigo, cogumelo, flor-de-veio, raiz.
- Cada canteiro tem estado (vazio, crescendo, pronto), tempo real e colheita.
- Sementes vêm da colheita, de baús e da forja.
- Estações do ano? Não. O tempo real basta; o jogador não deve esperar demais.
- A horta da cidade é o tutorial; fazendas maiores no subsolo produzem em escala.

### Culinária

- 15 receitas; cada uma cura e/ou dá um buff curto.
- Ingredientes: colheita, carne de bicho, leite, mel, cristal.
- Receitas de festa para party: buff de grupo, uma vez por dia.

### Adestramento

- 6 bichos: gato (luz), morcego (visão), raposa (loot), sapo (poção), coruja
  (dica), besouro (defesa).
- Vínculo 0 a 3; cada ração +1; no 3, segue e dá o passivo.
- O bicho não morre; se o jogador cai, ele volta ao canil.
- Cuidar é opcional; não há fome que mata, só vínculo.

## 11. Economia

- **Selos:** moeda principal, de missões, bichos e baús.
- **Materiais:** ferro, erva, veio, madeira, cristal, carne, semente.
- **Essências:** de bichos raros, para encanto e runas.
- **Relíquias:** de chefe, para desbloquear rota/poder único.
- **Fragmentos de conceito:** colecionáveis de estudo; completam o caderno.

Fontes: missões, bichos, baús, veios, horta, ofícios, exploração.
Sorvedouros: forja, encanto, poções, chaves, viagem rápida, cosmético, canil,
mapas, entrada de arena.

Sem leilão global, sem inflação de ouro, sem pay-to-win. Preços fixos por
região e um mercador que troca material por material. O jogador nunca fica
preso por falta de dinheiro; se faltar, há sempre uma tarefa simples.

## 12. Progressão de equipamento

- **Tier 1 (noviço):** cidade inicial, nível 1 a 5.
- **Tier 2 (aprendiz):** primeira caçada e caverna, nível 5 a 15.
- **Tier 3 (estudioso):** segunda ilha, nível 15 a 25.
- **Tier 4 (mestre):** subsolo e chefe, nível 25 a 35.
- **Tier 5 (lendário):** Grande Prova, nível 35+.

Cada tier pede materiais e uma **prova prática** curta (uma pergunta de
transferência ou um instrumento da estação). Assim o equipamento também ensina.

## 13. Builds de exemplo

- **Estudioso:** cajado + colar de dica + anel de memória + armadura Axioma.
  Pouco dano, muitas dicas, sobrevive a erro; bom para revisar.
- **Guardião:** clube + escudo de torre + armadura Reagente + bota de silêncio.
  Aguenta erro, interrompe special, abre caminho no grupo.
- **Duelista:** espada + anel de dano + armadura Circuito + bota de velocidade.
  Combo, mobilidade, dano alto; exige acerto consistente.
- **Batedor:** arco + capuz de visão + bota de terreno + anel de sorte.
  Acha baús, evita cone, ataca ponto fraco.
- **Suporte:** cajado + colar de grupo + runas de cura/escudo; essencial em party.

## 14. Esquema e alvos

Cada item é dado, não código:

```
{ id, nome, slot, categoria, tier, continente, raridade,
  stats: { vida, mana, dano, defesa, velocidade, visao, foco, sorte },
  resistencias: { calculo, unidade, definicao, sintaxe, equilibrio, intervalo, atencao },
  passivo, receita, lore }
```

Alvos iniciais: 150 itens, 12 encantos, 12 magias, 7 runas, 9 poções, 15 comidas,
6 bichos, 6 culturas, 3 tiers de ofício. O suficiente para o jogador montar
personagens diferentes sem se afogar em planilha.

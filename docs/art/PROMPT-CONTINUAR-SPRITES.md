# Prompt para continuar o trabalho em outra conta

Copie o texto abaixo. Os ZIPs estão públicos no GitHub: não é necessário anexá-los.

```text
Execute a adaptação autoral INTEGRAL dos sprites do The Learning Valley.
Destino: https://github.com/songjongdevsecops/songjongdevsecops.github.io

Trabalhe pelo GitHub conectado nesta conta: crie/use um fork próprio e abra
pull requests do fork para a main do repositório de destino. Não faça push direto
nem merge na main de destino. Preserve alterações recentes do proprietário.

COMECE PELO ESTADO ATUAL
Leia README, AGENTS.md, docs/art/SPRITES-PENDENTES.md,
docs/art/sprites-status.json e docs/art/ORIGINAIS-REFERENCIAS.md. Confira os PRs
#12, #13 e #14 e os PRs posteriores antes de repetir ou sobrescrever trabalho.
Se os documentos novos ainda não estiverem em main, consulte a branch
docs/originais-referencias. Eles devem bastar para continuar sem o chat anterior.

Use GPT 6.1 Sol, modo leve, COM ferramenta real de geração de imagens e inspeção
visual. Não atribua nem delegue a produção visual ao DeepSeek ou a agentes sem
geração de imagens. Se essa capacidade faltar, registre o bloqueio; não simule
a entrega com receitas genéricas, recolorações, rotações ou cópias dos originais.

RECUPERE AS ARTES ORIGINAIS
Todos os dados dos três ZIPs estão públicos em:
https://github.com/songjongdevsecops/songjongdevsecops.github.io/tree/127bb12311545137a64e059fe7b816a289766517/originals

Leia as instruções desse diretório. Use o script verificado para recuperar
magias.zip, criaturas.zip e sprites-completos.zip, reunindo as 63 partes e
conferindo os hashes. No projeto atualizado:
python3 tools/references/download-originals.py --destination ../original-art-references

Se o script não estiver no checkout, obtenha originals/download.py no commit
127bb12311545137a64e059fe7b816a289766517 do repositório de destino. Não precisa
de anexos deste chat nem de acesso à conta original. Não use a branch de
armazenamento references/original-art-archives como base de PRs nem a integre
em main. Os originais são referências e não devem entrar no build do jogo.

O QUE REALMENTE FALTA
A biblioteca anterior inventariou 264.075 referências e gerou 218.769 receitas
procedurais, com 45.306 aliases. Isso NÃO representa artes individuais completas.
O checkpoint registra zero adaptações individuais integralmente concluídas e
um estudo de lobo em oito vistas, sem ciclos completos ou integração, no PR #13.
Confira atualizações antes de trabalhar. Testes técnicos não aprovam arte.

Produza versões próprias de TODAS as referências dos três ZIPs: cada arquivo,
seus detalhes relevantes, variantes e quadros. Use o índice completo
docs/art/referencias/cobertura-*.ndjson.gz.txt para não perder nenhuma referência.
Não reduza o trabalho a amostras, famílias representativas ou uma única coleção.

O escopo abrange todas as 18 categorias: criaturas, componentes, terrenos,
magias, efeitos, projéteis, interface, cartografia, vegetação, equipamentos,
armas, construções, mobiliário, alimentos, documentos, recipientes, recursos e
vazios. Fragmentos devem ter destino explícito em montagens ou módulos próprios;
transparências/vazios devem ser classificados e justificados, nunca descartados
silenciosamente nem preenchidos com arte inventada para inflar cobertura.

Inclua pisos/bordas/transições, muros, mar/água, plantas/árvores/flores/grama,
ataques próprios de todas as criaturas, fogo/gelo/morte/terra/energia/físico/água
e demais elementos pertinentes, projéteis e ataques em área, linhas e diagonais,
além das animações ambientais e climáticas necessárias, como chuva, vento e
eclipse. Mapeie explicitamente as entregas adicionais necessárias ao pedido.

Tudo que se move precisa de oito direções reais e congruentes: frente, trás,
esquerda, direita e quatro diagonais. Criaturas precisam de repouso, caminhada,
ataque próprio, impacto e morte em todas essas direções, com outros estados
quando exigidos pelo comportamento. Para pisos, ícones e objetos estáticos,
produza as vistas, conexões e animações aplicáveis; não force vistas sem função.

Crie arte nova coerente com o estilo atual do jogo, detalhada e legível, com
leitura de movimento adequada a um RPG como Tibia. Não copie os bitmaps nem
troque criaturas distintas por um modelo genérico com nomes diferentes. Rotação
plana não cria vista traseira; espelhamento não resolve assimetrias.

EXECUTE POR COLEÇÕES E ENVIE PRs
Mapeie todo o escopo em coleções e subcoleções rastreáveis. Conclua cada uma de
ponta a ponta: referências → arte própria → vistas → ciclos → atlas/âncoras/
durações → colisões aplicáveis → integração ou biblioteca futura → revisão
visual em cena → validação → registro → PR.

Ao concluir CADA coleção/subcoleção, faça commits em português no fork e abra
um PR para o repositório de destino. Inclua fontes atendidas, arquivos, imagens
e animações reais, integração, testes e pendências. Prefira PRs independentes;
documente dependências inevitáveis, sem reenviar os mesmos commits em vários PRs.
Não espere todo o acervo para enviar o primeiro PR. Após enviar um, continue as
outras coleções enquanto houver capacidade de execução.

Este prompt autoriza criar o fork, produzir artes, modificar o código no fork,
commitar e abrir os PRs necessários; não autoriza fazer merge no destino. Não
peça confirmação para cada lote reversível. Não encerre no lobo, no inventário
ou nas ferramentas. Faça a produção e integração efetivas.

QUALIDADE, REGISTRO E CONCLUSÃO
Inspecione os resultados reais do gerador: dimensões, grade, anatomia, vistas,
transparência, escala, paleta, luz, âncora e continuidade entre quadros. Rejeite
folhas quebradas ou ciclos sem movimento congruente. Guarde arquivos finais no
projeto e verifique o uso no motor, inclusive diagonais, desktop/touch, redução
de movimento, colisões e carregamento. Preserve saves, regras e balanceamento.

Registre por referência ZIP+caminho exato, ID, arquivos/hashes, estado real,
vistas, ciclos/quadros/durações/âncora, colisão, uso no motor ou destino futuro,
evidências visuais, pendências, commit, PR e próximo passo. Só reúna duplicatas
após comparação real, mantendo todos os vínculos. Animações não são duplicatas
por compartilharem a primeira imagem. Amplie o acompanhamento inicial quando
necessário; não altere contadores para fabricar conclusão.

Execute npm run validate, as verificações do acervo e os testes apropriados às
mudanças. Inspecione imagens e animações no motor: testes de renderização não
comprovam fidelidade, qualidade artística ou completude individual.

Só declare a tarefa integral concluída quando TODAS as referências tiverem
destino autoral completo, rastreável e verificado, com todas as vistas e ciclos
aplicáveis, e todas as coleções tiverem sido enviadas em PRs. Se esgotar créditos,
ferramentas ou execução, envie o progresso real em commits/PRs, atualize o guia
com IDs exatos seguintes e bloqueios, e mantenha o restante pendente. Não prometa
continuação em segundo plano depois de encerrar a sessão.

Comece recuperando os três ZIPs e conferindo o repositório atual. Depois execute
a primeira coleção completa e prossiga pelas demais.
```

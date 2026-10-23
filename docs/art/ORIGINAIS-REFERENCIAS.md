# Referências originais completas no GitHub

Publicação autorizada pelo proprietário em 2026-10-23. Não depende de anexos de
chat, de Library ou da conta que recebeu os arquivos originalmente.

Todos os bytes dos três ZIPs originais estão na branch de armazenamento
`references/original-art-archives`, em **63 partes**, sem reduzir, converter ou
descartar imagens, detalhes ou quadros. O script entrega novamente os três ZIPs
originais, byte por byte, e confere SHA-256 de cada parte e arquivo completo.

[Arquivos públicos e instruções](https://github.com/songjongdevsecops/songjongdevsecops.github.io/tree/127bb12311545137a64e059fe7b816a289766517/originals).
[Manifesto imutável](https://github.com/songjongdevsecops/songjongdevsecops.github.io/blob/127bb12311545137a64e059fe7b816a289766517/originals/manifest.json).

| ZIP original | Bytes | Partes | SHA-256 |
|---|---:|---:|---|
| magias.zip | 1316455 | 1 | e7a6446a99fc4e9c6d5f3ab74815a6b0b9ae2b9a02452b805afd50e7255e0be1 |
| criaturas.zip | 18624681 | 3 | 72df67f1036ff828a70cd4e6a087841789894632f7d23eea679d2cc46a3a9fcb |
| sprites-completos.zip | 488360779 | 59 | db353357ddd2821657e265b42cbb04d0f3b39fcdd1b86d60b8e2e7140ed7d06e |

## Recuperação a partir do projeto

Python 3.11 ou superior, sem dependências adicionais:

```sh
python3 tools/references/download-originals.py --destination ../original-art-references
```

O destino fica fora do projeto e recebe os três ZIPs. Não os adicione ao build,
ao diretório assets ou aos PRs de produção. A recuperação pode ser retomada:
partes válidas em cache e ZIPs já conferidos são reutilizados. Um ZIP existente
com bytes incorretos é preservado e causa erro; use outro destino.

Se este documento/script ainda não estiverem em main, obtenha o script público
do commit fixo abaixo e execute fora do projeto:

```sh
mkdir -p ../original-art-references
curl -fL 'https://raw.githubusercontent.com/songjongdevsecops/songjongdevsecops.github.io/127bb12311545137a64e059fe7b816a289766517/originals/download.py' -o ../original-art-references/download-originals.py
python3 ../original-art-references/download-originals.py --destination ../original-art-references
```

O manifesto contém os caminhos e hashes de todas as partes e fixa o commit
de dados `e5332631081372ce553cc78ef66500ee806cff49`. O próprio script verifica
o hash do manifesto: `dcd7473d016879a8612337eaa9244959596c065b5246c245ebc95d053d92ec06`.
Não há workflow privilegiado de publicação instalado nem release criada para
estes ZIPs; a distribuição é feita pelas partes públicas verificadas.

## Separação entre armazenamento e trabalho

**Não faça merge da branch de armazenamento em main.** Ela contém os arquivos
grandes de referência e não é uma branch de alterações do jogo. Faça o fork e
as branches de artes a partir da main atual; consulte os originais separadamente.

Leia [o plano integral](SPRITES-PENDENTES.md) e [o prompt de continuidade](PROMPT-CONTINUAR-SPRITES.md).
Publicar os originais não conclui a adaptação autoral. Não atribuir a produção
visual ao DeepSeek ou a uma sessão sem geração de imagens.

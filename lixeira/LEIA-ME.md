# lixeira/ — protocolo

**Não existe exclusão definitiva dentro de um workspace.** O que é descartado
vem para cá, inteiro, e fica até que uma limpeza seja necessária — e a limpeza
também deixa rastro.

## Regras

1. **Nunca `rm`.** Descartou → `mv` para `lixeira/<AAAA-MM-DD>-<assunto>/`.
2. **Toda entrada tem manifesto.** `lixeira/MANIFESTO.md` ganha um bloco com:
   **pasta**, data, origem (caminho + de onde veio), motivo, em que contexto/época
   aquilo era usado, como reverter, tamanho. A linha `**Pasta:**` é a que amarra o
   registro ao que está no disco — sem ela a ferramenta de limpeza não reconhece o
   item (e por desenho não remove o que não reconhece).
3. **Nunca limpar item sem manifesto.** Item sem entrada é item que ninguém
   entende — logo, não pode ir embora.
4. **Git é a primeira camada, a lixeira é a segunda.** Antes de qualquer limpeza,
   confirme que o git já tem o histórico daquilo (`git log --all -- <caminho>`).
   Se não tiver, faça um commit do estado atual antes.
5. **Branches não se apagam no braço.** Branch antiga vira
   `lixeira/<data>-branch-<nome>.bundle` (`git bundle create … <branch>`) e sai do
   repositório só depois; volta com `git clone <bundle>`.

## Estrutura

```
lixeira/
├── LEIA-ME.md   este protocolo (versionado)
├── MANIFESTO.md catálogo do que foi descartado (versionado)
├── .gitignore   ignora o conteúdo, preserva os dois .md acima
└── <AAAA-MM-DD>-<assunto>/
```

## Ciclo de vida

- **Guardar:** mover para cá + manifesto. Custa nada além de espaço.
- **Recuperar:** `../scripts/lixeira-recuperar.sh <padrão>` — mostra o que casa,
  imprime a entrada do manifesto e restaura para o caminho de origem (ou outro).
- **Limpar:** `../scripts/lixeira-limpar.sh --idade <dias>` — lista candidatos
  **junto com o manifesto**; só remove com `--confirmar`, e só depois de conferir
  que o git guarda o histórico. Sem `--confirmar`, é só relatório.

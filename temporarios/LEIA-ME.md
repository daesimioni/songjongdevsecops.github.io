# temporarios/ — área de trabalho descartável

Coisa temporária **nunca** vai para `/tmp`, `/var/tmp` ou `~/tmp`. Vai aqui.

## Por quê

`/tmp` some no reboot e fica invisível para a próxima sessão do agente. Aqui o
temporário fica auditável, datado e sob o mesmo protocolo da lixeira — dá para
voltar nele depois, entender o que era e descartar com contexto.

## Regras

1. Cada tarefa/experimento ganha uma pasta: `temporarios/<AAAA-MM-DD>-<assunto>/`.
2. Nada de arquivo solto na raiz de `temporarios/`.
3. Promover para o workspace = **mover de verdade** (para fora daqui) e commitar.
   Copiar deixa duas verdades.
4. Descartar = mover para `../lixeira/` com entrada no manifesto. Nunca `rm -rf`.
   `temporarios/` é o único lugar onde esvaziar direto para a lixeira é aceitável —
   desde que a entrada do manifesto diga o que era.
5. `temporarios/` não vai para o git (só este LEIA-ME).

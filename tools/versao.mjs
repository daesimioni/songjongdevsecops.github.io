// Gera versao.json: a impressão digital dos arquivos que o jogo carrega, mais
// a lista deles. O cliente compara a versão de tempos em tempos e, quando
// muda, baixa a lista com cache: reload e recarrega sem perder a sessão.
import { createHash } from "node:crypto";
import { execFileSync } from "node:child_process";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export const CAMINHOS_DA_VERSAO = ["index.html", "sprites.html", "css", "src", "assets"];

export function arquivosDaVersao(raiz = process.cwd()) {
  const saida = execFileSync("git", ["ls-files", "-z", "--cached", "--others", "--exclude-standard", "--", ...CAMINHOS_DA_VERSAO], {
    cwd: raiz,
    encoding: "buffer",
    maxBuffer: 16 * 1024 * 1024,
  });
  return saida.toString("utf8").split("\0").filter(Boolean).filter(file=>!file.startsWith("assets/reference-art/")||file.endsWith("/manifest.json")).sort();
}

export function versaoDosArquivos(raiz, arquivos) {
  const hash = createHash("sha256");
  for (const arquivo of [...arquivos].sort()) {
    hash.update(arquivo);
    hash.update("\0");
    hash.update(fs.readFileSync(path.join(raiz, arquivo)));
    hash.update("\0");
  }
  return hash.digest("hex").slice(0, 16);
}

export function textoDaVersao(raiz, arquivos = arquivosDaVersao(raiz)) {
  return `${JSON.stringify({ versao: versaoDosArquivos(raiz, arquivos), arquivos }, null, 1)}\n`;
}

function principal() {
  const raiz = process.cwd();
  const arquivos = arquivosDaVersao(raiz);
  const texto = textoDaVersao(raiz, arquivos);
  const destino = path.join(raiz, "versao.json");
  const atual = fs.existsSync(destino) ? fs.readFileSync(destino, "utf8") : "";
  if (atual === texto) {
    console.log(`versao em dia: ${JSON.parse(texto).versao} (${arquivos.length} arquivos)`);
    return;
  }
  fs.writeFileSync(destino, texto);
  console.log(`versao publicada: ${JSON.parse(texto).versao} (${arquivos.length} arquivos)`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) principal();

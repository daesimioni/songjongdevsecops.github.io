# Expansão de referências

Os três ZIPs fornecidos foram inventariados por inteiro: **264.075 arquivos
visuais**, **218.769 receitas nativas** e **45.306 aliases de imagens repetidas**.
São receitas procedurais, não 218.769 objetos desenhados individualmente.
Os fragmentos técnicos do atlas permanecem componentes para composição; não
recebem nomes de monstros completos nem colisores fictícios.

Execute `npm ci`, `npm run dev` e abra `/tools/reference-art.html`. A galeria
permite navegar por categorias e páginas de 24 entradas, abrir IDs, escolher
vistas/poses e suspender animação. A preferência de movimento reduzido é
respeitada. O catálogo anterior continua em `/tools/sprite-library.html`.

## Como foi adaptado

Cada arquivo visual tem uma correspondência no índice `cobertura-*.ndjson.gz.txt`:
`[ZIP, membro exato, ID nativo, largura, altura, quadros]`. Arquivos estáticos
iguais são deduplicados pelos pixels decodificados; animações são identificadas
pelo arquivo completo, preservando animações diferentes com início igual.
O primeiro quadro visível é usado quando uma animação começa transparente.

Semântica, proporções e regiões de materiais em grade 16×16 orientam desenhos
novos com a paleta e os volumes do jogo. Atores usam rigs articulados em oito
direções com repouso, caminhada, ataque, impacto e morte. Objetos reconhecidos
usam modelos do kit nativo com oito rotações; formas desconhecidas viram relevos de volumes e
materiais para composição. Magias oferecem ícone e efeito; projéteis e efeitos
seguem as oito direções do movimento. Pisos são interpretados como planos do
chão. Plantas conhecidas usam os ciclos de animação do kit.

As receitas não preservam literalmente todos os detalhes ou coreografias das
referências. Modelos são compartilhados entre famílias: imagens diferentes
podem resultar em desenhos semelhantes. Não houve curadoria artística manual
individual das 218 mil receitas. Classificações inferidas e fragmentos precisam
de revisão do autor ao montar cenas. Não são substitutos automáticos de todos
os assets já existentes nos mapas, nem definem IA ou habilidades jogáveis.

Os bitmaps originais não são distribuídos. As pranchas são geradas pelos
renderizadores do jogo, sem usar imagens dos ZIPs.

## Integração

```js
import {createReferenceLibrary} from './src/platform/reference-art.js';
import {drawReference} from './src/rendering/reference-art/index.js';
const library = createReferenceLibrary();
const definition = await library.asset(id); // arte/<categoria>/<chave>
if (definition) drawReference(ctx, definition, x, y, {
  direction: 7, state: 'walk', tempo: milliseconds,
});
```

Escolha direções entre `definition.orientations` e poses em `definition.states`,
quando houver. Morte e impacto param no último quadro. Em poses de ação, `tempo` é o tempo
decorrido desde o início da pose; ciclos podem receber um relógio contínuo. Para magias, escolha
`mode: 'icon'` ou `mode: 'effect'`. `referenceBodies` fornece corpos dos atores
e partes sólidas de móveis conhecidos, nas mesmas unidades em tiles do jogo.
Fragmentos e objetos não reconhecidos exigem montagem e corpo definidos pela
cena. Mapas, saves, encontros e inventários existentes não são modificados.

O carregamento é explícito e sob demanda. A importação dos módulos não baixa
os pacotes. Cada página é verificada por SHA-256, tamanho, esquema, ordenação e
intervalo de IDs. Cache de dados: oito páginas/4 MiB; cache raster: até 512
entradas/12 MiB. O atualizador baixa o manifesto, que contém os hashes, e deixa
os pacotes para quando forem solicitados.

Pacotes são gzip codificado em base64 textual, formato que permite transferência
por lotes e checkpoints Git. A codificação adiciona aproximadamente 33% ao gzip;
o limite de cache usa o tamanho JSON descomprimido. Nenhum ZIP original é
necessário em tempo de execução.

## Reprodução e verificação

Use Python 3.11+, Pillow e os três arquivos originais fora do repositório:

```bash
python -m pip install -r tools/references/requirements.txt
python tools/references/compile.py /entrada/magias.zip /entrada/criaturas.zip /entrada/sprites-completos.zip
npm run art:references
node tools/references/check.mjs --all
node tools/references/render.mjs
npm run validate
```

Os hashes dos arquivos de entrada e os totais por categoria estão em
`assets/reference-art/manifest.json`. O compilador não executa conteúdo dos
arquivos: lê imagens e nomes, escolhe representantes de duplicatas e escreve
receitas e auditoria determinísticas. Os arquivos de auditoria e as pranchas
não entram em `dist/`.

A checagem normal verifica todos os dados e todas as correspondências, além de
renderizar representantes de famílias, formas, elementos, vistas, poses e
quadros extremos. `--all` acrescenta uma vista base de cada receita restante.
Pixels válidos não comprovam qualidade artística nem substituem revisão manual
em navegador, desktop e toque.

![Amostras do catálogo](catalogo.png)
![Atores em oito vistas](criaturas-oito-vistas.png)

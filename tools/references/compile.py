"""Compile all visual references into native, palette-independent recipes.

Inputs remain outside git. Packages are deterministic, independently verifiable data.
Static images deduplicate by decoded pixels; animations by their complete file.
"""
import argparse
import base64
import colorsys
import gzip
import hashlib
import io
import json
from pathlib import Path
import re
import struct
import unicodedata
import zipfile
from PIL import Image

GRID = 16
VISUAL = {'.png', '.gif', '.jpg', '.jpeg', '.psd'}
MATERIALS = ['vazio', 'stone', 'wood', 'leather', 'leaf', 'cloth', 'water', 'glass', 'iron', 'gold', 'clay', 'paper', 'purple', 'fire', 'sand', 'ice']


def normalized(value):
  try:
    value = value.encode('cp437').decode('utf8')
  except (UnicodeError, LookupError):
    pass
  return ''.join(c for c in unicodedata.normalize('NFD', value.lower()) if not unicodedata.combining(c))


def category(path, archive):
  name = normalized(path)
  if archive == 'magias.zip':
    return 'magias'
  if archive == 'criaturas.zip' or '/criaturas/' in name:
    return 'criaturas'
  for needle, group in [('atlas/', 'componentes'), ('interface/', 'interface'), ('mapas/', 'cartografia'), ('projeteis/', 'projeteis'), ('efeitos/', 'efeitos')]:
    if needle in name:
      return group
  for pattern, group in [('plant|flower|tree|grass|veget|natureza', 'vegetacao'), ('armor|helmet|shield|boots|equipment|armadura|capacete|escudo', 'equipamentos'), ('sword|axe|bow|weapon|arma|espada', 'armas'), ('wall|roof|door|architecture|parede|construc|porta|piso|chao', 'construcoes'), ('furniture|chair|table|bed|mobil|cadeira|mesa|cama', 'mobilia'), ('food|fruit|meal|alimento|comida|fruta', 'alimentos'), ('book|scroll|document|livro', 'documentos'), ('bottle|flask|container|recipiente|frasco|bau', 'recipientes')]:
    if re.search(pattern, name):
      return group
  return 'recursos'


def material(rgba):
  r, g, b, a = rgba
  if a < 28:
    return 0
  h, s, v = colorsys.rgb_to_hsv(r/255, g/255, b/255)
  if s < .14:
    return 11 if v > .78 else 1 if v > .4 else 8
  if h < .06 or h > .94:
    return 13 if v > .75 else 10
  if h < .14:
    return 9 if v > .75 else 2 if v > .4 else 3
  if h < .2:
    return 14
  if h < .44:
    return 4
  if h < .56:
    return 7 if v > .72 else 6
  if h < .72:
    return 15 if v > .86 else 5
  return 12


def traits(path, cat, seed):
  name = normalized(path)
  element = next((v for k, v in [('fire|flam|burn|dragon', 'fogo'), ('ice|frost|snow', 'gelo'), ('death|undead|soul|ghost', 'morte'), ('earth|terra|stone', 'terra'), ('energy|elect|lightning', 'energia'), ('water|aqua|sea|fish', 'agua'), ('wind|air', 'vento'), ('poison|venom', 'veneno'), ('holy|light|divine', 'luz')] if re.search(k, name)), 'fisico')
  species = next((v for k, v in [('dragon|drake|wyvern', 'dragon'), ('bird|eagle|owl|parrot', 'owl'), ('fish|shark', 'fish'), ('wolf|hound|dog', 'wolf'), ('cat|tiger|lion', 'lynx'), ('bear', 'bear'), ('horse|deer|stag', 'deer'), ('snake|worm|serpent', 'serpent'), ('plant|tree|ent|flora', 'treant'), ('human|orc|elf|dwarf|goblin|demon|skeleton|undead', 'goblin')] if re.search(k, name)), 'wolf')
  # Families follow the native rigs; no photographs are rotated as actors.
  family = {'dragon':'dragon', 'owl':'bird', 'fish':'aquatic', 'serpent':'serpent', 'treant':'humanoid', 'goblin':'humanoid'}.get(species, 'quadruped')
  motif = next((v for k, v in [('chair|cadeira', 'cadeira'), ('table|mesa', 'mesa-jantar'), ('bed|cama', 'cama-solteiro'), ('shelf|estante', 'estante-livros'), ('wardrobe|armario', 'armario'), ('barrel|barril', 'barril-medio'), ('chest|crate|bau|caix', 'caixote-medio'), ('tree|arvore', 'carvalho'), ('plant|flower|planta|flor', 'samambaia'), ('wall|parede', 'parede-pedra'), ('door|porta', 'porta-madeira'), ('roof|telha', 'telhado-telha'), ('book|livro', 'pilha-livros') ] if re.search(k, name)), '')
  return [element, species, family, motif]


def compile_archives(inputs, output, audit):
  output.mkdir(parents=True, exist_ok=True)
  audit.mkdir(parents=True, exist_ok=True)
  sources = []
  owners = {}
  raw_cache = {}
  archives = {}
  hashes = []
  def priority(archive, path):
    return (0 if archive == 'magias.zip' else 1 if archive == 'criaturas.zip' else 9 if '/atlas/' in path else 2, path)
  for source in inputs:
    archive = zipfile.ZipFile(source)
    archives[source.name] = archive
    hashes.append([source.name, hashlib.file_digest(source.open('rb'),'sha256').hexdigest()])
    files = [p for p in archive.infolist() if not p.is_dir() and Path(p.filename).suffix.lower() in VISUAL]
    for index, entry in enumerate(files):
      if entry.file_size > 64*1024*1024:
        raise ValueError('Oversized reference: '+entry.filename)
      raw = archive.read(entry)
      raw_sha = hashlib.sha256(raw).hexdigest()
      if raw_sha not in raw_cache:
        with Image.open(io.BytesIO(raw)) as image:
          width,height = image.size
          frames = getattr(image,'n_frames',1)
          pixels = image.convert('RGBA')
          identity = 'animation:'+raw_sha if frames>1 else 'image:'+hashlib.sha256(struct.pack('>II',width,height)+pixels.tobytes()).hexdigest()
        raw_cache[raw_sha] = (identity,width,height,frames)
      identity,width,height,frames = raw_cache[raw_sha]
      record = [source.name,entry.filename,identity,width,height,frames]
      sources.append(record)
      current = owners.get(identity)
      if current is None or priority(source.name,entry.filename)<priority(current[0],current[1]):
        owners[identity]=record
      if index%4000==0:
        print(json.dumps({'stage':'inventory','archive':source.name,'processed':index+1,'total':len(files)}),flush=True)
  groups = {}
  mappings = {}
  for count,(identity,record) in enumerate(owners.items()):
    archive,path,_,width,height,frames = record
    key=hashlib.sha256(identity.encode()).hexdigest()[:20]
    cat=category(path,archive)
    with Image.open(io.BytesIO(archives[archive].read(path))) as image:
      pixels=image.convert('RGBA')
      for frame in range(1,frames):
        if pixels.getbbox():
          break
        image.seek(frame)
        pixels=image.convert('RGBA')
      bbox=pixels.getbbox()
      if not bbox:
        cat='vazios'
      elif cat not in ['componentes','cartografia']:
        pixels=pixels.crop(bbox)
      cells=[material(v) for v in pixels.resize((GRID,GRID),Image.Resampling.BOX).getdata()]
      if bbox and not any(cells):
        cells[GRID*GRID//2]=1
      ratio=round(max(.25,min(4,pixels.width/pixels.height)),3)
      if cat=='componentes' and sum(bool(v) for v in cells)>=232 and .75<=ratio<=1.34:
        cat='terrenos'
      packed=bytes((cells[i]<<4)|cells[i+1] for i in range(0,len(cells),2))
      recipe=[key,base64.b64encode(packed).decode(),ratio,frames>1,*traits(path,cat,int(key[:8],16))]
      groups.setdefault(cat,[]).append(recipe)
      mappings[identity]='arte/'+cat+'/'+key
    if count%4000==0:
      print(json.dumps({'stage':'design','processed':count+1,'total':len(owners)}),flush=True)
  manifest={'version':2,'grid':GRID,'pageSize':1024,'materials':MATERIALS,'categories':{},'references':len(sources),'recipes':len(owners),'archives':hashes,'encoding':'base64-gzip'}
  for cat,rows in sorted(groups.items()):
    rows.sort(key=lambda r:r[0])
    pages=[]
    for start in range(0,len(rows),1024):
      group=rows[start:start+1024]
      plain=json.dumps(group,ensure_ascii=False,separators=(',',':')).encode()
      encoded=base64.b64encode(gzip.compress(plain,mtime=0))
      name=cat+'-'+str(start//1024).zfill(4)+'.json.gz.txt'
      (output/name).write_bytes(encoded)
      pages.append({'file':name,'first':group[0][0],'last':group[-1][0],'count':len(group),'bytes':len(encoded),'decodedBytes':len(plain),'sha256':hashlib.sha256(encoded).hexdigest()})
    manifest['categories'][cat]={'count':len(rows),'pages':pages}
  for start in range(0,len(sources),8192):
    lines=[]
    for archive,path,identity,width,height,frames in sources[start:start+8192]:
      lines.append(json.dumps([archive,path,mappings[identity],width,height,frames],ensure_ascii=False,separators=(',',':')))
    encoded=base64.b64encode(gzip.compress(('\n'.join(lines)+'\n').encode(),mtime=0))
    (audit/('cobertura-'+str(start//8192).zfill(4)+'.ndjson.gz.txt')).write_bytes(encoded)
  (output/'manifest.json').write_text(json.dumps(manifest,ensure_ascii=False,indent=2)+'\n')
  for archive in archives.values():
    archive.close()
  print(json.dumps({'references':len(sources),'recipes':len(owners)}),flush=True)


if __name__ == '__main__':
  parser=argparse.ArgumentParser()
  parser.add_argument('inputs',nargs='+',type=Path)
  parser.add_argument('--output',type=Path,default=Path('assets/reference-art'))
  parser.add_argument('--audit',type=Path,default=Path('docs/art/referencias'))
  args=parser.parse_args()
  compile_archives(args.inputs,args.output,args.audit)

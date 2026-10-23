"""Download/reassemble the three original reference ZIPs, without extracting them."""
import argparse
import hashlib
import json
from pathlib import Path
import re
import time
import urllib.request

REPOSITORY = 'songjongdevsecops/songjongdevsecops.github.io'
MANIFEST_URL = 'https://raw.githubusercontent.com/' + REPOSITORY + '/references/original-art-archives/originals/manifest.json'
MANIFEST_SHA256 = 'dcd7473d016879a8612337eaa9244959596c065b5246c245ebc95d053d92ec06'
NAMES = {'magias.zip', 'criaturas.zip', 'sprites-completos.zip'}


def digest(path):
    with path.open('rb') as stream:
        return hashlib.file_digest(stream, 'sha256').hexdigest()


def valid(path, size, sha256):
    return path.is_file() and path.stat().st_size == size and digest(path) == sha256


def download(url, target, expected_size=None):
    for attempt in range(3):
        try:
            request = urllib.request.Request(url, headers={'User-Agent': 'LearningValley-OriginalReferences/1'})
            with urllib.request.urlopen(request, timeout=60) as response, target.open('wb') as output:
                total = 0
                while block := response.read(1024 * 1024):
                    total += len(block)
                    if expected_size is not None and total > expected_size:
                        raise ValueError('Download larger than expected')
                    output.write(block)
            return
        except Exception:
            target.unlink(missing_ok=True)
            if attempt == 2:
                raise
            time.sleep(2 * (attempt + 1))


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--destination', type=Path, default=Path('../original-art-references'))
    parser.add_argument('--manifest', type=Path)
    parser.add_argument('--parts-root', type=Path, help='Use an existing checkout of the reference branch, without network')
    args = parser.parse_args()
    destination = args.destination.resolve()
    destination.mkdir(parents=True, exist_ok=True)
    if args.manifest:
        data = args.manifest.read_bytes()
    else:
        manifest_file = destination / '.manifest.download'
        download(MANIFEST_URL, manifest_file, 1024 * 1024)
        data = manifest_file.read_bytes()
        manifest_file.unlink()
    if hashlib.sha256(data).hexdigest() != MANIFEST_SHA256:
        raise ValueError('Unexpected manifest: refusing unverified references')
    manifest = json.loads(data)
    if {a['name'] for a in manifest['archives']} != NAMES or len(manifest['archives']) != 3:
        raise ValueError('Expected exactly the three original ZIPs')
    commit = manifest['dataCommit']
    if not re.fullmatch('[0-9a-f]{40}', commit):
        raise ValueError('Invalid immutable data commit')
    for archive in manifest['archives']:
        name = archive['name']
        final = destination / name
        if final.exists():
            if valid(final, archive['bytes'], archive['sha256']):
                print('Already verified:', name, flush=True)
                continue
            raise ValueError('Existing file has unexpected bytes; choose a new destination: ' + str(final))
        stage = destination / (name + '.assembling')
        try:
            with stage.open('wb') as output:
                for index, part in enumerate(archive['parts']):
                    path = part['path']
                    if not re.fullmatch(r'originals/(?:magias\.zip|(?:criaturas\.zip|sprites-completos\.zip)\.parts/[0-9]{3})', path):
                        raise ValueError('Unexpected part path')
                    if not re.fullmatch('[0-9a-f]{64}', part['sha256']):
                        raise ValueError('Invalid checksum')
                    if args.parts_root:
                        local = args.parts_root / path
                    else:
                        cache = destination / '.parts' / name
                        cache.mkdir(parents=True, exist_ok=True)
                        local = cache / str(index)
                        if not valid(local, part['bytes'], part['sha256']):
                            temporary = local.with_suffix('.downloading')
                            download('https://raw.githubusercontent.com/' + REPOSITORY + '/' + commit + '/' + path,
                                     temporary, part['bytes'])
                            if not valid(temporary, part['bytes'], part['sha256']):
                                temporary.unlink(missing_ok=True)
                                raise ValueError('Corrupt downloaded part: ' + path)
                            temporary.replace(local)
                    if not valid(local, part['bytes'], part['sha256']):
                        raise ValueError('Corrupt reference part: ' + path)
                    with local.open('rb') as source:
                        while block := source.read(1024 * 1024):
                            output.write(block)
            if not valid(stage, archive['bytes'], archive['sha256']):
                raise ValueError('Reassembled ZIP does not match original: ' + name)
            stage.replace(final)
            print('Verified original:', name, archive['bytes'], archive['sha256'], flush=True)
        finally:
            stage.unlink(missing_ok=True)


if __name__ == '__main__':
    main()

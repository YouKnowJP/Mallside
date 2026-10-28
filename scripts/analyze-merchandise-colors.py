"""Read existing catalog photographs and emit color metadata; no images are edited."""
import argparse
import collections
import hashlib
import json
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
parser = argparse.ArgumentParser(description=__doc__)
parser.add_argument('input', type=Path, help='JSON records containing type and local photo path')
args = parser.parse_args()
items = json.loads(args.input.read_text())
unique = {p['photo']: p for p in items if p.get('photo')}
palettes = {}
for photo, p in unique.items():
    file = ROOT / 'dist' / photo
    im = Image.open(file).convert('RGB')
    im.thumbnail((112, 140))
    w, h = im.size
    apparel = p['type'] in ('shirt', 'hoodie', 'cardigan', 'jacket', 'pants', 'shorts')
    region = (.31, .28, .69, .67) if apparel else (.14, .24, .86, .88)
    if p['type'] in ('pants', 'shorts'):
        region = (.30, .35, .70, .86)
    pixels = []
    for y in range(int(h*region[1]), int(h*region[3])):
        for x in range(int(w*region[0]), int(w*region[2])):
            r, g, b = im.getpixel((x, y))
            if min(r, g, b) > 215 or max(r, g, b)-min(r, g, b) < 12 and min(r, g, b) > 192:
                continue
            if apparel and r > 85 and r > g*1.13 and g > b*1.06 and r-b > 28:
                continue  # model skin is not the garment dye
            pixels.append((r, g, b))
    if not pixels:
        pixels = list(im.crop((int(w*.35), int(h*.4), int(w*.65), int(h*.6))).get_flattened_data())
    counts = collections.Counter(tuple(c//24 for c in px) for px in pixels)
    top, amount = counts.most_common(1)[0]
    selected = [px for px in pixels if sum((px[i]-(top[i]*24+12))**2 for i in range(3)) < 1800]
    selected = selected or pixels
    rgb = tuple(round(sum(px[i] for px in selected)/len(selected)) for i in range(3))
    color = '#'+''.join(f'{v:02x}' for v in rgb)
    palettes[photo] = {'color': color, 'confidence': round(amount/len(pixels), 3), 'sha256': hashlib.sha256(file.read_bytes()).hexdigest()[:16]}

# Visually reviewed product photographs, including models photographed on a person.
reviewed = {
 'assets/photos/0b87a7debcfc1011323b.webp': '#646d6c',
 'assets/photos/f0b27e37c19fd34e0ca9.webp': '#59364f',
 'assets/photos/61d5f1763c2f46dfbaac.webp': '#542037',
 'assets/photos/d0bafa36d170764783c1.webp': '#e3d2b9',
 'assets/photos/4f9edc4ca0f979bbfb23.webp': '#263c48',
}
for path, color in reviewed.items():
    palettes[path].update(color=color, reviewed=True)
(ROOT/'dist/photo-palettes.js').write_text('export const PHOTO_PALETTES='+json.dumps(palettes, separators=(',', ':'))+';\n')
(ROOT/'docs/merchandise-colors-v18.json').write_text(json.dumps({'method':'Existing-photo central foreground color analysis; reviewed exceptions. Colors describe the pictured variant.', 'photos': palettes}, indent=2)+'\n')
print(json.dumps({'photographs':len(palettes), 'listings':len(items), 'reviewed':len(reviewed)}))

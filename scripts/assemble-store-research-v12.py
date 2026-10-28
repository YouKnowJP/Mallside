"""Bundle audited source records and genuine product photos; never synthesize stock."""
import argparse
import hashlib
import json
import re
import shutil
import subprocess
import unicodedata
import xml.etree.ElementTree as ET
from decimal import Decimal, ROUND_HALF_UP
from pathlib import Path

args = argparse.ArgumentParser()
args.add_argument('--input-dir', default='/private/tmp')
args.add_argument('--project', default=str(Path(__file__).resolve().parents[1]))
opts = args.parse_args()
root, inputs = Path(opts.project), Path(opts.input_dir)
docs = root / 'docs/research-v12'
docs.mkdir(parents=True, exist_ok=True)
fx_tree = ET.fromstring((inputs / 'mallside-v12-ecb-fx.xml').read_text())
rates = {'EUR': Decimal(1)}
rate_date = None
for node in fx_tree.iter():
    if 'currency' in node.attrib:
        rates[node.attrib['currency']] = Decimal(node.attrib['rate'])
    if 'time' in node.attrib:
        rate_date = node.attrib['time']
fx_source = 'https://www.ecb.europa.eu/stats/eurofxref/eurofxref-daily.xml'

def normalized(s):
    return re.sub('[^a-z0-9]', '', unicodedata.normalize('NFKD', str(s)).encode('ascii', 'ignore').decode().lower())

def corrected_type(p):
    typ = p.get('type', 'home')
    brand, text = normalized(p.get('brand', '')), (p.get('name', '') + ' ' + p.get('typeSource', '')).lower()
    if brand == 'baccarat':
        return 'home'
    if typ == 'mouse' and not re.search('computer|wireless|magic mouse|logitech|razer', text):
        return 'home'
    return {'collectible': 'toy', 'accessory': 'home', 'luggage': 'duffel', 'dress': 'shirt', 'skirt': 'pants', 'socks': 'home', 'hairdryer': 'tech', 'vase': 'home', 'glassware': 'home', 'flatware': 'home', 'furniture': 'home', 'candleholder': 'home', 'coffee': 'home', 'coffee-machine': 'home'}.get(typ, typ)

records, evidence, seen = [], [], set()
photos_dir = root / 'dist/assets/photos'
for group in ['apparel', 'home', 'food']:
    path = inputs / f'mallside-v12-{group}-products.json'
    data = json.loads(path.read_text())
    retained = []
    evidence += data.get('retailerBrandEvidence', [])
    for p in data['products']:
        raw = p.get('localImage') or p.get('photoPath') or p.get('localPath')
        if not raw or not Path(raw).exists() or Path(raw).stat().st_size < 500:
            continue
        merchant, brand, name = p.get('merchant') or p.get('retailer') or p['brand'], p['brand'].strip(), p['name'].strip()
        source = p['source']
        if not source.startswith('https://') or not brand or not name:
            raise ValueError(f'Invalid source/model: {p}')
        key = (normalized(merchant), normalized(brand), normalized(name), source)
        if key in seen:
            continue
        currency = p.get('currency') or p.get('nativeCurrency') or 'USD'
        native = p.get('nativePrice')
        if native is None and currency == 'USD':
            native = p.get('priceUSD')
        if native is None or Decimal(str(native)) <= 0:
            raise ValueError(f'Missing actual/reference price: {merchant} {name}')
        if currency not in rates:
            raise ValueError(f'No reference exchange rate for {currency}')
        usd = Decimal(str(native)) * rates['USD'] / rates[currency]
        usd = float(usd.quantize(Decimal('.01'), rounding=ROUND_HALF_UP))
        seen.add(key)
        pid = 'v12-real-' + hashlib.sha256('|'.join(key).encode()).hexdigest()[:20]
        dest = photos_dir / (pid + '.webp')
        if Path(raw).suffix.lower() == '.webp':
            shutil.copyfile(raw, dest)
        else:
            subprocess.run(['/opt/homebrew/bin/cwebp', '-quiet', '-q', '82', '-resize', '512', '0', raw, '-o', str(dest)], check=True)
        raster = dest.read_bytes()
        if raster[:4] != b'RIFF' or raster[8:12] != b'WEBP' or len(raster) < 500:
            raise ValueError(f'Invalid actual product raster: {name}')
        relative = str(dest.relative_to(root / 'dist'))
        image_url = p.get('imageURL') or p.get('imageUrl')
        price_basis = p.get('priceBasis', 'Published/reference product price. Game stock is simulated.')
        typ = corrected_type(p)
        audience = 'child' if re.search(r'\b(?:baby|infant|toddler|child|children|kid|kids|girls|boys)\b', name, re.I) else 'all'
        q = {
            'id': pid, 'merchant': merchant, 'merchantNames': p.get('merchantNames', [merchant]),
            'brand': brand, 'name': name, 'type': typ, 'audience': audience,
            'priceUSD': usd, 'referenceAmount': float(native), 'referenceCurrency': currency,
            'priceBasis': price_basis, 'referencePriceVerified': not bool(re.search(r'^simulated|^estimated|simulated reference', price_basis, re.I)),
            'referenceCheckedOn': p.get('checkedOn', data.get('checkedOn', '2026-10-27')),
            'source': source, 'sourceRetailer': p.get('sourceRetailer'),
            'sourceKind': p.get('sourceKind', 'product'), 'condition': p.get('condition', 'New'),
            'sizes': p.get('sizes') or ['One size'], 'sizeBasis': p.get('sizeBasis', 'Source option labels; fit feedback is simulated.'),
            'material': p.get('notes') or p.get('stockEvidence') or 'Real named product and matching photograph. Game fit, availability and prices can differ from the source.',
            'merchantEvidence': p.get('merchantEvidence') or p.get('manufacturerEvidence') or {'source': source, 'kind': 'exact-retailer-product' if p.get('associationKind') == 'exact-retailer-product' else 'manufacturer-reference'},
            'sourceProductType': p.get('sourceProductType') or p.get('typeSource'),
            'photo': {'path': relative, 'source': source, 'imageUrl': image_url, 'description': brand + ' ' + name + ' — matching actual product photograph.', 'variantNote': 'Actual photographed source variant. Game avatar geometry is illustrated.', 'group': 'v12-' + group}
        }
        if currency != 'USD':
            q['conversion'] = {'source': fx_source, 'date': rate_date, 'usdPerUnit': str(rates['USD'] / rates[currency])}
        if typ in ['food', 'drink']:
            effects = p.get('effects', {})
            q.update(finalSale=True, fullness=effects.get('fullness', 36 if typ == 'food' else 8), recovery=effects.get('stamina', 10 if typ == 'food' else 25))
        else:
            q['finalSale'] = bool(p.get('finalSale'))
        if p.get('retailerBrandEvidence') and p.get('verifiedRetailerCarriedBrand'):
            evidence.append({'merchants': [merchant], 'allowedBrands': [brand], 'source': p['retailerBrandEvidence'], 'evidenceType': 'official-retailer-product', 'checkedOn': data.get('checkedOn')})
        records.append(q)
        archive = {k: v for k, v in p.items() if k not in ['localImage', 'photoPath', 'localPath']}
        archive['bundledPhoto'] = relative
        archive['bundledID'] = pid
        retained.append(archive)
    (docs / (group + '.json')).write_text(json.dumps({'checkedOn': data.get('checkedOn'), 'products': retained, 'coverage': data.get('coverage'), 'unresolved': data.get('unresolved')}, ensure_ascii=False, indent=2) + '\n')

additional = inputs / 'mallside-v12-retailer-brand-evidence.json'
if additional.exists():
    evidence += json.loads(additional.read_text()).get('retailerBrandEvidence', [])
root_rules=inputs/'mallside-v12-root-retailer-evidence.json'
if root_rules.exists():
    evidence += json.loads(root_rules.read_text()).get('retailerBrandEvidence', [])
rules, rule_keys = [], set()
for e in evidence:
    merchants = e.get('merchants') or [e.get('merchant')]
    brands = e.get('allowedBrands') or e.get('brands') or []
    source = e.get('source')
    if not source or not source.startswith('https://') or not all(merchants) or not brands:
        continue
    key = json.dumps([merchants, brands, source], sort_keys=True)
    if key in rule_keys:
        continue
    rule_keys.add(key)
    types=e.get('allowedProductTypes', [])
    if not types and 'beauty' in source.lower():
        types=['perfume','skincare','lipstick','makeup','mascara','tech','hairdryer']
    rules.append({'merchants': merchants, 'allowedBrands': brands, 'source': source, 'allowedProductTypes': types, 'condition': e.get('condition'), 'note': e.get('note', ''), 'checkedOn': e.get('checkedOn') or e.get('evidenceDate') or '2026-10-27', 'historical': bool(e.get('historical')), 'evidenceType': e.get('evidenceType') or e.get('evidenceKind') or 'official-retailer-brand-record'})

(root / 'dist/store-product-additions-v12.js').write_text('// Audited actual models/photos with own-merchant and maker evidence.\nexport const STORE_PRODUCT_ADDITIONS=' + json.dumps(records, ensure_ascii=False, separators=(',', ':')) + ';\n')
(root / 'dist/retailer-evidence-v12.js').write_text('// Explicit carried-brand relationships. No category or price-based stock inference.\nexport const RETAILER_BRAND_EVIDENCE=' + json.dumps(rules, ensure_ascii=False, separators=(',', ':')) + ';\n')
(docs / 'retailer-brand-evidence.json').write_text(json.dumps(rules, ensure_ascii=False, indent=2) + '\n')
(docs / 'exchange-reference.json').write_text(json.dumps({'source': fx_source, 'date': rate_date, 'base': 'EUR', 'rates': {k: str(v) for k, v in rates.items()}}, indent=2) + '\n')
print(json.dumps({'products': len(records), 'merchants': len({p['merchant'] for p in records}), 'rules': len(rules), 'fxDate': rate_date}))

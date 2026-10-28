import json,hashlib,pathlib,subprocess,concurrent.futures
root=pathlib.Path(__file__).resolve().parents[1]
entries=[]
for group in ['root','luxury','apparel','other']:
 for e in json.load(open(root/f'docs/photo-{group}-v8.json'))['entries']:
  for pid in e.get('ids',[e.get('id')]):
   entries.append({**e,'id':pid,'group':group})
out=root/'dist/assets/photos';out.mkdir(exist_ok=True)
def process(e):
 src=root/'dist'/e['path'];digest=hashlib.sha256(src.read_bytes()).hexdigest()[:20];target=src if e['path'].startswith('assets/photos/') else out/(digest+'.webp')
 if not target.exists():
  result=subprocess.run(['/opt/homebrew/bin/cwebp','-quiet','-q','83','-m','5','-resize','512','0',str(src),'-o',str(target)],capture_output=True)
  if result.returncode:raise RuntimeError(str(src)+result.stderr.decode())
 return e['id'],{'path':'assets/photos/'+target.name,'source':e.get('source') or e.get('currentSource'),'imageUrl':e.get('imageUrl') or e.get('image'),'description':e.get('description') or e.get('match') or e.get('name'),'variantNote':e.get('variantNote','Photo shows a real product variant. Avatar colors are illustrated.'),'group':e['group']}
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool: photos=dict(pool.map(process,entries))
assert len(photos)==548,len(photos)
(root/'dist/product-photos.js').write_text('export const PRODUCT_PHOTOS='+json.dumps(photos,separators=(',',':'),ensure_ascii=False)+';\n')
(root/'dist/assets.json').write_text(json.dumps(photos,separators=(',',':'),ensure_ascii=False))
corrections={e['id']:{k:v for k,v in [('name',e.get('correctedName')),('source',e.get('correctedSource'))] if v} for e in entries if e.get('correctedName') or e.get('correctedSource')}
(root/'dist/catalog-corrections-v8.js').write_text('export const PRODUCT_CORRECTIONS='+json.dumps(corrections,ensure_ascii=False)+';\n')
(root/'docs/photo-catalog-v8.json').write_text(json.dumps({'checkedAt':'2026-10-26','count':len(photos),'photos':photos,'corrections':corrections},indent=2,ensure_ascii=False))
print('Prepared',len(photos),'listings,',len(list(out.glob('*.webp'))),'files,',sum(p.stat().st_size for p in out.glob('*.webp')),'bytes',corrections)

import concurrent.futures,html,json,pathlib,re,subprocess,urllib.request
ROOT=pathlib.Path(__file__).resolve().parents[1]
products=json.loads(subprocess.check_output(['node','--input-type=module','-e',"import {PRODUCTS} from './dist/catalog.js'; console.log(JSON.stringify(PRODUCTS));"],cwd=ROOT))
manifest=ROOT/'dist/assets.json';assets=json.loads(manifest.read_text())
entries=[]
for p in products:
 if p['assetKey'] in assets:continue
 url=p['source']
 if not any(s in url for s in ['/products/','/product/','/p/']):continue
 entries.append(p)
def fetch(p):
 try:
  request=urllib.request.Request(p['source'],headers={'User-Agent':'Mozilla/5.0 (compatible; MallsideCatalog/3.0)'})
  with urllib.request.urlopen(request,timeout=12) as response:body=response.read(3000000).decode('utf-8','replace')
  metadata={}
  for tag in re.findall(r'<meta\b[^>]*>',body,re.I):
   key=re.search(r'(?:property|name)=[\"\']([^\"\']+)',tag,re.I);val=re.search(r'content=[\"\']([^\"\']+)',tag,re.I)
   if key and val:metadata[key.group(1).lower()]=html.unescape(val.group(1))
  title=metadata.get('og:title','').lower();name=p['name'].split(' · ')[0].lower();words=[w for w in re.findall(r'\w+',name) if len(w)>3]
  if not title or (words and not any(w in title for w in words)):return None
  image=metadata.get('og:image') or metadata.get('twitter:image','')
  if not image.startswith('http') or any(s in image.lower() for s in ['logo','placeholder','default-social','favicon']):return None
  if 'cdn.shopify.com' in image:image+=('&' if '?' in image else '?')+'width=600'
  request=urllib.request.Request(image,headers={'User-Agent':'Mozilla/5.0'})
  with urllib.request.urlopen(request,timeout=12) as response:
   mime=response.headers.get_content_type();data=response.read(2500001)
  if not mime.startswith('image/') or len(data)<3000 or len(data)>2500000:return None
  ext={'image/png':'png','image/webp':'webp','image/avif':'avif'}.get(mime,'jpg')
  if ext=='avif':return None
  path='assets/'+p['assetKey']+'.'+ext;(ROOT/'dist'/path).write_bytes(data)
  return p['assetKey'],{'path':path,'source':p['source'],'image':image}
 except Exception:return None
with concurrent.futures.ThreadPoolExecutor(max_workers=6) as pool:
 for result in pool.map(fetch,entries):
  if result:assets[result[0]]=result[1];print('Official photo: '+result[0],flush=True)
manifest.write_text(json.dumps(assets,indent=2))
print('Catalog photos available: '+str(len(assets)),flush=True)

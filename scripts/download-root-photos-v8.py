import concurrent.futures,json,pathlib,urllib.request,subprocess,hashlib
ROOT=pathlib.Path(__file__).resolve().parents[1]
manifest=ROOT/'docs/photo-root-v8.json'
data=json.loads(manifest.read_text())
out=ROOT/'dist/assets/v8-root';out.mkdir(exist_ok=True)
rawdir=pathlib.Path('/private/tmp/mallside-v8/root-raw');rawdir.mkdir(exist_ok=True)
def one(e):
 key=e['ids'][0];url=e['imageUrl'];candidates=[url]
 if 'scene7.com/' in url:
  candidates.insert(0,url.replace('$desktopThumbnail$','$desktopProduct$').replace('$desktopProductTile$','$desktopProduct$')+'&wid=700&hei=900&fit=fit')
  candidates+= [u.replace('coach.scene7.com','s7d2.scene7.com') for u in list(candidates) if 'coach.scene7.com' in u]
 error=None
 for u in candidates:
  try:
   req=urllib.request.Request(u,headers={'User-Agent':'Mozilla/5.0','Referer':e['source'],'Accept':'image/jpeg,image/png,image/webp,*/*;q=0.8'})
   with urllib.request.urlopen(req,timeout=25) as r:
    body=r.read();mime=r.headers.get('Content-Type','')
   if not mime.startswith('image/') or len(body)<2000: raise ValueError(f'Not a photo: {mime}/{len(body)}')
   raw=rawdir/(key+'.img');raw.write_bytes(body);dest=out/(key+'.webp')
   result=subprocess.run(['/opt/homebrew/bin/cwebp','-quiet','-q','84','-m','5','-resize','512','0',str(raw),'-o',str(dest)],capture_output=True)
   if result.returncode:raise ValueError(result.stderr.decode()[:180])
   e.update(path=str(dest.relative_to(ROOT/'dist')),downloadedFrom=u,bytes=dest.stat().st_size,sha256=hashlib.sha256(dest.read_bytes()).hexdigest())
   return key,True
  except Exception as exc:error=str(exc)
 e['error']=error;return key,False
with concurrent.futures.ThreadPoolExecutor(max_workers=5) as pool:
 for key,ok in pool.map(one,data['entries']): print(key,'OK' if ok else 'MISSING',flush=True)
manifest.write_text(json.dumps(data,ensure_ascii=False,indent=2)+'\n')
print('COVERED',sum(len(e['ids']) for e in data['entries'] if e.get('path')))

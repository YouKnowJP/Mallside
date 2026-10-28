import concurrent.futures, html, json, pathlib, re, urllib.request
ROOT=pathlib.Path(__file__).resolve().parents[1]
text=(ROOT/'dist/catalog.js').read_text()
block=text.split('const source={',1)[1].split('\n};',1)[0]
sources=dict(re.findall(r"\s*(\w+):'([^']+)'",block))
headers={'User-Agent':'Mozilla/5.0 (compatible; MallsideProductCatalog/2.0)'}
def fetch(entry):
    key,url=entry
    if key in ['uniqlo','hanes','champion','stan','jo']: return (key,None,'Collection page: illustration retained')
    try:
        req=urllib.request.Request(url,headers=headers)
        with urllib.request.urlopen(req,timeout=20) as r: body=r.read().decode('utf-8','replace')
        candidates=[]
        for tag in re.findall(r'<meta\b[^>]*>',body,re.I):
            if re.search(r'(?:og:image|twitter:image)',tag,re.I):
                m=re.search(r'content=[\"\']([^\"\']+)',tag,re.I)
                if m:candidates.append(html.unescape(m.group(1)))
        if not candidates: return (key,None,'No product image metadata')
        image_url=candidates[0]
        if image_url.startswith('//'):image_url='https:'+image_url
        req=urllib.request.Request(image_url,headers=headers)
        with urllib.request.urlopen(req,timeout=20) as r:
            data=r.read();mime=r.headers.get_content_type()
        if not mime.startswith('image/') or len(data)<2000:return (key,None,'Not a product image')
        ext={'image/png':'png','image/webp':'webp','image/avif':'avif'}.get(mime,'jpg')
        path=f'assets/{key}.{ext}'
        (ROOT/'dist'/path).write_bytes(data)
        return (key,{'path':path,'source':url,'image':image_url},'ok')
    except Exception as e:return (key,None,str(e)[:100])
with concurrent.futures.ThreadPoolExecutor(max_workers=4) as pool:
    results=list(pool.map(fetch,sources.items()))
assets={k:v for k,v,status in results if v}
(ROOT/'dist/assets.json').write_text(json.dumps(assets,indent=2))
for k,v,status in results:print(k+': '+status)
print('Downloaded '+str(len(assets))+' official product photos.')

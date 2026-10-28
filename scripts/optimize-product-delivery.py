import json,pathlib,urllib.request
root=pathlib.Path(__file__).resolve().parents[1];manifest=root/'dist/assets.json';assets=json.loads(manifest.read_text())
photo=assets['pack'];url=photo['image']+'&width=600'
request=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
with urllib.request.urlopen(request,timeout=20) as response:data=response.read();mime=response.headers.get_content_type()
if mime.startswith('image/') and len(data)>2000:
 (root/'dist'/photo['path']).write_bytes(data);photo['image']=url;manifest.write_text(json.dumps(assets,indent=2));print('JanSport product photo: '+str(len(data))+' bytes')

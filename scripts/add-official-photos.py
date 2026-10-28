import concurrent.futures,json,pathlib,urllib.request
root=pathlib.Path(__file__).resolve().parents[1];path=root/'dist/assets.json';assets=json.loads(path.read_text());assets.pop('longchamp',None)
images={
'zippy':'https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-zippy-wallet--M42616_PM2_Front%20view.jpg',
'neverfull':'https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-neverfull-mm--M27521_PM2_Front%20view.jpg',
'speedy':'https://us.louisvuitton.com/images/is/image/lv/1/PP_VP_L/louis-vuitton-speedy-bandouliere-25--M46977_PM2_Front%20view.jpg',
'oran':'https://assets.hermes.com/is/image/hermesproduct/202230Z%20D1_front_wm_101?wid=600&hei=600&fit=fit&$product_default_bg$',
'evelyne':'https://assets.hermes.com/is/image/hermesproduct/evelyne-16-amazone-bag--069426CKDS-front-wm-1-0-0-800-800_g.jpg',
'clic':'https://assets.hermes.com/is/image/hermesproduct/clic-h-bracelet--700001FP19-worn-1-0-0-800-800_g.jpg'
}
def download(pair):
 key,url=pair
 try:
  req=urllib.request.Request(url,headers={'User-Agent':'Mozilla/5.0'})
  with urllib.request.urlopen(req,timeout=20) as response:data=response.read();mime=response.headers.get_content_type()
  if not mime.startswith('image/') or len(data)<2000:raise ValueError('Not a product photo')
  dest='assets/'+key+'.jpg';(root/'dist'/dest).write_bytes(data)
  return key,{'path':dest,'image':url},'ok'
 except Exception as error:return key,None,str(error)
with concurrent.futures.ThreadPoolExecutor(max_workers=3) as pool:
 for key,value,status in pool.map(download,images.items()):
  if value:assets[key]=value
  print(key+': '+status)
path.write_text(json.dumps(assets,indent=2))

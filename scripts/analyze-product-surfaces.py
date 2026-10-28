"""Analyze existing photographs into compact shape/color/print metadata; never write raster images."""
import argparse, collections, hashlib, json, math, statistics
from pathlib import Path
from PIL import Image
ROOT=Path(__file__).resolve().parents[1]
parser=argparse.ArgumentParser();parser.add_argument('input',type=Path);args=parser.parse_args()
items=json.loads(args.input.read_text());unique={p['photo']:p for p in items};results={}
def clamp(v,a,b): return max(a,min(b,v))
def quantile(xs,t): return sorted(xs)[min(len(xs)-1,int((len(xs)-1)*t))]
def skin(c):
 r,g,b=c;return r>90 and r>g*1.13 and g>b*1.06 and r-b>28
for path,p in unique.items():
 im=Image.open(ROOT/'dist'/path).convert('RGB');im.thumbnail((144,180));w,h=im.size
 border=[im.getpixel((x,y)) for x in range(w) for y in [0,h-1]]+[im.getpixel((x,y)) for y in range(h) for x in [0,w-1]]
 bg=tuple(statistics.median(c[k] for c in border) for k in range(3));white=min(bg)>210
 mask=[];rows=[]
 for y in range(h):
  xs=[]
  for x in range(w):
   c=im.getpixel((x,y));diff=sum((c[k]-bg[k])**2 for k in range(3))**.5
   if diff>34 and not (white and min(c)>225):xs.append(x)
  rows.append(xs)
  mask.extend((x,y) for x in xs)
 if len(mask)<w*h*.015:mask=[(x,y) for x in range(int(w*.15),int(w*.85)) for y in range(int(h*.1),int(h*.9))]
 x0,x1=quantile([v[0] for v in mask],.015),quantile([v[0] for v in mask],.985);y0,y1=quantile([v[1] for v in mask],.01),quantile([v[1] for v in mask],.99)
 bw=max(1,x1-x0);bh=max(1,y1-y0);gar=p.get('garment');bag=p.get('bag');profile=gar or bag or {};kind=profile.get('kind','bag')
 upper_skin=sum(skin(im.getpixel((x,y))) for x in range(int(w*.37),int(w*.63)) for y in range(int(h*.02),int(h*.27)))/(max(1,int(w*.26)*int(h*.25)))
 on_model=profile.get('onModel',upper_skin>.14 and bh/h>.78)
 region=profile.get('photoRegion')
 if not region:
  if bag:
   bodyrows=[y for y in range(y0,y1+1) if len(rows[y])>bw*.58]
   bodytop=quantile(bodyrows,.03) if bodyrows else y0
   if on_model:region=[.35,.35,.65,.65]
   else:region=[(x0+bw*.18)/w,(bodytop+(y1-bodytop)*.13)/h,(x1-bw*.18)/w,(y1-(y1-bodytop)*.12)/h]
  elif kind in ['pants','shorts'] or profile.get('coverage')=='bottom':region=[.34,.43,.47,.87] if on_model else [(x0+bw*.22)/w,(y0+bh*.10)/h,(x0+bw*.46)/w,(y1-bh*.08)/h]
  elif kind in ['dress','jumpsuit']:
   region=[.35,.26,.65,.76] if on_model else [(x0+bw*.31)/w,(y0+bh*.16)/h,(x1-bw*.31)/w,(y1-bh*.16)/h]
  else:region=[.35,.30,.65,.62] if on_model else [(x0+bw*.31)/w,(y0+bh*.22)/h,(x1-bw*.31)/w,(y0+bh*.83)/h]
 region=[round(clamp(float(v),.01,.99),4) for v in region];rx0,ry0,rx1,ry1=region
 sample=im.crop((int(rx0*w),int(ry0*h),max(int(rx0*w)+1,int(rx1*w)),max(int(ry0*h)+1,int(ry1*h)))).resize((32,40),Image.Resampling.BOX)
 base=p.get('baseColor','#7c796f');rgb=tuple(int(base[i:i+2],16) for i in [1,3,5]);clean=[]
 for c in sample.get_flattened_data():
  # Keep printed whites; remove likely skin only in photographs with a model.
  if on_model and skin(c) and sum((c[k]-rgb[k])**2 for k in range(3))>5800:c=rgb
  if min(c)>239 and max(rgb)<190 and not profile.get('pattern') in ['graphic','stripe','plaid','printed','floral','gingham']:c=rgb
  clean.append(c)
 # A pure-white component connected to the panel edge is background, not an interior printed dot.
 queue=[(x,y) for x in range(32) for y in [0,39]]+[(x,y) for y in range(40) for x in [0,31]];removed=set()
 if max(rgb)<215:
  while queue:
   x,y=queue.pop();at=y*32+x
   if (x,y) in removed or min(clean[at])<250:continue
   removed.add((x,y))
   queue.extend((xx,yy) for xx,yy in [(x-1,y),(x+1,y),(x,y-1),(x,y+1)] if 0<=xx<32 and 0<=yy<40 and (xx,yy) not in removed)
  for x,y in removed:clean[y*32+x]=rgb
 sample.putdata(clean);indexed=sample.quantize(colors=32,method=Image.Quantize.MEDIANCUT);palette=indexed.getpalette();cells=list(indexed.get_flattened_data());used=max(cells)+1
 colors=['#'+''.join(f'{palette[i*3+k]:02x}' for k in range(3)) for i in range(used)];alphabet='0123456789abcdefghijklmnopqrstuv';grid=''.join(alphabet[i] for i in cells)
 widths=[]
 for t in [.12,.28,.45,.65,.85]:
  xs=rows[min(h-1,int(y0+bh*t))];widths.append(round((quantile(xs,.95)-quantile(xs,.05))/bw,3) if len(xs)>3 else .65)
 aspect=round(clamp(bw/bh,.25,3.4),3)
 if bag and not on_model:
  br=[y for y in range(y0,y1+1) if len(rows[y])>bw*.58];aspect=round(clamp(bw/max(1,(y1-quantile(br,.03) if br else bh)),.4,3.2),3)
 results[path]={'sha256':hashlib.sha256((ROOT/'dist'/path).read_bytes()).hexdigest()[:16],'aspect':aspect,'shapeEvidence':'foreground-estimate' if not on_model else 'on-model-catalog-profile','widths':widths,'region':region,'regionReviewed':bool(profile.get('photoRegion')),'backgroundFraction':round(len(removed)/1280,4),'colors':colors,'grid':grid,'size':[32,40]}
(ROOT/'dist/photo-surfaces.js').write_text('export const PHOTO_SURFACES='+json.dumps(results,separators=(',',':'))+';\n')
(ROOT/'docs/photo-surfaces-v19.json').write_text(json.dumps({'method':'Read-only analysis of existing catalog photos. Foreground proportions and sampled body colors/prints, with reviewed ROI exceptions. No new product photographs or pixel files.', 'photographs':len(results),'reviewedRegions':sum(p['regionReviewed'] for p in results.values()),'profiles':{k:{kk:v for kk,v in val.items() if kk not in ['grid','colors']} for k,val in results.items()}},indent=2)+'\n')
print(json.dumps({'photographs':len(results),'reviewedRegions':sum(p['regionReviewed'] for p in results.values())}))

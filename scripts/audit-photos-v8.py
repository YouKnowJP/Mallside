import json,pathlib,subprocess,re
root=pathlib.Path(__file__).resolve().parents[1];photos=json.load(open(root/'docs/photo-catalog-v8.json'))['photos']
paths=sorted({p['path'] for p in photos.values()});result=subprocess.run(['/usr/bin/sips','-g','pixelWidth','-g','pixelHeight',*[str(root/'dist'/p) for p in paths]],capture_output=True,text=True,check=True);dimensions={}
for match in re.finditer(r'([^\n]+)\n\s+pixelWidth: (\d+)\n\s+pixelHeight: (\d+)',result.stdout):dimensions[str(pathlib.Path(match[1]).relative_to(root/'dist'))]=(int(match[2]),int(match[3]))
entries=[]
for pid,p in photos.items():
 data=(root/'dist'/p['path']).read_bytes();w,h=dimensions[p['path']];valid=data[:4]==b'RIFF' and data[8:12]==b'WEBP' and w>0 and h>0
 entries.append({'id':pid,'path':p['path'],'exists':True,'bytes':len(data),'width':w,'height':h,'valid':valid})
invalid=[e for e in entries if not e['valid']];small=[e for e in entries if min(e['width'],e['height'])<100]
(root/'docs/photo-file-audit-v8.json').write_text(json.dumps({'checkedOn':'2026-10-26','listings':len(entries),'uniqueFiles':len(paths),'bytes':sum((root/'dist'/p).stat().st_size for p in paths),'invalid':invalid,'small':small,'entries':entries},indent=2)+'\n')
assert len(entries)==548 and not invalid and not small
print('Valid local product photos:',len(entries),'listings;',len(paths),'files; no invalid or tiny pictures.')

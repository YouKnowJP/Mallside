import {FLOWER_STEMS} from './life-content.js?v=26.0.0';
const color=id=>FLOWER_STEMS.find(f=>f.id===id)?.color||'#799e83';
export const latestFlowerMemory=s=>[...(s.activityMemories||[])].reverse().find(m=>m.activity==='flowers'&&m.mallId===s.mallId&&m.choice?.stems?.length===3&&m.choice.stems.every(id=>FLOWER_STEMS.some(f=>f.id===id)));
export function buildFlowerKiosk(w,b,x,z,theme,approach){
 for(let i=0;i<6;i++){
  const dx=i%3*11-11,dz=Math.floor(i/3)*12-6,id=['sunflower','tulip','daisy','eucalyptus'][i%4],yy=47+(i%3)*3;
  b.cylinder(x+dx,34,z+dz,3.5,9,'#aa9578');b.cylinder(x+dx,(38+yy)/2,z+dz,.5,yy-38,'#6f8d6e');
  b.leaf(x+dx+2,yy-5,z+dz,2,'#7b9b7c',1.3,.25,.5);b.leaf(x+dx-2,yy-7,z+dz,2,'#7b9b7c',1.3,.25,.5);
  if(id==='eucalyptus'){for(let j=0;j<3;j++)b.leaf(x+dx+(j%2?2:-2),yy-j*2,z+dz,2.3,color(id),1,.35,.75);}
  else{for(let j=0;j<7;j++){const a=j*Math.PI*2/7;b.leaf(x+dx+Math.cos(a)*2.5,yy,z+dz+Math.sin(a)*2.5,2,color(id),1,.4,.65,a);}b.leaf(x+dx,yy+.4,z+dz,1.5,id==='sunflower'?'#806748':'#d0b270',1,.4,1);}
 }
 b.box(x+13,31,z+12,10,1.5,7,'#e7d8bd');b.box(x+13,32,z+12,8,.3,5,'#f2ead9');
 const swatches=[-2.5,0,2.5].map(dx=>w.box(x+13+dx,32.4,z+12,2,.3,3,w.mat('#d1c6b1',{roughness:.8})));
 w.flowerKiosks??=[];w.flowerKiosks.push({swatches,signature:null});updateFlowerKiosks(w);
 const label=w.label('Flower memories ↗',x+3,84,z+10,70,theme.accent);w.tag(label,'flower-memories',approach);w.nearLabels.push({object:label,x:x+3,z:z+10,radius:100,directory:true});w.canvas.dataset.flowerKioskRevision='45';
}
export function updateFlowerKiosks(w){
 const m=latestFlowerMemory(w.state),signature=m?m.id+':'+m.choice.stems.join(':'):'empty';
 for(const k of w.flowerKiosks||[]){if(k.signature===signature)continue;k.swatches.forEach((mesh,i)=>mesh.material.color.set(m?color(m.choice.stems[i]):'#d1c6b1'));k.signature=signature;}
 if(w.flowerKiosks?.length)w.canvas.dataset.flowerKioskMemory=m?m.choice.stems.join(':'):'empty';
}
// Original illustrated bouquet geometry, using only the workshop's chosen stem IDs.
export function buildWorkshopBouquet(w,group,stems){
 stems.forEach((id,i)=>{const x=(i-1)*4;w.cyl(x,0,0,.45,14,'#799e83',group);const leaf=w.ball(x+1.2,1,0,1.5,'#799e83',group);leaf.scale.set(1.5,.25,.6);
  if(id==='eucalyptus'){for(let j=0;j<3;j++){const l=w.ball(x+(j%2?1:-1),6+j,0,1.7,color(id),group);l.scale.set(1,.3,.8);}}
  else{for(let j=0;j<7;j++){const a=j*Math.PI*2/7,p=w.ball(x+Math.cos(a)*2.1,8,Math.sin(a)*2.1,1.5,color(id),group);p.scale.y=id==='tulip'?.9:.4;}w.ball(x,8.4,0,1.2,id==='sunflower'?'#806748':'#d0b270',group);}
 });w.box(0,-3,0,13,2,1,'#e4d4b4',group);
}

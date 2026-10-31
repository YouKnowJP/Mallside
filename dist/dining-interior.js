import {surfaceTexture} from './scene-finish.js?v=33.0.0';
import {displayPoint} from './shop-interiors.js?v=44.0.0';
// Original dining furniture stays inside the same reserved footprints as guide displays.
export function buildDiningGallery(w,st,style,layout){
 const timber=w.mat(style.fixture,{map:surfaceTexture(w,'timber'),roughness:.78});
 for(const [i,r]of layout.displays.entries()){
  const x=r.x+r.width/2,z=r.y+r.height/2,point=displayPoint(r),key='dining:'+st.id;
  w.tag(w.box(x,27,z,r.width-10,4,r.height-10,timber),key,point);for(const dx of [-33,33])w.box(x+dx,13,z,4,26,35,style.trim);
  for(const dx of [-27,27]){w.box(x+dx,16,z+20,24,3,22,style.accent);w.box(x+dx,27,z+26,24,23,3,style.trim);for(const sx of [-9,9])w.box(x+dx+sx,8,z+20,2,16,18,style.trim);w.cyl(x+dx,30,z-8,9,1,'#f5eddd');w.cyl(x+dx+12,32,z-13,3,5,'#f4ead6');w.box(x+dx,30,z+3,12,.5,5,'#dac4a6');}
  w.cyl(x,31,z-17,3,8,style.trim);w.ball(x,39,z-17,6,'#729477');
  if(i===1){const label=w.label('Original game menu ↗',x,65,z,120,style.accent);w.tag(label,key,point);}w.interiorStops.push({point,id:key,name:'Dining menu',label:'Original Mallside meals · review first'});
 }w.canvas.dataset.diningTables=String(layout.displays.length);
}

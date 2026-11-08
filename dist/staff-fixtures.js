import {detailBoxes} from './detail-instances.js?v=48.0.0';
import {retailLight} from './retail-light.js?v=68.0.0';

export function buildHandsetCounter(w,st,style){
 const top='#e0d1b6',ink='#435760',metal='#68838e',parts=[];
 for(const [i,p] of st.products.entries()){
  const x=562+i*38;
  parts.push([x,33,150,32,2,29,top],[x,36,146,12,4,9,ink],
   [x,35,161,26,.7,5,metal],[x,49,137,23,15,1.4,p.color]);
  const phone=w.photo(p,x,42,147,7,10);
  phone.rotation.y=(i-1)*.30+Math.PI;
 }
 parts.push([600,17,166,108,20,3,ink],[600,24,168,91,1.4,1.4,metal],
  [600,85,136,107,2,7,ink],[600,83.8,138,100,.5,3,'#f5e1ae']);
 detailBoxes(w,w.scene,parts);
 retailLight(w,w.scene,600,34.1,152,105,24,true);
 w.label('HANDSET COMPARISON',600,77,134,80,style.accent);
 w.canvas.dataset.handsetCounter='70';
}

export function buildGameNightTable(w,layout,style){
 const f=layout.fitting,x=f.x+f.width/2,z=f.y+18,ink='#44584b',linen='#eee0bf',clay='#ac7057',parts=[
  [x,30,z,100,5,25,style.trim],[x,33,z,77,1.5,23,ink],
  [x-39,14,z,4,28,18,style.trim],[x+39,14,z,4,28,18,style.trim],
  [x-45,48,f.y+7,28,87,9,style.fixture],[x+45,48,f.y+7,28,87,9,style.fixture]
 ];
 for(const [i,dx] of [-21,0,21].entries()){
  parts.push([x+dx,34,z-4,12,1.5,13,i%2?clay:linen],
   [x+dx+3,35,z-3,5,.8,7,i%2?linen:clay],[x+dx,34,z+7,7,1.4,7,linen]);
 }
 detailBoxes(w,w.scene,parts);
 for(const [i,dx] of [-24,-12,12,24].entries())w.cyl(x+dx,37,z+6,2,6,i%2?clay:'#b9a773');
 retailLight(w,w.scene,x,33.9,z,95,22,true);
 w.canvas.dataset.gameNightTable='70';
}

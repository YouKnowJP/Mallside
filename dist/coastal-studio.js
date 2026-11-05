import {detailBoxes} from './detail-instances.js?v=48.0.0';
import {surfaceTexture} from './scene-finish.js?v=33.0.0';
import {updateStudioStudy} from './studio-details.js?v=56.0.0';
// Original cotton, collar and seam studies; these props are not merchant inventory.
export function buildCoastalStudio(w,st,style){
 const parts=[],box=(...a)=>parts.push(a),wood='#b4a38a',paper='#eee8db',ink='#4d6172',samples=[];
 for(const [i,x]of[570,600,630].entries()){
  const mat=w.mat(['#e7e8e6','#66768b','#8c9f9b'][i],{map:surfaceTexture(w,'fabric'),roughness:.85});samples.push(mat);
  w.box(x,60,134,23,28,.8,mat);for(const edge of[-1,1])box(x+edge*9.5,60,134.5,.35,24,.25,paper);
  box(x,76,135,27,2,2,wood);for(const edge of[-1,1])box(x+edge*7,76,136,2,2,1,ink);
  for(let row=0;row<3;row++)box(x-6+row*6,58,135,1.4,1.4,.4,paper);
 }
 const r=w.layout.rail,cx=r.x+r.width/2,z=r.y+r.height/2;
 box(cx,4,z,r.width-8,8,r.height-8,wood);for(const dx of[-r.width/2+6,r.width/2-6]){box(cx+dx,32,z,3,56,r.height-8,wood);box(cx+dx,61,z,5,2,r.height-6,ink);}
 for(let i=0;i<9;i++)box(r.x+12+i*(r.width-24)/8,9,z,1,2,r.height-12,paper);
 for(const dx of[-18,18]){box(cx+dx,13,z,25,5,20,paper);box(cx+dx,16,z,24,1,19,ink);for(let seam=0;seam<3;seam++)box(cx+dx-7+seam*7,16.6,z,.3,.2,15,paper);}
 box(628,19,630,24,2,14,paper);box(628,20.2,630,16,.3,10,ink);
 detailBoxes(w,w.scene,parts);w.studioStudy={store:st.id,samples,signature:null,group:'textile'};updateStudioStudy(w);w.canvas.dataset.coastalStudio='55';
}

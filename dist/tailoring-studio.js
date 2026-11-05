import {surfaceTexture} from './scene-finish.js?v=57.0.0';
import {updateStudioStudy} from './studio-details.js?v=57.0.0';
// Original seam, cuff and button studies, separate from merchandise.
export function buildTailoringStudio(w,st,style){
 const samples=[],paper='#eee6d6',ink='#7b897c';
 for(const [i,x]of [570,600,630].entries()){
  const m=w.mat(['#d8c8ac','#a8b8ae','#b8a5b2'][i],{bumpMap:surfaceTexture(w,'fabric',true),bumpScale:.035});samples.push(m);
  w.box(x,60,133.8,22,28,.6,m);
  for(const dx of [-8,8])for(let j=0;j<8;j++)w.box(x+dx,48+j*3,134.2,.4,1.4,.3,paper);
  w.box(x,35,153,26,4,19,m);w.box(x,37.3,153,22,.6,15,paper);
  for(let j=0;j<3;j++)w.cyl(x-6+j*6,38.2,153,1.5,.8,style.trim);
 }
 const rail=w.layout.rail,cx=rail.x+rail.width/2,cz=rail.y+rail.height/2;
 w.box(cx,7,cz,rail.width-8,7,rail.height-8,style.fixture);
 for(const [i,dx]of [-20,0,20].entries()){
  w.box(cx+dx,13,cz,16,5,24,samples[i]);w.box(cx+dx,16,cz,12,1,20,paper);
  for(let j=0;j<5;j++)w.box(cx+dx-4+j*2,16.7,cz,.4,.2,15,ink);
 }
 w.box(cx,24,cz-rail.height/2+5,rail.width-10,8,2,style.trim);
 w.studioStudy={store:st.id,samples,signature:null,group:'textile'};updateStudioStudy(w);w.canvas.dataset.tailoringStudio='46';
}

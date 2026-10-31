import {updateStudioStudy} from './studio-details.js?v=44.0.0';
// Original comparison trays, reflection samples and service notes stay inside existing fixture footprints.
export function buildWatchStudio(w,st,style){
 const samples=[];
 for(const [i,x]of [570,600,630].entries()){
  w.box(x,33,151,29,3,25,style.trim);w.box(x,35,151,25,1,21,'#d8cbb5');
  const m=w.mat('#dfca9e',{metalness:.45,roughness:.75});samples.push(m);w.ball(x,60,134,6,m);w.box(x,49,134,20,2,2,style.trim);
 }
 w.box(600,22,165,105,9,2,style.trim);w.box(646,35,153,17,1,10,'#eee7d6');for(let j=0;j<3;j++)w.box(646,35.6,150+j*2,12,.15,.3,style.trim);
 const r=w.layout.rail,cx=r.x+r.width/2,cz=r.y+r.height/2;
 for(const dx of [-r.width/2+5,r.width/2-5])w.box(cx+dx,37,cz,3,66,r.height-6,style.trim);
 for(const y of [8,39,69]){w.box(cx,y,cz,r.width-8,2,r.height-6,style.fixture);for(let j=0;j<4;j++){w.box(cx-65+j*43,y+2,cz,34,2,25,'#dccfb9');w.box(cx-65+j*43,y+3.2,cz,29,.5,20,'#788a82');}}
 w.studioStudy={store:st.id,samples,signature:null,group:'light'};updateStudioStudy(w);w.canvas.dataset.watchStudio='43';
}

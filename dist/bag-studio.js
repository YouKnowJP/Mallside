import {updateStudioStudy} from './studio-details.js?v=45.0.0';
// Original care/packing workbench samples stay separate from the photographed bag collection.
export function buildBagStudio(w,st,style){
 const samples=[];
 for(const [i,x]of [570,600,630].entries()){
  const m=w.mat('#dfca9e',{roughness:.8});samples.push(m);w.box(x,60,133.8,21,27,.7,m);
  for(const dx of [-8,8])for(let j=0;j<7;j++)w.box(x+dx,49+j*3,134.3,.4,1,.2,'#eadfc8');
  w.box(x,35,151,28,2,24,style.trim);w.box(x,36.2,151,24,.5,20,'#ddd0b8');
 }
 w.box(600,22,165,105,9,2,style.trim);w.box(646,37,155,17,1.4,11,'#e8dfcf');
 for(let j=0;j<4;j++)w.box(646,37.8,151+j*2,12,.2,.3,style.trim);
 const r=w.layout.rail,cx=r.x+r.width/2,cz=r.y+r.height/2;
 for(const dx of [-r.width/2+4,r.width/2-4])w.box(cx+dx,38,cz,3,68,r.height-5,style.trim);
 for(const y of [8,39,69]){w.box(cx,y,cz,r.width-8,2,r.height-6,style.fixture);for(let i=0;i<4;i++){w.box(cx-66+i*44,y+4,cz,35,6,25,'#aa967c');w.box(cx-66+i*44,y+7.2,cz,31,.5,21,'#eee5d2');w.box(cx-66+i*44,y+7.6,cz,12,.25,6,style.trim);}}
 w.studioStudy={store:st.id,samples,signature:null,group:'textile'};updateStudioStudy(w);w.canvas.dataset.bagStudio='44';
}

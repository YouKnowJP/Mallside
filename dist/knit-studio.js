import {surfaceTexture} from './scene-finish.js?v=33.0.0';
import {updateStudioStudy} from './studio-details.js?v=42.0.0';

// Original fixtures and creative samples; the photographed garments remain separate merchandise.
export function buildKnitStudio(w,st,style){
 const trim=st.name==='COS'?'#9ba69f':'#ad8b69',paper='#eee8dc',samples=[];
 for(const [i,x]of [570,600,630].entries()){
  const mat=w.mat('#dfca9e',{roughness:.88,bumpMap:surfaceTexture(w,'fabric',true),bumpScale:.06});samples.push(mat);
  w.box(x,60,133.7,21,27,.6,mat);for(const dx of [-8,8])w.box(x+dx,60,134.1,.3,24,.2,paper);
  w.cyl(x,75,134,1.1,2,trim);w.box(x,45,134,17,.5,2,trim);
  for(let j=0;j<4;j++)w.box(x-8+j*5,35,154,.25,.25,12,paper);
 }
 w.box(600,22,165,105,9,2,trim);for(const x of [552,648])w.box(x,12,147,3,2,31,trim);
 w.box(644,34,154,18,1.3,12,paper);for(let j=0;j<4;j++)w.box(644,34.8,150+j*2,13,.2,.3,trim);
 const r=w.layout.rail,cx=r.x+r.width/2,cz=r.y+r.height/2;
 for(const dx of [-r.width/2+5,r.width/2-5]){w.box(cx+dx,39,cz,2,72,r.height-5,trim);w.box(cx+dx,4,cz,7,2,r.height-3,style.fixture);}
 for(const z of [cz-19,cz+19])w.box(cx,6,z,r.width-9,2,2,trim);
 // A saved v41 study remains visible after this shop gains its real collection.
 w.studioStudy={store:st.id,samples,signature:null,group:'textile'};updateStudioStudy(w);
 w.canvas.dataset.knitStudio=st.name==='COS'?'interlock':'rib-knit';
}

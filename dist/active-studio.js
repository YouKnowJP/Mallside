import {surfaceTexture} from './scene-finish.js?v=33.0.0';
import {updateStudioStudy} from './studio-details.js?v=45.0.0';

// Original creative sample/care fixtures, separate from verified merchant stock.
export function buildActiveStudio(w,st,style){
 const paper='#eee9db',trim='#7f958c',samples=[];
 for(const [i,x]of [570,600,630].entries()){
  const mat=w.mat('#dfca9e',{roughness:.8,bumpMap:surfaceTexture(w,'fabric',true),bumpScale:.035});samples.push(mat);
  w.box(x,60,133.8,21,27,.6,mat);for(const dy of [-11,11])w.box(x,60+dy,134.2,18,.5,.3,paper);
  for(const dx of [-8,8])w.box(x+dx,60,134.3,.3,23,.3,trim);
  w.box(x,35,154,27,3,19,mat);w.box(x,36.8,154,19,.3,12,paper);
  for(let j=0;j<3;j++)w.box(x-6+j*6,37,154,.3,.2,8,trim);
 }
 w.box(600,22,165,105,8,2,trim);w.box(644,34.5,153,17,1,12,paper);
 for(let j=0;j<4;j++)w.box(644,35.1,149+j*2,12,.2,.3,trim);
 const r=w.layout.rail,cx=r.x+r.width/2,cz=r.y+r.height/2;
 for(const dx of [-r.width/2+5,r.width/2-5]){w.box(cx+dx,39,cz,2,72,r.height-5,trim);w.box(cx+dx,4,cz,7,2,r.height-3,style.fixture);}
 for(const z of [cz-19,cz+19])w.box(cx,6,z,r.width-9,2,2,trim);
 for(const dx of [-13,13]){w.cyl(cx+dx,18,cz,7,24,paper);w.cyl(cx+dx,30.2,cz,5.5,.4,trim);}
 w.studioStudy={store:st.id,samples,signature:null,group:'textile'};updateStudioStudy(w);w.canvas.dataset.activeStudio='45';
}

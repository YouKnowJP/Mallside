import * as T from './vendor/three.module.js';
import {detailBoxes} from './detail-instances.js?v=48.0.0';
import {updateStudioStudy} from './studio-details.js?v=56.0.0';
// Original timber, slate, folded linens and plant specimens inside existing furniture areas.
export function buildBrushStudio(w,st){
 const r=w.layout.rail,cx=r.x+r.width/2,z=r.y+r.height/2,parts=[],box=(...v)=>parts.push(v),wood='#9c7957',slate='#58665c',paper='#eee5d0',brass='#b4a172';
 box(cx,30,z,r.width-8,60,r.height-8,wood);box(cx,61,z,r.width-5,2,r.height-5,slate);
 for(let i=0;i<18;i++)box(r.x+10+i*(r.width-20)/17,30,z+r.height/2-3,1.5,51,.6,brass);
 for(const [i,dx]of[-57,57].entries()){
  box(cx+dx,84,z-12,92,43,3,slate);box(cx+dx,106,z-6,94,2,17,wood);for(const sign of[-1,1])box(cx+dx+sign*46,84,z-6,2,43,17,wood);
  const model=w.photo(st.products[i],cx+dx,80,z+3,34,40);model.position.y=63;model.rotation.y=(i?1:-1)*.12;
  box(cx+dx,62.5,z+19,68,.5,10,paper);for(let mark=0;mark<6;mark++)box(cx+dx-25+mark*10,62.9,z+19,.4,.1,7,slate);
 }
 const samples=[];for(const [i,x]of[563,600,637].entries()){
  box(x,34,148,29,2,26,slate);for(let layer=0;layer<3;layer++)box(x,35.5+layer*.9,145,24,.8,16,layer%2?paper:'#c5bea7');
  const m=w.mat('#ac7456',{roughness:.8}),o=w.mesh(new T.CapsuleGeometry(1,6,4,8),m);o.rotation.z=Math.PI/2;o.position.set(x,39,151);samples.push(m);
 }
 for(let layer=0;layer<3;layer++)box(626,17+layer*.8,630,23,.7,13,layer%2?slate:paper);
 detailBoxes(w,w.scene,parts);w.studioStudy={store:st.id,samples,signature:null,group:'light'};updateStudioStudy(w);w.canvas.dataset.brushStudio='54';
}

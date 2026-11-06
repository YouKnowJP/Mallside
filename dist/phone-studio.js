import * as T from './vendor/three.module.js';
import {detailBoxes} from './detail-instances.js?v=48.0.0';
import {updateStudioStudy} from './studio-details.js?v=62.0.0';
// Original device comparison furniture, cable storage and sample joinery.
export function buildPhoneStudio(w,st,style){
 const r=w.layout.rail,x=r.x+r.width/2,z=r.y+r.height/2,parts=[],box=(...v)=>parts.push(v),ink='#505b68',wood='#b89977',paper='#eee8dc';
 box(x,30,z,r.width-8,60,r.height-8,wood);box(x,61,z,r.width-4,2,r.height-4,ink);
 for(const [i,dx]of[-r.width*.24,r.width*.24].entries()){
  box(x+dx,62.5,z,54,1,35,paper);box(x+dx,65,z-3,12,5,10,ink);const p=st.products[i%st.products.length],phone=w.photo(p,x+dx,70.75,z-3,4,6.5);phone.rotation.y=(i?1:-1)*.16;
  for(let j=0;j<6;j++)box(x+dx-21+j*8.4,63.3,z+13,.4,.2,6,ink);
  box(x+dx,31,z+r.height/2-3,r.width*.44,40,.7,ink);box(x+dx,43,z+r.height/2-2,24,1.3,1.3,paper);
 }
 const samples=[];for(const [i,xx]of[563,600,637].entries()){
  box(xx,34,148,28,2,25,ink);const mat=w.mat(['#ac7456','#dfca9e','#718374'][i],{roughness:.88}),panel=w.mesh(new T.BoxGeometry(23,2,18),mat);panel.position.set(xx,37,145);samples.push(mat);
  for(let j=0;j<3;j++){const coil=w.mesh(new T.TorusGeometry(3.2-j*.6,.22,5,22),w.mat('#d9d3c5'));coil.rotation.x=Math.PI/2;coil.position.set(xx,39,151);}
 }
 box(630,17,630,23,1.4,13,paper);for(let i=0;i<4;i++)box(623+i*5,18,630,.5,.2,8,ink);
 detailBoxes(w,w.scene,parts);w.studioStudy={store:st.id,samples,signature:null,group:'workshop'};updateStudioStudy(w);w.canvas.dataset.phoneStudio='61';
}

import * as T from './vendor/three.module.js';
import {detailBoxes} from './detail-instances.js?v=48.0.0';
import {updateStudioStudy} from './studio-details.js?v=62.0.0';
// Original acoustic study furniture, cable hooks and joinery in existing footprints.
export function buildRecordingStudio(w,st,style){
 const r=w.layout.rail,x=r.x+r.width/2,z=r.y+r.height/2,parts=[],box=(...a)=>parts.push(a),wood='#a38362',ink='#354b51',paper='#e8e1d0';
 box(x,30,z,r.width-8,60,r.height-8,wood);box(x,61,z,r.width-4,2,r.height-4,ink);
 for(let i=0;i<18;i++)box(r.x+12+i*(r.width-24)/17,82,z-r.height/2+5,4,37,3,i%2?wood:ink);
 for(const dx of[-r.width*.26,r.width*.26]){box(x+dx,31,z+r.height/2-3,r.width*.42,40,.7,ink);box(x+dx,43,z+r.height/2-2,26,1.5,1.5,paper);}
 const p=st.products.find(p=>p.recorderProfile);if(p){const model=w.photo(p,x-30,81,z,23,35);model.rotation.y=-.2;}
 for(let i=0;i<3;i++){const coil=w.mesh(new T.TorusGeometry(7-i*.9,.6,5,28),w.mat('#242e32'));coil.position.set(x+48,79,z-r.height/2+8);box(x+48,89,z-r.height/2+7,2,3,4,paper);}
 const samples=[];for(const [i,xx]of[563,600,637].entries()){
  const m=w.mat(['#ac7456','#dfca9e','#718374'][i],{roughness:.88});samples.push(m);
  box(xx,35,148,27,3,24,ink);const o=w.mesh(new T.BoxGeometry(22,2,17),m);o.position.set(xx,38,145);
  for(let j=0;j<5;j++)box(xx-9+j*4.5,40+j%2*2,153,1,3+j%2*4,.7,paper);
 }
 box(630,17,630,24,1.5,13,paper);for(let i=0;i<4;i++)box(622+i*5,18,630,1,.2,9,ink);
 detailBoxes(w,w.scene,parts);w.studioStudy={store:st.id,samples,signature:null,group:'workshop'};updateStudioStudy(w);w.canvas.dataset.recordingStudio='60';
}

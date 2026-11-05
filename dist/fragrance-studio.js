import * as T from './vendor/three.module.js';
import {detailBoxes} from './detail-instances.js?v=48.0.0';
import {updateStudioStudy} from './studio-details.js?v=57.0.0';
// Original plaster niches, fluted wood, note trays and brass details inside existing footprints.
export function buildFragranceStudio(w,st){
 const r=w.layout.rail,cx=r.x+r.width/2,z=r.y+r.height/2,parts=[],box=(...p)=>parts.push(p),wood='#977958',paper='#eee5d2',brass='#bb9f67',ink='#667968';
 box(cx,27,z,r.width-8,54,r.height-8,wood);box(cx,55,z,r.width-5,2,r.height-5,paper);
 for(let j=0;j<28;j++)box(r.x+8+j*(r.width-16)/27,28,z+r.height/2-3,1.2,48,.9,brass);
 for(const [i,dx]of[-68,0,68].entries()){
  box(cx+dx,83,z-15,62,53,4,paper);box(cx+dx,109,z-11,62,2,12,brass);for(const sign of[-1,1])box(cx+dx+sign*30,83,z-11,2,52,12,brass);
  const o=w.photo(st.products[i],cx+dx,77,z+2,25,40);o.position.y=56;o.rotation.y=(i-1)*.12;
  box(cx+dx,56,z+17,44,.5,9,paper);for(let j=0;j<3;j++)box(cx+dx-10+j*10,56.5,z+17,5,.15,4,ink);
 }
 const samples=[];for(const [i,x]of[563,600,637].entries()){
  box(x,34,150,28,2,22,wood);box(x,35.2,150,26,.4,20,paper);
  for(let j=0;j<3;j++)box(x-7+j*7,35.6,151,3,.25,14,paper,j*.08);
  const material=w.mat('#ac7456',{roughness:.8});samples.push(material);const bead=w.mesh(new T.SphereGeometry(2.5,12,8),material);bead.position.set(x,39,144);
 }
 for(let i=0;i<3;i++){box(626+i*4,18+i*.8,630,14,.7,10,i%2?ink:paper);box(625+i*4,18.5+i*.8,630,10,.1,1,brass);}
 detailBoxes(w,w.scene,parts);w.studioStudy={store:st.id,samples,signature:null,group:'light'};updateStudioStudy(w);w.canvas.dataset.fragranceStudio='53';
}

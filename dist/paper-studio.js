import * as T from './vendor/three.module.js';
import {detailBoxes} from './detail-instances.js?v=48.0.0';
import {updateStudioStudy} from './studio-details.js?v=50.0.0';
// Original reading/stationery joinery and paper studies, never extra merchant inventory.
export function buildPaperStudio(w,st,style){
 const notebook=st.products.some(p=>p.stationeryProfile),ink=notebook?'#786376':'#304757',wood=notebook?'#d9c2b0':'#9e7958',paper='#eee6d2',r=w.layout.rail,cx=r.x+r.width/2,z=r.y+r.height/2,parts=[],box=(...p)=>parts.push(p);
 box(cx,12,z,r.width-8,24,r.height-8,wood);box(cx,25,z,r.width-6,2,r.height-6,ink);
 for(const [i,dx]of[-69,0,69].entries()){
  box(cx+dx,49,z-17,64,46,3,ink);box(cx+dx,73,z-17,66,2,4,wood);box(cx+dx,29,z+1,58,4,30,paper);
  for(const side of[-1,1])box(cx+dx+side*32,49,z-16,2,46,4,wood);
  const model=w.photo(st.products[i%st.products.length],cx+dx,48,z+1,25,34);model.rotation.y=(i-1)*.08;
  box(cx+dx,32,z+16,36,.5,7,paper);for(let k=0;k<3;k++)box(cx+dx-12,32.4,z+14+k*1.7,16-k*3,.15,.4,ink);
 }
 const samples=[];
 for(const [i,x]of[558,600,642].entries()){
  box(x,34,150,32,1.5,25,ink);box(x,35,150,29,.5,22,paper);
  const mat=w.mat(['#ac7456','#dfca9e','#718374'][i],{roughness:.88});samples.push(mat);const cover=w.mesh(new T.BoxGeometry(26,.8,18),mat);cover.position.set(x,35.8,150);
  box(x,36.4,150,23,.3,16,paper);for(let k=0;k<5;k++)box(x,36.7,144+k*2.5,19,.08,.15,'#9ba69c');
  if(notebook)for(let k=0;k<6;k++)box(x-9+k*3.5,36.72,150,.15,.08,13,'#a4afa4');
  box(x,45,138,29,15,1.3,wood);box(x,45,139,25,11,.3,paper);box(x+12,37,150,1.3,1,19,ink);
 }
 // A quiet fan of original folded maps and bookmarks stays on the existing bench.
 for(let i=0;i<3;i++){box(627+i*4,19+i*.5,630,12,.7,9,i===1?paper:ink);box(626+i*4,19.5+i*.5,630,1,.1,7,wood);}
 detailBoxes(w,w.scene,parts);w.studioStudy={store:st.id,samples,signature:null,group:'workshop'};updateStudioStudy(w);w.canvas.dataset.paperStudio=notebook?'stationery':'reading';w.canvas.dataset.paperStudioRevision='50';
}

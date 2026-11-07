import {detailBoxes} from './detail-instances.js?v=48.0.0';
import {updateStudioStudy} from './studio-details.js?v=67.0.0';

// Original game-table furniture in the existing collection-desk and rail footprints.
export function buildToyStudio(w, st, style) {
 const r=w.layout.rail, x=r.x+r.width/2, z=r.y+r.height/2;
 const wood='#b68c62', ink='#36564f', paper='#f2e1bc', gold='#d4a665';
 const parts=[
  [x,41,z,r.width-8,78,r.height-8,wood],
  [x,80,z,r.width-4,2.4,r.height-6,ink],
  [x,57,z+r.height/2-3,r.width-18,5,1.2,ink],
  [x,93,z-r.height/2+6,r.width-14,17,1.2,ink],
  [x,95,z-r.height/2+7,r.width-20,1.2,.8,gold],
  [600,32,148,105,.8,32,ink],
  [600,52,133.8,90,2.4,.4,ink]
 ];
 const samples=[];
 st.products.forEach((p,i)=>{
  const center=x+(i-(st.products.length-1)/2)*59;
  parts.push([center,81.5,z+3,45,1,30,ink],[center,82.1,z+22,28,.5,5,paper]);
  const model=w.photo(p,center,98,z+1,26,33);
  model.rotation.y=(i-1)*.14;
 });
 for(const [i,xx] of [565,600,635].entries()){
  const m=w.mat(['#ad7963','#e3c993','#739589'][i],{roughness:.9});
  samples.push(m);
  w.box(xx,33.1,148,28,1.1,24,m);
  for(const sign of [-1,1])parts.push([xx+sign*12.2,34,149,.55,.35,18,paper]);
 }
 detailBoxes(w,w.scene,parts);
 w.studioStudy={store:st.id,samples,signature:null,group:'workshop'};
 updateStudioStudy(w);
 w.canvas.dataset.tableToyStudio='67';
}

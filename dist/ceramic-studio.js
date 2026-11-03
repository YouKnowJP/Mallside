import * as T from './vendor/three.module.js';
import {detailBoxes} from './detail-instances.js?v=48.0.0';
import {updateStudioStudy} from './studio-details.js?v=50.0.0';
// Original glaze, shape and source displays stay inside the existing workbench/rail footprints.
export function buildCeramicStudio(w,st,style){
 const parts=[],box=(...v)=>parts.push(v),r=w.layout.rail,cx=r.x+r.width/2,z=r.y+r.height/2;
 box(cx,9,z,r.width-8,18,r.height-8,style.fixture);box(cx,19,z,r.width-6,2,r.height-6,style.trim);
 for(const [i,x]of [cx-72,cx,cx+72].entries()){
  box(x,44,z-13,64,48,3,style.wall);box(x,69,z-13,66,3,4,style.trim);for(const dx of [-33,33])box(x+dx,44,z-13,3,48,4,style.trim);
  box(x,23,z+2,53,5,30,style.wall);const p=st.products[i%st.products.length];w.photo(p,x,41,z+3,32,31);box(x,25.9,z+14,29,.5,7,'#f0e7d4');
 }
 for(const x of [565,600,635]){box(x,34.5,151,29,2,23,style.trim);box(x,36,151,26,.7,20,'#f0e7d4');for(let j=0;j<4;j++)box(x-9+j*6,39,151,4,5,11,['#c6b291','#9b8b72','#ded3be','#8a7b63'][j]);}
 detailBoxes(w,w.scene,parts);const samples=[565,600,635].map(x=>{const mat=w.mat('#b8aa92',{roughness:.7});const sample=w.mesh(new T.CylinderGeometry(7,7,1.4,20),mat);sample.position.set(x,37.7,151);return mat;});w.studioStudy={store:st.id,samples,signature:null,group:'workshop'};updateStudioStudy(w);w.canvas.dataset.ceramicStudio='48';
}

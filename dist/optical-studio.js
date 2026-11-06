import * as T from './vendor/three.module.js';
import {detailBoxes} from './detail-instances.js?v=48.0.0';
import {surfaceTexture,beveledBox} from './scene-finish.js?v=57.0.0';
import {updateStudioStudy} from './studio-details.js?v=62.0.0';
// Original joinery and light studies; branch architecture and samples are adapted game art.
export function buildOpticalStudio(w,st,style){
 const wood=w.mat('#ad9a7b',{map:surfaceTexture(w,'timber'),roughness:.72}),paper=w.mat('#eee9dc'),trim='#536b70',parts=[],samples=[];
 const box=(x,y,z,a,b,c,material)=>{const o=w.mesh(beveledBox(a,b,c,.35),material);o.position.set(x,y,z);return o;};
 const r=w.layout.rail,x=r.x+r.width/2,z=r.y+r.height/2;
 box(x,5,z,r.width-6,10,r.height-6,wood);box(x,31,z,r.width-10,42,r.height-10,wood);box(x,54,z,r.width,4,r.height,w.mat('#d7d8ce',{roughness:.55}));
 for(const dx of[-r.width/3,0,r.width/3]){parts.push([x+dx,30,z+r.height/2-3,1,38,.5,trim]);parts.push([x+dx+9,43,z+r.height/2-2,14,1.5,1.5,trim]);}
 // Open original measuring cards compare a bridge gap with an entire frame front.
 box(x,57,z,64,.5,31,paper);for(const dx of[-20,20]){parts.push([x+dx,57.5,z,28,.12,.4,trim]);for(let i=0;i<6;i++)parts.push([x+dx-12+i*5,57.6,z, .4,.12,i%2?3:5,trim]);}
 for(const [i,dx]of[-30,0,30].entries()){
  const material=w.mat(['#b9c5c0','#7f9b9f','#c6b78c'][i],{roughness:.2,metalness:.15});samples.push(material);
  const ring=w.mesh(new T.TorusGeometry(i===1?8:9,1.1,6,32),material);ring.position.set(600+dx,60,135);ring.scale.y=i===1?.75:1;
  parts.push([600+dx,45,136,1.4,12,2,trim]);parts.push([600+dx,38,137,21,1.5,7,trim]);
 }
 // All visible casework remains over the existing rail/collection-desk obstacles.
 for(const dx of[-44,44]){box(600+dx,59,132,3,46,4,wood);parts.push([600+dx,83,133,5,2,6,trim]);}
 box(630,17,631,23,1.5,14,paper);parts.push([630,18,631,17,.2,.5,trim]);for(const dx of[-5,5])parts.push([630+dx,18.1,631,.4,.2,8,trim]);
 detailBoxes(w,w.scene,parts);w.studioStudy={store:st.id,samples,signature:null,group:'light'};updateStudioStudy(w);w.canvas.dataset.opticalStudio='56';
}

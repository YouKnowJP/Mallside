import * as T from './vendor/three.module.js';
import {detailBoxes} from './detail-instances.js?v=48.0.0';
import {updateStudioStudy} from './studio-details.js?v=51.0.0';
// Original studio joinery, gardening tools and dividers; no additional merchant stock.
export function buildGardenStorageStudio(w,st,style){
 const garden=st.products.some(p=>p.ceramicProfile?.planter),r=w.layout.rail,cx=r.x+r.width/2,z=r.y+r.height/2,parts=[],box=(...v)=>parts.push(v),wood=garden?'#9e805d':'#c5bda9',ink=garden?'#46685a':'#586c74',paper='#eee8d6';
 box(cx,10,z,r.width-8,20,r.height-8,wood);box(cx,21,z,r.width-6,2,r.height-6,ink);
 for(const [i,dx]of[-69,0,69].entries()){
  box(cx+dx,46,z-15,64,48,3,wood);box(cx+dx,71,z-15,66,2,4,ink);for(const s of[-1,1])box(cx+dx+s*32,46,z-15,2,48,4,ink);
  box(cx+dx,25,z+2,54,5,30,paper);const p=st.products[i%st.products.length],m=w.photo(p,cx+dx,44,z+2,31,31);m.position.y=28;m.rotation.y=(i-1)*.12;box(cx+dx,29,z+17,31,.5,6,paper);
  if(garden){for(let j=0;j<4;j++)box(cx+dx-22+j*15,58,z-12,1,18,1,ink);box(cx+dx,49,z-12,53,1,1,ink);}else for(let j=0;j<3;j++){box(cx+dx-19+j*19,60,z-10,15,10,5,j===1?ink:paper);box(cx+dx-19+j*19,60,z-6.9,8,2,.3,wood);}
 }
 if(garden){
  // Original foliage on the rear trellis is scenery, separate from the empty product models.
  const geometry=new T.SphereGeometry(1,10,6),material=w.mat('#5c7b56',{roughness:.85}),leaves=new T.InstancedMesh(geometry,material,36),dummy=new T.Object3D();w.resources.add(geometry);w.scene.add(leaves);let k=0;
  for(const dx of[-69,0,69]){w.cyl(cx+dx,69,z-10,.45,24,'#71865c');for(let j=0;j<12;j++){const a=j*2.4,spread=3+(j%4)*1.7;dummy.position.set(cx+dx+Math.cos(a)*spread,59+j*1.7,z-10+Math.sin(a)*3.8);dummy.scale.set(3.4,.42,1.6);dummy.rotation.set(.3,a,.3*Math.sin(a));dummy.updateMatrix();leaves.setMatrixAt(k++,dummy.matrix);}}leaves.instanceMatrix.needsUpdate=true;leaves.computeBoundingSphere();
 }
 const samples=[];
 for(const [i,x]of[563,600,637].entries()){
  box(x,34,150,30,2,24,ink);box(x,35.5,150,27,.5,21,paper);const mat=w.mat('#9ca383',{roughness:.8});samples.push(mat);
  if(garden){const o=w.mesh(new T.CylinderGeometry(7,5.5,6,20,1,true),mat);o.position.set(x,39,150);box(x+10,37,153,1,1,16,wood);box(x+10,37,143,4,.8,6,ink);}
  else{box(x,37,150,23,2,16,paper);const o=w.mesh(new T.BoxGeometry(20,4,1),mat);o.position.set(x,40,150);for(const dx of[-10,0,10])box(x+dx,39,152,1,6,12,wood);}
 }
 for(let i=0;i<3;i++){box(627+i*4,19+i*.5,630,13,.7,10,i%2?ink:paper);box(626+i*4,19.5+i*.5,630,1,.1,8,wood);}
 detailBoxes(w,w.scene,parts);w.studioStudy={store:st.id,samples,signature:null,group:'workshop'};updateStudioStudy(w);w.canvas.dataset.gardenStorageStudio=garden?'garden':'storage';w.canvas.dataset.gardenStorageRevision='51';
}

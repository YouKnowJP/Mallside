import * as T from './vendor/three.module.js';
// All planting stays inside the existing 30×30 public garden fixture footprint.
export function buildGardenStudy(w,x,z,theme){
 const root=new T.Group();root.position.set(x,30,z);w.scene.add(root);const sprigs=[];
 for(const [i,[dx,dz]]of [[-7,-6],[6,-5],[-5,7],[7,7]].entries()){
  const stem=new T.Group();stem.position.set(dx,0,dz);root.add(stem);w.box(0,4,0,.7,8,.7,theme.plant,stem);
  for(const sign of [-1,1]){const leaf=w.mesh(new T.SphereGeometry(1,8,5),w.mat(theme.plant),stem);leaf.position.set(sign*1.4,3.7,0);leaf.scale.set(2,.45,1);leaf.rotation.z=sign*.35;}
  for(let j=0;j<5;j++){const a=j/5*Math.PI*2,petal=w.mesh(new T.SphereGeometry(1,8,5),w.mat(i%2?theme.flowers:'#d6b975'),stem);petal.position.set(Math.cos(a)*1.4,8.1,Math.sin(a)*1.4);petal.scale.set(1.6,.5,1);petal.rotation.y=-a;}
  w.box(0,8.7,0,1,.4,1,'#b68b4d',stem);sprigs.push(stem);
 }
 for(let i=0;i<9;i++){const a=i*2.399,stone=w.mesh(new T.SphereGeometry(1,6,4),w.mat(i%2?'#b9b399':'#d0c7ac'),root);stone.position.set(Math.cos(a)*10.7,.3,Math.sin(a)*10.7);stone.scale.set(1.1,.45,.8);}
 w.gardenSprigs??=[];w.gardenSprigs.push(...sprigs);root.userData={originalPlanting:true,footprint:30};return root;
}
export function updateGardenStudies(w){for(const [i,stem]of (w.gardenSprigs||[]).entries())stem.rotation.z=w.state.preferences.reducedMotion?0:Math.sin(w.t*.8+i*1.7)*.035;}

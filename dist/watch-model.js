import * as T from './vendor/three.module.js';
import {isVerifiedWatch} from './watch-tools.js?v=43.0.0';

// Original source-reviewed geometry, with a readable dial and distinct steel/rubber construction.
export function createWatchModel(w,p,{worn=false}={}){
 if(!isVerifiedWatch(p))return null;
 const g=new T.Group(),a=p.watchProfile,k=worn?.06:1,steel=w.mat('#aeb4b8',{metalness:.72,roughness:.32}),bezel=w.mat(a.bezel,{metalness:.64,roughness:.38}),dial=w.mat(a.dial,{roughness:.48}),white=w.mat('#e5e9df',{roughness:.45}),dark=w.mat('#101315'),band=w.mat(a.bandColor,{metalness:a.band==='steel'?.65:0,roughness:a.band==='steel'?.38:.84});
 const mesh=(geo,mat,x=0,y=0,z=0)=>{const o=new T.Mesh(geo,mat);o.castShadow=o.receiveShadow=true;g.add(o);o.position.set(x,y,z);return o;},box=(x,y,z,ww,h,d,m)=>mesh(new T.BoxGeometry(ww,h,d),m,x,y,z),disc=(r,h,z,m)=>{const o=mesh(new T.CylinderGeometry(r,r,h,40),m,0,0,z);o.rotation.x=Math.PI/2;return o;};
 disc(12.5,4,0,steel);disc(11.9,1.1,2.3,bezel);disc(9.5,.4,3,dial);
 const rim=mesh(new T.TorusGeometry(9.9,.28,6,40),steel,0,0,3.1);rim.name='crystal-rim';
 for(let i=0;i<12;i++){const angle=i*Math.PI/6,mark=box(Math.sin(angle)*8.1,Math.cos(angle)*8.1,3.35,.55,i%3===0?2:1.3,.25,white);mark.rotation.z=-angle;const tick=box(Math.sin(angle)*10.9,Math.cos(angle)*10.9,3.05,.25,.9,.2,i%3===0?white:steel);tick.rotation.z=-angle;}
 for(const [length,angle,width]of [[5,-Math.PI/3,.65],[7,Math.PI/3,.45]]){const hand=box(Math.sin(angle)*length/2,Math.cos(angle)*length/2,3.7,width,length,.3,white);hand.rotation.z=-angle;}
 const seconds=box(-2,0,3.95,10,.18,.18,w.mat('#c25d50'));seconds.rotation.z=.35;disc(.5,.25,4,steel);
 box(5.7,0,3.4,2.4,1.8,.2,white);box(5.7,0,3.55,.6,.9,.15,dial);
 const crown=mesh(new T.CylinderGeometry(1.3,1.3,2,12),bezel,13,0,0);crown.rotation.z=Math.PI/2;
 for(const sign of [-1,1])for(const dx of [-6,6])box(dx,sign*12,0,2.4,5,3,steel);
 if(worn){const ring=mesh(new T.TorusGeometry(16,2,8,32),band,0,0,-15);ring.rotation.x=Math.PI/2;ring.scale.y=.8;}
 else for(const sign of [-1,1])for(let i=0;i<7;i++){
  const y=sign*(15+i*3.5);
  if(a.band==='steel'){for(const dx of [-4.2,0,4.2])box(dx,y,0,3.9,3.1,2.5,band);}
  else{box(0,y,0,12,3.7,2,band);for(const dx of [-3,3])box(dx,y,1.1,1.3,1.3,.25,dark);}
 }
 // Batch the small dial/link parts by material to keep complete showrooms inexpensive.
 g.updateMatrixWorld(true);const batches=new Map();for(const o of [...g.children]){const geo=o.geometry.index?o.geometry.toNonIndexed():o.geometry.clone();geo.applyMatrix4(o.matrixWorld);let b=batches.get(o.material);if(!b){b={position:[],normal:[]};batches.set(o.material,b);}for(const key of ['position','normal'])b[key].push(...geo.attributes[key].array);geo.dispose();o.geometry.dispose();g.remove(o);}
 for(const [mat,b]of batches){const geo=new T.BufferGeometry();for(const key of ['position','normal'])geo.setAttribute(key,new T.Float32BufferAttribute(b[key],3));const o=w.mesh(geo,mat,g);o.castShadow=o.receiveShadow=true;}
 g.scale.setScalar(k);g.userData={productId:p.id,role:worn?'worn-watch':'watch-model',caseMM:a.caseMM,band:a.band,source:p.source};return g;
}
export function placeWatch(w,p,x,y,z,width,height,parent=w.scene){const g=createWatchModel(w,p),bounds=new T.Box3().setFromObject(g),size=bounds.getSize(new T.Vector3()),k=Math.min(.28,width/size.x,height/size.y);g.scale.setScalar(k);g.position.set(x,y,z);parent.add(g);return g;}

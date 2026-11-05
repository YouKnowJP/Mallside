import * as T from './vendor/three.module.js';
import {productAppearance} from './product-appearance.js?v=54.0.0';
// Empty, closed shell; no shoes or photograph contents become merchant inventory.
export function createStorage(p){
 const a=p.storageProfile,x=a.widthIn*2.54,z=a.depthIn*2.54,y=a.heightIn*2.54,t=.3,root=new T.Group(),clear=new T.MeshStandardMaterial({color:'#deeeea',transparent:true,opacity:.18,depthWrite:false,roughness:.22,side:T.DoubleSide}),edge=new T.MeshStandardMaterial({color:a.opening==='drop-front door'?'#d1ddd8':'#b9cbc5',roughness:.4});
 const box=(px,py,pz,w,h,d,m=clear,role='shell')=>{const o=new T.Mesh(new T.BoxGeometry(w,h,d),m);o.position.set(px,py,pz);o.userData.role=role;o.receiveShadow=true;root.add(o);return o;};
 box(0,t/2,0,x,t,z);for(const s of[-1,1]){box(s*(x-t)/2,y/2,0,t,y,z);box(0,y/2,s*(z-t)/2,x,y,t);for(const xx of[-1,1])box(xx*(x-t)/2,y/2,s*(z-t)/2,t*1.6,y,t*1.6,edge,'edge');box(0,y-t,s*(z-t)/2,x,t*2,t*2,edge,'rim');box(s*(x-t)/2,y-t,0,t*2,t*2,z,edge,'rim');}
 box(0,y-t/2,0,x,t,z,clear,'lid');
 if(a.opening==='drop-front door'){
  // Visible framed front and lower hinge; the top remains integral to the box.
  for(const s of[-1,1]){box(s*(x/2-.7),y/2,z/2+.12,.6,y-1,.4,edge,'door-frame');box(0,s<0?.65:y-.65,z/2+.12,x-1,.6,.4,edge,'door-frame');}
  box(0,y-.65,z/2+.5,x*.22,.8,.6,edge,'latch');for(const s of[-1,1])box(s*x*.28,.6,z/2+.4,x*.12,.7,.8,edge,'hinge');
 }else{for(const s of[-1,1])box(s*x*.46,y-.7,0,.6,1.2,z*.23,edge,'lid-grip');}
 root.userData={productId:p.id,source:p.source,referenceSKU:p.referenceSKU,style:'storage-box',appearance:productAppearance(p),size:{x,y,z},bodyCenter:{x:0,y:0,z:0},volumetric:true,hollow:true,empty:true,adaptedProportions:true};return root;
}

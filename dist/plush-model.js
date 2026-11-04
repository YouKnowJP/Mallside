import * as T from './vendor/three.module.js';
import {productAppearance} from './product-appearance.js?v=52.0.0';

export const isVerifiedPlush=p=>p?.type==='plush'&&p.plushProfile?.reviewed===true;
// Original solid interpretations of the four photographed collectibles. Not measured replicas.
export function createPlush(p){
 const root=new T.Group(),g=new T.Group();root.add(g);const a=p.plushProfile,materials=new Map(),pixels=new Uint8Array(64*64*4);let seed=4701;
 for(let i=0;i<pixels.length;i+=4){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const value=170+(seed>>>26);pixels.set([value,value,value,255],i);}
 const fiber=new T.DataTexture(pixels,64,64,T.RGBAFormat);fiber.wrapS=fiber.wrapT=T.RepeatWrapping;fiber.repeat.set(8,8);fiber.magFilter=fiber.minFilter=T.LinearFilter;fiber.needsUpdate=true;
 const mat=color=>{if(!materials.has(color))materials.set(color,new T.MeshStandardMaterial({color,roughness:.96,bumpMap:fiber,bumpScale:.025}));return materials.get(color);};
 const ell=(x,y,z,sx,sy,sz,color,role='')=>{const m=new T.Mesh(new T.SphereGeometry(1,16,12),mat(color));m.position.set(x,y,z);m.scale.set(sx,sy,sz);m.castShadow=m.receiveShadow=true;m.userData.role=role;g.add(m);return m;};
 const line=(points,color,r=.22)=>{const m=new T.Mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v))),12,r,5,false),mat(color));g.add(m);return m;};
 const tilt=(m,angle)=>{m.geometry.scale(m.scale.x,m.scale.y,m.scale.z).rotateZ(angle);m.scale.set(1,1,1);};
 const dark='#26262a',white=a.body,small=a.kind==='cinnamoroll';
 ell(0,8,0,5,6,3.8,white,'body');for(const sign of [-1,1]){ell(sign*3,3,2,2.8,2.5,3.2,white,'foot');ell(sign*5.1,9,1.2,2,3,2,white,'arm');}
 if(!small)ell(0,14.4,0,2.2,3.8,2.5,white,'neck');
 if(a.kind==='kitty'){
  ell(0,9,1.8,4.8,5,2.5,a.accent,'overalls');for(const x of [-2.4,2.4])ell(x,12.4,4.1,.7,.7,.3,'#dfc557','button');
  ell(0,22,0,9,7,5.2,white,'head');for(const sign of [-1,1])ell(sign*6.4,28,0,2.8,3.7,2.7,white,'ear');
  for(const sign of [-1,1]){ell(sign*4.8,22,4.8,.6,1,.35,dark,'eye');for(let j=0;j<3;j++)line([[sign*6.8,22+(j-1)*2,4.5],[sign*8.5,22+(j-1)*2.4,4]],dark,.16);}
  ell(0,20.5,5.1,.85,.55,.3,'#d9bd4e','nose');for(const sign of [-1,1])ell(5.2+sign*1.6,28.5,4.4,2.2,1.8,1.2,a.detail,'bow');ell(5.2,28.5,5,.9,1.1,.7,a.detail,'bow');
 }else if(small){
  ell(0,17,0,7.5,5.7,4.7,white,'head');for(const sign of [-1,1]){const ear=ell(sign*10.6,14.3,0,3,6,1.8,white,'ear');tilt(ear,sign*.6);ell(sign*3.5,17.8,4.4,.6,1,.35,a.accent,'eye');ell(sign*5,15.9,4.2,1.2,.6,.25,a.detail,'cheek');}
  line([[-1.4,16.2,4.6],[-.6,15.6,4.8],[0,16,4.8],[.6,15.6,4.8],[1.4,16.2,4.6]],a.accent,.15);
 }else{
  const hood=a.accent;ell(0,22,0,8,7.2,5.2,hood,'hood');ell(0,20.9,3.4,5.9,4.9,2.1,white,'face');
  if(a.kind==='kuromi'){
   for(const sign of [-1,1]){const ear=new T.Mesh(new T.ConeGeometry(3.7,8,14),mat(hood));ear.position.set(sign*6.4,29.9,0);ear.geometry.rotateZ(-sign*.45);ear.castShadow=true;ear.userData.role='ear';g.add(ear);ell(sign*8,33.4,0,.8,.8,.8,hood);ell(sign*2.8,14,3,1,1,1,a.detail,'collar');}
   ell(0,26.5,4.2,1.7,1.3,.45,a.detail,'skull');for(const sign of [-1,1])ell(sign*.65,26.6,4.7,.35,.42,.15,dark,'skull-eye');ell(0,25.4,4.5,.8,.6,.3,a.detail);
  }else{
   const left=ell(-4.5,30.4,0,2.4,6,2.3,hood,'ear');tilt(left,.15);const right=ell(4.4,29.2,1,3.8,2.8,2.5,hood,'ear');tilt(right,.5);
   for(const sign of [-1,1])ell(-4.8+sign*1.1,27.6,4.7,1.6,1.4,.7,a.detail,'bow');ell(-4.8,27.6,5.2,.65,.7,.5,a.detail);
   for(const sign of [-1,1])ell(sign*1.4,14,3.2,1.8,1.1,.6,a.detail,'neck-bow');
  }
  for(const sign of [-1,1])ell(sign*2.8,21.1,5.1,.65,.95,.3,dark,'eye');ell(0,19.4,5.4,.65,.45,.25,'#dbc45e','nose');
 }
 root.updateMatrixWorld(true);const b=new T.Box3().setFromObject(g,true),size=b.getSize(new T.Vector3()),center=b.getCenter(new T.Vector3());g.position.set(-center.x,-b.min.y,-center.z);root.userData={productId:p.id,source:p.source,style:'plush-'+a.kind,appearance:productAppearance(p),size:{x:size.x,y:size.y,z:size.z},volumetric:true,referenceSKU:p.referenceSKU,adaptedProportions:true};return root;
}

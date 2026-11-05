import * as T from './vendor/three.module.js';
import {isFragrance} from './fragrance-tools.js?v=53.0.0';
export {isFragrance};
// Original bottle geometry. Source photographs stay in product cards; no label artwork is copied.
export function createFragrance(p){
 const a=p.fragranceProfile,r=a.radius,h=a.bodyHeight,root=new T.Group(),gold=new T.MeshStandardMaterial({color:'#c7a65e',metalness:.8,roughness:.23}),glass=new T.MeshStandardMaterial({color:'#e9ead8',transparent:true,opacity:.24,depthWrite:false,roughness:.17,metalness:.05}),liquid=new T.MeshStandardMaterial({color:a.liquid,transparent:true,opacity:.78,roughness:.3,depthWrite:false}),paper=new T.MeshStandardMaterial({color:'#f3eedc',roughness:.8}),ink=new T.MeshStandardMaterial({color:'#a08854',roughness:.55});
 const add=(g,m,xyz,role)=>{const o=new T.Mesh(g,m);o.position.set(...xyz);o.castShadow=o.receiveShadow=!m.transparent;o.userData.role=role;root.add(o);return o;};
 // Closed base, clear cylindrical reservoir and a rounded shoulder.
 add(new T.CylinderGeometry(r,r,h,32),glass,[0,h/2,0],'glass');
 add(new T.CylinderGeometry(r*.9,r*.9,h*.83,32),liquid,[0,h*.48,0],'liquid');
 add(new T.CylinderGeometry(r,r,.55,32),glass,[0,.275,0],'base');
 const dome=add(new T.SphereGeometry(r,32,12,0,Math.PI*2,0,Math.PI/2),glass,[0,h,0],'shoulder');dome.scale.y=.95;
 const collarY=h+r*.95;add(new T.CylinderGeometry(r*.34,r*.34,r*.43,24),gold,[0,collarY+r*.2,0],'collar');
 add(new T.SphereGeometry(r*.43,24,16),gold,[0,collarY+r*.85,0],'cap');
 // Separate gold ribs leave the shoulder visible; a small triangle budget replaces a dense lattice.
 const rings=[0,.36,.68];for(const y of rings){const rr=Math.sqrt(1-y*y)*r*1.012,o=add(new T.TorusGeometry(rr,.07,5,32),gold,[0,h+y*r*.95,0],'joinery');o.rotation.x=Math.PI/2;}
 const path=new T.EllipseCurve(0,0,r,r*.95,0,Math.PI/2,false,0),points=path.getPoints(12).map(v=>new T.Vector3(v.x,v.y,0)),rib=new T.TubeGeometry(new T.CatmullRomCurve3(points),12,.065,5,false);
 for(let i=0;i<10;i++){const o=add(rib,gold,[0,h,0],'joinery');o.rotation.y=i*Math.PI/5;}
 add(new T.BoxGeometry(r*1.18,h*.56,.035),paper,[0,h*.51,r+.025],'label');
 for(let i=0;i<3;i++)add(new T.BoxGeometry(r*(i===1?.8:.5),.08,.04),ink,[0,h*(.64-i*.12),r+.05],'label-line');
 root.updateMatrixWorld(true);const size=new T.Box3().setFromObject(root).getSize(new T.Vector3());root.userData={productId:p.id,source:p.source,style:'closed-fragrance',size:{x:size.x,y:size.y,z:size.z},volumetric:true,closed:true,adaptedProportions:true};return root;
}

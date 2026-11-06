import * as T from './vendor/three.module.js';
import {beveledBox} from './scene-finish.js?v=57.0.0';
export const isRecorder=p=>p?.type==='recorder'&&p.recorderProfile?.reviewed===true;
// Original, unlettered geometry. Millimetre dimensions determine body proportions;
// microphones, guard, buttons and screen are simplified, not photo textures.
export function createRecorder(p){
 const a=p.recorderProfile,k=.15,width=a.widthMM*k,length=a.lengthMM*k,depth=a.depthMM*k,root=new T.Group();
 const dark=new T.MeshStandardMaterial({color:'#292e33',roughness:.62}),rubber=new T.MeshStandardMaterial({color:'#171c20',roughness:.9}),metal=new T.MeshStandardMaterial({color:'#b7c1c1',metalness:.62,roughness:.35}),screen=new T.MeshStandardMaterial({color:'#a4b8ac',roughness:.32}),red=new T.MeshStandardMaterial({color:'#c64853',roughness:.5});
 const add=(geo,mat,x,y,z,role)=>{const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=m.receiveShadow=true;m.userData.role=role;root.add(m);return m;};
 add(beveledBox(width,length*.78,depth,Math.min(.5,depth/5)),dark,0,length*.39,0,'body');
 add(beveledBox(width*.76,length*.22,.25,.1),rubber,0,length*.57,depth/2+.04,'screen-bezel');
 add(new T.BoxGeometry(width*.64,length*.17,.03),screen,0,length*.57,depth/2+.18,'screen');
 for(const x of[-1,1]){const mic=add(new T.CylinderGeometry(width*.105,width*.105,width*.48,12),metal,x*width*.16,length*.88,0,'xy-microphone');mic.rotation.z=x*Math.PI/4;for(let j=0;j<4;j++){const ring=add(new T.TorusGeometry(width*.108,.045,4,12),rubber,mic.position.x,mic.position.y,0,'mic-grille');ring.quaternion.copy(mic.quaternion);ring.rotateX(Math.PI/2);ring.position.x+=x*(j-1.5)*.26;ring.position.y+=(j-1.5)*.26;}}
 for(const x of[-1,1])add(beveledBox(.48,length*.23,depth*.65,.1),dark,x*(width/2-.24),length*.86,0,'mic-guard');
 const dial=add(new T.CylinderGeometry(width*.18,width*.18,.55,20),metal,0,length*.78,depth*.46,'input-dial');dial.rotation.x=Math.PI/2;
 const record=add(new T.CylinderGeometry(width*.12,width*.12,.45,20),metal,0,length*.32,depth/2+.12,'record-button');record.rotation.x=Math.PI/2;
 const dot=add(new T.CircleGeometry(width*.045,16),red,0,length*.32,depth/2+.36,'record-center');
 for(let i=0;i<4;i++)add(beveledBox(width*.155,.45,.45,.07),rubber,(i-1.5)*width*.19,length*.43,depth/2+.12,'function-button');
 for(const x of[-1,1])for(const y of[.14,.22])add(beveledBox(width*.25,length*.055,.5,.12),rubber,x*width*.2,length*y,depth/2+.15,'transport-button');
 for(const y of[.24,.53]){const socket=add(new T.TorusGeometry(.35,.1,5,12),metal,-width/2-.03,length*y,0,'side-socket');socket.rotation.y=-Math.PI/2;}
 root.updateMatrixWorld(true);const bounds=new T.Box3().setFromObject(root),size=bounds.getSize(new T.Vector3());for(const c of root.children)c.position.y-=bounds.min.y;
 root.userData={productId:p.id,source:p.source,style:'handheld-recorder',size:{x:size.x,y:size.y,z:size.z},volumetric:true,adaptedProportions:true,bodyDimensions:{width,length,depth}};return root;
}

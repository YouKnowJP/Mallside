import {updateParcelDesk} from './parcel-guide.js?v=60.0.0';
import * as T from './vendor/three.module.js';
import {detailBoxes} from './detail-instances.js?v=48.0.0';
// Tools and drawers occupy the original counter. Existing public routes and rewards are retained.
export function buildServiceCounterDetails(w,x,z,width,depth){
 const root=new T.Group();root.position.set(x,0,z);w.scene.add(root);const parts=[],box=(...v)=>parts.push(v),ink='#4c6966',wood='#b49368',paper='#eee6d2';
 for(const xx of[-width*.25,0,width*.25]){box(xx,24,depth/2-1,width*.21,13,.4,ink);box(xx,26,depth/2-.6,9,1,.8,wood);}
 // Nested lost-property envelopes, ticket tabs and a tied twine reel.
 for(let i=0;i<3;i++){box(10+i*1.4,49+i*.35,10,10,.4,7,paper);box(13+i*1.4,49.3+i*.35,10,2,.15,5,wood);}
 const metal=w.mat('#b69e70',{metalness:.3,roughness:.5});for(const [i,dx]of[-17,-8].entries()){const roll=w.mesh(new T.CylinderGeometry(2.5,2.5,15,16),w.mat(i?'#b77e89':'#728c76'),root);roll.rotation.z=Math.PI/2;roll.position.set(dx,45,-depth*.28);const end=w.mesh(new T.TorusGeometry(1.6,.55,5,14),metal,root);end.rotation.y=Math.PI/2;end.position.set(dx+7.6,45,-depth*.28);}
 box(-11,44,depth*.22,16,.8,9,paper);for(let i=0;i<4;i++)box(-17+i*4,44.5,depth*.22,1,.15,7,wood);box(-20,45,depth*.22,1,2,11,ink);
 // Purchased-parcel markers remain entirely on the existing counter; no new obstacle.
 const groups=[];for(let i=0;i<3;i++){const group=new T.Group();group.position.set(width*.16,49+i*8,-depth*.22);root.add(group);const parcel=w.mesh(new T.BoxGeometry(12,7.5,12),w.mat(i%2?'#728c76':'#b99a74'),group);w.mesh(new T.BoxGeometry(1,7.6,12.1),w.mat('#e9ddbd'),group);const label=w.mesh(new T.BoxGeometry(7,4,.25),w.mat('#f1ead9'),group);label.position.set(0,0,6.2);groups.push(group);}
 w.parcelDesk={groups,count:null,footprint:{width,depth}};updateParcelDesk(w);
 detailBoxes(w,root,parts);root.userData={originalServiceTools:true,footprint:{width,depth}};w.canvas.dataset.serviceCounterRevision='51';return root;
}

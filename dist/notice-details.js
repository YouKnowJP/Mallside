import * as T from './vendor/three.module.js';
export const NOTICE_COLORS=['#ead3a3','#f3e9ce','#d4c4d9'];
const IDS=['garden','welcome','wardrobe'];
export const keptNotice=s=>(s.neighborhoodDays||[]).find(v=>v.day===s.day&&v.kind==='notice'&&IDS.includes(v.choice));
// Curved paper edges, brass pins and a kept-invitation marker inside the unchanged collider.
export function buildNoticeDetail(w,x,z,theme){
 const root=new T.Group();root.position.set(x,0,z);w.scene.add(root);const paper=w.mat('#f2e8d0',{roughness:.95}),metal=w.mat('#b99b63',{metalness:.5,roughness:.4});
 const add=(g,m,p)=>{const o=w.mesh(g,m,root);o.position.set(...p);return o;};
 const pins=new T.InstancedMesh(new T.SphereGeometry(.65,8,6),metal,3),dummy=new T.Object3D();w.resources.add(pins.geometry);root.add(pins);
 for(let i=0;i<3;i++){dummy.position.set(-6+i*6,57+i%2*3,-3.35);dummy.scale.set(1,1,.4);dummy.updateMatrix();pins.setMatrixAt(i,dummy.matrix);}pins.instanceMatrix.needsUpdate=true;pins.computeBoundingSphere();
 for(const dx of[-5,5]){const fold=add(new T.CylinderGeometry(2.3,2.3,5,3,1,true),paper,[dx,39,4]);fold.rotation.z=Math.PI/2;fold.rotation.y=.12;}
 const markerMaterial=w.mat('#4d7c70',{roughness:.6}),marker=add(new T.TorusGeometry(1.45,.32,5,16),markerMaterial,[0,39,8]);
 root.userData={originalNoticeBoard:true,footprint:{width:22,depth:20}};w.noticeBoards??=[];w.noticeBoards.push({root,marker,signature:null});w.canvas.dataset.noticeDetailRevision='50';updateNoticeDetails(w);return root;
}
export function updateNoticeDetails(w){const saved=keptNotice(w.state),key=saved?.choice||'';for(const a of w.noticeBoards||[])if(a.signature!==key){a.marker.visible=!!saved;if(saved){a.marker.position.x=-6+IDS.indexOf(key)*6;a.marker.position.y=51+(IDS.indexOf(key)%2)*3;a.marker.position.z=-3.1;}a.signature=key;}if(w.noticeBoards?.length)w.canvas.dataset.noticeKept=key;}

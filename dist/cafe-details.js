import * as T from './vendor/three.module.js';
import {detailBoxes} from './detail-instances.js?v=48.0.0';
import {beveledBox} from './scene-finish.js?v=57.0.0';
// Original equipment and joinery entirely on the existing terrace counter.
export function buildCoffeeCounterDetails(w,x,z,width,depth){
 const root=new T.Group();root.position.set(x,0,z);w.scene.add(root);const parts=[],box=(...a)=>parts.push(a),ink='#38584e',wood='#b18b61',paper='#eee5d0',metal=w.mat('#bcc8bf',{metalness:.65,roughness:.3});
 const machineWidth=Math.min(44,width*.4),mx=-width*.19,mz=-depth*.17;
 const machine=w.mesh(beveledBox(machineWidth,18,18,.65),w.mat(ink,{roughness:.5}),root);machine.position.set(mx,53,mz);
 box(mx,62.5,mz,machineWidth+1,1,19,'#bcc8bf');box(mx,44.7,mz+10,machineWidth+2,1,10,ink);
 for(let i=0;i<7;i++)box(mx-machineWidth*.4+i*machineWidth*.8/6,45.3,mz+10,.5,.2,8,'#bcc8bf');
 for(const dx of[-machineWidth*.22,machineWidth*.22]){const brew=w.mesh(new T.CylinderGeometry(2.1,2.1,3,12),metal,root);brew.position.set(mx+dx,49,mz+8);box(mx+dx,47,mz+12,1.4,1.4,7,ink);}
 const wand=w.mesh(new T.TubeGeometry(new T.CatmullRomCurve3([[mx-machineWidth*.44,53,mz+8],[mx-machineWidth*.44,49,mz+12],[mx-machineWidth*.4,46,mz+13]].map(p=>new T.Vector3(...p))),12,.45,6,false),metal,root);wand.userData.role='steam-wand';
 box(mx,55,mz+9.3,6,4,.6,'#b6cbc0');for(const dx of[-10,10])box(mx+dx,55,mz+9.5,1.7,1.7,.8,paper);
 const gx=width*.28,gz=-depth*.19;box(gx,49,gz,11,10,12,ink);box(gx,44,gz+5,14,1,17,'#bcc8bf');const hopper=w.mesh(new T.CylinderGeometry(4.3,2.9,9,16),w.mat('#79593b',{roughness:.55}),root);hopper.position.set(gx,59,gz);const lid=w.mesh(new T.CylinderGeometry(4.7,4.7,1,16),metal,root);lid.position.set(gx,64,gz);
 const cupGeometry=new T.LatheGeometry([[0,0],[1.7,0],[2.2,4.5],[1.95,4.5],[1.5,.3],[0,.3]].map(p=>new T.Vector2(...p)),18),cups=new T.InstancedMesh(cupGeometry,w.mat(paper),6),dummy=new T.Object3D();w.resources.add(cupGeometry);
 for(let i=0;i<6;i++){dummy.position.set(width*.27+(i%2)*6,44+Math.floor(i/2)*1.2,depth*.2);dummy.updateMatrix();cups.setMatrixAt(i,dummy.matrix);}cups.instanceMatrix.needsUpdate=true;cups.computeBoundingSphere();cups.castShadow=cups.receiveShadow=true;root.add(cups);
 box(-width*.2,44.2,depth*.21,23,.7,16,wood);box(-width*.2,44.7,depth*.21,20,.2,13,paper);for(let i=0;i<4;i++)box(-width*.2-7+i*4.5,45,depth*.21,1,.2,9,ink);
 for(const xx of[-width*.28,width*.28]){box(xx,23,depth/2-.8,width*.36,24,.6,ink);box(xx,31,depth/2-.6,15,1.2,1,wood);}
 detailBoxes(w,root,parts);root.userData={originalCafe:true,footprint:{width,depth},machineWidth};w.canvas.dataset.coffeeCounterRevision='61';return root;
}

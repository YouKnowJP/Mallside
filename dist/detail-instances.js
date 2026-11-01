import * as T from './vendor/three.module.js';

// A single colored draw for fixed box details; moving parts keep their own parent.
export function detailBoxes(w,parent,parts){
 if(!parts.length)return null;
 const geometry=new T.BoxGeometry(),material=w.mat('#ffffff',{roughness:.85}),mesh=new T.InstancedMesh(geometry,material,parts.length),dummy=new T.Object3D();w.resources.add(geometry);
 for(const [i,p]of parts.entries()){const [x,y,z,sx,sy,sz,color,turn=0]=p;dummy.position.set(x,y,z);dummy.scale.set(sx,sy,sz);dummy.rotation.set(0,turn,0);dummy.updateMatrix();mesh.setMatrixAt(i,dummy.matrix);mesh.setColorAt(i,new T.Color(color));}
 mesh.instanceMatrix.needsUpdate=true;mesh.computeBoundingSphere();mesh.castShadow=mesh.receiveShadow=true;parent.add(mesh);return mesh;
}

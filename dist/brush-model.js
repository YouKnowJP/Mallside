import * as T from './vendor/three.module.js';
import {isBrush} from './brush-tools.js?v=54.0.0';
export {isBrush};
// Original construction. No merchant mark, product raster or generated brand texture.
export function createBrush(p){
 const a=p.brushProfile,h=a.lengthIn*2,w=a.widthIn*2,root=new T.Group(),wood=new T.MeshStandardMaterial({color:'#b7804f',roughness:.64}),edge=new T.MeshStandardMaterial({color:'#c89463',roughness:.62}),dark=new T.MeshStandardMaterial({color:'#38302d',roughness:.87}),pin=new T.MeshStandardMaterial({color:'#292b29',roughness:.58});
 const add=(geometry,material,xyz,role)=>{const o=new T.Mesh(geometry,material);o.position.set(...xyz);o.castShadow=o.receiveShadow=true;o.userData.role=role;root.add(o);return o;};
 const shape=new T.Shape(),half=w/2,y=h*.45,r=w*.2;
 shape.moveTo(-w*.16,0);shape.quadraticCurveTo(-w*.22,h*.18,-w*.14,h*.35);shape.quadraticCurveTo(-w*.13,h*.43,-half+r,y);shape.quadraticCurveTo(-half,y,-half,y+r);shape.lineTo(-half,h-r);shape.quadraticCurveTo(-half,h,-half+r,h);shape.lineTo(half-r,h);shape.quadraticCurveTo(half,h,half,h-r);shape.lineTo(half,y+r);shape.quadraticCurveTo(half,y,half-r,y);shape.quadraticCurveTo(w*.13,h*.43,w*.14,h*.35);shape.quadraticCurveTo(w*.22,h*.18,w*.16,0);shape.quadraticCurveTo(0,-.1,-w*.16,0);
 add(new T.ExtrudeGeometry(shape,{depth:.65,bevelEnabled:true,bevelSize:.12,bevelThickness:.12,bevelSegments:2,curveSegments:10,steps:1}),wood,[0,.12,-.325],'wood');
 const cushion=add(new T.CapsuleGeometry(1,1,4,12),dark,[0,h*.745,.4],'cushion');cushion.scale.set(w*.44,h*.172,.38);
 const rows=a.format==='Mini'?10:14,columns=a.format==='Mini'?7:9,positions=[];
 for(let row=0;row<rows;row++)for(let col=0;col<columns;col++){
  const x=(col-(columns-1)/2)*w*.77/(columns-1),yy=h*.5+row*h*.47/(rows-1),dy=(yy-h*.745)/(h*.245);
  if(Math.abs(dy)>.78&&Math.abs(x)>w*.29)continue;
  if(row===1&&col===(columns-1)/2)continue;
  positions.push([x,yy,.9]);
 }
 const rods=new T.InstancedMesh(new T.CylinderGeometry(.055,.075,.9,6),pin,positions.length),tips=new T.InstancedMesh(new T.SphereGeometry(.095,6,4),pin,positions.length),dummy=new T.Object3D();
 positions.forEach(([x,y,z],i)=>{dummy.position.set(x,y,z+.45);dummy.rotation.set(Math.PI/2,0,0);dummy.updateMatrix();rods.setMatrixAt(i,dummy.matrix);dummy.position.z=z+.9;dummy.rotation.set(0,0,0);dummy.updateMatrix();tips.setMatrixAt(i,dummy.matrix);});
 rods.userData.role='pins';tips.userData.role='pin-tips';rods.castShadow=tips.castShadow=true;root.add(rods,tips);
 const vent=add(new T.CircleGeometry(.14,12),pin,[0,h*.5+h*.47/(rows-1),.8],'vent');vent.rotation.y=0;
 // Subtle original grain scores, without copying the embossed merchant name.
 for(let i=0;i<4;i++)add(new T.BoxGeometry(.035,h*(.17+i*.025),.02),edge,[(i-1.5)*w*.045,h*.19,-.46],'grain');
 root.updateMatrixWorld(true);const bounds=new T.Box3().setFromObject(root),size=bounds.getSize(new T.Vector3());for(const child of root.children)child.position.y-=bounds.min.y;root.userData={productId:p.id,source:p.source,style:'wooden-paddle-brush',size:{x:size.x,y:size.y,z:size.z},volumetric:true,adaptedProportions:true,ventilationOpening:true,pinCount:positions.length};return root;
}

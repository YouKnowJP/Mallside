import {productAppearance} from './product-appearance.js?v=45.0.0';
import {referenceMaterial} from './merchandise-materials.js?v=23.0.0';
import {addReferenceDetails,addGarmentBrand,strapGeometry,addChainLinks} from './merchandise-details.js?v=23.0.0';
import * as T from './vendor/three.module.js';
import {buildGarmentModel} from './merchandise-garments.js?v=23.0.0';
import {buildBagModel} from './merchandise-bags.js?v=44.0.0';

const clothing=new Set(['shirt','hoodie','cardigan','jacket','pants','shorts']);
const bags=new Set(['bag','crossbody','backpack','duffel','wallet']);
export const physicalProduct=p=>!!p&&(clothing.has(p.type)||bags.has(p.type));
export function merchandiseStyle(p){const a=productAppearance(p);return clothing.has(p.type)?a.garment.kind:a.bag?.silhouette||'package';}
function roundedShape(w,h,r=3){const s=new T.Shape(),x=-w/2,y=-h/2;s.moveTo(x+r,y);s.lineTo(x+w-r,y);s.quadraticCurveTo(x+w,y,x+w,y+r);s.lineTo(x+w,y+h-r);s.quadraticCurveTo(x+w,y+h,x+w-r,y+h);s.lineTo(x+r,y+h);s.quadraticCurveTo(x,y+h,x,y+h-r);s.lineTo(x,y+r);s.quadraticCurveTo(x,y,x+r,y);return s;}

// Original volumetric interpretations of named real products. Photographs remain in details.
export function createMerchandise(p,{hanger=false,bodyOnly=false,highDetail=false}={}){
 const root=new T.Group(),g=new T.Group();root.add(g);const style=merchandiseStyle(p),appearance=productAppearance(p),color=appearance.color,light=new T.Color(color).lerp(new T.Color('#ffffff'),.12),fabric=clothing.has(p.type),main=referenceMaterial(appearance,{highDetail,surfaceAspect:appearance.bag?appearance.width/appearance.height:.9}),plain=referenceMaterial(appearance,{plain:true}),trim=referenceMaterial(appearance,{trim:true}),seam=new T.MeshStandardMaterial({color:light,roughness:.9}),metal=referenceMaterial(appearance,{metal:true});
 let bodyDimensions=null;
 const mesh=(geometry,material=main)=>{if(geometry.type==='ExtrudeGeometry'){geometry.computeBoundingBox();const b=geometry.boundingBox,sz=b.getSize(new T.Vector3()),pos=geometry.attributes.position,norm=geometry.attributes.normal,uv=geometry.attributes.uv;for(let i=0;i<pos.count;i++){const side=Math.abs(norm.getZ(i))<.5;uv.setXY(i,side?(pos.getZ(i)-b.min.z)/(sz.z||1):(pos.getX(i)-b.min.x)/(sz.x||1),(pos.getY(i)-b.min.y)/(sz.y||1));}uv.needsUpdate=true;if(material===main){geometry.clearGroups();const front=[],back=[];for(let i=0;i<pos.count;i+=3)(norm.getZ(i)>.99?front:back).push(i,i+1,i+2);geometry.setIndex([...front,...back]);geometry.addGroup(0,front.length,0);geometry.addGroup(front.length,back.length,1);material=[main,plain];}}const m=new T.Mesh(geometry,material);m.castShadow=m.receiveShadow=true;g.add(m);return m;};
 const box=(x,y,z,w,h,d,m=main)=>{const o=mesh(new T.BoxGeometry(w,h,d),m);o.position.set(x,y,z);return o;};
 const panel=(x,y,z,w,h,d,r=3,m=main)=>{const o=mesh(new T.ExtrudeGeometry(roundedShape(w,h,r),{depth:d,bevelEnabled:true,bevelSegments:2,steps:1,bevelSize:fabric?.55:.2,bevelThickness:fabric?.55:.2,curveSegments:8}),m);o.position.set(x,y,z-d/2);return o;};
 const tube=(points,r=.7,m=trim,closed=false)=>mesh(new T.TubeGeometry(new T.CatmullRomCurve3(points.map(v=>new T.Vector3(...v)),closed),24,r,6,closed),m);
 const band=(points,width=1.6,m=trim)=>mesh(strapGeometry(points,width),m);
 const ring=(x,y,z,r,t=.7,m=metal)=>{const o=mesh(new T.TorusGeometry(r,t,6,24),m);o.position.set(x,y,z);return o;};
 const builder={mesh,box,panel,tube,ring,band,g,main,trim,seam,metal};
 if(fabric)buildGarmentModel(builder,p,appearance,{hanger});
 else if(appearance.bag)bodyDimensions=buildBagModel(builder,p,appearance,{bodyOnly});
 else panel(0,0,0,25,21,13,2);
 root.updateMatrixWorld(true);const bounds=new T.Box3().setFromObject(g),size=bounds.getSize(new T.Vector3()),center=bounds.getCenter(new T.Vector3());g.position.set(-center.x,-bounds.min.y,-center.z);
 root.userData={productId:p.id,source:p.source,style,appearance,bodyDimensions,bodyOnly,highDetail,size:{x:size.x,y:size.y,z:size.z},volumetric:true};return root;
}

export function merchandiseTemplate(w,p,hanger=false,bodyOnly=false){
 w.merchandiseCache??=new Map();const highDetail=bodyOnly||!!w.inside,key=p.id+':'+hanger+':'+bodyOnly+':'+highDetail;
 if(!w.merchandiseCache.has(key)){const g=createMerchandise(p,{hanger,bodyOnly,highDetail});g.traverse(o=>{if(o.isMesh){w.resources.add(o.geometry);for(const m of Array.isArray(o.material)?o.material:[o.material]){w.resources.add(m);for(const key of ['map','bumpMap','roughnessMap'])if(m[key])w.resources.add(m[key]);if(m.userData.detailTexture)w.resources.add(m.userData.detailTexture);}}});w.merchandiseCache.set(key,g);}
 return w.merchandiseCache.get(key);
}
export function placeMerchandise(w,p,x,y,z,width,height,parent=w.scene,{hanger=clothing.has(p.type),stock=true}={}){
 const g=merchandiseTemplate(w,p,hanger).clone(true),size=g.userData.size,k=Math.min(width/size.x,height/size.y);g.scale.setScalar(k);g.position.set(x,y-size.y*k/2,z);parent.add(g);
 if(stock&&w.inside&&!parent.userData?.dynamicMerchandise){w.merchandiseRecords??=[];w.merchandiseRecords.push({product:p,object:g});}
 return g;
}

// Turn detailed static models into instanced meshes for full clothing rails.
export function addInstancedMerchandise(w,batches,p,x,y,z,height,turn=0){
 const template=merchandiseTemplate(w,p,true),k=height/template.userData.size.y,placement=new T.Matrix4().compose(new T.Vector3(x,y,z),new T.Quaternion().setFromAxisAngle(new T.Vector3(0,1,0),turn),new T.Vector3(k,k,k));template.updateMatrixWorld(true);
 template.traverse(o=>{if(!o.isMesh)return;const key=o.geometry.uuid+o.material.uuid;if(!batches.has(key))batches.set(key,{geometry:o.geometry,material:o.material,matrices:[]});batches.get(key).matrices.push(new T.Matrix4().multiplyMatrices(placement,o.matrixWorld));});
}
export function finishMerchandiseInstances(w,batches){for(const b of batches.values()){const m=new T.InstancedMesh(b.geometry,b.material,b.matrices.length);m.castShadow=m.receiveShadow=true;b.matrices.forEach((matrix,i)=>m.setMatrixAt(i,matrix));m.instanceMatrix.needsUpdate=true;w.scene.add(m);}}

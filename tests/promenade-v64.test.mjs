import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import * as E from '../dist/engine.js';
import * as T from '../dist/vendor/three.module.js';
import {spatialLayout,interiorLayout} from '../dist/spatial-layout.js';
import {buildGrounding,leafyCanopyGeometry,promenadeFinish} from '../dist/promenade-materials.js';
import {buildWindowDisplay} from '../dist/retail-scenes.js';
import {PRODUCT_PHOTOS} from '../dist/product-photos.js';
import {MallWorld3D} from '../dist/world-3d.js';

const hash=(value,replacer)=>createHash('sha256').update(JSON.stringify(value,replacer)).digest('hex');
// V8 math can differ in its last bits across architectures. Keep six decimal places of layout precision.
const normalizeGeometry=(_,v)=>typeof v==='number'?Number(v.toFixed(6)):v;
const prior=JSON.parse(readFileSync(new URL('../docs/research-v64/compatibility-before.json',import.meta.url)));
test('the new visual layer preserves complete v63 catalog data, saves and all 23 navigation floors',()=>{
 assert.equal(hash(E.PRODUCTS.filter(p=>(p.collectionReference??0)<66)),prior.productRecordsSHA256);
 assert.equal(hash(E.STORES.map(s=>s.id)),prior.shopIdsSHA256);
 const state=E.validateImport(JSON.stringify(E.createState()));
 assert.equal(state.version,prior.schema);assert.equal(state.mapRevision,prior.mapRevision);
 for(const {mallId,floor,navSHA256,doorsSHA256} of prior.layouts){
  const l=spatialLayout(E.mallById(mallId),floor,E.STORES);
  assert.equal(hash(l.nav,normalizeGeometry),navSHA256,mallId+' floor '+floor+' navigation');
  assert.equal(hash([...l.rects,...l.units].map(s=>[s.id,s.door]),normalizeGeometry),doorsSHA256,mallId+' floor '+floor+' entrances');
 }
 assert.equal(new Set(E.MALLS.map(m=>promenadeFinish(m.id).name)).size,E.MALLS.length);
});
test('interior grounding uses one noninteractive batch and fits actual occupied fixtures',()=>{
 const st=E.STORES.find(s=>s.id==='ross'),l=interiorLayout(st,E.FLOORPLANS.orange,8),before=hash(l.nav);
 const w={state:{mallId:st.mallId},scene:new T.Scene(),canvas:{dataset:{}},resources:new Set(),interiorSelection:{items:st.products.slice(0,1)}};
 const batch=buildGrounding(w,l,true),r=l.displays[0],matrix=new T.Matrix4();
 batch.getMatrixAt(0,matrix);const center=new T.Vector3().setFromMatrixPosition(matrix);
 assert.ok(center.distanceTo(new T.Vector3(r.x+r.width/2,.055,r.y+r.height/2))<.001);
 assert.equal(batch.count,1+l.stockFixtures.length+3+l.seating.length);
 assert.equal(w.scene.children.length,1);assert.equal(batch.material.depthWrite,false);assert.equal(batch.castShadow,false);
 assert.ok(w.resources.has(batch.geometry)&&w.resources.has(batch.material.map));assert.equal(hash(l.nav),before);
});
test('leaf geometry has finite normals and preserves the plant volume in all axes',()=>{
 const g=leafyCanopyGeometry(),position=g.attributes.position,normal=g.attributes.normal;
 for(const a of [position.array,normal.array])assert.ok(a.every(Number.isFinite));
 assert.ok(g.boundingBox.getSize(new T.Vector3()).distanceTo(new T.Vector3(2,2,2))<.001);
 assert.ok(g.boundingSphere.radius<=Math.sqrt(3));
 assert.ok(new Set(g.attributes.color.array).size>12);
});
test('window merchandise uses own stock and seats the image and its backing together',()=>{
 const st=E.STORES.find(s=>s.id==='ross'),l=spatialLayout(E.mallById('orange'),0,E.STORES),unit=l.rects.find(r=>r.id===st.id),models=[];
 const w={scene:new T.Scene(),resources:new Set(),state:{day:7},canvas:{dataset:{}},cutawayAssets:new Map([[st.id,{objects:[]}]]),
  photo(p,x,y,z,width,height,parent){const plate=this.box(x,y,z,width,height,2,'#ffffee',parent),face=this.mesh(new T.PlaneGeometry(width,height),this.mat('#ff0000'),parent);face.position.set(x,y,z+1.2);models.push({p,plate,face,parent});return plate;}
 };
 for(const n of ['mat','mesh','box','cyl'])w[n]=MallWorld3D.prototype[n].bind(w);
 const original=globalThis.document;
 globalThis.document={createElement:()=>({getContext:()=>({fillRect(){},fillText(){},measureText:t=>({width:t.length*6})})})};
 try{
  const group=buildWindowDisplay(w,unit,E.PRODUCTS,PRODUCT_PHOTOS);
  assert.ok(models.length>0);
  assert.deepEqual(group.userData.models,models.map(m=>m.p.id));
  assert.deepEqual(w.cutawayAssets.get(st.id).objects,[group]);
  for(const {p,plate,face,parent} of models){
   assert.equal(p.store,st.id);assert.equal(plate.getWorldPosition(new T.Vector3()).y,face.getWorldPosition(new T.Vector3()).y);
   const bounds=new T.Box3().setFromObject(parent),hanger=/^(shirt|hoodie|cardigan|jacket|pants|shorts)$/.test(p.type);
   assert.ok(Math.abs((hanger?bounds.max.y:bounds.min.y)-(hanger?52:11.2))<.001);
  }
 }finally{globalThis.document=original;}
});

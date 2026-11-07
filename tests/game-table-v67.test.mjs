import test from 'node:test';
import assert from 'node:assert/strict';
import {existsSync} from 'node:fs';
import * as E from '../dist/engine.js';
import * as T from '../dist/vendor/three.module.js';
import {PRODUCT_PHOTOS} from '../dist/product-photos.js';
import {collectionProducts} from '../dist/collection-guide.js';
import {interiorPlan} from '../dist/shop-interiors.js';
import {freeRoute,walkable} from '../dist/free-navigation.js';
import {createMerchandise} from '../dist/merchandise-3d.js';
import {toyTableMove,toyTableHTML} from '../dist/toy-table.js';
import {consultationLift} from '../dist/studio-gesture.js';
import {filterShoppingItems} from '../dist/shopping-filters.js';

const releases=E.PRODUCTS.filter(p=>p.collectionReference===67);
const branches=E.STORES.filter(s=>s.collectionEdition===67);

test('four verified items belong only to the documented Del Amo and Spectrum branches',()=>{
 assert.equal(E.PRODUCTS.length,8894);
 assert.deepEqual(branches.map(st=>[st.id,st.count]),[['delamo-tenant-toysrusatmacys-Mainlevel',3],['spectrum-tenant-verizonwireless',1]]);
 assert.deepEqual(releases.map(p=>p.referenceAmount),[14.99,10.99,24.99,1299.99]);
 for(const p of releases){
  assert.equal(p.associationEvidence.kind,'retailer-product');
  assert.match(p.merchantEvidence.retailerAssociationSource,/^https:\/\//);
  assert.equal(p.referenceCheckedOn,'2026-11-07');
  const photo=PRODUCT_PHOTOS[p.id];
  assert.ok(photo.author&&photo.licenseUrl&&existsSync(new URL('../dist/'+photo.path,import.meta.url)));
 }
 assert.deepEqual(filterShoppingItems(E.PRODUCTS,E.createState(),{availability:'new'},E),releases);
});

test('both new desks preserve saved studies and reachable browse, checkout, return, bench and exit routes',()=>{
 for(const st of branches){
  const s=Object.assign(E.createState(),{sandbox:true,mallId:st.mallId});
  s.materialStudies=[{store:st.id,palette:'berry',finish:'smooth',day:1}];
  assert.deepEqual(E.validateImport(JSON.stringify(s)).materialStudies,s.materialStudies);
  const plan=interiorPlan(st,E.FLOORPLANS[st.mallId],st.count);
  for(const point of [{x:600,y:210},{x:600,y:675},plan.services.checkout,plan.services.returns,plan.exit]){
   assert.ok(walkable(point,plan.nav),st.id);
   assert.ok(freeRoute(plan.spawn,point,plan.nav).length>=2,st.id);
  }
  assert.equal(collectionProducts(st).length,st.count);
 }
});

test('the tabletop previews can finish, reverse and reset without changing a save',()=>{
 const s=E.createState(),before=JSON.stringify(s);
 const demo=kind=>({kind,productId:kind,step:0,tiles:[]});
 let tower=demo('tower');
 for(let n=0;n<3;n++)tower=toyTableMove(tower,'next');
 assert.match(toyTableHTML(tower,false),/Sample complete/);
 assert.equal(toyTableMove(tower,'next'),tower);
 assert.equal(toyTableMove(tower,'reset').productId,'tower');
 let cube=toyTableMove(demo('cube'),'right');
 assert.equal(toyTableMove(cube,'left').step,0);
 assert.match(toyTableHTML(cube,true),/toy-table quiet/);
 let letters=toyTableMove(demo('letters'),'tile-0');
 assert.match(letters.message,/next letter in MALL is M/);
 for(const n of [3,2,1,4])letters=toyTableMove(letters,'tile-'+n);
 assert.match(toyTableHTML(letters,false),/MALL scores 6 points/);
 assert.equal(JSON.stringify(s),before);
});

test('toy props use one solid instanced mesh and the Galaxy has separate rings and a pen cap',()=>{
 for(const p of releases){
  const model=createMerchandise(p),size=new T.Box3().setFromObject(model).getSize(new T.Vector3());
  assert.ok([size.x,size.y,size.z].every(n=>Number.isFinite(n)&&n>0));
  assert.equal(model.userData.volumetric,true);
  if(p.toyProfile){
   assert.equal(model.children.length,1);
   assert.equal(model.children[0].isInstancedMesh,true);
  }else{
   assert.equal(model.children.filter(o=>o.userData.role==='lens-rim').length,5);
   assert.equal(model.children.filter(o=>o.userData.role==='s-pen-cap').length,1);
  }
 }
});

test('the host presentation eases at both ends, holds while paused, and respects reduced motion',()=>{
 const trip={};
 const first=consultationLift(trip,'earth:textured',.02);
 assert.ok(first>0&&first<.01);
 const middle=consultationLift(trip,'earth:textured',.36);
 assert.ok(middle>.8&&middle<1);
 assert.equal(consultationLift(trip,'coast:smooth',.5,{paused:true}),middle);
 assert.ok(Math.abs(consultationLift(trip,'coast:smooth',.01)-middle)<.002);
 assert.equal(consultationLift(trip,'coast:smooth',2),0);
 assert.equal(consultationLift(trip,'berry:smooth',.1,{reducedMotion:true}),0);
});

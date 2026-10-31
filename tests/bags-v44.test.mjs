import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import * as E from '../dist/engine.js';
import * as T from '../dist/vendor/three.module.js';
import {VERIFIED_BAG_ADDITIONS as additions} from '../dist/store-product-additions-v44.js';
import {productAppearance} from '../dist/product-appearance.js';
import {createMerchandise} from '../dist/merchandise-3d.js';
import {bagFactsHTML,smoothBagSway} from '../dist/bag-motion.js';
import {buildBagStudio} from '../dist/bag-studio.js';
import {buildPhotoKiosk,updatePhotoKiosks,latestCenterPortrait} from '../dist/photo-kiosk.js';
import {collectionGuideHTML,collectionProducts} from '../dist/collection-guide.js';
import {MallWorld3D} from '../dist/world-3d.js';
import {interiorPlan} from '../dist/shop-interiors.js';
import {spatialLayout} from '../dist/spatial-layout.js';
import {campusTrip} from '../dist/campus-routing.js';
import {freeRoute,walkable,clearWalk} from '../dist/free-navigation.js';
import {brandDesign} from '../dist/brand-designs.js';
import {themeFor} from '../dist/mall-design.js';
import {updateStudioStudy} from '../dist/studio-details.js';
import {createShopper} from '../dist/character-rig.js';
import {dressPerson} from '../dist/merchandise-carry.js';
import {updateOutfitPose} from '../dist/merchandise-fit.js';
const shops=E.STORES.filter(s=>s.collectionEdition===44),evidence=JSON.parse(readFileSync(new URL('../docs/research-v44/catalog-evidence.json',import.meta.url))),hash=b=>createHash('sha256').update(b).digest('hex'),esc=v=>String(v);
const fresh=(st=shops[0])=>Object.assign(E.createState(),{sandbox:true,cash:7500000,mallId:st.mallId,floor:E.storeFloor(E.mallById(st.mallId),st.id)});
function owner(state=fresh()){const w={state,scene:new T.Scene(),resources:new Set(),textures:new Map(),canvas:{dataset:{}},nearLabels:[]};for(const key of ['mat','mesh','box','cyl','ball'])w[key]=MallWorld3D.prototype[key];w.tag=(o,id,p)=>{o.userData.interaction=id;o.userData.point=p};w.label=()=>new T.Group();return w;}
const release=w=>MallWorld3D.prototype.clearScene.call(w);
test('four exact bag references retain SKU photos, dated USD offers and approximate source dimension sequences',()=>{
 assert.equal(additions.length,4);for(const p of additions){const e=evidence.products.find(e=>e.id===p.id);assert.equal(p.referenceAmount,e.referenceUSD);assert.equal(p.referenceSKU,e.sku);assert.deepEqual(p.sizes,[e.format]);assert.equal(p.bagReference.publishedDimensions,e.dimensions.publishedDimensions);assert.equal(new URL(p.source).hostname,'us.mcmworldwide.com');assert.equal(hash(readFileSync(new URL('../dist/'+p.photo.path,import.meta.url))),e.runtimePhotoSHA256);assert.match(p.sourceOfferNote,/mixed availability and return notices/);assert.match(bagFactsHTML(p,esc),/not measured capacity or physical fit/);}
});
test('two unfinished MCM shops gain eight listings without changing any earlier product identity',()=>{
 const old=E.PRODUCTS.filter(p=>!p.modelId?.startsWith('v44-real-'));assert.equal(old.length,evidence.previousCatalog.count);assert.equal(hash(old.map(p=>p.id).sort().join('\n')),evidence.previousCatalog.sortedProductIdsSHA256);assert.equal(shops.length,2);assert.equal(E.PRODUCTS.length-old.length,8);for(const st of shops){assert.equal(st.count,4);assert.equal(st.businessKind,'bags');assert.equal(collectionProducts(st).length,4);assert.ok(st.products.every(p=>p.associationEvidence.kind==='own-brand'));}
});
test('source-reviewed tote and backpack construction remains distinct and does not label inferred axes as measured',()=>{
 for(const p of shops[0].products){const a=productAppearance(p);assert.equal(a.colorEvidence,'reviewed-photograph');assert.equal(a.surface.regionReviewed,true);assert.equal(a.dimensionsVerified,false);assert.equal(a.axesInterpreted,true);assert.equal(a.bag.silhouette,p.type==='backpack'?'backpack':'tote');assert.equal(a.bag.handles,p.type==='backpack'?'single':'double');assert.equal(a.carry,p.type==='backpack'?'backpack':'shoulder');const model=createMerchandise(p,{bodyOnly:true});let triangles=0;model.traverse(o=>{if(o.isMesh){assert.ok([...o.geometry.attributes.position.array].every(Number.isFinite));triangles+=o.geometry.attributes.position.count/3;}});assert.ok(triangles>100);}
});
test('earlier creative studies survive stocking, and changing the palette remains a free atomic note',()=>{
 for(const st of shops){const s=fresh(st);s.materialStudies=[{store:st.id,palette:'coast',finish:'smooth',day:1}];const loaded=E.validateImport(JSON.stringify(s));assert.deepEqual(loaded.materialStudies,s.materialStudies);const before=structuredClone(loaded);E.saveMaterialStudy(loaded,{store:st.id,palette:'berry',finish:'textured'});delete loaded.materialStudies;delete before.materialStudies;assert.deepEqual(loaded,before);}
});
test('bag comparison shows formats, source dimensions and policy qualifications without charging',()=>{
 const st=shops[0],s=fresh(st),before=JSON.stringify(s),html=collectionGuideHTML(s,st,st.products.slice(0,2).map(p=>p.id),{E,esc,picture:()=>''});assert.match(html,/Source bag format/);assert.match(html,/source sequence/);assert.match(html,/preview carry/);assert.match(html,/mixed availability and return notices/);assert.match(html,/data-action="studio-open"/);assert.equal(JSON.stringify(s),before);
});
test('every new bag supports preview, checkout, compatible import and a single exact simulated refund',()=>{
 for(const p of E.PRODUCTS.filter(p=>p.collectionReference===44)){const s=fresh(E.storeById(p.store)),size=E.idealSize(s,p),cash=s.cash,stock=E.stock(s,p.id,size);assert.match(E.fit(s,p.id,size).text,/capacity and body fit are not measured/);const bill=E.checkout(s,p.store,[{id:p.id,size}]),loaded=E.validateImport(JSON.stringify(s));assert.equal(E.returnItem(loaded,loaded.purchases.at(-1).id,p.store),bill.total);assert.equal(loaded.cash,cash);assert.equal(E.stock(loaded,p.id,size),stock);assert.throws(()=>E.returnItem(loaded,loaded.purchases.at(-1).id,p.store));}
});
test('new bag interiors keep all comparisons, fittings, counters, resting places and exits reachable',()=>{
 for(const st of shops){const l=interiorPlan(st,E.FLOORPLANS[st.mallId],st.count);for(const p of [{x:600,y:210},{x:600,y:675},l.exit,...Object.values(l.services),...l.stockFixtures.map(r=>r.approach)]){assert.ok(walkable(p,l.nav));const route=freeRoute(l.spawn,p,l.nav);assert.ok(route.length);for(let i=1;i<route.length;i++)assert.ok(clearWalk(route[i-1],route[i],l.nav));}}
});
test('care and packing fixtures stay inside colliders and palette previews allocate no new resources',()=>{
 for(const st of shops){const w=owner(fresh(st));w.layout=interiorPlan(st,E.FLOORPLANS[st.mallId],st.count);buildBagStudio(w,st,brandDesign(st));for(const m of w.scene.children){const b=new T.Box3().setFromObject(m);assert.ok([{x:540,y:125,width:120,height:45},w.layout.rail].some(r=>b.min.x>=r.x-.01&&b.max.x<=r.x+r.width+.01&&b.min.z>=r.y-.01&&b.max.z<=r.y+r.height+.01));}const n=w.resources.size;w.studioPreview={store:st.id,palette:'coast',finish:'smooth'};updateStudioStudy(w);assert.equal(w.canvas.dataset.materialStudy,'coast:smooth');w.studioPreview=null;updateStudioStudy(w);assert.equal(w.resources.size,n);release(w);}
});
test('bag sway is time-based, bounded, frozen while paused and static with reduced motion',()=>{
 const ends=[];for(const hz of [30,60,120]){let v=0;for(let i=0;i<hz;i++)v=smoothBagSway(v,.025,1/hz);ends.push(v);}assert.ok(Math.max(...ends)-Math.min(...ends)<1e-10);assert.equal(smoothBagSway(.02,0,0),.02);assert.equal(smoothBagSway(.02,0,.016,true),0);assert.ok(smoothBagSway(.02,0,.016)>0);let v=.025;for(let i=0;i<120;i++)v=smoothBagSway(v,0,1/60);assert.equal(v,0);assert.ok(Math.abs(smoothBagSway(Infinity,100,.1))<=.04);
});
test('a rendered shoulder bag settles on stopping while staying finite and restoring a static reduced-motion position',()=>{
 const p=shops[0].products.find(p=>p.type==='bag'),w=owner(),g=createShopper(w,'#718676',{}, {bag:p},dressPerson);for(let i=0;i<45;i++)updateOutfitPose(g,{walking:true,distance:i*.25,delta:1/60});const before=g.userData.bagFit.sway;assert.notEqual(before,0);updateOutfitPose(g,{walking:false,delta:1/60});assert.ok(Math.abs(g.userData.bagFit.sway)<Math.abs(before));assert.notEqual(g.userData.bagFit.sway,0);updateOutfitPose(g,{reducedMotion:true,delta:1/60});assert.equal(g.userData.bagFit.sway,0);g.updateMatrixWorld(true);assert.ok(g.userData.bagFit.model.matrixWorld.elements.every(Number.isFinite));release(w);
});
test('47 public photo kiosks retain walkable approaches on all 23 floors',()=>{
 let count=0,floors=0;for(const mall of E.MALLS)for(let floor=0;floor<E.FLOORPLANS[mall.id].levels.length;floor++){floors++;const l=spatialLayout(mall,floor,E.STORES);for(const f of l.environment.fixtures.filter(f=>f.venue==='photo')){count++;assert.ok(walkable(f.approach,l.nav));assert.ok(campusTrip(mall,E.STORES,floor,l.spawn,floor,f.approach).length,mall.id+' '+floor+' '+f.id);}}assert.equal(floors,23);assert.equal(count,47);
});
test('photo detail fits the existing kiosk and follows only the current center portrait without altering the album',()=>{
 const w=owner(),parts=[],b={box(x,y,z,sx,sy,sz){parts.push({x,z,sx,sz})}};buildPhotoKiosk(w,b,100,200,themeFor('beverly'),{x:100,y:240});for(const p of parts)assert.ok(p.x-p.sx/2>=80&&p.x+p.sx/2<=120&&p.z-p.sz/2>=183&&p.z+p.sz/2<=217);assert.equal(w.canvas.dataset.photoKioskMemory,'empty');assert.ok(w.scene.children.some(o=>o.userData.interaction==='photo-album'));w.state.photoAlbum=[{id:'one',mallId:'orange',frame:'rose',pose:'wave'},{id:'two',mallId:w.state.mallId,frame:'sage',pose:'celebrate'}];const before=JSON.stringify(w.state),n=w.resources.size;for(let i=0;i<90;i++)updatePhotoKiosks(w);assert.equal(w.canvas.dataset.photoKioskMemory,'sage:celebrate');assert.equal(latestCenterPortrait(w.state).id,'two');assert.equal(w.resources.size,n);assert.equal(JSON.stringify(w.state),before);release(w);assert.deepEqual(w.photoKiosks,[]);
});

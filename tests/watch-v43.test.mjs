import {test} from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import * as E from '../dist/engine.js';
import * as T from '../dist/vendor/three.module.js';
import {VERIFIED_WATCH_ADDITIONS as additions} from '../dist/store-product-additions-v43.js';
import {isVerifiedWatch,watchGesture,watchFactsHTML} from '../dist/watch-tools.js';
import {createWatchModel} from '../dist/watch-model.js';
import {buildWatchStudio} from '../dist/watch-studio.js';
import {buildSculptureDetails,updateSculptureDetails} from '../dist/sculpture-details.js';
import {collectionGuideHTML,collectionProducts} from '../dist/collection-guide.js';
import {createShopper,applyCharacterPose} from '../dist/character-rig.js';
import {MallWorld3D} from '../dist/world-3d.js';
import {interiorPlan} from '../dist/shop-interiors.js';
import {freeRoute,walkable,clearWalk} from '../dist/free-navigation.js';
import {brandDesign} from '../dist/brand-designs.js';
import {themeFor} from '../dist/mall-design.js';
import {updateStudioStudy} from '../dist/studio-details.js';
const shops=E.STORES.filter(s=>s.collectionEdition===43),evidence=JSON.parse(readFileSync(new URL('../docs/research-v43/catalog-evidence.json',import.meta.url))),hash=b=>createHash('sha256').update(b).digest('hex'),esc=v=>String(v);
const fresh=(st=shops[0])=>Object.assign(E.createState(),{sandbox:true,cash:7500000,mallId:st.mallId,floor:E.storeFloor(E.mallById(st.mallId),st.id)});
function owner(state=fresh()){const w={state,scene:new T.Scene(),resources:new Set(),textures:new Map(),canvas:{dataset:{}}};for(const key of ['mat','mesh','box','cyl','ball'])w[key]=MallWorld3D.prototype[key];return w;}
const release=w=>MallWorld3D.prototype.clearScene.call(w);
test('four exact watch references retain source USD amounts, case specifications and photograph bytes',()=>{
 assert.equal(additions.length,4);for(const p of additions){const r=evidence.products.find(r=>r.id===p.id);assert.equal(p.referenceAmount,r.referenceUSD);assert.equal(p.referenceSKU,r.sku);assert.equal(p.watchProfile.caseMM,41);assert.deepEqual(p.sizes,['41 mm case']);assert.match(p.sizeBasis,/not a wrist-size/);assert.equal(new URL(p.source).hostname,'www.tagheuer.com');assert.equal(hash(readFileSync(new URL('../dist/'+p.photo.path,import.meta.url))),r.runtimePhotoSHA256);assert.equal(p.photo.imageUrl,r.imageUrl);assert.match(watchFactsHTML(p,esc),/not a wrist-size/);}
});
test('three unfinished watch identities gain twelve listings while every prior identity remains intact',()=>{
 assert.equal(shops.length,3);const previous=E.PRODUCTS.filter(p=>!/^v(?:43|44)-real-/.test(p.modelId||''));assert.equal(previous.length,evidence.previousCatalog.count);assert.equal(hash(previous.map(p=>p.id).sort().join('\n')),evidence.previousCatalog.sortedProductIdsSHA256);assert.equal(E.PRODUCTS.filter(p=>p.modelId?.startsWith('v43-real-')).length,12);for(const st of shops){assert.equal(st.businessKind,'jewelry');assert.equal(st.count,4);assert.equal(collectionProducts(st).length,4);for(const p of st.products)assert.equal(p.associationEvidence.kind,'own-brand');}
});
test('watch studies survive old saves and saving a new palette changes only the creative note',()=>{
 for(const st of shops){const s=fresh(st);s.materialStudies=[{store:st.id,palette:'coast',finish:'smooth',day:1}];const loaded=E.validateImport(JSON.stringify(s));assert.deepEqual(loaded.materialStudies,s.materialStudies);assert.equal(loaded.version,6);assert.equal(loaded.mapRevision,10);const before=structuredClone(loaded);E.saveMaterialStudy(loaded,{store:st.id,palette:'berry',finish:'textured'});delete loaded.materialStudies;delete before.materialStudies;assert.deepEqual(loaded,before);}
});
test('watch comparison distinguishes case diameter, wrist fit and qualified reference offers without charging',()=>{
 const st=shops[0],s=fresh(st),before=JSON.stringify(s),html=collectionGuideHTML(s,st,st.products.slice(0,2).map(p=>p.id),{E,esc,picture:()=>''});assert.match(html,/Case diameter/);assert.match(html,/not a wrist-size/);assert.match(html,/preview on wrist/);assert.match(html,/data-action="studio-open"/);assert.equal(JSON.stringify(s),before);
});
test('each watch supports preview, checkout, import and one exact refund without asserting measured wrist fit',()=>{
 for(const p of E.PRODUCTS.filter(isVerifiedWatch)){const s=fresh(E.storeById(p.store)),size=E.idealSize(s,p),cash=s.cash,stock=E.stock(s,p.id,size);assert.match(E.fit(s,p.id,size).text,/bracelet fit is not verified/);const paid=E.checkout(s,p.store,[{id:p.id,size}]),loaded=E.validateImport(JSON.stringify(s));assert.equal(E.returnItem(loaded,loaded.purchases.at(-1).id,p.store),paid.total);assert.equal(loaded.cash,cash);assert.equal(E.stock(loaded,p.id,size),stock);assert.throws(()=>E.returnItem(loaded,loaded.purchases.at(-1).id,p.store));}
});
test('all watch rooms keep reachable collection, fittings, benches, checkout, returns and exit',()=>{
 for(const st of shops){const l=interiorPlan(st,E.FLOORPLANS[st.mallId],st.count);for(const p of [{x:600,y:210},{x:600,y:675},l.exit,...Object.values(l.services),...l.stockFixtures.map(r=>r.approach)]){assert.ok(walkable(p,l.nav));const route=freeRoute(l.spawn,p,l.nav);assert.ok(route.length);for(let i=1;i<route.length;i++)assert.ok(clearWalk(route[i-1],route[i],l.nav));}}
});
test('watch models have finite source-specific geometry and worn watches remain attached throughout smooth inspection',()=>{
 for(const p of shops[0].products){const w=owner(),model=createWatchModel(w,p);assert.equal(model.userData.band,p.watchProfile.band);let meshes=0;model.traverse(o=>{if(o.isMesh){meshes++;assert.ok([...o.geometry.attributes.position.array].every(Number.isFinite));}});assert.ok(meshes>=5&&meshes<=12);const g=createShopper(w,'#718676',{}, {watch:p});assert.equal(g.userData.watch.parent,g.userData.limbs[1].userData.hand);for(let i=0;i<=90;i++){applyCharacterPose(g,{kind:'watchfit',time:i/20,delta:1/20});g.updateMatrixWorld(true);assert.ok(g.userData.watch.matrixWorld.elements.every(Number.isFinite));}applyCharacterPose(g,{kind:'watchfit',reducedMotion:true,time:0});const q=g.userData.limbs.map(l=>l.quaternion.toArray());applyCharacterPose(g,{kind:'watchfit',reducedMotion:true,time:100});assert.deepEqual(g.userData.limbs.map(l=>l.quaternion.toArray()),q);release(w);}
});
test('watch lift holds steady and meets rest with zero speed and acceleration at all joins',()=>{
 const h=.0001;for(const t of [0,1.1,3,4.5]){const a=watchGesture(t-h),b=watchGesture(t),c=watchGesture(t+h);assert.ok(Math.abs((c-a)/(2*h))<.0001);assert.ok(Math.abs((a-2*b+c)/h**2)<.02);}for(let t=0;t<6;t+=.01)assert.ok(watchGesture(t)>=0&&watchGesture(t)<=1);assert.equal(watchGesture(2),1);assert.equal(watchGesture(NaN),0);assert.equal(watchGesture(2,true),0);
});
test('watch fixture detail stays inside colliders and palette updates allocate no resources',()=>{
 for(const st of shops){const w=owner(fresh(st));w.layout=interiorPlan(st,E.FLOORPLANS[st.mallId],st.count);buildWatchStudio(w,st,brandDesign(st));for(const m of w.scene.children){const b=new T.Box3().setFromObject(m);assert.ok([{x:540,y:125,width:120,height:45},w.layout.rail].some(r=>b.min.x>=r.x-.01&&b.max.x<=r.x+r.width+.01&&b.min.z>=r.y-.01&&b.max.z<=r.y+r.height+.01));}const n=w.resources.size;w.studioPreview={store:st.id,palette:'coast',finish:'smooth'};updateStudioStudy(w);assert.equal(w.canvas.dataset.materialStudy,'coast:smooth');w.studioPreview=null;updateStudioStudy(w);assert.equal(w.resources.size,n);release(w);}
});
test('sculpture detail fits the existing footprint and saved sketch markers respect mall and floor',()=>{
 const w=owner(),parts=[],b={box(x,y,z,sx,sy,sz){parts.push({x,z,sx,sz});}};buildSculptureDetails(w,b,100,200,themeFor('century'));assert.ok(parts.length>12);for(const p of parts)assert.ok(p.x-p.sx/2>=85&&p.x+p.sx/2<=115&&p.z-p.sz/2>=185&&p.z+p.sz/2<=215);assert.equal(w.canvas.dataset.sculptureSketch,'unsketched');const m=w.sculptureStudies[0].marker,x=m.position.x;w.state.artNotes=[{mallId:'other',floor:w.state.floor,detail:'color',day:1}];updateSculptureDetails(w);assert.equal(m.position.x,x);w.state.artNotes=[{mallId:w.state.mallId,floor:w.state.floor,detail:'color',day:1}];for(let i=0;i<80;i++)updateSculptureDetails(w);assert.equal(m.position.x,x+1);assert.equal(w.canvas.dataset.sculptureSketch,'color');w.state.floor++;updateSculptureDetails(w);assert.equal(m.position.x,x);release(w);assert.deepEqual(w.sculptureStudies,[]);
});
